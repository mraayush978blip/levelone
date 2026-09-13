'use client';

import { useState } from 'react';
import { Send, BellRing, Sparkles, CheckCircle2, AlertCircle, Radio, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBroadcastPage() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('/student');
    const [targetAudience, setTargetAudience] = useState<'all' | 'active'>('all');
    const [sending, setSending] = useState(false);
    const [lastBroadcast, setLastBroadcast] = useState<any | null>(null);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error('Please enter both title and message');
            return;
        }

        setSending(true);
        try {
            const res = await fetch('/api/notifications/fcm/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    message: message.trim(),
                    url: url.trim(),
                    targetAudience,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send broadcast');

            setLastBroadcast(data);
            toast.success('Broadcast transmitted successfully!');
            setTitle('');
            setMessage('');
        } catch (err: any) {
            console.error('Broadcast error:', err);
            toast.error(err.message || 'Error transmitting broadcast');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Radio className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider">Broadcast Command Center</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Push & In-App Broadcast</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Transmit real-time notifications to enrolled students via FCM push and in-app feeds.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                    <form onSubmit={handleBroadcast} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Target Audience
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setTargetAudience('all')}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                                        targetAudience === 'all'
                                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                >
                                    <Users className="w-4 h-4" /> All Enrolled Students
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTargetAudience('active')}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                                        targetAudience === 'active'
                                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4" /> Active Status Only
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Notification Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. 🚨 New Phase 2 Live & Ready!"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-900 shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Message Content
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                placeholder="Write the announcement message for students..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-900 shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Action URL (Student Redirect on Click)
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="/student or /student/phase/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-900 shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {sending ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Broadcasting Transmission...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Broadcast Notification
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Preview & Status */}
                <div className="space-y-6">
                    <div className="bg-gray-900 text-white border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Live Preview</span>
                            <BellRing className="w-4 h-4 text-blue-400" />
                        </div>

                        {/* Push Notification Card simulation */}
                        <div className="bg-gray-800/90 border border-gray-700/60 rounded-xl p-4 shadow-lg flex items-start gap-3">
                            <div className="h-9 w-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-lg">
                                ⚡
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-white truncate">
                                    {title || 'Announcement Title Preview'}
                                </p>
                                <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">
                                    {message || 'Your message will appear here in students\' browser and system tray...'}
                                </p>
                                <span className="text-[9px] text-blue-400 font-semibold mt-2 block">
                                    Opens: {url || '/student'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {lastBroadcast && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                <CheckCircle2 className="w-5 h-5" /> Transmission Report
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {lastBroadcast.fcm?.message}
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                <div>Devices Targeted: <span className="font-bold text-gray-800">{lastBroadcast.tokensTargeted || 0}</span></div>
                                <div>In-App Broadcast: <span className="font-bold text-green-600">Active</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
