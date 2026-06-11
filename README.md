# ✅ Todo Task Management System

A full-stack MERN application with Firebase Auth, Cloudinary uploads, JWT, dark mode, and task expiration.

## 🚀 Tech Stack
- **Frontend**: React 18, Vite, React Router v6, React Hook Form, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: Firebase (Google OAuth) + JWT
- **Storage**: Cloudinary (images)
- **Scheduler**: node-cron (auto-expire tasks, notifications)

---

## 📁 Project Structure
```
TODO-MANAGEMENT/
├── client/    # React frontend (Vite)
└── server/    # Node/Express backend
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Environment Variables

**server/.env** — fill in:
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — any strong secret
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` — from Firebase Admin SDK JSON
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from Cloudinary dashboard
- `EMAIL_USER`, `EMAIL_PASS` — Gmail App Password for notifications

**client/.env** — fill in:
- `VITE_FIREBASE_*` — from Firebase Web App config

### 3. Run

```bash
# Terminal 1 – backend
cd server && npm run dev

# Terminal 2 – frontend
cd client && npm run dev
```

Visit: http://localhost:5173

---

## 🌟 Features
- ✅ Register / Login with email or Google (Firebase)
- ✅ Create, Edit, Delete, View tasks
- ✅ Upload task images & profile photos (Cloudinary)
- ✅ Task priority: High / Medium / Low
- ✅ Task status: Pending → Completed / Expired
- ✅ Auto-expire tasks via cron job (midnight)
- ✅ Email & in-app notifications (due tomorrow)
- ✅ Search & filter tasks
- ✅ Dark / Light theme toggle
- ✅ Fully protected routes (JWT)
- ✅ Input validation (client + server)

---

## 🗄 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/firebase | Google login |
| GET | /api/auth/me | Current user |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/stats | Task statistics |
| GET | /api/tasks/:id | Get task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/complete | Mark complete |
| GET | /api/profile | Get profile |
| PUT | /api/profile | Update profile |
| PUT | /api/profile/password | Change password |
| PUT | /api/profile/image | Upload avatar |
| GET | /api/notifications | Get notifications |
| PATCH | /api/notifications/read-all | Mark all read |

---

## 🔐 Admin Seed
Run `node server/migrations/004-seed-admin.js` to create:
- Email: `admin@todoapp.com`
- Password: `Admin@123`
