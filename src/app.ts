import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter, healthCheckRouter } from "./routers";
import { errmiddleware } from "./middlewares/errors.middleware";

const app = express();

// These are just default config of middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.use(errmiddleware);

export default app;
