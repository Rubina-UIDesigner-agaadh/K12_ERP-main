import React, { useState, useEffect, useCallback } from 'react';
import {
  Building,
  X,
  Star,
  MessageSquare,
  CheckCircle,
  Award,
  Users,
  ChevronDown,
  Save,
  Send,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Trash2,
  Eye,
  Printer,
  RefreshCw,
  Clock,
  History,
  XCircle,
  Check,
  Loader2,
  Download,
  EyeOff } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

// Types
interface Candidate {
  id: string;
  name: string;
  position: string;
  campus: string;
  experience: string;
  initials: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  email: string;
  phone: string;
  qualifications: string;
  appliedDate: string;
}

interface PanelMember {
  id: string;
  name: string;
  initials: string;
  hasSubmitted: boolean;
  designation: string;
}

interface InterviewRound {
  value: string;
  label: string;
}

interface FeedbackRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  round: string;
  roundLabel: string;
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  remarks: string;
  recommendation: Recommendation | null;
  panelMembers: PanelMember[];
  submittedAt: string | null;
  savedAt: string | null;
  submittedToHR: boolean;
  academicYear: string;
  branches: string[];
}

type Scores = Record<string, number>;
type Recommendation = 'Yes' | 'No' | 'Maybe';

// Constants
const BRANCHES = [
{ id: 'all', name: 'All Branches' },
{ id: 'main', name: 'Main Campus' },
{ id: 'north', name: 'North Wing' },
{ id: 'south', name: 'South Wing' },
{ id: 'east', name: 'East Campus' }];


const ACADEMIC_YEARS = [
{ value: '2024-2025', label: '2024-2025' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' }];


const CANDIDATES: Candidate[] = [
{
  id: 'APP-2024-001',
  name: 'Priya Sharma',
  position: 'Math Teacher',
  campus: 'Main Campus',
  experience: '5 years',
  initials: 'PS',
  interviewDate: 'Dec 18, 2024',
  interviewTime: '10:00 AM',
  interviewType: 'Demo Class',
  email: 'priya.sharma@email.com',
  phone: '+91 98765 43210',
  qualifications: 'M.Sc Mathematics, B.Ed',
  appliedDate: 'Dec 01, 2024'
},
{
  id: 'APP-2024-002',
  name: 'Rahul Verma',
  position: 'Science HOD',
  campus: 'North Wing',
  experience: '8 years',
  initials: 'RV',
  interviewDate: 'Dec 19, 2024',
  interviewTime: '2:00 PM',
  interviewType: 'Panel Interview',
  email: 'rahul.verma@email.com',
  phone: '+91 98765 43211',
  qualifications: 'M.Sc Physics, Ph.D (Pursuing)',
  appliedDate: 'Nov 28, 2024'
},
{
  id: 'APP-2024-003',
  name: 'Sneha Patel',
  position: 'English Teacher',
  campus: 'South Wing',
  experience: '3 years',
  initials: 'SP',
  interviewDate: 'Dec 20, 2024',
  interviewTime: '11:00 AM',
  interviewType: 'Demo Class',
  email: 'sneha.patel@email.com',
  phone: '+91 98765 43212',
  qualifications: 'M.A English, B.Ed',
  appliedDate: 'Dec 05, 2024'
},
{
  id: 'APP-2024-004',
  name: 'Amit Kumar',
  position: 'Physical Education Teacher',
  campus: 'East Campus',
  experience: '6 years',
  initials: 'AK',
  interviewDate: 'Dec 21, 2024',
  interviewTime: '9:00 AM',
  interviewType: 'Practical Demo',
  email: 'amit.kumar@email.com',
  phone: '+91 98765 43213',
  qualifications: 'B.P.Ed, M.P.Ed',
  appliedDate: 'Dec 03, 2024'
}];


const INTERVIEW_ROUNDS: InterviewRound[] = [
{ value: 'round1', label: 'Round 1 - Demo Class' },
{ value: 'round2', label: 'Round 2 - Panel' },
{ value: 'round3', label: 'Round 3 - HR' },
{ value: 'round4', label: 'Round 4 - Final' }];


const INITIAL_PANEL_MEMBERS: PanelMember[] = [
{ id: '1', name: 'Dr. Amit Shah', initials: 'DAS', hasSubmitted: false, designation: 'Principal' },
{ id: '2', name: 'Mrs. Kavita', initials: 'MK', hasSubmitted: false, designation: 'Vice Principal' },
{ id: '3', name: 'Mr. Rajan', initials: 'MR', hasSubmitted: false, designation: 'HOD' }];


const AVAILABLE_PANEL_MEMBERS: PanelMember[] = [
{ id: '4', name: 'Dr. Priya Gupta', initials: 'DPG', hasSubmitted: false, designation: 'Senior Teacher' },
{ id: '5', name: 'Mr. Suresh Kumar', initials: 'MSK', hasSubmitted: false, designation: 'Coordinator' },
{ id: '6', name: 'Mrs. Anita Desai', initials: 'MAD', hasSubmitted: false, designation: 'HR Manager' },
{ id: '7', name: 'Dr. Rajesh Singh', initials: 'DRS', hasSubmitted: false, designation: 'Academic Director' }];


const evaluationCriteria = [
{
  key: 'subjectExpertise',
  label: 'Subject Expertise',
  description: 'Depth of knowledge in the subject area'
},
{
  key: 'classroomManagement',
  label: 'Classroom Management',
  description: 'Ability to manage and engage students'
},
{
  key: 'teachingDemo',
  label: 'Teaching Demo Performance',
  description: 'Quality of demo class delivery'
},
{
  key: 'communication',
  label: 'Communication Skills',
  description: 'Clarity and effectiveness of communication'
},
{
  key: 'confidence',
  label: 'Confidence',
  description: 'Poise and self-assurance during interview'
},
{
  key: 'behaviour',
  label: 'Behaviour & Attitude',
  description: 'Professional conduct and positive attitude'
}];


// Utility function to generate unique ID
const generateId = (): string => {
  return `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function InterviewFeedbackScoring() {
  // Core State
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [scores, setScores] = useState<Scores>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [remarks, setRemarks] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('APP-2024-001');
  const [selectedRound, setSelectedRound] = useState('round1');
  const [panelMembers, setPanelMembers] = useState<PanelMember[]>(INITIAL_PANEL_MEMBERS);

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showAddPanelMember, setShowAddPanelMember] = useState(false);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackRecord[]>([]);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<FeedbackRecord | null>(null);
  const [confirmUnsavedChanges, setConfirmUnsavedChanges] = useState<{
    show: boolean;
    action: 'candidate' | 'round' | null;
    value: string;
  }>({ show: false, action: null, value: '' });

  // Computed Values
  const currentCandidate = CANDIDATES.find((c) => c.id === selectedCandidate);
  const currentRound = INTERVIEW_ROUNDS.find((r) => r.value === selectedRound);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = evaluationCriteria.length * 5;
  const percentage = maxScore > 0 ? Math.round(totalScore / maxScore * 100) : 0;
  const completedCriteria = Object.keys(scores).length;
  const allCriteriaScored = completedCriteria === evaluationCriteria.length;
  const isFormEmpty = Object.keys(scores).length === 0 && !remarks && !recommendation;
  const submittedPanelCount = panelMembers.filter((m) => m.hasSubmitted).length;

  const getGrade = (pct: number) => {
    if (pct >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100', label: 'Excellent' };
    if (pct >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100', label: 'Good' };
    if (pct >= 40) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Average' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100', label: 'Below Average' };
  };

  const gradeInfo = getGrade(percentage);

  // Load feedback history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('feedbackHistory');
    if (savedHistory) {
      try {
        setFeedbackHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading feedback history:', e);
      }
    }
  }, []);

  // Save feedback history to localStorage whenever it changes
  useEffect(() => {
    if (feedbackHistory.length > 0) {
      localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory));
    }
  }, [feedbackHistory]);

  // Mark form as dirty when values change
  useEffect(() => {
    if (!isLoadingFeedback) {
      setIsDirty(true);
      setSaveSuccess(false);
      setSubmitSuccess(false);
    }
  }, [scores, remarks, recommendation, panelMembers]);

  // Auto-save draft every 30 seconds if enabled
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      if (isDirty && Object.keys(scores).length > 0) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [isDirty, scores, autoSaveEnabled]);

  // Load saved feedback when candidate or round changes
  useEffect(() => {
    loadSavedFeedback();
  }, [selectedCandidate, selectedRound]);

  // Clear success messages after timeout
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => setSubmitSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  // Branch toggle handler
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const without = selectedBranches.filter((b) => b !== 'all' && b !== branchId);
      const adding = !selectedBranches.includes(branchId);
      const next = adding ? [...without, branchId] : without;
      setSelectedBranches(next.length === 0 ? ['all'] : next);
    }
  };

  // Academic year change handler
  const handleAcademicYearChange = (year: string) => {
    setAcademicYear(year);
    // Optionally filter candidates or data based on academic year
  };

  // Score handler
  const handleScoreChange = (key: string, score: number) => {
    setScores((prev) => ({
      ...prev,
      [key]: score
    }));
    setErrors([]);
  };

  // Clear individual score
  const handleClearScore = (key: string) => {
    setScores((prev) => {
      const newScores = { ...prev };
      delete newScores[key];
      return newScores;
    });
  };

  // Rate all criteria with same score
  const handleRateAll = (score: number) => {
    const newScores: Scores = {};
    evaluationCriteria.forEach((c) => {
      newScores[c.key] = score;
    });
    setScores(newScores);
  };

  // Clear all scores
  const handleClearAllScores = () => {
    setScores({});
  };

  // Candidate change handler
  const handleCandidateChange = (candidateId: string) => {
    if (isDirty && !isFormEmpty) {
      setConfirmUnsavedChanges({
        show: true,
        action: 'candidate',
        value: candidateId
      });
      return;
    }
    performCandidateChange(candidateId);
  };

  const performCandidateChange = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    resetForm();
    setConfirmUnsavedChanges({ show: false, action: null, value: '' });
  };

  // Round change handler
  const handleRoundChange = (round: string) => {
    if (isDirty && !isFormEmpty) {
      setConfirmUnsavedChanges({
        show: true,
        action: 'round',
        value: round
      });
      return;
    }
    performRoundChange(round);
  };

  const performRoundChange = (round: string) => {
    setSelectedRound(round);
    resetForm();
    setConfirmUnsavedChanges({ show: false, action: null, value: '' });
  };

  // Handle unsaved changes confirmation
  const handleConfirmUnsavedChanges = (save: boolean) => {
    if (save) {
      handleSaveFeedback().then(() => {
        if (confirmUnsavedChanges.action === 'candidate') {
          performCandidateChange(confirmUnsavedChanges.value);
        } else if (confirmUnsavedChanges.action === 'round') {
          performRoundChange(confirmUnsavedChanges.value);
        }
      });
    } else {
      if (confirmUnsavedChanges.action === 'candidate') {
        performCandidateChange(confirmUnsavedChanges.value);
      } else if (confirmUnsavedChanges.action === 'round') {
        performRoundChange(confirmUnsavedChanges.value);
      }
    }
  };

  const handleCancelUnsavedChanges = () => {
    setConfirmUnsavedChanges({ show: false, action: null, value: '' });
  };

  // Load saved feedback
  const loadSavedFeedback = async () => {
    setIsLoadingFeedback(true);
    const storageKey = `feedback_${selectedCandidate}_${selectedRound}`;

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const data = JSON.parse(saved);
        setScores(data.scores || {});
        setRemarks(data.remarks || '');
        setRecommendation(data.recommendation || null);
        setPanelMembers(data.panelMembers || INITIAL_PANEL_MEMBERS);
        setIsDirty(false);
        if (data.savedAt) {
          setLastSaved(new Date(data.savedAt));
        }
      } else {
        resetForm();
      }
    } catch (e) {
      console.error('Error loading saved feedback:', e);
      resetForm();
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setScores({});
    setRemarks('');
    setRecommendation(null);
    setErrors([]);
    setIsDirty(false);
    setSaveSuccess(false);
    setSubmitSuccess(false);
    setLastSaved(null);
    setPanelMembers(INITIAL_PANEL_MEMBERS);
    setShowConfirmSubmit(false);
    setShowResetConfirm(false);
  };

  // Validate form
  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!allCriteriaScored) {
      validationErrors.push(
        `Please rate all ${evaluationCriteria.length} criteria. (${completedCriteria}/${evaluationCriteria.length} completed)`
      );
    }

    if (!recommendation) {
      validationErrors.push('Please select a hiring recommendation');
    }

    if (remarks.trim().length < 10) {
      validationErrors.push('Please provide detailed remarks (at least 10 characters)');
    }

    if (panelMembers.length === 0) {
      validationErrors.push('At least one panel member is required');
    }

    return validationErrors;
  };

  // Auto-save handler
  const handleAutoSave = useCallback(async () => {
    const storageKey = `feedback_${selectedCandidate}_${selectedRound}`;
    const data = {
      scores,
      remarks,
      recommendation,
      panelMembers,
      savedAt: new Date().toISOString(),
      isAutoSave: true
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    setLastSaved(new Date());
    setIsDirty(false);
  }, [scores, remarks, recommendation, panelMembers, selectedCandidate, selectedRound]);

  // Save feedback handler
  const handleSaveFeedback = async (): Promise<boolean> => {
    setIsSaving(true);
    setErrors([]);
    setSaveSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const storageKey = `feedback_${selectedCandidate}_${selectedRound}`;
      const data = {
        scores,
        remarks,
        recommendation,
        panelMembers,
        savedAt: new Date().toISOString(),
        isAutoSave: false,
        academicYear,
        branches: selectedBranches
      };
      localStorage.setItem(storageKey, JSON.stringify(data));

      setLastSaved(new Date());
      setIsDirty(false);
      setSaveSuccess(true);

      return true;
    } catch (error) {
      setErrors(['Failed to save feedback. Please try again.']);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Submit to HR handler
  const handleSubmitToHR = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setShowConfirmSubmit(false);
      return;
    }

    if (!showConfirmSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSubmitSuccess(false);
    setShowConfirmSubmit(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update panel member status
      const updatedPanelMembers = panelMembers.map((member) => ({
        ...member,
        hasSubmitted: true
      }));
      setPanelMembers(updatedPanelMembers);

      // Create feedback record
      const feedbackRecord: FeedbackRecord = {
        id: generateId(),
        candidateId: selectedCandidate,
        candidateName: currentCandidate?.name || selectedCandidate,
        round: selectedRound,
        roundLabel: currentRound?.label || selectedRound,
        scores: { ...scores },
        totalScore,
        maxScore,
        percentage,
        grade: gradeInfo.grade,
        remarks,
        recommendation,
        panelMembers: updatedPanelMembers,
        submittedAt: new Date().toISOString(),
        savedAt: lastSaved?.toISOString() || null,
        submittedToHR: true,
        academicYear,
        branches: selectedBranches
      };

      // Add to feedback history (prepend to show newest first)
      setFeedbackHistory((prev) => [feedbackRecord, ...prev]);

      // Save to localStorage
      const storageKey = `feedback_${selectedCandidate}_${selectedRound}`;
      localStorage.setItem(storageKey, JSON.stringify({
        ...feedbackRecord,
        submittedToHR: true
      }));

      setSubmitSuccess(true);
      setIsDirty(false);
    } catch (error) {
      setErrors(['Failed to submit to HR. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel submit confirmation
  const handleCancelSubmit = () => {
    setShowConfirmSubmit(false);
  };

  // Reset form handler with confirmation
  const handleResetForm = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    const storageKey = `feedback_${selectedCandidate}_${selectedRound}`;
    localStorage.removeItem(storageKey);
    resetForm();
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  // Add panel member
  const handleAddPanelMember = (member: PanelMember) => {
    if (!panelMembers.find((m) => m.id === member.id)) {
      setPanelMembers([...panelMembers, { ...member, hasSubmitted: false }]);
      setShowAddPanelMember(false);
    }
  };

  // Remove panel member
  const handleRemovePanelMember = (memberId: string) => {
    if (panelMembers.length > 1) {
      setPanelMembers(panelMembers.filter((m) => m.id !== memberId));
    } else {
      setErrors(['At least one panel member is required']);
    }
  };

  // Toggle panel member submission status
  const handleTogglePanelMemberStatus = (memberId: string) => {
    setPanelMembers(
      panelMembers.map((m) =>
      m.id === memberId ? { ...m, hasSubmitted: !m.hasSubmitted } : m
      )
    );
  };

  // Export feedback as JSON
  const handleExportFeedback = async () => {
    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const exportData = {
        candidate: currentCandidate,
        round: currentRound,
        evaluation: {
          scores,
          totalScore,
          maxScore,
          percentage,
          grade: gradeInfo.grade,
          gradeLabel: gradeInfo.label
        },
        remarks,
        recommendation,
        panelMembers,
        metadata: {
          academicYear,
          branches: selectedBranches.map((id) => BRANCHES.find((b) => b.id === id)?.name),
          exportedAt: new Date().toISOString(),
          exportedBy: 'Current User' // Would come from auth context
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `feedback_${currentCandidate?.name.replace(/\s+/g, '_')}_${selectedRound}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  // Export feedback as CSV
  const handleExportCSV = async () => {
    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const headers = [
      'Candidate Name',
      'Position',
      'Round',
      ...evaluationCriteria.map((c) => c.label),
      'Total Score',
      'Percentage',
      'Grade',
      'Recommendation',
      'Remarks'];


      const values = [
      currentCandidate?.name || '',
      currentCandidate?.position || '',
      currentRound?.label || '',
      ...evaluationCriteria.map((c) => scores[c.key]?.toString() || '0'),
      totalScore.toString(),
      `${percentage}%`,
      gradeInfo.grade,
      recommendation || '',
      `"${remarks.replace(/"/g, '""')}"`];


      const csvContent = [headers.join(','), values.join(',')].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `feedback_${currentCandidate?.name.replace(/\s+/g, '_')}_${selectedRound}_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  // Print feedback
  const handlePrintFeedback = () => {
    window.print();
  };

  // Clear all errors
  const clearErrors = () => {
    setErrors([]);
  };

  // View history record details
  const handleViewHistoryRecord = (record: FeedbackRecord) => {
    setSelectedHistoryRecord(record);
    setShowHistoryModal(true);
  };

  // Close history modal
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedHistoryRecord(null);
  };

  // Load feedback from history
  const handleLoadFromHistory = (record: FeedbackRecord) => {
    setScores(record.scores);
    setRemarks(record.remarks);
    setRecommendation(record.recommendation);
    setPanelMembers(record.panelMembers);
    setShowHistoryModal(false);
    setSelectedHistoryRecord(null);
    setIsDirty(true);
  };

  // Delete history record
  const handleDeleteHistoryRecord = (recordId: string) => {
    setFeedbackHistory((prev) => prev.filter((r) => r.id !== recordId));
    if (selectedHistoryRecord?.id === recordId) {
      setShowHistoryModal(false);
      setSelectedHistoryRecord(null);
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all feedback history? This cannot be undone.')) {
      setFeedbackHistory([]);
      localStorage.removeItem('feedbackHistory');
    }
  };

  // Toggle auto-save
  const handleToggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

  // Render stars
  const renderStars = (key: string) =>
  <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) =>
    <button
      key={s}
      onClick={() => handleScoreChange(key, s)}
      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 rounded"
      title={`Rate ${s} out of 5`}
      aria-label={`Rate ${s} out of 5 stars`}>

          <Star
        className={`w-6 h-6 ${
        s <= (scores[key] || 0) ?
        'text-yellow-400 fill-yellow-400' :
        'text-gray-200 hover:text-yellow-200'}`
        } />

        </button>
    )}
      {scores[key] &&
    <button
      onClick={() => handleClearScore(key)}
      className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      title="Clear rating"
      aria-label="Clear rating">

          <X className="w-4 h-4" />
        </button>
    }
    </div>;


  const availablePanelMembersToAdd = AVAILABLE_PANEL_MEMBERS.filter(
    (m) => !panelMembers.find((pm) => pm.id === m.id)
  );

  const candidateHistoryRecords = feedbackHistory.filter(
    (r) => r.candidateId === selectedCandidate
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Feedback & Scoring
              </h1>
              <p className="text-sm text-gray-500">
                Record detailed evaluation and hiring recommendation
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lastSaved &&
            <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            }
            {isDirty && !isFormEmpty &&
            <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Unsaved changes
              </span>
            }
            <button
              onClick={handleToggleAutoSave}
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              autoSaveEnabled ?
              'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-600'}`
              }
              title={autoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled'}>

              <Save className="w-3 h-3" />
              Auto-save {autoSaveEnabled ? 'ON' : 'OFF'}
            </button>
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={handleAcademicYearChange}
              className="w-36" />

          </div>
        </div>

        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">
            Branch:
          </span>
          {BRANCHES.filter((b) => b.id !== 'all').map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) ?
            'bg-amber-600 text-white' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }>

              {branch.name}
              {selectedBranches.includes(branch.id) &&
            <X
              className="w-3 h-3"
              onClick={(e) => {
                e.stopPropagation();
                handleBranchToggle(branch.id);
              }} />

            }
            </button>
          )}
        </div>
      </Card>

      {/* Unsaved Changes Confirmation */}
      {confirmUnsavedChanges.show &&
      <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-800">Unsaved Changes</p>
              <p className="text-sm text-amber-700 mt-1">
                You have unsaved changes. Would you like to save them before switching?
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                variant="primary"
                onClick={() => handleConfirmUnsavedChanges(true)}
                disabled={isSaving}>

                  {isSaving ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </> :

                'Save & Continue'
                }
                </Button>
                <Button
                variant="outline"
                onClick={() => handleConfirmUnsavedChanges(false)}>

                  Discard Changes
                </Button>
                <Button variant="outline" onClick={handleCancelUnsavedChanges}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Error Messages */}
      {errors.length > 0 &&
      <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">
                Please fix the following errors:
              </p>
              <ul className="mt-2 space-y-1">
                {errors.map((error, index) =>
              <li key={index} className="text-sm text-red-700">
                    • {error}
                  </li>
              )}
              </ul>
            </div>
            <button onClick={clearErrors} className="text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </Card>
      }

      {/* Success Messages */}
      {saveSuccess &&
      <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Feedback saved successfully!</p>
            <button
            onClick={() => setSaveSuccess(false)}
            className="ml-auto text-green-600 hover:text-green-800">

              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      }

      {submitSuccess &&
      <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">
                Feedback submitted to HR successfully!
              </p>
              <p className="text-green-700 text-sm">
                The hiring team will be notified and review the feedback shortly.
              </p>
            </div>
            <button
            onClick={() => setSubmitSuccess(false)}
            className="ml-auto text-green-600 hover:text-green-800">

              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate & Round Info */}
          <Card title="Candidate & Interview Info">
            {isLoadingFeedback ?
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                <span className="ml-2 text-gray-600">Loading feedback...</span>
              </div> :

            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                  label="Candidate *"
                  options={CANDIDATES.map((c) => ({
                    value: c.id,
                    label: `${c.name} - ${c.position}`
                  }))}
                  value={selectedCandidate}
                  onChange={handleCandidateChange} />

                  <Select
                  label="Interview Round"
                  options={INTERVIEW_ROUNDS}
                  value={selectedRound}
                  onChange={handleRoundChange} />

                </div>
                {currentCandidate &&
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold">
                          {currentCandidate.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {currentCandidate.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {currentCandidate.position} · {currentCandidate.campus} ·{' '}
                            {currentCandidate.experience} exp.
                          </p>
                          <p className="text-xs text-gray-400">
                            Interview: {currentCandidate.interviewDate} ·{' '}
                            {currentCandidate.interviewTime} ·{' '}
                            {currentCandidate.interviewType}
                          </p>
                        </div>
                      </div>
                      <button
                    onClick={() => setShowCandidateDetails(!showCandidateDetails)}
                    className="text-amber-600 hover:text-amber-700 p-2"
                    title={showCandidateDetails ? 'Hide details' : 'Show details'}>

                        {showCandidateDetails ?
                    <EyeOff className="w-5 h-5" /> :

                    <Eye className="w-5 h-5" />
                    }
                      </button>
                    </div>

                    {showCandidateDetails &&
                <div className="mt-4 pt-4 border-t border-amber-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Application ID</p>
                            <p className="font-medium">{currentCandidate.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Position Applied</p>
                            <p className="font-medium">{currentCandidate.position}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Preferred Campus</p>
                            <p className="font-medium">{currentCandidate.campus}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Experience</p>
                            <p className="font-medium">{currentCandidate.experience}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">{currentCandidate.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium">{currentCandidate.phone}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Qualifications</p>
                            <p className="font-medium">{currentCandidate.qualifications}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Applied Date</p>
                            <p className="font-medium">{currentCandidate.appliedDate}</p>
                          </div>
                        </div>

                        {candidateHistoryRecords.length > 0 &&
                  <div className="mt-4 pt-4 border-t border-amber-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Previous Feedback ({candidateHistoryRecords.length})
                            </p>
                            <div className="space-y-2">
                              {candidateHistoryRecords.slice(0, 3).map((record) =>
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg text-sm">

                                  <div>
                                    <span className="font-medium">{record.roundLabel}</span>
                                    <span className="text-gray-500 ml-2">
                                      {record.submittedAt ?
                            new Date(record.submittedAt).toLocaleDateString() :
                            'Not submitted'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                            className={`text-xs px-2 py-0.5 rounded ${gradeInfo.bg} ${gradeInfo.color}`}>

                                      {record.grade}
                                    </span>
                                    <button
                            onClick={() => handleViewHistoryRecord(record)}
                            className="text-amber-600 hover:text-amber-700">

                                      <Eye className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                      )}
                            </div>
                          </div>
                  }
                      </div>
                }
                  </div>
              }
              </>
            }
          </Card>

          {/* Evaluation Criteria */}
          <Card
            title={
            <div className="flex items-center justify-between w-full">
                <span>Evaluation Criteria</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-gray-500">
                    {completedCriteria}/{evaluationCriteria.length} rated
                  </span>
                  {completedCriteria > 0 &&
                <button
                  onClick={handleClearAllScores}
                  className="text-xs text-gray-500 hover:text-gray-700 underline">

                      Clear all
                    </button>
                }
                </div>
              </div>
            }>

            {/* Quick rate all buttons */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Quick Rate All:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) =>
                <button
                  key={score}
                  onClick={() => handleRateAll(score)}
                  className="flex-1 py-2 px-3 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors flex items-center justify-center gap-1">

                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {score}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {evaluationCriteria.map((criterion) =>
              <div key={criterion.key} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{criterion.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {criterion.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {renderStars(criterion.key)}
                      <span className="text-sm font-bold text-gray-700 w-8 text-right">
                        {scores[criterion.key] ? `${scores[criterion.key]}/5` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!allCriteriaScored && completedCriteria > 0 &&
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Please rate all criteria before submitting feedback.
                  {evaluationCriteria.length - completedCriteria} remaining.
                </p>
              </div>
            }
          </Card>

          {/* Remarks */}
          <Card title="Remarks & Recommendation">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Detailed Remarks
                  </label>
                  <span
                    className={`text-xs ${
                    remarks.length < 10 ? 'text-red-500' : 'text-gray-400'}`
                    }>

                    {remarks.length} characters {remarks.length < 10 && '(min 10)'}
                  </span>
                </div>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  placeholder="Provide detailed feedback about the candidate's performance, strengths, weaknesses, and any notable observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" />

                {remarks.length > 0 && remarks.length < 10 &&
                <p className="text-xs text-red-500 mt-1">
                    Remarks must be at least 10 characters
                  </p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hire Recommendation
                </label>
                <div className="flex gap-3">
                  {(['Yes', 'No', 'Maybe'] as Recommendation[]).map((rec) =>
                  <button
                    key={rec}
                    onClick={() => setRecommendation(rec)}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    recommendation === rec ?
                    rec === 'Yes' ?
                    'border-green-500 bg-green-50 text-green-700' :
                    rec === 'No' ?
                    'border-red-500 bg-red-50 text-red-700' :
                    'border-yellow-500 bg-yellow-50 text-yellow-700' :
                    'border-gray-200 text-gray-600 hover:border-gray-300'}`
                    }>

                      {rec === 'Yes' ?
                    <>
                          <ThumbsUp className="w-4 h-4 inline mr-1" />
                          Recommend
                        </> :
                    rec === 'No' ?
                    <>
                          <ThumbsDown className="w-4 h-4 inline mr-1" />
                          Not Recommend
                        </> :

                    <>
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          Maybe
                        </>
                    }
                    </button>
                  )}
                </div>
                {recommendation &&
                <button
                  onClick={() => setRecommendation(null)}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline">

                    Clear recommendation
                  </button>
                }
              </div>
            </div>
          </Card>

          {/* Submit Confirmation */}
          {showConfirmSubmit &&
          <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Confirm Submission</p>
                  <p className="text-sm text-amber-700 mt-1">
                    You are about to submit feedback for{' '}
                    <strong>{currentCandidate?.name}</strong> ({currentRound?.label}).
                    This will notify the HR team. Are you sure?
                  </p>
                  <div className="mt-2 text-sm text-amber-600">
                    <p>• Total Score: {totalScore}/{maxScore} ({percentage}%)</p>
                    <p>• Grade: {gradeInfo.grade} ({gradeInfo.label})</p>
                    <p>• Recommendation: {recommendation}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                    variant="primary"
                    onClick={handleSubmitToHR}
                    disabled={isSubmitting}>

                      {isSubmitting ?
                    <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </> :

                    <>
                          <Send className="w-4 h-4 mr-2" />
                          Yes, Submit to HR
                        </>
                    }
                    </Button>
                    <Button variant="outline" onClick={handleCancelSubmit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          }

          {/* Reset Confirmation */}
          {showResetConfirm &&
          <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">Confirm Reset</p>
                  <p className="text-sm text-red-700 mt-1">
                    Are you sure you want to reset all feedback? This will clear all
                    scores, remarks, recommendations, and saved data for this candidate
                    and round.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="primary" onClick={handleResetForm}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Yes, Reset All
                    </Button>
                    <Button variant="outline" onClick={handleCancelReset}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          }

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={handleSaveFeedback}
              disabled={isSaving || isFormEmpty}>

              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </> :

              <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Feedback
                </>
              }
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmitToHR}
              disabled={isSubmitting || !allCriteriaScored || !recommendation || remarks.length < 10}>

              {isSubmitting ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </> :

              <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit to HR
                </>
              }
            </Button>
            <Button
              variant="outline"
              onClick={handleResetForm}
              disabled={isFormEmpty}>

              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={handleExportFeedback}
              disabled={isExporting || isFormEmpty}>

              {isExporting ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export JSON
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isExporting || isFormEmpty}>

              {isExporting ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export CSV
            </Button>
            <Button variant="outline" onClick={handlePrintFeedback}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Score Summary */}
        <div className="space-y-6">
          <Card title="Score Summary">
            <div className="text-center py-4">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    strokeDasharray={`${percentage * 2.512} 251.2`}
                    strokeLinecap="round"
                    className="transition-all duration-500" />

                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${gradeInfo.bg}`}>

                <Award className={`w-5 h-5 ${gradeInfo.color}`} />
                <span className={`text-xl font-bold ${gradeInfo.color}`}>
                  Grade {gradeInfo.grade}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{gradeInfo.label}</p>
              <p className="text-sm text-gray-500 mt-2">
                {totalScore} / {maxScore} points
              </p>
            </div>

            <div className="space-y-2 mt-4">
              {evaluationCriteria.map((c) =>
              <div
                key={c.key}
                className="flex items-center justify-between text-sm">

                  <span className="text-gray-600 truncate">{c.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${(scores[c.key] || 0) / 5 * 100}%`
                      }}>
                    </div>
                    </div>
                    <span className="font-medium text-gray-900 w-6 text-right">
                      {scores[c.key] || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {recommendation &&
            <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Recommendation:</p>
                <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                recommendation === 'Yes' ?
                'bg-green-100 text-green-700' :
                recommendation === 'No' ?
                'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'}`
                }>

                  {recommendation === 'Yes' ?
                <ThumbsUp className="w-4 h-4" /> :
                recommendation === 'No' ?
                <ThumbsDown className="w-4 h-4" /> :

                <AlertCircle className="w-4 h-4" />
                }
                  <span className="font-medium">
                    {recommendation === 'Yes' ?
                  'Recommended' :
                  recommendation === 'No' ?
                  'Not Recommended' :
                  'Maybe'}
                  </span>
                </div>
              </div>
            }
          </Card>

          {/* Panel Members */}
          <Card
            title={
            <div className="flex items-center justify-between w-full">
                <span>Panel Members ({panelMembers.length})</span>
                <button
                onClick={() => setShowAddPanelMember(!showAddPanelMember)}
                className="text-amber-600 hover:text-amber-700"
                title="Add panel member">

                  {showAddPanelMember ?
                <X className="w-4 h-4" /> :

                <Plus className="w-4 h-4" />
                }
                </button>
              </div>
            }>

            <div className="space-y-2">
              {/* Submission progress */}
              <div className="p-2 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Submission Progress</span>
                  <span className="font-medium">
                    {submittedPanelCount}/{panelMembers.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${submittedPanelCount / panelMembers.length * 100}%`
                    }}>
                  </div>
                </div>
              </div>

              {panelMembers.map((member) =>
              <div
                key={member.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">

                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.designation}</p>
                  </div>
                  <button
                  onClick={() => handleTogglePanelMemberStatus(member.id)}
                  className="transition-colors p-1"
                  title={
                  member.hasSubmitted ?
                  'Mark as not submitted' :
                  'Mark as submitted'
                  }>

                    {member.hasSubmitted ?
                  <CheckCircle className="w-5 h-5 text-green-500" /> :

                  <Clock className="w-5 h-5 text-gray-400" />
                  }
                  </button>
                  {panelMembers.length > 1 &&
                <button
                  onClick={() => handleRemovePanelMember(member.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove panel member">

                      <X className="w-4 h-4" />
                    </button>
                }
                </div>
              )}

              {showAddPanelMember &&
              <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">Add Panel Member:</p>
                  {availablePanelMembersToAdd.length > 0 ?
                <div className="space-y-1 max-h-40 overflow-y-auto">
                      {availablePanelMembersToAdd.map((member) =>
                  <button
                    key={member.id}
                    onClick={() => handleAddPanelMember(member)}
                    className="w-full flex items-center gap-2 p-2 bg-gray-100 hover:bg-amber-50 rounded-lg transition-colors">

                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                            {member.initials}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm text-gray-700">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.designation}</p>
                          </div>
                          <Plus className="w-4 h-4 text-amber-600" />
                        </button>
                  )}
                    </div> :

                <p className="text-xs text-gray-500 text-center py-2">
                      No more panel members available to add
                    </p>
                }
                </div>
              }
            </div>
          </Card>

          {/* Feedback History */}
          <Card
            title={
            <div className="flex items-center justify-between w-full">
                <span>Recent Submissions</span>
                <div className="flex items-center gap-2">
                  {feedbackHistory.length > 0 &&
                <>
                      <button
                    onClick={() => setShowFeedbackHistory(!showFeedbackHistory)}
                    className="text-amber-600 hover:text-amber-700"
                    title={showFeedbackHistory ? 'Show less' : 'Show all'}>

                        <History className="w-4 h-4" />
                      </button>
                      <button
                    onClick={handleClearHistory}
                    className="text-gray-400 hover:text-red-500"
                    title="Clear history">

                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                }
                </div>
              </div>
            }>

            {feedbackHistory.length > 0 ?
            <div className="space-y-2">
                {feedbackHistory.
              slice(0, showFeedbackHistory ? undefined : 3).
              map((record) =>
              <div
                key={record.id}
                className="p-3 bg-gray-50 rounded-lg">

                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {record.candidateName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.roundLabel}
                          </p>
                          <p className="text-xs text-gray-400">
                            {record.submittedAt ?
                      new Date(record.submittedAt).toLocaleString() :
                      'Not submitted'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                        getGrade(record.percentage).bg} ${
                        getGrade(record.percentage).color}`}>

                              {record.grade} ({record.percentage}%)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                        className={`text-xs px-2 py-0.5 rounded ${
                        record.recommendation === 'Yes' ?
                        'bg-green-100 text-green-700' :
                        record.recommendation === 'No' ?
                        'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}`
                        }>

                              {record.recommendation}
                            </span>
                            {record.submittedToHR &&
                      <Check className="w-3 h-3 text-green-600" />
                      }
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                    onClick={() => handleViewHistoryRecord(record)}
                    className="text-xs text-amber-600 hover:text-amber-700">

                          View Details
                        </button>
                        <button
                    onClick={() => handleLoadFromHistory(record)}
                    className="text-xs text-gray-500 hover:text-gray-700">

                          Load as Template
                        </button>
                        <button
                    onClick={() => handleDeleteHistoryRecord(record.id)}
                    className="text-xs text-red-500 hover:text-red-700 ml-auto">

                          Delete
                        </button>
                      </div>
                    </div>
              )}
                {!showFeedbackHistory && feedbackHistory.length > 3 &&
              <button
                onClick={() => setShowFeedbackHistory(true)}
                className="w-full py-2 text-sm text-amber-600 hover:text-amber-700">

                    Show {feedbackHistory.length - 3} more...
                  </button>
              }
              </div> :

            <p className="text-sm text-gray-500 text-center py-4">
                No feedback submissions yet
              </p>
            }
          </Card>
        </div>
      </div>

      {/* History Detail Modal */}
      {showHistoryModal && selectedHistoryRecord &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Feedback Details
                </h2>
                <button
                onClick={handleCloseHistoryModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Candidate</p>
                      <p className="font-medium">{selectedHistoryRecord.candidateName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Round</p>
                      <p className="font-medium">{selectedHistoryRecord.roundLabel}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium">
                        {selectedHistoryRecord.submittedAt ?
                      new Date(selectedHistoryRecord.submittedAt).toLocaleString() :
                      'Not submitted'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Academic Year</p>
                      <p className="font-medium">{selectedHistoryRecord.academicYear}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedHistoryRecord.percentage}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedHistoryRecord.totalScore}/{selectedHistoryRecord.maxScore} points
                      </p>
                    </div>
                    <div
                    className={`px-4 py-2 rounded-lg ${
                    getGrade(selectedHistoryRecord.percentage).bg}`
                    }>

                      <span
                      className={`text-xl font-bold ${
                      getGrade(selectedHistoryRecord.percentage).color}`
                      }>

                        Grade {selectedHistoryRecord.grade}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-2">Scores</p>
                  <div className="space-y-2">
                    {evaluationCriteria.map((c) =>
                  <div
                    key={c.key}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">

                        <span className="text-gray-600">{c.label}</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((s) =>
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                        s <= (selectedHistoryRecord.scores[c.key] || 0) ?
                        'text-yellow-400 fill-yellow-400' :
                        'text-gray-200'}`
                        } />

                      )}
                          <span className="font-medium w-6 text-right">
                            {selectedHistoryRecord.scores[c.key] || 0}
                          </span>
                        </div>
                      </div>
                  )}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-2">Recommendation</p>
                  <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  selectedHistoryRecord.recommendation === 'Yes' ?
                  'bg-green-100 text-green-700' :
                  selectedHistoryRecord.recommendation === 'No' ?
                  'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'}`
                  }>

                    {selectedHistoryRecord.recommendation === 'Yes' ?
                  <ThumbsUp className="w-4 h-4" /> :
                  selectedHistoryRecord.recommendation === 'No' ?
                  <ThumbsDown className="w-4 h-4" /> :

                  <AlertCircle className="w-4 h-4" />
                  }
                    <span className="font-medium">{selectedHistoryRecord.recommendation}</span>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-2">Remarks</p>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {selectedHistoryRecord.remarks || 'No remarks provided'}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-2">Panel Members</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedHistoryRecord.panelMembers.map((member) =>
                  <div
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">

                        <span>{member.name}</span>
                        {member.hasSubmitted ?
                    <CheckCircle className="w-4 h-4 text-green-500" /> :

                    <Clock className="w-4 h-4 text-gray-400" />
                    }
                      </div>
                  )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex gap-3">
                <Button
                variant="primary"
                onClick={() => handleLoadFromHistory(selectedHistoryRecord)}>

                  Load as Template
                </Button>
                <Button variant="outline" onClick={handleCloseHistoryModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}