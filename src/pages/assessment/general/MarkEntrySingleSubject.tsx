import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Settings,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Copy,
  Search,
  Filter,
  MoreVertical,
  AlertTriangle,
  GraduationCap,
  Layers,
  Percent,
  Hash,
  Award,
  Lock,
  Unlock,
  Info,
  ArrowUpDown,
  Link2,
  Shield,
  Ban,
  Check,
  RefreshCw,
  BookOpen,
  Building,
  Users,
  FileText,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Zap } from
'lucide-react';

export function GradeSetup() {
  // Main States
  const [gradeScales, setGradeScales] = useState([]);
  const [selectedScale, setSelectedScale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBoard, setFilterBoard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errors, setErrors] = useState({});
  const [showUsageModal, setShowUsageModal] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    board: '',
    applicableClasses: [],
    evaluationMode: 'percentage',
    maxMarks: 100,
    priorityOrder: 1,
    grades: [],
    conversionRules: {
      autoMarksToGrade: true,
      gradeToGradeMapping: false,
      autoPassFailDetection: true
    },
    isActive: true
  });

  // Options
  const boards = [
  { id: 'cbse', name: 'CBSE' },
  { id: 'icse', name: 'ICSE' },
  { id: 'state', name: 'State Board' },
  { id: 'ib', name: 'IB' },
  { id: 'cambridge', name: 'Cambridge' }];


  const classes = [
  { id: '1', name: 'Class 1' },
  { id: '2', name: 'Class 2' },
  { id: '3', name: 'Class 3' },
  { id: '4', name: 'Class 4' },
  { id: '5', name: 'Class 5' },
  { id: '6', name: 'Class 6' },
  { id: '7', name: 'Class 7' },
  { id: '8', name: 'Class 8' },
  { id: '9', name: 'Class 9' },
  { id: '10', name: 'Class 10' },
  { id: '11', name: 'Class 11' },
  { id: '12', name: 'Class 12' }];


  const evaluationModes = [
  { id: 'percentage', name: 'Percentage Based', icon: Percent },
  { id: 'marks', name: 'Marks Based', icon: Hash },
  { id: 'grade_only', name: 'Grade Only', icon: Award }];


  // Mock Data
  useEffect(() => {
    loadGradeScales();
  }, []);

  const loadGradeScales = () => {
    const mockScales = [
    {
      id: 1,
      name: 'CBSE 9-10 Grading Scale',
      board: 'cbse',
      applicableClasses: ['9', '10'],
      evaluationMode: 'percentage',
      maxMarks: 100,
      priorityOrder: 1,
      isActive: true,
      isUsed: true,
      usageCount: 45,
      grades: [
      { id: 1, label: 'A1', minValue: 91, maxValue: 100, description: 'Outstanding', status: 'pass', gradePoint: 10 },
      { id: 2, label: 'A2', minValue: 81, maxValue: 90, description: 'Excellent', status: 'pass', gradePoint: 9 },
      { id: 3, label: 'B1', minValue: 71, maxValue: 80, description: 'Very Good', status: 'pass', gradePoint: 8 },
      { id: 4, label: 'B2', minValue: 61, maxValue: 70, description: 'Good', status: 'pass', gradePoint: 7 },
      { id: 5, label: 'C1', minValue: 51, maxValue: 60, description: 'Above Average', status: 'pass', gradePoint: 6 },
      { id: 6, label: 'C2', minValue: 41, maxValue: 50, description: 'Average', status: 'pass', gradePoint: 5 },
      { id: 7, label: 'D', minValue: 33, maxValue: 40, description: 'Below Average', status: 'pass', gradePoint: 4 },
      { id: 8, label: 'E', minValue: 0, maxValue: 32, description: 'Needs Improvement', status: 'fail', gradePoint: 0 }],

      conversionRules: {
        autoMarksToGrade: true,
        gradeToGradeMapping: false,
        autoPassFailDetection: true
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-02-20'
    },
    {
      id: 2,
      name: 'Primary Skill Assessment Scale',
      board: 'cbse',
      applicableClasses: ['1', '2', '3', '4', '5'],
      evaluationMode: 'grade_only',
      maxMarks: 0,
      priorityOrder: 2,
      isActive: true,
      isUsed: false,
      usageCount: 0,
      grades: [
      { id: 1, label: 'A', minValue: 0, maxValue: 0, description: 'Excellent', status: 'pass', gradePoint: 5 },
      { id: 2, label: 'B', minValue: 0, maxValue: 0, description: 'Very Good', status: 'pass', gradePoint: 4 },
      { id: 3, label: 'C', minValue: 0, maxValue: 0, description: 'Good', status: 'pass', gradePoint: 3 },
      { id: 4, label: 'D', minValue: 0, maxValue: 0, description: 'Satisfactory', status: 'pass', gradePoint: 2 },
      { id: 5, label: 'E', minValue: 0, maxValue: 0, description: 'Needs Improvement', status: 'fail', gradePoint: 1 }],

      conversionRules: {
        autoMarksToGrade: false,
        gradeToGradeMapping: false,
        autoPassFailDetection: true
      },
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'ICSE Standard Scale',
      board: 'icse',
      applicableClasses: ['9', '10'],
      evaluationMode: 'marks',
      maxMarks: 100,
      priorityOrder: 1,
      isActive: false,
      isUsed: true,
      usageCount: 12,
      grades: [
      { id: 1, label: 'A+', minValue: 90, maxValue: 100, description: 'Distinction', status: 'pass', gradePoint: 10 },
      { id: 2, label: 'A', minValue: 80, maxValue: 89, description: 'Excellent', status: 'pass', gradePoint: 9 },
      { id: 3, label: 'B+', minValue: 70, maxValue: 79, description: 'Very Good', status: 'pass', gradePoint: 8 },
      { id: 4, label: 'B', minValue: 60, maxValue: 69, description: 'Good', status: 'pass', gradePoint: 7 },
      { id: 5, label: 'C+', minValue: 50, maxValue: 59, description: 'Above Average', status: 'pass', gradePoint: 6 },
      { id: 6, label: 'C', minValue: 40, maxValue: 49, description: 'Average', status: 'pass', gradePoint: 5 },
      { id: 7, label: 'D', minValue: 33, maxValue: 39, description: 'Below Average', status: 'pass', gradePoint: 4 },
      { id: 8, label: 'F', minValue: 0, maxValue: 32, description: 'Fail', status: 'fail', gradePoint: 0 }],

      conversionRules: {
        autoMarksToGrade: true,
        gradeToGradeMapping: true,
        autoPassFailDetection: true
      },
      createdAt: '2024-02-01',
      updatedAt: '2024-02-15'
    }];

    setGradeScales(mockScales);
  };

  // Filter Scales
  const filteredScales = gradeScales.filter((scale) => {
    const matchesSearch = scale.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = filterBoard === 'all' || scale.board === filterBoard;
    const matchesStatus = filterStatus === 'all' ||
    filterStatus === 'active' && scale.isActive ||
    filterStatus === 'inactive' && !scale.isActive;
    return matchesSearch && matchesBoard && matchesStatus;
  });

  // Initialize Form
  const initializeForm = (scale = null) => {
    if (scale) {
      setFormData({
        name: scale.name,
        board: scale.board,
        applicableClasses: scale.applicableClasses,
        evaluationMode: scale.evaluationMode,
        maxMarks: scale.maxMarks,
        priorityOrder: scale.priorityOrder,
        grades: [...scale.grades],
        conversionRules: { ...scale.conversionRules },
        isActive: scale.isActive
      });
    } else {
      setFormData({
        name: '',
        board: '',
        applicableClasses: [],
        evaluationMode: 'percentage',
        maxMarks: 100,
        priorityOrder: gradeScales.length + 1,
        grades: [],
        conversionRules: {
          autoMarksToGrade: true,
          gradeToGradeMapping: false,
          autoPassFailDetection: true
        },
        isActive: true
      });
    }
    setErrors({});
  };

  // Handlers
  const handleCreateNew = () => {
    initializeForm();
    setIsCreating(true);
    setIsEditing(true);
    setSelectedScale(null);
  };

  const handleEdit = (scale) => {
    if (scale.isUsed) {
      alert('This grade scale is being used in result generation. Modification requires admin approval.');
    }
    setSelectedScale(scale);
    initializeForm(scale);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleView = (scale) => {
    setSelectedScale(scale);
    initializeForm(scale);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (!selectedScale) {
      setFormData({
        name: '',
        board: '',
        applicableClasses: [],
        evaluationMode: 'percentage',
        maxMarks: 100,
        priorityOrder: 1,
        grades: [],
        conversionRules: {
          autoMarksToGrade: true,
          gradeToGradeMapping: false,
          autoPassFailDetection: true
        },
        isActive: true
      });
    }
  };

  const handleDelete = (scale) => {
    if (scale.isUsed) {
      alert('Cannot delete grade scale that is being used in result generation.');
      return;
    }
    setDeleteTarget(scale);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setGradeScales((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    if (selectedScale?.id === deleteTarget.id) {
      setSelectedScale(null);
    }
  };

  const handleToggleActive = (scale) => {
    setGradeScales((prev) => prev.map((s) =>
    s.id === scale.id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear related errors
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClassToggle = (classId) => {
    setFormData((prev) => ({
      ...prev,
      applicableClasses: prev.applicableClasses.includes(classId) ?
      prev.applicableClasses.filter((c) => c !== classId) :
      [...prev.applicableClasses, classId]
    }));
  };

  const handleConversionRuleToggle = (rule) => {
    setFormData((prev) => ({
      ...prev,
      conversionRules: {
        ...prev.conversionRules,
        [rule]: !prev.conversionRules[rule]
      }
    }));
  };

  // Grade Row Handlers
  const addGradeRow = () => {
    const newGrade = {
      id: Date.now(),
      label: '',
      minValue: 0,
      maxValue: 0,
      description: '',
      status: 'pass',
      gradePoint: 0
    };
    setFormData((prev) => ({
      ...prev,
      grades: [...prev.grades, newGrade]
    }));
  };

  const updateGradeRow = (gradeId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      grades: prev.grades.map((g) =>
      g.id === gradeId ? { ...g, [field]: value } : g
      )
    }));
  };

  const removeGradeRow = (gradeId) => {
    setFormData((prev) => ({
      ...prev,
      grades: prev.grades.filter((g) => g.id !== gradeId)
    }));
  };

  const moveGradeRow = (index, direction) => {
    const newGrades = [...formData.grades];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newGrades.length) return;

    [newGrades[index], newGrades[newIndex]] = [newGrades[newIndex], newGrades[index]];
    setFormData((prev) => ({ ...prev, grades: newGrades }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Grade scale name is required';
    }

    if (!formData.board) {
      newErrors.board = 'Board selection is required';
    }

    if (formData.applicableClasses.length === 0) {
      newErrors.applicableClasses = 'At least one class must be selected';
    }

    if (formData.evaluationMode !== 'grade_only' && formData.maxMarks <= 0) {
      newErrors.maxMarks = 'Maximum marks must be greater than 0';
    }

    if (formData.grades.length === 0) {
      newErrors.grades = 'At least one grade must be defined';
    }

    // Validate grade ranges
    if (formData.evaluationMode !== 'grade_only' && formData.grades.length > 0) {
      const sortedGrades = [...formData.grades].sort((a, b) => b.maxValue - a.maxValue);

      // Check for overlapping ranges
      for (let i = 0; i < sortedGrades.length - 1; i++) {
        if (sortedGrades[i].minValue <= sortedGrades[i + 1].maxValue) {
          newErrors.gradeRanges = 'Grade ranges must not overlap';
          break;
        }
      }

      // Check for full coverage (percentage mode)
      if (formData.evaluationMode === 'percentage') {
        const maxCovered = Math.max(...formData.grades.map((g) => g.maxValue));
        const minCovered = Math.min(...formData.grades.map((g) => g.minValue));
        if (maxCovered !== 100 || minCovered !== 0) {
          newErrors.gradeRanges = 'Grade ranges must cover 0-100%';
        }
      }
    }

    // Validate individual grades
    formData.grades.forEach((grade, index) => {
      if (!grade.label.trim()) {
        newErrors[`grade_${index}_label`] = 'Label required';
      }
      if (formData.evaluationMode !== 'grade_only') {
        if (grade.minValue > grade.maxValue) {
          newErrors[`grade_${index}_range`] = 'Min cannot exceed Max';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert('Please correct all errors before saving');
      return;
    }

    if (isCreating) {
      const newScale = {
        id: Date.now(),
        ...formData,
        isUsed: false,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setGradeScales((prev) => [...prev, newScale]);
      setSelectedScale(newScale);
    } else {
      setGradeScales((prev) => prev.map((s) =>
      s.id === selectedScale.id ?
      { ...s, ...formData, updatedAt: new Date().toISOString().split('T')[0] } :
      s
      ));
    }

    setIsEditing(false);
    setIsCreating(false);
    alert('Grade scale saved successfully!');
  };

  const handleDuplicate = (scale) => {
    const duplicated = {
      ...scale,
      id: Date.now(),
      name: `${scale.name} (Copy)`,
      isUsed: false,
      usageCount: 0,
      grades: scale.grades.map((g) => ({ ...g, id: Date.now() + Math.random() })),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setGradeScales((prev) => [...prev, duplicated]);
  };

  const handleShowUsage = (scale) => {
    setSelectedScale(scale);
    setShowUsageModal(true);
  };

  // Get board name
  const getBoardName = (boardId) => {
    return boards.find((b) => b.id === boardId)?.name || boardId;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Grade Setup
          </h1>
          <p className="text-gray-500 mt-1">
            Configure grading systems for different standards and boards • Academic Year: 2024-25
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadGradeScales}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create Grade Scale
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Scales</p>
              <p className="text-xl font-bold text-gray-900">{gradeScales.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Scales</p>
              <p className="text-xl font-bold text-gray-900">{gradeScales.filter((s) => s.isActive).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Link2 className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Use</p>
              <p className="text-xl font-bold text-gray-900">{gradeScales.filter((s) => s.isUsed).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Boards Covered</p>
              <p className="text-xl font-bold text-gray-900">{new Set(gradeScales.map((s) => s.board)).size}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Scale List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search & Filters */}
          <Card className="p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search grade scales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none" />

            </div>
            <div className="flex gap-2">
              <select
                value={filterBoard}
                onChange={(e) => setFilterBoard(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">

                <option value="all">All Boards</option>
                {boards.map((b) =>
                <option key={b.id} value={b.id}>{b.name}</option>
                )}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">

                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </Card>

          {/* Scale List */}
          <Card className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredScales.length === 0 ?
            <div className="p-8 text-center text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No grade scales found</p>
              </div> :

            filteredScales.map((scale) =>
            <div
              key={scale.id}
              onClick={() => handleView(scale)}
              className={`p-4 cursor-pointer transition-colors ${
              selectedScale?.id === scale.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`
              }>

                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{scale.name}</h3>
                        {scale.isUsed &&
                    <Lock className="w-3 h-3 text-orange-500 flex-shrink-0" />
                    }
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getBoardName(scale.board)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {scale.applicableClasses.length} classes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {scale.isActive ?
                    <Badge variant="success" className="text-xs">Active</Badge> :

                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    }
                        <span className="text-xs text-gray-400">
                          {scale.grades.length} grades
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                    onClick={(e) => {e.stopPropagation();handleEdit(scale);}}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">

                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                    onClick={(e) => {e.stopPropagation();handleDuplicate(scale);}}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">

                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
            )
            }
          </Card>
        </div>

        {/* Right Panel - Detail/Edit View */}
        <div className="lg:col-span-2">
          {!selectedScale && !isCreating ?
          <Card className="p-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Grade Scale</h3>
              <p className="text-gray-500 mb-4">
                Choose a grade scale from the list to view or edit, or create a new one.
              </p>
              <Button variant="primary" onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Scale
              </Button>
            </Card> :

          <Card className="overflow-hidden">
              {/* Detail Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isCreating ? 'Create New Grade Scale' : isEditing ? 'Edit Grade Scale' : 'Grade Scale Details'}
                    </h2>
                    {selectedScale && !isCreating &&
                  <p className="text-sm text-gray-500 mt-1">
                        Created: {selectedScale.createdAt} • Last Updated: {selectedScale.updatedAt}
                      </p>
                  }
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedScale?.isUsed && !isCreating &&
                  <Button variant="outline" size="sm" onClick={() => handleShowUsage(selectedScale)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Usage
                      </Button>
                  }
                    {isEditing ?
                  <>
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </> :

                  <>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedScale)}
                      disabled={selectedScale?.isUsed}>

                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(selectedScale)}
                      className={selectedScale?.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}>

                          {selectedScale?.isActive ?
                      <>
                              <Ban className="w-4 h-4 mr-2" />
                              Deactivate
                            </> :

                      <>
                              <Check className="w-4 h-4 mr-2" />
                              Activate
                            </>
                      }
                        </Button>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedScale)}
                      disabled={selectedScale?.isUsed}
                      className="text-red-600 hover:bg-red-50">

                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                  }
                  </div>
                </div>

                {/* Usage Warning */}
                {selectedScale?.isUsed && !isCreating &&
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      This grade scale is used in {selectedScale.usageCount} result generation(s). Modification is restricted.
                    </span>
                  </div>
              }
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade Scale Name *
                    </label>
                    <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., CBSE 9-10 Grading Scale"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} ${
                    !isEditing ? 'bg-gray-50' : ''}`} />

                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applicable Board *
                    </label>
                    <select
                    value={formData.board}
                    onChange={(e) => handleFormChange('board', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    errors.board ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} ${
                    !isEditing ? 'bg-gray-50' : ''}`}>

                      <option value="">Select Board</option>
                      {boards.map((b) =>
                    <option key={b.id} value={b.id}>{b.name}</option>
                    )}
                    </select>
                    {errors.board && <p className="text-xs text-red-600 mt-1">{errors.board}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority Order
                    </label>
                    <input
                    type="number"
                    value={formData.priorityOrder}
                    onChange={(e) => handleFormChange('priorityOrder', parseInt(e.target.value) || 1)}
                    disabled={!isEditing}
                    min="1"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none border-gray-300 focus:border-blue-500 ${!isEditing ? 'bg-gray-50' : ''}`} />

                  </div>
                </div>

                {/* Applicable Classes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Classes *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((cls) =>
                  <button
                    key={cls.id}
                    onClick={() => isEditing && handleClassToggle(cls.id)}
                    disabled={!isEditing}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    formData.applicableClasses.includes(cls.id) ?
                    'bg-blue-600 text-white' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${
                    !isEditing ? 'cursor-default' : 'cursor-pointer'}`}>

                        {cls.name}
                      </button>
                  )}
                  </div>
                  {errors.applicableClasses && <p className="text-xs text-red-600 mt-1">{errors.applicableClasses}</p>}
                </div>

                {/* Evaluation Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Mode *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {evaluationModes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => isEditing && handleFormChange('evaluationMode', mode.id)}
                        disabled={!isEditing}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.evaluationMode === mode.id ?
                        'border-blue-500 bg-blue-50' :
                        'border-gray-200 hover:border-gray-300'} ${
                        !isEditing ? 'cursor-default' : 'cursor-pointer'}`}>

                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        formData.evaluationMode === mode.id ? 'text-blue-600' : 'text-gray-400'}`
                        } />
                          <p className={`text-sm font-medium ${
                        formData.evaluationMode === mode.id ? 'text-blue-900' : 'text-gray-700'}`
                        }>
                            {mode.name}
                          </p>
                        </button>);

                  })}
                  </div>
                </div>

                {/* Max Marks */}
                {formData.evaluationMode !== 'grade_only' &&
              <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Maximum Marks *
                      </label>
                      <input
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => handleFormChange('maxMarks', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    min="1"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    errors.maxMarks ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} ${
                    !isEditing ? 'bg-gray-50' : ''}`} />

                      {errors.maxMarks && <p className="text-xs text-red-600 mt-1">{errors.maxMarks}</p>}
                    </div>
                  </div>
              }

                {/* Grade Definition Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Grade Definitions *
                    </label>
                    {isEditing &&
                  <Button variant="outline" size="sm" onClick={addGradeRow}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Grade
                      </Button>
                  }
                  </div>
                  
                  {errors.grades && <p className="text-xs text-red-600 mb-2">{errors.grades}</p>}
                  {errors.gradeRanges &&
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">{errors.gradeRanges}</span>
                    </div>
                }

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {isEditing && <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase w-16">Order</th>}
                          <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Grade Label</th>
                          {formData.evaluationMode !== 'grade_only' &&
                        <>
                              <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                Min {formData.evaluationMode === 'percentage' ? '%' : 'Marks'}
                              </th>
                              <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                Max {formData.evaluationMode === 'percentage' ? '%' : 'Marks'}
                              </th>
                            </>
                        }
                          <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                          <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase">Grade Point</th>
                          {isEditing && <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase w-16">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.grades.length === 0 ?
                      <tr>
                            <td colSpan={isEditing ? 8 : 6} className="py-8 text-center text-gray-500">
                              No grades defined. Click "Add Grade" to add grade definitions.
                            </td>
                          </tr> :

                      formData.grades.map((grade, index) =>
                      <tr key={grade.id} className="hover:bg-gray-50">
                              {isEditing &&
                        <td className="py-2 px-3">
                                  <div className="flex flex-col gap-1">
                                    <button
                              onClick={() => moveGradeRow(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">

                                      <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                              onClick={() => moveGradeRow(index, 'down')}
                              disabled={index === formData.grades.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">

                                      <ChevronDown className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                        }
                              <td className="py-2 px-3">
                                <input
                            type="text"
                            value={grade.label}
                            onChange={(e) => updateGradeRow(grade.id, 'label', e.target.value)}
                            disabled={!isEditing}
                            placeholder="A1"
                            className={`w-full border rounded px-2 py-1.5 text-sm ${
                            errors[`grade_${index}_label`] ? 'border-red-500' : 'border-gray-300'} ${
                            !isEditing ? 'bg-gray-50 border-transparent' : ''}`} />

                              </td>
                              {formData.evaluationMode !== 'grade_only' &&
                        <>
                                  <td className="py-2 px-3">
                                    <input
                              type="number"
                              value={grade.minValue}
                              onChange={(e) => updateGradeRow(grade.id, 'minValue', parseInt(e.target.value) || 0)}
                              disabled={!isEditing}
                              min="0"
                              className={`w-20 mx-auto block text-center border rounded px-2 py-1.5 text-sm ${
                              errors[`grade_${index}_range`] ? 'border-red-500' : 'border-gray-300'} ${
                              !isEditing ? 'bg-gray-50 border-transparent' : ''}`} />

                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                              type="number"
                              value={grade.maxValue}
                              onChange={(e) => updateGradeRow(grade.id, 'maxValue', parseInt(e.target.value) || 0)}
                              disabled={!isEditing}
                              min="0"
                              className={`w-20 mx-auto block text-center border rounded px-2 py-1.5 text-sm ${
                              errors[`grade_${index}_range`] ? 'border-red-500' : 'border-gray-300'} ${
                              !isEditing ? 'bg-gray-50 border-transparent' : ''}`} />

                                  </td>
                                </>
                        }
                              <td className="py-2 px-3">
                                <input
                            type="text"
                            value={grade.description}
                            onChange={(e) => updateGradeRow(grade.id, 'description', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Outstanding"
                            className={`w-full border rounded px-2 py-1.5 text-sm border-gray-300 ${!isEditing ? 'bg-gray-50 border-transparent' : ''}`} />

                              </td>
                              <td className="py-2 px-3">
                                {isEditing ?
                          <select
                            value={grade.status}
                            onChange={(e) => updateGradeRow(grade.id, 'status', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">

                                    <option value="pass">Pass</option>
                                    <option value="fail">Fail</option>
                                  </select> :

                          <Badge
                            variant={grade.status === 'pass' ? 'success' : 'danger'}
                            className="mx-auto block w-fit">

                                    {grade.status === 'pass' ? 'Pass' : 'Fail'}
                                  </Badge>
                          }
                              </td>
                              <td className="py-2 px-3">
                                <input
                            type="number"
                            value={grade.gradePoint}
                            onChange={(e) => updateGradeRow(grade.id, 'gradePoint', parseFloat(e.target.value) || 0)}
                            disabled={!isEditing}
                            min="0"
                            step="0.5"
                            className={`w-16 mx-auto block text-center border rounded px-2 py-1.5 text-sm border-gray-300 ${!isEditing ? 'bg-gray-50 border-transparent' : ''}`} />

                              </td>
                              {isEditing &&
                        <td className="py-2 px-3 text-center">
                                  <button
                            onClick={() => removeGradeRow(grade.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">

                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                        }
                            </tr>
                      )
                      }
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Conversion Rules */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Conversion Rules
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg ${isEditing ? 'cursor-pointer hover:bg-gray-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Auto Marks to Grade Conversion</p>
                          <p className="text-xs text-gray-500">Automatically convert marks to grade based on defined ranges</p>
                        </div>
                      </div>
                      <input
                      type="checkbox"
                      checked={formData.conversionRules.autoMarksToGrade}
                      onChange={() => handleConversionRuleToggle('autoMarksToGrade')}
                      disabled={!isEditing}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                    </label>

                    <label className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg ${isEditing ? 'cursor-pointer hover:bg-gray-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Grade to Grade Mapping</p>
                          <p className="text-xs text-gray-500">Enable mapping when migrating between grade scales</p>
                        </div>
                      </div>
                      <input
                      type="checkbox"
                      checked={formData.conversionRules.gradeToGradeMapping}
                      onChange={() => handleConversionRuleToggle('gradeToGradeMapping')}
                      disabled={!isEditing}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />

                    </label>

                    <label className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg ${isEditing ? 'cursor-pointer hover:bg-gray-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Auto Pass/Fail Detection</p>
                          <p className="text-xs text-gray-500">Automatically determine pass/fail based on grade status</p>
                        </div>
                      </div>
                      <input
                      type="checkbox"
                      checked={formData.conversionRules.autoPassFailDetection}
                      onChange={() => handleConversionRuleToggle('autoPassFailDetection')}
                      disabled={!isEditing}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />

                    </label>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Grade Scale Status</p>
                    <p className="text-xs text-gray-500">Active scales can be used in result generation</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.isActive ?
                  <Badge variant="success">Active</Badge> :

                  <Badge variant="secondary">Inactive</Badge>
                  }
                    {isEditing &&
                  <button
                    onClick={() => handleFormChange('isActive', !formData.isActive)}
                    className="text-gray-400 hover:text-gray-600">

                        {formData.isActive ?
                    <ToggleRight className="w-8 h-8 text-green-600" /> :

                    <ToggleLeft className="w-8 h-8" />
                    }
                      </button>
                  }
                  </div>
                </div>
              </div>
            </Card>
          }
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Grade Scale</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? 
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700">

                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Usage Modal */}
      {showUsageModal && selectedScale &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Grade Scale Usage</h2>
              <button
              onClick={() => setShowUsageModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">

                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">{selectedScale.name}</h3>
                </div>
                <p className="text-sm text-blue-700">
                  This grade scale is currently used in {selectedScale.usageCount} result generation(s).
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Locations:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Half Yearly Exam 2024</span>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Final Exam 2024</span>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Unit Test 1</span>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Modifying this grade scale may affect existing results. Please contact admin for changes.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setShowUsageModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default GradeSetup;