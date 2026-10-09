import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Users,
  User,
  UserCheck,
  UserPlus,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  RefreshCw,
  Upload,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Lock,
  Unlock,
  GitBranch,
  ArrowRight,
  ArrowUpRight,
  Building,
  Briefcase,
  Crown,
  Star,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Database,
  Layers,
  Network,
  Workflow,
  Link2,
  Zap,
  Target,
  Flag,
  CheckSquare,
  Square,
  History,
  Clock } from
'lucide-react';
export function LeaveHierarchyListing() {
  const [sortColumn, setSortColumn] = useState('department');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const hierarchyRules = [
  {
    id: 'RULE001',
    requesterType: 'grade',
    requesterGrade: 'Junior Level (L1-L3)',
    requesterDepartment: 'All Departments',
    approverLevel1: 'Direct Manager',
    approverLevel1Name: 'Reporting Manager',
    approverLevel2: 'Department Head',
    approverLevel2Name: 'Department Head',
    approverLevel3: null,
    skipLevel1Condition: 'Never',
    autoApproveCondition: 'Leave <= 1 day',
    priority: 1,
    status: 'active',
    createdBy: 'Admin',
    createdOn: '2024-01-15',
    modifiedOn: '2024-01-20',
    applicableLeaveTypes: ['CL', 'SL', 'PL'],
    maxDaysLevel1: 3,
    maxDaysLevel2: 7,
    escalationTime: 24
  },
  {
    id: 'RULE002',
    requesterType: 'grade',
    requesterGrade: 'Mid Level (L4-L6)',
    requesterDepartment: 'All Departments',
    approverLevel1: 'Department Head',
    approverLevel1Name: 'Department Head',
    approverLevel2: 'HR Manager',
    approverLevel2Name: 'Jane Smith (HR)',
    approverLevel3: null,
    skipLevel1Condition: 'Leave > 5 days',
    autoApproveCondition: 'Never',
    priority: 2,
    status: 'active',
    createdBy: 'Admin',
    createdOn: '2024-01-15',
    modifiedOn: '2024-01-15',
    applicableLeaveTypes: ['All'],
    maxDaysLevel1: 7,
    maxDaysLevel2: 15,
    escalationTime: 48
  },
  {
    id: 'RULE003',
    requesterType: 'grade',
    requesterGrade: 'Senior Level (L7-L9)',
    requesterDepartment: 'All Departments',
    approverLevel1: 'CEO/CTO',
    approverLevel1Name: 'Executive Management',
    approverLevel2: null,
    approverLevel2Name: null,
    approverLevel3: null,
    skipLevel1Condition: 'Never',
    autoApproveCondition: 'Never',
    priority: 3,
    status: 'active',
    createdBy: 'Admin',
    createdOn: '2024-01-15',
    modifiedOn: '2024-01-15',
    applicableLeaveTypes: ['All'],
    maxDaysLevel1: 30,
    maxDaysLevel2: null,
    escalationTime: 72
  },
  {
    id: 'RULE004',
    requesterType: 'department',
    requesterGrade: 'All Grades',
    requesterDepartment: 'Engineering',
    approverLevel1: 'James Taylor',
    approverLevel1Name: 'James Taylor (Tech Lead)',
    approverLevel2: 'CTO',
    approverLevel2Name: 'Chief Technology Officer',
    approverLevel3: 'CEO',
    skipLevel1Condition: 'Manager on leave',
    autoApproveCondition: 'Comp-off leaves',
    priority: 4,
    status: 'active',
    createdBy: 'HR Head',
    createdOn: '2024-01-16',
    modifiedOn: '2024-01-25',
    applicableLeaveTypes: ['All'],
    maxDaysLevel1: 5,
    maxDaysLevel2: 15,
    escalationTime: 24
  },
  {
    id: 'RULE005',
    requesterType: 'department',
    requesterGrade: 'All Grades',
    requesterDepartment: 'Sales',
    approverLevel1: 'Sales Head',
    approverLevel1Name: 'Robert Brown (Sales Head)',
    approverLevel2: 'COO',
    approverLevel2Name: 'Chief Operating Officer',
    approverLevel3: null,
    skipLevel1Condition: 'Never',
    autoApproveCondition: 'Never',
    priority: 5,
    status: 'active',
    createdBy: 'HR Head',
    createdOn: '2024-01-16',
    modifiedOn: '2024-01-16',
    applicableLeaveTypes: ['All'],
    maxDaysLevel1: 3,
    maxDaysLevel2: 10,
    escalationTime: 12
  },
  {
    id: 'RULE006',
    requesterType: 'employee',
    requesterGrade: 'Specific Employee',
    requesterDepartment: 'HR',
    requesterEmployee: 'Jane Smith (EMP002)',
    approverLevel1: 'CEO',
    approverLevel1Name: 'Chief Executive Officer',
    approverLevel2: null,
    approverLevel2Name: null,
    approverLevel3: null,
    skipLevel1Condition: 'Never',
    autoApproveCondition: 'Never',
    priority: 6,
    status: 'active',
    createdBy: 'Admin',
    createdOn: '2024-01-17',
    modifiedOn: '2024-01-17',
    applicableLeaveTypes: ['All'],
    maxDaysLevel1: 30,
    maxDaysLevel2: null,
    escalationTime: 48
  },
  {
    id: 'RULE007',
    requesterType: 'grade',
    requesterGrade: 'Contract Employees',
    requesterDepartment: 'All Departments',
    approverLevel1: 'Direct Manager',
    approverLevel1Name: 'Reporting Manager',
    approverLevel2: 'HR Manager',
    approverLevel2Name: 'Jane Smith (HR)',
    approverLevel3: null,
    skipLevel1Condition: 'Never',
    autoApproveCondition: 'Never',
    priority: 7,
    status: 'inactive',
    createdBy: 'HR Head',
    createdOn: '2024-01-18',
    modifiedOn: '2024-01-20',
    applicableLeaveTypes: ['LOP'],
    maxDaysLevel1: 2,
    maxDaysLevel2: 5,
    escalationTime: 24
  },
  {
    id: 'RULE008',
    requesterType: 'department',
    requesterGrade: 'All Grades',
    requesterDepartment: 'Finance',
    approverLevel1: 'Finance Head',
    approverLevel1Name: 'Michael Johnson (Finance Head)',
    approverLevel2: 'CFO',
    approverLevel2Name: 'Chief Financial Officer',
    approverLevel3: null,
    skipLevel1Condition: 'Leave > 7 days',
    autoApproveCondition: 'Never',
    priority: 8,
    status: 'active',
    createdBy: 'Admin',
    createdOn: '2024-01-19',
    modifiedOn: '2024-01-19',
    applicableLeaveTypes: ['All'],
    maxDaysLevel1: 5,
    maxDaysLevel2: 15,
    escalationTime: 24
  }];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const SortIcon = ({ column }) => {
    if (sortColumn !== column)
    return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :

    <ChevronDown className="w-3 h-3 text-blue-600" />;

  };
  const getRequesterBadge = (type, grade) => {
    if (type === 'grade') {
      return (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">{grade}</span>
        </div>);

    } else if (type === 'department') {
      return (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900">{grade}</span>
        </div>);

    } else {
      return (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-900">{grade}</span>
        </div>);

    }
  };
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectedRows.length === hierarchyRules.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(hierarchyRules.map((rule) => rule.id));
    }
  };
  const activeRulesCount = hierarchyRules.filter(
    (r) => r.status === 'active'
  ).length;
  const inactiveRulesCount = hierarchyRules.filter(
    (r) => r.status === 'inactive'
  ).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Hierarchy Listing
          </h1>
          <p className="text-sm text-gray-500">
            Configure approval workflow and hierarchy rules for leave
            applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Rules
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Rule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <GitBranch className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {hierarchyRules.length}
          </p>
          <p className="text-xs text-blue-600">Hierarchy Rules</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Enabled</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {activeRulesCount}
          </p>
          <p className="text-xs text-green-600">Active Rules</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <Unlock className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Disabled</span>
          </div>
          <p className="text-2xl font-bold text-gray-700">
            {inactiveRulesCount}
          </p>
          <p className="text-xs text-gray-600">Inactive Rules</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Levels</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">3</p>
          <p className="text-xs text-purple-600">Max Approval Levels</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Building className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">
              Coverage
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-700">5</p>
          <p className="text-xs text-orange-600">Departments</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-teal-600 font-medium">Auto</span>
          </div>
          <p className="text-2xl font-bold text-teal-700">3</p>
          <p className="text-xs text-teal-600">Auto-Approve Rules</p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by grade, department, approver..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72" />

              </div>
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'grade',
                  label: 'Grade-based'
                },
                {
                  value: 'department',
                  label: 'Department-based'
                },
                {
                  value: 'employee',
                  label: 'Employee-specific'
                }]
                }
                defaultValue="all" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'active',
                  label: 'Active'
                },
                {
                  value: 'inactive',
                  label: 'Inactive'
                }]
                }
                defaultValue="all" />

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Rules
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {selectedRows.length > 0 &&
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                <span className="font-semibold">{selectedRows.length}</span>{' '}
                rule(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-sm py-1 px-3">
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicate
                </Button>
                <Button variant="outline" className="text-sm py-1 px-3">
                  <ToggleLeft className="w-3 h-3 mr-1" />
                  Disable
                </Button>
                <Button
                variant="outline"
                className="text-sm py-1 px-3 text-red-600 border-red-300 hover:bg-red-50">

                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Selected
                </Button>
                <Button
                variant="outline"
                className="text-sm py-1 px-3"
                onClick={() => setSelectedRows([])}>

                  Clear Selection
                </Button>
              </div>
            </div>
          }

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-3 text-left sticky left-0 bg-gray-50 z-20 border-r">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.length === hierarchyRules.length}
                        onChange={toggleSelectAll} />

                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-10 bg-gray-50 z-20 border-r min-w-[80px]">
                      Rule ID
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      Priority
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[250px]"
                      onClick={() => handleSort('requester')}>

                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Requester (Employee/Grade)
                        <SortIcon column="requester" />
                      </div>
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                      onClick={() => handleSort('department')}>

                      <div className="flex items-center gap-1">
                        Department
                        <SortIcon column="department" />
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Approver Level 1
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Approver Level 2
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Approver Level 3
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Conditions
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Leave Types
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] border-l">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hierarchyRules.map((rule, index) =>
                  <tr
                    key={rule.id}
                    className={`hover:bg-blue-50/50 ${selectedRows.includes(rule.id) ? 'bg-blue-50' : rule.status === 'inactive' ? 'bg-gray-50 opacity-75' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>

                      <td className="px-3 py-3 sticky left-0 bg-inherit border-r">
                        <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={selectedRows.includes(rule.id)}
                        onChange={() => toggleRowSelection(rule.id)} />

                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-blue-600 sticky left-10 bg-inherit border-r">
                        {rule.id}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                        className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${rule.priority <= 3 ? 'bg-red-100 text-red-700' : rule.priority <= 6 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>

                          {rule.priority}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          {getRequesterBadge(
                          rule.requesterType,
                          rule.requesterGrade
                        )}
                          {rule.requesterEmployee &&
                        <p className="text-xs text-gray-500 ml-6">
                              {rule.requesterEmployee}
                            </p>
                        }
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${rule.requesterDepartment === 'All Departments' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>

                          {rule.requesterDepartment}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              L1
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {rule.approverLevel1}
                            </p>
                            <p className="text-xs text-gray-500">
                              {rule.approverLevel1Name}
                            </p>
                            {rule.maxDaysLevel1 &&
                          <span className="text-xs text-blue-600">
                                Max: {rule.maxDaysLevel1} days
                              </span>
                          }
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {rule.approverLevel2 ?
                      <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                L2
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {rule.approverLevel2}
                              </p>
                              <p className="text-xs text-gray-500">
                                {rule.approverLevel2Name}
                              </p>
                              {rule.maxDaysLevel2 &&
                          <span className="text-xs text-blue-600">
                                  Max: {rule.maxDaysLevel2} days
                                </span>
                          }
                            </div>
                          </div> :

                      <span className="text-sm text-gray-400">—</span>
                      }
                      </td>
                      <td className="px-3 py-3">
                        {rule.approverLevel3 ?
                      <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                L3
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {rule.approverLevel3}
                              </p>
                            </div>
                          </div> :

                      <span className="text-sm text-gray-400">—</span>
                      }
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          {rule.autoApproveCondition !== 'Never' &&
                        <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-700">
                                Auto: {rule.autoApproveCondition}
                              </span>
                            </div>
                        }
                          {rule.skipLevel1Condition !== 'Never' &&
                        <div className="flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3 text-orange-500" />
                              <span className="text-xs text-orange-700">
                                Skip L1: {rule.skipLevel1Condition}
                              </span>
                            </div>
                        }
                          {rule.escalationTime &&
                        <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-700">
                                Escalate: {rule.escalationTime}hrs
                              </span>
                            </div>
                        }
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {rule.applicableLeaveTypes[0] === 'All' ?
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            All Types
                          </span> :

                      <div className="flex flex-wrap gap-1 justify-center">
                            {rule.applicableLeaveTypes.map((type) =>
                        <span
                          key={type}
                          className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">

                                {type}
                              </span>
                        )}
                          </div>
                      }
                      </td>
                      <td className="px-3 py-3 text-center">
                        {rule.status === 'active' ?
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span> :

                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                      }
                      </td>
                      <td className="px-3 py-3 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button
                          className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Rule"
                          onClick={() => setEditingRow(rule.id)}>

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Duplicate Rule">

                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                          {rule.status === 'active' ?
                        <button
                          className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Disable Rule">

                              <ToggleRight className="w-4 h-4 text-orange-500" />
                            </button> :

                        <button
                          className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                          title="Enable Rule">

                              <ToggleLeft className="w-4 h-4 text-green-500" />
                            </button>
                        }
                          <button
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Rule">

                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                          <button
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title="More Options">

                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-medium">1-{hierarchyRules.length}</span>{' '}
                of <span className="font-medium">{hierarchyRules.length}</span>{' '}
                rules
              </p>
              <Select
                options={[
                {
                  value: '10',
                  label: '10 per page'
                },
                {
                  value: '25',
                  label: '25 per page'
                },
                {
                  value: '50',
                  label: '50 per page'
                },
                {
                  value: '100',
                  label: '100 per page'
                }]
                }
                defaultValue="25" />

            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                1
              </span>
              <Button variant="outline" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Hierarchy Overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rules Coverage</span>
              <span className="text-sm font-semibold text-green-600">100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: '100%'
                }}>
              </div>
            </div>

            <div className="space-y-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Grade-based Rules
                  </span>
                </div>
                <span className="text-sm font-semibold">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Department Rules
                  </span>
                </div>
                <span className="text-sm font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">
                    Employee Specific
                  </span>
                </div>
                <span className="text-sm font-semibold">1</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Approval Levels Used
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Single Level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: '25%'
                        }}>
                      </div>
                    </div>
                    <span className="text-xs font-medium">2</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Two Levels</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: '62.5%'
                        }}>
                      </div>
                    </div>
                    <span className="text-xs font-medium">5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Three Levels</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: '12.5%'
                        }}>
                      </div>
                    </div>
                    <span className="text-xs font-medium">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Common Approvers">
          <div className="space-y-3">
            {[
            {
              name: 'CEO',
              role: 'Chief Executive Officer',
              count: 3,
              type: 'executive'
            },
            {
              name: 'HR Manager',
              role: 'Jane Smith',
              count: 2,
              type: 'hr'
            },
            {
              name: 'Department Head',
              role: 'Various',
              count: 4,
              type: 'manager'
            },
            {
              name: 'Direct Manager',
              role: 'Reporting Manager',
              count: 2,
              type: 'manager'
            },
            {
              name: 'CTO',
              role: 'Chief Technology Officer',
              count: 2,
              type: 'executive'
            },
            {
              name: 'CFO',
              role: 'Chief Financial Officer',
              count: 1,
              type: 'executive'
            }].
            map((approver, index) =>
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">

                <div className="flex items-center gap-3">
                  {approver.type === 'executive' ?
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-purple-600" />
                    </div> :
                approver.type === 'hr' ?
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div> :

                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-green-600" />
                    </div>
                }
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {approver.name}
                    </p>
                    <p className="text-xs text-gray-500">{approver.role}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {approver.count} rules
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add New Rule
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Network className="w-4 h-4 mr-2" />
              View Hierarchy Map
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Backup Rules
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <History className="w-4 h-4 mr-2" />
              View Change History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              Setup Wizard
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">
                    Hierarchy Tips
                  </p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Rules are evaluated by priority. Lower numbers have higher
                    priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Rule Validation & Conflicts">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              System Check Results
            </h3>
            <Button variant="outline" className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Run Validation
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  All Employees Covered
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Every employee has at least one applicable rule
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  2 Overlapping Rules
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Some employees match multiple rules (priority will apply)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  3 Auto-Approval Rules
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Short leaves will be auto-approved
                </p>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">
              Last validated: 2024-02-01 10:30 AM by System
            </p>
          </div>
        </div>
      </Card>
    </div>);

}