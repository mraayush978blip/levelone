import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | LevelOne',
  description: 'Privacy Policy for LevelOne Web Development Engineering Cohort.',
};

export default function PrivacyPage() {
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
            <Shield className="w-4 h-4" /> Data Protection
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-400 text-sm">Last updated: September 13, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>When you register for LevelOne, we collect essential information required to deliver the educational services:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li><strong>Contact Details:</strong> Full Name, Email Address, and Phone Number.</li>
              <li><strong>Academic / Progress Data:</strong> Challenge submissions, test benchmark results, and leaderboard standing.</li>
              <li><strong>Technical Information:</strong> IP address, device type, browser information for session security and fraud prevention.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">2. Payment Security</h2>
            <p>
              We process payments exclusively through RBI-compliant payment aggregators (Cashfree / Razorpay). LevelOne does not collect, view, or store your debit/credit card CVV, PIN, net banking credentials, or UPI MPIN. All financial transactions occur within 256-bit encrypted banking channels.
            </p>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li>To provide access to the student dashboard, assignments, and automated compilers.</li>
              <li>To dispatch important cohort updates via email and Web Push notifications.</li>
              <li>To evaluate final performance rankings for the <strong>Guaranteed Internship</strong> and <strong>80% refund reward</strong>.</li>
              <li>We <strong>never sell, rent, or trade</strong> student personal data to third-party advertisers.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">4. Contact Data Protection Officer</h2>
            <p>For data inquiries or deletion requests:</p>
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
