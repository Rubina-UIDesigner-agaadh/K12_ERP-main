import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Building,
  X,
  Clock,
  TrendingDown,
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  Printer,
  Share2,
  Mail,
  Settings,
  Edit2,
  Save,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Minus,
  ChevronRight,
  Filter,
  PieChart,
  LineChart } from
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


interface PositionMetrics {
  id: string;
  position: string;
  dept: string;
  branch: string;
  roleType: 'Teaching' | 'Non-Teaching';
  reqToApproval: number;
  approvalToPosting: number;
  postingToInterview: number;
  interviewToOffer: number;
  offerToJoining: number;
  total: number;
  hireCount: number;
  openDate: string;
  closeDate: string;
  recruiter: string;
  status: 'Open' | 'Closed' | 'On Hold';
  trend: 'improving' | 'stable' | 'declining';
  historicalData: {
    month: string;
    total: number;
  }[];
}

interface BenchmarkSettings {
  reqToApproval: number;
  approvalToPosting: number;
  postingToInterview: number;
  interviewToOffer: number;
  offerToJoining: number;
  total: number;
}

const initialBenchmarks: BenchmarkSettings = {
  reqToApproval: 3,
  approvalToPosting: 2,
  postingToInterview: 10,
  interviewToOffer: 5,
  offerToJoining: 15,
  total: 35
};

const initialPositionMetrics: PositionMetrics[] = [
{
  id: 'POS-001',
  position: 'Math Teacher',
  dept: 'Mathematics',
  branch: 'main',
  roleType: 'Teaching',
  reqToApproval: 3,
  approvalToPosting: 2,
  postingToInterview: 12,
  interviewToOffer: 5,
  offerToJoining: 18,
  total: 40,
  hireCount: 3,
  openDate: '2024-10-01',
  closeDate: '2024-11-10',
  recruiter: 'HR Admin',
  status: 'Closed',
  trend: 'stable',
  historicalData: [
  { month: 'Sep 2024', total: 42 },
  { month: 'Oct 2024', total: 40 },
  { month: 'Nov 2024', total: 40 }]

},
{
  id: 'POS-002',
  position: 'Science HOD',
  dept: 'Science',
  branch: 'main',
  roleType: 'Teaching',
  reqToApproval: 5,
  approvalToPosting: 3,
  postingToInterview: 15,
  interviewToOffer: 7,
  offerToJoining: 21,
  total: 51,
  hireCount: 1,
  openDate: '2024-09-15',
  closeDate: '2024-11-05',
  recruiter: 'Senior HR',
  status: 'Closed',
  trend: 'declining',
  historicalData: [
  { month: 'Sep 2024', total: 45 },
  { month: 'Oct 2024', total: 48 },
  { month: 'Nov 2024', total: 51 }]

},
{
  id: 'POS-003',
  position: 'Admin Officer',
  dept: 'Administration',
  branch: 'north',
  roleType: 'Non-Teaching',
  reqToApproval: 2,
  approvalToPosting: 1,
  postingToInterview: 10,
  interviewToOffer: 4,
  offerToJoining: 14,
  total: 31,
  hireCount: 2,
  openDate: '2024-10-10',
  closeDate: '2024-11-10',
  recruiter: 'HR Admin',
  status: 'Closed',
  trend: 'improving',
  historicalData: [
  { month: 'Sep 2024', total: 38 },
  { month: 'Oct 2024', total: 35 },
  { month: 'Nov 2024', total: 31 }]

},
{
  id: 'POS-004',
  position: 'CS Teacher',
  dept: 'Computer Science',
  branch: 'east',
  roleType: 'Teaching',
  reqToApproval: 4,
  approvalToPosting: 2,
  postingToInterview: 14,
  interviewToOffer: 6,
  offerToJoining: 20,
  total: 46,
  hireCount: 2,
  openDate: '2024-10-05',
  closeDate: '2024-11-20',
  recruiter: 'Tech HR',
  status: 'Closed',
  trend: 'stable',
  historicalData: [
  { month: 'Sep 2024', total: 47 },
  { month: 'Oct 2024', total: 46 },
  { month: 'Nov 2024', total: 46 }]

},
{
  id: 'POS-005',
  position: 'English Teacher',
  dept: 'English',
  branch: 'south',
  roleType: 'Teaching',
  reqToApproval: 3,
  approvalToPosting: 2,
  postingToInterview: 11,
  interviewToOffer: 5,
  offerToJoining: 16,
  total: 37,
  hireCount: 2,
  openDate: '2024-09-25',
  closeDate: '2024-11-01',
  recruiter: 'HR Admin',
  status: 'Closed',
  trend: 'improving',
  historicalData: [
  { month: 'Sep 2024', total: 42 },
  { month: 'Oct 2024', total: 39 },
  { month: 'Nov 2024', total: 37 }]

},
{
  id: 'POS-006',
  position: 'PE Teacher',
  dept: 'Physical Education',
  branch: 'south',
  roleType: 'Teaching',
  reqToApproval: 2,
  approvalToPosting: 1,
  postingToInterview: 8,
  interviewToOffer: 3,
  offerToJoining: 12,
  total: 26,
  hireCount: 1,
  openDate: '2024-10-15',
  closeDate: '2024-11-10',
  recruiter: 'HR Admin',
  status: 'Closed',
  trend: 'improving',
  historicalData: [
  { month: 'Sep 2024', total: 32 },
  { month: 'Oct 2024', total: 29 },
  { month: 'Nov 2024', total: 26 }]

},
{
  id: 'POS-007',
  position: 'Librarian',
  dept: 'Library',
  branch: 'main',
  roleType: 'Non-Teaching',
  reqToApproval: 2,
  approvalToPosting: 1,
  postingToInterview: 9,
  interviewToOffer: 4,
  offerToJoining: 14,
  total: 30,
  hireCount: 1,
  openDate: '2024-10-20',
  closeDate: '',
  recruiter: 'HR Admin',
  status: 'Open',
  trend: 'stable',
  historicalData: [
  { month: 'Sep 2024', total: 30 },
  { month: 'Oct 2024', total: 30 },
  { month: 'Nov 2024', total: 30 }]

},
{
  id: 'POS-008',
  position: 'Lab Assistant',
  dept: 'Science',
  branch: 'east',
  roleType: 'Non-Teaching',
  reqToApproval: 2,
  approvalToPosting: 1,
  postingToInterview: 7,
  interviewToOffer: 3,
  offerToJoining: 10,
  total: 23,
  hireCount: 2,
  openDate: '2024-11-01',
  closeDate: '2024-11-24',
  recruiter: 'HR Admin',
  status: 'Closed',
  trend: 'improving',
  historicalData: [
  { month: 'Sep 2024', total: 28 },
  { month: 'Oct 2024', total: 25 },
  { month: 'Nov 2024', total: 23 }]

}];


const phaseConfig = [
{
  key: 'reqToApproval' as const,
  label: 'Requisition → Approval',
  shortLabel: 'Req→Approval',
  color: 'bg-blue-500',
  textColor: 'text-blue-700',
  bgLight: 'bg-blue-100'
},
{
  key: 'approvalToPosting' as const,
  label: 'Approval → Posting',
  shortLabel: 'Approval→Post',
  color: 'bg-indigo-500',
  textColor: 'text-indigo-700',
  bgLight: 'bg-indigo-100'
},
{
  key: 'postingToInterview' as const,
  label: 'Posting → Interview',
  shortLabel: 'Post→Interview',
  color: 'bg-violet-500',
  textColor: 'text-violet-700',
  bgLight: 'bg-violet-100'
},
{
  key: 'interviewToOffer' as const,
  label: 'Interview → Offer',
  shortLabel: 'Interview→Offer',
  color: 'bg-purple-500',
  textColor: 'text-purple-700',
  bgLight: 'bg-purple-100'
},
{
  key: 'offerToJoining' as const,
  label: 'Offer → Joining',
  shortLabel: 'Offer→Joining',
  color: 'bg-pink-500',
  textColor: 'text-pink-700',
  bgLight: 'bg-pink-100'
}];


type PhaseKey = typeof phaseConfig[number]['key'];
type SortField = 'position' | 'dept' | PhaseKey | 'total' | 'hireCount' | 'status';
type SortDirection = 'asc' | 'desc';

export function TimeToHireAnalytics() {
  // Filter states
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [filterDept, setFilterDept] = useState('all');
  const [filterRoleType, setFilterRoleType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('2024-09-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [positionMetrics, setPositionMetrics] = useState<PositionMetrics[]>(initialPositionMetrics);
  const [benchmarks, setBenchmarks] = useState<BenchmarkSettings>(initialBenchmarks);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // UI states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sortField, setSortField] = useState<SortField>('total');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedPosition, setSelectedPosition] = useState<PositionMetrics | null>(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<typeof phaseConfig[number] | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [editedBenchmarks, setEditedBenchmarks] = useState<BenchmarkSettings>(initialBenchmarks);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<'previous_month' | 'previous_quarter' | 'previous_year'>('previous_month');
  const [showTrendModal, setShowTrendModal] = useState(false);

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
    () => [...new Set(positionMetrics.map((p) => p.dept))],
    [positionMetrics]
  );

  // Filter and sort data
  const filtered = useMemo(() => {
    let result = positionMetrics.filter((p) => {
      // Branch filter
      if (!activeBranches.includes(p.branch)) return false;

      // Department filter
      if (filterDept !== 'all' && p.dept !== filterDept) return false;

      // Role type filter
      if (filterRoleType !== 'all' && p.roleType !== filterRoleType) return false;

      // Status filter
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;

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
        !p.id.toLowerCase().includes(query) &&
        !p.recruiter.toLowerCase().includes(query))
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

      if (sortField === 'position' || sortField === 'dept' || sortField === 'status') {
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
  }, [positionMetrics, activeBranches, filterDept, filterRoleType, filterStatus, dateFrom, dateTo, searchQuery, sortField, sortDirection]);

  // Calculate average metrics
  const avgMetrics = useMemo(() => {
    if (filtered.length === 0) return null;

    const avg = (key: keyof PositionMetrics) =>
    Math.round(
      filtered.reduce((s, r) => s + (r[key] as number), 0) / filtered.length * 10
    ) / 10;

    return {
      reqToApproval: avg('reqToApproval'),
      approvalToPosting: avg('approvalToPosting'),
      postingToInterview: avg('postingToInterview'),
      interviewToOffer: avg('interviewToOffer'),
      offerToJoining: avg('offerToJoining'),
      total: avg('total'),
      hireCount: Math.round(filtered.reduce((s, r) => s + r.hireCount, 0))
    };
  }, [filtered]);

  // Calculate phase statistics
  const phaseStats = useMemo(() => {
    return phaseConfig.map((phase) => {
      const values = filtered.map((p) => p[phase.key]);
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      const min = values.length > 0 ? Math.min(...values) : 0;
      const max = values.length > 0 ? Math.max(...values) : 0;
      const benchmark = benchmarks[phase.key];
      const withinBenchmark = values.filter((v) => v <= benchmark).length;
      const percentage = values.length > 0 ? withinBenchmark / values.length * 100 : 0;

      return {
        ...phase,
        avg: Math.round(avg * 10) / 10,
        min,
        max,
        benchmark,
        withinBenchmark,
        total: values.length,
        percentage: Math.round(percentage)
      };
    });
  }, [filtered, benchmarks]);

  // Find bottleneck phase
  const bottleneckPhase = useMemo(() => {
    if (phaseStats.length === 0) return null;

    const overBenchmark = phaseStats.filter((p) => p.avg > p.benchmark);
    if (overBenchmark.length === 0) return null;

    return overBenchmark.reduce((max, p) =>
    p.avg - p.benchmark > max.avg - max.benchmark ? p : max
    );
  }, [phaseStats]);

  // Get trend analysis
  const trendAnalysis = useMemo(() => {
    const improving = filtered.filter((p) => p.trend === 'improving').length;
    const stable = filtered.filter((p) => p.trend === 'stable').length;
    const declining = filtered.filter((p) => p.trend === 'declining').length;

    return { improving, stable, declining, total: filtered.length };
  }, [filtered]);

  // Get branch name
  const getBranchName = useCallback(
    (id: string) => BRANCHES.find((b) => b.id === id)?.name || id,
    []
  );

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => dir === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

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

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate slight variations in data
      setPositionMetrics((prev) =>
      prev.map((p) => ({
        ...p,
        reqToApproval: Math.max(1, p.reqToApproval + Math.floor(Math.random() * 3) - 1),
        total: p.total + Math.floor(Math.random() * 5) - 2
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
          branch: getBranchName(p.branch),
          roleType: p.roleType,
          reqToApproval: p.reqToApproval,
          approvalToPosting: p.approvalToPosting,
          postingToInterview: p.postingToInterview,
          interviewToOffer: p.interviewToOffer,
          offerToJoining: p.offerToJoining,
          totalDays: p.total,
          hireCount: p.hireCount,
          status: p.status,
          trend: p.trend,
          recruiter: p.recruiter,
          openDate: p.openDate,
          closeDate: p.closeDate || 'N/A'
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
            filename = `time-to-hire-${academicYear}-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            break;

          case 'json':
            content = JSON.stringify(
              {
                exportDate: new Date().toISOString(),
                academicYear,
                period: { from: dateFrom, to: dateTo },
                benchmarks,
                averages: avgMetrics,
                data: exportData
              },
              null,
              2
            );
            filename = `time-to-hire-${academicYear}-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
            break;

          case 'pdf':
            setNotification({ type: 'success', message: 'PDF report generated and downloading...' });
            setIsExporting(false);
            return;

          case 'excel':
            content = [
            Object.keys(exportData[0]).join('\t'),
            ...exportData.map((row) => Object.values(row).join('\t'))].
            join('\n');
            filename = `time-to-hire-${academicYear}-${new Date().toISOString().split('T')[0]}.xls`;
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
    [filtered, academicYear, dateFrom, dateTo, benchmarks, avgMetrics, getBranchName]
  );

  // Print report
  const handlePrint = useCallback(() => {
    window.print();
    setNotification({ type: 'info', message: 'Print dialog opened' });
  }, []);

  // Share report
  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}/reports/time-to-hire?year=${academicYear}&from=${dateFrom}&to=${dateTo}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setNotification({ type: 'success', message: 'Report link copied to clipboard' });
    });
  }, [academicYear, dateFrom, dateTo]);

  // Email report
  const handleEmailReport = useCallback(() => {
    const subject = encodeURIComponent(`Time-to-Hire Analytics Report - ${academicYear}`);
    const body = encodeURIComponent(
      `Time-to-Hire Analytics Report\n\nPeriod: ${dateFrom} to ${dateTo}\n\n` +
      `Summary:\n` +
      `- Positions Analyzed: ${filtered.length}\n` +
      `- Average Hiring Cycle: ${avgMetrics?.total || 0} days\n` +
      `- Benchmark: ${benchmarks.total} days\n` +
      `- Total Hires: ${avgMetrics?.hireCount || 0}\n\n` +
      `Phase Breakdown:\n` +
      phaseStats.map((p) => `- ${p.label}: ${p.avg} days (benchmark: ${p.benchmark}d)`).join('\n')
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setNotification({ type: 'info', message: 'Email client opened' });
  }, [academicYear, dateFrom, dateTo, filtered.length, avgMetrics, benchmarks, phaseStats]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedBranches(['all']);
    setFilterDept('all');
    setFilterRoleType('all');
    setFilterStatus('all');
    setDateFrom('2024-09-01');
    setDateTo('2024-12-31');
    setSearchQuery('');
    setSortField('total');
    setSortDirection('asc');
    setNotification({ type: 'info', message: 'All filters cleared' });
  }, []);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      !selectedBranches.includes('all') ||
      filterDept !== 'all' ||
      filterRoleType !== 'all' ||
      filterStatus !== 'all' ||
      searchQuery.trim() !== '' ||
      dateFrom !== '2024-09-01' ||
      dateTo !== '2024-12-31');

  }, [selectedBranches, filterDept, filterRoleType, filterStatus, searchQuery, dateFrom, dateTo]);

  // View position details
  const viewPositionDetails = useCallback((position: PositionMetrics) => {
    setSelectedPosition(position);
    setShowPositionModal(true);
  }, []);

  // View phase details
  const viewPhaseDetails = useCallback((phase: typeof phaseConfig[number]) => {
    setSelectedPhase(phase);
    setShowPhaseModal(true);
  }, []);

  // Open benchmark settings
  const openBenchmarkSettings = useCallback(() => {
    setEditedBenchmarks({ ...benchmarks });
    setShowBenchmarkModal(true);
  }, [benchmarks]);

  // Save benchmark settings
  const saveBenchmarks = useCallback(() => {
    setBenchmarks({ ...editedBenchmarks });
    setShowBenchmarkModal(false);
    setNotification({ type: 'success', message: 'Benchmark settings saved' });
  }, [editedBenchmarks]);

  // Generate comparison data
  const comparisonData = useMemo(() => {
    const multipliers: Record<typeof comparisonPeriod, number> = {
      previous_month: 1.1,
      previous_quarter: 1.2,
      previous_year: 1.35
    };

    const multiplier = multipliers[comparisonPeriod];

    if (!avgMetrics) return null;

    const previous = {
      reqToApproval: Math.round(avgMetrics.reqToApproval * multiplier * 10) / 10,
      approvalToPosting: Math.round(avgMetrics.approvalToPosting * multiplier * 10) / 10,
      postingToInterview: Math.round(avgMetrics.postingToInterview * multiplier * 10) / 10,
      interviewToOffer: Math.round(avgMetrics.interviewToOffer * multiplier * 10) / 10,
      offerToJoining: Math.round(avgMetrics.offerToJoining * multiplier * 10) / 10,
      total: Math.round(avgMetrics.total * multiplier * 10) / 10
    };

    const changes = Object.fromEntries(
      Object.keys(previous).map((key) => {
        const k = key as keyof typeof previous;
        const prev = previous[k];
        const curr = avgMetrics[k] as number;
        const change = prev > 0 ? Math.round((curr - prev) / prev * 100 * 10) / 10 : 0;
        return [k, change];
      })
    ) as Record<keyof typeof previous, number>;

    return { current: avgMetrics, previous, changes };
  }, [avgMetrics, comparisonPeriod]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'text-blue-700 bg-blue-100';
      case 'Closed':
        return 'text-green-700 bg-green-100';
      case 'On Hold':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Get trend icon and color
  const getTrendDisplay = (trend: string) => {
    switch (trend) {
      case 'improving':
        return { icon: TrendingDown, color: 'text-green-600', label: 'Improving' };
      case 'declining':
        return { icon: TrendingUp, color: 'text-red-600', label: 'Declining' };
      default:
        return { icon: Minus, color: 'text-gray-500', label: 'Stable' };
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-purple-600" /> :

    <ChevronDown className="w-3 h-3 text-purple-600" />;

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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Time-to-Hire / Turnaround Analytics</h1>
              <p className="text-sm text-gray-500">
                Measure hiring cycle efficiency across all stages
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

            <Button variant="outline" size="sm" onClick={openBenchmarkSettings}>
              <Settings className="w-4 h-4 mr-1" />
              Benchmarks
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
            'bg-purple-600 text-white' :
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
              placeholder="Search positions, recruiters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />

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


          <Select
            label=""
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Open', label: 'Open' },
            { value: 'Closed', label: 'Closed' },
            { value: 'On Hold', label: 'On Hold' }]
            }
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-36" />


          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />

            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />

          </div>

          {hasActiveFilters &&
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          }
        </div>

        {/* Quick action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowComparisonModal(true)}>
            <Activity className="w-4 h-4 mr-1" />
            Compare Periods
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTrendModal(true)}>
            <LineChart className="w-4 h-4 mr-1" />
            View Trends
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmailReport}>
            <Mail className="w-4 h-4 mr-1" />
            Email Report
          </Button>
        </div>
      </Card>

      {/* Loading overlay */}
      {isLoading &&
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
            <span className="text-gray-700">Refreshing data...</span>
          </div>
        </div>
      }

      {/* Average Metrics Summary */}
      {avgMetrics &&
      <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {phaseConfig.map((phase) => {
            const stat = phaseStats.find((s) => s.key === phase.key);
            const val = stat?.avg || 0;
            const benchmark = benchmarks[phase.key];
            const isOver = val > benchmark;
            const isBottleneck = bottleneckPhase?.key === phase.key;

            return (
              <Card
                key={phase.key}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                isBottleneck ? 'ring-2 ring-red-300' : ''}`
                }
                onClick={() => viewPhaseDetails(phase)}>

                  <div
                  className={`w-10 h-10 rounded-lg ${
                  isOver ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center mb-3`
                  }>

                    {isOver ?
                  <TrendingUp className="w-5 h-5 text-red-600" /> :

                  <TrendingDown className="w-5 h-5 text-green-600" />
                  }
                  </div>
                  <p className={`text-2xl font-bold ${isOver ? 'text-red-700' : 'text-green-700'}`}>
                    {val}d
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                    {phase.label.split('→')[0].trim()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Benchmark: {benchmark}d</p>
                  {isBottleneck &&
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Bottleneck
                    </p>
                }
                  <p className="text-xs text-purple-600 mt-1">Click to view details</p>
                </Card>);

          })}
          </div>

          {/* Total Avg */}
          <Card className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Total Hiring Cycle</p>
                  <p className="text-4xl font-bold text-purple-700">{avgMetrics.total} days</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Hires</p>
                  <p className="text-2xl font-bold text-gray-900">{avgMetrics.hireCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Positions</p>
                  <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Benchmark</p>
                <p className="text-2xl font-bold text-gray-400">{benchmarks.total} days</p>
                <p
                className={`text-sm font-medium mt-1 ${
                avgMetrics.total <= benchmarks.total ? 'text-green-600' : 'text-red-600'}`
                }>

                  {avgMetrics.total <= benchmarks.total ?
                <>
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {benchmarks.total - avgMetrics.total}d below benchmark
                    </> :

                <>
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      {avgMetrics.total - benchmarks.total}d above benchmark
                    </>
                }
                </p>
              </div>
            </div>

            {/* Trend summary */}
            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-lg font-bold">{trendAnalysis.improving}</span>
                </div>
                <p className="text-xs text-gray-500">Improving</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Minus className="w-4 h-4" />
                  <span className="text-lg font-bold">{trendAnalysis.stable}</span>
                </div>
                <p className="text-xs text-gray-500">Stable</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-red-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-lg font-bold">{trendAnalysis.declining}</span>
                </div>
                <p className="text-xs text-gray-500">Declining</p>
              </div>
            </div>
          </Card>
        </>
      }

      {/* Phase Breakdown Chart */}
      <Card title={`Phase-wise Time Breakdown by Position (${filtered.length} positions)`}>
        {filtered.length === 0 ?
        <div className="py-12 text-center text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No positions found matching your filters</p>
            {hasActiveFilters &&
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2">
                Clear Filters
              </Button>
          }
          </div> :

        <div className="space-y-4">
            {filtered.map((pos) => {
            const trendDisplay = getTrendDisplay(pos.trend);
            const TrendIcon = trendDisplay.icon;

            return (
              <div
                key={pos.id}
                className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => viewPositionDetails(pos)}>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{pos.position}</p>
                        <p className="text-xs text-gray-400">
                          {pos.dept} · {getBranchName(pos.branch)} · {pos.recruiter}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(pos.status)}`}>
                        {pos.status}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${trendDisplay.color}`}>
                        <TrendIcon className="w-3 h-3" />
                        {trendDisplay.label}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold text-purple-700">{pos.total}d total</p>
                        <p
                        className={`text-xs font-medium ${
                        pos.total <= benchmarks.total ? 'text-green-600' : 'text-orange-600'}`
                        }>

                          {pos.total <= benchmarks.total ? 'Within benchmark' : 'Above benchmark'}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Stacked bar */}
                  <div className="h-6 rounded-full overflow-hidden flex">
                    {phaseConfig.map((phase) =>
                  <div
                    key={phase.key}
                    className={`${phase.color} flex items-center justify-center transition-all hover:opacity-80`}
                    style={{ width: `${pos[phase.key] / pos.total * 100}%` }}
                    title={`${phase.label}: ${pos[phase.key]}d`}>

                        {pos[phase.key] >= 3 &&
                    <span className="text-white text-xs font-bold">{pos[phase.key]}</span>
                    }
                      </div>
                  )}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">
                    {phaseConfig.map((phase) => {
                    const isOverPhase = pos[phase.key] > benchmarks[phase.key];
                    return (
                      <div key={phase.key} className="flex items-center gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${phase.color}`}></div>
                          <span className="text-xs text-gray-500">
                            {phase.label.split('→')[0].trim()}:{' '}
                            <span className={`font-medium ${isOverPhase ? 'text-red-600' : phase.textColor}`}>
                              {pos[phase.key]}d
                            </span>
                          </span>
                        </div>);

                  })}
                  </div>
                </div>);

          })}
          </div>
        }
      </Card>

      {/* Detailed Table */}
      <Card title="Detailed Time-to-Hire Table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 w-8"></th>
                <th
                  className="text-left py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-purple-600"
                  onClick={() => handleSort('position')}>

                  <div className="flex items-center gap-1">
                    Position {renderSortIndicator('position')}
                  </div>
                </th>
                {phaseConfig.map((phase) =>
                <th
                  key={phase.key}
                  className="text-center py-3 px-3 text-gray-500 font-medium cursor-pointer hover:text-purple-600"
                  onClick={() => handleSort(phase.key)}>

                    <div className="flex items-center justify-center gap-1">
                      {phase.shortLabel} {renderSortIndicator(phase.key)}
                    </div>
                  </th>
                )}
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-purple-600"
                  onClick={() => handleSort('total')}>

                  <div className="flex items-center justify-center gap-1">
                    Total {renderSortIndicator('total')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-purple-600"
                  onClick={() => handleSort('hireCount')}>

                  <div className="flex items-center justify-center gap-1">
                    Hires {renderSortIndicator('hireCount')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-purple-600"
                  onClick={() => handleSort('status')}>

                  <div className="flex items-center justify-center gap-1">
                    Status {renderSortIndicator('status')}
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ?
              <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-400">
                    No positions found
                  </td>
                </tr> :

              filtered.map((pos) => {
                const trendDisplay = getTrendDisplay(pos.trend);
                const TrendIcon = trendDisplay.icon;

                return (
                  <React.Fragment key={pos.id}>
                      <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <button
                          onClick={() => toggleRowExpansion(pos.id)}
                          className="p-1 hover:bg-gray-200 rounded">

                            {expandedRows.has(pos.id) ?
                          <ChevronDown className="w-4 h-4 text-gray-500" /> :

                          <ChevronRight className="w-4 h-4 text-gray-500" />
                          }
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium text-gray-900">{pos.position}</p>
                              <p className="text-xs text-gray-400">{getBranchName(pos.branch)}</p>
                            </div>
                            <TrendIcon className={`w-4 h-4 ${trendDisplay.color}`} />
                          </div>
                        </td>
                        {phaseConfig.map((phase) => {
                        const val = pos[phase.key];
                        const isOver = val > benchmarks[phase.key];
                        return (
                          <td key={phase.key} className="py-3 px-3 text-center">
                              <span className={`font-medium ${isOver ? 'text-red-600' : 'text-green-700'}`}>
                                {val}d
                              </span>
                            </td>);

                      })}
                        <td className="py-3 px-4 text-center">
                          <span
                          className={`font-bold text-lg ${
                          pos.total <= benchmarks.total ? 'text-green-700' : 'text-orange-700'}`
                          }>

                            {pos.total}d
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">{pos.hireCount}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pos.status)}`}>
                            {pos.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="outline" size="xs" onClick={() => viewPositionDetails(pos)}>
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {expandedRows.has(pos.id) &&
                    <tr className="bg-gray-50">
                          <td colSpan={10} className="py-4 px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Position Details</h4>
                                <div className="space-y-1 text-xs">
                                  <p>
                                    <span className="text-gray-500">ID:</span> {pos.id}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Department:</span> {pos.dept}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Role Type:</span> {pos.roleType}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Recruiter:</span> {pos.recruiter}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                                <div className="space-y-1 text-xs">
                                  <p>
                                    <span className="text-gray-500">Open Date:</span> {pos.openDate}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Close Date:</span>{' '}
                                    {pos.closeDate || 'Still Open'}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Hires:</span> {pos.hireCount} candidates
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Historical Trend</h4>
                                <div className="flex items-end gap-2 h-16">
                                  {pos.historicalData.map((data, idx) =>
                              <div key={idx} className="flex-1 flex flex-col items-center">
                                      <div
                                  className="w-full bg-purple-500 rounded-t"
                                  style={{ height: `${data.total / 60 * 100}%` }}
                                  title={`${data.month}: ${data.total}d`} />

                                      <span className="text-xs text-gray-400 mt-1">
                                        {data.month.split(' ')[0]}
                                      </span>
                                    </div>
                              )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                    }
                    </React.Fragment>);

              })
              }

              {filtered.length > 0 && avgMetrics &&
              <tr className="bg-purple-50 font-semibold">
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-purple-900">Average ({filtered.length} positions)</td>
                  {phaseConfig.map((phase) =>
                <td key={phase.key} className="py-3 px-3 text-center text-purple-700">
                      {avgMetrics[phase.key]}d
                    </td>
                )}
                  <td className="py-3 px-4 text-center text-purple-900 font-bold text-lg">
                    {avgMetrics.total}d
                  </td>
                  <td className="py-3 px-4 text-center text-purple-900">{avgMetrics.hireCount}</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 px-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            Within benchmark
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            Above benchmark
          </span>
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-green-600" />
            Improving
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-red-600" />
            Declining
          </span>
        </div>
      </Card>

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
              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedPosition.total}d</p>
                  <p className="text-sm text-gray-500">Total Days</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedPosition.hireCount}</p>
                  <p className="text-sm text-gray-500">Hires</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{benchmarks.total}d</p>
                  <p className="text-sm text-gray-500">Benchmark</p>
                </div>
                <div
                className={`p-4 rounded-lg text-center ${
                selectedPosition.total <= benchmarks.total ? 'bg-green-50' : 'bg-red-50'}`
                }>

                  <p
                  className={`text-2xl font-bold ${
                  selectedPosition.total <= benchmarks.total ? 'text-green-600' : 'text-red-600'}`
                  }>

                    {selectedPosition.total <= benchmarks.total ? '-' : '+'}
                    {Math.abs(selectedPosition.total - benchmarks.total)}d
                  </p>
                  <p className="text-sm text-gray-500">vs Benchmark</p>
                </div>
              </div>

              {/* Phase breakdown */}
              <h3 className="font-medium text-gray-700 mb-3">Phase-wise Breakdown</h3>
              <div className="space-y-3 mb-6">
                {phaseConfig.map((phase) => {
                const val = selectedPosition[phase.key];
                const benchmark = benchmarks[phase.key];
                const isOver = val > benchmark;
                const width = val / selectedPosition.total * 100;

                return (
                  <div key={phase.key} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-40 flex-shrink-0">{phase.label}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${phase.color} rounded-full flex items-center justify-end pr-2`}
                        style={{ width: `${width}%` }}>

                          <span className="text-white text-xs font-bold">{val}d</span>
                        </div>
                      </div>
                      <span
                      className={`text-sm font-medium w-24 text-right ${isOver ? 'text-red-600' : 'text-green-600'}`}>

                        {isOver ? `+${val - benchmark}d` : `${val - benchmark}d`}
                      </span>
                    </div>);

              })}
              </div>

              {/* Position info */}
              <h3 className="font-medium text-gray-700 mb-3">Position Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Role Type</p>
                  <p className="font-medium">{selectedPosition.roleType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Recruiter</p>
                  <p className="font-medium">{selectedPosition.recruiter}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Open Date</p>
                  <p className="font-medium">{selectedPosition.openDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Close Date</p>
                  <p className="font-medium">{selectedPosition.closeDate || 'Still Open'}</p>
                </div>
              </div>

              {/* Historical trend */}
              <h3 className="font-medium text-gray-700 mb-3">Historical Trend</h3>
              <div className="flex items-end gap-4 h-32 p-4 bg-gray-50 rounded-lg">
                {selectedPosition.historicalData.map((data, idx) =>
              <div key={idx} className="flex-1 flex flex-col items-center">
                    <span className="text-xs font-medium text-purple-700 mb-1">{data.total}d</span>
                    <div
                  className="w-full bg-purple-500 rounded-t transition-all"
                  style={{ height: `${data.total / 60 * 100}%` }} />

                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
              )}
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

      {/* Phase Detail Modal */}
      {showPhaseModal && selectedPhase &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${selectedPhase.color}`} />
                <h2 className="text-lg font-bold">{selectedPhase.label}</h2>
              </div>
              <button onClick={() => setShowPhaseModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {(() => {
              const stat = phaseStats.find((s) => s.key === selectedPhase.key);
              if (!stat) return null;

              return (
                <>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className={`text-2xl font-bold ${selectedPhase.textColor}`}>{stat.avg}d</p>
                        <p className="text-sm text-gray-500">Average</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{stat.min}d</p>
                        <p className="text-sm text-gray-500">Minimum</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-600">{stat.max}d</p>
                        <p className="text-sm text-gray-500">Maximum</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{stat.benchmark}d</p>
                        <p className="text-sm text-gray-500">Benchmark</p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg mb-6">
                      <p className="text-sm text-blue-800">
                        <strong>{stat.withinBenchmark}</strong> out of <strong>{stat.total}</strong> positions (
                        {stat.percentage}%) are within the benchmark of {stat.benchmark} days.
                      </p>
                    </div>

                    <h3 className="font-medium text-gray-700 mb-3">Position Breakdown</h3>
                    <div className="space-y-2">
                      {filtered.
                    slice().
                    sort((a, b) => a[selectedPhase.key] - b[selectedPhase.key]).
                    map((p) => {
                      const val = p[selectedPhase.key];
                      const isOver = val > stat.benchmark;

                      return (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{p.position}</p>
                                <p className="text-xs text-gray-500">{p.dept}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`font-bold ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                                  {val}d
                                </span>
                                {isOver ?
                            <AlertCircle className="w-4 h-4 text-red-500" /> :

                            <CheckCircle className="w-4 h-4 text-green-500" />
                            }
                              </div>
                            </div>);

                    })}
                    </div>
                  </>);

            })()}
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowPhaseModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Benchmark Settings Modal */}
      {showBenchmarkModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Benchmark Settings</h2>
              <button onClick={() => setShowBenchmarkModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {phaseConfig.map((phase) =>
            <div key={phase.key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">{phase.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                  type="number"
                  min="1"
                  value={editedBenchmarks[phase.key]}
                  onChange={(e) =>
                  setEditedBenchmarks((prev) => ({
                    ...prev,
                    [phase.key]: parseInt(e.target.value) || 1
                  }))
                  }
                  className="w-20 px-3 py-2 border rounded-lg text-sm text-center" />

                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
            )}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">Total Benchmark</label>
                  <div className="flex items-center gap-2">
                    <input
                    type="number"
                    min="1"
                    value={editedBenchmarks.total}
                    onChange={(e) =>
                    setEditedBenchmarks((prev) => ({
                      ...prev,
                      total: parseInt(e.target.value) || 1
                    }))
                    }
                    className="w-20 px-3 py-2 border rounded-lg text-sm text-center font-bold" />

                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBenchmarkModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveBenchmarks}>
                <Save className="w-4 h-4 mr-1" />
                Save Benchmarks
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Comparison Modal */}
      {showComparisonModal && comparisonData &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                      <th className="text-left py-3 px-4 font-medium">Phase</th>
                      <th className="text-center py-3 px-4 font-medium">Current</th>
                      <th className="text-center py-3 px-4 font-medium">Previous</th>
                      <th className="text-center py-3 px-4 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phaseConfig.map((phase) => {
                    const change = comparisonData.changes[phase.key];
                    return (
                      <tr key={phase.key} className="border-b">
                          <td className="py-3 px-4 font-medium">{phase.label}</td>
                          <td className="py-3 px-4 text-center">{comparisonData.current[phase.key]}d</td>
                          <td className="py-3 px-4 text-center">{comparisonData.previous[phase.key]}d</td>
                          <td className="py-3 px-4 text-center">
                            <span
                            className={`flex items-center justify-center gap-1 ${
                            change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-500'}`
                            }>

                              {change < 0 ?
                            <TrendingDown className="w-4 h-4" /> :
                            change > 0 ?
                            <TrendingUp className="w-4 h-4" /> :

                            <Minus className="w-4 h-4" />
                            }
                              {change > 0 ? '+' : ''}
                              {change}%
                            </span>
                          </td>
                        </tr>);

                  })}
                    <tr className="bg-purple-50 font-semibold">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4 text-center">{comparisonData.current.total}d</td>
                      <td className="py-3 px-4 text-center">{comparisonData.previous.total}d</td>
                      <td className="py-3 px-4 text-center">
                        <span
                        className={`flex items-center justify-center gap-1 ${
                        comparisonData.changes.total < 0 ? 'text-green-600' : 'text-red-600'}`
                        }>

                          {comparisonData.changes.total < 0 ?
                        <TrendingDown className="w-4 h-4" /> :

                        <TrendingUp className="w-4 h-4" />
                        }
                          {comparisonData.changes.total > 0 ? '+' : ''}
                          {comparisonData.changes.total}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Summary</h4>
                <p className="text-sm text-purple-700">
                  Compared to the {comparisonPeriod.replace(/_/g, ' ')}, the overall hiring cycle has{' '}
                  {comparisonData.changes.total < 0 ? 'improved' : 'increased'} by{' '}
                  {Math.abs(comparisonData.changes.total)}%.
                  {comparisonData.changes.total < 0 ?
                ' Great progress on reducing time-to-hire!' :
                ' Consider reviewing processes to reduce delays.'}
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

      {/* Trend Modal */}
      {showTrendModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Hiring Trends Analysis</h2>
              <button onClick={() => setShowTrendModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {/* Trend summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{trendAnalysis.improving}</p>
                  <p className="text-sm text-gray-500">Improving</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Minus className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">{trendAnalysis.stable}</p>
                  <p className="text-sm text-gray-500">Stable</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{trendAnalysis.declining}</p>
                  <p className="text-sm text-gray-500">Declining</p>
                </div>
              </div>

              {/* Positions by trend */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Improving Positions
                  </h3>
                  <div className="space-y-2">
                    {filtered.
                  filter((p) => p.trend === 'improving').
                  map((p) =>
                  <div key={p.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{p.position}</p>
                            <p className="text-xs text-gray-500">{p.dept}</p>
                          </div>
                          <span className="font-bold text-green-600">{p.total}d</span>
                        </div>
                  )}
                    {filtered.filter((p) => p.trend === 'improving').length === 0 &&
                  <p className="text-sm text-gray-500">No improving positions</p>
                  }
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Declining Positions
                  </h3>
                  <div className="space-y-2">
                    {filtered.
                  filter((p) => p.trend === 'declining').
                  map((p) =>
                  <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{p.position}</p>
                            <p className="text-xs text-gray-500">{p.dept}</p>
                          </div>
                          <span className="font-bold text-red-600">{p.total}d</span>
                        </div>
                  )}
                    {filtered.filter((p) => p.trend === 'declining').length === 0 &&
                  <p className="text-sm text-gray-500">No declining positions</p>
                  }
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowTrendModal(false)}>
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