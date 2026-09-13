import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET: Fetch all referral codes with total conversions and referred student lists for Admin
export async function GET() {
    try {
        // 1. Fetch all codes
        const { data: codes, error: codesError } = await supabaseAdmin
            .from('referral_codes')
            .select('*')
            .order('created_at', { ascending: false });

        if (codesError) {
            console.error('[Admin Referrals API] Error:', codesError);
            return NextResponse.json({ error: codesError.message }, { status: 500 });
        }

        // 2. Fetch all paid usages
        const { data: usages, error: usagesError } = await supabaseAdmin
            .from('referral_usages')
            .select('*')
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false });

        if (usagesError) {
            console.error('[Admin Referrals API] Error fetching usages:', usagesError);
            return NextResponse.json({ error: usagesError.message }, { status: 500 });
        }

        // Group usages by referral_code_id
        const usagesByCodeId: Record<string, any[]> = {};
        (usages || []).forEach((u) => {
            if (!usagesByCodeId[u.referral_code_id]) {
                usagesByCodeId[u.referral_code_id] = [];
            }
            usagesByCodeId[u.referral_code_id].push(u);
        });

        const report = (codes || []).map((c) => {
            const codeUsages = usagesByCodeId[c.id] || [];
            return {
                id: c.id,
                code: c.code,
                creatorName: c.creator_name,
                creatorEmail: c.creator_email,
                creatorPhone: c.creator_phone,
                creatorCollege: c.creator_college,
                createdAt: c.created_at,
                isActive: c.is_active,
                totalStudents: codeUsages.length,
                totalRevenue: codeUsages.length * 149,
                students: codeUsages.map((u) => ({
                    id: u.id,
                    name: u.referred_student_name,
                    email: u.referred_student_email,
                    paymentId: u.payment_id,
                    joinedAt: u.created_at,
                })),
            };
        });

        return NextResponse.json({
            success: true,
            totalCodes: codes?.length || 0,
            totalConversions: usages?.length || 0,
            totalRevenue: (usages?.length || 0) * 149,
            codes: report,
        });
    } catch (err: any) {
        console.error('[Admin Referrals API] Unexpected error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
