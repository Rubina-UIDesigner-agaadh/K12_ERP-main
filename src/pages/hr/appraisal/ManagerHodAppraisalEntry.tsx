import React, { useState, Fragment, useCallback, useMemo, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Star,
  Send,
  Save,
  AlertTriangle,
  CheckCircle,
  User,
  ChevronDown,
  Info,
  X,
  XCircle,
  RefreshCw,
  Eye,
  Download,
  Printer,
  Clock,
  History,
  Copy,
  Trash2,
  Edit,
  FileText,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  AlertCircle,
  Zap,
  RotateCcw,
  Check,
  Sparkles,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Award } from
'lucide-react';

// Types
interface Competency {
  id: string;
  name: string;
  description: string;
  weightage: number;
  selfRating: number;
  selfJustification: string;
  managerRating: number;
  managerComment: string;
  varianceRemark: string;
  previousYearRating?: number;
}

interface Employee {
  value: string;
  label: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
  reportingTo: string;
  selfData: boolean;
  submittedDate?: string;
  previousReviews?: PreviousReview[];
}

interface PreviousReview {
  year: string;
  managerScore: number;
  selfScore: number;
  recommendation: string;
  comment: string;
}

interface Draft {
  id: string;
  employeeId: string;
  employeeName: string;
  competencies: Competency[];
  overallComment: string;
  recommendation: string;
  savedAt: Date;
  isAutoSave: boolean;
}

interface SubmittedReview {
  id: string;
  employeeId: string;
  employeeName: string;
  competencies: Competency[];
  overallComment: string;
  recommendation: string;
  selfScore: number;
  managerScore: number;
  submittedAt: Date;
  submittedBy: string;
}

type RecommendationType = '' | 'promote' | 'retain' | 'training' | 'pip';

// Sample employee data
const employees: Employee[] = [
{
  value: 'emp1',
  label: 'Dr. Robert Smith — Mathematics',
  name: 'Dr. Robert Smith',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  joiningDate: '2019-04-15',
  reportingTo: 'Dr. James Wilson',
  selfData: true,
  submittedDate: '2024-03-15',
  previousReviews: [
  {
    year: '2023',
    managerScore: 4.2,
    selfScore: 4.0,
    recommendation: 'retain',
    comment: 'Consistent performer with good subject knowledge.'
  },
  {
    year: '2022',
    managerScore: 3.8,
    selfScore: 3.5,
    recommendation: 'training',
    comment: 'Needs improvement in technology integration.'
  }]

},
{
  value: 'emp2',
  label: 'Mr. Michael Chen — Science',
  name: 'Mr. Michael Chen',
  department: 'Science',
  designation: 'Teacher',
  joiningDate: '2020-07-01',
  reportingTo: 'Dr. James Wilson',
  selfData: true,
  submittedDate: '2024-03-18',
  previousReviews: [
  {
    year: '2023',
    managerScore: 4.5,
    selfScore: 4.3,
    recommendation: 'promote',
    comment: 'Excellent performance. Ready for leadership role.'
  }]

},
{
  value: 'emp3',
  label: 'Ms. Emily Davis — English',
  name: 'Ms. Emily Davis',
  department: 'English',
  designation: 'Teacher',
  joiningDate: '2021-01-10',
  reportingTo: 'Dr. James Wilson',
  selfData: true,
  submittedDate: '2024-03-20',
  previousReviews: []
}];


// Get competencies for employee
const getCompetencies = (empId: string): Competency[] => [
{
  id: '1',
  name: 'Classroom Management',
  description: 'Ability to maintain discipline and create a positive learning environment',
  weightage: 15,
  selfRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 5 : 4,
  selfJustification:
  empId === 'emp1' ?
  'Maintained excellent classroom discipline and engagement throughout the year.' :
  empId === 'emp2' ?
  'Implemented innovative classroom management techniques. Zero disciplinary issues.' :
  'Good classroom control with interactive sessions.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 4 : undefined
},
{
  id: '2',
  name: 'Subject Knowledge',
  description: 'Depth of knowledge and ability to explain complex concepts',
  weightage: 20,
  selfRating: empId === 'emp1' ? 5 : empId === 'emp2' ? 4 : 4,
  selfJustification:
  empId === 'emp1' ?
  'Completed advanced certification. Published 2 papers in academic journals.' :
  empId === 'emp2' ?
  'Strong foundation in subject. Completed refresher course.' :
  'Regular updates on curriculum changes. Good subject grasp.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 5 : empId === 'emp2' ? 4 : undefined
},
{
  id: '3',
  name: 'Student Engagement',
  description: 'Ability to involve students actively in learning process',
  weightage: 15,
  selfRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 5 : 3,
  selfJustification:
  empId === 'emp1' ?
  'Introduced project-based learning. Student feedback improved by 20%.' :
  empId === 'emp2' ?
  'Created engaging experiments. Student participation increased significantly.' :
  'Working on improving engagement techniques.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 3 : empId === 'emp2' ? 5 : undefined
},
{
  id: '4',
  name: 'Assessment & Evaluation',
  description: 'Quality of assessments and timely evaluation of student work',
  weightage: 10,
  selfRating: empId === 'emp1' ? 3 : empId === 'emp2' ? 4 : 4,
  selfJustification:
  empId === 'emp1' ?
  'Followed standard assessment practices.' :
  empId === 'emp2' ?
  'Developed rubrics for fair evaluation. Timely feedback to students.' :
  'Consistent assessment practices with detailed feedback.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 3 : empId === 'emp2' ? 4 : undefined
},
{
  id: '5',
  name: 'Professional Development',
  description: 'Continuous learning and skill enhancement activities',
  weightage: 10,
  selfRating: empId === 'emp1' ? 5 : empId === 'emp2' ? 4 : 3,
  selfJustification:
  empId === 'emp1' ?
  'Attended 4 workshops and 2 conferences. Mentored 3 junior teachers.' :
  empId === 'emp2' ?
  'Completed 2 online certifications. Attended department workshops.' :
  'Attended mandatory training sessions.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 3 : undefined
},
{
  id: '6',
  name: 'Communication Skills',
  description: 'Effective communication with students, parents, and colleagues',
  weightage: 10,
  selfRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 4 : 5,
  selfJustification:
  empId === 'emp1' ?
  'Regular parent communication. Clear reporting.' :
  empId === 'emp2' ?
  'Good rapport with students and parents. Regular updates.' :
  'Excellent communication with all stakeholders. Led parent meetings.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 4 : undefined
},
{
  id: '7',
  name: 'Technology Integration',
  description: 'Use of digital tools and technology in teaching',
  weightage: 10,
  selfRating: empId === 'emp1' ? 3 : empId === 'emp2' ? 5 : 4,
  selfJustification:
  empId === 'emp1' ?
  'Used basic digital tools for teaching.' :
  empId === 'emp2' ?
  'Implemented VR-based learning modules. Created online resource library.' :
  'Regular use of LMS and digital presentations.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 2 : empId === 'emp2' ? 4 : undefined
},
{
  id: '8',
  name: 'Teamwork & Collaboration',
  description: 'Ability to work effectively with colleagues and contribute to team goals',
  weightage: 10,
  selfRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 4 : 4,
  selfJustification:
  empId === 'emp1' ?
  'Led department curriculum review committee.' :
  empId === 'emp2' ?
  'Active participation in department activities. Collaborated on inter-department projects.' :
  'Good team player. Participated in all department initiatives.',
  managerRating: 0,
  managerComment: '',
  varianceRemark: '',
  previousYearRating: empId === 'emp1' ? 4 : empId === 'emp2' ? 4 : undefined
}];


// Comment templates
const commentTemplates: Record<number, string[]> = {
  1: [
  'Needs significant improvement in this area.',
  'Below expectations. Requires focused attention.'],

  2: [
  'Partially meets expectations. Has room for growth.',
  'Shows effort but results are inconsistent.'],

  3: [
  'Meets expectations. Performs as required.',
  'Satisfactory performance in this competency.'],

  4: [
  'Exceeds expectations. Demonstrates strong capabilities.',
  'Very good performance. Consistent and reliable.'],

  5: [
  'Outstanding performance. Exemplary in this area.',
  'Exceptional. Sets the standard for others.']

};

// Recommendation labels
const recommendationLabels: Record<string, string> = {
  promote: 'Recommend for Promotion',
  retain: 'Retain in Current Role',
  training: 'Recommend for Training',
  pip: 'Performance Improvement Plan (PIP)'
};

// Current user simulation
const CURRENT_USER = 'Dr. James Wilson';

export function ManagerHodAppraisalEntry() {
  // Core state
  const [selectedEmp, setSelectedEmp] = useState('');
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [overallComment, setOverallComment] = useState('');
  const [recommendation, setRecommendation] = useState<RecommendationType>('');

  // UI state
  const [expandedCompetencies, setExpandedCompetencies] = useState<Set<string>>(new Set());
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);

  // Draft and save state
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<SubmittedReview[]>([]);

  // Modal states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [showConfirmSwitchModal, setShowConfirmSwitchModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPreviousReviewsModal, setShowPreviousReviewsModal] = useState(false);

  // Template modal state
  const [selectedCompetencyForTemplate, setSelectedCompetencyForTemplate] = useState<string | null>(
    null
  );

  // Pending switch state
  const [pendingSwitchEmp, setPendingSwitchEmp] = useState<string | null>(null);

  // Message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get selected employee data
  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.value === selectedEmp);
  }, [selectedEmp]);

  // Calculate scores
  const selfWeighted = useMemo(() => {
    return competencies.reduce((s, c) => s + c.selfRating * c.weightage / 100, 0);
  }, [competencies]);

  const managerWeighted = useMemo(() => {
    return competencies.reduce((s, c) => s + c.managerRating * c.weightage / 100, 0);
  }, [competencies]);

  const ratedCount = useMemo(() => {
    return competencies.filter((c) => c.managerRating > 0).length;
  }, [competencies]);

  // Validation state
  const validationState = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check all competencies rated
    const unratedCompetencies = competencies.filter((c) => c.managerRating === 0);
    if (unratedCompetencies.length > 0) {
      errors.push(`${unratedCompetencies.length} competencies not rated`);
    }

    // Check variance remarks
    const varianceWithoutRemark = competencies.filter((c) => {
      const variance = c.managerRating > 0 ? Math.abs(c.selfRating - c.managerRating) : 0;
      return variance >= 2 && !c.varianceRemark.trim();
    });
    if (varianceWithoutRemark.length > 0) {
      errors.push(`${varianceWithoutRemark.length} variance remarks missing`);
    }

    // Check overall comment
    if (!overallComment.trim()) {
      errors.push('Overall comment is required');
    } else if (overallComment.trim().length < 50) {
      warnings.push('Overall comment should be at least 50 characters');
    }

    // Check recommendation
    if (!recommendation) {
      errors.push('Recommendation is required');
    }

    // Check for very low manager ratings
    const veryLowRatings = competencies.filter((c) => c.managerRating === 1);
    if (veryLowRatings.length > 0) {
      warnings.push(`${veryLowRatings.length} competencies rated 1 star`);
    }

    // Check significant variance without detailed comment
    const highVarianceNoComment = competencies.filter((c) => {
      const variance = c.managerRating > 0 ? Math.abs(c.selfRating - c.managerRating) : 0;
      return variance >= 2 && c.managerComment.length < 20;
    });
    if (highVarianceNoComment.length > 0) {
      warnings.push('Add detailed comments for high variance competencies');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completionPercentage: Math.round(
        (ratedCount / competencies.length * 60 + (
        overallComment.trim() ? 20 : 0) + (
        recommendation ? 20 : 0)) *
        100
      ) / 100
    };
  }, [competencies, overallComment, recommendation, ratedCount]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !selectedEmp || !hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSaveDraft(true);
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timer);
  }, [competencies, overallComment, recommendation, autoSaveEnabled, selectedEmp, hasUnsavedChanges]);

  // Track unsaved changes
  useEffect(() => {
    if (selectedEmp && competencies.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [competencies, overallComment, recommendation]);

  // Handle employee change with unsaved changes check
  const handleEmpChange = useCallback(
    (empId: string) => {
      if (hasUnsavedChanges && selectedEmp) {
        setPendingSwitchEmp(empId);
        setShowConfirmSwitchModal(true);
        return;
      }

      performEmpSwitch(empId);
    },
    [hasUnsavedChanges, selectedEmp]
  );

  // Perform actual employee switch
  const performEmpSwitch = useCallback((empId: string) => {
    setSelectedEmp(empId);
    if (empId) {
      setCompetencies(getCompetencies(empId));
      setOverallComment('');
      setRecommendation('');
      setExpandedCompetencies(new Set());
      setHasUnsavedChanges(false);
      setLastSaved(null);
    } else {
      setCompetencies([]);
    }
  }, []);

  // Confirm switch
  const confirmSwitch = useCallback(() => {
    if (pendingSwitchEmp !== null) {
      performEmpSwitch(pendingSwitchEmp);
      setPendingSwitchEmp(null);
    }
    setShowConfirmSwitchModal(false);
  }, [pendingSwitchEmp, performEmpSwitch]);

  // Save and switch
  const saveAndSwitch = useCallback(async () => {
    await handleSaveDraft(false);
    if (pendingSwitchEmp !== null) {
      performEmpSwitch(pendingSwitchEmp);
      setPendingSwitchEmp(null);
    }
    setShowConfirmSwitchModal(false);
  }, [pendingSwitchEmp, performEmpSwitch]);

  // Set manager rating
  const setManagerRating = useCallback((id: string, rating: number) => {
    setCompetencies((prev) =>
    prev.map((c) =>
    c.id === id ?
    {
      ...c,
      managerRating: rating
    } :
    c
    )
    );
  }, []);

  // Set manager comment
  const setManagerComment = useCallback((id: string, val: string) => {
    setCompetencies((prev) =>
    prev.map((c) =>
    c.id === id ?
    {
      ...c,
      managerComment: val
    } :
    c
    )
    );
  }, []);

  // Set variance remark
  const setVarianceRemark = useCallback((id: string, val: string) => {
    setCompetencies((prev) =>
    prev.map((c) =>
    c.id === id ?
    {
      ...c,
      varianceRemark: val
    } :
    c
    )
    );
  }, []);

  // Toggle competency expansion
  const toggleCompetencyExpansion = useCallback((id: string) => {
    setExpandedCompetencies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Expand all competencies
  const expandAllCompetencies = useCallback(() => {
    setExpandedCompetencies(new Set(competencies.map((c) => c.id)));
  }, [competencies]);

  // Collapse all competencies
  const collapseAllCompetencies = useCallback(() => {
    setExpandedCompetencies(new Set());
  }, []);

  // Apply template comment
  const applyTemplateComment = useCallback((template: string) => {
    if (selectedCompetencyForTemplate) {
      setManagerComment(selectedCompetencyForTemplate, template);
      setShowTemplatesModal(false);
      setSelectedCompetencyForTemplate(null);
      setSuccessMessage('Template applied');
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  }, [selectedCompetencyForTemplate, setManagerComment]);

  // Open template modal
  const openTemplateModal = useCallback((competencyId: string, rating: number) => {
    if (rating === 0) {
      setErrorMessage('Please rate the competency first');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setSelectedCompetencyForTemplate(competencyId);
    setShowTemplatesModal(true);
  }, []);

  // Match self rating
  const matchSelfRating = useCallback((competencyId: string) => {
    const competency = competencies.find((c) => c.id === competencyId);
    if (competency) {
      setManagerRating(competencyId, competency.selfRating);
      setSuccessMessage('Matched self rating');
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  }, [competencies, setManagerRating]);

  // Copy previous year rating
  const copyPreviousYearRating = useCallback((competencyId: string) => {
    const competency = competencies.find((c) => c.id === competencyId);
    if (competency?.previousYearRating) {
      setManagerRating(competencyId, competency.previousYearRating);
      setSuccessMessage('Copied previous year rating');
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  }, [competencies, setManagerRating]);

  // Reset all ratings
  const resetAllRatings = useCallback(() => {
    setCompetencies((prev) =>
    prev.map((c) => ({
      ...c,
      managerRating: 0,
      managerComment: '',
      varianceRemark: ''
    }))
    );
    setOverallComment('');
    setRecommendation('');
    setShowResetModal(false);
    setHasUnsavedChanges(false);
    setSuccessMessage('All ratings reset');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Quick rate all (match all self ratings)
  const quickRateAll = useCallback(() => {
    setCompetencies((prev) =>
    prev.map((c) => ({
      ...c,
      managerRating: c.selfRating
    }))
    );
    setSuccessMessage('All ratings matched to self-assessment');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Save draft
  const handleSaveDraft = useCallback(
    async (isAutoSave: boolean = false) => {
      if (!selectedEmp || !selectedEmployee) return;

      setIsSaving(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const draft: Draft = {
        id: `draft-${selectedEmp}-${Date.now()}`,
        employeeId: selectedEmp,
        employeeName: selectedEmployee.name,
        competencies: [...competencies],
        overallComment,
        recommendation,
        savedAt: new Date(),
        isAutoSave
      };

      // Remove previous drafts for same employee
      setDrafts((prev) => [...prev.filter((d) => d.employeeId !== selectedEmp), draft]);

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setIsSaving(false);

      if (!isAutoSave) {
        setSuccessMessage('Draft saved successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }

      console.log('Draft saved:', draft);
    },
    [selectedEmp, selectedEmployee, competencies, overallComment, recommendation]
  );

  // Load draft
  const loadDraft = useCallback((draft: Draft) => {
    setCompetencies(draft.competencies);
    setOverallComment(draft.overallComment);
    setRecommendation(draft.recommendation as RecommendationType);
    setShowDraftsModal(false);
    setSuccessMessage('Draft loaded successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Delete draft
  const deleteDraft = useCallback((draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    setSuccessMessage('Draft deleted');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Get drafts for current employee
  const currentEmployeeDrafts = useMemo(() => {
    return drafts.filter((d) => d.employeeId === selectedEmp);
  }, [drafts, selectedEmp]);

  // Submit review
  const handleSubmitReview = useCallback(async () => {
    if (!validationState.isValid) {
      setErrorMessage(`Cannot submit: ${validationState.errors.join(', ')}`);
      setTimeout(() => setErrorMessage(null), 5000);
      setShowConfirmSubmitModal(false);
      return;
    }

    if (!selectedEmp || !selectedEmployee) return;

    setIsSubmitting(true);
    setShowConfirmSubmitModal(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const review: SubmittedReview = {
      id: `review-${selectedEmp}-${Date.now()}`,
      employeeId: selectedEmp,
      employeeName: selectedEmployee.name,
      competencies: [...competencies],
      overallComment,
      recommendation,
      selfScore: selfWeighted,
      managerScore: managerWeighted,
      submittedAt: new Date(),
      submittedBy: CURRENT_USER
    };

    setSubmittedReviews((prev) => [...prev, review]);

    // Remove drafts for this employee
    setDrafts((prev) => prev.filter((d) => d.employeeId !== selectedEmp));

    setIsSubmitting(false);
    setSuccessMessage(`Review submitted successfully for ${selectedEmployee.name}`);

    // Reset form after short delay
    setTimeout(() => {
      setSelectedEmp('');
      setCompetencies([]);
      setOverallComment('');
      setRecommendation('');
      setHasUnsavedChanges(false);
      setSuccessMessage(null);
    }, 3000);

    console.log('Review submitted:', review);
  }, [
  validationState,
  selectedEmp,
  selectedEmployee,
  competencies,
  overallComment,
  recommendation,
  selfWeighted,
  managerWeighted]
  );

  // Print review
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Export review
  const handleExport = useCallback(() => {
    if (!selectedEmployee) return;

    const exportData = {
      employee: {
        id: selectedEmp,
        name: selectedEmployee.name,
        department: selectedEmployee.department,
        designation: selectedEmployee.designation
      },
      appraisal: {
        competencies: competencies.map((c) => ({
          name: c.name,
          weightage: c.weightage,
          selfRating: c.selfRating,
          selfJustification: c.selfJustification,
          managerRating: c.managerRating,
          managerComment: c.managerComment,
          variance: Math.abs(c.selfRating - c.managerRating),
          varianceRemark: c.varianceRemark
        })),
        selfScore: selfWeighted.toFixed(2),
        managerScore: managerWeighted.toFixed(2),
        overallComment,
        recommendation: recommendationLabels[recommendation] || recommendation
      },
      exportedAt: new Date().toISOString(),
      exportedBy: CURRENT_USER
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appraisal_review_${selectedEmployee.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);

    setSuccessMessage('Review exported successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [
  selectedEmp,
  selectedEmployee,
  competencies,
  overallComment,
  recommendation,
  selfWeighted,
  managerWeighted]
  );

  // Get variance for competency
  const getVariance = useCallback((competency: Competency) => {
    if (competency.managerRating === 0) return 0;
    return Math.abs(competency.selfRating - competency.managerRating);
  }, []);

  // Star display component
  const StarDisplay = ({
    value,
    filled,
    size = 'sm'




  }: {value: number;filled?: boolean;size?: 'sm' | 'md';}) =>
  <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
    <Star
      key={i}
      className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
      i <= value ?
      filled ?
      'fill-amber-400 text-amber-400' :
      'fill-gray-400 text-gray-400' :
      'text-gray-200'}`
      } />

    )}
    </div>;


  // Star input component
  const StarInput = ({
    value,
    onChange,
    disabled = false




  }: {value: number;onChange: (v: number) => void;disabled?: boolean;}) =>
  <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
    <button
      key={i}
      onClick={() => !disabled && onChange(i)}
      className={`focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      disabled={disabled}>

          <Star
        className={`w-5 h-5 ${
        i <= value ? 'fill-blue-500 text-blue-500' : 'text-gray-300'} ${
        !disabled && 'hover:text-blue-400'}`} />

        </button>
    )}
    </div>;


  // Trend indicator
  const TrendIndicator = ({ current, previous }: {current: number;previous?: number;}) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) {
      return (
        <span className="flex items-center text-green-600 text-xs">
          <TrendingUp className="w-3 h-3 mr-0.5" />+{diff}
        </span>);

    } else if (diff < 0) {
      return (
        <span className="flex items-center text-red-600 text-xs">
          <TrendingDown className="w-3 h-3 mr-0.5" />
          {diff}
        </span>);

    }
    return (
      <span className="flex items-center text-gray-500 text-xs">
        <Minus className="w-3 h-3" />
      </span>);

  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager / HOD Appraisal Entry</h1>
          <p className="text-sm text-gray-500">
            Review and rate employee performance against self-assessment
          </p>
        </div>
        <div className="flex gap-2 no-print">
          {selectedEmp &&
          <>
              <Button variant="outline" onClick={() => setShowDraftsModal(true)}>
                <History className="w-4 h-4 mr-2" />
                Drafts ({currentEmployeeDrafts.length})
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </>
          }
          <Button variant="outline" onClick={() => handleSaveDraft(false)} disabled={isSaving || !selectedEmp}>
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {successMessage &&
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)}>
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      }

      {errorMessage &&
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      }

      {/* Employee Selection */}
      <Card title="Select Employee">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <Select
              label="Employee"
              options={[
              { value: '', label: 'Select employee to review...' },
              ...employees]
              }
              value={selectedEmp}
              onChange={(val) => handleEmpChange(val as string)} />

          </div>
          {selectedEmp &&
          <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreviousReviewsModal(true)}
              disabled={!selectedEmployee?.previousReviews?.length}>

                <BookOpen className="w-4 h-4 mr-1" />
                Previous Reviews
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowResetModal(true)}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          }
        </div>

        {/* Employee Details */}
        {selectedEmployee &&
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-gray-500">Designation</p>
                <p className="font-medium">{selectedEmployee.designation}</p>
              </div>
              <div>
                <p className="text-gray-500">Joining Date</p>
                <p className="font-medium">
                  {new Date(selectedEmployee.joiningDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Self-Assessment Submitted</p>
                <p className="font-medium text-green-600">
                  {selectedEmployee.submittedDate ?
                new Date(selectedEmployee.submittedDate).toLocaleDateString('en-IN') :
                'N/A'}
                </p>
              </div>
            </div>
          </div>
        }

        {/* Auto-save status */}
        {selectedEmp &&
        <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded border-gray-300" />

                <span className="text-gray-600">Auto-save</span>
              </label>
              {lastSaved &&
            <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
            }
              {hasUnsavedChanges &&
            <span className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Unsaved changes
                </span>
            }
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Progress:</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${validationState.completionPercentage}%` }} />

              </div>
              <span className="text-gray-600">{validationState.completionPercentage}%</span>
            </div>
          </div>
        }
      </Card>

      {selectedEmp &&
      <>
          {/* Instructions */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg no-print">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Left column shows employee's self-rating (read-only). Right column is your
              assessment. Significant variances (≥2 points) require a remark.
            </p>
          </div>

          {/* Competency Assessment */}
          <Card title="Competency Assessment">
            <div className="flex justify-between items-center mb-4 no-print">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={expandAllCompetencies}>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAllCompetencies}>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Collapse All
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllDescriptions(!showAllDescriptions)}>

                  <FileText className="w-4 h-4 mr-1" />
                  {showAllDescriptions ? 'Hide' : 'Show'} Descriptions
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={quickRateAll}>
                  <Zap className="w-4 h-4 mr-1" />
                  Match All Self Ratings
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th
                    className="text-left py-3 px-3 text-sm font-semibold text-gray-700"
                    rowSpan={2}>

                      Competency
                    </th>
                    <th
                    className="text-center py-2 px-3 text-sm font-semibold text-gray-500 bg-gray-50"
                    colSpan={2}>

                      Employee Self-Rating
                    </th>
                    <th
                    className="text-center py-2 px-3 text-sm font-semibold text-blue-700 bg-blue-50"
                    colSpan={2}>

                      Manager Rating
                    </th>
                    <th
                    className="text-center py-3 px-3 text-sm font-semibold text-gray-700 w-10"
                    rowSpan={2}>

                      Var
                    </th>
                    <th className="py-3 px-3 text-sm font-semibold text-gray-700 w-24 no-print" rowSpan={2}>
                      Actions
                    </th>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-2 px-3 text-xs text-gray-500 bg-gray-50">
                      Rating
                    </th>
                    <th className="text-left py-2 px-3 text-xs text-gray-500 bg-gray-50">
                      Justification
                    </th>
                    <th className="text-center py-2 px-3 text-xs text-blue-600 bg-blue-50">
                      Rating
                    </th>
                    <th className="text-left py-2 px-3 text-xs text-blue-600 bg-blue-50">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competencies.map((c) => {
                  const variance = getVariance(c);
                  const hasVariance = variance >= 2;
                  const isExpanded = expandedCompetencies.has(c.id);

                  return (
                    <Fragment key={c.id}>
                        <tr className={`border-b border-gray-100 ${hasVariance ? 'bg-amber-50' : ''}`}>
                          <td className="py-3 px-3">
                            <div
                            className="flex items-start gap-2 cursor-pointer"
                            onClick={() => toggleCompetencyExpansion(c.id)}>

                              <button className="mt-1 no-print">
                                {isExpanded ?
                              <ChevronUp className="w-4 h-4 text-gray-400" /> :

                              <ChevronDown className="w-4 h-4 text-gray-400" />
                              }
                              </button>
                              <div>
                                <span className="text-sm font-medium text-gray-900">{c.name}</span>
                                <span className="text-xs text-gray-500 ml-1">({c.weightage}%)</span>
                                {c.previousYearRating &&
                              <span className="ml-2">
                                    <TrendIndicator
                                  current={c.managerRating || c.selfRating}
                                  previous={c.previousYearRating} />

                                  </span>
                              }
                                {(showAllDescriptions || isExpanded) &&
                              <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                              }
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 bg-gray-50/50 text-center">
                            <StarDisplay value={c.selfRating} />
                          </td>
                          <td className="py-3 px-3 bg-gray-50/50">
                            <p className="text-xs text-gray-500 max-w-[200px]">{c.selfJustification}</p>
                          </td>
                          <td className="py-3 px-3 bg-blue-50/30 text-center">
                            <StarInput
                            value={c.managerRating}
                            onChange={(v) => setManagerRating(c.id, v)} />

                          </td>
                          <td className="py-3 px-3 bg-blue-50/30">
                            <div className="relative">
                              <textarea
                              value={c.managerComment}
                              onChange={(e) => setManagerComment(c.id, e.target.value)}
                              placeholder="Your assessment..."
                              rows={1}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />

                              <span className="absolute -bottom-4 right-0 text-xs text-gray-400">
                                {c.managerComment.length}/200
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {c.managerRating > 0 &&
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            hasVariance ?
                            'bg-amber-200 text-amber-800' :
                            'bg-green-100 text-green-700'}`
                            }>

                                {variance}
                              </span>
                          }
                          </td>
                          <td className="py-3 px-3 no-print">
                            <div className="flex items-center gap-1">
                              <button
                              onClick={() => openTemplateModal(c.id, c.managerRating)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Use template">

                                <Sparkles className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                              onClick={() => matchSelfRating(c.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Match self rating">

                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              {c.previousYearRating &&
                            <button
                              onClick={() => copyPreviousYearRating(c.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Copy previous year">

                                  <History className="w-4 h-4 text-gray-400" />
                                </button>
                            }
                            </div>
                          </td>
                        </tr>

                        {/* Variance remark row */}
                        {hasVariance &&
                      <tr className="bg-amber-50 border-b border-amber-200">
                            <td colSpan={7} className="py-2 px-3">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-amber-800 mb-1">
                                    Variance of {variance} points detected — Remark required
                                  </p>
                                  <textarea
                                value={c.varianceRemark}
                                onChange={(e) => setVarianceRemark(c.id, e.target.value)}
                                placeholder="Explain the reason for significant variance..."
                                rows={2}
                                className="w-full px-2 py-1 border border-amber-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none bg-white" />

                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs text-amber-600">
                                      {c.varianceRemark.length > 0 ?
                                  <span className="flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3" />
                                          Remark provided
                                        </span> :

                                  <span className="flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          Required
                                        </span>
                                  }
                                    </span>
                                    <span className="text-xs text-amber-600">
                                      {c.varianceRemark.length}/300
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                      }
                      </Fragment>);

                })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Validation Messages */}
          {(validationState.errors.length > 0 || validationState.warnings.length > 0) &&
        <div className="space-y-2 no-print">
              {validationState.errors.map((error, idx) =>
          <div
            key={`error-${idx}`}
            className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">

                  <XCircle className="w-4 h-4 text-red-600" />
                  {error}
                </div>
          )}
              {validationState.warnings.map((warning, idx) =>
          <div
            key={`warning-${idx}`}
            className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">

                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {warning}
                </div>
          )}
            </div>
        }

          {/* Final Assessment */}
          <Card title="Final Assessment">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Employee Self Score</p>
                <p className="text-3xl font-bold text-gray-700">{selfWeighted.toFixed(2)}</p>
                <p className="text-xs text-gray-400">out of 5.00</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-600 mb-1">Manager Score</p>
                <p className="text-3xl font-bold text-blue-700">{managerWeighted.toFixed(2)}</p>
                <p className="text-xs text-blue-400">
                  {ratedCount}/{competencies.length} rated
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Manager Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                placeholder="Provide overall assessment and feedback (minimum 50 characters)..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

                <div className="flex justify-between mt-1">
                  <span
                  className={`text-xs ${
                  overallComment.length < 50 ? 'text-amber-600' : 'text-green-600'}`
                  }>

                    {overallComment.length < 50 ?
                  `${50 - overallComment.length} more characters required` :
                  'Minimum length met'}
                  </span>
                  <span className="text-xs text-gray-400">{overallComment.length}/1000</span>
                </div>
              </div>

              <Select
              label={
              <>
                    Recommendation <span className="text-red-500">*</span>
                  </>
              }
              options={[
              { value: '', label: 'Select recommendation...' },
              { value: 'promote', label: 'Recommend for Promotion' },
              { value: 'retain', label: 'Retain in Current Role' },
              { value: 'training', label: 'Recommend for Training' },
              { value: 'pip', label: 'Performance Improvement Plan (PIP)' }]
              }
              value={recommendation}
              onChange={(val) => setRecommendation(val as RecommendationType)} />


              {recommendation === 'pip' &&
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">PIP Recommendation</p>
                    <p className="text-xs text-red-700">
                      This will initiate a Performance Improvement Plan. Please ensure detailed
                      comments are provided for all low-rated competencies.
                    </p>
                  </div>
                </div>
            }

              {recommendation === 'promote' &&
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <Award className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Promotion Recommendation</p>
                    <p className="text-xs text-green-700">
                      This will forward the appraisal to HR for promotion review process.
                    </p>
                  </div>
                </div>
            }
            </div>

            <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-200 no-print">
              <div>
                <Button variant="outline" onClick={() => setShowPreviewModal(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleSaveDraft(false)} disabled={isSaving}>
                  {isSaving ?
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                <Save className="w-4 h-4 mr-2" />
                }
                  Save Draft
                </Button>
                <Button
                variant="primary"
                onClick={() => setShowConfirmSubmitModal(true)}
                disabled={!validationState.isValid || isSubmitting}>

                  {isSubmitting ?
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                <Send className="w-4 h-4 mr-2" />
                }
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </Card>
        </>
      }

      {/* Empty State */}
      {!selectedEmp &&
      <div className="text-center py-16 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-500">Select an Employee</p>
          <p className="text-sm">Choose an employee from the dropdown above to begin the review</p>
          {submittedReviews.length > 0 &&
        <div className="mt-6">
              <Badge variant="success">{submittedReviews.length} review(s) submitted today</Badge>
            </div>
        }
        </div>
      }

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Review Preview"
        size="lg">

        {selectedEmployee &&
        <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedEmployee.name}</h4>
              <p className="text-sm text-gray-600">
                {selectedEmployee.designation} • {selectedEmployee.department}
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Self Score</p>
                <p className="text-2xl font-bold text-gray-700">{selfWeighted.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Manager Score</p>
                <p className="text-2xl font-bold text-blue-700">{managerWeighted.toFixed(2)}</p>
              </div>
            </div>

            {/* Competencies Summary */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Competency Ratings</h4>
              <div className="space-y-2">
                {competencies.map((c) =>
              <div
                key={c.id}
                className="flex items-center justify-between py-2 border-b border-gray-100">

                    <span className="text-sm text-gray-700">{c.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">Self: {c.selfRating}</span>
                      <span className="text-sm font-medium text-blue-600">
                        Manager: {c.managerRating || '-'}
                      </span>
                    </div>
                  </div>
              )}
              </div>
            </div>

            {/* Overall Comment */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Overall Comment</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                {overallComment || 'No comment provided'}
              </p>
            </div>

            {/* Recommendation */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
              <Badge
              variant={
              recommendation === 'promote' ?
              'success' :
              recommendation === 'pip' ?
              'danger' :
              'secondary'
              }>

                {recommendationLabels[recommendation] || 'Not selected'}
              </Badge>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Confirm Submit Modal */}
      <Modal
        isOpen={showConfirmSubmitModal}
        onClose={() => setShowConfirmSubmitModal(false)}
        title="Confirm Submission"
        size="sm">

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Ready to Submit</p>
                <p className="text-sm text-blue-700 mt-1">
                  You are about to submit the appraisal review for{' '}
                  <strong>{selectedEmployee?.name}</strong>. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Manager Score:</span>
              <span className="font-semibold">{managerWeighted.toFixed(2)} / 5.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recommendation:</span>
              <span className="font-semibold">{recommendationLabels[recommendation]}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowConfirmSubmitModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitReview}>
              <Send className="w-4 h-4 mr-2" />
              Confirm Submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Switch Modal */}
      <Modal
        isOpen={showConfirmSwitchModal}
        onClose={() => {
          setShowConfirmSwitchModal(false);
          setPendingSwitchEmp(null);
        }}
        title="Unsaved Changes"
        size="sm">

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Unsaved Changes</p>
                <p className="text-sm text-amber-700 mt-1">
                  You have unsaved changes for the current employee. What would you like to do?
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmSwitchModal(false);
                setPendingSwitchEmp(null);
              }}>

              Cancel
            </Button>
            <Button variant="outline" onClick={confirmSwitch}>
              Discard Changes
            </Button>
            <Button variant="primary" onClick={saveAndSwitch}>
              <Save className="w-4 h-4 mr-2" />
              Save & Switch
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Ratings"
        size="sm">

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Confirm Reset</p>
                <p className="text-sm text-red-700 mt-1">
                  This will clear all your ratings, comments, and the overall assessment. This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={resetAllRatings}>
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </Modal>

      {/* Drafts Modal */}
      <Modal
        isOpen={showDraftsModal}
        onClose={() => setShowDraftsModal(false)}
        title="Saved Drafts"
        size="md">

        <div className="space-y-4">
          {currentEmployeeDrafts.length === 0 ?
          <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No drafts saved for this employee</p>
            </div> :

          <div className="space-y-3">
              {currentEmployeeDrafts.map((draft) =>
            <div
              key={draft.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                  <div>
                    <p className="font-medium text-gray-900">
                      {draft.isAutoSave ? 'Auto-save' : 'Manual save'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {draft.savedAt.toLocaleString()} •{' '}
                      {draft.competencies.filter((c) => c.managerRating > 0).length}/
                      {draft.competencies.length} rated
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => loadDraft(draft)}>
                      Load
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteDraft(draft.id)}>

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            )}
            </div>
          }

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowDraftsModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Templates Modal */}
      <Modal
        isOpen={showTemplatesModal}
        onClose={() => {
          setShowTemplatesModal(false);
          setSelectedCompetencyForTemplate(null);
        }}
        title="Comment Templates"
        size="sm">

        <div className="space-y-4">
          {selectedCompetencyForTemplate &&
          <>
              {(() => {
              const competency = competencies.find(
                (c) => c.id === selectedCompetencyForTemplate
              );
              const rating = competency?.managerRating || 0;
              const templates = commentTemplates[rating] || [];

              return templates.length > 0 ?
              <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      Select a template for rating {rating}:
                    </p>
                    {templates.map((template, idx) =>
                <button
                  key={idx}
                  onClick={() => applyTemplateComment(template)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors">

                        {template}
                      </button>
                )}
                  </div> :

              <p className="text-sm text-gray-500">No templates available for this rating.</p>;

            })()}
            </>
          }

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowTemplatesModal(false);
                setSelectedCompetencyForTemplate(null);
              }}>

              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Previous Reviews Modal */}
      <Modal
        isOpen={showPreviousReviewsModal}
        onClose={() => setShowPreviousReviewsModal(false)}
        title="Previous Year Reviews"
        size="md">

        <div className="space-y-4">
          {selectedEmployee?.previousReviews && selectedEmployee.previousReviews.length > 0 ?
          <div className="space-y-4">
              {selectedEmployee.previousReviews.map((review, idx) =>
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{review.year}</h4>
                    <Badge
                  variant={
                  review.recommendation === 'promote' ?
                  'success' :
                  review.recommendation === 'pip' ?
                  'danger' :
                  'secondary'
                  }>

                      {recommendationLabels[review.recommendation]}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Self Score</p>
                      <p className="text-lg font-bold text-gray-700">{review.selfScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Manager Score</p>
                      <p className="text-lg font-bold text-blue-700">{review.managerScore}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Comment</p>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
            )}
            </div> :

          <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No previous reviews available</p>
            </div>
          }

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowPreviousReviewsModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Print styles */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        `}
      </style>
    </div>);

}