import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Code2, Palette, Smartphone, Cloud, 
  CheckCircle2, ArrowRight, Zap
} from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: Code2,
      title: 'Custom Development',
      description: 'Full-stack web applications tailored to your specific requirements.',
      features: [
        'Requirements Analysis',
        'UI/UX Design',
        'Frontend Development',
        'Backend Development',
        'Testing & QA',
        'Deployment & Support'
      ],
      pricing: [
        { name: 'Basic', price: '$2,999', features: ['Single Page App', '5 API Endpoints', '1 Month Support'] },
        { name: 'Pro', price: '$7,999', features: ['Multi-page App', '20 API Endpoints', '3 Months Support', 'Admin Panel'] },
        { name: 'Enterprise', price: 'Custom', features: ['Unlimited Pages', 'Custom Features', '12 Months Support', 'Dedicated Team'] },
      ]
    },
    {
      icon: Palette,
      title: 'Code Projects',
      description: 'Ready-to-use, production-quality code projects for various use cases.',
      features: [
        'Full Source Code',
        'Documentation',
        'Installation Guide',
        'Free Updates',
        'Commercial License',
        'Support Included'
      ],
      pricing: [
        { name: 'Starter', price: '$49', features: ['Basic Templates', 'Personal License', 'Email Support'] },
        { name: 'Developer', price: '$149', features: ['Premium Projects', 'Commercial License', 'Priority Support'] },
        { name: 'Team', price: '$499', features: ['All Projects', 'Team License', '24/7 Support', 'Custom Requests'] },
      ]
    },
    {
      icon: Smartphone,
      title: 'Tutoring & Mentorship',
      description: 'One-on-one sessions to accelerate your learning and career growth.',
      features: [
        'Personalized Curriculum',
        'Code Reviews',
        'Career Guidance',
        'Portfolio Building',
        'Interview Prep',
        'Project Assistance'
      ],
      pricing: [
        { name: 'Single Session', price: '$99', features: ['1 Hour Session', 'Code Review', 'Resources'] },
        { name: 'Monthly', price: '$399', features: ['4 Sessions/Month', 'Async Support', 'Project Help'] },
        { name: 'Intensive', price: '$1,499', features: ['12 Sessions', 'Daily Support', 'Career Coaching', 'Portfolio Review'] },
      ]
    },
    {
      icon: Cloud,
      title: 'Consulting',
      description: 'Expert advice on architecture, tech stack, and development strategy.',
      features: [
        'Architecture Review',
        'Tech Stack Selection',
        'Performance Audit',
        'Security Assessment',
        'Scalability Planning',
        'Team Training'
      ],
      pricing: [
        { name: 'Audit', price: '$999', features: ['Code Review', 'Written Report', '30min Call'] },
        { name: 'Advisory', price: '$2,999', features: ['Weekly Calls', 'Slack Access', 'Documentation'] },
        { name: 'Fractional CTO', price: '$4,999/mo', features: ['Unlimited Access', 'Team Leadership', 'Strategic Planning'] },
      ]
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="services-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
            Services
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black mb-6">
            Professional Development{' '}
            <span className="text-cyan-500">Services</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From custom development to mentorship, I offer a range of services 
            to help you achieve your goals.
          </p>
        </motion.div>

        {/* Services */}
        <div className="space-y-24">
          {services.map((service, serviceIndex) => (
            <motion.section
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: serviceIndex * 0.1 }}
            >
              {/* Service Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 shadow-md">
                  <service.icon className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-2">{service.title}</h2>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.pricing.map((tier, tierIndex) => (
                  <Card 
                    key={tier.name}
                    className={`relative overflow-hidden bg-white dark:bg-card hover:shadow-xl transition-all duration-300 ${
                      tierIndex === 1 ? 'border-cyan-500 shadow-lg shadow-cyan-500/10' : 'hover:border-cyan-500/50'
                    }`}
                  >
                    {tierIndex === 1 && (
                      <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <div className="text-3xl font-black">{tier.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact">
                        <Button 
                          className={`w-full rounded-full transition-all duration-300 ${
                            tierIndex === 1 
                              ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md hover:shadow-lg hover:shadow-cyan-500/25' 
                              : 'hover:shadow-md'
                          }`}
                          variant={tierIndex === 1 ? 'default' : 'outline'}
                        >
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-zinc-100 dark:bg-muted/30 border-none shadow-lg">
            <CardContent className="py-12">
              <Zap className="w-12 h-12 text-cyan-600 dark:text-cyan-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-4">Need Something Custom?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Don't see what you're looking for? Let's discuss your specific 
                requirements and create a tailored solution.
              </p>
              <Link to="/contact">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8" data-testid="custom-quote-btn">
                  Request Custom Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
