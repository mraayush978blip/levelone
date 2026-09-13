import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST: Verify a referral code and fetch its live student activity
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code } = body;

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Please enter a referral code.' }, { status: 400 });
        }

        const cleanCode = code.trim().toUpperCase();

        // 1. Fetch code details
        const { data: codeData, error: codeError } = await supabaseAdmin
            .from('referral_codes')
            .select('id, code, creator_name, creator_college, created_at, is_active')
            .ilike('code', cleanCode)
            .maybeSingle();

        if (codeError) {
            console.error('[Referral Activity] Error fetching code:', codeError);
            return NextResponse.json({ error: codeError.message }, { status: 500 });
        }

        if (!codeData) {
            return NextResponse.json({ error: `Referral code "${cleanCode}" was not found. Please check spelling.` }, { status: 404 });
        }

        // 2. Fetch all successful (paid) student usages
        const { data: usages, error: usagesError } = await supabaseAdmin
            .from('referral_usages')
            .select('referred_student_name, created_at, amount_paid')
            .eq('referral_code_id', codeData.id)
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false });

        if (usagesError) {
            console.error('[Referral Activity] Error fetching usages:', usagesError);
            return NextResponse.json({ error: usagesError.message }, { status: 500 });
        }

        const studentList = (usages || []).map((u) => ({
            name: u.referred_student_name,
            joinedAt: u.created_at,
        }));

        return NextResponse.json({
            success: true,
            code: codeData.code,
            creatorName: codeData.creator_name,
            creatorCollege: codeData.creator_college,
            createdAt: codeData.created_at,
            totalStudents: studentList.length,
            activity: studentList,
        });
    } catch (err: any) {
        console.error('[Referral Activity] Server Error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
