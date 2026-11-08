const INCOME_TAX_SLAB_STORE = 'k12-income-tax-slabs-v1';

export type TaxRegimeName = 'Old Regime' | 'New Regime' | 'Custom' | 'Old' | 'New';

export interface TaxSlabRow {
  id?: string;
  from: number;
  to: number | null;
  rate: number;
  condition?: string;
}

export interface TaxExemptionRow {
  id?: string;
  category: string;
  sub?: string;
  maxAmount: number;
  basedOn?: 'Fixed' | 'Declared' | 'Formula' | string;
  appliesIf?: string;
  oldOnly?: boolean;
}

export interface TaxChargeRow {
  id?: string;
  description: string;
  kind: 'Percentage of Tax' | 'Flat Amount' | string;
  rate: number;
  condition?: string;
  minAmount: number | null;
  maxAmount: number | null;
}

export interface TaxPack {
  id?: string;
  name?: string;
  periodId?: string;
  company?: string;
  regime: string;
  allowExemption?: boolean;
  standardExemption?: number;
  taxReliefLimit?: number;
  surchargeRate?: number;
  surchargeThreshold?: number;
  cessPercent?: number;
  rows: TaxSlabRow[];
  charges?: TaxChargeRow[];
  exemptions?: TaxExemptionRow[];
  status?: string;
}

export interface TaxCalcInput {
  periodId?: string;
  regime?: TaxRegimeName | string;
  pack?: TaxPack;
  annualGrossSalary: number;
  previousEmployerIncome?: number;
  otherIncome?: number;
  agriculturalIncome?: number;
  housePropertyIncome?: number;
  capitalGains?: { stcg?: number; ltcg?: number };
  deductions?: {
    section80C?: number;
    section80D?: number;
    section80E?: number;
    section80G?: number;
    section24?: number;
    nps80CCD?: number;
    section80TTA?: number;
    other?: number;
  };
  hra?: { basic: number; hraReceived: number; rentPaid: number; metro?: boolean };
  hraExemption?: number;
  remainingMonths?: number;
  tdsDeductedYtd?: number;
  previousEmployerTds?: number;
  applyDeclarations?: boolean;
  taxableIncomeOverride?: number;
}

export interface TaxCalcResult {
  packId: string;
  packName: string;
  regime: string;
  packMissing: boolean;
  grossIncome: number;
  previousEmployerIncome: number;
  otherIncome: number;
  agriculturalIncome: number;
  housePropertyIncome: number;
  capitalGains: number;
  hraExemption: number;
  standardDeduction: number;
  chapterVia: number;
  deductionsApplied: Record<string, number>;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  surcharge: number;
  marginalRelief: number;
  cess: number;
  finalAnnualTax: number;
  tdsDeductedYtd: number;
  previousEmployerTds: number;
  remainingTax: number;
  remainingMonths: number;
  monthlyTdsEstimate: number;
  effectiveRate: number;
  breakdown: { label: string; amount: number }[];
  appliedRules: string[];
  excludedRules: string[];
  warnings: string[];
}

const FALLBACK_OLD_ROWS: TaxSlabRow[] = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300001, to: 700000, rate: 5 },
  { from: 700001, to: 1000000, rate: 10 },
  { from: 1000001, to: 1200000, rate: 15 },
  { from: 1200001, to: 1500000, rate: 20 },
  { from: 1500001, to: null, rate: 30 }
];

const FALLBACK_NEW_ROWS: TaxSlabRow[] = [
  { from: 0, to: 400000, rate: 0 },
  { from: 400001, to: 800000, rate: 5 },
  { from: 800001, to: 1200000, rate: 10 },
  { from: 1200001, to: 1600000, rate: 15 },
  { from: 1600001, to: 2000000, rate: 20 },
  { from: 2000001, to: 2400000, rate: 25 },
  { from: 2400001, to: null, rate: 30 }
];

const FALLBACK_CHARGES: TaxChargeRow[] = [
  { description: 'Health & Education Cess', kind: 'Percentage of Tax', rate: 4, minAmount: 0, maxAmount: null },
  { description: 'Surcharge (10%)', kind: 'Percentage of Tax', rate: 10, minAmount: 5000001, maxAmount: 10000000 },
  { description: 'Surcharge (15%)', kind: 'Percentage of Tax', rate: 15, minAmount: 10000001, maxAmount: 20000000 },
  { description: 'Surcharge (25%)', kind: 'Percentage of Tax', rate: 25, minAmount: 20000001, maxAmount: null }
];

export function normalizeRegime(regime?: string): 'Old Regime' | 'New Regime' | 'Custom' {
  const value = String(regime || '').trim().toLowerCase();
  if (value === 'new' || value === 'new regime') return 'New Regime';
  if (value === 'custom') return 'Custom';
  return 'Old Regime';
}

export function remainingPayrollMonths(month = new Date().getMonth() + 1): number {
  if (month >= 4) return 16 - month;
  return Math.max(1, 4 - month);
}

export function calculateHraExemption(basic: number, hraReceived: number, rentPaid: number, metro = false): number {
  const actual = Math.max(0, hraReceived);
  const rentMinusTen = Math.max(0, rentPaid - basic * 0.1);
  const pct = basic * (metro ? 0.5 : 0.4);
  return Math.max(0, Math.min(actual, rentMinusTen, pct));
}

export function taxOnSlabs(income: number, rows: TaxSlabRow[]): number {
  if (income <= 0 || !rows?.length) return 0;
  let tax = 0;
  [...rows].sort((a, b) => a.from - b.from).forEach((row) => {
    const hi = row.to == null ? income : row.to;
    const lo = row.from === 0 ? 0 : row.from - 1;
    const amount = Math.max(0, Math.min(income, hi) - lo);
    tax += amount * (row.rate / 100);
  });
  return tax;
}

const capFrom = (pack: TaxPack, aliases: string[], fallback: number) => {
  const row = (pack.exemptions || []).find((item) => aliases.some((alias) => item.category.toLowerCase().includes(alias.toLowerCase())));
  if (row && row.maxAmount > 0) return row.maxAmount;
  return fallback;
};

const standardDeductionOf = (pack: TaxPack) => {
  const row = (pack.exemptions || []).find((item) => item.category.toLowerCase().includes('standard deduction'));
  if (row && row.maxAmount > 0) return row.maxAmount;
  return Math.max(0, pack.standardExemption || 0);
};

const fallbackPack = (regime: string): TaxPack => {
  const isNew = normalizeRegime(regime) === 'New Regime';
  return {
    id: isNew ? 'FALLBACK-NEW' : 'FALLBACK-OLD',
    name: `${isNew ? 'New' : 'Old'} Regime (fallback)`,
    periodId: 'AY-2026-27',
    regime: isNew ? 'New Regime' : 'Old Regime',
    allowExemption: !isNew,
    standardExemption: isNew ? 75000 : 50000,
    taxReliefLimit: isNew ? 60000 : 12500,
    surchargeRate: 10,
    surchargeThreshold: 5000000,
    cessPercent: 4,
    rows: isNew ? FALLBACK_NEW_ROWS : FALLBACK_OLD_ROWS,
    charges: FALLBACK_CHARGES,
    exemptions: [
      { category: 'Standard Deduction', maxAmount: isNew ? 75000 : 50000, basedOn: 'Fixed', oldOnly: !isNew },
      { category: '80C', maxAmount: 150000, basedOn: 'Declared', oldOnly: true },
      { category: '80D', maxAmount: 75000, basedOn: 'Declared', oldOnly: true },
      { category: '80CCD(1B)', maxAmount: 50000, basedOn: 'Declared', oldOnly: true },
      { category: 'Section 24b', maxAmount: 200000, basedOn: 'Declared', oldOnly: true },
      { category: '80TTA', maxAmount: 10000, basedOn: 'Declared', oldOnly: true }
    ]
  };
};

export function loadTaxPacks(): TaxPack[] {
  try {
    const raw = localStorage.getItem(INCOME_TAX_SLAB_STORE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as TaxPack[] : [];
  } catch {
    return [];
  }
}

export function getTaxPack(periodId?: string, regime?: string): TaxPack | undefined {
  const wanted = normalizeRegime(regime);
  const packs = loadTaxPacks();
  const active = packs.filter((item) => !item.status || item.status === 'Active');
  const pool = active.length ? active : packs;
  return pool.find((item) => normalizeRegime(item.regime) === wanted && (!periodId || item.periodId === periodId))
    || pool.find((item) => normalizeRegime(item.regime) === wanted);
}

const chargeApplies = (charge: TaxChargeRow, taxable: number) => {
  const min = charge.minAmount == null ? Number.NEGATIVE_INFINITY : charge.minAmount;
  const max = charge.maxAmount == null ? Number.POSITIVE_INFINITY : charge.maxAmount;
  return taxable >= min && taxable <= max;
};

const applyCharges = (tax: number, taxable: number, pack: TaxPack, applied: string[], excluded: string[]) => {
  const charges = pack.charges && pack.charges.length ? pack.charges : FALLBACK_CHARGES;
  let surcharge = 0;
  let cess = 0;
  charges.forEach((charge) => {
    const isCess = /cess/i.test(charge.description);
    const isSurcharge = /surcharge/i.test(charge.description);
    if (!isCess && !isSurcharge) return;
    if (isSurcharge && !chargeApplies(charge, taxable)) {
      excluded.push(`${charge.description} (income outside ${charge.minAmount ?? 0}–${charge.maxAmount ?? '∞'})`);
      return;
    }
    const base = isCess ? tax + surcharge : tax;
    const amount = charge.kind === 'Flat Amount' ? charge.rate : base * (charge.rate / 100);
    if (isCess) cess += amount;
    else surcharge += amount;
    applied.push(`${charge.description} @ ${charge.rate}${charge.kind === 'Flat Amount' ? '' : '%'}`);
  });
  if (!pack.charges?.length) {
    if (!surcharge && pack.surchargeRate && taxable > (pack.surchargeThreshold || 0)) {
      surcharge = tax * (pack.surchargeRate / 100);
      applied.push(`Legacy surcharge ${pack.surchargeRate}% above ${pack.surchargeThreshold}`);
    }
    if (!cess && pack.cessPercent) {
      cess = (tax + surcharge) * (pack.cessPercent / 100);
      applied.push(`Legacy cess ${pack.cessPercent}%`);
    }
  }
  return { surcharge, cess };
};

const marginalReliefOnSurcharge = (tax: number, surcharge: number, taxable: number, pack: TaxPack) => {
  const threshold = pack.surchargeThreshold || 5000000;
  if (surcharge <= 0 || taxable <= threshold) return 0;
  const excessIncome = taxable - threshold;
  const taxAtThreshold = taxOnSlabs(threshold, pack.rows);
  const withoutSurcharge = tax;
  const withSurcharge = tax + surcharge;
  const maxPayable = taxAtThreshold + excessIncome;
  if (withSurcharge > maxPayable && maxPayable > withoutSurcharge) {
    return withSurcharge - maxPayable;
  }
  return 0;
};

export function calculateIncomeTax(input: TaxCalcInput): TaxCalcResult {
  const remainingMonths = Math.max(1, input.remainingMonths ?? remainingPayrollMonths());
  const regime = normalizeRegime(input.regime || input.pack?.regime);
  const pack = input.pack || getTaxPack(input.periodId, regime) || fallbackPack(regime);
  const packMissing = !input.pack && !getTaxPack(input.periodId, regime);
  const appliedRules: string[] = [];
  const excludedRules: string[] = [];
  const warnings: string[] = [];
  if (packMissing) warnings.push('Using fallback slabs because no saved pack matched this period and regime.');
  appliedRules.push(`Slab pack: ${pack.name || pack.id || regime}`);

  const previousEmployerIncome = Math.max(0, input.previousEmployerIncome || 0);
  const otherIncome = input.otherIncome || 0;
  const agriculturalIncome = Math.max(0, input.agriculturalIncome || 0);
  const housePropertyIncome = input.housePropertyIncome || 0;
  const capitalGains = Math.max(0, (input.capitalGains?.stcg || 0) + (input.capitalGains?.ltcg || 0));
  const grossIncome = Math.max(0, input.annualGrossSalary) + previousEmployerIncome;
  const allowExemption = pack.allowExemption !== false && regime !== 'New Regime';
  const applyDeclarations = input.applyDeclarations !== false;

  let hraExemption = Math.max(0, input.hraExemption || 0);
  if (!hraExemption && input.hra && allowExemption && applyDeclarations) {
    hraExemption = calculateHraExemption(input.hra.basic, input.hra.hraReceived, input.hra.rentPaid, Boolean(input.hra.metro));
  }
  if (!allowExemption && hraExemption) {
    excludedRules.push('HRA exemption blocked by Allow Tax Exemption / New Regime');
    hraExemption = 0;
  } else if (hraExemption) {
    appliedRules.push('HRA exemption (least of actual HRA, rent − 10% of basic, metro/non-metro % of basic)');
  }

  const std = standardDeductionOf(pack);
  if (std) appliedRules.push(`Standard deduction ₹${Math.round(std).toLocaleString('en-IN')} from slab pack`);

  const deductionsApplied: Record<string, number> = {};
  const take = (key: string, declared: number, aliases: string[], fallbackCap: number) => {
    if (!declared) return 0;
    if (!allowExemption || !applyDeclarations) {
      excludedRules.push(`${key} not applied (${!allowExemption ? 'regime/pack disallows exemptions' : 'declarations off'})`);
      return 0;
    }
    const cap = capFrom(pack, aliases, fallbackCap);
    const allowed = cap > 0 ? Math.min(declared, cap) : declared;
    deductionsApplied[key] = allowed;
    appliedRules.push(`${key}: declared ₹${Math.round(declared).toLocaleString('en-IN')} → eligible ₹${Math.round(allowed).toLocaleString('en-IN')}${cap ? ` (cap ₹${cap.toLocaleString('en-IN')})` : ''}`);
    return allowed;
  };

  const d = input.deductions || {};
  const d80c = take('section80C', d.section80C || 0, ['80C'], 150000);
  const d80d = take('section80D', d.section80D || 0, ['80D'], 75000);
  const d80e = take('section80E', d.section80E || 0, ['80E'], 0);
  const d80g = take('section80G', d.section80G || 0, ['80G'], 0);
  const d24 = take('section24', d.section24 || 0, ['24', '24b', 'house'], 200000);
  const dnps = take('nps80CCD', d.nps80CCD || 0, ['80CCD', 'NPS'], 50000);
  const d80tta = take('section80TTA', d.section80TTA || 0, ['80TTA', '80TTB'], 10000);
  const dOther = take('other', d.other || 0, ['Other'], 0);
  const chapterVia = d80c + d80d + d80e + d80g + d24 + dnps + d80tta + dOther;

  let taxableIncome: number;
  if (input.taxableIncomeOverride != null) {
    taxableIncome = Math.max(0, input.taxableIncomeOverride);
    appliedRules.push('Taxable income supplied by caller (standard deduction / Chapter VI-A not re-applied)');
  } else {
    taxableIncome = grossIncome + otherIncome + housePropertyIncome + capitalGains - std - hraExemption - chapterVia;
    if (housePropertyIncome < 0) appliedRules.push('House-property loss set off against salary / other income');
    if (taxableIncome < 0) taxableIncome = 0;
  }

  if (agriculturalIncome) {
    appliedRules.push('Agricultural income kept out of taxable income; used only for rate purposes when > ₹5,000');
  }

  const slabBase = agriculturalIncome > 5000 ? taxableIncome + agriculturalIncome : taxableIncome;
  const agriTax = agriculturalIncome > 5000 ? taxOnSlabs(agriculturalIncome, pack.rows) : 0;
  const taxBeforeRebate = Math.max(0, taxOnSlabs(slabBase, pack.rows) - agriTax);

  const relief = pack.taxReliefLimit || 0;
  let rebate = 0;
  if (relief > 0 && taxBeforeRebate <= relief) {
    rebate = taxBeforeRebate;
    appliedRules.push(`Tax relief / 87A ₹${relief.toLocaleString('en-IN')} wiped tax of ₹${Math.round(taxBeforeRebate).toLocaleString('en-IN')}`);
  } else if (relief > 0) {
    excludedRules.push(`Tax relief ₹${relief.toLocaleString('en-IN')} not applied because tax ₹${Math.round(taxBeforeRebate).toLocaleString('en-IN')} exceeds the limit`);
  }
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);

  const charged = applyCharges(taxAfterRebate, taxableIncome, pack, appliedRules, excludedRules);
  const marginalRelief = marginalReliefOnSurcharge(taxAfterRebate, charged.surcharge, taxableIncome, pack);
  const surcharge = Math.max(0, charged.surcharge - marginalRelief);
  if (marginalRelief > 0) appliedRules.push(`Marginal relief ₹${Math.round(marginalRelief).toLocaleString('en-IN')} on surcharge`);
  const cessCharge = (pack.charges && pack.charges.length ? pack.charges : FALLBACK_CHARGES).find((c) => /cess/i.test(c.description));
  const cess = cessCharge
    ? (cessCharge.kind === 'Flat Amount' ? cessCharge.rate : (taxAfterRebate + surcharge) * (cessCharge.rate / 100))
    : (taxAfterRebate + surcharge) * ((pack.cessPercent || 0) / 100);
  const finalAnnualTax = Math.max(0, Math.round(taxAfterRebate + surcharge + cess));
  const tdsDeductedYtd = Math.max(0, input.tdsDeductedYtd || 0);
  const previousEmployerTds = Math.max(0, input.previousEmployerTds || 0);
  const remainingTax = Math.max(0, finalAnnualTax - tdsDeductedYtd - previousEmployerTds);
  const monthlyTdsEstimate = Math.round(remainingTax / remainingMonths);
  const denom = grossIncome + Math.max(0, otherIncome) + Math.max(0, capitalGains);
  const effectiveRate = denom > 0 ? (finalAnnualTax / denom) * 100 : 0;

  if (capitalGains) appliedRules.push('Capital gains kept in their own bucket and added to taxable income');

  const breakdown = [
    { label: 'Gross salary + previous employer', amount: grossIncome },
    { label: 'Other income', amount: otherIncome },
    { label: 'House property (can be negative)', amount: housePropertyIncome },
    { label: 'Capital gains', amount: capitalGains },
    { label: 'Agricultural income (rate only)', amount: agriculturalIncome },
    { label: 'HRA exemption', amount: -hraExemption },
    { label: 'Standard deduction', amount: -std },
    { label: 'Chapter VI-A', amount: -chapterVia },
    { label: 'Taxable income', amount: taxableIncome },
    { label: 'Tax before rebate', amount: taxBeforeRebate },
    { label: 'Rebate / tax relief', amount: -rebate },
    { label: 'Surcharge', amount: surcharge },
    { label: 'Marginal relief', amount: -marginalRelief },
    { label: 'Cess', amount: cess },
    { label: 'Annual tax', amount: finalAnnualTax },
    { label: 'TDS already deducted', amount: -(tdsDeductedYtd + previousEmployerTds) },
    { label: 'Remaining tax', amount: remainingTax },
    { label: `Monthly TDS (${remainingMonths} remaining months)`, amount: monthlyTdsEstimate }
  ];

  return {
    packId: pack.id || '',
    packName: pack.name || '',
    regime,
    packMissing,
    grossIncome,
    previousEmployerIncome,
    otherIncome,
    agriculturalIncome,
    housePropertyIncome,
    capitalGains,
    hraExemption,
    standardDeduction: std,
    chapterVia,
    deductionsApplied,
    taxableIncome,
    taxBeforeRebate,
    rebate,
    taxAfterRebate,
    surcharge,
    marginalRelief,
    cess,
    finalAnnualTax,
    tdsDeductedYtd,
    previousEmployerTds,
    remainingTax,
    remainingMonths,
    monthlyTdsEstimate,
    effectiveRate,
    breakdown,
    appliedRules,
    excludedRules,
    warnings
  };
}

export function taxOnIncrementalIncome(baseGross: number, extraTaxable: number, regime?: string, periodId?: string): number {
  const extra = Math.max(0, extraTaxable);
  if (!extra) return 0;
  const a = calculateIncomeTax({ annualGrossSalary: baseGross, regime, periodId });
  const b = calculateIncomeTax({ annualGrossSalary: baseGross, otherIncome: extra, regime, periodId });
  return Math.max(0, b.finalAnnualTax - a.finalAnnualTax);
}

export function projectAnnualTaxable(ytdTaxable: number, taxableThisMonth: number, remainingMonths?: number): number {
  const months = Math.max(1, remainingMonths ?? remainingPayrollMonths());
  return Math.max(0, ytdTaxable + taxableThisMonth * months);
}
