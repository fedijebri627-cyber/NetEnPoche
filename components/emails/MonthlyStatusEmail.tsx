import React from 'react';
import { BaseAlertEmail } from './BaseAlertEmail';

interface Props { userName: string; month: string; amount: number; isMissing: boolean; }

export const MonthlyStatusEmail = ({ userName = "Entrepreneur", month = "Mars", amount = 0, isMissing = false }: Props) => (
    <BaseAlertEmail
        title="NetEnPoche - Suivi Mensuel"
        previewText={isMissing ? `Oubli : Déclarez votre CA de ${month}` : `Alerte : Baisse de revenus en ${month}`}
        userName={userName}
        message={isMissing
            ? `Nous sommes le 10 du mois et vous n'avez pas encore saisi votre Chiffre d'Affaires pour le mois de ${month}. Maintenez votre tableau de bord à jour pour des prévisions URSSAF précises.`
            : `Votre Chiffre d'Affaires de ${month} est exceptionnellement bas par rapport à votre moyenne habituelle (Baisse de ${amount.toFixed(0)}%). Assurez-vous d'avoir bien facturé tous vos clients.`}
        kpiLabel={isMissing ? "Action requise" : "Variation détectée"}
        kpiValue={isMissing ? `Mois manquant : ${month}` : `-${amount}%`}
        kpiColor="#f5a623" // Amber for warnings
    />
);

export default MonthlyStatusEmail;
