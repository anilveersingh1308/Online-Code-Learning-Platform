import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { 
  Search, BookOpen, Code2, Layers, Globe, Brain, 
  Rocket, Terminal, GitBranch, Smartphone, Cloud, Sparkles,
  ChevronRight, Clock, Eye, TrendingUp, Star, ArrowRight,
  FileText, Video, ExternalLink, Bookmark,
  GraduationCap, Users, Trophy, Target
} from 'lucide-react';
import api from '../services/api';

const DocumentationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [userProgress, setUserProgress] = useState(null);

  // Main documentation categories
  const categories = [
    {
      id: 'programming-languages',
      title: 'Programming Languages',
      description: 'Master Python, JavaScript, Java, C++, and more with comprehensive guides',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      href: '/docs/category/programming-languages',
      topics: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C/C++', 'Go', 'Rust']
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Full-stack web development from HTML basics to advanced frameworks',
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      href: '/docs/category/web-development',
      topics: ['HTML/CSS', 'React', 'Node.js', 'APIs', 'Databases', 'DevOps']
    },
    {
      id: 'mobile-development',
      title: 'Mobile Development',
      description: 'Build iOS, Android, and cross-platform mobile applications',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      href: '/docs/category/mobile-development',
      topics: ['iOS/Swift', 'Android/Kotlin', 'React Native', 'Flutter']
    },
    {
      id: 'data-science-ai',
      title: 'Data Science & AI',
      description: 'Data analysis, machine learning, deep learning, and AI applications',
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      href: '/docs/category/data-science-ai',
      topics: ['Data Analysis', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision']
    },
    {
      id: 'ai-prompt-engineering',
      title: 'AI & Prompt Engineering',
      description: 'Master AI tools, prompt engineering, and AI-assisted development',
      icon: Sparkles,
      color: 'from-violet-500 to-purple-500',
      href: '/docs/category/ai-prompt-engineering',
      topics: ['ChatGPT', 'Prompt Techniques', 'AI Coding', 'GitHub Copilot', 'RAG']
    },
    {
      id: 'algorithms-dsa',
      title: 'Algorithms & DSA',
      description: 'Data structures, algorithms, and competitive programming',
      icon: Layers,
      color: 'from-yellow-500 to-orange-500',
      href: '/docs/category/algorithms-dsa',
      topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting']
    },
    {
      id: 'software-engineering',
      title: 'Software Engineering',
      description: 'Best practices, design patterns, testing, and professional development',
      icon: GitBranch,
      color: 'from-cyan-500 to-blue-500',
      href: '/docs/category/software-engineering',
      topics: ['Git', 'Testing', 'Design Patterns', 'Clean Code', 'Agile']
    },
    {
      id: 'cloud-devops',
      title: 'Cloud & DevOps',
      description: 'Cloud platforms, containerization, CI/CD, and infrastructure',
      icon: Cloud,
      color: 'from-indigo-500 to-violet-500',
      href: '/docs/category/cloud-devops',
      topics: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform']
    }
  ];

  // Quick stats
  const stats = [
    { label: 'Articles', value: '500+', icon: FileText },
    { label: 'Video Hours', value: '200+', icon: Video },
    { label: 'Code Examples', value: '1000+', icon: Terminal },
    { label: 'External Resources', value: '100+', icon: ExternalLink }
  ];

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recentRes, popularRes] = await Promise.all([
          api.get('/docs/featured').catch(() => ({ data: { articles: [] } })),
          api.get('/docs/recent').catch(() => ({ data: { articles: [] } })),
          api.get('/docs/popular').catch(() => ({ data: { articles: [] } }))
        ]);
        
        setFeaturedArticles(featuredRes.data.articles || []);
        setRecentArticles(recentRes.data.articles || []);
        setPopularArticles(popularRes.data.articles || []);
      } catch (error) {
        console.error('Error fetching documentation data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Fetch user progress when logged in
  useEffect(() => {
    if (user) {
      const fetchUserProgress = async () => {
        try {
          const response = await api.get('/docs/user-progress');
          setUserProgress(response.data);
        } catch (error) {
          console.error('Error fetching user progress:', error);
        }
      };
      fetchUserProgress();
    }
  }, [user]);

  // Debounced search
  const handleSearch = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const response = await api.get('/docs/search', { params: { q: query } });
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/docs/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Complete Learning Resource Center
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Documentation & <span className="text-cyan-500">Learning Hub</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your one-stop destination for software development education. From beginner tutorials to advanced topics, master any technology with our comprehensive guides and curated resources.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documentation, tutorials, and resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 py-6 text-lg rounded-full border-2 focus:border-cyan-500"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 rounded-full"
              >
                Search
              </Button>
              
              {/* Search Autocomplete */}
              {searchResults.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={result.article_id}
                      to={`/docs/article/${result.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{result.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{result.excerpt}</p>
                      </div>
                      <Badge className={getDifficultyColor(result.difficulty_level)} variant="secondary">
                        {result.difficulty_level}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-cyan-500" />
                  <span><strong>{stat.value}</strong> {stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Explore by Topic</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive documentation organized by technology and skill level
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={category.href}>
                  <Card className="h-full hover:shadow-lg hover:border-cyan-500/50 transition-all group cursor-pointer overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-cyan-500 transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {category.topics.slice(0, 4).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {category.topics.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.topics.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Learning Paths</h2>
              <p className="text-muted-foreground">Structured learning journeys to master new skills</p>
            </div>
            <Link to="/docs/paths">
              <Button variant="outline" className="gap-2">
                View All Paths <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Static learning paths - will be replaced with API data */}
            {[
              {
                id: 'beginner-fullstack',
                title: 'Complete Beginner to Full Stack Developer',
                description: 'Start from zero and become a professional full-stack web developer in 12 weeks',
                difficulty: 'beginner',
                duration: '12 weeks',
                topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
                enrolled: 1250,
                completion: 78
              },
              {
                id: 'ai-prompt-mastery',
                title: 'AI & Prompt Engineering Mastery',
                description: 'Learn to leverage AI tools effectively for development and productivity',
                difficulty: 'intermediate',
                duration: '6 weeks',
                topics: ['ChatGPT', 'Prompt Engineering', 'GitHub Copilot', 'AI Integration'],
                enrolled: 890,
                completion: 85
              },
              {
                id: 'data-science-career',
                title: 'Data Science Career Path',
                description: 'From Python basics to machine learning - complete data science journey',
                difficulty: 'intermediate',
                duration: '16 weeks',
                topics: ['Python', 'Pandas', 'Machine Learning', 'Deep Learning', 'Kaggle'],
                enrolled: 720,
                completion: 72
              }
            ].map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/docs/paths/${path.id}`}>
                  <Card className="h-full hover:shadow-lg hover:border-cyan-500/50 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {path.duration}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-cyan-500 transition-colors">
                        {path.title}
                      </CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {path.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {path.enrolled.toLocaleString()} enrolled
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          {path.completion}% complete
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Recent Articles */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="featured" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList>
                <TabsTrigger value="featured" className="gap-2">
                  <Star className="w-4 h-4" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="recent" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular
                </TabsTrigger>
              </TabsList>
              <Link to="/docs/articles">
                <Button variant="ghost" className="gap-2">
                  Browse All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <TabsContent value="featured">
              <ArticleGrid articles={featuredArticles.length > 0 ? featuredArticles : sampleArticles} />
            </TabsContent>
            <TabsContent value="recent">
              <ArticleGrid articles={recentArticles.length > 0 ? recentArticles : sampleArticles} />
            </TabsContent>
            <TabsContent value="popular">
              <ArticleGrid articles={popularArticles.length > 0 ? popularArticles : sampleArticles} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* External Resources Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-0 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-sm font-medium mb-4">
                      <ExternalLink className="w-4 h-4" />
                      Curated Resources
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                      External Learning <span className="text-cyan-500">Platforms</span>
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Explore our curated directory of the best learning platforms including freeCodeCamp, Codecademy, Coursera, Kaggle, and 100+ more resources organized by topic and skill level.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link to="/docs/resources">
                        <Button className="bg-cyan-500 hover:bg-cyan-600 gap-2">
                          Browse Resources <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to="/docs/paths">
                        <Button variant="outline" className="gap-2">
                          View Learning Paths
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {['freeCodeCamp', 'Codecademy', 'Coursera', 'Kaggle', 'Udemy', 'MDN'].map((platform) => (
                      <div
                        key={platform}
                        className="bg-background/80 backdrop-blur rounded-lg p-4 text-center shadow-sm"
                      >
                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-cyan-500" />
                        </div>
                        <p className="text-xs font-medium">{platform}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* User Progress Section (if logged in) */}
      {user && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Your Learning Progress</h2>
                  <p className="text-muted-foreground">Continue where you left off</p>
                </div>
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2">
                    View Dashboard <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-500" />
                      Articles Read
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userProgress?.articles_read || 0}</div>
                    <p className="text-sm text-muted-foreground">total articles</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-cyan-500" />
                      Bookmarked
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userProgress?.bookmarked || 0}</div>
                    <p className="text-sm text-muted-foreground">saved articles</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-500" />
                      Learning Paths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userProgress?.enrolled_paths || 0}</div>
                    <p className="text-sm text-muted-foreground">enrolled paths</p>
                    {userProgress?.path_progress > 0 && (
                      <Progress value={userProgress.path_progress} className="mt-2" />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Articles */}
              {userProgress?.recent_articles && userProgress.recent_articles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Continue Reading</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProgress.recent_articles.slice(0, 3).map((article) => (
                      <Link key={article.article_id} to={`/docs/article/${article.slug}`}>
                        <Card className="hover:border-cyan-500/50 transition-colors h-full">
                          <CardContent className="p-4">
                            <h4 className="font-medium line-clamp-1">{article.title}</h4>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {article.estimated_reading_time || 5} min read
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Getting Started CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose a learning path, explore documentation, or dive into any topic that interests you. Your coding journey starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/docs/paths">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Start Learning Path
                </Button>
              </Link>
              <Link to="/docs/article/getting-started-python">
                <Button size="lg" variant="outline" className="gap-2">
                  <Code2 className="w-5 h-5" />
                  Learn Python First
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Sample articles for when API is empty
const sampleArticles = [
  {
    article_id: '1',
    title: 'Getting Started with Python',
    slug: 'getting-started-python',
    excerpt: 'Learn the fundamentals of Python programming from scratch with practical examples.',
    difficulty_level: 'beginner',
    estimated_reading_time: 15,
    tags: ['Python', 'Programming', 'Beginner'],
    view_count: 1250
  },
  {
    article_id: '2',
    title: 'React Hooks Complete Guide',
    slug: 'react-hooks-complete-guide',
    excerpt: 'Master useState, useEffect, useContext, and custom hooks in React applications.',
    difficulty_level: 'intermediate',
    estimated_reading_time: 25,
    tags: ['React', 'JavaScript', 'Hooks'],
    view_count: 980
  },
  {
    article_id: '3',
    title: 'Prompt Engineering Best Practices',
    slug: 'prompt-engineering-best-practices',
    excerpt: 'Learn how to write effective prompts for ChatGPT, Claude, and other AI models.',
    difficulty_level: 'beginner',
    estimated_reading_time: 12,
    tags: ['AI', 'ChatGPT', 'Prompt Engineering'],
    view_count: 2100
  },
  {
    article_id: '4',
    title: 'Building REST APIs with Node.js',
    slug: 'building-rest-apis-nodejs',
    excerpt: 'Create scalable REST APIs using Node.js, Express, and MongoDB.',
    difficulty_level: 'intermediate',
    estimated_reading_time: 30,
    tags: ['Node.js', 'API', 'Backend'],
    view_count: 750
  },
  {
    article_id: '5',
    title: 'Dynamic Programming Explained',
    slug: 'dynamic-programming-explained',
    excerpt: 'Understand dynamic programming concepts with step-by-step problem solutions.',
    difficulty_level: 'advanced',
    estimated_reading_time: 40,
    tags: ['Algorithms', 'DSA', 'Interview'],
    view_count: 620
  },
  {
    article_id: '6',
    title: 'Docker for Developers',
    slug: 'docker-for-developers',
    excerpt: 'Containerize your applications with Docker and improve your development workflow.',
    difficulty_level: 'intermediate',
    estimated_reading_time: 20,
    tags: ['Docker', 'DevOps', 'Containers'],
    view_count: 890
  }
];

// Article Grid Component
const ArticleGrid = ({ articles }) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.article_id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={`/docs/article/${article.slug}`}>
            <Card className="h-full hover:shadow-lg hover:border-cyan-500/50 transition-all group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getDifficultyColor(article.difficulty_level)}>
                    {article.difficulty_level}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {article.estimated_reading_time} min
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-cyan-500 transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {article.view_count?.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default DocumentationPage;
