

<div align="center">
  <br />
  <img src="https://i.ibb.co/xtTbHkfs/Readme-Thumbnail.png" alt="Subscription Tracker API Banner" width="100%">
  <br />
  
  <div>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  </div>

  <h2 align="center">💸 Subscription Tracker API</h2>
  <p align="center">
    Manage, track, and automate subscription payments with smart workflows, email reminders, and secure authentication.
  </p>

  <p align="center">
    <a href="#-quick-start"><strong>Get Started »</strong></a> •
    <a href="#-api-endpoints"><strong>API Docs</strong></a> •
    <a href="#-features"><strong>Features</strong></a> •
    <a href="#-resources--links"><strong>Resources</strong></a>
  </p>

  <p align="center">
    <a href="https://github.com/yourusername/subscription-tracker/stargazers">
      <img src="https://img.shields.io/github/stars/yourusername/subscription-tracker?style=social" alt="Stars">
    </a>
    <a href="https://github.com/yourusername/subscription-tracker/fork">
      <img src="https://img.shields.io/github/forks/yourusername/subscription-tracker?style=social" alt="Forks">
    </a>
    <a href="https://github.com/yourusername/subscription-tracker/issues">
      <img src="https://img.shields.io/github/issues/yourusername/subscription-tracker?style=social" alt="Issues">
    </a>
  </p>
</div>

---

## 📋 Table of Contents
1. 🤖 [Introduction](#-introduction)
2. ⚙️ [Tech Stack](#️-tech-stack)
3. 🔋 [Features](#-features)
4. ⚡ [Project Structure](#-project-structure)
5. 🚀 [Quick Start](#-quick-start)
6. 📡 [API Endpoints](#-api-endpoints)
7. 🧩 [Example Data](#-example-data)
8. 🔗 [Resources & Links](#-resources--links)
9. 🤝 [Contributing](#-contributing)
10. 🧑‍💻 [Author](#-author)
11. 📄 [License](#-license)

---

## 🤖 Introduction

The **Subscription Tracker API** is a full-featured backend system that helps you **manage user subscriptions**, automate **renewal reminders**, and ensure **secure authentication** using modern cloud tools.

Key integrations:
- 📧 Email automation with **Upstash Workflows**
- 🧠 Rate limiting & bot detection via **Arcjet**
- 🔐 JWT-based authentication
- ⚙️ Scalable and modular Express.js architecture with **MongoDB**

> Perfect for SaaS, finance dashboards, and automation tools.

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| 🟢 **Node.js** | JavaScript runtime |
| ⚫ **Express.js** | Backend REST API framework |
| 🟢 **MongoDB + Mongoose** | Database & schema modeling |
| 🧩 **Arcjet** | Security and rate limiting |
| 🕓 **Upstash QStash** | Workflow automation & reminders |
| 📧 **Nodemailer** | Email notifications |
| 🔑 **JWT** | Secure user authentication |

---

## 🔋 Features

✅ **JWT Authentication** – Register, login, logout securely  
✅ **Subscription Management** – Add, update, and track subscriptions  
✅ **Email Reminders** – Automatic renewal notifications  
✅ **Workflow Automation** – Smart background scheduling  
✅ **Rate Limiting** – Arcjet-powered route protection  
✅ **Error Handling** – Centralized global middleware  
✅ **Logging & Monitoring** – Developer-friendly debug logs  

---



## ⚡ Project Structure

<div align="left">


📦 subscription-tracker/
│
├── 🧠 app.js  
│   └─ Main server entry point – initializes Express app and routes.
│
├── ⚙️ config/
│   └─ env.js — Environment configuration (PORT, DB, JWT, etc.)
│
├── 🎮 controllers/
│   ├─ auth.controller.js — Handles signup, login, logout, and JWT tokens.
│   ├─ subscription.controller.js — CRUD logic for subscriptions.
│   ├─ user.controller.js — User profile and data management.
│   └─ workflow.controller.js — Automates reminders and Upstash workflows.
│
├── 🗄️ database/
│   └─ mongodb.js — MongoDB connection via Mongoose.
│
├── 🧩 middlewares/
│   ├─ arcjet.middlewares.js — Rate limiting & bot protection (Arcjet).
│   └─ error.middlewares.js — Centralized error handler.
│
├── 🧬 models/
│   ├─ user.model.js — Defines user schema & authentication logic.
│   └─ subscription.model.js — Defines subscription schema (price, frequency, etc.)
│
├── 🌐 routes/
│   ├─ auth.routes.js — Auth endpoints (register, login, logout).
│   ├─ subscription.routes.js — Subscription management endpoints.
│   ├─ user.routes.js — User management routes.
│   └─ workflow.routes.js — Workflow and reminder routes.
│
└── 🛠️ utils/
    └─ send-email.js — Email utility using Nodemailer.

</div>



⸻

💡 Visual Overview

Folder	Purpose	Icon
app.js	Main server entry point	🧠
config/	Environment configuration (e.g. .env, constants)	⚙️
controllers/	Core business logic and CRUD operations	🎮
database/	MongoDB connection setup	🗄️
middlewares/	Request validation, rate limiting, and error handling	🧩
models/	Mongoose schemas for data structure	🧬
routes/	API route definitions	🌐
utils/	Helper utilities (e.g., email sender)	🛠️


⸻

✨ Tips for Readability
	•	Use monospace blocks (```) to preserve structure.
	•	Emojis improve quick scanning for developers on GitHub.
	•	The table reinforces clarity and readability for new contributors.

⸻



## 🚀 Quick Start

### 🧩 Prerequisites
Ensure you have:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### ⚙️ Installation

```bash
git clone https://github.com/yourusername/subscription-tracker.git
cd subscription-tracker
npm install

🔐 Environment Variables

Create a .env.local file in the root directory:

# Server
PORT=5500
SERVER_URL=http://localhost:5500
NODE_ENV=development

# MongoDB
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/subscriptions

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

# Arcjet
ARCJET_KEY=
ARCJET_ENV=development

# Upstash
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=

# Nodemailer
EMAIL_PASSWORD=

▶️ Run the Server

npm run dev

Server available at:
👉 http://localhost:5500

⸻

📡 API Endpoints

👤 User Routes /api/v1/users

Method	Endpoint	Description
GET	/api/v1/users	Get all users (admin only)
GET	/api/v1/users/:id	Get a specific user
PUT	/api/v1/users/:id	Update user details
DELETE	/api/v1/users/:id	Delete a user


⸻

🔐 Auth Routes /api/v1/auth

Method	Endpoint	Description
POST	/api/v1/auth/sign-up	Register new user
POST	/api/v1/auth/sign-in	Login and receive JWT token
POST	/api/v1/auth/sign-out	Logout user and clear cookies

Example Request:

POST /api/v1/auth/sign-up
{
  "name": "Zaissov Mendes",
  "email": "zaissov@icloud.com",
  "password": "zaissov"
}


⸻

💳 Subscription Routes /api/v1/subscriptions

Method	Endpoint	Description
POST	/api/v1/subscriptions	Create a new subscription
GET	/api/v1/subscriptions	Get all subscriptions
GET	/api/v1/subscriptions/:id	Get subscription by ID
PUT	/api/v1/subscriptions/:id	Update subscription
DELETE	/api/v1/subscriptions/:id	Delete subscription

Example Request:

POST /api/v1/subscriptions
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2025-02-01T00:00:00.000Z",
  "user": "68daa946f9035b035ff8730a"
}


⸻

⚙️ Workflow Routes /api/v1/workflows

Method	Endpoint	Description
POST	/api/v1/workflows/reminders	Trigger email reminder workflow manually
GET	/api/v1/workflows/status/:id	Check workflow execution status


⸻

🔒 Auth Header

All protected routes require JWT:

Authorization: Bearer <your_jwt_token>


⸻

🧩 Example Data

{
  "name": "Spotify Premium",
  "price": 9.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Visa",
  "status": "active",
  "startDate": "2025-03-01T00:00:00.000Z",
  "renewalDate": "2025-04-01T00:00:00.000Z",
  "user": "68daa946f9035b035ff8730a"
}


⸻

🔗 Resources & Links
	•	🌐 Arcjet
	•	☁️ Upstash
	•	💻 Hostinger
	•	🧰 WebStorm

⸻

🤝 Contributing

Contributions, issues, and feature requests are always welcome!
Feel free to open a pull request or start a discussion.

# Fork the project
git fork https://github.com/zaissov/subscription-tracker.git

# Create a new branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Add new feature"

# Push branch
git push origin feature/your-feature


⸻

🧑‍💻 Author

Zaissov Mendes
💼 GitHub
📧 zaissov@yahoo.com


⸻








