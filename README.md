# Todo Management App

A full-stack Todo Management application built with React, Vite, Node.js, Express, MongoDB, Firebase Authentication, Cloudinary, and Nodemailer.

## Features

* User Registration and Login
* Google Sign-In with Firebase Authentication
* JWT Authentication
* Create, Update, Delete Tasks
* Task Status Management
* Due Date Tracking
* Image Uploads with Cloudinary
* Email Reminder Notifications
* Responsive User Interface
* MongoDB Database Storage

## Tech Stack

### Frontend

* React
* Vite
* Firebase Authentication
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Firebase Admin SDK
* Cloudinary
* Nodemailer

## Project Structure

```text
todo-management/
├── client/
│   ├── src/
│   ├── public/
│   └── .env
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── .env
│
└── README.md
```

## Environment Variables

### Server (.env)

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@todoapp.com

CLIENT_URL=http://localhost:5173
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/todo-management.git
cd todo-management
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Install Frontend Dependencies

```bash
cd ../client
npm install
```

## Running the Application

### Start Backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication.
3. Enable Google Sign-In.
4. Add a Web App.
5. Copy Firebase configuration into `client/.env`.
6. Generate a Service Account key and configure backend Firebase variables.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Copy Cloud Name, API Key, and API Secret.
3. Add them to `server/.env`.

## Email Setup

1. Enable Google 2-Step Verification.
2. Generate a Gmail App Password.
3. Configure email credentials in `server/.env`.

## Build for Production

### Frontend

```bash
cd client
npm run build
```

### Backend

```bash
cd server
npm start
```

## Security Notes

* Never commit `.env` files.
* Keep API keys and secrets private.
* Use strong JWT secrets.
* Rotate exposed credentials immediately.

## License

This project is licensed under the MIT License.
