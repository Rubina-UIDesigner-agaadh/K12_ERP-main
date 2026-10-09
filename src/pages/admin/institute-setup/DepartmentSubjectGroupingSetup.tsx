import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus, Edit2, Trash2, X, Save, Search, Filter, Download, Upload,
  BookOpen, ChevronDown, ChevronRight, Mail, Phone,
  Calendar, AlertCircle, CheckCircle, Info,
  Building2, Clock
} from 'lucide-react';

// ==================== TYPES ====================
type DepartmentType = 'Academic' | 'Administrative' | 'Support' | 'Co-curricular';
type SubjectCategory = 'Main / Core' | 'Optional / Elective' | 'Language' | 'Activity / Skill';
type LeaveApproval = 'HOD' | 'Principal';
type SetupTab = 'Departments' | 'Subjects';

interface Subject {
  id: string; name: string; code: string; description: string;
  type: 'theory' | 'practical' | 'both'; credits: number;
  hoursPerWeek: number; isElective: boolean; isActive: boolean;
}
interface SubjectRecord extends Subject {
  departmentId: string; shortName: string; boardCode: string;
  classLevels: string[]; category: SubjectCategory; isCompulsory: boolean;
  hasPractical: boolean; practicalType: string; theoryPeriods: number;
  practicalPeriods: number; languagePosition: string;
}
interface StaffMember {
  id: string; name: string; designation: string; email: string; phone: string;
  qualification: string; experience: number; joiningDate: string;
  subjects: string[]; workload: number; isHOD: boolean;
}
interface Department {
  id: string; name: string; code: string; head: string; headId: string;
  description: string; subjects: Subject[]; staff: StaffMember[];
  establishedDate: string; budget: number; location: string; email: string;
  phone: string; isActive: boolean; createdAt: string; modifiedAt: string;
  departmentType?: DepartmentType; applicableClasses?: string[];
  hodDesignation?: string; leaveApproval?: LeaveApproval; staffRoom?: string;
  primaryBuilding?: string; displayOrder?: number;
}
interface DepartmentFormState {
  name: string; code: string; description: string; departmentType: DepartmentType;
  applicableClasses: string[]; establishedDate: string; budget: string;
  staffRoom: string; primaryBuilding: string; displayOrder: string;
  hodId: string; hodDesignation: string; leaveApproval: LeaveApproval;
  staffIds: string[]; isActive: boolean;
}
interface SubjectFormState {
  name: string; shortName: string; code: string; boardCode: string;
  description: string; departmentId: string; category: SubjectCategory;
  classLevels: string[]; type: Subject['type']; credits: string;
  hoursPerWeek: string; theoryPeriods: string; practicalPeriods: string;
  hasPractical: boolean; practicalType: string; languagePosition: string;
  isActive: boolean;
}
interface Notification {
  type: 'success' | 'error' | 'info' | 'warning'; message: string;
}

// ==================== MOCK DATA ====================
const mockSubjects: Subject[] = [
{
  id: 'sub-1',
  name: 'Physics',
  code: 'PHY101',
  description: 'Fundamental Physics',
  type: 'both',
  credits: 4,
  hoursPerWeek: 6,
  isElective: false,
  isActive: true
},
{
  id: 'sub-2',
  name: 'Chemistry',
  code: 'CHE101',
  description: 'General Chemistry',
  type: 'both',
  credits: 4,
  hoursPerWeek: 6,
  isElective: false,
  isActive: true
},
{
  id: 'sub-3',
  name: 'Biology',
  code: 'BIO101',
  description: 'Life Sciences',
  type: 'both',
  credits: 4,
  hoursPerWeek: 6,
  isElective: false,
  isActive: true
},
{
  id: 'sub-4',
  name: 'Mathematics',
  code: 'MAT101',
  description: 'Advanced Mathematics',
  type: 'theory',
  credits: 5,
  hoursPerWeek: 7,
  isElective: false,
  isActive: true
},
{
  id: 'sub-5',
  name: 'Statistics',
  code: 'STA101',
  description: 'Statistical Methods',
  type: 'theory',
  credits: 3,
  hoursPerWeek: 4,
  isElective: true,
  isActive: true
},
{
  id: 'sub-6',
  name: 'English',
  code: 'ENG101',
  description: 'English Language & Literature',
  type: 'theory',
  credits: 3,
  hoursPerWeek: 5,
  isElective: false,
  isActive: true
},
{
  id: 'sub-7',
  name: 'Hindi',
  code: 'HIN101',
  description: 'Hindi Language',
  type: 'theory',
  credits: 3,
  hoursPerWeek: 4,
  isElective: false,
  isActive: true
},
{
  id: 'sub-8',
  name: 'Sanskrit',
  code: 'SAN101',
  description: 'Sanskrit Language',
  type: 'theory',
  credits: 2,
  hoursPerWeek: 3,
  isElective: true,
  isActive: true
},
{
  id: 'sub-9',
  name: 'History',
  code: 'HIS101',
  description: 'World History',
  type: 'theory',
  credits: 3,
  hoursPerWeek: 4,
  isElective: false,
  isActive: true
},
{
  id: 'sub-10',
  name: 'Geography',
  code: 'GEO101',
  description: 'Physical & Human Geography',
  type: 'theory',
  credits: 3,
  hoursPerWeek: 4,
  isElective: false,
  isActive: true
},
{
  id: 'sub-11',
  name: 'Civics',
  code: 'CIV101',
  description: 'Political Science & Civics',
  type: 'theory',
  credits: 2,
  hoursPerWeek: 3,
  isElective: false,
  isActive: true
},
{
  id: 'sub-12',
  name: 'Computer Science',
  code: 'CS101',
  description: 'Programming & Algorithms',
  type: 'both',
  credits: 4,
  hoursPerWeek: 6,
  isElective: true,
  isActive: true
},
{
  id: 'sub-13',
  name: 'Economics',
  code: 'ECO101',
  description: 'Micro & Macro Economics',
  type: 'theory',
  credits: 3,
  hoursPerWeek: 4,
  isElective: true,
  isActive: true
},
{
  id: 'sub-14',
  name: 'Physical Education',
  code: 'PE101',
  description: 'Sports & Fitness',
  type: 'practical',
  credits: 2,
  hoursPerWeek: 4,
  isElective: false,
  isActive: true
},
{
  id: 'sub-15',
  name: 'Art & Craft',
  code: 'ART101',
  description: 'Visual Arts',
  type: 'practical',
  credits: 2,
  hoursPerWeek: 3,
  isElective: true,
  isActive: true
}];


const mockStaff: StaffMember[] = [
{
  id: 'staff-1',
  name: 'Dr. Anil Verma',
  designation: 'Professor',
  email: 'anil.verma@school.edu',
  phone: '+91-9876543210',
  qualification: 'Ph.D. Physics',
  experience: 18,
  joiningDate: '2010-06-15',
  subjects: ['PHY101'],
  workload: 24,
  isHOD: true
},
{
  id: 'staff-2',
  name: 'Mrs. Priya Mehta',
  designation: 'Associate Professor',
  email: 'priya.mehta@school.edu',
  phone: '+91-9876543211',
  qualification: 'Ph.D. Chemistry',
  experience: 15,
  joiningDate: '2012-08-20',
  subjects: ['CHE101'],
  workload: 22,
  isHOD: false
},
{
  id: 'staff-3',
  name: 'Dr. Rajesh Kumar',
  designation: 'Assistant Professor',
  email: 'rajesh.kumar@school.edu',
  phone: '+91-9876543212',
  qualification: 'Ph.D. Biology',
  experience: 12,
  joiningDate: '2014-07-10',
  subjects: ['BIO101'],
  workload: 20,
  isHOD: false
},
{
  id: 'staff-4',
  name: 'Mr. Suresh Sharma',
  designation: 'Professor',
  email: 'suresh.sharma@school.edu',
  phone: '+91-9876543213',
  qualification: 'M.Sc. Mathematics',
  experience: 20,
  joiningDate: '2008-05-01',
  subjects: ['MAT101', 'STA101'],
  workload: 28,
  isHOD: true
},
{
  id: 'staff-5',
  name: 'Mrs. Lakshmi Iyer',
  designation: 'Professor',
  email: 'lakshmi.iyer@school.edu',
  phone: '+91-9876543214',
  qualification: 'M.A. English',
  experience: 22,
  joiningDate: '2006-04-15',
  subjects: ['ENG101'],
  workload: 20,
  isHOD: true
},
{
  id: 'staff-6',
  name: 'Mr. Amit Patel',
  designation: 'Associate Professor',
  email: 'amit.patel@school.edu',
  phone: '+91-9876543215',
  qualification: 'M.A. Hindi',
  experience: 14,
  joiningDate: '2013-06-20',
  subjects: ['HIN101'],
  workload: 16,
  isHOD: false
},
{
  id: 'staff-7',
  name: 'Dr. Sunita Das',
  designation: 'Assistant Professor',
  email: 'sunita.das@school.edu',
  phone: '+91-9876543216',
  qualification: 'Ph.D. Sanskrit',
  experience: 10,
  joiningDate: '2016-08-01',
  subjects: ['SAN101'],
  workload: 12,
  isHOD: false
},
{
  id: 'staff-8',
  name: 'Mr. Mohammed Khan',
  designation: 'Professor',
  email: 'mohammed.khan@school.edu',
  phone: '+91-9876543217',
  qualification: 'M.A. History',
  experience: 19,
  joiningDate: '2009-07-10',
  subjects: ['HIS101'],
  workload: 16,
  isHOD: true
},
{
  id: 'staff-9',
  name: 'Mrs. Kavita Singh',
  designation: 'Associate Professor',
  email: 'kavita.singh@school.edu',
  phone: '+91-9876543218',
  qualification: 'M.Sc. Geography',
  experience: 13,
  joiningDate: '2014-09-15',
  subjects: ['GEO101'],
  workload: 16,
  isHOD: false
},
{
  id: 'staff-10',
  name: 'Mr. Ravi Malhotra',
  designation: 'Assistant Professor',
  email: 'ravi.malhotra@school.edu',
  phone: '+91-9876543219',
  qualification: 'M.A. Political Science',
  experience: 8,
  joiningDate: '2018-06-01',
  subjects: ['CIV101'],
  workload: 12,
  isHOD: false
},
{
  id: 'staff-11',
  name: 'Dr. Neha Reddy',
  designation: 'Associate Professor',
  email: 'neha.reddy@school.edu',
  phone: '+91-9876543220',
  qualification: 'Ph.D. Computer Science',
  experience: 11,
  joiningDate: '2015-08-20',
  subjects: ['CS101'],
  workload: 24,
  isHOD: false
},
{
  id: 'staff-12',
  name: 'Mr. Vikram Rao',
  designation: 'Assistant Professor',
  email: 'vikram.rao@school.edu',
  phone: '+91-9876543221',
  qualification: 'M.A. Economics',
  experience: 9,
  joiningDate: '2017-07-15',
  subjects: ['ECO101'],
  workload: 16,
  isHOD: false
}];


const initialDepartments: Department[] = [
{
  id: 'dept-1',
  name: 'Science',
  code: 'SCI',
  head: 'Dr. Anil Verma',
  headId: 'staff-1',
  description: 'Department of Science - Physics, Chemistry, and Biology',
  subjects: mockSubjects.filter((s) => ['PHY101', 'CHE101', 'BIO101'].includes(s.code)),
  staff: mockStaff.filter((s) => ['staff-1', 'staff-2', 'staff-3'].includes(s.id)),
  establishedDate: '2005-04-01',
  budget: 5000000,
  location: 'Science Block, 2nd Floor',
  email: 'science@school.edu',
  phone: '+91-9876543200',
  isActive: true,
  createdAt: '2024-01-15T10:00:00',
  modifiedAt: '2024-03-20T14:30:00'
},
{
  id: 'dept-2',
  name: 'Mathematics',
  code: 'MATH',
  head: 'Mr. Suresh Sharma',
  headId: 'staff-4',
  description: 'Department of Mathematics and Statistics',
  subjects: mockSubjects.filter((s) => ['MAT101', 'STA101'].includes(s.code)),
  staff: mockStaff.filter((s) => ['staff-4'].includes(s.id)),
  establishedDate: '2005-04-01',
  budget: 2000000,
  location: 'Academic Block A, 1st Floor',
  email: 'maths@school.edu',
  phone: '+91-9876543201',
  isActive: true,
  createdAt: '2024-01-15T10:00:00',
  modifiedAt: '2024-03-18T11:20:00'
},
{
  id: 'dept-3',
  name: 'Languages',
  code: 'LANG',
  head: 'Mrs. Lakshmi Iyer',
  headId: 'staff-5',
  description: 'Department of Languages - English, Hindi, and Sanskrit',
  subjects: mockSubjects.filter((s) => ['ENG101', 'HIN101', 'SAN101'].includes(s.code)),
  staff: mockStaff.filter((s) => ['staff-5', 'staff-6', 'staff-7'].includes(s.id)),
  establishedDate: '2005-04-01',
  budget: 1500000,
  location: 'Academic Block B, Ground Floor',
  email: 'languages@school.edu',
  phone: '+91-9876543202',
  isActive: true,
  createdAt: '2024-01-15T10:00:00',
  modifiedAt: '2024-03-22T09:45:00'
},
{
  id: 'dept-4',
  name: 'Social Studies',
  code: 'SS',
  head: 'Mr. Mohammed Khan',
  headId: 'staff-8',
  description: 'Department of Social Studies - History, Geography, and Civics',
  subjects: mockSubjects.filter((s) => ['HIS101', 'GEO101', 'CIV101'].includes(s.code)),
  staff: mockStaff.filter((s) => ['staff-8', 'staff-9', 'staff-10'].includes(s.id)),
  establishedDate: '2005-04-01',
  budget: 1800000,
  location: 'Academic Block C, 1st Floor',
  email: 'socialstudies@school.edu',
  phone: '+91-9876543203',
  isActive: true,
  createdAt: '2024-01-15T10:00:00',
  modifiedAt: '2024-03-19T16:10:00'
},
{
  id: 'dept-5',
  name: 'Computer Science',
  code: 'CS',
  head: 'Dr. Neha Reddy',
  headId: 'staff-11',
  description: 'Department of Computer Science and Information Technology',
  subjects: mockSubjects.filter((s) => ['CS101'].includes(s.code)),
  staff: mockStaff.filter((s) => ['staff-11'].includes(s.id)),
  establishedDate: '2010-06-01',
  budget: 3500000,
  location: 'IT Block, 3rd Floor',
  email: 'cs@school.edu',
  phone: '+91-9876543204',
  isActive: true,
  createdAt: '2024-01-15T10:00:00',
  modifiedAt: '2024-03-21T13:25:00'
},
{
  id: 'dept-6',
  name: 'Commerce',
  code: 'COM',
  head: 'Mr. Vikram Rao',
  headId: 'staff-12',
  description: 'Department of Commerce and Economics',
  subjects: mockSubjects.filter((s) => ['ECO101'].includes(s.code)),
  staff: mockStaff.filter((s) => ['staff-12'].includes(s.id)),
  establishedDate: '2008-04-01',
  budget: 2200000,
  location: 'Academic Block A, 2nd Floor',
  email: 'commerce@school.edu',
  phone: '+91-9876543205',
  isActive: true,
  createdAt: '2024-01-15T10:00:00',
  modifiedAt: '2024-03-17T10:55:00'
}];


const CLASS_OPTIONS = Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`);
const DEPARTMENT_TYPES: DepartmentType[] = ['Academic', 'Administrative', 'Support', 'Co-curricular'];
const SUBJECT_CATEGORIES: SubjectCategory[] = ['Main / Core', 'Optional / Elective', 'Language', 'Activity / Skill'];
const inferSubjectCategory = (subject: Subject): SubjectCategory => {
  const name = subject.name.toLowerCase();
  if (/english|hindi|sanskrit|gujarati|language/.test(name)) return 'Language';
  if (/physical education|art|craft|music|sport|activity/.test(name)) return 'Activity / Skill';
  return subject.isElective ? 'Optional / Elective' : 'Main / Core';
};
const createSubjectRecord = (subject: Subject, departmentId = ''): SubjectRecord => {
  const category = inferSubjectCategory(subject);
  const languagePosition = subject.name === 'English' ? 'First Language' : subject.name === 'Hindi' ? 'Second Language' : subject.name === 'Sanskrit' ? 'Third Language' : '';
  return {
    ...subject, departmentId, shortName: subject.name.length > 18 ? subject.name.slice(0, 18) : subject.name,
    boardCode: subject.code, classLevels: ['Class 9', 'Class 10'], category,
    isCompulsory: !subject.isElective && category !== 'Activity / Skill',
    hasPractical: subject.type !== 'theory',
    practicalType: subject.type === 'both' ? 'Lab + Practical' : subject.type === 'practical' ? 'Practical' : 'Not applicable',
    theoryPeriods: subject.type === 'practical' ? 0 : subject.hoursPerWeek,
    practicalPeriods: subject.type === 'theory' ? 0 : Math.max(1, Math.floor(subject.hoursPerWeek / 2)),
    languagePosition
  };
};
const initialSubjectCatalog: SubjectRecord[] = (() => {
  const records = new Map<string, SubjectRecord>();
  initialDepartments.forEach((department) => department.subjects.forEach((subject) => records.set(subject.id, createSubjectRecord(subject, department.id))));
  mockSubjects.forEach((subject) => { if (!records.has(subject.id)) records.set(subject.id, createSubjectRecord(subject)); });
  return Array.from(records.values());
})();
const toDepartmentSubject = (subject: SubjectRecord): Subject => ({
  id: subject.id, name: subject.name, code: subject.code, description: subject.description,
  type: subject.type, credits: subject.credits, hoursPerWeek: subject.hoursPerWeek,
  isElective: subject.isElective, isActive: subject.isActive
});
const emptyDepartmentForm = (): DepartmentFormState => ({
  name: '', code: '', description: '', departmentType: 'Academic',
  applicableClasses: ['Class 9', 'Class 10'], establishedDate: new Date().toISOString().slice(0, 10),
  budget: '', staffRoom: '', primaryBuilding: '', displayOrder: '1', hodId: '',
  hodDesignation: '', leaveApproval: 'HOD', staffIds: [], isActive: true
});
const emptySubjectForm = (): SubjectFormState => ({
  name: '', shortName: '', code: '', boardCode: '', description: '', departmentId: '',
  category: 'Main / Core', classLevels: ['Class 9', 'Class 10'], type: 'theory',
  credits: '3', hoursPerWeek: '4', theoryPeriods: '4', practicalPeriods: '0',
  hasPractical: false, practicalType: 'Not applicable', languagePosition: '', isActive: true
});

// ==================== MAIN COMPONENT ====================
export function DepartmentSubjectGroupingSetup() {
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [subjectCatalog, setSubjectCatalog] = useState<SubjectRecord[]>(initialSubjectCatalog);
  const [activeTab, setActiveTab] = useState<SetupTab>('Departments');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [departmentForm, setDepartmentForm] = useState<DepartmentFormState>(emptyDepartmentForm);
  const [departmentPendingDelete, setDepartmentPendingDelete] = useState<Department | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectForm, setSubjectForm] = useState<SubjectFormState>(emptySubjectForm);
  const [subjectPendingDelete, setSubjectPendingDelete] = useState<SubjectRecord | null>(null);

  const [departmentSearch, setDepartmentSearch] = useState('');
  const [departmentStatusFilter, setDepartmentStatusFilter] = useState('all');
  const [departmentTypeFilter, setDepartmentTypeFilter] = useState('all');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectDepartmentFilter, setSubjectDepartmentFilter] = useState('all');
  const [subjectClassFilter, setSubjectClassFilter] = useState('all');
  const [subjectCategoryFilter, setSubjectCategoryFilter] = useState('all');
  const [subjectStatusFilter, setSubjectStatusFilter] = useState('all');

  const showNotification = useCallback((type: Notification['type'], message: string) => {
    setNotification({ type, message });
    window.setTimeout(() => setNotification(null), 3500);
  }, []);
  const departmentSubjectCount = (id: string) => subjectCatalog.filter((subject) => subject.departmentId === id).length;
  const getDepartmentName = (id: string) => departments.find((department) => department.id === id)?.name || 'Unassigned';

  const filteredDepartments = useMemo(() => departments.filter((department) => {
    const query = departmentSearch.trim().toLowerCase();
    const matchesSearch = !query || [department.name, department.code, department.head].some((value) => value.toLowerCase().includes(query));
    const matchesStatus = departmentStatusFilter === 'all' || (departmentStatusFilter === 'active' ? department.isActive : !department.isActive);
    const matchesType = departmentTypeFilter === 'all' || (department.departmentType || 'Academic') === departmentTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }), [departments, departmentSearch, departmentStatusFilter, departmentTypeFilter]);
  const filteredSubjects = useMemo(() => subjectCatalog.filter((subject) => {
    const query = subjectSearch.trim().toLowerCase();
    const matchesSearch = !query || [subject.name, subject.shortName, subject.code, subject.boardCode].some((value) => value.toLowerCase().includes(query));
    const matchesDepartment = subjectDepartmentFilter === 'all' || subject.departmentId === subjectDepartmentFilter;
    const matchesClass = subjectClassFilter === 'all' || subject.classLevels.length === 0 || subject.classLevels.includes(subjectClassFilter);
    const matchesCategory = subjectCategoryFilter === 'all' || subject.category === subjectCategoryFilter;
    const matchesStatus = subjectStatusFilter === 'all' || (subjectStatusFilter === 'active' ? subject.isActive : !subject.isActive);
    return matchesSearch && matchesDepartment && matchesClass && matchesCategory && matchesStatus;
  }), [subjectCatalog, subjectSearch, subjectDepartmentFilter, subjectClassFilter, subjectCategoryFilter, subjectStatusFilter]);

  const latestUpdate = departments.length ? new Date(Math.max(...departments.map((department) => new Date(department.modifiedAt).getTime()))).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const classSelectOptions = CLASS_OPTIONS.map((value) => ({ value, label: value }));
  const departmentSelectOptions = [{ value: 'all', label: 'All departments' }, ...departments.map((department) => ({ value: department.id, label: `${department.name} (${department.code})` }))];
  const categorySelectOptions = [{ value: 'all', label: 'All categories' }, ...SUBJECT_CATEGORIES.map((value) => ({ value, label: value }))];
  const statusSelectOptions = [{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }];

  const updateSubjectCatalog = (next: SubjectRecord[]) => {
    setSubjectCatalog(next);
    setDepartments((previous) => previous.map((department) => ({ ...department, subjects: next.filter((subject) => subject.departmentId === department.id).map(toDepartmentSubject) })));
  };
  const openDepartmentForm = (department?: Department) => {
    if (!department) {
      setEditingDepartmentId(null);
      setDepartmentForm(emptyDepartmentForm());
    } else {
      setEditingDepartmentId(department.id);
      setDepartmentForm({
        name: department.name, code: department.code, description: department.description,
        departmentType: department.departmentType || 'Academic',
        applicableClasses: department.applicableClasses?.length ? department.applicableClasses : ['Class 9', 'Class 10'],
        establishedDate: department.establishedDate, budget: String(department.budget || 0),
        staffRoom: department.staffRoom || '', primaryBuilding: department.primaryBuilding || department.location,
        displayOrder: String(department.displayOrder || 1), hodId: department.headId,
        hodDesignation: department.hodDesignation || mockStaff.find((staff) => staff.id === department.headId)?.designation || '',
        leaveApproval: department.leaveApproval || 'HOD', staffIds: department.staff.map((staff) => staff.id), isActive: department.isActive
      });
    }
    setShowDepartmentModal(true);
  };
  const saveDepartment = () => {
    if (!departmentForm.name.trim() || !departmentForm.code.trim() || !departmentForm.hodId) {
      showNotification('error', 'Department name, code, and HOD are required.'); return;
    }
    const code = departmentForm.code.trim().toUpperCase();
    if (departments.some((department) => department.code.toUpperCase() === code && department.id !== editingDepartmentId)) {
      showNotification('error', 'That department code is already in use.'); return;
    }
    const head = mockStaff.find((staff) => staff.id === departmentForm.hodId);
    if (!head) { showNotification('error', 'Select a valid Head of Department.'); return; }
    const previous = departments.find((department) => department.id === editingDepartmentId);
    const now = new Date().toISOString();
    const staff = Array.from(new Set([...departmentForm.staffIds, head.id])).map((id) => mockStaff.find((item) => item.id === id)).filter((item): item is StaffMember => Boolean(item));
    const saved: Department = {
      id: editingDepartmentId || `dept-${Date.now()}`, name: departmentForm.name.trim(), code,
      head: head.name, headId: head.id, description: departmentForm.description.trim(), subjects: previous?.subjects || [], staff,
      establishedDate: departmentForm.establishedDate || now.slice(0, 10), budget: Number(departmentForm.budget) || 0,
      location: [departmentForm.primaryBuilding, departmentForm.staffRoom].filter(Boolean).join(' · '),
      email: head.email, phone: head.phone, isActive: departmentForm.isActive,
      createdAt: previous?.createdAt || now, modifiedAt: now,
      departmentType: departmentForm.departmentType, applicableClasses: departmentForm.applicableClasses,
      hodDesignation: departmentForm.hodDesignation || head.designation, leaveApproval: departmentForm.leaveApproval,
      staffRoom: departmentForm.staffRoom, primaryBuilding: departmentForm.primaryBuilding, displayOrder: Number(departmentForm.displayOrder) || 1
    };
    setDepartments((previousDepartments) => editingDepartmentId ? previousDepartments.map((department) => department.id === editingDepartmentId ? saved : department) : [...previousDepartments, saved]);
    setShowDepartmentModal(false); setEditingDepartmentId(null); setDepartmentForm(emptyDepartmentForm());
    showNotification('success', `Department “${saved.name}” saved.`);
  };
  const requestDeleteDepartment = (department: Department) => {
    if (departmentSubjectCount(department.id) > 0) { showNotification('warning', 'Remove or reassign all associated subjects before deleting this department.'); return; }
    setDepartmentPendingDelete(department);
  };
  const confirmDeleteDepartment = () => {
    if (!departmentPendingDelete) return;
    if (departmentSubjectCount(departmentPendingDelete.id) > 0) { showNotification('warning', 'A department with associated subjects cannot be deleted.'); setDepartmentPendingDelete(null); return; }
    setDepartments((previous) => previous.filter((department) => department.id !== departmentPendingDelete.id));
    setDepartmentPendingDelete(null); showNotification('success', 'Department deleted.');
  };
  const toggleDepartmentStatus = (department: Department) => setDepartments((previous) => previous.map((item) => item.id === department.id ? { ...item, isActive: !item.isActive, modifiedAt: new Date().toISOString() } : item));
  const showDepartmentSubjects = (department: Department) => { setSubjectDepartmentFilter(department.id); setActiveTab('Subjects'); };

  const openSubjectForm = (subject?: SubjectRecord) => {
    if (!subject) {
      setEditingSubjectId(null);
      setSubjectForm(emptySubjectForm());
    } else {
      setEditingSubjectId(subject.id);
      setSubjectForm({
        name: subject.name, shortName: subject.shortName, code: subject.code, boardCode: subject.boardCode,
        description: subject.description, departmentId: subject.departmentId, category: subject.category,
        classLevels: subject.classLevels, type: subject.type, credits: String(subject.credits),
        hoursPerWeek: String(subject.hoursPerWeek), theoryPeriods: String(subject.theoryPeriods),
        practicalPeriods: String(subject.practicalPeriods), hasPractical: subject.hasPractical,
        practicalType: subject.practicalType, languagePosition: subject.languagePosition, isActive: subject.isActive
      });
    }
    setShowSubjectModal(true);
  };
  const saveSubject = () => {
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) {
      showNotification('error', 'Subject name and subject code are required.'); return;
    }
    const code = subjectForm.code.trim().toUpperCase();
    if (subjectCatalog.some((subject) => subject.code.toUpperCase() === code && subject.id !== editingSubjectId)) {
      showNotification('error', 'That subject code is already in use.'); return;
    }
    const saved: SubjectRecord = {
      id: editingSubjectId || `sub-${Date.now()}`, name: subjectForm.name.trim(),
      shortName: subjectForm.shortName.trim() || subjectForm.name.trim().slice(0, 18), code,
      boardCode: subjectForm.boardCode.trim() || code, description: subjectForm.description.trim(),
      departmentId: subjectForm.departmentId, category: subjectForm.category, classLevels: subjectForm.classLevels,
      type: subjectForm.type, credits: Number(subjectForm.credits) || 0, hoursPerWeek: Number(subjectForm.hoursPerWeek) || 0,
      theoryPeriods: Number(subjectForm.theoryPeriods) || 0,
      practicalPeriods: subjectForm.hasPractical ? Number(subjectForm.practicalPeriods) || 0 : 0,
      hasPractical: subjectForm.hasPractical, practicalType: subjectForm.hasPractical ? subjectForm.practicalType : 'Not applicable',
      languagePosition: subjectForm.category === 'Language' ? subjectForm.languagePosition : '',
      isCompulsory: subjectForm.category === 'Main / Core' || subjectForm.category === 'Language',
      isElective: subjectForm.category === 'Optional / Elective', isActive: subjectForm.isActive
    };
    updateSubjectCatalog(editingSubjectId ? subjectCatalog.map((item) => item.id === editingSubjectId ? saved : item) : [...subjectCatalog, saved]);
    setShowSubjectModal(false); setEditingSubjectId(null); setSubjectForm(emptySubjectForm());
    showNotification('success', `Subject “${saved.name}” saved.`);
  };
  const confirmDeleteSubject = () => {
    if (!subjectPendingDelete) return;
    const subjectId = subjectPendingDelete.id;
    updateSubjectCatalog(subjectCatalog.filter((subject) => subject.id !== subjectId));
    setSubjectPendingDelete(null); showNotification('success', 'Subject deleted from the catalogue.');
  };
  const toggleSubjectStatus = (subject: SubjectRecord) => updateSubjectCatalog(subjectCatalog.map((item) => item.id === subject.id ? { ...item, isActive: !item.isActive } : item));

  const toggleFormClass = (className: string, form: 'department' | 'subject') => {
    if (form === 'department') {
      setDepartmentForm((previous) => ({ ...previous, applicableClasses: previous.applicableClasses.includes(className) ? previous.applicableClasses.filter((value) => value !== className) : [...previous.applicableClasses, className] }));
    } else {
      setSubjectForm((previous) => ({ ...previous, classLevels: previous.classLevels.includes(className) ? previous.classLevels.filter((value) => value !== className) : [...previous.classLevels, className] }));
    }
  };
  const toggleDepartmentStaff = (staffId: string) => setDepartmentForm((previous) => ({ ...previous, staffIds: previous.staffIds.includes(staffId) ? previous.staffIds.filter((value) => value !== staffId) : [...previous.staffIds, staffId] }));
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ departments, subjects: subjectCatalog }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url;
    link.download = `department-subject-setup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click(); URL.revokeObjectURL(url); showNotification('success', 'Setup exported.');
  };
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'));
        if (!Array.isArray(data.departments) || !Array.isArray(data.subjects)) throw new Error('Invalid setup file');
        setDepartments(data.departments as Department[]);
        setSubjectCatalog(data.subjects as SubjectRecord[]);
        showNotification('success', 'Setup imported.');
      } catch {
        showNotification('error', 'Could not import this setup file. Choose a valid exported JSON file.');
      }
      input.value = '';
    };
    reader.readAsText(file);
  };

  const departmentColumns = [
    { key: 'department', header: 'Department', render: (department: Department) => <div className="min-w-[180px]"><div className="font-semibold text-gray-900">{department.name}</div><div className="mt-0.5 text-xs text-gray-500">{department.code} · {department.description}</div></div> },
    { key: 'type', header: 'Type', render: (department: Department) => <Badge variant="secondary">{department.departmentType || 'Academic'}</Badge> },
    { key: 'hod', header: 'HOD / Contact', render: (department: Department) => {
      const head = mockStaff.find((staff) => staff.id === department.headId);
      return <div className="min-w-[170px]"><div className="font-medium text-gray-900">{department.head}</div><div className="mt-1 flex items-center gap-1 text-xs text-gray-500"><Mail className="h-3 w-3" />{head?.email || department.email}</div><div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500"><Phone className="h-3 w-3" />{head?.phone || department.phone}</div></div>;
    }},
    { key: 'classes', header: 'Applicable Classes', render: (department: Department) => {
      const classes = department.applicableClasses?.length ? department.applicableClasses : ['Class 9', 'Class 10'];
      return <div className="max-w-[190px] text-xs text-gray-600">{classes.slice(0, 4).join(', ')}{classes.length > 4 ? ` +${classes.length - 4}` : ''}</div>;
    }},
    { key: 'subjects', header: 'Subjects', render: (department: Department) => <span className="font-semibold">{departmentSubjectCount(department.id)}</span> },
    { key: 'staff', header: 'Staff', render: (department: Department) => <span className="font-semibold">{department.staff.length}</span> },
    { key: 'status', header: 'Status', render: (department: Department) => <button onClick={() => toggleDepartmentStatus(department)} title="Toggle department status"><Badge variant={department.isActive ? 'success' : 'secondary'}>{department.isActive ? 'Active' : 'Inactive'}</Badge></button> },
    { key: 'actions', header: 'Actions', render: (department: Department) => <div className="flex items-center gap-1">
      <Button variant="ghost" size="xs" title="View subjects" onClick={() => showDepartmentSubjects(department)}><BookOpen className="h-4 w-4" /></Button>
      <Button variant="ghost" size="xs" title="Edit department" onClick={() => openDepartmentForm(department)}><Edit2 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="xs" title={departmentSubjectCount(department.id) ? 'Remove associated subjects before deleting' : 'Delete department'} onClick={() => requestDeleteDepartment(department)} disabled={departmentSubjectCount(department.id) > 0}><Trash2 className="h-4 w-4 text-red-500" /></Button>
      <Button variant="ghost" size="xs" title={expandedDepartments.has(department.id) ? 'Collapse details' : 'Expand details'} onClick={() => setExpandedDepartments((previous) => { const next = new Set(previous); next.has(department.id) ? next.delete(department.id) : next.add(department.id); return next; })}>{expandedDepartments.has(department.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</Button>
    </div> }
  ];

  const subjectColumns = [
    { key: 'subject', header: 'Subject', render: (subject: SubjectRecord) => <div className="min-w-[150px]"><div className="font-semibold text-gray-900">{subject.name}</div><div className="text-xs text-gray-500">{subject.shortName}</div></div> },
    { key: 'code', header: 'Subject / Board Code', render: (subject: SubjectRecord) => <div className="text-sm font-medium">{subject.code}<div className="text-xs text-gray-500">Board: {subject.boardCode}</div></div> },
    { key: 'department', header: 'Department', render: (subject: SubjectRecord) => getDepartmentName(subject.departmentId) },
    { key: 'classes', header: 'Applicable Classes', render: (subject: SubjectRecord) => <div className="max-w-[150px] text-xs text-gray-600">{subject.classLevels.length ? subject.classLevels.join(', ') : 'All classes'}</div> },
    { key: 'category', header: 'Category', render: (subject: SubjectRecord) => <Badge variant={subject.category === 'Optional / Elective' ? 'info' : subject.category === 'Activity / Skill' ? 'warning' : 'secondary'}>{subject.category}</Badge> },
    { key: 'status', header: 'Status', render: (subject: SubjectRecord) => <button onClick={() => toggleSubjectStatus(subject)} title="Toggle subject status"><Badge variant={subject.isActive ? 'success' : 'secondary'}>{subject.isActive ? 'Active' : 'Inactive'}</Badge></button> },
    { key: 'actions', header: 'Actions', render: (subject: SubjectRecord) => <div className="flex items-center gap-1"><Button variant="ghost" size="xs" title="Edit subject" onClick={() => openSubjectForm(subject)}><Edit2 className="h-4 w-4" /></Button><Button variant="ghost" size="xs" title="Delete subject" onClick={() => setSubjectPendingDelete(subject)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div> }
  ];



  return (
    <div className="space-y-6 p-6">
      {notification && (
        <div className={`fixed right-4 top-4 z-50 flex min-w-[280px] items-center gap-2 rounded-lg border p-4 shadow-lg ${notification.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : notification.type === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' : notification.type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-blue-200 bg-blue-50 text-blue-800'}`}>
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="flex-1 text-sm">{notification.message}</span>
          <button onClick={() => setNotification(null)} aria-label="Dismiss notification"><X className="h-4 w-4" /></button>
        </div>
      )}

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Building2 className="h-6 w-6" /></div>
          <div><h1 className="text-2xl font-bold text-gray-900">Department &amp; Subject Setup</h1><p className="mt-1 text-sm text-gray-500">Manage academic departments and subject catalogue details.</p></div>
        </div>
        <div className="flex flex-wrap gap-2"><input id="department-setup-import" type="file" accept=".json,application/json" className="hidden" onChange={handleImport} /><Button variant="outline" onClick={() => document.getElementById('department-setup-import')?.click()}><Upload className="h-4 w-4" />Import Setup</Button><Button variant="outline" onClick={handleExport}><Download className="h-4 w-4" />Export Setup</Button><Button onClick={() => openDepartmentForm()}><Plus className="h-4 w-4" />Add Department</Button></div>
      </header>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Institute</span><span className="font-medium text-gray-900">Sunshine Public School</span></div>
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Academic Year</span><span className="font-medium text-gray-900">2025–26</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /><span className="text-gray-500">Last Updated</span><span className="font-medium text-gray-900">{latestUpdate}</span></div>
        </div>
      </Card>

      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p><span className="font-semibold">Setup note:</span> Define departments and subject details first. A department can only be deleted after its associated subjects have been moved or removed.</p></div>

      <nav className="flex flex-wrap gap-1 border-b border-gray-200" role="tablist" aria-label="Department and subject setup">
        {(['Departments', 'Subjects'] as SetupTab[]).map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>{tab}</button>)}
      </nav>

      {activeTab === 'Departments' && (
        <Card title="Department Directory">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search departments, code, or HOD..." value={departmentSearch} onChange={(event) => setDepartmentSearch(event.target.value)} className="pl-10" /></div>
            <Select options={statusSelectOptions} value={departmentStatusFilter} onChange={(event) => setDepartmentStatusFilter(event.target.value)} className="w-40" />
            <Select options={[{ value: 'all', label: 'All department types' }, ...DEPARTMENT_TYPES.map((type) => ({ value: type, label: type }))]} value={departmentTypeFilter} onChange={(event) => setDepartmentTypeFilter(event.target.value)} className="w-52" />
          </div>
          <Table columns={departmentColumns} data={filteredDepartments} emptyMessage="No departments match the selected filters." expandedContent={(department: Department) => expandedDepartments.has(department.id) ? (
            <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 md:grid-cols-3">
              <div className="rounded-lg border bg-white p-3"><div className="mb-2 text-xs font-semibold uppercase text-gray-500">Operational Details</div><div className="space-y-1 text-sm"><div>Established: {department.establishedDate}</div><div>Building: {department.primaryBuilding || department.location || '—'}</div><div>Staff room: {department.staffRoom || '—'}</div><div>Annual budget: ₹{department.budget.toLocaleString('en-IN')}</div></div></div>
              <div className="rounded-lg border bg-white p-3"><div className="mb-2 text-xs font-semibold uppercase text-gray-500">Leadership</div><div className="space-y-1 text-sm"><div>HOD: {department.head}</div><div>Designation: {department.hodDesignation || mockStaff.find((staff) => staff.id === department.headId)?.designation || '—'}</div><div>Leave approval: {department.leaveApproval || 'HOD'}</div><div>{department.email}</div><div>{department.phone}</div></div></div>
              <div className="rounded-lg border bg-white p-3"><div className="mb-2 text-xs font-semibold uppercase text-gray-500">Staff &amp; Classes</div><div className="mb-2 flex flex-wrap gap-1">{(department.applicableClasses?.length ? department.applicableClasses : ['Class 9', 'Class 10']).map((className) => <Badge key={className} variant="secondary">{className}</Badge>)}</div><div className="text-sm">{department.staff.map((staff) => staff.name).join(', ') || 'No staff assigned'}</div><div className="mt-1 text-xs text-gray-500">{departmentSubjectCount(department.id)} subjects · order {department.displayOrder || 1}</div></div>
            </div>
          ) : null} />
        </Card>
      )}

      {activeTab === 'Subjects' && (
        <Card title="Subject Catalogue">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[210px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><Input placeholder="Search subject, short name, or code..." value={subjectSearch} onChange={(event) => setSubjectSearch(event.target.value)} className="pl-10" /></div>
            <Select options={departmentSelectOptions} value={subjectDepartmentFilter} onChange={(event) => setSubjectDepartmentFilter(event.target.value)} className="w-48" />
            <Select options={[{ value: 'all', label: 'All classes' }, ...classSelectOptions]} value={subjectClassFilter} onChange={(event) => setSubjectClassFilter(event.target.value)} className="w-36" />
            <Select options={categorySelectOptions} value={subjectCategoryFilter} onChange={(event) => setSubjectCategoryFilter(event.target.value)} className="w-48" />
            <Select options={statusSelectOptions} value={subjectStatusFilter} onChange={(event) => setSubjectStatusFilter(event.target.value)} className="w-36" />
            <Button onClick={() => openSubjectForm()}><Plus className="h-4 w-4" />Add Subject</Button>
          </div>
          <div className="mb-3 flex items-center gap-2 text-xs text-gray-500"><Filter className="h-3.5 w-3.5" />{filteredSubjects.length} subjects shown · filter by department, class, category, and status.</div>
          <Table columns={subjectColumns} data={filteredSubjects} emptyMessage="No subjects match the selected filters." />
        </Card>
      )}

            {showDepartmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4"><div><h2 className="text-xl font-bold">{editingDepartmentId ? 'Edit Department' : 'Add Department'}</h2><p className="text-sm text-gray-500">Define department identity, leadership, operations, staff, and classes.</p></div><button onClick={() => setShowDepartmentModal(false)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-2">
              <Card title="1. Department Details">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Department Name *" value={departmentForm.name} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, name: event.target.value }))} placeholder="e.g. Science" />
                  <Input label="Department Code *" value={departmentForm.code} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, code: event.target.value.toUpperCase() }))} placeholder="e.g. SCI" />
                  <Select label="Department Type" options={DEPARTMENT_TYPES.map((type) => ({ value: type, label: type }))} value={departmentForm.departmentType} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, departmentType: event.target.value as DepartmentType }))} />
                  <Input label="Display Order" type="number" min="1" value={departmentForm.displayOrder} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, displayOrder: event.target.value }))} />
                  <div className="md:col-span-2"><Input label="Description" value={departmentForm.description} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, description: event.target.value }))} placeholder="Department scope and responsibilities" /></div>
                </div>
              </Card>

              <Card title="2. Operational Details">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Established Date" type="date" value={departmentForm.establishedDate} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, establishedDate: event.target.value }))} />
                  <Input label="Annual Budget (₹)" type="number" min="0" value={departmentForm.budget} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, budget: event.target.value }))} placeholder="0" />
                  <Input label="Primary Building" value={departmentForm.primaryBuilding} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, primaryBuilding: event.target.value }))} placeholder="e.g. Science Block" />
                  <Input label="Staff Room / Location" value={departmentForm.staffRoom} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, staffRoom: event.target.value }))} placeholder="e.g. 2nd Floor, Room 204" />
                  <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={departmentForm.isActive} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, isActive: event.target.checked }))} />Department is active</label>
                </div>
              </Card>

              <Card title="3. Leadership & HOD Contacts">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select label="Head of Department (HOD) *" options={[{ value: '', label: 'Select HOD' }, ...mockStaff.map((staff) => ({ value: staff.id, label: `${staff.name} · ${staff.designation}` }))]} value={departmentForm.hodId} onChange={(event) => {
                    const head = mockStaff.find((staff) => staff.id === event.target.value);
                    setDepartmentForm((previous) => ({ ...previous, hodId: event.target.value, hodDesignation: head?.designation || previous.hodDesignation }));
                  }} />
                  <Input label="HOD Designation" value={departmentForm.hodDesignation} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, hodDesignation: event.target.value }))} placeholder="e.g. Head of Science" />
                  <Select label="Leave Approval Authority" options={[{ value: 'HOD', label: 'HOD' }, { value: 'Principal', label: 'Principal' }]} value={departmentForm.leaveApproval} onChange={(event) => setDepartmentForm((previous) => ({ ...previous, leaveApproval: event.target.value as LeaveApproval }))} />
                  <div className="rounded-lg border bg-gray-50 p-3 text-sm"><div className="mb-1 font-medium text-gray-700">HOD contact details</div>{(() => { const head = mockStaff.find((staff) => staff.id === departmentForm.hodId); return head ? <><div className="flex items-center gap-2 text-gray-600"><Mail className="h-3.5 w-3.5" />{head.email}</div><div className="mt-1 flex items-center gap-2 text-gray-600"><Phone className="h-3.5 w-3.5" />{head.phone}</div></> : <span className="text-gray-400">Select a HOD to populate contact details.</span>; })()}</div>
                </div>
              </Card>

              <Card title="4. Staff Assignment">
                <p className="mb-3 text-xs text-gray-500">The HOD is automatically included in the department staff list.</p>
                <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                  {mockStaff.map((staff) => <label key={staff.id} className="flex items-start gap-2 rounded-md border p-2 text-sm"><input type="checkbox" checked={departmentForm.hodId === staff.id || departmentForm.staffIds.includes(staff.id)} disabled={departmentForm.hodId === staff.id} onChange={() => toggleDepartmentStaff(staff.id)} className="mt-0.5" /><span><span className="font-medium">{staff.name}</span><span className="block text-xs text-gray-500">{staff.designation} · {staff.qualification}</span></span></label>)}
                </div>
              </Card>

              <Card title="5. Applicable Classes" className="xl:col-span-2">
                <p className="mb-3 text-xs text-gray-500">Choose the grades served by this department.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">{CLASS_OPTIONS.map((className) => <label key={className} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"><input type="checkbox" checked={departmentForm.applicableClasses.includes(className)} onChange={() => toggleFormClass(className, 'department')} />{className}</label>)}</div>
              </Card>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-6 py-4"><Button variant="outline" onClick={() => setShowDepartmentModal(false)}>Cancel</Button><Button onClick={saveDepartment}><Save className="h-4 w-4" />Save Department</Button></div>
          </div>
        </div>
      )}

      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4"><div><h2 className="text-xl font-bold">{editingSubjectId ? 'Edit Subject' : 'Add Subject'}</h2><p className="text-sm text-gray-500">Set subject identity, class applicability, and category.</p></div><button onClick={() => setShowSubjectModal(false)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-2">
              <Card title="1. Subject Details">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Subject Name *" value={subjectForm.name} onChange={(event) => setSubjectForm((previous) => ({ ...previous, name: event.target.value }))} placeholder="e.g. Environmental Science" />
                  <Input label="Short Name" value={subjectForm.shortName} onChange={(event) => setSubjectForm((previous) => ({ ...previous, shortName: event.target.value }))} placeholder="e.g. EVS" />
                  <Input label="Subject Code *" value={subjectForm.code} onChange={(event) => setSubjectForm((previous) => ({ ...previous, code: event.target.value.toUpperCase() }))} placeholder="e.g. EVS101" />
                  <Input label="Board / Affiliation Code" value={subjectForm.boardCode} onChange={(event) => setSubjectForm((previous) => ({ ...previous, boardCode: event.target.value.toUpperCase() }))} placeholder="Defaults to subject code" />
                  <Select label="Department" options={[{ value: '', label: 'Unassigned' }, ...departments.map((department) => ({ value: department.id, label: `${department.name} (${department.code})` }))]} value={subjectForm.departmentId} onChange={(event) => setSubjectForm((previous) => ({ ...previous, departmentId: event.target.value }))} />
                  <Select label="Subject Category" options={SUBJECT_CATEGORIES.map((category) => ({ value: category, label: category }))} value={subjectForm.category} onChange={(event) => setSubjectForm((previous) => ({ ...previous, category: event.target.value as SubjectCategory }))} />
                  <div className="md:col-span-2"><Input label="Description" value={subjectForm.description} onChange={(event) => setSubjectForm((previous) => ({ ...previous, description: event.target.value }))} placeholder="Short description of the subject" /></div>
                </div>
              </Card>

              <Card title="2. Class Applicability & Status">
                <p className="mb-3 text-xs text-gray-500">Choose one or more classes. If none are selected, the subject is treated as available to all classes.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{CLASS_OPTIONS.map((className) => <label key={className} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"><input type="checkbox" checked={subjectForm.classLevels.includes(className)} onChange={() => toggleFormClass(className, 'subject')} />{className}</label>)}</div>
                <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={subjectForm.isActive} onChange={(event) => setSubjectForm((previous) => ({ ...previous, isActive: event.target.checked }))} />Subject is active</label>
              </Card>




            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-6 py-4"><Button variant="outline" onClick={() => setShowSubjectModal(false)}>Cancel</Button><Button onClick={saveSubject}><Save className="h-4 w-4" />Save Subject</Button></div>
          </div>
        </div>
      )}

      {departmentPendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3"><div className="rounded-full bg-red-100 p-2 text-red-700"><AlertCircle className="h-5 w-5" /></div><div><h3 className="font-semibold">Delete department?</h3><p className="text-sm text-gray-500">This removes {departmentPendingDelete.name} from the setup.</p></div></div>
            <p className="mt-4 text-sm text-gray-600">Deletion is allowed only when no subjects are associated with this department.</p>
            <div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setDepartmentPendingDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDeleteDepartment}>Delete Department</Button></div>
          </div>
        </div>
      )}

      {subjectPendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3"><div className="rounded-full bg-red-100 p-2 text-red-700"><AlertCircle className="h-5 w-5" /></div><div><h3 className="font-semibold">Delete subject?</h3><p className="text-sm text-gray-500">{subjectPendingDelete.name} ({subjectPendingDelete.code})</p></div></div>
            <p className="mt-4 text-sm text-gray-600">The subject will be removed from the catalogue and its department.</p>
            <div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setSubjectPendingDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDeleteSubject}>Delete Subject</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
