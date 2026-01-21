import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Search, ExternalLink, Star, Users, GraduationCap, Code2,
  BookOpen, Brain, Smartphone, Terminal,
  Trophy, Globe, FileText, Sparkles,
  Filter, Grid3X3, List, ChevronRight, Target, Lightbulb
} from 'lucide-react';

const ExternalResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resource categories with icons
  const categories = [
    { id: 'all', label: 'All Platforms', icon: Globe },
    { id: 'foundational', label: 'Foundational', icon: BookOpen },
    { id: 'interactive', label: 'Interactive Practice', icon: Terminal },
    { id: 'project-based', label: 'Project-Based', icon: Code2 },
    { id: 'specialized', label: 'Specialized Skills', icon: Target },
    { id: 'ai-prompt', label: 'AI & Prompt Engineering', icon: Sparkles },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'competitive', label: 'Competitive Programming', icon: Trophy },
    { id: 'mobile', label: 'Mobile Development', icon: Smartphone },
    { id: 'data-science', label: 'Data Science & AI', icon: Brain },
  ];

  // Curated external resources
  const allResources = [
    // Foundational Platforms
    {
      id: 'freecodecamp',
      name: 'freeCodeCamp',
      description: 'A nonprofit organization with free interactive coding curriculum. Over 9,000 hours of content covering HTML, CSS, JavaScript, Python, data science, and more.',
      url: 'https://www.freecodecamp.org',
      logo: '/logos/freecodecamp.png',
      category: 'foundational',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Web Development', 'JavaScript', 'Python', 'Data Science', 'APIs'],
      rating: 4.8,
      users: '40M+',
      highlights: ['Free certificates', 'Project-based learning', 'Active community']
    },
    {
      id: 'codecademy',
      name: 'Codecademy',
      description: 'Interactive learning platform with hands-on coding courses in 14+ programming languages. Premium features include career paths and real-world projects.',
      url: 'https://www.codecademy.com',
      logo: '/logos/codecademy.png',
      category: 'foundational',
      pricing: 'freemium',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Python', 'JavaScript', 'SQL', 'Web Development', 'Data Science'],
      rating: 4.6,
      users: '50M+',
      highlights: ['Interactive exercises', 'Career paths', 'Skill assessments']
    },
    {
      id: 'coursera',
      name: 'Coursera',
      description: 'Online learning platform offering courses, professional certificates, and degrees from top universities like Stanford, Google, and IBM.',
      url: 'https://www.coursera.org',
      logo: '/logos/coursera.png',
      category: 'foundational',
      pricing: 'freemium',
      bestFor: ['beginner', 'intermediate', 'advanced'],
      topics: ['Computer Science', 'Data Science', 'Machine Learning', 'Cloud Computing'],
      rating: 4.7,
      users: '100M+',
      highlights: ['University courses', 'Professional certificates', 'Financial aid available']
    },
    {
      id: 'edx',
      name: 'edX',
      description: 'Online learning destination partnering with Harvard, MIT, and 160+ institutions. Offers MicroMasters, professional certificates, and online degrees.',
      url: 'https://www.edx.org',
      logo: '/logos/edx.png',
      category: 'foundational',
      pricing: 'freemium',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Computer Science', 'Data Analysis', 'Artificial Intelligence', 'Cybersecurity'],
      rating: 4.6,
      users: '40M+',
      highlights: ['Harvard & MIT courses', 'Verified certificates', 'Self-paced learning']
    },
    {
      id: 'udemy',
      name: 'Udemy',
      description: 'Marketplace for learning with 200,000+ courses. Wide variety of tech courses from industry practitioners with frequent sales and discounts.',
      url: 'https://www.udemy.com',
      logo: '/logos/udemy.png',
      category: 'foundational',
      pricing: 'paid',
      bestFor: ['beginner', 'intermediate', 'advanced'],
      topics: ['Web Development', 'Mobile Apps', 'DevOps', 'Cloud', 'Programming'],
      rating: 4.5,
      users: '60M+',
      highlights: ['Lifetime access', 'Frequent sales', 'Diverse instructors']
    },
    {
      id: 'khan-academy',
      name: 'Khan Academy',
      description: 'Free educational platform with courses in computing, math, and science. Great for building foundational knowledge in programming concepts.',
      url: 'https://www.khanacademy.org',
      logo: '/logos/khan.png',
      category: 'foundational',
      pricing: 'free',
      bestFor: ['beginner'],
      topics: ['Computer Science', 'SQL', 'HTML/CSS', 'JavaScript', 'Algorithms'],
      rating: 4.8,
      users: '120M+',
      highlights: ['Completely free', 'Visual explanations', 'Progress tracking']
    },
    // Interactive Practice Platforms
    {
      id: 'exercism',
      name: 'Exercism',
      description: 'Free, open-source coding practice platform with 67 programming languages. Features mentorship from experienced developers.',
      url: 'https://exercism.org',
      logo: '/logos/exercism.png',
      category: 'interactive',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Python', 'JavaScript', 'Go', 'Rust', 'Elixir', '60+ languages'],
      rating: 4.7,
      users: '1M+',
      highlights: ['Free mentorship', '67 languages', 'Code reviews']
    },
    {
      id: 'w3schools',
      name: 'W3Schools',
      description: 'Web development tutorials and references with interactive "Try it Yourself" editor. Essential resource for HTML, CSS, JavaScript reference.',
      url: 'https://www.w3schools.com',
      logo: '/logos/w3schools.png',
      category: 'interactive',
      pricing: 'free',
      bestFor: ['beginner'],
      topics: ['HTML', 'CSS', 'JavaScript', 'SQL', 'Python', 'PHP'],
      rating: 4.4,
      users: '50M+',
      highlights: ['Try it Yourself', 'Quick reference', 'Certifications available']
    },
    {
      id: 'sololearn',
      name: 'SoloLearn',
      description: 'Mobile-first coding learning platform with bite-sized lessons and a supportive community. Learn on the go with gamified lessons.',
      url: 'https://www.sololearn.com',
      logo: '/logos/sololearn.png',
      category: 'interactive',
      pricing: 'freemium',
      bestFor: ['beginner'],
      topics: ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'Web Development'],
      rating: 4.5,
      users: '25M+',
      highlights: ['Mobile learning', 'Gamified', 'Community features']
    },
    {
      id: 'cs-circles',
      name: 'CS Circles',
      description: 'Interactive Python tutorial from University of Waterloo. Perfect for absolute beginners with automatic checking and instant feedback.',
      url: 'https://cscircles.cemc.uwaterloo.ca',
      logo: '/logos/cscircles.png',
      category: 'interactive',
      pricing: 'free',
      bestFor: ['beginner'],
      topics: ['Python', 'Programming Basics', 'Algorithms'],
      rating: 4.6,
      users: '500K+',
      highlights: ['University quality', 'Automatic grading', 'Free']
    },
    // Project-Based Learning
    {
      id: 'odin-project',
      name: 'The Odin Project',
      description: 'Free, open-source curriculum for learning full-stack web development. Project-based learning with a supportive community.',
      url: 'https://www.theodinproject.com',
      logo: '/logos/odin.png',
      category: 'project-based',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Ruby on Rails'],
      rating: 4.9,
      users: '500K+',
      highlights: ['100% free', 'Full-stack curriculum', 'Active Discord community']
    },
    {
      id: 'mit-ocw',
      name: 'MIT OpenCourseWare',
      description: 'Free access to MIT course materials. Computer science courses include Introduction to Algorithms, Data Structures, and AI.',
      url: 'https://ocw.mit.edu',
      logo: '/logos/mit.png',
      category: 'project-based',
      pricing: 'free',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Algorithms', 'Data Structures', 'AI', 'Computer Science Theory'],
      rating: 4.8,
      users: '300M+',
      highlights: ['MIT quality', 'Video lectures', 'Problem sets']
    },
    {
      id: 'fullstackopen',
      name: 'Full Stack Open',
      description: 'University of Helsinki course on modern web development. Covers React, Node.js, GraphQL, TypeScript, and more.',
      url: 'https://fullstackopen.com',
      logo: '/logos/fullstackopen.png',
      category: 'project-based',
      pricing: 'free',
      bestFor: ['intermediate'],
      topics: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript', 'Testing'],
      rating: 4.8,
      users: '100K+',
      highlights: ['Modern stack', 'Free certificates', 'Up-to-date content']
    },
    // Specialized Skills
    {
      id: 'educative',
      name: 'Educative',
      description: 'Text-based interactive courses for developers. Excellent for system design interviews and advanced programming topics.',
      url: 'https://www.educative.io',
      logo: '/logos/educative.png',
      category: 'specialized',
      pricing: 'paid',
      bestFor: ['intermediate', 'advanced'],
      topics: ['System Design', 'Algorithms', 'Machine Learning', 'Cloud'],
      rating: 4.7,
      users: '2M+',
      highlights: ['In-browser coding', 'System design focus', 'Interview prep']
    },
    {
      id: 'kaggle',
      name: 'Kaggle Learn',
      description: 'Free micro-courses on data science and machine learning. Practice with real datasets and compete in ML competitions.',
      url: 'https://www.kaggle.com/learn',
      logo: '/logos/kaggle.png',
      category: 'specialized',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Python', 'Machine Learning', 'Deep Learning', 'Data Visualization', 'SQL'],
      rating: 4.8,
      users: '15M+',
      highlights: ['Free notebooks', 'Real datasets', 'ML competitions']
    },
    {
      id: 'cisco-netacad',
      name: 'Cisco Networking Academy',
      description: 'Industry-leading networking, cybersecurity, and IT courses. Prepare for Cisco certifications and IT careers.',
      url: 'https://www.netacad.com',
      logo: '/logos/cisco.png',
      category: 'specialized',
      pricing: 'freemium',
      bestFor: ['beginner', 'intermediate', 'advanced'],
      topics: ['Networking', 'Cybersecurity', 'IoT', 'DevNet', 'Python'],
      rating: 4.6,
      users: '17M+',
      highlights: ['Industry certifications', 'Hands-on labs', 'Career resources']
    },
    {
      id: 'mongodb-university',
      name: 'MongoDB University',
      description: 'Free courses on MongoDB and database design. Learn from MongoDB engineers and earn certifications.',
      url: 'https://university.mongodb.com',
      logo: '/logos/mongodb.png',
      category: 'specialized',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['MongoDB', 'Database Design', 'Node.js', 'Python', 'Aggregation'],
      rating: 4.7,
      users: '1M+',
      highlights: ['Official MongoDB training', 'Free courses', 'Certification prep']
    },
    // AI & Prompt Engineering
    {
      id: 'deeplearning-ai',
      name: 'DeepLearning.AI',
      description: 'Andrew Ng AI courses on Coursera. Industry-leading courses on machine learning, deep learning, and AI.',
      url: 'https://www.deeplearning.ai',
      logo: '/logos/deeplearningai.png',
      category: 'ai-prompt',
      pricing: 'paid',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
      rating: 4.9,
      users: '7M+',
      highlights: ['Andrew Ng courses', 'Industry standard', 'Specializations']
    },
    {
      id: 'fast-ai',
      name: 'fast.ai',
      description: 'Free deep learning courses with a practical, top-down approach. Learn to build state-of-the-art models quickly.',
      url: 'https://www.fast.ai',
      logo: '/logos/fastai.png',
      category: 'ai-prompt',
      pricing: 'free',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Deep Learning', 'NLP', 'Computer Vision', 'PyTorch'],
      rating: 4.8,
      users: '500K+',
      highlights: ['Practical approach', 'Free courses', 'fastai library']
    },
    {
      id: 'promptingguide',
      name: 'Prompt Engineering Guide',
      description: 'Comprehensive resource for prompt engineering techniques. Learn to write better prompts for LLMs.',
      url: 'https://www.promptingguide.ai',
      logo: '/logos/promptguide.png',
      category: 'ai-prompt',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Prompt Engineering', 'ChatGPT', 'LLMs', 'AI Applications'],
      rating: 4.7,
      users: '100K+',
      highlights: ['Open source', 'Comprehensive', 'Regularly updated']
    },
    {
      id: 'learnprompting',
      name: 'Learn Prompting',
      description: 'Free, open-source course on communicating with AI. From basics to advanced prompt engineering techniques.',
      url: 'https://learnprompting.org',
      logo: '/logos/learnprompting.png',
      category: 'ai-prompt',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Prompt Engineering', 'ChatGPT', 'Claude', 'AI Agents'],
      rating: 4.6,
      users: '200K+',
      highlights: ['Beginner-friendly', 'Community contributions', 'Practical examples']
    },
    // Documentation Resources
    {
      id: 'mdn',
      name: 'MDN Web Docs',
      description: 'Mozilla comprehensive documentation for web technologies. The gold standard for HTML, CSS, and JavaScript reference.',
      url: 'https://developer.mozilla.org',
      logo: '/logos/mdn.png',
      category: 'documentation',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate', 'advanced'],
      topics: ['HTML', 'CSS', 'JavaScript', 'Web APIs', 'Accessibility'],
      rating: 4.9,
      users: '20M+',
      highlights: ['Industry standard', 'Interactive examples', 'Comprehensive']
    },
    {
      id: 'devdocs',
      name: 'DevDocs',
      description: 'Fast, offline-capable API documentation browser. Combines 400+ API documentations in one searchable interface.',
      url: 'https://devdocs.io',
      logo: '/logos/devdocs.png',
      category: 'documentation',
      pricing: 'free',
      bestFor: ['intermediate', 'advanced'],
      topics: ['All Languages', 'Frameworks', 'Libraries', 'APIs'],
      rating: 4.8,
      users: '5M+',
      highlights: ['Offline access', '400+ docs', 'Fast search']
    },
    {
      id: 'stackoverflow',
      name: 'Stack Overflow',
      description: 'Largest community for developers to learn and share knowledge. Q&A format with millions of answered questions.',
      url: 'https://stackoverflow.com',
      logo: '/logos/stackoverflow.png',
      category: 'documentation',
      pricing: 'free',
      bestFor: ['beginner', 'intermediate', 'advanced'],
      topics: ['All Programming Topics', 'Debugging', 'Best Practices'],
      rating: 4.7,
      users: '100M+',
      highlights: ['Huge knowledge base', 'Community answers', 'Search engine']
    },
    // Competitive Programming
    {
      id: 'leetcode',
      name: 'LeetCode',
      description: 'Platform for practicing coding interviews with 2000+ problems. Used by top tech companies for interview preparation.',
      url: 'https://leetcode.com',
      logo: '/logos/leetcode.png',
      category: 'competitive',
      pricing: 'freemium',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Algorithms', 'Data Structures', 'SQL', 'System Design'],
      rating: 4.7,
      users: '10M+',
      highlights: ['Interview prep', 'Company-specific problems', 'Contests']
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      description: 'Coding challenges and skill certifications. Practice problems in 35+ languages and earn skill certificates.',
      url: 'https://www.hackerrank.com',
      logo: '/logos/hackerrank.png',
      category: 'competitive',
      pricing: 'freemium',
      bestFor: ['beginner', 'intermediate'],
      topics: ['Algorithms', 'Data Structures', 'AI', 'SQL', 'Regex'],
      rating: 4.5,
      users: '18M+',
      highlights: ['Skill certifications', '35+ languages', 'Interview prep kits']
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      description: 'Competitive programming platform with regular contests. Home to some of the world\'s best competitive programmers.',
      url: 'https://codeforces.com',
      logo: '/logos/codeforces.png',
      category: 'competitive',
      pricing: 'free',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Competitive Programming', 'Algorithms', 'Mathematics'],
      rating: 4.8,
      users: '2M+',
      highlights: ['Regular contests', 'Rating system', 'Editorial solutions']
    },
    {
      id: 'atcoder',
      name: 'AtCoder',
      description: 'Japanese competitive programming platform with high-quality problems. Regular beginner and advanced contests.',
      url: 'https://atcoder.jp',
      logo: '/logos/atcoder.png',
      category: 'competitive',
      pricing: 'free',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Competitive Programming', 'Algorithms', 'Mathematics'],
      rating: 4.7,
      users: '400K+',
      highlights: ['Quality problems', 'Beginner contests', 'English support']
    },
    {
      id: 'projecteuler',
      name: 'Project Euler',
      description: 'Mathematical/computational problems that require programming to solve. 900+ problems of increasing difficulty.',
      url: 'https://projecteuler.net',
      logo: '/logos/euler.png',
      category: 'competitive',
      pricing: 'free',
      bestFor: ['intermediate', 'advanced'],
      topics: ['Mathematics', 'Algorithms', 'Problem Solving'],
      rating: 4.6,
      users: '1M+',
      highlights: ['Mathematical focus', '900+ problems', 'No time limits']
    },
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setResources(allResources);
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesPricing = selectedPricing === 'all' || resource.pricing === selectedPricing;
    const matchesLevel = selectedLevel === 'all' || resource.bestFor.includes(selectedLevel);
    
    return matchesSearch && matchesCategory && matchesPricing && matchesLevel;
  });

  const getPricingBadge = (pricing) => {
    switch (pricing) {
      case 'free': return <Badge className="bg-green-500/10 text-green-500">Free</Badge>;
      case 'freemium': return <Badge className="bg-yellow-500/10 text-yellow-500">Freemium</Badge>;
      case 'paid': return <Badge className="bg-purple-500/10 text-purple-500">Paid</Badge>;
      default: return null;
    }
  };

  const getLevelBadges = (levels) => {
    return levels.map(level => {
      const color = level === 'beginner' ? 'bg-green-500/10 text-green-500' :
                    level === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500';
      return <Badge key={level} variant="outline" className={`text-xs ${color}`}>{level}</Badge>;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-6">
              <ExternalLink className="w-4 h-4" />
              Curated Learning Platforms
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              External <span className="text-cyan-500">Resources</span> Directory
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Discover the best learning platforms, courses, and documentation resources. 
              We've curated 100+ platforms to help you find the perfect resource for your learning journey.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search platforms, topics, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-full border-2 focus:border-cyan-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-4 border-y bg-muted/30 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPricing} onValueChange={setSelectedPricing}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pricing</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="freemium">Freemium</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredResources.length} platforms
              </span>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none h-9 w-9"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none h-9 w-9"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                className={`gap-2 ${selectedCategory === cat.id ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                    <div className="h-6 w-2/3 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted rounded mb-2" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No platforms found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedPricing('all');
                setSelectedLevel('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg hover:border-cyan-500/50 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-cyan-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          {getPricingBadge(resource.pricing)}
                          <span className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {resource.rating}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-cyan-500 transition-colors">
                        {resource.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {resource.topics.slice(0, 4).map(topic => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {resource.topics.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{resource.topics.length - 4}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {resource.users} learners
                          </span>
                          <div className="flex gap-1">
                            {getLevelBadges(resource.bestFor.slice(0, 2))}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {resource.highlights?.map(h => (
                            <Badge key={h} variant="secondary" className="text-xs">
                              {h}
                            </Badge>
                          ))}
                        </div>
                        
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600">
                            Visit Platform
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="hover:shadow-md hover:border-cyan-500/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-8 h-8 text-cyan-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">{resource.name}</h3>
                            {getPricingBadge(resource.pricing)}
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {resource.rating}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {resource.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {resource.topics.slice(0, 5).map(topic => (
                              <Badge key={topic} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right mr-4 hidden md:block">
                            <p className="text-sm font-medium">{resource.users} learners</p>
                            <div className="flex gap-1 justify-end mt-1">
                              {getLevelBadges(resource.bestFor.slice(0, 2))}
                            </div>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button className="gap-2 bg-cyan-500 hover:bg-cyan-600">
                              Visit
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <Lightbulb className="w-12 h-12 mx-auto text-cyan-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground mb-6">
              Suggest a learning platform or resource that you think should be included in our directory.
            </p>
            <Link to="/contact">
              <Button className="bg-cyan-500 hover:bg-cyan-600 gap-2">
                Suggest a Resource
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ExternalResourcesPage;
