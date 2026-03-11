import {
  calculateNetReel,
  getTVAStatus,
  type ActivityType,
  type IrParams,
} from '@/lib/calculations';

export type PublicFamilyStatus = 'celibataire' | 'marie';

export const SALARIED_NET_RATIO = 0.775;

function getFamilyProfile(status: PublicFamilyStatus) {
  return {
    situationFamiliale: status === 'marie' ? 'marie' : 'celibataire',
    parts: status === 'marie' ? 2 : 1,
  } as const;
}

function buildIrParams(
  annualCA: number,
  activityType: ActivityType,
  versementLiberatoire: boolean,
  familyStatus: PublicFamilyStatus
): IrParams {
  const family = getFamilyProfile(familyStatus);

  return {
    ca: annualCA,
    activityType,
    versementLiberatoire,
    situationFamiliale: family.situationFamiliale,
    parts: family.parts,
    autresRevenus: 0,
  };
}

export interface FreelanceSnapshot {
  activityType: ActivityType;
  familyStatus: PublicFamilyStatus;
  versementLiberatoire: boolean;
  monthlyCA: number;
  annualCA: number;
  urssafMonthly: number;
  irMonthly: number;
  cfeMonthly: number;
  netAfterUrssafMonthly: number;
  netAfterTaxesMonthly: number;
  netAfterAllChargesMonthly: number;
  globalChargeRate: number;
  equivalentGrossToMatchNet: number;
  salaryNetAtSameGross: number;
  salaryGapAtSameGross: number;
  tvaPercentage: number;
  tvaRemaining: number;
  tvaThreshold: number;
  tvaStatus: 'safe' | 'warning' | 'danger';
}

export function calculateFreelanceSnapshot(params: {
  monthlyCA: number;
  activityType: ActivityType;
  versementLiberatoire: boolean;
  familyStatus?: PublicFamilyStatus;
  acreEnabled?: boolean;
}) {
  const monthlyCA = Math.max(0, Number(params.monthlyCA || 0));
  const annualCA = monthlyCA * 12;
  const familyStatus = params.familyStatus ?? 'celibataire';
  const acreEnabled = Boolean(params.acreEnabled);

  const irParams = buildIrParams(annualCA, params.activityType, params.versementLiberatoire, familyStatus);
  const annualBreakdown = calculateNetReel(
    annualCA,
    params.activityType,
    acreEnabled,
    params.versementLiberatoire,
    irParams
  );

  const urssafMonthly = annualBreakdown.urssaf / 12;
  const irMonthly = annualBreakdown.ir / 12;
  const cfeMonthly = annualBreakdown.cfe / 12;
  const netAfterUrssafMonthly = monthlyCA - urssafMonthly;
  const netAfterTaxesMonthly = monthlyCA - urssafMonthly - irMonthly;
  const netAfterAllChargesMonthly = annualBreakdown.netReel / 12;
  const equivalentGrossToMatchNet = netAfterTaxesMonthly > 0 ? netAfterTaxesMonthly / SALARIED_NET_RATIO : 0;
  const salaryNetAtSameGross = monthlyCA * SALARIED_NET_RATIO;
  const salaryGapAtSameGross = netAfterTaxesMonthly - salaryNetAtSameGross;
  const tva = getTVAStatus(annualCA, params.activityType);

  return {
    activityType: params.activityType,
    familyStatus,
    versementLiberatoire: params.versementLiberatoire,
    monthlyCA,
    annualCA,
    urssafMonthly,
    irMonthly,
    cfeMonthly,
    netAfterUrssafMonthly,
    netAfterTaxesMonthly,
    netAfterAllChargesMonthly,
    globalChargeRate: annualBreakdown.tauxGlobal,
    equivalentGrossToMatchNet,
    salaryNetAtSameGross,
    salaryGapAtSameGross,
    tvaPercentage: tva.percentage,
    tvaRemaining: tva.remaining,
    tvaThreshold: tva.threshold,
    tvaStatus: tva.status,
  } satisfies FreelanceSnapshot;
}

export function calculateSalariedNet(grossMonthlySalary: number) {
  return Math.max(0, Number(grossMonthlySalary || 0)) * SALARIED_NET_RATIO;
}

export function findMonthlyCaForTargetNet(params: {
  targetMonthlyNet: number;
  activityType: ActivityType;
  versementLiberatoire: boolean;
  familyStatus?: PublicFamilyStatus;
  acreEnabled?: boolean;
  includeCfe?: boolean;
}) {
  const target = Math.max(0, Number(params.targetMonthlyNet || 0));
  const includeCfe = params.includeCfe ?? true;

  if (target === 0) {
    return 0;
  }

  let low = 0;
  let high = 100_000;

  for (let index = 0; index < 32; index += 1) {
    const mid = (low + high) / 2;
    const snapshot = calculateFreelanceSnapshot({
      monthlyCA: mid,
      activityType: params.activityType,
      versementLiberatoire: params.versementLiberatoire,
      familyStatus: params.familyStatus,
      acreEnabled: params.acreEnabled,
    });
    const comparableNet = includeCfe ? snapshot.netAfterAllChargesMonthly : snapshot.netAfterTaxesMonthly;

    if (comparableNet >= target) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.ceil(high);
}

export function calculateBreakEvenCaForSalary(params: {
  grossMonthlySalary: number;
  activityType: ActivityType;
  versementLiberatoire: boolean;
  familyStatus?: PublicFamilyStatus;
}) {
  const targetNet = calculateSalariedNet(params.grossMonthlySalary);

  return findMonthlyCaForTargetNet({
    targetMonthlyNet: targetNet,
    activityType: params.activityType,
    versementLiberatoire: params.versementLiberatoire,
    familyStatus: params.familyStatus,
    includeCfe: true,
  });
}

export function calculateEquivalentSalaryForFreelanceNet(params: {
  monthlyCA: number;
  activityType: ActivityType;
  versementLiberatoire: boolean;
  familyStatus?: PublicFamilyStatus;
}) {
  const snapshot = calculateFreelanceSnapshot(params);

  return {
    grossMonthlySalary: snapshot.equivalentGrossToMatchNet,
    netMonthlySalary: snapshot.netAfterTaxesMonthly,
  };
}
