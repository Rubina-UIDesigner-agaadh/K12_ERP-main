import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Shield,
  Send,
  CheckCircle,
  Star,
  User,
  BookOpen,
  GraduationCap,
  MessageSquare,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Save,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Clock,
  History,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Search,
  Filter,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Square,
  Award,
  Target,
  TrendingUp,
  FileText,
  List,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  Building,
  HelpCircle,
  Bookmark,
  Flag,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Lightbulb } from
'lucide-react';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
type FeedbackType = 'student' | 'peer';
type FeedbackStatus = 'draft' | 'submitted' | 'reviewed';
type QuestionCategory = 'teaching' | 'communication' | 'assessment' | 'professional' | 'overall';

interface Teacher {
  id: string;
  name: string;
  initials: string;
  department: string;
  designation: string;
  subjects: string[];
  classes: string[];
  email: string;
  totalFeedbacks: number;
  averageRating: number;
}

interface ClassOption {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
}

interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  type: FeedbackType;
  required: boolean;
  helpText?: string;
}

interface FeedbackRating {
  questionId: string;
  rating: number;
  skipped: boolean;
}

interface FeedbackSubmission {
  id: string;
  sessionId: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  feedbackType: FeedbackType;
  ratings: FeedbackRating[];
  comment: string;
  strengths: string;
  improvements: string;
  status: FeedbackStatus;
  createdAt: Date;
  submittedAt: Date | null;
  timeSpent: number;
  isAnonymous: boolean;
}

interface DraftFeedback {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  feedbackType: FeedbackType;
  ratings: Record<number, number>;
  comment: string;
  strengths: string;
  improvements: string;
  savedAt: Date;
  progress: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface FeedbackSession {
  sessionId: string;
  startTime: Date;
  teachersCompleted: string[];
  totalTeachers: number;
}

// ---------------------------------------------------------------------------
// Constants & Initial Data
// ---------------------------------------------------------------------------
const TEACHERS: Teacher[] = [
{
  id: 'T001',
  name: 'Dr. Robert Smith',
  initials: 'RS',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  subjects: ['Calculus', 'Algebra', 'Statistics'],
  classes: ['Class 10-A', 'Class 10-B', 'Class 11-A'],
  email: 'robert.smith@school.edu',
  totalFeedbacks: 45,
  averageRating: 4.2
},
{
  id: 'T002',
  name: 'Mrs. Sarah Johnson',
  initials: 'SJ',
  department: 'Science',
  designation: 'HOD',
  subjects: ['Physics', 'Chemistry'],
  classes: ['Class 11-A', 'Class 11-B', 'Class 12-A'],
  email: 'sarah.johnson@school.edu',
  totalFeedbacks: 62,
  averageRating: 4.5
},
{
  id: 'T003',
  name: 'Mr. Michael Chen',
  initials: 'MC',
  department: 'English',
  designation: 'Teacher',
  subjects: ['English Literature', 'Grammar'],
  classes: ['Class 9-A', 'Class 9-B', 'Class 10-A'],
  email: 'michael.chen@school.edu',
  totalFeedbacks: 38,
  averageRating: 4.0
},
{
  id: 'T004',
  name: 'Ms. Emily Davis',
  initials: 'ED',
  department: 'History',
  designation: 'Senior Teacher',
  subjects: ['World History', 'Indian History'],
  classes: ['Class 10-A', 'Class 10-B'],
  email: 'emily.davis@school.edu',
  totalFeedbacks: 29,
  averageRating: 4.3
},
{
  id: 'T005',
  name: 'Dr. James Wilson',
  initials: 'JW',
  department: 'Computer Science',
  designation: 'HOD',
  subjects: ['Programming', 'Data Structures'],
  classes: ['Class 11-A', 'Class 12-A', 'Class 12-B'],
  email: 'james.wilson@school.edu',
  totalFeedbacks: 51,
  averageRating: 4.6
}];


const CLASSES: ClassOption[] = [
{ id: 'C001', name: 'Class 10-A', subject: 'Mathematics', teacherId: 'T001' },
{ id: 'C002', name: 'Class 10-B', subject: 'Mathematics', teacherId: 'T001' },
{ id: 'C003', name: 'Class 11-A', subject: 'Mathematics', teacherId: 'T001' },
{ id: 'C004', name: 'Class 11-A', subject: 'Physics', teacherId: 'T002' },
{ id: 'C005', name: 'Class 11-B', subject: 'Physics', teacherId: 'T002' },
{ id: 'C006', name: 'Class 12-A', subject: 'Chemistry', teacherId: 'T002' },
{ id: 'C007', name: 'Class 9-A', subject: 'English', teacherId: 'T003' },
{ id: 'C008', name: 'Class 9-B', subject: 'English', teacherId: 'T003' },
{ id: 'C009', name: 'Class 10-A', subject: 'English', teacherId: 'T003' },
{ id: 'C010', name: 'Class 10-A', subject: 'History', teacherId: 'T004' },
{ id: 'C011', name: 'Class 10-B', subject: 'History', teacherId: 'T004' },
{ id: 'C012', name: 'Class 11-A', subject: 'Computer Science', teacherId: 'T005' },
{ id: 'C013', name: 'Class 12-A', subject: 'Computer Science', teacherId: 'T005' },
{ id: 'C014', name: 'Class 12-B', subject: 'Computer Science', teacherId: 'T005' }];


const STUDENT_QUESTIONS: Question[] = [
{
  id: 'SQ001',
  text: 'Does the teacher explain concepts clearly?',
  category: 'teaching',
  type: 'student',
  required: true,
  helpText: 'Consider how well the teacher breaks down complex topics'
},
{
  id: 'SQ002',
  text: 'Is the teacher approachable for doubts?',
  category: 'communication',
  type: 'student',
  required: true,
  helpText: 'Think about how comfortable you feel asking questions'
},
{
  id: 'SQ003',
  text: 'Does the teacher make the class interesting?',
  category: 'teaching',
  type: 'student',
  required: true,
  helpText: 'Consider the teaching methods and engagement level'
},
{
  id: 'SQ004',
  text: 'Is the teacher fair in assessments?',
  category: 'assessment',
  type: 'student',
  required: true,
  helpText: 'Think about grading fairness and consistency'
},
{
  id: 'SQ005',
  text: 'Does the teacher come prepared to class?',
  category: 'professional',
  type: 'student',
  required: true,
  helpText: 'Consider if lessons are well-organized'
},
{
  id: 'SQ006',
  text: 'Does the teacher provide helpful feedback on assignments?',
  category: 'assessment',
  type: 'student',
  required: false,
  helpText: 'Think about the quality of comments and suggestions'
},
{
  id: 'SQ007',
  text: 'Does the teacher encourage participation?',
  category: 'communication',
  type: 'student',
  required: false,
  helpText: 'Consider how the teacher involves students in discussions'
},
{
  id: 'SQ008',
  text: 'Overall rating of the teacher',
  category: 'overall',
  type: 'student',
  required: true,
  helpText: 'Your overall impression of the teacher'
}];


const PEER_QUESTIONS: Question[] = [
{
  id: 'PQ001',
  text: 'Collaboration and teamwork',
  category: 'professional',
  type: 'peer',
  required: true,
  helpText: 'How well does the colleague work with others?'
},
{
  id: 'PQ002',
  text: 'Subject matter expertise',
  category: 'teaching',
  type: 'peer',
  required: true,
  helpText: 'Knowledge depth in their subject area'
},
{
  id: 'PQ003',
  text: 'Communication skills',
  category: 'communication',
  type: 'peer',
  required: true,
  helpText: 'Clarity and effectiveness of communication'
},
{
  id: 'PQ004',
  text: 'Reliability and punctuality',
  category: 'professional',
  type: 'peer',
  required: true,
  helpText: 'Consistency in meeting commitments'
},
{
  id: 'PQ005',
  text: 'Innovation in teaching methods',
  category: 'teaching',
  type: 'peer',
  required: true,
  helpText: 'Creativity and new approaches to teaching'
},
{
  id: 'PQ006',
  text: 'Mentorship and support to colleagues',
  category: 'professional',
  type: 'peer',
  required: false,
  helpText: 'Willingness to help and guide other teachers'
},
{
  id: 'PQ007',
  text: 'Contribution to department activities',
  category: 'professional',
  type: 'peer',
  required: false,
  helpText: 'Participation in events and initiatives'
},
{
  id: 'PQ008',
  text: 'Overall professional conduct',
  category: 'overall',
  type: 'peer',
  required: true,
  helpText: 'Overall impression as a colleague'
}];


const SMILEYS = ['😞', '😐', '🙂', '😊', '😄'];
const SMILEY_LABELS = ['Poor', 'Below Avg', 'Average', 'Good', 'Excellent'];
const SMILEY_COLORS = [
'bg-red-100 border-red-300',
'bg-orange-100 border-orange-300',
'bg-yellow-100 border-yellow-300',
'bg-green-100 border-green-300',
'bg-emerald-100 border-emerald-300'];


const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  teaching: 'Teaching Quality',
  communication: 'Communication',
  assessment: 'Assessment & Feedback',
  professional: 'Professionalism',
  overall: 'Overall Rating'
};

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------
const generateSessionId = (): string => {
  return `FB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const calculateAverageRating = (ratings: Record<number, number>): number => {
  const values = Object.values(ratings);
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

// ---------------------------------------------------------------------------
// Notification Toast Component
// ---------------------------------------------------------------------------
interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const icons = {
          success: <CheckCircle className="h-5 w-5 text-green-600" />,
          error: <XCircle className="h-5 w-5 text-red-600" />,
          warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
          info: <Info className="h-5 w-5 text-blue-600" />
        };

        const styles = {
          success: 'bg-green-50 border-green-200 text-green-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800'
        };

        return (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] ${styles[notification.type]} animate-slide-in`}>

            {icons[notification.type]}
            <span className="flex-1 text-sm font-medium">{notification.message}</span>
            <button onClick={() => onDismiss(notification.id)} className="p-1 hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>);

      })}
    </div>);

}

// ---------------------------------------------------------------------------
// Confirmation Dialog Component
// ---------------------------------------------------------------------------
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  const icons = {
    danger: <XCircle className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full m-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {icons[variant]}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <button
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${variantStyles[variant]}`}
              onClick={() => {
                onConfirm();
                onClose();
              }}>

              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// Teacher Selection Modal Component
// ---------------------------------------------------------------------------
interface TeacherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (teacher: Teacher, classOption: ClassOption) => void;
  teachers: Teacher[];
  classes: ClassOption[];
  completedTeachers: string[];
}

function TeacherSelectionModal({
  isOpen,
  onClose,
  onSelect,
  teachers,
  classes,
  completedTeachers
}: TeacherSelectionModalProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !departmentFilter || t.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [teachers, searchTerm, departmentFilter]);

  const availableClasses = useMemo(() => {
    return classes.filter((c) => c.teacherId === selectedTeacherId);
  }, [classes, selectedTeacherId]);

  const departments = useMemo(() => {
    return [...new Set(teachers.map((t) => t.department))];
  }, [teachers]);

  const handleSelect = () => {
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    const classOption = classes.find((c) => c.id === selectedClassId);
    if (teacher && classOption) {
      onSelect(teacher, classOption);
      setSelectedTeacherId('');
      setSelectedClassId('');
      onClose();
    }
  };

  useEffect(() => {
    setSelectedClassId('');
  }, [selectedTeacherId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Teacher" size="lg">
      <div className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
            { value: '', label: 'All Departments' },
            ...departments.map((d) => ({ value: d, label: d }))]
            } />

        </div>

        {/* Teacher List */}
        <div className="max-h-64 overflow-auto border rounded-lg divide-y">
          {filteredTeachers.map((teacher) => {
            const isCompleted = completedTeachers.includes(teacher.id);
            const isSelected = selectedTeacherId === teacher.id;

            return (
              <button
                key={teacher.id}
                onClick={() => !isCompleted && setSelectedTeacherId(teacher.id)}
                disabled={isCompleted}
                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                isCompleted ?
                'bg-gray-50 opacity-60 cursor-not-allowed' :
                isSelected ?
                'bg-blue-50' :
                'hover:bg-gray-50'}`
                }>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  {teacher.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{teacher.name}</span>
                    {isCompleted &&
                    <Badge variant="success" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" /> Done
                      </Badge>
                    }
                  </div>
                  <p className="text-sm text-gray-500">
                    {teacher.department} • {teacher.designation}
                  </p>
                </div>
                {isSelected && !isCompleted &&
                <CheckCircle className="w-5 h-5 text-blue-600" />
                }
              </button>);

          })}
        </div>

        {/* Class Selection */}
        {selectedTeacherId &&
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class / Subject
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableClasses.map((classOption) =>
            <button
              key={classOption.id}
              onClick={() => setSelectedClassId(classOption.id)}
              className={`p-3 border rounded-lg text-left transition-colors ${
              selectedClassId === classOption.id ?
              'border-blue-500 bg-blue-50' :
              'border-gray-200 hover:border-gray-300'}`
              }>

                  <p className="font-medium text-gray-900">{classOption.name}</p>
                  <p className="text-sm text-gray-500">{classOption.subject}</p>
                </button>
            )}
            </div>
          </div>
        }

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSelect}
            disabled={!selectedTeacherId || !selectedClassId}>

            Continue
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Preview Modal Component
// ---------------------------------------------------------------------------
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  teacher: Teacher | null;
  classOption: ClassOption | null;
  feedbackType: FeedbackType;
  ratings: Record<number, number>;
  questions: Question[];
  comment: string;
  strengths: string;
  improvements: string;
  averageRating: number;
  timeSpent: number;
}

function PreviewModal({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  teacher,
  classOption,
  feedbackType,
  ratings,
  questions,
  comment,
  strengths,
  improvements,
  averageRating,
  timeSpent
}: PreviewModalProps) {
  if (!teacher) return null;

  const getRatingLabel = (rating: number, type: FeedbackType): string => {
    if (type === 'student') {
      return SMILEY_LABELS[rating - 1] || '';
    }
    return `${rating}/5 Stars`;
  };

  // Group questions by category
  const groupedQuestions = useMemo(() => {
    const groups: Record<QuestionCategory, {question: Question;rating: number;}[]> = {
      teaching: [],
      communication: [],
      assessment: [],
      professional: [],
      overall: []
    };

    questions.forEach((q, index) => {
      if (ratings[index] !== undefined) {
        groups[q.category].push({ question: q, rating: ratings[index] });
      }
    });

    return groups;
  }, [questions, ratings]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Your Feedback" size="lg">
      <div className="space-y-6">
        {/* Summary Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">
              {teacher.initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{teacher.name}</p>
              <p className="text-sm text-gray-500">
                {classOption?.name} • {classOption?.subject}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}/5</p>
          </div>
        </div>

        {/* Ratings by Category */}
        <div className="space-y-4 max-h-64 overflow-auto">
          {Object.entries(groupedQuestions).map(([category, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {CATEGORY_LABELS[category as QuestionCategory]}
                </h4>
                <div className="space-y-2">
                  {items.map(({ question, rating }) =>
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded">

                      <span className="text-sm text-gray-700">{question.text}</span>
                      <span className="text-sm font-medium text-blue-600">
                        {feedbackType === 'student' ? SMILEYS[rating - 1] : ''}{' '}
                        {getRatingLabel(rating, feedbackType)}
                      </span>
                    </div>
                  )}
                </div>
              </div>);

          })}
        </div>

        {/* Comments */}
        {(comment || strengths || improvements) &&
        <div className="space-y-3 pt-4 border-t">
            {strengths &&
          <div>
                <p className="text-xs font-medium text-green-600 uppercase mb-1">Strengths</p>
                <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">{strengths}</p>
              </div>
          }
            {improvements &&
          <div>
                <p className="text-xs font-medium text-amber-600 uppercase mb-1">Areas for Improvement</p>
                <p className="text-sm text-gray-700 bg-amber-50 p-2 rounded">{improvements}</p>
              </div>
          }
            {comment &&
          <div>
                <p className="text-xs font-medium text-gray-600 uppercase mb-1">Additional Comments</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{comment}</p>
              </div>
          }
          </div>
        }

        {/* Time Spent */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          Time spent: {formatDuration(timeSpent)}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onEdit} leftIcon={<Edit className="w-4 h-4" />}>
            Edit Feedback
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} leftIcon={<Send className="w-4 h-4" />}>
              Submit Feedback
            </Button>
          </div>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Drafts Modal Component
// ---------------------------------------------------------------------------
interface DraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftFeedback[];
  onLoadDraft: (draft: DraftFeedback) => void;
  onDeleteDraft: (draftId: string) => void;
}

function DraftsModal({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft
}: DraftsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saved Drafts" size="md">
      <div className="space-y-4">
        {drafts.length > 0 ?
        <div className="space-y-2 max-h-80 overflow-auto">
            {drafts.map((draft) =>
          <div key={draft.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{draft.teacherName}</p>
                    <p className="text-sm text-gray-500">{draft.className}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>Saved: {formatDateTime(draft.savedAt)}</span>
                      <span>Progress: {draft.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onLoadDraft(draft);
                    onClose();
                  }}>

                      Continue
                    </Button>
                    <button
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  onClick={() => onDeleteDraft(draft.id)}>

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          )}
          </div> :

        <div className="text-center py-8 text-gray-500">
            <Bookmark className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No saved drafts</p>
          </div>
        }
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Feedback History Modal Component
// ---------------------------------------------------------------------------
interface FeedbackHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: FeedbackSubmission[];
}

function FeedbackHistoryModal({
  isOpen,
  onClose,
  submissions
}: FeedbackHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Feedback History" size="md">
      <div className="space-y-4">
        {submissions.length > 0 ?
        <div className="space-y-2 max-h-80 overflow-auto">
            {submissions.map((submission) => {
            const avgRating =
            submission.ratings.reduce((sum, r) => sum + (r.skipped ? 0 : r.rating), 0) /
            submission.ratings.filter((r) => !r.skipped).length;

            return (
              <div key={submission.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{submission.teacherName}</span>
                        <Badge variant={submission.feedbackType === 'student' ? 'info' : 'secondary'}>
                          {submission.feedbackType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{submission.className}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {formatDateTime(submission.submittedAt!)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="text-lg font-bold text-blue-600">{avgRating.toFixed(1)}/5</p>
                    </div>
                  </div>
                </div>);

          })}
          </div> :

        <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No feedback submitted yet</p>
          </div>
        }
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Help Modal Component
// ---------------------------------------------------------------------------
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Give Feedback" size="md">
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Your Privacy is Protected</span>
          </div>
          <p className="text-sm text-blue-700">
            All feedback is completely anonymous. Your identity will never be revealed to teachers or administration.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Select a Teacher</p>
              <p className="text-sm text-gray-500">Choose the teacher and class you want to provide feedback for.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Answer Questions</p>
              <p className="text-sm text-gray-500">Rate each aspect using smileys (students) or stars (peers).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Comments</p>
              <p className="text-sm text-gray-500">Share specific strengths, improvement areas, or additional thoughts.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              4
            </div>
            <div>
              <p className="font-medium text-gray-900">Review & Submit</p>
              <p className="text-sm text-gray-500">Preview your feedback before final submission.</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Tips for Helpful Feedback</span>
          </div>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Be honest but constructive</li>
            <li>• Focus on specific behaviors or actions</li>
            <li>• Suggest improvements where possible</li>
            <li>• Acknowledge positive aspects</li>
          </ul>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="primary" onClick={onClose}>
            Got it!
          </Button>
        </div>
      </div>
    </Modal>);

}

// ---------------------------------------------------------------------------
// Success Screen Component
// ---------------------------------------------------------------------------
interface SuccessScreenProps {
  onNewFeedback: () => void;
  onSelectTeacher: () => void;
  session: FeedbackSession;
  lastSubmission: FeedbackSubmission | null;
}

function SuccessScreen({
  onNewFeedback,
  onSelectTeacher,
  session,
  lastSubmission
}: SuccessScreenProps) {
  const remainingTeachers = session.totalTeachers - session.teachersCompleted.length;

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your feedback has been submitted anonymously. It will help improve the teaching quality at our institution.
        </p>

        {lastSubmission &&
        <div className="p-4 bg-gray-50 rounded-lg mb-6 text-left">
            <p className="text-sm text-gray-500 mb-2">Feedback submitted for:</p>
            <p className="font-semibold text-gray-900">{lastSubmission.teacherName}</p>
            <p className="text-sm text-gray-600">{lastSubmission.className}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              Time spent: {formatDuration(lastSubmission.timeSpent)}
            </div>
          </div>
        }

        {/* Session Progress */}
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Session Progress</span>
            <span className="text-sm text-blue-600">
              {session.teachersCompleted.length}/{session.totalTeachers} teachers
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${session.teachersCompleted.length / session.totalTeachers * 100}%` }} />

          </div>
          {remainingTeachers > 0 &&
          <p className="text-xs text-blue-600 mt-2">
              {remainingTeachers} more teacher{remainingTeachers > 1 ? 's' : ''} remaining
            </p>
          }
        </div>

        <div className="flex flex-col gap-3">
          {remainingTeachers > 0 &&
          <Button variant="primary" onClick={onSelectTeacher} className="w-full">
              Continue to Next Teacher
            </Button>
          }
          <Button variant="outline" onClick={onNewFeedback} className="w-full">
            {remainingTeachers > 0 ? 'Start New Session' : 'Submit Another Feedback'}
          </Button>
        </div>
      </div>
    </div>);

}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function PeerStudentFeedbackCapture() {
  // Session State
  const [session, setSession] = useState<FeedbackSession>({
    sessionId: generateSessionId(),
    startTime: new Date(),
    teachersCompleted: [],
    totalTeachers: TEACHERS.length
  });
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Selection State
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassOption | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('student');

  // Rating State
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set());
  const [comment, setComment] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  // UI State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [submitted, setSubmitted] = useState(false);

  // Data State
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [drafts, setDrafts] = useState<DraftFeedback[]>([]);

  // Modal State
  const [showTeacherModal, setShowTeacherModal] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'info' });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Get current questions based on feedback type
  const currentQuestions = useMemo(() => {
    return feedbackType === 'student' ? STUDENT_QUESTIONS : PEER_QUESTIONS;
  }, [feedbackType]);

  // Calculate progress
  const progress = useMemo(() => {
    const answered = Object.keys(ratings).length + skippedQuestions.size;
    return Math.round(answered / currentQuestions.length * 100);
  }, [ratings, skippedQuestions, currentQuestions]);

  // Check if all required questions are answered
  const allRequiredAnswered = useMemo(() => {
    return currentQuestions.every((q, index) => {
      if (!q.required) return true;
      return ratings[index] !== undefined || skippedQuestions.has(index);
    });
  }, [currentQuestions, ratings, skippedQuestions]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    return calculateAverageRating(ratings);
  }, [ratings]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Notification Functions
  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Handlers
  const handleTeacherSelect = useCallback((teacher: Teacher, classOption: ClassOption) => {
    setSelectedTeacher(teacher);
    setSelectedClass(classOption);
    setStartTime(new Date());
    setElapsedTime(0);
    addNotification('info', `Selected ${teacher.name} - ${classOption.name}`);
  }, [addNotification]);

  const handleSwitchType = useCallback((type: FeedbackType) => {
    if (Object.keys(ratings).length > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Switch Feedback Type',
        message: 'Switching will clear your current ratings. Are you sure?',
        variant: 'warning',
        onConfirm: () => {
          setFeedbackType(type);
          setRatings({});
          setSkippedQuestions(new Set());
          setComment('');
          setStrengths('');
          setImprovements('');
          setCurrentQuestionIndex(0);
        }
      });
    } else {
      setFeedbackType(type);
      setRatings({});
      setSkippedQuestions(new Set());
      setCurrentQuestionIndex(0);
    }
  }, [ratings]);

  const handleSetRating = useCallback((questionIndex: number, value: number) => {
    setRatings((prev) => ({ ...prev, [questionIndex]: value }));
    setSkippedQuestions((prev) => {
      const next = new Set(prev);
      next.delete(questionIndex);
      return next;
    });
  }, []);

  const handleSkipQuestion = useCallback((questionIndex: number) => {
    const question = currentQuestions[questionIndex];
    if (question.required) {
      addNotification('warning', 'This question is required and cannot be skipped');
      return;
    }
    setSkippedQuestions((prev) => new Set(prev).add(questionIndex));
    setRatings((prev) => {
      const next = { ...prev };
      delete next[questionIndex];
      return next;
    });
    addNotification('info', 'Question skipped');
  }, [currentQuestions, addNotification]);

  const handleClearRating = useCallback((questionIndex: number) => {
    setRatings((prev) => {
      const next = { ...prev };
      delete next[questionIndex];
      return next;
    });
    setSkippedQuestions((prev) => {
      const next = new Set(prev);
      next.delete(questionIndex);
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset All Ratings',
      message: 'This will clear all your ratings and comments. Are you sure?',
      variant: 'danger',
      onConfirm: () => {
        setRatings({});
        setSkippedQuestions(new Set());
        setComment('');
        setStrengths('');
        setImprovements('');
        setCurrentQuestionIndex(0);
        addNotification('info', 'All ratings cleared');
      }
    });
  }, [addNotification]);

  const handleSaveDraft = useCallback(() => {
    if (!selectedTeacher || !selectedClass) return;

    const draft: DraftFeedback = {
      id: Date.now().toString(),
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      classId: selectedClass.id,
      className: `${selectedClass.name} - ${selectedClass.subject}`,
      feedbackType,
      ratings: { ...ratings },
      comment,
      strengths,
      improvements,
      savedAt: new Date(),
      progress
    };

    setDrafts((prev) => [...prev, draft]);
    addNotification('success', 'Draft saved successfully');
  }, [selectedTeacher, selectedClass, feedbackType, ratings, comment, strengths, improvements, progress, addNotification]);

  const handleLoadDraft = useCallback((draft: DraftFeedback) => {
    const teacher = TEACHERS.find((t) => t.id === draft.teacherId);
    const classOption = CLASSES.find((c) => c.id === draft.classId);

    if (teacher && classOption) {
      setSelectedTeacher(teacher);
      setSelectedClass(classOption);
      setFeedbackType(draft.feedbackType);
      setRatings(draft.ratings);
      setComment(draft.comment);
      setStrengths(draft.strengths);
      setImprovements(draft.improvements);
      setSubmitted(false);
      setShowTeacherModal(false);
      addNotification('success', 'Draft loaded');
    }
  }, [addNotification]);

  const handleDeleteDraft = useCallback((draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    addNotification('success', 'Draft deleted');
  }, [addNotification]);

  const handlePreview = useCallback(() => {
    if (!allRequiredAnswered) {
      addNotification('error', 'Please answer all required questions');
      return;
    }
    setShowPreviewModal(true);
  }, [allRequiredAnswered, addNotification]);

  const handleSubmit = useCallback(() => {
    if (!selectedTeacher || !selectedClass) return;

    const submission: FeedbackSubmission = {
      id: Date.now().toString(),
      sessionId: session.sessionId,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      classId: selectedClass.id,
      className: `${selectedClass.name} - ${selectedClass.subject}`,
      feedbackType,
      ratings: currentQuestions.map((q, index) => ({
        questionId: q.id,
        rating: ratings[index] || 0,
        skipped: skippedQuestions.has(index)
      })),
      comment,
      strengths,
      improvements,
      status: 'submitted',
      createdAt: startTime,
      submittedAt: new Date(),
      timeSpent: elapsedTime,
      isAnonymous: true
    };

    setSubmissions((prev) => [...prev, submission]);
    setSession((prev) => ({
      ...prev,
      teachersCompleted: [...prev.teachersCompleted, selectedTeacher.id]
    }));

    // Remove draft if exists
    setDrafts((prev) => prev.filter((d) => d.teacherId !== selectedTeacher.id));

    setShowPreviewModal(false);
    setSubmitted(true);
    addNotification('success', 'Feedback submitted successfully!');
  }, [
  selectedTeacher,
  selectedClass,
  session,
  feedbackType,
  currentQuestions,
  ratings,
  skippedQuestions,
  comment,
  strengths,
  improvements,
  startTime,
  elapsedTime,
  addNotification]
  );

  const handleNewFeedback = useCallback(() => {
    setSelectedTeacher(null);
    setSelectedClass(null);
    setRatings({});
    setSkippedQuestions(new Set());
    setComment('');
    setStrengths('');
    setImprovements('');
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setStartTime(new Date());
    setElapsedTime(0);
    setSession({
      sessionId: generateSessionId(),
      startTime: new Date(),
      teachersCompleted: [],
      totalTeachers: TEACHERS.length
    });
    setShowTeacherModal(true);
  }, []);

  const handleContinueToNext = useCallback(() => {
    setRatings({});
    setSkippedQuestions(new Set());
    setComment('');
    setStrengths('');
    setImprovements('');
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setStartTime(new Date());
    setElapsedTime(0);
    setShowTeacherModal(true);
  }, []);

  const handleChangeTeacher = useCallback(() => {
    if (Object.keys(ratings).length > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Change Teacher',
        message: 'You have unsaved ratings. Do you want to save as draft before changing?',
        variant: 'warning',
        onConfirm: () => {
          handleSaveDraft();
          setShowTeacherModal(true);
        }
      });
    } else {
      setShowTeacherModal(true);
    }
  }, [ratings, handleSaveDraft]);

  // Navigation for single question mode
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, currentQuestions.length]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Get last submission for success screen
  const lastSubmission = useMemo(() => {
    return submissions[submissions.length - 1] || null;
  }, [submissions]);

  // Render success screen
  if (submitted) {
    return (
      <>
        <style>
          {`
            @keyframes slide-in {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in { animation: slide-in 0.3s ease-out; }
          `}
        </style>
        <SuccessScreen
          onNewFeedback={handleNewFeedback}
          onSelectTeacher={handleContinueToNext}
          session={session}
          lastSubmission={lastSubmission} />

        <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
      </>);

  }

  return (
    <div className="space-y-6 p-6">
      <style>
        {`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in { animation: slide-in 0.3s ease-out; }
        `}
      </style>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peer / Student Feedback Capture</h1>
          <p className="text-sm text-gray-500">Anonymous feedback collection for teacher evaluation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<History className="w-4 h-4" />}
            onClick={() => setShowHistoryModal(true)}>

            History ({submissions.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Bookmark className="w-4 h-4" />}
            onClick={() => setShowDraftsModal(true)}>

            Drafts ({drafts.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<HelpCircle className="w-4 h-4" />}
            onClick={() => setShowHelpModal(true)}>

            Help
          </Button>
        </div>
      </div>

      {/* Anonymous Banner */}
      <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg">
        <Shield className="w-6 h-6" />
        <div className="flex-1">
          <p className="font-semibold">This feedback is completely anonymous</p>
          <p className="text-sm text-blue-100">
            Your identity will not be revealed to the teacher or administration.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200">Session ID</p>
          <p className="text-sm font-mono">{session.sessionId}</p>
        </div>
      </div>

      {selectedTeacher && selectedClass ?
      <>
          {/* Teacher Context Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  {selectedTeacher.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTeacher.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedTeacher.department} · {selectedTeacher.designation}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{selectedClass.name}</Badge>
                    <Badge variant="secondary">{selectedClass.subject}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Time Elapsed</p>
                  <p className="text-lg font-mono text-gray-700">{formatDuration(elapsedTime)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleChangeTeacher}>
                  Change Teacher
                </Button>
              </div>
            </div>

            {/* Feedback Type Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
              onClick={() => handleSwitchType('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              feedbackType === 'student' ?
              'bg-white shadow text-blue-700' :
              'text-gray-600 hover:text-gray-800'}`
              }>

                <GraduationCap className="w-4 h-4" />
                Student Feedback
              </button>
              <button
              onClick={() => handleSwitchType('peer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              feedbackType === 'peer' ?
              'bg-white shadow text-blue-700' :
              'text-gray-600 hover:text-gray-800'}`
              }>

                <User className="w-4 h-4" />
                Peer Feedback
              </button>
            </div>
          </Card>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }} />

            </div>
            <span className="text-sm text-gray-600">{progress}% complete</span>
            <div className="flex gap-1">
              <button
              onClick={() => setViewMode(viewMode === 'all' ? 'single' : 'all')}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title={viewMode === 'all' ? 'Switch to single question view' : 'Show all questions'}>

                {viewMode === 'all' ? <List className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
              </button>
              <button
              onClick={handleResetAll}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Reset all ratings">

                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Questions */}
          <Card
          title={
          feedbackType === 'student' ?
          'Student Feedback Questions' :
          'Peer Feedback Questions'
          }>

            <div className="space-y-6">
              {viewMode === 'all' ?
            // All questions view
            currentQuestions.map((question, qi) =>
            <div key={question.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {qi + 1}. {question.text}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        {question.helpText &&
                  <p className="text-xs text-gray-500 mt-1">{question.helpText}</p>
                  }
                      </div>
                      <div className="flex items-center gap-2">
                        {ratings[qi] !== undefined &&
                  <button
                    onClick={() => handleClearRating(qi)}
                    className="text-xs text-gray-400 hover:text-red-600">

                            Clear
                          </button>
                  }
                        {!question.required && ratings[qi] === undefined && !skippedQuestions.has(qi) &&
                  <button
                    onClick={() => handleSkipQuestion(qi)}
                    className="text-xs text-gray-400 hover:text-blue-600">

                            Skip
                          </button>
                  }
                      </div>
                    </div>

                    {skippedQuestions.has(qi) ?
              <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Skipped</span>
                        <button
                  onClick={() => {
                    setSkippedQuestions((prev) => {
                      const next = new Set(prev);
                      next.delete(qi);
                      return next;
                    });
                  }}
                  className="text-blue-600 hover:underline">

                          Undo
                        </button>
                      </div> :
              feedbackType === 'student' ?
              <div className="flex gap-3">
                        {SMILEYS.map((emoji, si) =>
                <button
                  key={si}
                  onClick={() => handleSetRating(qi, si + 1)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  ratings[qi] === si + 1 ?
                  SMILEY_COLORS[si] + ' scale-110' :
                  'border-gray-200 hover:border-gray-300 bg-white'}`
                  }>

                            <span className="text-2xl">{emoji}</span>
                            <span className="text-xs text-gray-600">{SMILEY_LABELS[si]}</span>
                          </button>
                )}
                      </div> :

              <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) =>
                <button
                  key={s}
                  onClick={() => handleSetRating(qi, s)}
                  className="focus:outline-none">

                            <Star
                    className={`w-7 h-7 ${
                    s <= (ratings[qi] || 0) ?
                    'fill-amber-400 text-amber-400' :
                    'text-gray-300'} hover:text-amber-300`
                    } />

                          </button>
                )}
                        {ratings[qi] &&
                <span className="ml-2 text-sm text-gray-500 self-center">
                            {ratings[qi]}/5
                          </span>
                }
                      </div>
              }

                    {qi < currentQuestions.length - 1 && <div className="border-b border-gray-100" />}
                  </div>
            ) :

            // Single question view
            <div className="min-h-[200px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      Question {currentQuestionIndex + 1} of {currentQuestions.length}
                    </span>
                    <Badge variant={currentQuestions[currentQuestionIndex].required ? 'error' : 'secondary'}>
                      {currentQuestions[currentQuestionIndex].required ? 'Required' : 'Optional'}
                    </Badge>
                  </div>

                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {currentQuestions[currentQuestionIndex].text}
                  </p>
                  {currentQuestions[currentQuestionIndex].helpText &&
              <p className="text-sm text-gray-500 mb-6">
                      {currentQuestions[currentQuestionIndex].helpText}
                    </p>
              }

                  {feedbackType === 'student' ?
              <div className="flex justify-center gap-4">
                      {SMILEYS.map((emoji, si) =>
                <button
                  key={si}
                  onClick={() => handleSetRating(currentQuestionIndex, si + 1)}
                  className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all ${
                  ratings[currentQuestionIndex] === si + 1 ?
                  SMILEY_COLORS[si] + ' scale-110' :
                  'border-gray-200 hover:border-gray-300 bg-white'}`
                  }>

                          <span className="text-3xl">{emoji}</span>
                          <span className="text-sm text-gray-600">{SMILEY_LABELS[si]}</span>
                        </button>
                )}
                    </div> :

              <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) =>
                <button
                  key={s}
                  onClick={() => handleSetRating(currentQuestionIndex, s)}
                  className="focus:outline-none p-2">

                          <Star
                    className={`w-10 h-10 ${
                    s <= (ratings[currentQuestionIndex] || 0) ?
                    'fill-amber-400 text-amber-400' :
                    'text-gray-300'} hover:text-amber-300`
                    } />

                        </button>
                )}
                    </div>
              }

                  <div className="flex justify-between mt-8">
                    <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}>

                      Previous
                    </Button>
                    <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === currentQuestions.length - 1}
                  rightIcon={<ChevronRight className="w-4 h-4" />}>

                      Next
                    </Button>
                  </div>
                </div>
            }
            </div>
          </Card>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Strengths (Optional)">
              <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="What does the teacher do well?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={500} />

              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Focus on specific positive aspects</span>
                <span>{strengths.length}/500</span>
              </div>
            </Card>

            <Card title="Areas for Improvement (Optional)">
              <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="What could be improved?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={500} />

              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Be constructive and specific</span>
                <span>{improvements.length}/500</span>
              </div>
            </Card>
          </div>

          {/* Additional Comments */}
          <Card title="Additional Comments (Optional)">
            <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share any additional feedback or suggestions..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            maxLength={1000} />

            <div className="flex justify-end mt-1 text-xs text-gray-400">
              <span>{comment.length}/1000</span>
            </div>
          </Card>

          {/* Submit Bar */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {Object.keys(ratings).length}/{currentQuestions.length} questions answered
              </span>
              {averageRating > 0 &&
            <span className="text-sm text-gray-500">
                  Avg Rating: <span className="font-semibold text-blue-600">{averageRating.toFixed(1)}/5</span>
                </span>
            }
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft} leftIcon={<Save className="w-4 h-4" />}>
                Save Draft
              </Button>
              <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!allRequiredAnswered}
              leftIcon={<Eye className="w-4 h-4" />}>

                Preview
              </Button>
              <Button
              variant="primary"
              onClick={handlePreview}
              disabled={!allRequiredAnswered}
              leftIcon={<Send className="w-4 h-4" />}>

                Submit Feedback
              </Button>
            </div>
          </div>
        </> :

      // No teacher selected - show prompt
      <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">Select a Teacher to Provide Feedback</p>
          <p className="text-sm text-gray-400 mb-6">
            Choose from the list of teachers assigned to your classes
          </p>
          <Button variant="primary" onClick={() => setShowTeacherModal(true)}>
            Select Teacher
          </Button>
        </div>
      }

      {/* Modals */}
      <TeacherSelectionModal
        isOpen={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        onSelect={handleTeacherSelect}
        teachers={TEACHERS}
        classes={CLASSES}
        completedTeachers={session.teachersCompleted} />


      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSubmit={handleSubmit}
        onEdit={() => setShowPreviewModal(false)}
        teacher={selectedTeacher}
        classOption={selectedClass}
        feedbackType={feedbackType}
        ratings={ratings}
        questions={currentQuestions}
        comment={comment}
        strengths={strengths}
        improvements={improvements}
        averageRating={averageRating}
        timeSpent={elapsedTime} />


      <DraftsModal
        isOpen={showDraftsModal}
        onClose={() => setShowDraftsModal(false)}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft} />


      <FeedbackHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        submissions={submissions} />


      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant} />


      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>);

}