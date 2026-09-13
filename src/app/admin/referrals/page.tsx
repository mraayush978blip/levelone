'use client';

import React, { useState, useEffect } from 'react';
import { 
    Gift, 
    Search, 
    Users, 
    DollarSign, 
    Phone, 
    Mail, 
    GraduationCap, 
    Calendar, 
    ExternalLink, 
    RefreshCw,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReferralsPage() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);

    const fetchReferrals = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/referrals');
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to load referral data');
            setData(result);
        } catch (err: any) {
            toast.error(err.message || 'Error fetching referrals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, []);

    const filteredCodes = (data?.codes || []).filter((item: any) => {
        const query = searchQuery.toLowerCase();
        return (
            item.code?.toLowerCase().includes(query) ||
            item.creatorName?.toLowerCase().includes(query) ||
            item.creatorPhone?.includes(query) ||
            item.creatorEmail?.toLowerCase().includes(query) ||
            item.creatorCollege?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Gift className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Growth & Ambassador Tracking</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Referral Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track who generated referral codes, ambassador contact details, and student conversions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchReferrals}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-sm transition-all cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                    <a
                        href="/referral"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                        Open Public Hub <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Metrics HUD */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Referral Codes</span>
                    <p className="text-3xl font-black text-gray-900 mt-2">{data?.totalCodes || 0}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Referred Paid Students</span>
                    <p className="text-3xl font-black text-blue-600 mt-2">{data?.totalConversions || 0}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Referral Revenue</span>
                    <p className="text-3xl font-black text-emerald-600 mt-2">₹{data?.totalRevenue || 0}</p>
                </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by code (e.g. CAMPUS10), student name, phone number, college..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
            </div>

            {/* Table of Codes */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="py-3.5 px-4">Referral Code</th>
                                <th className="py-3.5 px-4">Ambassador (Creator)</th>
                                <th className="py-3.5 px-4">Contact Info</th>
                                <th className="py-3.5 px-4">College</th>
                                <th className="py-3.5 px-4 text-center">Paid Conversions</th>
                                <th className="py-3.5 px-4 text-right">Revenue</th>
                                <th className="py-3.5 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                            {filteredCodes.length > 0 ? (
                                filteredCodes.map((item: any) => {
                                    const isExpanded = expandedCodeId === item.id;
                                    return (
                                        <React.Fragment key={item.id}>
                                            <tr className="hover:bg-gray-50/80 transition-colors">
                                                <td className="py-4 px-4 font-mono font-black text-blue-600 text-base">
                                                    {item.code}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-bold text-gray-900">{item.creatorName}</div>
                                                    <div className="text-[11px] text-gray-400">
                                                        Created: {new Date(item.createdAt).toLocaleDateString('en-IN')}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-xs space-y-1">
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        <a href={`tel:${item.creatorPhone}`} className="hover:text-blue-600">
                                                            {item.creatorPhone}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                        <a href={`mailto:${item.creatorEmail}`} className="hover:text-blue-600">
                                                            {item.creatorEmail}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate">
                                                    <div className="flex items-center gap-1.5">
                                                        <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                                                        <span>{item.creatorCollege}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                        item.totalStudents > 0 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {item.totalStudents} Students
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right font-mono font-bold text-gray-900">
                                                    ₹{item.totalRevenue}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <button
                                                        onClick={() => setExpandedCodeId(isExpanded ? null : item.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        {isExpanded ? (
                                                            <>Hide Students <ChevronUp className="w-3.5 h-3.5" /></>
                                                        ) : (
                                                            <>View List ({item.totalStudents}) <ChevronDown className="w-3.5 h-3.5" /></>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Sub-table: List of students who used this code */}
                                            {isExpanded && (
                                                <tr className="bg-blue-50/30">
                                                    <td colSpan={7} className="p-4 border-y border-blue-100">
                                                        <div className="space-y-3">
                                                            <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
                                                                Enrolled Students using code {item.code}:
                                                            </div>
                                                            {item.students && item.students.length > 0 ? (
                                                                <div className="bg-white border border-blue-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                                                    {item.students.map((student: any, sIdx: number) => (
                                                                        <div key={sIdx} className="p-3 flex items-center justify-between text-xs">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                                                                    {sIdx + 1}
                                                                                </span>
                                                                                <span className="font-bold text-gray-900">{student.name}</span>
                                                                                <span className="text-gray-500">({student.email})</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-4 text-gray-500 font-mono">
                                                                                <span>Payment: {student.paymentId}</span>
                                                                                <span>{new Date(student.joinedAt).toLocaleString('en-IN')}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-500 italic">No students have used this code yet.</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400">
                                        <Gift className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                        <p className="text-sm font-semibold">No referral codes found</p>
                                        <p className="text-xs text-gray-400">Referral codes created by ambassadors will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
