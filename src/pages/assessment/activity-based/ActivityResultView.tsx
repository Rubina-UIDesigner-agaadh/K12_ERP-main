import React, { useMemo, useState, Fragment } from 'react';
import {
  Download,
  Printer,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  Award,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpDown,
  RefreshCw,
  CheckCircle,
  X } from
'lucide-react';
interface StudentResult {
  id: string;
  rollNo: string;
  name: string;
  gender: 'M' | 'F';
  grades: {
    term1: Record<string, string>;
    term2: Record<string, string>;
  };
  overall: Record<string, string>;
}
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

const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-200',
  B: 'bg-blue-100 text-blue-700 border-blue-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-orange-100 text-orange-700 border-orange-200',
  E: 'bg-red-100 text-red-700 border-red-200'
};
const gradePoints: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1
};
const generateStudentResults = (): StudentResult[] => {
  const names = [
  'Advait Krishnan',
  'Ananya Sharma',
  'Arjun Patel',
  'Divya Nair',
  'Ishaan Mehta',
  'Kavitha Pillai',
  'Kiran Reddy',
  'Meera Iyer',
  'Neha Gupta',
  'Om Desai',
  'Priya Singh',
  'Rahul Kumar',
  'Riya Verma',
  'Sanjay Rao',
  'Tanvi Joshi',
  'Varun Menon',
  'Vihaan Joshi',
  'Yashika Patel',
  'Zara Khan',
  'Aditya Verma'];

  const t1Grades = ['A', 'A', 'B', 'B', 'B', 'C'];
  const t2Grades = ['A', 'A', 'A', 'B', 'B', 'C'];
  return names.map((name, idx) => {
    const t1: Record<string, string> = {};
    const t2: Record<string, string> = {};
    AREAS.forEach((area) => {
      t1[area.id] = t1Grades[Math.floor(Math.random() * t1Grades.length)];
      t2[area.id] = t2Grades[Math.floor(Math.random() * t2Grades.length)];
    });
    const overall: Record<string, string> = {};
    AREAS.forEach((area) => {
      const p1 = gradePoints[t1[area.id]] || 3;
      const p2 = gradePoints[t2[area.id]] || 3;
      const avg = p1 * 0.4 + p2 * 0.6;
      if (avg >= 4.5) overall[area.id] = 'A';else
      if (avg >= 3.5) overall[area.id] = 'B';else
      if (avg >= 2.5) overall[area.id] = 'C';else
      if (avg >= 1.5) overall[area.id] = 'D';else
      overall[area.id] = 'E';
    });
    return {
      id: `s${idx + 1}`,
      rollNo: String(idx + 1).padStart(2, '0'),
      name,
      gender: idx % 3 === 0 ? 'F' : 'M',
      grades: {
        term1: t1,
        term2: t2
      },
      overall
    };
  });
};
function GradeBadge({ grade }: {grade: string;}) {
  if (!grade) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${gradeColors[grade] || 'bg-gray-100 text-gray-600'}`}>

      {grade}
    </span>);

}
export function ActivityResultView() {
  const [selectedClass, setSelectedClass] = useState('8');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('overall');
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [search, setSearch] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [sortField, setSortField] = useState('rollNo');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [students] = useState<StudentResult[]>(generateStudentResults);
  const filtered = useMemo(() => {
    let r = students;
    if (search)
    r = r.filter(
      (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search)
    );
    return r.sort((a, b) => {
      if (sortField === 'rollNo')
      return sortDir === 'asc' ?
      parseInt(a.rollNo) - parseInt(b.rollNo) :
      parseInt(b.rollNo) - parseInt(a.rollNo);
      if (sortField === 'name')
      return sortDir === 'asc' ?
      a.name.localeCompare(b.name) :
      b.name.localeCompare(a.name);
      return 0;
    });
  }, [students, search, sortField, sortDir]);
  const getGrades = (student: StudentResult) => {
    if (selectedTerm === 'term1') return student.grades.term1;
    if (selectedTerm === 'term2') return student.grades.term2;
    return student.overall;
  };
  const stats = useMemo(() => {
    const aCount = students.reduce(
      (acc, s) =>
      acc + Object.values(s.overall).filter((g) => g === 'A').length,
      0
    );
    const total = students.length * AREAS.length;
    return {
      total: students.length,
      aGrades: aCount,
      pct: Math.round(aCount / total * 100)
    };
  }, [students]);
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');else
    {
      setSortField(field);
      setSortDir('asc');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Co-Scholastic Result View
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View compiled co-scholastic grades across all assessment areas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showComparison ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>

            <ArrowUpDown className="w-4 h-4" /> Term Comparison
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total Students
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Areas Assessed
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {AREAS.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            A Grades
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.aGrades}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            A Grade %
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {stats.pct}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

              {['6', '7', '8', '9', '10'].map((c) =>
              <option key={c} value={c}>
                  Class {c}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

              {['A', 'B', 'C'].map((s) =>
              <option key={s} value={s}>
                  Section {s}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="overall">Overall</option>
              <option value="term1">Term 1</option>
              <option value="term2">Term 2</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name or Roll No..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Class {selectedClass}-{selectedSection} —{' '}
            {selectedTerm === 'overall' ?
            'Overall' :
            selectedTerm === 'term1' ?
            'Term 1' :
            'Term 2'}{' '}
            Results
          </h3>
          <span className="text-sm text-gray-500">
            {filtered.length} students
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-16">
                  <button
                    onClick={() => handleSort('rollNo')}
                    className="flex items-center gap-1 hover:text-gray-900">

                    Roll <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-900">

                    Student <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                {showComparison ?
                AREAS.map((area) =>
                <th
                  key={area.id}
                  colSpan={2}
                  className="py-3 px-2 text-center text-xs font-semibold text-gray-600 uppercase border-l border-gray-200">

                        <div className="text-center">{area.shortName}</div>
                        <div className="flex justify-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400">T1</span>
                          <span className="text-[10px] text-gray-400">T2</span>
                        </div>
                      </th>
                ) :
                AREAS.map((area) =>
                <th
                  key={area.id}
                  className="py-3 px-2 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">

                        {area.shortName}
                      </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student) => {
                const grades = getGrades(student);
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {student.rollNo}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900 text-sm">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {student.gender === 'M' ? 'Male' : 'Female'}
                      </p>
                    </td>
                    {showComparison ?
                    AREAS.map((area) =>
                    <Fragment key={area.id}>
                            <td className="py-3 px-2 text-center border-l border-gray-100">
                              <GradeBadge
                          grade={student.grades.term1[area.id]} />

                            </td>
                            <td className="py-3 px-2 text-center">
                              <GradeBadge
                          grade={student.grades.term2[area.id]} />

                            </td>
                          </Fragment>
                    ) :
                    AREAS.map((area) =>
                    <td key={area.id} className="py-3 px-2 text-center">
                            <GradeBadge grade={grades[area.id]} />
                          </td>
                    )}
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Grade Legend
        </p>
        <div className="flex flex-wrap gap-4">
          {[
          {
            g: 'A',
            desc: 'Outstanding'
          },
          {
            g: 'B',
            desc: 'Very Good'
          },
          {
            g: 'C',
            desc: 'Good'
          },
          {
            g: 'D',
            desc: 'Satisfactory'
          },
          {
            g: 'E',
            desc: 'Needs Improvement'
          }].
          map((item) =>
          <div key={item.g} className="flex items-center gap-2">
              <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${gradeColors[item.g]}`}>

                {item.g}
              </span>
              <span className="text-xs text-gray-600">{item.desc}</span>
            </div>
          )}
        </div>
      </div>
    </div>);

}