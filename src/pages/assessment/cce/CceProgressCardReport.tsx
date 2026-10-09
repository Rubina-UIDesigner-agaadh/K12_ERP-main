import React, { useState } from 'react';
import { PrinterIcon, DownloadIcon, EyeIcon, FilterIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
interface StudentReport {
  rollNo: string;
  name: string;
  class: string;
  section: string;
  standard: string;
  subjectGrades: {
    subject: string;
    indicators: {
      name: string;
      grade: 'A' | 'B' | 'C';
    }[];
  }[];
  personalitySkills: {
    category: string;
    indicators: {
      name: string;
      grade: 'A' | 'B' | 'C';
    }[];
  }[];
  termSummary?: {
    gradeA: number;
    gradeB: number;
    gradeC: number;
    majorityGrade: 'A' | 'B' | 'C';
    remark: string;
  };
  teacherRemark: string;
}
const SAMPLE_STD1_REPORT: StudentReport = {
  rollNo: '01',
  name: 'Aarav Sharma',
  class: '1',
  section: 'A',
  standard: '1',
  subjectGrades: [
  {
    subject: 'Language (English)',
    indicators: [
    {
      name: 'Follows Instructions',
      grade: 'A'
    },
    {
      name: 'Reads 4-letter words',
      grade: 'A'
    },
    {
      name: 'Writes letters clearly',
      grade: 'B'
    },
    {
      name: 'Understands simple sentences',
      grade: 'A'
    }]

  },
  {
    subject: 'Mathematics',
    indicators: [
    {
      name: 'Identifies numbers up to 100',
      grade: 'A'
    },
    {
      name: 'Counts objects up to 20',
      grade: 'A'
    },
    {
      name: 'Draws basic shapes',
      grade: 'B'
    }]

  },
  {
    subject: 'Environmental Studies',
    indicators: [
    {
      name: 'Recognizes shapes and colors',
      grade: 'A'
    },
    {
      name: 'Identifies body parts',
      grade: 'A'
    },
    {
      name: 'Participates in group activities',
      grade: 'B'
    }]

  }],

  personalitySkills: [],
  termSummary: {
    gradeA: 14,
    gradeB: 4,
    gradeC: 2,
    majorityGrade: 'A',
    remark: 'Outstanding performance. Keep it up!'
  },
  teacherRemark:
  'Aarav is a bright and enthusiastic student. Shows excellent understanding of concepts.'
};
const SAMPLE_STD5_REPORT: StudentReport = {
  rollNo: '05',
  name: 'Priya Patel',
  class: '5',
  section: 'B',
  standard: '5',
  subjectGrades: [
  {
    subject: 'Mathematics',
    indicators: [
    {
      name: 'Problem Solving',
      grade: 'A'
    },
    {
      name: 'Numerical Ability',
      grade: 'A'
    }]

  },
  {
    subject: 'Science',
    indicators: [
    {
      name: 'Concept Understanding',
      grade: 'B'
    },
    {
      name: 'Lab Work',
      grade: 'A'
    }]

  },
  {
    subject: 'English',
    indicators: [
    {
      name: 'Reading Comprehension',
      grade: 'A'
    },
    {
      name: 'Writing Skills',
      grade: 'B'
    }]

  }],

  personalitySkills: [
  {
    category: 'Discipline',
    indicators: [
    {
      name: 'Maintains discipline in class',
      grade: 'A'
    }]

  },
  {
    category: 'Communication',
    indicators: [
    {
      name: 'Communicates ideas effectively',
      grade: 'A'
    }]

  },
  {
    category: 'Leadership',
    indicators: [
    {
      name: 'Shows leadership qualities',
      grade: 'B'
    },
    {
      name: 'Takes initiative',
      grade: 'A'
    }]

  },
  {
    category: 'Creativity',
    indicators: [
    {
      name: 'Demonstrates creative thinking',
      grade: 'A'
    }]

  },
  {
    category: 'Teamwork',
    indicators: [
    {
      name: 'Works well in teams',
      grade: 'A'
    }]

  },
  {
    category: 'Life Skills',
    indicators: [
    {
      name: 'Manages time effectively',
      grade: 'B'
    }]

  }],

  termSummary: undefined,
  teacherRemark:
  'Priya demonstrates excellent academic ability and strong interpersonal skills.'
};
const GRADE_COLORS = {
  A: 'bg-green-100 text-green-700 border-green-200',
  B: 'bg-blue-100 text-blue-700 border-blue-200',
  C: 'bg-amber-100 text-amber-700 border-amber-200'
};
export function CceProgressCardReport() {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [standard, setStandard] = useState('1');
  const [section, setSection] = useState('A');
  const [term, setTerm] = useState('Term 1');
  const [selectedStudent, setSelectedStudent] = useState<string>('01');
  const [previewMode, setPreviewMode] = useState(false);
  const isStd12 = ['1', '2'].includes(standard);
  const report = isStd12 ? SAMPLE_STD1_REPORT : SAMPLE_STD5_REPORT;
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CCE Progress Card Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isStd12 ?
            'CCE-compliant progress card with subject-wise indicator grid and term summary for Std 1–2' :
            'Holistic progress card with academic marks and personality skills for Std 3–8'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode((p) => !p)}
            className="flex items-center gap-2">

            <EyeIcon className="w-4 h-4" />
            {previewMode ? 'Hide Preview' : 'Preview Card'}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            Export PDF
          </Button>
          <Button className="flex items-center gap-2">
            <PrinterIcon className="w-4 h-4" />
            Print All
          </Button>
        </div>
      </div>

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

        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 text-sm">Student List</h3>
          <Badge variant={isStd12 ? 'blue' : 'purple'}>
            {isStd12 ? 'CCE Format (Std 1–2)' : 'Holistic Format (Std 3–8)'}
          </Badge>
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
                <th className="text-center px-4 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
              {
                rollNo: '01',
                name: 'Aarav Sharma',
                status: 'ready'
              },
              {
                rollNo: '02',
                name: 'Priya Patel',
                status: 'ready'
              },
              {
                rollNo: '03',
                name: 'Rohan Mehta',
                status: 'ready'
              },
              {
                rollNo: '04',
                name: 'Ananya Singh',
                status: 'pending'
              },
              {
                rollNo: '05',
                name: 'Karan Joshi',
                status: 'ready'
              }].
              map((student) =>
              <tr
                key={student.rollNo}
                className={`hover:bg-gray-50 ${selectedStudent === student.rollNo ? 'bg-blue-50' : ''}`}>

                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {student.rollNo}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {student.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                    variant={student.status === 'ready' ? 'green' : 'yellow'}>

                      {student.status === 'ready' ? 'Ready' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                    onClick={() => {
                      setSelectedStudent(student.rollNo);
                      setPreviewMode(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline">

                      Preview
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Card Preview */}
      {previewMode &&
      <div className="bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 text-center">
            <h2 className="text-xl font-bold">PROGRESS REPORT CARD</h2>
            <p className="text-blue-200 text-sm mt-1">
              Continuous and Comprehensive Evaluation (CCE)
            </p>
            <p className="text-blue-200 text-sm">
              Academic Year: {academicYear} | {term}
            </p>
          </div>

          {/* Student Info */}
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs font-medium">
                  Student Name
                </p>
                <p className="font-bold text-gray-800 mt-0.5">{report.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium">
                  Class & Section
                </p>
                <p className="font-bold text-gray-800 mt-0.5">
                  Std {report.class} – {report.section}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium">Roll Number</p>
                <p className="font-bold text-gray-800 mt-0.5">
                  {report.rollNo}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium">Term</p>
                <p className="font-bold text-gray-800 mt-0.5">{term}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Section 1: Subject-Wise Indicator Grid */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Subject-Wise Skill Indicators
              </h3>
              <div className="space-y-3">
                {report.subjectGrades.map((sg) =>
              <div
                key={sg.subject}
                className="border border-gray-200 rounded-lg overflow-hidden">

                    <div className="bg-blue-50 px-3 py-2 border-b border-gray-200">
                      <p className="font-semibold text-blue-800 text-sm">
                        {sg.subject}
                      </p>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {sg.indicators.map((ind) =>
                    <div
                      key={ind.name}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">

                            <span className="text-xs text-gray-700 flex-1 mr-2">
                              {ind.name}
                            </span>
                            <span
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 ${GRADE_COLORS[ind.grade]}`}>

                              {ind.grade}
                            </span>
                          </div>
                    )}
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>

            {/* Section 2: Term-End Summary (Std 1-2 only) */}
            {isStd12 && report.termSummary &&
          <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Term-End Summary
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4 text-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Total Indicators
                      </p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        20
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">
                        Grade A
                      </p>
                      <p className="text-2xl font-bold text-green-700 mt-1">
                        {report.termSummary.gradeA}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">
                        Grade B
                      </p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        {report.termSummary.gradeB}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-medium">
                        Grade C
                      </p>
                      <p className="text-2xl font-bold text-amber-700 mt-1">
                        {report.termSummary.gradeC}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Overall Grade
                      </p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">
                        {report.termSummary.remark}
                      </p>
                    </div>
                    <span
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black text-white ${report.termSummary.majorityGrade === 'A' ? 'bg-green-500' : report.termSummary.majorityGrade === 'B' ? 'bg-blue-500' : 'bg-amber-500'}`}>

                      {report.termSummary.majorityGrade}
                    </span>
                  </div>
                </div>
              </div>
          }

            {/* Section 2/3: Personality Skills (Std 3-8) */}
            {!isStd12 && report.personalitySkills.length > 0 &&
          <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Personality & Life Skills
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-purple-700">
                          Category
                        </th>
                        <th className="text-left px-4 py-2 font-semibold text-purple-700">
                          Indicator
                        </th>
                        <th className="text-center px-4 py-2 font-semibold text-purple-700">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {report.personalitySkills.flatMap((ps) =>
                  ps.indicators.map((ind, i) =>
                  <tr
                    key={`${ps.category}-${ind.name}`}
                    className="hover:bg-gray-50">

                            <td className="px-4 py-2 text-gray-600 text-xs">
                              {i === 0 ? ps.category : ''}
                            </td>
                            <td className="px-4 py-2 text-gray-800">
                              {ind.name}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span
                        className={`w-7 h-7 rounded-lg border inline-flex items-center justify-center text-xs font-bold ${GRADE_COLORS[ind.grade]}`}>

                                {ind.grade}
                              </span>
                            </td>
                          </tr>
                  )
                  )}
                    </tbody>
                  </table>
                </div>
              </div>
          }

            {/* Teacher Remarks */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-bold">
                  {isStd12 ? '3' : '3'}
                </span>
                Teacher's Remarks
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700 italic">
                  "{report.teacherRemark}"
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-t border-gray-200 pt-4 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
              <div>
                <div className="border-b border-gray-300 mb-1 pb-6" />
                <p>Class Teacher</p>
              </div>
              <div>
                <div className="border-b border-gray-300 mb-1 pb-6" />
                <p>Principal</p>
              </div>
              <div>
                <div className="border-b border-gray-300 mb-1 pb-6" />
                <p>Parent / Guardian</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}