import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { Search, RotateCcw, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';

type Status = 'present' | 'absent' | 'late' | 'leave' | 'half-day' | 'unmarked';
type Mode = 'whole-day' | 'subject-wise';
type PageTab = 'attendance' | 'correction' | 'history';

type Student = {
  id: string;
  rollNo: string;
  admission: string;
  name: string;
  initials: string;
  branch: string;
  klass: string;
  division: string;
  batch: string;
  status: Status;
  remarks?: string;
};

type Correction = {
  id: string;
  date: string;
  student: string;
  admission: string;
  from: Status;
  to: Status;
  reason: string;
  by: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const INITIAL: Student[] = [
  'Aarav Patel', 'Aditi Sharma', 'Arjun Kumar', 'Diya Singh', 'Ishaan Gupta', 'Kavya Reddy',
  'Rohan Verma', 'Sanya Joshi', 'Vivaan Mehta', 'Ananya Iyer', 'Kabir Malhotra', 'Myra Kapoor',
  'Reyansh Shah', 'Saanvi Nair', 'Vihaan Choudhary', 'Zara Khan'
].map((name, i) => ({
  id: String(i + 1),
  rollNo: String(i + 1).padStart(2, '0'),
  admission: `ADM-10A-${1001 + i}`,
  name,
  initials: name.split(' ').map((p) => p[0]).join(''),
  branch: i % 5 === 0 ? 'North Campus' : 'Main Campus',
  klass: '10',
  division: i % 3 === 0 ? 'B' : 'A',
  batch: i % 4 === 0 ? '2025-26' : '2026-27',
  status: 'unmarked' as Status
}));

const SUBJECTS = [
  { id: '1', name: 'Mathematics', teacher: 'Mr. Sharma', period: 1, time: '08:00–08:45' },
  { id: '2', name: 'Physics', teacher: 'Mrs. Gupta', period: 2, time: '08:45–09:30' },
  { id: '3', name: 'Chemistry', teacher: 'Mr. Kumar', period: 3, time: '09:45–10:30' },
  { id: '4', name: 'English', teacher: 'Ms. Patel', period: 4, time: '10:30–11:15' }
];

const STATUS_BTN: { id: Status; label: string; cls: string }[] = [
  { id: 'present', label: 'Present', cls: 'bg-emerald-100 text-emerald-700' },
  { id: 'absent', label: 'Absent', cls: 'bg-red-100 text-red-700' },
  { id: 'late', label: 'Late', cls: 'bg-amber-100 text-amber-700' },
  { id: 'leave', label: 'Leave', cls: 'bg-blue-100 text-blue-700' },
  { id: 'half-day', label: 'Half Day', cls: 'bg-purple-100 text-purple-700' }
];

const SEED_HISTORY: Correction[] = [
  { id: 'MC-014', date: '2026-10-28', student: 'Aarav Patel', admission: 'ADM-10A-1001', from: 'absent', to: 'present', reason: 'Biometric miss — student was in assembly', by: 'Class Teacher', status: 'Approved' },
  { id: 'MC-015', date: '2026-10-30', student: 'Diya Singh', admission: 'ADM-10A-1004', from: 'present', to: 'leave', reason: 'Medical certificate submitted late', by: 'Class Teacher', status: 'Pending' }
];

export function QuickPresentEntry() {
  const [tab, setTab] = useState<PageTab>('attendance');
  const [mode, setMode] = useState<Mode>('whole-day');
  const [year, setYear] = useState('2026-27');
  const [branch, setBranch] = useState('Main Campus');
  const [klass, setKlass] = useState('10');
  const [section, setSection] = useState('A');
  const [date, setDate] = useState('2026-11-02');
  const [session, setSession] = useState('full');
  const [subject, setSubject] = useState('1');
  const [search, setSearch] = useState('');
  const [hasLoaded, setHasLoaded] = useState(true);
  const [students, setStudents] = useState<Student[]>(INITIAL);
  const [subjectMap, setSubjectMap] = useState<Record<string, Student[]>>({});
  const [moreOpen, setMoreOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [undoStack, setUndoStack] = useState<Student[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<Status>('present');
  const [copyOpen, setCopyOpen] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [unmarkedOpen, setUnmarkedOpen] = useState(false);
  const [remarkFor, setRemarkFor] = useState<Student | null>(null);
  const [remark, setRemark] = useState('');

  const [cBranch, setCBranch] = useState('');
  const [cClass, setCClass] = useState('');
  const [cDivision, setCDivision] = useState('');
  const [cBatch, setCBatch] = useState('');
  const [cSearch, setCSearch] = useState('');
  const [cSearched, setCSearched] = useState(false);
  const [cPick, setCPick] = useState<Student | null>(null);
  const [corrDate, setCorrDate] = useState('2026-11-02');
  const [corrFrom, setCorrFrom] = useState<Status>('absent');
  const [corrTo, setCorrTo] = useState<Status>('present');
  const [corrReason, setCorrReason] = useState('');
  const [history, setHistory] = useState<Correction[]>(SEED_HISTORY);
  const [histFilter, setHistFilter] = useState('');

  const flash = (t: string) => { setNotice(t); window.setTimeout(() => setNotice(''), 4000); };
  const currentSubject = SUBJECTS.find((s) => s.id === subject);

  const current = useMemo(() => {
    if (mode === 'subject-wise') return subjectMap[subject] || INITIAL.map((s) => ({ ...s, status: 'unmarked' as Status }));
    return students;
  }, [mode, subject, subjectMap, students]);

  const write = (next: Student[]) => {
    setUndoStack((p) => [...p.slice(-9), current]);
    if (mode === 'subject-wise') setSubjectMap((m) => ({ ...m, [subject]: next }));
    else setStudents(next);
  };

  const filtered = current.filter((s) => !search || `${s.name} ${s.rollNo} ${s.admission}`.toLowerCase().includes(search.toLowerCase()));
  const unmarked = current.filter((s) => s.status === 'unmarked');
  const conflicts = useMemo(() => {
    if (mode !== 'subject-wise') return [];
    return current.filter((s) => {
      const day = students.find((d) => d.id === s.id);
      if (!day || day.status === 'unmarked' || s.status === 'unmarked') return false;
      return (day.status === 'absent' && s.status === 'present') || (day.status === 'present' && s.status === 'absent');
    });
  }, [mode, current, students]);

  const correctionMatches = INITIAL.filter((s) => {
    if (cBranch && s.branch !== cBranch) return false;
    if (cClass && s.klass !== cClass) return false;
    if (cDivision && s.division !== cDivision) return false;
    if (cBatch && s.batch !== cBatch) return false;
    if (cSearch && !`${s.name} ${s.admission} ${s.rollNo}`.toLowerCase().includes(cSearch.toLowerCase())) return false;
    return true;
  });

  const setStatus = (id: string, status: Status) => write(current.map((s) => s.id === id ? { ...s, status } : s));

  const submitCorrection = () => {
    if (!cPick || !corrReason.trim()) { flash('Select a student and enter a reason.'); return; }
    setHistory((p) => [{
      id: `MC-${Date.now()}`,
      date: corrDate,
      student: cPick.name,
      admission: cPick.admission,
      from: corrFrom,
      to: corrTo,
      reason: corrReason,
      by: 'Class Teacher',
      status: 'Pending'
    }, ...p]);
    write(current.map((s) => s.id === cPick.id ? { ...s, status: corrTo, remarks: corrReason } : s));
    setCorrReason('');
    flash('Correction submitted for approval and logged in history.');
    setTab('history');
  };

  const loadSheet = () => {
    setHasLoaded(true);
    flash(`Loaded Class ${klass}-${section} · ${date}.`);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-sm text-gray-500">Mark whole-day or subject-wise attendance. Search and correct records like Employee Attendance.</p>
      </div>
      {notice && <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="mb-4 flex flex-wrap gap-2">
        {[{ id: 'attendance' as const, label: 'Mark Attendance' }, { id: 'correction' as const, label: 'Manual Correction' }, { id: 'history' as const, label: 'Correction History' }].map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${tab === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[{ id: 'whole-day' as const, label: 'Whole Day' }, { id: 'subject-wise' as const, label: 'Subject-Wise' }].map((t) => (
              <button key={t.id} type="button" onClick={() => setMode(t.id)} className={`rounded-lg border px-3 py-1.5 text-sm ${mode === t.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-600'}`}>{t.label}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-4 lg:grid-cols-7">
            <Select label="Academic Year" value={year} onChange={(e) => setYear(typeof e === 'string' ? e : e.target.value)} options={[{ value: '2026-27', label: '2026-27' }]} />
            <Select label="Branch" value={branch} onChange={(e) => setBranch(typeof e === 'string' ? e : e.target.value)} options={['Main Campus', 'North Campus'].map((v) => ({ value: v, label: v }))} />
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Select label="Class" value={klass} onChange={(e) => setKlass(typeof e === 'string' ? e : e.target.value)} options={['9', '10', '11', '12'].map((v) => ({ value: v, label: `Class ${v}` }))} />
            <Select label="Section" value={section} onChange={(e) => setSection(typeof e === 'string' ? e : e.target.value)} options={['A', 'B', 'C'].map((v) => ({ value: v, label: v }))} />
            {mode === 'whole-day'
              ? <Select label="Session" value={session} onChange={(e) => setSession(typeof e === 'string' ? e : e.target.value)} options={[{ value: 'full', label: 'Full Day' }, { value: 'morning', label: 'Morning' }, { value: 'afternoon', label: 'Afternoon' }]} />
              : <Select label="Subject" value={subject} onChange={(e) => setSubject(typeof e === 'string' ? e : e.target.value)} options={SUBJECTS.map((s) => ({ value: s.id, label: `P${s.period} ${s.name}` }))} />}
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-gray-600">Search student</label>
              <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, roll, admission" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => { setSearch(''); setHasLoaded(false); flash('Search cleared.'); }}><RotateCcw className="mr-2 h-4 w-4" />Clear</Button>
            <Button onClick={loadSheet}><Search className="mr-2 h-4 w-4" />Load Class</Button>
            <div className="relative">
              <Button variant="outline" onClick={() => setMoreOpen((v) => !v)}>More Actions <ChevronDown className="ml-1 h-4 w-4" /></Button>
              {moreOpen && (
                <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border bg-white py-1 shadow">
                  <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { if (!selected.length) { flash('Select students first.'); setMoreOpen(false); return; } setBulkOpen(true); setMoreOpen(false); }}>Bulk Status Update</button>
                  <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setCopyOpen(true); setMoreOpen(false); }}>Copy Previous Session</button>
                  <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setUnmarkedOpen(true); setMoreOpen(false); }}>Review Unmarked</button>
                  <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setConflictOpen(true); setMoreOpen(false); }}>Review Conflicts</button>
                  <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50" onClick={() => {
                    const prev = undoStack[undoStack.length - 1];
                    if (!prev) { flash('Nothing to undo.'); setMoreOpen(false); return; }
                    setUndoStack((p) => p.slice(0, -1));
                    if (mode === 'subject-wise') setSubjectMap((m) => ({ ...m, [subject]: prev }));
                    else setStudents(prev);
                    flash('Last change undone.');
                    setMoreOpen(false);
                  }}>Undo Changes</button>
                </div>
              )}
            </div>
          </div>
          {mode === 'subject-wise' && currentSubject && <p className="text-sm text-gray-500">Teacher: {currentSubject.teacher} · Period {currentSubject.period} · {currentSubject.time}</p>}

          {hasLoaded && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(e) => setSelected(e.target.checked ? filtered.map((s) => s.id) : [])} /></th>
                    {['Roll', 'Admission', 'Student', 'Class', 'Status', 'Remarks'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-indigo-50">
                      <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(s.id)} onChange={(e) => setSelected((p) => e.target.checked ? [...p, s.id] : p.filter((x) => x !== s.id))} /></td>
                      <td className="px-3 py-2 font-medium text-blue-600">{s.rollNo}</td>
                      <td className="px-3 py-2 text-xs">{s.admission}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{s.name}</td>
                      <td className="px-3 py-2 text-gray-600">{s.klass}-{s.division}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {STATUS_BTN.map((b) => (
                            <button key={b.id} type="button" onClick={() => setStatus(s.id, b.id)} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.status === b.id ? b.cls : 'bg-gray-100 text-gray-400'}`}>{b.label}</button>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2"><Button size="xs" variant="ghost" onClick={() => { setRemarkFor(s); setRemark(s.remarks || ''); }}>{s.remarks ? 'Edit' : 'Add'}</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No students match this search.</p>}
            </div>
          )}
          {hasLoaded && (
            <div className="flex justify-end">
              <Button onClick={() => setFinalizeOpen(true)}><CheckCircle className="mr-1 h-4 w-4" />Finalize Attendance</Button>
            </div>
          )}
        </div>
      )}

      {tab === 'correction' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div className="relative lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Search student</label>
              <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
              <input value={cSearch} onChange={(e) => setCSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setCSearched(true); }} placeholder="Name, admission or roll" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
            </div>
            <Select label="Branch" value={cBranch} onChange={(e) => setCBranch(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All branches' }, { value: 'Main Campus', label: 'Main Campus' }, { value: 'North Campus', label: 'North Campus' }]} />
            <Select label="Class" value={cClass} onChange={(e) => setCClass(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All classes' }, ...['9', '10', '11', '12'].map((v) => ({ value: v, label: `Class ${v}` }))]} />
            <Select label="Division" value={cDivision} onChange={(e) => setCDivision(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All divisions' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' }]} />
            <Select label="Batch" value={cBatch} onChange={(e) => setCBatch(typeof e === 'string' ? e : e.target.value)} options={[{ value: '', label: 'All batches' }, { value: '2026-27', label: '2026-27' }, { value: '2025-26', label: '2025-26' }]} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setCBranch(''); setCClass(''); setCDivision(''); setCBatch(''); setCSearch(''); setCSearched(false); setCPick(null); }}><RotateCcw className="mr-2 h-4 w-4" />Clear Search</Button>
            <Button onClick={() => setCSearched(true)}><Search className="mr-2 h-4 w-4" />Search Records</Button>
          </div>
          {cSearched && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>{['Admission', 'Student', 'Branch', 'Class', 'Division', 'Batch'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {correctionMatches.map((s) => (
                    <tr key={s.id} onClick={() => { setCPick(s); setCorrFrom(s.status === 'unmarked' ? 'absent' : s.status); }} className={`cursor-pointer hover:bg-indigo-50 ${cPick?.id === s.id ? 'bg-indigo-50' : ''}`}>
                      <td className="px-3 py-2 font-medium text-blue-600">{s.admission}</td>
                      <td className="px-3 py-2 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-gray-600">{s.branch}</td>
                      <td className="px-3 py-2">{s.klass}</td>
                      <td className="px-3 py-2">{s.division}</td>
                      <td className="px-3 py-2">{s.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {correctionMatches.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No records for this search.</p>}
            </div>
          )}
          {cPick && (
            <div className="space-y-4 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4">
              <p className="font-semibold text-gray-900">{cPick.name} · {cPick.admission} · Class {cPick.klass}-{cPick.division}</p>
              <div className="grid gap-3 md:grid-cols-4">
                <Input label="Attendance Date" type="date" value={corrDate} onChange={(e) => setCorrDate(e.target.value)} />
                <Select label="Current status" value={corrFrom} onChange={(e) => setCorrFrom((typeof e === 'string' ? e : e.target.value) as Status)} options={STATUS_BTN.map((s) => ({ value: s.id, label: s.label }))} />
                <Select label="Corrected status" value={corrTo} onChange={(e) => setCorrTo((typeof e === 'string' ? e : e.target.value) as Status)} options={STATUS_BTN.map((s) => ({ value: s.id, label: s.label }))} />
              </div>
              <Textarea label="Reason * (min 8 characters)" rows={3} value={corrReason} onChange={(e) => setCorrReason(e.target.value)} />
              <div className="flex justify-end"><Button onClick={submitCorrection}>Save Correction</Button></div>
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <Card title="Correction History">
          <Input className="mb-3 max-w-sm" placeholder="Search student or reason" value={histFilter} onChange={(e) => setHistFilter(e.target.value)} />
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">{['ID', 'Date', 'Student', 'From → To', 'Reason', 'By', 'Status'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {history.filter((h) => `${h.student} ${h.reason} ${h.id}`.toLowerCase().includes(histFilter.toLowerCase())).map((h) => (
                <tr key={h.id} className="border-b">
                  <td className="px-3 py-2 font-mono text-xs">{h.id}</td>
                  <td className="px-3 py-2 text-xs">{h.date}</td>
                  <td className="px-3 py-2">{h.student}</td>
                  <td className="px-3 py-2 text-xs">{h.from} → {h.to}</td>
                  <td className="px-3 py-2 text-xs">{h.reason}</td>
                  <td className="px-3 py-2 text-xs">{h.by}</td>
                  <td className="px-3 py-2">
                    <Badge variant={h.status === 'Approved' ? 'success' : h.status === 'Rejected' ? 'danger' : 'warning'}>{h.status}</Badge>
                    {h.status === 'Pending' && <Button size="xs" variant="ghost" onClick={() => setHistory((p) => p.map((x) => x.id === h.id ? { ...x, status: 'Approved' } : x))}>Approve</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal isOpen={bulkOpen} onClose={() => setBulkOpen(false)} title="Bulk Status Update" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button><Button onClick={() => { write(current.map((s) => selected.includes(s.id) ? { ...s, status: bulkStatus } : s)); setBulkOpen(false); flash(`Applied ${bulkStatus} to ${selected.length} students.`); }}>Apply</Button></div>}>
        <p className="mb-2 text-sm text-gray-600">{selected.length} students selected.</p>
        <Select label="Status" value={bulkStatus} onChange={(e) => setBulkStatus((typeof e === 'string' ? e : e.target.value) as Status)} options={STATUS_BTN.map((s) => ({ value: s.id, label: s.label }))} />
      </Modal>
      <Modal isOpen={copyOpen} onClose={() => setCopyOpen(false)} title="Copy Previous Session" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setCopyOpen(false)}>Cancel</Button><Button onClick={() => { write(current.map((s, i) => ({ ...s, status: i % 7 === 0 ? 'absent' : 'present' }))); setCopyOpen(false); flash('Copied previous session. Verify before finalizing.'); }}>Copy into sheet</Button></div>}>
        <p className="text-sm text-gray-600">Copies yesterday’s Class {klass}-{section} marks into this sheet as an editable draft.</p>
      </Modal>
      <Modal isOpen={unmarkedOpen} onClose={() => setUnmarkedOpen(false)} title="Unmarked students" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setUnmarkedOpen(false)}>Close</Button><Button onClick={() => { write(current.map((s) => s.status === 'unmarked' ? { ...s, status: 'present' } : s)); setUnmarkedOpen(false); flash('Unmarked students set to Present.'); }}>Mark remaining Present</Button></div>}>
        {unmarked.length === 0 ? <p className="text-sm text-gray-500">All students are marked.</p> : <ul className="list-disc pl-5 text-sm">{unmarked.map((s) => <li key={s.id}>{s.rollNo} · {s.name}</li>)}</ul>}
      </Modal>
      <Modal isOpen={conflictOpen} onClose={() => setConflictOpen(false)} title="Review Conflicts" footer={<Button onClick={() => setConflictOpen(false)}>Close</Button>}>
        {conflicts.length === 0 && <p className="text-sm text-gray-500">No inconsistencies between whole-day and subject-wise attendance.</p>}
        {conflicts.map((s) => <p key={s.id} className="flex items-center gap-2 text-sm"><AlertCircle className="h-4 w-4 text-amber-600" />{s.name} — whole-day vs {currentSubject?.name}</p>)}
      </Modal>
      <Modal isOpen={finalizeOpen} onClose={() => setFinalizeOpen(false)} title="Finalize Attendance" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setFinalizeOpen(false)}>Cancel</Button><Button onClick={() => { if (unmarked.length) { flash(`${unmarked.length} unmarked. Mark all before finalizing.`); setFinalizeOpen(false); return; } setFinalizeOpen(false); flash('Attendance finalized as the official daily record.'); }}>Finalize</Button></div>}>
        <p className="text-sm text-gray-600">Submits this session as the official daily record for Class {klass}-{section}.</p>
      </Modal>
      <Modal isOpen={Boolean(remarkFor)} onClose={() => setRemarkFor(null)} title={`Remarks · ${remarkFor?.name || ''}`} footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRemarkFor(null)}>Cancel</Button><Button onClick={() => { if (remarkFor) write(current.map((s) => s.id === remarkFor.id ? { ...s, remarks: remark } : s)); setRemarkFor(null); }}>Save</Button></div>}>
        <Textarea rows={4} value={remark} onChange={(e) => setRemark(e.target.value)} label="Remarks / leave details" />
      </Modal>
    </div>
  );
}

export default QuickPresentEntry;
