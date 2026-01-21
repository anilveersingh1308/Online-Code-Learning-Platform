# 🚀 LearnCodeOnline

<div align="center">

![CodeLearnHub Banner](https://img.shields.io/badge/CodeLearnHub-Learn%20to%20Code-cyan?style=for-the-badge&logo=code&logoColor=white)

**A comprehensive, interactive learning platform for aspiring developers**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Live Demo](#) • [Documentation](#-documentation) • [Contributing](#-contributing) • [Report Bug](https://github.com/anilveersingh1308/codelearn/issues)

</div>

---

## 📖 About The Project

**CodeLearnHub** is a modern, full-stack educational platform designed to help developers learn programming through interactive tutorials, hands-on exercises, and real-world projects. The platform covers a wide range of topics from beginner-friendly programming fundamentals to advanced concepts in AI, data science, and software engineering.

### ✨ Key Features

- 🎯 **Interactive Learning** - Hands-on code examples with syntax highlighting and live execution
- 📚 **Comprehensive Documentation** - 200+ articles covering 7 major technology categories
- 💡 **Practice Exercises** - 500+ coding exercises with hints, solutions, and test cases
- 🧠 **Knowledge Quizzes** - Interactive quizzes to test your understanding
- 💼 **Interview Preparation** - Curated interview questions for each topic
- 🌙 **Dark/Light Mode** - Seamless theme switching for comfortable reading
- 🔐 **OAuth Authentication** - Secure login with GitHub and Google
- 📊 **Progress Tracking** - Track your learning journey and achievements
- 🔔 **Notifications** - Stay updated with new content and activities
- 📱 **Responsive Design** - Beautiful UI on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework with latest features |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Radix UI** | Accessible component primitives |
| **React Syntax Highlighter** | Code syntax highlighting |
| **React Markdown** | Markdown rendering |
| **Lucide React** | Beautiful icons |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python API |
| **MongoDB Atlas** | Cloud database |
| **Motor** | Async MongoDB driver |
| **PyJWT** | JWT authentication |
| **Authlib** | OAuth integration |
| **Uvicorn** | ASGI server |

---

## 📁 Project Structure

```
codelearn/
├── 📂 backend/
│   ├── server.py              # Main FastAPI application
│   ├── article_generator.py   # Article template system
│   ├── seed_articles.py       # Comprehensive seed data
│   ├── requirements.txt       # Python dependencies
│   └── uploads/               # User uploads directory
│
├── 📂 frontend/
│   ├── 📂 public/
│   │   └── index.html         # HTML entry point
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── ArticleComponents.jsx  # Interactive article elements
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   ├── Footer.jsx             # Site footer
│   │   │   ├── ProtectedRoute.jsx     # Auth route wrapper
│   │   │   └── 📂 ui/                 # Reusable UI components
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dialog.jsx
│   │   │       └── ... (50+ components)
│   │   │
│   │   ├── 📂 context/
│   │   │   ├── AuthContext.jsx        # Authentication state
│   │   │   └── ThemeContext.jsx       # Theme management
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── HomePage.jsx           # Landing page
│   │   │   ├── DocumentationPage.jsx  # Docs hub
│   │   │   ├── DocArticlePage.jsx     # Article viewer
│   │   │   ├── DocCategoryPage.jsx    # Category listing
│   │   │   ├── ArticleAdminPage.jsx   # Admin dashboard
│   │   │   ├── CoursesPage.jsx        # Courses catalog
│   │   │   ├── ProjectsPage.jsx       # Project showcase
│   │   │   └── ...
│   │   │
│   │   ├── 📂 services/
│   │   │   └── api.js                 # API client
│   │   │
│   │   ├── 📂 hooks/
│   │   │   └── use-toast.js           # Toast hook
│   │   │
│   │   ├── 📂 lib/
│   │   │   └── utils.js               # Utility functions
│   │   │
│   │   ├── App.js                     # Main app component
│   │   ├── App.css                    # Global styles
│   │   └── index.js                   # React entry point
│   │
│   ├── 📂 plugins/
│   │   ├── health-check/              # Health monitoring
│   │   └── visual-edits/              # Dev tools
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── craco.config.js
│   └── components.json
│
├── 📂 tests/
│   └── __init__.py
│
├── design_guidelines.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.10+
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anilveersingh1308/codelearn.git
   cd codelearn
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and OAuth credentials
   ```

3. **Set up the Frontend**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create .env file (optional)
   cp .env.example .env.local
   ```

4. **Seed the Database**
   ```bash
   cd backend
   
   # Start the server
   python -m uvicorn server:app --reload --port 8001
   
   # In another terminal, seed the articles
   curl -X POST http://localhost:8001/api/seed/articles
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python -m uvicorn server:app --reload --port 8001
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Docs: http://localhost:8001/docs

---

## 🔧 Environment Variables

### Backend (.env)
```env
# MongoDB
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DB_NAME=codelearnhub

# JWT
JWT_SECRET=your-super-secret-key
JWT_ALGORITHM=HS256

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8001
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:8001/api
REACT_APP_ENV=development
```

---

## 📚 Documentation

### Learning Categories

| Category | Topics | Description |
|----------|--------|-------------|
| 💻 **Programming Languages** | Python, JavaScript, TypeScript, Java, C++ | Core language fundamentals |
| 🌐 **Web Development** | React, Node.js, HTML/CSS, APIs | Full-stack web technologies |
| 📱 **Mobile Development** | React Native, Flutter | Cross-platform mobile apps |
| 📊 **Data Science & AI** | Pandas, NumPy, Machine Learning | Data analysis and ML |
| 🤖 **AI & Prompt Engineering** | ChatGPT, LLMs, Prompt Design | AI communication skills |
| 🧮 **Algorithms & DSA** | Big O, Arrays, Trees, Graphs | Interview preparation |
| ⚙️ **Software Engineering** | Git, Testing, System Design | Professional practices |
| ☁️ **Cloud & DevOps** | Docker, AWS, CI/CD | Deployment and infrastructure |

### Article Structure

Each article includes:
- 📝 **Rich Content** - Markdown with syntax highlighting
- 💻 **Code Examples** - Runnable code with explanations
- 🏋️ **Practice Exercises** - Hands-on challenges with solutions
- ❓ **Knowledge Quiz** - Test your understanding
- 💼 **Interview Questions** - Prepare for job interviews
- 🔗 **External Resources** - Curated learning materials

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/github` | Initiate GitHub OAuth |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/callback/{provider}` | OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Documentation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs/articles` | List all articles |
| GET | `/api/docs/articles/{slug}` | Get article by slug |
| GET | `/api/docs/categories` | List all categories |
| GET | `/api/docs/categories/{slug}/articles` | Articles by category |
| GET | `/api/docs/search?q=` | Search articles |
| POST | `/api/docs/articles/{slug}/quiz/submit` | Submit quiz answers |
| POST | `/api/docs/articles/{slug}/helpful` | Submit feedback |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seed/articles` | Seed article database |
| GET | `/api/docs/stats` | Get documentation stats |

---

## 🎨 UI Components

Built with **Radix UI** primitives and styled with **Tailwind CSS**:

- **Accordion** - Collapsible content sections
- **Alert Dialog** - Confirmation modals
- **Avatar** - User profile images
- **Badge** - Status indicators
- **Button** - Multiple variants and sizes
- **Card** - Content containers
- **Carousel** - Image/content sliders
- **Command** - Command palette
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Action menus
- **Form** - Form validation with React Hook Form
- **Navigation Menu** - Site navigation
- **Popover** - Floating content
- **Progress** - Progress indicators
- **Scroll Area** - Custom scrollbars
- **Select** - Dropdown selects
- **Skeleton** - Loading placeholders
- **Slider** - Range inputs
- **Switch** - Toggle switches
- **Tabs** - Tabbed interfaces
- **Toast** - Notifications
- **Tooltip** - Hover information
- And many more...

---

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
pytest
```

---

## 📦 Deployment

### Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment

**Backend (Render/Railway/Heroku):**
```bash
cd backend
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and constructive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Radix UI](https://www.radix-ui.com/) - Component Primitives
- [Lucide](https://lucide.dev/) - Icons
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

## 📞 Contact

**Anil Singh** - [@anilveersingh1308](https://github.com/anilveersingh1308)

Project Link: [https://github.com/anilveersingh1308/codelearn](https://github.com/anilveersingh1308/learncodeonline)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ by the CodeLearnHub Team

</div>
