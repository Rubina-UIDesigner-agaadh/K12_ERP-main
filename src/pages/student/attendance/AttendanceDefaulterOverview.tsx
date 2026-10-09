import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { AlertTriangle, Bell, Download, Mail, Phone, Search, RotateCcw, Filter, Building, Check, ChevronDown } from 'lucide-react';

// --- Constants ---
const BRANCHES = [
{ id: 'main', name: 'Main Branch', color: '#3b82f6' },
{ id: 'north', name: 'North Campus', color: '#10b981' },
{ id: 'south', name: 'South Campus', color: '#f59e0b' },
{ id: 'west', name: 'West Campus', color: '#8b5cf6' }];


const BATCHES = [
{ value: '2024-25', label: '2024-25' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


// --- Types ---
interface Defaulter {
  id: string;grNo: string;suId: string;firstName: string;lastName: string;class: string;section: string;department: string;totalDays: number;present: number;absent: number;percentage: number;parentPhone: string;parentEmail: string;branchId: string;
}

// --- Generate Branch-wise Data ---
const generateDefaulters = (): Defaulter[] => {
  const baseData = [
  { id: '1', grNo: 'GR2024001', suId: 'SU10A001', firstName: 'Rahul', lastName: 'Sharma', class: '10', section: 'A', department: 'Science', totalDays: 60, present: 42, absent: 18, percentage: 70, parentPhone: '9876543210', parentEmail: 'sharma.parent@email.com' },
  { id: '2', grNo: 'GR2024002', suId: 'SU09B002', firstName: 'Priya', lastName: 'Patel', class: '9', section: 'B', department: 'Arts', totalDays: 60, present: 45, absent: 15, percentage: 75, parentPhone: '9876543211', parentEmail: 'patel.parent@email.com' },
  { id: '3', grNo: 'GR2024003', suId: 'SU08A003', firstName: 'Amit', lastName: 'Kumar', class: '8', section: 'A', department: 'Commerce', totalDays: 60, present: 40, absent: 20, percentage: 67, parentPhone: '9876543212', parentEmail: 'kumar.parent@email.com' },
  { id: '4', grNo: 'GR2024004', suId: 'SU10B004', firstName: 'Sneha', lastName: 'Gupta', class: '10', section: 'B', department: 'Science', totalDays: 60, present: 44, absent: 16, percentage: 73, parentPhone: '9876543213', parentEmail: 'gupta.parent@email.com' },
  { id: '5', grNo: 'GR2024005', suId: 'SU09A005', firstName: 'Vikram', lastName: 'Singh', class: '9', section: 'A', department: 'Science', totalDays: 60, present: 38, absent: 22, percentage: 63, parentPhone: '9876543214', parentEmail: 'singh.parent@email.com' },
  { id: '6', grNo: 'GR2024006', suId: 'SU11A006', firstName: 'Ananya', lastName: 'Reddy', class: '11', section: 'A', department: 'Commerce', totalDays: 60, present: 41, absent: 19, percentage: 68, parentPhone: '9876543215', parentEmail: 'reddy.parent@email.com' },
  { id: '7', grNo: 'GR2024007', suId: 'SU12B007', firstName: 'Rohan', lastName: 'Mehta', class: '12', section: 'B', department: 'Arts', totalDays: 60, present: 43, absent: 17, percentage: 72, parentPhone: '9876543216', parentEmail: 'mehta.parent@email.com' },
  { id: '8', grNo: 'GR2024008', suId: 'SU10C008', firstName: 'Kavya', lastName: 'Nair', class: '10', section: 'C', department: 'Science', totalDays: 60, present: 39, absent: 21, percentage: 65, parentPhone: '9876543217', parentEmail: 'nair.parent@email.com' }];


  const allData: Defaulter[] = [];
  BRANCHES.forEach((branch, bi) => {
    baseData.forEach((student, si) => {
      if ((bi + si) % 2 === 0 || bi < 2) {
        allData.push({ ...student, id: `${branch.id}-${student.id}`, grNo: `${branch.id.toUpperCase().slice(0, 2)}${student.grNo}`, branchId: branch.id, percentage: Math.max(55, student.percentage - bi * 2) });
      }
    });
  });
  return allData;
};

const defaultersData = generateDefaulters();

// --- Multi-Select Component ---
const MultiSelect = ({ options, selected, onChange }: {options: typeof BRANCHES;selected: string[];onChange: (v: string[]) => void;}) => {
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === options.length;
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-gray-400 min-w-[180px] w-full">
        <Building className="w-4 h-4 text-gray-500" />
        <span className="flex-1 text-left">{selected.length === 0 ? 'Select Branches' : allSelected ? 'All Branches' : `${selected.length} Branch${selected.length > 1 ? 'es' : ''}`}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {open &&
      <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-full">
            <div className="p-2 border-b">
              <button onClick={() => onChange(allSelected ? [] : options.map((o) => o.id))} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded">
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{allSelected && <Check className="w-3 h-3 text-white" />}</div>Select All
              </button>
            </div>
            <div className="p-2 max-h-48 overflow-y-auto">
              {options.map((opt) =>
            <button key={opt.id} onClick={() => onChange(selected.includes(opt.id) ? selected.filter((s) => s !== opt.id) : [...selected, opt.id])} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${selected.includes(opt.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{selected.includes(opt.id) && <Check className="w-3 h-3 text-white" />}</div>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />{opt.name}
                </button>
            )}
            </div>
          </div>
        </>
      }
    </div>);

};

const BranchBadge = ({ branchId }: {branchId: string;}) => {
  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!branch) return null;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${branch.color}15`, color: branch.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />{branch.name}</span>;
};

// --- Main Component ---
export function AttendanceDefaulterOverview() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [filters, setFilters] = useState({ grNo: '', suId: '', firstName: '', lastName: '', department: '', class: '', section: '', threshold: '75', period: 'month' });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const activeBranches = useMemo(() => BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches]);

  const filteredDefaulters = useMemo(() => {
    return defaultersData.filter((student) => {
      if (!selectedBranches.includes(student.branchId)) return false;
      if (appliedFilters.grNo && !student.grNo.toLowerCase().includes(appliedFilters.grNo.toLowerCase())) return false;
      if (appliedFilters.suId && !student.suId.toLowerCase().includes(appliedFilters.suId.toLowerCase())) return false;
      if (appliedFilters.firstName && !student.firstName.toLowerCase().includes(appliedFilters.firstName.toLowerCase())) return false;
      if (appliedFilters.lastName && !student.lastName.toLowerCase().includes(appliedFilters.lastName.toLowerCase())) return false;
      if (appliedFilters.department && appliedFilters.department !== 'all' && student.department !== appliedFilters.department) return false;
      if (appliedFilters.class && appliedFilters.class !== 'all' && student.class !== appliedFilters.class) return false;
      if (appliedFilters.section && appliedFilters.section !== 'all' && student.section !== appliedFilters.section) return false;
      if (student.percentage >= parseInt(appliedFilters.threshold)) return false;
      return true;
    });
  }, [appliedFilters, selectedBranches]);

  const branchStats = useMemo(() => {
    return selectedBranches.map((id) => {
      const branch = BRANCHES.find((b) => b.id === id)!;
      const branchDefaulters = filteredDefaulters.filter((d) => d.branchId === id);
      return { ...branch, total: branchDefaulters.length, critical: branchDefaulters.filter((d) => d.percentage < 65).length, warning: branchDefaulters.filter((d) => d.percentage >= 65 && d.percentage < 75).length };
    });
  }, [filteredDefaulters, selectedBranches]);

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleApplyFilters = () => setAppliedFilters(filters);
  const handleResetFilters = () => {const reset = { grNo: '', suId: '', firstName: '', lastName: '', department: '', class: '', section: '', threshold: '75', period: 'month' };setFilters(reset);setAppliedFilters(reset);};
  const hasActiveFilters = () => filters.grNo || filters.suId || filters.firstName || filters.lastName || filters.department && filters.department !== 'all' || filters.class && filters.class !== 'all' || filters.section && filters.section !== 'all';

  const columns = [
  { key: 'grNo', header: 'GR No', render: (row: Defaulter) => <span className="font-mono text-sm text-gray-700">{row.grNo}</span> },
  { key: 'suId', header: 'SU ID', render: (row: Defaulter) => <span className="font-mono text-sm text-gray-700">{row.suId}</span> },
  { key: 'name', header: 'Student Name', render: (row: Defaulter) => <div><p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p><p className="text-sm text-gray-500">Class {row.class}-{row.section} | {row.department}</p></div> },
  ...(selectedBranches.length > 1 ? [{ key: 'branch', header: 'Branch', render: (row: Defaulter) => <BranchBadge branchId={row.branchId} /> }] : []),
  { key: 'totalDays', header: 'Working Days', render: (row: Defaulter) => <span className="text-gray-600">{row.totalDays}</span> },
  { key: 'present', header: 'Present', render: (row: Defaulter) => <span className="text-green-600 font-medium">{row.present}</span> },
  { key: 'absent', header: 'Absent', render: (row: Defaulter) => <span className="text-red-600 font-medium">{row.absent}</span> },
  { key: 'percentage', header: 'Attendance %', render: (row: Defaulter) => <Badge variant={row.percentage >= 70 ? 'warning' : 'danger'}>{row.percentage}%</Badge> },
  { key: 'actions', header: 'Actions', render: (row: Defaulter) => <div className="flex gap-2"><Button variant="ghost" size="sm" title={`Call ${row.parentPhone}`} onClick={() => window.open(`tel:${row.parentPhone}`)}><Phone className="w-4 h-4" /></Button><Button variant="ghost" size="sm" title={`Email ${row.parentEmail}`} onClick={() => window.open(`mailto:${row.parentEmail}`)}><Mail className="w-4 h-4" /></Button></div> }];


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Defaulter Overview</h1>
          <p className="text-gray-500 mt-1">Students with attendance below threshold</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MultiSelect options={BRANCHES} selected={selectedBranches} onChange={setSelectedBranches} />
          <Select value={selectedBatch} onChange={(value) => setSelectedBatch(value)} options={BATCHES} className="min-w-[120px]" />
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button variant="primary"><Bell className="w-4 h-4 mr-2" />Send Alert</Button>
        </div>
      </div>

      {/* Active Branch Filter Display */}
      {selectedBranches.length > 0 &&
      <div className="flex items-center gap-2 flex-wrap p-3 bg-white rounded-lg border">
          <span className="text-xs font-medium text-gray-500">Active:</span>
          {activeBranches.map((b) => <BranchBadge key={b.id} branchId={b.id} />)}
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs font-medium text-gray-600">Batch: {selectedBatch}</span>
        </div>
      }

      {selectedBranches.length === 0 ?
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <Building className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-semibold text-yellow-800">No Branch Selected</h3>
          <p className="text-sm text-yellow-600">Please select at least one branch to view defaulter data</p>
        </div> :

      <>
          {/* Alert Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Attention Required</h3>
              <p className="text-sm text-red-600 mt-1">{filteredDefaulters.length} students have attendance below {appliedFilters.threshold}%. Immediate action is recommended.</p>
            </div>
          </div>

          {/* Search & Filters Card */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer" onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
              <div className="flex items-center gap-2"><Filter className="w-5 h-5 text-gray-500" /><h3 className="font-medium text-gray-700">Search & Filters</h3>{hasActiveFilters() && <Badge variant="primary" className="ml-2">Active</Badge>}</div>
              <Button variant="ghost" size="sm">{isFilterExpanded ? 'Collapse' : 'Expand'}</Button>
            </div>
            {isFilterExpanded &&
          <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input label="GR Number" placeholder="Search by GR No..." value={filters.grNo} onChange={(e) => handleFilterChange('grNo', e.target.value)} icon={<Search className="w-4 h-4 text-gray-400" />} />
                  <Input label="SU ID" placeholder="Search by SU ID..." value={filters.suId} onChange={(e) => handleFilterChange('suId', e.target.value)} icon={<Search className="w-4 h-4 text-gray-400" />} />
                  <Input label="First Name" placeholder="Search by first name..." value={filters.firstName} onChange={(e) => handleFilterChange('firstName', e.target.value)} icon={<Search className="w-4 h-4 text-gray-400" />} />
                  <Input label="Last Name" placeholder="Search by last name..." value={filters.lastName} onChange={(e) => handleFilterChange('lastName', e.target.value)} icon={<Search className="w-4 h-4 text-gray-400" />} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select label="Department" value={filters.department} onChange={(value) => handleFilterChange('department', value)} options={[{ value: 'all', label: 'All Departments' }, { value: 'Science', label: 'Science' }, { value: 'Arts', label: 'Arts' }, { value: 'Commerce', label: 'Commerce' }]} placeholder="Select Department" />
                  <Select label="Class" value={filters.class} onChange={(value) => handleFilterChange('class', value)} options={[{ value: 'all', label: 'All Classes' }, { value: '8', label: 'Class 8' }, { value: '9', label: 'Class 9' }, { value: '10', label: 'Class 10' }, { value: '11', label: 'Class 11' }, { value: '12', label: 'Class 12' }]} placeholder="Select Class" />
                  <Select label="Section" value={filters.section} onChange={(value) => handleFilterChange('section', value)} options={[{ value: 'all', label: 'All Sections' }, { value: 'A', label: 'Section A' }, { value: 'B', label: 'Section B' }, { value: 'C', label: 'Section C' }, { value: 'D', label: 'Section D' }]} placeholder="Select Section" />
                  <Select label="Threshold" value={filters.threshold} onChange={(value) => handleFilterChange('threshold', value)} options={[{ value: '75', label: 'Below 75%' }, { value: '70', label: 'Below 70%' }, { value: '65', label: 'Below 65%' }, { value: '60', label: 'Below 60%' }]} />
                  <Select label="Period" value={filters.period} onChange={(value) => handleFilterChange('period', value)} options={[{ value: 'week', label: 'This Week' }, { value: 'month', label: 'This Month' }, { value: 'quarter', label: 'This Quarter' }, { value: 'semester', label: 'This Semester' }, { value: 'year', label: 'This Year' }]} />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">Showing {filteredDefaulters.length} defaulters</div>
                  <div className="flex gap-2"><Button variant="outline" onClick={handleResetFilters}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button><Button variant="primary" onClick={handleApplyFilters}><Search className="w-4 h-4 mr-2" />Apply</Button></div>
                </div>
              </div>
          }
          </Card>

          {/* Branch-wise Summary Statistics */}
          {selectedBranches.length > 1 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {branchStats.map((branch) =>
          <Card key={branch.id} className="p-4" style={{ borderLeftWidth: 4, borderLeftColor: branch.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">{branch.name}</span>
                    <span className="text-2xl font-bold" style={{ color: branch.color }}>{branch.total}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Critical (&lt;65%)</span><span className="font-medium text-red-600">{branch.critical}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Warning (65-74%)</span><span className="font-medium text-yellow-600">{branch.warning}</span></div>
                  </div>
                </Card>
          )}
            </div> :

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Total Defaulters</p><p className="text-2xl font-bold text-gray-900">{filteredDefaulters.length}</p></div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Critical (&lt;65%)</p><p className="text-2xl font-bold text-red-600">{filteredDefaulters.filter((d) => d.percentage < 65).length}</p></div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Warning (65-74%)</p><p className="text-2xl font-bold text-yellow-600">{filteredDefaulters.filter((d) => d.percentage >= 65 && d.percentage < 75).length}</p></div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Alerts Sent Today</p><p className="text-2xl font-bold text-blue-600">12</p></div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Bell className="w-6 h-6 text-blue-600" /></div>
                </div>
              </Card>
            </div>
        }

          {/* Overall Summary when multiple branches */}
          {selectedBranches.length > 1 &&
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-r from-red-50 to-white border-red-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Total Defaulters (All Branches)</p><p className="text-2xl font-bold text-red-600">{filteredDefaulters.length}</p></div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-red-50 to-white border-red-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Critical (&lt;65%)</p><p className="text-2xl font-bold text-red-600">{filteredDefaulters.filter((d) => d.percentage < 65).length}</p></div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-white border-yellow-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Warning (65-74%)</p><p className="text-2xl font-bold text-yellow-600">{filteredDefaulters.filter((d) => d.percentage >= 65 && d.percentage < 75).length}</p></div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-white border-blue-200">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">Alerts Sent Today</p><p className="text-2xl font-bold text-blue-600">12</p></div>
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
              </Card>
            </div>
        }

          {/* Defaulters Table */}
          <Card title={`Defaulter List (${filteredDefaulters.length} students)`} noPadding>
            {filteredDefaulters.length > 0 ?
          <Table columns={columns} data={filteredDefaulters} /> :

          <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-400" /></div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No defaulters found</h3>
                <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
                <Button variant="outline" className="mt-4" onClick={handleResetFilters}>Reset Filters</Button>
              </div>
          }
          </Card>
        </>
      }
    </div>);

}

export default AttendanceDefaulterOverview;