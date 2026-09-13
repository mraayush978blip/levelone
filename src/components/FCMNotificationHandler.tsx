'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientMessaging, hasClientFirebaseConfig } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { toast } from 'sonner';

export default function FCMNotificationHandler() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user || !hasClientFirebaseConfig || typeof window === 'undefined') return;

        let unsubscribe: (() => void) | undefined;

        const setupFCM = async () => {
            try {
                if (!('Notification' in window)) return;

                // Only request or register if permission is not explicitly denied
                if (Notification.permission === 'default') {
                    // We can wait for first user interaction or request automatically
                    const perm = await Notification.requestPermission();
                    if (perm !== 'granted') return;
                } else if (Notification.permission !== 'granted') {
                    return;
                }

                const messaging = await getClientMessaging();
                if (!messaging) return;

                // Register service worker if not already registered
                const registration = await navigator.serviceWorker.ready;

                const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                const token = await getToken(messaging, {
                    serviceWorkerRegistration: registration,
                    vapidKey: vapidKey || undefined,
                });

                if (token) {
                    console.log('[FCM] Device Token obtained:', token.substring(0, 10) + '...');
                    // Sync token to database
                    await fetch('/api/notifications/fcm/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            token: token,
                            deviceInfo: `${navigator.userAgent.slice(0, 100)}`,
                        }),
                    });
                }

                // Listen for foreground push notifications
                unsubscribe = onMessage(messaging, (payload) => {
                    console.log('[FCM] Foreground message received:', payload);
                    const title = payload.notification?.title || 'Notification';
                    const body = payload.notification?.body || '';

                    toast.info(title, {
                        description: body,
                        duration: 6000,
                    });
                });
            } catch (err) {
                console.warn('[FCM] Setup notice:', err);
            }
        };

        setupFCM();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    return null;
}
