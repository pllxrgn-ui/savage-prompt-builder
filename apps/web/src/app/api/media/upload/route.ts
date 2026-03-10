import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

// Setup connection to Cloudflare R2 (or AWS S3)
const s3Client = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(req: Request) {
    try {
        const { outerImageUrl, promptId, model } = await req.json();

        if (!outerImageUrl) {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        // 1. Download the image from the external provider URL securely onto our server
        const imageResponse = await fetch(outerImageUrl);
        if (!imageResponse.ok) throw new Error('Failed to download from external provider');

        // We get it as a buffer
        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = imageResponse.headers.get('content-type') || 'image/png';

        // 2. Generate a unique filename using crypto
        const hash = crypto.createHash('sha256').update(`${outerImageUrl}-${Date.now()}`).digest('hex');
        const extension = contentType.split('/')[1] || 'png';
        const filename = `generated/${hash}.${extension}`;

        // 3. Upload to our own Cloudflare R2 / AWS S3 bucket
        const s3Command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: contentType,
        });

        await s3Client.send(s3Command);

        // 4. Return our newly created secure, permanent public URL
        const publicDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN; // e.g., https://media.yourdomain.com
        const permanentUrl = `${publicDomain}/${filename}`;

        // Normally at this step, we'd also insert this directly into our Supabase Database
        // but the actual DB insertion might be handled on the frontend via the /api/media route instead

        return NextResponse.json({
            success: true,
            url: permanentUrl,
            metadata: { originalUrl: outerImageUrl, model, savedAt: new Date().toISOString() }
        });

    } catch (error: any) {
        console.error('[Media Upload Error]', error);
        return NextResponse.json(
            { error: 'Failed to upload media to cloud storage', details: error.message },
            { status: 500 }
        );
    }
}
