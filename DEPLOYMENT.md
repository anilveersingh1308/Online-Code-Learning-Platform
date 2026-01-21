# 🚀 Deployment Guide - CodeLearnHub

This guide walks you through deploying CodeLearnHub to **Vercel** (Frontend) and **Render** (Backend).

## Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub account with this repository
2. ✅ MongoDB Atlas account with a cluster
3. ✅ GitHub OAuth App (for authentication)
4. ✅ Google OAuth App (optional, for Google login)

---

## Part 1: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose the FREE tier (M0 Sandbox)
   - Select a region close to your users

3. **Create a Database User**
   - Go to **Database Access** → **Add New Database User**
   - Create a username and password (save these!)

4. **Configure Network Access**
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required for cloud services like Render and Vercel

5. **Get Connection String**
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password

---

## Part 2: Create OAuth Applications

### GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   ```
   Application name: CodeLearnHub
   Homepage URL: https://your-app.vercel.app
   Authorization callback URL: https://your-backend.onrender.com/api/auth/callback/github
   ```
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Google OAuth App (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. Configure consent screen if prompted
6. Application type: **Web application**
7. Add to **Authorized redirect URIs**:
   ```
   https://your-backend.onrender.com/api/auth/callback/google
   ```
8. Copy the **Client ID** and **Client Secret**

---

## Part 3: Deploy Backend to Render

1. **Sign Up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure:
   
   | Setting | Value |
   |---------|-------|
   | Name | `codelearnhub-backend` |
   | Region | Oregon (US West) |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Runtime | Python 3 |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn server:app --host 0.0.0.0 --port $PORT` |

3. **Add Environment Variables**
   
   Click **"Advanced"** → **"Add Environment Variable"**:
   
   | Key | Value |
   |-----|-------|
   | `MONGO_URL` | `mongodb+srv://username:password@cluster.mongodb.net/` |
   | `DB_NAME` | `codelearnhub` |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (update later) |
   | `CORS_ORIGINS` | `https://your-app.vercel.app` (update later) |
   | `GITHUB_CLIENT_ID` | Your GitHub OAuth Client ID |
   | `GITHUB_CLIENT_SECRET` | Your GitHub OAuth Secret |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID (optional) |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth Secret (optional) |

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait 3-5 minutes for deployment
   - Note your URL: `https://codelearnhub-backend.onrender.com`

5. **Test Backend**
   - Visit: `https://your-backend.onrender.com/api/health`
   - You should see: `{"status": "healthy", ...}`

---

## Part 4: Deploy Frontend to Vercel

1. **Sign Up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub repository

3. **Configure Project**
   
   | Setting | Value |
   |---------|-------|
   | Framework Preset | Create React App |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` or `yarn build` |
   | Output Directory | `build` |
   | Install Command | `npm install` or `yarn install` |

4. **Add Environment Variables**
   
   | Key | Value |
   |-----|-------|
   | `REACT_APP_BACKEND_URL` | `https://your-backend.onrender.com` |
   | `REACT_APP_ENV` | `production` |

5. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes
   - Your app is live at: `https://your-project.vercel.app`

---

## Part 5: Post-Deployment Configuration

### Update Backend Environment Variables

1. Go to Render Dashboard → Your Service → Environment
2. Update these variables with your actual Vercel URL:
   - `FRONTEND_URL` → `https://your-project.vercel.app`
   - `CORS_ORIGINS` → `https://your-project.vercel.app`
3. Click **"Save Changes"** (triggers redeploy)

### Update OAuth Callback URLs

**GitHub:**
1. Go to your GitHub OAuth App settings
2. Update **Authorization callback URL** to:
   ```
   https://your-backend.onrender.com/api/auth/callback/github
   ```

**Google:**
1. Go to Google Cloud Console → Credentials
2. Update **Authorized redirect URIs** to:
   ```
   https://your-backend.onrender.com/api/auth/callback/google
   ```

### Seed the Database

Run this command to populate initial articles:

```bash
curl -X POST https://your-backend.onrender.com/api/seed/articles
```

Or visit: `https://your-backend.onrender.com/docs` and use the Swagger UI.

---

## Part 6: Verify Deployment

### Checklist

- [ ] Backend health check works: `/api/health`
- [ ] Frontend loads without errors
- [ ] GitHub login works
- [ ] Google login works (if configured)
- [ ] Articles are seeded and visible
- [ ] Documentation pages load
- [ ] Dark/Light mode toggle works

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure `CORS_ORIGINS` includes your Vercel URL |
| OAuth redirect fails | Check callback URLs match exactly |
| Database connection fails | Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0 |
| 500 errors on backend | Check Render logs for Python errors |
| Blank page on frontend | Check browser console for errors |

---

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your domain: `www.yourdomain.com`
3. Follow DNS configuration instructions

### Render Custom Domain

1. Go to Service Settings → Custom Domains
2. Add your API domain: `api.yourdomain.com`
3. Follow DNS configuration instructions

---

## Maintenance

### Updating the Application

1. Push changes to GitHub
2. Vercel and Render will auto-deploy

### Monitoring

- **Render**: View logs in the dashboard
- **Vercel**: View deployment logs and analytics
- **MongoDB Atlas**: Monitor database metrics

### Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions limited

---

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/anilveersingh1308/codelearn/issues)
2. Review Render and Vercel logs
3. Ensure all environment variables are set correctly

---

**Happy Deploying! 🚀**
