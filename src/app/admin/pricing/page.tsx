'use client';

import React, { useState, useEffect } from 'react';
import { 
    IndianRupee, 
    Save, 
    CheckCircle2, 
    Zap, 
    Eye, 
    RefreshCw,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBatchPricingPage() {
    const [originalPrice, setOriginalPrice] = useState('250');
    const [offerPrice, setOfferPrice] = useState('149');
    const [gatewayFee, setGatewayFee] = useState('3');
    const [batchName, setBatchName] = useState('LevelOne Webdev Cohort');
    const [discountLabel, setDiscountLabel] = useState('40% OFF LAUNCH');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/pricing');
            const data = await res.json();
            if (data) {
                if (data.original_price !== undefined) setOriginalPrice(String(data.original_price));
                if (data.offer_price !== undefined) setOfferPrice(String(data.offer_price));
                if (data.gateway_fee !== undefined) setGatewayFee(String(data.gateway_fee));
                if (data.batch_name) setBatchName(data.batch_name);
                if (data.discount_label) setDiscountLabel(data.discount_label);
            }
        } catch (err) {
            console.error('Failed to load batch pricing:', err);
            toast.error('Could not fetch current pricing configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    original_price: Number(originalPrice),
                    offer_price: Number(offerPrice),
                    gateway_fee: Number(gatewayFee),
                    batch_name: batchName,
                    discount_label: discountLabel,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save batch pricing.');

            toast.success('Batch pricing updated successfully! Live across signup & checkout.');
        } catch (err: any) {
            toast.error(err.message || 'Error updating pricing');
        } finally {
            setSaving(false);
        }
    };

    const numOriginal = Number(originalPrice) || 0;
    const numOffer = Number(offerPrice) || 0;
    const numGateway = Number(gatewayFee) || 0;
    const totalPayable = numOffer + numGateway;
    const savings = Math.max(0, numOriginal - numOffer);

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <IndianRupee className="w-6 h-6 text-blue-600" />
                        Batch Pricing & Checkout Controls
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Control real-time enrollment fees, launch discounts, and payment gateway charges shown to students.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPricing}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors w-fit"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Settings Form */}
                    <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-bold text-gray-900">Set Batch Price Numbers</h2>
                            <p className="text-xs text-gray-500">Changes take effect immediately across all student checkout portals.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Original Price (₹ Cut-off)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        className="w-full !pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                                        placeholder="250"
                                    />
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1 block">Displayed with strikethrough (e.g. ₹250)</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Offer / Batch Fee (₹ Actual)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        className="w-full !pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-blue-600 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                                        placeholder="149"
                                    />
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1 block">Base amount received by LevelOne</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Gateway Fee Charged to User (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={gatewayFee}
                                        onChange={(e) => setGatewayFee(e.target.value)}
                                        className="w-full !pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                                        placeholder="3"
                                    />
                                </div>
                                <span className="text-[11px] text-gray-400 mt-1 block">Added transparently to user's checkout (₹3)</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Discount Tagline
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={discountLabel}
                                    onChange={(e) => setDiscountLabel(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                                    placeholder="40% OFF LAUNCH"
                                />
                                <span className="text-[11px] text-gray-400 mt-1 block">Badge shown on card</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Batch / Program Display Name
                            </label>
                            <input
                                type="text"
                                required
                                value={batchName}
                                onChange={(e) => setBatchName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                                placeholder="LevelOne Webdev Cohort"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Updating Platform Pricing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save & Publish Live Pricing
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Live Student Preview Card */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <Eye className="w-4 h-4 text-blue-600" />
                            Live Student Preview
                        </div>

                        <div className="bg-[#090a0f] border border-blue-900/40 rounded-3xl p-6 text-white shadow-xl space-y-5">
                            <div>
                                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md">
                                    ENROLLMENT PREVIEW
                                </span>
                                <h3 className="text-lg font-bold text-white mt-2">{batchName}</h3>
                                <p className="text-xs text-zinc-400">What students will see before opening Cashfree modal</p>
                            </div>

                            {/* Simulated Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/40 to-indigo-950/30 border border-blue-800/40 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-white flex items-center gap-1">
                                                <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" /> Curriculum Access
                                            </p>
                                            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                                                {discountLabel}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">Lifetime sandbox & cohort membership</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1.5 justify-end">
                                            <span className="text-xs text-zinc-500 line-through font-semibold">₹{numOriginal}</span>
                                            <span className="text-xl font-black text-white">₹{numOffer}</span>
                                        </div>
                                        {savings > 0 && (
                                            <span className="text-[10px] text-emerald-400 font-bold block">Save ₹{savings} today</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-800/80 space-y-1 text-[11px]">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Course Enrollment Fee</span>
                                        <span className="text-zinc-300 font-medium">₹{numOffer.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Online Payment Gateway Fee (2%)</span>
                                        <span className="text-zinc-300 font-medium">+₹{numGateway.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-white pt-1 border-t border-zinc-800/50">
                                        <span>Total Amount Charged to Student</span>
                                        <span className="text-blue-400 font-mono text-sm">₹{totalPayable.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs tracking-wide text-center shadow-md">
                                Pay ₹{totalPayable} & Complete Enrollment →
                            </div>

                            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center gap-2.5 text-[11px] text-zinc-400">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>LevelOne receives ₹{numOffer} clean, with ₹{numGateway} covering the gateway processing cost.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
