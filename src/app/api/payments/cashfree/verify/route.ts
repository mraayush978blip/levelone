import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
            phone,
            order_id,
            referral_code,
        } = body;

        if (!email || !password || !name || !order_id) {
            return NextResponse.json({ error: 'Missing required registration or payment details' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const appId = process.env.CASHFREE_APP_ID?.trim();
        const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
        const envMode = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();

        if (!appId || !secretKey) {
            return NextResponse.json({ error: 'Cashfree server credentials missing.' }, { status: 500 });
        }

        // 1. Verify Payment status directly with Cashfree Payments API
        const baseUrl = envMode === 'PROD' 
            ? 'https://api.cashfree.com/pg' 
            : 'https://sandbox.cashfree.com/pg';

        const cfRes = await fetch(`${baseUrl}/orders/${order_id}/payments`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': appId,
                'x-client-secret': secretKey,
            },
        });

        const paymentRecords = await cfRes.json();

        if (!cfRes.ok) {
            console.error('[Cashfree Verify Error]:', paymentRecords);
            return NextResponse.json({ error: paymentRecords.message || 'Failed to verify Cashfree payment' }, { status: 400 });
        }

        // Check if any payment attempt was SUCCESS
        const successfulPayment = Array.isArray(paymentRecords)
            ? paymentRecords.find((p: any) => p.payment_status === 'SUCCESS')
            : null;

        if (!successfulPayment) {
            return NextResponse.json({
                error: 'No successful payment found for this order. Please complete payment first.',
            }, { status: 400 });
        }

        const cfPaymentId = successfulPayment.cf_payment_id ? String(successfulPayment.cf_payment_id) : `cf_pay_${Date.now()}`;
        const paymentAmount = successfulPayment.payment_amount || 149.00;

        // 2. Check if student is already enrolled in Supabase
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json({
                error: 'An account with this email address is already enrolled. Please log in instead.',
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
            console.error('[Cashfree Verify & Register] Auth creation error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const authUserId = authData.user?.id;
        if (!authUserId) {
            return NextResponse.json({ error: 'Failed to retrieve Auth user ID' }, { status: 500 });
        }

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
                points: 50, // Welcome signup bonus
                used_referral_code: cleanReferralCode,
            });

        if (insertUserError) {
            console.error('[Cashfree Verify & Register] Public user table insert error:', insertUserError);
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
                        amount_paid: paymentAmount,
                        payment_id: cfPaymentId,
                        payment_status: 'paid',
                    });
                }
            } catch (refErr) {
                console.warn('[Cashfree Verify & Register] Error logging referral usage:', refErr);
            }
        }

        // 6. Record payment in public.payments table
        try {
            await supabaseAdmin.from('payments').insert({
                user_id: authUserId,
                email: normalizedEmail,
                amount: paymentAmount,
                currency: 'INR',
                razorpay_order_id: order_id,
                razorpay_payment_id: cfPaymentId,
                status: 'paid',
            });
        } catch (payErr) {
            console.warn('[Cashfree Verify & Register] Could not log to payments table:', payErr);
        }

        return NextResponse.json({
            success: true,
            user: {
                id: authUserId,
                uid: studentUid,
                name: name.trim(),
                email: normalizedEmail,
                password: password,
            },
        });
    } catch (err: any) {
        console.error('[Cashfree Verify & Register] Unexpected Error:', err);
        return NextResponse.json({ error: err.message || 'Internal registration error' }, { status: 500 });
    }
}
