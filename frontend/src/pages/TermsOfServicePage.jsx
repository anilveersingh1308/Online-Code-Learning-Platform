import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, Calendar } from 'lucide-react';

const TermsOfServicePage = () => {
  const lastUpdated = "January 21, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using CodeLearnHub ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including visitors, registered users, and paying customers.`
    },
    {
      title: "2. Account Registration",
      content: `To access certain features of the Platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 13 years old to create an account, and users under 18 must have parental consent.`
    },
    {
      title: "3. User Conduct",
      content: `You agree not to: (a) violate any applicable laws or regulations; (b) infringe upon the intellectual property rights of others; (c) share your account credentials with others; (d) attempt to gain unauthorized access to other accounts or systems; (e) use the Platform for any fraudulent or malicious purpose; (f) distribute malware or harmful code; (g) harass, abuse, or harm other users; (h) resell or redistribute purchased content without authorization.`
    },
    {
      title: "4. Intellectual Property",
      content: `All content on the Platform, including courses, projects, code samples, text, graphics, logos, and software, is the property of CodeLearnHub or its content creators and is protected by copyright, trademark, and other intellectual property laws. Purchased content grants you a personal, non-transferable license to use the content for your own learning and development purposes. You may not redistribute, resell, or share purchased content without explicit written permission.`
    },
    {
      title: "5. Purchases and Payments",
      content: `When you purchase courses or projects, you agree to pay all applicable fees. All prices are displayed in USD unless otherwise stated. We use secure third-party payment processors to handle transactions. Refunds may be available within 30 days of purchase if you have not completed more than 30% of a course. Digital downloads (projects) are non-refundable once downloaded. We reserve the right to change prices at any time, but changes will not affect existing purchases.`
    },
    {
      title: "6. Content Access",
      content: `Upon purchase, you receive lifetime access to the content as long as it remains on our platform. We reserve the right to update, modify, or remove content at any time. If we remove content you have purchased, we will provide reasonable notice and, where possible, alternative access or compensation. Access to content requires an internet connection and a compatible device.`
    },
    {
      title: "7. User-Generated Content",
      content: `If you submit reviews, comments, or other content, you grant CodeLearnHub a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content. You represent that you have the right to submit such content and that it does not violate any third-party rights. We may remove user-generated content that violates these terms or our community guidelines.`
    },
    {
      title: "8. Disclaimer of Warranties",
      content: `The Platform and all content are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Platform will be error-free, uninterrupted, or secure. We do not guarantee specific learning outcomes, career advancement, or any particular results from using our content. Your use of the Platform is at your own risk.`
    },
    {
      title: "9. Limitation of Liability",
      content: `To the maximum extent permitted by law, CodeLearnHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Platform. Our total liability for any claims arising from these terms shall not exceed the amount you paid to us in the 12 months preceding the claim.`
    },
    {
      title: "10. Termination",
      content: `We may suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. Upon termination, your right to access purchased content may be revoked. You may delete your account at any time through your account settings. Sections of these terms that by their nature should survive termination will remain in effect.`
    },
    {
      title: "11. Changes to Terms",
      content: `We may update these Terms of Service from time to time. We will notify you of material changes by email or through a notice on the Platform. Your continued use of the Platform after changes become effective constitutes acceptance of the new terms. If you do not agree to the updated terms, you must stop using the Platform.`
    },
    {
      title: "12. Governing Law",
      content: `These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which CodeLearnHub operates, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved through binding arbitration or in the courts of the applicable jurisdiction.`
    }
  ];

  const highlights = [
    { icon: CheckCircle, text: "Lifetime access to purchased content", color: "text-green-500" },
    { icon: CheckCircle, text: "30-day refund policy for courses", color: "text-green-500" },
    { icon: CheckCircle, text: "Personal use license included", color: "text-green-500" },
    { icon: XCircle, text: "No redistribution of content", color: "text-red-500" },
    { icon: XCircle, text: "No account sharing", color: "text-red-500" },
    { icon: AlertTriangle, text: "Digital downloads are non-refundable", color: "text-amber-500" },
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
              <Scale className="w-4 h-4" />
              Legal Agreement
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Terms of <span className="text-cyan-500">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Please read these terms carefully before using CodeLearnHub. By using our platform, you agree to these terms.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border"
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-cyan-500">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
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
            <FileText className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms of Service, please don't hesitate to contact us.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-colors"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
