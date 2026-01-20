import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { 
  Code2, BookOpen, ShoppingBag, Settings, LogOut, User,
  TrendingUp, Award, Clock, ChevronRight, Loader2,
  FolderOpen, GraduationCap, Bell, Heart
} from 'lucide-react';

const DashboardPage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const stats = [
    { label: 'Courses Enrolled', value: user.total_enrollments || 0, icon: GraduationCap, color: 'text-cyan-500' },
    { label: 'Projects Purchased', value: user.total_purchases || 0, icon: FolderOpen, color: 'text-purple-500' },
    { label: 'Certificates Earned', value: 0, icon: Award, color: 'text-amber-500' },
    { label: 'Hours Learned', value: 0, icon: Clock, color: 'text-green-500' },
  ];

  const quickLinks = [
    { label: 'Browse Courses', href: '/courses', icon: BookOpen, description: 'Explore our course catalog' },
    { label: 'View Projects', href: '/projects', icon: Code2, description: 'Download premium code projects' },
    { label: 'My Purchases', href: '/dashboard/purchases', icon: ShoppingBag, description: 'View your purchase history' },
    { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart, description: 'Items saved for later' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight">
                CodeLearn<span className="text-cyan-500">Hub</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              </Button>
              
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full border-2 border-cyan-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black mb-2">
            Welcome back, <span className="text-cyan-500">{user.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your learning journey.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={link.href}>
                <Card className="bg-card hover:shadow-lg hover:border-cyan-500/50 transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                        <link.icon className="w-6 h-6 text-cyan-500" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                    </div>
                    <h3 className="font-bold mb-1">{link.label}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-500" />
                Your Profile
              </CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-4">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-20 h-20 rounded-full border-4 border-cyan-500/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                      {user.is_verified && (
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-semibold">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Auth Provider</p>
                    <p className="font-semibold capitalize">{user.auth_provider || 'Email'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Button variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
