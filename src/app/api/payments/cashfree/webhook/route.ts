import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-webhook-signature');
        const timestamp = request.headers.get('x-webhook-timestamp');
        const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();

        // 1. Verify Webhook Signature if secret exists
        if (secretKey && signature && timestamp) {
            const dataToSign = timestamp + rawBody;
            const expectedSig = crypto
                .createHmac('sha256', secretKey)
                .update(dataToSign)
                .digest('base64');

            if (expectedSig !== signature) {
                console.warn('[Cashfree Webhook] Invalid signature mismatch');
                return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
            }
        }

        const eventData = JSON.parse(rawBody);
        const { type, data } = eventData;

        // Listen for PAYMENT_SUCCESS_WEBHOOK
        if (type === 'PAYMENT_SUCCESS_WEBHOOK' && data?.order && data?.payment) {
            const orderId = data.order.order_id;
            const paymentId = String(data.payment.cf_payment_id);
            const customerEmail = data.customer_details?.customer_email?.trim()?.toLowerCase();
            const customerName = data.customer_details?.customer_name || 'Student';
            const amountPaid = data.payment.payment_amount || 149.00;

            if (customerEmail) {
                // Check if student exists in public.users
                const { data: userRow } = await supabaseAdmin
                    .from('users')
                    .select('id, used_referral_code')
                    .eq('email', customerEmail)
                    .maybeSingle();

                if (userRow?.used_referral_code) {
                    const code = userRow.used_referral_code.trim().toUpperCase();

                    // Lookup referral code
                    const { data: codeRow } = await supabaseAdmin
                        .from('referral_codes')
                        .select('id, code')
                        .ilike('code', code)
                        .maybeSingle();

                    if (codeRow) {
                        // Upsert into referral_usages to prevent duplicates
                        await supabaseAdmin
                            .from('referral_usages')
                            .upsert({
                                referral_code_id: codeRow.id,
                                referral_code: codeRow.code,
                                referred_user_id: userRow.id,
                                referred_student_name: customerName,
                                referred_student_email: customerEmail,
                                amount_paid: amountPaid,
                                payment_id: paymentId,
                                payment_status: 'paid',
                            }, { onConflict: 'referred_user_id' });
                    }
                }
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (err: any) {
        console.error('[Cashfree Webhook Error]:', err);
        return NextResponse.json({ error: err.message || 'Webhook error' }, { status: 500 });
    }
}
