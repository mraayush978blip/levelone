import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Scale, RefreshCw, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | LevelOne',
  description: 'Terms and Conditions for LevelOne Web Development Engineering Cohort.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#05060b] text-zinc-200 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="border-b border-zinc-800 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-blue-500 text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" /> Legal & Governance
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Terms and Conditions</h1>
          <p className="text-zinc-400 text-sm">Last updated: September 13, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              1. Introduction & Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong>LevelOne</strong> (https://levelonedev.tech). By registering, accessing, or purchasing access to our web development cohort, learning platform, assessment challenges, or associated services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
            </p>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              2. Educational Cohort & Program Access
            </h2>
            <p>
              LevelOne provides structured, phase-based engineering curriculum and coding challenges. Upon payment of the cohort fee (₹149 or applicable rate), students receive individual, non-transferable access to phase curriculum, interactive browser sandboxes, and verification systems.
            </p>
            <p>
              Account sharing, credential distribution, or unauthorized screen recording of proprietary curriculum is strictly prohibited and will lead to immediate account termination without refund.
            </p>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              3. Performance Rewards & Guaranteed Internship Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><strong>Top 3 Performers:</strong> Will be awarded a guaranteed engineering internship upon verified completion and ranking in the final comprehensive assessment.</li>
              <li><strong>Top 10 Performers:</strong> Will receive an 80% refund of their registration fee based on leaderboard scores and code review integrity.</li>
              <li>Leaderboard ranking is determined through automated test suite benchmarks, code cleanliness, and plagiarism checks. Any malpractice or AI-generated cheating without understanding results in disqualification.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              4. Payment & Pricing
            </h2>
            <p>
              All prices are listed in Indian Rupees (INR). Payments are securely processed through RBI-authorized payment aggregators (Cashfree / Razorpay). LevelOne does not store your credit/debit card numbers or bank credentials.
            </p>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              5. Contact Us
            </h2>
            <p>If you have any questions or concerns regarding our terms, feel free to reach out:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone className="w-4 h-4 text-blue-400" /> +91 6266439162
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-blue-400" /> aayush@levelonedev.tech
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
