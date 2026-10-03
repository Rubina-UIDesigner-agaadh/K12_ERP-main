import React, { useState, Fragment } from 'react';
import {
  BookOpen,
  Save,
  Search,
  Filter,
  Users,
  AlertTriangle } from
'lucide-react';
interface ExamDef {
  id: string;
  name: string;
  max: number;
}
interface StudentRow {
  id: string;
  rollNo: string;
  admissionNo: string;
  name: string;
  marks: Record<string, string>;
}
const getGrade = (marks: number, max: number) => {
  const pct = marks / max * 100;
  if (pct >= 90)
  return {
    grade: 'A*',
    cls: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  };
  if (pct >= 80)
  return {
    grade: 'A',
    cls: 'bg-green-100 text-green-700 border-green-300'
  };
  if (pct >= 70)
  return {
    grade: 'B',
    cls: 'bg-teal-100 text-teal-700 border-teal-300'
  };
  if (pct >= 60)
  return {
    grade: 'C',
    cls: 'bg-cyan-100 text-cyan-700 border-cyan-300'
  };
  if (pct >= 50)
  return {
    grade: 'D',
    cls: 'bg-blue-100 text-blue-700 border-blue-300'
  };
  if (pct >= 40)
  return {
    grade: 'E',
    cls: 'bg-amber-100 text-amber-700 border-amber-300'
  };
  return {
    grade: 'F',
    cls: 'bg-red-100 text-red-700 border-red-300'
  };
};
const TERM_EXAMS: Record<string, ExamDef[]> = {
  'Term 1': [
  {
    id: 'ut1',
    name: 'Unit Test 1',
    max: 80
  },
  {
    id: 'hy',
    name: 'Mid Year',
    max: 80
  },
  {
    id: 'prac',
    name: 'Practical',
    max: 20
  }],

  'Term 2': [
  {
    id: 'ut2',
    name: 'Unit Test 2',
    max: 80
  },
  {
    id: 'pre',
    name: 'Pre-Board',
    max: 80
  },
  {
    id: 'pt2',
    name: 'Practical 2',
    max: 20
  }],

  Annual: [
  {
    id: 'ann',
    name: 'Annual Exam',
    max: 80
  },
  {
    id: 'prac',
    name: 'Practical',
    max: 20
  }]

};
const SUBJECTS = [
'Mathematics',
'Physics',
'Chemistry',
'Biology',
'English Language',
'English Literature',
'Hindi'];

const CLASSES = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const TERMS = ['Term 1', 'Term 2', 'Annual'];
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
    marks: {}
  })
);
export function CiscePracticalMarkEntry() {
  const [subject, setSubject] = useState('');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [term, setTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>(MOCK_STUDENTS);
  const exams: ExamDef[] = term ? TERM_EXAMS[term] ?? [] : [];
  const totalMax = exams.reduce((a, e) => a + e.max, 0);
  const handleSearch = () => {
    if (subject && cls && term) setSearched(true);
  };
  const handleMark = (sid: string, eid: string, val: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === sid ?
    {
      ...s,
      marks: {
        ...s.marks,
        [eid]: val
      }
    } :
    s
    )
    );
  };
  const getRowTotals = (s: StudentRow) => {
    let total = 0;
    let valid = true;
    exams.forEach((e) => {
      const v = s.marks[e.id];
      if (!v || v === '') {
        valid = false;
        return;
      }
      const n = Number(v);
      if (isNaN(n) || n < 0 || n > e.max) {
        valid = false;
        return;
      }
      total += n;
    });
    const pct = totalMax > 0 ? total / totalMax * 100 : 0;
    const grade = valid && total > 0 ? getGrade(total, totalMax) : null;
    return {
      total,
      pct: pct.toFixed(1),
      grade
    };
  };
  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg shadow-purple-200">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CISCE — Term Wise Mark Entry
          </h1>
          <p className="text-sm text-gray-500">
            View all exams of a term and enter marks for each
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-gray-700">
            Search Filters
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">Select Subject</option>
              {SUBJECTS.map((s) =>
              <option key={s}>{s}</option>
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">Select Section</option>
              {SECTIONS.map((s) =>
              <option key={s}>Section {s}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">Select Term</option>
              {TERMS.map((t) =>
              <option key={t}>{t}</option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-medium text-sm hover:opacity-90 shadow-sm">

            <Search className="w-4 h-4" /> Search Students
          </button>
        </div>
      </div>

      {!searched &&
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Select Subject, Class & Term to load students
          </p>
        </div>
      }

      {searched && exams.length > 0 &&
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">
                {students.length} Students
              </span>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                {subject} • Class {cls} • {term}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Total Max: <strong>{totalMax}M</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase sticky left-0 bg-gray-50 z-10 min-w-[60px]">
                    Roll
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase sticky left-[60px] bg-gray-50 z-10 min-w-[180px]">
                    Student Name
                  </th>
                  {exams.map((e) =>
                <th
                  key={e.id}
                  colSpan={2}
                  className="px-4 py-3 text-center text-xs font-bold text-purple-700 uppercase bg-purple-50 border-l border-purple-200">

                      {e.name}{' '}
                      <span className="font-normal text-purple-500">
                        ({e.max}M)
                      </span>
                    </th>
                )}
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase bg-violet-50 border-l border-violet-200">
                    Total
                    <br />
                    <span className="font-normal text-gray-400">
                      /{totalMax}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase bg-violet-50">
                    %
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase bg-violet-50">
                    Grade
                  </th>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-4 py-2 sticky left-0 bg-white z-10"></th>
                  <th className="px-4 py-2 sticky left-[60px] bg-white z-10"></th>
                  {exams.map((e) =>
                <Fragment key={e.id}>
                      <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase bg-purple-50/50 border-l border-purple-100">
                        Marks
                      </th>
                      <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase bg-purple-50/50">
                        Grade
                      </th>
                    </Fragment>
                )}
                  <th className="px-4 py-2 bg-violet-50/50 border-l border-violet-100"></th>
                  <th className="px-4 py-2 bg-violet-50/50"></th>
                  <th className="px-4 py-2 bg-violet-50/50"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => {
                const { total, pct, grade } = getRowTotals(s);
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50/50 transition-colors">

                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                          {s.rollNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 sticky left-[60px] bg-white z-10 font-semibold text-gray-900 min-w-[180px]">
                        {s.name}
                      </td>
                      {exams.map((e) => {
                      const v = s.marks[e.id] ?? '';
                      const n = Number(v);
                      const valid =
                      v !== '' && !isNaN(n) && n >= 0 && n <= e.max;
                      const examGrade = valid ? getGrade(n, e.max) : null;
                      return (
                        <Fragment key={e.id}>
                            <td className="px-3 py-3 text-center bg-purple-50/30 border-l border-purple-100">
                              <input
                              type="text"
                              value={v}
                              onChange={(ev) =>
                              handleMark(s.id, e.id, ev.target.value)
                              }
                              className={`w-14 py-1.5 border-2 rounded-lg text-center text-sm font-bold outline-none transition-all ${v === '' ? 'border-gray-200 focus:border-purple-400' : valid ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}
                              placeholder="—" />

                            </td>
                            <td className="px-3 py-3 text-center bg-purple-50/30">
                              {examGrade ?
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${examGrade.cls}`}>

                                  {examGrade.grade}
                                </span> :

                            <span className="text-gray-300 text-xs">—</span>
                            }
                            </td>
                          </Fragment>);

                    })}
                      <td className="px-4 py-3 text-center bg-violet-50/30 border-l border-violet-100 font-black text-gray-900">
                        {total > 0 ? total : '—'}
                      </td>
                      <td className="px-4 py-3 text-center bg-violet-50/30 font-semibold text-gray-700">
                        {total > 0 ? `${pct}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-center bg-violet-50/30">
                        {grade ?
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${grade.cls}`}>

                            {grade.grade}
                          </span> :

                      <span className="text-gray-300 text-xs">—</span>
                      }
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>
                Grade auto-calculated from total marks across all exams in{' '}
                {term}
              </span>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md shadow-purple-200">
              <Save className="w-5 h-5" /> Save Marks
            </button>
          </div>
        </div>
      }
    </div>);

}