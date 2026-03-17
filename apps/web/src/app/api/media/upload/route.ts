import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

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

        // 1. Validate URL
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

        // 2. Fetch the image from the provider
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15_000);

        const imageResponse = await fetch(outerImageUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (!imageResponse.ok) {
            return NextResponse.json({ error: 'Failed to download image from provider' }, { status: 502 });
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_IMAGE_SIZE) {
            return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 413 });
        }

        const buffer = Buffer.from(arrayBuffer);
        const contentType = imageResponse.headers.get('content-type') || 'image/png';

        // 3. Prepare Supabase Client
        const supabase = await createClient();
        
        // Generate a unique filename
        const hash = crypto.createHash('sha256').update(`${outerImageUrl}-${Date.now()}`).digest('hex');
        const extension = contentType.split('/')[1]?.replace(/[^a-z0-9]/g, '') || 'png';
        const filename = `${hash}.${extension}`;

        // 4. Upload to Supabase Storage Bucket 'media'
        const { data, error: uploadError } = await supabase.storage
            .from('media')
            .upload(filename, buffer, {
                contentType,
                upsert: true
            });

        if (uploadError) {
            console.error('[Supabase Storage Error]', uploadError);
            return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 });
        }

        // 5. Get the Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filename);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            metadata: { 
                model, 
                provider: parsedUrl.hostname,
                savedAt: new Date().toISOString() 
            }
        });

    } catch (error) {
        console.error('[Media Upload Error]', error);
        return NextResponse.json({ error: 'Failed to process media' }, { status: 500 });
    }
}
