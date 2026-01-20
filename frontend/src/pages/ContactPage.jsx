import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { contactApi } from '../services/api';
import { toast } from 'sonner';
import { 
  Mail, Phone, MapPin, Clock, Send, 
  Github, Twitter, Linkedin, MessageSquare, CheckCircle2
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    purpose: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const purposes = [
    { value: 'hire', label: 'Hire Me for a Project' },
    { value: 'collaborate', label: 'Collaboration Opportunity' },
    { value: 'support', label: 'Technical Support' },
    { value: 'general', label: 'General Inquiry' },
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@codelearnhub.com', href: 'mailto:hello@codelearnhub.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA', href: '#' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: '#' },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
            Contact
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Let's{' '}
            <span className="text-cyan-500">Connect</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-card shadow-lg">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. I'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', purpose: '', message: '' });
                    }}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                          data-testid="contact-name-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                          data-testid="contact-email-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Select
                        value={formData.purpose}
                        onValueChange={(value) => handleChange('purpose', value)}
                      >
                        <SelectTrigger data-testid="contact-purpose-select">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposes.map((purpose) => (
                            <SelectItem key={purpose.value} value={purpose.value}>
                              {purpose.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project or inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        required
                        data-testid="contact-message-input"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-cyan-500 hover:bg-cyan-600 h-12 rounded-full shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                      disabled={loading}
                      data-testid="contact-submit-btn"
                    >
                      {loading ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Info Cards */}
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 bg-white dark:bg-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      <div className="font-medium">{info.value}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}

            {/* Social Links */}
            <Card className="bg-white dark:bg-card shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Follow Me</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-muted flex items-center justify-center text-muted-foreground hover:bg-cyan-500 hover:text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Message */}
            <Card className="bg-cyan-500/10 border-cyan-500/20 shadow-md">
              <CardContent className="p-6">
                <MessageSquare className="w-8 h-8 text-cyan-600 dark:text-cyan-500 mb-4" />
                <h3 className="font-bold mb-2">Prefer to Chat?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to send direct messages through the connection hub.
                </p>
                <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-white">
                  Connect with Me
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
