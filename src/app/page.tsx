"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Gavel, GraduationCap, ShieldCheck, ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

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
    icon: <GraduationCap className="h-8 w-8 text-blue-400" />,
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
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    name: "Lawyers",
    tier: "A",
    price: "Subscription",
    icon: <Gavel className="h-8 w-8 text-amber-400" />,
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
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 sm:mt-32 lg:mt-16"
          >
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              Ethiopia's Digital Law Library
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-10 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl font-outfit line-height-tight"
          >
            Empowering Justice via <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Digital Access</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-600"
          >
            Access the complete repository of Ethiopian proclamations and regulations. Whether you're a citizen, student, or legal professional, E-Tebeka provides the tools you need.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center gap-x-6"
          >
            <Link
              href="/search"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Browse Public Documents
            </Link>
            <Link href="/register" className="text-sm font-semibold leading-6 text-slate-900 flex items-center gap-1 group">
              Start Free Trial <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Tiers Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 lowercase tracking-wider">Tailored Access</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Choose Your Tier</p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group relative flex flex-col justify-between rounded-3xl p-8 ring-1 ring-slate-200 transition-all hover:ring-slate-300 xl:p-10 bg-white",
                tier.featured ? "shadow-2xl ring-2 ring-indigo-600/20" : "shadow-sm"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-slate-900">{tier.name}</h3>
                  {tier.featured && (
                    <p className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600 ring-1 ring-inset ring-indigo-200">
                      Most Popular
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className={cn("rounded-2xl bg-gradient-to-br p-3", tier.color)}>
                    {tier.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{tier.price}</p>
                    {tier.status && <p className="text-xs text-slate-500">{tier.status}</p>}
                  </div>
                </div>
                <p className="mt-6 text-sm leading-6 text-slate-600">{tier.description}</p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={tier.href}
                className={cn(
                  "mt-8 block rounded-xl px-3 py-2 text-center text-sm font-semibold leading-6 transition-all active:scale-95",
                  tier.featured 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" 
                    : "bg-slate-50 text-slate-900 hover:bg-slate-100 ring-1 ring-inset ring-slate-200"
                )}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold text-slate-900">E-Tebeka</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Legal Disclaimer</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-slate-400">© 2026 E-Tebeka Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
