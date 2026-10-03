import React, { useMemo, useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
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
  Edit,
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
  Activity,
  BarChart3,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Stethoscope,
  Droplet,
  Timer,
  PlayCircle,
  Coffee,
  Layers,
  Fingerprint,
  Lock,
  Plus,
  RefreshCw,
  Share2,
  Upload,
  Globe,
  Trophy,
  Filter,
  ChevronDown,
  XCircle,
  Car,
  FolderOpen } from
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
      verified: boolean;
    }[];
  };
  skills: {
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
    committees: string[];
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
      verified: true
    }]

  },
  skills: {
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
      trend: 'up',
      comparison: '+5.2% vs last year'
    },
    {
      class: 'Class 10-B',
      subject: 'Mathematics',
      averageScore: 74.2,
      passRate: 92,
      trend: 'stable',
      comparison: '+1.1% vs last year'
    },
    {
      class: 'Class 11-A',
      subject: 'Mathematics',
      averageScore: 71.8,
      passRate: 88,
      trend: 'up',
      comparison: '+3.5% vs last year'
    },
    {
      class: 'Class 12-A',
      subject: 'Mathematics',
      averageScore: 82.3,
      passRate: 100,
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
    committees: [
    'Academic Committee Member',
    'Examination Cell Coordinator',
    'CBSE Affiliation Committee'],

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
    committees: ['Cultural Committee'],
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
    title: 'Schedule & Workload',
    description:
    'Current timetable, class mappings, and workload distribution.',
    dataSource: {
      title: 'Data Source',
      description: 'Integrated with timetable management system.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Ensures balanced workload distribution and prevents scheduling conflicts.'
    },
    recommendedActions: [
    {
      title: 'Review workload balance'
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
    'Student outcomes, feedback scores, CPD progress, and KRA achievements.',
    dataSource: {
      title: 'Data Source',
      description:
      'Aggregated from examination system, feedback portal, and LMS.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Drives appraisals, increments, promotions, and professional development planning.'
    },
    recommendedActions: [
    {
      title: 'Review KRA progress'
    },
    {
      title: 'Schedule feedback discussion'
    }]

  },
  engagement: {
    title: 'Engagement & Welfare',
    description:
    'Achievements, awards, committee memberships, and disciplinary records.',
    dataSource: {
      title: 'Data Source',
      description:
      'Maintained by HR through nomination records and committee minutes.'
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Recognizes contributions and tracks institutional involvement.'
    },
    recommendedActions: [
    {
      title: 'Update achievement records'
    },
    {
      title: 'Review committee assignments'
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
// Main Component
export function EmployeeProfileView() {
  const [selectedId, setSelectedId] = useState<string>('EMP001');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    staffType: '',
    designation: ''
  });
  const employee = mockEmployees.find((e) => e.id === selectedId);
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((e) => {
      const matchesSearch =
      !search ||
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
      !filters.department || e.department === filters.department;
      const matchesStatus = !filters.status || e.status === filters.status;
      const matchesType =
      !filters.staffType || e.staffType === filters.staffType;
      const matchesDesig =
      !filters.designation ||
      e.designation.toLowerCase().includes(filters.designation.toLowerCase());
      return (
        matchesSearch &&
        matchesDept &&
        matchesStatus &&
        matchesType &&
        matchesDesig);

    });
  }, [search, filters]);
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
      label: 'Bank',
      icon: CreditCard
    }],

    professional: [
    {
      id: 'qualification',
      label: 'Education',
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
      label: 'Certifications',
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
      id: 'workload',
      label: 'Workload',
      icon: BarChart3
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
    {
      id: 'kra',
      label: 'KRA/KPI',
      icon: Target
    }],

    engagement: [
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy
    },
    {
      id: 'committees',
      label: 'Committees',
      icon: Users
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
  const clearFilters = () =>
  setFilters({
    department: '',
    status: '',
    staffType: '',
    designation: ''
  });
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
          <span className="text-gray-900 font-medium">360° Profile</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              Employee 360° Profile View
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive employee information across all dimensions
            </p>
          </div>
          {employee &&
          <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
              variant="primary"
              className="flex items-center gap-2 bg-blue-600 text-white">

                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          }
        </div>

        {/* Search & Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, name, department, designation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2">

                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />

              </Button>
              <div className="w-full md:w-80">
                <Select
                  label=""
                  options={[
                  {
                    value: '',
                    label: 'Select Employee'
                  },
                  ...filteredEmployees.map((e) => ({
                    value: e.id,
                    label: `${e.code} - ${e.fullName}`
                  }))]
                  }
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)} />

              </div>
            </div>

            {showFilters &&
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <Select
                label="Department"
                options={[
                {
                  value: '',
                  label: 'All Departments'
                },
                ...departments.map((d) => ({
                  value: d,
                  label: d
                }))]
                }
                value={filters.department}
                onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  department: e.target.value
                }))
                } />

                <Select
                label="Status"
                options={[
                {
                  value: '',
                  label: 'All Status'
                },
                ...statuses.map((s) => ({
                  value: s,
                  label: s
                }))]
                }
                value={filters.status}
                onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  status: e.target.value
                }))
                } />

                <Select
                label="Staff Type"
                options={[
                {
                  value: '',
                  label: 'All Types'
                },
                ...staffTypes.map((t) => ({
                  value: t,
                  label: t
                }))]
                }
                value={filters.staffType}
                onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  staffType: e.target.value
                }))
                } />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                  type="text"
                  placeholder="Filter by designation"
                  value={filters.designation}
                  onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    designation: e.target.value
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
                <div className="md:col-span-4 flex justify-end">
                  <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2">

                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            }
          </div>
        </Card>

        {!employee ?
        <Card className="p-16 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Select an Employee
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Use the search bar or dropdown to find and select an employee to
              view their 360-degree profile.
            </p>
          </Card> :

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
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
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
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
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
                                {addr.a.city}, {addr.a.state} - {addr.a.pincode}
                              </p>
                            </div>
                    )}
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
                        employee.documents.filter(
                          (d) => d.status === 'Verified'
                        ).length
                        }{' '}
                              Verified
                            </Badge>
                            <Badge variant="warning">
                              {
                        employee.documents.filter(
                          (d) => d.status === 'Pending'
                        ).length
                        }{' '}
                              Pending
                            </Badge>
                            <Button variant="primary" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {employee.documents.map((d) =>
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
                                    {d.type} • {d.fileSize}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getDocBadge(d.status)}
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
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
                            </div>
                          </div>
                        </div>
                      </Card>
                }
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
                              Education
                            </h3>
                          </div>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
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
                        <div className="space-y-4">
                          {employee.qualification.education.map((e, i) =>
                    <div
                      key={i}
                      className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0">

                              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
                              <div className="bg-gray-50 rounded-xl p-4 ml-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                      {e.degree}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {e.institution}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-green-600">
                                      {e.percentage}
                                    </p>
                                    <Badge
                              variant="secondary"
                              className="text-xs">

                                      {e.yearOfPassing}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                    )}
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
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'skills' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Skills
                            </h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              Languages
                            </h4>
                            <div className="space-y-3">
                              {employee.skills.languages.map((l, i) =>
                        <div
                          key={i}
                          className="flex items-center justify-between">

                                  <span className="text-sm text-gray-700">
                                    {l.name}
                                  </span>
                                  <Badge
                            variant={
                            l.proficiency === 'native' ?
                            'success' :
                            'info'
                            }
                            className="capitalize">

                                    {l.proficiency}
                                  </Badge>
                                </div>
                        )}
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                            <h4 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
                              <Laptop className="w-4 h-4" />
                              Software
                            </h4>
                            <div className="space-y-3">
                              {employee.skills.software.map((s, i) =>
                        <div key={i}>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-700">
                                      {s.name}
                                    </span>
                                    <span className="text-xs text-purple-600 capitalize">
                                      {s.proficiency}
                                    </span>
                                  </div>
                                  <ProgressBar
                            value={
                            s.proficiency === 'expert' ?
                            100 :
                            s.proficiency === 'advanced' ?
                            75 :
                            s.proficiency === 'intermediate' ?
                            50 :
                            25
                            }
                            max={100}
                            color="purple"
                            showPct={false} />

                                </div>
                        )}
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                            <h4 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Teaching Subjects
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {employee.skills.teaching.map((s, i) =>
                        <Badge
                          key={i}
                          variant="success"
                          className="text-xs">

                                  {s}
                                </Badge>
                        )}
                            </div>
                          </div>
                          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                            <h4 className="text-sm font-semibold text-amber-900 mb-4 flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              Extracurricular
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {employee.skills.extracurricular.map((a, i) =>
                        <Badge
                          key={i}
                          variant="warning"
                          className="text-xs">

                                  {a}
                                </Badge>
                        )}
                            </div>
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
                              Certifications
                            </h3>
                          </div>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
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
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                {c.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                {c.issuingAuthority}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-400">Issued</p>
                                  <p className="font-medium">{c.issueDate}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Expires</p>
                                  <p className="font-medium">{c.expiryDate}</p>
                                </div>
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

                    {activeSubTab === 'workload' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Weekly Workload
                            </h3>
                          </div>
                          <Badge variant="secondary">
                            {employee.schedule.weeklyLoad.reduce(
                        (s, d) => s + d.totalPeriods,
                        0
                      )}{' '}
                            Periods/Week
                          </Badge>
                        </div>
                        <div className="space-y-4">
                          {employee.schedule.weeklyLoad.map((d, i) =>
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-900">
                                  {d.day}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {d.totalPeriods} periods
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Teaching ({d.teachingHours}h)
                                  </p>
                                  <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
                                    <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${d.teachingHours / 8 * 100}%`
                              }} />

                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Admin ({d.adminHours}h)
                                  </p>
                                  <div className="h-3 bg-purple-200 rounded-full overflow-hidden">
                                    <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{
                                width: `${d.adminHours / 8 * 100}%`
                              }} />

                                  </div>
                                </div>
                              </div>
                            </div>
                    )}
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
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">
                          Recent Logs
                        </h4>
                        <div className="space-y-2">
                          {employee.attendance.recentLogs.map((l, i) =>
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border ${l.status === 'Present' ? 'bg-green-50 border-green-200' : l.status === 'Late' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>

                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900">
                                  {l.date}
                                </span>
                                <Badge
                          variant={
                          l.status === 'Present' ?
                          'success' :
                          l.status === 'Late' ?
                          'warning' :
                          'info'
                          }>

                                  {l.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>In: {l.inTime}</span>
                                <span>Out: {l.outTime}</span>
                                <span className="font-medium">
                                  {l.totalHours}
                                </span>
                              </div>
                            </div>
                    )}
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
                          <Button variant="primary" size="sm">
                            Apply Leave
                          </Button>
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

                              <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>Taken: {l.taken}</span>
                                <span>Pending: {l.pending}</span>
                                <span>Entitled: {l.entitled}</span>
                              </div>
                            </div>
                    )}
                        </div>
                      </Card>
                }
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
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {o.class}
                                </h4>
                                {o.trend === 'up' ?
                        <TrendingUp className="w-5 h-5 text-green-500" /> :
                        o.trend === 'down' ?
                        <TrendingDown className="w-5 h-5 text-red-500" /> :

                        <span className="w-5 h-5 bg-gray-300 rounded-full" />
                        }
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-white rounded-lg">
                                  <p className="text-2xl font-bold text-blue-600">
                                    {o.averageScore}%
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Average
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg">
                                  <p className="text-2xl font-bold text-green-600">
                                    {o.passRate}%
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Pass Rate
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-green-600 mt-3 text-center">
                                {o.comparison}
                              </p>
                            </div>
                    )}
                        </div>
                      </Card>
                }

                    {activeSubTab === 'feedback' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Feedback
                            </h3>
                          </div>
                          <RatingStars
                      rating={
                      employee.performance.feedback.reduce(
                        (s, f) => s + f.rating,
                        0
                      ) / employee.performance.feedback.length
                      } />

                        </div>
                        <div className="space-y-4">
                          {employee.performance.feedback.map((f, i) =>
                    <div
                      key={i}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200">

                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Badge
                            variant={
                            f.type === 'student' ?
                            'info' :
                            f.type === 'parent' ?
                            'success' :
                            f.type === 'peer' ?
                            'warning' :
                            'secondary'
                            }
                            className="capitalize">

                                    {f.type}
                                  </Badge>
                                  <RatingStars rating={f.rating} />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {f.date}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                "{f.comment}"
                              </p>
                              {f.anonymous &&
                      <p className="text-xs text-gray-400 mt-2 italic">
                                  Anonymous feedback
                                </p>
                      }
                            </div>
                    )}
                        </div>
                      </Card>
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

                    {activeSubTab === 'kra' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              KRA/KPI
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Next Appraisal:
                            </span>
                            <Badge variant="info">
                              {employee.performance.nextAppraisalDate}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {employee.performance.kras.map((k, i) =>
                    <div
                      key={i}
                      className="p-5 bg-gray-50 rounded-xl border border-gray-200">

                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {k.title}
                                </h4>
                                <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getKRAColor(k.status)}`}>

                                  {k.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">
                                {k.description}
                              </p>
                              <ProgressBar
                        value={k.achieved}
                        max={k.target}
                        color={
                        k.status === 'achieved' ?
                        'green' :
                        k.status === 'at-risk' ?
                        'orange' :
                        k.status === 'missed' ?
                        'red' :
                        'blue'
                        } />

                              <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>
                                  Achieved: {k.achieved} {k.unit}
                                </span>
                                <span>
                                  Target: {k.target} {k.unit}
                                </span>
                                <span>Deadline: {k.deadline}</span>
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

                    {activeSubTab === 'committees' &&
                <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Committees & Responsibilities
                            </h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Committee Memberships
                            </h4>
                            <div className="space-y-2">
                              {employee.engagement.committees.map((c, i) =>
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg">

                                  <CheckCircle className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-gray-700">
                                    {c}
                                  </span>
                                </div>
                        )}
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                            <h4 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Additional Responsibilities
                            </h4>
                            <div className="space-y-2">
                              {employee.engagement.responsibilities.map(
                          (r, i) =>
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg">

                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700">
                                      {r}
                                    </span>
                                  </div>

                        )}
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 md:col-span-2">
                            <h4 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Mentoring
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {employee.engagement.mentoring.length > 0 ?
                        employee.engagement.mentoring.map((m, i) =>
                        <Badge key={i} variant="secondary">
                                    {m}
                                  </Badge>
                        ) :

                        <p className="text-sm text-gray-500">
                                  No mentees assigned
                                </p>
                        }
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
          </>
        }
      </div>
    </div>);

}