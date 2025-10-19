





📋 Table of Contents
	1.	🤖 Introduction
	2.	⚙️ Tech Stack
	3.	🔋 Features
	4.	⚡ Project Structure
	5.	🚀 Quick Start
	6.	📡 API Endpoints
	7.	🧩 Example Data
	8.	🔗 Resources & Links

⸻

🤖 Introduction

The Subscription Tracker API is a production-ready backend system designed to manage user subscriptions — handling authentication, recurring payments, email reminders, and workflow automation.

It includes advanced integrations such as:
	•	Automated email reminders via Upstash Workflows
	•	Arcjet protection for rate limiting and bot detection
	•	JWT Authentication for secure access
	•	Scalable architecture built with Express.js and MongoDB

This project is perfect for anyone building a real-world SaaS or financial tracking application.

⸻

⚙️ Tech Stack
	•	Node.js – JavaScript runtime environment
	•	Express.js – Backend framework for REST APIs
	•	MongoDB + Mongoose – Database and ODM
	•	Arcjet – Security & rate limiting
	•	Upstash QStash – Workflow & reminder automation
	•	Nodemailer – Email notifications
	•	JWT – Secure user authentication

⸻

🔋 Features

✅ JWT Authentication – Secure login, registration, and token-based protection
✅ Subscription Management – Add, update, and track subscriptions
✅ Email Reminders – Automatically send renewal reminders
✅ Workflow Automation – Smart scheduling using Upstash QStash
✅ Rate Limiting – Protect routes with Arcjet middleware
✅ Error Handling – Centralized and clean error management
✅ Logging & Monitoring – Built-in structured logs for debugging

⸻

⚡ Project Structure

subscription-tracker/
│
├── app.js                     # Main server entry point
├── config/
│   └── env.js                 # Environment variables configuration
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js             # MongoDB connection
├── middlewares/
│   ├── arcjet.middlewares.js
│   └── error.middlewares.js
├── models/
│   ├── user.model.js
│   └── subscription.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
└── utils/
    └── send-email.js          # Nodemailer utility


⸻

🚀 Quick Start

Prerequisites

Make sure you have installed:
	•	Node.js
	•	MongoDB
	•	npm
	•	Git

Installation

git clone https://github.com/yourusername/subscription-tracker.git
cd subscription-tracker
npm install

Environment Variables

Create a .env.local file in the project root:

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

Run the Project

npm run dev

Server starts on:
👉 http://localhost:5500

⸻

📡 API Endpoints 

🧍 User Routes (/api/v1/users)

Method	Endpoint	Description
GET	/api/v1/users	Get all users (admin only)
GET	/api/v1/users/:id	Get a single user by ID
PUT	/api/v1/users/:id	Update user details
DELETE	/api/v1/users/:id	Delete a user account


⸻

🔐 Auth Routes (/api/v1/auth)

Method	Endpoint	Description
POST	/api/v1/auth/sign-up	Register a new user
POST	/api/v1/auth/siing-in	Login and receive a JWT token
POST	/api/v1/auth/sign-out	Logout user and clear cookies


📘 Example Request

POST /api/v1/auth/sign-up
{
  "name": "Zaissov Mendes",
  "email": "zaissov@icloud.com",
  "password": "...."
}


⸻

💳 Subscription Routes (/api/v1/subscriptions)

Method	Endpoint	Description
POST	/api/v1/subscriptions	Create a new subscription
GET	/api/v1/subscriptions	Get all subscriptions for the user
GET	/api/v1/subscriptions/:id	Get a subscription by ID
PUT	/api/v1/subscriptions/:id	Update a subscription
DELETE	/api/v1/subscriptions/:id	Delete a subscription

📘 Example Request

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

⚙️ Workflow Routes (/api/v1/workflows)

Method	Endpoint	Description
POST	/api/v1/workflows/reminders	Trigger email reminder workflow manually
GET	/api/v1/workflows/status/:id	Check workflow execution status


⸻

🔒 Authentication Header

All protected routes require JWT authentication.
Add this header to your requests:

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
	•	Arcjet → https://launch.arcjet.com/4g2R2e4
	•	Upstash → https://bit.ly/42ealiN
	•	Hostinger → https://hostinger.com/mastery10
	•	WebStorm → https://jb.gg/GetWebStormFree

⸻
