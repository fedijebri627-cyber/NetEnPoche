import React from 'react';
import { BaseAlertEmail } from './BaseAlertEmail';

interface Props { userName: string; percentage: number; remaining: number; }

export const TvaWarningEmail = ({ userName = "Entrepreneur", percentage = 85, remaining = 5500 }: Props) => (
    <BaseAlertEmail
        title="NetEnPoche - Alerte TVA"
        previewText="Attention : Seuil de franchise TVA approchant."
        userName={userName}
        message="Votre chiffre d'affaires approche dangereusement du plafond de la franchise en base de TVA. Il est temps d'anticiper la facturation de la TVA à vos clients."
        kpiLabel="Statut du Plafond TVA"
        kpiValue={`${percentage.toFixed(1)}%`}
        kpiSubtext={`Marge restante : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(remaining)}`}
        kpiColor="#e84040" // Red alert
    />
);

export default TvaWarningEmail;
