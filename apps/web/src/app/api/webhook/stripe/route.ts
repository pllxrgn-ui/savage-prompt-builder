import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Simple in-memory idempotency guard against webhook replays.
// In production, use a database table or Redis for persistence across deploys.
const processedEvents = new Set<string>();
const MAX_PROCESSED_EVENTS = 1000;

// Credit amounts per tier
const PRO_CREDITS = 1000;  // Credits granted upon Pro upgrade
const FREE_CREDITS = 100;  // Credits restored when downgraded

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
            return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
        }

        // Idempotency check — skip already-processed events
        if (processedEvents.has(event.id)) {
            return NextResponse.json({ received: true, duplicate: true });
        }
        processedEvents.add(event.id);
        // Prevent unbounded memory growth
        if (processedEvents.size > MAX_PROCESSED_EVENTS) {
            const first = processedEvents.values().next().value;
            if (first) processedEvents.delete(first);
        }

        // Handle different Webhook Events
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.client_reference_id;
                const customerId = session.customer as string;

                if (userId) {
                    // Upgrade user to Pro tier, link Stripe customer, and refill credits
                    await db.update(users)
                        .set({ 
                            tier: 'pro', 
                            stripeCustomerId: customerId,
                            credits: PRO_CREDITS,  // Refill credits on upgrade
                        })
                        .where(eq(users.id, userId));

                    console.log(`[Stripe webhook] Upgraded user ${userId} to PRO with ${PRO_CREDITS} credits.`);
                }
                break;
            }

            case 'customer.subscription.deleted':
            // @ts-expect-error -- Stripe SDK removed this event type but Stripe still sends it
            case 'customer.subscription.canceled': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Revoke Pro status and reset credits to free-tier amount
                await db.update(users)
                    .set({ 
                        tier: 'free',
                        credits: FREE_CREDITS,  // Reset credits on downgrade
                    })
                    .where(eq(users.stripeCustomerId, customerId));

                console.log(`[Stripe webhook] Downgraded customer ${customerId} to FREE with ${FREE_CREDITS} credits.`);
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

