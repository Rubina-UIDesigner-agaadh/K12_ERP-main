import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText,
  Calendar,
  Save,
  CheckCircle,
  Users,
  Play,
  Eye,
  Archive,
  Info,
  ChevronDown,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  AlertTriangle,
  FileX,
  Building,
  FileSignature } from
'lucide-react';

// Types
type ExamStatus = 'Draft' | 'Active' | 'Closed' | 'Archived';
type ExamType = 'Unit Test' | 'Term' | 'Final' | 'Board' | 'Practical';
type BoardType = 'General' | 'GSEB' | 'CBSE' | 'CISCE';
type ActivePanel = 'list' | 'create' | 'edit' | 'view';

interface ExamConfig {
  id: string;
  academicYear: string;
  name: string;
  examType: ExamType;
  boardType: BoardType;
  applicableClasses: string[];
  applicableSections: string[];
  startDate: string;
  endDate: string;
  resultDeclarationDate: string;
  status: ExamStatus;
  hasMarksEntered: boolean;
  isResultProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Initial Data
const initialExams: ExamConfig[] = [
{
  id: '1',
  academicYear: '2024-25',
  name: 'Unit Test 1',
  examType: 'Unit Test',
  boardType: 'General',
  applicableClasses: ['9', '10'],
  applicableSections: ['A', 'B', 'C'],
  startDate: '2024-04-15',
  endDate: '2024-04-20',
  resultDeclarationDate: '2024-04-28',
  status: 'Closed',
  hasMarksEntered: true,
  isResultProcessed: true,
  createdAt: '2024-03-01',
  updatedAt: '2024-04-28'
},
{
  id: '2',
  academicYear: '2024-25',
  name: 'Half Yearly Examination',
  examType: 'Term',
  boardType: 'General',
  applicableClasses: ['9', '10', '11', '12'],
  applicableSections: ['A', 'B', 'C', 'D'],
  startDate: '2024-09-15',
  endDate: '2024-09-30',
  resultDeclarationDate: '2024-10-15',
  status: 'Active',
  hasMarksEntered: true,
  isResultProcessed: false,
  createdAt: '2024-07-01',
  updatedAt: '2024-09-10'
},
{
  id: '3',
  academicYear: '2024-25',
  name: 'Unit Test 2',
  examType: 'Unit Test',
  boardType: 'General',
  applicableClasses: ['9', '10'],
  applicableSections: ['A', 'B'],
  startDate: '2024-07-10',
  endDate: '2024-07-15',
  resultDeclarationDate: '2024-07-25',
  status: 'Active',
  hasMarksEntered: false,
  isResultProcessed: false,
  createdAt: '2024-05-15',
  updatedAt: '2024-06-20'
},
{
  id: '4',
  academicYear: '2024-25',
  name: 'Annual Examination',
  examType: 'Final',
  boardType: 'General',
  applicableClasses: ['9', '10', '11', '12'],
  applicableSections: [],
  startDate: '2025-02-15',
  endDate: '2025-03-05',
  resultDeclarationDate: '2025-03-25',
  status: 'Draft',
  hasMarksEntered: false,
  isResultProcessed: false,
  createdAt: '2024-10-01',
  updatedAt: '2024-10-01'
},
{
  id: '5',
  academicYear: '2024-25',
  name: 'Board Pre-Examination',
  examType: 'Board',
  boardType: 'CBSE',
  applicableClasses: ['10', '12'],
  applicableSections: ['A', 'B', 'C'],
  startDate: '2025-01-10',
  endDate: '2025-01-25',
  resultDeclarationDate: '2025-02-05',
  status: 'Draft',
  hasMarksEntered: false,
  isResultProcessed: false,
  createdAt: '2024-11-01',
  updatedAt: '2024-11-01'
},
{
  id: '6',
  academicYear: '2024-25',
  name: 'Practical Examination',
  examType: 'Practical',
  boardType: 'General',
  applicableClasses: ['11', '12'],
  applicableSections: ['A', 'B'],
  startDate: '2024-11-01',
  endDate: '2024-11-15',
  resultDeclarationDate: '2024-11-25',
  status: 'Active',
  hasMarksEntered: false,
  isResultProcessed: false,
  createdAt: '2024-09-01',
  updatedAt: '2024-09-01'
},
{
  id: '7',
  academicYear: '2024-25',
  name: 'Unit Test 1',
  examType: 'Unit Test',
  boardType: 'General',
  applicableClasses: ['6', '7', '8'],
  applicableSections: ['A', 'B', 'C'],
  startDate: '2024-05-10',
  endDate: '2024-05-15',
  resultDeclarationDate: '2024-05-25',
  status: 'Closed',
  hasMarksEntered: true,
  isResultProcessed: true,
  createdAt: '2024-04-01',
  updatedAt: '2024-05-25'
}];


const allClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const allSections = ['A', 'B', 'C', 'D', 'E', 'F'];

const emptyExamForm: Omit<ExamConfig, 'id' | 'createdAt' | 'updatedAt' | 'hasMarksEntered' | 'isResultProcessed'> = {
  academicYear: '2024-25',
  name: '',
  examType: 'Unit Test',
  boardType: 'General',
  applicableClasses: [],
  applicableSections: [],
  startDate: '',
  endDate: '',
  resultDeclarationDate: '',
  status: 'Draft'
};

export function ExamMasterConfiguration() {
  // State
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [exams, setExams] = useState<ExamConfig[]>(initialExams);
  const [activePanel, setActivePanel] = useState<ActivePanel>('list');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ExamStatus | 'All'>('All');
  const [filterType, setFilterType] = useState<ExamType | 'All'>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [formData, setFormData] = useState(emptyExamForm);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [expandedClasses, setExpandedClasses] = useState<string[]>(allClasses);

  // Computed
  const selectedExam = exams.find((e) => e.id === selectedExamId);

  const filteredExams = exams.filter((exam) => {
    const matchesYear = exam.academicYear === academicYear;
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
    const matchesType = filterType === 'All' || exam.examType === filterType;
    const matchesClass = selectedClass === 'All' || exam.applicableClasses.includes(selectedClass);
    return matchesYear && matchesSearch && matchesStatus && matchesType && matchesClass;
  });

  // Group exams by class
  const examsByClass = allClasses.reduce((acc, cls) => {
    acc[cls] = filteredExams.filter((exam) => exam.applicableClasses.includes(cls));
    return acc;
  }, {} as Record<string, ExamConfig[]>);

  // Handlers
  const toggleClassExpand = (cls: string) => {
    setExpandedClasses((prev) =>
    prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const expandAllClasses = () => setExpandedClasses(allClasses);
  const collapseAllClasses = () => setExpandedClasses([]);

  const handleCreateExam = () => {
    setFormData({ ...emptyExamForm, academicYear });
    setSelectedExamId(null);
    setActivePanel('create');
  };

  const handleEditExam = (exam: ExamConfig) => {
    if (exam.isResultProcessed) {
      alert('Cannot edit exam as result processing is completed.');
      return;
    }
    setFormData({
      academicYear: exam.academicYear,
      name: exam.name,
      examType: exam.examType,
      boardType: exam.boardType,
      applicableClasses: exam.applicableClasses,
      applicableSections: exam.applicableSections,
      startDate: exam.startDate,
      endDate: exam.endDate,
      resultDeclarationDate: exam.resultDeclarationDate,
      status: exam.status
    });
    setSelectedExamId(exam.id);
    setActivePanel('edit');
  };

  const handleViewExam = (exam: ExamConfig) => {
    setSelectedExamId(exam.id);
    setActivePanel('view');
  };

  const handleSaveExam = () => {
    if (!formData.name || !formData.startDate || !formData.endDate || formData.applicableClasses.length === 0) {
      alert('Please fill all required fields: Name, Start Date, End Date, and at least one Class.');
      return;
    }

    if (activePanel === 'create') {
      const newExam: ExamConfig = {
        ...formData,
        id: Date.now().toString(),
        hasMarksEntered: false,
        isResultProcessed: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setExams((prev) => [...prev, newExam]);
    } else if (activePanel === 'edit' && selectedExamId) {
      setExams((prev) => prev.map((e) =>
      e.id === selectedExamId ?
      { ...e, ...formData, updatedAt: new Date().toISOString().split('T')[0] } :
      e
      ));
    }
    setActivePanel('list');
    setSelectedExamId(null);
  };

  const handleDeleteExam = (id: string) => {
    const exam = exams.find((e) => e.id === id);
    if (exam?.hasMarksEntered) {
      alert('Cannot delete this exam as marks have already been entered.');
      setShowDeleteConfirm(null);
      return;
    }
    setExams((prev) => prev.filter((e) => e.id !== id));
    setShowDeleteConfirm(null);
  };

  const getStatusColor = (status: ExamStatus) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-300',
      'Active': 'bg-green-100 text-green-700 border-green-300',
      'Closed': 'bg-blue-100 text-blue-700 border-blue-300',
      'Archived': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status];
  };

  const getStatusIcon = (status: ExamStatus) => {
    const icons = {
      'Draft': FileText,
      'Active': Play,
      'Closed': CheckCircle,
      'Archived': Archive
    };
    return icons[status];
  };

  const getExamTypeColor = (type: ExamType) => {
    const colors = {
      'Unit Test': 'bg-purple-100 text-purple-700',
      'Term': 'bg-blue-100 text-blue-700',
      'Final': 'bg-orange-100 text-orange-700',
      'Board': 'bg-red-100 text-red-700',
      'Practical': 'bg-green-100 text-green-700'
    };
    return colors[type];
  };

  const getBoardTypeColor = (board: BoardType) => {
    const colors = {
      'General': 'bg-gray-100 text-gray-600',
      'GSEB': 'bg-yellow-100 text-yellow-700',
      'CBSE': 'bg-blue-100 text-blue-700',
      'CISCE': 'bg-indigo-100 text-indigo-700'
    };
    return colors[board];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getClassBorderColor = (cls: string) => {
    const num = parseInt(cls);
    if (num <= 5) return 'border-l-green-500';
    if (num <= 8) return 'border-l-blue-500';
    if (num <= 10) return 'border-l-purple-500';
    return 'border-l-orange-500';
  };

  const getClassBgColor = (cls: string) => {
    const num = parseInt(cls);
    if (num <= 5) return 'from-green-50 to-green-100';
    if (num <= 8) return 'from-blue-50 to-blue-100';
    if (num <= 10) return 'from-purple-50 to-purple-100';
    return 'from-orange-50 to-orange-100';
  };

  // Exam Card Component
  const ExamCard = ({ exam }: {exam: ExamConfig;}) => {
    const StatusIcon = getStatusIcon(exam.status);
    const canEdit = !exam.isResultProcessed;
    const canDelete = !exam.hasMarksEntered;

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4"
      style={{
        borderLeftColor: exam.status === 'Active' ? '#16a34a' :
        exam.status === 'Closed' ? '#2563eb' :
        exam.status === 'Draft' ? '#6b7280' : '#dc2626'
      }}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-gray-900">{exam.name}</h3>
                <Badge className={`${getStatusColor(exam.status)} text-xs flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {exam.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${getExamTypeColor(exam.examType)} text-xs`}>
                  {exam.examType}
                </Badge>
                <Badge className={`${getBoardTypeColor(exam.boardType)} text-xs`}>
                  {exam.boardType}
                </Badge>
              </div>
            </div>
            
            {/* Indicators */}
            <div className="flex flex-col gap-1">
              {exam.hasMarksEntered &&
              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  <Edit className="w-3 h-3" />
                  <span>Marks</span>
                </div>
              }
              {exam.isResultProcessed &&
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" />
                  <span>Done</span>
                </div>
              }
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(exam.startDate)} - {formatDate(exam.endDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-400" />
              <span>
                {exam.applicableSections.length > 0 ?
                `Section ${exam.applicableSections.join(', ')}` :
                'All Sections'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-blue-600 hover:bg-blue-50"
              onClick={() => handleViewExam(exam)}>

              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${canEdit ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={() => canEdit && handleEditExam(exam)}
              disabled={!canEdit}>

              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${canDelete ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`}
              onClick={() => canDelete && setShowDeleteConfirm(exam.id)}
              disabled={!canDelete}>

              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>);

  };

  // Class Section Component
  const ClassSection = ({ classNum, classExams }: {classNum: string;classExams: ExamConfig[];}) => {
    const isExpanded = expandedClasses.includes(classNum);
    const examCount = classExams.length;

    if (examCount === 0) return null;

    return (
      <div className={`border-l-4 ${getClassBorderColor(classNum)} rounded-lg overflow-hidden shadow-sm mb-4`}>
        <div
          onClick={() => toggleClassExpand(classNum)}
          className={`flex items-center justify-between p-4 bg-gradient-to-r ${getClassBgColor(classNum)} cursor-pointer hover:opacity-90 transition-all`}>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <GraduationCap className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Class {classNum}</h3>
              <p className="text-sm text-gray-600">{examCount} examination{examCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {classExams.filter((e) => e.status === 'Active').length > 0 &&
              <Badge className="bg-green-500 text-white text-xs">
                  {classExams.filter((e) => e.status === 'Active').length} Active
                </Badge>
              }
              {classExams.filter((e) => e.status === 'Draft').length > 0 &&
              <Badge className="bg-gray-500 text-white text-xs">
                  {classExams.filter((e) => e.status === 'Draft').length} Draft
                </Badge>
              }
            </div>
            <div className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
        
        {isExpanded &&
        <div className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classExams.map((exam) =>
            <ExamCard key={exam.id} exam={exam} />
            )}
            </div>
          </div>
        }
      </div>);

  };

  // View Exam Details Panel
  const ViewExamPanel = () => {
    if (!selectedExam) return null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActivePanel('list')}>
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Exam List
          </Button>
          <div className="flex gap-3">
            {!selectedExam.isResultProcessed &&
            <Button variant="outline" onClick={() => handleEditExam(selectedExam)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Exam
              </Button>
            }
          </div>
        </div>

        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{selectedExam.name}</h2>
                  <Badge className={`${getStatusColor(selectedExam.status)} border`}>
                    {selectedExam.status}
                  </Badge>
                </div>
                <p className="text-blue-100">
                  {selectedExam.examType} • {selectedExam.boardType} • Academic Year {selectedExam.academicYear}
                </p>
              </div>
              <div className="text-right">
                {selectedExam.hasMarksEntered &&
                <div className="flex items-center gap-2 text-orange-200 text-sm mb-1">
                    <Edit className="w-4 h-4" />
                    Marks Entered
                  </div>
                }
                {selectedExam.isResultProcessed &&
                <div className="flex items-center gap-2 text-green-200 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Result Processed
                  </div>
                }
              </div>
            </div>
          </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Exam Period</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(selectedExam.startDate)} - {formatDate(selectedExam.endDate)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarDays className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Result Declaration</p>
                <p className="font-semibold text-gray-900">{formatDate(selectedExam.resultDeclarationDate)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Applicable Classes</p>
                <p className="font-semibold text-gray-900">Class {selectedExam.applicableClasses.join(', ')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Applicable Sections</p>
                <p className="font-semibold text-gray-900">
                  {selectedExam.applicableSections.length > 0 ?
                  `Section ${selectedExam.applicableSections.join(', ')}` :
                  'All Sections'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Meta Info */}
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Created: {formatDate(selectedExam.createdAt)}</span>
            <span>Last Updated: {formatDate(selectedExam.updatedAt)}</span>
          </div>
        </Card>
      </div>);

  };

  // Exam Form Component
  const ExamForm = () => {
    const isEditing = activePanel === 'edit';

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActivePanel('list')}>
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Exam List
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setActivePanel('list')}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-blue-600" onClick={handleSaveExam}>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Create Exam'}
            </Button>
          </div>
        </div>

        {/* Form Header */}
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-2xl font-bold">
            {isEditing ? `Edit: ${formData.name}` : 'Create New Examination'}
          </h2>
          <p className="text-blue-100 mt-1">
            {isEditing ? 'Modify examination configuration' : 'Define a new examination for the academic year'}
          </p>
        </Card>

        {/* Exam Configuration Form */}
        <Card className="overflow-hidden shadow-lg">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Exam Configuration</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Row 1: Academic Year, Exam Name, Exam Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="2023-24">2023-24</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Exam Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Unit Test 1, Half Yearly, Annual"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, examType: e.target.value as ExamType }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="Unit Test">Unit Test</option>
                  <option value="Term">Term</option>
                  <option value="Final">Final</option>
                  <option value="Board">Board</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>
            </div>

            {/* Row 2: Board Type, Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Board Type</label>
                <select
                  value={formData.boardType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, boardType: e.target.value as BoardType }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="General">General</option>
                  <option value="GSEB">GSEB</option>
                  <option value="CBSE">CBSE</option>
                  <option value="CISCE">CISCE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as ExamStatus }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Row 3: Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Result Declaration Date</label>
                <input
                  type="date"
                  value={formData.resultDeclarationDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, resultDeclarationDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

              </div>
            </div>

            {/* Applicable Classes */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Applicable Classes <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {allClasses.map((cls) =>
                <button
                  key={cls}
                  onClick={() => {
                    const classes = formData.applicableClasses;
                    setFormData((prev) => ({
                      ...prev,
                      applicableClasses: classes.includes(cls) ?
                      classes.filter((c) => c !== cls) :
                      [...classes, cls]
                    }));
                  }}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  formData.applicableClasses.includes(cls) ?
                  'bg-blue-600 text-white border-blue-600' :
                  'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`
                  }>

                    Class {cls}
                  </button>
                )}
              </div>
            </div>

            {/* Applicable Sections */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Applicable Sections <span className="text-gray-400 text-xs">(Optional - leave empty for all sections)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {allSections.map((sec) =>
                <button
                  key={sec}
                  onClick={() => {
                    const sections = formData.applicableSections;
                    setFormData((prev) => ({
                      ...prev,
                      applicableSections: sections.includes(sec) ?
                      sections.filter((s) => s !== sec) :
                      [...sections, sec]
                    }));
                  }}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  formData.applicableSections.includes(sec) ?
                  'bg-green-600 text-white border-green-600' :
                  'bg-white text-gray-700 border-gray-300 hover:border-green-400'}`
                  }>

                    Section {sec}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>);

  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    const examToDelete = exams.find((e) => e.id === showDeleteConfirm);
    if (!examToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Examination</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>"{examToDelete.name}"</strong>? 
            This will permanently remove the examination configuration.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDeleteExam(showDeleteConfirm)}>

              <Trash2 className="w-4 h-4 mr-2" />
              Delete Exam
            </Button>
          </div>
        </Card>
      </div>);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <FileSignature className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exam Master</h1>
              <p className="text-sm text-gray-500">Manage examinations class-wise for the academic year</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none bg-white">

              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>

            {activePanel === 'list' &&
            <Button variant="primary" className="bg-blue-600" onClick={handleCreateExam}>
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            }
          </div>
        </div>
      </div>

      {activePanel === 'list' &&
      <>
          {/* Filters & Controls */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search by exam name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none" />

                </div>

                <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="All">All Classes</option>
                  {allClasses.map((cls) =>
                <option key={cls} value={cls}>Class {cls}</option>
                )}
                </select>

                <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ExamStatus | 'All')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="All">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>

                <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ExamType | 'All')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="All">All Types</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Term">Term</option>
                  <option value="Final">Final</option>
                  <option value="Board">Board</option>
                  <option value="Practical">Practical</option>
                </select>

                {(filterStatus !== 'All' || filterType !== 'All' || selectedClass !== 'All' || searchQuery) &&
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterStatus('All');
                  setFilterType('All');
                  setSelectedClass('All');
                  setSearchQuery('');
                }}
                className="text-gray-500">

                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
              }
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={expandAllClasses}>
                  Expand All
                </Button>
                <Button variant="ghost" size="sm" onClick={collapseAllClasses}>
                  Collapse All
                </Button>
              </div>
            </div>
          </Card>

          {/* Class-wise Exam List */}
          <div className="space-y-2">
            {selectedClass === 'All' ?
          allClasses.map((cls) =>
          <ClassSection
            key={cls}
            classNum={cls}
            classExams={examsByClass[cls]} />

          ) :

          <ClassSection
            classNum={selectedClass}
            classExams={examsByClass[selectedClass]} />

          }

            {filteredExams.length === 0 &&
          <Card className="p-12 text-center text-gray-500">
                <FileX className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No exams found</p>
                <p className="text-sm mt-1">
                  {searchQuery || filterStatus !== 'All' || filterType !== 'All' || selectedClass !== 'All' ?
              'Try adjusting your filters' :
              `No exams configured for ${academicYear}`}
                </p>
                {!searchQuery && filterStatus === 'All' && filterType === 'All' && selectedClass === 'All' &&
            <Button variant="primary" className="mt-4 bg-blue-600" onClick={handleCreateExam}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Exam
                  </Button>
            }
              </Card>
          }
          </div>

          {/* Information Note */}
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Exams are organized class-wise for easy management.
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Click on a class to expand/collapse and view all exams for that class.
                </p>
              </div>
            </div>
          </Card>
        </>
      }

      {(activePanel === 'create' || activePanel === 'edit') && <ExamForm />}

      {activePanel === 'view' && <ViewExamPanel />}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />
    </div>);

}

export default ExamMasterConfiguration;