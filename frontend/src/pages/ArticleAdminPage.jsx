import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  BookOpen, Plus, Search, Filter, RefreshCw, Database,
  FileText, Eye, Edit, Trash2, Download, Upload, Check,
  AlertCircle, Loader2, BarChart3, TrendingUp, Users,
  Clock, Code, ListChecks, HelpCircle, ExternalLink
} from 'lucide-react';
import api from '../services/api';

const ArticleAdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticles, setSelectedArticles] = useState([]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming-languages', label: 'Programming Languages' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'data-science-ai', label: 'Data Science & AI' },
    { value: 'ai-prompt-engineering', label: 'AI & Prompt Engineering' },
    { value: 'algorithms-dsa', label: 'Algorithms & DSA' },
    { value: 'software-engineering', label: 'Software Engineering' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'cloud-devops', label: 'Cloud & DevOps' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(difficultyFilter !== 'all' && { difficulty: difficultyFilter }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await api.get(`/docs/articles?${params}`);
      setArticles(response.data.articles || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/docs/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch articles when filters change
  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, difficultyFilter]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const handleSeedArticles = async () => {
    setSeeding(true);
    try {
      const response = await api.post('/seed/articles');
      toast.success(`Seeded ${response.data.total_articles} articles with ${response.data.total_code_examples} code examples!`);
      fetchArticles();
      fetchStats();
    } catch (error) {
      console.error('Error seeding articles:', error);
      toast.error('Failed to seed articles');
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteArticle = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await api.delete(`/docs/articles/${slug}`);
      toast.success('Article deleted');
      fetchArticles();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'programming-languages': 'bg-blue-500/10 text-blue-500',
      'web-development': 'bg-green-500/10 text-green-500',
      'data-science-ai': 'bg-orange-500/10 text-orange-500',
      'ai-prompt-engineering': 'bg-purple-500/10 text-purple-500',
      'algorithms-dsa': 'bg-yellow-500/10 text-yellow-500',
      'software-engineering': 'bg-cyan-500/10 text-cyan-500',
      'mobile-development': 'bg-pink-500/10 text-pink-500',
      'cloud-devops': 'bg-indigo-500/10 text-indigo-500'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  };

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need admin privileges to access this page.
            </p>
            <Link to="/docs">
              <Button>Go to Documentation</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Database className="w-6 h-6 text-cyan-500" />
                Article Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and seed educational content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => fetchArticles()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Seed Articles
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Seed Articles Database</DialogTitle>
                    <DialogDescription>
                      This will add comprehensive educational articles with code examples, exercises, and quizzes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">What will be added:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Python, JavaScript, React articles
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Data Science & Pandas tutorials
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Algorithm & DSA guides
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Prompt Engineering fundamentals
                        </li>
                        <li className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-cyan-500" />
                          25+ code examples
                        </li>
                        <li className="flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-yellow-500" />
                          15+ practice exercises
                        </li>
                        <li className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-purple-500" />
                          20+ quiz questions
                        </li>
                      </ul>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSeedArticles}
                      disabled={seeding}
                    >
                      {seeding ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Seeding Articles...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4 mr-2" />
                          Seed Database
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Articles</p>
                    <p className="text-2xl font-bold">{stats.total_articles}</p>
                  </div>
                  <FileText className="w-10 h-10 text-cyan-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{stats.total_categories}</p>
                  </div>
                  <BookOpen className="w-10 h-10 text-purple-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Learning Paths</p>
                    <p className="text-2xl font-bold">{stats.total_learning_paths}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">By Difficulty</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-green-500/10 text-green-500 text-xs">
                        B: {stats.by_difficulty?.beginner || 0}
                      </Badge>
                      <Badge className="bg-yellow-500/10 text-yellow-500 text-xs">
                        I: {stats.by_difficulty?.intermediate || 0}
                      </Badge>
                      <Badge className="bg-red-500/10 text-red-500 text-xs">
                        A: {stats.by_difficulty?.advanced || 0}
                      </Badge>
                    </div>
                  </div>
                  <BarChart3 className="w-10 h-10 text-yellow-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Articles ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or seed some articles.
                </p>
                <Button onClick={handleSeedArticles} disabled={seeding}>
                  {seeding ? 'Seeding...' : 'Seed Articles'}
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Reading Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.slug}>
                        <TableCell>
                          <div>
                            <Link
                              to={`/docs/article/${article.slug}`}
                              className="font-medium hover:text-cyan-500 transition-colors"
                            >
                              {article.title}
                            </Link>
                            {article.tags && article.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {article.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(article.category_id)}>
                            {article.category_id?.replace(/-/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDifficultyColor(article.difficulty_level)}>
                            {article.difficulty_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {article.view_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {article.estimated_reading_time || 10} min
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/docs/article/${article.slug}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteArticle(article.slug)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Popular Articles */}
        {stats?.popular_articles && stats.popular_articles.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Popular Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popular_articles.map((article, index) => (
                  <div
                    key={article.slug}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <Link
                        to={`/docs/article/${article.slug}`}
                        className="font-medium hover:text-cyan-500 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {article.view_count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArticleAdminPage;
