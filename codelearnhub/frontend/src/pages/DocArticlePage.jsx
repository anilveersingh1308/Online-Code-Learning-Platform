import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { 
  BookOpen, Clock, Eye, ChevronLeft, ChevronRight, Home,
  Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown,
  Copy, Check, ExternalLink, FileText, User, Calendar,
  List, Hash, ArrowUp, MessageSquare, Send, Loader2, Code, Brain, HelpCircle, Briefcase, LinkIcon
} from 'lucide-react';
import api from '../services/api';
import {
  CodeExample,
  ExerciseCard,
  QuizSection,
  InterviewQuestions,
  ExternalResourcesList
} from '../components/ArticleComponents';

const DocArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const contentRef = useRef(null);
  const [article, setArticle] = useState(null);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [readProgress, setReadProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({ helpful: false, notHelpful: false });

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/docs/articles/${slug}`);
        setArticle(response.data.article);
        setCategory(response.data.category);
        setRelated(response.data.related || []);
        setIsBookmarked(response.data.user_progress?.is_bookmarked || false);
        
        // Fetch comments
        const commentsRes = await api.get(`/docs/articles/${response.data.article.article_id}/comments`);
        setComments(commentsRes.data.comments || []);
      } catch (error) {
        console.error('Error fetching article:', error);
        toast.error('Article not found');
        navigate('/docs');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, navigate]);

  // Generate table of contents from markdown headings
  useEffect(() => {
    if (article?.content) {
      const headingRegex = /^#{1,3}\s+(.+)$/gm;
      const toc = [];
      let match;
      
      while ((match = headingRegex.exec(article.content)) !== null) {
        const level = match[0].match(/^#+/)[0].length;
        const text = match[1].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc.push({ level, text, id });
      }
      
      setTableOfContents(toc);
    }
  }, [article]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollTop = window.scrollY - element.offsetTop;
        const scrollHeight = element.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        setReadProgress(progress);
        
        // Update active section
        const headings = element.querySelectorAll('h1, h2, h3');
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          if (heading.getBoundingClientRect().top <= 100) {
            setActiveSection(heading.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save progress when reading
  useEffect(() => {
    if (user && article && readProgress > 0) {
      const saveProgress = async () => {
        try {
          await api.post(`/docs/progress/${article.article_id}`, null, {
            params: { progress: readProgress, completed: readProgress >= 90 }
          });
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      };
      
      const timer = setTimeout(saveProgress, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, article, readProgress]);

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark articles');
      return;
    }
    
    try {
      const response = await api.post(`/docs/bookmark/${article.article_id}`);
      setIsBookmarked(response.data.bookmarked);
      toast.success(response.data.bookmarked ? 'Article bookmarked!' : 'Bookmark removed');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleCopyCode = async (code, index) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFeedback = async (helpful) => {
    if (feedbackSubmitted.helpful || feedbackSubmitted.notHelpful) {
      toast.info('You have already submitted feedback');
      return;
    }
    
    try {
      await api.post(`/docs/articles/${article.article_id}/feedback`, null, {
        params: { helpful }
      });
      setFeedbackSubmitted({ helpful, notHelpful: !helpful });
      toast.success('Thanks for your feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      await api.post(`/docs/articles/${article.article_id}/comments`, null, {
        params: { content: newComment }
      });
      setNewComment('');
      toast.success('Comment added!');
      
      // Refresh comments
      const response = await api.get(`/docs/articles/${article.article_id}/comments`);
      setComments(response.data.comments || []);
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Custom markdown components
  const markdownComponents = {
    h1: ({ children }) => {
      const id = children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h1 id={id} className="text-3xl font-bold mt-8 mb-4 scroll-mt-20">{children}</h1>;
    },
    h2: ({ children }) => {
      const id = children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h2 id={id} className="text-2xl font-bold mt-6 mb-3 scroll-mt-20">{children}</h2>;
    },
    h3: ({ children }) => {
      const id = children.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h3 id={id} className="text-xl font-semibold mt-4 mb-2 scroll-mt-20">{children}</h3>;
    },
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ href, children }) => (
      <a 
        href={href} 
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-cyan-500 hover:underline inline-flex items-center gap-1"
      >
        {children}
        {href?.startsWith('http') && <ExternalLink className="w-3 h-3" />}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-cyan-500/5 rounded-r">
        {children}
      </blockquote>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      const codeIndex = Math.random();
      
      if (!inline && match) {
        return (
          <div className="relative group my-4">
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
              <Badge variant="secondary" className="text-xs">
                {match[1]}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyCode(codeString, codeIndex)}
              >
                {copiedCode === codeIndex ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <SyntaxHighlighter
              style={theme === 'dark' ? oneDark : oneLight}
              language={match[1]}
              PreTag="div"
              className="rounded-lg !mt-0"
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full border-collapse border border-border rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),
    hr: () => <Separator className="my-8" />,
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" />
    )
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
        <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
        <Link to="/docs">
          <Button>Back to Documentation</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div 
          className="h-full bg-cyan-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[250px_1fr_250px] gap-8">
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <List className="w-4 h-4" />
                On This Page
              </h4>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm py-1 transition-colors hover:text-cyan-500 ${
                      item.level === 1 ? 'font-medium' : item.level === 2 ? 'pl-3' : 'pl-6'
                    } ${activeSection === item.id ? 'text-cyan-500 border-l-2 border-cyan-500 pl-2' : 'text-muted-foreground'}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
              
              <Separator className="my-6" />
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start gap-2"
                        onClick={handleBookmark}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-cyan-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save for later</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main ref={contentRef}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/docs" className="hover:text-cyan-500 flex items-center gap-1">
                <Home className="w-4 h-4" />
                Docs
              </Link>
              <ChevronRight className="w-4 h-4" />
              {category && (
                <>
                  <Link to={`/docs/${category.slug}`} className="hover:text-cyan-500">
                    {category.name}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-foreground">{article.title}</span>
            </nav>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={getDifficultyColor(article.difficulty_level)}>
                  {article.difficulty_level}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {article.estimated_reading_time} min read
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {article.view_count?.toLocaleString()} views
                </span>
              </div>
              
              <h1 className="text-4xl font-black mb-4">{article.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags?.map((tag) => (
                  <Link key={tag} to={`/docs/search?tag=${tag}`}>
                    <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              {/* Author & Date */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  CodeLearnHub Team
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Updated {new Date(article.updated_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>

            <Separator className="mb-8" />

            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {article.content || defaultContent}
              </ReactMarkdown>
            </motion.article>

            {/* Code Examples Section */}
            {article.code_examples && article.code_examples.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Code className="w-6 h-6 text-cyan-500" />
                  Code Examples ({article.code_examples.length})
                </h2>
                <div className="space-y-6">
                  {article.code_examples.map((example, index) => (
                    <CodeExample key={index} example={example} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Practice Exercises Section */}
            {article.exercises && article.exercises.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-500" />
                  Practice Exercises ({article.exercises.length})
                </h2>
                <p className="text-muted-foreground mb-6">
                  Put your knowledge to the test with these hands-on exercises.
                </p>
                <div className="space-y-6">
                  {article.exercises.map((exercise, index) => (
                    <ExerciseCard key={index} exercise={exercise} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Quiz Section */}
            {article.quiz_questions && article.quiz_questions.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-green-500" />
                  Knowledge Check
                </h2>
                <p className="text-muted-foreground mb-6">
                  Test your understanding with this quick quiz.
                </p>
                <QuizSection 
                  questions={article.quiz_questions} 
                  articleSlug={article.slug}
                />
              </motion.section>
            )}

            {/* Interview Questions Section */}
            {article.interview_questions && article.interview_questions.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-amber-500" />
                  Interview Questions
                </h2>
                <p className="text-muted-foreground mb-6">
                  Prepare for technical interviews with these common questions about this topic.
                </p>
                <InterviewQuestions questions={article.interview_questions} />
              </motion.section>
            )}

            {/* External Resources Section */}
            {article.external_resources && article.external_resources.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <LinkIcon className="w-6 h-6 text-blue-500" />
                  Additional Resources
                </h2>
                <p className="text-muted-foreground mb-6">
                  Continue your learning journey with these curated resources.
                </p>
                <ExternalResourcesList resources={article.external_resources} />
              </motion.section>
            )}

            <Separator className="my-8" />

            {/* Feedback Section */}
            <div className="flex items-center justify-between py-6 bg-muted/50 rounded-lg px-6 mb-8">
              <div>
                <h4 className="font-semibold mb-1">Was this article helpful?</h4>
                <p className="text-sm text-muted-foreground">Let us know what you think!</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={feedbackSubmitted.helpful ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${feedbackSubmitted.helpful ? 'bg-green-500 hover:bg-green-600' : ''}`}
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackSubmitted.helpful || feedbackSubmitted.notHelpful}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </Button>
                <Button
                  variant={feedbackSubmitted.notHelpful ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${feedbackSubmitted.notHelpful ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackSubmitted.helpful || feedbackSubmitted.notHelpful}
                >
                  <ThumbsDown className="w-4 h-4" />
                  No
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Previous Article
              </Button>
              <Button variant="outline" className="gap-2">
                Next Article
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments ({comments.length})
              </h3>
              
              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <Textarea
                    placeholder="Share your thoughts or ask a question..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3"
                    rows={3}
                  />
                  <Button 
                    type="submit" 
                    className="gap-2 bg-cyan-500 hover:bg-cyan-600"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Post Comment
                  </Button>
                </form>
              ) : (
                <Card className="mb-6">
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground mb-2">Sign in to join the discussion</p>
                    <Link to="/signin">
                      <Button>Sign In</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
              
              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.comment_id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{comment.user?.name || 'User'}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Related Articles */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Related Articles
              </h4>
              
              <div className="space-y-3">
                {(related.length > 0 ? related : sampleRelated).map((item) => (
                  <Link key={item.article_id} to={`/docs/article/${item.slug}`}>
                    <Card className="hover:border-cyan-500/50 transition-colors">
                      <CardContent className="p-3">
                        <Badge className={`mb-2 text-xs ${getDifficultyColor(item.difficulty_level)}`}>
                          {item.difficulty_level}
                        </Badge>
                        <h5 className="font-medium text-sm line-clamp-2 hover:text-cyan-500 transition-colors">
                          {item.title}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.estimated_reading_time} min
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              {/* External Resources */}
              {article.external_links?.length > 0 && (
                <>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </h4>
                  <div className="space-y-2">
                    {article.external_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-500 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.title}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {readProgress > 20 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-600 flex items-center justify-center z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

// Default content for demo
const defaultContent = `
# Getting Started

Welcome to this comprehensive guide. This article will walk you through everything you need to know to get started.

## Prerequisites

Before we begin, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn package manager
- A code editor (VS Code recommended)

## Installation

First, let's install the necessary dependencies:

\`\`\`bash
npm install package-name
\`\`\`

## Basic Usage

Here's a simple example to get you started:

\`\`\`javascript
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div>
      <h1>Hello World</h1>
      {data && <p>{data.message}</p>}
    </div>
  );
}

export default App;
\`\`\`

## Key Concepts

Understanding these core concepts is essential:

1. **Components** - Building blocks of your application
2. **Props** - Data passed between components
3. **State** - Internal component data

> **Pro Tip:** Always start with a simple implementation and iterate from there.

## Best Practices

Here are some best practices to follow:

| Practice | Description |
|----------|-------------|
| Clean Code | Write readable, maintainable code |
| Testing | Test your code thoroughly |
| Documentation | Document your code |

## Next Steps

Now that you understand the basics, you can:

- Explore advanced features
- Build your first project
- Join our community

## Conclusion

Congratulations! You've completed this guide. Happy coding! 🚀
`;

// Sample related articles
const sampleRelated = [
  {
    article_id: '1',
    title: 'Advanced Patterns and Techniques',
    slug: 'advanced-patterns',
    difficulty_level: 'advanced',
    estimated_reading_time: 20
  },
  {
    article_id: '2',
    title: 'Common Mistakes to Avoid',
    slug: 'common-mistakes',
    difficulty_level: 'intermediate',
    estimated_reading_time: 10
  },
  {
    article_id: '3',
    title: 'Project Ideas for Practice',
    slug: 'project-ideas',
    difficulty_level: 'beginner',
    estimated_reading_time: 8
  }
];

export default DocArticlePage;
