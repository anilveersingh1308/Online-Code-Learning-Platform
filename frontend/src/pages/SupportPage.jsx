import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { 
  Headphones, Mail, MessageSquare, Clock, Search,
  BookOpen, CreditCard, Download, User, Shield,
  ChevronRight, Send, HelpCircle, FileQuestion,
  Bug, Lightbulb, AlertCircle, Loader2
} from 'lucide-react';
import api from '../services/api';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const supportCategories = [
    { id: 'account', label: 'Account Issues', icon: User, description: 'Login problems, password reset, profile settings' },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard, description: 'Payment issues, refunds, invoices' },
    { id: 'courses', label: 'Course Access', icon: BookOpen, description: 'Course access, video playback, progress tracking' },
    { id: 'downloads', label: 'Downloads', icon: Download, description: 'Project downloads, file access, code issues' },
    { id: 'technical', label: 'Technical Issues', icon: Bug, description: 'Platform bugs, errors, performance issues' },
    { id: 'other', label: 'Other', icon: HelpCircle, description: 'General inquiries and feedback' },
  ];

  const quickLinks = [
    { icon: FileQuestion, title: 'FAQ', description: 'Find answers to common questions', href: '/faq' },
    { icon: BookOpen, title: 'Getting Started', description: 'Learn how to use CodeLearnHub', href: '/courses' },
    { icon: Shield, title: 'Privacy Policy', description: 'How we protect your data', href: '/privacy' },
    { icon: AlertCircle, title: 'Terms of Service', description: 'Our terms and conditions', href: '/terms' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/support/tickets', {
        name: formData.name,
        email: formData.email,
        category: formData.category,
        subject: formData.subject,
        description: formData.message,
        priority: formData.priority || 'medium'
      });
      
      toast.success(`Support ticket #${response.data.ticket_id} submitted! We'll respond within 24 hours.`);
      setFormData({ name: '', email: '', category: '', subject: '', message: '', priority: 'medium' });
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-6">
              <Headphones className="w-4 h-4" />
              We're Here to Help
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Support <span className="text-cyan-500">Center</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Need help? Browse our resources or submit a support ticket. Our team typically responds within 24 hours.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-12 py-6 text-lg rounded-full border-2 focus:border-cyan-500"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Average response: <strong>4 hours</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-500" />
                <span>Satisfaction rate: <strong>98%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" />
                <span>support@codelearnhub.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={link.href}>
                  <Card className="hover:border-cyan-500/50 hover:shadow-md transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <link.icon className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{link.title}</h3>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Support Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">How Can We Help?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {supportCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        formData.category === category.id ? 'border-cyan-500 bg-cyan-500/5' : 'hover:border-cyan-500/50'
                      }`}
                      onClick={() => setFormData({ ...formData, category: category.id })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            formData.category === category.id ? 'bg-cyan-500 text-white' : 'bg-cyan-500/10 text-cyan-500'
                          }`}>
                            <category.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.label}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Resources */}
              <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl">
                <Lightbulb className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Before submitting a ticket, check our FAQ page - you might find an instant answer to your question!
                </p>
                <Link to="/faq">
                  <Button variant="outline" size="sm" className="gap-2">
                    Browse FAQ
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-cyan-500" />
                    Submit a Support Ticket
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Name</label>
                        <Input
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Please describe your issue in detail..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-600 gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email us at</p>
                      <p className="font-medium">support@codelearnhub.com</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Response time</p>
                      <p className="font-medium">Within 24 hours</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
