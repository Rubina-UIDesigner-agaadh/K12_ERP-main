// FILE: AssignPermission.jsx
// PURPOSE: Role-Based Permission Management with Branch-wise Access Control & Temporary Permissions

import React, { useState } from 'react';
import {
  Save, Shield, ChevronRight, ChevronDown, Search, Eye, Plus, Edit,
  Trash2, Check, Upload, Download, Printer, Lock, Unlock, Users,
  Building2, BookOpen, GraduationCap, CreditCard, Wallet, Receipt,
  UserCheck, ClipboardList, BriefcaseBusiness, Calculator, TrendingUp,
  Award, DollarSign, Landmark, Globe, Bus, Library, MessageSquare,
  BarChart3, Database, FileSpreadsheet, Briefcase, Home, Settings, Copy,
  Calendar, Clock, AlertTriangle, X, Timer } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';

const BRANCHES = [
{ id: 'main', name: 'Main Campus', code: 'MC' },
{ id: 'north', name: 'North Branch', code: 'NB' },
{ id: 'south', name: 'South Branch', code: 'SB' },
{ id: 'east', name: 'East Campus', code: 'EC' },
{ id: 'west', name: 'West Campus', code: 'WC' }];


const ROLES = ['Super Admin', 'Branch Admin', 'Principal', 'Vice Principal', 'HOD', 'Teacher', 'Accountant', 'Clerk', 'Librarian', 'HR Manager', 'Receptionist'];

const PERMISSION_ACTIONS = [
{ key: 'view', label: 'View', icon: Eye, color: 'blue' },
{ key: 'create', label: 'Create', icon: Plus, color: 'green' },
{ key: 'update', label: 'Edit', icon: Edit, color: 'amber' },
{ key: 'delete', label: 'Delete', icon: Trash2, color: 'red' },
{ key: 'approve', label: 'Approve', icon: Check, color: 'purple' },
{ key: 'verify', label: 'Verify', icon: Shield, color: 'indigo' },
{ key: 'export', label: 'Export', icon: Download, color: 'teal' },
{ key: 'import', label: 'Import', icon: Upload, color: 'orange' },
{ key: 'print', label: 'Print', icon: Printer, color: 'gray' }];


// Permission structure: { enabled: false, isTemp: false, startDate: '', endDate: '' }
const defaultPermValue = () => ({ enabled: false, isTemp: false, startDate: '', endDate: '' });
const defaultPerm = () => PERMISSION_ACTIONS.reduce((acc, a) => ({ ...acc, [a.key]: defaultPermValue() }), {});

const MODULES = [
{
  id: 'student-management', name: 'Student Management', icon: Users,
  subModules: [
  { id: 'student-list', name: 'Student Directory', pages: [
    { id: 'all-students', name: 'All Students' }, { id: 'student-profile', name: 'Student Profile' },
    { id: 'student-search', name: 'Advanced Search' }, { id: 'student-transfer', name: 'Student Transfer' },
    { id: 'student-promotion', name: 'Promotion/Demotion' }]
  },
  { id: 'student-docs', name: 'Documents', pages: [
    { id: 'id-card', name: 'ID Card Generation' }, { id: 'tc-certificate', name: 'TC / Certificates' },
    { id: 'bonafide', name: 'Bonafide Certificate' }]
  }]

},
{
  id: 'student-settings', name: 'Student Settings', icon: Settings,
  subModules: [
  { id: 'class-config', name: 'Class Configuration', pages: [
    { id: 'class-master', name: 'Class Master' }, { id: 'section-master', name: 'Section Master' },
    { id: 'stream-master', name: 'Stream Master' }, { id: 'subject-master', name: 'Subject Master' }]
  },
  { id: 'category-config', name: 'Category Setup', pages: [
    { id: 'student-category', name: 'Student Category' }, { id: 'caste-master', name: 'Caste Master' },
    { id: 'religion-master', name: 'Religion Master' }, { id: 'nationality', name: 'Nationality Master' }]
  }]

},
{
  id: 'admission', name: 'Admission', icon: GraduationCap,
  subModules: [
  { id: 'admission-process', name: 'Admission Process', pages: [
    { id: 'new-admission', name: 'New Admission' }, { id: 'admission-form', name: 'Admission Form' },
    { id: 'bulk-admission', name: 'Bulk Admission' }, { id: 'admission-inquiry', name: 'Admission Inquiry' }]
  },
  { id: 'admission-settings', name: 'Admission Settings', pages: [
    { id: 'admission-config', name: 'Admission Configuration' }, { id: 'fee-structure-assign', name: 'Fee Structure Assignment' },
    { id: 'document-checklist', name: 'Document Checklist' }]
  }]

},
{
  id: 'attendance', name: 'Attendance', icon: ClipboardList,
  subModules: [
  { id: 'student-attendance', name: 'Student Attendance', pages: [
    { id: 'daily-attendance', name: 'Daily Attendance' }, { id: 'period-attendance', name: 'Period-wise Attendance' },
    { id: 'biometric-attendance', name: 'Biometric Integration' }, { id: 'attendance-report', name: 'Attendance Reports' }]
  },
  { id: 'attendance-settings', name: 'Attendance Settings', pages: [
    { id: 'attendance-rules', name: 'Attendance Rules' }, { id: 'leave-types', name: 'Leave Types Master' },
    { id: 'holiday-calendar', name: 'Holiday Calendar' }]
  }]

},
{
  id: 'fees', name: 'Fees Management', icon: CreditCard,
  subModules: [
  { id: 'fee-collection', name: 'Fee Collection', pages: [
    { id: 'collect-fee', name: 'Collect Fee' }, { id: 'fee-receipt', name: 'Fee Receipt' },
    { id: 'bulk-collection', name: 'Bulk Collection' }, { id: 'online-payment', name: 'Online Payment Entry' }]
  },
  { id: 'fee-management', name: 'Fee Management', pages: [
    { id: 'fee-structure', name: 'Fee Structure' }, { id: 'fee-head', name: 'Fee Head Master' },
    { id: 'fee-concession', name: 'Fee Concession' }, { id: 'fee-refund', name: 'Fee Refund' }]
  },
  { id: 'fee-reports', name: 'Fee Reports', pages: [
    { id: 'collection-report', name: 'Collection Report' }, { id: 'defaulter-list', name: 'Defaulter List' },
    { id: 'fee-statement', name: 'Fee Statement' }]
  }]

},
{
  id: 'charges', name: 'Charges & Fine', icon: Receipt,
  subModules: [
  { id: 'charge-master', name: 'Charge Master', pages: [
    { id: 'charge-types', name: 'Charge Types' }, { id: 'fine-master', name: 'Fine Master' },
    { id: 'late-fee-config', name: 'Late Fee Configuration' }]
  },
  { id: 'charge-apply', name: 'Apply Charges', pages: [
    { id: 'apply-fine', name: 'Apply Fine' }, { id: 'waive-fine', name: 'Waive Fine' },
    { id: 'bulk-charge', name: 'Bulk Charge Apply' }]
  }]

},
{
  id: 'ledger', name: 'Ledger', icon: BookOpen,
  subModules: [
  { id: 'student-ledger', name: 'Student Ledger', pages: [
    { id: 'ledger-view', name: 'View Ledger' }, { id: 'ledger-statement', name: 'Ledger Statement' },
    { id: 'ledger-adjustment', name: 'Ledger Adjustment' }]
  },
  { id: 'account-ledger', name: 'Account Ledger', pages: [
    { id: 'general-ledger', name: 'General Ledger' }, { id: 'sub-ledger', name: 'Sub Ledger' },
    { id: 'trial-balance', name: 'Trial Balance' }]
  }]

},
{
  id: 'scholarship', name: 'Scholarship', icon: Award,
  subModules: [
  { id: 'scholarship-master', name: 'Scholarship Master', pages: [
    { id: 'scholarship-types', name: 'Scholarship Types' }, { id: 'eligibility-rules', name: 'Eligibility Rules' },
    { id: 'scholarship-budget', name: 'Scholarship Budget' }]
  },
  { id: 'scholarship-process', name: 'Scholarship Process', pages: [
    { id: 'apply-scholarship', name: 'Apply Scholarship' }, { id: 'scholarship-approval', name: 'Scholarship Approval' },
    { id: 'scholarship-disbursement', name: 'Disbursement' }]
  }]

},
{
  id: 'accounts', name: 'Accounts', icon: Calculator,
  subModules: [
  { id: 'account-master', name: 'Account Master', pages: [
    { id: 'chart-of-accounts', name: 'Chart of Accounts' }, { id: 'account-groups', name: 'Account Groups' },
    { id: 'bank-accounts', name: 'Bank Accounts' }, { id: 'cash-accounts', name: 'Cash Accounts' }]
  },
  { id: 'vouchers', name: 'Vouchers', pages: [
    { id: 'payment-voucher', name: 'Payment Voucher' }, { id: 'receipt-voucher', name: 'Receipt Voucher' },
    { id: 'journal-voucher', name: 'Journal Voucher' }, { id: 'contra-voucher', name: 'Contra Voucher' }]
  },
  { id: 'reconciliation', name: 'Reconciliation', pages: [
    { id: 'bank-reconciliation', name: 'Bank Reconciliation' }, { id: 'cash-reconciliation', name: 'Cash Reconciliation' }]
  }]

},
{
  id: 'expenses', name: 'Expenses', icon: Wallet,
  subModules: [
  { id: 'expense-entry', name: 'Expense Entry', pages: [
    { id: 'add-expense', name: 'Add Expense' }, { id: 'expense-approval', name: 'Expense Approval' },
    { id: 'recurring-expense', name: 'Recurring Expenses' }]
  },
  { id: 'expense-config', name: 'Expense Configuration', pages: [
    { id: 'expense-category', name: 'Expense Categories' }, { id: 'expense-budget', name: 'Expense Budget' },
    { id: 'vendor-master', name: 'Vendor Master' }]
  },
  { id: 'expense-reports', name: 'Expense Reports', pages: [
    { id: 'expense-summary', name: 'Expense Summary' }, { id: 'category-wise', name: 'Category-wise Report' }]
  }]

},
{
  id: 'online-payment', name: 'Online Payment', icon: Globe,
  subModules: [
  { id: 'payment-gateway', name: 'Payment Gateway', pages: [
    { id: 'gateway-config', name: 'Gateway Configuration' }, { id: 'transaction-log', name: 'Transaction Log' },
    { id: 'payment-reconcile', name: 'Payment Reconciliation' }]
  },
  { id: 'payment-links', name: 'Payment Links', pages: [
    { id: 'generate-link', name: 'Generate Payment Link' }, { id: 'qr-payment', name: 'QR Payment Setup' }]
  }]

},
{
  id: 'employee', name: 'Employee Management', icon: Briefcase,
  subModules: [
  { id: 'employee-directory', name: 'Employee Directory', pages: [
    { id: 'all-employees', name: 'All Employees' }, { id: 'employee-profile', name: 'Employee Profile' },
    { id: 'department-wise', name: 'Department-wise List' }]
  },
  { id: 'employee-docs', name: 'Employee Documents', pages: [
    { id: 'emp-id-card', name: 'Employee ID Card' }, { id: 'emp-certificates', name: 'Experience/Relieving Letter' }]
  }]

},
{
  id: 'employee-attendance', name: 'Employee Attendance', icon: UserCheck,
  subModules: [
  { id: 'emp-attendance', name: 'Attendance Entry', pages: [
    { id: 'daily-emp-attendance', name: 'Daily Attendance' }, { id: 'biometric-emp', name: 'Biometric Attendance' },
    { id: 'manual-entry', name: 'Manual Entry' }]
  },
  { id: 'leave-management', name: 'Leave Management', pages: [
    { id: 'apply-leave', name: 'Apply Leave' }, { id: 'leave-approval', name: 'Leave Approval' },
    { id: 'leave-balance', name: 'Leave Balance' }, { id: 'leave-encashment', name: 'Leave Encashment' }]
  }]

},
{
  id: 'payroll', name: 'Payroll', icon: DollarSign,
  subModules: [
  { id: 'salary-process', name: 'Salary Processing', pages: [
    { id: 'process-salary', name: 'Process Salary' }, { id: 'salary-sheet', name: 'Salary Sheet' },
    { id: 'pay-slip', name: 'Pay Slip Generation' }, { id: 'bank-advice', name: 'Bank Advice' }]
  },
  { id: 'salary-config', name: 'Salary Configuration', pages: [
    { id: 'salary-structure', name: 'Salary Structure' }, { id: 'earning-heads', name: 'Earning Heads' },
    { id: 'deduction-heads', name: 'Deduction Heads' }, { id: 'pf-esi-config', name: 'PF/ESI Configuration' }]
  },
  { id: 'payroll-reports', name: 'Payroll Reports', pages: [
    { id: 'payroll-summary', name: 'Payroll Summary' }, { id: 'pf-report', name: 'PF Report' },
    { id: 'esi-report', name: 'ESI Report' }]
  }]

},
{
  id: 'recruitment', name: 'Recruitment', icon: BriefcaseBusiness,
  subModules: [
  { id: 'job-posting', name: 'Job Posting', pages: [
    { id: 'create-vacancy', name: 'Create Vacancy' }, { id: 'manage-postings', name: 'Manage Postings' }]
  },
  { id: 'applications', name: 'Applications', pages: [
    { id: 'view-applications', name: 'View Applications' }, { id: 'shortlist', name: 'Shortlist Candidates' },
    { id: 'schedule-interview', name: 'Schedule Interview' }]
  },
  { id: 'onboarding', name: 'Onboarding', pages: [
    { id: 'offer-letter', name: 'Offer Letter' }, { id: 'joining-formalities', name: 'Joining Formalities' }]
  }]

},
{
  id: 'income-tax', name: 'Income Tax', icon: Landmark,
  subModules: [
  { id: 'tax-declaration', name: 'Tax Declaration', pages: [
    { id: 'employee-declaration', name: 'Employee Declaration' }, { id: 'verify-declaration', name: 'Verify Declaration' }]
  },
  { id: 'tds', name: 'TDS Management', pages: [
    { id: 'tds-calculation', name: 'TDS Calculation' }, { id: 'form-16', name: 'Form 16 Generation' },
    { id: 'quarterly-returns', name: 'Quarterly Returns' }]
  }]

},
{
  id: 'appraisal', name: 'Appraisal', icon: TrendingUp,
  subModules: [
  { id: 'performance', name: 'Performance Management', pages: [
    { id: 'set-goals', name: 'Set Goals/KRA' }, { id: 'self-assessment', name: 'Self Assessment' },
    { id: 'manager-review', name: 'Manager Review' }]
  },
  { id: 'appraisal-cycle', name: 'Appraisal Cycle', pages: [
    { id: 'cycle-config', name: 'Cycle Configuration' }, { id: 'rating-scale', name: 'Rating Scale Master' },
    { id: 'increment-letter', name: 'Increment Letter' }]
  }]

},
{
  id: 'employee-master', name: 'Employee Master', icon: Database,
  subModules: [
  { id: 'emp-config', name: 'Employee Configuration', pages: [
    { id: 'department-master', name: 'Department Master' }, { id: 'designation-master', name: 'Designation Master' },
    { id: 'grade-master', name: 'Grade Master' }, { id: 'shift-master', name: 'Shift Master' }]
  },
  { id: 'emp-types', name: 'Employee Types', pages: [
    { id: 'emp-category', name: 'Employee Category' }, { id: 'emp-type', name: 'Employment Type' }]
  }]

},
{
  id: 'assessment', name: 'Assessment & Examination', icon: FileSpreadsheet,
  subModules: [
  { id: 'exam-setup', name: 'Exam Setup', pages: [
    { id: 'exam-master', name: 'Exam Master' }, { id: 'exam-schedule', name: 'Exam Schedule' },
    { id: 'seating-plan', name: 'Seating Plan' }]
  },
  { id: 'marks-entry', name: 'Marks Entry', pages: [
    { id: 'enter-marks', name: 'Enter Marks' }, { id: 'verify-marks', name: 'Verify Marks' },
    { id: 'lock-marks', name: 'Lock/Unlock Marks' }]
  },
  { id: 'results', name: 'Results', pages: [
    { id: 'result-processing', name: 'Result Processing' }, { id: 'report-card', name: 'Report Card' },
    { id: 'rank-generation', name: 'Rank Generation' }]
  },
  { id: 'grade-config', name: 'Grade Configuration', pages: [
    { id: 'exam-grade-master', name: 'Grade Master' }, { id: 'grading-scale', name: 'Grading Scale' },
    { id: 'pass-criteria', name: 'Pass/Fail Criteria' }]
  }]

},
{
  id: 'transport', name: 'Transport', icon: Bus,
  subModules: [
  { id: 'transport-master', name: 'Transport Master', pages: [
    { id: 'vehicle-master', name: 'Vehicle Master' }, { id: 'route-master', name: 'Route Master' },
    { id: 'stop-master', name: 'Stop Master' }, { id: 'driver-master', name: 'Driver Master' }]
  },
  { id: 'transport-alloc', name: 'Allocation', pages: [
    { id: 'student-transport', name: 'Student Transport Allocation' }, { id: 'transport-fee', name: 'Transport Fee' }]
  }]

},
{
  id: 'library', name: 'Library', icon: Library,
  subModules: [
  { id: 'library-master', name: 'Library Master', pages: [
    { id: 'book-master', name: 'Book Master' }, { id: 'book-category', name: 'Book Category' },
    { id: 'accession-register', name: 'Accession Register' }]
  },
  { id: 'circulation', name: 'Circulation', pages: [
    { id: 'issue-book', name: 'Issue Book' }, { id: 'return-book', name: 'Return Book' },
    { id: 'library-fine-collection', name: 'Fine Collection' }]
  }]

},
{
  id: 'hostel', name: 'Hostel', icon: Home,
  subModules: [
  { id: 'hostel-master', name: 'Hostel Master', pages: [
    { id: 'hostel-config', name: 'Hostel Configuration' }, { id: 'room-master', name: 'Room Master' },
    { id: 'bed-allocation', name: 'Bed Allocation' }]
  },
  { id: 'hostel-fee', name: 'Hostel Fee', pages: [
    { id: 'hostel-fee-struct', name: 'Hostel Fee Structure' }, { id: 'mess-fee', name: 'Mess Fee' }]
  }]

},
{
  id: 'communication', name: 'Communication', icon: MessageSquare,
  subModules: [
  { id: 'messaging', name: 'Messaging', pages: [
    { id: 'send-sms', name: 'Send SMS' }, { id: 'send-email', name: 'Send Email' },
    { id: 'push-notification', name: 'Push Notification' }, { id: 'whatsapp', name: 'WhatsApp Integration' }]
  },
  { id: 'templates', name: 'Message Templates', pages: [
    { id: 'sms-templates', name: 'SMS Templates' }, { id: 'email-templates', name: 'Email Templates' }]
  }]

},
{
  id: 'reports', name: 'Reports & Analytics', icon: BarChart3,
  subModules: [
  { id: 'academic-reports', name: 'Academic Reports', pages: [
    { id: 'student-report', name: 'Student Reports' }, { id: 'attendance-analytics', name: 'Attendance Analytics' },
    { id: 'exam-analytics', name: 'Exam Analytics' }]
  },
  { id: 'finance-reports', name: 'Finance Reports', pages: [
    { id: 'collection-analytics', name: 'Collection Analytics' }, { id: 'expense-analytics', name: 'Expense Analytics' },
    { id: 'pl-statement', name: 'P&L Statement' }, { id: 'balance-sheet', name: 'Balance Sheet' }]
  },
  { id: 'hr-reports', name: 'HR Reports', pages: [
    { id: 'emp-attendance-report', name: 'Employee Attendance Report' }, { id: 'payroll-report', name: 'Payroll Report' }]
  }]

},
{
  id: 'admin-tools', name: 'Admin Tools', icon: Settings,
  subModules: [
  { id: 'user-management', name: 'User Management', pages: [
    { id: 'users', name: 'User Master' }, { id: 'roles', name: 'Role Master' },
    { id: 'permissions', name: 'Assign Permissions' }]
  },
  { id: 'system-config', name: 'System Configuration', pages: [
    { id: 'general-settings', name: 'General Settings' }, { id: 'academic-year', name: 'Academic Year' },
    { id: 'branch-master', name: 'Branch Master' }]
  },
  { id: 'audit', name: 'Audit & Logs', pages: [
    { id: 'audit-log', name: 'Audit Log' }, { id: 'login-history', name: 'Login History' },
    { id: 'activity-log', name: 'Activity Log' }]
  }]

}];


const getPageIds = () => MODULES.flatMap((m) => m.subModules.flatMap((sm) => sm.pages.map((p) => p.id)));
const getPageName = (pageId) => {
  for (const m of MODULES) {
    for (const sm of m.subModules) {
      const page = sm.pages.find((p) => p.id === pageId);
      if (page) return { module: m.name, subModule: sm.name, page: page.name };
    }
  }
  return null;
};

const initPermissions = () => {
  const perms = {};
  ROLES.forEach((role) => {
    perms[role] = {};
    BRANCHES.forEach((branch) => {
      perms[role][branch.id] = {};
      getPageIds().forEach((pid) => {perms[role][branch.id][pid] = defaultPerm();});
    });
  });
  return perms;
};

const isExpired = (endDate) => endDate && new Date(endDate) < new Date();
const isActive = (startDate, endDate) => {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  return (!start || now >= start) && (!end || now <= end);
};
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '';

export function AssignPermission() {
  const [role, setRole] = useState('Teacher');
  const [branch, setBranch] = useState('main');
  const [permissions, setPermissions] = useState(initPermissions);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [tempModal, setTempModal] = useState({ open: false, pageId: null, permKey: null });
  const [tempDates, setTempDates] = useState({ startDate: '', endDate: '' });
  const [showTempList, setShowTempList] = useState(false);

  const currentPerms = permissions[role]?.[branch] || {};

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
    setExpanded(MODULES.reduce((a, m) => ({ ...a, [m.id]: !expandAll }), {}));
  };

  const togglePerm = (pageId, key, makeTemp = false) => {
    const current = currentPerms[pageId]?.[key] || defaultPermValue();
    if (!current.enabled && makeTemp) {
      setTempModal({ open: true, pageId, permKey: key });
      setTempDates({ startDate: new Date().toISOString().split('T')[0], endDate: '' });
      return;
    }
    setPermissions((p) => ({
      ...p, [role]: { ...p[role], [branch]: {
          ...p[role][branch], [pageId]: {
            ...p[role][branch][pageId],
            [key]: { ...current, enabled: !current.enabled, isTemp: false, startDate: '', endDate: '' }
          }
        } }
    }));
  };

  const saveTempPermission = () => {
    const { pageId, permKey } = tempModal;
    setPermissions((p) => ({
      ...p, [role]: { ...p[role], [branch]: {
          ...p[role][branch], [pageId]: {
            ...p[role][branch][pageId],
            [permKey]: { enabled: true, isTemp: true, ...tempDates }
          }
        } }
    }));
    setTempModal({ open: false, pageId: null, permKey: null });
  };

  const removeTempPermission = (pageId, permKey) => {
    setPermissions((p) => ({
      ...p, [role]: { ...p[role], [branch]: {
          ...p[role][branch], [pageId]: {
            ...p[role][branch][pageId],
            [permKey]: defaultPermValue()
          }
        } }
    }));
  };

  const makePermanent = (pageId, permKey) => {
    setPermissions((p) => ({
      ...p, [role]: { ...p[role], [branch]: {
          ...p[role][branch], [pageId]: {
            ...p[role][branch][pageId],
            [permKey]: { enabled: true, isTemp: false, startDate: '', endDate: '' }
          }
        } }
    }));
  };

  const setAllPerms = (value, moduleId, subModuleId, isTemp = false, dates = {}) => {
    const updates = {};
    MODULES.forEach((m) => {
      if (moduleId && m.id !== moduleId) return;
      m.subModules.forEach((sm) => {
        if (subModuleId && sm.id !== subModuleId) return;
        sm.pages.forEach((p) => {
          updates[p.id] = PERMISSION_ACTIONS.reduce((a, x) => ({
            ...a, [x.key]: value ? { enabled: true, isTemp, ...dates } : defaultPermValue()
          }), {});
        });
      });
    });
    setPermissions((p) => ({ ...p, [role]: { ...p[role], [branch]: { ...p[role][branch], ...updates } } }));
  };

  const copyToAllBranches = () => {
    setPermissions((p) => {
      const updated = { ...p, [role]: { ...p[role] } };
      BRANCHES.forEach((b) => {if (b.id !== branch) updated[role][b.id] = JSON.parse(JSON.stringify(p[role][branch]));});
      return updated;
    });
  };

  const copyFromBranch = (fromBranch) => {
    setPermissions((p) => ({ ...p, [role]: { ...p[role], [branch]: JSON.parse(JSON.stringify(p[role][fromBranch])) } }));
  };

  const filtered = MODULES.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
  m.subModules.some((sm) => sm.name.toLowerCase().includes(search.toLowerCase()) ||
  sm.pages.some((p) => p.name.toLowerCase().includes(search.toLowerCase()))));

  const getStats = (module) => {
    let granted = 0,temp = 0,total = 0;
    module.subModules.forEach((sm) => sm.pages.forEach((p) => {
      const perms = currentPerms[p.id] || defaultPerm();
      Object.values(perms).forEach((v) => {total++;if (v.enabled) {granted++;if (v.isTemp) temp++;}});
    }));
    return { granted, temp, total, pct: total ? Math.round(granted / total * 100) : 0 };
  };

  const totalStats = MODULES.reduce((a, m) => {
    const s = getStats(m);
    return { granted: a.granted + s.granted, temp: a.temp + s.temp, total: a.total + s.total };
  }, { granted: 0, temp: 0, total: 0 });
  totalStats.pct = totalStats.total ? Math.round(totalStats.granted / totalStats.total * 100) : 0;

  const getBranchStats = (branchId) => {
    let granted = 0,temp = 0,total = 0;
    getPageIds().forEach((pid) => {
      const perms = permissions[role]?.[branchId]?.[pid] || defaultPerm();
      Object.values(perms).forEach((v) => {total++;if (v.enabled) {granted++;if (v.isTemp) temp++;}});
    });
    return { granted, temp, total, pct: total ? Math.round(granted / total * 100) : 0 };
  };

  const getAllTempPermissions = () => {
    const temps = [];
    getPageIds().forEach((pid) => {
      const perms = currentPerms[pid] || defaultPerm();
      PERMISSION_ACTIONS.forEach((a) => {
        if (perms[a.key]?.isTemp) {
          const info = getPageName(pid);
          temps.push({ pageId: pid, permKey: a.key, action: a, ...perms[a.key], ...info });
        }
      });
    });
    return temps;
  };

  const tempPermissions = getAllTempPermissions();

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" /> Assign Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configure role-based permissions with temporary access support</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTempList(true)}>
            <Timer className="w-4 h-4 mr-1" />Temporary ({tempPermissions.length})
          </Button>
          <Button variant="primary" size="sm"><Save className="w-4 h-4 mr-1" />Save</Button>
        </div>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select label="Select Role" options={ROLES.map((r) => ({ value: r, label: r }))} value={role} onChange={setRole} />
          <Select label="Select Branch" options={BRANCHES.map((b) => ({ value: b.id, label: b.name }))} value={branch} onChange={setBranch} />
          <Input label="Search" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          <div className="flex flex-col justify-end gap-1">
            <label className="text-sm font-medium text-gray-700">Quick Actions</label>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setAllPerms(true)}><Unlock className="w-3 h-3 mr-1" />All</Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setAllPerms(false)}><Lock className="w-3 h-3 mr-1" />None</Button>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <label className="text-sm font-medium text-gray-700 mb-1">Expand</label>
            <Button variant="outline" size="sm" onClick={toggleExpandAll}>{expandAll ? 'Collapse All' : 'Expand All'}</Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Editing:</span>
            <Badge variant="info" className="px-3 py-1">{role} @ {BRANCHES.find((b) => b.id === branch)?.name}</Badge>
            {tempPermissions.length > 0 &&
            <Badge variant="warning" className="px-2 py-1">
                <Timer className="w-3 h-3 mr-1" />{tempPermissions.length} Temporary
              </Badge>
            }
          </div>
          <div className="flex gap-2">
            <Select
              options={[{ value: '', label: 'Copy from branch...' }, ...BRANCHES.filter((b) => b.id !== branch).map((b) => ({ value: b.id, label: b.name }))]}
              value="" onChange={(v) => v && copyFromBranch(v)} className="w-48" />
            
            <Button variant="outline" size="sm" onClick={copyToAllBranches}><Copy className="w-4 h-4 mr-1" />Copy to All</Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Branch Permission Summary for {role}:</p>
          <div className="flex flex-wrap gap-2">
            {BRANCHES.map((b) => {
              const s = getBranchStats(b.id);
              return (
                <button key={b.id} onClick={() => setBranch(b.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${b.id === branch ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <Building2 className={`w-4 h-4 ${b.id === branch ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{b.code}</span>
                  <Badge variant={s.pct === 100 ? 'success' : s.pct > 0 ? 'warning' : 'secondary'} className="text-xs">{s.pct}%</Badge>
                  {s.temp > 0 && <Badge variant="warning" className="text-xs"><Timer className="w-3 h-3" /></Badge>}
                </button>);

            })}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <span className="text-sm text-gray-600">Permissions:</span>
          <Badge variant={totalStats.pct === 100 ? 'success' : totalStats.pct > 0 ? 'warning' : 'secondary'}>
            {totalStats.granted}/{totalStats.total} ({totalStats.pct}%)
          </Badge>
          {totalStats.temp > 0 && <Badge variant="warning"><Timer className="w-3 h-3 mr-1" />{totalStats.temp} Temp</Badge>}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${totalStats.pct === 100 ? 'bg-green-500' : totalStats.pct > 50 ? 'bg-blue-500' : totalStats.pct > 0 ? 'bg-amber-500' : 'bg-gray-300'}`} style={{ width: `${totalStats.pct}%` }} />
          </div>
        </div>
      </Card>

      <div className="bg-white border rounded-lg p-3 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold text-gray-700">Legend:</span>
        {PERMISSION_ACTIONS.map((a) => <div key={a.key} className="flex items-center gap-1"><a.icon className={`w-3 h-3 text-${a.color}-600`} /><span className="text-gray-600">{a.label}</span></div>)}
        <div className="flex items-center gap-1 ml-4 pl-4 border-l">
          <Timer className="w-3 h-3 text-amber-600" />
          <span className="text-amber-700 font-medium">= Temporary Permission</span>
        </div>
        <div className="text-gray-500">Right-click for temporary permission</div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.map((module) => {
            const stats = getStats(module);
            return (
              <div key={module.id} className="border-b last:border-b-0">
                <div className="sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition" onClick={() => toggleExpand(module.id)}>
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      {expanded[module.id] ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                      <module.icon className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{module.name}</span>
                      <Badge variant="outline" className="text-xs">{module.subModules.length} sub</Badge>
                      <Badge variant={stats.pct === 100 ? 'success' : stats.pct > 0 ? 'warning' : 'secondary'} className="text-xs">{stats.pct}%</Badge>
                      {stats.temp > 0 && <Badge variant="warning" className="text-xs"><Timer className="w-3 h-3 mr-1" />{stats.temp}</Badge>}
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="xs" onClick={() => setAllPerms(true, module.id)}>Grant</Button>
                      <Button variant="ghost" size="xs" onClick={() => setAllPerms(false, module.id)}>Revoke</Button>
                    </div>
                  </div>
                </div>

                {expanded[module.id] && module.subModules.map((sub) =>
                <div key={sub.id} className="border-l-4 border-blue-200 ml-4">
                    <div className="bg-blue-50/70 px-4 py-2 flex items-center justify-between border-b">
                      <span className="font-medium text-gray-800 text-sm">{sub.name}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="xs" onClick={() => setAllPerms(true, module.id, sub.id)}>Grant</Button>
                        <Button variant="ghost" size="xs" onClick={() => setAllPerms(false, module.id, sub.id)}>Revoke</Button>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {sub.pages.map((page) => {
                      const perms = currentPerms[page.id] || defaultPerm();
                      return (
                        <div key={page.id} className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between gap-4">
                            <span className="text-sm text-gray-700 min-w-[200px]">{page.name}</span>
                            <div className="flex flex-wrap gap-1">
                              {PERMISSION_ACTIONS.map((a) => {
                              const perm = perms[a.key] || defaultPermValue();
                              const expired = perm.isTemp && isExpired(perm.endDate);
                              const active = perm.enabled && (!perm.isTemp || isActive(perm.startDate, perm.endDate));
                              return (
                                <div key={a.key} className="relative group">
                                    <button
                                    onClick={() => togglePerm(page.id, a.key)}
                                    onContextMenu={(e) => {e.preventDefault();togglePerm(page.id, a.key, true);}}
                                    className={`flex items-center gap-1 px-2 py-1 rounded transition text-xs border
                                        ${active ? `bg-${a.color}-100 text-${a.color}-700 border-${a.color}-300` :
                                    expired ? 'bg-red-50 text-red-400 border-red-200 line-through' :
                                    'bg-gray-100 text-gray-400 border-transparent hover:bg-gray-200'}`}>
                                    
                                      {perm.isTemp && <Timer className="w-3 h-3" />}
                                      <a.icon className="w-3 h-3" />
                                      <span className="hidden sm:inline">{a.label}</span>
                                    </button>
                                    {perm.isTemp && perm.enabled &&
                                  <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-20">
                                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                          {formatDate(perm.startDate)} - {formatDate(perm.endDate) || 'No end'}
                                          {expired && <span className="text-red-400 ml-1">(Expired)</span>}
                                        </div>
                                      </div>
                                  }
                                  </div>);

                            })}
                            </div>
                          </div>);

                    })}
                    </div>
                  </div>
                )}
              </div>);

          })}
        </div>
      </Card>

      {/* Temporary Permission Modal */}
      {tempModal.open &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setTempModal({ open: false, pageId: null, permKey: null })} />
          <div className="relative bg-white rounded-xl shadow-xl w-[450px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Timer className="w-5 h-5 text-amber-600" /> Set Temporary Permission
              </h2>
              <button onClick={() => setTempModal({ open: false, pageId: null, permKey: null })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Permission:</strong> {PERMISSION_ACTIONS.find((a) => a.key === tempModal.permKey)?.label}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Page: {getPageName(tempModal.pageId)?.page}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <Input type="date" value={tempDates.startDate} onChange={(e) => setTempDates((p) => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <Input type="date" value={tempDates.endDate} onChange={(e) => setTempDates((p) => ({ ...p, endDate: e.target.value }))} min={tempDates.startDate} />
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  This permission will automatically expire after the end date. The user will lose access to this feature once expired.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setTempModal({ open: false, pageId: null, permKey: null })}>Cancel</Button>
              <Button variant="primary" onClick={saveTempPermission} disabled={!tempDates.startDate || !tempDates.endDate}>
                <Timer className="w-4 h-4 mr-1" /> Set Temporary
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Temporary Permissions List Modal */}
      {showTempList &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowTempList(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[700px] max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Timer className="w-5 h-5 text-amber-600" /> Temporary Permissions
                <Badge variant="warning">{tempPermissions.length}</Badge>
              </h2>
              <button onClick={() => setShowTempList(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {tempPermissions.length === 0 ?
            <div className="text-center py-8 text-gray-500">
                  <Timer className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No temporary permissions set for {role} @ {BRANCHES.find((b) => b.id === branch)?.name}</p>
                </div> :

            <div className="space-y-3">
                  {tempPermissions.map((t, i) => {
                const expired = isExpired(t.endDate);
                const active = isActive(t.startDate, t.endDate);
                return (
                  <div key={i} className={`p-4 rounded-lg border ${expired ? 'bg-red-50 border-red-200' : active ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <t.action.icon className={`w-4 h-4 text-${t.action.color}-600`} />
                              <span className="font-medium text-gray-900">{t.action.label}</span>
                              {expired && <Badge variant="danger" className="text-xs">Expired</Badge>}
                              {!expired && active && <Badge variant="success" className="text-xs">Active</Badge>}
                              {!expired && !active && <Badge variant="warning" className="text-xs">Scheduled</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{t.module} → {t.subModule} → {t.page}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(t.startDate)} - {formatDate(t.endDate)}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="xs" onClick={() => makePermanent(t.pageId, t.permKey)} title="Make Permanent">
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="xs" onClick={() => removeTempPermission(t.pageId, t.permKey)} title="Remove">
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>);

              })}
                </div>
            }
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between">
              <div className="text-sm text-gray-600">
                <span className="text-green-600 font-medium">{tempPermissions.filter((t) => isActive(t.startDate, t.endDate)).length} Active</span>
                <span className="mx-2">•</span>
                <span className="text-red-600 font-medium">{tempPermissions.filter((t) => isExpired(t.endDate)).length} Expired</span>
              </div>
              <Button variant="outline" onClick={() => setShowTempList(false)}>Close</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default AssignPermission;