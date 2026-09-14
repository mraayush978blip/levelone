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
  ChevronRight,
  Phone,
  Mail,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import CyberMatrixBackground from '@/components/CyberMatrixBackground';
import InteractiveIDEPreview from '@/components/InteractiveIDEPreview';
import LinkedInShowcase from '@/components/LinkedInShowcase';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Dynamic pricing state managed by Admin (/admin/pricing)
  const [pricing, setPricing] = useState({
    original_price: 250,
    offer_price: 149,
    discount_label: 'Launch Offer (One-Time)',
  });

  useEffect(() => {
    setIsMounted(true);

    fetch('/api/admin/pricing')
      .then((r) => r.json())
      .then((data) => {
        if (data && (data.offer_price || data.total_amount)) {
          setPricing({
            original_price: Number(data.original_price) || 250,
            offer_price: Number(data.offer_price) || 149,
            discount_label: data.discount_label || 'Launch Offer (One-Time)',
          });
        }
      })
      .catch((err) => console.warn('[HomePage] Pricing fetch fallback:', err));
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
          <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-8 xl:px-12 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/icon-ninja-round.webp"
                alt="LevelOne Logo"
                className="w-9 h-9 rounded-full object-cover shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-500/30 group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-lg tracking-tight text-white">
                Level<span className="text-blue-400">One</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/referral"
                className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Refer & Earn</span>
                <span className="xs:hidden">Refer</span>
              </Link>
              <Link
                href="/team"
                className="hidden md:inline-block text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Meet Our Team
              </Link>
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-300 hover:text-white px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all active:scale-95"
              >
                <span>Enroll</span>
                <span className="hidden sm:inline">Now (₹{pricing.offer_price})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 pt-16 md:pt-20 z-10 relative flex flex-col items-center text-center">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400 font-medium mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
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
            Practice with handpicked, industry-curated curriculum, structured roadmaps, and timed phases. Compete with peers, build production apps, and unlock guaranteed internships.
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
              Enroll Today (₹{pricing.offer_price})
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

            <Link
              href="/referral"
              className="w-full sm:w-auto inline-flex h-13 items-center justify-center px-6 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold text-sm hover:bg-amber-500/20 hover:border-amber-500/50 transition-all"
            >
              <Gift className="w-4 h-4 mr-2 text-amber-400" />
              Refer & Earn
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
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm text-zinc-500 line-through font-semibold">₹{pricing.original_price}</span>
                <span className="text-2xl font-bold text-cyan-400">₹{pricing.offer_price}</span>
              </div>
              <div className="text-xs text-emerald-400 mt-1 font-semibold">{pricing.discount_label}</div>
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
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-20 z-10 relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              How You Learn With LevelOne
            </h2>
            <p className="mt-3 text-zinc-400 text-sm md:text-base leading-relaxed">
              We structure the best open resources into an intense competitive arena so you finish with proof of work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-zinc-800/90 bg-[#0e1217]/90">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curated Industry Material</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Rather than reinventing basic lectures, we curate top-tier resources, filter the noise, and structure them into timed progressive phases.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-zinc-800/90 bg-[#0e1217]/90">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Timed Pacing & Competition</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Submit assignments on time to unlock the next phase. Compete on the live leaderboard with streaks, points, and milestones.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-zinc-800/90 bg-[#0e1217]/90">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-bold text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Guaranteed Internships</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                Top 3 performers in the final testing benchmark earn guaranteed internships, and Top 10 secure an 80% fee refund.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM FINAL CALL TO ACTION */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 my-16 z-10 relative">
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
                  Enroll Now (₹{pricing.offer_price})
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
        <footer className="w-full border-t border-zinc-800/80 bg-[#030305] py-12 px-4 sm:px-8 xl:px-12 text-xs text-zinc-500 z-10 relative">
          <div className="max-w-[1920px] w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
            {/* Brand Col */}
            <div className="space-y-3 md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <img
                  src="/icon-ninja-round.webp"
                  alt="LevelOne Logo"
                  className="w-7 h-7 rounded-full object-cover shadow-[0_0_12px_rgba(59,130,246,0.3)] border border-blue-500/30 group-hover:scale-105 transition-transform"
                />
                <span className="font-mono text-sm font-black text-white tracking-widest uppercase">
                  LevelOne
                </span>
              </Link>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                Phase-based full-stack web development engineering cohort. Curated high-impact learning path, competitive benchmarks, and guaranteed internships for top 3 rankers.
              </p>
              <div className="pt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono text-zinc-400">
                <a href="tel:+916266439162" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> +91 6266439162
                </a>
                <a href="mailto:aayush@levelonedev.tech" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> aayush@levelonedev.tech
                </a>
                <a href="mailto:aditya@levelonedev.tech" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> aditya@levelonedev.tech
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Platform</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><Link href="/signup" className="hover:text-blue-400 transition-colors">Enroll (₹{pricing.offer_price})</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Student Login</Link></li>
                <li><Link href="/referral" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-amber-400" /> Refer & Earn</Link></li>
                <li><Link href="/team" className="hover:text-blue-400 transition-colors">Meet Our Team</Link></li>
                <li><Link href="/install" className="hover:text-blue-400 transition-colors">Install App</Link></li>
              </ul>
            </div>

            {/* Legal & Compliance Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Legal & Policies</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-blue-400 transition-colors">Refund & Cancellation</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1920px] w-full mx-auto pt-6 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© 2026 LevelOne Web Development Cohort. All rights reserved.</p>
            <p className="text-[11px] text-zinc-600">Secure Payments via Cashfree Payments & Razorpay</p>
          </div>
        </footer>
      </main>
    );
}
