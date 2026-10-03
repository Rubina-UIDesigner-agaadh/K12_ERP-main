import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  DownloadIcon,
  SearchIcon,
  LockIcon,
  UnlockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  CalendarIcon,
  BarChart2Icon,
  EditIcon,
  SaveIcon } from
'lucide-react';
interface StudentAttendance {
  id: number;
  rollNo: string;
  student: string;
  class: string;
  section: string;
  status: 'Present' | 'Absent' | 'Late';
  arrivalTime: string;
  remarks: string;
}
interface AttendanceSummary {
  id: number;
  student: string;
  class: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}
const attendanceRoster: StudentAttendance[] = [
{
  id: 1,
  rollNo: '01',
  student: 'Aarav Sharma',
  class: 'Class 3',
  section: 'A',
  status: 'Present',
  arrivalTime: '08:10',
  remarks: ''
},
{
  id: 2,
  rollNo: '02',
  student: 'Priya Patel',
  class: 'Class 3',
  section: 'A',
  status: 'Absent',
  arrivalTime: '—',
  remarks: 'Sick leave'
},
{
  id: 3,
  rollNo: '03',
  student: 'Rohan Mehta',
  class: 'Class 3',
  section: 'A',
  status: 'Late',
  arrivalTime: '09:15',
  remarks: 'Traffic'
},
{
  id: 4,
  rollNo: '04',
  student: 'Sneha Joshi',
  class: 'Class 3',
  section: 'A',
  status: 'Present',
  arrivalTime: '08:05',
  remarks: ''
},
{
  id: 5,
  rollNo: '05',
  student: 'Karan Verma',
  class: 'Class 3',
  section: 'A',
  status: 'Present',
  arrivalTime: '08:20',
  remarks: ''
},
{
  id: 6,
  rollNo: '06',
  student: 'Ananya Singh',
  class: 'Class 3',
  section: 'A',
  status: 'Present',
  arrivalTime: '08:12',
  remarks: ''
},
{
  id: 7,
  rollNo: '07',
  student: 'Dev Kapoor',
  class: 'Class 3',
  section: 'A',
  status: 'Absent',
  arrivalTime: '—',
  remarks: 'Family function'
},
{
  id: 8,
  rollNo: '08',
  student: 'Riya Gupta',
  class: 'Class 3',
  section: 'A',
  status: 'Present',
  arrivalTime: '08:18',
  remarks: ''
},
{
  id: 9,
  rollNo: '09',
  student: 'Arjun Nair',
  class: 'Class 3',
  section: 'A',
  status: 'Present',
  arrivalTime: '08:08',
  remarks: ''
},
{
  id: 10,
  rollNo: '10',
  student: 'Meera Iyer',
  class: 'Class 3',
  section: 'A',
  status: 'Late',
  arrivalTime: '09:30',
  remarks: 'Bus delay'
}];

const summaryData: AttendanceSummary[] = [
{
  id: 1,
  student: 'Aarav Sharma',
  class: 'Class 3-A',
  totalDays: 45,
  present: 43,
  absent: 1,
  late: 1,
  percentage: 95.6
},
{
  id: 2,
  student: 'Priya Patel',
  class: 'Class 3-A',
  totalDays: 45,
  present: 38,
  absent: 6,
  late: 1,
  percentage: 84.4
},
{
  id: 3,
  student: 'Rohan Mehta',
  class: 'Class 3-A',
  totalDays: 45,
  present: 40,
  absent: 2,
  late: 3,
  percentage: 88.9
},
{
  id: 4,
  student: 'Sneha Joshi',
  class: 'Class 3-A',
  totalDays: 45,
  present: 45,
  absent: 0,
  late: 0,
  percentage: 100
},
{
  id: 5,
  student: 'Karan Verma',
  class: 'Class 3-A',
  totalDays: 45,
  present: 42,
  absent: 2,
  late: 1,
  percentage: 93.3
},
{
  id: 6,
  student: 'Ananya Singh',
  class: 'Class 3-A',
  totalDays: 45,
  present: 44,
  absent: 1,
  late: 0,
  percentage: 97.8
},
{
  id: 7,
  student: 'Dev Kapoor',
  class: 'Class 3-A',
  totalDays: 45,
  present: 35,
  absent: 9,
  late: 1,
  percentage: 77.8
},
{
  id: 8,
  student: 'Riya Gupta',
  class: 'Class 3-A',
  totalDays: 45,
  present: 43,
  absent: 1,
  late: 1,
  percentage: 95.6
}];

const classSummaryData = [
{
  id: 1,
  class: 'Class 1-A',
  totalStudents: 32,
  avgAttendance: 94.2,
  presentToday: 30,
  absentToday: 2,
  locked: false
},
{
  id: 2,
  class: 'Class 1-B',
  totalStudents: 30,
  avgAttendance: 91.8,
  presentToday: 27,
  absentToday: 3,
  locked: true
},
{
  id: 3,
  class: 'Class 2-A',
  totalStudents: 35,
  avgAttendance: 96.1,
  presentToday: 34,
  absentToday: 1,
  locked: false
},
{
  id: 4,
  class: 'Class 2-B',
  totalStudents: 33,
  avgAttendance: 88.5,
  presentToday: 29,
  absentToday: 4,
  locked: false
},
{
  id: 5,
  class: 'Class 3-A',
  totalStudents: 31,
  avgAttendance: 92.3,
  presentToday: 28,
  absentToday: 3,
  locked: false
},
{
  id: 6,
  class: 'Class 3-B',
  totalStudents: 30,
  avgAttendance: 89.7,
  presentToday: 27,
  absentToday: 3,
  locked: true
}];

const auditData = [
{
  id: 1,
  action: 'Attendance Marked',
  user: 'Ms. Anita Verma',
  dateTime: '25 Feb 2026, 08:35',
  details: 'Class 3-A — 8 Present, 2 Absent, 2 Late'
},
{
  id: 2,
  action: 'Attendance Edited',
  user: 'Ms. Anita Verma',
  dateTime: '25 Feb 2026, 09:00',
  details: 'Rohan Mehta status changed from Absent to Late'
},
{
  id: 3,
  action: 'Attendance Locked',
  user: 'Principal',
  dateTime: '24 Feb 2026, 17:00',
  details: 'Class 1-B attendance locked for 24 Feb 2026'
},
{
  id: 4,
  action: 'Report Exported',
  user: 'Admin',
  dateTime: '24 Feb 2026, 16:30',
  details: 'Monthly attendance report exported — February 2026'
},
{
  id: 5,
  action: 'Bulk Attendance Marked',
  user: 'Mr. Rajesh Patel',
  dateTime: '24 Feb 2026, 08:30',
  details: 'Class 2-B — All 33 students marked Present'
}];

export function AcademicAttendance() {
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('2026-02-25');
  const [searchStudent, setSearchStudent] = useState('');
  const [attendanceStatuses, setAttendanceStatuses] = useState<
    Record<number, 'Present' | 'Absent' | 'Late'>>(
    Object.fromEntries(attendanceRoster.map((s) => [s.id, s.status])));
  const [isLocked, setIsLocked] = useState(false);
  const presentCount = Object.values(attendanceStatuses).filter(
    (s) => s === 'Present'
  ).length;
  const absentCount = Object.values(attendanceStatuses).filter(
    (s) => s === 'Absent'
  ).length;
  const lateCount = Object.values(attendanceStatuses).filter(
    (s) => s === 'Late'
  ).length;
  const attendancePct = Math.round(
    presentCount / attendanceRoster.length * 100
  );
  const toggleStatus = (id: number) => {
    if (isLocked) return;
    setAttendanceStatuses((prev) => {
      const current = prev[id];
      const next =
      current === 'Present' ?
      'Absent' :
      current === 'Absent' ?
      'Late' :
      'Present';
      return {
        ...prev,
        [id]: next
      };
    });
  };
  const markAllPresent = () => {
    if (isLocked) return;
    setAttendanceStatuses(
      Object.fromEntries(attendanceRoster.map((s) => [s.id, 'Present']))
    );
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Attendance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Mark, edit and track student attendance with class-wise summaries
            and export options
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export Report
          </Button>
          <Button
            variant={isLocked ? 'danger' : 'outline'}
            size="sm"
            leftIcon={
            isLocked ?
            <UnlockIcon className="w-4 h-4" /> :

            <LockIcon className="w-4 h-4" />

            }
            onClick={() => setIsLocked(!isLocked)}>

            {isLocked ? 'Unlock Attendance' : 'Lock Attendance'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<SaveIcon className="w-4 h-4" />}>

            Save Attendance
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Select
            label="Class"
            options={[
            {
              value: '',
              label: 'All Classes'
            },
            {
              value: 'class-1a',
              label: 'Class 1-A'
            },
            {
              value: 'class-1b',
              label: 'Class 1-B'
            },
            {
              value: 'class-2a',
              label: 'Class 2-A'
            },
            {
              value: 'class-2b',
              label: 'Class 2-B'
            },
            {
              value: 'class-3a',
              label: 'Class 3-A'
            },
            {
              value: 'class-3b',
              label: 'Class 3-B'
            }]
            }
            value={filterClass}
            onChange={setFilterClass}
            className="w-40" />

          <Input
            label="Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-40" />

          <Input
            label="Search Student"
            placeholder="Search by name..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="w-52" />

          <div className="flex items-end gap-2 ml-auto">
            <Button variant="outline" size="sm">
              Reset
            </Button>
            <Button variant="primary" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <UsersIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {attendanceRoster.length}
          </p>
          <p className="text-xs text-blue-500 mt-1">Students in class</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
              Present
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
          <p className="text-xs text-green-500 mt-1">{attendancePct}% today</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircleIcon className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
              Absent
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
          <p className="text-xs text-red-500 mt-1">Not in school</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
              Late
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
          <p className="text-xs text-yellow-500 mt-1">Late arrivals</p>
        </div>
      </div>

      {/* Lock notice */}
      {isLocked &&
      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <LockIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            Attendance is locked. Only authorized roles (Principal / Admin) can
            unlock and edit.
          </p>
        </div>
      }

      {/* Main Tabs */}
      <Card noPadding>
        <Tabs defaultValue="mark">
          <div className="px-5 pt-4">
            <TabsList>
              <TabsTrigger value="mark">
                <CheckCircleIcon className="w-3.5 h-3.5" /> Mark Attendance
              </TabsTrigger>
              <TabsTrigger value="summary">
                <BarChart2Icon className="w-3.5 h-3.5" /> Student Summary
              </TabsTrigger>
              <TabsTrigger value="class-summary">
                <UsersIcon className="w-3.5 h-3.5" /> Class-wise Summary
              </TabsTrigger>
              <TabsTrigger value="audit">
                <CalendarIcon className="w-3.5 h-3.5" /> Audit Log
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mark Attendance Tab */}
          <TabsContent value="mark" className="p-5">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={markAllPresent}
                disabled={isLocked}>

                Mark All Present
              </Button>
              <Button variant="outline" size="sm" disabled={isLocked}>
                Mark All Absent
              </Button>
              <p className="text-xs text-gray-500 self-center ml-2">
                Click status badge to toggle: Present → Absent → Late
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Arrival Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceRoster.
                  filter(
                    (s) =>
                    !searchStudent ||
                    s.student.
                    toLowerCase().
                    includes(searchStudent.toLowerCase())
                  ).
                  map((student) => {
                    const status = attendanceStatuses[student.id];
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors">

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.rollNo}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900 text-sm">
                              {student.student}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                            onClick={() => toggleStatus(student.id)}
                            disabled={isLocked}
                            className={`cursor-pointer ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}>

                              <Badge
                              variant={
                              status === 'Present' ?
                              'success' :
                              status === 'Absent' ?
                              'danger' :
                              'warning'
                              }>

                                {status}
                              </Badge>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {student.arrivalTime}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {student.remarks || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                            variant="ghost"
                            size="xs"
                            leftIcon={<EditIcon className="w-3 h-3" />}
                            disabled={isLocked}>

                              Edit
                            </Button>
                          </td>
                        </tr>);

                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Student Summary Tab */}
          <TabsContent value="summary" className="p-5">
            <Table
              columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.student}
                    </span>

              },
              {
                key: 'class',
                header: 'Class'
              },
              {
                key: 'totalDays',
                header: 'Total Days'
              },
              {
                key: 'present',
                header: 'Present',
                render: (row) =>
                <span className="text-green-700 font-medium">
                      {row.present}
                    </span>

              },
              {
                key: 'absent',
                header: 'Absent',
                render: (row) =>
                <span className="text-red-600 font-medium">
                      {row.absent}
                    </span>

              },
              {
                key: 'late',
                header: 'Late',
                render: (row) =>
                <span className="text-yellow-600 font-medium">
                      {row.late}
                    </span>

              },
              {
                key: 'percentage',
                header: 'Attendance %',
                render: (row) =>
                <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                      className={`h-2 rounded-full ${row.percentage >= 90 ? 'bg-green-500' : row.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{
                        width: `${row.percentage}%`
                      }} />

                      </div>
                      <span
                    className={`text-sm font-medium ${row.percentage >= 90 ? 'text-green-700' : row.percentage >= 75 ? 'text-yellow-700' : 'text-red-700'}`}>

                        {row.percentage}%
                      </span>
                      {row.percentage < 75 &&
                  <Badge variant="danger">Low</Badge>
                  }
                    </div>

              }]
              }
              data={summaryData} />

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}>

                Export Attendance Report
              </Button>
            </div>
          </TabsContent>

          {/* Class-wise Summary Tab */}
          <TabsContent value="class-summary" className="p-5">
            <Table
              columns={[
              {
                key: 'class',
                header: 'Class',
                render: (row) =>
                <span className="font-medium text-gray-900">
                      {row.class}
                    </span>

              },
              {
                key: 'totalStudents',
                header: 'Total Students'
              },
              {
                key: 'presentToday',
                header: 'Present Today',
                render: (row) =>
                <span className="text-green-700 font-medium">
                      {row.presentToday}
                    </span>

              },
              {
                key: 'absentToday',
                header: 'Absent Today',
                render: (row) =>
                <span className="text-red-600 font-medium">
                      {row.absentToday}
                    </span>

              },
              {
                key: 'avgAttendance',
                header: 'Avg Attendance %',
                render: (row) =>
                <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                      className={`h-2 rounded-full ${row.avgAttendance >= 90 ? 'bg-green-500' : row.avgAttendance >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{
                        width: `${row.avgAttendance}%`
                      }} />

                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {row.avgAttendance}%
                      </span>
                    </div>

              },
              {
                key: 'locked',
                header: 'Lock Status',
                render: (row) =>
                row.locked ?
                <Badge variant="danger">
                        <LockIcon className="w-3 h-3 mr-1" />
                        Locked
                      </Badge> :

                <Badge variant="success">
                        <UnlockIcon className="w-3 h-3 mr-1" />
                        Open
                      </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<DownloadIcon className="w-3 h-3" />}>

                        Export
                      </Button>
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={
                    row.locked ?
                    <UnlockIcon className="w-3 h-3" /> :

                    <LockIcon className="w-3 h-3" />

                    }>

                        {row.locked ? 'Unlock' : 'Lock'}
                      </Button>
                    </div>

              }]
              }
              data={classSummaryData} />

          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="p-5">
            <Table
              columns={[
              {
                key: 'action',
                header: 'Action',
                render: (row) =>
                <span className="font-medium text-gray-800">
                      {row.action}
                    </span>

              },
              {
                key: 'user',
                header: 'User'
              },
              {
                key: 'dateTime',
                header: 'Date & Time',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.dateTime}
                    </span>

              },
              {
                key: 'details',
                header: 'Details',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.details}</span>

              }]
              }
              data={auditData} />

          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}