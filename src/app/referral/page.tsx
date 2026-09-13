'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Gift, 
    ArrowLeft, 
    Sparkles, 
    Copy, 
    Check, 
    AlertTriangle, 
    Activity, 
    Users, 
    GraduationCap, 
    Mail, 
    Phone, 
    Calendar,
    ArrowRight,
    Search,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralPortalPage() {
    const [activeTab, setActiveTab] = useState<'create' | 'track'>('create');

    // Create State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [college, setCollege] = useState('');
    const [desiredCode, setDesiredCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [createdCode, setCreatedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Track State
    const [searchCode, setSearchCode] = useState('');
    const [tracking, setTracking] = useState(false);
    const [trackedData, setTrackedData] = useState<any | null>(null);

    const handleCreateCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone || !college || !desiredCode) {
            toast.error('Please fill in all fields.');
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/referral/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    college,
                    code: desiredCode,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate code.');

            setCreatedCode(data.code);
            toast.success(`Referral code ${data.code} generated successfully!`);
        } catch (err: any) {
            toast.error(err.message || 'Error generating referral code.');
        } finally {
            setCreating(false);
        }
    };

    const handleTrackActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCode.trim()) {
            toast.error('Please enter your referral code.');
            return;
        }

        setTracking(true);
        try {
            const res = await fetch('/api/referral/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: searchCode }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Referral code not found.');

            setTrackedData(data);
            toast.success(`Loaded activity for code: ${data.code}`);
        } catch (err: any) {
            toast.error(err.message || 'Could not find referral activity.');
            setTrackedData(null);
        } finally {
            setTracking(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="min-h-screen bg-[#05060b] text-zinc-200 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                {/* Header */}
                <div className="border-b border-zinc-800 pb-6 space-y-2">
                    <div className="flex items-center gap-2 text-blue-500 text-xs font-mono font-bold uppercase tracking-wider">
                        <Gift className="w-4 h-4" /> Student Ambassador & Referral Hub
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Referral Center
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Create your personalized student referral code, invite peers to join LevelOne, and monitor real-time conversions.
                    </p>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 p-1.5 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'create'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Sparkles className="w-4 h-4" /> Create Referral Code
                    </button>
                    <button
                        onClick={() => setActiveTab('track')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'track'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Activity className="w-4 h-4" /> Check Code Activity
                    </button>
                </div>

                {/* TAB 1: CREATE CODE */}
                {activeTab === 'create' && (
                    <div className="bg-[#090a12] border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                        {!createdCode ? (
                            <form onSubmit={handleCreateCode} className="space-y-5">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Generate Your Custom Code</h2>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Enter your student credentials to link your referral program.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                            Your Full Name
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full !pl-10 pr-4 py-3 bg-[#05060b] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="e.g. rahul@gmail.com"
                                                className="w-full !pl-10 pr-4 py-3 bg-[#05060b] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                            Phone / WhatsApp Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="10-digit mobile number"
                                                className="w-full !pl-10 pr-4 py-3 bg-[#05060b] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                            College / Institute Name
                                        </label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                required
                                                value={college}
                                                onChange={(e) => setCollege(e.target.value)}
                                                placeholder="e.g. IIT Delhi / VIT / RGPV"
                                                className="w-full !pl-10 pr-4 py-3 bg-[#05060b] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                        Choose Your Referral Code
                                    </label>
                                    <div className="relative">
                                        <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="text"
                                            required
                                            value={desiredCode}
                                            onChange={(e) => setDesiredCode(e.target.value.toUpperCase())}
                                            placeholder="e.g. RAHUL10 or LEVELVIP"
                                            className="w-full !pl-10 pr-4 py-3 bg-[#05060b] border border-zinc-800 rounded-xl text-sm text-white font-mono uppercase tracking-widest font-bold focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-1">
                                        Uppercase letters, numbers, and hyphens only (minimum 3 characters).
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {creating ? (
                                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" /> Create My Referral Code
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            /* SUCCESS SCREEN */
                            <div className="space-y-6 animate-fade-in text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-white">Your Referral Code is Ready!</h2>
                                    <p className="text-xs text-zinc-400 mt-1">Share this code with your classmates and peers.</p>
                                </div>

                                {/* The Code Box */}
                                <div className="p-6 bg-[#05060b] border border-blue-500/40 rounded-2xl max-w-md mx-auto space-y-3">
                                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                                        Your Unique Code
                                    </span>
                                    <div className="text-3xl md:text-4xl font-mono font-black text-blue-400 tracking-wider">
                                        {createdCode}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(createdCode)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-md"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied to Clipboard!' : 'Copy Referral Code'}
                                    </button>
                                </div>

                                {/* CRITICAL USER WARNING NOTE */}
                                <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl max-w-lg mx-auto text-left flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                    <div className="text-xs text-amber-200 leading-relaxed space-y-1">
                                        <p className="font-bold text-amber-300">Important Note:</p>
                                        <p>
                                            Please save this referral code securely with you. <strong>No one is responsible if you forget this code</strong>. You will need this exact code to check your referred students and activity.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <button
                                        onClick={() => {
                                            setSearchCode(createdCode);
                                            setActiveTab('track');
                                        }}
                                        className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
                                    >
                                        View Code Activity Tab →
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCreatedCode(null);
                                            setDesiredCode('');
                                        }}
                                        className="text-xs text-zinc-500 hover:text-zinc-400 underline"
                                    >
                                        Create Another Code
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: TRACK ACTIVITY */}
                {activeTab === 'track' && (
                    <div className="bg-[#090a12] border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                        <div>
                            <h2 className="text-xl font-bold text-white">Track Referral Activity</h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                Enter your referral code below to see how many enrolled students have registered using your code.
                            </p>
                        </div>

                        <form onSubmit={handleTrackActivity} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={searchCode}
                                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                                    placeholder="Enter your referral code (e.g. RAHUL10)"
                                    className="w-full !pl-10 pr-4 py-3 bg-[#05060b] border border-zinc-800 rounded-xl text-sm text-white font-mono uppercase tracking-wider font-bold focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={tracking}
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {tracking ? (
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : (
                                    'Check Activity'
                                )}
                            </button>
                        </form>

                        {/* RESULTS HUD */}
                        {trackedData && (
                            <div className="space-y-6 pt-4 border-t border-zinc-800/80 animate-fade-in">
                                {/* Overview Card */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-[#05060b] border border-zinc-800">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Referral Code</span>
                                        <p className="text-xl font-mono font-black text-blue-400 mt-1">{trackedData.code}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#05060b] border border-zinc-800">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Created By</span>
                                        <p className="text-base font-bold text-white mt-1 truncate">{trackedData.creatorName}</p>
                                        <p className="text-[11px] text-zinc-400 truncate">{trackedData.creatorCollege}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#05060b] border border-emerald-500/30">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Total Enrolled Students</span>
                                        <p className="text-2xl font-black text-emerald-400 mt-1">{trackedData.totalStudents}</p>
                                    </div>
                                </div>

                                {/* Activity List */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                                        <span>Referred Students History</span>
                                        <span className="text-[11px] font-normal text-zinc-500">Only verified paid signups</span>
                                    </h3>

                                    {trackedData.activity && trackedData.activity.length > 0 ? (
                                        <div className="border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/60 bg-[#05060b]">
                                            {trackedData.activity.map((student: any, idx: number) => (
                                                <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{student.name}</p>
                                                            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Enrolled & Verified
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right text-xs font-mono text-zinc-400">
                                                        <span className="flex items-center gap-1.5 justify-end">
                                                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                            {new Date(student.joinedAt).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500">
                                                            {new Date(student.joinedAt).toLocaleTimeString('en-IN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 border border-zinc-800/80 rounded-2xl bg-[#05060b] text-center space-y-2">
                                            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
                                            <p className="text-sm font-bold text-zinc-300">No students enrolled yet with this code</p>
                                            <p className="text-xs text-zinc-500">
                                                Share your code with friends. Once they pay and complete signup, they will show up here instantly!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
