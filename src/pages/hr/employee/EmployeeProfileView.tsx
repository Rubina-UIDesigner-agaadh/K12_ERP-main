import React, { useEffect, useMemo, useState, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Search,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  CreditCard,
  FileText,
  Calendar,
  Phone,
  Mail,
  Building,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Home,
  Users,
  Heart,
  Banknote,
  CalendarDays,
  X,
  Database,
  Zap,
  Info,
  Award,
  Target,
  TrendingUp,
  TrendingDown,
  Star,
  BookOpen,
  Languages,
  Laptop,
  Eye,
  MessageSquare,
  Stethoscope,
  Droplet,
  Layers,
  Fingerprint,
  Lock,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  Globe,
  Trophy,
  XCircle,
  Car,
  FolderOpen,
  Pencil,
  UserX,
  UserCheck
} from
'lucide-react';
// Types
interface MetricInfo {
  title: string;
  description: string;
  dataSource: {
    title: string;
    description: string;
  };
  whyItMatters: {
    title: string;
    description: string;
  };
  recommendedActions: {
    title: string;
    link?: string;
  }[];
}
interface ScheduleItem {
  time: string;
  subject: string;
  class: string;
  room: string;
  status: 'completed' | 'ongoing' | 'upcoming' | 'break';
}
interface ClassMapping {
  class: string;
  section: string;
  subject: string;
  students: number;
  periodsPerWeek: number;
}
interface StudentOutcome {
  class: string;
  subject: string;
  averageScore: number;
  passRate: number;
  priorYearAverageScore?: number;
  priorYearPassRate?: number;
  trend: 'up' | 'down' | 'stable';
  comparison: string;
}
interface Feedback {
  type: 'student' | 'parent' | 'peer' | 'admin';
  rating: number;
  comment: string;
  date: string;
  anonymous: boolean;
}
interface CPDCourse {
  name: string;
  provider: string;
  completedDate: string;
  hours: number;
  certificate: boolean;
  category: string;
}
interface KRA {
  title: string;
  description: string;
  target: number;
  achieved: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'achieved' | 'missed';
}
interface Achievement {
  title: string;
  description: string;
  date: string;
  category: 'award' | 'publication' | 'event' | 'recognition';
  icon: string;
}
interface DisciplinaryRecord {
  type: 'warning' | 'grievance' | 'commendation';
  date: string;
  description: string;
  issuedBy: string;
  status: 'open' | 'resolved' | 'archived';
}
interface HealthRecord {
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  emergencyMedical: string;
  insuranceNumber: string;
  lastCheckup: string;
  vaccinations: {
    name: string;
    date: string;
  }[];
}
const EMPLOYEE_HEALTH_RECORDS_STORAGE_KEY = 'k12-employee-health-records-v1';
const EMPLOYEE_HEALTH_RECORDS_EVENT = 'k12-employee-health-records-updated';

interface Employee {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  designation: string;
  department: string;
  status: 'Active' | 'Probation' | 'Resigned' | 'Terminated' | 'On Leave';
  avatar: string;
  dateOfJoining: string;
  yearsOfService: number;
  reportingManager: string;
  staffType: string;
  confirmationDate?: string;
  retirementDate?: string;
  employeeCategory: string;
  payrollId: string;
  biometricId: string;
  personal: {
    dateOfBirth: string;
    age: number;
    gender: string;
    bloodGroup: string;
    nationality: string;
    religion: string;
    category: string;
    caste: string;
    aadhaar: string;
    pan: string;
    passport: string;
    drivingLicense: string;
    voterId: string;
    maritalStatus: string;
    spouseName?: string;
    fatherName: string;
    motherName: string;
    numberOfDependents: number;
  };
  contact: {
    mobile: string;
    alternateMobile: string;
    officialEmail: string;
    personalEmail: string;
    permanentAddress: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    currentAddress: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    sameAsPermanent: boolean;
    emergencyContacts: {
      name: string;
      relationship: string;
      phone: string;
      address: string;
    }[];
  };
  statutory: {
    pfNumber: string;
    esiNumber: string;
    uanNumber: string;
    gratuityNomination: string;
    taxRegime: string;
    form16Available: boolean;
  };
  employment: {
    staffType: string;
    employmentType: string;
    department: string;
    designation: string;
    dateOfJoining: string;
    confirmationDate: string;
    probationPeriod: string;
    noticePeriod: string;
    reportingManager: string;
    reportingManagerId: string;
    location: string;
    campus: string;
    building: string;
    floor: string;
    desk: string;
    grade: string;
    level: string;
    shift: string;
    workingDays: string[];
    weeklyOff: string[];
  };
  qualification: {
    highest: string;
    fieldOfStudy: string;
    university: string;
    yearOfPassing: string;
    percentage: string;
    education: {
      degree: string;
      specialization: string;
      institution: string;
      board: string;
      yearOfPassing: string;
      percentage: string;
      grade: string;
    }[];
    professionalQualifications?: {
      degree: string;
      institution: string;
      year: string;
      grade: string;
      specialization: string;
      registrationNumber: string;
    }[];
    certifications: {
      name: string;
      issuingAuthority: string;
      issueDate: string;
      expiryDate: string;
      credentialId: string;
      verified: boolean;
    }[];
    experience: {
      organization: string;
      designation: string;
      from: string;
      to: string;
      duration: string;
      responsibilities: string;
      reasonForLeaving: string;
      location?: string;
      lastSalary?: string;
      verified: boolean;
    }[];
  };
  skills: {
    technicalSkills?: string[];
    softSkills?: string[];
    hobbies?: string[];
    languages: {
      name: string;
      proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
    }[];
    software: {
      name: string;
      proficiency: 'expert' | 'advanced' | 'intermediate' | 'beginner';
    }[];
    teaching: string[];
    extracurricular: string[];
    specializations: string[];
  };
  bank: {
    bankName: string;
    branchName: string;
    accountNumber: string;
    accountType: string;
    ifsc: string;
    micrCode: string;
    paymentMode: string;
    salaryGrade: string;
    ctc: string;
    basicPay: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    category: string;
    uploadDate: string;
    expiryDate?: string;
    status: 'Verified' | 'Pending' | 'Rejected' | 'Expired';
    verifiedBy?: string;
    verifiedDate?: string;
    fileSize: string;
    fileType: string;
    mandatory: boolean;
    remarks?: string;
  }[];
  leaveBalance: {
    type: string;
    code: string;
    entitled: number;
    taken: number;
    balance: number;
    pending: number;
    carryForward: number;
    encashable: number;
  }[];
  attendance: {
    summary: {
      totalWorkingDays: number;
      present: number;
      absent: number;
      halfDay: number;
      lateComings: number;
      earlyGoings: number;
      onLeave: number;
      holidays: number;
      weeklyOff: number;
    };
    monthlyTrend: {
      month: string;
      present: number;
      absent: number;
      leaves: number;
    }[];
    recentLogs: {
      date: string;
      inTime: string;
      outTime: string;
      totalHours: string;
      status: string;
      remarks?: string;
    }[];
  };
  schedule: {
    today: ScheduleItem[];
    weeklyLoad: {
      day: string;
      teachingHours: number;
      adminHours: number;
      totalPeriods: number;
    }[];
    classMapping: ClassMapping[];
  };
  performance: {
    currentRating: number;
    lastAppraisalDate: string;
    nextAppraisalDate: string;
    studentOutcomes: StudentOutcome[];
    feedback: Feedback[];
    cpdCourses: CPDCourse[];
    kras: KRA[];
    overallScore: number;
    rank: string;
    percentile: number;
  };
  engagement: {
    achievements: Achievement[];
    disciplinaryRecords: DisciplinaryRecord[];
    responsibilities: string[];
    mentoring: string[];
  };
  health: HealthRecord;
  systemInfo: {
    createdAt: string;
    createdBy: string;
    lastModified: string;
    modifiedBy: string;
    lastLogin: string;
    loginHistory: {
      date: string;
      ip: string;
      device: string;
    }[];
    accessLevel: string;
    permissions: string[];
  };
}

type StoredEmployeeHealthRecords = Record<string, Partial<HealthRecord>>;
const normalizeEmployeeHealthKey = (value: string) => value.trim().toUpperCase();

const readStoredEmployeeHealthRecords = (): StoredEmployeeHealthRecords => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(EMPLOYEE_HEALTH_RECORDS_STORAGE_KEY) || '{}') as StoredEmployeeHealthRecords;
  } catch {
    return {};
  }
};

type AttendanceLog = Employee['attendance']['recentLogs'][number];

const getWeeklyAttendanceGroups = (logs: AttendanceLog[]) => {
  const groups = new Map<string, { startDate: Date; endDate: Date; logs: AttendanceLog[] }>();
  logs.forEach((log) => {
    const date = new Date(`${log.date}T00:00:00`);
    if (Number.isNaN(date.getTime()) || date.getDay() === 0) return;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);
    const key = startDate.toISOString().slice(0, 10);
    const group = groups.get(key) || { startDate, endDate, logs: [] };
    group.logs.push(log);
    groups.set(key, group);
  });
  return Array.from(groups.values()).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};

// Mock Data
const mockEmployees: Employee[] = [
{
  id: 'EMP001',
  code: 'EMP-2020-001',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  fullName: 'Rajesh Kumar',
  designation: 'Senior Mathematics Teacher',
  department: 'Mathematics',
  status: 'Active',
  avatar: 'RK',
  dateOfJoining: '2020-04-15',
  yearsOfService: 4,
  reportingManager: 'Dr. Sharma (HOD)',
  staffType: 'Teaching',
  confirmationDate: '2020-10-15',
  retirementDate: '2045-06-30',
  employeeCategory: 'Regular',
  payrollId: 'PAY-2020-001',
  biometricId: 'BIO-001',
  personal: {
    dateOfBirth: '1985-06-20',
    age: 39,
    gender: 'Male',
    bloodGroup: 'B+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    caste: 'Brahmin',
    aadhaar: '1234-5678-9012',
    pan: 'ABCDE1234F',
    passport: 'J1234567',
    drivingLicense: 'DL-1420110012345',
    voterId: 'ABC1234567',
    maritalStatus: 'Married',
    spouseName: 'Sunita Kumar',
    fatherName: 'Ramesh Kumar',
    motherName: 'Kamla Devi',
    numberOfDependents: 3
  },
  contact: {
    mobile: '9876543210',
    alternateMobile: '9876543211',
    officialEmail: 'rajesh.kumar@school.edu',
    personalEmail: 'rajesh.kumar@gmail.com',
    permanentAddress: {
      line1: '123, Green Park Colony',
      line2: 'Sector 15',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    currentAddress: {
      line1: '456, Model Town',
      line2: 'Phase 2',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
      country: 'India'
    },
    sameAsPermanent: false,
    emergencyContacts: [
    {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '9876543212',
      address: '456, Model Town, Phase 2, Gurgaon'
    },
    {
      name: 'Ramesh Kumar',
      relationship: 'Father',
      phone: '9876543213',
      address: '123, Green Park Colony, New Delhi'
    }]

  },
  statutory: {
    pfNumber: 'DLCPM1234567000',
    esiNumber: 'ESI123456789012',
    uanNumber: '100123456789',
    gratuityNomination: 'Sunita Kumar (Spouse) - 100%',
    taxRegime: 'New Tax Regime',
    form16Available: true
  },
  employment: {
    staffType: 'Teaching',
    employmentType: 'Permanent',
    department: 'Mathematics',
    designation: 'Senior Mathematics Teacher',
    dateOfJoining: '2020-04-15',
    confirmationDate: '2020-10-15',
    probationPeriod: '6 months',
    noticePeriod: '3 months',
    reportingManager: 'Dr. Sharma (HOD)',
    reportingManagerId: 'EMP-2015-003',
    location: 'Main Campus',
    campus: 'Central Campus',
    building: 'Block A',
    floor: '2nd Floor',
    desk: 'A-201',
    grade: 'Grade 3',
    level: 'Level 2',
    shift: 'General Shift (8:00 AM - 4:00 PM)',
    workingDays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'],

    weeklyOff: ['Sunday']
  },
  qualification: {
    highest: 'M.Sc. Mathematics',
    fieldOfStudy: 'Pure Mathematics',
    university: 'Delhi University',
    yearOfPassing: '2008',
    percentage: '82%',
    education: [
    {
      degree: 'M.Sc. Mathematics',
      specialization: 'Pure Mathematics',
      institution: 'Delhi University',
      board: 'Delhi University',
      yearOfPassing: '2008',
      percentage: '82%',
      grade: 'First Class with Distinction'
    },
    {
      degree: 'B.Sc. Mathematics',
      specialization: 'Mathematics (Honours)',
      institution: 'Hindu College, Delhi',
      board: 'Delhi University',
      yearOfPassing: '2006',
      percentage: '78%',
      grade: 'First Class'
    },
    {
      degree: 'B.Ed',
      specialization: 'Mathematics Education',
      institution: 'IGNOU',
      board: 'IGNOU',
      yearOfPassing: '2009',
      percentage: '75%',
      grade: 'First Class'
    },
    {
      degree: 'Class XII',
      specialization: 'Science (PCM)',
      institution: 'Kendriya Vidyalaya',
      board: 'CBSE',
      yearOfPassing: '2003',
      percentage: '88%',
      grade: 'First Class with Distinction'
    }],
    professionalQualifications: [
    {
      degree: 'B.Ed',
      institution: 'IGNOU',
      year: '2009',
      grade: '75%',
      specialization: 'Mathematics Education',
      registrationNumber: 'BEd-IGNOU-2009-0034'
    },
    {
      degree: 'CTET Qualification',
      institution: 'CBSE',
      year: '2018',
      grade: 'Qualified',
      specialization: 'Teacher Eligibility',
      registrationNumber: 'CTET-2018-12345'
    }],

    certifications: [
    {
      name: 'CTET Qualified',
      issuingAuthority: 'CBSE',
      issueDate: '2018-01-15',
      expiryDate: '2025-01-15',
      credentialId: 'CTET-2018-12345',
      verified: true
    },
    {
      name: 'Cambridge Teaching Certificate',
      issuingAuthority: 'Cambridge Assessment',
      issueDate: '2019-06-20',
      expiryDate: '2024-06-20',
      credentialId: 'CAM-2019-67890',
      verified: true
    },
    {
      name: 'Google Certified Educator Level 2',
      issuingAuthority: 'Google for Education',
      issueDate: '2022-03-10',
      expiryDate: '2025-03-10',
      credentialId: 'GCE-L2-2022-11111',
      verified: true
    }],

    experience: [
    {
      organization: 'ABC Public School',
      designation: 'Mathematics Teacher',
      from: '2010-04-01',
      to: '2015-03-31',
      duration: '5 years',
      responsibilities:
      'Teaching Mathematics to Grades 9-12, Lab coordination',
      reasonForLeaving: 'Better opportunity',
      location: 'New Delhi',
      lastSalary: '₹42,000 / month',
      verified: true
    },
    {
      organization: 'XYZ Academy',
      designation: 'Senior Teacher',
      from: '2015-04-01',
      to: '2020-03-31',
      duration: '5 years',
      responsibilities:
      'Teaching, Curriculum development, Student mentoring',
      reasonForLeaving: 'Career growth',
      location: 'Gurugram',
      lastSalary: '₹58,000 / month',
      verified: true
    }]

  },
  skills: {
    technicalSkills: ['MS Office', 'Google Workspace', 'GeoGebra', 'MATLAB', 'Learning Management Systems'],
    softSkills: ['Communication', 'Leadership', 'Classroom Management', 'Student Mentoring'],
    hobbies: ['Chess', 'Reading', 'Science Fair Mentoring'],
    languages: [
    {
      name: 'English',
      proficiency: 'fluent'
    },
    {
      name: 'Hindi',
      proficiency: 'native'
    },
    {
      name: 'Sanskrit',
      proficiency: 'intermediate'
    }],

    software: [
    {
      name: 'MS Office',
      proficiency: 'expert'
    },
    {
      name: 'Google Workspace',
      proficiency: 'advanced'
    },
    {
      name: 'GeoGebra',
      proficiency: 'expert'
    },
    {
      name: 'MATLAB',
      proficiency: 'intermediate'
    },
    {
      name: 'Learning Management Systems',
      proficiency: 'advanced'
    }],

    teaching: [
    'Algebra',
    'Calculus',
    'Trigonometry',
    'Statistics',
    'Geometry',
    'Number Theory'],

    extracurricular: [
    'Chess Club Coordinator',
    'Math Olympiad Coach',
    'Science Fair Judge'],

    specializations: [
    'Competitive Mathematics',
    'CBSE Board Preparation',
    'JEE Mathematics']

  },
  bank: {
    bankName: 'State Bank of India',
    branchName: 'Gurgaon Main Branch',
    accountNumber: '****4567',
    accountType: 'Savings',
    ifsc: 'SBIN0001234',
    micrCode: '122002001',
    paymentMode: 'Bank Transfer',
    salaryGrade: 'Grade 3 - Level 2',
    ctc: '₹12,00,000',
    basicPay: '₹50,000'
  },
  documents: [
  {
    id: 'DOC001',
    name: 'Aadhaar Card',
    type: 'Identity Proof',
    category: 'Identity',
    uploadDate: '2020-04-10',
    status: 'Verified',
    verifiedBy: 'HR Admin',
    verifiedDate: '2020-04-12',
    fileSize: '245 KB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC002',
    name: 'PAN Card',
    type: 'Identity Proof',
    category: 'Identity',
    uploadDate: '2020-04-10',
    status: 'Verified',
    verifiedBy: 'HR Admin',
    verifiedDate: '2020-04-12',
    fileSize: '189 KB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC003',
    name: 'Passport',
    type: 'Identity Proof',
    category: 'Identity',
    uploadDate: '2020-04-11',
    expiryDate: '2030-05-15',
    status: 'Verified',
    verifiedBy: 'HR Admin',
    verifiedDate: '2020-04-13',
    fileSize: '512 KB',
    fileType: 'PDF',
    mandatory: false
  },
  {
    id: 'DOC004',
    name: 'M.Sc. Degree Certificate',
    type: 'Education',
    category: 'Academic',
    uploadDate: '2020-04-12',
    status: 'Verified',
    verifiedBy: 'Academic Admin',
    verifiedDate: '2020-04-15',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC005',
    name: 'B.Ed Certificate',
    type: 'Education',
    category: 'Academic',
    uploadDate: '2020-04-12',
    status: 'Verified',
    verifiedBy: 'Academic Admin',
    verifiedDate: '2020-04-15',
    fileSize: '980 KB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC006',
    name: 'Experience Letter - ABC School',
    type: 'Employment',
    category: 'Experience',
    uploadDate: '2020-04-12',
    status: 'Verified',
    verifiedBy: 'HR Admin',
    verifiedDate: '2020-04-14',
    fileSize: '345 KB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC007',
    name: 'Police Verification Certificate',
    type: 'Background Check',
    category: 'Compliance',
    uploadDate: '2020-04-15',
    status: 'Verified',
    verifiedBy: 'Compliance Officer',
    verifiedDate: '2020-04-20',
    fileSize: '567 KB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC008',
    name: 'Medical Fitness Certificate',
    type: 'Medical',
    category: 'Health',
    uploadDate: '2020-04-15',
    status: 'Pending',
    fileSize: '234 KB',
    fileType: 'PDF',
    mandatory: true,
    remarks: 'Awaiting verification from medical officer'
  },
  {
    id: 'DOC009',
    name: 'CTET Certificate',
    type: 'Professional Certification',
    category: 'Certification',
    uploadDate: '2020-04-13',
    expiryDate: '2025-01-15',
    status: 'Verified',
    verifiedBy: 'Academic Admin',
    verifiedDate: '2020-04-16',
    fileSize: '456 KB',
    fileType: 'PDF',
    mandatory: true
  },
  {
    id: 'DOC010',
    name: 'Offer Letter',
    type: 'Employment',
    category: 'Contract',
    uploadDate: '2020-04-08',
    status: 'Verified',
    verifiedBy: 'HR Manager',
    verifiedDate: '2020-04-08',
    fileSize: '678 KB',
    fileType: 'PDF',
    mandatory: true
  }],

  leaveBalance: [
  {
    type: 'Casual Leave',
    code: 'CL',
    entitled: 12,
    taken: 5,
    balance: 7,
    pending: 1,
    carryForward: 0,
    encashable: 0
  },
  {
    type: 'Sick Leave',
    code: 'SL',
    entitled: 10,
    taken: 2,
    balance: 8,
    pending: 0,
    carryForward: 0,
    encashable: 0
  },
  {
    type: 'Earned Leave',
    code: 'EL',
    entitled: 15,
    taken: 3,
    balance: 12,
    pending: 0,
    carryForward: 5,
    encashable: 10
  },
  {
    type: 'Restricted Holiday',
    code: 'RH',
    entitled: 2,
    taken: 1,
    balance: 1,
    pending: 0,
    carryForward: 0,
    encashable: 0
  },
  {
    type: 'Comp Off',
    code: 'CO',
    entitled: 4,
    taken: 2,
    balance: 2,
    pending: 0,
    carryForward: 0,
    encashable: 0
  },
  {
    type: 'Paternity Leave',
    code: 'PL',
    entitled: 15,
    taken: 0,
    balance: 15,
    pending: 0,
    carryForward: 0,
    encashable: 0
  }],

  attendance: {
    summary: {
      totalWorkingDays: 240,
      present: 220,
      absent: 5,
      halfDay: 3,
      lateComings: 8,
      earlyGoings: 2,
      onLeave: 12,
      holidays: 25,
      weeklyOff: 52
    },
    monthlyTrend: [
    {
      month: 'Jan',
      present: 22,
      absent: 0,
      leaves: 2
    },
    {
      month: 'Feb',
      present: 20,
      absent: 1,
      leaves: 1
    },
    {
      month: 'Mar',
      present: 23,
      absent: 0,
      leaves: 0
    },
    {
      month: 'Apr',
      present: 18,
      absent: 1,
      leaves: 2
    },
    {
      month: 'May',
      present: 21,
      absent: 0,
      leaves: 1
    },
    {
      month: 'Jun',
      present: 20,
      absent: 1,
      leaves: 1
    }],

    recentLogs: [
    {
      date: '2024-12-16',
      inTime: '07:45 AM',
      outTime: '04:15 PM',
      totalHours: '8h 30m',
      status: 'Present'
    },
    {
      date: '2024-12-15',
      inTime: '08:00 AM',
      outTime: '04:00 PM',
      totalHours: '8h 00m',
      status: 'Present'
    },
    {
      date: '2024-12-14',
      inTime: '07:55 AM',
      outTime: '04:30 PM',
      totalHours: '8h 35m',
      status: 'Present'
    },
    {
      date: '2024-12-13',
      inTime: '08:10 AM',
      outTime: '04:00 PM',
      totalHours: '7h 50m',
      status: 'Late',
      remarks: 'Traffic delay'
    },
    {
      date: '2024-12-12',
      inTime: '-',
      outTime: '-',
      totalHours: '-',
      status: 'Leave',
      remarks: 'Casual Leave'
    }]

  },
  schedule: {
    today: [
    {
      time: '08:00 - 08:45',
      subject: 'Mathematics',
      class: 'Class 10-A',
      room: 'Room 201',
      status: 'completed'
    },
    {
      time: '08:45 - 09:30',
      subject: 'Mathematics',
      class: 'Class 10-B',
      room: 'Room 202',
      status: 'completed'
    },
    {
      time: '09:30 - 10:00',
      subject: 'Break',
      class: '-',
      room: '-',
      status: 'break'
    },
    {
      time: '10:00 - 10:45',
      subject: 'Mathematics',
      class: 'Class 11-A',
      room: 'Room 301',
      status: 'ongoing'
    },
    {
      time: '10:45 - 11:30',
      subject: 'Free Period',
      class: '-',
      room: 'Staff Room',
      status: 'upcoming'
    },
    {
      time: '11:30 - 12:15',
      subject: 'Mathematics',
      class: 'Class 12-A',
      room: 'Room 401',
      status: 'upcoming'
    },
    {
      time: '12:15 - 01:00',
      subject: 'Lunch Break',
      class: '-',
      room: '-',
      status: 'break'
    },
    {
      time: '01:00 - 01:45',
      subject: 'Mathematics',
      class: 'Class 9-A',
      room: 'Room 101',
      status: 'upcoming'
    },
    {
      time: '01:45 - 02:30',
      subject: 'Mathematics',
      class: 'Class 9-B',
      room: 'Room 102',
      status: 'upcoming'
    },
    {
      time: '02:30 - 03:15',
      subject: 'Admin Work',
      class: '-',
      room: 'Staff Room',
      status: 'upcoming'
    },
    {
      time: '03:15 - 04:00',
      subject: 'Remedial Class',
      class: 'Class 10 (Selected)',
      room: 'Room 203',
      status: 'upcoming'
    }],

    weeklyLoad: [
    {
      day: 'Monday',
      teachingHours: 6,
      adminHours: 2,
      totalPeriods: 8
    },
    {
      day: 'Tuesday',
      teachingHours: 5,
      adminHours: 2,
      totalPeriods: 7
    },
    {
      day: 'Wednesday',
      teachingHours: 6,
      adminHours: 1,
      totalPeriods: 7
    },
    {
      day: 'Thursday',
      teachingHours: 5,
      adminHours: 2,
      totalPeriods: 7
    },
    {
      day: 'Friday',
      teachingHours: 6,
      adminHours: 2,
      totalPeriods: 8
    },
    {
      day: 'Saturday',
      teachingHours: 4,
      adminHours: 1,
      totalPeriods: 5
    }],

    classMapping: [
    {
      class: 'Class 9',
      section: 'A',
      subject: 'Mathematics',
      students: 42,
      periodsPerWeek: 6
    },
    {
      class: 'Class 9',
      section: 'B',
      subject: 'Mathematics',
      students: 40,
      periodsPerWeek: 6
    },
    {
      class: 'Class 10',
      section: 'A',
      subject: 'Mathematics',
      students: 38,
      periodsPerWeek: 6
    },
    {
      class: 'Class 10',
      section: 'B',
      subject: 'Mathematics',
      students: 41,
      periodsPerWeek: 6
    },
    {
      class: 'Class 11',
      section: 'A',
      subject: 'Mathematics',
      students: 35,
      periodsPerWeek: 5
    },
    {
      class: 'Class 12',
      section: 'A',
      subject: 'Mathematics',
      students: 32,
      periodsPerWeek: 5
    }]

  },
  performance: {
    currentRating: 4.2,
    lastAppraisalDate: '2024-03-15',
    nextAppraisalDate: '2025-03-15',
    studentOutcomes: [
    {
      class: 'Class 10-A',
      subject: 'Mathematics',
      averageScore: 78.5,
      passRate: 96,
      priorYearAverageScore: 73.3,
      priorYearPassRate: 91.2,
      trend: 'up',
      comparison: '+5.2% vs last year'
    },
    {
      class: 'Class 10-B',
      subject: 'Mathematics',
      averageScore: 74.2,
      passRate: 92,
      priorYearAverageScore: 73.1,
      priorYearPassRate: 90.9,
      trend: 'stable',
      comparison: '+1.1% vs last year'
    },
    {
      class: 'Class 11-A',
      subject: 'Mathematics',
      averageScore: 71.8,
      passRate: 88,
      priorYearAverageScore: 68.3,
      priorYearPassRate: 84.5,
      trend: 'up',
      comparison: '+3.5% vs last year'
    },
    {
      class: 'Class 12-A',
      subject: 'Mathematics',
      averageScore: 82.3,
      passRate: 100,
      priorYearAverageScore: 74.5,
      priorYearPassRate: 92.2,
      trend: 'up',
      comparison: '+7.8% vs last year'
    }],

    feedback: [
    {
      type: 'student',
      rating: 4.5,
      comment:
      'Excellent teaching methodology. Makes complex topics easy to understand.',
      date: '2024-11-15',
      anonymous: true
    },
    {
      type: 'parent',
      rating: 4.8,
      comment:
      'Very dedicated teacher. My child has shown significant improvement.',
      date: '2024-10-20',
      anonymous: false
    },
    {
      type: 'peer',
      rating: 4.2,
      comment: 'Great team player. Always willing to help colleagues.',
      date: '2024-09-10',
      anonymous: false
    },
    {
      type: 'admin',
      rating: 4.0,
      comment: 'Consistently meets deadlines. Good classroom management.',
      date: '2024-08-05',
      anonymous: false
    }],

    cpdCourses: [
    {
      name: 'Advanced Pedagogy for Mathematics',
      provider: 'Cambridge Assessment',
      completedDate: '2024-06-15',
      hours: 40,
      certificate: true,
      category: 'Teaching Methodology'
    },
    {
      name: 'Digital Tools for Classroom',
      provider: 'Google for Education',
      completedDate: '2024-04-20',
      hours: 20,
      certificate: true,
      category: 'Technology'
    },
    {
      name: 'Student Assessment Techniques',
      provider: 'CBSE',
      completedDate: '2024-02-10',
      hours: 15,
      certificate: true,
      category: 'Assessment'
    },
    {
      name: 'Inclusive Education Practices',
      provider: 'NCERT',
      completedDate: '2023-11-25',
      hours: 25,
      certificate: true,
      category: 'Inclusive Education'
    }],

    kras: [
    {
      title: 'Improve Class 10 Board Results',
      description: 'Achieve minimum 85% class average in Mathematics',
      target: 85,
      achieved: 78,
      unit: '%',
      deadline: '2025-03-31',
      status: 'on-track'
    },
    {
      title: 'Student Pass Rate',
      description: 'Maintain 100% pass rate across all classes',
      target: 100,
      achieved: 96,
      unit: '%',
      deadline: '2025-03-31',
      status: 'at-risk'
    },
    {
      title: 'Professional Development',
      description: 'Complete 60 hours of CPD courses',
      target: 60,
      achieved: 100,
      unit: 'hours',
      deadline: '2024-12-31',
      status: 'achieved'
    },
    {
      title: 'Parent Engagement',
      description: 'Conduct monthly parent interaction sessions',
      target: 12,
      achieved: 8,
      unit: 'sessions',
      deadline: '2024-12-31',
      status: 'on-track'
    }],

    overallScore: 4.2,
    rank: 'A',
    percentile: 85
  },
  engagement: {
    achievements: [
    {
      title: 'Teacher of the Month',
      description:
      'Recognized for outstanding performance in student mentoring',
      date: '2024-09-01',
      category: 'award',
      icon: 'trophy'
    },
    {
      title: 'Best Math Olympiad Coach',
      description: '3 students qualified for National Math Olympiad',
      date: '2024-07-15',
      category: 'recognition',
      icon: 'medal'
    },
    {
      title: 'Published Research Paper',
      description:
      'Innovative Teaching Methods in Mathematics - Educational Journal',
      date: '2024-05-20',
      category: 'publication',
      icon: 'book'
    },
    {
      title: 'Annual Day Coordinator',
      description:
      'Successfully coordinated school annual day celebrations',
      date: '2024-02-28',
      category: 'event',
      icon: 'star'
    }],

    disciplinaryRecords: [],
    responsibilities: [
    'Class Teacher - Class 10-A',
    'Math Olympiad Coordinator',
    'Quiz Club Faculty Advisor'],

    mentoring: ['Priya Sharma (EMP-2023-045)', 'Amit Singh (EMP-2024-012)']
  },
  health: {
    bloodGroup: 'B+',
    allergies: ['Dust'],
    medicalConditions: ['None'],
    emergencyMedical: 'No specific requirements',
    insuranceNumber: 'INS-2020-001234',
    lastCheckup: '2024-06-15',
    vaccinations: [
    {
      name: 'COVID-19 (Covishield)',
      date: '2021-05-10'
    },
    {
      name: 'COVID-19 Booster',
      date: '2022-03-15'
    },
    {
      name: 'Influenza',
      date: '2024-01-20'
    }]

  },
  systemInfo: {
    createdAt: '2020-04-10',
    createdBy: 'HR Admin',
    lastModified: '2024-12-15',
    modifiedBy: 'System',
    lastLogin: '2024-12-16 07:45:00',
    loginHistory: [
    {
      date: '2024-12-16 07:45:00',
      ip: '192.168.1.100',
      device: 'Desktop - Chrome'
    },
    {
      date: '2024-12-15 08:00:00',
      ip: '192.168.1.100',
      device: 'Desktop - Chrome'
    },
    {
      date: '2024-12-14 07:55:00',
      ip: '192.168.1.100',
      device: 'Desktop - Chrome'
    }],

    accessLevel: 'Teacher',
    permissions: [
    'View Students',
    'Enter Marks',
    'Take Attendance',
    'View Timetable']

  }
},
{
  id: 'EMP002',
  code: 'EMP-2019-015',
  firstName: 'Priya',
  lastName: 'Sharma',
  fullName: 'Priya Sharma',
  designation: 'English Teacher',
  department: 'English',
  status: 'Active',
  avatar: 'PS',
  dateOfJoining: '2019-07-01',
  yearsOfService: 5,
  reportingManager: 'Mrs. Gupta (HOD)',
  staffType: 'Teaching',
  confirmationDate: '2020-01-01',
  retirementDate: '2049-06-30',
  employeeCategory: 'Regular',
  payrollId: 'PAY-2019-015',
  biometricId: 'BIO-015',
  personal: {
    dateOfBirth: '1990-03-15',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    caste: '',
    aadhaar: '9876-5432-1098',
    pan: 'FGHIJ5678K',
    passport: 'K9876543',
    drivingLicense: 'DL-1420120067890',
    voterId: 'DEF5678901',
    maritalStatus: 'Single',
    fatherName: 'Mohan Sharma',
    motherName: 'Geeta Sharma',
    numberOfDependents: 0
  },
  contact: {
    mobile: '9876543220',
    alternateMobile: '9876543221',
    officialEmail: 'priya.sharma@school.edu',
    personalEmail: 'priya.sharma@gmail.com',
    permanentAddress: {
      line1: '789, Rose Garden',
      line2: 'Block C',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002',
      country: 'India'
    },
    currentAddress: {
      line1: '789, Rose Garden',
      line2: 'Block C',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110002',
      country: 'India'
    },
    sameAsPermanent: true,
    emergencyContacts: [
    {
      name: 'Mohan Sharma',
      relationship: 'Father',
      phone: '9876543222',
      address: '789, Rose Garden, Delhi'
    }]

  },
  statutory: {
    pfNumber: 'DLCPM9876543000',
    esiNumber: 'ESI987654321012',
    uanNumber: '200987654321',
    gratuityNomination: 'Mohan Sharma (Father) - 100%',
    taxRegime: 'Old Tax Regime',
    form16Available: true
  },
  employment: {
    staffType: 'Teaching',
    employmentType: 'Permanent',
    department: 'English',
    designation: 'English Teacher',
    dateOfJoining: '2019-07-01',
    confirmationDate: '2020-01-01',
    probationPeriod: '6 months',
    noticePeriod: '3 months',
    reportingManager: 'Mrs. Gupta (HOD)',
    reportingManagerId: 'EMP-2014-002',
    location: 'Main Campus',
    campus: 'Central Campus',
    building: 'Block B',
    floor: '1st Floor',
    desk: 'B-105',
    grade: 'Grade 2',
    level: 'Level 3',
    shift: 'General Shift (8:00 AM - 4:00 PM)',
    workingDays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'],

    weeklyOff: ['Sunday']
  },
  qualification: {
    highest: 'M.A. English',
    fieldOfStudy: 'English Literature',
    university: 'JNU',
    yearOfPassing: '2014',
    percentage: '76%',
    education: [
    {
      degree: 'M.A. English',
      specialization: 'English Literature',
      institution: 'JNU',
      board: 'JNU',
      yearOfPassing: '2014',
      percentage: '76%',
      grade: 'First Class'
    }],

    certifications: [
    {
      name: 'CTET Qualified',
      issuingAuthority: 'CBSE',
      issueDate: '2019-01-20',
      expiryDate: '2026-01-20',
      credentialId: 'CTET-2019-54321',
      verified: true
    }],

    experience: [
    {
      organization: 'DEF School',
      designation: 'English Teacher',
      from: '2015-04-01',
      to: '2019-06-30',
      duration: '4 years',
      responsibilities: 'Teaching English to Grades 6-10',
      reasonForLeaving: 'Better opportunity',
      verified: true
    }]

  },
  skills: {
    languages: [
    {
      name: 'English',
      proficiency: 'native'
    },
    {
      name: 'Hindi',
      proficiency: 'fluent'
    }],

    software: [
    {
      name: 'MS Office',
      proficiency: 'advanced'
    },
    {
      name: 'Google Workspace',
      proficiency: 'advanced'
    }],

    teaching: ['Grammar', 'Literature', 'Creative Writing'],
    extracurricular: ['Drama Club Coordinator', 'Debate Coach'],
    specializations: ['CBSE English', 'Public Speaking']
  },
  bank: {
    bankName: 'HDFC Bank',
    branchName: 'Delhi Main Branch',
    accountNumber: '****8901',
    accountType: 'Savings',
    ifsc: 'HDFC0001234',
    micrCode: '110240001',
    paymentMode: 'Bank Transfer',
    salaryGrade: 'Grade 2 - Level 3',
    ctc: '₹9,00,000',
    basicPay: '₹40,000'
  },
  documents: [
  {
    id: 'DOC011',
    name: 'Aadhaar Card',
    type: 'Identity Proof',
    category: 'Identity',
    uploadDate: '2019-06-25',
    status: 'Verified',
    verifiedBy: 'HR Admin',
    verifiedDate: '2019-06-27',
    fileSize: '220 KB',
    fileType: 'PDF',
    mandatory: true
  }],

  leaveBalance: [
  {
    type: 'Casual Leave',
    code: 'CL',
    entitled: 12,
    taken: 3,
    balance: 9,
    pending: 0,
    carryForward: 0,
    encashable: 0
  },
  {
    type: 'Sick Leave',
    code: 'SL',
    entitled: 10,
    taken: 1,
    balance: 9,
    pending: 0,
    carryForward: 0,
    encashable: 0
  }],

  attendance: {
    summary: {
      totalWorkingDays: 240,
      present: 230,
      absent: 2,
      halfDay: 1,
      lateComings: 3,
      earlyGoings: 1,
      onLeave: 7,
      holidays: 25,
      weeklyOff: 52
    },
    monthlyTrend: [
    {
      month: 'Jan',
      present: 23,
      absent: 0,
      leaves: 1
    }],

    recentLogs: [
    {
      date: '2024-12-16',
      inTime: '07:50 AM',
      outTime: '04:10 PM',
      totalHours: '8h 20m',
      status: 'Present'
    }]

  },
  schedule: {
    today: [
    {
      time: '08:00 - 08:45',
      subject: 'English',
      class: 'Class 8-A',
      room: 'Room 105',
      status: 'completed'
    }],

    weeklyLoad: [
    {
      day: 'Monday',
      teachingHours: 6,
      adminHours: 1,
      totalPeriods: 7
    }],

    classMapping: [
    {
      class: 'Class 8',
      section: 'A',
      subject: 'English',
      students: 40,
      periodsPerWeek: 6
    }]

  },
  performance: {
    currentRating: 4.0,
    lastAppraisalDate: '2024-03-15',
    nextAppraisalDate: '2025-03-15',
    studentOutcomes: [
    {
      class: 'Class 8-A',
      subject: 'English',
      averageScore: 75.0,
      passRate: 98,
      priorYearAverageScore: 72.0,
      priorYearPassRate: 95,
      trend: 'up',
      comparison: '+3.0% vs last year'
    }],

    feedback: [
    {
      type: 'student',
      rating: 4.3,
      comment: 'Great teacher!',
      date: '2024-11-10',
      anonymous: true
    }],

    cpdCourses: [
    {
      name: 'Creative Writing Workshop',
      provider: 'British Council',
      completedDate: '2024-05-10',
      hours: 20,
      certificate: true,
      category: 'Teaching Methodology'
    }],

    kras: [
    {
      title: 'Improve Writing Skills',
      description: 'Enhance student creative writing',
      target: 80,
      achieved: 75,
      unit: '%',
      deadline: '2025-03-31',
      status: 'on-track'
    }],

    overallScore: 4.0,
    rank: 'B+',
    percentile: 75
  },
  engagement: {
    achievements: [
    {
      title: 'Best Drama Production',
      description: 'Annual Day Drama received best performance award',
      date: '2024-02-15',
      category: 'event',
      icon: 'star'
    }],

    disciplinaryRecords: [],
    responsibilities: ['Drama Club Advisor'],
    mentoring: []
  },
  health: {
    bloodGroup: 'A+',
    allergies: [],
    medicalConditions: [],
    emergencyMedical: 'None',
    insuranceNumber: 'INS-2019-002345',
    lastCheckup: '2024-05-20',
    vaccinations: [
    {
      name: 'COVID-19',
      date: '2021-06-15'
    }]

  },
  systemInfo: {
    createdAt: '2019-06-25',
    createdBy: 'HR Admin',
    lastModified: '2024-12-10',
    modifiedBy: 'System',
    lastLogin: '2024-12-16 07:50:00',
    loginHistory: [
    {
      date: '2024-12-16 07:50:00',
      ip: '192.168.1.101',
      device: 'Desktop - Firefox'
    }],

    accessLevel: 'Teacher',
    permissions: ['View Students', 'Enter Marks', 'Take Attendance']
  }
}];

// Section Info Data
const sectionInfoData: Record<string, MetricInfo> = {
  personal: {
    title: 'Personal Details',
    description:
    'Core biographical information and identity details of the employee.',
    dataSource: {
      title: 'Data Source',
      description:
      'Information collected during onboarding and periodically verified through employee self-service updates.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Accurate personal data ensures proper statutory compliance, tax calculations, and emergency contact procedures.'
    },
    recommendedActions: [
    {
      title: 'Verify Aadhaar details with UIDAI'
    },
    {
      title: 'Update emergency contact information'
    }]

  },
  contact: {
    title: 'Contact & Address Information',
    description:
    'Complete contact details including phone numbers, email addresses, and physical addresses.',
    dataSource: {
      title: 'Data Source',
      description:
      'Employee self-service portal entries, verified during onboarding.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Reliable contact information is critical for urgent communications and emergency response protocols.'
    },
    recommendedActions: [
    {
      title: 'Verify current address with proof'
    },
    {
      title: 'Update emergency contacts annually'
    }]

  },
  statutory: {
    title: 'Statutory & Compliance Information',
    description:
    'Tax identifiers, pension numbers, and other statutory information required for payroll processing.',
    dataSource: {
      title: 'Data Source',
      description: 'Integrated with EPFO, ESIC, and Income Tax portals.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Ensures legal compliance with labor laws and proper tax deductions.'
    },
    recommendedActions: [
    {
      title: 'Verify UAN linkage with Aadhaar'
    },
    {
      title: 'Review tax regime selection'
    }]

  },
  employment: {
    title: 'Employment Information',
    description:
    'Current employment details including department, designation, and reporting structure.',
    dataSource: {
      title: 'Data Source',
      description: 'HR Master Data integrated with organizational structure.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Drives access controls, approval workflows, and salary calculations.'
    },
    recommendedActions: [
    {
      title: 'Review reporting structure accuracy'
    },
    {
      title: 'Verify location and desk assignment'
    }]

  },
  qualification: {
    title: 'Qualification & Experience',
    description:
    'Educational background, professional certifications, and prior work experience.',
    dataSource: {
      title: 'Data Source',
      description: 'Verified against original certificates during onboarding.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Ensures teachers meet regulatory requirements and drives subject allocation.'
    },
    recommendedActions: [
    {
      title: 'Verify certification validity dates'
    },
    {
      title: 'Update new qualifications added'
    }]

  },
  skills: {
    title: 'Skills & Competencies',
    description:
    'Languages spoken, software proficiency, teaching specializations, and extracurricular talents.',
    dataSource: {
      title: 'Data Source',
      description:
      'Self-reported skills verified through assessments and peer endorsements.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Enables matching teachers to subjects and identifying training needs.'
    },
    recommendedActions: [
    {
      title: 'Conduct skills assessment'
    },
    {
      title: 'Map skills to training needs'
    }]

  },
  schedule: {
    title: 'Schedule Details',
    description:
    'Current timetable and class mappings.',
    dataSource: {
      title: 'Data Source',
      description: 'Integrated with timetable management system.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Keeps class schedules accurate and helps prevent scheduling conflicts.'
    },
    recommendedActions: [
    {
      title: 'Review timetable assignments'
    },
    {
      title: 'Check for scheduling conflicts'
    }]

  },
  attendance: {
    title: 'Attendance & Leave',
    description:
    'Real-time attendance tracking, leave balances, and historical patterns.',
    dataSource: {
      title: 'Data Source',
      description:
      'Biometric attendance system integrated with leave management.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Accurate attendance affects salary calculations and leave encashment.'
    },
    recommendedActions: [
    {
      title: 'Review late coming patterns'
    },
    {
      title: 'Process pending leave approvals'
    }]

  },
  performance: {
    title: 'Performance & Growth',
    description:
    'Student outcomes, feedback scores, and continuing professional development.',
    dataSource: {
      title: 'Data Source',
      description:
      'Aggregated from examination system, feedback portal, and LMS.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Supports fair appraisals, promotion decisions, and professional development planning.'
    },
    recommendedActions: [
    {
      title: 'Review performance trends'
    },
    {
      title: 'Schedule feedback discussion'
    }]

  },
  engagement: {
    title: 'Engagement & Welfare',
    description:
    'Achievements, awards, health and wellness information, and disciplinary records.',
    dataSource: {
      title: 'Data Source',
      description:
      'Maintained by HR through recognition, wellness, and disciplinary records.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Recognizes employee contributions and supports staff wellbeing.'
    },
    recommendedActions: [
    {
      title: 'Update achievement records'
    },
    {
      title: 'Review health and wellness details'
    }]

  },
  health: {
    title: 'Health & Wellness',
    description:
    'Medical information, blood group, allergies, and health records.',
    dataSource: {
      title: 'Data Source',
      description:
      'Medical examination records and self-declared health information.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Critical for emergency medical response and ensuring safe working conditions.'
    },
    recommendedActions: [
    {
      title: 'Schedule annual health checkup'
    },
    {
      title: 'Update vaccination records'
    }]

  },
  documents: {
    title: 'Document Vault',
    description: 'Centralized repository of all employee documents.',
    dataSource: {
      title: 'Data Source',
      description: 'Digital document management system with version control.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Ensures legal compliance and supports audit requirements.'
    },
    recommendedActions: [
    {
      title: 'Verify pending documents'
    },
    {
      title: 'Renew expiring certifications'
    }]

  },
  bank: {
    title: 'Bank & Salary Details',
    description:
    'Banking information and salary structure for payroll processing.',
    dataSource: {
      title: 'Data Source',
      description: 'Payroll system integrated with banking APIs.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description: 'Ensures timely and accurate salary disbursement.'
    },
    recommendedActions: [
    {
      title: 'Verify bank account details'
    },
    {
      title: 'Update salary grade changes'
    }]

  }
};
// Utility Components
const InfoIconBtn = ({ onClick }: {onClick: () => void;}) =>
<button
  onClick={onClick}
  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
  title="Learn more">

    <Info className="w-4 h-4 text-gray-400 hover:text-blue-600" />
  </button>;

const InfoBlock = ({
  label,
  value,
  icon,
  highlight





}: {label: string;value: string;icon?: React.ReactNode;highlight?: boolean;}) =>
<div
  className={`rounded-lg p-3 ${highlight ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>

    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-gray-400">{icon}</span>}
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
  </div>;

const ProgressBar = ({
  value,
  max,
  color = 'blue',
  showPct = true





}: {value: number;max: number;color?: string;showPct?: boolean;}) => {
  const pct = Math.min(value / max * 100, 100);
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full transition-all`}
          style={{
            width: `${pct}%`
          }} />

      </div>
      {showPct &&
      <span className="text-xs font-medium text-gray-600 w-10 text-right">
          {Math.round(pct)}%
        </span>
      }
    </div>);

};
const RatingStars = ({ rating, max = 5 }: {rating: number;max?: number;}) =>
<div className="flex items-center gap-1">
    {Array.from({
    length: max
  }).map((_, i) =>
  <Star
    key={i}
    className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : i < rating ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-gray-300'}`} />

  )}
    <span className="ml-1 text-sm font-medium text-gray-700">
      {rating.toFixed(1)}
    </span>
  </div>;

const MetricModal = ({
  isOpen,
  onClose,
  info




}: {isOpen: boolean;onClose: () => void;info: MetricInfo | null;}) => {
  if (!isOpen || !info) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{info.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{info.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full">

            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 uppercase text-sm">
                  Data Source
                </h3>
              </div>
              <p className="text-sm text-blue-800">
                {info.dataSource.description}
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 uppercase text-sm">
                  Why It Matters
                </h3>
              </div>
              <p className="text-sm text-purple-800">
                {info.whyItMatters.description}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 uppercase text-sm mb-4">
              Recommended Actions
            </h3>
            <div className="space-y-2">
              {info.recommendedActions.map((action, i) =>
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer group">

                  <span className="text-sm text-gray-700 font-medium">
                    {action.title}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            className="bg-blue-600 text-white flex items-center gap-2">

            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>
    </div>);

};
// Employees disabled from the directory are remembered in this browser (same approach as the health records).
const EMPLOYEE_DISABLED_STORAGE_KEY = 'k12-employee-disabled-v1';

const readDisabledEmployeeIds = (): string[] => {
  try {
    const raw = window.localStorage.getItem(EMPLOYEE_DISABLED_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const writeDisabledEmployeeIds = (ids: string[]) => {
  try {
    window.localStorage.setItem(EMPLOYEE_DISABLED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage is unavailable: the change lasts for this page session only.
  }
};

// The form asks for days: "3 months" becomes 90 days (30 days per month).
const noticePeriodInDays = (text: string): string => {
  const amount = Number((text.match(/\d+/) ?? [''])[0]);
  if (!amount) return '';
  return String(/month/i.test(text) ? amount * 30 : amount);
};

// Maps a directory record to the values used by the Add / Edit Employee Profile form.
const buildEmployeePrefill = (employee: Employee): Record<string, string> => {
  const emergency = employee.contact.emergencyContacts[0];
  return {
    code: employee.code,
    firstName: employee.firstName,
    lastName: employee.lastName,
    gender: employee.personal.gender,
    dateOfBirth: employee.personal.dateOfBirth,
    maritalStatus: employee.personal.maritalStatus,
    nationality: employee.personal.nationality,
    religion: employee.personal.religion,
    category: employee.personal.category,
    caste: employee.personal.caste,
    aadhaar: employee.personal.aadhaar,
    pan: employee.personal.pan,
    voterId: employee.personal.voterId,
    primaryMobile: employee.contact.mobile,
    secondaryMobile: employee.contact.alternateMobile,
    officialEmail: employee.contact.officialEmail,
    personalEmail: employee.contact.personalEmail,
    permanentLine1: employee.contact.permanentAddress.line1,
    permanentLine2: employee.contact.permanentAddress.line2,
    permanentCity: employee.contact.permanentAddress.city,
    permanentState: employee.contact.permanentAddress.state,
    permanentPincode: employee.contact.permanentAddress.pincode,
    currentLine1: employee.contact.currentAddress.line1,
    currentLine2: employee.contact.currentAddress.line2,
    currentCity: employee.contact.currentAddress.city,
    currentState: employee.contact.currentAddress.state,
    currentPincode: employee.contact.currentAddress.pincode,
    emergencyName: emergency ? emergency.name : '',
    emergencyRelation: emergency ? emergency.relationship : '',
    emergencyPhone: emergency ? emergency.phone : '',
    emergencyAddress: emergency ? emergency.address : '',
    staffType: employee.employment.staffType,
    employmentType: employee.employment.employmentType,
    status: employee.status,
    dateOfJoining: employee.dateOfJoining,
    department: employee.department,
    designation: employee.designation,
    campus: employee.employment.campus,
    noticePeriod: noticePeriodInDays(employee.employment.noticePeriod),
    shift: employee.employment.shift,
    primarySubject: employee.skills.teaching[0] ?? '',
    secondarySubjects: employee.skills.teaching.slice(1).join(', '),
    technicalSkills: (employee.skills.technicalSkills ?? []).join(', '),
    softSkills: (employee.skills.softSkills ?? []).join(', '),
    hobbies: (employee.skills.hobbies ?? []).join(', '),
    highestQualification: employee.qualification.highest,
    fieldOfStudy: employee.qualification.fieldOfStudy,
    university: employee.qualification.university,
    yearOfPassing: employee.qualification.yearOfPassing,
    percentage: employee.qualification.percentage,
    bankName: employee.bank.bankName,
    bankBranch: employee.bank.branchName,
    accountNumber: employee.bank.accountNumber,
    ifsc: employee.bank.ifsc,
    accountType: employee.bank.accountType,
    micrCode: employee.bank.micrCode,
    paymentMode: employee.bank.paymentMode,
    salaryGrade: employee.bank.salaryGrade,
    basicPay: employee.bank.basicPay,
    pfNumber: employee.statutory.pfNumber,
    uanNumber: employee.statutory.uanNumber,
    esiNumber: employee.statutory.esiNumber,
    medicalConditions: employee.health.medicalConditions.join(', '),
    allergies: employee.health.allergies.join(', '),
    insuranceNumber: employee.health.insuranceNumber,
    lastCheckup: employee.health.lastCheckup
  };
};

// Main Component
// ==================== DOCUMENT VERIFICATION (client-side) ====================

const DOCUMENT_NOTIFICATION_KEY = 'erp.employeeDocumentNotifications';

const DOCUMENT_AUTHENTICITY_CHECKS = [
  { id: 'identity', label: 'Name, date of birth and ID number match the employee record' },
  { id: 'original', label: 'Document is the original or a certified copy' },
  { id: 'validity', label: 'Document is valid and has not expired' },
  { id: 'issuer', label: 'Issuing authority, stamp or signature is visible and legible' }
];

interface DocumentNotificationRecord {
  id: string;
  recipientCode: string;
  recipientName: string;
  documentName: string;
  reason: string;
  createdAt: string;
  read: boolean;
}

const readDocumentNotifications = (): DocumentNotificationRecord[] => {
  try {
    const raw = window.localStorage.getItem(DOCUMENT_NOTIFICATION_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeDocumentNotification = (record: DocumentNotificationRecord) => {
  try {
    window.localStorage.setItem(DOCUMENT_NOTIFICATION_KEY, JSON.stringify([record, ...readDocumentNotifications()]));
  } catch {
    // Storage unavailable: the rejection still applies for this session.
  }
};

const todayIsoLocal = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export function EmployeeProfileView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [disabledEmployeeIds, setDisabledEmployeeIds] = useState<string[]>(readDisabledEmployeeIds);
  const toggleEmployeeDisabled = (employeeId: string) => {
    const next = disabledEmployeeIds.includes(employeeId) ?
      disabledEmployeeIds.filter((id) => id !== employeeId) :
      [...disabledEmployeeIds, employeeId];
    setDisabledEmployeeIds(next);
    writeDisabledEmployeeIds(next);
  };
  const requestedEmployeeCode = (location.state as { employeeCode?: string } | null)?.employeeCode?.trim().toUpperCase();
  const requestedEmployee = requestedEmployeeCode
    ? mockEmployees.find((candidate) => candidate.code.toUpperCase() === requestedEmployeeCode || candidate.id.toUpperCase() === requestedEmployeeCode)
    : undefined;
  const [selectedId, setSelectedId] = useState<string>(() => requestedEmployee?.id ?? '');
  const [showProfilePage, setShowProfilePage] = useState(Boolean(requestedEmployee));
  const [search, setSearch] = useState(() => requestedEmployee?.code ?? '');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<string | null>(null);
  const [documentOverrides, setDocumentOverrides] = useState<Record<string, Employee['documents']>>({});
  const [reviewDocumentId, setReviewDocumentId] = useState<string | null>(null);
  const [documentChecks, setDocumentChecks] = useState<Record<string, boolean>>({});
  const [documentRemarks, setDocumentRemarks] = useState('');
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentNotice, setDocumentNotice] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    staffType: '',
    designation: '',
    employmentType: '',
    branch: '',
    gender: '',
    joiningFrom: '',
    joiningTo: ''
  });
  const [storedHealthRecords, setStoredHealthRecords] = useState<StoredEmployeeHealthRecords>(readStoredEmployeeHealthRecords);

  useEffect(() => {
    const syncStoredHealthRecords = () => setStoredHealthRecords(readStoredEmployeeHealthRecords());
    window.addEventListener('storage', syncStoredHealthRecords);
    window.addEventListener(EMPLOYEE_HEALTH_RECORDS_EVENT, syncStoredHealthRecords);
    return () => {
      window.removeEventListener('storage', syncStoredHealthRecords);
      window.removeEventListener(EMPLOYEE_HEALTH_RECORDS_EVENT, syncStoredHealthRecords);
    };
  }, []);

  const baseEmployee = mockEmployees.find((e) => e.id === selectedId);
  const storedHealth = baseEmployee
    ? storedHealthRecords[normalizeEmployeeHealthKey(baseEmployee.code)] || storedHealthRecords[normalizeEmployeeHealthKey(baseEmployee.id)]
    : undefined;
  const employee = baseEmployee
    ? {
        ...baseEmployee,
        health: storedHealth
          ? {
              bloodGroup: storedHealth.bloodGroup ?? baseEmployee.health.bloodGroup,
              allergies: storedHealth.allergies ?? baseEmployee.health.allergies,
              medicalConditions: storedHealth.medicalConditions ?? baseEmployee.health.medicalConditions,
              emergencyMedical: storedHealth.emergencyMedical ?? baseEmployee.health.emergencyMedical,
              insuranceNumber: storedHealth.insuranceNumber ?? baseEmployee.health.insuranceNumber,
              lastCheckup: storedHealth.lastCheckup ?? baseEmployee.health.lastCheckup,
              vaccinations: storedHealth.vaccinations ?? baseEmployee.health.vaccinations,
            }
          : baseEmployee.health,
      }
    : undefined;
  const peerFeedback = employee ? employee.performance.feedback.filter((feedback) => feedback.type === 'peer') : [];
  const studentFeedback = employee ? employee.performance.feedback.filter((feedback) => feedback.type === 'student' || feedback.type === 'parent') : [];
  const evaluationFeedback = employee ? employee.performance.feedback.filter((feedback) => feedback.type === 'admin') : [];
  const getFeedbackAverage = (feedback: Feedback[]) =>
    feedback.length ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0;

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((e) => {
      const searchTerm = search.trim().toLowerCase();
      const matchesSearch = !searchTerm || [
        e.fullName, e.id, e.code, e.department, e.designation, e.contact.officialEmail,
        e.contact.personalEmail, e.contact.mobile, e.contact.alternateMobile,
        e.contact.permanentAddress.city, e.contact.permanentAddress.state,
        e.contact.currentAddress.city, e.contact.currentAddress.state,
        e.employment.campus, e.employment.location, e.employment.employmentType,
        e.reportingManager, e.payrollId, e.biometricId, e.statutory.pfNumber, e.statutory.uanNumber,
        e.employeeCategory, e.personal.gender, e.dateOfJoining,
      ].some((value) => value.toLowerCase().includes(searchTerm));
      const matchesDepartment = !filters.department || e.department === filters.department;
      const matchesStatus = !filters.status || e.status === filters.status;
      const matchesStaffType = !filters.staffType || e.staffType === filters.staffType;
      const matchesDesignation = !filters.designation || e.designation.toLowerCase().includes(filters.designation.toLowerCase());
      const matchesEmploymentType = !filters.employmentType || e.employment.employmentType === filters.employmentType;
      const matchesBranch = !filters.branch || e.employment.campus === filters.branch || e.employment.location === filters.branch;
      const matchesGender = !filters.gender || e.personal.gender === filters.gender;
      const matchesJoiningFrom = !filters.joiningFrom || e.dateOfJoining >= filters.joiningFrom;
      const matchesJoiningTo = !filters.joiningTo || e.dateOfJoining <= filters.joiningTo;
      return matchesSearch && matchesDepartment && matchesStatus && matchesStaffType && matchesDesignation
        && matchesEmploymentType && matchesBranch && matchesGender && matchesJoiningFrom && matchesJoiningTo;
    });
  }, [search, filters]);
  const selectEmployee = (id: string) => {
    setSelectedId(id);
    setShowProfilePage(true);
    setActiveTab('overview');
    setActiveSubTab('personal');
  };
  const returnToDirectory = () => {
    setShowProfilePage(false);
    setSelectedId('');
    setSearch('');
    setFilters({ department: '', status: '', staffType: '', designation: '', employmentType: '', branch: '', gender: '', joiningFrom: '', joiningTo: '' });
    setActiveTab('overview');
    setActiveSubTab('personal');
  };
  const employeeDocuments = employee ? (documentOverrides[employee.id] ?? employee.documents) : [];
  const reviewDocument = employeeDocuments.find((doc) => doc.id === reviewDocumentId) ?? null;

  const openDocumentReview = (docId: string) => {
    setReviewDocumentId(docId);
    setDocumentChecks({});
    setDocumentRemarks('');
    setDocumentError(null);
  };

  const closeDocumentReview = () => {
    setReviewDocumentId(null);
    setDocumentError(null);
  };

  const decideDocument = (decision: 'Verified' | 'Rejected') => {
    if (!reviewDocument || !employee) return;
    const remarks = documentRemarks.trim();
    if (decision === 'Verified' && !DOCUMENT_AUTHENTICITY_CHECKS.every((check) => documentChecks[check.id])) {
      setDocumentError('Tick all authenticity checks before verifying this document.');
      return;
    }
    if (decision === 'Rejected' && !remarks) {
      setDocumentError('Enter the reason for rejection. The reason is sent to the employee.');
      return;
    }
    const today = todayIsoLocal();
    setDocumentOverrides((prev) => ({
      ...prev,
      [employee.id]: employeeDocuments.map((doc) => (
        doc.id === reviewDocument.id
          ? { ...doc, status: decision, verifiedBy: 'HR Admin', verifiedDate: today, remarks: remarks || doc.remarks }
          : doc
      ))
    }));
    if (decision === 'Rejected') {
      writeDocumentNotification({
        id: `DOCN-${Date.now()}`,
        recipientCode: employee.code,
        recipientName: employee.fullName,
        documentName: reviewDocument.name,
        reason: remarks,
        createdAt: new Date().toISOString(),
        read: false
      });
      setDocumentNotice(`"${reviewDocument.name}" was rejected. A notification has been sent to ${employee.fullName}.`);
    } else {
      setDocumentNotice(`"${reviewDocument.name}" was verified for ${employee.fullName}.`);
    }
    setReviewDocumentId(null);
    setDocumentError(null);
  };

  const openModal = (section: string) => {
    setModalSection(section);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalSection(null);
  };
  const getStatusBadge = (status: string) => {
    const cfg: Record<
      string,
      {
        variant: 'success' | 'warning' | 'danger' | 'info';
        icon: React.ReactNode;
      }> =
    {
      Active: {
        variant: 'success',
        icon: <CheckCircle className="w-3 h-3" />
      },
      Probation: {
        variant: 'warning',
        icon: <Clock className="w-3 h-3" />
      },
      'On Leave': {
        variant: 'info',
        icon: <Calendar className="w-3 h-3" />
      },
      Resigned: {
        variant: 'danger',
        icon: <AlertCircle className="w-3 h-3" />
      },
      Terminated: {
        variant: 'danger',
        icon: <XCircle className="w-3 h-3" />
      }
    };
    const c = cfg[status] || {
      variant: 'secondary' as const,
      icon: null
    };
    return (
      <Badge variant={c.variant} className="flex items-center gap-1">
        {c.icon}
        {status}
      </Badge>);

  };
  const getDocBadge = (s: string) => {
    const v: Record<string, 'success' | 'warning' | 'danger'> = {
      Verified: 'success',
      Pending: 'warning',
      Rejected: 'danger',
      Expired: 'danger'
    };
    return <Badge variant={v[s] || 'secondary'}>{s}</Badge>;
  };
  const getKRAColor = (s: string) => {
    const c: Record<string, string> = {
      'on-track': 'text-green-600 bg-green-50',
      'at-risk': 'text-orange-600 bg-orange-50',
      achieved: 'text-blue-600 bg-blue-50',
      missed: 'text-red-600 bg-red-50'
    };
    return c[s] || 'text-gray-600 bg-gray-50';
  };
  const mainTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: User
  },
  {
    id: 'essentials',
    label: 'Essentials',
    icon: Shield
  },
  {
    id: 'professional',
    label: 'Professional',
    icon: GraduationCap
  },
  {
    id: 'operational',
    label: 'Operational',
    icon: Clock
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Target
  },
  {
    id: 'engagement',
    label: 'Engagement',
    icon: Award
  }];

  const subTabs: Record<
    string,
    {
      id: string;
      label: string;
      icon: any;
    }[]> =
  {
    essentials: [
    {
      id: 'personal',
      label: 'Bio-Data',
      icon: User
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Phone
    },
    {
      id: 'employment',
      label: 'Employment',
      icon: Briefcase
    },
    {
      id: 'family',
      label: 'Family & Nominee',
      icon: Users
    },
    {
      id: 'statutory',
      label: 'Statutory',
      icon: Shield
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FolderOpen
    },
    {
      id: 'bank',
      label: 'Bank & Salary',
      icon: CreditCard
    },
    {
      id: 'account',
      label: 'Account Details',
      icon: Settings
    },
    {
      id: 'system',
      label: 'System Access',
      icon: Lock
    }],

    professional: [
    {
      id: 'qualification',
      label: 'Qualifications',
      icon: GraduationCap
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Layers
    },
    {
      id: 'certifications',
      label: 'Certifications & Courses',
      icon: Award
    }],

    operational: [
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: Users
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Clock
    },
    {
      id: 'leave',
      label: 'Leave',
      icon: CalendarDays
    },
    {
      id: 'settings',
      label: 'Settings & Assets',
      icon: Settings
    }],

    performance: [
    {
      id: 'outcomes',
      label: 'Outcomes',
      icon: TrendingUp
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare
    },
    {
      id: 'cpd',
      label: 'CPD',
      icon: BookOpen
    },
    ],

    engagement: [
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy
    },
    {
      id: 'responsibilities',
      label: 'Responsibilities',
      icon: Briefcase
    },
    {
      id: 'health',
      label: 'Health',
      icon: Heart
    },
    {
      id: 'disciplinary',
      label: 'Records',
      icon: FileText
    }]

  };
  const departments = [...new Set(mockEmployees.map((e) => e.department))];
  const statuses = [...new Set(mockEmployees.map((e) => e.status))];
  const staffTypes = [...new Set(mockEmployees.map((e) => e.staffType))];
  const employmentTypes = [...new Set(mockEmployees.map((e) => e.employment.employmentType))];
  const branches = [...new Set(mockEmployees.flatMap((e) => [e.employment.campus, e.employment.location]))].filter(Boolean);
  const genders = [...new Set(mockEmployees.map((e) => e.personal.gender))];
  const clearFilters = () => {
    setSearch('');
    setFilters({ department: '', status: '', staffType: '', designation: '', employmentType: '', branch: '', gender: '', joiningFrom: '', joiningTo: '' });
  };
  const renderSubNav = (
  tabs: {
    id: string;
    label: string;
    icon: any;
  }[]) =>

  <Card className="p-4">
      <div className="space-y-1">
        {tabs.map((t) =>
      <button
        key={t.id}
        onClick={() => setActiveSubTab(t.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSubTab === t.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>

            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
      )}
      </div>
    </Card>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal
        isOpen={!!reviewDocument}
        onClose={closeDocumentReview}
        title={reviewDocument ? `Verify Document: ${reviewDocument.name}` : 'Verify Document'}
        size="lg"
        footer={reviewDocument ? (
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={closeDocumentReview}>Close</Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="danger" onClick={() => decideDocument('Rejected')}>Reject Document</Button>
              <Button variant="primary" onClick={() => decideDocument('Verified')}>Verify Document</Button>
            </div>
          </div>
        ) : null}>
        {reviewDocument && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400" />
                <p className="mt-3 text-sm font-medium text-gray-800">{reviewDocument.name}</p>
                <p className="text-xs text-gray-500">{reviewDocument.fileType} • {reviewDocument.fileSize}</p>
                <p className="mt-4 max-w-xs text-xs text-gray-500">
                  Preview not available. Uploaded files are not stored in this prototype, so check the original document before you decide.
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Current status</span>
                  {getDocBadge(reviewDocument.status)}
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="text-gray-900">{reviewDocument.category || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Uploaded</span><span className="text-gray-900">{reviewDocument.uploadDate || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Expiry</span><span className="text-gray-900">{reviewDocument.expiryDate || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Mandatory</span><span className="text-gray-900">{reviewDocument.mandatory ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Last verified by</span><span className="text-gray-900">{reviewDocument.verifiedBy || '—'}</span></div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">Authenticity checks</p>
              <div className="space-y-2">
                {DOCUMENT_AUTHENTICITY_CHECKS.map((check) => (
                  <label key={check.id} className="flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={!!documentChecks[check.id]}
                      onChange={(e) => setDocumentChecks((prev) => ({ ...prev, [check.id]: e.target.checked }))} />
                    <span>{check.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Remarks / reason for rejection</label>
              <textarea
                rows={3}
                value={documentRemarks}
                onChange={(e) => setDocumentRemarks(e.target.value)}
                placeholder="Required when rejecting. This reason is sent to the employee."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {documentError && <p className="text-sm text-red-600">{documentError}</p>}
          </div>
        )}
      </Modal>
      <MetricModal
        isOpen={modalOpen}
        onClose={closeModal}
        info={modalSection ? sectionInfoData[modalSection] : null} />


      <div className="space-y-6 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>HR</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Employee</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">Directory & Profile</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              Employee Directory & Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {showProfilePage ? 'Complete employee profile with personal, employment, academic, financial, operational, and access details.' : 'Search the directory, refine the filters, then open an employee profile as a separate view.'}
            </p>
          </div>
          {showProfilePage && employee &&
          <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/hr/employee/add-edit-employee-profile', { state: { prefill: buildEmployeePrefill(employee) } })}
                className="flex items-center gap-2">

                <Pencil className="w-4 h-4" />Edit
              </Button>
              <Button
                variant={disabledEmployeeIds.includes(employee.id) ? 'primary' : 'danger'}
                onClick={() => toggleEmployeeDisabled(employee.id)}
                className="flex items-center gap-2">

                {disabledEmployeeIds.includes(employee.id) ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                {disabledEmployeeIds.includes(employee.id) ? 'Enable' : 'Disable'}
              </Button>
              <Button variant="outline" onClick={returnToDirectory}>Back to Employee List</Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />Sync
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />Print
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />Share
              </Button>
            </div>
          }
        </div>

        {!showProfilePage && <>
        {/* Detailed employee search and filters */}
        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search &amp; Filter Employees</h2>
              <p className="text-sm text-gray-500">Search names, identifiers, contact details, manager, or location, then narrow by employment details below.</p>
            </div>
            <Badge variant="info">{filteredEmployees.length} match{filteredEmployees.length === 1 ? '' : 'es'}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                aria-label="Search employees"
                type="search"
                placeholder="Name, ID, code, email, mobile, manager, or campus"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setSelectedId(''); }}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              label="Department"
              options={[{ value: '', label: 'All Departments' }, ...departments.map((department) => ({ value: department, label: department }))]}
              value={filters.department}
              onChange={(event) => { setFilters((current) => ({ ...current, department: event.target.value })); setSelectedId(''); }}
            />
            <Select
              label="Employment Status"
              options={[{ value: '', label: 'All Statuses' }, ...statuses.map((status) => ({ value: status, label: status }))]}
              value={filters.status}
              onChange={(event) => { setFilters((current) => ({ ...current, status: event.target.value })); setSelectedId(''); }}
            />
            <Select
              label="Staff Type"
              options={[{ value: '', label: 'All Staff Types' }, ...staffTypes.map((type) => ({ value: type, label: type }))]}
              value={filters.staffType}
              onChange={(event) => { setFilters((current) => ({ ...current, staffType: event.target.value })); setSelectedId(''); }}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="employee-designation-filter">Designation</label>
              <input
                id="employee-designation-filter"
                type="text"
                placeholder="Filter by designation"
                value={filters.designation}
                onChange={(event) => { setFilters((current) => ({ ...current, designation: event.target.value })); setSelectedId(''); }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              label="Employment Type"
              options={[{ value: '', label: 'All Employment Types' }, ...employmentTypes.map((type) => ({ value: type, label: type }))]}
              value={filters.employmentType}
              onChange={(event) => { setFilters((current) => ({ ...current, employmentType: event.target.value })); setSelectedId(''); }}
            />
            <Select
              label="Branch / Campus"
              options={[{ value: '', label: 'All Branches / Campuses' }, ...branches.map((branch) => ({ value: branch, label: branch }))]}
              value={filters.branch}
              onChange={(event) => { setFilters((current) => ({ ...current, branch: event.target.value })); setSelectedId(''); }}
            />
            <Select
              label="Gender"
              options={[{ value: '', label: 'All Genders' }, ...genders.map((gender) => ({ value: gender, label: gender }))]}
              value={filters.gender}
              onChange={(event) => { setFilters((current) => ({ ...current, gender: event.target.value })); setSelectedId(''); }}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="employee-joining-from">Joining Date From</label>
              <input id="employee-joining-from" type="date" value={filters.joiningFrom} onChange={(event) => { setFilters((current) => ({ ...current, joiningFrom: event.target.value })); setSelectedId(''); }} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="employee-joining-to">Joining Date To</label>
              <input id="employee-joining-to" type="date" value={filters.joiningTo} onChange={(event) => { setFilters((current) => ({ ...current, joiningTo: event.target.value })); setSelectedId(''); }} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => { setSearch(''); clearFilters(); setSelectedId(''); }}>
              Clear search &amp; filters
            </Button>
          </div>
        </Card>

        {/* Directory table appears directly below the detailed filters */}
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-1 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Employee Directory</h2>
              <p className="text-xs text-gray-500">Select an employee to open their profile in a separate view.</p>
            </div>
            <span className="text-sm text-gray-500">{filteredEmployees.length} employee{filteredEmployees.length === 1 ? '' : 's'}</span>
          </div>
          {filteredEmployees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Employee ID / Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Designation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Branch / Campus</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Staff Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredEmployees.map((candidate) => (
                    <tr key={candidate.id} className={`transition-colors ${selectedId === candidate.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{candidate.avatar}</span>
                          <span><span className="block text-sm font-semibold text-gray-900">{candidate.fullName}</span><span className="text-xs text-gray-500">{candidate.contact.officialEmail}</span></span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="block text-sm font-medium text-gray-900">{candidate.id}</span><span className="text-xs text-gray-500">{candidate.code}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{candidate.designation}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{candidate.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{candidate.employment.campus} · {candidate.employment.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{candidate.staffType}</td>
                      <td className="px-4 py-3">{getStatusBadge(candidate.status)}</td>
                      <td className="px-4 py-3 text-right"><Button variant={selectedId === candidate.id ? 'primary' : 'outline'} size="sm" onClick={() => selectEmployee(candidate.id)}>{selectedId === candidate.id ? 'Selected' : 'View Profile'}</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-gray-500">No employees match these search filters.</div>
          )}
        </Card>

        </>}
        {showProfilePage && employee && (
        <>
            {/* Header Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="relative">
                  <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                    <span className="text-4xl font-bold">
                      {employee.avatar}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 bg-green-500 rounded-full border-2 border-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{employee.fullName}</h2>
                    {getStatusBadge(employee.status)}
                    {disabledEmployeeIds.includes(employee.id) && <Badge variant="danger">Disabled</Badge>}
                    <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30">

                      {employee.staffType}
                    </Badge>
                  </div>
                  <p className="text-lg text-blue-100">
                    {employee.designation}
                  </p>
                  <p className="text-sm text-blue-200">
                    {employee.department} Department
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-blue-100">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {employee.code}
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {employee.contact.officialEmail}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {employee.contact.mobile}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {employee.employment.location}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                {
                  icon: Calendar,
                  label: 'Joined',
                  value: employee.dateOfJoining
                },
                {
                  icon: Clock,
                  label: 'Tenure',
                  value: `${employee.yearsOfService} Years`
                },
                {
                  icon: Star,
                  label: 'Rating',
                  value: `${employee.performance.currentRating}/5`,
                  iconClass: 'text-yellow-300'
                },
                {
                  icon: Users,
                  label: 'Reports To',
                  value: employee.reportingManager.split('(')[0]
                }].
                map((s, i) =>
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">

                      <s.icon
                    className={`w-5 h-5 mx-auto mb-2 ${s.iconClass || 'text-blue-200'}`} />

                      <p className="text-xs text-blue-200">{s.label}</p>
                      <p className="text-sm font-semibold truncate">
                        {s.value}
                      </p>
                    </div>
                )}
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <div className="flex overflow-x-auto">
                {mainTabs.map((t) =>
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setActiveSubTab(subTabs[t.id]?.[0]?.id || 'personal');
                }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>

                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
              )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Overview */}
              {activeTab === 'overview' &&
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Today's Schedule */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Today's Schedule
                          </h3>
                          <InfoIconBtn onClick={() => openModal('schedule')} />
                        </div>
                        <Badge variant="info">
                          {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                        </Badge>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {employee.schedule.today.map((item, i) =>
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-3 rounded-lg border ${item.status === 'ongoing' ? 'bg-blue-50 border-blue-200' : item.status === 'completed' ? 'bg-gray-50 border-gray-200 opacity-60' : item.status === 'break' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>

                            <div className="w-20 text-sm font-medium text-gray-600">
                              {item.time.split(' - ')[0]}
                            </div>
                            <div
                        className={`w-2 h-2 rounded-full ${item.status === 'ongoing' ? 'bg-blue-500 animate-pulse' : item.status === 'completed' ? 'bg-green-500' : item.status === 'break' ? 'bg-amber-500' : 'bg-gray-300'}`} />

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.subject}
                              </p>
                              {item.class !== '-' &&
                        <p className="text-xs text-gray-500">
                                  {item.class} • {item.room}
                                </p>
                        }
                            </div>
                            {item.status === 'ongoing' &&
                      <Badge variant="info" className="text-xs">
                                Now
                              </Badge>
                      }
                          </div>
                    )}
                      </div>
                    </Card>

                    {/* Performance Overview */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Performance Overview
                          </h3>
                          <InfoIconBtn
                        onClick={() => openModal('performance')} />

                        </div>
                        <RatingStars
                      rating={employee.performance.currentRating} />

                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                    {
                      v: employee.performance.overallScore,
                      l: 'Score',
                      c: 'blue'
                    },
                    {
                      v: employee.performance.rank,
                      l: 'Rank',
                      c: 'green'
                    },
                    {
                      v: `${employee.performance.percentile}%`,
                      l: 'Percentile',
                      c: 'purple'
                    },
                    {
                      v: employee.performance.cpdCourses.reduce(
                        (s, c) => s + c.hours,
                        0
                      ),
                      l: 'CPD Hours',
                      c: 'amber'
                    }].
                    map((m, i) =>
                    <div
                      key={i}
                      className={`text-center p-4 bg-${m.c}-50 rounded-xl`}>

                            <p className={`text-2xl font-bold text-${m.c}-600`}>
                              {m.v}
                            </p>
                            <p className="text-xs text-gray-600">{m.l}</p>
                          </div>
                    )}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        KRA Progress
                      </h4>
                      <div className="space-y-3">
                        {employee.performance.kras.slice(0, 3).map((k, i) =>
                    <div key={i}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-700 truncate pr-4">
                                {k.title}
                              </span>
                              <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getKRAColor(k.status)}`}>

                                {k.status.replace('-', ' ')}
                              </span>
                            </div>
                            <ProgressBar
                        value={k.achieved}
                        max={k.target}
                        color={
                        k.status === 'achieved' ?
                        'green' :
                        k.status === 'at-risk' ?
                        'orange' :
                        'blue'
                        } />

                          </div>
                    )}
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Attendance */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Attendance
                          </h3>
                          <InfoIconBtn
                        onClick={() => openModal('attendance')} />

                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 border-4 border-green-200">
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              {Math.round(
                            employee.attendance.summary.present /
                            employee.attendance.summary.
                            totalWorkingDays *
                            100
                          )}
                              %
                            </p>
                            <p className="text-xs text-gray-500">Present</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        {[
                    {
                      v: employee.attendance.summary.present,
                      l: 'Present',
                      c: 'gray'
                    },
                    {
                      v: employee.attendance.summary.absent,
                      l: 'Absent',
                      c: 'red'
                    },
                    {
                      v: employee.attendance.summary.lateComings,
                      l: 'Late',
                      c: 'amber'
                    },
                    {
                      v: employee.attendance.summary.onLeave,
                      l: 'On Leave',
                      c: 'blue'
                    }].
                    map((s, i) =>
                    <div
                      key={i}
                      className={`p-2 bg-${s.c}-50 rounded-lg`}>

                            <p className={`text-lg font-bold text-${s.c}-600`}>
                              {s.v}
                            </p>
                            <p className="text-xs text-gray-500">{s.l}</p>
                          </div>
                    )}
                      </div>
                    </Card>

                    {/* Leave Balance */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Leave Balance
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {employee.leaveBalance.slice(0, 4).map((l, i) =>
                    <div
                      key={i}
                      className="flex items-center justify-between">

                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                                {l.code}
                              </span>
                              <span className="text-sm text-gray-700">
                                {l.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                          className={`text-lg font-bold ${l.balance > 5 ? 'text-green-600' : l.balance > 2 ? 'text-amber-600' : 'text-red-600'}`}>

                                {l.balance}
                              </span>
                              <span className="text-xs text-gray-400">
                                / {l.entitled}
                              </span>
                            </div>
                          </div>
                    )}
                      </div>
                    </Card>

                    {/* Achievements */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Achievements
                      </h3>
                      <div className="space-y-3">
                        {employee.engagement.achievements.
                    slice(0, 3).
                    map((a, i) =>
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">

                              <div className="p-2 bg-amber-100 rounded-lg">
                                <Trophy className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {a.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {a.date}
                                </p>
                              </div>
                            </div>
                    )}
                      </div>
                    </Card>
                  </div>
                </div>
            }

              {/* Essentials Tab */}
              {activeTab === 'essentials' &&
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    {renderSubNav(subTabs.essentials)}
                  </div>
                  <div className="lg:col-span-3">
                    {activeSubTab === 'personal' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Bio-Data
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('personal')} />

                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <div className="w-6 h-0.5 bg-blue-500 rounded" />
                              Basic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                        {
                          l: 'Full Name',
                          v: employee.fullName
                        },
                        {
                          l: 'Title',
                          v: '—'
                        },
                        {
                          l: 'First Name',
                          v: employee.firstName
                        },
                        {
                          l: 'Last Name',
                          v: employee.lastName
                        },
                        {
                          l: 'Employee Code',
                          v: employee.code,
                          h: true
                        },
                        {
                          l: 'Date of Birth',
                          v: employee.personal.dateOfBirth
                        },
                        {
                          l: 'Age',
                          v: `${employee.personal.age} years`
                        },
                        {
                          l: 'Gender',
                          v: employee.personal.gender
                        },
                        {
                          l: 'Blood Group',
                          v: employee.personal.bloodGroup
                        },
                        {
                          l: 'Marital Status',
                          v: employee.personal.maritalStatus
                        },
                        {
                          l: 'Nationality',
                          v: employee.personal.nationality
                        },
                        {
                          l: 'Religion',
                          v: employee.personal.religion
                        },
                        {
                          l: 'Category',
                          v: employee.personal.category
                        },
                        {
                          l: 'Caste',
                          v: employee.personal.caste
                        },
                        {
                          l: 'Spouse',
                          v: employee.personal.spouseName || '—'
                        },
                        {
                          l: 'Father',
                          v: employee.personal.fatherName
                        },
                        {
                          l: 'Mother',
                          v: employee.personal.motherName
                        },
                        {
                          l: 'Dependents',
                          v: String(employee.personal.numberOfDependents)
                        },
                        {
                          l: 'Anniversary Date',
                          v: '—'
                        },
                        {
                          l: 'Height / Weight',
                          v: '—'
                        },
                        {
                          l: 'Mother Tongue',
                          v: '—'
                        },
                        {
                          l: 'Identification Marks',
                          v: '—'
                        },
                        {
                          l: 'Known Languages',
                          v: employee.skills.languages.map((language) => language.name).join(', ') || '—'
                        },
                        {
                          l: 'Medical Conditions',
                          v: employee.health.medicalConditions.join(', ') || '—'
                        }].
                        map((f, i) =>
                        <InfoBlock
                          key={i}
                          label={f.l}
                          value={f.v}
                          highlight={f.h} />

                        )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <div className="w-6 h-0.5 bg-blue-500 rounded" />
                              Identity Documents
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <InfoBlock
                          label="Aadhaar"
                          value={employee.personal.aadhaar}
                          icon={<Fingerprint className="w-3 h-3" />} />

                              <InfoBlock
                          label="PAN"
                          value={employee.personal.pan}
                          icon={<CreditCard className="w-3 h-3" />} />

                              <InfoBlock
                          label="Passport"
                          value={employee.personal.passport}
                          icon={<Globe className="w-3 h-3" />} />
                              <InfoBlock label="Passport Expiry" value="—" />

                              <InfoBlock
                          label="Driving License"
                          value={employee.personal.drivingLicense}
                          icon={<Car className="w-3 h-3" />} />

                              <InfoBlock
                          label="Voter ID"
                          value={employee.personal.voterId}
                          icon={<FileText className="w-3 h-3" />} />

                            </div>
                          </div>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'contact' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Contact Info
                            </h3>
                            <InfoIconBtn onClick={() => openModal('contact')} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <InfoBlock
                      label="Mobile"
                      value={employee.contact.mobile}
                      icon={<Phone className="w-3 h-3" />} />

                          <InfoBlock
                      label="Official Email"
                      value={employee.contact.officialEmail}
                      icon={<Mail className="w-3 h-3" />}
                      highlight />
                          <InfoBlock label="Alternate Mobile" value={employee.contact.alternateMobile} icon={<Phone className="w-3 h-3" />} />
                          <InfoBlock label="Personal Email" value={employee.contact.personalEmail} icon={<Mail className="w-3 h-3" />} />
                          <InfoBlock label="WhatsApp Number" value="—" icon={<Phone className="w-3 h-3" />} />
                          <InfoBlock label="LinkedIn Profile" value="—" icon={<Globe className="w-3 h-3" />} />

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {[
                    {
                      t: 'Permanent',
                      a: employee.contact.permanentAddress,
                      c: 'blue'
                    },
                    {
                      t: 'Current',
                      a: employee.contact.currentAddress,
                      c: 'green'
                    }].
                    map((addr, i) =>
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                              <div className="flex items-center gap-2 mb-3">
                                <MapPin
                          className={`w-4 h-4 text-${addr.c}-600`} />

                                <span className="text-sm font-semibold text-gray-700">
                                  {addr.t} Address
                                </span>
                              </div>
                              <p className="text-sm text-gray-900">
                                {addr.a.line1}, {addr.a.line2}
                              </p>
                              <p className="text-sm text-gray-600">
                                {addr.a.city}, {addr.a.state} - {addr.a.pincode}, {addr.a.country}
                              </p>
                            </div>
                    )}
                        </div>
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <InfoBlock label="Same as Permanent Address" value={employee.contact.sameAsPermanent ? 'Yes' : 'No'} />
                          <InfoBlock label="District / Landmark" value="—" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-red-500 rounded" />
                          Emergency Contacts
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {employee.contact.emergencyContacts.map((c, i) =>
                    <div
                      key={i}
                      className="bg-red-50 rounded-xl p-4 border border-red-100">

                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-100 rounded-lg">
                                  <Heart className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {c.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {c.relationship}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {c.phone}
                              </p>
                              <p className="mt-1 text-xs text-gray-600 flex items-start gap-2"><MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />{c.address || '—'}</p>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'statutory' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Statutory Info
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('statutory')} />

                          </div>
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Compliant
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Provident Fund
                            </h4>
                            <div className="space-y-3">
                              {[
                        {
                          l: 'PF Number',
                          v: employee.statutory.pfNumber
                        },
                        {
                          l: 'UAN Number',
                          v: employee.statutory.uanNumber
                        },
                        {
                          l: 'Gratuity Nomination',
                          v: employee.statutory.gratuityNomination
                        }].
                        map((f, i) =>
                        <div key={i}>
                                  <p className="text-xs text-blue-700 uppercase">
                                    {f.l}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {f.v}
                                  </p>
                                </div>
                        )}
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                            <h4 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              ESI & Tax
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-purple-700 uppercase">
                                  ESI Number
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {employee.statutory.esiNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-700 uppercase">
                                  Tax Regime
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {employee.statutory.taxRegime}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-700 uppercase">
                                  Form 16
                                </p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                  {employee.statutory.form16Available ?
                            <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Available
                                    </> :

                            'Not Available'
                            }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'documents' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Documents Vault
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('documents')} />

                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="success">
                              {
                        employeeDocuments.filter(
                          (d) => d.status === 'Verified'
                        ).length
                        }{' '}
                              Verified
                            </Badge>
                            <Badge variant="warning">
                              {
                        employeeDocuments.filter(
                          (d) => d.status === 'Pending'
                        ).length
                        }{' '}
                              Pending
                            </Badge>
                          </div>
                        </div>
                        {documentNotice &&
                          <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                            <span>{documentNotice}</span>
                            <button type="button" onClick={() => setDocumentNotice(null)} className="opacity-70 hover:opacity-100">
                              <X className="w-4 h-4" />
                            </button>
                          </div>}
                        <div className="space-y-3">
                          {employeeDocuments.map((d) =>
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">

                              <div className="flex items-center gap-4">
                                <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${d.status === 'Verified' ? 'bg-green-100' : d.status === 'Pending' ? 'bg-amber-100' : 'bg-red-100'}`}>

                                  <FileText
                            className={`w-6 h-6 ${d.status === 'Verified' ? 'text-green-600' : d.status === 'Pending' ? 'text-amber-600' : 'text-red-600'}`} />

                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    {d.name}
                                    {d.mandatory &&
                            <span className="text-red-500">*</span>
                            }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {d.type} • {d.fileType} • {d.fileSize}
                                  </p>
                                  <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-gray-500 sm:grid-cols-2">
                                    <span>Category: {d.category || '—'}</span><span>Uploaded: {d.uploadDate || '—'}</span>
                                    <span>Expiry: {d.expiryDate || '—'}</span><span>Mandatory: {d.mandatory ? 'Yes' : 'No'}</span>
                                    <span>Verified by: {d.verifiedBy || '—'}</span><span>Verified date: {d.verifiedDate || '—'}</span>
                                  </div>
                                  {d.remarks && <p className="mt-2 text-xs text-gray-600">Remarks: {d.remarks}</p>}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getDocBadge(d.status)}
                                <Button variant="outline" size="sm" onClick={() => openDocumentReview(d.id)} title="View and verify document">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" disabled title="Download needs document storage, which is not connected in this prototype">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'bank' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Bank & Salary
                            </h3>
                            <InfoIconBtn onClick={() => openModal('bank')} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Restricted
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Bank Account
                            </h4>
                            <div className="space-y-3">
                              {[
                        {
                          l: 'Bank',
                          v: employee.bank.bankName
                        },
                        {
                          l: 'Branch',
                          v: employee.bank.branchName
                        },
                        {
                          l: 'Account',
                          v: employee.bank.accountNumber
                        },
                        {
                          l: 'IFSC',
                          v: employee.bank.ifsc
                        },
                        {
                          l: 'Account Type',
                          v: employee.bank.accountType
                        },
                        {
                          l: 'MICR Code',
                          v: employee.bank.micrCode
                        },
                        {
                          l: 'Payment Mode',
                          v: employee.bank.paymentMode
                        },
                        {
                          l: 'Secondary Bank Account',
                          v: '—'
                        }].
                        map((f, i) =>
                        <div key={i}>
                                  <p className="text-xs text-blue-700 uppercase">
                                    {f.l}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {f.v}
                                  </p>
                                </div>
                        )}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                            <h4 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                              <Banknote className="w-4 h-4" />
                              Salary
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-green-700 uppercase">
                                  Grade
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {employee.bank.salaryGrade}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-green-700 uppercase">
                                  CTC
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {employee.bank.ctc}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-green-700 uppercase">
                                  Basic Pay
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {employee.bank.basicPay}
                                </p>
                              </div>
                              {[
                                { label: 'DA', value: '—' },
                                { label: 'HRA', value: '—' },
                                { label: 'Conveyance', value: '—' },
                                { label: 'Medical Allowance', value: '—' },
                                { label: 'Special / Other Allowances', value: '—' },
                                { label: 'Gross Salary', value: '—' },
                                { label: 'PF Deduction', value: '—' },
                                { label: 'Professional Tax', value: '—' },
                                { label: 'Net Salary', value: '—' },
                                { label: 'TDS Applicable', value: '—' },
                                { label: 'Loan / EMI / Outstanding', value: '—' },
                                { label: 'Loan Start Date', value: '—' },
                              ].map((field) => <div key={field.label}><p className="text-xs text-green-700 uppercase">{field.label}</p><p className="text-sm font-medium text-gray-900">{field.value}</p></div>)}
                            </div>
                          </div>
                        </div>
                      </Card>
                }
                    {activeSubTab === 'employment' && (
                      <div className="space-y-6">
                        <Card className="p-6">
                          <div className="mb-5 flex items-center gap-2"><Briefcase className="h-5 w-5 text-blue-600" /><div><h3 className="text-lg font-semibold text-gray-900">Employment Information</h3><p className="text-sm text-gray-500">Appointment, assignment, reporting, and employee identifiers.</p></div></div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {[
                              { label: 'Employee ID', value: employee.id },
                              { label: 'Employee Code', value: employee.code },
                              { label: 'Payroll ID', value: employee.payrollId },
                              { label: 'Biometric ID', value: employee.biometricId },
                              { label: 'Employee Category', value: employee.employeeCategory },
                              { label: 'Staff Type', value: employee.employment.staffType },
                              { label: 'Employment Type', value: employee.employment.employmentType },
                              { label: 'Employment Status', value: employee.status },
                              { label: 'Department', value: employee.employment.department },
                              { label: 'Designation', value: employee.employment.designation },
                              { label: 'Date of Joining', value: employee.employment.dateOfJoining },
                              { label: 'Probation Period', value: employee.employment.probationPeriod },
                              { label: 'Probation End Date', value: '—' },
                              { label: 'Confirmation Date', value: employee.employment.confirmationDate || employee.confirmationDate || '—' },
                              { label: 'Contract End Date', value: '—' },
                              { label: 'Notice Period', value: employee.employment.noticePeriod },
                              { label: 'Retirement Date', value: employee.retirementDate || '—' },
                              { label: 'Previous Employee Code', value: '—' },
                              { label: 'Previous Joining Date', value: '—' },
                              { label: 'Previous Exit Date', value: '—' },
                              { label: 'Reason for Previous Exit', value: '—' }, 
                              { label: 'Reporting Manager', value: employee.employment.reportingManager },
                              { label: 'Reporting Manager ID', value: employee.employment.reportingManagerId },
                              { label: 'Secondary Manager', value: '—' },
                            ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                          </div>
                        </Card>
                        <Card className="p-6">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">Campus, Work Schedule & Teaching Assignment</h3>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {[
                              { label: 'Campus / Branch', value: employee.employment.campus },
                              { label: 'Work Location', value: employee.employment.location },
                              { label: 'Building / Block', value: employee.employment.building },
                              { label: 'Floor', value: employee.employment.floor },
                              { label: 'Office / Desk', value: employee.employment.desk },
                              { label: 'Grade', value: employee.employment.grade },
                              { label: 'Level', value: employee.employment.level },
                              { label: 'Default Shift', value: employee.employment.shift },
                              { label: 'Extension Number', value: '—' },
                              { label: 'Primary Subject', value: employee.skills.teaching[0] || '—' },
                              { label: 'Secondary Subjects', value: employee.skills.teaching.slice(1).join(', ') || '—' },
                              { label: 'Weekly Teaching Hours', value: `${employee.schedule.weeklyLoad.reduce((total, day) => total + day.teachingHours, 0)} hours` },
                              { label: 'Max Periods / Day', value: '—' },
                              { label: 'Class Teacher Of', value: '—' },
                              { label: 'Previous Internal Employment', value: '—' },
                            ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                          </div>
                          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Working Days</p><div className="flex flex-wrap gap-2">{employee.employment.workingDays.map((day) => <Badge key={day} variant="info">{day}</Badge>)}</div></div>
                            <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Weekly Off</p><div className="flex flex-wrap gap-2">{employee.employment.weeklyOff.map((day) => <Badge key={day} variant="secondary">{day}</Badge>)}</div></div>
                          </div>
                          <div className="mt-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Classes Handling</p><div className="flex flex-wrap gap-2">{employee.schedule.classMapping.length ? employee.schedule.classMapping.map((item, index) => <Badge key={`${item.class}-${item.section}-${index}`} variant="success">{item.class}-{item.section} · {item.subject}</Badge>) : <span className="text-sm text-gray-500">—</span>}</div></div>
                        </Card>
                      </div>
                    )}

                    {activeSubTab === 'family' && (
                      <div className="space-y-6">
                        <Card className="p-6">
                          <div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="text-lg font-semibold text-gray-900">Family Members</h3><p className="text-sm text-gray-500">Family and dependent information represented in the employee record.</p></div><Badge variant="info">{employee.personal.numberOfDependents} dependent{employee.personal.numberOfDependents === 1 ? '' : 's'}</Badge></div>
                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                            {[
                              { name: employee.personal.spouseName || '—', relationship: 'Spouse', phone: employee.contact.emergencyContacts.find((contact) => contact.relationship.toLowerCase().includes('spouse'))?.phone || '—' },
                              { name: employee.personal.fatherName || '—', relationship: 'Father', phone: employee.contact.emergencyContacts.find((contact) => contact.relationship.toLowerCase().includes('father'))?.phone || '—' },
                              { name: employee.personal.motherName || '—', relationship: 'Mother', phone: employee.contact.emergencyContacts.find((contact) => contact.relationship.toLowerCase().includes('mother'))?.phone || '—' },
                            ].map((member) => (
                              <div key={member.relationship} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <h4 className="mb-3 font-semibold text-gray-900">{member.relationship}</h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <InfoBlock label="Name" value={member.name} />
                                  <InfoBlock label="Relationship" value={member.relationship} />
                                  <InfoBlock label="Date of Birth" value="—" />
                                  <InfoBlock label="Occupation" value="—" />
                                  <InfoBlock label="Phone" value={member.phone} />
                                  <InfoBlock label="Aadhaar" value="—" />
                                  <InfoBlock label="Dependent" value="Not recorded" />
                                  <InfoBlock label="Nominee" value="Not recorded" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                        <Card className="p-6">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">Nomination Details</h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {[
                              { title: 'Provident Fund Nominee', name: '—', relationship: '—', share: '—', dateOfBirth: '—', address: '—', phone: '—' },
                              { title: 'Gratuity Nominee', name: employee.statutory.gratuityNomination || '—', relationship: 'See nomination record', share: '—', dateOfBirth: '—', address: '—', phone: '—' },
                              { title: 'Insurance Nominee', name: '—', relationship: '—', share: '—', dateOfBirth: '—', address: '—', phone: '—' },
                            ].map((nominee) => (
                              <div key={nominee.title} className="rounded-xl border border-gray-200 p-4">
                                <h4 className="mb-3 font-semibold text-gray-900">{nominee.title}</h4>
                                <div className="space-y-3">
                                  <InfoBlock label="Nominee Name" value={nominee.name} />
                                  <InfoBlock label="Relationship" value={nominee.relationship} />
                                  <InfoBlock label="Date of Birth / Share %" value={`${nominee.dateOfBirth} / ${nominee.share}`} />
                                  <InfoBlock label="Address / Phone" value={`${nominee.address} / ${nominee.phone}`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    )}

                    {activeSubTab === 'account' && (
                      <Card className="p-6">
                        <div className="mb-5 flex items-center gap-2"><Settings className="h-5 w-5 text-blue-600" /><div><h3 className="text-lg font-semibold text-gray-900">Account Details & Security</h3><p className="text-sm text-gray-500">Credentials are not displayed; unavailable account settings are shown as not configured.</p></div></div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {[
                            { label: 'Username', value: employee.contact.officialEmail },
                            { label: 'Temporary Password', value: 'Not displayed for security' },
                            { label: 'Last Login', value: employee.systemInfo.lastLogin || '—' },
                            { label: 'Password Last Changed', value: '—' },
                            { label: 'Account Status', value: employee.status === 'Active' ? 'Active' : employee.status },
                            { label: 'MFA Enabled', value: 'Not configured' },
                            { label: 'MFA Method', value: '—' },
                            { label: 'Recovery Email', value: '—' },
                            { label: 'Session Timeout', value: '—' },
                            { label: 'IP Restriction', value: '—' },
                            { label: 'Allowed IPs', value: '—' },
                            { label: 'Device Limit', value: '—' },
                            { label: 'API Access', value: '—' },
                            { label: 'API Key', value: 'Managed securely' },
                          ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                        </div>
                        <div className="mt-6 border-t border-gray-100 pt-5">
                          <h4 className="mb-3 text-sm font-semibold text-gray-800">Notification Preferences</h4>
                          <p className="text-sm text-gray-500">Email, SMS, push, WhatsApp, leave, salary, announcement, and task-reminder preferences are not present in the available employee record.</p>
                        </div>
                      </Card>
                    )}

                    {activeSubTab === 'system' && (
                      <div className="space-y-6">
                        <Card className="p-6">
                          <div className="mb-5 flex items-center gap-2"><Shield className="h-5 w-5 text-indigo-600" /><div><h3 className="text-lg font-semibold text-gray-900">Role, Permissions & Data Access</h3><p className="text-sm text-gray-500">Configured access available on this employee record.</p></div></div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {[
                              { label: 'Primary Role / Access Level', value: employee.systemInfo.accessLevel },
                              { label: 'Secondary Role', value: '—' },
                              { label: 'Custom Role', value: '—' },
                              { label: 'Branch Access', value: employee.employment.campus || employee.employment.location },
                              { label: 'Department Access', value: employee.department },
                              { label: 'Class Access', value: employee.schedule.classMapping.map((item) => `${item.class}-${item.section}`).join(', ') || '—' },
                              { label: 'Access Type', value: '—' },
                              { label: 'Access Start / End Time', value: '—' },
                              { label: 'Access Days', value: '—' },
                            ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                          </div>
                          <div className="mt-6">
                            <h4 className="mb-3 text-sm font-semibold text-gray-800">Module & Action Permissions</h4>
                            {employee.systemInfo.permissions.length ? <div className="flex flex-wrap gap-2">{employee.systemInfo.permissions.map((permission, index) => <Badge key={`${permission}-${index}`} variant="info">{permission}</Badge>)}</div> : <p className="text-sm text-gray-500">No permissions recorded.</p>}
                          </div>
                        </Card>
                        <Card className="p-6">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">System Audit & Login History</h3>
                          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: 'Created At', value: employee.systemInfo.createdAt },
                              { label: 'Created By', value: employee.systemInfo.createdBy },
                              { label: 'Last Modified', value: employee.systemInfo.lastModified },
                              { label: 'Modified By', value: employee.systemInfo.modifiedBy },
                            ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                          </div>
                          {employee.systemInfo.loginHistory.length ? <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left font-semibold text-gray-600">Date</th><th className="px-3 py-2 text-left font-semibold text-gray-600">IP</th><th className="px-3 py-2 text-left font-semibold text-gray-600">Device</th></tr></thead><tbody className="divide-y divide-gray-100">{employee.systemInfo.loginHistory.map((login, index) => <tr key={`${login.date}-${index}`}><td className="px-3 py-2">{login.date}</td><td className="px-3 py-2">{login.ip}</td><td className="px-3 py-2">{login.device}</td></tr>)}</tbody></table></div> : <p className="text-sm text-gray-500">No login history recorded.</p>}
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
            }

              {/* Professional Tab */}
              {activeTab === 'professional' &&
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    {renderSubNav(subTabs.professional)}
                  </div>
                  <div className="lg:col-span-3">
                    {activeSubTab === 'qualification' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Academic & Professional Qualifications
                            </h3>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-xl">
                              <GraduationCap className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm text-indigo-600 font-medium">
                                Highest Qualification
                              </p>
                              <p className="text-xl font-bold text-gray-900">
                                {employee.qualification.highest}
                              </p>
                              <p className="text-sm text-gray-600">
                                {employee.qualification.university} •{' '}
                                {employee.qualification.yearOfPassing}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Academic Qualifications</h4>
                          <div className="space-y-4">
                            {employee.qualification.education.length > 0 ? employee.qualification.education.map((education, index) =>
                    <div key={`${education.degree}-${index}`} className="relative border-l-2 border-gray-200 pb-5 pl-8 last:border-l-0 last:pb-0">
                                <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow" />
                                <div className="ml-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                                    <div><h5 className="text-sm font-semibold text-gray-900">{education.degree}</h5><p className="text-sm text-gray-600">{education.institution}</p></div>
                                    <Badge variant="secondary">{education.yearOfPassing}</Badge>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    <div><p className="text-xs text-gray-500">Board / University</p><p className="text-sm font-medium text-gray-800">{education.board || '—'}</p></div>
                                    <div><p className="text-xs text-gray-500">School / College</p><p className="text-sm font-medium text-gray-800">{education.institution || '—'}</p></div>
                                    <div><p className="text-xs text-gray-500">Year of Passing</p><p className="text-sm font-medium text-gray-800">{education.yearOfPassing || '—'}</p></div>
                                    <div><p className="text-xs text-gray-500">Percentage / CGPA</p><p className="text-sm font-medium text-green-700">{education.percentage || '—'}</p></div>
                                    <div><p className="text-xs text-gray-500">Subjects / Stream</p><p className="text-sm font-medium text-gray-800">{education.specialization || '—'}</p></div>
                                    <div><p className="text-xs text-gray-500">Grade / Result</p><p className="text-sm font-medium text-gray-800">{education.grade || '—'}</p></div>
                                  </div>
                                </div>
                              </div>
                    ) : <p className="rounded-lg border border-dashed border-gray-300 p-5 text-sm text-gray-500">No academic qualifications recorded.</p>}
                          </div>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-6">
                          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">Professional Qualifications</h4>
                          {employee.qualification.professionalQualifications?.length ?
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              {employee.qualification.professionalQualifications.map((qualification, index) =>
                      <div key={`${qualification.degree}-${index}`} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                                  <h5 className="font-semibold text-gray-900">{qualification.degree}</h5>
                                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                    <div><p className="text-xs text-gray-500">Institution</p><p className="font-medium text-gray-800">{qualification.institution}</p></div>
                                    <div><p className="text-xs text-gray-500">Year</p><p className="font-medium text-gray-800">{qualification.year}</p></div>
                                    <div><p className="text-xs text-gray-500">Grade / Score</p><p className="font-medium text-gray-800">{qualification.grade}</p></div>
                                    <div><p className="text-xs text-gray-500">Specialization</p><p className="font-medium text-gray-800">{qualification.specialization}</p></div>
                                  </div>
                                  <p className="mt-3 text-xs text-gray-500">Registration Number: <span className="font-medium text-gray-700">{qualification.registrationNumber || '—'}</span></p>
                                </div>
                      )}
                            </div> :
                    <p className="rounded-lg border border-dashed border-gray-300 p-5 text-sm text-gray-500">No professional qualifications recorded.</p>
                    }
                        </div>
                      </Card>
                }

                    {activeSubTab === 'experience' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Experience
                            </h3>
                          </div>
                          <p className="text-lg font-bold text-blue-600">
                            {employee.qualification.experience.reduce(
                        (s, e) => s + parseInt(e.duration) || 0,
                        0
                      )}{' '}
                            Years Total
                          </p>
                        </div>
                        <div className="space-y-4">
                          {employee.qualification.experience.map((e, i) =>
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200">

                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-blue-100 rounded-xl">
                                    <Building className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                      {e.designation}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {e.organization}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {e.from} to {e.to} • {e.duration}
                                    </p>
                                  </div>
                                </div>
                                {e.verified &&
                        <Badge variant="success">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                        }
                              </div>
                              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-3">
                                <div><p className="text-xs text-gray-500">Location</p><p className="text-sm font-medium text-gray-800">{e.location || '—'}</p></div>
                                <div><p className="text-xs text-gray-500">Last Salary</p><p className="text-sm font-medium text-gray-800">{e.lastSalary || '—'}</p></div>
                                <div><p className="text-xs text-gray-500">Reason for Leaving</p><p className="text-sm font-medium text-gray-800">{e.reasonForLeaving || '—'}</p></div>
                              </div>
                              <p className="mt-4 text-sm text-gray-700"><span className="font-semibold">Key Responsibilities:</span> {e.responsibilities || '—'}</p>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'skills' &&
                <Card className="p-6">
                        <div className="mb-6 flex items-center gap-2">
                          <Layers className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">Skills &amp; Expertise</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-900"><Languages className="h-4 w-4" />Languages Known</h4>
                            <div className="space-y-3">{employee.skills.languages.map((language, index) =>
                    <div key={`${language.name}-${index}`} className="flex items-center justify-between"><span className="text-sm text-gray-700">{language.name}</span><Badge variant={language.proficiency === 'native' ? 'success' : 'info'} className="capitalize">{language.proficiency}</Badge></div>
                    )}</div>
                          </div>
                          <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-900"><Laptop className="h-4 w-4" />Technical Skills</h4>
                            <div className="mb-4 flex flex-wrap gap-2">{(employee.skills.technicalSkills?.length ? employee.skills.technicalSkills : employee.skills.software.map((skill) => skill.name)).map((skill, index) => <Badge key={`${skill}-${index}`} variant="primary">{skill}</Badge>)}</div>
                            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-purple-800">Software proficiency</h5>
                            <div className="space-y-3">{employee.skills.software.map((skill, index) =>
                    <div key={`${skill.name}-${index}`}>
                                <div className="mb-1 flex items-center justify-between text-sm"><span className="text-gray-700">{skill.name}</span><span className="text-xs capitalize text-purple-700">{skill.proficiency}</span></div>
                                <ProgressBar value={skill.proficiency === 'expert' ? 100 : skill.proficiency === 'advanced' ? 75 : skill.proficiency === 'intermediate' ? 50 : 25} max={100} color="purple" showPct={false} />
                              </div>
                    )}</div>
                          </div>
                          <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-900"><Star className="h-4 w-4" />Soft Skills</h4>
                            <div className="flex flex-wrap gap-2">{employee.skills.softSkills?.length ? employee.skills.softSkills.map((skill, index) => <Badge key={`${skill}-${index}`} variant="warning">{skill}</Badge>) : <p className="text-sm text-gray-500">No soft skills listed.</p>}</div>
                          </div>
                          <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-green-900"><BookOpen className="h-4 w-4" />Teaching Subjects</h4>
                            <div className="flex flex-wrap gap-2">{employee.skills.teaching.map((subject, index) => <Badge key={`${subject}-${index}`} variant="success" className="text-xs">{subject}</Badge>)}</div>
                          </div>
                          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                            <h4 className="mb-4 text-sm font-semibold text-indigo-900">Hobbies &amp; Interests</h4>
                            <div className="flex flex-wrap gap-2">{(employee.skills.hobbies?.length ? employee.skills.hobbies : employee.skills.extracurricular).map((hobby, index) => <Badge key={`${hobby}-${index}`} variant="info" className="text-xs">{hobby}</Badge>)}</div>
                          </div>
                          <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                            <h4 className="mb-4 text-sm font-semibold text-orange-900">Extracurricular</h4>
                            <div className="flex flex-wrap gap-2">{employee.skills.extracurricular.map((activity, index) => <Badge key={`${activity}-${index}`} variant="warning" className="text-xs">{activity}</Badge>)}</div>
                          </div>
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 md:col-span-2">
                            <h4 className="mb-4 text-sm font-semibold text-gray-800">Specializations</h4>
                            <div className="flex flex-wrap gap-2">{employee.skills.specializations.map((specialization, index) => <Badge key={`${specialization}-${index}`} variant="secondary">{specialization}</Badge>)}</div>
                          </div>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'certifications' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Certifications & Courses
                            </h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {employee.qualification.certifications.map((c, i) =>
                    <div
                      key={i}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">

                              <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Award className="w-5 h-5 text-blue-600" />
                                </div>
                                {c.verified &&
                        <Badge variant="success">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                        }
                              </div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                {c.name}
                              </h4>
                              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                                <div><p className="text-gray-400">Course Name / Certification</p><p className="font-medium text-gray-800">{c.name}</p></div>
                                <div><p className="text-gray-400">Provider</p><p className="font-medium text-gray-800">{c.issuingAuthority}</p></div>
                                <div><p className="text-gray-400">Completion Date</p><p className="font-medium text-gray-800">{c.issueDate}</p></div>
                                <div><p className="text-gray-400">Certificate ID</p><p className="font-medium text-gray-800">{c.credentialId}</p></div>
                                <div><p className="text-gray-400">Expiry Date</p><p className="font-medium text-gray-800">{c.expiryDate || '—'}</p></div>
                              </div>
                            </div>
                    )}
                        </div>
                      </Card>
                }
                  </div>
                </div>
            }

              {/* Operational Tab */}
              {activeTab === 'operational' &&
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    {renderSubNav(subTabs.operational)}
                  </div>
                  <div className="lg:col-span-3">
                    {activeSubTab === 'schedule' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Today's Schedule
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('schedule')} />

                          </div>
                          <Badge variant="info">
                            {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {employee.schedule.today.map((s, i) =>
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${s.status === 'ongoing' ? 'bg-blue-50 border-blue-200' : s.status === 'completed' ? 'bg-gray-50 border-gray-200 opacity-60' : s.status === 'break' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>

                              <div className="w-24 text-sm font-medium text-gray-600">
                                {s.time}
                              </div>
                              <div
                        className={`w-3 h-3 rounded-full ${s.status === 'ongoing' ? 'bg-blue-500 animate-pulse' : s.status === 'completed' ? 'bg-green-500' : s.status === 'break' ? 'bg-amber-500' : 'bg-gray-300'}`} />

                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {s.subject}
                                </p>
                                {s.class !== '-' &&
                        <p className="text-xs text-gray-500">
                                    {s.class} • {s.room}
                                  </p>
                        }
                              </div>
                              {s.status === 'ongoing' &&
                      <Badge variant="info">Live</Badge>
                      }
                              {s.status === 'completed' &&
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      }
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'classes' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Class Mapping
                            </h3>
                          </div>
                          <Badge variant="secondary">
                            {employee.schedule.classMapping.reduce(
                        (s, c) => s + c.students,
                        0
                      )}{' '}
                            Total Students
                          </Badge>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                  Class
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                  Section
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                  Subject
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                  Students
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                                  Periods/Week
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.schedule.classMapping.map((c, i) =>
                        <tr
                          key={i}
                          className="border-b border-gray-100 hover:bg-gray-50">

                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {c.class}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {c.section}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {c.subject}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center">
                                    <Badge variant="info">{c.students}</Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center font-medium">
                                    {c.periodsPerWeek}
                                  </td>
                                </tr>
                        )}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'attendance' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Attendance
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('attendance')} />

                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                          {[
                    {
                      l: 'Working Days',
                      v: employee.attendance.summary.totalWorkingDays,
                      c: 'gray'
                    },
                    {
                      l: 'Present',
                      v: employee.attendance.summary.present,
                      c: 'green'
                    },
                    {
                      l: 'Absent',
                      v: employee.attendance.summary.absent,
                      c: 'red'
                    },
                    {
                      l: 'Late',
                      v: employee.attendance.summary.lateComings,
                      c: 'amber'
                    },
                    {
                      l: 'On Leave',
                      v: employee.attendance.summary.onLeave,
                      c: 'blue'
                    }].
                    map((s, i) =>
                    <div
                      key={i}
                      className={`text-center p-4 bg-${s.c}-50 rounded-xl`}>

                              <p
                        className={`text-2xl font-bold text-${s.c}-600`}>

                                {s.v}
                              </p>
                              <p className="text-xs text-gray-600">{s.l}</p>
                            </div>
                    )}
                        </div>
                        <div className="mb-8">
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-800">Week-wise Attendance Logs</h4>
                            <span className="text-xs text-gray-500">Daily records grouped Monday–Saturday</span>
                          </div>
                          {getWeeklyAttendanceGroups(employee.attendance.recentLogs).length > 0 ?
                    <div className="space-y-4">
                              {getWeeklyAttendanceGroups(employee.attendance.recentLogs).map((week) =>
                      <section key={week.startDate.toISOString()} className="overflow-hidden rounded-xl border border-gray-200">
                                  <div className="flex items-center justify-between gap-3 bg-gray-50 px-4 py-3">
                                    <h5 className="text-sm font-semibold text-gray-800">{week.startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} – {week.endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</h5>
                                    <Badge variant="secondary">{week.logs.length} log{week.logs.length === 1 ? '' : 's'}</Badge>
                                  </div>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                      <thead className="bg-white"><tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Check-in</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Check-out</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Hours</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-500">Remarks</th>
                                      </tr></thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {week.logs.map((log, index) =>
                              <tr key={`${log.date}-${index}`}>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{new Date(`${log.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{log.inTime}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{log.outTime}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{log.totalHours}</td>
                                            <td className="px-4 py-3"><Badge variant={log.status === 'Present' ? 'success' : log.status === 'Late' ? 'warning' : log.status === 'Leave' ? 'info' : 'danger'}>{log.status}</Badge></td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{log.remarks || '—'}</td>
                                          </tr>
                              )}
                                      </tbody>
                                    </table>
                                  </div>
                                </section>
                      )}
                            </div> :
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No weekly attendance logs recorded.</div>
                    }
                        </div>

                        <div>
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-800">Monthly Attendance Log</h4>
                            <span className="text-xs text-gray-500">Present, absent, leave, and attendance rate</span>
                          </div>
                          <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50"><tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Month</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Present</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Absent</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Leave</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Attendance rate</th>
                              </tr></thead>
                              <tbody className="divide-y divide-gray-100 bg-white">
                                {employee.attendance.monthlyTrend.map((month, index) => {
                                  const scheduledDays = month.present + month.absent + month.leaves;
                                  const attendanceRate = scheduledDays ? Math.round(month.present / scheduledDays * 100) : 0;
                                  return <tr key={`${month.month}-${index}`}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                                    <td className="px-4 py-3 text-right text-sm text-green-700">{month.present}</td>
                                    <td className="px-4 py-3 text-right text-sm text-red-700">{month.absent}</td>
                                    <td className="px-4 py-3 text-right text-sm text-blue-700">{month.leaves}</td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">{attendanceRate}%</td>
                                  </tr>;
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'leave' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Leave Balance
                            </h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {employee.leaveBalance.map((l, i) =>
                    <div
                      key={i}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200">

                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                                    {l.code}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {l.type}
                                  </span>
                                </div>
                                <span
                          className={`text-xl font-bold ${l.balance > 5 ? 'text-green-600' : l.balance > 2 ? 'text-amber-600' : 'text-red-600'}`}>

                                  {l.balance}
                                </span>
                              </div>
                              <ProgressBar
                        value={l.balance}
                        max={l.entitled}
                        color={
                        l.balance > 5 ?
                        'green' :
                        l.balance > 2 ?
                        'yellow' :
                        'red'
                        } />

                              <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-gray-500">
                                <span>Taken: {l.taken}</span>
                                <span>Pending: {l.pending}</span>
                                <span>Entitled: {l.entitled}</span>
                                <span>Carry forward: {l.carryForward}</span>
                                <span>Encashable: {l.encashable}</span>
                              </div>
                            </div>
                    )}
                        </div>
                      </Card>
                }
                    {activeSubTab === 'settings' && (
                      <div className="space-y-6">
                        <Card className="p-6">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">Attendance & Overtime Settings</h3>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {[
                              { label: 'Default Shift', value: employee.employment.shift },
                              { label: 'Work Hours / Day', value: '—' },
                              { label: 'Weekly Off', value: employee.employment.weeklyOff.join(', ') || '—' },
                              { label: 'Attendance Mode', value: '—' },
                              { label: 'Check-in Time', value: '—' },
                              { label: 'Check-out Time', value: '—' },
                              { label: 'Grace Period', value: '—' },
                              { label: 'Half Day After', value: '—' },
                              { label: 'OT Eligible', value: '—' },
                              { label: 'OT Rate / Hour', value: '—' },
                              { label: 'Max OT Hours / Month', value: '—' },
                              { label: 'Minimum OT Hours', value: '—' },
                            ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                          </div>
                        </Card>
                        <Card className="p-6">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">Asset Allocation</h3>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: 'Laptop / Desktop', value: '—' },
                              { label: 'ID Card Number', value: '—' },
                              { label: 'Biometric ID', value: employee.biometricId },
                              { label: 'Parking Slot', value: '—' },
                              { label: 'Locker Number', value: '—' },
                              { label: 'Mobile Device', value: '—' },
                              { label: 'Access Card', value: '—' },
                              { label: 'Keys Issued', value: '—' },
                              { label: 'Other Assets', value: '—' },
                            ].map((field) => <InfoBlock key={field.label} label={field.label} value={field.value} />)}
                          </div>
                          <p className="mt-4 text-xs text-gray-500">Unavailable operational settings and asset assignments are not recorded in the current employee sample data.</p>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
            }

              {/* Performance Tab */}
              {activeTab === 'performance' &&
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    {renderSubNav(subTabs.performance)}
                  </div>
                  <div className="lg:col-span-3">
                    {activeSubTab === 'outcomes' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Student Outcomes
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('performance')} />

                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {employee.performance.studentOutcomes.map((o, i) =>
                    <div
                      key={i}
                      className="p-5 bg-gray-50 rounded-xl border border-gray-200">

                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900">{o.class}</h4>
                                  <p className="mt-0.5 text-xs text-gray-500">{o.subject}</p>
                                </div>
                                {o.trend === 'up' ?
                        <TrendingUp className="w-5 h-5 text-green-500" /> :
                        o.trend === 'down' ?
                        <TrendingDown className="w-5 h-5 text-red-500" /> :

                        <span className="w-5 h-5 bg-gray-300 rounded-full" />
                        }
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-lg bg-white p-3">
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Average score</p>
                                  <div className="flex items-end justify-between gap-3">
                                    <div><p className="text-2xl font-bold text-blue-600">{o.averageScore}%</p><p className="text-xs text-gray-500">Current year</p></div>
                                    <div className="text-right"><p className="text-lg font-semibold text-gray-700">{o.priorYearAverageScore !== undefined ? `${o.priorYearAverageScore}%` : '—'}</p><p className="text-xs text-gray-500">Prior year</p></div>
                                  </div>
                                </div>
                                <div className="rounded-lg bg-white p-3">
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Pass rate</p>
                                  <div className="flex items-end justify-between gap-3">
                                    <div><p className="text-2xl font-bold text-green-600">{o.passRate}%</p><p className="text-xs text-gray-500">Current year</p></div>
                                    <div className="text-right"><p className="text-lg font-semibold text-gray-700">{o.priorYearPassRate !== undefined ? `${o.priorYearPassRate}%` : '—'}</p><p className="text-xs text-gray-500">Prior year</p></div>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-3 text-center text-xs font-medium text-blue-700">Year-over-year comparison: {o.comparison}</p>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'feedback' &&
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <h3 className="font-semibold text-blue-900">Feedback &amp; Performance Evaluation</h3>
                    <p className="mt-1 text-sm text-blue-800">Peer feedback, student feedback, and formal performance evaluation are grouped here as separate sections.</p>
                  </div>

                  <section className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Peers</h3>
                        <p className="text-xs text-gray-500">Feedback shared by colleagues and peers.</p>
                      </div>
                      <div className="flex items-center gap-2"><Badge variant="warning">{peerFeedback.length} entries</Badge>{peerFeedback.length > 0 && <RatingStars rating={getFeedbackAverage(peerFeedback)} />}</div>
                    </div>
                    {peerFeedback.length > 0 ? (
                      <div className="space-y-3">
                        {peerFeedback.map((feedback, index) => (
                          <div key={`peer-${feedback.date}-${index}`} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><Badge variant="warning">Peer</Badge><div className="flex items-center gap-3"><RatingStars rating={feedback.rating} /><span className="text-xs text-gray-500">{feedback.date}</span></div></div>
                            <p className="text-sm text-gray-700">“{feedback.comment}”</p>
                            {feedback.anonymous && <p className="mt-2 text-xs italic text-gray-400">Anonymous feedback</p>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No peer feedback has been recorded.</div>}
                  </section>

                  <section className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                        <p className="text-xs text-gray-500">Student and parent feedback entries.</p>
                      </div>
                      <div className="flex items-center gap-2"><Badge variant="info">{studentFeedback.length} entries</Badge>{studentFeedback.length > 0 && <RatingStars rating={getFeedbackAverage(studentFeedback)} />}</div>
                    </div>
                    {studentFeedback.length > 0 ? (
                      <div className="space-y-3">
                        {studentFeedback.map((feedback, index) => (
                          <div key={`student-${feedback.date}-${index}`} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><Badge variant={feedback.type === 'parent' ? 'success' : 'info'} className="capitalize">{feedback.type}</Badge><div className="flex items-center gap-3"><RatingStars rating={feedback.rating} /><span className="text-xs text-gray-500">{feedback.date}</span></div></div>
                            <p className="text-sm text-gray-700">“{feedback.comment}”</p>
                            {feedback.anonymous && <p className="mt-2 text-xs italic text-gray-400">Anonymous feedback</p>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No student feedback has been recorded.</div>}
                  </section>

                  <section className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-5 flex items-center gap-3"><div className="rounded-lg bg-purple-100 p-2"><Award className="h-5 w-5 text-purple-700" /></div><div><h3 className="text-lg font-semibold text-gray-900">Performance Evaluation</h3><p className="text-xs text-gray-500">Appraisal ratings, review dates, and evaluator notes.</p></div></div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-xl bg-blue-50 p-4"><p className="text-xs text-blue-700">Current rating</p><p className="mt-1 text-2xl font-bold text-blue-900">{employee.performance.currentRating}/5</p></div>
                      <div className="rounded-xl bg-indigo-50 p-4"><p className="text-xs text-indigo-700">Overall score</p><p className="mt-1 text-2xl font-bold text-indigo-900">{employee.performance.overallScore}/5</p></div>
                      <div className="rounded-xl bg-amber-50 p-4"><p className="text-xs text-amber-700">Evaluation rank</p><p className="mt-1 text-2xl font-bold text-amber-900">{employee.performance.rank}</p></div>
                      <div className="rounded-xl bg-green-50 p-4"><p className="text-xs text-green-700">Percentile</p><p className="mt-1 text-2xl font-bold text-green-900">{employee.performance.percentile}%</p></div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-gray-200 p-4"><p className="text-xs uppercase tracking-wide text-gray-500">Last appraisal</p><p className="mt-1 font-semibold text-gray-900">{employee.performance.lastAppraisalDate}</p></div>
                      <div className="rounded-lg border border-gray-200 p-4"><p className="text-xs uppercase tracking-wide text-gray-500">Next appraisal</p><p className="mt-1 font-semibold text-gray-900">{employee.performance.nextAppraisalDate}</p></div>
                    </div>
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <div className="mb-3 flex items-center justify-between gap-3"><h4 className="font-semibold text-gray-800">Evaluator Feedback</h4>{evaluationFeedback.length > 0 && <RatingStars rating={getFeedbackAverage(evaluationFeedback)} />}</div>
                      {evaluationFeedback.length > 0 ? (
                        <div className="space-y-3">{evaluationFeedback.map((feedback, index) => (
                          <div key={`evaluation-${feedback.date}-${index}`} className="rounded-lg bg-gray-50 p-4"><div className="mb-2 flex items-center justify-between"><Badge variant="secondary">Evaluation</Badge><span className="text-xs text-gray-500">{feedback.date}</span></div><p className="text-sm text-gray-700">“{feedback.comment}”</p></div>
                        ))}</div>
                      ) : <p className="text-sm text-gray-500">No performance evaluation comments have been recorded.</p>}
                    </div>
                  </section>
                </div>
                }

                    {activeSubTab === 'cpd' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              CPD Tracker
                            </h3>
                          </div>
                          <Badge variant="success">
                            {employee.performance.cpdCourses.reduce(
                        (s, c) => s + c.hours,
                        0
                      )}{' '}
                            Hours Completed
                          </Badge>
                        </div>
                        <div className="space-y-4">
                          {employee.performance.cpdCourses.map((c, i) =>
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">

                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                  <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {c.name}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {c.provider} • {c.category}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-lg font-bold text-blue-600">
                                    {c.hours}h
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {c.completedDate}
                                  </p>
                                </div>
                                {c.certificate &&
                        <Badge variant="success">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Certified
                                  </Badge>
                        }
                              </div>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                  </div>
                </div>
            }

              {/* Engagement Tab */}
              {activeTab === 'engagement' &&
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    {renderSubNav(subTabs.engagement)}
                  </div>
                  <div className="lg:col-span-3">
                    {activeSubTab === 'achievements' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Achievements
                            </h3>
                            <InfoIconBtn
                        onClick={() => openModal('engagement')} />

                          </div>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {employee.engagement.achievements.map((a, i) =>
                    <div
                      key={i}
                      className={`p-5 rounded-xl border ${a.category === 'award' ? 'bg-amber-50 border-amber-200' : a.category === 'publication' ? 'bg-blue-50 border-blue-200' : a.category === 'recognition' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'}`}>

                              <div className="flex items-start gap-4">
                                <div
                          className={`p-3 rounded-xl ${a.category === 'award' ? 'bg-amber-100' : a.category === 'publication' ? 'bg-blue-100' : a.category === 'recognition' ? 'bg-green-100' : 'bg-purple-100'}`}>

                                  <Trophy
                            className={`w-6 h-6 ${a.category === 'award' ? 'text-amber-600' : a.category === 'publication' ? 'text-blue-600' : a.category === 'recognition' ? 'text-green-600' : 'text-purple-600'}`} />

                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    {a.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {a.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge
                              variant="secondary"
                              className="capitalize text-xs">

                                      {a.category}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {a.date}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'responsibilities' &&
                <Card className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Responsibilities & Mentoring
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                            <h4 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Additional Responsibilities
                            </h4>
                            <div className="space-y-2">
                              {employee.engagement.responsibilities.length > 0 ? employee.engagement.responsibilities.map((responsibility, index) =>
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700">{responsibility}</span>
                                  </div>
                        ) : <p className="text-sm text-gray-500">No additional responsibilities recorded.</p>}
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                            <h4 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Mentoring
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {employee.engagement.mentoring.length > 0 ? employee.engagement.mentoring.map((mentee, index) =>
                        <Badge key={index} variant="secondary">{mentee}</Badge>
                        ) : <p className="text-sm text-gray-500">No mentees assigned.</p>}
                            </div>
                          </div>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'health' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Health & Wellness
                            </h3>
                            <InfoIconBtn onClick={() => openModal('health')} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="bg-red-50 rounded-xl p-5 border border-red-100 text-center">
                            <Droplet className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-red-600">
                              {employee.health.bloodGroup}
                            </p>
                            <p className="text-xs text-gray-500">Blood Group</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 text-center">
                            <Stethoscope className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-lg font-bold text-blue-600">
                              {employee.health.lastCheckup}
                            </p>
                            <p className="text-xs text-gray-500">
                              Last Checkup
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-5 border border-green-100 text-center">
                            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-lg font-bold text-green-600">
                              {employee.health.insuranceNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              Insurance No.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Allergies & Conditions
                            </h4>
                            <div className="space-y-2">
                              {employee.health.allergies.length > 0 ?
                        employee.health.allergies.map((a, i) =>
                        <Badge key={i} variant="warning">
                                    {a}
                                  </Badge>
                        ) :

                        <p className="text-sm text-gray-500">
                                  No known allergies
                                </p>
                        }
                              {employee.health.medicalConditions.map((c, i) =>
                        <p key={i} className="text-sm text-gray-700">
                                  {c}
                                </p>
                        )}
                            </div>
                            <div className="mt-4 rounded-lg border border-red-100 bg-white p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Emergency medical information</p>
                              <p className="mt-1 text-sm text-gray-700">{employee.health.emergencyMedical || 'No emergency medical information recorded.'}</p>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                            <h4 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Vaccinations
                            </h4>
                            <div className="space-y-2">
                              {employee.health.vaccinations.map((v, i) =>
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-white rounded-lg">

                                  <span className="text-sm text-gray-700">
                                    {v.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {v.date}
                                  </span>
                                </div>
                        )}
                            </div>
                          </div>
                        </div>
                      </Card>
                }

                    {activeSubTab === 'disciplinary' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Disciplinary Records
                            </h3>
                          </div>
                        </div>
                        {employee.engagement.disciplinaryRecords.length ===
                  0 ?
                  <div className="text-center py-16">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              Clean Record
                            </h4>
                            <p className="text-sm text-gray-500">
                              No disciplinary records found for this employee.
                            </p>
                          </div> :

                  <div className="space-y-4">
                            {employee.engagement.disciplinaryRecords.map(
                      (r, i) =>
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${r.type === 'commendation' ? 'bg-green-50 border-green-200' : r.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>

                                  <div className="flex items-center justify-between mb-2">
                                    <Badge
                            variant={
                            r.type === 'commendation' ?
                            'success' :
                            r.type === 'warning' ?
                            'warning' :
                            'danger'
                            }
                            className="capitalize">

                                      {r.type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {r.date}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {r.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Issued by: {r.issuedBy}
                                  </p>
                                </div>

                    )}
                          </div>
                  }
                      </Card>
                }
                  </div>
                </div>
            }
            </div>
        </>)}
      </div>
    </div>);

}