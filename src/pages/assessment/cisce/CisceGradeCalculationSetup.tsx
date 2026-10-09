import React, { useMemo, useState } from 'react';
import {
  RefreshCw,
  Save,
  Search,
  Filter,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock,
  AlertCircle } from
'lucide-react';
interface ReExamStudent {
  id: string;
  rollNo: string;
  name: string;
  grNo: string;
  suId: string;
  classSec: string;
  subject: string;
  subjectId: string;
  originalMarks: number;
  maxMarks: number;
  passMarks: number;
  reExamMarks: string;
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
const MOCK_STUDENTS: ReExamStudent[] = [
{
  id: 'R01',
  rollNo: '03',
  name: 'Rahul Verma',
  grNo: 'GR2024003',
  suId: 'SU10003',
  classSec: '10-A',
  subject: 'Mathematics',
  subjectId: 'MATH',
  originalMarks: 28,
  maxMarks: 80,
  passMarks: 32,
  reExamMarks: ''
},
{
  id: 'R02',
  rollNo: '09',
  name: 'Amit Tiwari',
  grNo: 'GR2024009',
  suId: 'SU10009',
  classSec: '10-A',
  subject: 'Physics',
  subjectId: 'PHY',
  originalMarks: 24,
  maxMarks: 70,
  passMarks: 28,
  reExamMarks: ''
},
{
  id: 'R03',
  rollNo: '14',
  name: 'Deepika Agarwal',
  grNo: 'GR2024014',
  suId: 'SU10014',
  classSec: '10-B',
  subject: 'Chemistry',
  subjectId: 'CHEM',
  originalMarks: 22,
  maxMarks: 70,
  passMarks: 28,
  reExamMarks: ''
},
{
  id: 'R04',
  rollNo: '06',
  name: 'Meera Nair',
  grNo: 'GR2024006',
  suId: 'SU10006',
  classSec: '10-A',
  subject: 'English Language',
  subjectId: 'ENGL',
  originalMarks: 29,
  maxMarks: 80,
  passMarks: 32,
  reExamMarks: ''
},
{
  id: 'R05',
  rollNo: '11',
  name: 'Vikram Reddy',
  grNo: 'GR2024011',
  suId: 'SU10011',
  classSec: '10-B',
  subject: 'Hindi',
  subjectId: 'HIN',
  originalMarks: 27,
  maxMarks: 80,
  passMarks: 32,
  reExamMarks: ''
},
{
  id: 'R06',
  rollNo: '02',
  name: 'Priya Patel',
  grNo: 'GR2024002',
  suId: 'SU10002',
  classSec: '9-A',
  subject: 'Biology',
  subjectId: 'BIO',
  originalMarks: 25,
  maxMarks: 70,
  passMarks: 28,
  reExamMarks: ''
},
{
  id: 'R07',
  rollNo: '07',
  name: 'Sanjay Kumar',
  grNo: 'GR2024007',
  suId: 'SU10007',
  classSec: '9-B',
  subject: 'Mathematics',
  subjectId: 'MATH',
  originalMarks: 20,
  maxMarks: 80,
  passMarks: 32,
  reExamMarks: ''
},
{
  id: 'R08',
  rollNo: '15',
  name: 'Arjun Malhotra',
  grNo: 'GR2024015',
  suId: 'SU10015',
  classSec: '11-A',
  subject: 'Physics',
  subjectId: 'PHY',
  originalMarks: 26,
  maxMarks: 70,
  passMarks: 28,
  reExamMarks: ''
},
{
  id: 'R09',
  rollNo: '04',
  name: 'Sunita Gupta',
  grNo: 'GR2024004',
  suId: 'SU10004',
  classSec: '11-B',
  subject: 'Chemistry',
  subjectId: 'CHEM',
  originalMarks: 19,
  maxMarks: 70,
  passMarks: 28,
  reExamMarks: ''
},
{
  id: 'R10',
  rollNo: '08',
  name: 'Kavita Joshi',
  grNo: 'GR2024008',
  suId: 'SU10008',
  classSec: '12-A',
  subject: 'English Language',
  subjectId: 'ENGL',
  originalMarks: 18,
  maxMarks: 80,
  passMarks: 32,
  reExamMarks: ''
},
{
  id: 'R11',
  rollNo: '01',
  name: 'Aditya Sharma',
  grNo: 'GR2024001',
  suId: 'SU10001',
  classSec: '12-B',
  subject: 'Hindi',
  subjectId: 'HIN',
  originalMarks: 24,
  maxMarks: 80,
  passMarks: 32,
  reExamMarks: ''
},
{
  id: 'R12',
  rollNo: '13',
  name: 'Rajesh Pillai',
  grNo: 'GR2024013',
  suId: 'SU10013',
  classSec: '9-A',
  subject: 'Biology',
  subjectId: 'BIO',
  originalMarks: 23,
  maxMarks: 70,
  passMarks: 28,
  reExamMarks: ''
}];

const RE_EXAMS = [
'Supplementary Exam 2024',
'Compartment Exam 2024',
'Re-Test Term 1',
'Annual Re-Exam'];

const CLASSES = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const SUBJECTS = [
'Mathematics',
'Physics',
'Chemistry',
'Biology',
'English Language',
'English Literature',
'Hindi'];

const STATUSES = ['All', 'Pending', 'Completed'];
export function CisceGradeCalculationSetup() {
  const [reExam, setReExam] = useState('');
  const [studentName, setStudentName] = useState('');
  const [grNo, setGrNo] = useState('');
  const [suId, setSuId] = useState('');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('All');
  const [searched, setSearched] = useState(false);
  const [students, setStudents] = useState<ReExamStudent[]>(MOCK_STUDENTS);
  const handleSearch = () => setSearched(true);
  const handleMark = (id: string, val: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      reExamMarks: val
    } :
    s
    )
    );
  };
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (
      studentName &&
      !s.name.toLowerCase().includes(studentName.toLowerCase()))

      return false;
      if (grNo && !s.grNo.toLowerCase().includes(grNo.toLowerCase()))
      return false;
      if (suId && !s.suId.toLowerCase().includes(suId.toLowerCase()))
      return false;
      if (cls && !s.classSec.startsWith(cls.replace('Class ', ''))) return false;
      if (subject && s.subject !== subject) return false;
      if (status === 'Completed' && s.reExamMarks === '') return false;
      if (status === 'Pending' && s.reExamMarks !== '') return false;
      return true;
    });
  }, [students, studentName, grNo, suId, cls, subject, status]);
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const appeared = filteredStudents.filter((s) => s.reExamMarks !== '').length;
    const passed = filteredStudents.filter((s) => {
      const n = Number(s.reExamMarks);
      return s.reExamMarks !== '' && !isNaN(n) && n >= s.passMarks;
    }).length;
    const improved = filteredStudents.filter((s) => {
      const n = Number(s.reExamMarks);
      return s.reExamMarks !== '' && !isNaN(n) && n > s.originalMarks;
    }).length;
    return {
      total,
      appeared,
      passed,
      improved
    };
  }, [filteredStudents]);
  const getImprovement = (s: ReExamStudent) => {
    const n = Number(s.reExamMarks);
    if (s.reExamMarks === '' || isNaN(n)) return null;
    return n - s.originalMarks;
  };
  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg shadow-purple-200">
          <RefreshCw className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CISCE — Re-Exam Mark Entry
          </h1>
          <p className="text-sm text-gray-500">
            Enter marks for students appearing in CISCE supplementary /
            compartment examinations
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-gray-700">
            Search Filters
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Re-Exam Name
            </label>
            <select
              value={reExam}
              onChange={(e) => setReExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">Select Re-Exam</option>
              {RE_EXAMS.map((r) =>
              <option key={r}>{r}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Search name..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              GR No
            </label>
            <input
              type="text"
              value={grNo}
              onChange={(e) => setGrNo(e.target.value)}
              placeholder="GR number..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              SU ID
            </label>
            <input
              type="text"
              value={suId}
              onChange={(e) => setSuId(e.target.value)}
              placeholder="SU ID..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Class
            </label>
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">All Classes</option>
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

              <option value="">All Sections</option>
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              <option value="">All Subjects</option>
              {SUBJECTS.map((s) =>
              <option key={s}>{s}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">

              {STATUSES.map((s) =>
              <option key={s}>{s}</option>
              )}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-medium text-sm hover:opacity-90 shadow-sm">

            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      {!searched &&
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Use filters above to search re-exam students
          </p>
        </div>
      }

      {searched &&
      <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
          {
            label: 'Total Re-Exam',
            val: stats.total,
            color: 'border-l-purple-500',
            text: 'text-gray-900'
          },
          {
            label: 'Appeared',
            val: stats.appeared,
            color: 'border-l-violet-500',
            text: 'text-violet-600'
          },
          {
            label: 'Passed',
            val: stats.passed,
            color: 'border-l-green-500',
            text: 'text-green-600'
          },
          {
            label: 'Improved',
            val: stats.improved,
            color: 'border-l-teal-500',
            text: 'text-teal-600'
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
            <div className="p-4 border-b flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">
                {filteredStudents.length} Re-Exam Students
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase w-10">
                      S.No
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase w-16">
                      Roll No
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase min-w-[150px]">
                      Student Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      GR No
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      SU ID
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                      Class-Sec
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase min-w-[140px]">
                      Subject
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-400 uppercase bg-gray-100">
                      Original
                      <br />
                      <span className="font-normal">Marks</span>
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-purple-600 uppercase bg-purple-50 border-l border-purple-200">
                      Re-Exam
                      <br />
                      Marks
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                      Grade
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                      Improvement
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((s, idx) => {
                  const n = Number(s.reExamMarks);
                  const valid =
                  s.reExamMarks !== '' &&
                  !isNaN(n) &&
                  n >= 0 &&
                  n <= s.maxMarks;
                  const gradeInfo = valid ? getGrade(n, s.maxMarks) : null;
                  const improvement = getImprovement(s);
                  const passed = valid && n >= s.passMarks;
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors ${passed === false && valid ? 'bg-red-50/40' : 'hover:bg-gray-50/50'}`}>

                        <td className="px-3 py-3 text-sm text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                            {s.rollNo}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-gray-900">
                          {s.name}
                        </td>
                        <td className="px-3 py-3 text-xs font-mono text-gray-500">
                          {s.grNo}
                        </td>
                        <td className="px-3 py-3 text-xs font-mono text-gray-500">
                          {s.suId}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {s.classSec}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {s.subject}
                        </td>
                        <td className="px-3 py-3 text-center bg-gray-100/50">
                          <span className="font-bold text-gray-400">
                            {s.originalMarks}
                          </span>
                          <span className="text-gray-300 text-xs">
                            /{s.maxMarks}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center bg-purple-50/30 border-l border-purple-100">
                          <div className="flex flex-col items-center gap-0.5">
                            <input
                            type="text"
                            value={s.reExamMarks}
                            onChange={(e) => handleMark(s.id, e.target.value)}
                            placeholder="—"
                            className={`w-16 py-1.5 border-2 rounded-xl text-center text-sm font-bold outline-none transition-all ${s.reExamMarks === '' ? 'border-gray-200 focus:border-purple-400' : valid ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`} />

                            <span className="text-[9px] text-gray-400">
                              /{s.maxMarks}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {gradeInfo ?
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${gradeInfo.cls}`}>

                              {gradeInfo.grade}
                            </span> :

                        <span className="text-gray-300 text-xs">—</span>
                        }
                        </td>
                        <td className="px-3 py-3 text-center">
                          {improvement === null ?
                        <span className="text-gray-300 text-xs">—</span> :
                        improvement > 0 ?
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              <TrendingUp className="w-3 h-3" />+{improvement}
                            </span> :
                        improvement < 0 ?
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              <TrendingDown className="w-3 h-3" />
                              {improvement}
                            </span> :

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                              <Minus className="w-3 h-3" />0
                            </span>
                        }
                        </td>
                        <td className="px-3 py-3 text-center">
                          {s.reExamMarks === '' ?
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span> :
                        passed ?
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Passed
                            </span> :

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              <AlertCircle className="w-3 h-3" />
                              Failed
                            </span>
                        }
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filteredStudents.length} students • {stats.appeared} appeared •{' '}
                {stats.passed} passed
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md shadow-purple-200">
                <Save className="w-5 h-5" /> Save Marks
              </button>
            </div>
          </div>
        </>
      }
    </div>);

}