// src/pages/academic/event-activities/DepartmentDutyAllocation.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../../components/ui/Card';

interface Department {
  id: string;
  name: string;
  teachersCount: number;
  dutiesAssigned: number;
  pendingAllocation: number;
  hodName?: string;
  hodEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DepartmentDutyAllocationProps {
  schoolId?: string;
  academicYearId?: string;
  onDepartmentSelect?: (department: Department) => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

interface TableColumn {
  key: keyof Department | string;
  label: string;
  align: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, department: Department) => React.ReactNode;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export function DepartmentDutyAllocation({
  schoolId,
  academicYearId,
  onDepartmentSelect,
  onError,
  onSuccess
}: DepartmentDutyAllocationProps = {}) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());

  const tableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Department',
    align: 'left',
    sortable: true,
    render: (value, dept) => <span className="font-medium">{value}</span>
  },
  {
    key: 'teachersCount',
    label: 'Teachers Count',
    align: 'left',
    sortable: true
  },
  {
    key: 'dutiesAssigned',
    label: 'Duties Assigned',
    align: 'left',
    sortable: true
  },
  {
    key: 'pendingAllocation',
    label: 'Pending Allocation',
    align: 'left',
    sortable: true,
    render: (value) =>
    <span className={getPendingAllocationColor(value)}>
          {value}
        </span>

  }];


  useEffect(() => {
    fetchDepartments();
  }, [schoolId, academicYearId]);

  useEffect(() => {
    handleFilterAndSort();
  }, [departments, searchTerm, sortConfig]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulating API call
      const response = await mockApiCall();

      if (response.success) {
        setDepartments(response.data);
        onSuccess?.('Departments loaded successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch departments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch departments';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const mockApiCall = async (): Promise<{success: boolean;data: Department[];message?: string;}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
          {
            id: '1',
            name: 'Science',
            teachersCount: 12,
            dutiesAssigned: 45,
            pendingAllocation: 5,
            hodName: 'Dr. John Smith',
            hodEmail: 'john.smith@school.com',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15')
          },
          {
            id: '2',
            name: 'Math',
            teachersCount: 10,
            dutiesAssigned: 38,
            pendingAllocation: 0,
            hodName: 'Dr. Jane Doe',
            hodEmail: 'jane.doe@school.com',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15')
          },
          {
            id: '3',
            name: 'English',
            teachersCount: 15,
            dutiesAssigned: 52,
            pendingAllocation: 3,
            hodName: 'Prof. Alice Johnson',
            hodEmail: 'alice.johnson@school.com',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15')
          },
          {
            id: '4',
            name: 'History',
            teachersCount: 8,
            dutiesAssigned: 30,
            pendingAllocation: 2,
            hodName: 'Dr. Robert Brown',
            hodEmail: 'robert.brown@school.com',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15')
          }]

        });
      }, 1000);
    });
  };

  const handleFilterAndSort = useCallback(() => {
    let result = [...departments];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hodName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Department];
        const bValue = b[sortConfig.key as keyof Department];

        if (aValue === undefined || bValue === undefined) return 0;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        if (sortConfig.direction === 'asc') {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }

    setFilteredDepartments(result);
  }, [departments, searchTerm, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    fetchDepartments();
  };

  const handleDepartmentClick = (department: Department) => {
    onDepartmentSelect?.(department);
  };

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedDepartments.size === filteredDepartments.length) {
      setSelectedDepartments(new Set());
    } else {
      setSelectedDepartments(new Set(filteredDepartments.map((d) => d.id)));
    }
  };

  const getPendingAllocationColor = (pending: number): string => {
    if (pending === 0) return 'text-green-500';
    if (pending <= 5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTotalTeachers = (): number => {
    return departments.reduce((sum, dept) => sum + dept.teachersCount, 0);
  };

  const getTotalDutiesAssigned = (): number => {
    return departments.reduce((sum, dept) => sum + dept.dutiesAssigned, 0);
  };

  const getTotalPendingAllocation = (): number => {
    return departments.reduce((sum, dept) => sum + dept.pendingAllocation, 0);
  };

  const getAverageDutiesPerTeacher = (): number => {
    const totalTeachers = getTotalTeachers();
    const totalDuties = getTotalDutiesAssigned();
    return totalTeachers > 0 ? Number((totalDuties / totalTeachers).toFixed(2)) : 0;
  };

  const renderTableHeader = () =>
  <thead>
      <tr className="border-b border-gray-200">
        {tableColumns.map((column) =>
      <th
        key={String(column.key)}
        className={`text-${column.align} py-3 px-4 font-medium text-gray-600 ${
        column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`
        }
        onClick={() => column.sortable && handleSort(String(column.key))}>
        
            <div className="flex items-center gap-2">
              {column.label}
              {column.sortable && sortConfig?.key === column.key &&
          <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
          }
            </div>
          </th>
      )}
      </tr>
    </thead>;


  const renderTableBody = () =>
  <tbody>
      {filteredDepartments.map((department) =>
    <tr
      key={department.id}
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={() => handleDepartmentClick(department)}>
      
          {tableColumns.map((column) => {
        const value = department[column.key as keyof Department];
        return (
          <td key={String(column.key)} className={`py-3 px-4 text-${column.align}`}>
                {column.render ? column.render(value, department) : (value as React.ReactNode)}
              </td>);

      })}
        </tr>
    )}
    </tbody>;


  const renderEmptyState = () =>
  <tbody>
      <tr>
        <td colSpan={tableColumns.length} className="py-8 px-4 text-center text-gray-500">
          {searchTerm ? 'No departments match your search criteria' : 'No departments found'}
        </td>
      </tr>
    </tbody>;


  const renderLoadingState = () =>
  <tbody>
      <tr>
        <td colSpan={tableColumns.length} className="py-8 px-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            <span>Loading departments...</span>
          </div>
        </td>
      </tr>
    </tbody>;


  const renderErrorState = () =>
  <tbody>
      <tr>
        <td colSpan={tableColumns.length} className="py-8 px-4 text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800">
          
            Try Again
          </button>
        </td>
      </tr>
    </tbody>;


  const renderSummaryFooter = () =>
  <tfoot>
      <tr className="border-t-2 border-gray-300 font-semibold bg-gray-50">
        <td className="py-3 px-4">Total</td>
        <td className="py-3 px-4">{getTotalTeachers()}</td>
        <td className="py-3 px-4">{getTotalDutiesAssigned()}</td>
        <td className={`py-3 px-4 ${getPendingAllocationColor(getTotalPendingAllocation())}`}>
          {getTotalPendingAllocation()}
        </td>
      </tr>
    </tfoot>;


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Department Duty Allocation
          </h1>
          <p className="text-sm text-gray-500">
            Allocate bulk duties to departments for internal distribution
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
            
            Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded w-64" />
        
        {selectedDepartments.size > 0 &&
        <span className="text-sm text-gray-600">
            {selectedDepartments.size} department(s) selected
          </span>
        }
      </div>

      <Card title="Department Quotas">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {renderTableHeader()}
            {loading && renderLoadingState()}
            {error && renderErrorState()}
            {!loading && !error && filteredDepartments.length === 0 && renderEmptyState()}
            {!loading && !error && filteredDepartments.length > 0 &&
            <>
                {renderTableBody()}
                {renderSummaryFooter()}
              </>
            }
          </table>
        </div>
      </Card>

      {!loading && !error && departments.length > 0 &&
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded">
            <div className="text-sm text-gray-500">Total Departments</div>
            <div className="text-2xl font-bold text-gray-900">{departments.length}</div>
          </div>
          <div className="p-4 border border-gray-200 rounded">
            <div className="text-sm text-gray-500">Total Teachers</div>
            <div className="text-2xl font-bold text-gray-900">{getTotalTeachers()}</div>
          </div>
          <div className="p-4 border border-gray-200 rounded">
            <div className="text-sm text-gray-500">Total Duties Assigned</div>
            <div className="text-2xl font-bold text-gray-900">{getTotalDutiesAssigned()}</div>
          </div>
          <div className="p-4 border border-gray-200 rounded">
            <div className="text-sm text-gray-500">Avg Duties/Teacher</div>
            <div className="text-2xl font-bold text-gray-900">{getAverageDutiesPerTeacher()}</div>
          </div>
        </div>
      }
    </div>);

}

export default DepartmentDutyAllocation;