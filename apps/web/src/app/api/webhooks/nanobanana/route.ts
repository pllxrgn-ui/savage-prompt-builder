import { NextResponse } from 'next/server';
import crypto from 'crypto';

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
        return false;
    }
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();

        const signature = req.headers.get('x-webhook-signature');
        const webhookSecret = process.env.NANOBANANA_WEBHOOK_SECRET;

        if (!signature || !webhookSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const { jobId, status, images, error } = body;
        console.log(`[Webhook Received] Job: ${jobId} | Status: ${status}`);

        if (status === 'completed' && images && images.length > 0) {
            console.log(`[Webhook] Job ${jobId} completed. Images:`, images);
        } else if (status === 'failed') {
            console.error(`[Webhook] Job ${jobId} failed with error:`, error);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[NanoBanana Webhook Error]', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
