import React, { useState } from 'react';
import {
  PlayIcon,
  LockIcon,
  DownloadIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  BarChart2Icon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
interface StudentSummary {
  rollNo: string;
  name: string;
  section: string;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  total: number;
  majorityGrade: 'A' | 'B' | 'C';
  remark: string;
  status: 'complete' | 'incomplete' | 'pending';
}
const SAMPLE_SUMMARIES: StudentSummary[] = [
{
  rollNo: '01',
  name: 'Aarav Sharma',
  section: 'A',
  gradeA: 14,
  gradeB: 4,
  gradeC: 2,
  total: 20,
  majorityGrade: 'A',
  remark: 'Outstanding performance. Keep it up!',
  status: 'complete'
},
{
  rollNo: '02',
  name: 'Priya Patel',
  section: 'A',
  gradeA: 10,
  gradeB: 8,
  gradeC: 2,
  total: 20,
  majorityGrade: 'A',
  remark: 'Outstanding performance. Keep it up!',
  status: 'complete'
},
{
  rollNo: '03',
  name: 'Rohan Mehta',
  section: 'A',
  gradeA: 6,
  gradeB: 10,
  gradeC: 4,
  total: 20,
  majorityGrade: 'B',
  remark: 'Good performance. Continue the effort.',
  status: 'complete'
},
{
  rollNo: '04',
  name: 'Ananya Singh',
  section: 'A',
  gradeA: 12,
  gradeB: 6,
  gradeC: 2,
  total: 20,
  majorityGrade: 'A',
  remark: 'Outstanding performance. Keep it up!',
  status: 'complete'
},
{
  rollNo: '05',
  name: 'Karan Joshi',
  section: 'A',
  gradeA: 4,
  gradeB: 8,
  gradeC: 8,
  total: 20,
  majorityGrade: 'B',
  remark: 'Good performance. Continue the effort.',
  status: 'complete'
},
{
  rollNo: '06',
  name: 'Divya Nair',
  section: 'A',
  gradeA: 0,
  gradeB: 0,
  gradeC: 0,
  total: 0,
  majorityGrade: 'C',
  remark: '',
  status: 'incomplete'
}];

export function CceTermSummary() {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [standard, setStandard] = useState('1');
  const [section, setSection] = useState('A');
  const [term, setTerm] = useState('Term 1');
  const [summaries, setSummaries] = useState<StudentSummary[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [generating, setGenerating] = useState(false);
  const completeCount = SAMPLE_SUMMARIES.filter(
    (s) => s.status === 'complete'
  ).length;
  const incompleteCount = SAMPLE_SUMMARIES.filter(
    (s) => s.status === 'incomplete'
  ).length;
  const canGenerate = incompleteCount === 0;
  function handleGenerate() {
    if (!canGenerate) return;
    setGenerating(true);
    setTimeout(() => {
      setSummaries(SAMPLE_SUMMARIES.filter((s) => s.status === 'complete'));
      setIsGenerated(true);
      setGenerating(false);
    }, 1500);
  }
  function handleLock() {
    setIsLocked(true);
  }
  const gradeACount = summaries.filter((s) => s.majorityGrade === 'A').length;
  const gradeBCount = summaries.filter((s) => s.majorityGrade === 'B').length;
  const gradeCCount = summaries.filter((s) => s.majorityGrade === 'C').length;
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Term-End CCE Summary Engine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated term summary computation for Std 1–2. Counts A/B/C grades
            across all 20 indicators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isGenerated && !isLocked &&
          <Button
            variant="outline"
            onClick={handleLock}
            className="flex items-center gap-2 text-amber-600 border-amber-300 hover:bg-amber-50">

              <LockIcon className="w-4 h-4" />
              Lock Summary
            </Button>
          }
          {isGenerated &&
          <Button variant="outline" className="flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              Export
            </Button>
          }
        </div>
      </div>

      {isLocked &&
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-amber-700 text-sm">
          <LockIcon className="w-4 h-4" />
          Term summary is locked. Re-evaluation requires Re-Exam Setup module.
        </div>
      }

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select
            label="Academic Year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            options={[
            {
              value: '2024-25',
              label: '2024-25'
            },
            {
              value: '2023-24',
              label: '2023-24'
            }]
            } />

          <Select
            label="Standard (Std 1–2 only)"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            options={[
            {
              value: '1',
              label: 'Standard 1'
            },
            {
              value: '2',
              label: 'Standard 2'
            }]
            } />

          <Select
            label="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            options={['A', 'B', 'C', 'D'].map((s) => ({
              value: s,
              label: `Section ${s}`
            }))} />

          <Select
            label="Term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            options={['Term 1', 'Term 2', 'Term 3', 'Annual'].map((t) => ({
              value: t,
              label: t
            }))} />

        </div>
      </div>

      {/* Pre-Generation Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BarChart2Icon className="w-4 h-4 text-gray-500" />
          Pre-Generation Validation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Total Students
              </p>
              <p className="text-xl font-bold text-gray-800">
                {SAMPLE_SUMMARIES.length}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${completeCount === SAMPLE_SUMMARIES.length ? 'bg-green-50' : 'bg-amber-50'}`}>

            <CheckCircleIcon
              className={`w-5 h-5 flex-shrink-0 ${completeCount === SAMPLE_SUMMARIES.length ? 'text-green-500' : 'text-amber-500'}`} />

            <div>
              <p className="text-sm font-medium text-gray-700">
                Grades Complete
              </p>
              <p className="text-xl font-bold text-gray-800">
                {completeCount} / {SAMPLE_SUMMARIES.length}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${incompleteCount === 0 ? 'bg-green-50' : 'bg-red-50'}`}>

            {incompleteCount === 0 ?
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" /> :

            <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
            }
            <div>
              <p className="text-sm font-medium text-gray-700">
                Incomplete Entries
              </p>
              <p
                className={`text-xl font-bold ${incompleteCount === 0 ? 'text-green-700' : 'text-red-700'}`}>

                {incompleteCount}
              </p>
            </div>
          </div>
        </div>

        {!canGenerate &&
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-700 text-sm mb-4">
            <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Cannot generate summary</p>
              <p>
                {incompleteCount} student(s) have incomplete grade entries. All
                20 indicators must be filled for every student.
              </p>
            </div>
          </div>
        }

        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || isLocked || generating}
          className="flex items-center gap-2">

          {generating ?
          <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

          <PlayIcon className="w-4 h-4" />
          }
          {generating ? 'Generating...' : 'Generate Term Summary'}
        </Button>
      </div>

      {/* Generated Summary */}
      {isGenerated && summaries.length > 0 &&
      <>
          {/* Class Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Students
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {summaries.length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                Majority Grade A
              </p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {gradeACount}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {Math.round(gradeACount / summaries.length * 100)}% of class
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Majority Grade B
              </p>
              <p className="text-3xl font-bold text-blue-700 mt-1">
                {gradeBCount}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {Math.round(gradeBCount / summaries.length * 100)}% of class
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                Majority Grade C
              </p>
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {gradeCCount}
              </p>
              <p className="text-xs text-amber-500 mt-1">
                {Math.round(gradeCCount / summaries.length * 100)}% of class
              </p>
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700 text-sm">
                Term Summary — Std {standard}
                {section} | {term} | {academicYear}
              </h3>
              {isLocked && <Badge variant="yellow">Locked</Badge>}
              {!isLocked && <Badge variant="green">Active</Badge>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Roll No
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Student Name
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-green-600">
                      Grade A Count
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-600">
                      Grade B Count
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-amber-600">
                      Grade C Count
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">
                      Majority Grade
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Auto Remark
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summaries.map((s) =>
                <tr key={s.rollNo} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {s.rollNo}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-700 font-bold text-sm">
                          {s.gradeA}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                          {s.gradeB}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold text-sm">
                          {s.gradeC}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700">
                        {s.total}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-white text-sm ${s.majorityGrade === 'A' ? 'bg-green-500' : s.majorityGrade === 'B' ? 'bg-blue-500' : 'bg-amber-500'}`}>

                          {s.majorityGrade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs italic max-w-xs">
                        {s.remark}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      }
    </div>);

}