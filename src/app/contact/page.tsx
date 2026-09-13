import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Clock, MessageSquare, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | LevelOne',
  description: 'Get in touch with LevelOne Web Development Engineering Cohort support.',
};

export default function ContactPage() {
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
            <MessageSquare className="w-4 h-4" /> Support & Communications
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Contact Us</h1>
          <p className="text-zinc-400 text-sm">
            Have questions about the cohort, curriculum, payment, or partnerships? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct Phone & WhatsApp</h3>
            <p className="text-xs text-zinc-400">Available Monday to Saturday, 9:00 AM – 7:00 PM IST</p>
            <p className="text-blue-400 font-mono font-bold text-base pt-1">+91 6266439162</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Official Support Emails</h3>
            <p className="text-xs text-zinc-400">Response time: Usually within 2 to 4 business hours</p>
            <div className="space-y-1 pt-1 font-mono text-sm font-bold">
              <p><a href="mailto:aayush@levelonedev.tech" className="text-blue-400 hover:underline">aayush@levelonedev.tech</a></p>
              <p><a href="mailto:aditya@levelonedev.tech" className="text-cyan-400 hover:underline">aditya@levelonedev.tech</a></p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" /> Operational Address & Entity Information
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong>Operating Name:</strong> LevelOne Engineering Cohort<br />
            <strong>Founder & Lead:</strong> Aayush Sharma<br />
            <strong>Contact Phone:</strong> +91 6266439162<br />
            <strong>Official Domain:</strong> https://levelonedev.tech<br />
            <strong>Jurisdiction:</strong> Madhya Pradesh, India
          </p>
        </div>
      </div>
    </div>
  );
}
