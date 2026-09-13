import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getFirebaseAdmin, hasAdminFirebaseConfig } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, message, url } = body;

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
        }

        // 1. Insert In-App Notification into public.notifications so all students see it
        const { error: notifError } = await supabaseAdmin
            .from('notifications')
            .insert({
                title,
                message,
                type: 'broadcast',
                reference_id: null,
            });

        if (notifError) {
            console.error('[Broadcast API] In-app notification error:', notifError);
        }

        // 2. Fetch all student tokens
        const query = supabaseAdmin
            .from('user_fcm_tokens')
            .select('token, user_id');

        const { data: tokenRows, error: tokenError } = await query;

        if (tokenError) {
            console.error('[Broadcast API] Error fetching tokens:', tokenError);
        }

        const tokens = (tokenRows || []).map((r: any) => r.token).filter(Boolean);

        let fcmResult = {
            sent: false,
            successCount: 0,
            failureCount: 0,
            message: 'In-app notification broadcasted. FCM push pending configuration.',
        };

        if (tokens.length > 0 && hasAdminFirebaseConfig) {
            const firebaseAdmin = getFirebaseAdmin();
            if (firebaseAdmin) {
                const multicastMessage: admin.messaging.MulticastMessage = {
                    tokens: tokens,
                    notification: {
                        title: title,
                        body: message,
                    },
                    data: {
                        url: url || '/student',
                    },
                    webpush: {
                        fcmOptions: {
                            link: url || '/student',
                        },
                    },
                };

                const response = await firebaseAdmin.messaging().sendEachForMulticast(multicastMessage);
                fcmResult = {
                    sent: true,
                    successCount: response.successCount,
                    failureCount: response.failureCount,
                    message: `Dispatched to ${response.successCount} devices (${response.failureCount} failed).`,
                };
            }
        } else if (!hasAdminFirebaseConfig) {
            fcmResult.message = 'In-app notification sent. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local to enable real-time device push.';
        } else {
            fcmResult.message = 'In-app notification sent. No student devices registered for push yet.';
        }

        return NextResponse.json({
            success: true,
            inAppBroadcast: !notifError,
            tokensTargeted: tokens.length,
            fcm: fcmResult,
        });
    } catch (err: any) {
        console.error('[Broadcast API] Unexpected error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
