# HabitForge: Gamified Productivity Platform

HabitForge is a full-stack premium habit tracker designed with a futuristic "Gamer Dashboard" aesthetic.

## 🚀 Deployment Guide

This project is optimized for deployment on platforms like **Render**, **Railway**, or **Heroku**.

### Preparation
1. **GitHub**: Ensure your code is pushed to a GitHub repository.
2. **Database**: You will need a MongoDB connection string (e.g., from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### Deployment on Vercel
1. **New Project**: Import your repository from GitHub.
2. **Framework Preset**: Choose **Other** (Vercel will detect `vercel.json`).
3. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string.
4. **Deploy**: Vercel will automatically build the client and route API requests to the server.

### Deployment on Render (Recommended for Background Jobs)
... (keep existing)

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Theming**: Custom "Command Center" dark theme with glassmorphism.

## 📜 Standardized Lexicon
- **Quest**: Individual habits or goals.
- **Merit**: Achievements and badges earned.
- **Persistence**: Daily streaks and consistency tracking.
- **Protocol**: Actionable tasks and implementation logs.
