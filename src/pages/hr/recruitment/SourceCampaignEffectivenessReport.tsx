import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Building,
  X,
  Globe,
  TrendingUp,
  Download,
  RefreshCw,
  Users,
  Star,
  DollarSign,
  BarChart3,
  Target,
  Award,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Printer,
  Copy,
  Calendar,
  ArrowUpDown,
  Info,
  PieChart,
  TrendingDown,
  Zap,
  Settings,
  MoreVertical,
  ExternalLink } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

// Types
interface SourceData {
  id: string;
  source: string;
  icon: string;
  color: string;
  applications: number;
  shortlisted: number;
  selected: number;
  costPerHire: number;
  branch: string;
  campaignStartDate: string;
  campaignEndDate: string;
  budget: number;
  status: 'active' | 'paused' | 'completed';
  notes: string;
  lastUpdated: string;
}

interface Branch {
  id: string;
  name: string;
}

interface SortConfig {
  key: keyof SourceData | 'conversionRate' | 'effectiveness';
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  search: string;
  minApplications: number | null;
  maxCostPerHire: number | null;
  status: string;
  effectivenessLevel: string;
}

interface DateRange {
  from: string;
  to: string;
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeCharts: boolean;
  includeNotes: boolean;
  selectedSources: string[];
}

// Constants
const BRANCHES: Branch[] = [
{ id: 'all', name: 'All Branches' },
{ id: 'main', name: 'Main Campus' },
{ id: 'north', name: 'North Wing' },
{ id: 'south', name: 'South Wing' },
{ id: 'east', name: 'East Campus' }];


const ACADEMIC_YEARS = [
{ value: '2024-2025', label: '2024-2025' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'active', label: 'Active' },
{ value: 'paused', label: 'Paused' },
{ value: 'completed', label: 'Completed' }];


const EFFECTIVENESS_OPTIONS = [
{ value: 'all', label: 'All Levels' },
{ value: 'excellent', label: 'Excellent' },
{ value: 'good', label: 'Good' },
{ value: 'average', label: 'Average' },
{ value: 'poor', label: 'Poor' }];


const AVAILABLE_ICONS = ['🌐', '💼', '🔗', '👥', '🚶', '📱', '🔍', '🎓', '📧', '📰', '🏢', '🎯'];

const initialSourceData: SourceData[] = [
{
  id: 'src-001',
  source: 'School Website',
  icon: '🌐',
  color: 'blue',
  applications: 85,
  shortlisted: 42,
  selected: 12,
  costPerHire: 0,
  branch: 'main',
  campaignStartDate: '2024-11-01',
  campaignEndDate: '2024-12-31',
  budget: 0,
  status: 'active',
  notes: 'Primary organic source',
  lastUpdated: '2024-12-15T10:30:00'
},
{
  id: 'src-002',
  source: 'Naukri.com',
  icon: '💼',
  color: 'orange',
  applications: 62,
  shortlisted: 28,
  selected: 8,
  costPerHire: 3500,
  branch: 'main',
  campaignStartDate: '2024-11-15',
  campaignEndDate: '2024-12-31',
  budget: 50000,
  status: 'active',
  notes: 'Premium job posting',
  lastUpdated: '2024-12-14T14:20:00'
},
{
  id: 'src-003',
  source: 'LinkedIn',
  icon: '🔗',
  color: 'indigo',
  applications: 45,
  shortlisted: 22,
  selected: 7,
  costPerHire: 2800,
  branch: 'north',
  campaignStartDate: '2024-11-01',
  campaignEndDate: '2024-12-15',
  budget: 35000,
  status: 'completed',
  notes: 'Targeted campaign for senior positions',
  lastUpdated: '2024-12-15T09:00:00'
},
{
  id: 'src-004',
  source: 'Referral',
  icon: '👥',
  color: 'green',
  applications: 28,
  shortlisted: 18,
  selected: 9,
  costPerHire: 1500,
  branch: 'north',
  campaignStartDate: '2024-10-01',
  campaignEndDate: '2024-12-31',
  budget: 20000,
  status: 'active',
  notes: 'Employee referral program with bonus',
  lastUpdated: '2024-12-13T16:45:00'
},
{
  id: 'src-005',
  source: 'Walk-in',
  icon: '🚶',
  color: 'teal',
  applications: 35,
  shortlisted: 12,
  selected: 4,
  costPerHire: 500,
  branch: 'south',
  campaignStartDate: '2024-11-01',
  campaignEndDate: '2024-12-31',
  budget: 5000,
  status: 'active',
  notes: 'Saturday walk-in drives',
  lastUpdated: '2024-12-12T11:30:00'
},
{
  id: 'src-006',
  source: 'Social Media',
  icon: '📱',
  color: 'pink',
  applications: 52,
  shortlisted: 20,
  selected: 5,
  costPerHire: 1200,
  branch: 'south',
  campaignStartDate: '2024-11-10',
  campaignEndDate: '2024-12-31',
  budget: 15000,
  status: 'active',
  notes: 'Facebook and Instagram ads',
  lastUpdated: '2024-12-15T08:00:00'
},
{
  id: 'src-007',
  source: 'Indeed',
  icon: '🔍',
  color: 'purple',
  applications: 38,
  shortlisted: 16,
  selected: 6,
  costPerHire: 2200,
  branch: 'east',
  campaignStartDate: '2024-11-05',
  campaignEndDate: '2024-12-25',
  budget: 25000,
  status: 'paused',
  notes: 'Paused due to budget constraints',
  lastUpdated: '2024-12-10T15:00:00'
},
{
  id: 'src-008',
  source: 'Campus Drive',
  icon: '🎓',
  color: 'amber',
  applications: 22,
  shortlisted: 10,
  selected: 3,
  costPerHire: 4000,
  branch: 'east',
  campaignStartDate: '2024-12-01',
  campaignEndDate: '2024-12-20',
  budget: 30000,
  status: 'completed',
  notes: 'B.Ed college recruitment drive',
  lastUpdated: '2024-12-20T17:00:00'
}];


// Utility Functions
const generateId = (): string => {
  return `src-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const calculateConversionRate = (selected: number, applications: number): number => {
  return applications > 0 ? selected / applications * 100 : 0;
};

const getEffectivenessLevel = (convRate: number): string => {
  if (convRate >= 15) return 'excellent';
  if (convRate >= 10) return 'good';
  if (convRate >= 5) return 'average';
  return 'poor';
};

const getEffectivenessLabel = (level: string): string => {
  const labels: Record<string, string> = {
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor'
  };
  return labels[level] || level;
};

export function SourceCampaignEffectivenessReport() {
  // Core State
  const [sourceData, setSourceData] = useState<SourceData[]>(initialSourceData);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: '2024-11-01',
    to: '2024-12-31'
  });

  // Filter and Sort State
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'applications',
    direction: 'desc'
  });
  const [filters, setFilters] = useState<FilterConfig>({
    search: '',
    minApplications: null,
    maxCostPerHire: null,
    status: 'all',
    effectivenessLevel: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCharts: false,
    includeNotes: true,
    selectedSources: []
  });

  // Modal State
  const [showAddSource, setShowAddSource] = useState(false);
  const [showEditSource, setShowEditSource] = useState(false);
  const [showSourceDetails, setShowSourceDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  // Selected Items State
  const [selectedSource, setSelectedSource] = useState<SourceData | null>(null);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [compareSourceIds, setCompareSourceIds] = useState<string[]>([]);

  // Form State for Add/Edit
  const [formData, setFormData] = useState<Partial<SourceData>>({
    source: '',
    icon: '🌐',
    applications: 0,
    shortlisted: 0,
    selected: 0,
    costPerHire: 0,
    branch: 'main',
    budget: 0,
    status: 'active',
    notes: '',
    campaignStartDate: '',
    campaignEndDate: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Notification State
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Last Actions State
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [lastExport, setLastExport] = useState<Date | null>(null);

  // Computed Values
  const activeBranches = useMemo(() => {
    return selectedBranches.includes('all') ?
    ['main', 'north', 'south', 'east'] :
    selectedBranches;
  }, [selectedBranches]);

  // Filtered and Sorted Data
  const filteredData = useMemo(() => {
    let result = sourceData.filter((s) => activeBranches.includes(s.branch));

    // Apply date range filter
    result = result.filter((s) => {
      const startDate = new Date(s.campaignStartDate);
      const endDate = new Date(s.campaignEndDate);
      const filterStart = new Date(dateRange.from);
      const filterEnd = new Date(dateRange.to);
      return startDate <= filterEnd && endDate >= filterStart;
    });

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
        s.source.toLowerCase().includes(searchLower) ||
        s.notes.toLowerCase().includes(searchLower)
      );
    }

    // Apply minimum applications filter
    if (filters.minApplications !== null) {
      result = result.filter((s) => s.applications >= filters.minApplications!);
    }

    // Apply maximum cost per hire filter
    if (filters.maxCostPerHire !== null) {
      result = result.filter(
        (s) => s.costPerHire === 0 || s.costPerHire <= filters.maxCostPerHire!
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((s) => s.status === filters.status);
    }

    // Apply effectiveness filter
    if (filters.effectivenessLevel !== 'all') {
      result = result.filter((s) => {
        const convRate = calculateConversionRate(s.selected, s.applications);
        return getEffectivenessLevel(convRate) === filters.effectivenessLevel;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      if (sortConfig.key === 'conversionRate') {
        aValue = calculateConversionRate(a.selected, a.applications);
        bValue = calculateConversionRate(b.selected, b.applications);
      } else if (sortConfig.key === 'effectiveness') {
        const aConv = calculateConversionRate(a.selected, a.applications);
        const bConv = calculateConversionRate(b.selected, b.applications);
        aValue = aConv;
        bValue = bConv;
      } else {
        aValue = a[sortConfig.key] as number;
        bValue = b[sortConfig.key] as number;
        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' ?
          aValue.localeCompare(bValue as string) :
          (bValue as string).localeCompare(aValue);
        }
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return result;
  }, [sourceData, activeBranches, dateRange, filters, sortConfig]);

  // Totals
  const totals = useMemo(
    () => ({
      applications: filteredData.reduce((s, r) => s + r.applications, 0),
      shortlisted: filteredData.reduce((s, r) => s + r.shortlisted, 0),
      selected: filteredData.reduce((s, r) => s + r.selected, 0),
      totalBudget: filteredData.reduce((s, r) => s + r.budget, 0),
      avgCost: Math.round(
        filteredData.
        filter((r) => r.costPerHire > 0).
        reduce((s, r) => s + r.costPerHire, 0) /
        Math.max(filteredData.filter((r) => r.costPerHire > 0).length, 1)
      ),
      activeCount: filteredData.filter((r) => r.status === 'active').length,
      pausedCount: filteredData.filter((r) => r.status === 'paused').length,
      completedCount: filteredData.filter((r) => r.status === 'completed').length
    }),
    [filteredData]
  );

  const maxApps = useMemo(
    () => Math.max(...filteredData.map((s) => s.applications), 1),
    [filteredData]
  );

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('sourceReportData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSourceData(parsed);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sourceReportData', JSON.stringify(sourceData));
  }, [sourceData]);

  // Utility Functions
  const getBranchName = (id: string): string =>
  BRANCHES.find((b) => b.id === id)?.name || id;

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ show: true, type, message });
  };

  // Branch Toggle Handler
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

  // Academic Year Change Handler
  const handleAcademicYearChange = (year: string) => {
    setAcademicYear(year);
    // Update date range based on academic year
    const yearStart = year.split('-')[0];
    setDateRange({
      from: `${yearStart}-04-01`,
      to: `${parseInt(yearStart) + 1}-03-31`
    });
    showNotification('info', `Academic year changed to ${year}`);
  };

  // Date Range Handlers
  const handleDateFromChange = (date: string) => {
    if (date > dateRange.to) {
      showNotification('error', 'Start date cannot be after end date');
      return;
    }
    setDateRange((prev) => ({ ...prev, from: date }));
  };

  const handleDateToChange = (date: string) => {
    if (date < dateRange.from) {
      showNotification('error', 'End date cannot be before start date');
      return;
    }
    setDateRange((prev) => ({ ...prev, to: date }));
  };

  const handleResetDateRange = () => {
    setDateRange({ from: '2024-11-01', to: '2024-12-31' });
    showNotification('info', 'Date range reset to default');
  };

  // Sort Handler
  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Filter Handlers
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleFilterChange = (key: keyof FilterConfig, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      minApplications: null,
      maxCostPerHire: null,
      status: 'all',
      effectivenessLevel: 'all'
    });
    showNotification('info', 'All filters cleared');
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.minApplications !== null ||
      filters.maxCostPerHire !== null ||
      filters.status !== 'all' ||
      filters.effectivenessLevel !== 'all');

  }, [filters]);

  // Refresh Data Handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate data update with random variations
      const updatedData = sourceData.map((source) => ({
        ...source,
        applications: source.applications + Math.floor(Math.random() * 5),
        shortlisted: source.shortlisted + Math.floor(Math.random() * 3),
        lastUpdated: new Date().toISOString()
      }));

      setSourceData(updatedData);
      setLastRefresh(new Date());
      showNotification('success', 'Data refreshed successfully');
    } catch (error) {
      showNotification('error', 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Export Handlers
  const handleExport = async () => {
    if (!showExportOptions) {
      setShowExportOptions(true);
      return;
    }

    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataToExport =
      exportOptions.selectedSources.length > 0 ?
      filteredData.filter((s) => exportOptions.selectedSources.includes(s.id)) :
      filteredData;

      switch (exportOptions.format) {
        case 'csv':
          exportAsCSV(dataToExport);
          break;
        case 'excel':
          exportAsExcel(dataToExport);
          break;
        case 'pdf':
          exportAsPDF(dataToExport);
          break;
        case 'json':
          exportAsJSON(dataToExport);
          break;
      }

      setLastExport(new Date());
      setShowExportOptions(false);
      showNotification('success', `Report exported as ${exportOptions.format.toUpperCase()}`);
    } catch (error) {
      showNotification('error', 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = (data: SourceData[]) => {
    const headers = [
    'Source',
    'Branch',
    'Applications',
    'Shortlisted',
    'Selected',
    'Cost Per Hire',
    'Budget',
    'Status',
    'Conversion Rate',
    'Effectiveness',
    ...(exportOptions.includeNotes ? ['Notes'] : [])];


    const rows = data.map((s) => {
      const convRate = calculateConversionRate(s.selected, s.applications);
      return [
      s.source,
      getBranchName(s.branch),
      s.applications,
      s.shortlisted,
      s.selected,
      s.costPerHire,
      s.budget,
      s.status,
      `${convRate.toFixed(1)}%`,
      getEffectivenessLabel(getEffectivenessLevel(convRate)),
      ...(exportOptions.includeNotes ? [`"${s.notes.replace(/"/g, '""')}"`] : [])];

    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csvContent, 'source-effectiveness-report.csv', 'text/csv');
  };

  const exportAsExcel = (data: SourceData[]) => {
    // Simplified Excel export (CSV with .xlsx extension for demo)
    exportAsCSV(data);
    showNotification('info', 'Excel export completed (CSV format)');
  };

  const exportAsPDF = (data: SourceData[]) => {
    // Simplified PDF export - in production, use a library like jsPDF
    const content = data.
    map((s) => {
      const convRate = calculateConversionRate(s.selected, s.applications);
      return `${s.source} | ${s.applications} apps | ${s.selected} selected | ${convRate.toFixed(1)}% conv.`;
    }).
    join('\n');

    const pdfContent = `Source & Campaign Effectiveness Report\n${'='.repeat(50)}\n\nGenerated: ${new Date().toLocaleString()}\nDate Range: ${dateRange.from} to ${dateRange.to}\n\n${content}`;
    downloadFile(pdfContent, 'source-effectiveness-report.txt', 'text/plain');
    showNotification('info', 'PDF export completed (text format for demo)');
  };

  const exportAsJSON = (data: SourceData[]) => {
    const exportData = {
      metadata: {
        reportTitle: 'Source & Campaign Effectiveness Report',
        academicYear,
        dateRange,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length
      },
      summary: totals,
      data: data.map((s) => ({
        ...s,
        conversionRate: calculateConversionRate(s.selected, s.applications),
        effectiveness: getEffectivenessLevel(
          calculateConversionRate(s.selected, s.applications)
        )
      }))
    };
    downloadFile(JSON.stringify(exportData, null, 2), 'source-effectiveness-report.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCancelExport = () => {
    setShowExportOptions(false);
    setExportOptions({
      format: 'csv',
      includeCharts: false,
      includeNotes: true,
      selectedSources: []
    });
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Copy to Clipboard Handler
  const handleCopyToClipboard = async () => {
    const summaryText = `
Source & Campaign Effectiveness Report
Date Range: ${dateRange.from} to ${dateRange.to}
Academic Year: ${academicYear}

Summary:
- Total Applications: ${totals.applications}
- Shortlisted: ${totals.shortlisted}
- Selected: ${totals.selected}
- Average Cost per Hire: ₹${totals.avgCost.toLocaleString()}
- Total Budget: ₹${totals.totalBudget.toLocaleString()}

Top Sources by Selection:
${filteredData.
    sort((a, b) => b.selected - a.selected).
    slice(0, 5).
    map((s, i) => `${i + 1}. ${s.source}: ${s.selected} selected (${calculateConversionRate(s.selected, s.applications).toFixed(1)}% conv.)`).
    join('\n')}
    `.trim();

    try {
      await navigator.clipboard.writeText(summaryText);
      showNotification('success', 'Report summary copied to clipboard');
    } catch (error) {
      showNotification('error', 'Failed to copy to clipboard');
    }
  };

  // Source Selection Handlers
  const handleSelectSource = (sourceId: string) => {
    setSelectedSourceIds((prev) =>
    prev.includes(sourceId) ?
    prev.filter((id) => id !== sourceId) :
    [...prev, sourceId]
    );
  };

  const handleSelectAllSources = () => {
    if (selectedSourceIds.length === filteredData.length) {
      setSelectedSourceIds([]);
    } else {
      setSelectedSourceIds(filteredData.map((s) => s.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedSourceIds([]);
  };

  // View Source Details Handler
  const handleViewDetails = (source: SourceData) => {
    setSelectedSource(source);
    setShowSourceDetails(true);
  };

  const handleCloseDetails = () => {
    setShowSourceDetails(false);
    setSelectedSource(null);
  };

  // Add Source Handlers
  const handleOpenAddSource = () => {
    setFormData({
      source: '',
      icon: '🌐',
      applications: 0,
      shortlisted: 0,
      selected: 0,
      costPerHire: 0,
      branch: 'main',
      budget: 0,
      status: 'active',
      notes: '',
      campaignStartDate: dateRange.from,
      campaignEndDate: dateRange.to
    });
    setFormErrors([]);
    setShowAddSource(true);
  };

  const handleCloseAddSource = () => {
    setShowAddSource(false);
    setFormData({});
    setFormErrors([]);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.source?.trim()) {
      errors.push('Source name is required');
    }

    if (formData.source && sourceData.some((s) => s.source.toLowerCase() === formData.source!.toLowerCase() && s.id !== selectedSource?.id)) {
      errors.push('Source name already exists');
    }

    if (!formData.branch) {
      errors.push('Branch is required');
    }

    if (formData.shortlisted! > formData.applications!) {
      errors.push('Shortlisted cannot exceed applications');
    }

    if (formData.selected! > formData.shortlisted!) {
      errors.push('Selected cannot exceed shortlisted');
    }

    if (formData.campaignStartDate && formData.campaignEndDate) {
      if (formData.campaignStartDate > formData.campaignEndDate) {
        errors.push('Campaign start date cannot be after end date');
      }
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleAddSource = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newSource: SourceData = {
        id: generateId(),
        source: formData.source!,
        icon: formData.icon!,
        color: 'gray',
        applications: formData.applications || 0,
        shortlisted: formData.shortlisted || 0,
        selected: formData.selected || 0,
        costPerHire: formData.costPerHire || 0,
        branch: formData.branch!,
        budget: formData.budget || 0,
        status: formData.status as 'active' | 'paused' | 'completed',
        notes: formData.notes || '',
        campaignStartDate: formData.campaignStartDate || dateRange.from,
        campaignEndDate: formData.campaignEndDate || dateRange.to,
        lastUpdated: new Date().toISOString()
      };

      setSourceData((prev) => [...prev, newSource]);
      handleCloseAddSource();
      showNotification('success', `Source "${newSource.source}" added successfully`);
    } catch (error) {
      showNotification('error', 'Failed to add source');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Source Handlers
  const handleOpenEditSource = (source: SourceData) => {
    setSelectedSource(source);
    setFormData({
      source: source.source,
      icon: source.icon,
      applications: source.applications,
      shortlisted: source.shortlisted,
      selected: source.selected,
      costPerHire: source.costPerHire,
      branch: source.branch,
      budget: source.budget,
      status: source.status,
      notes: source.notes,
      campaignStartDate: source.campaignStartDate,
      campaignEndDate: source.campaignEndDate
    });
    setFormErrors([]);
    setShowEditSource(true);
  };

  const handleCloseEditSource = () => {
    setShowEditSource(false);
    setSelectedSource(null);
    setFormData({});
    setFormErrors([]);
  };

  const handleUpdateSource = async () => {
    if (!validateForm() || !selectedSource) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSourceData((prev) =>
      prev.map((s) =>
      s.id === selectedSource.id ?
      {
        ...s,
        source: formData.source!,
        icon: formData.icon!,
        applications: formData.applications || 0,
        shortlisted: formData.shortlisted || 0,
        selected: formData.selected || 0,
        costPerHire: formData.costPerHire || 0,
        branch: formData.branch!,
        budget: formData.budget || 0,
        status: formData.status as 'active' | 'paused' | 'completed',
        notes: formData.notes || '',
        campaignStartDate: formData.campaignStartDate!,
        campaignEndDate: formData.campaignEndDate!,
        lastUpdated: new Date().toISOString()
      } :
      s
      )
      );
      handleCloseEditSource();
      showNotification('success', 'Source updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update source');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Source Handlers
  const handleOpenDeleteConfirm = (source: SourceData) => {
    setSelectedSource(source);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setSelectedSource(null);
  };

  const handleDeleteSource = async () => {
    if (!selectedSource) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSourceData((prev) => prev.filter((s) => s.id !== selectedSource.id));
      setSelectedSourceIds((prev) => prev.filter((id) => id !== selectedSource.id));
      handleCloseDeleteConfirm();
      showNotification('success', `Source "${selectedSource.source}" deleted`);
    } catch (error) {
      showNotification('error', 'Failed to delete source');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSourceIds.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedSourceIds.length} selected sources?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSourceData((prev) => prev.filter((s) => !selectedSourceIds.includes(s.id)));
      setSelectedSourceIds([]);
      showNotification('success', `${selectedSourceIds.length} sources deleted`);
    } catch (error) {
      showNotification('error', 'Failed to delete sources');
    } finally {
      setIsLoading(false);
    }
  };

  // Compare Sources Handlers
  const handleToggleCompare = (sourceId: string) => {
    setCompareSourceIds((prev) => {
      if (prev.includes(sourceId)) {
        return prev.filter((id) => id !== sourceId);
      }
      if (prev.length >= 4) {
        showNotification('info', 'Maximum 4 sources can be compared at once');
        return prev;
      }
      return [...prev, sourceId];
    });
  };

  const handleOpenCompare = () => {
    if (compareSourceIds.length < 2) {
      showNotification('error', 'Select at least 2 sources to compare');
      return;
    }
    setShowCompareModal(true);
  };

  const handleCloseCompare = () => {
    setShowCompareModal(false);
  };

  const handleClearCompare = () => {
    setCompareSourceIds([]);
  };

  // Insights Handler
  const handleOpenInsights = () => {
    setShowInsightsModal(true);
  };

  const handleCloseInsights = () => {
    setShowInsightsModal(false);
  };

  // Generate insights based on data
  const generateInsights = useMemo(() => {
    const insights: {type: 'positive' | 'negative' | 'neutral';message: string;}[] = [];

    // Best performing source
    const sortedByConversion = [...filteredData].sort(
      (a, b) =>
      calculateConversionRate(b.selected, b.applications) -
      calculateConversionRate(a.selected, a.applications)
    );
    if (sortedByConversion.length > 0) {
      const best = sortedByConversion[0];
      const convRate = calculateConversionRate(best.selected, best.applications);
      insights.push({
        type: 'positive',
        message: `${best.source} has the highest conversion rate at ${convRate.toFixed(1)}%`
      });
    }

    // Most cost-effective source
    const paidSources = filteredData.filter((s) => s.costPerHire > 0 && s.selected > 0);
    if (paidSources.length > 0) {
      const mostEfficient = paidSources.sort((a, b) => a.costPerHire - b.costPerHire)[0];
      insights.push({
        type: 'positive',
        message: `${mostEfficient.source} offers the best value at ₹${mostEfficient.costPerHire.toLocaleString()} per hire`
      });
    }

    // Free sources performance
    const freeSources = filteredData.filter((s) => s.costPerHire === 0);
    const freeSelections = freeSources.reduce((sum, s) => sum + s.selected, 0);
    if (freeSelections > 0) {
      insights.push({
        type: 'positive',
        message: `Free sources (${freeSources.map((s) => s.source).join(', ')}) contributed ${freeSelections} hires at no cost`
      });
    }

    // Underperforming sources
    const poorSources = filteredData.filter((s) => {
      const convRate = calculateConversionRate(s.selected, s.applications);
      return convRate < 5 && s.applications > 10;
    });
    if (poorSources.length > 0) {
      insights.push({
        type: 'negative',
        message: `${poorSources.map((s) => s.source).join(', ')} ${poorSources.length === 1 ? 'has' : 'have'} low conversion rates (<5%). Consider optimization or reallocation.`
      });
    }

    // High cost sources
    const highCostSources = filteredData.filter((s) => s.costPerHire > 3000);
    if (highCostSources.length > 0) {
      insights.push({
        type: 'neutral',
        message: `${highCostSources.length} source(s) have cost per hire above ₹3,000. Review ROI.`
      });
    }

    // Budget utilization
    const totalBudget = filteredData.reduce((sum, s) => sum + s.budget, 0);
    const actualSpend = filteredData.reduce((sum, s) => sum + s.costPerHire * s.selected, 0);
    if (totalBudget > 0) {
      const utilization = actualSpend / totalBudget * 100;
      insights.push({
        type: utilization > 80 ? 'neutral' : 'positive',
        message: `Budget utilization: ${utilization.toFixed(1)}% (₹${actualSpend.toLocaleString()} of ₹${totalBudget.toLocaleString()})`
      });
    }

    // Paused campaigns
    const pausedCount = filteredData.filter((s) => s.status === 'paused').length;
    if (pausedCount > 0) {
      insights.push({
        type: 'neutral',
        message: `${pausedCount} campaign(s) currently paused. Review for reactivation or closure.`
      });
    }

    return insights;
  }, [filteredData]);

  // Duplicate Source Handler
  const handleDuplicateSource = async (source: SourceData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const duplicatedSource: SourceData = {
        ...source,
        id: generateId(),
        source: `${source.source} (Copy)`,
        applications: 0,
        shortlisted: 0,
        selected: 0,
        status: 'active',
        lastUpdated: new Date().toISOString()
      };

      setSourceData((prev) => [...prev, duplicatedSource]);
      showNotification('success', `Source duplicated as "${duplicatedSource.source}"`);
    } catch (error) {
      showNotification('error', 'Failed to duplicate source');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Source Status Handler
  const handleToggleStatus = async (source: SourceData) => {
    const newStatus =
    source.status === 'active' ? 'paused' : source.status === 'paused' ? 'active' : source.status;

    if (source.status === 'completed') {
      showNotification('info', 'Completed campaigns cannot be reactivated');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setSourceData((prev) =>
      prev.map((s) =>
      s.id === source.id ? { ...s, status: newStatus, lastUpdated: new Date().toISOString() } : s
      )
      );
      showNotification('success', `${source.source} ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      showNotification('error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  // Form Field Change Handler
  const handleFormChange = (field: keyof SourceData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors([]);
  };

  // Render sort indicator
  const renderSortIndicator = (key: SortConfig['key']) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ?
    <ChevronUp className="w-4 h-4 text-orange-600" /> :

    <ChevronDown className="w-4 h-4 text-orange-600" />;

  };

  // Compare sources data
  const compareSources = useMemo(() => {
    return sourceData.filter((s) => compareSourceIds.includes(s.id));
  }, [sourceData, compareSourceIds]);

  return (
    <div className="space-y-6 pb-8">
      {/* Notification */}
      {notification.show &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        notification.type === 'success' ?
        'bg-green-50 border border-green-200' :
        notification.type === 'error' ?
        'bg-red-50 border border-red-200' :
        'bg-blue-50 border border-blue-200'}`
        }>

          {notification.type === 'success' ?
        <CheckCircle className="w-5 h-5 text-green-600" /> :
        notification.type === 'error' ?
        <AlertCircle className="w-5 h-5 text-red-600" /> :

        <Info className="w-5 h-5 text-blue-600" />
        }
          <span
          className={
          notification.type === 'success' ?
          'text-green-800' :
          notification.type === 'error' ?
          'text-red-800' :
          'text-blue-800'
          }>

            {notification.message}
          </span>
          <button
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
          className="ml-2 text-gray-500 hover:text-gray-700">

            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Source & Campaign Effectiveness Report
              </h1>
              <p className="text-sm text-gray-500">
                Analyze recruitment channel performance and cost efficiency
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lastRefresh &&
            <span className="text-xs text-gray-500">
                Last refreshed: {lastRefresh.toLocaleTimeString()}
              </span>
            }
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={handleAcademicYearChange}
              className="w-36" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}>

              {isRefreshing ?
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :

              <RefreshCw className="w-4 h-4 mr-1" />
              }
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}>

              {isExporting ?
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :

              <Download className="w-4 h-4 mr-1" />
              }
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {/* Branch Selection */}
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
            'bg-orange-600 text-white' :
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

        {/* Date Range and Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

            <button
              onClick={handleResetDateRange}
              className="text-sm text-gray-500 hover:text-gray-700 underline">

              Reset
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleOpenAddSource}>
              <Plus className="w-4 h-4 mr-1" />
              Add Source
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenInsights}>
              <Zap className="w-4 h-4 mr-1" />
              Insights
            </Button>
            {compareSourceIds.length >= 2 &&
            <Button variant="outline" size="sm" onClick={handleOpenCompare}>
                <BarChart3 className="w-4 h-4 mr-1" />
                Compare ({compareSourceIds.length})
              </Button>
            }
            {compareSourceIds.length > 0 &&
            <button
              onClick={handleClearCompare}
              className="text-sm text-gray-500 hover:text-gray-700">

                Clear compare
              </button>
            }
          </div>
        </div>
      </Card>

      {/* Export Options Modal */}
      {showExportOptions &&
      <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Export Options</h3>
              <p className="text-sm text-gray-500">Configure your export settings</p>
            </div>
            <button onClick={handleCancelExport} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {(['csv', 'excel', 'pdf', 'json'] as const).map((format) =>
          <button
            key={format}
            onClick={() => setExportOptions((prev) => ({ ...prev, format }))}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            exportOptions.format === format ?
            'bg-orange-600 text-white border-orange-600' :
            'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`
            }>

                {format.toUpperCase()}
              </button>
          )}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
              type="checkbox"
              checked={exportOptions.includeNotes}
              onChange={(e) =>
              setExportOptions((prev) => ({ ...prev, includeNotes: e.target.checked }))
              }
              className="rounded" />

              Include notes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
              type="checkbox"
              checked={exportOptions.selectedSources.length > 0}
              onChange={(e) =>
              setExportOptions((prev) => ({
                ...prev,
                selectedSources: e.target.checked ? selectedSourceIds : []
              }))
              }
              className="rounded"
              disabled={selectedSourceIds.length === 0} />

              Selected sources only ({selectedSourceIds.length})
            </label>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleExport} disabled={isExporting}>
              {isExporting ?
            <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </> :

            <>
                  <Download className="w-4 h-4 mr-2" />
                  Export as {exportOptions.format.toUpperCase()}
                </>
            }
            </Button>
            <Button variant="outline" onClick={handleCancelExport}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sources..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

              {filters.search &&
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-4 h-4" />
                </button>
              }
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
              hasActiveFilters ?
              'bg-orange-50 border-orange-300 text-orange-700' :
              'bg-white border-gray-300 text-gray-700'}`
              }>

              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters &&
              <span className="bg-orange-600 text-white text-xs px-1.5 rounded-full">!</span>
              }
            </button>
            {hasActiveFilters &&
            <button
              onClick={handleResetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline">

                Clear all
              </button>
            }
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Showing {filteredData.length} of {sourceData.length} sources
            </span>
          </div>
        </div>

        {showFilters &&
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500">

                {STATUS_OPTIONS.map((opt) =>
              <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effectiveness</label>
              <select
              value={filters.effectivenessLevel}
              onChange={(e) => handleFilterChange('effectivenessLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500">

                {EFFECTIVENESS_OPTIONS.map((opt) =>
              <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
              )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Applications
              </label>
              <input
              type="number"
              value={filters.minApplications || ''}
              onChange={(e) =>
              handleFilterChange(
                'minApplications',
                e.target.value ? parseInt(e.target.value) : null
              )
              }
              placeholder="Any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Cost/Hire</label>
              <input
              type="number"
              value={filters.maxCostPerHire || ''}
              onChange={(e) =>
              handleFilterChange(
                'maxCostPerHire',
                e.target.value ? parseInt(e.target.value) : null
              )
              }
              placeholder="Any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

            </div>
          </div>
        }
      </Card>

      {/* Bulk Actions */}
      {selectedSourceIds.length > 0 &&
      <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-orange-800">
                {selectedSourceIds.length} source(s) selected
              </span>
              <button
              onClick={handleClearSelection}
              className="text-sm text-orange-600 hover:text-orange-800 underline">

                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExportOptions((prev) => ({ ...prev, selectedSources: selectedSourceIds }));
                setShowExportOptions(true);
              }}>

                <Download className="w-4 h-4 mr-1" />
                Export Selected
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isLoading}>

                <Trash2 className="w-4 h-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totals.applications}</p>
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-xs text-gray-400 mt-1">Across {filteredData.length} sources</p>
        </Card>
        <Card className="p-4">
          <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-3">
            <Star className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-700">{totals.shortlisted}</p>
          <p className="text-sm text-gray-500">Shortlisted</p>
          <p className="text-xs text-gray-400 mt-1">
            {totals.applications > 0 ?
            (totals.shortlisted / totals.applications * 100).toFixed(1) :
            0}
            % rate
          </p>
        </Card>
        <Card className="p-4">
          <div className="p-2 bg-green-100 rounded-lg w-fit mb-3">
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{totals.selected}</p>
          <p className="text-sm text-gray-500">Selected</p>
          <p className="text-xs text-gray-400 mt-1">
            {totals.applications > 0 ?
            (totals.selected / totals.applications * 100).toFixed(1) :
            0}
            % conversion
          </p>
        </Card>
        <Card className="p-4">
          <div className="p-2 bg-orange-100 rounded-lg w-fit mb-3">
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-700">₹{totals.avgCost.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Avg. Cost per Hire</p>
          <p className="text-xs text-gray-400 mt-1">Paid channels only</p>
        </Card>
      </div>

      {/* Source Performance Chart */}
      <Card
        title={
        <div className="flex items-center justify-between w-full">
            <span>Source Performance Comparison</span>
            <div className="flex items-center gap-2">
              <button
              onClick={handleSelectAllSources}
              className="text-sm text-orange-600 hover:text-orange-800">

                {selectedSourceIds.length === filteredData.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        }>

        {filteredData.length === 0 ?
        <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sources found matching your criteria</p>
            <button
            onClick={handleResetFilters}
            className="mt-2 text-orange-600 hover:text-orange-800 text-sm underline">

              Reset filters
            </button>
          </div> :

        <div className="space-y-4">
            {filteredData.map((source, i) => {
            const convRate = calculateConversionRate(source.selected, source.applications);
            const shortlistRate =
            source.applications > 0 ?
            (source.shortlisted / source.applications * 100).toFixed(1) :
            '0';
            const isSelected = selectedSourceIds.includes(source.id);
            const isComparing = compareSourceIds.includes(source.id);

            return (
              <div
                key={source.id}
                className={`p-4 rounded-xl border transition-colors ${
                isSelected ?
                'bg-orange-50 border-orange-300' :
                isComparing ?
                'bg-blue-50 border-blue-300' :
                'bg-gray-50 border-transparent'}`
                }>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectSource(source.id)}
                      className="rounded" />

                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{source.source}</p>
                          <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                          source.status === 'active' ?
                          'bg-green-100 text-green-700' :
                          source.status === 'paused' ?
                          'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'}`
                          }>

                            {source.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{getBranchName(source.branch)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-gray-900">{source.applications}</p>
                          <p className="text-xs text-gray-400">Applied</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-indigo-700">{source.shortlisted}</p>
                          <p className="text-xs text-gray-400">Shortlisted</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-700">{source.selected}</p>
                          <p className="text-xs text-gray-400">Selected</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-orange-700">
                            {source.costPerHire > 0 ?
                          `₹${source.costPerHire.toLocaleString()}` :
                          'Free'}
                          </p>
                          <p className="text-xs text-gray-400">Cost/Hire</p>
                        </div>
                        <div className="text-center">
                          <p
                          className={`font-bold ${
                          convRate >= 10 ?
                          'text-green-700' :
                          convRate >= 5 ?
                          'text-orange-700' :
                          'text-red-600'}`
                          }>

                            {convRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-400">Conv. Rate</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                        onClick={() => handleToggleCompare(source.id)}
                        className={`p-1.5 rounded transition-colors ${
                        isComparing ?
                        'bg-blue-100 text-blue-600' :
                        'hover:bg-gray-200 text-gray-500'}`
                        }
                        title="Add to compare">

                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleViewDetails(source)}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
                        title="View details">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleOpenEditSource(source)}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
                        title="Edit">

                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleToggleStatus(source)}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
                        title={source.status === 'active' ? 'Pause' : 'Activate'}
                        disabled={source.status === 'completed'}>

                          {source.status === 'active' ?
                        <Target className="w-4 h-4" /> :

                        <RefreshCw className="w-4 h-4" />
                        }
                        </button>
                        <button
                        onClick={() => handleDuplicateSource(source)}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
                        title="Duplicate">

                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleOpenDeleteConfirm(source)}
                        className="p-1.5 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
                        title="Delete">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">Applications</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${source.applications / maxApps * 100}%` }}>
                      </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">Shortlisted</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${source.shortlisted / maxApps * 100}%` }}>
                      </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">Selected</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${source.selected / maxApps * 100}%` }}>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>);

          })}
          </div>
        }
      </Card>

      {/* Summary Table */}
      <Card title="Source Effectiveness Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedSourceIds.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAllSources}
                    className="rounded" />

                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('applications')}>

                  <div className="flex items-center justify-center gap-1">
                    Applications
                    {renderSortIndicator('applications')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('shortlisted')}>

                  <div className="flex items-center justify-center gap-1">
                    Shortlisted
                    {renderSortIndicator('shortlisted')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('selected')}>

                  <div className="flex items-center justify-center gap-1">
                    Selected
                    {renderSortIndicator('selected')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('costPerHire')}>

                  <div className="flex items-center justify-center gap-1">
                    Cost/Hire
                    {renderSortIndicator('costPerHire')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('conversionRate')}>

                  <div className="flex items-center justify-center gap-1">
                    Conv. Ratio
                    {renderSortIndicator('conversionRate')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-gray-500 font-medium cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('effectiveness')}>

                  <div className="flex items-center justify-center gap-1">
                    Effectiveness
                    {renderSortIndicator('effectiveness')}
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((source, i) => {
                const convRate = calculateConversionRate(source.selected, source.applications);
                const effectiveness = getEffectivenessLevel(convRate);
                const effLabel = getEffectivenessLabel(effectiveness);
                const effColor =
                effectiveness === 'excellent' ?
                'text-green-700 bg-green-100' :
                effectiveness === 'good' ?
                'text-blue-700 bg-blue-100' :
                effectiveness === 'average' ?
                'text-yellow-700 bg-yellow-100' :
                'text-red-700 bg-red-100';

                return (
                  <tr
                    key={source.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedSourceIds.includes(source.id) ? 'bg-orange-50' : ''}`
                    }>

                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedSourceIds.includes(source.id)}
                        onChange={() => handleSelectSource(source.id)}
                        className="rounded" />

                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{source.icon}</span>
                        <div>
                          <span className="font-medium text-gray-900">{source.source}</span>
                          <p className="text-xs text-gray-400">{getBranchName(source.branch)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-900">
                      {source.applications}
                    </td>
                    <td className="py-3 px-4 text-center text-indigo-700 font-medium">
                      {source.shortlisted}
                    </td>
                    <td className="py-3 px-4 text-center text-green-700 font-bold">
                      {source.selected}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">
                      {source.costPerHire > 0 ? `₹${source.costPerHire.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-purple-700">
                      {convRate.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${effColor}`}>

                        {effLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewDetails(source)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500"
                          title="View">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditSource(source)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-500"
                          title="Edit">

                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(source)}
                          className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
                          title="Delete">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-medium">
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-center">{totals.applications}</td>
                <td className="py-3 px-4 text-center">{totals.shortlisted}</td>
                <td className="py-3 px-4 text-center">{totals.selected}</td>
                <td className="py-3 px-4 text-center">₹{totals.avgCost.toLocaleString()}</td>
                <td className="py-3 px-4 text-center">
                  {totals.applications > 0 ?
                  (totals.selected / totals.applications * 100).toFixed(1) :
                  0}
                  %
                </td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Add/Edit Source Modal */}
      {(showAddSource || showEditSource) &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {showAddSource ? 'Add New Source' : 'Edit Source'}
                </h2>
                <button
                onClick={showAddSource ? handleCloseAddSource : handleCloseEditSource}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {formErrors.length > 0 &&
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Please fix the following errors:</p>
                      <ul className="mt-1 text-sm text-red-700">
                        {formErrors.map((error, i) =>
                    <li key={i}>• {error}</li>
                    )}
                      </ul>
                    </div>
                  </div>
                </div>
            }

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source Name *
                    </label>
                    <input
                    type="text"
                    value={formData.source || ''}
                    onChange={(e) => handleFormChange('source', e.target.value)}
                    placeholder="e.g., LinkedIn, Naukri.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <div className="flex gap-2 flex-wrap">
                      {AVAILABLE_ICONS.map((icon) =>
                    <button
                      key={icon}
                      onClick={() => handleFormChange('icon', icon)}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-colors ${
                      formData.icon === icon ?
                      'border-orange-500 bg-orange-50' :
                      'border-gray-200 hover:border-gray-300'}`
                      }>

                          {icon}
                        </button>
                    )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                    <select
                    value={formData.branch || 'main'}
                    onChange={(e) => handleFormChange('branch', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500">

                      {BRANCHES.filter((b) => b.id !== 'all').map((branch) =>
                    <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                    )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                    value={formData.status || 'active'}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500">

                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applications
                    </label>
                    <input
                    type="number"
                    min="0"
                    value={formData.applications || 0}
                    onChange={(e) => handleFormChange('applications', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shortlisted
                    </label>
                    <input
                    type="number"
                    min="0"
                    value={formData.shortlisted || 0}
                    onChange={(e) => handleFormChange('shortlisted', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selected</label>
                    <input
                    type="number"
                    min="0"
                    value={formData.selected || 0}
                    onChange={(e) => handleFormChange('selected', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost per Hire (₹)
                    </label>
                    <input
                    type="number"
                    min="0"
                    value={formData.costPerHire || 0}
                    onChange={(e) => handleFormChange('costPerHire', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Budget (₹)
                    </label>
                    <input
                    type="number"
                    min="0"
                    value={formData.budget || 0}
                    onChange={(e) => handleFormChange('budget', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Start Date
                    </label>
                    <input
                    type="date"
                    value={formData.campaignStartDate || ''}
                    onChange={(e) => handleFormChange('campaignStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign End Date
                    </label>
                    <input
                    type="date"
                    value={formData.campaignEndDate || ''}
                    onChange={(e) => handleFormChange('campaignEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Additional notes about this source..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 resize-none" />

                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex gap-3">
                <Button
                variant="primary"
                onClick={showAddSource ? handleAddSource : handleUpdateSource}
                disabled={isLoading}>

                  {isLoading ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {showAddSource ? 'Adding...' : 'Saving...'}
                    </> :

                <>
                      <Save className="w-4 h-4 mr-2" />
                      {showAddSource ? 'Add Source' : 'Save Changes'}
                    </>
                }
                </Button>
                <Button
                variant="outline"
                onClick={showAddSource ? handleCloseAddSource : handleCloseEditSource}>

                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedSource &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Delete Source</h3>
                <p className="text-gray-600 mt-1">
                  Are you sure you want to delete "{selectedSource.source}"? This action cannot be
                  undone.
                </p>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Applications:</span> {selectedSource.applications}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Selected:</span> {selectedSource.selected}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCloseDeleteConfirm}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDeleteSource} disabled={isLoading}>
                {isLoading ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </> :

              <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Source Details Modal */}
      {showSourceDetails && selectedSource &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedSource.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedSource.source}</h2>
                    <p className="text-sm text-gray-500">{getBranchName(selectedSource.branch)}</p>
                  </div>
                </div>
                <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applications</span>
                        <span className="font-bold">{selectedSource.applications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shortlisted</span>
                        <span className="font-bold text-indigo-700">{selectedSource.shortlisted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Selected</span>
                        <span className="font-bold text-green-700">{selectedSource.selected}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span className="font-bold text-purple-700">
                          {calculateConversionRate(
                          selectedSource.selected,
                          selectedSource.applications
                        ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Financial</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost per Hire</span>
                        <span className="font-bold">
                          {selectedSource.costPerHire > 0 ?
                        `₹${selectedSource.costPerHire.toLocaleString()}` :
                        'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campaign Budget</span>
                        <span className="font-bold">₹{selectedSource.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Spend</span>
                        <span className="font-bold">
                          ₹{(selectedSource.costPerHire * selectedSource.selected).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Campaign Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedSource.status === 'active' ?
                        'bg-green-100 text-green-700' :
                        selectedSource.status === 'paused' ?
                        'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'}`
                        }>

                          {selectedSource.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date</span>
                        <span className="font-medium">
                          {new Date(selectedSource.campaignStartDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date</span>
                        <span className="font-medium">
                          {new Date(selectedSource.campaignEndDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-medium">
                          {new Date(selectedSource.lastUpdated).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedSource.notes &&
                <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                      <p className="text-sm text-gray-600">{selectedSource.notes}</p>
                    </div>
                }

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Effectiveness</h3>
                    <div className="flex items-center gap-3">
                      <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getEffectivenessLevel(
                        calculateConversionRate(
                          selectedSource.selected,
                          selectedSource.applications
                        )
                      ) === 'excellent' ?
                      'bg-green-100 text-green-700' :
                      getEffectivenessLevel(
                        calculateConversionRate(
                          selectedSource.selected,
                          selectedSource.applications
                        )
                      ) === 'good' ?
                      'bg-blue-100 text-blue-700' :
                      getEffectivenessLevel(
                        calculateConversionRate(
                          selectedSource.selected,
                          selectedSource.applications
                        )
                      ) === 'average' ?
                      'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'}`
                      }>

                        {getEffectivenessLabel(
                        getEffectivenessLevel(
                          calculateConversionRate(
                            selectedSource.selected,
                            selectedSource.applications
                          )
                        )
                      )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex gap-3">
                <Button variant="primary" onClick={() => handleOpenEditSource(selectedSource)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Source
                </Button>
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Compare Modal */}
      {showCompareModal && compareSources.length >= 2 &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Compare Sources ({compareSources.length})
                </h2>
                <button onClick={handleCloseCompare} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Metric</th>
                      {compareSources.map((source) =>
                    <th key={source.id} className="text-center py-3 px-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xl">{source.icon}</span>
                            <span className="font-medium text-gray-900">{source.source}</span>
                          </div>
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Applications</td>
                      {compareSources.map((source) =>
                    <td key={source.id} className="py-3 px-4 text-center font-bold">
                          {source.applications}
                        </td>
                    )}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Shortlisted</td>
                      {compareSources.map((source) =>
                    <td key={source.id} className="py-3 px-4 text-center font-bold text-indigo-700">
                          {source.shortlisted}
                        </td>
                    )}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Selected</td>
                      {compareSources.map((source) =>
                    <td key={source.id} className="py-3 px-4 text-center font-bold text-green-700">
                          {source.selected}
                        </td>
                    )}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Conversion Rate</td>
                      {compareSources.map((source) => {
                      const rate = calculateConversionRate(source.selected, source.applications);
                      return (
                        <td key={source.id} className="py-3 px-4 text-center font-bold text-purple-700">
                            {rate.toFixed(1)}%
                          </td>);

                    })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Cost per Hire</td>
                      {compareSources.map((source) =>
                    <td key={source.id} className="py-3 px-4 text-center font-bold">
                          {source.costPerHire > 0 ? `₹${source.costPerHire.toLocaleString()}` : 'Free'}
                        </td>
                    )}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Budget</td>
                      {compareSources.map((source) =>
                    <td key={source.id} className="py-3 px-4 text-center font-bold">
                          ₹{source.budget.toLocaleString()}
                        </td>
                    )}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-600">Status</td>
                      {compareSources.map((source) =>
                    <td key={source.id} className="py-3 px-4 text-center">
                          <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        source.status === 'active' ?
                        'bg-green-100 text-green-700' :
                        source.status === 'paused' ?
                        'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'}`
                        }>

                            {source.status}
                          </span>
                        </td>
                    )}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600">Effectiveness</td>
                      {compareSources.map((source) => {
                      const effectiveness = getEffectivenessLevel(
                        calculateConversionRate(source.selected, source.applications)
                      );
                      return (
                        <td key={source.id} className="py-3 px-4 text-center">
                            <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            effectiveness === 'excellent' ?
                            'bg-green-100 text-green-700' :
                            effectiveness === 'good' ?
                            'bg-blue-100 text-blue-700' :
                            effectiveness === 'average' ?
                            'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`
                            }>

                              {getEffectivenessLabel(effectiveness)}
                            </span>
                          </td>);

                    })}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t flex gap-3">
                <Button variant="outline" onClick={handleCloseCompare}>
                  Close
                </Button>
                <Button variant="outline" onClick={handleClearCompare}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Insights Modal */}
      {showInsightsModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI-Generated Insights</h2>
                    <p className="text-sm text-gray-500">Based on current data analysis</p>
                  </div>
                </div>
                <button onClick={handleCloseInsights} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {generateInsights.map((insight, index) =>
              <div
                key={index}
                className={`p-4 rounded-lg flex items-start gap-3 ${
                insight.type === 'positive' ?
                'bg-green-50 border border-green-200' :
                insight.type === 'negative' ?
                'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'}`
                }>

                    {insight.type === 'positive' ?
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> :
                insight.type === 'negative' ?
                <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /> :

                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                }
                    <p
                  className={`text-sm ${
                  insight.type === 'positive' ?
                  'text-green-800' :
                  insight.type === 'negative' ?
                  'text-red-800' :
                  'text-blue-800'}`
                  }>

                      {insight.message}
                    </p>
                  </div>
              )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseInsights}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}