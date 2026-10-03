import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  ChevronRight,
  Home,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Columns,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  UserSearch,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  GraduationCap,
  Heart,
  Droplets,
  UserCheck,
  Filter,
  X,
  Check,
  MoreHorizontal,
  Mail,
  Phone,
  IndianRupee,
  Clock,
  Shield,
  Bookmark } from
'lucide-react';

// Types
interface Employee {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  religion: string;
  category: string;
  department: string;
  designation: string;
  employeeType: string;
  status: string;
  joiningDate: string;
  confirmationDate: string | null;
  dateOfBirth: string;
  age: number;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
  basicSalary: number;
  branch: string;
  batchYear: string;
  qualification: string;
  experience: number;
  reportingManager: string;
  shiftType: string;
  probationEndDate: string | null;
  contractEndDate: string | null;
  nationality: string;
  panNumber: string;
  aadharNumber: string;
  bankName: string;
  accountNumber: string;
  pfNumber: string;
  esiNumber: string;
}

interface ColumnConfig {
  id: string;
  label: string;
  key: keyof Employee;
  visible: boolean;
  sensitive: boolean;
  sortable: boolean;
  width?: string;
  category: 'basic' | 'professional' | 'personal' | 'financial' | 'statutory';
}

interface FilterState {
  searchText: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  religion: string;
  category: string;
  department: string;
  designation: string;
  employeeType: string;
  status: string;
  joiningDateFrom: string;
  joiningDateTo: string;
  confirmationDateFrom: string;
  confirmationDateTo: string;
  dobFrom: string;
  dobTo: string;
  ageMin: string;
  ageMax: string;
  city: string;
  state: string;
  zipCode: string;
  branches: string[];
  batchYear: string;
  qualification: string;
  experienceMin: string;
  experienceMax: string;
  salaryMin: string;
  salaryMax: string;
  shiftType: string;
  nationality: string;
  reportingManager: string;
  probationStatus: string;
  contractStatus: string;
}

// Initial Filter State
const initialFilters: FilterState = {
  searchText: '',
  gender: '',
  maritalStatus: '',
  bloodGroup: '',
  religion: '',
  category: '',
  department: '',
  designation: '',
  employeeType: '',
  status: '',
  joiningDateFrom: '',
  joiningDateTo: '',
  confirmationDateFrom: '',
  confirmationDateTo: '',
  dobFrom: '',
  dobTo: '',
  ageMin: '',
  ageMax: '',
  city: '',
  state: '',
  zipCode: '',
  branches: [],
  batchYear: '',
  qualification: '',
  experienceMin: '',
  experienceMax: '',
  salaryMin: '',
  salaryMax: '',
  shiftType: '',
  nationality: '',
  reportingManager: '',
  probationStatus: '',
  contractStatus: ''
};

// Filter Options
const genderOptions = [
{ value: '', label: 'All Genders' },
{ value: 'male', label: 'Male' },
{ value: 'female', label: 'Female' },
{ value: 'other', label: 'Other' }];


const maritalStatusOptions = [
{ value: '', label: 'All Status' },
{ value: 'single', label: 'Single' },
{ value: 'married', label: 'Married' },
{ value: 'divorced', label: 'Divorced' },
{ value: 'widowed', label: 'Widowed' }];


const bloodGroupOptions = [
{ value: '', label: 'All Blood Groups' },
{ value: 'A+', label: 'A+' },
{ value: 'A-', label: 'A-' },
{ value: 'B+', label: 'B+' },
{ value: 'B-', label: 'B-' },
{ value: 'O+', label: 'O+' },
{ value: 'O-', label: 'O-' },
{ value: 'AB+', label: 'AB+' },
{ value: 'AB-', label: 'AB-' }];


const religionOptions = [
{ value: '', label: 'All Religions' },
{ value: 'hindu', label: 'Hindu' },
{ value: 'muslim', label: 'Muslim' },
{ value: 'christian', label: 'Christian' },
{ value: 'sikh', label: 'Sikh' },
{ value: 'buddhist', label: 'Buddhist' },
{ value: 'jain', label: 'Jain' },
{ value: 'other', label: 'Other' }];


const categoryOptions = [
{ value: '', label: 'All Categories' },
{ value: 'general', label: 'General' },
{ value: 'obc', label: 'OBC' },
{ value: 'sc', label: 'SC' },
{ value: 'st', label: 'ST' },
{ value: 'ews', label: 'EWS' }];


const departmentOptions = [
{ value: '', label: 'All Departments' },
{ value: 'mathematics', label: 'Mathematics' },
{ value: 'science', label: 'Science' },
{ value: 'english', label: 'English' },
{ value: 'hindi', label: 'Hindi' },
{ value: 'commerce', label: 'Commerce' },
{ value: 'arts', label: 'Arts' },
{ value: 'physical_education', label: 'Physical Education' },
{ value: 'computer_science', label: 'Computer Science' },
{ value: 'administration', label: 'Administration' },
{ value: 'finance', label: 'Finance' },
{ value: 'hr', label: 'Human Resources' },
{ value: 'library', label: 'Library' },
{ value: 'security', label: 'Security' },
{ value: 'maintenance', label: 'Maintenance' },
{ value: 'transport', label: 'Transport' }];


const designationOptions = [
{ value: '', label: 'All Designations' },
{ value: 'principal', label: 'Principal' },
{ value: 'vice_principal', label: 'Vice Principal' },
{ value: 'hod', label: 'Head of Department' },
{ value: 'senior_teacher', label: 'Senior Teacher' },
{ value: 'teacher', label: 'Teacher' },
{ value: 'assistant_teacher', label: 'Assistant Teacher' },
{ value: 'lab_assistant', label: 'Lab Assistant' },
{ value: 'librarian', label: 'Librarian' },
{ value: 'clerk', label: 'Clerk' },
{ value: 'accountant', label: 'Accountant' },
{ value: 'admin_officer', label: 'Admin Officer' },
{ value: 'hr_manager', label: 'HR Manager' },
{ value: 'security_guard', label: 'Security Guard' },
{ value: 'driver', label: 'Driver' },
{ value: 'peon', label: 'Peon' }];


const employeeTypeOptions = [
{ value: '', label: 'All Types' },
{ value: 'teaching', label: 'Teaching Staff' },
{ value: 'non_teaching', label: 'Non-Teaching Staff' },
{ value: 'administrative', label: 'Administrative' },
{ value: 'contractual', label: 'Contractual' },
{ value: 'temporary', label: 'Temporary' },
{ value: 'intern', label: 'Intern' }];


const statusOptions = [
{ value: '', label: 'All Status' },
{ value: 'active', label: 'Active' },
{ value: 'probation', label: 'On Probation' },
{ value: 'on_leave', label: 'On Leave' },
{ value: 'suspended', label: 'Suspended' },
{ value: 'resigned', label: 'Resigned' },
{ value: 'terminated', label: 'Terminated' },
{ value: 'retired', label: 'Retired' },
{ value: 'absconding', label: 'Absconding' }];


const stateOptions = [
{ value: '', label: 'All States' },
{ value: 'maharashtra', label: 'Maharashtra' },
{ value: 'karnataka', label: 'Karnataka' },
{ value: 'tamil_nadu', label: 'Tamil Nadu' },
{ value: 'kerala', label: 'Kerala' },
{ value: 'delhi', label: 'Delhi' },
{ value: 'uttar_pradesh', label: 'Uttar Pradesh' },
{ value: 'gujarat', label: 'Gujarat' },
{ value: 'rajasthan', label: 'Rajasthan' },
{ value: 'west_bengal', label: 'West Bengal' },
{ value: 'madhya_pradesh', label: 'Madhya Pradesh' },
{ value: 'andhra_pradesh', label: 'Andhra Pradesh' },
{ value: 'telangana', label: 'Telangana' },
{ value: 'punjab', label: 'Punjab' },
{ value: 'haryana', label: 'Haryana' }];


const branchOptions = [
'Main Campus',
'North Campus',
'South Campus',
'East Campus',
'West Campus',
'City Center Branch',
'Suburban Branch'];


const batchYearOptions = [
{ value: '', label: 'All Batch Years' },
{ value: '2024', label: '2024' },
{ value: '2023', label: '2023' },
{ value: '2022', label: '2022' },
{ value: '2021', label: '2021' },
{ value: '2020', label: '2020' },
{ value: '2019', label: '2019' },
{ value: '2018', label: '2018' },
{ value: '2017', label: '2017' },
{ value: '2016', label: '2016' },
{ value: '2015', label: '2015' }];


const qualificationOptions = [
{ value: '', label: 'All Qualifications' },
{ value: 'phd', label: 'Ph.D' },
{ value: 'masters', label: 'Masters Degree' },
{ value: 'bachelors', label: 'Bachelors Degree' },
{ value: 'diploma', label: 'Diploma' },
{ value: 'hsc', label: 'HSC / 12th' },
{ value: 'ssc', label: 'SSC / 10th' },
{ value: 'bed', label: 'B.Ed' },
{ value: 'med', label: 'M.Ed' },
{ value: 'mba', label: 'MBA' },
{ value: 'mca', label: 'MCA' },
{ value: 'btech', label: 'B.Tech' },
{ value: 'mtech', label: 'M.Tech' }];


const shiftTypeOptions = [
{ value: '', label: 'All Shifts' },
{ value: 'morning', label: 'Morning Shift' },
{ value: 'afternoon', label: 'Afternoon Shift' },
{ value: 'general', label: 'General Shift' },
{ value: 'night', label: 'Night Shift' },
{ value: 'rotating', label: 'Rotating Shift' }];


const nationalityOptions = [
{ value: '', label: 'All Nationalities' },
{ value: 'indian', label: 'Indian' },
{ value: 'nri', label: 'NRI' },
{ value: 'foreigner', label: 'Foreigner' }];


const probationStatusOptions = [
{ value: '', label: 'All' },
{ value: 'on_probation', label: 'On Probation' },
{ value: 'confirmed', label: 'Confirmed' },
{ value: 'probation_extended', label: 'Probation Extended' }];


const contractStatusOptions = [
{ value: '', label: 'All' },
{ value: 'active_contract', label: 'Active Contract' },
{ value: 'expired', label: 'Expired' },
{ value: 'expiring_soon', label: 'Expiring Soon (30 days)' },
{ value: 'no_contract', label: 'No Contract (Permanent)' }];


// Mock Employee Data
const mockEmployees: Employee[] = [
{
  id: '1',
  employeeId: 'EMP001',
  name: 'Dr. Priya Sharma',
  avatar: 'PS',
  gender: 'female',
  maritalStatus: 'married',
  bloodGroup: 'B+',
  religion: 'hindu',
  category: 'general',
  department: 'science',
  designation: 'hod',
  employeeType: 'teaching',
  status: 'active',
  joiningDate: '2018-06-15',
  confirmationDate: '2019-06-15',
  dateOfBirth: '1985-03-20',
  age: 39,
  city: 'Mumbai',
  state: 'maharashtra',
  zipCode: '400001',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43210',
  basicSalary: 85000,
  branch: 'Main Campus',
  batchYear: '2018',
  qualification: 'phd',
  experience: 15,
  reportingManager: 'Principal',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCPS1234A',
  aadharNumber: '1234 5678 9012',
  bankName: 'State Bank of India',
  accountNumber: '12345678901234',
  pfNumber: 'MH/MUM/12345/001',
  esiNumber: '1234567890123456789'
},
{
  id: '2',
  employeeId: 'EMP002',
  name: 'Mr. Rajesh Kumar',
  avatar: 'RK',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'O+',
  religion: 'hindu',
  category: 'obc',
  department: 'mathematics',
  designation: 'senior_teacher',
  employeeType: 'teaching',
  status: 'active',
  joiningDate: '2015-08-01',
  confirmationDate: '2016-08-01',
  dateOfBirth: '1980-11-15',
  age: 44,
  city: 'Delhi',
  state: 'delhi',
  zipCode: '110001',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43211',
  basicSalary: 72000,
  branch: 'Main Campus',
  batchYear: '2015',
  qualification: 'masters',
  experience: 20,
  reportingManager: 'Dr. Priya Sharma',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCRK5678B',
  aadharNumber: '2345 6789 0123',
  bankName: 'HDFC Bank',
  accountNumber: '23456789012345',
  pfNumber: 'DL/DEL/12345/002',
  esiNumber: '2345678901234567890'
},
{
  id: '3',
  employeeId: 'EMP003',
  name: 'Ms. Fatima Khan',
  avatar: 'FK',
  gender: 'female',
  maritalStatus: 'single',
  bloodGroup: 'A+',
  religion: 'muslim',
  category: 'general',
  department: 'english',
  designation: 'teacher',
  employeeType: 'teaching',
  status: 'active',
  joiningDate: '2021-04-10',
  confirmationDate: '2022-04-10',
  dateOfBirth: '1992-07-25',
  age: 32,
  city: 'Bangalore',
  state: 'karnataka',
  zipCode: '560001',
  email: 'fatima.khan@school.edu',
  phone: '+91 98765 43212',
  basicSalary: 55000,
  branch: 'South Campus',
  batchYear: '2021',
  qualification: 'masters',
  experience: 8,
  reportingManager: 'English HOD',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCFK9012C',
  aadharNumber: '3456 7890 1234',
  bankName: 'ICICI Bank',
  accountNumber: '34567890123456',
  pfNumber: 'KA/BNG/12345/003',
  esiNumber: '3456789012345678901'
},
{
  id: '4',
  employeeId: 'EMP004',
  name: "Mr. John D'Souza",
  avatar: 'JD',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'AB+',
  religion: 'christian',
  category: 'general',
  department: 'commerce',
  designation: 'senior_teacher',
  employeeType: 'teaching',
  status: 'on_leave',
  joiningDate: '2019-01-20',
  confirmationDate: '2020-01-20',
  dateOfBirth: '1988-05-12',
  age: 36,
  city: 'Chennai',
  state: 'tamil_nadu',
  zipCode: '600001',
  email: 'john.dsouza@school.edu',
  phone: '+91 98765 43213',
  basicSalary: 68000,
  branch: 'East Campus',
  batchYear: '2019',
  qualification: 'masters',
  experience: 12,
  reportingManager: 'Commerce HOD',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCJD3456D',
  aadharNumber: '4567 8901 2345',
  bankName: 'Axis Bank',
  accountNumber: '45678901234567',
  pfNumber: 'TN/CHE/12345/004',
  esiNumber: '4567890123456789012'
},
{
  id: '5',
  employeeId: 'EMP005',
  name: 'Mrs. Lakshmi Iyer',
  avatar: 'LI',
  gender: 'female',
  maritalStatus: 'married',
  bloodGroup: 'O-',
  religion: 'hindu',
  category: 'general',
  department: 'science',
  designation: 'teacher',
  employeeType: 'teaching',
  status: 'probation',
  joiningDate: '2023-07-01',
  confirmationDate: null,
  dateOfBirth: '1995-09-18',
  age: 29,
  city: 'Mumbai',
  state: 'maharashtra',
  zipCode: '400002',
  email: 'lakshmi.iyer@school.edu',
  phone: '+91 98765 43214',
  basicSalary: 52000,
  branch: 'Main Campus',
  batchYear: '2023',
  qualification: 'bachelors',
  experience: 5,
  reportingManager: 'Dr. Priya Sharma',
  shiftType: 'morning',
  probationEndDate: '2024-07-01',
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCLI7890E',
  aadharNumber: '5678 9012 3456',
  bankName: 'Kotak Bank',
  accountNumber: '56789012345678',
  pfNumber: 'MH/MUM/12345/005',
  esiNumber: '5678901234567890123'
},
{
  id: '6',
  employeeId: 'EMP006',
  name: 'Mr. Amarjeet Singh',
  avatar: 'AS',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'B-',
  religion: 'sikh',
  category: 'general',
  department: 'physical_education',
  designation: 'teacher',
  employeeType: 'teaching',
  status: 'active',
  joiningDate: '2017-03-15',
  confirmationDate: '2018-03-15',
  dateOfBirth: '1983-12-05',
  age: 41,
  city: 'Chandigarh',
  state: 'punjab',
  zipCode: '160001',
  email: 'amarjeet.singh@school.edu',
  phone: '+91 98765 43215',
  basicSalary: 58000,
  branch: 'North Campus',
  batchYear: '2017',
  qualification: 'masters',
  experience: 18,
  reportingManager: 'Vice Principal',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCAS1234F',
  aadharNumber: '6789 0123 4567',
  bankName: 'Punjab National Bank',
  accountNumber: '67890123456789',
  pfNumber: 'PB/CHD/12345/006',
  esiNumber: '6789012345678901234'
},
{
  id: '7',
  employeeId: 'EMP007',
  name: 'Ms. Meera Patel',
  avatar: 'MP',
  gender: 'female',
  maritalStatus: 'single',
  bloodGroup: 'A-',
  religion: 'hindu',
  category: 'obc',
  department: 'science',
  designation: 'lab_assistant',
  employeeType: 'non_teaching',
  status: 'active',
  joiningDate: '2020-11-01',
  confirmationDate: '2021-11-01',
  dateOfBirth: '1996-02-28',
  age: 28,
  city: 'Ahmedabad',
  state: 'gujarat',
  zipCode: '380001',
  email: 'meera.patel@school.edu',
  phone: '+91 98765 43216',
  basicSalary: 32000,
  branch: 'West Campus',
  batchYear: '2020',
  qualification: 'bachelors',
  experience: 4,
  reportingManager: 'Dr. Priya Sharma',
  shiftType: 'general',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCMP5678G',
  aadharNumber: '7890 1234 5678',
  bankName: 'Bank of Baroda',
  accountNumber: '78901234567890',
  pfNumber: 'GJ/AMD/12345/007',
  esiNumber: '7890123456789012345'
},
{
  id: '8',
  employeeId: 'EMP008',
  name: 'Mr. Suresh Reddy',
  avatar: 'SR',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'O+',
  religion: 'hindu',
  category: 'sc',
  department: 'administration',
  designation: 'clerk',
  employeeType: 'non_teaching',
  status: 'active',
  joiningDate: '2016-09-10',
  confirmationDate: '2017-09-10',
  dateOfBirth: '1978-08-22',
  age: 46,
  city: 'Hyderabad',
  state: 'telangana',
  zipCode: '500001',
  email: 'suresh.reddy@school.edu',
  phone: '+91 98765 43217',
  basicSalary: 28000,
  branch: 'Main Campus',
  batchYear: '2016',
  qualification: 'bachelors',
  experience: 22,
  reportingManager: 'Admin Officer',
  shiftType: 'general',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCSR9012H',
  aadharNumber: '8901 2345 6789',
  bankName: 'Canara Bank',
  accountNumber: '89012345678901',
  pfNumber: 'TS/HYD/12345/008',
  esiNumber: '8901234567890123456'
},
{
  id: '9',
  employeeId: 'EMP009',
  name: 'Mrs. Anjali Desai',
  avatar: 'AD',
  gender: 'female',
  maritalStatus: 'widowed',
  bloodGroup: 'B+',
  religion: 'hindu',
  category: 'general',
  department: 'finance',
  designation: 'accountant',
  employeeType: 'non_teaching',
  status: 'active',
  joiningDate: '2014-04-01',
  confirmationDate: '2015-04-01',
  dateOfBirth: '1975-06-10',
  age: 49,
  city: 'Pune',
  state: 'maharashtra',
  zipCode: '411001',
  email: 'anjali.desai@school.edu',
  phone: '+91 98765 43218',
  basicSalary: 45000,
  branch: 'Main Campus',
  batchYear: '2014',
  qualification: 'masters',
  experience: 25,
  reportingManager: 'Finance Manager',
  shiftType: 'general',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCAD3456I',
  aadharNumber: '9012 3456 7890',
  bankName: 'Union Bank',
  accountNumber: '90123456789012',
  pfNumber: 'MH/PUN/12345/009',
  esiNumber: '9012345678901234567'
},
{
  id: '10',
  employeeId: 'EMP010',
  name: 'Mr. Mohammed Ali',
  avatar: 'MA',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'AB-',
  religion: 'muslim',
  category: 'general',
  department: 'arts',
  designation: 'teacher',
  employeeType: 'contractual',
  status: 'active',
  joiningDate: '2022-07-15',
  confirmationDate: null,
  dateOfBirth: '1990-01-30',
  age: 34,
  city: 'Lucknow',
  state: 'uttar_pradesh',
  zipCode: '226001',
  email: 'mohammed.ali@school.edu',
  phone: '+91 98765 43219',
  basicSalary: 48000,
  branch: 'City Center Branch',
  batchYear: '2022',
  qualification: 'masters',
  experience: 10,
  reportingManager: 'Arts HOD',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: '2024-07-14',
  nationality: 'indian',
  panNumber: 'ABCMA7890J',
  aadharNumber: '0123 4567 8901',
  bankName: 'Indian Bank',
  accountNumber: '01234567890123',
  pfNumber: 'UP/LKO/12345/010',
  esiNumber: '0123456789012345678'
},
{
  id: '11',
  employeeId: 'EMP011',
  name: 'Dr. Kavitha Nair',
  avatar: 'KN',
  gender: 'female',
  maritalStatus: 'married',
  bloodGroup: 'A+',
  religion: 'hindu',
  category: 'general',
  department: 'science',
  designation: 'senior_teacher',
  employeeType: 'teaching',
  status: 'active',
  joiningDate: '2021-08-20',
  confirmationDate: '2022-08-20',
  dateOfBirth: '1987-04-15',
  age: 37,
  city: 'Kochi',
  state: 'kerala',
  zipCode: '682001',
  email: 'kavitha.nair@school.edu',
  phone: '+91 98765 43220',
  basicSalary: 75000,
  branch: 'South Campus',
  batchYear: '2021',
  qualification: 'phd',
  experience: 12,
  reportingManager: 'Dr. Priya Sharma',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCKN1234K',
  aadharNumber: '1234 5678 9012',
  bankName: 'Federal Bank',
  accountNumber: '12345678901234',
  pfNumber: 'KL/KOC/12345/011',
  esiNumber: '1234567890123456789'
},
{
  id: '12',
  employeeId: 'EMP012',
  name: 'Mr. Vikram Joshi',
  avatar: 'VJ',
  gender: 'male',
  maritalStatus: 'single',
  bloodGroup: 'O+',
  religion: 'hindu',
  category: 'general',
  department: 'computer_science',
  designation: 'teacher',
  employeeType: 'teaching',
  status: 'probation',
  joiningDate: '2024-01-10',
  confirmationDate: null,
  dateOfBirth: '1994-11-08',
  age: 30,
  city: 'Jaipur',
  state: 'rajasthan',
  zipCode: '302001',
  email: 'vikram.joshi@school.edu',
  phone: '+91 98765 43221',
  basicSalary: 50000,
  branch: 'North Campus',
  batchYear: '2024',
  qualification: 'mca',
  experience: 6,
  reportingManager: 'CS HOD',
  shiftType: 'morning',
  probationEndDate: '2024-07-10',
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCVJ5678L',
  aadharNumber: '2345 6789 0123',
  bankName: 'ICICI Bank',
  accountNumber: '23456789012345',
  pfNumber: 'RJ/JAI/12345/012',
  esiNumber: '2345678901234567890'
},
{
  id: '13',
  employeeId: 'EMP013',
  name: 'Mr. Ramesh Gupta',
  avatar: 'RG',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'B+',
  religion: 'hindu',
  category: 'general',
  department: 'security',
  designation: 'security_guard',
  employeeType: 'non_teaching',
  status: 'active',
  joiningDate: '2019-05-01',
  confirmationDate: '2020-05-01',
  dateOfBirth: '1970-03-15',
  age: 54,
  city: 'Mumbai',
  state: 'maharashtra',
  zipCode: '400003',
  email: 'ramesh.gupta@school.edu',
  phone: '+91 98765 43222',
  basicSalary: 22000,
  branch: 'Main Campus',
  batchYear: '2019',
  qualification: 'ssc',
  experience: 30,
  reportingManager: 'Admin Officer',
  shiftType: 'rotating',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCRG9012M',
  aadharNumber: '3456 7890 1234',
  bankName: 'State Bank of India',
  accountNumber: '34567890123456',
  pfNumber: 'MH/MUM/12345/013',
  esiNumber: '3456789012345678901'
},
{
  id: '14',
  employeeId: 'EMP014',
  name: 'Mrs. Sunita Verma',
  avatar: 'SV',
  gender: 'female',
  maritalStatus: 'married',
  bloodGroup: 'A+',
  religion: 'hindu',
  category: 'obc',
  department: 'library',
  designation: 'librarian',
  employeeType: 'non_teaching',
  status: 'active',
  joiningDate: '2018-02-01',
  confirmationDate: '2019-02-01',
  dateOfBirth: '1982-07-20',
  age: 42,
  city: 'Mumbai',
  state: 'maharashtra',
  zipCode: '400004',
  email: 'sunita.verma@school.edu',
  phone: '+91 98765 43223',
  basicSalary: 38000,
  branch: 'Main Campus',
  batchYear: '2018',
  qualification: 'masters',
  experience: 18,
  reportingManager: 'Academic Coordinator',
  shiftType: 'general',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCSV3456N',
  aadharNumber: '4567 8901 2345',
  bankName: 'Bank of Maharashtra',
  accountNumber: '45678901234567',
  pfNumber: 'MH/MUM/12345/014',
  esiNumber: '4567890123456789012'
},
{
  id: '15',
  employeeId: 'EMP015',
  name: 'Mr. Deepak Sharma',
  avatar: 'DS',
  gender: 'male',
  maritalStatus: 'married',
  bloodGroup: 'O-',
  religion: 'hindu',
  category: 'general',
  department: 'transport',
  designation: 'driver',
  employeeType: 'non_teaching',
  status: 'active',
  joiningDate: '2020-03-01',
  confirmationDate: '2021-03-01',
  dateOfBirth: '1985-09-10',
  age: 39,
  city: 'Mumbai',
  state: 'maharashtra',
  zipCode: '400005',
  email: 'deepak.sharma@school.edu',
  phone: '+91 98765 43224',
  basicSalary: 25000,
  branch: 'Main Campus',
  batchYear: '2020',
  qualification: 'hsc',
  experience: 15,
  reportingManager: 'Transport Manager',
  shiftType: 'morning',
  probationEndDate: null,
  contractEndDate: null,
  nationality: 'indian',
  panNumber: 'ABCDS7890O',
  aadharNumber: '5678 9012 3456',
  bankName: 'Central Bank',
  accountNumber: '56789012345678',
  pfNumber: 'MH/MUM/12345/015',
  esiNumber: '5678901234567890123'
}];


// Initial Columns Configuration
const initialColumns: ColumnConfig[] = [
{ id: 'employeeId', label: 'Employee ID', key: 'employeeId', visible: true, sensitive: false, sortable: true, width: '120px', category: 'basic' },
{ id: 'name', label: 'Name', key: 'name', visible: true, sensitive: false, sortable: true, width: '180px', category: 'basic' },
{ id: 'gender', label: 'Gender', key: 'gender', visible: true, sensitive: false, sortable: true, width: '100px', category: 'personal' },
{ id: 'department', label: 'Department', key: 'department', visible: true, sensitive: false, sortable: true, width: '140px', category: 'professional' },
{ id: 'designation', label: 'Designation', key: 'designation', visible: true, sensitive: false, sortable: true, width: '150px', category: 'professional' },
{ id: 'branch', label: 'Branch', key: 'branch', visible: true, sensitive: false, sortable: true, width: '140px', category: 'professional' },
{ id: 'employeeType', label: 'Type', key: 'employeeType', visible: true, sensitive: false, sortable: true, width: '130px', category: 'professional' },
{ id: 'status', label: 'Status', key: 'status', visible: true, sensitive: false, sortable: true, width: '110px', category: 'professional' },
{ id: 'joiningDate', label: 'Joining Date', key: 'joiningDate', visible: true, sensitive: false, sortable: true, width: '130px', category: 'professional' },
{ id: 'batchYear', label: 'Batch Year', key: 'batchYear', visible: true, sensitive: false, sortable: true, width: '110px', category: 'professional' },
{ id: 'city', label: 'City', key: 'city', visible: false, sensitive: false, sortable: true, width: '120px', category: 'personal' },
{ id: 'state', label: 'State', key: 'state', visible: false, sensitive: false, sortable: true, width: '130px', category: 'personal' },
{ id: 'email', label: 'Email', key: 'email', visible: false, sensitive: true, sortable: true, width: '200px', category: 'basic' },
{ id: 'phone', label: 'Phone', key: 'phone', visible: false, sensitive: true, sortable: false, width: '150px', category: 'basic' },
{ id: 'basicSalary', label: 'Basic Salary', key: 'basicSalary', visible: false, sensitive: true, sortable: true, width: '130px', category: 'financial' },
{ id: 'bloodGroup', label: 'Blood Group', key: 'bloodGroup', visible: false, sensitive: false, sortable: true, width: '120px', category: 'personal' },
{ id: 'category', label: 'Category', key: 'category', visible: false, sensitive: false, sortable: true, width: '110px', category: 'personal' },
{ id: 'maritalStatus', label: 'Marital Status', key: 'maritalStatus', visible: false, sensitive: false, sortable: true, width: '130px', category: 'personal' },
{ id: 'age', label: 'Age', key: 'age', visible: false, sensitive: false, sortable: true, width: '80px', category: 'personal' },
{ id: 'qualification', label: 'Qualification', key: 'qualification', visible: false, sensitive: false, sortable: true, width: '140px', category: 'professional' },
{ id: 'experience', label: 'Experience (Yrs)', key: 'experience', visible: false, sensitive: false, sortable: true, width: '140px', category: 'professional' },
{ id: 'reportingManager', label: 'Reporting Manager', key: 'reportingManager', visible: false, sensitive: false, sortable: true, width: '160px', category: 'professional' },
{ id: 'shiftType', label: 'Shift Type', key: 'shiftType', visible: false, sensitive: false, sortable: true, width: '120px', category: 'professional' },
{ id: 'panNumber', label: 'PAN Number', key: 'panNumber', visible: false, sensitive: true, sortable: false, width: '130px', category: 'statutory' },
{ id: 'pfNumber', label: 'PF Number', key: 'pfNumber', visible: false, sensitive: true, sortable: false, width: '160px', category: 'statutory' }];


type SortDirection = 'asc' | 'desc' | null;

export function EmployeeReportAdvanced() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>('demographics');
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchToggle = (branch: string) => {
    setFilters((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch) ?
      prev.branches.filter((b) => b !== branch) :
      [...prev.branches, branch]
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setSearchExecuted(false);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    setTimeout(() => {
      setIsSearching(false);
      setSearchExecuted(true);
    }, 800);
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns((prev) =>
    prev.map((col) => col.id === columnId ? { ...col, visible: !col.visible } : col)
    );
  };

  const handleSort = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    if (!searchExecuted) return [];

    return mockEmployees.filter((emp) => {
      // Text search
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesSearch =
        emp.name.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.phone.includes(filters.searchText);
        if (!matchesSearch) return false;
      }

      // Demographics
      if (filters.gender && emp.gender !== filters.gender) return false;
      if (filters.maritalStatus && emp.maritalStatus !== filters.maritalStatus) return false;
      if (filters.bloodGroup && emp.bloodGroup !== filters.bloodGroup) return false;
      if (filters.religion && emp.religion !== filters.religion) return false;
      if (filters.category && emp.category !== filters.category) return false;
      if (filters.nationality && emp.nationality !== filters.nationality) return false;

      // Age range
      if (filters.ageMin && emp.age < parseInt(filters.ageMin)) return false;
      if (filters.ageMax && emp.age > parseInt(filters.ageMax)) return false;

      // Professional
      if (filters.department && emp.department !== filters.department) return false;
      if (filters.designation && emp.designation !== filters.designation) return false;
      if (filters.employeeType && emp.employeeType !== filters.employeeType) return false;
      if (filters.status && emp.status !== filters.status) return false;
      if (filters.qualification && emp.qualification !== filters.qualification) return false;
      if (filters.shiftType && emp.shiftType !== filters.shiftType) return false;
      if (filters.reportingManager && !emp.reportingManager.toLowerCase().includes(filters.reportingManager.toLowerCase())) return false;

      // Branch (multiple selection)
      if (filters.branches.length > 0 && !filters.branches.includes(emp.branch)) return false;

      // Batch Year (single select)
      if (filters.batchYear && emp.batchYear !== filters.batchYear) return false;

      // Experience range
      if (filters.experienceMin && emp.experience < parseInt(filters.experienceMin)) return false;
      if (filters.experienceMax && emp.experience > parseInt(filters.experienceMax)) return false;

      // Salary range
      if (filters.salaryMin && emp.basicSalary < parseInt(filters.salaryMin)) return false;
      if (filters.salaryMax && emp.basicSalary > parseInt(filters.salaryMax)) return false;

      // Location
      if (filters.state && emp.state !== filters.state) return false;
      if (filters.city && !emp.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.zipCode && !emp.zipCode.includes(filters.zipCode)) return false;

      // Date filters
      if (filters.joiningDateFrom && new Date(emp.joiningDate) < new Date(filters.joiningDateFrom)) return false;
      if (filters.joiningDateTo && new Date(emp.joiningDate) > new Date(filters.joiningDateTo)) return false;
      if (filters.confirmationDateFrom && emp.confirmationDate && new Date(emp.confirmationDate) < new Date(filters.confirmationDateFrom)) return false;
      if (filters.confirmationDateTo && emp.confirmationDate && new Date(emp.confirmationDate) > new Date(filters.confirmationDateTo)) return false;
      if (filters.dobFrom && new Date(emp.dateOfBirth) < new Date(filters.dobFrom)) return false;
      if (filters.dobTo && new Date(emp.dateOfBirth) > new Date(filters.dobTo)) return false;

      // Probation status
      if (filters.probationStatus) {
        if (filters.probationStatus === 'on_probation' && emp.status !== 'probation') return false;
        if (filters.probationStatus === 'confirmed' && emp.confirmationDate === null) return false;
      }

      // Contract status
      if (filters.contractStatus) {
        if (filters.contractStatus === 'active_contract' && !emp.contractEndDate) return false;
        if (filters.contractStatus === 'no_contract' && emp.contractEndDate) return false;
        if (filters.contractStatus === 'expiring_soon' && emp.contractEndDate) {
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          if (new Date(emp.contractEndDate) > thirtyDaysFromNow) return false;
        }
      }

      return true;
    });
  }, [filters, searchExecuted]);

  // Sort employees
  const sortedEmployees = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      const column = columns.find((c) => c.id === sortColumn);
      if (!column) return 0;

      const aValue = a[column.key];
      const bValue = b[column.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredEmployees, sortColumn, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / pageSize);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, {bg: string;text: string;}> = {
      active: { bg: 'bg-green-100', text: 'text-green-800' },
      probation: { bg: 'bg-blue-100', text: 'text-blue-800' },
      on_leave: { bg: 'bg-amber-100', text: 'text-amber-800' },
      suspended: { bg: 'bg-orange-100', text: 'text-orange-800' },
      resigned: { bg: 'bg-red-100', text: 'text-red-800' },
      terminated: { bg: 'bg-red-100', text: 'text-red-800' },
      retired: { bg: 'bg-gray-100', text: 'text-gray-800' },
      absconding: { bg: 'bg-purple-100', text: 'text-purple-800' }
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return `${config.bg} ${config.text}`;
  };

  const formatLabel = (value: string): string => {
    return value.
    split('_').
    map((word) => word.charAt(0).toUpperCase() + word.slice(1)).
    join(' ');
  };

  const getCellValue = (employee: Employee, column: ColumnConfig): React.ReactNode => {
    const value = employee[column.key];

    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold">
              {employee.avatar}
            </div>
            <span className="font-medium">{value}</span>
          </div>);

      case 'status':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(value as string)}`}>
            {formatLabel(value as string)}
          </span>);

      case 'gender':
      case 'maritalStatus':
      case 'category':
      case 'employeeType':
      case 'designation':
      case 'department':
      case 'state':
      case 'qualification':
      case 'shiftType':
      case 'nationality':
        return formatLabel(value as string);
      case 'joiningDate':
      case 'confirmationDate':
      case 'dateOfBirth':
        return formatDate(value as string | null);
      case 'basicSalary':
        return formatCurrency(value as number);
      case 'experience':
        return `${value} years`;
      default:
        return value?.toString() || '-';
    }
  };

  const visibleColumns = columns.filter((c) => c.visible);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'branches') return (value as string[]).length > 0;
    return value !== '';
  }).length;

  const handleExport = (type: 'excel' | 'csv' | 'pdf' | 'print') => {
    console.log(`Exporting ${sortedEmployees.length} records to ${type.toUpperCase()}`);
    setShowExportMenu(false);
  };

  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Reports</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Employee Advanced Search</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Report (Advanced Search)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate custom employee lists with comprehensive search criteria
          </p>
        </div>

        {/* Export Button with Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!searchExecuted || sortedEmployees.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

              <Download className="w-4 h-4" />
              Export List
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export to Excel
                </button>
                <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                  <FileText className="w-4 h-4 text-blue-600" />
                  Export to CSV
                </button>
                <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                  <FileText className="w-4 h-4 text-red-600" />
                  Export to PDF
                </button>
                <hr className="my-1" />
                <button
                onClick={() => handleExport('print')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                  <Printer className="w-4 h-4 text-gray-600" />
                  Print View
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search Header */}
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold text-gray-900">Advanced Search Criteria</h2>
              <p className="text-sm text-gray-500">
                {activeFiltersCount > 0 ? `${activeFiltersCount} filter(s) applied` : 'Define your search parameters'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 &&
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                {activeFiltersCount} Active
              </span>
            }
            {isFilterExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </div>
        </button>

        {/* Filter Content */}
        {isFilterExpanded &&
        <div className="p-6 border-t border-gray-200">
            {/* Quick Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                type="text"
                placeholder="Quick search by name, employee ID, email or phone..."
                value={filters.searchText}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

                {filters.searchText &&
              <button
                onClick={() => handleFilterChange('searchText', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                    <X className="w-5 h-5" />
                  </button>
              }
              </div>
            </div>

            {/* Filter Sections */}
            <div className="space-y-4">
              {/* Demographics Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                onClick={() => toggleFilterSection('demographics')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100">

                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    <Users className="w-4 h-4" />
                    Demographics & Personal
                  </span>
                  {activeFilterSection === 'demographics' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeFilterSection === 'demographics' &&
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                      <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {genderOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Marital Status</label>
                      <select
                    value={filters.maritalStatus}
                    onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {maritalStatusOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Blood Group</label>
                      <select
                    value={filters.bloodGroup}
                    onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {bloodGroupOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Religion</label>
                      <select
                    value={filters.religion}
                    onChange={(e) => handleFilterChange('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {religionOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                      <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {categoryOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nationality</label>
                      <select
                    value={filters.nationality}
                    onChange={(e) => handleFilterChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {nationalityOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Age (Min)</label>
                      <input
                    type="number"
                    min="18"
                    placeholder="Min age"
                    value={filters.ageMin}
                    onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Age (Max)</label>
                      <input
                    type="number"
                    min="18"
                    placeholder="Max age"
                    value={filters.ageMax}
                    onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">DOB (From)</label>
                      <input
                    type="date"
                    value={filters.dobFrom}
                    onChange={(e) => handleFilterChange('dobFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">DOB (To)</label>
                      <input
                    type="date"
                    value={filters.dobTo}
                    onChange={(e) => handleFilterChange('dobTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                  </div>
              }
              </div>

              {/* Professional Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                onClick={() => toggleFilterSection('professional')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100">

                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    <Briefcase className="w-4 h-4" />
                    Professional & Employment
                  </span>
                  {activeFilterSection === 'professional' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeFilterSection === 'professional' &&
              <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                        <select
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {departmentOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
                        <select
                      value={filters.designation}
                      onChange={(e) => handleFilterChange('designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {designationOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Employee Type</label>
                        <select
                      value={filters.employeeType}
                      onChange={(e) => handleFilterChange('employeeType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {employeeTypeOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                        <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {statusOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Qualification</label>
                        <select
                      value={filters.qualification}
                      onChange={(e) => handleFilterChange('qualification', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {qualificationOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Shift Type</label>
                        <select
                      value={filters.shiftType}
                      onChange={(e) => handleFilterChange('shiftType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {shiftTypeOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Batch Year <span className="text-indigo-600">(Single Select)</span>
                        </label>
                        <select
                      value={filters.batchYear}
                      onChange={(e) => handleFilterChange('batchYear', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {batchYearOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Probation Status</label>
                        <select
                      value={filters.probationStatus}
                      onChange={(e) => handleFilterChange('probationStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {probationStatusOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Contract Status</label>
                        <select
                      value={filters.contractStatus}
                      onChange={(e) => handleFilterChange('contractStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                          {contractStatusOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reporting Manager</label>
                        <input
                      type="text"
                      placeholder="Search manager..."
                      value={filters.reportingManager}
                      onChange={(e) => handleFilterChange('reportingManager', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                      </div>
                    </div>

                    {/* Branch Multi-Select */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Branch <span className="text-indigo-600">(Multiple Selection)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {branchOptions.map((branch) =>
                    <button
                      key={branch}
                      onClick={() => handleBranchToggle(branch)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.branches.includes(branch) ?
                      'bg-indigo-100 text-indigo-700 border-2 border-indigo-300' :
                      'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'}`
                      }>

                            {filters.branches.includes(branch) && <Check className="w-3 h-3 inline mr-1" />}
                            {branch}
                          </button>
                    )}
                      </div>
                    </div>

                    {/* Experience Range */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Experience (Min Years)</label>
                        <input
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={filters.experienceMin}
                      onChange={(e) => handleFilterChange('experienceMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Experience (Max Years)</label>
                        <input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={filters.experienceMax}
                      onChange={(e) => handleFilterChange('experienceMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Salary (Min)</label>
                        <input
                      type="number"
                      min="0"
                      placeholder="Min salary"
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Salary (Max)</label>
                        <input
                      type="number"
                      min="0"
                      placeholder="Max salary"
                      value={filters.salaryMax}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                      </div>
                    </div>
                  </div>
              }
              </div>

              {/* Timeline Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                onClick={() => toggleFilterSection('timeline')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100">

                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Timeline & Dates
                  </span>
                  {activeFilterSection === 'timeline' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeFilterSection === 'timeline' &&
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Joining Date (From)</label>
                      <input
                    type="date"
                    value={filters.joiningDateFrom}
                    onChange={(e) => handleFilterChange('joiningDateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Joining Date (To)</label>
                      <input
                    type="date"
                    value={filters.joiningDateTo}
                    onChange={(e) => handleFilterChange('joiningDateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Confirmation Date (From)</label>
                      <input
                    type="date"
                    value={filters.confirmationDateFrom}
                    onChange={(e) => handleFilterChange('confirmationDateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Confirmation Date (To)</label>
                      <input
                    type="date"
                    value={filters.confirmationDateTo}
                    onChange={(e) => handleFilterChange('confirmationDateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                  </div>
              }
              </div>

              {/* Location Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                onClick={() => toggleFilterSection('location')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100">

                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Location
                  </span>
                  {activeFilterSection === 'location' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeFilterSection === 'location' &&
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                      <input
                    type="text"
                    placeholder="Enter city name..."
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                      <select
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">

                        {stateOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Zip Code</label>
                      <input
                    type="text"
                    placeholder="Enter zip code..."
                    value={filters.zipCode}
                    onChange={(e) => handleFilterChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />

                    </div>
                  </div>
              }
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">

                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
              <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">

                {isSearching ?
              <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </> :

              <>
                    <Search className="w-4 h-4" />
                    Search Employees
                  </>
              }
              </button>
            </div>
          </div>
        }
      </div>

      {/* Column Configurator */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Columns className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {visibleColumns.length} of {columns.length} columns visible
          </span>
        </div>

        <div className="relative" ref={columnSelectorRef}>
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">

            <Columns className="w-4 h-4" />
            Select Columns
            <ChevronDown className="w-4 h-4" />
          </button>

          {showColumnSelector &&
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">Toggle Columns</p>
                <p className="text-xs text-gray-500">Select which columns to display</p>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {columns.map((column) =>
              <label
                key={column.id}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">

                    <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => toggleColumnVisibility(column.id)}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300" />

                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-sm text-gray-700">{column.label}</span>
                      {column.sensitive &&
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                          Sensitive
                        </span>
                  }
                    </div>
                    {column.visible ?
                <Eye className="w-4 h-4 text-green-500" /> :

                <EyeOff className="w-4 h-4 text-gray-400" />
                }
                  </label>
              )}
              </div>
              <div className="p-2 border-t border-gray-200 flex justify-between">
                <button
                onClick={() => setColumns(columns.map((c) => ({ ...c, visible: true })))}
                className="text-sm text-indigo-600 hover:text-indigo-800">

                  Show All
                </button>
                <button
                onClick={() => setColumns(initialColumns)}
                className="text-sm text-gray-600 hover:text-gray-800">

                  Reset Default
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
        </div>

        {!searchExecuted ?
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <UserSearch className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium text-gray-500">No Search Executed</p>
            <p className="text-sm text-gray-400 mt-1">Use the search criteria above to find employees</p>
          </div> :
        sortedEmployees.length === 0 ?
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <AlertCircle className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium text-gray-500">No Results Found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div> :

        <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {visibleColumns.map((column) =>
                  <th
                    key={column.id}
                    className={`text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    style={{ minWidth: column.width }}
                    onClick={() => column.sortable && handleSort(column.id)}>

                        <div className="flex items-center gap-2">
                          {column.label}
                          {column.sensitive &&
                      <span className="w-2 h-2 bg-amber-500 rounded-full" title="Sensitive Data" />
                      }
                          {column.sortable &&
                      <span className="text-gray-400">
                              {sortColumn === column.id ?
                        sortDirection === 'asc' ?
                        <ArrowUp className="w-4 h-4" /> :

                        <ArrowDown className="w-4 h-4" /> :


                        <ArrowUpDown className="w-4 h-4" />
                        }
                            </span>
                      }
                        </div>
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee, index) =>
                <tr
                  key={employee.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>

                      {visibleColumns.map((column) =>
                  <td key={column.id} className="py-3 px-4 text-sm text-gray-600">
                          {getCellValue(employee, column)}
                        </td>
                  )}
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Records: {sortedEmployees.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm">

                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        }
      </div>

      {/* Summary Cards */}
      {searchExecuted && sortedEmployees.length > 0 &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Male</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEmployees.filter((e) => e.gender === 'male').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Female</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEmployees.filter((e) => e.gender === 'female').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {sortedEmployees.filter((e) => e.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">On Probation</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sortedEmployees.filter((e) => e.status === 'probation').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Teaching</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sortedEmployees.filter((e) => e.employeeType === 'teaching').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Avg. Salary</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                  sortedEmployees.reduce((sum, e) => sum + e.basicSalary, 0) / sortedEmployees.length
                )}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}