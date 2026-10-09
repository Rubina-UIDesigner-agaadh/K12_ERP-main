import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckSquare,
  Square,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  FileUp,
  AlertCircle,
  Download,
  RefreshCw,
  Users } from
'lucide-react';
interface Student {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  collectionStatus: 'Collected' | 'Not Collected';
  selected: boolean;
}
const initialStudents: Student[] = [
{
  id: '1',
  rollNo: '01',
  name: 'Advait Krishnan',
  class: '10-A',
  collectionStatus: 'Collected',
  selected: false
},
{
  id: '2',
  rollNo: '02',
  name: 'Ananya Sharma',
  class: '10-A',
  collectionStatus: 'Not Collected',
  selected: false
},
{
  id: '3',
  rollNo: '03',
  name: 'Arjun Patel',
  class: '10-A',
  collectionStatus: 'Not Collected',
  selected: false
},
{
  id: '4',
  rollNo: '04',
  name: 'Divya Nair',
  class: '10-A',
  collectionStatus: 'Not Collected',
  selected: false
},
{
  id: '5',
  rollNo: '05',
  name: 'Ishaan Mehta',
  class: '10-A',
  collectionStatus: 'Collected',
  selected: false
},
{
  id: '6',
  rollNo: '06',
  name: 'Kavitha Pillai',
  class: '10-A',
  collectionStatus: 'Not Collected',
  selected: false
},
{
  id: '7',
  rollNo: '07',
  name: 'Kiran Reddy',
  class: '10-A',
  collectionStatus: 'Not Collected',
  selected: false
},
{
  id: '8',
  rollNo: '08',
  name: 'Meera Iyer',
  class: '10-A',
  collectionStatus: 'Collected',
  selected: false
}];

export function BulkCollectionUpdate() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedStd, setSelectedStd] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const [bulkDate, setBulkDate] = useState('');
  const [bulkRemark, setBulkRemark] = useState('');
  const [uploadResult, setUploadResult] = useState<{
    matched: number;
    unmatched: string[];
  } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedCount = students.filter((s) => s.selected).length;
  const collectedCount = students.filter(
    (s) => s.collectionStatus === 'Collected'
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
  const markSelected = (status: 'Collected' | 'Not Collected') => {
    setStudents((prev) =>
    prev.map((s) =>
    s.selected ?
    {
      ...s,
      collectionStatus: status,
      selected: false
    } :
    s
    )
    );
    setLastUpdated(`${new Date().toLocaleString()} by Admin User`);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setTimeout(() => {
        setUploadResult({
          matched: 6,
          unmatched: ['Roll No. 11 - Not Found', 'Roll No. 15 - Not Found']
        });
      }, 800);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white shadow-lg">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bulk Collection Update
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Update report card collection status in bulk
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Download Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {students.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Selected
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {selectedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Collected
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {collectedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {students.length - collectedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          }].
          map(({ label, value, setter, options }) =>
          <div key={label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
              </label>
              <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">

                {options.map((o) =>
              <option key={o}>{o}</option>
              )}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bulk Actions Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">
              Bulk Actions
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Collection Date
              </label>
              <input
                type="date"
                value={bulkDate}
                onChange={(e) => setBulkDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Common Remark
              </label>
              <input
                type="text"
                value={bulkRemark}
                onChange={(e) => setBulkRemark(e.target.value)}
                placeholder="Add remark for all selected..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

            </div>
            <div className="space-y-2">
              <button
                onClick={() => markSelected('Collected')}
                disabled={selectedCount === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">

                <CheckCircle className="w-4 h-4" /> Mark{' '}
                {selectedCount > 0 ? selectedCount : ''} as Collected
              </button>
              <button
                onClick={() => markSelected('Not Collected')}
                disabled={selectedCount === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50">

                <XCircle className="w-4 h-4" /> Mark as Not Collected
              </button>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" /> Import via File
            </h3>
            <p className="text-xs text-gray-500">
              Upload a CSV file with Roll No and Collection Status columns.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden" />

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50">

              <FileUp className="w-4 h-4" /> Choose CSV File
            </button>
            {uploadResult &&
            <div className="space-y-2">
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> {uploadResult.matched}{' '}
                  records matched and updated
                </div>
                {uploadResult.unmatched.length > 0 &&
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <p className="flex items-center gap-1.5 font-medium mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />{' '}
                      {uploadResult.unmatched.length} unmatched records:
                    </p>
                    {uploadResult.unmatched.map((u) =>
                <p key={u} className="ml-5">
                        • {u}
                      </p>
                )}
                  </div>
              }
              </div>
            }
          </div>

          {/* Log Info */}
          {lastUpdated &&
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-xs">
              <p className="font-semibold text-blue-800 flex items-center gap-1.5 mb-1">
                <RefreshCw className="w-3.5 h-3.5" /> Last Updated
              </p>
              <p className="text-blue-700">{lastUpdated}</p>
            </div>
          }
        </div>

        {/* Student List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-sm text-gray-700">

              {students.every((s) => s.selected) ?
              <CheckSquare className="w-4 h-4 text-indigo-600" /> :

              <Square className="w-4 h-4 text-gray-400" />
              }
              Select All
            </button>
            <span className="text-sm text-gray-500">
              {students.length} students
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {students.map((student) =>
            <div
              key={student.id}
              className={`flex items-center gap-4 px-5 py-3 hover:bg-gray-50 ${student.selected ? 'bg-indigo-50/30' : ''}`}>

                <button onClick={() => toggleStudent(student.id)}>
                  {student.selected ?
                <CheckSquare className="w-4 h-4 text-indigo-600" /> :

                <Square className="w-4 h-4 text-gray-400" />
                }
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-700 font-bold text-xs">
                    {student.rollNo}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">Class {student.class}</p>
                </div>
                <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${student.collectionStatus === 'Collected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>

                  {student.collectionStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}