import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Building,
  X,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  Users,
  Clock,
  Target,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Maximize2,
  Minimize2,
  Search,
  RotateCcw,
  Printer,
  Mail,
  Share2,
  Layers,
  Activity,
  PieChart,
  ArrowRight,
  Minus } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

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


const EXPORT_FORMATS = [
{ value: 'csv', label: 'CSV Spreadsheet' },
{ value: 'json', label: 'JSON Data' },
{ value: 'pdf', label: 'PDF Report' },
{ value: 'excel', label: 'Excel Workbook' }];


const ROLE_TYPES = [
{ value: 'all', label: 'All Role Types' },
{ value: 'Teaching', label: 'Teaching' },
{ value: 'Non-Teaching', label: 'Non-Teaching' }];


interface PipelinePosition {
  id: string;
  position: string;
  dept: string;
  roleType: 'Teaching' | 'Non-Teaching';
  applied: number;
  screened: number;
  shortlisted: number;
  interviewed: number;
  selected: number;
  offered: number;
  joined: number;
  branch: string;
  openDate: string;
  targetDate: string;
  recruiter: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  avgDaysPerStage: {
    appliedToScreened: number;
    screenedToShortlisted: number;
    shortlistedToInterviewed: number;
    interviewedToSelected: number;
    selectedToOffered: number;
    offeredToJoined: number;
  };
  stageHistory: {
    stage: Stage;
    date: string;
    count: number;
  }[];
}

const initialPipelineData: PipelinePosition[] = [
{
  id: 'POS-001',
  position: 'Math Teacher',
  dept: 'Mathematics',
  roleType: 'Teaching',
  applied: 42,
  screened: 32,
  shortlisted: 18,
  interviewed: 12,
  selected: 5,
  offered: 4,
  joined: 3,
  branch: 'main',
  openDate: '2024-10-01',
  targetDate: '2024-12-15',
  recruiter: 'HR Admin',
  urgency: 'High',
  avgDaysPerStage: {
    appliedToScreened: 3.5,
    screenedToShortlisted: 5.2,
    shortlistedToInterviewed: 6.8,
    interviewedToSelected: 4.2,
    selectedToOffered: 2.1,
    offeredToJoined: 15.3
  },
  stageHistory: [
  { stage: 'applied', date: '2024-10-05', count: 42 },
  { stage: 'screened', date: '2024-10-12', count: 32 },
  { stage: 'shortlisted', date: '2024-10-20', count: 18 },
  { stage: 'interviewed', date: '2024-11-01', count: 12 },
  { stage: 'selected', date: '2024-11-10', count: 5 },
  { stage: 'offered', date: '2024-11-15', count: 4 },
  { stage: 'joined', date: '2024-12-01', count: 3 }]

},
{
  id: 'POS-002',
  position: 'Science HOD',
  dept: 'Science',
  roleType: 'Teaching',
  applied: 28,
  screened: 20,
  shortlisted: 12,
  interviewed: 8,
  selected: 3,
  offered: 2,
  joined: 2,
  branch: 'main',
  openDate: '2024-09-15',
  targetDate: '2024-12-01',
  recruiter: 'Senior HR',
  urgency: 'Critical',
  avgDaysPerStage: {
    appliedToScreened: 2.8,
    screenedToShortlisted: 4.5,
    shortlistedToInterviewed: 5.5,
    interviewedToSelected: 3.8,
    selectedToOffered: 1.8,
    offeredToJoined: 12.5
  },
  stageHistory: [
  { stage: 'applied', date: '2024-09-20', count: 28 },
  { stage: 'screened', date: '2024-09-28', count: 20 },
  { stage: 'shortlisted', date: '2024-10-08', count: 12 },
  { stage: 'interviewed', date: '2024-10-18', count: 8 },
  { stage: 'selected', date: '2024-10-28', count: 3 },
  { stage: 'offered', date: '2024-11-02', count: 2 },
  { stage: 'joined', date: '2024-11-18', count: 2 }]

},
{
  id: 'POS-003',
  position: 'Admin Officer',
  dept: 'Administration',
  roleType: 'Non-Teaching',
  applied: 55,
  screened: 40,
  shortlisted: 22,
  interviewed: 15,
  selected: 6,
  offered: 5,
  joined: 4,
  branch: 'north',
  openDate: '2024-10-10',
  targetDate: '2024-12-20',
  recruiter: 'HR Admin',
  urgency: 'Medium',
  avgDaysPerStage: {
    appliedToScreened: 4.2,
    screenedToShortlisted: 6.5,
    shortlistedToInterviewed: 8.2,
    interviewedToSelected: 5.1,
    selectedToOffered: 2.8,
    offeredToJoined: 20.5
  },
  stageHistory: [
  { stage: 'applied', date: '2024-10-15', count: 55 },
  { stage: 'screened', date: '2024-10-25', count: 40 },
  { stage: 'shortlisted', date: '2024-11-05', count: 22 },
  { stage: 'interviewed', date: '2024-11-18', count: 15 },
  { stage: 'selected', date: '2024-11-28', count: 6 },
  { stage: 'offered', date: '2024-12-02', count: 5 },
  { stage: 'joined', date: '2024-12-15', count: 4 }]

},
{
  id: 'POS-004',
  position: 'CS Teacher',
  dept: 'Computer Science',
  roleType: 'Teaching',
  applied: 35,
  screened: 28,
  shortlisted: 15,
  interviewed: 10,
  selected: 4,
  offered: 3,
  joined: 2,
  branch: 'east',
  openDate: '2024-10-05',
  targetDate: '2024-12-10',
  recruiter: 'Tech HR',
  urgency: 'High',
  avgDaysPerStage: {
    appliedToScreened: 3.0,
    screenedToShortlisted: 5.8,
    shortlistedToInterviewed: 7.2,
    interviewedToSelected: 4.5,
    selectedToOffered: 2.2,
    offeredToJoined: 18.8
  },
  stageHistory: [
  { stage: 'applied', date: '2024-10-10', count: 35 },
  { stage: 'screened', date: '2024-10-18', count: 28 },
  { stage: 'shortlisted', date: '2024-10-28', count: 15 },
  { stage: 'interviewed', date: '2024-11-08', count: 10 },
  { stage: 'selected', date: '2024-11-15', count: 4 },
  { stage: 'offered', date: '2024-11-20', count: 3 },
  { stage: 'joined', date: '2024-12-08', count: 2 }]

},
{
  id: 'POS-005',
  position: 'English Teacher',
  dept: 'English',
  roleType: 'Teaching',
  applied: 48,
  screened: 36,
  shortlisted: 20,
  interviewed: 14,
  selected: 5,
  offered: 4,
  joined: 3,
  branch: 'south',
  openDate: '2024-09-25',
  targetDate: '2024-11-30',
  recruiter: 'HR Admin',
  urgency: 'Medium',
  avgDaysPerStage: {
    appliedToScreened: 3.8,
    screenedToShortlisted: 6.2,
    shortlistedToInterviewed: 7.5,
    interviewedToSelected: 4.8,
    selectedToOffered: 2.5,
    offeredToJoined: 16.5
  },
  stageHistory: [
  { stage: 'applied', date: '2024-09-30', count: 48 },
  { stage: 'screened', date: '2024-10-08', count: 36 },
  { stage: 'shortlisted', date: '2024-10-18', count: 20 },
  { stage: 'interviewed', date: '2024-10-30', count: 14 },
  { stage: 'selected', date: '2024-11-08', count: 5 },
  { stage: 'offered', date: '2024-11-12', count: 4 },
  { stage: 'joined', date: '2024-11-28', count: 3 }]

},
{
  id: 'POS-006',
  position: 'PE Teacher',
  dept: 'Physical Education',
  roleType: 'Teaching',
  applied: 22,
  screened: 18,
  shortlisted: 10,
  interviewed: 7,
  selected: 3,
  offered: 2,
  joined: 2,
  branch: 'south',
  openDate: '2024-10-15',
  targetDate: '2024-12-25',
  recruiter: 'HR Admin',
  urgency: 'Low',
  avgDaysPerStage: {
    appliedToScreened: 2.5,
    screenedToShortlisted: 4.8,
    shortlistedToInterviewed: 5.2,
    interviewedToSelected: 3.5,
    selectedToOffered: 1.5,
    offeredToJoined: 14.2
  },
  stageHistory: [
  { stage: 'applied', date: '2024-10-20', count: 22 },
  { stage: 'screened', date: '2024-10-28', count: 18 },
  { stage: 'shortlisted', date: '2024-11-05', count: 10 },
  { stage: 'interviewed', date: '2024-11-12', count: 7 },
  { stage: 'selected', date: '2024-11-18', count: 3 },
  { stage: 'offered', date: '2024-11-22', count: 2 },
  { stage: 'joined', date: '2024-12-05', count: 2 }]

},
{
  id: 'POS-007',
  position: 'Art Teacher',
  dept: 'Arts',
  roleType: 'Teaching',
  applied: 18,
  screened: 12,
  shortlisted: 7,
  interviewed: 5,
  selected: 2,
  offered: 2,
  joined: 1,
  branch: 'east',
  openDate: '2024-11-01',
  targetDate: '2025-01-15',
  recruiter: 'HR Admin',
  urgency: 'Low',
  avgDaysPerStage: {
    appliedToScreened: 4.0,
    screenedToShortlisted: 6.8,
    shortlistedToInterviewed: 8.5,
    interviewedToSelected: 5.5,
    selectedToOffered: 3.0,
    offeredToJoined: 22.0
  },
  stageHistory: [
  { stage: 'applied', date: '2024-11-05', count: 18 },
  { stage: 'screened', date: '2024-11-12', count: 12 },
  { stage: 'shortlisted', date: '2024-11-22', count: 7 },
  { stage: 'interviewed', date: '2024-12-02', count: 5 },
  { stage: 'selected', date: '2024-12-10', count: 2 },
  { stage: 'offered', date: '2024-12-15', count: 2 },
  { stage: 'joined', date: '2025-01-08', count: 1 }]

},
{
  id: 'POS-008',
  position: 'Librarian',
  dept: 'Library',
  roleType: 'Non-Teaching',
  applied: 30,
  screened: 24,
  shortlisted: 14,
  interviewed: 9,
  selected: 4,
  offered: 3,
  joined: 2,
  branch: 'main',
  openDate: '2024-10-20',
  targetDate: '2024-12-30',
  recruiter: 'HR Admin',
  urgency: 'Medium',
  avgDaysPerStage: {
    appliedToScreened: 3.2,
    screenedToShortlisted: 5.5,
    shortlistedToInterviewed: 6.5,
    interviewedToSelected: 4.0,
    selectedToOffered: 2.0,
    offeredToJoined: 17.5
  },
  stageHistory: [
  { stage: 'applied', date: '2024-10-25', count: 30 },
  { stage: 'screened', date: '2024-11-02', count: 24 },
  { stage: 'shortlisted', date: '2024-11-12', count: 14 },
  { stage: 'interviewed', date: '2024-11-22', count: 9 },
  { stage: 'selected', date: '2024-11-30', count: 4 },
  { stage: 'offered', date: '2024-12-05', count: 3 },
  { stage: 'joined', date: '2024-12-22', count: 2 }]

}];


const stages = [
'applied',
'screened',
'shortlisted',
'interviewed',
'selected',
'offered',
'joined'] as
const;

type Stage = (typeof stages)[number];

const stageColors: Record<Stage, string> = {
  applied: 'bg-blue-500',
  screened: 'bg-indigo-500',
  shortlisted: 'bg-violet-500',
  interviewed: 'bg-purple-500',
  selected: 'bg-pink-500',
  offered: 'bg-rose-500',
  joined: 'bg-green-500'
};

const stageLabels: Record<Stage, string> = {
  applied: 'Applied',
  screened: 'Screened',
  shortlisted: 'Shortlisted',
  interviewed: 'Interviewed',
  selected: 'Selected',
  offered: 'Offered',
  joined: 'Joined'
};

const stageTransitions = [
{ from: 'applied', to: 'screened', label: 'Applied → Screened' },
{ from: 'screened', to: 'shortlisted', label: 'Screened → Shortlisted' },
{ from: 'shortlisted', to: 'interviewed', label: 'Shortlisted → Interviewed' },
{ from: 'interviewed', to: 'selected', label: 'Interviewed → Selected' },
{ from: 'selected', to: 'offered', label: 'Selected → Offered' },
{ from: 'offered', to: 'joined', label: 'Offered → Joined' }];


type SortField = 'position' | 'dept' | Stage | 'conversion' | 'urgency';
type SortDirection = 'asc' | 'desc';

interface StageDetail {
  stage: Stage;
  candidates: {
    id: string;
    name: string;
    position: string;
    dateEntered: string;
    daysInStage: number;
    status: 'Active' | 'Moved' | 'Dropped';
  }[];
}

export function RecruitmentPipelineReport() {
  // Filter states
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [filterDept, setFilterDept] = useState('all');
  const [filterRoleType, setFilterRoleType] = useState('all');
  const [dateFrom, setDateFrom] = useState('2024-09-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [pipelineData, setPipelineData] = useState<PipelinePosition[]>(initialPipelineData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // UI states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('applied');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PipelinePosition | null>(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<'previous_month' | 'previous_quarter' | 'previous_year'>('previous_month');
  const [isFunnelExpanded, setIsFunnelExpanded] = useState(true);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
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

  // Calculate active branches
  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;

  // Get unique departments
  const departments = useMemo(
    () => [...new Set(pipelineData.map((p) => p.dept))],
    [pipelineData]
  );

  // Filter data
  const filtered = useMemo(() => {
    let result = pipelineData.filter((p) => {
      // Branch filter
      if (!activeBranches.includes(p.branch)) return false;

      // Department filter
      if (filterDept !== 'all' && p.dept !== filterDept) return false;

      // Role type filter
      if (filterRoleType !== 'all' && p.roleType !== filterRoleType) return false;

      // Date filter
      const openDate = new Date(p.openDate);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      if (openDate < fromDate || openDate > toDate) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
        !p.position.toLowerCase().includes(query) &&
        !p.dept.toLowerCase().includes(query) &&
        !p.id.toLowerCase().includes(query))
        {
          return false;
        }
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortField === 'conversion') {
        aVal = a.applied > 0 ? a.joined / a.applied * 100 : 0;
        bVal = b.applied > 0 ? b.joined / b.applied * 100 : 0;
      } else if (sortField === 'urgency') {
        const urgencyOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        aVal = urgencyOrder[a.urgency];
        bVal = urgencyOrder[b.urgency];
      } else if (sortField === 'position' || sortField === 'dept') {
        aVal = a[sortField];
        bVal = b[sortField];
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [pipelineData, activeBranches, filterDept, filterRoleType, dateFrom, dateTo, searchQuery, sortField, sortDirection]);

  // Calculate totals
  const totals = useMemo(() => {
    const t: Record<Stage, number> = {
      applied: 0,
      screened: 0,
      shortlisted: 0,
      interviewed: 0,
      selected: 0,
      offered: 0,
      joined: 0
    };
    filtered.forEach((row) =>
    stages.forEach((s) => {
      t[s] += row[s];
    })
    );
    return t;
  }, [filtered]);

  // Calculate average days per stage
  const avgDaysPerStage = useMemo(() => {
    if (filtered.length === 0) {
      return stageTransitions.map((t) => ({ stage: t.label, days: 0 }));
    }

    const avgDays = {
      'Applied → Screened': 0,
      'Screened → Shortlisted': 0,
      'Shortlisted → Interviewed': 0,
      'Interviewed → Selected': 0,
      'Selected → Offered': 0,
      'Offered → Joined': 0
    };

    const stageKeys: (keyof PipelinePosition['avgDaysPerStage'])[] = [
    'appliedToScreened',
    'screenedToShortlisted',
    'shortlistedToInterviewed',
    'interviewedToSelected',
    'selectedToOffered',
    'offeredToJoined'];


    stageKeys.forEach((key, idx) => {
      const sum = filtered.reduce((acc, p) => acc + p.avgDaysPerStage[key], 0);
      const label = stageTransitions[idx].label;
      avgDays[label as keyof typeof avgDays] = parseFloat((sum / filtered.length).toFixed(1));
    });

    return Object.entries(avgDays).map(([stage, days]) => ({ stage, days }));
  }, [filtered]);

  // Calculate total hiring cycle
  const totalHiringCycle = useMemo(() => {
    return avgDaysPerStage.reduce((sum, item) => sum + item.days, 0).toFixed(1);
  }, [avgDaysPerStage]);

  // Calculate conversion rate
  const conversionRate = useMemo(() => {
    return totals.applied > 0 ? (totals.joined / totals.applied * 100).toFixed(1) : '0';
  }, [totals]);

  // Calculate drop-off rates per stage
  const dropOffRates = useMemo(() => {
    return stages.map((stage, i) => {
      const count = totals[stage];
      const prevCount = i > 0 ? totals[stages[i - 1]] : count;
      const dropOff = i > 0 && prevCount > 0 ? Math.round((prevCount - count) / prevCount * 100) : 0;
      return { stage, count, dropOff };
    });
  }, [totals]);

  // Find bottleneck stage
  const bottleneckStage = useMemo(() => {
    const maxDropOff = dropOffRates.reduce(
      (max, item) => item.dropOff > max.dropOff ? item : max,
      { stage: 'applied' as Stage, dropOff: 0, count: 0 }
    );
    return maxDropOff.dropOff > 0 ? maxDropOff : null;
  }, [dropOffRates]);

  // Get branch name
  const getBranchName = useCallback(
    (id: string) => BRANCHES.find((b) => b.id === id)?.name || id,
    []
  );

  // Toggle row expansion
  const toggleRowExpansion = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => dir === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('desc');
      return field;
    });
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate data update with slight variations
      setPipelineData((prev) =>
      prev.map((p) => ({
        ...p,
        applied: p.applied + Math.floor(Math.random() * 3),
        screened: p.screened + Math.floor(Math.random() * 2)
      }))
      );

      setLastRefreshed(new Date());
      setNotification({ type: 'success', message: 'Data refreshed successfully' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to refresh data' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Export data
  const handleExport = useCallback(
    async (format: string) => {
      setIsExporting(true);
      setShowExportMenu(false);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const exportData = filtered.map((p) => ({
          id: p.id,
          position: p.position,
          department: p.dept,
          roleType: p.roleType,
          branch: getBranchName(p.branch),
          applied: p.applied,
          screened: p.screened,
          shortlisted: p.shortlisted,
          interviewed: p.interviewed,
          selected: p.selected,
          offered: p.offered,
          joined: p.joined,
          conversionRate: p.applied > 0 ? (p.joined / p.applied * 100).toFixed(1) + '%' : '0%',
          openDate: p.openDate,
          targetDate: p.targetDate,
          urgency: p.urgency,
          recruiter: p.recruiter
        }));

        let content: string;
        let filename: string;
        let mimeType: string;

        switch (format) {
          case 'csv':
            const headers = Object.keys(exportData[0]).join(',');
            const rows = exportData.map((row) =>
            Object.values(row).
            map((v) => `"${v}"`).
            join(',')
            );
            content = [headers, ...rows].join('\n');
            filename = `recruitment-pipeline-${academicYear}-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            break;

          case 'json':
            content = JSON.stringify(
              {
                exportDate: new Date().toISOString(),
                academicYear,
                period: { from: dateFrom, to: dateTo },
                totals,
                conversionRate: conversionRate + '%',
                avgHiringCycle: totalHiringCycle + ' days',
                data: exportData
              },
              null,
              2
            );
            filename = `recruitment-pipeline-${academicYear}-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
            break;

          case 'pdf':
            setNotification({ type: 'success', message: 'PDF report generated and downloading...' });
            setIsExporting(false);
            return;

          case 'excel':
            // Simulate Excel export
            content = [
            Object.keys(exportData[0]).join('\t'),
            ...exportData.map((row) => Object.values(row).join('\t'))].
            join('\n');
            filename = `recruitment-pipeline-${academicYear}-${new Date().toISOString().split('T')[0]}.xls`;
            mimeType = 'application/vnd.ms-excel';
            break;

          default:
            throw new Error('Unsupported format');
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setNotification({
          type: 'success',
          message: `Exported ${filtered.length} positions to ${format.toUpperCase()}`
        });
      } catch (error) {
        setNotification({ type: 'error', message: 'Export failed. Please try again.' });
      } finally {
        setIsExporting(false);
      }
    },
    [filtered, academicYear, dateFrom, dateTo, totals, conversionRate, totalHiringCycle, getBranchName]
  );

  // Print report
  const handlePrint = useCallback(() => {
    window.print();
    setNotification({ type: 'info', message: 'Print dialog opened' });
  }, []);

  // Share report
  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}/reports/pipeline?year=${academicYear}&from=${dateFrom}&to=${dateTo}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setNotification({ type: 'success', message: 'Report link copied to clipboard' });
    });
  }, [academicYear, dateFrom, dateTo]);

  // Send report via email
  const handleEmailReport = useCallback(() => {
    const subject = encodeURIComponent(`Recruitment Pipeline Report - ${academicYear}`);
    const body = encodeURIComponent(
      `Please find the recruitment pipeline report for ${academicYear}.\n\nSummary:\n- Total Applications: ${totals.applied}\n- Total Joined: ${totals.joined}\n- Conversion Rate: ${conversionRate}%\n- Avg Hiring Cycle: ${totalHiringCycle} days`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setNotification({ type: 'info', message: 'Email client opened' });
  }, [academicYear, totals, conversionRate, totalHiringCycle]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedBranches(['all']);
    setFilterDept('all');
    setFilterRoleType('all');
    setDateFrom('2024-09-01');
    setDateTo('2024-12-31');
    setSearchQuery('');
    setSortField('applied');
    setSortDirection('desc');
    setNotification({ type: 'info', message: 'All filters cleared' });
  }, []);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      !selectedBranches.includes('all') ||
      filterDept !== 'all' ||
      filterRoleType !== 'all' ||
      searchQuery.trim() !== '' ||
      dateFrom !== '2024-09-01' ||
      dateTo !== '2024-12-31');

  }, [selectedBranches, filterDept, filterRoleType, searchQuery, dateFrom, dateTo]);

  // View stage details
  const viewStageDetails = useCallback((stage: Stage) => {
    setSelectedStage(stage);
    setShowStageModal(true);
  }, []);

  // View position details
  const viewPositionDetails = useCallback((position: PipelinePosition) => {
    setSelectedPosition(position);
    setShowPositionModal(true);
  }, []);

  // Generate comparison data
  const comparisonData = useMemo(() => {
    // Simulated comparison data
    const multipliers: Record<typeof comparisonPeriod, number> = {
      previous_month: 0.85,
      previous_quarter: 0.75,
      previous_year: 0.6
    };

    const multiplier = multipliers[comparisonPeriod];

    return {
      current: totals,
      previous: Object.fromEntries(
        stages.map((s) => [s, Math.round(totals[s] * multiplier)])
      ) as Record<Stage, number>,
      changes: Object.fromEntries(
        stages.map((s) => {
          const prev = Math.round(totals[s] * multiplier);
          const change = prev > 0 ? ((totals[s] - prev) / prev * 100).toFixed(1) : '0';
          return [s, parseFloat(change)];
        })
      ) as Record<Stage, number>
    };
  }, [totals, comparisonPeriod]);

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'text-red-700 bg-red-100';
      case 'High':
        return 'text-orange-700 bg-orange-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'Low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :

    <ChevronDown className="w-3 h-3 text-blue-600" />;

  };

  return (
    <div className="space-y-6 pb-8">
      {/* Notification */}
      {notification &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-md ${
        notification.type === 'success' ?
        'bg-green-100 text-green-800' :
        notification.type === 'error' ?
        'bg-red-100 text-red-800' :
        notification.type === 'warning' ?
        'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'}`
        }>

          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruitment Pipeline Report</h1>
              <p className="text-sm text-gray-500">
                Stage-wise analysis with drop-off and conversion rates
                {lastRefreshed &&
                <span className="ml-2 text-xs text-gray-400">
                    Last updated: {lastRefreshed.toLocaleTimeString()}
                  </span>
                }
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />


            {/* Export dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting || filtered.length === 0}>

                {isExporting ?
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> :

                <Download className="w-4 h-4 mr-1" />
                }
                Export
              </Button>
              {showExportMenu &&
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
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

            <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>

            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>

            <Button variant="outline" size="sm" onClick={handleEmailReport}>
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </div>
        </div>

        {/* Branch filter */}
        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branches:</span>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) ||
            branch.id !== 'all' && selectedBranches.includes('all') ?
            'bg-blue-600 text-white' :
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

        {/* Additional filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2">

                <X className="w-4 h-4 text-gray-400" />
              </button>
            }
          </div>

          <Select
            label=""
            options={[
            { value: 'all', label: 'All Departments' },
            ...departments.map((d) => ({ value: d, label: d }))]
            }
            value={filterDept}
            onChange={setFilterDept}
            className="w-44" />


          <Select
            label=""
            options={ROLE_TYPES}
            value={filterRoleType}
            onChange={setFilterRoleType}
            className="w-40" />


          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />

            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />

          </div>

          {hasActiveFilters &&
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          }

          <Button variant="outline" size="sm" onClick={() => setShowComparisonModal(true)}>
            <Activity className="w-4 h-4 mr-1" />
            Compare Periods
          </Button>
        </div>
      </Card>

      {/* Loading overlay */}
      {isLoading &&
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-700">Refreshing data...</span>
          </div>
        </div>
      }

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewStageDetails('applied')}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totals.applied}</p>
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-xs text-blue-600 mt-1">Click to view details</p>
        </Card>

        <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewStageDetails('joined')}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">{totals.joined}</p>
          <p className="text-sm text-gray-500">Total Joined</p>
          <p className="text-xs text-green-600 mt-1">Click to view details</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-700">{conversionRate}%</p>
          <p className="text-sm text-gray-500">Conversion Rate</p>
          {bottleneckStage &&
          <p className="text-xs text-orange-600 mt-1">
              Bottleneck: {stageLabels[bottleneckStage.stage]} ({bottleneckStage.dropOff}% drop)
            </p>
          }
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-700">{totalHiringCycle}d</p>
          <p className="text-sm text-gray-500">Avg. Hiring Cycle</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.length} positions</p>
        </Card>
      </div>

      {/* Overall Pipeline Funnel */}
      <Card
        title={
        <div className="flex items-center justify-between w-full">
            <span>Overall Pipeline Funnel</span>
            <button onClick={() => setIsFunnelExpanded(!isFunnelExpanded)}>
              {isFunnelExpanded ?
            <Minimize2 className="w-4 h-4 text-gray-500" /> :

            <Maximize2 className="w-4 h-4 text-gray-500" />
            }
            </button>
          </div>
        }>

        {isFunnelExpanded &&
        <>
            <div className="space-y-3 py-2">
              {stages.map((stage, i) => {
              const count = totals[stage];
              const prevCount = i > 0 ? totals[stages[i - 1]] : count;
              const dropOff =
              i > 0 && prevCount > 0 ? Math.round((prevCount - count) / prevCount * 100) : 0;
              const width = totals.applied > 0 ? `${count / totals.applied * 100}%` : '0%';

              return (
                <div
                  key={stage}
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => viewStageDetails(stage)}>

                    <span className="text-sm text-gray-600 w-28 flex-shrink-0 font-medium group-hover:text-blue-600">
                      {stageLabels[stage]}
                    </span>
                    <div className="flex-1 h-10 bg-gray-100 rounded-xl overflow-hidden">
                      <div
                      className={`h-full ${stageColors[stage]} rounded-xl flex items-center justify-end pr-4 transition-all group-hover:opacity-80`}
                      style={{ width }}>

                        <span className="text-white text-sm font-bold">{count}</span>
                      </div>
                    </div>
                    <div className="w-32 text-right flex-shrink-0 flex items-center justify-end gap-2">
                      {i > 0 &&
                    <span
                      className={`text-xs font-medium ${
                      dropOff > 40 ?
                      'text-red-600' :
                      dropOff > 20 ?
                      'text-orange-600' :
                      'text-green-600'}`
                      }>

                          {dropOff > 0 ?
                      <>
                              <TrendingDown className="w-3 h-3 inline mr-1" />
                              {dropOff}% drop
                            </> :

                      '—'
                      }
                        </span>
                    }
                      <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>);

            })}
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
              <span>
                Overall conversion: <span className="font-bold text-gray-900">{conversionRate}%</span>
              </span>
              <span>
                Period: {dateFrom} to {dateTo}
              </span>
            </div>
          </>
        }
      </Card>

      {/* Position-wise Table */}
      <Card title={`Position-wise Pipeline Breakdown (${filtered.length} positions)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium w-8"></th>
                <th
                  className="text-left py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('position')}>

                  <div className="flex items-center gap-1">
                    Position {renderSortIndicator('position')}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('dept')}>

                  <div className="flex items-center gap-1">
                    Department {renderSortIndicator('dept')}
                  </div>
                </th>
                {stages.map((s) =>
                <th
                  key={s}
                  className="text-center py-3 px-3 text-gray-500 font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort(s)}>

                    <div className="flex items-center justify-center gap-1">
                      {stageLabels[s]} {renderSortIndicator(s)}
                    </div>
                  </th>
                )}
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('conversion')}>

                  <div className="flex items-center justify-center gap-1">
                    Conv. % {renderSortIndicator('conversion')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('urgency')}>

                  <div className="flex items-center justify-center gap-1">
                    Urgency {renderSortIndicator('urgency')}
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ?
              <tr>
                  <td colSpan={12} className="py-8 text-center text-gray-400">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No positions found matching your filters</p>
                    {hasActiveFilters &&
                  <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2">
                        Clear Filters
                      </Button>
                  }
                  </td>
                </tr> :

              filtered.map((row) =>
              <React.Fragment key={row.id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <button
                      onClick={() => toggleRowExpansion(row.id)}
                      className="p-1 hover:bg-gray-200 rounded">

                          {expandedRows.has(row.id) ?
                      <ChevronDown className="w-4 h-4 text-gray-500" /> :

                      <ChevronRight className="w-4 h-4 text-gray-500" />
                      }
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{row.position}</p>
                        <p className="text-xs text-gray-400">{getBranchName(row.branch)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600">{row.dept}</p>
                        <p className="text-xs text-gray-400">{row.roleType}</p>
                      </td>
                      {stages.map((s) =>
                  <td key={s} className="py-3 px-3 text-center">
                          <span
                      className={`text-sm font-medium ${
                      s === 'joined' ? 'text-green-700' : 'text-gray-900'}`
                      }>

                            {row[s]}
                          </span>
                        </td>
                  )}
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-bold text-purple-700">
                          {row.applied > 0 ? (row.joined / row.applied * 100).toFixed(1) : 0}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getUrgencyColor(
                        row.urgency
                      )}`}>

                          {row.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button variant="outline" size="xs" onClick={() => viewPositionDetails(row)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded row details */}
                    {expandedRows.has(row.id) &&
                <tr className="bg-gray-50">
                        <td colSpan={12} className="py-4 px-8">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Position Details</h4>
                              <div className="space-y-1 text-xs">
                                <p>
                                  <span className="text-gray-500">ID:</span> {row.id}
                                </p>
                                <p>
                                  <span className="text-gray-500">Open Date:</span> {row.openDate}
                                </p>
                                <p>
                                  <span className="text-gray-500">Target Date:</span> {row.targetDate}
                                </p>
                                <p>
                                  <span className="text-gray-500">Recruiter:</span> {row.recruiter}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Stage Duration (Avg Days)
                              </h4>
                              <div className="space-y-1 text-xs">
                                <p>
                                  Applied → Screened:{' '}
                                  <span className="font-medium">
                                    {row.avgDaysPerStage.appliedToScreened}d
                                  </span>
                                </p>
                                <p>
                                  Screened → Shortlisted:{' '}
                                  <span className="font-medium">
                                    {row.avgDaysPerStage.screenedToShortlisted}d
                                  </span>
                                </p>
                                <p>
                                  Shortlisted → Interviewed:{' '}
                                  <span className="font-medium">
                                    {row.avgDaysPerStage.shortlistedToInterviewed}d
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Drop-off Analysis</h4>
                              <div className="space-y-1 text-xs">
                                {stages.slice(1).map((s, i) => {
                            const prev = row[stages[i]];
                            const curr = row[s];
                            const dropOff =
                            prev > 0 ? Math.round((prev - curr) / prev * 100) : 0;
                            return (
                              <p key={s}>
                                      {stageLabels[stages[i]]} → {stageLabels[s]}:{' '}
                                      <span
                                  className={`font-medium ${
                                  dropOff > 40 ?
                                  'text-red-600' :
                                  dropOff > 20 ?
                                  'text-orange-600' :
                                  'text-green-600'}`
                                  }>

                                        {dropOff}% drop
                                      </span>
                                    </p>);

                          })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                }
                  </React.Fragment>
              )
              }

              {filtered.length > 0 &&
              <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-gray-900" colSpan={2}>
                    Total ({filtered.length} positions)
                  </td>
                  {stages.map((s) =>
                <td key={s} className="py-3 px-3 text-center text-gray-900">
                      {totals[s]}
                    </td>
                )}
                  <td className="py-3 px-4 text-center text-purple-700 font-bold">{conversionRate}%</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Avg Days per Stage */}
      <Card title="Average Days in Each Stage">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {avgDaysPerStage.map((item, i) => {
            const isBottleneck =
            item.days === Math.max(...avgDaysPerStage.map((a) => a.days)) && item.days > 0;
            return (
              <div
                key={i}
                className={`p-4 rounded-xl text-center ${
                isBottleneck ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`
                }>

                <p className={`text-2xl font-bold ${isBottleneck ? 'text-orange-700' : 'text-blue-700'}`}>
                  {item.days}d
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.stage}</p>
                {isBottleneck &&
                <p className="text-xs text-orange-600 mt-1 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Slowest
                  </p>
                }
              </div>);

          })}
        </div>
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-sm text-gray-500">
            Total Average Hiring Cycle: <span className="font-bold text-gray-900">{totalHiringCycle} days</span>
          </p>
        </div>
      </Card>

      {/* Stage Detail Modal */}
      {showStageModal && selectedStage &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stageColors[selectedStage]}`} />
                {stageLabels[selectedStage]} Stage Details
              </h2>
              <button onClick={() => setShowStageModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{totals[selectedStage]}</p>
                  <p className="text-sm text-gray-500">Total in Stage</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {totals.applied > 0 ?
                  (totals[selectedStage] / totals.applied * 100).toFixed(1) :
                  0}
                    %
                  </p>
                  <p className="text-sm text-gray-500">of Total Applications</p>
                </div>
              </div>

              <h3 className="font-medium text-gray-700 mb-3">Breakdown by Position</h3>
              <div className="space-y-2">
                {filtered.
              filter((p) => p[selectedStage] > 0).
              sort((a, b) => b[selectedStage] - a[selectedStage]).
              map((p) =>
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <div>
                        <p className="font-medium text-gray-900">{p.position}</p>
                        <p className="text-xs text-gray-500">
                          {p.dept} · {getBranchName(p.branch)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{p[selectedStage]}</p>
                        <p className="text-xs text-gray-400">
                          {p.applied > 0 ? (p[selectedStage] / p.applied * 100).toFixed(0) : 0}% of
                          applied
                        </p>
                      </div>
                    </div>
              )}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowStageModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Position Detail Modal */}
      {showPositionModal && selectedPosition &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{selectedPosition.position}</h2>
                <p className="text-sm text-gray-500">
                  {selectedPosition.dept} · {getBranchName(selectedPosition.branch)}
                </p>
              </div>
              <button onClick={() => setShowPositionModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedPosition.applied}</p>
                  <p className="text-sm text-gray-500">Applied</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedPosition.joined}</p>
                  <p className="text-sm text-gray-500">Joined</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedPosition.applied > 0 ?
                  (selectedPosition.joined / selectedPosition.applied * 100).toFixed(1) :
                  0}
                    %
                  </p>
                  <p className="text-sm text-gray-500">Conversion</p>
                </div>
              </div>

              <h3 className="font-medium text-gray-700 mb-3">Pipeline Flow</h3>
              <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
                {stages.map((s, i) =>
              <React.Fragment key={s}>
                    <div className="flex flex-col items-center min-w-16">
                      <div
                    className={`w-10 h-10 rounded-full ${stageColors[s]} flex items-center justify-center text-white font-bold text-sm`}>

                        {selectedPosition[s]}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stageLabels[s]}</p>
                    </div>
                    {i < stages.length - 1 &&
                <div className="flex flex-col items-center mx-2">
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                        <p className="text-xs text-red-500">
                          -
                          {selectedPosition[stages[i]] > 0 ?
                    Math.round(
                      (selectedPosition[stages[i]] - selectedPosition[stages[i + 1]]) /
                      selectedPosition[stages[i]] *
                      100
                    ) :
                    0}
                          %
                        </p>
                      </div>
                }
                  </React.Fragment>
              )}
              </div>

              <h3 className="font-medium text-gray-700 mb-3">Position Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Open Date</p>
                  <p className="font-medium">{selectedPosition.openDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Target Date</p>
                  <p className="font-medium">{selectedPosition.targetDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Recruiter</p>
                  <p className="font-medium">{selectedPosition.recruiter}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Urgency</p>
                  <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getUrgencyColor(
                    selectedPosition.urgency
                  )}`}>

                    {selectedPosition.urgency}
                  </span>
                </div>
              </div>

              <h3 className="font-medium text-gray-700 mt-6 mb-3">Stage Duration</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {Object.entries(selectedPosition.avgDaysPerStage).map(([key, days]) => {
                const label = key.
                replace(/([A-Z])/g, ' $1').
                replace('To', ' → ').
                trim();
                return (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-blue-600">{days}d</p>
                      <p className="text-xs text-gray-500 capitalize">{label}</p>
                    </div>);

              })}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowPositionModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Comparison Modal */}
      {showComparisonModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Period Comparison</h2>
              <button onClick={() => setShowComparisonModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <Select
                label="Compare with"
                options={[
                { value: 'previous_month', label: 'Previous Month' },
                { value: 'previous_quarter', label: 'Previous Quarter' },
                { value: 'previous_year', label: 'Previous Year' }]
                }
                value={comparisonPeriod}
                onChange={(v) => setComparisonPeriod(v as typeof comparisonPeriod)}
                className="w-48" />

              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Stage</th>
                      <th className="text-center py-3 px-4 font-medium">Current</th>
                      <th className="text-center py-3 px-4 font-medium">Previous</th>
                      <th className="text-center py-3 px-4 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stage) => {
                    const change = comparisonData.changes[stage];
                    return (
                      <tr key={stage} className="border-b">
                          <td className="py-3 px-4 font-medium">{stageLabels[stage]}</td>
                          <td className="py-3 px-4 text-center">{comparisonData.current[stage]}</td>
                          <td className="py-3 px-4 text-center">{comparisonData.previous[stage]}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                            className={`flex items-center justify-center gap-1 ${
                            change > 0 ?
                            'text-green-600' :
                            change < 0 ?
                            'text-red-600' :
                            'text-gray-500'}`
                            }>

                              {change > 0 ?
                            <TrendingUp className="w-4 h-4" /> :
                            change < 0 ?
                            <TrendingDown className="w-4 h-4" /> :

                            <Minus className="w-4 h-4" />
                            }
                              {change > 0 ? '+' : ''}
                              {change}%
                            </span>
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Summary</h4>
                <p className="text-sm text-blue-700">
                  Compared to the {comparisonPeriod.replace('_', ' ')}, applications have{' '}
                  {comparisonData.changes.applied > 0 ? 'increased' : 'decreased'} by{' '}
                  {Math.abs(comparisonData.changes.applied)}% and hiring has{' '}
                  {comparisonData.changes.joined > 0 ? 'improved' : 'declined'} by{' '}
                  {Math.abs(comparisonData.changes.joined)}%.
                </p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowComparisonModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Click outside handlers */}
      {showExportMenu && <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />}
    </div>);

}