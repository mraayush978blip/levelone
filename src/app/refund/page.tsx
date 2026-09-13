import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | LevelOne',
  description: 'Refund, Return, and Cancellation Policy for LevelOne Web Development Engineering Cohort.',
};

export default function RefundPage() {
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
            <RefreshCw className="w-4 h-4" /> Financial Integrity
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-zinc-400 text-sm">Last updated: September 13, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          {/* Highlighted Banner */}
          <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-blue-900/30 border border-blue-500/30 rounded-2xl p-6 space-y-2">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Merit-Based 80% Performance Refund
            </div>
            <p className="text-xs text-zinc-300">
              LevelOne rewards dedication and top performance. The <strong>Top 10 performers</strong> in our final cohort assessment test receive an <strong>automatic 80% refund</strong> of their registration fee.
            </p>
          </div>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">1. Cancellation by Student</h2>
            <p>
              Since LevelOne provides immediate access to proprietary phase curriculum, sandbox environments, and engineering code repositories upon enrollment:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li><strong>Pre-Cohort Launch:</strong> If a student requests a cancellation at least 48 hours before the cohort start date, a 100% full refund will be processed.</li>
              <li><strong>Post-Curriculum Access:</strong> Once access to the cohort assignments and server sandboxes has been provisioned, standard cancellation requests are non-refundable except under special medical or technical circumstances.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">2. Double Payment / Duplicate Charges</h2>
            <p>
              In the event of a technical glitch where a student is charged multiple times for the same cohort registration, the duplicate transaction will be refunded automatically within <strong>5 to 7 working days</strong> to the original payment method (Bank Account / UPI / Card).
            </p>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">3. Refund Processing Timeline</h2>
            <p>
              All eligible refunds are initiated within <strong>24 to 48 hours</strong> of verification. Depending on your issuing bank and payment aggregator (Cashfree/Razorpay), funds typically credit to your account within <strong>5 to 7 business days</strong>.
            </p>
          </section>

          <section className="space-y-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">4. How to Request a Refund</h2>
            <p>
              To request a refund or raise a billing dispute, contact our support team with your Registered Email, Order ID, and Payment Screenshot:
            </p>
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
