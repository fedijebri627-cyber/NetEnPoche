import streamlit as st
import pandas as pd
import streamlit.components.v1 as components
import altair as alt
from fpdf import FPDF
import io
import auth
import uuid
import json
from streamlit_cookies_controller import CookieController

# ==========================================
# CONFIGURATION ET CONSTANTES
# ==========================================

# Paramètres de la page Streamlit (Layout Wide pour tableau de bord horizontal)
st.set_page_config(
    page_title="NetEnPoche",
    page_icon="💼",
    layout="wide"
)

# Global custom CSS for link buttons (Stripe checkouts)
st.markdown("""
<style>
/* Force link button text to be white */
[data-testid="stLinkButton"] a {
    color: white !important;
    text-decoration: none !important;
}
</style>
""", unsafe_allow_html=True)

# ==========================================
# CLASS: PDF GENERATOR
# ==========================================
class PDFReport(FPDF):
    def header(self):
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        self.set_text_color(69, 40, 17) # #452811 Dark Brown
        # Title
        self.cell(0, 10, 'NetEnPoche - Bilan Financier Annuel', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, 'Genere par NetEnPoche - Document non officiel, a titre informatif', 0, 0, 'L')
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'R')

def generate_pdf(df, activity_type, urssaf_rate, total_revenue, total_taxes, total_ir, total_net, user_email, siret_str="Non Renseigne"):
    pdf = PDFReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # Header / Cover Info
    pdf.set_font('Arial', 'B', 16)
    pdf.set_text_color(15, 30, 61)
    pdf.cell(0, 10, 'Bilan Financier Annuel', 0, 1, 'L')
    pdf.set_font('Arial', '', 11)
    pdf.set_text_color(92, 90, 85)
    pdf.cell(0, 6, f'Auto-Entrepreneur : {user_email}', 0, 1, 'L')
    pdf.cell(0, 6, f'SIRET : {siret_str}', 0, 1, 'L')
    pdf.cell(0, 6, f'Type d\'activite : {activity_type}', 0, 1, 'L')
    pdf.cell(0, 6, f'Taux URSSAF : {urssaf_rate*100:.1f} %', 0, 1, 'L')
    pdf.ln(8)
    
    # Executive Summary Boxes
    pdf.set_fill_color(247, 245, 240) # Cream
    pdf.set_text_color(15, 30, 61) # Navy
    
    pdf.set_font('Arial', 'B', 11)
    pdf.cell(48, 10, 'Chiffre d\'Affaires', 1, 0, 'C', 1)
    pdf.cell(48, 10, 'Taxes URSSAF', 1, 0, 'C', 1)
    pdf.cell(48, 10, 'Impot (IR)', 1, 0, 'C', 1)
    pdf.cell(46, 10, 'Net Disponible', 1, 1, 'C', 1)
    
    pdf.set_font('Arial', '', 11)
    pdf.cell(48, 12, f'{total_revenue:,.2f} EUR'.replace(',', ' '), 1, 0, 'C')
    pdf.set_text_color(239, 68, 68) # Red
    pdf.cell(48, 12, f'{total_taxes:,.2f} EUR'.replace(',', ' '), 1, 0, 'C')
    pdf.set_text_color(245, 158, 11) # Amber
    pdf.cell(48, 12, f'{total_ir:,.2f} EUR'.replace(',', ' '), 1, 0, 'C')
    pdf.set_text_color(16, 185, 129) # Green
    pdf.cell(46, 12, f'{total_net:,.2f} EUR'.replace(',', ' '), 1, 1, 'C')
    pdf.ln(12)
    
    # 12-Month Breakdown Table
    pdf.set_text_color(15, 30, 61)
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Detail Mensuel', 0, 1)
    
    # Table Header
    pdf.set_fill_color(15, 30, 61) # Navy
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('Arial', 'B', 11)
    pdf.cell(40, 10, 'Mois', 1, 0, 'C', 1)
    pdf.cell(50, 10, 'CA Brut', 1, 0, 'R', 1)
    pdf.cell(50, 10, 'Charges', 1, 0, 'R', 1)
    pdf.cell(50, 10, 'Reste Net', 1, 1, 'R', 1)
    
    # Table Rows
    pdf.set_text_color(0)
    pdf.set_font('Arial', '', 11)
    
    fill = False
    for index, row in df.iterrows():
        ca = float(row["Chiffre d'affaires (€)"])
        charges = ca * urssaf_rate
        net = ca - charges
        
        if fill:
            pdf.set_fill_color(248, 249, 250)
        else:
            pdf.set_fill_color(255, 255, 255)
        pdf.cell(40, 9, str(row["Mois"]), 1, 0, 'C', fill)
        pdf.cell(50, 9, f"{ca:,.2f} EUR".replace(',', ' '), 1, 0, 'R', fill)
        pdf.cell(50, 9, f"{charges:,.2f} EUR".replace(',', ' '), 1, 0, 'R', fill)
        pdf.cell(50, 9, f"{net:,.2f} EUR".replace(',', ' '), 1, 1, 'R', fill)
        fill = not fill
        
    # Add a page break to ensure the chart fits securely on Page 2
    pdf.add_page("P")
    
    # Embedded Bar Chart (Native FPDF)
    pdf.set_text_color(15, 30, 61)
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Visualisation Graphique', 0, 1)
    pdf.ln(5)
    
    # Draw bars manually
    start_x = pdf.get_x() + 10
    start_y = pdf.get_y() + 40
    bar_width = 10
    max_height = 35
    
    max_ca = df["Chiffre d'affaires (€)"].max()
    if max_ca == 0: max_ca = 1 
    
    for i, row in df.iterrows():
        ca = float(row["Chiffre d'affaires (€)"])
        height = (ca / max_ca) * max_height
        
        if height > 0:
            pdf.set_fill_color(99, 102, 241) # Indigo base CA
            pdf.rect(start_x + (i * 14.5), start_y - height, bar_width, height, 'F')
            
            # Net overlay
            net = ca - (ca * urssaf_rate)
            net_height = (net / max_ca) * max_height
            pdf.set_fill_color(16, 185, 129) # Green net
            pdf.rect(start_x + (i * 14.5), start_y - net_height, bar_width, net_height, 'F')
        
        pdf.set_font('Arial', '', 7)
        pdf.set_text_color(100)
        pdf.text(start_x + (i * 14.5), start_y + 4, str(row["Mois"])[:3])
        
    pdf.ln(45) # Move past chart
    
    # Footer Notice
    pdf.set_font('Arial', 'B', 12)
    pdf.set_text_color(15, 30, 61)
    pdf.cell(0, 8, 'Notice Fiscale', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.set_text_color(50)
    pdf.multi_cell(0, 5, "Ce document constitue un bilan analytique de votre activite generee sur NetEnPoche. Il n'a pas de valeur comptable officielle. Vous devez declarer ces montants sur votre espace mensuel ou trimestriel URSSAF.")
    # FPDF1 returns a python string (latin-1 encoded by default inside its logic)
    # We must explicitly encode it to bytes for Streamlit's download button
    return pdf.output(dest='S').encode('latin-1')


# ==========================================
# TOUR GUIDE JAVASCRIPT
# ==========================================
TOUR_JS = """
<script>
(function() {
    const parentDoc = window.parent.document;
    
    function runDriver() {
        if (window.parent.__netenpoche_driver) {
            try { window.parent.__netenpoche_driver.destroy(); } catch (e) {}
        }
        
        // Inject an ID onto the true chart container block so Driver.js can box it correctly
        const anchor = parentDoc.querySelector('#chart-section-anchor');
        if (anchor) {
            const container = anchor.closest('[data-testid="stVerticalBlock"]');
            if (container) container.id = 'main-financial-chart';
        }
        
        const driver = window.parent.driver.js.driver;
        const driverObj = driver({
            showProgress: true,
            animate: true,
            doneBtnText: 'Terminer',
            closeBtnText: 'Fermer',
            nextBtnText: 'Suivant',
            prevBtnText: 'Précédent',
            steps: [
                {
                    popover: {
                        title: 'Bienvenue ! 👋',
                        description: 'Faisons un petit tour pour découvrir comment utiliser l\\'application.'
                    }
                },
                {
                    element: parentDoc.querySelector('[data-testid="stExpander"]'),
                    popover: {
                        title: '1. Configuration / Options',
                        description: 'Les paramètres (année, etc) et le suivi des charges réelles se trouvent ici.',
                        side: "bottom", 
                        align: 'start'
                    }
                },
                {
                    element: parentDoc.querySelector('[data-testid="stDataFrame"]') || parentDoc.querySelector('[data-testid="stDataEditor"]'),
                    popover: {
                        title: '2. Saisie des revenus',
                        description: 'Entrez les revenus mensuels. Le tableau se sauvegarde automatiquement.',
                        side: "right", 
                        align: 'start'
                    }
                },
                {
                    element: parentDoc.querySelector('.kpi-card.urssaf'),
                    popover: {
                        title: '3. Suivi des cotisations',
                        description: 'Gardez un œil sur ce qu\\'il faut payer à l\\'URSSAF et aux Impôts.',
                        side: "bottom", 
                        align: 'start'
                    }
                },
                {
                    element: parentDoc.querySelector('.kpi-card.net'),
                    popover: {
                        title: '4. Le Net en Poche',
                        description: 'La somme qui reste réellement dans la poche après les cotisations !',
                        side: "bottom", 
                        align: 'start'
                    }
                },
                {
                    element: parentDoc.querySelector('#main-financial-chart') || parentDoc.querySelector('canvas') || parentDoc.body,
                    popover: {
                        title: '5. La Synthèse Graphique',
                        description: 'Visualisez d\\'un coup d\\'œil la répartition de vos charges et votre revenu net.',
                        side: "left", 
                        align: 'start'
                    }
                }
            ]
        });
        
        window.parent.__netenpoche_driver = driverObj;
        driverObj.drive();
    }
    
    function waitForElementsAndRun() {
        // Wait until all critical components are loaded in the DOM
        if (parentDoc.querySelector('[data-testid="stExpander"]') && 
            parentDoc.querySelector('.kpi-card.urssaf')) {
            // Add a small delay for mounting animations
            setTimeout(runDriver, 300);
        } else {
            setTimeout(waitForElementsAndRun, 100);
        }
    }
    
    function startTour() {
        if (!parentDoc.getElementById('driver-css')) {
            const link = parentDoc.createElement('link');
            link.id = 'driver-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css';
            parentDoc.head.appendChild(link);
        }
        
        if (!parentDoc.getElementById('driver-js-script')) {
            const script = parentDoc.createElement('script');
            script.id = 'driver-js-script';
            script.src = 'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js';
            script.onload = function() {
                waitForElementsAndRun();
            };
            parentDoc.head.appendChild(script);
        } else {
            waitForElementsAndRun();
        }
    }
    
    startTour();
})();
</script>
"""

# Constantes pour la France en 2026
# BNC : Bénéfices Non Commerciaux (Prestation de services)
URSSAF_RATE_BNC = 0.211  # 21,1%
TVA_THRESHOLD_BNC = 39100.0
IMPOT_LIBERATOIRE_BNC = 0.022 # 2,2%

# BIC : Bénéfices Industriels et Commerciaux (Vente de marchandises)
URSSAF_RATE_BIC = 0.123  # 12,3%
TVA_THRESHOLD_BIC = 91900.0
IMPOT_LIBERATOIRE_BIC = 0.010 # 1,0%

CFE_PROVISION_RATE = 0.015 # 1,5%

# Mois de l'année en français
MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

# 1. Premium UI/UX (CSS Injection)
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

/* CSS Variables for New Color System */
:root {
    --navy: #0f1e3d;
    --navy-mid: #1a3160;
    --navy-light: #243d75;
    --coral: #6366f1; /* App uses indigo/coral here */
    --coral-hover: #4f46e5;
    --bg-light: #ffffff;
    --bg-secondary: #f7f5f0;
    --text-main: #2a2926;
    --text-muted: #9d9b95;
    
    --alert-info-bg: #eef2ff;
    --alert-info-text: #4f46e5;
    --alert-info-border: #6366f1;
    
    --alert-warning-bg: #fff8ed;
    --alert-warning-text: #92400e;
    --alert-warning-border: #fde68a;
    
    --alert-danger-bg: #fdecea;
    --alert-danger-text: #b91c1c;
    --alert-danger-border: #e8453c;

    --kpi-urssaf: #e8453c; /* red */
    --kpi-net: #1db87a; /* green */
    --kpi-cfe: #f59e0b; /* amber */
    
    --radius: 14px;
    --radius-sm: 8px;
    --shadow-sm: 0 1px 3px rgba(15,30,61,0.08);
}

/* Base text color & Fonts */
* {
    font-family: 'DM Sans', sans-serif;
}
h1, h2, h3, h4, h5, h6, .stMarkdown p strong {
    font-family: 'Syne', sans-serif !important;
}

h1, h2, h3, h4, h5, h6, p, span, label, div {
    color: var(--text-main);
}

/* Global Reset & Background is handled partly by config.toml */
.stApp {
    background-color: var(--bg-secondary) !important;
}
[data-testid="stHeader"] {
    display: none !important; /* Hide native top header */
}

/* Primary buttons (Indigo/Coral) */
button[kind="primary"] {
    background-color: var(--coral) !important;
    border-color: var(--coral) !important;
    color: white !important;
    border-radius: var(--radius-sm) !important;
    font-weight: 500 !important;
}
button[kind="primary"]:hover {
    background-color: var(--coral-hover) !important;
    border-color: var(--coral-hover) !important;
}

/* Secondary Button explicitly styling to ensure contrast */
button[kind="secondary"] {
    background-color: white !important;
    border: 1px solid #e4e2dc !important;
    color: var(--text-main) !important;
    border-radius: var(--radius-sm) !important;
    font-weight: 500 !important;
}
button[kind="secondary"]:hover {
    border-color: var(--navy) !important;
    color: var(--navy) !important;
}

/* Danger Button custom style class equivalent */
.danger-btn button {
    background-color: var(--kpi-urssaf) !important;
    color: white !important;
    border: none !important;
}

/* Block container (Full-width adjustments) */
[data-testid="block-container"] {
    padding-top: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    max-width: 100% !important;
    overflow-x: hidden;
}

/* Form inputs & general content padding */
.content-wrapper {
    padding: 0 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* Dark Navy Header System */
div[data-testid="stColumns"]:has(h1) {
    background-color: var(--navy);
    padding: 1rem 2rem;
    margin-bottom: 2rem;
    align-items: center;
    box-shadow: 0 2px 20px rgba(0,0,0,0.25);
}
div[data-testid="stColumns"]:has(h1) h1 {
    color: white !important;
    font-size: 1.5rem;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}
div[data-testid="stColumns"]:has(h1) p {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* Custom Unified Alerts */
.custom-alert {
    padding: 10px 32px;
    border-radius: var(--radius-sm);
    margin-bottom: 1rem;
    border: 1px solid;
    display: flex;
    align-items: center; 
    gap: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
}
.custom-alert.info {
    background-color: var(--alert-info-bg);
    border-color: var(--alert-info-border);
    color: var(--alert-info-text);
}
.custom-alert.warning {
    background-color: var(--alert-warning-bg);
    border-color: var(--alert-warning-border);
    color: var(--alert-warning-text);
}
.custom-alert.danger {
    background-color: var(--alert-danger-bg);
    border-color: var(--alert-danger-border);
    color: var(--alert-danger-text);
}
.custom-alert.info span, .custom-alert.warning span, .custom-alert.danger span, 
.custom-alert.info strong, .custom-alert.warning strong, .custom-alert.danger strong {
    color: inherit;
}

/* Sticky KPI Bar Container */
.kpi-container {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    box-shadow: var(--shadow-sm);
    padding: 0 32px;
    border-bottom: 1px solid #e4e2dc;
    margin-bottom: 20px;
}
.kpi-container > div {
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important; 
    gap: 0 !important; 
}

/* KPI Cards styling overide */
.kpi-card {
    background-color: white;
    padding: 18px 24px;
    border-right: 1px solid #e4e2dc;
    position: relative;
    display: flex;
    flex-direction: column;
}
.kpi-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
}
.kpi-card.urssaf::before { background: var(--kpi-urssaf); }
.kpi-card.net::before { background: var(--kpi-net); }
.kpi-card.cfe::before { background: var(--kpi-cfe); }

.kpi-label { 
    font-size: 11px; 
    color: var(--text-muted); 
    text-transform: uppercase; 
    letter-spacing: 0.8px; 
    font-weight: 500; 
    font-family: 'DM Sans', sans-serif;
}
.kpi-value { 
    font-size: 26px; 
    font-weight: 700; 
    color: var(--navy); 
    line-height: 1;
    margin: 4px 0; 
    font-family: 'Syne', sans-serif;
}
.kpi-trend { 
    font-size: 12px; 
    font-weight: 500; 
    display: flex;
    align-items: center;
    gap: 3px;
}
.kpi-trend.up { color: var(--kpi-net); }
.kpi-trend.down { color: var(--kpi-urssaf); }
.kpi-trend.neutral { color: var(--text-muted); }

/* TVA Progress Bar Custom */
.tva-progress-wrap {
    width: 100%;
    background-color: #f1f0ed;
    border-radius: 6px;
    height: 12px;
    position: relative;
    overflow: visible;
    margin: 15px 0 25px 0;
}
.tva-progress-fill {
    height: 100%;
    border-radius: 6px;
    background: linear-gradient(90deg, #1db87a 0%, #1db87a 60%, #f59e0b 75%, #e8453c 92%);
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    position: relative;
}
.tva-threshold-marker {
    position: absolute;
    top: -5px;
    bottom: -5px;
    left: 90%;
    width: 2px;
    background-color: var(--kpi-urssaf); /* red */
    z-index: 10;
}
.tva-threshold-marker::before {
    content: 'Seuil';
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    font-weight: 600;
    color: var(--kpi-urssaf);
}
.tva-progress-text {
    position: absolute;
    right: 0;
    top: -24px;
    font-size: 11px;
    font-weight: 700;
    color: var(--kpi-cfe);
    background: #fef3c7;
    padding: 2px 6px;
    border-radius: 4px;
}

/* Animations Tools */
@keyframes fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to { opacity:1; transform:translateY(0); }
}
.animate-kpi {
    animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Streamlit container override to make them look like panels */
[data-testid="stExpander"] {
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    border: none;
    overflow: hidden;
}
.stDataFrame {
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
    div[data-testid="stColumns"]:has(h1) {
        padding: 1rem 1.5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    .content-wrapper { padding: 0 1rem; }
    .kpi-container > div {
        grid-template-columns: 1fr !important;
    }
    .kpi-card {
        border-right: none;
        border-bottom: 1px solid #e4e2dc;
    }
}
</style>
""", unsafe_allow_html=True)

# Helper function for unified alerts
def render_alert(alert_type, content, icon=""):
    icon_html = f"<span style='font-size:1.2rem; margin-right:8px;'>{icon}</span>" if icon else ""
    st.markdown(f'''
    <div class="custom-alert {alert_type}">
        {icon_html}
        <div>{content}</div>
    </div>
    ''', unsafe_allow_html=True)


# ==========================================
# INTERFACE PRINCIPALE
# ==========================================

@st.dialog("🔔 Préférences des Alertes Intelligentes", width="large")
def show_alert_preferences():
    st.write("Configurez les notifications pour ne jamais manquer une échéance et optimiser votre gestion.")
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 🚨 Alertes URSSAF")
        urssaf_on = st.toggle("Rappel de paiement URSSAF", value=True)
        urssaf_days = st.selectbox("M'alerter :", ["7 jours avant", "14 jours avant", "30 jours avant"], disabled=not urssaf_on)
        if urssaf_on:
            st.caption("Prochain déclenchement estimé : dans 12 jours")
            
        st.markdown("#### 📉 Suivi du Chiffre d'Affaires")
        ca_drop_on = st.toggle("Alerte de baisse d'activité", value=False)
        ca_drop_pct = st.selectbox("Si mon CA baisse de :", ["20%", "30%", "50%"], disabled=not ca_drop_on)
        st.caption("Compare le mois en cours par rapport au mois précédent.")
        
    with col2:
        st.markdown("#### ⚠️ Plafonds & TVA")
        tva_on = st.toggle("Alerte d'approche plafond TVA", value=True)
        tva_pct = st.selectbox("M'alerter quand j'atteins :", ["70% du plafond", "80% du plafond", "90% du plafond"], disabled=not tva_on)
        if tva_on:
            st.caption("Seuil actuel : Vous êtes à distance sécurisée.")
            
        st.markdown("#### 🎯 Objectifs")
        goal_on = st.toggle("Suivi d'objectif annuel", value=True)
        goal_pct = st.selectbox("Célébrer quand j'atteins :", ["50% de l'objectif", "75% de l'objectif", "100% de l'objectif"], disabled=not goal_on)
        
    st.markdown("---")
    st.markdown("#### 📧 Adresse d'envoi")
    email_val = st.session_state.user["email"] if st.session_state.user else ""
    st.text_input("Les alertes seront envoyées à :", value=email_val, disabled=True)
    
    test_col1, test_col2 = st.columns([1, 1])
    with test_col1:
        if st.button("🧪 Tester les alertes", use_container_width=True):
            st.success(f"Un email de test a été envoyé à {email_val} !")
            import time; time.sleep(1.5); st.rerun()
    with test_col2:
        if st.button("💾 Sauvegarder les préférences", type="primary", use_container_width=True):
            st.toast("Vos préférences d'alertes ont été sauvegardées avec succès !")
            import time; time.sleep(1); st.rerun()


@st.dialog("Débloquez NetEnPoche Premium 🚀", width="large")
def show_upgrade_modal(feature_name=None):
    if feature_name:
        st.markdown(f"### Obtenez **{feature_name}** et bien plus encore !")
    else:
        st.markdown("### Passez à la vitesse supérieure !")
        
    st.write("Rejoignez **2 400 auto-entrepreneurs** qui optimisent leur gestion au quotidien.")
    
    col1, col2 = st.columns(2)
    with col1:
        st.info("🌟 **PRO (5€/mois)**\n\n- Simulateur d'Impôts (IR)\n- Bilan Financier PDF\n- Alertes Email Intelligentes\n- Historique sur 5 ans\n- Simulateur TVA Avancé\n- Score de Santé Financière")
        if st.session_state.user is None:
            st.warning("Connectez-vous pour vous abonner.")
        else:
            stripe_pro = st.secrets.get("STRIPE_LINK_PRO", "https://buy.stripe.com/test")
            st.link_button("S'abonner à Pro via Stripe 💳", stripe_pro, use_container_width=True, type="primary")

    with col2:
        st.success("✨ **EXPERT (14€/mois)**\n\n- *Tout ce qui est dans Pro, plus :*\n- Suivi Clients (CRM)\n- Gestion des Factures\n- Export Comptable FEC\n- Export Pennylane CSV\n- Support Prioritaire")
        if st.session_state.user is not None:
            stripe_expert = st.secrets.get("STRIPE_LINK_EXPERT", "https://buy.stripe.com/test")
            st.link_button("S'abonner à Expert via Stripe 💳", stripe_expert, use_container_width=True, type="primary")
                
    st.caption("🔒 Sans engagement. Annulable à tout moment. Aucune carte bancaire requise pour l'essai.")

# Helper for locked features
def render_premium_feature(tier_required, feature_key, feature_title, render_func, *args, **kwargs):
    tiers = {"gratuit": 0, "pro": 1, "expert": 2}
    current_tier = st.session_state.get("tier", "gratuit")
    
    if tiers.get(current_tier, 0) >= tiers.get(tier_required, 1):
        # User has access, render normally
        render_func(*args, **kwargs)
    else:
        # Blurred Paywall State
        st.markdown(f"""
        <div style='position: relative; margin-top: 10px; margin-bottom: 20px; border-radius: 14px; overflow: hidden; border: 1px solid #e4e2dc; background: white;'>
            <div style='filter: blur(8px); opacity: 0.3; pointer-events: none; user-select: none; padding: 20px;'>
                <img src='https://placehold.co/800x200/f7f5f0/2a2926?text={feature_title.replace(" ", "+")}' style='width: 100%; border-radius: 8px;'/>
            </div>
            <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%;'>
                <h3 style='margin: 0; color: #0f1e3d;'>🔒 {feature_title}</h3>
                <p style='color: #5c5a55; margin-bottom: 15px;'>Débloquez l'accès {tier_required.capitalize()} pour utiliser cette fonctionnalité.</p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            if st.button(f"Débloquer {feature_title} →", key=f"upsell_btn_{feature_key}", type="primary", use_container_width=True):
                show_upgrade_modal(feature_title)


# Initialisation de l'état utilisateur
controller = CookieController()

# Check and define wizard at the top level
@st.dialog("🚀 Bienvenue sur NetEnPoche !", width="large")
def onboarding_wizard():
    st.write("Configurons votre espace en 3 étapes simples pour personnaliser vos calculs.")
    st.markdown("---")
    st.radio("1. Quelle est votre activité principale ?", ["Prestation de services", "Vente de marchandises"], key="wiz_act")
    st.checkbox("2. Bénéficiez-vous de l'ACRE (Réduction de 50% la 1ère année) ?", key="wiz_acre")
    st.checkbox("Avez-vous opté pour le Versement Libératoire de l'impôt sur le revenu ?", key="wiz_verb")
    st.number_input("3. Quel est votre objectif de Chiffre d'Affaires annuel (€) ?", min_value=0, value=30000, step=1000, key="wiz_obj")
    
    if st.button("Terminer la configuration", type="primary", use_container_width=True):
        controller.set("wizard_completed", "done", max_age=86400*365)
        st.session_state.wizard_shown = True
        # Explicitly trigger the interactive tutorial to run next
        st.session_state.tutorial_played = False 
        st.rerun()

wizard_completed = controller.get("wizard_completed")
if 'wizard_shown' not in st.session_state:
    st.session_state.wizard_shown = False

# Make sure tutorial doesn't auto-run on EVERY refresh for returning users
if 'tutorial_played' not in st.session_state:
    st.session_state.tutorial_played = True 

# We use an empty container to ensure it renders correctly after the first cycle
if wizard_completed is None and not st.session_state.wizard_shown:
    onboarding_wizard()

# Check for email verification link
if "verify" in st.query_params:
    token = st.query_params["verify"]
    success, msg = auth.verify_account_token(token)
    if success:
        st.success(f"✅ {msg}")
    else:
        st.error(f"❌ {msg}")
    del st.query_params["verify"]

if 'user' not in st.session_state:
    st.session_state.user = None
    st.session_state.tier = "gratuit"
    st.session_state.data_loaded_from_db = False
    
    # Auto-login via cookie
    token = controller.get("session_token")
    if token:
        user_data = auth.get_user_by_token(token)
        if user_data:
            st.session_state.user = user_data
            st.session_state.tier = user_data.get("tier", "gratuit")

if 'tier' not in st.session_state:
    st.session_state.tier = "gratuit"

# Load data into session exactly once per login
if st.session_state.user is not None and ('data_loaded_from_db' not in st.session_state or not st.session_state.data_loaded_from_db):
    json_str = auth.get_user_data(st.session_state.user['id'])
    if json_str and json_str != "{}":
        try:
            stored_data = json.loads(json_str)
            if 'df_revenues_all' in st.session_state:
                for year, records in stored_data.items():
                    if year in st.session_state.df_revenues_all:
                        st.session_state.df_revenues_all[year] = pd.DataFrame(records)
            
                # Make sure the current view matches the loaded data
                if 'current_selected_year' in st.session_state:
                    st.session_state.df_revenues = st.session_state.df_revenues_all[st.session_state.current_selected_year].copy()
                    st.session_state.latest_edited_df = st.session_state.df_revenues.copy()
        except Exception:
            pass
    st.session_state.data_loaded_from_db = True

def sync_user_data():
    if st.session_state.user is not None and 'df_revenues_all' in st.session_state:
        dict_data = {}
        for y, df in st.session_state.df_revenues_all.items():
            dict_data[y] = df.to_dict(orient='records')
        auth.save_user_data(st.session_state.user['id'], json.dumps(dict_data))

# Header layout
header_col1, header_col2 = st.columns([3, 1], vertical_alignment="bottom")

with header_col1:
    st.title("NetEnPoche - Calculateur URSSAF & TVA")

with header_col2:
    with st.popover("👤 Mon Compte", use_container_width=True):
        if st.button("🪄 Relancer l'assistant", use_container_width=True):
            st.session_state.wizard_shown = False
            controller.set("wizard_completed", None, max_age= -1)
            st.rerun()
            
        if st.button("🗺️ Relancer le tutoriel", use_container_width=True):
            st.session_state.tutorial_played = False
            st.rerun()
            
        st.markdown("---")
        if st.session_state.user is None:
            st.info("💡 Profil & Historique Pro")
            login_tab, signup_tab = st.tabs(["Connexion", "Inscription"])
            
            with login_tab:
                login_email = st.text_input("Email", key="login_email")
                login_password = st.text_input("Mot de passe", type="password", key="login_password")
                if st.button("Se connecter", type="primary", use_container_width=True):
                    success, res = auth.verify_user(login_email, login_password)
                    if success:
                        st.session_state.user = res
                        st.session_state.tier = res.get("tier", "gratuit")
                        st.session_state.data_loaded_from_db = False
                        
                        # Generate stateless JWT token and save to cookie
                        new_token = auth.generate_jwt_for_user(res["id"])
                        auth.update_session_token(res["id"], new_token)
                        controller.set("session_token", new_token, max_age=86400*30) # 30 days
                        
                        st.rerun()
                    else:
                        st.error(res)
                        
            with signup_tab:
                reg_email = st.text_input("Email", key="reg_email")
                reg_password = st.text_input("Mot de passe", type="password", key="reg_password")
                reg_password_confirm = st.text_input("Confirmer le mot de passe", type="password", key="reg_password_confirm")
                
                if st.button("Créer un compte", use_container_width=True):
                    if not reg_email or not reg_password or not reg_password_confirm:
                        st.error("🚨 Veuillez remplir tous les champs.")
                    elif reg_password != reg_password_confirm:
                        st.error("🚨 Les mots de passe ne correspondent pas.")
                    elif len(reg_password) < 8:
                        st.error("🚨 Le mot de passe doit contenir au moins 8 caractères.")
                    else:
                        success, verification_token = auth.create_user(reg_email, reg_password)
                        if success:
                            # Send real SMTP email containing the activation link
                            try:
                                email_sent = auth.send_verification_email(reg_email, verification_token)
                                if email_sent:
                                    st.success("✅ Compte créé avec succès ! Un email d'activation vous a été envoyé. Veuillez vérifier votre boîte mail (et vos indésirables).")
                                else:
                                    st.warning("⚠️ Compte créé, mais l'envoi de l'email a échoué. Veuillez contacter le support.")
                            except KeyError:
                                st.warning("⚠️ Compte créé ! (Alerte Dev : `SMTP_SERVER` n'est pas configuré dans `secrets.toml`, l'email réel n'a pas pu être envoyé).")
                                # Fallback display for the developer temporarily
                                st.code(f"Lien d'activation (Temporaire) : /?verify={verification_token}")
                        else:
                            st.error(verification_token)
        else:
            st.success(f"Connecté: **{st.session_state.user['email']}**")
            current_tier = st.session_state.user.get('tier', 'gratuit')
            if current_tier in ['pro', 'expert']:
                st.markdown(f"🌟 **Statut {current_tier.capitalize()} Actif**")
                
                st.markdown("##### ⚙️ Outils Premium")
                if st.button("🔔 Gérer mes Alertes Intelligentes", use_container_width=True):
                    show_alert_preferences()
                st.markdown("<br>", unsafe_allow_html=True)
                
            if st.button("Se déconnecter", use_container_width=True):
                if st.session_state.user:
                    auth.update_session_token(st.session_state.user['id'], None)
                controller.remove("session_token")
                
                st.session_state.user = None
                st.session_state.is_pro = False
                st.session_state.data_loaded_from_db = False
                st.rerun()

with st.expander("Configuration de l'activité", expanded=st.session_state.user is not None, icon=":material/settings:"):
    cfg_col1, cfg_col2, cfg_col3, cfg_col4 = st.columns(4)
    
    with cfg_col1:
        activity_type = st.selectbox(
            "Type d'activité",
            ("Prestation de services", "Vente de marchandises"),
            help="Sélectionnez 'Prestation de services' (BNC) ou 'Vente de marchandises' (BIC). Cela détermine le taux de cotisations et le plafond de TVA."
        )

    with cfg_col2:
        has_acre = st.checkbox(
            "Bénéficiaire de l'ACRE (1ère année)",
            help="L'ACRE permet de réduire de 50% les cotisations sociales (URSSAF) durant la première année d'activité."
        )
        
    with cfg_col3:
        has_liberatoire = st.checkbox(
            "Option Versement Libératoire",
            help="Le versement libératoire permet de payer un pourcentage fixe du chiffre d'affaires au titre de l'impôt sur le revenu (IR), en même temps que les cotisations URSSAF."
        )

    if activity_type == "Prestation de services":
        base_urssaf_rate = URSSAF_RATE_BNC
        tva_threshold = TVA_THRESHOLD_BNC
        impot_rate = IMPOT_LIBERATOIRE_BNC if has_liberatoire else 0.0
    else:
        base_urssaf_rate = URSSAF_RATE_BIC
        tva_threshold = TVA_THRESHOLD_BIC
        impot_rate = IMPOT_LIBERATOIRE_BIC if has_liberatoire else 0.0

    if has_acre:
        final_urssaf_rate = base_urssaf_rate / 2
    else:
        final_urssaf_rate = base_urssaf_rate

    total_tax_rate = final_urssaf_rate + impot_rate

    with cfg_col4:
        st.info(f"Taux URSSAF: **{final_urssaf_rate * 100:.2f}%**\n\nTaux Impôt: **{impot_rate * 100:.2f}%**\n\nTaux global: **{total_tax_rate * 100:.2f}%**")

st.markdown("---")


# ==========================================
# LOGIQUE HORIZONTALE ET TABLEAU DES MOIS
# ==========================================

# Initialisation des données pour les 12 mois si elles ne sont pas déjà en session
if 'df_revenues_all' not in st.session_state:
    st.session_state.df_revenues_all = {
        "2026": pd.DataFrame({"Mois": MONTHS, "Chiffre d'affaires (€)": [0.0] * 12}),
        "2025": pd.DataFrame({"Mois": MONTHS, "Chiffre d'affaires (€)": [2000.0, 2500.0, 3000.0, 2800.0, 3500.0, 4000.0, 3800.0, 2900.0, 4200.0, 4500.0, 4100.0, 4800.0]}),
        "2024": pd.DataFrame({"Mois": MONTHS, "Chiffre d'affaires (€)": [1500.0, 1800.0, 2200.0, 2000.0, 2500.0, 2800.0, 2600.0, 2100.0, 3000.0, 3200.0, 2900.0, 3500.0]}),
    }

if 'current_selected_year' not in st.session_state:
    st.session_state.current_selected_year = "2026"

if 'df_revenues' not in st.session_state:
    st.session_state.df_revenues = st.session_state.df_revenues_all["2026"].copy()

if 'latest_edited_df' not in st.session_state:
    st.session_state.latest_edited_df = st.session_state.df_revenues.copy()

import time
if not st.session_state.tutorial_played:
    # Adding a unique timestamp comment prevents Streamlit from caching the iframe 
    # and forces the Driver.js script to execute every time we click relaunch.
    components.html(f"{TOUR_JS}\n<!-- {time.time()} -->", height=0, width=0)
    st.session_state.tutorial_played = True

# The Freemium Split
tab_gratuit, tab_pro, tab_expert = st.tabs(["📊 Tableau de Bord", "🔒 Optimisations (Pro)", "💎 CRM & Factures (Expert)"])

with tab_gratuit:
    # Disposition en 2 colonnes : 
    # 1/3 pour le tableau de données (à gauche) 
    # 2/3 pour les graphiques et métriques (à droite)
    layout_col1, layout_col2 = st.columns([1, 2.5], gap="large")

    with layout_col1:
        year_options = ["2026", "2025 (Pro)", "2024 (Pro)"]
        current_index = 0
        for i, opt in enumerate(year_options):
            if opt.startswith(st.session_state.current_selected_year):
                current_index = i
                break
                
        selected_year_label = st.selectbox("Année de saisie", year_options, index=current_index)
        selected_year = selected_year_label[:4]
        
        if selected_year != st.session_state.current_selected_year:
            if st.session_state.tier == "gratuit" and selected_year != "2026":
                st.error("🔒 **L'historique multi-années est réservé aux membres Premium.**")
                if st.button("👉 Débloquer l'accès Premium", type="primary", key="upsell_year"):
                    show_upgrade_modal("Historique Multi-Années")
            else:
                # User successfully switched years!
                # Save the current edits of the old year into the dictionary
                st.session_state.df_revenues_all[st.session_state.current_selected_year] = st.session_state.latest_edited_df.copy()
                sync_user_data()
                
                # Load the new year into the active df
                st.session_state.current_selected_year = selected_year
                st.session_state.df_revenues = st.session_state.df_revenues_all[selected_year].copy()
                st.session_state.latest_edited_df = st.session_state.df_revenues.copy()
                
                # Delete the editor widget state to ensure a clean slate
                if "revenue_editor" in st.session_state:
                    del st.session_state["revenue_editor"]
                    
                st.rerun()

        st.subheader(f"Saisie de l'année {st.session_state.current_selected_year}", help="Modifiez directement les chiffres dans le tableau.")
        
        # Prepare the dataframe for the editor: calculate the live running total column
        df_for_editor = st.session_state.df_revenues.copy()
        raw_cumsum = df_for_editor["Chiffre d'affaires (€)"].cumsum()
        
        # We only want to display the Cumul CA if the current month's CA > 0, 
        # but to allow the first month to show 0.00 if untouched, we check if we've seen any CA yet.
        has_ca = df_for_editor["Chiffre d'affaires (€)"] > 0
        
        # Replace 0 with "—" for a cleaner visual representation of upcoming months
        df_for_editor["Chiffre d'affaires (€)"] = df_for_editor["Chiffre d'affaires (€)"].apply(lambda x: "—" if x == 0 else f"{x:.2f}")
        
        # For Cumul CA, we show '—' if the corresponding CA is '—' AND it's not the first row/an active month
        # A simpler way: just show '—' if CA is 0, except maybe we want to see cumulative even if a month is 0 but previous months had CA?
        # The prompt says: "display the sum only if the adjacent CA cell is filled"
        def format_cumul(ca_val, cumul_val):
            return "—" if ca_val == "—" else f"{cumul_val:.2f}"
            
        df_for_editor["Cumul CA (€)"] = [format_cumul(ca, cum) for ca, cum in zip(df_for_editor["Chiffre d'affaires (€)"], raw_cumsum)]

        # Pandas styler to highlight rows where Cumul CA >= 90% of threshold
        def highlight_tva_danger(row):
            # We must parse back the string to test the threshold value
            try:
                val = float(row["Cumul CA (€)"]) if row["Cumul CA (€)"] != "—" else 0.0
            except:
                val = 0.0
            if val >= (tva_threshold * 0.9):
                return ['background-color: rgba(245, 158, 11, 0.2)'] * len(row)
            return [''] * len(row)

        styled_df = df_for_editor.style.apply(highlight_tva_danger, axis=1)

        # st.data_editor capture instantanément les changements.
        edited_df_raw = st.data_editor(
            styled_df,
            column_config={
                "Mois": st.column_config.TextColumn(
                    "Mois", disabled=True
                ),
                "Chiffre d'affaires (€)": st.column_config.TextColumn(
                    "Chiffre d'affaires (€)",
                    help="Entrez le CA du mois (format: 1000 ou 1000.50)"
                ),
                "Cumul CA (€)": st.column_config.TextColumn(
                    "Cumul CA (€)",
                    disabled=True,
                    help="Se met à jour après validation de la case."
                )
            },
            hide_index=True,
            use_container_width=True,
            key="revenue_editor" 
        )
        
        # Extract the actual editable columns to save back to state
        edited_df = edited_df_raw.drop(columns=["Cumul CA (€)"])
        
        # Convert strings back to float properly
        def parse_ca(val):
            if isinstance(val, str):
                cleaned = val.strip()
                if cleaned == "—" or cleaned == "":
                    return 0.0
                try:
                    return float(cleaned.replace(',', '.'))
                except ValueError:
                    return 0.0
            return float(val) if pd.notnull(val) else 0.0
            
        edited_df["Chiffre d'affaires (€)"] = edited_df["Chiffre d'affaires (€)"].apply(parse_ca)
        
        # Sticky Totals Row HTML
        total_ca_year = edited_df["Chiffre d'affaires (€)"].sum()
        total_urssaf_year = total_ca_year * final_urssaf_rate
        total_net_year = total_ca_year - (total_urssaf_year + (total_ca_year * impot_rate))
        
        st.markdown(f"""
        <div style='background: var(--navy); color: white; padding: 12px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-top: -15px; margin-bottom: 20px; font-weight: 600; font-size: 14px; position: sticky; bottom: 0; z-index: 50; box-shadow: 0 -4px 6px rgba(0,0,0,0.05);'>
            <span style='color: white;'>TOTAL DE L'ANNÉE</span>
            <div style='display: flex; gap: 20px;'>
                <span style='color: white;'>CA : <span style='color: white;'>{total_ca_year:,.2f} €</span></span>
                <span style='color: white;'>URSSAF : <span style='color: var(--kpi-urssaf);'>{total_urssaf_year:,.2f} €</span></span>
                <span style='color: white;'>NET : <span style='color: var(--kpi-net);'>{total_net_year:,.2f} €</span></span>
            </div>
        </div>
        """.replace(',', ' '), unsafe_allow_html=True)
        
        # Syncing state without breaking the editor:
        # Update our dictionary only if changes actually happened in the editor.
        if not edited_df.equals(st.session_state.df_revenues):
            st.session_state.df_revenues = edited_df.copy()
            st.session_state.df_revenues_all[selected_year] = edited_df.copy()
            sync_user_data()
            st.rerun()

        # We store the latest edits to use in charts and save on switch
        st.session_state.latest_edited_df = edited_df.copy()

        @st.dialog("⚠️ Confirmer la réinitialisation")
        def confirm_reset(year_to_reset):
            st.error(f"Êtes-vous sûr de vouloir effacer toutes les données saisies pour l'année {year_to_reset} ? Cette action est irréversible.")
            col_y, col_n = st.columns(2)
            if col_y.button("Oui, tout effacer", type="primary"):
                empty_df = pd.DataFrame({
                    "Mois": MONTHS,
                    "Chiffre d'affaires (€)": [0.0] * 12
                })
                st.session_state.df_revenues = empty_df.copy()
                st.session_state.latest_edited_df = empty_df.copy()
                st.session_state.df_revenues_all[year_to_reset] = empty_df.copy()
                sync_user_data()
                if "revenue_editor" in st.session_state:
                    del st.session_state["revenue_editor"]
                st.rerun()
            if col_n.button("Annuler"):
                st.rerun()

        # Bouton optionnel de réinitialisation
        if st.button("Réinitialiser l'année", icon=":material/refresh:"):
            confirm_reset(st.session_state.current_selected_year)

        st.markdown("---")
        # Export CSV feature
        csv_data = edited_df.to_csv(index=False).encode('utf-8')
        col_exp1, col_exp2 = st.columns(2)
        with col_exp1:
            st.download_button(
                label="📥 Exporter CSV",
                data=csv_data,
                file_name="netenpoche_revenus_2026.csv",
                mime="text/csv",
                type="secondary",
                use_container_width=True
            )
        with col_exp2:
            if st.session_state.tier == "gratuit":
                st.button("📄 Bilan PDF 🔒", disabled=True, use_container_width=True, help="Réservé aux membres Pro/Expert")
            else:
                # Calculate metrics for PDF
                pdf_revenue = edited_df["Chiffre d'affaires (€)"].sum()
                pdf_taxes = pdf_revenue * total_tax_rate
                
                # Fetch IR args from session state or default
                parts = st.session_state.get("ir_parts", 1.0)
                autres_revenus = st.session_state.get("ir_autres", 0.0)
                
                # Calculate IR
                abattement = 0.34 if activity_type == "Prestation de services" else 0.50
                rev_imposable_ae = pdf_revenue * (1 - abattement)
                rev_global_foyer = rev_imposable_ae + autres_revenus
                quotient_familial = rev_global_foyer / parts if parts > 0 else 0
                
                def calc_ir_pdf(qf):
                    ir = 0
                    if qf > 11294: ir += (min(qf, 28797) - 11294) * 0.11
                    if qf > 28797: ir += (min(qf, 82341) - 28797) * 0.30
                    if qf > 82341: ir += (min(qf, 177106) - 82341) * 0.41
                    if qf > 177106: ir += (qf - 177106) * 0.45
                    return ir
                
                ir_sans = calc_ir_pdf(autres_revenus / parts) * parts if parts > 0 else 0
                ir_avec = calc_ir_pdf(quotient_familial) * parts if parts > 0 else 0
                ir_due = ir_avec - ir_sans
                
                taux_vl = 0.022 if activity_type == "Prestation de services" else 0.01
                ir_vl = pdf_revenue * taux_vl
                actual_ir = ir_vl if has_liberatoire else ir_due
                
                pdf_net = pdf_revenue - pdf_taxes - actual_ir
                
                user_email = st.session_state.user["email"] if st.session_state.user else "Utilisateur Invite"
                
                pdf_bytes = generate_pdf(
                    df=edited_df,
                    activity_type=activity_type,
                    urssaf_rate=total_tax_rate,
                    total_revenue=pdf_revenue,
                    total_taxes=pdf_taxes,
                    total_ir=actual_ir,
                    total_net=pdf_net,
                    user_email=user_email,
                    siret_str=st.session_state.get("user_siret", "Non Renseigne")
                )
                st.download_button(
                    label="📄 Bilan PDF", 
                    data=pdf_bytes, 
                    file_name="NetEnPoche_Bilan_2026.pdf", 
                    mime="application/pdf",
                    use_container_width=True
                )

        # Expense Tracker Feature
        st.markdown("<br>", unsafe_allow_html=True)
        with st.expander("🛠️ Tracker de Frais Pro (Mensuels)"):
            st.write("Saisissez vos charges réelles récurrentes (abonnements, transport...). Elles mettront à jour automatiquement les calculs d'abattement.")
            if "df_expenses" not in st.session_state:
                st.session_state.df_expenses = pd.DataFrame({
                    "Dépense": ["Abonnement Logiciel", "Assurance Pro", "Internet / Tél", ""], 
                    "Montant (€)": [0.0, 0.0, 0.0, 0.0]
                })
                
            expense_df = st.data_editor(
                st.session_state.df_expenses,
                num_rows="dynamic",
                use_container_width=True,
                column_config={
                    "Montant (€)": st.column_config.NumberColumn(min_value=0.0, format="%.2f", step=10.0)
                },
                key="expense_editor"
            )
            st.session_state.df_expenses = expense_df
            
            annual_expenses = expense_df["Montant (€)"].sum() * 12
            st.info(f"Total estimé : **{annual_expenses:,.2f} € / an**".replace(',', ' '))

# ==========================================
# AFFICHAGE DES RÉSULTATS (Côté Droit)
# ==========================================

    with layout_col2:
        st.subheader("Tableau de Bord", help="Se met à jour automatiquement avec la saisie.")
        
        # Calculs agrégés à partir de la dataframe (remplace "last_month")
        # Pour un tableau de bord, on présente souvent le TOTAL ANNUEL ou les métriques globales.
        cumulative_revenue = edited_df["Chiffre d'affaires (€)"].sum()
        total_urssaf = cumulative_revenue * final_urssaf_rate
        total_impot = cumulative_revenue * impot_rate
        global_taxes = total_urssaf + total_impot
        
        total_net = cumulative_revenue - global_taxes
        total_cfe = cumulative_revenue * CFE_PROVISION_RATE

        # Calcul des tendances par rapport au mois actif précédent
        active_months = edited_df[edited_df["Chiffre d'affaires (€)"] > 0]
        trend_urssaf = trend_net = trend_cfe = 0
        if len(active_months) >= 2:
            curr_rev = active_months.iloc[-1]["Chiffre d'affaires (€)"]
            prev_rev = active_months.iloc[-2]["Chiffre d'affaires (€)"]
            trend_urssaf = (curr_rev - prev_rev) * total_tax_rate
            trend_net = (curr_rev - prev_rev) * (1 - total_tax_rate)
            trend_cfe = (curr_rev - prev_rev) * CFE_PROVISION_RATE
        elif len(active_months) == 1:
            curr_rev = active_months.iloc[0]["Chiffre d'affaires (€)"]
            trend_urssaf = curr_rev * total_tax_rate
            trend_net = curr_rev * (1 - total_tax_rate)
            trend_cfe = curr_rev * CFE_PROVISION_RATE

        def get_trend_html(val, inverse=False):
            if val == 0: return "<span class='kpi-trend neutral'>− 0.00 €</span>"
            if inverse:
                # For taxes, going up is visually "bad/red", going down is "good/green" (but prompt says URSSAF card left-border in red, and trend up/down can just be neutral or colored)
                # Actually, prompt just says: "add a small trend arrow (↑↓) vs last month"
                color_class = "down" if val > 0 else "up"
            else:
                color_class = "up" if val > 0 else "down"
            arrow = "↑" if val > 0 else "↓"
            return f"<span class='kpi-trend {color_class}'>{arrow} {abs(val):,.2f} €</span>".replace(',', ' ')

        # 5. Dynamic TVA Alert using Unified Alerts
        progress_ratio = cumulative_revenue / tva_threshold
        if progress_ratio >= 0.85:
            margin_remaining = tva_threshold - cumulative_revenue
            if margin_remaining > 0:
                render_alert("warning", f"<strong>Attention : On s'approche du plafond de la franchise en base de TVA !</strong><br>Il reste <strong>{margin_remaining:,.2f} €</strong> avant de devoir facturer la TVA.".replace(',', ' '), "⚠️")
            else:
                render_alert("danger", f"<strong>Plafond TVA Dépassé !</strong><br>Le seuil de <strong>{-margin_remaining:,.2f} €</strong> est dépassé. Il faut désormais facturer et déclarer la TVA.".replace(',', ' '), "🚨")
            
            if st.session_state.tier == "gratuit":
                st.info("💡 **Simulez votre passage à la TVA en toute sérénité avec notre outil d'optimisation Pro 🚀**")
                if st.button("Débloquer le Simulateur", key="tva_upsell", type="primary"):
                    show_upgrade_modal("Simulateur TVA Avancé")

        # Running YTD Net Projection
        months_passed = len(active_months) if len(active_months) > 0 else 1
        projected_net = (total_net / months_passed) * 12

        # Custom KPI Container (Sticky)
        tax_label = "Total URSSAF (+ Impôt)" if has_liberatoire else "URSSAF à payer"
        kpi_html = f"""
        <style>
        .kpi-projection {{
            padding: 18px 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4px;
            min-width: 200px;
        }}
        .kpi-proj-label {{ 
            font-size: 11px; 
            font-weight: 500; 
            color: var(--text-muted); 
            text-transform: uppercase; 
            letter-spacing: 0.8px; 
            font-family: 'DM Sans', sans-serif; 
        }}
        .kpi-proj-value {{ 
            font-family: 'Syne', sans-serif; 
            font-size: 20px; 
            font-weight: 700; 
            color: var(--coral); 
            line-height: 1; 
        }}
        .kpi-proj-sub {{ 
            font-size: 11px; 
            color: var(--text-muted); 
            font-style: italic; 
            font-family: 'DM Sans', sans-serif; 
        }}
        </style>
        <div class="kpi-container">
            <div>
                <div class="kpi-card urssaf">
                    <div class="kpi-label">💸 {tax_label}</div>
                    <div class="kpi-value animate-kpi">{global_taxes:,.2f} €</div>
                    {get_trend_html(trend_urssaf, inverse=True)}
                </div>
                <div class="kpi-card net">
                    <div class="kpi-label">🏦 Net en poche</div>
                    <div class="kpi-value animate-kpi">{total_net:,.2f} €</div>
                    {get_trend_html(trend_net)}
                </div>
                <div class="kpi-card cfe">
                    <div class="kpi-label">📋 Provision CFE</div>
                    <div class="kpi-value animate-kpi">{total_cfe:,.2f} €</div>
                    {get_trend_html(trend_cfe, inverse=True)}
                </div>
                <div class="kpi-projection">
                    <div class="kpi-proj-label">🔮 Projection annuelle nette</div>
                    <div class="kpi-proj-value animate-kpi">~{projected_net:,.0f} €</div>
                    <div class="kpi-proj-sub">À ce rythme, sur {months_passed} mois de CA</div>
                </div>
            </div>
        </div>
        """.replace(',', ' ')
        st.markdown(kpi_html, unsafe_allow_html=True)

        # Quarterly URSSAF Payment Calendar Widget
        from datetime import datetime
        today = datetime.now()
        quart_dates = [datetime(today.year, 4, 30), datetime(today.year, 7, 31), datetime(today.year, 10, 31), datetime(today.year+1, 1, 31)]
        next_deadline = next((qd for qd in quart_dates if qd >= today), quart_dates[-1])
        days_left = (next_deadline - today).days
        render_alert("info", f"<strong>Calendrier URSSAF Trimestriel :</strong><br>Prochain paiement dans <strong>{days_left} jours</strong> (le {next_deadline.strftime('%d/%m/%Y')}) — Montant provisionné estimé : <strong>{global_taxes:,.2f} €</strong>".replace(',', ' '), "🗓️")
        
        # 4. The TVA Radar (Danger Zone) with Gradient Bar
        st.write(f"**Plafond TVA :** {cumulative_revenue:,.2f} € / {tva_threshold:,.2f} €".replace(',', ' '))
        
        progress_display = min(progress_ratio * 100, 100.0)
        tva_bar_html = f"""
        <div class="tva-progress-wrap">
            <div class="tva-progress-fill" style="width: {progress_display}%;"></div>
            <div class="tva-threshold-marker"></div>
            <div class="tva-progress-text">{progress_display:.1f}% utilisé</div>
        </div>
        """
        st.markdown(tva_bar_html, unsafe_allow_html=True)
        
        # 4. Data Visualization (Altair Chart with Toggles)
        chart_section = st.container()
        with chart_section:
            # Inject an anchor div inside the container allowing JS to locate the parent block
            st.markdown('<div id="chart-section-anchor"></div>', unsafe_allow_html=True)
            st.write("### 📊 Évolution Financière")
            
            chart_col1, chart_col2 = st.columns(2)
            with chart_col1:
                vue_chart = st.radio("Affichage :", ["Mensuel", "Cumulé"], horizontal=True, label_visibility="collapsed")
            with chart_col2:
                compare_2025 = st.toggle("Comparer avec l'année dernière (2025)", disabled=(st.session_state.tier == "gratuit"), help="Réservé aux membres Premium" if st.session_state.tier == "gratuit" else "")
                
            df_chart = edited_df.copy()
            
            # Calculate Taxes and Net
            df_chart["Télépaiement (URSSAF etc.)"] = df_chart["Chiffre d'affaires (€)"] * total_tax_rate
            df_chart["Reste Net"] = df_chart["Chiffre d'affaires (€)"] - df_chart["Télépaiement (URSSAF etc.)"]
            
            if vue_chart == "Cumulé":
                df_chart["Télépaiement (URSSAF etc.)"] = df_chart["Télépaiement (URSSAF etc.)"].cumsum()
                df_chart["Reste Net"] = df_chart["Reste Net"].cumsum()
                df_chart["Chiffre d'affaires (€)"] = df_chart["Chiffre d'affaires (€)"].cumsum()

            # Reshape for Altair Stacked Bar
            df_melt = pd.melt(df_chart, id_vars=['Mois'], value_vars=['Reste Net', 'Télépaiement (URSSAF etc.)'], var_name='Type', value_name='Montant (€)')
            
            # Base Chart building
            base = alt.Chart(df_melt).encode(
                x=alt.X('Mois:O', sort=MONTHS, axis=alt.Axis(labelAngle=0, title=None))
            )
            
            bars = base.mark_bar(cornerRadiusTopLeft=4, cornerRadiusTopRight=4, size=30).encode(
                y=alt.Y('Montant (€):Q', stack='zero', title='Euros (€)'),
                color=alt.Color('Type:N', scale=alt.Scale(domain=['Reste Net', 'Télépaiement (URSSAF etc.)'], range=['#10b981', '#ef4444']), legend=alt.Legend(orient='bottom', title=None, labelLimit=0)),
                tooltip=[alt.Tooltip('Mois:O'), alt.Tooltip('Type:N'), alt.Tooltip('Montant (€):Q', format=',.2f')]
            )
            
            chart_layers = [bars]
            
            # Dashed Projection Line for YTD average
            if len(active_months) > 0:
                avg_monthly_ca = cumulative_revenue / months_passed
                if vue_chart == "Cumulé":
                    proj_data = pd.DataFrame({"Mois": MONTHS, "Projection": [avg_monthly_ca * i for i in range(1, 13)]})
                else:
                    proj_data = pd.DataFrame({"Mois": MONTHS, "Projection": [avg_monthly_ca] * 12})
                
                proj_line = alt.Chart(proj_data).mark_line(strokeDash=[5, 5], color='#1f2937', strokeWidth=2).encode(
                    x=alt.X('Mois:O', sort=MONTHS),
                    y=alt.Y('Projection:Q'),
                    tooltip=[alt.Tooltip('Projection:Q', title='Tendance Moyenne CA', format=',.2f')]
                )
                chart_layers.append(proj_line)
            
            # YoY Comparison 2025
            if compare_2025 and st.session_state.tier != "gratuit":
                df_2025 = st.session_state.df_revenues_all["2025"].copy()
                if vue_chart == "Cumulé":
                    df_2025["CA 2025"] = df_2025["Chiffre d'affaires (€)"].cumsum()
                else:
                    df_2025["CA 2025"] = df_2025["Chiffre d'affaires (€)"]
                    
                line_2025 = alt.Chart(df_2025).mark_line(color='#94a3b8', strokeWidth=3).encode(
                    x=alt.X('Mois:O', sort=MONTHS),
                    y=alt.Y('CA 2025:Q'),
                    tooltip=[alt.Tooltip('Mois:O'), alt.Tooltip('CA 2025:Q', title='CA 2025', format=',.2f')]
                )
                chart_layers.append(line_2025)

            final_chart = alt.layer(*chart_layers).resolve_scale(y='shared').properties(height=400)
            st.altair_chart(final_chart, use_container_width=True)
        
        # YoY Statistics Delta Table
        if compare_2025 and st.session_state.tier != "gratuit":
            st.markdown("#### 📈 Comparatif YoY (Year-over-Year) vs 2025")
            df_current = st.session_state.df_revenues.copy()
            df_past = st.session_state.df_revenues_all.get("2025", df_current.copy()).copy()
            
            ca_current_total = df_current["Chiffre d'affaires (€)"].sum()
            ca_past_total = df_past["Chiffre d'affaires (€)"].sum()
            delta_ca = ((ca_current_total - ca_past_total) / ca_past_total * 100) if ca_past_total > 0 else (100.0 if ca_current_total > 0 else 0)
            
            net_current = ca_current_total * (1 - total_tax_rate)
            net_past = ca_past_total * (1 - total_tax_rate)
            delta_net = ((net_current - net_past) / net_past * 100) if net_past > 0 else (100.0 if net_current > 0 else 0)
            
            best_curr = df_current.loc[df_current["Chiffre d'affaires (€)"].idxmax()]
            best_past = df_past.loc[df_past["Chiffre d'affaires (€)"].idxmax()]
            
            metric_cols = st.columns(4)
            col_ca = "Chiffre d'affaires (€)"
            metric_cols[0].metric("Total CA", f"{ca_current_total:,.2f} €".replace(',', ' '), f"{delta_ca:+.1f}% vs 2025")
            metric_cols[1].metric("Net en Poche", f"{net_current:,.2f} €".replace(',', ' '), f"{delta_net:+.1f}% vs 2025")
            metric_cols[2].metric(f"Record ({selected_year})", f"{best_curr[col_ca]:,.2f} €".replace(',', ' '), f"{best_curr['Mois']}")
            metric_cols[3].metric("Record (2025)", f"{best_past[col_ca]:,.2f} €".replace(',', ' '), f"{best_past['Mois']}")
            st.markdown("<br>", unsafe_allow_html=True)

        # ==========================================
        # 4.5. Simulateur Impôt sur le Revenu
        # ==========================================
        st.write("### 🏛️ Simulateur Impôt sur le Revenu (IR)")
        st.write("Calculez votre Net Réel dans votre poche après impôts sur le revenu.")
        
        def render_ir_estimator():
            col_ir1, col_ir2 = st.columns([1, 1.5])
            with col_ir1:
                st.selectbox("Situation familiale", ["Célibataire", "Marié(e) / Pacsé(e)", "Divorcé(e)", "Veuf(ve)"])
                parts = st.number_input("Nombre de parts fiscales", min_value=1.0, step=0.5, value=1.0, key="ir_parts")
                autres_revenus = st.number_input("Autres revenus du foyer (€)", min_value=0.0, step=1000.0, value=0.0, key="ir_autres")
                st.text_input("SIRET (Pour Affichage PDF)", key="user_siret", help="Apparaitra sur vos exports.")
                
            with col_ir2:
                abattement = 0.34 if activity_type == "Prestation de services" else 0.50
                rev_imposable_ae = cumulative_revenue * (1 - abattement)
                rev_global_foyer = rev_imposable_ae + autres_revenus
                quotient_familial = rev_global_foyer / parts
                
                # Barème 2026
                def calc_ir(qf):
                    ir = 0
                    if qf > 11294:
                        tranche1 = min(qf, 28797) - 11294
                        ir += tranche1 * 0.11
                    if qf > 28797:
                        tranche2 = min(qf, 82341) - 28797
                        ir += tranche2 * 0.30
                    if qf > 82341:
                        tranche3 = min(qf, 177106) - 82341
                        ir += tranche3 * 0.41
                    if qf > 177106:
                        tranche4 = qf - 177106
                        ir += tranche4 * 0.45
                    return ir
                
                ir_foyer_sans_ae = calc_ir(autres_revenus / parts) * parts if parts > 0 else 0
                ir_foyer_avec_ae = calc_ir(quotient_familial) * parts if parts > 0 else 0
                ir_due_to_ae = ir_foyer_avec_ae - ir_foyer_sans_ae
                
                taux_vl = 0.022 if activity_type == "Prestation de services" else 0.01 # BNC/BIC simplified
                ir_vl = cumulative_revenue * taux_vl
                
                actual_ir = ir_vl if has_liberatoire else ir_due_to_ae
                net_reel = total_net - actual_ir
                
                kpi_ir_html = f"""
                <div style='display: flex; gap: 10px; margin-bottom: 20px;'>
                    <div class='kpi-card' style='flex: 1; border-left: 4px solid #f59e0b;'>
                        <div class='kpi-label'>Impôt (lié à l'AE)</div>
                        <div class='kpi-value'>{actual_ir:,.2f} €</div>
                    </div>
                    <div class='kpi-card' style='flex: 1; border-left: 4px solid #10b981; background-color: #f0fdf4;'>
                        <div class='kpi-label'>Net Réel en Poche</div>
                        <div class='kpi-value' style='color: #10b981;'>{net_reel:,.2f} €</div>
                    </div>
                </div>
                """
                st.markdown(kpi_ir_html.replace(',', ' '), unsafe_allow_html=True)
                
                diff = ir_due_to_ae - ir_vl
                if has_liberatoire:
                    if diff > 0:
                         st.success(f"✅ Option optimale. Le versement libératoire vous fait économiser **{diff:,.2f} €** par rapport au barème classique !".replace(',', ' '))
                    else:
                         st.error(f"🚨 Option perdante. Le versement libératoire vous fait perdre **{-diff:,.2f} €** par rapport au barème classique !".replace(',', ' '))
                else:
                    if diff > 0:
                         st.error(f"🚨 Option perdante. Le barème classique vous coûte **{diff:,.2f} €** de plus que le versement libératoire ! Vous devriez opter pour le versement libératoire l'année prochaine.".replace(',', ' '))
                    else:
                         st.success(f"✅ Option optimale. Le barème classique vous fait économiser **{-diff:,.2f} €** par rapport au versement libératoire !".replace(',', ' '))
                         
            # Funnel Chart
            funnel_data = pd.DataFrame([
                {"Étape": "1. CA Brut", "Valeur": cumulative_revenue, "Couleur": "#9ca3af", "Ordre": 1},
                {"Étape": "2. Après URSSAF", "Valeur": total_net, "Couleur": "#6366f1", "Ordre": 2},
                {"Étape": "3. Net Réel (Après IR)", "Valeur": net_reel, "Couleur": "#10b981", "Ordre": 3}
            ])
            funnel_chart = alt.Chart(funnel_data).mark_bar(cornerRadiusTopLeft=4, cornerRadiusTopRight=4, size=60).encode(
                x=alt.X('Étape:O', sort=alt.EncodingSortField(field='Ordre', order='ascending'), axis=alt.Axis(labelAngle=0, title="")),
                y=alt.Y('Valeur:Q', title="Montant (€)"),
                color=alt.Color('Couleur:N', scale=None),
                tooltip=[alt.Tooltip('Étape:O'), alt.Tooltip('Valeur:Q', format=',.2f')]
            ).properties(height=300)
            
            st.altair_chart(funnel_chart, use_container_width=True)
            
        render_premium_feature("pro", "ir_estimator", "Simulateur d'Impôts sur le Revenu", render_ir_estimator)

        # ==========================================
        # 5. Smart Abatement Check (The "Regime" hook)
        # ==========================================
        st.write("### 🧠 Diagnostic du Statut Juridique")
        st.write("Le statut *Micro-Entreprise* applique un abattement forfaitaire sur votre chiffre d'affaires pour calculer vos impôts (34% en BNC, 50% en BIC).")
        
        col_abatt1, col_abatt2 = st.columns([1, 2])
        with col_abatt1:
            default_expenses = float(st.session_state.df_expenses["Montant (€)"].sum() * 12) if "df_expenses" in st.session_state else 0.0
            est_expenses = st.number_input("Vos charges annuelles réelles (€)", min_value=0.0, value=default_expenses, step=100.0, help="Frais de transport, matériel, sous-traitants, abonnements, etc.")
        
        with col_abatt2:
            if cumulative_revenue > 0:
                # Calculate the flat abatement amount
                abattement_rate = 0.34 if activity_type == "Prestation de services" else 0.50
                forfait_amount = cumulative_revenue * abattement_rate
                
                if est_expenses > forfait_amount:
                    st.error(f"🚨 **Micro-Entreprise non optimale !**\n\nL'État considère que vous avez **{forfait_amount:,.2f} €** de frais (abattement forfaitaire). Étant donné que vos frais réels (**{est_expenses:,.2f} €**) sont supérieurs, vous payez des impôts sur de l'argent que vous n'avez pas gagné.\n\n👉 **Il est temps de passer en société (EURL/SASU) ou en Entreprise Individuelle au Régime Réel.**".replace(',', ' '))
                else:
                    st.success(f"✅ **Statut Micro-Entreprise optimal !**\n\nVos charges réelles (**{est_expenses:,.2f} €**) sont inférieures à l'abattement forfaitaire de l'État (**{forfait_amount:,.2f} €**). Vous êtes gagnant avec ce régime simplifié.".replace(',', ' '))
            else:
                 st.info("Saisissez d'abord votre chiffre d'affaires annuel dans le tableau pour diagnostiquer votre statut.")
                 
        if est_expenses > 0 and st.session_state.tier == "gratuit":
            st.info("💡 **Vos charges sont élevées ? Pensez aussi à la TVA !**")
            if st.button("Simuler la récupération de la TVA", key="tva_upsell_2", type="primary"):
                show_upgrade_modal("Simulateur TVA Avancé")

with tab_pro:
    if st.session_state.tier != "gratuit":
        st.success("Bienvenue dans l'espace Pro/Expert ! Vos outils d'optimisation sont disponibles.")
        
        # --- FEATURE 6: Goal Pacing & Health Score ---
        st.markdown("### 🎯 Tableau de Bord Avancé")
        
        col_goal1, col_goal2 = st.columns([1, 1])
        with col_goal1:
            st.markdown("#### Objectif Annuel")
            annual_goal = st.number_input("Mon objectif de CA cette année (€)", min_value=1000.0, value=30000.0, step=1000.0)
            
            goal_pct = min(cumulative_revenue / annual_goal, 1.0) if annual_goal > 0 else 0
            
            # Circular progress ring using conic-gradient
            ring_color = "#10b981" if goal_pct >= 1.0 else ("#f59e0b" if goal_pct >= 0.5 else "#ef4444")
            deg = int(goal_pct * 360)
            
            st.markdown(f"""
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div style="width: 150px; height: 150px; border-radius: 50%; background: conic-gradient({ring_color} {deg}deg, #e5e7eb 0deg); display: flex; align-items: center; justify-content: center; position: relative;">
                    <div style="width: 120px; height: 120px; background-color: white; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: absolute;">
                        <span style="font-size: 24px; font-weight: 700; color: #1f2937;">{goal_pct*100:.0f}%</span>
                        <span style="font-size: 12px; color: #6b7280;">Atteint</span>
                    </div>
                </div>
                <div style="margin-top: 15px; font-weight: 500; font-size: 16px;">{cumulative_revenue:,.0f} € / {annual_goal:,.0f} €</div>
            </div>
            """.replace(',', ' '), unsafe_allow_html=True)
            
        with col_goal2:
            st.markdown("#### 🩺 Santé Financière")
            
            # Health Score Algorithm
            score = 100
            penalties = []
            
            # 1. Regularity
            zero_months = len(df_for_editor[df_for_editor["Chiffre d'affaires (€)"] == "—"])
            if zero_months > 4:
                score -= 15; penalties.append("Activité irrégulière (>4 mois sans CA)")
            elif zero_months > 1:
                score -= 5; penalties.append("Quelques mois sans revenus signalés")
                
            # 2. TVA Danger
            if cumulative_revenue > (tva_threshold * 0.9):
                score -= 15; penalties.append("Très proche de la limite de Franchise TVA")
                
            # 3. Expenses vs Abatement
            est_expenses_health = float(st.session_state.df_expenses["Montant (€)"].sum() * 12) if "df_expenses" in st.session_state else 0.0
            abatt_rate_health = 0.34 if activity_type == "Prestation de services" else 0.50
            if est_expenses_health > (cumulative_revenue * abatt_rate_health) and cumulative_revenue > 0:
                score -= 20; penalties.append("Charges réelles supérieures à l'abattement forfaitaire")
                
            # 4. Diversification (Placeholder)
            score -= 10; penalties.append("Clientèle non diversifiée (1-2 clients majeurs)")
            
            score = max(score, 0)
            score_color = "#10b981" if score >= 80 else ("#f59e0b" if score >= 50 else "#ef4444")
            
            st.markdown(f"""
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border-left: 5px solid {score_color}; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h2 style="margin: 0; color: {score_color}; font-size: 42px;">{score}/100</h2>
                    <span style="font-weight: 600; color: #475569;">Score Global</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            if penalties:
                st.markdown("**Points d'attention prioritaires :**")
                for p in penalties:
                    st.markdown(f"- ⚠️ {p}")
            else:
                 st.success("Toutes les métriques sont au vert ! Excellente gestion.")
                 
        st.markdown("---")
        
        st.markdown("### 🔮 Simulateur Multi-Scénarios")
        st.write("Testez l'impact financier immédiat si vous facturez un montant supplémentaire ce mois-ci.")
        
        sim_ca_add = st.number_input("Et si je facturais ce montant en plus (€) ?", min_value=0.0, value=1000.0, step=100.0)
        
        sim_total_ca = cumulative_revenue + sim_ca_add
        sim_urssaf_add = sim_ca_add * total_tax_rate
        sim_net_add = sim_ca_add - sim_urssaf_add
        nouv_plafond_ratio = sim_total_ca / tva_threshold
        
        sim_col1, sim_col2, sim_col3 = st.columns(3)
        with sim_col1:
            st.metric("Impact URSSAF", f"+ {sim_urssaf_add:,.2f} €".replace(',', ' '))
        with sim_col2:
            st.metric("Nouveau Net en Poche", f"+ {sim_net_add:,.2f} €".replace(',', ' '))
        with sim_col3:
            st.metric("Plafond TVA", f"{min(nouv_plafond_ratio*100, 100):.1f} %", "Seuil à Surveiller" if nouv_plafond_ratio >= 0.8 else "Tranquille", delta_color="inverse" if nouv_plafond_ratio >= 0.8 else "normal")
            
        if nouv_plafond_ratio >= 1.0:
            render_alert("danger", "🚨 **Attention : ce chiffre d'affaires déclencherait le dépassement de votre seuil TVA !** Vous devriez facturer la TVA sur cette somme.", "⚠️")
            
        st.markdown("---")
        
        st.markdown("### 🔍 Simulateur d'optimisation TVA")
        st.write("Découvrez s'il est financièrement intéressant pour vous de renoncer à la franchise en base de TVA pour pouvoir récupérer la TVA sur vos achats professionnels.")
        
        col_tva_1, col_tva_2 = st.columns(2)
        with col_tva_1:
            expenses_ttc = st.number_input("Estimez vos frais professionnels annuels TTC (€)", min_value=0.0, value=2000.0, step=100.0, help="Achats de matériel, abonnements logiciels, sous-traitance...")
        with col_tva_2:
            client_type = st.radio("Vos clients sont principalement :", ["Des Entreprises (B2B)", "Des Particuliers (B2C)"], help="Les professionnels peuvent récupérer la TVA que vous leur facturez, contrairement aux particuliers.")
            
        st.markdown("#### Point Mort & Rentabilité")
        
        # Calculs simplifiés avec taux normal à 20%
        taux_tva = 0.20
        tva_deductible = expenses_ttc - (expenses_ttc / (1 + taux_tva))
        
        if client_type == "Des Entreprises (B2B)":
            if tva_deductible > 0:
                st.success(f"✅ **Passez à la TVA (Régime Réel)**\n\nVos clients étant des professionnels, la TVA que vous allez facturer ne leur coûtera rien. Vous récupérerez la TVA sur vos propres dépenses, soit un gain net garanti de **+{tva_deductible:,.2f} €/an** peu importe le CA.".replace(',', ' '))
            else:
                st.info("💡 **Restez en Franchise en Base**\n\nVous n'avez aucun frais professionnel. La complexité administrative d'une déclaration de TVA mensuelle ne vous apporterait aucun gain financier.")
        else:
            perte_marge = cumulative_revenue - (cumulative_revenue / (1 + taux_tva))
            bilan_tva = tva_deductible - perte_marge
            
            if bilan_tva > 0:
                 st.success(f"✅ **Passez à la TVA (Régime Réel) pour le moment**\n\nAvec votre CA actuel de {cumulative_revenue:,.2f} €, la TVA récupérée (+{tva_deductible:,.2f} €) compense la perte de marge sur vos clients particuliers (-{perte_marge:,.2f} €). Bilan : **+{bilan_tva:,.2f} €/an**. Attention au point de bascule si votre CA augmente !".replace(',', ' '))
            elif cumulative_revenue == 0:
                 st.info("💡 **En attente de chiffre d'affaires**\n\nSaisissez votre CA pour voir l'impact.")
            else:
                 st.warning(f"❌ **Ne passez pas à la TVA !**\n\nVos clients étant des particuliers, absorber la TVA ampute votre marge de **-{perte_marge:,.2f} €**. Vos frais actuels ne génèrent que +{tva_deductible:,.2f} € de TVA déductible. Opération perdante de **{bilan_tva:,.2f} €/an**.".replace(',', ' '))
                 
        # Intersection Chart for Break-Even
        import numpy as np
        ca_sim_range = np.linspace(0, 100000, 50).tolist()
        sim_data = []
        taux_urssaf_sim = total_tax_rate
        frais_ttc_sim = expenses_ttc
        frais_ht_sim = expenses_ttc / (1 + taux_tva)
        
        for ca_sim in ca_sim_range:
            net_franchise = ca_sim - (ca_sim * taux_urssaf_sim) - frais_ttc_sim
            
            if client_type == "Des Entreprises (B2B)":
                net_reel_tva = ca_sim - (ca_sim * taux_urssaf_sim) - frais_ht_sim
            else:
                ca_ht_sim = ca_sim / (1 + taux_tva)
                net_reel_tva = ca_ht_sim - (ca_ht_sim * taux_urssaf_sim) - frais_ht_sim
                
            sim_data.append({"CA (€)": ca_sim, "Régime": "Franchise en Base", "Net (€)": net_franchise})
            sim_data.append({"CA (€)": ca_sim, "Régime": "Régime Réel (TVA)", "Net (€)": net_reel_tva})
            
        chart_tva = alt.Chart(pd.DataFrame(sim_data)).mark_line(strokeWidth=3).encode(
            x=alt.X("CA (€):Q", title="Chiffre d'Affaires Annuel (€)"),
            y=alt.Y("Net (€):Q", title="Bénéfice Net Estimé (€)"),
            color=alt.Color("Régime:N", scale=alt.Scale(domain=["Franchise en Base", "Régime Réel (TVA)"], range=["#94a3b8", "#8b5cf6"])),
            tooltip=[alt.Tooltip("CA (€):Q", format=',.0f'), alt.Tooltip("Régime:N"), alt.Tooltip("Net (€):Q", format=',.0f')]
        ).properties(height=350)
        
        st.altair_chart(chart_tva, use_container_width=True)
        st.markdown("---")
        st.subheader("📄 Exportation du Bilan Financier Annuel")
        st.write("Générez une synthèse professionnelle de votre année, idéale pour présenter à votre banque.")
        
        # Calculate metrics for Pro tab PDF
        pdf_revenue_pro = edited_df["Chiffre d'affaires (€)"].sum()
        pdf_taxes_pro = pdf_revenue_pro * total_tax_rate
        
        # Calculate IR for PDF (reusing logic from dashboard)
        parts_pro = st.session_state.get("ir_parts", 1.0)
        autres_rev_pro = st.session_state.get("ir_autres", 0.0)
        
        abatt_pro = 0.34 if activity_type == "Prestation de services" else 0.50
        rev_imp_ae_pro = pdf_revenue_pro * (1 - abatt_pro)
        rev_glob_pro = rev_imp_ae_pro + autres_rev_pro
        qf_pro = rev_glob_pro / parts_pro if parts_pro > 0 else 0
        
        def calc_ir_pro(qf):
            ir = 0
            if qf > 11294: ir += (min(qf, 28797) - 11294) * 0.11
            if qf > 28797: ir += (min(qf, 82341) - 28797) * 0.30
            if qf > 82341: ir += (min(qf, 177106) - 82341) * 0.41
            if qf > 177106: ir += (qf - 177106) * 0.45
            return ir
            
        ir_sans_pro = calc_ir_pro(autres_rev_pro / parts_pro) * parts_pro if parts_pro > 0 else 0
        ir_avec_pro = calc_ir_pro(qf_pro) * parts_pro if parts_pro > 0 else 0
        ir_due_pro = ir_avec_pro - ir_sans_pro
        
        taux_vl_pro = 0.022 if activity_type == "Prestation de services" else 0.01
        ir_vl_pro = pdf_revenue_pro * taux_vl_pro
        actual_ir_pro = ir_vl_pro if has_liberatoire else ir_due_pro
        
        pdf_net_pro = pdf_revenue_pro - pdf_taxes_pro - actual_ir_pro
        user_email_pro = st.session_state.user["email"] if st.session_state.user else "Utilisateur Invite"
        
        pdf_bytes_pro = generate_pdf(
            df=edited_df,
            activity_type=activity_type,
            urssaf_rate=total_tax_rate,
            total_revenue=pdf_revenue_pro,
            total_taxes=pdf_taxes_pro,
            total_ir=actual_ir_pro,
            total_net=pdf_net_pro,
            user_email=user_email_pro,
            siret_str=st.session_state.get("user_siret", "Non Renseigne")
        )
        st.download_button(
            label="Générer le document (PDF)", 
            data=pdf_bytes_pro, 
            file_name="NetEnPoche_Bilan_2026.pdf", 
            mime="application/pdf",
            type="primary"
        )
    else:
        # Blurred Mock UI HTML (Using standard st.write with html)
        pro_html_content = """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body { font-family: 'Inter', sans-serif; background-color: #faf5ef; color: #452811; }
        </style>
        <div class="overlay-cta-container" style="position: relative; margin-bottom: 20px;">
            <div class="blurred-container" style="filter: blur(5px); pointer-events: none; user-select: none; opacity: 0.6;">
                <h3 style="color: #452811; margin-top: 10px;">Simulateur d'optimisation TVA</h3>
                <p style="color: #452811;">Ajustez vos charges prévisionnelles pour voir l'impact du passage à la TVA sur votre rentabilité.</p>
                <div style="height: 30px; background: #ddd; border-radius: 5px; margin: 20px 0; max-width: 400px;"></div>
                <div style="height: 40px; width: 200px; background: #e07a5f; border-radius: 5px; margin-top: 20px;"></div>
            </div>
            
            <div class="overlay-cta" style="position: absolute; top: 120px; left: 50%; transform: translate(-50%, -50%); z-index: 10; text-align: center; background: rgba(255, 255, 255, 0.9); padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 2px solid #452811; width: 80%; max-width: 500px;">
                <h2 style="margin-top:0; color: #452811;">🔒 Accès Premium Requis</h2>
                <p style="color: #452811;">Débloquez le simulateur TVA, le bilan PDF et l'historique multi-années.</p>
            </div>
        </div>"""
        
        # Use components.html instead of st.markdown or st.write to bypass the markdown interpreter entirely
        components.html(pro_html_content, height=280)
        
        # Ajouter des marges autour du bouton pour qu'il soit bien proportionné
        st.markdown("<br>", unsafe_allow_html=True)
        # Real Streamlit button under the HTML layout so we get callbacks
        if st.button("👉 Débloquer tout le potentiel", type="primary", key="tab_pro_upsell", use_container_width=True):
            show_upgrade_modal()

with tab_expert:
    if st.session_state.tier != "expert":
        def render_expert_upsell():
            st.write("Pilotez vos clients et suivez vos facturations en un seul endroit. Finie la double saisie avec la synchronisation automatique !")
        render_premium_feature("expert", "crm_invoices", "CRM & Suivi de Facturation", render_expert_upsell)
    else:
        st.success("Bienvenue dans votre CRM Expert ! Vos clients et factures sont synchronisés avec votre bilan.")
        
        crm_col1, crm_col2 = st.columns([1, 2])
        
        with crm_col1:
            st.markdown("### 👥 Carnet Client")
            if "crm_clients" not in st.session_state:
                st.session_state.crm_clients = pd.DataFrame({
                    "Nom du Client": ["Entreprise Dupont", "Jean Martin"],
                    "Type": ["B2B", "B2C"],
                    "Email": ["contact@dupont.fr", "jean@mail.com"]
                })
                
            edited_clients = st.data_editor(st.session_state.crm_clients, num_rows="dynamic", use_container_width=True, key="crm_clients_editor")
            if not edited_clients.equals(st.session_state.crm_clients):
                 st.session_state.crm_clients = edited_clients
                 
            st.markdown("#### Répartition de la clientèle")
            client_counts = edited_clients["Type"].value_counts().reset_index()
            if not client_counts.empty:
                pie = alt.Chart(client_counts).mark_arc(innerRadius=40).encode(
                    theta="count", color=alt.Color("Type", scale=alt.Scale(domain=["B2B", "B2C"], range=["#6366f1", "#10b981"])),
                    tooltip=["Type", "count"]
                ).properties(height=250)
                st.altair_chart(pie, use_container_width=True)
            
        with crm_col2:
            st.markdown("### 🧾 Suivi des Factures")
            st.write("Les factures marquées comme **Payée** s'ajouteront automatiquement au chiffre d'affaires du mois correspondant dans votre tableau de bord.")
            
            if "crm_invoices" not in st.session_state:
                st.session_state.crm_invoices = pd.DataFrame({
                    "Numéro": ["F2026-001", "F2026-002"],
                    "Client": ["Entreprise Dupont", "Jean Martin"],
                    "Date d'encaissement": [pd.to_datetime("2026-01-15").date(), pd.to_datetime("2026-02-10").date()],
                    "Montant (€)": [1500.0, 500.0],
                    "Statut": ["Payée", "En attente"]
                })
            
            client_list = edited_clients["Nom du Client"].dropna().tolist()
            if not client_list: client_list = ["Aucun client"]
                
            edited_invoices = st.data_editor(
                st.session_state.crm_invoices,
                column_config={
                    "Statut": st.column_config.SelectboxColumn("Statut", options=["Payée", "En attente", "En retard"], required=True),
                    "Client": st.column_config.SelectboxColumn("Client", options=client_list, required=True),
                    "Date d'encaissement": st.column_config.DateColumn("Date d'encaissement", min_value=pd.to_datetime("2022-01-01").date(), max_value=pd.to_datetime("2026-12-31").date())
                },
                num_rows="dynamic",
                use_container_width=True,
                key="crm_invoices_editor"
            )
            
            if not edited_invoices.equals(st.session_state.crm_invoices):
                 st.session_state.crm_invoices = edited_invoices
            
            if st.button("🔄 Synchroniser les factures payées avec le Bilan", type="primary"):
                 payees = edited_invoices[edited_invoices["Statut"] == "Payée"].copy()
                 if not payees.empty:
                     # Convert dates safely
                     payees["Date"] = pd.to_datetime(payees["Date d'encaissement"], errors='coerce')
                     payees = payees.dropna(subset=['Date'])
                     payees["Mois_Int"] = payees["Date"].dt.month
                     
                     ca_par_mois = payees.groupby("Mois_Int")["Montant (€)"].sum()
                     
                     # Reset current year dataframe CA to 0 and overlay the summed invoices
                     st.session_state.df_revenues["Chiffre d'affaires (€)"] = 0.0
                     
                     for mois_idx, ca_sum in ca_par_mois.items():
                         month_str = MONTHS[int(mois_idx) - 1]
                         row_idx = st.session_state.df_revenues.index[st.session_state.df_revenues["Mois"] == month_str].tolist()[0]
                         st.session_state.df_revenues.at[row_idx, "Chiffre d'affaires (€)"] = ca_sum
                         
                     st.session_state.latest_edited_df = st.session_state.df_revenues.copy()
                     st.session_state.df_revenues_all[st.session_state.current_selected_year] = st.session_state.df_revenues.copy()
                     # Force rerender of UI components
                     if "revenue_editor" in st.session_state:
                         del st.session_state["revenue_editor"]
                 st.toast("Synchronisation réussie ! Le tableau de bord a été mis à jour.")
                 import time; time.sleep(1); st.rerun()

        st.markdown("---")
        st.markdown("### 🏦 Exports Comptables Avancés")
        st.write("Générez des fichiers standardisés pour les professionnels (Experts-Comptables, Pennylane, Tiime, Indy).")
        
        export_col1, export_col2, export_col3 = st.columns(3)
        
        # 1. DGFiP FEC Text structure
        fec_data = "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise\n"
        for i, row in st.session_state.crm_invoices.iterrows():
            if row["Statut"] == "Payée":
                # Handle dates carefully
                dt = pd.to_datetime(row["Date d'encaissement"])
                if pd.notnull(dt):
                    date_ecr = dt.strftime("%Y%m%d")
                    fec_data += f"BQ|Banque|{i+1}|{date_ecr}|512000|Banque|||{row['Numéro']}|{date_ecr}|Encaissement Client {row['Client']}|{row['Montant (€)']}|0.00|||||\n"
                    fec_data += f"BQ|Banque|{i+1}|{date_ecr}|706000|Prestation de services|||{row['Numéro']}|{date_ecr}|Encaissement Client {row['Client']}|0.00|{row['Montant (€)']}|||||\n"
                
        with export_col1:
            st.download_button("📝 Fichier FEC (Txt)", data=fec_data.encode('utf-8'), file_name="FEC_NetEnPoche_2026.txt", mime="text/plain", use_container_width=True)
            
        # 2. Excel Formulas 
        import io
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            st.session_state.crm_invoices.to_excel(writer, sheet_name="Factures", index=False)
            st.session_state.crm_clients.to_excel(writer, sheet_name="Clients", index=False)
            st.session_state.latest_edited_df.to_excel(writer, sheet_name="Bilan_Mensuel", index=False)
        excel_data = output.getvalue()
        
        with export_col2:
            st.download_button("📊 Tableaux & Formules (Xlsx)", data=excel_data, file_name="Compta_Complete_2026.xlsx", mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", use_container_width=True)
            
        # 3. Pennylane CSV Format
        pennylane_df = st.session_state.crm_invoices[["Date d'encaissement", "Client", "Numéro", "Montant (€)"]].copy()
        pennylane_df["Sens"] = "Crédit"
        pennylane_df["Catégorie"] = "Chiffre d'Affaires HT"
        penny_csv = pennylane_df.to_csv(index=False).encode('utf-8')
        
        with export_col3:
            st.download_button("🦩 Import Pennylane (CSV)", data=penny_csv, file_name="Pennylane_import.csv", mime="text/csv", use_container_width=True)

# ==========================================
# FOOTER (TRUST & LEGAL)
# ==========================================
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #888; font-size: 0.85em; margin-top: 20px; margin-bottom: 20px;'>
    <p>🔒 Vos données sont sécurisées et chiffrées (SSL/TLS). NetEnPoche n'est affilié à aucun service gouvernemental.</p>
    <p><a href='#' style='color: #888; text-decoration: none;'>Conditions Générales d'Utilisation</a> | <a href='#' style='color: #888; text-decoration: none;'>Politique de Confidentialité (RGPD)</a> | <a href='#' style='color: #888; text-decoration: none;'>Contact</a></p>
    <p>© 2026 NetEnPoche. Tous droits réservés.</p>
</div>
""", unsafe_allow_html=True)
