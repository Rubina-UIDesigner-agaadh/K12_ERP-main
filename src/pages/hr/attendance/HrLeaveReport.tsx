import React, { useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Search,
  Download,
  Printer,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Users,
  Building,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarOff,
  Briefcase,
  Heart,
  Baby,
  Home,
  Plane,
  AlertTriangle,
  Award,
  Target,
  Percent,
  Hash,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Equal,
  Bookmark,
  Share2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Loader,
  Database,
  Settings } from
'lucide-react';
export function HrLeaveReport() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, chart, summary
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const leaveTypes = [
  {
    id: 'CL',
    name: 'Casual Leave',
    color: 'blue',
    icon: Calendar,
    entitled: 12,
    iconBg: 'bg-blue-100'
  },
  {
    id: 'SL',
    name: 'Sick Leave',
    color: 'red',
    icon: Heart,
    entitled: 10,
    iconBg: 'bg-red-100'
  },
  {
    id: 'PL',
    name: 'Privilege Leave',
    color: 'green',
    icon: Award,
    entitled: 15,
    iconBg: 'bg-green-100'
  },
  {
    id: 'EL',
    name: 'Earned Leave',
    color: 'purple',
    icon: Briefcase,
    entitled: 20,
    iconBg: 'bg-purple-100'
  },
  {
    id: 'ML',
    name: 'Maternity Leave',
    color: 'pink',
    icon: Baby,
    entitled: 180,
    iconBg: 'bg-pink-100'
  },
  {
    id: 'PTL',
    name: 'Paternity Leave',
    color: 'indigo',
    icon: Home,
    entitled: 15,
    iconBg: 'bg-indigo-100'
  },
  {
    id: 'CO',
    name: 'Comp Off',
    color: 'teal',
    icon: Clock,
    entitled: 0,
    iconBg: 'bg-teal-100'
  },
  {
    id: 'LOP',
    name: 'Loss of Pay',
    color: 'gray',
    icon: XCircle,
    entitled: 0,
    iconBg: 'bg-gray-100'
  }];

  const departments = [
  {
    id: 'DEPT001',
    name: 'Engineering',
    employees: 45,
    color: 'blue'
  },
  {
    id: 'DEPT002',
    name: 'Human Resources',
    employees: 8,
    color: 'purple'
  },
  {
    id: 'DEPT003',
    name: 'Finance',
    employees: 12,
    color: 'green'
  },
  {
    id: 'DEPT004',
    name: 'Marketing',
    employees: 15,
    color: 'orange'
  },
  {
    id: 'DEPT005',
    name: 'Operations',
    employees: 20,
    color: 'red'
  },
  {
    id: 'DEPT006',
    name: 'Sales',
    employees: 25,
    color: 'teal'
  },
  {
    id: 'DEPT007',
    name: 'IT Support',
    employees: 10,
    color: 'indigo'
  }];

  // Sample data for the preview table
  const leaveData = [
  {
    id: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    leaves: {
      CL: {
        taken: 8,
        balance: 4,
        details: [
        {
          date: '2024-01-05',
          days: 2
        },
        {
          date: '2024-01-20',
          days: 1
        }]

      },
      SL: {
        taken: 2,
        balance: 8,
        details: [
        {
          date: '2024-01-15',
          days: 2
        }]

      },
      PL: {
        taken: 5,
        balance: 10,
        details: [
        {
          date: '2024-01-25',
          days: 5
        }]

      },
      EL: {
        taken: 0,
        balance: 20,
        details: []
      },
      total: 15
    },
    attendance: 92.5
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    designation: 'HR Manager',
    leaves: {
      CL: {
        taken: 5,
        balance: 7,
        details: [
        {
          date: '2024-01-10',
          days: 3
        },
        {
          date: '2024-01-28',
          days: 2
        }]

      },
      SL: {
        taken: 3,
        balance: 7,
        details: [
        {
          date: '2024-01-18',
          days: 3
        }]

      },
      PL: {
        taken: 0,
        balance: 15,
        details: []
      },
      EL: {
        taken: 10,
        balance: 10,
        details: [
        {
          date: '2024-01-08',
          days: 10
        }]

      },
      total: 18
    },
    attendance: 88.0
  },
  {
    id: 'EMP003',
    name: 'Robert Johnson',
    department: 'Finance',
    designation: 'Accountant',
    leaves: {
      CL: {
        taken: 10,
        balance: 2,
        details: [
        {
          date: '2024-01-02',
          days: 5
        },
        {
          date: '2024-01-22',
          days: 5
        }]

      },
      SL: {
        taken: 1,
        balance: 9,
        details: [
        {
          date: '2024-01-30',
          days: 1
        }]

      },
      PL: {
        taken: 3,
        balance: 12,
        details: [
        {
          date: '2024-01-12',
          days: 3
        }]

      },
      EL: {
        taken: 0,
        balance: 20,
        details: []
      },
      total: 14
    },
    attendance: 93.0
  },
  {
    id: 'EMP004',
    name: 'Emily Davis',
    department: 'Marketing',
    designation: 'Marketing Lead',
    leaves: {
      CL: {
        taken: 6,
        balance: 6,
        details: [
        {
          date: '2024-01-03',
          days: 3
        },
        {
          date: '2024-01-24',
          days: 3
        }]

      },
      SL: {
        taken: 0,
        balance: 10,
        details: []
      },
      PL: {
        taken: 7,
        balance: 8,
        details: [
        {
          date: '2024-01-15',
          days: 7
        }]

      },
      EL: {
        taken: 5,
        balance: 15,
        details: [
        {
          date: '2024-01-29',
          days: 5
        }]

      },
      total: 18
    },
    attendance: 88.0
  },
  {
    id: 'EMP005',
    name: 'Michael Brown',
    department: 'Engineering',
    designation: 'Developer',
    leaves: {
      CL: {
        taken: 12,
        balance: 0,
        details: [
        {
          date: '2024-01-04',
          days: 4
        },
        {
          date: '2024-01-16',
          days: 4
        },
        {
          date: '2024-01-26',
          days: 4
        }]

      },
      SL: {
        taken: 5,
        balance: 5,
        details: [
        {
          date: '2024-01-11',
          days: 5
        }]

      },
      PL: {
        taken: 0,
        balance: 15,
        details: []
      },
      EL: {
        taken: 0,
        balance: 20,
        details: []
      },
      total: 17
    },
    attendance: 89.5
  },
  {
    id: 'EMP006',
    name: 'Sarah Wilson',
    department: 'Operations',
    designation: 'Operations Manager',
    leaves: {
      ML: {
        taken: 90,
        balance: 90,
        details: [
        {
          date: '2024-01-01',
          days: 90
        }]

      },
      total: 90
    },
    attendance: 0
  }];

  const toggleLeaveType = (id) => {
    setSelectedLeaveTypes((prev) =>
    prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };
  const toggleDepartment = (id) => {
    setSelectedDepartments((prev) =>
    prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };
  const getLeaveTypeColor = (type) => {
    const leaveType = leaveTypes.find((lt) => lt.id === type);
    return leaveType ? leaveType.color : 'gray';
  };
  const calculateDepartmentStats = () => {
    const stats = {};
    departments.forEach((dept) => {
      const deptEmployees = leaveData.filter(
        (emp) => emp.department === dept.name
      );
      const totalLeaves = deptEmployees.reduce(
        (sum, emp) => sum + emp.leaves.total,
        0
      );
      stats[dept.name] = {
        totalLeaves,
        avgLeaves:
        deptEmployees.length > 0 ?
        (totalLeaves / deptEmployees.length).toFixed(1) :
        0,
        employees: deptEmployees.length
      };
    });
    return stats;
  };
  const departmentStats = calculateDepartmentStats();
  const totalLeavesTaken = leaveData.reduce(
    (sum, emp) => sum + emp.leaves.total,
    0
  );
  const avgLeavePerEmployee = (totalLeavesTaken / leaveData.length).toFixed(1);
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Report</h1>
          <p className="text-sm text-gray-500">
            Analytics and insights on employee leave usage patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved Reports
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="primary" onClick={handleGenerateReport}>
            {isGenerating ?
            <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </> :

            <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </>
            }
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalLeavesTaken}</p>
          <p className="text-xs text-blue-600">Leaves Taken</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Avg</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {avgLeavePerEmployee}
          </p>
          <p className="text-xs text-green-600">Per Employee</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">CL</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">46</p>
          <p className="text-xs text-purple-600">Casual Leaves</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">SL</span>
          </div>
          <p className="text-2xl font-bold text-red-700">11</p>
          <p className="text-xs text-red-600">Sick Leaves</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Trend</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">+12%</p>
          <p className="text-xs text-orange-600">vs Last Month</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-teal-600 font-medium">Rate</span>
          </div>
          <p className="text-2xl font-bold text-teal-700">91.2%</p>
          <p className="text-xs text-teal-600">Attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Year/Month Filter */}
          <Card title="Period Selection">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <Select
                  options={[
                  {
                    value: 2024,
                    label: '2024'
                  },
                  {
                    value: 2023,
                    label: '2023'
                  },
                  {
                    value: 2022,
                    label: '2022'
                  },
                  {
                    value: 2021,
                    label: '2021'
                  }]
                  }
                  defaultValue={2024}
                  onChange={(e) => setSelectedYear(e.target.value)} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <Select
                  options={[
                  {
                    value: 'all',
                    label: 'All Months'
                  },
                  {
                    value: '01',
                    label: 'January'
                  },
                  {
                    value: '02',
                    label: 'February'
                  },
                  {
                    value: '03',
                    label: 'March'
                  },
                  {
                    value: '04',
                    label: 'April'
                  },
                  {
                    value: '05',
                    label: 'May'
                  },
                  {
                    value: '06',
                    label: 'June'
                  },
                  {
                    value: '07',
                    label: 'July'
                  },
                  {
                    value: '08',
                    label: 'August'
                  },
                  {
                    value: '09',
                    label: 'September'
                  },
                  {
                    value: '10',
                    label: 'October'
                  },
                  {
                    value: '11',
                    label: 'November'
                  },
                  {
                    value: '12',
                    label: 'December'
                  }]
                  }
                  defaultValue="all"
                  onChange={(e) => setSelectedMonth(e.target.value)} />

              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Q1
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Q2
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Q3
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Q4
                </Button>
              </div>
            </div>
          </Card>

          {/* Leave Type Filter */}
          <Card title="Leave Type Filter">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Select leave types to include
                </span>
                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() =>
                  setSelectedLeaveTypes(leaveTypes.map((lt) => lt.id))
                  }>

                  Select All
                </button>
              </div>
              {leaveTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => toggleLeaveType(type.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedLeaveTypes.includes(type.id) ? `bg-${type.color}-50 border-2 border-${type.color}-500` : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedLeaveTypes.includes(type.id)}
                        onChange={() => {}}
                        className={`h-4 w-4 text-${type.color}-600 rounded border-gray-300 focus:ring-${type.color}-500`} />

                      <div
                        className={`w-8 h-8 ${type.iconBg} rounded-lg flex items-center justify-center`}>

                        <Icon className={`w-4 h-4 text-${type.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {type.id} •{' '}
                          {type.entitled > 0 ?
                          `${type.entitled} days` :
                          'As needed'}
                        </p>
                      </div>
                    </div>
                  </div>);

              })}
            </div>
          </Card>

          {/* Department Filter */}
          <Card title="Department Filter">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Filter by department
                </span>
                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() =>
                  setSelectedDepartments(departments.map((d) => d.id))
                  }>

                  Select All
                </button>
              </div>
              {departments.map((dept) =>
              <div
                key={dept.id}
                onClick={() => toggleDepartment(dept.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedDepartments.includes(dept.id) ? `bg-${dept.color}-50 border-2 border-${dept.color}-500` : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>

                  <div className="flex items-center gap-3">
                    <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept.id)}
                    onChange={() => {}}
                    className={`h-4 w-4 text-${dept.color}-600 rounded border-gray-300 focus:ring-${dept.color}-500`} />

                    <Building className={`w-5 h-5 text-${dept.color}-500`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {dept.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dept.employees} employees
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Report Output Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* View Mode Toggle */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>

                  <Database className="w-4 h-4 inline mr-2" />
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'chart' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>

                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Chart View
                </button>
                <button
                  onClick={() => setViewMode('summary')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'summary' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>

                  <PieChart className="w-4 h-4 inline mr-2" />
                  Summary
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' &&
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      {leaveTypes.slice(0, 4).map((type) =>
                    <th
                      key={type.id}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">

                          <div className="flex flex-col items-center">
                            <span>{type.id}</span>
                            <span className="text-[10px] font-normal">
                              ({type.entitled})
                            </span>
                          </div>
                        </th>
                    )}
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Others
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance %
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveData.map((employee, index) =>
                  <Fragment key={employee.id}>
                        <tr
                      className={`hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>

                          <td className="px-4 py-3 sticky left-0 bg-inherit border-r">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {employee.name.
                              split(' ').
                              map((n) => n[0]).
                              join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {employee.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {employee.id} • {employee.designation}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {employee.department}
                          </td>
                          {leaveTypes.slice(0, 4).map((type) => {
                        const leaveInfo = employee.leaves[type.id];
                        if (!leaveInfo)
                        return (
                          <td
                            key={type.id}
                            className="px-4 py-3 text-center text-sm text-gray-400">

                                  —
                                </td>);

                        return (
                          <td
                            key={type.id}
                            className="px-4 py-3 text-center">

                                <div className="flex flex-col items-center gap-1">
                                  <span
                                className={`text-sm font-bold text-${type.color}-600`}>

                                    {leaveInfo.taken}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">
                                      Bal:
                                    </span>
                                    <span
                                  className={`text-xs ${leaveInfo.balance <= 2 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>

                                      {leaveInfo.balance}
                                    </span>
                                  </div>
                                </div>
                              </td>);

                      })}
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {employee.leaves.ML?.taken ||
                        employee.leaves.PTL?.taken ||
                        employee.leaves.CO?.taken ||
                        employee.leaves.LOP?.taken ||
                        0}
                          </td>
                          <td className="px-4 py-3 text-center bg-gray-50">
                            <span className="text-lg font-bold text-gray-900">
                              {employee.leaves.total}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${employee.attendance >= 95 ? 'bg-green-100 text-green-700' : employee.attendance >= 90 ? 'bg-yellow-100 text-yellow-700' : employee.attendance >= 80 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>

                              {employee.attendance}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() =>
                          setExpandedEmployee(
                            expandedEmployee === employee.id ?
                            null :
                            employee.id
                          )
                          }>

                              {expandedEmployee === employee.id ?
                          <ChevronUp className="w-4 h-4" /> :

                          <ChevronDown className="w-4 h-4" />
                          }
                            </button>
                          </td>
                        </tr>
                        {expandedEmployee === employee.id &&
                    <tr>
                            <td
                        colSpan="10"
                        className="px-4 py-3 bg-blue-50/30">

                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700">
                                  Leave Details for {employee.name}
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                  {Object.entries(employee.leaves).
                            filter(([key]) => key !== 'total').
                            map(([type, data]) => {
                              if (
                              !data.details ||
                              data.details.length === 0)

                              return null;
                              return (
                                <div
                                  key={type}
                                  className="bg-white rounded-lg p-3 border border-gray-200">

                                          <div className="flex items-center justify-between mb-2">
                                            <span
                                      className={`text-sm font-medium text-${getLeaveTypeColor(type)}-700`}>

                                              {type} - {data.taken} days
                                            </span>
                                          </div>
                                          <div className="space-y-1">
                                            {data.details.map((detail, idx) =>
                                    <div
                                      key={idx}
                                      className="text-xs text-gray-600">

                                                <CalendarCheck className="w-3 h-3 inline mr-1" />
                                                {detail.date} ({detail.days}{' '}
                                                days)
                                              </div>
                                    )}
                                          </div>
                                        </div>);

                            })}
                                </div>
                              </div>
                            </td>
                          </tr>
                    }
                      </Fragment>
                  )}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr className="font-semibold">
                      <td className="px-4 py-3 text-sm text-gray-700 sticky left-0 bg-gray-100 border-r">
                        Total ({leaveData.length} Employees)
                      </td>
                      <td className="px-4 py-3"></td>
                      {leaveTypes.slice(0, 4).map((type) => {
                      const total = leaveData.reduce(
                        (sum, emp) => sum + (emp.leaves[type.id]?.taken || 0),
                        0
                      );
                      return (
                        <td key={type.id} className="px-4 py-3 text-center">
                            <span
                            className={`text-sm font-bold text-${type.color}-700`}>

                              {total}
                            </span>
                          </td>);

                    })}
                      <td className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                        {leaveData.reduce(
                        (sum, emp) =>
                        sum + (
                        emp.leaves.ML?.taken ||
                        emp.leaves.PTL?.taken ||
                        emp.leaves.CO?.taken ||
                        emp.leaves.LOP?.taken ||
                        0),
                        0
                      )}
                      </td>
                      <td className="px-4 py-3 text-center text-lg font-bold text-gray-900 bg-gray-200">
                        {totalLeavesTaken}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-green-700">
                          {(
                        leaveData.reduce(
                          (sum, emp) => sum + emp.attendance,
                          0
                        ) / leaveData.length).
                        toFixed(1)}
                          %
                        </span>
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            }

            {/* Chart View */}
            {viewMode === 'chart' &&
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Leave Distribution by Type
                    </h3>
                    <div className="space-y-3">
                      {leaveTypes.slice(0, 5).map((type) => {
                      const total = leaveData.reduce(
                        (sum, emp) => sum + (emp.leaves[type.id]?.taken || 0),
                        0
                      );
                      const percentage =
                      totalLeavesTaken > 0 ?
                      total / totalLeavesTaken * 100 :
                      0;
                      return (
                        <div key={type.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-700">
                                {type.name}
                              </span>
                              <span
                              className={`text-sm font-bold text-${type.color}-600`}>

                                {total}
                              </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div
                              className={`h-full bg-${type.color}-500 rounded-full transition-all`}
                              style={{
                                width: `${percentage}%`
                              }} />

                            </div>
                          </div>);

                    })}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Department-wise Leave Usage
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(departmentStats).map(([dept, stats]) =>
                    <div
                      key={dept}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {dept}
                            </p>
                            <p className="text-xs text-gray-500">
                              {stats.employees} employees
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {stats.totalLeaves}
                            </p>
                            <p className="text-xs text-gray-500">
                              Avg: {stats.avgLeaves}
                            </p>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Summary View */}
            {viewMode === 'summary' &&
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-semibold text-blue-900">
                        Most Used Leave Type
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      Casual Leave
                    </p>
                    <p className="text-sm text-blue-600 mt-1">46 days total</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="text-sm font-semibold text-green-900">
                        Highest Utilization
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      Engineering
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      47 total leaves
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-purple-600" />
                      <h3 className="text-sm font-semibold text-purple-900">
                        Best Attendance
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      Robert Johnson
                    </p>
                    <p className="text-sm text-purple-600 mt-1">
                      93% attendance rate
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Insights
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Average Leave per Month
                          </p>
                          <p className="text-xs text-gray-600">
                            Employees take an average of {avgLeavePerEmployee}{' '}
                            leaves per month
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            High Sick Leave Usage
                          </p>
                          <p className="text-xs text-gray-600">
                            11 sick leaves taken, consider wellness programs
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Good Attendance Rate
                          </p>
                          <p className="text-xs text-gray-600">
                            Overall attendance at 91.2% - above target
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Leave Trend
                          </p>
                          <p className="text-xs text-gray-600">
                            12% increase compared to last month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </Card>

          {/* Export Actions */}
          <Card title="Export Options">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700">

                <FileText className="w-4 h-4 mr-2" />
                Generate PDF Report
              </Button>
              <Button
                variant="primary"
                className="bg-green-600 hover:bg-green-700">

                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Email Report
              </Button>
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}