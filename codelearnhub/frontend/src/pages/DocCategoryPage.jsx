import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Search, BookOpen, Clock, Eye, ChevronRight, Home,
  FileText, Code2, Globe, Smartphone, Brain, Cloud,
  Sparkles, Layers, GitBranch, Database, Filter,
  ArrowRight, Star, Users, ExternalLink
} from 'lucide-react';
import api from '../services/api';

// Category configurations
const categoryConfig = {
  'programming-languages': {
    title: 'Programming Languages',
    description: 'Master any programming language with comprehensive guides, tutorials, and practice exercises.',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    subcategories: [
      { id: 'python', name: 'Python', description: 'General-purpose programming, data science, web development' },
      { id: 'javascript', name: 'JavaScript', description: 'Web development, Node.js, frontend frameworks' },
      { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript for large applications' },
      { id: 'java', name: 'Java', description: 'Enterprise applications, Android, Spring Boot' },
      { id: 'cpp', name: 'C/C++', description: 'Systems programming, game development, performance' },
      { id: 'go', name: 'Go', description: 'Cloud infrastructure, microservices, DevOps tools' },
      { id: 'rust', name: 'Rust', description: 'Systems programming with memory safety' },
      { id: 'csharp', name: 'C#', description: '.NET development, game development with Unity' }
    ],
    externalResources: [
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', description: 'Free interactive programming courses' },
      { name: 'Codecademy', url: 'https://www.codecademy.com', description: 'Interactive coding lessons' },
      { name: 'Exercism', url: 'https://exercism.org', description: 'Free code practice in 60+ languages' }
    ]
  },
  'web-development': {
    title: 'Web Development',
    description: 'Full-stack web development from HTML basics to advanced frameworks and deployment.',
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    subcategories: [
      { id: 'html-css', name: 'HTML & CSS', description: 'Web fundamentals, responsive design, accessibility' },
      { id: 'frontend', name: 'Frontend Development', description: 'React, Vue, Angular, and modern JS frameworks' },
      { id: 'backend', name: 'Backend Development', description: 'Node.js, Python, APIs, databases' },
      { id: 'fullstack', name: 'Full Stack', description: 'Complete web application development' },
      { id: 'devops', name: 'DevOps for Web', description: 'Deployment, CI/CD, cloud hosting' }
    ],
    externalResources: [
      { name: 'The Odin Project', url: 'https://www.theodinproject.com', description: 'Free full-stack curriculum' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Official web documentation' },
      { name: 'Full Stack Open', url: 'https://fullstackopen.com', description: 'Modern web development course' }
    ]
  },
  'mobile-development': {
    title: 'Mobile Development',
    description: 'Build native and cross-platform mobile applications for iOS and Android.',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    subcategories: [
      { id: 'ios', name: 'iOS Development', description: 'Swift, SwiftUI, UIKit, Xcode' },
      { id: 'android', name: 'Android Development', description: 'Kotlin, Jetpack Compose, Android SDK' },
      { id: 'react-native', name: 'React Native', description: 'Cross-platform with React' },
      { id: 'flutter', name: 'Flutter', description: 'Cross-platform with Dart' }
    ],
    externalResources: [
      { name: 'Apple Developer', url: 'https://developer.apple.com', description: 'Official iOS documentation' },
      { name: 'Android Developers', url: 'https://developer.android.com', description: 'Official Android training' },
      { name: 'Flutter Docs', url: 'https://flutter.dev', description: 'Flutter documentation' }
    ]
  },
  'data-science-ai': {
    title: 'Data Science & AI',
    description: 'Data analysis, machine learning, deep learning, and artificial intelligence.',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    subcategories: [
      { id: 'data-analysis', name: 'Data Analysis', description: 'Pandas, NumPy, data visualization' },
      { id: 'machine-learning', name: 'Machine Learning', description: 'Scikit-learn, supervised/unsupervised learning' },
      { id: 'deep-learning', name: 'Deep Learning', description: 'TensorFlow, PyTorch, neural networks' },
      { id: 'nlp', name: 'Natural Language Processing', description: 'Text processing, transformers, LLMs' },
      { id: 'computer-vision', name: 'Computer Vision', description: 'Image processing, object detection' }
    ],
    externalResources: [
      { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', description: 'Free data science micro-courses' },
      { name: 'fast.ai', url: 'https://www.fast.ai', description: 'Practical deep learning courses' },
      { name: 'DeepLearning.AI', url: 'https://www.deeplearning.ai', description: 'Andrew Ng AI courses' }
    ]
  },
  'ai-prompt-engineering': {
    title: 'AI & Prompt Engineering',
    description: 'Master AI tools, prompt engineering, and AI-assisted development.',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
    subcategories: [
      { id: 'ai-fundamentals', name: 'AI Fundamentals', description: 'Understanding LLMs and AI capabilities' },
      { id: 'prompt-basics', name: 'Prompt Engineering Basics', description: 'Writing effective prompts' },
      { id: 'advanced-prompting', name: 'Advanced Prompting', description: 'Chain-of-thought, few-shot learning' },
      { id: 'ai-coding', name: 'AI-Assisted Coding', description: 'GitHub Copilot, code generation' },
      { id: 'ai-integration', name: 'AI Integration', description: 'Building AI-powered applications' }
    ],
    externalResources: [
      { name: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai', description: 'Comprehensive prompting resource' },
      { name: 'Learn Prompting', url: 'https://learnprompting.org', description: 'Free prompting course' },
      { name: 'OpenAI Cookbook', url: 'https://cookbook.openai.com', description: 'OpenAI examples and guides' }
    ]
  },
  'algorithms-dsa': {
    title: 'Algorithms & Data Structures',
    description: 'Data structures, algorithms, and competitive programming for coding interviews.',
    icon: Layers,
    color: 'from-yellow-500 to-orange-500',
    subcategories: [
      { id: 'data-structures', name: 'Data Structures', description: 'Arrays, trees, graphs, hash tables' },
      { id: 'algorithms', name: 'Algorithms', description: 'Sorting, searching, graph algorithms' },
      { id: 'dynamic-programming', name: 'Dynamic Programming', description: 'Optimization and memoization' },
      { id: 'interview-prep', name: 'Interview Preparation', description: 'FAANG interview patterns' }
    ],
    externalResources: [
      { name: 'LeetCode', url: 'https://leetcode.com', description: 'Coding interview practice' },
      { name: 'HackerRank', url: 'https://www.hackerrank.com', description: 'Coding challenges and certifications' },
      { name: 'AlgoExpert', url: 'https://www.algoexpert.io', description: 'Interview preparation platform' }
    ]
  },
  'software-engineering': {
    title: 'Software Engineering Practices',
    description: 'Professional development practices including Git, testing, design patterns, and agile.',
    icon: GitBranch,
    color: 'from-cyan-500 to-blue-500',
    subcategories: [
      { id: 'version-control', name: 'Version Control', description: 'Git, GitHub, branching strategies' },
      { id: 'testing', name: 'Testing', description: 'Unit testing, TDD, integration testing' },
      { id: 'design-patterns', name: 'Design Patterns', description: 'Creational, structural, behavioral patterns' },
      { id: 'clean-code', name: 'Clean Code', description: 'SOLID principles, refactoring' },
      { id: 'agile', name: 'Agile & Project Management', description: 'Scrum, Kanban, sprint planning' }
    ],
    externalResources: [
      { name: 'Git Documentation', url: 'https://git-scm.com/doc', description: 'Official Git documentation' },
      { name: 'Refactoring Guru', url: 'https://refactoring.guru', description: 'Design patterns and refactoring' },
      { name: 'Atlassian Agile', url: 'https://www.atlassian.com/agile', description: 'Agile methodology guides' }
    ]
  },
  'cloud-devops': {
    title: 'Cloud & DevOps',
    description: 'Cloud platforms, containerization, CI/CD, and infrastructure as code.',
    icon: Cloud,
    color: 'from-indigo-500 to-violet-500',
    subcategories: [
      { id: 'aws', name: 'AWS', description: 'Amazon Web Services core and advanced' },
      { id: 'docker', name: 'Docker', description: 'Containerization and Docker Compose' },
      { id: 'kubernetes', name: 'Kubernetes', description: 'Container orchestration' },
      { id: 'cicd', name: 'CI/CD', description: 'Continuous integration and deployment' },
      { id: 'infrastructure', name: 'Infrastructure as Code', description: 'Terraform, CloudFormation' }
    ],
    externalResources: [
      { name: 'AWS Training', url: 'https://aws.amazon.com/training', description: 'Official AWS training' },
      { name: 'Docker Docs', url: 'https://docs.docker.com', description: 'Docker documentation' },
      { name: 'Kubernetes Docs', url: 'https://kubernetes.io/docs', description: 'Kubernetes documentation' }
    ]
  }
};

const DocCategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  const config = categoryConfig[categorySlug];

  useEffect(() => {
    if (!config) {
      navigate('/docs');
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await api.get('/docs/articles', {
          params: { search: searchQuery || undefined, difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined }
        });
        // Filter by category slug in the tags or category_id
        setArticles(response.data.articles || sampleArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles(sampleArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categorySlug, config, navigate, searchQuery, selectedDifficulty]);

  if (!config) {
    return null;
  }

  const IconComponent = config.icon;

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty_level === selectedDifficulty;
    const matchesSubcategory = selectedSubcategory === 'all' || article.tags?.includes(selectedSubcategory);
    return matchesSearch && matchesDifficulty && matchesSubcategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5`} />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/docs" className="hover:text-cyan-500 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Docs
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{config.title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-6"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shrink-0`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-3">{config.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {config.description}
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-500" />
                  <strong>{articles.length}</strong> Articles
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  <strong>{config.subcategories.length}</strong> Topics
                </span>
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-cyan-500" />
                  <strong>{config.externalResources.length}</strong> External Resources
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="py-6 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
              size="sm"
              className={selectedSubcategory === 'all' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
              onClick={() => setSelectedSubcategory('all')}
            >
              All Topics
            </Button>
            {config.subcategories.map(sub => (
              <Button
                key={sub.id}
                variant={selectedSubcategory === sub.id ? 'default' : 'outline'}
                size="sm"
                className={selectedSubcategory === sub.id ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                onClick={() => setSelectedSubcategory(sub.id)}
              >
                {sub.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* Articles List */}
            <div>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                
                <span className="text-sm text-muted-foreground">
                  {filteredArticles.length} articles
                </span>
              </div>

              {/* Articles Grid */}
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 w-20 bg-muted rounded mb-3" />
                        <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                        <div className="h-4 w-full bg-muted rounded" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  <Button onClick={() => { setSearchQuery(''); setSelectedDifficulty('all'); setSelectedSubcategory('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.article_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                                {article.tags?.slice(0, 2).map(tag => (
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
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Subcategory Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-500" />
                    Topics in {config.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {config.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedSubcategory === sub.id
                          ? 'bg-cyan-500/10 border border-cyan-500/50'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <h4 className="font-medium text-sm">{sub.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{sub.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* External Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-cyan-500" />
                    External Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {config.externalResources.map(resource => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        {resource.name}
                        <ExternalLink className="w-3 h-3" />
                      </h4>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </a>
                  ))}
                  <Link to="/docs/resources">
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      View All Resources
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Learning Path CTA */}
              <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-cyan-500" />
                  </div>
                  <h3 className="font-bold mb-2">Want a structured path?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow our curated learning paths for step-by-step guidance.
                  </p>
                  <Link to="/docs/paths">
                    <Button className="bg-cyan-500 hover:bg-cyan-600 w-full gap-2">
                      View Learning Paths
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sample articles for demo
const sampleArticles = [
  {
    article_id: '1',
    title: 'Getting Started Guide',
    slug: 'getting-started',
    excerpt: 'A comprehensive introduction to help you get started with the fundamentals.',
    difficulty_level: 'beginner',
    estimated_reading_time: 10,
    tags: ['fundamentals', 'tutorial'],
    view_count: 2500
  },
  {
    article_id: '2',
    title: 'Core Concepts Explained',
    slug: 'core-concepts',
    excerpt: 'Deep dive into the core concepts that form the foundation of your learning.',
    difficulty_level: 'beginner',
    estimated_reading_time: 15,
    tags: ['concepts', 'theory'],
    view_count: 1800
  },
  {
    article_id: '3',
    title: 'Intermediate Patterns',
    slug: 'intermediate-patterns',
    excerpt: 'Learn common patterns and best practices used by professionals.',
    difficulty_level: 'intermediate',
    estimated_reading_time: 20,
    tags: ['patterns', 'best-practices'],
    view_count: 1200
  },
  {
    article_id: '4',
    title: 'Advanced Techniques',
    slug: 'advanced-techniques',
    excerpt: 'Master advanced techniques and optimization strategies.',
    difficulty_level: 'advanced',
    estimated_reading_time: 30,
    tags: ['advanced', 'optimization'],
    view_count: 800
  },
  {
    article_id: '5',
    title: 'Practical Project Tutorial',
    slug: 'practical-project',
    excerpt: 'Build a complete project from scratch with step-by-step instructions.',
    difficulty_level: 'intermediate',
    estimated_reading_time: 45,
    tags: ['project', 'hands-on'],
    view_count: 1500
  },
  {
    article_id: '6',
    title: 'Common Mistakes to Avoid',
    slug: 'common-mistakes',
    excerpt: 'Learn from common pitfalls and how to avoid them in your projects.',
    difficulty_level: 'beginner',
    estimated_reading_time: 12,
    tags: ['tips', 'debugging'],
    view_count: 2100
  }
];

export default DocCategoryPage;
