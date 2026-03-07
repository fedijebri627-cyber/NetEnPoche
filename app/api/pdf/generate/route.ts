import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { BilanTemplate } from '@/lib/pdf/BilanTemplate';
import { createServerClient } from '@/lib/supabase/server';
import React from 'react';

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return new NextResponse('Unauthorized', { status: 401 });

        const body = await req.json();
        const { entries, config } = body;

        const isPro = user.user_metadata?.subscription_tier === 'pro' || user.user_metadata?.subscription_tier === 'expert';

        const stream = await renderToStream(
            React.createElement(BilanTemplate, {
                entries,
                config,
                userMeta: { name: user.user_metadata?.full_name || 'Entrepreneur', email: user.email || '' },
                isPro
            }) as any
        );

        // Convert the Node stream to a Web ReadableStream
        const readableStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (err) => controller.error(err));
            }
        });

        const currentYear = new Date().getFullYear();

        return new NextResponse(readableStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="NetEnPoche-Bilan-${currentYear}.pdf"`
            }
        });

    } catch (e: any) {
        console.error("PDF Gen Error", e);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
