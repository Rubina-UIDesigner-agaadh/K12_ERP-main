import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  DownloadIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
  PaperclipIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  FileTextIcon,
  BellIcon,
  ChevronRightIcon,
  XIcon,
  BookmarkIcon,
  ClipboardListIcon,
  FilterIcon,
  RotateCcwIcon } from
'lucide-react';

interface WorkItem {
  id: number;
  title: string;
  subject: string;
  class: string;
  section: string;
  dueDate: string;
  assignedDate: string;
  teacher: string;
  status: 'Assigned' | 'Submitted' | 'Evaluated';
  totalStudents: number;
  submitted: number;
  evaluated: number;
  hasAttachment: boolean;
  description: string;
}

interface Submission {
  id: number;
  student: string;
  rollNo: string;
  submittedOn: string;
  status: 'Evaluated' | 'Submitted' | 'Not Submitted';
  marks: string;
  remarks: string;
  lateSubmission: boolean;
}

const assignmentsData: WorkItem[] = [
{
  id: 1,
  title: 'Science Project — Solar System Model',
  subject: 'Science',
  class: 'Class 5',
  section: 'A',
  dueDate: '05 Mar 2026',
  assignedDate: '20 Feb 2026',
  teacher: 'Ms. Anita Verma',
  status: 'Assigned',
  totalStudents: 32,
  submitted: 0,
  evaluated: 0,
  hasAttachment: true,
  description: 'Build a 3D model of the solar system with labeled planets.'
},
{
  id: 2,
  title: 'History Essay — Freedom Struggle',
  subject: 'Social Studies',
  class: 'Class 7',
  section: 'B',
  dueDate: '28 Feb 2026',
  assignedDate: '21 Feb 2026',
  teacher: 'Mr. Suresh Kumar',
  status: 'Submitted',
  totalStudents: 30,
  submitted: 27,
  evaluated: 0,
  hasAttachment: false,
  description:
  "Write a 500-word essay on the role of non-violence in India's freedom struggle."
},
{
  id: 3,
  title: 'Maths Problem Set — Algebra',
  subject: 'Mathematics',
  class: 'Class 8',
  section: 'A',
  dueDate: '24 Feb 2026',
  assignedDate: '22 Feb 2026',
  teacher: 'Mr. Rajesh Patel',
  status: 'Evaluated',
  totalStudents: 31,
  submitted: 31,
  evaluated: 29,
  hasAttachment: true,
  description: 'Solve all 25 problems from Chapter 6 — Linear Equations.'
},
{
  id: 4,
  title: 'English Creative Writing — Short Story',
  subject: 'English',
  class: 'Class 6',
  section: 'A',
  dueDate: '01 Mar 2026',
  assignedDate: '25 Feb 2026',
  teacher: 'Ms. Priya Sharma',
  status: 'Assigned',
  totalStudents: 28,
  submitted: 0,
  evaluated: 0,
  hasAttachment: false,
  description:
  'Write a short story of 300 words on the theme "A Rainy Day Adventure".'
}];

const homeworkData: WorkItem[] = [
{
  id: 5,
  title: 'Addition & Subtraction Worksheet',
  subject: 'Mathematics',
  class: 'Class 2',
  section: 'A',
  dueDate: '27 Feb 2026',
  assignedDate: '25 Feb 2026',
  teacher: 'Mr. Rajesh Patel',
  status: 'Assigned',
  totalStudents: 32,
  submitted: 0,
  evaluated: 0,
  hasAttachment: true,
  description: 'Complete exercises 1–20 from the worksheet provided.'
},
{
  id: 6,
  title: 'Write 10 sentences using new vocabulary',
  subject: 'English',
  class: 'Class 3',
  section: 'B',
  dueDate: '26 Feb 2026',
  assignedDate: '24 Feb 2026',
  teacher: 'Ms. Priya Sharma',
  status: 'Submitted',
  totalStudents: 30,
  submitted: 28,
  evaluated: 0,
  hasAttachment: false,
  description: 'Use the 10 vocabulary words from Chapter 4 in sentences.'
},
{
  id: 7,
  title: 'Draw and label parts of a plant',
  subject: 'Science',
  class: 'Class 3',
  section: 'A',
  dueDate: '24 Feb 2026',
  assignedDate: '22 Feb 2026',
  teacher: 'Ms. Anita Verma',
  status: 'Evaluated',
  totalStudents: 31,
  submitted: 31,
  evaluated: 29,
  hasAttachment: true,
  description:
  'Draw a plant and label its root, stem, leaves, flower and fruit.'
},
{
  id: 8,
  title: 'Hindi paragraph writing — My School',
  subject: 'Hindi',
  class: 'Class 2',
  section: 'B',
  dueDate: '25 Feb 2026',
  assignedDate: '23 Feb 2026',
  teacher: 'Ms. Kavita Nair',
  status: 'Submitted',
  totalStudents: 30,
  submitted: 25,
  evaluated: 0,
  hasAttachment: false,
  description:
  'Write a paragraph of 5–7 sentences about your school in Hindi.'
}];

const submissionData: Submission[] = [
{
  id: 1,
  student: 'Aarav Sharma',
  rollNo: '01',
  submittedOn: '25 Feb 2026, 18:30',
  status: 'Evaluated',
  marks: '9/10',
  remarks: 'Excellent work',
  lateSubmission: false
},
{
  id: 2,
  student: 'Priya Patel',
  rollNo: '02',
  submittedOn: '25 Feb 2026, 20:15',
  status: 'Evaluated',
  marks: '7/10',
  remarks: 'Good effort',
  lateSubmission: false
},
{
  id: 3,
  student: 'Rohan Mehta',
  rollNo: '03',
  submittedOn: '26 Feb 2026, 08:00',
  status: 'Submitted',
  marks: '—',
  remarks: '',
  lateSubmission: true
},
{
  id: 4,
  student: 'Sneha Joshi',
  rollNo: '04',
  submittedOn: '25 Feb 2026, 17:45',
  status: 'Evaluated',
  marks: '10/10',
  remarks: 'Perfect!',
  lateSubmission: false
},
{
  id: 5,
  student: 'Karan Verma',
  rollNo: '05',
  submittedOn: '—',
  status: 'Not Submitted',
  marks: '—',
  remarks: '',
  lateSubmission: false
}];

const auditData = [
{
  id: 1,
  action: 'Created',
  user: 'Ms. Anita Verma',
  dateTime: '22 Feb 2026, 09:00',
  details: 'Draw and label parts of a plant — Class 3-A'
},
{
  id: 2,
  action: 'Attachment Uploaded',
  user: 'Ms. Anita Verma',
  dateTime: '22 Feb 2026, 09:05',
  details: 'plant_worksheet.pdf attached'
},
{
  id: 3,
  action: 'Submission Received',
  user: 'System',
  dateTime: '25 Feb 2026, 16:30',
  details: 'Ananya Singh submitted'
},
{
  id: 4,
  action: 'Evaluation Done',
  user: 'Ms. Anita Verma',
  dateTime: '25 Feb 2026, 22:00',
  details: '29 students evaluated, avg marks 8.6/10'
}];

function parseDisplayDate(str: string): Date | null {
  if (!str || str === '—') return null;
  try {
    const d = new Date(str.replace(/,/g, ''));
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function CenterPanel({
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 'max-w-md',
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/40 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside className={`relative flex max-h-[92vh] w-full ${width} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100" aria-label="Close">
            <XIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4">{footer}</div>}
      </aside>
    </div>
  );
}

interface ActionsPanelProps {
  item: WorkItem;
  onClose: () => void;
  onEdit: () => void;
  onTrack: () => void;
  onRemind: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

function ActionsPanel({ item, onClose, onEdit, onTrack, onRemind, onDownload, onDelete }: ActionsPanelProps) {
  return (
    <CenterPanel title="Actions" subtitle={item.title} onClose={onClose} width="max-w-md">
      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="mb-1 text-xs text-gray-500">Status</p>
        <Badge variant={item.status === 'Evaluated' ? 'success' : item.status === 'Submitted' ? 'primary' : 'warning'}>
          {item.status}
        </Badge>
        <div className="mt-2 flex gap-3 text-xs text-gray-600">
          <span>{item.submitted}/{item.totalStudents} submitted</span>
          <span>{item.evaluated} evaluated</span>
        </div>
      </div>
      <div className="space-y-2">
        <button type="button" onClick={onEdit} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-blue-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100"><EditIcon className="h-4 w-4 text-blue-600" /></div>
          <div><p className="text-sm font-medium text-gray-800">Edit</p><p className="text-xs text-gray-500">Modify details or due date</p></div>
          <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
        </button>
        <button type="button" onClick={onTrack} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-green-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100"><FileTextIcon className="h-4 w-4 text-green-600" /></div>
          <div><p className="text-sm font-medium text-gray-800">Track Submissions</p><p className="text-xs text-gray-500">View student submission status</p></div>
          <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
        </button>
        <button type="button" onClick={onRemind} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-yellow-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100"><BellIcon className="h-4 w-4 text-yellow-600" /></div>
          <div><p className="text-sm font-medium text-gray-800">Send Reminder</p><p className="text-xs text-gray-500">Notify pending students</p></div>
          <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
        </button>
        <button type="button" onClick={onDownload} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-indigo-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100"><DownloadIcon className="h-4 w-4 text-indigo-600" /></div>
          <div><p className="text-sm font-medium text-gray-800">Download</p><p className="text-xs text-gray-500">Export submission report</p></div>
          <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
        </button>
        <button type="button" onClick={onDelete} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-red-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100"><Trash2Icon className="h-4 w-4 text-red-600" /></div>
          <div><p className="text-sm font-medium text-red-700">Delete</p><p className="text-xs text-gray-500">Permanently remove this item</p></div>
          <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400" />
        </button>
      </div>
    </CenterPanel>
  );
}

interface SectionPanelProps {
  type: 'assignment' | 'homework';
  data: WorkItem[];
  label: string;
}

function SectionPanel({ type, data, label }: SectionPanelProps) {
  const [items, setItems] = useState<WorkItem[]>(data);
  const [submissions, setSubmissions] = useState<Submission[]>(submissionData);
  const [innerTab, setInnerTab] = useState('list');
  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formClass, setFormClass] = useState('');
  const [formSection, setFormSection] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDue, setFormDue] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [notice, setNotice] = useState('');
  const [evaluateRow, setEvaluateRow] = useState<Submission | null>(null);
  const [evalMarks, setEvalMarks] = useState('');
  const [evalRemarks, setEvalRemarks] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterDueFrom, setFilterDueFrom] = useState('');
  const [filterDueTo, setFilterDueTo] = useState('');
  const [subSearchStudent, setSubSearchStudent] = useState('');
  const [subSearchRollNo, setSubSearchRollNo] = useState('');
  const [subFilterStatus, setSubFilterStatus] = useState('');
  const [subFilterLate, setSubFilterLate] = useState('');
  const [subDateFrom, setSubDateFrom] = useState('');
  const [subDateTo, setSubDateTo] = useState('');
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [actionsPanelItem, setActionsPanelItem] = useState<WorkItem | null>(
    null
  );

  const filtered = useMemo(() => {
    return items.filter((h) => {
      if (
        searchTitle &&
        !h.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
      return false;
      if (filterClass && !h.class.toLowerCase().includes(filterClass))
      return false;
      if (filterSection && h.section !== filterSection) return false;
      if (filterSubject && h.subject !== filterSubject) return false;
      if (filterStatus && h.status !== filterStatus) return false;
      if (
        filterTeacher &&
        !h.teacher.toLowerCase().includes(filterTeacher.toLowerCase())
      )
      return false;
      const due = parseDisplayDate(h.dueDate);
      if (filterDueFrom) {
        const from = new Date(filterDueFrom);
        if (!due || due < from) return false;
      }
      if (filterDueTo) {
        const to = new Date(filterDueTo);
        to.setHours(23, 59, 59, 999);
        if (!due || due > to) return false;
      }
      return true;
    });
  }, [
    items,
    searchTitle,
    filterClass,
    filterSection,
    filterSubject,
    filterStatus,
    filterTeacher,
    filterDueFrom,
    filterDueTo
  ]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (
        subSearchStudent &&
        !s.student.toLowerCase().includes(subSearchStudent.toLowerCase())
      )
      return false;
      if (
        subSearchRollNo &&
        !s.rollNo.toLowerCase().includes(subSearchRollNo.toLowerCase())
      )
      return false;
      if (subFilterStatus && s.status !== subFilterStatus) return false;
      if (subFilterLate === 'yes' && !s.lateSubmission) return false;
      if (subFilterLate === 'no' && s.lateSubmission) return false;
      if (subDateFrom || subDateTo) {
        const submitted = parseDisplayDate(s.submittedOn);
        if (!submitted) return false;
        if (subDateFrom) {
          const from = new Date(subDateFrom);
          if (submitted < from) return false;
        }
        if (subDateTo) {
          const to = new Date(subDateTo);
          to.setHours(23, 59, 59, 999);
          if (submitted > to) return false;
        }
      }
      return true;
    });
  }, [
    submissions,
    subSearchStudent,
    subSearchRollNo,
    subFilterStatus,
    subFilterLate,
    subDateFrom,
    subDateTo
  ]);

  const resetListFilters = () => {
    setSearchTitle('');
    setFilterClass('');
    setFilterSection('');
    setFilterSubject('');
    setFilterStatus('');
    setFilterTeacher('');
    setFilterDueFrom('');
    setFilterDueTo('');
  };

  const resetSubmissionFilters = () => {
    setSubSearchStudent('');
    setSubSearchRollNo('');
    setSubFilterStatus('');
    setSubFilterLate('');
    setSubDateFrom('');
    setSubDateTo('');
  };

  const hasListFilters =
    searchTitle ||
    filterClass ||
    filterSection ||
    filterSubject ||
    filterStatus ||
    filterTeacher ||
    filterDueFrom ||
    filterDueTo;

  const hasSubFilters =
    subSearchStudent ||
    subSearchRollNo ||
    subFilterStatus ||
    subFilterLate ||
    subDateFrom ||
    subDateTo;

  const assignedCount = items.filter((h) => h.status === 'Assigned').length;
  const submittedCount = items.filter((h) => h.status === 'Submitted').length;
  const evaluatedCount = items.filter((h) => h.status === 'Evaluated').length;

  const openCreate = (item?: WorkItem) => {
    setEditingItem(item || null);
    setFormTitle(item?.title || '');
    setFormClass(item?.class || '');
    setFormSection(item?.section || '');
    setFormSubject(item?.subject || '');
    setFormDue('');
    setFormDesc(item?.description || '');
    setShowCreate(true);
    setActionsPanelItem(null);
  };

  const saveItem = () => {
    if (!formTitle.trim()) {
      setNotice(`Enter a ${label.toLowerCase()} title.`);
      return;
    }
    if (editingItem) {
      setItems((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, title: formTitle.trim(), class: formClass || item.class, section: formSection || item.section, subject: formSubject || item.subject, description: formDesc } : item)));
      setNotice(`${label} updated.`);
    } else {
      setItems((prev) => [{
        id: Date.now(),
        title: formTitle.trim(),
        subject: formSubject || 'General',
        class: formClass || 'Class 1',
        section: formSection || 'A',
        dueDate: formDue || '—',
        assignedDate: '26 Oct 2026',
        teacher: 'You',
        status: 'Assigned',
        totalStudents: 30,
        submitted: 0,
        evaluated: 0,
        hasAttachment: false,
        description: formDesc,
      }, ...prev]);
      setNotice(`${label} created.`);
    }
    setShowCreate(false);
    setEditingItem(null);
  };

  const openEvaluate = (row: Submission) => {
    setEvaluateRow(row);
    setEvalMarks(row.marks === '—' ? '' : row.marks.replace('/10', ''));
    setEvalRemarks(row.remarks);
  };

  const saveEvaluate = () => {
    if (!evaluateRow) return;
    const marks = evalMarks.trim() ? (evalMarks.includes('/') ? evalMarks : `${evalMarks}/10`) : '0/10';
    setSubmissions((prev) => prev.map((s) => (s.id === evaluateRow.id ? { ...s, status: 'Evaluated', marks, remarks: evalRemarks.trim() } : s)));
    setNotice(`Saved evaluation for ${evaluateRow.student}.`);
    setEvaluateRow(null);
  };

  return (
    <>
      {notice && (
        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{notice}</div>
      )}
      {actionsPanelItem && (
        <ActionsPanel
          item={actionsPanelItem}
          onClose={() => setActionsPanelItem(null)}
          onEdit={() => openCreate(actionsPanelItem)}
          onTrack={() => {
            setSelectedItem(actionsPanelItem);
            setInnerTab('submissions');
            setActionsPanelItem(null);
          }}
          onRemind={() => {
            setNotice(`Reminder sent to pending students for “${actionsPanelItem.title}”.`);
            setActionsPanelItem(null);
          }}
          onDownload={() => {
            const rows = [['Student', 'Roll', 'Submitted On', 'Status', 'Marks', 'Remarks'], ...submissions.map((s) => [s.student, s.rollNo, s.submittedOn, s.status, s.marks, s.remarks])];
            downloadText(`${actionsPanelItem.title.replace(/\s+/g, '-').toLowerCase()}-submissions.csv`, rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
            setNotice('Submission report downloaded.');
            setActionsPanelItem(null);
          }}
          onDelete={() => {
            setItems((prev) => prev.filter((item) => item.id !== actionsPanelItem.id));
            setNotice(`${label} deleted.`);
            setActionsPanelItem(null);
          }}
        />
      )}
      {evaluateRow && (
        <CenterPanel
          title={evaluateRow.status === 'Evaluated' ? 'Edit evaluation' : 'Evaluate submission'}
          subtitle={`${evaluateRow.student} · Roll ${evaluateRow.rollNo}`}
          onClose={() => setEvaluateRow(null)}
          width="max-w-lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setEvaluateRow(null)}>Cancel</Button>
              <Button variant="primary" onClick={saveEvaluate}>Save evaluation</Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Submitted: {evaluateRow.submittedOn}{evaluateRow.lateSubmission ? ' · Late' : ''}</p>
            <Input label="Marks" value={evalMarks} onChange={(e) => setEvalMarks(e.target.value)} placeholder="e.g. 8 or 8/10" />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={evalRemarks}
                onChange={(e) => setEvalRemarks(e.target.value)}
                placeholder="Feedback for the student"
              />
            </div>
          </div>
        </CenterPanel>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-center gap-3">
          <ClockIcon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-yellow-700">{assignedCount}</p>
            <p className="text-xs text-yellow-600">Assigned</p>
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3">
          <FileTextIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-indigo-700">
              {submittedCount}
            </p>
            <p className="text-xs text-indigo-600">Submitted</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-green-700">{evaluatedCount}</p>
            <p className="text-xs text-green-600">Evaluated</p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex justify-end">
        <Button variant="primary" size="sm" leftIcon={<EditIcon className="w-4 h-4" />} onClick={() => openCreate()}>
          Create / Edit {label}
        </Button>
      </div>

      <Card noPadding>
        <Tabs value={innerTab} onValueChange={setInnerTab}>
          <div className="px-5 pt-4">
            <TabsList>
              <TabsTrigger value="list">
                <BookOpenIcon className="w-3.5 h-3.5" /> List
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <FileTextIcon className="w-3.5 h-3.5" /> Submission Tracking
              </TabsTrigger>
              <TabsTrigger value="audit">
                <ClockIcon className="w-3.5 h-3.5" /> Audit Log
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="p-5">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Search & Filters
                  </span>
                </div>
                {hasListFilters &&
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<RotateCcwIcon className="w-3 h-3" />}
                  onClick={resetListFilters}>

                    Clear Filters
                  </Button>
                }
              </div>

              <div className="flex flex-wrap gap-3 items-end">
                <Input
                  label="Search Title"
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="w-56" />

                <Input
                  label="Teacher"
                  placeholder="Search teacher..."
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="w-48" />

                <Select
                  label="Class"
                  options={[
                  { value: '', label: 'All Classes' },
                  { value: 'class 2', label: 'Class 2' },
                  { value: 'class 3', label: 'Class 3' },
                  { value: 'class 4', label: 'Class 4' },
                  { value: 'class 5', label: 'Class 5' },
                  { value: 'class 6', label: 'Class 6' },
                  { value: 'class 7', label: 'Class 7' },
                  { value: 'class 8', label: 'Class 8' }]
                  }
                  value={filterClass}
                  onChange={setFilterClass}
                  className="w-36" />

                <Select
                  label="Section"
                  options={[
                  { value: '', label: 'All Sections' },
                  { value: 'A', label: 'Section A' },
                  { value: 'B', label: 'Section B' },
                  { value: 'C', label: 'Section C' }]
                  }
                  value={filterSection}
                  onChange={setFilterSection}
                  className="w-32" />

                <Select
                  label="Subject"
                  options={[
                  { value: '', label: 'All Subjects' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'English', label: 'English' },
                  { value: 'Science', label: 'Science' },
                  { value: 'Social Studies', label: 'Social Studies' },
                  { value: 'Hindi', label: 'Hindi' }]
                  }
                  value={filterSubject}
                  onChange={setFilterSubject}
                  className="w-40" />

                <Select
                  label="Status"
                  options={[
                  { value: '', label: 'All Status' },
                  { value: 'Assigned', label: 'Assigned' },
                  { value: 'Submitted', label: 'Submitted' },
                  { value: 'Evaluated', label: 'Evaluated' }]
                  }
                  value={filterStatus}
                  onChange={setFilterStatus}
                  className="w-36" />

                <Input
                  label="Due From"
                  type="date"
                  value={filterDueFrom}
                  onChange={(e) => setFilterDueFrom(e.target.value)}
                  className="w-40" />

                <Input
                  label="Due To"
                  type="date"
                  value={filterDueTo}
                  onChange={(e) => setFilterDueTo(e.target.value)}
                  className="w-40" />
              </div>
            </div>

            <Table
              columns={[
              {
                key: 'title',
                header: 'Title',
                render: (row) =>
                <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {row.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {row.description.slice(0, 55)}...
                      </p>
                    </div>

              },
              {
                key: 'class',
                header: 'Class / Subject',
                render: (row) =>
                <div>
                      <p className="text-sm font-medium text-gray-800">
                        {row.class}-{row.section}
                      </p>
                      <p className="text-xs text-gray-500">{row.subject}</p>
                    </div>

              },
              {
                key: 'teacher',
                header: 'Teacher',
                render: (row) =>
                <span className="text-sm text-gray-700">{row.teacher}</span>

              },
              {
                key: 'dueDate',
                header: 'Due Date',
                render: (row) =>
                <div>
                      <p className="text-sm text-gray-800">{row.dueDate}</p>
                      <p className="text-xs text-gray-400">
                        Assigned: {row.assignedDate}
                      </p>
                    </div>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Evaluated' ?
                  'success' :
                  row.status === 'Submitted' ?
                  'primary' :
                  'warning'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'submissions',
                header: 'Submissions',
                render: (row) =>
                <div className="text-sm">
                      <span className="font-medium text-gray-800">
                        {row.submitted}/{row.totalStudents}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{
                        width: `${Math.round(row.submitted / row.totalStudents * 100)}%`
                      }} />

                      </div>
                    </div>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setActionsPanelItem(row)}>

                      Actions
                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                    </Button>

              }]
              }
              data={filtered} />

            {filtered.length === 0 &&
            <div className="text-center py-10 text-sm text-gray-400">
                No {label.toLowerCase()} found matching the selected filters.
              </div>
            }

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Showing {filtered.length} of {items.length} {label.toLowerCase()}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          {showCreate && (
            <CenterPanel
              title={editingItem ? `Edit ${label}` : `Create ${label}`}
              subtitle={editingItem ? editingItem.title : `New ${label.toLowerCase()}`}
              onClose={() => { setShowCreate(false); setEditingItem(null); }}
              width="max-w-3xl"
              footer={
                <>
                  <Button variant="outline" onClick={() => { setShowCreate(false); setEditingItem(null); }}>Cancel</Button>
                  <Button variant="primary" onClick={saveItem}>{editingItem ? 'Update' : 'Create'} {label}</Button>
                </>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={`${label} Title`}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={`e.g. ${type === 'assignment' ? 'Science Project — Solar System' : 'Addition & Subtraction Worksheet'}`}
                  className="md:col-span-2"
                />
                <Select
                  label="Class"
                  options={[{ value: '', label: 'Select Class' }, ...Array.from({ length: 12 }, (_, i) => ({ value: `Class ${i + 1}`, label: `Class ${i + 1}` }))]}
                  value={formClass}
                  onChange={setFormClass}
                />
                <Select
                  label="Section"
                  options={[{ value: '', label: 'Select Section' }, { value: 'A', label: 'Section A' }, { value: 'B', label: 'Section B' }, { value: 'C', label: 'Section C' }]}
                  value={formSection}
                  onChange={setFormSection}
                />
                <Select
                  label="Subject"
                  options={[{ value: '', label: 'Select Subject' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'English', label: 'English' }, { value: 'Science', label: 'Science' }, { value: 'Social Studies', label: 'Social Studies' }, { value: 'Hindi', label: 'Hindi' }]}
                  value={formSubject}
                  onChange={setFormSubject}
                />
                <Input label="Due Date" type="date" value={formDue} onChange={(e) => setFormDue(e.target.value)} />
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description / Instructions</label>
                  <textarea
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe the task in detail..."
                  />
                </div>
              </div>
            </CenterPanel>
          )}

          <TabsContent value="submissions" className="p-5">
            {selectedItem &&
            <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {selectedItem.class}-{selectedItem.section} ·{' '}
                      {selectedItem.subject} · Due: {selectedItem.dueDate}
                    </p>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-blue-700">
                        {selectedItem.totalStudents}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-green-700">
                        {selectedItem.submitted}
                      </p>
                      <p className="text-xs text-gray-500">Submitted</p>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-purple-700">
                        {selectedItem.evaluated}
                      </p>
                      <p className="text-xs text-gray-500">Evaluated</p>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-lg font-bold text-red-700">
                        {selectedItem.totalStudents - selectedItem.submitted}
                      </p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            {!selectedItem &&
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                Select a {label.toLowerCase()} from the List tab to view its
                submissions.
              </div>
            }

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Search Submissions
                  </span>
                </div>
                {hasSubFilters &&
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<RotateCcwIcon className="w-3 h-3" />}
                  onClick={resetSubmissionFilters}>

                    Clear Filters
                  </Button>
                }
              </div>

              <div className="flex flex-wrap gap-3 items-end">
                <Input
                  label="Student Name"
                  placeholder="Search student..."
                  value={subSearchStudent}
                  onChange={(e) => setSubSearchStudent(e.target.value)}
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="w-52" />

                <Input
                  label="Roll No"
                  placeholder="e.g. 01"
                  value={subSearchRollNo}
                  onChange={(e) => setSubSearchRollNo(e.target.value)}
                  leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  className="w-32" />

                <Select
                  label="Status"
                  options={[
                  { value: '', label: 'All Status' },
                  { value: 'Submitted', label: 'Submitted' },
                  { value: 'Evaluated', label: 'Evaluated' },
                  { value: 'Not Submitted', label: 'Not Submitted' }]
                  }
                  value={subFilterStatus}
                  onChange={setSubFilterStatus}
                  className="w-40" />

                <Select
                  label="Late Submission"
                  options={[
                  { value: '', label: 'All' },
                  { value: 'yes', label: 'Late' },
                  { value: 'no', label: 'On Time' }]
                  }
                  value={subFilterLate}
                  onChange={setSubFilterLate}
                  className="w-36" />

                <Input
                  label="Submitted From"
                  type="date"
                  value={subDateFrom}
                  onChange={(e) => setSubDateFrom(e.target.value)}
                  className="w-40" />

                <Input
                  label="Submitted To"
                  type="date"
                  value={subDateTo}
                  onChange={(e) => setSubDateTo(e.target.value)}
                  className="w-40" />
              </div>
            </div>

            <Table
              columns={[
              {
                key: 'rollNo',
                header: 'Roll No'
              },
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.student}
                    </span>

              },
              {
                key: 'submittedOn',
                header: 'Submitted On',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.submittedOn}
                    </span>

              },
              {
                key: 'lateSubmission',
                header: 'Late',
                render: (row) =>
                row.lateSubmission ?
                <Badge variant="warning">
                        <AlertCircleIcon className="w-3 h-3 mr-1" />
                        Late
                      </Badge> :

                <span className="text-gray-400 text-xs">—</span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Evaluated' ?
                  'success' :
                  row.status === 'Submitted' ?
                  'primary' :
                  'danger'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'marks',
                header: 'Marks',
                render: (row) =>
                <span className="font-medium text-gray-800">
                      {row.marks}
                    </span>

              },
              {
                key: 'remarks',
                header: 'Remarks',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.remarks || '—'}
                    </span>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      {row.status === 'Submitted' &&
                  <Button variant="primary" size="xs" onClick={() => openEvaluate(row)}>
                          Evaluate
                        </Button>
                  }
                      {row.status === 'Evaluated' &&
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}
                    onClick={() => openEvaluate(row)}>

                          Edit
                        </Button>
                  }
                      {row.status === 'Not Submitted' &&
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setNotice(`Reminder sent to ${row.student}.`)}>
                          Remind
                        </Button>
                  }
                    </div>

              }]
              }
              data={filteredSubmissions} />

            {filteredSubmissions.length === 0 &&
            <div className="text-center py-10 text-sm text-gray-400">
                No submissions found matching the selected filters.
              </div>
            }

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Showing {filteredSubmissions.length} of {submissions.length}{' '}
                students
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={() => {
                  const rows = [['Student', 'Roll', 'Submitted On', 'Status', 'Marks', 'Remarks'], ...filteredSubmissions.map((s) => [s.student, s.rollNo, s.submittedOn, s.status, s.marks, s.remarks])];
                  downloadText(`${label.toLowerCase()}-submissions.csv`, rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'));
                  setNotice('Submission list exported.');
                }}>

                Export Submission List
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="p-5">
            <Table
              columns={[
              {
                key: 'action',
                header: 'Action',
                render: (row) =>
                <span className="font-medium text-gray-800">
                      {row.action}
                    </span>

              },
              {
                key: 'user',
                header: 'User'
              },
              {
                key: 'dateTime',
                header: 'Date & Time',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.dateTime}
                    </span>

              },
              {
                key: 'details',
                header: 'Details',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.details}</span>

              }]
              }
              data={auditData} />

          </TabsContent>
        </Tabs>
      </Card>
    </>);

}

export function HomeworkAssignments() {
  const [topTab, setTopTab] = useState('assignments');
  const totalAssignments = assignmentsData.length;
  const totalHomework = homeworkData.length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Homework & Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage assignments and homework separately — create, track
            submissions and evaluate
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<DownloadIcon className="w-4 h-4" />}>

          Export Submissions
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setTopTab('assignments')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${topTab === 'assignments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

            <ClipboardListIcon className="w-4 h-4" />
            Assignments
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${topTab === 'assignments' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

              {totalAssignments}
            </span>
          </button>
          <button
            onClick={() => setTopTab('homework')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${topTab === 'homework' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

            <BookmarkIcon className="w-4 h-4" />
            Homework
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${topTab === 'homework' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>

              {totalHomework}
            </span>
          </button>
        </div>
      </div>

      {topTab === 'assignments' &&
      <SectionPanel
        type="assignment"
        data={assignmentsData}
        label="Assignment" />

      }
      {topTab === 'homework' &&
      <SectionPanel type="homework" data={homeworkData} label="Homework" />
      }
    </div>);

}

export default HomeworkAssignments;
