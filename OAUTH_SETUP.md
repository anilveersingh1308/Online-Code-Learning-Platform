# Project Setup Guide

## OAuth Authentication Setup

This project uses Google and GitHub OAuth for authentication. Follow these steps to set it up.

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth Client ID**
5. Choose **Web application** as the application type
6. Add the following:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

### 3. Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=emergent

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```bash
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 5. Running the Application

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python server.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Production Deployment

For production, update the URLs in your OAuth provider settings:
- Replace `localhost:3000` with your production frontend URL
- Replace `localhost:8001` with your production backend URL
- Update `FRONTEND_URL` environment variable in the backend

## Authentication Flow

1. User clicks "Sign in with Google" or "Sign in with GitHub"
2. Frontend calls `/api/auth/google` or `/api/auth/github` to get the OAuth URL
3. User is redirected to Google/GitHub to authorize
4. After authorization, user is redirected to `/auth/callback/google` or `/auth/callback/github`
5. Frontend sends the authorization code to the backend
6. Backend exchanges the code for tokens and retrieves user info
7. Backend creates/updates user in the database and creates a session
8. User is redirected to the dashboard
