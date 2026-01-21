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

class SupportTicket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ticket_id: str = Field(default_factory=lambda: f"ticket_{uuid.uuid4().hex[:12]}")
    user_id: Optional[str] = None  # Optional for guest submissions
    name: str
    email: str
    subject: str
    category: str  # technical, billing, account, feature, bug, other
    priority: str = "medium"  # low, medium, high, urgent
    description: str
    attachments: List[str] = []
    status: str = "open"  # open, in_progress, resolved, closed
    assigned_to: Optional[str] = None
    response: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved_at: Optional[datetime] = None

class SupportTicketCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    category: str
    priority: str = "medium"
    description: str

# ========================
# Documentation Models
# ========================

class DocCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    category_id: str = Field(default_factory=lambda: f"doccat_{uuid.uuid4().hex[:12]}")
    name: str
    slug: str
    parent_id: Optional[str] = None
    icon: str = "BookOpen"
    description: str
    order: int = 0
    color: str = "#06b6d4"  # Cyan default
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DocArticle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    article_id: str = Field(default_factory=lambda: f"doc_{uuid.uuid4().hex[:12]}")
    category_id: str
    title: str
    slug: str
    content: str  # Markdown content
    excerpt: str
    author_id: Optional[str] = None
    difficulty_level: str = "beginner"  # beginner, intermediate, advanced
    estimated_reading_time: int = 5  # minutes
    tags: List[str] = []
    prerequisites: List[str] = []
    related_articles: List[str] = []
    code_examples: List[dict] = []
    external_links: List[dict] = []
    view_count: int = 0
    helpful_count: int = 0
    not_helpful_count: int = 0
    is_published: bool = True
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExternalResource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    resource_id: str = Field(default_factory=lambda: f"extres_{uuid.uuid4().hex[:12]}")
    platform_name: str
    description: str
    url: str
    logo_url: Optional[str] = None
    pricing_model: str = "free"  # free, freemium, paid, student_discount
    category: str
    subcategory: Optional[str] = None
    topics: List[str] = []
    best_for: List[str] = []  # beginner, intermediate, advanced
    rating: float = 0.0
    review_count: int = 0
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LearningPath(BaseModel):
    model_config = ConfigDict(extra="ignore")
    path_id: str = Field(default_factory=lambda: f"path_{uuid.uuid4().hex[:12]}")
    title: str
    slug: str
    description: str
    difficulty_level: str = "beginner"
    estimated_duration: str = "8 weeks"
    topics: List[str] = []
    steps: List[dict] = []  # {order, title, description, articles, resources, duration}
    prerequisites: List[str] = []
    outcomes: List[str] = []
    enrolled_count: int = 0
    completion_rate: float = 0.0
    is_featured: bool = False
    is_published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserDocProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    progress_id: str = Field(default_factory=lambda: f"prog_{uuid.uuid4().hex[:12]}")
    user_id: str
    article_id: str
    progress_percentage: float = 0.0
    is_completed: bool = False
    is_bookmarked: bool = False
    notes: Optional[str] = None
    last_read_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class UserPathProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    progress_id: str = Field(default_factory=lambda: f"pathprog_{uuid.uuid4().hex[:12]}")
    user_id: str
    path_id: str
    current_step: int = 0
    completed_steps: List[int] = []
    progress_percentage: float = 0.0
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class DocComment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    comment_id: str = Field(default_factory=lambda: f"doccom_{uuid.uuid4().hex[:12]}")
    article_id: str
    user_id: str
    content: str
    parent_id: Optional[str] = None
    is_approved: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
# Notifications Routes
# ========================

@api_router.get("/notifications")
async def get_notifications(
    user: User = Depends(require_auth),
    limit: int = 20,
    offset: int = 0,
    unread_only: bool = False
):
    """Get user notifications"""
    query = {"user_id": user.user_id}
    if unread_only:
        query["is_read"] = False
    
    notifications = await db.notifications.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(length=limit)
    
    # Get total count
    total = await db.notifications.count_documents({"user_id": user.user_id})
    unread_count = await db.notifications.count_documents({"user_id": user.user_id, "is_read": False})
    
    return {
        "notifications": notifications,
        "total": total,
        "unread_count": unread_count
    }

@api_router.get("/notifications/unread-count")
async def get_unread_count(user: User = Depends(require_auth)):
    """Get count of unread notifications"""
    count = await db.notifications.count_documents({"user_id": user.user_id, "is_read": False})
    return {"unread_count": count}

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user: User = Depends(require_auth)):
    """Mark a notification as read"""
    result = await db.notifications.update_one(
        {"notification_id": notification_id, "user_id": user.user_id},
        {"$set": {"is_read": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}

@api_router.put("/notifications/read-all")
async def mark_all_notifications_read(user: User = Depends(require_auth)):
    """Mark all notifications as read"""
    await db.notifications.update_many(
        {"user_id": user.user_id, "is_read": False},
        {"$set": {"is_read": True}}
    )
    return {"message": "All notifications marked as read"}

@api_router.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: str, user: User = Depends(require_auth)):
    """Delete a notification"""
    result = await db.notifications.delete_one(
        {"notification_id": notification_id, "user_id": user.user_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}

@api_router.delete("/notifications")
async def clear_all_notifications(user: User = Depends(require_auth)):
    """Clear all notifications for user"""
    await db.notifications.delete_many({"user_id": user.user_id})
    return {"message": "All notifications cleared"}

# ========================
# Support Tickets Routes
# ========================

@api_router.post("/support/tickets")
async def create_support_ticket(
    ticket_data: SupportTicketCreate,
    request: Request
):
    """Create a new support ticket (works for both authenticated and guest users)"""
    user = await get_current_user(request)
    
    ticket = SupportTicket(
        user_id=user.user_id if user else None,
        name=ticket_data.name,
        email=ticket_data.email,
        subject=ticket_data.subject,
        category=ticket_data.category,
        priority=ticket_data.priority,
        description=ticket_data.description
    )
    
    ticket_dict = ticket.model_dump()
    ticket_dict["created_at"] = ticket_dict["created_at"].isoformat()
    ticket_dict["updated_at"] = ticket_dict["updated_at"].isoformat()
    
    await db.support_tickets.insert_one(ticket_dict)
    
    logger.info(f"Support ticket created: {ticket.ticket_id} for {ticket_data.email}")
    
    return {
        "message": "Support ticket created successfully",
        "ticket_id": ticket.ticket_id,
        "status": "open"
    }

@api_router.get("/support/tickets")
async def get_user_tickets(
    user: User = Depends(require_auth),
    status: Optional[str] = None
):
    """Get all support tickets for authenticated user"""
    query = {"user_id": user.user_id}
    if status:
        query["status"] = status
    
    tickets = await db.support_tickets.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).to_list(length=100)
    
    return {"tickets": tickets}

@api_router.get("/support/tickets/{ticket_id}")
async def get_ticket_details(
    ticket_id: str,
    user: User = Depends(require_auth)
):
    """Get details of a specific support ticket"""
    ticket = await db.support_tickets.find_one(
        {"ticket_id": ticket_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return ticket

@api_router.put("/support/tickets/{ticket_id}/close")
async def close_ticket(
    ticket_id: str,
    user: User = Depends(require_auth)
):
    """Close a support ticket"""
    result = await db.support_tickets.update_one(
        {"ticket_id": ticket_id, "user_id": user.user_id},
        {
            "$set": {
                "status": "closed",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return {"message": "Ticket closed successfully"}

# Admin endpoints for support tickets
@api_router.get("/admin/support/tickets")
async def get_all_tickets(
    admin: User = Depends(require_admin),
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Admin: Get all support tickets"""
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if priority:
        query["priority"] = priority
    
    tickets = await db.support_tickets.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(length=limit)
    
    total = await db.support_tickets.count_documents(query)
    
    return {"tickets": tickets, "total": total}

@api_router.put("/admin/support/tickets/{ticket_id}/respond")
async def respond_to_ticket(
    ticket_id: str,
    response: str,
    status: str = "in_progress",
    admin: User = Depends(require_admin)
):
    """Admin: Respond to a support ticket"""
    update_data = {
        "response": response,
        "status": status,
        "assigned_to": admin.user_id,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if status == "resolved":
        update_data["resolved_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.support_tickets.update_one(
        {"ticket_id": ticket_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return {"message": "Response sent successfully"}

# ========================
# Documentation Routes
# ========================

@api_router.get("/docs/categories")
async def get_doc_categories():
    """Get all documentation categories"""
    categories = await db.doc_categories.find(
        {},
        {"_id": 0}
    ).sort("order", 1).to_list(length=100)
    return {"categories": categories}

@api_router.get("/docs/categories/{slug}")
async def get_doc_category(slug: str):
    """Get a specific category with its articles"""
    category = await db.doc_categories.find_one({"slug": slug}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    articles = await db.doc_articles.find(
        {"category_id": category["category_id"], "is_published": True},
        {"_id": 0, "content": 0}
    ).sort("created_at", -1).to_list(length=100)
    
    subcategories = await db.doc_categories.find(
        {"parent_id": category["category_id"]},
        {"_id": 0}
    ).sort("order", 1).to_list(length=50)
    
    return {"category": category, "articles": articles, "subcategories": subcategories}

@api_router.get("/docs/articles")
async def get_doc_articles(
    category_id: Optional[str] = None,
    difficulty: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0
):
    """Get documentation articles with filters"""
    query = {"is_published": True}
    
    if category_id:
        query["category_id"] = category_id
    if difficulty:
        query["difficulty_level"] = difficulty
    if tag:
        query["tags"] = {"$in": [tag]}
    if featured:
        query["is_featured"] = True
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    articles = await db.doc_articles.find(
        query,
        {"_id": 0, "content": 0}
    ).sort("created_at", -1).skip(offset).limit(limit).to_list(length=limit)
    
    total = await db.doc_articles.count_documents(query)
    
    return {"articles": articles, "total": total}

@api_router.get("/docs/articles/{slug}")
async def get_doc_article(slug: str, request: Request):
    """Get a specific article by slug"""
    article = await db.doc_articles.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count
    await db.doc_articles.update_one(
        {"slug": slug},
        {"$inc": {"view_count": 1}}
    )
    
    # Get category info
    category = await db.doc_categories.find_one(
        {"category_id": article["category_id"]},
        {"_id": 0}
    )
    
    # Get related articles
    related = []
    if article.get("related_articles"):
        related = await db.doc_articles.find(
            {"article_id": {"$in": article["related_articles"]}, "is_published": True},
            {"_id": 0, "content": 0}
        ).to_list(length=5)
    
    # Get user progress if authenticated
    user = await get_current_user(request)
    progress = None
    if user:
        progress = await db.user_doc_progress.find_one(
            {"user_id": user.user_id, "article_id": article["article_id"]},
            {"_id": 0}
        )
    
    return {"article": article, "category": category, "related": related, "user_progress": progress}

@api_router.get("/docs/search")
async def search_docs(q: str, limit: int = 20):
    """Search documentation articles"""
    if not q or len(q) < 2:
        return {"results": [], "total": 0}
    
    query = {
        "is_published": True,
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
            {"tags": {"$in": [q]}}
        ]
    }
    
    articles = await db.doc_articles.find(
        query,
        {"_id": 0, "article_id": 1, "title": 1, "slug": 1, "excerpt": 1, "category_id": 1, "difficulty_level": 1}
    ).limit(limit).to_list(length=limit)
    
    return {"results": articles, "total": len(articles)}

@api_router.get("/docs/featured")
async def get_featured_docs():
    """Get featured documentation articles"""
    articles = await db.doc_articles.find(
        {"is_published": True, "is_featured": True},
        {"_id": 0, "content": 0}
    ).sort("view_count", -1).limit(6).to_list(length=6)
    
    return {"articles": articles}

@api_router.get("/docs/popular")
async def get_popular_docs():
    """Get most popular documentation articles"""
    articles = await db.doc_articles.find(
        {"is_published": True},
        {"_id": 0, "content": 0}
    ).sort("view_count", -1).limit(10).to_list(length=10)
    
    return {"articles": articles}

@api_router.get("/docs/recent")
async def get_recent_docs():
    """Get recently updated documentation articles"""
    articles = await db.doc_articles.find(
        {"is_published": True},
        {"_id": 0, "content": 0}
    ).sort("updated_at", -1).limit(10).to_list(length=10)
    
    return {"articles": articles}

# User progress endpoints
@api_router.post("/docs/progress/{article_id}")
async def update_article_progress(
    article_id: str,
    progress: float = 0.0,
    completed: bool = False,
    user: User = Depends(require_auth)
):
    """Update user's reading progress on an article"""
    progress_data = {
        "user_id": user.user_id,
        "article_id": article_id,
        "progress_percentage": min(progress, 100.0),
        "is_completed": completed,
        "last_read_at": datetime.now(timezone.utc).isoformat()
    }
    
    if completed:
        progress_data["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.user_doc_progress.update_one(
        {"user_id": user.user_id, "article_id": article_id},
        {"$set": progress_data, "$setOnInsert": {"progress_id": f"prog_{uuid.uuid4().hex[:12]}"}},
        upsert=True
    )
    
    return {"message": "Progress updated"}

@api_router.post("/docs/bookmark/{article_id}")
async def toggle_bookmark(article_id: str, user: User = Depends(require_auth)):
    """Toggle bookmark on an article"""
    existing = await db.user_doc_progress.find_one(
        {"user_id": user.user_id, "article_id": article_id}
    )
    
    new_bookmark_state = not existing.get("is_bookmarked", False) if existing else True
    
    await db.user_doc_progress.update_one(
        {"user_id": user.user_id, "article_id": article_id},
        {
            "$set": {"is_bookmarked": new_bookmark_state, "last_read_at": datetime.now(timezone.utc).isoformat()},
            "$setOnInsert": {"progress_id": f"prog_{uuid.uuid4().hex[:12]}", "progress_percentage": 0.0, "is_completed": False}
        },
        upsert=True
    )
    
    return {"bookmarked": new_bookmark_state}

@api_router.get("/docs/bookmarks")
async def get_bookmarks(user: User = Depends(require_auth)):
    """Get user's bookmarked articles"""
    progress_docs = await db.user_doc_progress.find(
        {"user_id": user.user_id, "is_bookmarked": True},
        {"_id": 0}
    ).to_list(length=100)
    
    article_ids = [p["article_id"] for p in progress_docs]
    articles = await db.doc_articles.find(
        {"article_id": {"$in": article_ids}},
        {"_id": 0, "content": 0}
    ).to_list(length=100)
    
    return {"bookmarks": articles}

@api_router.get("/docs/user-progress")
async def get_user_doc_progress(user: User = Depends(require_auth)):
    """Get user's overall documentation progress"""
    # Get article progress
    article_progress = await db.user_doc_progress.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(length=500)
    
    completed_articles = [p for p in article_progress if p.get("is_completed")]
    bookmarked_articles = [p for p in article_progress if p.get("is_bookmarked")]
    
    # Get learning path progress
    path_progress = await db.user_path_progress.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(length=50)
    
    # Get recently read articles
    recent_progress = await db.user_doc_progress.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("last_read_at", -1).limit(5).to_list(length=5)
    
    recent_article_ids = [p["article_id"] for p in recent_progress]
    recent_articles = []
    if recent_article_ids:
        recent_articles = await db.doc_articles.find(
            {"article_id": {"$in": recent_article_ids}},
            {"_id": 0, "content": 0}
        ).to_list(length=5)
    
    return {
        "total_articles_read": len(article_progress),
        "completed_articles": len(completed_articles),
        "bookmarked_count": len(bookmarked_articles),
        "enrolled_paths": len(path_progress),
        "path_progress": path_progress,
        "recent_articles": recent_articles
    }

@api_router.get("/docs/user-paths")
async def get_user_enrolled_paths(user: User = Depends(require_auth)):
    """Get user's enrolled learning paths with progress"""
    progress_docs = await db.user_path_progress.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(length=50)
    
    path_ids = [p["path_id"] for p in progress_docs]
    paths = await db.learning_paths.find(
        {"path_id": {"$in": path_ids}},
        {"_id": 0}
    ).to_list(length=50)
    
    # Combine path data with progress
    result = []
    for path in paths:
        progress = next((p for p in progress_docs if p["path_id"] == path["path_id"]), None)
        result.append({
            **path,
            "user_progress": progress
        })
    
    return {"enrolled_paths": result}

@api_router.post("/docs/articles/{article_id}/feedback")
async def submit_article_feedback(
    article_id: str,
    helpful: bool,
    request: Request
):
    """Submit feedback on an article (helpful/not helpful)"""
    field = "helpful_count" if helpful else "not_helpful_count"
    await db.doc_articles.update_one(
        {"article_id": article_id},
        {"$inc": {field: 1}}
    )
    return {"message": "Feedback submitted"}

# External Resources endpoints
@api_router.get("/docs/resources")
async def get_external_resources(
    category: Optional[str] = None,
    pricing: Optional[str] = None,
    best_for: Optional[str] = None,
    featured: Optional[bool] = None
):
    """Get external learning resources"""
    query = {}
    if category:
        query["category"] = category
    if pricing:
        query["pricing_model"] = pricing
    if best_for:
        query["best_for"] = {"$in": [best_for]}
    if featured:
        query["is_featured"] = True
    
    resources = await db.external_resources.find(query, {"_id": 0}).to_list(length=200)
    return {"resources": resources}

@api_router.get("/docs/resources/categories")
async def get_resource_categories():
    """Get distinct resource categories"""
    categories = await db.external_resources.distinct("category")
    return {"categories": categories}

# Learning Paths endpoints
@api_router.get("/docs/paths")
async def get_learning_paths(
    difficulty: Optional[str] = None,
    featured: Optional[bool] = None
):
    """Get all learning paths"""
    query = {"is_published": True}
    if difficulty:
        query["difficulty_level"] = difficulty
    if featured:
        query["is_featured"] = True
    
    paths = await db.learning_paths.find(query, {"_id": 0}).sort("enrolled_count", -1).to_list(length=50)
    return {"paths": paths}

@api_router.get("/docs/paths/{slug}")
async def get_learning_path(slug: str, request: Request):
    """Get a specific learning path"""
    path = await db.learning_paths.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    
    # Get user progress if authenticated
    user = await get_current_user(request)
    progress = None
    if user:
        progress = await db.user_path_progress.find_one(
            {"user_id": user.user_id, "path_id": path["path_id"]},
            {"_id": 0}
        )
    
    return {"path": path, "user_progress": progress}

@api_router.post("/docs/paths/{path_id}/enroll")
async def enroll_in_path(path_id: str, user: User = Depends(require_auth)):
    """Enroll in a learning path"""
    existing = await db.user_path_progress.find_one(
        {"user_id": user.user_id, "path_id": path_id}
    )
    
    if existing:
        return {"message": "Already enrolled", "progress": existing}
    
    progress = UserPathProgress(user_id=user.user_id, path_id=path_id)
    progress_dict = progress.model_dump()
    progress_dict["started_at"] = progress_dict["started_at"].isoformat()
    
    await db.user_path_progress.insert_one(progress_dict)
    await db.learning_paths.update_one({"path_id": path_id}, {"$inc": {"enrolled_count": 1}})
    
    return {"message": "Enrolled successfully"}

@api_router.put("/docs/paths/{path_id}/progress")
async def update_path_progress(
    path_id: str,
    step: int,
    user: User = Depends(require_auth)
):
    """Update progress on a learning path"""
    path = await db.learning_paths.find_one({"path_id": path_id}, {"_id": 0})
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    
    total_steps = len(path.get("steps", []))
    progress_percentage = (step / total_steps * 100) if total_steps > 0 else 0
    
    update_data = {
        "current_step": step,
        "progress_percentage": progress_percentage,
        "$addToSet": {"completed_steps": step}
    }
    
    if step >= total_steps:
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.user_path_progress.update_one(
        {"user_id": user.user_id, "path_id": path_id},
        {"$set": update_data}
    )
    
    return {"message": "Progress updated", "progress_percentage": progress_percentage}

# Comments on documentation
@api_router.get("/docs/articles/{article_id}/comments")
async def get_article_comments(article_id: str):
    """Get comments on an article"""
    comments = await db.doc_comments.find(
        {"article_id": article_id, "is_approved": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(length=100)
    
    # Get user info for each comment
    for comment in comments:
        user = await db.users.find_one({"user_id": comment["user_id"]}, {"_id": 0, "name": 1, "picture": 1})
        comment["user"] = user
    
    return {"comments": comments}

@api_router.post("/docs/articles/{article_id}/comments")
async def add_article_comment(
    article_id: str,
    content: str,
    parent_id: Optional[str] = None,
    user: User = Depends(require_auth)
):
    """Add a comment to an article"""
    comment = DocComment(
        article_id=article_id,
        user_id=user.user_id,
        content=content,
        parent_id=parent_id
    )
    
    comment_dict = comment.model_dump()
    comment_dict["created_at"] = comment_dict["created_at"].isoformat()
    
    await db.doc_comments.insert_one(comment_dict)
    
    return {"message": "Comment added", "comment_id": comment.comment_id}

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
# Database Seeding
# ========================

@api_router.post("/seed/documentation")
async def seed_documentation():
    """Seed the database with sample documentation data"""
    
    # Check if already seeded
    existing = await db.doc_categories.count_documents({})
    if existing > 0:
        return {"message": "Documentation already seeded", "categories": existing}
    
    now = datetime.now(timezone.utc).isoformat()
    
    # Seed Categories
    categories = [
        {
            "category_id": "cat_prog_lang",
            "name": "Programming Languages",
            "slug": "programming-languages",
            "parent_id": None,
            "icon": "Code2",
            "description": "Master Python, JavaScript, Java, C++, and more with comprehensive guides",
            "order": 1,
            "color": "#3b82f6",
            "created_at": now
        },
        {
            "category_id": "cat_web_dev",
            "name": "Web Development",
            "slug": "web-development",
            "parent_id": None,
            "icon": "Globe",
            "description": "Full-stack web development from HTML basics to advanced frameworks",
            "order": 2,
            "color": "#22c55e",
            "created_at": now
        },
        {
            "category_id": "cat_mobile",
            "name": "Mobile Development",
            "slug": "mobile-development",
            "parent_id": None,
            "icon": "Smartphone",
            "description": "Build iOS, Android, and cross-platform mobile applications",
            "order": 3,
            "color": "#a855f7",
            "created_at": now
        },
        {
            "category_id": "cat_data_ai",
            "name": "Data Science & AI",
            "slug": "data-science-ai",
            "parent_id": None,
            "icon": "Brain",
            "description": "Data analysis, machine learning, deep learning, and AI applications",
            "order": 4,
            "color": "#f97316",
            "created_at": now
        },
        {
            "category_id": "cat_prompt",
            "name": "AI & Prompt Engineering",
            "slug": "ai-prompt-engineering",
            "parent_id": None,
            "icon": "Sparkles",
            "description": "Master AI tools, prompt engineering, and AI-assisted development",
            "order": 5,
            "color": "#8b5cf6",
            "created_at": now
        },
        {
            "category_id": "cat_dsa",
            "name": "Algorithms & DSA",
            "slug": "algorithms-dsa",
            "parent_id": None,
            "icon": "Layers",
            "description": "Data structures, algorithms, and competitive programming",
            "order": 6,
            "color": "#eab308",
            "created_at": now
        },
        {
            "category_id": "cat_soft_eng",
            "name": "Software Engineering",
            "slug": "software-engineering",
            "parent_id": None,
            "icon": "GitBranch",
            "description": "Best practices, design patterns, testing, and professional development",
            "order": 7,
            "color": "#06b6d4",
            "created_at": now
        },
        {
            "category_id": "cat_cloud",
            "name": "Cloud & DevOps",
            "slug": "cloud-devops",
            "parent_id": None,
            "icon": "Cloud",
            "description": "Cloud platforms, containerization, CI/CD, and infrastructure",
            "order": 8,
            "color": "#6366f1",
            "created_at": now
        }
    ]
    
    await db.doc_categories.insert_many(categories)
    
    # Seed Sample Articles
    articles = [
        {
            "article_id": "doc_python_intro",
            "category_id": "cat_prog_lang",
            "title": "Python Programming: Complete Beginner's Guide",
            "slug": "python-beginners-guide",
            "content": """# Python Programming: Complete Beginner's Guide

Welcome to the world of Python programming! This comprehensive guide will take you from zero to writing your first Python programs.

## What is Python?

Python is a high-level, interpreted programming language known for its simplicity and readability. It was created by Guido van Rossum and first released in 1991.

## Why Learn Python?

- **Easy to Learn**: Python has a clean, readable syntax
- **Versatile**: Web development, data science, AI, automation
- **Large Community**: Extensive libraries and support
- **In-Demand**: One of the most sought-after programming skills

## Getting Started

### Installation

```bash
# Download from python.org or use package manager
# macOS
brew install python3

# Windows - Download from python.org

# Linux
sudo apt install python3
```

### Your First Program

```python
# hello.py
print("Hello, World!")

# Variables
name = "Alice"
age = 25
is_student = True

# Basic operations
sum = 10 + 5
greeting = f"Hello, {name}!"
print(greeting)
```

## Data Types

Python has several built-in data types:

| Type | Example | Description |
|------|---------|-------------|
| int | `42` | Integer numbers |
| float | `3.14` | Decimal numbers |
| str | `"hello"` | Text strings |
| bool | `True` | Boolean values |
| list | `[1, 2, 3]` | Ordered collection |
| dict | `{"key": "value"}` | Key-value pairs |

## Control Flow

```python
# If statements
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")

# Loops
for i in range(5):
    print(i)

while count > 0:
    count -= 1
```

## Functions

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Usage
message = greet("Alice")
print(message)  # Hello, Alice!
```

## Next Steps

1. Practice with coding exercises
2. Build small projects
3. Learn about object-oriented programming
4. Explore Python libraries (pandas, numpy, flask)

Happy coding! 🐍
""",
            "excerpt": "Learn Python from scratch with this comprehensive beginner's guide covering installation, syntax, data types, and more.",
            "difficulty_level": "beginner",
            "estimated_reading_time": 15,
            "tags": ["python", "programming", "beginner", "tutorial"],
            "view_count": 2500,
            "helpful_count": 180,
            "is_published": True,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "article_id": "doc_js_intro",
            "category_id": "cat_prog_lang",
            "title": "JavaScript Fundamentals: Modern ES6+ Guide",
            "slug": "javascript-fundamentals",
            "content": """# JavaScript Fundamentals: Modern ES6+ Guide

Master modern JavaScript with this comprehensive guide to ES6+ features.

## Introduction

JavaScript is the language of the web, powering interactive websites and web applications.

## Variables

```javascript
// Modern variable declarations
const name = "Alice";  // Cannot be reassigned
let age = 25;          // Block-scoped, can be reassigned
var legacy = "old";    // Function-scoped (avoid)

// Template literals
const greeting = `Hello, ${name}!`;
```

## Arrow Functions

```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With multiple statements
const greet = (name) => {
    const message = `Hello, ${name}!`;
    return message;
};
```

## Destructuring

```javascript
// Object destructuring
const user = { name: "Alice", age: 25, city: "NYC" };
const { name, age } = user;

// Array destructuring
const colors = ["red", "green", "blue"];
const [first, second] = colors;

// With defaults
const { role = "user" } = user;
```

## Spread & Rest

```javascript
// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };

// Rest parameters
const sum = (...numbers) => {
    return numbers.reduce((a, b) => a + b, 0);
};
```

## Async/Await

```javascript
// Modern async code
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}
```

## Modules

```javascript
// Export
export const API_URL = "https://api.example.com";
export function fetchData() { /* ... */ }
export default class App { /* ... */ }

// Import
import App, { API_URL, fetchData } from "./app.js";
```

Keep practicing and building projects! 🚀
""",
            "excerpt": "Master modern JavaScript ES6+ features including arrow functions, destructuring, async/await, and modules.",
            "difficulty_level": "beginner",
            "estimated_reading_time": 12,
            "tags": ["javascript", "es6", "programming", "web"],
            "view_count": 2100,
            "helpful_count": 156,
            "is_published": True,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "article_id": "doc_react_intro",
            "category_id": "cat_web_dev",
            "title": "React.js: Building Modern User Interfaces",
            "slug": "react-introduction",
            "content": """# React.js: Building Modern User Interfaces

Learn how to build interactive UIs with React, the popular JavaScript library.

## What is React?

React is a JavaScript library for building user interfaces, created by Facebook.

## Core Concepts

### Components

```jsx
// Function component
function Welcome({ name }) {
    return <h1>Hello, {name}!</h1>;
}

// Usage
<Welcome name="Alice" />
```

### State with Hooks

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

### Effects

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        async function fetchUser() {
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            setUser(data);
        }
        fetchUser();
    }, [userId]);
    
    if (!user) return <p>Loading...</p>;
    
    return <h1>{user.name}</h1>;
}
```

## Best Practices

1. Keep components small and focused
2. Use meaningful component names
3. Lift state up when needed
4. Use custom hooks for reusable logic

Happy building! ⚛️
""",
            "excerpt": "Learn React.js fundamentals including components, hooks, state management, and best practices.",
            "difficulty_level": "intermediate",
            "estimated_reading_time": 18,
            "tags": ["react", "javascript", "frontend", "web"],
            "view_count": 1800,
            "helpful_count": 142,
            "is_published": True,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "article_id": "doc_prompt_eng",
            "category_id": "cat_prompt",
            "title": "Prompt Engineering: Master AI Communication",
            "slug": "prompt-engineering-guide",
            "content": """# Prompt Engineering: Master AI Communication

Learn how to effectively communicate with AI models to get the best results.

## What is Prompt Engineering?

Prompt engineering is the art of crafting effective instructions for AI models.

## Key Techniques

### 1. Be Specific

❌ Bad: "Write about dogs"
✅ Good: "Write a 200-word article about the health benefits of owning dogs for elderly people"

### 2. Provide Context

```
You are an expert Python developer with 10 years of experience.
Help me optimize this code for better performance:
[code here]
```

### 3. Use Examples (Few-Shot)

```
Convert these sentences to formal English:

Input: "gonna head out now"
Output: "I will be leaving now."

Input: "wanna grab some food?"
Output: "Would you like to get something to eat?"

Input: "can't make it tmrw"
Output: [AI completes]
```

### 4. Chain of Thought

```
Solve this step by step:
1. First, identify the problem
2. Then, list possible solutions
3. Evaluate each solution
4. Choose the best approach
5. Implement the solution
```

## Best Practices

- Start simple, iterate and refine
- Test with different phrasings
- Include constraints and requirements
- Use role-playing for better context

Master these techniques to become an AI power user! 🤖
""",
            "excerpt": "Master prompt engineering techniques to communicate effectively with AI models and get better results.",
            "difficulty_level": "beginner",
            "estimated_reading_time": 10,
            "tags": ["ai", "prompt-engineering", "chatgpt", "llm"],
            "view_count": 3200,
            "helpful_count": 280,
            "is_published": True,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "article_id": "doc_git_basics",
            "category_id": "cat_soft_eng",
            "title": "Git & GitHub: Version Control Essentials",
            "slug": "git-github-essentials",
            "content": """# Git & GitHub: Version Control Essentials

Master version control with Git and collaborate effectively using GitHub.

## Getting Started

```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Initialize a repository
git init

# Clone a repository
git clone https://github.com/user/repo.git
```

## Basic Workflow

```bash
# Check status
git status

# Stage changes
git add filename.js
git add .  # Stage all

# Commit changes
git commit -m "Add feature X"

# Push to remote
git push origin main
```

## Branching

```bash
# Create branch
git branch feature-login

# Switch branch
git checkout feature-login
# or
git switch feature-login

# Create and switch
git checkout -b feature-login

# Merge branch
git checkout main
git merge feature-login
```

## Collaboration

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make changes and commit
5. Push to your fork
6. Open a Pull Request

Happy collaborating! 🌿
""",
            "excerpt": "Learn Git version control and GitHub collaboration essentials for professional development.",
            "difficulty_level": "beginner",
            "estimated_reading_time": 12,
            "tags": ["git", "github", "version-control", "collaboration"],
            "view_count": 1950,
            "helpful_count": 165,
            "is_published": True,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "article_id": "doc_dsa_arrays",
            "category_id": "cat_dsa",
            "title": "Arrays & Strings: Interview Preparation",
            "slug": "arrays-strings-interview",
            "content": """# Arrays & Strings: Interview Preparation

Master array and string manipulation for coding interviews.

## Common Patterns

### Two Pointers

```python
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

### Sliding Window

```python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i-k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

### Hash Map

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

## Practice Problems

1. Reverse a string in-place
2. Find duplicates in an array
3. Longest substring without repeating characters
4. Container with most water
5. 3Sum problem

Keep practicing! 💪
""",
            "excerpt": "Prepare for coding interviews with essential array and string algorithms and patterns.",
            "difficulty_level": "intermediate",
            "estimated_reading_time": 15,
            "tags": ["algorithms", "dsa", "interview", "python"],
            "view_count": 2800,
            "helpful_count": 220,
            "is_published": True,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        }
    ]
    
    await db.doc_articles.insert_many(articles)
    
    # Seed Learning Paths
    paths = [
        {
            "path_id": "path_fullstack",
            "title": "Complete Beginner to Full Stack Developer",
            "slug": "full-stack-developer",
            "description": "Go from zero coding experience to building complete web applications with React, Node.js, and databases.",
            "difficulty_level": "beginner",
            "estimated_duration": "12 weeks",
            "topics": ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"],
            "steps": [
                {"order": 1, "title": "Web Fundamentals", "description": "Learn HTML, CSS, and how the web works", "duration": "2 weeks"},
                {"order": 2, "title": "JavaScript Basics", "description": "Master JavaScript fundamentals", "duration": "2 weeks"},
                {"order": 3, "title": "React Development", "description": "Build interactive UIs with React", "duration": "3 weeks"},
                {"order": 4, "title": "Backend with Node.js", "description": "Create APIs with Express", "duration": "2 weeks"},
                {"order": 5, "title": "Database Integration", "description": "Work with MongoDB", "duration": "1 week"},
                {"order": 6, "title": "Full Stack Project", "description": "Build a complete application", "duration": "2 weeks"}
            ],
            "prerequisites": ["Basic computer skills", "Curiosity to learn"],
            "outcomes": ["Build complete web applications", "Deploy to production", "Job-ready portfolio"],
            "enrolled_count": 1250,
            "completion_rate": 68.5,
            "is_featured": True,
            "is_published": True,
            "created_at": now
        },
        {
            "path_id": "path_ai_prompt",
            "title": "AI & Prompt Engineering Mastery",
            "slug": "ai-prompt-engineering",
            "description": "Master the art of working with AI tools and become proficient in prompt engineering techniques.",
            "difficulty_level": "beginner",
            "estimated_duration": "6 weeks",
            "topics": ["ChatGPT", "Prompt Engineering", "AI Tools", "GitHub Copilot", "LLMs"],
            "steps": [
                {"order": 1, "title": "AI Fundamentals", "description": "Understanding LLMs and AI capabilities", "duration": "1 week"},
                {"order": 2, "title": "Prompt Engineering Basics", "description": "Learn effective prompting techniques", "duration": "1 week"},
                {"order": 3, "title": "Advanced Prompting", "description": "Chain-of-thought and few-shot learning", "duration": "1 week"},
                {"order": 4, "title": "AI-Assisted Coding", "description": "Using Copilot and AI for development", "duration": "2 weeks"},
                {"order": 5, "title": "Building AI Apps", "description": "Integrate AI APIs in applications", "duration": "1 week"}
            ],
            "prerequisites": ["Basic programming knowledge"],
            "outcomes": ["Master prompt engineering", "Use AI tools effectively", "Build AI-powered applications"],
            "enrolled_count": 980,
            "completion_rate": 75.2,
            "is_featured": True,
            "is_published": True,
            "created_at": now
        },
        {
            "path_id": "path_dsa",
            "title": "Algorithms & Data Structures Mastery",
            "slug": "algorithms-data-structures",
            "description": "Prepare for technical interviews with comprehensive DSA training.",
            "difficulty_level": "intermediate",
            "estimated_duration": "12 weeks",
            "topics": ["Arrays", "Trees", "Graphs", "Dynamic Programming", "Sorting", "Searching"],
            "steps": [
                {"order": 1, "title": "Arrays & Strings", "description": "Master array manipulation", "duration": "2 weeks"},
                {"order": 2, "title": "Linked Lists & Stacks", "description": "Linear data structures", "duration": "1 week"},
                {"order": 3, "title": "Trees & Binary Search", "description": "Tree traversals and BST", "duration": "2 weeks"},
                {"order": 4, "title": "Graphs & BFS/DFS", "description": "Graph algorithms", "duration": "2 weeks"},
                {"order": 5, "title": "Dynamic Programming", "description": "Optimization techniques", "duration": "3 weeks"},
                {"order": 6, "title": "Mock Interviews", "description": "Practice with real problems", "duration": "2 weeks"}
            ],
            "prerequisites": ["Programming in any language", "Basic math"],
            "outcomes": ["Ace technical interviews", "Problem-solving skills", "Algorithm analysis"],
            "enrolled_count": 2100,
            "completion_rate": 52.8,
            "is_featured": True,
            "is_published": True,
            "created_at": now
        }
    ]
    
    await db.learning_paths.insert_many(paths)
    
    return {
        "message": "Documentation seeded successfully",
        "categories": len(categories),
        "articles": len(articles),
        "paths": len(paths)
    }


@api_router.post("/seed/articles")
async def seed_comprehensive_articles():
    """Seed the database with comprehensive educational articles"""
    from seed_articles import get_all_seed_articles, get_article_stats
    
    try:
        articles = get_all_seed_articles()
        
        # Upsert articles (update if exists, insert if not)
        updated = 0
        inserted = 0
        
        for article in articles:
            result = await db.doc_articles.update_one(
                {"slug": article["slug"]},
                {"$set": article},
                upsert=True
            )
            if result.upserted_id:
                inserted += 1
            elif result.modified_count > 0:
                updated += 1
        
        stats = get_article_stats()
        
        return {
            "message": "Articles seeded successfully",
            "inserted": inserted,
            "updated": updated,
            "total_articles": stats['total_articles'],
            "total_code_examples": stats['total_code_examples'],
            "total_exercises": stats['total_exercises'],
            "total_quiz_questions": stats['total_quiz_questions']
        }
    except Exception as e:
        logger.error(f"Error seeding articles: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ========================
# Enhanced Article API Endpoints
# ========================

@api_router.get("/docs/articles")
async def get_all_articles(
    category: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    """Get all articles with filtering, search, and pagination"""
    query = {"is_published": True}
    
    if category:
        query["category_id"] = category
    if topic:
        query["topic"] = topic
    if difficulty:
        query["difficulty_level"] = difficulty
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    # Calculate skip
    skip = (page - 1) * limit
    
    # Sort direction
    sort_direction = -1 if sort_order == "desc" else 1
    
    # Get total count
    total = await db.doc_articles.count_documents(query)
    
    # Get articles
    articles = await db.doc_articles.find(
        query,
        {
            "_id": 0,
            "article_id": 1,
            "slug": 1,
            "title": 1,
            "subtitle": 1,
            "category_id": 1,
            "topic": 1,
            "subtopic": 1,
            "difficulty_level": 1,
            "estimated_reading_time": 1,
            "tags": 1,
            "view_count": 1,
            "helpful_count": 1,
            "created_at": 1,
            "author": 1
        }
    ).sort(sort_by, sort_direction).skip(skip).limit(limit).to_list(limit)
    
    return {
        "articles": articles,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }


@api_router.get("/docs/articles/{slug}")
async def get_article_by_slug(slug: str):
    """Get a single article by slug with full content"""
    article = await db.doc_articles.find_one(
        {"slug": slug, "is_published": True},
        {"_id": 0}
    )
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count
    await db.doc_articles.update_one(
        {"slug": slug},
        {"$inc": {"view_count": 1}}
    )
    
    # Get related articles
    if article.get("related_articles"):
        related = await db.doc_articles.find(
            {"slug": {"$in": article["related_articles"]}, "is_published": True},
            {"_id": 0, "slug": 1, "title": 1, "difficulty_level": 1, "estimated_reading_time": 1}
        ).to_list(10)
        article["related_articles_data"] = related
    
    return article


@api_router.get("/docs/articles/{slug}/exercises")
async def get_article_exercises(slug: str):
    """Get exercises for a specific article"""
    article = await db.doc_articles.find_one(
        {"slug": slug, "is_published": True},
        {"_id": 0, "exercises": 1, "title": 1}
    )
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return {
        "title": article.get("title"),
        "exercises": article.get("exercises", [])
    }


@api_router.get("/docs/articles/{slug}/quiz")
async def get_article_quiz(slug: str):
    """Get quiz questions for a specific article"""
    article = await db.doc_articles.find_one(
        {"slug": slug, "is_published": True},
        {"_id": 0, "quiz_questions": 1, "title": 1}
    )
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Remove correct answers for client-side quiz (don't reveal answers)
    questions = article.get("quiz_questions", [])
    for q in questions:
        q.pop("correct_answer", None)
        q.pop("explanation", None)
    
    return {
        "title": article.get("title"),
        "questions": questions
    }


@api_router.post("/docs/articles/{slug}/quiz/submit")
async def submit_quiz_answers(slug: str, request: Request):
    """Submit quiz answers and get results"""
    body = await request.json()
    user_answers = body.get("answers", {})  # {question_id: selected_index}
    
    article = await db.doc_articles.find_one(
        {"slug": slug, "is_published": True},
        {"_id": 0, "quiz_questions": 1, "title": 1}
    )
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    questions = article.get("quiz_questions", [])
    results = []
    correct_count = 0
    
    for q in questions:
        q_id = q.get("id")
        user_answer = user_answers.get(q_id)
        is_correct = user_answer == q.get("correct_answer")
        
        if is_correct:
            correct_count += 1
        
        results.append({
            "question_id": q_id,
            "user_answer": user_answer,
            "correct_answer": q.get("correct_answer"),
            "is_correct": is_correct,
            "explanation": q.get("explanation", "")
        })
    
    total = len(questions)
    score = (correct_count / total * 100) if total > 0 else 0
    
    return {
        "title": article.get("title"),
        "results": results,
        "score": round(score, 1),
        "correct_count": correct_count,
        "total_questions": total,
        "passed": score >= 70
    }


@api_router.post("/docs/articles/{slug}/helpful")
async def mark_article_helpful(slug: str, request: Request):
    """Mark an article as helpful or not helpful"""
    body = await request.json()
    is_helpful = body.get("helpful", True)
    
    if is_helpful:
        await db.doc_articles.update_one(
            {"slug": slug},
            {"$inc": {"helpful_count": 1}}
        )
    else:
        await db.doc_articles.update_one(
            {"slug": slug},
            {"$inc": {"not_helpful_count": 1}}
        )
    
    return {"message": "Feedback recorded", "helpful": is_helpful}


@api_router.get("/docs/categories/{category_slug}/articles")
async def get_articles_by_category(
    category_slug: str,
    page: int = 1,
    limit: int = 10
):
    """Get all articles for a specific category"""
    # Map slug to category_id
    category_map = {
        "programming-languages": "programming-languages",
        "web-development": "web-development",
        "mobile-development": "mobile-development",
        "data-science-ai": "data-science-ai",
        "ai-prompt-engineering": "ai-prompt-engineering",
        "algorithms-dsa": "algorithms-dsa",
        "software-engineering": "software-engineering",
        "cloud-devops": "cloud-devops"
    }
    
    category_id = category_map.get(category_slug, category_slug)
    
    skip = (page - 1) * limit
    
    total = await db.doc_articles.count_documents({
        "category_id": category_id,
        "is_published": True
    })
    
    articles = await db.doc_articles.find(
        {"category_id": category_id, "is_published": True},
        {
            "_id": 0,
            "article_id": 1,
            "slug": 1,
            "title": 1,
            "subtitle": 1,
            "topic": 1,
            "subtopic": 1,
            "difficulty_level": 1,
            "estimated_reading_time": 1,
            "tags": 1,
            "view_count": 1,
            "created_at": 1
        }
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return {
        "category": category_slug,
        "articles": articles,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }


@api_router.get("/docs/topics/{topic}/articles")
async def get_articles_by_topic(
    topic: str,
    page: int = 1,
    limit: int = 10
):
    """Get all articles for a specific topic (e.g., python, react, etc.)"""
    skip = (page - 1) * limit
    
    total = await db.doc_articles.count_documents({
        "topic": topic,
        "is_published": True
    })
    
    articles = await db.doc_articles.find(
        {"topic": topic, "is_published": True},
        {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return {
        "topic": topic,
        "articles": articles,
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }


@api_router.get("/docs/search")
async def search_articles(
    q: str,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = 20
):
    """Full-text search across articles"""
    query = {
        "is_published": True,
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"subtitle": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}},
            {"meta_description": {"$regex": q, "$options": "i"}}
        ]
    }
    
    if category:
        query["category_id"] = category
    if difficulty:
        query["difficulty_level"] = difficulty
    
    articles = await db.doc_articles.find(
        query,
        {
            "_id": 0,
            "slug": 1,
            "title": 1,
            "subtitle": 1,
            "category_id": 1,
            "difficulty_level": 1,
            "estimated_reading_time": 1,
            "tags": 1
        }
    ).limit(limit).to_list(limit)
    
    return {
        "query": q,
        "results": articles,
        "count": len(articles)
    }


@api_router.get("/docs/stats")
async def get_documentation_stats():
    """Get overall documentation statistics"""
    total_articles = await db.doc_articles.count_documents({"is_published": True})
    total_categories = await db.doc_categories.count_documents({})
    total_paths = await db.learning_paths.count_documents({"is_published": True})
    
    # Get articles by category
    pipeline = [
        {"$match": {"is_published": True}},
        {"$group": {"_id": "$category_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_category = await db.doc_articles.aggregate(pipeline).to_list(20)
    
    # Get articles by difficulty
    difficulty_pipeline = [
        {"$match": {"is_published": True}},
        {"$group": {"_id": "$difficulty_level", "count": {"$sum": 1}}}
    ]
    by_difficulty = await db.doc_articles.aggregate(difficulty_pipeline).to_list(10)
    
    # Get most viewed articles
    popular = await db.doc_articles.find(
        {"is_published": True},
        {"_id": 0, "slug": 1, "title": 1, "view_count": 1}
    ).sort("view_count", -1).limit(5).to_list(5)
    
    return {
        "total_articles": total_articles,
        "total_categories": total_categories,
        "total_learning_paths": total_paths,
        "by_category": {item["_id"]: item["count"] for item in by_category},
        "by_difficulty": {item["_id"]: item["count"] for item in by_difficulty if item["_id"]},
        "popular_articles": popular
    }


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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
