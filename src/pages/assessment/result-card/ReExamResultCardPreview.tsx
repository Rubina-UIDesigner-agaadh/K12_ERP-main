import React, { useState } from 'react';
import {
  FileText,
  Download,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter } from
'lucide-react';
interface ReExamSubject {
  subject: string;
  prevMarks: number;
  reExamMarks: number;
  finalMarks: number;
  maxMarks: number;
  ruleApplied: string;
  prevStatus: 'Pass' | 'Fail';
  finalStatus: 'Pass' | 'Fail';
  improved: boolean;
}
const reExamData: ReExamSubject[] = [
{
  subject: 'Mathematics',
  prevMarks: 28,
  reExamMarks: 45,
  finalMarks: 45,
  maxMarks: 100,
  ruleApplied: 'Best of Two',
  prevStatus: 'Fail',
  finalStatus: 'Pass',
  improved: true
},
{
  subject: 'Science',
  prevMarks: 31,
  reExamMarks: 38,
  finalMarks: 38,
  maxMarks: 100,
  ruleApplied: 'Best of Two',
  prevStatus: 'Fail',
  finalStatus: 'Pass',
  improved: true
},
{
  subject: 'English',
  prevMarks: 72,
  reExamMarks: 68,
  finalMarks: 72,
  maxMarks: 100,
  ruleApplied: 'Best of Two',
  prevStatus: 'Pass',
  finalStatus: 'Pass',
  improved: false
},
{
  subject: 'Hindi',
  prevMarks: 55,
  reExamMarks: 61,
  finalMarks: 61,
  maxMarks: 100,
  ruleApplied: 'Best of Two',
  prevStatus: 'Pass',
  finalStatus: 'Pass',
  improved: true
},
{
  subject: 'Social Studies',
  prevMarks: 48,
  reExamMarks: 52,
  finalMarks: 52,
  maxMarks: 100,
  ruleApplied: 'Best of Two',
  prevStatus: 'Pass',
  finalStatus: 'Pass',
  improved: true
}];

export function ReExamResultCardPreview() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedReExam, setSelectedReExam] = useState(
    'Supplementary Exam 2024'
  );
  const [selectedStd, setSelectedStd] = useState('9');
  const [selectedSection, setSelectedSection] = useState('B');
  const [selectedStudent, setSelectedStudent] = useState('Rohan Mehta (15)');
  const [showComparison, setShowComparison] = useState(true);
  const prevTotal = reExamData.reduce((a, s) => a + s.prevMarks, 0);
  const finalTotal = reExamData.reduce((a, s) => a + s.finalMarks, 0);
  const maxTotal = reExamData.reduce((a, s) => a + s.maxMarks, 0);
  const prevPct = (prevTotal / maxTotal * 100).toFixed(1);
  const finalPct = (finalTotal / maxTotal * 100).toFixed(1);
  const improvedCount = reExamData.filter((s) => s.improved).length;
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white shadow-lg">
            <ArrowLeftRight className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Re-Exam Result Card Preview
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View updated marks after re-exam / supplementary processing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showComparison ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>

            <ArrowLeftRight className="w-4 h-4" /> Compare Main vs Re-Exam
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
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
            label: 'Re-Exam Name',
            value: selectedReExam,
            setter: setSelectedReExam,
            options: [
            'Supplementary Exam 2024',
            'Improvement Exam 2024',
            'Re-Test Oct 2024']

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
            options: ['A', 'B', 'C']
          },
          {
            label: 'Student',
            value: selectedStudent,
            setter: setSelectedStudent,
            options: [
            'Rohan Mehta (15)',
            'Priya Singh (22)',
            'Karan Joshi (08)']

          }].
          map(({ label, value, setter, options }) =>
          <div key={label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
              </label>
              <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">

                {options.map((o) =>
              <option key={o}>{o}</option>
              )}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Previous Total
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prevTotal}/{maxTotal}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{prevPct}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Final Total
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {finalTotal}/{maxTotal}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{finalPct}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Subjects Improved
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {improvedCount}/{reExamData.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Updated Status
          </p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4" /> PASS
          </span>
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-700 font-bold text-lg">RM</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Rohan Mehta</h3>
            <p className="text-sm text-gray-500">
              Class {selectedStd}-{selectedSection} | Roll No. 15 | Adm. No.
              SIS/2021/015
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              Re-Exam Eligible
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Result Merged
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            {showComparison ?
            'Main Exam vs Re-Exam Comparison' :
            'Final Result After Merge'}
          </h3>
          <span className="text-xs text-gray-500">
            Rule: Best of Two applied
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Subject
                </th>
                {showComparison &&
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Previous Marks
                  </th>
                }
                {showComparison &&
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Re-Exam Marks
                  </th>
                }
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Final Marks
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Max Marks
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Rule Applied
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                {showComparison &&
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Change
                  </th>
                }
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reExamData.map((row) =>
              <tr
                key={row.subject}
                className={
                row.improved ?
                'bg-green-50/40' :
                'bg-white hover:bg-gray-50'
                }>

                  <td className="py-3 px-4 font-medium text-gray-900">
                    {row.subject}
                  </td>
                  {showComparison &&
                <td className="py-3 px-4 text-center">
                      <span
                    className={`font-medium ${row.prevStatus === 'Fail' ? 'text-red-600' : 'text-gray-700'}`}>

                        {row.prevMarks}
                      </span>
                      {row.prevStatus === 'Fail' &&
                  <span className="ml-1 text-xs text-red-500">
                          (Fail)
                        </span>
                  }
                    </td>
                }
                  {showComparison &&
                <td className="py-3 px-4 text-center font-medium text-blue-700">
                      {row.reExamMarks}
                    </td>
                }
                  <td className="py-3 px-4 text-center font-bold text-gray-900">
                    {row.finalMarks}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {row.maxMarks}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {row.ruleApplied}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.finalStatus === 'Pass' ?
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> Pass
                      </span> :

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" /> Fail
                      </span>
                  }
                  </td>
                  {showComparison &&
                <td className="py-3 px-4 text-center">
                      {row.improved ?
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                          <TrendingUp className="w-3.5 h-3.5" /> +
                          {row.finalMarks - row.prevMarks}
                        </span> :
                  row.reExamMarks < row.prevMarks ?
                  <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                          <TrendingDown className="w-3.5 h-3.5" />{' '}
                          {row.reExamMarks - row.prevMarks}
                        </span> :

                  <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <Minus className="w-3.5 h-3.5" /> 0
                        </span>
                  }
                    </td>
                }
                </tr>
              )}
            </tbody>
            <tfoot className="bg-orange-50 border-t-2 border-orange-200">
              <tr>
                <td className="py-3 px-4 font-bold text-gray-900">TOTAL</td>
                {showComparison &&
                <td className="py-3 px-4 text-center font-bold text-gray-700">
                    {prevTotal}
                  </td>
                }
                {showComparison &&
                <td className="py-3 px-4 text-center font-bold text-blue-700">
                    —
                  </td>
                }
                <td className="py-3 px-4 text-center font-bold text-orange-700 text-base">
                  {finalTotal}
                </td>
                <td className="py-3 px-4 text-center font-bold text-gray-700">
                  {maxTotal}
                </td>
                <td />
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                    <CheckCircle className="w-4 h-4" /> PASS
                  </span>
                </td>
                {showComparison &&
                <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-bold">
                      <TrendingUp className="w-4 h-4" /> +
                      {finalTotal - prevTotal}
                    </span>
                  </td>
                }
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Improvement Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" /> Improvement Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="font-medium text-green-800">Subjects Improved</p>
            <p className="text-green-700 mt-1">
              Mathematics (+17), Science (+7), Hindi (+6), Social Studies (+4)
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="font-medium text-blue-800">Percentage Change</p>
            <p className="text-blue-700 mt-1">
              Previous: {prevPct}% → Final: {finalPct}% (+
              {(parseFloat(finalPct) - parseFloat(prevPct)).toFixed(1)}%)
            </p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p className="font-medium text-teal-800">Rank Change</p>
            <p className="text-teal-700 mt-1">
              Previous Rank: 35 → Updated Rank: 28 (Improved by 7 positions)
            </p>
          </div>
        </div>
      </div>
    </div>);

}