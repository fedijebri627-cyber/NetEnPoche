import { NextResponse } from 'next/server';
import { renderToStream, type DocumentProps } from '@react-pdf/renderer';
import { BilanTemplate } from '@/lib/pdf/BilanTemplate';
import { createServerClient } from '@/lib/supabase/server';
import React from 'react';
import { getBusinessAccountProfile } from '@/lib/account/profile';

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return new NextResponse('Unauthorized', { status: 401 });

        const body = await req.json();
        const { entries, config } = body;

        const profile = await getBusinessAccountProfile(user);
        const isPro = profile.subscription_tier === 'pro' || profile.subscription_tier === 'expert';

        const document = React.createElement(BilanTemplate, {
            entries,
            config,
            userMeta: {
                name: profile.full_name || user.user_metadata?.full_name || 'Entrepreneur',
                email: user.email || '',
                siret: profile.siret || undefined,
                businessName: profile.business_name || undefined,
            },
            isPro,
        }) as unknown as React.ReactElement<DocumentProps>;

        const stream = await renderToStream(document);

        const readableStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (error) => controller.error(error));
            },
        });

        const currentYear = new Date().getFullYear();

        return new NextResponse(readableStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="NetEnPoche-Bilan-${currentYear}.pdf"`,
            },
        });
    } catch (error: unknown) {
        console.error('PDF Gen Error', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}