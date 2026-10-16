import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

import {
  DownloadIcon,
  PrinterIcon,
  ShareIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
  CalendarIcon,
  InfoIcon,
  EditIcon } from
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

const periods = [
'P1\n8:00-8:45',
'P2\n8:45-9:30',
'Break',
'P3\n9:45-10:30',
'P4\n10:30-11:15',
'Lunch',
'P5\n12:00-12:45',
'P6\n12:45-1:30'];

const timetableData: Record<
  string,
  Record<
    string,
    {
      subject: string;
      teacher: string;
    }>> =

{
  Monday: {
    'P1\n8:00-8:45': {
      subject: 'Mathematics',
      teacher: 'Mrs. Sharma'
    },
    'P2\n8:45-9:30': {
      subject: 'Science',
      teacher: 'Mr. Patel'
    },
    'P3\n9:45-10:30': {
      subject: 'English',
      teacher: 'Mrs. Verma'
    },
    'P4\n10:30-11:15': {
      subject: 'Hindi',
      teacher: 'Ms. Nair'
    },
    'P5\n12:00-12:45': {
      subject: 'Social Studies',
      teacher: 'Mr. Kumar'
    },
    'P6\n12:45-1:30': {
      subject: 'Art',
      teacher: 'Ms. Anita'
    }
  },
  Tuesday: {
    'P1\n8:00-8:45': {
      subject: 'English',
      teacher: 'Mrs. Verma'
    },
    'P2\n8:45-9:30': {
      subject: 'Mathematics',
      teacher: 'Mrs. Sharma'
    },
    'P3\n9:45-10:30': {
      subject: 'Science',
      teacher: 'Mr. Patel'
    },
    'P4\n10:30-11:15': {
      subject: 'Social Studies',
      teacher: 'Mr. Kumar'
    },
    'P5\n12:00-12:45': {
      subject: 'Hindi',
      teacher: 'Ms. Nair'
    },
    'P6\n12:45-1:30': {
      subject: 'PE',
      teacher: 'Mr. Suresh'
    }
  },
  Wednesday: {
    'P1\n8:00-8:45': {
      subject: 'Science',
      teacher: 'Mr. Patel'
    },
    'P2\n8:45-9:30': {
      subject: 'Hindi',
      teacher: 'Ms. Nair'
    },
    'P3\n9:45-10:30': {
      subject: 'Mathematics',
      teacher: 'Mrs. Sharma'
    },
    'P4\n10:30-11:15': {
      subject: 'English',
      teacher: 'Mrs. Verma'
    },
    'P5\n12:00-12:45': {
      subject: 'Art',
      teacher: 'Ms. Anita'
    },
    'P6\n12:45-1:30': {
      subject: 'Social Studies',
      teacher: 'Mr. Kumar'
    }
  },
  Thursday: {
    'P1\n8:00-8:45': {
      subject: 'Hindi',
      teacher: 'Ms. Nair'
    },
    'P2\n8:45-9:30': {
      subject: 'Social Studies',
      teacher: 'Mr. Kumar'
    },
    'P3\n9:45-10:30': {
      subject: 'English',
      teacher: 'Mrs. Verma'
    },
    'P4\n10:30-11:15': {
      subject: 'Mathematics',
      teacher: 'Mrs. Sharma'
    },
    'P5\n12:00-12:45': {
      subject: 'Science',
      teacher: 'Mr. Patel'
    },
    'P6\n12:45-1:30': {
      subject: 'Library',
      teacher: '—'
    }
  },
  Friday: {
    'P1\n8:00-8:45': {
      subject: 'Mathematics',
      teacher: 'Mrs. Sharma'
    },
    'P2\n8:45-9:30': {
      subject: 'English',
      teacher: 'Mrs. Verma'
    },
    'P3\n9:45-10:30': {
      subject: 'Hindi',
      teacher: 'Ms. Nair'
    },
    'P4\n10:30-11:15': {
      subject: 'Science',
      teacher: 'Mr. Patel'
    },
    'P5\n12:00-12:45': {
      subject: 'PE',
      teacher: 'Mr. Suresh'
    },
    'P6\n12:45-1:30': {
      subject: 'Social Studies',
      teacher: 'Mr. Kumar'
    }
  },
  Saturday: {
    'P1\n8:00-8:45': {
      subject: 'Science',
      teacher: 'Mr. Patel'
    },
    'P2\n8:45-9:30': {
      subject: 'Mathematics',
      teacher: 'Mrs. Sharma'
    },
    'P3\n9:45-10:30': {
      subject: 'English',
      teacher: 'Mrs. Verma'
    },
    'P4\n10:30-11:15': {
      subject: 'Activity',
      teacher: '—'
    },
    'P5\n12:00-12:45': {
      subject: '',
      teacher: ''
    },
    'P6\n12:45-1:30': {
      subject: '',
      teacher: ''
    }
  }
};
const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-800',
  Science: 'bg-green-100 text-green-800',
  English: 'bg-purple-100 text-purple-800',
  Hindi: 'bg-orange-100 text-orange-800',
  'Social Studies': 'bg-yellow-100 text-yellow-800',
  Art: 'bg-pink-100 text-pink-800',
  PE: 'bg-teal-100 text-teal-800',
  Library: 'bg-indigo-100 text-indigo-800',
  Activity: 'bg-red-100 text-red-800'
};
type ViewMode = 'grid' | 'list' | 'day';
const TEACHERS = ['Mrs. Sharma', 'Mr. Patel', 'Mrs. Verma', 'Mrs. Gupta', 'Mr. Kumar', 'Ms. Reddy', 'Mr. Suresh', 'Mrs. Iyer'];
const SUBJECTS = Object.keys(subjectColors);

export function ClassTimetable() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [grid, setGrid] = useState(() => JSON.parse(JSON.stringify(timetableData)) as typeof timetableData);
  const [editCell, setEditCell] = useState<{ day: string; period: string } | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const saveCell = () => {
    if (!editCell) return;
    setGrid((prev) => ({
      ...prev,
      [editCell.day]: {
        ...prev[editCell.day],
        [editCell.period]: { subject: editSubject, teacher: editTeacher }
      }
    }));
    setNotice(`${editCell.day} ${editCell.period.split('\\n')[0]} updated.`);
    setEditCell(null);
  };
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedClass, setSelectedClass] = useState('class-8');
  const [selectedSection, setSelectedSection] = useState('a');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const branchLabel = branchOptions.find((b) => b.value === selectedBranch)?.label || 'All Branches';
  const classLabel = selectedClass.startsWith('class-') ? `Class ${selectedClass.replace('class-', '')}` : selectedClass.toUpperCase();
  const sectionLabel = `Section ${selectedSection.toUpperCase()}`;

  const runSearch = () => {
    setNotice(`Showing ${branchLabel} · ${selectedYear} · ${classLabel}-${selectedSection.toUpperCase()}.`);
  };

  const handlePrint = () => {
    window.print();
    setNotice('Print dialog opened.');
  };

  const handleShare = async () => {
    const text = `Class Timetable — ${classLabel} ${sectionLabel} · ${selectedYear} · ${branchLabel}`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      setNotice('Timetable summary copied.');
    } catch {
      setNotice(text);
    }
  };

  const handleDownload = (fmt: string) => {
    setShowDownloadMenu(false);
    if (fmt === 'Excel') {
      const rows = [['Day', 'Period', 'Time', 'Subject', 'Teacher'], ...listData.map((r) => [r.day, r.period, r.time, r.subject, r.teacher])];
      const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `class-timetable-${selectedClass}-${selectedSection}.csv`;
      a.click();
      setNotice('Excel (CSV) downloaded.');
      return;
    }
    if (fmt === 'PDF') {
      window.print();
      setNotice('Use the print dialog to save as PDF.');
      return;
    }
    setNotice('Image (PNG): use Print from the browser to save as image/PDF.');
  };
  const listData = days.flatMap((day) =>
  periods.
  filter((p) => p !== 'Break' && p !== 'Lunch').
  map((period) => {
    const cell = grid[day]?.[period];
    return {
      id: `${day}-${period}`,
      day,
      period: period.split('\n')[0],
      time: period.split('\n')[1] || '',
      subject: cell?.subject || '—',
      teacher: cell?.teacher || '—'
    };
  })
  );
  const filteredListData = listData.filter((r) => {
    const matchSubject =
    !selectedSubject ||
    r.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchTeacher =
    !selectedTeacher ||
    r.teacher.toLowerCase().includes(selectedTeacher.toLowerCase());
    return r.subject !== '—' && matchSubject && matchTeacher;
  });
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
          <p className="text-sm text-gray-500 mt-1">
            {classLabel} {sectionLabel} · {selectedYear} · {branchLabel}. Click a period cell to add or change teacher and subject.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ShareIcon className="w-4 h-4" />}
            onClick={handleShare}>

            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<PrinterIcon className="w-4 h-4" />}
            onClick={handlePrint}>

            Print
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}>

              Download ▾
            </Button>
            {showDownloadMenu &&
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                {['PDF', 'Excel', 'Image (PNG)'].map((fmt) =>
              <button
                key={fmt}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => handleDownload(fmt)}>

                    {fmt}
                  </button>
              )}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Combined search panel */}
      <Card>
        <div className="flex flex-wrap gap-3 items-end">
          <Select
            label="School Branch"
            options={branchOptions.map((b) => ({ value: b.value, label: b.label }))}
            value={selectedBranch}
            onChange={setSelectedBranch}
            className="w-44" />

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

          <Select
            label="Class"
            options={[
            {
              value: '',
              label: 'Select Class'
            },
            {
              value: 'preschool',
              label: 'Preschool'
            },
            {
              value: 'kg1',
              label: 'KG-1'
            },
            {
              value: 'kg2',
              label: 'KG-2'
            },
            ...Array.from(
              {
                length: 12
              },
              (_, i) => ({
                value: `class-${i + 1}`,
                label: `Class ${i + 1}`
              })
            )]
            }
            value={selectedClass}
            onChange={setSelectedClass}
            className="w-36" />

          <Select
            label="Section"
            options={[
            {
              value: 'a',
              label: 'Section A'
            },
            {
              value: 'b',
              label: 'Section B'
            },
            {
              value: 'c',
              label: 'Section C'
            }]
            }
            value={selectedSection}
            onChange={setSelectedSection}
            className="w-32" />

          <Select
            label="Subject"
            options={[
            {
              value: '',
              label: 'All Subjects'
            },
            ...Object.keys(subjectColors).map((s) => ({
              value: s.toLowerCase(),
              label: s
            }))]
            }
            value={selectedSubject}
            onChange={setSelectedSubject}
            className="w-40" />

          <Select
            label="Teacher"
            options={[
            {
              value: '',
              label: 'All Teachers'
            },
            {
              value: 'sharma',
              label: 'Mrs. Sharma'
            },
            {
              value: 'patel',
              label: 'Mr. Patel'
            },
            {
              value: 'verma',
              label: 'Mrs. Verma'
            },
            {
              value: 'kumar',
              label: 'Mr. Kumar'
            }]
            }
            value={selectedTeacher}
            onChange={setSelectedTeacher}
            className="w-40" />

          <Button
            variant="primary"
            size="sm"
            leftIcon={<SearchIcon className="w-4 h-4" />}
            onClick={runSearch}>

            Search
          </Button>
        </div>
      </Card>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 px-1">
        <span className="flex items-center gap-1">
          <InfoIcon className="w-3.5 h-3.5" />
          Last updated: 20 Feb 2026
        </span>
        <span>Created by: Admin</span>
        <span>Effective from: 01 Apr 2025</span>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
          Active
        </span>
      </div>

      <Card noPadding>
        <div>
          <div className="px-5 pt-4 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-semibold text-gray-800">{classLabel} {sectionLabel} timetable</h2>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(
              [
              ['grid', <GridIcon className="w-3.5 h-3.5" />, 'Grid'],
              ['list', <ListIcon className="w-3.5 h-3.5" />, 'List'],
              ['day', <CalendarIcon className="w-3.5 h-3.5" />, 'Day']] as
              [ViewMode, React.ReactNode, string][]).
              map(([mode, icon, label]) =>
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === mode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>

                  {icon} {label}
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {/* Grid View */}
            {viewMode === 'grid' &&
            <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-600 w-24">
                          Day / Period
                        </th>
                        {periods.map((p) =>
                      <th
                        key={p}
                        className={`border border-gray-200 px-2 py-2 text-center font-semibold text-gray-600 ${p === 'Break' || p === 'Lunch' ? 'bg-gray-100 text-gray-400 w-14' : 'w-28'}`}>

                            {p.split('\n').map((line, i) =>
                        <div key={i}>{line}</div>
                        )}
                          </th>
                      )}
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((day) =>
                    <tr key={day} className="hover:bg-gray-50/50">
                          <td className="border border-gray-200 px-3 py-2 font-semibold text-gray-700 bg-gray-50">
                            {day}
                          </td>
                          {periods.map((period) => {
                        if (period === 'Break' || period === 'Lunch')
                        return (
                          <td
                            key={period}
                            className="border border-gray-200 px-1 py-2 text-center text-gray-400 bg-gray-50 text-xs">

                                  {period}
                                </td>);

                        const cell = grid[day]?.[period];
                        const subject = cell?.subject || '';
                        const teacher = cell?.teacher || '';
                        const isHighlighted =
                        selectedSubject &&
                        subject.
                        toLowerCase().
                        includes(selectedSubject.toLowerCase());
                        const editing = editCell?.day === day && editCell?.period === period;
                        return (
                          <td
                            key={period}
                            className={`border border-gray-200 px-1 py-1.5 text-center ${isHighlighted ? 'ring-2 ring-blue-400 ring-inset' : ''}`}>
                                {editing ? (
                                  <div className="space-y-1 p-1">
                                    <select className="w-full border rounded text-[10px] px-1 py-0.5" value={editSubject} onChange={(e) => setEditSubject(e.target.value)}>
                                      <option value="">Subject</option>
                                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                    <select className="w-full border rounded text-[10px] px-1 py-0.5" value={editTeacher} onChange={(e) => setEditTeacher(e.target.value)}>
                                      <option value="">Teacher</option>
                                      {TEACHERS.map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                    <div className="flex gap-1">
                                      <button type="button" className="flex-1 bg-indigo-600 text-white rounded text-[10px] py-0.5" onClick={saveCell}>Save</button>
                                      <button type="button" className="flex-1 border rounded text-[10px] py-0.5" onClick={() => setEditCell(null)}>×</button>
                                    </div>
                                  </div>
                                ) : (
                                <button type="button" className="w-full" onClick={() => { setEditCell({ day, period }); setEditSubject(subject); setEditTeacher(teacher === '—' ? '' : teacher); }}>
                                {subject ?
                            <div
                              className={`px-1.5 py-1 rounded text-xs ${subjectColors[subject] || 'bg-gray-100 text-gray-700'}`}>

                                    <div className="font-medium">{subject}</div>
                                    {teacher && teacher !== '—' &&
                              <div className="text-[10px] opacity-70 mt-0.5">
                                        {teacher}
                                      </div>
                              }
                                  </div>
                            : <span className="text-[10px] text-indigo-500">+ Add</span>}
                                </button>
                                )}
                              </td>);

                      })}
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(subjectColors).map(([subject, color]) =>
                <span
                  key={subject}
                  className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>

                      {subject}
                    </span>
                )}
                </div>
              </>
            }

            {/* List View */}
            {viewMode === 'list' &&
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                    'Day',
                    'Period',
                    'Time',
                    'Subject',
                    'Teacher',
                    'Actions'].
                    map((h) =>
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">

                          {h}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListData.map((row) =>
                  <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-700">
                          {row.day}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          {row.period}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">
                          {row.time}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${subjectColors[row.subject] || 'bg-gray-100 text-gray-700'}`}>

                            {row.subject}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">
                          {row.teacher}
                        </td>
                        <td className="px-4 py-2.5">
                          <Button
                        variant="ghost"
                        size="xs"
                        leftIcon={<EditIcon className="w-3 h-3" />}
                        onClick={() => {
                          const periodKey = periods.find((p) => p.startsWith(row.period)) || row.period;
                          const cell = grid[row.day]?.[periodKey];
                          setEditCell({ day: row.day, period: periodKey });
                          setEditSubject(cell?.subject || '');
                          setEditTeacher(cell?.teacher === '—' ? '' : cell?.teacher || '');
                          setViewMode('grid');
                        }}>

                            Edit
                          </Button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            }

            {/* Day View */}
            {viewMode === 'day' &&
            <div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {days.map((day) =>
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedDay === day ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>

                      {day.slice(0, 3)}
                    </button>
                )}
                </div>
                <div className="space-y-2">
                  {periods.map((period) => {
                  if (period === 'Break' || period === 'Lunch')
                  return (
                    <div
                      key={period}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                          <span className="text-xs font-mono text-gray-400 w-24">
                            {period === 'Break' ?
                        '9:30 – 9:45' :
                        '11:15 – 12:00'}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {period}
                          </span>
                        </div>);

                  const cell = grid[selectedDay]?.[period];
                  const [periodId, time] = period.split('\n');
                  return (
                    <div
                      key={period}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">

                        <span className="text-xs font-mono text-gray-500 w-24">
                          {time}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 w-8">
                          {periodId}
                        </span>
                        {cell?.subject ?
                      <>
                            <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${subjectColors[cell.subject] || 'bg-gray-100 text-gray-700'}`}>

                              {cell.subject}
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                              {cell.teacher}
                            </span>
                          </> :

                      <span className="text-gray-400 text-sm">—</span>
                      }
                        <Button
                        variant="ghost"
                        size="xs"
                        leftIcon={<EditIcon className="w-3 h-3" />}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setEditCell({ day: selectedDay, period });
                          setEditSubject(cell?.subject || '');
                          setEditTeacher(cell?.teacher === '—' ? '' : cell?.teacher || '');
                          setViewMode('grid');
                        }}>

                          Edit
                        </Button>
                      </div>);

                })}
                </div>
              </div>
            }
          </div>
        </div>
      </Card>
    </div>);

}