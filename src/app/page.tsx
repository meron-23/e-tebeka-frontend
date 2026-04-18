"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import ServiceCategories from "@/components/ServiceCategories";
import { motion } from "framer-motion";
import { useSession } from "@/components/SessionProvider";
import { getDashboardPath } from "@/lib/session";
import { CheckCircle2, Users, ShieldCheck, Star } from "lucide-react";

const features = [
  {
    title: "Comprehensive Database",
    description: "Access to all Ethiopian federal laws, proclamations, and regulations in one centralized platform.",
    icon: <ShieldCheck className="h-6 w-6" />
  },
  {
    title: "Advanced Search",
    description: "Powerful search functionality with filters, keywords, and smart recommendations to find exactly what you need.",
    icon: <Star className="h-6 w-6" />
  },
  {
    title: "User-Friendly Interface",
    description: "Modern, intuitive design optimized for both desktop and mobile devices for seamless access.",
    icon: <Users className="h-6 w-6" />
  }
];

const tiers = [
  {
    name: "General Public",
    tier: "C",
    price: "Free",
    icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />,
    description: "Basic access for citizens and casual users.",
    features: [
      "Basic keyword search",
      "5 searches per day",
      "10 article views per day",
      "Public document access"
    ],
    cta: "Browse Public",
    href: "/search",
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "group-hover:border-emerald-500/50"
  },
  {
    name: "Students",
    tier: "B",
    price: "Free",
    status: "Requires Verification",
    icon: <Users className="h-8 w-8 text-blue-400" />,
    description: "Tailored research tools for law students and researchers.",
    features: [
      "Advanced research mode",
      "100 searches per day",
      "100 article views per day",
      "Personal study notes",
      "Bookmark up to 100 items"
    ],
    cta: "Apply for Access",
    href: "/register?tier=B",
    featured: true,
    color: "from-teal-500/20 to-emerald-500/20",
    borderColor: "group-hover:border-teal-500/50"
  },
  {
    name: "Lawyers",
    tier: "A",
    price: "Subscription",
    icon: <Star className="h-8 w-8 text-amber-400" />,
    description: "Complete legal suite for professional practice.",
    features: [
      "Unlimited searches & views",
      "Full PDF downloads",
      "Unlimited practice notes",
      "MFA security",
      "Early access to new laws"
    ],
    cta: "Get Full Access",
    href: "/register?tier=A",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "group-hover:border-amber-500/50"
  }
];

export default function LandingPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDashboardPath(user));
    }
  }, [isLoading, router, user]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Service Categories */}
      <ServiceCategories />
      
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
              Why Choose E-Tebeka?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              The most comprehensive and user-friendly platform for Ethiopian legal research
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg text-teal-600 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              Choose Your Access Level
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Tailored access levels for different user needs
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  tier.featured 
                    ? "border-teal-500 shadow-xl" 
                    : "border-gray-200"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tier.color}`}>
                      {tier.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-teal-600">{tier.price}</div>
                  {tier.status && <p className="text-sm text-gray-500 mt-1">{tier.status}</p>}
                </div>
                
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={tier.href}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-all outline-none focus:border-teal-500 ${
                    tier.featured
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">E-Tebeka</span>
              </div>
              <p className="text-gray-400">
                Ethiopia&apos;s premier digital law library, providing comprehensive access to legal documents and resources.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search" className="hover:text-white transition-colors">Search Documents</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">Search Guide</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Legal Disclaimer</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@e-tebeka.gov.et</li>
                <li>Addis Ababa, Ethiopia</li>
                <li>+251 11 123 4567</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 E-Tebeka Platform. All rights reserved. | Federal Supreme Court of Ethiopia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
