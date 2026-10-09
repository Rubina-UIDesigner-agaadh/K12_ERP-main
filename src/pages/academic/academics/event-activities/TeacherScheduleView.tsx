import React, { useMemo, useState, createElement } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import {
  PrinterIcon,
  DownloadIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  XIcon } from
'lucide-react';
const DAYS = [
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday'];

const PERIODS = Array.from(
  {
    length: 8
  },
  (_, i) => i + 1
);
const PERIOD_TIMES = [
'8:00-8:45',
'8:45-9:30',
'9:45-10:30',
'10:30-11:15',
'11:30-12:15',
'12:15-1:00',
'2:00-2:45',
'2:45-3:30'];

const TEACHERS = [
{
  id: 't1',
  name: 'R. Sharma',
  subject: 'Mathematics',
  dept: 'Math',
  maxLoad: 40,
  batch: 'Morning'
},
{
  id: 't2',
  name: 'A. Gupta',
  subject: 'Science',
  dept: 'Science',
  maxLoad: 40,
  batch: 'Morning'
},
{
  id: 't3',
  name: 'M. Singh',
  subject: 'English',
  dept: 'English',
  maxLoad: 38,
  batch: 'Afternoon'
},
{
  id: 't4',
  name: 'S. Patel',
  subject: 'History',
  dept: 'Social Studies',
  maxLoad: 38,
  batch: 'Morning'
},
{
  id: 't5',
  name: 'P. Kumar',
  subject: 'Physics',
  dept: 'Science',
  maxLoad: 36,
  batch: 'Afternoon'
}];

const MASTER_FRANCHISES = [
{
  value: 'all',
  label: 'All Franchises'
},
{
  value: 'mf1',
  label: 'ABC Education Group'
},
{
  value: 'mf2',
  label: 'XYZ Learning Hub'
},
{
  value: 'mf3',
  label: 'PQR Academy Network'
}];

const CENTRES = [
{
  value: 'all',
  label: 'All Centres'
},
{
  value: 'c1',
  label: 'Main Campus'
},
{
  value: 'c2',
  label: 'North Branch'
},
{
  value: 'c3',
  label: 'South Branch'
},
{
  value: 'c4',
  label: 'East Wing'
},
{
  value: 'c5',
  label: 'West Campus'
}];

interface ScheduleSlot {
  id: string;
  type: 'teaching' | 'duty' | 'activity' | 'meeting' | 'free';
  class?: string;
  subject?: string;
  room?: string;
  activity?: string;
  location?: string;
  description?: string;
  isSubstitution?: boolean;
  substituteTeacher?: string;
}
type WeekSchedule = Record<string, Record<number, ScheduleSlot | null>>;
const generateTeacherSchedule = (teacherId: string): WeekSchedule => {
  const schedule: WeekSchedule = {};
  const classes = ['IX-A', 'IX-B', 'X-A', 'X-B', 'XI-Sci', 'XII-Sci'];
  const rooms = [
  'Room 101',
  'Room 102',
  'Room 201',
  'Room 202',
  'Lab 1',
  'Lab 2'];

  const teacher = TEACHERS.find((t) => t.id === teacherId);
  DAYS.forEach((day, dayIndex) => {
    schedule[day] = {};
    PERIODS.forEach((period) => {
      if (period === 3 || period === 7) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'free'
        };
        return;
      }
      if (day === 'Monday' && period === 1) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'duty',
          activity: 'Assembly Supervision',
          location: 'School Ground',
          description: 'Monitor student assembly'
        };
      } else if (day === 'Tuesday' && period === 8) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'duty',
          activity: 'Bus Duty Route 4',
          location: 'Transport Bay',
          description: 'Bus departure supervision'
        };
      } else if (day === 'Wednesday' && period === 5) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'meeting',
          activity: `${teacher?.dept} Dept Meeting`,
          location: 'Staff Room',
          description: 'Department meeting'
        };
      } else if (day === 'Thursday' && period === 6) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'activity',
          activity: 'Parent Counseling',
          location: 'Counseling Room',
          description: 'Student performance discussion'
        };
      } else if (day === 'Friday' && period === 4) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'duty',
          activity: 'Exam Invigilation',
          location: 'Hall A',
          description: 'Mid-term exam supervision'
        };
      } else if (day === 'Saturday' && period > 4) {
        schedule[day][period] = {
          id: `${teacherId}-${day}-${period}`,
          type: 'free'
        };
      } else {
        const shouldHaveClass = Math.random() > 0.2;
        if (shouldHaveClass) {
          const classIndex =
          (dayIndex + period + teacherId.charCodeAt(1)) % classes.length;
          const roomIndex = (period + classIndex) % rooms.length;
          schedule[day][period] = {
            id: `${teacherId}-${day}-${period}`,
            type: 'teaching',
            class: classes[classIndex],
            subject: teacher?.subject || 'Subject',
            room: rooms[roomIndex],
            isSubstitution: day === 'Friday' && period === 2
          };
        } else {
          schedule[day][period] = {
            id: `${teacherId}-${day}-${period}`,
            type: 'free'
          };
        }
      }
    });
  });
  return schedule;
};
export function TeacherScheduleView() {
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterMasterFranchise, setFilterMasterFranchise] = useState('all');
  const [filterCentre, setFilterCentre] = useState('all');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [viewMode, setViewMode] = useState<
    'daily' | 'weekly' | 'monthly' | 'list'>(
    'weekly');
  // New filters
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [timePeriod, setTimePeriod] = useState('week');
  const [selectedDate, setSelectedDate] = useState('2026-03-18');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  // Modals
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState<{
    day: string;
    period: number;
  } | null>(null);
  const filteredTeachers = TEACHERS.filter((t) => {
    const matchName = t.name.toLowerCase().includes(searchName.toLowerCase());
    const matchId = t.id.toLowerCase().includes(searchId.toLowerCase());
    const matchBatch = batchFilter === 'all' || t.batch === batchFilter;
    return matchName && matchId && matchBatch;
  });
  const schedule = useMemo(
    () => generateTeacherSchedule(selectedTeacher),
    [selectedTeacher]
  );
  const teacher = useMemo(
    () => TEACHERS.find((t) => t.id === selectedTeacher),
    [selectedTeacher]
  );
  const stats = useMemo(() => {
    let teaching = 0,
      duty = 0,
      activity = 0,
      meeting = 0,
      free = 0;
    Object.values(schedule).forEach((daySchedule) => {
      Object.values(daySchedule).forEach((slot) => {
        if (!slot) return;
        if (slot.type === 'teaching') teaching++;else
        if (slot.type === 'duty') duty++;else
        if (slot.type === 'activity') activity++;else
        if (slot.type === 'meeting') meeting++;else
        if (slot.type === 'free') free++;
      });
    });
    const total = teaching + duty + activity + meeting;
    const workload = teacher ? Math.round(total / teacher.maxLoad * 100) : 0;
    return {
      teaching,
      duty,
      activity,
      meeting,
      free,
      total,
      workload
    };
  }, [schedule, teacher]);
  const dailyBreakdown = useMemo(() => {
    return DAYS.map((day) => {
      const daySchedule = schedule[day] || {};
      let teaching = 0,
        duty = 0,
        other = 0,
        free = 0;
      Object.values(daySchedule).forEach((slot) => {
        if (!slot) return;
        if (slot.type === 'teaching') teaching++;else
        if (slot.type === 'duty') duty++;else
        if (slot.type === 'activity' || slot.type === 'meeting') other++;else
        if (slot.type === 'free') free++;
      });
      return {
        day,
        teaching,
        duty,
        other,
        free,
        total: teaching + duty + other
      };
    });
  }, [schedule]);
  const upcomingActivities = useMemo(() => {
    const activities: Array<{
      day: string;
      period: number;
      time: string;
      slot: ScheduleSlot;
    }> = [];
    const today = new Date().getDay();
    const currentDayIndex = today === 0 ? 6 : today - 1;
    DAYS.forEach((day, index) => {
      if (index >= currentDayIndex) {
        const daySchedule = schedule[day] || {};
        PERIODS.forEach((period) => {
          const slot = daySchedule[period];
          if (
          slot && (
          slot.type === 'duty' ||
          slot.type === 'activity' ||
          slot.type === 'meeting'))
          {
            activities.push({
              day,
              period,
              time: PERIOD_TIMES[period - 1],
              slot
            });
          }
        });
      }
    });
    return activities.slice(0, 5);
  }, [schedule]);
  const handlePrint = () => window.print();
  const handleExport = () => {
    let csv = `Teacher Schedule - ${teacher?.name}\n\nDay,${PERIODS.map((p) => `Period ${p} (${PERIOD_TIMES[p - 1]})`).join(',')}\n`;
    DAYS.forEach((day) => {
      const row = [day];
      PERIODS.forEach((period) => {
        const slot = schedule[day]?.[period];
        if (!slot || slot.type === 'free') row.push('Free');else
        if (slot.type === 'teaching')
        row.push(`${slot.class} - ${slot.subject} (${slot.room})`);else
        row.push(`${slot.activity} (${slot.location})`);
      });
      csv += row.join(',') + '\n';
    });
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule_${teacher?.name.replace(' ', '_')}.csv`;
    a.click();
  };
  const renderMonthlyCalendar = () => {
    const weeks = [1, 2, 3, 4];
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-50 border-b">
          {DAYS.map((d) =>
          <div
            key={d}
            className="p-2 text-center font-medium text-sm border-r last:border-r-0">
            
              {d}
            </div>
          )}
        </div>
        {weeks.map((w) =>
        <div key={w} className="grid grid-cols-6 border-b last:border-b-0">
            {DAYS.map((d, i) => {
            const date = w * 7 - 6 + i;
            if (date > 31)
            return (
              <div
                key={d}
                className="p-2 border-r last:border-r-0 bg-gray-50 min-h-[100px]">
              </div>);

            const dayStats = dailyBreakdown.find((db) => db.day === d);
            return (
              <div
                key={d}
                className="p-2 border-r last:border-r-0 min-h-[100px] hover:bg-gray-50 transition-colors cursor-pointer">
                
                  <div className="font-medium text-gray-500 mb-2">{date}</div>
                  {dayStats && dayStats.total > 0 &&
                <div className="space-y-1">
                      {dayStats.teaching > 0 &&
                  <div className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {dayStats.teaching} Teaching
                        </div>
                  }
                      {dayStats.duty > 0 &&
                  <div className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                          {dayStats.duty} Duty
                        </div>
                  }
                      {dayStats.other > 0 &&
                  <div className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                          {dayStats.other} Other
                        </div>
                  }
                    </div>
                }
                </div>);

          })}
          </div>
        )}
      </div>);

  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Schedule View
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive view of teaching periods and assigned duties
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowActivityModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Activity
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9" />
            
          </div>
          <Select
            options={MASTER_FRANCHISES}
            value={filterMasterFranchise}
            onChange={setFilterMasterFranchise}
            className="w-40" />
          
          <Select
            options={CENTRES}
            value={filterCentre}
            onChange={setFilterCentre}
            className="w-40" />
          
          <Select
            label=""
            value={selectedTeacher}
            onChange={setSelectedTeacher}
            options={filteredTeachers.map((t) => ({
              value: t.id,
              label: `${t.name} (${t.subject})`
            }))} />
          
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'daily' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('daily')}>
              
              Daily
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'weekly' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('weekly')}>
              
              Weekly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'monthly' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('monthly')}>
              
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('list')}>
              
              List View
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Select
              label=""
              value={timePeriod}
              onChange={setTimePeriod}
              options={[
              {
                value: 'day',
                label: 'Day'
              },
              {
                value: 'week',
                label: 'Week'
              },
              {
                value: 'month',
                label: 'Month'
              }]
              }
              className="w-32" />
            
            {timePeriod === 'day' &&
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />

            }
            {timePeriod === 'week' &&
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />

            }
            {timePeriod === 'month' &&
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)} />

            }
          </div>
        </div>

        {teacher &&
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {teacher.name.
              split(' ').
              map((n) => n[0]).
              join('')}
              </div>
              <div>
                <h3 className="font-bold text-lg">{teacher.name}</h3>
                <p className="text-sm text-gray-600">
                  {teacher.subject} | {teacher.dept} Department |{' '}
                  {teacher.batch} Batch
                </p>
                <p className="text-xs text-gray-500">
                  Max Weekly Load: {teacher.maxLoad} periods
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
            {
              label: 'Total Hrs/Week',
              value: stats.total,
              color: 'gray'
            },
            {
              label: 'Teaching Hrs',
              value: stats.teaching,
              color: 'blue'
            },
            {
              label: 'Duty Hrs',
              value: stats.duty + stats.activity + stats.meeting,
              color: 'orange'
            },
            {
              label: 'Free Hrs',
              value: stats.free,
              color: 'green'
            },
            {
              label: 'Workload',
              value: `${stats.workload}%`,
              color: stats.workload > 90 ? 'red' : 'purple'
            }].
            map((stat, i) =>
            <div
              key={i}
              className={`p-3 bg-${stat.color}-50 rounded border border-${stat.color}-200 text-center`}>
              
                  <p className={`text-xl font-bold text-${stat.color}-700`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs text-${stat.color}-600`}>
                    {stat.label}
                  </p>
                </div>
            )}
            </div>
          </div>
        }

        {viewMode === 'weekly' &&
        <ScheduleGrid
          schedule={schedule}
          selectedDay="all"
          onSubClick={(day, period) =>
          setShowSubModal({
            day,
            period
          })
          } />

        }
        {viewMode === 'daily' &&
        <ScheduleList schedule={schedule} selectedDay="Wednesday" />
        }
        {viewMode === 'list' &&
        <ScheduleList schedule={schedule} selectedDay="all" />
        }
        {viewMode === 'monthly' && renderMonthlyCalendar()}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Daily Breakdown">
          <div className="space-y-3">
            {dailyBreakdown.map((day) =>
            <div
              key={day.day}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              
                <div className="w-20 font-medium text-sm">
                  {day.day.substring(0, 3)}
                </div>
                <div className="flex-1 flex gap-2">
                  {day.teaching > 0 &&
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      {day.teaching} Teaching
                    </div>
                }
                  {day.duty > 0 &&
                <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                      {day.duty} Duty
                    </div>
                }
                  {day.other > 0 &&
                <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs">
                      {day.other} Other
                    </div>
                }
                  {day.free > 0 &&
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      {day.free} Free
                    </div>
                }
                </div>
                <div className="font-bold text-sm">Total: {day.total}</div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Upcoming Activities & Duties">
          <div className="space-y-3">
            {upcomingActivities.length === 0 ?
            <p className="text-center text-gray-500 py-4">
                No upcoming activities
              </p> :

            upcomingActivities.map((item, i) =>
            <div key={i} className="p-3 border rounded hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.slot.activity}</h4>
                    <Badge
                  variant={
                  item.slot.type === 'duty' ?
                  'warning' :
                  item.slot.type === 'meeting' ?
                  'default' :
                  'success'
                  }>
                  
                      {item.slot.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3 h-3" />
                      {item.day}, Period {item.period}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-3 h-3" />
                      {item.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-3 h-3" />
                      {item.slot.location}
                    </div>
                    {item.slot.description &&
                <p className="text-xs mt-1">{item.slot.description}</p>
                }
                  </div>
                </div>
            )
            }
          </div>
        </Card>
      </div>

      {showActivityModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Activity</h2>
              <button
              onClick={() => setShowActivityModal(false)}
              className="text-gray-500 hover:text-gray-700">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Day"
                options={DAYS.map((d) => ({
                  value: d,
                  label: d
                }))}
                defaultValue="Monday" />
              
                <Select
                label="Period"
                options={PERIODS.map((p) => ({
                  value: p.toString(),
                  label: `Period ${p}`
                }))}
                defaultValue="1" />
              
              </div>
              <Select
              label="Activity Type"
              options={[
              {
                value: 'teaching',
                label: 'Teaching'
              },
              {
                value: 'duty',
                label: 'Duty'
              },
              {
                value: 'activity',
                label: 'Activity'
              },
              {
                value: 'meeting',
                label: 'Meeting'
              }]
              }
              defaultValue="duty" />
            
              <Input
              label="Activity Name"
              placeholder="e.g. Exam Invigilation" />
            
              <Input label="Location" placeholder="e.g. Hall A" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                placeholder="Add details..." />
              
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowActivityModal(false)}>
              
                Cancel
              </Button>
              <Button onClick={() => setShowActivityModal(false)}>
                Save Activity
              </Button>
            </div>
          </div>
        </div>
      }

      {showSubModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Assign Substitute</h2>
              <button
              onClick={() => setShowSubModal(null)}
              className="text-gray-500 hover:text-gray-700">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Assigning sub for {showSubModal.day}, Period {showSubModal.period}
            </p>
            <div className="space-y-4">
              <Select
              label="Select Substitute Teacher"
              options={TEACHERS.map((t) => ({
                value: t.id,
                label: `${t.name} (${t.subject})`
              }))}
              placeholder="Choose teacher..." />
            
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSubModal(null)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSubModal(null)}>Assign</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}
function ScheduleGrid({
  schedule,
  selectedDay,
  onSubClick




}: {schedule: WeekSchedule;selectedDay: string | 'all';onSubClick: (day: string, period: number) => void;}) {
  const daysToShow = selectedDay === 'all' ? DAYS : [selectedDay];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 bg-gray-50 p-2 w-24 text-center text-gray-600">
              Day
            </th>
            {PERIODS.map((p, i) =>
            <th
              key={p}
              className="border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 min-w-[120px]">
              
                <div className="font-medium">P{p}</div>
                <div className="text-[10px] font-normal text-gray-400">
                  {PERIOD_TIMES[i]}
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {daysToShow.map((day) =>
          <tr key={day}>
              <td className="border border-gray-200 bg-gray-50 p-2 font-medium text-center">
                {day.substring(0, 3)}
              </td>
              {PERIODS.map((period) => {
              const slot = schedule[day]?.[period];
              return (
                <td
                  key={period}
                  className="border border-gray-200 p-1 h-24 relative group">
                  
                    {!slot || slot.type === 'free' ?
                  <div className="h-full rounded bg-gray-50 flex items-center justify-center text-gray-300 text-xs">
                        Free
                      </div> :
                  slot.type === 'teaching' ?
                  <div
                    className={`h-full p-2 rounded flex flex-col justify-center text-center ${slot.isSubstitution ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-100'}`}>
                    
                        <div
                      className={`font-bold text-xs ${slot.isSubstitution ? 'text-orange-800' : 'text-blue-800'}`}>
                      
                          {slot.class}
                        </div>
                        <div className="text-[10px] text-gray-600">
                          {slot.subject}
                        </div>
                        <div
                      className={`text-[10px] ${slot.isSubstitution ? 'text-orange-600' : 'text-blue-600'}`}>
                      
                          {slot.room}
                        </div>
                        {slot.isSubstitution &&
                    <div className="text-[8px] text-orange-500 mt-1">
                            (Substitution)
                          </div>
                    }
                        <button
                      onClick={() => onSubClick(day, period)}
                      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-white border border-gray-200 text-[9px] px-1.5 py-0.5 rounded shadow-sm hover:bg-gray-50 transition-opacity">
                      
                          Assign Sub
                        </button>
                      </div> :

                  <div
                    className={`h-full p-2 rounded flex flex-col justify-center text-center ${slot.type === 'duty' ? 'bg-orange-50 border border-orange-200' : slot.type === 'meeting' ? 'bg-purple-50 border border-purple-200' : 'bg-green-50 border border-green-200'}`}>
                    
                        <div
                      className={`font-bold text-xs ${slot.type === 'duty' ? 'text-orange-800' : slot.type === 'meeting' ? 'text-purple-800' : 'text-green-800'}`}>
                      
                          {slot.activity}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-1">
                          {slot.location}
                        </div>
                      </div>
                  }
                  </td>);

            })}
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
          Teaching
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
          Duty
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-50 border border-purple-200 rounded"></div>
          Meeting
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          Activity
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          Free
        </div>
      </div>
    </div>);

}
function ScheduleList({
  schedule,
  selectedDay



}: {schedule: WeekSchedule;selectedDay: string | 'all';}) {
  const daysToShow = selectedDay === 'all' ? DAYS : [selectedDay];
  return (
    <div className="space-y-6">
      {daysToShow.map((day) =>
      <div key={day}>
          <h3 className="font-bold mb-3 text-lg">{day}</h3>
          <div className="space-y-2">
            {PERIODS.map((period, i) => {
            const slot = schedule[day]?.[period];
            if (!slot || slot.type === 'free') return null;
            return (
              <div
                key={period}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
                
                  <div className="w-20 flex-shrink-0">
                    <div className="font-medium text-sm">Period {period}</div>
                    <div className="text-xs text-gray-500">
                      {PERIOD_TIMES[i]}
                    </div>
                  </div>
                  <div className="flex-1">
                    {slot.type === 'teaching' ?
                  <>
                        <div className="font-medium flex items-center gap-2">
                          {slot.class} - {slot.subject}
                          {slot.isSubstitution &&
                      <Badge variant="warning">Substitution</Badge>
                      }
                        </div>
                        <div className="text-sm text-gray-600">{slot.room}</div>
                      </> :

                  <>
                        <div className="font-medium flex items-center gap-2">
                          {slot.activity}
                          <Badge
                        variant={
                        slot.type === 'duty' ?
                        'warning' :
                        slot.type === 'meeting' ?
                        'default' :
                        'success'
                        }>
                        
                            {slot.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {slot.location}
                        </div>
                        {slot.description &&
                    <div className="text-xs text-gray-500 mt-1">
                            {slot.description}
                          </div>
                    }
                      </>
                  }
                  </div>
                </div>);

          })}
          </div>
        </div>
      )}
    </div>);

}