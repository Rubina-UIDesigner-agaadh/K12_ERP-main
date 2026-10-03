import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileArchive,
  Files,
  CheckSquare,
  Square,
  Settings,
  Filter,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  FileText,
  Globe,
  Award,
  PenLine,
  Sparkles } from
'lucide-react';
interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: 'Pass' | 'Fail' | 'Compartment';
  printStatus: 'Generated' | 'Pending' | 'Regenerated';
  selected: boolean;
}
const initialStudents: Student[] = [
{
  id: '1',
  rollNo: '01',
  name: 'Advait Krishnan',
  status: 'Pass',
  printStatus: 'Generated',
  selected: false
},
{
  id: '2',
  rollNo: '02',
  name: 'Ananya Sharma',
  status: 'Pass',
  printStatus: 'Pending',
  selected: false
},
{
  id: '3',
  rollNo: '03',
  name: 'Arjun Patel',
  status: 'Pass',
  printStatus: 'Pending',
  selected: false
},
{
  id: '4',
  rollNo: '04',
  name: 'Divya Nair',
  status: 'Fail',
  printStatus: 'Pending',
  selected: false
},
{
  id: '5',
  rollNo: '05',
  name: 'Ishaan Mehta',
  status: 'Pass',
  printStatus: 'Generated',
  selected: false
},
{
  id: '6',
  rollNo: '06',
  name: 'Kavitha Pillai',
  status: 'Compartment',
  printStatus: 'Pending',
  selected: false
},
{
  id: '7',
  rollNo: '07',
  name: 'Kiran Reddy',
  status: 'Pass',
  printStatus: 'Pending',
  selected: false
},
{
  id: '8',
  rollNo: '08',
  name: 'Meera Iyer',
  status: 'Pass',
  printStatus: 'Regenerated',
  selected: false
},
{
  id: '9',
  rollNo: '09',
  name: 'Neha Gupta',
  status: 'Pass',
  printStatus: 'Pending',
  selected: false
},
{
  id: '10',
  rollNo: '10',
  name: 'Om Desai',
  status: 'Fail',
  printStatus: 'Pending',
  selected: false
}];

const statusColors: Record<string, string> = {
  Pass: 'bg-green-100 text-green-700',
  Fail: 'bg-red-100 text-red-700',
  Compartment: 'bg-amber-100 text-amber-700',
  Generated: 'bg-teal-100 text-teal-700',
  Pending: 'bg-gray-100 text-gray-600',
  Regenerated: 'bg-blue-100 text-blue-700'
};
export function BulkPrintResultCards() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [selectedStd, setSelectedStd] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const [resultFilter, setResultFilter] = useState('All');
  const [includeSignature, setIncludeSignature] = useState(true);
  const [includeGrace, setIncludeGrace] = useState(false);
  const [includeAchievements, setIncludeAchievements] = useState(true);
  const [printLanguage, setPrintLanguage] = useState('English');
  const [generating, setGenerating] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const selectedCount = students.filter((s) => s.selected).length;
  const generatedCount = students.filter(
    (s) => s.printStatus !== 'Pending'
  ).length;
  const pendingCount = students.filter(
    (s) => s.printStatus === 'Pending'
  ).length;
  const toggleAll = () => {
    const allSelected = students.every((s) => s.selected);
    setStudents((prev) =>
    prev.map((s) => ({
      ...s,
      selected: !allSelected
    }))
    );
  };
  const toggleStudent = (id: string) => {
    setStudents((prev) =>
    prev.map((s) =>
    s.id === id ?
    {
      ...s,
      selected: !s.selected
    } :
    s
    )
    );
  };
  const filteredStudents =
  resultFilter === 'All' ?
  students :
  students.filter((s) => s.status === resultFilter);
  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedAt(new Date().toLocaleString());
      setStudents((prev) =>
      prev.map((s) =>
      s.selected ?
      {
        ...s,
        printStatus: 'Generated',
        selected: false
      } :
      s
      )
      );
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <Printer className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bulk Print Result Cards
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Generate and print multiple result cards at once
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FileArchive className="w-4 h-4" /> Export as ZIP
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Files className="w-4 h-4" /> Individual Files
          </button>
          <button
            onClick={handleGenerate}
            disabled={selectedCount === 0 || generating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">

            {generating ?
            <RefreshCw className="w-4 h-4 animate-spin" /> :

            <Download className="w-4 h-4" />
            }
            {generating ? 'Generating...' : `Generate PDF (${selectedCount})`}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total Students
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {students.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Selected
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {selectedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Generated
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {generatedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {pendingCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Print Config Panel */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" /> Filters
            </h3>
            {[
            {
              label: 'Academic Year',
              value: selectedYear,
              setter: setSelectedYear,
              options: ['2024-25', '2023-24']
            },
            {
              label: 'Board',
              value: selectedBoard,
              setter: setSelectedBoard,
              options: ['CBSE', 'ICSE', 'GSEB']
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
              label: 'Exam',
              value: selectedExam,
              setter: setSelectedExam,
              options: ['Annual Exam', 'Term 1', 'Term 2']
            },
            {
              label: 'Result Status',
              value: resultFilter,
              setter: setResultFilter,
              options: ['All', 'Pass', 'Fail', 'Compartment']
            }].
            map(({ label, value, setter, options }) =>
            <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {options.map((o) =>
                <option key={o}>{o}</option>
                )}
                </select>
              </div>
            )}
          </div>

          {/* Print Config */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" /> Print Config
            </h3>
            {[
            {
              label: 'Include Signature Section',
              icon: PenLine,
              value: includeSignature,
              setter: setIncludeSignature
            },
            {
              label: 'Include Grace Details',
              icon: Sparkles,
              value: includeGrace,
              setter: setIncludeGrace
            },
            {
              label: 'Include Achievements',
              icon: Award,
              value: includeAchievements,
              setter: setIncludeAchievements
            }].
            map(({ label, icon: Icon, value, setter }) =>
            <label
              key={label}
              className="flex items-center gap-3 cursor-pointer">

                <input
                type="checkbox"
                checked={value}
                onChange={() => setter(!value)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                <span className="text-sm text-gray-700 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  {label}
                </span>
              </label>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Print Language
              </label>
              <select
                value={printLanguage}
                onChange={(e) => setPrintLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

                {['English', 'Hindi', 'Gujarati', 'Marathi'].map((l) =>
                <option key={l}>{l}</option>
                )}
              </select>
            </div>
          </div>

          {/* Generation Info */}
          {generatedAt &&
          <div className="bg-teal-50 rounded-xl border border-teal-200 p-4 text-xs space-y-1">
              <p className="font-semibold text-teal-800 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Last Generated
              </p>
              <p className="text-teal-700">{generatedAt}</p>
              <p className="text-teal-600">By: Admin User</p>
            </div>
          }
        </div>

        {/* Student List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAll}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">

                {students.every((s) => s.selected) ?
                <CheckSquare className="w-4 h-4 text-blue-600" /> :

                <Square className="w-4 h-4 text-gray-400" />
                }
                Select All
              </button>
              <span className="text-sm text-gray-500">
                {filteredStudents.length} students
              </span>
            </div>
            {selectedCount > 0 &&
            <span className="text-sm font-medium text-blue-600">
                {selectedCount} selected
              </span>
            }
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-10"></th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Roll No
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Student Name
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Result Status
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Print Status
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) =>
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50 ${student.selected ? 'bg-blue-50/40' : ''}`}>

                    <td className="py-3 px-4">
                      <button onClick={() => toggleStudent(student.id)}>
                        {student.selected ?
                      <CheckSquare className="w-4 h-4 text-blue-600" /> :

                      <Square className="w-4 h-4 text-gray-400" />
                      }
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {student.rollNo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[student.status]}`}>

                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[student.printStatus]}`}>

                        {student.printStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto">
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);

}