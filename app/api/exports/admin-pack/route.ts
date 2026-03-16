import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { resolveAccountProfileWithSessionClient } from '@/lib/account/profile';
import { buildCollectionsInsight, buildClientRiskInsights, buildReservePlan, calculateCompositeNetBreakdown, formatCurrency, type InsightClient, type InsightInvoice } from '@/lib/dashboard-insights';

function escapeXml(value: unknown) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function makeRow(cells: unknown[]) {
    return `<Row>${cells.map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join('')}</Row>`;
}

function buildExcelWorkbook(params: {
    year: number;
    config: any;
    entries: any[];
    clients: InsightClient[];
    invoices: InsightInvoice[];
}) {
    const totalCA = params.entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const breakdown = calculateCompositeNetBreakdown(totalCA, params.config);
    const reserve = buildReservePlan(params.entries, params.config);
    const collections = buildCollectionsInsight(params.invoices);
    const risks = buildClientRiskInsights(params.clients, params.invoices).slice(0, 10);

    const summaryRows = [
        makeRow(['Indicateur', 'Valeur']),
        makeRow(["Chiffre d'affaires", formatCurrency(totalCA)]),
        makeRow(['URSSAF estimé', formatCurrency(breakdown.urssaf)]),
        makeRow(['IR estimé', formatCurrency(breakdown.ir)]),
        makeRow(['CFE provisionnée', formatCurrency(breakdown.cfe)]),
        makeRow(['Net réel', formatCurrency(breakdown.netReel)]),
        makeRow(['À mettre de côté', formatCurrency(reserve.totalReserve)]),
        makeRow(['Disponible à dépenser', formatCurrency(reserve.safeToSpend)]),
        makeRow(['Cash en attente', formatCurrency(collections.pendingCash)]),
        makeRow(['Cash en retard', formatCurrency(collections.overdueCash)]),
    ].join('');

    const monthRows = [
        makeRow(['Mois', 'CA', 'Notes']),
        ...params.entries.map((entry) => makeRow([entry.month, Number(entry.ca_amount || 0), entry.notes || ''])),
    ].join('');

    const clientRows = [
        makeRow(['Client', 'Part CA', 'CA total', 'Retard', 'Ticket moyen', 'Délai moyen']),
        ...risks.map((risk) => makeRow([
            risk.name,
            `${Math.round(risk.shareOfRevenue * 100)}%`,
            formatCurrency(risk.totalRevenue),
            formatCurrency(risk.overdueAmount),
            formatCurrency(risk.averageTicket),
            `${risk.averageDelay.toFixed(0)} jours`,
        ])),
    ].join('');

    const invoiceRows = [
        makeRow(['Date', 'Client', 'Montant HT', 'Statut', 'Échéance', 'Payé le']),
        ...params.invoices.map((invoice) => makeRow([
            invoice.invoice_date,
            invoice.client?.name || '',
            Number(invoice.amount_ht || 0),
            invoice.status,
            invoice.due_date,
            invoice.paid_at || '',
        ])),
    ].join('');

    return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Synthese"><Table>${summaryRows}</Table></Worksheet>
 <Worksheet ss:Name="Mensuel"><Table>${monthRows}</Table></Worksheet>
 <Worksheet ss:Name="Clients"><Table>${clientRows}</Table></Worksheet>
 <Worksheet ss:Name="Factures"><Table>${invoiceRows}</Table></Worksheet>
</Workbook>`;
}

function buildCsv(headers: string[], rows: Array<Array<string | number | null>>) {
    const lines = [headers, ...rows]
        .map((row) => row.map((value) => {
            const raw = String(value ?? '');
            return `"${raw.replace(/"/g, '""')}"`;
        }).join(';'))
        .join('\n');
    return lines;
}

export async function GET(req: Request) {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await resolveAccountProfileWithSessionClient(supabase, user);
    if (profile.subscription_tier !== 'expert') {
        return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10);
    const kind = searchParams.get('kind') || 'excel';

    const [configRes, entriesRes, clientsRes, invoicesRes] = await Promise.all([
        supabase.from('activity_config').select('*').eq('user_id', user.id).eq('year', year).maybeSingle(),
        supabase.from('monthly_entries').select('month, ca_amount, notes').eq('user_id', user.id).eq('year', year).order('month', { ascending: true }),
        supabase.from('clients').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('invoices').select('*, client:clients(name, type, email)').eq('user_id', user.id).eq('year', year).order('invoice_date', { ascending: false }),
    ]);

    if (configRes.error) return NextResponse.json({ error: configRes.error.message }, { status: 500 });
    if (entriesRes.error) return NextResponse.json({ error: entriesRes.error.message }, { status: 500 });
    if (clientsRes.error) return NextResponse.json({ error: clientsRes.error.message }, { status: 500 });
    if (invoicesRes.error) return NextResponse.json({ error: invoicesRes.error.message }, { status: 500 });

    const config = {
        year,
        activity_type: 'services_bnc',
        secondary_activity_type: null,
        secondary_activity_share: null,
        acre_enabled: false,
        versement_liberatoire: false,
        annual_ca_goal: null,
        situation_familiale: 'celibataire',
        parts_fiscales: 1,
        autres_revenus: 0,
        ...(configRes.data || {}),
    };
    const entries = entriesRes.data || [];
    const invoices = (invoicesRes.data || []) as InsightInvoice[];
    const clients = (clientsRes.data || []).map((client) => ({
        ...client,
        invoices: invoices.filter((invoice) => invoice.client_id === client.id),
    })) as InsightClient[];

    if (kind === 'excel') {
        const workbook = buildExcelWorkbook({ year, config, entries, clients, invoices });
        return new NextResponse(workbook, {
            headers: {
                'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
                'Content-Disposition': `attachment; filename="netenpoche-admin-pack-${year}.xls"`,
            },
        });
    }

    if (kind === 'bank') {
        const breakdown = calculateCompositeNetBreakdown(entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0), config);
        const csv = buildCsv(
            ['Année', 'CA', 'Net estimé', 'URSSAF', 'IR', 'CFE'],
            [[year, breakdown.caBrut, breakdown.netReel, breakdown.urssaf, breakdown.ir, breakdown.cfe]]
        );
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="netenpoche-bank-summary-${year}.csv"`,
            },
        });
    }

    if (kind === 'qonto') {
        const csv = buildCsv(
            ['Date', 'Label', 'Montant', 'Type', 'Client'],
            invoices.map((invoice) => [
                invoice.invoice_date,
                `Facture ${invoice.client?.name || invoice.client_id}`,
                Number(invoice.amount_ht || 0),
                invoice.status === 'paid' ? 'credit' : 'pending',
                invoice.client?.name || '',
            ])
        );
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="netenpoche-qonto-${year}.csv"`,
            },
        });
    }

    if (kind === 'pennylane') {
        const csv = buildCsv(
            ['Date facture', 'Client', 'Montant HT', 'Statut', 'Échéance', 'Payé le'],
            invoices.map((invoice) => [
                invoice.invoice_date,
                invoice.client?.name || '',
                Number(invoice.amount_ht || 0),
                invoice.status,
                invoice.due_date,
                invoice.paid_at || '',
            ])
        );
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="netenpoche-pennylane-${year}.csv"`,
            },
        });
    }

    const accountantCsv = buildCsv(
        ['Mois', 'CA', 'Client', 'Montant facture', 'Statut', 'Date facture', 'Échéance'],
        invoices.map((invoice) => [
            new Date(invoice.invoice_date).getMonth() + 1,
            entries.find((entry) => entry.month === new Date(invoice.invoice_date).getMonth() + 1)?.ca_amount || 0,
            invoice.client?.name || '',
            Number(invoice.amount_ht || 0),
            invoice.status,
            invoice.invoice_date,
            invoice.due_date,
        ])
    );

    return new NextResponse(accountantCsv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="netenpoche-accountant-${year}.csv"`,
        },
    });
}
