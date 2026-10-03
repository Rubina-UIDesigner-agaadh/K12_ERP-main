import React, { useCallback, useMemo, useState, Component } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { Badge } from '../../../components/ui/Badge'
import {
  Search,
  Download,
  SlidersHorizontal,
  Eye,
  FileText,
  X,
  CheckCircle,
  XCircle,
  Shield,
  Clock,
  Monitor,
  Smartphone,
  Filter,
  Fingerprint,
  AlertTriangle,
  FileDown,
  Printer,
  Calendar,
  Globe,
  RefreshCw,
  Info,
  ArrowUpDown,
  Copy,
} from 'lucide-react'
// ── Types ────────────────────────────────────────────────────
interface ConsentRecord {
  id: string
  studentName: string
  studentId: string
  applicationId: string
  parentName: string
  parentMobile: string
  parentEmail: string
  academicYear: string
  masterFranchise: string
  centre: string
  batch: string
  consentType: 'Admission Terms' | 'Privacy Policy' | 'Fee Agreement'
  version: string
  status: 'accepted' | 'not-accepted'
  checkboxLabel: string
  acceptedAt: string
  admissionDate: string
  source: 'Web' | 'Mobile'
  ipAddress: string
  tag: 'Checkbox Consent' | 'Admin Override'
  browser: string
  deviceType: string
  sessionId: string
  submittedBy: 'Parent' | 'Self' | 'Admin'
  referenceHash: string
}
const CONSENT_SNAPSHOT: Record<string, string> = {
  'Admission Terms': `TERMS & CONDITIONS FOR STUDENT ADMISSION\n\n1. GENERAL TERMS\nBy submitting this admission form, the parent(s)/guardian(s) agree to abide by all rules and policies of the institution.\n\n2. STUDENT CONDUCT\nThe student shall maintain discipline as per the institution's code of conduct.\n\n3. ACADEMIC POLICIES\nRegular attendance (minimum 75%) is mandatory. Parents acknowledge the academic calendar and grading system.\n\n4. WITHDRAWAL POLICY\nWritten notice of withdrawal must be submitted at least 30 days in advance.\n\n5. DISCLAIMER\nThe institution reserves the right to modify these terms with reasonable notice.`,
  'Privacy Policy': `PRIVACY POLICY AND DATA PROTECTION\n\n1. DATA COLLECTION\nWe collect personal information including student details, parent information, academic records, and health data.\n\n2. PURPOSE\nData is used for academic administration, communication, safety, and legal compliance.\n\n3. DATA SECURITY\nAll data is stored securely using industry-standard encryption with restricted access.\n\n4. PARENTAL RIGHTS\nParents may access, correct, or request deletion of their child's data.\n\n5. POLICY UPDATES\nThis policy may be updated periodically with notification through official channels.`,
  'Fee Agreement': `FEE POLICY AND PAYMENT AGREEMENT\n\n1. FEE STRUCTURE\nThe fee structure for the academic year has been communicated and accepted.\n\n2. PAYMENT SCHEDULE\nFees must be paid according to the specified schedule. Late payment attracts a penalty of 2% per month.\n\n3. REFUND POLICY\nRegistration fees are non-refundable. Tuition refund on withdrawal: before session 90%, within 30 days 70%, after 30 days none.\n\n4. FEE REVISION\nThe institution may revise fees with at least 60 days notice.\n\n5. ACKNOWLEDGMENT\nBy accepting, parents confirm understanding of all fee-related policies.`,
}
// ── Static Mock Data ─────────────────────────────────────────
const RECORDS: ConsentRecord[] = [
  {
    id: 'CR-2025-0001',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2025-1001',
    applicationId: 'APP-2025-1042',
    parentName: 'Rajesh Sharma',
    parentMobile: '+91 98765 43210',
    parentEmail: 'rajesh@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'Main Franchise',
    centre: 'Main Campus',
    batch: 'Morning Batch',
    consentType: 'Admission Terms',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: "I agree to the school's Terms & Conditions.",
    acceptedAt: '2025-03-21 10:32:18',
    admissionDate: '2025-03-21',
    source: 'Web',
    ipAddress: '192.168.1.45',
    tag: 'Checkbox Consent',
    browser: 'Chrome 122.0 / Windows 11',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_a7f2c9e1d4b8',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:e3b0c44298fc1c14',
  },
  {
    id: 'CR-2025-0002',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2025-1001',
    applicationId: 'APP-2025-1042',
    parentName: 'Rajesh Sharma',
    parentMobile: '+91 98765 43210',
    parentEmail: 'rajesh@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'Main Franchise',
    centre: 'Main Campus',
    batch: 'Morning Batch',
    consentType: 'Privacy Policy',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: 'I consent to data collection per the Privacy Policy.',
    acceptedAt: '2025-03-21 10:32:18',
    admissionDate: '2025-03-21',
    source: 'Web',
    ipAddress: '192.168.1.45',
    tag: 'Checkbox Consent',
    browser: 'Chrome 122.0 / Windows 11',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_a7f2c9e1d4b8',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:f4a1b55309fc2d25',
  },
  {
    id: 'CR-2025-0003',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2025-1001',
    applicationId: 'APP-2025-1042',
    parentName: 'Rajesh Sharma',
    parentMobile: '+91 98765 43210',
    parentEmail: 'rajesh@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'Main Franchise',
    centre: 'Main Campus',
    batch: 'Morning Batch',
    consentType: 'Fee Agreement',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: 'I acknowledge the fee structure and agree to pay all fees.',
    acceptedAt: '2025-03-21 10:32:18',
    admissionDate: '2025-03-21',
    source: 'Web',
    ipAddress: '192.168.1.45',
    tag: 'Checkbox Consent',
    browser: 'Chrome 122.0 / Windows 11',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_a7f2c9e1d4b8',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:d5c2e66410gd3e36',
  },
  {
    id: 'CR-2025-0004',
    studentName: 'Priya Patel',
    studentId: 'STU-2025-1002',
    applicationId: 'APP-2025-1089',
    parentName: 'Suresh Patel',
    parentMobile: '+91 87654 32109',
    parentEmail: 'suresh@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'North Region',
    centre: 'City Branch',
    batch: 'Afternoon Batch',
    consentType: 'Admission Terms',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: "I agree to the school's Terms & Conditions.",
    acceptedAt: '2025-03-21 14:15:42',
    admissionDate: '2025-03-21',
    source: 'Mobile',
    ipAddress: '10.0.2.78',
    tag: 'Checkbox Consent',
    browser: 'Safari / iOS 17.3',
    deviceType: 'Mobile Device',
    sessionId: 'sess_b8g3d0f2e5c9',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:a1b2c3d4e5f6g7h8',
  },
  {
    id: 'CR-2025-0005',
    studentName: 'Priya Patel',
    studentId: 'STU-2025-1002',
    applicationId: 'APP-2025-1089',
    parentName: 'Suresh Patel',
    parentMobile: '+91 87654 32109',
    parentEmail: 'suresh@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'North Region',
    centre: 'City Branch',
    batch: 'Afternoon Batch',
    consentType: 'Privacy Policy',
    version: 'v3.1',
    status: 'accepted',
    checkboxLabel: 'I consent to data collection per the Privacy Policy.',
    acceptedAt: '2025-03-21 14:15:42',
    admissionDate: '2025-03-21',
    source: 'Mobile',
    ipAddress: '10.0.2.78',
    tag: 'Checkbox Consent',
    browser: 'Safari / iOS 17.3',
    deviceType: 'Mobile Device',
    sessionId: 'sess_b8g3d0f2e5c9',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:h8g7f6e5d4c3b2a1',
  },
  {
    id: 'CR-2025-0006',
    studentName: 'Rohan Gupta',
    studentId: 'STU-2025-1003',
    applicationId: 'APP-2025-1103',
    parentName: 'Amit Gupta',
    parentMobile: '+91 76543 21098',
    parentEmail: 'amit@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'Main Franchise',
    centre: 'Main Campus',
    batch: 'Morning Batch',
    consentType: 'Admission Terms',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: "I agree to the school's Terms & Conditions.",
    acceptedAt: '2025-03-20 09:08:55',
    admissionDate: '2025-03-20',
    source: 'Web',
    ipAddress: '172.16.0.12',
    tag: 'Admin Override',
    browser: 'Edge 121.0 / Windows 10',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_c9h4e1g3f6d0',
    submittedBy: 'Admin',
    referenceHash: 'SHA256:i9j0k1l2m3n4o5p6',
  },
  {
    id: 'CR-2025-0007',
    studentName: 'Ananya Singh',
    studentId: 'STU-2025-1004',
    applicationId: 'APP-2025-1120',
    parentName: 'Vikram Singh',
    parentMobile: '+91 65432 10987',
    parentEmail: 'vikram@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'South Region',
    centre: 'West Wing Campus',
    batch: 'Evening Batch',
    consentType: 'Fee Agreement',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: 'I acknowledge the fee structure and agree to pay all fees.',
    acceptedAt: '2025-03-19 11:22:33',
    admissionDate: '2025-03-19',
    source: 'Web',
    ipAddress: '192.168.5.101',
    tag: 'Checkbox Consent',
    browser: 'Firefox 123.0 / Ubuntu',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_d0i5f2h4g7e1',
    submittedBy: 'Self',
    referenceHash: 'SHA256:q7r8s9t0u1v2w3x4',
  },
  {
    id: 'CR-2025-0008',
    studentName: 'Kavya Reddy',
    studentId: 'STU-2025-1005',
    applicationId: 'APP-2025-1145',
    parentName: 'Srinivas Reddy',
    parentMobile: '+91 54321 09876',
    parentEmail: 'srinivas@email.com',
    academicYear: '2024-2025',
    masterFranchise: 'Main Franchise',
    centre: 'Main Campus',
    batch: 'Morning Batch',
    consentType: 'Admission Terms',
    version: 'v3.0',
    status: 'accepted',
    checkboxLabel: "I agree to the school's Terms & Conditions.",
    acceptedAt: '2024-06-22 16:45:10',
    admissionDate: '2024-06-22',
    source: 'Web',
    ipAddress: '192.168.1.89',
    tag: 'Checkbox Consent',
    browser: 'Chrome 122.0 / Windows 11',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_e1j6g3i5h8f2',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:y5z6a7b8c9d0e1f2',
  },
  {
    id: 'CR-2025-0009',
    studentName: 'Arjun Nair',
    studentId: 'STU-2025-1006',
    applicationId: 'APP-2025-1167',
    parentName: 'Deepak Nair',
    parentMobile: '+91 43210 98765',
    parentEmail: 'deepak@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'South Region',
    centre: 'City Branch',
    batch: 'Afternoon Batch',
    consentType: 'Privacy Policy',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: 'I consent to data collection per the Privacy Policy.',
    acceptedAt: '2025-03-18 08:55:27',
    admissionDate: '2025-03-18',
    source: 'Mobile',
    ipAddress: '10.0.3.44',
    tag: 'Checkbox Consent',
    browser: 'Chrome Mobile / Android 14',
    deviceType: 'Mobile Device',
    sessionId: 'sess_f2k7h4j6i9g3',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:g3h4i5j6k7l8m9n0',
  },
  {
    id: 'CR-2025-0010',
    studentName: 'Meera Joshi',
    studentId: 'STU-2025-1007',
    applicationId: 'APP-2025-1190',
    parentName: 'Prakash Joshi',
    parentMobile: '+91 32109 87654',
    parentEmail: 'prakash@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'North Region',
    centre: 'Main Campus',
    batch: 'Morning Batch',
    consentType: 'Fee Agreement',
    version: 'v3.2',
    status: 'not-accepted',
    checkboxLabel: 'I acknowledge the fee structure and agree to pay all fees.',
    acceptedAt: '2025-03-17 13:10:05',
    admissionDate: '2025-03-17',
    source: 'Web',
    ipAddress: '192.168.2.33',
    tag: 'Checkbox Consent',
    browser: 'Safari 17.0 / macOS Sonoma',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_g3l8i5k7j0h4',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:o1p2q3r4s5t6u7v8',
  },
  {
    id: 'CR-2025-0011',
    studentName: 'Ishaan Kumar',
    studentId: 'STU-2025-1008',
    applicationId: 'APP-2025-1205',
    parentName: 'Rahul Kumar',
    parentMobile: '+91 98123 45678',
    parentEmail: 'rahul@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'Main Franchise',
    centre: 'City Branch',
    batch: 'Evening Batch',
    consentType: 'Admission Terms',
    version: 'v3.2',
    status: 'accepted',
    checkboxLabel: "I agree to the school's Terms & Conditions.",
    acceptedAt: '2025-03-21 15:30:00',
    admissionDate: '2025-03-21',
    source: 'Web',
    ipAddress: '192.168.8.22',
    tag: 'Checkbox Consent',
    browser: 'Chrome 122.0 / Windows 11',
    deviceType: 'Desktop / Web Browser',
    sessionId: 'sess_h4m9j6l8k1i5',
    submittedBy: 'Parent',
    referenceHash: 'SHA256:w9x0y1z2a3b4c5d6',
  },
  {
    id: 'CR-2025-0012',
    studentName: 'Diya Verma',
    studentId: 'STU-2025-1009',
    applicationId: 'APP-2025-1220',
    parentName: 'Neha Verma',
    parentMobile: '+91 87654 12345',
    parentEmail: 'neha@email.com',
    academicYear: '2025-2026',
    masterFranchise: 'North Region',
    centre: 'West Wing Campus',
    batch: 'Morning Batch',
    consentType: 'Fee Agreement',
    version: 'v3.1',
    status: 'accepted',
    checkboxLabel: 'I acknowledge the fee structure and agree to pay all fees.',
    acceptedAt: '2025-03-21 09:45:12',
    admissionDate: '2025-03-21',
    source: 'Mobile',
    ipAddress: '10.0.5.67',
    tag: 'Admin Override',
    browser: 'Safari / iOS 17.3',
    deviceType: 'Mobile Device',
    sessionId: 'sess_i5n0k7m9l2j6',
    submittedBy: 'Admin',
    referenceHash: 'SHA256:e7f8g9h0i1j2k3l4',
  },
]
const OPT = {
  ay: [
    {
      value: '',
      label: 'All Academic Years',
    },
    {
      value: '2025-2026',
      label: '2025-2026',
    },
    {
      value: '2024-2025',
      label: '2024-2025',
    },
  ],
  fr: [
    {
      value: '',
      label: 'All Franchises',
    },
    {
      value: 'Main Franchise',
      label: 'Main Franchise',
    },
    {
      value: 'North Region',
      label: 'North Region',
    },
    {
      value: 'South Region',
      label: 'South Region',
    },
  ],
  ct: [
    {
      value: '',
      label: 'All Centres',
    },
    {
      value: 'Main Campus',
      label: 'Main Campus',
    },
    {
      value: 'City Branch',
      label: 'City Branch',
    },
    {
      value: 'West Wing Campus',
      label: 'West Wing Campus',
    },
  ],
  ba: [
    {
      value: '',
      label: 'All Batches',
    },
    {
      value: 'Morning Batch',
      label: 'Morning Batch',
    },
    {
      value: 'Afternoon Batch',
      label: 'Afternoon Batch',
    },
    {
      value: 'Evening Batch',
      label: 'Evening Batch',
    },
  ],
  tp: [
    {
      value: '',
      label: 'All Consent Types',
    },
    {
      value: 'Admission Terms',
      label: 'Admission Terms',
    },
    {
      value: 'Privacy Policy',
      label: 'Privacy Policy',
    },
    {
      value: 'Fee Agreement',
      label: 'Fee Agreement',
    },
  ],
  vr: [
    {
      value: '',
      label: 'All Versions',
    },
    {
      value: 'v3.2',
      label: 'v3.2 (Current)',
    },
    {
      value: 'v3.1',
      label: 'v3.1',
    },
    {
      value: 'v3.0',
      label: 'v3.0',
    },
  ],
  sr: [
    {
      value: '',
      label: 'All Sources',
    },
    {
      value: 'Web',
      label: 'Web Admission Form',
    },
    {
      value: 'Mobile',
      label: 'Mobile Admission Form',
    },
  ],
  st: [
    {
      value: '',
      label: 'All Statuses',
    },
    {
      value: 'accepted',
      label: 'Accepted',
    },
    {
      value: 'not-accepted',
      label: 'Not Accepted',
    },
  ],
  tg: [
    {
      value: '',
      label: 'All Tags',
    },
    {
      value: 'Checkbox Consent',
      label: 'Checkbox Consent',
    },
    {
      value: 'Admin Override',
      label: 'Admin Override',
    },
  ],
}
// ── Main Component ───────────────────────────────────────────
export function ConsentLogs() {
  const [globalSearch, setGlobalSearch] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selected, setSelected] = useState<ConsentRecord | null>(null)
  const [quickFilter, setQuickFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState('acceptedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const perPage = 10
  const [fAy, setFAy] = useState('')
  const [fFr, setFFr] = useState('')
  const [fCt, setFCt] = useState('')
  const [fBa, setFBa] = useState('')
  const [fTp, setFTp] = useState('')
  const [fVr, setFVr] = useState('')
  const [fSr, setFSr] = useState('')
  const [fSt, setFSt] = useState('')
  const [fTg, setFTg] = useState('')
  const filtered = useMemo(() => {
    let r = [...RECORDS]
    if (globalSearch) {
      const q = globalSearch.toLowerCase()
      r = r.filter(
        (x) =>
          x.studentName.toLowerCase().includes(q) ||
          x.parentName.toLowerCase().includes(q) ||
          x.applicationId.toLowerCase().includes(q) ||
          x.parentMobile.includes(q),
      )
    }
    if (fAy) r = r.filter((x) => x.academicYear === fAy)
    if (fFr) r = r.filter((x) => x.masterFranchise === fFr)
    if (fCt) r = r.filter((x) => x.centre === fCt)
    if (fBa) r = r.filter((x) => x.batch === fBa)
    if (fTp) r = r.filter((x) => x.consentType === fTp)
    if (fVr) r = r.filter((x) => x.version === fVr)
    if (fSr) r = r.filter((x) => x.source === fSr)
    if (fSt) r = r.filter((x) => x.status === fSt)
    if (fTg) r = r.filter((x) => x.tag === fTg)
    if (quickFilter === 'today')
      r = r.filter((x) => x.acceptedAt.startsWith('2025-03-21'))
    if (quickFilter === 'recent')
      r = r.filter((x) => x.acceptedAt >= '2025-03-18')
    if (quickFilter === 'fee-agreement')
      r = r.filter((x) => x.consentType === 'Fee Agreement')
    if (quickFilter === 'admin-override')
      r = r.filter((x) => x.tag === 'Admin Override')
    r.sort((a, b) => {
      const av = a[sortField as keyof ConsentRecord] || ''
      const bv = b[sortField as keyof ConsentRecord] || ''
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1
    })
    return r
  }, [
    globalSearch,
    fAy,
    fFr,
    fCt,
    fBa,
    fTp,
    fVr,
    fSr,
    fSt,
    fTg,
    quickFilter,
    sortField,
    sortDir,
  ])
  const totalPages = Math.ceil(filtered.length / perPage)
  const pageData = filtered.slice((page - 1) * perPage, page * perPage)
  const stats = useMemo(
    () => ({
      total: RECORDS.length,
      today: RECORDS.filter((r) => r.acceptedAt.startsWith('2025-03-21'))
        .length,
      accepted: RECORDS.filter((r) => r.status === 'accepted').length,
      web: RECORDS.filter((r) => r.source === 'Web').length,
      mobile: RECORDS.filter((r) => r.source === 'Mobile').length,
      override: RECORDS.filter((r) => r.tag === 'Admin Override').length,
    }),
    [],
  )
  const clearAll = () => {
    setFAy('')
    setFFr('')
    setFCt('')
    setFBa('')
    setFTp('')
    setFVr('')
    setFSr('')
    setFSt('')
    setFTg('')
    setQuickFilter('all')
    setGlobalSearch('')
    setPage(1)
  }
  const handleSort = (f: string) => {
    if (sortField === f) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortField(f)
      setSortDir('desc')
    }
  }
  const SortHeader = ({
    field,
    children,
  }: {
    field: string
    children: React.ReactNode
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children} <ArrowUpDown className="w-3 h-3 opacity-40" />
      </span>
    </th>
  )
  return (
    <div className="p-6 max-w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" /> Admission Consent Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all consents accepted via admission form checkbox
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, ID, mobile..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Filters'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          {
            label: 'Total',
            value: stats.total,
            color: 'bg-blue-50 text-blue-700',
            icon: <FileText className="w-4 h-4" />,
          },
          {
            label: 'Today',
            value: stats.today,
            color: 'bg-green-50 text-green-700',
            icon: <Calendar className="w-4 h-4" />,
          },
          {
            label: 'Accepted',
            value: stats.accepted,
            color: 'bg-emerald-50 text-emerald-700',
            icon: <CheckCircle className="w-4 h-4" />,
          },
          {
            label: 'Web',
            value: stats.web,
            color: 'bg-purple-50 text-purple-700',
            icon: <Monitor className="w-4 h-4" />,
          },
          {
            label: 'Mobile',
            value: stats.mobile,
            color: 'bg-pink-50 text-pink-700',
            icon: <Smartphone className="w-4 h-4" />,
          },
          {
            label: 'Override',
            value: stats.override,
            color: 'bg-red-50 text-red-700',
            icon: <Shield className="w-4 h-4" />,
          },
        ].map((s) => (
          <Card key={s.label} className="p-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Global ERP Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            Global ERP Filters
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select
            label="Academic Year"
            options={OPT.ay}
            value={fAy}
            onChange={(v) => {
              setFAy(typeof v === 'string' ? v : v.target.value)
              setPage(1)
            }}
          />
          <Select
            label="Master Franchise"
            options={OPT.fr}
            value={fFr}
            onChange={(v) => {
              setFFr(typeof v === 'string' ? v : v.target.value)
              setPage(1)
            }}
          />
          <Select
            label="Centre / Branch"
            options={OPT.ct}
            value={fCt}
            onChange={(v) => {
              setFCt(typeof v === 'string' ? v : v.target.value)
              setPage(1)
            }}
          />
          <Select
            label="Batch"
            options={OPT.ba}
            value={fBa}
            onChange={(v) => {
              setFBa(typeof v === 'string' ? v : v.target.value)
              setPage(1)
            }}
          />
        </div>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-500" /> Advanced Filters
            </span>
            <button
              onClick={() => {
                setFTp('')
                setFVr('')
                setFSr('')
                setFSt('')
                setFTg('')
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select
              label="Consent Type"
              options={OPT.tp}
              value={fTp}
              onChange={(v) => {
                setFTp(typeof v === 'string' ? v : v.target.value)
                setPage(1)
              }}
            />
            <Select
              label="Version"
              options={OPT.vr}
              value={fVr}
              onChange={(v) => {
                setFVr(typeof v === 'string' ? v : v.target.value)
                setPage(1)
              }}
            />
            <Select
              label="Source"
              options={OPT.sr}
              value={fSr}
              onChange={(v) => {
                setFSr(typeof v === 'string' ? v : v.target.value)
                setPage(1)
              }}
            />
            <Select
              label="Status"
              options={OPT.st}
              value={fSt}
              onChange={(v) => {
                setFSt(typeof v === 'string' ? v : v.target.value)
                setPage(1)
              }}
            />
            <Select
              label="Tag"
              options={OPT.tg}
              value={fTg}
              onChange={(v) => {
                setFTg(typeof v === 'string' ? v : v.target.value)
                setPage(1)
              }}
            />
          </div>
        </Card>
      )}

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">
          Quick:
        </span>
        {[
          {
            key: 'all',
            label: 'All Records',
          },
          {
            key: 'today',
            label: "Today's Consents",
          },
          {
            key: 'recent',
            label: 'Recent (3 days)',
          },
          {
            key: 'fee-agreement',
            label: 'Fee Agreement',
          },
          {
            key: 'admin-override',
            label: 'Admin Override',
          },
        ].map((qf) => (
          <button
            key={qf.key}
            onClick={() => {
              setQuickFilter(qf.key)
              setPage(1)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${quickFilter === qf.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {qf.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500">
          {filtered.length} records
        </span>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Admission Consent Records
          </h2>
          <Badge variant="info">{filtered.length} Records</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortHeader field="studentName">Student</SortHeader>
                <SortHeader field="applicationId">App ID</SortHeader>
                <SortHeader field="parentName">Parent</SortHeader>
                <SortHeader field="centre">Centre</SortHeader>
                <SortHeader field="consentType">Consent Type</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ver
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <SortHeader field="acceptedAt">Accepted At</SortHeader>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageData.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {r.studentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-mono whitespace-nowrap">
                    {r.applicationId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {r.parentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {r.centre}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        r.consentType === 'Fee Agreement'
                          ? 'warning'
                          : r.consentType === 'Privacy Policy'
                            ? 'info'
                            : 'primary'
                      }
                    >
                      {r.consentType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                    {r.version}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {r.status === 'accepted' ? (
                      <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Not Accepted
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {r.acceptedAt}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      {r.source === 'Web' ? (
                        <Monitor className="w-3.5 h-3.5" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5" />
                      )}
                      {r.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        r.tag === 'Admin Override' ? 'danger' : 'secondary'
                      }
                      className="text-[11px]"
                    >
                      {r.tag}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelected(r)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Download Proof"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelected(r)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                        title="View Consent Text"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No consent records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {page} of {totalPages || 1} ({filtered.length} records)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Consent Record Details
                </h2>
                <p className="text-sm text-gray-500 font-mono">{selected.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileDown className="w-4 h-4 mr-1" /> PDF
                </Button>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Section 1: Admission Info */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" /> Admission
                  Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Student Name
                    </span>
                    <span className="font-medium text-gray-900">
                      {selected.studentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Student ID
                    </span>
                    <span className="font-medium font-mono text-gray-900">
                      {selected.studentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Application ID
                    </span>
                    <span className="font-medium font-mono text-blue-600">
                      {selected.applicationId}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Parent / Guardian
                    </span>
                    <span className="font-medium text-gray-900">
                      {selected.parentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Mobile</span>
                    <span className="font-medium text-gray-900">
                      {selected.parentMobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Email</span>
                    <span className="font-medium text-gray-900">
                      {selected.parentEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Academic Year
                    </span>
                    <span className="font-medium text-gray-900">
                      {selected.academicYear}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Centre / Branch
                    </span>
                    <span className="font-medium text-gray-900">
                      {selected.centre}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Submitted By
                    </span>
                    <span className="font-medium text-gray-900">
                      {selected.submittedBy}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Admission Date
                    </span>
                    <span className="font-medium text-gray-900">
                      {selected.admissionDate}
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 2: Checkbox Consent Capture */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Checkbox
                  Consent Capture
                </h3>
                <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Checkbox Label Shown to User
                    </span>
                    <p className="text-sm text-gray-900 bg-white p-3 rounded border border-gray-200 italic">
                      "{selected.checkboxLabel}"
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-green-700 mt-1">
                        <CheckCircle className="w-4 h-4" />{' '}
                        {selected.status === 'accepted'
                          ? 'Accepted'
                          : 'Not Accepted'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Method
                      </span>
                      <span className="font-medium text-gray-900">
                        Checkbox Selection
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Source Tag
                      </span>
                      <Badge
                        variant={
                          selected.tag === 'Admin Override'
                            ? 'danger'
                            : 'success'
                        }
                      >
                        {selected.tag}
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Consent Text Snapshot */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" /> Consent Text
                  Snapshot
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Badge variant="primary">{selected.consentType}</Badge>
                      <Badge variant="outline">
                        Version {selected.version}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Effective:{' '}
                      {selected.academicYear === '2025-2026'
                        ? 'Jan 01, 2025'
                        : 'Jan 01, 2024'}
                    </span>
                  </div>
                  <div className="p-4 max-h-48 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {CONSENT_SNAPSHOT[selected.consentType]}
                    </pre>
                  </div>
                  <div className="bg-amber-50 px-4 py-2 border-t border-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-xs text-amber-800 font-medium">
                      Immutable snapshot captured at the time of consent.
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 4: Legal Metadata */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" /> Legal Metadata
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Accepted At
                    </span>
                    <span className="font-mono text-gray-900">
                      {selected.acceptedAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      IP Address
                    </span>
                    <span className="font-mono text-gray-900">
                      {selected.ipAddress}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Device Type
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-900">
                      {selected.source === 'Web' ? (
                        <Monitor className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                      {selected.deviceType}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Browser</span>
                    <span className="text-gray-900">{selected.browser}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Session ID
                    </span>
                    <span className="font-mono text-gray-500">
                      {selected.sessionId}
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 5: Proof Block */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-red-500" /> Proof &
                  Verification
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Consent Record ID
                      </span>
                      <span className="font-mono font-bold text-gray-900">
                        {selected.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        System Reference Hash
                      </span>
                      <span className="font-mono text-gray-600">
                        {selected.referenceHash}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-3">
                    <p className="text-xs text-gray-600 italic leading-relaxed">
                      "This consent was captured via checkbox selection during
                      admission form submission and recorded by the system. This
                      record is immutable and serves as legal proof of consent."
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="primary" size="sm">
                      <FileDown className="w-4 h-4 mr-1" /> Download Proof PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-1" /> Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(selected.id)}
                    >
                      <Copy className="w-4 h-4 mr-1" /> Copy ID
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsentLogs
