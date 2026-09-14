import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
            phone,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            referral_code,
            isMock = false,
        } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required student details' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // 1. Signature Verification (if real Razorpay transaction)
        if (!isMock && keySecret) {
            const expectedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return NextResponse.json({ error: 'Invalid payment signature verification failed.' }, { status: 400 });
            }
        }

        // 2. Check if student email already registered in Supabase
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json({
                error: 'An account with this email address is already enrolled. Please login instead.',
            }, { status: 400 });
        }

        // 3. Create User in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: normalizedEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
                name: name.trim(),
                role: 'student',
            },
        });

        if (authError) {
            console.error('[Verify & Register] Auth creation error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const authUserId = authData.user?.id;
        if (!authUserId) {
            return NextResponse.json({ error: 'Failed to retrieve Auth user ID' }, { status: 500 });
        }

        // Set student UID as email ID
        const studentUid = normalizedEmail;
        const cleanReferralCode = referral_code ? referral_code.trim().toUpperCase() : null;

        // 4. Insert into public.users table
        const { error: insertUserError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authUserId,
                email: normalizedEmail,
                name: name.trim(),
                phone: phone ? phone.trim() : null,
                roll_number: studentUid,
                role: 'student',
                status: 'active',
                points: 50, // Welcome signup bonus!
                used_referral_code: cleanReferralCode,
            });

        if (insertUserError) {
            console.error('[Verify & Register] Public user table insert error:', insertUserError);
            return NextResponse.json({ error: insertUserError.message }, { status: 500 });
        }

        // 5. Record referral conversion if referral_code provided
        if (cleanReferralCode) {
            try {
                // Find matching active referral code
                const { data: codeRow } = await supabaseAdmin
                    .from('referral_codes')
                    .select('id, code')
                    .ilike('code', cleanReferralCode)
                    .maybeSingle();

                if (codeRow) {
                    await supabaseAdmin.from('referral_usages').insert({
                        referral_code_id: codeRow.id,
                        referral_code: codeRow.code,
                        referred_user_id: authUserId,
                        referred_student_name: name.trim(),
                        referred_student_email: normalizedEmail,
                        amount_paid: 149.00,
                        payment_id: razorpay_payment_id || 'mock_pay',
                        payment_status: 'paid',
                    });
                }
            } catch (refErr) {
                console.warn('[Verify & Register] Error logging referral usage:', refErr);
            }
        }

        // 6. Record payment in public.payments table
        try {
            await supabaseAdmin.from('payments').insert({
                user_id: authUserId,
                email: normalizedEmail,
                amount: 149.00,
                currency: 'INR',
                razorpay_order_id: razorpay_order_id || 'mock_order',
                razorpay_payment_id: razorpay_payment_id || 'mock_pay',
                razorpay_signature: razorpay_signature || 'mock_sig',
                status: 'paid',
            });
        } catch (payErr) {
            console.warn('[Verify & Register] Could not log to payments table (table might not exist yet):', payErr);
        }

        // 7. Send Welcome Email (Fire and forget - don't block signup on email failure)
        try {
            const { sendWelcomeEmail } = await import('@/actions/sendWelcomeEmail');
            sendWelcomeEmail({
                studentEmail: normalizedEmail,
                studentName: name.trim(),
                rollNumber: studentUid,
            }).catch((emailErr) => {
                console.warn('[Razorpay Verify & Register] Welcome email trigger failed (non-blocking):', emailErr);
            });
        } catch (mailImportErr) {
            console.warn('[Razorpay Verify & Register] Could not load sendWelcomeEmail:', mailImportErr);
        }

        return NextResponse.json({
            success: true,
            user: {
                id: authUserId,
                uid: studentUid,
                name: name.trim(),
                email: normalizedEmail,
                password: password, // Returned back once to show on the success screen
            },
        });
    } catch (err: any) {
        console.error('[Verify & Register] Unexpected Error:', err);
        return NextResponse.json({ error: err.message || 'Internal registration error' }, { status: 500 });
    }
}
