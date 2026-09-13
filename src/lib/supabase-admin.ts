import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// If the user provided just the project ID (e.g. tclvquwsxbntvwvozeto), convert it to a full URL
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
    supabaseUrl = `https://${supabaseUrl}.supabase.co`;
}

const isValidUrl = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));

if (!isValidUrl) {
    if (typeof window === 'undefined') {
        if (process.env.NODE_ENV === 'production') {
            console.warn('⚠️ [Supabase Admin] Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Using placeholder for build.');
        }
    }
}

// Detect if service role key belongs to the current Supabase project
const isServiceRoleKeyValid = (() => {
    if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'placeholder-key') return false;
    try {
        const parts = supabaseServiceRoleKey.split('.');
        if (parts.length >= 2) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            if (payload?.ref && supabaseUrl && !supabaseUrl.includes(payload.ref)) {
                console.warn(`⚠️ [Supabase Admin] Key ref mismatch: key is for "${payload.ref}" but URL is "${supabaseUrl}". Falling back to anon key.`);
                return false;
            }
        }
        return true;
    } catch {
        return false;
    }
})();

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'placeholder-key';

// Use service role key if valid; otherwise gracefully fall back to anon key so public operations (like referral creation) still work!
const activeKey = isServiceRoleKeyValid ? supabaseServiceRoleKey : supabaseAnonKey;

export const supabaseAdmin = createClient(
    (isValidUrl ? supabaseUrl : 'https://placeholder.supabase.co') as string,
    activeKey as string,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
