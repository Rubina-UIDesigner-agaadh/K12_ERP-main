import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Calendar,
  Copy,
  Upload } from
'lucide-react';
interface WeeklyOffPattern {
  id: string;
  name: string;
  campus: string;
  staffTypes: string[];
  offDays: string[];
  monthlyVariation: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Inactive';
}
interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'National' | 'Festival' | 'Institutional' | 'Exam' | 'Other';
  recurrence: 'One-time' | 'Annual';
  isPaid: boolean;
  applicableTo: string[];
  treatAsWorking: boolean;
  status: 'Active' | 'Inactive';
}
interface SpecialDay {
  id: string;
  date: string;
  description: string;
  appliesTo: string[];
  overrideType: 'Off-to-Working' | 'Working-to-Off';
}
const mockWeeklyOffPatterns: WeeklyOffPattern[] = [
{
  id: 'WO001',
  name: 'Standard Weekly Off',
  campus: 'Main Campus',
  staffTypes: ['Teaching', 'Administrative'],
  offDays: ['Sunday'],
  monthlyVariation: 'None',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
},
{
  id: 'WO002',
  name: 'Alternate Saturday Off',
  campus: 'Main Campus',
  staffTypes: ['Teaching'],
  offDays: ['Sunday', '2nd Saturday', '4th Saturday'],
  monthlyVariation: '2nd & 4th Saturday',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
}];

const mockHolidays: Holiday[] = [
{
  id: 'H001',
  date: '2024-01-26',
  name: 'Republic Day',
  type: 'National',
  recurrence: 'Annual',
  isPaid: true,
  applicableTo: ['All Staff', 'Students'],
  treatAsWorking: false,
  status: 'Active'
},
{
  id: 'H002',
  date: '2024-08-15',
  name: 'Independence Day',
  type: 'National',
  recurrence: 'Annual',
  isPaid: true,
  applicableTo: ['All Staff', 'Students'],
  treatAsWorking: false,
  status: 'Active'
},
{
  id: 'H003',
  date: '2024-10-02',
  name: 'Gandhi Jayanti',
  type: 'National',
  recurrence: 'Annual',
  isPaid: true,
  applicableTo: ['All Staff', 'Students'],
  treatAsWorking: false,
  status: 'Active'
},
{
  id: 'H004',
  date: '2024-10-24',
  name: 'Diwali',
  type: 'Festival',
  recurrence: 'Annual',
  isPaid: true,
  applicableTo: ['All Staff', 'Students'],
  treatAsWorking: false,
  status: 'Active'
}];

const mockSpecialDays: SpecialDay[] = [
{
  id: 'SD001',
  date: '2024-12-15',
  description: 'Annual Day Preparation',
  appliesTo: ['Teaching Staff'],
  overrideType: 'Off-to-Working'
}];

export function WorkingCalendarMaster() {
  const [activeTab, setActiveTab] = useState('weekly-off');
  const [weeklyOffPatterns, setWeeklyOffPatterns] = useState(
    mockWeeklyOffPatterns
  );
  const [holidays, setHolidays] = useState(mockHolidays);
  const [specialDays, setSpecialDays] = useState(mockSpecialDays);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [weeklyOffForm, setWeeklyOffForm] = useState({
    name: '',
    campus: 'Main Campus',
    staffTypes: [] as string[],
    offDays: [] as string[],
    monthlyVariation: 'None',
    effectiveFrom: '',
    effectiveTo: ''
  });
  const [holidayForm, setHolidayForm] = useState({
    date: '',
    name: '',
    type: 'Festival' as const,
    recurrence: 'One-time' as const,
    isPaid: true,
    applicableTo: [] as string[],
    treatAsWorking: false
  });
  const [specialDayForm, setSpecialDayForm] = useState({
    date: '',
    description: '',
    appliesTo: [] as string[],
    overrideType: 'Off-to-Working' as const
  });
  const resetForms = () => {
    setWeeklyOffForm({
      name: '',
      campus: 'Main Campus',
      staffTypes: [],
      offDays: [],
      monthlyVariation: 'None',
      effectiveFrom: '',
      effectiveTo: ''
    });
    setHolidayForm({
      date: '',
      name: '',
      type: 'Festival',
      recurrence: 'One-time',
      isPaid: true,
      applicableTo: [],
      treatAsWorking: false
    });
    setSpecialDayForm({
      date: '',
      description: '',
      appliesTo: [],
      overrideType: 'Off-to-Working'
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSaveWeeklyOff = () => {
    if (editId) {
      setWeeklyOffPatterns((prev) =>
      prev.map((w) =>
      w.id === editId ?
      {
        ...w,
        ...weeklyOffForm
      } :
      w
      )
      );
    } else {
      setWeeklyOffPatterns((prev) => [
      ...prev,
      {
        ...weeklyOffForm,
        id: `WO${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleSaveHoliday = () => {
    if (editId) {
      setHolidays((prev) =>
      prev.map((h) =>
      h.id === editId ?
      {
        ...h,
        ...holidayForm
      } :
      h
      )
      );
    } else {
      setHolidays((prev) => [
      ...prev,
      {
        ...holidayForm,
        id: `H${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForms();
  };
  const handleSaveSpecialDay = () => {
    if (editId) {
      setSpecialDays((prev) =>
      prev.map((s) =>
      s.id === editId ?
      {
        ...s,
        ...specialDayForm
      } :
      s
      )
      );
    } else {
      setSpecialDays((prev) => [
      ...prev,
      {
        ...specialDayForm,
        id: `SD${Date.now()}`
      }]
      );
    }
    resetForms();
  };
  const tabs = [
  {
    id: 'weekly-off',
    label: 'Weekly Off Patterns'
  },
  {
    id: 'holidays',
    label: 'Holiday Calendar'
  },
  {
    id: 'special-days',
    label: 'Special Working Days'
  }];

  const filteredWeeklyOff = weeklyOffPatterns.filter((w) =>
  w.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredHolidays = holidays.filter((h) =>
  h.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSpecialDays = specialDays.filter((s) =>
  s.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Working Calendar Master
          </h1>
          <p className="text-sm text-gray-500">
            Unified management of weekly offs, holidays, and special working
            days
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetForms();
              setShowForm(true);
            }}>

            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{weeklyOffPatterns.length}</p>
            <p className="text-xs text-gray-500">Weekly Off Patterns</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{holidays.length}</p>
            <p className="text-xs text-gray-500">Holidays</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{specialDays.length}</p>
            <p className="text-xs text-gray-500">Special Days</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card
        title={
        editId ?
        `Edit ${activeTab === 'weekly-off' ? 'Weekly Off Pattern' : activeTab === 'holidays' ? 'Holiday' : 'Special Day'}` :
        `Add New ${activeTab === 'weekly-off' ? 'Weekly Off Pattern' : activeTab === 'holidays' ? 'Holiday' : 'Special Day'}`
        }>

          {activeTab === 'weekly-off' &&
        <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Pattern Name *"
              value={weeklyOffForm.name}
              onChange={(e) =>
              setWeeklyOffForm({
                ...weeklyOffForm,
                name: e.target.value
              })
              }
              placeholder="e.g., Standard Weekly Off" />

                <Select
              label="Campus *"
              options={[
              {
                value: 'Main Campus',
                label: 'Main Campus'
              },
              {
                value: 'Branch Campus',
                label: 'Branch Campus'
              }]
              }
              value={weeklyOffForm.campus}
              onChange={(e) =>
              setWeeklyOffForm({
                ...weeklyOffForm,
                campus: e.target.value
              })
              } />

                <Input
              label="Monthly Variation"
              value={weeklyOffForm.monthlyVariation}
              onChange={(e) =>
              setWeeklyOffForm({
                ...weeklyOffForm,
                monthlyVariation: e.target.value
              })
              }
              placeholder="e.g., 2nd & 4th Saturday" />

                <div />
                <Input
              label="Effective From"
              type="date"
              value={weeklyOffForm.effectiveFrom}
              onChange={(e) =>
              setWeeklyOffForm({
                ...weeklyOffForm,
                effectiveFrom: e.target.value
              })
              } />

                <Input
              label="Effective To"
              type="date"
              value={weeklyOffForm.effectiveTo}
              onChange={(e) =>
              setWeeklyOffForm({
                ...weeklyOffForm,
                effectiveTo: e.target.value
              })
              } />

              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveWeeklyOff}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
        }

          {activeTab === 'holidays' &&
        <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Date *"
              type="date"
              value={holidayForm.date}
              onChange={(e) =>
              setHolidayForm({
                ...holidayForm,
                date: e.target.value
              })
              } />

                <Input
              label="Holiday Name *"
              value={holidayForm.name}
              onChange={(e) =>
              setHolidayForm({
                ...holidayForm,
                name: e.target.value
              })
              }
              placeholder="e.g., Republic Day" />

                <Select
              label="Type *"
              options={[
              {
                value: 'National',
                label: 'National'
              },
              {
                value: 'Festival',
                label: 'Festival'
              },
              {
                value: 'Institutional',
                label: 'Institutional'
              },
              {
                value: 'Exam',
                label: 'Exam'
              },
              {
                value: 'Other',
                label: 'Other'
              }]
              }
              value={holidayForm.type}
              onChange={(e) =>
              setHolidayForm({
                ...holidayForm,
                type: e.target.value as any
              })
              } />

                <Select
              label="Recurrence"
              options={[
              {
                value: 'One-time',
                label: 'One-time'
              },
              {
                value: 'Annual',
                label: 'Annual'
              }]
              }
              value={holidayForm.recurrence}
              onChange={(e) =>
              setHolidayForm({
                ...holidayForm,
                recurrence: e.target.value as any
              })
              } />

                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={holidayForm.isPaid}
                  onChange={(e) =>
                  setHolidayForm({
                    ...holidayForm,
                    isPaid: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">Paid Holiday</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                  type="checkbox"
                  checked={holidayForm.treatAsWorking}
                  onChange={(e) =>
                  setHolidayForm({
                    ...holidayForm,
                    treatAsWorking: e.target.checked
                  })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">
                      Treat as Working Day (for specific groups)
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveHoliday}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
        }

          {activeTab === 'special-days' &&
        <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
              label="Date *"
              type="date"
              value={specialDayForm.date}
              onChange={(e) =>
              setSpecialDayForm({
                ...specialDayForm,
                date: e.target.value
              })
              } />

                <Select
              label="Override Type *"
              options={[
              {
                value: 'Off-to-Working',
                label: 'Off Day → Working Day'
              },
              {
                value: 'Working-to-Off',
                label: 'Working Day → Off Day'
              }]
              }
              value={specialDayForm.overrideType}
              onChange={(e) =>
              setSpecialDayForm({
                ...specialDayForm,
                overrideType: e.target.value as any
              })
              } />

                <div className="col-span-2">
                  <Input
                label="Description *"
                value={specialDayForm.description}
                onChange={(e) =>
                setSpecialDayForm({
                  ...specialDayForm,
                  description: e.target.value
                })
                }
                placeholder="e.g., Annual Day Preparation" />

                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSaveSpecialDay}>
                  <Save className="w-4 h-4 mr-2" />
                  {editId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  Cancel
                </Button>
              </div>
            </>
        }
        </Card>
      }

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>

          {activeTab === 'weekly-off' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Pattern Name
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Campus
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Off Days
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Variation
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
                  {filteredWeeklyOff.map((w, i) =>
                <tr
                  key={w.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {w.name}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {w.campus}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {w.offDays.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {w.monthlyVariation}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      w.status === 'Active' ? 'success' : 'secondary'
                      }>

                          {w.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="Clone">

                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
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
          }

          {activeTab === 'holidays' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Holiday Name
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Recurrence
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Paid
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
                  {filteredHolidays.map((h, i) =>
                <tr
                  key={h.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {new Date(h.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {h.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      h.type === 'National' ?
                      'info' :
                      h.type === 'Festival' ?
                      'success' :
                      'secondary'
                      }>

                          {h.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">
                        {h.recurrence}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={h.isPaid ? 'success' : 'secondary'}>
                          {h.isPaid ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      h.status === 'Active' ? 'success' : 'secondary'
                      }>

                          {h.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
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
          }

          {activeTab === 'special-days' &&
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Description
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Override Type
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpecialDays.map((s, i) =>
                <tr
                  key={s.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {new Date(s.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {s.description}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                      variant={
                      s.overrideType === 'Off-to-Working' ?
                      'success' :
                      'warning'
                      }>

                          {s.overrideType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        className="p-1.5 hover:bg-blue-100 rounded-lg"
                        title="Edit">

                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
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
          }
        </div>
      </Card>
    </div>);

}