import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('stripe-signature');
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (!signature || !webhookSecret || !stripeKey) {
            return NextResponse.json({ error: 'Missing Stripe configuration or signature' }, { status: 400 });
        }

        const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as any });

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            console.error(`[Webhook Signature Verification Failed]`, err.message);
            return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
        }

        // Handle different Webhook Events
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.client_reference_id;
                const customerId = session.customer as string;

                if (userId) {
                    // Upgrade user to Pro tier and link Stripe customer
                    await db.update(users)
                        .set({ tier: 'pro', stripeCustomerId: customerId })
                        .where(eq(users.id, userId));

                    console.log(`[Stripe webhook] Upgraded user ${userId} to PRO.`);
                }
                break;
            }

            case 'customer.subscription.deleted':
            case 'customer.subscription.canceled': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Revoke Pro status when subscription is canceled
                await db.update(users)
                    .set({ tier: 'free' })
                    .where(eq(users.stripeCustomerId, customerId));

                console.log(`[Stripe webhook] Downgraded customer ${customerId} to FREE.`);
                break;
            }

            default:
                console.log(`[Stripe webhook] Unhandled event type: ${event.type}`);
        }

        // Return 200 OK
        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`[Stripe Webhook Error]`, error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
