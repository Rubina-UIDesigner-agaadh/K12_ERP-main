import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  Eye,
  Edit,
  MoreHorizontal,
  Info } from
'lucide-react';
export function MonthlyAttendanceRegisterHr() {
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2024');
  const daysInMonth = 31;
  const days = Array.from(
    {
      length: daysInMonth
    },
    (_, i) => i + 1
  );
  const getDayName = (day) => {
    const date = new Date(2024, 0, day);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  };
  const isWeekend = (day) => {
    const date = new Date(2024, 0, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };
  const attendanceCodes = {
    P: {
      label: 'Present',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    A: {
      label: 'Absent',
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    L: {
      label: 'Leave',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    WO: {
      label: 'Week Off',
      color: 'bg-gray-100 text-gray-500 border-gray-200'
    },
    H: {
      label: 'Holiday',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    HD: {
      label: 'Half Day',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    WFH: {
      label: 'Work From Home',
      color: 'bg-teal-100 text-teal-700 border-teal-200'
    },
    OD: {
      label: 'On Duty',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    CO: {
      label: 'Comp Off',
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    LOP: {
      label: 'Loss of Pay',
      color: 'bg-red-200 text-red-800 border-red-300'
    }
  };
  const employees = [
  {
    id: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'L',
    'L',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 22,
      absent: 0,
      leave: 2,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    designation: 'HR Manager',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'A',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 23,
      absent: 1,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP003',
    name: 'Robert Johnson',
    department: 'Finance',
    designation: 'Accountant',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'WFH',
    'WFH',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 20,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      wfh: 2
    }
  },
  {
    id: 'EMP004',
    name: 'Emily Davis',
    department: 'Marketing',
    designation: 'Marketing Lead',
    attendance: [
    'P',
    'P',
    'P',
    'HD',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'A',
    'A',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 20,
      absent: 2,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 1
    }
  },
  {
    id: 'EMP005',
    name: 'Michael Brown',
    department: 'Engineering',
    designation: 'Developer',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'L',
    'L',
    'L',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 21,
      absent: 0,
      leave: 3,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP006',
    name: 'Sarah Wilson',
    department: 'Operations',
    designation: 'Operations Manager',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'OD',
    'OD',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 21,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      od: 2
    }
  },
  {
    id: 'EMP007',
    name: 'David Lee',
    department: 'IT Support',
    designation: 'IT Administrator',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 24,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP008',
    name: 'Lisa Anderson',
    department: 'Sales',
    designation: 'Sales Executive',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'LOP',
    'LOP',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 22,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      lop: 2
    }
  },
  {
    id: 'EMP009',
    name: 'James Taylor',
    department: 'Engineering',
    designation: 'Tech Lead',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'CO',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 23,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      co: 1
    }
  },
  {
    id: 'EMP010',
    name: 'Jennifer Martinez',
    department: 'HR',
    designation: 'HR Executive',
    attendance: [
    'A',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'A'],

    summary: {
      present: 22,
      absent: 2,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  }];

  const getAttendanceCell = (code) => {
    const style = attendanceCodes[code] || {
      color: 'bg-gray-50 text-gray-400 border-gray-200'
    };
    return (
      <span
        className={`inline-flex items-center justify-center w-8 h-6 text-xs font-semibold rounded border ${style.color}`}>

        {code}
      </span>);

  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monthly Attendance Register
          </h1>
          <p className="text-sm text-gray-500">
            Muster roll view with daily attendance for all employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Present</p>
              <p className="text-2xl font-bold text-green-600">218</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Avg: 21.8/employee</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Absent</p>
              <p className="text-2xl font-bold text-red-600">5</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">0.5/employee</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">On Leave</p>
              <p className="text-2xl font-bold text-blue-600">5</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">0.5/employee</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Week Off</p>
              <p className="text-2xl font-bold text-gray-600">60</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">6/employee</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Holiday</p>
              <p className="text-2xl font-bold text-purple-600">10</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">1/employee</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Half Day</p>
              <p className="text-2xl font-bold text-yellow-600">1</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">0.1/employee</p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button variant="outline" className="p-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2 px-2">
                  <Select
                    options={[
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
                    defaultValue={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)} />

                  <Select
                    options={[
                    {
                      value: '2024',
                      label: '2024'
                    },
                    {
                      value: '2023',
                      label: '2023'
                    },
                    {
                      value: '2022',
                      label: '2022'
                    }]
                    }
                    defaultValue={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)} />

                </div>
                <Button variant="outline" className="p-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Departments'
                },
                {
                  value: 'engineering',
                  label: 'Engineering'
                },
                {
                  value: 'hr',
                  label: 'Human Resources'
                },
                {
                  value: 'finance',
                  label: 'Finance'
                },
                {
                  value: 'marketing',
                  label: 'Marketing'
                },
                {
                  value: 'operations',
                  label: 'Operations'
                },
                {
                  value: 'sales',
                  label: 'Sales'
                }]
                }
                defaultValue="all" />

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />

              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Column Settings
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-r min-w-[40px]">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-10 bg-gray-50 z-20 border-r min-w-[60px]">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-24 bg-gray-50 z-20 border-r min-w-[150px]">
                      Employee
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-48 bg-gray-50 z-20 border-r min-w-[100px]">
                      Dept
                    </th>
                    {days.map((day) =>
                    <th
                      key={day}
                      className={`px-1 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[36px] ${isWeekend(day) ? 'bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-500'}`}>

                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-gray-400">
                            {getDayName(day)}
                          </span>
                          <span className="font-bold">{day}</span>
                        </div>
                      </th>
                    )}
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-l min-w-[40px]">
                      P
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50 min-w-[40px]">
                      A
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 min-w-[40px]">
                      L
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 min-w-[40px]">
                      WO
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-purple-50 min-w-[40px]">
                      H
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50 min-w-[40px]">
                      HD
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-l min-w-[50px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee, index) =>
                  <tr key={employee.id} className="hover:bg-blue-50/50">
                      <td className="px-2 py-2 text-xs text-gray-500 sticky left-0 bg-white z-10 border-r">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 text-xs font-medium text-blue-600 sticky left-10 bg-white z-10 border-r">
                        {employee.id}
                      </td>
                      <td className="px-3 py-2 sticky left-24 bg-white z-10 border-r">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-medium text-white">
                              {employee.name.
                            split(' ').
                            map((n) => n[0]).
                            join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {employee.name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {employee.designation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 sticky left-48 bg-white z-10 border-r">
                        {employee.department}
                      </td>
                      {employee.attendance.map((code, dayIndex) =>
                    <td
                      key={dayIndex}
                      className={`px-1 py-1 text-center ${isWeekend(dayIndex + 1) ? 'bg-gray-50' : ''}`}>

                          {getAttendanceCell(code)}
                        </td>
                    )}
                      <td className="px-2 py-2 text-center text-sm font-bold text-green-600 bg-green-50/50 border-l">
                        {employee.summary.present}
                      </td>
                      <td className="px-2 py-2 text-center text-sm font-bold text-red-600 bg-red-50/50">
                        {employee.summary.absent}
                      </td>
                      <td className="px-2 py-2 text-center text-sm font-bold text-blue-600 bg-blue-50/50">
                        {employee.summary.leave}
                      </td>
                      <td className="px-2 py-2 text-center text-sm font-bold text-gray-600 bg-gray-50">
                        {employee.summary.wo}
                      </td>
                      <td className="px-2 py-2 text-center text-sm font-bold text-purple-600 bg-purple-50/50">
                        {employee.summary.holiday}
                      </td>
                      <td className="px-2 py-2 text-center text-sm font-bold text-yellow-600 bg-yellow-50/50">
                        {employee.summary.halfDay}
                      </td>
                      <td className="px-3 py-2 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button
                          className="p-1 hover:bg-gray-200 rounded"
                          title="View">

                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Edit">

                            <Edit className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button
                          className="p-1 hover:bg-gray-200 rounded"
                          title="More">

                            <MoreHorizontal className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td
                      colSpan="4"
                      className="px-3 py-3 text-xs font-semibold text-gray-700 sticky left-0 bg-gray-100 border-r">

                      Total ({employees.length} Employees)
                    </td>
                    {days.map((day) => {
                      const presentCount = employees.filter(
                        (e) => e.attendance[day - 1] === 'P'
                      ).length;
                      return (
                        <td
                          key={day}
                          className={`px-1 py-2 text-center text-xs font-semibold ${isWeekend(day) ? 'bg-gray-200 text-gray-500' : 'text-gray-700'}`}>

                          {presentCount}
                        </td>);

                    })}
                    <td className="px-2 py-2 text-center text-sm font-bold text-green-700 bg-green-100 border-l">
                      218
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-bold text-red-700 bg-red-100">
                      5
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-bold text-blue-700 bg-blue-100">
                      5
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-bold text-gray-700 bg-gray-200">
                      60
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-bold text-purple-700 bg-purple-100">
                      10
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-bold text-yellow-700 bg-yellow-100">
                      1
                    </td>
                    <td className="px-3 py-2 bg-gray-100 border-l"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1-10</span> of{' '}
                <span className="font-medium">156</span> employees
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
                defaultValue="10" />

            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                1
              </span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">
                2
              </span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">
                3
              </span>
              <span className="px-3 py-1 text-gray-600 text-sm">...</span>
              <span className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded cursor-pointer">
                16
              </span>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Attendance Code Legend">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(attendanceCodes).map(([code, { label, color }]) =>
            <div
              key={code}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">

                <span
                className={`inline-flex items-center justify-center w-10 h-6 text-xs font-semibold rounded border ${color}`}>

                  {code}
                </span>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Monthly Statistics">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  Average Attendance Rate
                </span>
                <span className="text-sm font-bold text-green-600">94.2%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: '94.2%'
                  }}>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  On-Time Arrival Rate
                </span>
                <span className="text-sm font-bold text-blue-600">87.5%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: '87.5%'
                  }}>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Leave Utilization</span>
                <span className="text-sm font-bold text-orange-600">32.4%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{
                    width: '32.4%'
                  }}>
                </div>
              </div>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">24.5</p>
                  <p className="text-xs text-gray-500">Avg. Working Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">8.2</p>
                  <p className="text-xs text-gray-500">Avg. Hours/Day</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Import Attendance Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Edit className="w-4 h-4 mr-2" />
              Bulk Edit Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Mark Holiday
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Generate Muster Roll
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">
                    Data Last Updated
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    31 Jan 2024, 06:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Department-wise Attendance Summary">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present Days
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent Days
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Days
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              {
                dept: 'Engineering',
                employees: 4,
                present: 86,
                absent: 0,
                leave: 5,
                percentage: 94.5,
                trend: 'up'
              },
              {
                dept: 'Human Resources',
                employees: 2,
                present: 45,
                absent: 3,
                leave: 0,
                percentage: 91.8,
                trend: 'down'
              },
              {
                dept: 'Finance',
                employees: 1,
                present: 22,
                absent: 0,
                leave: 0,
                percentage: 100,
                trend: 'up'
              },
              {
                dept: 'Marketing',
                employees: 1,
                present: 20,
                absent: 2,
                leave: 0,
                percentage: 90.9,
                trend: 'same'
              },
              {
                dept: 'Operations',
                employees: 1,
                present: 23,
                absent: 0,
                leave: 0,
                percentage: 100,
                trend: 'up'
              },
              {
                dept: 'Sales',
                employees: 1,
                present: 22,
                absent: 0,
                leave: 0,
                percentage: 100,
                trend: 'up'
              }].
              map((row) =>
              <tr key={row.dept} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.dept}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">
                    {row.employees}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-green-600">
                    {row.present}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-red-600">
                    {row.absent}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">
                    {row.leave}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className={`h-full rounded-full ${row.percentage >= 95 ? 'bg-green-500' : row.percentage >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{
                          width: `${row.percentage}%`
                        }}>
                      </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {row.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.trend === 'up' &&
                  <span className="text-green-600 text-sm">↑ +2.1%</span>
                  }
                    {row.trend === 'down' &&
                  <span className="text-red-600 text-sm">↓ -1.5%</span>
                  }
                    {row.trend === 'same' &&
                  <span className="text-gray-500 text-sm">→ 0%</span>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}