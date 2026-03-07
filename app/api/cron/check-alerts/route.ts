import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { OverdueInvoiceEmail } from '@/components/emails/OverdueInvoiceEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized access to cron runner' }, { status: 401 });
    }

    const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const today = new Date().toISOString().split('T')[0];

    // 1. Find all invoices strictly overdue right now
    const { data: overdueInvoices, error } = await adminClient
        .from('invoices')
        .select('*, client:clients(name), user:users(id, email, full_name)')
        .lt('due_date', today)
        .neq('status', 'paid');

    if (error || !overdueInvoices) {
        return NextResponse.json({ error: error?.message || 'DB Error' }, { status: 500 });
    }

    // 2. Group overdue invoices by user_id
    const groupedByUser = overdueInvoices.reduce((acc, inv) => {
        if (!acc[inv.user_id]) acc[inv.user_id] = [];
        acc[inv.user_id].push(inv);
        return acc;
    }, {} as Record<string, any[]>);

    // 3. Process mailing 
    for (const [userId, invoices] of Object.entries(groupedByUser) as [string, any[]][]) {
        // Find the earliest notification to avoid spam. We rate limit to once every 7 days per user for overdue stuff.
        // We track this via the most recently updated invoice's last_alert_sent timestamp, or fallback to zero.
        const mostRecentAlert = Math.max(...invoices.map(i => new Date(i.last_alert_sent || 0).getTime()));
        const daysSinceLastAlert = (Date.now() - mostRecentAlert) / (1000 * 60 * 60 * 24);

        if (daysSinceLastAlert > 7) { // Only ping every 7 days about overdue money
            const user = invoices[0].user;
            const totalAmount = invoices.reduce((sum, i) => sum + Number(i.amount_ht), 0);
            const formatted = invoices.map(i => ({ clientName: i.client.name, amount: Number(i.amount_ht), dueDate: i.due_date }));

            await resend.emails.send({
                from: 'NetEnPoche <alertes@netenpoche.fr>',
                to: user.email,
                subject: 'Action Requise : Factures en retard de paiement',
                react: OverdueInvoiceEmail({ userName: user.full_name || 'Entrepreneur', overdueCount: invoices.length, totalAmount, invoices: formatted })
            });

            // Update safety timestamps
            const invoiceIds = invoices.map(i => i.id);
            await adminClient
                .from('invoices')
                .update({ last_alert_sent: new Date().toISOString() })
                .in('id', invoiceIds);
        }
    }

    return NextResponse.json({ success: true, processed: Object.keys(groupedByUser).length });
}
