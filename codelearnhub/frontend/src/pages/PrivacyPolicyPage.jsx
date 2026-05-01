import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Calendar } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const lastUpdated = "January 21, 2026";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, we collect your name, email address, and profile picture (if provided through OAuth). We also collect payment information when you make purchases, which is processed securely through our payment providers."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you interact with our platform, including pages visited, courses viewed, time spent on the platform, and your learning progress."
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the device you use to access our services, including IP address, browser type, operating system, and device identifiers."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to provide and improve our services, process transactions, track your learning progress, and personalize your experience."
        },
        {
          subtitle: "Communication",
          text: "We may send you service-related emails, such as account verification, purchase confirmations, course updates, and security alerts. You can opt out of promotional emails at any time."
        },
        {
          subtitle: "Analytics",
          text: "We analyze usage patterns to improve our platform, develop new features, and ensure the security of our services."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Third-Party Services",
          text: "We share information with service providers who help us operate our platform, including payment processors, cloud hosting providers, and analytics services. These providers are bound by confidentiality agreements."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information."
        },
        {
          subtitle: "Password Security",
          text: "Your passwords are hashed using bcrypt and are never stored in plain text. We recommend using strong, unique passwords for your account."
        },
        {
          subtitle: "Data Retention",
          text: "We retain your personal information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time."
        }
      ]
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Portability",
          text: "You have the right to access your personal data and request a copy of the information we hold about you in a portable format."
        },
        {
          subtitle: "Correction and Deletion",
          text: "You can update your account information at any time through your profile settings. You can also request that we delete your account and associated data."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of promotional communications, disable certain cookies, and adjust your privacy settings in your account dashboard."
        }
      ]
    }
  ];

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
              <Shield className="w-4 h-4" />
              Your Privacy Matters
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Privacy <span className="text-cyan-500">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              At CodeLearnHub, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-cyan-500" />
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <div className="space-y-6">
                  {section.content.map((item, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-lg mb-2">{item.subtitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 text-center"
          >
            <Mail className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
