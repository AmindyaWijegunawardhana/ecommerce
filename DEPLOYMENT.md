# Deployment Guide - Free Tier

## 1. Database Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free) and create a new project
3. Create a free **M0 Cluster**
4. Click "Connect" and copy the connection string
5. Replace `<password>` with your database password
6. Your connection string will look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

## 2. Backend Deployment (Render.com)

1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the form:
   - **Name**: anything (e.g., `pemeesha-api`)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `server`
5. Add environment variables under "Advanced":
   ```
   MONGODB_URI=mongodb+srv://...your_connection_string...
   NODE_ENV=production
   JWT_SECRET=your_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   PORT=5000
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```
6. Deploy! Your backend URL will be: `https://pemeesha-api.onrender.com`

## 3. Frontend Deployment (Vercel)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Fill in:
   - **Framework**: Vite
   - **Root Directory**: `client`
5. Add environment variable:
   ```
   VITE_API_URL=https://pemeesha-api.onrender.com
   ```
6. Deploy! Your frontend URL will be: `https://pemeesha.vercel.app`

## 4. Update Frontend API Calls

Update your frontend to use the deployed backend URL in your API configuration.

---

## Important Notes:
- ⚠️ Render.com free tier spins down after 15 minutes of inactivity (takes 30 seconds to wake up)
- ✅ MongoDB Atlas free tier allows up to 512MB storage
- ✅ Vercel provides unlimited bandwidth on free tier
- 📝 Add `.env.production` to your client if needed for production configuration

## Troubleshooting:
- CORS errors? Add your Vercel domain to `CLIENT_URL` in Render backend settings
- Database connection issues? Check your IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
