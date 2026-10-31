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
export const PAYROLL_STAFF_CATEGORIES = ['Teaching Staff', 'Non-Teaching Staff', 'Administrative Staff', 'Support Staff', 'Visiting Faculty', 'Management Staff'];
export const PAYROLL_EMPLOYMENT_CATEGORIES = ['Regular', 'Contract', 'Part-Time', 'Probation', 'Temporary', 'Apprentice / Intern', 'Deputation'];
export const PAYROLL_PAYMENT_METHODS = ['Bank Transfer', 'Cheque', 'Cash', 'Other'];
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
  frequency: 'Monthly' | 'Weekly' | 'Bi-weekly' | 'Every Two Weeks' | 'Twice Monthly' | 'Custom';
  calendarCode?: string;
  description?: string;
  campusId?: string;
  staffScope?: string[];
  financialYear: string;
  fyStart: string;
  fyEnd: string;
  status: 'Draft' | 'Active' | 'Inactive';
  periods: PayrollPeriodRecord[];
  sample?: boolean;
}
export interface AttendanceRuleRecord {
  id: string;
  name: string;
  academicYear: string;
  campusId?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
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
  status: 'Draft' | 'Active' | 'Inactive';
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
export type PolicyStatus = 'Draft' | 'In Review' | 'Scheduled' | 'Active' | 'Retired' | 'Superseded';
export interface PayrollPolicyVersion {
  id: string;
  policyFamilyId: string;
  version: number;
  name: string;
  description: string;
  schoolScope: string;
  legalEmployer: string;
  campusId: string;
  staffCategories: string[];
  employmentCategories: string[];
  academicYear: string;
  financialYear: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: PolicyStatus;
  changeReason: string;
  reviewComment: string;
  currency: string;
  paymentMethods: string[];
  defaultPaymentMethod: string;
  costCentre: string;
  calendarId: string;
  workingCalendarId: string;
  attendanceRuleId: string;
  leavePolicyName: string;
  dayBasis: 'attendance' | 'leave-application';
  unmarkedAttendance: 'absent' | 'present' | 'review';
  workingDayDenominator: 'calendar' | 'scheduled' | 'fixed-30';
  holidaysInDenominator: boolean;
  weeklyOffsInDenominator: boolean;
  holidayAttendanceCounts: boolean;
  holidaySource: 'employee' | 'shift' | 'staff-group' | 'precedence' | 'review';
  holidayListName: string;
  halfDayFraction: number;
  partialLeaveFraction: number;
  lopBasis: string;
  roundingNet: string;
  roundingPayHead: string;
  roundingUnit: string;
  roundingTie: string;
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
  employmentCategory?: string;
  employeeId?: string;
  holidayListName?: string;
  weeklyOffPattern?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
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
  { employeeId: 'EMP001', code: 'EMP-2020-001', name: 'Rajesh Kumar', staffCategory: 'Teaching Staff', campusId: 'main', employmentCategory: 'Regular' },
  { employeeId: 'EMP002', code: 'EMP-2019-014', name: 'Priya Sharma', staffCategory: 'Teaching Staff', campusId: 'main', employmentCategory: 'Contract' },
  { employeeId: 'EMP003', code: 'EMP-2021-008', name: 'Amit Singh', staffCategory: 'Administrative Staff', campusId: 'city', employmentCategory: 'Regular' }
];

const BRANCHES = PAYROLL_CAMPUSES.filter((item) => item.value !== 'all');
const TAX_SLABS = [
  { value: 'old-regime', label: 'Old Regime — FY 2026-27' },
  { value: 'new-regime', label: 'New Regime — FY 2026-27' },
  { value: 'none', label: 'Not applicable (no tax slabs)' }
];

type StaffStructureRow = { id: string; category: string; structureId: string; autoAssign: boolean };
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
  defaultCompany: string;
  dailyWageBasis: 'calendar' | 'working' | 'custom';
  customWageFormula: string;
  maxTimesheetHours: number;
  includeHolidaysInWorkingDays: boolean;
  employeeWiseAccounting: boolean;
  costCenter: string;
  encryptSalarySlips: boolean;
  autoEmailSlip: boolean;
  emailTemplate: string;
  replyToEmail: string;
  considerGrace: boolean;
  graceMinutes: number;
  lwpThreshold: number;
  payrollBasedOn: 'attendance' | 'leave';
  biometricConnected: boolean;
  biometricDevice: string;
  biometricLastSync: string;
  staffStructureMap: StaffStructureRow[];
  academicStart: string;
  academicEnd: string;
  autoLockEnabled: boolean;
  autoLockDay: number;
  overrideHr: boolean;
  overridePayroll: boolean;
  overrideSystem: boolean;
  overrideReasonRequired: boolean;
};
const SAMPLE_STRUCTURES = [
  { id: 'SS-TEACH-M', name: 'Teaching Regular', frequency: 'Monthly' },
  { id: 'SS-ADMIN-M', name: 'Administration Monthly', frequency: 'Monthly' },
  { id: 'SS-VISIT-H', name: 'Visiting Faculty Hourly', frequency: 'Hourly' }
];
export const PAYROLL_COMPANIES = [
  { value: 'edumanager', label: 'EduManager School', status: 'Active' },
  { value: 'city-trust', label: 'City Campus Trust', status: 'Active' },
  { value: 'north-society', label: 'North Campus Society', status: 'Active' }
];
const PAYROLL_ACCOUNTS = [
  { value: 'SAL-PAYABLE · Salary Payable', label: 'Salaries Payable', path: 'Liabilities > Current Liabilities > Salaries Payable' },
  { value: 'BANK-SAL · Salary Bank Account', label: 'Salary Bank Account', path: 'Assets > Bank > Salary Bank' },
  { value: 'SAL-ACCRUAL · Salary Accrual', label: 'Salary Accrual', path: 'Liabilities > Accruals > Salary Accrual' }
];
const COST_CENTERS = ['Teaching Dept', 'Administration', 'Sports', 'Library', 'Others'];
const EMAIL_TEMPLATES = [
  { value: 'slip-standard', label: 'Salary slip — standard (school letterhead)' },
  { value: 'slip-compact', label: 'Salary slip — compact' }
];
const DEFAULT_STAFF_MAP: StaffStructureRow[] = [
  { id: 'sc1', category: 'Teaching — Permanent', structureId: 'SS-TEACH-M', autoAssign: true },
  { id: 'sc2', category: 'Teaching — Contractual', structureId: 'SS-TEACH-M', autoAssign: false },
  { id: 'sc3', category: 'Visiting Faculty', structureId: 'SS-VISIT-H', autoAssign: true },
  { id: 'sc4', category: 'Non-Teaching — Support', structureId: 'SS-ADMIN-M', autoAssign: false }
];
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
  publishToPortal: true,
  defaultCompany: 'edumanager',
  dailyWageBasis: 'working',
  customWageFormula: '',
  maxTimesheetHours: 160,
  includeHolidaysInWorkingDays: false,
  employeeWiseAccounting: false,
  costCenter: 'Teaching Dept',
  encryptSalarySlips: true,
  autoEmailSlip: false,
  emailTemplate: '',
  replyToEmail: 'hr@school.edu',
  considerGrace: false,
  graceMinutes: 10,
  lwpThreshold: 3,
  payrollBasedOn: 'attendance',
  biometricConnected: true,
  biometricDevice: 'ZKTeco-F18',
  biometricLastSync: '2026-10-29, 06:45',
  staffStructureMap: DEFAULT_STAFF_MAP,
  academicStart: '2026-04-01',
  academicEnd: '2027-03-31',
  autoLockEnabled: true,
  autoLockDay: 25,
  overrideHr: true,
  overridePayroll: false,
  overrideSystem: false,
  overrideReasonRequired: true
};
const mergeSettings = (row?: Partial<SettingsShape>): SettingsShape => ({
  ...DEFAULTS,
  ...row,
  staffStructureMap: row?.staffStructureMap?.length ? row.staffStructureMap : DEFAULTS.staffStructureMap
});
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
    { id: 'AR001', name: 'Standard Teaching Staff Rule', academicYear: '2026-27', applicableStaffTypes: ['Teaching Staff'], minHoursFullDay: 7, halfDayMinHours: 4, halfDayMaxHours: 6.5, lateComingGrace: 15, lateComingConversion: '3 late marks = 0.5 day LOP', earlyGoingGrace: 10, earlyGoingPenalty: '3 early goings = 0.5 day LOP', absentLogic: 'No punch or < 4 hours', absentCustomRule: '', overtimeEligible: false, overtimeThreshold: 0, overtimeRounding: 'Nearest 30 minutes', leaveDeductionPriority: ['Casual Leave (CL)', 'Earned Leave (EL)', 'Leave Without Pay (LOP)'], sandwichRule: true, lopBasis: 'Working Days', overtimePaid: false, status: 'Active', sample: true },
    { id: 'AR002', name: 'Administrative Staff Rule', academicYear: '2026-27', applicableStaffTypes: ['Administrative Staff'], minHoursFullDay: 8, halfDayMinHours: 4, halfDayMaxHours: 7.5, lateComingGrace: 10, lateComingConversion: '4 late marks = 0.5 day LOP', earlyGoingGrace: 10, earlyGoingPenalty: '4 early goings = 0.5 day LOP', absentLogic: 'No punch or < 4 hours', absentCustomRule: '', overtimeEligible: true, overtimeThreshold: 8, overtimeRounding: 'Nearest 1 hour', leaveDeductionPriority: ['Casual Leave (CL)', 'Earned Leave (EL)', 'Leave Without Pay (LOP)'], sandwichRule: false, lopBasis: 'Calendar Days', overtimePaid: true, status: 'Active', sample: true }
  ],
  workingCalendars: [{
    id: 'WC-MAIN-TEACH', name: 'Main campus teaching calendar (sample)', campusId: 'main', staffTypes: ['Teaching Staff'], effectiveFrom: '2026-04-01', effectiveTo: '2027-03-31', status: 'Active', weeklyOffDays: ['Sunday'], saturdayPattern: '2nd-4th', sample: true,
    holidays: [{ id: 'H-DIWALI-26', date: '2026-11-08', name: 'Diwali', type: 'Festival', applicableTo: ['Teaching Staff', 'Administrative Staff', 'Support Staff'], treatAsWorking: false }],
    specialDays: [{ id: 'SD-ANNUAL', date: '2026-12-12', description: 'Annual Day (Saturday working)', appliesTo: ['Teaching Staff'], overrideType: 'Off-to-Working' }]
  }],
  policies: [{
    id: 'POL-TEACH-V1', policyFamilyId: 'POL-TEACH', version: 1, name: 'Teaching Staff Payroll Policy', description: 'Default teaching-staff policy for the 2026–27 payroll year.', schoolScope: 'EduManager School', legalEmployer: 'Not configured', campusId: 'all', staffCategories: ['Teaching Staff'], employmentCategories: ['Regular', 'Contract'], academicYear: '2026-27', financialYear: 'FY 2026-27', effectiveFrom: '2026-04-01', effectiveTo: '', status: 'Active', changeReason: 'Initial sample policy', reviewComment: '', currency: 'INR', paymentMethods: ['Bank Transfer'], defaultPaymentMethod: 'Bank Transfer', costCentre: 'Not used', calendarId: 'PC-FY26-MONTHLY', workingCalendarId: 'WC-MAIN-TEACH', attendanceRuleId: 'AR001', leavePolicyName: 'Teaching Staff Leave Policy', dayBasis: 'attendance', unmarkedAttendance: 'absent', workingDayDenominator: 'scheduled', holidaysInDenominator: false, weeklyOffsInDenominator: false, holidayAttendanceCounts: true, holidaySource: 'staff-group', holidayListName: 'Main Campus Staff Holidays 2026–27', halfDayFraction: 0.5, partialLeaveFraction: 0.5, lopBasis: 'Basic Only', roundingNet: 'Nearest', roundingPayHead: 'No policy rounding', roundingUnit: '1.00', roundingTie: 'Ties away from zero', savedAt: '2026-04-01, 09:00', sample: true
  }],
  assignments: [
    { id: 'ASG-SCHOOL', policyFamilyId: 'POL-TEACH', kind: 'school' },
    { id: 'ASG-TEACH', policyFamilyId: 'POL-TEACH', kind: 'category', staffCategory: 'Teaching Staff', employmentCategory: 'Regular' }
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

export function workingDayPreview(period: PayrollPeriodRecord | undefined, calendar: WorkingHolidayCalendarRecord | undefined, holidaysInDenominator: boolean, weeklyOffsInDenominator = false) {
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
    if (off && hol) { weeklyOffs += 1; holidays += 1; if (holidaysInDenominator || weeklyOffsInDenominator) { countedHolidays += 1; working += 1; } return; }
    if (off) { weeklyOffs += 1; if (weeklyOffsInDenominator) working += 1; return; }
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
  if (calendar.frequency === 'Twice Monthly') {
    for (let i = 0; i < 12; i += 1) {
      const monthIndex = (3 + i) % 12;
      const year = i < 9 ? startYear : startYear + 1;
      const mid = new Date(year, monthIndex, 15);
      const end = new Date(year, monthIndex + 1, 0);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      add(`${months[monthIndex].slice(0, 3).toUpperCase()}-${year}-A`, `${months[monthIndex]} ${year} (1–15)`, iso(new Date(year, monthIndex, 1)), iso(mid));
      add(`${months[monthIndex].slice(0, 3).toUpperCase()}-${year}-B`, `${months[monthIndex]} ${year} (16–end)`, iso(new Date(year, monthIndex, 16)), iso(end));
    }
    return created;
  }
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
    const step = calendar.frequency === 'Weekly' ? 7 : 14; // Every Two Weeks / Bi-weekly kept as 14-day; confirm if an older Bi-weekly value meant something else.
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
  id: newId('POLV'), policyFamilyId: newId('POL'), version: 1, name: '', description: '', schoolScope: 'EduManager School', legalEmployer: 'Not configured', campusId: 'all', staffCategories: ['Teaching Staff'], employmentCategories: ['Regular'], academicYear: '2026-27', financialYear: 'FY 2026-27', effectiveFrom: '2026-04-01', effectiveTo: '', status: 'Draft', changeReason: '', reviewComment: '', currency: 'INR', paymentMethods: ['Bank Transfer'], defaultPaymentMethod: 'Bank Transfer', costCentre: 'Not used', calendarId: config.calendars[0]?.id || '', workingCalendarId: config.workingCalendars[0]?.id || '', attendanceRuleId: config.attendanceRules.find((item) => item.status === 'Active')?.id || '', leavePolicyName: 'Teaching Staff Leave Policy', dayBasis: 'attendance', unmarkedAttendance: 'absent', workingDayDenominator: 'scheduled', holidaysInDenominator: false, weeklyOffsInDenominator: false, holidayAttendanceCounts: true, holidaySource: 'staff-group', holidayListName: '', halfDayFraction: 0.5, partialLeaveFraction: 0.5, lopBasis: 'Basic Only', roundingNet: 'No policy rounding', roundingPayHead: 'No policy rounding', roundingUnit: '1.00', roundingTie: 'Ties away from zero', savedAt: ''
});
const fillPolicy = (row: Partial<PayrollPolicyVersion>, config: PayrollPolicyConfig): PayrollPolicyVersion => ({
  ...blankPolicy(config),
  ...row,
  staffCategories: row.staffCategories?.length ? row.staffCategories : ['Teaching Staff'],
  employmentCategories: row.employmentCategories?.length ? row.employmentCategories : ['Regular'],
  paymentMethods: row.paymentMethods?.length ? row.paymentMethods : ['Bank Transfer']
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
    return fillPolicy(latest, loaded.config);
  });
  const [notice, setNotice] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [branch, setBranch] = useState('main');
  const [byBranch, setByBranch] = useState<Record<string, SettingsShape>>(() => {
    const stored = loadJson<Record<string, Partial<SettingsShape>>>(STORE_SETTINGS, { main: { ...DEFAULTS } });
    const next: Record<string, SettingsShape> = {};
    Object.keys(stored || { main: DEFAULTS }).forEach((key) => { next[key] = mergeSettings(stored[key]); });
    if (!next.main) next.main = { ...DEFAULTS };
    return next;
  });
  const [periods, setPeriods] = useState<Period[]>(() => loadJson(STORE_PERIODS, SEED_PERIODS));
  const [history, setHistory] = useState<HistoryRow[]>(() => loadJson(STORE_HISTORY, [] as HistoryRow[]));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editing, setEditing] = useState<Period | null>(null);
  const [creating, setCreating] = useState(false);
  const [linked, setLinked] = useState<Period | null>(null);
  const [assignKind, setAssignKind] = useState<AssignmentKind>('category');
  const [assignCategory, setAssignCategory] = useState('Teaching Staff');
  const [assignEmployment, setAssignEmployment] = useState('Regular');
  const [periodSearch, setPeriodSearch] = useState('');
  const [periodStatusFilter, setPeriodStatusFilter] = useState('All');
  const [sampleAmount, setSampleAmount] = useState('1234.56');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [unsavedWarn, setUnsavedWarn] = useState('');
  const [assignCampus, setAssignCampus] = useState('main');
  const [assignEmployee, setAssignEmployee] = useState('EMP001');
  const [previewEmployee, setPreviewEmployee] = useState('EMP001');
  const [companyQuery, setCompanyQuery] = useState('');
  const [pendingCompany, setPendingCompany] = useState<string | null>(null);
  const [pendingFrequency, setPendingFrequency] = useState<string | null>(null);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [lockCursor, setLockCursor] = useState({ year: 2026, month: 9 });
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify({ main: DEFAULTS }));
  const [settingsBanner, setSettingsBanner] = useState('');

  useEffect(() => subscribePayrollPolicyConfig(() => {
    const next = loadPayrollPolicyConfig();
    setConfig(next.config); setFromStore(next.fromStore); if (next.warning) setStoreWarning(next.warning);
  }), []);
  useEffect(() => { setSavedSnapshot(JSON.stringify(byBranch)); }, []);

  const settings = mergeSettings(byBranch[branch]);
  const settingsDirty = JSON.stringify(byBranch) !== savedSnapshot;
  const flash = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(''), 4000); };
  const patch = (partial: Partial<SettingsShape>) => setByBranch((prev) => ({ ...prev, [branch]: { ...mergeSettings(prev[branch]), ...partial } }));
  const filteredCompanies = PAYROLL_COMPANIES.filter((item) => !companyQuery || item.label.toLowerCase().includes(companyQuery.toLowerCase()));
  const selectedCompany = PAYROLL_COMPANIES.find((item) => item.value === settings.defaultCompany);
  const selectedAccount = PAYROLL_ACCOUNTS.find((item) => item.value === settings.payableAccount);
  const academicMonths = (() => {
    if (!settings.academicStart || !settings.academicEnd) return 0;
    const a = new Date(`${settings.academicStart}T00:00:00`);
    const b = new Date(`${settings.academicEnd}T00:00:00`);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return 0;
    return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
  })();
  const academicNonStandard = settings.academicStart.slice(5, 10) !== '04-01' || settings.academicEnd.slice(5, 10) !== '03-31';
  const timesheetWarn = settings.maxTimesheetHours < 40 || settings.maxTimesheetHours > 300;
  const lockDays = new Date(lockCursor.year, lockCursor.month + 1, 0).getDate();
  const requestFrequency = (next: string) => {
    if (next === settings.frequency) return;
    if (next !== 'Monthly' && SAMPLE_STRUCTURES.some((item) => item.frequency === 'Monthly')) {
      setPendingFrequency(next);
      return;
    }
    patch({ frequency: next });
  };
  const applyFrequency = (next: string) => { patch({ frequency: next }); setPendingFrequency(null); };
  const requestCompany = (next: string) => {
    if (next === settings.defaultCompany) return;
    setPendingCompany(next);
  };
  const validateSettings = () => {
    const next: string[] = [];
    if (!settings.payableAccount) next.push('Payroll payable account is required. Payroll Entry cannot be submitted without this account.');
    if (settings.dailyWageBasis === 'custom' && !settings.customWageFormula.trim()) next.push('Custom daily-wage formula is required when Custom is selected.');
    if (settings.autoEmailSlip && !settings.emailTemplate) next.push('Select an email template before auto-emailing salary slips.');
    if (settings.autoLockEnabled && (settings.autoLockDay < 1 || settings.autoLockDay > 31)) next.push('Auto-lock day must be between 1 and 31.');
    setErrors(next);
    setSettingsBanner(next.length ? `Please fix ${next.length} error${next.length > 1 ? 's' : ''} before saving.` : '');
    return next;
  };
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
  const preview = workingDayPreview(examplePeriod, workingCal, draft.holidaysInDenominator, draft.weeklyOffsInDenominator);
  const displayStatus = draft.status === 'Active' && draft.effectiveFrom > '2026-10-29' ? 'Scheduled' : draft.status;
  const familyPolicies = config.policies.filter((item) => item.policyFamilyId === draft.policyFamilyId).sort((a, b) => b.version - a.version);
  const missingSetup = [
    !draft.name.trim() ? 'Policy name' : '',
    !draft.calendarId ? 'Payroll calendar' : '',
    !draft.effectiveFrom ? 'Effective from' : ''
  ].filter(Boolean);

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
    const future = draft.effectiveFrom > '2026-10-29';
    const version = { ...draft, status: (future ? 'Scheduled' : 'Active') as PolicyStatus, savedAt: stamp(), sample: false, newValues: snapshotValues(draft) };
    const nextPolicies = config.policies.map((item) => {
      if (item.id === version.id) return version;
      if (item.policyFamilyId === family && item.status === 'Active' && version.status === 'Active') return { ...item, status: 'Superseded' as const };
      return item;
    });
    if (!nextPolicies.some((item) => item.id === version.id)) nextPolicies.push(version);
    if (persistConfig({ ...config, policies: nextPolicies }, future ? `Version scheduled from ${version.effectiveFrom}. It is not Active yet.` : `Policy v${version.version} activated. Earlier versions remain viewable.`)) setDraft(version);
  };
  const newPolicy = () => { setDraft(blankPolicy(config)); setTab('general'); flash('Blank draft opened. The earlier policy is unchanged.'); };
  const duplicatePolicy = () => { setDraft({ ...draft, id: newId('POLV'), policyFamilyId: newId('POL'), version: 1, status: 'Draft', name: draft.name ? `${draft.name} (copy)` : '', savedAt: '', sample: false }); flash('Values copied into a new draft. The original policy is unchanged.'); };
  const submitReview = () => {
    if (validateDraft(false).length) { flash('Fix missing items before review.'); return; }
    const next = { ...draft, status: 'In Review' as const, savedAt: stamp() };
    const policies = config.policies.some((item) => item.id === next.id) ? config.policies.map((item) => item.id === next.id ? next : item) : [...config.policies, next];
    if (persistConfig({ ...config, policies }, 'Submitted for review (frontend demonstration — no reviewer identity is verified).')) setDraft(next);
  };
  const discardDraft = () => {
    if (!window.confirm('Discard this draft? The earlier version stays unchanged.')) return;
    const earlier = config.policies.find((item) => item.policyFamilyId === draft.policyFamilyId && item.status === 'Active') || config.policies.find((item) => item.policyFamilyId === draft.policyFamilyId && item.id !== draft.id);
    persistConfig({ ...config, policies: config.policies.filter((item) => !(item.id === draft.id && item.status === 'Draft')) }, 'Draft discarded. Earlier version unchanged.');
    setDraft(earlier ? fillPolicy(earlier, config) : blankPolicy(config));
  };
  const roundSample = (amount: number, method: string, unit: number) => {
    if (method === 'No policy rounding' || !unit) return amount;
    const scaled = amount / unit;
    const stepped = method === 'Up' ? Math.ceil(scaled) : method === 'Down' ? Math.floor(scaled) : Math.round(scaled);
    return stepped * unit;
  };
  const sampleNum = Number(String(sampleAmount).replace(/,/g, '')) || 0;
  const unitNum = Number(draft.roundingUnit) || 1;
  const filteredPeriods = (calendar?.periods || []).filter((p) => {
    if (periodStatusFilter !== 'All' && p.status !== periodStatusFilter) return false;
    if (periodSearch && !(`${p.periodName} ${p.periodCode}`.toLowerCase().includes(periodSearch.toLowerCase()))) return false;
    return true;
  });

  const addAssignment = () => {
    const row: PolicyAssignment = { id: newId('ASG'), policyFamilyId: draft.policyFamilyId, kind: assignKind, campusId: assignKind === 'campus-category' || assignKind === 'school' ? assignCampus : undefined, staffCategory: assignKind === 'category' || assignKind === 'campus-category' ? assignCategory : undefined, employmentCategory: assignKind === 'category' || assignKind === 'campus-category' ? assignEmployment : undefined, employeeId: assignKind === 'employee' ? assignEmployee : undefined };
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
  const persistSettings = (next: Record<string, SettingsShape>, message: string) => {
    try {
      localStorage.setItem(STORE_SETTINGS, JSON.stringify(next));
      setByBranch(next);
      setSavedSnapshot(JSON.stringify(next));
      setLastSavedAt(stamp());
      setSettingsBanner('');
      log(message);
      flash(`Payroll settings saved successfully for ${BRANCHES.find((b) => b.value === branch)?.label}. Other branches are unchanged.`);
      return true;
    } catch {
      flash('Settings could not be saved. Edits remain on screen.');
      return false;
    }
  };
  const saveSettings = () => {
    if (validateSettings().length) { flash('Please fix the highlighted issues before saving.'); return false; }
    return persistSettings(byBranch, 'Saved payroll settings for this branch only.');
  };
  const saveAndProceed = () => {
    if (!saveSettings()) return;
    setTab('period');
  };
  const restore = () => { const next = { ...byBranch, [branch]: { ...DEFAULTS } }; persistSettings(next, 'Restored default payroll settings for this branch.'); };
  const cancelSettings = () => {
    if (!settingsDirty) return;
    try {
      const parsed = JSON.parse(savedSnapshot) as Record<string, SettingsShape>;
      setByBranch(parsed);
      setCancelConfirm(false);
      flash('Unsaved settings changes were discarded.');
    } catch {
      setCancelConfirm(false);
    }
  };
  const persistPeriods = (next: Period[]) => { setPeriods(next); localStorage.setItem(STORE_PERIODS, JSON.stringify(next)); };
  const blankPeriod = (): Period => ({ id: `PP-${Date.now()}`, name: '', school: 'EduManager School', financialYear: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', taxSlabs: [], status: 'Draft', description: '' });
  const savePeriod = () => { if (!editing) return; if (!editing.name || !editing.startDate || !editing.endDate) { flash('Period name, start date and end date are required.'); return; } const exists = periods.some((p) => p.id === editing.id); persistPeriods(exists ? periods.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...periods]); setEditing(null); setCreating(false); flash(exists ? 'Payroll period updated.' : 'Payroll period created.'); };
  const setStatus = (id: string, status: Period['status']) => { persistPeriods(periods.map((p) => { if (status === 'Active' && p.id !== id && p.status === 'Active') return { ...p, status: 'Closed' as const }; return p.id === id ? { ...p, status } : p; })); flash(status === 'Active' ? 'Period activated. Other active periods for this school were closed.' : `Period ${status.toLowerCase()}.`); };
  const linkedRuns = useMemo(() => ([{ id: 'PE-2026-10', month: 'October 2026', branch: 'Main Branch', status: 'Draft' }, { id: 'PE-2026-09', month: 'September 2026', branch: 'Main Branch', status: 'Submitted' }]), []);

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'general', label: 'General' }, { id: 'calendar', label: 'Calendar' }, { id: 'working', label: 'Working Days & Leave' }, { id: 'rounding', label: 'Rounding' }, { id: 'staff', label: 'Staff Applicability' }, { id: 'history', label: 'History' }, { id: 'features', label: 'Advanced' }, { id: 'period', label: 'Payroll Period' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Setup</h1>
          <p className="text-sm text-gray-500">Manage payroll policies, calendars and staff applicability. Saving a policy does not process payroll.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tab === 'features' && <><Button variant="outline" onClick={() => setHistoryOpen(true)}><History className="w-4 h-4 mr-2" />View Change History</Button><Button variant="outline" onClick={restore}><RotateCcw className="w-4 h-4 mr-2" />Restore Defaults</Button><Button variant="outline" onClick={() => settingsDirty ? setCancelConfirm(true) : undefined}>Cancel</Button><Button variant="outline" onClick={saveSettings}><Save className="w-4 h-4 mr-2" />Save & Stay</Button><Button onClick={saveAndProceed}>Save & Proceed to Payroll Period</Button></>}
          {['general', 'calendar', 'working', 'rounding', 'staff', 'history'].includes(tab) && <>
            <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
            <Button variant="outline" onClick={() => { validateDraft(false); setReviewOpen(true); }}>Review Changes</Button>
            <Button variant="outline" onClick={submitReview}>Submit for Review</Button>
            <Button onClick={activate}>{draft.effectiveFrom > '2026-10-29' ? 'Schedule' : 'Activate'}</Button>
            <Button variant="outline" onClick={discardDraft}>Discard Draft</Button>
          </>}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <label className="min-w-[260px] flex-1 text-xs font-medium text-gray-600">Policy
          <select className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm" value={draft.id} onChange={(event) => {
            const next = config.policies.find((item) => item.id === event.target.value);
            if (!next) return;
            setDraft(fillPolicy(next, config));
            setUnsavedWarn('');
          }}>
            {config.policies.length === 0 && <option value="">No payroll policies have been created.</option>}
            {config.policies.map((item) => <option key={item.id} value={item.id}>{item.name || 'Untitled'} — {item.status === 'Active' && item.effectiveFrom > '2026-10-29' ? 'Scheduled' : item.status}{item.sample ? ' (sample)' : ''} · v{item.version}</option>)}
          </select>
        </label>
        <Button onClick={newPolicy}>New Policy</Button>
        <Button variant="outline" onClick={duplicatePolicy}>Duplicate Policy</Button>
        <Button variant="outline" onClick={() => setTab('history')}>View History</Button>
        <Badge variant={displayStatus === 'Active' ? 'success' : displayStatus === 'Draft' || displayStatus === 'In Review' ? 'warning' : 'secondary'}>{displayStatus}</Badge>
        <p className="text-sm text-gray-600">Effective from: {draft.effectiveFrom || 'Not selected'}</p>
        <p className="text-sm text-gray-600">Scope: {PAYROLL_CAMPUSES.find((item) => item.value === draft.campusId)?.label || draft.campusId} · {draft.staffCategories.join(', ') || '—'}</p>
      </div>
      {missingSetup.length > 0 && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">Missing setup: {missingSetup.join(', ')}.</div>}
      {unsavedWarn && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">{unsavedWarn}</div>}
      {tab === 'features' && settingsDirty && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">Unsaved changes. Last saved: {lastSavedAt || 'not yet in this session'}.</div>}
      {tab === 'features' && settingsBanner && <button type="button" className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-left text-sm text-red-800" onClick={() => document.getElementById('payroll-payable-account')?.scrollIntoView({ behavior: 'smooth' })}>{settingsBanner}</button>}

      {(storeWarning || notice) && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice || storeWarning}{!fromStore && ' Sample records are labelled.'}</div>}
      {errors.length > 0 && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{errors.map((item) => <p key={item}>{item}</p>)}</div>}

      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-white">
        {tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`px-3 py-2.5 text-sm font-medium border-b-2 ${tab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>)}
      </div>

      {tab === 'general' && <Card title="General"><div className="grid gap-4 p-4 md:grid-cols-2">
        <Input label="Policy name *" value={draft.name} onChange={(e) => patchDraft({ name: e.target.value })} />
        <Select label="School entity / legal employer" options={[{ value: 'Not configured', label: 'Not configured' }, { value: 'EduManager School', label: 'EduManager School' }]} value={draft.legalEmployer} onChange={(e) => patchDraft({ legalEmployer: typeof e === 'string' ? e : e.target.value })} />
        <div className="md:col-span-2"><Textarea label="Description" rows={2} value={draft.description} onChange={(e) => patchDraft({ description: e.target.value })} /></div>
        <Select label="Campus / branch" options={PAYROLL_CAMPUSES} value={draft.campusId} onChange={(e) => patchDraft({ campusId: typeof e === 'string' ? e : e.target.value })} />
        <div><p className="mb-1 text-xs font-medium text-gray-600">Staff scope</p><p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">{draft.staffCategories.join(', ') || 'Not selected'} <button type="button" className="ml-2 text-blue-700 underline" onClick={() => setTab('staff')}>Manage Staff Applicability</button></p></div>
        <Select label="Financial / payroll year" options={[{ value: 'FY 2025-26', label: 'FY 2025-26 — 01 Apr 2025 to 31 Mar 2026' }, { value: 'FY 2026-27', label: 'FY 2026-27 — 01 Apr 2026 to 31 Mar 2027' }]} value={draft.financialYear} onChange={(e) => patchDraft({ financialYear: typeof e === 'string' ? e : e.target.value })} />
        <Select label="Academic year (optional school context)" options={[{ value: '', label: 'Not selected' }, { value: '2025-26', label: '2025-26' }, { value: '2026-27', label: '2026-27' }]} value={draft.academicYear} onChange={(e) => patchDraft({ academicYear: typeof e === 'string' ? e : e.target.value })} />
        <Select label="Currency" options={[{ value: 'INR', label: 'INR — Indian Rupee' }]} value={draft.currency} onChange={(e) => patchDraft({ currency: typeof e === 'string' ? e : e.target.value })} />
        <Select label="Cost centre" options={[{ value: 'Not used', label: 'Not used' }]} value={draft.costCentre} onChange={(e) => patchDraft({ costCentre: typeof e === 'string' ? e : e.target.value })} />
        <div className="md:col-span-2"><MultiSelect label="Intended payment methods" options={PAYROLL_PAYMENT_METHODS.map((item) => ({ value: item, label: item }))} value={draft.paymentMethods} onChange={(value) => patchDraft({ paymentMethods: value, defaultPaymentMethod: value.includes(draft.defaultPaymentMethod) ? draft.defaultPaymentMethod : value[0] || '' })} /></div>
        <Select label="Default payment method" options={(draft.paymentMethods.length ? draft.paymentMethods : PAYROLL_PAYMENT_METHODS).map((item) => ({ value: item, label: item }))} value={draft.defaultPaymentMethod} onChange={(e) => patchDraft({ defaultPaymentMethod: typeof e === 'string' ? e : e.target.value })} />
        <Input label="Effective from *" type="date" value={draft.effectiveFrom} onChange={(e) => patchDraft({ effectiveFrom: e.target.value })} />
        <Input label="Effective to (optional)" type="date" value={draft.effectiveTo} onChange={(e) => patchDraft({ effectiveTo: e.target.value })} />
        <Input label="Status" value={displayStatus} readOnly />
        <Input label="Version" value={String(draft.version)} readOnly />
        <div className="md:col-span-2"><Textarea label="Change reason" rows={3} value={draft.changeReason} onChange={(e) => patchDraft({ changeReason: e.target.value })} /></div>
        <p className="md:col-span-2 text-xs text-gray-500">Academic year is school context only and does not change the payroll year. Workflow actions are a frontend preview; no reviewer identity is verified. Selecting a payment method does not pay an employee.</p>
      </div></Card>}

      {tab === 'calendar' && <Card title="Payroll calendar"><div className="space-y-4 p-4">
        {config.calendars.length === 0 ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">No eligible payroll calendar is available. Create a payroll calendar before selecting it here. <Button size="sm" className="ml-2" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Create Calendar</Button></div> : (
          <Select label="Payroll calendar" options={[{ value: '', label: 'Select a payroll calendar' }, ...config.calendars.map((item) => ({ value: item.id, label: `${item.calendarName} — ${item.frequency} — ${item.status}${item.sample ? ' (sample)' : ''}` }))]} value={draft.calendarId} onChange={(e) => patchDraft({ calendarId: typeof e === 'string' ? e : e.target.value })} />
        )}
        {calendar && <div className="grid gap-3 rounded-lg border border-gray-100 p-3 text-sm md:grid-cols-2">
          <p><b>Calendar name:</b> {calendar.calendarName}</p>
          <p><b>Frequency:</b> {calendar.frequency}</p>
          <p><b>Year context:</b> {calendar.financialYear}</p>
          <p><b>Status:</b> {calendar.status}</p>
        </div>}
        {calendar && <div className="flex flex-wrap gap-2">
          <input value={periodSearch} onChange={(e) => setPeriodSearch(e.target.value)} placeholder="Search periods by name or code" className="h-10 min-w-[200px] flex-1 rounded-lg border border-gray-300 px-3 text-sm" />
          <select value={periodStatusFilter} onChange={(e) => setPeriodStatusFilter(e.target.value)} className="h-10 rounded-lg border border-gray-300 px-3 text-sm">
            {['All', 'Draft', 'Open', 'Reviewed', 'Processed', 'Locked', 'Closed'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>}
        {calendar && <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2 text-left">Period</th><th>Start</th><th>End</th><th>Cutoff</th><th>Review / approval</th><th>Payment</th><th>Status</th></tr></thead><tbody>{filteredPeriods.map((p) => <tr key={p.id} className="border-t"><td className="px-3 py-2">{p.periodName}<p className="text-xs text-gray-400">{p.periodCode}</p></td><td>{p.startDate}</td><td>{p.endDate}</td><td>{p.inputCutoffDate || '—'}</td><td>{p.plannedReviewDate || '—'} / {p.plannedApprovalDate || '—'}</td><td>{p.intendedPaymentDate || '—'}</td><td>{p.status}</td></tr>)}{filteredPeriods.length === 0 && <tr><td colSpan={7} className="px-3 py-4 text-center text-gray-500">No periods match the search.</td></tr>}</tbody></table></div>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Create Calendar</Button>
          <Button variant="outline" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Manage Periods</Button>
        </div>
        <p className="text-xs text-gray-500">This tab selects a calendar. Individual periods are created on Payroll Calendar / Period Master.</p>
      </div></Card>}

      {tab === 'working' && <div className="space-y-4">
        <Card title="Working days & leave"><div className="grid gap-4 p-4 md:grid-cols-2">
          <Select label="Calculate payment days from" options={[{ value: 'attendance', label: 'Attendance' }, { value: 'leave-application', label: 'Approved Leave Applications' }]} value={draft.dayBasis} onChange={(e) => patchDraft({ dayBasis: (typeof e === 'string' ? e : e.target.value) as PayrollPolicyVersion['dayBasis'] })} />
          {draft.dayBasis === 'attendance' ? <>
            <div>
              <Select label="Attendance rule set" options={[{ value: '', label: 'Select' }, ...config.attendanceRules.map((item) => ({ value: item.id, label: `${item.name} · ${(item.applicableStaffTypes || []).join(', ')} · ${item.status}${item.sample ? ' (sample)' : ''}` }))]} value={draft.attendanceRuleId} onChange={(e) => patchDraft({ attendanceRuleId: typeof e === 'string' ? e : e.target.value })} />
              {draft.attendanceRuleId && (!attendanceRule || attendanceRule.status !== 'Active') && <p className="mt-1 text-xs text-amber-700">The selected attendance rule is unavailable or inactive. Another rule was not substituted.</p>}
            </div>
            <Select label="Unmarked attendance" options={[{ value: 'present', label: 'Treat as Present' }, { value: 'absent', label: 'Treat as Absent' }, { value: 'review', label: 'Needs Review' }]} value={draft.unmarkedAttendance} onChange={(e) => patchDraft({ unmarkedAttendance: (typeof e === 'string' ? e : e.target.value) as PayrollPolicyVersion['unmarkedAttendance'] })} />
          </> : <>
            <Select label="Leave policy" options={[{ value: 'Teaching Staff Leave Policy', label: 'Teaching Staff Policy — 2026-27' }, { value: 'Non-Teaching Staff Leave Policy', label: 'Non-Teaching Staff Policy — 2026-27' }]} value={draft.leavePolicyName} onChange={(e) => patchDraft({ leavePolicyName: typeof e === 'string' ? e : e.target.value })} />
            <p className="text-sm text-gray-500">Unmarked attendance is not applicable when payment days come from approved leave applications.</p>
          </>}
          <Select label="Working-day denominator" options={[{ value: 'calendar', label: 'Calendar Days' }, { value: 'scheduled', label: 'Scheduled Working Days' }, { value: 'fixed-30', label: 'Fixed 30 Days' }]} value={draft.workingDayDenominator} onChange={(e) => patchDraft({ workingDayDenominator: (typeof e === 'string' ? e : e.target.value) as PayrollPolicyVersion['workingDayDenominator'] })} />
          {draft.workingDayDenominator === 'scheduled' && <>
            <Select label="Include holidays in denominator" options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} value={draft.holidaysInDenominator ? 'yes' : 'no'} onChange={(e) => patchDraft({ holidaysInDenominator: (typeof e === 'string' ? e : e.target.value) === 'yes' })} />
            <Select label="Include weekly offs in denominator" options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} value={draft.weeklyOffsInDenominator ? 'yes' : 'no'} onChange={(e) => patchDraft({ weeklyOffsInDenominator: (typeof e === 'string' ? e : e.target.value) === 'yes' })} />
          </>}
          {draft.workingDayDenominator === 'calendar' && <p className="text-sm text-gray-500">All period dates are already in the denominator.</p>}
          {draft.workingDayDenominator === 'fixed-30' && <p className="text-sm text-amber-700">Fixed 30 is an example denominator. Partial-period handling must be specified separately.</p>}
          <Select label="Consider marked attendance on holidays" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} value={draft.holidayAttendanceCounts ? 'yes' : 'no'} onChange={(e) => patchDraft({ holidayAttendanceCounts: (typeof e === 'string' ? e : e.target.value) === 'yes' })} />
          <Select label="Holiday source" options={[{ value: 'employee', label: 'Employee-specific list' }, { value: 'shift', label: 'Shift-specific list' }, { value: 'staff-group', label: 'Staff-group / default list' }, { value: 'precedence', label: 'Configured precedence' }, { value: 'review', label: 'Needs review' }]} value={draft.holidaySource} onChange={(e) => patchDraft({ holidaySource: (typeof e === 'string' ? e : e.target.value) as PayrollPolicyVersion['holidaySource'] })} />
          {draft.holidaySource === 'review' && <p className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">Holiday list needs review. Employee list and shift list both exist. Choose which source applies. One was not chosen silently.</p>}
          <Select label="Working / holiday calendar" options={[{ value: '', label: 'Select' }, ...config.workingCalendars.map((item) => ({ value: item.id, label: `${item.name}${item.sample ? ' (sample)' : ''}` }))]} value={draft.workingCalendarId} onChange={(e) => patchDraft({ workingCalendarId: typeof e === 'string' ? e : e.target.value })} />
          <div className="flex items-end"><Button variant="outline" onClick={() => navigate('/hr/master/hr-holiday-working-day-calendar')}>View Working Calendar</Button></div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">Half-day pay fraction</p>
            <div className="mb-2 flex gap-2">{[0.5, 0.75].map((n) => <button key={n} type="button" className={`rounded-lg border px-3 py-1 text-sm ${draft.halfDayFraction === n ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => patchDraft({ halfDayFraction: n })}>{n}</button>)}<button type="button" className="rounded-lg border border-gray-300 px-3 py-1 text-sm" onClick={() => patchDraft({ halfDayFraction: 0.6 })}>Custom</button></div>
            <Input type="number" min={0} max={1} step="0.05" value={draft.halfDayFraction} onChange={(e) => patchDraft({ halfDayFraction: Number(e.target.value) })} />
            <p className="mt-1 text-xs text-gray-500">For this example, a half-day attendance receives {Math.round(draft.halfDayFraction * 100)}% of one full day’s pay.</p>
          </div>
          <Input label="Partially paid leave fraction (separate from half-day)" type="number" min={0} max={1} step="0.1" value={draft.partialLeaveFraction} onChange={(e) => patchDraft({ partialLeaveFraction: Number(e.target.value) })} />
          <Select label="LOP amount basis" options={['Basic Only', 'Basic + DA', 'Gross Salary'].map((item) => ({ value: item, label: item }))} value={draft.lopBasis} onChange={(e) => patchDraft({ lopBasis: typeof e === 'string' ? e : e.target.value })} />
        </div></Card>
        <Card title="Illustrative working-day preview"><div className="p-4 text-sm text-gray-700">
          {!preview || !examplePeriod ? <p>Select a calendar and working calendar to preview.</p> : <>
            <p className="mb-2 text-xs font-semibold uppercase text-amber-700">Illustration only. Actual results depend on the selected policy, calendar, attendance, leave and applicable salary components.</p>
            <p>Example period: {examplePeriod.periodName} ({examplePeriod.startDate} to {examplePeriod.endDate})</p>
            <p>Period days: {preview.total}</p>
            <p>Weekly offs: {preview.weeklyOffs} · Other holidays: {preview.holidays}</p>
            <p>Denominator example: {draft.workingDayDenominator === 'fixed-30' ? 30 : draft.workingDayDenominator === 'calendar' ? preview.total : preview.working}</p>
            <p>Half-day fraction: {draft.halfDayFraction} · LOP amount basis: {draft.lopBasis}</p>
            <p className="mt-2 text-xs text-gray-500">The same date is counted once if it is both a holiday and a weekly off. Saturdays follow the selected pattern; they are not assumed off. Selecting Treat as Absent does not claim that an actual deduction was made.</p>
          </>}
        </div></Card>
      </div>}

      {tab === 'rounding' && <Card title="Rounding"><div className="grid gap-4 p-4 md:grid-cols-2">
        <Select label="Net pay rounding" options={['No policy rounding', 'Nearest', 'Up', 'Down'].map((item) => ({ value: item, label: item }))} value={draft.roundingNet} onChange={(e) => patchDraft({ roundingNet: typeof e === 'string' ? e : e.target.value })} />
        <Select label="Individual pay head rounding" options={['No policy rounding', 'Nearest', 'Up', 'Down'].map((item) => ({ value: item, label: item }))} value={draft.roundingPayHead} onChange={(e) => patchDraft({ roundingPayHead: typeof e === 'string' ? e : e.target.value })} />
        <Select label="Rounding unit" options={[{ value: '0.01', label: '0.01' }, { value: '0.10', label: '0.10' }, { value: '0.50', label: '0.50' }, { value: '1.00', label: '1.00' }]} value={draft.roundingUnit} onChange={(e) => patchDraft({ roundingUnit: typeof e === 'string' ? e : e.target.value })} />
        {draft.roundingNet === 'Nearest' && <Select label="Tie rule" options={[{ value: 'Ties away from zero', label: 'Ties away from zero' }, { value: 'Half to Even', label: 'Half to Even' }]} value={draft.roundingTie} onChange={(e) => patchDraft({ roundingTie: typeof e === 'string' ? e : e.target.value })} />}
        <Input label="Sample amount" value={sampleAmount} onChange={(e) => setSampleAmount(e.target.value)} />
        <div className="rounded-lg border border-gray-100 p-3 text-sm md:col-span-2">
          <p>Sample: ₹{sampleNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · Unit: ₹{unitNum.toFixed(2)}</p>
          <p>Nearest → ₹{roundSample(sampleNum, 'Nearest', unitNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p>Up → ₹{roundSample(sampleNum, 'Up', unitNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p>Down → ₹{roundSample(sampleNum, 'Down', unitNum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="mt-2 text-xs text-gray-500">If Up means toward positive infinity, −₹1,234.56 becomes −₹1,234. Formatting to two decimal places is not a separate payroll rounding decision. Existing Advanced rounding remains on that tab.</p>
        </div>
      </div></Card>}

      {tab === 'staff' && <div className="space-y-4">
        <Card title="Assignments"><div className="grid gap-3 p-4 md:grid-cols-2">
          <Select label="Apply to" options={[{ value: 'school', label: 'All staff (school-wide default)' }, { value: 'category', label: 'Selected staff category' }, { value: 'campus-category', label: 'Campus and staff category' }, { value: 'employee', label: 'Individual employee' }]} value={assignKind} onChange={(e) => setAssignKind((typeof e === 'string' ? e : e.target.value) as AssignmentKind)} />
          {(assignKind === 'category' || assignKind === 'campus-category') && <Select label="Staff type" options={PAYROLL_STAFF_CATEGORIES.map((item) => ({ value: item, label: item }))} value={assignCategory} onChange={(e) => setAssignCategory(typeof e === 'string' ? e : e.target.value)} />}
          {(assignKind === 'category' || assignKind === 'campus-category') && <Select label="Employment category" options={PAYROLL_EMPLOYMENT_CATEGORIES.map((item) => ({ value: item, label: item }))} value={assignEmployment} onChange={(e) => setAssignEmployment(typeof e === 'string' ? e : e.target.value)} />}
          {assignKind === 'campus-category' && <Select label="Campus" options={BRANCHES} value={assignCampus} onChange={(e) => setAssignCampus(typeof e === 'string' ? e : e.target.value)} />}
          {assignKind === 'employee' && <Select label="Employee identity" options={PAYROLL_POLICY_STAFF_PREVIEW.map((item) => ({ value: item.employeeId, label: `${item.employeeId} · ${item.name}` }))} value={assignEmployee} onChange={(e) => setAssignEmployee(typeof e === 'string' ? e : e.target.value)} />}
          <div className="md:col-span-2"><Button onClick={addAssignment}>Save assignment for this policy family</Button></div>
        </div>
        <div className="overflow-x-auto p-4 pt-0"><table className="min-w-full text-sm"><thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">Kind</th><th>Campus</th><th>Staff type</th><th>Employment</th><th>Employee</th><th>Policy family</th></tr></thead><tbody>{config.assignments.map((item) => <tr key={item.id} className="border-t"><td className="py-2">{item.kind}</td><td>{item.campusId || 'All campuses'}</td><td>{item.staffCategory || '—'}</td><td>{item.employmentCategory || 'All applicable'}</td><td>{item.employeeId || '—'}</td><td>{item.policyFamilyId}</td></tr>)}</tbody></table></div></Card>
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
        {config.policies.length === 0 ? <p className="text-sm text-gray-500">No policy versions yet.</p> : <table className="min-w-full text-sm"><thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">Name</th><th>Ver</th><th>Dates</th><th>Status</th><th>Reason</th><th>Saved</th><th></th></tr></thead><tbody>{[...config.policies].sort((a, b) => b.version - a.version).map((item) => <tr key={item.id} className="border-t"><td className="py-2">{item.name}{item.sample ? ' (sample)' : ''}</td><td>v{item.version}</td><td>{item.effectiveFrom} → {item.effectiveTo || 'open'}</td><td><Badge variant={item.status === 'Active' ? 'success' : item.status === 'Draft' ? 'warning' : 'secondary'}>{item.status}</Badge></td><td>{item.changeReason || '—'}</td><td className="text-xs">{item.savedAt || '—'}</td><td><Button size="xs" variant="outline" onClick={() => setDraft(fillPolicy(item, config))}>View</Button></td></tr>)}</tbody></table>}
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
          <Card title="Grade mapping (existing)">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {['Grade A – Senior', 'Grade B – Regular', 'Grade C – Junior', 'Grade D – Support'].map((grade) => (
                <Input key={grade} label={grade} value={grade} readOnly />
              ))}
              <p className="md:col-span-2 text-xs text-gray-500">These existing mapping labels are preserved. Matching names on Salary Grade / Pay Scale Master are not assumed to be the same records until deliberately linked.</p>
            </div>
          </Card>
          <Card title="Features & modules (existing)">
            <div className="grid gap-3 p-4 md:grid-cols-2 text-sm">
              {['Loans & Advances', 'Arrears Processing', 'Bonus / Ex-gratia', 'Finance Integration'].map((item) => (
                <label key={item} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"><input type="checkbox" defaultChecked={item !== 'Finance Integration'} /> {item}</label>
              ))}
              <p className="md:col-span-2 text-xs text-gray-500">These existing toggles are kept separate from the policy workflow. Their presence does not prove that modules are hidden or that the labelled actions run.</p>
            </div>
          </Card>
          <Card title="Default payroll rules">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Select label="Salary payment day" options={['Last working day', 'Last calendar day', '5th of next month', '7th of next month'].map((v) => ({ value: v, label: v }))} value={settings.paymentDay} onChange={(e) => patch({ paymentDay: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Working-day calculation" options={['School working days (calendar minus weekly offs)', 'Calendar days in month', 'Fixed 30 days', 'Present days only'].map((v) => ({ value: v, label: v }))} value={settings.workingDayCalc} onChange={(e) => patch({ workingDayCalc: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Attendance-based deduction" options={['Yes — deduct for unpaid absence after grace', 'Yes — deduct from day 1', 'No — attendance does not affect salary'].map((v) => ({ value: v, label: v }))} value={settings.attendanceDeduction} onChange={(e) => patch({ attendanceDeduction: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Leave-without-pay handling" options={['Prorate basic + DA on unpaid days', 'Prorate gross pay', 'Fixed daily rate from basic', 'Do not deduct (manual only)'].map((v) => ({ value: v, label: v }))} value={settings.lwpHandling} onChange={(e) => patch({ lwpHandling: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Holiday treatment" options={['Do not deduct for school holidays unless contract requires', 'Treat holidays as unpaid for daily-wage staff', 'Follow staff-type contract (teaching vs non-teaching)'].map((v) => ({ value: v, label: v }))} value={settings.holidayTreatment} onChange={(e) => patch({ holidayTreatment: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Rounding" options={['No rounding', 'Nearest rupee', 'Round up', 'Round down'].map((v) => ({ value: v, label: v }))} value={settings.rounding} onChange={(e) => patch({ rounding: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Default payment method" options={['Bank transfer', 'Cheque', 'Cash', 'UPI'].map((v) => ({ value: v, label: v }))} value={settings.paymentMethod} onChange={(e) => patch({ paymentMethod: typeof e === 'string' ? e : e.target.value })} />
              <Select label="Payslip visibility" options={['Staff portal after publish', 'Visible to HR only until publish', 'Email on generate', 'Hidden until lock'].map((v) => ({ value: v, label: v }))} value={settings.payslipVisibility} onChange={(e) => patch({ payslipVisibility: typeof e === 'string' ? e : e.target.value })} />
              <div className="md:col-span-2"><Toggle label="Publish payslips to staff portal after payroll submit" checked={settings.publishToPortal} onChange={(checked) => patch({ publishToPortal: checked })} /></div>
            </div>
          </Card>
          <Card title="Quick navigation">
            <div className="flex flex-wrap gap-2 p-4">
              <Button variant="outline" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Go to Payroll Period</Button>
              <Button variant="outline" onClick={() => navigate('/hr/income-tax/tax-slab-surcharge-master')}>View Tax Slabs</Button>
              <Button variant="outline" onClick={() => navigate('/hr/master/pay-head-master')}>Manage Components</Button>
              <Button variant="outline" onClick={() => navigate('/hr/master/salary-structure-master')}>Build Structures</Button>
              <Button variant="outline" onClick={() => navigate('/hr/payroll/payroll-entry')}>Payroll Entry</Button>
              <Button variant="outline" onClick={() => navigate('/hr/payroll/employee-payslip-list')}>Salary Slips</Button>
            </div>
            <div className="grid gap-1 px-4 pb-4 text-sm text-gray-600">
              <p>Company: {selectedCompany ? 'Set' : 'Not configured'}</p>
              <p>Payroll period: {periods.some((p) => p.status === 'Active') ? 'Active' : 'Not configured'}</p>
              <p>Tax slab: {periods.some((p) => p.taxSlabs.length) ? 'Configured' : 'Not configured'}</p>
              <p>Salary components: {SAMPLE_STRUCTURES.length} sample structures linked from Salary Structure Master</p>
              <p className="text-xs text-gray-400">Last saved: {lastSavedAt || 'Not saved in this session'}</p>
            </div>
          </Card>
          <Card title="General payroll settings">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-medium text-gray-600">Default company</p>
                <p className="mb-2 text-xs italic text-gray-400">All payroll documents filter to this company</p>
                <input value={companyQuery} onChange={(e) => setCompanyQuery(e.target.value)} placeholder="Search and select company..." className="mb-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm" />
                <select className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm" value={settings.defaultCompany} onChange={(e) => requestCompany(e.target.value)}>
                  {filteredCompanies.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {selectedCompany && <p className="mt-1 text-sm">{selectedCompany.label} <Badge variant="success">{selectedCompany.status}</Badge></p>}
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-medium text-gray-600">Payroll frequency</p>
                <p className="mb-2 text-xs italic text-gray-400">Default for all new Salary Structures. Existing structures are not auto-updated.</p>
                <div className="flex flex-wrap gap-2">{['Monthly', 'Bi-Monthly', 'Fortnightly', 'Weekly'].map((item) => <button key={item} type="button" className={`rounded-lg border px-3 py-2 text-sm ${settings.frequency === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => requestFrequency(item)}>{item}</button>)}</div>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-medium text-gray-600">Daily wages calculation</p>
                <p className="mb-2 text-xs italic text-gray-400">Determines how per-day salary is computed for LOP deductions</p>
                <div className="flex flex-wrap gap-2">
                  {[{ id: 'calendar', label: 'Calendar Days' }, { id: 'working', label: 'Working Days (recommended)' }, { id: 'custom', label: 'Custom' }].map((item) => (
                    <button key={item.id} type="button" className={`rounded-lg border px-3 py-2 text-sm ${settings.dailyWageBasis === item.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => patch({ dailyWageBasis: item.id as SettingsShape['dailyWageBasis'] })}>{item.label}</button>
                  ))}
                </div>
                {settings.dailyWageBasis === 'custom' && <Textarea className="mt-2 font-mono" rows={4} label="Custom formula" value={settings.customWageFormula} onChange={(e) => patch({ customWageFormula: e.target.value })} />}
              </div>
              <div>
                <Input label="Max timesheet hours / month" type="number" value={String(settings.maxTimesheetHours)} onChange={(e) => patch({ maxTimesheetHours: Number(e.target.value) || 0 })} />
                <p className="mt-1 text-xs text-gray-500">Applies to visiting/hourly faculty only. Salary Slip will error if exceeded. Only active for Salary Structures with Based on Timesheet enabled.</p>
                {timesheetWarn && <p className="mt-1 text-xs text-red-600">Typical range: 80–200 hrs/month</p>}
              </div>
              <div>
                <Toggle label="Include holidays in working days" checked={settings.includeHolidaysInWorkingDays} onChange={(checked) => patch({ includeHolidaysInWorkingDays: checked })} />
                <p className="mt-1 text-xs text-gray-500">Prevents LOP deductions on school holidays.</p>
                {settings.includeHolidaysInWorkingDays && <p className="mt-2 text-sm text-emerald-800">School holidays from the Holiday List will be counted as Present days. <button type="button" className="underline" onClick={() => navigate('/hr/master/hr-holiday-working-day-calendar')}>Configure Holiday List</button></p>}
              </div>
            </div>
          </Card>
          <Card title="Accounting integration">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Toggle label="Employee-wise accounting" checked={settings.employeeWiseAccounting} onChange={(checked) => patch({ employeeWiseAccounting: checked })} />
                <p className="mt-1 text-xs text-gray-500">Creates individual ledger entries per employee. Turn off for schools with 100+ staff.</p>
                {settings.employeeWiseAccounting && <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">Enabling this may slow down payroll processing for large schools. Recommended only for schools with under 50 employees.</p>}
              </div>
              <div id="payroll-payable-account" className="md:col-span-2">
                <Select label="Payroll payable account *" options={[{ value: '', label: 'Search accounts (type to filter)...' }, ...PAYROLL_ACCOUNTS.map((item) => ({ value: item.value, label: item.label }))]} value={settings.payableAccount} onChange={(e) => patch({ payableAccount: typeof e === 'string' ? e : e.target.value })} />
                {selectedAccount && <p className="mt-1 text-xs text-gray-400">{selectedAccount.path}</p>}
                {!settings.payableAccount && <p className="mt-1 text-xs text-red-600">Required: Payroll Entry cannot be submitted without this account.</p>}
                <button type="button" className="mt-1 text-xs text-blue-700 underline" onClick={() => navigate('/hr/payroll/payroll-entry')}>Used in Journal Entry / Payroll Entry</button>
              </div>
              <div className="md:col-span-2">
                <Select label="Default cost center" options={COST_CENTERS.map((item) => ({ value: item, label: item }))} value={settings.costCenter} onChange={(e) => patch({ costCenter: typeof e === 'string' ? e : e.target.value })} />
                <p className="mt-1 text-xs text-gray-500">Payroll expenses are booked here. Can be overridden per employee.</p>
                <div className="mt-2 flex flex-wrap gap-2">{COST_CENTERS.map((item) => <button key={item} type="button" className={`rounded-full border px-3 py-1 text-xs ${settings.costCenter === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`} onClick={() => patch({ costCenter: item })}>{item}</button>)}</div>
              </div>
              <div>
                <Toggle label="Encrypt salary slips in emails" checked={settings.encryptSalarySlips} onChange={(checked) => patch({ encryptSalarySlips: checked })} />
                <p className="mt-1 text-xs text-gray-500">Password-protected PDF. Password = employee date of birth (DDMMYYYY). Example: 15-Aug-1985 → 15081985.</p>
                {settings.encryptSalarySlips && <Badge variant="success">Recommended</Badge>}
              </div>
              <div>
                <Toggle label="Auto-email salary slip on submission" checked={settings.autoEmailSlip} onChange={(checked) => patch({ autoEmailSlip: checked })} />
                <p className="mt-1 text-xs text-gray-500">Sends the PDF to the employee’s registered email when the slip is submitted.</p>
                {settings.autoEmailSlip && (
                  <div className="mt-3 space-y-2 border-l-2 border-blue-200 pl-3">
                    <Select label="Email template" options={[{ value: '', label: 'Select email template...' }, ...EMAIL_TEMPLATES]} value={settings.emailTemplate} onChange={(e) => patch({ emailTemplate: typeof e === 'string' ? e : e.target.value })} />
                    <button type="button" className="text-xs text-blue-700 underline" onClick={() => navigate('/hr/payroll/employee-payslip-list')}>Create new template (Salary Slips)</button>
                    <Input label="Reply-to email" value={settings.replyToEmail} onChange={(e) => patch({ replyToEmail: e.target.value })} />
                    <Button variant="outline" size="sm" onClick={() => setEmailPreviewOpen(true)}>Preview email</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card title="Leave & attendance integration">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div>
                <Toggle label="Consider grace period in attendance" checked={settings.considerGrace} onChange={(checked) => patch({ considerGrace: checked })} />
                <p className="mt-1 text-xs text-gray-500">Staff arriving within the grace window are not marked late or absent.</p>
                {settings.considerGrace && <Input label="Grace period duration (minutes)" type="number" value={String(settings.graceMinutes)} onChange={(e) => patch({ graceMinutes: Number(e.target.value) || 0 })} />}
              </div>
              <div>
                <Input label="LWP alert threshold (days/month)" type="number" value={String(settings.lwpThreshold)} onChange={(e) => patch({ lwpThreshold: Number(e.target.value) || 0 })} />
                <p className="mt-1 text-xs text-gray-500">Triggers a warning banner on the employee’s Salary Slip. School recommended: 3 days.</p>
                <p className="mt-1 text-xs">{settings.lwpThreshold <= 2 ? 'Green band (0–2)' : settings.lwpThreshold <= 5 ? 'Amber band (3–5)' : 'Red band (6+)'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-medium text-gray-600">Payroll calculation based on</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={`rounded-lg border px-3 py-2 text-sm ${settings.payrollBasedOn === 'attendance' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => patch({ payrollBasedOn: 'attendance' })}>Attendance (recommended for schools)</button>
                  <button type="button" className={`rounded-lg border px-3 py-2 text-sm ${settings.payrollBasedOn === 'leave' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => patch({ payrollBasedOn: 'leave' })}>Leave application only</button>
                </div>
                {settings.payrollBasedOn === 'attendance' && (
                  <div className="mt-3 rounded-lg border border-gray-100 p-3 text-sm">
                    <p className="font-medium">Biometric integration status</p>
                    {settings.biometricConnected ? <p>Connected — Device: {settings.biometricDevice}. Last sync: {settings.biometricLastSync}</p> : <p className="text-red-700">No biometric device linked. Attendance must be entered manually. <button type="button" className="underline" onClick={() => patch({ biometricConnected: true, biometricDevice: 'ZKTeco-F18', biometricLastSync: stamp() })}>Connect device</button></p>}
                    {settings.biometricConnected && <Button size="sm" variant="outline" className="mt-2" onClick={() => patch({ biometricLastSync: stamp() })}>Sync now</Button>}
                    {settings.biometricConnected && <button type="button" className="ml-2 text-xs text-gray-500 underline" onClick={() => patch({ biometricConnected: false })}>Mark as disconnected</button>}
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card title="School-specific configuration">
            <div className="space-y-4 p-4">
              <div>
                <p className="text-xs font-medium text-gray-600">Staff category → default salary structure</p>
                <p className="mb-2 text-xs italic text-gray-400">When a new employee is created, the staff category auto-suggests the linked structure in Salary Structure Assignment.</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-xs uppercase text-gray-500"><tr><th className="py-2">Staff category</th><th>Default salary structure</th><th>Auto-assign?</th><th></th></tr></thead>
                    <tbody>
                      {settings.staffStructureMap.map((row) => (
                        <tr key={row.id} className="border-t">
                          <td className="py-2"><input className="h-9 w-full rounded border border-gray-300 px-2" value={row.category} onChange={(e) => patch({ staffStructureMap: settings.staffStructureMap.map((item) => item.id === row.id ? { ...item, category: e.target.value } : item) })} /></td>
                          <td>
                            {SAMPLE_STRUCTURES.length === 0 ? <p className="text-amber-700">No structures created yet. <button type="button" className="underline" onClick={() => navigate('/hr/master/salary-structure-master')}>Create one</button></p> : (
                              <select className="h-9 rounded border border-gray-300 px-2" value={row.structureId} onChange={(e) => patch({ staffStructureMap: settings.staffStructureMap.map((item) => item.id === row.id ? { ...item, structureId: e.target.value } : item) })}>
                                <option value="">Select structure</option>
                                {SAMPLE_STRUCTURES.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.frequency})</option>)}
                              </select>
                            )}
                          </td>
                          <td><Toggle checked={row.autoAssign} onChange={(checked) => patch({ staffStructureMap: settings.staffStructureMap.map((item) => item.id === row.id ? { ...item, autoAssign: checked } : item) })} /></td>
                          <td><Button size="sm" variant="outline" onClick={() => patch({ staffStructureMap: settings.staffStructureMap.filter((item) => item.id !== row.id) })}>Remove</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" className="mt-2" onClick={() => patch({ staffStructureMap: [...settings.staffStructureMap, { id: newId('SC'), category: '', structureId: '', autoAssign: false }] })}>Add staff category row</Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input label="Academic year start" type="date" value={settings.academicStart} onChange={(e) => patch({ academicStart: e.target.value })} />
                <Input label="Academic year end" type="date" value={settings.academicEnd} onChange={(e) => patch({ academicEnd: e.target.value })} />
                <p className="md:col-span-2 text-sm text-gray-600">Duration: {academicMonths || '—'} months{settings.academicStart && settings.academicEnd ? ` (${settings.academicStart} to ${settings.academicEnd})` : ''}. Payroll reports auto-filter by this window for year-end tax documents.</p>
                {academicNonStandard && <p className="md:col-span-2 text-sm text-amber-800">Non-standard academic year. Ensure your Payroll Period matches.</p>}
              </div>
              <div>
                <Toggle label="Auto-lock payroll after day of month" checked={settings.autoLockEnabled} onChange={(checked) => patch({ autoLockEnabled: checked })} />
                <p className="mt-1 text-xs text-gray-500">Prevents new payroll entries after this day. HR Managers can override with a reason.</p>
                {settings.autoLockEnabled && (
                  <div className="mt-3 space-y-3">
                    <Input label="Lock after day" type="number" value={String(settings.autoLockDay)} onChange={(e) => patch({ autoLockDay: Math.min(31, Math.max(1, Number(e.target.value) || 1)) })} />
                    <p className="text-xs font-medium text-gray-600">Override permission</p>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.overrideHr} onChange={(e) => patch({ overrideHr: e.target.checked })} /> HR Manager</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.overridePayroll} onChange={(e) => patch({ overridePayroll: e.target.checked })} /> Payroll Manager</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.overrideSystem} onChange={(e) => patch({ overrideSystem: e.target.checked })} /> System Manager</label>
                    <Toggle label="Override reason required" checked={settings.overrideReasonRequired} onChange={(checked) => patch({ overrideReasonRequired: checked })} />
                    {settings.overrideReasonRequired && <p className="text-xs text-gray-500">Override reason will be logged in the Activity Log.</p>}
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm">
                        <button type="button" className="underline" onClick={() => setLockCursor((c) => ({ year: c.month === 0 ? c.year - 1 : c.year, month: c.month === 0 ? 11 : c.month - 1 }))}>Previous</button>
                        <span className="font-medium">{new Date(lockCursor.year, lockCursor.month, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" className="underline" onClick={() => setLockCursor((c) => ({ year: c.month === 11 ? c.year + 1 : c.year, month: c.month === 11 ? 0 : c.month + 1 }))}>Next</button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => <span key={`${d}-${idx}`} className="text-gray-400">{d}</span>)}
                        {Array.from({ length: new Date(lockCursor.year, lockCursor.month, 1).getDay() }).map((_, i) => <span key={`e-${i}`} />)}
                        {Array.from({ length: lockDays }).map((_, i) => {
                          const day = i + 1;
                          const locked = day > settings.autoLockDay;
                          const marker = day === settings.autoLockDay;
                          return <span key={day} className={`rounded px-1 py-1 ${marker ? 'bg-blue-600 text-white' : locked ? 'bg-red-50 text-gray-400' : ''}`}>{day}{locked ? ' 🔒' : ''}</span>;
                        })}
                      </div>
                      <p className="mt-1 text-xs text-gray-400">Days after the lock day are closed for new payroll entries.</p>
                    </div>
                  </div>
                )}
              </div>
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
      <Modal isOpen={Boolean(pendingCompany)} onClose={() => setPendingCompany(null)} title="Change default company" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setPendingCompany(null)}>Cancel</Button><Button onClick={() => { if (pendingCompany) patch({ defaultCompany: pendingCompany }); setPendingCompany(null); }}>Confirm</Button></div>}>
        <p className="text-sm text-amber-900">Changing company will reset all department and branch filters on Payroll Entry.</p>
      </Modal>
      <Modal isOpen={Boolean(pendingFrequency)} onClose={() => setPendingFrequency(null)} title="Payroll frequency change" footer={<div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setPendingFrequency(null)}>Cancel</Button><Button variant="outline" onClick={() => pendingFrequency && applyFrequency(pendingFrequency)}>Proceed anyway</Button><Button onClick={() => { setPendingFrequency(null); navigate('/hr/master/salary-structure-master'); }}>Reassign structures</Button></div>}>
        <p className="text-sm">{SAMPLE_STRUCTURES.filter((item) => item.frequency === 'Monthly').length} existing salary structures use a different frequency. Changing this will not auto-update them.</p>
      </Modal>
      <Modal isOpen={emailPreviewOpen} onClose={() => setEmailPreviewOpen(false)} title="Email preview" size="lg" footer={<Button onClick={() => setEmailPreviewOpen(false)}>Close</Button>}>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">EduManager School — salary slip</p>
          <p>To: employee@school.edu</p>
          <p>Reply-To: {settings.replyToEmail || 'hr@school.edu'}</p>
          <p>Template: {EMAIL_TEMPLATES.find((item) => item.value === settings.emailTemplate)?.label || 'Not selected'}</p>
          <p>Attachment: SalarySlip-EMP001-OCT-2026.pdf {settings.encryptSalarySlips ? '(password-protected, DOB DDMMYYYY)' : ''}</p>
          <p className="text-xs text-gray-500">Placeholder figures only. This preview does not send mail and does not recalculate salary.</p>
        </div>
      </Modal>
      <Modal isOpen={cancelConfirm} onClose={() => setCancelConfirm(false)} title="Discard unsaved settings?" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCancelConfirm(false)}>Keep editing</Button><Button onClick={cancelSettings}>Discard</Button></div>}>
        <p className="text-sm">Unsaved payroll settings for this branch will be restored to the last save.</p>
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
