import React, { useState } from 'react';
import {
  Printer,
  Download,
  Search,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  X,
  AlertCircle } from
'lucide-react';
interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  status: 'Pass' | 'Fail' | 'Compartment';
  hasReExam: boolean;
  reprintCount: number;
  reprintLimit: number;
  printStatus: 'Generated' | 'Pending';
}
const studentList: StudentRecord[] = [
{
  id: '1',
  rollNo: '01',
  name: 'Advait Krishnan',
  class: '10',
  section: 'A',
  status: 'Pass',
  hasReExam: false,
  reprintCount: 0,
  reprintLimit: 2,
  printStatus: 'Generated'
},
{
  id: '2',
  rollNo: '02',
  name: 'Ananya Sharma',
  class: '10',
  section: 'A',
  status: 'Pass',
  hasReExam: false,
  reprintCount: 1,
  reprintLimit: 2,
  printStatus: 'Generated'
},
{
  id: '3',
  rollNo: '03',
  name: 'Arjun Patel',
  class: '10',
  section: 'A',
  status: 'Fail',
  hasReExam: true,
  reprintCount: 0,
  reprintLimit: 2,
  printStatus: 'Pending'
},
{
  id: '4',
  rollNo: '04',
  name: 'Divya Nair',
  class: '10',
  section: 'A',
  status: 'Pass',
  hasReExam: false,
  reprintCount: 2,
  reprintLimit: 2,
  printStatus: 'Generated'
},
{
  id: '5',
  rollNo: '05',
  name: 'Ishaan Mehta',
  class: '10',
  section: 'A',
  status: 'Compartment',
  hasReExam: true,
  reprintCount: 0,
  reprintLimit: 2,
  printStatus: 'Pending'
},
{
  id: '6',
  rollNo: '06',
  name: 'Kavitha Pillai',
  class: '10',
  section: 'A',
  status: 'Pass',
  hasReExam: false,
  reprintCount: 0,
  reprintLimit: 2,
  printStatus: 'Generated'
}];

const statusColors: Record<string, string> = {
  Pass: 'bg-green-100 text-green-700 border-green-200',
  Fail: 'bg-red-100 text-red-700 border-red-200',
  Compartment: 'bg-amber-100 text-amber-700 border-amber-200'
};
export function SingleStudentPrint() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null
  );
  const [printOption, setPrintOption] = useState<'main' | 'reexam' | 'latest'>(
    'latest'
  );
  const [showReprintDialog, setShowReprintDialog] = useState(false);
  const [reprintReason, setReprintReason] = useState('');
  const filtered = studentList.filter(
    (s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search)
  );
  const handlePrint = () => {
    if (
    selectedStudent &&
    selectedStudent.reprintCount >= selectedStudent.reprintLimit)
    {
      setShowReprintDialog(true);
    } else {
      alert('Printing result card...');
    }
  };
  const handleReprintConfirm = () => {
    if (!reprintReason.trim()) return;
    setShowReprintDialog(false);
    setReprintReason('');
    alert('Reprint logged and initiated.');
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-lg">
          <Printer className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Single Student Print
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Print or export one student's result card individually
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Student Search */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />

            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {filtered.map((student) =>
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${selectedStudent?.id === student.id ? 'bg-violet-50 border-l-4 border-violet-500' : ''}`}>

                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-700 font-bold text-sm">
                    {student.rollNo}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Class {student.class}-{student.section}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[student.status]}`}>

                    {student.status}
                  </span>
                  {student.reprintCount >= student.reprintLimit &&
                <span className="text-xs text-red-500 flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" /> Limit reached
                    </span>
                }
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Print Panel */}
        <div className="space-y-4">
          {selectedStudent ?
          <>
              {/* Student Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Class {selectedStudent.class}-{selectedStudent.section} |
                      Roll No. {selectedStudent.rollNo}
                    </p>
                  </div>
                  <span
                  className={`ml-auto px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedStudent.status]}`}>

                    {selectedStudent.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Print Status</p>
                    <p
                    className={`font-medium mt-0.5 ${selectedStudent.printStatus === 'Generated' ? 'text-teal-700' : 'text-amber-700'}`}>

                      {selectedStudent.printStatus}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Reprint Count</p>
                    <p
                    className={`font-medium mt-0.5 ${selectedStudent.reprintCount >= selectedStudent.reprintLimit ? 'text-red-600' : 'text-gray-900'}`}>

                      {selectedStudent.reprintCount} /{' '}
                      {selectedStudent.reprintLimit}
                    </p>
                  </div>
                </div>
                {selectedStudent.reprintCount >=
              selectedStudent.reprintLimit &&
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">
                      Reprint limit reached. A reason is required to proceed
                      with additional reprints.
                    </p>
                  </div>
              }
              </div>

              {/* Print Options */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                  Print Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <input
                    type="radio"
                    name="printOption"
                    value="main"
                    checked={printOption === 'main'}
                    onChange={() => setPrintOption('main')}
                    className="text-violet-600" />

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Main Exam Result
                      </p>
                      <p className="text-xs text-gray-500">
                        Print the original exam result card
                      </p>
                    </div>
                  </label>
                  {selectedStudent.hasReExam &&
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <input
                    type="radio"
                    name="printOption"
                    value="reexam"
                    checked={printOption === 'reexam'}
                    onChange={() => setPrintOption('reexam')}
                    className="text-violet-600" />

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Re-Exam Result
                        </p>
                        <p className="text-xs text-gray-500">
                          Print the re-exam / supplementary result card
                        </p>
                      </div>
                    </label>
                }
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-violet-300 bg-violet-50">
                    <input
                    type="radio"
                    name="printOption"
                    value="latest"
                    checked={printOption === 'latest'}
                    onChange={() => setPrintOption('latest')}
                    className="text-violet-600" />

                    <div>
                      <p className="text-sm font-medium text-violet-800">
                        Latest Final Result
                      </p>
                      <p className="text-xs text-violet-600">
                        Print the most recent finalized result card
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700">

                  <Printer className="w-4 h-4" /> Print
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </> :

          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Select a student from the list to view print options
              </p>
            </div>
          }
        </div>
      </div>

      {/* Reprint Confirmation Dialog */}
      {showReprintDialog &&
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Reprint
                Confirmation
              </h3>
              <button
              onClick={() => setShowReprintDialog(false)}
              className="p-1 hover:bg-gray-100 rounded-lg">

                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This student has reached the reprint limit (
              {selectedStudent?.reprintLimit} reprints). Please provide a reason
              to proceed.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Reprint *
              </label>
              <textarea
              value={reprintReason}
              onChange={(e) => setReprintReason(e.target.value)}
              placeholder="Enter reason for additional reprint..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />

            </div>
            <div className="flex gap-3">
              <button
              onClick={() => setShowReprintDialog(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">

                Cancel
              </button>
              <button
              onClick={handleReprintConfirm}
              disabled={!reprintReason.trim()}
              className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50">

                Confirm Reprint
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}