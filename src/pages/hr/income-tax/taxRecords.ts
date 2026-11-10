import { calculateHraExemption, calculateIncomeTax, remainingPayrollMonths, type TaxCalcResult } from './incomeTax';

export const DECL_STORE = 'k12-tax-exemption-declaration-v1';
export const PROOF_STORE = 'k12-tax-exemption-proof-v1';
export const PROOF_HISTORY_STORE = 'k12-tax-proof-history-v1';
export const ACTIVITY_STORE = 'k12-tax-activity-v1';
export const BENEFIT_APP_STORE = 'k12-benefit-application-v1';
export const BENEFIT_CLAIM_STORE = 'k12-benefit-claim-v1';
export const PROJECTION_STORE = 'k12-tax-projection-v1';
export const TDS_MONTHLY_STORE = 'k12-monthly-tds-v1';
export const CHALLAN_STORE = 'k12-challan-v1';
export const FORM16_STORE = 'k12-form16-v1';
export const RETURN_STORE = 'k12-tds-return-v1';
export const RECON_STORE = 'k12-tax-recon-v1';

export type ProofStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Verification'
  | 'Verified'
  | 'Partially Verified'
  | 'Rejected'
  | 'Resubmission Required';

export type TaxStaff = {
  id: string;
  name: string;
  department: string;
  designation: string;
  company: string;
  branch: string;
  regime: 'Old' | 'New' | '';
  ctc: number;
  basic: number;
  hra: number;
  ytdTds: number;
  structure: string;
};

export const TAX_STAFF: TaxStaff[] = [
  { id: 'EMP-1042', name: 'Meera Iyer', department: 'Science', designation: 'PGT Physics', company: 'EduManager School', branch: 'Ahmedabad', regime: 'Old', ctc: 1200000, basic: 480000, hra: 192000, ytdTds: 72000, structure: 'Teaching Staff - Permanent' },
  { id: 'EMP-1088', name: 'Rajesh Kumar', department: 'Mathematics', designation: 'TGT Maths', company: 'EduManager School', branch: 'Ahmedabad', regime: 'New', ctc: 900000, basic: 360000, hra: 144000, ytdTds: 28000, structure: 'Teaching Staff - Permanent' },
  { id: 'EMP-1101', name: 'Kavita Shah', department: 'Administration', designation: 'Office Assistant', company: 'EduManager School', branch: 'Ahmedabad', regime: '', ctc: 720000, basic: 288000, hra: 115200, ytdTds: 18000, structure: 'Non-Teaching Staff - Support' }
];

export const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export type DeclRow = { id: string; sub: string; category: string; declared: number; max?: number };
export type DeclarationRec = {
  id: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  periodId: string;
  regime: 'Old' | 'New' | '';
  company?: string;
  status: string;
  rows: DeclRow[];
  rented?: boolean;
  monthlyRent?: number;
  landlord?: string;
  landlordPan?: string;
  city?: 'Metro' | 'Non-Metro';
};

export type ProofLine = {
  id: string;
  sub: string;
  category: string;
  declared: number;
  submittedAmount: number;
  verifiedAmount: number;
  rejectedAmount: number;
  fileName: string;
  docType: 'PDF' | 'Image' | 'Certificate';
  refNo: string;
  docDate: string;
  requiresProof: boolean;
  status: ProofStatus;
  rejectReason: string;
  remarks: string;
};

export type ProofRec = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  company: string;
  branch: string;
  periodId: string;
  declarationId: string;
  submittedOn: string;
  status: ProofStatus;
  rows: ProofLine[];
  rentReceipts: string[];
  landlordPanFile: string;
  rentAgreement: string;
  landlordName: string;
  landlordPan: string;
  rentalFrom: string;
  rentalTo: string;
  actualMonthlyRent: number;
  declaredMonthlyRent: number;
  city: 'Metro' | 'Non-Metro';
  basic: number;
  hraReceived: number;
  regime: 'Old' | 'New' | '';
};

export type HistoryEntry = {
  id: string;
  proofId: string;
  lineId?: string;
  previousStatus: string;
  newStatus: string;
  verifiedAmount: number;
  reviewer: string;
  reviewDate: string;
  remarks: string;
  rejectionReason: string;
};

export type ActivityEntry = {
  id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  at: string;
  actor: string;
  remarks: string;
  ref?: string;
};

export function loadDeclarations(): DeclarationRec[] {
  return loadJson<DeclarationRec[]>(DECL_STORE, []);
}

export function loadProofs(): ProofRec[] {
  const raw = loadJson<any[]>(PROOF_STORE, []);
  return raw.map(normalizeProof);
}

export function saveProofs(rows: ProofRec[]) {
  saveJson(PROOF_STORE, rows);
}

function normalizeLine(row: any): ProofLine {
  const submitted = Number(row.submittedAmount ?? row.actual ?? 0) || 0;
  const verified = Number(row.verifiedAmount ?? (row.verified ? submitted : 0)) || 0;
  const rejected = Number(row.rejectedAmount ?? (row.rejected ? submitted : 0)) || 0;
  let status: ProofStatus = row.status || 'Draft';
  if (!row.status) {
    if (row.verified) status = 'Verified';
    else if (row.rejected) status = 'Rejected';
    else status = submitted ? 'Submitted' : 'Draft';
  }
  return {
    id: row.id,
    sub: row.sub || '',
    category: row.category || '',
    declared: Number(row.declared) || 0,
    submittedAmount: submitted,
    verifiedAmount: verified,
    rejectedAmount: rejected,
    fileName: row.fileName || '',
    docType: row.docType || 'PDF',
    refNo: row.refNo || '',
    docDate: row.docDate || '',
    requiresProof: row.requiresProof !== false,
    status,
    rejectReason: row.rejectReason || row.rejectComment || '',
    remarks: row.remarks || ''
  };
}

export function normalizeProof(rec: any): ProofRec {
  const staff = TAX_STAFF.find((s) => s.id === rec.employeeId);
  return {
    id: rec.id,
    employeeId: rec.employeeId,
    employeeName: rec.employeeName || staff?.name || '',
    department: rec.department || staff?.department || '',
    company: rec.company || staff?.company || 'EduManager School',
    branch: rec.branch || staff?.branch || 'Ahmedabad',
    periodId: rec.periodId || 'AY-2026-27',
    declarationId: rec.declarationId || '',
    submittedOn: rec.submittedOn || '',
    status: rec.status || 'Draft',
    rows: (rec.rows || []).map(normalizeLine),
    rentReceipts: rec.rentReceipts || [],
    landlordPanFile: rec.landlordPanFile || '',
    rentAgreement: rec.rentAgreement || '',
    landlordName: rec.landlordName || rec.landlord || '',
    landlordPan: rec.landlordPan || '',
    rentalFrom: rec.rentalFrom || '2026-04-01',
    rentalTo: rec.rentalTo || '2027-03-31',
    actualMonthlyRent: Number(rec.actualMonthlyRent) || 0,
    declaredMonthlyRent: Number(rec.declaredMonthlyRent) || 0,
    city: rec.city || 'Non-Metro',
    basic: Number(rec.basic) || staff?.basic || 0,
    hraReceived: Number(rec.hraReceived) || staff?.hra || 0,
    regime: rec.regime || staff?.regime || ''
  };
}

export function loadHistory(): HistoryEntry[] {
  return loadJson<HistoryEntry[]>(PROOF_HISTORY_STORE, []);
}

export function appendHistory(entry: Omit<HistoryEntry, 'id' | 'reviewDate'> & { reviewDate?: string }) {
  const next: HistoryEntry = {
    ...entry,
    id: `H-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reviewDate: entry.reviewDate || new Date().toISOString()
  };
  saveJson(PROOF_HISTORY_STORE, [next, ...loadHistory()]);
  return next;
}

export function loadActivity(): ActivityEntry[] {
  return loadJson<ActivityEntry[]>(ACTIVITY_STORE, []);
}

export function logActivity(entry: Omit<ActivityEntry, 'id' | 'at'> & { at?: string }) {
  const next: ActivityEntry = {
    ...entry,
    id: `A-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: entry.at || new Date().toISOString()
  };
  saveJson(ACTIVITY_STORE, [next, ...loadActivity()].slice(0, 400));
  return next;
}

export function flattenProofLines(proofs = loadProofs()) {
  return proofs.flatMap((p) => p.rows.map((row) => ({ proof: p, row })));
}

export function lineEligible(row: ProofLine) {
  const pending = Math.max(0, row.submittedAmount - row.verifiedAmount - row.rejectedAmount);
  return {
    pending,
    eligible: row.verifiedAmount,
    remainingProof: Math.max(0, row.declared - row.submittedAmount)
  };
}

export function categoryKey(category: string): keyof NonNullable<Parameters<typeof calculateIncomeTax>[0]['deductions']> | 'hra' | 'other' {
  const c = category.toLowerCase();
  if (c.includes('80c') && !c.includes('ccd')) return 'section80C';
  if (c.includes('80d')) return 'section80D';
  if (c.includes('80e')) return 'section80E';
  if (c.includes('80g')) return 'section80G';
  if (c.includes('24')) return 'section24';
  if (c.includes('ccd') || c.includes('nps')) return 'nps80CCD';
  if (c.includes('80tta') || c.includes('80ttb')) return 'section80TTA';
  if (c.includes('hra')) return 'hra';
  return 'other';
}

export function verifiedDeductionsFor(employeeId: string, periodId: string) {
  const decls = loadDeclarations().filter((d) => d.employeeId === employeeId && d.periodId === periodId && d.status !== 'Cancelled');
  const proofs = loadProofs().filter((p) => p.employeeId === employeeId && p.periodId === periodId);
  const declared: Record<string, number> = {};
  const verified: Record<string, number> = {};
  const submitted: Record<string, number> = {};
  decls.forEach((d) => d.rows.forEach((r) => {
    const k = categoryKey(r.category);
    if (k === 'hra') return;
    declared[k] = (declared[k] || 0) + r.declared;
  }));
  proofs.forEach((p) => p.rows.forEach((r) => {
    const k = categoryKey(r.category);
    if (k === 'hra') return;
    submitted[k] = (submitted[k] || 0) + r.submittedAmount;
    if (r.status === 'Verified' || r.status === 'Partially Verified') {
      verified[k] = (verified[k] || 0) + r.verifiedAmount;
    }
  }));
  const used: Record<string, number> = {};
  Object.keys({ ...declared, ...verified }).forEach((k) => {
    used[k] = verified[k] != null ? verified[k] : 0;
  });
  return { declared, submitted, verified, used };
}

export function hraFromProofs(employeeId: string, periodId: string, regime: string) {
  if (regime === 'New' || regime === 'New Regime') {
    return { exempt: 0, blocked: true as const };
  }
  const proofs = loadProofs().filter((p) => p.employeeId === employeeId && p.periodId === periodId);
  const latest = proofs[0];
  const staff = TAX_STAFF.find((s) => s.id === employeeId);
  if (!latest && !staff) return { exempt: 0, blocked: false as const };
  const basic = latest?.basic || staff?.basic || 0;
  const hra = latest?.hraReceived || staff?.hra || 0;
  const rent = (latest?.actualMonthlyRent || 0) * 12;
  const metro = latest?.city === 'Metro';
  return { exempt: calculateHraExemption(basic, hra, rent, metro), blocked: false as const, basic, hra, rent, metro };
}

export function computeEmployeeTax(employeeId: string, periodId = 'AY-2026-27', opts?: { useVerifiedOnly?: boolean }): TaxCalcResult {
  const staff = TAX_STAFF.find((s) => s.id === employeeId) || TAX_STAFF[0];
  const decl = loadDeclarations().find((d) => d.employeeId === employeeId && d.periodId === periodId && d.status !== 'Cancelled');
  const regime = decl?.regime || staff.regime || 'Old';
  const bags = verifiedDeductionsFor(employeeId, periodId);
  const deductions = opts?.useVerifiedOnly === false
    ? {
      section80C: bags.declared.section80C || 0,
      section80D: bags.declared.section80D || 0,
      section80E: bags.declared.section80E || 0,
      section80G: bags.declared.section80G || 0,
      section24: bags.declared.section24 || 0,
      nps80CCD: bags.declared.nps80CCD || 0,
      section80TTA: bags.declared.section80TTA || 0,
      other: bags.declared.other || 0
    }
    : {
      section80C: bags.used.section80C || 0,
      section80D: bags.used.section80D || 0,
      section80E: bags.used.section80E || 0,
      section80G: bags.used.section80G || 0,
      section24: bags.used.section24 || 0,
      nps80CCD: bags.used.nps80CCD || 0,
      section80TTA: bags.used.section80TTA || 0,
      other: bags.used.other || 0
    };
  const hra = hraFromProofs(employeeId, periodId, regime);
  return calculateIncomeTax({
    periodId,
    regime: regime === 'New' ? 'New Regime' : 'Old Regime',
    annualGrossSalary: staff.ctc,
    deductions,
    hraExemption: hra.exempt,
    remainingMonths: remainingPayrollMonths(),
    tdsDeductedYtd: staff.ytdTds
  });
}

export type ProjectionSnap = {
  id: string;
  employeeId: string;
  employeeName: string;
  periodId: string;
  at: string;
  regime: string;
  gross: number;
  taxable: number;
  annualTax: number;
  tds: number;
  remaining: number;
  inputs: Record<string, number | string>;
};

export function loadProjections(): ProjectionSnap[] {
  return loadJson<ProjectionSnap[]>(PROJECTION_STORE, []);
}

export function saveProjection(snap: ProjectionSnap) {
  saveJson(PROJECTION_STORE, [snap, ...loadProjections()]);
}

export function monthsOfFy() {
  return [
    { id: 'apr', label: 'April', i: 4 },
    { id: 'may', label: 'May', i: 5 },
    { id: 'jun', label: 'June', i: 6 },
    { id: 'jul', label: 'July', i: 7 },
    { id: 'aug', label: 'August', i: 8 },
    { id: 'sep', label: 'September', i: 9 },
    { id: 'oct', label: 'October', i: 10 },
    { id: 'nov', label: 'November', i: 11 },
    { id: 'dec', label: 'December', i: 12 },
    { id: 'jan', label: 'January', i: 1 },
    { id: 'feb', label: 'February', i: 2 },
    { id: 'mar', label: 'March', i: 3 }
  ];
}
