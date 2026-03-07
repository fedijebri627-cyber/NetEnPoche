import { Page, Text, View, Document, StyleSheet, Svg, Rect, Line, G } from '@react-pdf/renderer';
import { ActivityConfig, MonthlyEntry } from '@/contexts/DashboardContext';
import { calculateUrssaf, calculateIR } from '@/lib/calculations';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const SHORT_MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const s = StyleSheet.create({
    page: { backgroundColor: '#ffffff', paddingTop: 30, paddingBottom: 60, paddingHorizontal: 40, fontFamily: 'Helvetica', fontSize: 10 },

    // Header
    pageTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: '#92400e', marginBottom: 25 },

    // Section titles
    sectionTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 12 },

    // User info
    infoLine: { fontSize: 10, color: '#4b5563', marginBottom: 4 },

    // Summary table
    summaryTable: { flexDirection: 'row', borderWidth: 1, borderColor: '#1e293b', marginTop: 20, marginBottom: 25 },
    summaryCell: { flex: 1, borderRightWidth: 1, borderRightColor: '#1e293b', padding: 10, alignItems: 'center' },
    summaryCellLast: { flex: 1, padding: 10, alignItems: 'center' },
    summaryHeader: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 6, textAlign: 'center' },
    summaryValueBlack: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1e293b', textAlign: 'center' },
    summaryValueRed: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ef4444', textAlign: 'center' },
    summaryValueGold: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#f59e0b', textAlign: 'center' },
    summaryValueGreen: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#10b981', textAlign: 'center' },

    // Detail table
    detailTable: { marginTop: 10 },
    detailHeaderRow: { flexDirection: 'row', backgroundColor: '#1e293b' },
    detailHeaderCell: { padding: 8, fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#ffffff', textAlign: 'center' },
    detailRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#d1d5db' },
    detailRowAlt: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#d1d5db', backgroundColor: '#f8fafc' },
    detailCellMonth: { padding: 7, fontSize: 9, color: '#1e293b', textAlign: 'center' },
    detailCellNum: { padding: 7, fontSize: 9, color: '#1e293b', textAlign: 'right' },

    // Column widths
    col1: { width: '25%' },
    col2: { width: '25%' },
    col3: { width: '25%' },
    col4: { width: '25%' },

    // Chart section
    chartTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 15 },
    chartContainer: { height: 180, marginBottom: 25, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 5 },

    // Notice
    noticeTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#1e293b', marginBottom: 8 },
    noticeText: { fontSize: 9, color: '#4b5563', lineHeight: 1.6 },

    // Footer
    footer: { position: 'absolute', bottom: 25, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    footerLeft: { fontSize: 8, color: '#94a3b8', fontStyle: 'italic' },
    footerRight: { fontSize: 8, color: '#94a3b8' },
    footerIcon: { fontSize: 14, color: '#94a3b8', marginBottom: 2 },
});

const fmt = (val: number) => {
    const parts = val.toFixed(2).split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${intPart}.${parts[1]} EUR`;
};

interface BilanTemplateProps {
    entries: MonthlyEntry[];
    config: ActivityConfig;
    userMeta: { name: string; email: string };
    isPro: boolean;
}

export const BilanTemplate = ({ entries, config, userMeta, isPro }: BilanTemplateProps) => {
    const sortedEntries = [...entries].sort((a, b) => a.month - b.month);

    const totalCA = sortedEntries.reduce((acc, e) => acc + e.ca_amount, 0);
    const totalUrssaf = calculateUrssaf(totalCA, config.activity_type, config.acre_enabled);
    const irResult = calculateIR({
        ca: totalCA,
        activityType: config.activity_type,
        versementLiberatoire: config.versement_liberatoire,
        situationFamiliale: config.situation_familiale || 'celibataire',
        parts: config.parts_fiscales || 1,
        autresRevenus: config.autres_revenus || 0
    });
    const netDisponible = totalCA - totalUrssaf - irResult.irEstime;

    // URSSAF rate display
    const urssafRates: Record<string, number> = {
        prestations_services: 21.1,
        vente_marchandises: 12.3,
        liberal: 21.2,
    };
    const urssafRate = urssafRates[config.activity_type] || 21.1;

    // Chart data
    const maxCA = Math.max(...sortedEntries.map(e => e.ca_amount), 1);
    const barMaxHeight = 140;
    const barWidth = 30;
    const barGap = 10;

    return (
        <Document>
            {/* ============= PAGE 1: SUMMARY + DETAIL ============= */}
            <Page size="A4" style={s.page}>
                <Text style={s.pageTitle}>NetEnPoche - Bilan Financier Annuel</Text>

                {/* User Info */}
                <Text style={s.sectionTitle}>Bilan Financier Annuel</Text>
                <Text style={s.infoLine}>Auto-Entrepreneur : {userMeta.email}</Text>
                <Text style={s.infoLine}>SIRET : Non Renseigné</Text>
                <Text style={s.infoLine}>Type d&apos;activité : {String(config.activity_type) === 'prestations_services' ? 'Prestation de services' : String(config.activity_type) === 'vente_marchandises' ? 'Vente de marchandises' : 'Profession libérale'}</Text>
                <Text style={s.infoLine}>Taux URSSAF : {urssafRate} %</Text>

                {/* Summary Table */}
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

                {/* Detail Mensuel */}
                <Text style={s.sectionTitle}>Détail Mensuel</Text>
                <View style={s.detailTable}>
                    {/* Header row */}
                    <View style={s.detailHeaderRow}>
                        <View style={s.col1}><Text style={s.detailHeaderCell}>Mois</Text></View>
                        <View style={s.col2}><Text style={s.detailHeaderCell}>CA Brut</Text></View>
                        <View style={s.col3}><Text style={s.detailHeaderCell}>Charges</Text></View>
                        <View style={s.col4}><Text style={s.detailHeaderCell}>Reste Net</Text></View>
                    </View>

                    {/* Data rows */}
                    {sortedEntries.map((entry, i) => {
                        const monthUrssaf = calculateUrssaf(entry.ca_amount, config.activity_type, config.acre_enabled);
                        const net = entry.ca_amount - monthUrssaf;
                        const rowStyle = i % 2 === 1 ? s.detailRowAlt : s.detailRow;
                        return (
                            <View style={rowStyle} key={i}>
                                <View style={s.col1}><Text style={s.detailCellMonth}>{MONTHS[entry.month - 1]}</Text></View>
                                <View style={s.col2}><Text style={s.detailCellNum}>{fmt(entry.ca_amount)}</Text></View>
                                <View style={s.col3}><Text style={s.detailCellNum}>{fmt(monthUrssaf)}</Text></View>
                                <View style={s.col4}><Text style={s.detailCellNum}>{fmt(net)}</Text></View>
                            </View>
                        );
                    })}
                </View>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={s.footerLeft}>Généré par NetEnPoche - Document non-officiel, à titre informatif</Text>
                    </View>
                    <Text style={s.footerRight}>Page 1/2</Text>
                </View>
            </Page>

            {/* ============= PAGE 2: CHART + NOTICE ============= */}
            <Page size="A4" style={s.page}>
                <Text style={s.pageTitle}>NetEnPoche - Bilan Financier Annuel</Text>

                {/* Chart Section */}
                <Text style={s.chartTitle}>Visualisation Graphique</Text>

                <View style={{ height: 220, marginBottom: 30 }}>
                    {/* Simple bar chart using SVG */}
                    <Svg viewBox={`0 0 520 200`} style={{ width: '100%', height: '100%' }}>
                        {/* Y-axis gridlines and labels */}
                        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
                            const y = 160 - frac * barMaxHeight;
                            const val = Math.round(maxCA * frac);
                            const label = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`;
                            return (
                                <G key={`grid-${i}`}>
                                    <Line x1={55} y1={y} x2={510} y2={y} strokeWidth={0.5} stroke="#e2e8f0" strokeDasharray="3,3" />
                                    <Rect x={0} y={y - 5} width={52} height={10} fill="#ffffff" />
                                </G>
                            );
                        })}

                        {/* Bars */}
                        {sortedEntries.map((entry, i) => {
                            const monthUrssaf = calculateUrssaf(entry.ca_amount, config.activity_type, config.acre_enabled);
                            const net = entry.ca_amount - monthUrssaf;
                            const netHeight = maxCA > 0 ? (net / maxCA) * barMaxHeight : 0;
                            const chargesHeight = maxCA > 0 ? (monthUrssaf / maxCA) * barMaxHeight : 0;
                            const x = 60 + i * (barWidth + barGap + 3);
                            const baseY = 160;

                            return (
                                <G key={`bar-${i}`}>
                                    {netHeight > 0 && (
                                        <Rect x={x} y={baseY - netHeight} width={barWidth / 2} height={netHeight} fill="#10b981" />
                                    )}
                                    {chargesHeight > 0 && (
                                        <Rect x={x + barWidth / 2} y={baseY - chargesHeight} width={barWidth / 2} height={chargesHeight} fill="#6366f1" />
                                    )}
                                </G>
                            );
                        })}

                        {/* X-axis baseline */}
                        <Line x1={55} y1={160} x2={510} y2={160} strokeWidth={0.5} stroke="#94a3b8" />
                    </Svg>

                    {/* Y-axis scale labels (positioned outside SVG for proper text rendering) */}
                    <View style={{ position: 'absolute', left: 0, top: 0, height: 200 }}>
                        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
                            const val = Math.round(maxCA * frac);
                            const label = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`;
                            // Base Y is 160 (bottom), barMaxHeight is 140, total height is 200.
                            // The SVG y-coordinate of the line is exactly: 160 - (frac * 140)
                            // Converts to percentage for the absolute wrapper: (160 - frac * 140) / 200 * 100
                            // Then subtract 3.5px to vertically center the 7px text on the line.
                            const yPos = 160 - frac * barMaxHeight;
                            const topPct = (yPos / 200) * 100;
                            return (
                                <Text key={`label-${i}`} style={{ position: 'absolute', top: `calc(${topPct}% - 3.5px)`, left: 0, fontSize: 7, color: '#94a3b8', width: 40, textAlign: 'right' }}>
                                    {label}
                                </Text>
                            );
                        })}
                    </View>

                    {/* X-axis month labels */}
                    <View style={{ flexDirection: 'row', marginTop: 4, paddingLeft: 45 }}>
                        {SHORT_MONTHS.map((m, i) => (
                            <Text key={i} style={{ width: `${100 / 12}%`, textAlign: 'center', fontSize: 7, color: '#4b5563' }}>{m}</Text>
                        ))}
                    </View>
                </View>

                {/* Notice Fiscale */}
                <Text style={s.noticeTitle}>Notice Fiscale</Text>
                <Text style={s.noticeText}>
                    Ce document constitue un bilan analytique de votre activité générée sur NetEnPoche. Il n&apos;a pas de valeur comptable officielle. Vous devez déclarer ces montants sur votre espace mensuel ou trimestriel URSSAF.
                </Text>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={s.footerIcon}>ⓘ</Text>
                        <Text style={s.footerLeft}>Généré par NetEnPoche - Document non-officiel, à titre informatif</Text>
                    </View>
                    <Text style={s.footerRight}>Page 2/2</Text>
                </View>
            </Page>
        </Document>
    );
};
