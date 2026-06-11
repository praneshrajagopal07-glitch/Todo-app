# ✅ Todo Task Management System

🎥 **Demo Video:**
https://www.loom.com/share/748309a4ac1b471b8cc9cbd437832d34

A full-stack MERN application built with the MERN stack, Firebase Authentication, Cloudinary image uploads, JWT authorization, task expiration scheduling, email notifications, and a responsive dark/light mode UI.

---

## 🚀 Tech Stack

### Frontend

* React 18
* Vite
* React Router v6
* React Hook Form
* React Hot Toast
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* Firebase Authentication
* Google OAuth
* JWT (JSON Web Tokens)

### Storage & Services

* Cloudinary (Image Uploads)
* Nodemailer (Email Notifications)
* Node Cron (Task Scheduling)

---

## 📹 Project Demo

Watch the complete application walkthrough:

🔗 https://www.loom.com/share/748309a4ac1b471b8cc9cbd437832d34

The demo covers:

* User Registration & Login
* Google Authentication
* Task Creation & Management
* Profile Management
* Image Uploads
* Notifications
* Task Filtering & Search
* Dark/Light Theme
* Auto Expiring Tasks

---

## 📁 Project Structure

```text
TODO-MANAGEMENT/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── migrations/
│   └── package.json
│
└── README.md
```

---

## ✨ Features

### Authentication

* ✅ Email & Password Registration
* ✅ Login with Firebase Authentication
* ✅ Google OAuth Login
* ✅ JWT-Based Route Protection
* ✅ Secure Authentication Flow

### Task Management

* ✅ Create Tasks
* ✅ Edit Tasks
* ✅ Delete Tasks
* ✅ View Task Details
* ✅ Task Priorities (High, Medium, Low)
* ✅ Task Status Tracking
* ✅ Mark Tasks as Completed

### Automation

* ✅ Auto Expire Tasks Using Cron Jobs
* ✅ Due Date Monitoring
* ✅ Automatic Status Updates

### Notifications

* ✅ In-App Notifications
* ✅ Email Notifications
* ✅ Due Tomorrow Reminders
* ✅ Mark Notifications as Read

### User Profile

* ✅ Update Profile Information
* ✅ Change Password
* ✅ Upload Profile Avatar
* ✅ Cloudinary Image Storage

### UI/UX

* ✅ Responsive Design
* ✅ Dark Mode / Light Mode
* ✅ Toast Notifications
* ✅ Form Validation
* ✅ Search & Filter Tasks

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd TODO-MANAGEMENT
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

## 🔑 Environment Variables

### Server Environment (`server/.env`)

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASS=
```

### Client Environment (`client/.env`)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Application URL:

```text
http://localhost:5173
```

---

## 🗄 API Endpoints

### Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |
| POST   | /api/auth/firebase | Google Login  |
| GET    | /api/auth/me       | Current User  |

### Tasks

| Method | Endpoint                | Description     |
| ------ | ----------------------- | --------------- |
| GET    | /api/tasks              | Get All Tasks   |
| POST   | /api/tasks              | Create Task     |
| GET    | /api/tasks/stats        | Task Statistics |
| GET    | /api/tasks/:id          | Get Task By ID  |
| PUT    | /api/tasks/:id          | Update Task     |
| DELETE | /api/tasks/:id          | Delete Task     |
| PATCH  | /api/tasks/:id/complete | Mark Complete   |

### Profile

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | /api/profile          | Get Profile     |
| PUT    | /api/profile          | Update Profile  |
| PUT    | /api/profile/password | Change Password |
| PUT    | /api/profile/image    | Upload Avatar   |

### Notifications

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| GET    | /api/notifications          | Get Notifications |
| PATCH  | /api/notifications/read-all | Mark All Read     |

---

## 🔐 Admin Seed

Run the following command to create an admin account:

```bash
node server/migrations/004-seed-admin.js
```

### Admin Credentials

```text
Email: admin@todoapp.com
Password: Admin@123
```

---

## 📸 Key Functionalities

* Firebase Authentication Integration
* Google OAuth Sign-In
* JWT Authorization
* MongoDB Database Management
* Cloudinary Image Uploads
* Email Reminder System
* Cron-Based Task Expiration
* Task Search & Filtering
* Responsive Dashboard
* Dark/Light Theme Support

---

## 🛡 Security Features

* Password Hashing
* JWT Authentication
* Protected Routes
* Input Validation
* Secure Environment Variables
* Firebase Token Verification

---

## 📈 Future Enhancements

* Team Collaboration
* Task Comments
* Real-Time Notifications
* File Attachments
* Calendar Integration
* Analytics Dashboard
* Mobile Application

---

## 👨‍💻 Author

Developed as a full-stack MERN project demonstrating authentication, task management, cloud storage integration, and automated scheduling.

⭐ If you found this project useful, consider giving it a star.
