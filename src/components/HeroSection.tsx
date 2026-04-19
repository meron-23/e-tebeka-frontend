"use client";

import { motion } from "framer-motion";
import { Scale, CheckCircle, Users, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section 
      className="relative bg-gradient-to-br from-teal-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden"
      style={{
        backgroundImage: `url("/images/landingImage.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Lighter overlay for better image visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-teal-800/30 to-blue-900/40"></div>
      
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Content - Side by Side */}
          <div className="text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30"
            >
              <Scale className="h-4 w-4 mr-2" />
              Federal Supreme Court Digital Library
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Access Ethiopian Law
              <span className="block text-teal-200">Digitally</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mb-8"
            >
              Complete repository of Ethiopian proclamations, regulations, and legal documents. 
              Search, access, and download official legal resources instantly.
            </motion.p>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">Official government documents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">Free access for citizens</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">Secure & verified content</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Empty Space for Image Visibility */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
}
