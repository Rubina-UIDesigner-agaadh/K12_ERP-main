// ExpenseRequest.tsx - Department Expense Requests Management Page
import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
  Check,
  X,
  FileCheck,
  Send,
  Building2,
  Calendar,
  Layers,
  RotateCcw,
  Paperclip,
  ArrowRight,
  Repeat,
  PlayCircle,
  PauseCircle,
  Edit2,
  Save,
  ShieldCheck,
  Zap
} from 'lucide-react';

export interface ExpenseRequestItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estRate: number;
  estAmount: number;
}

export type ExpensePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ExpenseRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ExpenseRequestRecord {
  id: string;
  requestNo: string;
  requestDate: string;
  fy: string;
  department: string;
  requestedBy: string;
  designation: string;
  category: string;
  expenseHead: string;
  description: string;
  items: ExpenseRequestItem[];
  totalAmount: number;
  priority: ExpensePriority;
  requiredByDate: string;
  preferredVendor?: string;
  supportingDoc?: string;
  status: ExpenseRequestStatus;
  rejectionReason?: string;
}

const INITIAL_REQUESTS: ExpenseRequestRecord[] = [
  {
    id: 'req_001',
    requestNo: 'EXP-REQ-001',
    requestDate: '27-Sep-2025',
    fy: 'FY 2025-26',
    department: 'Admin',
    requestedBy: 'Mr. Verma',
    designation: 'HOD / Department Head',
    category: 'Stationery',
    expenseHead: 'EXP-OFF-002 — Office Stationery',
    description: 'Quarterly office stationery requirements for examinations and administration.',
    items: [
      { id: '1', name: 'A4 Paper Reams', quantity: 50, unit: 'Reams', estRate: 250, estAmount: 12500 },
      { id: '2', name: 'Whiteboard Marker', quantity: 100, unit: 'Nos.', estRate: 30, estAmount: 3000 }
    ],
    totalAmount: 15500,
    priority: 'Medium',
    requiredByDate: '15-Oct-2025',
    preferredVendor: 'XYZ Stationers',
    status: 'Pending'
  },
  {
    id: 'req_002',
    requestNo: 'EXP-REQ-002',
    requestDate: '26-Sep-2025',
    fy: 'FY 2025-26',
    department: 'Science',
    requestedBy: 'Ms. Joshi',
    designation: 'HOD — Science Department',
    category: 'Lab Equipment',
    expenseHead: 'EXP-LAB-001 — Lab Chemicals & Instruments',
    description: 'Advanced laboratory microscopes and stands for Senior Secondary Biology lab practicals.',
    items: [
      { id: '1', name: 'Microscope (Lab Grade)', quantity: 10, unit: 'Nos.', estRate: 7500, estAmount: 75000 },
      { id: '2', name: 'Lab Stand & Clamp Set', quantity: 20, unit: 'Sets', estRate: 500, estAmount: 10000 }
    ],
    totalAmount: 85000,
    priority: 'High',
    requiredByDate: '15-Oct-2025',
    preferredVendor: 'ABC Supplies Ltd',
    status: 'Approved'
  },
  {
    id: 'req_003',
    requestNo: 'EXP-REQ-003',
    requestDate: '25-Sep-2025',
    fy: 'FY 2025-26',
    department: 'Sports',
    requestedBy: 'Mr. Singh',
    designation: 'Sports Director',
    category: 'Sports Equipment',
    expenseHead: 'EXP-SPT-001 — Sports Equipment & Kits',
    description: 'Annual inter-school tournament sporting kits and gear for football and basketball teams.',
    items: [
      { id: '1', name: 'Football (Match Grade)', quantity: 15, unit: 'Nos.', estRate: 1000, estAmount: 15000 },
      { id: '2', name: 'Basketballs (Size 7)', quantity: 10, unit: 'Nos.', estRate: 1000, estAmount: 10000 }
    ],
    totalAmount: 25000,
    priority: 'Medium',
    requiredByDate: '10-Oct-2025',
    preferredVendor: 'SportsPro Pvt Ltd',
    status: 'Approved'
  },
  {
    id: 'req_004',
    requestNo: 'EXP-REQ-004',
    requestDate: '24-Sep-2025',
    fy: 'FY 2025-26',
    department: 'Computer Lab',
    requestedBy: 'Ms. Roy',
    designation: 'IT Head',
    category: 'IT Equipment',
    expenseHead: 'EXP-IT-005 — IT Equipment & Hardware',
    description: 'Upgradation of monitors and RAM in Senior Computer Lab.',
    items: [
      { id: '1', name: '24-inch IPS LED Monitors', quantity: 15, unit: 'Nos.', estRate: 8000, estAmount: 120000 }
    ],
    totalAmount: 120000,
    priority: 'High',
    requiredByDate: '01-Nov-2025',
    preferredVendor: 'TechWorld Pvt Ltd',
    status: 'Rejected',
    rejectionReason: 'Exceeds remaining Q3 departmental capital budget allocation. Please re-submit in Q4.'
  },
  {
    id: 'req_005',
    requestNo: 'EXP-REQ-005',
    requestDate: '27-Sep-2025',
    fy: 'FY 2025-26',
    department: 'Admin',
    requestedBy: 'Mr. Kumar',
    designation: 'Estate & Facility Officer',
    category: 'Maintenance',
    expenseHead: 'EXP-BLD-008 — Building Maintenance & Repairs',
    description: 'Urgent plumbing overhaul in North Wing washrooms and replacement of main booster valve.',
    items: [
      { id: '1', name: 'Booster Pump Valve & Fittings', quantity: 1, unit: 'Set', estRate: 35000, estAmount: 35000 }
    ],
    totalAmount: 35000,
    priority: 'Urgent',
    requiredByDate: '30-Sep-2025',
    status: 'Pending'
  }
];

// ============================================================================
// RECURRING EXPENSE RULES (merged from Recurring Expense Scheduler)
// ============================================================================
export interface RecurringRule {
  id: string;
  ruleNo: string;
  title: string;
  linkedRequest?: string;
  vendor: string;
  vendorCode: string;
  expenseHead: string;
  expenseCode: string;
  description: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly' | 'Custom';
  customDays?: number;
  nextDueDate: string;
  startDate: string;
  endDate?: string;
  actionType: 'Auto-Voucher' | 'Reminder Only' | 'Auto-Payment';
  status: 'Active' | 'Paused' | 'Expired';
  reminderDays: number;
  notifyVia: string[];
  department: string;
  costCenter: string;
  lastExecuted?: string;
  executionCount: number;
  totalAmountProcessed: number;
  createdBy: string;
  notes: string;
}

const RECURRING_FREQUENCIES = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'Custom'] as const;
const RECURRING_ACTIONS = ['Auto-Voucher', 'Reminder Only', 'Auto-Payment'] as const;
const RECURRING_DEPARTMENTS = ['Admin', 'Science Lab', 'IT', 'Library', 'Transport', 'Hostel', 'Sports', 'Accounts'];
const RECURRING_COST_CENTERS = ['CC-ADM-01', 'CC-LAB-01', 'CC-IT-01', 'CC-LIB-01', 'CC-TRN-01', 'CC-ACC-01'];
const RECURRING_VENDORS = [
  'ABC Stationers',
  'City Power Corp',
  'Global Tech Solutions',
  'Fresh Foods Catering',
  'Office Mart India',
  'SecureLife Insurance Co.'
];

const INITIAL_RECURRING_RULES: RecurringRule[] = [
  {
    id: 'rr_001',
    ruleNo: 'REC-2025-001',
    title: 'Monthly Electricity Charges',
    vendor: 'City Power Corp',
    vendorCode: 'VND-2025-002',
    expenseHead: 'Electricity Charges',
    expenseCode: 'EXP-UTL-003',
    description: 'Monthly electricity bill for main building and science block',
    amount: 14750,
    frequency: 'Monthly',
    nextDueDate: '2025-10-05',
    startDate: '2025-04-01',
    actionType: 'Auto-Voucher',
    status: 'Active',
    reminderDays: 3,
    notifyVia: ['email', 'push'],
    department: 'Admin',
    costCenter: 'CC-ADM-01',
    lastExecuted: '2025-09-05',
    executionCount: 6,
    totalAmountProcessed: 88500,
    createdBy: 'Accounts Officer',
    notes: 'Reading captured from meter log on the 1st of every month.'
  },
  {
    id: 'rr_002',
    ruleNo: 'REC-2025-002',
    title: 'Quarterly Internet & Broadband',
    vendor: 'Global Tech Solutions',
    vendorCode: 'VND-2025-003',
    expenseHead: 'IT Maintenance',
    expenseCode: 'EXP-IT-005',
    description: 'ERP hosting, broadband and firewall subscription renewal',
    amount: 35400,
    frequency: 'Quarterly',
    nextDueDate: '2025-10-10',
    startDate: '2025-01-10',
    actionType: 'Auto-Payment',
    status: 'Active',
    reminderDays: 7,
    notifyVia: ['email'],
    department: 'IT',
    costCenter: 'CC-IT-01',
    lastExecuted: '2025-07-10',
    executionCount: 3,
    totalAmountProcessed: 106200,
    createdBy: 'IT Coordinator',
    notes: 'Paid by NEFT under PO-2025-0203 vendor agreement.'
  },
  {
    id: 'rr_003',
    ruleNo: 'REC-2025-003',
    title: 'Hostel Mess Supplies (Monthly)',
    vendor: 'Fresh Foods Catering',
    vendorCode: 'VND-2025-004',
    expenseHead: 'Event Refreshments',
    expenseCode: 'EXP-EVT-004',
    description: 'Groceries and consumables for hostel mess',
    amount: 96000,
    frequency: 'Monthly',
    nextDueDate: '2025-10-01',
    startDate: '2025-06-01',
    actionType: 'Auto-Voucher',
    status: 'Active',
    reminderDays: 2,
    notifyVia: ['email', 'sms'],
    department: 'Hostel',
    costCenter: 'CC-ADM-01',
    lastExecuted: '2025-09-01',
    executionCount: 4,
    totalAmountProcessed: 384000,
    createdBy: 'Hostel Warden',
    notes: 'GRN is mandatory before voucher posting.'
  },
  {
    id: 'rr_004',
    ruleNo: 'REC-2025-004',
    title: 'Annual Insurance Premium Reminder',
    vendor: 'SecureLife Insurance Co.',
    vendorCode: 'VND-2025-090',
    expenseHead: 'Insurance Premium',
    expenseCode: 'EXP-INS-011',
    description: 'Group insurance premium for students and staff',
    amount: 92040,
    frequency: 'Yearly',
    nextDueDate: '2025-11-15',
    startDate: '2024-11-15',
    actionType: 'Reminder Only',
    status: 'Active',
    reminderDays: 15,
    notifyVia: ['email'],
    department: 'Accounts',
    costCenter: 'CC-ACC-01',
    lastExecuted: '2024-11-15',
    executionCount: 1,
    totalAmountProcessed: 92040,
    createdBy: 'Accounts Officer',
    notes: 'Insurance is renewed only after trustee approval.'
  },
  {
    id: 'rr_005',
    ruleNo: 'REC-2025-005',
    title: 'Transport Diesel & Trips (Half-Yearly)',
    vendor: 'ABC Stationers',
    vendorCode: 'VND-2025-014',
    expenseHead: 'Transport & Logistics',
    expenseCode: 'EXP-TRN-007',
    description: 'Bus diesel, driver allowance and interstate trip charges',
    amount: 168000,
    frequency: 'Half-Yearly',
    nextDueDate: '2025-12-01',
    startDate: '2025-06-01',
    actionType: 'Auto-Voucher',
    status: 'Paused',
    reminderDays: 5,
    notifyVia: ['email'],
    department: 'Transport',
    costCenter: 'CC-TRN-01',
    lastExecuted: '2025-06-01',
    executionCount: 1,
    totalAmountProcessed: 168000,
    createdBy: 'Transport In-charge',
    notes: 'Paused until the new transport contract is signed.'
  },
  {
    id: 'rr_006',
    ruleNo: 'REC-2025-006',
    title: 'Lab Consumables Restock',
    vendor: 'Office Mart India',
    vendorCode: 'VND-2025-005',
    expenseHead: 'Lab Chemicals',
    expenseCode: 'EXP-LAB-001',
    description: 'Chemicals, glassware and reagents for science labs',
    amount: 42500,
    frequency: 'Custom',
    customDays: 45,
    nextDueDate: '2025-10-20',
    startDate: '2025-05-20',
    actionType: 'Auto-Voucher',
    status: 'Active',
    reminderDays: 4,
    notifyVia: ['push'],
    department: 'Science Lab',
    costCenter: 'CC-LAB-01',
    lastExecuted: '2025-09-05',
    executionCount: 3,
    totalAmountProcessed: 127500,
    createdBy: 'Lab Assistant',
    notes: 'Custom 45-day cycle aligned with practical exam schedule.'
  }
];

const APPROVAL_STAGES = ['HOD / Department Head', 'Finance Verification', 'Management Approval'];

const nextDueLabel = (rule: RecurringRule) => {
  const due = Date.parse(rule.nextDueDate);
  if (Number.isNaN(due)) return '—';
  const days = Math.round((due - Date.parse(new Date().toISOString().slice(0, 10))) / 86400000);
  if (days < 0) return `Overdue by ${Math.abs(days)} day(s)`;
  if (days === 0) return 'Due today';
  return `in ${days} day(s)`;
};

const advanceDate = (iso: string, frequency: RecurringRule['frequency'], customDays?: number) => {
  const d = new Date(iso || new Date().toISOString().slice(0, 10));
  if (frequency === 'Monthly') d.setMonth(d.getMonth() + 1);
  else if (frequency === 'Quarterly') d.setMonth(d.getMonth() + 3);
  else if (frequency === 'Half-Yearly') d.setMonth(d.getMonth() + 6);
  else if (frequency === 'Yearly') d.setFullYear(d.getFullYear() + 1);
  else d.setDate(d.getDate() + (customDays || 30));
  return d.toISOString().slice(0, 10);
};

export function ExpenseRequest() {
  const [requests, setRequests] = useState<ExpenseRequestRecord[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewRequest, setViewRequest] = useState<ExpenseRequestRecord | null>(null);
  const [rejectModalReq, setRejectModalReq] = useState<ExpenseRequestRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Unified page tabs: requests · approval workflow · recurring rules
  const [activeTab, setActiveTab] = useState<'requests' | 'approval' | 'recurring'>('requests');
  const [rules, setRules] = useState<RecurringRule[]>(INITIAL_RECURRING_RULES);
  const [stageMap, setStageMap] = useState<Record<string, number>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const totalCount = 145; // Display KPI standard requested by spec
  const pendingCount = requests.filter((r) => r.status === 'Pending').length + 26; // 28
  const approvedCount = requests.filter((r) => r.status === 'Approved').length + 93; // 95
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length + 21; // 22
  const totalRequestedAmount = 1250000; // ₹12,50,000

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (departmentFilter !== 'All' && req.department !== departmentFilter) return false;
      if (statusFilter !== 'All' && req.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && req.priority !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m =
          req.requestNo.toLowerCase().includes(q) ||
          req.requestedBy.toLowerCase().includes(q) ||
          req.category.toLowerCase().includes(q) ||
          req.department.toLowerCase().includes(q) ||
          req.description.toLowerCase().includes(q);
        if (!m) return false;
      }
      return true;
    });
  }, [requests, departmentFilter, statusFilter, priorityFilter, searchQuery]);

  // Actions
  const handleApprove = (req: ExpenseRequestRecord) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Approved' as ExpenseRequestStatus } : r))
    );
    showToast(`Request ${req.requestNo} approved successfully.`);
  };

  const handleConfirmReject = () => {
    if (!rejectModalReq) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === rejectModalReq.id
          ? {
              ...r,
              status: 'Rejected' as ExpenseRequestStatus,
              rejectionReason: rejectReason || 'Budget or policy criteria not met'
            }
          : r
      )
    );
    showToast(`Request ${rejectModalReq.requestNo} rejected.`);
    setRejectModalReq(null);
    setRejectReason('');
  };

  // ---- approval workflow (stage-wise) ----
  const handleAdvanceStage = (req: ExpenseRequestRecord) => {
    const current = stageMap[req.id] ?? 0;
    if (current >= APPROVAL_STAGES.length - 1) {
      handleApprove(req);
      showToast(`${req.requestNo} fully approved at ${APPROVAL_STAGES[current]} stage.`);
      return;
    }
    setStageMap((prev) => ({ ...prev, [req.id]: current + 1 }));
    showToast(`${req.requestNo} forwarded to ${APPROVAL_STAGES[current + 1]}.`);
  };

  const handleBulkApprove = (ids: string[]) => {
    ids.forEach((id) => {
      const req = requests.find((r) => r.id === id);
      if (req) handleApprove(req);
    });
    showToast(`${ids.length} request(s) approved in bulk.`);
  };

  const handleBulkReject = (ids: string[]) => {
    setRequests((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: 'Rejected' as ExpenseRequestStatus,
              rejectionReason: 'Bulk rejected — budget or policy criteria not met'
            }
          : r
      )
    );
    showToast(`${ids.length} request(s) rejected in bulk.`);
  };

  // ---- recurring rules ----
  const handleCreateRule = (rule: RecurringRule) => {
    setRules((prev) => [rule, ...prev]);
    showToast(`Recurring rule ${rule.ruleNo} created (${rule.frequency} · ₹${rule.amount.toLocaleString('en-IN')}).`);
  };

  const handleUpdateRule = (rule: RecurringRule) => {
    setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
    showToast(`Recurring rule ${rule.ruleNo} updated.`);
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Recurring rule deleted.');
  };

  const handleToggleRule = (rule: RecurringRule) => {
    const next = rule.status === 'Active' ? 'Paused' : 'Active';
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, status: next } : r)));
    showToast(`${rule.ruleNo} ${next === 'Active' ? 'resumed' : 'paused'}.`);
  };

  const handleRunRule = (rule: RecurringRule) => {
    const today = new Date().toISOString().slice(0, 10);
    setRules((prev) =>
      prev.map((r) =>
        r.id === rule.id
          ? {
              ...r,
              lastExecuted: today,
              executionCount: r.executionCount + 1,
              totalAmountProcessed: r.totalAmountProcessed + r.amount,
              nextDueDate: advanceDate(r.nextDueDate, r.frequency, r.customDays)
            }
          : r
      )
    );
    showToast(
      `${rule.ruleNo} executed — ${rule.actionType === 'Reminder Only' ? 'reminder sent' : 'voucher generated'} for ₹${rule.amount.toLocaleString('en-IN')}.`
    );
  };

  const pushRequest = (req: ExpenseRequestRecord) => {
    setRequests((prev) => [req, ...prev]);
    return req;
  };

  const buildRequestFromRule = (rule: RecurringRule): ExpenseRequestRecord => ({
    id: `req_${Date.now()}`,
    requestNo: `EXP-REQ-2025-${String(Math.floor(1000 + Math.random() * 8999))}`,
    requestDate: new Date().toISOString().slice(0, 10),
    fy: 'FY 2025-26',
    department: rule.department,
    requestedBy: 'Accounts Officer',
    designation: 'Accounts',
    category: rule.expenseHead,
    expenseHead: `${rule.expenseCode} — ${rule.expenseHead}`,
    description: `${rule.title} — raised from recurring rule ${rule.ruleNo}`,
    items: [
      {
        id: '1',
        name: rule.expenseHead,
        quantity: 1,
        unit: 'Lot',
        estRate: rule.amount,
        estAmount: rule.amount
      }
    ],
    totalAmount: rule.amount,
    priority: 'Medium',
    requiredByDate: rule.nextDueDate,
    preferredVendor: rule.vendor,
    supportingDoc: `Recurring rule ${rule.ruleNo}`,
    status: 'Pending'
  });

  const handleRuleToRequest = (rule: RecurringRule) => {
    const req = pushRequest(buildRequestFromRule(rule));
    setActiveTab('requests');
    showToast(`${req.requestNo} created from recurring rule ${rule.ruleNo}.`);
  };

  const handleMakeRecurring = (req: ExpenseRequestRecord) => {
    const rule: RecurringRule = {
      id: `rr_${Date.now()}`,
      ruleNo: `REC-2025-${String(Math.floor(100 + Math.random() * 899))}`,
      title: `Recurring ${req.category} — ${req.department}`,
      linkedRequest: req.requestNo,
      vendor: req.preferredVendor || RECURRING_VENDORS[0],
      vendorCode: 'VND-2025-014',
      expenseHead: req.category,
      expenseCode: req.expenseHead.split(' — ')[0],
      description: req.description,
      amount: req.totalAmount,
      frequency: 'Monthly',
      nextDueDate: req.requiredByDate || advanceDate(new Date().toISOString().slice(0, 10), 'Monthly'),
      startDate: req.requestDate,
      actionType: 'Auto-Voucher',
      status: 'Active',
      reminderDays: 3,
      notifyVia: ['email'],
      department: req.department,
      costCenter: 'CC-ADM-01',
      executionCount: 0,
      totalAmountProcessed: 0,
      createdBy: req.requestedBy,
      notes: `Auto-created from approved expense request ${req.requestNo}.`
    };
    setRules((prev) => [rule, ...prev]);
    setActiveTab('recurring');
    showToast(`Recurring rule ${rule.ruleNo} created from ${req.requestNo}.`);
  };

  const handleExport = () => {
    const csvContent =
      'Request No,Requested By,Category,Department,Amount,Priority,Status,Date\n' +
      filteredRequests
        .map(
          (r) =>
            `${r.requestNo},"${r.requestedBy}","${r.category}","${r.department}",${r.totalAmount},${r.priority},${r.status},${r.requestDate}`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Expense_Requests_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported expense requests report to CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🔝 HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-blue-600 font-medium">Expenses</span>
            <span>&gt;</span>
            <span className="text-gray-800 font-semibold">Expense Request</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Expense Request <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"> FY: 2025-26 </Badge>
              </h1>
              <p className="text-xs text-gray-500">
                Department heads raise formal requests to spend money before procurement
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-gray-700 text-xs"
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button
            size="sm"
            onClick={() => setShowNewModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" /> ➕ New Expense Request
          </Button>
        </div>
      </div>

      {/* 🔀 UNIFIED PAGE TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'requests', label: 'One-Time Expenses', icon: FileText, hint: 'Single purchase requests' },
          { id: 'recurring', label: 'Recurring Expenses', icon: Repeat, hint: `${rules.length} active rules` },
          { id: 'approval', label: 'Approval Queue', icon: ShieldCheck, hint: 'HOD → Finance → Management' }
        ].map((tab) => {
          const Icon = tab.icon;
          const on = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                on ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-[10px] font-medium ${on ? 'text-indigo-100' : 'text-gray-400'}`}>
                {tab.hint}
              </span>
            </button>
          );
        })}
      </div>

      {/* 📊 SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total Requests */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          <div className="text-[11px] text-gray-500 mt-1">Across all school departments</div>
        </Card>

        {/* Pending Approval */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approval</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Awaiting HOD / Finance review</div>
        </Card>

        {/* Approved Requests */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Requests</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{approvedCount}</div>
          <div className="text-[11px] text-gray-500 mt-1">Ready for Purchase Order (PO)</div>
        </Card>

        {/* Rejected Requests */}
        <Card className="p-4 bg-gradient-to-br from-rose-50 to-white border-rose-100 shadow-sm">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Rejected Requests</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{rejectedCount}</div>
          <div className="text-[11px] text-gray-500 mt-1">Disapproved or over-budget</div>
        </Card>

        {/* Total Requested Amount */}
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requested Amount</span>
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-indigo-900">₹12,50,000</div>
          <div className="text-[11px] text-gray-500 mt-1">Cumulative FY budget pipeline</div>
        </Card>
      </div>

      {activeTab === 'requests' && (
        <>
      {/* 🔍 FILTERS BAR */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request no, requester, category, department..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Admin">Admin</option>
              <option value="Science">Science</option>
              <option value="Sports">Sports</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Library">Library</option>
              <option value="Hostel">Hostel</option>
              <option value="Transport">Transport</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('All');
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4 text-gray-500 hover:text-gray-800" />
            </Button>
          </div>
        </div>
      </Card>

      {/* 📋 EXPENSE REQUEST TABLE */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">Request No.</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Category</th>
                <th className="p-3">Department</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req, index) => {
                const renderPriority = (p: ExpensePriority) => {
                  switch (p) {
                    case 'Urgent':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-rose-100 text-rose-800">
                          🟠 Urgent
                        </span>
                      );
                    case 'High':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-rose-50 text-rose-700">
                          🔴 High
                        </span>
                      );
                    case 'Medium':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-amber-50 text-amber-700">
                          🟡 Medium
                        </span>
                      );
                    case 'Low':
                    default:
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-gray-100 text-gray-700">
                          ⚪ Low
                        </span>
                      );
                  }
                };

                const renderStatus = (s: ExpenseRequestStatus) => {
                  switch (s) {
                    case 'Approved':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      );
                    case 'Rejected':
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                        </span>
                      );
                    case 'Pending':
                    default:
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending
                        </span>
                      );
                  }
                };

                return (
                  <tr key={req.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                    <td className="p-3 font-mono font-medium text-indigo-700">{req.requestNo}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">{req.requestedBy}</div>
                      <div className="text-[11px] text-gray-500">{req.designation}</div>
                    </td>
                    <td className="p-3 text-gray-800 font-medium">{req.category}</td>
                    <td className="p-3 text-gray-600">{req.department}</td>
                    <td className="p-3 font-semibold text-gray-900">₹{req.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3">{renderPriority(req.priority)}</td>
                    <td className="p-3">{renderStatus(req.status)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewRequest(req)}
                          className="h-7 px-2 text-xs text-indigo-600 hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                        {req.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(req)}
                              className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              title="Approve Request"
                            >
                              <Check className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectModalReq(req);
                                setRejectReason('');
                              }}
                              className="h-7 px-2 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                              title="Reject Request"
                            >
                              <X className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}

                        {req.status === 'Approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                            <FileCheck className="w-3 h-3" /> PO Ready
                          </span>
                        )}

                        {req.status === 'Rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              showToast(`Request ${req.requestNo} duplicated for revision.`);
                              setShowNewModal(true);
                            }}
                            className="h-7 px-2 text-[11px] text-amber-700 border-amber-200 hover:bg-amber-50"
                          >
                            🔄 Revise & Resubmit
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMakeRecurring(req)}
                          className="h-7 px-2 text-[11px] text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                          title="Create a recurring rule from this request"
                        >
                          🔁 Recurring
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

        </>
      )}

      {activeTab === 'approval' && (
        <ApprovalQueueSection
          requests={requests}
          stageMap={stageMap}
          onAdvance={handleAdvanceStage}
          onReject={(req) => {
            setRejectModalReq(req);
            setRejectReason('');
          }}
          onView={(req) => setViewRequest(req)}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
        />
      )}

      {activeTab === 'recurring' && (
        <RecurringRulesSection
          rules={rules}
          onCreate={handleCreateRule}
          onUpdate={handleUpdateRule}
          onDelete={handleDeleteRule}
          onToggleStatus={handleToggleRule}
          onRunNow={handleRunRule}
          onGenerateRequest={handleRuleToRequest}
        />
      )}

      {/* ➕ NEW EXPENSE REQUEST MODAL */}
      {showNewModal && (
        <NewExpenseRequestModal
          existingRuleCount={rules.length}
          onClose={() => setShowNewModal(false)}
          onSubmit={(newRecord) => {
            setRequests((prev) => [newRecord, ...prev]);
            showToast(`Expense request ${newRecord.requestNo} submitted for approval.`);
            setShowNewModal(false);
          }}
          onCreateRule={(rule) => {
            handleCreateRule(rule);
            setShowNewModal(false);
            setActiveTab('recurring');
          }}
        />
      )}

      {/* 👁️ VIEW EXPENSE REQUEST MODAL */}
      {viewRequest && (
        <Modal
          isOpen
          onClose={() => setViewRequest(null)}
          title={`Expense Request — ${viewRequest.requestNo}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <span className="text-gray-400 block text-[11px]">Request Date:</span>
                <span className="font-semibold text-gray-800">{viewRequest.requestDate}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Department:</span>
                <span className="font-semibold text-gray-800">{viewRequest.department}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Requested By:</span>
                <span className="font-semibold text-gray-800">{viewRequest.requestedBy}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Priority:</span>
                <span className="font-semibold text-gray-800">{viewRequest.priority}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-1">
              <div className="text-gray-500 font-medium">Expense Head & Purpose:</div>
              <div className="font-semibold text-gray-800">{viewRequest.expenseHead}</div>
              <p className="text-gray-600 mt-1">{viewRequest.description}</p>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2 font-bold text-gray-700">Item Details Breakdown</div>
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Item Name</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2">Est. Rate</th>
                    <th className="p-2 text-right">Est. Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {viewRequest.items.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="p-2 text-gray-400">{idx + 1}</td>
                      <td className="p-2 font-medium text-gray-900">{it.name}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2">{it.unit}</td>
                      <td className="p-2">₹{it.estRate.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right font-semibold">₹{it.estAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={5} className="p-2 text-right">
                      Total Estimated Amount:
                    </td>
                    <td className="p-2 text-right text-indigo-700">
                      ₹{viewRequest.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {viewRequest.status === 'Rejected' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
                <b>Rejection Reason:</b> {viewRequest.rejectionReason}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setViewRequest(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ❌ REJECT CONFIRMATION MODAL */}
      {rejectModalReq && (
        <Modal
          isOpen
          onClose={() => setRejectModalReq(null)}
          title={`Reject Request — ${rejectModalReq.requestNo}`}
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600">
              Please enter the justification for declining this spend request raised by{' '}
              <b>{rejectModalReq.requestedBy}</b>.
            </p>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Exceeds allocated departmental Q3 envelope..."
                className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-rose-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <Button variant="ghost" size="sm" onClick={() => setRejectModalReq(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmReject} className="bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Reject
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// NEW EXPENSE REQUEST FORM MODAL
// ----------------------------------------------------------------------------
function NewExpenseRequestModal({
  onClose,
  onSubmit,
  onCreateRule,
  existingRuleCount = 0
}: {
  onClose: () => void;
  onSubmit: (rec: ExpenseRequestRecord) => void;
  onCreateRule: (rule: RecurringRule) => void;
  existingRuleCount?: number;
}) {
  /** One-Time = normal purchase request · Recurring = also schedules a repeating rule */
  const [requestType, setRequestType] = useState<'One-Time' | 'Recurring'>('One-Time');
  const [frequency, setFrequency] = useState<RecurringRule['frequency']>('Monthly');
  const [customDays, setCustomDays] = useState('30');
  const [startDate, setStartDate] = useState('2025-10-01');
  const [nextDueDate, setNextDueDate] = useState('2025-11-01');
  const [endDate, setEndDate] = useState('');
  const [ruleAction, setRuleAction] = useState<RecurringRule['actionType']>('Reminder Only');
  const [reminderDays, setReminderDays] = useState('7');
  const [costCenter, setCostCenter] = useState('CC-ADM-01');
  const [department, setDepartment] = useState('Admin');
  const [requestedBy, setRequestedBy] = useState('Mr. Verma');
  const [designation, setDesignation] = useState('HOD / Department Head');
  const [category, setCategory] = useState('Stationery');
  const [expenseHead, setExpenseHead] = useState('EXP-OFF-002 — Office Stationery');
  const [description, setDescription] = useState('Quarterly supplies for administration block.');
  const [priority, setPriority] = useState<ExpensePriority>('Medium');
  const [requiredByDate, setRequiredByDate] = useState('2025-10-15');
  const [preferredVendor, setPreferredVendor] = useState('');

  const [items, setItems] = useState<ExpenseRequestItem[]>([
    { id: '1', name: 'A4 Paper Reams', quantity: 50, unit: 'Reams', estRate: 250, estAmount: 12500 },
    { id: '2', name: 'Whiteboard Marker', quantity: 100, unit: 'Nos.', estRate: 30, estAmount: 3000 }
  ]);

  const totalAmount = useMemo(() => {
    return items.reduce((acc, it) => acc + (it.estAmount || 0), 0);
  }, [items]);

  const handleItemChange = (index: number, field: keyof ExpenseRequestItem, val: any) => {
    const updated = [...items];
    const it = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'estRate') {
      const q = field === 'quantity' ? Number(val) : it.quantity;
      const r = field === 'estRate' ? Number(val) : it.estRate;
      it.estAmount = (q || 0) * (r || 0);
    }
    updated[index] = it;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: '',
        quantity: 1,
        unit: 'Nos.',
        estRate: 0,
        estAmount: 0
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (isDraft: boolean) => {
    const reqNum = `EXP-REQ-${String(Math.floor(100 + Math.random() * 899))}`;
    const newRecord: ExpenseRequestRecord = {
      id: `REQ-${Date.now()}`,
      requestNo: reqNum,
      requestDate: '27-Sep-2025',
      fy: 'FY 2025-26',
      department,
      requestedBy,
      designation,
      category,
      expenseHead,
      description,
      items,
      totalAmount,
      priority,
      requiredByDate,
      preferredVendor,
      status: isDraft ? 'Pending' : 'Pending'
    };

    if (requestType === 'Recurring') {
      // A recurring expense request also schedules the repeating rule, so the
      // same data is captured once and the rule shows up under “Recurring Expenses”.
      const ruleNo = `REC-2025-${String(existingRuleCount + 1).padStart(3, '0')}`;
      const vendorName = preferredVendor || 'ABC Stationers';
      const rule: RecurringRule = {
        id: `RULE-${Date.now()}`,
        ruleNo,
        title: description || `${category} — recurring ${frequency.toLowerCase()} expense`,
        linkedRequest: reqNum,
        vendor: vendorName,
        vendorCode: 'VND-0001',
        expenseHead: expenseHead.split('—')[0].trim(),
        expenseCode: expenseHead.split('—')[0].trim(),
        description,
        amount: totalAmount,
        frequency,
        customDays: frequency === 'Custom' ? Number(customDays) || 30 : undefined,
        nextDueDate,
        startDate,
        endDate: endDate || undefined,
        actionType: ruleAction,
        status: 'Active',
        reminderDays: Number(reminderDays) || 7,
        notifyVia: ['Email'],
        department,
        costCenter,
        executionCount: 0,
        totalAmountProcessed: 0,
        createdBy: requestedBy,
        notes: `Raised from expense request ${reqNum}.`
      };
      onCreateRule(rule);
      return;
    }
    onSubmit(newRecord);
  };

  return (
    <Modal isOpen onClose={onClose} title="📋 New Expense Request" size="lg">
      <div className="space-y-4 text-xs">
        {/* Top Header metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-gray-400 block text-[10px]">Request No.:</span>
            <span className="font-mono font-semibold text-gray-800">Auto: EXP-REQ-2025-001 🔒</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Request Date:</span>
            <span className="font-semibold text-gray-800">27-Sep-2025 🔒 Today</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Financial Year:</span>
            <span className="font-semibold text-gray-800">FY 2025-26 🔒</span>
          </div>
        </div>

        {/* Request Type — one-time purchase or a recurring expense */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            REQUEST TYPE:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { id: 'One-Time', title: 'One-Time Expense', desc: 'Single purchase / payment request' },
              { id: 'Recurring', title: 'Recurring Expense', desc: 'Repeats on a schedule (rent, AMC, salary, subscriptions)' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setRequestType(t.id as 'One-Time' | 'Recurring')}
                className={`rounded-lg border p-2.5 text-left transition-colors ${
                  requestType === t.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border-2 ${requestType === t.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`} />
                  <span className="font-semibold text-gray-800">{t.title}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>

          {requestType === 'Recurring' && (
            <div className="border-t border-dashed border-gray-200 pt-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Frequency *</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as RecurringRule['frequency'])}
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
                  >
                    {RECURRING_FREQUENCIES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                {frequency === 'Custom' ? (
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Repeat Every (days) *</label>
                    <input
                      type="number"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Next Due Date *</label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">End Date (optional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Rule Action *</label>
                  <select
                    value={ruleAction}
                    onChange={(e) => setRuleAction(e.target.value as RecurringRule['actionType'])}
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
                  >
                    {RECURRING_ACTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Remind Before (days)</label>
                  <input
                    type="number"
                    value={reminderDays}
                    onChange={(e) => setReminderDays(e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Cost Center</label>
                  <select
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
                  >
                    {RECURRING_COST_CENTERS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Repeats</label>
                  <div className="p-1.5 border border-gray-200 rounded-md bg-gray-50 font-semibold text-gray-700">
                    ₹{totalAmount.toLocaleString('en-IN')} × {frequency === 'Monthly' ? '12 / year' : frequency === 'Quarterly' ? '4 / year' : frequency === 'Half-Yearly' ? '2 / year' : frequency === 'Yearly' ? '1 / year' : `${customDays} days`}
                  </div>
                </div>
              </div>
              <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-md text-[11px] text-indigo-800 flex items-center gap-2">
                <Repeat className="w-3.5 h-3.5" />
                This will create recurring rule <strong>{`REC-2025-${String(existingRuleCount + 1).padStart(3, '0')}`}</strong> in the <strong>Recurring Expenses</strong> tab
                {ruleAction === 'Auto-Voucher' ? ' and auto-raise a voucher on each due date.' : ruleAction === 'Auto-Payment' ? ' and auto-release payment on each due date.' : ' with a reminder before each due date.'}
              </div>
            </div>
          )}
        </div>

        {/* Requested By Section */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            REQUESTED BY:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
              >
                <option value="Admin">Admin</option>
                <option value="Academic">Academic</option>
                <option value="Library">Library</option>
                <option value="Sports">Sports</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Requested By</label>
              <select
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
              >
                <option value="Mr. Verma">Mr. Verma</option>
                <option value="Ms. Joshi">Ms. Joshi</option>
                <option value="Mr. Singh">Mr. Singh</option>
                <option value="Ms. Roy">Ms. Roy</option>
                <option value="Mr. Kumar">Mr. Kumar</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
              >
                <option value="HOD / Department Head">HOD / Department Head</option>
                <option value="Estate Officer">Estate Officer</option>
                <option value="Senior Coordinator">Senior Coordinator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expense Details */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
          <div className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
            EXPENSE DETAILS:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Expense Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
              >
                <option value="Stationery">Stationery</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Furniture">Furniture</option>
                <option value="Maintenance">Maintenance</option>
                <option value="IT Equipment">IT Equipment</option>
                <option value="Books">Books</option>
                <option value="Sports Equipment">Sports Equipment</option>
                <option value="Staff Welfare">Staff Welfare</option>
                <option value="Utility">Utility</option>
                <option value="Transport">Transport</option>
                <option value="Events">Events</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Expense Head (Links to GL)</label>
              <select
                value={expenseHead}
                onChange={(e) => setExpenseHead(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md bg-white text-xs"
              >
                <option value="EXP-OFF-002 — Office Stationery">EXP-OFF-002 — Office Stationery</option>
                <option value="EXP-LAB-001 — Lab Chemicals & Instruments">
                  EXP-LAB-001 — Lab Chemicals & Instruments
                </option>
                <option value="EXP-IT-005 — IT Equipment & Hardware">
                  EXP-IT-005 — IT Equipment & Hardware
                </option>
                <option value="EXP-BLD-008 — Building Maintenance">
                  EXP-BLD-008 — Building Maintenance
                </option>
                <option value="EXP-SPT-001 — Sports Equipment">EXP-SPT-001 — Sports Equipment</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Description (What is needed and why)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mid-term examination stationery and consumable reams"
              className="w-full p-2 border border-gray-300 rounded-md text-xs"
            />
          </div>
        </div>

        {/* Item Details Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 font-bold text-gray-700 flex justify-between items-center">
            <span>ITEM DETAILS:</span>
            <Button size="sm" variant="outline" onClick={handleAddItem} className="h-6 text-[10px] px-2">
              ➕ Add Item
            </Button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-2 w-8">#</th>
                <th className="p-2">Item Name</th>
                <th className="p-2 w-20">Quantity</th>
                <th className="p-2 w-20">Unit</th>
                <th className="p-2 w-24">Est. Rate</th>
                <th className="p-2 w-28 text-right">Est. Amount</th>
                <th className="p-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td className="p-2 text-gray-400">{idx + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      placeholder="Item description"
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={it.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={it.estRate}
                      onChange={(e) => handleItemChange(idx, 'estRate', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                  <td className="p-2 text-right font-semibold text-gray-800">
                    ₹{it.estAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2 text-center">
                    {items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-indigo-50/70 border-t border-indigo-100 flex justify-between items-center text-xs">
            <span className="font-semibold text-indigo-950">Total Estimated Amount:</span>
            <span className="font-bold text-sm text-indigo-900">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Priority & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Priority</label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High', 'Urgent'] as ExpensePriority[]).map((p) => (
                <label key={p} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priorityChoice"
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Required By Date</label>
            <input
              type="date"
              value={requiredByDate}
              onChange={(e) => setRequiredByDate(e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Preferred Vendor (Optional)</label>
            <input
              type="text"
              value={preferredVendor}
              onChange={(e) => setPreferredVendor(e.target.value)}
              placeholder="e.g. XYZ Stationers"
              className="w-full p-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
        </div>

        {/* Supporting Docs */}
        <div>
          <label className="block text-gray-600 mb-1 font-medium">Supporting Documents</label>
          <div className="border border-dashed border-gray-300 rounded-md p-3 text-center text-gray-500 hover:border-indigo-400">
            <Paperclip className="w-4 h-4 mx-auto mb-1 text-gray-400" />
            <span>Upload quotation / reference specifications (PDF, Image)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSubmit(true)}>
            💾 Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSubmit(false)}
            disabled={requestType === 'Recurring' && !nextDueDate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {requestType === 'Recurring' ? '🔁 Create Recurring Expense' : '✅ Submit for Approval'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ExpenseRequest;


// ============================================================================
// SECTION : APPROVAL QUEUE (stage-wise approval workflow)
// ============================================================================
function ApprovalQueueSection({
  requests,
  stageMap,
  onAdvance,
  onReject,
  onView,
  onBulkApprove,
  onBulkReject
}: {
  requests: ExpenseRequestRecord[];
  stageMap: Record<string, number>;
  onAdvance: (req: ExpenseRequestRecord) => void;
  onReject: (req: ExpenseRequestRecord) => void;
  onView: (req: ExpenseRequestRecord) => void;
  onBulkApprove: (ids: string[]) => void;
  onBulkReject: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const pending = requests.filter((r) => r.status === 'Pending');
  const stageOf = (req: ExpenseRequestRecord) => stageMap[req.id] ?? 0;
  const ageDays = (req: ExpenseRequestRecord) => {
    const t = Date.parse(req.requestDate);
    if (Number.isNaN(t)) return 0;
    return Math.max(0, Math.round((Date.now() - t) / 86400000));
  };

  const stageChip = (index: number) =>
    ['bg-blue-50 text-blue-700 border-blue-200', 'bg-amber-50 text-amber-700 border-amber-200', 'bg-purple-50 text-purple-700 border-purple-200'][
      index
    ] || 'bg-gray-50 text-gray-700 border-gray-200';

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const allSelected = pending.length > 0 && selected.length === pending.length;

  const counters = [
    { label: 'Pending Approval', value: pending.length, tone: 'text-amber-700' },
    { label: 'With HOD', value: pending.filter((r) => stageOf(r) === 0).length, tone: 'text-blue-700' },
    { label: 'Finance Verification', value: pending.filter((r) => stageOf(r) === 1).length, tone: 'text-indigo-700' },
    { label: 'Management Approval', value: pending.filter((r) => stageOf(r) === 2).length, tone: 'text-purple-700' },
    {
      label: 'Value Pending',
      value: `₹${pending.reduce((s, r) => s + r.totalAmount, 0).toLocaleString('en-IN')}`,
      tone: 'text-gray-900'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {counters.map((c) => (
          <Card key={c.label} className="p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{c.label}</p>
            <p className={`text-lg font-bold ${c.tone}`}>{c.value}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Approval Workflow Queue</h2>
              <p className="text-xs text-gray-500">
                Every pending request moves HOD → Finance → Management. {selected.length} selected
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={selected.length === 0}
              onClick={() => {
                onBulkApprove(selected);
                setSelected([]);
              }}
              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 disabled:opacity-40"
            >
              <Check className="w-4 h-4 mr-1" /> Approve Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={selected.length === 0}
              onClick={() => {
                onBulkReject(selected);
                setSelected([]);
              }}
              className="text-rose-700 border-rose-200 hover:bg-rose-50 disabled:opacity-40"
            >
              <X className="w-4 h-4 mr-1" /> Reject Selected
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => setSelected(e.target.checked ? pending.map((r) => r.id) : [])}
                  />
                </th>
                <th className="p-3">Request No.</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Category / Head</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Age</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.map((req) => (
                <tr key={req.id} className="hover:bg-indigo-50/30">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(req.id)}
                      onChange={() => toggle(req.id)}
                    />
                  </td>
                  <td className="p-3 font-mono font-medium text-indigo-700">{req.requestNo}</td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">{req.requestedBy}</div>
                    <div className="text-[11px] text-gray-500">
                      {req.designation} · {req.department}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-800 font-medium">{req.category}</div>
                    <div className="text-[11px] text-gray-500">{req.expenseHead}</div>
                  </td>
                  <td className="p-3 font-semibold text-gray-900">
                    ₹{req.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-gray-700">{req.priority}</td>
                  <td className="p-3 text-gray-600">{ageDays(req)} day(s)</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${stageChip(
                        stageOf(req)
                      )}`}
                    >
                      {APPROVAL_STAGES[stageOf(req)]}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      {APPROVAL_STAGES.map((s, i) => (
                        <span
                          key={s}
                          className={`h-1.5 w-5 rounded-full ${i <= stageOf(req) ? 'bg-indigo-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(req)}
                        className="h-7 px-2 text-xs text-indigo-600 hover:bg-indigo-50"
                        title="View request"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAdvance(req)}
                        className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        title={stageOf(req) >= APPROVAL_STAGES.length - 1 ? 'Final approval' : 'Move to next stage'}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {stageOf(req) >= APPROVAL_STAGES.length - 1 ? 'Approve' : 'Forward'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(req)}
                        className="h-7 px-2 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                        title="Reject request"
                      >
                        <X className="w-3 h-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    No requests are waiting for approval.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION : RECURRING RULES (merged from Recurring Expense Scheduler)
// ============================================================================
function RecurringRulesSection({
  rules,
  onCreate,
  onUpdate,
  onDelete,
  onToggleStatus,
  onRunNow,
  onGenerateRequest
}: {
  rules: RecurringRule[];
  onCreate: (rule: RecurringRule) => void;
  onUpdate: (rule: RecurringRule) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (rule: RecurringRule) => void;
  onRunNow: (rule: RecurringRule) => void;
  onGenerateRequest: (rule: RecurringRule) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [freqFilter, setFreqFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringRule | null>(null);

  const filtered = rules.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (freqFilter !== 'all' && r.frequency !== freqFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.ruleNo.toLowerCase().includes(q) ||
        r.vendor.toLowerCase().includes(q) ||
        r.expenseHead.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const active = rules.filter((r) => r.status === 'Active');
  const monthlyCommitment = active.reduce((s, r) => {
    const factor =
      r.frequency === 'Monthly'
        ? 1
        : r.frequency === 'Quarterly'
          ? 1 / 3
          : r.frequency === 'Half-Yearly'
            ? 1 / 6
            : r.frequency === 'Yearly'
              ? 1 / 12
              : 30 / (r.customDays || 30);
    return s + r.amount * factor;
  }, 0);

  const openNew = () => {
    setEditing(null);
    setIsModalOpen(true);
  };
  const openEdit = (rule: RecurringRule) => {
    setEditing(rule);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Rules', value: String(active.length), tone: 'text-emerald-700' },
          { label: 'Paused Rules', value: String(rules.filter((r) => r.status === 'Paused').length), tone: 'text-amber-700' },
          { label: 'Monthly Commitment', value: `₹${Math.round(monthlyCommitment).toLocaleString('en-IN')}`, tone: 'text-indigo-700' },
          {
            label: 'Next Due',
            value: rules
              .filter((r) => r.status === 'Active')
              .map((r) => r.nextDueDate)
              .sort()[0] || '—',
            tone: 'text-gray-900'
          }
        ].map((c) => (
          <Card key={c.label} className="p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{c.label}</p>
            <p className={`text-lg font-bold ${c.tone}`}>{c.value}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Recurring Rules</h2>
              <p className="text-xs text-gray-500">
                {rules.length} scheduled expenses · auto-voucher, reminder or auto-payment rules
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Search rule, vendor, head..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs w-56"
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Paused', label: 'Paused' },
                { value: 'Expired', label: 'Expired' }
              ]}
              value={statusFilter}
              onChange={(v: any) => setStatusFilter(typeof v === 'string' ? v : v?.target?.value ?? 'all')}
              className="text-xs w-36"
            />
            <Select
              options={[{ value: 'all', label: 'All Frequencies' }, ...RECURRING_FREQUENCIES.map((f) => ({ value: f, label: f }))]}
              value={freqFilter}
              onChange={(v: any) => setFreqFilter(typeof v === 'string' ? v : v?.target?.value ?? 'all')}
              className="text-xs w-40"
            />
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={openNew}>
              <Plus className="w-4 h-4 mr-1" /> New Recurring Rule
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Rule No.</th>
                <th className="p-3">Rule / Description</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Expense Head</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Frequency</th>
                <th className="p-3">Next Due</th>
                <th className="p-3">Action</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((rule) => (
                <tr key={rule.id} className="hover:bg-indigo-50/30">
                  <td className="p-3 font-mono font-medium text-indigo-700">{rule.ruleNo}</td>
                  <td className="p-3 max-w-xs">
                    <div className="font-semibold text-gray-900">{rule.title}</div>
                    <div className="text-[11px] text-gray-500 truncate">{rule.description}</div>
                    {rule.linkedRequest && (
                      <div className="text-[10px] text-indigo-600 mt-0.5">Linked to {rule.linkedRequest}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-gray-800">{rule.vendor}</div>
                    <div className="text-[11px] text-gray-500 font-mono">{rule.vendorCode}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-800">{rule.expenseHead}</div>
                    <div className="text-[11px] text-gray-500 font-mono">{rule.expenseCode}</div>
                  </td>
                  <td className="p-3 font-semibold text-gray-900">₹{rule.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-gray-700">
                    {rule.frequency}
                    {rule.frequency === 'Custom' && rule.customDays ? ` (${rule.customDays}d)` : ''}
                  </td>
                  <td className="p-3">
                    <div className="text-gray-800">{rule.nextDueDate}</div>
                    <div className="text-[11px] text-gray-500">{nextDueLabel(rule)}</div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                      {rule.actionType}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        rule.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rule.status === 'Paused'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {rule.status}
                    </span>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {rule.executionCount} runs · ₹{rule.totalAmountProcessed.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRunNow(rule)}
                        className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
                        title="Run now — create voucher/reminder"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onGenerateRequest(rule)}
                        className="h-7 px-2 text-xs text-indigo-600 hover:bg-indigo-50"
                        title="Create an expense request from this rule"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleStatus(rule)}
                        className="h-7 px-2 text-xs text-amber-600 hover:bg-amber-50"
                        title={rule.status === 'Active' ? 'Pause rule' : 'Resume rule'}
                      >
                        {rule.status === 'Active' ? (
                          <PauseCircle className="w-3.5 h-3.5" />
                        ) : (
                          <PlayCircle className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(rule)}
                        className="h-7 px-2 text-xs text-gray-600 hover:bg-gray-100"
                        title="Edit rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(rule.id)}
                        className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    No recurring rules match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <RecurringRuleModal
          initial={editing}
          onClose={() => setIsModalOpen(false)}
          onSave={(rule) => {
            if (editing) onUpdate(rule);
            else onCreate(rule);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function RecurringRuleModal({
  initial,
  onClose,
  onSave
}: {
  initial: RecurringRule | null;
  onClose: () => void;
  onSave: (rule: RecurringRule) => void;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [vendor, setVendor] = useState(initial?.vendor || RECURRING_VENDORS[0]);
  const [expenseHead, setExpenseHead] = useState(initial?.expenseHead || 'Office Stationery');
  const [expenseCode, setExpenseCode] = useState(initial?.expenseCode || 'EXP-OFF-002');
  const [description, setDescription] = useState(initial?.description || '');
  const [amount, setAmount] = useState(String(initial?.amount ?? 10000));
  const [frequency, setFrequency] = useState<RecurringRule['frequency']>(initial?.frequency || 'Monthly');
  const [customDays, setCustomDays] = useState(String(initial?.customDays ?? 30));
  const [nextDueDate, setNextDueDate] = useState(initial?.nextDueDate || '2025-10-05');
  const [startDate, setStartDate] = useState(initial?.startDate || '2025-10-01');
  const [endDate, setEndDate] = useState(initial?.endDate || '');
  const [actionType, setActionType] = useState<RecurringRule['actionType']>(initial?.actionType || 'Auto-Voucher');
  const [reminderDays, setReminderDays] = useState(String(initial?.reminderDays ?? 3));
  const [notifyVia, setNotifyVia] = useState<string[]>(initial?.notifyVia || ['email']);
  const [department, setDepartment] = useState(initial?.department || 'Admin');
  const [costCenter, setCostCenter] = useState(initial?.costCenter || 'CC-ADM-01');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [error, setError] = useState('');

  const toggleNotify = (channel: string) =>
    setNotifyVia((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));

  const submit = () => {
    if (!title.trim()) return setError('Rule title is required.');
    if (!Number(amount) || Number(amount) <= 0) return setError('Enter a valid recurring amount.');
    if (frequency === 'Custom' && (!Number(customDays) || Number(customDays) < 1))
      return setError('Enter the custom cycle in days.');
    setError('');
    onSave({
      id: initial?.id || `rr_${Date.now()}`,
      ruleNo: initial?.ruleNo || `REC-2025-${String(Math.floor(100 + Math.random() * 899))}`,
      title: title.trim(),
      linkedRequest: initial?.linkedRequest,
      vendor,
      vendorCode: initial?.vendorCode || 'VND-2025-014',
      expenseHead,
      expenseCode,
      description: description.trim() || `${frequency} ${expenseHead} for ${department}`,
      amount: Number(amount),
      frequency,
      customDays: frequency === 'Custom' ? Number(customDays) : undefined,
      nextDueDate,
      startDate,
      endDate: endDate || undefined,
      actionType,
      status: initial?.status || 'Active',
      reminderDays: Number(reminderDays) || 0,
      notifyVia,
      department,
      costCenter,
      lastExecuted: initial?.lastExecuted,
      executionCount: initial?.executionCount ?? 0,
      totalAmountProcessed: initial?.totalAmountProcessed ?? 0,
      createdBy: initial?.createdBy || 'Accounts Officer',
      notes
    });
  };

  return (
    <Modal isOpen onClose={onClose} title={initial ? `Edit Recurring Rule — ${initial.ruleNo}` : 'Create Recurring Rule'} size="lg">
      <div className="space-y-4 text-xs">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div>
            <span className="block text-[10px] text-gray-400">Rule No.</span>
            <span className="font-mono font-semibold text-gray-800">{initial?.ruleNo || 'Auto-generated'}</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400">Action Type</span>
            <span className="font-semibold text-gray-800">{actionType}</span>
          </div>
          <div>
            <span className="block text-[10px] text-gray-400">Status</span>
            <span className="font-semibold text-gray-800">{initial?.status || 'Active'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Rule Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Monthly Electricity Charges" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Vendor / Payee</label>
            <Select
              options={RECURRING_VENDORS.map((v) => ({ value: v, label: v }))}
              value={vendor}
              onChange={(v: any) => setVendor(typeof v === 'string' ? v : v?.target?.value ?? vendor)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Expense Head</label>
            <Input value={expenseHead} onChange={(e) => setExpenseHead(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Head Code</label>
            <Input value={expenseCode} onChange={(e) => setExpenseCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Amount (₹) *</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Frequency</label>
            <Select
              options={RECURRING_FREQUENCIES.map((f) => ({ value: f, label: f }))}
              value={frequency}
              onChange={(v: any) => setFrequency((typeof v === 'string' ? v : v?.target?.value) as RecurringRule['frequency'])}
            />
          </div>
          {frequency === 'Custom' && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Custom Cycle (days)</label>
              <Input type="number" value={customDays} onChange={(e) => setCustomDays(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Action Type</label>
            <Select
              options={RECURRING_ACTIONS.map((a) => ({ value: a, label: a }))}
              value={actionType}
              onChange={(v: any) =>
                setActionType((typeof v === 'string' ? v : v?.target?.value) as RecurringRule['actionType'])
              }
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Next Due Date</label>
            <Input type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">End Date (optional)</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Advance Reminder (days)</label>
            <Input type="number" value={reminderDays} onChange={(e) => setReminderDays(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Department</label>
            <Select
              options={RECURRING_DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              value={department}
              onChange={(v: any) => setDepartment(typeof v === 'string' ? v : v?.target?.value ?? department)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Cost Center</label>
            <Select
              options={RECURRING_COST_CENTERS.map((c) => ({ value: c, label: c }))}
              value={costCenter}
              onChange={(v: any) => setCostCenter(typeof v === 'string' ? v : v?.target?.value ?? costCenter)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Notify Via</label>
            <div className="flex flex-wrap gap-2">
              {['email', 'sms', 'push'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleNotify(c)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium capitalize ${
                    notifyVia.includes(c)
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 bg-white text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Execution notes, approvals, contract references..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={submit}>
            <Save className="w-3.5 h-3.5 mr-1" />
            {initial ? 'Update Rule' : 'Create Rule'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
