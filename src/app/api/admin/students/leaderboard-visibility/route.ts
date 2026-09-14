import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentIds, hide } = body;

        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return NextResponse.json({ error: 'studentIds array is required' }, { status: 400 });
        }

        const willHide = Boolean(hide);

        const { data, error } = await supabaseAdmin
            .from('users')
            .update({ is_hidden_from_leaderboard: willHide })
            .in('id', studentIds)
            .select('id, is_hidden_from_leaderboard');

        if (error) {
            console.error('[Admin Leaderboard Visibility Update Error]:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            updatedCount: data?.length ?? studentIds.length,
            hide: willHide,
        });
    } catch (err: any) {
        console.error('[Admin Leaderboard Visibility API Error]:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
