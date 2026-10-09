// AttendanceDefaulterList.tsx
import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { AlertTriangle, Mail, MessageSquare, Download, Building2, ChevronDown, Check, X, Users, Phone, Calendar, Filter, RefreshCcw } from 'lucide-react';

// Constants
const BRANCHES = [
{ id: 'main', name: 'Main Campus', city: 'Delhi', color: 'bg-blue-500' },
{ id: 'north', name: 'North Branch', city: 'Noida', color: 'bg-green-500' },
{ id: 'south', name: 'South Branch', city: 'Gurgaon', color: 'bg-purple-500' },
{ id: 'east', name: 'East Branch', city: 'Faridabad', color: 'bg-orange-500' }];


const BATCHES = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

// Branch-wise Defaulter Data
const branchDefaulterData: Record<string, any[]> = {
  main: [
  { id: '1', name: 'Rohan Gupta', class: '10-A', attendance: 65, absentDays: 12, parent: 'Suresh Gupta', contact: '9876543210', status: 'Critical', lastPresent: '2025-02-20' },
  { id: '2', name: 'Sneha Singh', class: '10-A', attendance: 72, absentDays: 8, parent: 'Raj Singh', contact: '9876543211', status: 'Warning', lastPresent: '2025-02-22' },
  { id: '3', name: 'Amit Sharma', class: '9-B', attendance: 68, absentDays: 10, parent: 'Vikram Sharma', contact: '9876543212', status: 'Critical', lastPresent: '2025-02-18' },
  { id: '4', name: 'Priya Patel', class: '11-A', attendance: 74, absentDays: 7, parent: 'Ramesh Patel', contact: '9876543213', status: 'Warning', lastPresent: '2025-02-23' }],

  north: [
  { id: '5', name: 'Rahul Kumar', class: '10-B', attendance: 62, absentDays: 14, parent: 'Anil Kumar', contact: '9876543214', status: 'Critical', lastPresent: '2025-02-15' },
  { id: '6', name: 'Kavita Rao', class: '9-A', attendance: 70, absentDays: 9, parent: 'Suresh Rao', contact: '9876543215', status: 'Warning', lastPresent: '2025-02-21' },
  { id: '7', name: 'Vijay Verma', class: '12-A', attendance: 58, absentDays: 16, parent: 'Mohan Verma', contact: '9876543216', status: 'Critical', lastPresent: '2025-02-10' }],

  south: [
  { id: '8', name: 'Anita Desai', class: '10-A', attendance: 71, absentDays: 9, parent: 'Prakash Desai', contact: '9876543217', status: 'Warning', lastPresent: '2025-02-22' },
  { id: '9', name: 'Sanjay Joshi', class: '11-B', attendance: 64, absentDays: 13, parent: 'Ramesh Joshi', contact: '9876543218', status: 'Critical', lastPresent: '2025-02-17' },
  { id: '10', name: 'Meera Nair', class: '9-C', attendance: 73, absentDays: 8, parent: 'Gopal Nair', contact: '9876543219', status: 'Warning', lastPresent: '2025-02-23' }],

  east: [
  { id: '11', name: 'Ravi Malhotra', class: '10-C', attendance: 66, absentDays: 11, parent: 'Arun Malhotra', contact: '9876543220', status: 'Critical', lastPresent: '2025-02-19' },
  { id: '12', name: 'Pooja Sharma', class: '12-B', attendance: 69, absentDays: 10, parent: 'Vijay Sharma', contact: '9876543221', status: 'Warning', lastPresent: '2025-02-20' }]

};

export function AttendanceDefaulterList() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [threshold, setThreshold] = useState('75');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const isAllSelected = selectedBranches.length === 0 || selectedBranches.length === BRANCHES.length;
  const activeBranches = useMemo(() => isAllSelected ? BRANCHES : BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches, isAllSelected]);

  const toggleBranch = (id: string) => {
    if (id === 'all') setSelectedBranches([]);else
    setSelectedBranches((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  // Aggregated Defaulters
  const aggregatedDefaulters = useMemo(() => {
    const defaulters: any[] = [];
    activeBranches.forEach((branch) => {
      branchDefaulterData[branch.id]?.forEach((d) => {
        if (d.attendance < parseInt(threshold)) {
          defaulters.push({ ...d, branchId: branch.id, branchName: branch.name, branchColor: branch.color });
        }
      });
    });
    return defaulters.sort((a, b) => a.attendance - b.attendance);
  }, [activeBranches, threshold]);

  // Stats
  const stats = useMemo(() => ({
    total: aggregatedDefaulters.length,
    critical: aggregatedDefaulters.filter((d) => d.status === 'Critical').length,
    warning: aggregatedDefaulters.filter((d) => d.status === 'Warning').length,
    avgAttendance: aggregatedDefaulters.length > 0 ? (aggregatedDefaulters.reduce((sum, d) => sum + d.attendance, 0) / aggregatedDefaulters.length).toFixed(1) : '0'
  }), [aggregatedDefaulters]);

  const columns = [
  {
    key: 'student',
    header: 'Student Details',
    render: (row: any) =>
    <div className="flex items-center gap-3">
          {activeBranches.length > 1 && <span className={`w-2 h-2 rounded-full ${row.branchColor}`} title={row.branchName} />}
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.class} {activeBranches.length > 1 && `• ${row.branchName}`}</div>
          </div>
        </div>

  },
  {
    key: 'stats',
    header: 'Attendance Stats',
    render: (row: any) =>
    <div className="text-sm">
          <div className={`font-bold ${row.attendance < 70 ? 'text-red-600' : 'text-orange-600'}`}>{row.attendance}% Present</div>
          <div className="text-xs text-gray-500">{row.absentDays} Days Absent</div>
        </div>

  },
  {
    key: 'lastPresent',
    header: 'Last Present',
    render: (row: any) =>
    <div className="text-sm">
          <div className="text-gray-700">{row.lastPresent}</div>
          <div className="text-xs text-gray-500">{Math.floor((new Date().getTime() - new Date(row.lastPresent).getTime()) / (1000 * 60 * 60 * 24))} days ago</div>
        </div>

  },
  {
    key: 'parent',
    header: 'Parent Contact',
    render: (row: any) =>
    <div className="text-sm">
          <div className="text-gray-900">{row.parent}</div>
          <div className="text-blue-600 flex items-center gap-1"><Phone className="w-3 h-3" />{row.contact}</div>
        </div>

  },
  {
    key: 'status',
    header: 'Risk Level',
    render: (row: any) => <Badge variant={row.status === 'Critical' ? 'danger' : 'warning'}>{row.status}</Badge>
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: any) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="sm" title="Send SMS"><MessageSquare className="w-4 h-4 text-blue-600" /></Button>
          <Button variant="ghost" size="sm" title="Send Email"><Mail className="w-4 h-4 text-green-600" /></Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-orange-600" />
            Attendance Defaulter List
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track students with low attendance • Batch: {selectedBatch}</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Batch Select */}
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Branch Multi-Select */}
          <div className="relative">
            <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[180px]">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-left">{isAllSelected ? 'All Branches' : `${selectedBranches.length} Selected`}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showBranchDropdown &&
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div onClick={() => toggleBranch('all')} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isAllSelected ? 'bg-blue-50' : ''}`}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isAllSelected && <Check className="w-3 h-3 text-white" />}</div>
                    <span className="text-sm font-medium">All Branches</span>
                  </div>
                  <div className="border-t my-2" />
                  {BRANCHES.map((branch) => {
                  const isSelected = selectedBranches.includes(branch.id);
                  return (
                    <div key={branch.id} onClick={() => toggleBranch(branch.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                        <span className={`w-3 h-3 rounded-full ${branch.color}`} />
                        <div><p className="text-sm font-medium">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div>
                      </div>);

                })}
                </div>
                <div className="border-t p-2"><button onClick={() => setShowBranchDropdown(false)} className="w-full py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">Apply</button></div>
              </div>
            }
          </div>

          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export List</Button>
        </div>
      </div>

      {/* Selected Branches Tags */}
      {!isAllSelected && selectedBranches.length > 0 &&
      <div className="flex flex-wrap gap-2">
          {selectedBranches.map((id) => {
          const branch = BRANCHES.find((b) => b.id === id);
          return branch &&
          <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm">
                <span className={`w-2 h-2 rounded-full ${branch.color}`} />{branch.name}
                <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => toggleBranch(id)} />
              </span>;

        })}
          <button onClick={() => setSelectedBranches([])} className="text-sm text-blue-600 hover:text-blue-800 px-2">Clear All</button>
        </div>
      }

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Total Defaulters</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center"><Users className="w-6 h-6 text-orange-600" /></div>
          </div>
          {activeBranches.length > 1 &&
          <div className="mt-3 pt-3 border-t space-y-1">
              {activeBranches.map((b) => <div key={b.id} className="flex items-center justify-between text-xs"><div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${b.color}`} /><span className="text-gray-500">{b.name}</span></div><span className="font-medium">{branchDefaulterData[b.id]?.filter((d) => d.attendance < parseInt(threshold)).length || 0}</span></div>)}
            </div>
          }
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm bg-red-50">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-red-600">Critical</p><p className="text-2xl font-bold text-red-700">{stats.critical}</p></div>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
          </div>
          <p className="text-xs text-red-500 mt-2">Below 70% attendance</p>
        </div>
        <div className="bg-white rounded-xl border border-yellow-200 p-4 shadow-sm bg-yellow-50">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-yellow-600">Warning</p><p className="text-2xl font-bold text-yellow-700">{stats.warning}</p></div>
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">70-75% attendance</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Avg Attendance</p><p className="text-2xl font-bold text-gray-900">{stats.avgAttendance}%</p></div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Among defaulters</p>
        </div>
      </div>

      {/* Branch-wise Summary (when multiple branches selected) */}
      {activeBranches.length > 1 &&
      <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Branch-wise Defaulter Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Branch', 'Total Defaulters', 'Critical', 'Warning', 'Avg Attendance'].map((h) =>
                <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeBranches.map((branch) => {
                const branchDefaults = branchDefaulterData[branch.id]?.filter((d) => d.attendance < parseInt(threshold)) || [];
                const critical = branchDefaults.filter((d) => d.status === 'Critical').length;
                const warning = branchDefaults.filter((d) => d.status === 'Warning').length;
                const avg = branchDefaults.length > 0 ? (branchDefaults.reduce((s, d) => s + d.attendance, 0) / branchDefaults.length).toFixed(1) : '-';
                return (
                  <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${branch.color}`} />
                          <div><p className="font-medium text-gray-900">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{branchDefaults.length}</td>
                      <td className="py-3 px-4"><Badge variant="danger">{critical}</Badge></td>
                      <td className="py-3 px-4"><Badge variant="warning">{warning}</Badge></td>
                      <td className="py-3 px-4 font-medium text-gray-700">{avg}%</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Select
            label="Department"
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={[
            { value: '', label: 'All Department' },
            { value: 'science', label: 'Science' },
            { value: 'arts', label: 'Arts' },
            { value: 'commerce', label: 'Commerce' }]
            }
            placeholder="Select Department" />

          <Select
            label="Class"
            value={selectedClass}
            onChange={setSelectedClass}
            options={[
            { value: '', label: 'All Classes' },
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' }]
            }
            placeholder="Class" />

          <Select
            label="Section"
            value={selectedSection}
            onChange={setSelectedSection}
            options={[
            { value: '', label: 'All Sections' },
            { value: 'A', label: 'Section A' },
            { value: 'B', label: 'Section B' },
            { value: 'C', label: 'Section C' },
            { value: 'D', label: 'Section D' }]
            }
            placeholder="Section" />

          <Select
            label="Threshold"
            value={threshold}
            onChange={setThreshold}
            options={[
            { value: '75', label: 'Below 75%' },
            { value: '70', label: 'Below 70%' },
            { value: '60', label: 'Below 60%' },
            { value: '50', label: 'Below 50%' }]
            } />

          <Input type="date" label="From" value={dateFrom} onChange={(e: any) => setDateFrom(e.target.value)} />
          <Input type="date" label="To" value={dateTo} onChange={(e: any) => setDateTo(e.target.value)} />
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="primary">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Find Defaulters
          </Button>
          <Button variant="outline">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Defaulters Table */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Defaulter Students</h3>
            <p className="text-sm text-gray-500">{aggregatedDefaulters.length} students below {threshold}% attendance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Bulk SMS
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Send Bulk Email
            </Button>
          </div>
        </div>
        {aggregatedDefaulters.length > 0 ?
        <Table columns={columns} data={aggregatedDefaulters} /> :

        <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No defaulters found with current filters</p>
          </div>
        }
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
          { icon: MessageSquare, label: 'Send SMS to All', color: 'blue', count: stats.total },
          { icon: Mail, label: 'Send Email to All', color: 'green', count: stats.total },
          { icon: AlertTriangle, label: 'Notify Critical Only', color: 'red', count: stats.critical },
          { icon: Download, label: 'Download Report', color: 'purple', count: null }].
          map((action, i) =>
          <button key={i} className={`flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all group`}>
              <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center`}>
                <action.icon className={`w-5 h-5 text-${action.color}-600`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{action.label}</p>
                {action.count !== null && <p className="text-xs text-gray-500">{action.count} students</p>}
              </div>
            </button>
          )}
        </div>
      </Card>
    </div>);

}

export default AttendanceDefaulterList;