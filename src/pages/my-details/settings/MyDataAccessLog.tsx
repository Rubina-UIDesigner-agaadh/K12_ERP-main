import React, { useState, useEffect, useMemo } from 'react'
import {
  Activity,
  Filter,
  Shield,
  Download,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Clock,
  MapPin,
  Monitor,
  AlertTriangle,
  Lock,
  Database,
  CheckCircle,
  XCircle,
  Settings,
  History,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Wifi,
  Globe,
  Tag,
  ShieldAlert,
  Building2,
  Banknote,
  GraduationCap,
} from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccessLog {
  id: string
  timestamp: string
  date: string
  time: string
  actor: string
  actorRole: string
  actorDept: string
  actorId: string
  action:
    | 'view'
    | 'create'
    | 'update'
    | 'delete'
    | 'download'
    | 'export'
    | 'login'
    | 'logout'
    | 'process'
    | 'share'
    | 'print'
  dataArea: string
  dataCategory: string
  dataGroup: string
  module: string
  recordId: string
  recordName: string
  recordType: 'Student' | 'Employee' | 'Parent' | 'Report' | 'Batch' | 'System'
  details: string
  ipAddress: string
  device: string
  browser: string
  location: string
  duration: string
  resultStatus: 'success' | 'failed' | 'denied' | 'partial'
  changesMade: { field: string; oldValue: string; newValue: string }[]
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  dataClassification: string
  compliancePolicy: string
  consentRequired: boolean
  retentionDays: number
  sessionId: string
  apiEndpoint: string
  purpose: string
  schoolBranch: string
  relatedLogs?: string[]
}

interface PrivacySettings {
  logRetentionDays: number
  emailNotifications: boolean
  alertOnSensitiveAccess: boolean
  alertOnAdminAccess: boolean
  alertOnExternalAccess: boolean
  allowDataExport: boolean
  requireApprovalForExport: boolean
}

type QuickFilter = 'all' | 'sensitive' | 'denied' | 'downloads' | 'exports' | 'changes'
type DatePreset = 'today' | 'yesterday' | '7days' | '30days' | '90days' | 'custom'

// ─── Constants ────────────────────────────────────────────────────────────────

const dataAreaGroups = [
  {
    group: 'Student Data',
    icon: GraduationCap,
    items: [
      { value: 'profile', label: 'Personal Profile' },
      { value: 'academic', label: 'Academic Records' },
      { value: 'attendance', label: 'Attendance' },
      { value: 'performance', label: 'Performance' },
      { value: 'documents', label: 'Documents' },
    ],
  },
  {
    group: 'Financial',
    icon: Banknote,
    items: [
      { value: 'fees', label: 'Fee Records' },
      { value: 'finance', label: 'Financial Data' },
      { value: 'payroll', label: 'Payroll' },
    ],
  },
  {
    group: 'Operations',
    icon: Building2,
    items: [
      { value: 'transport', label: 'Transport' },
      { value: 'library', label: 'Library' },
      { value: 'hostel', label: 'Hostel' },
    ],
  },
  {
    group: 'Sensitive',
    icon: ShieldAlert,
    items: [
      { value: 'medical', label: 'Medical Records' },
      { value: 'personal', label: 'Personal Information' },
    ],
  },
]

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'view', label: 'View' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'download', label: 'Download' },
  { value: 'export', label: 'Export' },
  { value: 'print', label: 'Print' },
  { value: 'share', label: 'Share' },
  { value: 'process', label: 'Process' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'denied', label: 'Denied' },
  { value: 'partial', label: 'Partial' },
]

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'employee', label: 'Employee' },
  { value: 'admin', label: 'Admin' },
  { value: 'system', label: 'System / Automated' },
  { value: 'hr', label: 'HR Department' },
  { value: 'finance', label: 'Finance Department' },
  { value: 'academic', label: 'Academic Staff' },
  { value: 'external', label: 'External User' },
  { value: 'medical', label: 'Health Department' },
  { value: 'it', label: 'IT Department' },
  { value: 'principal', label: 'Principal / HOD' },
  { value: 'parent', label: 'Parent' },
]

const branchOptions = [
  { value: 'all', label: 'All Branches' },
  { value: 'main', label: 'Main Campus' },
  { value: 'north', label: 'North Branch' },
  { value: 'south', label: 'South Branch' },
  { value: 'east', label: 'East Branch' },
  { value: 'west', label: 'West Branch' },
]

const recordTypeOptions = [
  { value: 'all', label: 'All Record Types' },
  { value: 'Student', label: 'Student' },
  { value: 'Employee', label: 'Employee' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Report', label: 'Report' },
  { value: 'Batch', label: 'Batch' },
  { value: 'System', label: 'System' },
]

// ─── Mock Data (30 rich, realistic records) ───────────────────────────────────

const today = new Date()
const d = (daysAgo: number, h: number, m: number) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() - daysAgo)
  dt.setHours(h, m, 0, 0)
  const date = dt.toISOString().split('T')[0]
  const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
  return { timestamp: dt.toISOString(), date, time }
}

const initialLogs: AccessLog[] = [
  {
    id: 'LOG-001',
    ...d(0, 14, 30),
    actor: 'Rajesh Kumar',
    actorRole: 'Employee',
    actorDept: 'Teaching — Mathematics',
    actorId: 'EMP-0042',
    action: 'download',
    dataArea: 'Payslip',
    dataCategory: 'payroll',
    dataGroup: 'Financial',
    module: 'Payroll',
    recordId: 'PAY-2024-10',
    recordName: 'Rajesh Kumar',
    recordType: 'Employee',
    details: 'Downloaded October 2024 payslip PDF from the employee self-service portal',
    ipAddress: '192.168.1.100',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '5 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'HR Data Access Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-12345',
    apiEndpoint: '/api/payroll/download',
    purpose: 'Employee requested a copy of October 2024 payslip for personal financial records.',
    schoolBranch: 'main',
    relatedLogs: ['LOG-002', 'LOG-006'],
  },
  {
    id: 'LOG-002',
    ...d(1, 10, 15),
    actor: 'Meena Desai',
    actorRole: 'HR Manager',
    actorDept: 'Human Resources',
    actorId: 'HR-001',
    action: 'update',
    dataArea: 'Employee Profile',
    dataCategory: 'profile',
    dataGroup: 'Student Data',
    module: 'Employee Management',
    recordId: 'EMP-0042',
    recordName: 'Rajesh Kumar',
    recordType: 'Employee',
    details: 'Updated home address and pincode for Rajesh Kumar as per employee-submitted change request',
    ipAddress: '192.168.1.150',
    device: 'Desktop',
    browser: 'Firefox 119',
    location: 'Mumbai, India',
    duration: '2 min 10 sec',
    resultStatus: 'success',
    changesMade: [
      { field: 'Address Line 1', oldValue: '12, Old Colony, Dadar', newValue: '45, Sector 15, Kharghar' },
      { field: 'Address Line 2', oldValue: 'Dadar West, Mumbai', newValue: 'Kharghar, Navi Mumbai' },
      { field: 'Pincode', oldValue: '400028', newValue: '410210' },
      { field: 'City', oldValue: 'Mumbai', newValue: 'Navi Mumbai' },
    ],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Employee Data Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-12346',
    apiEndpoint: '/api/employee/update',
    purpose: 'Address update requested by employee via HR helpdesk ticket #HD-2024-887.',
    schoolBranch: 'main',
    relatedLogs: ['LOG-001'],
  },
  {
    id: 'LOG-003',
    ...d(2, 9, 0),
    actor: 'System Process',
    actorRole: 'Automated System',
    actorDept: 'IT Infrastructure',
    actorId: 'SYS-CRON-01',
    action: 'process',
    dataArea: 'Attendance',
    dataCategory: 'attendance',
    dataGroup: 'Student Data',
    module: 'Attendance System',
    recordId: 'ATT-2024-NOV',
    recordName: 'All Students — Nov 2024',
    recordType: 'Batch',
    details: 'Automated monthly attendance aggregation and report generation for November 2024 — 1,240 records processed',
    ipAddress: '127.0.0.1',
    device: 'Server',
    browser: 'System Process',
    location: 'Internal Server',
    duration: '1 min 45 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'System Operations Policy',
    consentRequired: false,
    retentionDays: 60,
    sessionId: 'SYS-CRON-AUTO-003',
    apiEndpoint: '/api/attendance/monthly-calculate',
    purpose: 'Scheduled automated monthly attendance processing — runs at 09:00 on the 8th of every month.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-004',
    ...d(3, 16, 45),
    actor: 'Rajesh Kumar',
    actorRole: 'Employee',
    actorDept: 'Teaching — Mathematics',
    actorId: 'EMP-0042',
    action: 'view',
    dataArea: 'Academic Records',
    dataCategory: 'academic',
    dataGroup: 'Student Data',
    module: 'Student Portal',
    recordId: 'GRADE-2024-GR5-MATH-OCT',
    recordName: 'Aarav Patel',
    recordType: 'Student',
    details: 'Viewed Grade 5 Mathematics — October unit test results, question-wise breakdown, and class percentile',
    ipAddress: '192.168.1.100',
    device: 'Mobile',
    browser: 'Safari 17',
    location: 'Mumbai, India',
    duration: '3 min 12 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Academic Data Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-12347',
    apiEndpoint: '/api/academics/results/view',
    purpose: 'Teacher reviewed exam results in preparation for the parent-teacher meeting scheduled on Nov 8.',
    schoolBranch: 'north',
    relatedLogs: ['LOG-019'],
  },
  {
    id: 'LOG-005',
    ...d(4, 11, 30),
    actor: 'Priya Shah',
    actorRole: 'Finance Officer',
    actorDept: 'Finance Department',
    actorId: 'FIN-003',
    action: 'export',
    dataArea: 'Fee Records',
    dataCategory: 'fees',
    dataGroup: 'Financial',
    module: 'Fee Management',
    recordId: 'FEE-2024-Q3-EXPORT',
    recordName: 'Q3 2024 Fee Collection Summary',
    recordType: 'Report',
    details: 'Exported complete Q3 2024 fee payment records as Excel workbook (xlsx) for statutory audit — 842 records',
    ipAddress: '192.168.1.175',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '4 min 22 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Financial Audit Policy',
    consentRequired: false,
    retentionDays: 180,
    sessionId: 'SES-12348',
    apiEndpoint: '/api/fees/export/q3',
    purpose: 'Quarterly financial audit export required by statutory auditor M/s Kapoor & Co. Approved by CFO on 05-Nov.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-006',
    ...d(5, 14, 0),
    actor: 'Rajesh Kumar',
    actorRole: 'Employee',
    actorDept: 'Teaching',
    actorId: 'EMP-0042',
    action: 'update',
    dataArea: 'Employee Profile',
    dataCategory: 'profile',
    dataGroup: 'Student Data',
    module: 'Employee Self Service',
    recordId: 'EMP-0042',
    recordName: 'Rajesh Kumar',
    recordType: 'Employee',
    details: 'Updated emergency contact phone number via Employee Self Service — SIM change notification',
    ipAddress: '192.168.1.100',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '55 sec',
    resultStatus: 'success',
    changesMade: [
      { field: 'Emergency Contact Name', oldValue: 'Sunita Kumar', newValue: 'Sunita Kumar' },
      { field: 'Emergency Contact Number', oldValue: '+91 9876543210', newValue: '+91 9876543211' },
      { field: 'Relationship', oldValue: 'Spouse', newValue: 'Spouse' },
    ],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Employee Self-Service Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-12349',
    apiEndpoint: '/api/profile/emergency-contact/update',
    purpose: 'Employee self-updated emergency contact number after getting a new SIM card.',
    schoolBranch: 'main',
    relatedLogs: ['LOG-001'],
  },
  {
    id: 'LOG-007',
    ...d(6, 9, 30),
    actor: 'Dr. Suresh Nair',
    actorRole: 'School Medical Officer',
    actorDept: 'Health Department',
    actorId: 'MED-002',
    action: 'view',
    dataArea: 'Medical Records',
    dataCategory: 'medical',
    dataGroup: 'Sensitive',
    module: 'Health Management System',
    recordId: 'MED-STU-20189',
    recordName: 'Priya Sharma',
    recordType: 'Student',
    details: 'Accessed complete medical history including vaccination schedule, allergy list, and past illnesses for annual checkup',
    ipAddress: '192.168.1.160',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '8 min 30 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'restricted',
    dataClassification: 'Restricted — Medical',
    compliancePolicy: 'Medical Privacy Policy',
    consentRequired: true,
    retentionDays: 365,
    sessionId: 'SES-12350',
    apiEndpoint: '/api/health/student/records/view',
    purpose: 'Annual mandatory health checkup. Parent consent form #MED-CONSENT-2024-089 on file. Reviewed by authorized medical officer.',
    schoolBranch: 'north',
    relatedLogs: ['LOG-013'],
  },
  {
    id: 'LOG-008',
    ...d(7, 17, 0),
    actor: 'Vikram Mehta',
    actorRole: 'External Auditor',
    actorDept: 'External — M/s Mehta & Associates',
    actorId: 'EXT-AUD-2024-001',
    action: 'view',
    dataArea: 'Payroll Data',
    dataCategory: 'payroll',
    dataGroup: 'Financial',
    module: 'Payroll Management',
    recordId: 'PAY-2024-ANNUAL-AUDIT',
    recordName: 'Annual Payroll 2024',
    recordType: 'Report',
    details: 'Accessed annual payroll summary including CTC breakdowns, PF, TDS and net disbursement figures for all staff',
    ipAddress: '103.45.78.90',
    device: 'Laptop',
    browser: 'Edge 119',
    location: 'Pune, Maharashtra',
    duration: '47 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'restricted',
    dataClassification: 'Restricted — Financial',
    compliancePolicy: 'External Audit Policy — NDA Required',
    consentRequired: true,
    retentionDays: 365,
    sessionId: 'SES-EXT-12351',
    apiEndpoint: '/api/payroll/audit/annual',
    purpose: 'Annual statutory payroll audit. NDA signed on 28-Oct-2024. Access approved by MD. Ref: AUDIT-2024-007.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-009',
    ...d(8, 10, 0),
    actor: 'Rajesh Kumar',
    actorRole: 'Employee',
    actorDept: 'Teaching',
    actorId: 'EMP-0042',
    action: 'print',
    dataArea: 'Documents',
    dataCategory: 'documents',
    dataGroup: 'Student Data',
    module: 'Document Management',
    recordId: 'DOC-EXP-CERT-EMP-0042',
    recordName: 'Rajesh Kumar',
    recordType: 'Employee',
    details: 'Printed experience certificate — 7 years continuous service letter issued and counter-signed by HR',
    ipAddress: '192.168.1.100',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '28 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Document Management Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-12352',
    apiEndpoint: '/api/documents/certificate/print',
    purpose: 'Employee printed experience certificate for bank home loan application submission.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-010',
    ...d(9, 8, 45),
    actor: 'Anita Krishnamurthy',
    actorRole: 'System Administrator',
    actorDept: 'Administration',
    actorId: 'ADMIN-001',
    action: 'export',
    dataArea: 'Performance Records',
    dataCategory: 'performance',
    dataGroup: 'Student Data',
    module: 'Performance Management',
    recordId: 'PERF-2024-H1-EXPORT',
    recordName: 'H1 2024 Performance Summary',
    recordType: 'Report',
    details: 'Exported H1 2024 teacher performance appraisal data as PDF — 68 staff records included',
    ipAddress: '192.168.1.200',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '5 min 10 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Performance Appraisal Policy',
    consentRequired: false,
    retentionDays: 180,
    sessionId: 'SES-12353',
    apiEndpoint: '/api/performance/appraisal/export',
    purpose: 'H1 performance export prepared for October board meeting. Pre-approved by Principal Neha Kulkarni.',
    schoolBranch: 'main',
    relatedLogs: ['LOG-004'],
  },
  {
    id: 'LOG-011',
    ...d(10, 15, 20),
    actor: 'Unknown User',
    actorRole: 'Unknown',
    actorDept: 'Unknown',
    actorId: 'UNKNOWN',
    action: 'view',
    dataArea: 'Employee Profile',
    dataCategory: 'profile',
    dataGroup: 'Student Data',
    module: 'Employee Management',
    recordId: 'EMP-0042',
    recordName: 'Rajesh Kumar',
    recordType: 'Employee',
    details: 'Unauthorized profile access attempt — request blocked by WAF before any data was served to client',
    ipAddress: '45.67.89.123',
    device: 'Unknown',
    browser: 'Unknown / Automated Bot',
    location: 'Unresolved IP — Possible VPN / Proxy',
    duration: '0 sec',
    resultStatus: 'denied',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Security & Access Control Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SES-BLOCKED-9921',
    apiEndpoint: '/api/employee/profile/view',
    purpose: 'Unauthorized unauthenticated access attempt. Automatically blocked by security system. IT security team notified via alert.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-012',
    ...d(11, 12, 0),
    actor: 'Karan Joshi',
    actorRole: 'IT Support Engineer',
    actorDept: 'IT Department',
    actorId: 'IT-005',
    action: 'view',
    dataArea: 'Login History',
    dataCategory: 'personal',
    dataGroup: 'Sensitive',
    module: 'Security & Audit Logs',
    recordId: 'SECLOG-EMP-0042-OCT',
    recordName: 'Rajesh Kumar',
    recordType: 'Employee',
    details: 'Reviewed October login history and session activity logs — checked for unusual access patterns',
    ipAddress: '192.168.1.210',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '12 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'IT Security Audit Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-IT-12354',
    apiEndpoint: '/api/security/login-history/view',
    purpose: 'Routine monthly security audit of login patterns as per ISO 27001 compliance schedule. No anomalies found.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-013',
    ...d(12, 11, 0),
    actor: 'Dr. Suresh Nair',
    actorRole: 'School Medical Officer',
    actorDept: 'Health Department',
    actorId: 'MED-002',
    action: 'create',
    dataArea: 'Medical Records',
    dataCategory: 'medical',
    dataGroup: 'Sensitive',
    module: 'Health Management System',
    recordId: 'MED-STU-20189-CHECKUP-2024',
    recordName: 'Priya Sharma',
    recordType: 'Student',
    details: 'Created new annual health checkup record — BMI 18.4, vision 6/6 both eyes, dental grade A, all vaccinations current',
    ipAddress: '192.168.1.160',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '15 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'restricted',
    dataClassification: 'Restricted — Medical',
    compliancePolicy: 'Medical Privacy Policy',
    consentRequired: true,
    retentionDays: 365,
    sessionId: 'SES-MED-12355',
    apiEndpoint: '/api/health/student/checkup/create',
    purpose: 'Annual health checkup entry for 2024-25 academic year. Parent consent form signed and filed.',
    schoolBranch: 'north',
    relatedLogs: ['LOG-007'],
  },
  {
    id: 'LOG-014',
    ...d(13, 14, 30),
    actor: 'Sunita Rao',
    actorRole: 'Class Teacher',
    actorDept: 'Teaching — Grade 5',
    actorId: 'EMP-0078',
    action: 'view',
    dataArea: 'Attendance',
    dataCategory: 'attendance',
    dataGroup: 'Student Data',
    module: 'Attendance Management',
    recordId: 'ATT-GR5A-OCT-2024',
    recordName: 'Grade 5 — Section A',
    recordType: 'Batch',
    details: 'Viewed full October attendance register for Grade 5 Section A — 32 students, identified 3 with attendance below 75%',
    ipAddress: '192.168.1.132',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '6 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Academic Data Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-12356',
    apiEndpoint: '/api/attendance/class/view',
    purpose: 'Monthly attendance review before parent-teacher meetings. Defaulters list prepared for counsellor.',
    schoolBranch: 'north',
  },
  {
    id: 'LOG-015',
    ...d(14, 16, 0),
    actor: 'Rohit Bansal',
    actorRole: 'Parent',
    actorDept: 'Parent / Guardian',
    actorId: 'PAR-10234',
    action: 'view',
    dataArea: 'Fee Records',
    dataCategory: 'fees',
    dataGroup: 'Financial',
    module: 'Parent Portal',
    recordId: 'FEE-STU-20189-2024',
    recordName: 'Priya Sharma',
    recordType: 'Student',
    details: 'Viewed complete fee payment history and pending dues for Academic Year 2024-25 — 3 instalments paid, 1 pending',
    ipAddress: '49.205.12.88',
    device: 'Mobile',
    browser: 'Chrome Mobile 120',
    location: 'Mumbai, India',
    duration: '4 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Parent Portal Access Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-PAR-12357',
    apiEndpoint: '/api/parent/fees/view',
    purpose: 'Parent self-service fee review via authorised parent portal login. Authenticated via OTP.',
    schoolBranch: 'north',
  },
  {
    id: 'LOG-016',
    ...d(16, 9, 15),
    actor: 'System Process',
    actorRole: 'Automated System',
    actorDept: 'IT Infrastructure',
    actorId: 'SYS-BACKUP-01',
    action: 'process',
    dataArea: 'All Data',
    dataCategory: 'personal',
    dataGroup: 'Sensitive',
    module: 'Backup & Recovery',
    recordId: 'BACKUP-2024-WEEKLY-43',
    recordName: 'Full System Backup W43',
    recordType: 'System',
    details: 'Automated encrypted full database backup — all 14 modules, 2.4 GB compressed, stored in offsite vault AZ-EAST-2',
    ipAddress: '127.0.0.1',
    device: 'Backup Server',
    browser: 'System',
    location: 'Internal — Data Center Rack 4B',
    duration: '22 min 18 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'restricted',
    dataClassification: 'Restricted — System',
    compliancePolicy: 'Data Backup & Recovery Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SYS-BACKUP-AUTO-43',
    apiEndpoint: '/api/system/backup/full',
    purpose: 'Weekly automated encrypted backup per data protection and disaster recovery policy. Checksum verified.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-017',
    ...d(17, 13, 45),
    actor: 'Neha Kulkarni',
    actorRole: 'Principal',
    actorDept: 'Administration',
    actorId: 'PRIN-001',
    action: 'view',
    dataArea: 'Performance Records',
    dataCategory: 'performance',
    dataGroup: 'Student Data',
    module: 'Academic Analytics',
    recordId: 'ACAD-PERF-2024-H1',
    recordName: 'School-Wide Performance H1 2024',
    recordType: 'Report',
    details: 'Viewed academic performance analytics dashboard — H1 2024, all grades (1-10), subject-wise pass/fail heatmap',
    ipAddress: '192.168.1.5',
    device: 'Desktop',
    browser: 'Safari 17',
    location: 'Mumbai, India',
    duration: '25 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Academic Data Policy',
    consentRequired: false,
    retentionDays: 180,
    sessionId: 'SES-PRIN-12358',
    apiEndpoint: '/api/analytics/academic/h1',
    purpose: 'Quarterly academic performance review. Data used for board meeting presentation on 25-Oct.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-018',
    ...d(18, 11, 30),
    actor: 'Priya Shah',
    actorRole: 'Finance Officer',
    actorDept: 'Finance Department',
    actorId: 'FIN-003',
    action: 'download',
    dataArea: 'Payroll Data',
    dataCategory: 'payroll',
    dataGroup: 'Financial',
    module: 'Payroll Management',
    recordId: 'PAY-SEPT-2024-SUMMARY',
    recordName: 'September 2024 Payroll Summary',
    recordType: 'Report',
    details: 'Downloaded September 2024 payroll disbursement summary — gross ₹48.6L, net ₹39.2L, 68 employees',
    ipAddress: '192.168.1.175',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '30 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'restricted',
    dataClassification: 'Restricted — Financial',
    compliancePolicy: 'Payroll Data Access Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SES-FIN-12359',
    apiEndpoint: '/api/payroll/summary/download',
    purpose: 'Monthly payroll reconciliation with HDFC Bank disbursement records. Finance internal use.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-019',
    ...d(19, 15, 0),
    actor: 'Arun Sharma',
    actorRole: 'Transport Manager',
    actorDept: 'Operations',
    actorId: 'OPS-012',
    action: 'update',
    dataArea: 'Transport',
    dataCategory: 'transport',
    dataGroup: 'Operations',
    module: 'Transport Management',
    recordId: 'TRANS-ROUTE-12-STU-20101',
    recordName: 'Aarav Patel',
    recordType: 'Student',
    details: 'Updated bus route, pickup point and time for student Aarav Patel — effective from 1st November 2024',
    ipAddress: '192.168.1.190',
    device: 'Desktop',
    browser: 'Firefox 119',
    location: 'Mumbai, India',
    duration: '3 min',
    resultStatus: 'success',
    changesMade: [
      { field: 'Bus Route', oldValue: 'Route 7 — Andheri East', newValue: 'Route 12 — Powai' },
      { field: 'Pickup Point', oldValue: 'Sakinaka Junction, Stop 3', newValue: 'Hiranandani Gardens Gate 2' },
      { field: 'Pickup Time', oldValue: '06:45 AM', newValue: '07:00 AM' },
      { field: 'Drop Time', oldValue: '04:15 PM', newValue: '04:30 PM' },
    ],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Student Data Access Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-OPS-12360',
    apiEndpoint: '/api/transport/student/update',
    purpose: 'Parent Mr. Nilesh Patel requested route change due to family relocation. Written approval obtained.',
    schoolBranch: 'north',
    relatedLogs: ['LOG-004'],
  },
  {
    id: 'LOG-020',
    ...d(20, 10, 30),
    actor: 'Kavitha Menon',
    actorRole: 'Librarian',
    actorDept: 'Library & Resources',
    actorId: 'LIB-003',
    action: 'view',
    dataArea: 'Library Records',
    dataCategory: 'library',
    dataGroup: 'Operations',
    module: 'Library Management',
    recordId: 'LIB-HIST-STU-20189',
    recordName: 'Priya Sharma',
    recordType: 'Student',
    details: 'Viewed library borrowing history — checked for overdue items. 2 books overdue by 12 days. Fine calculated: ₹24.',
    ipAddress: '192.168.1.145',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '2 min 15 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'public',
    dataClassification: 'Public',
    compliancePolicy: 'Library Policy',
    consentRequired: false,
    retentionDays: 60,
    sessionId: 'SES-LIB-12361',
    apiEndpoint: '/api/library/borrowing/view',
    purpose: 'Routine overdue check before issuing additional books to the student.',
    schoolBranch: 'north',
  },
  {
    id: 'LOG-021',
    ...d(21, 8, 0),
    actor: 'System Process',
    actorRole: 'Automated System',
    actorDept: 'IT Infrastructure',
    actorId: 'SYS-FEE-REMINDER',
    action: 'process',
    dataArea: 'Fee Records',
    dataCategory: 'fees',
    dataGroup: 'Financial',
    module: 'Fee Management',
    recordId: 'FEE-REMINDER-OCT-2024',
    recordName: 'Fee Defaulters — Oct 2024',
    recordType: 'Batch',
    details: 'Automated fee reminder SMS and email dispatch to 47 families with pending Q2 instalments',
    ipAddress: '127.0.0.1',
    device: 'Application Server',
    browser: 'System',
    location: 'Internal',
    duration: '3 min 40 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Fee Communication Policy',
    consentRequired: false,
    retentionDays: 60,
    sessionId: 'SYS-FEE-AUTO-OCT',
    apiEndpoint: '/api/fees/reminders/send',
    purpose: 'Monthly automated fee reminder as per fee collection SOP. Triggered on 21st of each month.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-022',
    ...d(22, 14, 0),
    actor: 'Deepak Verma',
    actorRole: 'Hostel Warden',
    actorDept: 'Hostel Management',
    actorId: 'HST-007',
    action: 'update',
    dataArea: 'Hostel',
    dataCategory: 'hostel',
    dataGroup: 'Operations',
    module: 'Hostel Management',
    recordId: 'HST-STU-30045-ROOM',
    recordName: 'Arjun Singh',
    recordType: 'Student',
    details: 'Updated room allotment for student — shifted from Block B Room 14 to Block A Room 7 (medical grounds)',
    ipAddress: '192.168.2.20',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '4 min',
    resultStatus: 'success',
    changesMade: [
      { field: 'Block', oldValue: 'Block B', newValue: 'Block A' },
      { field: 'Room Number', oldValue: 'B-14', newValue: 'A-07' },
      { field: 'Floor', oldValue: '2nd Floor', newValue: 'Ground Floor' },
      { field: 'Reason', oldValue: 'Standard Allotment', newValue: 'Medical — Mobility Assistance Required' },
    ],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Hostel Management Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-HST-12362',
    apiEndpoint: '/api/hostel/room/update',
    purpose: 'Room reassignment on medical recommendation from school doctor for student with mobility issues.',
    schoolBranch: 'south',
  },
  {
    id: 'LOG-023',
    ...d(24, 11, 15),
    actor: 'Fatima Khan',
    actorRole: 'Accounts Officer',
    actorDept: 'Finance Department',
    actorId: 'FIN-007',
    action: 'view',
    dataArea: 'Financial Data',
    dataCategory: 'finance',
    dataGroup: 'Financial',
    module: 'Accounts & Ledger',
    recordId: 'LEDGER-2024-OCT',
    recordName: 'October 2024 Accounts Ledger',
    recordType: 'Report',
    details: 'Viewed October 2024 general accounts ledger — income, expenditure and outstanding balances',
    ipAddress: '192.168.1.180',
    device: 'Desktop',
    browser: 'Edge 119',
    location: 'Mumbai, India',
    duration: '18 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Financial Data Access Policy',
    consentRequired: false,
    retentionDays: 180,
    sessionId: 'SES-FIN-12363',
    apiEndpoint: '/api/accounts/ledger/view',
    purpose: 'Month-end accounts closing review and reconciliation before submitting to CFO.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-024',
    ...d(25, 10, 0),
    actor: 'Sanjay Mehta',
    actorRole: 'Parent',
    actorDept: 'Parent / Guardian',
    actorId: 'PAR-20456',
    action: 'view',
    dataArea: 'Academic Records',
    dataCategory: 'academic',
    dataGroup: 'Student Data',
    module: 'Parent Portal',
    recordId: 'GRADE-2024-STU-30301',
    recordName: 'Rohan Mehta',
    recordType: 'Student',
    details: "Viewed son's H1 exam results, subject-wise scores, and class rank via parent mobile app",
    ipAddress: '122.167.45.88',
    device: 'Mobile',
    browser: 'Mobile App iOS 17',
    location: 'Delhi, India',
    duration: '7 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Parent Portal Access Policy',
    consentRequired: false,
    retentionDays: 90,
    sessionId: 'SES-PAR-12364',
    apiEndpoint: '/api/parent/academics/view',
    purpose: "Parent checking ward's exam performance — routine self-service via authenticated parent portal.",
    schoolBranch: 'east',
  },
  {
    id: 'LOG-025',
    ...d(26, 16, 30),
    actor: 'Pooja Iyer',
    actorRole: 'Counsellor',
    actorDept: 'Student Welfare',
    actorId: 'COUN-002',
    action: 'view',
    dataArea: 'Academic Records',
    dataCategory: 'academic',
    dataGroup: 'Student Data',
    module: 'Student Welfare Portal',
    recordId: 'WELFARE-STU-20345',
    recordName: 'Kavya Reddy',
    recordType: 'Student',
    details: 'Viewed academic performance trend and attendance history for at-risk student counselling intervention plan',
    ipAddress: '192.168.1.155',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '20 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Student Welfare Policy',
    consentRequired: true,
    retentionDays: 180,
    sessionId: 'SES-COUN-12365',
    apiEndpoint: '/api/welfare/student/profile/view',
    purpose: 'Preparing personalised counselling plan for student identified as academically at-risk in Q2 review.',
    schoolBranch: 'west',
  },
  {
    id: 'LOG-026',
    ...d(27, 9, 30),
    actor: 'System Process',
    actorRole: 'Automated System',
    actorDept: 'IT Infrastructure',
    actorId: 'SYS-REPORT-GEN',
    action: 'create',
    dataArea: 'Performance Records',
    dataCategory: 'performance',
    dataGroup: 'Student Data',
    module: 'Report Card Generator',
    recordId: 'RPTCARD-2024-MID-ALLGRADES',
    recordName: 'Mid-Term Report Cards 2024',
    recordType: 'Batch',
    details: 'Automated generation of 1,240 mid-term report cards across all grades — PDF compilation and digital dispatch',
    ipAddress: '127.0.0.1',
    device: 'Application Server',
    browser: 'System',
    location: 'Internal',
    duration: '12 min 30 sec',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Academic Records Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SYS-RPTGEN-AUTO',
    apiEndpoint: '/api/reports/cards/generate-batch',
    purpose: 'Scheduled bulk report card generation triggered by exam results upload. Auto-shared to parent portal.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-027',
    ...d(28, 15, 0),
    actor: 'Ramesh Patil',
    actorRole: 'HR Executive',
    actorDept: 'Human Resources',
    actorId: 'HR-008',
    action: 'delete',
    dataArea: 'Employee Profile',
    dataCategory: 'profile',
    dataGroup: 'Student Data',
    module: 'Employee Management',
    recordId: 'EMP-0099-TEMP',
    recordName: 'Temp Staff Record',
    recordType: 'Employee',
    details: 'Deleted temporary staff record for contract employee whose engagement ended on 30-Sep-2024',
    ipAddress: '192.168.1.152',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '1 min 20 sec',
    resultStatus: 'success',
    changesMade: [
      { field: 'Record Status', oldValue: 'Active — Temporary', newValue: 'Deleted — Contract Ended' },
      { field: 'Access Revoked', oldValue: 'No', newValue: 'Yes — 30-Sep-2024' },
    ],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Employee Data Lifecycle Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SES-HR-12366',
    apiEndpoint: '/api/employee/delete',
    purpose: 'Routine end-of-contract record cleanup. Deletion approved by HR Manager Meena Desai. Ref: HR-EXIT-2024-099.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-028',
    ...d(29, 13, 0),
    actor: 'Leena Nambiar',
    actorRole: 'Admissions Officer',
    actorDept: 'Admissions',
    actorId: 'ADM-004',
    action: 'create',
    dataArea: 'Student Profile',
    dataCategory: 'profile',
    dataGroup: 'Student Data',
    module: 'Admissions Management',
    recordId: 'STU-NEW-2024-1312',
    recordName: 'Ishaan Gupta',
    recordType: 'Student',
    details: 'Created new student record for Ishaan Gupta — admitted to Grade 6 for AY 2024-25, all documents verified',
    ipAddress: '192.168.1.120',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '25 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'internal',
    dataClassification: 'Internal',
    compliancePolicy: 'Admissions Data Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SES-ADM-12367',
    apiEndpoint: '/api/admissions/student/create',
    purpose: 'New student onboarding — enrollment confirmed, all required documents collected and scanned.',
    schoolBranch: 'south',
  },
  {
    id: 'LOG-029',
    ...d(30, 10, 45),
    actor: 'Vandana Pillai',
    actorRole: 'IT Administrator',
    actorDept: 'IT Department',
    actorId: 'IT-ADM-001',
    action: 'share',
    dataArea: 'Performance Records',
    dataCategory: 'performance',
    dataGroup: 'Student Data',
    module: 'Analytics & Reporting',
    recordId: 'SHARE-ANALYTICS-2024-Q2',
    recordName: 'Q2 Analytics Report',
    recordType: 'Report',
    details: 'Shared Q2 2024 school analytics report with state education board via secure encrypted link — 48 hr expiry',
    ipAddress: '192.168.1.5',
    device: 'Desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    duration: '5 min',
    resultStatus: 'success',
    changesMade: [],
    sensitivity: 'confidential',
    dataClassification: 'Confidential',
    compliancePolicy: 'Data Sharing & External Access Policy',
    consentRequired: false,
    retentionDays: 180,
    sessionId: 'SES-IT-12368',
    apiEndpoint: '/api/reports/share/external',
    purpose: 'Mandatory quarterly report submission to Maharashtra State Education Board. Encrypted link — auto-expires in 48 hrs.',
    schoolBranch: 'main',
  },
  {
    id: 'LOG-030',
    ...d(31, 9, 0),
    actor: 'Geeta Joshi',
    actorRole: 'Finance Officer',
    actorDept: 'Finance Department',
    actorId: 'FIN-009',
    action: 'view',
    dataArea: 'Payroll Data',
    dataCategory: 'payroll',
    dataGroup: 'Financial',
    module: 'Payroll Management',
    recordId: 'PAY-AUG-2024-ALL',
    recordName: 'August 2024 Payroll',
    recordType: 'Report',
    details: 'Accessed August 2024 full payroll register — salary structure, gross, deductions and net for all 68 staff',
    ipAddress: '192.168.1.177',
    device: 'Desktop',
    browser: 'Firefox 120',
    location: 'Mumbai, India',
    duration: '9 min',
    resultStatus: 'partial',
    changesMade: [],
    sensitivity: 'restricted',
    dataClassification: 'Restricted — Financial',
    compliancePolicy: 'Payroll Data Access Policy',
    consentRequired: false,
    retentionDays: 365,
    sessionId: 'SES-FIN-12369',
    apiEndpoint: '/api/payroll/register/view',
    purpose: 'Retrospective payroll verification for Income Tax computation. Session timed out before full download — re-access needed.',
    schoolBranch: 'main',
  },
]

const sensitivityConfig: Record<string, { color: string; bg: string; border: string; dot: string; label: string }> = {
  public: { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', dot: 'bg-gray-400', label: 'Public' },
  internal: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Internal' },
  confidential: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Confidential' },
  restricted: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', label: 'Restricted' },
}

const actionConfig: Record<string, { color: string; bg: string; label: string }> = {
  view: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'View' },
  create: { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Create' },
  update: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Update' },
  delete: { color: 'text-red-700', bg: 'bg-red-100', label: 'Delete' },
  download: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Download' },
  export: { color: 'text-indigo-700', bg: 'bg-indigo-100', label: 'Export' },
  print: { color: 'text-gray-700', bg: 'bg-gray-100', label: 'Print' },
  share: { color: 'text-cyan-700', bg: 'bg-cyan-100', label: 'Share' },
  process: { color: 'text-slate-700', bg: 'bg-slate-100', label: 'Process' },
  login: { color: 'text-teal-700', bg: 'bg-teal-100', label: 'Login' },
  logout: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Logout' },
}

const recordTypeConfig: Record<string, { color: string; bg: string }> = {
  Student: { color: 'text-blue-700', bg: 'bg-blue-50' },
  Employee: { color: 'text-purple-700', bg: 'bg-purple-50' },
  Parent: { color: 'text-teal-700', bg: 'bg-teal-50' },
  Report: { color: 'text-amber-700', bg: 'bg-amber-50' },
  Batch: { color: 'text-indigo-700', bg: 'bg-indigo-50' },
  System: { color: 'text-gray-700', bg: 'bg-gray-100' },
}

function formatDate(date: string, time: string) {
  const dt = new Date(`${date}T${time}`)
  return (
    dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  )
}

function formatShortDate(date: string, time: string) {
  const dt = new Date(`${date}T${time}`)
  return (
    dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
    ', ' +
    dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  )
}

function getDateRange(preset: DatePreset): { from: string; to: string } {
  const now = new Date()
  const fmt = (dt: Date) => dt.toISOString().split('T')[0]
  const sub = (dt: Date, n: number) => { const x = new Date(dt); x.setDate(x.getDate() - n); return x }
  if (preset === 'today') return { from: fmt(now), to: fmt(now) }
  if (preset === 'yesterday') { const y = sub(now, 1); return { from: fmt(y), to: fmt(y) } }
  if (preset === '7days') return { from: fmt(sub(now, 7)), to: fmt(now) }
  if (preset === '30days') return { from: fmt(sub(now, 30)), to: fmt(now) }
  if (preset === '90days') return { from: fmt(sub(now, 90)), to: fmt(now) }
  return { from: '', to: '' }
}

function ActionPill({ action }: { action: string }) {
  const c = actionConfig[action] || actionConfig.view
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${c.bg} ${c.color}`}>{c.label}</span>
}

function SensitivityDot({ sensitivity }: { sensitivity: string }) {
  const c = sensitivityConfig[sensitivity] || sensitivityConfig.public
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${c.bg} ${c.color} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  )
}

function StatusPill({ status }: { status: string }) {
  if (status === 'success') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle className="w-3.5 h-3.5" />Success</span>
  if (status === 'denied') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"><XCircle className="w-3.5 h-3.5" />Denied</span>
  if (status === 'failed') return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500"><XCircle className="w-3.5 h-3.5" />Failed</span>
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><AlertTriangle className="w-3.5 h-3.5" />Partial</span>
}

function RecordTypeBadge({ type }: { type: string }) {
  const c = recordTypeConfig[type] || recordTypeConfig.System
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.color}`}>{type}</span>
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

const ITEMS_PER_PAGE = 8

export function MyDataAccessLog() {
  const [logs] = useState<AccessLog[]>(initialLogs)
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [datePreset, setDatePreset] = useState<DatePreset>('90days')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [dataAreaFilter, setDataAreaFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [recordTypeFilter, setRecordTypeFilter] = useState('all')
  const [recordSearch, setRecordSearch] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'json' | 'excel'>('csv')
  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered')
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    logRetentionDays: 90,
    emailNotifications: true,
    alertOnSensitiveAccess: true,
    alertOnAdminAccess: true,
    alertOnExternalAccess: true,
    allowDataExport: true,
    requireApprovalForExport: false,
  })

  useEffect(() => {
    if (datePreset !== 'custom') {
      const r = getDateRange(datePreset)
      setDateFrom(r.from)
      setDateTo(r.to)
    }
  }, [datePreset])

  useEffect(() => { setCurrentPage(1) }, [
    searchQuery, quickFilter, dateFrom, dateTo,
    dataAreaFilter, actionFilter, statusFilter,
    roleFilter, branchFilter, recordTypeFilter, recordSearch,
  ])

  const filteredLogs = useMemo(() => logs.filter(log => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const hay = [
        log.actor, log.actorRole, log.actorDept, log.actorId,
        log.recordName, log.recordId, log.recordType,
        log.dataArea, log.dataCategory, log.dataGroup,
        log.module, log.action, log.details, log.purpose,
        log.ipAddress, log.sessionId, log.id,
        log.location, log.device, log.browser,
        log.compliancePolicy, log.resultStatus,
        log.sensitivity, log.schoolBranch,
      ].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (quickFilter === 'sensitive' && log.sensitivity !== 'confidential' && log.sensitivity !== 'restricted') return false
    if (quickFilter === 'denied' && log.resultStatus !== 'denied') return false
    if (quickFilter === 'downloads' && log.action !== 'download') return false
    if (quickFilter === 'exports' && log.action !== 'export') return false
    if (quickFilter === 'changes' && log.changesMade.length === 0) return false
    if (dateFrom && log.date < dateFrom) return false
    if (dateTo && log.date > dateTo) return false
    if (dataAreaFilter !== 'all' && log.dataCategory !== dataAreaFilter) return false
    if (actionFilter !== 'all' && log.action !== actionFilter) return false
    if (statusFilter !== 'all' && log.resultStatus !== statusFilter) return false
    if (roleFilter !== 'all') {
      const rl = log.actorRole.toLowerCase()
      const dept = log.actorDept.toLowerCase()
      if (roleFilter === 'employee' && !rl.includes('employee') && !dept.includes('teaching')) return false
      if (roleFilter === 'admin' && !rl.includes('admin') && !rl.includes('administrator')) return false
      if (roleFilter === 'system' && !rl.includes('system') && !rl.includes('automated')) return false
      if (roleFilter === 'hr' && !rl.includes('hr') && !dept.includes('human resource')) return false
      if (roleFilter === 'finance' && !rl.includes('finance') && !dept.includes('finance')) return false
      if (roleFilter === 'academic' && !rl.includes('teacher') && !rl.includes('academic') && !dept.includes('teaching')) return false
      if (roleFilter === 'external' && !rl.includes('external') && !rl.includes('auditor')) return false
      if (roleFilter === 'medical' && !rl.includes('medical') && !dept.includes('health')) return false
      if (roleFilter === 'it' && !rl.includes('it') && !dept.includes('it')) return false
      if (roleFilter === 'principal' && !rl.includes('principal') && !rl.includes('hod')) return false
      if (roleFilter === 'parent' && !rl.includes('parent') && !rl.includes('guardian')) return false
    }
    if (branchFilter !== 'all' && log.schoolBranch !== branchFilter) return false
    if (recordTypeFilter !== 'all' && log.recordType !== recordTypeFilter) return false
    if (recordSearch) {
      const rs = recordSearch.toLowerCase()
      if (!log.recordName.toLowerCase().includes(rs) && !log.recordId.toLowerCase().includes(rs)) return false
    }
    return true
  }), [logs, searchQuery, quickFilter, dateFrom, dateTo, dataAreaFilter, actionFilter, statusFilter, roleFilter, branchFilter, recordTypeFilter, recordSearch])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedLogs = filteredLogs.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  const stats = useMemo(() => ({
    total: logs.length,
    today: logs.filter(l => l.date === new Date().toISOString().split('T')[0]).length,
    sensitive: logs.filter(l => l.sensitivity === 'confidential' || l.sensitivity === 'restricted').length,
    denied: logs.filter(l => l.resultStatus === 'denied').length,
    exports: logs.filter(l => l.action === 'download' || l.action === 'export').length,
  }), [logs])

  const hasActiveFilters = !!searchQuery || quickFilter !== 'all' || dataAreaFilter !== 'all' ||
    actionFilter !== 'all' || statusFilter !== 'all' || roleFilter !== 'all' ||
    branchFilter !== 'all' || recordTypeFilter !== 'all' || !!recordSearch

  const clearAll = () => {
    setSearchQuery(''); setQuickFilter('all'); setDataAreaFilter('all')
    setActionFilter('all'); setStatusFilter('all'); setRoleFilter('all')
    setBranchFilter('all'); setRecordTypeFilter('all'); setRecordSearch('')
    setDatePreset('90days'); setCurrentPage(1)
  }

  const relatedTimeline = useMemo(() => {
    if (!selectedLog?.relatedLogs) return []
    return selectedLog.relatedLogs.map(rid => logs.find(l => l.id === rid)).filter(Boolean) as AccessLog[]
  }, [selectedLog, logs])

  const pageItems = useMemo(() => {
    const arr = Array.from({ length: totalPages }, (_, i) => i + 1)
    return arr
      .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
      .reduce<(number | 'ellipsis')[]>((acc, p, idx, src) => {
        if (idx > 0 && p - (src[idx - 1] as number) > 1) acc.push('ellipsis')
        acc.push(p)
        return acc
      }, [])
  }, [totalPages, safePage])

  const handleExport = () => {
    const rows = exportScope === 'filtered' ? filteredLogs : logs
    const header = ['ID', 'Date', 'Time', 'Actor', 'Role', 'Action', 'Data Area', 'Record', 'Type', 'Status', 'Sensitivity', 'IP', 'Device']
    const csv = [header.join(','), ...rows.map(l => [l.id, l.date, l.time, l.actor, l.actorRole, l.action, l.dataArea, l.recordName, l.recordType, l.resultStatus, l.sensitivity, l.ipAddress, l.device].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const json = JSON.stringify(rows, null, 2)
    const content = exportFormat === 'json' ? json : csv
    const ext = exportFormat === 'json' ? 'json' : exportFormat === 'pdf' ? 'csv' : exportFormat === 'excel' ? 'csv' : 'csv'
    const blob = new Blob([content], { type: exportFormat === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-access-log.${ext}`
    a.click()
    URL.revokeObjectURL(url)
    setIsExportModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-screen-xl mx-auto">

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Data Access Log
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Track and review who accessed, changed, downloaded, or shared data across the ERP.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user name, student name, record ID, module, action, IP address, session ID, description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {!searchQuery && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-gray-400">Try:</span>
              {['Priya Sharma', 'medical', 'download', 'denied', 'Rajesh', 'payroll', 'SES-12345'].map(h => (
                <button key={h} onClick={() => setSearchQuery(h)}
                  className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                >{h}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Accesses', value: stats.total, icon: Activity, ic: 'text-gray-600', ib: 'bg-gray-100', qf: 'all' as QuickFilter, active: quickFilter === 'all' && datePreset !== 'today' },
            { label: 'Today', value: stats.today, icon: Calendar, ic: 'text-blue-600', ib: 'bg-blue-50', qf: null as QuickFilter | null, active: datePreset === 'today' },
            { label: 'Sensitive Access', value: stats.sensitive, icon: Lock, ic: 'text-amber-600', ib: 'bg-amber-50', qf: 'sensitive' as QuickFilter, active: quickFilter === 'sensitive' },
            { label: 'Denied', value: stats.denied, icon: ShieldAlert, ic: 'text-red-600', ib: 'bg-red-50', qf: 'denied' as QuickFilter, active: quickFilter === 'denied' },
            { label: 'Exports & Downloads', value: stats.exports, icon: Download, ic: 'text-purple-600', ib: 'bg-purple-50', qf: 'downloads' as QuickFilter, active: quickFilter === 'downloads' },
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => { if (s.qf) setQuickFilter(s.qf); else { setQuickFilter('all'); setDatePreset('today') } }}
              className={`bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-all text-left ${s.active ? 'border-blue-400 ring-1 ring-blue-200 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${s.ib}`}>
                <s.icon className={`w-5 h-5 ${s.ic}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">{s.label}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-400 mr-1">Quick filter:</span>
          {[
            { key: 'all' as QuickFilter, label: 'All Events' },
            { key: 'sensitive' as QuickFilter, label: '🔒 Sensitive Data' },
            { key: 'denied' as QuickFilter, label: '⛔ Denied Access' },
            { key: 'downloads' as QuickFilter, label: '⬇ Downloads' },
            { key: 'exports' as QuickFilter, label: '📤 Exports' },
            { key: 'changes' as QuickFilter, label: '✏ Changes Made' },
          ].map(qf => (
            <button
              key={qf.key}
              onClick={() => setQuickFilter(qf.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${quickFilter === qf.key ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}
            >{qf.label}</button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <Filter className="w-4 h-4 text-gray-400" />
              Filters
              <span className="text-xs text-gray-400 font-normal">{filteredLogs.length} of {logs.length} shown</span>
              {showFilters ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {hasActiveFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
                  <select value={datePreset} onChange={e => setDatePreset(e.target.value as DatePreset)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">User / Role</label>
                  <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Data Area</label>
                  <select value={dataAreaFilter} onChange={e => setDataAreaFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="all">All Data Areas</option>
                    {dataAreaGroups.map(g => (
                      <optgroup key={g.group} label={`── ${g.group}`}>
                        {g.items.map(it => <option key={it.value} value={it.value}>{it.label}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Action Type</label>
                  <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {actionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">School / Branch</label>
                  <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {branchOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Record Type</label>
                  <select value={recordTypeFilter} onChange={e => setRecordTypeFilter(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {recordTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Record / Person</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" placeholder="Student, employee, parent..."
                      value={recordSearch} onChange={e => setRecordSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {recordSearch && (
                      <button onClick={() => setRecordSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {datePreset === 'custom' && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}

              {hasActiveFilters && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-gray-400">Active:</span>
                  {[
                    { show: !!searchQuery, label: `Search: "${searchQuery}"`, clear: () => setSearchQuery('') },
                    { show: quickFilter !== 'all', label: `Quick: ${quickFilter}`, clear: () => setQuickFilter('all') },
                    { show: dataAreaFilter !== 'all', label: `Area: ${dataAreaFilter}`, clear: () => setDataAreaFilter('all') },
                    { show: actionFilter !== 'all', label: `Action: ${actionFilter}`, clear: () => setActionFilter('all') },
                    { show: statusFilter !== 'all', label: `Status: ${statusFilter}`, clear: () => setStatusFilter('all') },
                    { show: roleFilter !== 'all', label: `Role: ${roleFilter}`, clear: () => setRoleFilter('all') },
                    { show: branchFilter !== 'all', label: `Branch: ${branchFilter}`, clear: () => setBranchFilter('all') },
                    { show: recordTypeFilter !== 'all', label: `Type: ${recordTypeFilter}`, clear: () => setRecordTypeFilter('all') },
                    { show: !!recordSearch, label: `Person: "${recordSearch}"`, clear: () => setRecordSearch('') },
                  ].filter(c => c.show).map((c, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      {c.label}
                      <button onClick={c.clear}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
            {[
              { label: 'Date & Time', s: 'col-span-2' },
              { label: 'User / Actor', s: 'col-span-2' },
              { label: 'Action', s: 'col-span-1' },
              { label: 'Data Area', s: 'col-span-2' },
              { label: 'Record / Person', s: 'col-span-2' },
              { label: 'Access Level', s: 'col-span-1' },
              { label: 'Status', s: 'col-span-1' },
              { label: '', s: 'col-span-1' },
            ].map((h, i) => (
              <div key={i} className={`${h.s} text-xs font-semibold text-gray-500 uppercase tracking-wide`}>{h.label}</div>
            ))}
          </div>

          {paginatedLogs.length === 0 ? (
            <div className="py-20 text-center">
              <Activity className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500 font-semibold">No access logs found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              {hasActiveFilters && <button onClick={clearAll} className="mt-3 text-sm text-blue-600 hover:underline">Clear all filters</button>}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {paginatedLogs.map(log => (
                <div
                  key={log.id}
                  onClick={() => { setSelectedLog(log); setIsDrawerOpen(true) }}
                  className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center cursor-pointer transition-colors group ${
                    log.resultStatus === 'denied' ? 'bg-red-50/40 hover:bg-red-50/70' :
                    log.sensitivity === 'restricted' ? 'hover:bg-amber-50/20' : 'hover:bg-blue-50/30'
                  }`}
                >
                  <div className="col-span-2 min-w-0">
                    <p className="text-sm text-gray-800 font-medium tabular-nums">{formatShortDate(log.date, log.time)}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{log.id}</p>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{log.actor}</p>
                    <p className="text-xs text-gray-400 truncate">{log.actorRole}</p>
                  </div>
                  <div className="col-span-1"><ActionPill action={log.action} /></div>
                  <div className="col-span-2 min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">{log.dataArea}</p>
                    <p className="text-xs text-gray-400 truncate">{log.module}</p>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{log.recordName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <RecordTypeBadge type={log.recordType} />
                      <span className="text-xs text-gray-400 truncate">{log.recordId}</span>
                    </div>
                  </div>
                  <div className="col-span-1"><SensitivityDot sensitivity={log.sensitivity} /></div>
                  <div className="col-span-1"><StatusPill status={log.resultStatus} /></div>
                  <div className="col-span-1 flex justify-end">
                    <span className="flex items-center gap-0.5 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredLogs.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-semibold text-gray-700">
                  {Math.min((safePage - 1) * ITEMS_PER_PAGE + 1, filteredLogs.length)}–{Math.min(safePage * ITEMS_PER_PAGE, filteredLogs.length)}
                </span>{' '}
                of <span className="font-semibold text-gray-700">{filteredLogs.length}</span> logs
                {hasActiveFilters && <span className="text-gray-400"> (filtered from {logs.length})</span>}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {pageItems.map((item, i) =>
                  item === 'ellipsis' ? (
                    <span key={`e${i}`} className="w-8 text-center text-gray-400 text-sm">…</span>
                  ) : (
                    <button key={item} onClick={() => setCurrentPage(item as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${item === safePage ? 'bg-blue-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-white'}`}>
                      {item}
                    </button>
                  )
                )}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">Audit Policy:</span> This log displays all data access events for the last{' '}
            <span className="font-medium">{privacySettings.logRetentionDays} days</span>. All actions are permanently recorded for security,
            compliance and accountability. Exporting this log will itself be recorded as a new audit event.
          </p>
        </div>
      </div>

      {isDrawerOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setIsDrawerOpen(false)} />
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Access Details</h2>
                <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{selectedLog.id}</span>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-6">

                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-sm">
                    {selectedLog.actor.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-base">{selectedLog.actor}</p>
                    <p className="text-sm text-gray-500">{selectedLog.actorRole}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedLog.actorDept}</p>
                    <p className="text-xs text-gray-400 font-mono">{selectedLog.actorId}</p>
                  </div>
                </div>

                <div className={`rounded-xl p-4 border-2 ${selectedLog.resultStatus === 'denied' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <ActionPill action={selectedLog.action} />
                    <StatusPill status={selectedLog.resultStatus} />
                    <SensitivityDot sensitivity={selectedLog.sensitivity} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Database className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-500">Data: </span>
                        <span className="font-semibold text-gray-800">{selectedLog.module}</span>
                        <span className="text-gray-400"> → </span>
                        <span className="font-semibold text-gray-800">{selectedLog.dataArea}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-gray-500">Record:</span>
                        <span className="font-semibold text-gray-800">{selectedLog.recordName}</span>
                        <RecordTypeBadge type={selectedLog.recordType} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">Record ID:</span>
                      <span className="font-mono text-xs text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">{selectedLog.recordId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(selectedLog.date, selectedLog.time)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Duration: {selectedLog.duration}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Access Context</h3>
                  <div className="space-y-2.5">
                    {[
                      { icon: Wifi, label: 'IP Address', value: selectedLog.ipAddress },
                      { icon: MapPin, label: 'Location', value: selectedLog.location },
                      { icon: Monitor, label: 'Device', value: selectedLog.device },
                      { icon: Globe, label: 'Browser', value: selectedLog.browser },
                      { icon: History, label: 'Session ID', value: selectedLog.sessionId, mono: true },
                      { icon: Building2, label: 'Branch', value: branchOptions.find(b => b.value === selectedLog.schoolBranch)?.label ?? selectedLog.schoolBranch },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                          <span className="text-sm text-gray-500 flex-shrink-0">{item.label}</span>
                          <span className={`text-sm font-medium text-gray-800 truncate text-right ${item.mono ? 'font-mono text-xs' : ''}`}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Purpose / Reason</h3>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{selectedLog.purpose}</p>
                </div>

                {selectedLog.changesMade.length > 0 && (
                  <>
                    <div className="border-t border-gray-100" />
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Changes Made ({selectedLog.changesMade.length} field{selectedLog.changesMade.length !== 1 ? 's' : ''})
                      </h3>
                      <div className="space-y-2">
                        {selectedLog.changesMade.map((ch, i) => (
                          <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                            <p className="text-xs font-semibold text-gray-500 mb-2">{ch.field}</p>
                            <div className="flex items-start gap-2">
                              <div className="flex-1 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                                <p className="text-xs text-red-400 mb-0.5">Before</p>
                                <p className="text-sm text-red-700 font-medium">{ch.oldValue}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-3" />
                              <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                                <p className="text-xs text-emerald-400 mb-0.5">After</p>
                                <p className="text-sm text-emerald-700 font-medium">{ch.newValue}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-100" />

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Data Classification</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Classification', content: <SensitivityDot sensitivity={selectedLog.sensitivity} /> },
                      { label: 'Policy', content: <p className="text-xs font-semibold text-gray-700 leading-tight">{selectedLog.compliancePolicy}</p> },
                      { label: 'Consent Required', content: <p className={`text-sm font-bold ${selectedLog.consentRequired ? 'text-amber-600' : 'text-gray-500'}`}>{selectedLog.consentRequired ? 'Yes — Required' : 'Not Required'}</p> },
                      { label: 'Retention Period', content: <p className="text-sm font-bold text-gray-700">{selectedLog.retentionDays} days</p> },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1.5">{item.label}</p>
                        {item.content}
                      </div>
                    ))}
                  </div>
                </div>

                {relatedTimeline.length > 0 && (
                  <>
                    <div className="border-t border-gray-100" />
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Related Activity Timeline ({relatedTimeline.length + 1} events)
                      </h3>
                      <div className="relative">
                        <div className="absolute left-3.5 top-3 bottom-3 w-px bg-gray-200" />
                        <div className="space-y-3">
                          <div className="relative flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white shadow flex items-center justify-center flex-shrink-0 z-10">
                              <span className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-bold text-blue-800">{selectedLog.actor}</span>
                                <ActionPill action={selectedLog.action} />
                                <span className="text-xs text-blue-500 ml-auto">{formatShortDate(selectedLog.date, selectedLog.time)}</span>
                              </div>
                              <p className="text-xs text-blue-700 leading-relaxed">{selectedLog.details}</p>
                            </div>
                          </div>
                          {relatedTimeline.map(rel => (
                            <div key={rel.id} className="relative flex gap-3">
                              <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white shadow flex items-center justify-center flex-shrink-0 z-10">
                                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                              </div>
                              <button
                                onClick={() => setSelectedLog(rel)}
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-left hover:border-blue-200 hover:bg-blue-50/30 transition-colors min-w-0"
                              >
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-xs font-semibold text-gray-700">{rel.actor}</span>
                                  <ActionPill action={rel.action} />
                                  <span className="text-xs text-gray-400 ml-auto">{formatShortDate(rel.date, rel.time)}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{rel.details}</p>
                                <p className="text-xs text-blue-500 font-medium mt-1">View details →</p>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
              <button onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                Close
              </button>
              {selectedLog.resultStatus === 'denied' && (
                <button className="flex-1 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Report Security Issue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Data Access Logs">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'csv', label: 'CSV', desc: 'Excel compatible · .csv', icon: '📊' },
                { value: 'excel', label: 'Excel', desc: 'Full workbook · .xlsx', icon: '📗' },
                { value: 'pdf', label: 'PDF', desc: 'Printable document · .pdf', icon: '📄' },
                { value: 'json', label: 'JSON', desc: 'API / technical · .json', icon: '{ }' },
              ].map(f => (
                <button key={f.value} onClick={() => setExportFormat(f.value as 'csv' | 'pdf' | 'json' | 'excel')}
                  className={`p-3 rounded-xl text-left transition-all border-2 ${exportFormat === f.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-sm font-bold text-gray-800">{f.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data to Export</label>
            <div className="space-y-2">
              {[
                { value: 'filtered', label: 'Current filtered view', desc: `${filteredLogs.length} records matching current filters` },
                { value: 'all', label: 'All available logs', desc: `${logs.length} total records` },
              ].map(s => (
                <label key={s.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${exportScope === s.value ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="exportScope" value={s.value} checked={exportScope === s.value}
                    onChange={() => setExportScope(s.value as 'filtered' | 'all')} className="mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">Audit notice:</span> This export will itself be recorded as a new access event in the audit log.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleExport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export {exportScope === 'filtered' ? filteredLogs.length : logs.length} Records
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Privacy & Audit Settings">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Log Retention Period</label>
            <select value={privacySettings.logRetentionDays.toString()}
              onChange={e => setPrivacySettings(p => ({ ...p, logRetentionDays: parseInt(e.target.value) }))}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[30, 60, 90, 180, 365].map(days => (
                <option key={days} value={days}>{days === 90 ? `${days} days (Recommended)` : days === 365 ? '1 year' : `${days} days`}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5">Longer retention provides better audit coverage but uses more storage.</p>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-bold text-gray-800 mb-1">Email & Alert Notifications</p>
            <p className="text-xs text-gray-400 mb-4">Receive alerts when specific access events occur</p>
            <div className="space-y-3.5">
              {[
                { key: 'emailNotifications', label: 'Email alerts for access events', desc: 'Notified for all significant access events' },
                { key: 'alertOnSensitiveAccess', label: 'Alert on sensitive data access', desc: 'Confidential or restricted data accessed' },
                { key: 'alertOnAdminAccess', label: 'Alert when admin accesses data', desc: 'Any admin or HR access to your records' },
                { key: 'alertOnExternalAccess', label: 'Alert on external user access', desc: 'Access by external consultants or auditors' },
              ].map(s => (
                <div key={s.key} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                  <Toggle
                    checked={privacySettings[s.key as keyof PrivacySettings] as boolean}
                    onChange={v => setPrivacySettings(p => ({ ...p, [s.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-bold text-gray-800 mb-1">Data Export Controls</p>
            <p className="text-xs text-gray-400 mb-4">Control who can export access log data</p>
            <div className="space-y-3.5">
              {[
                { key: 'allowDataExport', label: 'Allow data export', desc: 'Permit exporting access logs' },
                { key: 'requireApprovalForExport', label: 'Require admin approval for exports', desc: 'Exports need approval before download' },
              ].map(s => (
                <div key={s.key} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                  <Toggle
                    checked={privacySettings[s.key as keyof PrivacySettings] as boolean}
                    onChange={v => setPrivacySettings(p => ({ ...p, [s.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={() => setIsSettingsModalOpen(false)} className="flex-1">Save Settings</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MyDataAccessLog
