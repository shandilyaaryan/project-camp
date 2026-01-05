<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/project-camp-light.svg">
  <source media="(prefers-color-scheme: light)" srcset="./public/project-camp-dark.svg">
  <img alt="Project Camp Logo" src="./public/project-camp-light.svg" width="700">
</picture>

<br />
<br />

**A collaborative project management backend built for modern teams**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-black?style=flat-square&logo=bun)](https://bun.sh/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache%20%7C%20Queue-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Management-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-0db7ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Testing](#-testing) • [Contributing](#-contributing)

</div>

---

## 🚀 Overview

Project Camp is a production-ready backend API for collaborative project management. Built with **TypeScript** and powered by **Bun**, it offers a robust foundation for team collaboration with enterprise-grade authentication, fine-grained role-based access control (RBAC), and a comprehensive project & member management system. The entire application is containerized with Docker for seamless deployment.

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** (Access + Refresh tokens) with `httpOnly` cookies
- Secure password hashing with `bcrypt`
- Email verification flow with temporary tokens
- Password reset functionality
- Role-based access control (RBAC) via middleware
- **API Rate Limiting** using Redis
- Input validation with Zod schemas
- Protection against common web exploits (NoSQL Injection, XSS, DoS)

### 📊 Project Management
- **Full CRUD operations** for projects (Create, View, Update, Delete)
- **Comprehensive Team Member Management:** Add, List, Update Roles, Remove members within a project.
- Granular role assignments: `admin`, `project_admin`, `member`
- Project notes and documentation (Planned)

### 🎯 Task Management
- **Full CRUD operations for Tasks:** Create, List, Get Details, Update, Delete tasks.
- **Task Assignment:** Assign tasks to team members.
- **Workflow States:** `Todo` → `In Progress` → `Done`.
- 🚧 **Subtask Management:** Implement nested subtasks for more granular task breakdown.
- 🚧 **File Attachments:** Integrate file upload directly to Cloudinary for tasks.

### 📧 Email System
- Beautiful HTML email templates with Mailgen
- SMTP delivery via Nodemailer
- Automated verification and reset emails
- Customizable branding

### 🧠 Core Technologies:
- **Runtime & Package Manager:** Bun 1.x
- **Framework:** Express.js 4.x
- **Language:** TypeScript 5.0
- **Database:** MongoDB with Mongoose ODM
- **Cache/Queue:** Redis
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod schemas
- **File Uploads:** Multer, Cloudinary, Multer-Storage-Cloudinary
- **Containerization:** Docker, Docker Compose
- **Testing:** Bun's built-in test runner, Supertest
- **CI/CD:** GitHub Actions

## 📦 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) (recommended)
- Alternatively: [Bun](https://bun.sh/docs/installation), MongoDB instance, Redis instance

### Installation (Recommended: Docker Compose)

The easiest way to get started is using Docker Compose, which will spin up the API, MongoDB, and Redis for you.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/project-camp.git
    cd project-camp
    ```
2.  **Configure environment variables:**
    *   Create a `.env` file in the root directory: `cp .env.example .env`
    *   **Edit `.env`** with your actual secrets and configurations (especially `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and Mailtrap credentials, and **Cloudinary credentials**).
3.  **Build and run the services:**
    ```bash
    docker-compose up --build
    ```
    The API will be accessible at `http://localhost:8000`. MongoDB and Redis will also be running in their respective containers.

### Installation (Manual - Bun)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/project-camp.git
    cd project-camp
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
3.  **Configure environment variables:**
    *   Create a `.env` file: `cp .env.example .env`
    *   **Edit `.env`** with your configuration, ensuring `MONGODB_URI` points to your local or remote MongoDB instance and `REDIS_HOST`/`REDIS_PORT` point to your Redis instance.
4.  **Start development server:**
    ```bash
    bun run dev
    ```
    The server will start at `http://localhost:8000` (or your configured `PORT`).

## 📁 Project Structure

```
project-camp/
├── src/
│   ├── controllers/         # Handles request logic (Auth, Health, Projects, Tasks, Notes)
│   │   ├── auth/            # Authentication controllers
│   │   ├── projects/        # Project and Member management controllers
│   │   └── tasks/           # Task management controllers
│   │   └── healthCheck.controller.ts
│   ├── models/              # Mongoose schemas and models (User, Project, Task, Note)
│   │   ├── user.model.ts
│   │   ├── project.model.ts
│   │   └── task.model.ts
│   ├── middlewares/         # Express middlewares (Auth, Validation, Rate Limiting, File Uploads)
│   │   └── upload.middleware.ts # Multer/Cloudinary upload middleware
│   ├── routers/             # API routes (Auth, Health, Projects, Tasks)
│   │   ├── auth.route.ts
│   │   ├── healthcheck.route.ts
│   │   ├── project.route.ts
│   │   └── task.route.ts
│   ├── validators/          # Zod schemas for input validation
│   │   ├── auth/
│   │   ├── projects/
│   │   └── tasks/
│   ├── utils/               # Helper utilities (API Errors, Responses, Constants, Mail, Redis, Cloudinary)
│   │   └── cloudinary.ts    # Cloudinary configuration and upload utility
│   ├── db/                  # Database connection
│   │   └── db.ts
│   ├── app.ts               # Express application setup
│   └── index.ts             # Application entry point
├── public/                  # Static assets
├── .github/                 # GitHub Actions CI/CD workflows
├── Dockerfile               # Multi-stage Docker build for the API
├── docker-compose.yaml      # Orchestrates API, MongoDB, Redis
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
├── bun.lock                 # Bun lockfile
└── README.md                # Project documentation
```

## 🔗 API Documentation

### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user | ❌ |
| `GET` | `/verify-email/:verificationToken` | Verify user's email address | ❌ |
| `POST` | `/login` | User authentication | ❌ |
| `POST` | `/logout` | User logout | ✅ |
| `GET` | `/current-user` | Get current user's details | ✅ |
| `POST` | `/change-password` | Change user password | ✅ |
| `POST` | `/refresh-token` | Refresh access token | ✅ |
| `POST` | `/forgot-password` | Request password reset email | ❌ |
| `POST` | `/reset-password/:resetToken` | Reset forgotten password | ❌ |
| `POST` | `/resend-email-verification` | Resend email verification | ✅ |

### Project Endpoints (`/api/v1/projects`)

| Method   | Endpoint                   | Description                       | Auth Required |
|----------|----------------------------|-----------------------------------|---------------|
| `GET`    | `/`                        | List all projects current user is owner or member of | ✅         |
| `POST`   | `/`                        | Create a new project              | ✅            |
| `GET`    | `/:projectId`              | Get details of a specific project | ✅            |
| `PUT`    | `/:projectId`              | Update project details (Owner only) | ✅          |
| `DELETE` | `/:projectId`              | Delete a project (Owner only)     | ✅            |
| `POST`   | `/:projectId/members`      | Add a member to the project (Owner only) | ✅     |
| `GET`    | `/:projectId/members`      | List all members of a project     | ✅            |
| `PUT`    | `/:projectId/members/:userId` | Update a member's role in the project (Owner only) | ✅ |
| `DELETE` | `/:projectId/members/:userId` | Remove a member from the project (Owner only) | ✅ |

### Task Endpoints (`/api/v1/projects/:projectId/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/` | Create a new task within a project | ✅ |
| `GET` | `/` | List all tasks for a project | ✅ |
| `GET` | `/:taskId` | Get details of a specific task | ✅ |
| `PUT` | `/:taskId` | Update task details (status, assignee, etc.) | ✅ |
| `DELETE` | `/:taskId` | Delete a task | ✅ |

> 📘 **Full API documentation** coming soon with Swagger/OpenAPI specs

## 🧪 Testing

The project includes a comprehensive integration test suite using Bun's built-in test runner and Supertest.

### Run Tests

```bash
bun test
```

### Continuous Integration

A GitHub Actions workflow (`.github/workflows/tests.yaml`) is configured to automatically run tests on every `push` and `pull_request` to the `main` branch. This ensures code quality and prevents regressions.

## 🚀 Deployment

### Deploy with Docker Compose

1.  Ensure you have Docker and Docker Compose installed.
2.  Make sure your `.env` file is configured with production-ready secrets and settings.
3.  Run the following command in your project root:
    ```bash
    docker-compose up -d --build
    ```
    This will build your application image and start the API, MongoDB, and Redis containers in detached mode.

### Manual Deployment

For manual deployment without Docker, ensure you have Bun installed and MongoDB/Redis running, then use:

```bash
# Build the application
bun run build

# Start the production server
bun start
```

> **📝 Note:** Remember to set all environment variables on your deployment platform.

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 Roadmap

- [x] **Core Backend Architecture Setup**
- [x] **User Authentication & Authorization**
- [x] **Project Management Module (Full CRUD & Member Management)**
    - [x] Create, List, Get Details, Update, Delete Projects
    - [x] Add, List, Update Role, Remove Project Members
- [x] **Task Management Module (CRUD Operations Complete)**
    - [x] Create, List, Get Details, Update, Delete Tasks
    - [ ] Implement Subtask Management
    - [ ] Task Assignment (Partially done with Create/Update)
    - [ ] File Attachments for Tasks
- [ ] **Project Notes Module**
- [x] **API Rate Limiting**
- [x] **Comprehensive Integration Test Coverage**
- [x] **Docker Containerization**
- [x] **CI/CD Pipeline Setup (GitHub Actions)**
- [ ] Real-time notifications with WebSockets
- [ ] File storage integration (AWS S3, Cloudinary)
- [ ] Advanced search and filtering
- [ ] Activity timeline and audit logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Basecamp](https://basecamp.com/)
- Built with [Bun](https://bun.sh/)
- Email templates powered by [Mailgen](https://github.com/eladnava/mailgen)

## 📞 Contact & Support

- **GitHub Issues:** [Report a bug or request a feature](https://github.com/shandilyaaryan/project-camp/issues)
- **Email:** aryanshandilya10@gmail.com
- **Twitter:** [@Aryanshandilya](https://twitter.com/shandilyaaryan7)

---

<div align="center">

**[⬆ Back to Top](#project-camp)**

Made with ❤️ by [Aryan Shandilya](https://github.com/shandilyaaryan)

</div>
