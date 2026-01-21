import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  GraduationCap, Clock, Users, Trophy, Target, Zap,
  ChevronRight, ArrowRight, CheckCircle2, Circle, Lock,
  Code2, Globe, Brain, Smartphone, Cloud, Database,
  Sparkles, GitBranch, BookOpen, Star, Play, Loader2
} from 'lucide-react';
import api from '../services/api';

const LearningPathsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Learning paths data
  const learningPaths = [
    {
      id: 'beginner-fullstack',
      slug: 'beginner-fullstack',
      title: 'Complete Beginner to Full Stack Developer',
      description: 'Start from zero and become a professional full-stack web developer. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB step by step.',
      difficulty: 'beginner',
      duration: '12 weeks',
      hoursPerWeek: 10,
      topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
      prerequisites: ['Basic computer skills', 'Willingness to learn'],
      outcomes: [
        'Build responsive websites from scratch',
        'Create React single-page applications',
        'Develop REST APIs with Node.js',
        'Work with MongoDB databases',
        'Deploy applications to the cloud'
      ],
      enrolled: 12500,
      completionRate: 78,
      rating: 4.9,
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      steps: [
        { week: 1, title: 'HTML Fundamentals', description: 'Learn HTML structure, semantic elements, and accessibility' },
        { week: 2, title: 'CSS Mastery', description: 'Master CSS layouts, Flexbox, Grid, and responsive design' },
        { week: 3, title: 'JavaScript Basics', description: 'Variables, functions, loops, and DOM manipulation' },
        { week: 4, title: 'Advanced JavaScript', description: 'ES6+ features, async/await, and modern JS patterns' },
        { week: 5, title: 'React Fundamentals', description: 'Components, props, state, and React hooks' },
        { week: 6, title: 'React Advanced', description: 'Context, routing, forms, and state management' },
        { week: 7, title: 'Node.js Basics', description: 'Server-side JavaScript, modules, and npm' },
        { week: 8, title: 'Express & REST APIs', description: 'Build RESTful APIs with Express.js' },
        { week: 9, title: 'MongoDB', description: 'NoSQL databases, CRUD operations, and Mongoose' },
        { week: 10, title: 'Authentication', description: 'User auth with JWT and session management' },
        { week: 11, title: 'Full Stack Project', description: 'Build a complete MERN stack application' },
        { week: 12, title: 'Deployment', description: 'Deploy to cloud platforms and CI/CD basics' }
      ]
    },
    {
      id: 'ai-prompt-mastery',
      slug: 'ai-prompt-mastery',
      title: 'AI & Prompt Engineering Mastery',
      description: 'Master AI tools and prompt engineering to supercharge your development workflow. Learn to use ChatGPT, GitHub Copilot, and build AI-powered applications.',
      difficulty: 'intermediate',
      duration: '6 weeks',
      hoursPerWeek: 8,
      topics: ['ChatGPT', 'Prompt Engineering', 'GitHub Copilot', 'AI APIs', 'RAG'],
      prerequisites: ['Basic programming knowledge', 'Familiarity with any programming language'],
      outcomes: [
        'Write effective prompts for any AI model',
        'Use GitHub Copilot like a pro',
        'Build AI-powered applications',
        'Implement RAG systems',
        'Understand AI limitations and best practices'
      ],
      enrolled: 8900,
      completionRate: 85,
      rating: 4.8,
      icon: Sparkles,
      color: 'from-purple-500 to-violet-500',
      steps: [
        { week: 1, title: 'AI Fundamentals', description: 'Introduction to LLMs, ChatGPT, Claude, and AI capabilities' },
        { week: 2, title: 'Prompt Basics', description: 'Zero-shot, few-shot, and chain-of-thought prompting' },
        { week: 3, title: 'Advanced Prompting', description: 'Role prompts, system prompts, and prompt templates' },
        { week: 4, title: 'AI-Assisted Coding', description: 'GitHub Copilot, code generation, and debugging with AI' },
        { week: 5, title: 'AI APIs & Integration', description: 'OpenAI API, building AI features in apps' },
        { week: 6, title: 'RAG & Advanced Topics', description: 'Retrieval Augmented Generation and AI agents' }
      ]
    },
    {
      id: 'data-science-career',
      slug: 'data-science-career',
      title: 'Data Science Career Path',
      description: 'Complete journey from Python basics to professional data scientist. Learn data analysis, machine learning, deep learning, and real-world project experience.',
      difficulty: 'intermediate',
      duration: '16 weeks',
      hoursPerWeek: 12,
      topics: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'SQL'],
      prerequisites: ['Basic math (algebra, statistics)', 'Some programming experience helpful'],
      outcomes: [
        'Analyze data with Python and Pandas',
        'Build machine learning models',
        'Create deep learning neural networks',
        'Compete in Kaggle competitions',
        'Build a data science portfolio'
      ],
      enrolled: 7200,
      completionRate: 72,
      rating: 4.7,
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      steps: [
        { week: 1, title: 'Python Fundamentals', description: 'Python basics, data types, functions, and OOP' },
        { week: 2, title: 'NumPy & Arrays', description: 'Numerical computing with NumPy' },
        { week: 3, title: 'Pandas Basics', description: 'DataFrames, data cleaning, and manipulation' },
        { week: 4, title: 'Advanced Pandas', description: 'Grouping, merging, and time series' },
        { week: 5, title: 'Data Visualization', description: 'Matplotlib, Seaborn, and Plotly' },
        { week: 6, title: 'Statistics for DS', description: 'Probability, distributions, and hypothesis testing' },
        { week: 7, title: 'SQL for Data Science', description: 'SQL queries, joins, and database analysis' },
        { week: 8, title: 'ML Fundamentals', description: 'Introduction to machine learning concepts' },
        { week: 9, title: 'Supervised Learning', description: 'Regression, classification, and model evaluation' },
        { week: 10, title: 'Unsupervised Learning', description: 'Clustering, dimensionality reduction' },
        { week: 11, title: 'Deep Learning Basics', description: 'Neural networks with TensorFlow/Keras' },
        { week: 12, title: 'CNNs & Computer Vision', description: 'Convolutional neural networks' },
        { week: 13, title: 'NLP Fundamentals', description: 'Text processing and NLP with transformers' },
        { week: 14, title: 'ML Engineering', description: 'Model deployment and MLOps basics' },
        { week: 15, title: 'Kaggle Competition', description: 'Participate in a real competition' },
        { week: 16, title: 'Portfolio Project', description: 'Complete end-to-end data science project' }
      ]
    },
    {
      id: 'mobile-developer',
      slug: 'mobile-developer',
      title: 'Mobile App Developer Track',
      description: 'Learn to build native and cross-platform mobile applications. Cover React Native, iOS with Swift, or Android with Kotlin.',
      difficulty: 'intermediate',
      duration: '10 weeks',
      hoursPerWeek: 10,
      topics: ['React Native', 'iOS/Swift', 'Android/Kotlin', 'Mobile UI/UX', 'App Store'],
      prerequisites: ['JavaScript knowledge (for React Native)', 'Basic programming concepts'],
      outcomes: [
        'Build cross-platform apps with React Native',
        'Understand native iOS or Android development',
        'Implement mobile UI/UX best practices',
        'Publish apps to app stores',
        'Handle mobile-specific features (camera, GPS, etc.)'
      ],
      enrolled: 5400,
      completionRate: 76,
      rating: 4.6,
      icon: Smartphone,
      color: 'from-pink-500 to-rose-500',
      steps: [
        { week: 1, title: 'Mobile Development Intro', description: 'Overview of mobile platforms and approaches' },
        { week: 2, title: 'React Native Setup', description: 'Environment setup and first app' },
        { week: 3, title: 'React Native Core', description: 'Components, styling, and navigation' },
        { week: 4, title: 'State & Data', description: 'State management and API integration' },
        { week: 5, title: 'Native Features', description: 'Camera, GPS, notifications, and storage' },
        { week: 6, title: 'Mobile UI/UX', description: 'Design patterns and user experience' },
        { week: 7, title: 'Testing & Debugging', description: 'Mobile testing strategies' },
        { week: 8, title: 'Performance', description: 'Optimization and performance tuning' },
        { week: 9, title: 'App Store Prep', description: 'Publishing requirements and preparation' },
        { week: 10, title: 'Final Project', description: 'Build and publish a complete app' }
      ]
    },
    {
      id: 'algorithms-dsa',
      slug: 'algorithms-dsa',
      title: 'Algorithms & Data Structures Mastery',
      description: 'Deep dive into algorithms and data structures. Perfect for coding interviews at top tech companies.',
      difficulty: 'advanced',
      duration: '12 weeks',
      hoursPerWeek: 15,
      topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'System Design'],
      prerequisites: ['Strong programming skills in any language', 'Basic math and logic'],
      outcomes: [
        'Master all common data structures',
        'Solve complex algorithmic problems',
        'Ace coding interviews at FAANG',
        'Understand time/space complexity',
        'Build efficient, optimized solutions'
      ],
      enrolled: 4800,
      completionRate: 65,
      rating: 4.9,
      icon: Code2,
      color: 'from-yellow-500 to-amber-500',
      steps: [
        { week: 1, title: 'Big O & Complexity', description: 'Time and space complexity analysis' },
        { week: 2, title: 'Arrays & Strings', description: 'Array manipulation, two pointers, sliding window' },
        { week: 3, title: 'Linked Lists', description: 'Singly, doubly linked lists, and operations' },
        { week: 4, title: 'Stacks & Queues', description: 'LIFO, FIFO, and applications' },
        { week: 5, title: 'Trees', description: 'Binary trees, BST, traversals' },
        { week: 6, title: 'Advanced Trees', description: 'AVL, Red-Black, Tries, Heaps' },
        { week: 7, title: 'Graphs Basics', description: 'Representations, BFS, DFS' },
        { week: 8, title: 'Advanced Graphs', description: 'Shortest path, MST, topological sort' },
        { week: 9, title: 'Dynamic Programming', description: 'Memoization, tabulation, common patterns' },
        { week: 10, title: 'Advanced DP', description: 'Complex DP problems and optimization' },
        { week: 11, title: 'System Design', description: 'Design patterns for large-scale systems' },
        { week: 12, title: 'Interview Prep', description: 'Mock interviews and problem solving' }
      ]
    },
    {
      id: 'cloud-devops',
      slug: 'cloud-devops',
      title: 'Cloud & DevOps Engineering',
      description: 'Master cloud platforms, containerization, and DevOps practices. Learn AWS, Docker, Kubernetes, and CI/CD pipelines.',
      difficulty: 'advanced',
      duration: '14 weeks',
      hoursPerWeek: 12,
      topics: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
      prerequisites: ['Linux command line experience', 'Basic networking knowledge', 'Some programming experience'],
      outcomes: [
        'Deploy applications on AWS',
        'Containerize applications with Docker',
        'Orchestrate containers with Kubernetes',
        'Implement CI/CD pipelines',
        'Manage infrastructure as code'
      ],
      enrolled: 3600,
      completionRate: 70,
      rating: 4.7,
      icon: Cloud,
      color: 'from-blue-500 to-indigo-500',
      steps: [
        { week: 1, title: 'Linux Fundamentals', description: 'Command line, shell scripting, and system admin' },
        { week: 2, title: 'Networking Basics', description: 'TCP/IP, DNS, HTTP, and load balancing' },
        { week: 3, title: 'Cloud Fundamentals', description: 'Cloud concepts and AWS introduction' },
        { week: 4, title: 'AWS Core Services', description: 'EC2, S3, VPC, IAM, and RDS' },
        { week: 5, title: 'Advanced AWS', description: 'Lambda, ECS, CloudFormation, and more' },
        { week: 6, title: 'Docker Fundamentals', description: 'Containerization, images, and Docker Compose' },
        { week: 7, title: 'Docker in Production', description: 'Best practices, security, and optimization' },
        { week: 8, title: 'Kubernetes Basics', description: 'Pods, services, deployments, and kubectl' },
        { week: 9, title: 'Advanced Kubernetes', description: 'Helm, operators, and cluster management' },
        { week: 10, title: 'CI/CD Pipelines', description: 'GitHub Actions, Jenkins, and GitLab CI' },
        { week: 11, title: 'Infrastructure as Code', description: 'Terraform and CloudFormation' },
        { week: 12, title: 'Monitoring & Logging', description: 'Prometheus, Grafana, and ELK stack' },
        { week: 13, title: 'Security & Compliance', description: 'DevSecOps practices and tools' },
        { week: 14, title: 'Capstone Project', description: 'Full DevOps pipeline implementation' }
      ]
    },
    {
      id: 'backend-engineering',
      slug: 'backend-engineering',
      title: 'Backend Engineering Deep Dive',
      description: 'Master backend development with databases, APIs, authentication, and system design. Build scalable, production-ready services.',
      difficulty: 'intermediate',
      duration: '10 weeks',
      hoursPerWeek: 12,
      topics: ['Node.js', 'Python', 'SQL', 'REST', 'GraphQL', 'Microservices'],
      prerequisites: ['Basic programming knowledge', 'Understanding of HTTP'],
      outcomes: [
        'Design and build REST APIs',
        'Implement GraphQL services',
        'Work with SQL and NoSQL databases',
        'Build authentication systems',
        'Design microservices architecture'
      ],
      enrolled: 6100,
      completionRate: 74,
      rating: 4.8,
      icon: Database,
      color: 'from-cyan-500 to-teal-500',
      steps: [
        { week: 1, title: 'Backend Fundamentals', description: 'HTTP, REST principles, and API design' },
        { week: 2, title: 'Node.js Deep Dive', description: 'Async patterns, streams, and modules' },
        { week: 3, title: 'Express.js Advanced', description: 'Middleware, routing, and error handling' },
        { week: 4, title: 'SQL Databases', description: 'PostgreSQL, queries, indexes, and optimization' },
        { week: 5, title: 'NoSQL Databases', description: 'MongoDB, Redis, and when to use each' },
        { week: 6, title: 'Authentication', description: 'JWT, OAuth, sessions, and security' },
        { week: 7, title: 'GraphQL', description: 'Schema, resolvers, and Apollo Server' },
        { week: 8, title: 'Testing', description: 'Unit, integration, and E2E testing' },
        { week: 9, title: 'Microservices', description: 'Architecture patterns and communication' },
        { week: 10, title: 'Production Ready', description: 'Logging, monitoring, and deployment' }
      ]
    },
    {
      id: 'software-engineering',
      slug: 'software-engineering',
      title: 'Software Engineering Best Practices',
      description: 'Learn professional software development practices including Git, testing, design patterns, clean code, and agile methodologies.',
      difficulty: 'beginner',
      duration: '8 weeks',
      hoursPerWeek: 8,
      topics: ['Git', 'Testing', 'Design Patterns', 'Clean Code', 'Agile'],
      prerequisites: ['Basic programming knowledge', 'Any programming language'],
      outcomes: [
        'Master Git workflows and collaboration',
        'Write comprehensive tests',
        'Apply design patterns effectively',
        'Write clean, maintainable code',
        'Work effectively in agile teams'
      ],
      enrolled: 4200,
      completionRate: 82,
      rating: 4.6,
      icon: GitBranch,
      color: 'from-violet-500 to-purple-500',
      steps: [
        { week: 1, title: 'Git Mastery', description: 'Branches, merges, rebasing, and workflows' },
        { week: 2, title: 'GitHub & Collaboration', description: 'PRs, code reviews, and team workflows' },
        { week: 3, title: 'Testing Fundamentals', description: 'Unit testing, TDD, and test coverage' },
        { week: 4, title: 'Advanced Testing', description: 'Integration, E2E, and mocking' },
        { week: 5, title: 'Clean Code', description: 'Naming, functions, and SOLID principles' },
        { week: 6, title: 'Design Patterns', description: 'Common patterns and when to use them' },
        { week: 7, title: 'Agile & Scrum', description: 'Sprints, ceremonies, and best practices' },
        { week: 8, title: 'Project Management', description: 'Planning, estimation, and tools' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading user progress
    setLoading(true);
    setTimeout(() => {
      if (user) {
        setUserProgress({
          'beginner-fullstack': { progress: 45, currentStep: 5 },
          'ai-prompt-mastery': { progress: 0, currentStep: 0 }
        });
      }
      setLoading(false);
    }, 500);
  }, [user]);

  const filteredPaths = selectedDifficulty === 'all' 
    ? learningPaths 
    : learningPaths.filter(p => p.difficulty === selectedDifficulty);

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleEnroll = async (pathId) => {
    if (!user) {
      toast.error('Please sign in to enroll in a learning path');
      navigate('/signin');
      return;
    }
    
    try {
      await api.post(`/docs/paths/${pathId}/enroll`);
      toast.success('Successfully enrolled!');
      setUserProgress({
        ...userProgress,
        [pathId]: { progress: 0, currentStep: 0 }
      });
    } catch (error) {
      toast.error('Failed to enroll. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Structured Learning Journeys
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Learning <span className="text-cyan-500">Paths</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Follow our structured learning paths to master new skills. Each path is carefully designed with 
              step-by-step lessons, practical projects, and expert guidance.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-500" />
                <span><strong>8</strong> Learning Paths</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-500" />
                <span><strong>50,000+</strong> Learners</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-cyan-500" />
                <span><strong>75%</strong> Avg Completion</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Difficulty Filter */}
      <section className="py-4 border-y bg-muted/30 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
              <TabsTrigger value="all">All Levels</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Learning Paths Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all overflow-hidden group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <path.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(path.difficulty)}>
                            {path.difficulty}
                          </Badge>
                          <span className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {path.rating}
                          </span>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl mb-2 group-hover:text-cyan-500 transition-colors">
                        {path.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {path.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Path Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {path.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {path.hoursPerWeek}h/week
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {path.enrolled.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Topics */}
                      <div className="flex flex-wrap gap-1">
                        {path.topics.slice(0, 5).map(topic => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {path.topics.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{path.topics.length - 5}
                          </Badge>
                        )}
                      </div>
                      
                      {/* User Progress */}
                      {userProgress[path.id] && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium">Your Progress</span>
                            <span className="text-cyan-500">{userProgress[path.id].progress}%</span>
                          </div>
                          <Progress value={userProgress[path.id].progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Step {userProgress[path.id].currentStep + 1} of {path.steps.length}
                          </p>
                        </div>
                      )}
                      
                      {/* Outcomes Preview */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">What you'll learn:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {path.outcomes.slice(0, 3).map((outcome, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex gap-2 pt-2">
                        <Link to={`/docs/paths/${path.slug}`} className="flex-1">
                          <Button className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600">
                            {userProgress[path.id] ? (
                              <>
                                <Play className="w-4 h-4" />
                                Continue Learning
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-4 h-4" />
                                View Path
                              </>
                            )}
                          </Button>
                        </Link>
                        {!userProgress[path.id] && (
                          <Button 
                            variant="outline"
                            onClick={() => handleEnroll(path.id)}
                          >
                            Enroll
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Path Detail */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-cyan-500/10 text-cyan-500">Featured Path</Badge>
              <h2 className="text-3xl font-bold mb-4">Complete Beginner to Full Stack Developer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our most popular learning path takes you from zero programming knowledge to a job-ready 
                full-stack developer in just 12 weeks.
              </p>
            </div>
            
            {/* Timeline */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                
                {learningPaths[0].steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-6 mb-6 last:mb-0"
                  >
                    {/* Step indicator */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      index < 3 ? 'bg-cyan-500 text-white' : 'bg-muted border'
                    }`}>
                      {index < 3 ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{step.week}</span>
                      )}
                    </div>
                    
                    {/* Step content */}
                    <Card className={`flex-1 ${index < 3 ? 'border-cyan-500/50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">Week {step.week}: {step.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {index < 3 ? 'Completed' : 'Upcoming'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center mt-12">
              <Link to="/docs/paths/full-stack-developer">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Start This Path
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Learning Paths */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Follow a Learning Path?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our curated learning paths provide structure and guidance, helping you avoid tutorial hell 
              and make consistent progress toward your goals.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Clear Direction',
                description: 'No more wondering what to learn next. Follow a proven curriculum designed by experts.'
              },
              {
                icon: Zap,
                title: 'Structured Progress',
                description: 'Step-by-step lessons build on each other, ensuring you master fundamentals before advancing.'
              },
              {
                icon: Trophy,
                title: 'Achieve Your Goals',
                description: 'Track your progress, earn certificates, and build a portfolio of real projects.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-cyan-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningPathsPage;
