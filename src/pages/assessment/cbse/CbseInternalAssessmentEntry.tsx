import React, { useMemo, useState } from 'react';
import {
  ClipboardList,
  Save,
  Search,
  Filter,
  Users,
  Lock,
  CheckCircle2,
  XCircle,
  Download } from
'lucide-react';
interface StudentRow {
  id: string;
  rollNo: string;
  name: string;
  admissionNo: string;
  theory: string;
  practical: string;
  internal: string;
  remarks: string;
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
const THEORY_MAX = 80;
const PRACTICAL_MAX = 20;
const INTERNAL_MAX = 20;
const TOTAL_MAX = 120;
const MOCK: StudentRow[] = [
{
  id: 'S01',
  rollNo: '01',
  name: 'Aditya Sharma',
  admissionNo: 'ADM001',
  theory: '65',
  practical: '16',
  internal: '18',
  remarks: ''
},
{
  id: 'S02',
  rollNo: '02',
  name: 'Priya Patel',
  admissionNo: 'ADM002',
  theory: '72',
  practical: '18',
  internal: '19',
  remarks: ''
},
{
  id: 'S03',
  rollNo: '03',
  name: 'Rahul Verma',
  admissionNo: 'ADM003',
  theory: '28',
  practical: '12',
  internal: '14',
  remarks: 'Below passing'
},
{
  id: 'S04',
  rollNo: '04',
  name: 'Sunita Gupta',
  admissionNo: 'ADM004',
  theory: '55',
  practical: '15',
  internal: '16',
  remarks: ''
},
{
  id: 'S05',
  rollNo: '05',
  name: 'Ishaan Khattar',
  admissionNo: 'ADM005',
  theory: '78',
  practical: '19',
  internal: '20',
  remarks: ''
},
{
  id: 'S06',
  rollNo: '06',
  name: 'Meera Nair',
  admissionNo: 'ADM006',
  theory: '',
  practical: '',
  internal: '',
  remarks: ''
},
{
  id: 'S07',
  rollNo: '07',
  name: 'Sanjay Kumar',
  admissionNo: 'ADM007',
  theory: '45',
  practical: '13',
  internal: '15',
  remarks: ''
},
{
  id: 'S08',
  rollNo: '08',
  name: 'Kavita Joshi',
  admissionNo: 'ADM008',
  theory: '88',
  practical: '20',
  internal: '20',
  remarks: ''
},
{
  id: 'S09',
  rollNo: '09',
  name: 'Amit Tiwari',
  admissionNo: 'ADM009',
  theory: '32',
  practical: '10',
  internal: '12',
  remarks: 'Borderline'
},
{
  id: 'S10',
  rollNo: '10',
  name: 'Neha Singh',
  admissionNo: 'ADM010',
  theory: '',
  practical: '',
  internal: '',
  remarks: ''
},
{
  id: 'S11',
  rollNo: '11',
  name: 'Vikram Reddy',
  admissionNo: 'ADM011',
  theory: '70',
  practical: '17',
  internal: '18',
  remarks: ''
},
{
  id: 'S12',
  rollNo: '12',
  name: 'Anjali Menon',
  admissionNo: 'ADM012',
  theory: '60',
  practical: '16',
  internal: '17',
  remarks: ''
},
{
  id: 'S13',
  rollNo: '13',
  name: 'Rajesh Pillai',
  admissionNo: 'ADM013',
  theory: '50',
  practical: '14',
  internal: '15',
  remarks: ''
},
{
  id: 'S14',
  rollNo: '14',
  name: 'Deepika Agarwal',
  admissionNo: 'ADM014',
  theory: '38',
  practical: '11',
  internal: '13',
  remarks: ''
},
{
  id: 'S15',
  rollNo: '15',
  name: 'Arjun Malhotra',
  admissionNo: 'ADM015',
  theory: '91',
  practical: '20',
  internal: '20',
  remarks: ''
}];

const CLASSES = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const YEARS = ['2024-25', '2023-24', '2022-23'];
const EXAM_GROUPS = ['Term 1', 'Term 2', 'Annual', 'Final'];
const SUBJECT_GROUPS = [
'Science Group',
'Commerce Group',
'Arts Group',
'All Subjects'];

export function CbseInternalAssessmentEntry() {
  const [year, setYear] = useState('2024-25');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [examGroup, setExamGroup] = useState('');
  const [subjectGroup, setSubjectGroup] = useState('');
  const [searched, setSearched] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>(MOCK);
  const handleSearch = () => {
    if (cls) setSearched(true);
  };
  const handleField = (id: string, field: keyof StudentRow, val: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      [field]: val
    } :
    s
    )
    );
  };
  const calcRow = (s: StudentRow) => {
    const t = Number(s.theory);
    const p = Number(s.practical);
    const ia = Number(s.internal);
    const valid =
    s.theory !== '' &&
    s.practical !== '' &&
    s.internal !== '' &&
    !isNaN(t) &&
    !isNaN(p) &&
    !isNaN(ia);
    if (!valid)
    return {
      total: 0,
      pct: 0,
      grade: null,
      pass: null
    };
    const total = t + p + ia;
    const pct = total / TOTAL_MAX * 100;
    const grade = getGrade(pct);
    const pass =
    t >= THEORY_MAX * 0.33 &&
    p >= PRACTICAL_MAX * 0.33 &&
    total >= TOTAL_MAX * 0.33;
    return {
      total,
      pct: parseFloat(pct.toFixed(1)),
      grade,
      pass
    };
  };
  const stats = useMemo(() => {
    const total = students.length;
    const computed = students.map((s) => calcRow(s));
    const passed = computed.filter((r) => r.pass === true).length;
    const failed = computed.filter((r) => r.pass === false).length;
    const validPcts = computed.filter((r) => r.pct > 0).map((r) => r.pct);
    const avg = validPcts.length ?
    (validPcts.reduce((a, b) => a + b, 0) / validPcts.length).toFixed(1) :
    '—';
    return {
      total,
      passed,
      failed,
      avg
    };
  }, [students]);
  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CBSE — Consolidate Result Mark Entry
          </h1>
          <p className="text-sm text-gray-500">
            Enter Theory, Practical & Internal Assessment marks for consolidated
            result
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Search Filters
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
              Exam Group
            </label>
            <select
              value={examGroup}
              onChange={(e) => setExamGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Group</option>
              {EXAM_GROUPS.map((g) =>
              <option key={g}>{g}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Subject Group
            </label>
            <select
              value={subjectGroup}
              onChange={(e) => setSubjectGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Group</option>
              {SUBJECT_GROUPS.map((g) =>
              <option key={g}>{g}</option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:opacity-90 shadow-sm">

            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      {!searched &&
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Select Class to load consolidated mark entry
          </p>
        </div>
      }

      {searched &&
      <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-blue-500 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Total Students
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-green-500 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Passed
              </p>
              <p className="text-3xl font-black text-green-600 mt-1">
                {stats.passed}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-red-500 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Failed
              </p>
              <p className="text-3xl font-black text-red-600 mt-1">
                {stats.failed}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-purple-500 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Average %
              </p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                {stats.avg}%
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  Consolidated Mark Entry — Class {cls} {section} • {year}
                </span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase w-12">
                      Roll
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase min-w-[160px]">
                      Student Name
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-blue-600 uppercase bg-blue-50 border-l border-blue-200">
                      Theory
                      <br />
                      <span className="font-normal text-blue-400">
                        /{THEORY_MAX}
                      </span>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-teal-600 uppercase bg-teal-50 border-l border-teal-200">
                      Practical
                      <br />
                      <span className="font-normal text-teal-400">
                        /{PRACTICAL_MAX}
                      </span>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-purple-600 uppercase bg-purple-50 border-l border-purple-200">
                      Internal
                      <br />
                      <span className="font-normal text-purple-400">
                        /{INTERNAL_MAX}
                      </span>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-indigo-50 border-l border-indigo-200">
                      Total
                      <br />
                      <span className="font-normal text-gray-400">
                        /{TOTAL_MAX}
                      </span>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-indigo-50">
                      %
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-indigo-50">
                      Grade
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase bg-indigo-50">
                      Result
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase min-w-[120px]">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s) => {
                  const { total, pct, grade, pass } = calcRow(s);
                  const hasData =
                  s.theory !== '' || s.practical !== '' || s.internal !== '';
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors ${pass === false ? 'bg-red-50/40' : pass === true ? 'hover:bg-gray-50/50' : 'hover:bg-gray-50/50'}`}>

                        <td className="px-3 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {s.rollNo}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-semibold text-gray-900">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {s.admissionNo}
                          </p>
                        </td>
                        {(['theory', 'practical', 'internal'] as const).map(
                        (field, fi) => {
                          const maxes = [
                          THEORY_MAX,
                          PRACTICAL_MAX,
                          INTERNAL_MAX];

                          const colors = [
                          'border-blue-200 bg-blue-50/30',
                          'border-teal-200 bg-teal-50/30',
                          'border-purple-200 bg-purple-50/30'];

                          const focusColors = [
                          'focus:border-blue-400',
                          'focus:border-teal-400',
                          'focus:border-purple-400'];

                          const v = s[field];
                          const n = Number(v);
                          const valid =
                          v !== '' && !isNaN(n) && n >= 0 && n <= maxes[fi];
                          return (
                            <td
                              key={field}
                              className={`px-3 py-3 text-center border-l ${colors[fi]}`}>

                                <input
                                type="text"
                                value={v}
                                onChange={(e) =>
                                handleField(s.id, field, e.target.value)
                                }
                                className={`w-14 py-1.5 border-2 rounded-lg text-center text-sm font-bold outline-none transition-all ${v === '' ? `border-gray-200 ${focusColors[fi]}` : valid ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}
                                placeholder="—" />

                              </td>);

                        }
                      )}
                        <td className="px-3 py-3 text-center bg-indigo-50/30 border-l border-indigo-200 font-black text-gray-900">
                          {hasData && total > 0 ? total : '—'}
                        </td>
                        <td className="px-3 py-3 text-center bg-indigo-50/30 font-semibold text-gray-700">
                          {hasData && pct > 0 ? `${pct}%` : '—'}
                        </td>
                        <td className="px-3 py-3 text-center bg-indigo-50/30">
                          {grade ?
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${grade.cls}`}>

                              {grade.grade}
                            </span> :

                        <span className="text-gray-300 text-xs">—</span>
                        }
                        </td>
                        <td className="px-3 py-3 text-center bg-indigo-50/30">
                          {pass === true &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Pass
                            </span>
                        }
                          {pass === false &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              <XCircle className="w-3 h-3" />
                              Fail
                            </span>
                        }
                          {pass === null &&
                        <span className="text-gray-300 text-xs">—</span>
                        }
                        </td>
                        <td className="px-3 py-3">
                          <input
                          type="text"
                          value={s.remarks}
                          onChange={(e) =>
                          handleField(s.id, 'remarks', e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="Remarks..." />

                        </td>
                      </tr>);

                })}
                </tbody>
                {/* Summary Row */}
                <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                  <tr>
                    <td
                    colSpan={2}
                    className="px-3 py-3 font-bold text-gray-700 text-sm">

                      Class Summary
                    </td>
                    <td
                    colSpan={3}
                    className="px-3 py-3 text-center text-xs text-gray-500">

                      —
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-gray-900">
                      {(() => {
                      const vals = students.
                      map((s) => calcRow(s).total).
                      filter((v) => v > 0);
                      return vals.length ?
                      Math.round(
                        vals.reduce((a, b) => a + b, 0) / vals.length
                      ) :
                      '—';
                    })()}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-gray-900">
                      {stats.avg}%
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-500">
                      —
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-semibold text-green-700">
                        {stats.passed} Pass
                      </span>
                      <span className="text-xs text-gray-400 mx-1">/</span>
                      <span className="text-xs font-semibold text-red-700">
                        {stats.failed} Fail
                      </span>
                    </td>
                    <td className="px-3 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total: {students.length} students • {stats.passed} passed •{' '}
                {stats.failed} failed
              </p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50">
                  <Lock className="w-4 h-4" /> Lock Results
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md shadow-blue-200">
                  <Save className="w-5 h-5" /> Save Marks
                </button>
              </div>
            </div>
          </div>
        </>
      }
    </div>);

}