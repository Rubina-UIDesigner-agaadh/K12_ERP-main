import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  DownloadIcon,
  PrinterIcon,
  SearchIcon,
  AlertTriangleIcon,
  BuildingIcon,
  UserIcon,
  BarChart2Icon } from
'lucide-react';
const branchOptions = [
{
  value: 'all',
  label: 'All Branches',
  color: 'bg-gray-600'
},
{
  value: 'main',
  label: 'Main Campus',
  color: 'bg-blue-600'
},
{
  value: 'north',
  label: 'North Branch',
  color: 'bg-green-600'
},
{
  value: 'south',
  label: 'South Branch',
  color: 'bg-orange-600'
},
{
  value: 'east',
  label: 'East Branch',
  color: 'bg-purple-600'
}];

const days = [
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday'];

const teacherSchedules: Record<
  string,
  Record<
    string,
    Record<
      string,
      {
        class: string;
        subject: string;
        room: string;
      }>>> =


{
  sharma: {
    Monday: {
      P1: {
        class: 'Class 8-A',
        subject: 'Maths',
        room: 'R-101'
      },
      P2: {
        class: 'Class 9-A',
        subject: 'Maths',
        room: 'R-201'
      },
      P3: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P4: {
        class: 'Class 10-A',
        subject: 'Maths',
        room: 'R-301'
      },
      P5: {
        class: 'Class 8-B',
        subject: 'Maths',
        room: 'R-102'
      },
      P6: {
        class: '',
        subject: 'Free',
        room: ''
      }
    },
    Tuesday: {
      P1: {
        class: 'Class 9-B',
        subject: 'Maths',
        room: 'R-202'
      },
      P2: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P3: {
        class: 'Class 8-A',
        subject: 'Maths',
        room: 'R-101'
      },
      P4: {
        class: 'Class 10-B',
        subject: 'Maths',
        room: 'R-302'
      },
      P5: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P6: {
        class: 'Class 9-A',
        subject: 'Maths',
        room: 'R-201'
      }
    },
    Wednesday: {
      P1: {
        class: 'Class 10-A',
        subject: 'Maths',
        room: 'R-301'
      },
      P2: {
        class: 'Class 8-B',
        subject: 'Maths',
        room: 'R-102'
      },
      P3: {
        class: 'Class 9-A',
        subject: 'Maths',
        room: 'R-201'
      },
      P4: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P5: {
        class: 'Class 8-A',
        subject: 'Maths',
        room: 'R-101'
      },
      P6: {
        class: '',
        subject: 'Free',
        room: ''
      }
    },
    Thursday: {
      P1: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P2: {
        class: 'Class 10-A',
        subject: 'Maths',
        room: 'R-301'
      },
      P3: {
        class: 'Class 8-A',
        subject: 'Maths',
        room: 'R-101'
      },
      P4: {
        class: 'Class 9-B',
        subject: 'Maths',
        room: 'R-202'
      },
      P5: {
        class: 'Class 10-B',
        subject: 'Maths',
        room: 'R-302'
      },
      P6: {
        class: '',
        subject: 'Free',
        room: ''
      }
    },
    Friday: {
      P1: {
        class: 'Class 8-B',
        subject: 'Maths',
        room: 'R-102'
      },
      P2: {
        class: 'Class 9-A',
        subject: 'Maths',
        room: 'R-201'
      },
      P3: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P4: {
        class: 'Class 8-A',
        subject: 'Maths',
        room: 'R-101'
      },
      P5: {
        class: 'Class 10-A',
        subject: 'Maths',
        room: 'R-301'
      },
      P6: {
        class: 'Class 9-B',
        subject: 'Maths',
        room: 'R-202'
      }
    },
    Saturday: {
      P1: {
        class: 'Class 8-A',
        subject: 'Maths',
        room: 'R-101'
      },
      P2: {
        class: 'Class 9-A',
        subject: 'Maths',
        room: 'R-201'
      },
      P3: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P4: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P5: {
        class: '',
        subject: '',
        room: ''
      },
      P6: {
        class: '',
        subject: '',
        room: ''
      }
    }
  },
  patel: {
    Monday: {
      P1: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P2: {
        class: 'Class 8-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P3: {
        class: 'Class 9-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P4: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P5: {
        class: 'Class 10-A',
        subject: 'Physics',
        room: 'Lab-2'
      },
      P6: {
        class: 'Class 7-A',
        subject: 'Science',
        room: 'R-105'
      }
    },
    Tuesday: {
      P1: {
        class: 'Class 7-A',
        subject: 'Science',
        room: 'R-105'
      },
      P2: {
        class: 'Class 10-A',
        subject: 'Physics',
        room: 'Lab-2'
      },
      P3: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P4: {
        class: 'Class 8-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P5: {
        class: 'Class 9-B',
        subject: 'Science',
        room: 'Lab-1'
      },
      P6: {
        class: '',
        subject: 'Free',
        room: ''
      }
    },
    Wednesday: {
      P1: {
        class: 'Class 9-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P2: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P3: {
        class: 'Class 7-A',
        subject: 'Science',
        room: 'R-105'
      },
      P4: {
        class: 'Class 8-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P5: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P6: {
        class: 'Class 10-A',
        subject: 'Physics',
        room: 'Lab-2'
      }
    },
    Thursday: {
      P1: {
        class: 'Class 9-B',
        subject: 'Science',
        room: 'Lab-1'
      },
      P2: {
        class: 'Class 8-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P3: {
        class: 'Class 10-A',
        subject: 'Physics',
        room: 'Lab-2'
      },
      P4: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P5: {
        class: 'Class 7-A',
        subject: 'Science',
        room: 'R-105'
      },
      P6: {
        class: '',
        subject: 'Free',
        room: ''
      }
    },
    Friday: {
      P1: {
        class: 'Class 10-A',
        subject: 'Physics',
        room: 'Lab-2'
      },
      P2: {
        class: 'Class 9-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P3: {
        class: 'Class 8-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P4: {
        class: 'Class 7-A',
        subject: 'Science',
        room: 'R-105'
      },
      P5: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P6: {
        class: 'Class 9-B',
        subject: 'Science',
        room: 'Lab-1'
      }
    },
    Saturday: {
      P1: {
        class: 'Class 8-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P2: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P3: {
        class: 'Class 9-A',
        subject: 'Science',
        room: 'Lab-1'
      },
      P4: {
        class: '',
        subject: 'Free',
        room: ''
      },
      P5: {
        class: '',
        subject: '',
        room: ''
      },
      P6: {
        class: '',
        subject: '',
        room: ''
      }
    }
  }
};
const workloadData = [
{
  id: 1,
  teacher: 'Mrs. Sharma',
  dept: 'Mathematics',
  subject: 'Mathematics',
  empType: 'Full-time',
  classes: 6,
  periods: 24,
  free: 6,
  load: 'High',
  alert: true
},
{
  id: 2,
  teacher: 'Mr. Patel',
  dept: 'Science',
  subject: 'Science',
  empType: 'Full-time',
  classes: 5,
  periods: 20,
  free: 10,
  load: 'Normal',
  alert: false
},
{
  id: 3,
  teacher: 'Mrs. Verma',
  dept: 'Languages',
  subject: 'English',
  empType: 'Full-time',
  classes: 4,
  periods: 16,
  free: 14,
  load: 'Light',
  alert: false
},
{
  id: 4,
  teacher: 'Mr. Kumar',
  dept: 'Social Studies',
  subject: 'Social Studies',
  empType: 'Full-time',
  classes: 5,
  periods: 18,
  free: 12,
  load: 'Normal',
  alert: false
},
{
  id: 5,
  teacher: 'Mrs. Singh',
  dept: 'Languages',
  subject: 'Hindi',
  empType: 'Full-time',
  classes: 6,
  periods: 22,
  free: 8,
  load: 'High',
  alert: true
},
{
  id: 6,
  teacher: 'Mr. Suresh',
  dept: 'Physical Education',
  subject: 'PE',
  empType: 'Part-time',
  classes: 8,
  periods: 16,
  free: 14,
  load: 'Normal',
  alert: false
},
{
  id: 7,
  teacher: 'Ms. Anita',
  dept: 'Arts',
  subject: 'Art & Craft',
  empType: 'Part-time',
  classes: 6,
  periods: 12,
  free: 18,
  load: 'Light',
  alert: false
}];

const teacherOptions = [
{
  value: 'sharma',
  label: 'Mrs. Sharma (Mathematics)'
},
{
  value: 'patel',
  label: 'Mr. Patel (Science)'
},
{
  value: 'verma',
  label: 'Mrs. Verma (English)'
},
{
  value: 'kumar',
  label: 'Mr. Kumar (Social Studies)'
},
{
  value: 'nair',
  label: 'Ms. Nair (Hindi)'
},
{
  value: 'suresh',
  label: 'Mr. Suresh (PE)'
}];

export function TeacherTimetable() {
  const [tab, setTab] = useState('schedule');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('sharma');
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedEmpType, setSelectedEmpType] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const toggleBranch = (val: string) => {
    if (val === 'all') {
      setSelectedBranches(['all']);
      return;
    }
    setSelectedBranches((prev) => {
      const without = prev.filter((b) => b !== 'all');
      return without.includes(val) ?
      without.filter((b) => b !== val) :
      [...without, val];
    });
  };
  const schedule = teacherSchedules[selectedTeacher] || teacherSchedules.sharma;
  const teacherInfo = workloadData.find((t) =>
  t.teacher.
  toLowerCase().
  includes(
    selectedTeacher === 'sharma' ?
    'sharma' :
    selectedTeacher === 'patel' ?
    'patel' :
    selectedTeacher
  )
  );
  const totalTeachingPeriods = Object.values(schedule).
  flatMap((day) => Object.values(day)).
  filter((c) => c.subject !== 'Free' && c.subject !== '').length;
  const freePeriods = Object.values(schedule).
  flatMap((day) => Object.values(day)).
  filter((c) => c.subject === 'Free').length;
  const filteredWorkload = workloadData.filter((t) => {
    const matchDept =
    !selectedDept || t.dept.toLowerCase().includes(selectedDept);
    const matchSubject =
    !selectedSubject || t.subject.toLowerCase().includes(selectedSubject);
    const matchEmpType =
    !selectedEmpType ||
    t.empType.toLowerCase().replace('-', '') === selectedEmpType;
    const matchSearch =
    !teacherSearch ||
    t.teacher.toLowerCase().includes(teacherSearch.toLowerCase());
    return matchDept && matchSubject && matchEmpType && matchSearch;
  });
  const selectedBranchLabels = selectedBranches.includes('all') ?
  'All Branches' :
  branchOptions.
  filter((b) => selectedBranches.includes(b.value)).
  map((b) => b.label).
  join(', ');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Timetable
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View teacher schedules, workload summary and free period analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<PrinterIcon className="w-4 h-4" />}>

            Print
          </Button>
          <Button
            variant="outline"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>

            Export
          </Button>
        </div>
      </div>

      {/* Multi-Branch Filter */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Branch
            </label>
            <div className="flex flex-wrap gap-2">
              {branchOptions.map((b) =>
              <button
                key={b.value}
                onClick={() => toggleBranch(b.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedBranches.includes(b.value) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>

                  <span className={`w-2 h-2 rounded-full ${b.color}`} />
                  {b.label}
                </button>
              )}
            </div>
          </div>
          <Select
            label="Academic Year"
            options={[
            {
              value: '2025-26',
              label: '2025-26'
            },
            {
              value: '2024-25',
              label: '2024-25'
            }]
            }
            value={selectedYear}
            onChange={setSelectedYear}
            className="w-32" />

        </div>
        {!selectedBranches.includes('all') && selectedBranches.length > 0 &&
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <BuildingIcon className="w-3.5 h-3.5" />
            <span>
              Showing data for:{' '}
              <strong className="text-gray-700">{selectedBranchLabels}</strong>
            </span>
          </div>
        }
      </Card>

      {/* Filter Bar */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Select
            label="Department"
            options={[
            {
              value: '',
              label: 'All Departments'
            },
            {
              value: 'mathematics',
              label: 'Mathematics'
            },
            {
              value: 'science',
              label: 'Science'
            },
            {
              value: 'languages',
              label: 'Languages'
            },
            {
              value: 'social',
              label: 'Social Studies'
            },
            {
              value: 'arts',
              label: 'Arts'
            },
            {
              value: 'pe',
              label: 'Physical Education'
            }]
            }
            value={selectedDept}
            onChange={setSelectedDept}
            className="w-44" />

          <Select
            label="Subject"
            options={[
            {
              value: '',
              label: 'All Subjects'
            },
            {
              value: 'mathematics',
              label: 'Mathematics'
            },
            {
              value: 'science',
              label: 'Science'
            },
            {
              value: 'english',
              label: 'English'
            },
            {
              value: 'hindi',
              label: 'Hindi'
            },
            {
              value: 'social',
              label: 'Social Studies'
            }]
            }
            value={selectedSubject}
            onChange={setSelectedSubject}
            className="w-40" />

          <Input
            label="Teacher Name"
            placeholder="Search teacher..."
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="w-48" />

          <Select
            label="Employment Type"
            options={[
            {
              value: '',
              label: 'All Types'
            },
            {
              value: 'fulltime',
              label: 'Full-time'
            },
            {
              value: 'parttime',
              label: 'Part-time'
            },
            {
              value: 'contract',
              label: 'Contract'
            }]
            }
            value={selectedEmpType}
            onChange={setSelectedEmpType}
            className="w-36" />

          <Button
            variant="primary"
            size="sm"
            leftIcon={<SearchIcon className="w-4 h-4" />}>

            Search
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <Tabs defaultValue="schedule" value={tab} onValueChange={setTab}>
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="schedule">Teacher Schedule View</TabsTrigger>
            <TabsTrigger value="workload">Workload Summary</TabsTrigger>
            <TabsTrigger value="comparison">Branch Comparison</TabsTrigger>
          </TabsList>

          {/* Schedule View */}
          <TabsContent value="schedule" className="p-5">
            <div className="flex gap-3 mb-5 flex-wrap items-end">
              <Select
                label="Select Teacher"
                options={teacherOptions}
                value={selectedTeacher}
                onChange={setSelectedTeacher}
                className="w-64" />

            </div>

            {/* Teacher Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-700">
                  {totalTeachingPeriods}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Teaching Periods/Week
                </p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-green-700">
                  {freePeriods}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Free Periods/Week
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-purple-700">
                  {teacherInfo?.classes || 6}
                </p>
                <p className="text-xs text-purple-600 mt-0.5">
                  Classes Assigned
                </p>
              </div>
              <div
                className={`border rounded-lg p-3 text-center ${teacherInfo?.load === 'High' ? 'bg-red-50 border-red-100' : teacherInfo?.load === 'Light' ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'}`}>

                <p
                  className={`text-xl font-bold ${teacherInfo?.load === 'High' ? 'text-red-700' : teacherInfo?.load === 'Light' ? 'text-blue-700' : 'text-green-700'}`}>

                  {teacherInfo?.load || 'Normal'}
                </p>
                <p
                  className={`text-xs mt-0.5 ${teacherInfo?.load === 'High' ? 'text-red-600' : teacherInfo?.load === 'Light' ? 'text-blue-600' : 'text-green-600'}`}>

                  Workload Level
                </p>
              </div>
            </div>

            {teacherInfo?.alert &&
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
                <AlertTriangleIcon className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                <span>
                  <strong>Workload Alert:</strong> {teacherInfo.teacher} has{' '}
                  {teacherInfo.periods} teaching periods/week, which exceeds the
                  recommended maximum of 22. Consider redistributing some
                  classes.
                </span>
              </div>
            }

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-600 w-20">
                      Day
                    </th>
                    {['P1', 'P2', 'Break', 'P3', 'P4', 'Lunch', 'P5', 'P6'].map(
                      (p) =>
                      <th
                        key={p}
                        className={`border border-gray-200 px-2 py-2 text-center font-semibold text-gray-600 ${p === 'Break' || p === 'Lunch' ? 'bg-gray-100 text-gray-400 w-12' : 'w-28'}`}>

                          {p}
                        </th>

                    )}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) =>
                  <tr key={day} className="hover:bg-gray-50/50">
                      <td className="border border-gray-200 px-3 py-2 font-semibold text-gray-700 bg-gray-50">
                        {day.slice(0, 3)}
                      </td>
                      {[
                    'P1',
                    'P2',
                    'Break',
                    'P3',
                    'P4',
                    'Lunch',
                    'P5',
                    'P6'].
                    map((period) => {
                      if (period === 'Break' || period === 'Lunch')
                      return (
                        <td
                          key={period}
                          className="border border-gray-200 px-1 py-2 text-center text-gray-400 bg-gray-50">

                              {period}
                            </td>);

                      const cell = schedule[day]?.[period];
                      const isFree =
                      !cell ||
                      cell.subject === 'Free' ||
                      cell.subject === '';
                      return (
                        <td
                          key={period}
                          className="border border-gray-200 px-1 py-1.5 text-center">

                            {!isFree && cell ?
                          <div className="bg-blue-100 text-blue-800 rounded px-1 py-1 text-[10px] font-medium">
                                <div>{cell.class}</div>
                                <div className="opacity-70">{cell.subject}</div>
                                {cell.room &&
                            <div className="text-[9px] opacity-60 mt-0.5">
                                    {cell.room}
                                  </div>
                            }
                              </div> :

                          <span className="text-gray-300 text-[10px]">
                                Free
                              </span>
                          }
                          </td>);

                    })}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Workload Summary */}
          <TabsContent value="workload" className="p-5">
            <div className="mb-4 space-y-2">
              {filteredWorkload.
              filter((t) => t.alert).
              map((t) =>
              <div
                key={t.id}
                className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">

                    <AlertTriangleIcon className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                    <span>
                      <strong>{t.teacher}</strong> — {t.periods} periods/week
                      (recommended max: 22). Consider redistributing.
                    </span>
                  </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                    'Teacher',
                    'Department',
                    'Subject',
                    'Emp. Type',
                    'Classes',
                    'Periods/Week',
                    'Free Periods',
                    'Workload'].
                    map((h) =>
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">

                        {h}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredWorkload.map((row) =>
                  <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {row.alert &&
                        <AlertTriangleIcon className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                        }
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          {row.teacher}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.dept}</td>
                      <td className="px-4 py-3 text-gray-600">{row.subject}</td>
                      <td className="px-4 py-3">
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.empType === 'Full-time' ? 'bg-blue-100 text-blue-700' : row.empType === 'Part-time' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>

                          {row.empType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.classes}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                            className={`h-2 rounded-full ${row.periods > 22 ? 'bg-red-500' : row.periods > 18 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{
                              width: `${Math.min(row.periods / 30 * 100, 100)}%`
                            }} />

                          </div>
                          <span className="font-medium text-blue-600">
                            {row.periods}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{row.free}</td>
                      <td className="px-4 py-3">
                        <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.load === 'High' ? 'bg-red-100 text-red-700' : row.load === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>

                          {row.load}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-gray-900">
                  {filteredWorkload.length}
                </p>
                <p className="text-xs text-gray-500">Total Teachers</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-red-700">
                  {filteredWorkload.filter((t) => t.load === 'High').length}
                </p>
                <p className="text-xs text-red-500">High Workload</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-green-700">
                  {filteredWorkload.filter((t) => t.load === 'Normal').length}
                </p>
                <p className="text-xs text-green-500">Normal Workload</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-blue-700">
                  {filteredWorkload.filter((t) => t.load === 'Light').length}
                </p>
                <p className="text-xs text-blue-500">Light Workload</p>
              </div>
            </div>
          </TabsContent>

          {/* Branch Comparison */}
          <TabsContent value="comparison" className="p-5">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
              Select multiple branches in the filter above to compare teacher
              workload across branches.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Workload Distribution">
                <div className="space-y-3">
                  {[
                  {
                    label: 'High Workload (>22 periods)',
                    count: 2,
                    pct: 29,
                    color: 'bg-red-500'
                  },
                  {
                    label: 'Normal (18–22 periods)',
                    count: 3,
                    pct: 43,
                    color: 'bg-green-500'
                  },
                  {
                    label: 'Light (<18 periods)',
                    count: 2,
                    pct: 28,
                    color: 'bg-blue-500'
                  }].
                  map((item) =>
                  <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">
                          {item.count} teachers ({item.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{
                          width: `${item.pct}%`
                        }} />

                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Card title="Department-wise Avg Periods">
                <div className="space-y-2">
                  {[
                  {
                    dept: 'Mathematics',
                    avg: 24,
                    max: 30
                  },
                  {
                    dept: 'Science',
                    avg: 20,
                    max: 30
                  },
                  {
                    dept: 'Languages',
                    avg: 19,
                    max: 30
                  },
                  {
                    dept: 'Social Studies',
                    avg: 18,
                    max: 30
                  },
                  {
                    dept: 'Arts & PE',
                    avg: 14,
                    max: 30
                  }].
                  map((item) =>
                  <div key={item.dept} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-32">
                        {item.dept}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                        className={`h-2 rounded-full ${item.avg > 22 ? 'bg-red-500' : item.avg > 18 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{
                          width: `${item.avg / item.max * 100}%`
                        }} />

                      </div>
                      <span className="text-xs font-medium text-gray-700 w-16 text-right">
                        {item.avg} periods
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}