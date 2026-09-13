'use client';

import { useAuth } from '@/contexts/AuthContext';
import NeonLoader from '@/components/NeonLoader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Terminal, 
  Rocket, 
  Users, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import CyberMatrixBackground from '@/components/CyberMatrixBackground';
import InteractiveIDEPreview from '@/components/InteractiveIDEPreview';
import LinkedInShowcase from '@/components/LinkedInShowcase';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading && user) {
      if (user.role === 'admin') router.replace('/admin');
      else router.replace('/student');
    }
  }, [user, loading, isMounted, router]);

  // If user is logged in, show loader while redirecting
  if (isMounted && user) {
    return <NeonLoader />;
  }
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden bg-[#050507] text-white selection:bg-blue-500/40 selection:text-white">
        {/* Dynamic Canvas Background */}
        <CyberMatrixBackground />

        {/* Top Navigation Bar */}
        <header className="w-full z-40 sticky top-0 backdrop-blur-xl border-b border-zinc-800/80 bg-[#050507]/80">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Level<span className="text-blue-400">One</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/team"
                className="hidden sm:inline-block text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Meet Our Team
              </Link>
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all active:scale-95"
              >
                Enroll Now (₹149)
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-20 z-10 relative flex flex-col items-center text-center">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
            <span>Interactive Web Development Learning</span>
          </motion.div>

          {/* Simple, clear heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl"
          >
            Learn Full Stack Web Development by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Writing Real Code
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-2xl text-zinc-300 text-base md:text-lg leading-relaxed"
          >
            Practice with hands-on coding tasks, clear roadmaps, and timed tests. Build projects you can proudly share with the world.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex h-13 items-center justify-center px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all active:scale-95"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Enroll Today (₹149)
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex h-13 items-center justify-center px-7 rounded-full border border-zinc-800 bg-[#0e1217] text-zinc-200 font-semibold text-sm hover:border-zinc-700 hover:text-white transition-all"
            >
              Student Login
            </Link>

            <Link
              href="/team"
              className="w-full sm:w-auto inline-flex h-13 items-center justify-center px-7 rounded-full border border-zinc-800 bg-[#0e1217] text-zinc-300 font-semibold text-sm hover:border-zinc-700 hover:text-white transition-all"
            >
              <Users className="w-4 h-4 mr-2 text-zinc-400" />
              Meet Our Team
            </Link>
          </motion.div>

          {/* Real Metrics Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            <div className="p-4 rounded-xl bg-[#0e1217]/90 border border-zinc-800/80">
              <div className="text-2xl font-bold text-blue-400">100+</div>
              <div className="text-xs text-zinc-400 mt-1">Students Learning</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e1217]/90 border border-amber-500/30 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
              <div className="text-xl font-extrabold text-amber-400">Top 3</div>
              <div className="text-xs text-zinc-300 mt-1 font-medium leading-tight">
                Performers in final test get <span className="text-amber-300 font-bold">guaranteed internship</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e1217]/90 border border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
              <div className="text-xl font-extrabold text-emerald-400">Top 10</div>
              <div className="text-xs text-zinc-300 mt-1 font-medium leading-tight">
                Performers in final test get <span className="text-emerald-300 font-bold">80% fee refund</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0e1217]/90 border border-zinc-800/80">
              <div className="text-2xl font-bold text-cyan-400">₹149</div>
              <div className="text-xs text-zinc-400 mt-1">One-Time Fee</div>
            </div>
          </motion.div>

          {/* INTERACTIVE CODE PLAYGROUND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <InteractiveIDEPreview />
          </motion.div>
        </div>

        {/* MAJOR HIGHLIGHT: LINKEDIN STUDENT SHOWCASE */}
        <LinkedInShowcase />

        {/* HOW LEVELONE WORKS (Simple English, Clear Value) */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              How You Learn With LevelOne
            </h2>
            <p className="mt-3 text-zinc-400 text-sm md:text-base leading-relaxed">
              Step-by-step learning designed to make you confident in building websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-zinc-800/90 bg-[#0e1217]/90">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Learn Step by Step</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Watch clear video lessons and follow structured guidelines for HTML, CSS, JavaScript, and React.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-zinc-800/90 bg-[#0e1217]/90">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Submit Assignments on Time</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Finish Phase 1 to unlock Phase 2. Once in Phase 2, you have 20 days from your enrollment to complete your tasks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-zinc-800/90 bg-[#0e1217]/90">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-bold text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Share & Grow on LinkedIn</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Post your milestones on LinkedIn, build your professional network, and get recognized for your achievements.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM FINAL CALL TO ACTION */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 my-16 z-10 relative">
          <div className="rounded-2xl border border-zinc-800 bg-[#0e1217] p-8 md:p-12 text-center relative shadow-xl">
            <div className="max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to Start Learning?
              </h2>

              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Join over 100+ students already building real projects and posting their progress on LinkedIn.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Enroll Now (₹149)
                </Link>
                <Link
                  href="/team"
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center px-6 rounded-full border border-zinc-700 bg-transparent text-zinc-300 font-semibold text-sm hover:border-zinc-500 hover:text-white transition-all"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Meet Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t border-zinc-800/80 bg-[#030305] py-8 text-center text-xs text-zinc-500 z-10 relative">
          <p>© 2026 LevelOne Web Development. All rights reserved.</p>
        </footer>
      </main>
    );
}
