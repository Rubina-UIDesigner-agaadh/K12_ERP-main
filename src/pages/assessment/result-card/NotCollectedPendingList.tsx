import React, { useState } from 'react';
import {
  Clock,
  Download,
  Phone,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  Search,
  RefreshCw } from
'lucide-react';
interface PendingStudent {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  resultStatus: 'Pass' | 'Fail' | 'Compartment';
  printStatus: 'Generated' | 'Pending';
  collectionStatus: 'Not Collected';
  daysSince: number;
  contact: string;
}
const pendingStudents: PendingStudent[] = [
{
  id: '2',
  rollNo: '02',
  name: 'Ananya Sharma',
  class: '10-A',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 8,
  contact: '98765 43210'
},
{
  id: '3',
  rollNo: '03',
  name: 'Arjun Patel',
  class: '10-A',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 8,
  contact: '98765 43211'
},
{
  id: '4',
  rollNo: '04',
  name: 'Divya Nair',
  class: '10-A',
  resultStatus: 'Fail',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 8,
  contact: '98765 43212'
},
{
  id: '6',
  rollNo: '06',
  name: 'Kavitha Pillai',
  class: '10-A',
  resultStatus: 'Compartment',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 8,
  contact: '98765 43214'
},
{
  id: '7',
  rollNo: '07',
  name: 'Kiran Reddy',
  class: '10-A',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 5,
  contact: '98765 43215'
},
{
  id: '9',
  rollNo: '09',
  name: 'Neha Gupta',
  class: '10-A',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 3,
  contact: '98765 43217'
},
{
  id: '10',
  rollNo: '10',
  name: 'Om Desai',
  class: '10-A',
  resultStatus: 'Fail',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  daysSince: 8,
  contact: '98765 43218'
}];

const resultStatusColors: Record<string, string> = {
  Pass: 'bg-green-100 text-green-700',
  Fail: 'bg-red-100 text-red-700',
  Compartment: 'bg-amber-100 text-amber-700'
};
export function NotCollectedPendingList() {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedStd, setSelectedStd] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const [resultFilter, setResultFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<PendingStudent[]>(pendingStudents);
  const filtered = students.filter((s) => {
    const matchesStatus =
    resultFilter === 'All' || s.resultStatus === resultFilter;
    const matchesSearch =
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search);
    return matchesStatus && matchesSearch;
  });
  const urgentCount = students.filter((s) => s.daysSince >= 7).length;
  const markCollected = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl text-white shadow-lg">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Not Collected / Pending List
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track students who have not yet collected their report cards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export Pending List
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total Students
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">42</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Collected
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {42 - students.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {students.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Overdue (7+ days)
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {urgentCount}
          </p>
        </div>
      </div>

      {urgentCount > 0 &&
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {urgentCount} students have not collected for 7+ days
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Consider sending reminders to parents/guardians for overdue
              collections.
            </p>
          </div>
        </div>
      }

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
          {
            label: 'Academic Year',
            value: selectedYear,
            setter: setSelectedYear,
            options: ['2024-25', '2023-24']
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500">

                {options.map((o) =>
              <option key={o}>{o}</option>
              )}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name or Roll No..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />

            </div>
          </div>
        </div>
      </div>

      {/* Pending Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Pending Collection List
          </h3>
          <span className="text-sm text-gray-500">
            {filtered.length} students
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
                  Collection Status
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Days Since Distribution
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contact
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student) =>
              <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      {student.rollNo}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${resultStatusColors[student.resultStatus]}`}>

                      {student.resultStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                      {student.printStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Not Collected
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${student.daysSince >= 7 ? 'text-red-600' : student.daysSince >= 4 ? 'text-amber-600' : 'text-gray-700'}`}>

                      {student.daysSince >= 7 &&
                    <AlertCircle className="w-3.5 h-3.5" />
                    }
                      {student.daysSince} days
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />{' '}
                      {student.contact}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                    onClick={() => markCollected(student.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 mx-auto">

                      <CheckCircle className="w-3.5 h-3.5" /> Mark Collected
                    </button>
                  </td>
                </tr>
              )}
              {filtered.length === 0 &&
              <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-300" />
                    <p className="text-sm">
                      All students have collected their report cards!
                    </p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}