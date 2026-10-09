import React, { useState } from 'react';
import {
  ClipboardCheck,
  Save,
  CheckCircle,
  Clock,
  Users,
  Filter,
  CheckSquare,
  Square } from
'lucide-react';
interface CollectionRecord {
  id: string;
  rollNo: string;
  name: string;
  resultStatus: 'Pass' | 'Fail' | 'Compartment';
  printStatus: 'Generated' | 'Pending';
  collectionStatus: 'Collected' | 'Not Collected';
  dateOfCollection: string;
  collectedBy: 'Parent' | 'Student' | 'Guardian' | '';
  remarks: string;
  selected: boolean;
}
const initialRecords: CollectionRecord[] = [
{
  id: '1',
  rollNo: '01',
  name: 'Advait Krishnan',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Collected',
  dateOfCollection: '2025-03-10',
  collectedBy: 'Parent',
  remarks: '',
  selected: false
},
{
  id: '2',
  rollNo: '02',
  name: 'Ananya Sharma',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  dateOfCollection: '',
  collectedBy: '',
  remarks: '',
  selected: false
},
{
  id: '3',
  rollNo: '03',
  name: 'Arjun Patel',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  dateOfCollection: '',
  collectedBy: '',
  remarks: '',
  selected: false
},
{
  id: '4',
  rollNo: '04',
  name: 'Divya Nair',
  resultStatus: 'Fail',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  dateOfCollection: '',
  collectedBy: '',
  remarks: '',
  selected: false
},
{
  id: '5',
  rollNo: '05',
  name: 'Ishaan Mehta',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Collected',
  dateOfCollection: '2025-03-11',
  collectedBy: 'Student',
  remarks: 'Collected in person',
  selected: false
},
{
  id: '6',
  rollNo: '06',
  name: 'Kavitha Pillai',
  resultStatus: 'Compartment',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  dateOfCollection: '',
  collectedBy: '',
  remarks: '',
  selected: false
},
{
  id: '7',
  rollNo: '07',
  name: 'Kiran Reddy',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Not Collected',
  dateOfCollection: '',
  collectedBy: '',
  remarks: '',
  selected: false
},
{
  id: '8',
  rollNo: '08',
  name: 'Meera Iyer',
  resultStatus: 'Pass',
  printStatus: 'Generated',
  collectionStatus: 'Collected',
  dateOfCollection: '2025-03-12',
  collectedBy: 'Guardian',
  remarks: '',
  selected: false
}];

const statusColors: Record<string, string> = {
  Pass: 'bg-green-100 text-green-700',
  Fail: 'bg-red-100 text-red-700',
  Compartment: 'bg-amber-100 text-amber-700',
  Generated: 'bg-teal-100 text-teal-700',
  Pending: 'bg-gray-100 text-gray-600',
  Collected: 'bg-green-100 text-green-700',
  'Not Collected': 'bg-red-100 text-red-700'
};
export function ReportCardCollectionEntry() {
  const [records, setRecords] = useState<CollectionRecord[]>(initialRecords);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedStd, setSelectedStd] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState('Annual Exam');
  const [saved, setSaved] = useState(false);
  const collectedCount = records.filter(
    (r) => r.collectionStatus === 'Collected'
  ).length;
  const pendingCount = records.filter(
    (r) => r.collectionStatus === 'Not Collected'
  ).length;
  const selectedCount = records.filter((r) => r.selected).length;
  const updateRecord = (
  id: string,
  field: keyof CollectionRecord,
  value: string) =>
  {
    setRecords((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      [field]: value
    } :
    r
    )
    );
  };
  const toggleSelect = (id: string) => {
    setRecords((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      selected: !r.selected
    } :
    r
    )
    );
  };
  const toggleAll = () => {
    const allSelected = records.every((r) => r.selected);
    setRecords((prev) =>
    prev.map((r) => ({
      ...r,
      selected: !allSelected
    }))
    );
  };
  const markSelectedCollected = () => {
    const today = new Date().toISOString().split('T')[0];
    setRecords((prev) =>
    prev.map((r) =>
    r.selected && r.printStatus === 'Generated' ?
    {
      ...r,
      collectionStatus: 'Collected',
      dateOfCollection: today,
      selected: false
    } :
    r
    )
    );
  };
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl text-white shadow-lg">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Report Card Collection Entry
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track which students have collected their report cards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedCount > 0 &&
          <button
            onClick={markSelectedCollected}
            className="flex items-center gap-2 px-4 py-2 border border-teal-300 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100">

              <CheckCircle className="w-4 h-4" /> Mark {selectedCount} as
              Collected
            </button>
          }
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>

            {saved ?
            <CheckCircle className="w-4 h-4" /> :

            <Save className="w-4 h-4" />
            }
            {saved ? 'Saved!' : 'Save Changes'}
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
            {records.length}
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
          <p className="text-2xl font-bold text-red-500 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Collection %
          </p>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {Math.round(collectedCount / records.length * 100)}%
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">

                {options.map((o) =>
              <option key={o}>{o}</option>
              )}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Collection Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-sm text-gray-700">

            {records.every((r) => r.selected) ?
            <CheckSquare className="w-4 h-4 text-teal-600" /> :

            <Square className="w-4 h-4 text-gray-400" />
            }
            Select All
          </button>
          <span className="text-sm text-gray-500">
            {records.length} students
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-3 w-10"></th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Roll
                </th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Student Name
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Result
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Print
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Collection Status
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Date of Collection
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Collected By
                </th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) =>
              <tr
                key={record.id}
                className={`hover:bg-gray-50 ${record.selected ? 'bg-teal-50/30' : ''}`}>

                  <td className="py-3 px-3">
                    <button onClick={() => toggleSelect(record.id)}>
                      {record.selected ?
                    <CheckSquare className="w-4 h-4 text-teal-600" /> :

                    <Square className="w-4 h-4 text-gray-400" />
                    }
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                      {record.rollNo}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-900">
                    {record.name}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[record.resultStatus]}`}>

                      {record.resultStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[record.printStatus]}`}>

                      {record.printStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <select
                    value={record.collectionStatus}
                    onChange={(e) =>
                    updateRecord(
                      record.id,
                      'collectionStatus',
                      e.target.value
                    )
                    }
                    disabled={record.printStatus === 'Pending'}
                    className={`px-2 py-1 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 ${record.collectionStatus === 'Collected' ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'} disabled:opacity-50`}>

                      <option>Collected</option>
                      <option>Not Collected</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                    type="date"
                    value={record.dateOfCollection}
                    onChange={(e) =>
                    updateRecord(
                      record.id,
                      'dateOfCollection',
                      e.target.value
                    )
                    }
                    max={new Date().toISOString().split('T')[0]}
                    disabled={record.collectionStatus === 'Not Collected'}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-40" />

                  </td>
                  <td className="py-3 px-3 text-center">
                    <select
                    value={record.collectedBy}
                    onChange={(e) =>
                    updateRecord(record.id, 'collectedBy', e.target.value)
                    }
                    disabled={record.collectionStatus === 'Not Collected'}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-40">

                      <option value="">Select</option>
                      <option>Parent</option>
                      <option>Student</option>
                      <option>Guardian</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <input
                    type="text"
                    value={record.remarks}
                    onChange={(e) =>
                    updateRecord(record.id, 'remarks', e.target.value)
                    }
                    placeholder="Add remark..."
                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />

                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}