import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  Printer,
  Send,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  AlertCircle,
  X,
  Eye,
  RefreshCw,
  Bell,
  Users,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  GraduationCap,
  User,
  UserCheck,
  CalendarDays,
  ClipboardCheck } from
'lucide-react';

// ============================================
// Types
// ============================================

type FormStatus = 'Not Filled' | 'Submitted';
type FeeStatus = 'Not Paid' | 'Paid';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
type ReExamStatus = 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
type ReExamReason = 'Failed' | 'Improvement' | 'On Leave';

interface ReExamStudent {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  admissionNo: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  contactNo: string;
  email: string;
  address: string;
  failedSubjects: string[];
  reExamReason: ReExamReason;
  formStatus: FormStatus;
  feeStatus: FeeStatus;
  paymentAmount: number;
  approvalStatus: ApprovalStatus;
  parentPhone: string;
  parentEmail: string;
  photo: string | null;
  assignedExamId: string | null;
  formSubmittedDate: string | null;
  feePaidDate: string | null;
  approvedDate: string | null;
  remarks: string;
  seatNo: string | null;
}

interface ReExam {
  id: string;
  examName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  roomNo: string;
  invigilator: string;
  invigilatorContact: string;
  status: ReExamStatus;
  assignedStudents: string[];
  createdAt: string;
  instructions: string[];
}

interface ApplicationFormData {
  studentName: string;
  admissionNo: string;
  classSection: string;
  rollNo: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  contactNo: string;
  address: string;
  reason: ReExamReason | '';
  subjects: {name: string;marksObtained: string;}[];
}

// ============================================
// Mock Data
// ============================================

const mockStudents: ReExamStudent[] = [
{
  id: '1',
  name: 'Arjun Sharma',
  rollNo: '05',
  class: 'X',
  section: 'A',
  admissionNo: 'ADM/2020/1005',
  fatherName: 'Rajesh Sharma',
  motherName: 'Sunita Sharma',
  dateOfBirth: '2008-05-15',
  contactNo: '9876543210',
  email: 'arjun.sharma@email.com',
  address: '123, Sector 15, Gurugram',
  failedSubjects: ['Mathematics', 'Science'],
  reExamReason: 'Failed',
  formStatus: 'Not Filled',
  feeStatus: 'Not Paid',
  paymentAmount: 500,
  approvalStatus: 'Pending',
  parentPhone: '9876543210',
  parentEmail: 'arjun.parent@email.com',
  photo: null,
  assignedExamId: null,
  formSubmittedDate: null,
  feePaidDate: null,
  approvedDate: null,
  remarks: '',
  seatNo: null
},
{
  id: '2',
  name: 'Priya Patel',
  rollNo: '12',
  class: 'X',
  section: 'A',
  admissionNo: 'ADM/2020/1012',
  fatherName: 'Amit Patel',
  motherName: 'Kavita Patel',
  dateOfBirth: '2008-08-22',
  contactNo: '9876543211',
  email: 'priya.patel@email.com',
  address: '456, Sector 22, Gurugram',
  failedSubjects: ['English'],
  reExamReason: 'Improvement',
  formStatus: 'Submitted',
  feeStatus: 'Not Paid',
  paymentAmount: 250,
  approvalStatus: 'Pending',
  parentPhone: '9876543211',
  parentEmail: 'priya.parent@email.com',
  photo: null,
  assignedExamId: null,
  formSubmittedDate: '2025-01-10',
  feePaidDate: null,
  approvedDate: null,
  remarks: '',
  seatNo: null
},
{
  id: '3',
  name: 'Rahul Verma',
  rollNo: '18',
  class: 'X',
  section: 'B',
  admissionNo: 'ADM/2020/1018',
  fatherName: 'Suresh Verma',
  motherName: 'Meena Verma',
  dateOfBirth: '2008-03-10',
  contactNo: '9876543212',
  email: 'rahul.verma@email.com',
  address: '789, Sector 30, Gurugram',
  failedSubjects: ['Hindi', 'Social Studies'],
  reExamReason: 'Failed',
  formStatus: 'Submitted',
  feeStatus: 'Paid',
  paymentAmount: 500,
  approvalStatus: 'Pending',
  parentPhone: '9876543212',
  parentEmail: 'rahul.parent@email.com',
  photo: null,
  assignedExamId: null,
  formSubmittedDate: '2025-01-08',
  feePaidDate: '2025-01-12',
  approvedDate: null,
  remarks: '',
  seatNo: null
},
{
  id: '4',
  name: 'Sneha Reddy',
  rollNo: '22',
  class: 'X',
  section: 'B',
  admissionNo: 'ADM/2020/1022',
  fatherName: 'Krishna Reddy',
  motherName: 'Lakshmi Reddy',
  dateOfBirth: '2008-11-28',
  contactNo: '9876543213',
  email: 'sneha.reddy@email.com',
  address: '321, Sector 45, Gurugram',
  failedSubjects: ['Mathematics'],
  reExamReason: 'Failed',
  formStatus: 'Submitted',
  feeStatus: 'Paid',
  paymentAmount: 250,
  approvalStatus: 'Approved',
  parentPhone: '9876543213',
  parentEmail: 'sneha.parent@email.com',
  photo: null,
  assignedExamId: 'RE001',
  formSubmittedDate: '2025-01-05',
  feePaidDate: '2025-01-07',
  approvedDate: '2025-01-10',
  remarks: '',
  seatNo: 'A-01'
},
{
  id: '5',
  name: 'Karan Mehta',
  rollNo: '07',
  class: 'IX',
  section: 'A',
  admissionNo: 'ADM/2021/2007',
  fatherName: 'Vikram Mehta',
  motherName: 'Neha Mehta',
  dateOfBirth: '2009-07-19',
  contactNo: '9876543214',
  email: 'karan.mehta@email.com',
  address: '654, Sector 50, Gurugram',
  failedSubjects: ['Physics', 'Chemistry', 'Mathematics'],
  reExamReason: 'On Leave',
  formStatus: 'Not Filled',
  feeStatus: 'Not Paid',
  paymentAmount: 750,
  approvalStatus: 'Pending',
  parentPhone: '9876543214',
  parentEmail: 'karan.parent@email.com',
  photo: null,
  assignedExamId: null,
  formSubmittedDate: null,
  feePaidDate: null,
  approvedDate: null,
  remarks: '',
  seatNo: null
},
{
  id: '6',
  name: 'Ananya Iyer',
  rollNo: '03',
  class: 'IX',
  section: 'A',
  admissionNo: 'ADM/2021/2003',
  fatherName: 'Ramesh Iyer',
  motherName: 'Padma Iyer',
  dateOfBirth: '2009-01-05',
  contactNo: '9876543215',
  email: 'ananya.iyer@email.com',
  address: '987, Sector 55, Gurugram',
  failedSubjects: ['English'],
  reExamReason: 'Improvement',
  formStatus: 'Submitted',
  feeStatus: 'Paid',
  paymentAmount: 250,
  approvalStatus: 'Approved',
  parentPhone: '9876543215',
  parentEmail: 'ananya.parent@email.com',
  photo: null,
  assignedExamId: 'RE001',
  formSubmittedDate: '2025-01-06',
  feePaidDate: '2025-01-08',
  approvedDate: '2025-01-11',
  remarks: '',
  seatNo: 'A-02'
},
{
  id: '7',
  name: 'Vikash Kumar',
  rollNo: '15',
  class: 'X',
  section: 'A',
  admissionNo: 'ADM/2020/1015',
  fatherName: 'Manoj Kumar',
  motherName: 'Rani Devi',
  dateOfBirth: '2008-09-12',
  contactNo: '9876543216',
  email: 'vikash.kumar@email.com',
  address: '111, Sector 60, Gurugram',
  failedSubjects: ['Science', 'Mathematics'],
  reExamReason: 'Failed',
  formStatus: 'Submitted',
  feeStatus: 'Paid',
  paymentAmount: 500,
  approvalStatus: 'Approved',
  parentPhone: '9876543216',
  parentEmail: 'vikash.parent@email.com',
  photo: null,
  assignedExamId: null,
  formSubmittedDate: '2025-01-09',
  feePaidDate: '2025-01-11',
  approvedDate: '2025-01-13',
  remarks: '',
  seatNo: null
},
{
  id: '8',
  name: 'Meera Singh',
  rollNo: '20',
  class: 'X',
  section: 'B',
  admissionNo: 'ADM/2020/1020',
  fatherName: 'Harinder Singh',
  motherName: 'Gurpreet Kaur',
  dateOfBirth: '2008-04-25',
  contactNo: '9876543217',
  email: 'meera.singh@email.com',
  address: '222, Sector 65, Gurugram',
  failedSubjects: ['Hindi'],
  reExamReason: 'Failed',
  formStatus: 'Submitted',
  feeStatus: 'Paid',
  paymentAmount: 250,
  approvalStatus: 'Approved',
  parentPhone: '9876543217',
  parentEmail: 'meera.parent@email.com',
  photo: null,
  assignedExamId: null,
  formSubmittedDate: '2025-01-07',
  feePaidDate: '2025-01-09',
  approvedDate: '2025-01-12',
  remarks: '',
  seatNo: null
}];


const mockReExams: ReExam[] = [
{
  id: 'RE001',
  examName: 'Re-Examination - February 2025',
  date: '2025-02-15',
  startTime: '10:00 AM',
  endTime: '01:00 PM',
  duration: '3 Hours',
  roomNo: 'Hall A',
  invigilator: 'Mr. Rajesh Kumar',
  invigilatorContact: '9876543220',
  status: 'Scheduled',
  assignedStudents: ['4', '6'],
  createdAt: '2025-01-15',
  instructions: [
  'Bring your hall ticket and ID card',
  'No electronic devices allowed',
  'Use only blue/black pen',
  'Students will receive question papers based on their failed subjects']

}];


const roomOptions = ['Hall A', 'Hall B', 'Hall C', 'Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 203'];

const subjectOptions = [
'Mathematics',
'Science',
'English',
'Hindi',
'Social Studies',
'Physics',
'Chemistry',
'Biology',
'Computer Science',
'Sanskrit'];


// ============================================
// UI Components
// ============================================

const Card: React.FC<{children: React.ReactNode;className?: string;onClick?: () => void;}> = ({
  children,
  className = '',
  onClick
}) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button' }) => {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-white',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500'
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}>

      {children}
    </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>

      {children}
    </span>);

};

const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  name?: string;
}> = ({ value, onChange, placeholder, type = 'text', className = '', icon, disabled = false, name }) =>
<div className="relative">
    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
    <input
    type={type}
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${icon ? 'pl-10' : ''} ${className}`} />

  </div>;


const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: {value: string;label: string;}[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}> = ({ value, onChange, options, placeholder = 'Select...', className = '', disabled = false }) =>
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  disabled={disabled}
  className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}>

    <option value="">{placeholder}</option>
    {options.map((opt) =>
  <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
  )}
  </select>;


const TextArea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, className = '', rows = 3, disabled = false }) =>
<textarea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
  rows={rows}
  disabled={disabled}
  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${className}`} />;



// ============================================
// Main Component
// ============================================

export function ReExamStudentManagement() {
  // State
  const [activeTab, setActiveTab] = useState<'students' | 'schedule'>('students');
  const [students, setStudents] = useState<ReExamStudent[]>(mockStudents);
  const [reExams, setReExams] = useState<ReExam[]>(mockReExams);

  // Student Management State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterReason, setFilterReason] = useState('');

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState(false);
  const [showApplicationFormModal, setShowApplicationFormModal] = useState(false);

  // Selected Items
  const [selectedStudent, setSelectedStudent] = useState<ReExamStudent | null>(null);
  const [selectedExam, setSelectedExam] = useState<ReExam | null>(null);
  const [selectedStudentsForAssignment, setSelectedStudentsForAssignment] = useState<Set<string>>(new Set());

  // Payment State
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptGenerated, setReceiptGenerated] = useState(false);

  // Create Exam State
  const [newExam, setNewExam] = useState<Partial<ReExam>>({
    examName: '',
    date: '',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    duration: '3 Hours',
    roomNo: '',
    invigilator: '',
    invigilatorContact: '',
    instructions: []
  });

  // Seat Assignment State
  const [seatAssignments, setSeatAssignments] = useState<Record<string, string>>({});

  // Application Form State
  const initialFormData: ApplicationFormData = {
    studentName: '',
    admissionNo: '',
    classSection: '',
    rollNo: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    contactNo: '',
    address: '',
    reason: '',
    subjects: [{ name: '', marksObtained: '' }]
  };
  const [applicationForm, setApplicationForm] = useState<ApplicationFormData>(initialFormData);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (
      searchQuery &&
      !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.rollNo.includes(searchQuery))

      return false;
      if (filterClass && s.class !== filterClass) return false;
      if (filterSection && s.section !== filterSection) return false;
      if (filterReason && s.reExamReason !== filterReason) return false;
      if (filterStatus === 'form-not-filled' && s.formStatus !== 'Not Filled') return false;
      if (filterStatus === 'fee-not-paid' && !(s.formStatus === 'Submitted' && s.feeStatus === 'Not Paid'))
      return false;
      if (filterStatus === 'pending-approval' && !(s.feeStatus === 'Paid' && s.approvalStatus === 'Pending'))
      return false;
      if (filterStatus === 'approved' && s.approvalStatus !== 'Approved') return false;
      if (filterStatus === 'assigned' && !s.assignedExamId) return false;
      if (filterStatus === 'not-assigned' && (s.approvalStatus !== 'Approved' || s.assignedExamId))
      return false;
      return true;
    });
  }, [students, searchQuery, filterClass, filterSection, filterStatus, filterReason]);

  // Approved students not yet assigned to any exam
  const eligibleForAssignment = useMemo(() => {
    return students.filter((s) => s.approvalStatus === 'Approved' && !s.assignedExamId);
  }, [students]);

  // Stats
  const stats = useMemo(
    () => ({
      total: students.length,
      formNotFilled: students.filter((s) => s.formStatus === 'Not Filled').length,
      feeNotPaid: students.filter((s) => s.formStatus === 'Submitted' && s.feeStatus === 'Not Paid').length,
      pendingApproval: students.filter((s) => s.feeStatus === 'Paid' && s.approvalStatus === 'Pending').length,
      approved: students.filter((s) => s.approvalStatus === 'Approved').length,
      assigned: students.filter((s) => s.approvalStatus === 'Approved' && s.assignedExamId).length,
      notAssigned: students.filter((s) => s.approvalStatus === 'Approved' && !s.assignedExamId).length
    }),
    [students]
  );

  // Handlers
  const handlePayFee = (student: ReExamStudent) => {
    setSelectedStudent(student);
    setReceiptGenerated(false);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedStudent) return;
    setStudents((prev) =>
    prev.map((s) =>
    s.id === selectedStudent.id ?
    {
      ...s,
      feeStatus: 'Paid' as FeeStatus,
      feePaidDate: new Date().toISOString().split('T')[0]
    } :
    s
    )
    );
    setReceiptGenerated(true);
  };

  const handleApprove = (studentId: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === studentId ?
    {
      ...s,
      approvalStatus: 'Approved' as ApprovalStatus,
      approvedDate: new Date().toISOString().split('T')[0]
    } :
    s
    )
    );
  };

  const handleReject = (studentId: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === studentId ?
    {
      ...s,
      approvalStatus: 'Rejected' as ApprovalStatus
    } :
    s
    )
    );
  };

  const handleCreateExam = () => {
    if (!newExam.date || !newExam.roomNo) {
      alert('Please fill all required fields');
      return;
    }

    const exam: ReExam = {
      id: `RE${Date.now()}`,
      examName: newExam.examName || `Re-Examination - ${newExam.date}`,
      date: newExam.date!,
      startTime: newExam.startTime || '10:00 AM',
      endTime: newExam.endTime || '01:00 PM',
      duration: newExam.duration || '3 Hours',
      roomNo: newExam.roomNo!,
      invigilator: newExam.invigilator || '',
      invigilatorContact: newExam.invigilatorContact || '',
      status: 'Scheduled',
      assignedStudents: [],
      createdAt: new Date().toISOString().split('T')[0],
      instructions: [
      'Bring your hall ticket and ID card',
      'No electronic devices allowed',
      'Use only blue/black pen',
      'Students will receive question papers based on their failed subjects']

    };

    setReExams((prev) => [...prev, exam]);
    setShowCreateExamModal(false);
    setNewExam({
      examName: '',
      date: '',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      duration: '3 Hours',
      roomNo: '',
      invigilator: '',
      invigilatorContact: '',
      instructions: []
    });
  };

  const handleAddStudentsToExam = () => {
    if (!selectedExam || selectedStudentsForAssignment.size === 0) return;

    // Check if all selected students have seat assignments
    const missingSeats = Array.from(selectedStudentsForAssignment).filter((id) => !seatAssignments[id]);
    if (missingSeats.length > 0) {
      alert('Please assign seat numbers to all selected students');
      return;
    }

    // Update exam with assigned students
    setReExams((prev) =>
    prev.map((exam) =>
    exam.id === selectedExam.id ?
    {
      ...exam,
      assignedStudents: [...exam.assignedStudents, ...Array.from(selectedStudentsForAssignment)]
    } :
    exam
    )
    );

    // Update students with assigned exam and seat number
    setStudents((prev) =>
    prev.map((student) =>
    selectedStudentsForAssignment.has(student.id) ?
    {
      ...student,
      assignedExamId: selectedExam.id,
      seatNo: seatAssignments[student.id]
    } :
    student
    )
    );

    setShowAddStudentsModal(false);
    setSelectedStudentsForAssignment(new Set());
    setSeatAssignments({});
  };

  const handleRemoveStudentFromExam = (examId: string, studentId: string) => {
    // Remove from exam
    setReExams((prev) =>
    prev.map((exam) =>
    exam.id === examId ?
    {
      ...exam,
      assignedStudents: exam.assignedStudents.filter((id) => id !== studentId)
    } :
    exam
    )
    );

    // Update student
    setStudents((prev) =>
    prev.map((student) =>
    student.id === studentId ?
    {
      ...student,
      assignedExamId: null,
      seatNo: null
    } :
    student
    )
    );
  };

  const handleDeleteExam = (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    // Remove exam assignment from students
    setStudents((prev) =>
    prev.map((student) =>
    student.assignedExamId === examId ?
    {
      ...student,
      assignedExamId: null,
      seatNo: null
    } :
    student
    )
    );

    // Delete exam
    setReExams((prev) => prev.filter((exam) => exam.id !== examId));
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentsForAssignment((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  // Application Form Handlers
  const handleAddSubject = () => {
    setApplicationForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: '', marksObtained: '' }]
    }));
  };

  const handleRemoveSubject = (index: number) => {
    setApplicationForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubjectChange = (index: number, field: 'name' | 'marksObtained', value: string) => {
    setApplicationForm((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub, i) => i === index ? { ...sub, [field]: value } : sub)
    }));
  };

  const handleSubmitApplication = () => {
    // Validate form
    if (!applicationForm.studentName || !applicationForm.admissionNo || !applicationForm.classSection || !applicationForm.rollNo) {
      alert('Please fill all required student details');
      return;
    }
    if (!applicationForm.reason) {
      alert('Please select a reason for re-examination');
      return;
    }
    if (applicationForm.subjects.length === 0 || !applicationForm.subjects[0].name) {
      alert('Please add at least one subject');
      return;
    }

    // Create new student entry
    const newStudent: ReExamStudent = {
      id: `STU${Date.now()}`,
      name: applicationForm.studentName,
      rollNo: applicationForm.rollNo,
      class: applicationForm.classSection.split('-')[0] || '',
      section: applicationForm.classSection.split('-')[1] || 'A',
      admissionNo: applicationForm.admissionNo,
      fatherName: applicationForm.fatherName,
      motherName: applicationForm.motherName,
      dateOfBirth: applicationForm.dateOfBirth,
      contactNo: applicationForm.contactNo,
      email: '',
      address: applicationForm.address,
      failedSubjects: applicationForm.subjects.filter((s) => s.name).map((s) => s.name),
      reExamReason: applicationForm.reason as ReExamReason,
      formStatus: 'Submitted',
      feeStatus: 'Not Paid',
      paymentAmount: applicationForm.subjects.filter((s) => s.name).length * 250,
      approvalStatus: 'Pending',
      parentPhone: applicationForm.contactNo,
      parentEmail: '',
      photo: null,
      assignedExamId: null,
      formSubmittedDate: new Date().toISOString().split('T')[0],
      feePaidDate: null,
      approvedDate: null,
      remarks: '',
      seatNo: null
    };

    setStudents((prev) => [...prev, newStudent]);
    setFormSubmitted(true);
  };

  const handlePrintForm = () => {
    window.print();
  };

  const handleDownloadForm = () => {
    alert('Form download functionality would be implemented here');
  };

  const handleResetForm = () => {
    setApplicationForm(initialFormData);
    setFormSubmitted(false);
  };

  const handleCloseApplicationForm = () => {
    setShowApplicationFormModal(false);
    setApplicationForm(initialFormData);
    setFormSubmitted(false);
  };

  const calculateTotalFee = () => {
    return applicationForm.subjects.filter((s) => s.name).length * 250;
  };

  const getStatusBadge = (student: ReExamStudent) => {
    if (student.approvalStatus === 'Approved' && student.assignedExamId)
    return (
      <Badge variant="purple">
          <ClipboardCheck className="w-3 h-3" />
          Assigned
        </Badge>);

    if (student.approvalStatus === 'Approved')
    return (
      <Badge variant="success">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>);

    if (student.approvalStatus === 'Rejected')
    return (
      <Badge variant="danger">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>);

    if (student.feeStatus === 'Paid')
    return (
      <Badge variant="info">
          <Clock className="w-3 h-3" />
          Pending Approval
        </Badge>);

    if (student.formStatus === 'Submitted')
    return (
      <Badge variant="warning">
          <AlertCircle className="w-3 h-3" />
          Fee Pending
        </Badge>);

    return (
      <Badge variant="default">
        <FileText className="w-3 h-3" />
        Form Pending
      </Badge>);

  };

  const getReasonBadge = (reason: ReExamReason) => {
    switch (reason) {
      case 'Failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'Improvement':
        return <Badge variant="info">Improvement</Badge>;
      case 'On Leave':
        return <Badge variant="warning">On Leave</Badge>;
    }
  };

  const getExamStatusBadge = (status: ReExamStatus) => {
    switch (status) {
      case 'Scheduled':
        return (
          <Badge variant="info">
            <Calendar className="w-3 h-3" />
            Scheduled
          </Badge>);

      case 'Ongoing':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Ongoing
          </Badge>);

      case 'Completed':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>);

      case 'Cancelled':
        return (
          <Badge variant="danger">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>);

    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-blue-600" />
              Re-Examination Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage student applications, fees, approvals, and exam scheduling
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={() => setShowApplicationFormModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Application Form
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Send Reminders
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-gray-200 w-fit">
          {[
          { id: 'students', label: 'Student Management', icon: Users },
          { id: 'schedule', label: 'Re-Exam Schedule', icon: CalendarDays }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }>

              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Student Management Tab */}
      {activeTab === 'students' &&
      <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card className="p-4 cursor-pointer hover:border-gray-300" onClick={() => setFilterStatus('')}>
              <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </Card>
            <Card
            className="p-4 cursor-pointer hover:border-gray-400"
            onClick={() => setFilterStatus('form-not-filled')}>

              <p className="text-xs text-gray-500 uppercase font-medium">Form Pending</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{stats.formNotFilled}</p>
            </Card>
            <Card
            className="p-4 cursor-pointer hover:border-orange-300"
            onClick={() => setFilterStatus('fee-not-paid')}>

              <p className="text-xs text-orange-600 uppercase font-medium">Fee Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.feeNotPaid}</p>
            </Card>
            <Card
            className="p-4 cursor-pointer hover:border-blue-300"
            onClick={() => setFilterStatus('pending-approval')}>

              <p className="text-xs text-blue-600 uppercase font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pendingApproval}</p>
            </Card>
            <Card
            className="p-4 cursor-pointer hover:border-green-300"
            onClick={() => setFilterStatus('approved')}>

              <p className="text-xs text-green-600 uppercase font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </Card>
            <Card
            className="p-4 cursor-pointer hover:border-purple-300"
            onClick={() => setFilterStatus('assigned')}>

              <p className="text-xs text-purple-600 uppercase font-medium">Assigned</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.assigned}</p>
            </Card>
            <Card
            className="p-4 cursor-pointer hover:border-red-300"
            onClick={() => setFilterStatus('not-assigned')}>

              <p className="text-xs text-red-600 uppercase font-medium">Not Assigned</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.notAssigned}</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by student name or roll no..."
                icon={<Search className="w-4 h-4" />} />

              </div>
              <Select
              value={filterClass}
              onChange={setFilterClass}
              options={['IX', 'X', 'XI', 'XII'].map((c) => ({ value: c, label: `Class ${c}` }))}
              placeholder="All Classes"
              className="w-36" />

              <Select
              value={filterSection}
              onChange={setFilterSection}
              options={['A', 'B', 'C', 'D'].map((s) => ({ value: s, label: `Section ${s}` }))}
              placeholder="All Sections"
              className="w-40" />

              <Select
              value={filterReason}
              onChange={setFilterReason}
              options={[
              { value: 'Failed', label: 'Failed' },
              { value: 'Improvement', label: 'Improvement' },
              { value: 'On Leave', label: 'On Leave' }]
              }
              placeholder="All Reasons"
              className="w-40" />

              <Select
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
              { value: 'form-not-filled', label: 'Form Not Filled' },
              { value: 'fee-not-paid', label: 'Fee Not Paid' },
              { value: 'pending-approval', label: 'Pending Approval' },
              { value: 'approved', label: 'Approved' },
              { value: 'assigned', label: 'Assigned to Exam' },
              { value: 'not-assigned', label: 'Not Assigned' }]
              }
              placeholder="All Status"
              className="w-44" />

              <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSearchQuery('');
                setFilterClass('');
                setFilterSection('');
                setFilterStatus('');
                setFilterReason('');
              }}>

                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Student Table */}
          <Card className="overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Re-Exam Eligible Students ({filteredStudents.length})
              </h3>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print List
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">Class</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Subjects
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Reason</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Form</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Fee</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) =>
                <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">Roll No: {student.rollNo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        Class {student.class}-{student.section}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {student.failedSubjects.map((sub) =>
                      <span
                        key={sub}
                        className="inline-block px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">

                              {sub}
                            </span>
                      )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{getReasonBadge(student.reExamReason)}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${student.formStatus === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>

                          {student.formStatus === 'Submitted' ?
                      <CheckCircle className="w-3 h-3" /> :

                      <Clock className="w-3 h-3" />
                      }
                          {student.formStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${student.feeStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>

                          {student.feeStatus === 'Paid' ?
                      <CheckCircle className="w-3 h-3" /> :

                      <AlertCircle className="w-3 h-3" />
                      }
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-medium text-gray-900">
                        ₹{student.paymentAmount}
                      </td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(student)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {student.formStatus === 'Not Filled' &&
                      <Button
                        variant="warning"
                        size="xs"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowMessageModal(true);
                        }}>

                              <MessageSquare className="w-3 h-3 mr-1" />
                              Remind
                            </Button>
                      }
                          {student.formStatus === 'Submitted' && student.feeStatus === 'Not Paid' &&
                      <Button variant="warning" size="xs" onClick={() => handlePayFee(student)}>
                              <CreditCard className="w-3 h-3 mr-1" />
                              Collect Fee
                            </Button>
                      }
                          {student.feeStatus === 'Paid' && student.approvalStatus === 'Pending' &&
                      <>
                              <Button variant="success" size="xs" onClick={() => handleApprove(student.id)}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button variant="danger" size="xs" onClick={() => handleReject(student.id)}>
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </>
                      }
                          {student.approvalStatus === 'Approved' && student.assignedExamId &&
                      <div className="flex items-center gap-2">
                              <Badge variant="purple">Seat: {student.seatNo}</Badge>
                              <Button variant="outline" size="xs">
                                <Eye className="w-3 h-3 mr-1" />
                                Hall Ticket
                              </Button>
                            </div>
                      }
                          {student.approvalStatus === 'Approved' && !student.assignedExamId &&
                      <Badge variant="warning">
                              <Clock className="w-3 h-3" />
                              Awaiting Assignment
                            </Badge>
                      }
                          {student.approvalStatus === 'Rejected' &&
                      <span className="text-xs text-red-500 font-medium">Rejected</span>
                      }
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
              {filteredStudents.length === 0 &&
            <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No students found matching the filters</p>
                </div>
            }
            </div>
          </Card>
        </div>
      }

      {/* Re-Exam Schedule Tab */}
      {activeTab === 'schedule' &&
      <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Scheduled Re-Examinations</h2>
              <p className="text-sm text-gray-500">
                Create and manage re-exam schedules. All students sit together regardless of subjects.
              </p>
            </div>
            <Button variant="primary" onClick={() => setShowCreateExamModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Re-Exam
            </Button>
          </div>

          {/* Exam List */}
          <div className="space-y-6">
            {reExams.map((exam) => {
            const assignedStudentsList = students.filter((s) => exam.assignedStudents.includes(s.id));
            return (
              <Card key={exam.id} className="overflow-hidden">
                  <div
                  className={`p-4 border-b ${
                  exam.status === 'Scheduled' ?
                  'bg-blue-50 border-blue-200' :
                  exam.status === 'Completed' ?
                  'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'}`
                  }>

                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{exam.examName}</h3>
                        <p className="text-sm text-gray-600">
                          All students will receive question papers based on their individual failed subjects
                        </p>
                      </div>
                      {getExamStatusBadge(exam.status)}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{exam.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {exam.startTime} - {exam.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{exam.roomNo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{exam.invigilator || 'Not Assigned'}</span>
                      </div>
                    </div>

                    {/* Assigned Students Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Assigned Students ({assignedStudentsList.length})
                        </span>
                        <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                          setSelectedExam(exam);
                          setShowAddStudentsModal(true);
                        }}>

                          <Plus className="w-3 h-3 mr-1" />
                          Add Students
                        </Button>
                      </div>
                      {assignedStudentsList.length > 0 ?
                    <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Seat
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Student Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Class
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Roll No
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Subjects
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Reason
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {assignedStudentsList.map((student) =>
                        <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-mono font-medium text-blue-600">
                                  {student.seatNo}
                                </td>
                                <td className="px-4 py-2 font-medium">{student.name}</td>
                                <td className="px-4 py-2">
                                  {student.class}-{student.section}
                                </td>
                                <td className="px-4 py-2 font-mono">{student.rollNo}</td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-wrap gap-1">
                                    {student.failedSubjects.map((sub) =>
                              <span
                                key={sub}
                                className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">

                                        {sub}
                                      </span>
                              )}
                                  </div>
                                </td>
                                <td className="px-4 py-2">{getReasonBadge(student.reExamReason)}</td>
                                <td className="px-4 py-2 text-center">
                                  <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleRemoveStudentFromExam(exam.id, student.id)}>

                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </td>
                              </tr>
                        )}
                          </tbody>
                        </table> :

                    <div className="p-8 text-center text-gray-500">
                          <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p>No students assigned yet</p>
                          <p className="text-sm">Click "Add Students" to assign students to this exam</p>
                        </div>
                    }
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedExam(exam);
                      setShowExamDetailsModal(true);
                    }}>

                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-1" />
                        Print Seating
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download List
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExam(exam.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>);

          })}

            {reExams.length === 0 &&
          <Card className="p-12 text-center">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-700">No Re-Exams Scheduled</p>
                <p className="text-sm text-gray-500 mt-1">Create a new re-exam to get started</p>
                <Button variant="primary" className="mt-4" onClick={() => setShowCreateExamModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Re-Exam
                </Button>
              </Card>
          }
          </div>
        </div>
      }

      {/* Application Form Modal */}
      {showApplicationFormModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Re-Examination Application Form</h2>
                  <p className="text-sm text-blue-100">Academic Year 2024-25</p>
                </div>
              </div>
              <button
              onClick={handleCloseApplicationForm}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors">

                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {formSubmitted ?
            <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h3>
                  <p className="text-gray-500 mb-6">
                    Your re-examination application has been submitted. Please pay the fee to complete the process.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto text-left space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Student Name:</span>
                      <span className="font-medium">{applicationForm.studentName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Subjects:</span>
                      <span className="font-medium">{applicationForm.subjects.filter((s) => s.name).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Fee:</span>
                      <span className="font-bold text-blue-600">₹{calculateTotalFee()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={handleResetForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Another
                    </Button>
                    <Button variant="primary" onClick={handleCloseApplicationForm}>
                      Close
                    </Button>
                  </div>
                </div> :

            <div className="space-y-6">
                  {/* School Header */}
                  <div className="text-center pb-4 border-b-2 border-gray-300 print:border-black">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">DELHI PUBLIC SCHOOL</h1>
                        <p className="text-sm text-gray-600">Sector 15, Gurugram, Haryana - 122001</p>
                        <p className="text-xs text-gray-500">CBSE Affiliation No: 2730125</p>
                      </div>
                    </div>
                  </div>

                  {/* Section A: Student Details */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 bg-blue-50 px-3 py-2 rounded mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      SECTION A: STUDENT DETAILS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                      value={applicationForm.studentName}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, studentName: value }))}
                      placeholder="Enter full name" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admission No <span className="text-red-500">*</span>
                        </label>
                        <Input
                      value={applicationForm.admissionNo}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, admissionNo: value }))}
                      placeholder="e.g., ADM/2020/1001" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class & Section <span className="text-red-500">*</span>
                        </label>
                        <Select
                      value={applicationForm.classSection}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, classSection: value }))}
                      options={[
                      { value: 'IX-A', label: 'Class IX - A' },
                      { value: 'IX-B', label: 'Class IX - B' },
                      { value: 'IX-C', label: 'Class IX - C' },
                      { value: 'X-A', label: 'Class X - A' },
                      { value: 'X-B', label: 'Class X - B' },
                      { value: 'X-C', label: 'Class X - C' },
                      { value: 'XI-A', label: 'Class XI - A' },
                      { value: 'XI-B', label: 'Class XI - B' },
                      { value: 'XII-A', label: 'Class XII - A' },
                      { value: 'XII-B', label: 'Class XII - B' }]
                      }
                      placeholder="Select class & section" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Roll Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                      value={applicationForm.rollNo}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, rollNo: value }))}
                      placeholder="Enter roll number" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                        <Input
                      value={applicationForm.fatherName}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, fatherName: value }))}
                      placeholder="Enter father's name" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                        <Input
                      value={applicationForm.motherName}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, motherName: value }))}
                      placeholder="Enter mother's name" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <Input
                      type="date"
                      value={applicationForm.dateOfBirth}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, dateOfBirth: value }))} />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <Input
                      value={applicationForm.contactNo}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, contactNo: value }))}
                      placeholder="Enter contact number" />

                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <TextArea
                      value={applicationForm.address}
                      onChange={(value) => setApplicationForm((prev) => ({ ...prev, address: value }))}
                      placeholder="Enter complete address"
                      rows={2} />

                      </div>
                    </div>
                  </div>

                  {/* Section B: Reason for Re-Exam */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 bg-blue-50 px-3 py-2 rounded mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      SECTION B: REASON FOR RE-EXAMINATION <span className="text-red-500">*</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                  { value: 'Failed', label: 'Failed', desc: 'Did not pass in subject(s)', color: 'red' },
                  { value: 'Improvement', label: 'Improvement', desc: 'Want to improve marks', color: 'blue' },
                  { value: 'On Leave', label: 'On Leave', desc: 'Was absent during exam', color: 'yellow' }].
                  map((option) =>
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    applicationForm.reason === option.value ?
                    `border-${option.color}-500 bg-${option.color}-50` :
                    'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`
                    }>

                          <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={applicationForm.reason === option.value}
                      onChange={() =>
                      setApplicationForm((prev) => ({ ...prev, reason: option.value as ReExamReason }))
                      }
                      className="w-4 h-4 text-blue-600" />

                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-xs text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                  )}
                    </div>
                  </div>

                  {/* Section C: Subjects */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 bg-blue-50 px-3 py-2 rounded mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        SECTION C: SUBJECTS FOR RE-EXAMINATION
                      </span>
                      <Button variant="outline" size="xs" onClick={handleAddSubject}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add Subject
                      </Button>
                    </h3>
                    <div className="space-y-3">
                      {applicationForm.subjects.map((subject, index) =>
                  <div key={index} className="flex gap-3 items-start">
                          <div className="w-8 h-10 flex items-center justify-center bg-gray-100 rounded text-sm font-medium text-gray-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Select
                        value={subject.name}
                        onChange={(value) => handleSubjectChange(index, 'name', value)}
                        options={subjectOptions.
                        filter(
                          (s) =>
                          !applicationForm.subjects.some((sub, i) => sub.name === s && i !== index)
                        ).
                        map((s) => ({ value: s, label: s }))}
                        placeholder="Select subject" />

                          </div>
                          <div className="w-32">
                            <Input
                        value={subject.marksObtained}
                        onChange={(value) => handleSubjectChange(index, 'marksObtained', value)}
                        placeholder="Marks" />

                          </div>
                          <div className="w-20 h-10 flex items-center justify-center bg-gray-100 rounded text-sm font-medium text-gray-700">
                            ₹250
                          </div>
                          {applicationForm.subjects.length > 1 &&
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveSubject(index)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                    }
                        </div>
                  )}
                      <div className="flex justify-end pt-3 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-lg px-4 py-2 flex items-center gap-4">
                          <span className="text-sm text-gray-600">Total Fee Payable:</span>
                          <span className="text-xl font-bold text-blue-700">₹{calculateTotalFee()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        * Fee per subject: ₹250 | Fee is non-refundable
                      </p>
                    </div>
                  </div>

                  {/* Section D: Declaration */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 bg-blue-50 px-3 py-2 rounded mb-4 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      SECTION D: DECLARATION & UNDERTAKING
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                      <p className="font-medium">I hereby declare that:</p>
                      <ol className="list-decimal list-inside space-y-1 pl-2 text-gray-600">
                        <li>I am applying for re-examination for the reason mentioned above.</li>
                        <li>I understand that re-examination is a one-time opportunity provided by the school.</li>
                        <li>I will abide by all the rules and regulations set by the school for the re-examination.</li>
                        <li>I understand that the fee once paid is non-refundable under any circumstances.</li>
                        <li>
                          I will maintain discipline and decorum during the examination and will not indulge in any
                          malpractice.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
            }
            </div>

            {/* Modal Footer */}
            {!formSubmitted &&
          <div className="p-5 border-t border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrintForm}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadForm}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleCloseApplicationForm}>
                    Cancel
                  </Button>
                  <Button variant="success" onClick={handleSubmitApplication}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                </div>
              </div>
          }
          </div>
        </div>
      }

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {receiptGenerated ? 'Payment Receipt' : 'Collect Re-Exam Fee'}
              </h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {receiptGenerated ?
            <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Payment Successful!</p>
                    <p className="text-sm text-gray-500">Receipt No: RCT-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student:</span>
                      <span className="font-medium">{selectedStudent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">
                        Class {selectedStudent.class}-{selectedStudent.section}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subjects:</span>
                      <span className="font-medium">{selectedStudent.failedSubjects.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-green-700">₹{selectedStudent.paymentAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Mode:</span>
                      <span className="font-medium">{paymentMode}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                      Close
                    </Button>
                    <Button variant="primary" className="flex-1">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div> :

            <>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student:</span>
                      <span className="font-semibold">{selectedStudent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subjects:</span>
                      <span className="font-semibold">{selectedStudent.failedSubjects.join(', ')}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                      <span className="text-gray-700 font-medium">Total Amount:</span>
                      <span className="text-lg font-bold text-blue-700">₹{selectedStudent.paymentAmount}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                    <Select
                  value={paymentMode}
                  onChange={setPaymentMode}
                  options={[
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Online', label: 'Online' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Cheque', label: 'Cheque' }]
                  } />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <Input type="date" value={paymentDate} onChange={setPaymentDate} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={handleConfirmPayment}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Confirm Payment
                    </Button>
                  </div>
                </>
            }
            </div>
          </div>
        </div>
      }

      {/* Message Modal */}
      {showMessageModal && selectedStudent &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Send Reminder</h2>
              <button onClick={() => setShowMessageModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium">
                  {selectedStudent.name} — Class {selectedStudent.class}-{selectedStudent.section}
                </p>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 italic">
                "You are eligible for re-exam. Please complete the form and pay fees before the last date."
              </p>
              <p className="text-sm font-medium text-gray-700">Send via:</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-green-600" />
                  SMS
                </button>
                <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  WhatsApp
                </button>
                <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email
                </button>
                <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <Bell className="w-4 h-4 text-purple-600" />
                  App Notification
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setShowMessageModal(false)}>
                  <Send className="w-4 h-4 mr-2" />
                  Send All
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Create Exam Modal */}
      {showCreateExamModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl my-8">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Create Re-Examination</h2>
              <button onClick={() => setShowCreateExamModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                <p>
                  All approved students will sit together in the same room. Each student will receive a
                  question paper based on their individual failed subjects.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                  <Input
                  value={newExam.examName || ''}
                  onChange={(value) => setNewExam({ ...newExam, examName: value })}
                  placeholder="e.g., Re-Examination February 2025" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <Input
                  type="date"
                  value={newExam.date || ''}
                  onChange={(value) => setNewExam({ ...newExam, date: value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room/Hall *</label>
                  <Select
                  value={newExam.roomNo || ''}
                  onChange={(value) => setNewExam({ ...newExam, roomNo: value })}
                  options={roomOptions.map((r) => ({ value: r, label: r }))}
                  placeholder="Select Room" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <Select
                  value={newExam.startTime || '10:00 AM'}
                  onChange={(value) => setNewExam({ ...newExam, startTime: value })}
                  options={[
                  { value: '09:00 AM', label: '09:00 AM' },
                  { value: '10:00 AM', label: '10:00 AM' },
                  { value: '11:00 AM', label: '11:00 AM' },
                  { value: '02:00 PM', label: '02:00 PM' }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <Select
                  value={newExam.endTime || '01:00 PM'}
                  onChange={(value) => setNewExam({ ...newExam, endTime: value })}
                  options={[
                  { value: '12:00 PM', label: '12:00 PM' },
                  { value: '01:00 PM', label: '01:00 PM' },
                  { value: '02:00 PM', label: '02:00 PM' },
                  { value: '05:00 PM', label: '05:00 PM' }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invigilator Name</label>
                  <Input
                  value={newExam.invigilator || ''}
                  onChange={(value) => setNewExam({ ...newExam, invigilator: value })}
                  placeholder="Enter name" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <Input
                  value={newExam.invigilatorContact || ''}
                  onChange={(value) => setNewExam({ ...newExam, invigilatorContact: value })}
                  placeholder="Enter contact" />

                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCreateExamModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateExam}>
                <Plus className="w-4 h-4 mr-2" />
                Create Re-Exam
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Add Students Modal */}
      {showAddStudentsModal && selectedExam &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add Students to Re-Exam</h2>
                <p className="text-sm text-gray-500">
                  {selectedExam.examName} - {selectedExam.date}
                </p>
              </div>
              <button
              onClick={() => {
                setShowAddStudentsModal(false);
                setSelectedStudentsForAssignment(new Set());
                setSeatAssignments({});
              }}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="bg-green-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-green-800">Eligible Students for Assignment</p>
                <p className="text-green-600 text-xs mt-1">
                  Showing all approved students who are not yet assigned to any exam
                </p>
              </div>

              {eligibleForAssignment.length === 0 ?
            <div className="py-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No eligible students found</p>
                  <p className="text-sm text-gray-400">
                    All approved students are already assigned to exams
                  </p>
                </div> :

            <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        <input
                      type="checkbox"
                      checked={
                      eligibleForAssignment.length > 0 &&
                      eligibleForAssignment.every((s) => selectedStudentsForAssignment.has(s.id))
                      }
                      onChange={() => {
                        if (eligibleForAssignment.every((s) => selectedStudentsForAssignment.has(s.id))) {
                          setSelectedStudentsForAssignment(new Set());
                        } else {
                          setSelectedStudentsForAssignment(new Set(eligibleForAssignment.map((s) => s.id)));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Class</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Subjects</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Reason</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                        Seat No *
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {eligibleForAssignment.map((student) =>
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50 ${selectedStudentsForAssignment.has(student.id) ? 'bg-blue-50' : ''}`}>

                        <td className="px-3 py-2">
                          <input
                      type="checkbox"
                      checked={selectedStudentsForAssignment.has(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                        </td>
                        <td className="px-3 py-2">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">Roll: {student.rollNo}</p>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Badge variant="info">
                            {student.class}-{student.section}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {student.failedSubjects.map((sub) =>
                      <span
                        key={sub}
                        className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">

                                {sub}
                              </span>
                      )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">{getReasonBadge(student.reExamReason)}</td>
                        <td className="px-3 py-2 text-center">
                          <Input
                      value={seatAssignments[student.id] || ''}
                      onChange={(value) =>
                      setSeatAssignments((prev) => ({ ...prev, [student.id]: value }))
                      }
                      placeholder="A-01"
                      className="w-20 text-center"
                      disabled={!selectedStudentsForAssignment.has(student.id)} />

                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
            }
            </div>
            <div className="p-5 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {selectedStudentsForAssignment.size} student(s) selected
              </p>
              <div className="flex gap-3">
                <Button
                variant="outline"
                onClick={() => {
                  setShowAddStudentsModal(false);
                  setSelectedStudentsForAssignment(new Set());
                  setSeatAssignments({});
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                disabled={selectedStudentsForAssignment.size === 0}
                onClick={handleAddStudentsToExam}>

                  <UserCheck className="w-4 h-4 mr-2" />
                  Add {selectedStudentsForAssignment.size} Students
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Exam Details Modal */}
      {showExamDetailsModal && selectedExam &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{selectedExam.examName}</h2>
              <button
              onClick={() => setShowExamDetailsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Exam Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Date</p>
                  <p className="font-medium text-gray-900">{selectedExam.date}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Time</p>
                  <p className="font-medium text-gray-900">
                    {selectedExam.startTime} - {selectedExam.endTime}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Room</p>
                  <p className="font-medium text-gray-900">{selectedExam.roomNo}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Invigilator</p>
                  <p className="font-medium text-gray-900">{selectedExam.invigilator || 'Not Assigned'}</p>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Exam Instructions</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedExam.instructions.map((instruction, idx) =>
                <li key={idx}>{instruction}</li>
                )}
                </ul>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowExamDetailsModal(false)}>
                Close
              </Button>
              <Button variant="primary">
                <Download className="w-4 h-4 mr-2" />
                Download Details
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default ReExamStudentManagement;