'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import {
    CheckCircle2,
    Lock,
    Mail,
    User,
    Phone,
    Copy,
    Check,
    ArrowRight,
    Zap,
    AlertCircle,
    Gift
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

declare global {
    interface Window {
        Razorpay: any;
        Cashfree: any;
    }
}

export default function SignupPage() {
    const router = useRouter();
    const { signIn } = useAuth();

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Success state
    const [registeredUser, setRegisteredUser] = useState<{
        uid: string;
        email: string;
        password?: string;
        name: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const feeAmount = 149;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Credentials copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    const handleAutoLogin = async () => {
        if (!registeredUser || !registeredUser.password) {
            router.push('/login');
            return;
        }

        setLoggingIn(true);
        try {
            await signIn(registeredUser.email, registeredUser.password);
            window.location.href = '/student';
        } catch (err: any) {
            console.error('Auto-login error:', err);
            router.push('/login');
        }
    };

    const handleInitiatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in your name, email, and password.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Cashfree Order on Backend
            const orderRes = await fetch('/api/payments/cashfree/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: feeAmount,
                    email: email.trim(),
                    name: name.trim(),
                    phone: phone.trim(),
                }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || 'Failed to initialize payment');

            const { paymentSessionId, orderId, env } = orderData;

            if (!paymentSessionId) {
                throw new Error('Payment session could not be created. Please try again.');
            }

            // 2. Initialize Cashfree Web SDK
            if (!window.Cashfree) {
                throw new Error('Cashfree SDK is still loading. Please wait a moment and try again.');
            }

            const cashfree = window.Cashfree({
                mode: env === 'PROD' ? 'production' : 'sandbox',
            });

            // 3. Open Cashfree Dropin Modal / Checkout
            const checkoutOptions = {
                paymentSessionId: paymentSessionId,
                redirectTarget: '_modal', // In-page sleek popup modal
            };

            cashfree.checkout(checkoutOptions).then((result: any) => {
                if (result.error) {
                    console.error('Cashfree Checkout Error:', result.error);
                    setError(result.error.message || 'Payment was cancelled or failed.');
                    setLoading(false);
                    return;
                }

                if (result.paymentDetails) {
                    // Payment finished, proceed to verify on server
                    completeRegistration(orderId);
                }
            });
        } catch (err: any) {
            console.error('Payment initiation error:', err);
            setError(err.message || 'Payment initiation failed.');
            setLoading(false);
        }
    };

    const completeRegistration = async (orderId: string) => {
        try {
            const verifyRes = await fetch('/api/payments/cashfree/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                    phone: phone.trim(),
                    order_id: orderId,
                    referral_code: referralCode.trim() || undefined,
                }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Registration verification failed');

            setRegisteredUser({
                uid: verifyData.user.uid,
                email: verifyData.user.email,
                password: password,
                name: verifyData.user.name,
            });
            toast.success('Registration successful! Welcome to Levelone.');
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.message || 'Error creating student account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#050507] text-foreground overflow-hidden">
            <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />

            {/* Glowing background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-lg z-10">
                {/* Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-3">
                        <span className="text-2xl font-black text-white tracking-tighter">Levelone</span>
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md">
                            ENROLLMENT
                        </span>
                    </Link>
                    <p className="text-xs text-zinc-400 font-medium">Automated Student Onboarding & Access Portal</p>
                </div>

                {!registeredUser ? (
                    /* Step 1: Registration & Payment Form */
                    <div className="bg-[#090a0f]/90 border border-zinc-800 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Create Student Account</h1>
                            <p className="text-xs text-zinc-400 mt-1">Enter your details to enroll in the curriculum.</p>
                        </div>

                        {error && (
                            <div className="p-3.5 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-2.5 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleInitiatePayment} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        id="student_name"
                                        name="name"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        required
                                        className="w-full !pl-11 pr-4 py-3 bg-[#050507] border border-zinc-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="email"
                                        id="student_email"
                                        name="email"
                                        autoComplete="email username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="student@example.com"
                                        required
                                        className="w-full !pl-11 pr-4 py-3 bg-[#050507] border border-zinc-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                    Choose Account Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="password"
                                        id="student_password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full !pl-11 pr-4 py-3 bg-[#050507] border border-zinc-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                    WhatsApp / Mobile Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="tel"
                                        id="student_phone"
                                        name="phone"
                                        autoComplete="tel"
                                        inputMode="numeric"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="10-digit mobile number"
                                        className="w-full !pl-11 pr-4 py-3 bg-[#050507] border border-zinc-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                                    <span>Referral Code <span className="text-zinc-500 font-normal lowercase">(optional)</span></span>
                                    <Link href="/referral" target="_blank" className="text-blue-400 hover:underline normal-case font-normal text-[10px]">
                                        Create or check a code ↗
                                    </Link>
                                </label>
                                <div className="relative">
                                    <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        id="referral_code"
                                        name="referral_code"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. CAMPUS50"
                                        className="w-full !pl-11 pr-4 py-3 bg-[#050507] border border-zinc-800 rounded-xl text-sm font-medium text-white uppercase tracking-wider focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Fee Card */}
                            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/30 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" /> Curriculum Access Fee
                                    </p>
                                    <p className="text-[11px] text-zinc-400 mt-0.5">Lifetime learning portal & progression tracker</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-white">₹{feeAmount}</span>
                                    <span className="text-[10px] text-zinc-400 block font-semibold">One-time</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Connecting Gateway...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{feeAmount} & Complete Registration →
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-2 border-t border-zinc-800/80">
                            <p className="text-xs text-zinc-400">
                                Already enrolled?{' '}
                                <Link href="/login" className="text-blue-400 font-bold hover:underline">
                                    Log in to Dashboard
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Step 2: Post-Payment Credentials Screen */
                    <div className="bg-[#090a0f]/90 border border-blue-900/40 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <div className="w-14 h-14 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Registration Complete!</h2>
                            <p className="text-xs text-zinc-400">
                                Welcome, <strong className="text-white">{registeredUser.name}</strong>. Your account has been generated.
                            </p>
                        </div>

                        {/* Credentials Card */}
                        <div className="p-5 bg-[#050507] border border-zinc-800 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Your Student Credentials</span>
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            `UID / Email: ${registeredUser.email}\nPassword: ${registeredUser.password}`
                                        )
                                    }
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied!' : 'Copy All'}
                                </button>
                            </div>

                            <div className="space-y-3 font-mono text-xs">
                                <div>
                                    <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-sans">UID / Login ID</span>
                                    <span className="text-blue-400 font-bold text-sm select-all">{registeredUser.email}</span>
                                </div>

                                <div>
                                    <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-sans">Password</span>
                                    <span className="text-amber-400 font-bold text-sm select-all">{registeredUser.password}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl text-center">
                            <p className="text-[11px] text-zinc-400">
                                💡 Tip: Save your UID and Password in a safe place. You can use them to login anytime.
                            </p>
                        </div>

                        <button
                            onClick={handleAutoLogin}
                            disabled={loggingIn}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loggingIn ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Entering Student Dashboard...
                                </>
                            ) : (
                                <>
                                    Continue to Dashboard <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
