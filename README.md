<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="public/project-camp-dark.svg">
    <source media="(prefers-color-scheme: dark)" srcset="public/project-camp-light.svg">
    <img alt="Project Camp Logo" src="public/project-camp-light.svg" width="640" />
  </picture>
</p>

<p align="center">
  <img width="160" src="data:image/svg+xml;utf8,<svg width='180' height='40' viewBox='0 0 400 90' xmlns='http://www.w3.org/2000/svg'><rect rx='10' width='90' height='90' fill='%233B82F6'/><path d='M25 55 L45 25 L65 55 Z' fill='white'/><text x='110' y='58' font-family='Inter, sans-serif' font-size='42' fill='%23111'>Project Camp</text></svg>' />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

# Project Camp — Backend API

*A collaborative project management backend*

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<p align="center">
  A modern backend API built with TypeScript, JWT Auth, RBAC, email verification,
  and scalable architecture inspired by Basecamp.
</p>

---

## ✨ Features

### 🔐 Authentication & Security

* JWT Access + Refresh tokens
* Password hashing (bcrypt)
* Email verification flow
* Forgot/Reset password
* Temporary token system (SHA-256 hashed)
* Role-based access control (Admin, Project Admin, Member)

### 📁 Project Management

* CRUD for projects
* Project member management
* Role assignments per project
* Project notes system

### 📌 Tasks & Subtasks

* Task CRUD
* Subtask management
* Status workflow (Todo → In Progress → Done)
* File attachments
* Assign tasks to members

### 📨 Email System

* Mailgen templates
* Nodemailer SMTP sending
* Verification + reset templates

### 🧱 Tech Stack

* Node.js + Express
* TypeScript
* MongoDB + Mongoose
* Mailgen + Nodemailer
* Zod (optional) for schema validation

---

## 📦 Folder Structure

```
project-camp-backend/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── middlewares/
│   └── config/
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file with:

```
MONGODB_URI=
PORT=5000

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=7d

MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=

FRONTEND_URL=https://project-camp.vercel.app
```

---

## 🛠️ Installation & Setup

### Using Bun

```
bun install
bun run dev
```

### Using npm

```
npm install
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🔗 API Overview

### Auth Endpoints

| Method | Route                                | Description        |
| ------ | ------------------------------------ | ------------------ |
| POST   | `/api/v1/auth/register`              | Register new user  |
| GET    | `/api/v1/auth/verify-email/:token`   | Verify email token |
| POST   | `/api/v1/auth/login`                 | Login              |
| POST   | `/api/v1/auth/logout`                | Logout             |
| POST   | `/api/v1/auth/refresh-token`         | Refresh token      |
| POST   | `/api/v1/auth/forgot-password`       | Send reset email   |
| POST   | `/api/v1/auth/reset-password/:token` | Reset password     |

### Project Routes

| Method | Route                         | Description        |
| ------ | ----------------------------- | ------------------ |
| GET    | `/api/v1/projects`            | List user projects |
| POST   | `/api/v1/projects`            | Create project     |
| PUT    | `/api/v1/projects/:projectId` | Update project     |
| DELETE | `/api/v1/projects/:projectId` | Delete project     |

*(Similar tables can be added for tasks, subtasks & notes.)*

---

## ⭐ Scripts

```
bun run dev  # Start dev server
bun run build
bun start
```

---

## 🤝 Contributing

PRs are welcome! Fork → Branch → PR.

---

## 📜 License

MIT License

---

## ⭐ Support

If you found this useful, please star the repo — it helps a lot!
