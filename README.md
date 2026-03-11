# HabitForge: Gamified Productivity Platform

HabitForge is a full-stack premium habit tracker designed with a futuristic "Gamer Dashboard" aesthetic.

## 🚀 Deployment Guide

This project is optimized for deployment on platforms like **Render**, **Railway**, or **Heroku**.

### Preparation
1. **GitHub**: Ensure your code is pushed to a GitHub repository.
2. **Database**: You will need a MongoDB connection string (e.g., from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### Deployment on Render (Recommended)
1. **New Web Service**: Connect your GitHub repository.
2. **Root Directory**: `.` (Keep as root)
3. **Build Command**: `npm run install-all && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A long, random string for security.
   - `VITE_API_URL`: (Optional) If you serve the frontend separately, point this to your backend URL. If serving together via the Express server, this defaults to the correct relative path.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Theming**: Custom "Command Center" dark theme with glassmorphism.

## 📜 Standardized Lexicon
- **Quest**: Individual habits or goals.
- **Merit**: Achievements and badges earned.
- **Persistence**: Daily streaks and consistency tracking.
- **Protocol**: Actionable tasks and implementation logs.
