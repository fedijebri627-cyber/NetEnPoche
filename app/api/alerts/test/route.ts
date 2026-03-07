import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerClient } from '@/lib/supabase/server';
import { UrssafReminderEmail } from '@/components/emails/UrssafReminderEmail';
import { TvaWarningEmail } from '@/components/emails/TvaWarningEmail';
import { MonthlyStatusEmail } from '@/components/emails/MonthlyStatusEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    console.log("TEST ROUTE ACCESSED");
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { alert_type } = await req.json();

    try {
        let reactComponent;
        let subject = "Test Alerte NetEnPoche";

        // Route the correct template
        switch (alert_type) {
            case 'urssaf_reminder':
                subject = "Rappel : Échéance URSSAF à venir";
                reactComponent = UrssafReminderEmail({ userName: user.user_metadata?.full_name || 'Utilisateur', amount: 1250.45, dueDate: '30 Avril', dashboardUrl: 'https://netenpoche.fr/dashboard' });
                break;
            case 'tva_threshold':
                subject = "Alerte : Seuil de franchise TVA approchant";
                reactComponent = TvaWarningEmail({ userName: user.user_metadata?.full_name || 'Utilisateur', percentage: 92, remaining: 1540 });
                break;
            case 'monthly_drop':
                subject = "Alerte : Baisse de revenus détectée";
                reactComponent = MonthlyStatusEmail({ userName: user.user_metadata?.full_name || 'Utilisateur', month: 'Juin', amount: 35, isMissing: false });
                break;
            case 'missing_entry':
                subject = "Action requise : Déclarez votre CA mensuel";
                reactComponent = MonthlyStatusEmail({ userName: user.user_metadata?.full_name || 'Utilisateur', month: 'Juillet', amount: 0, isMissing: true });
                break;
            default:
                return NextResponse.json({ error: `Type ${alert_type} non implémenté pour le test.` }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: 'NetEnPoche <alertes@netenpoche.fr>', // Must be a verified domain in Resend
            to: [user.email!],
            subject: "[TEST] " + subject,
            react: reactComponent,
        });

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
