import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { blogApi } from '../services/api';
import { 
  Search, Calendar, Clock, Eye, Loader2, BookOpen
} from 'lucide-react';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', 'Tutorial', 'Tips & Tricks', 'Industry News', 'Career', 'Deep Dive'];

  // Sample posts for demo
  const samplePosts = [
    {
      post_id: 'post_001',
      title: 'Building Scalable React Applications: A Complete Guide',
      excerpt: 'Learn the best practices for building large-scale React applications with proper architecture...',
      category: 'Tutorial',
      tags: ['React', 'Architecture', 'Best Practices'],
      thumbnail: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a',
      created_at: '2024-01-15T10:00:00Z',
      views: 1234,
      read_time: '12 min',
    },
    {
      post_id: 'post_002',
      title: '10 VS Code Extensions Every Developer Needs',
      excerpt: 'Boost your productivity with these essential VS Code extensions that will transform your workflow...',
      category: 'Tips & Tricks',
      tags: ['VS Code', 'Productivity', 'Tools'],
      thumbnail: 'https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg',
      created_at: '2024-01-10T10:00:00Z',
      views: 2341,
      read_time: '8 min',
    },
    {
      post_id: 'post_003',
      title: 'The Future of Web Development in 2024',
      excerpt: 'Exploring upcoming trends and technologies that will shape the web development landscape...',
      category: 'Industry News',
      tags: ['Trends', 'Web Dev', 'Future'],
      thumbnail: 'https://images.unsplash.com/photo-1719400471588-575b23e27bd7',
      created_at: '2024-01-05T10:00:00Z',
      views: 3456,
      read_time: '10 min',
    },
    {
      post_id: 'post_004',
      title: 'From Junior to Senior Developer: A Roadmap',
      excerpt: 'A comprehensive guide on skills, mindset, and strategies to advance your development career...',
      category: 'Career',
      tags: ['Career', 'Growth', 'Skills'],
      thumbnail: 'https://images.pexels.com/photos/5257575/pexels-photo-5257575.jpeg',
      created_at: '2024-01-01T10:00:00Z',
      views: 4567,
      read_time: '15 min',
    },
    {
      post_id: 'post_005',
      title: 'Understanding TypeScript Generics',
      excerpt: 'A deep dive into TypeScript generics with practical examples and common patterns...',
      category: 'Deep Dive',
      tags: ['TypeScript', 'Advanced', 'Programming'],
      thumbnail: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a',
      created_at: '2023-12-28T10:00:00Z',
      views: 1892,
      read_time: '18 min',
    },
    {
      post_id: 'post_006',
      title: 'API Security Best Practices',
      excerpt: 'Essential security measures every developer should implement when building APIs...',
      category: 'Tutorial',
      tags: ['Security', 'API', 'Backend'],
      thumbnail: 'https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg',
      created_at: '2023-12-20T10:00:00Z',
      views: 2134,
      read_time: '14 min',
    },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getAll();
      setPosts(response.data.length > 0 ? response.data : samplePosts);
    } catch {
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = search === '' || 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || post.category === category;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="blog-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
            Blog & Resources
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Developer{' '}
            <span className="text-cyan-500">Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Articles, tutorials, and tips to help you become a better developer.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="blog-search-input"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48" data-testid="blog-category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link to={`/blog/${featuredPost.post_id}`} data-testid="featured-post">
                  <Card className="overflow-hidden group hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 bg-white dark:bg-card">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="aspect-video lg:aspect-auto overflow-hidden">
                        <img
                          src={featuredPost.thumbnail}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-8 flex flex-col justify-center">
                        <Badge className="w-fit mb-4 bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                          {featuredPost.category}
                        </Badge>
                        <h2 className="text-2xl lg:text-3xl font-black mb-4 group-hover:text-cyan-500 transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(featuredPost.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{featuredPost.read_time || '10 min'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{featuredPost.views?.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Other Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, index) => (
                <motion.div
                  key={post.post_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link to={`/blog/${post.post_id}`} data-testid={`blog-card-${post.post_id}`}>
                    <Card className="h-full overflow-hidden group hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 bg-white dark:bg-card">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-5">
                        <Badge variant="secondary" className="mb-3">
                          {post.category}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatDate(post.created_at)}</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views?.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-24">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
