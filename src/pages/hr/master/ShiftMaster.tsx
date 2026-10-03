import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Clock,
  Copy,
  Moon } from
'lucide-react';
interface Shift {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  totalHours: number;
  graceLateComing: number;
  graceEarlyGoing: number;
  halfDayCriteria: string;
  isNightShift: boolean;
  applicableStaffTypes: string[];
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Inactive';
}
const mockShifts: Shift[] = [
{
  id: 'SH001',
  code: 'GEN',
  name: 'General Shift',
  startTime: '09:00',
  endTime: '17:00',
  breakStart: '13:00',
  breakEnd: '14:00',
  totalHours: 7,
  graceLateComing: 15,
  graceEarlyGoing: 10,
  halfDayCriteria: '4-6 hours',
  isNightShift: false,
  applicableStaffTypes: ['Teaching', 'Administrative'],
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
},
{
  id: 'SH002',
  code: 'MORN',
  name: 'Morning Shift',
  startTime: '07:00',
  endTime: '15:00',
  breakStart: '11:00',
  breakEnd: '12:00',
  totalHours: 7,
  graceLateComing: 10,
  graceEarlyGoing: 10,
  halfDayCriteria: '4-6 hours',
  isNightShift: false,
  applicableStaffTypes: ['Support Staff'],
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
},
{
  id: 'SH003',
  code: 'EVE',
  name: 'Evening Shift',
  startTime: '15:00',
  endTime: '23:00',
  breakStart: '19:00',
  breakEnd: '20:00',
  totalHours: 7,
  graceLateComing: 10,
  graceEarlyGoing: 10,
  halfDayCriteria: '4-6 hours',
  isNightShift: false,
  applicableStaffTypes: ['Support Staff'],
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
},
{
  id: 'SH004',
  code: 'NIGHT',
  name: 'Night Shift',
  startTime: '23:00',
  endTime: '07:00',
  breakStart: '03:00',
  breakEnd: '04:00',
  totalHours: 7,
  graceLateComing: 15,
  graceEarlyGoing: 15,
  halfDayCriteria: '4-6 hours',
  isNightShift: true,
  applicableStaffTypes: ['Security', 'Support Staff'],
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
}];

export function ShiftMaster() {
  const [shifts, setShifts] = useState(mockShifts);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    startTime: '',
    endTime: '',
    breakStart: '',
    breakEnd: '',
    graceLateComing: 15,
    graceEarlyGoing: 10,
    halfDayCriteria: '',
    isNightShift: false,
    applicableStaffTypes: [] as string[],
    effectiveFrom: '',
    effectiveTo: ''
  });
  const calculateTotalHours = (
  start: string,
  end: string,
  breakStart: string,
  breakEnd: string) =>
  {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let totalMinutes = eh * 60 + em - (sh * 60 + sm);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    if (breakStart && breakEnd) {
      const [bsh, bsm] = breakStart.split(':').map(Number);
      const [beh, bem] = breakEnd.split(':').map(Number);
      const breakMinutes = beh * 60 + bem - (bsh * 60 + bsm);
      totalMinutes -= breakMinutes;
    }
    return Math.round(totalMinutes / 60 * 10) / 10;
  };
  const filtered = shifts.filter(
    (s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      startTime: '',
      endTime: '',
      breakStart: '',
      breakEnd: '',
      graceLateComing: 15,
      graceEarlyGoing: 10,
      halfDayCriteria: '',
      isNightShift: false,
      applicableStaffTypes: [],
      effectiveFrom: '',
      effectiveTo: ''
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    const totalHours = calculateTotalHours(
      form.startTime,
      form.endTime,
      form.breakStart,
      form.breakEnd
    );
    if (editId) {
      setShifts((prev) =>
      prev.map((s) =>
      s.id === editId ?
      {
        ...s,
        ...form,
        totalHours
      } :
      s
      )
      );
    } else {
      setShifts((prev) => [
      ...prev,
      {
        ...form,
        id: `SH${Date.now()}`,
        totalHours,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (shift: Shift) => {
    setForm({
      code: shift.code,
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakStart: shift.breakStart,
      breakEnd: shift.breakEnd,
      graceLateComing: shift.graceLateComing,
      graceEarlyGoing: shift.graceEarlyGoing,
      halfDayCriteria: shift.halfDayCriteria,
      isNightShift: shift.isNightShift,
      applicableStaffTypes: shift.applicableStaffTypes,
      effectiveFrom: shift.effectiveFrom,
      effectiveTo: shift.effectiveTo
    });
    setEditId(shift.id);
    setShowForm(true);
  };
  const handleClone = (shift: Shift) => {
    setForm({
      code: `${shift.code}_COPY`,
      name: `${shift.name} (Copy)`,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakStart: shift.breakStart,
      breakEnd: shift.breakEnd,
      graceLateComing: shift.graceLateComing,
      graceEarlyGoing: shift.graceEarlyGoing,
      halfDayCriteria: shift.halfDayCriteria,
      isNightShift: shift.isNightShift,
      applicableStaffTypes: shift.applicableStaffTypes,
      effectiveFrom: '',
      effectiveTo: ''
    });
    setShowForm(true);
  };
  const handleDelete = (id: string) =>
  setShifts((prev) => prev.filter((s) => s.id !== id));
  const currentTotalHours = calculateTotalHours(
    form.startTime,
    form.endTime,
    form.breakStart,
    form.breakEnd
  );
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Master</h1>
          <p className="text-sm text-gray-500">
            Configure work shifts and timings
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Shift
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{shifts.length}</p>
            <p className="text-xs text-gray-500">Total Shifts</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {shifts.filter((s) => s.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Moon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {shifts.filter((s) => s.isNightShift).length}
            </p>
            <p className="text-xs text-gray-500">Night Shifts</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {(
              shifts.reduce((sum, s) => sum + s.totalHours, 0) / shifts.length).
              toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">Avg Hours</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Shift' : 'Add New Shift'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Shift Code *"
            value={form.code}
            onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value
            })
            }
            placeholder="e.g., GEN" />

            <Input
            label="Shift Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., General Shift" />

            <Input
            label="Start Time *"
            type="time"
            value={form.startTime}
            onChange={(e) =>
            setForm({
              ...form,
              startTime: e.target.value
            })
            } />

            <Input
            label="End Time *"
            type="time"
            value={form.endTime}
            onChange={(e) =>
            setForm({
              ...form,
              endTime: e.target.value
            })
            } />

            <Input
            label="Break Start Time"
            type="time"
            value={form.breakStart}
            onChange={(e) =>
            setForm({
              ...form,
              breakStart: e.target.value
            })
            } />

            <Input
            label="Break End Time"
            type="time"
            value={form.breakEnd}
            onChange={(e) =>
            setForm({
              ...form,
              breakEnd: e.target.value
            })
            } />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">
                Total Working Hours
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {currentTotalHours} hrs
              </p>
            </div>
            <div />
            <Input
            label="Grace Time - Late Coming (minutes)"
            type="number"
            value={form.graceLateComing}
            onChange={(e) =>
            setForm({
              ...form,
              graceLateComing: parseInt(e.target.value) || 0
            })
            } />

            <Input
            label="Grace Time - Early Going (minutes)"
            type="number"
            value={form.graceEarlyGoing}
            onChange={(e) =>
            setForm({
              ...form,
              graceEarlyGoing: parseInt(e.target.value) || 0
            })
            } />

            <Input
            label="Half-Day Criteria"
            value={form.halfDayCriteria}
            onChange={(e) =>
            setForm({
              ...form,
              halfDayCriteria: e.target.value
            })
            }
            placeholder="e.g., 4-6 hours" />

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isNightShift}
                onChange={(e) =>
                setForm({
                  ...form,
                  isNightShift: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">Night Shift</span>
              </label>
            </div>
            <Input
            label="Effective From"
            type="date"
            value={form.effectiveFrom}
            onChange={(e) =>
            setForm({
              ...form,
              effectiveFrom: e.target.value
            })
            } />

            <Input
            label="Effective To"
            type="date"
            value={form.effectiveTo}
            onChange={(e) =>
            setForm({
              ...form,
              effectiveTo: e.target.value
            })
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Shift
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shifts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Shift
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Timing
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Break
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Total Hours
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Grace (min)
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) =>
              <tr
                key={s.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-500">{s.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {s.startTime} - {s.endTime}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {s.breakStart && s.breakEnd ?
                  `${s.breakStart} - ${s.breakEnd}` :
                  '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                      {s.totalHours}h
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    +{s.graceLateComing} / -{s.graceEarlyGoing}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {s.isNightShift ?
                  <Badge variant="secondary">
                        <Moon className="w-3 h-3 mr-1" />
                        Night
                      </Badge> :

                  <Badge variant="info">Day</Badge>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={s.status === 'Active' ? 'success' : 'secondary'}>

                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(s)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleClone(s)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Clone">

                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                      title="Delete">

                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}