import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Building,
  X,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronRight,
  Filter,
  Download,
  Users,
  AlertCircle,
  MessageSquare,
  Search,
  ChevronLeft,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

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


const DECISION_OPTIONS = [
{ value: 'all', label: 'All Decisions' },
{ value: 'Pending', label: 'Pending' },
{ value: 'Shortlisted', label: 'Shortlisted' },
{ value: 'Rejected', label: 'Rejected' },
{ value: 'Hold', label: 'Hold' },
{ value: 'Move to Interview', label: 'Move to Interview' }];


const POSITION_OPTIONS = [
{ value: 'all', label: 'All Positions' },
{ value: 'Math Teacher', label: 'Math Teacher' },
{ value: 'Science HOD', label: 'Science HOD' },
{ value: 'PE Teacher', label: 'PE Teacher' },
{ value: 'CS Teacher', label: 'CS Teacher' },
{ value: 'Art Teacher', label: 'Art Teacher' }];


const SORT_OPTIONS = [
{ value: 'name-asc', label: 'Name (A-Z)' },
{ value: 'name-desc', label: 'Name (Z-A)' },
{ value: 'score-desc', label: 'Score (High to Low)' },
{ value: 'score-asc', label: 'Score (Low to High)' },
{ value: 'experience-desc', label: 'Experience (High to Low)' },
{ value: 'experience-asc', label: 'Experience (Low to High)' }];


const EXPORT_FORMATS = [
{ value: 'csv', label: 'CSV' },
{ value: 'json', label: 'JSON' },
{ value: 'pdf', label: 'PDF Report' }];


interface Candidate {
  id: string;
  name: string;
  avatar: string;
  position: string;
  qualification: string;
  experience: number;
  branch: string;
  scores: {
    qualification: number;
    experience: number;
    subjectKnowledge: number;
    communication: number;
    culturalFit: number;
  };
  demoRequired: boolean;
  comments: string;
  decision: 'Pending' | 'Shortlisted' | 'Rejected' | 'Hold' | 'Move to Interview';
  evaluatedAt?: string;
  evaluatedBy?: string;
}

interface EvaluationHistory {
  candidateId: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
  }[];
}

const initialCandidates: Candidate[] = [
{
  id: 'APP-2024-001',
  name: 'Priya Sharma',
  avatar: 'PS',
  position: 'Math Teacher',
  qualification: 'M.Sc + B.Ed',
  experience: 5,
  branch: 'main',
  scores: {
    qualification: 5,
    experience: 4,
    subjectKnowledge: 5,
    communication: 4,
    culturalFit: 4
  },
  demoRequired: true,
  comments: 'Strong academic background',
  decision: 'Shortlisted'
},
{
  id: 'APP-2024-002',
  name: 'Rahul Verma',
  avatar: 'RV',
  position: 'Science HOD',
  qualification: 'M.Sc + PhD',
  experience: 12,
  branch: 'main',
  scores: {
    qualification: 5,
    experience: 5,
    subjectKnowledge: 5,
    communication: 5,
    culturalFit: 4
  },
  demoRequired: false,
  comments: 'Excellent profile',
  decision: 'Move to Interview'
},
{
  id: 'APP-2024-003',
  name: 'Suresh Kumar',
  avatar: 'SK',
  position: 'PE Teacher',
  qualification: 'B.P.Ed',
  experience: 3,
  branch: 'north',
  scores: {
    qualification: 3,
    experience: 3,
    subjectKnowledge: 4,
    communication: 3,
    culturalFit: 4
  },
  demoRequired: true,
  comments: 'Average profile',
  decision: 'Pending'
},
{
  id: 'APP-2024-004',
  name: 'Meera Patel',
  avatar: 'MP',
  position: 'CS Teacher',
  qualification: 'MCA + B.Ed',
  experience: 4,
  branch: 'south',
  scores: {
    qualification: 4,
    experience: 4,
    subjectKnowledge: 4,
    communication: 4,
    culturalFit: 3
  },
  demoRequired: true,
  comments: 'Good technical skills',
  decision: 'Shortlisted'
},
{
  id: 'APP-2024-005',
  name: 'Kavita Joshi',
  avatar: 'KJ',
  position: 'Art Teacher',
  qualification: 'BFA',
  experience: 2,
  branch: 'east',
  scores: {
    qualification: 2,
    experience: 2,
    subjectKnowledge: 3,
    communication: 3,
    culturalFit: 3
  },
  demoRequired: false,
  comments: 'Insufficient experience',
  decision: 'Rejected'
}];


const criteriaLabels = {
  qualification: 'Qualification Match',
  experience: 'Experience Match',
  subjectKnowledge: 'Subject Knowledge',
  communication: 'Communication Skills',
  culturalFit: 'Cultural Fit'
};

const decisionConfig = {
  Pending: { color: 'text-gray-600', bg: 'bg-gray-100' },
  Shortlisted: { color: 'text-blue-700', bg: 'bg-blue-100' },
  Rejected: { color: 'text-red-700', bg: 'bg-red-100' },
  Hold: { color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'Move to Interview': { color: 'text-green-700', bg: 'bg-green-100' }
};

export function ScreeningShortlisting() {
  // State for filters
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // State for candidates
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // State for editing evaluation
  const [editedScores, setEditedScores] = useState<Candidate['scores'] | null>(null);
  const [editedDemoRequired, setEditedDemoRequired] = useState<boolean | null>(null);
  const [editedComments, setEditedComments] = useState<string>('');
  const [editedDecision, setEditedDecision] = useState<Candidate['decision'] | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for history and notifications
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistory[]>([]);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'warning';message: string;} | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize edited values when candidate is selected
  useEffect(() => {
    if (selectedCandidate) {
      setEditedScores({ ...selectedCandidate.scores });
      setEditedDemoRequired(selectedCandidate.demoRequired);
      setEditedComments(selectedCandidate.comments);
      setEditedDecision(selectedCandidate.decision);
      setHasUnsavedChanges(false);
    } else {
      setEditedScores(null);
      setEditedDemoRequired(null);
      setEditedComments('');
      setEditedDecision(null);
      setHasUnsavedChanges(false);
    }
  }, [selectedCandidate?.id]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Branch toggle handler
  const handleBranchToggle = useCallback((branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      setSelectedBranches((prev) => {
        const without = prev.filter((b) => b !== 'all' && b !== branchId);
        const adding = !prev.includes(branchId);
        const next = adding ? [...without, branchId] : without;
        return next.length === 0 ? ['all'] : next;
      });
    }
  }, []);

  // Calculate active branches for filtering
  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;

  // Calculate auto score
  const calcAutoScore = useCallback((scores: Candidate['scores']) => {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length * 5) * 100);
  }, []);

  // Filter and sort candidates
  const filtered = useMemo(() => {
    let result = localCandidates.filter((c) => activeBranches.includes(c.branch));

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.position.toLowerCase().includes(query) ||
        c.qualification.toLowerCase().includes(query)
      );
    }

    // Apply decision filter
    if (decisionFilter !== 'all') {
      result = result.filter((c) => c.decision === decisionFilter);
    }

    // Apply position filter
    if (positionFilter !== 'all') {
      result = result.filter((c) => c.position === positionFilter);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'score-desc':
          return calcAutoScore(b.scores) - calcAutoScore(a.scores);
        case 'score-asc':
          return calcAutoScore(a.scores) - calcAutoScore(b.scores);
        case 'experience-desc':
          return b.experience - a.experience;
        case 'experience-asc':
          return a.experience - b.experience;
        default:
          return 0;
      }
    });

    return result;
  }, [localCandidates, activeBranches, searchQuery, decisionFilter, positionFilter, sortBy, calcAutoScore]);

  // Get branch name by ID
  const getBranchName = useCallback(
    (id: string) => BRANCHES.find((b) => b.id === id)?.name || id,
    []
  );

  // Update score for a specific criteria
  const updateScore = useCallback(
    (criteria: keyof Candidate['scores'], value: number) => {
      if (editedScores) {
        setEditedScores((prev) => prev ? { ...prev, [criteria]: value } : null);
        setHasUnsavedChanges(true);
      }
    },
    [editedScores]
  );

  // Toggle demo required
  const toggleDemoRequired = useCallback(() => {
    setEditedDemoRequired((prev) => !prev);
    setHasUnsavedChanges(true);
  }, []);

  // Update comments
  const updateComments = useCallback((value: string) => {
    setEditedComments(value);
    setHasUnsavedChanges(true);
  }, []);

  // Update decision
  const updateDecision = useCallback((decision: Candidate['decision']) => {
    setEditedDecision(decision);
    setHasUnsavedChanges(true);
  }, []);

  // Save evaluation
  const saveEvaluation = useCallback(() => {
    if (!selectedCandidate || !editedScores || editedDemoRequired === null || !editedDecision) {
      setNotification({ type: 'error', message: 'Unable to save evaluation. Please try again.' });
      return;
    }

    const changes: EvaluationHistory['changes'] = [];

    // Track score changes
    Object.entries(editedScores).forEach(([key, value]) => {
      const oldValue = selectedCandidate.scores[key as keyof Candidate['scores']];
      if (oldValue !== value) {
        changes.push({
          field: `scores.${key}`,
          oldValue,
          newValue: value
        });
      }
    });

    // Track demo required changes
    if (selectedCandidate.demoRequired !== editedDemoRequired) {
      changes.push({
        field: 'demoRequired',
        oldValue: selectedCandidate.demoRequired,
        newValue: editedDemoRequired
      });
    }

    // Track comments changes
    if (selectedCandidate.comments !== editedComments) {
      changes.push({
        field: 'comments',
        oldValue: selectedCandidate.comments,
        newValue: editedComments
      });
    }

    // Track decision changes
    if (selectedCandidate.decision !== editedDecision) {
      changes.push({
        field: 'decision',
        oldValue: selectedCandidate.decision,
        newValue: editedDecision
      });
    }

    // Update candidate
    const updatedCandidate: Candidate = {
      ...selectedCandidate,
      scores: editedScores,
      demoRequired: editedDemoRequired,
      comments: editedComments,
      decision: editedDecision,
      evaluatedAt: new Date().toISOString(),
      evaluatedBy: 'Current User'
    };

    setLocalCandidates((prev) =>
    prev.map((c) => c.id === selectedCandidate.id ? updatedCandidate : c)
    );

    setSelectedCandidate(updatedCandidate);

    // Record history
    if (changes.length > 0) {
      setEvaluationHistory((prev) => [
      ...prev,
      {
        candidateId: selectedCandidate.id,
        timestamp: new Date().toISOString(),
        changes
      }]
      );
    }

    setHasUnsavedChanges(false);
    setNotification({ type: 'success', message: `Evaluation saved for ${selectedCandidate.name}` });
  }, [selectedCandidate, editedScores, editedDemoRequired, editedComments, editedDecision]);

  // Reset evaluation to original values
  const resetEvaluation = useCallback(() => {
    if (selectedCandidate) {
      setEditedScores({ ...selectedCandidate.scores });
      setEditedDemoRequired(selectedCandidate.demoRequired);
      setEditedComments(selectedCandidate.comments);
      setEditedDecision(selectedCandidate.decision);
      setHasUnsavedChanges(false);
      setNotification({ type: 'warning', message: 'Evaluation reset to original values' });
    }
  }, [selectedCandidate]);

  // Navigate to next candidate
  const goToNextCandidate = useCallback(() => {
    if (!selectedCandidate) return;

    const currentIndex = filtered.findIndex((c) => c.id === selectedCandidate.id);
    if (currentIndex < filtered.length - 1) {
      if (hasUnsavedChanges) {
        const confirm = window.confirm('You have unsaved changes. Do you want to continue without saving?');
        if (!confirm) return;
      }
      setSelectedCandidate(filtered[currentIndex + 1]);
    } else {
      setNotification({ type: 'warning', message: 'This is the last candidate in the list' });
    }
  }, [selectedCandidate, filtered, hasUnsavedChanges]);

  // Navigate to previous candidate
  const goToPreviousCandidate = useCallback(() => {
    if (!selectedCandidate) return;

    const currentIndex = filtered.findIndex((c) => c.id === selectedCandidate.id);
    if (currentIndex > 0) {
      if (hasUnsavedChanges) {
        const confirm = window.confirm('You have unsaved changes. Do you want to continue without saving?');
        if (!confirm) return;
      }
      setSelectedCandidate(filtered[currentIndex - 1]);
    } else {
      setNotification({ type: 'warning', message: 'This is the first candidate in the list' });
    }
  }, [selectedCandidate, filtered, hasUnsavedChanges]);

  // Export functionality
  const handleExport = useCallback(
    async (format: string) => {
      setIsExporting(true);
      setShowExportMenu(false);

      try {
        const dataToExport = filtered.map((c) => ({
          id: c.id,
          name: c.name,
          position: c.position,
          qualification: c.qualification,
          experience: c.experience,
          branch: getBranchName(c.branch),
          qualificationScore: c.scores.qualification,
          experienceScore: c.scores.experience,
          subjectKnowledgeScore: c.scores.subjectKnowledge,
          communicationScore: c.scores.communication,
          culturalFitScore: c.scores.culturalFit,
          totalScore: calcAutoScore(c.scores),
          demoRequired: c.demoRequired ? 'Yes' : 'No',
          comments: c.comments,
          decision: c.decision,
          evaluatedAt: c.evaluatedAt || 'Not evaluated'
        }));

        let content: string;
        let filename: string;
        let mimeType: string;

        switch (format) {
          case 'csv':
            const headers = Object.keys(dataToExport[0]).join(',');
            const rows = dataToExport.map((row) =>
            Object.values(row).
            map((v) => `"${v}"`).
            join(',')
            );
            content = [headers, ...rows].join('\n');
            filename = `screening-candidates-${academicYear}.csv`;
            mimeType = 'text/csv';
            break;

          case 'json':
            content = JSON.stringify(dataToExport, null, 2);
            filename = `screening-candidates-${academicYear}.json`;
            mimeType = 'application/json';
            break;

          case 'pdf':
            // Simulate PDF generation
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setNotification({ type: 'success', message: 'PDF report generated and downloaded' });
            setIsExporting(false);
            return;

          default:
            throw new Error('Unsupported format');
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setNotification({ type: 'success', message: `Exported ${filtered.length} candidates to ${format.toUpperCase()}` });
      } catch (error) {
        setNotification({ type: 'error', message: 'Export failed. Please try again.' });
      } finally {
        setIsExporting(false);
      }
    },
    [filtered, academicYear, getBranchName, calcAutoScore]
  );

  // Bulk actions
  const bulkUpdateDecision = useCallback(
    (decision: Candidate['decision']) => {
      const candidateIds = filtered.map((c) => c.id);
      setLocalCandidates((prev) =>
      prev.map((c) =>
      candidateIds.includes(c.id) ?
      { ...c, decision, evaluatedAt: new Date().toISOString() } :
      c
      )
      );
      setNotification({ type: 'success', message: `Updated ${candidateIds.length} candidates to "${decision}"` });
    },
    [filtered]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedBranches(['all']);
    setSearchQuery('');
    setDecisionFilter('all');
    setPositionFilter('all');
    setSortBy('name-asc');
    setNotification({ type: 'success', message: 'All filters cleared' });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      !selectedBranches.includes('all') ||
      searchQuery.trim() !== '' ||
      decisionFilter !== 'all' ||
      positionFilter !== 'all' ||
      sortBy !== 'name-asc');

  }, [selectedBranches, searchQuery, decisionFilter, positionFilter, sortBy]);

  // Get current candidate index info
  const candidateIndexInfo = useMemo(() => {
    if (!selectedCandidate) return null;
    const index = filtered.findIndex((c) => c.id === selectedCandidate.id);
    return {
      current: index + 1,
      total: filtered.length,
      isFirst: index === 0,
      isLast: index === filtered.length - 1
    };
  }, [selectedCandidate, filtered]);

  // Render stars with click handler
  const renderStars = useCallback(
    (value: number, onChange?: (v: number) => void) =>
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) =>
      <button
        key={s}
        onClick={() => onChange?.(s)}
        disabled={!onChange}
        className={onChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        title={onChange ? `Rate ${s} out of 5` : undefined}>

            <Star
          className={`w-4 h-4 ${s <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

          </button>
      )}
      </div>,

    []
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Notification */}
      {notification &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
        notification.type === 'success' ?
        'bg-green-100 text-green-800' :
        notification.type === 'error' ?
        'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'}`
        }>

          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Filter className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Screening & Shortlisting</h1>
              <p className="text-sm text-gray-500">Evaluate and score candidates for shortlisting</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting || filtered.length === 0}>

                <Download className="w-4 h-4 mr-1" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
              {showExportMenu &&
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-10">
                  {EXPORT_FORMATS.map((format) =>
                <button
                  key={format.value}
                  onClick={() => handleExport(format.value)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg">

                      {format.label}
                    </button>
                )}
                </div>
              }
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-5 pt-5 border-t space-y-4">
          {/* Search Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, position, or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

              {searchQuery &&
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2">

                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              }
            </div>
            <Select
              label=""
              options={DECISION_OPTIONS}
              value={decisionFilter}
              onChange={setDecisionFilter}
              className="w-40" />

            <Select
              label=""
              options={POSITION_OPTIONS}
              value={positionFilter}
              onChange={setPositionFilter}
              className="w-40" />

            <Select
              label=""
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
              className="w-48" />

            {hasActiveFilters &&
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            }
          </div>

          {/* Branch Selection */}
          <div className="flex flex-wrap items-center gap-3">
            <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branches:</span>
            {BRANCHES.map((branch) =>
            <button
              key={branch.id}
              onClick={() => handleBranchToggle(branch.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedBranches.includes(branch.id) ||
              branch.id !== 'all' && selectedBranches.includes('all') ?
              'bg-indigo-600 text-white' :
              'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }>

                {branch.name}
                {selectedBranches.includes(branch.id) && branch.id !== 'all' &&
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
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate List */}
        <div className="lg:col-span-1">
          <Card
            title={`Candidates (${filtered.length})`}
            action={
            filtered.length > 0 &&
            <div className="relative group">
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 hidden group-hover:block">
                    <div className="py-1">
                      <p className="px-4 py-2 text-xs text-gray-500 font-medium">Set Decision for All</p>
                      {(['Shortlisted', 'Hold', 'Rejected'] as Candidate['decision'][]).map((decision) =>
                  <button
                    key={decision}
                    onClick={() => bulkUpdateDecision(decision)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">

                          Mark as {decision}
                        </button>
                  )}
                    </div>
                  </div>
                </div>

            }>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filtered.length === 0 ?
              <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No candidates found</p>
                  {hasActiveFilters &&
                <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2">
                      Clear Filters
                    </Button>
                }
                </div> :

              filtered.map((candidate) => {
                const score = calcAutoScore(candidate.scores);
                const dc = decisionConfig[candidate.decision];
                return (
                  <div
                    key={candidate.id}
                    onClick={() => {
                      if (hasUnsavedChanges && selectedCandidate?.id !== candidate.id) {
                        const confirm = window.confirm(
                          'You have unsaved changes. Do you want to continue without saving?'
                        );
                        if (!confirm) return;
                      }
                      setSelectedCandidate(candidate);
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedCandidate?.id === candidate.id ?
                    'border-indigo-500 bg-indigo-50' :
                    'border-transparent bg-gray-50 hover:bg-gray-100'}`
                    }>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {candidate.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{candidate.name}</p>
                          <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-indigo-600">{score}%</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${dc.bg} ${dc.color}`}>
                            {candidate.decision === 'Move to Interview' ? 'Interview' : candidate.decision}
                          </span>
                        </div>
                      </div>
                    </div>);

              })
              }
            </div>
          </Card>
        </div>

        {/* Evaluation Panel */}
        <div className="lg:col-span-2">
          {selectedCandidate && editedScores ?
          <div className="space-y-4">
              {/* Navigation */}
              {candidateIndexInfo &&
            <div className="flex items-center justify-between">
                  <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousCandidate}
                disabled={candidateIndexInfo.isFirst}>

                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Candidate {candidateIndexInfo.current} of {candidateIndexInfo.total}
                  </span>
                  <Button
                variant="outline"
                size="sm"
                onClick={goToNextCandidate}
                disabled={candidateIndexInfo.isLast}>

                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
            }

              {/* Unsaved Changes Warning */}
              {hasUnsavedChanges &&
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-800">You have unsaved changes</span>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetEvaluation}>
                      Reset
                    </Button>
                    <Button variant="primary" size="sm" onClick={saveEvaluation}>
                      Save Now
                    </Button>
                  </div>
                </div>
            }

              <Card title="Evaluation Scorecard">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                    {selectedCandidate.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedCandidate.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedCandidate.position} · {getBranchName(selectedCandidate.branch)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedCandidate.qualification} · {selectedCandidate.experience} years exp.
                    </p>
                  </div>
                  <div className="ml-auto text-center">
                    <p className="text-3xl font-bold text-indigo-600">{calcAutoScore(editedScores)}%</p>
                    <p className="text-xs text-gray-500">Auto Score</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(Object.entries(criteriaLabels) as [keyof Candidate['scores'], string][]).map(
                  ([key, label]) =>
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700 w-48">{label}</span>
                        <div className="flex items-center gap-3">
                          {renderStars(editedScores[key], (value) => updateScore(key, value))}
                          <span className="text-sm font-bold text-gray-900 w-6">{editedScores[key]}/5</span>
                        </div>
                      </div>

                )}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Demo Class Required</span>
                    <button
                    onClick={toggleDemoRequired}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editedDemoRequired ? 'bg-indigo-600' : 'bg-gray-300'}`
                    }>

                      <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editedDemoRequired ? 'translate-x-6' : 'translate-x-1'}`
                      } />

                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Comments</label>
                  <textarea
                  value={editedComments}
                  onChange={(e) => updateComments(e.target.value)}
                  rows={3}
                  placeholder="Add your evaluation comments here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" />

                  <p className="text-xs text-gray-400 mt-1">{editedComments.length} characters</p>
                </div>

                {/* Evaluation metadata */}
                {selectedCandidate.evaluatedAt &&
              <div className="mt-4 text-xs text-gray-400">
                    Last evaluated: {new Date(selectedCandidate.evaluatedAt).toLocaleString()}
                    {selectedCandidate.evaluatedBy && ` by ${selectedCandidate.evaluatedBy}`}
                  </div>
              }
              </Card>

              <Card title="Decision">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['Shortlisted', 'Move to Interview', 'Hold', 'Rejected'] as Candidate['decision'][]).map(
                  (decision) => {
                    const dc = decisionConfig[decision];
                    const isActive = editedDecision === decision;
                    return (
                      <button
                        key={decision}
                        onClick={() => updateDecision(decision)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        isActive ?
                        `border-current ${dc.bg} ${dc.color}` :
                        'border-gray-200 text-gray-600 hover:border-gray-300'}`
                        }>

                          {decision}
                        </button>);

                  }
                )}
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="primary" onClick={saveEvaluation} disabled={!hasUnsavedChanges}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Evaluation
                  </Button>
                  <Button variant="outline" onClick={goToNextCandidate} disabled={candidateIndexInfo?.isLast}>
                    Next Candidate
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" onClick={resetEvaluation} disabled={!hasUnsavedChanges}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card title="Quick Comparison">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">{selectedCandidate.experience}</p>
                    <p className="text-xs text-gray-500">Years Experience</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">{calcAutoScore(editedScores)}%</p>
                    <p className="text-xs text-gray-500">Overall Score</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">
                      {filtered.filter((c) => calcAutoScore(c.scores) <= calcAutoScore(editedScores)).length}
                    </p>
                    <p className="text-xs text-gray-500">Rank in List</p>
                  </div>
                </div>
              </Card>
            </div> :

          <Card className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Select a candidate to evaluate</p>
                {filtered.length > 0 &&
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setSelectedCandidate(filtered[0])}>

                    Start with First Candidate
                  </Button>
              }
              </div>
            </Card>
          }
        </div>
      </div>

      {/* Click outside handler for export menu */}
      {showExportMenu &&
      <div className="fixed inset-0 z-0" onClick={() => setShowExportMenu(false)} />
      }
    </div>);

}