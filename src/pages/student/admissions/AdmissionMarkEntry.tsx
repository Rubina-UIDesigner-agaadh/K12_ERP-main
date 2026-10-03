import React, { useMemo, useState } from 'react';
import { ArrowLeft, Save, CheckSquare, Filter, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
export function AdmissionMarkEntry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // Mock Data
  const [candidates, setCandidates] = useState([
  {
    id: 'APP-001',
    name: 'Aarav Gupta',
    roll: '1001',
    math: 45,
    eng: 40,
    total: 85,
    status: 'Present'
  },
  {
    id: 'APP-045',
    name: 'Zara Khan',
    roll: '1002',
    math: 42,
    eng: 40,
    total: 82,
    status: 'Present'
  },
  {
    id: 'APP-012',
    name: 'Vihaan Shah',
    roll: '1003',
    math: 38,
    eng: 40,
    total: 78,
    status: 'Present'
  },
  {
    id: 'APP-089',
    name: 'Ishaan Verma',
    roll: '1004',
    math: 35,
    eng: 40,
    total: 75,
    status: 'Present'
  },
  {
    id: 'APP-023',
    name: 'Ananya Roy',
    roll: '1005',
    math: 0,
    eng: 0,
    total: 0,
    status: 'Absent'
  },
  {
    id: 'APP-034',
    name: 'Priya Sharma',
    roll: '1006',
    math: 48,
    eng: 45,
    total: 93,
    status: 'Present'
  },
  {
    id: 'APP-056',
    name: 'Rohan Patel',
    roll: '1007',
    math: 40,
    eng: 38,
    total: 78,
    status: 'Present'
  },
  {
    id: 'APP-078',
    name: 'Sneha Reddy',
    roll: '1008',
    math: 0,
    eng: 0,
    total: 0,
    status: 'Absent'
  }]
  );
  // Filter candidates based on search query and status filter
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
      searchQuery === '' ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
      statusFilter === '' ||
      candidate.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, candidates]);
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };
  const hasActiveFilters = searchQuery || statusFilter;
  // Update candidate marks
  const updateCandidateMark = (
  candidateId: string,
  field: 'math' | 'eng',
  value: number) =>
  {
    setCandidates((prev) =>
    prev.map((c) => {
      if (c.id === candidateId) {
        const updatedCandidate = {
          ...c,
          [field]: value
        };
        updatedCandidate.total = updatedCandidate.math + updatedCandidate.eng;
        return updatedCandidate;
      }
      return c;
    })
    );
  };
  // Update candidate status
  const updateCandidateStatus = (candidateId: string, status: string) => {
    setCandidates((prev) =>
    prev.map((c) => {
      if (c.id === candidateId) {
        if (status === 'Absent') {
          return {
            ...c,
            status,
            math: 0,
            eng: 0,
            total: 0
          };
        }
        return {
          ...c,
          status
        };
      }
      return c;
    })
    );
  };
  const columns = [
  {
    key: 'roll',
    header: 'Roll No',
    render: (row: any) => <span className="font-mono">{row.roll}</span>
  },
  {
    key: 'name',
    header: 'Candidate Name',
    render: (row: any) =>
    <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-gray-500">{row.id}</p>
        </div>

  },
  {
    key: 'status',
    header: 'Attendance',
    render: (row: any) =>
    <select
      className="w-32 text-sm py-1.5 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={row.status.toLowerCase()}
      onChange={(e) =>
      updateCandidateStatus(
        row.id,
        e.target.value === 'present' ? 'Present' : 'Absent'
      )
      }>

          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

  },
  {
    key: 'math',
    header: 'Math (50)',
    render: (row: any) =>
    <input
      type="number"
      className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      value={row.math}
      min={0}
      max={50}
      disabled={row.status === 'Absent'}
      onChange={(e) =>
      updateCandidateMark(
        row.id,
        'math',
        Math.min(50, Math.max(0, parseInt(e.target.value) || 0))
      )
      } />


  },
  {
    key: 'eng',
    header: 'English (50)',
    render: (row: any) =>
    <input
      type="number"
      className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      value={row.eng}
      min={0}
      max={50}
      disabled={row.status === 'Absent'}
      onChange={(e) =>
      updateCandidateMark(
        row.id,
        'eng',
        Math.min(50, Math.max(0, parseInt(e.target.value) || 0))
      )
      } />


  },
  {
    key: 'total',
    header: 'Total (100)',
    render: (row: any) =>
    <span
      className={`font-bold ${row.status === 'Absent' ? 'text-gray-400' : row.total >= 80 ? 'text-green-600' : row.total >= 60 ? 'text-blue-600' : row.total >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>

          {row.total}
        </span>

  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admission Marks Entry
            </h1>
            <p className="text-gray-500">Enter marks for entrance exams</p>
          </div>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Marks
        </Button>
      </div>

      <Card>
        {/* Exam Selection Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label="Select Exam"
              options={[
              {
                value: 'ex1',
                label: 'Class 6 Entrance Test 2024'
              },
              {
                value: 'ex2',
                label: 'Class 9 Entrance Test 2024'
              }]
              } />

            <Select
              label="Center / Room"
              options={[
              {
                value: 'all',
                label: 'All Centers'
              },
              {
                value: 'c1',
                label: 'Main Block - Room 101'
              },
              {
                value: 'c2',
                label: 'Main Block - Room 102'
              }]
              } />

            <Button className="w-full">
              <CheckSquare className="w-4 h-4 mr-2" /> Load Candidates
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Name, Roll No, or Application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />

              {searchQuery &&
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-4 h-4" />
                </button>
              }
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">

                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters &&
            <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            }
          </div>

          {/* Results Count and Active Filters */}
          <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500 gap-2">
            <span>
              Showing {filteredCandidates.length} of {candidates.length}{' '}
              candidates
            </span>
            {hasActiveFilters &&
            <div className="flex items-center gap-2 flex-wrap">
                <span>Active filters:</span>
                {searchQuery &&
              <Badge variant="secondary">Search: "{searchQuery}"</Badge>
              }
                {statusFilter &&
              <Badge variant="secondary">
                    Status:{' '}
                    {statusFilter.charAt(0).toUpperCase() +
                statusFilter.slice(1)}
                  </Badge>
              }
              </div>
            }
          </div>
        </div>

        {/* Candidates Table */}
        {filteredCandidates.length > 0 ?
        <Table columns={columns} data={filteredCandidates} /> :

        <div className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters ?
            'Try adjusting your search or filter criteria' :
            'No candidates have been loaded yet'}
            </p>
            {hasActiveFilters &&
          <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
          }
          </div>
        }

        {/* Summary Section */}
        {filteredCandidates.length > 0 &&
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {candidates.length}
                </p>
                <p className="text-xs text-gray-500">Total Candidates</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {candidates.filter((c) => c.status === 'Present').length}
                </p>
                <p className="text-xs text-gray-500">Present</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {candidates.filter((c) => c.status === 'Absent').length}
                </p>
                <p className="text-xs text-gray-500">Absent</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {candidates.filter((c) => c.status === 'Present').length > 0 ?
                Math.round(
                  candidates.
                  filter((c) => c.status === 'Present').
                  reduce((acc, c) => acc + c.total, 0) /
                  candidates.filter((c) => c.status === 'Present').
                  length
                ) :
                0}
                </p>
                <p className="text-xs text-gray-500">Average Score</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(
                  ...candidates.
                  filter((c) => c.status === 'Present').
                  map((c) => c.total),
                  0
                )}
                </p>
                <p className="text-xs text-gray-500">Highest Score</p>
              </div>
            </div>
          </div>
        }
      </Card>
    </div>);

}