import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { 
  Code2, GraduationCap, Award, Globe, 
  Briefcase, Heart, Zap
} from 'lucide-react';

const AboutPage = () => {
  const skills = [
    { name: 'React & Next.js', level: 95 },
    { name: 'Node.js & Python', level: 90 },
    { name: 'TypeScript', level: 88 },
    { name: 'Cloud & DevOps', level: 85 },
    { name: 'System Design', level: 82 },
    { name: 'UI/UX Design', level: 78 },
  ];

  const achievements = [
    { icon: Code2, value: '500+', label: 'Projects Delivered' },
    { icon: GraduationCap, value: '10K+', label: 'Students Taught' },
    { icon: Award, value: '50+', label: 'Certifications' },
    { icon: Globe, value: '30+', label: 'Countries Reached' },
  ];

  const certifications = [
    'AWS Solutions Architect Professional',
    'Google Cloud Professional Developer',
    'MongoDB Certified Developer',
    'React Advanced Patterns Certified',
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-500/20 rounded-2xl blur-xl" />
              <img
                src="https://images.pexels.com/photos/5257575/pexels-photo-5257575.jpeg"
                alt="Developer workspace"
                className="relative rounded-2xl w-full object-cover aspect-square"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4 w-fit">
              About Me
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              Passionate About Building{' '}
              <span className="text-cyan-500">Digital Excellence</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              With over a decade of experience in software development, I've dedicated my career 
              to creating exceptional digital experiences and helping others learn the craft.
            </p>
            <p className="text-muted-foreground mb-8">
              From startups to Fortune 500 companies, I've worked across diverse industries 
              and technologies. My mission is to share this knowledge through premium code 
              projects, comprehensive courses, and meaningful developer connections.
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((item) => (
                <div key={item.label} className="text-center p-4 rounded-lg bg-zinc-100 dark:bg-muted/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <item.icon className="w-6 h-6 text-cyan-600 dark:text-cyan-500 mx-auto mb-2" />
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.section 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
              Skills & Expertise
            </Badge>
            <h2 className="text-3xl font-black">Technical Proficiency</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section 
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 mb-4">
              Certifications
            </Badge>
            <h2 className="text-3xl font-black">Professional Credentials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 bg-white dark:bg-card">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-500" />
                    </div>
                    <span className="font-medium text-sm">{cert}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-zinc-100 dark:bg-muted/30 border-none shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 shadow-md">
                    <Briefcase className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Mission</h3>
                  <p className="text-muted-foreground text-sm">
                    Democratize quality software education and make premium development 
                    resources accessible to everyone.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 shadow-md">
                    <Heart className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Values</h3>
                  <p className="text-muted-foreground text-sm">
                    Quality over quantity. Every project and course is crafted with attention 
                    to detail and real-world applicability.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 shadow-md">
                    <Zap className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Vision</h3>
                  <p className="text-muted-foreground text-sm">
                    Build a global community of empowered developers who create 
                    impactful solutions and support each other's growth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
