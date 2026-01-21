import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthCallback from "./components/AuthCallback";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import CoursesPage from "./pages/CoursesPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";

// Documentation Pages
import DocumentationPage from "./pages/DocumentationPage";
import DocArticlePage from "./pages/DocArticlePage";
import DocArticlesListPage from "./pages/DocArticlesListPage";
import DocCategoryPage from "./pages/DocCategoryPage";
import ExternalResourcesPage from "./pages/ExternalResourcesPage";
import LearningPathsPage from "./pages/LearningPathsPage";
import ArticleAdminPage from "./pages/ArticleAdminPage";

// Layout wrapper with Navbar and Footer
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Dashboard - authenticated route */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/*" element={<DashboardPage />} />
              
              {/* OAuth callback route */}
              <Route path="/auth/callback/:provider" element={<AuthCallback />} />
              
              {/* Auth pages - no layout (full page design) */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              {/* Public routes with layout */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
              <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
              <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
              <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicyPage /></Layout>} />
              <Route path="/terms" element={<Layout><TermsOfServicePage /></Layout>} />
              <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
              <Route path="/support" element={<Layout><SupportPage /></Layout>} />
              
              {/* Documentation Routes */}
              <Route path="/docs" element={<Layout><DocumentationPage /></Layout>} />
              <Route path="/docs/articles" element={<Layout><DocArticlesListPage /></Layout>} />
              <Route path="/docs/article/:slug" element={<Layout><DocArticlePage /></Layout>} />
              <Route path="/docs/category/:categorySlug" element={<Layout><DocCategoryPage /></Layout>} />
              <Route path="/docs/resources" element={<Layout><ExternalResourcesPage /></Layout>} />
              <Route path="/docs/paths" element={<Layout><LearningPathsPage /></Layout>} />
              <Route path="/docs/paths/:slug" element={<Layout><LearningPathsPage /></Layout>} />
              <Route path="/docs/admin" element={<Layout><ArticleAdminPage /></Layout>} />
            </Routes>
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                className: 'bg-card border border-border text-foreground',
              }}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
