import React, { useState, Fragment } from 'react';
import {
  BarChart2,
  Download,
  ChevronRight,
  ChevronDown,
  Users,
  FileText,
  Printer,
  CheckCircle,
  Clock,
  TrendingUp } from
'lucide-react';
interface ClassData {
  standard: string;
  totalStudents: number;
  generated: number;
  printed: number;
  collected: number;
  sections: SectionData[];
  expanded: boolean;
}
interface SectionData {
  section: string;
  totalStudents: number;
  generated: number;
  printed: number;
  collected: number;
}
const initialData: ClassData[] = [
{
  standard: 'Class 8',
  totalStudents: 120,
  generated: 120,
  printed: 118,
  collected: 105,
  expanded: false,
  sections: [
  {
    section: 'Section A',
    totalStudents: 40,
    generated: 40,
    printed: 40,
    collected: 36
  },
  {
    section: 'Section B',
    totalStudents: 40,
    generated: 40,
    printed: 38,
    collected: 35
  },
  {
    section: 'Section C',
    totalStudents: 40,
    generated: 40,
    printed: 40,
    collected: 34
  }]

},
{
  standard: 'Class 9',
  totalStudents: 115,
  generated: 115,
  printed: 112,
  collected: 98,
  expanded: false,
  sections: [
  {
    section: 'Section A',
    totalStudents: 38,
    generated: 38,
    printed: 37,
    collected: 33
  },
  {
    section: 'Section B',
    totalStudents: 39,
    generated: 39,
    printed: 38,
    collected: 34
  },
  {
    section: 'Section C',
    totalStudents: 38,
    generated: 38,
    printed: 37,
    collected: 31
  }]

},
{
  standard: 'Class 10',
  totalStudents: 108,
  generated: 108,
  printed: 108,
  collected: 100,
  expanded: false,
  sections: [
  {
    section: 'Section A',
    totalStudents: 36,
    generated: 36,
    printed: 36,
    collected: 34
  },
  {
    section: 'Section B',
    totalStudents: 36,
    generated: 36,
    printed: 36,
    collected: 33
  },
  {
    section: 'Section C',
    totalStudents: 36,
    generated: 36,
    printed: 36,
    collected: 33
  }]

},
{
  standard: 'Class 11',
  totalStudents: 95,
  generated: 95,
  printed: 90,
  collected: 82,
  expanded: false,
  sections: [
  {
    section: 'Science',
    totalStudents: 48,
    generated: 48,
    printed: 46,
    collected: 42
  },
  {
    section: 'Commerce',
    totalStudents: 47,
    generated: 47,
    printed: 44,
    collected: 40
  }]

}];

function ProgressBar({
  value,
  max,
  color




}: {value: number;max: number;color: string;}) {
  const pct = Math.round(value / max * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${pct}%`
          }} />

      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
    </div>);

}
export function ResultDistributionReport() {
  const [classData, setClassData] = useState<ClassData[]>(initialData);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedBoard, setSelectedBoard] = useState('All');
  const [selectedStd, setSelectedStd] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const totalStudents = classData.reduce((a, c) => a + c.totalStudents, 0);
  const totalGenerated = classData.reduce((a, c) => a + c.generated, 0);
  const totalPrinted = classData.reduce((a, c) => a + c.printed, 0);
  const totalCollected = classData.reduce((a, c) => a + c.collected, 0);
  const totalPending = totalStudents - totalCollected;
  const collectionPct = Math.round(totalCollected / totalStudents * 100);
  const toggleExpand = (idx: number) => {
    setClassData((prev) =>
    prev.map((c, i) =>
    i === idx ?
    {
      ...c,
      expanded: !c.expanded
    } :
    c
    )
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl text-white shadow-lg">
            <BarChart2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Result Distribution Report
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Distribution summary across classes and exams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export Summary
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
            <FileText className="w-4 h-4" /> Export Detailed Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
        {
          label: 'Total Students',
          value: totalStudents,
          color: 'text-gray-900',
          bg: 'bg-white',
          icon: Users
        },
        {
          label: 'Cards Generated',
          value: totalGenerated,
          color: 'text-teal-600',
          bg: 'bg-white',
          icon: FileText
        },
        {
          label: 'Total Printed',
          value: totalPrinted,
          color: 'text-indigo-600',
          bg: 'bg-white',
          icon: Printer
        },
        {
          label: 'Total Collected',
          value: totalCollected,
          color: 'text-green-600',
          bg: 'bg-white',
          icon: CheckCircle
        },
        {
          label: 'Total Pending',
          value: totalPending,
          color: 'text-red-500',
          bg: 'bg-white',
          icon: Clock
        },
        {
          label: '% Collected',
          value: `${collectionPct}%`,
          color: 'text-cyan-600',
          bg: 'bg-cyan-50 border-cyan-200',
          icon: TrendingUp
        }].
        map(({ label, value, color, bg, icon: Icon }) =>
        <div
          key={label}
          className={`rounded-xl border border-gray-200 p-4 ${bg}`}>

            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-xs text-gray-500 uppercase font-medium">
                {label}
              </p>
            </div>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
          {
            label: 'Academic Year',
            value: selectedYear,
            setter: setSelectedYear,
            options: ['2024-25', '2023-24']
          },
          {
            label: 'Board',
            value: selectedBoard,
            setter: setSelectedBoard,
            options: ['All', 'CBSE', 'ICSE', 'GSEB']
          },
          {
            label: 'Standard',
            value: selectedStd,
            setter: setSelectedStd,
            options: ['All', '8', '9', '10', '11', '12']
          },
          {
            label: 'Section',
            value: selectedSection,
            setter: setSelectedSection,
            options: ['All', 'A', 'B', 'C']
          },
          {
            label: 'Exam',
            value: selectedExam,
            setter: setSelectedExam,
            options: ['Annual Exam', 'Term 1', 'Term 2']
          }].
          map(({ label, value, setter, options }) =>
          <div key={label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
              </label>
              <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">

                {options.map((o) =>
              <option key={o}>{o}</option>
              )}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">
          Collection Progress by Class
        </h3>
        <div className="space-y-4">
          {classData.map((cls) => {
            const pct = Math.round(cls.collected / cls.totalStudents * 100);
            return (
              <div key={cls.standard}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">
                    {cls.standard}
                  </span>
                  <span className="text-sm text-gray-500">
                    {cls.collected}/{cls.totalStudents} collected ({pct}%)
                  </span>
                </div>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-teal-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{
                      width: `${pct}%`
                    }} />

                </div>
              </div>);

          })}
        </div>
      </div>

      {/* Drill-down Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">
            Class-wise Breakdown (Click to expand sections)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Class / Section
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Total Students
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Generated
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Printed
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Collected
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Pending
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase w-48">
                  Collection Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {classData.map((cls, idx) =>
              <Fragment key={cls.standard}>
                  <tr
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer bg-gray-50/50"
                  onClick={() => toggleExpand(idx)}>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        {cls.expanded ?
                      <ChevronDown className="w-4 h-4 text-teal-600" /> :

                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      }
                        {cls.standard}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-900">
                      {cls.totalStudents}
                    </td>
                    <td className="py-3 px-4 text-center text-teal-700 font-medium">
                      {cls.generated}
                    </td>
                    <td className="py-3 px-4 text-center text-indigo-700 font-medium">
                      {cls.printed}
                    </td>
                    <td className="py-3 px-4 text-center text-green-700 font-medium">
                      {cls.collected}
                    </td>
                    <td className="py-3 px-4 text-center text-red-500 font-medium">
                      {cls.totalStudents - cls.collected}
                    </td>
                    <td className="py-3 px-4">
                      <ProgressBar
                      value={cls.collected}
                      max={cls.totalStudents}
                      color="bg-teal-500" />

                    </td>
                  </tr>
                  {cls.expanded &&
                cls.sections.map((sec) =>
                <tr
                  key={sec.section}
                  className="border-b border-gray-100 hover:bg-blue-50/20 bg-blue-50/10">

                        <td className="py-2.5 px-4 pl-10 text-gray-700 text-sm">
                          {sec.section}
                        </td>
                        <td className="py-2.5 px-4 text-center text-gray-600 text-sm">
                          {sec.totalStudents}
                        </td>
                        <td className="py-2.5 px-4 text-center text-teal-600 text-sm">
                          {sec.generated}
                        </td>
                        <td className="py-2.5 px-4 text-center text-indigo-600 text-sm">
                          {sec.printed}
                        </td>
                        <td className="py-2.5 px-4 text-center text-green-600 text-sm">
                          {sec.collected}
                        </td>
                        <td className="py-2.5 px-4 text-center text-red-400 text-sm">
                          {sec.totalStudents - sec.collected}
                        </td>
                        <td className="py-2.5 px-4">
                          <ProgressBar
                      value={sec.collected}
                      max={sec.totalStudents}
                      color="bg-teal-400" />

                        </td>
                      </tr>
                )}
                </Fragment>
              )}
              <tr className="bg-teal-50 border-t-2 border-teal-200">
                <td className="py-3 px-4 font-bold text-gray-900">TOTAL</td>
                <td className="py-3 px-4 text-center font-bold text-gray-900">
                  {totalStudents}
                </td>
                <td className="py-3 px-4 text-center font-bold text-teal-700">
                  {totalGenerated}
                </td>
                <td className="py-3 px-4 text-center font-bold text-indigo-700">
                  {totalPrinted}
                </td>
                <td className="py-3 px-4 text-center font-bold text-green-700">
                  {totalCollected}
                </td>
                <td className="py-3 px-4 text-center font-bold text-red-500">
                  {totalPending}
                </td>
                <td className="py-3 px-4">
                  <ProgressBar
                    value={totalCollected}
                    max={totalStudents}
                    color="bg-teal-600" />

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}