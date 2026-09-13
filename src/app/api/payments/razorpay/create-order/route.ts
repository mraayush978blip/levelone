import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount = 149, email, name } = body;

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // Pre-check if email is already enrolled before accepting payment
        if (email) {
            const { supabaseAdmin } = await import('@/lib/supabase-admin');
            const { data: existingUser } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', email.trim().toLowerCase())
                .maybeSingle();

            if (existingUser) {
                return NextResponse.json({
                    error: 'An account with this email address already exists. Please log in instead.',
                }, { status: 400 });
            }
        }

        // If Razorpay keys are not yet configured in .env.local, generate a mock test order
        if (!keyId || !keySecret || keyId === 'rzp_test_placeholder') {
            console.log('[Razorpay Order] Running in Test/Mock Order mode (Keys pending in .env.local)');
            return NextResponse.json({
                orderId: `order_mock_${Date.now()}`,
                amount: amount * 100,
                currency: 'INR',
                isMock: true,
                keyId: 'rzp_test_mock',
            });
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const options = {
            amount: Math.round(amount * 100), // in paise (₹149 = 14900)
            currency: 'INR',
            receipt: `receipt_${Date.now().toString().slice(-8)}`,
            notes: {
                student_name: name || '',
                student_email: email || '',
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            isMock: false,
            keyId: keyId,
        });
    } catch (err: any) {
        console.error('[Razorpay Order Error]:', err);
        return NextResponse.json({ error: err.message || 'Failed to create payment order' }, { status: 500 });
    }
}
