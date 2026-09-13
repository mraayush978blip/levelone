-- =========================================================================
-- LEVELONE REFERRAL SYSTEM DATABASE SCHEMA
-- =========================================================================

-- 1. Create table for Referral Code Creators (Influencers / Students / Ambassadors)
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,                -- e.g. AAYUSH10, LEVEL99, etc.
    creator_name TEXT NOT NULL,
    creator_email TEXT NOT NULL,
    creator_phone VARCHAR(20) NOT NULL,
    creator_college TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by referral code
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(LOWER(code));
CREATE INDEX IF NOT EXISTS idx_referral_codes_phone ON public.referral_codes(creator_phone);

-- 2. Create table for Referral Usages / Student Conversions
-- NOTE: An entry is ONLY inserted here after successful payment verification!
CREATE TABLE IF NOT EXISTS public.referral_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_code_id UUID REFERENCES public.referral_codes(id) ON DELETE CASCADE,
    referral_code VARCHAR(30) NOT NULL,
    referred_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    referred_student_name TEXT NOT NULL,
    referred_student_email TEXT NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 149.00,
    payment_id TEXT,                                 -- Razorpay / Cashfree Payment ID
    payment_status VARCHAR(20) DEFAULT 'paid',       -- 'paid' ensures only actual conversions count
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_referral UNIQUE (referred_user_id) -- 1 user can only be referred once
);

-- Index for fast search when code owner checks their activity
CREATE INDEX IF NOT EXISTS idx_referral_usages_code ON public.referral_usages(LOWER(referral_code));
CREATE INDEX IF NOT EXISTS idx_referral_usages_created ON public.referral_usages(created_at DESC);

-- 3. Add referral_code column to public.users (to know who used what code)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'used_referral_code'
    ) THEN
        ALTER TABLE public.users ADD COLUMN used_referral_code VARCHAR(30) DEFAULT NULL;
    END IF;
END $$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_usages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check or create a referral code (public feature)
DROP POLICY IF EXISTS "Allow public select on referral_codes" ON public.referral_codes;
CREATE POLICY "Allow public select on referral_codes" 
ON public.referral_codes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on referral_codes" ON public.referral_codes;
CREATE POLICY "Allow public insert on referral_codes" 
ON public.referral_codes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on referral_codes" ON public.referral_codes;
CREATE POLICY "Service role full access on referral_codes" 
ON public.referral_codes FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on referral_usages" ON public.referral_usages;
CREATE POLICY "Service role full access on referral_usages" 
ON public.referral_usages FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow public read on referral usages for tracking activity
DROP POLICY IF EXISTS "Allow public select on referral_usages" ON public.referral_usages;
CREATE POLICY "Allow public select on referral_usages"
ON public.referral_usages FOR SELECT USING (true);

-- 5. Create a secure view for Code Owners to check their activity
CREATE OR REPLACE VIEW public.referral_activity_view AS
SELECT 
    rc.code AS referral_code,
    rc.creator_name,
    ru.referred_student_name,
    ru.created_at AS joined_at
FROM public.referral_codes rc
LEFT JOIN public.referral_usages ru 
    ON LOWER(rc.code) = LOWER(ru.referral_code)
WHERE ru.payment_status = 'paid'
ORDER BY ru.created_at DESC;

-- 6. Create an Admin Summary View for the Admin Dashboard
CREATE OR REPLACE VIEW public.admin_referral_summary AS
SELECT 
    rc.id,
    rc.code,
    rc.creator_name,
    rc.creator_phone,
    rc.creator_email,
    rc.creator_college,
    rc.created_at AS code_created_at,
    COUNT(ru.id) AS total_paid_students,
    COALESCE(SUM(ru.amount_paid), 0) AS total_revenue_generated
FROM public.referral_codes rc
LEFT JOIN public.referral_usages ru 
    ON rc.id = ru.referral_code_id AND ru.payment_status = 'paid'
GROUP BY rc.id, rc.code, rc.creator_name, rc.creator_phone, rc.creator_email, rc.creator_college, rc.created_at
ORDER BY total_paid_students DESC, rc.created_at DESC;

-- =========================================================================
-- 7. Platform Settings (Dynamic Batch Pricing, Discounts, Gateway Fees)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read so signup page and APIs can fetch the latest batch pricing
DROP POLICY IF EXISTS "Allow public read on app_settings" ON public.app_settings;
CREATE POLICY "Allow public read on app_settings" ON public.app_settings
FOR SELECT USING (true);

-- Allow admins full access to update pricing
DROP POLICY IF EXISTS "Allow service role full access on app_settings" ON public.app_settings;
CREATE POLICY "Allow service role full access on app_settings" ON public.app_settings
FOR ALL USING (true) WITH CHECK (true);

-- Seed default pricing settings
INSERT INTO public.app_settings (key, value, description)
VALUES 
    ('batch_pricing', '{"original_price": 250, "offer_price": 149, "gateway_fee": 3, "batch_name": "LevelOne Webdev Cohort", "discount_label": "40% OFF LAUNCH"}'::jsonb, 'Dynamic batch pricing configuration managed by admin')
ON CONFLICT (key) DO NOTHING;

