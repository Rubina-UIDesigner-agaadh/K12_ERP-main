import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  Plus,
  Edit2,
  AlertTriangle,
  History,
  Archive,
  MoreVertical,
  X } from
'lucide-react';

// Mock Accounting Years Data
const INITIAL_YEARS = [
{
  id: 'FY-2425',
  name: '2024-2025',
  startDate: '2024-04-01',
  endDate: '2025-03-31',
  status: 'Active',
  isCurrent: true
},
{
  id: 'FY-2324',
  name: '2023-2024',
  startDate: '2023-04-01',
  endDate: '2024-03-31',
  status: 'Closed',
  isCurrent: false
},
{
  id: 'FY-2223',
  name: '2022-2023',
  startDate: '2022-04-01',
  endDate: '2023-03-31',
  status: 'Locked',
  isCurrent: false
}];


export function AccountingYearMaster() {
  const [years, setYears] = useState(INITIAL_YEARS);
  const [showModal, setShowModal] = useState(false);
  const [editingYear, setEditingYear] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':return <Badge variant="success" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'Closed':return <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">Closed</Badge>;
      case 'Locked':return <Badge variant="danger" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</Badge>;
      default:return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Accounting Year Master
          </h1>
          <p className="text-gray-500 text-sm">Define fiscal periods and manage transaction locking for audits.</p>
        </div>
        <Button
          onClick={() => {setEditingYear(null);setShowModal(true);}}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100">

          <Plus className="w-4 h-4 mr-2" /> New Financial Year
        </Button>
      </div>

      {/* Overlap Warning (Validation Logic Feedback) */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Date Validation Note</p>
          <p className="text-xs text-amber-700 mt-1">
            New financial years cannot overlap with existing periods. Ensure "Locked" years are audited before closing.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Year Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Start Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">End Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Current?</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {years.map((year) =>
              <tr key={year.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${year.status === 'Locked' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        <History className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900">FY {year.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{year.startDate}</td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{year.endDate}</td>
                  <td className="p-4">{getStatusBadge(year.status)}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {year.isCurrent ?
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div> :

                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        </div>
                    }
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => {setEditingYear(year);setShowModal(true);}}
                      disabled={year.status === 'Locked'}>

                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal / Inline Add Form Overlay */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl border-none animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                {editingYear ? 'Update Financial Year' : 'Create Financial Year'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Financial Year Name</label>
                <Input placeholder="e.g. 2025-2026" defaultValue={editingYear?.name} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                  <Input type="date" defaultValue={editingYear?.startDate} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</label>
                  <Input type="date" defaultValue={editingYear?.endDate} />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <label className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-emerald-600" defaultChecked={editingYear?.isCurrent} />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Set as Current Active Year</p>
                    <p className="text-[10px] text-emerald-600">Only one financial year can be "Current" at a time.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-red-600" defaultChecked={editingYear?.status === 'Locked'} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-red-900">Lock Financial Year</p>
                      <Lock className="w-3 h-3 text-red-600" />
                    </div>
                    <p className="text-[10px] text-red-600">Locked years prevent all new entries and edits for auditing.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3 border-t">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="bg-emerald-600 px-6">
                {editingYear ? 'Save Changes' : 'Create Year'}
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}