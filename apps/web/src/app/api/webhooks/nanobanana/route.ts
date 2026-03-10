import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validate the Webhook came from our provider (NanoBanana)
        const signature = req.headers.get('x-webhook-signature');
        const webhookSecret = process.env.NANOBANANA_WEBHOOK_SECRET;

        // In production, we'd cryptographically verify the signature here to ensure security:
        // if (!verifySignature(body, signature, webhookSecret)) {
        //   return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
        // }

        const { jobId, status, images, error } = body;
        console.log(`[Webhook Received] Job: ${jobId} | Status: ${status}`);

        if (status === 'completed' && images && images.length > 0) {
            // The image finished generating asynchronously.
            // Here we would typically:
            // a) Call the Cloudflare R2 proxy to upload the remote URL to our own bucket
            // b) Insert a new row in the Supabase 'media' table mapping the result to the user
            // c) Fire off a notification via Pusher or Supabase Realtime to the frontend

            console.log(`[Webhook] Job ${jobId} completed. Images:`, images);
        } else if (status === 'failed') {
            console.error(`[Webhook] Job ${jobId} failed with error:`, error);
        }

        // Always return a 200 OK immediately so the provider knows we received it
        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('[NanoBanana Webhook Error]', error);
        return NextResponse.json(
            { error: 'Failed to process webhook payload', details: error.message },
            { status: 500 }
        );
    }
}
