import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Printer,
  Save,
  FileText,
  FileBadge,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Settings,
  RefreshCw,
  Edit3,
  Copy,
  ChevronRight,
  Info,
  User,
  Hash,
  BookOpen,
  Award,
  AlertTriangle,
  Check,
  Loader2,
  History,
  LayoutTemplate,
  Signature,
  GraduationCap,
  DollarSign,
  ClipboardCheck,
  Trophy,
  Medal,
  Star,
  Target,
  TrendingUp,
  Percent,
  Receipt,
  CreditCard,
  Wallet,
  Building,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Plus,
  Minus,
  Sparkles,
  Shield,
  Briefcase,
  Users,
  Activity,
  Flame,
  Crown,
  Ribbon,
  Gift,
  Heart,
  ThumbsUp,
  Zap,
  Globe,
  Flag,
  Lightbulb,
  Music,
  Palette,
  Camera,
  Mic,
  BookOpenCheck,
  PenTool,
  Scissors,
  Drama,
  Gamepad2,
  Dumbbell,
  Bike,
  Timer,
  CalendarDays,
  CalendarRange,
  FileSpreadsheet,
  BadgeCheck,
  CircleDollarSign,
  IndianRupee,
  Banknote } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
interface StudentData {
  id: string;
  name: string;
  grNo: string;
  rollNo: string;
  class: string;
  section: string;
  stream: string;
  fatherName: string;
  motherName: string;
  dob: string;
  admissionDate: string;
  phone: string;
  email: string;
  address: string;
  photo: string;
  category: string;
  status: string;
  attendance: number;
  feesPaid: number;
  totalFees: number;
  achievements: Achievement[];
  certificates: CertificateRecord[];
}
interface Achievement {
  id: string;
  title: string;
  category: string;
  position: string;
  date: string;
  description: string;
  level: string;
}
interface CertificateRecord {
  id: string;
  type: string;
  certificateNo: string;
  issueDate: string;
  purpose: string;
  status: 'issued' | 'pending' | 'cancelled';
}
interface FeeRecord {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  type: string;
  mode: string;
}
interface AttendanceData {
  month: string;
  workingDays: number;
  present: number;
  absent: number;
  percentage: number;
}
interface CertificateSettings {
  certificateType: string;
  issueDate: string;
  signatory: string;
  template: string;
  remarks: string;
  purpose: string;
  customPurpose: string;
  includePhoto: boolean;
  includeQR: boolean;
  copies: number;
}
const CERTIFICATE_TYPES = [
{
  value: 'fee',
  label: 'Fee Certificate',
  icon: IndianRupee,
  description: 'Certificate confirming fee payment details',
  color: 'green'
},
{
  value: 'attendance',
  label: 'Attendance Certificate',
  icon: ClipboardCheck,
  description: 'Certificate showing attendance record',
  color: 'blue'
},
{
  value: 'achievement',
  label: 'Achievement Certificate',
  icon: Trophy,
  description: 'Certificate for achievements and awards',
  color: 'yellow'
},
{
  value: 'participation',
  label: 'Participation Certificate',
  icon: Medal,
  description: 'Certificate for event participation',
  color: 'purple'
},
{
  value: 'merit',
  label: 'Merit Certificate',
  icon: Star,
  description: 'Certificate for academic excellence',
  color: 'orange'
},
{
  value: 'sports',
  label: 'Sports Certificate',
  icon: Dumbbell,
  description: 'Certificate for sports achievements',
  color: 'red'
},
{
  value: 'cultural',
  label: 'Cultural Certificate',
  icon: Music,
  description: 'Certificate for cultural activities',
  color: 'pink'
},
{
  value: 'custom',
  label: 'Custom Certificate',
  icon: PenTool,
  description: 'Create a custom certificate',
  color: 'gray'
}];

const ACHIEVEMENT_CATEGORIES = [
{
  value: 'academic',
  label: 'Academic',
  icon: BookOpen
},
{
  value: 'sports',
  label: 'Sports',
  icon: Trophy
},
{
  value: 'cultural',
  label: 'Cultural',
  icon: Music
},
{
  value: 'arts',
  label: 'Arts',
  icon: Palette
},
{
  value: 'science',
  label: 'Science & Technology',
  icon: Lightbulb
},
{
  value: 'leadership',
  label: 'Leadership',
  icon: Crown
},
{
  value: 'social',
  label: 'Social Service',
  icon: Heart
},
{
  value: 'other',
  label: 'Other',
  icon: Star
}];

const POSITION_OPTIONS = [
{
  value: 'first',
  label: 'First Prize / Gold Medal'
},
{
  value: 'second',
  label: 'Second Prize / Silver Medal'
},
{
  value: 'third',
  label: 'Third Prize / Bronze Medal'
},
{
  value: 'special',
  label: 'Special Recognition'
},
{
  value: 'participation',
  label: 'Participation'
},
{
  value: 'merit',
  label: 'Merit Award'
},
{
  value: 'excellence',
  label: 'Excellence Award'
},
{
  value: 'best',
  label: 'Best Performance'
}];

const LEVEL_OPTIONS = [
{
  value: 'school',
  label: 'School Level'
},
{
  value: 'inter-school',
  label: 'Inter-School Level'
},
{
  value: 'district',
  label: 'District Level'
},
{
  value: 'state',
  label: 'State Level'
},
{
  value: 'national',
  label: 'National Level'
},
{
  value: 'international',
  label: 'International Level'
}];

const TEMPLATES = [
{
  id: 'standard',
  name: 'Standard Format',
  description: 'Official certificate with school letterhead',
  preview: '/api/placeholder/200/280'
},
{
  id: 'decorative',
  name: 'Decorative Format',
  description: 'Ornate design with borders and motifs',
  preview: '/api/placeholder/200/280'
},
{
  id: 'modern',
  name: 'Modern Format',
  description: 'Clean, contemporary design',
  preview: '/api/placeholder/200/280'
},
{
  id: 'achievement',
  name: 'Achievement Format',
  description: 'Special design for achievements',
  preview: '/api/placeholder/200/280'
}];

const SIGNATORIES = [
{
  id: 'principal',
  name: 'Dr. Ramesh Sharma',
  designation: 'Principal',
  signature: true
},
{
  id: 'vice-principal',
  name: 'Mrs. Sunita Verma',
  designation: 'Vice-Principal',
  signature: true
},
{
  id: 'hod',
  name: 'Mr. Anil Kumar',
  designation: 'Head of Department',
  signature: true
},
{
  id: 'class-teacher',
  name: 'Mrs. Priya Mehta',
  designation: 'Class Teacher',
  signature: true
},
{
  id: 'admin',
  name: 'Mr. Suresh Patil',
  designation: 'Administrative Officer',
  signature: true
}];

const MOCK_FEE_RECORDS: FeeRecord[] = [
{
  id: '1',
  receiptNo: 'REC-2024-001',
  date: '2024-04-15',
  amount: 15000,
  type: 'Tuition Fee',
  mode: 'Online'
},
{
  id: '2',
  receiptNo: 'REC-2024-002',
  date: '2024-07-20',
  amount: 15000,
  type: 'Tuition Fee',
  mode: 'Cheque'
},
{
  id: '3',
  receiptNo: 'REC-2024-003',
  date: '2024-10-10',
  amount: 15000,
  type: 'Tuition Fee',
  mode: 'Cash'
},
{
  id: '4',
  receiptNo: 'REC-2024-004',
  date: '2024-01-05',
  amount: 15000,
  type: 'Tuition Fee',
  mode: 'Online'
},
{
  id: '5',
  receiptNo: 'REC-2024-005',
  date: '2024-06-01',
  amount: 5000,
  type: 'Lab Fee',
  mode: 'Online'
},
{
  id: '6',
  receiptNo: 'REC-2024-006',
  date: '2024-06-01',
  amount: 3000,
  type: 'Library Fee',
  mode: 'Online'
}];

const MOCK_ATTENDANCE: AttendanceData[] = [
{
  month: 'April 2024',
  workingDays: 24,
  present: 22,
  absent: 2,
  percentage: 91.67
},
{
  month: 'May 2024',
  workingDays: 22,
  present: 21,
  absent: 1,
  percentage: 95.45
},
{
  month: 'June 2024',
  workingDays: 20,
  present: 18,
  absent: 2,
  percentage: 90.0
},
{
  month: 'July 2024',
  workingDays: 26,
  present: 25,
  absent: 1,
  percentage: 96.15
},
{
  month: 'August 2024',
  workingDays: 24,
  present: 23,
  absent: 1,
  percentage: 95.83
},
{
  month: 'September 2024',
  workingDays: 22,
  present: 20,
  absent: 2,
  percentage: 90.91
},
{
  month: 'October 2024',
  workingDays: 24,
  present: 24,
  absent: 0,
  percentage: 100.0
},
{
  month: 'November 2024',
  workingDays: 22,
  present: 21,
  absent: 1,
  percentage: 95.45
},
{
  month: 'December 2024',
  workingDays: 18,
  present: 17,
  absent: 1,
  percentage: 94.44
},
{
  month: 'January 2025',
  workingDays: 24,
  present: 22,
  absent: 2,
  percentage: 91.67
},
{
  month: 'February 2025',
  workingDays: 20,
  present: 19,
  absent: 1,
  percentage: 95.0
}];

const MOCK_ACHIEVEMENTS: Achievement[] = [
{
  id: 'A1',
  title: 'Science Exhibition Winner',
  category: 'science',
  position: 'first',
  date: '2024-01-15',
  description: 'First place in district-level science exhibition',
  level: 'district'
},
{
  id: 'A2',
  title: 'Debate Competition',
  category: 'cultural',
  position: 'second',
  date: '2024-02-20',
  description: 'Second place in inter-school debate competition',
  level: 'inter-school'
},
{
  id: 'A3',
  title: 'Athletics Championship',
  category: 'sports',
  position: 'third',
  date: '2024-03-10',
  description: '100m sprint bronze medal',
  level: 'state'
}];

const RECENT_CERTIFICATES: CertificateRecord[] = [
{
  id: 'C1',
  type: 'Fee Certificate',
  certificateNo: 'FEE-2024-045',
  issueDate: '2024-02-15',
  purpose: 'Income Tax',
  status: 'issued'
},
{
  id: 'C2',
  type: 'Attendance Certificate',
  certificateNo: 'ATT-2024-032',
  issueDate: '2024-02-10',
  purpose: 'Scholarship',
  status: 'issued'
},
{
  id: 'C3',
  type: 'Achievement Certificate',
  certificateNo: 'ACH-2024-018',
  issueDate: '2024-01-25',
  purpose: 'College Admission',
  status: 'issued'
}];

const MOCK_STUDENT: StudentData = {
  id: '1',
  name: 'Riya Sen',
  grNo: 'GR-2020-008',
  rollNo: '15',
  class: 'VIII',
  section: 'B',
  stream: 'General',
  fatherName: 'Amit Sen',
  motherName: 'Priya Sen',
  dob: '2012-05-15',
  admissionDate: '2020-06-01',
  phone: '+91 98765 43210',
  email: 'riya.sen@email.com',
  address: '123, Green Valley, Mumbai - 400001',
  photo: '/api/placeholder/100/100',
  category: 'General',
  status: 'Active',
  attendance: 94.2,
  feesPaid: 68000,
  totalFees: 68000,
  achievements: MOCK_ACHIEVEMENTS,
  certificates: RECENT_CERTIFICATES
};
export function OtherCertificate() {
  const navigate = useNavigate();
  const [certType, setCertType] = useState('fee');
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showFeeDetailsModal, setShowFeeDetailsModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [selectedFeeRecords, setSelectedFeeRecords] = useState<string[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
  useState<Achievement | null>(null);
  const [attendancePeriod, setAttendancePeriod] = useState<{
    from: string;
    to: string;
  }>({
    from: 'April 2024',
    to: 'February 2025'
  });
  const [expandedSections, setExpandedSections] = useState({
    certificateTypes: true,
    recentCertificates: true
  });
  const [settings, setSettings] = useState<CertificateSettings>({
    certificateType: 'fee',
    issueDate: new Date().toISOString().split('T')[0],
    signatory: 'principal',
    template: 'standard',
    remarks: '',
    purpose: 'general',
    customPurpose: '',
    includePhoto: false,
    includeQR: true,
    copies: 1
  });
  // Fee Certificate specific fields
  const [feeDetails, setFeeDetails] = useState({
    academicYear: '2023-2024',
    totalAmount: 0,
    selectedReceipts: [] as string[],
    feeType: 'all'
  });
  // Attendance Certificate specific fields
  const [attendanceDetails, setAttendanceDetails] = useState({
    periodFrom: '',
    periodTo: '',
    totalWorkingDays: 0,
    daysPresent: 0,
    percentage: 0
  });
  // Achievement Certificate specific fields
  const [achievementDetails, setAchievementDetails] = useState({
    eventName: '',
    category: '',
    position: '',
    date: '',
    level: '',
    description: ''
  });
  // Participation Certificate specific fields
  const [participationDetails, setParticipationDetails] = useState({
    eventName: '',
    eventDate: '',
    organizer: '',
    venue: '',
    description: ''
  });
  // Custom Certificate specific fields
  const [customDetails, setCustomDetails] = useState({
    certificateTitle: '',
    bodyText: '',
    additionalInfo: ''
  });
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setStudent(MOCK_STUDENT);
        setIsSearching(false);
      }, 1000);
    }
  };
  const clearStudent = () => {
    setStudent(null);
    setSearchTerm('');
    setSelectedFeeRecords([]);
    setSelectedAchievement(null);
  };
  const toggleFeeRecord = (id: string) => {
    setSelectedFeeRecords((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const selectAllFeeRecords = () => {
    setSelectedFeeRecords(MOCK_FEE_RECORDS.map((r) => r.id));
  };
  const calculateTotalSelectedFees = () => {
    return MOCK_FEE_RECORDS.filter((r) =>
    selectedFeeRecords.includes(r.id)
    ).reduce((sum, r) => sum + r.amount, 0);
  };
  const calculateAttendance = () => {
    const selectedMonths = MOCK_ATTENDANCE;
    const totalWorkingDays = selectedMonths.reduce(
      (sum, m) => sum + m.workingDays,
      0
    );
    const totalPresent = selectedMonths.reduce((sum, m) => sum + m.present, 0);
    const percentage =
    totalWorkingDays > 0 ? totalPresent / totalWorkingDays * 100 : 0;
    setAttendanceDetails({
      periodFrom: 'April 2024',
      periodTo: 'February 2025',
      totalWorkingDays,
      daysPresent: totalPresent,
      percentage: Math.round(percentage * 100) / 100
    });
  };
  useEffect(() => {
    calculateAttendance();
  }, []);
  const startGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 2000);
  };
  const getCertificateNumber = () => {
    const prefixes: Record<string, string> = {
      fee: 'FEE',
      attendance: 'ATT',
      achievement: 'ACH',
      participation: 'PAR',
      merit: 'MER',
      sports: 'SPT',
      cultural: 'CUL',
      custom: 'CUS'
    };
    return `${prefixes[certType] || 'MISC'}-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const getCurrentCertType = () => {
    return CERTIFICATE_TYPES.find((t) => t.value === certType);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
 
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Miscellaneous Certificates
            </h1>
            <p className="text-gray-500">
              Issue fee, attendance, achievement, and other certificate types
            </p>
          </div>
        </div>
        {student &&
        <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryModal(true)}>

              <History className="w-4 h-4 mr-2" />
              Certificate History
            </Button>
          </div>
        }
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Student Search */}
          <Card>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Student Search</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter GR No, Roll No, or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchTerm.trim()}>

                  {isSearching ?
                  <Loader2 className="w-4 h-4 animate-spin" /> :

                  <Search className="w-4 h-4" />
                  }
                </Button>
              </div>

              {student &&
              <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {student.grNo} • Class {student.class}-
                            {student.section}
                          </p>
                        </div>
                        <button
                        onClick={clearStudent}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded">

                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="success" size="sm">
                          {student.status}
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {student.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {student.attendance}%
                      </div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {student.achievements.length}
                      </div>
                      <div className="text-xs text-gray-500">Achievements</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {student.certificates.length}
                      </div>
                      <div className="text-xs text-gray-500">Certificates</div>
                    </div>
                  </div>
                  <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setShowStudentModal(true)}>

                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              }
            </div>
          </Card>

          {/* Certificate Types */}
          <Card>
            <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('certificateTypes')}>

              <div className="flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">
                  Certificate Type
                </h3>
              </div>
              {expandedSections.certificateTypes ?
              <ChevronUp className="w-4 h-4 text-gray-400" /> :

              <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </div>

            {expandedSections.certificateTypes &&
            <div className="p-4 space-y-2">
                {CERTIFICATE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${certType === type.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>

                      <input
                      type="radio"
                      name="certType"
                      value={type.value}
                      checked={certType === type.value}
                      onChange={(e) => setCertType(e.target.value)}
                      className="sr-only" />

                      <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${type.color === 'green' ? 'bg-green-100 text-green-600' : type.color === 'blue' ? 'bg-blue-100 text-blue-600' : type.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : type.color === 'purple' ? 'bg-purple-100 text-purple-600' : type.color === 'orange' ? 'bg-orange-100 text-orange-600' : type.color === 'red' ? 'bg-red-100 text-red-600' : type.color === 'pink' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}>

                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500">
                          {type.description}
                        </div>
                      </div>
                      {certType === type.value &&
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    }
                    </label>);

              })}
              </div>
            }
          </Card>

          {/* Recent Certificates */}
          {student &&
          <Card>
              <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('recentCertificates')}>

                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">
                    Recent Certificates
                  </h3>
                </div>
                {expandedSections.recentCertificates ?
              <ChevronUp className="w-4 h-4 text-gray-400" /> :

              <ChevronDown className="w-4 h-4 text-gray-400" />
              }
              </div>

              {expandedSections.recentCertificates &&
            <div className="divide-y divide-gray-100">
                  {student.certificates.map((cert) =>
              <div key={cert.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{cert.type}</span>
                        <Badge variant="success" size="sm">
                          {cert.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-mono">{cert.certificateNo}</span>
                        <span>{cert.issueDate}</span>
                      </div>
                    </div>
              )}
                  <div className="p-3">
                    <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowHistoryModal(true)}>

                      View All History
                    </Button>
                  </div>
                </div>
            }
            </Card>
          }
        </div>

        {/* Right Panel - Certificate Form */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getCurrentCertType() &&
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCurrentCertType()?.color === 'green' ? 'bg-green-100 text-green-600' : getCurrentCertType()?.color === 'blue' ? 'bg-blue-100 text-blue-600' : getCurrentCertType()?.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : getCurrentCertType()?.color === 'purple' ? 'bg-purple-100 text-purple-600' : getCurrentCertType()?.color === 'orange' ? 'bg-orange-100 text-orange-600' : getCurrentCertType()?.color === 'red' ? 'bg-red-100 text-red-600' : getCurrentCertType()?.color === 'pink' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}>

                    {(() => {
                    const CertIcon = getCurrentCertType()?.icon;
                    return CertIcon ? <CertIcon className="w-5 h-5" /> : null;
                  })()}
                  </div>
                }
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getCurrentCertType()?.label || 'Certificate'} Details
                  </h3>
                  <p className="text-xs text-gray-500">
                    {getCurrentCertType()?.description}
                  </p>
                </div>
              </div>
              {student &&
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateModal(true)}>

                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Template
                </Button>
              }
            </div>

            {student ?
            <div className="p-6 space-y-6">
                {/* Fee Certificate Fields */}
                {certType === 'fee' &&
              <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          Fee Payment Summary
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            ₹{student.feesPaid.toLocaleString()}
                          </div>
                          <div className="text-xs text-green-600">
                            Total Paid
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-600">
                            ₹{student.totalFees.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Fees
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(
                          student.feesPaid / student.totalFees * 100
                        )}
                            %
                          </div>
                          <div className="text-xs text-blue-600">Paid</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                    label="Academic Year"
                    value={feeDetails.academicYear}
                    onChange={(e) =>
                    setFeeDetails((prev) => ({
                      ...prev,
                      academicYear: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: '2023-2024',
                      label: '2023-2024'
                    },
                    {
                      value: '2022-2023',
                      label: '2022-2023'
                    },
                    {
                      value: '2021-2022',
                      label: '2021-2022'
                    }]
                    } />

                      <Select
                    label="Fee Type"
                    value={feeDetails.feeType}
                    onChange={(e) =>
                    setFeeDetails((prev) => ({
                      ...prev,
                      feeType: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: 'all',
                      label: 'All Fees'
                    },
                    {
                      value: 'tuition',
                      label: 'Tuition Fee Only'
                    },
                    {
                      value: 'exam',
                      label: 'Exam Fee Only'
                    },
                    {
                      value: 'other',
                      label: 'Other Fees'
                    }]
                    } />

                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Fee Receipts to Include
                        </label>
                        <div className="flex gap-2">
                          <Button
                        variant="ghost"
                        size="xs"
                        onClick={selectAllFeeRecords}>

                            Select All
                          </Button>
                          <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedFeeRecords([])}>

                            Clear
                          </Button>
                          <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setShowFeeDetailsModal(true)}>

                            View Details
                          </Button>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                                Select
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                                Receipt No
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                                Type
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {MOCK_FEE_RECORDS.map((record) =>
                        <tr
                          key={record.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedFeeRecords.includes(record.id) ? 'bg-blue-50' : ''}`}
                          onClick={() => toggleFeeRecord(record.id)}>

                                <td className="px-4 py-2">
                                  {selectedFeeRecords.includes(record.id) ?
                            <CheckCircle className="w-5 h-5 text-blue-600" /> :

                            <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                            }
                                </td>
                                <td className="px-4 py-2 font-mono text-sm">
                                  {record.receiptNo}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  {record.date}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  {record.type}
                                </td>
                                <td className="px-4 py-2 text-sm text-right font-medium">
                                  ₹{record.amount.toLocaleString()}
                                </td>
                              </tr>
                        )}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td
                            colSpan={4}
                            className="px-4 py-2 text-sm font-medium">

                                Total Selected ({selectedFeeRecords.length}{' '}
                                receipts)
                              </td>
                              <td className="px-4 py-2 text-right font-bold text-green-600">
                                ₹{calculateTotalSelectedFees().toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
              }

                {/* Attendance Certificate Fields */}
                {certType === 'attendance' &&
              <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardCheck className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          Attendance Summary
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {attendanceDetails.totalWorkingDays}
                          </div>
                          <div className="text-xs text-blue-600">
                            Working Days
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {attendanceDetails.daysPresent}
                          </div>
                          <div className="text-xs text-green-600">
                            Days Present
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">
                            {attendanceDetails.totalWorkingDays -
                        attendanceDetails.daysPresent}
                          </div>
                          <div className="text-xs text-red-600">
                            Days Absent
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {attendanceDetails.percentage}%
                          </div>
                          <div className="text-xs text-purple-600">
                            Percentage
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                    label="Period From"
                    value={attendancePeriod.from}
                    onChange={(e) =>
                    setAttendancePeriod((prev) => ({
                      ...prev,
                      from: e.target.value
                    }))
                    }
                    options={MOCK_ATTENDANCE.map((m) => ({
                      value: m.month,
                      label: m.month
                    }))} />

                      <Select
                    label="Period To"
                    value={attendancePeriod.to}
                    onChange={(e) =>
                    setAttendancePeriod((prev) => ({
                      ...prev,
                      to: e.target.value
                    }))
                    }
                    options={MOCK_ATTENDANCE.map((m) => ({
                      value: m.month,
                      label: m.month
                    }))} />

                    </div>

                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAttendanceModal(true)}>

                      <Eye className="w-4 h-4 mr-2" />
                      View Monthly Breakdown
                    </Button>
                  </div>
              }

                {/* Achievement Certificate Fields */}
                {certType === 'achievement' &&
              <div className="space-y-6">
                    {student.achievements.length > 0 &&
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select from Existing Achievements
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {student.achievements.map((achievement) =>
                    <label
                      key={achievement.id}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${selectedAchievement?.id === achievement.id ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' : 'border-gray-200 hover:border-gray-300'}`}>

                              <input
                        type="radio"
                        name="achievement"
                        checked={
                        selectedAchievement?.id === achievement.id
                        }
                        onChange={() =>
                        setSelectedAchievement(achievement)
                        }
                        className="sr-only" />

                              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {achievement.title}
                                  </h4>
                                  <Badge
                            variant={
                            achievement.position === 'first' ?
                            'success' :
                            achievement.position === 'second' ?
                            'primary' :
                            'secondary'
                            }
                            size="sm">

                                    {
                            POSITION_OPTIONS.find(
                              (p) => p.value === achievement.position
                            )?.label
                            }
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {achievement.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {achievement.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {
                            LEVEL_OPTIONS.find(
                              (l) => l.value === achievement.level
                            )?.label
                            }
                                  </span>
                                </div>
                              </div>
                              {selectedAchievement?.id === achievement.id &&
                      <CheckCircle className="w-5 h-5 text-yellow-600" />
                      }
                            </label>
                    )}
                        </div>
                      </div>
                }

                    <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-700">
                          Or Enter New Achievement
                        </h4>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAchievement(null)}>

                          Clear Selection
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                      label="Event / Competition Name"
                      placeholder="e.g. Inter-School Debate Competition"
                      value={achievementDetails.eventName}
                      onChange={(e) =>
                      setAchievementDetails((prev) => ({
                        ...prev,
                        eventName: e.target.value
                      }))
                      }
                      disabled={!!selectedAchievement} />

                        <Select
                      label="Category"
                      value={achievementDetails.category}
                      onChange={(e) =>
                      setAchievementDetails((prev) => ({
                        ...prev,
                        category: e.target.value
                      }))
                      }
                      options={[
                      {
                        value: '',
                        label: 'Select Category'
                      },
                      ...ACHIEVEMENT_CATEGORIES.map((c) => ({
                        value: c.value,
                        label: c.label
                      }))]
                      }
                      disabled={!!selectedAchievement} />

                        <Select
                      label="Position / Award"
                      value={achievementDetails.position}
                      onChange={(e) =>
                      setAchievementDetails((prev) => ({
                        ...prev,
                        position: e.target.value
                      }))
                      }
                      options={[
                      {
                        value: '',
                        label: 'Select Position'
                      },
                      ...POSITION_OPTIONS]
                      }
                      disabled={!!selectedAchievement} />

                        <Select
                      label="Level"
                      value={achievementDetails.level}
                      onChange={(e) =>
                      setAchievementDetails((prev) => ({
                        ...prev,
                        level: e.target.value
                      }))
                      }
                      options={[
                      {
                        value: '',
                        label: 'Select Level'
                      },
                      ...LEVEL_OPTIONS]
                      }
                      disabled={!!selectedAchievement} />

                        <Input
                      label="Date of Event"
                      type="date"
                      value={achievementDetails.date}
                      onChange={(e) =>
                      setAchievementDetails((prev) => ({
                        ...prev,
                        date: e.target.value
                      }))
                      }
                      disabled={!!selectedAchievement} />

                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Brief description of the achievement"
                      value={achievementDetails.description}
                      onChange={(e) =>
                      setAchievementDetails((prev) => ({
                        ...prev,
                        description: e.target.value
                      }))
                      }
                      disabled={!!selectedAchievement} />

                      </div>
                    </div>
                  </div>
              }

                {/* Participation Certificate Fields */}
                {certType === 'participation' &&
              <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                    label="Event Name"
                    placeholder="e.g. Annual Science Fair"
                    value={participationDetails.eventName}
                    onChange={(e) =>
                    setParticipationDetails((prev) => ({
                      ...prev,
                      eventName: e.target.value
                    }))
                    } />

                      <Input
                    label="Event Date"
                    type="date"
                    value={participationDetails.eventDate}
                    onChange={(e) =>
                    setParticipationDetails((prev) => ({
                      ...prev,
                      eventDate: e.target.value
                    }))
                    } />

                      <Input
                    label="Organizer"
                    placeholder="e.g. Science Club"
                    value={participationDetails.organizer}
                    onChange={(e) =>
                    setParticipationDetails((prev) => ({
                      ...prev,
                      organizer: e.target.value
                    }))
                    } />

                      <Input
                    label="Venue"
                    placeholder="e.g. School Auditorium"
                    value={participationDetails.venue}
                    onChange={(e) =>
                    setParticipationDetails((prev) => ({
                      ...prev,
                      venue: e.target.value
                    }))
                    } />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Description
                      </label>
                      <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the event and participation"
                    value={participationDetails.description}
                    onChange={(e) =>
                    setParticipationDetails((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                    } />

                    </div>
                  </div>
              }

                {/* Merit Certificate Fields */}
                {certType === 'merit' &&
              <div className="space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-800">
                          Academic Merit Certificate
                        </span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Issue a certificate recognizing academic excellence
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                    label="Academic Year"
                    options={[
                    {
                      value: '2023-2024',
                      label: '2023-2024'
                    },
                    {
                      value: '2022-2023',
                      label: '2022-2023'
                    }]
                    } />

                      <Select
                    label="Examination"
                    options={[
                    {
                      value: 'annual',
                      label: 'Annual Examination'
                    },
                    {
                      value: 'half-yearly',
                      label: 'Half-Yearly Examination'
                    },
                    {
                      value: 'quarterly',
                      label: 'Quarterly Examination'
                    },
                    {
                      value: 'unit-test',
                      label: 'Unit Test'
                    }]
                    } />

                      <Input
                    label="Rank / Position"
                    placeholder="e.g. First, Second, Third" />

                      <Input
                    label="Percentage / Grade"
                    placeholder="e.g. 95% or A+" />

                    </div>
                  </div>
              }

                {/* Sports Certificate Fields */}
                {certType === 'sports' &&
              <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">
                          Sports Achievement Certificate
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                    label="Sport / Game"
                    options={[
                    {
                      value: '',
                      label: 'Select Sport'
                    },
                    {
                      value: 'cricket',
                      label: 'Cricket'
                    },
                    {
                      value: 'football',
                      label: 'Football'
                    },
                    {
                      value: 'basketball',
                      label: 'Basketball'
                    },
                    {
                      value: 'badminton',
                      label: 'Badminton'
                    },
                    {
                      value: 'tennis',
                      label: 'Tennis'
                    },
                    {
                      value: 'athletics',
                      label: 'Athletics'
                    },
                    {
                      value: 'swimming',
                      label: 'Swimming'
                    },
                    {
                      value: 'chess',
                      label: 'Chess'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                      <Input
                    label="Event Name"
                    placeholder="e.g. Inter-School Athletics Meet" />

                      <Select
                    label="Level"
                    options={[
                    {
                      value: '',
                      label: 'Select Level'
                    },
                    ...LEVEL_OPTIONS]
                    } />

                      <Select
                    label="Position / Award"
                    options={[
                    {
                      value: '',
                      label: 'Select Position'
                    },
                    ...POSITION_OPTIONS]
                    } />

                      <Input label="Event Date" type="date" />
                      <Input
                    label="Venue"
                    placeholder="e.g. District Sports Complex" />

                    </div>
                  </div>
              }

                {/* Cultural Certificate Fields */}
                {certType === 'cultural' &&
              <div className="space-y-4">
                    <div className="p-4 bg-pink-50 border border-pink-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-5 h-5 text-pink-600" />
                        <span className="font-medium text-pink-800">
                          Cultural Achievement Certificate
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                    label="Activity Type"
                    options={[
                    {
                      value: '',
                      label: 'Select Activity'
                    },
                    {
                      value: 'dance',
                      label: 'Dance'
                    },
                    {
                      value: 'music',
                      label: 'Music'
                    },
                    {
                      value: 'drama',
                      label: 'Drama'
                    },
                    {
                      value: 'art',
                      label: 'Art'
                    },
                    {
                      value: 'debate',
                      label: 'Debate'
                    },
                    {
                      value: 'elocution',
                      label: 'Elocution'
                    },
                    {
                      value: 'poetry',
                      label: 'Poetry'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                      <Input
                    label="Event Name"
                    placeholder="e.g. Annual Cultural Fest" />

                      <Select
                    label="Level"
                    options={[
                    {
                      value: '',
                      label: 'Select Level'
                    },
                    ...LEVEL_OPTIONS]
                    } />

                      <Select
                    label="Position / Award"
                    options={[
                    {
                      value: '',
                      label: 'Select Position'
                    },
                    ...POSITION_OPTIONS]
                    } />

                      <Input label="Event Date" type="date" />
                    </div>
                  </div>
              }

                {/* Custom Certificate Fields */}
                {certType === 'custom' &&
              <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <PenTool className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          Custom Certificate
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Create a fully customized certificate with your own
                        content
                      </p>
                    </div>
                    <Input
                  label="Certificate Title"
                  placeholder="e.g. Certificate of Appreciation"
                  value={customDetails.certificateTitle}
                  onChange={(e) =>
                  setCustomDetails((prev) => ({
                    ...prev,
                    certificateTitle: e.target.value
                  }))
                  } />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Body Text
                      </label>
                      <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    placeholder="Enter the main content of the certificate..."
                    value={customDetails.bodyText}
                    onChange={(e) =>
                    setCustomDetails((prev) => ({
                      ...prev,
                      bodyText: e.target.value
                    }))
                    } />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any additional details..."
                    value={customDetails.additionalInfo}
                    onChange={(e) =>
                    setCustomDetails((prev) => ({
                      ...prev,
                      additionalInfo: e.target.value
                    }))
                    } />

                    </div>
                  </div>
              }

                {/* Common Fields */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Certificate Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Number
                      </label>
                      <Input
                      value={getCertificateNumber()}
                      disabled
                      className="bg-gray-50 font-mono" />

                    </div>
                    <Input
                    label="Issue Date"
                    type="date"
                    value={settings.issueDate}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      issueDate: e.target.value
                    }))
                    } />

                    <Select
                    label="Purpose"
                    value={settings.purpose}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      purpose: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: 'general',
                      label: 'General Purpose'
                    },
                    {
                      value: 'income-tax',
                      label: 'Income Tax'
                    },
                    {
                      value: 'scholarship',
                      label: 'Scholarship Application'
                    },
                    {
                      value: 'college',
                      label: 'College Admission'
                    },
                    {
                      value: 'visa',
                      label: 'Visa Application'
                    },
                    {
                      value: 'other',
                      label: 'Other'
                    }]
                    } />

                  </div>
                </div>

                {/* Signatory Selection */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Signatory</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SIGNATORIES.map((sig) =>
                  <label
                    key={sig.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${settings.signatory === sig.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                        <input
                      type="radio"
                      name="signatory"
                      value={sig.id}
                      checked={settings.signatory === sig.id}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        signatory: e.target.value
                      }))
                      }
                      className="sr-only" />

                        <div className="flex-1">
                          <div className="font-medium text-sm">{sig.name}</div>
                          <div className="text-xs text-gray-500">
                            {sig.designation}
                          </div>
                        </div>
                        {sig.signature && settings.signatory === sig.id &&
                    <Signature className="w-4 h-4 text-blue-600" />
                    }
                      </label>
                  )}
                  </div>
                </div>

                {/* Remarks */}
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks (Optional)
                  </label>
                  <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Any additional remarks for the certificate"
                  value={settings.remarks}
                  onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    remarks: e.target.value
                  }))
                  } />

                </div>

                {/* Additional Options */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Additional Options
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                      type="checkbox"
                      checked={settings.includePhoto}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        includePhoto: e.target.checked
                      }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                      <span className="text-sm">Include Photo</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                      type="checkbox"
                      checked={settings.includeQR}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        includeQR: e.target.checked
                      }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                      <span className="text-sm">Include QR Code</span>
                    </label>
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm">Copies:</span>
                      <div className="flex items-center gap-1">
                        <button
                        onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          copies: Math.max(1, prev.copies - 1)
                        }))
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100">

                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {settings.copies}
                        </span>
                        <button
                        onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          copies: prev.copies + 1
                        }))
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100">

                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(true)}>

                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={() => setShowGenerateModal(true)}>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Issue
                  </Button>
                </div>
              </div> :

            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Search for a Student
                </h3>
                <p className="text-sm text-gray-400">
                  Enter GR Number, Roll Number, or Name to search for a student
                </p>
              </div>
            }
          </Card>
        </div>
      </div>

      {/* Student Details Modal */}
      <Modal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        title="Student Profile"
        size="lg">

        {student &&
        <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {student.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary">{student.grNo}</Badge>
                  <Badge variant="secondary">Roll: {student.rollNo}</Badge>
                  <Badge variant="success">{student.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Class {student.class}-{student.section} | {student.category}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Father's Name</div>
                      <div className="text-sm font-medium">
                        {student.fatherName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Mother's Name</div>
                      <div className="text-sm font-medium">
                        {student.motherName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Date of Birth</div>
                      <div className="text-sm font-medium">{student.dob}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-sm font-medium">{student.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm font-medium">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Address</div>
                      <div className="text-sm font-medium">
                        {student.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
              variant="outline"
              onClick={() => setShowStudentModal(false)}>

                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Fee Details Modal */}
      <Modal
        isOpen={showFeeDetailsModal}
        onClose={() => setShowFeeDetailsModal(false)}
        title="Fee Payment Details"
        size="lg">

        {student &&
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{student.feesPaid.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Total Paid</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-600">
                  ₹{student.totalFees.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Fees</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {MOCK_FEE_RECORDS.length}
                </div>
                <div className="text-sm text-blue-600">Receipts</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Receipt No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Mode
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_FEE_RECORDS.map((record) =>
                <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">
                        {record.receiptNo}
                      </td>
                      <td className="px-4 py-3 text-sm">{record.date}</td>
                      <td className="px-4 py-3 text-sm">{record.type}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="secondary" size="sm">
                          {record.mode}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        ₹{record.amount.toLocaleString()}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowFeeDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title="Monthly Attendance Breakdown"
        size="lg">

        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attendanceDetails.totalWorkingDays}
              </div>
              <div className="text-sm text-blue-600">Total Days</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendanceDetails.daysPresent}
              </div>
              <div className="text-sm text-green-600">Present</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendanceDetails.totalWorkingDays -
                attendanceDetails.daysPresent}
              </div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {attendanceDetails.percentage}%
              </div>
              <div className="text-sm text-purple-600">Overall</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Month
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                    Working Days
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                    Present
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                    Absent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ATTENDANCE.map((record, index) =>
                <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {record.month}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {record.workingDays}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-green-600">
                      {record.present}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-red-600">
                      {record.absent}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Badge
                      variant={
                      record.percentage >= 90 ?
                      'success' :
                      record.percentage >= 75 ?
                      'warning' :
                      'danger'
                      }
                      size="sm">

                        {record.percentage}%
                      </Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowAttendanceModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Template Selection Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Select Certificate Template"
        size="lg">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEMPLATES.map((template) =>
          <div
            key={template.id}
            onClick={() => {
              setSettings((prev) => ({
                ...prev,
                template: template.id
              }));
              setShowTemplateModal(false);
            }}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${settings.template === template.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>

              <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center relative">
                <FileText className="w-12 h-12 text-gray-400" />
                {settings.template === template.id &&
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
              }
              </div>
              <h4 className="font-medium text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {template.description}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Certificate History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Certificate History"
        size="lg">

        {student &&
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.grNo}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {student.certificates.length}
                </div>
                <div className="text-xs text-gray-500">Total Certificates</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Certificate No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Issue Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {student.certificates.map((cert) =>
                <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">
                        {cert.certificateNo}
                      </td>
                      <td className="px-4 py-3 text-sm">{cert.type}</td>
                      <td className="px-4 py-3 text-sm">{cert.issueDate}</td>
                      <td className="px-4 py-3 text-sm">{cert.purpose}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" size="sm">
                          {cert.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
            </div>
          </div>
        }
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Certificate Preview"
        size="xl">

        {student &&
        <div className="grid grid-cols-2 gap-6">
            {/* Preview */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="bg-white rounded shadow-lg p-6 aspect-[3/4] flex flex-col">
                <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
                  <h3 className="text-lg font-bold uppercase">
                    {getCurrentCertType()?.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Certificate No: {getCertificateNumber()}
                  </p>
                </div>

                <div className="flex-1 space-y-4 text-sm">
                  <p>This is to certify that</p>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs text-gray-600">
                      S/O {student.fatherName}
                    </p>
                  </div>
                  <p>
                    is/was a bonafide student of this institution, studying in
                    Class {student.class}-{student.section}.
                  </p>

                  {certType === 'fee' && selectedFeeRecords.length > 0 &&
                <div className="p-3 bg-green-50 rounded border border-green-100">
                      <p className="font-medium text-green-800">
                        Total Fee Paid: ₹
                        {calculateTotalSelectedFees().toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Receipts: {selectedFeeRecords.length}
                      </p>
                    </div>
                }

                  {certType === 'attendance' &&
                <div className="p-3 bg-blue-50 rounded border border-blue-100">
                      <p className="font-medium text-blue-800">
                        Attendance: {attendanceDetails.percentage}%
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {attendanceDetails.daysPresent} /{' '}
                        {attendanceDetails.totalWorkingDays} days
                      </p>
                    </div>
                }

                  {certType === 'achievement' && selectedAchievement &&
                <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                      <p className="font-medium text-yellow-800">
                        {selectedAchievement.title}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        {
                    POSITION_OPTIONS.find(
                      (p) => p.value === selectedAchievement.position
                    )?.label
                    }
                      </p>
                    </div>
                }
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mt-4 flex justify-between items-end">
                  <div className="text-xs">
                    <div>Date: {settings.issueDate}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 border-t border-gray-400 pt-1">
                      <span className="text-xs">
                        {
                      SIGNATORIES.find((s) => s.id === settings.signatory)?.
                      name
                      }
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {
                    SIGNATORIES.find((s) => s.id === settings.signatory)?.
                    designation
                    }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h4 className="font-semibold">Certificate Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Certificate Type</span>
                  <span className="font-medium">
                    {getCurrentCertType()?.label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Student</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Class</span>
                  <span className="font-medium">
                    {student.class}-{student.section}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Template</span>
                  <span className="font-medium">
                    {TEMPLATES.find((t) => t.id === settings.template)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Signatory</span>
                  <span className="font-medium">
                    {SIGNATORIES.find((s) => s.id === settings.signatory)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Issue Date</span>
                  <span className="font-medium">{settings.issueDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Copies</span>
                  <span className="font-medium">{settings.copies}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                className="w-full"
                onClick={() => setShowPreviewModal(false)}>

                  <Check className="w-4 h-4 mr-2" />
                  Confirm & Generate
                </Button>
                <Button variant="outline" className="w-full">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Preview
                </Button>
              </div>
            </div>
          </div>
        }
      </Modal>

      {/* Generate Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => !isGenerating && setShowGenerateModal(false)}
        title={
        isGenerating ?
        'Generating Certificate...' :
        generationComplete ?
        'Certificate Generated' :
        'Confirm Generation'
        }
        size="md">

        {!isGenerating && !generationComplete ?
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {(() => {
                  const CertIcon = getCurrentCertType()?.icon;
                  return CertIcon ?
                  <CertIcon className="w-6 h-6 text-blue-600" /> :
                  null;
                })()}
                </div>
                <div>
                  <div className="font-semibold text-blue-800">
                    {getCurrentCertType()?.label}
                  </div>
                  <div className="text-sm text-blue-600">{student?.name}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Certificate No</span>
                <span className="font-mono font-medium">
                  {getCertificateNumber()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Issue Date</span>
                <span className="font-medium">{settings.issueDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Copies</span>
                <span className="font-medium">{settings.copies}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}>

                Cancel
              </Button>
              <Button onClick={startGeneration}>
                <Save className="w-4 h-4 mr-2" />
                Generate Certificate
              </Button>
            </div>
          </div> :
        isGenerating ?
        <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Generating Certificate</h3>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div> :

        <div className="space-y-6">
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">
                Certificate Generated Successfully!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Certificate No: {getCertificateNumber()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button className="w-full">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>

            <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setShowGenerateModal(false);
              setGenerationComplete(false);
            }}>

              Close
            </Button>
          </div>
        }
      </Modal>
    </div>);

}