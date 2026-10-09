import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Save,
  Search,
  CheckCircle2,
  AlertCircle,
  UserX,
  Filter,
  Users,
  BookText,
  Calendar,
  GraduationCap,
  Clock,
  AlertTriangle,
  Download,
  Printer } from
'lucide-react';
// ── Types ──────────────────────────────────────────────────────────────────
interface Student {
  id: string;
  rollNo: string;
  admissionNo: string;
  name: string;
  marks: string;
  isAbsent: boolean;
}
// ── Grade Scale ─────────────────────────────────────────────────────────────
const getGrade = (marks: number, max: number) => {
  const pct = marks / max * 100;
  if (pct >= 91)
  return {
    grade: 'A1',
    gp: 10,
    cls: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  };
  if (pct >= 81)
  return {
    grade: 'A2',
    gp: 9,
    cls: 'bg-green-100 text-green-700 border-green-300'
  };
  if (pct >= 71)
  return {
    grade: 'B1',
    gp: 8,
    cls: 'bg-teal-100 text-teal-700 border-teal-300'
  };
  if (pct >= 61)
  return {
    grade: 'B2',
    gp: 7,
    cls: 'bg-cyan-100 text-cyan-700 border-cyan-300'
  };
  if (pct >= 51)
  return {
    grade: 'C1',
    gp: 6,
    cls: 'bg-blue-100 text-blue-700 border-blue-300'
  };
  if (pct >= 41)
  return {
    grade: 'C2',
    gp: 5,
    cls: 'bg-indigo-100 text-indigo-700 border-indigo-300'
  };
  if (pct >= 33)
  return {
    grade: 'D',
    gp: 4,
    cls: 'bg-amber-100 text-amber-700 border-amber-300'
  };
  return {
    grade: 'E',
    gp: 0,
    cls: 'bg-red-100 text-red-700 border-red-300'
  };
};
// ── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STUDENTS: Student[] = [
{
  id: 'S01',
  rollNo: '01',
  admissionNo: 'ADM2024001',
  name: 'Aditya Sharma',
  marks: '72',
  isAbsent: false
},
{
  id: 'S02',
  rollNo: '02',
  admissionNo: 'ADM2024002',
  name: 'Priya Patel',
  marks: '65',
  isAbsent: false
},
{
  id: 'S03',
  rollNo: '03',
  admissionNo: 'ADM2024003',
  name: 'Rahul Verma',
  marks: '',
  isAbsent: true
},
{
  id: 'S04',
  rollNo: '04',
  admissionNo: 'ADM2024004',
  name: 'Sunita Gupta',
  marks: '55',
  isAbsent: false
},
{
  id: 'S05',
  rollNo: '05',
  admissionNo: 'ADM2024005',
  name: 'Ishaan Khattar',
  marks: '78',
  isAbsent: false
},
{
  id: 'S06',
  rollNo: '06',
  admissionNo: 'ADM2024006',
  name: 'Meera Nair',
  marks: '',
  isAbsent: false
},
{
  id: 'S07',
  rollNo: '07',
  admissionNo: 'ADM2024007',
  name: 'Sanjay Kumar',
  marks: '45',
  isAbsent: false
},
{
  id: 'S08',
  rollNo: '08',
  admissionNo: 'ADM2024008',
  name: 'Kavita Joshi',
  marks: '88',
  isAbsent: false
},
{
  id: 'S09',
  rollNo: '09',
  admissionNo: 'ADM2024009',
  name: 'Amit Tiwari',
  marks: '32',
  isAbsent: false
},
{
  id: 'S10',
  rollNo: '10',
  admissionNo: 'ADM2024010',
  name: 'Neha Singh',
  marks: '',
  isAbsent: false
},
{
  id: 'S11',
  rollNo: '11',
  admissionNo: 'ADM2024011',
  name: 'Vikram Reddy',
  marks: '70',
  isAbsent: false
},
{
  id: 'S12',
  rollNo: '12',
  admissionNo: 'ADM2024012',
  name: 'Anjali Menon',
  marks: '',
  isAbsent: true
},
{
  id: 'S13',
  rollNo: '13',
  admissionNo: 'ADM2024013',
  name: 'Rajesh Pillai',
  marks: '62',
  isAbsent: false
},
{
  id: 'S14',
  rollNo: '14',
  admissionNo: 'ADM2024014',
  name: 'Deepika Agarwal',
  marks: '38',
  isAbsent: false
},
{
  id: 'S15',
  rollNo: '15',
  admissionNo: 'ADM2024015',
  name: 'Arjun Malhotra',
  marks: '91',
  isAbsent: false
}];

const SUBJECTS = [
{
  id: 'MATH',
  name: 'Mathematics',
  code: '041',
  max: 80,
  pass: 27
},
{
  id: 'PHY',
  name: 'Physics',
  code: '042',
  max: 70,
  pass: 23
},
{
  id: 'CHEM',
  name: 'Chemistry',
  code: '043',
  max: 70,
  pass: 23
},
{
  id: 'BIO',
  name: 'Biology',
  code: '044',
  max: 70,
  pass: 23
},
{
  id: 'ENG',
  name: 'English Core',
  code: '301',
  max: 80,
  pass: 27
},
{
  id: 'HIN',
  name: 'Hindi Core',
  code: '302',
  max: 80,
  pass: 27
},
{
  id: 'CS',
  name: 'Computer Science',
  code: '083',
  max: 70,
  pass: 23
}];

const CLASSES = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const EXAMS = [
'Unit Test 1',
'Mid Term',
'Unit Test 2',
'Pre-Board',
'Annual Exam'];

const EXAM_TYPES = ['Unit Test', 'Term Exam', 'Board Prep', 'Final Exam'];
const SECTIONS = ['A', 'B', 'C', 'D'];
export function CbseTheoryMarkEntry() {
  const [exam, setExam] = useState('');
  const [examType, setExamType] = useState('');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [searched, setSearched] = useState(false);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const subjectInfo = SUBJECTS.find((s) => s.id === subject);
  const MAX = subjectInfo?.max ?? 80;
  const PASS = subjectInfo?.pass ?? 27;
  const handleSearch = () => {
    if (exam && cls && subject) setSearched(true);
  };
  const handleMarks = (id: string, val: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      marks: val
    } :
    s
    )
    );
  };
  const handleAbsent = (id: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      isAbsent: !s.isAbsent,
      marks: !s.isAbsent ? '' : s.marks
    } :
    s
    )
    );
  };
  const stats = useMemo(() => {
    const total = students.length;
    const absent = students.filter((s) => s.isAbsent).length;
    const entered = students.filter(
      (s) => !s.isAbsent && s.marks !== '' && !isNaN(Number(s.marks))
    ).length;
    const pending = students.filter((s) => !s.isAbsent && s.marks === '').length;
    const errors = students.filter(
      (s) =>
      !s.isAbsent &&
      s.marks !== '' && (
      isNaN(Number(s.marks)) ||
      Number(s.marks) < 0 ||
      Number(s.marks) > MAX)
    ).length;
    const validMarks = students.
    filter(
      (s) =>
      !s.isAbsent &&
      s.marks !== '' &&
      !isNaN(Number(s.marks)) &&
      Number(s.marks) >= 0 &&
      Number(s.marks) <= MAX
    ).
    map((s) => Number(s.marks));
    const avg = validMarks.length ?
    (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(1) :
    '—';
    return {
      total,
      absent,
      entered,
      pending,
      errors,
      avg
    };
  }, [students, MAX]);
  const getStatus = (s: Student) => {
    if (s.isAbsent) return 'absent';
    if (s.marks === '') return 'pending';
    const n = Number(s.marks);
    if (isNaN(n) || n < 0 || n > MAX) return 'invalid';
    return 'valid';
  };
  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CBSE — Subject Wise Mark Entry
          </h1>
          <p className="text-sm text-gray-500">
            Enter theory marks subject-wise for CBSE students
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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
              Exam
            </label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Exam</option>
              {EXAMS.map((e) =>
              <option key={e}>{e}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Type</option>
              {EXAM_TYPES.map((e) =>
              <option key={e}>{e}</option>
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
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Subject</option>
              {SUBJECTS.map((s) =>
              <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              )}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-sm">

            <Search className="w-4 h-4" /> Search Students
          </button>
        </div>
      </div>

      {!searched &&
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Select Exam, Class & Subject to load students
          </p>
        </div>
      }

      {searched &&
      <>
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Class {cls}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-200" />
            <div className="flex items-center gap-2">
              <BookText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                {subjectInfo?.name} ({subjectInfo?.code})
              </span>
            </div>
            <div className="w-px h-4 bg-blue-200" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                {exam}
              </span>
            </div>
            <div className="ml-auto flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                Max: {MAX}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold border border-orange-200">
                Pass: {PASS}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
          {
            label: 'Total',
            val: stats.total,
            color: 'border-l-blue-500',
            text: 'text-gray-900'
          },
          {
            label: 'Entered',
            val: stats.entered,
            color: 'border-l-green-500',
            text: 'text-green-600'
          },
          {
            label: 'Pending',
            val: stats.pending,
            color: 'border-l-yellow-500',
            text: 'text-yellow-600'
          },
          {
            label: 'Errors',
            val: stats.errors,
            color: 'border-l-red-500',
            text: 'text-red-600'
          },
          {
            label: 'Absent',
            val: stats.absent,
            color: 'border-l-gray-400',
            text: 'text-gray-500'
          },
          {
            label: 'Avg Marks',
            val: stats.avg,
            color: 'border-l-purple-500',
            text: 'text-purple-600'
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

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {students.length} Students
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-12">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-20">
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Admission No
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase w-20">
                      Absent
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase w-36">
                      Marks{' '}
                      <span className="text-gray-400 font-normal">/{MAX}</span>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase w-24">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase w-28">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((s, idx) => {
                  const status = getStatus(s);
                  const n = Number(s.marks);
                  const gradeInfo =
                  !s.isAbsent &&
                  s.marks !== '' &&
                  !isNaN(n) &&
                  n >= 0 &&
                  n <= MAX ?
                  getGrade(n, MAX) :
                  null;
                  const isBelowPass = gradeInfo && n < PASS;
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors ${status === 'invalid' ? 'bg-red-50/60' : s.isAbsent ? 'bg-gray-50' : isBelowPass ? 'bg-orange-50/40' : 'hover:bg-gray-50/50'}`}>

                        <td className="px-4 py-3 text-sm text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                            {s.rollNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {s.name}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-500">
                          {s.admissionNo}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                          onClick={() => handleAbsent(s.id)}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${s.isAbsent ? 'bg-gray-700 border-gray-700' : 'border-gray-300 hover:border-gray-400 bg-white'}`}>

                            {s.isAbsent &&
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          }
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                          type="text"
                          value={s.marks}
                          onChange={(e) => handleMarks(s.id, e.target.value)}
                          disabled={s.isAbsent}
                          placeholder={s.isAbsent ? 'AB' : '—'}
                          className={`w-20 py-2 border-2 rounded-xl text-center text-sm font-bold outline-none transition-all ${s.isAbsent ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : status === 'invalid' ? 'border-red-300 bg-red-50 text-red-700' : status === 'valid' ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}`} />

                        </td>
                        <td className="px-4 py-3 text-center">
                          {gradeInfo ?
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${gradeInfo.cls}`}>

                              {gradeInfo.grade}
                            </span> :
                        s.isAbsent ?
                        <span className="text-xs text-gray-400 font-medium">
                              AB
                            </span> :

                        <span className="text-xs text-gray-300">—</span>
                        }
                        </td>
                        <td className="px-4 py-3 text-center">
                          {status === 'valid' && !isBelowPass &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Valid
                            </span>
                        }
                          {status === 'valid' && isBelowPass &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              Below Pass
                            </span>
                        }
                          {status === 'invalid' &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              <AlertCircle className="w-3 h-3" />
                              Error
                            </span>
                        }
                          {status === 'pending' &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                        }
                          {status === 'absent' &&
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                              <UserX className="w-3 h-3" />
                              Absent
                            </span>
                        }
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-blue-200">
                <Save className="w-5 h-5" /> Save Marks
              </button>
            </div>
          </div>
        </>
      }
    </div>);

}