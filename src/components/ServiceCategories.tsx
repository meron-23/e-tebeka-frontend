"use client";

import { motion } from "framer-motion";
import { FileText, Scale, BookOpen, Gavel, Search, Download } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "Proclamations",
    description: "Federal and regional proclamations, laws, and legal acts",
    icon: <FileText className="h-8 w-8" />,
    color: "from-blue-500 to-blue-600",
    href: "/search?q=proclamation",
    count: "5,000+"
  },
  {
    title: "Regulations",
    description: "Administrative regulations and implementing directives",
    icon: <Scale className="h-8 w-8" />,
    color: "from-teal-500 to-teal-600",
    href: "/search?q=regulation",
    count: "3,000+"
  },
  {
    title: "Court Decisions",
    description: "Supreme Court and appellate court judgments",
    icon: <Gavel className="h-8 w-8" />,
    color: "from-purple-500 to-purple-600",
    href: "/search?q=court",
    count: "2,000+"
  },
  {
    title: "Legal Resources",
    description: "Legal forms, templates, and practice guides",
    icon: <BookOpen className="h-8 w-8" />,
    color: "from-orange-500 to-orange-600",
    href: "/search?q=resources",
    count: "1,000+"
  }
];

export default function ServiceCategories() {
  return (
    <section id="service-categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Explore Legal Resources
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Browse our comprehensive collection of Ethiopian legal documents and resources
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href} className="block group">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} text-white mb-4`}>
                    {category.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm">
                    {category.description}
                  </p>
                  
                  {/* Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{category.count}</span>
                    <div className="flex items-center text-teal-600 group-hover:text-teal-700">
                      <span className="text-sm font-medium">Explore</span>
                      <Search className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Advanced Access?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Register for a free account to unlock advanced search features, save documents, 
              and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Register Free
              </Link>
              <Link
                href="/search"
                className="px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
              >
                Browse as Guest
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
