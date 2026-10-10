import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Home,
  Moon,
  PlusCircle,
  Save,
  Search,
  Send,
  Sun,
  Sunset,
  Upload,
  X,
  XCircle
} from 'lucide-react';

type ShiftName = 'Morning' | 'Afternoon' | 'Evening';
type RequestType = 'Change' | 'Swap';
type RequestStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
type PageTab = 'all' | 'availability' | 'new';
type ViewerRole = 'HR Admin' | 'Staff';
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

interface StaffMember {
  id: string;
  name: string;
  staffType: string;
  department: string;
  designation: string;
  shift: ShiftName;
}

interface ShiftRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffType: string;
  department: string;
  currentShift: ShiftName;
  requestedShift: ShiftName | '';
  requestType: RequestType;
  swapPartnerId?: string;
  swapPartnerName?: string;
  effectiveDate: string;
  reason: string;
  documentName?: string;
  documentSize?: number;
  status: RequestStatus;
  submittedOn: string;
  decidedOn?: string;
  remarks?: string;
}

interface ShiftState {
  time: string;
  capacity: number;
  filled: number;
  minimum: number;
}

interface DraftForm {
  staffId: string;
  requestType: RequestType;
  requestedShift: ShiftName | '';
  swapPartnerId: string;
  effectiveDate: string;
  reason: string;
  documentName: string;
  documentSize: number;
}

// Current date in the user's timezone (Asia/Calcutta)
const TODAY = '2026-10-09';
// Staff member the "Staff" viewer role acts as
const CURRENT_STAFF_ID = 'EMP-1042';
const SHIFT_NAMES: ShiftName[] = ['Morning', 'Afternoon', 'Evening'];
const SHIFT_ICON: Record<ShiftName, React.ElementType> = { Morning: Sun, Afternoon: Sunset, Evening: Moon };
const MIN_REASON_LENGTH = 20;
const MIN_REMARKS_LENGTH = 10;
const MAX_DOC_BYTES = 2 * 1024 * 1024;
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MEDICAL_PATTERN = /medical|health|doctor|hospital|illness|surgery|treatment/i;
const DEPARTMENTS = ['Mathematics', 'Science', 'English', 'History', 'Administration', 'Library', 'Maintenance', 'Transport'];

// Mock calendar data (client-side only)
const HOLIDAYS: Record<string, string> = {
  '2026-10-15': 'Institute holiday',
  '2026-10-20': 'Festival holiday',
  '2026-11-08': 'Diwali holiday'
};
const EXAM_PERIODS = [{ from: '2026-10-26', to: '2026-11-05', label: 'Mid-semester examinations' }];

const INITIAL_STAFF: StaffMember[] = [
  { id: 'EMP-1042', name: 'Priya Sharma', staffType: 'Teaching', department: 'Mathematics', designation: 'Senior Teacher', shift: 'Morning' },
  { id: 'EMP-1077', name: 'Rahul Verma', staffType: 'Teaching', department: 'Science', designation: 'Teacher', shift: 'Afternoon' },
  { id: 'EMP-1103', name: 'Anita Desai', staffType: 'Teaching', department: 'English', designation: 'Teacher', shift: 'Morning' },
  { id: 'EMP-1119', name: 'Mohammed Irfan', staffType: 'Teaching', department: 'Mathematics', designation: 'Teacher', shift: 'Afternoon' },
  { id: 'EMP-1134', name: 'Sunita Patel', staffType: 'Non-Teaching', department: 'Administration', designation: 'Admin Officer', shift: 'Morning' },
  { id: 'EMP-1148', name: 'Vikram Singh', staffType: 'Support', department: 'Maintenance', designation: 'Security Supervisor', shift: 'Afternoon' },
  { id: 'EMP-1162', name: 'Neha Joshi', staffType: 'Teaching', department: 'Science', designation: 'Lab Instructor', shift: 'Morning' },
  { id: 'EMP-1175', name: 'Arjun Nair', staffType: 'Support', department: 'Maintenance', designation: 'Electrician', shift: 'Evening' },
  { id: 'EMP-1188', name: 'Kavita Rao', staffType: 'Non-Teaching', department: 'Library', designation: 'Librarian', shift: 'Morning' },
  { id: 'EMP-1196', name: 'Deepak Mishra', staffType: 'Teaching', department: 'History', designation: 'Teacher', shift: 'Afternoon' },
  { id: 'EMP-1207', name: 'Farah Khan', staffType: 'Teaching', department: 'English', designation: 'HOD', shift: 'Morning' },
  { id: 'EMP-1215', name: 'Sanjay Thakur', staffType: 'Support', department: 'Transport', designation: 'Driver', shift: 'Morning' }
];

const INITIAL_SHIFTS: Record<ShiftName, ShiftState> = {
  Morning: { time: '07:00 – 12:00', capacity: 120, filled: 90, minimum: 60 },
  Afternoon: { time: '12:00 – 17:00', capacity: 110, filled: 104, minimum: 50 },
  Evening: { time: '17:00 – 21:00', capacity: 40, filled: 40, minimum: 20 }
};

const INITIAL_DEPT_STRENGTH: Record<string, Record<ShiftName, number>> = {
  Mathematics: { Morning: 14, Afternoon: 12, Evening: 2 },
  Science: { Morning: 13, Afternoon: 11, Evening: 3 },
  English: { Morning: 12, Afternoon: 10, Evening: 2 },
  History: { Morning: 6, Afternoon: 8, Evening: 1 },
  Administration: { Morning: 9, Afternoon: 3, Evening: 1 },
  Library: { Morning: 2, Afternoon: 4, Evening: 0 },
  Maintenance: { Morning: 4, Afternoon: 3, Evening: 14 },
  Transport: { Morning: 10, Afternoon: 4, Evening: 2 }
};

const INITIAL_REQUESTS: ShiftRequest[] = [
  { id: 'SCR-2026-10411', staffId: 'EMP-1042', staffName: 'Priya Sharma', staffType: 'Teaching', department: 'Mathematics', currentShift: 'Morning', requestedShift: 'Afternoon', requestType: 'Change', effectiveDate: '2026-10-19', reason: 'Childcare arrangements for my daughter changed after her school timings were revised.', status: 'Pending', submittedOn: '2026-10-07' },
  { id: 'SCR-2026-10412', staffId: 'EMP-1077', staffName: 'Rahul Verma', staffType: 'Teaching', department: 'Science', currentShift: 'Afternoon', requestedShift: 'Morning', requestType: 'Swap', swapPartnerId: 'EMP-1162', swapPartnerName: 'Neha Joshi', effectiveDate: '2026-10-22', reason: 'Mutual swap agreed with a colleague to attend a family commitment in the afternoon.', status: 'Pending', submittedOn: '2026-10-08' },
  { id: 'SCR-2026-10413', staffId: 'EMP-1103', staffName: 'Anita Desai', staffType: 'Teaching', department: 'English', currentShift: 'Morning', requestedShift: 'Evening', requestType: 'Change', effectiveDate: '2026-10-26', reason: 'Requesting the evening batch to pursue a part-time postgraduate course this term.', status: 'Rejected', submittedOn: '2026-10-06', decidedOn: TODAY, remarks: 'Evening shift is at full capacity for this term.' },
  { id: 'SCR-2026-10414', staffId: 'EMP-1148', staffName: 'Vikram Singh', staffType: 'Support', department: 'Maintenance', currentShift: 'Evening', requestedShift: 'Afternoon', requestType: 'Change', effectiveDate: '2026-10-12', reason: 'Transport timing constraint for the daily commute; the afternoon shift is more convenient.', status: 'Approved', submittedOn: '2026-10-03', decidedOn: TODAY },
  { id: 'SCR-2026-10415', staffId: 'EMP-1188', staffName: 'Kavita Rao', staffType: 'Non-Teaching', department: 'Library', currentShift: 'Afternoon', requestedShift: 'Morning', requestType: 'Change', effectiveDate: '2026-10-06', reason: 'Reading-room hours need a morning presence and cover has been confirmed.', status: 'Approved', submittedOn: '2026-10-01', decidedOn: '2026-10-05' },
  { id: 'SCR-2026-10416', staffId: 'EMP-1134', staffName: 'Sunita Patel', staffType: 'Non-Teaching', department: 'Administration', currentShift: 'Morning', requestedShift: 'Afternoon', requestType: 'Change', effectiveDate: '2026-10-21', reason: 'Medical treatment schedule for my spouse needs an afternoon slot for the next few weeks.', documentName: 'medical-certificate.pdf', documentSize: 430080, status: 'Pending', submittedOn: '2026-10-08' }
];

const RULES: { id: number; name: string; type: 'Block' | 'Warning' | 'Auto-cancel'; when: string }[] = [
  { id: 1, name: 'Full shift', type: 'Block', when: 'The requested shift has no free slots.' },
  { id: 2, name: 'Same shift', type: 'Block', when: 'The requested shift equals the current shift.' },
  { id: 3, name: 'Pending duplicate', type: 'Block', when: 'The staff member already has a pending request.' },
  { id: 4, name: 'Holiday', type: 'Warning', when: 'The effective date is an institute holiday.' },
  { id: 5, name: 'Exam period', type: 'Warning', when: 'The effective date falls inside an exam period.' },
  { id: 6, name: 'Minimum strength', type: 'Block', when: 'The current shift would drop below its minimum staffing.' },
  { id: 7, name: 'Swap-partner auto-cancel', type: 'Auto-cancel', when: 'The partner has a pending request or is off the requested shift at approval.' },
  { id: 8, name: 'Reason length', type: 'Block', when: `The reason has fewer than ${MIN_REASON_LENGTH} characters.` },
  { id: 9, name: 'Overflow re-check', type: 'Block', when: 'At approval, the requested shift has become full since submission.' },
  { id: 10, name: 'Medical document', type: 'Warning', when: 'A medical reason is given without an attached document.' }
];

const STATUS_BADGE: Record<RequestStatus, BadgeVariant> = {
  Draft: 'secondary',
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Cancelled: 'outline'
};

const STATUS_META = {
  available: { label: 'Available', bar: 'bg-green-500', text: 'text-green-700', badge: 'success' as BadgeVariant },
  limited: { label: 'Limited', bar: 'bg-yellow-400', text: 'text-yellow-700', badge: 'warning' as BadgeVariant },
  full: { label: 'Full', bar: 'bg-red-500', text: 'text-red-700', badge: 'danger' as BadgeVariant }
};

const freeSlots = (shift: ShiftState) => Math.max(0, shift.capacity - shift.filled);

const shiftStatusOf = (shift: ShiftState): keyof typeof STATUS_META => {
  const free = freeSlots(shift);
  if (free <= 0) return 'full';
  return free / shift.capacity <= 0.2 ? 'limited' : 'available';
};

const formatDate = (iso: string) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const createDraft = (staffId: string): DraftForm => ({
  staffId,
  requestType: 'Change',
  requestedShift: '',
  swapPartnerId: '',
  effectiveDate: '',
  reason: '',
  documentName: '',
  documentSize: 0
});

// Moves one head count between shifts inside a department strength map
const moveDept = (
  map: Record<string, Record<ShiftName, number>>,
  dept: string,
  from: ShiftName,
  to: ShiftName
): Record<string, Record<ShiftName, number>> => {
  const row = map[dept] ?? { Morning: 0, Afternoon: 0, Evening: 0 };
  return { ...map, [dept]: { ...row, [from]: Math.max(0, row[from] - 1), [to]: row[to] + 1 } };
};

// Validation rules applied to the New Request form (Rules 1–8 and 10; Rule 9 and the swap part of Rule 7 run at approval)
const validateDraft = (
  draft: DraftForm,
  staffList: StaffMember[],
  shifts: Record<ShiftName, ShiftState>,
  requests: ShiftRequest[]
): { errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const staff = staffList.find((item) => item.id === draft.staffId);
  const partner = staffList.find((item) => item.id === draft.swapPartnerId);
  const reasonLength = draft.reason.trim().length;

  if (!staff) errors.push('Select a staff member in Section A.');
  if (!draft.requestedShift) errors.push('Select the requested shift in Section C.');
  if (!draft.effectiveDate) errors.push('Enter an effective date in Section E.');
  else if (draft.effectiveDate < TODAY) errors.push('The effective date cannot be in the past.');
  if (reasonLength < MIN_REASON_LENGTH) errors.push(`Rule 8: the reason needs at least ${MIN_REASON_LENGTH} characters (${reasonLength} entered).`);

  if (staff && requests.some((item) => item.staffId === staff.id && item.status === 'Pending')) {
    errors.push('Rule 3: this staff member already has a pending shift request.');
  }

  if (staff && draft.requestedShift) {
    if (draft.requestedShift === staff.shift) errors.push('Rule 2: the requested shift is the same as the current shift.');
    if (draft.requestType === 'Change') {
      if (freeSlots(shifts[draft.requestedShift]) <= 0) errors.push(`Rule 1: the ${draft.requestedShift} shift is full.`);
      const current = shifts[staff.shift];
      if (current.filled - 1 < current.minimum) {
        errors.push(`Rule 6: ${staff.shift} would fall below its minimum strength of ${current.minimum}.`);
      }
    }
  }

  if (draft.requestType === 'Swap') {
    if (!partner) {
      errors.push('Select a swap partner in Section D.');
    } else if (draft.requestedShift && partner.shift !== draft.requestedShift) {
      errors.push(`${partner.name} is not on the ${draft.requestedShift} shift, so the swap cannot go ahead.`);
    } else if (requests.some((item) => item.staffId === partner.id && item.status === 'Pending')) {
      warnings.push('Rule 7: the swap partner has a pending request. The swap will auto-cancel if it is approved.');
    }
  }

  if (draft.effectiveDate && HOLIDAYS[draft.effectiveDate]) {
    warnings.push(`Rule 4: ${formatDate(draft.effectiveDate)} is marked as ${HOLIDAYS[draft.effectiveDate]}.`);
  }
  const exam = EXAM_PERIODS.find((period) => draft.effectiveDate >= period.from && draft.effectiveDate <= period.to);
  if (draft.effectiveDate && exam) {
    warnings.push(`Rule 5: the effective date falls in ${exam.label} (${formatDate(exam.from)} to ${formatDate(exam.to)}).`);
  }
  if (draft.reason && MEDICAL_PATTERN.test(draft.reason) && !draft.documentName) {
    warnings.push('Rule 10: a medical reason was given without a supporting document. Attach one if available.');
  }

  return { errors, warnings };
};

export function ShiftViewAndSwitch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PageTab>('all');
  const [viewer, setViewer] = useState<ViewerRole>('HR Admin');
  const canDecide = viewer === 'HR Admin';
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [shifts, setShifts] = useState<Record<ShiftName, ShiftState>>(INITIAL_SHIFTS);
  const [deptStrength, setDeptStrength] = useState(INITIAL_DEPT_STRENGTH);
  const [requests, setRequests] = useState<ShiftRequest[]>(INITIAL_REQUESTS);
  const [nextSequence, setNextSequence] = useState(10417);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | RequestType>('all');
  const [shiftFilter, setShiftFilter] = useState<'all' | ShiftName>('all');
  const [showMyRequests, setShowMyRequests] = useState(true);
  const [draft, setDraft] = useState<DraftForm>(() => createDraft(INITIAL_STAFF[0].id));
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [docError, setDocError] = useState('');
  const [confirmation, setConfirmation] = useState<ShiftRequest | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [detailTarget, setDetailTarget] = useState<ShiftRequest | null>(null);
  const [approveTarget, setApproveTarget] = useState<ShiftRequest | null>(null);
  const [approveError, setApproveError] = useState('');
  const [rejectTarget, setRejectTarget] = useState<ShiftRequest | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [checkShift, setCheckShift] = useState<ShiftName>('Morning');
  const [checkDate, setCheckDate] = useState(TODAY);

  const staffById = useMemo(
    () => Object.fromEntries(staffList.map((item) => [item.id, item])) as Record<string, StaffMember>,
    [staffList]
  );
  const selectedStaff = staffById[draft.staffId];
  const partnerOptions = selectedStaff
    ? staffList.filter((item) => item.id !== selectedStaff.id && (!draft.requestedShift || item.shift === draft.requestedShift))
    : [];
  const selectedPartner = staffById[draft.swapPartnerId];
  const validation = useMemo(
    () => validateDraft(draft, staffList, shifts, requests),
    [draft, staffList, shifts, requests]
  );

  const counts = {
    pending: requests.filter((item) => item.status === 'Pending').length,
    approvedToday: requests.filter((item) => item.status === 'Approved' && item.decidedOn === TODAY).length,
    rejectedToday: requests.filter((item) => item.status === 'Rejected' && item.decidedOn === TODAY).length,
    swapPending: requests.filter((item) => item.status === 'Pending' && item.requestType === 'Swap').length
  };

  const term = search.trim().toLowerCase();
  const filteredRequests = requests
    .filter((item) =>
      (statusFilter === 'all' || item.status === statusFilter) &&
      (typeFilter === 'all' || item.requestType === typeFilter) &&
      (shiftFilter === 'all' || item.requestedShift === shiftFilter) &&
      (!term || item.staffName.toLowerCase().includes(term) || item.staffId.toLowerCase().includes(term))
    )
    .slice()
    .reverse();
  const myRequests = requests.filter((item) => item.staffId === CURRENT_STAFF_ID).slice().reverse();

  const checkInfo = shifts[checkShift];
  const checkStatus = STATUS_META[shiftStatusOf(checkInfo)];
  const checkExam = EXAM_PERIODS.find((period) => checkDate >= period.from && checkDate <= period.to);

  const changeViewer = (role: ViewerRole) => {
    setViewer(role);
    if (role === 'Staff') setDraft((current) => ({ ...current, staffId: CURRENT_STAFF_ID, swapPartnerId: '' }));
  };

  const openNewRequest = () => {
    setConfirmation(null);
    setTab('new');
  };

  const resetForm = () => {
    setDraft(createDraft(viewer === 'Staff' ? CURRENT_STAFF_ID : INITIAL_STAFF[0].id));
    setEditingDraftId(null);
    setSubmitAttempted(false);
    setDocError('');
  };

  const handleDocumentSelect = (file: File | undefined) => {
    if (!file) return;
    if (!DOC_TYPES.includes(file.type)) {
      setDocError('Only PDF, JPG or PNG files can be attached.');
      return;
    }
    if (file.size > MAX_DOC_BYTES) {
      setDocError('The document must be 2 MB or smaller.');
      return;
    }
    setDocError('');
    setDraft((current) => ({ ...current, documentName: file.name, documentSize: file.size }));
  };

  const buildRecord = (id: string, status: RequestStatus): ShiftRequest => {
    const partner = staffById[draft.swapPartnerId];
    const isSwap = draft.requestType === 'Swap';
    return {
      id,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      staffType: selectedStaff.staffType,
      department: selectedStaff.department,
      currentShift: selectedStaff.shift,
      requestedShift: draft.requestedShift,
      requestType: draft.requestType,
      swapPartnerId: isSwap ? partner?.id : undefined,
      swapPartnerName: isSwap ? partner?.name : undefined,
      effectiveDate: draft.effectiveDate,
      reason: draft.reason.trim(),
      documentName: draft.documentName || undefined,
      documentSize: draft.documentSize || undefined,
      status,
      submittedOn: TODAY
    };
  };

  const handleSaveDraft = () => {
    if (!selectedStaff) {
      setNotice({ type: 'error', text: 'Select a staff member before saving a draft.' });
      return;
    }
    const id = editingDraftId ?? `SCR-2026-${String(nextSequence).padStart(5, '0')}`;
    const record = buildRecord(id, 'Draft');
    if (editingDraftId) {
      setRequests((prev) => prev.map((item) => (item.id === editingDraftId ? record : item)));
    } else {
      setRequests((prev) => [...prev, record]);
      setNextSequence((value) => value + 1);
    }
    setEditingDraftId(id);
    setNotice({ type: 'success', text: `Draft ${id} saved. It is not sent to HR until you submit it.` });
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!selectedStaff) return;
    if (validation.errors.length > 0) {
      setNotice({ type: 'error', text: `Fix ${validation.errors.length} issue(s) in the validation summary before submitting.` });
      return;
    }
    const id = editingDraftId ?? `SCR-2026-${String(nextSequence).padStart(5, '0')}`;
    const record = buildRecord(id, 'Pending');
    if (editingDraftId) {
      setRequests((prev) => prev.map((item) => (item.id === editingDraftId ? record : item)));
    } else {
      setRequests((prev) => [...prev, record]);
      setNextSequence((value) => value + 1);
    }
    setConfirmation(record);
    setNotice(null);
    setDraft(createDraft(selectedStaff.id));
    setEditingDraftId(null);
    setSubmitAttempted(false);
    setDocError('');
  };

  const loadDraft = (item: ShiftRequest) => {
    setDraft({
      staffId: item.staffId,
      requestType: item.requestType,
      requestedShift: item.requestedShift,
      swapPartnerId: item.swapPartnerId ?? '',
      effectiveDate: item.effectiveDate,
      reason: item.reason,
      documentName: item.documentName ?? '',
      documentSize: item.documentSize ?? 0
    });
    setEditingDraftId(item.id);
    setConfirmation(null);
    setDocError('');
    setSubmitAttempted(false);
    setTab('new');
  };

  const openApprove = (item: ShiftRequest) => {
    setApproveError('');
    setApproveTarget(item);
  };

  const confirmApprove = () => {
    const req = approveTarget;
    if (!req || !req.requestedShift) return;
    const target: ShiftName = req.requestedShift;
    const partnerDept = staffById[req.swapPartnerId ?? '']?.department;

    if (req.requestType === 'Change') {
      if (freeSlots(shifts[target]) <= 0) {
        setApproveError(`Rule 9 (overflow re-check): the ${target} shift became full after submission. Approval is blocked.`);
        return;
      }
      const current = shifts[req.currentShift];
      if (current.filled - 1 < current.minimum) {
        setApproveError(`Rule 6 (minimum strength): ${req.currentShift} would fall below ${current.minimum}. Approval is blocked.`);
        return;
      }
    } else {
      const partner = staffById[req.swapPartnerId ?? ''];
      const partnerPending = requests.some((item) => item.id !== req.id && item.staffId === req.swapPartnerId && item.status === 'Pending');
      const partnerOffShift = !partner || partner.shift !== target;
      if (partnerOffShift || partnerPending) {
        const reason = partnerOffShift
          ? 'the swap partner is no longer on the requested shift'
          : 'the swap partner has a pending request';
        setRequests((prev) => prev.map((item) => (item.id === req.id
          ? { ...item, status: 'Cancelled', decidedOn: TODAY, remarks: `Auto-cancelled (Rule 7): ${reason}.` }
          : item)));
        setApproveTarget(null);
        setNotice({ type: 'error', text: `${req.id} was auto-cancelled because ${reason}.` });
        return;
      }
    }

    setRequests((prev) => prev.map((item) => (item.id === req.id ? { ...item, status: 'Approved', decidedOn: TODAY } : item)));
    if (req.requestType === 'Change') {
      setShifts((prev) => ({
        ...prev,
        [req.currentShift]: { ...prev[req.currentShift], filled: prev[req.currentShift].filled - 1 },
        [target]: { ...prev[target], filled: prev[target].filled + 1 }
      }));
      setStaffList((prev) => prev.map((item) => (item.id === req.staffId ? { ...item, shift: target } : item)));
      setDeptStrength((prev) => moveDept(prev, req.department, req.currentShift, target));
    } else {
      setStaffList((prev) => prev.map((item) => {
        if (item.id === req.staffId) return { ...item, shift: target };
        if (item.id === req.swapPartnerId) return { ...item, shift: req.currentShift };
        return item;
      }));
      setDeptStrength((prev) => {
        const afterRequester = moveDept(prev, req.department, req.currentShift, target);
        return partnerDept ? moveDept(afterRequester, partnerDept, target, req.currentShift) : afterRequester;
      });
    }
    setApproveTarget(null);
    setDetailTarget(null);
    setNotice({ type: 'success', text: `${req.id} approved. ${req.staffName} is now on the ${target} shift.` });
  };

  const openReject = (item: ShiftRequest) => {
    setRejectRemarks('');
    setRejectError('');
    setRejectTarget(item);
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    if (rejectRemarks.trim().length < MIN_REMARKS_LENGTH) {
      setRejectError(`Remarks are mandatory and must be at least ${MIN_REMARKS_LENGTH} characters.`);
      return;
    }
    const remarks = rejectRemarks.trim();
    setRequests((prev) => prev.map((item) => (item.id === rejectTarget.id
      ? { ...item, status: 'Rejected', decidedOn: TODAY, remarks }
      : item)));
    setNotice({ type: 'info', text: `${rejectTarget.id} was rejected.` });
    setRejectTarget(null);
    setDetailTarget(null);
  };

  const exportCsv = () => {
    const headers = ['Request ID', 'Staff Name', 'Employee ID', 'Staff Type', 'Department', 'Current Shift', 'Requested Shift', 'Request Type', 'Swap Partner', 'Effective Date', 'Status', 'Submitted On', 'Decided On', 'Reason', 'Document', 'Remarks'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = requests.map((item) => [
      item.id,
      item.staffName,
      item.staffId,
      item.staffType,
      item.department,
      item.currentShift,
      item.requestedShift,
      item.requestType,
      item.swapPartnerName ?? '',
      item.effectiveDate,
      item.status,
      item.submittedOn,
      item.decidedOn ?? '',
      item.reason,
      item.documentName ?? '',
      item.remarks ?? ''
    ].map(escape).join(','));
    const csv = [headers.map(escape).join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `shift-change-requests-${TODAY}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice({ type: 'success', text: `Exported ${requests.length} request record(s) to CSV.` });
  };

  const availabilityFor = (item: ShiftRequest) => {
    if (!item.requestedShift) return null;
    const info = shifts[item.requestedShift];
    return {
      free: freeSlots(info),
      capacity: info.capacity,
      status: STATUS_META[shiftStatusOf(info)],
      dept: deptStrength[item.department]?.[item.requestedShift] ?? 0,
      holiday: HOLIDAYS[item.effectiveDate],
      exam: EXAM_PERIODS.find((period) => item.effectiveDate >= period.from && item.effectiveDate <= period.to)
    };
  };

  const renderAvailability = (item: ShiftRequest) => {
    const info = availabilityFor(item);
    if (!info) return <p className="text-sm text-gray-500">No requested shift selected.</p>;
    return (
      <div className="rounded-lg border border-gray-200 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Availability check: {item.requestedShift} shift</span>
          <Badge variant={info.status.badge}>{info.status.label}</Badge>
        </div>
        <p className="text-sm text-gray-700">
          {info.free} of {info.capacity} seats free · {item.department} strength on this shift: {info.dept}
        </p>
        {info.holiday && <p className="text-xs text-amber-700">Effective date is marked as {info.holiday}.</p>}
        {info.exam && <p className="text-xs text-amber-700">Effective date falls in {info.exam.label}.</p>}
      </div>
    );
  };

  const renderRequestDetail = (item: ShiftRequest) => (
    <div className="space-y-4">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div><dt className="text-gray-500">Staff name</dt><dd className="font-medium text-gray-900">{item.staffName}</dd></div>
        <div><dt className="text-gray-500">Employee ID</dt><dd className="font-medium text-gray-900">{item.staffId}</dd></div>
        <div><dt className="text-gray-500">Staff type</dt><dd className="text-gray-900">{item.staffType}</dd></div>
        <div><dt className="text-gray-500">Department</dt><dd className="text-gray-900">{item.department}</dd></div>
        <div><dt className="text-gray-500">Current shift</dt><dd className="text-gray-900">{item.currentShift}</dd></div>
        <div><dt className="text-gray-500">Requested shift</dt><dd className="text-gray-900">{item.requestedShift || '—'}</dd></div>
        <div><dt className="text-gray-500">Request type</dt><dd className="text-gray-900">{item.requestType}</dd></div>
        <div><dt className="text-gray-500">Effective date</dt><dd className="text-gray-900">{formatDate(item.effectiveDate)}</dd></div>
        {item.requestType === 'Swap' && (
          <div><dt className="text-gray-500">Swap partner</dt><dd className="text-gray-900">{item.swapPartnerName} ({item.swapPartnerId})</dd></div>
        )}
        <div><dt className="text-gray-500">Submitted on</dt><dd className="text-gray-900">{formatDate(item.submittedOn)}</dd></div>
        <div><dt className="text-gray-500">Status</dt><dd><Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge></dd></div>
        <div><dt className="text-gray-500">Document</dt><dd className="text-gray-900">{item.documentName ? `${item.documentName} (${formatSize(item.documentSize ?? 0)})` : 'None'}</dd></div>
      </dl>
      <div>
        <p className="text-sm text-gray-500 mb-1">Reason</p>
        <p className="text-sm text-gray-900 rounded-lg bg-gray-50 p-3">{item.reason}</p>
      </div>
      {item.remarks && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Decision remarks</p>
          <p className="text-sm text-gray-900 rounded-lg bg-gray-50 p-3">{item.remarks}</p>
        </div>
      )}
      {renderAvailability(item)}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb (the global top navigation bar is app-shell level, so it is not part of this page) */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
        <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-indigo-600">
          <Home className="w-3.5 h-3.5" />
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span>HR</span>
        <ChevronRight className="w-3 h-3" />
        <span>Employee Transactions</span>
        <ChevronRight className="w-3 h-3" />
        <span className="font-medium text-gray-800">Shift Change Management</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Change Management</h1>
          <p className="text-sm text-gray-500">Request, review and track shift changes and shift swaps for teaching and non-teaching staff</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff name or ID"
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select
            value={viewer}
            onChange={(e) => changeViewer(e.target.value as ViewerRole)}
            aria-label="Viewing as"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="HR Admin">Viewing as: HR Admin</option>
            <option value="Staff">Viewing as: Staff (self)</option>
          </select>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="primary" onClick={openNewRequest}>
            <PlusCircle className="w-4 h-4 mr-2" />
            + New Shift Change Request
          </Button>
        </div>
      </div>

      {notice && (
        <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar: shift overview */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
          <Card title="Shift Overview">
            <div className="space-y-3">
              {SHIFT_NAMES.map((name) => {
                const info = shifts[name];
                const free = freeSlots(info);
                const pct = Math.min(100, Math.round((info.filled / info.capacity) * 100));
                const meta = STATUS_META[shiftStatusOf(info)];
                const Icon = SHIFT_ICON[name];
                return (
                  <div key={name} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-gray-900">{name}</span>
                      </div>
                      <Badge variant={meta.badge}>{meta.label}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{info.time}</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full ${meta.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-600">
                      <span>{info.filled}/{info.capacity} filled</span>
                      <span className={`font-medium ${meta.text}`}>{free} slots available</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Pending', value: counts.pending, tone: 'text-yellow-700' },
                { label: 'Approved Today', value: counts.approvedToday, tone: 'text-green-700' },
                { label: 'Rejected Today', value: counts.rejectedToday, tone: 'text-red-700' },
                { label: 'Swap Pending', value: counts.swapPending, tone: 'text-indigo-700' }
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          {/* Main tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {([
              { id: 'all', label: 'All Requests', count: requests.length },
              { id: 'availability', label: 'Shift Availability' },
              { id: 'new', label: 'New Request' }
            ] as { id: PageTab; label: string; count?: number }[]).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${tab === item.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                {item.label}
                {item.count !== undefined && (
                  <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{item.count}</span>
                )}
              </button>
            ))}
          </div>

          {tab === 'all' && (
            <div className="space-y-6">
              <Card
                title="My Requests"
                headerAction={
                  <button type="button" onClick={() => setShowMyRequests((value) => !value)} className="text-sm text-indigo-600 hover:underline">
                    {showMyRequests ? 'Hide' : 'Show'}
                  </button>
                }>
                {showMyRequests && (
                  myRequests.length === 0 ? (
                    <p className="text-sm text-gray-500">You have not submitted any shift change requests.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200 bg-gray-50">
                            {['Request ID', 'Type', 'Shift', 'Effective', 'Status', 'Remarks'].map((head) => (
                              <th key={head} className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">{head}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {myRequests.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100">
                              <td className="py-2 px-3 text-sm font-medium text-gray-900">{item.id}</td>
                              <td className="py-2 px-3 text-sm text-gray-700">{item.requestType}{item.requestType === 'Swap' ? ` with ${item.swapPartnerName}` : ''}</td>
                              <td className="py-2 px-3 text-sm text-gray-700">{item.currentShift} → {item.requestedShift || '—'}</td>
                              <td className="py-2 px-3 text-sm text-gray-700 whitespace-nowrap">{formatDate(item.effectiveDate)}</td>
                              <td className="py-2 px-3"><Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge></td>
                              <td className="py-2 px-3 text-xs text-gray-500">{item.remarks || (item.status === 'Pending' ? 'Awaiting HR review' : '—')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </Card>

              <Card title="All Requests">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | RequestStatus)} aria-label="Filter by status" className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="all">All statuses</option>
                    {(['Draft', 'Pending', 'Approved', 'Rejected', 'Cancelled'] as RequestStatus[]).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | RequestType)} aria-label="Filter by request type" className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="all">All request types</option>
                    <option value="Change">Change</option>
                    <option value="Swap">Swap</option>
                  </select>
                  <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value as 'all' | ShiftName)} aria-label="Filter by requested shift" className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="all">All requested shifts</option>
                    {SHIFT_NAMES.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500 md:ml-auto">{filteredRequests.length} of {requests.length} records</span>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500">No requests match the current filters.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          {['#', 'Staff Name', 'Employee ID', 'Staff Type', 'Current Shift', 'Requested Shift', 'Request Type', 'Effective Date', 'Status', 'Action'].map((head) => (
                            <th key={head} className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-3 text-sm text-gray-500">{index + 1}</td>
                            <td className="py-3 px-3">
                              <div className="text-sm font-medium text-gray-900">{item.staffName}</div>
                              <div className="text-xs text-gray-500">{item.id}</div>
                            </td>
                            <td className="py-3 px-3 text-sm text-gray-700">{item.staffId}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{item.staffType}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{item.currentShift}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{item.requestedShift || '—'}</td>
                            <td className="py-3 px-3"><Badge variant={item.requestType === 'Swap' ? 'info' : 'primary'}>{item.requestType}</Badge></td>
                            <td className="py-3 px-3 text-sm text-gray-700 whitespace-nowrap">{formatDate(item.effectiveDate)}</td>
                            <td className="py-3 px-3"><Badge variant={STATUS_BADGE[item.status]}>{item.status}</Badge></td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1">
                                <Button size="xs" variant="outline" onClick={() => setDetailTarget(item)}>
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  View Details
                                </Button>
                                {item.status === 'Draft' && (
                                  <Button size="xs" variant="secondary" onClick={() => loadDraft(item)}>Edit draft</Button>
                                )}
                                {canDecide && item.status === 'Pending' && (
                                  <>
                                    <Button size="xs" variant="primary" onClick={() => openApprove(item)}>Approve</Button>
                                    <Button size="xs" variant="danger" onClick={() => openReject(item)}>Reject</Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {tab === 'availability' && (
            <div className="space-y-6">
              <Card title="Shift availability checker">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Shift</label>
                    <select value={checkShift} onChange={(e) => setCheckShift(e.target.value as ShiftName)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                      {SHIFT_NAMES.map((name) => (
                        <option key={name} value={name}>{name} ({shifts[name].time})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Effective date</label>
                    <input type="date" value={checkDate} min={TODAY} onChange={(e) => setCheckDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div className={`rounded-lg border p-3 ${checkStatus.badge === 'success' ? 'border-green-200 bg-green-50' : checkStatus.badge === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{checkShift}</span>
                      <Badge variant={checkStatus.badge}>{checkStatus.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{freeSlots(checkInfo)} of {checkInfo.capacity} seats free</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Capacity</p><p className="font-semibold text-gray-900">{checkInfo.capacity}</p></div>
                  <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Filled</p><p className="font-semibold text-gray-900">{checkInfo.filled}</p></div>
                  <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Minimum strength</p><p className="font-semibold text-gray-900">{checkInfo.minimum}</p></div>
                  <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">Date check</p><p className="font-semibold text-gray-900">{HOLIDAYS[checkDate] ?? (checkExam ? checkExam.label : 'No holiday or exam')}</p></div>
                </div>
                <p className={`mt-3 text-sm ${freeSlots(checkInfo) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {freeSlots(checkInfo) > 0
                    ? 'Seats are available. A change into this shift can be requested.'
                    : 'This shift is full (Rule 1). Change requests into it are blocked.'}
                </p>
              </Card>

              <Card title="Shift comparison">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        {['Shift', 'Time', 'Capacity', 'Filled', 'Free', 'Minimum', 'Occupancy', 'Status'].map((head) => (
                          <th key={head} className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SHIFT_NAMES.map((name) => {
                        const info = shifts[name];
                        const meta = STATUS_META[shiftStatusOf(info)];
                        const pct = Math.min(100, Math.round((info.filled / info.capacity) * 100));
                        return (
                          <tr key={name} className="border-b border-gray-100">
                            <td className="py-3 px-3 text-sm font-medium text-gray-900">{name}</td>
                            <td className="py-3 px-3 text-sm text-gray-700 whitespace-nowrap">{info.time}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{info.capacity}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{info.filled}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{freeSlots(info)}</td>
                            <td className="py-3 px-3 text-sm text-gray-700">{info.minimum}</td>
                            <td className="py-3 px-3 min-w-[140px]">
                              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden"><div className={`h-full ${meta.bar}`} style={{ width: `${pct}%` }} /></div>
                              <span className="text-xs text-gray-500">{pct}%</span>
                            </td>
                            <td className="py-3 px-3"><Badge variant={meta.badge}>{meta.label}</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card title={`Department strength: ${checkShift} shift`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        {['Department', 'Morning', 'Afternoon', 'Evening'].map((head) => (
                          <th key={head} className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DEPARTMENTS.map((dept) => (
                        <tr key={dept} className="border-b border-gray-100">
                          <td className="py-2.5 px-3 text-sm font-medium text-gray-900">{dept}</td>
                          {SHIFT_NAMES.map((name) => (
                            <td key={name} className={`py-2.5 px-3 text-sm ${name === checkShift ? 'font-semibold text-indigo-700' : 'text-gray-700'}`}>
                              {deptStrength[dept]?.[name] ?? 0}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {tab === 'new' && (
            <div className="space-y-6">
              {confirmation && (
                <Card>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <CheckCircle className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">Request submitted</h2>
                      <p className="text-sm text-gray-600">
                        Request ID <span className="font-semibold text-gray-900">{confirmation.id}</span> has been sent to HR for review.
                        {confirmation.requestType === 'Swap' ? ` Swap partner: ${confirmation.swapPartnerName}.` : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => { setConfirmation(null); setTab('all'); setShowMyRequests(true); }}>View My Requests</Button>
                      <Button variant="primary" onClick={() => navigate('/')}>Go to Dashboard</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Section A */}
              <Card title="A. Staff Information (auto-filled)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Staff member</label>
                    <select
                      value={draft.staffId}
                      disabled={viewer === 'Staff'}
                      onChange={(e) => setDraft((current) => ({ ...current, staffId: e.target.value, swapPartnerId: '' }))}
                      className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-100">
                      {staffList.map((item) => (
                        <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
                      ))}
                    </select>
                  </div>
                  {selectedStaff && (
                    <dl className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm">
                      <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{selectedStaff.name}</dd></div>
                      <div><dt className="text-gray-500">Employee ID</dt><dd className="font-medium text-gray-900">{selectedStaff.id}</dd></div>
                      <div><dt className="text-gray-500">Staff type</dt><dd className="text-gray-900">{selectedStaff.staffType}</dd></div>
                      <div><dt className="text-gray-500">Department</dt><dd className="text-gray-900">{selectedStaff.department}</dd></div>
                      <div><dt className="text-gray-500">Designation</dt><dd className="text-gray-900">{selectedStaff.designation}</dd></div>
                      <div><dt className="text-gray-500">Current shift</dt><dd><Badge variant="info">{selectedStaff.shift}</Badge></dd></div>
                    </dl>
                  )}
                </div>
              </Card>

              {/* Section B */}
              <Card title="B. Request Type">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Request type">
                  {([
                    { id: 'Change', title: 'Shift Change', desc: 'Move to another shift. Seats in the requested shift are reserved on approval.', icon: Clock },
                    { id: 'Swap', title: 'Shift Swap', desc: 'Exchange shifts with a colleague who is on the requested shift.', icon: ArrowRightLeft }
                  ] as { id: RequestType; title: string; desc: string; icon: React.ElementType }[]).map((option) => {
                    const Icon = option.icon;
                    const active = draft.requestType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setDraft((current) => ({ ...current, requestType: option.id, swapPartnerId: '' }))}
                        className={`text-left rounded-xl border-2 p-4 transition-colors ${active ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${active ? 'text-indigo-700' : 'text-gray-500'}`} />
                          <span className="font-semibold text-gray-900">{option.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Section C */}
              <Card title="C. Shift Selection (live availability)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SHIFT_NAMES.map((name) => {
                    const info = shifts[name];
                    const meta = STATUS_META[shiftStatusOf(info)];
                    const active = draft.requestedShift === name;
                    const Icon = SHIFT_ICON[name];
                    return (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDraft((current) => ({ ...current, requestedShift: name, swapPartnerId: '' }))}
                        className={`text-left rounded-xl border-2 p-3 transition-colors ${active ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 font-semibold text-gray-900"><Icon className="w-4 h-4 text-indigo-600" />{name}</span>
                          <Badge variant={meta.badge}>{meta.label}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{info.time}</p>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden"><div className={`h-full ${meta.bar}`} style={{ width: `${Math.min(100, Math.round((info.filled / info.capacity) * 100))}%` }} /></div>
                        <p className={`mt-1 text-xs font-medium ${meta.text}`}>{freeSlots(info)} slots available</p>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Current shift: <span className="font-medium text-gray-900">{selectedStaff?.shift ?? '—'}</span>
                </p>
              </Card>

              {/* Section D: swap partner, only for Swap */}
              {draft.requestType === 'Swap' && (
                <Card title="D. Swap Partner">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Swap partner {draft.requestedShift ? `(on ${draft.requestedShift} shift)` : ''}</label>
                      <select
                        value={draft.swapPartnerId}
                        onChange={(e) => setDraft((current) => ({ ...current, swapPartnerId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                        <option value="">Select a colleague</option>
                        {partnerOptions.map((item) => (
                          <option key={item.id} value={item.id}>{item.name} ({item.id}) · {item.shift}</option>
                        ))}
                      </select>
                    </div>
                    {selectedPartner && (
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm">
                        <p className="font-medium text-gray-900">{selectedPartner.name}</p>
                        <p className="text-gray-600">{selectedPartner.designation} · {selectedPartner.department}</p>
                        <p className="text-gray-600">Current shift: {selectedPartner.shift}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Section E */}
              <Card title={`${draft.requestType === 'Swap' ? 'E' : 'D'}. Request Details`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Effective date</label>
                    <input
                      type="date"
                      value={draft.effectiveDate}
                      min={TODAY}
                      onChange={(e) => setDraft((current) => ({ ...current, effectiveDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Supporting document (optional: PDF, JPG or PNG, up to 2 MB)</label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                        <Upload className="w-4 h-4" />
                        Choose file
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { handleDocumentSelect(e.target.files?.[0]); e.target.value = ''; }} />
                      </label>
                      {draft.documentName && (
                        <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4" />
                          {draft.documentName} ({formatSize(draft.documentSize)})
                          <button type="button" onClick={() => setDraft((current) => ({ ...current, documentName: '', documentSize: 0 }))} className="text-red-600 hover:underline">Remove</button>
                        </span>
                      )}
                    </div>
                    {docError && <p className="mt-1 text-xs text-red-600">{docError}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600">Reason for the change</label>
                      <span className={`text-xs ${draft.reason.trim().length >= MIN_REASON_LENGTH ? 'text-green-700' : 'text-gray-500'}`}>
                        {draft.reason.trim().length} / {MIN_REASON_LENGTH} characters minimum
                      </span>
                    </div>
                    <textarea
                      value={draft.reason}
                      onChange={(e) => setDraft((current) => ({ ...current, reason: e.target.value }))}
                      rows={4}
                      placeholder="Explain why the shift change is needed"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </Card>

              {/* Section F: validation summary */}
              <Card title={`${draft.requestType === 'Swap' ? 'F' : 'E'}. Validation Summary`}>
                {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-green-700"><CheckCircle className="w-4 h-4" />All checks passed. The request is ready to submit.</p>
                ) : (
                  <div className="space-y-2">
                    {validation.errors.map((message) => (
                      <p key={message} className="flex items-start gap-2 text-sm text-red-700"><XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{message}</p>
                    ))}
                    {validation.warnings.map((message) => (
                      <p key={message} className="flex items-start gap-2 text-sm text-amber-700"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />{message}</p>
                    ))}
                    {submitAttempted && validation.errors.length > 0 && (
                      <p className="text-xs text-gray-600">Fix the errors above to submit.</p>
                    )}
                  </div>
                )}
              </Card>

              {/* Section G: actions */}
              <Card title={`${draft.requestType === 'Swap' ? 'G' : 'F'}. Actions`}>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                  <Button variant="ghost" onClick={() => { resetForm(); setTab('all'); }}>Cancel</Button>
                </div>
              </Card>

              <Card title="Validation rules applied">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        {['#', 'Rule', 'Type', 'Applied when'].map((head) => (
                          <th key={head} className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RULES.map((rule) => (
                        <tr key={rule.id} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-sm text-gray-500">{rule.id}</td>
                          <td className="py-2 px-3 text-sm font-medium text-gray-900">{rule.name}</td>
                          <td className="py-2 px-3"><Badge variant={rule.type === 'Block' ? 'danger' : rule.type === 'Warning' ? 'warning' : 'info'}>{rule.type}</Badge></td>
                          <td className="py-2 px-3 text-sm text-gray-700">{rule.when}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Request detail popup */}
      <Modal
        isOpen={detailTarget !== null}
        onClose={() => setDetailTarget(null)}
        title={detailTarget ? `Request ${detailTarget.id}` : 'Request'}
        size="lg"
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => setDetailTarget(null)}>Close</Button>
            {canDecide && detailTarget?.status === 'Pending' && (
              <>
                <Button variant="danger" onClick={() => { const item = detailTarget; setDetailTarget(null); openReject(item); }}>Reject</Button>
                <Button variant="primary" onClick={() => { const item = detailTarget; setDetailTarget(null); openApprove(item); }}>Approve</Button>
              </>
            )}
          </div>
        }>
        {detailTarget && renderRequestDetail(detailTarget)}
      </Modal>

      {/* Approval confirmation */}
      <Modal
        isOpen={approveTarget !== null}
        onClose={() => setApproveTarget(null)}
        title="Confirm approval"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setApproveTarget(null)}>Cancel</Button>
            <Button variant="primary" onClick={confirmApprove}>Confirm Approve</Button>
          </div>
        }>
        {approveTarget && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              Approve {approveTarget.requestType === 'Swap' ? 'swap' : 'shift change'} <span className="font-semibold text-gray-900">{approveTarget.id}</span> for{' '}
              <span className="font-semibold text-gray-900">{approveTarget.staffName}</span>: {approveTarget.currentShift} → {approveTarget.requestedShift || '—'}
              {approveTarget.requestType === 'Swap' ? ` with ${approveTarget.swapPartnerName}` : ''}, effective {formatDate(approveTarget.effectiveDate)}.
            </p>
            <p className="text-xs text-gray-500">The shift availability is re-checked when you confirm.</p>
            {approveError && <p className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">{approveError}</p>}
          </div>
        )}
      </Modal>

      {/* Rejection with mandatory remarks */}
      <Modal
        isOpen={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        title="Reject request"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmReject}>Confirm Reject</Button>
          </div>
        }>
        {rejectTarget && (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Rejecting <span className="font-semibold text-gray-900">{rejectTarget.id}</span> for {rejectTarget.staffName}. Remarks are mandatory.</p>
            <textarea
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              rows={4}
              placeholder="Give the reason for rejecting this request"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {rejectError && <p className="text-xs text-red-600">{rejectError}</p>}
          </div>
        )}
      </Modal>

      {/* Preview of the draft */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Preview shift change request"
        size="lg"
        footer={<div className="flex justify-end"><Button variant="ghost" onClick={() => setPreviewOpen(false)}>Close</Button></div>}>
        <div className="space-y-3 text-sm text-gray-700">
          <p><span className="text-gray-500">Staff:</span> <span className="font-medium text-gray-900">{selectedStaff?.name ?? '—'}</span> ({selectedStaff?.id ?? '—'})</p>
          <p><span className="text-gray-500">Request type:</span> {draft.requestType}{draft.requestType === 'Swap' && selectedPartner ? ` with ${selectedPartner.name}` : ''}</p>
          <p><span className="text-gray-500">Shift:</span> {selectedStaff?.shift ?? '—'} → {draft.requestedShift || '—'}</p>
          <p><span className="text-gray-500">Effective date:</span> {formatDate(draft.effectiveDate)}</p>
          <p><span className="text-gray-500">Reason:</span> {draft.reason.trim() || '—'}</p>
          <p><span className="text-gray-500">Document:</span> {draft.documentName ? `${draft.documentName} (${formatSize(draft.documentSize)})` : 'None'}</p>
          <p className={validation.errors.length ? 'text-red-700' : 'text-green-700'}>
            {validation.errors.length ? `${validation.errors.length} error(s) must be fixed before submitting.` : 'Ready to submit.'}
          </p>
        </div>
      </Modal>
    </div>
  );
}

export const TeacherShiftViewSwitch = ShiftViewAndSwitch;
export default ShiftViewAndSwitch;
