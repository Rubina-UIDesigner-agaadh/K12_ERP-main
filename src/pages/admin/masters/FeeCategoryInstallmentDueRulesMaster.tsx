import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Modal } from '../../../components/ui/Modal';
import { AlertTriangle, Eye, FileText, Plus, Save, Search, Send, Upload } from 'lucide-react';

export const FEE_SCHEDULE_STORE = 'k12-fee-schedules-v1';
export const STUDENT_FEE_INVOICE_STORE = 'k12-student-fee-invoices-v1';

type ScheduleStatus = 'Draft' | 'Submitted' | 'Invoices Generated';

type FeeStructureOption = {
  id: string;
  name: string;
  academicYear: string;
  academicTerm: string;
  grade: string;
  total: number;
  tax: number;
};

type ScheduleStudent = {
  studentId: string;
  name: string;
  grade: string;
  section: string;
  category: string;
  feeStructureId: string;
  total: number;
  discount: number;
  net: number;
  previousDue: number;
  include: boolean;
  invoiceId?: string;
};

type FeeSchedule = {
  id: string;
  name: string;
  feeStructureId: string;
  academicYear: string;
  academicTerm: string;
  invoiceDate: string;
  dueDate: string;
  sendNotification: boolean;
  status: ScheduleStatus;
  students: ScheduleStudent[];
};

export type StoredFeeInvoice = {
  id: string;
  scheduleId: string;
  studentId: string;
  studentName: string;
  parentName: string;
  grade: string;
  section: string;
  academicYear: string;
  academicTerm: string;
  invoiceDate: string;
  dueDate: string;
  status: 'Draft' | 'Submitted' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
  lines: { category: string; description: string; original: number; discount: number; tax: number; net: number }[];
  paid: number;
  lateFinePerDay: number;
  includeLateFine: boolean;
  installments: { name: string; dueDate: string; amount: number; status: 'Paid' | 'Pending' }[];
  payments: { date: string; amount: number; mode: string; receiptNo: string; recordedBy: string }[];
  scholarship: number;
};

const STRUCTURES: FeeStructureOption[] = [
  { id: 'FS-G6-T1', name: 'Grade 6 — Term 1 — 2025-26', academicYear: '2025-26', academicTerm: 'Term 1', grade: '6', total: 12500, tax: 225 },
  { id: 'FS-G8-AN', name: 'Grade 8 — Annual — 2026-27', academicYear: '2026-27', academicTerm: 'Annual', grade: '8', total: 28000, tax: 0 },
  { id: 'FS-G10-T1', name: 'Grade 10 — Term 1 — 2026-27', academicYear: '2026-27', academicTerm: 'Term 1', grade: '10', total: 26500, tax: 400 }
];

const ENROLLED: Omit<ScheduleStudent, 'include' | 'invoiceId'>[] = [
  { studentId: 'STU001', name: 'Rahul Sharma', grade: '10', section: 'A', category: 'General', feeStructureId: 'FS-G10-T1', total: 26500, discount: 1500, net: 25000, previousDue: 3200 },
  { studentId: 'STU002', name: 'Priya Patel', grade: '10', section: 'A', category: 'General', feeStructureId: 'FS-G10-T1', total: 26500, discount: 0, net: 26500, previousDue: 0 },
  { studentId: 'STU003', name: 'Arjun Singh', grade: '10', section: 'B', category: 'General', feeStructureId: 'FS-G10-T1', total: 26500, discount: 2000, net: 24500, previousDue: 1800 },
  { studentId: 'STU008', name: 'Divya Joshi', grade: '10', section: 'A', category: 'Staff Ward', feeStructureId: 'FS-G10-T1', total: 26500, discount: 8000, net: 18500, previousDue: 0 },
  { studentId: 'STU009', name: 'Kabir Mehta', grade: '6', section: 'A', category: 'General', feeStructureId: 'FS-G6-T1', total: 12500, discount: 1500, net: 11225, previousDue: 0 },
  { studentId: 'STU010', name: 'Anvi Shah', grade: '6', section: 'A', category: 'General', feeStructureId: 'FS-G6-T1', total: 12500, discount: 0, net: 12500, previousDue: 750 },
  { studentId: 'STU011', name: 'Ishaan Desai', grade: '6', section: 'B', category: 'RTE', feeStructureId: 'FS-G6-T1', total: 12500, discount: 12500, net: 0, previousDue: 0 },
  { studentId: 'STU012', name: 'Myra Kapoor', grade: '6', section: 'B', category: 'General', feeStructureId: 'FS-G6-T1', total: 12500, discount: 500, net: 12000, previousDue: 0 },
  { studentId: 'STU006', name: 'Ananya Gupta', grade: '8', section: 'A', category: 'General', feeStructureId: 'FS-G8-AN', total: 28000, discount: 0, net: 28000, previousDue: 4500 },
  { studentId: 'STU007', name: 'Karthik Nair', grade: '8', section: 'B', category: 'General', feeStructureId: 'FS-G8-AN', total: 28000, discount: 2800, net: 25200, previousDue: 0 }
];

const PARENTS: Record<string, string> = {
  STU001: 'Amit Sharma', STU002: 'Rajesh Patel', STU003: 'Vikram Singh', STU008: 'Prakash Joshi',
  STU009: 'Nilesh Mehta', STU010: 'Karan Shah', STU011: 'Ravi Desai', STU012: 'Amit Kapoor',
  STU006: 'Sanjay Gupta', STU007: 'Ramesh Nair'
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};
const saveJson = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

const autoName = (structure?: FeeStructureOption) =>
  structure ? `Fee Schedule — ${structure.name}` : 'Fee Schedule';

const studentsForStructure = (structureId: string): ScheduleStudent[] =>
  ENROLLED.filter((row) => row.feeStructureId === structureId).map((row) => ({ ...row, include: true }));

const seedSchedules = (): FeeSchedule[] => {
  const g6 = STRUCTURES[0];
  return [{
    id: 'SCH-G6-T1',
    name: autoName(g6),
    feeStructureId: g6.id,
    academicYear: g6.academicYear,
    academicTerm: g6.academicTerm,
    invoiceDate: '2025-06-10',
    dueDate: '2025-06-25',
    sendNotification: true,
    status: 'Draft',
    students: studentsForStructure(g6.id)
  }];
};

const blankSchedule = (): FeeSchedule => {
  const structure = STRUCTURES[0];
  return {
    id: `SCH-${Date.now()}`,
    name: autoName(structure),
    feeStructureId: structure.id,
    academicYear: structure.academicYear,
    academicTerm: structure.academicTerm,
    invoiceDate: '2026-10-31',
    dueDate: '2026-11-15',
    sendNotification: true,
    status: 'Draft',
    students: studentsForStructure(structure.id)
  };
};

const lineSet = (student: ScheduleStudent) => {
  const tuition = Math.round(student.net * 0.72);
  const transport = Math.round(student.net * 0.16);
  const exam = Math.max(0, student.net - tuition - transport);
  return [
    { category: 'Tuition', description: 'Term tuition fee', original: tuition + Math.round(student.discount * 0.7), discount: Math.round(student.discount * 0.7), tax: 0, net: tuition },
    { category: 'Transport', description: 'School bus', original: transport + Math.round(student.discount * 0.2), discount: Math.round(student.discount * 0.2), tax: 0, net: transport },
    { category: 'Exam', description: 'Term examination fee', original: exam + Math.round(student.discount * 0.1), discount: Math.round(student.discount * 0.1), tax: 0, net: exam }
  ];
};

function buildInvoice(schedule: FeeSchedule, student: ScheduleStudent, seq: number): StoredFeeInvoice {
  const ym = schedule.invoiceDate.slice(0, 7).replace('-', '');
  const id = `INV-${ym.slice(0, 4)}-${ym.slice(4, 6)}-${String(412 + seq).padStart(5, '0')}`;
  const overdue = schedule.dueDate < '2026-10-31';
  return {
    id,
    scheduleId: schedule.id,
    studentId: student.studentId,
    studentName: student.name,
    parentName: PARENTS[student.studentId] || 'Guardian',
    grade: student.grade,
    section: student.section,
    academicYear: schedule.academicYear,
    academicTerm: schedule.academicTerm,
    invoiceDate: schedule.invoiceDate,
    dueDate: schedule.dueDate,
    status: overdue ? 'Overdue' : 'Submitted',
    lines: lineSet(student),
    paid: 0,
    lateFinePerDay: 50,
    includeLateFine: false,
    installments: [
      { name: '1st Installment', dueDate: schedule.dueDate, amount: Math.round(student.net / 3), status: 'Pending' },
      { name: '2nd Installment', dueDate: '2026-07-15', amount: Math.round(student.net / 3), status: 'Pending' },
      { name: '3rd Installment', dueDate: '2026-10-15', amount: student.net - 2 * Math.round(student.net / 3), status: 'Pending' }
    ],
    payments: [],
    scholarship: student.discount
  };
}

export function FeeCategoryInstallmentDueRulesMaster() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<FeeSchedule[]>(() => loadJson(FEE_SCHEDULE_STORE, seedSchedules()));
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [draft, setDraft] = useState<FeeSchedule | null>(null);
  const [gradeFilter, setGradeFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [progress, setProgress] = useState<{ total: number; done: number } | null>(null);

  const persist = (next: FeeSchedule[], message?: string) => {
    setSchedules(next);
    saveJson(FEE_SCHEDULE_STORE, next);
    if (message) setNotice(message);
  };

  const applyStructure = (schedule: FeeSchedule, structureId: string): FeeSchedule => {
    const structure = STRUCTURES.find((item) => item.id === structureId) || STRUCTURES[0];
    return {
      ...schedule,
      feeStructureId: structure.id,
      academicYear: structure.academicYear,
      academicTerm: structure.academicTerm,
      name: autoName(structure),
      students: studentsForStructure(structure.id)
    };
  };

  const openCreate = () => { setDraft(blankSchedule()); setMode('form'); setNotice(''); };
  const openEdit = (row: FeeSchedule) => { setDraft({ ...row, students: row.students.map((item) => ({ ...item })) }); setMode('form'); };

  const visibleStudents = useMemo(() => {
    if (!draft) return [];
    return draft.students.filter((row) => {
      if (gradeFilter && row.grade !== gradeFilter) return false;
      if (sectionFilter && row.section !== sectionFilter) return false;
      if (categoryFilter && row.category !== categoryFilter) return false;
      if (search && !(`${row.studentId} ${row.name}`.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [draft, gradeFilter, sectionFilter, categoryFilter, search]);

  const included = draft?.students.filter((row) => row.include) || [];
  const grades = Array.from(new Set((draft?.students || []).map((row) => row.grade)));
  const sections = Array.from(new Set((draft?.students || []).map((row) => row.section)));
  const categories = Array.from(new Set((draft?.students || []).map((row) => row.category)));

  const patchStudents = (updater: (row: ScheduleStudent) => ScheduleStudent) => {
    if (!draft) return;
    setDraft({ ...draft, students: draft.students.map(updater) });
  };

  const saveDraft = () => {
    if (!draft) return;
    if (!draft.feeStructureId) { setNotice('Select a fee structure.'); return; }
    const next = { ...draft, status: draft.status === 'Invoices Generated' ? draft.status : 'Draft' as ScheduleStatus };
    const exists = schedules.some((item) => item.id === next.id);
    persist(exists ? schedules.map((item) => item.id === next.id ? next : item) : [next, ...schedules], 'Schedule saved as draft. Invoices are not generated yet.');
    setDraft(next);
  };

  const submitSchedule = () => {
    if (!draft) return;
    if (!included.length) { setNotice('Include at least one student before submitting.'); return; }
    const next = { ...draft, status: 'Submitted' as const };
    const exists = schedules.some((item) => item.id === next.id);
    persist(exists ? schedules.map((item) => item.id === next.id ? next : item) : [next, ...schedules], 'Schedule locked. Use Generate Invoices to create Student Fee Invoices.');
    setDraft(next);
  };

  const generateInvoices = () => {
    if (!draft || draft.status === 'Draft') { setNotice('Submit the schedule before generating invoices.'); return; }
    const selected = draft.students.filter((row) => row.include);
    if (!selected.length) { setNotice('No students are included.'); return; }
    setProgress({ total: selected.length, done: 0 });
    const existing = loadJson<StoredFeeInvoice[]>(STUDENT_FEE_INVOICE_STORE, []);
    const created: StoredFeeInvoice[] = [];
    selected.forEach((student, index) => {
      window.setTimeout(() => {
        const invoice = buildInvoice(draft, student, existing.length + created.length);
        created.push(invoice);
        setProgress({ total: selected.length, done: index + 1 });
        if (index === selected.length - 1) {
          saveJson(STUDENT_FEE_INVOICE_STORE, [...created, ...existing]);
          const mapped = draft.students.map((row) => {
            const match = created.find((item) => item.studentId === row.studentId);
            return match ? { ...row, invoiceId: match.id } : row;
          });
          const next = { ...draft, status: 'Invoices Generated' as const, students: mapped };
          const exists = schedules.some((item) => item.id === next.id);
          persist(exists ? schedules.map((item) => item.id === next.id ? next : item) : [next, ...schedules], `${created.length} student fee invoices generated.`);
          setDraft(next);
          window.setTimeout(() => setProgress(null), 800);
        }
      }, 80 * index);
    });
  };

  const importCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const ids = text.split(/[\n,]/).map((item) => item.trim()).filter((item) => item && item !== 'Student ID' && item !== 'studentId');
      if (!draft || !ids.length) { setNotice('No student IDs found in the CSV.'); return; }
      setDraft({
        ...draft,
        students: draft.students.map((row) => ({ ...row, include: ids.includes(row.studentId) }))
      });
      setNotice(`Imported ${ids.length} student ID(s). Matching rows are included; others are excluded.`);
    };
    reader.readAsText(file);
  };

  const notifyParents = () => {
    if (!draft) return;
    setNotice(`Payment due notification queued for ${included.length} parent(s)${draft.sendNotification ? ' (email/SMS)' : ''}.`);
  };

  return (
    <div className="space-y-6 p-6">
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {mode === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400">Finance &gt; Fees &gt; Fee Schedule</p>
              <h1 className="text-2xl font-bold text-gray-900">Fee Schedule</h1>
              <p className="text-sm text-gray-500">Define fee structures by program, academic level, or installment schedule. Invoices generate from enrollment without rebuilding each cycle.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate('/finance/fees/fee-structure')}>Open Fee Structure</Button>
              <Button variant="outline" onClick={() => navigate('/finance/fees/student-fee-invoice')}>Student Fee Invoices</Button>
              <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Fee Schedule</Button>
            </div>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Schedule</th>
                    <th className="px-4 py-3">Fee Structure</th>
                    <th className="px-4 py-3">Invoice / Due</th>
                    <th className="px-4 py-3">Students</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button type="button" className="font-medium text-indigo-700 hover:underline" onClick={() => openEdit(row)}>{row.name}</button>
                        <p className="text-xs text-gray-500">{row.academicYear} · {row.academicTerm}</p>
                      </td>
                      <td className="px-4 py-3 text-center">{STRUCTURES.find((item) => item.id === row.feeStructureId)?.name || row.feeStructureId}</td>
                      <td className="px-4 py-3 text-center">{row.invoiceDate} / {row.dueDate}</td>
                      <td className="px-4 py-3 text-center">{row.students.filter((item) => item.include).length}</td>
                      <td className="px-4 py-3 text-center"><Badge variant={row.status === 'Draft' ? 'secondary' : row.status === 'Submitted' ? 'warning' : 'success'}>{row.status}</Badge></td>
                      <td className="px-4 py-3 text-center"><Button size="xs" variant="outline" onClick={() => openEdit(row)}>Open</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {mode === 'form' && draft && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-indigo-600" onClick={() => setMode('list')}>← Back to Fee Schedules</button>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400">Finance &gt; Fees &gt; Fee Schedule</p>
              <h1 className="text-2xl font-bold text-gray-900">{draft.name || 'New Fee Schedule'}</h1>
              <p className="text-sm text-gray-500">Once configured, invoices generate from enrollment records.</p>
            </div>
            <Badge variant={draft.status === 'Draft' ? 'secondary' : draft.status === 'Submitted' ? 'warning' : 'success'}>{draft.status}</Badge>
          </div>

          <Card title="Schedule header">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Schedule name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <Select
                label="Fee structure"
                options={STRUCTURES.map((item) => ({ value: item.id, label: item.name }))}
                value={draft.feeStructureId}
                onChange={(value) => setDraft(applyStructure(draft, typeof value === 'string' ? value : value.target.value))}
              />
              <Input label="Academic year" value={draft.academicYear} readOnly />
              <Input label="Academic term" value={draft.academicTerm} readOnly />
              <Input label="Invoice date" type="date" value={draft.invoiceDate} onChange={(e) => setDraft({ ...draft, invoiceDate: e.target.value })} />
              <Input label="Due date" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
              <div className="md:col-span-2">
                <Toggle label="Send notification (email/SMS to parents on generation)" checked={draft.sendNotification} onChange={(checked) => setDraft({ ...draft, sendNotification: checked })} />
              </div>
            </div>
          </Card>

          <Card title="Student selection">
            <div className="mb-4 flex flex-wrap items-end gap-2">
              <Button size="sm" variant="outline" onClick={() => patchStudents((row) => ({ ...row, include: true }))}>Select All</Button>
              <Button size="sm" variant="outline" onClick={() => patchStudents((row) => ({ ...row, include: false }))}>Deselect All</Button>
              <Select label="Grade" options={[{ value: '', label: 'All grades' }, ...grades.map((item) => ({ value: item, label: `Grade ${item}` }))]} value={gradeFilter} onChange={(value) => setGradeFilter(typeof value === 'string' ? value : value.target.value)} />
              <Select label="Section" options={[{ value: '', label: 'All sections' }, ...sections.map((item) => ({ value: item, label: item }))]} value={sectionFilter} onChange={(value) => setSectionFilter(typeof value === 'string' ? value : value.target.value)} />
              <Select label="Category" options={[{ value: '', label: 'All categories' }, ...categories.map((item) => ({ value: item, label: item }))]} value={categoryFilter} onChange={(value) => setCategoryFilter(typeof value === 'string' ? value : value.target.value)} />
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
                <Input label="Search" className="pl-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Student ID or name" />
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <Upload className="h-4 w-4" /> Import student list from CSV
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) importCsv(file); e.target.value = ''; }} />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3">Include</th>
                    <th className="px-3 py-3 text-left">Student ID</th>
                    <th className="px-3 py-3 text-left">Student name</th>
                    <th className="px-3 py-3">Program / Grade</th>
                    <th className="px-3 py-3">Fee structure</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Discount</th>
                    <th className="px-3 py-3">Net payable</th>
                    <th className="px-3 py-3">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((row) => (
                    <tr key={row.studentId} className="border-t">
                      <td className="px-3 py-2 text-center">
                        <input type="checkbox" className="h-4 w-4" checked={row.include} disabled={draft.status !== 'Draft'} onChange={(e) => patchStudents((item) => item.studentId === row.studentId ? { ...item, include: e.target.checked } : item)} />
                      </td>
                      <td className="px-3 py-2">{row.studentId}</td>
                      <td className="px-3 py-2">
                        <span className="font-medium text-gray-900">{row.name}</span>
                        {row.previousDue > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-700" title={`Previous due: ${inr(row.previousDue)}`}>
                            <AlertTriangle className="h-3.5 w-3.5" /> Previous due: {inr(row.previousDue)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">{row.grade}-{row.section}</td>
                      <td className="px-3 py-2 text-center">{STRUCTURES.find((item) => item.id === row.feeStructureId)?.name}</td>
                      <td className="px-3 py-2 text-center">{inr(row.total)}</td>
                      <td className="px-3 py-2 text-center">{inr(row.discount)}</td>
                      <td className="px-3 py-2 text-center font-medium">{inr(row.net)}</td>
                      <td className="px-3 py-2 text-center">
                        {row.invoiceId ? (
                          <button type="button" className="text-indigo-700 underline" onClick={() => navigate(`/finance/fees/student-fee-invoice?invoice=${encodeURIComponent(row.invoiceId || '')}`)}>View Invoice</button>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">{included.length} of {draft.students.length} students included · Net {inr(included.reduce((sum, row) => sum + row.net, 0))}</p>
          </Card>

          {progress && (
            <Card>
              <p className="mb-2 text-sm font-medium text-gray-800">Generating {progress.total} invoices... {progress.done}/{progress.total} done</p>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-indigo-600" style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
              </div>
            </Card>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={saveDraft} disabled={!!progress}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
            <Button variant="outline" onClick={() => { setPreviewPage(0); setPreviewOpen(true); }} disabled={!included.length}><Eye className="h-4 w-4 mr-1" />Preview All Invoices</Button>
            <Button variant="warning" onClick={submitSchedule} disabled={draft.status !== 'Draft' || !!progress}>Submit Schedule</Button>
            <Button onClick={generateInvoices} disabled={draft.status === 'Draft' || !!progress}><FileText className="h-4 w-4 mr-1" />Generate Invoices</Button>
            <Button variant="outline" onClick={notifyParents} disabled={!included.length}><Send className="h-4 w-4 mr-1" />Send Bulk Notification</Button>
          </div>
        </div>
      )}

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Invoice preview" size="lg" footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-gray-500">Page {previewPage + 1} of {Math.max(1, included.length)}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={previewPage === 0} onClick={() => setPreviewPage((n) => Math.max(0, n - 1))}>Previous</Button>
            <Button size="sm" variant="outline" disabled={previewPage >= included.length - 1} onClick={() => setPreviewPage((n) => Math.min(included.length - 1, n + 1))}>Next</Button>
            <Button size="sm" onClick={() => setPreviewOpen(false)}>Close</Button>
          </div>
        </div>
      }>
        {included[previewPage] && (
          <div className="space-y-2 text-sm">
            <p className="font-semibold">{included[previewPage].name} · {included[previewPage].studentId}</p>
            <p className="text-gray-500">Grade {included[previewPage].grade}-{included[previewPage].section} · {draft?.academicYear} {draft?.academicTerm}</p>
            <p>Original {inr(included[previewPage].total)} · Discount {inr(included[previewPage].discount)}</p>
            <p className="text-lg font-bold">Net payable {inr(included[previewPage].net)}</p>
            <p className="text-xs text-gray-400">Due {draft?.dueDate}. This is a paginated preview; Generate Invoices creates Page 3.3 documents.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FeeCategoryInstallmentDueRulesMaster;
