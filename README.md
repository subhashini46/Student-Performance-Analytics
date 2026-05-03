# 📊 Student Performance Analytics

A full-stack web application that helps students track their academic performance — including subject-wise marks, GPA calculation, performance trends, weak subject detection, fail-risk prediction, and personalized study recommendations.

---

## 🚀 Features

- 🔐 **User Authentication** — Secure sign up and sign in with protected routes
- 👤 **Per-user Data** — Each account maintains its own isolated performance records
- 📝 **Subject-wise Marks Tracking** — Add and manage marks for each subject
- 🎓 **GPA & Weighted Average** — Auto-calculated based on entered marks
- 📈 **Performance Trend Charts** — Visualize progress over time using Recharts
- 📊 **Subject Comparison** — Compare performance across all subjects
- ⚠️ **Weak Subject Detection** — Automatically flags underperforming subjects
- 🚨 **Fail-Risk Prediction** — Highlights subjects where the student may be at risk
- 💡 **Study Recommendations** — Suggestions based on marks, trends, and attendance
- ⚙️ **Profile Settings** — Configure current term, attendance percentage, and target GPA

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- React Router
- Recharts (charts & visualizations)
- Lucide React (icons)

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

---

## 📁 Project Structure

```
Student-Performance-Analytics/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/               # Axios / fetch API helpers
│   │   ├── context/           # Global Auth context
│   │   ├── data/              # Analytics & GPA calculation logic
│   │   ├── pages/             # Auth pages & Dashboard
│   │   └── styles.css
│   ├── vercel.json            # SPA routing config (for future deployment)
│   └── package.json
├── server/                    # Express backend
│   ├── config/                # MongoDB connection setup
│   ├── controllers/           # Business logic handlers
│   ├── middleware/            # Auth middleware (JWT)
│   ├── models/                # Mongoose schemas (User, Performance)
│   ├── routes/                # API route definitions
│   ├── utils/                 # Helper functions
│   └── package.json
├── render.yaml                # Render deployment config (for future use)
├── .gitignore
└── package.json               # Root scripts to run both client & server
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) `^20.19.0` or `>=22.12.0`
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- [MongoDB Compass](https://www.mongodb.com/products/compass) *(optional — for viewing data visually)*

---

## 🏃 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/subhashini46/Student-Performance-Analytics.git
cd Student-Performance-Analytics
```

### 2. Install All Dependencies

```bash
npm run install:all
```

This installs packages for both `client/` and `server/`.

### 3. Configure Environment Variables

Create a file at `server/.env` with the following:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_performance_analytics
TOKEN_SECRET=your_secret_key_here
CLIENT_URL=http://127.0.0.1:5173
CLIENT_URLS=http://127.0.0.1:5173,http://localhost:5173
ALLOW_VERCEL_PREVIEWS=false
```

> Replace `your_secret_key_here` with any long random string for JWT signing.

### 4. Start the Backend

```bash
npm run dev:server
```

The API will run at `http://localhost:5000`.

### 5. Start the Frontend

Open a **new terminal** and run:

```bash
npm run dev:client
```

The app will open at `http://127.0.0.1:5173`.

---

## 🗄️ Viewing Data in MongoDB Compass

1. Make sure MongoDB is running on your machine
2. Open **MongoDB Compass** and connect to:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Start the app and create an account
4. You'll see the database `student_performance_analytics` with two collections:
   - `users` — Stores registered user accounts
   - `performances` — Stores each user's subject marks and analytics data

---

## 📜 Available Scripts

From the root directory:

| Script | Description |
|---|---|
| `npm run install:all` | Installs dependencies for both client and server |
| `npm run dev:client` | Starts the React frontend (Vite dev server) |
| `npm run dev:server` | Starts the Express backend |
| `npm run build` | Builds the React frontend for production |
| `npm run start:server` | Starts the backend in production mode |

---

## 🔮 Future Plans

- [ ] Deploy backend on Render
- [ ] Deploy frontend on Vercel
- [ ] Add export to PDF / CSV
- [ ] Email notifications for fail-risk subjects
- [ ] Admin panel for teachers to view all students
- [ ] Dark mode support

---

## 🙋‍♀️ Author

**Subhashini**  
GitHub: [@subhashini46](https://github.com/subhashini46)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
