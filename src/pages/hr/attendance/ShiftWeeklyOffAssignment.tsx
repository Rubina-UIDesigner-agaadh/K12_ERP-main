import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Calendar,
  Clock,
  Users,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  Plus,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Eye,
  Grid,
  List,
  CalendarDays,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Coffee,
  Building,
  Briefcase,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  Layers,
  Target,
  Zap,
  TrendingUp,
  History,
  FileText,
  Printer,
  Send,
  UserPlus,
  UserMinus,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Timer,
  Play,
  Pause } from
'lucide-react';

export function ShiftWeeklyOffAssignment() {
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list
  const [selectedMonth, setSelectedMonth] = useState(1); // February
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const shiftPolicies = [
  { id: 'SHIFT001', name: 'General Shift', code: 'GS', timing: '09:00 AM - 06:00 PM', hours: 9, color: 'blue', icon: 'sun' },
  { id: 'SHIFT002', name: 'Morning Shift', code: 'MS', timing: '06:00 AM - 02:00 PM', hours: 8, color: 'orange', icon: 'sunrise' },
  { id: 'SHIFT003', name: 'Evening Shift', code: 'ES', timing: '02:00 PM - 10:00 PM', hours: 8, color: 'purple', icon: 'sunset' },
  { id: 'SHIFT004', name: 'Night Shift', code: 'NS', timing: '10:00 PM - 06:00 AM', hours: 8, color: 'indigo', icon: 'moon' },
  { id: 'SHIFT005', name: 'Flexible Hours', code: 'FH', timing: 'Flexible', hours: 8, color: 'green', icon: 'clock' },
  { id: 'SHIFT006', name: 'Split Shift', code: 'SS', timing: '08:00-12:00 & 04:00-08:00', hours: 8, color: 'teal', icon: 'coffee' }];


  const weeklyOffPatterns = [
  { id: 'WO001', name: 'Standard (Sat-Sun)', days: [0, 6], description: 'Saturday & Sunday off' },
  { id: 'WO002', name: 'Alternate Saturday', days: [0], alternateSat: true, description: 'All Sundays, Alternate Saturdays' },
  { id: 'WO003', name: 'Sunday Only', days: [0], description: 'Only Sunday off' },
  { id: 'WO004', name: 'Friday-Saturday', days: [5, 6], description: 'Friday & Saturday off' },
  { id: 'WO005', name: 'Rotational', days: [], rotational: true, description: 'Rotating weekly off' },
  { id: 'WO006', name: 'Custom', days: [], custom: true, description: 'Custom selection' }];


  const employees = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', shift: 'SHIFT001', weeklyOff: 'WO001', effectiveFrom: '2024-01-01' },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', shift: 'SHIFT001', weeklyOff: 'WO001', effectiveFrom: '2024-01-01' },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', shift: 'SHIFT001', weeklyOff: 'WO002', effectiveFrom: '2024-01-01' },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', shift: 'SHIFT005', weeklyOff: 'WO001', effectiveFrom: '2024-01-15' },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', shift: 'SHIFT002', weeklyOff: 'WO003', effectiveFrom: '2024-01-01' },
  { id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', shift: 'SHIFT001', weeklyOff: 'WO001', effectiveFrom: '2024-01-01' },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', shift: 'SHIFT003', weeklyOff: 'WO004', effectiveFrom: '2024-02-01' },
  { id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', shift: 'SHIFT001', weeklyOff: 'WO001', effectiveFrom: '2024-01-01' },
  { id: 'EMP009', name: 'James Taylor', department: 'Engineering', designation: 'Tech Lead', shift: 'SHIFT001', weeklyOff: 'WO001', effectiveFrom: '2024-01-01' },
  { id: 'EMP010', name: 'Jennifer Martinez', department: 'Security', designation: 'Security Guard', shift: 'SHIFT004', weeklyOff: 'WO005', effectiveFrom: '2024-01-01' }];


  const getShiftById = (id) => shiftPolicies.find((s) => s.id === id);
  const getWeeklyOffById = (id) => weeklyOffPatterns.find((w) => w.id === id);

  const getShiftIcon = (iconName) => {
    switch (iconName) {
      case 'sun':return <Sun className="w-4 h-4" />;
      case 'sunrise':return <Sunrise className="w-4 h-4" />;
      case 'sunset':return <Sunset className="w-4 h-4" />;
      case 'moon':return <Moon className="w-4 h-4" />;
      case 'clock':return <Clock className="w-4 h-4" />;
      case 'coffee':return <Coffee className="w-4 h-4" />;
      default:return <Clock className="w-4 h-4" />;
    }
  };

  const getShiftColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      teal: 'bg-teal-100 text-teal-700 border-teal-200'
    };
    return colors[color] || colors.blue;
  };

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees((prev) =>
    prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const selectAllEmployees = () => {
    const filteredEmployees = selectedDepartment === 'all' ?
    employees :
    employees.filter((e) => e.department === selectedDepartment);
    setSelectedEmployees(filteredEmployees.map((e) => e.id));
  };

  const clearSelection = () => {
    setSelectedEmployees([]);
  };

  // Generate calendar days for the month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(selectedYear, selectedMonth, i).getDay();
      days.push({
        day: i,
        isCurrentMonth: true,
        dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: i === new Date().getDate() && selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear()
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const filteredEmployees = selectedDepartment === 'all' ?
  employees :
  employees.filter((e) => e.department === selectedDepartment);

  const shiftCounts = shiftPolicies.map((shift) => ({
    ...shift,
    count: employees.filter((e) => e.shift === shift.id).length
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Shift / Weekly-Off Assignment
          </h1>
          <p className="text-sm text-gray-500">
            Assign shift policies and weekly off schedules to employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Roster
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Assignments
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{employees.length}</p>
          <p className="text-xs text-blue-600">Employees</p>
        </div>
        {shiftCounts.slice(0, 4).map((shift) =>
        <div key={shift.id} className={`bg-gradient-to-br from-${shift.color}-50 to-${shift.color}-100 p-4 rounded-xl border border-${shift.color}-200`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-${shift.color}-600`}>
                {getShiftIcon(shift.icon)}
              </div>
              <span className={`text-xs text-${shift.color}-600 font-medium`}>{shift.code}</span>
            </div>
            <p className={`text-2xl font-bold text-${shift.color}-700`}>{shift.count}</p>
            <p className={`text-xs text-${shift.color}-600`}>{shift.name}</p>
          </div>
        )}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CalendarCheck className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Assigned</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{employees.length}</p>
          <p className="text-xs text-green-600">With Schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Employee Selection">
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <Select
                options={[
                { value: 'all', label: 'All Departments' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Operations', label: 'Operations' },
                { value: 'IT Support', label: 'IT Support' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Security', label: 'Security' }]
                }
                defaultValue="all"
                onChange={(e) => setSelectedDepartment(e.target.value)} />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedEmployees.length} of {filteredEmployees.length} selected
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={selectAllEmployees}>

                    Select All
                  </button>
                  <button
                    className="text-xs text-gray-500 hover:underline"
                    onClick={clearSelection}>

                    Clear
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-2">
                {filteredEmployees.map((employee) => {
                  const shift = getShiftById(employee.shift);
                  return (
                    <div
                      key={employee.id}
                      onClick={() => toggleEmployeeSelection(employee.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedEmployees.includes(employee.id) ?
                      'bg-blue-50 border-2 border-blue-500' :
                      'bg-gray-50 border border-gray-200 hover:border-gray-300'}`
                      }>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {employee.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      {shift &&
                      <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${getShiftColorClasses(shift.color)}`}>
                            {getShiftIcon(shift.icon)}
                            {shift.code}
                          </span>
                          <span className="text-xs text-gray-500">{shift.timing}</span>
                        </div>
                      }
                    </div>);

                })}
              </div>
            </div>
          </Card>

          <Card title="Shift Policies">
            <div className="space-y-2">
              {shiftPolicies.map((shift) =>
              <div
                key={shift.id}
                className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${getShiftColorClasses(shift.color)}`}>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getShiftIcon(shift.icon)}
                      <div>
                        <p className="text-sm font-medium">{shift.name}</p>
                        <p className="text-xs opacity-75">{shift.timing}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold">{shift.hours}h</span>
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add New Shift
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'calendar' ?
                      'bg-white text-blue-600 shadow-sm' :
                      'text-gray-600 hover:text-gray-900'}`
                      }>

                      <CalendarDays className="w-4 h-4" />
                      Calendar
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'list' ?
                      'bg-white text-blue-600 shadow-sm' :
                      'text-gray-600 hover:text-gray-900'}`
                      }>

                      <List className="w-4 h-4" />
                      List View
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="p-2">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <select
                      className="bg-transparent border-none font-medium text-gray-900 focus:outline-none cursor-pointer"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>

                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) =>
                      <option key={index} value={index}>{month}</option>
                      )}
                    </select>
                    <select
                      className="bg-transparent border-none font-medium text-gray-900 focus:outline-none cursor-pointer"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}>

                      {[2023, 2024, 2025].map((year) =>
                      <option key={year} value={year}>{year}</option>
                      )}
                    </select>
                  </div>
                  <Button variant="outline" className="p-2">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {selectedEmployees.length > 0 &&
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">
                    Bulk Assignment for {selectedEmployees.length} Employee(s)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Shift Policy
                      </label>
                      <Select
                      options={[
                      { value: '', label: '-- Select Shift --' },
                      ...shiftPolicies.map((s) => ({ value: s.id, label: `${s.name} (${s.timing})` }))]
                      }
                      defaultValue="" />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekly Off Pattern
                      </label>
                      <Select
                      options={[
                      { value: '', label: '-- Select Pattern --' },
                      ...weeklyOffPatterns.map((w) => ({ value: w.id, label: w.name }))]
                      }
                      defaultValue="" />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Effective From
                      </label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Weekly Off Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {fullWeekDays.map((day, index) =>
                    <label
                      key={day}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-400">

                          <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        defaultChecked={index === 0 || index === 6} />

                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                    )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={clearSelection}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
                      <Check className="w-4 h-4 mr-2" />
                      Apply to Selected
                    </Button>
                  </div>
                </div>
              }

              {viewMode === 'calendar' ?
              <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 bg-gray-50 border-b">
                    {weekDays.map((day, index) =>
                  <div
                    key={day}
                    className={`px-2 py-3 text-center text-sm font-medium ${
                    index === 0 || index === 6 ? 'text-red-600 bg-red-50' : 'text-gray-700'}`
                    }>

                        {day}
                      </div>
                  )}
                  </div>
                  <div className="grid grid-cols-7">
                    {calendarDays.map((dateInfo, index) =>
                  <div
                    key={index}
                    className={`min-h-24 p-2 border-b border-r ${
                    !dateInfo.isCurrentMonth ? 'bg-gray-50' :
                    dateInfo.isWeekend ? 'bg-red-50/30' :
                    dateInfo.isToday ? 'bg-blue-50' :
                    'bg-white'}`
                    }>

                        {dateInfo.day &&
                    <>
                            <div className={`text-sm font-medium mb-1 ${
                      dateInfo.isToday ? 'text-blue-600' :
                      dateInfo.isWeekend ? 'text-red-600' :
                      'text-gray-900'}`
                      }>
                              {dateInfo.day}
                              {dateInfo.isToday &&
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded">Today</span>
                        }
                            </div>
                            <div className="space-y-1">
                              {dateInfo.isWeekend &&
                        <div className="text-xs text-red-600 font-medium">Week Off</div>
                        }
                              {!dateInfo.isWeekend && dateInfo.day <= 5 &&
                        <>
                                  <div className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate">GS: 5 emp</div>
                                  <div className="text-xs bg-orange-100 text-orange-700 px-1 py-0.5 rounded truncate">MS: 1 emp</div>
                                </>
                        }
                            </div>
                          </>
                    }
                      </div>
                  )}
                  </div>
                </div> :

              <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">
                            <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={selectedEmployees.length === filteredEmployees.length}
                            onChange={() => selectedEmployees.length === filteredEmployees.length ? clearSelection() : selectAllEmployees()} />

                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-10 bg-gray-50 z-10 border-r min-w-[200px]">
                            Employee
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                            Department
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                            Current Shift
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                            Weekly Off
                          </th>
                          {weekDays.map((day, index) =>
                        <th
                          key={day}
                          className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider min-w-[60px] ${
                          index === 0 || index === 6 ? 'text-red-600 bg-red-50' : 'text-gray-500'}`
                          }>

                              {day}
                            </th>
                        )}
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                            Effective From
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] border-l">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map((employee, empIndex) => {
                        const shift = getShiftById(employee.shift);
                        const weeklyOff = getWeeklyOffById(employee.weeklyOff);
                        return (
                          <tr
                            key={employee.id}
                            className={`hover:bg-blue-50/50 ${
                            selectedEmployees.includes(employee.id) ? 'bg-blue-50' :
                            empIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`
                            }>

                              <td className="px-3 py-3 sticky left-0 bg-inherit border-r">
                                <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={selectedEmployees.includes(employee.id)}
                                onChange={() => toggleEmployeeSelection(employee.id)} />

                              </td>
                              <td className="px-3 py-3 sticky left-10 bg-inherit border-r">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">
                                      {employee.name.split(' ').map((n) => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                    <p className="text-xs text-gray-500">{employee.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-600">{employee.department}</td>
                              <td className="px-3 py-3">
                                {shift &&
                              <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${getShiftColorClasses(shift.color)}`}>
                                      {getShiftIcon(shift.icon)}
                                      {shift.code}
                                    </span>
                                    <span className="text-xs text-gray-500">{shift.timing}</span>
                                  </div>
                              }
                              </td>
                              <td className="px-3 py-3 text-center">
                                {weeklyOff &&
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                    {weeklyOff.name}
                                  </span>
                              }
                              </td>
                              {weekDays.map((day, dayIndex) => {
                              const isOff = weeklyOff?.days.includes(dayIndex);
                              return (
                                <td
                                  key={day}
                                  className={`px-3 py-3 text-center ${
                                  isOff ? 'bg-red-50' : ''}`
                                  }>

                                    {isOff ?
                                  <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-red-100 text-red-600">
                                        WO
                                      </span> :
                                  shift ?
                                  <span className={`inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full ${getShiftColorClasses(shift.color)}`}>
                                        {shift.code}
                                      </span> :

                                  <span className="text-gray-400">-</span>
                                  }
                                  </td>);

                            })}
                              <td className="px-3 py-3 text-sm text-gray-600">{employee.effectiveFrom}</td>
                              <td className="px-3 py-3 text-center border-l">
                                <div className="flex items-center justify-center gap-1">
                                  <button className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                    <Edit className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Copy">
                                    <Copy className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="History">
                                    <History className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>);

                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card title="Weekly Off Patterns">
          <div className="space-y-3">
            {weeklyOffPatterns.map((pattern) =>
            <div
              key={pattern.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer transition-all">

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{pattern.name}</span>
                  <span className="text-xs text-gray-500">
                    {employees.filter((e) => e.weeklyOff === pattern.id).length} emp
                  </span>
                </div>
                <p className="text-xs text-gray-600">{pattern.description}</p>
                <div className="flex gap-1 mt-2">
                  {weekDays.map((day, index) =>
                <span
                  key={day}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded ${
                  pattern.days.includes(index) ?
                  'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'}`
                  }>

                      {day.charAt(0)}
                    </span>
                )}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Department Summary">
          <div className="space-y-3">
            {['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'IT Support', 'Sales', 'Security'].map((dept) => {
              const deptEmployees = employees.filter((e) => e.department === dept);
              if (deptEmployees.length === 0) return null;
              return (
                <div key={dept} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{dept}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {deptEmployees.length} emp
                    </span>
                    <div className="flex gap-0.5">
                      {shiftPolicies.slice(0, 3).map((shift) => {
                        const count = deptEmployees.filter((e) => e.shift === shift.id).length;
                        if (count === 0) return null;
                        return (
                          <span
                            key={shift.id}
                            className={`px-1.5 py-0.5 text-xs font-medium rounded ${getShiftColorClasses(shift.color)}`}
                            title={`${shift.name}: ${count}`}>

                            {count}
                          </span>);

                      })}
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </Card>

        <Card title="Shift Distribution">
          <div className="space-y-4">
            {shiftPolicies.map((shift) => {
              const count = employees.filter((e) => e.shift === shift.id).length;
              const percentage = count / employees.length * 100;
              return (
                <div key={shift.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-${shift.color}-600`}>
                        {getShiftIcon(shift.icon)}
                      </span>
                      <span className="text-sm text-gray-700">{shift.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${shift.color}-500 rounded-full`}
                      style={{ width: `${percentage}%` }}>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create New Shift
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Copy className="w-4 h-4 mr-2" />
              Copy From Previous Month
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Import Roster
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <RotateCcw className="w-4 h-4 mr-2" />
              Rotate Shifts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Printer className="w-4 h-4 mr-2" />
              Print Roster
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Tip</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Select multiple employees to apply bulk assignments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Assignment Changes">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Changed By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              { date: '2024-02-01 10:30 AM', employee: 'David Lee', type: 'Shift Change', prev: 'General Shift', new: 'Evening Shift', effective: '2024-02-01', by: 'HR Manager' },
              { date: '2024-01-31 03:15 PM', employee: 'Emily Davis', type: 'Weekly Off', prev: 'Sunday Only', new: 'Sat-Sun', effective: '2024-02-01', by: 'Admin' },
              { date: '2024-01-30 11:00 AM', employee: 'Jennifer Martinez', type: 'Shift Change', prev: 'Evening Shift', new: 'Night Shift', effective: '2024-01-30', by: 'Security Head' },
              { date: '2024-01-28 02:45 PM', employee: 'Michael Brown', type: 'Weekly Off', prev: 'Sat-Sun', new: 'Sunday Only', effective: '2024-01-29', by: 'Tech Lead' }].
              map((change, index) =>
              <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{change.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{change.employee}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  change.type === 'Shift Change' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`
                  }>
                      {change.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{change.prev}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium text-green-600">{change.new}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{change.effective}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{change.by}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}