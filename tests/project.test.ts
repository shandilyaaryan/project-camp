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

        console.log("LOGIN RESPONSE BODY:", JSON.stringify(loginRes.body, null, 2));

        userToken = getAccessTokenFromCookie(loginRes);
        userId = userId = loginRes.body.data.loggedInUser._id;
        
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

        // Extract tokens from cookies for the second user
        const setCookieHeader = loginRes.headers["set-cookie"];
        const accessTokenCookie = setCookieHeader.find((cookie: string) =>
            cookie.startsWith("accessToken=")
        );

        secondUserToken = accessTokenCookie ? accessTokenCookie.split(";")[0].split("=")[1] : "";
        secondUserId = loginRes.body.data.loggedInUser._id;

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
      expect(res.body.data.project.name).toBe("Project Alpha");
      expect(res.body.data.project.owner).toBe(userId);
      expect(res.body.data.project.members[0].role).toBe(UserRoleEnum.ADMIN);
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

      expect(Array.isArray(res.body.data.projects)).toBe(true);
      expect(res.body.data.projects.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.projects[0].name).toBe("Project Alpha");
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
        
        // Extract tokens from cookies
        const setCookieHeader = loginRes.headers["set-cookie"];
        const accessTokenCookie = setCookieHeader.find((cookie: string) =>
            cookie.startsWith("accessToken=")
        );
        const token = accessTokenCookie ? accessTokenCookie.split(";")[0].split("=")[1] : "";

        const res = await request(app)
            .get("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        
        expect(res.body.data.projects).toHaveLength(0);
    });
  });

  describe("Project Member Management", () => {
    let projectId: string;
    let user3Id: string;
    let user3Token: string;

    beforeAll(async () => {
        // 1. Create a project for User 1 to manage
        const projectRes = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ name: "Collaboration Project", description: "For member tests" })
            .expect(201);
        projectId = projectRes.body.data.project._id;

        // 2. Get User 3 ID (We already registered them in the previous test, just need to login/get ID)
        // Or we can register User 4 for a clean slate. Let's use User 3.
        const loginRes = await request(app).post("/api/v1/auth/login").send({
            email: "user3@example.com",
            password: "Password123!"
        }).expect(200);
        
        user3Id = loginRes.body.data.loggedInUser._id;
        
        // Extract User 3 token
        const setCookieHeader = loginRes.headers["set-cookie"];
        const accessTokenCookie = setCookieHeader.find((cookie: string) => cookie.startsWith("accessToken="));
        user3Token = accessTokenCookie ? accessTokenCookie.split(";")[0].split("=")[1] : "";

        console.log("DEBUG: Owner ID (User1):", userId);
        console.log("DEBUG: Member ID (User3):", user3Id);
    });

    it("should allow Owner (User 1) to add a new member (User 3)", async () => {
        const res = await request(app)
            .post(`/api/v1/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                email: "user3@example.com",
                role: "member"
            })
            .expect(200);
        
        // Verify member was added
        expect(res.body.data.project.members).toHaveLength(2); // Owner + New Member
        const addedMember = res.body.data.project.members.find((m: any) => 
            (m.userId._id || m.userId).toString() === user3Id
        );
        expect(addedMember).toBeDefined();
        expect(addedMember.role).toBe("member");
    });

    it("should prevent adding the same member twice", async () => {
        await request(app)
            .post(`/api/v1/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                email: "user3@example.com",
                role: "member"
            })
            .expect(409); // Conflict
    });

    it("should prevent non-owners (User 2) from adding members", async () => {
        // User 2 tries to add User 3 to User 1's project
        await request(app)
            .post(`/api/v1/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${secondUserToken}`)
            .send({
                email: "user3@example.com",
                role: "member"
            })
            .expect(403); // Forbidden
    });

    it("should allow members to list project members", async () => {
        // User 3 is now a member, so they should be able to see the list
        const res = await request(app)
            .get(`/api/v1/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${user3Token}`)
            .expect(200);
        
        expect(res.body.data.members).toHaveLength(2);
        // Ensure population worked (username should be present)
        expect(res.body.data.members[0].userId.username).toBeDefined();
    });

    it("should allow Owner to update a member's role", async () => {
        const res = await request(app)
            .put(`/api/v1/projects/${projectId}/members/${user3Id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ role: "project_admin" })
            .expect(200);
        
        // Verify role update logic isn't returning project but message, or project?
        // Checking controller: it returns { message: "Role updated successfully" }
        // So we can't check body.data.project.members here directly unless we fetch it again or if controller returns it.
        // UpdateRole controller returns just message. Let's fetch to verify.
        
        const listRes = await request(app)
            .get(`/api/v1/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${userToken}`);
            
        const updatedMember = listRes.body.data.members.find((m: any) => m.userId._id === user3Id);
        expect(updatedMember.role).toBe("project_admin");
    });

    it("should prevent non-owners from updating roles", async () => {
        await request(app)
            .put(`/api/v1/projects/${projectId}/members/${user3Id}`)
            .set("Authorization", `Bearer ${secondUserToken}`) // User 2 is unrelated
            .send({ role: "member" })
            .expect(404); // Not Found (because of owner check in query)
    });

    it("should allow Owner to remove a member", async () => {
        await request(app)
            .delete(`/api/v1/projects/${projectId}/members/${user3Id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
            
        // Verify removal
        const listRes = await request(app)
            .get(`/api/v1/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${userToken}`);
            
        expect(listRes.body.data.members).toHaveLength(1); // Only owner left
    });

    it("should prevent removing the owner (Self-removal/Owner removal)", async () => {
        await request(app)
            .delete(`/api/v1/projects/${projectId}/members/${userId}`) // Trying to remove Owner (User 1)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(403);
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
        expect(res.body.data.project.description).toBe(xssPayload);
        // Note: The API stores it as is. This test confirms it doesn't crash 
        // or execute it on the server. Frontend must sanitize.
    });
  });
});