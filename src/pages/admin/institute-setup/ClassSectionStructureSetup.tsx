// ClassSectionStructureSetup.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Edit2,
  Layers,
  Trash2,
  Save,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Users,
  BookOpen,
  GraduationCap,
  Copy,
  Download,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  UserPlus,
  DoorOpen,
  Calendar,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileText,
  Grid3X3 } from
'lucide-react';

// Type definitions
interface Subject {
  id: number;
  name: string;
  code: string;
}

interface Teacher {
  id: number;
  name: string;
  employeeId: string;
  department: string;
}

interface Room {
  id: number;
  roomNumber: string;
  name: string;
  capacity: number;
}

interface Section {
  id: number;
  classId: number;
  name: string;
  capacity: number;
  currentStrength: number;
  classTeacherId?: number;
  classTeacherName?: string;
  roomId?: number;
  roomName?: string;
  subjects: number[];
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface ClassGrade {
  id: number;
  name: string;
  displayName: string;
  order: number;
  stream: StreamType;
  academicYear: string;
  sections: Section[];
  defaultCapacity: number;
  minimumAge?: number;
  maximumAge?: number;
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

type StreamType = 'N/A' | 'General' | 'Science' | 'Commerce' | 'Arts' | 'Mixed' | 'Vocational';

interface AcademicYear {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

// Mock data
const MOCK_TEACHERS: Teacher[] = [
{ id: 1, name: 'Dr. Rajesh Kumar', employeeId: 'EMP001', department: 'Mathematics' },
{ id: 2, name: 'Mrs. Priya Sharma', employeeId: 'EMP002', department: 'English' },
{ id: 3, name: 'Mr. Amit Singh', employeeId: 'EMP003', department: 'Science' },
{ id: 4, name: 'Mrs. Sunita Patel', employeeId: 'EMP004', department: 'Hindi' },
{ id: 5, name: 'Mr. Vikram Reddy', employeeId: 'EMP005', department: 'Social Studies' },
{ id: 6, name: 'Dr. Anita Gupta', employeeId: 'EMP006', department: 'Physics' },
{ id: 7, name: 'Mr. Sanjay Verma', employeeId: 'EMP007', department: 'Chemistry' },
{ id: 8, name: 'Mrs. Kavita Joshi', employeeId: 'EMP008', department: 'Biology' },
{ id: 9, name: 'Mr. Rahul Mehta', employeeId: 'EMP009', department: 'Computer Science' },
{ id: 10, name: 'Mrs. Deepa Nair', employeeId: 'EMP010', department: 'Commerce' }];


const MOCK_ROOMS: Room[] = [
{ id: 1, roomNumber: '101', name: 'Classroom 101', capacity: 40 },
{ id: 2, roomNumber: '102', name: 'Classroom 102', capacity: 40 },
{ id: 3, roomNumber: '103', name: 'Classroom 103', capacity: 40 },
{ id: 4, roomNumber: '201', name: 'Classroom 201', capacity: 45 },
{ id: 5, roomNumber: '202', name: 'Classroom 202', capacity: 45 },
{ id: 6, roomNumber: '203', name: 'Classroom 203', capacity: 45 },
{ id: 7, roomNumber: '301', name: 'Science Lab', capacity: 30 },
{ id: 8, roomNumber: '302', name: 'Computer Lab', capacity: 35 },
{ id: 9, roomNumber: '401', name: 'Senior Classroom 1', capacity: 50 },
{ id: 10, roomNumber: '402', name: 'Senior Classroom 2', capacity: 50 }];


const MOCK_SUBJECTS: Subject[] = [
{ id: 1, name: 'Mathematics', code: 'MATH' },
{ id: 2, name: 'English', code: 'ENG' },
{ id: 3, name: 'Hindi', code: 'HIN' },
{ id: 4, name: 'Science', code: 'SCI' },
{ id: 5, name: 'Social Studies', code: 'SST' },
{ id: 6, name: 'Physics', code: 'PHY' },
{ id: 7, name: 'Chemistry', code: 'CHE' },
{ id: 8, name: 'Biology', code: 'BIO' },
{ id: 9, name: 'Computer Science', code: 'CS' },
{ id: 10, name: 'Accountancy', code: 'ACC' },
{ id: 11, name: 'Business Studies', code: 'BS' },
{ id: 12, name: 'Economics', code: 'ECO' },
{ id: 13, name: 'History', code: 'HIS' },
{ id: 14, name: 'Geography', code: 'GEO' },
{ id: 15, name: 'Political Science', code: 'POL' }];


const STREAM_TYPES: StreamType[] = ['N/A', 'General', 'Science', 'Commerce', 'Arts', 'Mixed', 'Vocational'];

const ACADEMIC_YEARS: AcademicYear[] = [
{ id: 1, name: '2024-25', startDate: new Date('2024-04-01'), endDate: new Date('2025-03-31'), isCurrent: true },
{ id: 2, name: '2023-24', startDate: new Date('2023-04-01'), endDate: new Date('2024-03-31'), isCurrent: false },
{ id: 3, name: '2025-26', startDate: new Date('2025-04-01'), endDate: new Date('2026-03-31'), isCurrent: false }];


export function ClassSectionStructureSetup() {
  // Initial mock data
  const initialClasses: ClassGrade[] = [
  {
    id: 1,
    name: 'Class 1',
    displayName: 'Class I',
    order: 1,
    stream: 'N/A',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 5,
    maximumAge: 7,
    description: 'Primary class for beginners',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 1,
      classId: 1,
      name: 'A',
      capacity: 40,
      currentStrength: 38,
      classTeacherId: 2,
      classTeacherName: 'Mrs. Priya Sharma',
      roomId: 1,
      roomName: 'Classroom 101',
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      classId: 1,
      name: 'B',
      capacity: 40,
      currentStrength: 36,
      classTeacherId: 4,
      classTeacherName: 'Mrs. Sunita Patel',
      roomId: 2,
      roomName: 'Classroom 102',
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 3,
      classId: 1,
      name: 'C',
      capacity: 40,
      currentStrength: 35,
      classTeacherId: 5,
      classTeacherName: 'Mr. Vikram Reddy',
      roomId: 3,
      roomName: 'Classroom 103',
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 2,
    name: 'Class 2',
    displayName: 'Class II',
    order: 2,
    stream: 'N/A',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 6,
    maximumAge: 8,
    description: 'Primary class - second year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 4,
      classId: 2,
      name: 'A',
      capacity: 40,
      currentStrength: 40,
      classTeacherId: 1,
      classTeacherName: 'Dr. Rajesh Kumar',
      roomId: 4,
      roomName: 'Classroom 201',
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 5,
      classId: 2,
      name: 'B',
      capacity: 40,
      currentStrength: 38,
      classTeacherId: 3,
      classTeacherName: 'Mr. Amit Singh',
      roomId: 5,
      roomName: 'Classroom 202',
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 6,
      classId: 2,
      name: 'C',
      capacity: 40,
      currentStrength: 37,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 3,
    name: 'Class 3',
    displayName: 'Class III',
    order: 3,
    stream: 'N/A',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 7,
    maximumAge: 9,
    description: 'Primary class - third year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 7,
      classId: 3,
      name: 'A',
      capacity: 40,
      currentStrength: 39,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 8,
      classId: 3,
      name: 'B',
      capacity: 40,
      currentStrength: 38,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 4,
    name: 'Class 4',
    displayName: 'Class IV',
    order: 4,
    stream: 'N/A',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 8,
    maximumAge: 10,
    description: 'Primary class - fourth year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 9,
      classId: 4,
      name: 'A',
      capacity: 40,
      currentStrength: 35,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 10,
      classId: 4,
      name: 'B',
      capacity: 40,
      currentStrength: 36,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 5,
    name: 'Class 5',
    displayName: 'Class V',
    order: 5,
    stream: 'N/A',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 9,
    maximumAge: 11,
    description: 'Primary class - final year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 11,
      classId: 5,
      name: 'A',
      capacity: 45,
      currentStrength: 42,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 12,
      classId: 5,
      name: 'B',
      capacity: 45,
      currentStrength: 40,
      subjects: [1, 2, 3, 4, 5],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 6,
    name: 'Class 6',
    displayName: 'Class VI',
    order: 6,
    stream: 'General',
    academicYear: '2024-25',
    defaultCapacity: 45,
    minimumAge: 10,
    maximumAge: 12,
    description: 'Middle school - first year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 13,
      classId: 6,
      name: 'A',
      capacity: 45,
      currentStrength: 44,
      subjects: [1, 2, 3, 4, 5, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 14,
      classId: 6,
      name: 'B',
      capacity: 45,
      currentStrength: 43,
      subjects: [1, 2, 3, 4, 5, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 7,
    name: 'Class 7',
    displayName: 'Class VII',
    order: 7,
    stream: 'General',
    academicYear: '2024-25',
    defaultCapacity: 45,
    minimumAge: 11,
    maximumAge: 13,
    description: 'Middle school - second year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 15,
      classId: 7,
      name: 'A',
      capacity: 45,
      currentStrength: 42,
      subjects: [1, 2, 3, 4, 5, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 16,
      classId: 7,
      name: 'B',
      capacity: 45,
      currentStrength: 41,
      subjects: [1, 2, 3, 4, 5, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 8,
    name: 'Class 8',
    displayName: 'Class VIII',
    order: 8,
    stream: 'General',
    academicYear: '2024-25',
    defaultCapacity: 45,
    minimumAge: 12,
    maximumAge: 14,
    description: 'Middle school - final year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 17,
      classId: 8,
      name: 'A',
      capacity: 45,
      currentStrength: 40,
      subjects: [1, 2, 3, 4, 5, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 18,
      classId: 8,
      name: 'B',
      capacity: 45,
      currentStrength: 38,
      subjects: [1, 2, 3, 4, 5, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 9,
    name: 'Class 9',
    displayName: 'Class IX',
    order: 9,
    stream: 'General',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 13,
    maximumAge: 15,
    description: 'Secondary school - first year (Board preparation)',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 19,
      classId: 9,
      name: 'A',
      capacity: 40,
      currentStrength: 38,
      classTeacherId: 6,
      classTeacherName: 'Dr. Anita Gupta',
      roomId: 9,
      roomName: 'Senior Classroom 1',
      subjects: [1, 2, 3, 6, 7, 8, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 20,
      classId: 9,
      name: 'B',
      capacity: 40,
      currentStrength: 36,
      classTeacherId: 7,
      classTeacherName: 'Mr. Sanjay Verma',
      roomId: 10,
      roomName: 'Senior Classroom 2',
      subjects: [1, 2, 3, 6, 7, 8, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 10,
    name: 'Class 10',
    displayName: 'Class X',
    order: 10,
    stream: 'General',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 14,
    maximumAge: 16,
    description: 'Secondary school - Board exam year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 21,
      classId: 10,
      name: 'A',
      capacity: 40,
      currentStrength: 35,
      classTeacherId: 8,
      classTeacherName: 'Mrs. Kavita Joshi',
      subjects: [1, 2, 3, 6, 7, 8, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 22,
      classId: 10,
      name: 'B',
      capacity: 40,
      currentStrength: 34,
      classTeacherId: 9,
      classTeacherName: 'Mr. Rahul Mehta',
      subjects: [1, 2, 3, 6, 7, 8, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 11,
    name: 'Class 11',
    displayName: 'Class XI',
    order: 11,
    stream: 'Mixed',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 15,
    maximumAge: 17,
    description: 'Senior secondary - first year with stream selection',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 23,
      classId: 11,
      name: 'Science-A',
      capacity: 40,
      currentStrength: 38,
      classTeacherId: 6,
      classTeacherName: 'Dr. Anita Gupta',
      subjects: [1, 2, 6, 7, 8, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 24,
      classId: 11,
      name: 'Commerce-A',
      capacity: 40,
      currentStrength: 35,
      classTeacherId: 10,
      classTeacherName: 'Mrs. Deepa Nair',
      subjects: [1, 2, 10, 11, 12],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 25,
      classId: 11,
      name: 'Arts-A',
      capacity: 40,
      currentStrength: 28,
      subjects: [2, 3, 13, 14, 15, 12],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  },
  {
    id: 12,
    name: 'Class 12',
    displayName: 'Class XII',
    order: 12,
    stream: 'Mixed',
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 16,
    maximumAge: 18,
    description: 'Senior secondary - Board exam year',
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sections: [
    {
      id: 26,
      classId: 12,
      name: 'Science-A',
      capacity: 40,
      currentStrength: 36,
      classTeacherId: 7,
      classTeacherName: 'Mr. Sanjay Verma',
      subjects: [1, 2, 6, 7, 8, 9],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 27,
      classId: 12,
      name: 'Commerce-A',
      capacity: 40,
      currentStrength: 32,
      subjects: [1, 2, 10, 11, 12],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 28,
      classId: 12,
      name: 'Arts-A',
      capacity: 40,
      currentStrength: 25,
      subjects: [2, 3, 13, 14, 15, 12],
      status: 'Active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]

  }];


  // State management
  const [classes, setClasses] = useState<ClassGrade[]>(initialClasses);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024-25');
  const [searchTerm, setSearchTerm] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedClasses, setExpandedClasses] = useState<number[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassGrade | null>(null);

  // Modal states
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSectionConfigModal, setShowSectionConfigModal] = useState(false);
  const [showBulkSectionModal, setShowBulkSectionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  // Form data
  const [classFormData, setClassFormData] = useState({
    name: '',
    displayName: '',
    order: 1,
    stream: 'N/A' as StreamType,
    academicYear: '2024-25',
    defaultCapacity: 40,
    minimumAge: 5,
    maximumAge: 18,
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [sectionFormData, setSectionFormData] = useState({
    classId: 0,
    name: '',
    capacity: 40,
    classTeacherId: 0,
    roomId: 0,
    subjects: [] as number[],
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [bulkSectionData, setBulkSectionData] = useState({
    classId: 0,
    sectionNames: 'A, B, C',
    capacity: 40
  });

  // Toast notification
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'info' });

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'deleteClass' | 'deleteSection' | 'duplicateClass' | null;
    targetId: number | null;
    secondaryId?: number | null;
    message: string;
  }>({ isOpen: false, type: null, targetId: null, message: '' });

  // Show toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  }, []);

  // Filter classes
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = streamFilter === 'All' || classItem.stream === streamFilter;
    const matchesStatus = statusFilter === 'All' || classItem.status === statusFilter;
    const matchesYear = classItem.academicYear === selectedAcademicYear;
    return matchesSearch && matchesStream && matchesStatus && matchesYear;
  }).sort((a, b) => a.order - b.order);

  // Calculate statistics
  const stats = {
    totalClasses: filteredClasses.length,
    totalSections: filteredClasses.reduce((acc, c) => acc + c.sections.length, 0),
    totalCapacity: filteredClasses.reduce((acc, c) =>
    acc + c.sections.reduce((acc2, s) => acc2 + s.capacity, 0), 0),
    totalStrength: filteredClasses.reduce((acc, c) =>
    acc + c.sections.reduce((acc2, s) => acc2 + s.currentStrength, 0), 0),
    activeClasses: filteredClasses.filter((c) => c.status === 'Active').length,
    activeSections: filteredClasses.reduce((acc, c) =>
    acc + c.sections.filter((s) => s.status === 'Active').length, 0)
  };

  // Reset form data
  const resetClassForm = () => {
    setClassFormData({
      name: '',
      displayName: '',
      order: classes.length + 1,
      stream: 'N/A',
      academicYear: selectedAcademicYear,
      defaultCapacity: 40,
      minimumAge: 5,
      maximumAge: 18,
      description: '',
      status: 'Active'
    });
  };

  const resetSectionForm = () => {
    setSectionFormData({
      classId: selectedClass?.id || 0,
      name: '',
      capacity: selectedClass?.defaultCapacity || 40,
      classTeacherId: 0,
      roomId: 0,
      subjects: [],
      status: 'Active'
    });
  };

  // CRUD Operations for Class
  const handleCreateClass = () => {
    if (!classFormData.name.trim()) {
      showToast('Please enter a class name', 'error');
      return;
    }

    const newClass: ClassGrade = {
      id: Date.now(),
      ...classFormData,
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setClasses((prev) => [...prev, newClass]);
    setShowClassModal(false);
    resetClassForm();
    showToast('Class created successfully', 'success');
  };

  const handleUpdateClass = () => {
    if (!editingId) return;

    if (!classFormData.name.trim()) {
      showToast('Please enter a class name', 'error');
      return;
    }

    setClasses((prev) => prev.map((classItem) => {
      if (classItem.id === editingId) {
        return {
          ...classItem,
          ...classFormData,
          updatedAt: new Date()
        };
      }
      return classItem;
    }));

    setShowClassModal(false);
    setIsEditing(false);
    setEditingId(null);
    resetClassForm();
    showToast('Class updated successfully', 'success');
  };

  const handleDeleteClass = (classId: number) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    if (selectedClass?.id === classId) {
      setSelectedClass(null);
    }
    showToast('Class deleted successfully', 'success');
  };

  const handleDuplicateClass = (classId: number) => {
    const originalClass = classes.find((c) => c.id === classId);
    if (!originalClass) return;

    const duplicatedClass: ClassGrade = {
      ...originalClass,
      id: Date.now(),
      name: `${originalClass.name} (Copy)`,
      displayName: `${originalClass.displayName} (Copy)`,
      order: classes.length + 1,
      sections: originalClass.sections.map((section) => ({
        ...section,
        id: Date.now() + Math.random() * 1000,
        currentStrength: 0
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setClasses((prev) => [...prev, duplicatedClass]);
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Class duplicated successfully', 'success');
  };

  // Edit class
  const handleEditClass = (classItem: ClassGrade) => {
    setClassFormData({
      name: classItem.name,
      displayName: classItem.displayName,
      order: classItem.order,
      stream: classItem.stream,
      academicYear: classItem.academicYear,
      defaultCapacity: classItem.defaultCapacity,
      minimumAge: classItem.minimumAge || 5,
      maximumAge: classItem.maximumAge || 18,
      description: classItem.description,
      status: classItem.status
    });
    setEditingId(classItem.id);
    setIsEditing(true);
    setShowClassModal(true);
  };

  // CRUD Operations for Section
  const handleCreateSection = () => {
    if (!sectionFormData.name.trim() || !sectionFormData.classId) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const teacher = MOCK_TEACHERS.find((t) => t.id === sectionFormData.classTeacherId);
    const room = MOCK_ROOMS.find((r) => r.id === sectionFormData.roomId);

    const newSection: Section = {
      id: Date.now(),
      classId: sectionFormData.classId,
      name: sectionFormData.name,
      capacity: sectionFormData.capacity,
      currentStrength: 0,
      classTeacherId: sectionFormData.classTeacherId || undefined,
      classTeacherName: teacher?.name,
      roomId: sectionFormData.roomId || undefined,
      roomName: room ? `${room.roomNumber} - ${room.name}` : undefined,
      subjects: sectionFormData.subjects,
      status: sectionFormData.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setClasses((prev) => prev.map((classItem) => {
      if (classItem.id === sectionFormData.classId) {
        return {
          ...classItem,
          sections: [...classItem.sections, newSection],
          updatedAt: new Date()
        };
      }
      return classItem;
    }));

    if (selectedClass?.id === sectionFormData.classId) {
      setSelectedClass((prev) => prev ? {
        ...prev,
        sections: [...prev.sections, newSection],
        updatedAt: new Date()
      } : null);
    }

    setShowSectionModal(false);
    resetSectionForm();
    showToast('Section created successfully', 'success');
  };

  const handleUpdateSection = () => {
    if (!editingSectionId || !sectionFormData.classId) return;

    const teacher = MOCK_TEACHERS.find((t) => t.id === sectionFormData.classTeacherId);
    const room = MOCK_ROOMS.find((r) => r.id === sectionFormData.roomId);

    setClasses((prev) => prev.map((classItem) => {
      if (classItem.id === sectionFormData.classId) {
        return {
          ...classItem,
          sections: classItem.sections.map((section) => {
            if (section.id === editingSectionId) {
              return {
                ...section,
                name: sectionFormData.name,
                capacity: sectionFormData.capacity,
                classTeacherId: sectionFormData.classTeacherId || undefined,
                classTeacherName: teacher?.name,
                roomId: sectionFormData.roomId || undefined,
                roomName: room ? `${room.roomNumber} - ${room.name}` : undefined,
                subjects: sectionFormData.subjects,
                status: sectionFormData.status,
                updatedAt: new Date()
              };
            }
            return section;
          }),
          updatedAt: new Date()
        };
      }
      return classItem;
    }));

    if (selectedClass?.id === sectionFormData.classId) {
      setSelectedClass((prev) => prev ? {
        ...prev,
        sections: prev.sections.map((section) => {
          if (section.id === editingSectionId) {
            return {
              ...section,
              name: sectionFormData.name,
              capacity: sectionFormData.capacity,
              classTeacherId: sectionFormData.classTeacherId || undefined,
              classTeacherName: teacher?.name,
              roomId: sectionFormData.roomId || undefined,
              roomName: room ? `${room.roomNumber} - ${room.name}` : undefined,
              subjects: sectionFormData.subjects,
              status: sectionFormData.status,
              updatedAt: new Date()
            };
          }
          return section;
        }),
        updatedAt: new Date()
      } : null);
    }

    setShowSectionModal(false);
    setIsEditing(false);
    setEditingSectionId(null);
    resetSectionForm();
    showToast('Section updated successfully', 'success');
  };

  const handleDeleteSection = (classId: number, sectionId: number) => {
    setClasses((prev) => prev.map((classItem) => {
      if (classItem.id === classId) {
        return {
          ...classItem,
          sections: classItem.sections.filter((s) => s.id !== sectionId),
          updatedAt: new Date()
        };
      }
      return classItem;
    }));

    if (selectedClass?.id === classId) {
      setSelectedClass((prev) => prev ? {
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
        updatedAt: new Date()
      } : null);
    }

    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Section deleted successfully', 'success');
  };

  // Edit section
  const handleEditSection = (classId: number, section: Section) => {
    setSectionFormData({
      classId: classId,
      name: section.name,
      capacity: section.capacity,
      classTeacherId: section.classTeacherId || 0,
      roomId: section.roomId || 0,
      subjects: section.subjects,
      status: section.status
    });
    setEditingSectionId(section.id);
    setIsEditing(true);
    setShowSectionModal(true);
  };

  // Bulk create sections
  const handleBulkCreateSections = () => {
    if (!bulkSectionData.classId || !bulkSectionData.sectionNames.trim()) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const sectionNames = bulkSectionData.sectionNames.split(',').map((s) => s.trim()).filter((s) => s);

    if (sectionNames.length === 0) {
      showToast('Please provide valid section names', 'error');
      return;
    }

    const newSections: Section[] = sectionNames.map((name, index) => ({
      id: Date.now() + index,
      classId: bulkSectionData.classId,
      name: name,
      capacity: bulkSectionData.capacity,
      currentStrength: 0,
      subjects: [],
      status: 'Active' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    setClasses((prev) => prev.map((classItem) => {
      if (classItem.id === bulkSectionData.classId) {
        return {
          ...classItem,
          sections: [...classItem.sections, ...newSections],
          updatedAt: new Date()
        };
      }
      return classItem;
    }));

    if (selectedClass?.id === bulkSectionData.classId) {
      setSelectedClass((prev) => prev ? {
        ...prev,
        sections: [...prev.sections, ...newSections],
        updatedAt: new Date()
      } : null);
    }

    setShowBulkSectionModal(false);
    setBulkSectionData({ classId: 0, sectionNames: 'A, B, C', capacity: 40 });
    showToast(`${newSections.length} sections created successfully`, 'success');
  };

  // Move class order
  const handleMoveClassUp = (classId: number) => {
    const classIndex = filteredClasses.findIndex((c) => c.id === classId);
    if (classIndex <= 0) return;

    const currentClass = filteredClasses[classIndex];
    const prevClass = filteredClasses[classIndex - 1];

    setClasses((prev) => prev.map((c) => {
      if (c.id === currentClass.id) return { ...c, order: prevClass.order };
      if (c.id === prevClass.id) return { ...c, order: currentClass.order };
      return c;
    }));
  };

  const handleMoveClassDown = (classId: number) => {
    const classIndex = filteredClasses.findIndex((c) => c.id === classId);
    if (classIndex >= filteredClasses.length - 1) return;

    const currentClass = filteredClasses[classIndex];
    const nextClass = filteredClasses[classIndex + 1];

    setClasses((prev) => prev.map((c) => {
      if (c.id === currentClass.id) return { ...c, order: nextClass.order };
      if (c.id === nextClass.id) return { ...c, order: currentClass.order };
      return c;
    }));
  };

  // Toggle subject selection
  const handleSubjectToggle = (subjectId: number) => {
    setSectionFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId) ?
      prev.subjects.filter((s) => s !== subjectId) :
      [...prev.subjects, subjectId]
    }));
  };

  // Toggle class expansion
  const toggleClassExpand = (classId: number) => {
    setExpandedClasses((prev) =>
    prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  // Export data
  const handleExportData = () => {
    const exportData = JSON.stringify(classes, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-section-structure-${selectedAcademicYear}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
  };

  // Table columns
  const columns = [
  {
    key: 'order',
    header: 'Order',
    render: (row: ClassGrade, index: number) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleMoveClassUp(row.id)}
        disabled={index === 0}>

            <ArrowUp className="w-3 h-3" />
          </Button>
          <span className="w-6 text-center">{row.order}</span>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleMoveClassDown(row.id)}
        disabled={index === filteredClasses.length - 1}>

            <ArrowDown className="w-3 h-3" />
          </Button>
        </div>

  },
  {
    key: 'class',
    header: 'Class Name',
    render: (row: ClassGrade) =>
    <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-gray-500">{row.displayName}</p>
        </div>

  },
  {
    key: 'sections',
    header: 'Sections',
    render: (row: ClassGrade) =>
    <div className="flex flex-wrap gap-1">
          {row.sections.slice(0, 4).map((section) =>
      <Badge key={section.id} variant={section.status === 'Active' ? 'default' : 'warning'}>
              {section.name}
            </Badge>
      )}
          {row.sections.length > 4 &&
      <Badge variant="default">+{row.sections.length - 4}</Badge>
      }
          {row.sections.length === 0 &&
      <span className="text-gray-400 text-sm">No sections</span>
      }
        </div>

  },
  {
    key: 'capacity',
    header: 'Capacity',
    render: (row: ClassGrade) => {
      const totalCapacity = row.sections.reduce((acc, s) => acc + s.capacity, 0);
      const totalStrength = row.sections.reduce((acc, s) => acc + s.currentStrength, 0);
      const percentage = totalCapacity > 0 ? Math.round(totalStrength / totalCapacity * 100) : 0;
      return (
        <div>
            <p className="font-medium">{totalStrength} / {totalCapacity}</p>
            <p className="text-xs text-gray-500">{percentage}% filled</p>
          </div>);

    }
  },
  {
    key: 'stream',
    header: 'Stream',
    render: (row: ClassGrade) =>
    <Badge
      variant={
      row.stream === 'Science' ? 'info' :
      row.stream === 'Commerce' ? 'success' :
      row.stream === 'Arts' ? 'warning' :
      row.stream === 'Mixed' ? 'danger' : 'default'
      }>

          {row.stream}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ClassGrade) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ClassGrade) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="Configure Sections"
        onClick={() => {
          setSelectedClass(row);
          setShowSectionConfigModal(true);
        }}>

            <Layers className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit Class"
        onClick={() => handleEditClass(row)}>

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Duplicate"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'duplicateClass',
          targetId: row.id,
          message: `Duplicate "${row.name}" with all its sections?`
        })}>

            <Copy className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Delete"
        className="text-red-500"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'deleteClass',
          targetId: row.id,
          message: `Delete "${row.name}" and all its sections? This action cannot be undone.`
        })}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast.isVisible &&
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'}`
      }>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast((prev) => ({ ...prev, isVisible: false }))}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Confirmation Modal */}
      {confirmModal.isOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-4">{confirmModal.message}</p>
            <div className="flex justify-end gap-2">
              <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' })}>

                Cancel
              </Button>
              <Button
              variant={confirmModal.type === 'duplicateClass' ? 'primary' : 'danger'}
              onClick={() => {
                if (confirmModal.type === 'deleteClass' && confirmModal.targetId) {
                  handleDeleteClass(confirmModal.targetId);
                } else if (confirmModal.type === 'duplicateClass' && confirmModal.targetId) {
                  handleDuplicateClass(confirmModal.targetId);
                } else if (confirmModal.type === 'deleteSection' && confirmModal.targetId && confirmModal.secondaryId) {
                  handleDeleteSection(confirmModal.targetId, confirmModal.secondaryId);
                }
              }}>

                {confirmModal.type === 'duplicateClass' ? 'Duplicate' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Class Modal */}
      {showClassModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Class' : 'Add New Class'}
              </h3>
              <button onClick={() => {
              setShowClassModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetClassForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Class Name *"
                placeholder="e.g., Class 1, Class 10"
                value={classFormData.name}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Input
                label="Display Name"
                placeholder="e.g., Class I, Class X"
                value={classFormData.displayName}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, displayName: e.target.value }))} />

              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Order"
                type="number"
                min={1}
                value={classFormData.order}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))} />

                <Select
                label="Stream"
                options={STREAM_TYPES.map((s) => ({ value: s, label: s }))}
                value={classFormData.stream}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, stream: e.target.value as StreamType }))} />

                <Select
                label="Academic Year"
                options={ACADEMIC_YEARS.map((y) => ({ value: y.name, label: y.name + (y.isCurrent ? ' (Current)' : '') }))}
                value={classFormData.academicYear}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, academicYear: e.target.value }))} />

              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Default Capacity"
                type="number"
                min={1}
                value={classFormData.defaultCapacity}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, defaultCapacity: parseInt(e.target.value) || 40 }))} />

                <Input
                label="Minimum Age"
                type="number"
                min={3}
                value={classFormData.minimumAge}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, minimumAge: parseInt(e.target.value) || 5 }))} />

                <Input
                label="Maximum Age"
                type="number"
                min={3}
                value={classFormData.maximumAge}
                onChange={(e) => setClassFormData((prev) => ({ ...prev, maximumAge: parseInt(e.target.value) || 18 }))} />

              </div>

              <Textarea
              label="Description"
              placeholder="Enter class description"
              value={classFormData.description}
              onChange={(e) => setClassFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2} />


              <Select
              label="Status"
              options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }]
              }
              value={classFormData.status}
              onChange={(e) => setClassFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowClassModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetClassForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateClass : handleCreateClass}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Class' : 'Add Class'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Section Modal */}
      {showSectionModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Section' : 'Add New Section'}
              </h3>
              <button onClick={() => {
              setShowSectionModal(false);
              setIsEditing(false);
              setEditingSectionId(null);
              resetSectionForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Select
              label="Class *"
              options={classes.map((c) => ({ value: c.id.toString(), label: c.name }))}
              value={sectionFormData.classId.toString()}
              onChange={(e) => setSectionFormData((prev) => ({ ...prev, classId: parseInt(e.target.value) }))}
              disabled={isEditing} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Section Name *"
                placeholder="e.g., A, B, Science-A"
                value={sectionFormData.name}
                onChange={(e) => setSectionFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Input
                label="Capacity"
                type="number"
                min={1}
                value={sectionFormData.capacity}
                onChange={(e) => setSectionFormData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 40 }))} />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Class Teacher"
                options={[
                { value: '0', label: 'Select Teacher' },
                ...MOCK_TEACHERS.map((t) => ({ value: t.id.toString(), label: `${t.name} (${t.department})` }))]
                }
                value={sectionFormData.classTeacherId.toString()}
                onChange={(e) => setSectionFormData((prev) => ({ ...prev, classTeacherId: parseInt(e.target.value) }))} />

                <Select
                label="Assigned Room"
                options={[
                { value: '0', label: 'Select Room' },
                ...MOCK_ROOMS.map((r) => ({ value: r.id.toString(), label: `${r.roomNumber} - ${r.name} (${r.capacity})` }))]
                }
                value={sectionFormData.roomId.toString()}
                onChange={(e) => setSectionFormData((prev) => ({ ...prev, roomId: parseInt(e.target.value) }))} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <div className="grid grid-cols-3 gap-2 p-3 border rounded-lg max-h-40 overflow-y-auto">
                  {MOCK_SUBJECTS.map((subject) =>
                <label key={subject.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={sectionFormData.subjects.includes(subject.id)}
                    onChange={() => handleSubjectToggle(subject.id)}
                    className="rounded border-gray-300" />

                      <span className="text-sm">{subject.name}</span>
                    </label>
                )}
                </div>
              </div>

              <Select
              label="Status"
              options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }]
              }
              value={sectionFormData.status}
              onChange={(e) => setSectionFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowSectionModal(false);
              setIsEditing(false);
              setEditingSectionId(null);
              resetSectionForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateSection : handleCreateSection}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Section' : 'Add Section'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Bulk Section Modal */}
      {showBulkSectionModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Bulk Add Sections</h3>
              <button onClick={() => {
              setShowBulkSectionModal(false);
              setBulkSectionData({ classId: 0, sectionNames: 'A, B, C', capacity: 40 });
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Select
              label="Class *"
              options={classes.map((c) => ({ value: c.id.toString(), label: c.name }))}
              value={bulkSectionData.classId.toString()}
              onChange={(e) => setBulkSectionData((prev) => ({ ...prev, classId: parseInt(e.target.value) }))} />


              <Input
              label="Section Names (comma-separated) *"
              placeholder="A, B, C, D"
              value={bulkSectionData.sectionNames}
              onChange={(e) => setBulkSectionData((prev) => ({ ...prev, sectionNames: e.target.value }))} />


              <Input
              label="Default Capacity"
              type="number"
              min={1}
              value={bulkSectionData.capacity}
              onChange={(e) => setBulkSectionData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 40 }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowBulkSectionModal(false);
              setBulkSectionData({ classId: 0, sectionNames: 'A, B, C', capacity: 40 });
            }}>
                Cancel
              </Button>
              <Button onClick={handleBulkCreateSections}>
                <Plus className="w-4 h-4 mr-2" />
                Create Sections
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Section Configuration Modal */}
      {showSectionConfigModal && selectedClass &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Configure Sections - {selectedClass.name}</h3>
                <p className="text-sm text-gray-500">{selectedClass.description}</p>
              </div>
              <button onClick={() => {
              setShowSectionConfigModal(false);
              setSelectedClass(null);
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge variant="default">{selectedClass.sections.length} Sections</Badge>
                <Badge variant="info">
                  {selectedClass.sections.reduce((acc, s) => acc + s.currentStrength, 0)} Students
                </Badge>
                <Badge variant="success">
                  {selectedClass.sections.reduce((acc, s) => acc + s.capacity, 0)} Capacity
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkSectionData({ classId: selectedClass.id, sectionNames: 'A, B, C', capacity: selectedClass.defaultCapacity });
                  setShowBulkSectionModal(true);
                }}>

                  <Plus className="w-4 h-4 mr-2" />
                  Bulk Add
                </Button>
                <Button
                size="sm"
                onClick={() => {
                  setSectionFormData({
                    classId: selectedClass.id,
                    name: '',
                    capacity: selectedClass.defaultCapacity,
                    classTeacherId: 0,
                    roomId: 0,
                    subjects: [],
                    status: 'Active'
                  });
                  setIsEditing(false);
                  setShowSectionModal(true);
                }}>

                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>

            {selectedClass.sections.length === 0 ?
          <div className="py-8 text-center text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No sections configured</p>
                <p className="text-sm">Add sections to this class</p>
              </div> :

          <div className="space-y-3">
                {selectedClass.sections.map((section) =>
            <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">Section {section.name}</h4>
                          <Badge variant={section.status === 'Active' ? 'success' : 'default'}>
                            {section.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Strength</p>
                            <p className="font-medium">{section.currentStrength} / {section.capacity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Class Teacher</p>
                            <p className="font-medium">{section.classTeacherName || 'Not Assigned'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Room</p>
                            <p className="font-medium">{section.roomName || 'Not Assigned'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Subjects</p>
                            <p className="font-medium">{section.subjects.length} subjects</p>
                          </div>
                        </div>

                        {section.subjects.length > 0 &&
                  <div className="mt-2 flex flex-wrap gap-1">
                            {section.subjects.map((subjectId) => {
                      const subject = MOCK_SUBJECTS.find((s) => s.id === subjectId);
                      return subject ?
                      <Badge key={subjectId} variant="default">{subject.code}</Badge> :
                      null;
                    })}
                          </div>
                  }
                      </div>

                      <div className="flex gap-1 ml-4">
                        <Button
                    variant="ghost"
                    size="xs"
                    title="Edit"
                    onClick={() => handleEditSection(selectedClass.id, section)}>

                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                    variant="ghost"
                    size="xs"
                    title="Delete"
                    className="text-red-500"
                    onClick={() => setConfirmModal({
                      isOpen: true,
                      type: 'deleteSection',
                      targetId: selectedClass.id,
                      secondaryId: section.id,
                      message: `Delete section "${section.name}" from ${selectedClass.name}?`
                    })}>

                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
            )}
              </div>
          }

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => {
              setShowSectionConfigModal(false);
              setSelectedClass(null);
            }}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Class & Section Structure
          </h1>
          <p className="text-sm text-gray-500">
            Define hierarchy of classes and sections for the institute
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            setBulkSectionData({ classId: classes[0]?.id || 0, sectionNames: 'A, B, C', capacity: 40 });
            setShowBulkSectionModal(true);
          }}>
            <Layers className="w-4 h-4 mr-2" />
            Bulk Add Sections
          </Button>
          <Button onClick={() => {
            resetClassForm();
            setIsEditing(false);
            setShowClassModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <GraduationCap className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{stats.totalClasses}</p>
            <p className="text-xs text-gray-500">Total Classes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Layers className="w-6 h-6 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{stats.totalSections}</p>
            <p className="text-xs text-gray-500">Total Sections</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{stats.totalStrength.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Students</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <DoorOpen className="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Capacity</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{stats.activeClasses}</p>
            <p className="text-xs text-gray-500">Active Classes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-1 text-indigo-500" />
            <p className="text-2xl font-bold">{stats.activeSections}</p>
            <p className="text-xs text-gray-500">Active Sections</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg" />

              </div>
            </div>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="border rounded-lg px-3 py-2">

              {ACADEMIC_YEARS.map((year) =>
              <option key={year.id} value={year.name}>
                  {year.name} {year.isCurrent ? '(Current)' : ''}
                </option>
              )}
            </select>
            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
              className="border rounded-lg px-3 py-2">

              <option value="All">All Streams</option>
              {STREAM_TYPES.map((stream) =>
              <option key={stream} value={stream}>{stream}</option>
              )}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2">

              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Classes Table */}
      <Card>
        {filteredClasses.length === 0 ?
        <div className="p-8 text-center text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-sm">Add classes to define your institution's structure</p>
          </div> :

        <Table columns={columns} data={filteredClasses} />
        }
      </Card>

      {/* Quick Summary */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Class Structure Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredClasses.map((classItem) =>
          <div
            key={classItem.id}
            className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setSelectedClass(classItem);
              setShowSectionConfigModal(true);
            }}>

              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">{classItem.name}</p>
                <Badge variant={classItem.status === 'Active' ? 'success' : 'default'}>
                  {classItem.sections.length}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                {classItem.sections.reduce((acc, s) => acc + s.currentStrength, 0)} / {classItem.sections.reduce((acc, s) => acc + s.capacity, 0)} students
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {classItem.sections.slice(0, 3).map((s) =>
              <span key={s.id} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{s.name}</span>
              )}
                {classItem.sections.length > 3 &&
              <span className="text-xs text-gray-400">+{classItem.sections.length - 3}</span>
              }
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}