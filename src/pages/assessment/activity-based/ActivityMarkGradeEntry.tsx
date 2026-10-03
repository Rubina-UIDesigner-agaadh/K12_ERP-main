import React, { useMemo, useState } from 'react';
import {
  Save,
  Send,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  Users,
  BookOpen,
  Calendar,
  Filter,
  Download,
  Loader2,
  Check,
  X,
  Info,
  BarChart3,
  Edit3 } from
'lucide-react';
interface StudentGradeEntry {
  id: string;
  rollNo: string;
  name: string;
  gender: 'M' | 'F';
  grades: Record<string, string>;
  remarks: string;
  status: 'Draft' | 'Submitted' | 'Pending';
}
const AREAS = [
{
  id: 'life-skills',
  name: 'Life Skills',
  indicators: [
  'Problem Solving',
  'Critical Thinking',
  'Decision Making',
  'Communication Skills']

},
{
  id: 'work-ed',
  name: 'Work Education',
  indicators: ['Practical Skills', 'Project Work', 'Vocational Activities']
},
{
  id: 'vpa',
  name: 'Visual & Performing Arts',
  indicators: ['Drawing', 'Music', 'Dance', 'Drama', 'Craft']
},
{
  id: 'attitudes',
  name: 'Attitudes & Values',
  indicators: ['Respect', 'Responsibility', 'Integrity', 'Empathy']
},
{
  id: 'hpe',
  name: 'Health & Physical Education',
  indicators: ['Fitness', 'Sports', 'Yoga', 'Health Awareness']
},
{
  id: 'discipline',
  name: 'Discipline',
  indicators: ['Punctuality', 'Conduct', 'Uniform', 'Behavior']
},
{
  id: 'club',
  name: 'Club Participation',
  indicators: ['Science Club', 'Literary Club', 'Sports Club']
},
{
  id: 'social',
  name: 'Social Responsibility',
  indicators: [
  'Community Service',
  'Environmental Awareness',
  'Social Outreach']

}];

const GRADES = ['A', 'B', 'C', 'D', 'E'];
const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-300',
  B: 'bg-blue-100 text-blue-700 border-blue-300',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  D: 'bg-orange-100 text-orange-700 border-orange-300',
  E: 'bg-red-100 text-red-700 border-red-300'
};
const generateStudents = (): StudentGradeEntry[] => {
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
  'Tanvi Joshi'];

  const lifeSkillsIndicators = [
  'Problem Solving',
  'Critical Thinking',
  'Decision Making',
  'Communication Skills'];

  const gradeOptions = ['A', 'A', 'B', 'B', 'B', 'C', 'C', 'D'];
  return names.map((name, idx) => {
    const grades: Record<string, string> = {};
    const isPending = idx >= 12;
    if (!isPending) {
      lifeSkillsIndicators.forEach((ind) => {
        grades[ind] =
        gradeOptions[Math.floor(Math.random() * gradeOptions.length)];
      });
    }
    return {
      id: `s${idx + 1}`,
      rollNo: String(idx + 1).padStart(2, '0'),
      name,
      gender: idx % 3 === 0 ? 'F' : 'M',
      grades,
      remarks: isPending ?
      '' :
      idx % 4 === 0 ?
      'Shows excellent initiative and leadership qualities.' :
      '',
      status: isPending ? 'Pending' : idx % 5 === 0 ? 'Submitted' : 'Draft'
    };
  });
};
export function ActivityMarkGradeEntry() {
  const [selectedClass, setSelectedClass] = useState('8');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedArea, setSelectedArea] = useState('life-skills');
  const [selectedTerm, setSelectedTerm] = useState('term-2');
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [students, setStudents] =
  useState<StudentGradeEntry[]>(generateStudents);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [bulkGrade, setBulkGrade] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const currentArea = AREAS.find((a) => a.id === selectedArea)!;
  const indicators = currentArea.indicators;
  const stats = useMemo(() => {
    const total = students.length;
    const entered = students.filter(
      (s) => Object.keys(s.grades).length > 0
    ).length;
    const submitted = students.filter((s) => s.status === 'Submitted').length;
    const pending = students.filter((s) => s.status === 'Pending').length;
    const pct = Math.round(entered / total * 100);
    return {
      total,
      entered,
      submitted,
      pending,
      pct
    };
  }, [students]);
  const setGrade = (studentId: string, indicator: string, grade: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === studentId ?
    {
      ...s,
      grades: {
        ...s.grades,
        [indicator]: grade
      },
      status: s.status === 'Pending' ? 'Draft' : s.status
    } :
    s
    )
    );
    setAutoSaveMsg('Auto-saved');
    setTimeout(() => setAutoSaveMsg(''), 2000);
  };
  const setRemark = (studentId: string, remark: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === studentId ?
    {
      ...s,
      remarks: remark
    } :
    s
    )
    );
  };
  const applyBulkGrade = () => {
    if (!bulkGrade || selectedStudents.length === 0) return;
    setStudents((prev) =>
    prev.map((s) => {
      if (!selectedStudents.includes(s.id)) return s;
      const grades = {
        ...s.grades
      };
      indicators.forEach((ind) => {
        grades[ind] = bulkGrade;
      });
      return {
        ...s,
        grades,
        status: 'Draft'
      };
    })
    );
    setBulkGrade('');
    setSelectedStudents([]);
  };
  const handleSubmitAll = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setStudents((prev) =>
    prev.map((s) =>
    Object.keys(s.grades).length === indicators.length ?
    {
      ...s,
      status: 'Submitted'
    } :
    s
    )
    );
    setSubmitting(false);
  };
  const toggleSelect = (id: string) => {
    setSelectedStudents((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    setSelectedStudents((prev) =>
    prev.length === students.length ? [] : students.map((s) => s.id)
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl text-white shadow-lg">
            <Edit3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Co-Scholastic Grade Entry
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter grades for students per co-scholastic area and indicators
            </p>
          </div>
        </div>
        {autoSaveMsg &&
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            <Check className="w-4 h-4" /> {autoSaveMsg}
          </div>
        }
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">

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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">

              {['A', 'B', 'C', 'D'].map((s) =>
              <option key={s} value={s}>
                  Section {s}
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Assessment Area
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">

              {AREAS.map((a) =>
              <option key={a.id} value={a.id}>
                  {a.name}
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">

              <option value="term-1">Term 1</option>
              <option value="term-2">Term 2</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">

              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
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
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Grades Entered
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.entered}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Submitted
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.submitted}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {stats.pending}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Entry Completion — {currentArea.name}
          </span>
          <span className="text-sm font-bold text-green-600">{stats.pct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${stats.pct}%`
            }} />

        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stats.entered} of {stats.total} students have grades entered
        </p>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 &&
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-sm font-medium text-green-800">
            {selectedStudents.length} student(s) selected
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700">
              Apply grade to all indicators:
            </span>
            <select
            value={bulkGrade}
            onChange={(e) => setBulkGrade(e.target.value)}
            className="px-3 py-1.5 border border-green-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">

              <option value="">Select Grade</option>
              {GRADES.map((g) =>
            <option key={g} value={g}>
                  Grade {g}
                </option>
            )}
            </select>
            <button
            onClick={applyBulkGrade}
            disabled={!bulkGrade}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">

              Apply
            </button>
          </div>
          <button
          onClick={() => setSelectedStudents([])}
          className="ml-auto text-sm text-green-600 hover:text-green-800">

            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Grade Entry Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Class {selectedClass}-{selectedSection} — {currentArea.name}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmitAll}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">

              {submitting ?
              <Loader2 className="w-4 h-4 animate-spin" /> :

              <Send className="w-4 h-4" />
              }
              Submit All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-green-600" />

                </th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase w-16">
                  Roll No
                </th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Student Name
                </th>
                {indicators.map((ind) =>
                <th
                  key={ind}
                  className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">

                    {ind}
                  </th>
                )}
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Remarks
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) =>
              <tr
                key={student.id}
                className={`hover:bg-gray-50 ${selectedStudents.includes(student.id) ? 'bg-green-50' : ''}`}>

                  <td className="py-3 px-3">
                    <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600" />

                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-bold">
                      {student.rollNo}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-400">
                      {student.gender === 'M' ? 'Male' : 'Female'}
                    </p>
                  </td>
                  {indicators.map((ind) =>
                <td key={ind} className="py-3 px-3 text-center">
                      <select
                    value={student.grades[ind] || ''}
                    onChange={(e) =>
                    setGrade(student.id, ind, e.target.value)
                    }
                    className={`w-16 px-1 py-1.5 border rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-green-500 ${student.grades[ind] ? gradeColors[student.grades[ind]] : 'border-gray-200 bg-white text-gray-400'}`}>

                        <option value="">-</option>
                        {GRADES.map((g) =>
                    <option key={g} value={g}>
                            {g}
                          </option>
                    )}
                      </select>
                    </td>
                )}
                  <td className="py-3 px-3">
                    <input
                    type="text"
                    value={student.remarks}
                    onChange={(e) => setRemark(student.id, e.target.value)}
                    placeholder="Add remarks..."
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500" />

                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${student.status === 'Submitted' ? 'bg-green-100 text-green-700' : student.status === 'Draft' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>

                      {student.status === 'Submitted' ?
                    <CheckCircle className="w-3 h-3" /> :
                    student.status === 'Draft' ?
                    <Clock className="w-3 h-3" /> :

                    <AlertCircle className="w-3 h-3" />
                    }
                      {student.status}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Grade Legend
        </p>
        <div className="flex flex-wrap gap-3">
          {[
          {
            g: 'A',
            desc: 'Outstanding (91-100%)'
          },
          {
            g: 'B',
            desc: 'Very Good (71-90%)'
          },
          {
            g: 'C',
            desc: 'Good (51-70%)'
          },
          {
            g: 'D',
            desc: 'Satisfactory (33-50%)'
          },
          {
            g: 'E',
            desc: 'Needs Improvement (0-32%)'
          }].
          map((item) =>
          <div key={item.g} className="flex items-center gap-2">
              <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${gradeColors[item.g]}`}>

                {item.g}
              </span>
              <span className="text-xs text-gray-600">{item.desc}</span>
            </div>
          )}
        </div>
      </div>
    </div>);

}