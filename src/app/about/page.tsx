"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, BookOpen, Scale } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              About E-Tebeka
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Ethiopia's premier digital law library, providing comprehensive access to legal documents and resources for citizens, students, and legal professionals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                E-Tebeka is committed to democratizing access to Ethiopian legal information. 
                We bridge the gap between complex legal documents and the people who need them, 
                making justice more accessible through technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Official & Verified</h3>
                    <p className="text-gray-600 text-sm">All documents sourced directly from Federal Supreme Court and official government publications</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">User-Friendly</h3>
                    <p className="text-gray-600 text-sm">Modern interface designed for easy navigation and quick document discovery</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive</h3>
                    <p className="text-gray-600 text-sm">Complete repository covering all types of Ethiopian legal documents</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <Scale className="h-12 w-12 text-teal-600 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    Federal Supreme Court Partnership
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Officially partnered with the Federal Supreme Court of Ethiopia to ensure 
                    authenticity and accuracy of all legal documents.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-teal-600">10,000+</div>
                      <div className="text-sm text-gray-600">Documents</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-teal-600">5,000+</div>
                      <div className="text-sm text-gray-600">Daily Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Platform Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Powerful tools and features designed for Ethiopian legal research
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Search",
                description: "Smart search with filters, keywords, and AI-powered recommendations",
                icon: "🔍"
              },
              {
                title: "Document Downloads",
                description: "Download official PDFs with full legal validity",
                icon: "📄"
              },
              {
                title: "Multi-Tier Access",
                description: "Tailored access levels for different user needs",
                icon: "👥"
              },
              {
                title: "Mobile Friendly",
                description: "Access legal documents on any device, anywhere",
                icon: "📱"
              },
              {
                title: "Regular Updates",
                description: "Latest laws and regulations updated in real-time",
                icon: "🔄"
              },
              {
                title: "Secure Platform",
                description: "Enterprise-grade security for all user data",
                icon: "🔒"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Ethiopians accessing legal documents through E-Tebeka
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Register Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/search"
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 transition-colors font-medium"
              >
                Browse Documents
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
