import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST: Create a new referral code
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, college, code } = body;

        if (!name || !email || !phone || !college || !code) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        // Clean & format referral code (UPPERCASE, alphanumeric, max 20 chars)
        const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

        if (cleanCode.length < 3) {
            return NextResponse.json({ error: 'Referral code must be at least 3 characters long.' }, { status: 400 });
        }

        // Check if code already exists
        const { data: existing } = await supabaseAdmin
            .from('referral_codes')
            .select('id, code')
            .ilike('code', cleanCode)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: `Referral code "${cleanCode}" is already taken. Please choose another.` }, { status: 409 });
        }

        // Insert new code
        const { data, error } = await supabaseAdmin
            .from('referral_codes')
            .insert({
                code: cleanCode,
                creator_name: name.trim(),
                creator_email: email.trim().toLowerCase(),
                creator_phone: phone.trim(),
                creator_college: college.trim(),
            })
            .select()
            .single();

        if (error) {
            console.error('[Create Referral] DB Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            code: cleanCode,
            creator: {
                name: data.creator_name,
                college: data.creator_college,
            },
        });
    } catch (err: any) {
        console.error('[Create Referral] Server Error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
