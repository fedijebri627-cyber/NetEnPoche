import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text, Button } from '@react-email/components';
import * as React from 'react';

interface AlertEmailLayoutProps {
    title: string;
    previewText: string;
    userName?: string;
    message?: string;
    kpiLabel?: string;
    kpiValue?: string;
    kpiSubtext?: string;
    kpiColor?: string;
    content?: React.ReactNode;
}

const main = { backgroundColor: '#f8fafc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '40px auto', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', maxWidth: '600px' };
const header = { backgroundColor: '#0d1b35', padding: '30px' };
const heading = { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: '0', textAlign: 'center' as const };
const bodySection = { padding: '30px' };
const paragraph = { color: '#475569', fontSize: '16px', lineHeight: '24px', marginBottom: '16px' };
const kpiBox = { backgroundColor: '#f1f5f9', padding: '24px', borderRadius: '8px', textAlign: 'center' as const, margin: '24px 0' };
const kpiLabelStyle = { color: '#64748b', fontSize: '14px', margin: '0 0 8px 0', textTransform: 'uppercase' as const, letterSpacing: '1px', fontWeight: 'bold' };
const button = { backgroundColor: '#00c875', color: '#ffffff', padding: '16px 24px', borderRadius: '8px', textDecoration: 'none', display: 'block', textAlign: 'center' as const, fontWeight: 'bold', margin: '32px 0' };
const hr = { borderColor: '#e2e8f0', margin: '32px 0' };
const footer = { color: '#94a3b8', fontSize: '12px', textAlign: 'center' as const };

export const BaseAlertEmail = ({
    title, previewText, userName, message, kpiLabel, kpiValue, kpiSubtext, kpiColor = '#0d1b35', content
}: AlertEmailLayoutProps) => {
    const kpiValueStyle = { color: kpiColor, fontSize: '32px', margin: '0', fontWeight: '900' };
    const kpiSubtextStyle = { color: kpiColor, fontSize: '14px', margin: '8px 0 0 0', fontWeight: 'bold' };

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={heading}>{title}</Heading>
                    </Section>
                    <Section style={bodySection}>
                        {content ? (
                            content
                        ) : (
                            <>
                                <Text style={paragraph}>Bonjour {userName},</Text>
                                <Text style={paragraph}>{message}</Text>

                                <Section style={kpiBox}>
                                    <Text style={kpiLabelStyle}>{kpiLabel}</Text>
                                    <Text style={kpiValueStyle}>{kpiValue}</Text>
                                    {kpiSubtext && <Text style={kpiSubtextStyle}>{kpiSubtext}</Text>}
                                </Section>
                            </>
                        )}

                        <Button style={button} href="https://netenpoche.fr/dashboard">
                            Voir mon tableau de bord →
                        </Button>
                        <Hr style={hr} />
                        <Text style={footer}>
                            Vous recevez cet email car vous avez activé cette alerte sur votre espace NetEnPoche Pro.
                            Vous pouvez modifier vos préférences dans l'onglet "Alertes" des réglages.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BaseAlertEmail;
