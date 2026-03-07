export const TAX_RATES_2026 = {
  URSSAF: {
    SERVICES_BIC: 0.212, // 21.2%
    SERVICES_BNC: 0.211, // 21.1%
    LIBERAL: 0.211,      // 21.1%
    VENTE: 0.123,        // 12.3%
  },
  ACRE_MULTIPLIER: 0.5, // 50% discount for ACRE
  ABATTEMENT_IR: {
    SERVICES_BIC: 0.50, // 50%
    SERVICES_BNC: 0.50, // 50%
    LIBERAL: 0.34,      // 34%
    VENTE: 0.71,        // 71%
  },
  VERSEMENT_LIBERATOIRE: {
    SERVICES_BIC: 0.017, // 1.7%
    SERVICES_BNC: 0.022, // 2.2%
    LIBERAL: 0.022,      // 2.2%
    VENTE: 0.01,         // 1.0%
  },
  IR_BAREME: [
    { max: 11294, rate: 0.0 },
    { max: 28797, rate: 0.11 },
    { max: 82341, rate: 0.30 },
    { max: 177106, rate: 0.41 },
    { max: Infinity, rate: 0.45 },
  ],
  TVA_THRESHOLDS_FRANCHISE: {
    SERVICES: 39100,
    VENTE: 91900,
  },
  CFE_RATE: 0.015,       // 1.5% minimum provision
  CFE_MAX_PROVISION: 2285,
};
