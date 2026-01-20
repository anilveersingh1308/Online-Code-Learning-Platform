import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

import { coursesApi } from '../services/api';
import { 
  Search, GraduationCap, Clock, Users, Star, 
  Play, BookOpen, Loader2, CheckCircle2
} from 'lucide-react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const categories = ['all', 'Web Development', 'Mobile', 'Data Science', 'DevOps', 'Design', 'Backend'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  // Sample courses for demo
  const sampleCourses = [
    {
      course_id: 'course_001',
      title: 'React Mastery: From Zero to Hero',
      description: 'Complete React course covering hooks, state management, testing, and deployment.',
      category: 'Web Development',
      price: 99,
      difficulty: 'intermediate',
      duration: '24 hours',
      thumbnail: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a',
      is_free: false,
      lessons_count: 48,
      enrolled_count: 2341,
      rating: 4.9,
    },
    {
      course_id: 'course_002',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend services with Node.js, Express, and MongoDB.',
      category: 'Backend',
      price: 79,
      difficulty: 'intermediate',
      duration: '18 hours',
      thumbnail: 'https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg',
      is_free: false,
      lessons_count: 36,
      enrolled_count: 1892,
      rating: 4.8,
    },
    {
      course_id: 'course_003',
      title: 'JavaScript Fundamentals',
      description: 'Master JavaScript basics including ES6+, DOM manipulation, and async programming.',
      category: 'Web Development',
      price: 0,
      difficulty: 'beginner',
      duration: '12 hours',
      thumbnail: 'https://images.unsplash.com/photo-1719400471588-575b23e27bd7',
      is_free: true,
      lessons_count: 24,
      enrolled_count: 5621,
      rating: 4.7,
    },
    {
      course_id: 'course_004',
      title: 'Python for Data Science',
      description: 'Learn Python with pandas, NumPy, and visualization libraries for data analysis.',
      category: 'Data Science',
      price: 129,
      difficulty: 'intermediate',
      duration: '30 hours',
      thumbnail: 'https://images.pexels.com/photos/5257575/pexels-photo-5257575.jpeg',
      is_free: false,
      lessons_count: 60,
      enrolled_count: 3412,
      rating: 4.9,
    },
    {
      course_id: 'course_005',
      title: 'Docker & Kubernetes Essentials',
      description: 'Container orchestration and deployment strategies for modern applications.',
      category: 'DevOps',
      price: 149,
      difficulty: 'advanced',
      duration: '20 hours',
      thumbnail: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a',
      is_free: false,
      lessons_count: 40,
      enrolled_count: 1234,
      rating: 4.8,
    },
    {
      course_id: 'course_006',
      title: 'UI/UX Design Fundamentals',
      description: 'Design principles, Figma mastery, and creating user-centered interfaces.',
      category: 'Design',
      price: 0,
      difficulty: 'beginner',
      duration: '15 hours',
      thumbnail: 'https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg',
      is_free: true,
      lessons_count: 30,
      enrolled_count: 4521,
      rating: 4.6,
    },
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await coursesApi.getAll();
      setCourses(response.data.length > 0 ? response.data : sampleCourses);
    } catch {
      setCourses(sampleCourses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = search === '' || 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || course.category === category;
    const matchesDifficulty = difficulty === 'all' || course.difficulty === difficulty;
    const matchesFree = !showFreeOnly || course.is_free;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFree;
  });

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="courses-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
            Learning Center
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Expert-Led{' '}
            <span className="text-cyan-500">Courses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from industry professionals with hands-on projects and real coding exercises.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white dark:bg-card border border-border rounded-xl p-6 mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="course-search-input"
              />
            </div>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="course-category-filter">
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

            {/* Difficulty */}
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger data-testid="course-difficulty-filter">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Free Only Toggle */}
            <Button
              variant={showFreeOnly ? 'default' : 'outline'}
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={showFreeOnly ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
              data-testid="free-only-toggle"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Free Courses
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.course_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden group hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 bg-white dark:bg-card" data-testid={`course-card-${course.course_id}`}>
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.thumbnail || 'https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                      {course.is_free && (
                        <Badge className="bg-green-500 text-white">
                          Free
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="text-sm text-muted-foreground mb-2">{course.category}</div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons_count} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between">
                    <div>
                      {course.is_free ? (
                        <span className="text-2xl font-black text-green-500">Free</span>
                      ) : (
                        <span className="text-2xl font-black text-cyan-500">${course.price}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolled_count.toLocaleString()} enrolled</span>
                    </div>
                  </CardFooter>

                  {/* Enroll Button */}
                  <div className="px-5 pb-5">
                    <Link to={`/courses/${course.course_id}`}>
                      <Button className="w-full bg-cyan-500 hover:bg-cyan-600 shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300" data-testid={`enroll-btn-${course.course_id}`}>
                        {course.is_free ? 'Start Learning' : 'Enroll Now'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-24">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
