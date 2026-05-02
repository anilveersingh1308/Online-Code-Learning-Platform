# Complete Deployment Guide: Netlify (Frontend) + Render (Backend)

## Actual Repository Structure

```
pulled-repo/                        ← Git root
├── netlify.toml                    ← Netlify build config (at git root)
├── netlify/
│   └── functions/
│       └── keep-render-awake.js   ← Scheduled keep-alive function
└── codelearnhub/
    ├── backend/
    │   ├── server.py               ← FastAPI app
    │   ├── requirements.txt
    │   ├── runtime.txt             ← python-3.11.7
    │   ├── Procfile                ← python -m uvicorn server:app ...
    │   ├── render.yaml             ← Render blueprint
    │   └── .env.example
    └── frontend/
        ├── package.json
        ├── craco.config.js
        ├── public/
        │   ├── index.html
        │   └── _redirects          ← /* /index.html 200
        └── src/
```

---

## Step 1 — Set Up MongoDB Atlas (One Time)

1. Go to https://cloud.mongodb.com and sign in or create a free account.
2. Click **New Project**, name it `codelearnhub`, click **Create Project**.
3. Click **Build a Database** → choose **M0 Free tier** → pick any region → click **Create**.
4. On the **Security Quickstart** screen:
   - Create a database user: set a username and a strong password.
   - **Important:** if the password contains `#`, replace it with `%23` in the connection string later.
5. Click **Add My Current IP Address** (for local dev), then also click **Allow Access from Anywhere (0.0.0.0/0)** for Render to connect.
6. Click **Finish and Close**.
7. Click **Connect** → **Drivers** → copy the connection string.
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`
   - Replace `<password>` with your actual password (URL-encoding `#` as `%23` if needed).
8. Save this string — you will paste it as `MONGO_URL` in Render.

---

## Step 2 — Create GitHub OAuth App (For Login)

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** `CodeLearnHub`
   - **Homepage URL:** `https://codelearn-hub.netlify.app`
   - **Authorization callback URL:** `https://codelearn-hub-backend.onrender.com/api/auth/callback/github`
3. Click **Register application**.
4. Click **Generate a new client secret**.
5. Save both **Client ID** and **Client Secret** — you will use them in Render environment variables.

---

## Step 3 — Create Google OAuth App (Optional — For Google Login)

1. Go to https://console.cloud.google.com → create or select a project.
2. Go to **APIs & Services** → **OAuth consent screen** → choose **External** → fill in app name, support email → **Save and Continue**.
3. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
4. Application type: **Web application**.
5. Under **Authorized JavaScript origins** add:
   - `https://codelearn-hub.netlify.app`
6. Under **Authorized redirect URIs** add:
   - `https://codelearn-hub-backend.onrender.com/api/auth/callback/google`
7. Click **Create**.
8. Save the **Client ID** and **Client Secret**.

---

## Step 4 — Deploy Backend on Render

### 4a. Connect Repository

1. Go to https://render.com → sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Click **Connect** next to your repository `anilveersingh1308/Online-Code-Learning-Platform`.

### 4b. Configure the Service

Fill in these exact settings:

| Setting | Value |
|---|---|
| Name | `codelearn-hub-backend` |
| Region | Oregon (US West) |
| Branch | `main` |
| Root Directory | `codelearnhub/backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `python -m uvicorn server:app --host 0.0.0.0 --port $PORT` |
| Instance Type | Free |

### 4c. Set Environment Variables

Click **Advanced** → **Add Environment Variable** and add all of these:

| Key | Value |
|---|---|
| `MONGO_URL` | `mongodb+srv://username:password@cluster.mongodb.net/` |
| `DB_NAME` | `codelearnhub` |
| `FRONTEND_URL` | `https://codelearn-hub.netlify.app` |
| `CORS_ORIGINS` | `https://codelearn-hub.netlify.app` |
| `GITHUB_CLIENT_ID` | your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | your GitHub OAuth Client Secret |
| `GOOGLE_CLIENT_ID` | your Google OAuth Client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | your Google OAuth Client Secret (optional) |

Click **Create Web Service** and wait for the first deploy to complete (3-5 minutes).

### 4d. Verify Backend

Open in browser:
- `https://codelearn-hub-backend.onrender.com/api/health`

Expected response:
```json
{"status": "healthy", "timestamp": "..."}
```

Also check Swagger docs:
- `https://codelearn-hub-backend.onrender.com/docs`

---

## Step 5 — Deploy Frontend on Netlify

### 5a. Connect Repository

1. Go to https://netlify.com → sign in with GitHub.
2. Click **Add new site** → **Import an existing project**.
3. Click **Deploy with GitHub**.
4. Select repository `anilveersingh1308/Online-Code-Learning-Platform`.

### 5b. Build Settings (Auto-Detected from netlify.toml)

Netlify reads `netlify.toml` from the root of the repository. These settings are already configured:

| Setting | Value |
|---|---|
| Base directory | `codelearnhub/frontend` |
| Build command | `npm run build` |
| Publish directory | `build` |
| Node version | `20` |
| `REACT_APP_BACKEND_URL` | `https://codelearn-hub-backend.onrender.com` |

No manual changes needed in the Netlify dashboard for build settings.

### 5c. Deploy

Click **Deploy site**. Wait 2-4 minutes for the build to finish.

### 5d. Verify Frontend

1. Open: `https://codelearn-hub.netlify.app`
2. Navigate to a page and hit browser Refresh — it should not show 404 (the `_redirects` file handles SPA routing).
3. Check that content loads — courses, projects, documentation.

---

## Step 6 — Seed Initial Data (One Time)

After the backend is running, populate the database with starter articles.

**Option A — Swagger UI:**
1. Open `https://codelearn-hub-backend.onrender.com/docs`
2. Find `POST /api/seed/articles`
3. Click **Try it out** → **Execute**

**Option B — curl:**
```bash
curl -X POST https://codelearn-hub-backend.onrender.com/api/seed/articles
```

---

## Step 7 — Auto Keep-Alive for Render Backend

Render's free tier puts the backend to sleep after 15 minutes of inactivity. This project already has a Netlify Scheduled Function that pings the backend every 10 minutes automatically.

File: `netlify/functions/keep-render-awake.js`

Cron schedule in `netlify.toml`:
```toml
[[scheduled.functions]]
  name = "keep-render-awake"
  cron = "*/10 * * * *"
```

No manual setup needed — Netlify runs this automatically after deploy.

---

## Step 8 — End-to-End Verification Checklist

Work through this list after both platforms are deployed:

- [ ] `https://codelearn-hub-backend.onrender.com/api/health` returns `{"status": "healthy"}`
- [ ] `https://codelearn-hub.netlify.app` loads the homepage
- [ ] Refreshing any page (e.g. `/courses`) does not show 404
- [ ] Sign In with GitHub redirects to GitHub and returns to dashboard
- [ ] Sign In with Google redirects to Google and returns to dashboard (if configured)
- [ ] Documentation page shows seeded articles
- [ ] Projects and Courses pages load data from the backend

---

## Step 9 — Redeploy After Future Code Changes

You do not need to do anything manually. Both platforms watch the `main` branch.

1. Push your changes to `main`:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```
2. Netlify auto-rebuilds the frontend (2-4 minutes).
3. Render auto-redeploys the backend (2-5 minutes).

---

## Quick Reference — All URLs

| Service | URL |
|---|---|
| Frontend (Netlify) | https://codelearn-hub.netlify.app |
| Backend API (Render) | https://codelearn-hub-backend.onrender.com |
| Backend Health | https://codelearn-hub-backend.onrender.com/api/health |
| API Docs (Swagger) | https://codelearn-hub-backend.onrender.com/docs |
| GitHub OAuth Settings | https://github.com/settings/developers |
| Google OAuth Settings | https://console.cloud.google.com/apis/credentials |
| MongoDB Atlas | https://cloud.mongodb.com |

---

## Troubleshooting

**Frontend shows blank page or 404 on refresh**
- Confirm `codelearnhub/frontend/public/_redirects` contains: `/* /index.html 200`
- Confirm `netlify.toml` has the `[[redirects]]` block

**Backend shows 500 or cannot connect to DB**
- Verify `MONGO_URL` in Render is URL-encoded (replace `#` with `%23`)
- Verify MongoDB Atlas IP whitelist allows `0.0.0.0/0`

**GitHub login fails or loops**
- Confirm the callback URL in GitHub OAuth App exactly matches: `https://codelearn-hub-backend.onrender.com/api/auth/callback/github`
- Confirm `FRONTEND_URL` in Render equals exactly: `https://codelearn-hub.netlify.app`

**Backend cold-start is slow (first request after sleep)**
- The keep-alive function runs every 10 minutes, preventing sleep on Render free tier
- First response after a fresh deploy may take 30-60 seconds
