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
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle } from
'lucide-react';
interface PayrollPeriod {
  id: string;
  periodCode: string;
  periodName: string;
  startDate: string;
  endDate: string;
  lockDate: string;
  financialYear: string;
  isProcessed: boolean;
  isLocked: boolean;
  status: 'Active' | 'Inactive';
}
interface PayrollCalendar {
  id: string;
  calendarName: string;
  frequency: 'Monthly' | 'Weekly' | 'Bi-weekly' | 'Custom';
  financialYear: string;
  periods: PayrollPeriod[];
  status: 'Active' | 'Inactive';
}
const mockCalendars: PayrollCalendar[] = [
{
  id: 'PC001',
  calendarName: 'Monthly Payroll 2025-26',
  frequency: 'Monthly',
  financialYear: 'FY 2025-26',
  status: 'Active',
  periods: [
  {
    id: 'PP001',
    periodCode: 'APR-2025',
    periodName: 'April 2025',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    lockDate: '2025-05-05',
    financialYear: 'FY 2025-26',
    isProcessed: true,
    isLocked: true,
    status: 'Active'
  },
  {
    id: 'PP002',
    periodCode: 'MAY-2025',
    periodName: 'May 2025',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    lockDate: '2025-06-05',
    financialYear: 'FY 2025-26',
    isProcessed: true,
    isLocked: true,
    status: 'Active'
  },
  {
    id: 'PP003',
    periodCode: 'JUN-2025',
    periodName: 'June 2025',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    lockDate: '2025-07-05',
    financialYear: 'FY 2025-26',
    isProcessed: false,
    isLocked: false,
    status: 'Active'
  },
  {
    id: 'PP004',
    periodCode: 'JUL-2025',
    periodName: 'July 2025',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    lockDate: '2025-08-05',
    financialYear: 'FY 2025-26',
    isProcessed: false,
    isLocked: false,
    status: 'Active'
  }]

},
{
  id: 'PC002',
  calendarName: 'Monthly Payroll 2024-25',
  frequency: 'Monthly',
  financialYear: 'FY 2024-25',
  status: 'Inactive',
  periods: [
  {
    id: 'PP010',
    periodCode: 'APR-2024',
    periodName: 'April 2024',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    lockDate: '2024-05-05',
    financialYear: 'FY 2024-25',
    isProcessed: true,
    isLocked: true,
    status: 'Active'
  }]

}];

const emptyCalendarForm = {
  calendarName: '',
  frequency: 'Monthly' as PayrollCalendar['frequency'],
  financialYear: 'FY 2025-26'
};
const emptyPeriodForm = {
  periodCode: '',
  periodName: '',
  startDate: '',
  endDate: '',
  lockDate: '',
  financialYear: 'FY 2025-26'
};
export function PayrollCalendarPeriodMaster() {
  const [calendars, setCalendars] = useState(mockCalendars);
  const [selectedCalendarId, setSelectedCalendarId] = useState('PC001');
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [editCalendarId, setEditCalendarId] = useState<string | null>(null);
  const [editPeriodId, setEditPeriodId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [calendarForm, setCalendarForm] = useState(emptyCalendarForm);
  const [periodForm, setPeriodForm] = useState(emptyPeriodForm);
  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);
  const filteredPeriods = (selectedCalendar?.periods || []).filter(
    (p) =>
    p.periodName.toLowerCase().includes(search.toLowerCase()) ||
    p.periodCode.toLowerCase().includes(search.toLowerCase())
  );
  const totalPeriods = calendars.reduce((sum, c) => sum + c.periods.length, 0);
  const processedPeriods = calendars.reduce(
    (sum, c) => sum + c.periods.filter((p) => p.isProcessed).length,
    0
  );
  const lockedPeriods = calendars.reduce(
    (sum, c) => sum + c.periods.filter((p) => p.isLocked).length,
    0
  );
  const handleSaveCalendar = () => {
    if (editCalendarId) {
      setCalendars((prev) =>
      prev.map((c) =>
      c.id === editCalendarId ?
      {
        ...c,
        ...calendarForm
      } :
      c
      )
      );
    } else {
      const newCal: PayrollCalendar = {
        ...calendarForm,
        id: `PC${Date.now()}`,
        periods: [],
        status: 'Active'
      };
      setCalendars((prev) => [...prev, newCal]);
    }
    setCalendarForm(emptyCalendarForm);
    setShowCalendarForm(false);
    setEditCalendarId(null);
  };
  const handleSavePeriod = () => {
    if (!selectedCalendarId) return;
    if (editPeriodId) {
      setCalendars((prev) =>
      prev.map((c) =>
      c.id === selectedCalendarId ?
      {
        ...c,
        periods: c.periods.map((p) =>
        p.id === editPeriodId ?
        {
          ...p,
          ...periodForm
        } :
        p
        )
      } :
      c
      )
      );
    } else {
      const newPeriod: PayrollPeriod = {
        ...periodForm,
        id: `PP${Date.now()}`,
        isProcessed: false,
        isLocked: false,
        status: 'Active'
      };
      setCalendars((prev) =>
      prev.map((c) =>
      c.id === selectedCalendarId ?
      {
        ...c,
        periods: [...c.periods, newPeriod]
      } :
      c
      )
      );
    }
    setPeriodForm(emptyPeriodForm);
    setShowPeriodForm(false);
    setEditPeriodId(null);
  };
  const handleAutoGenerate = () => {
    if (!selectedCalendarId) return;
    const months = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March'];

    const year1 = 2025;
    const year2 = 2026;
    const newPeriods: PayrollPeriod[] = months.map((m, i) => {
      const yr = i < 9 ? year1 : year2;
      const monthNum = (i + 3) % 12 + 1;
      const startDate = `${yr}-${String(monthNum).padStart(2, '0')}-01`;
      const endDate = new Date(yr, monthNum, 0);
      const endDateStr = `${yr}-${String(monthNum).padStart(2, '0')}-${endDate.getDate()}`;
      const lockDate = `${monthNum === 12 ? yr + 1 : yr}-${String(monthNum === 12 ? 1 : monthNum + 1).padStart(2, '0')}-05`;
      return {
        id: `PP_AUTO_${i}`,
        periodCode: `${m.substring(0, 3).toUpperCase()}-${yr}`,
        periodName: `${m} ${yr}`,
        startDate,
        endDate: endDateStr,
        lockDate,
        financialYear: 'FY 2025-26',
        isProcessed: false,
        isLocked: false,
        status: 'Active' as const
      };
    });
    setCalendars((prev) =>
    prev.map((c) =>
    c.id === selectedCalendarId ?
    {
      ...c,
      periods: newPeriods
    } :
    c
    )
    );
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payroll Calendar / Period Master
          </h1>
          <p className="text-sm text-gray-500">
            Define payroll processing periods and lock dates
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setCalendarForm(emptyCalendarForm);
            setShowCalendarForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          New Calendar
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{calendars.length}</p>
            <p className="text-xs text-gray-500">Calendars</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalPeriods}</p>
            <p className="text-xs text-gray-500">Total Periods</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{processedPeriods}</p>
            <p className="text-xs text-gray-500">Processed</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{lockedPeriods}</p>
            <p className="text-xs text-gray-500">Locked Periods</p>
          </div>
        </div>
      </div>

      {showCalendarForm &&
      <Card title={editCalendarId ? 'Edit Calendar' : 'New Payroll Calendar'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Calendar Name *"
            value={calendarForm.calendarName}
            onChange={(e) =>
            setCalendarForm({
              ...calendarForm,
              calendarName: e.target.value
            })
            }
            placeholder="e.g., Monthly Payroll 2025-26" />

            <Select
            label="Frequency *"
            options={[
            {
              value: 'Monthly',
              label: 'Monthly'
            },
            {
              value: 'Weekly',
              label: 'Weekly'
            },
            {
              value: 'Bi-weekly',
              label: 'Bi-weekly'
            },
            {
              value: 'Custom',
              label: 'Custom'
            }]
            }
            value={calendarForm.frequency}
            onChange={(e) =>
            setCalendarForm({
              ...calendarForm,
              frequency: e.target.value as any
            })
            } />

            <Select
            label="Financial Year *"
            options={[
            {
              value: 'FY 2025-26',
              label: 'FY 2025-26'
            },
            {
              value: 'FY 2024-25',
              label: 'FY 2024-25'
            }]
            }
            value={calendarForm.financialYear}
            onChange={(e) =>
            setCalendarForm({
              ...calendarForm,
              financialYear: e.target.value
            })
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSaveCalendar}>
              <Save className="w-4 h-4 mr-2" />
              {editCalendarId ? 'Update' : 'Create'} Calendar
            </Button>
            <Button
            variant="outline"
            onClick={() => {
              setShowCalendarForm(false);
              setEditCalendarId(null);
            }}>

              Cancel
            </Button>
          </div>
        </Card>
      }

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <Card title="Calendars">
            <div className="space-y-2">
              {calendars.map((c) =>
              <button
                key={c.id}
                onClick={() => setSelectedCalendarId(c.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedCalendarId === c.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200 hover:bg-gray-50'}`}>

                  <p className="text-sm font-semibold text-gray-900">
                    {c.calendarName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                    variant={c.status === 'Active' ? 'success' : 'secondary'}>

                      {c.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{c.frequency}</span>
                  </div>
                </button>
              )}
            </div>
          </Card>
        </div>
        <div className="col-span-9">
          <Card
            title={
            selectedCalendar ?
            `Periods – ${selectedCalendar.calendarName}` :
            'Select a Calendar'
            }>

            {selectedCalendar &&
            <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search periods..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                  </div>
                  <Button variant="outline" onClick={handleAutoGenerate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Auto-Generate
                  </Button>
                  <Button
                  variant="primary"
                  onClick={() => {
                    setPeriodForm(emptyPeriodForm);
                    setShowPeriodForm(true);
                  }}>

                    <Plus className="w-4 h-4 mr-2" />
                    Add Period
                  </Button>
                </div>
                {showPeriodForm &&
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input
                    label="Period Code *"
                    value={periodForm.periodCode}
                    onChange={(e) =>
                    setPeriodForm({
                      ...periodForm,
                      periodCode: e.target.value
                    })
                    }
                    placeholder="e.g., APR-2025" />

                      <Input
                    label="Period Name *"
                    value={periodForm.periodName}
                    onChange={(e) =>
                    setPeriodForm({
                      ...periodForm,
                      periodName: e.target.value
                    })
                    }
                    placeholder="e.g., April 2025" />

                      <Input
                    label="Start Date *"
                    type="date"
                    value={periodForm.startDate}
                    onChange={(e) =>
                    setPeriodForm({
                      ...periodForm,
                      startDate: e.target.value
                    })
                    } />

                      <Input
                    label="End Date *"
                    type="date"
                    value={periodForm.endDate}
                    onChange={(e) =>
                    setPeriodForm({
                      ...periodForm,
                      endDate: e.target.value
                    })
                    } />

                      <Input
                    label="Lock Date"
                    type="date"
                    value={periodForm.lockDate}
                    onChange={(e) =>
                    setPeriodForm({
                      ...periodForm,
                      lockDate: e.target.value
                    })
                    } />

                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={handleSavePeriod}>
                        <Save className="w-4 h-4 mr-2" />
                        {editPeriodId ? 'Update' : 'Add'} Period
                      </Button>
                      <Button
                    variant="outline"
                    onClick={() => {
                      setShowPeriodForm(false);
                      setEditPeriodId(null);
                    }}>

                        Cancel
                      </Button>
                    </div>
                  </div>
              }
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          Period
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          Start
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          End
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          Lock Date
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          Processed
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          Locked
                        </th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPeriods.map((p, i) =>
                    <tr
                      key={p.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                          <td className="py-3 px-4">
                            <p className="text-sm font-semibold text-gray-900">
                              {p.periodName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.periodCode}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">
                            {p.startDate}
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">
                            {p.endDate}
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">
                            {p.lockDate}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                          variant={p.isProcessed ? 'success' : 'secondary'}>

                              {p.isProcessed ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {p.isLocked ?
                        <Lock className="w-4 h-4 text-red-500 mx-auto" /> :

                        <Unlock className="w-4 h-4 text-green-500 mx-auto" />
                        }
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
              </>
            }
          </Card>
        </div>
      </div>
    </div>);

}