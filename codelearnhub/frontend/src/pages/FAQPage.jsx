import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { 
  HelpCircle, Search, BookOpen, CreditCard,
  User, Code2, GraduationCap, MessageSquare,
  ChevronRight, Sparkles
} from 'lucide-react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: Sparkles },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
    { id: 'account', label: 'Account', icon: User },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: "What is CodeLearnHub?",
      answer: "CodeLearnHub is a comprehensive learning platform for developers. We offer premium coding projects with source code and expert-led courses covering various programming languages, frameworks, and technologies. Whether you're a beginner or an experienced developer, we have content to help you level up your skills."
    },
    {
      category: 'getting-started',
      question: "How do I create an account?",
      answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner. You can register using your email address and password, or sign up instantly using your Google or GitHub account. Once registered, you'll have access to free content and can purchase premium courses and projects."
    },
    {
      category: 'getting-started',
      question: "Is CodeLearnHub free to use?",
      answer: "CodeLearnHub offers both free and premium content. You can browse our catalog, read blog posts, and access some free resources without paying. Premium courses and downloadable projects require a one-time purchase. We don't have subscription fees – once you buy something, you own it forever."
    },
    {
      category: 'courses',
      question: "How long do I have access to a course?",
      answer: "When you purchase a course, you get lifetime access! You can learn at your own pace, revisit lessons anytime, and access any updates we make to the course content. There are no time limits or expiration dates."
    },
    {
      category: 'courses',
      question: "Are courses self-paced?",
      answer: "Yes, all our courses are self-paced. You can start whenever you want, take breaks, and complete the course on your own schedule. Your progress is automatically saved, so you can pick up right where you left off."
    },
    {
      category: 'courses',
      question: "Do I get a certificate after completing a course?",
      answer: "Yes! Upon completing all lessons and any required exercises in a course, you'll receive a certificate of completion. You can download and share this certificate on your LinkedIn profile or resume."
    },
    {
      category: 'courses',
      question: "Can I download course videos for offline viewing?",
      answer: "Currently, course videos are available for streaming only. This helps us protect the content and ensure you always have access to the latest updates. However, code files, resources, and project files can be downloaded."
    },
    {
      category: 'projects',
      question: "What's included in a project purchase?",
      answer: "Each project includes the complete source code, a detailed README with setup instructions, documentation explaining the code structure, and any assets used in the project. Some projects also include video walkthroughs explaining key concepts."
    },
    {
      category: 'projects',
      question: "Can I use purchased projects in my portfolio?",
      answer: "Absolutely! You can use purchased projects as learning resources and include modified versions in your portfolio. However, you cannot resell the projects or redistribute the original source code. We encourage you to customize and build upon them."
    },
    {
      category: 'projects',
      question: "Can I use purchased projects for commercial purposes?",
      answer: "Yes, you can use purchased projects as a base for commercial applications. However, you cannot resell the project source code itself. If you build a product using our project as a starting point, that's completely fine."
    },
    {
      category: 'payments',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, and various regional payment methods through our payment processor. All transactions are secured with industry-standard encryption."
    },
    {
      category: 'payments',
      question: "What is your refund policy?",
      answer: "We offer a 30-day refund policy for courses if you've completed less than 30% of the content. For downloadable projects, refunds are not available once the files have been downloaded, as the content cannot be returned. If you experience any issues, please contact our support team."
    },
    {
      category: 'payments',
      question: "Do you offer discounts or promotions?",
      answer: "Yes! We regularly offer seasonal promotions, bundle discounts, and special offers for our email subscribers. Follow us on social media and subscribe to our newsletter to stay updated on the latest deals."
    },
    {
      category: 'payments',
      question: "Are there any hidden fees?",
      answer: "No, the price you see is the price you pay. There are no subscription fees, hidden charges, or recurring payments. All purchases are one-time payments with lifetime access."
    },
    {
      category: 'account',
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the sign-in page and enter your email address. We'll send you a link to reset your password. If you signed up with Google or GitHub, you'll need to reset your password through those services."
    },
    {
      category: 'account',
      question: "Can I change my email address?",
      answer: "Yes, you can update your email address in your account settings. For security purposes, we'll send a verification email to your new address before the change takes effect."
    },
    {
      category: 'account',
      question: "How do I delete my account?",
      answer: "You can request account deletion from your account settings. Please note that deleting your account will remove your access to purchased courses and projects. We recommend downloading any project files before requesting deletion."
    },
    {
      category: 'account',
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption for all data transmission, your passwords are securely hashed, and we never share your personal information with third parties for marketing purposes. Read our Privacy Policy for more details."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Frequently Asked <span className="text-cyan-500">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about CodeLearnHub, our courses, projects, and more.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-full border-2 focus:border-cyan-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`rounded-full whitespace-nowrap ${
                  activeCategory === category.id ? 'bg-cyan-500 hover:bg-cyan-600' : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">
            {filteredFaqs.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AccordionItem
                        value={`item-${index}`}
                        className="bg-card border rounded-xl px-6 data-[state=open]:border-cyan-500/50"
                      >
                        <AccordionTrigger className="text-left font-semibold hover:text-cyan-500 py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any FAQ matching your search.
                </p>
                <Button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 text-center"
          >
            <MessageSquare className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-cyan-500 hover:bg-cyan-600 gap-2">
                  Contact Support
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Visit Support Center
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
