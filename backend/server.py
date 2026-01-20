from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Response, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse, RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import razorpay
import bcrypt
import os
import logging
import uuid
import json
import hmac
import hashlib
import aiofiles
import zipfile
import io
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any
from datetime import datetime, timezone, timedelta
import httpx
from urllib.parse import urlencode

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# OAuth Configuration
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID', '')
GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Razorpay setup (optional - will work in test mode if keys not provided)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# File storage path
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
PROJECTS_DIR = UPLOAD_DIR / "projects"
PROJECTS_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ========================
# Pydantic Models
# ========================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "guest"  # admin, student, buyer, guest
    bio: Optional[str] = None
    skills: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_verified: bool = False

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    project_id: str = Field(default_factory=lambda: f"proj_{uuid.uuid4().hex[:12]}")
    title: str
    description: str
    tech_stack: List[str]
    category: str
    price: float
    license_type: str = "single"  # single, multi, commercial
    file_path: Optional[str] = None
    preview_images: List[str] = []
    demo_url: Optional[str] = None
    downloads_count: int = 0
    rating: float = 0.0
    rating_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    category: str
    price: float
    license_type: str = "single"
    demo_url: Optional[str] = None
    preview_images: List[str] = []

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    course_id: str = Field(default_factory=lambda: f"course_{uuid.uuid4().hex[:12]}")
    title: str
    description: str
    category: str
    price: float
    difficulty: str  # beginner, intermediate, advanced
    duration: str
    instructor_id: str
    thumbnail: Optional[str] = None
    is_free: bool = False
    lessons_count: int = 0
    enrolled_count: int = 0
    rating: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    price: float
    difficulty: str
    duration: str
    thumbnail: Optional[str] = None
    is_free: bool = False

class Lesson(BaseModel):
    model_config = ConfigDict(extra="ignore")
    lesson_id: str = Field(default_factory=lambda: f"lesson_{uuid.uuid4().hex[:12]}")
    course_id: str
    title: str
    content_type: str  # video, text, code
    content_url: Optional[str] = None
    content_text: Optional[str] = None
    duration: str = "0"
    order: int
    is_free_preview: bool = False

class Purchase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    purchase_id: str = Field(default_factory=lambda: f"pur_{uuid.uuid4().hex[:12]}")
    user_id: str
    project_id: str
    transaction_id: str
    amount: float
    license_key: str
    purchase_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    download_count: int = 0
    status: str = "completed"

class Enrollment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    enrollment_id: str = Field(default_factory=lambda: f"enroll_{uuid.uuid4().hex[:12]}")
    user_id: str
    course_id: str
    progress_percentage: float = 0.0
    enrolled_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_date: Optional[datetime] = None
    certificate_url: Optional[str] = None

class Connection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    connection_id: str = Field(default_factory=lambda: f"conn_{uuid.uuid4().hex[:12]}")
    sender_id: str
    receiver_id: str
    status: str = "pending"  # pending, accepted, rejected
    message: Optional[str] = None
    category: str = "general"  # collaboration, mentorship, hiring, consulting
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    accepted_at: Optional[datetime] = None

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    message_id: str = Field(default_factory=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    connection_id: str
    sender_id: str
    content: str
    attachments: List[str] = []
    sent_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read_at: Optional[datetime] = None

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str = Field(default_factory=lambda: f"txn_{uuid.uuid4().hex[:12]}")
    user_id: str
    amount: float
    payment_method: str
    status: str = "pending"  # pending, completed, failed, refunded
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    invoice_url: Optional[str] = None
    item_type: str  # project, course, subscription
    item_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    contact_id: str = Field(default_factory=lambda: f"contact_{uuid.uuid4().hex[:12]}")
    name: str
    email: str
    purpose: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    post_id: str = Field(default_factory=lambda: f"post_{uuid.uuid4().hex[:12]}")
    title: str
    content: str
    excerpt: str
    category: str
    tags: List[str] = []
    author_id: str
    thumbnail: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_published: bool = True
    views: int = 0

# ========================
# Auth Helper
# ========================

async def get_current_user(request: Request) -> Optional[User]:
    """Get current user from session token"""
    # Check cookie first, then Authorization header
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            session_token = auth_header[7:]
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session_doc:
        return None
    
    # Check expiry with timezone awareness
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    """Require authentication"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_admin(request: Request) -> User:
    """Require admin role"""
    user = await require_auth(request)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ========================
# Auth Routes - OAuth (Google & GitHub)
# ========================

async def create_user_session(user_id: str, response: Response) -> str:
    """Create a session for user and set cookie"""
    session_token = f"sess_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session = UserSession(
        user_id=user_id,
        session_token=session_token,
        expires_at=expires_at
    )
    session_dict = session.model_dump()
    session_dict["expires_at"] = session_dict["expires_at"].isoformat()
    session_dict["created_at"] = session_dict["created_at"].isoformat()
    
    # Delete old sessions and create new one
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_dict)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    return session_token

async def get_or_create_user(email: str, name: str, picture: Optional[str], provider: str) -> str:
    """Get existing user or create new one"""
    now = datetime.now(timezone.utc)
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    
    if user_doc:
        # Existing user - update last login and profile info
        user_id = user_doc["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "name": name,
                    "picture": picture,
                    "auth_provider": provider,
                    "last_login": now.isoformat(),
                    "updated_at": now.isoformat()
                },
                "$inc": {"login_count": 1}
            }
        )
        logger.info(f"User signed in: {email} (provider: {provider})")
    else:
        # New user - create account
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user_data = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "student",
            "bio": None,
            "skills": [],
            "social_links": {
                "github": "",
                "linkedin": "",
                "twitter": "",
                "website": ""
            },
            "auth_provider": provider,
            "is_verified": True,  # OAuth users are considered verified
            "is_instructor": False,
            "total_purchases": 0,
            "total_enrollments": 0,
            "login_count": 1,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "last_login": now.isoformat()
        }
        await db.users.insert_one(new_user_data)
        logger.info(f"New user registered: {email} (provider: {provider})")
        
        # Create welcome notification
        notification = {
            "notification_id": f"notif_{uuid.uuid4().hex[:12]}",
            "user_id": user_id,
            "type": "system",
            "title": "Welcome to CodeLearnHub!",
            "message": f"Hi {name}! Welcome to CodeLearnHub. Start exploring our projects and courses.",
            "action_url": "/courses",
            "is_read": False,
            "is_email_sent": False,
            "created_at": now.isoformat()
        }
        await db.notifications.insert_one(notification)
    
    return user_id

# Google OAuth Routes
@api_router.get("/auth/google")
async def google_login(redirect_uri: Optional[str] = None):
    """Initiate Google OAuth login"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    callback_url = f"{FRONTEND_URL}/auth/callback/google"
    state = redirect_uri or "/dashboard"
    
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": callback_url,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "state": state,
        "prompt": "consent"
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return {"auth_url": auth_url}

@api_router.post("/auth/google/callback")
async def google_callback(request: Request, response: Response):
    """Handle Google OAuth callback"""
    body = await request.json()
    code = body.get("code")
    
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code required")
    
    callback_url = f"{FRONTEND_URL}/auth/callback/google"
    
    # Exchange code for tokens
    async with httpx.AsyncClient() as http_client:
        try:
            token_response = await http_client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": callback_url
                }
            )
            
            if token_response.status_code != 200:
                logger.error(f"Google token error: {token_response.text}")
                raise HTTPException(status_code=401, detail="Failed to get access token")
            
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            
            # Get user info
            user_response = await http_client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Failed to get user info")
            
            user_info = user_response.json()
            
        except httpx.RequestError as e:
            logger.error(f"Google OAuth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication service error")
    
    # Create or get user
    user_id = await get_or_create_user(
        email=user_info["email"],
        name=user_info.get("name", user_info["email"].split("@")[0]),
        picture=user_info.get("picture"),
        provider="google"
    )
    
    # Create session
    session_token = await create_user_session(user_id, response)
    
    # Get user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"user": user_doc, "session_token": session_token}

# GitHub OAuth Routes
@api_router.get("/auth/github")
async def github_login(redirect_uri: Optional[str] = None):
    """Initiate GitHub OAuth login"""
    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    callback_url = f"{FRONTEND_URL}/auth/callback/github"
    state = redirect_uri or "/dashboard"
    
    params = {
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": callback_url,
        "scope": "user:email read:user",
        "state": state
    }
    
    auth_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    return {"auth_url": auth_url}

@api_router.post("/auth/github/callback")
async def github_callback(request: Request, response: Response):
    """Handle GitHub OAuth callback"""
    body = await request.json()
    code = body.get("code")
    
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code required")
    
    # Exchange code for tokens
    async with httpx.AsyncClient() as http_client:
        try:
            token_response = await http_client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code
                },
                headers={"Accept": "application/json"}
            )
            
            if token_response.status_code != 200:
                logger.error(f"GitHub token error: {token_response.text}")
                raise HTTPException(status_code=401, detail="Failed to get access token")
            
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            
            if not access_token:
                logger.error(f"GitHub token response: {tokens}")
                raise HTTPException(status_code=401, detail="No access token received")
            
            # Get user info
            user_response = await http_client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json"
                }
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Failed to get user info")
            
            user_info = user_response.json()
            
            # Get user email (might be private)
            email = user_info.get("email")
            if not email:
                emails_response = await http_client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/vnd.github.v3+json"
                    }
                )
                if emails_response.status_code == 200:
                    emails = emails_response.json()
                    primary_email = next((e for e in emails if e.get("primary")), None)
                    if primary_email:
                        email = primary_email["email"]
                    elif emails:
                        email = emails[0]["email"]
            
            if not email:
                raise HTTPException(status_code=400, detail="Unable to get email from GitHub")
            
        except httpx.RequestError as e:
            logger.error(f"GitHub OAuth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication service error")
    
    # Create or get user
    user_id = await get_or_create_user(
        email=email,
        name=user_info.get("name") or user_info.get("login", email.split("@")[0]),
        picture=user_info.get("avatar_url"),
        provider="github"
    )
    
    # Create session
    session_token = await create_user_session(user_id, response)
    
    # Get user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"user": user_doc, "session_token": session_token}

# ========================
# Email/Password Auth Routes
# ========================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@api_router.post("/auth/register")
async def register(request: RegisterRequest):
    """Register a new user with email and password"""
    now = datetime.now(timezone.utc)
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please sign in.")
    
    # Validate password strength
    if len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # Hash password
    password_hash = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    new_user_data = {
        "user_id": user_id,
        "email": request.email,
        "name": request.name,
        "picture": None,
        "password_hash": password_hash,
        "role": "student",
        "bio": None,
        "skills": [],
        "social_links": {
            "github": "",
            "linkedin": "",
            "twitter": "",
            "website": ""
        },
        "auth_provider": "email",
        "is_verified": False,  # Email users need verification
        "is_instructor": False,
        "total_purchases": 0,
        "total_enrollments": 0,
        "login_count": 0,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
        "last_login": None
    }
    
    await db.users.insert_one(new_user_data)
    logger.info(f"New user registered via email: {request.email}")
    
    # Create welcome notification
    notification = {
        "notification_id": f"notif_{uuid.uuid4().hex[:12]}",
        "user_id": user_id,
        "type": "system",
        "title": "Welcome to CodeLearnHub!",
        "message": f"Hi {request.name}! Welcome to CodeLearnHub. Start exploring our projects and courses.",
        "action_url": "/courses",
        "is_read": False,
        "is_email_sent": False,
        "created_at": now.isoformat()
    }
    await db.notifications.insert_one(notification)
    
    return {"message": "Registration successful. Please sign in.", "user_id": user_id}

@api_router.post("/auth/login")
async def login(request: LoginRequest, response: Response):
    """Login with email and password"""
    now = datetime.now(timezone.utc)
    
    # Find user by email
    user_doc = await db.users.find_one({"email": request.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user registered with OAuth
    if user_doc.get("auth_provider") in ["google", "github"]:
        provider = user_doc.get("auth_provider").capitalize()
        raise HTTPException(
            status_code=400, 
            detail=f"This account uses {provider} sign-in. Please use the {provider} button to sign in."
        )
    
    # Verify password
    password_hash = user_doc.get("password_hash")
    if not password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not bcrypt.checkpw(request.password.encode('utf-8'), password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update last login
    await db.users.update_one(
        {"user_id": user_doc["user_id"]},
        {
            "$set": {
                "last_login": now.isoformat(),
                "updated_at": now.isoformat()
            },
            "$inc": {"login_count": 1}
        }
    )
    
    # Create session
    session_token = await create_user_session(user_doc["user_id"], response)
    
    # Get updated user (without password_hash)
    user_data = await db.users.find_one({"user_id": user_doc["user_id"]}, {"_id": 0, "password_hash": 0})
    
    logger.info(f"User logged in via email: {request.email}")
    
    return {"user": user_data, "session_token": session_token}

# Keep the old session endpoint for backwards compatibility
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for session_token (deprecated - kept for compatibility)"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth API
    async with httpx.AsyncClient() as http_client:
        try:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session_id")
            
            auth_data = auth_response.json()
        except Exception as e:
            logger.error(f"Auth error: {e}")
            raise HTTPException(status_code=500, detail="Authentication service error")
    
    # Get or create user
    user_id = await get_or_create_user(
        email=auth_data["email"],
        name=auth_data["name"],
        picture=auth_data.get("picture"),
        provider="emergent"
    )
    
    # Create session
    session_token = await create_user_session(user_id, response)
    
    # Get updated user
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"user": user_doc, "session_token": session_token}

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Return full user data from database
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user_doc

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/", samesite="none", secure=True)
    return {"message": "Logged out"}

@api_router.put("/auth/profile")
async def update_profile(request: Request, user: User = Depends(require_auth)):
    """Update user profile"""
    body = await request.json()
    update_fields = {}
    now = datetime.now(timezone.utc)
    
    # Allowed fields for user update
    allowed_fields = ["name", "bio", "skills", "social_links"]
    
    for field in allowed_fields:
        if field in body:
            update_fields[field] = body[field]
    
    if update_fields:
        update_fields["updated_at"] = now.isoformat()
        await db.users.update_one({"user_id": user.user_id}, {"$set": update_fields})
    
    user_doc = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    return user_doc

# ========================
# Projects Routes
# ========================

@api_router.get("/projects")
async def get_projects(
    category: Optional[str] = None,
    tech: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None
):
    """Get all projects with filters"""
    query = {"is_active": True}
    
    if category:
        query["category"] = category
    if tech:
        query["tech_stack"] = {"$in": [tech]}
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        query["price"] = {**query.get("price", {}), "$lte": max_price}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    projects = await db.projects.find(query, {"_id": 0}).to_list(100)
    return projects

@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get single project"""
    project = await db.projects.find_one({"project_id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@api_router.post("/projects")
async def create_project(project: ProjectCreate, user: User = Depends(require_admin)):
    """Create new project (admin only)"""
    new_project = Project(**project.model_dump())
    project_dict = new_project.model_dump()
    project_dict["created_at"] = project_dict["created_at"].isoformat()
    
    await db.projects.insert_one(project_dict)
    return {"project_id": new_project.project_id}

@api_router.put("/projects/{project_id}")
async def update_project(project_id: str, request: Request, user: User = Depends(require_admin)):
    """Update project (admin only)"""
    body = await request.json()
    
    result = await db.projects.update_one(
        {"project_id": project_id},
        {"$set": body}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project updated"}

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user: User = Depends(require_admin)):
    """Delete project (admin only)"""
    result = await db.projects.update_one(
        {"project_id": project_id},
        {"$set": {"is_active": False}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted"}

# ========================
# Project Files Routes
# ========================

@api_router.get("/projects/{project_id}/files")
async def get_project_files(project_id: str, request: Request):
    """Get project file tree (requires purchase)"""
    user = await get_current_user(request)
    
    # Check if user has purchased or is admin
    if user:
        if user.role != "admin":
            purchase = await db.purchases.find_one({
                "user_id": user.user_id,
                "project_id": project_id,
                "status": "completed"
            })
            if not purchase:
                raise HTTPException(status_code=403, detail="Purchase required to access files")
    else:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Get project file structure
    project_path = PROJECTS_DIR / project_id
    if not project_path.exists():
        # Return sample structure for demo
        return {
            "name": project_id,
            "type": "folder",
            "children": [
                {"name": "src", "type": "folder", "children": [
                    {"name": "index.js", "type": "file"},
                    {"name": "App.js", "type": "file"},
                    {"name": "styles.css", "type": "file"}
                ]},
                {"name": "package.json", "type": "file"},
                {"name": "README.md", "type": "file"}
            ]
        }
    
    def build_tree(path: Path) -> dict:
        if path.is_file():
            return {"name": path.name, "type": "file"}
        return {
            "name": path.name,
            "type": "folder",
            "children": [build_tree(child) for child in sorted(path.iterdir())]
        }
    
    return build_tree(project_path)

@api_router.get("/projects/{project_id}/file/{file_path:path}")
async def get_project_file(project_id: str, file_path: str, request: Request):
    """Get project file content (requires purchase)"""
    user = await get_current_user(request)
    
    # Check if user has purchased or is admin
    if user:
        if user.role != "admin":
            purchase = await db.purchases.find_one({
                "user_id": user.user_id,
                "project_id": project_id,
                "status": "completed"
            })
            if not purchase:
                raise HTTPException(status_code=403, detail="Purchase required to access files")
    else:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Get file content
    full_path = PROJECTS_DIR / project_id / file_path
    
    # Return sample content for demo
    sample_files = {
        "src/index.js": 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./styles.css";\n\nconst root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<App />);',
        "src/App.js": 'import React, { useState } from "react";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div className="app">\n      <h1>Welcome to My App</h1>\n      <button onClick={() => setCount(c => c + 1)}>\n        Count: {count}\n      </button>\n    </div>\n  );\n}',
        "src/styles.css": ".app {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  font-family: sans-serif;\n}\n\nbutton {\n  padding: 12px 24px;\n  font-size: 16px;\n  cursor: pointer;\n}",
        "package.json": '{\n  "name": "sample-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}',
        "README.md": "# Sample Project\n\nThis is a sample React project.\n\n## Installation\n\n```bash\nnpm install\nnpm start\n```\n\n## Features\n\n- React 18\n- Modern ES6+\n- Responsive design"
    }
    
    if file_path in sample_files:
        return {"content": sample_files[file_path], "language": file_path.split(".")[-1]}
    
    if not full_path.exists() or not full_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        async with aiofiles.open(full_path, "r") as f:
            content = await f.read()
        extension = file_path.split(".")[-1] if "." in file_path else "txt"
        return {"content": content, "language": extension}
    except Exception:
        raise HTTPException(status_code=500, detail="Error reading file")

@api_router.get("/projects/{project_id}/download")
async def download_project(project_id: str, request: Request):
    """Download project as ZIP (requires purchase)"""
    user = await require_auth(request)
    
    # Check purchase
    if user.role != "admin":
        purchase = await db.purchases.find_one({
            "user_id": user.user_id,
            "project_id": project_id,
            "status": "completed"
        })
        if not purchase:
            raise HTTPException(status_code=403, detail="Purchase required")
        
        # Update download count
        await db.purchases.update_one(
            {"purchase_id": purchase["purchase_id"]},
            {"$inc": {"download_count": 1}}
        )
    
    # Create ZIP in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        project_path = PROJECTS_DIR / project_id
        if project_path.exists():
            for file_path in project_path.rglob("*"):
                if file_path.is_file():
                    zf.write(file_path, file_path.relative_to(project_path))
        else:
            # Create sample files for demo
            zf.writestr("src/index.js", 'import React from "react";\nconsole.log("Hello");')
            zf.writestr("src/App.js", 'export default function App() { return <div>Hello</div>; }')
            zf.writestr("package.json", '{"name": "project", "version": "1.0.0"}')
            zf.writestr("README.md", "# Project\n\nSample project.")
    
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={project_id}.zip"}
    )

# ========================
# Courses Routes
# ========================

@api_router.get("/courses")
async def get_courses(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    is_free: Optional[bool] = None,
    search: Optional[str] = None
):
    """Get all courses with filters"""
    query = {"is_active": True}
    
    if category:
        query["category"] = category
    if difficulty:
        query["difficulty"] = difficulty
    if is_free is not None:
        query["is_free"] = is_free
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    courses = await db.courses.find(query, {"_id": 0}).to_list(100)
    return courses

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str):
    """Get single course with lessons"""
    course = await db.courses.find_one({"course_id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    lessons = await db.lessons.find(
        {"course_id": course_id},
        {"_id": 0}
    ).sort("order", 1).to_list(100)
    
    course["lessons"] = lessons
    return course

@api_router.post("/courses")
async def create_course(course: CourseCreate, user: User = Depends(require_admin)):
    """Create new course (admin only)"""
    new_course = Course(**course.model_dump(), instructor_id=user.user_id)
    course_dict = new_course.model_dump()
    course_dict["created_at"] = course_dict["created_at"].isoformat()
    
    await db.courses.insert_one(course_dict)
    return {"course_id": new_course.course_id}

@api_router.post("/courses/{course_id}/lessons")
async def add_lesson(course_id: str, request: Request, user: User = Depends(require_admin)):
    """Add lesson to course (admin only)"""
    body = await request.json()
    
    # Get next order number
    last_lesson = await db.lessons.find_one(
        {"course_id": course_id},
        sort=[("order", -1)]
    )
    next_order = (last_lesson["order"] + 1) if last_lesson else 1
    
    lesson = Lesson(
        course_id=course_id,
        title=body["title"],
        content_type=body.get("content_type", "text"),
        content_url=body.get("content_url"),
        content_text=body.get("content_text"),
        duration=body.get("duration", "0"),
        order=body.get("order", next_order),
        is_free_preview=body.get("is_free_preview", False)
    )
    
    lesson_dict = lesson.model_dump()
    await db.lessons.insert_one(lesson_dict)
    
    # Update course lessons count
    await db.courses.update_one(
        {"course_id": course_id},
        {"$inc": {"lessons_count": 1}}
    )
    
    return {"lesson_id": lesson.lesson_id}

# ========================
# Enrollments Routes
# ========================

@api_router.get("/enrollments")
async def get_enrollments(user: User = Depends(require_auth)):
    """Get user's enrollments"""
    enrollments = await db.enrollments.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    
    # Get course details for each enrollment
    for enrollment in enrollments:
        course = await db.courses.find_one(
            {"course_id": enrollment["course_id"]},
            {"_id": 0}
        )
        enrollment["course"] = course
    
    return enrollments

@api_router.post("/enrollments")
async def create_enrollment(request: Request, user: User = Depends(require_auth)):
    """Enroll in a course"""
    body = await request.json()
    course_id = body.get("course_id")
    
    course = await db.courses.find_one({"course_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check existing enrollment
    existing = await db.enrollments.find_one({
        "user_id": user.user_id,
        "course_id": course_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    # Check if course is free or user has paid
    if not course.get("is_free", False):
        transaction = await db.transactions.find_one({
            "user_id": user.user_id,
            "item_id": course_id,
            "item_type": "course",
            "status": "completed"
        })
        if not transaction:
            raise HTTPException(status_code=402, detail="Payment required")
    
    enrollment = Enrollment(user_id=user.user_id, course_id=course_id)
    enrollment_dict = enrollment.model_dump()
    enrollment_dict["enrolled_date"] = enrollment_dict["enrolled_date"].isoformat()
    
    await db.enrollments.insert_one(enrollment_dict)
    await db.courses.update_one(
        {"course_id": course_id},
        {"$inc": {"enrolled_count": 1}}
    )
    
    return {"enrollment_id": enrollment.enrollment_id}

@api_router.put("/enrollments/{enrollment_id}/progress")
async def update_progress(enrollment_id: str, request: Request, user: User = Depends(require_auth)):
    """Update course progress"""
    body = await request.json()
    
    result = await db.enrollments.update_one(
        {"enrollment_id": enrollment_id, "user_id": user.user_id},
        {"$set": {"progress_percentage": body.get("progress", 0)}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    return {"message": "Progress updated"}

# ========================
# Purchases Routes
# ========================

@api_router.get("/purchases")
async def get_purchases(user: User = Depends(require_auth)):
    """Get user's purchases"""
    purchases = await db.purchases.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(100)
    
    # Get project details
    for purchase in purchases:
        project = await db.projects.find_one(
            {"project_id": purchase["project_id"]},
            {"_id": 0}
        )
        purchase["project"] = project
    
    return purchases

# ========================
# Payment Routes
# ========================

@api_router.post("/payments/create-order")
async def create_payment_order(request: Request, user: User = Depends(require_auth)):
    """Create Razorpay order"""
    body = await request.json()
    item_type = body.get("item_type")  # project or course
    item_id = body.get("item_id")
    
    # Get item and price
    if item_type == "project":
        item = await db.projects.find_one({"project_id": item_id})
    elif item_type == "course":
        item = await db.courses.find_one({"course_id": item_id})
    else:
        raise HTTPException(status_code=400, detail="Invalid item type")
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    amount = int(item["price"] * 100)  # Convert to paise
    
    # Create transaction record
    transaction = Transaction(
        user_id=user.user_id,
        amount=item["price"],
        payment_method="razorpay",
        item_type=item_type,
        item_id=item_id
    )
    
    if razorpay_client:
        # Create Razorpay order
        order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "transaction_id": transaction.transaction_id,
                "user_id": user.user_id,
                "item_type": item_type,
                "item_id": item_id
            }
        })
        transaction.razorpay_order_id = order["id"]
    else:
        # Demo mode - create mock order
        order = {
            "id": f"order_demo_{uuid.uuid4().hex[:12]}",
            "amount": amount,
            "currency": "INR"
        }
        transaction.razorpay_order_id = order["id"]
    
    transaction_dict = transaction.model_dump()
    transaction_dict["created_at"] = transaction_dict["created_at"].isoformat()
    await db.transactions.insert_one(transaction_dict)
    
    return {
        "order_id": order["id"],
        "amount": amount,
        "currency": "INR",
        "transaction_id": transaction.transaction_id,
        "key_id": RAZORPAY_KEY_ID or "demo_key"
    }

@api_router.post("/payments/verify")
async def verify_payment(request: Request, user: User = Depends(require_auth)):
    """Verify Razorpay payment"""
    body = await request.json()
    
    transaction_id = body.get("transaction_id")
    razorpay_payment_id = body.get("razorpay_payment_id")
    razorpay_order_id = body.get("razorpay_order_id")
    razorpay_signature = body.get("razorpay_signature")
    
    transaction = await db.transactions.find_one(
        {"transaction_id": transaction_id, "user_id": user.user_id}
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Verify signature (skip in demo mode)
    is_valid = True
    if razorpay_client and RAZORPAY_KEY_SECRET and razorpay_signature:
        try:
            razorpay_client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            })
        except Exception:
            is_valid = False
    
    if is_valid or razorpay_order_id.startswith("order_demo_"):
        # Update transaction
        await db.transactions.update_one(
            {"transaction_id": transaction_id},
            {"$set": {
                "status": "completed",
                "razorpay_payment_id": razorpay_payment_id
            }}
        )
        
        # Create purchase record for project
        if transaction["item_type"] == "project":
            license_key = f"LIC-{uuid.uuid4().hex[:8].upper()}-{uuid.uuid4().hex[:4].upper()}"
            purchase = Purchase(
                user_id=user.user_id,
                project_id=transaction["item_id"],
                transaction_id=transaction_id,
                amount=transaction["amount"],
                license_key=license_key
            )
            purchase_dict = purchase.model_dump()
            purchase_dict["purchase_date"] = purchase_dict["purchase_date"].isoformat()
            await db.purchases.insert_one(purchase_dict)
            
            # Update project downloads count
            await db.projects.update_one(
                {"project_id": transaction["item_id"]},
                {"$inc": {"downloads_count": 1}}
            )
        
        return {"status": "success", "message": "Payment verified"}
    
    # Mark as failed
    await db.transactions.update_one(
        {"transaction_id": transaction_id},
        {"$set": {"status": "failed"}}
    )
    raise HTTPException(status_code=400, detail="Payment verification failed")

# ========================
# Connections Routes
# ========================

@api_router.get("/connections")
async def get_connections(user: User = Depends(require_auth)):
    """Get user's connections"""
    connections = await db.connections.find(
        {"$or": [{"sender_id": user.user_id}, {"receiver_id": user.user_id}]},
        {"_id": 0}
    ).to_list(100)
    
    # Get user details for each connection
    for conn in connections:
        other_user_id = conn["receiver_id"] if conn["sender_id"] == user.user_id else conn["sender_id"]
        other_user = await db.users.find_one({"user_id": other_user_id}, {"_id": 0})
        conn["other_user"] = other_user
    
    return connections

@api_router.post("/connections")
async def create_connection(request: Request, user: User = Depends(require_auth)):
    """Send connection request"""
    body = await request.json()
    receiver_id = body.get("receiver_id")
    
    if receiver_id == user.user_id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")
    
    # Check existing connection
    existing = await db.connections.find_one({
        "$or": [
            {"sender_id": user.user_id, "receiver_id": receiver_id},
            {"sender_id": receiver_id, "receiver_id": user.user_id}
        ]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Connection already exists")
    
    connection = Connection(
        sender_id=user.user_id,
        receiver_id=receiver_id,
        message=body.get("message"),
        category=body.get("category", "general")
    )
    conn_dict = connection.model_dump()
    conn_dict["created_at"] = conn_dict["created_at"].isoformat()
    
    await db.connections.insert_one(conn_dict)
    return {"connection_id": connection.connection_id}

@api_router.put("/connections/{connection_id}")
async def update_connection(connection_id: str, request: Request, user: User = Depends(require_auth)):
    """Accept or reject connection"""
    body = await request.json()
    status = body.get("status")
    
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    update_data = {"status": status}
    if status == "accepted":
        update_data["accepted_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.connections.update_one(
        {"connection_id": connection_id, "receiver_id": user.user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    return {"message": f"Connection {status}"}

# ========================
# Messages Routes
# ========================

@api_router.get("/connections/{connection_id}/messages")
async def get_messages(connection_id: str, user: User = Depends(require_auth)):
    """Get messages for a connection"""
    # Verify user is part of connection
    connection = await db.connections.find_one({"connection_id": connection_id})
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    if user.user_id not in [connection["sender_id"], connection["receiver_id"]]:
        raise HTTPException(status_code=403, detail="Not part of this connection")
    
    messages = await db.messages.find(
        {"connection_id": connection_id},
        {"_id": 0}
    ).sort("sent_at", 1).to_list(100)
    
    return messages

@api_router.post("/connections/{connection_id}/messages")
async def send_message(connection_id: str, request: Request, user: User = Depends(require_auth)):
    """Send message"""
    body = await request.json()
    
    # Verify connection
    connection = await db.connections.find_one({
        "connection_id": connection_id,
        "status": "accepted"
    })
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found or not accepted")
    
    if user.user_id not in [connection["sender_id"], connection["receiver_id"]]:
        raise HTTPException(status_code=403, detail="Not part of this connection")
    
    message = Message(
        connection_id=connection_id,
        sender_id=user.user_id,
        content=body["content"],
        attachments=body.get("attachments", [])
    )
    msg_dict = message.model_dump()
    msg_dict["sent_at"] = msg_dict["sent_at"].isoformat()
    
    await db.messages.insert_one(msg_dict)
    return {"message_id": message.message_id}

# ========================
# Contact Routes
# ========================

@api_router.post("/contact")
async def submit_contact(request: Request):
    """Submit contact form"""
    body = await request.json()
    
    contact = ContactMessage(
        name=body["name"],
        email=body["email"],
        purpose=body.get("purpose", "general"),
        message=body["message"]
    )
    contact_dict = contact.model_dump()
    contact_dict["created_at"] = contact_dict["created_at"].isoformat()
    
    await db.contacts.insert_one(contact_dict)
    return {"message": "Message sent successfully"}

# ========================
# Blog Routes
# ========================

@api_router.get("/blog")
async def get_blog_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None
):
    """Get blog posts"""
    query = {"is_published": True}
    
    if category:
        query["category"] = category
    if tag:
        query["tags"] = {"$in": [tag]}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    return posts

@api_router.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    """Get single blog post"""
    post = await db.blog_posts.find_one({"post_id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment views
    await db.blog_posts.update_one({"post_id": post_id}, {"$inc": {"views": 1}})
    
    return post

@api_router.post("/blog")
async def create_blog_post(request: Request, user: User = Depends(require_admin)):
    """Create blog post (admin only)"""
    body = await request.json()
    
    post = BlogPost(
        title=body["title"],
        content=body["content"],
        excerpt=body.get("excerpt", body["content"][:200]),
        category=body.get("category", "general"),
        tags=body.get("tags", []),
        author_id=user.user_id,
        thumbnail=body.get("thumbnail")
    )
    post_dict = post.model_dump()
    post_dict["created_at"] = post_dict["created_at"].isoformat()
    post_dict["updated_at"] = post_dict["updated_at"].isoformat()
    
    await db.blog_posts.insert_one(post_dict)
    return {"post_id": post.post_id}

# ========================
# Admin Routes
# ========================

@api_router.get("/admin/stats")
async def get_admin_stats(user: User = Depends(require_admin)):
    """Get admin dashboard stats"""
    total_users = await db.users.count_documents({})
    total_projects = await db.projects.count_documents({"is_active": True})
    total_courses = await db.courses.count_documents({"is_active": True})
    total_enrollments = await db.enrollments.count_documents({})
    total_purchases = await db.purchases.count_documents({"status": "completed"})
    
    # Calculate revenue
    revenue_pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    revenue_result = await db.transactions.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_purchases": total_purchases,
        "total_revenue": total_revenue
    }

@api_router.get("/admin/users")
async def get_all_users(user: User = Depends(require_admin)):
    """Get all users (admin only)"""
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    return users

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, request: Request, admin: User = Depends(require_admin)):
    """Update user role (admin only)"""
    body = await request.json()
    new_role = body.get("role")
    
    if new_role not in ["admin", "student", "buyer", "guest"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"role": new_role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Role updated"}

@api_router.get("/admin/contacts")
async def get_contacts(user: User = Depends(require_admin)):
    """Get all contact messages (admin only)"""
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return contacts

@api_router.get("/admin/transactions")
async def get_transactions(user: User = Depends(require_admin)):
    """Get all transactions (admin only)"""
    transactions = await db.transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return transactions

# ========================
# Health Check
# ========================

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
