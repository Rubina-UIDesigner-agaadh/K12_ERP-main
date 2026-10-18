import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  Filter,
  LayoutGrid,
  Paperclip,
  Plus,
  Search,
  Table2,
  X
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';

type DiaryEntry = {
  id: string;
  date: string;
  className: string;
  section: string;
  subject: string;
  period: string;
  topicCovered: string;
  homeworkAssigned: string;
  classRemarks: string;
  studentRemarks: string;
  attachmentName: string;
  teacher: string;
  followUpPending: boolean;
  sendTo: 'class' | 'students';
  studentIds: string[];
};

type Student = { id: string; name: string; className: string; section: string };

const STORAGE_KEY = 'k12-school-diary-v2';
const CLASSES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];
const SECTIONS = ['A', 'B', 'C', 'D'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science', 'Physical Education'];
const TEACHERS = ['Mr. R. Kumar', 'Mrs. S. Joshi', 'Mrs. Singh', 'Ms. Roy', 'Mr. V. Patel'];
const PERIODS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const STUDENTS: Student[] = [
  { id: 'STU-1001', name: 'Aarav Sharma', className: 'Class 10', section: 'A' },
  { id: 'STU-1002', name: 'Priya Singh', className: 'Class 10', section: 'A' },
  { id: 'STU-1003', name: 'Rohan Mehta', className: 'Class 10', section: 'A' },
  { id: 'STU-1004', name: 'Ananya Iyer', className: 'Class 10', section: 'A' },
  { id: 'STU-1005', name: 'Vikram Reddy', className: 'Class 10', section: 'A' },
  { id: 'STU-1101', name: 'Sneha Patel', className: 'Class 10', section: 'B' },
  { id: 'STU-1102', name: 'Amit Kumar', className: 'Class 10', section: 'B' },
  { id: 'STU-1103', name: 'Diya Shah', className: 'Class 10', section: 'B' },
  { id: 'STU-0901', name: 'Kabir Joshi', className: 'Class 9', section: 'A' },
  { id: 'STU-0902', name: 'Meera Nair', className: 'Class 9', section: 'A' }
];

const todayIso = () => new Date().toISOString().slice(0, 10);
const formatDisplay = (iso: string) => {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const studentName = (id: string) => STUDENTS.find((student) => student.id === id)?.name || id;

const blankEntry = (): DiaryEntry => ({
  id: `SD-${Date.now()}`,
  date: todayIso(),
  className: 'Class 10',
  section: 'A',
  subject: 'Science',
  period: '3',
  topicCovered: '',
  homeworkAssigned: '',
  classRemarks: '',
  studentRemarks: '',
  attachmentName: '',
  teacher: 'Mr. R. Kumar',
  followUpPending: false,
  sendTo: 'class',
  studentIds: []
});

const SEED: DiaryEntry[] = [
  { id: 'SD-001', date: '2026-10-17', className: 'Class 10', section: 'A', subject: 'Science', period: '3', topicCovered: 'Refraction through a glass slab', homeworkAssigned: 'NCERT Ex. 10.3 Q1–Q4', classRemarks: 'Most students completed the ray diagram. Need more practice on numericals.', studentRemarks: 'Aarav Sharma — follow up on sign convention.', attachmentName: 'glass-slab-worksheet.pdf', teacher: 'Mr. R. Kumar', followUpPending: true, sendTo: 'students', studentIds: ['STU-1001', 'STU-1002'] },
  { id: 'SD-002', date: '2026-10-17', className: 'Class 10', section: 'A', subject: 'Mathematics', period: '1', topicCovered: 'Zeros of polynomials', homeworkAssigned: 'Practice worksheet 4', classRemarks: 'Graph work completed in pairs.', studentRemarks: '', attachmentName: '', teacher: 'Mrs. Singh', followUpPending: false, sendTo: 'class', studentIds: [] },
  { id: 'SD-003', date: '2026-10-16', className: 'Class 10', section: 'B', subject: 'English', period: '2', topicCovered: 'Formal letter writing', homeworkAssigned: 'Write a letter to the editor on road safety', classRemarks: 'Sentence structure improved after the model letter.', studentRemarks: 'Priya Singh — extra support on formal tone.', attachmentName: 'letter-model.docx', teacher: 'Ms. Roy', followUpPending: true, sendTo: 'students', studentIds: ['STU-1101', 'STU-1102'] },
  { id: 'SD-004', date: '2026-10-16', className: 'Class 9', section: 'A', subject: 'Science', period: '4', topicCovered: 'Atoms and molecules recap', homeworkAssigned: '', classRemarks: 'Oral recap only. Lab postponed.', studentRemarks: '', attachmentName: '', teacher: 'Mrs. S. Joshi', followUpPending: false, sendTo: 'class', studentIds: [] },
  { id: 'SD-005', date: '2026-10-15', className: 'Class 10', section: 'A', subject: 'Science', period: '3', topicCovered: 'Laws of reflection', homeworkAssigned: 'Draw 3 ray diagrams', classRemarks: 'Demonstration with plane mirror worked well.', studentRemarks: '', attachmentName: '', teacher: 'Mr. R. Kumar', followUpPending: false, sendTo: 'class', studentIds: [] }
];

const loadEntries = (): DiaryEntry[] => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return SEED;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
};

export function SchoolDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => loadEntries());
  const [headerDate, setHeaderDate] = useState(todayIso());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DiaryEntry>(blankEntry());
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [teacherFilter, setTeacherFilter] = useState('All Teachers');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<DiaryEntry | null>(null);
  const [notice, setNotice] = useState('');
  const [studentQuery, setStudentQuery] = useState('');

  const persist = (next: DiaryEntry[]) => {
    setEntries(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const classStudents = useMemo(() => STUDENTS.filter((student) =>
    student.className === form.className && student.section === form.section &&
    (!studentQuery || `${student.name} ${student.id}`.toLowerCase().includes(studentQuery.toLowerCase()))
  ), [form.className, form.section, studentQuery]);

  const filtered = useMemo(() => entries.filter((entry) => {
    if (fromDate && entry.date < fromDate) return false;
    if (toDate && entry.date > toDate) return false;
    if (classFilter !== 'All Classes' && entry.className !== classFilter) return false;
    if (subjectFilter !== 'All Subjects' && entry.subject !== subjectFilter) return false;
    if (teacherFilter !== 'All Teachers' && entry.teacher !== teacherFilter) return false;
    if (search && !`${entry.topicCovered} ${entry.homeworkAssigned} ${entry.classRemarks} ${entry.studentRemarks} ${entry.teacher} ${entry.studentIds.map(studentName).join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || Number(a.period) - Number(b.period)), [entries, fromDate, toDate, classFilter, subjectFilter, teacherFilter, search]);

  const openNew = () => {
    setForm({ ...blankEntry(), date: headerDate });
    setStudentQuery('');
    setShowForm(true);
  };

  const toggleStudent = (id: string) => {
    setForm((current) => ({
      ...current,
      studentIds: current.studentIds.includes(id) ? current.studentIds.filter((item) => item !== id) : [...current.studentIds, id]
    }));
  };

  const saveEntry = () => {
    if (!form.date || !form.className || !form.subject || !form.topicCovered.trim()) {
      setNotice('Date, class, subject and topic covered are required.');
      return;
    }
    if (form.sendTo === 'students' && form.studentIds.length === 0) {
      setNotice('Select at least one student, or send to the whole class.');
      return;
    }
    const exists = entries.some((entry) => entry.id === form.id);
    persist(exists ? entries.map((entry) => entry.id === form.id ? form : entry) : [form, ...entries]);
    setShowForm(false);
    setNotice(form.sendTo === 'students' ? `Diary entry saved and sent to ${form.studentIds.length} student(s).` : 'Diary entry saved for the class.');
    window.setTimeout(() => setNotice(''), 3000);
  };

  const toggleFollowUp = (id: string) => {
    persist(entries.map((entry) => entry.id === id ? { ...entry, followUpPending: !entry.followUpPending } : entry));
  };

  const recipientLabel = (entry: DiaryEntry) => {
    if (entry.sendTo === 'students' && entry.studentIds.length) return entry.studentIds.map(studentName).join(', ');
    return `Whole class · ${entry.className} ${entry.section}`;
  };

  return (
    <div className="space-y-5 p-4 md:p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Diary</h1>
          <p className="text-sm text-slate-500">Record daily classroom activities, homework, remarks, and observations</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <input type="date" value={headerDate} onChange={(event) => setHeaderDate(event.target.value)} className="bg-transparent focus:outline-none" />
          </label>
          <Button onClick={openNew}><Plus className="h-4 w-4" />Add New Entry</Button>
        </div>
      </div>

      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{notice}</div>}

      <Card>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700"><Filter className="h-4 w-4" /> Filters</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="block text-sm"><span className="mb-1 block text-xs text-gray-500">From</span><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
          <label className="block text-sm"><span className="mb-1 block text-xs text-gray-500">To</span><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
          <label className="block text-sm"><span className="mb-1 block text-xs text-gray-500">Class</span><select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option>All Classes</option>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="block text-sm"><span className="mb-1 block text-xs text-gray-500">Subject</span><select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option>All Subjects</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-sm"><span className="mb-1 block text-xs text-gray-500">Teacher</span><select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option>All Teachers</option>{TEACHERS.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-sm"><span className="mb-1 block text-xs text-gray-500">Search</span><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Topic, homework, student" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" /></div></label>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}</p>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <button type="button" onClick={() => setViewMode('table')} className={`rounded-md px-3 py-1.5 text-sm ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}><Table2 className="mr-1 inline h-4 w-4" />Table</button>
          <button type="button" onClick={() => setViewMode('card')} className={`rounded-md px-3 py-1.5 text-sm ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}><LayoutGrid className="mr-1 inline h-4 w-4" />Cards</button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Class</th>
                  <th className="px-3 py-3">Subject / Period</th>
                  <th className="px-3 py-3">Topic Covered</th>
                  <th className="px-3 py-3">Sent to</th>
                  <th className="px-3 py-3">Teacher</th>
                  <th className="px-3 py-3">Follow-up</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="bg-white">
                    <td className="px-3 py-3 whitespace-nowrap">{formatDisplay(entry.date)}</td>
                    <td className="px-3 py-3">{entry.className} {entry.section}</td>
                    <td className="px-3 py-3">{entry.subject}<p className="text-[10px] text-slate-400">Period {entry.period}</p></td>
                    <td className="px-3 py-3">{entry.topicCovered}</td>
                    <td className="px-3 py-3 text-xs">{recipientLabel(entry)}</td>
                    <td className="px-3 py-3">{entry.teacher}</td>
                    <td className="px-3 py-3">{entry.followUpPending ? <Badge variant="warning">Pending</Badge> : <Badge variant="success">Done</Badge>}</td>
                    <td className="px-3 py-3"><Button size="xs" variant="outline" onClick={() => setViewing(entry)}><Eye className="h-3.5 w-3.5" />View</Button></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">No diary entries match the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((entry) => (
            <button key={entry.id} type="button" onClick={() => setViewing(entry)} className="rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-indigo-300">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{entry.topicCovered}</p>
                {entry.followUpPending ? <Badge variant="warning">Follow-up</Badge> : null}
              </div>
              <p className="mt-1 text-xs text-slate-500">{formatDisplay(entry.date)} · {entry.className} {entry.section} · P{entry.period} · {entry.subject}</p>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{recipientLabel(entry)}</p>
              <p className="mt-2 text-[11px] text-slate-400">{entry.teacher}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No diary entries match the selected filters.</p>}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={form.id.startsWith('SD-') && entries.some((entry) => entry.id === form.id) ? 'Edit diary entry' : 'Add new diary entry'}
        size="xl"
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={saveEntry}>Save Entry</Button>
          </div>
        )}
      >
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-gray-600">Date</span><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
            <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-gray-600">Class</span><select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value, studentIds: [] })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-gray-600">Section</span><select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value, studentIds: [] })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">{SECTIONS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-gray-600">Subject</span><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-gray-600">Period</span><select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">{PERIODS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-gray-600">Teacher</span><select value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">{TEACHERS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="block text-sm md:col-span-3"><span className="mb-1 block text-xs font-medium text-gray-600">Topic Covered</span><input value={form.topicCovered} onChange={(e) => setForm({ ...form, topicCovered: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="What was taught this period?" /></label>
            <label className="block text-sm md:col-span-3"><span className="mb-1 block text-xs font-medium text-gray-600">Homework Assigned</span><textarea value={form.homeworkAssigned} onChange={(e) => setForm({ ...form, homeworkAssigned: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Leave blank if no homework" /></label>
            <label className="block text-sm md:col-span-3"><span className="mb-1 block text-xs font-medium text-gray-600">Class Remarks</span><textarea value={form.classRemarks} onChange={(e) => setForm({ ...form, classRemarks: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
            <label className="block text-sm md:col-span-3"><span className="mb-1 block text-xs font-medium text-gray-600">Student-specific Remarks (optional)</span><textarea value={form.studentRemarks} onChange={(e) => setForm({ ...form, studentRemarks: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Name the student and the observation" /></label>
            <label className="block text-sm md:col-span-2"><span className="mb-1 block text-xs font-medium text-gray-600">Attachments</span><input type="file" onChange={(e) => setForm({ ...form, attachmentName: e.target.files?.[0]?.name || '' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.followUpPending} onChange={(e) => setForm({ ...form, followUpPending: e.target.checked })} />Needs follow-up</label>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <p className="text-sm font-semibold text-slate-900">Send diary entry to</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => setForm({ ...form, sendTo: 'class', studentIds: [] })} className={`rounded-lg px-3 py-1.5 text-sm ${form.sendTo === 'class' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>Whole class</button>
              <button type="button" onClick={() => setForm({ ...form, sendTo: 'students' })} className={`rounded-lg px-3 py-1.5 text-sm ${form.sendTo === 'students' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>Selected students</button>
            </div>
            {form.sendTo === 'students' && (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} placeholder="Search students in this class" className="min-w-[220px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <Button size="xs" variant="outline" onClick={() => setForm({ ...form, studentIds: classStudents.map((student) => student.id) })}>Select all shown</Button>
                  <Button size="xs" variant="ghost" onClick={() => setForm({ ...form, studentIds: [] })}>Clear</Button>
                </div>
                <p className="text-xs text-slate-500">{form.studentIds.length} student(s) selected from {form.className} {form.section}.</p>
                <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2">
                  {classStudents.map((student) => (
                    <label key={student.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50">
                      <input type="checkbox" checked={form.studentIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />
                      <span className="font-medium text-slate-800">{student.name}</span>
                      <span className="text-xs text-slate-400">{student.id}</span>
                    </label>
                  ))}
                  {classStudents.length === 0 && <p className="px-2 py-3 text-xs text-slate-500">No students match this class / search.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.topicCovered || 'Diary entry'}
        size="lg"
        footer={(
          <div className="flex justify-end gap-2">
            {viewing && <Button variant="outline" onClick={() => { setForm(viewing); setShowForm(true); setViewing(null); }}>Edit</Button>}
            {viewing && (
              <Button variant={viewing.followUpPending ? 'outline' : 'primary'} onClick={() => { toggleFollowUp(viewing.id); setViewing({ ...viewing, followUpPending: !viewing.followUpPending }); }}>
                <CheckCircle2 className="h-4 w-4" />{viewing.followUpPending ? 'Mark follow-up done' : 'Needs follow-up'}
              </Button>
            )}
            <Button onClick={() => setViewing(null)}>Close</Button>
          </div>
        )}
      >
        {viewing && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-slate-500">Date</dt><dd>{formatDisplay(viewing.date)}</dd></div>
            <div><dt className="text-xs text-slate-500">Class / Period</dt><dd>{viewing.className} {viewing.section} · Period {viewing.period} · {viewing.subject}</dd></div>
            <div><dt className="text-xs text-slate-500">Teacher</dt><dd>{viewing.teacher}</dd></div>
            <div><dt className="text-xs text-slate-500">Sent to</dt><dd>{recipientLabel(viewing)}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Homework assigned</dt><dd>{viewing.homeworkAssigned || 'None'}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Class remarks</dt><dd>{viewing.classRemarks || '—'}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Student-specific remarks</dt><dd>{viewing.studentRemarks || '—'}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Attachment</dt><dd className="flex items-center gap-1">{viewing.attachmentName ? <><Paperclip className="h-3.5 w-3.5" />{viewing.attachmentName}</> : 'None'}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  );
}

export default SchoolDiary;
