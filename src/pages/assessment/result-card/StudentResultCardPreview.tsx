import React, { useState, Component } from 'react';
import {
  FileText,
  Download,
  Printer,
  RefreshCw,
  Eye,
  ChevronDown,
  Award,
  User,
  BookOpen,
  BarChart2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  SplitSquareHorizontal,
  Calculator } from
'lucide-react';
interface SubjectResult {
  subject: string;
  maxMarks: number;
  obtained: number;
  grade: string;
  status: 'Pass' | 'Fail';
  component?: {
    theory: number;
    practical: number;
    internal: number;
  };
}
const subjectData: SubjectResult[] = [
{
  subject: 'English',
  maxMarks: 100,
  obtained: 87,
  grade: 'A1',
  status: 'Pass',
  component: {
    theory: 60,
    practical: 0,
    internal: 27
  }
},
{
  subject: 'Mathematics',
  maxMarks: 100,
  obtained: 92,
  grade: 'A1',
  status: 'Pass',
  component: {
    theory: 70,
    practical: 0,
    internal: 22
  }
},
{
  subject: 'Science',
  maxMarks: 100,
  obtained: 78,
  grade: 'A2',
  status: 'Pass',
  component: {
    theory: 55,
    practical: 15,
    internal: 8
  }
},
{
  subject: 'Social Studies',
  maxMarks: 100,
  obtained: 83,
  grade: 'A1',
  status: 'Pass',
  component: {
    theory: 65,
    practical: 0,
    internal: 18
  }
},
{
  subject: 'Hindi',
  maxMarks: 100,
  obtained: 74,
  grade: 'B1',
  status: 'Pass',
  component: {
    theory: 58,
    practical: 0,
    internal: 16
  }
},
{
  subject: 'Computer Science',
  maxMarks: 50,
  obtained: 44,
  grade: 'A1',
  status: 'Pass',
  component: {
    theory: 30,
    practical: 14,
    internal: 0
  }
},
{
  subject: 'Physical Education',
  maxMarks: 50,
  obtained: 42,
  grade: 'A1',
  status: 'Pass',
  component: {
    theory: 0,
    practical: 42,
    internal: 0
  }
}];

const gradeColors: Record<string, string> = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-emerald-100 text-emerald-700',
  B1: 'bg-blue-100 text-blue-700',
  B2: 'bg-sky-100 text-sky-700',
  C1: 'bg-yellow-100 text-yellow-700',
  C2: 'bg-amber-100 text-amber-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-red-100 text-red-700'
};
export function StudentResultCardPreview() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [selectedStd, setSelectedStd] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const [selectedStudent, setSelectedStudent] = useState('Advait Krishnan (01)');
  const [showTermSplit, setShowTermSplit] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [showCalcSummary, setShowCalcSummary] = useState(false);
  const [resultDeclared] = useState(true);
  const totalMax = subjectData.reduce((a, s) => a + s.maxMarks, 0);
  const totalObtained = subjectData.reduce((a, s) => a + s.obtained, 0);
  const percentage = (totalObtained / totalMax * 100).toFixed(1);
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl text-white shadow-lg">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Result Card Preview
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Preview finalized result card before printing or distribution
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCalcSummary(!showCalcSummary)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">

            <Calculator className="w-4 h-4" /> Calculation Summary
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Send for Reprint
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
          {
            label: 'Academic Year',
            value: selectedYear,
            setter: setSelectedYear,
            options: ['2024-25', '2023-24', '2022-23']
          },
          {
            label: 'Board',
            value: selectedBoard,
            setter: setSelectedBoard,
            options: ['CBSE', 'ICSE', 'GSEB', 'State']
          },
          {
            label: 'Standard',
            value: selectedStd,
            setter: setSelectedStd,
            options: ['8', '9', '10', '11', '12']
          },
          {
            label: 'Section',
            value: selectedSection,
            setter: setSelectedSection,
            options: ['A', 'B', 'C', 'D']
          },
          {
            label: 'Exam',
            value: selectedExam,
            setter: setSelectedExam,
            options: ['Annual Exam', 'Term 1', 'Term 2', 'Unit Test 1']
          },
          {
            label: 'Student',
            value: selectedStudent,
            setter: setSelectedStudent,
            options: [
            'Advait Krishnan (01)',
            'Ananya Sharma (02)',
            'Arjun Patel (03)']

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

      {!resultDeclared ?
      <div className="bg-white rounded-xl border border-amber-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Result Not Declared
          </h3>
          <p className="text-gray-500 text-sm">
            The result for this student has not been declared yet. Please check
            back after result processing is complete.
          </p>
        </div> :

      <>
          {/* View Controls */}
          <div className="flex items-center gap-3">
            <button
            onClick={() => setShowTermSplit(!showTermSplit)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showTermSplit ? 'bg-teal-50 border-teal-300 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>

              <SplitSquareHorizontal className="w-4 h-4" /> Term-wise Split
            </button>
            <button
            onClick={() => setShowComponents(!showComponents)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showComponents ? 'bg-teal-50 border-teal-300 text-teal-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>

              <Eye className="w-4 h-4" /> Component-wise Split
            </button>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-teal-700 to-cyan-700 text-white p-5">
              <div className="text-center">
                <h2 className="text-xl font-bold">
                  SUNRISE INTERNATIONAL SCHOOL
                </h2>
                <p className="text-teal-200 text-sm">
                  Affiliated to {selectedBoard} | School Code: 12345
                </p>
                <p className="text-teal-100 text-sm mt-1 font-medium">
                  PROGRESS REPORT — Academic Year {selectedYear}
                </p>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
              <div className="p-5 space-y-2 border-r border-gray-200">
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Student Name:</span>
                  <span className="font-semibold text-gray-900">
                    Advait Krishnan
                  </span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Class & Section:</span>
                  <span className="font-semibold text-gray-900">
                    Class {selectedStd} — {selectedSection}
                  </span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Roll Number:</span>
                  <span className="font-semibold text-gray-900">01</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Admission No.:</span>
                  <span className="font-semibold text-gray-900">
                    SIS/2020/001
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Exam:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedExam}
                  </span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Attendance:</span>
                  <span className="font-semibold text-green-700">
                    96.5% (193/200 days)
                  </span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Rank:</span>
                  <span className="font-semibold text-gray-900">3 / 42</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32">Grace Applied:</span>
                  <span className="text-gray-500 italic">None</span>
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Subject
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Max Marks
                    </th>
                    {showComponents ?
                  <>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                          Theory
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                          Practical
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                          Internal
                        </th>
                      </> :
                  null}
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Obtained
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Grade
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subjectData.map((row, idx) =>
                <tr
                  key={row.subject}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>

                      <td className="py-3 px-4 font-medium text-gray-900">
                        {row.subject}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {row.maxMarks}
                      </td>
                      {showComponents ?
                  <>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {row.component?.theory || '—'}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {row.component?.practical || '—'}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {row.component?.internal || '—'}
                          </td>
                        </> :
                  null}
                      <td className="py-3 px-4 text-center font-semibold text-gray-900">
                        {row.obtained}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeColors[row.grade] || 'bg-gray-100 text-gray-600'}`}>

                          {row.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.status === 'Pass' ?
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> Pass
                          </span> :

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" /> Fail
                          </span>
                    }
                      </td>
                    </tr>
                )}
                </tbody>
                <tfoot className="bg-teal-50 border-t-2 border-teal-200">
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-900">TOTAL</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      {totalMax}
                    </td>
                    {showComponents ?
                  <>
                        <td />
                        <td />
                        <td />
                      </> :
                  null}
                    <td className="py-3 px-4 text-center font-bold text-teal-700 text-base">
                      {totalObtained}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        A1
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        <CheckCircle className="w-4 h-4" /> PASS
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-gray-200">
              <div className="p-4 text-center border-r border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Total Marks
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalObtained}/{totalMax}
                </p>
              </div>
              <div className="p-4 text-center border-r border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Percentage
                </p>
                <p className="text-2xl font-bold text-teal-600 mt-1">
                  {percentage}%
                </p>
              </div>
              <div className="p-4 text-center border-r border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Final Grade
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">A1</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Result Status
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
                  <CheckCircle className="w-4 h-4" /> PASS
                </span>
              </div>
            </div>

            {/* Remarks */}
            <div className="p-5 border-t border-gray-200 bg-amber-50">
              <p className="text-xs font-semibold text-gray-700 mb-1.5">
                Teacher's Remarks:
              </p>
              <p className="text-sm text-gray-600 italic">
                "Advait has shown exceptional dedication and academic excellence
                throughout the year. His performance across all subjects
                reflects consistent effort and a strong grasp of concepts. Keep
                up the outstanding work!"
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 p-5 border-t border-gray-200 text-xs text-center text-gray-500">
              <div>
                <div className="border-t border-gray-400 pt-2 mt-8">
                  Class Teacher
                </div>
              </div>
              <div>
                <div className="border-t border-gray-400 pt-2 mt-8">
                  Parent / Guardian
                </div>
              </div>
              <div>
                <div className="border-t border-gray-400 pt-2 mt-8">
                  Principal
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Summary Panel */}
          {showCalcSummary &&
        <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-teal-600" /> Result
                Calculation Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">
                    Grade Calculation Rule
                  </p>
                  <p className="text-gray-600">
                    CBSE 9-point grading scale applied. Marks converted to
                    grades based on percentage ranges.
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">
                    Pass Criteria
                  </p>
                  <p className="text-gray-600">
                    Minimum 33% in each subject. Overall 33% aggregate required
                    for promotion.
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">
                    Rank Calculation
                  </p>
                  <p className="text-gray-600">
                    Rank computed based on total marks across all subjects
                    within the section.
                  </p>
                </div>
              </div>
            </div>
        }
        </>
      }
    </div>);

}