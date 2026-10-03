import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Search,
  Filter,
  Download,
  Upload,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  FileText,
  BarChart,
  PieChart,
  Settings,
  RefreshCw,
  Copy,
  Archive,
  UserPlus,
  BookPlus,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Target } from
'lucide-react';

// ==================== TYPES ====================
interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'theory' | 'practical' | 'both';
  credits: number;
  hoursPerWeek: number;
  isElective: boolean;
  isActive: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  subjects: string[];
  workload: number;
  isHOD: boolean;
}

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  headId: string;
  description: string;
  subjects: Subject[];
  staff: StaffMember[];
  establishedDate: string;
  budget: number;
  location: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
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


// ==================== MAIN COMPONENT ====================
export function DepartmentSubjectGroupingSetup() {
  // State Management
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showSubjectDetailsModal, setShowSubjectDetailsModal] = useState(false);
  const [showStaffDetailsModal, setShowStaffDetailsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Form States
  const [deptFormData, setDeptFormData] = useState({
    name: '',
    code: '',
    headId: '',
    description: '',
    establishedDate: '',
    budget: '',
    location: '',
    email: '',
    phone: ''
  });

  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'theory' as Subject['type'],
    credits: '',
    hoursPerWeek: '',
    isElective: false
  });

  const [staffFormData, setStaffFormData] = useState({
    staffId: '',
    subjects: [] as string[]
  });

  // Notification Helper
  const showNotification = useCallback((type: Notification['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Filter and Search
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
      filterStatus === 'all' ||
      filterStatus === 'active' && dept.isActive ||
      filterStatus === 'inactive' && !dept.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [departments, searchTerm, filterStatus]);

  // Department Management Functions
  const handleAddDepartment = () => {
    if (!deptFormData.name || !deptFormData.code || !deptFormData.headId) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    // Check for duplicate code
    if (departments.some((d) => d.code === deptFormData.code)) {
      showNotification('error', 'Department code already exists');
      return;
    }

    const selectedHead = mockStaff.find((s) => s.id === deptFormData.headId);
    if (!selectedHead) {
      showNotification('error', 'Invalid HOD selected');
      return;
    }

    const newDepartment: Department = {
      id: `dept-${Date.now()}`,
      name: deptFormData.name,
      code: deptFormData.code,
      head: selectedHead.name,
      headId: deptFormData.headId,
      description: deptFormData.description,
      subjects: [],
      staff: [selectedHead],
      establishedDate: deptFormData.establishedDate || new Date().toISOString().split('T')[0],
      budget: parseFloat(deptFormData.budget) || 0,
      location: deptFormData.location,
      email: deptFormData.email,
      phone: deptFormData.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    setDepartments((prev) => [...prev, newDepartment]);
    setShowAddModal(false);
    resetDeptForm();
    showNotification('success', `Department "${deptFormData.name}" created successfully`);
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment || !deptFormData.name || !deptFormData.code || !deptFormData.headId) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    // Check for duplicate code (excluding current department)
    if (departments.some((d) => d.code === deptFormData.code && d.id !== selectedDepartment.id)) {
      showNotification('error', 'Department code already exists');
      return;
    }

    const selectedHead = mockStaff.find((s) => s.id === deptFormData.headId);
    if (!selectedHead) {
      showNotification('error', 'Invalid HOD selected');
      return;
    }

    setDepartments((prev) => prev.map((dept) =>
    dept.id === selectedDepartment.id ?
    {
      ...dept,
      name: deptFormData.name,
      code: deptFormData.code,
      head: selectedHead.name,
      headId: deptFormData.headId,
      description: deptFormData.description,
      establishedDate: deptFormData.establishedDate,
      budget: parseFloat(deptFormData.budget) || 0,
      location: deptFormData.location,
      email: deptFormData.email,
      phone: deptFormData.phone,
      modifiedAt: new Date().toISOString()
    } :
    dept
    ));

    setShowEditModal(false);
    setSelectedDepartment(null);
    resetDeptForm();
    showNotification('success', 'Department updated successfully');
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;

    if (selectedDepartment.subjects.length > 0 || selectedDepartment.staff.length > 0) {
      showNotification('warning', 'Cannot delete department with subjects or staff. Remove them first.');
      return;
    }

    setDepartments((prev) => prev.filter((dept) => dept.id !== selectedDepartment.id));
    setShowDeleteConfirm(false);
    setSelectedDepartment(null);
    showNotification('success', 'Department deleted successfully');
  };

  const handleToggleStatus = (dept: Department) => {
    setDepartments((prev) => prev.map((d) =>
    d.id === dept.id ?
    { ...d, isActive: !d.isActive, modifiedAt: new Date().toISOString() } :
    d
    ));
    showNotification('info', `Department ${dept.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDuplicateDepartment = (dept: Department) => {
    const duplicatedDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      name: `${dept.name} (Copy)`,
      code: `${dept.code}-COPY`,
      subjects: [],
      staff: [],
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    setDepartments((prev) => [...prev, duplicatedDept]);
    showNotification('success', `Department duplicated as "${duplicatedDept.name}"`);
  };

  // Subject Management Functions
  const handleAddSubject = () => {
    if (!selectedDepartment || !subjectFormData.name || !subjectFormData.code) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    // Check if subject code already exists in this department
    if (selectedDepartment.subjects.some((s) => s.code === subjectFormData.code)) {
      showNotification('error', 'Subject code already exists in this department');
      return;
    }

    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name: subjectFormData.name,
      code: subjectFormData.code,
      description: subjectFormData.description,
      type: subjectFormData.type,
      credits: parseInt(subjectFormData.credits) || 0,
      hoursPerWeek: parseInt(subjectFormData.hoursPerWeek) || 0,
      isElective: subjectFormData.isElective,
      isActive: true
    };

    setDepartments((prev) => prev.map((dept) =>
    dept.id === selectedDepartment.id ?
    {
      ...dept,
      subjects: [...dept.subjects, newSubject],
      modifiedAt: new Date().toISOString()
    } :
    dept
    ));

    setSelectedDepartment((prev) => prev ? {
      ...prev,
      subjects: [...prev.subjects, newSubject]
    } : null);

    resetSubjectForm();
    showNotification('success', 'Subject added successfully');
  };

  const handleRemoveSubject = (subjectId: string) => {
    if (!selectedDepartment) return;

    setDepartments((prev) => prev.map((dept) =>
    dept.id === selectedDepartment.id ?
    {
      ...dept,
      subjects: dept.subjects.filter((s) => s.id !== subjectId),
      modifiedAt: new Date().toISOString()
    } :
    dept
    ));

    setSelectedDepartment((prev) => prev ? {
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subjectId)
    } : null);

    showNotification('success', 'Subject removed from department');
  };

  const handleToggleSubjectStatus = (subject: Subject) => {
    if (!selectedDepartment) return;

    setDepartments((prev) => prev.map((dept) =>
    dept.id === selectedDepartment.id ?
    {
      ...dept,
      subjects: dept.subjects.map((s) =>
      s.id === subject.id ? { ...s, isActive: !s.isActive } : s
      ),
      modifiedAt: new Date().toISOString()
    } :
    dept
    ));

    setSelectedDepartment((prev) => prev ? {
      ...prev,
      subjects: prev.subjects.map((s) =>
      s.id === subject.id ? { ...s, isActive: !s.isActive } : s
      )
    } : null);

    showNotification('info', `Subject ${subject.isActive ? 'deactivated' : 'activated'}`);
  };

  // Staff Management Functions
  const handleAddStaff = () => {
    if (!selectedDepartment || !staffFormData.staffId) {
      showNotification('error', 'Please select a staff member');
      return;
    }

    const selectedStaffMember = mockStaff.find((s) => s.id === staffFormData.staffId);
    if (!selectedStaffMember) {
      showNotification('error', 'Invalid staff member selected');
      return;
    }

    // Check if staff already exists in department
    if (selectedDepartment.staff.some((s) => s.id === staffFormData.staffId)) {
      showNotification('warning', 'Staff member already exists in this department');
      return;
    }

    const updatedStaff: StaffMember = {
      ...selectedStaffMember,
      subjects: staffFormData.subjects
    };

    setDepartments((prev) => prev.map((dept) =>
    dept.id === selectedDepartment.id ?
    {
      ...dept,
      staff: [...dept.staff, updatedStaff],
      modifiedAt: new Date().toISOString()
    } :
    dept
    ));

    setSelectedDepartment((prev) => prev ? {
      ...prev,
      staff: [...prev.staff, updatedStaff]
    } : null);

    resetStaffForm();
    setShowAddStaffModal(false);
    showNotification('success', 'Staff member added successfully');
  };

  const handleRemoveStaff = (staffId: string) => {
    if (!selectedDepartment) return;

    // Don't allow removing HOD
    if (staffId === selectedDepartment.headId) {
      showNotification('error', 'Cannot remove HOD from department');
      return;
    }

    setDepartments((prev) => prev.map((dept) =>
    dept.id === selectedDepartment.id ?
    {
      ...dept,
      staff: dept.staff.filter((s) => s.id !== staffId),
      modifiedAt: new Date().toISOString()
    } :
    dept
    ));

    setSelectedDepartment((prev) => prev ? {
      ...prev,
      staff: prev.staff.filter((s) => s.id !== staffId)
    } : null);

    showNotification('success', 'Staff member removed from department');
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    const canDelete = Array.from(selectedDepartments).every((id) => {
      const dept = departments.find((d) => d.id === id);
      return dept && dept.subjects.length === 0 && dept.staff.length === 0;
    });

    if (!canDelete) {
      showNotification('error', 'Cannot delete departments with subjects or staff');
      return;
    }

    setDepartments((prev) => prev.filter((d) => !selectedDepartments.has(d.id)));
    setSelectedDepartments(new Set());
    showNotification('success', `${selectedDepartments.size} departments deleted`);
  };

  const handleBulkActivate = (activate: boolean) => {
    setDepartments((prev) => prev.map((d) =>
    selectedDepartments.has(d.id) ?
    { ...d, isActive: activate, modifiedAt: new Date().toISOString() } :
    d
    ));
    setSelectedDepartments(new Set());
    showNotification('success', `${selectedDepartments.size} departments ${activate ? 'activated' : 'deactivated'}`);
  };

  const handleBulkExport = () => {
    const selectedDepts = departments.filter((d) => selectedDepartments.has(d.id));
    const dataStr = JSON.stringify(selectedDepts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `departments-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('success', 'Departments exported successfully');
  };

  // Import/Export Functions
  const handleExportAll = () => {
    const dataStr = JSON.stringify(departments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-departments-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('success', 'All departments exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setDepartments((prev) => [...prev, ...importedData]);
          showNotification('success', `${importedData.length} departments imported successfully`);
          setShowImportModal(false);
        } else {
          showNotification('error', 'Invalid file format');
        }
      } catch (error) {
        showNotification('error', 'Failed to parse file');
      }
    };
    reader.readAsText(file);
  };

  // UI Helper Functions
  const toggleRowExpansion = (deptId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  const toggleDepartmentSelection = (deptId: string) => {
    setSelectedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  const selectAllDepartments = () => {
    if (selectedDepartments.size === filteredDepartments.length) {
      setSelectedDepartments(new Set());
    } else {
      setSelectedDepartments(new Set(filteredDepartments.map((d) => d.id)));
    }
  };

  // Form Reset Functions
  const resetDeptForm = () => {
    setDeptFormData({
      name: '',
      code: '',
      headId: '',
      description: '',
      establishedDate: '',
      budget: '',
      location: '',
      email: '',
      phone: ''
    });
  };

  const resetSubjectForm = () => {
    setSubjectFormData({
      name: '',
      code: '',
      description: '',
      type: 'theory',
      credits: '',
      hoursPerWeek: '',
      isElective: false
    });
  };

  const resetStaffForm = () => {
    setStaffFormData({
      staffId: '',
      subjects: []
    });
  };

  // Open Modal Functions
  const openAddModal = () => {
    resetDeptForm();
    setShowAddModal(true);
  };

  const openEditModal = (dept: Department) => {
    setSelectedDepartment(dept);
    setDeptFormData({
      name: dept.name,
      code: dept.code,
      headId: dept.headId,
      description: dept.description,
      establishedDate: dept.establishedDate,
      budget: dept.budget.toString(),
      location: dept.location,
      email: dept.email,
      phone: dept.phone
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowDeleteConfirm(true);
  };

  const openViewModal = (dept: Department) => {
    setSelectedDepartment(dept);
    setShowViewModal(true);
  };

  const openAddSubjectModal = (dept: Department) => {
    setSelectedDepartment(dept);
    resetSubjectForm();
    setShowAddSubjectModal(true);
  };

  const openAddStaffModal = (dept: Department) => {
    setSelectedDepartment(dept);
    resetStaffForm();
    setShowAddStaffModal(true);
  };

  const openSubjectDetails = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowSubjectDetailsModal(true);
  };

  const openStaffDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowStaffDetailsModal(true);
  };

  // Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: departments.length,
      active: departments.filter((d) => d.isActive).length,
      inactive: departments.filter((d) => !d.isActive).length,
      totalSubjects: departments.reduce((sum, d) => sum + d.subjects.length, 0),
      totalStaff: departments.reduce((sum, d) => sum + d.staff.length, 0),
      avgSubjectsPerDept: departments.length > 0 ?
      (departments.reduce((sum, d) => sum + d.subjects.length, 0) / departments.length).toFixed(1) :
      0,
      avgStaffPerDept: departments.length > 0 ?
      (departments.reduce((sum, d) => sum + d.staff.length, 0) / departments.length).toFixed(1) :
      0,
      totalBudget: departments.reduce((sum, d) => sum + d.budget, 0)
    };
  }, [departments]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Table Columns
  const columns = [
  {
    key: 'select',
    header: showBulkActions ?
    <input
      type="checkbox"
      checked={selectedDepartments.size === filteredDepartments.length && filteredDepartments.length > 0}
      onChange={selectAllDepartments}
      className="rounded" /> :

    null,
    render: (row: Department) => showBulkActions ?
    <input
      type="checkbox"
      checked={selectedDepartments.has(row.id)}
      onChange={() => toggleDepartmentSelection(row.id)}
      className="rounded" /> :

    null
  },
  {
    key: 'expand',
    header: '',
    render: (row: Department) =>
    <button
      onClick={() => toggleRowExpansion(row.id)}
      className="p-1 hover:bg-gray-100 rounded">

          {expandedRows.has(row.id) ?
      <ChevronDown className="w-4 h-4" /> :

      <ChevronRight className="w-4 h-4" />
      }
        </button>

  },
  {
    key: 'dept',
    header: 'Department Name',
    render: (row: Department) =>
    <div>
          <div className="font-medium flex items-center gap-2">
            {row.name}
            {!row.isActive && <Badge variant="secondary">Inactive</Badge>}
          </div>
          <div className="text-xs text-gray-500">Code: {row.code}</div>
        </div>

  },
  {
    key: 'head',
    header: 'HOD',
    render: (row: Department) =>
    <div>
          <div className="font-medium">{row.head}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>

  },
  {
    key: 'subjects',
    header: 'Subjects Managed',
    render: (row: Department) =>
    <div>
          <div className="font-medium">
            {row.subjects.length} Subject{row.subjects.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500">
            {row.subjects.slice(0, 2).map((s) => s.name).join(', ')}
            {row.subjects.length > 2 && ` +${row.subjects.length - 2} more`}
          </div>
        </div>

  },
  {
    key: 'staff',
    header: 'Staff Count',
    render: (row: Department) =>
    <div className="text-center">
          <div className="font-medium">{row.staff.length}</div>
          <div className="text-xs text-gray-500">members</div>
        </div>

  },
  {
    key: 'budget',
    header: 'Budget',
    render: (row: Department) =>
    <div className="text-right">
          <div className="font-medium">{formatCurrency(row.budget)}</div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Department) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openViewModal(row)}
        title="View Details">

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openEditModal(row)}
        title="Edit">

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openDeleteConfirm(row)}
        title="Delete"
        className="text-red-500">

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification &&
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] ${
      notification.type === 'success' ? 'bg-green-100 text-green-800' :
      notification.type === 'error' ? 'bg-red-100 text-red-800' :
      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      'bg-blue-100 text-blue-800'}`
      }>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Departments & Grouping
          </h1>
          <p className="text-sm text-gray-500">
            Organize subjects and staff into departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowStatsModal(true)}
            title="View Statistics">

            <BarChart className="w-4 h-4 mr-2" />
            Stats
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowBulkActions(!showBulkActions)}>

            <Settings className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
          <Button
            variant="outline"
            onClick={handleExportAll}>

            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}>

            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Depts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-gray-500">Inactive</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSubjects}</div>
            <div className="text-sm text-gray-500">Subjects</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStaff}</div>
            <div className="text-sm text-gray-500">Staff</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.avgSubjectsPerDept}</div>
            <div className="text-sm text-gray-500">Avg Subjects</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{stats.avgStaffPerDept}</div>
            <div className="text-sm text-gray-500">Avg Staff</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">
              {formatCurrency(stats.totalBudget).split('.')[0]}
            </div>
            <div className="text-sm text-gray-500">Total Budget</div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />

            </div>
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active Only' },
            { value: 'inactive', label: 'Inactive Only' }]
            }
            className="w-40" />

          {searchTerm &&
          <Button
            variant="outline"
            onClick={() => setSearchTerm('')}
            size="sm">

              Clear
            </Button>
          }
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedDepartments.size > 0 &&
      <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedDepartments.size} department(s) selected
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={handleBulkExport}>

                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
              <Button
              variant="outline"
              onClick={() => handleBulkActivate(true)}>

                <CheckCircle className="w-4 h-4 mr-2" />
                Activate
              </Button>
              <Button
              variant="outline"
              onClick={() => handleBulkActivate(false)}>

                <X className="w-4 h-4 mr-2" />
                Deactivate
              </Button>
              <Button
              variant="outline"
              onClick={handleBulkDelete}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredDepartments}
          expandedContent={(row: Department) => expandedRows.has(row.id) ?
          <div className="p-4 bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Department Info */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Department Information</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600">Description:</div>
                        <div className="font-medium">{row.description || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600">Location:</div>
                        <div className="font-medium">{row.location || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600">Established:</div>
                        <div className="font-medium">{formatDate(row.establishedDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600">Email:</div>
                        <div className="font-medium">{row.email || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600">Phone:</div>
                        <div className="font-medium">{row.phone || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-gray-600">Budget:</div>
                        <div className="font-medium">{formatCurrency(row.budget)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-500">
                      Subjects ({row.subjects.length})
                    </div>
                    <Button
                    size="xs"
                    onClick={() => openAddSubjectModal(row)}>

                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {row.subjects.map((subject) =>
                  <div
                    key={subject.id}
                    className="p-2 bg-white rounded border flex justify-between items-start">

                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {subject.name}
                            {!subject.isActive &&
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        }
                            {subject.isElective &&
                        <Badge variant="info" className="text-xs">Elective</Badge>
                        }
                          </div>
                          <div className="text-xs text-gray-500">
                            {subject.code} • {subject.credits} credits • {subject.hoursPerWeek}h/week
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                        onClick={() => openSubjectDetails(subject)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details">

                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                        onClick={() => handleToggleSubjectStatus(subject)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={subject.isActive ? 'Deactivate' : 'Activate'}>

                            <Activity className="w-3 h-3" />
                          </button>
                          <button
                        onClick={() => {
                          setSelectedDepartment(row);
                          handleRemoveSubject(subject.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                        title="Remove">

                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                  )}
                    {row.subjects.length === 0 &&
                  <p className="text-sm text-gray-500 text-center py-4">
                        No subjects added yet
                      </p>
                  }
                  </div>
                </div>

                {/* Staff Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-500">
                      Staff ({row.staff.length})
                    </div>
                    <Button
                    size="xs"
                    onClick={() => openAddStaffModal(row)}>

                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {row.staff.map((staff) =>
                  <div
                    key={staff.id}
                    className="p-2 bg-white rounded border flex justify-between items-start">

                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {staff.name}
                            {staff.isHOD &&
                        <Badge variant="success" className="text-xs">HOD</Badge>
                        }
                          </div>
                          <div className="text-xs text-gray-500">
                            {staff.designation}
                          </div>
                          <div className="text-xs text-gray-500">
                            {staff.subjects.length} subject(s) • {staff.workload}h/week
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                        onClick={() => openStaffDetails(staff)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details">

                            <Eye className="w-3 h-3" />
                          </button>
                          {!staff.isHOD &&
                      <button
                        onClick={() => {
                          setSelectedDepartment(row);
                          handleRemoveStaff(staff.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                        title="Remove">

                              <Trash2 className="w-3 h-3" />
                            </button>
                      }
                        </div>
                      </div>
                  )}
                    {row.staff.length === 0 &&
                  <p className="text-sm text-gray-500 text-center py-4">
                        No staff added yet
                      </p>
                  }
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(row)}>

                  <Activity className="w-4 h-4 mr-2" />
                  {row.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleDuplicateDepartment(row)}>

                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => openViewModal(row)}>

                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </div> :
          null} />

        {filteredDepartments.length === 0 &&
        <div className="text-center py-8 text-gray-500">
            No departments found
          </div>
        }
      </Card>

      {/* Add Department Modal */}
      {showAddModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Department</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department Name *
                  </label>
                  <Input
                  placeholder="e.g., Science"
                  value={deptFormData.name}
                  onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department Code *
                  </label>
                  <Input
                  placeholder="e.g., SCI"
                  value={deptFormData.code}
                  onChange={(e) => setDeptFormData({ ...deptFormData, code: e.target.value.toUpperCase() })} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Head of Department (HOD) *
                </label>
                <Select
                value={deptFormData.headId}
                onChange={(e) => setDeptFormData({ ...deptFormData, headId: e.target.value })}
                options={[
                { value: '', label: 'Select HOD' },
                ...mockStaff.map((s) => ({ value: s.id, label: `${s.name} - ${s.designation}` }))]
                } />

              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                placeholder="Department description..."
                value={deptFormData.description}
                onChange={(e) => setDeptFormData({ ...deptFormData, description: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Established Date
                  </label>
                  <Input
                  type="date"
                  value={deptFormData.establishedDate}
                  onChange={(e) => setDeptFormData({ ...deptFormData, establishedDate: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Annual Budget (₹)
                  </label>
                  <Input
                  type="number"
                  placeholder="0"
                  value={deptFormData.budget}
                  onChange={(e) => setDeptFormData({ ...deptFormData, budget: e.target.value })} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                placeholder="e.g., Science Block, 2nd Floor"
                value={deptFormData.location}
                onChange={(e) => setDeptFormData({ ...deptFormData, location: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                  type="email"
                  placeholder="dept@school.edu"
                  value={deptFormData.email}
                  onChange={(e) => setDeptFormData({ ...deptFormData, email: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <Input
                  type="tel"
                  placeholder="+91-XXXXXXXXXX"
                  value={deptFormData.phone}
                  onChange={(e) => setDeptFormData({ ...deptFormData, phone: e.target.value })} />

                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment}>
                <Save className="w-4 h-4 mr-2" />
                Create Department
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Department</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department Name *
                  </label>
                  <Input
                  placeholder="e.g., Science"
                  value={deptFormData.name}
                  onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department Code *
                  </label>
                  <Input
                  placeholder="e.g., SCI"
                  value={deptFormData.code}
                  onChange={(e) => setDeptFormData({ ...deptFormData, code: e.target.value.toUpperCase() })} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Head of Department (HOD) *
                </label>
                <Select
                value={deptFormData.headId}
                onChange={(e) => setDeptFormData({ ...deptFormData, headId: e.target.value })}
                options={[
                { value: '', label: 'Select HOD' },
                ...mockStaff.map((s) => ({ value: s.id, label: `${s.name} - ${s.designation}` }))]
                } />

              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                placeholder="Department description..."
                value={deptFormData.description}
                onChange={(e) => setDeptFormData({ ...deptFormData, description: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Established Date
                  </label>
                  <Input
                  type="date"
                  value={deptFormData.establishedDate}
                  onChange={(e) => setDeptFormData({ ...deptFormData, establishedDate: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Annual Budget (₹)
                  </label>
                  <Input
                  type="number"
                  placeholder="0"
                  value={deptFormData.budget}
                  onChange={(e) => setDeptFormData({ ...deptFormData, budget: e.target.value })} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                placeholder="e.g., Science Block, 2nd Floor"
                value={deptFormData.location}
                onChange={(e) => setDeptFormData({ ...deptFormData, location: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                  type="email"
                  placeholder="dept@school.edu"
                  value={deptFormData.email}
                  onChange={(e) => setDeptFormData({ ...deptFormData, email: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <Input
                  type="tel"
                  placeholder="+91-XXXXXXXXXX"
                  value={deptFormData.phone}
                  onChange={(e) => setDeptFormData({ ...deptFormData, phone: e.target.value })} />

                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDepartment}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedDepartment &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Delete Department</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <strong>{selectedDepartment.name}</strong>?
              </p>
              {(selectedDepartment.subjects.length > 0 || selectedDepartment.staff.length > 0) &&
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    This department has {selectedDepartment.subjects.length} subject(s) and {selectedDepartment.staff.length} staff member(s).
                    Please remove them before deleting the department.
                  </p>
                </div>
            }
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedDepartment(null);
              }}>
                  Cancel
                </Button>
                <Button
                onClick={handleDeleteDepartment}
                className="bg-red-600 hover:bg-red-700"
                disabled={selectedDepartment.subjects.length > 0 || selectedDepartment.staff.length > 0}>

                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* View Details Modal */}
      {showViewModal && selectedDepartment &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedDepartment.name}</h2>
                <p className="text-sm text-gray-500">Department Code: {selectedDepartment.code}</p>
              </div>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="font-medium mb-3">Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <div className="text-center">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{selectedDepartment.subjects.length}</div>
                      <div className="text-sm text-gray-500">Subjects</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{selectedDepartment.staff.length}</div>
                      <div className="text-sm text-gray-500">Staff Members</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-lg font-bold">{formatCurrency(selectedDepartment.budget).split('.')[0]}</div>
                      <div className="text-sm text-gray-500">Annual Budget</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">
                        <Badge variant={selectedDepartment.isActive ? 'success' : 'secondary'}>
                          {selectedDepartment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">Status</div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Department Info */}
              <div>
                <h3 className="font-medium mb-3">Department Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                  <div>
                    <label className="text-sm text-gray-600">Description:</label>
                    <p className="font-medium">{selectedDepartment.description || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Head of Department:</label>
                    <p className="font-medium">{selectedDepartment.head}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Location:</label>
                    <p className="font-medium">{selectedDepartment.location || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Established:</label>
                    <p className="font-medium">{formatDate(selectedDepartment.establishedDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email:</label>
                    <p className="font-medium">{selectedDepartment.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone:</label>
                    <p className="font-medium">{selectedDepartment.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h3 className="font-medium mb-3">Subjects ({selectedDepartment.subjects.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDepartment.subjects.map((subject) =>
                <div key={subject.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-gray-500">{subject.code}</div>
                        </div>
                        <div className="flex gap-1">
                          {!subject.isActive && <Badge variant="secondary">Inactive</Badge>}
                          {subject.isElective && <Badge variant="info">Elective</Badge>}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Type: {subject.type}</div>
                        <div>Credits: {subject.credits} • Hours/Week: {subject.hoursPerWeek}</div>
                      </div>
                    </div>
                )}
                  {selectedDepartment.subjects.length === 0 &&
                <p className="text-gray-500 text-center py-4 col-span-2">No subjects added</p>
                }
                </div>
              </div>

              {/* Staff */}
              <div>
                <h3 className="font-medium mb-3">Staff Members ({selectedDepartment.staff.length})</h3>
                <div className="space-y-2">
                  {selectedDepartment.staff.map((staff) =>
                <div key={staff.id} className="border rounded p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {staff.name}
                          {staff.isHOD && <Badge variant="success">HOD</Badge>}
                        </div>
                        <div className="text-sm text-gray-500">{staff.designation}</div>
                        <div className="text-sm text-gray-600">
                          {staff.email} • {staff.phone}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{staff.workload}h/week</div>
                        <div className="text-xs text-gray-500">{staff.subjects.length} subject(s)</div>
                      </div>
                    </div>
                )}
                  {selectedDepartment.staff.length === 0 &&
                <p className="text-gray-500 text-center py-4">No staff added</p>
                }
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      }

      {/* Add Subject Modal */}
      {showAddSubjectModal && selectedDepartment &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Subject to {selectedDepartment.name}</h2>
              <button onClick={() => setShowAddSubjectModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Subject Name *
                  </label>
                  <Input
                  placeholder="e.g., Advanced Physics"
                  value={subjectFormData.name}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Subject Code *
                  </label>
                  <Input
                  placeholder="e.g., PHY201"
                  value={subjectFormData.code}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value.toUpperCase() })} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                className="w-full border rounded p-2 text-sm"
                rows={2}
                placeholder="Subject description..."
                value={subjectFormData.description}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })} />

              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type
                  </label>
                  <Select
                  value={subjectFormData.type}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, type: e.target.value as Subject['type'] })}
                  options={[
                  { value: 'theory', label: 'Theory' },
                  { value: 'practical', label: 'Practical' },
                  { value: 'both', label: 'Both' }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Credits
                  </label>
                  <Input
                  type="number"
                  placeholder="0"
                  value={subjectFormData.credits}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hours/Week
                  </label>
                  <Input
                  type="number"
                  placeholder="0"
                  value={subjectFormData.hoursPerWeek}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, hoursPerWeek: e.target.value })} />

                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={subjectFormData.isElective}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, isElective: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">This is an elective subject</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddSubjectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>
                <Save className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Add Staff Modal */}
      {showAddStaffModal && selectedDepartment &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Staff to {selectedDepartment.name}</h2>
              <button onClick={() => setShowAddStaffModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Staff Member *
                </label>
                <Select
                value={staffFormData.staffId}
                onChange={(e) => setStaffFormData({ ...staffFormData, staffId: e.target.value })}
                options={[
                { value: '', label: 'Select staff member' },
                ...mockStaff.
                filter((s) => !selectedDepartment.staff.some((ds) => ds.id === s.id)).
                map((s) => ({ value: s.id, label: `${s.name} - ${s.designation}` }))]
                } />

              </div>
              {staffFormData.staffId &&
            <div>
                  <label className="block text-sm font-medium mb-2">
                    Assign Subjects (Optional)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-3">
                    {selectedDepartment.subjects.map((subject) =>
                <label
                  key={subject.id}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">

                        <input
                    type="checkbox"
                    checked={staffFormData.subjects.includes(subject.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStaffFormData({
                          ...staffFormData,
                          subjects: [...staffFormData.subjects, subject.code]
                        });
                      } else {
                        setStaffFormData({
                          ...staffFormData,
                          subjects: staffFormData.subjects.filter((s) => s !== subject.code)
                        });
                      }
                    }}
                    className="rounded" />

                        <span className="text-sm">
                          {subject.name} ({subject.code})
                        </span>
                      </label>
                )}
                    {selectedDepartment.subjects.length === 0 &&
                <p className="text-sm text-gray-500 text-center py-2">
                        No subjects available to assign
                      </p>
                }
                  </div>
                </div>
            }
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddStaffModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff}>
                <Save className="w-4 h-4 mr-2" />
                Add Staff Member
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Subject Details Modal */}
      {showSubjectDetailsModal && selectedSubject &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Subject Details</h2>
              <button onClick={() => setShowSubjectDetailsModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Subject Name:</label>
                  <p className="font-medium text-lg">{selectedSubject.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Subject Code:</label>
                  <p className="font-medium text-lg">{selectedSubject.code}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Description:</label>
                <p className="font-medium">{selectedSubject.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded">
                <div>
                  <label className="text-sm text-gray-600">Type:</label>
                  <p className="font-medium capitalize">{selectedSubject.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Credits:</label>
                  <p className="font-medium">{selectedSubject.credits}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Hours per Week:</label>
                  <p className="font-medium">{selectedSubject.hoursPerWeek}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm text-gray-600">Status:</label>
                  <div className="mt-1">
                    <Badge variant={selectedSubject.isActive ? 'success' : 'secondary'}>
                      {selectedSubject.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Subject Type:</label>
                  <div className="mt-1">
                    <Badge variant={selectedSubject.isElective ? 'info' : 'default'}>
                      {selectedSubject.isElective ? 'Elective' : 'Core'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => setShowSubjectDetailsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      }

      {/* Staff Details Modal */}
      {showStaffDetailsModal && selectedStaff &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Staff Member Details</h2>
              <button onClick={() => setShowStaffDetailsModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {selectedStaff.name}
                    {selectedStaff.isHOD && <Badge variant="success">HOD</Badge>}
                  </h3>
                  <p className="text-gray-600">{selectedStaff.designation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                <div>
                  <label className="text-sm text-gray-600">Email:</label>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone:</label>
                  <p className="font-medium">{selectedStaff.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Qualification:</label>
                  <p className="font-medium">{selectedStaff.qualification}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Experience:</label>
                  <p className="font-medium">{selectedStaff.experience} years</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Joining Date:</label>
                  <p className="font-medium">{formatDate(selectedStaff.joiningDate)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Workload:</label>
                  <p className="font-medium">{selectedStaff.workload} hours/week</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Subjects Teaching:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.subjects.map((subCode) =>
                <Badge key={subCode} variant="info">{subCode}</Badge>
                )}
                  {selectedStaff.subjects.length === 0 &&
                <p className="text-gray-500 text-sm">No subjects assigned</p>
                }
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => setShowStaffDetailsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      }

      {/* Statistics Modal */}
      {showStatsModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Department Statistics</h2>
              <button onClick={() => setShowStatsModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-gray-500">Total Departments</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.active}</div>
                    <div className="text-sm text-gray-500">Active</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalSubjects}</div>
                    <div className="text-sm text-gray-500">Total Subjects</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{stats.totalStaff}</div>
                    <div className="text-sm text-gray-500">Total Staff</div>
                  </div>
                </Card>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Departments Overview</h3>
                <div className="space-y-2">
                  {departments.map((dept) =>
                <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-gray-500">
                          {dept.subjects.length} subjects • {dept.staff.length} staff
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(dept.budget)}</div>
                        <Badge variant={dept.isActive ? 'success' : 'secondary'}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{stats.avgSubjectsPerDept}</div>
                    <div className="text-sm text-gray-500">Avg Subjects per Dept</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{stats.avgStaffPerDept}</div>
                    <div className="text-sm text-gray-500">Avg Staff per Dept</div>
                  </div>
                </Card>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => setShowStatsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      }

      {/* Import Modal */}
      {showImportModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Import Departments</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Upload a JSON file containing department data.
              </p>
              <Input
              type="file"
              accept=".json"
              onChange={handleImport} />

            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}