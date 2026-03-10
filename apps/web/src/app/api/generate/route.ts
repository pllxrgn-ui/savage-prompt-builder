import { NextResponse } from 'next/server';

// Placeholder URL for NanoBanana Pro API or similar image generation service
const IMAGE_GEN_API_URL = process.env.NANOBANANA_API_URL || 'https://api.nanobanana.com/v1/generate';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, model, count = 1, aspectRatio = '1:1', negativePrompt } = body;

        const apiKey = process.env.NANOBANANA_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Image generation API key is not configured' },
                { status: 500 }
            );
        }

        // Proxy the request to the upstream image generation API
        const response = await fetch(IMAGE_GEN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt,
                negative_prompt: negativePrompt,
                model: model || 'nanobanana-pro',
                n: count,
                aspect_ratio: aspectRatio,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: 'Image generation failed upstream', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Standardize the response format: { images: ["url1", "url2"] }
        // Note: You will need to adjust this depending on the exact shape of NanoBanana's API response
        const images = data.images || data.urls || (data.output ? [data.output] : []);

        return NextResponse.json({ success: true, images });
    } catch (error: any) {
        console.error('[Image Generation Proxy Error]', error);
        return NextResponse.json(
            { error: 'Failed to process image generation request', details: error.message },
            { status: 500 }
        );
    }
}
