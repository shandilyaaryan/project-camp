import { describe, it, expect, beforeAll, afterAll, mock } from "bun:test";

// 1. MOCKS (Must be before app import)
// Mock Mailer to avoid sending real emails
mock.module("../src/utils/mail", () => {
  return {
    sendEmail: () => Promise.resolve({ messageId: "mock-id" }),
  };
});

// Mock Rate Limiter to bypass Redis
mock.module("../src/middlewares/ratelimiter.middleware", () => {
  return {
    rateLimiter: () => (req: any, res: any, next: any) => next(),
  };
});

// Mock Redis connection itself to be safe (optional if RateLimiter is mocked, but good safety)
mock.module("../src/utils/redis", () => {
  return {
    connectRedis: () => Promise.resolve(),
    getRedisClient: () => ({
        incr: () => Promise.resolve(1),
        expire: () => Promise.resolve(),
    }),
  };
});

// 2. ENVIRONMENT VARIABLES
process.env.ACCESS_TOKEN_SECRET = "test_access_secret";
process.env.ACCESS_TOKEN_EXPIRY = "1h";
process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret";
process.env.REFRESH_TOKEN_EXPIRY = "7d";
process.env.CORS_ORIGIN = "http://localhost:5173";

// 3. IMPORTS
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { UserRoleEnum } from "../src/utils";

const TEST_DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/project-camp-test";

// Helper to extract access token from cookies
const getAccessTokenFromCookie = (res: any): string => {
    const cookies = res.headers["set-cookie"];
    if (!cookies) return "";
    const accessTokenCookie = cookies.find((c: string) => c.startsWith("accessToken="));
    if (!accessTokenCookie) return "";
    return accessTokenCookie.split(";")[0].split("=")[1];
};

describe("Project API Integration Tests", () => {
  let userToken: string;
  let userId: string;
  let secondUserToken: string;
  let secondUserId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("Authentication Setup", () => {
    it("should register and login User 1 (Admin/Owner)", async () => {
        // Register
        await request(app).post("/api/v1/auth/register").send({
            email: "user1@example.com",
            username: "user1",
            password: "Password123!"
        }).expect(201);

        // Login
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email: "user1@example.com",
            password: "Password123!"
        }).expect(200);

        userToken = getAccessTokenFromCookie(loginRes);
        userId = loginRes.body.data.user._id;
        
        expect(userToken).toBeDefined();
        expect(userToken.length).toBeGreaterThan(10);
    });

    it("should register and login User 2 (Member)", async () => {
        // Register
        await request(app).post("/api/v1/auth/register").send({
            email: "user2@example.com",
            username: "user2",
            password: "Password123!"
        }).expect(201);

        // Login
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email: "user2@example.com",
            password: "Password123!"
        }).expect(200);

        secondUserToken = getAccessTokenFromCookie(loginRes);
        secondUserId = loginRes.body.data.user._id;

        expect(secondUserToken).toBeDefined();
    });
  });

  describe("POST /api/v1/projects", () => {
    it("should create a new project successfully", async () => {
      const res = await request(app)
        .post("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`) // Use extracted token
        .send({
          name: "Project Alpha",
          description: "Test Description",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Project Alpha");
      expect(res.body.data.owner).toBe(userId);
      expect(res.body.data.members[0].role).toBe(UserRoleEnum.ADMIN);
    });

    it("should fail if name is missing", async () => {
      await request(app)
        .post("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ description: "No name" })
        .expect(400);
    });

    it("should prevent duplicate project names for same owner", async () => {
      await request(app)
        .post("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Project Alpha" }) // Same name as first test
        .expect(409);
    });

    it("should allow same project name for different user", async () => {
        await request(app)
          .post("/api/v1/projects")
          .set("Authorization", `Bearer ${secondUserToken}`)
          .send({ name: "Project Alpha" }) 
          .expect(201);
      });
  });

  describe("GET /api/v1/projects", () => {
    it("should return projects for the logged in user", async () => {
      const res = await request(app)
        .get("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].name).toBe("Project Alpha");
    });

    it("should return empty list if user has no projects", async () => {
        // Register User 3 (Fresh)
        await request(app).post("/api/v1/auth/register").send({
            email: "user3@example.com",
            username: "user3",
            password: "Password123!"
        });
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email: "user3@example.com",
            password: "Password123!"
        });
        const token = getAccessTokenFromCookie(loginRes);

        const res = await request(app)
            .get("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        
        expect(res.body.data).toHaveLength(0);
    });
  });

  describe("Security & Exploits Check", () => {
    it("should prevent NoSQL Injection in project name", async () => {
        // Attempt to pass a MongoDB operator instead of a string
        const maliciousPayload = {
            name: { "$ne": null }, 
            description: "Hacker Project"
        };

        const res = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${userToken}`)
            .send(maliciousPayload);

        // Should fail validation (Zod expects string, not object) or be handled safely
        expect(res.status).toBe(400); 
    });

    it("should block payloads larger than the configured limit (DoS protection)", async () => {
        // App is configured with 16kb limit
        const hugeString = "a".repeat(20000); // ~20kb
        const res = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ 
                name: "Huge Project", 
                description: hugeString 
            });

        // Express body-parser should throw 413 Payload Too Large
        expect(res.status).toBe(413);
    });

    it("should allow XSS payloads but treat them as text (Client-side must sanitize)", async () => {
        // Stored XSS attempt
        const xssPayload = "<script>alert('xss')</script>";
        
        const res = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ 
                name: "XSS Test Project", 
                description: xssPayload 
            });

        expect(res.status).toBe(201);
        expect(res.body.data.description).toBe(xssPayload);
        // Note: The API stores it as is. This test confirms it doesn't crash 
        // or execute it on the server. Frontend must sanitize.
    });
  });
});