import { NextResponse } from 'next/server';

const IMAGE_GEN_STATUS_API_URL = process.env.NANOBANANA_STATUS_API_URL || 'https://api.nanobanana.com/v1/jobs';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;
        const apiKey = process.env.NANOBANANA_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Image generation API key is not configured' },
                { status: 500 }
            );
        }

        // Ping the generation provider to get the current status of the job
        const response = await fetch(`${IMAGE_GEN_STATUS_API_URL}/${jobId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: 'Failed to fetch job status', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Standardize the output format for the frontend
        // Possible statuses: 'pending', 'processing', 'completed', 'failed'
        const status = data.status || 'processing';
        const progress = data.progress || 0;
        const images = data.images || data.urls || (data.output ? [data.output] : []);

        return NextResponse.json({
            jobId,
            status,
            progress,
            images,
        });
    } catch (error: any) {
        console.error('[Image Generation Status Proxy Error]', error);
        return NextResponse.json(
            { error: 'Failed to check generation status', details: error.message },
            { status: 500 }
        );
    }
}
