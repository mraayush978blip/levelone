import * as admin from 'firebase-admin';

export const hasAdminFirebaseConfig = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
);

export function getFirebaseAdmin() {
    if (!hasAdminFirebaseConfig) {
        return null;
    }

    if (admin.apps.length > 0) {
        return admin.app();
    }

    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}
