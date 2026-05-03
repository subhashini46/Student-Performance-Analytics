# 📊 Student Performance Analytics

A full-stack web application for tracking student academic performance — including marks, GPA, subject trends, weak area detection, fail-risk prediction, and personalized study recommendations.

---

## ✨ Features

- **Authentication** — Sign up, sign in, and protected dashboard access
- **Per-user data** — Each account has its own isolated performance records
- **Marks tracking** — Subject-wise mark entry and management
- **GPA & weighted average** — Automatic calculation based on entered marks
- **Performance charts** — Trend lines and subject comparison visualizations
- **Weak subject detection** — Automatically flags subjects below threshold
- **Fail-risk prediction** — "May fail this subject" signals based on current data
- **Study recommendations** — Personalized suggestions based on marks, trends, and attendance
- **Profile controls** — Configure current term, attendance percentage, and target GPA

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React + Vite, React Router, Recharts, Lucide React |
| Backend   | Node.js + Express                   |
| Database  | MongoDB + Mongoose                  |

---

## 📁 Project Structure

```
Student-Performance-Analytics/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # API request helpers
│   │   ├── context/         # Auth context (global state)
│   │   ├── data/            # Analytics & GPA calculations
│   │   ├── pages/           # Auth and dashboard pages
│   │   └── styles.css
│   ├── vercel.json          # Vercel SPA routing config
│   └── package.json
├── server/                  # Express backend
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Helper utilities
│   └── package.json
├── render.yaml              # Render deployment blueprint
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- MongoDB running locally

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Start the Backend

```bash
npm run dev:server
```

### 3. Start the Frontend

In a separate terminal:

```bash
npm run dev:client
```

### 4. Open in Browser

```
http://127.0.0.1:5173
```

---

## 🔧 Environment Configuration

The server defaults to a local MongoDB instance:

```
mongodb://127.0.0.1:27017/student_performance_analytics
```

To customize, create a `server/.env` file:

```env
PORT=5000
CLIENT_URL=http://127.0.0.1:5173
CLIENT_URLS=http://127.0.0.1:5173,http://localhost:5173
ALLOW_VERCEL_PREVIEWS=false
TOKEN_SECRET=replace_this_with_a_long_random_secret
MONGO_URI=mongodb://127.0.0.1:27017/student_performance_analytics
```

---

## 🗄️ Viewing Data with MongoDB Compass

1. Ensure MongoDB is running on your machine
2. Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`
3. Start the app and sign up
4. You'll see a `student_performance_analytics` database with `users` and `performances` collections

---

## ☁️ Deployment

### Backend — Deploy on Render

**Option A: Using `render.yaml` (Recommended)**

1. Push the repo to GitHub
2. In Render, create a new **Blueprint** from the repo
3. Render reads `render.yaml` and creates the web service automatically
4. Set the following environment variables when prompted:

| Variable       | Value                                              |
|----------------|----------------------------------------------------|
| `MONGO_URI`    | Your MongoDB Atlas connection string               |
| `CLIENT_URL`   | Your Vercel app URL (e.g., `https://your-app.vercel.app`) |
| `TOKEN_SECRET` | A long random secret (or let Render generate one)  |

**Option B: Manual Render Web Service**

```
Root Directory:   (leave blank)
Runtime:          Node
Build Command:    cd server && npm install
Start Command:    cd server && npm start
Health Check:     /health
```

Additional environment variable for manual setup:

```env
ALLOW_VERCEL_PREVIEWS=true
```

> ⚠️ MongoDB Compass is local only — use **MongoDB Atlas** for production.

---

### Frontend — Deploy on Vercel

Create a Vercel project from the same GitHub repo with these settings:

```
Root Directory:    client
Framework Preset:  Vite
Build Command:     npm run build
Output Directory:  dist
```

Set the environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

> After updating environment variables on either platform, redeploy the affected service.

---

## 📜 License

This project is open source. Feel free to fork and build upon it.
