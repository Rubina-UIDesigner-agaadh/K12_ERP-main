import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  ShieldAlert,
  Search,
  UserX,
  FileWarning,
  Gavel,
  History,
  Lock,
  Paperclip,
  BellRing,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  Info,
  Calendar,
  BookOpen,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  Filter,
  Download,
  Printer,
  Edit3,
  Save,
  Clock,
  User,
  School,
  Hash,
  AlertTriangle,
  FileText,
  Upload,
  Camera,
  MessageSquare,
  Mail,
  Phone,
  RefreshCw,
  RotateCcw,
  ChevronLeft,
  Send,
  XCircle,
  CheckCircle,
  Image,
  File,
  Video,
  ExternalLink,
  Copy,
  Users,
  Building,
  Shield,
  Scale,
  Briefcase } from
'lucide-react';

// Types
interface Incident {
  id: string;
  studentId: string;
  studentName: string;
  grNo: string;
  rollNo: string;
  standard: string;
  section: string;
  examName: string;
  examDate: string;
  incidentDate: string;
  incidentTime: string;
  incidentType: 'Malpractice' | 'Misconduct' | 'Cheating' | 'Impersonation' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Reported' | 'Investigation' | 'Hearing Scheduled' | 'Action Taken' | 'Closed' | 'Appealed';
  description: string;
  location: string;
  witnesses: string[];
  evidence: Evidence[];
  action: string;
  actionDate: string;
  remarks: string;
  reportedBy: string;
  investigatedBy: string;
  parentNotified: boolean;
  parentNotifiedDate: string;
  hearingDate: string;
  hearingNotes: string;
  appealStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Evidence {
  id: string;
  type: 'image' | 'video' | 'document' | 'other';
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Student {
  id: string;
  grNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  standard: string;
  section: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  email: string;
  incidentCount: number;
}

type ViewMode = 'list' | 'detail' | 'new';

export function DisciplinaryLog() {
  // View State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Search & Filter State
  const [searchFilters, setSearchFilters] = useState({
    grNo: '',
    rollNo: '',
    firstName: '',
    lastName: '',
    standard: '',
    section: '',
    incidentType: '',
    severity: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    examName: ''
  });
  const [hasSearched, setHasSearched] = useState(false);

  // New Incident Form State
  const [incidentForm, setIncidentForm] = useState({
    studentId: '',
    examName: '',
    examDate: '',
    incidentDate: '',
    incidentTime: '',
    incidentType: '',
    severity: '',
    description: '',
    location: '',
    witnesses: '',
    action: '',
    remarks: ''
  });
  const [selectedStudentForIncident, setSelectedStudentForIncident] = useState<Student | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showStudentSearch, setShowStudentSearch] = useState(false);

  // Master Data
  const standards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D'];
  const incidentTypes = ['Malpractice', 'Misconduct', 'Cheating', 'Impersonation', 'Other'];
  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Reported', 'Investigation', 'Hearing Scheduled', 'Action Taken', 'Closed', 'Appealed'];
  const actionOptions = [
  'Verbal Warning',
  'Written Warning',
  'Deduction of Marks',
  'Cancellation of Paper',
  'Suspension from Current Exam',
  'Suspension from All Exams (Term)',
  'Suspension from School',
  'Expulsion',
  'No Action (Cleared)',
  'Under Review'];


  // Mock Students Data
  const allStudents: Student[] = [
  { id: '1', grNo: 'GR2024001', rollNo: '101', firstName: 'Aarav', lastName: 'Sharma', fullName: 'Aarav Sharma', standard: '10', section: 'A', fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', contactNumber: '9876543210', email: 'rajesh.sharma@email.com', incidentCount: 0 },
  { id: '2', grNo: 'GR2024002', rollNo: '102', firstName: 'Priya', lastName: 'Patel', fullName: 'Priya Patel', standard: '10', section: 'A', fatherName: 'Mahesh Patel', motherName: 'Kavita Patel', contactNumber: '9876543211', email: 'mahesh.patel@email.com', incidentCount: 1 },
  { id: '3', grNo: 'GR2024003', rollNo: '103', firstName: 'Rahul', lastName: 'Kumar', fullName: 'Rahul Kumar', standard: '10', section: 'B', fatherName: 'Suresh Kumar', motherName: 'Meena Kumar', contactNumber: '9876543212', email: 'suresh.kumar@email.com', incidentCount: 2 },
  { id: '4', grNo: 'GR2024004', rollNo: '104', firstName: 'Sneha', lastName: 'Gupta', fullName: 'Sneha Gupta', standard: '9', section: 'A', fatherName: 'Anil Gupta', motherName: 'Rekha Gupta', contactNumber: '9876543213', email: 'anil.gupta@email.com', incidentCount: 0 },
  { id: '5', grNo: 'GR2024005', rollNo: '105', firstName: 'Vikram', lastName: 'Singh', fullName: 'Vikram Singh', standard: '10', section: 'A', fatherName: 'Harinder Singh', motherName: 'Gurpreet Kaur', contactNumber: '9876543214', email: 'harinder.singh@email.com', incidentCount: 1 }];


  // Mock Incidents Data
  const [incidents, setIncidents] = useState<Incident[]>([
  {
    id: 'INC-2024-001',
    studentId: '3',
    studentName: 'Rahul Kumar',
    grNo: 'GR2024003',
    rollNo: '103',
    standard: '10',
    section: 'B',
    examName: 'Final Examination - Mathematics',
    examDate: '2024-03-15',
    incidentDate: '2024-03-15',
    incidentTime: '10:45 AM',
    incidentType: 'Malpractice',
    severity: 'High',
    status: 'Action Taken',
    description: 'Student was found using unauthorized digital notes stored in a smartwatch during the second half of the Mathematics examination. The invigilator noticed suspicious behavior and upon inspection, found the device with stored formulas and solutions.',
    location: 'Examination Hall A, Seat No. 15',
    witnesses: ['Mr. Sharma (Invigilator)', 'Ms. Verma (Flying Squad)'],
    evidence: [
    { id: '1', type: 'image', name: 'smartwatch_evidence.jpg', size: '2.4 MB', uploadedBy: 'Exam Controller', uploadedAt: '2024-03-15' },
    { id: '2', type: 'document', name: 'invigilator_report.pdf', size: '156 KB', uploadedBy: 'Mr. Sharma', uploadedAt: '2024-03-15' }],

    action: 'Suspension from remaining exams of current term',
    actionDate: '2024-03-16',
    remarks: 'Parents were called and informed about the incident. Student has been counseled.',
    reportedBy: 'Mr. Sharma (Invigilator)',
    investigatedBy: 'Exam Controller',
    parentNotified: true,
    parentNotifiedDate: '2024-03-15',
    hearingDate: '2024-03-16',
    hearingNotes: 'Student admitted to the offense. Parents present during hearing. Disciplinary committee recommended suspension.',
    appealStatus: 'None',
    createdAt: '2024-03-15T10:50:00',
    updatedAt: '2024-03-16T14:30:00'
  },
  {
    id: 'INC-2024-002',
    studentId: '2',
    studentName: 'Priya Patel',
    grNo: 'GR2024002',
    rollNo: '102',
    standard: '10',
    section: 'A',
    examName: 'Final Examination - Physics',
    examDate: '2024-03-16',
    incidentDate: '2024-03-16',
    incidentTime: '02:30 PM',
    incidentType: 'Misconduct',
    severity: 'Medium',
    status: 'Investigation',
    description: 'Student was repeatedly talking to neighboring students and causing disturbance in the examination hall despite multiple warnings from the invigilator.',
    location: 'Examination Hall B, Seat No. 22',
    witnesses: ['Ms. Gupta (Invigilator)'],
    evidence: [
    { id: '3', type: 'document', name: 'warning_memo.pdf', size: '98 KB', uploadedBy: 'Ms. Gupta', uploadedAt: '2024-03-16' }],

    action: 'Under Review',
    actionDate: '',
    remarks: 'Investigation ongoing. Waiting for statements from neighboring students.',
    reportedBy: 'Ms. Gupta (Invigilator)',
    investigatedBy: 'Vice Principal',
    parentNotified: false,
    parentNotifiedDate: '',
    hearingDate: '2024-03-18',
    hearingNotes: '',
    appealStatus: 'None',
    createdAt: '2024-03-16T14:35:00',
    updatedAt: '2024-03-16T14:35:00'
  },
  {
    id: 'INC-2024-003',
    studentId: '5',
    studentName: 'Vikram Singh',
    grNo: 'GR2024005',
    rollNo: '105',
    standard: '10',
    section: 'A',
    examName: 'Unit Test 2 - Chemistry',
    examDate: '2024-02-20',
    incidentDate: '2024-02-20',
    incidentTime: '11:15 AM',
    incidentType: 'Cheating',
    severity: 'High',
    status: 'Closed',
    description: 'Student was caught exchanging answer sheets with another student during the Chemistry unit test.',
    location: 'Classroom 10-A',
    witnesses: ['Mr. Patel (Subject Teacher)', 'Ms. Reddy (Lab Assistant)'],
    evidence: [
    { id: '4', type: 'image', name: 'answer_sheet_1.jpg', size: '1.8 MB', uploadedBy: 'Mr. Patel', uploadedAt: '2024-02-20' },
    { id: '5', type: 'image', name: 'answer_sheet_2.jpg', size: '1.7 MB', uploadedBy: 'Mr. Patel', uploadedAt: '2024-02-20' }],

    action: 'Cancellation of Paper + Written Warning',
    actionDate: '2024-02-21',
    remarks: 'Both students received zero marks for the test. Parents notified and warning letter issued.',
    reportedBy: 'Mr. Patel (Subject Teacher)',
    investigatedBy: 'Class Teacher',
    parentNotified: true,
    parentNotifiedDate: '2024-02-20',
    hearingDate: '2024-02-21',
    hearingNotes: 'Both students confessed. Parents were present. Warning issued with strict monitoring for future exams.',
    appealStatus: 'None',
    createdAt: '2024-02-20T11:20:00',
    updatedAt: '2024-02-21T16:00:00'
  },
  {
    id: 'INC-2024-004',
    studentId: '3',
    studentName: 'Rahul Kumar',
    grNo: 'GR2024003',
    rollNo: '103',
    standard: '10',
    section: 'B',
    examName: 'Mid Term - English',
    examDate: '2024-01-15',
    incidentDate: '2024-01-15',
    incidentTime: '09:30 AM',
    incidentType: 'Misconduct',
    severity: 'Low',
    status: 'Closed',
    description: 'Student was found with mobile phone in the examination hall. Phone was switched off and no evidence of misuse was found.',
    location: 'Examination Hall A, Seat No. 8',
    witnesses: ['Mr. Verma (Invigilator)'],
    evidence: [],
    action: 'Verbal Warning',
    actionDate: '2024-01-15',
    remarks: 'Phone confiscated and returned after exam. First offense - verbal warning given.',
    reportedBy: 'Mr. Verma (Invigilator)',
    investigatedBy: 'Exam Coordinator',
    parentNotified: false,
    parentNotifiedDate: '',
    hearingDate: '',
    hearingNotes: '',
    appealStatus: 'None',
    createdAt: '2024-01-15T09:35:00',
    updatedAt: '2024-01-15T12:00:00'
  }]
  );

  // Computed Values
  const filteredIncidents = incidents.filter((incident) => {
    const matchGrNo = !searchFilters.grNo || incident.grNo.toLowerCase().includes(searchFilters.grNo.toLowerCase());
    const matchRollNo = !searchFilters.rollNo || incident.rollNo.includes(searchFilters.rollNo);
    const matchFirstName = !searchFilters.firstName || incident.studentName.toLowerCase().includes(searchFilters.firstName.toLowerCase());
    const matchStandard = !searchFilters.standard || incident.standard === searchFilters.standard;
    const matchSection = !searchFilters.section || incident.section === searchFilters.section;
    const matchType = !searchFilters.incidentType || incident.incidentType === searchFilters.incidentType;
    const matchSeverity = !searchFilters.severity || incident.severity === searchFilters.severity;
    const matchStatus = !searchFilters.status || incident.status === searchFilters.status;
    const matchExam = !searchFilters.examName || incident.examName.toLowerCase().includes(searchFilters.examName.toLowerCase());

    return matchGrNo && matchRollNo && matchFirstName && matchStandard && matchSection && matchType && matchSeverity && matchStatus && matchExam;
  });

  const stats = {
    total: incidents.length,
    reported: incidents.filter((i) => i.status === 'Reported').length,
    investigation: incidents.filter((i) => i.status === 'Investigation').length,
    actionTaken: incidents.filter((i) => i.status === 'Action Taken').length,
    closed: incidents.filter((i) => i.status === 'Closed').length,
    highSeverity: incidents.filter((i) => i.severity === 'High' || i.severity === 'Critical').length
  };

  // Handlers
  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    setSearchFilters({
      grNo: '',
      rollNo: '',
      firstName: '',
      lastName: '',
      standard: '',
      section: '',
      incidentType: '',
      severity: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      examName: ''
    });
    setHasSearched(false);
  };

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setViewMode('detail');
  };

  const handleNewIncident = () => {
    setIncidentForm({
      studentId: '',
      examName: '',
      examDate: '',
      incidentDate: new Date().toISOString().split('T')[0],
      incidentTime: '',
      incidentType: '',
      severity: '',
      description: '',
      location: '',
      witnesses: '',
      action: '',
      remarks: ''
    });
    setSelectedStudentForIncident(null);
    setViewMode('new');
  };

  const handleSaveIncident = () => {
    if (!selectedStudentForIncident || !incidentForm.incidentType || !incidentForm.severity || !incidentForm.description) {
      alert('Please fill all required fields');
      return;
    }

    const newIncident: Incident = {
      id: `INC-2024-${String(incidents.length + 1).padStart(3, '0')}`,
      studentId: selectedStudentForIncident.id,
      studentName: selectedStudentForIncident.fullName,
      grNo: selectedStudentForIncident.grNo,
      rollNo: selectedStudentForIncident.rollNo,
      standard: selectedStudentForIncident.standard,
      section: selectedStudentForIncident.section,
      examName: incidentForm.examName,
      examDate: incidentForm.examDate,
      incidentDate: incidentForm.incidentDate,
      incidentTime: incidentForm.incidentTime,
      incidentType: incidentForm.incidentType as any,
      severity: incidentForm.severity as any,
      status: 'Reported',
      description: incidentForm.description,
      location: incidentForm.location,
      witnesses: incidentForm.witnesses.split(',').map((w) => w.trim()).filter((w) => w),
      evidence: [],
      action: incidentForm.action || 'Under Review',
      actionDate: '',
      remarks: incidentForm.remarks,
      reportedBy: 'Current User',
      investigatedBy: '',
      parentNotified: false,
      parentNotifiedDate: '',
      hearingDate: '',
      hearingNotes: '',
      appealStatus: 'None',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setViewMode('list');
    alert('Incident logged successfully!');
  };

  const handleSelectStudentForIncident = (student: Student) => {
    setSelectedStudentForIncident(student);
    setShowStudentSearch(false);
    setStudentSearchQuery('');
  };

  const searchStudentsForIncident = () => {
    return allStudents.filter((student) =>
    student.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.grNo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.rollNo.includes(studentSearchQuery)
    );
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedIncident) {
      setIncidents((prev) => prev.map((inc) =>
      inc.id === selectedIncident.id ?
      { ...inc, status: newStatus as any, updatedAt: new Date().toISOString() } :
      inc
      ));
      setSelectedIncident((prev) => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  const handleUpdateAction = (newAction: string) => {
    if (selectedIncident) {
      setIncidents((prev) => prev.map((inc) =>
      inc.id === selectedIncident.id ?
      { ...inc, action: newAction, actionDate: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString() } :
      inc
      ));
      setSelectedIncident((prev) => prev ? { ...prev, action: newAction, actionDate: new Date().toISOString().split('T')[0] } : null);
    }
  };

  const handleDeleteIncident = (incidentId: string) => {
    if (confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
      setIncidents((prev) => prev.filter((inc) => inc.id !== incidentId));
      setViewMode('list');
      setSelectedIncident(null);
    }
  };

  // Utility Functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High':return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Critical':return 'bg-red-100 text-red-700 border-red-200';
      default:return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported':return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Investigation':return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Hearing Scheduled':return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Action Taken':return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Closed':return 'bg-green-100 text-green-700 border-green-200';
      case 'Appealed':return 'bg-red-100 text-red-700 border-red-200';
      default:return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Malpractice':return FileWarning;
      case 'Misconduct':return AlertTriangle;
      case 'Cheating':return XCircle;
      case 'Impersonation':return UserX;
      default:return AlertCircle;
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'image':return Image;
      case 'video':return Video;
      case 'document':return FileText;
      default:return File;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            {viewMode !== 'list' &&
            <Button variant="ghost" onClick={() => setViewMode('list')} className="mr-2">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            }
            <div className="p-3 bg-red-600 rounded-xl shadow-lg">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Disciplinary Log</h1>
                <Badge className="bg-red-100 text-red-700 border border-red-200">
                  <Lock className="w-3 h-3 mr-1" />
                  Admin Only
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Secure records of examination misconduct & disciplinary actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewMode === 'list' &&
            <>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleNewIncident}>

                  <Plus className="w-4 h-4 mr-2" />
                  Log New Incident
                </Button>
              </>
            }
            {viewMode === 'detail' && selectedIncident &&
            <>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteIncident(selectedIncident.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            }
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' &&
      <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileWarning className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Incidents</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reported</p>
                  <p className="text-xl font-bold text-gray-900">{stats.reported}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Search className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Investigation</p>
                  <p className="text-xl font-bold text-gray-900">{stats.investigation}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Gavel className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Action Taken</p>
                  <p className="text-xl font-bold text-gray-900">{stats.actionTaken}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Closed</p>
                  <p className="text-xl font-bold text-gray-900">{stats.closed}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">High Severity</p>
                  <p className="text-xl font-bold text-gray-900">{stats.highSeverity}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search & Filter Card */}
          <Card className="overflow-hidden">
            <div
            className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Search & Filter Incidents</h2>
                </div>
                {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            {showFilters &&
          <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">GR Number</label>
                    <input
                  type="text"
                  value={searchFilters.grNo}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, grNo: e.target.value }))}
                  placeholder="GR2024001"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />

                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Roll Number</label>
                    <input
                  type="text"
                  value={searchFilters.rollNo}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, rollNo: e.target.value }))}
                  placeholder="101"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />

                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Student Name</label>
                    <input
                  type="text"
                  value={searchFilters.firstName}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Name"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />

                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Class</label>
                    <select
                  value={searchFilters.standard}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, standard: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">

                      <option value="">All Classes</option>
                      {standards.map((s) => <option key={s} value={s}>Class {s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Section</label>
                    <select
                  value={searchFilters.section}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, section: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">

                      <option value="">All</option>
                      {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Exam Name</label>
                    <input
                  type="text"
                  value={searchFilters.examName}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, examName: e.target.value }))}
                  placeholder="Mathematics..."
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />

                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Incident Type</label>
                    <select
                  value={searchFilters.incidentType}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, incidentType: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">

                      <option value="">All Types</option>
                      {incidentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Severity</label>
                    <select
                  value={searchFilters.severity}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, severity: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">

                      <option value="">All</option>
                      {severityLevels.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Status</label>
                    <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">

                      <option value="">All Status</option>
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Date From</label>
                    <input
                  type="date"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />

                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Date To</label>
                    <input
                  type="date"
                  value={searchFilters.dateTo}
                  onChange={(e) => setSearchFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />

                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <Button variant="ghost" onClick={handleResetFilters}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
          }
          </Card>

          {/* Incidents Table */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Incident Records ({filteredIncidents.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Incident ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Exam</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Severity</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIncidents.length === 0 ?
                <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No incidents found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search filters</p>
                      </td>
                    </tr> :

                filteredIncidents.map((incident) => {
                  const TypeIcon = getTypeIcon(incident.incidentType);
                  return (
                    <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-sm font-bold text-red-600">{incident.id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700">
                                {incident.studentName.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{incident.studentName}</p>
                                <p className="text-xs text-gray-500">{incident.grNo} • Class {incident.standard}-{incident.section}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-900">{incident.examName}</p>
                            <p className="text-xs text-gray-500">{formatDate(incident.examDate)}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{incident.incidentType}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {formatDate(incident.incidentDate)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewIncident(incident)}>

                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>);

                })
                }
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      }

      {/* Detail View */}
      {viewMode === 'detail' && selectedIncident &&
      <div className="space-y-6">
          {/* Incident Header */}
          <Card className="overflow-hidden">
            <div className={`p-6 text-white ${
          selectedIncident.severity === 'Critical' ? 'bg-gradient-to-r from-red-700 to-red-800' :
          selectedIncident.severity === 'High' ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
          selectedIncident.severity === 'Medium' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
          'bg-gradient-to-r from-green-600 to-green-700'}`
          }>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {selectedIncident.studentName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{selectedIncident.studentName}</h2>
                      <Badge className="bg-white/20 text-white">{selectedIncident.id}</Badge>
                    </div>
                    <p className="text-white/80">
                      {selectedIncident.grNo} • Class {selectedIncident.standard}-{selectedIncident.section} • Roll No. {selectedIncident.rollNo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    {selectedIncident.severity} Severity
                  </Badge>
                  <Badge className={`${getStatusColor(selectedIncident.status)} text-base px-4 py-2`}>
                    {selectedIncident.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Incident Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Exam & Incident Info */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-600" />
                  Examination Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Exam Name</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.examName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Exam Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedIncident.examDate)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Incident Date & Time</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedIncident.incidentDate)} at {selectedIncident.incidentTime}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.location || '-'}</p>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Incident Description
                </h3>
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-gray-700 leading-relaxed italic">
                    "{selectedIncident.description}"
                  </p>
                </div>

                {selectedIncident.witnesses.length > 0 &&
              <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Witnesses:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedIncident.witnesses.map((witness, idx) =>
                  <Badge key={idx} className="bg-gray-100 text-gray-700">
                          <User className="w-3 h-3 mr-1" />
                          {witness}
                        </Badge>
                  )}
                    </div>
                  </div>
              }
              </Card>

              {/* Evidence */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-red-600" />
                    Evidence Attached
                  </h3>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Evidence
                  </Button>
                </div>

                {selectedIncident.evidence.length === 0 ?
              <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-center">
                    <Paperclip className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No evidence files attached</p>
                  </div> :

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedIncident.evidence.map((file) => {
                  const FileIcon = getEvidenceIcon(file.type);
                  return (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg">
                              <FileIcon className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size} • {file.uploadedBy}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>);

                })}
                  </div>
              }
              </Card>

              {/* Hearing Notes */}
              {selectedIncident.hearingDate &&
            <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-red-600" />
                    Hearing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Hearing Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(selectedIncident.hearingDate)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Investigated By</p>
                      <p className="font-semibold text-gray-900">{selectedIncident.investigatedBy || '-'}</p>
                    </div>
                  </div>
                  {selectedIncident.hearingNotes &&
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <p className="text-xs text-indigo-600 uppercase font-semibold mb-2">Hearing Notes</p>
                      <p className="text-gray-700">{selectedIncident.hearingNotes}</p>
                    </div>
              }
                </Card>
            }

              {/* Remarks */}
              {selectedIncident.remarks &&
            <Card className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-red-600" />
                    Additional Remarks
                  </h3>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700">{selectedIncident.remarks}</p>
                  </div>
                </Card>
            }
            </div>

            {/* Right Column - Actions & Status */}
            <div className="space-y-6">
              {/* Action Panel */}
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Disciplinary Action
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-red-800">Current Action</label>
                    <select
                    value={selectedIncident.action}
                    onChange={(e) => handleUpdateAction(e.target.value)}
                    className="w-full rounded-lg border border-red-200 p-3 bg-white focus:ring-2 focus:ring-red-500 outline-none">

                      {actionOptions.map((action) =>
                    <option key={action} value={action}>{action}</option>
                    )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-red-800">Update Status</label>
                    <select
                    value={selectedIncident.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="w-full rounded-lg border border-red-200 p-3 bg-white focus:ring-2 focus:ring-red-500 outline-none">

                      {statusOptions.map((status) =>
                    <option key={status} value={status}>{status}</option>
                    )}
                    </select>
                  </div>

                  {selectedIncident.actionDate &&
                <div className="p-3 bg-white rounded-lg border border-red-100">
                      <p className="text-xs text-red-600 uppercase font-semibold mb-1">Action Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(selectedIncident.actionDate)}</p>
                    </div>
                }

                  <Button variant="primary" className="w-full bg-red-600 hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <BellRing className="w-5 h-5" />
                  Notifications
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Parent Notification</span>
                    </div>
                    {selectedIncident.parentNotified ?
                  <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600">{formatDate(selectedIncident.parentNotifiedDate)}</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div> :

                  <Button variant="outline" size="sm" className="text-xs">
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </Button>
                  }
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Class Teacher Alert</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Principal Sign-off</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Send className="w-3 h-3 mr-1" />
                      Request
                    </Button>
                  </div>
                </div>

                <Button variant="primary" className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send All Alerts
                </Button>
              </Card>

              {/* Meta Info */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Log Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Reported By</span>
                    <span className="font-medium text-gray-900">{selectedIncident.reportedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Investigated By</span>
                    <span className="font-medium text-gray-900">{selectedIncident.investigatedBy || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium text-gray-900">{formatDateTime(selectedIncident.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium text-gray-900">{formatDateTime(selectedIncident.updatedAt)}</span>
                  </div>
                </div>
              </Card>

              {/* Policy Note */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-orange-900">Institutional Policy</p>
                    <p className="text-xs text-orange-700 mt-1">
                      High severity incidents require mandatory physical presence of parents within 24 hours of logging.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* New Incident View */}
      {viewMode === 'new' &&
      <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
            <h2 className="text-2xl font-bold">Log New Incident</h2>
            <p className="text-red-100 mt-1">Record a new disciplinary incident</p>
          </Card>

          {/* Student Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              Student Information
            </h3>

            {selectedStudentForIncident ?
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center text-lg font-bold text-red-700">
                    {selectedStudentForIncident.firstName.charAt(0)}{selectedStudentForIncident.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedStudentForIncident.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {selectedStudentForIncident.grNo} • Class {selectedStudentForIncident.standard}-{selectedStudentForIncident.section} • Roll {selectedStudentForIncident.rollNo}
                    </p>
                    {selectedStudentForIncident.incidentCount > 0 &&
                <Badge className="mt-1 bg-orange-100 text-orange-700">
                        {selectedStudentForIncident.incidentCount} Previous Incident(s)
                      </Badge>
                }
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedStudentForIncident(null)}>
                  <X className="w-4 h-4 mr-1" /> Change
                </Button>
              </div> :

          <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => {
                  setStudentSearchQuery(e.target.value);
                  setShowStudentSearch(e.target.value.length > 0);
                }}
                placeholder="Search by name, GR No, or Roll No..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none" />

                </div>

                {showStudentSearch && studentSearchQuery &&
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                    {searchStudentsForIncident().length === 0 ?
              <div className="p-4 text-center text-gray-500">No students found</div> :

              searchStudentsForIncident().map((student) =>
              <div
                key={student.id}
                onClick={() => handleSelectStudentForIncident(student)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.fullName}</p>
                              <p className="text-xs text-gray-500">{student.grNo} • Class {student.standard}-{student.section}</p>
                            </div>
                          </div>
                        </div>
              )
              }
                  </div>
            }
              </div>
          }
          </Card>

          {/* Incident Details */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-red-600" />
              Incident Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Exam Name *</label>
                <input
                type="text"
                value={incidentForm.examName}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, examName: e.target.value }))}
                placeholder="e.g. Final Examination - Mathematics"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Exam Date</label>
                <input
                type="date"
                value={incidentForm.examDate}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, examDate: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Incident Date *</label>
                <input
                type="date"
                value={incidentForm.incidentDate}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, incidentDate: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Incident Time</label>
                <input
                type="time"
                value={incidentForm.incidentTime}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, incidentTime: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Incident Type *</label>
                <select
                value={incidentForm.incidentType}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, incidentType: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none">

                  <option value="">Select Type</option>
                  {incidentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Severity *</label>
                <select
                value={incidentForm.severity}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, severity: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none">

                  <option value="">Select Severity</option>
                  {severityLevels.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Location</label>
                <input
                type="text"
                value={incidentForm.location}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Examination Hall A, Seat No. 15"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description *</label>
                <textarea
                value={incidentForm.description}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the incident..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none resize-none" />

              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Witnesses (comma separated)</label>
                <input
                type="text"
                value={incidentForm.witnesses}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, witnesses: e.target.value }))}
                placeholder="e.g. Mr. Sharma (Invigilator), Ms. Verma (Teacher)"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Initial Action</label>
                <select
                value={incidentForm.action}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, action: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none">

                  <option value="">Under Review</option>
                  {actionOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Additional Remarks</label>
                <input
                type="text"
                value={incidentForm.remarks}
                onChange={(e) => setIncidentForm((prev) => ({ ...prev, remarks: e.target.value }))}
                placeholder="Any additional notes..."
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-red-500 outline-none" />

              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setViewMode('list')}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={handleSaveIncident}>
              <Save className="w-4 h-4 mr-2" />
              Log Incident
            </Button>
          </div>
        </div>
      }
    </div>);

}

export default DisciplinaryLog;