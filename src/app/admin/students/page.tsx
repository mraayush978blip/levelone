'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Eye,
    Filter,
    Users as UsersIcon,
    Shield,
    ShieldOff,
    EyeOff,
    CheckSquare,
    Square
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';

export default function StudentListPage() {
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');
    const [actionLoading, setActionLoading] = useState(false);

    // Multi-selection state
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'student')
                .order('roll_number', { ascending: true });

            if (error) throw error;

            // Numeric sort for roll numbers (handling strings like '1', '10', '2')
            const sortedData = (data || []).sort((a, b) => {
                const numA = parseInt(a.roll_number || '0', 10);
                const numB = parseInt(b.roll_number || '0', 10);
                if (isNaN(numA) || isNaN(numB)) {
                    return (a.roll_number || '').localeCompare(b.roll_number || '');
                }
                return numA - numB;
            });

            setStudents(sortedData);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStudentStatus = async (student: User) => {
        const newStatus = student.status === 'active' ? 'revoked' : 'active';
        if (!confirm(`Are you sure you want to ${newStatus === 'revoked' ? 'revoke access for' : 'restore access for'} ${student.name}?`)) return;

        let extensionDays = 0;
        if (newStatus === 'active') {
            const daysInput = window.prompt(`How many days extension should ${student.name} get to complete their backlog? (e.g. 7)`);
            if (daysInput === null) return;
            
            extensionDays = parseInt(daysInput);
            if (isNaN(extensionDays) || extensionDays <= 0) {
                alert('Please enter a valid number of days.');
                return;
            }
        }

        setActionLoading(true);
        try {
            if (newStatus === 'active') {
                const { error } = await supabase.rpc('admin_restore_student', {
                    target_student_id: student.id,
                    extension_days: extensionDays
                });
                if (error) throw error;
                
                if (student.phone && confirm('Student restored! Would you like to notify them via WhatsApp?')) {
                    const text = `Hi ${student.name},\n\nYour Levelone account has been restored! You have been granted an extension of ${extensionDays} days to complete your backlog. Please log in and submit your assignment before the new deadline to avoid losing access again.\n\nBest,\nLevelone Admin`;
                    const url = `https://wa.me/${student.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                }
            } else {
                const { error } = await supabase
                    .from('users')
                    .update({ status: newStatus })
                    .eq('id', student.id);

                if (error) throw error;

                // Fire-and-forget: log the revoke action
                supabase.auth.getUser().then(({ data }) => {
                    supabase.from('activity_logs').insert({
                        student_id: student.id,
                        activity_type: 'ACCESS_REVOKED',
                        payload: { admin_id: data.user?.id }
                    }).then(({ error: logErr }) => {
                        if (logErr) console.warn('Activity log failed (non-critical):', logErr.message);
                    });
                });
            }

            fetchStudents();
        } catch (error) {
            console.error('Error updating student status:', error);
            alert('Failed to update student status.');
        } finally {
            setActionLoading(false);
        }
    };

    // Toggle individual leaderboard visibility
    const toggleLeaderboardVisibility = async (student: User) => {
        const willHide = !student.is_hidden_from_leaderboard;
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_hidden_from_leaderboard: willHide })
                .eq('id', student.id);

            if (error) throw error;

            setStudents(prev => prev.map(s => s.id === student.id ? { ...s, is_hidden_from_leaderboard: willHide } : s));
        } catch (err: any) {
            console.error('Error toggling leaderboard visibility:', err);
            alert('Failed to update leaderboard visibility: ' + (err.message || 'Error'));
        } finally {
            setActionLoading(false);
        }
    };

    // Bulk Leaderboard Hide / Unhide
    const handleBulkLeaderboardVisibility = async (hide: boolean) => {
        const ids = Array.from(selectedStudentIds);
        if (ids.length === 0) {
            alert('Please select at least one student.');
            return;
        }

        if (!confirm(`Are you sure you want to ${hide ? 'HIDE' : 'UNHIDE'} ${ids.length} selected student(s) from the leaderboard?`)) return;

        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_hidden_from_leaderboard: hide })
                .in('id', ids);

            if (error) throw error;

            alert(`Successfully ${hide ? 'hidden' : 'unhidden'} ${ids.length} student(s) from the leaderboard!`);
            setSelectedStudentIds(new Set());
            fetchStudents();
        } catch (err: any) {
            console.error('Error in bulk leaderboard visibility:', err);
            alert('Failed to update leaderboard visibility.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkRevoke = async () => {
        const activeCount = students.filter(s => s.status === 'active').length;
        if (activeCount === 0) {
            alert('No active students to revoke.');
            return;
        }

        if (!confirm(`CAUTION: Are you sure you want to revoke access for ALL ${activeCount} active students? This will take effect immediately.`)) return;

        setActionLoading(true);
        try {
            const { data, error } = await supabase.rpc('admin_bulk_revoke_students');
            if (error) throw error;

            alert(`Success! ${data.affected_count} students were revoked.`);
            fetchStudents();
        } catch (error) {
            console.error('Error in bulk revoke:', error);
            alert('Failed to perform bulk revocation.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkRestore = async () => {
        const revokedCount = students.filter(s => s.status === 'revoked').length;
        if (revokedCount === 0) {
            alert('No revoked students to restore.');
            return;
        }

        if (!confirm(`Are you sure you want to restore access for ALL ${revokedCount} revoked students? This will also bypass any missed mandatory phases for them.`)) return;

        setActionLoading(true);
        try {
            const { data, error } = await supabase.rpc('admin_bulk_restore_students');
            if (error) throw error;

            alert(`Success! ${data.affected_count} students were restored. Total bypassed phases: ${data.total_bypassed_phases}`);
            fetchStudents();
        } catch (error) {
            console.error('Error in bulk restore:', error);
            alert('Failed to perform bulk restoration.');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.roll_number?.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = filterStatus === 'all' || student.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // Checkbox helper functions
    const isAllSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedStudentIds.has(s.id));
    const isSomeSelected = filteredStudents.some(s => selectedStudentIds.has(s.id)) && !isAllSelected;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedStudentIds(new Set());
        } else {
            const allIds = new Set(filteredStudents.map(s => s.id));
            setSelectedStudentIds(allIds);
        }
    };

    const toggleSelectOne = (id: string) => {
        const updated = new Set(selectedStudentIds);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSelectedStudentIds(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View, search, and manage student access and leaderboard visibility.
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm w-fit">
                    <UsersIcon className="h-4 w-4" />
                    <span>{students.length} Total Students</span>
                </div>
            </div>

            {/* Filter and Global Action Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative w-full lg:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by name, email, or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleBulkRestore}
                            disabled={actionLoading || loading}
                            className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                        >
                            <Shield className="h-4 w-4 mr-2" /> Restore All
                        </button>
                        <button
                            onClick={handleBulkRevoke}
                            disabled={actionLoading || loading}
                            className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 border border-rose-100 rounded-md shadow-sm text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-colors"
                        >
                            <ShieldOff className="h-4 w-4 mr-2" /> Revoke All
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 sm:border-l sm:pl-3 sm:border-t-0 border-t pt-3 sm:pt-0 w-full sm:w-auto">
                        <Filter className="h-5 w-5 text-gray-400 shrink-0" />
                        <select
                            className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                            <option value="all">All Students</option>
                            <option value="active">Active Only</option>
                            <option value="revoked">Revoked Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Selection Actions Bar (Appears when >=1 selected) */}
            {selectedStudentIds.size > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg animate-fade-in text-blue-900">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                        <span>{selectedStudentIds.size} student(s) selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkLeaderboardVisibility(true)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
                        >
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide from Leaderboard
                        </button>
                        <button
                            onClick={() => handleBulkLeaderboardVisibility(false)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Unhide on Leaderboard
                        </button>
                        <button
                            onClick={() => setSelectedStudentIds(new Set())}
                            className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-x-auto sm:rounded-lg border border-gray-200 text-black">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Select All Checkbox */}
                                <th scope="col" className="px-4 py-3 text-center w-10">
                                    <button
                                        type="button"
                                        onClick={toggleSelectAll}
                                        className="text-gray-500 hover:text-blue-600 focus:outline-none"
                                        title={isAllSelected ? "Deselect All" : "Select All"}
                                    >
                                        {isAllSelected ? (
                                            <CheckSquare className="w-5 h-5 text-blue-600" />
                                        ) : isSomeSelected ? (
                                            <div className="w-4 h-4 bg-blue-600 rounded-sm mx-auto flex items-center justify-center text-white text-[10px] font-bold">-</div>
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name / Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roll Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Leaderboard
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment / Source
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th scope="col" className="relative px-6 py-3 text-right">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => {
                                const isSelected = selectedStudentIds.has(student.id);
                                const isHidden = !!student.is_hidden_from_leaderboard;

                                return (
                                    <tr key={student.id} className={isSelected ? "bg-blue-50/50" : ""}>
                                        {/* Individual Checkbox */}
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <button
                                                type="button"
                                                onClick={() => toggleSelectOne(student.id)}
                                                className="text-gray-400 hover:text-blue-600 focus:outline-none"
                                            >
                                                {isSelected ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-gray-300" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{student.roll_number || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{student.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                            </span>
                                        </td>
                                        {/* Leaderboard Visibility Status & Toggle */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => toggleLeaderboardVisibility(student)}
                                                disabled={actionLoading}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                                                    isHidden
                                                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                                }`}
                                                title={isHidden ? "Currently hidden. Click to show on leaderboard" : "Currently visible. Click to hide from leaderboard"}
                                            >
                                                {isHidden ? (
                                                    <>
                                                        <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                                                        <span>Hidden</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>Visible</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
                                                    ⚡ Online Pay (₹152)
                                                </span>
                                                {student.used_referral_code ? (
                                                    <span className="text-[11px] text-blue-600 font-mono font-semibold">
                                                        Ref: {student.used_referral_code}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400">Direct Signup</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(student.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <Link
                                                href={`/admin/students/${student.id}`}
                                                className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => toggleStudentStatus(student)}
                                                className={`${student.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                                    } inline-flex items-center`}
                                                title={student.status === 'active' ? 'Revoke Access' : 'Restore Access'}
                                            >
                                                {student.status === 'active' ? <ShieldOff className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
