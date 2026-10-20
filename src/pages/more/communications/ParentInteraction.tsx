import React, { useCallback, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Textarea } from '../../../components/ui/Textarea';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  PlusIcon, SearchIcon, CalendarIcon, FileTextIcon, StarIcon, XIcon, CheckCircleIcon, AlertCircleIcon,
  EyeIcon, EditIcon, TrashIcon, SendIcon, MessageSquareIcon, BellIcon, LinkIcon, FilterIcon,
  ChevronDownIcon, ChevronUpIcon, UsersIcon,
} from 'lucide-react';

function MultiSelectDropdown({
  label, options, selectedValues, onChange, placeholder, disabled,
}: {
  label?: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <MultiSelect label={label} options={options} value={selectedValues} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

interface ParentRegistration {
  id: string; parentName: string; studentName: string; studentRollNo: string; contactNumber: string;
  registeredAt: string; slotTime?: string; attended?: boolean; feedback?: string; branchId: string; batchId: string;
}
interface PTMSession {
  id: string; title: string; branchFilters: string[]; batchFilters: string[]; teacher: string; teacherContact: string;
  date: string; startTime: string; endTime: string; venue: string; description: string; agenda: string[];
  registeredParents: ParentRegistration[]; totalStudents: number; status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  cancelReason?: string; createdAt: string; createdBy: string; remindersSent: number; notes?: string;
}
interface ParentFeedback {
  id: string; parent: string; parentContact: string; parentEmail: string; student: string; studentClass: string;
  category: string; subcategory?: string; rating: number; title: string; feedback: string; suggestions?: string;
  date: string; status: 'Pending' | 'Reviewed' | 'Resolved' | 'Escalated'; reviewedBy?: string; reviewedAt?: string;
  response?: string; responseAt?: string; attachments: string[];
}
interface DiscussionPoint { id: string; topic: string; discussion: string; decision?: string }
interface ActionItem {
  id: string; item: string; responsible: string; deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue'; completedAt?: string; remarks?: string;
}
interface MeetingMinutes {
  id: string; title: string; type: 'PTM' | 'Advisory' | 'Committee' | 'General' | 'Emergency'; linkedPTMId?: string;
  date: string; startTime: string; endTime: string; venue: string; attendeesCount: number; attendeesList: string[];
  chairperson: string; secretary: string; minutes: string; discussionPoints: DiscussionPoint[]; actionItems: ActionItem[];
  nextMeetingDate?: string; attachments: string[]; status: 'Draft' | 'Finalized' | 'Distributed'; createdAt: string; createdBy: string;
}
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' }
interface Branch { value: string; label: string }
interface Batch { value: string; label: string; branchId: string }
interface Student { id: string; name: string; rollNo: string; parentName: string; parentContact: string; branchId: string; batchId: string }
interface MinutesFormData {
  title: string; type: MeetingMinutes['type']; linkedPTMId: string; date: string; startTime: string; endTime: string;
  venue: string; attendeesCount: string; chairperson: string; secretary: string; minutes: string; actionItems: string; nextMeetingDate: string;
}

const branchOptions: Branch[] = [
  { value: 'main_campus', label: 'Main Campus' }, { value: 'north_branch', label: 'North Branch' },
  { value: 'south_branch', label: 'South Branch' }, { value: 'east_branch', label: 'East Branch' },
];
const batchOptions: Batch[] = [
  { value: 'class_6a', label: 'Class 6-A', branchId: 'main_campus' }, { value: 'class_6b', label: 'Class 6-B', branchId: 'main_campus' },
  { value: 'class_7a', label: 'Class 7-A', branchId: 'main_campus' }, { value: 'class_8a', label: 'Class 8-A', branchId: 'main_campus' },
  { value: 'class_9a', label: 'Class 9-A', branchId: 'north_branch' }, { value: 'class_10a', label: 'Class 10-A', branchId: 'north_branch' },
  { value: 'class_11a', label: 'Class 11-A', branchId: 'south_branch' }, { value: 'class_12a', label: 'Class 12-A', branchId: 'south_branch' },
  { value: 'class_12b', label: 'Class 12-B', branchId: 'east_branch' },
];
const allStudents: Student[] = [
  { id: 'STU001', name: 'Arjun Patel', rollNo: '6A-01', parentName: 'Mr. Ramesh Patel', parentContact: '9876543210', branchId: 'main_campus', batchId: 'class_6a' },
  { id: 'STU002', name: 'Priya Verma', rollNo: '6A-02', parentName: 'Mrs. Sunita Verma', parentContact: '9765432109', branchId: 'main_campus', batchId: 'class_6a' },
  { id: 'STU003', name: 'Rahul Kumar', rollNo: '6A-03', parentName: 'Mr. Anil Kumar', parentContact: '9654321098', branchId: 'main_campus', batchId: 'class_6a' },
  { id: 'STU004', name: 'Karthik Nair', rollNo: '8A-01', parentName: 'Mr. Mohan Nair', parentContact: '9098765432', branchId: 'main_campus', batchId: 'class_8a' },
  { id: 'STU005', name: 'Diya Iyer', rollNo: '8A-02', parentName: 'Mrs. Sudha Iyer', parentContact: '9987654321', branchId: 'main_campus', batchId: 'class_8a' },
  { id: 'STU006', name: 'Aditya Rao', rollNo: '8A-03', parentName: 'Mr. Venkat Rao', parentContact: '9876543211', branchId: 'main_campus', batchId: 'class_8a' },
  { id: 'STU007', name: 'Sanya Kapoor', rollNo: '10A-01', parentName: 'Mr. Raj Kapoor', parentContact: '9432109877', branchId: 'north_branch', batchId: 'class_10a' },
  { id: 'STU008', name: 'Arnav Mishra', rollNo: '10A-02', parentName: 'Mrs. Neeta Mishra', parentContact: '9321098766', branchId: 'north_branch', batchId: 'class_10a' },
  { id: 'STU009', name: 'Ishaan Joshi', rollNo: '9A-01', parentName: 'Mr. Prakash Joshi', parentContact: '9765432110', branchId: 'north_branch', batchId: 'class_9a' },
  { id: 'STU010', name: 'Kavya Sharma', rollNo: '6B-02', parentName: 'Mrs. Kavita Sharma', parentContact: '9321098765', branchId: 'main_campus', batchId: 'class_6b' },
];
const feedbackCategories = [
  { value: 'teaching', label: 'Teaching Quality' }, { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'academics', label: 'Academics' }, { value: 'safety', label: 'Safety' },
  { value: 'administration', label: 'Administration' }, { value: 'other', label: 'Other' },
];
const initialPTMSessions: PTMSession[] = [
  {
    id: 'PTM-001', title: 'Mid-Term Progress Review', branchFilters: ['main_campus'], batchFilters: ['class_8a'],
    teacher: 'Mrs. Sharma', teacherContact: '9876543210', date: '2025-06-14', startTime: '10:00', endTime: '13:00',
    venue: 'Classroom 8A', description: 'Mid-term progress review for Class 8-A students',
    agenda: ['Academic performance review', 'Behavior assessment', 'Extra-curricular activities', 'Q&A session'],
    registeredParents: [
      { id: 'REG-001', parentName: 'Mr. Mohan Nair', studentName: 'Karthik Nair', studentRollNo: '8A-01', contactNumber: '9098765432', registeredAt: '2025-06-08 10:00', slotTime: '10:00-10:15', attended: false, branchId: 'main_campus', batchId: 'class_8a' },
      { id: 'REG-002', parentName: 'Mrs. Sudha Iyer', studentName: 'Diya Iyer', studentRollNo: '8A-02', contactNumber: '9987654321', registeredAt: '2025-06-08 11:30', slotTime: '10:15-10:30', attended: false, branchId: 'main_campus', batchId: 'class_8a' },
      { id: 'REG-003', parentName: 'Mr. Venkat Rao', studentName: 'Aditya Rao', studentRollNo: '8A-03', contactNumber: '9876543211', registeredAt: '2025-06-09 09:15', slotTime: '10:30-10:45', attended: false, branchId: 'main_campus', batchId: 'class_8a' },
    ],
    totalStudents: 3, status: 'Upcoming', createdAt: '2025-06-01 10:00', createdBy: 'Admin', remindersSent: 1,
  },
  {
    id: 'PTM-002', title: 'Board Exam Preparation Discussion', branchFilters: ['north_branch'], batchFilters: ['class_10a'],
    teacher: 'Mr. Verma', teacherContact: '9765432109', date: '2025-06-15', startTime: '14:00', endTime: '17:00',
    venue: 'Classroom 10A', description: 'Board exam preparation discussion for Class 10-A',
    agenda: ['Board exam preparation', 'Study schedule', 'Weak areas identification'],
    registeredParents: [
      { id: 'REG-004', parentName: 'Mr. Raj Kapoor', studentName: 'Sanya Kapoor', studentRollNo: '10A-01', contactNumber: '9432109877', registeredAt: '2025-06-09 14:00', slotTime: '14:00-14:15', attended: false, branchId: 'north_branch', batchId: 'class_10a' },
      { id: 'REG-005', parentName: 'Mrs. Neeta Mishra', studentName: 'Arnav Mishra', studentRollNo: '10A-02', contactNumber: '9321098766', registeredAt: '2025-06-10 10:00', slotTime: '14:15-14:30', attended: false, branchId: 'north_branch', batchId: 'class_10a' },
    ],
    totalStudents: 2, status: 'Upcoming', createdAt: '2025-06-02 11:00', createdBy: 'Academic Coordinator', remindersSent: 0,
  },
  {
    id: 'PTM-003', title: 'First Term Review', branchFilters: ['main_campus'], batchFilters: ['class_6a'],
    teacher: 'Mrs. Patel', teacherContact: '9654321098', date: '2025-06-08', startTime: '10:00', endTime: '13:00',
    venue: 'Classroom 6A', description: 'First term review for Class 6-A students',
    agenda: ['Term 1 performance', 'Adaptation to new class'],
    registeredParents: [
      { id: 'REG-006', parentName: 'Mr. Ramesh Patel', studentName: 'Arjun Patel', studentRollNo: '6A-01', contactNumber: '9876543210', registeredAt: '2025-06-01 09:00', slotTime: '10:00-10:15', attended: true, feedback: 'Very informative session', branchId: 'main_campus', batchId: 'class_6a' },
      { id: 'REG-007', parentName: 'Mrs. Sunita Verma', studentName: 'Priya Verma', studentRollNo: '6A-02', contactNumber: '9765432109', registeredAt: '2025-06-02 10:30', slotTime: '10:15-10:30', attended: true, branchId: 'main_campus', batchId: 'class_6a' },
    ],
    totalStudents: 4, status: 'Completed', createdAt: '2025-05-25 10:00', createdBy: 'Admin', remindersSent: 2, notes: 'Good participation.',
  },
];
const initialFeedbacks: ParentFeedback[] = [
  { id: 'FB-001', parent: 'Mr. Ramesh Patel', parentContact: '9876543210', parentEmail: 'ramesh.patel@email.com', student: 'Arjun Patel', studentClass: 'Class 6-A', category: 'Teaching Quality', subcategory: 'Subject Knowledge', rating: 4, title: 'Excellent Math Teaching', feedback: 'The mathematics teacher explains concepts very well.', suggestions: 'Please provide additional practice worksheets', date: '2025-06-08', status: 'Reviewed', reviewedBy: 'Academic Coordinator', reviewedAt: '2025-06-09 10:00', response: 'Thank you for your positive feedback.', responseAt: '2025-06-09 14:00', attachments: [] },
  { id: 'FB-002', parent: 'Mrs. Sunita Verma', parentContact: '9765432109', parentEmail: 'sunita.verma@email.com', student: 'Priya Verma', studentClass: 'Class 6-A', category: 'Infrastructure', subcategory: 'Classroom Facilities', rating: 3, title: 'Air Conditioning Issue', feedback: 'The classroom air conditioning is not working properly.', suggestions: 'Please repair the AC units', date: '2025-06-09', status: 'Pending', attachments: [] },
  { id: 'FB-003', parent: 'Mr. Prakash Joshi', parentContact: '9765432110', parentEmail: 'prakash.joshi@email.com', student: 'Ishaan Joshi', studentClass: 'Class 9-A', category: 'Academics', subcategory: 'Exam Preparation', rating: 5, title: 'Great Board Exam Preparation', feedback: "The school's board exam preparation program is excellent.", date: '2025-06-10', status: 'Reviewed', reviewedBy: 'Principal', reviewedAt: '2025-06-10 15:00', attachments: [] },
  { id: 'FB-004', parent: 'Mrs. Kavita Sharma', parentContact: '9321098765', parentEmail: 'kavita.sharma@email.com', student: 'Kavya Sharma', studentClass: 'Class 6-B', category: 'Safety', subcategory: 'Transport', rating: 2, title: 'Bus Safety Concern', feedback: 'The school bus has been overcrowded.', suggestions: 'Add another bus for route 5', date: '2025-06-10', status: 'Escalated', reviewedBy: 'Transport Manager', reviewedAt: '2025-06-10 16:00', attachments: [] },
];
const initialMeetingMinutes: MeetingMinutes[] = [
  {
    id: 'MM-001', title: 'PTM - Class 6-A (Main Campus)', type: 'PTM', linkedPTMId: 'PTM-003', date: '2025-06-08',
    startTime: '10:00', endTime: '13:00', venue: 'Classroom 6A', attendeesCount: 30, attendeesList: ['Mrs. Patel (Class Teacher)', '28 Parents'],
    chairperson: 'Mrs. Patel', secretary: 'Admin Staff', minutes: 'The PTM for Class 6-A was conducted successfully with 93% parent attendance.',
    discussionPoints: [{ id: 'DP-001', topic: 'Academic Performance', discussion: 'Overall class performance has improved by 15%', decision: 'Continue with current teaching methods' }],
    actionItems: [{ id: 'AI-001', item: 'Review homework guidelines', responsible: 'Mrs. Patel', deadline: '2025-06-15', status: 'In Progress' }],
    nextMeetingDate: '2025-09-15', attachments: ['attendance-sheet.pdf'], status: 'Finalized', createdAt: '2025-06-08 14:00', createdBy: 'Admin Staff',
  },
  {
    id: 'MM-002', title: 'Parent Advisory Committee Meeting', type: 'Advisory', date: '2025-05-20', startTime: '15:00', endTime: '17:00',
    venue: 'Conference Room', attendeesCount: 12, attendeesList: ['Principal', '8 Parent Representatives'], chairperson: 'Principal', secretary: 'Vice Principal',
    minutes: 'Quarterly meeting of the Parent Advisory Committee.',
    discussionPoints: [{ id: 'DP-004', topic: 'Annual Day Planning', discussion: 'Date finalized for Annual Day 2025', decision: 'Preparations by July 10' }],
    actionItems: [{ id: 'AI-004', item: 'Publish fee utilization report', responsible: 'Accounts Department', deadline: '2025-05-30', status: 'Completed', completedAt: '2025-05-28' }],
    nextMeetingDate: '2025-08-20', attachments: ['meeting-agenda.pdf'], status: 'Distributed', createdAt: '2025-05-20 18:00', createdBy: 'Vice Principal',
  },
];

const generateId = (prefix: string) => `${prefix}-${String(Date.now()).slice(-6)}`;
const getCurrentDateTime = () => new Date().toISOString();
const defaultMinutesForm: MinutesFormData = {
  title: '', type: 'PTM', linkedPTMId: '', date: '', startTime: '', endTime: '', venue: '', attendeesCount: '',
  chairperson: '', secretary: '', minutes: '', actionItems: '', nextMeetingDate: '',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Upcoming: 'bg-blue-100 text-blue-700', Ongoing: 'bg-purple-100 text-purple-700', Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700', Draft: 'bg-yellow-100 text-yellow-700', Reviewed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700', Resolved: 'bg-green-100 text-green-700', Escalated: 'bg-red-100 text-red-700',
    Finalized: 'bg-green-100 text-green-700', Distributed: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-orange-100 text-orange-700', Overdue: 'bg-red-100 text-red-700',
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
);
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative mx-4 max-h-[90vh] w-full overflow-auto rounded-xl bg-white shadow-xl ${sizes[size]}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-gray-100"><XIcon className="h-5 w-5 text-gray-500" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => (
  <div className="fixed right-4 top-4 z-50 space-y-2">
    {toasts.map((t) => (
      <div key={t.id} className={`${{ success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' }[t.type]} flex min-w-[300px] items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg`}>
        {t.type === 'success' && <CheckCircleIcon className="h-4 w-4" />}
        {t.type === 'error' && <AlertCircleIcon className="h-4 w-4" />}
        {t.type === 'info' && <BellIcon className="h-4 w-4" />}
        <span className="flex-1 text-sm">{t.message}</span>
        <button type="button" onClick={() => onRemove(t.id)}><XIcon className="h-4 w-4" /></button>
      </div>
    ))}
  </div>
);

export function ParentInteraction() {
  const [tab, setTab] = useState('ptm');
  const [ptmSessions, setPtmSessions] = useState<PTMSession[]>(initialPTMSessions);
  const [feedbacks, setFeedbacks] = useState<ParentFeedback[]>(initialFeedbacks);
  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinutes[]>(initialMeetingMinutes);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ptmSearch, setPtmSearch] = useState('');
  const [ptmStatusFilter, setPtmStatusFilter] = useState('all');
  const [ptmBranchFilter, setPtmBranchFilter] = useState<string[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');
  const [minutesSearch, setMinutesSearch] = useState('');
  const [minutesTypeFilter, setMinutesTypeFilter] = useState('all');
  const [minutesStatusFilter, setMinutesStatusFilter] = useState('all');
  const [minutesDateFrom, setMinutesDateFrom] = useState('');
  const [minutesDateTo, setMinutesDateTo] = useState('');
  const [minutesBranchFilter, setMinutesBranchFilter] = useState<string[]>([]);
  const [minutesBatchFilter, setMinutesBatchFilter] = useState<string[]>([]);
  const [minutesShowFilters, setMinutesShowFilters] = useState(false);
  const [minutesPage, setMinutesPage] = useState(1);
  const MINUTES_PER_PAGE = 5;
  const [modals, setModals] = useState({ ptm: false, minutesForm: false, feedbackResponse: false });
  const [viewPTM, setViewPTM] = useState<PTMSession | null>(null);
  const [viewFeedback, setViewFeedback] = useState<ParentFeedback | null>(null);
  const [viewMinutes, setViewMinutes] = useState<MeetingMinutes | null>(null);
  const [editMinutes, setEditMinutes] = useState<MeetingMinutes | null>(null);
  const [ptmForm, setPtmForm] = useState({ title: '', branchFilters: [] as string[], batchFilters: [] as string[], teacher: '', teacherContact: '', date: '', startTime: '', endTime: '', venue: '', description: '', agenda: '' });
  const [minutesForm, setMinutesForm] = useState<MinutesFormData>(defaultMinutesForm);
  const [feedbackResponse, setFeedbackResponse] = useState('');
  const [ptmPickerSearch, setPtmPickerSearch] = useState('');
  const [ptmPickerOpen, setPtmPickerOpen] = useState(false);

  const filteredBatchesForPTM = useMemo(() => ptmForm.branchFilters.length === 0 ? batchOptions : batchOptions.filter((b) => ptmForm.branchFilters.includes(b.branchId)), [ptmForm.branchFilters]);
  const filteredBatchesForMinutes = useMemo(() => minutesBranchFilter.length === 0 ? batchOptions : batchOptions.filter((b) => minutesBranchFilter.includes(b.branchId)), [minutesBranchFilter]);
  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const getStudentsForBatches = useCallback((branchFilters: string[], batchFilters: string[]) => {
    let s = allStudents;
    if (branchFilters.length > 0) s = s.filter((x) => branchFilters.includes(x.branchId));
    if (batchFilters.length > 0) s = s.filter((x) => batchFilters.includes(x.batchId));
    return s;
  }, []);
  const generateParentRegistrations = useCallback((branchFilters: string[], batchFilters: string[], startTime: string): ParentRegistration[] => {
    const students = getStudentsForBatches(branchFilters, batchFilters);
    let currentTime = startTime;
    return students.map((student) => {
      const [h, m] = currentTime.split(':').map(Number);
      const slotStart = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const nm = m + 15; const nh = h + Math.floor(nm / 60);
      const slotEnd = `${String(nh).padStart(2, '0')}:${String(nm % 60).padStart(2, '0')}`;
      currentTime = slotEnd;
      return { id: generateId('REG'), parentName: student.parentName, studentName: student.name, studentRollNo: student.rollNo, contactNumber: student.parentContact, registeredAt: getCurrentDateTime(), slotTime: `${slotStart}-${slotEnd}`, attended: false, branchId: student.branchId, batchId: student.batchId };
    });
  }, [getStudentsForBatches]);
  const getBranchBatchLabels = useCallback((branchFilters: string[], batchFilters: string[]) => {
    const bl = branchFilters.map((b) => branchOptions.find((o) => o.value === b)?.label).filter(Boolean);
    const bal = batchFilters.map((b) => batchOptions.find((o) => o.value === b)?.label).filter(Boolean);
    if (bal.length > 0) return bal.join(', ');
    if (bl.length > 0) return bl.join(', ');
    return 'All';
  }, []);
  const filteredPTMSessions = useMemo(() => ptmSessions.filter((p) =>
    (ptmSearch === '' || p.title.toLowerCase().includes(ptmSearch.toLowerCase()) || p.teacher.toLowerCase().includes(ptmSearch.toLowerCase()) || p.id.toLowerCase().includes(ptmSearch.toLowerCase())) &&
    (ptmStatusFilter === 'all' || p.status.toLowerCase() === ptmStatusFilter) &&
    (ptmBranchFilter.length === 0 || p.branchFilters.some((b) => ptmBranchFilter.includes(b))),
  ), [ptmSessions, ptmSearch, ptmStatusFilter, ptmBranchFilter]);
  const filteredFeedbacks = useMemo(() => feedbacks.filter((fb) =>
    (feedbackSearch === '' || fb.parent.toLowerCase().includes(feedbackSearch.toLowerCase()) || fb.student.toLowerCase().includes(feedbackSearch.toLowerCase()) || fb.title.toLowerCase().includes(feedbackSearch.toLowerCase())) &&
    (feedbackCategoryFilter === 'all' || fb.category.toLowerCase().includes(feedbackCategoryFilter)) &&
    (feedbackStatusFilter === 'all' || fb.status.toLowerCase() === feedbackStatusFilter),
  ), [feedbacks, feedbackSearch, feedbackCategoryFilter, feedbackStatusFilter]);
  const filteredMinutes = useMemo(() => meetingMinutes.filter((mm) => {
    const q = minutesSearch.toLowerCase();
    const textMatch = q === '' || mm.title.toLowerCase().includes(q) || mm.id.toLowerCase().includes(q) || mm.chairperson.toLowerCase().includes(q) || mm.venue.toLowerCase().includes(q) || mm.minutes.toLowerCase().includes(q);
    const typeMatch = minutesTypeFilter === 'all' || mm.type === minutesTypeFilter;
    const statusMatch = minutesStatusFilter === 'all' || mm.status === minutesStatusFilter;
    const dateFrom = minutesDateFrom ? mm.date >= minutesDateFrom : true;
    const dateTo = minutesDateTo ? mm.date <= minutesDateTo : true;
    let branchBatchMatch = true;
    if (minutesBranchFilter.length > 0 || minutesBatchFilter.length > 0) {
      if (mm.linkedPTMId) {
        const ptm = ptmSessions.find((p) => p.id === mm.linkedPTMId);
        branchBatchMatch = ptm
          ? (minutesBranchFilter.length === 0 || ptm.branchFilters.some((b) => minutesBranchFilter.includes(b))) &&
            (minutesBatchFilter.length === 0 || ptm.batchFilters.some((b) => minutesBatchFilter.includes(b)))
          : false;
      } else branchBatchMatch = false;
    }
    return textMatch && typeMatch && statusMatch && dateFrom && dateTo && branchBatchMatch;
  }), [meetingMinutes, minutesSearch, minutesTypeFilter, minutesStatusFilter, minutesDateFrom, minutesDateTo, minutesBranchFilter, minutesBatchFilter, ptmSessions]);
  const totalMinutesPages = Math.max(1, Math.ceil(filteredMinutes.length / MINUTES_PER_PAGE));
  const paginatedMinutes = filteredMinutes.slice((minutesPage - 1) * MINUTES_PER_PAGE, minutesPage * MINUTES_PER_PAGE);
  const activeMinutesFiltersCount = [minutesSearch !== '', minutesTypeFilter !== 'all', minutesStatusFilter !== 'all', minutesDateFrom !== '', minutesDateTo !== '', minutesBranchFilter.length > 0, minutesBatchFilter.length > 0].filter(Boolean).length;
  const resetMinutesFilters = () => { setMinutesSearch(''); setMinutesTypeFilter('all'); setMinutesStatusFilter('all'); setMinutesDateFrom(''); setMinutesDateTo(''); setMinutesBranchFilter([]); setMinutesBatchFilter([]); setMinutesPage(1); };
  const stats = useMemo(() => ({ upcomingPTM: ptmSessions.filter((p) => p.status === 'Upcoming').length, pendingFeedback: feedbacks.filter((f) => f.status === 'Pending').length }), [ptmSessions, feedbacks]);
  const handleSchedulePTM = () => {
    if (!ptmForm.title || ptmForm.branchFilters.length === 0 || !ptmForm.teacher || !ptmForm.date || !ptmForm.startTime || !ptmForm.venue) return addToast('Please fill all required fields', 'error');
    if (ptmForm.batchFilters.length === 0) return addToast('Please select at least one batch', 'error');
    const registeredParents = generateParentRegistrations(ptmForm.branchFilters, ptmForm.batchFilters, ptmForm.startTime);
    const newPTM: PTMSession = { id: generateId('PTM'), ...ptmForm, agenda: ptmForm.agenda.split('\n').filter((a) => a.trim()), registeredParents, totalStudents: registeredParents.length, status: 'Upcoming', createdAt: getCurrentDateTime(), createdBy: 'Admin', remindersSent: 0 };
    setPtmSessions((prev) => [newPTM, ...prev]);
    setPtmForm({ title: '', branchFilters: [], batchFilters: [], teacher: '', teacherContact: '', date: '', startTime: '', endTime: '', venue: '', description: '', agenda: '' });
    setModals((m) => ({ ...m, ptm: false }));
    addToast(`PTM ${newPTM.id} scheduled with ${registeredParents.length} parents auto-registered`, 'success');
  };
  const handleCancelPTM = (ptmId: string) => {
    const reason = prompt('Enter cancellation reason (optional):');
    setPtmSessions((prev) => prev.map((p) => p.id === ptmId ? { ...p, status: 'Cancelled' as const, cancelReason: reason || 'Cancelled by admin' } : p));
    addToast('PTM session cancelled', 'info');
  };
  const handleSendPTMReminder = (ptmId: string) => {
    setPtmSessions((prev) => prev.map((p) => p.id === ptmId ? { ...p, remindersSent: p.remindersSent + 1 } : p));
    const ptm = ptmSessions.find((p) => p.id === ptmId);
    addToast(`Reminder sent to ${ptm?.registeredParents.length} parents`, 'success');
  };
  const handleMarkPTMCompleted = (ptmId: string) => { setPtmSessions((prev) => prev.map((p) => p.id === ptmId ? { ...p, status: 'Completed' as const } : p)); addToast('PTM marked as completed', 'success'); };
  const handleMarkAttendance = (ptmId: string, regId: string, attended: boolean) => {
    setPtmSessions((prev) => prev.map((p) => p.id === ptmId ? { ...p, registeredParents: p.registeredParents.map((r) => r.id === regId ? { ...r, attended } : r) } : p));
    addToast(`Attendance ${attended ? 'marked' : 'unmarked'}`, 'success');
  };
  const handleReviewFeedback = (feedbackId: string) => { setFeedbacks((prev) => prev.map((fb) => fb.id === feedbackId ? { ...fb, status: 'Reviewed' as const, reviewedBy: 'Admin', reviewedAt: getCurrentDateTime() } : fb)); addToast('Feedback marked as reviewed', 'success'); };
  const handleRespondToFeedback = () => {
    if (!viewFeedback || !feedbackResponse.trim()) return addToast('Please enter a response', 'error');
    setFeedbacks((prev) => prev.map((fb) => fb.id === viewFeedback.id ? { ...fb, status: 'Resolved' as const, response: feedbackResponse, responseAt: getCurrentDateTime() } : fb));
    setModals((m) => ({ ...m, feedbackResponse: false })); setFeedbackResponse(''); setViewFeedback(null); addToast('Response sent to parent', 'success');
  };
  const handleEscalateFeedback = (feedbackId: string) => { setFeedbacks((prev) => prev.map((fb) => fb.id === feedbackId ? { ...fb, status: 'Escalated' as const } : fb)); addToast('Feedback escalated to management', 'info'); };
  const handleDeleteFeedback = (feedbackId: string) => { setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId)); setViewFeedback(null); addToast('Feedback deleted', 'info'); };
  const openAddMinutes = (linkedPTM?: PTMSession) => {
    setEditMinutes(null);
    if (linkedPTM) setMinutesForm({ ...defaultMinutesForm, linkedPTMId: linkedPTM.id, title: linkedPTM.title, date: linkedPTM.date, startTime: linkedPTM.startTime, endTime: linkedPTM.endTime, venue: linkedPTM.venue, attendeesCount: String(linkedPTM.registeredParents.length), type: 'PTM' });
    else setMinutesForm(defaultMinutesForm);
    setModals((m) => ({ ...m, minutesForm: true }));
  };
  const handleSaveMinutes = () => {
    if (!minutesForm.title || !minutesForm.date || !minutesForm.minutes) return addToast('Please fill all required fields (Title, Date, Minutes)', 'error');
    const actionItemsList: ActionItem[] = minutesForm.actionItems.split('\n').filter((a) => a.trim()).map((item, i) => ({ id: `AI-${Date.now()}-${i}`, item: item.trim(), responsible: 'TBD', deadline: '', status: 'Pending' as const }));
    if (editMinutes) {
      setMeetingMinutes((prev) => prev.map((mm) => mm.id === editMinutes.id ? { ...mm, title: minutesForm.title, type: minutesForm.type, linkedPTMId: minutesForm.linkedPTMId || undefined, date: minutesForm.date, startTime: minutesForm.startTime, endTime: minutesForm.endTime, venue: minutesForm.venue, attendeesCount: parseInt(minutesForm.attendeesCount) || 0, chairperson: minutesForm.chairperson, secretary: minutesForm.secretary, minutes: minutesForm.minutes, nextMeetingDate: minutesForm.nextMeetingDate || undefined, actionItems: actionItemsList.length > 0 ? actionItemsList : mm.actionItems } : mm));
      addToast('Meeting minutes updated', 'success');
    } else {
      const newMM: MeetingMinutes = { id: generateId('MM'), title: minutesForm.title, type: minutesForm.type, linkedPTMId: minutesForm.linkedPTMId || undefined, date: minutesForm.date, startTime: minutesForm.startTime, endTime: minutesForm.endTime, venue: minutesForm.venue, attendeesCount: parseInt(minutesForm.attendeesCount) || 0, attendeesList: [], chairperson: minutesForm.chairperson, secretary: minutesForm.secretary, minutes: minutesForm.minutes, discussionPoints: [], actionItems: actionItemsList, nextMeetingDate: minutesForm.nextMeetingDate || undefined, attachments: [], status: 'Draft', createdAt: getCurrentDateTime(), createdBy: 'Admin' };
      setMeetingMinutes((prev) => [newMM, ...prev]);
      addToast(`Meeting minutes ${newMM.id} saved as Draft`, 'success');
    }
    setMinutesForm(defaultMinutesForm); setModals((m) => ({ ...m, minutesForm: false })); setEditMinutes(null);
  };
  const handleFinalizeMinutes = (id: string) => { setMeetingMinutes((prev) => prev.map((mm) => mm.id === id ? { ...mm, status: 'Finalized' as const } : mm)); addToast('Meeting minutes finalized', 'success'); };
  const handleDistributeMinutes = (id: string) => { setMeetingMinutes((prev) => prev.map((mm) => mm.id === id ? { ...mm, status: 'Distributed' as const } : mm)); addToast('Meeting minutes distributed to attendees', 'success'); };
  const handleUpdateActionItem = (minutesId: string, actionId: string, newStatus: ActionItem['status']) => {
    setMeetingMinutes((prev) => prev.map((mm) => mm.id === minutesId ? { ...mm, actionItems: mm.actionItems.map((ai) => ai.id === actionId ? { ...ai, status: newStatus, completedAt: newStatus === 'Completed' ? getCurrentDateTime() : undefined } : ai) } : mm));
    addToast(`Action item marked as ${newStatus}`, 'success');
  };
  const handleDeleteMinutes = (id: string) => { setMeetingMinutes((prev) => prev.filter((mm) => mm.id !== id)); setViewMinutes(null); addToast('Meeting minutes deleted', 'info'); };
  const handleEditMinutes = (mm: MeetingMinutes) => {
    setEditMinutes(mm);
    setMinutesForm({ title: mm.title, type: mm.type, linkedPTMId: mm.linkedPTMId || '', date: mm.date, startTime: mm.startTime, endTime: mm.endTime, venue: mm.venue, attendeesCount: mm.attendeesCount.toString(), chairperson: mm.chairperson, secretary: mm.secretary, minutes: mm.minutes, actionItems: mm.actionItems.map((ai) => ai.item).join('\n'), nextMeetingDate: mm.nextMeetingDate || '' });
    setModals((m) => ({ ...m, minutesForm: true }));
  };
  const getLinkedPTM = (linkedPTMId?: string) => linkedPTMId ? ptmSessions.find((p) => p.id === linkedPTMId) : undefined;
  const handleLinkPTMInForm = (ptm: PTMSession | null) => {
    if (ptm) setMinutesForm((prev) => ({ ...prev, linkedPTMId: ptm.id, title: prev.title || ptm.title, date: prev.date || ptm.date, startTime: prev.startTime || ptm.startTime, endTime: prev.endTime || ptm.endTime, venue: prev.venue || ptm.venue, attendeesCount: prev.attendeesCount || String(ptm.registeredParents.length), type: 'PTM' }));
    else setMinutesForm((prev) => ({ ...prev, linkedPTMId: '' }));
  };
  const filteredPickerPTMs = useMemo(() => {
    const q = ptmPickerSearch.toLowerCase();
    return ptmSessions.filter((p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.teacher.toLowerCase().includes(q) || p.date.includes(q) || getBranchBatchLabels(p.branchFilters, p.batchFilters).toLowerCase().includes(q));
  }, [ptmSessions, ptmPickerSearch, getBranchBatchLabels]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Interaction</h1>
          <p className="mt-1 text-sm text-gray-500">PTM scheduling, feedback, and meeting records</p>
        </div>
        <Button variant="primary" onClick={() => setModals((m) => ({ ...m, ptm: true }))}><PlusIcon className="mr-2 h-4 w-4" />Schedule PTM</Button>
      </div>
      <Card noPadding>
        <Tabs defaultValue="ptm" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="ptm">PTM Scheduling{stats.upcomingPTM > 0 && <span className="ml-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">{stats.upcomingPTM}</span>}</TabsTrigger>
            <TabsTrigger value="feedback">Parent Feedback{stats.pendingFeedback > 0 && <span className="ml-2 rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700">{stats.pendingFeedback}</span>}</TabsTrigger>
            <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
          </TabsList>
          <TabsContent value="ptm" className="p-5">
            <div className="mb-4 flex flex-wrap gap-3">
              <Input placeholder="Search PTM sessions..." leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />} className="min-w-[200px] flex-1" value={ptmSearch} onChange={(e) => setPtmSearch(e.target.value)} />
              <div className="w-52"><MultiSelectDropdown options={branchOptions} selectedValues={ptmBranchFilter} onChange={setPtmBranchFilter} placeholder="Filter by Branch" /></div>
              <Select value={ptmStatusFilter} onChange={(e) => setPtmStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' }]} className="w-40" />
              <Button variant="primary" onClick={() => setModals((m) => ({ ...m, ptm: true }))}><CalendarIcon className="mr-2 h-4 w-4" />Schedule PTM</Button>
            </div>
            <div className="space-y-4">
              {filteredPTMSessions.map((ptm) => {
                const linked = meetingMinutes.find((mm) => mm.linkedPTMId === ptm.id);
                return (
                  <div key={ptm.id} className={`rounded-lg border p-4 ${ptm.status === 'Upcoming' ? 'border-blue-200 bg-blue-50/50' : ptm.status === 'Completed' ? 'border-green-200 bg-green-50/50' : ptm.status === 'Cancelled' ? 'border-red-200 bg-red-50/50 opacity-60' : 'border-gray-200'}`}>
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2"><p className="font-semibold text-gray-800">{ptm.title}</p><StatusBadge status={ptm.status} /></div>
                        <p className="text-xs text-gray-500">{ptm.id} • {ptm.teacher} • {getBranchBatchLabels(ptm.branchFilters, ptm.batchFilters)}</p>
                      </div>
                      <div className="text-right"><p className="text-sm font-medium text-gray-800">{ptm.date}</p><p className="text-xs text-gray-500">{ptm.startTime} – {ptm.endTime}</p></div>
                    </div>
                    <div className="mb-3 grid grid-cols-4 gap-4 text-sm">
                      <div><p className="text-xs text-gray-400">Venue</p><p className="font-medium">{ptm.venue}</p></div>
                      <div><p className="text-xs text-gray-400">Registered</p><p className="font-medium">{ptm.registeredParents.length}/{ptm.totalStudents}</p></div>
                      <div><p className="text-xs text-gray-400">Reminders Sent</p><p className="font-medium">{ptm.remindersSent}</p></div>
                      <div><p className="text-xs text-gray-400">Attendance</p><p className="font-medium">{ptm.registeredParents.filter((r) => r.attended).length}/{ptm.registeredParents.length}</p></div>
                    </div>
                    {linked ? (
                      <div className="mb-3 flex w-fit items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-2 py-1.5">
                        <FileTextIcon className="h-3 w-3 text-green-600" /><span className="text-xs font-medium text-green-700">Minutes recorded</span><StatusBadge status={linked.status} />
                        <button type="button" className="ml-1 text-xs text-green-600 underline" onClick={() => setViewMinutes(linked)}>View</button>
                      </div>
                    ) : ptm.status === 'Completed' ? (
                      <div className="mb-3"><button type="button" className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100" onClick={() => openAddMinutes(ptm)}><FileTextIcon className="h-3 w-3" />Add Meeting Minutes</button></div>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => setViewPTM(ptm)}><EyeIcon className="mr-1 h-3 w-3" />View Details</Button>
                      {ptm.status === 'Upcoming' && (
                        <>
                          <Button variant="outline" className="h-7 px-2 text-xs" onClick={() => handleSendPTMReminder(ptm.id)}><BellIcon className="mr-1 h-3 w-3" />Send Reminder</Button>
                          <Button variant="primary" className="h-7 px-2 text-xs" onClick={() => handleMarkPTMCompleted(ptm.id)}><CheckCircleIcon className="mr-1 h-3 w-3" />Mark Completed</Button>
                          <Button variant="ghost" className="h-7 px-2 text-xs text-red-500" onClick={() => handleCancelPTM(ptm.id)}>Cancel</Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredPTMSessions.length === 0 && <div className="py-10 text-center"><CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" /><p className="text-gray-500">No PTM sessions found</p></div>}
            </div>
          </TabsContent>
          <TabsContent value="feedback" className="p-5">
            <div className="mb-4 flex flex-wrap gap-3">
              <Input placeholder="Search feedback..." leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />} className="min-w-[200px] flex-1" value={feedbackSearch} onChange={(e) => setFeedbackSearch(e.target.value)} />
              <Select value={feedbackCategoryFilter} onChange={(e) => setFeedbackCategoryFilter(e.target.value)} options={[{ value: 'all', label: 'All Categories' }, ...feedbackCategories]} className="w-44" />
              <Select value={feedbackStatusFilter} onChange={(e) => setFeedbackStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'reviewed', label: 'Reviewed' }, { value: 'resolved', label: 'Resolved' }, { value: 'escalated', label: 'Escalated' }]} className="w-36" />
            </div>
            <div className="space-y-3">
              {filteredFeedbacks.map((fb) => (
                <div key={fb.id} className={`rounded-lg border p-4 ${fb.status === 'Pending' ? 'border-yellow-200 bg-yellow-50/50' : fb.status === 'Escalated' ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}`}>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2"><p className="font-semibold text-gray-800">{fb.title}</p><StatusBadge status={fb.status} /></div>
                      <p className="text-xs text-gray-500">{fb.id} • {fb.parent} • {fb.student} ({fb.studentClass})</p>
                    </div>
                    <div className="text-right"><StarRating rating={fb.rating} /><p className="mt-1 text-xs text-gray-500">{fb.date}</p></div>
                  </div>
                  <div className="mb-3"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{fb.category}{fb.subcategory && ` › ${fb.subcategory}`}</span></div>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600">{fb.feedback}</p>
                  {fb.response && <div className="mb-3 rounded-lg bg-green-50 p-2"><p className="mb-1 text-xs font-medium text-green-600">Response:</p><p className="text-sm text-gray-600">{fb.response}</p></div>}
                  <div className="flex gap-2">
                    <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => setViewFeedback(fb)}><EyeIcon className="mr-1 h-3 w-3" />View</Button>
                    {fb.status === 'Pending' && (
                      <>
                        <Button variant="outline" className="h-7 px-2 text-xs" onClick={() => handleReviewFeedback(fb.id)}><CheckCircleIcon className="mr-1 h-3 w-3" />Mark Reviewed</Button>
                        <Button variant="primary" className="h-7 px-2 text-xs" onClick={() => { setViewFeedback(fb); setModals((m) => ({ ...m, feedbackResponse: true })); }}><MessageSquareIcon className="mr-1 h-3 w-3" />Respond</Button>
                        <Button variant="ghost" className="h-7 px-2 text-xs text-red-500" onClick={() => handleEscalateFeedback(fb.id)}>Escalate</Button>
                      </>
                    )}
                    {fb.status === 'Reviewed' && !fb.response && <Button variant="primary" className="h-7 px-2 text-xs" onClick={() => { setViewFeedback(fb); setModals((m) => ({ ...m, feedbackResponse: true })); }}><MessageSquareIcon className="mr-1 h-3 w-3" />Respond</Button>}
                  </div>
                </div>
              ))}
              {filteredFeedbacks.length === 0 && <div className="py-10 text-center"><MessageSquareIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" /><p className="text-gray-500">No feedback found</p></div>}
            </div>
          </TabsContent>
          <TabsContent value="minutes" className="p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by title, ID, chairperson, venue…" value={minutesSearch} onChange={(e) => { setMinutesSearch(e.target.value); setMinutesPage(1); }} />
              </div>
              <Select value={minutesTypeFilter} onChange={(e) => { setMinutesTypeFilter(e.target.value); setMinutesPage(1); }} options={[{ value: 'all', label: 'All Types' }, { value: 'PTM', label: 'PTM' }, { value: 'Advisory', label: 'Advisory' }, { value: 'Committee', label: 'Committee' }, { value: 'General', label: 'General' }, { value: 'Emergency', label: 'Emergency' }]} className="w-36" />
              <Select value={minutesStatusFilter} onChange={(e) => { setMinutesStatusFilter(e.target.value); setMinutesPage(1); }} options={[{ value: 'all', label: 'All Status' }, { value: 'Draft', label: 'Draft' }, { value: 'Finalized', label: 'Finalized' }, { value: 'Distributed', label: 'Distributed' }]} className="w-36" />
              <button type="button" onClick={() => setMinutesShowFilters((v) => !v)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${minutesShowFilters || activeMinutesFiltersCount > 2 ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'}`}>
                <FilterIcon className="h-4 w-4" />More Filters{minutesShowFilters ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
              </button>
              {activeMinutesFiltersCount > 0 && <button type="button" onClick={resetMinutesFilters} className="flex items-center gap-1 px-2 py-2 text-sm text-red-500"><XIcon className="h-3 w-3" />Clear</button>}
              <Button variant="primary" onClick={() => openAddMinutes()}><PlusIcon className="mr-2 h-4 w-4" />Add Minutes</Button>
            </div>
            {minutesShowFilters && (
              <div className="mb-4 grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-4">
                <div><label className="mb-1 block text-xs font-medium text-gray-600">Date From</label><input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm" value={minutesDateFrom} onChange={(e) => { setMinutesDateFrom(e.target.value); setMinutesPage(1); }} /></div>
                <div><label className="mb-1 block text-xs font-medium text-gray-600">Date To</label><input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm" value={minutesDateTo} onChange={(e) => { setMinutesDateTo(e.target.value); setMinutesPage(1); }} /></div>
                <div><label className="mb-1 block text-xs font-medium text-gray-600">Branch (linked PTM)</label><MultiSelectDropdown options={branchOptions} selectedValues={minutesBranchFilter} onChange={(v) => { setMinutesBranchFilter(v); setMinutesPage(1); }} placeholder="All Branches" /></div>
                <div><label className="mb-1 block text-xs font-medium text-gray-600">Batch (linked PTM)</label><MultiSelectDropdown options={filteredBatchesForMinutes} selectedValues={minutesBatchFilter} onChange={(v) => { setMinutesBatchFilter(v); setMinutesPage(1); }} placeholder={minutesBranchFilter.length === 0 ? 'Select branch first' : 'All Batches'} disabled={minutesBranchFilter.length === 0} /></div>
              </div>
            )}
            <p className="mb-3 text-xs text-gray-500">Showing <span className="font-semibold text-gray-700">{filteredMinutes.length}</span> of <span className="font-semibold text-gray-700">{meetingMinutes.length}</span> records</p>
            {paginatedMinutes.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Meeting</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Linked PTM</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Attendees</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedMinutes.map((mm) => {
                      const lp = getLinkedPTM(mm.linkedPTMId);
                      return (
                        <tr key={mm.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setViewMinutes(mm)}>
                          <td className="px-4 py-3"><p className="font-medium text-gray-800">{mm.title}</p><p className="text-xs text-gray-400">{mm.id}</p></td>
                          <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{mm.type}</span></td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600"><p>{mm.date}</p><p className="text-gray-400">{mm.startTime}–{mm.endTime}</p></td>
                          <td className="px-4 py-3">{lp ? <div className="flex items-center gap-1"><LinkIcon className="h-3 w-3 text-blue-400" /><p className="text-xs font-medium text-blue-600">{lp.title}</p></div> : <span className="text-xs text-gray-300">—</span>}</td>
                          <td className="px-4 py-3"><div className="flex items-center gap-1"><UsersIcon className="h-3 w-3 text-gray-400" /><span className="text-xs text-gray-600">{mm.attendeesCount}</span></div></td>
                          <td className="px-4 py-3"><StatusBadge status={mm.status} /></td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <button type="button" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" onClick={() => setViewMinutes(mm)}><EyeIcon className="h-3.5 w-3.5" /></button>
                              {mm.status === 'Draft' && <button type="button" className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50" onClick={() => handleEditMinutes(mm)}><EditIcon className="h-3.5 w-3.5" /></button>}
                              {mm.status === 'Draft' && <button type="button" className="rounded-lg p-1.5 text-green-500 hover:bg-green-50" onClick={() => handleFinalizeMinutes(mm.id)}><CheckCircleIcon className="h-3.5 w-3.5" /></button>}
                              {mm.status === 'Finalized' && <button type="button" className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50" onClick={() => handleDistributeMinutes(mm.id)}><SendIcon className="h-3.5 w-3.5" /></button>}
                              <button type="button" className="rounded-lg p-1.5 text-red-400 hover:bg-red-50" onClick={() => handleDeleteMinutes(mm.id)}><TrashIcon className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 py-14 text-center"><FileTextIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" /><p className="font-medium text-gray-500">No meeting minutes found</p></div>
            )}
            {totalMinutesPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setMinutesPage((p) => Math.max(1, p - 1))} disabled={minutesPage === 1} className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
                <span className="text-xs text-gray-500">Page {minutesPage} of {totalMinutesPages}</span>
                <button type="button" onClick={() => setMinutesPage((p) => Math.min(totalMinutesPages, p + 1))} disabled={minutesPage === totalMinutesPages} className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40">Next</button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Modal isOpen={modals.ptm} onClose={() => setModals((m) => ({ ...m, ptm: false }))} title="Schedule PTM Session" size="lg">
        <div className="space-y-4">
          <Input label="PTM Title *" placeholder="e.g., Mid-Term Progress Review" value={ptmForm.title} onChange={(e) => setPtmForm({ ...ptmForm, title: e.target.value })} />
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-800">Select Target Audience</h4>
            <MultiSelectDropdown label="Select Branches *" options={branchOptions} selectedValues={ptmForm.branchFilters} onChange={(values) => setPtmForm({ ...ptmForm, branchFilters: values, batchFilters: ptmForm.batchFilters.filter((b) => batchOptions.filter((bo) => values.includes(bo.branchId)).map((bo) => bo.value).includes(b)) })} placeholder="Select branches..." />
            <MultiSelectDropdown label="Select Batches *" options={filteredBatchesForPTM} selectedValues={ptmForm.batchFilters} onChange={(values) => setPtmForm({ ...ptmForm, batchFilters: values })} placeholder={ptmForm.branchFilters.length === 0 ? 'Select branch first…' : 'Select batches…'} disabled={ptmForm.branchFilters.length === 0} />
            {ptmForm.batchFilters.length > 0 && <div className="rounded border bg-white p-2 text-sm text-gray-600"><span className="font-medium">Students to be included: </span>{getStudentsForBatches(ptmForm.branchFilters, ptmForm.batchFilters).length} students</div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Class Teacher *" placeholder="Teacher name" value={ptmForm.teacher} onChange={(e) => setPtmForm({ ...ptmForm, teacher: e.target.value })} />
            <Input label="Teacher Contact" placeholder="Phone number" value={ptmForm.teacherContact} onChange={(e) => setPtmForm({ ...ptmForm, teacherContact: e.target.value })} />
          </div>
          <Input label="Date *" type="date" value={ptmForm.date} onChange={(e) => setPtmForm({ ...ptmForm, date: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time *" type="time" value={ptmForm.startTime} onChange={(e) => setPtmForm({ ...ptmForm, startTime: e.target.value })} />
            <Input label="End Time" type="time" value={ptmForm.endTime} onChange={(e) => setPtmForm({ ...ptmForm, endTime: e.target.value })} />
          </div>
          <Input label="Venue *" placeholder="e.g., Classroom 8A" value={ptmForm.venue} onChange={(e) => setPtmForm({ ...ptmForm, venue: e.target.value })} />
          <Textarea label="Description" placeholder="PTM description…" rows={2} value={ptmForm.description} onChange={(e) => setPtmForm({ ...ptmForm, description: e.target.value })} />
          <Textarea label="Agenda (one item per line)" placeholder="Academic performance review" rows={4} value={ptmForm.agenda} onChange={(e) => setPtmForm({ ...ptmForm, agenda: e.target.value })} />
          <div className="flex gap-3 border-t pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setModals((m) => ({ ...m, ptm: false }))}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleSchedulePTM}><CalendarIcon className="mr-2 h-4 w-4" />Schedule PTM</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!viewPTM} onClose={() => setViewPTM(null)} title={viewPTM?.title || 'PTM Details'} size="lg">
        {viewPTM && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><StatusBadge status={viewPTM.status} /><span className="text-sm text-gray-500">{viewPTM.id}</span></div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Teacher</p><p className="text-sm font-medium">{viewPTM.teacher}</p></div>
              <div><p className="text-xs text-gray-500">Date & Time</p><p className="text-sm font-medium">{viewPTM.date}</p><p className="text-xs text-gray-400">{viewPTM.startTime} – {viewPTM.endTime}</p></div>
              <div><p className="text-xs text-gray-500">Venue</p><p className="text-sm font-medium">{viewPTM.venue}</p></div>
              <div><p className="text-xs text-gray-500">Branches & Batches</p><p className="text-sm font-medium">{getBranchBatchLabels(viewPTM.branchFilters, viewPTM.batchFilters)}</p></div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Registered Parents ({viewPTM.registeredParents.length}/{viewPTM.totalStudents})</p>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {viewPTM.registeredParents.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                    <div><p className="text-sm font-medium">{reg.parentName}</p><p className="text-xs text-gray-500">{reg.studentName} ({reg.studentRollNo}) • {reg.slotTime}</p></div>
                    <button type="button" className={`rounded px-2 py-1 text-xs font-medium ${reg.attended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => handleMarkAttendance(viewPTM.id, reg.id, !reg.attended)}>{reg.attended ? '✓ Attended' : 'Mark Attended'}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!viewFeedback && !modals.feedbackResponse} onClose={() => setViewFeedback(null)} title={viewFeedback?.title || 'Feedback Details'}>
        {viewFeedback && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><StatusBadge status={viewFeedback.status} /><span className="text-sm text-gray-500">{viewFeedback.id}</span></div>
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium">{viewFeedback.parent}</p><p className="text-xs text-gray-500">{viewFeedback.student} ({viewFeedback.studentClass})</p></div><StarRating rating={viewFeedback.rating} /></div>
            <p className="text-sm text-gray-700">{viewFeedback.feedback}</p>
            {viewFeedback.response && <div className="rounded-lg bg-green-50 p-3"><p className="mb-1 text-xs font-medium text-green-600">Response</p><p className="text-sm text-gray-700">{viewFeedback.response}</p></div>}
            <div className="flex gap-2 border-t pt-4">
              {!viewFeedback.response && <Button variant="primary" className="flex-1" onClick={() => setModals((m) => ({ ...m, feedbackResponse: true }))}><MessageSquareIcon className="mr-2 h-4 w-4" />Respond</Button>}
              <Button variant="ghost" className="text-red-500" onClick={() => handleDeleteFeedback(viewFeedback.id)}><TrashIcon className="h-4 w-4" /></Button>
              <Button variant="outline" className="flex-1" onClick={() => setViewFeedback(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={modals.feedbackResponse} onClose={() => { setModals((m) => ({ ...m, feedbackResponse: false })); setFeedbackResponse(''); }} title="Respond to Feedback">
        {viewFeedback && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3"><p className="text-sm font-medium text-gray-800">{viewFeedback.title}</p><p className="text-xs text-gray-500">{viewFeedback.parent} • {viewFeedback.student}</p></div>
            <Textarea label="Your Response *" placeholder="Enter your response to the parent..." rows={5} value={feedbackResponse} onChange={(e) => setFeedbackResponse(e.target.value)} />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setModals((m) => ({ ...m, feedbackResponse: false })); setFeedbackResponse(''); }}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleRespondToFeedback}><SendIcon className="mr-2 h-4 w-4" />Send Response</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!viewMinutes} onClose={() => setViewMinutes(null)} title={viewMinutes?.title || 'Meeting Minutes'} size="lg">
        {viewMinutes && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2"><StatusBadge status={viewMinutes.status} /><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{viewMinutes.type}</span><span className="text-sm text-gray-500">{viewMinutes.id}</span></div>
            {viewMinutes.linkedPTMId && (() => {
              const lp = getLinkedPTM(viewMinutes.linkedPTMId);
              return lp ? (
                <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3" onClick={() => { setViewMinutes(null); setTimeout(() => setViewPTM(lp), 150); }}>
                  <LinkIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-blue-700">Linked PTM Session</p><p className="truncate text-sm text-blue-800">{lp.title}</p></div>
                  <StatusBadge status={lp.status} />
                </div>
              ) : null;
            })()}
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{viewMinutes.date}</p></div>
              <div><p className="text-xs text-gray-500">Venue</p><p className="font-medium">{viewMinutes.venue}</p></div>
              <div><p className="text-xs text-gray-500">Attendees</p><p className="font-medium">{viewMinutes.attendeesCount}</p></div>
              <div><p className="text-xs text-gray-500">Chairperson</p><p className="font-medium">{viewMinutes.chairperson || '—'}</p></div>
            </div>
            <div><p className="mb-1 text-xs text-gray-500">Minutes</p><p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{viewMinutes.minutes}</p></div>
            {viewMinutes.actionItems.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Action Items</p>
                {viewMinutes.actionItems.map((ai) => (
                  <div key={ai.id} className="mb-2 flex items-center justify-between rounded-lg bg-gray-50 p-2">
                    <div><p className="text-sm">{ai.item}</p><p className="text-xs text-gray-500">{ai.responsible || 'TBD'}</p></div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={ai.status} />
                      {ai.status !== 'Completed' && viewMinutes.status !== 'Distributed' && (
                        <Select value={ai.status} onChange={(e) => handleUpdateActionItem(viewMinutes.id, ai.id, e.target.value as ActionItem['status'])} options={[{ value: 'Pending', label: 'Pending' }, { value: 'In Progress', label: 'In Progress' }, { value: 'Completed', label: 'Completed' }]} className="w-32 text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 border-t pt-4">
              {viewMinutes.status === 'Draft' && (
                <>
                  <Button variant="outline" onClick={() => { handleEditMinutes(viewMinutes); setViewMinutes(null); }}><EditIcon className="mr-2 h-4 w-4" />Edit</Button>
                  <Button variant="primary" onClick={() => { handleFinalizeMinutes(viewMinutes.id); setViewMinutes((p) => p ? { ...p, status: 'Finalized' } : null); }}><CheckCircleIcon className="mr-2 h-4 w-4" />Finalize</Button>
                </>
              )}
              {viewMinutes.status === 'Finalized' && <Button variant="primary" onClick={() => { handleDistributeMinutes(viewMinutes.id); setViewMinutes((p) => p ? { ...p, status: 'Distributed' } : null); }}><SendIcon className="mr-2 h-4 w-4" />Distribute</Button>}
              <Button variant="ghost" className="text-red-500" onClick={() => handleDeleteMinutes(viewMinutes.id)}><TrashIcon className="h-4 w-4" /></Button>
              <Button variant="outline" className="flex-1" onClick={() => setViewMinutes(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={modals.minutesForm} onClose={() => { setModals((m) => ({ ...m, minutesForm: false })); setEditMinutes(null); setPtmPickerSearch(''); setPtmPickerOpen(false); }} title={editMinutes ? 'Edit Meeting Minutes' : 'Record Meeting Minutes'} size="xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700"><LinkIcon className="h-4 w-4 text-blue-500" />Link to PTM Session <span className="text-xs font-normal text-gray-400">(optional)</span></h4>
            {minutesForm.linkedPTMId ? (() => {
              const lp = ptmSessions.find((p) => p.id === minutesForm.linkedPTMId);
              return lp ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-blue-800">{lp.title}</p><p className="text-xs text-blue-600">{lp.id} • {lp.date}</p></div>
                    <button type="button" onClick={() => handleLinkPTMInForm(null)} className="rounded-full p-1 hover:bg-blue-100"><XIcon className="h-4 w-4 text-blue-400" /></button>
                  </div>
                </div>
              ) : null;
            })() : (
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-4 text-sm" placeholder="Search PTM by title, ID, teacher…" value={ptmPickerSearch} onChange={(e) => { setPtmPickerSearch(e.target.value); setPtmPickerOpen(true); }} onFocus={() => setPtmPickerOpen(true)} />
                {ptmPickerOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setPtmPickerOpen(false)} />
                    <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                      {filteredPickerPTMs.map((ptm) => (
                        <button key={ptm.id} type="button" className="w-full border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50" onClick={() => { handleLinkPTMInForm(ptm); setPtmPickerSearch(''); setPtmPickerOpen(false); }}>
                          <p className="truncate text-sm font-semibold text-gray-800">{ptm.title}</p>
                          <p className="text-xs text-gray-500">{ptm.id} • {ptm.date} • {ptm.teacher}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <Input label="Meeting Title *" placeholder="e.g. PTM - Class 8-A" value={minutesForm.title} onChange={(e) => setMinutesForm({ ...minutesForm, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Type" value={minutesForm.type} onChange={(e) => setMinutesForm({ ...minutesForm, type: e.target.value as MeetingMinutes['type'] })} options={[{ value: 'PTM', label: 'PTM' }, { value: 'Advisory', label: 'Advisory' }, { value: 'Committee', label: 'Committee' }, { value: 'General', label: 'General' }, { value: 'Emergency', label: 'Emergency' }]} />
              <Input label="Date *" type="date" value={minutesForm.date} onChange={(e) => setMinutesForm({ ...minutesForm, date: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Time" type="time" value={minutesForm.startTime} onChange={(e) => setMinutesForm({ ...minutesForm, startTime: e.target.value })} />
              <Input label="End Time" type="time" value={minutesForm.endTime} onChange={(e) => setMinutesForm({ ...minutesForm, endTime: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Venue" placeholder="Meeting venue" value={minutesForm.venue} onChange={(e) => setMinutesForm({ ...minutesForm, venue: e.target.value })} />
              <Input label="Attendees Count" type="number" placeholder="Number" value={minutesForm.attendeesCount} onChange={(e) => setMinutesForm({ ...minutesForm, attendeesCount: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Chairperson" placeholder="Name" value={minutesForm.chairperson} onChange={(e) => setMinutesForm({ ...minutesForm, chairperson: e.target.value })} />
              <Input label="Secretary" placeholder="Name" value={minutesForm.secretary} onChange={(e) => setMinutesForm({ ...minutesForm, secretary: e.target.value })} />
            </div>
            <Input label="Next Meeting Date" type="date" value={minutesForm.nextMeetingDate} onChange={(e) => setMinutesForm({ ...minutesForm, nextMeetingDate: e.target.value })} />
          </div>
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700"><FileTextIcon className="h-4 w-4 text-gray-500" />Minutes Content</h4>
            <Textarea label="Minutes / Discussion Points *" placeholder="Record key discussion points…" rows={10} value={minutesForm.minutes} onChange={(e) => setMinutesForm({ ...minutesForm, minutes: e.target.value })} />
            <Textarea label="Action Items (one per line)" placeholder="Follow up on homework guidelines" rows={6} value={minutesForm.actionItems} onChange={(e) => setMinutesForm({ ...minutesForm, actionItems: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex gap-3 border-t pt-4">
          <Button variant="outline" className="flex-1" onClick={() => { setModals((m) => ({ ...m, minutesForm: false })); setEditMinutes(null); }}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSaveMinutes}><FileTextIcon className="mr-2 h-4 w-4" />{editMinutes ? 'Update Minutes' : 'Save as Draft'}</Button>
        </div>
      </Modal>
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}

export default ParentInteraction;
