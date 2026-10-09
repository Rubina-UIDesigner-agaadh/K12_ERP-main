import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  BookOpen,
  Users,
  GraduationCap,
  Filter,
  Upload,
  Download,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  FileSpreadsheet,
  Save,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckSquare,
  Eye,
  Edit3,
  School,
  Calendar,
  Layers,
  UserCheck,
  UserX,
  FileX,
  Settings,
  Grid,
  List,
  PieChart,
  BarChart3,
  Info,
  Copy,
  Lock,
  Unlock,
  Check,
  Hash,
  Percent,
  ClipboardList,
  ArrowRight,
  RefreshCw,
  Printer,
  ChevronRight,
  User,
  Building,
  BookMarked,
  Target,
  Award } from
'lucide-react';

// Types
interface OptionalSubjectConfig {
  id: string;
  standardId: string;
  standardName: string;
  minSubjects: number;
  maxSubjects: number;
  availableSubjects: SubjectOption[];
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
}

interface SubjectOption {
  id: string;
  name: string;
  code: string;
  category: string;
  maxSeats: number;
  currentEnrollment: number;
  isActive: boolean;
}

interface StudentSubjectMapping {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grNo: string;
  standard: string;
  division: string;
  coreSubjects: string[];
  optionalSubjects: string[];
  mappingStatus: 'Complete' | 'Partial' | 'Pending';
  mappedOn: string;
  mappedBy: string;
}

// View Modes
type ViewMode = 'config' | 'students';
type StudentViewMode = 'grid' | 'list' | 'summary';

export function StudentOptionalSubject() {
  // Main View State
  const [activeView, setActiveView] = useState<ViewMode>('config');

  // Academic Year
  const [academicYear, setAcademicYear] = useState('2024-25');

  // Configuration State
  const [selectedConfigStandard, setSelectedConfigStandard] = useState<string | null>(null);
  const [configs, setConfigs] = useState<OptionalSubjectConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<OptionalSubjectConfig | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);

  // Student View State
  const [studentViewMode, setStudentViewMode] = useState<StudentViewMode>('list');
  const [studentFilters, setStudentFilters] = useState({
    standard: 'All',
    division: 'All',
    optionalSubject: 'All',
    mappingStatus: 'All',
    searchQuery: ''
  });
  const [students, setStudents] = useState<StudentSubjectMapping[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Config Form State
  const [configForm, setConfigForm] = useState({
    standardId: '',
    minSubjects: 1,
    maxSubjects: 2,
    availableSubjects: [] as SubjectOption[]
  });

  // Master Data
  const academicYears = ['2023-24', '2024-25', '2025-26'];
  const standards = [
  { id: '8', name: 'Standard 8' },
  { id: '9', name: 'Standard 9' },
  { id: '10', name: 'Standard 10' },
  { id: '11', name: 'Standard 11 (Science)' },
  { id: '11-C', name: 'Standard 11 (Commerce)' },
  { id: '12', name: 'Standard 12 (Science)' },
  { id: '12-C', name: 'Standard 12 (Commerce)' }];

  const divisions = ['A', 'B', 'C', 'D'];

  // All Available Subjects for Selection
  const allSubjects: SubjectOption[] = [
  { id: '1', name: 'Sanskrit', code: 'SKT', category: 'Language', maxSeats: 60, currentEnrollment: 45, isActive: true },
  { id: '2', name: 'French', code: 'FRE', category: 'Language', maxSeats: 40, currentEnrollment: 38, isActive: true },
  { id: '3', name: 'German', code: 'GER', category: 'Language', maxSeats: 30, currentEnrollment: 22, isActive: true },
  { id: '4', name: 'Spanish', code: 'SPA', category: 'Language', maxSeats: 30, currentEnrollment: 15, isActive: true },
  { id: '5', name: 'Computer Applications', code: 'CA', category: 'Technical', maxSeats: 80, currentEnrollment: 75, isActive: true },
  { id: '6', name: 'Information Technology', code: 'IT', category: 'Technical', maxSeats: 60, currentEnrollment: 55, isActive: true },
  { id: '7', name: 'Art & Craft', code: 'ART', category: 'Creative', maxSeats: 40, currentEnrollment: 32, isActive: true },
  { id: '8', name: 'Music (Vocal)', code: 'MUS-V', category: 'Creative', maxSeats: 30, currentEnrollment: 28, isActive: true },
  { id: '9', name: 'Music (Instrumental)', code: 'MUS-I', category: 'Creative', maxSeats: 20, currentEnrollment: 18, isActive: true },
  { id: '10', name: 'Physical Education', code: 'PE', category: 'Sports', maxSeats: 100, currentEnrollment: 85, isActive: true },
  { id: '11', name: 'Home Science', code: 'HS', category: 'Vocational', maxSeats: 40, currentEnrollment: 35, isActive: true },
  { id: '12', name: 'Psychology', code: 'PSY', category: 'Humanities', maxSeats: 50, currentEnrollment: 42, isActive: true },
  { id: '13', name: 'Economics', code: 'ECO', category: 'Commerce', maxSeats: 60, currentEnrollment: 58, isActive: true },
  { id: '14', name: 'Business Studies', code: 'BS', category: 'Commerce', maxSeats: 60, currentEnrollment: 55, isActive: true },
  { id: '15', name: 'Accountancy', code: 'ACC', category: 'Commerce', maxSeats: 60, currentEnrollment: 52, isActive: true }];


  // Initialize Mock Data
  useEffect(() => {
    // Mock Configurations
    const mockConfigs: OptionalSubjectConfig[] = [
    {
      id: '1',
      standardId: '8',
      standardName: 'Standard 8',
      minSubjects: 1,
      maxSubjects: 1,
      availableSubjects: allSubjects.filter((s) => ['1', '2', '3', '7', '8'].includes(s.id)),
      isActive: true,
      lastUpdated: '2024-02-15',
      updatedBy: 'Admin'
    },
    {
      id: '2',
      standardId: '9',
      standardName: 'Standard 9',
      minSubjects: 1,
      maxSubjects: 2,
      availableSubjects: allSubjects.filter((s) => ['1', '2', '3', '5', '7', '8', '11'].includes(s.id)),
      isActive: true,
      lastUpdated: '2024-02-15',
      updatedBy: 'Admin'
    },
    {
      id: '3',
      standardId: '10',
      standardName: 'Standard 10',
      minSubjects: 1,
      maxSubjects: 2,
      availableSubjects: allSubjects.filter((s) => ['1', '2', '3', '5', '6', '7', '8', '10', '11'].includes(s.id)),
      isActive: true,
      lastUpdated: '2024-02-10',
      updatedBy: 'Principal'
    },
    {
      id: '4',
      standardId: '11',
      standardName: 'Standard 11 (Science)',
      minSubjects: 1,
      maxSubjects: 1,
      availableSubjects: allSubjects.filter((s) => ['5', '6', '10', '12'].includes(s.id)),
      isActive: true,
      lastUpdated: '2024-02-08',
      updatedBy: 'Admin'
    },
    {
      id: '5',
      standardId: '11-C',
      standardName: 'Standard 11 (Commerce)',
      minSubjects: 2,
      maxSubjects: 2,
      availableSubjects: allSubjects.filter((s) => ['5', '12', '13', '14', '15'].includes(s.id)),
      isActive: true,
      lastUpdated: '2024-02-08',
      updatedBy: 'Admin'
    }];

    setConfigs(mockConfigs);

    // Mock Students
    const mockStudents: StudentSubjectMapping[] = [
    { id: '1', studentId: 'STU001', studentName: 'Aarav Sharma', rollNo: '101', grNo: 'GR2024001', standard: '10', division: 'A', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: ['Sanskrit', 'Computer Applications'], mappingStatus: 'Complete', mappedOn: '2024-04-10', mappedBy: 'Self' },
    { id: '2', studentId: 'STU002', studentName: 'Priya Patel', rollNo: '102', grNo: 'GR2024002', standard: '10', division: 'A', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: ['French'], mappingStatus: 'Partial', mappedOn: '2024-04-11', mappedBy: 'Self' },
    { id: '3', studentId: 'STU003', studentName: 'Rahul Kumar', rollNo: '103', grNo: 'GR2024003', standard: '10', division: 'A', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: [], mappingStatus: 'Pending', mappedOn: '', mappedBy: '' },
    { id: '4', studentId: 'STU004', studentName: 'Sneha Gupta', rollNo: '104', grNo: 'GR2024004', standard: '10', division: 'B', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: ['German', 'Art & Craft'], mappingStatus: 'Complete', mappedOn: '2024-04-09', mappedBy: 'Admin' },
    { id: '5', studentId: 'STU005', studentName: 'Vikram Singh', rollNo: '105', grNo: 'GR2024005', standard: '10', division: 'B', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: ['Computer Applications', 'Physical Education'], mappingStatus: 'Complete', mappedOn: '2024-04-08', mappedBy: 'Self' },
    { id: '6', studentId: 'STU006', studentName: 'Ananya Reddy', rollNo: '106', grNo: 'GR2024006', standard: '9', division: 'A', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: ['Sanskrit'], mappingStatus: 'Partial', mappedOn: '2024-04-12', mappedBy: 'Self' },
    { id: '7', studentId: 'STU007', studentName: 'Karthik Nair', rollNo: '107', grNo: 'GR2024007', standard: '9', division: 'A', coreSubjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science'], optionalSubjects: ['French', 'Computer Applications'], mappingStatus: 'Complete', mappedOn: '2024-04-10', mappedBy: 'Self' },
    { id: '8', studentId: 'STU008', studentName: 'Meera Iyer', rollNo: '108', grNo: 'GR2024008', standard: '11', division: 'A', coreSubjects: ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology'], optionalSubjects: ['Computer Science'], mappingStatus: 'Complete', mappedOn: '2024-04-07', mappedBy: 'Self' },
    { id: '9', studentId: 'STU009', studentName: 'Arjun Menon', rollNo: '109', grNo: 'GR2024009', standard: '11', division: 'B', coreSubjects: ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology'], optionalSubjects: [], mappingStatus: 'Pending', mappedOn: '', mappedBy: '' },
    { id: '10', studentId: 'STU010', studentName: 'Divya Sharma', rollNo: '110', grNo: 'GR2024010', standard: '11-C', division: 'A', coreSubjects: ['English', 'Accountancy', 'Business Studies', 'Economics'], optionalSubjects: ['Computer Applications', 'Psychology'], mappingStatus: 'Complete', mappedOn: '2024-04-06', mappedBy: 'Admin' }];

    setStudents(mockStudents);
  }, []);

  // Computed Values
  const filteredStudents = students.filter((student) => {
    const matchesStandard = studentFilters.standard === 'All' || student.standard === studentFilters.standard;
    const matchesDivision = studentFilters.division === 'All' || student.division === studentFilters.division;
    const matchesSubject = studentFilters.optionalSubject === 'All' || student.optionalSubjects.includes(studentFilters.optionalSubject);
    const matchesStatus = studentFilters.mappingStatus === 'All' || student.mappingStatus === studentFilters.mappingStatus;
    const matchesSearch = studentFilters.searchQuery === '' ||
    student.studentName.toLowerCase().includes(studentFilters.searchQuery.toLowerCase()) ||
    student.grNo.toLowerCase().includes(studentFilters.searchQuery.toLowerCase()) ||
    student.rollNo.includes(studentFilters.searchQuery);

    return matchesStandard && matchesDivision && matchesSubject && matchesStatus && matchesSearch;
  });

  const stats = {
    totalStudents: students.length,
    complete: students.filter((s) => s.mappingStatus === 'Complete').length,
    partial: students.filter((s) => s.mappingStatus === 'Partial').length,
    pending: students.filter((s) => s.mappingStatus === 'Pending').length,
    totalConfigs: configs.length,
    activeConfigs: configs.filter((c) => c.isActive).length
  };

  // Get all unique optional subjects from configs
  const allConfiguredSubjects = [...new Set(configs.flatMap((c) => c.availableSubjects.map((s) => s.name)))];

  // Handlers
  const handleSaveConfig = () => {
    if (!configForm.standardId) {
      alert('Please select a standard');
      return;
    }
    if (configForm.availableSubjects.length === 0) {
      alert('Please select at least one optional subject');
      return;
    }

    const standardInfo = standards.find((s) => s.id === configForm.standardId);

    if (editingConfig) {
      setConfigs((prev) => prev.map((c) =>
      c.id === editingConfig.id ?
      {
        ...c,
        ...configForm,
        standardName: standardInfo?.name || '',
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Admin'
      } :
      c
      ));
    } else {
      const newConfig: OptionalSubjectConfig = {
        id: Date.now().toString(),
        standardId: configForm.standardId,
        standardName: standardInfo?.name || '',
        minSubjects: configForm.minSubjects,
        maxSubjects: configForm.maxSubjects,
        availableSubjects: configForm.availableSubjects,
        isActive: true,
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'Admin'
      };
      setConfigs((prev) => [...prev, newConfig]);
    }

    resetConfigForm();
  };

  const handleEditConfig = (config: OptionalSubjectConfig) => {
    setEditingConfig(config);
    setConfigForm({
      standardId: config.standardId,
      minSubjects: config.minSubjects,
      maxSubjects: config.maxSubjects,
      availableSubjects: config.availableSubjects
    });
    setShowConfigForm(true);
  };

  const handleDeleteConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      setConfigs((prev) => prev.filter((c) => c.id !== configId));
    }
  };

  const handleToggleConfigActive = (configId: string) => {
    setConfigs((prev) => prev.map((c) =>
    c.id === configId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const resetConfigForm = () => {
    setConfigForm({
      standardId: '',
      minSubjects: 1,
      maxSubjects: 2,
      availableSubjects: []
    });
    setEditingConfig(null);
    setShowConfigForm(false);
  };

  const toggleSubjectInConfig = (subject: SubjectOption) => {
    setConfigForm((prev) => {
      const exists = prev.availableSubjects.some((s) => s.id === subject.id);
      return {
        ...prev,
        availableSubjects: exists ?
        prev.availableSubjects.filter((s) => s.id !== subject.id) :
        [...prev.availableSubjects, subject]
      };
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Complete':
        return <Badge className="bg-green-100 text-green-700 border border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>;
      case 'Partial':
        return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Partial</Badge>;
      case 'Pending':
        return <Badge className="bg-red-100 text-red-700 border border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  // Subject category colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Language': 'bg-blue-100 text-blue-700 border-blue-200',
      'Technical': 'bg-purple-100 text-purple-700 border-purple-200',
      'Creative': 'bg-pink-100 text-pink-700 border-pink-200',
      'Sports': 'bg-green-100 text-green-700 border-green-200',
      'Vocational': 'bg-orange-100 text-orange-700 border-orange-200',
      'Humanities': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Commerce': 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Optional Subject Management</h1>
              <p className="text-sm text-gray-500">Configure class-wise optional subjects and view student mappings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none">

              {academicYears.map((year) =>
              <option key={year} value={year}>{year}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeView === 'config' ? 'primary' : 'outline'}
          onClick={() => setActiveView('config')}
          className={activeView === 'config' ? 'bg-blue-600' : ''}>

          <Settings className="w-4 h-4 mr-2" />
          Subject Configuration
        </Button>
        <Button
          variant={activeView === 'students' ? 'primary' : 'outline'}
          onClick={() => setActiveView('students')}
          className={activeView === 'students' ? 'bg-blue-600' : ''}>

          <Users className="w-4 h-4 mr-2" />
          Student Mappings
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Configurations</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalConfigs}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Configs</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeConfigs}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Students</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Complete</p>
              <p className="text-xl font-bold text-gray-900">{stats.complete}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Partial</p>
              <p className="text-xl font-bold text-gray-900">{stats.partial}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration View */}
      {activeView === 'config' &&
      <div className="space-y-6">
          {/* Config Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Class-wise Optional Subject Configuration
            </h2>
            <Button
            variant="primary"
            className="bg-blue-600"
            onClick={() => {
              resetConfigForm();
              setShowConfigForm(true);
            }}>

              <Plus className="w-4 h-4 mr-2" />
              Add Configuration
            </Button>
          </div>

          {/* Configuration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) =>
          <Card key={config.id} className={`overflow-hidden ${!config.isActive ? 'opacity-60' : ''}`}>
                <div className={`p-4 ${config.isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400'} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      <h3 className="font-bold">{config.standardName}</h3>
                    </div>
                    <Badge className={config.isActive ? 'bg-white/20 text-white' : 'bg-white/30 text-white'}>
                      {config.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Subject Count Requirements */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Required Subjects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700">Min: {config.minSubjects}</Badge>
                      <Badge className="bg-blue-100 text-blue-700">Max: {config.maxSubjects}</Badge>
                    </div>
                  </div>

                  {/* Available Subjects */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BookMarked className="w-4 h-4" />
                      Available Optional Subjects ({config.availableSubjects.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {config.availableSubjects.slice(0, 5).map((subject) =>
                  <Badge
                    key={subject.id}
                    className={`text-xs ${getCategoryColor(subject.category)}`}>

                          {subject.name}
                        </Badge>
                  )}
                      {config.availableSubjects.length > 5 &&
                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                          +{config.availableSubjects.length - 5} more
                        </Badge>
                  }
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <p>Last updated: {formatDate(config.lastUpdated)} by {config.updatedBy}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleEditConfig(config)}>

                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleConfigActive(config.id)}>

                      {config.isActive ?
                  <><Lock className="w-4 h-4 mr-1" />Disable</> :

                  <><Unlock className="w-4 h-4 mr-1" />Enable</>
                  }
                    </Button>
                    <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteConfig(config.id)}>

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
          )}

            {/* Add New Card */}
            <Card
            className="border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[280px] cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
            onClick={() => {
              resetConfigForm();
              setShowConfigForm(true);
            }}>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-700">Add New Configuration</p>
                <p className="text-sm text-gray-500 mt-1">Configure optional subjects for a class</p>
              </div>
            </Card>
          </div>

          {/* Configuration Form Modal */}
          {showConfigForm &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">
                        {editingConfig ? 'Edit Configuration' : 'New Optional Subject Configuration'}
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        Configure which optional subjects are available for a class
                      </p>
                    </div>
                    <Button variant="ghost" className="text-white hover:bg-white/20" onClick={resetConfigForm}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
                  {/* Standard Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Standard/Class *</label>
                    <select
                  value={configForm.standardId}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, standardId: e.target.value }))}
                  disabled={!!editingConfig}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100">

                      <option value="">Select a standard</option>
                      {standards.
                  filter((s) => editingConfig || !configs.some((c) => c.standardId === s.id)).
                  map((s) =>
                  <option key={s.id} value={s.id}>{s.name}</option>
                  )}
                    </select>
                  </div>

                  {/* Min/Max Subjects */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Minimum Subjects Required</label>
                      <input
                    type="number"
                    value={configForm.minSubjects}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, minSubjects: Number(e.target.value) }))}
                    min={0}
                    max={configForm.maxSubjects}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Maximum Subjects Allowed</label>
                      <input
                    type="number"
                    value={configForm.maxSubjects}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, maxSubjects: Number(e.target.value) }))}
                    min={configForm.minSubjects}
                    max={10}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

                    </div>
                  </div>

                  {/* Subject Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">
                        Available Optional Subjects ({configForm.availableSubjects.length} selected)
                      </label>
                      <div className="flex gap-2">
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfigForm((prev) => ({ ...prev, availableSubjects: allSubjects }))}>

                          Select All
                        </Button>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfigForm((prev) => ({ ...prev, availableSubjects: [] }))}>

                          Clear All
                        </Button>
                      </div>
                    </div>

                    {/* Group by Category */}
                    {['Language', 'Technical', 'Creative', 'Sports', 'Vocational', 'Humanities', 'Commerce'].map((category) => {
                  const categorySubjects = allSubjects.filter((s) => s.category === category);
                  if (categorySubjects.length === 0) return null;

                  return (
                    <div key={category} className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {categorySubjects.map((subject) => {
                          const isSelected = configForm.availableSubjects.some((s) => s.id === subject.id);
                          return (
                            <div
                              key={subject.id}
                              onClick={() => toggleSubjectInConfig(subject)}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected ?
                              'border-blue-500 bg-blue-50' :
                              'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`
                              }>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                                  isSelected ? 'bg-blue-600' : 'border-2 border-gray-300'}`
                                  }>
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                      </div>
                                      <span className="font-medium text-gray-900 text-sm">{subject.name}</span>
                                    </div>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-mono">{subject.code}</span>
                                    <span>•</span>
                                    <span>{subject.currentEnrollment}/{subject.maxSeats} enrolled</span>
                                  </div>
                                </div>);

                        })}
                          </div>
                        </div>);

                })}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <Button variant="outline" onClick={resetConfigForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="bg-blue-600" onClick={handleSaveConfig}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingConfig ? 'Save Changes' : 'Create Configuration'}
                  </Button>
                </div>
              </Card>
            </div>
        }
        </div>
      }

      {/* Students View */}
      {activeView === 'students' &&
      <div className="space-y-6">
          {/* Filters Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                Search & Filter Students
              </h2>
              <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setStudentFilters({
                  standard: 'All',
                  division: 'All',
                  optionalSubject: 'All',
                  mappingStatus: 'All',
                  searchQuery: ''
                })}>

                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                  type="text"
                  placeholder="Name, GR No, Roll No..."
                  value={studentFilters.searchQuery}
                  onChange={(e) => setStudentFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />

                </div>
              </div>

              {/* Standard Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
                <select
                value={studentFilters.standard}
                onChange={(e) => setStudentFilters((prev) => ({ ...prev, standard: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">

                  <option value="All">All Standards</option>
                  {standards.map((s) =>
                <option key={s.id} value={s.id}>{s.name}</option>
                )}
                </select>
              </div>

              {/* Division Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <select
                value={studentFilters.division}
                onChange={(e) => setStudentFilters((prev) => ({ ...prev, division: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">

                  <option value="All">All Divisions</option>
                  {divisions.map((d) =>
                <option key={d} value={d}>Division {d}</option>
                )}
                </select>
              </div>

              {/* Mapping Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mapping Status</label>
                <select
                value={studentFilters.mappingStatus}
                onChange={(e) => setStudentFilters((prev) => ({ ...prev, mappingStatus: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">

                  <option value="All">All Status</option>
                  <option value="Complete">Complete</option>
                  <option value="Partial">Partial</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Optional Subject Filter - Separate Row */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Optional Subject Chosen</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                className={`cursor-pointer px-3 py-1.5 ${
                studentFilters.optionalSubject === 'All' ?
                'bg-blue-600 text-white' :
                'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }
                onClick={() => setStudentFilters((prev) => ({ ...prev, optionalSubject: 'All' }))}>

                  All Subjects
                </Badge>
                {allConfiguredSubjects.map((subject) =>
              <Badge
                key={subject}
                className={`cursor-pointer px-3 py-1.5 ${
                studentFilters.optionalSubject === subject ?
                'bg-blue-600 text-white' :
                'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }
                onClick={() => setStudentFilters((prev) => ({ ...prev, optionalSubject: subject }))}>

                    {subject}
                  </Badge>
              )}
              </div>
            </div>
          </Card>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredStudents.length}</span> of {students.length} students
            </p>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                onClick={() => setStudentViewMode('list')}
                className={`p-2 rounded ${studentViewMode === 'list' ? 'bg-white shadow' : ''}`}>

                  <List className="w-4 h-4" />
                </button>
                <button
                onClick={() => setStudentViewMode('grid')}
                className={`p-2 rounded ${studentViewMode === 'grid' ? 'bg-white shadow' : ''}`}>

                  <Grid className="w-4 h-4" />
                </button>
                <button
                onClick={() => setStudentViewMode('summary')}
                className={`p-2 rounded ${studentViewMode === 'summary' ? 'bg-white shadow' : ''}`}>

                  <PieChart className="w-4 h-4" />
                </button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* List View */}
          {studentViewMode === 'list' &&
        <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Core Subjects</th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Optional Subjects</th>
                      <th className="py-4 px-4 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase">Mapped On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length === 0 ?
                <tr>
                        <td colSpan={7} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <FileX className="w-12 h-12 mb-3" />
                            <p className="text-lg font-medium">No students found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr> :

                filteredStudents.map((student) =>
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}>

                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                {student.studentName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                                <p className="text-xs text-gray-500">{student.grNo}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className="bg-gray-100 text-gray-700">
                              {student.standard}-{student.division}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {student.coreSubjects.slice(0, 3).map((subj, idx) =>
                      <Badge key={idx} className="bg-gray-100 text-gray-600 text-xs">
                                  {subj}
                                </Badge>
                      )}
                              {student.coreSubjects.length > 3 &&
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                                  +{student.coreSubjects.length - 3}
                                </Badge>
                      }
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {student.optionalSubjects.length > 0 ?
                    <div className="flex flex-wrap gap-1">
                                {student.optionalSubjects.map((subj, idx) =>
                      <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs">
                                    {subj}
                                  </Badge>
                      )}
                              </div> :

                    <span className="text-sm text-gray-400 italic">Not selected</span>
                    }
                          </td>
                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(student.mappingStatus)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {student.mappedOn ?
                    <div>
                                <p>{formatDate(student.mappedOn)}</p>
                                <p className="text-xs text-gray-400">by {student.mappedBy}</p>
                              </div> :

                    <span className="text-gray-400">-</span>
                    }
                          </td>
                        </tr>
                )
                }
                  </tbody>
                </table>
              </div>
            </Card>
        }

          {/* Grid View */}
          {studentViewMode === 'grid' &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStudents.map((student) =>
          <Card key={student.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className={`p-3 ${
            student.mappingStatus === 'Complete' ? 'bg-green-500' :
            student.mappingStatus === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'} text-white`
            }>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                          {student.rollNo}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{student.studentName}</p>
                          <p className="text-xs opacity-80">{student.grNo}</p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white text-xs">
                        {student.standard}-{student.division}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Core Subjects</p>
                      <div className="flex flex-wrap gap-1">
                        {student.coreSubjects.map((subj, idx) =>
                  <Badge key={idx} className="bg-gray-100 text-gray-600 text-xs">
                            {subj}
                          </Badge>
                  )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Optional Subjects</p>
                      {student.optionalSubjects.length > 0 ?
                <div className="flex flex-wrap gap-1">
                          {student.optionalSubjects.map((subj, idx) =>
                  <Badge key={idx} className="bg-blue-100 text-blue-700">
                              {subj}
                            </Badge>
                  )}
                        </div> :

                <p className="text-sm text-gray-400 italic">Not selected yet</p>
                }
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      {getStatusBadge(student.mappingStatus)}
                      {student.mappedOn &&
                <span className="text-xs text-gray-500">{formatDate(student.mappedOn)}</span>
                }
                    </div>
                  </div>
                </Card>
          )}
            </div>
        }

          {/* Summary View */}
          {studentViewMode === 'summary' &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject-wise Enrollment */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Subject-wise Enrollment Summary
                </h3>
                <div className="space-y-3">
                  {allConfiguredSubjects.map((subject) => {
                const count = students.filter((s) => s.optionalSubjects.includes(subject)).length;
                const percentage = Math.round(count / students.length * 100);

                return (
                  <div key={subject} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{subject}</span>
                          <span className="text-gray-500">{count} students ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }} />

                        </div>
                      </div>);

              })}
                </div>
              </Card>

              {/* Class-wise Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  Class-wise Mapping Status
                </h3>
                <div className="space-y-3">
                  {[...new Set(students.map((s) => s.standard))].map((std) => {
                const classStudents = students.filter((s) => s.standard === std);
                const complete = classStudents.filter((s) => s.mappingStatus === 'Complete').length;
                const partial = classStudents.filter((s) => s.mappingStatus === 'Partial').length;
                const pending = classStudents.filter((s) => s.mappingStatus === 'Pending').length;

                return (
                  <div key={std} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">Standard {std}</span>
                          <span className="text-sm text-gray-500">{classStudents.length} students</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Complete: {complete}
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                            Partial: {partial}
                          </Badge>
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            Pending: {pending}
                          </Badge>
                        </div>
                      </div>);

              })}
                </div>
              </Card>

              {/* Pending Students Alert */}
              <Card className="p-6 lg:col-span-2 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Students with Pending/Incomplete Mapping
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {students.
              filter((s) => s.mappingStatus !== 'Complete').
              slice(0, 9).
              map((student) =>
              <div
                key={student.id}
                className="p-3 bg-white rounded-lg border border-orange-200 flex items-center justify-between">

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-sm">
                            {student.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                            <p className="text-xs text-gray-500">{student.standard}-{student.division}</p>
                          </div>
                        </div>
                        {getStatusBadge(student.mappingStatus)}
                      </div>
              )}
                </div>
                {students.filter((s) => s.mappingStatus !== 'Complete').length > 9 &&
            <p className="mt-4 text-sm text-gray-600">
                    And {students.filter((s) => s.mappingStatus !== 'Complete').length - 9} more students...
                  </p>
            }
              </Card>
            </div>
        }
        </div>
      }
    </div>);

}

export default StudentOptionalSubject;