import React, { useMemo, useState, Fragment } from 'react';
import {
  LayoutGrid,
  Save,
  Search,
  Filter,
  Users,
  TrendingUp,
  Download } from
'lucide-react';
interface SubjectDef {
  id: string;
  name: string;
  short: string;
  max: number;
  pass: number;
}
interface StudentRow {
  id: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  marks: Record<string, string>;
}
const getGrade = (pct: number) => {
  if (pct >= 91)
  return {
    grade: 'A1',
    cls: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  };
  if (pct >= 81)
  return {
    grade: 'A2',
    cls: 'bg-green-100 text-green-700 border-green-300'
  };
  if (pct >= 71)
  return {
    grade: 'B1',
    cls: 'bg-teal-100 text-teal-700 border-teal-300'
  };
  if (pct >= 61)
  return {
    grade: 'B2',
    cls: 'bg-cyan-100 text-cyan-700 border-cyan-300'
  };
  if (pct >= 51)
  return {
    grade: 'C1',
    cls: 'bg-blue-100 text-blue-700 border-blue-300'
  };
  if (pct >= 41)
  return {
    grade: 'C2',
    cls: 'bg-indigo-100 text-indigo-700 border-indigo-300'
  };
  if (pct >= 33)
  return {
    grade: 'D',
    cls: 'bg-amber-100 text-amber-700 border-amber-300'
  };
  return {
    grade: 'E',
    cls: 'bg-red-100 text-red-700 border-red-300'
  };
};
const SUBJECTS: SubjectDef[] = [
{
  id: 'MATH',
  name: 'Mathematics',
  short: 'Math',
  max: 80,
  pass: 27
},
{
  id: 'PHY',
  name: 'Physics',
  short: 'Phy',
  max: 70,
  pass: 23
},
{
  id: 'CHEM',
  name: 'Chemistry',
  short: 'Chem',
  max: 70,
  pass: 23
},
{
  id: 'BIO',
  name: 'Biology',
  short: 'Bio',
  max: 70,
  pass: 23
},
{
  id: 'ENG',
  name: 'English',
  short: 'Eng',
  max: 80,
  pass: 27
},
{
  id: 'HIN',
  name: 'Hindi',
  short: 'Hin',
  max: 80,
  pass: 27
}];

const CLASSES = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const YEARS = ['2024-25', '2023-24', '2022-23'];
const EXAM_GROUPS = ['Term 1', 'Term 2', 'Annual', 'Final'];
const MOCK_STUDENTS: StudentRow[] = Array.from(
  {
    length: 15
  },
  (_, i) => ({
    id: `S${String(i + 1).padStart(2, '0')}`,
    rollNo: String(i + 1).padStart(2, '0'),
    admissionNo: `ADM2024${String(i + 1).padStart(3, '0')}`,
    name: [
    'Aditya Sharma',
    'Priya Patel',
    'Rahul Verma',
    'Sunita Gupta',
    'Ishaan Khattar',
    'Meera Nair',
    'Sanjay Kumar',
    'Kavita Joshi',
    'Amit Tiwari',
    'Neha Singh',
    'Vikram Reddy',
    'Anjali Menon',
    'Rajesh Pillai',
    'Deepika Agarwal',
    'Arjun Malhotra'][
    i],
    marks: {
      MATH: [
      '65',
      '72',
      '28',
      '55',
      '78',
      '',
      '45',
      '80',
      '32',
      '',
      '70',
      '60',
      '50',
      '38',
      '79'][
      i],
      PHY: [
      '55',
      '62',
      '',
      '45',
      '68',
      '',
      '35',
      '70',
      '',
      '',
      '60',
      '50',
      '40',
      '28',
      '69'][
      i],
      CHEM: [
      '60',
      '68',
      '',
      '50',
      '72',
      '',
      '40',
      '65',
      '',
      '',
      '65',
      '55',
      '45',
      '32',
      '70'][
      i],
      BIO: [
      '58',
      '65',
      '',
      '48',
      '70',
      '',
      '38',
      '68',
      '',
      '',
      '62',
      '52',
      '42',
      '30',
      '68'][
      i],
      ENG: [
      '70',
      '75',
      '35',
      '60',
      '80',
      '',
      '50',
      '78',
      '38',
      '',
      '72',
      '65',
      '55',
      '42',
      '79'][
      i],
      HIN: [
      '68',
      '70',
      '30',
      '58',
      '75',
      '',
      '48',
      '72',
      '35',
      '',
      '68',
      '62',
      '52',
      '40',
      '76'][
      i]
    }
  })
);
export function CbseProjectActivityMarkEntry() {
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [year, setYear] = useState('2024-25');
  const [examGroup, setExamGroup] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>(MOCK_STUDENTS);
  const handleMark = (sid: string, subId: string, val: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === sid ?
    {
      ...s,
      marks: {
        ...s.marks,
        [subId]: val
      }
    } :
    s
    )
    );
  };
  const calcRow = (s: StudentRow) => {
    let total = 0;
    let totalMax = 0;
    let allValid = true;
    SUBJECTS.forEach((sub) => {
      const v = s.marks[sub.id] ?? '';
      const n = Number(v);
      if (v === '' || isNaN(n) || n < 0 || n > sub.max) {
        allValid = false;
        return;
      }
      total += n;
      totalMax += sub.max;
    });
    const pct = totalMax > 0 ? total / totalMax * 100 : 0;
    const grade = allValid && total > 0 ? getGrade(pct) : null;
    const pass =
    allValid &&
    SUBJECTS.every((sub) => {
      const v = s.marks[sub.id] ?? '';
      const n = Number(v);
      return v !== '' && !isNaN(n) && n >= sub.pass;
    });
    return {
      total,
      totalMax,
      pct: parseFloat(pct.toFixed(1)),
      grade,
      pass
    };
  };
  const stats = useMemo(() => {
    const computed = students.map((s) => calcRow(s));
    const validPcts = computed.filter((r) => r.pct > 0).map((r) => r.pct);
    const avg = validPcts.length ?
    (validPcts.reduce((a, b) => a + b, 0) / validPcts.length).toFixed(1) :
    '—';
    const highest = validPcts.length ? Math.max(...validPcts).toFixed(1) : '—';
    const lowest = validPcts.length ? Math.min(...validPcts).toFixed(1) : '—';
    return {
      total: students.length,
      avg,
      highest,
      lowest
    };
  }, [students]);
  const totalMaxAll = SUBJECTS.reduce((a, s) => a + s.max, 0);
  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
          <LayoutGrid className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CBSE — Class Wise Mark Entry
          </h1>
          <p className="text-sm text-gray-500">
            Enter marks for all subjects class-wise in a single view
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Search Filters
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Class
            </label>
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Class</option>
              {CLASSES.map((c) =>
              <option key={c}>Class {c}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Section</option>
              {SECTIONS.map((s) =>
              <option key={s}>Section {s}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Academic Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {YEARS.map((y) =>
              <option key={y}>{y}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Exam Group
            </label>
            <select
              value={examGroup}
              onChange={(e) => setExamGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Exam</option>
              {EXAM_GROUPS.map((g) =>
              <option key={g}>{g}</option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              if (cls) setLoaded(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:opacity-90 shadow-sm">

            <Search className="w-4 h-4" /> Load Students
          </button>
        </div>
      </div>

      {!loaded &&
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Select Class to load class-wise mark entry
          </p>
        </div>
      }

      {loaded &&
      <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
          {
            label: 'Total Students',
            val: stats.total,
            color: 'border-l-blue-500',
            text: 'text-gray-900'
          },
          {
            label: 'Class Average %',
            val: `${stats.avg}%`,
            color: 'border-l-indigo-500',
            text: 'text-indigo-600'
          },
          {
            label: 'Highest %',
            val: `${stats.highest}%`,
            color: 'border-l-green-500',
            text: 'text-green-600'
          },
          {
            label: 'Lowest %',
            val: `${stats.lowest}%`,
            color: 'border-l-red-500',
            text: 'text-red-600'
          }].
          map((s) =>
          <div
            key={s.label}
            className={`bg-white rounded-xl border border-gray-200 border-l-4 ${s.color} p-4`}>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {s.label}
                </p>
                <p className={`text-2xl font-black mt-1 ${s.text}`}>{s.val}</p>
              </div>
          )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {students.length} Students — Class {cls} {section}
                </span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  Total Max: {totalMaxAll}M
                </span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase sticky left-0 bg-gray-50 z-10 w-12">
                      Roll
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase sticky left-[48px] bg-gray-50 z-10 min-w-[160px]">
                      Student Name
                    </th>
                    {SUBJECTS.map((sub, i) =>
                  <th
                    key={sub.id}
                    colSpan={2}
                    className={`px-3 py-3 text-center text-xs font-bold uppercase border-l ${i % 2 === 0 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>

                        {sub.short}{' '}
                        <span className="font-normal opacity-70">
                          ({sub.max}M)
                        </span>
                      </th>
                  )}
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-gray-100 border-l border-gray-300">
                      Total
                      <br />
                      <span className="font-normal text-gray-400">
                        /{totalMaxAll}
                      </span>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-gray-100">
                      %
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-gray-100">
                      Grade
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-gray-100">
                      Result
                    </th>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-3 py-2 sticky left-0 bg-white z-10"></th>
                    <th className="px-3 py-2 sticky left-[48px] bg-white z-10"></th>
                    {SUBJECTS.map((sub, i) =>
                  <Fragment key={sub.id}>
                        <th
                      className={`px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase border-l ${i % 2 === 0 ? 'bg-blue-50/50 border-blue-100' : 'bg-indigo-50/50 border-indigo-100'}`}>

                          Marks
                        </th>
                        <th
                      className={`px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase ${i % 2 === 0 ? 'bg-blue-50/50' : 'bg-indigo-50/50'}`}>

                          Grade
                        </th>
                      </Fragment>
                  )}
                    <th className="px-3 py-2 bg-gray-100/50 border-l border-gray-200"></th>
                    <th className="px-3 py-2 bg-gray-100/50"></th>
                    <th className="px-3 py-2 bg-gray-100/50"></th>
                    <th className="px-3 py-2 bg-gray-100/50"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => {
                  const { total, pct, grade, pass } = calcRow(s);
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50/50 transition-colors">

                        <td className="px-3 py-3 sticky left-0 bg-white z-10">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {s.rollNo}
                          </span>
                        </td>
                        <td className="px-3 py-3 sticky left-[48px] bg-white z-10 font-semibold text-gray-900 min-w-[160px]">
                          {s.name}
                        </td>
                        {SUBJECTS.map((sub, i) => {
                        const v = s.marks[sub.id] ?? '';
                        const n = Number(v);
                        const valid =
                        v !== '' && !isNaN(n) && n >= 0 && n <= sub.max;
                        const subGrade = valid ?
                        getGrade(n / sub.max * 100) :
                        null;
                        const bgCls =
                        i % 2 === 0 ?
                        'bg-blue-50/30 border-blue-100' :
                        'bg-indigo-50/30 border-indigo-100';
                        return (
                          <Fragment key={sub.id}>
                              <td
                              className={`px-2 py-3 text-center border-l ${bgCls}`}>

                                <input
                                type="text"
                                value={v}
                                onChange={(e) =>
                                handleMark(s.id, sub.id, e.target.value)
                                }
                                className={`w-12 py-1.5 border-2 rounded-lg text-center text-xs font-bold outline-none transition-all ${v === '' ? 'border-gray-200 focus:border-blue-400' : valid ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}
                                placeholder="—" />

                              </td>
                              <td
                              className={`px-2 py-3 text-center ${bgCls.split(' border-l')[0]}`}>

                                {subGrade ?
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${subGrade.cls}`}>

                                    {subGrade.grade}
                                  </span> :

                              <span className="text-gray-300 text-xs">
                                    —
                                  </span>
                              }
                              </td>
                            </Fragment>);

                      })}
                        <td className="px-3 py-3 text-center bg-gray-100/50 border-l border-gray-200 font-black text-gray-900">
                          {total > 0 ? total : '—'}
                        </td>
                        <td className="px-3 py-3 text-center bg-gray-100/50 font-semibold text-gray-700">
                          {pct > 0 ? `${pct}%` : '—'}
                        </td>
                        <td className="px-3 py-3 text-center bg-gray-100/50">
                          {grade ?
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${grade.cls}`}>

                              {grade.grade}
                            </span> :

                        <span className="text-gray-300 text-xs">—</span>
                        }
                        </td>
                        <td className="px-3 py-3 text-center bg-gray-100/50">
                          {pass === true &&
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Pass
                            </span>
                        }
                          {pass === false &&
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              Fail
                            </span>
                        }
                          {pass === null &&
                        <span className="text-gray-300 text-xs">—</span>
                        }
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  Avg: <strong className="text-indigo-600">{stats.avg}%</strong>
                </span>
                <span>
                  Highest:{' '}
                  <strong className="text-green-600">{stats.highest}%</strong>
                </span>
                <span>
                  Lowest:{' '}
                  <strong className="text-red-600">{stats.lowest}%</strong>
                </span>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md shadow-blue-200">
                <Save className="w-5 h-5" /> Save All Marks
              </button>
            </div>
          </div>
        </>
      }
    </div>);

}