import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { projectsApi } from '../services/api';
import { 
  Search, Code2, Star, Download, 
  Eye, ShoppingCart, Loader2, Grid, List
} from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tech, setTech] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['all', 'Web App', 'Mobile', 'API', 'Dashboard', 'E-commerce', 'SaaS'];
  const technologies = ['all', 'React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'MongoDB'];

  // Sample projects for demo
  const sampleProjects = [
    {
      project_id: 'proj_001',
      title: 'E-commerce Dashboard',
      description: 'Complete admin dashboard with analytics, inventory management, and order tracking.',
      tech_stack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      category: 'Dashboard',
      price: 149,
      license_type: 'single',
      preview_images: ['https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg'],
      downloads_count: 234,
      rating: 4.8,
      rating_count: 45,
    },
    {
      project_id: 'proj_002',
      title: 'SaaS Starter Kit',
      description: 'Full-featured SaaS boilerplate with authentication, payments, and subscriptions.',
      tech_stack: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'],
      category: 'SaaS',
      price: 249,
      license_type: 'commercial',
      preview_images: ['https://images.unsplash.com/photo-1649451844813-3130d6f42f8a'],
      downloads_count: 156,
      rating: 4.9,
      rating_count: 32,
    },
    {
      project_id: 'proj_003',
      title: 'Real-time Chat App',
      description: 'Modern chat application with real-time messaging, file sharing, and video calls.',
      tech_stack: ['React', 'Socket.io', 'Node.js', 'WebRTC'],
      category: 'Web App',
      price: 99,
      license_type: 'single',
      preview_images: ['https://images.pexels.com/photos/5257575/pexels-photo-5257575.jpeg'],
      downloads_count: 312,
      rating: 4.7,
      rating_count: 58,
    },
    {
      project_id: 'proj_004',
      title: 'REST API Boilerplate',
      description: 'Production-ready API with authentication, rate limiting, and documentation.',
      tech_stack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      category: 'API',
      price: 79,
      license_type: 'single',
      preview_images: ['https://images.unsplash.com/photo-1719400471588-575b23e27bd7'],
      downloads_count: 421,
      rating: 4.6,
      rating_count: 67,
    },
    {
      project_id: 'proj_005',
      title: 'Mobile Banking UI Kit',
      description: 'Beautiful UI components for fintech and banking mobile applications.',
      tech_stack: ['React Native', 'TypeScript', 'Expo'],
      category: 'Mobile',
      price: 129,
      license_type: 'commercial',
      preview_images: ['https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg'],
      downloads_count: 189,
      rating: 4.8,
      rating_count: 29,
    },
    {
      project_id: 'proj_006',
      title: 'E-commerce Platform',
      description: 'Complete online store with cart, checkout, inventory, and admin panel.',
      tech_stack: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'E-commerce',
      price: 299,
      license_type: 'commercial',
      preview_images: ['https://images.unsplash.com/photo-1649451844813-3130d6f42f8a'],
      downloads_count: 267,
      rating: 4.9,
      rating_count: 41,
    },
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data.length > 0 ? response.data : sampleProjects);
    } catch {
      // Use sample data if API fails
      setProjects(sampleProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = search === '' || 
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || project.category === category;
    const matchesTech = tech === 'all' || project.tech_stack.includes(tech);
    const matchesPrice = project.price >= priceRange[0] && project.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesTech && matchesPrice;
  });

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="projects-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
            Marketplace
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Premium Code{' '}
            <span className="text-cyan-500">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-ready code projects with full source code, documentation, and support.
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
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="category-filter">
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

            {/* Tech Filter */}
            <Select value={tech} onValueChange={setTech}>
              <SelectTrigger data-testid="tech-filter">
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                {technologies.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === 'all' ? 'All Technologies' : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Price Range</span>
              <span className="text-sm font-medium">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={500}
              step={10}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredProjects.length}</span> projects
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.project_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden group hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 bg-white dark:bg-card" data-testid={`project-card-${project.project_id}`}>
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.preview_images?.[0] || 'https://images.pexels.com/photos/28428592/pexels-photo-28428592.jpeg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 dark:bg-background/80 backdrop-blur text-foreground shadow-sm">
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{project.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{project.downloads_count}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between">
                    <div className="text-2xl font-black text-cyan-500">
                      ${project.price}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/projects/${project.project_id}`}>
                        <Button variant="outline" size="sm" className="hover:shadow-md transition-all duration-300" data-testid={`preview-btn-${project.project_id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </Link>
                      <Link to={`/projects/${project.project_id}`}>
                        <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300" data-testid={`buy-btn-${project.project_id}`}>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-24">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
