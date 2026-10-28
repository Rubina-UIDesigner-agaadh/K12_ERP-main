import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { AlertTriangle, History, RotateCcw, Save } from 'lucide-react';

export const PAYROLL_POLICY_STORE = 'k12-payroll-policy-config-v1';
export const PAYROLL_POLICY_EVENT = 'k12-payroll-policy-config';
const STORE_SETTINGS = 'k12-payroll-settings-v1';
const STORE_PERIODS = 'k12-payroll-periods-v1';
const STORE_HISTORY = 'k12-payroll-settings-history-v1';

export const PAYROLL_CAMPUSES = [
  { value: 'all', label: 'All campuses' },
  { value: 'main', label: 'Main Branch' },
  { value: 'city', label: 'City Campus' },
  { value: 'north', label: 'North Campus' }
];
export const PAYROLL_STAFF_CATEGORIES = ['Teaching', 'Administrative', 'Support Staff'];
export const WEEKDAY_OPTIONS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export type PayrollPeriodStatus = 'Draft' | 'Open' | 'Reviewed' | 'Processed' | 'Locked' | 'Closed';
export interface PayrollPeriodRecord {
  id: string;
  calendarId: string;
  periodCode: string;
  periodName: string;
  startDate: string;
  endDate: string;
  lockDate: string;
  inputCutoffDate: string;
  plannedReviewDate: string;
  plannedApprovalDate: string;
  intendedPaymentDate: string;
  financialYear: string;
  isProcessed: boolean;
  isLocked: boolean;
  isReviewed: boolean;
  status: PayrollPeriodStatus;
  sample?: boolean;
}
export interface PayrollCalendarRecord {
  id: string;
  calendarName: string;
  frequency: 'Monthly' | 'Weekly' | 'Bi-weekly' | 'Custom';
  financialYear: string;
  fyStart: string;
  fyEnd: string;
  status: 'Active' | 'Inactive';
  periods: PayrollPeriodRecord[];
  sample?: boolean;
}
export interface AttendanceRuleRecord {
  id: string;
  name: string;
  academicYear: string;
  applicableStaffTypes: string[];
  minHoursFullDay: number;
  halfDayMinHours: number;
  halfDayMaxHours: number;
  lateComingGrace: number;
  lateComingConversion: string;
  earlyGoingGrace: number;
  earlyGoingPenalty: string;
  absentLogic: string;
  absentCustomRule: string;
  overtimeEligible: boolean;
  overtimeThreshold: number;
  overtimeRounding: string;
  leaveDeductionPriority: string[];
  sandwichRule: boolean;
  lopBasis: string;
  overtimePaid: boolean;
  status: 'Active' | 'Inactive';
  sample?: boolean;
}
export interface WorkingHoliday {
  id: string;
  date: string;
  name: string;
  type: string;
  applicableTo: string[];
  treatAsWorking: boolean;
}
export interface WorkingSpecialDay {
  id: string;
  date: string;
  description: string;
  appliesTo: string[];
  overrideType: 'Off-to-Working' | 'Working-to-Off';
}
export interface WorkingHolidayCalendarRecord {
  id: string;
  name: string;
  campusId: string;
  staffTypes: string[];
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Draft' | 'Active' | 'Inactive';
  weeklyOffDays: string[];
  saturdayPattern: 'none' | 'all' | '2nd-4th' | '1st-3rd';
  holidays: WorkingHoliday[];
  specialDays: WorkingSpecialDay[];
  sample?: boolean;
}
export type PolicyStatus = 'Draft' | 'Active' | 'Superseded';
export interface PayrollPolicyVersion {
  id: string;
  policyFamilyId: string;
  version: number;
  name: string;
  schoolScope: string;
  campusId: string;
  staffCategories: string[];
  effectiveFrom: string;
  effectiveTo: string;
  status: PolicyStatus;
  changeReason: string;
  currency: string;
  paymentMethods: string[];
  calendarId: string;
  workingCalendarId: string;
  attendanceRuleId: string;
  dayBasis: 'attendance' | 'leave-application';
  unmarkedAttendance: 'absent' | 'present' | 'ignore';
  holidaysInDenominator: boolean;
  holidayAttendanceCounts: boolean;
  halfDayFraction: number;
  partialLeaveFraction: number;
  lopBasis: string;
  roundingNet: string;
  roundingPayHead: string;
  savedAt: string;
  previousValues?: Record<string, string>;
  newValues?: Record<string, string>;
  sample?: boolean;
}
export type AssignmentKind = 'school' | 'category' | 'campus-category' | 'employee';
export interface PolicyAssignment {
  id: string;
  policyFamilyId: string;
  kind: AssignmentKind;
  campusId?: string;
  staffCategory?: string;
  employeeId?: string;
}
export interface PolicyPreviewSnapshot {
  id: string;
  runId: string;
  savedAt: string;
  periodId: string;
  calendarId: string;
  calendarName: string;
  periodName: string;
  policyVersionId: string;
  policyName: string;
  policyVersion: number;
  workingCalendarId: string;
  workingCalendarName: string;
  attendanceBasis: string;
  effectiveFrom: string;
  effectiveTo: string;
  assignmentNote: string;
}
export interface PayrollPolicyConfig {
  version: 1;
  calendars: PayrollCalendarRecord[];
  attendanceRules: AttendanceRuleRecord[];
  workingCalendars: WorkingHolidayCalendarRecord[];
  policies: PayrollPolicyVersion[];
  assignments: PolicyAssignment[];
  snapshots: PolicyPreviewSnapshot[];
}

export const PAYROLL_POLICY_STAFF_PREVIEW = [
  { employeeId: 'EMP001', code: 'EMP-2020-001', name: 'Rajesh Kumar', staffCategory: 'Teaching', campusId: 'main' },
  { employeeId: 'EMP002', code: 'EMP-2019-014', name: 'Priya Sharma', staffCategory: 'Teaching', campusId: 'main' },
  { employeeId: 'EMP003', code: 'EMP-2021-008', name: 'Amit Singh', staffCategory: 'Administrative', campusId: 'city' }
];

const BRANCHES = PAYROLL_CAMPUSES.filter((item) => item.value !== 'all');
const TAX_SLABS = [
  { value: 'old-regime', label: 'Old Regime — FY 2026-27' },
  { value: 'new-regime', label: 'New Regime — FY 2026-27' },
  { value: 'none', label: 'Not applicable (no tax slabs)' }
];

type SettingsShape = {
  frequency: string;
  paymentDay: string;
  workingDayCalc: string;
  attendanceDeduction: string;
  lwpHandling: string;
  holidayTreatment: string;
  rounding: string;
  payableAccount: string;
  paymentMethod: string;
  payslipVisibility: string;
  publishToPortal: boolean;
};
const DEFAULTS: SettingsShape = {
  frequency: 'Monthly',
  paymentDay: 'Last working day',
  workingDayCalc: 'School working days (calendar minus weekly offs)',
  attendanceDeduction: 'Yes — deduct for unpaid absence after grace',
  lwpHandling: 'Prorate basic + DA on unpaid days',
  holidayTreatment: 'Do not deduct for school holidays unless contract requires',
  rounding: 'Nearest rupee',
  payableAccount: 'SAL-PAYABLE · Salary Payable',
  paymentMethod: 'Bank transfer',
  payslipVisibility: 'Staff portal after publish',
  publishToPortal: true
};
type Period = { id: string; name: string; school: string; financialYear: string; startDate: string; endDate: string; taxSlabs: string[]; status: 'Draft' | 'Active' | 'Closed'; description: string };
const SEED_PERIODS: Period[] = [{ id: 'PP-2026-27', name: 'FY 2026-27 Payroll / Tax Period', school: 'EduManager School', financialYear: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', taxSlabs: ['new-regime'], status: 'Active', description: 'Annual payroll and tax period. Not a monthly payroll run.' }];
type HistoryRow = { at: string; branch: string; by: string; change: string };

const loadJson = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};
const stamp = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const samplePeriod = (calendarId: string, code: string, name: string, start: string, end: string, extra: Partial<PayrollPeriodRecord> = {}): PayrollPeriodRecord => ({
  id: `${calendarId}-${code}`, calendarId, periodCode: code, periodName: name, startDate: start, endDate: end, lockDate: extra.lockDate || '', inputCutoffDate: extra.inputCutoffDate || '', plannedReviewDate: extra.plannedReviewDate || '', plannedApprovalDate: extra.plannedApprovalDate || '', intendedPaymentDate: extra.intendedPaymentDate || '', financialYear: extra.financialYear || 'FY 2026-27', isProcessed: extra.isProcessed || false, isLocked: extra.isLocked || false, isReviewed: extra.isReviewed || false, status: extra.status || 'Open', sample: true
});

export const samplePayrollPolicyConfig = (): PayrollPolicyConfig => ({
  version: 1,
  calendars: [{
    id: 'PC-FY26-MONTHLY', calendarName: 'Monthly Payroll FY 2026-27 (sample)', frequency: 'Monthly', financialYear: 'FY 2026-27', fyStart: '2026-04-01', fyEnd: '2027-03-31', status: 'Active', sample: true,
    periods: [
      samplePeriod('PC-FY26-MONTHLY', 'APR-2026', 'April 2026', '2026-04-01', '2026-04-30', { isProcessed: true, isLocked: true, isReviewed: true, status: 'Locked', inputCutoffDate: '2026-04-28', plannedReviewDate: '2026-05-02', plannedApprovalDate: '2026-05-04', intendedPaymentDate: '2026-05-07' }),
      samplePeriod('PC-FY26-MONTHLY', 'MAY-2026', 'May 2026', '2026-05-01', '2026-05-31', { isProcessed: true, isLocked: true, status: 'Processed', inputCutoffDate: '2026-05-28', intendedPaymentDate: '2026-06-05' }),
      samplePeriod('PC-FY26-MONTHLY', 'OCT-2026', 'October 2026', '2026-10-01', '2026-10-31', { status: 'Open', inputCutoffDate: '2026-10-28', plannedReviewDate: '2026-11-02', plannedApprovalDate: '2026-11-04', intendedPaymentDate: '2026-11-07' })
    ]
  }],
  attendanceRules: [
    { id: 'AR001', name: 'Standard Teaching Staff Rule', academicYear: '2026-27', applicableStaffTypes: ['Teaching'], minHoursFullDay: 7, halfDayMinHours: 4, halfDayMaxHours: 6.5, lateComingGrace: 15, lateComingConversion: '3 late marks = 0.5 day LOP', earlyGoingGrace: 10, earlyGoingPenalty: '3 early goings = 0.5 day LOP', absentLogic: 'No punch or < 4 hours', absentCustomRule: '', overtimeEligible: false, overtimeThreshold: 0, overtimeRounding: 'Nearest 30 minutes', leaveDeductionPriority: ['CL', 'EL', 'LOP'], sandwichRule: true, lopBasis: 'Working Days', overtimePaid: false, status: 'Active', sample: true },
    { id: 'AR002', name: 'Administrative Staff Rule', academicYear: '2026-27', applicableStaffTypes: ['Administrative'], minHoursFullDay: 8, halfDayMinHours: 4, halfDayMaxHours: 7.5, lateComingGrace: 10, lateComingConversion: '4 late marks = 0.5 day LOP', earlyGoingGrace: 10, earlyGoingPenalty: '4 early goings = 0.5 day LOP', absentLogic: 'No punch or < 4 hours', absentCustomRule: '', overtimeEligible: true, overtimeThreshold: 8, overtimeRounding: 'Nearest 1 hour', leaveDeductionPriority: ['CL', 'EL', 'LOP'], sandwichRule: false, lopBasis: 'Calendar Days', overtimePaid: true, status: 'Active', sample: true }
  ],
  workingCalendars: [{
    id: 'WC-MAIN-TEACH', name: 'Main campus teaching calendar (sample)', campusId: 'main', staffTypes: ['Teaching'], effectiveFrom: '2026-04-01', effectiveTo: '2027-03-31', status: 'Active', weeklyOffDays: ['Sunday'], saturdayPattern: '2nd-4th', sample: true,
    holidays: [{ id: 'H-DIWALI-26', date: '2026-11-08', name: 'Diwali', type: 'Festival', applicableTo: ['Teaching', 'Administrative', 'Support Staff'], treatAsWorking: false }],
    specialDays: [{ id: 'SD-ANNUAL', date: '2026-12-12', description: 'Annual Day (Saturday working)', appliesTo: ['Teaching'], overrideType: 'Off-to-Working' }]
  }],
  policies: [{
    id: 'POL-TEACH-V1', policyFamilyId: 'POL-TEACH', version: 1, name: 'Teaching staff payroll policy (sample)', schoolScope: 'EduManager School', campusId: 'all', staffCategories: ['Teaching'], effectiveFrom: '2026-04-01', effectiveTo: '', status: 'Active', changeReason: 'Initial sample policy', currency: 'INR', paymentMethods: ['Bank transfer'], calendarId: 'PC-FY26-MONTHLY', workingCalendarId: 'WC-MAIN-TEACH', attendanceRuleId: 'AR001', dayBasis: 'attendance', unmarkedAttendance: 'absent', holidaysInDenominator: false, holidayAttendanceCounts: true, halfDayFraction: 0.5, partialLeaveFraction: 0.5, lopBasis: 'Working Days', roundingNet: 'Nearest rupee', roundingPayHead: 'No rounding', savedAt: '2026-04-01, 09:00', sample: true
  }],
  assignments: [
    { id: 'ASG-SCHOOL', policyFamilyId: 'POL-TEACH', kind: 'school' },
    { id: 'ASG-TEACH', policyFamilyId: 'POL-TEACH', kind: 'category', staffCategory: 'Teaching' }
  ],
  snapshots: []
});

export function loadPayrollPolicyConfig(): { config: PayrollPolicyConfig; warning?: string; fromStore: boolean } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { config: samplePayrollPolicyConfig(), warning: 'Browser storage is unavailable. Sample data is shown and has not been written.', fromStore: false };
    const raw = window.localStorage.getItem(PAYROLL_POLICY_STORE);
    if (!raw) return { config: samplePayrollPolicyConfig(), warning: 'Sample payroll policy configuration is shown. Nothing has been saved in this browser yet.', fromStore: false };
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.calendars)) return { config: samplePayrollPolicyConfig(), warning: 'Saved configuration could not be read. Sample data is displayed and the stored file was not overwritten.', fromStore: false };
    const config: PayrollPolicyConfig = {
      version: 1,
      calendars: parsed.calendars || [],
      attendanceRules: parsed.attendanceRules || [],
      workingCalendars: parsed.workingCalendars || [],
      policies: parsed.policies || [],
      assignments: parsed.assignments || [],
      snapshots: parsed.snapshots || []
    };
    return { config, fromStore: true };
  } catch {
    return { config: samplePayrollPolicyConfig(), warning: 'Saved configuration is invalid. Sample data is displayed; unsaved edits stay on screen until a save succeeds.', fromStore: false };
  }
}

export function savePayrollPolicyConfig(config: PayrollPolicyConfig): { ok: boolean; error?: string } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { ok: false, error: 'Browser storage is unavailable. Your edits are still on this screen.' };
    window.localStorage.setItem(PAYROLL_POLICY_STORE, JSON.stringify({ ...config, version: 1 }));
    window.dispatchEvent(new Event(PAYROLL_POLICY_EVENT));
    return { ok: true };
  } catch {
    return { ok: false, error: 'The configuration could not be saved in this browser. Unsaved edits remain on screen.' };
  }
}

export function subscribePayrollPolicyConfig(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener(PAYROLL_POLICY_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => { window.removeEventListener(PAYROLL_POLICY_EVENT, handler); window.removeEventListener('storage', handler); };
}

export function nthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, nth: number) {
  const first = new Date(year, monthIndex, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, monthIndex, 1 + offset + (nth - 1) * 7);
}

export function isWeeklyOff(date: Date, calendar: WorkingHolidayCalendarRecord) {
  const day = WEEKDAY_OPTIONS[date.getDay()];
  if (calendar.weeklyOffDays.includes(day) && day !== 'Saturday') return true;
  if (day === 'Saturday') {
    if (calendar.saturdayPattern === 'all' || calendar.weeklyOffDays.includes('Saturday')) return true;
    if (calendar.saturdayPattern === 'none') return false;
    const year = date.getFullYear(); const month = date.getMonth();
    const second = nthWeekdayOfMonth(year, month, 6, 2);
    const fourth = nthWeekdayOfMonth(year, month, 6, 4);
    const first = nthWeekdayOfMonth(year, month, 6, 1);
    const third = nthWeekdayOfMonth(year, month, 6, 3);
    if (calendar.saturdayPattern === '2nd-4th') return date.getDate() === second.getDate() || date.getDate() === fourth.getDate();
    if (calendar.saturdayPattern === '1st-3rd') return date.getDate() === first.getDate() || date.getDate() === third.getDate();
  }
  return false;
}

export function datesInRange(start: string, end: string) {
  const out: Date[] = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(last.getTime()) || last < cursor) return out;
  while (cursor <= last) { out.push(new Date(cursor)); cursor.setDate(cursor.getDate() + 1); }
  return out;
}

export function workingDayPreview(period: PayrollPeriodRecord | undefined, calendar: WorkingHolidayCalendarRecord | undefined, holidaysInDenominator: boolean) {
  if (!period) return null;
  const days = datesInRange(period.startDate, period.endDate);
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const specialWorking = new Set((calendar?.specialDays || []).filter((item) => item.overrideType === 'Off-to-Working').map((item) => item.date));
  const specialOff = new Set((calendar?.specialDays || []).filter((item) => item.overrideType === 'Working-to-Off').map((item) => item.date));
  const holidaySet = new Set((calendar?.holidays || []).filter((item) => !item.treatAsWorking).map((item) => item.date));
  let weeklyOffs = 0; let holidays = 0; let countedHolidays = 0; let specialOn = 0; let specialOffCount = 0; let working = 0;
  days.forEach((date) => {
    const key = iso(date);
    const off = calendar ? isWeeklyOff(date, calendar) : false;
    const hol = holidaySet.has(key);
    if (specialWorking.has(key)) { specialOn += 1; working += 1; return; }
    if (specialOff.has(key)) { specialOffCount += 1; return; }
    if (off && hol) { weeklyOffs += 1; holidays += 1; if (holidaysInDenominator) { countedHolidays += 1; working += 1; } return; }
    if (off) { weeklyOffs += 1; return; }
    if (hol) { holidays += 1; if (holidaysInDenominator) { countedHolidays += 1; working += 1; } return; }
    working += 1;
  });
  return { total: days.length, weeklyOffs, holidays, countedHolidays, specialOn, specialOffCount, working };
}

export function resolvePolicyForStaff(config: PayrollPolicyConfig, staff: { employeeId?: string; staffCategory?: string; campusId?: string }, onDate: string) {
  const active = config.policies.filter((item) => item.status === 'Active' && item.effectiveFrom <= onDate && (!item.effectiveTo || item.effectiveTo >= onDate));
  const family = (id: string) => active.filter((item) => item.policyFamilyId === id);
  const assignments = config.assignments;
  const individual = assignments.filter((item) => item.kind === 'employee' && item.employeeId && staff.employeeId && item.employeeId === staff.employeeId);
  const campusCat = assignments.filter((item) => item.kind === 'campus-category' && item.staffCategory === staff.staffCategory && item.campusId === staff.campusId);
  const category = assignments.filter((item) => item.kind === 'category' && item.staffCategory === staff.staffCategory);
  const school = assignments.filter((item) => item.kind === 'school');
  const pick = (list: PolicyAssignment[]) => {
    const versions = list.flatMap((item) => family(item.policyFamilyId));
    if (versions.length > 1) return { conflict: true as const, policies: versions, source: list[0]?.kind };
    if (versions.length === 1) return { conflict: false as const, policy: versions[0], source: list[0]?.kind };
    return null;
  };
  return pick(individual) || pick(campusCat) || pick(category) || pick(school) || { missing: true as const };
}

export function periodOverlaps(a: PayrollPeriodRecord, b: PayrollPeriodRecord) {
  return a.startDate <= b.endDate && b.startDate <= a.endDate;
}

export function generateMissingPeriods(calendar: PayrollCalendarRecord): PayrollPeriodRecord[] {
  const existing = new Set(calendar.periods.map((item) => item.periodCode));
  const fy = calendar.financialYear.replace(/^FY\s*/, '');
  const startYear = Number(fy.slice(0, 4)) || Number(calendar.fyStart.slice(0, 4)) || 2026;
  const created: PayrollPeriodRecord[] = [];
  const add = (code: string, name: string, start: string, end: string) => {
    if (existing.has(code)) return;
    created.push({
      id: `${calendar.id}-${code}`, calendarId: calendar.id, periodCode: code, periodName: name, startDate: start, endDate: end,
      lockDate: '', inputCutoffDate: '', plannedReviewDate: '', plannedApprovalDate: '', intendedPaymentDate: '',
      financialYear: calendar.financialYear, isProcessed: false, isLocked: false, isReviewed: false, status: 'Draft'
    });
  };
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (calendar.frequency === 'Custom') return [];
  if (calendar.frequency === 'Monthly') {
    for (let i = 0; i < 12; i += 1) {
      const monthIndex = (3 + i) % 12;
      const year = i < 9 ? startYear : startYear + 1;
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 0);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      add(`${months[monthIndex].slice(0, 3).toUpperCase()}-${year}`, `${months[monthIndex]} ${year}`, iso(start), iso(end));
    }
  } else {
    const start = new Date(`${calendar.fyStart || `${startYear}-04-01`}T00:00:00`);
    const end = new Date(`${calendar.fyEnd || `${startYear + 1}-03-31`}T00:00:00`);
    const step = calendar.frequency === 'Weekly' ? 7 : 14;
    let n = 1;
    const cursor = new Date(start);
    while (cursor <= end) {
      const periodEnd = new Date(cursor); periodEnd.setDate(periodEnd.getDate() + step - 1);
      const capped = periodEnd > end ? end : periodEnd;
      add(`${calendar.frequency === 'Weekly' ? 'W' : 'BW'}-${String(n).padStart(2, '0')}-${startYear}`, `${calendar.frequency} ${n}`, iso(cursor), iso(capped));
      cursor.setDate(cursor.getDate() + step); n += 1;
    }
  }
  return created;
}

const blankPolicy = (config: PayrollPolicyConfig): PayrollPolicyVersion => ({
  id: newId('POLV'), policyFamilyId: newId('POL'), version: 1, name: '', schoolScope: 'EduManager School', campusId: 'all', staffCategories: ['Teaching'], effectiveFrom: '2026-04-01', effectiveTo: '', status: 'Draft', changeReason: '', currency: 'INR', paymentMethods: ['Bank transfer'], calendarId: config.calendars[0]?.id || '', workingCalendarId: config.workingCalendars[0]?.id || '', attendanceRuleId: config.attendanceRules.find((item) => item.status === 'Active')?.id || '', dayBasis: 'attendance', unmarkedAttendance: 'absent', holidaysInDenominator: false, holidayAttendanceCounts: true, halfDayFraction: 0.5, partialLeaveFraction: 0.5, lopBasis: 'Working Days', roundingNet: 'Nearest rupee', roundingPayHead: 'No rounding', savedAt: ''
});

export function PayrollSetup() {
  const navigate = useNavigate();
  const loaded = loadPayrollPolicyConfig();
  const [config, setConfig] = useState<PayrollPolicyConfig>(loaded.config);
  const [fromStore, setFromStore] = useState(loaded.fromStore);
  const [storeWarning, setStoreWarning] = useState(loaded.warning || '');
  const [tab, setTab] = useState<'general' | 'calendar' | 'working' | 'rounding' | 'staff' | 'history' | 'features' | 'period'>('general');
  const [draft, setDraft] = useState<PayrollPolicyVersion>(() => {
    const latest = loaded.config.policies.filter((item) => item.status === 'Draft').sort((a, b) => b.version - a.version)[0] || loaded.config.policies.find((item) => item.status === 'Active') || blankPolicy(loaded.config);
    return { ...latest };
  });
  const [notice, setNotice] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [branch, setBranch] = useState('main');
  const [byBranch, setByBranch] = useState<Record<string, SettingsShape>>(() => loadJson(STORE_SETTINGS, { main: { ...DEFAULTS } }));
  const [periods, setPeriods] = useState<Period[]>(() => loadJson(STORE_PERIODS, SEED_PERIODS));
  const [history, setHistory] = useState<HistoryRow[]>(() => loadJson(STORE_HISTORY, [] as HistoryRow[]));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editing, setEditing] = useState<Period | null>(null);
  const [creating, setCreating] = useState(false);
  const [linked, setLinked] = useState<Period | null>(null);
  const [assignKind, setAssignKind] = useState<AssignmentKind>('category');
  const [assignCategory, setAssignCategory] = useState('Teaching');
  const [assignCampus, setAssignCampus] = useState('main');
  const [assignEmployee, setAssignEmployee] = useState('EMP001');
  const [previewEmployee, setPreviewEmployee] = useState('EMP001');

  useEffect(() => subscribePayrollPolicyConfig(() => {
    const next = loadPayrollPolicyConfig();
    setConfig(next.config); setFromStore(next.fromStore); if (next.warning) setStoreWarning(next.warning);
  }), []);

  const settings = byBranch[branch] || { ...DEFAULTS };
  const flash = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(''), 4000); };
  const patch = (partial: Partial<SettingsShape>) => setByBranch((prev) => ({ ...prev, [branch]: { ...(prev[branch] || DEFAULTS), ...partial } }));
  const patchDraft = (partial: Partial<PayrollPolicyVersion>) => setDraft((current) => ({ ...current, ...partial }));
  const persistConfig = (next: PayrollPolicyConfig, success: string) => {
    const result = savePayrollPolicyConfig(next);
    if (!result.ok) { flash(result.error || 'Save failed.'); return false; }
    setConfig(next); setFromStore(true); setStoreWarning('Saved configuration is local to this browser only.'); flash(success); return true;
  };

  const calendar = config.calendars.find((item) => item.id === draft.calendarId);
  const workingCal = config.workingCalendars.find((item) => item.id === draft.workingCalendarId);
  const attendanceRule = config.attendanceRules.find((item) => item.id === draft.attendanceRuleId);
  const examplePeriod = calendar?.periods.find((item) => item.periodCode.includes('OCT')) || calendar?.periods[calendar.periods.length - 1];
  const preview = workingDayPreview(examplePeriod, workingCal, draft.holidaysInDenominator);

  const validateDraft = (forActivate: boolean) => {
    const next: string[] = [];
    if (!draft.name.trim()) next.push('Policy name is required.');
    if (!draft.effectiveFrom) next.push('Effective-from date is required.');
    if (draft.effectiveTo && draft.effectiveTo < draft.effectiveFrom) next.push('Effective-to cannot be before effective-from.');
    if (draft.halfDayFraction < 0 || draft.halfDayFraction > 1) next.push('Half-day pay fraction must be between 0 and 1.');
    if (draft.partialLeaveFraction < 0 || draft.partialLeaveFraction > 1) next.push('Partially paid leave fraction must be between 0 and 1.');
    if (draft.calendarId && !calendar) next.push('Selected payroll calendar is missing.');
    if (draft.attendanceRuleId && (!attendanceRule || attendanceRule.status !== 'Active')) next.push('Selected attendance rule is unavailable or inactive.');
    if (draft.workingCalendarId && !workingCal) next.push('Selected working/holiday calendar is missing.');
    if (forActivate && !draft.changeReason.trim()) next.push('Change reason is required before activation.');
    setErrors(next); return next;
  };

  const snapshotValues = (row: PayrollPolicyVersion) => ({
    Name: row.name, Campus: row.campusId, Categories: row.staffCategories.join(', '), From: row.effectiveFrom, To: row.effectiveTo || 'open', Calendar: row.calendarId, WorkingCalendar: row.workingCalendarId, Rule: row.attendanceRuleId, Basis: row.dayBasis, HalfDay: String(row.halfDayFraction), Rounding: row.roundingNet
  });

  const saveDraft = () => {
    if (validateDraft(false).length) { flash('Fix the highlighted issues before saving.'); return; }
    const family = draft.policyFamilyId;
    const current = config.policies.find((item) => item.id === draft.id);
    const active = config.policies.find((item) => item.policyFamilyId === family && item.status === 'Active');
    let saved: PayrollPolicyVersion;
    let nextPolicies = config.policies;
    if (current && current.status === 'Draft') {
      saved = { ...draft, status: 'Draft', savedAt: stamp(), previousValues: snapshotValues(current), newValues: snapshotValues(draft) };
      nextPolicies = config.policies.map((item) => item.id === saved.id ? saved : item);
    } else {
      const version = Math.max(0, ...config.policies.filter((item) => item.policyFamilyId === family).map((item) => item.version)) + (active ? 1 : 0);
      saved = { ...draft, id: newId('POLV'), policyFamilyId: family || newId('POL'), version: current?.status === 'Active' ? (current.version + 1) : Math.max(1, version), status: 'Draft', savedAt: stamp(), previousValues: snapshotValues(active || current || draft), newValues: snapshotValues(draft), sample: false };
      nextPolicies = [...config.policies, saved];
    }
    if (persistConfig({ ...config, policies: nextPolicies }, `Draft v${saved.version} saved in this browser.`)) setDraft(saved);
  };

  const activate = () => {
    if (validateDraft(true).length) { flash('Policy cannot be activated until the issues are resolved.'); return; }
    const family = draft.policyFamilyId;
    const version = { ...draft, status: 'Active' as const, savedAt: stamp(), sample: false, newValues: snapshotValues(draft) };
    const nextPolicies = config.policies.map((item) => {
      if (item.id === version.id) return version;
      if (item.policyFamilyId === family && item.status === 'Active') return { ...item, status: 'Superseded' as const };
      return item;
    });
    if (!nextPolicies.some((item) => item.id === version.id)) nextPolicies.push(version);
    if (persistConfig({ ...config, policies: nextPolicies }, `Policy v${version.version} activated. Earlier versions remain viewable.`)) setDraft(version);
  };

  const addAssignment = () => {
    const row: PolicyAssignment = { id: newId('ASG'), policyFamilyId: draft.policyFamilyId, kind: assignKind, campusId: assignKind === 'campus-category' || assignKind === 'school' ? assignCampus : undefined, staffCategory: assignKind === 'category' || assignKind === 'campus-category' ? assignCategory : undefined, employeeId: assignKind === 'employee' ? assignEmployee : undefined };
    const same = config.assignments.filter((item) => item.kind === row.kind && item.campusId === row.campusId && item.staffCategory === row.staffCategory && item.employeeId === row.employeeId);
    if (same.length) { flash('An assignment already exists at this precedence. Resolve the overlap instead of saving another.'); return; }
    persistConfig({ ...config, assignments: [...config.assignments, row] }, 'Assignment saved.');
  };

  const assignmentConflicts = useMemo(() => {
    const groups = new Map<string, PolicyAssignment[]>();
    config.assignments.forEach((item) => {
      const key = `${item.kind}|${item.campusId || ''}|${item.staffCategory || ''}|${item.employeeId || ''}`;
      groups.set(key, [...(groups.get(key) || []), item]);
    });
    return Array.from(groups.values()).filter((list) => list.length > 1);
  }, [config.assignments]);

  const staffPreview = PAYROLL_POLICY_STAFF_PREVIEW.find((item) => item.employeeId === previewEmployee);
  const resolved = staffPreview ? resolvePolicyForStaff(config, staffPreview, draft.effectiveFrom || '2026-10-01') : { missing: true as const };

  const log = (change: string) => { const row: HistoryRow = { at: stamp(), branch: BRANCHES.find((b) => b.value === branch)?.label || branch, by: 'Frontend preview (no verified user context)', change }; const next = [row, ...history].slice(0, 40); setHistory(next); localStorage.setItem(STORE_HISTORY, JSON.stringify(next)); };
  const saveSettings = () => { try { localStorage.setItem(STORE_SETTINGS, JSON.stringify(byBranch)); log('Saved payroll settings for this branch only.'); flash(`Settings saved for ${BRANCHES.find((b) => b.value === branch)?.label}. Other branches are unchanged.`); } catch { flash('Settings could not be saved. Edits remain on screen.'); } };
  const restore = () => { const next = { ...byBranch, [branch]: { ...DEFAULTS } }; setByBranch(next); try { localStorage.setItem(STORE_SETTINGS, JSON.stringify(next)); log('Restored default payroll settings for this branch.'); flash('Defaults restored for the selected branch only.'); } catch { flash('Restore could not be saved.'); } };
  const persistPeriods = (next: Period[]) => { setPeriods(next); localStorage.setItem(STORE_PERIODS, JSON.stringify(next)); };
  const blankPeriod = (): Period => ({ id: `PP-${Date.now()}`, name: '', school: 'EduManager School', financialYear: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', taxSlabs: [], status: 'Draft', description: '' });
  const savePeriod = () => { if (!editing) return; if (!editing.name || !editing.startDate || !editing.endDate) { flash('Period name, start date and end date are required.'); return; } const exists = periods.some((p) => p.id === editing.id); persistPeriods(exists ? periods.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...periods]); setEditing(null); setCreating(false); flash(exists ? 'Payroll period updated.' : 'Payroll period created.'); };
  const setStatus = (id: string, status: Period['status']) => { persistPeriods(periods.map((p) => { if (status === 'Active' && p.id !== id && p.status === 'Active') return { ...p, status: 'Closed' as const }; return p.id === id ? { ...p, status } : p; })); flash(status === 'Active' ? 'Period activated. Other active periods for this school were closed.' : `Period ${status.toLowerCase()}.`); };
  const linkedRuns = useMemo(() => ([{ id: 'PE-2026-10', month: 'October 2026', branch: 'Main Branch', status: 'Draft' }, { id: 'PE-2026-09', month: 'September 2026', branch: 'Main Branch', status: 'Submitted' }]), []);

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'general', label: 'General' }, { id: 'calendar', label: 'Calendar' }, { id: 'working', label: 'Working Days & Leave' }, { id: 'rounding', label: 'Rounding' }, { id: 'staff', label: 'Staff Applicability' }, { id: 'history', label: 'History' }, { id: 'features', label: 'Features' }, { id: 'period', label: 'Payroll Period' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Settings</h1>
          <p className="text-sm text-gray-500">Payroll policy and school calendar configuration. Saved values stay in this browser only.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tab === 'features' && <><Button variant="outline" onClick={() => setHistoryOpen(true)}><History className="w-4 h-4 mr-2" />View Change History</Button><Button variant="outline" onClick={restore}><RotateCcw className="w-4 h-4 mr-2" />Restore Defaults</Button><Button onClick={saveSettings}><Save className="w-4 h-4 mr-2" />Save Settings</Button></>}
          {['general', 'calendar', 'working', 'rounding', 'staff'].includes(tab) && <>
            <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
            <Button variant="outline" onClick={() => { validateDraft(false); setReviewOpen(true); }}>Review Changes</Button>
            <Button onClick={activate}>Activate</Button>
          </>}
        </div>
      </div>

      {(storeWarning || notice) && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice || storeWarning}{!fromStore && ' Sample records are labelled.'}</div>}
      {errors.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{errors.map((item) => <p key={item}>{item}</p>)}</div>}

      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-white">
        {tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`px-3 py-2.5 text-sm font-medium border-b-2 ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>)}
      </div>

      {tab === 'general' && <Card title="General"><div className="grid gap-4 p-4 md:grid-cols-2">
        <Input label="Policy name" value={draft.name} onChange={(e) => patchDraft({ name: e.target.value })} />
        <Input label="School / employer scope" value={draft.schoolScope} onChange={(e) => patchDraft({ schoolScope: e.target.value })} />
        <Select label="Campus / branch" options={PAYROLL_CAMPUSES} value={draft.campusId} onChange={(e) => patchDraft({ campusId: typeof e === 'string' ? e : e.target.value })} />
        <div className="md:col-span-2"><MultiSelect label="Staff category" options={PAYROLL_STAFF_CATEGORIES.map((item) => ({ value: item, label: item }))} value={draft.staffCategories} onChange={(value) => patchDraft({ staffCategories: value })} /></div>
        <Input label="Effective from" type="date" value={draft.effectiveFrom} onChange={(e) => patchDraft({ effectiveFrom: e.target.value })} />
        <Input label="Effective to (optional)" type="date" value={draft.effectiveTo} onChange={(e) => patchDraft({ effectiveTo: e.target.value })} />
        <Input label="Status" value={draft.status} readOnly />
        <Input label="Version" value={String(draft.version)} readOnly />
        <Select label="Currency" options={[{ value: 'INR', label: 'INR' }]} value={draft.currency} onChange={(e) => patchDraft({ currency: typeof e === 'string' ? e : e.target.value })} />
        <div><MultiSelect label="Intended payment methods" options={['Bank transfer', 'Cheque', 'Cash', 'UPI'].map((item) => ({ value: item, label: item }))} value={draft.paymentMethods} onChange={(value) => patchDraft({ paymentMethods: value })} /></div>
        <div className="md:col-span-2"><Textarea label="Change reason / notes" rows={3} value={draft.changeReason} onChange={(e) => patchDraft({ changeReason: e.target.value })} /></div>
        <p className="md:col-span-2 text-xs text-gray-500">One school entity is used. Multi-employer setup is not required. Workflow actions are a frontend preview; no reviewer identity is verified.</p>
      </div></Card>}

      {tab === 'calendar' && <Card title="Payroll calendar"><div className="space-y-4 p-4">
        <Select label="Payroll calendar" options={[{ value: '', label: 'Select calendar' }, ...config.calendars.map((item) => ({ value: item.id, label: `${item.calendarName}${item.sample ? ' (sample)' : ''}` }))]} value={draft.calendarId} onChange={(e) => patchDraft({ calendarId: typeof e === 'string' ? e : e.target.value })} />
        {calendar ? <div className="grid gap-3 rounded-lg border border-gray-100 p-3 text-sm md:grid-cols-2">
          <p><b>Name:</b> {calendar.calendarName}</p>
          <p><b>Frequency:</b> {calendar.frequency}</p>
          <p><b>Financial / payroll year:</b> {calendar.financialYear}</p>
          <p><b>Academic year:</b> kept separate — not stored on this calendar</p>
          {examplePeriod && <>
            <p><b>Period:</b> {examplePeriod.periodName} ({examplePeriod.periodCode})</p>
            <p><b>Start–end:</b> {examplePeriod.startDate} → {examplePeriod.endDate}</p>
            <p><b>Attendance/input cutoff:</b> {examplePeriod.inputCutoffDate || '—'}</p>
            <p><b>Planned review / approval:</b> {examplePeriod.plannedReviewDate || '—'} / {examplePeriod.plannedApprovalDate || '—'}</p>
            <p><b>Intended payment date:</b> {examplePeriod.intendedPaymentDate || '—'}</p>
            <p><b>Period status:</b> {examplePeriod.status}</p>
          </>}
        </div> : <p className="text-sm text-amber-700">No calendar selected.</p>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Open Payroll Calendar / Period Master</Button>
          <Button variant="outline" onClick={() => navigate('/hr/master/hr-holiday-working-day-calendar')}>Open Holiday & Working Day Calendar</Button>
        </div>
      </div></Card>}

      {tab === 'working' && <div className="space-y-4">
        <Card title="Working days & leave"><div className="grid gap-4 p-4 md:grid-cols-2">
          <Select label="Payroll days basis" options={[{ value: 'attendance', label: 'Attendance-based' }, { value: 'leave-application', label: 'Leave-application-based' }]} value={draft.dayBasis} onChange={(e) => patchDraft({ dayBasis: (typeof e === 'string' ? e : e.target.value) as PayrollPolicyVersion['dayBasis'] })} />
          {draft.dayBasis === 'attendance' && <Select label="Unmarked attendance" options={[{ value: 'absent', label: 'Treat as absent' }, { value: 'present', label: 'Treat as present' }, { value: 'ignore', label: 'Ignore' }]} value={draft.unmarkedAttendance} onChange={(e) => patchDraft({ unmarkedAttendance: (typeof e === 'string' ? e : e.target.value) as PayrollPolicyVersion['unmarkedAttendance'] })} />}
          <Select label="Include holidays in working-day denominator" options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} value={draft.holidaysInDenominator ? 'yes' : 'no'} onChange={(e) => patchDraft({ holidaysInDenominator: (typeof e === 'string' ? e : e.target.value) === 'yes' })} />
          <Select label="Count marked attendance on a holiday" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value={draft.holidayAttendanceCounts ? 'yes' : 'no'} onChange={(e) => patchDraft({ holidayAttendanceCounts: (typeof e === 'string' ? e : e.target.value) === 'yes' })} />
          <Input label="Half-day pay fraction (0–1)" type="number" min={0} max={1} step="0.1" value={draft.halfDayFraction} onChange={(e) => patchDraft({ halfDayFraction: Number(e.target.value) })} />
          <Input label="Partially paid leave fraction (0–1)" type="number" min={0} max={1} step="0.1" value={draft.partialLeaveFraction} onChange={(e) => patchDraft({ partialLeaveFraction: Number(e.target.value) })} />
          <Select label="Working / holiday calendar" options={[{ value: '', label: 'Select' }, ...config.workingCalendars.map((item) => ({ value: item.id, label: `${item.name}${item.sample ? ' (sample)' : ''}` }))]} value={draft.workingCalendarId} onChange={(e) => patchDraft({ workingCalendarId: typeof e === 'string' ? e : e.target.value })} />
          <div>
            <Select label="Attendance rule" options={[{ value: '', label: 'Select' }, ...config.attendanceRules.map((item) => ({ value: item.id, label: `${item.name}${item.status !== 'Active' ? ' (inactive)' : ''}${item.sample ? ' (sample)' : ''}` }))]} value={draft.attendanceRuleId} onChange={(e) => patchDraft({ attendanceRuleId: typeof e === 'string' ? e : e.target.value })} />
            {draft.attendanceRuleId && (!attendanceRule || attendanceRule.status !== 'Active') && <p className="mt-1 text-xs text-amber-700">The selected attendance rule is unavailable or inactive. Another rule was not substituted.</p>}
          </div>
          <Select label="LOP calculation basis" options={['Working Days', 'Calendar Days', 'Fixed 30'].map((item) => ({ value: item, label: item }))} value={draft.lopBasis} onChange={(e) => patchDraft({ lopBasis: typeof e === 'string' ? e : e.target.value })} />
        </div></Card>
        <Card title="Illustrative working-day preview"><div className="p-4 text-sm text-gray-700">
          {!preview || !examplePeriod ? <p>Select a calendar and working calendar to preview.</p> : <>
            <p className="mb-2 text-xs font-semibold uppercase text-amber-700">Illustrative only — not applied to salary amounts</p>
            <p>Example period: {examplePeriod.periodName} ({examplePeriod.startDate} to {examplePeriod.endDate})</p>
            <p>Total dates: {preview.total}</p>
            <p>Weekly offs (from selected calendar, including 2nd/4th Saturday if set): {preview.weeklyOffs}</p>
            <p>Holidays: {preview.holidays} · counted in denominator: {draft.holidaysInDenominator ? preview.countedHolidays : 0}</p>
            <p>Special working days: {preview.specialOn} · special offs: {preview.specialOffCount}</p>
            <p>Half-day fraction: {draft.halfDayFraction}</p>
            <p className="font-semibold">Example working-day basis: {preview.working} days</p>
            <p className="mt-2 text-xs text-gray-500">The same date is not counted as both a holiday and a weekly off. Saturdays follow the selected pattern; they are not assumed off.</p>
          </>}
        </div></Card>
      </div>}

      {tab === 'rounding' && <Card title="Rounding"><div className="grid gap-4 p-4 md:grid-cols-2">
        <Select label="Net-pay rounding" options={['No rounding', 'Nearest rupee', 'Round up', 'Round down'].map((item) => ({ value: item, label: item }))} value={draft.roundingNet} onChange={(e) => patchDraft({ roundingNet: typeof e === 'string' ? e : e.target.value })} />
        <Select label="Individual pay-head rounding" options={['No rounding', 'Nearest rupee', 'Round up', 'Round down'].map((item) => ({ value: item, label: item }))} value={draft.roundingPayHead} onChange={(e) => patchDraft({ roundingPayHead: typeof e === 'string' ? e : e.target.value })} />
        <p className="md:col-span-2 text-sm text-gray-600">Example: net 24,250.40 with “Nearest rupee” becomes 24,250. Pay-head rounding applies to each earning or deduction line before net pay. Existing Features rounding remains on that tab.</p>
      </div></Card>}

      {tab === 'staff' && <div className="space-y-4">
        <Card title="Assignments"><div className="grid gap-3 p-4 md:grid-cols-2">
          <Select label="Apply to" options={[{ value: 'school', label: 'All staff (school-wide default)' }, { value: 'category', label: 'Selected staff category' }, { value: 'campus-category', label: 'Campus and staff category' }, { value: 'employee', label: 'Individual employee' }]} value={assignKind} onChange={(e) => setAssignKind((typeof e === 'string' ? e : e.target.value) as AssignmentKind)} />
          {(assignKind === 'category' || assignKind === 'campus-category') && <Select label="Staff category" options={PAYROLL_STAFF_CATEGORIES.map((item) => ({ value: item, label: item }))} value={assignCategory} onChange={(e) => setAssignCategory(typeof e === 'string' ? e : e.target.value)} />}
          {assignKind === 'campus-category' && <Select label="Campus" options={BRANCHES} value={assignCampus} onChange={(e) => setAssignCampus(typeof e === 'string' ? e : e.target.value)} />}
          {assignKind === 'employee' && <Select label="Employee identity" options={PAYROLL_POLICY_STAFF_PREVIEW.map((item) => ({ value: item.employeeId, label: `${item.employeeId} · ${item.name}` }))} value={assignEmployee} onChange={(e) => setAssignEmployee(typeof e === 'string' ? e : e.target.value)} />}
          <div className="md:col-span-2"><Button onClick={addAssignment}>Save assignment for this policy family</Button></div>
        </div>
        <div className="overflow-x-auto p-4 pt-0"><table className="min-w-full text-sm"><thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">Kind</th><th>Match</th><th>Policy family</th></tr></thead><tbody>{config.assignments.map((item) => <tr key={item.id} className="border-t"><td className="py-2">{item.kind}</td><td>{item.employeeId || [item.campusId, item.staffCategory].filter(Boolean).join(' / ') || 'School-wide'}</td><td>{item.policyFamilyId}</td></tr>)}</tbody></table></div></Card>
        {assignmentConflicts.length > 0 && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"><AlertTriangle className="mr-1 inline h-4 w-4" />Overlapping assignments at the same precedence: {assignmentConflicts.map((list) => list.map((item) => item.id).join(' & ')).join('; ')}. No policy was chosen silently.</div>}
        <Card title="Which assignment wins?"><div className="space-y-3 p-4 text-sm">
          <Select label="Preview employee (identity only)" options={PAYROLL_POLICY_STAFF_PREVIEW.map((item) => ({ value: item.employeeId, label: `${item.employeeId} · ${item.name} · ${item.staffCategory}` }))} value={previewEmployee} onChange={(e) => setPreviewEmployee(typeof e === 'string' ? e : e.target.value)} />
          {staffPreview && <p className="text-xs text-gray-500">Linked identity: {staffPreview.employeeId} / {staffPreview.code}. Bank, salary and health data are not stored in this policy configuration.</p>}
          {'conflict' in resolved && resolved.conflict && <p className="text-amber-800">Conflict: more than one equally specific assignment applies. Review required.</p>}
          {'policy' in resolved && resolved.policy && <p>Selected by {resolved.source}: <b>{resolved.policy.name}</b> v{resolved.policy.version}</p>}
          {'missing' in resolved && <p>Not linked / needs review — no matching assignment.</p>}
          <p className="text-xs text-gray-500">Precedence: individual employee ID, then campus + category, then category, then school-wide default.</p>
        </div></Card>
      </div>}

      {tab === 'history' && <Card title="Policy history"><div className="overflow-x-auto p-4">
        {config.policies.length === 0 ? <p className="text-sm text-gray-500">No policy versions yet.</p> : <table className="min-w-full text-sm"><thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">Name</th><th>Ver</th><th>Dates</th><th>Status</th><th>Reason</th><th>Saved</th><th></th></tr></thead><tbody>{[...config.policies].sort((a, b) => b.version - a.version).map((item) => <tr key={item.id} className="border-t"><td className="py-2">{item.name}{item.sample ? ' (sample)' : ''}</td><td>v{item.version}</td><td>{item.effectiveFrom} → {item.effectiveTo || 'open'}</td><td><Badge variant={item.status === 'Active' ? 'success' : item.status === 'Draft' ? 'warning' : 'secondary'}>{item.status}</Badge></td><td>{item.changeReason || '—'}</td><td className="text-xs">{item.savedAt || '—'}</td><td><Button size="xs" variant="outline" onClick={() => setDraft({ ...item })}>View</Button></td></tr>)}</tbody></table>}
        <p className="mt-3 text-xs text-gray-500">Superseded versions stay viewable for their effective dates. Editing an active policy creates a new draft instead of rewriting it.</p>
      </div></Card>}

      {tab === 'features' && (
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <Select label="School / branch (overrides apply here only)" options={BRANCHES} value={branch} onChange={(e) => setBranch(typeof e === 'string' ? e : e.target.value)} />
              <p className="mt-2 text-xs text-amber-700">Changing settings for this branch does not silently update City Campus or North Campus.</p>
            </div>
          </Card>
          <Card title="Default payroll rules">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label="Default payroll frequency" options={['Monthly', 'Fortnightly', 'Weekly'].map((v) => ({ value: v, label: v }))} value={settings.frequency} onChange={(e) => patch({ frequency: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Salary payment day" options={['Last working day', 'Last calendar day', '5th of next month', '7th of next month'].map((v) => ({ value: v, label: v }))} value={settings.paymentDay} onChange={(e) => patch({ paymentDay: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Working-day calculation" options={['School working days (calendar minus weekly offs)', 'Calendar days in month', 'Fixed 30 days', 'Present days only'].map((v) => ({ value: v, label: v }))} value={settings.workingDayCalc} onChange={(e) => patch({ workingDayCalc: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Attendance-based deduction" options={['Yes — deduct for unpaid absence after grace', 'Yes — deduct from day 1', 'No — attendance does not affect salary'].map((v) => ({ value: v, label: v }))} value={settings.attendanceDeduction} onChange={(e) => patch({ attendanceDeduction: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Leave-without-pay handling" options={['Prorate basic + DA on unpaid days', 'Prorate gross pay', 'Fixed daily rate from basic', 'Do not deduct (manual only)'].map((v) => ({ value: v, label: v }))} value={settings.lwpHandling} onChange={(e) => patch({ lwpHandling: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Holiday treatment" options={['Do not deduct for school holidays unless contract requires', 'Treat holidays as unpaid for daily-wage staff', 'Follow staff-type contract (teaching vs non-teaching)'].map((v) => ({ value: v, label: v }))} value={settings.holidayTreatment} onChange={(e) => patch({ holidayTreatment: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Rounding" options={['No rounding', 'Nearest rupee', 'Round up', 'Round down'].map((v) => ({ value: v, label: v }))} value={settings.rounding} onChange={(e) => patch({ rounding: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Payroll payable account" options={['SAL-PAYABLE · Salary Payable', 'BANK-SAL · Salary Bank Account', 'SAL-ACCRUAL · Salary Accrual'].map((v) => ({ value: v, label: v }))} value={settings.payableAccount} onChange={(e) => patch({ payableAccount: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Default payment method" options={['Bank transfer', 'Cheque', 'Cash', 'UPI'].map((v) => ({ value: v, label: v }))} value={settings.paymentMethod} onChange={(e) => patch({ paymentMethod: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Payslip visibility" options={['Staff portal after publish', 'Visible to HR only until publish', 'Email on generate', 'Hidden until lock'].map((v) => ({ value: v, label: v }))} value={settings.payslipVisibility} onChange={(e) => patch({ payslipVisibility: typeof e === 'string' ? e : e.target.value })} />
              <div className="md:col-span-2"><Toggle label="Publish payslips to staff portal after payroll submit" checked={settings.publishToPortal} onChange={(checked) => patch({ publishToPortal: checked })} /></div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'period' && (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Annual payroll / tax period</h2>
                <p className="mt-1 text-xs text-gray-500">A payroll period is not a monthly payroll run. It is optional when tax slabs and flexible benefits are not required.</p>
              </div>
              <Button size="sm" onClick={() => { setCreating(true); setEditing(blankPeriod()); }}>Create Period</Button>
            </div>
          </Card>
          {periods.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <Badge variant={p.status === 'Active' ? 'success' : p.status === 'Closed' ? 'secondary' : 'warning'}>{p.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{p.school} · FY {p.financialYear} · {p.startDate} → {p.endDate}</p>
                  <p className="mt-1 text-xs text-gray-500">Tax slabs: {p.taxSlabs.length ? p.taxSlabs.map((s) => TAX_SLABS.find((t) => t.value === s)?.label || s).join(', ') : 'None'}</p>
                  {p.description && <p className="mt-1 text-xs text-gray-500">{p.description}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setCreating(false); setEditing({ ...p }); }}>Edit</Button>
                  {p.status !== 'Active' && p.status !== 'Closed' && <Button size="sm" variant="outline" onClick={() => setStatus(p.id, 'Active')}>Activate</Button>}
                  {p.status === 'Active' && <Button size="sm" variant="outline" onClick={() => setStatus(p.id, 'Closed')}>Close</Button>}
                  <Button size="sm" variant="outline" onClick={() => setLinked(p)}>View Linked Payroll</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Review changes (frontend preview)" size="lg" footer={<Button onClick={() => setReviewOpen(false)}>Close</Button>}>
        <p className="mb-2 text-xs text-gray-500">No reviewer name is claimed. Compare draft values with the last saved version of this family.</p>
        <dl className="grid gap-2 text-sm">{Object.entries(snapshotValues(draft)).map(([key, value]) => <div key={key} className="grid grid-cols-2 gap-2"><dt className="text-gray-500">{key}</dt><dd>{value}</dd></div>)}</dl>
      </Modal>
      <Modal isOpen={Boolean(editing)} onClose={() => { setEditing(null); setCreating(false); }} title={creating ? 'Create Period' : 'Edit Period'} size="lg" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button><Button onClick={savePeriod}>{creating ? 'Create Period' : 'Save'}</Button></div>}>
        {editing && (
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Period name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Input label="Company / school" value={editing.school} onChange={(e) => setEditing({ ...editing, school: e.target.value })} />
            <Select label="Financial year" options={['2025-26', '2026-27', '2027-28'].map((v) => ({ value: v, label: v }))} value={editing.financialYear} onChange={(e) => setEditing({ ...editing, financialYear: typeof e === 'string' ? e : e.target.value })} />
            <Select label="Status" options={['Draft', 'Active', 'Closed'].map((v) => ({ value: v, label: v }))} value={editing.status} onChange={(e) => setEditing({ ...editing, status: (typeof e === 'string' ? e : e.target.value) as Period['status'] })} />
            <Input label="Start date" type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
            <Input label="End date" type="date" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
            <div className="md:col-span-2"><MultiSelect label="Applicable tax slabs" options={TAX_SLABS} value={editing.taxSlabs} onChange={(v) => setEditing({ ...editing, taxSlabs: v })} placeholder="Optional if tax slabs are not required" /></div>
            <div className="md:col-span-2"><Textarea label="Description" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          </div>
        )}
      </Modal>
      <Modal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} title="Settings change history" size="lg">
        {history.length === 0 ? <p className="text-sm text-gray-500">No changes recorded yet.</p> : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">When</th><th>Branch</th><th>Change</th><th>By</th></tr></thead>
            <tbody className="divide-y">{history.map((row, i) => <tr key={`${row.at}-${i}`}><td className="py-2 pr-3 text-xs text-gray-600">{row.at}</td><td className="pr-3">{row.branch}</td><td>{row.change}</td><td>{row.by}</td></tr>)}</tbody>
          </table>
        )}
      </Modal>
      <Modal isOpen={Boolean(linked)} onClose={() => setLinked(null)} title={linked ? `Linked payroll · ${linked.name}` : 'Linked payroll'} size="md">
        <p className="mb-3 text-xs text-gray-500">Monthly payroll runs that sit under this annual period — not the period itself.</p>
        <ul className="space-y-2 text-sm">{linkedRuns.map((run) => <li key={run.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"><span><b>{run.id}</b> · {run.month} · {run.branch}</span><Badge variant={run.status === 'Draft' ? 'warning' : 'success'}>{run.status}</Badge></li>)}</ul>
      </Modal>
    </div>
  );
}

export default PayrollSetup;
