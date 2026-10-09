import React, { useState, Component } from 'react';
import {
  BarChart3,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  AlertTriangle,
  Filter,
  RefreshCw,
  ChevronDown,
  Eye,
  Search,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
type TabId =
'class-area' |
'grade-dist' |
'gender' |
'heatmap' |
'low-grade' |
'improvement';
const AREAS = [
{
  id: 'ls',
  name: 'Life Skills',
  shortName: 'Life Skills'
},
{
  id: 'we',
  name: 'Work Education',
  shortName: 'Work Ed.'
},
{
  id: 'vpa',
  name: 'Visual & Performing Arts',
  shortName: 'Visual Arts'
},
{
  id: 'av',
  name: 'Attitudes & Values',
  shortName: 'Attitudes'
},
{
  id: 'hpe',
  name: 'Health & Physical Education',
  shortName: 'Health & PE'
},
{
  id: 'dis',
  name: 'Discipline',
  shortName: 'Discipline'
},
{
  id: 'cap',
  name: 'Club Participation',
  shortName: 'Club Part.'
},
{
  id: 'sr',
  name: 'Social Responsibility',
  shortName: 'Social Resp.'
}];

const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-red-100 text-red-700'
};
const classAreaData: Record<string, Record<string, number>> = {
  'Class 6': {
    ls: 3.8,
    we: 3.5,
    vpa: 4.1,
    av: 3.9,
    hpe: 4.2,
    dis: 3.7,
    cap: 3.4,
    sr: 3.6
  },
  'Class 7': {
    ls: 3.9,
    we: 3.7,
    vpa: 4.0,
    av: 4.0,
    hpe: 4.1,
    dis: 3.8,
    cap: 3.6,
    sr: 3.7
  },
  'Class 8': {
    ls: 4.2,
    we: 3.9,
    vpa: 4.3,
    av: 4.1,
    hpe: 4.4,
    dis: 4.0,
    cap: 3.8,
    sr: 4.0
  },
  'Class 9': {
    ls: 4.0,
    we: 4.1,
    vpa: 3.8,
    av: 4.2,
    hpe: 4.0,
    dis: 4.1,
    cap: 3.9,
    sr: 4.2
  },
  'Class 10': {
    ls: 4.3,
    we: 4.2,
    vpa: 4.0,
    av: 4.4,
    hpe: 4.1,
    dis: 4.3,
    cap: 4.0,
    sr: 4.3
  }
};
const gradeDistData = {
  A: 312,
  B: 445,
  C: 198,
  D: 67,
  E: 23
};
const genderData: Record<
  string,
  {
    male: number;
    female: number;
  }> =
{
  ls: {
    male: 3.9,
    female: 4.2
  },
  we: {
    male: 4.0,
    female: 3.8
  },
  vpa: {
    male: 3.7,
    female: 4.4
  },
  av: {
    male: 4.0,
    female: 4.3
  },
  hpe: {
    male: 4.5,
    female: 4.0
  },
  dis: {
    male: 3.8,
    female: 4.2
  },
  cap: {
    male: 3.9,
    female: 3.8
  },
  sr: {
    male: 3.7,
    female: 4.1
  }
};
const heatmapColor = (val: number) => {
  if (val >= 4.5) return 'bg-green-600 text-white';
  if (val >= 4.0) return 'bg-green-400 text-white';
  if (val >= 3.5) return 'bg-yellow-300 text-gray-800';
  if (val >= 3.0) return 'bg-orange-300 text-gray-800';
  return 'bg-red-400 text-white';
};
const lowGradeStudents = [
{
  name: 'Ravi Kumar',
  class: 'Class 6',
  section: 'B',
  area: 'Life Skills',
  grade: 'E',
  term: 'Term 2',
  rollNo: '14'
},
{
  name: 'Pooja Singh',
  class: 'Class 7',
  section: 'A',
  area: 'Work Education',
  grade: 'E',
  term: 'Term 2',
  rollNo: '22'
},
{
  name: 'Arjun Patel',
  class: 'Class 8',
  section: 'A',
  area: 'Discipline',
  grade: 'D',
  term: 'Term 2',
  rollNo: '03'
},
{
  name: 'Sneha Reddy',
  class: 'Class 6',
  section: 'C',
  area: 'Social Responsibility',
  grade: 'E',
  term: 'Term 2',
  rollNo: '31'
},
{
  name: 'Mohan Das',
  class: 'Class 9',
  section: 'B',
  area: 'Club Participation',
  grade: 'D',
  term: 'Term 2',
  rollNo: '18'
},
{
  name: 'Preethi Nair',
  class: 'Class 7',
  section: 'A',
  area: 'Attitudes & Values',
  grade: 'D',
  term: 'Term 2',
  rollNo: '09'
},
{
  name: 'Karthik Iyer',
  class: 'Class 10',
  section: 'A',
  area: 'Work Education',
  grade: 'D',
  term: 'Term 2',
  rollNo: '27'
},
{
  name: 'Divya Menon',
  class: 'Class 6',
  section: 'A',
  area: 'Health & PE',
  grade: 'D',
  term: 'Term 2',
  rollNo: '07'
}];

const improvementStudents = [
{
  name: 'Advait Krishnan',
  class: 'Class 8',
  section: 'A',
  area: 'Work Education',
  t1: 'B',
  t2: 'A',
  improvement: '+1 grade',
  rollNo: '01'
},
{
  name: 'Ananya Sharma',
  class: 'Class 8',
  section: 'A',
  area: 'Health & PE',
  t1: 'C',
  t2: 'B',
  improvement: '+1 grade',
  rollNo: '02'
},
{
  name: 'Divya Nair',
  class: 'Class 8',
  section: 'A',
  area: 'Life Skills',
  t1: 'B',
  t2: 'A',
  improvement: '+1 grade',
  rollNo: '04'
},
{
  name: 'Rohan Mehta',
  class: 'Class 9',
  section: 'B',
  area: 'Discipline',
  t1: 'D',
  t2: 'B',
  improvement: '+2 grades',
  rollNo: '15'
},
{
  name: 'Priya Sharma',
  class: 'Class 7',
  section: 'A',
  area: 'Visual Arts',
  t1: 'C',
  t2: 'A',
  improvement: '+2 grades',
  rollNo: '11'
},
{
  name: 'Arun Kumar',
  class: 'Class 6',
  section: 'C',
  area: 'Social Responsibility',
  t1: 'D',
  t2: 'C',
  improvement: '+1 grade',
  rollNo: '28'
},
{
  name: 'Meena Pillai',
  class: 'Class 10',
  section: 'A',
  area: 'Club Participation',
  t1: 'C',
  t2: 'A',
  improvement: '+2 grades',
  rollNo: '19'
},
{
  name: 'Suresh Nair',
  class: 'Class 9',
  section: 'A',
  area: 'Attitudes & Values',
  t1: 'C',
  t2: 'B',
  improvement: '+1 grade',
  rollNo: '23'
}];

function BarChartSVG({ selectedClass }: {selectedClass: string;}) {
  const data = classAreaData[selectedClass];
  const maxVal = 5;
  const barWidth = 42;
  const gap = 10;
  const chartHeight = 160;
  const leftPad = 40;
  const barColors = [
  '#6366f1',
  '#f59e0b',
  '#a855f7',
  '#14b8a6',
  '#22c55e',
  '#3b82f6',
  '#f97316',
  '#f43f5e'];

  const totalWidth = leftPad + AREAS.length * (barWidth + gap) + 20;
  return (
    <div className="overflow-x-auto">
      <svg width={totalWidth} height={chartHeight + 60}>
        {[1, 2, 3, 4, 5].map((v) => {
          const y = chartHeight - v / maxVal * chartHeight + 10;
          return (
            <g key={v}>
              <text
                x={leftPad - 6}
                y={y + 4}
                fontSize="10"
                fill="#9ca3af"
                textAnchor="end">

                {v}
              </text>
              <line
                x1={leftPad}
                y1={y}
                x2={totalWidth - 10}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1" />

            </g>);

        })}
        <line
          x1={leftPad}
          y1={10}
          x2={leftPad}
          y2={chartHeight + 10}
          stroke="#e5e7eb"
          strokeWidth="1" />

        {AREAS.map((area, idx) => {
          const val = data[area.id] || 0;
          const barH = val / maxVal * chartHeight;
          const x = leftPad + idx * (barWidth + gap) + 5;
          const y = chartHeight - barH + 10;
          return (
            <g key={area.id}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={barColors[idx]}
                rx="4"
                opacity="0.85" />

              <text
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="9"
                fill="#374151"
                textAnchor="middle"
                fontWeight="600">

                {val.toFixed(1)}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight + 28}
                fontSize="8"
                fill="#6b7280"
                textAnchor="middle">

                {area.shortName}
              </text>
            </g>);

        })}
      </svg>
    </div>);

}
function DonutChart() {
  const total = Object.values(gradeDistData).reduce((a, b) => a + b, 0);
  const colorMap: Record<string, string> = {
    A: '#22c55e',
    B: '#3b82f6',
    C: '#eab308',
    D: '#f97316',
    E: '#ef4444'
  };
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const innerR = 42;
  let cumAngle = -Math.PI / 2;
  const slices = Object.entries(gradeDistData).map(([grade, count]) => {
    const angle = count / total * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    return {
      grade,
      count,
      d,
      color: colorMap[grade]
    };
  });
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <svg width={size} height={size}>
        {slices.map((slice) =>
        <path
          key={slice.grade}
          d={slice.d}
          fill={slice.color}
          opacity="0.9" />

        )}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="#1f2937">

          {total}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280">

          Total Grades
        </text>
      </svg>
      <div className="space-y-3">
        {Object.entries(gradeDistData).map(([grade, count]) =>
        <div key={grade} className="flex items-center gap-3">
            <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${gradeColors[grade]}`}>

              {grade}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div
              className="h-2.5 rounded-full transition-all"
              style={{
                width: `${count / total * 100}%`,
                backgroundColor: {
                  A: '#22c55e',
                  B: '#3b82f6',
                  C: '#eab308',
                  D: '#f97316',
                  E: '#ef4444'
                }[grade]
              }} />

            </div>
            <span className="text-sm font-semibold text-gray-700 w-10">
              {count}
            </span>
            <span className="text-xs text-gray-400">
              {(count / total * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>);

}
export function ActivityPerformanceAnalysis() {
  const [activeTab, setActiveTab] = useState<TabId>('class-area');
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [search, setSearch] = useState('');
  const tabs: {
    id: TabId;
    label: string;
    icon: ComponentType<{
      className?: string;
    }>;
  }[] = [
  {
    id: 'class-area',
    label: 'Class-wise Area Performance',
    icon: BarChart3
  },
  {
    id: 'grade-dist',
    label: 'Grade Distribution',
    icon: Award
  },
  {
    id: 'gender',
    label: 'Gender-wise Analysis',
    icon: Users
  },
  {
    id: 'heatmap',
    label: 'Skill Strength Heatmap',
    icon: Filter
  },
  {
    id: 'low-grade',
    label: 'Low Grade Identification',
    icon: AlertTriangle
  },
  {
    id: 'improvement',
    label: 'Improvement Tracking',
    icon: TrendingUp
  }];

  const filteredLowGrade = lowGradeStudents.filter(
    (s) =>
    search === '' ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );
  const filteredImprovement = improvementStudents.filter(
    (s) => search === '' || s.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Co-Scholastic Performance Analysis
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Analytics and insights across all co-scholastic areas, classes,
              and terms
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">

            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
            <Download className="w-4 h-4" /> Board Submission
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total Students
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,045</p>
          <p className="text-xs text-gray-400 mt-1">Across 5 classes</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            A Grade %
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">29.8%</p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3.2% vs Term 1
          </p>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Needs Attention
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-1">90</p>
          <p className="text-xs text-gray-400 mt-1">D or E grade students</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Improved
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">234</p>
          <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Term 1 → Term 2
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch('');
                  }}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>);

            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Class-wise Area Performance */}
          {activeTab === 'class-area' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Class-wise Area Performance
                  </h2>
                  <p className="text-sm text-gray-500">
                    Average grade points per co-scholastic area by class
                  </p>
                </div>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  {CLASSES.map((cls) =>
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${selectedClass === cls ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>

                      {cls}
                    </button>
                )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  {selectedClass} — Average Grade Points per Area (Scale: 1–5)
                </h3>
                <BarChartSVG selectedClass={selectedClass} />
              </div>
              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border border-gray-200 rounded-lg">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Class
                      </th>
                      {AREAS.map((a) =>
                    <th
                      key={a.id}
                      className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">

                          {a.shortName}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CLASSES.map((cls) =>
                  <tr
                    key={cls}
                    className={`hover:bg-gray-50 ${cls === selectedClass ? 'bg-violet-50' : ''}`}>

                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {cls}
                        </td>
                        {AREAS.map((area) => {
                      const val = classAreaData[cls][area.id];
                      return (
                        <td key={area.id} className="py-3 px-3 text-center">
                              <span
                            className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold ${heatmapColor(val)}`}>

                                {val.toFixed(1)}
                              </span>
                            </td>);

                    })}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {/* Grade Distribution */}
          {activeTab === 'grade-dist' &&
          <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Grade Distribution
                </h2>
                <p className="text-sm text-gray-500">
                  Distribution of A/B/C/D/E grades across all students and areas
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <DonutChart />
              </div>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(gradeDistData).map(([grade, count]) => {
                const total = Object.values(gradeDistData).reduce(
                  (a, b) => a + b,
                  0
                );
                return (
                  <div
                    key={grade}
                    className={`p-4 rounded-xl border text-center ${gradeColors[grade].replace('text-', 'border-').replace('bg-', 'border-').split(' ')[0]} bg-white`}>

                      <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold mb-2 ${gradeColors[grade]}`}>

                        {grade}
                      </span>
                      <p className="text-2xl font-bold text-gray-900">
                        {count}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(count / total * 100).toFixed(1)}%
                      </p>
                    </div>);

              })}
              </div>
            </div>
          }

          {/* Gender-wise Analysis */}
          {activeTab === 'gender' &&
          <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gender-wise Performance Analysis
                </h2>
                <p className="text-sm text-gray-500">
                  Comparison of male vs female average grade points per
                  co-scholastic area
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Co-Scholastic Area
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-blue-600 uppercase">
                        Male Avg (GP)
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-pink-600 uppercase">
                        Female Avg (GP)
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Difference
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Better Performing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {AREAS.map((area) => {
                    const d = genderData[area.id];
                    const diff = Math.abs(d.female - d.male).toFixed(1);
                    const better =
                    d.female > d.male ?
                    'Female' :
                    d.male > d.female ?
                    'Male' :
                    'Equal';
                    return (
                      <tr key={area.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {area.name}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${d.male / 5 * 100}%`
                                }} />

                              </div>
                              <span className="text-sm font-bold text-blue-700">
                                {d.male.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                className="bg-pink-500 h-2 rounded-full"
                                style={{
                                  width: `${d.female / 5 * 100}%`
                                }} />

                              </div>
                              <span className="text-sm font-bold text-pink-700">
                                {d.female.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm font-semibold text-gray-700">
                              {diff}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${better === 'Female' ? 'bg-pink-100 text-pink-700' : better === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

                              {better}
                            </span>
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {/* Heatmap */}
          {activeTab === 'heatmap' &&
          <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Skill Strength Heatmap
                </h2>
                <p className="text-sm text-gray-500">
                  Classes × Areas — color-coded by average grade point
                  performance
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200">
                        Class
                      </th>
                      {AREAS.map((area) =>
                    <th
                      key={area.id}
                      className="py-3 px-3 text-center text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 whitespace-nowrap">

                          {area.shortName}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody>
                    {CLASSES.map((cls) =>
                  <tr key={cls}>
                        <td className="py-3 px-4 font-semibold text-gray-900 bg-gray-50 border border-gray-200">
                          {cls}
                        </td>
                        {AREAS.map((area) => {
                      const val = classAreaData[cls][area.id];
                      return (
                        <td
                          key={area.id}
                          className={`py-3 px-3 text-center border border-gray-200 ${heatmapColor(val)}`}>

                              <span className="text-sm font-bold">
                                {val.toFixed(1)}
                              </span>
                            </td>);

                    })}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase">
                  Legend:
                </span>
                {[
              {
                label: '≥ 4.5 Excellent',
                cls: 'bg-green-600 text-white'
              },
              {
                label: '4.0–4.4 Very Good',
                cls: 'bg-green-400 text-white'
              },
              {
                label: '3.5–3.9 Good',
                cls: 'bg-yellow-300 text-gray-800'
              },
              {
                label: '3.0–3.4 Average',
                cls: 'bg-orange-300 text-gray-800'
              },
              {
                label: '< 3.0 Needs Attention',
                cls: 'bg-red-400 text-white'
              }].
              map((item) =>
              <div key={item.label} className="flex items-center gap-2">
                    <div
                  className={`w-6 h-6 rounded ${item.cls} flex items-center justify-center text-xs font-bold`}>

                      ●
                    </div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
              )}
              </div>
            </div>
          }

          {/* Low Grade Identification */}
          {activeTab === 'low-grade' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Low Grade Identification
                  </h2>
                  <p className="text-sm text-gray-500">
                    Students with D or E grades requiring attention and
                    intervention
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-48" />

                </div>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-sm text-orange-800">
                  <strong>
                    {filteredLowGrade.filter((s) => s.grade === 'E').length}{' '}
                    students
                  </strong>{' '}
                  have E grades and require immediate intervention.
                  <strong className="ml-2">
                    {filteredLowGrade.filter((s) => s.grade === 'D').length}{' '}
                    students
                  </strong>{' '}
                  have D grades and need monitoring.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Student
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Class
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Co-Scholastic Area
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Grade
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Term
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLowGrade.map((student, idx) =>
                  <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">
                              {student.rollNo}
                            </div>
                            <span className="font-medium text-gray-900">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {student.class}-{student.section}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {student.area}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${gradeColors[student.grade]}`}>

                            {student.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">
                          {student.term}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 mx-auto">
                            <Eye className="w-3 h-3" /> View Profile
                          </button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }

          {/* Improvement Tracking */}
          {activeTab === 'improvement' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Improvement Tracking
                  </h2>
                  <p className="text-sm text-gray-500">
                    Students who improved their co-scholastic grades from Term 1
                    to Term 2
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-48" />

                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <strong>{filteredImprovement.length} students</strong> showed
                  improvement from Term 1 to Term 2.
                  <strong className="ml-2">
                    {
                  filteredImprovement.filter((s) =>
                  s.improvement.includes('+2')
                  ).length
                  }
                  </strong>{' '}
                  improved by 2 or more grades.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Student
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Class
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Area
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Term 1
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Term 2
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Improvement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredImprovement.map((student, idx) =>
                  <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                              {student.rollNo}
                            </div>
                            <span className="font-medium text-gray-900">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {student.class}-{student.section}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {student.area}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${gradeColors[student.t1]}`}>

                            {student.t1}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${gradeColors[student.t2]}`}>

                            {student.t2}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <TrendingUp className="w-3 h-3" />{' '}
                            {student.improvement}
                          </span>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}