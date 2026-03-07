import {
    getUrssafRate,
    calculateUrssaf,
    getAbattement,
    calculateIR,
    calculateCFEProvision,
    getTVAStatus,
    calculateQuarterlyURSSAF,
    calculateNetReel,
    calculateAnnualProjection,
    calculateHealthScore
} from './index';

describe('Tax Engine Calculations (2026 Rates)', () => {
    describe('URSSAF', () => {
        it('returns correct rates for Vente with and without ACRE', () => {
            expect(getUrssafRate('vente', false)).toBe(0.123);
            expect(getUrssafRate('vente', true)).toBe(0.0615); // 12.3% * 50%
        });

        it('returns correct rates for Services BNC with and without ACRE', () => {
            expect(getUrssafRate('services_bnc', false)).toBe(0.211);
            expect(getUrssafRate('services_bnc', true)).toBe(0.1055);
        });

        it('calculates total URSSAF liability correctly', () => {
            expect(calculateUrssaf(10000, 'services_bic', false)).toBe(2120);
            expect(calculateUrssaf(10000, 'liberal', true)).toBe(1055);
        });
    });

    describe('Impôt sur le Revenu (IR)', () => {
        it('returns correct abattement rates', () => {
            expect(getAbattement('vente')).toBe(0.71);
            expect(getAbattement('services_bic')).toBe(0.50);
            expect(getAbattement('liberal')).toBe(0.34);
        });

        it('calculates IR via Versement Libératoire (Flat Rate)', () => {
            const result = calculateIR({
                ca: 10000,
                activityType: 'services_bnc',
                versementLiberatoire: true,
                situationFamiliale: 'celibataire',
                parts: 1,
                autresRevenus: 0
            });
            // 2.2% of 10k = 220
            expect(result.irEstime).toBe(220);
            expect(result.trancheMaginale).toBe(0.022);
            expect(result.revenuImposable).toBe(10000);
        });

        it('calculates IR via Barème Progressif (Married, 2 parts, Vente, Autres Revenus)', () => {
            const result = calculateIR({
                ca: 50000,
                activityType: 'vente',
                versementLiberatoire: false,
                situationFamiliale: 'marie',
                parts: 2.0,
                autresRevenus: 30000
            });

            // Breakdown:
            // CA: 50,000. Abattement Vente: 71%. 
            // Revenu Imposable CA = 50,000 * 0.29 = 14,500
            // Revenu Imposable Foyer = 14,500 + 30,000 = 44,500
            // Quotient Familial = 44,500 / 2 = 22,250

            // Barème on 22,250:
            // Tranche 1 (0 -> 11,294): 11,294 * 0% = 0
            // Tranche 2 (11,294 -> 28,797): (22,250 - 11,294) = 10,956 * 11% = 1205.16
            // Total par part = 1205.16
            // Total Global = 1205.16 * 2 = 2410.32

            // Prorata AE: 14,500 / 44,500 = 0.3258427...
            // IR Estimé AE = 2410.32 * 0.3258427 = 785.38

            expect(result.revenuImposable).toBeCloseTo(14500, 2);
            expect(result.trancheMaginale).toBe(0.11);

            // Using toBeCloseTo for floating point assertions
            expect(result.irEstime).toBeCloseTo(785.38, 1);
        });

        it('handles 0 additional income correctly', () => {
            const result = calculateIR({
                ca: 20000,
                activityType: 'liberal',
                versementLiberatoire: false,
                situationFamiliale: 'celibataire',
                parts: 1,
                autresRevenus: 0
            });

            // CA = 20k. Abattement 34%. Revenu Imposable = 20k * 0.66 = 13,200
            // Foyer = 13,200. QF = 13,200
            // TMI = 11%. (13,200 - 11,294) = 1,906. 1906 * 11% = 209.66

            expect(result.revenuImposable).toBeCloseTo(13200, 2);
            expect(result.irEstime).toBeCloseTo(209.66, 1);
            expect(result.trancheMaginale).toBe(0.11);
        });
    });

    describe('TVA Thresholds', () => {
        it('returns warning when 85% reached in services', () => {
            const result = getTVAStatus(35000, 'services_bic'); // Limit 39,100. 85% is 33,235.
            expect(result.status).toBe('warning');
            expect(result.percentage).toBeCloseTo((35000 / 39100) * 100, 1);
            expect(result.remaining).toBe(4100);
            expect(result.threshold).toBe(39100);
        });

        it('returns danger when limit crossed in vente', () => {
            const result = getTVAStatus(95000, 'vente'); // Limit 91,900
            expect(result.status).toBe('danger');
            expect(result.remaining).toBe(0);
        });
    });

    describe('Net Réel Calculation', () => {
        it('calculates the holistic net reel considering URSSAF, IR, and CFE', () => {
            const result = calculateNetReel(
                10000,
                'vente',
                false,
                true, // Versement Liberatoire
                {
                    ca: 10000, activityType: 'vente', versementLiberatoire: true,
                    situationFamiliale: 'celibataire', parts: 1, autresRevenus: 0
                }
            );

            // URSSAF: 10k * 12.3% = 1230
            // IR (VL): 10k * 1.0% = 100
            // CFE: 10k * 1.5% = 150
            // Total Charges: 1480
            // Net: 10k - 1480 = 8520

            expect(result.caBrut).toBe(10000);
            expect(result.urssaf).toBe(1230);
            expect(result.ir).toBe(100);
            expect(result.cfe).toBe(150);
            expect(result.netReel).toBe(8520);
            expect(result.tauxGlobal).toBeCloseTo(0.148, 3);
        });
    });
});
