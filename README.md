# 💬 ChatApp - Real-Time Full Stack Chat Application

A modern, responsive, full-stack real-time messaging application built with the **MERN** stack (MongoDB, Express, React, Node.js) and **Socket.io**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**: Secure JWT authentication with HTTP-only cookies and protected routes.
- 💬 **Real-Time Messaging**: Instant 1-on-1 and group chat capabilities powered by Socket.io.
- 🟢 **Online Status & Typing Indicators**: Real-time user online/offline status and live typing notifications.
- 🖼️ **Media Sharing & Cloudinary Storage**: Image/media uploads seamlessly integrated with Cloudinary.
- 🎨 **Modern & Responsive UI**: Clean interface built with React, Tailwind CSS, and React Hot Toast.
- 🛡️ **Robust Error Handling**: Centralized error middleware and validation on backend API routes.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS**
- **React Router DOM v6**
- **Socket.io Client**
- **Axios**
- **React Icons** & **React Hot Toast**

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **Socket.io** (WebSockets)
- **JSON Web Tokens (JWT)** & **bcryptjs**
- **Multer** & **Cloudinary**

---

## 📁 Project Structure

```
Chat App/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Cloudinary config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & error middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express API routes
│   │   ├── services/        # Third-party services
│   │   ├── sockets/         # Socket.io event handlers
│   │   ├── utils/           # Helper utilities
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example         # Sample environment variables
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # Axios API client
│   │   ├── assets/          # Images & icons
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # Auth & Socket contexts
│   │   ├── pages/           # Application views/pages
│   │   ├── routes/          # Protected & public routing
│   │   ├── utils/           # Client utilities
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Frontend sample env variables
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Cloudinary Account](https://cloudinary.com/) (for media uploads)

---

### 2. Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

---

## 🚀 Deployment Guide

### Deploying Backend (e.g. Render, Railway, Cyclic, Heroku)
- Set root directory to `backend`.
- Build Command: `npm install`
- Start Command: `npm start`
- Add all required environment variables in your hosting dashboard (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, Cloudinary keys, etc.).

### Deploying Frontend (e.g. Vercel, Netlify)
- Set root directory to `frontend`.
- Build Command: `npm run build`
- Output Directory: `dist`
- Set `VITE_API_URL` and `VITE_SOCKET_URL` to your production backend URL.

---

## 📄 License
This project is licensed under the MIT License.
