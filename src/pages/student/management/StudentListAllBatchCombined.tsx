import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import {
  SearchIcon,
  DownloadIcon,
  RotateCcwIcon,
  UsersIcon,
  FileSpreadsheetIcon,
  UserIcon,
  XIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PrinterIcon,
  ArchiveIcon,
  CalendarIcon,
  InfoIcon,
  CheckCircleIcon,
  UserCheckIcon } from
'lucide-react';

// Types
interface Student {
  id: number;
  grNo: string;
  suId: string;
  firstName: string;
  lastName: string;
  photo: string;
  department: string;
  lastClass: string;
  section: string;
  academicYear: string;
  leavingYear: string;
  category: string;
  gender: string;
  leavingReason: string;
  leavingDate: string;
  // New fields
  ews: string;
  rte: string;
  minority: string;
  religion: string;
  caste: string;
  subCaste: string;
  admissionType: string;
  fatherName: string;
  motherName: string;
  contactNo: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  bloodGroup: string;
  nationality: string;
}

// Sample data for students who have left
const allStudentsData: Student[] = [
{
  id: 1,
  grNo: 'GR-2020-001',
  suId: 'SU-2020-001',
  firstName: 'Aarav',
  lastName: 'Sharma',
  photo: '/api/placeholder/40/40',
  department: 'Science',
  lastClass: '12',
  section: 'A',
  academicYear: '2023-24',
  leavingYear: '2024',
  category: 'General',
  gender: 'Male',
  leavingReason: 'Pass Out',
  leavingDate: '15 Mar 2024',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Brahmin',
  subCaste: 'Sharma',
  admissionType: 'Regular',
  fatherName: 'Rajesh Sharma',
  motherName: 'Sunita Sharma',
  contactNo: '9876543210',
  address: '123, Main Street, Mumbai',
  dateOfBirth: '2006-05-15',
  admissionDate: '2020-06-01',
  bloodGroup: 'B+',
  nationality: 'Indian'
},
{
  id: 2,
  grNo: 'GR-2019-045',
  suId: 'SU-2019-045',
  firstName: 'Priya',
  lastName: 'Patel',
  photo: '/api/placeholder/40/40',
  department: 'Commerce',
  lastClass: '12',
  section: 'B',
  academicYear: '2023-24',
  leavingYear: '2024',
  category: 'OBC',
  gender: 'Female',
  leavingReason: 'Pass Out',
  leavingDate: '15 Mar 2024',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Patel',
  subCaste: 'Kadva Patel',
  admissionType: 'Regular',
  fatherName: 'Hitesh Patel',
  motherName: 'Meena Patel',
  contactNo: '9876543211',
  address: '456, Park Road, Ahmedabad',
  dateOfBirth: '2006-08-22',
  admissionDate: '2019-06-15',
  bloodGroup: 'O+',
  nationality: 'Indian'
},
{
  id: 3,
  grNo: 'GR-2021-078',
  suId: 'SU-2021-078',
  firstName: 'Rohan',
  lastName: 'Desai',
  photo: '/api/placeholder/40/40',
  department: 'Arts',
  lastClass: '10',
  section: 'A',
  academicYear: '2022-23',
  leavingYear: '2023',
  category: 'General',
  gender: 'Male',
  leavingReason: 'Transferred',
  leavingDate: '20 Jun 2023',
  ews: 'Yes',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Desai',
  subCaste: 'Anavil',
  admissionType: 'Transfer',
  fatherName: 'Kiran Desai',
  motherName: 'Anjali Desai',
  contactNo: '9876543212',
  address: '789, Lake View, Surat',
  dateOfBirth: '2008-03-10',
  admissionDate: '2021-07-01',
  bloodGroup: 'A+',
  nationality: 'Indian'
},
{
  id: 4,
  grNo: 'GR-2020-112',
  suId: 'SU-2020-112',
  firstName: 'Sneha',
  lastName: 'Kulkarni',
  photo: '/api/placeholder/40/40',
  department: 'Science',
  lastClass: '11',
  section: 'C',
  academicYear: '2022-23',
  leavingYear: '2023',
  category: 'SC',
  gender: 'Female',
  leavingReason: 'Family Relocation',
  leavingDate: '10 Aug 2023',
  ews: 'No',
  rte: 'Yes',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Mahar',
  subCaste: '',
  admissionType: 'RTE',
  fatherName: 'Vinod Kulkarni',
  motherName: 'Savita Kulkarni',
  contactNo: '9876543213',
  address: '321, Hill Road, Pune',
  dateOfBirth: '2007-11-28',
  admissionDate: '2020-06-15',
  bloodGroup: 'AB+',
  nationality: 'Indian'
},
{
  id: 5,
  grNo: 'GR-2018-034',
  suId: 'SU-2018-034',
  firstName: 'Vikram',
  lastName: 'Joshi',
  photo: '/api/placeholder/40/40',
  department: 'Commerce',
  lastClass: '12',
  section: 'A',
  academicYear: '2021-22',
  leavingYear: '2022',
  category: 'General',
  gender: 'Male',
  leavingReason: 'Pass Out',
  leavingDate: '01 Apr 2022',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Brahmin',
  subCaste: 'Joshi',
  admissionType: 'Management',
  fatherName: 'Prakash Joshi',
  motherName: 'Rekha Joshi',
  contactNo: '9876543214',
  address: '555, Garden City, Nagpur',
  dateOfBirth: '2004-07-19',
  admissionDate: '2018-06-01',
  bloodGroup: 'B-',
  nationality: 'Indian'
},
{
  id: 6,
  grNo: 'GR-2021-156',
  suId: 'SU-2021-156',
  firstName: 'Ananya',
  lastName: 'Reddy',
  photo: '/api/placeholder/40/40',
  department: 'Science',
  lastClass: '9',
  section: 'B',
  academicYear: '2022-23',
  leavingYear: '2023',
  category: 'OBC',
  gender: 'Female',
  leavingReason: 'Rusticated',
  leavingDate: '15 Nov 2023',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Reddy',
  subCaste: '',
  admissionType: 'Regular',
  fatherName: 'Suresh Reddy',
  motherName: 'Lakshmi Reddy',
  contactNo: '9876543215',
  address: '888, MG Road, Hyderabad',
  dateOfBirth: '2009-01-05',
  admissionDate: '2021-06-10',
  bloodGroup: 'O-',
  nationality: 'Indian'
},
{
  id: 7,
  grNo: 'GR-2019-089',
  suId: 'SU-2019-089',
  firstName: 'Karan',
  lastName: 'Mehta',
  photo: '/api/placeholder/40/40',
  department: 'Arts',
  lastClass: '12',
  section: 'C',
  academicYear: '2023-24',
  leavingYear: '2024',
  category: 'ST',
  gender: 'Male',
  leavingReason: 'Pass Out',
  leavingDate: '20 Mar 2024',
  ews: 'Yes',
  rte: 'Yes',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Bhil',
  subCaste: '',
  admissionType: 'RTE',
  fatherName: 'Ramesh Mehta',
  motherName: 'Kamla Mehta',
  contactNo: '9876543216',
  address: '111, Tribal Colony, Nashik',
  dateOfBirth: '2006-09-12',
  admissionDate: '2019-07-01',
  bloodGroup: 'A-',
  nationality: 'Indian'
},
{
  id: 8,
  grNo: 'GR-2020-067',
  suId: 'SU-2020-067',
  firstName: 'Neha',
  lastName: 'Gupta',
  photo: '/api/placeholder/40/40',
  department: 'Commerce',
  lastClass: '10',
  section: 'B',
  academicYear: '2021-22',
  leavingYear: '2022',
  category: 'General',
  gender: 'Female',
  leavingReason: 'Health Issues',
  leavingDate: '05 Sep 2022',
  ews: 'No',
  rte: 'No',
  minority: 'Yes',
  religion: 'Jain',
  caste: 'Jain',
  subCaste: 'Agarwal',
  admissionType: 'Regular',
  fatherName: 'Sanjay Gupta',
  motherName: 'Neelam Gupta',
  contactNo: '9876543217',
  address: '222, Jain Society, Mumbai',
  dateOfBirth: '2008-04-25',
  admissionDate: '2020-06-20',
  bloodGroup: 'B+',
  nationality: 'Indian'
},
{
  id: 9,
  grNo: 'GR-2022-023',
  suId: 'SU-2022-023',
  firstName: 'Arjun',
  lastName: 'Singh',
  photo: '/api/placeholder/40/40',
  department: 'Science',
  lastClass: '8',
  section: 'A',
  academicYear: '2023-24',
  leavingYear: '2024',
  category: 'OBC',
  gender: 'Male',
  leavingReason: 'Financial Issues',
  leavingDate: '10 Jan 2024',
  ews: 'Yes',
  rte: 'Yes',
  minority: 'Yes',
  religion: 'Sikh',
  caste: 'Jat',
  subCaste: '',
  admissionType: 'RTE',
  fatherName: 'Gurpreet Singh',
  motherName: 'Harpreet Kaur',
  contactNo: '9876543218',
  address: '333, Gurudwara Road, Amritsar',
  dateOfBirth: '2010-06-30',
  admissionDate: '2022-04-01',
  bloodGroup: 'O+',
  nationality: 'Indian'
},
{
  id: 10,
  grNo: 'GR-2017-145',
  suId: 'SU-2017-145',
  firstName: 'Meera',
  lastName: 'Krishnan',
  photo: '/api/placeholder/40/40',
  department: 'Arts',
  lastClass: '12',
  section: 'B',
  academicYear: '2020-21',
  leavingYear: '2021',
  category: 'General',
  gender: 'Female',
  leavingReason: 'Pass Out',
  leavingDate: '25 Mar 2021',
  ews: 'No',
  rte: 'No',
  minority: 'No',
  religion: 'Hindu',
  caste: 'Nair',
  subCaste: '',
  admissionType: 'Regular',
  fatherName: 'Raman Krishnan',
  motherName: 'Lakshmi Krishnan',
  contactNo: '9876543219',
  address: '444, MG Road, Kochi',
  dateOfBirth: '2003-12-08',
  admissionDate: '2017-06-01',
  bloodGroup: 'AB-',
  nationality: 'Indian'
},
{
  id: 11,
  grNo: 'GR-2020-189',
  suId: 'SU-2020-189',
  firstName: 'Imran',
  lastName: 'Khan',
  photo: '/api/placeholder/40/40',
  department: 'Science',
  lastClass: '11',
  section: 'A',
  academicYear: '2022-23',
  leavingYear: '2023',
  category: 'General',
  gender: 'Male',
  leavingReason: 'Transferred',
  leavingDate: '30 May 2023',
  ews: 'No',
  rte: 'No',
  minority: 'Yes',
  religion: 'Islam',
  caste: 'Khan',
  subCaste: 'Pathan',
  admissionType: 'Transfer',
  fatherName: 'Ahmed Khan',
  motherName: 'Fatima Khan',
  contactNo: '9876543220',
  address: '555, Bandra West, Mumbai',
  dateOfBirth: '2007-02-14',
  admissionDate: '2020-07-15',
  bloodGroup: 'A+',
  nationality: 'Indian'
},
{
  id: 12,
  grNo: 'GR-2019-234',
  suId: 'SU-2019-234',
  firstName: 'Sarah',
  lastName: 'Thomas',
  photo: '/api/placeholder/40/40',
  department: 'Commerce',
  lastClass: '12',
  section: 'A',
  academicYear: '2023-24',
  leavingYear: '2024',
  category: 'General',
  gender: 'Female',
  leavingReason: 'Pass Out',
  leavingDate: '18 Mar 2024',
  ews: 'No',
  rte: 'No',
  minority: 'Yes',
  religion: 'Christian',
  caste: 'Syrian Christian',
  subCaste: '',
  admissionType: 'Regular',
  fatherName: 'George Thomas',
  motherName: 'Mary Thomas',
  contactNo: '9876543221',
  address: '666, Church Road, Kochi',
  dateOfBirth: '2006-10-20',
  admissionDate: '2019-06-01',
  bloodGroup: 'B+',
  nationality: 'Indian'
}];


// Dropdown options
const departmentOptions = [
{ value: '', label: 'All Departments' },
{ value: 'Science', label: 'Science' },
{ value: 'Commerce', label: 'Commerce' },
{ value: 'Arts', label: 'Arts' },
{ value: 'Vocational', label: 'Vocational' }];


const classOptions = [
{ value: '', label: 'All Classes' },
{ value: '1', label: 'Class 1' },
{ value: '2', label: 'Class 2' },
{ value: '3', label: 'Class 3' },
{ value: '4', label: 'Class 4' },
{ value: '5', label: 'Class 5' },
{ value: '6', label: 'Class 6' },
{ value: '7', label: 'Class 7' },
{ value: '8', label: 'Class 8' },
{ value: '9', label: 'Class 9' },
{ value: '10', label: 'Class 10' },
{ value: '11', label: 'Class 11' },
{ value: '12', label: 'Class 12' }];


const sectionOptions = [
{ value: '', label: 'All Sections' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' }];


const academicYearOptions = [
{ value: '', label: 'All Academic Years' },
{ value: '2024-25', label: '2024-25' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' },
{ value: '2021-22', label: '2021-22' },
{ value: '2020-21', label: '2020-21' },
{ value: '2019-20', label: '2019-20' },
{ value: '2018-19', label: '2018-19' }];


const leavingYearOptions = [
{ value: '', label: 'All Years' },
{ value: '2024', label: '2024' },
{ value: '2023', label: '2023' },
{ value: '2022', label: '2022' },
{ value: '2021', label: '2021' },
{ value: '2020', label: '2020' },
{ value: '2019', label: '2019' },
{ value: '2018', label: '2018' }];


const categoryOptions = [
{ value: '', label: 'All Categories' },
{ value: 'General', label: 'General' },
{ value: 'OBC', label: 'OBC' },
{ value: 'SC', label: 'SC' },
{ value: 'ST', label: 'ST' },
{ value: 'EBC', label: 'EBC' },
{ value: 'NT', label: 'NT' },
{ value: 'VJ', label: 'VJ' },
{ value: 'SBC', label: 'SBC' }];


const genderOptions = [
{ value: '', label: 'All Genders' },
{ value: 'Male', label: 'Male' },
{ value: 'Female', label: 'Female' },
{ value: 'Other', label: 'Other' }];


const ewsOptions = [
{ value: '', label: 'All' },
{ value: 'Yes', label: 'Yes - EWS' },
{ value: 'No', label: 'No - Not EWS' }];


const rteOptions = [
{ value: '', label: 'All' },
{ value: 'Yes', label: 'Yes - RTE' },
{ value: 'No', label: 'No - Not RTE' }];


const minorityOptions = [
{ value: '', label: 'All' },
{ value: 'Yes', label: 'Yes - Minority' },
{ value: 'No', label: 'No - Not Minority' }];


const religionOptions = [
{ value: '', label: 'All Religions' },
{ value: 'Hindu', label: 'Hindu' },
{ value: 'Islam', label: 'Islam' },
{ value: 'Christian', label: 'Christian' },
{ value: 'Sikh', label: 'Sikh' },
{ value: 'Buddhist', label: 'Buddhist' },
{ value: 'Jain', label: 'Jain' },
{ value: 'Parsi', label: 'Parsi' },
{ value: 'Other', label: 'Other' }];


const admissionTypeOptions = [
{ value: '', label: 'All Types' },
{ value: 'Regular', label: 'Regular' },
{ value: 'RTE', label: 'RTE' },
{ value: 'Management', label: 'Management' },
{ value: 'Transfer', label: 'Transfer' },
{ value: 'Sports Quota', label: 'Sports Quota' },
{ value: 'Staff Quota', label: 'Staff Quota' }];


const leavingReasonOptions = [
{ value: '', label: 'All Reasons' },
{ value: 'Pass Out', label: 'Pass Out' },
{ value: 'Transferred', label: 'Transferred' },
{ value: 'Rusticated', label: 'Rusticated' },
{ value: 'Expelled', label: 'Expelled' },
{ value: 'Dropout', label: 'Dropout' },
{ value: 'Health Issues', label: 'Health Issues' },
{ value: 'Family Relocation', label: 'Family Relocation' },
{ value: 'Financial Issues', label: 'Financial Issues' },
{ value: 'Migration', label: 'Migration' },
{ value: 'Admission Cancelled', label: 'Admission Cancelled' },
{ value: 'Death', label: 'Death' },
{ value: 'Other', label: 'Other' }];


interface FilterState {
  grNo: string;
  suId: string;
  firstName: string;
  lastName: string;
  department: string;
  leavingYear: string;
  lastClass: string;
  section: string;
  academicYear: string;
  category: string;
  gender: string;
  showWithPhoto: boolean;
  leavingReason: string;
  // New filters
  ews: string;
  rte: string;
  minority: string;
  religion: string;
  caste: string;
  admissionType: string;
}

const initialFilters: FilterState = {
  grNo: '',
  suId: '',
  firstName: '',
  lastName: '',
  department: '',
  leavingYear: '',
  lastClass: '',
  section: '',
  academicYear: '',
  category: '',
  gender: '',
  showWithPhoto: false,
  leavingReason: '',
  ews: '',
  rte: '',
  minority: '',
  religion: '',
  caste: '',
  admissionType: ''
};

export function StudentListAllBatchCombined() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const handleFilterChange = (
  field: keyof FilterState,
  value: string | boolean) =>
  {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    const results = allStudentsData.filter((student) => {
      // Text searches
      if (
      filters.grNo &&
      !student.grNo.toLowerCase().includes(filters.grNo.toLowerCase()))
      {
        return false;
      }
      if (
      filters.suId &&
      !student.suId.toLowerCase().includes(filters.suId.toLowerCase()))
      {
        return false;
      }
      if (
      filters.firstName &&
      !student.firstName.toLowerCase().includes(filters.firstName.toLowerCase()))
      {
        return false;
      }
      if (
      filters.lastName &&
      !student.lastName.toLowerCase().includes(filters.lastName.toLowerCase()))
      {
        return false;
      }
      if (
      filters.caste &&
      !student.caste.toLowerCase().includes(filters.caste.toLowerCase()))
      {
        return false;
      }

      // Dropdown filters
      if (filters.department && student.department !== filters.department) {
        return false;
      }
      if (filters.leavingYear && student.leavingYear !== filters.leavingYear) {
        return false;
      }
      if (filters.lastClass && student.lastClass !== filters.lastClass) {
        return false;
      }
      if (filters.section && student.section !== filters.section) {
        return false;
      }
      if (filters.academicYear && student.academicYear !== filters.academicYear) {
        return false;
      }
      if (filters.category && student.category !== filters.category) {
        return false;
      }
      if (filters.gender && student.gender !== filters.gender) {
        return false;
      }
      if (filters.leavingReason && student.leavingReason !== filters.leavingReason) {
        return false;
      }

      // New filters
      if (filters.ews && student.ews !== filters.ews) {
        return false;
      }
      if (filters.rte && student.rte !== filters.rte) {
        return false;
      }
      if (filters.minority && student.minority !== filters.minority) {
        return false;
      }
      if (filters.religion && student.religion !== filters.religion) {
        return false;
      }
      if (filters.admissionType && student.admissionType !== filters.admissionType) {
        return false;
      }

      return true;
    });

    setFilteredStudents(results);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setHasSearched(false);
    setFilteredStudents([]);
  };

  const handleExport = () => {
    console.log('Exporting student list...', filteredStudents);
    alert('Export functionality - would download student list as CSV/Excel');
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const getLeavingReasonBadgeVariant = (reason: string) => {
    switch (reason) {
      case 'Pass Out':
        return 'success';
      case 'Transferred':
        return 'info';
      case 'Rusticated':
      case 'Expelled':
        return 'danger';
      case 'Dropout':
      case 'Financial Issues':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAdmissionTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Regular':
        return 'success';
      case 'RTE':
        return 'info';
      case 'Management':
        return 'warning';
      case 'Transfer':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'showWithPhoto') return value === true;
    return value !== '';
  });

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'showWithPhoto') return value === true;
    return value !== '';
  }).length;

  const columns = [
  {
    key: 'grNo',
    header: 'GR No.',
    render: (row: Student) =>
    <span className="font-mono text-sm text-gray-700">{row.grNo}</span>

  },
  {
    key: 'suId',
    header: 'SU ID',
    render: (row: Student) =>
    <span className="font-mono text-sm text-gray-700">{row.suId}</span>

  },
  ...(filters.showWithPhoto ?
  [
  {
    key: 'photo',
    header: 'Photo',
    render: (row: Student) =>
    <div className="flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {row.firstName[0]}{row.lastName[0]}
                  </span>
                </div>
              </div>

  }] :

  []),
  {
    key: 'name',
    header: 'Student Name',
    render: (row: Student) =>
    <div>
          <span className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </span>
          <p className="text-xs text-gray-500">{row.fatherName}</p>
        </div>

  },
  {
    key: 'lastClass',
    header: 'Last Class',
    render: (row: Student) =>
    <span className="text-gray-700">
          {row.lastClass}-{row.section}
        </span>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: Student) =>
    <div className="flex flex-col gap-1">
          <Badge variant="secondary" className="text-xs">{row.category}</Badge>
          {row.ews === 'Yes' && <Badge variant="warning" className="text-xs">EWS</Badge>}
        </div>

  },
  {
    key: 'admissionType',
    header: 'Admission Type',
    render: (row: Student) =>
    <Badge variant={getAdmissionTypeBadgeVariant(row.admissionType) as any}>
          {row.admissionType}
        </Badge>

  },
  {
    key: 'leavingYear',
    header: 'Leaving Year',
    render: (row: Student) =>
    <span className="text-gray-700">{row.leavingYear}</span>

  },
  {
    key: 'leavingReason',
    header: 'Leaving Reason',
    render: (row: Student) =>
    <Badge variant={getLeavingReasonBadgeVariant(row.leavingReason) as any}>
          {row.leavingReason}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Student) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewStudent(row)}>

            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <PrinterIcon className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArchiveIcon className="w-7 h-7" />
            Student Archive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Search and view students who are no longer enrolled in the school
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="info">{allStudentsData.length} Total Records</Badge>
          <Button
            variant="primary"
            leftIcon={<FileSpreadsheetIcon className="h-4 w-4" />}
            onClick={handleExport}
            disabled={!hasSearched || filteredStudents.length === 0}>

            Export List
          </Button>
        </div>
      </div>

      {/* Search Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
            {activeFilterCount > 0 &&
            <Badge variant="info">{activeFilterCount} active</Badge>
            }
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>

              {showAdvancedFilters ?
              <>
                  <ChevronUpIcon className="w-4 h-4 mr-1" /> Hide Advanced
                </> :

              <>
                  <ChevronDownIcon className="w-4 h-4 mr-1" /> Show Advanced
                </>
              }
            </Button>
            {hasActiveFilters &&
            <Button variant="ghost" size="sm" onClick={handleReset}>
                <XIcon className="w-4 h-4 mr-1" /> Clear All
              </Button>
            }
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GR No.
            </label>
            <Input
              placeholder="Enter GR Number"
              value={filters.grNo}
              onChange={(e) => handleFilterChange('grNo', e.target.value)} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SU ID
            </label>
            <Input
              placeholder="Enter SU ID"
              value={filters.suId}
              onChange={(e) => handleFilterChange('suId', e.target.value)} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              placeholder="Enter First Name"
              value={filters.firstName}
              onChange={(e) => handleFilterChange('firstName', e.target.value)} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <Input
              placeholder="Enter Last Name"
              value={filters.lastName}
              onChange={(e) => handleFilterChange('lastName', e.target.value)} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Class
            </label>
            <select
              value={filters.lastClass}
              onChange={(e) => handleFilterChange('lastClass', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {classOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {sectionOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {departmentOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              value={filters.academicYear}
              onChange={(e) => handleFilterChange('academicYear', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {academicYearOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leaving Year
            </label>
            <select
              value={filters.leavingYear}
              onChange={(e) => handleFilterChange('leavingYear', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {leavingYearOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leaving Reason
            </label>
            <select
              value={filters.leavingReason}
              onChange={(e) => handleFilterChange('leavingReason', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {leavingReasonOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

              {genderOptions.map((option) =>
              <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer h-10">
              <input
                type="checkbox"
                checked={filters.showWithPhoto}
                onChange={(e) => handleFilterChange('showWithPhoto', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

              <span className="text-sm font-medium text-gray-700">
                Show with Photo
              </span>
            </label>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters &&
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              Category & Quota Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

                  {categoryOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EWS Status
                </label>
                <select
                value={filters.ews}
                onChange={(e) => handleFilterChange('ews', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

                  {ewsOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RTE Status
                </label>
                <select
                value={filters.rte}
                onChange={(e) => handleFilterChange('rte', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

                  {rteOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minority Status
                </label>
                <select
                value={filters.minority}
                onChange={(e) => handleFilterChange('minority', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

                  {minorityOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Religion
                </label>
                <select
                value={filters.religion}
                onChange={(e) => handleFilterChange('religion', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

                  {religionOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caste
                </label>
                <Input
                placeholder="Enter Caste"
                value={filters.caste}
                onChange={(e) => handleFilterChange('caste', e.target.value)} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Type
                </label>
                <select
                value={filters.admissionType}
                onChange={(e) => handleFilterChange('admissionType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">

                  {admissionTypeOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </select>
              </div>
            </div>
          </div>
        }

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="primary"
            leftIcon={<SearchIcon className="h-4 w-4" />}
            onClick={handleSearch}>

            Search Students
          </Button>
          <Button
            variant="outline"
            leftIcon={<RotateCcwIcon className="h-4 w-4" />}
            onClick={handleReset}>

            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {hasSearched &&
      <Card>
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? 's' : ''} found
                </span>
                {filteredStudents.length > 0 &&
              <div className="flex gap-2 ml-4">
                    <Badge variant="success">
                      {filteredStudents.filter((s) => s.leavingReason === 'Pass Out').length} Pass Out
                    </Badge>
                    <Badge variant="info">
                      {filteredStudents.filter((s) => s.rte === 'Yes').length} RTE
                    </Badge>
                    <Badge variant="warning">
                      {filteredStudents.filter((s) => s.ews === 'Yes').length} EWS
                    </Badge>
                  </div>
              }
              </div>
              {filteredStudents.length > 0 &&
            <div className="flex gap-2">
                  <Button
                variant="outline"
                size="sm"
                leftIcon={<PrinterIcon className="h-4 w-4" />}>

                    Print List
                  </Button>
                  <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="h-4 w-4" />}
                onClick={handleExport}>

                    Download Results
                  </Button>
                </div>
            }
            </div>
          </div>

          {filteredStudents.length > 0 ?
        <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) =>
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        {col.header}
                      </th>
                )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) =>
              <tr key={student.id} className="hover:bg-gray-50">
                      {columns.map((col) =>
                <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                          {col.render ? col.render(student) : (student as any)[col.key]}
                        </td>
                )}
                    </tr>
              )}
                </tbody>
              </table>
            </div> :

        <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Students Found
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                No students match your search criteria. Try adjusting your
                filters or search with different parameters.
              </p>
            </div>
        }
        </Card>
      }

      {/* Initial State - Before Search */}
      {!hasSearched &&
      <Card>
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-blue-50 p-4 mb-4">
              <SearchIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Search for Students
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Use the search filters above to find students who have left the
              school. You can search by GR number, name, class, category, admission type, and more.
            </p>
          </div>
        </Card>
      }

      {/* Student Detail Modal */}
      <Modal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        title="Student Details"
        size="xl">

        {selectedStudent &&
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-700">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{selectedStudent.grNo}</Badge>
                  <Badge variant="secondary">{selectedStudent.suId}</Badge>
                  <Badge variant={getLeavingReasonBadgeVariant(selectedStudent.leavingReason) as any}>
                    {selectedStudent.leavingReason}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic Info */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Father's Name:</span>
                    <span className="font-medium">{selectedStudent.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mother's Name:</span>
                    <span className="font-medium">{selectedStudent.motherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="font-medium">{selectedStudent.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium">{selectedStudent.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Blood Group:</span>
                    <span className="font-medium">{selectedStudent.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span className="font-medium">{selectedStudent.contactNo}</span>
                  </div>
                </div>
              </Card>

              {/* Academic Info */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <InfoIcon className="w-4 h-4" />
                  Academic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Class:</span>
                    <span className="font-medium">{selectedStudent.lastClass}-{selectedStudent.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{selectedStudent.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="font-medium">{selectedStudent.academicYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Admission Date:</span>
                    <span className="font-medium">{selectedStudent.admissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Admission Type:</span>
                    <Badge variant={getAdmissionTypeBadgeVariant(selectedStudent.admissionType) as any} className="text-xs">
                      {selectedStudent.admissionType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Leaving Date:</span>
                    <span className="font-medium">{selectedStudent.leavingDate}</span>
                  </div>
                </div>
              </Card>

              {/* Category Info */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <UserCheckIcon className="w-4 h-4" />
                  Category & Quota
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <Badge variant="secondary">{selectedStudent.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Religion:</span>
                    <span className="font-medium">{selectedStudent.religion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Caste:</span>
                    <span className="font-medium">{selectedStudent.caste}</span>
                  </div>
                  {selectedStudent.subCaste &&
                <div className="flex justify-between">
                      <span className="text-gray-500">Sub-Caste:</span>
                      <span className="font-medium">{selectedStudent.subCaste}</span>
                    </div>
                }
                  <div className="flex justify-between">
                    <span className="text-gray-500">EWS:</span>
                    <Badge variant={selectedStudent.ews === 'Yes' ? 'success' : 'secondary'}>
                      {selectedStudent.ews}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">RTE:</span>
                    <Badge variant={selectedStudent.rte === 'Yes' ? 'info' : 'secondary'}>
                      {selectedStudent.rte}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Minority:</span>
                    <Badge variant={selectedStudent.minority === 'Yes' ? 'warning' : 'secondary'}>
                      {selectedStudent.minority}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Address */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Address</h4>
              <p className="text-sm text-gray-600">{selectedStudent.address}</p>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowStudentModal(false)}>
                Close
              </Button>
              <Button variant="outline">
                <PrinterIcon className="w-4 h-4 mr-2" /> Print Details
              </Button>
              <Button variant="outline">
                <DownloadIcon className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}

export default StudentListAllBatchCombined;