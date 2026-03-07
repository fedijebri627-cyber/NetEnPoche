import { Text, Section, Row, Column } from '@react-email/components';
import { BaseAlertEmail } from './BaseAlertEmail';
import * as React from 'react';

interface OverdueInvoiceEmailProps {
    userName: string;
    overdueCount: number;
    totalAmount: number;
    invoices: {
        clientName: string;
        amount: number;
        dueDate: string;
    }[];
}

export const OverdueInvoiceEmail = ({
    userName = 'Entrepreneur',
    overdueCount = 1,
    totalAmount = 1500,
    invoices = [{ clientName: 'Acme Corp', amount: 1500, dueDate: '2026-03-01' }]
}: OverdueInvoiceEmailProps) => {
    return (
        <BaseAlertEmail
            title="Facture(s) En Retard"
            previewText={`${overdueCount} facture(s) en attente de paiement.`}
            content={
                <>
                    <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#1e293b' }}>
                        Bonjour {userName},
                    </Text>
                    <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#1e293b' }}>
                        Vous avez actuellement <strong>{overdueCount} facture(s)</strong> dont la date d'échéance est dépassée, pour un montant total de <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}</strong>.
                    </Text>

                    <Section style={{ margin: '24px 0', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                        {invoices.map((inv, idx) => (
                            <Row key={idx} style={{ paddingBottom: '12px' }}>
                                <Column>
                                    <Text style={{ margin: 0, fontWeight: 'bold', color: '#0d1b35' }}>
                                        {inv.clientName}
                                    </Text>
                                    <Text style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                                        Échue le {new Date(inv.dueDate).toLocaleDateString('fr-FR')}
                                    </Text>
                                </Column>
                                <Column align="right">
                                    <Text style={{ margin: 0, fontWeight: 'bold', color: '#ef4444' }}>
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(inv.amount)}
                                    </Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Text style={{ fontSize: '14px', color: '#64748b', marginTop: '24px' }}>
                        Pensez à relancer vos clients pour maintenir une bonne trésorerie.
                    </Text>
                </>
            }
        />
    );
}

export default OverdueInvoiceEmail;
