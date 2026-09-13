import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, token, deviceInfo } = body;

        if (!userId || !token) {
            return NextResponse.json({ error: 'Missing userId or token' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_fcm_tokens')
            .upsert(
                {
                    user_id: userId,
                    token: token,
                    device_info: deviceInfo || 'web-browser',
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'token' }
            )
            .select();

        if (error) {
            console.error('[FCM Token Route] DB Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('[FCM Token Route] Unexpected error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
