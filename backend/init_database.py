"""
Database Initialization Script for CodeLearnHub
Creates all collections with proper indexes and validation schemas
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def init_database():
    """Initialize MongoDB database with all required collections and indexes"""
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"🔗 Connected to MongoDB Atlas: {db_name}")
    
    # =====================================================
    # USERS COLLECTION
    # Stores all user accounts (Google/GitHub OAuth)
    # =====================================================
    print("\n📦 Setting up 'users' collection...")
    
    # Create indexes for users
    await db.users.create_index("user_id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.users.create_index("role")
    await db.users.create_index("created_at")
    await db.users.create_index("auth_provider")
    
    # User document structure example:
    # {
    #     "user_id": "user_a1b2c3d4e5f6",
    #     "email": "user@example.com",
    #     "name": "John Doe",
    #     "picture": "https://...",
    #     "role": "student",  # admin, student, instructor, buyer, guest
    #     "bio": "Full stack developer...",
    #     "skills": ["Python", "React", "MongoDB"],
    #     "social_links": {
    #         "github": "https://github.com/username",
    #         "linkedin": "https://linkedin.com/in/username",
    #         "twitter": "https://twitter.com/username",
    #         "website": "https://example.com"
    #     },
    #     "auth_provider": "google",  # google, github
    #     "is_verified": false,
    #     "is_instructor": false,
    #     "total_purchases": 0,
    #     "total_enrollments": 0,
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "updated_at": "2026-01-21T00:00:00Z",
    #     "last_login": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ users collection ready")
    
    # =====================================================
    # USER SESSIONS COLLECTION
    # Stores authentication sessions
    # =====================================================
    print("\n📦 Setting up 'user_sessions' collection...")
    
    await db.user_sessions.create_index("session_token", unique=True)
    await db.user_sessions.create_index("user_id")
    await db.user_sessions.create_index("expires_at", expireAfterSeconds=0)  # TTL index
    
    # Session document structure:
    # {
    #     "user_id": "user_a1b2c3d4e5f6",
    #     "session_token": "sess_xxx...",
    #     "expires_at": "2026-01-28T00:00:00Z",
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "ip_address": "192.168.1.1",
    #     "user_agent": "Mozilla/5.0..."
    # }
    
    print("   ✅ user_sessions collection ready")
    
    # =====================================================
    # PROJECTS COLLECTION
    # Stores code projects for sale/download
    # =====================================================
    print("\n📦 Setting up 'projects' collection...")
    
    await db.projects.create_index("project_id", unique=True)
    await db.projects.create_index("title")
    await db.projects.create_index("category")
    await db.projects.create_index("tech_stack")
    await db.projects.create_index("price")
    await db.projects.create_index("is_active")
    await db.projects.create_index("created_at")
    await db.projects.create_index("downloads_count")
    await db.projects.create_index("rating")
    await db.projects.create_index([("title", "text"), ("description", "text")])  # Text search
    
    # Project document structure:
    # {
    #     "project_id": "proj_a1b2c3d4e5f6",
    #     "title": "E-Commerce React Dashboard",
    #     "description": "Full featured admin dashboard...",
    #     "short_description": "Admin dashboard with charts...",
    #     "tech_stack": ["React", "Node.js", "MongoDB"],
    #     "category": "web",  # web, mobile, desktop, ai, api, game, devops
    #     "subcategory": "dashboard",
    #     "price": 49.99,
    #     "discount_price": 39.99,
    #     "license_type": "single",  # single, multi, commercial, open-source
    #     "file_path": "uploads/projects/proj_xxx.zip",
    #     "file_size": 15000000,  # bytes
    #     "preview_images": ["url1", "url2", "url3"],
    #     "demo_url": "https://demo.example.com",
    #     "github_url": "https://github.com/...",
    #     "documentation_url": "https://docs.example.com",
    #     "features": ["Responsive Design", "Dark Mode", "API Integration"],
    #     "requirements": ["Node.js 18+", "MongoDB 6+"],
    #     "version": "2.1.0",
    #     "author_id": "user_xxx",
    #     "downloads_count": 150,
    #     "views_count": 1200,
    #     "rating": 4.8,
    #     "rating_count": 25,
    #     "is_active": true,
    #     "is_featured": false,
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "updated_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ projects collection ready")
    
    # =====================================================
    # PROJECT REVIEWS COLLECTION
    # Stores reviews for projects
    # =====================================================
    print("\n📦 Setting up 'project_reviews' collection...")
    
    await db.project_reviews.create_index("review_id", unique=True)
    await db.project_reviews.create_index("project_id")
    await db.project_reviews.create_index("user_id")
    await db.project_reviews.create_index([("project_id", 1), ("user_id", 1)], unique=True)
    await db.project_reviews.create_index("rating")
    await db.project_reviews.create_index("created_at")
    
    # Review document structure:
    # {
    #     "review_id": "rev_a1b2c3d4e5f6",
    #     "project_id": "proj_xxx",
    #     "user_id": "user_xxx",
    #     "rating": 5,
    #     "title": "Excellent project!",
    #     "content": "Very well organized code...",
    #     "helpful_count": 10,
    #     "is_verified_purchase": true,
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "updated_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ project_reviews collection ready")
    
    # =====================================================
    # PURCHASES COLLECTION
    # Stores project purchases
    # =====================================================
    print("\n📦 Setting up 'purchases' collection...")
    
    await db.purchases.create_index("purchase_id", unique=True)
    await db.purchases.create_index("user_id")
    await db.purchases.create_index("project_id")
    await db.purchases.create_index([("user_id", 1), ("project_id", 1)])
    await db.purchases.create_index("transaction_id")
    await db.purchases.create_index("license_key", unique=True)
    await db.purchases.create_index("status")
    await db.purchases.create_index("purchase_date")
    
    # Purchase document structure:
    # {
    #     "purchase_id": "pur_a1b2c3d4e5f6",
    #     "user_id": "user_xxx",
    #     "project_id": "proj_xxx",
    #     "transaction_id": "txn_xxx",
    #     "amount": 49.99,
    #     "currency": "USD",
    #     "license_type": "single",
    #     "license_key": "LIC-XXXX-XXXX-XXXX",
    #     "download_count": 3,
    #     "max_downloads": 5,
    #     "status": "completed",  # pending, completed, refunded, expired
    #     "purchase_date": "2026-01-21T00:00:00Z",
    #     "expires_at": null,
    #     "refund_reason": null
    # }
    
    print("   ✅ purchases collection ready")
    
    # =====================================================
    # COURSES COLLECTION
    # Stores educational courses
    # =====================================================
    print("\n📦 Setting up 'courses' collection...")
    
    await db.courses.create_index("course_id", unique=True)
    await db.courses.create_index("title")
    await db.courses.create_index("category")
    await db.courses.create_index("difficulty")
    await db.courses.create_index("instructor_id")
    await db.courses.create_index("price")
    await db.courses.create_index("is_free")
    await db.courses.create_index("is_active")
    await db.courses.create_index("rating")
    await db.courses.create_index("enrolled_count")
    await db.courses.create_index([("title", "text"), ("description", "text")])
    
    # Course document structure:
    # {
    #     "course_id": "course_a1b2c3d4e5f6",
    #     "title": "Complete React Developer Course",
    #     "description": "Learn React from scratch...",
    #     "short_description": "Master React with hands-on projects",
    #     "category": "web-development",
    #     "subcategory": "frontend",
    #     "difficulty": "intermediate",  # beginner, intermediate, advanced
    #     "price": 99.99,
    #     "discount_price": 79.99,
    #     "is_free": false,
    #     "duration": "25 hours",
    #     "duration_minutes": 1500,
    #     "instructor_id": "user_xxx",
    #     "thumbnail": "https://...",
    #     "preview_video": "https://...",
    #     "language": "English",
    #     "subtitles": ["English", "Spanish"],
    #     "requirements": ["Basic JavaScript knowledge", "HTML/CSS"],
    #     "learning_objectives": ["Build React apps", "Use Redux"],
    #     "lessons_count": 120,
    #     "enrolled_count": 5000,
    #     "rating": 4.7,
    #     "rating_count": 450,
    #     "completion_rate": 68.5,
    #     "certificate_enabled": true,
    #     "is_active": true,
    #     "is_featured": true,
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "updated_at": "2026-01-21T00:00:00Z",
    #     "published_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ courses collection ready")
    
    # =====================================================
    # LESSONS COLLECTION
    # Stores course lessons/modules
    # =====================================================
    print("\n📦 Setting up 'lessons' collection...")
    
    await db.lessons.create_index("lesson_id", unique=True)
    await db.lessons.create_index("course_id")
    await db.lessons.create_index([("course_id", 1), ("section", 1), ("order", 1)])
    await db.lessons.create_index("is_free_preview")
    
    # Lesson document structure:
    # {
    #     "lesson_id": "lesson_a1b2c3d4e5f6",
    #     "course_id": "course_xxx",
    #     "section": "Getting Started",
    #     "section_order": 1,
    #     "title": "Introduction to React",
    #     "description": "Overview of React concepts",
    #     "content_type": "video",  # video, text, code, quiz, assignment
    #     "content_url": "https://...",
    #     "content_text": null,
    #     "duration": "15:30",
    #     "duration_seconds": 930,
    #     "order": 1,
    #     "is_free_preview": true,
    #     "resources": [
    #         {"name": "Source Code", "url": "https://..."},
    #         {"name": "Slides", "url": "https://..."}
    #     ],
    #     "created_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ lessons collection ready")
    
    # =====================================================
    # ENROLLMENTS COLLECTION
    # Stores course enrollments
    # =====================================================
    print("\n📦 Setting up 'enrollments' collection...")
    
    await db.enrollments.create_index("enrollment_id", unique=True)
    await db.enrollments.create_index("user_id")
    await db.enrollments.create_index("course_id")
    await db.enrollments.create_index([("user_id", 1), ("course_id", 1)], unique=True)
    await db.enrollments.create_index("enrolled_date")
    await db.enrollments.create_index("progress_percentage")
    
    # Enrollment document structure:
    # {
    #     "enrollment_id": "enroll_a1b2c3d4e5f6",
    #     "user_id": "user_xxx",
    #     "course_id": "course_xxx",
    #     "transaction_id": "txn_xxx",
    #     "amount_paid": 79.99,
    #     "progress_percentage": 45.5,
    #     "completed_lessons": ["lesson_1", "lesson_2"],
    #     "current_lesson_id": "lesson_3",
    #     "last_accessed": "2026-01-21T00:00:00Z",
    #     "enrolled_date": "2026-01-21T00:00:00Z",
    #     "completed_date": null,
    #     "certificate_id": null,
    #     "certificate_url": null,
    #     "notes": [
    #         {"lesson_id": "lesson_1", "content": "Important point...", "timestamp": 120}
    #     ]
    # }
    
    print("   ✅ enrollments collection ready")
    
    # =====================================================
    # COURSE REVIEWS COLLECTION
    # Stores course reviews
    # =====================================================
    print("\n📦 Setting up 'course_reviews' collection...")
    
    await db.course_reviews.create_index("review_id", unique=True)
    await db.course_reviews.create_index("course_id")
    await db.course_reviews.create_index("user_id")
    await db.course_reviews.create_index([("course_id", 1), ("user_id", 1)], unique=True)
    await db.course_reviews.create_index("rating")
    await db.course_reviews.create_index("created_at")
    
    # Review document structure (same as project_reviews)
    
    print("   ✅ course_reviews collection ready")
    
    # =====================================================
    # TRANSACTIONS COLLECTION
    # Stores all payment transactions
    # =====================================================
    print("\n📦 Setting up 'transactions' collection...")
    
    await db.transactions.create_index("transaction_id", unique=True)
    await db.transactions.create_index("user_id")
    await db.transactions.create_index("razorpay_order_id")
    await db.transactions.create_index("razorpay_payment_id")
    await db.transactions.create_index("status")
    await db.transactions.create_index("item_type")
    await db.transactions.create_index("item_id")
    await db.transactions.create_index("created_at")
    
    # Transaction document structure:
    # {
    #     "transaction_id": "txn_a1b2c3d4e5f6",
    #     "user_id": "user_xxx",
    #     "amount": 49.99,
    #     "currency": "USD",
    #     "payment_method": "razorpay",  # razorpay, stripe, paypal
    #     "status": "completed",  # pending, completed, failed, refunded
    #     "razorpay_order_id": "order_xxx",
    #     "razorpay_payment_id": "pay_xxx",
    #     "razorpay_signature": "sig_xxx",
    #     "item_type": "project",  # project, course, subscription
    #     "item_id": "proj_xxx",
    #     "item_title": "E-Commerce Dashboard",
    #     "invoice_number": "INV-2026-00001",
    #     "invoice_url": "https://...",
    #     "billing_details": {
    #         "name": "John Doe",
    #         "email": "john@example.com",
    #         "address": "123 Main St",
    #         "city": "New York",
    #         "country": "US",
    #         "postal_code": "10001"
    #     },
    #     "metadata": {},
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "completed_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ transactions collection ready")
    
    # =====================================================
    # BLOG POSTS COLLECTION
    # Stores blog articles
    # =====================================================
    print("\n📦 Setting up 'blog_posts' collection...")
    
    await db.blog_posts.create_index("post_id", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await db.blog_posts.create_index("author_id")
    await db.blog_posts.create_index("category")
    await db.blog_posts.create_index("tags")
    await db.blog_posts.create_index("is_published")
    await db.blog_posts.create_index("created_at")
    await db.blog_posts.create_index("views")
    await db.blog_posts.create_index([("title", "text"), ("content", "text"), ("excerpt", "text")])
    
    # Blog post document structure:
    # {
    #     "post_id": "post_a1b2c3d4e5f6",
    #     "slug": "getting-started-with-react",
    #     "title": "Getting Started with React in 2026",
    #     "excerpt": "A comprehensive guide to React...",
    #     "content": "# Introduction\n\nReact is...",  # Markdown
    #     "content_html": "<h1>Introduction</h1>...",  # Rendered HTML
    #     "category": "tutorials",  # tutorials, news, tips, case-studies
    #     "tags": ["react", "javascript", "frontend"],
    #     "author_id": "user_xxx",
    #     "thumbnail": "https://...",
    #     "featured_image": "https://...",
    #     "reading_time": 8,  # minutes
    #     "views": 1500,
    #     "likes_count": 120,
    #     "comments_count": 15,
    #     "is_published": true,
    #     "is_featured": true,
    #     "seo_title": "React Tutorial 2026",
    #     "seo_description": "Learn React from scratch...",
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "updated_at": "2026-01-21T00:00:00Z",
    #     "published_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ blog_posts collection ready")
    
    # =====================================================
    # BLOG COMMENTS COLLECTION
    # Stores blog comments
    # =====================================================
    print("\n📦 Setting up 'blog_comments' collection...")
    
    await db.blog_comments.create_index("comment_id", unique=True)
    await db.blog_comments.create_index("post_id")
    await db.blog_comments.create_index("user_id")
    await db.blog_comments.create_index("parent_id")  # For nested comments
    await db.blog_comments.create_index("created_at")
    
    # Comment document structure:
    # {
    #     "comment_id": "comment_a1b2c3d4e5f6",
    #     "post_id": "post_xxx",
    #     "user_id": "user_xxx",
    #     "parent_id": null,  # For replies
    #     "content": "Great article!",
    #     "likes_count": 5,
    #     "is_approved": true,
    #     "is_edited": false,
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "updated_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ blog_comments collection ready")
    
    # =====================================================
    # CONTACT MESSAGES COLLECTION
    # Stores contact form submissions
    # =====================================================
    print("\n📦 Setting up 'contact_messages' collection...")
    
    await db.contact_messages.create_index("contact_id", unique=True)
    await db.contact_messages.create_index("email")
    await db.contact_messages.create_index("purpose")
    await db.contact_messages.create_index("is_read")
    await db.contact_messages.create_index("created_at")
    
    # Contact message document structure:
    # {
    #     "contact_id": "contact_a1b2c3d4e5f6",
    #     "name": "John Doe",
    #     "email": "john@example.com",
    #     "phone": "+1234567890",
    #     "purpose": "general",  # general, support, sales, partnership, bug-report
    #     "subject": "Question about...",
    #     "message": "I would like to know...",
    #     "is_read": false,
    #     "is_replied": false,
    #     "replied_at": null,
    #     "reply_content": null,
    #     "priority": "normal",  # low, normal, high, urgent
    #     "status": "open",  # open, in-progress, resolved, closed
    #     "assigned_to": null,
    #     "created_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ contact_messages collection ready")
    
    # =====================================================
    # CONNECTIONS COLLECTION
    # Stores user connections/networking
    # =====================================================
    print("\n📦 Setting up 'connections' collection...")
    
    await db.connections.create_index("connection_id", unique=True)
    await db.connections.create_index("sender_id")
    await db.connections.create_index("receiver_id")
    await db.connections.create_index([("sender_id", 1), ("receiver_id", 1)], unique=True)
    await db.connections.create_index("status")
    await db.connections.create_index("category")
    await db.connections.create_index("created_at")
    
    # Connection document structure:
    # {
    #     "connection_id": "conn_a1b2c3d4e5f6",
    #     "sender_id": "user_xxx",
    #     "receiver_id": "user_yyy",
    #     "status": "accepted",  # pending, accepted, rejected, blocked
    #     "category": "collaboration",  # collaboration, mentorship, hiring, consulting
    #     "message": "Would like to connect...",
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "accepted_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ connections collection ready")
    
    # =====================================================
    # MESSAGES COLLECTION
    # Stores direct messages between users
    # =====================================================
    print("\n📦 Setting up 'messages' collection...")
    
    await db.messages.create_index("message_id", unique=True)
    await db.messages.create_index("conversation_id")
    await db.messages.create_index("sender_id")
    await db.messages.create_index("recipient_id")
    await db.messages.create_index([("conversation_id", 1), ("sent_at", -1)])
    await db.messages.create_index("read_at")
    
    # Message document structure:
    # {
    #     "message_id": "msg_a1b2c3d4e5f6",
    #     "conversation_id": "conv_xxx",  # Sorted user IDs
    #     "sender_id": "user_xxx",
    #     "recipient_id": "user_yyy",
    #     "content": "Hello!",
    #     "content_type": "text",  # text, image, file, code
    #     "attachments": [
    #         {"name": "file.pdf", "url": "https://...", "size": 1024}
    #     ],
    #     "is_read": false,
    #     "sent_at": "2026-01-21T00:00:00Z",
    #     "read_at": null,
    #     "edited_at": null
    # }
    
    print("   ✅ messages collection ready")
    
    # =====================================================
    # NOTIFICATIONS COLLECTION
    # Stores user notifications
    # =====================================================
    print("\n📦 Setting up 'notifications' collection...")
    
    await db.notifications.create_index("notification_id", unique=True)
    await db.notifications.create_index("user_id")
    await db.notifications.create_index([("user_id", 1), ("is_read", 1)])
    await db.notifications.create_index("type")
    await db.notifications.create_index("created_at")
    
    # Notification document structure:
    # {
    #     "notification_id": "notif_a1b2c3d4e5f6",
    #     "user_id": "user_xxx",
    #     "type": "purchase",  # purchase, enrollment, message, connection, system
    #     "title": "Purchase Successful",
    #     "message": "You have successfully purchased...",
    #     "action_url": "/dashboard/purchases",
    #     "image_url": "https://...",
    #     "reference_type": "purchase",
    #     "reference_id": "pur_xxx",
    #     "is_read": false,
    #     "is_email_sent": true,
    #     "created_at": "2026-01-21T00:00:00Z",
    #     "read_at": null
    # }
    
    print("   ✅ notifications collection ready")
    
    # =====================================================
    # WISHLISTS COLLECTION
    # Stores user wishlists
    # =====================================================
    print("\n📦 Setting up 'wishlists' collection...")
    
    await db.wishlists.create_index("wishlist_id", unique=True)
    await db.wishlists.create_index("user_id")
    await db.wishlists.create_index([("user_id", 1), ("item_type", 1), ("item_id", 1)], unique=True)
    await db.wishlists.create_index("item_type")
    await db.wishlists.create_index("added_at")
    
    # Wishlist item document structure:
    # {
    #     "wishlist_id": "wish_a1b2c3d4e5f6",
    #     "user_id": "user_xxx",
    #     "item_type": "project",  # project, course
    #     "item_id": "proj_xxx",
    #     "added_at": "2026-01-21T00:00:00Z",
    #     "price_at_add": 49.99,
    #     "notify_on_sale": true
    # }
    
    print("   ✅ wishlists collection ready")
    
    # =====================================================
    # COUPONS COLLECTION
    # Stores discount coupons
    # =====================================================
    print("\n📦 Setting up 'coupons' collection...")
    
    await db.coupons.create_index("coupon_id", unique=True)
    await db.coupons.create_index("code", unique=True)
    await db.coupons.create_index("is_active")
    await db.coupons.create_index("valid_from")
    await db.coupons.create_index("valid_until")
    
    # Coupon document structure:
    # {
    #     "coupon_id": "coupon_a1b2c3d4e5f6",
    #     "code": "SAVE20",
    #     "description": "20% off all courses",
    #     "discount_type": "percentage",  # percentage, fixed
    #     "discount_value": 20,
    #     "min_purchase": 50,
    #     "max_discount": 100,
    #     "usage_limit": 100,
    #     "usage_count": 45,
    #     "per_user_limit": 1,
    #     "applicable_to": "all",  # all, projects, courses, specific
    #     "applicable_items": [],  # Specific item IDs if applicable_to is "specific"
    #     "excluded_items": [],
    #     "is_active": true,
    #     "valid_from": "2026-01-01T00:00:00Z",
    #     "valid_until": "2026-12-31T23:59:59Z",
    #     "created_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ coupons collection ready")
    
    # =====================================================
    # COUPON USAGES COLLECTION
    # Tracks coupon usage by users
    # =====================================================
    print("\n📦 Setting up 'coupon_usages' collection...")
    
    await db.coupon_usages.create_index("usage_id", unique=True)
    await db.coupon_usages.create_index("coupon_id")
    await db.coupon_usages.create_index("user_id")
    await db.coupon_usages.create_index([("coupon_id", 1), ("user_id", 1)])
    await db.coupon_usages.create_index("transaction_id")
    
    # Coupon usage document structure:
    # {
    #     "usage_id": "usage_a1b2c3d4e5f6",
    #     "coupon_id": "coupon_xxx",
    #     "user_id": "user_xxx",
    #     "transaction_id": "txn_xxx",
    #     "discount_amount": 20.00,
    #     "used_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ coupon_usages collection ready")
    
    # =====================================================
    # CERTIFICATES COLLECTION
    # Stores course completion certificates
    # =====================================================
    print("\n📦 Setting up 'certificates' collection...")
    
    await db.certificates.create_index("certificate_id", unique=True)
    await db.certificates.create_index("user_id")
    await db.certificates.create_index("course_id")
    await db.certificates.create_index("verification_code", unique=True)
    await db.certificates.create_index([("user_id", 1), ("course_id", 1)], unique=True)
    
    # Certificate document structure:
    # {
    #     "certificate_id": "cert_a1b2c3d4e5f6",
    #     "user_id": "user_xxx",
    #     "course_id": "course_xxx",
    #     "enrollment_id": "enroll_xxx",
    #     "verification_code": "CERT-XXXX-XXXX",
    #     "certificate_url": "https://...",
    #     "pdf_url": "https://...",
    #     "issued_at": "2026-01-21T00:00:00Z",
    #     "course_title": "Complete React Developer Course",
    #     "user_name": "John Doe",
    #     "instructor_name": "Jane Smith",
    #     "completion_date": "2026-01-21T00:00:00Z",
    #     "grade": "A",
    #     "score": 95.5
    # }
    
    print("   ✅ certificates collection ready")
    
    # =====================================================
    # ANALYTICS COLLECTION
    # Stores analytics events
    # =====================================================
    print("\n📦 Setting up 'analytics' collection...")
    
    await db.analytics.create_index("event_id", unique=True)
    await db.analytics.create_index("event_type")
    await db.analytics.create_index("user_id")
    await db.analytics.create_index("item_type")
    await db.analytics.create_index("item_id")
    await db.analytics.create_index("created_at")
    await db.analytics.create_index([("event_type", 1), ("created_at", -1)])
    
    # Analytics event document structure:
    # {
    #     "event_id": "event_a1b2c3d4e5f6",
    #     "event_type": "page_view",  # page_view, purchase, enrollment, download, search
    #     "user_id": "user_xxx",  # null for anonymous
    #     "session_id": "sess_xxx",
    #     "item_type": "project",  # project, course, blog, page
    #     "item_id": "proj_xxx",
    #     "page_url": "/projects/proj_xxx",
    #     "referrer": "https://google.com",
    #     "user_agent": "Mozilla/5.0...",
    #     "ip_address": "192.168.1.1",
    #     "country": "US",
    #     "city": "New York",
    #     "device_type": "desktop",  # desktop, mobile, tablet
    #     "browser": "Chrome",
    #     "os": "Windows",
    #     "metadata": {},
    #     "created_at": "2026-01-21T00:00:00Z"
    # }
    
    print("   ✅ analytics collection ready")
    
    # =====================================================
    # SETTINGS COLLECTION
    # Stores site-wide settings
    # =====================================================
    print("\n📦 Setting up 'settings' collection...")
    
    await db.settings.create_index("key", unique=True)
    
    # Default settings
    default_settings = [
        {"key": "site_name", "value": "CodeLearnHub", "type": "string"},
        {"key": "site_description", "value": "Premium code projects and courses", "type": "string"},
        {"key": "contact_email", "value": "support@codelearnhub.com", "type": "string"},
        {"key": "currency", "value": "USD", "type": "string"},
        {"key": "tax_rate", "value": 0, "type": "number"},
        {"key": "max_downloads", "value": 5, "type": "number"},
        {"key": "allow_registration", "value": True, "type": "boolean"},
        {"key": "maintenance_mode", "value": False, "type": "boolean"},
        {"key": "social_links", "value": {"github": "", "twitter": "", "linkedin": "", "youtube": ""}, "type": "object"},
    ]
    
    for setting in default_settings:
        await db.settings.update_one(
            {"key": setting["key"]},
            {"$setOnInsert": setting},
            upsert=True
        )
    
    print("   ✅ settings collection ready")
    
    # =====================================================
    # SUMMARY
    # =====================================================
    
    collections = await db.list_collection_names()
    
    print("\n" + "=" * 50)
    print("✨ DATABASE INITIALIZATION COMPLETE!")
    print("=" * 50)
    print(f"\n📊 Database: {db_name}")
    print(f"📁 Total Collections: {len(collections)}")
    print("\n📋 Collections created:")
    for coll in sorted(collections):
        count = await db[coll].count_documents({})
        print(f"   • {coll} ({count} documents)")
    
    print("\n🔐 Indexes created for optimal query performance")
    print("📝 All schemas documented in code comments")
    print("\n✅ Ready for use!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())
