import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db/index';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) throw new Error('Stripe is not configured in this environment');

        // Initialize Stripe
        const stripe = new Stripe(stripeKey, {
            apiVersion: '2024-12-18.acacia' as any, // Using 'any' since Stripe types update frequently
        });

        const body = await req.json().catch(() => ({}));
        const { priceId } = body;

        // Fallback to current domain
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${appUrl}/settings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/builder`,
            customer_email: user.email!,
            client_reference_id: user.id, // Binds the Stripe purchase to our Supabase user
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[Stripe Checkout Error]', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
