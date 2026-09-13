import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_PRICING = {
    original_price: 250,
    offer_price: 149,
    gateway_fee: 3,
    batch_name: 'LevelOne Webdev Cohort',
    discount_label: '40% OFF LAUNCH',
    total_amount: 152,
};

// GET: Fetch current batch pricing settings
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('app_settings')
            .select('value')
            .eq('key', 'batch_pricing')
            .maybeSingle();

        if (error || !data?.value) {
            return NextResponse.json(DEFAULT_PRICING);
        }

        const pricing = data.value;
        const offerPrice = Number(pricing.offer_price) || 149;
        const gatewayFee = Number(pricing.gateway_fee) || 3;

        return NextResponse.json({
            ...pricing,
            total_amount: offerPrice + gatewayFee,
        });
    } catch {
        return NextResponse.json(DEFAULT_PRICING);
    }
}

// POST: Update batch pricing (Admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { original_price, offer_price, gateway_fee, batch_name, discount_label } = body;

        const originalPriceNum = Number(original_price) || 250;
        const offerPriceNum = Number(offer_price) || 149;
        const gatewayFeeNum = Number(gateway_fee) >= 0 ? Number(gateway_fee) : 3;

        const updatedPricing = {
            original_price: originalPriceNum,
            offer_price: offerPriceNum,
            gateway_fee: gatewayFeeNum,
            batch_name: (batch_name || 'LevelOne Webdev Cohort').trim(),
            discount_label: (discount_label || 'LAUNCH OFFER').trim(),
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabaseAdmin
            .from('app_settings')
            .upsert({
                key: 'batch_pricing',
                value: updatedPricing,
                description: 'Dynamic batch pricing configuration managed by admin',
                updated_at: new Date().toISOString(),
            });

        if (error) {
            console.error('[Admin Batch Pricing Update Error]:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            pricing: {
                ...updatedPricing,
                total_amount: offerPriceNum + gatewayFeeNum,
            },
        });
    } catch (err: any) {
        console.error('[Admin Pricing API Error]:', err);
        return NextResponse.json({ error: err.message || 'Failed to update pricing' }, { status: 500 });
    }
}
