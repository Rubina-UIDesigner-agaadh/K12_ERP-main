import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../../components/ui/Tabs';
import {
  CalendarIcon,
  SearchIcon,
  BellIcon,
  PlusIcon,
  ImageIcon,
  FileTextIcon,
  VideoIcon } from
'lucide-react';
const calendarEvents = [
{
  date: '2025-06-14',
  title: 'PTM - Class 8',
  type: 'Academic',
  color: 'bg-blue-500'
},
{
  date: '2025-06-15',
  title: 'School Closed (Holiday)',
  type: 'Holiday',
  color: 'bg-red-500'
},
{
  date: '2025-06-20',
  title: 'Science Exhibition',
  type: 'Event',
  color: 'bg-purple-500'
},
{
  date: '2025-06-25',
  title: 'Annual Sports Day',
  type: 'Sports',
  color: 'bg-green-500'
},
{
  date: '2025-06-28',
  title: 'Term 1 Exam Begins',
  type: 'Exam',
  color: 'bg-orange-500'
}];

const typeBadge = (t: string) => {
  const c: Record<string, string> = {
    Academic: 'bg-blue-100 text-blue-700',
    Holiday: 'bg-red-100 text-red-700',
    Event: 'bg-purple-100 text-purple-700',
    Sports: 'bg-green-100 text-green-700',
    Exam: 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c[t] || 'bg-gray-100 text-gray-600'}`}>

      {t}
    </span>);

};
export function SmartEventCalendar() {
  const [tab, setTab] = useState('academic');
  const [selectedDate, setSelectedDate] = useState('');
  const dateData = selectedDate ?
  {
    events: calendarEvents.filter((e) => e.date === selectedDate),
    images: selectedDate === '2025-06-20' ? 3 : 0,
    videos: selectedDate === '2025-06-20' ? 1 : 0,
    notices: selectedDate === '2025-06-15' ? 2 : 0,
    attendance: selectedDate < '2025-06-15'
  } :
  null;
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Smart Event Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Academic, event, holiday and exam calendars with smart date search
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="academic" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="academic">Academic Calendar</TabsTrigger>
            <TabsTrigger value="events">Event Calendar</TabsTrigger>
            <TabsTrigger value="holidays">Holiday Calendar</TabsTrigger>
            <TabsTrigger value="exams">Exam Calendar</TabsTrigger>
            <TabsTrigger value="search">Smart Date Search</TabsTrigger>
          </TabsList>

          <TabsContent value="academic" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">June 2025</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        ‹
                      </Button>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        ›
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (d) =>
                      <div
                        key={d}
                        className="text-center text-xs font-semibold text-gray-400 py-1">

                          {d}
                        </div>

                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from(
                      {
                        length: 35
                      },
                      (_, i) => {
                        const day = i - 5;
                        const dateStr = `2025-06-${String(day).padStart(2, '0')}`;
                        const events = calendarEvents.filter(
                          (e) => e.date === dateStr
                        );
                        return (
                          <div
                            key={i}
                            className={`min-h-[52px] p-1 rounded-lg border ${day > 0 && day <= 30 ? 'border-gray-100 hover:bg-gray-50 cursor-pointer' : 'border-transparent'} ${day === 10 ? 'bg-blue-50 border-blue-200' : ''}`}
                            onClick={() =>
                            day > 0 && day <= 30 && setSelectedDate(dateStr)
                            }>

                            {day > 0 && day <= 30 &&
                            <>
                                <p
                                className={`text-xs font-medium ${day === 10 ? 'text-blue-600' : 'text-gray-700'}`}>

                                  {day}
                                </p>
                                {events.map((e, ei) =>
                              <div
                                key={ei}
                                className={`text-[9px] text-white rounded px-1 mt-0.5 truncate ${e.color}`}>

                                    {e.title}
                                  </div>
                              )}
                              </>
                            }
                          </div>);

                      }
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Card title="Upcoming Events">
                  <div className="space-y-2">
                    {calendarEvents.map((e, i) =>
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">

                        <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${e.color}`} />

                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {e.title}
                          </p>
                          <p className="text-xs text-gray-400">{e.date}</p>
                        </div>
                        {typeBadge(e.type)}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="p-5">
            <div className="flex gap-3 mb-4">
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Event Types'
                },
                {
                  value: 'sports',
                  label: 'Sports'
                },
                {
                  value: 'cultural',
                  label: 'Cultural'
                },
                {
                  value: 'academic',
                  label: 'Academic'
                }]
                }
                className="w-44" />

              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
            <div className="space-y-3">
              {calendarEvents.
              filter(
                (e) =>
                e.type === 'Event' ||
                e.type === 'Sports' ||
                e.type === 'Academic'
              ).
              map((e, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">

                    <div className={`w-3 h-12 rounded-full ${e.color}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{e.title}</p>
                      <p className="text-xs text-gray-500">{e.date}</p>
                    </div>
                    {typeBadge(e.type)}
                    <div className="flex gap-2">
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        <BellIcon className="w-3 h-3 mr-1" />
                        Notify
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Edit
                      </Button>
                    </div>
                  </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="holidays" className="p-5">
            <div className="space-y-3">
              {[
              {
                name: 'Eid al-Adha',
                date: '2025-06-07',
                type: 'National',
                day: 'Saturday'
              },
              {
                name: 'School Closed (Maintenance)',
                date: '2025-06-15',
                type: 'School',
                day: 'Sunday'
              },
              {
                name: 'Independence Day',
                date: '2025-08-15',
                type: 'National',
                day: 'Friday'
              },
              {
                name: 'Janmashtami',
                date: '2025-08-16',
                type: 'National',
                day: 'Saturday'
              },
              {
                name: 'Gandhi Jayanti',
                date: '2025-10-02',
                type: 'National',
                day: 'Thursday'
              }].
              map((h, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">

                  <div className="text-center w-12">
                    <p className="text-lg font-bold text-red-600">
                      {h.date.split('-')[2]}
                    </p>
                    <p className="text-xs text-red-400">
                      {h.date.split('-')[1] === '06' ?
                    'Jun' :
                    h.date.split('-')[1] === '08' ?
                    'Aug' :
                    'Oct'}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.day}</p>
                  </div>
                  <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${h.type === 'National' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>

                    {h.type}
                  </span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="exams" className="p-5">
            <div className="space-y-3">
              {[
              {
                exam: 'Unit Test 1',
                class: 'All Classes',
                startDate: '2025-06-28',
                endDate: '2025-07-02',
                type: 'Unit Test'
              },
              {
                exam: 'Half Yearly Examination',
                class: 'Class 9 & 10',
                startDate: '2025-09-15',
                endDate: '2025-09-25',
                type: 'Half Yearly'
              },
              {
                exam: 'Annual Examination',
                class: 'All Classes',
                startDate: '2025-02-10',
                endDate: '2025-02-28',
                type: 'Annual'
              }].
              map((e, i) =>
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{e.exam}</p>
                    <p className="text-xs text-gray-500">
                      {e.class} • {e.startDate} to {e.endDate}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    {e.type}
                  </span>
                  <Button variant="ghost" className="text-xs h-7 px-2">
                    View Schedule
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="p-5">
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Select a Date to View All Activity
              </label>
              <div className="flex gap-3">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-56" />

                <Button variant="primary">
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Search Date
                </Button>
              </div>
            </div>

            {selectedDate &&
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Timeline for {selectedDate}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                {
                  icon: CalendarIcon,
                  label: 'Events',
                  value: dateData?.events.length || 0,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                {
                  icon: ImageIcon,
                  label: 'Photos',
                  value: dateData?.images || 0,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50'
                },
                {
                  icon: VideoIcon,
                  label: 'Videos',
                  value: dateData?.videos || 0,
                  color: 'text-green-600',
                  bg: 'bg-green-50'
                },
                {
                  icon: FileTextIcon,
                  label: 'Notices',
                  value: dateData?.notices || 0,
                  color: 'text-orange-600',
                  bg: 'bg-orange-50'
                },
                {
                  icon: CalendarIcon,
                  label: 'Circulars',
                  value: 0,
                  color: 'text-red-600',
                  bg: 'bg-red-50'
                },
                {
                  icon: CalendarIcon,
                  label: 'Attendance',
                  value: dateData?.attendance ? 'Marked' : 'N/A',
                  color: 'text-teal-600',
                  bg: 'bg-teal-50'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className={`flex items-center gap-3 p-4 rounded-xl ${item.bg}`}>

                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div>
                        <p className={`text-lg font-bold ${item.color}`}>
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    </div>
                )}
                </div>
                {dateData && dateData.events.length > 0 &&
              <Card title="Events on this date">
                    <div className="space-y-2">
                      {dateData.events.map((e, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                          <div className={`w-2 h-2 rounded-full ${e.color}`} />
                          <p className="text-sm font-medium text-gray-800">
                            {e.title}
                          </p>
                          {typeBadge(e.type)}
                        </div>
                  )}
                    </div>
                  </Card>
              }
              </div>
            }
            {!selectedDate &&
            <div className="text-center py-12 text-gray-400">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  Select a date to view all associated events, media, notices
                  and more
                </p>
              </div>
            }
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}