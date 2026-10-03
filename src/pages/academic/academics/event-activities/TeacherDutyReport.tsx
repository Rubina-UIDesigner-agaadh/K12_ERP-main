// src/pages/reports/teacher-duty/TeacherDutyReport.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Select } from '../../../../components/ui/Select';
import { DownloadIcon, Search, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';

// Type Definitions
interface TeacherDutyData {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  department: string;
  assignedDuties: number;
  completedDuties: number;
  missedDuties: number;
  pendingDuties: number;
  complianceRate: number;
  lastDutyDate: string;
  remarks: string;
}

interface FilterOptions {
  timePeriod: string;
  department: string;
  complianceStatus: string;
  searchQuery: string;
}

interface SortConfig {
  key: keyof TeacherDutyData | null;
  direction: 'asc' | 'desc';
}

interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface TotalStats {
  totalTeachers: number;
  totalAssigned: number;
  totalCompleted: number;
  totalMissed: number;
  totalPending: number;
  overallCompliance: number;
  highPerformers: number;
  lowPerformers: number;
}

interface TableColumn {
  key: keyof TeacherDutyData;
  label: string;
  align: 'left' | 'center' | 'right';
  sortable: boolean;
  visible: boolean;
}

// Constants
const INITIAL_REPORT_DATA: TeacherDutyData[] = [
{
  id: '1',
  teacherId: 'TCH001',
  name: 'R. Sharma',
  email: 'r.sharma@school.edu',
  department: 'Math',
  assignedDuties: 12,
  completedDuties: 12,
  missedDuties: 0,
  pendingDuties: 0,
  complianceRate: 100,
  lastDutyDate: '2024-01-15',
  remarks: 'Excellent performance'
},
{
  id: '2',
  teacherId: 'TCH002',
  name: 'A. Gupta',
  email: 'a.gupta@school.edu',
  department: 'Science',
  assignedDuties: 15,
  completedDuties: 14,
  missedDuties: 1,
  pendingDuties: 0,
  complianceRate: 93,
  lastDutyDate: '2024-01-14',
  remarks: 'Good performance'
},
{
  id: '3',
  teacherId: 'TCH003',
  name: 'M. Singh',
  email: 'm.singh@school.edu',
  department: 'English',
  assignedDuties: 10,
  completedDuties: 8,
  missedDuties: 2,
  pendingDuties: 0,
  complianceRate: 80,
  lastDutyDate: '2024-01-13',
  remarks: 'Needs improvement'
},
{
  id: '4',
  teacherId: 'TCH004',
  name: 'P. Kumar',
  email: 'p.kumar@school.edu',
  department: 'Social Studies',
  assignedDuties: 8,
  completedDuties: 8,
  missedDuties: 0,
  pendingDuties: 0,
  complianceRate: 100,
  lastDutyDate: '2024-01-15',
  remarks: 'Excellent performance'
},
{
  id: '5',
  teacherId: 'TCH005',
  name: 'S. Patel',
  email: 's.patel@school.edu',
  department: 'Physical Education',
  assignedDuties: 20,
  completedDuties: 18,
  missedDuties: 2,
  pendingDuties: 0,
  complianceRate: 90,
  lastDutyDate: '2024-01-12',
  remarks: 'Good performance'
},
{
  id: '6',
  teacherId: 'TCH006',
  name: 'K. Verma',
  email: 'k.verma@school.edu',
  department: 'Math',
  assignedDuties: 14,
  completedDuties: 10,
  missedDuties: 4,
  pendingDuties: 0,
  complianceRate: 71,
  lastDutyDate: '2024-01-10',
  remarks: 'Requires attention'
}];


const TIME_PERIOD_OPTIONS = [
{ value: 'today', label: 'Today' },
{ value: 'yesterday', label: 'Yesterday' },
{ value: 'this_week', label: 'This Week' },
{ value: 'last_week', label: 'Last Week' },
{ value: 'this_month', label: 'This Month' },
{ value: 'last_month', label: 'Last Month' },
{ value: 'this_quarter', label: 'This Quarter' },
{ value: 'last_quarter', label: 'Last Quarter' },
{ value: 'this_year', label: 'This Year' },
{ value: 'last_year', label: 'Last Year' },
{ value: 'custom', label: 'Custom Range' }];


const DEPARTMENT_OPTIONS = [
{ value: 'all', label: 'All Departments' },
{ value: 'math', label: 'Math' },
{ value: 'science', label: 'Science' },
{ value: 'english', label: 'English' },
{ value: 'social_studies', label: 'Social Studies' },
{ value: 'physical_education', label: 'Physical Education' },
{ value: 'computer_science', label: 'Computer Science' },
{ value: 'arts', label: 'Arts' },
{ value: 'music', label: 'Music' }];


const COMPLIANCE_STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'excellent', label: 'Excellent (95-100%)' },
{ value: 'good', label: 'Good (80-94%)' },
{ value: 'needs_improvement', label: 'Needs Improvement (60-79%)' },
{ value: 'poor', label: 'Poor (Below 60%)' }];


const ITEMS_PER_PAGE_OPTIONS = [
{ value: '5', label: '5 per page' },
{ value: '10', label: '10 per page' },
{ value: '25', label: '25 per page' },
{ value: '50', label: '50 per page' },
{ value: '100', label: '100 per page' }];


const TABLE_COLUMNS: TableColumn[] = [
{ key: 'teacherId', label: 'Teacher ID', align: 'left', sortable: true, visible: true },
{ key: 'name', label: 'Teacher Name', align: 'left', sortable: true, visible: true },
{ key: 'department', label: 'Department', align: 'left', sortable: true, visible: true },
{ key: 'assignedDuties', label: 'Assigned', align: 'center', sortable: true, visible: true },
{ key: 'completedDuties', label: 'Completed', align: 'center', sortable: true, visible: true },
{ key: 'missedDuties', label: 'Missed', align: 'center', sortable: true, visible: true },
{ key: 'pendingDuties', label: 'Pending', align: 'center', sortable: true, visible: true },
{ key: 'complianceRate', label: 'Compliance %', align: 'center', sortable: true, visible: true },
{ key: 'lastDutyDate', label: 'Last Duty Date', align: 'center', sortable: true, visible: true },
{ key: 'remarks', label: 'Remarks', align: 'left', sortable: false, visible: true }];


const INITIAL_FILTERS: FilterOptions = {
  timePeriod: 'this_month',
  department: 'all',
  complianceStatus: 'all',
  searchQuery: ''
};

const INITIAL_SORT_CONFIG: SortConfig = {
  key: null,
  direction: 'asc'
};

const INITIAL_PAGINATION: PaginationConfig = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0
};

// Helper Functions
const calculateComplianceRate = (completed: number, assigned: number): number => {
  if (assigned === 0) return 0;
  return Math.round(completed / assigned * 100);
};

const getComplianceStatus = (rate: number): string => {
  if (rate >= 95) return 'excellent';
  if (rate >= 80) return 'good';
  if (rate >= 60) return 'needs_improvement';
  return 'poor';
};

const getComplianceColor = (rate: number): string => {
  if (rate >= 95) return 'text-green-600';
  if (rate >= 80) return 'text-yellow-600';
  if (rate >= 60) return 'text-orange-600';
  return 'text-red-600';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getDateRange = (timePeriod: string): {startDate: Date;endDate: Date;} => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate: Date;
  let endDate: Date = new Date(today);

  switch (timePeriod) {
    case 'today':
      startDate = new Date(today);
      break;
    case 'yesterday':
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 1);
      endDate = new Date(startDate);
      break;
    case 'this_week':
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      break;
    case 'last_week':
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      break;
    case 'this_month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'last_month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'this_quarter':
      const currentQuarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
      break;
    case 'last_quarter':
      const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
      const lastQuarterYear = lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const adjustedQuarter = lastQuarter < 0 ? 3 : lastQuarter;
      startDate = new Date(lastQuarterYear, adjustedQuarter * 3, 1);
      endDate = new Date(lastQuarterYear, adjustedQuarter * 3 + 3, 0);
      break;
    case 'this_year':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    case 'last_year':
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return { startDate, endDate };
};

// Main Component
export function TeacherDutyReport() {
  // State Management
  const [reportData, setReportData] = useState<TeacherDutyData[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);
  const [sortConfig, setSortConfig] = useState<SortConfig>(INITIAL_SORT_CONFIG);
  const [pagination, setPagination] = useState<PaginationConfig>(INITIAL_PAGINATION);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<TableColumn[]>(TABLE_COLUMNS);

  // Initialize Data
  useEffect(() => {
    loadReportData();
  }, []);

  // Load Report Data
  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call - replace with actual API integration
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReportData(INITIAL_REPORT_DATA);
    } catch (err) {
      setError('Failed to load report data. Please try again.');
      console.error('Error loading report data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    let result = [...reportData];

    // Filter by department
    if (filters.department !== 'all') {
      result = result.filter(
        (teacher) => teacher.department.toLowerCase().replace(' ', '_') === filters.department
      );
    }

    // Filter by compliance status
    if (filters.complianceStatus !== 'all') {
      result = result.filter(
        (teacher) => getComplianceStatus(teacher.complianceRate) === filters.complianceStatus
      );
    }

    // Filter by search query
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (teacher) =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.teacherId.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.department.toLowerCase().includes(query)
      );
    }

    // Filter by time period (simulated - in real implementation, this would be handled by API)
    const { startDate, endDate } = getDateRange(filters.timePeriod);
    result = result.filter((teacher) => {
      const dutyDate = new Date(teacher.lastDutyDate);
      return dutyDate >= startDate && dutyDate <= endDate;
    });

    return result;
  }, [reportData, filters]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof TeacherDutyData];
      const bValue = b[sortConfig.key as keyof TeacherDutyData];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate Data
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination.currentPage, pagination.itemsPerPage]);

  // Update Pagination
  useEffect(() => {
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, Math.max(1, totalPages))
    }));
  }, [sortedData, pagination.itemsPerPage]);

  // Calculate Total Stats
  const totalStats = useMemo((): TotalStats => {
    const stats = filteredData.reduce(
      (acc, curr) => ({
        totalAssigned: acc.totalAssigned + curr.assignedDuties,
        totalCompleted: acc.totalCompleted + curr.completedDuties,
        totalMissed: acc.totalMissed + curr.missedDuties,
        totalPending: acc.totalPending + curr.pendingDuties,
        highPerformers: acc.highPerformers + (curr.complianceRate >= 95 ? 1 : 0),
        lowPerformers: acc.lowPerformers + (curr.complianceRate < 60 ? 1 : 0)
      }),
      {
        totalAssigned: 0,
        totalCompleted: 0,
        totalMissed: 0,
        totalPending: 0,
        highPerformers: 0,
        lowPerformers: 0
      }
    );

    const overallCompliance = calculateComplianceRate(stats.totalCompleted, stats.totalAssigned);

    return {
      totalTeachers: filteredData.length,
      ...stats,
      overallCompliance
    };
  }, [filteredData]);

  // Event Handlers
  const handleFilterChange = useCallback((filterKey: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleSort = useCallback((columnKey: keyof TeacherDutyData) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((value: string) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: parseInt(value, 10),
      currentPage: 1
    }));
  }, []);

  const handleRefresh = useCallback(() => {
    loadReportData();
  }, [loadReportData]);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSortConfig(INITIAL_SORT_CONFIG);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Export Functions
  const generateCSVContent = useCallback((): string => {
    const headers = visibleColumns.
    filter((col) => col.visible).
    map((col) => col.label).
    join(',');

    const rows = sortedData.map((row) => {
      return visibleColumns.
      filter((col) => col.visible).
      map((col) => {
        const value = row[col.key];
        if (col.key === 'complianceRate') return `${value}%`;
        if (col.key === 'lastDutyDate') return formatDate(value as string);
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return value;
      }).
      join(',');
    }).join('\n');

    return `${headers}\n${rows}`;
  }, [sortedData, visibleColumns]);

  const handleExportCSV = useCallback(() => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `teacher_duty_report_${filters.timePeriod}_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generateCSVContent, filters.timePeriod]);

  // Render Sort Icon
  const renderSortIcon = (columnKey: keyof TeacherDutyData) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' ?
    <ChevronUp className="w-4 h-4 text-gray-600" /> :

    <ChevronDown className="w-4 h-4 text-gray-600" />;

  };

  // Render Pagination
  const renderPagination = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} entries
          </span>
          <Select
            options={ITEMS_PER_PAGE_OPTIONS}
            defaultValue={String(pagination.itemsPerPage)}
            onChange={handleItemsPerPageChange} />
          
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}>
            
            First
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}>
            
            Previous
          </Button>
          {pages.map((page) =>
          <Button
            key={page}
            variant={pagination.currentPage === page ? 'primary' : 'outline'}
            onClick={() => handlePageChange(page)}>
            
              {page}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}>
            
            Next
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}>
            
            Last
          </Button>
        </div>
      </div>);

  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Duty Report</h1>
          <p className="text-sm text-gray-500">
            Generate reports on duty compliance and completion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={sortedData.length === 0}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error &&
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      }

      {/* Main Report Card */}
      <Card>
        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, email, or department..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
            </div>
          </div>
          <Select
            options={TIME_PERIOD_OPTIONS}
            defaultValue={filters.timePeriod}
            onChange={(value) => handleFilterChange('timePeriod', value)} />
          
          <Select
            options={DEPARTMENT_OPTIONS}
            defaultValue={filters.department}
            onChange={(value) => handleFilterChange('department', value)} />
          
          <Select
            options={COMPLIANCE_STATUS_OPTIONS}
            defaultValue={filters.complianceStatus}
            onChange={(value) => handleFilterChange('complianceStatus', value)} />
          
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Total Teachers</p>
            <p className="text-2xl font-bold text-gray-900">{totalStats.totalTeachers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Assigned</p>
            <p className="text-2xl font-bold text-gray-900">{totalStats.totalAssigned}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Completed</p>
            <p className="text-2xl font-bold text-green-600">{totalStats.totalCompleted}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Missed</p>
            <p className="text-2xl font-bold text-red-600">{totalStats.totalMissed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{totalStats.totalPending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall Compliance</p>
            <p className={`text-2xl font-bold ${getComplianceColor(totalStats.overallCompliance)}`}>
              {totalStats.overallCompliance}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">High Performers</p>
            <p className="text-2xl font-bold text-green-600">{totalStats.highPerformers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Low Performers</p>
            <p className="text-2xl font-bold text-red-600">{totalStats.lowPerformers}</p>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          {isLoading ?
          <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading report data...</span>
            </div> :

          <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {visibleColumns.
                filter((col) => col.visible).
                map((column) =>
                <th
                  key={column.key}
                  className={`text-${column.align} py-3 px-4 font-medium text-gray-600 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`
                  }
                  onClick={() => column.sortable && handleSort(column.key)}>
                  
                        <div className={`flex items-center ${
                  column.align === 'center' ? 'justify-center' :
                  column.align === 'right' ? 'justify-end' : 'justify-start'}`
                  }>
                          {column.label}
                          {column.sortable &&
                    <span className="ml-1">{renderSortIcon(column.key)}</span>
                    }
                        </div>
                      </th>
                )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ?
              paginatedData.map((teacher) =>
              <tr
                key={teacher.id}
                className="border-b border-gray-100 hover:bg-gray-50">
                
                      <td className="py-3 px-4 text-gray-600">{teacher.teacherId}</td>
                      <td className="py-3 px-4 font-medium">{teacher.name}</td>
                      <td className="py-3 px-4 text-gray-600">{teacher.department}</td>
                      <td className="py-3 px-4 text-center">{teacher.assignedDuties}</td>
                      <td className="py-3 px-4 text-center text-green-600">
                        {teacher.completedDuties}
                      </td>
                      <td className="py-3 px-4 text-center text-red-600">
                        {teacher.missedDuties}
                      </td>
                      <td className="py-3 px-4 text-center text-yellow-600">
                        {teacher.pendingDuties}
                      </td>
                      <td className={`py-3 px-4 text-center font-bold ${getComplianceColor(teacher.complianceRate)}`}>
                        {teacher.complianceRate}%
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {formatDate(teacher.lastDutyDate)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{teacher.remarks}</td>
                    </tr>
              ) :

              <tr>
                    <td colSpan={visibleColumns.filter((col) => col.visible).length} className="py-12 text-center text-gray-500">
                      No data available for the selected filters
                    </td>
                  </tr>
              }
              </tbody>
            </table>
          }
        </div>

        {/* Pagination */}
        {paginatedData.length > 0 && renderPagination()}
      </Card>
    </div>);

}