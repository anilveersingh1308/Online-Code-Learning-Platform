import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Code2, GraduationCap, Users, Zap, 
  Star, TrendingUp, Shield
} from 'lucide-react';

const HomePage = () => {
  const { login, isAuthenticated } = useAuth();

  const stats = [
    { value: '500+', label: 'Code Projects', icon: Code2 },
    { value: '50+', label: 'Courses', icon: GraduationCap },
    { value: '10K+', label: 'Students', icon: Users },
    { value: '98%', label: 'Success Rate', icon: TrendingUp },
  ];

  const features = [
    {
      icon: Code2,
      title: 'Premium Code Projects',
      description: 'Production-ready code with full documentation, tested and optimized for real-world use.',
    },
    {
      icon: GraduationCap,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with hands-on projects and real coding exercises.',
    },
    {
      icon: Users,
      title: 'Developer Network',
      description: 'Connect with mentors, find collaborators, and grow your professional network.',
    },
    {
      icon: Shield,
      title: 'Licensed & Secure',
      description: 'All projects come with proper licensing. Your purchases are protected and verified.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'The code quality is exceptional. Saved me weeks of development time on my last project.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Startup Founder',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'The courses helped me transition from backend to full-stack. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Tech Lead',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Found amazing collaborators through the networking hub. Game changer for my career.',
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWVyJTIwY29kaW5nJTIwZGFyayUyMHJvb218ZW58MHx8fHwxNzY4ODM0OTg0fDA&ixlib=rb-4.1.0&q=85)` }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content - Asymmetric */}
            <motion.div 
              className="lg:col-span-7"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 mb-6 shadow-sm">
                  <Zap className="w-3 h-3 mr-1" />
                  Premium Developer Platform
                </Badge>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6"
              >
                Build Better.{' '}
                <span className="text-cyan-500">Learn Faster.</span>{' '}
                Connect Smarter.
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg text-muted-foreground mb-8 max-w-xl"
              >
                Access premium code projects, expert-led courses, and a thriving developer community. 
                Everything you need to accelerate your coding journey.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link to="/projects">
                  <Button 
                    size="lg" 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 h-12"
                    data-testid="hero-explore-btn"
                  >
                    Explore Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-full px-8 h-12 border-2"
                    data-testid="hero-courses-btn"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-border"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-black text-cyan-500">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Code Preview Card */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-2xl blur-xl" />
                
                <Card className="relative bg-zinc-900 dark:bg-card/80 backdrop-blur border-zinc-800 dark:border-border/50 overflow-hidden shadow-2xl">
                  {/* Code Editor Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-2">App.jsx</span>
                  </div>
                  
                  <CardContent className="p-0">
                    <pre className="p-4 text-sm font-mono overflow-x-auto">
                      <code className="text-muted-foreground">
                        <span className="text-purple-400">import</span>{' '}
                        <span className="text-cyan-400">React</span>{' '}
                        <span className="text-purple-400">from</span>{' '}
                        <span className="text-amber-400">'react'</span>;{'\n\n'}
                        <span className="text-purple-400">export default function</span>{' '}
                        <span className="text-cyan-400">App</span>() {'{\n'}
                        {'  '}<span className="text-purple-400">return</span> ({'\n'}
                        {'    '}<span className="text-green-400">{'<div'}</span>{' '}
                        <span className="text-amber-400">className</span>=
                        <span className="text-amber-400">"app"</span>
                        <span className="text-green-400">{'>'}</span>{'\n'}
                        {'      '}<span className="text-green-400">{'<h1>'}</span>
                        Hello, World!
                        <span className="text-green-400">{'</h1>'}</span>{'\n'}
                        {'    '}<span className="text-green-400">{'</div>'}</span>{'\n'}
                        {'  '});{'\n'}
                        {'}'}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From premium code projects to expert courses and professional networking, 
              we've got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                      <feature.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Loved by Developers Worldwide
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900/50">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
                      />
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-900/50 dark:to-zinc-950/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-6">
              Ready to Level Up Your Coding Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building better projects, 
              learning faster, and connecting with the community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 h-12 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300"
                    data-testid="cta-dashboard-btn"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  onClick={login}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 h-12 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300"
                  data-testid="cta-signup-btn"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Link to="/projects">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 h-12 border-2 hover:shadow-lg transition-all duration-300"
                  data-testid="cta-browse-btn"
                >
                  Browse Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
