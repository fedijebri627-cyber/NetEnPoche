'use client';

import { useState } from 'react';

const faqData = [
    {
        question: "NetEnPoche est-il officiel ou affilié à l'URSSAF ?",
        answer: "Non. NetEnPoche est un outil indépendant, créé par un entrepreneur pour les entrepreneurs. Les calculs sont basés sur les taux et barèmes officiels 2026, mais le service n'est pas affilié à l'URSSAF, à la DGFiP, ni à aucun organisme gouvernemental. Il s'agit d'un outil d'estimation, non d'un acte comptable officiel."
    },
    {
        question: "Mes données financières sont-elles en sécurité ?",
        answer: "Toutes les données sont chiffrées en transit (SSL/TLS) et au repos. Vos données ne sont jamais vendues ni partagées avec des tiers. Vous pouvez supprimer votre compte et toutes vos données à tout moment depuis les paramètres."
    },
    {
        question: "Puis-je annuler mon abonnement Pro à tout moment ?",
        answer: "Oui, sans engagement ni frais d'annulation. Vous pouvez annuler en un clic depuis votre compte. Vous conservez l'accès Pro jusqu'à la fin de la période payée."
    },
    {
        question: "Le calcul IR est-il fiable pour ma déclaration ?",
        answer: "L'estimateur IR est un outil de simulation basé sur le barème progressif 2026. Il donne une estimation fiable pour la planification financière, mais ne remplace pas une déclaration officielle ou l'avis d'un expert-comptable pour des situations fiscales complexes (revenus mixtes, crédits d'impôt spécifiques, etc.)."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section" id="faq">
            <div style={{ textAlign: 'center' }}>
                <div className="section-eyebrow" style={{ textAlign: 'center' }}>FAQ</div>
                <h2 className="section-title" style={{ textAlign: 'center' }}>Questions fréquentes</h2>
            </div>

            <div className="faq-list">
                {faqData.map((item, index) => (
                    <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                        <div className="faq-q" onClick={() => toggle(index)}>
                            {item.question}
                            <span className="faq-chevron">▾</span>
                        </div>
                        <div className="faq-a" style={{ display: openIndex === index ? 'block' : 'none' }}>
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
