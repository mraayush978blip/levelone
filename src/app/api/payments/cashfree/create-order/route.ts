import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount = 149, email, name, phone } = body;

        const appId = process.env.CASHFREE_APP_ID?.trim();
        const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
        const envMode = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();

        if (!appId || !secretKey) {
            return NextResponse.json({ error: 'Cashfree API keys are not configured on the server.' }, { status: 500 });
        }

        // Pre-check if student email already enrolled before accepting payment
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

        const baseUrl = envMode === 'PROD' 
            ? 'https://api.cashfree.com/pg' 
            : 'https://sandbox.cashfree.com/pg';

        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.levelonedev.tech').replace(/\/$/, '');

        const payload = {
            order_id: orderId,
            order_amount: Number(amount).toFixed(2),
            order_currency: 'INR',
            customer_details: {
                customer_id: customerId,
                customer_name: name ? name.trim() : 'LevelOne Student',
                customer_email: email ? email.trim().toLowerCase() : 'student@levelonedev.tech',
                customer_phone: phone ? phone.trim().replace(/[^0-9]/g, '').slice(-10) : '9999999999',
            },
            order_meta: {
                return_url: `${appUrl}/signup?cf_order_id={order_id}`,
            },
            order_note: 'LevelOne Curriculum & Advanced Sandbox Enrollment Fee',
        };

        const cfRes = await fetch(`${baseUrl}/orders`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': appId,
                'x-client-secret': secretKey,
            },
            body: JSON.stringify(payload),
        });

        const data = await cfRes.json();

        if (!cfRes.ok) {
            console.error('[Cashfree Order Error]:', data);
            return NextResponse.json({ error: data.message || 'Failed to initialize Cashfree order' }, { status: cfRes.status });
        }

        return NextResponse.json({
            success: true,
            orderId: data.order_id,
            cfOrderId: data.cf_order_id,
            paymentSessionId: data.payment_session_id,
            amount: data.order_amount,
            currency: data.order_currency,
            env: envMode,
        });
    } catch (err: any) {
        console.error('[Cashfree Create Order Error]:', err);
        return NextResponse.json({ error: err.message || 'Internal server error while creating payment order' }, { status: 500 });
    }
}
