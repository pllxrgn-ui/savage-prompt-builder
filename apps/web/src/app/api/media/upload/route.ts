import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3Client = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

/** Whitelist of trusted image provider domains */
const ALLOWED_IMAGE_DOMAINS = [
    'api.nanobanana.com',
    'cdn.nanobanana.com',
    'images.nanobanana.com',
    'api.replicate.com',
    'replicate.delivery',
    'oaidalleapiprodscus.blob.core.windows.net',
    'images.cdn.openai.com',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
    try {
        const { outerImageUrl, promptId, model } = await req.json();

        if (!outerImageUrl || typeof outerImageUrl !== 'string') {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        // Validate URL to prevent SSRF
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(outerImageUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        if (parsedUrl.protocol !== 'https:') {
            return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 400 });
        }

        if (!ALLOWED_IMAGE_DOMAINS.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith(`.${d}`))) {
            return NextResponse.json({ error: 'Untrusted image source' }, { status: 403 });
        }

        // Fetch with timeout and size limit
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15_000);

        const imageResponse = await fetch(outerImageUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (!imageResponse.ok) {
            return NextResponse.json({ error: 'Failed to download image' }, { status: 502 });
        }

        const contentLength = parseInt(imageResponse.headers.get('content-length') || '0', 10);
        if (contentLength > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 413 });
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 413 });
        }

        const buffer = Buffer.from(arrayBuffer);
        const contentType = imageResponse.headers.get('content-type') || 'image/png';

        // Only allow image content types
        if (!contentType.startsWith('image/')) {
            return NextResponse.json({ error: 'Response is not an image' }, { status: 400 });
        }

        const hash = crypto.createHash('sha256').update(`${outerImageUrl}-${Date.now()}`).digest('hex');
        const extension = contentType.split('/')[1]?.replace(/[^a-z0-9]/g, '') || 'png';
        const filename = `generated/${hash}.${extension}`;

        const s3Command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: contentType,
        });

        await s3Client.send(s3Command);

        const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;
        const permanentUrl = `${publicDomain}/${filename}`;

        return NextResponse.json({
            success: true,
            url: permanentUrl,
            metadata: { model, savedAt: new Date().toISOString() }
        });

    } catch (error) {
        console.error('[Media Upload Error]', error);
        return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
}
