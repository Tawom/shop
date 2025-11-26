# Render Deployment Guide - Portfolio E-Commerce Project

## 🎯 Overview

This guide will help you deploy your MERN e-commerce application to Render for **FREE** - perfect for portfolio demonstrations.

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **MongoDB Atlas Account** - Free tier (512MB) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
3. **Render Account** - Free tier - [Sign up here](https://render.com)
4. **Gmail Account** (optional) - For email notifications

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare MongoDB Atlas (5 minutes)

1. **Create MongoDB Atlas Cluster:**

   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Click "Build a Database" → Choose "M0 FREE" tier
   - Select region (choose closest to Oregon for Render)
   - Click "Create Cluster"

2. **Setup Database Access:**

   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `ecommerce-user` (or your choice)
   - Password: Generate secure password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Setup Network Access:**

   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://ecommerce-user:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - **SAVE THIS CONNECTION STRING!**

---

### Step 2: Push Code to GitHub (2 minutes)

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy Backend to Render (5 minutes)

1. **Go to [Render Dashboard](https://dashboard.render.com)**

2. **Create New Web Service:**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository
   - Click "Connect"

3. **Configure Backend Service:**

   ```
   Name:           ecommerce-backend
   Region:         Oregon (US West)
   Branch:         main
   Root Directory: backend
   Runtime:        Node
   Build Command:  npm install
   Start Command:  npm start
   Instance Type:  Free
   ```

4. **Add Environment Variables:**
   Click "Advanced" → Add Environment Variables:

   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://ecommerce-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-random-string-change-this-now
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   SMTP_FROM=noreply@ecommerce.com
   ```

   **Important:**

   - Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
   - Generate a strong `JWT_SECRET` (use: https://randomkeygen.com/)
   - For Gmail: Enable 2FA and create App Password (https://myaccount.google.com/apppasswords)

5. **Click "Create Web Service"**
   - Wait 3-5 minutes for deployment
   - Copy your backend URL: `https://ecommerce-backend-xxxx.onrender.com`

---

### Step 4: Deploy Frontend to Render (5 minutes)

1. **Create New Static Site:**

   - Click "New +" → "Static Site"
   - Select the same repository
   - Click "Connect"

2. **Configure Frontend Service:**

   ```
   Name:           ecommerce-frontend
   Branch:         main
   Root Directory: frontend
   Build Command:  npm install && npm run build
   Publish Dir:    dist
   ```

3. **Add Environment Variable:**
   Click "Advanced" → Add Environment Variable:

   ```env
   VITE_API_URL=https://ecommerce-backend-xxxx.onrender.com/api
   ```

   **Replace with your actual backend URL from Step 3!**

4. **Click "Create Static Site"**
   - Wait 3-5 minutes for build
   - Your site will be live at: `https://ecommerce-frontend-xxxx.onrender.com`

---

### Step 5: Update Backend CORS (2 minutes)

1. **Go back to Backend Service** in Render dashboard

2. **Add Frontend URL environment variable:**

   - Environment → Add:

   ```env
   FRONTEND_URL=https://ecommerce-frontend-xxxx.onrender.com
   ```

3. **Click "Save Changes"** - Backend will auto-redeploy

---

### Step 6: Create Admin User (2 minutes)

1. **Open Backend Shell:**
   - Go to your backend service in Render
   - Click "Shell" tab (right side)
   - Run command:
   ```bash
   node make-admin.js
   ```
   - Follow prompts to create admin account

**Alternative - Using MongoDB Compass:**

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB Atlas connection string
3. Find `users` collection
4. Update a user's `role` field to `"admin"`

---

### Step 7: Test Your Deployment (5 minutes)

1. **Visit your frontend URL**

   - Example: `https://ecommerce-frontend-xxxx.onrender.com`

2. **Test these features:**

   - ✅ Homepage loads
   - ✅ Products display
   - ✅ Register new account (check email)
   - ✅ Login works
   - ✅ Add to cart
   - ✅ Create order
   - ✅ Admin login
   - ✅ Admin dashboard

3. **First load may take 30 seconds** (free tier spins down after 15 min inactivity)

---

## 🎨 Portfolio Customization

### Add Custom Domain (Optional - Free)

1. **In Static Site Settings:**
   - Go to "Settings" → "Custom Domains"
   - Click "Add Custom Domain"
   - Follow instructions to update DNS

### Add "Portfolio Note" to Your Site

Add this banner to your frontend home page:

```jsx
<div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
  <p className="text-sm">
    📌 <strong>Portfolio Project:</strong> This is a demo e-commerce site. First
    load may take 30 seconds (free tier). Not for real purchases.
  </p>
</div>
```

---

## 📊 Monitor Your Deployment

### View Logs

```
Backend:  Render Dashboard → Backend Service → Logs
Frontend: Render Dashboard → Frontend Service → Logs
```

### Check Health

```
Backend:  https://your-backend.onrender.com
Frontend: https://your-frontend.onrender.com
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Backend Won't Start

**Solution:**

- Check logs for errors
- Verify `MONGODB_URI` is correct
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Issue 2: Frontend Shows "Network Error"

**Solution:**

- Verify `VITE_API_URL` matches your backend URL exactly
- Check backend logs for CORS errors
- Ensure `FRONTEND_URL` is set in backend environment variables

### Issue 3: Email Not Sending

**Solution:**

- Development mode logs to console (check backend logs)
- For production emails:
  - Verify `NODE_ENV=production`
  - Check Gmail App Password is correct
  - Review backend logs for SMTP errors

### Issue 4: Site is Slow

**Solution:**

- Free tier spins down after 15 minutes of inactivity
- First request takes ~30 seconds to wake up
- Subsequent requests are fast
- Add note on portfolio: "Demo may take 30s to wake"

### Issue 5: File Uploads Don't Work

**Solution:**

- Render free tier has ephemeral storage (files deleted on restart)
- For portfolio: Use small test images
- For production: Integrate AWS S3 or Cloudinary

---

## 💰 Cost Breakdown

| Service                       | Tier    | Cost         |
| ----------------------------- | ------- | ------------ |
| Frontend (Render Static Site) | Free    | $0/month     |
| Backend (Render Web Service)  | Free    | $0/month     |
| MongoDB Atlas                 | M0 Free | $0/month     |
| **Total**                     |         | **$0/month** |

**Limitations:**

- Backend spins down after 15 min inactivity
- 750 hours/month runtime (enough for portfolio)
- Uploads stored temporarily (use S3 for production)

---

## 🚀 Upgrade Path (Optional)

If you want always-on service:

| Plan           | Cost          | Benefits                |
| -------------- | ------------- | ----------------------- |
| Render Starter | $7/month      | Always on, no spin down |
| MongoDB M2     | $9/month      | 2GB storage, faster     |
| **Total**      | **$16/month** | Professional portfolio  |

---

## 📝 For Your Resume/Portfolio

**Add this to your project description:**

```
🚀 Deployed on Render (DevOps)
- Frontend: Static site with automated builds
- Backend: Node.js web service with health checks
- Database: MongoDB Atlas (cloud-hosted)
- CI/CD: Auto-deploy from GitHub on push
- Environment: Production-ready with CORS, HTTPS, security headers
```

**Skills Demonstrated:**

- Full-stack deployment
- Cloud platforms (Render, MongoDB Atlas)
- Environment variable management
- CI/CD pipeline
- DevOps fundamentals
- Security best practices (CORS, HTTPS, JWT)

---

## 🔗 Useful Links

- **Your Live Site:** `https://ecommerce-frontend-xxxx.onrender.com`
- **Backend API:** `https://ecommerce-backend-xxxx.onrender.com`
- **Render Dashboard:** https://dashboard.render.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Render Docs:** https://render.com/docs

---

## 🎯 Next Steps

1. ✅ Deploy to Render (follow steps above)
2. ✅ Test all features work
3. ✅ Add project to your portfolio website
4. ✅ Add GitHub repository link
5. ✅ Update README with live demo link
6. ✅ Share with recruiters!

---

## 🆘 Need Help?

- **Render Support:** https://render.com/docs
- **MongoDB Issues:** https://www.mongodb.com/community/forums
- **Check Logs:** Render Dashboard → Your Service → Logs tab

---

**🎉 Congratulations!** Your e-commerce project is now live and ready for your portfolio!

**Pro Tip:** Before interviews, visit your site 30 seconds early to wake it up from sleep mode.
