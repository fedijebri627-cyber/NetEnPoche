import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text, Button } from '@react-email/components';
import * as React from 'react';

interface UrssafReminderEmailProps {
    userName: string;
    amount: number;
    dueDate: string;
    dashboardUrl: string;
}

export const UrssafReminderEmail = ({
    userName = "Entrepreneur",
    amount = 0,
    dueDate = "Bientôt",
    dashboardUrl = "https://netenpoche.fr/dashboard",
}: UrssafReminderEmailProps) => (
    <Html>
        <Head />
        <Preview>Rappel : Échéance URSSAF à venir</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={heading}>NetEnPoche</Heading>
                </Section>
                <Section style={bodySection}>
                    <Text style={paragraph}>Bonjour {userName},</Text>
                    <Text style={paragraph}>
                        Ceci est un rappel automatique pour votre prochaine échéance URSSAF.
                    </Text>

                    <Section style={kpiBox}>
                        <Text style={kpiLabel}>Montant estimé à payer :</Text>
                        <Text style={kpiValue}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)}</Text>
                        <Text style={kpiSubtext}>Avant le {dueDate}</Text>
                    </Section>

                    <Button style={button} href={dashboardUrl}>
                        Voir mon tableau de bord →
                    </Button>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Vous recevez cet email car vous avez activé les alertes URSSAF sur votre espace NetEnPoche Pro.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

const main = { backgroundColor: '#f8fafc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '40px auto', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', maxWidth: '600px' };
const header = { backgroundColor: '#0d1b35', padding: '30px' };
const heading = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: '0', textAlign: 'center' as const };
const bodySection = { padding: '30px' };
const paragraph = { color: '#475569', fontSize: '16px', lineHeight: '24px', marginBottom: '16px' };
const kpiBox = { backgroundColor: '#f1f5f9', padding: '24px', borderRadius: '8px', textAlign: 'center' as const, margin: '24px 0' };
const kpiLabel = { color: '#64748b', fontSize: '14px', margin: '0 0 8px 0', textTransform: 'uppercase' as const, letterSpacing: '1px', fontWeight: 'bold' };
const kpiValue = { color: '#0d1b35', fontSize: '32px', margin: '0', fontWeight: '900' };
const kpiSubtext = { color: '#00c875', fontSize: '14px', margin: '8px 0 0 0', fontWeight: 'bold' };
const button = { backgroundColor: '#00c875', color: '#ffffff', padding: '16px 24px', borderRadius: '8px', textDecoration: 'none', display: 'block', textAlign: 'center' as const, fontWeight: 'bold', margin: '32px 0' };
const hr = { borderColor: '#e2e8f0', margin: '32px 0' };
const footer = { color: '#94a3b8', fontSize: '12px', textAlign: 'center' as const };

export default UrssafReminderEmail;
