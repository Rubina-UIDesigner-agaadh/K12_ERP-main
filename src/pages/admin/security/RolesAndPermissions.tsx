import React, { useMemo, useState } from 'react';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Save,
  Shield,
  ChevronRight,
  ChevronDown,
  Search,
  Eye,
  Plus,
  Edit,
  Trash2,
  Check,
  Upload,
  Download,
  Printer,
  Lock,
  Unlock,
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  CreditCard,
  Wallet,
  Receipt,
  UserCheck,
  ClipboardList,
  BriefcaseBusiness,
  Calculator,
  TrendingUp,
  Award,
  DollarSign,
  Landmark,
  Globe,
  Bus,
  Library,
  MessageSquare,
  BarChart3,
  Database,
  FileSpreadsheet,
  Briefcase,
  Home,
  Settings,
  Copy,
  Calendar,
  Clock,
  AlertTriangle,
  X,
  Timer } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
// ============================================================================
// ROLE TYPES & DATA
// ============================================================================
interface Role {
  id: string;
  name: string;
  code: string;
  type: 'System' | 'Custom';
  category: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  locked: boolean;
}

interface ClassSubjectScopeAssignment {
  id: string;
  role: string;
  branchKey: string;
  className: string;
  division: string;
  subject: string;
  accessMode: 'Whole Class' | 'Specific Subjects';
  updatedAt: string;
}

const PRIMARY = '#24608A';
const CATEGORIES = [
'Academic',
'Administrative',
'Finance',
'HR',
'Parent',
'Student',
'Transport',
'Library',
'Examination',
'Admission',
'Attendance',
'Timetable',
'Hostel',
'Canteen',
'Communication',
'Inventory & Stores',
'IT & System',
'Security',
'Alumni',
'Sports & Activities'];

const INITIAL_ROLES: Role[] = [
{
  id: 'R001',
  name: 'Super Admin',
  code: 'SYS_ADMIN',
  type: 'System',
  category: 'Administrative',
  description: 'Full system access with all permissions',
  status: 'Active',
  createdAt: '2024-01-01',
  locked: true
},
{
  id: 'R002',
  name: 'Principal',
  code: 'PRINCIPAL',
  type: 'System',
  category: 'Academic',
  description: 'School principal with high-level management access',
  status: 'Active',
  createdAt: '2024-01-01',
  locked: true
},
{
  id: 'R003',
  name: 'Vice Principal',
  code: 'VICE_PRINCIPAL',
  type: 'System',
  category: 'Academic',
  description: 'Vice principal with academic oversight',
  status: 'Active',
  createdAt: '2024-01-05',
  locked: false
},
{
  id: 'R004',
  name: 'Head of Department',
  code: 'HOD',
  type: 'Custom',
  category: 'Academic',
  description: 'Department head with subject oversight',
  status: 'Active',
  createdAt: '2024-01-08',
  locked: false
},
{
  id: 'R005',
  name: 'Class Teacher',
  code: 'TEACHER_CLS',
  type: 'Custom',
  category: 'Academic',
  description: 'Class teacher with attendance and student management',
  status: 'Active',
  createdAt: '2024-01-10',
  locked: false
},
{
  id: 'R006',
  name: 'Accountant',
  code: 'ACCOUNTANT',
  type: 'Custom',
  category: 'Finance',
  description: 'Finance management and fee collection',
  status: 'Active',
  createdAt: '2024-01-15',
  locked: false
},
{
  id: 'R007',
  name: 'HR Manager',
  code: 'HR_MGR',
  type: 'Custom',
  category: 'HR',
  description: 'Human resources management',
  status: 'Active',
  createdAt: '2024-01-15',
  locked: false
},
{
  id: 'R008',
  name: 'Parent',
  code: 'PARENT',
  type: 'System',
  category: 'Parent',
  description: 'Parent portal access',
  status: 'Active',
  createdAt: '2024-01-01',
  locked: true
},
{
  id: 'R009',
  name: 'Student',
  code: 'STUDENT',
  type: 'System',
  category: 'Student',
  description: 'Student portal access',
  status: 'Active',
  createdAt: '2024-01-01',
  locked: true
}];

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Academic: '#3b82f6',
    Administrative: '#8b5cf6',
    Finance: '#10b981',
    HR: '#f59e0b',
    Parent: '#ec4899',
    Student: '#06b6d4',
    Transport: '#84cc16',
    Library: '#6366f1',
    Examination: '#0ea5e9',
    Admission: '#14b8a6',
    Attendance: '#a855f7',
    Timetable: '#f97316',
    Hostel: '#e11d48',
    Canteen: '#ca8a04',
    Communication: '#0891b2',
    'Inventory & Stores': '#65a30d',
    'IT & System': '#475569',
    Security: '#dc2626',
    Alumni: '#7c3aed',
    'Sports & Activities': '#ea580c'
  };
  return colors[category] || PRIMARY;
};
// ============================================================================
// PERMISSION DATA
// ============================================================================
const BRANCHES = [
{
  id: 'main',
  name: 'Main Campus',
  code: 'MC'
},
{
  id: 'north',
  name: 'North Branch',
  code: 'NB'
},
{
  id: 'south',
  name: 'South Branch',
  code: 'SB'
}];

const CLASS_OPTIONS = [
'Nursery', 'LKG', 'UKG',
'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].
map((c) => ({ value: c, label: c }));

const DIVISION_OPTIONS = ['A', 'B', 'C', 'D', 'E'].map((division) => ({ value: division, label: `Division ${division}` }));
const BATCH_OPTIONS = [
'2023-24', '2024-25', '2025-26', '2026-27',
'Morning Shift', 'Afternoon Shift',
'Science', 'Commerce', 'Arts'].map((batch) => ({ value: batch, label: batch }));

const DEPARTMENT_OPTIONS = [
  'Early Years',
  'Languages',
  'Science & Mathematics',
  'Humanities',
  'Commerce',
  'IT & Innovation',
  'Sports & Activities'
].map((department) => ({ value: department, label: department }));

const CLASS_SUBJECTS: Record<string, string[]> = {
  Nursery: ['English', 'Mathematics', 'Environmental Studies', 'Art & Craft', 'Physical Education'],
  LKG: ['English', 'Mathematics', 'Environmental Studies', 'Art & Craft', 'Physical Education'],
  UKG: ['English', 'Mathematics', 'Environmental Studies', 'Art & Craft', 'Physical Education'],
  'Class 1': ['English', 'Gujarati', 'Hindi', 'Mathematics', 'Environmental Studies', 'Computer Science', 'Art & Craft', 'Physical Education'],
  'Class 2': ['English', 'Gujarati', 'Hindi', 'Mathematics', 'Environmental Studies', 'Computer Science', 'Art & Craft', 'Physical Education'],
  'Class 3': ['English', 'Gujarati', 'Hindi', 'Mathematics', 'Environmental Studies', 'Computer Science', 'Art & Craft', 'Physical Education'],
  'Class 4': ['English', 'Gujarati', 'Hindi', 'Mathematics', 'Environmental Studies', 'Computer Science', 'Art & Craft', 'Physical Education'],
  'Class 5': ['English', 'Gujarati', 'Hindi', 'Mathematics', 'Environmental Studies', 'Computer Science', 'Art & Craft', 'Physical Education'],
  'Class 6': ['English', 'Gujarati', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Physical Education'],
  'Class 7': ['English', 'Gujarati', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Physical Education'],
  'Class 8': ['English', 'Gujarati', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Physical Education'],
  'Class 9': ['English', 'Gujarati', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
  'Class 10': ['English', 'Gujarati', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
  'Class 11': ['English', 'Gujarati', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Political Science', 'Computer Science'],
  'Class 12': ['English', 'Gujarati', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Political Science', 'Computer Science']
};

const SUBJECT_DEPARTMENT: Record<string, string> = {
  English: 'Languages', Gujarati: 'Languages', Hindi: 'Languages', Sanskrit: 'Languages',
  Mathematics: 'Science & Mathematics', 'Environmental Studies': 'Science & Mathematics',
  Science: 'Science & Mathematics', Physics: 'Science & Mathematics', Chemistry: 'Science & Mathematics', Biology: 'Science & Mathematics',
  'Social Science': 'Humanities', History: 'Humanities', 'Political Science': 'Humanities',
  Accountancy: 'Commerce', 'Business Studies': 'Commerce', Economics: 'Commerce',
  'Computer Science': 'IT & Innovation', 'Art & Craft': 'Early Years', 'Physical Education': 'Sports & Activities'
};

const getSubjectOptions = (classes: string[], departments: string[] = []) => {
  const relevantClasses = classes.length ? classes : CLASS_OPTIONS.map((option) => option.value);
  const subjects = Array.from(new Set(relevantClasses.flatMap((className) => CLASS_SUBJECTS[className] || [])));
  return subjects
    .filter((subject) => !departments.length || departments.includes(SUBJECT_DEPARTMENT[subject]))
    .sort((a, b) => a.localeCompare(b))
    .map((subject) => ({ value: subject, label: subject }));
};

const ROLE_NAMES = [
'Super Admin',
'Principal',
'Vice Principal',
'HOD',
'Teacher',
'Accountant',
'HR Manager'];

const PERMISSION_ACTIONS = [
{
  key: 'view',
  label: 'View',
  icon: Eye,
  color: 'blue'
},
{
  key: 'create',
  label: 'Create',
  icon: Plus,
  color: 'green'
},
{
  key: 'update',
  label: 'Edit',
  icon: Edit,
  color: 'amber'
},
{
  key: 'delete',
  label: 'Delete',
  icon: Trash2,
  color: 'red'
},
{
  key: 'approve',
  label: 'Approve',
  icon: Check,
  color: 'purple'
},
{
  key: 'export',
  label: 'Export',
  icon: Download,
  color: 'teal'
}];

const MODULES = [
{
  id: 'student-management',
  name: 'Student Management',
  icon: Users,
  subModules: [
  {
    id: 'student-list',
    name: 'Student Directory',
    pages: [
    {
      id: 'all-students',
      name: 'All Students'
    },
    {
      id: 'student-profile',
      name: 'Student Profile'
    },
    {
      id: 'student-transfer',
      name: 'Student Transfer'
    }]

  },
  {
    id: 'student-docs',
    name: 'Documents',
    pages: [
    {
      id: 'id-card',
      name: 'ID Card Generation'
    },
    {
      id: 'tc-certificate',
      name: 'TC / Certificates'
    }]

  }]

},
{
  id: 'admission',
  name: 'Admission',
  icon: GraduationCap,
  subModules: [
  {
    id: 'admission-process',
    name: 'Admission Process',
    pages: [
    {
      id: 'new-admission',
      name: 'New Admission'
    },
    {
      id: 'admission-form',
      name: 'Admission Form'
    },
    {
      id: 'bulk-admission',
      name: 'Bulk Admission'
    }]

  }]

},
{
  id: 'fees',
  name: 'Fees Management',
  icon: CreditCard,
  subModules: [
  {
    id: 'fee-collection',
    name: 'Fee Collection',
    pages: [
    {
      id: 'collect-fee',
      name: 'Collect Fee'
    },
    {
      id: 'fee-receipt',
      name: 'Fee Receipt'
    },
    {
      id: 'online-payment',
      name: 'Online Payment Entry'
    }]

  },
  {
    id: 'fee-reports',
    name: 'Fee Reports',
    pages: [
    {
      id: 'collection-report',
      name: 'Collection Report'
    },
    {
      id: 'defaulter-list',
      name: 'Defaulter List'
    }]

  }]

},
{
  id: 'employee',
  name: 'Employee Management',
  icon: Briefcase,
  subModules: [
  {
    id: 'employee-directory',
    name: 'Employee Directory',
    pages: [
    {
      id: 'all-employees',
      name: 'All Employees'
    },
    {
      id: 'employee-profile',
      name: 'Employee Profile'
    }]

  }]

},
{
  id: 'assessment',
  name: 'Assessment & Examination',
  icon: FileSpreadsheet,
  subModules: [
  {
    id: 'exam-setup',
    name: 'Exam Setup',
    pages: [
    {
      id: 'exam-master',
      name: 'Exam Master'
    },
    {
      id: 'exam-schedule',
      name: 'Exam Schedule'
    }]

  },
  {
    id: 'marks-entry',
    name: 'Marks Entry',
    pages: [
    {
      id: 'enter-marks',
      name: 'Enter Marks'
    },
    {
      id: 'result-processing',
      name: 'Result Processing'
    }]

  }]

},
{
  id: 'reports',
  name: 'Reports & Analytics',
  icon: BarChart3,
  subModules: [
  {
    id: 'academic-reports',
    name: 'Academic Reports',
    pages: [
    {
      id: 'student-report',
      name: 'Student Reports'
    },
    {
      id: 'attendance-analytics',
      name: 'Attendance Analytics'
    }]

  },
  {
    id: 'finance-reports',
    name: 'Finance Reports',
    pages: [
    {
      id: 'collection-analytics',
      name: 'Collection Analytics'
    },
    {
      id: 'expense-analytics',
      name: 'Expense Analytics'
    }]

  }]

},
{
  id: 'admin-tools',
  name: 'Admin Tools',
  icon: Settings,
  subModules: [
  {
    id: 'user-management',
    name: 'User Management',
    pages: [
    {
      id: 'users',
      name: 'User Master'
    },
    {
      id: 'roles',
      name: 'Role Master'
    }]

  },
  {
    id: 'audit',
    name: 'Audit & Logs',
    pages: [
    {
      id: 'audit-log',
      name: 'Audit Log'
    },
    {
      id: 'login-history',
      name: 'Login History'
    }]

  }]

}];

const getPageIds = () =>
MODULES.flatMap((m) =>
m.subModules.flatMap((sm) => sm.pages.map((p) => p.id))
);
const defaultPerm = (): Record<string, boolean> =>
PERMISSION_ACTIONS.reduce(
  (acc, a) => ({
    ...acc,
    [a.key]: false
  }),
  {} as Record<string, boolean>
);
// ---------------------------------------------------------------------------
// Per-page DATA SCOPE — every page permission row carries its own scope selector.
// Scope is stored per role + branch, side by side with permissions[role][branch][pageId]:
//   scopes[role][branch][pageId] = 'All Data' | 'Own Branch Only' | ...
// ---------------------------------------------------------------------------
const DATA_SCOPE_OPTIONS: {value: string; label: string;}[] = [
{ value: 'All Data', label: 'All Data' },
{ value: 'Own Branch Only', label: 'Own Branch Only' },
{ value: 'Own Department', label: 'Own Department' },
{ value: 'Own Class+Subject', label: 'Own Class+Subject' },
{ value: 'Own Records Only', label: 'Own Records Only' },
{ value: 'No Access', label: 'No Access' }];

const DEFAULT_PAGE_SCOPE = 'All Data';
const MIXED_SCOPE = 'Mixed';
const scopeTone = (scope: string) =>
scope === 'No Access' ?
'border-rose-300 text-rose-700 bg-rose-50' :
scope === 'All Data' ?
'border-slate-300 text-slate-700 bg-white' :
'border-emerald-300 text-emerald-700 bg-emerald-50';
const SCOPE_HINT: Record<string, string> = {
  'All Data': 'No restriction — user sees all records',
  'Own Branch Only': 'User sees only records from their assigned branch',
  'Own Department': 'User sees only records from their department',
  'Own Class+Subject': 'User sees only their assigned classes and subjects',
  'Own Records Only': 'User sees only records they personally created',
  'No Access': 'User cannot see any data on this page'
};
const initScopes = (): Record<
  string,
  Record<string, Record<string, string>>> =>
{
  const scopes: Record<
    string,
    Record<string, Record<string, string>>> =
  {};
  ROLE_NAMES.forEach((role) => {
    scopes[role] = {};
    BRANCHES.forEach((branch) => {
      scopes[role][branch.id] = {};
      getPageIds().forEach((pid) => {
        scopes[role][branch.id][pid] = DEFAULT_PAGE_SCOPE;
      });
    });
  });
  return scopes;
};
const initPermissions = (): Record<
  string,
  Record<string, Record<string, Record<string, boolean>>>> =>
{
  const perms: Record<
    string,
    Record<string, Record<string, Record<string, boolean>>>> =
  {};
  ROLE_NAMES.forEach((role) => {
    perms[role] = {};
    BRANCHES.forEach((branch) => {
      perms[role][branch.id] = {};
      getPageIds().forEach((pid) => {
        perms[role][branch.id][pid] = defaultPerm();
      });
    });
  });
  return perms;
};
// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function RolesAndPermissions() {
  // Role Management State
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [roleSearch, setRoleSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    status: 'Active' as 'Active' | 'Inactive'
  });
  // Permission State
  const [selectedRole, setSelectedRole] = useState('Teacher');
  // Assignment scope — multi-select where more than one value is valid
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  // Existing search filters — retain independently from the access-assignment controls below.
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  // Class & Subject Access assignment controls.
  const [classAccessMode, setClassAccessMode] = useState<'Whole Class' | 'Specific Subjects'>('Whole Class');
  const [wholeClassAccessClasses, setWholeClassAccessClasses] = useState<string[]>([]);
  const [subjectAccessClasses, setSubjectAccessClasses] = useState<string[]>([]);
  const [subjectAccessDivisions, setSubjectAccessDivisions] = useState<string[]>([]);
  const [accessSubjects, setAccessSubjects] = useState<string[]>([]);
  const [classSubjectScopeAssignments, setClassSubjectScopeAssignments] = useState<ClassSubjectScopeAssignment[]>([]);
  const subjectOptions = useMemo(
    () => getSubjectOptions(selectedClasses, selectedDepartments),
    [selectedClasses, selectedDepartments]
  );
  const subjectAccessOptions = useMemo(
    () => subjectAccessClasses.length ? getSubjectOptions(subjectAccessClasses) : [],
    [subjectAccessClasses]
  );
  const visibleClassSubjectScopes = useMemo(() => {
    const branchKey = selectedBranches.slice().sort().join(',');
    return classSubjectScopeAssignments.filter((assignment) =>
      assignment.role === selectedRole && assignment.branchKey === branchKey
    );
  }, [classSubjectScopeAssignments, selectedBranches, selectedRole]);
  const classSubjectDescription = useMemo(() => {
    if (!visibleClassSubjectScopes.length) {
      return `No class or subject access is configured for the ${selectedRole} role in the selected branch scope.`;
    }
    const wholeClasses = Array.from(new Set(visibleClassSubjectScopes
      .filter((assignment) => assignment.accessMode === 'Whole Class')
      .map((assignment) => assignment.className)));
    const selectedByClassDivision = new Map<string, string[]>();
    visibleClassSubjectScopes.filter((assignment) => assignment.accessMode === 'Specific Subjects').forEach((assignment) => {
      const key = `${assignment.className} — Division ${assignment.division}`;
      const subjects = selectedByClassDivision.get(key) || [];
      if (!subjects.includes(assignment.subject)) subjects.push(assignment.subject);
      selectedByClassDivision.set(key, subjects);
    });
    const parts: string[] = [];
    if (wholeClasses.length) parts.push(`full-class access for ${wholeClasses.join(', ')} across all divisions`);
    if (selectedByClassDivision.size) {
      parts.push(`specific-subject access for ${Array.from(selectedByClassDivision.entries()).map(([classDivision, subjects]) => `${classDivision} (${subjects.join(', ')})`).join('; ')}`);
    }
    return `${selectedRole} users have ${parts.join(' and ')}.`;
  }, [visibleClassSubjectScopes, selectedRole]);
  const selectedBranch = selectedBranches[0] || 'main';   // first branch in scope drives the view
  const [permissions, setPermissions] = useState(initPermissions);
  const [scopes, setScopes] = useState(initScopes);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [permSearch, setPermSearch] = useState('');
  // Filtered roles
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      if (
      roleSearch &&
      !r.name.toLowerCase().includes(roleSearch.toLowerCase()) &&
      !r.code.toLowerCase().includes(roleSearch.toLowerCase()))

      return false;
      if (categoryFilter && r.category !== categoryFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [roles, roleSearch, categoryFilter, statusFilter]);

  const handleClassFilterChange = (classes: string[]) => {
    setSelectedClasses(classes);
    const nextSubjectValues = getSubjectOptions(classes, selectedDepartments).map((option) => option.value);
    setSelectedSubjects((current) => current.filter((subject) => nextSubjectValues.includes(subject)));
  };

  const handleDepartmentFilterChange = (departments: string[]) => {
    setSelectedDepartments(departments);
    const nextSubjectValues = getSubjectOptions(selectedClasses, departments).map((option) => option.value);
    setSelectedSubjects((current) => current.filter((subject) => nextSubjectValues.includes(subject)));
  };

  const handleSubjectFilterChange = (subjects: string[]) => {
    setSelectedSubjects(subjects);
  };

  const handleSubjectAccessClassChange = (classes: string[]) => {
    setSubjectAccessClasses(classes);
    const availableSubjects = getSubjectOptions(classes).map((option) => option.value);
    setAccessSubjects((current) => current.filter((subject) => availableSubjects.includes(subject)));
  };

  const applyClassSubjectScopes = () => {
    const targetClasses = classAccessMode === 'Whole Class' ? wholeClassAccessClasses : subjectAccessClasses;
    if (!targetClasses.length) {
      alert(classAccessMode === 'Whole Class'
        ? 'Select at least one class to grant full class access.'
        : 'Select at least one class for specific-subject access.');
      return;
    }
    if (classAccessMode === 'Specific Subjects' && (!subjectAccessDivisions.length || !accessSubjects.length)) {
      alert('Select at least one division and one subject for specific-subject access.');
      return;
    }

    const branchKey = selectedBranches.slice().sort().join(',');
    const updatedAt = new Date().toLocaleString();
    const nextAssignments: ClassSubjectScopeAssignment[] = classAccessMode === 'Whole Class'
      ? targetClasses.map((className) => ({
          id: `${selectedRole}-${branchKey}-${className}-all-divisions-all-subjects`,
          role: selectedRole,
          branchKey,
          className,
          division: 'All divisions',
          subject: 'All subjects',
          accessMode: 'Whole Class' as const,
          updatedAt
        }))
      : targetClasses.flatMap((className) =>
          subjectAccessDivisions.flatMap((division) =>
            accessSubjects
              .filter((subject) => getSubjectOptions([className]).some((option) => option.value === subject))
              .map((subject) => ({
                id: `${selectedRole}-${branchKey}-${className}-${division}-${subject}`,
                role: selectedRole,
                branchKey,
                className,
                division,
                subject,
                accessMode: 'Specific Subjects' as const,
                updatedAt
              }))
          )
        );

    if (!nextAssignments.length) {
      alert('The selected subjects are not available in the selected classes.');
      return;
    }

    const selectedClassSet = new Set(targetClasses);
    const assignedSpecificClasses = new Set(nextAssignments.map((assignment) => assignment.className));
    const assignedClassDivisionKeys = new Set(nextAssignments
      .filter((assignment) => assignment.accessMode === 'Specific Subjects')
      .map((assignment) => `${assignment.className}|${assignment.division}`));
    setClassSubjectScopeAssignments((current) => [
      ...current.filter((assignment) => {
        if (assignment.role !== selectedRole || assignment.branchKey !== branchKey) return true;
        if (!selectedClassSet.has(assignment.className)) return true;
        if (classAccessMode === 'Whole Class') return false;
        if (assignment.accessMode === 'Whole Class') return !assignedSpecificClasses.has(assignment.className);
        return !assignedClassDivisionKeys.has(`${assignment.className}|${assignment.division}`);
      }),
      ...nextAssignments
    ]);
  };

  const removeClassSubjectScope = (id: string) => {
    setClassSubjectScopeAssignments((current) => current.filter((assignment) => assignment.id !== id));
  };

  // Role handlers
  const openCreateRole = () => {
    setEditRole(null);
    setRoleForm({
      name: '',
      code: '',
      description: '',
      category: '',
      status: 'Active'
    });
    setShowRoleModal(true);
  };
  const openEditRole = (role: Role) => {
    if (role.locked) return alert('System roles cannot be edited');
    setEditRole(role);
    setRoleForm({
      name: role.name,
      code: role.code,
      description: role.description,
      category: role.category,
      status: role.status
    });
    setShowRoleModal(true);
  };
  const handleSaveRole = () => {
    if (!roleForm.name || !roleForm.code || !roleForm.category)
    return alert('Please fill all required fields');
    if (editRole) {
      setRoles((prev) =>
      prev.map((r) =>
      r.id === editRole.id ?
      {
        ...r,
        ...roleForm
      } :
      r
      )
      );
    } else {
      const newRole: Role = {
        id: `R${String(roles.length + 1).padStart(3, '0')}`,
        name: roleForm.name,
        code: roleForm.code,
        description: roleForm.description,
        category: roleForm.category,
        status: roleForm.status,
        type: 'Custom',
        locked: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRoles((prev) => [...prev, newRole]);
    }
    setShowRoleModal(false);
    setEditRole(null);
  };
  const handleDeleteRole = (role: Role) => {
    if (role.locked) return alert('System roles cannot be deleted');
    if (confirm(`Delete "${role.name}"?`))
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };
  // Permission handlers
  const currentPerms = permissions[selectedRole]?.[selectedBranch] || {};
  const currentScopes = scopes[selectedRole]?.[selectedBranch] || {};
  const toggleExpand = (id: string) =>
  setExpanded((p) => ({
    ...p,
    [id]: !p[id]
  }));
  // Apply a patch to EVERY branch currently in scope (the branch field is multi-select)
  const writeScoped = (
  p: any,
  patch: (branch: any) => any) =>
  ({
    ...p,
    [selectedRole]: {
      ...p[selectedRole],
      ...Object.fromEntries(
        selectedBranches.map((b) => [b, patch(p[selectedRole]?.[b] || {})])
      )
    }
  });
  const togglePerm = (pageId: string, key: string) => {
    const current = currentPerms[pageId]?.[key] || false;
    setPermissions((p) =>
    writeScoped(p, (branch) => ({
      ...branch,
      [pageId]: {
        ...(branch[pageId] || defaultPerm()),
        [key]: !current
      }
    }))
    );
  };
  const setAllPerms = (
  value: boolean,
  moduleId?: string,
  subModuleId?: string) =>
  {
    const updates: Record<string, Record<string, boolean>> = {};
    MODULES.forEach((m) => {
      if (moduleId && m.id !== moduleId) return;
      m.subModules.forEach((sm) => {
        if (subModuleId && sm.id !== subModuleId) return;
        sm.pages.forEach((p) => {
          updates[p.id] = PERMISSION_ACTIONS.reduce(
            (a, x) => ({
              ...a,
              [x.key]: value
            }),
            {} as Record<string, boolean>
          );
        });
      });
    });
    setPermissions((p) => writeScoped(p, (branch) => ({ ...branch, ...updates })));
  };
  // Data scope for ONE page — written for every branch currently in scope
  const setPageScope = (pageId: string, value: string) => {
    setScopes((p) => ({
      ...p,
      [selectedRole]: {
        ...p[selectedRole],
        ...Object.fromEntries(
          selectedBranches.map((b) => [
          b,
          { ...(p[selectedRole]?.[b] || {}), [pageId]: value }]
          )
        )
      }
    }));
  };
  // Data scope for EVERY page of a sub-module at once
  const setSubModuleScope = (
  moduleId: string,
  subModuleId: string,
  value: string) =>
  {
    const mod = MODULES.find((m) => m.id === moduleId);
    const sub = mod?.subModules.find((sm) => sm.id === subModuleId);
    const pageIds = (sub?.pages || []).map((pg) => pg.id);
    setScopes((p) => ({
      ...p,
      [selectedRole]: {
        ...p[selectedRole],
        ...Object.fromEntries(
          selectedBranches.map((b) => [
          b,
          {
            ...(p[selectedRole]?.[b] || {}),
            ...Object.fromEntries(pageIds.map((id) => [id, value]))
          }]
          )
        )
      }
    }));
  };
  // What scope is currently set for a whole sub-module (or 'Mixed')
  const subModuleScope = (moduleId: string, subModuleId: string): string => {
    const mod = MODULES.find((m) => m.id === moduleId);
    const sub = mod?.subModules.find((sm) => sm.id === subModuleId);
    const values = (sub?.pages || []).map(
      (pg) => currentScopes[pg.id] || DEFAULT_PAGE_SCOPE
    );
    if (values.length === 0) return DEFAULT_PAGE_SCOPE;
    return values.every((v) => v === values[0]) ? values[0] : MIXED_SCOPE;
  };
  const copyToAllBranches = () => {
    setPermissions((p) => {
      const updated = {
        ...p,
        [selectedRole]: {
          ...p[selectedRole]
        }
      };
      BRANCHES.forEach((b) => {
        if (b.id !== selectedBranch)
        updated[selectedRole][b.id] = JSON.parse(
          JSON.stringify(p[selectedRole]?.[selectedBranch] || {})
        );
      });
      return updated;
    });
    setScopes((p) => {
      const updated = {
        ...p,
        [selectedRole]: {
          ...p[selectedRole]
        }
      };
      BRANCHES.forEach((b) => {
        if (b.id !== selectedBranch)
        updated[selectedRole][b.id] = JSON.parse(
          JSON.stringify(p[selectedRole]?.[selectedBranch] || {})
        );
      });
      return updated;
    });
    alert('Permissions and data scopes copied to all branches');
  };
  const filteredModules = MODULES.filter(
    (m) =>
    !permSearch ||
    m.name.toLowerCase().includes(permSearch.toLowerCase()) ||
    m.subModules.some(
      (sm) =>
      sm.name.toLowerCase().includes(permSearch.toLowerCase()) ||
      sm.pages.some((p) =>
      p.name.toLowerCase().includes(permSearch.toLowerCase())
      )
    )
  );
  const getModuleStats = (module: (typeof MODULES)[0]) => {
    let granted = 0;
    let total = 0;
    module.subModules.forEach((sm) =>
    sm.pages.forEach((p) => {
      const perms = currentPerms[p.id] || defaultPerm();
      Object.values(perms).forEach((v) => {
        total++;
        if (v) granted++;
      });
    })
    );
    return {
      granted,
      total,
      pct: total ? Math.round(granted / total * 100) : 0
    };
  };
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield
            className="w-7 h-7"
            style={{
              color: PRIMARY
            }} />
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Roles & Permissions
            </h1>
            <p className="text-sm text-slate-500">
              Manage roles and configure permissions
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* SECTION 1: ROLE MANAGEMENT */}
      {/* ================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Role Management
          </h2>
          <Button onClick={openCreateRole}>
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]">
              
              <option value="">All Categories</option>
              {CATEGORIES.map((c) =>
              <option key={c} value={c}>
                  {c}
                </option>
              )}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]">
              
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-sm">Roles</span>
            <span className="text-sm text-slate-500">
              {filteredRoles.length} of {roles.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {[
                  'ID',
                  'Role Name',
                  'Code',
                  'Type',
                  'Category',
                  'Status',
                  'Actions'].
                  map((h) =>
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                    
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((role) =>
                <tr key={role.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {role.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor:
                          getCategoryColor(role.category) + '20'
                        }}>
                        
                          <Shield
                          className="w-4 h-4"
                          style={{
                            color: getCategoryColor(role.category)
                          }} />
                        
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {role.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {role.code}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                      variant={role.type === 'System' ? 'info' : 'warning'}>
                      
                        {role.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor:
                        getCategoryColor(role.category) + '15',
                        color: getCategoryColor(role.category)
                      }}>
                      
                        {role.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                      variant={
                      role.status === 'Active' ? 'success' : 'danger'
                      }>
                      
                        {role.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                        onClick={() => openEditRole(role)}
                        className={`p-1.5 rounded-lg ${role.locked ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-600'}`}
                        disabled={role.locked}>
                        
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDeleteRole(role)}
                        className={`p-1.5 rounded-lg ${role.locked ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-rose-500'}`}
                        disabled={role.locked}>
                        
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredRoles.length === 0 &&
                <tr>
                    <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-slate-500">
                    
                      No roles found
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-slate-200" />

      {/* ================================================================== */}
      {/* SECTION 2: PERMISSION ASSIGNMENT */}
      {/* ================================================================== */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Permission Assignment
        </h2>
        <p className="text-sm text-slate-500 -mt-2">
          Choose the role and branches, set the class, department, subject, division, and batch search criteria in Step 1, and manage whole-class or specific-subject access in its separate panel. Per-page scopes and class/subject access are tracked independently for the selected role and branch.
        </p>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Step 1 — Who are you configuring permissions for?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                {ROLE_NAMES.map((r) =>
                <option key={r} value={r}>
                    {r}
                  </option>
                )}
              </select>
            </div>
            <MultiSelect
              label="Branch (multi-select)"
              options={BRANCHES.map((b) => ({ value: b.id, label: b.name }))}
              value={selectedBranches}
              onChange={(v) => setSelectedBranches(v.length ? v : ['main'])}
              placeholder="Select branches" />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Search modules
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>

            <div className="flex flex-col justify-end">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quick Actions
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 whitespace-nowrap"
                  onClick={() => setAllPerms(true)}>
                  <Unlock className="w-3 h-3 mr-1" /> Grant All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 whitespace-nowrap"
                  onClick={() => setAllPerms(false)}>
                  <Lock className="w-3 h-3 mr-1" /> Revoke All
                </Button>
                <Button variant="outline" size="sm" className="flex-1 whitespace-nowrap" onClick={copyToAllBranches}>
                  <Copy className="w-3 h-3 mr-1" /> Copy to All Branches
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-800">Search filters</h4>
              <p className="mt-1 text-xs text-slate-500">Set search criteria for class, department, subject, division, and batch here.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <MultiSelect label="Class (multi-select)" options={CLASS_OPTIONS} value={selectedClasses} onChange={handleClassFilterChange} placeholder="All classes" />
              <MultiSelect label="Department (multi-select)" options={DEPARTMENT_OPTIONS} value={selectedDepartments} onChange={handleDepartmentFilterChange} placeholder="All departments" />
              <MultiSelect label="Subject (depends on class)" options={subjectOptions} value={selectedSubjects} onChange={handleSubjectFilterChange} placeholder={selectedClasses.length ? 'All subjects in selected classes' : 'All subjects'} />
              <MultiSelect label="Division (multi-select)" options={DIVISION_OPTIONS} value={selectedDivisions} onChange={setSelectedDivisions} placeholder="All divisions" />
              <MultiSelect label="Batch (multi-select)" options={BATCH_OPTIONS} value={selectedBatches} onChange={setSelectedBatches} placeholder="All batches" />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm text-slate-600">Editing:</span>
            <Badge variant="info">
              {selectedRole} @{' '}
              {selectedBranches.
              map((id) => BRANCHES.find((b) => b.id === id)?.name).
              filter(Boolean).
              join(', ') || 'No branch selected'}
            </Badge>
            <div className="flex gap-2 ml-auto">
              {BRANCHES.map((b) =>
              <button
                key={b.id}
                onClick={() => setSelectedBranches([b.id])}
                className={`px-3 py-1.5 rounded-lg text-sm border-2 transition ${b.id === selectedBranch ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                
                  <Building2
                  className={`w-3 h-3 inline mr-1 ${b.id === selectedBranch ? 'text-blue-600' : 'text-slate-400'}`} />
                
                  {b.code}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Permission Legend */}
        <div className="bg-white border rounded-lg p-3 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-slate-700">Legend:</span>
          {PERMISSION_ACTIONS.map((a) =>
          <div key={a.key} className="flex items-center gap-1">
              <a.icon className="w-3 h-3 text-slate-500" />
              <span className="text-slate-600">{a.label}</span>
            </div>
          )}
        </div>

        {/* Permission Tree */}
        <Card className="overflow-hidden p-0">
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredModules.map((module) => {
              const stats = getModuleStats(module);
              return (
                <div key={module.id} className="border-b last:border-b-0">
                  <div
                    className="sticky top-0 bg-gray-100 z-10 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => toggleExpand(module.id)}>
                    
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        {expanded[module.id] ?
                        <ChevronDown className="w-5 h-5 text-slate-500" /> :

                        <ChevronRight className="w-5 h-5 text-slate-500" />
                        }
                        <module.icon className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          {module.name}
                        </span>
                        <Badge
                          variant={
                          stats.pct === 100 ?
                          'success' :
                          stats.pct > 0 ?
                          'warning' :
                          'info'
                          }>
                          
                          {stats.pct}%
                        </Badge>
                      </div>
                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}>
                        
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setAllPerms(true, module.id)}>
                          
                          Grant
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setAllPerms(false, module.id)}>
                          
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>

                  {expanded[module.id] &&
                  module.subModules.map((sub) =>
                  <div
                    key={sub.id}
                    className="border-l-4 border-blue-200 ml-4">
                    
                        <div className="bg-blue-50/70 px-4 py-2 flex items-center justify-between border-b">
                          <span className="font-medium text-slate-800 text-sm">
                            {sub.name}
                            {subModuleScope(module.id, sub.id) === MIXED_SCOPE && <span className="text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-[10px] font-semibold ml-2">⚠️ Mixed scopes</span>}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="hidden lg:inline text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
                              Scope for all pages
                            </span>
                            <select
                          value={subModuleScope(module.id, sub.id)}
                          onChange={(e) =>
                          setSubModuleScope(module.id, sub.id, e.target.value)
                          }
                          aria-label={`Data scope for all pages in ${sub.name}`}
                          title={subModuleScope(module.id, sub.id) === MIXED_SCOPE ? 'Pages below have different scopes. Select one here to override all pages in this section.' : 'Apply a data scope to all pages in this section.'}
                          className={`p-1.5 border rounded-lg text-xs ${scopeTone(subModuleScope(module.id, sub.id))}`}>
                          
                              {subModuleScope(module.id, sub.id) === MIXED_SCOPE &&
                            <option value={MIXED_SCOPE}>
                                  Mixed — choose for each page
                                </option>
                            }
                              <optgroup label="Standard scopes">
                                {DATA_SCOPE_OPTIONS.map((o) =>
                              <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                              )}
                              </optgroup>
                            </select>
                            <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                          setAllPerms(true, module.id, sub.id)
                          }>
                          
                              Grant
                            </Button>
                            <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                          setAllPerms(false, module.id, sub.id)
                          }>
                          
                              Revoke
                            </Button>
                          </div>
                        </div>
                        {subModuleScope(module.id, sub.id) === MIXED_SCOPE && (
                          <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                            <span>Pages in this section have different data scopes. Select a scope above to apply the same scope to all pages.</span>
                          </div>
                        )}
                        <div className="divide-y divide-gray-100">
                          {sub.pages.map((page) => {
                        const perms = currentPerms[page.id] || defaultPerm();
                        const pageScope = currentScopes[page.id] || DEFAULT_PAGE_SCOPE;
                        const scopeBorder = pageScope === 'No Access' ? 'border-rose-400' : pageScope === 'All Data' ? 'border-slate-300' : 'border-emerald-400';
                        const scopeDot = pageScope === 'No Access' ? 'bg-rose-500' : pageScope === 'All Data' ? 'bg-slate-400' : 'bg-emerald-500';
                        const scopeHint = SCOPE_HINT[pageScope] || '';
                        return (
                          <div key={page.id} className={`px-4 py-2 hover:bg-gray-50 border-l-4 ${scopeBorder}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex min-w-[200px] items-center gap-2">
                                <span className="text-sm text-slate-700">{page.name}</span>
                                <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${scopeDot}`} title={pageScope} />
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {PERMISSION_ACTIONS.map((a) => {
                                  const enabled = perms[a.key] || false;
                                  return (
                                    <button
                                      key={a.key}
                                      onClick={() => togglePerm(page.id, a.key)}
                                      className={`flex items-center gap-1 px-2 py-1 rounded transition text-xs border ${enabled ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-400 border-transparent hover:bg-gray-200'}`}>
                                      <a.icon className="w-3 h-3" />
                                      <span className="hidden sm:inline">{a.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-col gap-1.5 border-t border-gray-100 pt-2 sm:flex-row sm:items-center sm:gap-3">
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-slate-500">Data Scope:</span>
                                <select
                                  value={pageScope}
                                  onChange={(e) => setPageScope(page.id, e.target.value)}
                                  aria-label={`Data scope for ${page.name}`}
                                  title="Data scope applied to this page for the selected role"
                                  className={`p-1.5 border rounded-lg text-xs ${scopeTone(pageScope)}`}>
                                  <optgroup label="Standard scopes">
                                    {DATA_SCOPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </optgroup>
                                </select>
                              </div>
                              {scopeHint && <span className="text-xs italic text-slate-500">{scopeHint}</span>}
                            </div>
                          </div>);

                      })}
                        </div>
                      </div>
                  )}
                </div>);

            })}
          </div>
        </Card>

        {/* Class and subject data scopes */}
        <Card className="overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Class & Subject Access — for {selectedRole} role
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Define the class and subject data that users assigned to this role can access.
              </p>
            </div>
            <Badge variant="info">{visibleClassSubjectScopes.length} assigned combination{visibleClassSubjectScopes.length === 1 ? '' : 's'}</Badge>
          </div>

          <div className="p-5 space-y-5">
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Can they see the whole class or only specific subjects?</label>
                <div className="flex flex-wrap gap-2">
                  {(['Whole Class', 'Specific Subjects'] as const).map((mode) => (
                    <label key={mode} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${classAccessMode === mode ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                      <input type="radio" name="class-access-mode" checked={classAccessMode === mode} onChange={() => setClassAccessMode(mode)} />
                      <span className="font-medium">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {classAccessMode === 'Whole Class' ? (
                <div className="max-w-2xl">
                  <MultiSelect
                    label="Select class(es) for full class access"
                    options={CLASS_OPTIONS}
                    value={wholeClassAccessClasses}
                    onChange={setWholeClassAccessClasses}
                    placeholder="Choose the class(es) that receive full access"
                  />
                  <p className="mt-1 text-xs text-slate-500">Full access includes every subject and division in each selected class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 md:grid-cols-2 xl:grid-cols-3">
                  <MultiSelect
                    label="Class for subject access"
                    options={CLASS_OPTIONS}
                    value={subjectAccessClasses}
                    onChange={handleSubjectAccessClassChange}
                    placeholder="Choose class(es)"
                  />
                  <MultiSelect
                    label="Division"
                    options={DIVISION_OPTIONS}
                    value={subjectAccessDivisions}
                    onChange={setSubjectAccessDivisions}
                    placeholder="Choose division(s)"
                  />
                  <MultiSelect
                    label="Subject"
                    options={subjectAccessOptions}
                    value={accessSubjects}
                    onChange={setAccessSubjects}
                    placeholder={subjectAccessClasses.length ? 'Choose subject(s)' : 'Select class(es) first'}
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">Apply adds the selected full-class or class/division/subject access for this role and branch.</p>
                <Button onClick={applyClassSubjectScopes}>
                  <Save className="w-4 h-4 mr-2" /> Apply class / subject access
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-500">These assignments define which classes, divisions, and subjects each {selectedRole} user can access across academic pages.</p>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Class</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Division</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Access</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Subject</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Updated</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {visibleClassSubjectScopes.length ? visibleClassSubjectScopes.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{assignment.className}</td>
                      <td className="px-4 py-3 text-slate-700">{assignment.division}</td>
                      <td className="px-4 py-3"><Badge variant={assignment.accessMode === 'Whole Class' ? 'success' : 'warning'}>{assignment.accessMode === 'Whole Class' ? 'Full class access' : 'Specific subjects'}</Badge></td>
                      <td className="px-4 py-3 text-slate-700">{assignment.subject}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{assignment.updatedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="xs" onClick={() => removeClassSubjectScope(assignment.id)} aria-label={`Remove ${assignment.className}, ${assignment.division}, ${assignment.subject} access`}>
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No class access has been assigned for {selectedRole} in the selected branch scope yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="text-sm font-semibold text-blue-900">Description Preview</h4>
              <p className="mt-1 text-xs leading-relaxed text-blue-800">{classSubjectDescription}</p>
            </div>
          </div>
        </Card>

        {/* Save — bottom of the Permission Assignment panel */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-500">
            Editing <strong className="text-slate-700">{selectedRole}</strong> ·{' '}
            {selectedBranches.length} branch{selectedBranches.length === 1 ? '' : 'es'} in scope · Search filters: {' '}
            {selectedClasses.length || 'all'} class{selectedClasses.length === 1 ? '' : 'es'} ·{' '}
            {selectedDivisions.length || 'all'} division{selectedDivisions.length === 1 ? '' : 's'} ·{' '}
            {selectedBatches.length || 'all'} batch{selectedBatches.length === 1 ? '' : 'es'} ·{' '}
            {selectedDepartments.length || 'all'} department{selectedDepartments.length === 1 ? '' : 's'} ·{' '}
            {selectedSubjects.length || 'all'} subject{selectedSubjects.length === 1 ? '' : 's'} ·{' '}
            {visibleClassSubjectScopes.length} class access assignment{visibleClassSubjectScopes.length === 1 ? '' : 's'} · per-page data scopes are applied above
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToAllBranches}>
              <Copy className="w-4 h-4 mr-2" /> Copy to All Branches
            </Button>
            <Button onClick={() => alert(`Permissions, per-page data scopes, and ${visibleClassSubjectScopes.length} class access assignments saved for ${selectedRole}`)}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ROLE FORM MODAL */}
      {/* ================================================================== */}
      {showRoleModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="absolute inset-0 bg-slate-900/60"
          onClick={() => setShowRoleModal(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Shield
                className="w-5 h-5"
                style={{
                  color: PRIMARY
                }} />
              
                {editRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button
              onClick={() => setShowRoleModal(false)}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center">
              
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Name *
                </label>
                <input
                type="text"
                value={roleForm.name}
                onChange={(e) =>
                setRoleForm((p) => ({
                  ...p,
                  name: e.target.value
                }))
                }
                placeholder="e.g. Exam Coordinator"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Code *
                </label>
                <input
                type="text"
                value={roleForm.code}
                onChange={(e) =>
                setRoleForm((p) => ({
                  ...p,
                  code: e.target.value.toUpperCase().replace(/\s/g, '_')
                }))
                }
                placeholder="e.g. EXAM_COORD"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
                <p className="text-xs text-slate-500 mt-1">
                  Unique identifier, no spaces
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                value={roleForm.category}
                onChange={(e) =>
                setRoleForm((p) => ({
                  ...p,
                  category: e.target.value
                }))
                }
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) =>
                <option key={c} value={c}>
                      {c}
                    </option>
                )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                value={roleForm.description}
                onChange={(e) =>
                setRoleForm((p) => ({
                  ...p,
                  description: e.target.value
                }))
                }
                placeholder="Role description..."
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none" />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                value={roleForm.status}
                onChange={(e) =>
                setRoleForm((p) => ({
                  ...p,
                  status: e.target.value as 'Active' | 'Inactive'
                }))
                }
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                variant="outline"
                onClick={() => setShowRoleModal(false)}>
                
                  Cancel
                </Button>
                <Button onClick={handleSaveRole}>
                  <Save className="w-4 h-4 mr-2" />
                  {editRole ? 'Update' : 'Create'} Role
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}