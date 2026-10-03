import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Ban,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  History,
  Hourglass,
  Info,
  Landmark,
  Layers,
  Lock,
  Mail,
  PauseCircle,
  Phone,
  Printer,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Undo2,
  Upload,
  UserCheck,
  Users,
  Wallet,
  X,
  XCircle
} from 'lucide-react';
import {
  ACADEMIC_YEAR,
  AppStatus,
  GovtStatus,
  SCHOLARSHIP_SCHEMES,
  ScholarshipApplication,
  ScholarshipScheme,
  ScholarshipStudent,
  SelectionState,
  classLabel,
  defaultAward,
  evaluateApplication,
  formatDate,
  formatDateLong,
  formatLac,
  getApplications,
  getSelection,
  htmlDoc,
  htmlTable,
  inr,
  printHtml,
  romanClass,
  schemeById,
  setApplications,
  setSelection,
  studentById,
  todayIso,
  toCsv,
  downloadText,
  upsertPendingDisbursement
} from './scholarshipData';

const REVIEWERS = ['Finance Manager — Priya Gupta', 'Accounts Officer — Rakesh Shah', 'Vice Principal — Mrs. Iyer'];
const APPROVERS = ['Principal — Mr. Sharma', 'Director — Mrs. Kapoor'];
const MEDALS = ['🥇', '🥈', '🥉'];

const GOVT_META: Record<GovtStatus, { icon: string; label: string; meaning: string; cls: string; step: number }> = {
  'To Submit': { icon: '📤', label: 'To Submit', meaning: 'School verified — ready for portal submission', cls: 'bg-blue-50 text-blue-700 border-blue-200', step: 1 },
  Pending: { icon: '⏳', label: 'Portal Pending', meaning: 'Application submitted on portal — awaiting department review', cls: 'bg-amber-50 text-amber-700 border-amber-200', step: 2 },
  Approved: { icon: '✅', label: 'Sanctioned / Approved', meaning: 'Govt. sanctioned — awaiting state treasury / DBT release', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', step: 3 },
  Disbursed: { icon: '💰', label: 'DBT Disbursed', meaning: 'Funds directly credited to student Aadhaar-seeded bank account', cls: 'bg-purple-50 text-purple-700 border-purple-200', step: 4 },
  Rejected: { icon: '❌', label: 'Rejected by Govt', meaning: 'Rejected by nodal officer or portal verification', cls: 'bg-rose-50 text-rose-700 border-rose-200', step: 0 }
};
const GOVT_ORDER: GovtStatus[] = ['To Submit', 'Pending', 'Approved', 'Disbursed', 'Rejected'];

function GovtStatusPill({ status }: { status: GovtStatus }) {
  const m = GOVT_META[status] || { icon: '•', label: status, cls: 'bg-gray-50 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${m.cls}`}>
      <span>{m.icon}</span>
      <span>{m.label}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: AppStatus }) {
  const map: Record<AppStatus, { cls: string; label: string }> = {
    Draft: { cls: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Draft' },
    Submitted: { cls: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Submitted' },
    UnderReview: { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Under Review' },
    Approved: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Approved' },
    Awarded: { cls: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Awarded' },
    Rejected: { cls: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Rejected' },
    OnHold: { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: 'On Hold' }
  };
  const m = map[status] || { cls: 'bg-gray-100 text-gray-700 border-gray-300', label: status };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${m.cls}`}>
      {m.label}
    </span>
  );
}

function EligibilityPill({ evaluation }: { evaluation?: { passAll?: boolean; passCritical?: boolean; missingDocs?: string[] } }) {
  if (!evaluation) {
    return <span className="text-xs text-gray-400">—</span>;
  }
  if (evaluation.passAll) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Eligible
      </span>
    );
  }
  const missing = evaluation.missingDocs || [];
  if (evaluation.passCritical && missing.length > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium" title={`Pending: ${missing.join(', ')}`}>
        <Clock className="w-3 h-3 text-amber-600" /> Partial (Docs)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
      <XCircle className="w-3 h-3 text-rose-600" /> Not Eligible
    </span>
  );
}

export function ScholarshipApprovalSanction() {
  const [apps, setApps] = useState<ScholarshipApplication[]>(() => getApplications());
  useEffect(() => {
    setApplications(apps);
  }, [apps]);

  // Primary Active Tab: 'all' | 'govt' | 'internal' | 'urgent'
  const [activeTab, setActiveTab] = useState<'all' | 'govt' | 'internal' | 'urgent'>('all');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL');
  const [govtStatusFilter, setGovtStatusFilter] = useState('ALL');

  // Multi-selection checkboxes for table rows
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Detailed Modal state
  const [detailApp, setDetailApp] = useState<ScholarshipApplication | null>(null);

  // Action Dialogs state
  const [approveConfirmApp, setApproveConfirmApp] = useState<ScholarshipApplication | null>(null);
  const [bulkApproveConfirm, setBulkApproveConfirm] = useState(false);
  const [rejectDialogApp, setRejectDialogApp] = useState<ScholarshipApplication | null>(null);
  const [holdDialogApp, setHoldDialogApp] = useState<ScholarshipApplication | null>(null);

  // Portal submission modal & Govt decision modal
  const [portalFor, setPortalFor] = useState<ScholarshipApplication | null>(null);
  const [decisionFor, setDecisionFor] = useState<ScholarshipApplication | null>(null);

  // Notice alert banner
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6500);
    return () => clearTimeout(t);
  }, [notice]);

  // Schemes lists
  const internalSchemes = SCHOLARSHIP_SCHEMES.filter((s) => s.kind === 'Internal');
  const govtSchemes = SCHOLARSHIP_SCHEMES.filter((s) => s.kind === 'Government');

  // Interactive internal scheme tracker selection
  const [trackerSchemeId, setTrackerSchemeId] = useState<string>('MERIT25');
  const trackerScheme = schemeById(trackerSchemeId) || internalSchemes[0];
  const [sel, setSel] = useState<SelectionState>(() => getSelection(trackerSchemeId));

  useEffect(() => {
    setSel(getSelection(trackerSchemeId));
  }, [trackerSchemeId]);

  useEffect(() => {
    setSelection(trackerSchemeId, sel);
  }, [sel, trackerSchemeId]);

  // Compute fixed scheme amount helper
  const getSchemeAwardAmount = (app: ScholarshipApplication): number => {
    const sc = schemeById(app.schemeId);
    if (!sc) return app.requestedAmount || 0;
    const st = studentById(app.studentId);
    return defaultAward(sc, st.annualFee).amount;
  };

  // KPI Calculations
  const kpiTotalApps = apps.length;
  const kpiPendingApproval = apps.filter((a) => a.status === 'Submitted' || a.status === 'UnderReview').length;
  const kpiApprovedInternal = apps.filter((a) => {
    const sc = schemeById(a.schemeId);
    return sc && sc.kind === 'Internal' && (a.status === 'Approved' || a.status === 'Awarded');
  });
  const kpiInternalTotalAmount = kpiApprovedInternal.reduce((sum, a) => sum + (a.award?.amount || getSchemeAwardAmount(a)), 0);

  const kpiGovtSanctioned = apps.filter((a) => {
    const sc = schemeById(a.schemeId);
    return sc && sc.kind === 'Government' && a.tracking && (a.tracking.status === 'Approved' || a.tracking.status === 'Disbursed');
  });
  const kpiGovtTotalSanctioned = kpiGovtSanctioned.reduce((sum, a) => sum + (a.tracking?.amountApproved || getSchemeAwardAmount(a)), 0);

  const kpiUrgentApplications = apps.filter((a) => {
    const isPending = a.status === 'Submitted' || a.status === 'UnderReview';
    const hasUnverifiedDocs = a.documents.some((d) => d.required && d.status !== 'Verified');
    const isGovtToSubmit = a.tracking && a.tracking.status === 'To Submit';
    return isPending && (hasUnverifiedDocs || isGovtToSubmit || a.appliedOn <= '2025-06-30');
  });

  // Filtered rows for main approval table
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const sc = schemeById(app.schemeId);
      const st = studentById(app.studentId);
      const ev = sc && st ? evaluateApplication(app, sc, st) : undefined;

      // Tab filter
      if (activeTab === 'govt' && sc?.kind !== 'Government') return false;
      if (activeTab === 'internal' && sc?.kind !== 'Internal') return false;
      if (activeTab === 'urgent' && !kpiUrgentApplications.some((u) => u.id === app.id)) return false;

      // Scheme dropdown
      if (schemeFilter !== 'ALL' && app.schemeId !== schemeFilter) return false;

      // Class dropdown
      if (classFilter !== 'ALL' && String(st.cls) !== classFilter) return false;

      // Status dropdown
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;

      // Eligibility dropdown
      if (eligibilityFilter === 'ELIGIBLE' && !ev?.passAll) return false;
      if (eligibilityFilter === 'PARTIAL' && !(ev?.passCritical && (ev?.missingDocs.length ?? 0) > 0)) return false;
      if (eligibilityFilter === 'NOT_ELIGIBLE' && (ev?.passCritical ?? true)) return false;

      // Govt Status filter
      if (govtStatusFilter !== 'ALL') {
        if (!app.tracking || app.tracking.status !== govtStatusFilter) return false;
      }

      // Search query (Student Name, GR No, App No, Scheme Name, Aadhaar)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = st.name.toLowerCase().includes(q);
        const matchesGr = st.grNo.toLowerCase().includes(q);
        const matchesAppNo = app.appNo.toLowerCase().includes(q);
        const matchesScheme = sc?.name.toLowerCase().includes(q);
        const matchesAadhaar = (st.aadharNo && st.aadharNo.toLowerCase().includes(q)) || (st.aadhaarNumber && st.aadhaarNumber.toLowerCase().includes(q));
        if (!matchesName && !matchesGr && !matchesAppNo && !matchesScheme && !matchesAadhaar) {
          return false;
        }
      }

      return true;
    });
  }, [apps, activeTab, schemeFilter, classFilter, statusFilter, eligibilityFilter, govtStatusFilter, searchQuery, kpiUrgentApplications]);

  // Master Checkbox toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Execution: Single Approve
  const executeApprove = (app: ScholarshipApplication, remarks: string, approverName = 'Principal — Mr. Sharma') => {
    const sc = schemeById(app.schemeId);
    const st = studentById(app.studentId);
    const amount = getSchemeAwardAmount(app);
    const pct = sc.basis === 'Percent' ? sc.pct : undefined;
    const now = todayIso();

    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== app.id) return a;
        return {
          ...a,
          status: 'Approved',
          award: {
            amount,
            pct,
            awardedOn: now,
            by: approverName,
            remarks: remarks.trim() || 'Approved as per scheme criteria and master definition'
          },
          history: [
            ...a.history,
            {
              on: now,
              by: approverName,
              action: `Approved strictly at Master Scheme amount: ${inr(amount)} (${remarks.trim() || 'Master criteria verified'})`
            }
          ]
        };
      })
    );

    upsertPendingDisbursement(app, amount, pct);
    setNotice({
      type: 'success',
      text: `Application ${app.appNo} for ${st.name} approved! Fixed amount ${inr(amount)} sanctioned and queued for disbursement.`
    });
    setApproveConfirmApp(null);
  };

  // Execution: Bulk Approve
  const executeBulkApprove = () => {
    const targetApps = apps.filter((a) => selectedIds.includes(a.id) && (a.status === 'Submitted' || a.status === 'UnderReview'));
    if (!targetApps.length) {
      setNotice({ type: 'info', text: 'No pending applications selected for bulk approval.' });
      setBulkApproveConfirm(false);
      return;
    }

    const now = todayIso();
    const approverName = 'Principal — Mr. Sharma';

    setApps((prev) =>
      prev.map((a) => {
        if (!selectedIds.includes(a.id) || (a.status !== 'Submitted' && a.status !== 'UnderReview')) return a;
        const sc = schemeById(a.schemeId);
        const amount = getSchemeAwardAmount(a);
        const pct = sc.basis === 'Percent' ? sc.pct : undefined;
        return {
          ...a,
          status: 'Approved',
          award: {
            amount,
            pct,
            awardedOn: now,
            by: approverName,
            remarks: 'Bulk approved via Master criteria verification'
          },
          history: [
            ...a.history,
            {
              on: now,
              by: approverName,
              action: `Bulk approved at fixed Master amount: ${inr(amount)}`
            }
          ]
        };
      })
    );

    targetApps.forEach((a) => {
      const sc = schemeById(a.schemeId);
      const amount = getSchemeAwardAmount(a);
      const pct = sc.basis === 'Percent' ? sc.pct : undefined;
      upsertPendingDisbursement(a, amount, pct);
    });

    setNotice({
      type: 'success',
      text: `Successfully approved ${targetApps.length} applications at fixed Master defined amounts! All queued in Disbursement.`
    });
    setBulkApproveConfirm(false);
    setSelectedIds([]);
  };

  // Execution: Reject
  const executeReject = (app: ScholarshipApplication, reason: string, notifyParent: boolean) => {
    const st = studentById(app.studentId);
    const now = todayIso();
    const approverName = 'Scholarship Committee';

    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== app.id) return a;
        return {
          ...a,
          status: 'Rejected',
          history: [
            ...a.history,
            {
              on: now,
              by: approverName,
              action: `Rejected: ${reason}${notifyParent ? ' (Parent notified via SMS & portal alert)' : ''}`
            }
          ]
        };
      })
    );

    setNotice({
      type: 'info',
      text: `Application ${app.appNo} for ${st.name} was rejected. ${notifyParent ? 'Parent notified.' : ''}`
    });
    setRejectDialogApp(null);
  };

  // Execution: Put On Hold
  const executePutOnHold = (app: ScholarshipApplication, reason: string, pendingDocs: string[]) => {
    const st = studentById(app.studentId);
    const now = todayIso();
    const approverName = 'Scholarship Committee';

    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== app.id) return a;
        return {
          ...a,
          status: 'OnHold',
          history: [
            ...a.history,
            {
              on: now,
              by: approverName,
              action: `Put on hold: ${reason}. Documents required: ${pendingDocs.join(', ') || 'Clarification required'}`
            }
          ]
        };
      })
    );

    setNotice({
      type: 'info',
      text: `Application ${app.appNo} for ${st.name} placed On Hold. Student requested to submit pending documents.`
    });
    setHoldDialogApp(null);
  };

  // Export current table view to CSV
  const handleExportCsv = () => {
    const headers = [
      'App No',
      'Student Name',
      'GR No',
      'Class',
      'Scheme Name',
      'Scheme Type',
      'Application Status',
      'Fixed Amount (Master)',
      'Academic %',
      'Attendance %',
      'Family Income',
      'Govt Tracking Status'
    ];
    const rows = filteredApps.map((a) => {
      const st = studentById(a.studentId);
      const sc = schemeById(a.schemeId);
      return [
        a.appNo,
        st.name,
        st.grNo,
        classLabel(st),
        sc?.name || a.schemeId,
        sc?.kind || 'Internal',
        a.status,
        getSchemeAwardAmount(a),
        `${a.marks}%`,
        `${a.attendance}%`,
        a.familyIncome,
        a.tracking?.status || 'N/A'
      ];
    });

    downloadText(`scholarship-approval-list-${todayIso()}.csv`, toCsv([headers, ...rows]));
    setNotice({ type: 'success', text: `Exported ${filteredApps.length} records to CSV.` });
  };

  // Print current table view
  const handlePrintTable = () => {
    const headers = ['#', 'App No', 'Student', 'Class', 'Scheme', 'Fixed Amount', 'Status', 'Eligibility'];
    const rows = filteredApps.map((a, i) => {
      const st = studentById(a.studentId);
      const sc = schemeById(a.schemeId);
      const ev = sc && st ? evaluateApplication(a, sc, st) : undefined;
      return [
        String(i + 1),
        a.appNo,
        st.name,
        classLabel(st),
        sc?.name || a.schemeId,
        inr(getSchemeAwardAmount(a)),
        a.status,
        ev?.passAll ? 'Eligible' : ev?.passCritical ? 'Partial' : 'Not Eligible'
      ];
    });

    printHtml(
      htmlDoc(
        'Scholarship Approval & Sanction Register',
        `Scholarship Approval & Sanction Register (AY ${ACADEMIC_YEAR})`,
        `<p class="meta">Generated on ${formatDateLong(todayIso())} · Total Records: ${filteredApps.length}</p>` +
          htmlTable(headers, rows)
      )
    );
  };

  return (
    <div className="space-y-6 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">

            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Scholarship Approval &amp; Award Management <Badge variant="success" className="text-xs font-semibold"> AY {ACADEMIC_YEAR} </Badge>
                  </h1>
                  <p className="text-xs text-gray-500">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> <span>Strict Policy: Scholarship amounts are read-only and governed solely by Master Scheme rules</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={!filteredApps.length}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintTable} disabled={!filteredApps.length}>
            <Printer className="w-4 h-4" />
            Print Register
          </Button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm transition-all shadow-sm ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : notice.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
        >
          <span className="flex items-center gap-2 font-medium">
            {notice.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            ) : notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Info className="w-4 h-4 text-indigo-600" />
            )}
            {notice.text}
          </span>
          <button onClick={() => setNotice(null)} className="p-1 rounded hover:bg-black/5 text-gray-500" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Applications</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpiTotalApps}</h3>
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 font-medium">
                <FileText className="w-3.5 h-3.5" /> Across {SCHOLARSHIP_SCHEMES.length} Active Schemes
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Approval</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpiPendingApproval}</h3>
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> Awaiting Committee / Principal Action
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hourglass className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved Internal</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{inr(kpiInternalTotalAmount)}</h3>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> {kpiApprovedInternal.length} Students Awarded
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600 bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Govt Sanctioned</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{inr(kpiGovtTotalSanctioned)}</h3>
              <p className="text-xs text-purple-600 mt-1 flex items-center gap-1 font-medium">
                <Landmark className="w-3.5 h-3.5" /> {kpiGovtSanctioned.length} Govt Candidates
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 2: Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          All Applications ({apps.length})
        </button>

        <button
          onClick={() => setActiveTab('govt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'govt'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Government Scholarships ({apps.filter((a) => schemeById(a.schemeId)?.kind === 'Government').length})
        </button>

        <button
          onClick={() => setActiveTab('internal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'internal'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Internal Scholarships ({apps.filter((a) => schemeById(a.schemeId)?.kind === 'Internal').length})
        </button>

        <button
          onClick={() => setActiveTab('urgent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ml-auto ${
            activeTab === 'urgent'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Urgent / Expiring ({kpiUrgentApplications.length})
        </button>
      </div>

      {/* SECTION 3: Multi-Criteria Filtering Bar & Bulk Actions */}
      <Card noPadding className="p-4 bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by Student, GR, App No, Aadhaar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div>
            <Select
              label=""
              value={schemeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSchemeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Schemes' },
                ...SCHOLARSHIP_SCHEMES.map((s) => ({ value: s.id, label: s.name }))
              ]}
            />
          </div>

          <div>
            <Select
              label=""
              value={classFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClassFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Classes' },
                ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => ({
                  value: String(c),
                  label: `Class ${romanClass(c)}`
                }))
              ]}
            />
          </div>

          <div>
            <Select
              label=""
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'Submitted', label: 'Submitted' },
                { value: 'UnderReview', label: 'Under Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Awarded', label: 'Awarded' },
                { value: 'OnHold', label: 'On Hold' },
                { value: 'Rejected', label: 'Rejected' }
              ]}
            />
          </div>

          <div>
            <Select
              label=""
              value={eligibilityFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEligibilityFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Eligibility' },
                { value: 'ELIGIBLE', label: 'Eligible Only' },
                { value: 'PARTIAL', label: 'Partial (Docs Pending)' },
                { value: 'NOT_ELIGIBLE', label: 'Not Eligible' }
              ]}
            />
          </div>
        </div>

        {/* Selected Rows Bulk Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">
              Showing {filteredApps.length} of {apps.length} applications
            </span>
            {selectedIds.length > 0 && (
              <Badge variant="info" className="font-mono">
                {selectedIds.length} selected
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setBulkApproveConfirm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bulk Approve ({selectedIds.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedIds([]);
                    setNotice({ type: 'info', text: 'Cleared selection.' });
                  }}
                >
                  Clear Selection
                </Button>
              </>
            )}
            {(schemeFilter !== 'ALL' ||
              classFilter !== 'ALL' ||
              statusFilter !== 'ALL' ||
              eligibilityFilter !== 'ALL' ||
              searchQuery.trim()) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSchemeFilter('ALL');
                  setClassFilter('ALL');
                  setStatusFilter('ALL');
                  setEligibilityFilter('ALL');
                  setSearchQuery('');
                  setGovtStatusFilter('ALL');
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 4: Main Applications Approval Table */}
      <Card noPadding className="overflow-hidden border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" data-testid="approval-table">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={filteredApps.length > 0 && selectedIds.length === filteredApps.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all rows"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-3">Student &amp; Basic Info</th>
                <th className="p-3">Applied Scheme</th>
                <th className="p-3">Academic &amp; Attendance</th>
                <th className="p-3">Annual Income</th>
                <th className="p-3">Fixed Scheme Amount</th>
                <th className="p-3">Eligibility Status</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredApps.map((a, idx) => {
                const st = studentById(a.studentId);
                const sc = schemeById(a.schemeId);
                const ev = sc && st ? evaluateApplication(a, sc, st) : undefined;
                const isSelected = selectedIds.includes(a.id);
                const fixedAmount = getSchemeAwardAmount(a);

                return (
                  <tr
                    key={a.id}
                    className={`hover:bg-indigo-50/30 transition-colors ${
                      isSelected ? 'bg-indigo-50/60' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(a.id)}
                        aria-label={`Select ${st.name}`}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs shrink-0">
                          {st.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => setDetailApp(a)}>
                            {st.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            GR: {st.grNo} · Adm: {st.admissionNo} · Class {classLabel(st)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-medium text-gray-900">{sc?.name || a.schemeId}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant={sc?.kind === 'Government' ? 'info' : 'outline'} className="text-[10px] px-1.5 py-0">
                          {sc?.kind}
                        </Badge>
                        <span className="text-xs text-gray-500 font-mono">{a.appNo}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium text-gray-900">Marks: <span className="font-semibold text-indigo-700">{a.marks}%</span></p>
                        <p className="text-gray-500">Attendance: {a.attendance}%</p>
                      </div>
                    </td>

                    <td className="p-3">
                      <p className="font-medium text-gray-900">{inr(a.familyIncome)}</p>
                      <p className="text-[11px] text-gray-500">
                        {st.isBPL ? 'BPL Card' : st.isEWS ? 'EWS Category' : a.category}
                      </p>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" title="Read-only fixed amount defined in Master" />
                        <div>
                          <p className="font-bold text-gray-900 font-mono">{inr(fixedAmount)}</p>
                          <p className="text-[10px] text-gray-500">
                            {sc?.basis === 'Percent' ? `${sc.pct}% Tuition Waiver` : 'Fixed Master Grant'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <EligibilityPill evaluation={ev} />
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        <StatusBadge status={a.status} />
                        {a.tracking && (
                          <div>
                            <GovtStatusPill status={a.tracking.status} />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setDetailApp(a)}
                          title="View Complete Profile & Verification Checklist"
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {(a.status === 'Submitted' || a.status === 'UnderReview' || a.status === 'OnHold') && (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setApproveConfirmApp(a)}
                              title="Approve at Fixed Master Amount"
                              className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setHoldDialogApp(a)}
                              title="Put Application On Hold"
                              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setRejectDialogApp(a)}
                              title="Reject Application"
                              className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {sc?.kind === 'Government' && a.tracking?.status === 'To Submit' && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setPortalFor(a)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 text-[11px]"
                          >
                            <Send className="w-3 h-3" /> Portal
                          </Button>
                        )}

                        {sc?.kind === 'Government' && a.tracking?.status === 'Pending' && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setDecisionFor(a)}
                            className="text-amber-700 border-amber-300 hover:bg-amber-50 text-[11px]"
                          >
                            Govt Result
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-gray-300" />
                      <p className="font-medium text-gray-600">No applications match the current filter selection</p>
                      <p className="text-xs text-gray-400">Try broadening your search or resetting active filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 6 & 7: Dual Progress Trackers (Internal & Government) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* SECTION 6: Internal Scholarship Progress Tracker */}
        <Card className="border border-gray-200 shadow-sm bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900">Internal Scholarship Progress Tracker</h3>
              </div>
              <Badge variant="info">Master Scheme Rules</Badge>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Select
                    label="Active Scheme"
                    value={trackerSchemeId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTrackerSchemeId(e.target.value)}
                    options={internalSchemes.map((s) => ({
                      value: s.id,
                      label: `${s.name} (${s.basis === 'Percent' ? `${s.pct}% Waiver` : inr(s.amount || 0)})`
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Academic Year</label>
                  <p className="text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-md py-2 px-3">
                    {ACADEMIC_YEAR}
                  </p>
                </div>
              </div>

              {/* Progress Gauges */}
              {(() => {
                const schemeApps = apps.filter((a) => a.schemeId === trackerScheme.id);
                const approvedCount = schemeApps.filter((a) => a.status === 'Approved' || a.status === 'Awarded').length;
                const underReviewCount = schemeApps.filter((a) => a.status === 'Submitted' || a.status === 'UnderReview').length;
                const totalSeats = trackerScheme.seats || 20;
                const seatsPct = Math.min(100, Math.round((approvedCount / totalSeats) * 100));

                const allocatedBudget = approvedCount * (trackerScheme.amount || 30000);
                const totalBudget = trackerScheme.budget || 600000;
                const budgetPct = Math.min(100, Math.round((allocatedBudget / totalBudget) * 100));

                return (
                  <div className="space-y-4 pt-2">
                    {/* Seats Utilized */}
                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                        <span className="text-gray-700 font-semibold">Seats Sanctioned &amp; Pipeline</span>
                        <span className="font-bold text-indigo-700">
                          {approvedCount} / {totalSeats} Seats ({seatsPct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-indigo-600 transition-all"
                          style={{ width: `${(approvedCount / totalSeats) * 100}%` }}
                          title={`Approved: ${approvedCount}`}
                        />
                        <div
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: `${(underReviewCount / totalSeats) * 100}%` }}
                          title={`In Pipeline: ${underReviewCount}`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" /> Approved: {approvedCount}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" /> Pipeline / In Review: {underReviewCount}
                        </span>
                        <span className="text-gray-600 font-medium">Available: {Math.max(0, totalSeats - approvedCount)}</span>
                      </div>
                    </div>

                    {/* Budget Utilized */}
                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                        <span className="text-gray-700 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-gray-400" /> Fixed Master Budget Allocation
                        </span>
                        <span className={`font-bold ${allocatedBudget > totalBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {inr(allocatedBudget)} of {inr(totalBudget)} ({budgetPct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            allocatedBudget > totalBudget ? 'bg-rose-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(100, budgetPct)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2 flex justify-between">
                        <span>Remaining Budget Balance: {inr(Math.max(0, totalBudget - allocatedBudget))}</span>
                        <span className="font-medium text-emerald-700">Read-Only Cap</span>
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Scheme Provider: {trackerScheme.provider}</span>
            <span className="font-medium text-indigo-600">Committee Approver: Principal — Mr. Sharma</span>
          </div>
        </Card>

        {/* SECTION 7: Government Scholarship Progress Tracker */}
        <Card className="border border-gray-200 shadow-sm bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-gray-900">Government Scholarship &amp; DBT Tracker</h3>
              </div>
              <Badge variant="success">NSP / State Portal Sync</Badge>
            </div>

            {/* 6-Stage Workflow Stepper */}
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-6 gap-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-center text-[10px]">
                {[
                  { step: '1', title: 'Student Form', status: 'done' },
                  { step: '2', title: 'School Verification', status: 'done' },
                  { step: '3', title: 'Portal Submitted', status: 'active' },
                  { step: '4', title: 'Dept Sanction', status: 'pending' },
                  { step: '5', title: 'PFMS Generation', status: 'pending' },
                  { step: '6', title: 'Bank DBT Direct', status: 'pending' }
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 ${
                        st.status === 'done'
                          ? 'bg-emerald-600 text-white'
                          : st.status === 'active'
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {st.step}
                    </div>
                    <span className="font-medium leading-tight text-gray-700">{st.title}</span>
                  </div>
                ))}
              </div>

              {/* Status Breakdown Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold">
                    <tr>
                      <th className="p-2 text-left">Portal Stage</th>
                      <th className="p-2 text-center">Candidates</th>
                      <th className="p-2 text-right">Sanctioned Amount</th>
                      <th className="p-2 text-right">Action / Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {GOVT_ORDER.map((stage) => {
                      const count = apps.filter((a) => a.tracking?.status === stage).length;
                      const amount = apps
                        .filter((a) => a.tracking?.status === stage)
                        .reduce((sum, a) => sum + (a.tracking?.amountApproved || getSchemeAwardAmount(a)), 0);

                      return (
                        <tr key={stage} className="hover:bg-gray-50">
                          <td className="p-2 flex items-center gap-1.5 font-medium">
                            <span>{GOVT_META[stage]?.icon}</span>
                            <span>{stage}</span>
                          </td>
                          <td className="p-2 text-center font-bold">{count}</td>
                          <td className="p-2 text-right font-mono font-medium">
                            {stage === 'Approved' || stage === 'Disbursed' ? inr(amount) : '—'}
                          </td>
                          <td className="p-2 text-right">
                            {stage === 'To Submit' && count > 0 && (
                              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                                Upload Pending
                              </span>
                            )}
                            {stage === 'Pending' && count > 0 && (
                              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                                Check NSP Portal
                              </span>
                            )}
                            {stage === 'Approved' && count > 0 && (
                              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                                Awaiting PFMS DBT
                              </span>
                            )}
                            {stage === 'Rejected' && count > 0 && (
                              <span className="text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                                Clarify Reason
                              </span>
                            )}
                            {stage === 'Disbursed' && count > 0 && (
                              <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                                Credited via DBT
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Govt Portals: NSP (National) &amp; Digital Gujarat</span>
            <span className="text-blue-700 font-medium">NPCI Direct Benefit Transfer Mode</span>
          </div>
        </Card>
      </div>

      {/* SECTION 5: Comprehensive Student Detail Overview Modal (8-10 Panels) */}
      {detailApp && (
        <StudentDetailModal
          app={detailApp}
          onClose={() => setDetailApp(null)}
          onApprove={(remarks) => executeApprove(detailApp, remarks)}
          onReject={() => setRejectDialogApp(detailApp)}
          onHold={() => setHoldDialogApp(detailApp)}
          onOpenPortal={() => setPortalFor(detailApp)}
          onOpenDecision={() => setDecisionFor(detailApp)}
        />
      )}

      {/* Action Dialog: Approve Confirmation */}
      {approveConfirmApp && (
        <Modal
          isOpen
          onClose={() => setApproveConfirmApp(null)}
          title="Confirm Scholarship Sanction &amp; Approval"
          size="md"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setApproveConfirmApp(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => executeApprove(approveConfirmApp, 'Approved as per scheme criteria and master definition')}
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Approval &amp; Queue Disbursement
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="font-semibold text-emerald-900">
                Sanction Scholarship for {studentById(approveConfirmApp.studentId).name}
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                App No: <span className="font-mono font-medium">{approveConfirmApp.appNo}</span> · Scheme:{' '}
                <strong>{schemeById(approveConfirmApp.schemeId)?.name}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <span className="text-gray-500 block">Fixed Award Amount</span>
                <span className="font-mono font-bold text-gray-900 text-base">
                  {inr(getSchemeAwardAmount(approveConfirmApp))}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Mode</span>
                <span className="font-semibold text-gray-900">
                  {schemeById(approveConfirmApp.schemeId)?.mode === 'Cash' ? 'Direct Bank (NEFT)' : 'Fee Concession Waiver'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Approver</span>
                <span className="font-medium text-gray-900">Principal — Mr. Sharma</span>
              </div>
              <div>
                <span className="text-gray-500 block">Disbursement Destination</span>
                <span className="font-medium text-emerald-700">Auto-queued in Scholarship Disbursement</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Amount is fixed as per Master definition and cannot be manually overridden.
            </p>
          </div>
        </Modal>
      )}

      {/* Action Dialog: Bulk Approve Confirmation */}
      {bulkApproveConfirm && (
        <Modal
          isOpen
          onClose={() => setBulkApproveConfirm(false)}
          title="Confirm Bulk Scholarship Sanction"
          size="md"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setBulkApproveConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={executeBulkApprove}
              >
                <CheckCircle2 className="w-4 h-4" /> Sanction All Selected
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              You have selected <strong>{selectedIds.length}</strong> applications for sanction. All eligible candidates
              will be approved strictly at their Master Scheme defined amounts.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Automatic Fee Waiver &amp; Payment Queueing
              </p>
              <p>
                Each approved scholarship automatically generates a pending entry in the{' '}
                <strong>Scholarship Disbursement Register</strong> ready for journal voucher posting.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Dialog: Reject Form */}
      {rejectDialogApp && (
        <RejectModal
          app={rejectDialogApp}
          onClose={() => setRejectDialogApp(null)}
          onReject={(reason, notifyParent) => executeReject(rejectDialogApp, reason, notifyParent)}
        />
      )}

      {/* Action Dialog: Put On Hold Form */}
      {holdDialogApp && (
        <HoldModal
          app={holdDialogApp}
          onClose={() => setHoldDialogApp(null)}
          onHold={(reason, docs) => executePutOnHold(holdDialogApp, reason, docs)}
        />
      )}

      {/* Portal Submit Modal */}
      {portalFor && (
        <PortalSubmitModal
          app={portalFor}
          scheme={schemeById(portalFor.schemeId)!}
          onClose={() => setPortalFor(null)}
          onSubmit={(ref, date) => {
            const st = studentById(portalFor.studentId);
            setApps((prev) =>
              prev.map((a) =>
                a.id === portalFor.id && a.tracking
                  ? {
                      ...a,
                      tracking: { ...a.tracking, status: 'Pending', portalRef: ref, submittedOn: date },
                      history: [
                        ...a.history,
                        {
                          on: todayIso(),
                          by: 'Scholarship Nodal Office',
                          action: `Uploaded & submitted on ${schemeById(portalFor.schemeId)?.portal} (Ref: ${ref})`
                        }
                      ]
                    }
                  : a
              )
            );
            setNotice({
              type: 'success',
              text: `${st.name} submitted on portal with Reference: ${ref}. Moved to Portal Pending.`
            });
            setPortalFor(null);
          }}
        />
      )}

      {/* Govt Decision Modal */}
      {decisionFor && (
        <GovtDecisionModal
          app={decisionFor}
          scheme={schemeById(decisionFor.schemeId)!}
          onClose={() => setDecisionFor(null)}
          onSave={(res) => {
            const st = studentById(decisionFor.studentId);
            const govtSc = schemeById(decisionFor.schemeId)!;
            if (res.approved) {
              setApps((prev) =>
                prev.map((a) =>
                  a.id === decisionFor.id && a.tracking
                    ? {
                        ...a,
                        tracking: {
                          ...a.tracking,
                          status: 'Approved',
                          amountApproved: res.amount,
                          decisionOn: res.date
                        },
                        history: [
                          ...a.history,
                          {
                            on: todayIso(),
                            by: 'State Portal Sync',
                            action: `Govt Sanctioned: ${inr(res.amount)}`
                          }
                        ]
                      }
                    : a
                )
              );
              upsertPendingDisbursement(
                decisionFor,
                res.amount,
                govtSc.mode === 'Fee Waiver' ? Math.round((res.amount / st.annualFee) * 1000) / 10 : undefined
              );
              setNotice({
                type: 'success',
                text: `${st.name}: Govt approved ${inr(res.amount)}. Added to Scholarship Disbursement.`
              });
            } else {
              setApps((prev) =>
                prev.map((a) =>
                  a.id === decisionFor.id && a.tracking
                    ? {
                        ...a,
                        tracking: {
                          ...a.tracking,
                          status: 'Rejected',
                          rejectReason: res.reason,
                          decisionOn: res.date
                        },
                        history: [
                          ...a.history,
                          {
                            on: todayIso(),
                            by: 'State Portal Sync',
                            action: `Govt Rejected: ${res.reason}`
                          }
                        ]
                      }
                    : a
                )
              );
              setNotice({
                type: 'info',
                text: `${st.name}: Govt portal rejection noted (${res.reason}).`
              });
            }
            setDecisionFor(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// STUDENT DETAIL OVERVIEW MODAL (8-10 Tabs with Side-by-Side Verification)
// ============================================================================
function StudentDetailModal({
  app,
  onClose,
  onApprove,
  onReject,
  onHold,
  onOpenPortal,
  onOpenDecision
}: {
  app: ScholarshipApplication;
  onClose: () => void;
  onApprove: (remarks: string) => void;
  onReject: () => void;
  onHold: () => void;
  onOpenPortal: () => void;
  onOpenDecision: () => void;
}) {
  const st = studentById(app.studentId);
  const sc = schemeById(app.schemeId);
  const ev = sc && st ? evaluateApplication(app, sc, st) : undefined;

  // Tabs
  type DetailTab =
    | 'student_info'
    | 'academics'
    | 'family_financial'
    | 'eligibility_check'
    | 'documents'
    | 'history'
    | 'audit_trail'
    | 'approver_remarks'
    | 'govt_workflow';

  const [activeTab, setActiveTab] = useState<DetailTab>('student_info');
  const [approverRemarks, setApproverRemarks] = useState(app.award?.remarks || '');

  return (
    <Modal isOpen onClose={onClose} title="" size="xl">
      <div className="space-y-5 -mt-3 text-gray-800">
        {/* Student Header Bar — ERP card styling, matches the rest of the page */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
              {st.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{st.name}</h2>
                <Badge variant="info" className="text-xs">{app.appNo}</Badge>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-xs text-gray-600 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <span>GR: <strong className="text-gray-900">{st.grNo}</strong></span>
                <span>Admission: <strong className="text-gray-900">{st.admissionNo}</strong></span>
                <span>Class: <strong className="text-gray-900">{classLabel(st)}</strong></span>
                <span>Aadhaar: <strong className="font-mono text-gray-900">{st.aadharNo || st.aadhaarNumber || 'XXXX-XXXX-4819'}</strong></span>
              </p>
            </div>
          </div>

          <div className="sm:text-right sm:border-l sm:border-gray-200 sm:pl-4">
            <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Master Defined Fixed Amount</span>
            <span className="text-2xl font-mono font-bold text-emerald-700">
              {inr(defaultAward(sc, st.annualFee).amount)}
            </span>
            <span className="text-[11px] text-gray-500 block mt-0.5">
              {sc.name} ({sc.kind})
            </span>
          </div>
        </div>

        {/* Modal Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto text-xs font-semibold gap-1">
          {[
            { id: 'student_info', label: '1. Student Info', icon: UserCheck },
            { id: 'academics', label: '2. Academics', icon: GraduationCap },
            { id: 'family_financial', label: '3. Family & Financial', icon: Landmark },
            { id: 'eligibility_check', label: '4. Eligibility Check', icon: Sparkles },
            { id: 'documents', label: '5. Documents', icon: FileCheck },
            { id: 'history', label: '6. Scholarship History', icon: History },
            { id: 'audit_trail', label: '7. Review Trail', icon: Clock3 },
            { id: 'approver_remarks', label: '8. Remarks & Sanction', icon: SlidersHorizontal },
            ...(sc.kind === 'Government'
              ? [{ id: 'govt_workflow' as const, label: '9. Govt Portal & DBT', icon: Building2 }]
              : [])
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as DetailTab)}
                className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-md'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[300px] max-h-[55vh] overflow-y-auto pr-1 text-sm">
          {/* TAB 1: Student Information */}
          {activeTab === 'student_info' &&
          <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Student Profile
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 divide-gray-100">
                  <div className="p-4 sm:border-r border-gray-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Full Name</span>
                    <span className="font-semibold text-gray-900">{st.name}</span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">
                      GR {st.grNo} · Adm {st.admissionNo} · {classLabel(st)}-{st.section}
                    </span>
                  </div>
                  <div className="p-4 sm:border-r border-gray-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Gender &amp; Date of Birth</span>
                    <span className="font-medium text-gray-900">
                      {st.gender} · {st.dateOfBirth || st.dob || '14-May-2009'}
                    </span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">Category: {app.category}</span>
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Aadhaar Number</span>
                    <span className="font-mono font-semibold text-indigo-700">
                      {st.aadharNo || st.aadhaarNumber || 'XXXX-XXXX-4819'}
                    </span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">RTE Quota: {app.isRTE ? 'Yes (25%)' : 'No'}</span>
                  </div>
                  <div className="p-4 sm:border-r border-gray-100 sm:border-t">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Contact Phone</span>
                    <span className="font-medium text-gray-900">{st.phone}</span>
                  </div>
                  <div className="p-4 sm:border-r border-gray-100 sm:border-t">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Email Address</span>
                    <span className="font-medium text-gray-900 break-all">{st.email}</span>
                  </div>
                  <div className="p-4 sm:border-t border-gray-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Permanent Address</span>
                    <span className="font-medium text-gray-900">
                      {st.permanentAddress || 'Plot 42, Shanti Nagar, SG Highway, Ahmedabad, Gujarat - 380054'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank & DBT Account */}
              <div className="rounded-xl border border-emerald-200 overflow-hidden">
                <div className="bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-200 flex items-center gap-2">
                  <Landmark className="w-3.5 h-3.5 text-emerald-600" /> Student Bank Account &amp; NPCI Aadhaar Seeding
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 divide-emerald-100 bg-emerald-50/40">
                  <div className="p-4 sm:border-r border-emerald-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Account Holder</span>
                    <span className="font-medium text-gray-900">{app.bank?.holder || st.bank.holder}</span>
                  </div>
                  <div className="p-4 sm:border-r border-emerald-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Account Number</span>
                    <span className="font-mono font-medium text-gray-900">{app.bank?.accountNo || st.bank.accountNo}</span>
                  </div>
                  <div className="p-4 sm:border-r border-emerald-100">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">IFSC &amp; Branch</span>
                    <span className="font-mono font-medium text-gray-900">
                      {app.bank?.ifsc || st.bank.ifsc} ({st.bank.branch || 'Navrangpura'})
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Aadhaar DBT Seeding</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active &amp; Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* TAB 2: Academics */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                  <span className="text-xs text-indigo-700 font-semibold uppercase">Previous Year Marks</span>
                  <h4 className="text-2xl font-bold text-indigo-900 mt-1">{app.marks}%</h4>
                  <p className="text-xs text-indigo-600 mt-0.5">Verified Report Card</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <span className="text-xs text-emerald-700 font-semibold uppercase">Attendance</span>
                  <h4 className="text-2xl font-bold text-emerald-900 mt-1">{app.attendance}%</h4>
                  <p className="text-xs text-emerald-600 mt-0.5">Biometric / Register</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-center">
                  <span className="text-xs text-purple-700 font-semibold uppercase">Sports &amp; Conduct</span>
                  <h4 className="text-xl font-bold text-purple-900 mt-1">{app.sportsLevel}</h4>
                  <p className="text-xs text-purple-600 mt-0.5">Conduct: {app.conduct}</p>
                </div>
              </div>

              {/* Year-by-Year Academic Track */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 uppercase border-b border-gray-200">
                  Academic History in School
                </div>
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="p-2.5 text-left">Class</th>
                      <th className="p-2.5 text-left">Academic Year</th>
                      <th className="p-2.5 text-right">Overall %</th>
                      <th className="p-2.5 text-right">Attendance</th>
                      <th className="p-2.5 text-left">Result / Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-900">Class {classLabel(st)} (Current)</td>
                      <td className="p-2.5">AY 2025-26</td>
                      <td className="p-2.5 text-right font-bold text-indigo-700">{app.marks}%</td>
                      <td className="p-2.5 text-right">{app.attendance}%</td>
                      <td className="p-2.5 text-emerald-700 font-medium">Top 5% in Division</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Class {romanClass(Math.max(1, st.cls - 1))}</td>
                      <td className="p-2.5">AY 2024-25</td>
                      <td className="p-2.5 text-right font-medium">{Math.max(60, app.marks - 2)}%</td>
                      <td className="p-2.5 text-right">{Math.max(75, app.attendance - 1)}%</td>
                      <td className="p-2.5 text-gray-600">Passed with Distinction</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Family & Financial */}
          {activeTab === 'family_financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 block">Father&apos;s Name</span>
                  <span className="font-medium text-gray-900">{st.fatherName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Father Occupation</span>
                  <span className="font-medium text-gray-900">{st.fatherOccupation || 'Private Sector / Employee'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Mother&apos;s Name</span>
                  <span className="font-medium text-gray-900">{st.motherName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Mother Occupation</span>
                  <span className="font-medium text-gray-900">{st.motherOccupation || 'Homemaker'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Annual Family Income</span>
                  <span className="text-base font-bold text-indigo-700 font-mono">{inr(app.familyIncome)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">BPL / EWS Status</span>
                  <span className="font-medium text-gray-900">
                    {st.isBPL ? 'BPL Card Verified' : st.isEWS ? 'EWS Certificate' : 'Non-EWS'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Disability Status</span>
                  <span className="font-medium text-gray-900">
                    {st.isDisabled || st.disability ? `${st.disabilityType || 'PWD'} (40%)` : 'None (General)'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Annual School Fee</span>
                  <span className="font-mono font-medium text-gray-900">{inr(st.annualFee)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Income Certificate Verification:</strong> Issued by Competent Revenue Authority / Taluka Mamlatdar. Certificate validity verified for FY 2024-25.
              </div>
            </div>
          )}

          {/* TAB 4: Side-by-Side Criteria Comparison */}
          {activeTab === 'eligibility_check' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">Scheme Criteria vs Student Qualifications</span>
                </div>
                <EligibilityPill evaluation={ev} />
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold">
                    <tr>
                      <th className="p-2.5 text-left">Eligibility Parameter</th>
                      <th className="p-2.5 text-left">Scheme Master Requirement</th>
                      <th className="p-2.5 text-left">Student Actual Value</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {ev?.checks.map((chk, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-2.5 font-medium text-gray-900">{chk.label}</td>
                        <td className="p-2.5 font-mono text-gray-600">{chk.required}</td>
                        <td className="p-2.5 font-mono font-semibold text-gray-900">{chk.actual}</td>
                        <td className="p-2.5 text-center">
                          {chk.pass ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              <Check className="w-3 h-3 text-emerald-600" /> Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
                              <X className="w-3 h-3 text-rose-600" /> Fail
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-2.5 text-left">Required Document</th>
                    <th className="p-2.5 text-left">Attached Filename</th>
                    <th className="p-2.5 text-center">Verification Status</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {app.documents.map((d) => (
                    <tr key={d.name} className="hover:bg-gray-50">
                      <td className="p-2.5 font-medium text-gray-900">
                        {d.name} {d.required && <span className="text-rose-500">*</span>}
                      </td>
                      <td className="p-2.5 font-mono text-indigo-600">
                        {d.fileName || `${st.grNo}_${d.name.toLowerCase().replace(/\s+/g, '_')}.pdf`}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            d.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : d.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <Button variant="ghost" size="xs" className="text-blue-600 hover:text-blue-800 text-[11px]">
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: Scholarship History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold">
                    <tr>
                      <th className="p-2.5 text-left">Academic Year</th>
                      <th className="p-2.5 text-left">Scholarship Scheme</th>
                      <th className="p-2.5 text-left">Award Type</th>
                      <th className="p-2.5 text-right">Amount Sanctioned</th>
                      <th className="p-2.5 text-center">Disbursement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-900">AY 2024-25</td>
                      <td className="p-2.5 font-medium">School Merit Scholarship</td>
                      <td className="p-2.5">Tuition Fee Waiver (50%)</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">₹25,000</td>
                      <td className="p-2.5 text-center">
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                          Disbursed (Settled)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-900">AY 2023-24</td>
                      <td className="p-2.5 font-medium">Sports Excellence Award</td>
                      <td className="p-2.5">Special Grant</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">₹10,000</td>
                      <td className="p-2.5 text-center">
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                          Disbursed (Settled)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: Audit Review Trail */}
          {activeTab === 'audit_trail' && (
            <div className="space-y-3">
              <div className="border-l-2 border-indigo-200 pl-4 space-y-4 my-2 text-xs">
                {app.history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <p className="font-bold text-gray-900">{h.action}</p>
                    <p className="text-gray-500 mt-0.5">
                      By <span className="font-medium text-gray-700">{h.by}</span> on {formatDateLong(h.on)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: Approver Remarks & Direct Sanction */}
          {activeTab === 'approver_remarks' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase">
                  Committee / Principal Approval Remarks
                </label>
                <textarea
                  rows={3}
                  value={approverRemarks}
                  onChange={(e) => setApproverRemarks(e.target.value)}
                  placeholder="Enter formal committee remarks, justification, or sanction notes..."
                  className="w-full p-2.5 text-xs rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Authorized Approver: Principal — Mr. Sharma</span>
                  <span className="text-amber-700 font-medium">Fixed Master Amount: {inr(defaultAward(sc, st.annualFee).amount)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onHold} className="text-amber-700 border-amber-300 hover:bg-amber-50">
                  <PauseCircle className="w-4 h-4" /> Put On Hold
                </Button>
                <Button variant="outline" onClick={onReject} className="text-rose-700 border-rose-300 hover:bg-rose-50">
                  <XCircle className="w-4 h-4" /> Reject Application
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onApprove(approverRemarks)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4" /> Final Approve &amp; Sanction
                </Button>
              </div>
            </div>
          )}

          {/* TAB 9: Government Portal & DBT Workflow (If Govt Scheme) */}
          {activeTab === 'govt_workflow' && sc.kind === 'Government' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-900 text-xs uppercase">
                    {sc.portal} Portal Synchronization Details
                  </h4>
                  {app.tracking && <GovtStatusPill status={app.tracking.status} />}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Portal Scheme Code</span>
                    <span className="font-mono font-medium text-gray-900">NSP-GOV-2025-SC</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Application Reference</span>
                    <span className="font-mono font-bold text-gray-900">
                      {app.tracking?.portalRef || 'Not yet generated'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Submission Date</span>
                    <span className="font-medium text-gray-900">
                      {app.tracking?.submittedOn ? formatDate(app.tracking.submittedOn) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Sanction Order Amount</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {app.tracking?.amountApproved ? inr(app.tracking.amountApproved) : 'Awaiting Sanction'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Aadhaar Payment Bridge (APB)</span>
                    <span className="text-emerald-700 font-semibold">NPCI Active</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Decision Date</span>
                    <span className="font-medium text-gray-900">
                      {app.tracking?.decisionOn ? formatDate(app.tracking.decisionOn) : 'In Process'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200/60">
                  {app.tracking?.status === 'To Submit' && (
                    <Button variant="primary" size="xs" onClick={onOpenPortal} className="bg-blue-700 hover:bg-blue-800 text-white">
                      <Send className="w-3 h-3" /> Record Portal Submission
                    </Button>
                  )}
                  {app.tracking?.status === 'Pending' && (
                    <Button variant="outline" size="xs" onClick={onOpenDecision} className="border-blue-400 text-blue-800 hover:bg-blue-100">
                      Record Govt Portal Sanction / Rejection
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs">
          <span className="text-gray-500">
            Viewing application for <strong className="text-gray-700">{st.name}</strong>
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// REJECT MODAL FORM
// ============================================================================
function RejectModal({
  app,
  onClose,
  onReject
}: {
  app: ScholarshipApplication;
  onClose: () => void;
  onReject: (reason: string, notifyParent: boolean) => void;
}) {
  const st = studentById(app.studentId);
  const [reasonCategory, setReasonCategory] = useState('Income Exceeds Criteria');
  const [detailedRemarks, setDetailedRemarks] = useState('');
  const [notifyParent, setNotifyParent] = useState(true);

  const REJECT_REASONS = [
    'Income Exceeds Criteria',
    'Academic Marks Below Threshold',
    'Attendance Below 75%',
    'Incomplete / Invalid Documents',
    'Quota Seats Exhausted',
    'Duplicate Application',
    'Other Non-Compliance'
  ];

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Reject Application — ${st.name}`}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              const fullReason = `${reasonCategory}: ${detailedRemarks.trim() || 'Criteria not met'}`;
              onReject(fullReason, notifyParent);
            }}
          >
            <Ban className="w-4 h-4" /> Confirm Rejection
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs">
          You are rejecting application <strong>{app.appNo}</strong> for <strong>{st.name}</strong>.
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Rejection Reason Category *</label>
          <select
            value={reasonCategory}
            onChange={(e) => setReasonCategory(e.target.value)}
            className="w-full p-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {REJECT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Justification Remarks</label>
          <textarea
            rows={3}
            value={detailedRemarks}
            onChange={(e) => setDetailedRemarks(e.target.value)}
            placeholder="State specific deficiency or auditor observations..."
            className="w-full p-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={notifyParent}
            onChange={(e) => setNotifyParent(e.target.checked)}
            className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
          />
          <span>Send rejection notice with reason to parent ({st.phone}) via SMS / App Notification</span>
        </label>
      </div>
    </Modal>
  );
}

// ============================================================================
// PUT ON HOLD MODAL FORM
// ============================================================================
function HoldModal({
  app,
  onClose,
  onHold
}: {
  app: ScholarshipApplication;
  onClose: () => void;
  onHold: (reason: string, missingDocs: string[]) => void;
}) {
  const st = studentById(app.studentId);
  const [reason, setReason] = useState('Pending Document Verification');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    app.documents.filter((d) => d.status !== 'Verified').map((d) => d.name)
  );
  const [notes, setNotes] = useState('');

  const toggleDoc = (docName: string) => {
    setSelectedDocs((prev) => (prev.includes(docName) ? prev.filter((d) => d !== docName) : [...prev, docName]));
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Put Application On Hold — ${st.name}`}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => onHold(`${reason}: ${notes.trim() || 'Awaiting documents'}`, selectedDocs)}
          >
            <PauseCircle className="w-4 h-4" /> Put On Hold
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
          Application <strong>{app.appNo}</strong> will be placed in <strong>On Hold</strong> status pending student /
          parent clarification.
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Hold Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Pending Document Verification">Pending Document Verification</option>
            <option value="Income Certificate Discrepancy">Income Certificate Discrepancy</option>
            <option value="Aadhaar Seeding Unconfirmed">Aadhaar Seeding Unconfirmed</option>
            <option value="Committee Review Required">Committee Review Required</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Documents Required from Student</label>
          <div className="space-y-1.5 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {app.documents.map((d) => (
              <label key={d.name} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(d.name)}
                  onChange={() => toggleDoc(d.name)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span>
                  {d.name} {d.status !== 'Verified' && <span className="text-amber-600">({d.status})</span>}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Note for Parent / Student</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Please upload clear copy of recent Mamlatdar income certificate by 10th of this month..."
            className="w-full p-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// PORTAL SUBMISSION MODAL
// ============================================================================
function PortalSubmitModal({
  app,
  scheme,
  onClose,
  onSubmit
}: {
  app: ScholarshipApplication;
  scheme: ScholarshipScheme;
  onClose: () => void;
  onSubmit: (ref: string, date: string) => void;
}) {
  const [ref, setRef] = useState('');
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState('');
  const st = studentById(app.studentId);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Submit to ${scheme.portal || 'Government'} Portal — ${st.name}`}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          {error && (
            <p className="mr-auto text-xs text-rose-600 flex items-center gap-1" role="alert">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (ref.trim().length < 5) return setError('Enter valid Portal Application Reference No.');
              if (!date) return setError('Enter submission date.');
              onSubmit(ref.trim().toUpperCase(), date);
            }}
          >
            <Send className="w-4 h-4" /> Confirm Portal Submission
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <p className="text-xs text-gray-600">
          Enter the acknowledgement number received after uploading verified student record to{' '}
          <strong>{scheme.portal}</strong> portal.
        </p>
        <Input
          label={`Portal Reference Number (${scheme.portal}) *`}
          value={ref}
          onChange={(e) => {
            setRef(e.target.value);
            setError('');
          }}
          placeholder={scheme.portal === 'NSP' ? 'e.g. NSP-2025-001240' : 'State Portal Acknowledgement ID'}
        />
        <Input label="Portal Submission Date *" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
    </Modal>
  );
}

// ============================================================================
// GOVT DECISION MODAL
// ============================================================================
function GovtDecisionModal({
  app,
  scheme,
  onClose,
  onSave
}: {
  app: ScholarshipApplication;
  scheme: ScholarshipScheme;
  onClose: () => void;
  onSave: (r: { approved: boolean; amount: number; reason: string; date: string }) => void;
}) {
  const st = studentById(app.studentId);
  const [approved, setApproved] = useState(true);
  const [amount, setAmount] = useState(String(defaultAward(scheme, st.annualFee).amount));
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState('');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Record Govt. Portal Sanction / Decision — ${st.name}`}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          {error && (
            <p className="mr-auto text-xs text-rose-600" role="alert">
              {error}
            </p>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const n = Number(amount);
              if (approved && !(n > 0)) return setError('Enter valid sanctioned amount.');
              if (!approved && !reason.trim()) return setError('Enter rejection reason from portal.');
              onSave({ approved, amount: n, reason: reason.trim(), date });
            }}
          >
            Save Decision
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setApproved(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
              approved ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            ✅ Sanctioned / Approved
          </button>
          <button
            type="button"
            onClick={() => setApproved(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
              !approved ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            ❌ Rejected by Department
          </button>
        </div>

        {approved ? (
          <Input
            label="Sanctioned Amount (₹) *"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            helperText={`Master Scheme Default: ${inr(defaultAward(scheme, st.annualFee).amount)}`}
          />
        ) : (
          <Input
            label="Portal Rejection Reason *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Bank Account IFSC mismatch on PFMS"
          />
        )}

        <Input label="Decision Order Date *" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
    </Modal>
  );
}

export default ScholarshipApprovalSanction;
