import { Page, Text, View, Document, StyleSheet, Svg, Rect, Line, G, Image } from '@react-pdf/renderer';
import { ActivityConfig, MonthlyEntry } from '@/contexts/DashboardContext';
import { calculateUrssaf, calculateIR } from '@/lib/calculations';

const MONTHS = ['Janvier', 'F\u00e9vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao\u00fbt', 'Septembre', 'Octobre', 'Novembre', 'D\u00e9cembre'];
const SHORT_MONTHS = ['Jan', 'F\u00e9v', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Ao\u00fb', 'Sep', 'Oct', 'Nov', 'D\u00e9c'];
const ACTIVITY_LABELS: Record<string, string> = {
    services_bic: 'Prestations de services (BIC)',
    services_bnc: 'Prestations de services (BNC)',
    liberal: 'Profession lib\u00e9rale',
    vente: 'Vente de marchandises',
    prestations_services: 'Prestation de services',
    vente_marchandises: 'Vente de marchandises',
};
const URSSAF_RATES: Record<string, number> = {
    services_bic: 21.2,
    services_bnc: 23.2,
    liberal: 24.6,
    vente: 12.3,
    prestations_services: 21.1,
    vente_marchandises: 12.3,
};

const s = StyleSheet.create({
    page: { backgroundColor: '#ffffff', paddingTop: 30, paddingBottom: 60, paddingHorizontal: 40, fontFamily: 'Helvetica', fontSize: 10 },
    pageTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#92400e', marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 12 },
    infoLine: { fontSize: 10, color: '#4b5563', marginBottom: 4 },
    summaryTable: { flexDirection: 'row', borderWidth: 1, borderColor: '#1e293b', marginTop: 20, marginBottom: 25 },
    summaryCell: { flex: 1, borderRightWidth: 1, borderRightColor: '#1e293b', padding: 10, alignItems: 'center' },
    summaryCellLast: { flex: 1, padding: 10, alignItems: 'center' },
    summaryHeader: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 6, textAlign: 'center' },
    summaryValueBlack: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e293b', textAlign: 'center' },
    summaryValueRed: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ef4444', textAlign: 'center' },
    summaryValueGold: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#f59e0b', textAlign: 'center' },
    summaryValueGreen: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#10b981', textAlign: 'center' },
    detailTable: { marginTop: 10 },
    detailHeaderRow: { flexDirection: 'row', backgroundColor: '#1e293b' },
    detailHeaderCell: { padding: 8, fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#ffffff', textAlign: 'center' },
    detailRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#d1d5db' },
    detailRowAlt: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#d1d5db', backgroundColor: '#f8fafc' },
    detailCellMonth: { padding: 7, fontSize: 9, color: '#1e293b', textAlign: 'center' },
    detailCellNum: { padding: 7, fontSize: 9, color: '#1e293b', textAlign: 'right' },
    col1: { width: '25%' },
    col2: { width: '25%' },
    col3: { width: '25%' },
    col4: { width: '25%' },
    chartTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 15 },
    noticeTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 8 },
    noticeText: { fontSize: 9, color: '#4b5563', lineHeight: 1.6 },
    footer: { position: 'absolute', bottom: 25, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    footerLeft: { fontSize: 8, color: '#94a3b8', fontStyle: 'italic' },
    footerRight: { fontSize: 8, color: '#94a3b8' },
    footerIcon: { fontSize: 14, color: '#94a3b8', marginBottom: 2 },
});

const LABELS = {
    annualTitle: 'Bilan Financier Annuel',
    notProvided: 'Non renseign\u00e9',
    activity: 'Type d\'activit\u00e9',
    monthlyDetail: 'D\u00e9tail Mensuel',
    footer: 'G\u00e9n\u00e9r\u00e9 par NetEnPoche - Document non-officiel, \u00e0 titre informatif',
    notice: 'Ce document constitue un bilan analytique de votre activit\u00e9 g\u00e9n\u00e9r\u00e9e sur NetEnPoche. Il n\'a pas de valeur comptable officielle. Vous devez d\u00e9clarer ces montants sur votre espace mensuel ou trimestriel URSSAF.',
};

const fmt = (val: number) => {
    const parts = val.toFixed(2).split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${intPart}.${parts[1]} EUR`;
};

interface BilanTemplateProps {
    entries: MonthlyEntry[];
    config: ActivityConfig;
    userMeta: { name: string; email: string; siret?: string; businessName?: string };
    isPro: boolean;
}

export const BilanTemplate = ({ entries, config, userMeta }: BilanTemplateProps) => {
    const sortedEntries = [...entries].sort((a, b) => a.month - b.month);

    const totalCA = sortedEntries.reduce((acc, e) => acc + e.ca_amount, 0);
    const totalUrssaf = calculateUrssaf(totalCA, config.activity_type, config.acre_enabled);
    const irResult = calculateIR({
        ca: totalCA,
        activityType: config.activity_type,
        versementLiberatoire: config.versement_liberatoire,
        situationFamiliale: config.situation_familiale || 'celibataire',
        parts: config.parts_fiscales || 1,
        autresRevenus: config.autres_revenus || 0,
    });
    const netDisponible = totalCA - totalUrssaf - irResult.irEstime;
    const urssafRate = URSSAF_RATES[config.activity_type] || 21.1;

    const maxCA = Math.max(...sortedEntries.map((entry) => entry.ca_amount), 1);
    const barMaxHeight = 140;
    const barWidth = 30;
    const barGap = 10;

    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Image
                        src="https://www.netenpoche.fr/brand/netenpoche-icon-1024.png"
                        style={{ width: 60, height: 60, borderRadius: 12, marginBottom: 10 }}
                    />
                    <Text style={{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#0d1b35' }}>NetEnPoche</Text>
                </View>

                <Text style={s.sectionTitle}>{LABELS.annualTitle}</Text>
                <Text style={s.infoLine}>Auto-Entrepreneur : {userMeta.businessName || userMeta.name || userMeta.email}</Text>
                <Text style={s.infoLine}>SIRET : {userMeta.siret ? `${userMeta.siret.slice(0, 3)} ${userMeta.siret.slice(3, 6)} ${userMeta.siret.slice(6, 9)} ${userMeta.siret.slice(9)}` : LABELS.notProvided}</Text>
                <Text style={s.infoLine}>{LABELS.activity} : {ACTIVITY_LABELS[String(config.activity_type)] || 'Activit\u00e9'}</Text>
                <Text style={s.infoLine}>Taux URSSAF : {urssafRate} %</Text>

                <View style={s.summaryTable}>
                    <View style={s.summaryCell}>
                        <Text style={s.summaryHeader}>Chiffre d&apos;Affaires</Text>
                        <Text style={s.summaryValueBlack}>{fmt(totalCA)}</Text>
                    </View>
                    <View style={s.summaryCell}>
                        <Text style={s.summaryHeader}>Taxes URSSAF</Text>
                        <Text style={s.summaryValueRed}>{fmt(totalUrssaf)}</Text>
                    </View>
                    <View style={s.summaryCell}>
                        <Text style={s.summaryHeader}>Impot (IR)</Text>
                        <Text style={s.summaryValueGold}>{fmt(irResult.irEstime)}</Text>
                    </View>
                    <View style={s.summaryCellLast}>
                        <Text style={s.summaryHeader}>Net Disponible</Text>
                        <Text style={s.summaryValueGreen}>{fmt(netDisponible)}</Text>
                    </View>
                </View>

                <Text style={s.sectionTitle}>{LABELS.monthlyDetail}</Text>
                <View style={s.detailTable}>
                    <View style={s.detailHeaderRow}>
                        <View style={s.col1}><Text style={s.detailHeaderCell}>Mois</Text></View>
                        <View style={s.col2}><Text style={s.detailHeaderCell}>CA Brut</Text></View>
                        <View style={s.col3}><Text style={s.detailHeaderCell}>Charges</Text></View>
                        <View style={s.col4}><Text style={s.detailHeaderCell}>Reste Net</Text></View>
                    </View>

                    {sortedEntries.map((entry, index) => {
                        const monthUrssaf = calculateUrssaf(entry.ca_amount, config.activity_type, config.acre_enabled);
                        const net = entry.ca_amount - monthUrssaf;
                        const rowStyle = index % 2 === 1 ? s.detailRowAlt : s.detailRow;
                        return (
                            <View style={rowStyle} key={index}>
                                <View style={s.col1}><Text style={s.detailCellMonth}>{MONTHS[entry.month - 1]}</Text></View>
                                <View style={s.col2}><Text style={s.detailCellNum}>{fmt(entry.ca_amount)}</Text></View>
                                <View style={s.col3}><Text style={s.detailCellNum}>{fmt(monthUrssaf)}</Text></View>
                                <View style={s.col4}><Text style={s.detailCellNum}>{fmt(net)}</Text></View>
                            </View>
                        );
                    })}
                </View>

                <View style={s.footer} fixed>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={s.footerLeft}>{LABELS.footer}</Text>
                    </View>
                    <Text style={s.footerRight}>Page 1/2</Text>
                </View>
            </Page>

            <Page size="A4" style={s.page}>
                <Text style={s.pageTitle}>NetEnPoche - {LABELS.annualTitle}</Text>
                <Text style={s.chartTitle}>Visualisation Graphique</Text>

                <View style={{ height: 220, marginBottom: 30 }}>
                    <Svg viewBox={`0 0 520 200`} style={{ width: '100%', height: '100%' }}>
                        {[0, 0.25, 0.5, 0.75, 1].map((frac, index) => {
                            const y = 160 - frac * barMaxHeight;
                            return (
                                <G key={`grid-${index}`}>
                                    <Line x1={55} y1={y} x2={510} y2={y} strokeWidth={0.5} stroke="#e2e8f0" strokeDasharray="3,3" />
                                    <Rect x={0} y={y - 5} width={52} height={10} fill="#ffffff" />
                                </G>
                            );
                        })}

                        {sortedEntries.map((entry, index) => {
                            const monthUrssaf = calculateUrssaf(entry.ca_amount, config.activity_type, config.acre_enabled);
                            const net = entry.ca_amount - monthUrssaf;
                            const netHeight = maxCA > 0 ? (net / maxCA) * barMaxHeight : 0;
                            const chargesHeight = maxCA > 0 ? (monthUrssaf / maxCA) * barMaxHeight : 0;
                            const x = 60 + index * (barWidth + barGap + 3);
                            const baseY = 160;

                            return (
                                <G key={`bar-${index}`}>
                                    {netHeight > 0 && (
                                        <Rect x={x} y={baseY - netHeight} width={barWidth / 2} height={netHeight} fill="#10b981" />
                                    )}
                                    {chargesHeight > 0 && (
                                        <Rect x={x + barWidth / 2} y={baseY - chargesHeight} width={barWidth / 2} height={chargesHeight} fill="#6366f1" />
                                    )}
                                </G>
                            );
                        })}

                        <Line x1={55} y1={160} x2={510} y2={160} strokeWidth={0.5} stroke="#94a3b8" />
                    </Svg>

                    <View style={{ position: 'absolute', left: 0, top: 0, height: 200 }}>
                        {[0, 0.25, 0.5, 0.75, 1].map((frac, index) => {
                            const val = Math.round(maxCA * frac);
                            const label = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`;
                            const yPos = 160 - frac * barMaxHeight;
                            const topPct = (yPos / 200) * 100;
                            return (
                                <Text key={`label-${index}`} style={{ position: 'absolute', top: `calc(${topPct}% - 3.5px)`, left: 0, fontSize: 7, color: '#94a3b8', width: 40, textAlign: 'right' }}>
                                    {label}
                                </Text>
                            );
                        })}
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 4, paddingLeft: 45 }}>
                        {SHORT_MONTHS.map((month, index) => (
                            <Text key={index} style={{ width: `${100 / 12}%`, textAlign: 'center', fontSize: 7, color: '#4b5563' }}>{month}</Text>
                        ))}
                    </View>
                </View>

                <Text style={s.noticeTitle}>Notice Fiscale</Text>
                <Text style={s.noticeText}>{LABELS.notice}</Text>

                <View style={s.footer} fixed>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={s.footerIcon}>i</Text>
                        <Text style={s.footerLeft}>{LABELS.footer}</Text>
                    </View>
                    <Text style={s.footerRight}>Page 2/2</Text>
                </View>
            </Page>
        </Document>
    );
};