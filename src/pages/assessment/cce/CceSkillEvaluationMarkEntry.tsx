import React, { useState } from 'react';
import {
  SaveIcon,
  LockIcon,
  UnlockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  DownloadIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
type Grade = 'A' | 'B' | 'C' | '';
interface Student {
  rollNo: string;
  name: string;
  grades: Record<string, Grade>;
}
interface Indicator {
  id: string;
  code: string;
  name: string;
  skillCategory?: string;
}
const STD12_INDICATORS: Indicator[] = [
{
  id: '1',
  code: 'SS-01',
  name: 'Follows Instructions'
},
{
  id: '2',
  code: 'SS-02',
  name: 'Reads 4-letter words'
},
{
  id: '3',
  code: 'SS-03',
  name: 'Identifies numbers up to 100'
},
{
  id: '4',
  code: 'SS-04',
  name: 'Participates in group activities'
},
{
  id: '5',
  code: 'SS-05',
  name: 'Writes letters clearly'
},
{
  id: '6',
  code: 'SS-06',
  name: 'Recognizes shapes and colors'
},
{
  id: '7',
  code: 'SS-07',
  name: 'Counts objects up to 20'
},
{
  id: '8',
  code: 'SS-08',
  name: 'Identifies body parts'
},
{
  id: '9',
  code: 'SS-09',
  name: 'Understands simple sentences'
},
{
  id: '10',
  code: 'SS-10',
  name: 'Draws basic shapes'
}];

const STD38_INDICATORS: Indicator[] = [
{
  id: '1',
  code: 'PS-01',
  name: 'Maintains discipline in class',
  skillCategory: 'Discipline'
},
{
  id: '2',
  code: 'PS-02',
  name: 'Communicates ideas effectively',
  skillCategory: 'Communication'
},
{
  id: '3',
  code: 'PS-03',
  name: 'Shows leadership qualities',
  skillCategory: 'Leadership'
},
{
  id: '4',
  code: 'PS-04',
  name: 'Demonstrates creative thinking',
  skillCategory: 'Creativity'
},
{
  id: '5',
  code: 'PS-05',
  name: 'Works well in teams',
  skillCategory: 'Teamwork'
},
{
  id: '6',
  code: 'PS-06',
  name: 'Manages time effectively',
  skillCategory: 'Life Skills'
},
{
  id: '7',
  code: 'PS-07',
  name: 'Shows empathy towards peers',
  skillCategory: 'Life Skills'
},
{
  id: '8',
  code: 'PS-08',
  name: 'Takes initiative in activities',
  skillCategory: 'Leadership'
}];

const SAMPLE_STUDENTS: Student[] = [
{
  rollNo: '01',
  name: 'Aarav Sharma',
  grades: {}
},
{
  rollNo: '02',
  name: 'Priya Patel',
  grades: {}
},
{
  rollNo: '03',
  name: 'Rohan Mehta',
  grades: {}
},
{
  rollNo: '04',
  name: 'Ananya Singh',
  grades: {}
},
{
  rollNo: '05',
  name: 'Karan Joshi',
  grades: {}
},
{
  rollNo: '06',
  name: 'Divya Nair',
  grades: {}
}];

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-300',
  B: 'bg-blue-100 text-blue-700 border-blue-300',
  C: 'bg-amber-100 text-amber-700 border-amber-300',
  '': 'bg-white text-gray-400 border-gray-200'
};
const GRADE_CYCLE: Grade[] = ['', 'A', 'B', 'C'];
export function CceSkillEvaluationMarkEntry() {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [standard, setStandard] = useState('1');
  const [section, setSection] = useState('A');
  const [term, setTerm] = useState('Term 1');
  const [subject, setSubject] = useState('Language (English)');
  const [students, setStudents] = useState<Student[]>(SAMPLE_STUDENTS);
  const [isLocked, setIsLocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const isStd12 = ['1', '2'].includes(standard);
  const indicators = isStd12 ? STD12_INDICATORS : STD38_INDICATORS;
  function cycleGrade(studentIdx: number, indicatorId: string) {
    if (isLocked) return;
    setStudents((prev) => {
      const updated = [...prev];
      const student = {
        ...updated[studentIdx]
      };
      const current = student.grades[indicatorId] || '';
      const nextIdx =
      (GRADE_CYCLE.indexOf(current as Grade) + 1) % GRADE_CYCLE.length;
      student.grades = {
        ...student.grades,
        [indicatorId]: GRADE_CYCLE[nextIdx]
      };
      updated[studentIdx] = student;
      return updated;
    });
    setSaved(false);
  }
  function setGradeForAll(indicatorId: string, grade: Grade) {
    if (isLocked) return;
    setStudents((prev) =>
    prev.map((s) => ({
      ...s,
      grades: {
        ...s.grades,
        [indicatorId]: grade
      }
    }))
    );
    setSaved(false);
  }
  function getCompletionCount(student: Student) {
    return indicators.filter(
      (ind) => student.grades[ind.id] && student.grades[ind.id] !== ''
    ).length;
  }
  function getGradeSummary(student: Student) {
    const grades = Object.values(student.grades);
    return {
      A: grades.filter((g) => g === 'A').length,
      B: grades.filter((g) => g === 'B').length,
      C: grades.filter((g) => g === 'C').length
    };
  }
  const totalComplete = students.filter(
    (s) => getCompletionCount(s) === indicators.length
  ).length;
  const overallProgress =
  students.length > 0 ?
  Math.round(
    students.reduce((sum, s) => sum + getCompletionCount(s), 0) / (
    students.length * indicators.length) *
    100
  ) :
  0;
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Skill Evaluation Mark Entry
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isStd12 ?
            'Subject-based skill evaluation for Std 1–2 (Grade A/B/C per indicator)' :
            'Personality & Life Skills evaluation for Std 3–8'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsLocked((l) => !l)}
            className="flex items-center gap-2">

            {isLocked ?
            <UnlockIcon className="w-4 h-4" /> :

            <LockIcon className="w-4 h-4" />
            }
            {isLocked ? 'Unlock' : 'Lock Entry'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLocked}
            className="flex items-center gap-2">

            <SaveIcon className="w-4 h-4" />
            Save Grades
          </Button>
        </div>
      </div>

      {isLocked &&
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-amber-700 text-sm">
          <LockIcon className="w-4 h-4" />
          Mark entry is locked. Unlock to make changes.
        </div>
      }

      {saved &&
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-sm">
          <CheckCircleIcon className="w-4 h-4" />
          Grades saved successfully!
        </div>
      }

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            label="Standard"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            options={['1', '2', '3', '4', '5', '6', '7', '8'].map((s) => ({
              value: s,
              label: `Std ${s}`
            }))} />

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

          {isStd12 &&
          <Select
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={[
            'Language (English)',
            'Language (Hindi)',
            'Mathematics',
            'Environmental Studies'].
            map((s) => ({
              value: s,
              label: s
            }))} />

          }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total Students
          </p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {students.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Fully Completed
          </p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {totalComplete}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Indicators
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {indicators.length}
          </p>
          {isStd12 && indicators.length < 20 &&
          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircleIcon className="w-3 h-3" /> Need 20 for term summary
            </p>
          }
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Overall Progress
          </p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {overallProgress}%
          </p>
          <div className="mt-2 bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all"
              style={{
                width: `${overallProgress}%`
              }} />

          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">
              Grade Entry — Std {standard}
              {section} | {term}
              {isStd12 && ` | ${subject}`}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Click a cell to cycle: (blank) → A → B → C → (blank)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-green-100 border border-green-300 inline-block" />{' '}
              A = Excellent
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-blue-100 border border-blue-300 inline-block" />{' '}
              B = Good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300 inline-block" />{' '}
              C = Needs Improvement
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 bg-gray-50 text-left px-3 py-2 font-semibold text-gray-600 min-w-[60px] border-r border-gray-200">
                  Roll
                </th>
                <th className="sticky left-[60px] bg-gray-50 text-left px-3 py-2 font-semibold text-gray-600 min-w-[160px] border-r border-gray-200">
                  Student Name
                </th>
                {indicators.map((ind) =>
                <th
                  key={ind.id}
                  className="px-2 py-2 font-medium text-gray-600 min-w-[80px] text-center border-r border-gray-100">

                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono text-xs text-gray-400">
                        {ind.code}
                      </span>
                      <span
                      className="text-xs leading-tight text-center max-w-[70px]"
                      title={ind.name}>

                        {ind.name.length > 12 ?
                      ind.name.slice(0, 12) + '…' :
                      ind.name}
                      </span>
                      {ind.skillCategory &&
                    <span className="text-xs text-purple-500">
                          {ind.skillCategory}
                        </span>
                    }
                      <div className="flex gap-0.5 mt-1">
                        {(['A', 'B', 'C'] as Grade[]).map((g) =>
                      <button
                        key={g}
                        onClick={() => setGradeForAll(ind.id, g)}
                        disabled={isLocked}
                        className={`text-xs px-1 py-0.5 rounded border font-bold transition-colors disabled:opacity-40 ${GRADE_COLORS[g]}`}>

                            {g}
                          </button>
                      )}
                      </div>
                    </div>
                  </th>
                )}
                <th className="px-3 py-2 font-semibold text-gray-600 min-w-[100px] text-center">
                  Summary
                </th>
                <th className="px-3 py-2 font-semibold text-gray-600 min-w-[80px] text-center">
                  Done
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, sIdx) => {
                const summary = getGradeSummary(student);
                const done = getCompletionCount(student);
                return (
                  <tr key={student.rollNo} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white px-3 py-2 font-mono text-xs text-gray-600 border-r border-gray-200">
                      {student.rollNo}
                    </td>
                    <td className="sticky left-[60px] bg-white px-3 py-2 font-medium text-gray-800 border-r border-gray-200 whitespace-nowrap">
                      {student.name}
                    </td>
                    {indicators.map((ind) => {
                      const grade = student.grades[ind.id] || '';
                      return (
                        <td
                          key={ind.id}
                          className="px-2 py-2 text-center border-r border-gray-100">

                          <button
                            onClick={() => cycleGrade(sIdx, ind.id)}
                            disabled={isLocked}
                            className={`w-8 h-8 rounded-lg border-2 font-bold text-sm transition-all disabled:cursor-not-allowed ${grade ? GRADE_COLORS[grade] : 'bg-gray-50 text-gray-300 border-gray-200 hover:border-gray-400'}`}>

                            {grade || '—'}
                          </button>
                        </td>);

                    })}
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs">
                        <span className="text-green-600 font-semibold">
                          A:{summary.A}
                        </span>
                        <span className="text-blue-600 font-semibold">
                          B:{summary.B}
                        </span>
                        <span className="text-amber-600 font-semibold">
                          C:{summary.C}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`text-xs font-semibold ${done === indicators.length ? 'text-green-600' : 'text-gray-500'}`}>

                        {done}/{indicators.length}
                      </span>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {isStd12 && indicators.length < 20 &&
          <span className="text-amber-600 flex items-center gap-1 text-sm">
              <AlertCircleIcon className="w-4 h-4" />
              Term-End Summary requires all 20 indicators to be filled.
            </span>
          }
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            Export to Excel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLocked}
            className="flex items-center gap-2">

            <SaveIcon className="w-4 h-4" />
            Save All Grades
          </Button>
        </div>
      </div>
    </div>);

}