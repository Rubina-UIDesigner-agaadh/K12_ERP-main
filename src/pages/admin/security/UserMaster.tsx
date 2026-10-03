import React, { useState, Component } from 'react';
// UserMaster.tsx - Core User Identity Registry & Management
import {
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  Send,
  MessageSquare,
  AlertTriangle,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  Users,
  IdCard,
  Lock,
  Unlock,
  Copy,
  EyeOff,
  Building,
  Briefcase,
  X,
  Save,
  Settings,
  Link,
  Hash,
  GraduationCap,
  BadgeCheck,
  FileSpreadsheet } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
// ============================================================================
// TYPES
// ============================================================================
interface User {
  id: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  photo?: string;
  designation: string;
  department: string;
  grNo?: string;
  suId?: string;
  employeeId?: string;
  parentId?: string;
  linkedEntityId?: string;
  linkedEntityName?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  hasLogin: boolean;
  username?: string;
  assignedRole?: string;
  createdOn: string;
  lastModified: string;
  lastLogin?: string;
  canDelete: boolean;
  deleteReason?: string;
}
// ============================================================================
// CONSTANTS
// ============================================================================
const STUDENT_DESIGNATIONS = ['Student'];
const PARENT_DESIGNATIONS = ['Parent'];
const STAFF_DESIGNATIONS = [
'Teacher',
'Principal',
'Vice Principal',
'Accountant',
'HR Manager',
'System Admin',
'Guest Lecturer',
'Auditor',
'Librarian',
'Lab Assistant',
'Clerk',
'Peon',
'Driver',
'Security',
'Coordinator',
'Counselor'];

const DESIGNATIONS = [
...STUDENT_DESIGNATIONS,
...PARENT_DESIGNATIONS,
...STAFF_DESIGNATIONS];

const DEPARTMENTS = [
'Administration',
'Mathematics',
'Science',
'English',
'Social Studies',
'Computer Science',
'Physics',
'Chemistry',
'Biology',
'Finance',
'HR',
'IT',
'Library',
'Sports',
'Arts',
'Music',
'External',
'Guardian',
'Class 1',
'Class 2',
'Class 3',
'Class 4',
'Class 5',
'Class 6',
'Class 7',
'Class 8',
'Class 9',
'Class 10',
'Class 11',
'Class 12'];

const ROLES = [
'Student',
'Parent',
'Teacher',
'Class Teacher',
'HOD',
'Principal',
'Vice Principal',
'Accountant',
'HR Manager',
'System Admin',
'Data Entry',
'Guest Lecturer',
'Auditor',
'Librarian',
'Staff',
'Coordinator',
'Counselor'];

const GENDERS = ['Male', 'Female', 'Other'];
// ============================================================================
// MOCK DATA
// ============================================================================
const INITIAL_USERS: User[] = [
{
  id: 'USR001',
  fullName: 'Aarav Patel',
  firstName: 'Aarav',
  middleName: '',
  lastName: 'Patel',
  email: 'aarav@student.edu',
  mobile: '+91 98765 43210',
  gender: 'Male',
  dob: '2008-05-15',
  designation: 'Student',
  department: 'Class 10-A',
  grNo: 'GR2024001',
  suId: 'SU10A001',
  linkedEntityId: 'STU2024001',
  linkedEntityName: 'Class 10-A',
  status: 'Active',
  hasLogin: true,
  username: 'aarav.patel',
  assignedRole: 'Student',
  createdOn: '2024-04-01',
  lastModified: '2024-04-01',
  lastLogin: 'Today, 08:45 AM',
  canDelete: false,
  deleteReason: 'Linked to active admission'
},
{
  id: 'USR002',
  fullName: 'Michael Wilson',
  firstName: 'Michael',
  middleName: '',
  lastName: 'Wilson',
  email: 'michael@email.com',
  mobile: '+91 98765 43214',
  gender: 'Male',
  dob: '1980-03-20',
  designation: 'Parent',
  department: 'Guardian',
  parentId: 'PAR2024001',
  linkedEntityId: 'PAR001',
  linkedEntityName: '2 Students',
  status: 'Active',
  hasLogin: true,
  username: 'michael.wilson',
  assignedRole: 'Parent',
  createdOn: '2024-04-01',
  lastModified: '2024-04-10',
  lastLogin: 'Yesterday, 05:30 PM',
  canDelete: false,
  deleteReason: 'Active parent account'
},
{
  id: 'USR003',
  fullName: 'Sarah Smith',
  firstName: 'Sarah',
  middleName: 'Ann',
  lastName: 'Smith',
  email: 'sarah@school.edu',
  mobile: '+91 98765 43211',
  gender: 'Female',
  dob: '1985-08-12',
  designation: 'Teacher',
  department: 'Mathematics',
  employeeId: 'EMP2023015',
  linkedEntityId: 'EMP015',
  linkedEntityName: 'Teacher - Mathematics',
  status: 'Active',
  hasLogin: true,
  username: 'sarah.smith',
  assignedRole: 'Class Teacher',
  createdOn: '2023-02-15',
  lastModified: '2024-03-10',
  lastLogin: 'Today, 09:00 AM',
  canDelete: false,
  deleteReason: 'Active employee'
},
{
  id: 'USR004',
  fullName: 'James Wilson',
  firstName: 'James',
  middleName: '',
  lastName: 'Wilson',
  email: 'james.w@example.com',
  mobile: '+91 98765 00001',
  gender: 'Male',
  dob: '1990-11-05',
  designation: 'Guest Lecturer',
  department: 'Physics',
  employeeId: 'EMP2024050',
  status: 'Active',
  hasLogin: true,
  username: 'james.wilson',
  assignedRole: 'Guest Lecturer',
  createdOn: '2024-01-15',
  lastModified: '2024-01-15',
  lastLogin: '3 days ago',
  canDelete: true
},
{
  id: 'USR005',
  fullName: 'Emily Brown',
  firstName: 'Emily',
  middleName: 'Rose',
  lastName: 'Brown',
  email: 'emily@school.edu',
  mobile: '+91 98765 43215',
  gender: 'Female',
  dob: '1988-06-22',
  designation: 'Accountant',
  department: 'Finance',
  employeeId: 'EMP2023020',
  linkedEntityId: 'EMP020',
  linkedEntityName: 'Finance Team',
  status: 'Active',
  hasLogin: true,
  username: 'emily.brown',
  assignedRole: 'Accountant',
  createdOn: '2023-06-01',
  lastModified: '2024-02-15',
  lastLogin: 'Today, 10:30 AM',
  canDelete: false,
  deleteReason: 'Active employee'
},
{
  id: 'USR006',
  fullName: 'Robert Johnson',
  firstName: 'Robert',
  middleName: '',
  lastName: 'Johnson',
  email: 'robert@school.edu',
  mobile: '+91 98765 43216',
  gender: 'Male',
  dob: '1975-03-10',
  designation: 'Principal',
  department: 'Administration',
  employeeId: 'EMP2020001',
  linkedEntityId: 'EMP001',
  linkedEntityName: 'School Head',
  status: 'Active',
  hasLogin: true,
  username: 'robert.johnson',
  assignedRole: 'Principal',
  createdOn: '2020-01-01',
  lastModified: '2024-03-01',
  lastLogin: 'Today, 07:30 AM',
  canDelete: false,
  deleteReason: 'System administrator account'
},
{
  id: 'USR007',
  fullName: 'External Auditor',
  firstName: 'External',
  middleName: '',
  lastName: 'Auditor',
  email: 'audit@firm.com',
  mobile: '+91 99999 88888',
  gender: 'Male',
  dob: '1975-06-30',
  designation: 'Auditor',
  department: 'External',
  employeeId: 'EXT2023001',
  status: 'Inactive',
  hasLogin: false,
  assignedRole: 'Auditor',
  createdOn: '2023-12-01',
  lastModified: '2024-02-28',
  canDelete: true
},
{
  id: 'USR008',
  fullName: 'John Doe',
  firstName: 'John',
  middleName: '',
  lastName: 'Doe',
  email: 'john@school.edu',
  mobile: '+91 98765 99999',
  gender: 'Male',
  dob: '1982-04-15',
  designation: 'System Admin',
  department: 'IT',
  employeeId: 'EMP2022002',
  linkedEntityId: 'EMP002',
  linkedEntityName: 'System Administrator',
  status: 'Active',
  hasLogin: true,
  username: 'john.doe',
  assignedRole: 'System Admin',
  createdOn: '2022-01-10',
  lastModified: '2024-03-15',
  lastLogin: 'Today, 06:00 AM',
  canDelete: false,
  deleteReason: 'System administrator account'
},
{
  id: 'USR009',
  fullName: 'Priya Sharma',
  firstName: 'Priya',
  middleName: '',
  lastName: 'Sharma',
  email: 'priya@student.edu',
  mobile: '+91 98765 43220',
  gender: 'Female',
  dob: '2009-02-28',
  designation: 'Student',
  department: 'Class 9-B',
  grNo: 'GR2024015',
  suId: 'SU09B015',
  linkedEntityId: 'STU2024015',
  linkedEntityName: 'Class 9-B',
  status: 'Active',
  hasLogin: true,
  username: 'priya.sharma',
  assignedRole: 'Student',
  createdOn: '2024-04-01',
  lastModified: '2024-04-01',
  lastLogin: 'Today, 09:15 AM',
  canDelete: false,
  deleteReason: 'Linked to active admission'
},
{
  id: 'USR010',
  fullName: 'Rajesh Kumar',
  firstName: 'Rajesh',
  middleName: '',
  lastName: 'Kumar',
  email: 'rajesh@email.com',
  mobile: '+91 98765 43221',
  gender: 'Male',
  dob: '1978-07-12',
  designation: 'Parent',
  department: 'Guardian',
  parentId: 'PAR2024002',
  linkedEntityId: 'PAR002',
  linkedEntityName: '1 Student',
  status: 'Active',
  hasLogin: true,
  username: 'rajesh.kumar',
  assignedRole: 'Parent',
  createdOn: '2024-04-01',
  lastModified: '2024-04-05',
  lastLogin: 'Yesterday, 06:00 PM',
  canDelete: false,
  deleteReason: 'Active parent account'
}];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const isStudentDesignation = (designation: string): boolean => {
  return STUDENT_DESIGNATIONS.includes(designation);
};
const isParentDesignation = (designation: string): boolean => {
  return PARENT_DESIGNATIONS.includes(designation);
};
const isStaffDesignation = (designation: string): boolean => {
  return STAFF_DESIGNATIONS.includes(designation);
};
const generateSuId = (grNo: string, department: string): string => {
  if (!grNo || !department) return '';
  const classMatch = department.match(/Class\s*(\d+)/i);
  const section = department.match(/-([A-Z])/i)?.[1] || 'A';
  if (classMatch) {
    const classNum = classMatch[1].padStart(2, '0');
    const grNum = grNo.replace(/\D/g, '').slice(-3).padStart(3, '0');
    return `SU${classNum}${section}${grNum}`;
  }
  return '';
};
const getAutoRole = (designation: string): string => {
  const roleMap: Record<string, string> = {
    Student: 'Student',
    Parent: 'Parent',
    Teacher: 'Teacher',
    Principal: 'Principal',
    'Vice Principal': 'Vice Principal',
    Accountant: 'Accountant',
    'HR Manager': 'HR Manager',
    'System Admin': 'System Admin'
  };
  return roleMap[designation] || '';
};
// ============================================================================
// UI COMPONENTS
// ============================================================================
const Card = ({
  children,
  className = '',
  noPadding = false




}: {children: React.ReactNode;className?: string;noPadding?: boolean;}) =>
<div
  className={`bg-white rounded-xl border border-slate-200 shadow-sm ${noPadding ? '' : 'p-5'} ${className}`}>
  
    {children}
  </div>;

const Badge = ({
  variant,
  children,
  size = 'sm'




}: {variant: 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'outline';children: React.ReactNode;size?: 'xs' | 'sm';}) => {
  const variantStyles: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    outline: 'bg-white text-slate-700 border-slate-300'
  };
  const sizeStyles: Record<string, string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs'
  };
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      
      {children}
    </span>);

};
interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ComponentType<{
    className?: string;
  }>;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  hint?: string;
}
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  hint = ''
}: InputProps) =>
<div className={className}>
    {label &&
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
  }
    <div className="relative">
      {Icon &&
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    }
      <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full border border-slate-200 rounded-lg py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${Icon ? 'pl-10 pr-4' : 'px-4'}`} />
    
    </div>
    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
  </div>;

interface SelectProps {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  hint?: string;
}
const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  hint = ''
}: SelectProps) =>
<div className={className}>
    {label &&
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
  }
    <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50">
    
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) =>
    <option key={option.value} value={option.value}>
          {option.label}
        </option>
    )}
    </select>
    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
  </div>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
}
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  actions
}: ModalProps) => {
  if (!isOpen) return null;
  const sizeStyles: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl'
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeStyles[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {subtitle &&
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            }
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {actions &&
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
            {actions}
          </div>
        }
      </div>
    </div>);

};
interface TabItem {
  id: string;
  label: string;
  icon?: ComponentType<{
    className?: string;
  }>;
}
const Tabs = ({
  tabs,
  activeTab,
  onChange




}: {tabs: TabItem[];activeTab: string;onChange: (id: string) => void;}) =>
<div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
    {tabs.map((tab) =>
  <button
    key={tab.id}
    onClick={() => onChange(tab.id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}>
    
        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
      </button>
  )}
  </div>;

// ============================================================================
// USER FORM MODAL - IDENTITY SECTION FIRST
// ============================================================================
interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  mobile: string;
  designation: string;
  department: string;
  grNo: string;
  suId: string;
  employeeId: string;
  parentId: string;
  linkedEntityId: string;
  linkedEntityName: string;
  generateLogin: boolean;
  assignRole: string;
  sendEmail: boolean;
  sendSMS: boolean;
  status: string;
}
const UserFormModal = ({
  isOpen,
  onClose,
  mode,
  user,
  onSave






}: {isOpen: boolean;onClose: () => void;mode: 'edit' | 'view';user: User | null;onSave: (data: FormState) => void;}) => {
  // IDENTITY TAB IS NOW FIRST
  const [activeTab, setActiveTab] = useState('identity');
  const [form, setForm] = useState<FormState>({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || '',
    dob: user?.dob || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    designation: user?.designation || '',
    department: user?.department || '',
    grNo: user?.grNo || '',
    suId: user?.suId || '',
    employeeId: user?.employeeId || '',
    parentId: user?.parentId || '',
    linkedEntityId: user?.linkedEntityId || '',
    linkedEntityName: user?.linkedEntityName || '',
    generateLogin: true,
    assignRole: user?.assignedRole || '',
    sendEmail: false,
    sendSMS: false,
    status: user?.status || 'Active'
  });
  const isViewMode = mode === 'view';
  const isStudent = isStudentDesignation(form.designation);
  const isParent = isParentDesignation(form.designation);
  const isStaff = isStaffDesignation(form.designation);
  // REORDERED TABS: Identity first, then Personal
  const tabs: TabItem[] = [
  {
    id: 'identity',
    label: 'Identity',
    icon: IdCard
  },
  {
    id: 'personal',
    label: 'Personal',
    icon: User
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail
  },
  {
    id: 'work',
    label: 'Work',
    icon: Briefcase
  },
  ...(isViewMode ?
  [] :
  [
  {
    id: 'account',
    label: 'Account',
    icon: Shield
  }])];


  const handleDesignationChange = (newDesignation: string) => {
    setForm({
      ...form,
      designation: newDesignation,
      grNo: isStudentDesignation(newDesignation) ? form.grNo : '',
      suId: isStudentDesignation(newDesignation) ? form.suId : '',
      employeeId: isStaffDesignation(newDesignation) ? form.employeeId : '',
      parentId: isParentDesignation(newDesignation) ? form.parentId : '',
      assignRole: getAutoRole(newDesignation) || form.assignRole
    });
  };
  const handleGrNoChange = (newGrNo: string) => {
    setForm({
      ...form,
      grNo: newGrNo,
      suId: generateSuId(newGrNo, form.department) || form.suId
    });
  };
  const handleDepartmentChange = (newDepartment: string) => {
    setForm({
      ...form,
      department: newDepartment,
      suId: isStudent ?
      generateSuId(form.grNo, newDepartment) || form.suId :
      form.suId
    });
  };
  const handleSave = () => {
    onSave(form);
    onClose();
  };
  const renderIdentityTab = () =>
  <div className="space-y-6">
      {/* Designation Selection - Always First */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <Select
        label="User Type / Designation"
        required
        options={DESIGNATIONS.map((d) => ({
          value: d,
          label: d
        }))}
        value={form.designation}
        onChange={handleDesignationChange}
        disabled={isViewMode}
        placeholder="Select designation first"
        hint="Select designation to see relevant ID fields" />
      
      </div>

      {/* Student ID Fields */}
      {(isStudent || isViewMode && user?.grNo) &&
    <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-pink-600" />
            <h4 className="font-semibold text-pink-900">
              Student Identification
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
          label="GR Number (General Register)"
          required={isStudent}
          icon={Hash}
          value={form.grNo}
          onChange={(e) => handleGrNoChange(e.target.value)}
          disabled={isViewMode}
          placeholder="e.g., GR2024001"
          hint="Unique school registration number" />
        
            <Input
          label="SU ID (Student Unique ID)"
          required={isStudent}
          icon={BadgeCheck}
          value={form.suId}
          onChange={(e) =>
          setForm({
            ...form,
            suId: e.target.value
          })
          }
          disabled={isViewMode}
          placeholder="e.g., SU10A001"
          hint="Auto-generated based on class & GR" />
        
          </div>
          {!isViewMode && isStudent &&
      <div className="flex items-start gap-2 p-3 bg-pink-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-pink-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-pink-800">
                GR Number is the primary identifier assigned during admission.
                SU ID is a class-specific unique identifier.
              </p>
            </div>
      }
        </div>
    }

      {/* Staff ID Fields */}
      {(isStaff || isViewMode && user?.employeeId) &&
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">
              Staff Identification
            </h4>
          </div>
          <Input
        label="Employee ID"
        required={isStaff}
        icon={IdCard}
        value={form.employeeId}
        onChange={(e) =>
        setForm({
          ...form,
          employeeId: e.target.value
        })
        }
        disabled={isViewMode}
        placeholder="e.g., EMP2024001"
        hint="Unique employee identification number" />
      
          {!isViewMode && isStaff &&
      <div className="flex items-start gap-2 p-3 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Employee ID is assigned by HR during onboarding. This ID is used
                for payroll and attendance.
              </p>
            </div>
      }
        </div>
    }

      {/* Parent ID Fields */}
      {(isParent || isViewMode && user?.parentId) &&
    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-amber-600" />
            <h4 className="font-semibold text-amber-900">
              Parent/Guardian Identification
            </h4>
          </div>
          <Input
        label="Parent ID"
        required={isParent}
        icon={IdCard}
        value={form.parentId}
        onChange={(e) =>
        setForm({
          ...form,
          parentId: e.target.value
        })
        }
        disabled={isViewMode}
        placeholder="e.g., PAR2024001"
        hint="Unique parent/guardian identification number" />
      
          {!isViewMode && isParent &&
      <div className="flex items-start gap-2 p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Parent ID links to student records. One parent can be linked to
                multiple students.
              </p>
            </div>
      }
        </div>
    }

      {/* No designation selected placeholder */}
      {!form.designation && !isViewMode &&
    <div className="text-center py-8 text-slate-500">
          <IdCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>Select a designation above to see relevant ID fields</p>
        </div>
    }
    </div>;

  const renderPersonalTab = () =>
  <div className="grid grid-cols-2 gap-4">
      <Input
      label="First Name"
      required
      value={form.firstName}
      onChange={(e) =>
      setForm({
        ...form,
        firstName: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="Enter first name" />
    
      <Input
      label="Middle Name"
      value={form.middleName}
      onChange={(e) =>
      setForm({
        ...form,
        middleName: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="Enter middle name" />
    
      <Input
      label="Last Name"
      required
      value={form.lastName}
      onChange={(e) =>
      setForm({
        ...form,
        lastName: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="Enter last name" />
    
      <Select
      label="Gender"
      required
      options={GENDERS.map((g) => ({
        value: g,
        label: g
      }))}
      value={form.gender}
      onChange={(v) =>
      setForm({
        ...form,
        gender: v
      })
      }
      disabled={isViewMode}
      placeholder="Select" />
    
      <Input
      label="Date of Birth"
      required
      type="date"
      value={form.dob}
      onChange={(e) =>
      setForm({
        ...form,
        dob: e.target.value
      })
      }
      disabled={isViewMode} />
    
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Profile Photo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
          {!isViewMode &&
        <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
        }
        </div>
      </div>
    </div>;

  const renderContactTab = () =>
  <div className="space-y-4">
      <Input
      label="Email Address"
      required
      type="email"
      icon={Mail}
      value={form.email}
      onChange={(e) =>
      setForm({
        ...form,
        email: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="Enter email" />
    
      <Input
      label="Mobile Number"
      required
      icon={Phone}
      value={form.mobile}
      onChange={(e) =>
      setForm({
        ...form,
        mobile: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="Enter mobile" />
    
      {isViewMode && user &&
    <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Created:</span>
            <span className="font-medium ml-2">{user.createdOn}</span>
          </div>
          <div>
            <span className="text-slate-500">Modified:</span>
            <span className="font-medium ml-2">{user.lastModified}</span>
          </div>
          <div>
            <span className="text-slate-500">Last Login:</span>
            <span className="font-medium ml-2">
              {user.lastLogin || 'Never'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">User ID:</span>
            <code className="ml-2 bg-slate-200 px-2 py-0.5 rounded text-xs">
              {user.id}
            </code>
          </div>
        </div>
    }
    </div>;

  const renderWorkTab = () =>
  <div className="grid grid-cols-2 gap-4">
      <Select
      label="Designation"
      required
      options={DESIGNATIONS.map((d) => ({
        value: d,
        label: d
      }))}
      value={form.designation}
      onChange={handleDesignationChange}
      disabled={isViewMode}
      placeholder="Select" />
    
      <Select
      label="Department / Class"
      required
      options={DEPARTMENTS.map((d) => ({
        value: d,
        label: d
      }))}
      value={form.department}
      onChange={handleDepartmentChange}
      disabled={isViewMode}
      placeholder="Select" />
    
      <Input
      label="Linked Entity ID"
      icon={Link}
      value={form.linkedEntityId}
      onChange={(e) =>
      setForm({
        ...form,
        linkedEntityId: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="e.g., STU2024001" />
    
      <Input
      label="Entity Description"
      value={form.linkedEntityName}
      onChange={(e) =>
      setForm({
        ...form,
        linkedEntityName: e.target.value
      })
      }
      disabled={isViewMode}
      placeholder="e.g., Class 10-A" />
    
      {!isViewMode &&
    <Select
      label="Status"
      className="col-span-2"
      options={[
      {
        value: 'Active',
        label: 'Active'
      },
      {
        value: 'Inactive',
        label: 'Inactive'
      },
      {
        value: 'Suspended',
        label: 'Suspended'
      }]
      }
      value={form.status}
      onChange={(v) =>
      setForm({
        ...form,
        status: v
      })
      } />

    }
      {isViewMode && user &&
    <div className="col-span-2 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Identification Numbers
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {user.grNo &&
          <div>
                  <span className="text-xs text-slate-500">GR Number:</span>
                  <p className="font-mono text-sm mt-1">
                    <Badge variant="info">{user.grNo}</Badge>
                  </p>
                </div>
          }
              {user.suId &&
          <div>
                  <span className="text-xs text-slate-500">SU ID:</span>
                  <p className="font-mono text-sm mt-1">
                    <Badge variant="info">{user.suId}</Badge>
                  </p>
                </div>
          }
              {user.employeeId &&
          <div>
                  <span className="text-xs text-slate-500">Employee ID:</span>
                  <p className="font-mono text-sm mt-1">
                    <Badge variant="info">{user.employeeId}</Badge>
                  </p>
                </div>
          }
              {user.parentId &&
          <div>
                  <span className="text-xs text-slate-500">Parent ID:</span>
                  <p className="font-mono text-sm mt-1">
                    <Badge variant="info">{user.parentId}</Badge>
                  </p>
                </div>
          }
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="flex-1">
              <span className="text-sm text-slate-500">Status:</span>
              <div className="mt-1">
                <Badge
              variant={
              user.status === 'Active' ?
              'success' :
              user.status === 'Suspended' ?
              'danger' :
              'secondary'
              }>
              
                  {user.status}
                </Badge>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-500">Can Delete:</span>
              <div className="mt-1">
                {user.canDelete ?
            <Badge variant="success">Yes</Badge> :

            <Badge variant="danger">No - {user.deleteReason}</Badge>
            }
              </div>
            </div>
          </div>
        </div>
    }
    </div>;

  const renderAccountTab = () =>
  <div className="space-y-6">
      <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
        <input
        type="checkbox"
        checked={form.generateLogin}
        onChange={(e) =>
        setForm({
          ...form,
          generateLogin: e.target.checked
        })
        }
        className="w-5 h-5 rounded text-blue-600 mt-0.5" />
      
        <div>
          <span className="text-sm font-medium text-slate-700">
            Generate Login Credentials
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Create username and password for this user
          </p>
        </div>
      </label>

      {form.generateLogin &&
    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <Select
        label="Assign Role"
        required
        options={ROLES.map((r) => ({
          value: r,
          label: r
        }))}
        value={form.assignRole}
        onChange={(v) =>
        setForm({
          ...form,
          assignRole: v
        })
        }
        placeholder="Select role" />
      
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Notifications</p>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
            type="checkbox"
            checked={form.sendEmail}
            onChange={(e) =>
            setForm({
              ...form,
              sendEmail: e.target.checked
            })
            }
            className="rounded text-blue-600" />
          
              <Mail className="w-4 h-4" /> Send Welcome Email
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
            type="checkbox"
            checked={form.sendSMS}
            onChange={(e) =>
            setForm({
              ...form,
              sendSMS: e.target.checked
            })
            }
            className="rounded text-blue-600" />
          
              <MessageSquare className="w-4 h-4" /> Send Login SMS
            </label>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-xs text-blue-800">
            <strong>Note:</strong> Username will be firstname.lastname. Default
            password: Welcome@123
          </div>
        </div>
    }
    </div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'identity':
        return renderIdentityTab();
      case 'personal':
        return renderPersonalTab();
      case 'contact':
        return renderContactTab();
      case 'work':
        return renderWorkTab();
      case 'account':
        return renderAccountTab();
      default:
        return null;
    }
  };
  const modalActions = !isViewMode ?
  <>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        <Save className="w-4 h-4 mr-2" />
        Update User
      </Button>
    </> :
  null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'User Details' : 'Edit User'}
      subtitle={user?.fullName}
      size="lg"
      actions={modalActions}>
      
      <div className="space-y-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </Modal>);

};
// ============================================================================
// DELETE MODAL
// ============================================================================
const DeleteModal = ({
  isOpen,
  onClose,
  user,
  onDelete





}: {isOpen: boolean;onClose: () => void;user: User | null;onDelete: () => void;}) => {
  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="sm">
      <div className="text-center py-4">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${user.canDelete ? 'bg-red-100' : 'bg-slate-100'}`}>
          
          {user.canDelete ?
          <Trash2 className="w-8 h-8 text-red-600" /> :

          <XCircle className="w-8 h-8 text-slate-400" />
          }
        </div>
        {user.canDelete ?
        <>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Delete {user.fullName}?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This will soft-delete the user. Record retained for audit.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </> :

        <>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Cannot Delete
            </h3>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-800">
              {user.deleteReason}
            </div>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </>
        }
      </div>
    </Modal>);

};
// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function UserMaster() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [filters, setFilters] = useState({
    search: '',
    designation: '',
    role: '',
    status: ''
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('view');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const openUserModal = (mode: 'edit' | 'view', user?: User) => {
    setModalMode(mode);
    setSelectedUser(user || null);
    setShowUserModal(true);
  };
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };
  const handleSaveUser = (formData: FormState) => {
    console.log('Saving user:', formData);
    // Add save logic here
  };
  const filteredUsers = users.filter((user) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
    !filters.search ||
    user.fullName.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower) ||
    user.mobile.includes(filters.search) ||
    user.designation.toLowerCase().includes(searchLower) ||
    (user.assignedRole?.toLowerCase() || '').includes(searchLower) ||
    (user.grNo?.toLowerCase() || '').includes(searchLower) ||
    (user.suId?.toLowerCase() || '').includes(searchLower) ||
    (user.employeeId?.toLowerCase() || '').includes(searchLower) ||
    (user.parentId?.toLowerCase() || '').includes(searchLower);
    const matchesDesignation =
    !filters.designation ||
    filters.designation === 'All' ||
    user.designation === filters.designation;
    const matchesRole =
    !filters.role ||
    filters.role === 'All' ||
    user.assignedRole === filters.role;
    const matchesStatus =
    !filters.status ||
    filters.status === 'All' ||
    user.status === filters.status;
    return matchesSearch && matchesDesignation && matchesRole && matchesStatus;
  });
  const stats = [
  {
    label: 'Total Users',
    value: users.length,
    icon: Users,
    color: 'blue'
  },
  {
    label: 'Students',
    value: users.filter((u) => u.designation === 'Student').length,
    icon: GraduationCap,
    color: 'pink'
  },
  {
    label: 'Staff',
    value: users.filter((u) => STAFF_DESIGNATIONS.includes(u.designation)).
    length,
    icon: Briefcase,
    color: 'purple'
  },
  {
    label: 'Parents',
    value: users.filter((u) => u.designation === 'Parent').length,
    icon: Users,
    color: 'amber'
  },
  {
    label: 'With Login',
    value: users.filter((u) => u.hasLogin).length,
    icon: Shield,
    color: 'emerald'
  },
  {
    label: 'Active',
    value: users.filter((u) => u.status === 'Active').length,
    icon: CheckCircle,
    color: 'green'
  }];

  const resetFilters = () => {
    setFilters({
      search: '',
      designation: '',
      role: '',
      status: ''
    });
  };
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <IdCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Master</h1>
            <p className="text-sm text-slate-500">
              Core identity registry - Students, Staff & Parents
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) =>
        <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
              <div
              className={`w-11 h-11 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
              
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value
              })
              }
              placeholder="Search name, email, mobile, GR No, SU ID, Emp ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
          </div>
          <Select
            options={[
            {
              value: 'All',
              label: 'All Designations'
            },
            ...DESIGNATIONS.map((d) => ({
              value: d,
              label: d
            }))]
            }
            value={filters.designation}
            onChange={(v) =>
            setFilters({
              ...filters,
              designation: v
            })
            } />
          
          <Select
            options={[
            {
              value: 'All',
              label: 'All Roles'
            },
            ...ROLES.map((r) => ({
              value: r,
              label: r
            }))]
            }
            value={filters.role}
            onChange={(v) =>
            setFilters({
              ...filters,
              role: v
            })
            } />
          
          <Button variant="outline" onClick={resetFilters}>
            <RefreshCw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card noPadding>
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <p className="text-sm text-slate-600">
            Showing <strong>{filteredUsers.length}</strong> of{' '}
            <strong>{users.length}</strong> users
          </p>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                'User',
                'ID Numbers',
                'Contact',
                'Designation',
                'Role',
                'Login',
                'Status',
                'Actions'].
                map((header) =>
                <th
                  key={header}
                  className={`px-4 py-3 text-${header === 'Actions' ? 'center' : 'left'} text-xs font-semibold text-slate-600 uppercase`}>
                  
                    {header}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) =>
              <tr
                key={user.id}
                className="hover:bg-slate-50 transition-colors">
                
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {user.grNo &&
                    <p className="text-xs">
                          <span className="text-slate-500">GR:</span>{' '}
                          <code className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono">
                            {user.grNo}
                          </code>
                        </p>
                    }
                      {user.suId &&
                    <p className="text-xs">
                          <span className="text-slate-500">SU:</span>{' '}
                          <code className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono">
                            {user.suId}
                          </code>
                        </p>
                    }
                      {user.employeeId &&
                    <p className="text-xs">
                          <span className="text-slate-500">Emp:</span>{' '}
                          <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                            {user.employeeId}
                          </code>
                        </p>
                    }
                      {user.parentId &&
                    <p className="text-xs">
                          <span className="text-slate-500">Parent:</span>{' '}
                          <code className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono">
                            {user.parentId}
                          </code>
                        </p>
                    }
                      {!user.grNo &&
                    !user.suId &&
                    !user.employeeId &&
                    !user.parentId &&
                    <span className="text-xs text-slate-400">-</span>
                    }
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {user.mobile}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {user.designation}
                    </p>
                    <p className="text-xs text-slate-500">{user.department}</p>
                  </td>
                  <td className="px-4 py-4">
                    {user.assignedRole ?
                  <Badge variant="info">{user.assignedRole}</Badge> :

                  <span className="text-xs text-slate-400">
                        Not assigned
                      </span>
                  }
                  </td>
                  <td className="px-4 py-4">
                    {user.hasLogin ?
                  <Badge variant="success">
                        <Shield className="w-3 h-3 mr-1" />
                        Enabled
                      </Badge> :

                  <Badge variant="secondary">No Login</Badge>
                  }
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                    variant={
                    user.status === 'Active' ?
                    'success' :
                    user.status === 'Suspended' ?
                    'danger' :
                    'secondary'
                    }>
                    
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                      onClick={() => openUserModal('view', user)}
                      className="p-2 hover:bg-slate-200 rounded-lg"
                      title="View">
                      
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                      onClick={() => openUserModal('edit', user)}
                      className="p-2 hover:bg-slate-200 rounded-lg"
                      title="Edit">
                      
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className={`p-2 rounded-lg ${user.canDelete ? 'hover:bg-red-100' : 'opacity-50 cursor-not-allowed'}`}
                      title={user.canDelete ? 'Delete' : user.deleteReason}
                      disabled={!user.canDelete}>
                      
                        <Trash2
                        className={`w-4 h-4 ${user.canDelete ? 'text-red-600' : 'text-slate-300'}`} />
                      
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 &&
        <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No users found</p>
          </div>
        }
      </Card>

      {/* Modals */}
      <UserFormModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        mode={modalMode}
        user={selectedUser}
        onSave={handleSaveUser} />
      

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        user={selectedUser}
        onDelete={handleDeleteUser} />
      




    </div>);

}
export default UserMaster;