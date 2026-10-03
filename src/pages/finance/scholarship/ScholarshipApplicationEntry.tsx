import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Info,
  Landmark,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Scale,
  Search,
  Send,
  Trash2,
  User,
  X,
  XCircle } from
'lucide-react';
import {
  ACADEMIC_YEAR,
  CATEGORIES,
  CURRENT_USER,
  SCHOLARSHIP_SCHEMES,
  SCHOLARSHIP_STUDENTS,
  SPORTS_LEVELS,
  classLabel,
  defaultAward,
  downloadText,
  esc,
  evaluateApplication,
  formatDate,
  formatDateLong,
  getApplications,
  getDisbursements,
  htmlDoc,
  htmlTable,
  inr,
  nextApplicationNo,
  printHtml,
  romanClass,
  schemeById,
  setApplications,
  studentById,
  toCsv,
  todayIso } from
'./scholarshipData';
import type {
  AppDocument,
  AppStatus,
  Category,
  Conduct,
  Decision,
  DocStatus,
  ScholarshipApplication,
  ScholarshipScheme,
  SportsLevel } from
'./scholarshipData';

// ============================================================
// Scholarship Application Entry — combined "Scholarship Application List" +
// "Application Entry" + "Eligibility & Evaluation":
//  • list of all student applications (filters, export, print)
//  • detailed view of an application (documents, eligibility checks, timeline)
//  • Create New Application (with live eligibility preview)
//  • evaluate and approve / reject / hold the application
// ============================================================

const STATUSES: AppStatus[] = ['Draft', 'Submitted', 'Under Review', 'On Hold', 'Approved', 'Awarded', 'Rejected'];
const ACTIONABLE: AppStatus[] = ['Submitted', 'Under Review', 'On Hold'];
const REJECT_REASONS = [
'Does not meet academic criteria',
'Attendance below the minimum',
'Family income above the limit',
'Documents not verified / invalid',
'Duplicate application',
'Other'];


function StatusBadge({ status }: {status: AppStatus;}) {
  const variant =
  status === 'Approved' || status === 'Awarded' ? 'success' :
  status === 'Rejected' ? 'danger' :
  status === 'On Hold' ? 'warning' :
  status === 'Under Review' ? 'primary' :
  status === 'Submitted' ? 'info' :
  'default';
  return (
    <Badge variant={variant}>
      {status === 'Awarded' && <Award className="w-3 h-3 mr-1" />}
      {status}
    </Badge>);

}

function KindBadge({ scheme }: {scheme: ScholarshipScheme;}) {
  return scheme.kind === 'Government' ?
  <Badge variant="info">🏛️ Govt</Badge> :

  <Badge variant="secondary">🏫 Internal</Badge>;

}

const awardText = (scheme: ScholarshipScheme, amount: number, pct?: number) =>
scheme.mode === 'Cash' ?
`${inr(amount)} cash` :
pct != null && scheme.basis === 'Percent' ?
`${pct}% fee waiver (${inr(amount)})` :
`${inr(amount)} fee waiver`;

// ---------------------------------------------------------------- printable application
function applicationHtml(app: ScholarshipApplication) {
  const st = studentById(app.studentId);
  const scheme = schemeById(app.schemeId);
  const ev = evaluateApplication(app, scheme, st);
  const grid = (pairs: [string, string][]) =>
  `<table>${pairs.map(([k, v]) => `<tr><th style="width:30%">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>`;
  return htmlDoc(
    `Scholarship Application ${app.appNo}`,
    `Scholarship Application — ${app.appNo} (AY ${app.ay})`,
    `<p class="meta"><strong>Status:</strong> ${esc(app.status)} &nbsp; <strong>Applied on:</strong> ${esc(formatDateLong(app.appliedOn))} &nbsp; <strong>Submitted by:</strong> ${esc(app.submittedBy)}</p>
${grid([
    ['Student', `${st.name} (${st.grNo} / ${st.admissionNo})`],
    ['Class', classLabel(st)],
    ['Parents', `${st.fatherName} / ${st.motherName}`],
    ['Contact', `${st.phone} · ${st.email}`],
    ['Scheme', `${scheme.name} — ${scheme.kind}${scheme.portal ? ` (${scheme.portal})` : ''}`],
    ['Award (as per scheme)', awardText(scheme, app.requestedAmount, app.requestedPct)],
    ['Marks / Attendance', `${app.marks}% / ${app.attendance}%`],
    ['Annual Family Income', inr(app.familyIncome)],
    ['Category', app.category],
    ...(app.bank ? [['Bank', `${app.bank.holder} · ${app.bank.accountNo} · ${app.bank.ifsc} · ${app.bank.bankName}`] as [string, string]] : [])]
    )}
<h3 style="font-size:14px">Documents</h3>${htmlTable(['Document', 'Status', 'File'], app.documents.map((d) => [d.name, d.status, d.fileName || '—']))}
<h3 style="font-size:14px">Eligibility (score ${ev.score}/100)</h3>${htmlTable(['Criterion', 'Actual', 'Required', 'Result'], ev.checks.map((c) => [c.label, c.actual, c.required, c.pass ? 'Pass' : 'Fail']))}
${app.evaluation?.decision ? `<p class="meta"><strong>Decision:</strong> ${esc(app.evaluation.decision)} by ${esc(app.evaluation.evaluatedBy)} on ${esc(formatDateLong(app.evaluation.evaluatedOn))}${app.evaluation.reason ? ` — ${esc(app.evaluation.reason)}` : ''}${app.evaluation.remarks ? ` — ${esc(app.evaluation.remarks)}` : ''}</p>` : ''}
<div class="sig"><div>Class Teacher</div><div>Scholarship Committee</div><div>Principal</div></div>`
  );
}

// ---------------------------------------------------------------- Create / edit application form
interface FormState {
  studentId: string;
  schemeId: string;
  marks: string;
  attendance: string;
  familyIncome: string;
  category: Category;
  sportsLevel: SportsLevel;
  conduct: Conduct;
  isRTE: boolean;
  bank: {holder: string;accountNo: string;ifsc: string;bankName: string;};
  documents: AppDocument[];
  declaration: boolean;
}

const emptyForm = (): FormState => ({
  studentId: '',
  schemeId: '',
  marks: '',
  attendance: '',
  familyIncome: '',
  category: 'General',
  sportsLevel: 'None',
  conduct: 'Excellent',
  isRTE: false,
  bank: { holder: '', accountNo: '', ifsc: '', bankName: '' },
  documents: [],
  declaration: false
});

function ApplicationForm({
  draft,
  apps,
  onCancel,
  onSave







}: {draft: ScholarshipApplication | null;apps: ScholarshipApplication[];onCancel: () => void;onSave: (app: ScholarshipApplication, mode: 'draft' | 'submit' | 'evaluate') => void;}) {
  const [form, setForm] = useState<FormState>(() => {
    if (!draft) return emptyForm();
    const st = studentById(draft.studentId);
    return {
      studentId: draft.studentId,
      schemeId: draft.schemeId,
      marks: String(draft.marks),
      attendance: String(draft.attendance),
      familyIncome: String(draft.familyIncome),
      category: draft.category,
      sportsLevel: draft.sportsLevel,
      conduct: draft.conduct,
      isRTE: draft.isRTE,
      bank: draft.bank ? { ...draft.bank } : { ...st.bank },
      documents: draft.documents.map((d) => ({ ...d })),
      declaration: false
    };
  });
  const [studentQuery, setStudentQuery] = useState('');
  const [error, setError] = useState('');
  // ---- Student data editing -------------------------------------------------------
  // The student master is read-only, so edits made here are kept as a per-student
  // overlay that is applied on top of the master record for this application.
  const [studentOverrides, setStudentOverrides] = useState<Record<string, Record<string, any>>>({});
  const [editingStudent, setEditingStudent] = useState(false);
  const [studentDraft, setStudentDraft] = useState<Record<string, any>>({});
  const [studentNotice, setStudentNotice] = useState('');
  const studentBase = form.studentId ? studentById(form.studentId) : null;
  const student = studentBase ?
  { ...studentBase, ...(studentOverrides[studentBase.id] || {}) } as ScholarshipStudent :
  null;
  const scheme = form.schemeId ? schemeById(form.schemeId) : null;

  const openStudentEditor = () => {
    if (!student) return;
    setStudentDraft({
      name: student.name,
      gender: student.gender,
      dob: student.dob || student.dateOfBirth || '',
      aadhaarNumber: student.aadhaarNumber || student.aadharNo || '',
      fatherName: student.fatherName,
      fatherOccupation: student.fatherOccupation || '',
      motherName: student.motherName,
      motherOccupation: student.motherOccupation || '',
      phone: student.phone,
      email: student.email,
      permanentAddress: student.permanentAddress || student.currentAddress || '',
      economicTag: student.isBPL ? 'BPL' : student.isEWS ? 'EWS' : 'General',
      disability: student.disability ? 'Yes' : 'No',
      disabilityType: student.disabilityType || '',
      disabilityPct: String(student.disabilityPct ?? 40)
    });
    setStudentNotice('');
    setEditingStudent(true);
  };

  const saveStudentEdits = () => {
    if (!student) return;
    if (!String(studentDraft.name || '').trim()) {
      setError('Student name cannot be empty.');
      return;
    }
    const economicTag = studentDraft.economicTag || 'General';
    const hasDisability = studentDraft.disability === 'Yes';
    const patch: Record<string, any> = {
      name: String(studentDraft.name).trim(),
      gender: studentDraft.gender,
      dob: studentDraft.dob,
      dateOfBirth: studentDraft.dob,
      aadhaarNumber: studentDraft.aadhaarNumber,
      aadharNo: studentDraft.aadhaarNumber,
      fatherName: studentDraft.fatherName,
      fatherOccupation: studentDraft.fatherOccupation,
      motherName: studentDraft.motherName,
      motherOccupation: studentDraft.motherOccupation,
      phone: studentDraft.phone,
      email: studentDraft.email,
      permanentAddress: studentDraft.permanentAddress,
      isBPL: economicTag === 'BPL',
      isEWS: economicTag === 'EWS',
      disability: hasDisability,
      isDisabled: hasDisability,
      disabilityType: hasDisability ? studentDraft.disabilityType || 'PWD' : null,
      disabilityPct: hasDisability ? Number(studentDraft.disabilityPct) || 40 : null,
      disabilityPercentage: hasDisability ? Number(studentDraft.disabilityPct) || 40 : null
    };
    setStudentOverrides((prev) => ({ ...prev, [student.id]: patch }));
    setEditingStudent(false);
    setError('');
    setStudentNotice(
      `Student data updated — ${patch.name} (${student.grNo}). The edit is recorded in the scholarship audit trail.`
    );
  };

  const matches = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return [];
    return SCHOLARSHIP_STUDENTS.filter((s) =>
    [s.name, s.grNo, s.admissionNo, classLabel(s), s.fatherName].some((f) => f.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [studentQuery]);

  const pickStudent = (id: string) => {
    const s = studentById(id);
    setForm((f) => ({
      ...f,
      studentId: id,
      marks: String(s.marks),
      attendance: String(s.attendance),
      familyIncome: String(s.familyIncome),
      category: s.category,
      sportsLevel: s.sportsLevel,
      conduct: s.conduct,
      isRTE: s.isRTE,
      bank: { ...s.bank }
    }));
    setStudentQuery('');
    setError('');
  };

  const pickScheme = (id: string) => {
    const sc = id ? schemeById(id) : null;
    setForm((f) => ({
      ...f,
      schemeId: id,
      documents: sc ?
      sc.documents.map((name) => f.documents.find((d) => d.name === name) || { name, required: true, status: 'Pending' as DocStatus }) :
      []
    }));
    setError('');
  };

  const setDoc = (name: string, patch: Partial<AppDocument>) =>
  setForm((f) => ({ ...f, documents: f.documents.map((d) => d.name === name ? { ...d, ...patch } : d) }));

  // live preview of the application being entered
  const previewApp: ScholarshipApplication | null =
  student && scheme ?
  {
    id: 'preview',
    appNo: 'preview',
    studentId: student.id,
    schemeId: scheme.id,
    ay: ACADEMIC_YEAR,
    appliedOn: todayIso(),
    submittedBy: 'School Office',
    marks: Number(form.marks) || 0,
    attendance: Number(form.attendance) || 0,
    familyIncome: Number(form.familyIncome) || 0,
    category: form.category,
    sportsLevel: form.sportsLevel,
    conduct: form.conduct,
    isRTE: form.isRTE,
    requestedAmount: defaultAward(scheme, student.annualFee).amount,
    requestedPct: defaultAward(scheme, student.annualFee).pct,
    documents: form.documents,
    status: 'Draft',
    history: []
  } :
  null;
  const preview = previewApp && scheme && student ? evaluateApplication(previewApp, scheme, student) : null;
  const openSchemes = SCHOLARSHIP_SCHEMES.filter((s) => s.status === 'Open');

  const save = (mode: 'draft' | 'submit' | 'evaluate') => {
    let msg = '';
    const marks = Number(form.marks);
    const att = Number(form.attendance);
    const income = Number(form.familyIncome);
    if (!student) msg = 'Select the student.';else
    if (!scheme) msg = 'Select the scholarship scheme.';else
    if (apps.some((a) => a.studentId === student.id && a.schemeId === scheme.id && a.id !== draft?.id))
    msg = `${student.name} has already applied for ${scheme.name} (${apps.find((a) => a.studentId === student.id && a.schemeId === scheme.id)?.appNo}).`;else
    if (mode !== 'draft') {
      if (form.marks === '' || isNaN(marks) || marks < 0 || marks > 100) msg = 'Enter previous-year marks between 0 and 100.';else
      if (form.attendance === '' || isNaN(att) || att < 0 || att > 100) msg = 'Enter attendance between 0 and 100.';else
      if (form.familyIncome === '' || isNaN(income) || income < 0) msg = 'Enter the annual family income.';else
      if (scheme.mode === 'Cash' && (!form.bank.holder.trim() || !/^\d{9,18}$/.test(form.bank.accountNo.trim()) || !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.bank.ifsc.trim())))
      msg = 'Cash scholarships need valid bank details (account holder, 9–18 digit account number and IFSC like HDFC0001234).';else
      if (form.documents.some((d) => d.required && d.status === 'Pending')) msg = 'Mark every required document as Received or Verified (or save as draft).';else
      if (!form.declaration) msg = 'Accept the declaration to submit the application.';
    }
    setError(msg);
    if (msg || !student || !scheme) return;
    const award = defaultAward(scheme, student.annualFee);
    const ids = draft ? { id: draft.id, appNo: draft.appNo } : nextApplicationNo();
    const now = todayIso();
    const app: ScholarshipApplication = {
      ...ids,
      studentId: student.id,
      schemeId: scheme.id,
      ay: ACADEMIC_YEAR,
      appliedOn: now,
      submittedBy: 'School Office',
      marks: isNaN(marks) ? 0 : marks,
      attendance: isNaN(att) ? 0 : att,
      familyIncome: isNaN(income) ? 0 : income,
      category: form.category,
      sportsLevel: form.sportsLevel,
      conduct: form.conduct,
      isRTE: form.isRTE,
      requestedAmount: award.amount,
      requestedPct: award.pct,
      bank: scheme.mode === 'Cash' ? { ...form.bank, ifsc: form.bank.ifsc.toUpperCase() } : undefined,
      documents: form.documents,
      status: mode === 'draft' ? 'Draft' : 'Submitted',
      history: [
      ...(draft?.history || []),
      { on: now, by: CURRENT_USER, action: mode === 'draft' ? draft ? 'Draft updated' : 'Draft saved' : 'Application submitted' }]

    };
    onSave(app, mode);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Button>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          {draft ? `Edit Draft ${draft.appNo}` : 'Create New Scholarship Application'}
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 1. Student */}
          <Card title="1. Student & Full Profile">
            {student ?
            <div className="space-y-4" data-testid="picked-student">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                      {student.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-600">
                        {student.grNo} · Adm: {student.admissionNo} · Class {classLabel(student)} · {student.gender} · DOB: {student.dob || '14-May-2009'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={openStudentEditor} data-testid="edit-student-data">
                      <Pencil className="w-4 h-4" />
                      Edit Student Data
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setForm((f) => ({ ...f, studentId: '' }))}>
                      <X className="w-4 h-4" />
                      Change
                    </Button>
                  </div>
                </div>

                {editingStudent &&
                <div className="border border-indigo-200 bg-indigo-50/40 rounded-lg p-3 space-y-3" data-testid="student-editor">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-indigo-600" />
                        Edit Student Data
                      </p>
                      <span className="text-[11px] text-gray-500">
                        Edits are applied to this application and logged against the application number
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <Input
                      label="Student Name *"
                      value={studentDraft.name || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, name: e.target.value }))} />

                      <Select
                      label="Gender"
                      value={studentDraft.gender || 'Male'}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, gender: e.target.value }))}
                      options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />

                      <Input
                      label="Date of Birth"
                      value={studentDraft.dob || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, dob: e.target.value }))} />

                      <Input
                      label="Aadhaar Number"
                      value={studentDraft.aadhaarNumber || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, aadhaarNumber: e.target.value }))} />

                      <Input
                      label="Father's Name"
                      value={studentDraft.fatherName || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, fatherName: e.target.value }))} />

                      <Input
                      label="Father's Occupation"
                      value={studentDraft.fatherOccupation || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, fatherOccupation: e.target.value }))} />

                      <Input
                      label="Mother's Name"
                      value={studentDraft.motherName || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, motherName: e.target.value }))} />

                      <Input
                      label="Mother's Occupation"
                      value={studentDraft.motherOccupation || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, motherOccupation: e.target.value }))} />

                      <Input
                      label="Mobile Number"
                      value={studentDraft.phone || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, phone: e.target.value }))} />

                      <Input
                      label="Email Address"
                      value={studentDraft.email || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, email: e.target.value }))} />

                      <Input
                      label="Permanent Address"
                      value={studentDraft.permanentAddress || ''}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, permanentAddress: e.target.value }))} />

                      <Select
                      label="Economic Tag"
                      value={studentDraft.economicTag || 'General'}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, economicTag: e.target.value }))}
                      options={[
                      { value: 'General', label: 'General Income' },
                      { value: 'BPL', label: 'BPL Card Holder' },
                      { value: 'EWS', label: 'EWS Certified' }]
                      } />

                      <Select
                      label="Disability Status"
                      value={studentDraft.disability || 'No'}
                      onChange={(e) => setStudentDraft((d) => ({ ...d, disability: e.target.value }))}
                      options={[{ value: 'No', label: 'None' }, { value: 'Yes', label: 'PWD / Disability' }]} />

                      {studentDraft.disability === 'Yes' &&
                    <>
                          <Input
                        label="Disability Type"
                        value={studentDraft.disabilityType || ''}
                        onChange={(e) => setStudentDraft((d) => ({ ...d, disabilityType: e.target.value }))} />

                          <Input
                        label="Disability %"
                        value={studentDraft.disabilityPct || ''}
                        onChange={(e) => setStudentDraft((d) => ({ ...d, disabilityPct: e.target.value }))} />
                        </>
                    }
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" onClick={saveStudentEdits} data-testid="save-student-data">
                        <Save className="w-4 h-4 mr-1" />
                        Save Student Data
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingStudent(false)}>
                        Cancel
                      </Button>
                      <Button variant="ghost" size="sm" onClick={openStudentEditor}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Reset Form
                      </Button>
                      <span className="text-[11px] text-gray-500">
                        Only the student's identity, contact and economic details can be corrected here — marks, attendance and
                        income are verified from the source records.
                      </span>
                    </div>
                  </div>
                }

                {studentNotice &&
                <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{studentNotice}</span>
                  </div>
                }

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-gray-500 block">Aadhaar Number</span>
                    <span className="font-mono font-medium text-gray-900">{student.aadhaarNumber || 'XXXX-XXXX-4819'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Father & Occupation</span>
                    <span className="font-medium text-gray-900">{student.fatherName} ({student.fatherOccupation || 'Employed'})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mother & Occupation</span>
                    <span className="font-medium text-gray-900">{student.motherName} ({student.motherOccupation || 'Homemaker'})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Contact Info</span>
                    <span className="font-medium text-gray-900">{student.phone} · {student.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Economic Tag</span>
                    <span className="font-medium text-gray-900">{student.isBPL ? 'BPL Card Holder' : student.isEWS ? 'EWS Certified' : 'General Income'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Disability Status</span>
                    <span className="font-medium text-gray-900">{student.disability ? (student.disabilityType || 'PWD') + ' (' + (student.disabilityPct || 40) + '%)' : 'None'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Permanent Address</span>
                    <span className="font-medium text-gray-900 truncate block" title={student.permanentAddress || student.currentAddress || 'Ahmedabad, Gujarat'}>
                      {student.permanentAddress || student.currentAddress || 'Ahmedabad, Gujarat'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Bank Aadhaar Seeding</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {student.bank?.isAadhaarLinked ? 'NPCI Seeding Active' : 'Linked'}
                    </span>
                  </div>
                </div>
              </div> :

            <div>
                <Input
                label="Find Student *"
                placeholder="Search by name, GR no, admission no, class or father's name"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

                {studentQuery.trim() &&
              <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100" data-testid="student-results">
                    {matches.length ?
                matches.map((s) =>
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pickStudent(s.id)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 flex justify-between items-center">

                          <span>
                            <span className="font-medium text-gray-900">{s.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {s.grNo} · Class {classLabel(s)}
                            </span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                ) :

                <p className="px-3 py-2 text-sm text-gray-500">No student found</p>
                }
                  </div>
              }
              </div>
            }
          </Card>

          {/* 2. Scheme */}
          <Card title="2. Scholarship Scheme">
            <Select
              label="Scheme *"
              value={form.schemeId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => pickScheme(e.target.value)}
              options={[
              { value: '', label: 'Select a scheme' },
              ...openSchemes.map((s) => ({ value: s.id, label: `${s.name} (${s.kind === 'Government' ? `Govt${s.portal ? ` · ${s.portal}` : ''}` : 'Internal'})` }))]
              } />

            {scheme &&
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-1">
                <p>{scheme.description}</p>
                <p>
                  <span className="text-gray-500">Award:</span>{' '}
                  {scheme.mode === 'Cash' ?
                `${inr(scheme.amount || 0)} cash (NEFT to student bank)` :
                scheme.basis === 'Percent' ?
                `${scheme.pct}% fee waiver` :
                `${inr(scheme.amount || 0)} fee waiver`}
                  {student && ` → ${inr(defaultAward(scheme, student.annualFee).amount)} for ${student.name}`}
                </p>
                <p>
                  <span className="text-gray-500">Criteria:</span>{' '}
                  {[
                scheme.criteria.minMarks != null && `marks ≥ ${scheme.criteria.minMarks}%`,
                scheme.criteria.minAttendance != null && `attendance ≥ ${scheme.criteria.minAttendance}%`,
                scheme.criteria.maxIncome != null && `income ≤ ${inr(scheme.criteria.maxIncome)}`,
                scheme.criteria.categories && `category ${scheme.criteria.categories.join('/')}`,
                scheme.criteria.minSportsLevel && `sports ≥ ${scheme.criteria.minSportsLevel}`,
                scheme.criteria.rteOnly && 'RTE admission',
                (scheme.criteria.minClass || scheme.criteria.maxClass) &&
                `class ${romanClass(scheme.criteria.minClass || 1)}–${romanClass(scheme.criteria.maxClass || 12)}`].

                filter(Boolean).
                join(' · ') || 'none'}
                </p>
              </div>
            }
          </Card>

          {/* 3. Academic & financial */}
          <Card title="3. Academic & Financial Details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Previous-Year Marks (%) *" type="number" min={0} max={100} value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
              <Input label="Attendance (%) *" type="number" min={0} max={100} value={form.attendance} onChange={(e) => setForm({ ...form, attendance: e.target.value })} />
              <Input label="Annual Family Income (₹) *" type="number" min={0} value={form.familyIncome} onChange={(e) => setForm({ ...form, familyIncome: e.target.value })} />
              <Select
                label="Category"
                value={form.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category: e.target.value as Category })}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))} />

              <Select
                label="Sports Level"
                value={form.sportsLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, sportsLevel: e.target.value as SportsLevel })}
                options={SPORTS_LEVELS.map((c) => ({ value: c, label: c }))} />

              <Select
                label="Conduct"
                value={form.conduct}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, conduct: e.target.value as Conduct })}
                options={['Excellent', 'Good', 'Average', 'Poor'].map((c) => ({ value: c, label: c }))} />

            </div>
            <label className="flex items-center gap-2 mt-4 text-sm text-gray-700">
              <input type="checkbox" checked={form.isRTE} onChange={(e) => setForm({ ...form, isRTE: e.target.checked })} className="rounded border-gray-300" />
              Admitted under RTE quota
            </label>
          </Card>

          {/* 4. Bank (cash schemes) */}
          {scheme?.mode === 'Cash' &&
          <Card title="4. Bank Details (for NEFT payment)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Account Holder *" value={form.bank.holder} onChange={(e) => setForm({ ...form, bank: { ...form.bank, holder: e.target.value } })} />
                <Input label="Account Number *" value={form.bank.accountNo} onChange={(e) => setForm({ ...form, bank: { ...form.bank, accountNo: e.target.value } })} />
                <Input label="IFSC *" value={form.bank.ifsc} onChange={(e) => setForm({ ...form, bank: { ...form.bank, ifsc: e.target.value } })} />
                <Input label="Bank Name" value={form.bank.bankName} onChange={(e) => setForm({ ...form, bank: { ...form.bank, bankName: e.target.value } })} />
              </div>
            </Card>
          }

          {/* 5. Documents */}
          <Card title={`${scheme?.mode === 'Cash' ? '5' : '4'}. Documents`}>
            {form.documents.length ?
            <table className="w-full text-sm" data-testid="form-docs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left font-medium">Document</th>
                    <th className="p-3 text-left font-medium w-40">Status</th>
                    <th className="p-3 text-left font-medium">File</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {form.documents.map((d) =>
                <tr key={d.name}>
                      <td className="p-3 text-gray-800">
                        {d.name} <span className="text-rose-500">*</span>
                      </td>
                      <td className="p-3">
                        <select
                      aria-label={`Status of ${d.name}`}
                      value={d.status}
                      onChange={(e) => setDoc(d.name, { status: e.target.value as DocStatus })}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm">

                          <option value="Pending">Pending</option>
                          <option value="Received">Received</option>
                          <option value="Verified">Verified</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <label className="inline-flex items-center gap-2 text-xs text-blue-700 cursor-pointer">
                          <input
                        type="file"
                        className="hidden"
                        aria-label={`Upload ${d.name}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setDoc(d.name, { fileName: file.name, status: d.status === 'Pending' ? 'Received' : d.status });
                        }} />

                          <FileText className="w-4 h-4" />
                          {d.fileName || 'Attach file'}
                        </label>
                      </td>
                    </tr>
                )}
                </tbody>
              </table> :

            <p className="text-sm text-gray-500">Select a scheme to see the required documents.</p>
            }
          </Card>

          <label className="flex items-start gap-2 text-sm text-gray-700 p-4 bg-white border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              checked={form.declaration}
              onChange={(e) => setForm({ ...form, declaration: e.target.checked })}
              className="mt-0.5 rounded border-gray-300"
              aria-label="Declaration" />

            I confirm that the information and documents provided are true and correct. The school may cancel the scholarship if any
            information is found incorrect.
          </label>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {error &&
            <p className="mr-auto text-sm text-rose-600 flex items-center gap-1.5" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            }
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => save('draft')}>
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            <Button variant="outline" onClick={() => save('submit')}>
              <Send className="w-4 h-4" />
              Submit Application
            </Button>
            <Button variant="primary" onClick={() => save('evaluate')}>
              <Scale className="w-4 h-4" />
              Submit &amp; Evaluate
            </Button>
          </div>
        </div>

        {/* Live eligibility preview */}
        <div className="space-y-6">
          <Card title="Eligibility Preview">
            {preview ?
            <div className="space-y-3" data-testid="eligibility-preview">
                <div className={`p-3 rounded-lg text-sm font-medium ${preview.passCritical ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                  {preview.passCritical ? 'Eligible as per scheme criteria' : 'Not eligible — see failed checks'} · Score {preview.score}/100
                </div>
                <ul className="space-y-1.5 text-sm">
                  {preview.checks.map((c) =>
                <li key={c.label} className="flex items-start justify-between gap-2">
                      <span className="text-gray-700">
                        {c.label}
                        <span className="block text-xs text-gray-500">
                          {c.actual} (req. {c.required})
                        </span>
                      </span>
                      {c.pass ?
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> :

                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  }
                    </li>
                )}
                </ul>
              </div> :

            <p className="text-sm text-gray-500">Select a student and a scheme to check eligibility.</p>
            }
          </Card>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-900 flex gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              After submitting, evaluate and approve the application here. Internal scholarships are then selected and awarded in{' '}
              <strong>Scholarship Approval &amp; Award</strong>; government applications are tracked there after approval.
            </p>
          </div>
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------- Evaluation & approval panel
function EvaluationPanel({
  app,
  onDecide,
  onSaveReview




}: {app: ScholarshipApplication;onDecide: (d: {decision: Decision;reason?: string;followUp?: string;remarks: string;override?: string;}) => void;onSaveReview: (remarks: string) => void;}) {
  const scheme = schemeById(app.schemeId);
  const st = studentById(app.studentId);
  const ev = evaluateApplication(app, scheme, st);
  const lockedByPortal = !!app.tracking && app.tracking.status !== 'To Submit';
  const canDecide = app.status !== 'Awarded' && app.status !== 'Draft' && !lockedByPortal;
  const [open, setOpen] = useState(ACTIONABLE.includes(app.status));
  const [decision, setDecision] = useState<Decision | ''>('');
  const [reason, setReason] = useState('');
  const [reasonNote, setReasonNote] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [remarks, setRemarks] = useState(app.evaluation?.remarks || '');
  const [override, setOverride] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setOpen(ACTIONABLE.includes(app.status));
    setDecision('');
    setReason('');
    setReasonNote('');
    setFollowUp('');
    setOverride('');
    setRemarks(app.evaluation?.remarks || '');
    setError('');
  }, [app.id, app.status]);

  const submit = () => {
    let msg = '';
    if (!decision) msg = 'Choose Approve, Reject or Hold.';else
    if (decision === 'Approve' && !ev.passCritical && !override.trim()) msg = 'Some critical criteria failed — add a justification to approve anyway.';else
    if (decision === 'Reject' && !reason) msg = 'Select the rejection reason.';else
    if (decision === 'Reject' && reason === 'Other' && !reasonNote.trim()) msg = 'Describe the rejection reason.';else
    if (decision === 'Hold' && !reasonNote.trim()) msg = 'Enter why the application is on hold.';else
    if (decision === 'Hold' && !followUp) msg = 'Select the follow-up date.';
    setError(msg);
    if (msg || !decision) return;
    onDecide({
      decision,
      reason: decision === 'Reject' ? reason === 'Other' ? reasonNote.trim() : `${reason}${reasonNote.trim() ? ` — ${reasonNote.trim()}` : ''}` : decision === 'Hold' ? reasonNote.trim() : undefined,
      followUp: decision === 'Hold' ? followUp : undefined,
      remarks: remarks.trim(),
      override: decision === 'Approve' && !ev.passCritical ? override.trim() : undefined
    });
  };

  return (
    <Card title="Evaluation & Approval">
      <div className="space-y-4" data-testid="evaluation-panel">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ev.passCritical ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {ev.passCritical ? 'Eligible' : 'Not eligible'}
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800" data-testid="eval-score">
            Score {ev.score}/100
          </span>
          {ev.tags.map((t) =>
          <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700">
              {t}
            </span>
          )}
        </div>

        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden" data-testid="eval-checks">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left font-medium">Criterion</th>
              <th className="p-3 text-left font-medium">Actual</th>
              <th className="p-3 text-left font-medium">Required</th>
              <th className="p-3 text-left font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ev.checks.map((c) =>
            <tr key={c.label}>
                <td className="p-3 text-gray-800">
                  {c.label}
                  {c.critical && <span className="ml-1 text-[10px] text-rose-500 uppercase">critical</span>}
                </td>
                <td className="p-3">{c.actual}</td>
                <td className="p-3 text-gray-500">{c.required}</td>
                <td className="p-3">
                  {c.pass ?
                <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span> :

                <span className="inline-flex items-center gap-1 text-rose-700 text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Fail
                    </span>
                }
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
          Award as per scheme: <strong>{awardText(scheme, app.requestedAmount, app.requestedPct)}</strong>
          {scheme.kind === 'Internal' ?
          ' — final selection and award in Scholarship Approval & Award.' :
          ` — after approval, submit on the ${scheme.portal} portal and track in Scholarship Approval & Award.`}
        </div>

        {app.evaluation?.decision &&
        <div
          className={`p-3 rounded-lg text-sm border ${
          app.evaluation.decision === 'Approve' ?
          'bg-emerald-50 border-emerald-200 text-emerald-900' :
          app.evaluation.decision === 'Reject' ?
          'bg-rose-50 border-rose-200 text-rose-900' :
          'bg-amber-50 border-amber-200 text-amber-900'}`
          }
          data-testid="decision-summary">

            <p className="font-medium">
              {app.evaluation.decision === 'Approve' ? 'Approved' : app.evaluation.decision === 'Reject' ? 'Rejected' : 'On Hold'} by{' '}
              {app.evaluation.evaluatedBy} on {formatDateLong(app.evaluation.evaluatedOn)}
            </p>
            {app.evaluation.reason && <p>Reason: {app.evaluation.reason}</p>}
            {app.evaluation.followUp && <p>Follow-up on {formatDateLong(app.evaluation.followUp)}</p>}
            {app.evaluation.override && <p>Override justification: {app.evaluation.override}</p>}
            {app.evaluation.remarks && <p>Remarks: {app.evaluation.remarks}</p>}
          </div>
        }

        {canDecide && !open &&
        <Button variant="outline" onClick={() => setOpen(true)}>
            <RefreshCw className="w-4 h-4" />
            Re-evaluate
          </Button>
        }
        {!canDecide && app.status !== 'Draft' &&
        <p className="text-xs text-gray-500">
            {app.status === 'Awarded' ?
          'This scholarship has been awarded — the decision can no longer be changed here.' :
          `Already submitted on the ${scheme.portal} portal — update it in Scholarship Approval & Award.`}
          </p>
        }

        {canDecide && open &&
        <div className="space-y-3 pt-3 border-t border-gray-100" data-testid="decision-form">
            <p className="text-sm font-medium text-gray-800">Decision</p>
            <div className="flex flex-wrap gap-2">
              {(['Approve', 'Reject', 'Hold'] as Decision[]).map((d) =>
            <button
              key={d}
              type="button"
              onClick={() => {
                setDecision(d);
                setError('');
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              decision === d ?
              d === 'Approve' ?
              'bg-emerald-600 border-emerald-600 text-white' :
              d === 'Reject' ?
              'bg-rose-600 border-rose-600 text-white' :
              'bg-amber-500 border-amber-500 text-white' :
              'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`
              }>

                  {d === 'Approve' ? '✅ Approve' : d === 'Reject' ? '❌ Reject' : '⏸ Hold'}
                </button>
            )}
            </div>
            {decision === 'Approve' && !ev.passCritical &&
          <div>
                <p className="text-xs text-rose-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Critical criteria failed. Approving needs a justification (recorded in the audit trail).
                </p>
                <Textarea aria-label="Override justification" rows={2} value={override} onChange={(e) => setOverride(e.target.value)} placeholder="Why is this application approved?" />
              </div>
          }
            {decision === 'Reject' &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select
              label="Reason *"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReason(e.target.value)}
              options={[{ value: '', label: 'Select reason' }, ...REJECT_REASONS.map((r) => ({ value: r, label: r }))]} />

                <Input label="Details" value={reasonNote} onChange={(e) => setReasonNote(e.target.value)} placeholder="Optional details" />
              </div>
          }
            {decision === 'Hold' &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Hold Reason *" value={reasonNote} onChange={(e) => setReasonNote(e.target.value)} placeholder="e.g. Income certificate pending" />
                <Input label="Follow-up Date *" type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
              </div>
          }
            <Textarea label="Evaluator Remarks" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Notes for the committee" />
            <div className="flex flex-wrap items-center justify-end gap-2">
              {error &&
            <p className="mr-auto text-sm text-rose-600 flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </p>
            }
              {app.status !== 'Under Review' && ACTIONABLE.includes(app.status) &&
            <Button variant="outline" onClick={() => onSaveReview(remarks.trim())}>
                  <Save className="w-4 h-4" />
                  Save Evaluation
                </Button>
            }
              <Button variant="primary" onClick={submit}>
                <CheckCircle2 className="w-4 h-4" />
                Submit Decision
              </Button>
            </div>
          </div>
        }
      </div>
    </Card>);

}

// ============================================================ MAIN
type View = {kind: 'list';} | {kind: 'detail';id: string;} | {kind: 'form';draftId?: string;};

export function ScholarshipApplicationEntry() {
  const [apps, setApps] = useState<ScholarshipApplication[]>(() => getApplications());
  useEffect(() => {
    setApplications(apps);
  }, [apps]);
  const disbursements = useMemo(() => getDisbursements(), []);

  const [view, setView] = useState<View>({ kind: 'list' });
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppStatus>('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const st = studentById(a.studentId);
      const sc = schemeById(a.schemeId);
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (schemeFilter !== 'all' && a.schemeId !== schemeFilter) return false;
      if (kindFilter !== 'all' && sc.kind !== kindFilter) return false;
      if (classFilter !== 'all' && String(st.cls) !== classFilter) return false;
      if (q && ![st.name, a.appNo, st.grNo, st.admissionNo, st.fatherName, sc.name].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [apps, query, statusFilter, schemeFilter, kindFilter, classFilter]);

  useEffect(() => setPage(1), [query, statusFilter, schemeFilter, kindFilter, classFilter, pageSize]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const countBy = (s: AppStatus) => apps.filter((a) => a.status === s).length;

  const resetFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setSchemeFilter('all');
    setKindFilter('all');
    setClassFilter('all');
  };

  const updateApp = (id: string, fn: (a: ScholarshipApplication) => ScholarshipApplication) =>
  setApps((prev) => prev.map((a) => a.id === id ? fn(a) : a));

  const exportList = () => {
    const rows = filtered.map((a) => {
      const st = studentById(a.studentId);
      const sc = schemeById(a.schemeId);
      return [a.appNo, st.name, st.grNo, classLabel(st), sc.name, sc.kind, a.marks, a.attendance, a.familyIncome, a.requestedAmount, a.appliedOn, a.status];
    });
    downloadText(
      `scholarship-applications-${todayIso()}.csv`,
      toCsv([['App No', 'Student', 'GR No', 'Class', 'Scheme', 'Type', 'Marks %', 'Attendance %', 'Family Income', 'Award (as per scheme)', 'Applied On', 'Status'], ...rows])
    );
  };
  const printList = () =>
  printHtml(
    htmlDoc(
      'Scholarship Applications',
      `Scholarship Applications — AY ${ACADEMIC_YEAR} (${filtered.length})`,
      htmlTable(
        ['App No', 'Student', 'Class', 'Scheme', 'Marks %', 'Attend. %', 'Income', 'Applied On', 'Status'],
        filtered.map((a) => {
          const st = studentById(a.studentId);
          return [a.appNo, st.name, classLabel(st), schemeById(a.schemeId).name, `${a.marks}%`, `${a.attendance}%`, a.familyIncome, formatDate(a.appliedOn), a.status];
        })
      )
    )
  );

  const handleFormSave = (app: ScholarshipApplication, mode: 'draft' | 'submit' | 'evaluate') => {
    setApps((prev) => prev.some((a) => a.id === app.id) ? prev.map((a) => a.id === app.id ? app : a) : [app, ...prev]);
    const st = studentById(app.studentId);
    setNotice(
      mode === 'draft' ?
      `Draft ${app.appNo} saved for ${st.name}.` :
      `Application ${app.appNo} submitted for ${st.name} — ${schemeById(app.schemeId).name}.`
    );
    setView(mode === 'evaluate' ? { kind: 'detail', id: app.id } : { kind: 'list' });
  };

  const decide = (app: ScholarshipApplication, d: {decision: Decision;reason?: string;followUp?: string;remarks: string;override?: string;}) => {
    const scheme = schemeById(app.schemeId);
    const st = studentById(app.studentId);
    const ev = evaluateApplication(app, scheme, st);
    const now = todayIso();
    const status: AppStatus = d.decision === 'Approve' ? 'Approved' : d.decision === 'Reject' ? 'Rejected' : 'On Hold';
    updateApp(app.id, (a) => ({
      ...a,
      status,
      evaluation: {
        score: ev.score,
        passCritical: ev.passCritical,
        decision: d.decision,
        reason: d.reason,
        followUp: d.followUp,
        remarks: d.remarks,
        override: d.override,
        sanctionPct: d.decision === 'Approve' ? a.requestedPct : undefined,
        sanctionAmount: d.decision === 'Approve' ? a.requestedAmount : undefined,
        evaluatedBy: CURRENT_USER,
        evaluatedOn: now
      },
      tracking:
      scheme.kind === 'Government' ?
      status === 'Approved' ?
      a.tracking || { status: 'To Submit' } :
      undefined :
      a.tracking,
      history: [...a.history, { on: now, by: CURRENT_USER, action: `Evaluated — ${status.toLowerCase()}${d.override ? ' (override)' : ''}` }]
    }));
    setNotice(
      status === 'Approved' ?
      scheme.kind === 'Internal' ?
      `${app.appNo} approved — ${st.name} is now shortlisted for ${scheme.name} in Scholarship Approval & Award.` :
      `${app.appNo} approved — ${st.name} is ready to submit on the ${scheme.portal} portal (Scholarship Approval & Award → Government).` :
      status === 'Rejected' ?
      `${app.appNo} rejected.` :
      `${app.appNo} put on hold until ${formatDateLong(d.followUp)}.`
    );
  };

  const saveReview = (app: ScholarshipApplication, remarks: string) => {
    const now = todayIso();
    const ev = evaluateApplication(app, schemeById(app.schemeId), studentById(app.studentId));
    updateApp(app.id, (a) => ({
      ...a,
      status: 'Under Review',
      evaluation: { score: ev.score, passCritical: ev.passCritical, remarks, evaluatedBy: CURRENT_USER, evaluatedOn: now },
      history: [...a.history, { on: now, by: CURRENT_USER, action: 'Evaluation saved (under review)' }]
    }));
    setNotice(`${app.appNo} marked Under Review.`);
  };

  const setDocStatus = (app: ScholarshipApplication, name: string, status: DocStatus) => {
    updateApp(app.id, (a) => ({
      ...a,
      documents: a.documents.map((d) => d.name === name ? { ...d, status } : d),
      history: [...a.history, { on: todayIso(), by: CURRENT_USER, action: `${name} marked ${status}` }]
    }));
  };

  const deleteDraft = (app: ScholarshipApplication) => {
    setApps((prev) => prev.filter((a) => a.id !== app.id));
    setNotice(`Draft ${app.appNo} deleted.`);
    setView({ kind: 'list' });
  };

  // ============================================================ RENDER
  const active = view.kind === 'detail' ? apps.find((a) => a.id === view.id) || null : null;
  const draftForForm = view.kind === 'form' && view.draftId ? apps.find((a) => a.id === view.draftId) || null : null;

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Scholarship Application Entry
                <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                  FY: 2025-26
                </Badge>
              </h1>
              <p className="text-xs text-gray-500">
                All student scholarship applications — view details, create new applications, evaluate and approve
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">AY {ACADEMIC_YEAR}</Badge>
          {view.kind === 'list' &&
          <>
              <Button variant="outline" onClick={exportList} disabled={!filtered.length}>
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" onClick={printList} disabled={!filtered.length}>
                <Printer className="w-4 h-4" />
                Print List
              </Button>
              <Button variant="primary" onClick={() => setView({ kind: 'form' })}>
                <Plus className="w-4 h-4" />
                Create New Application
              </Button>
            </>
          }
        </div>
      </div>

      {notice &&
      <div role="status" className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm bg-emerald-50 border-emerald-200 text-emerald-800">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {notice}
          </span>
          <button onClick={() => setNotice('')} className="p-1 rounded hover:bg-black/5" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* ================================================= LIST */}
      {view.kind === 'list' &&
      <>
          <div className="flex flex-wrap gap-2" data-testid="status-chips">
            {(['all', ...STATUSES] as ('all' | AppStatus)[]).map((s) =>
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
            statusFilter === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`
            }>

                {s === 'all' ? 'All' : s} <span className="ml-1 opacity-80">({s === 'all' ? apps.length : countBy(s)})</span>
              </button>
          )}
          </div>

          <Card>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <Input
                label="Search"
                placeholder="Student, App No, GR no, admission no, father's name or scheme"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <Select
              label="Scheme"
              value={schemeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSchemeFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Schemes' }, ...SCHOLARSHIP_SCHEMES.map((s) => ({ value: s.id, label: s.name }))]} />

              <Select
              label="Type"
              value={kindFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setKindFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Types' }, { value: 'Internal', label: 'Internal' }, { value: 'Government', label: 'Government' }]} />

              <Select
              label="Class"
              value={classFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClassFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Classes' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${romanClass(i + 1)}` }))]} />

            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600" data-testid="list-summary">
                {filtered.length} application{filtered.length !== 1 ? 's' : ''} found
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </Button>
            </div>
          </Card>

          <Card noPadding className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left" data-testid="apps-table">
                <thead className="bg-gray-100 text-gray-600 border-b">
                  <tr>
                    <th className="p-3 font-medium">App No</th>
                    <th className="p-3 font-medium">Student</th>
                    <th className="p-3 font-medium">Scheme</th>
                    <th className="p-3 font-medium text-right">Marks</th>
                    <th className="p-3 font-medium text-right">Attend.</th>
                    <th className="p-3 font-medium text-right">Income</th>
                    <th className="p-3 font-medium text-right">Award</th>
                    <th className="p-3 font-medium">Applied On</th>
                    <th className="p-3 font-medium">Docs</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageRows.map((a) => {
                  const st = studentById(a.studentId);
                  const sc = schemeById(a.schemeId);
                  const verified = a.documents.filter((d) => d.status === 'Verified').length;
                  return (
                    <tr key={a.id} className="hover:bg-gray-50" data-app={a.appNo}>
                        <td className="p-3 font-mono text-xs text-gray-700">{a.appNo}</td>
                        <td className="p-3">
                          <p className="font-medium text-gray-900" data-testid="app-student">
                            {st.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {st.grNo} · {classLabel(st)}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="text-gray-900">{sc.name}</p>
                          <div className="mt-0.5">
                            <KindBadge scheme={sc} />
                          </div>
                        </td>
                        <td className="p-3 text-right">{a.marks}%</td>
                        <td className="p-3 text-right">{a.attendance}%</td>
                        <td className="p-3 text-right">{inr(a.familyIncome)}</td>
                        <td className="p-3 text-right">
                          <p className="text-gray-900">{inr(a.award?.amount ?? a.requestedAmount)}</p>
                          <p className="text-xs text-gray-500">{sc.mode === 'Cash' ? 'Cash' : a.requestedPct != null && sc.basis === 'Percent' ? `${a.award?.pct ?? a.requestedPct}% waiver` : 'Waiver'}</p>
                        </td>
                        <td className="p-3 text-gray-600">{formatDate(a.appliedOn)}</td>
                        <td className="p-3">
                          <span className={`text-xs ${verified === a.documents.length ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {verified}/{a.documents.length} verified
                          </span>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="xs" title="View details" onClick={() => setView({ kind: 'detail', id: a.id })}>
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            {ACTIONABLE.includes(a.status) &&
                          <Button variant="ghost" size="xs" title="Evaluate & approve" onClick={() => setView({ kind: 'detail', id: a.id })}>
                                <Scale className="w-4 h-4 text-purple-600" />
                              </Button>
                          }
                            {a.status === 'Draft' &&
                          <Button variant="ghost" size="xs" title="Edit draft" onClick={() => setView({ kind: 'form', draftId: a.id })}>
                                <FileText className="w-4 h-4 text-gray-600" />
                              </Button>
                          }
                            <Button variant="ghost" size="xs" title="Print application" onClick={() => printHtml(applicationHtml(a))}>
                              <Printer className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 ?
          <div className="p-12 text-center text-gray-500">
                <Search className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">No applications found</p>
                <p className="text-sm">Try changing the filters.</p>
              </div> :

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 text-sm">
                <span className="text-gray-600" data-testid="page-info">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <select
                aria-label="Rows per page"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm">

                    {[10, 25, 50, 100].map((n) =>
                <option key={n} value={n}>
                        {n} / page
                      </option>
                )}
                  </select>
                  <Button variant="outline" size="xs" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-gray-700">
                    {page} / {pages}
                  </span>
                  <Button variant="outline" size="xs" disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Next page">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
          }
          </Card>
        </>
      }

      {/* ================================================= CREATE / EDIT DRAFT */}
      {view.kind === 'form' &&
      <ApplicationForm draft={draftForForm} apps={apps} onCancel={() => setView({ kind: 'list' })} onSave={handleFormSave} />
      }

      {/* ================================================= DETAIL */}
      {active && (() => {
        const st = studentById(active.studentId);
        const sc = schemeById(active.schemeId);
        const disb = disbursements.filter((d) => d.appId === active.id);
        return (
          <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" onClick={() => setView({ kind: 'list' })}>
                  <ArrowLeft className="w-4 h-4" />
                  Back to List
                </Button>
                <div className="flex flex-wrap gap-2">
                  {active.status === 'Draft' &&
                <>
                      <Button variant="outline" onClick={() => setView({ kind: 'form', draftId: active.id })}>
                        <FileText className="w-4 h-4" />
                        Edit Draft
                      </Button>
                      <Button variant="danger" onClick={() => deleteDraft(active)}>
                        <Trash2 className="w-4 h-4" />
                        Delete Draft
                      </Button>
                    </>
                }
                  <Button variant="outline" onClick={() => printHtml(applicationHtml(active))}>
                    <Printer className="w-4 h-4" />
                    Print Application
                  </Button>
                </div>
              </div>

              <Card>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                      {st.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900" data-testid="detail-name">
                          {st.name}
                        </h2>
                        <Badge variant="outline">{active.appNo}</Badge>
                        <StatusBadge status={active.status} />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {st.grNo} · {st.admissionNo} · Class {classLabel(st)} · {st.gender} · {active.category}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 flex flex-wrap items-center gap-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        {sc.name} <KindBadge scheme={sc} />
                        <span className="text-gray-500">
                          {sc.provider}
                          {sc.portal ? ` · ${sc.portal}` : ''} · Applied {formatDateLong(active.appliedOn)} via {active.submittedBy}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 lg:w-[420px]">
                    {[
                  ['Marks', `${active.marks}%`],
                  ['Attendance', `${active.attendance}%`],
                  ['Family Income', inr(active.familyIncome)]].
                  map(([k, v]) =>
                  <div key={k} className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">{k}</p>
                        <p className="font-semibold text-gray-900">{v}</p>
                      </div>
                  )}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card title="Student & Family Profile">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {[
                    ['Date of Birth', st.dob || '14-May-2009'],
                    ['Aadhaar Number', st.aadhaarNumber || 'XXXX-XXXX-4819'],
                    ['Father', st.fatherName + (st.fatherOccupation ? ' (' + st.fatherOccupation + ')' : '')],
                    ['Mother', st.motherName + (st.motherOccupation ? ' (' + st.motherOccupation + ')' : '')],
                    ['Phone', st.phone],
                    ['Email', st.email],
                    ['Economic Tag', st.isBPL ? 'BPL Card Holder' : st.isEWS ? 'EWS Category' : 'Non-EWS'],
                    ['Disability Status', st.disability ? (st.disabilityType || 'PWD') + ' (' + (st.disabilityPct || 40) + '%)' : 'None'],
                    ['Current Address', st.currentAddress || 'Ahmedabad, Gujarat'],
                    ['Permanent Address', st.permanentAddress || 'Ahmedabad, Gujarat'],
                    ['Sports Level', active.sportsLevel],
                    ['Conduct', active.conduct],
                    ['RTE Admission', active.isRTE ? 'Yes' : 'No'],
                    ['Annual Fee', inr(st.annualFee)],
                    ['Award (as per scheme)', awardText(sc, active.requestedAmount, active.requestedPct)]].
                    map(([k, v]) =>
                    <div key={k}>
                          <dt className="text-gray-500 text-xs">{k}</dt>
                          <dd className="text-gray-900 font-medium">{v}</dd>
                        </div>
                    )}
                    </dl>
                  </Card>

                  {active.bank &&
                <Card title="Bank & DBT Details">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <Landmark className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {active.bank.holder} · A/c {active.bank.accountNo} · {active.bank.ifsc} · {active.bank.bankName}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600 pl-8">
                          <span>Branch: {active.bank.branch || 'Navrangpura Branch'}</span>
                          <span>MICR: {active.bank.micr || '380002014'}</span>
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Seeding: Active (NPCI Verified)
                          </span>
                        </div>
                      </div>
                    </Card>
                }

                  <Card title="Documents">
                    <table className="w-full text-sm" data-testid="detail-docs">
                      <tbody className="divide-y divide-gray-100">
                        {active.documents.map((d) =>
                      <tr key={d.name}>
                            <td className="py-2 text-gray-800">
                              {d.name}
                              {d.fileName && <span className="block text-xs text-blue-700">{d.fileName}</span>}
                            </td>
                            <td className="py-2 w-40">
                              <select
                            aria-label={`Verify ${d.name}`}
                            value={d.status}
                            disabled={active.status === 'Awarded'}
                            onChange={(e) => setDocStatus(active, d.name, e.target.value as DocStatus)}
                            className={`w-full rounded-lg border px-2 py-1 text-sm ${
                            d.status === 'Verified' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : d.status === 'Received' ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`
                            }>

                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                                <option value="Verified">Verified</option>
                              </select>
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </Card>

                  {(active.tracking || active.award || disb.length > 0) &&
                <Card title="Award & Disbursement">
                      <div className="space-y-2 text-sm" data-testid="award-summary">
                        {active.tracking &&
                    <p>
                            <span className="text-gray-500">Government status:</span> <strong>{active.tracking.status}</strong>
                            {active.tracking.portalRef ? ` · ${sc.portal} ref ${active.tracking.portalRef}` : ''}
                            {active.tracking.amountApproved ? ` · approved ${inr(active.tracking.amountApproved)}` : ''}
                            {active.tracking.rejectReason ? ` · ${active.tracking.rejectReason}` : ''}
                          </p>
                    }
                        {active.award &&
                    <p>
                            <span className="text-gray-500">Awarded:</span> <strong>{inr(active.award.amount)}</strong>
                            {active.award.pct != null && sc.basis === 'Percent' ? ` (${active.award.pct}% fee waiver)` : ''} on {formatDateLong(active.award.awardedOn)} by {active.award.by}
                          </p>
                    }
                        {disb.map((d) =>
                    <p key={d.id}>
                            <span className="text-gray-500">Disbursement:</span> {d.mode} {inr(d.amount)} —{' '}
                            <strong>{d.status === 'Done' ? `Done on ${formatDateLong(d.appliedOn)}` : 'Pending'}</strong>
                            {d.voucherNo ? ` · ${d.voucherNo}` : ''}
                          </p>
                    )}
                      </div>
                    </Card>
                }
                </div>

                <div className="space-y-6">
                  {active.status === 'Draft' ?
                <Card title="Evaluation & Approval">
                      <p className="text-sm text-gray-600">This is a draft. Submit it (Edit Draft → Submit Application) before evaluating.</p>
                    </Card> :

                <EvaluationPanel app={active} onDecide={(d) => decide(active, d)} onSaveReview={(r) => saveReview(active, r)} />
                }

                  <Card title="Timeline">
                    <ol className="space-y-3" data-testid="timeline">
                      {[...active.history].reverse().map((h, i) =>
                    <li key={i} className="flex gap-3">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <div>
                            <p className="text-sm text-gray-900">{h.action}</p>
                            <p className="text-xs text-gray-500">
                              {formatDateLong(h.on)} · {h.by}
                            </p>
                          </div>
                        </li>
                    )}
                    </ol>
                  </Card>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Decisions are recorded as {CURRENT_USER}.
                  </div>
                </div>
              </div>
            </>);

      })()}
    </div>);

}

export default ScholarshipApplicationEntry;
