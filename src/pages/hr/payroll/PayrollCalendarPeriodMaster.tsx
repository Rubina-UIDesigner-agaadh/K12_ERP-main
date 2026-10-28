import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Edit, Trash2, Save, Search, Calendar, Lock, Unlock, RefreshCw, CheckCircle } from 'lucide-react';
import {
  generateMissingPeriods,
  loadPayrollPolicyConfig,
  periodOverlaps,
  savePayrollPolicyConfig,
  subscribePayrollPolicyConfig,
  type PayrollCalendarRecord,
  type PayrollPeriodRecord,
  type PayrollPeriodStatus
} from './PayrollSetup';

const emptyCalendarForm = { calendarName: '', frequency: 'Monthly' as PayrollCalendarRecord['frequency'], financialYear: 'FY 2026-27', fyStart: '2026-04-01', fyEnd: '2027-03-31' };
const emptyPeriodForm = { periodCode: '', periodName: '', startDate: '', endDate: '', lockDate: '', inputCutoffDate: '', plannedReviewDate: '', plannedApprovalDate: '', intendedPaymentDate: '', financialYear: 'FY 2026-27', status: 'Draft' as PayrollPeriodStatus };

export function PayrollCalendarPeriodMaster() {
  const boot = loadPayrollPolicyConfig();
  const [calendars, setCalendars] = useState<PayrollCalendarRecord[]>(boot.config.calendars);
  const [selectedCalendarId, setSelectedCalendarId] = useState(boot.config.calendars[0]?.id || '');
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [editCalendarId, setEditCalendarId] = useState<string | null>(null);
  const [editPeriodId, setEditPeriodId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [calendarForm, setCalendarForm] = useState(emptyCalendarForm);
  const [periodForm, setPeriodForm] = useState(emptyPeriodForm);
  const [notice, setNotice] = useState(boot.warning || '');
  const [preview, setPreview] = useState<PayrollPeriodRecord[] | null>(null);
  const [blockMessage, setBlockMessage] = useState('');

  const persist = (next: PayrollCalendarRecord[], success?: string) => {
    const loaded = loadPayrollPolicyConfig();
    const result = savePayrollPolicyConfig({ ...loaded.config, calendars: next });
    if (!result.ok) { setNotice(result.error || 'Save failed. Edits remain on screen.'); return false; }
    setCalendars(next);
    setNotice(success || 'Saved in this browser only.');
    return true;
  };

  useEffect(() => subscribePayrollPolicyConfig(() => {
    const next = loadPayrollPolicyConfig();
    setCalendars(next.config.calendars);
    if (next.warning) setNotice(next.warning);
  }), []);

  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);
  const filteredPeriods = (selectedCalendar?.periods || []).filter((p) => p.periodName.toLowerCase().includes(search.toLowerCase()) || p.periodCode.toLowerCase().includes(search.toLowerCase()));
  const totalPeriods = calendars.reduce((sum, c) => sum + c.periods.length, 0);
  const processedPeriods = calendars.reduce((sum, c) => sum + c.periods.filter((p) => p.isProcessed).length, 0);
  const lockedPeriods = calendars.reduce((sum, c) => sum + c.periods.filter((p) => p.isLocked).length, 0);
  const referencedPeriod = (period: PayrollPeriodRecord) => {
    const { config } = loadPayrollPolicyConfig();
    if (config.policies.some((item) => item.calendarId === period.calendarId)) return 'This calendar is selected on a saved payroll policy.';
    if (config.snapshots.some((item) => item.periodId === period.id)) return 'This period is captured on a saved payroll-policy preview.';
    return '';
  };

  const handleSaveCalendar = () => {
    if (!calendarForm.calendarName.trim()) { setNotice('Calendar name is required.'); return; }
    if (editCalendarId) {
      persist(calendars.map((c) => c.id === editCalendarId ? { ...c, ...calendarForm } : c), 'Calendar updated.');
    } else {
      const newCal: PayrollCalendarRecord = { ...calendarForm, id: `PC-${Date.now()}`, periods: [], status: 'Active' };
      persist([...calendars, newCal], 'Calendar created.');
      setSelectedCalendarId(newCal.id);
    }
    setCalendarForm(emptyCalendarForm); setShowCalendarForm(false); setEditCalendarId(null);
  };

  const validatePeriod = (form: typeof emptyPeriodForm, ignoreId?: string) => {
    if (!form.periodCode.trim() || !form.periodName.trim()) return 'Period code and name are required.';
    if (!form.startDate || !form.endDate) return 'Start and end dates are required.';
    if (form.endDate < form.startDate) return 'End date cannot be before start date.';
    const others = (selectedCalendar?.periods || []).filter((p) => p.id !== ignoreId);
    if (others.some((p) => p.periodCode === form.periodCode)) return 'Duplicate period code in this calendar.';
    const candidate = { ...form, id: ignoreId || 'tmp', calendarId: selectedCalendarId, isProcessed: false, isLocked: false, isReviewed: false } as PayrollPeriodRecord;
    if (others.some((p) => periodOverlaps(p, candidate))) return 'This period overlaps another period in the same calendar.';
    return '';
  };

  const handleSavePeriod = () => {
    if (!selectedCalendarId) return;
    const problem = validatePeriod(periodForm, editPeriodId || undefined);
    if (problem) { setNotice(problem); return; }
    const payload: Omit<PayrollPeriodRecord, 'id' | 'isProcessed' | 'isLocked' | 'isReviewed'> = { ...periodForm, calendarId: selectedCalendarId };
    if (editPeriodId) {
      persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: c.periods.map((p) => p.id === editPeriodId ? { ...p, ...payload } : p) } : c), 'Period updated.');
    } else {
      const newPeriod: PayrollPeriodRecord = { ...payload, id: `${selectedCalendarId}-${periodForm.periodCode}`, isProcessed: false, isLocked: false, isReviewed: false };
      persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: [...c.periods, newPeriod] } : c), 'Period added.');
    }
    setPeriodForm(emptyPeriodForm); setShowPeriodForm(false); setEditPeriodId(null);
  };

  const applyGenerated = () => {
    if (!selectedCalendar || !preview) return;
    persist(calendars.map((c) => c.id === selectedCalendar.id ? { ...c, periods: [...c.periods, ...preview] } : c), `Added ${preview.length} missing period(s). Existing periods were not replaced.`);
    setPreview(null);
  };

  const startEditPeriod = (p: PayrollPeriodRecord) => {
    setEditPeriodId(p.id);
    setPeriodForm({ periodCode: p.periodCode, periodName: p.periodName, startDate: p.startDate, endDate: p.endDate, lockDate: p.lockDate, inputCutoffDate: p.inputCutoffDate, plannedReviewDate: p.plannedReviewDate, plannedApprovalDate: p.plannedApprovalDate, intendedPaymentDate: p.intendedPaymentDate, financialYear: p.financialYear, status: p.status });
    setShowPeriodForm(true);
  };

  const deletePeriod = (p: PayrollPeriodRecord) => {
    if (p.isProcessed || p.isLocked || p.isReviewed) { setBlockMessage('This period is processed, locked or reviewed and cannot be removed. Close it or keep it for history.'); return; }
    const reason = referencedPeriod(p);
    if (reason) { setBlockMessage(`${reason} Deletion was blocked.`); return; }
    persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: c.periods.filter((row) => row.id !== p.id) } : c), 'Period deleted.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Calendar / Period Master</h1>
          <p className="text-sm text-gray-500">Define payroll processing periods. Academic year is not stored here.</p>
        </div>
        <Button variant="primary" onClick={() => { setCalendarForm(emptyCalendarForm); setEditCalendarId(null); setShowCalendarForm(true); }}><Plus className="w-4 h-4 mr-2" />New Calendar</Button>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div><div><p className="text-xl font-bold">{calendars.length}</p><p className="text-xs text-gray-500">Calendars</p></div></div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-green-600" /></div><div><p className="text-xl font-bold">{totalPeriods}</p><p className="text-xs text-gray-500">Total Periods</p></div></div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-purple-600" /></div><div><p className="text-xl font-bold">{processedPeriods}</p><p className="text-xs text-gray-500">Processed</p></div></div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Lock className="w-5 h-5 text-red-600" /></div><div><p className="text-xl font-bold">{lockedPeriods}</p><p className="text-xs text-gray-500">Locked Periods</p></div></div>
      </div>

      {showCalendarForm && <Card title={editCalendarId ? 'Edit Calendar' : 'New Payroll Calendar'}>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <Input label="Calendar Name *" value={calendarForm.calendarName} onChange={(e) => setCalendarForm({ ...calendarForm, calendarName: e.target.value })} />
          <Select label="Frequency *" options={['Monthly', 'Weekly', 'Bi-weekly', 'Custom'].map((v) => ({ value: v, label: v }))} value={calendarForm.frequency} onChange={(e) => setCalendarForm({ ...calendarForm, frequency: (typeof e === 'string' ? e : e.target.value) as PayrollCalendarRecord['frequency'] })} />
          <Select label="Financial Year *" options={['FY 2025-26', 'FY 2026-27', 'FY 2027-28'].map((v) => ({ value: v, label: v }))} value={calendarForm.financialYear} onChange={(e) => setCalendarForm({ ...calendarForm, financialYear: typeof e === 'string' ? e : e.target.value })} />
          <Input label="FY start" type="date" value={calendarForm.fyStart} onChange={(e) => setCalendarForm({ ...calendarForm, fyStart: e.target.value })} />
          <Input label="FY end" type="date" value={calendarForm.fyEnd} onChange={(e) => setCalendarForm({ ...calendarForm, fyEnd: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleSaveCalendar}><Save className="w-4 h-4 mr-2" />{editCalendarId ? 'Update' : 'Create'} Calendar</Button>
          <Button variant="outline" onClick={() => { setShowCalendarForm(false); setEditCalendarId(null); }}>Cancel</Button>
        </div>
      </Card>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Card title="Calendars">
            <div className="space-y-2">
              {calendars.map((c) => (
                <div key={c.id} className={`rounded-lg border p-3 ${selectedCalendarId === c.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}>
                  <button type="button" className="w-full text-left" onClick={() => setSelectedCalendarId(c.id)}>
                    <p className="text-sm font-semibold text-gray-900">{c.calendarName}{c.sample ? ' (sample)' : ''}</p>
                    <div className="flex items-center gap-2 mt-1"><Badge variant={c.status === 'Active' ? 'success' : 'secondary'}>{c.status}</Badge><span className="text-xs text-gray-500">{c.frequency} · {c.id}</span></div>
                  </button>
                  <button type="button" className="mt-2 text-xs text-blue-700" onClick={() => { setEditCalendarId(c.id); setCalendarForm({ calendarName: c.calendarName, frequency: c.frequency, financialYear: c.financialYear, fyStart: c.fyStart, fyEnd: c.fyEnd }); setShowCalendarForm(true); }}>Edit</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-9">
          <Card title={selectedCalendar ? `Periods – ${selectedCalendar.calendarName}` : 'Select a Calendar'}>
            {selectedCalendar && <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[180px]"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search periods..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <Button variant="outline" onClick={() => {
                  if (selectedCalendar.frequency === 'Custom') { setNotice('Custom frequency does not auto-generate. Add periods manually.'); return; }
                  const missing = generateMissingPeriods(selectedCalendar);
                  if (!missing.length) { setNotice('No missing periods for this calendar’s financial year and frequency.'); return; }
                  setPreview(missing);
                }}><RefreshCw className="w-4 h-4 mr-2" />Auto-Generate</Button>
                <Button variant="primary" onClick={() => { setPeriodForm({ ...emptyPeriodForm, financialYear: selectedCalendar.financialYear }); setEditPeriodId(null); setShowPeriodForm(true); }}><Plus className="w-4 h-4 mr-2" />Add Period</Button>
              </div>
              {preview && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                <p className="font-semibold">Preview {preview.length} missing period(s) for {selectedCalendar.financialYear}. Existing, processed and locked periods stay unchanged.</p>
                <ul className="mt-2 max-h-40 overflow-auto text-xs">{preview.map((p) => <li key={p.id}>{p.periodCode}: {p.startDate} → {p.endDate}</li>)}</ul>
                <div className="mt-2 flex gap-2"><Button size="sm" onClick={applyGenerated}>Apply missing periods</Button><Button size="sm" variant="outline" onClick={() => setPreview(null)}>Cancel</Button></div>
              </div>}
              {showPeriodForm && <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-2">
                  <Input label="Period Code *" value={periodForm.periodCode} onChange={(e) => setPeriodForm({ ...periodForm, periodCode: e.target.value })} />
                  <Input label="Period Name *" value={periodForm.periodName} onChange={(e) => setPeriodForm({ ...periodForm, periodName: e.target.value })} />
                  <Input label="Start Date *" type="date" value={periodForm.startDate} onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })} />
                  <Input label="End Date *" type="date" value={periodForm.endDate} onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })} />
                  <Input label="Input cutoff date" type="date" value={periodForm.inputCutoffDate} onChange={(e) => setPeriodForm({ ...periodForm, inputCutoffDate: e.target.value })} />
                  <Input label="Planned review date" type="date" value={periodForm.plannedReviewDate} onChange={(e) => setPeriodForm({ ...periodForm, plannedReviewDate: e.target.value })} />
                  <Input label="Planned approval date" type="date" value={periodForm.plannedApprovalDate} onChange={(e) => setPeriodForm({ ...periodForm, plannedApprovalDate: e.target.value })} />
                  <Input label="Intended payment date" type="date" value={periodForm.intendedPaymentDate} onChange={(e) => setPeriodForm({ ...periodForm, intendedPaymentDate: e.target.value })} />
                  <Input label="Lock Date" type="date" value={periodForm.lockDate} onChange={(e) => setPeriodForm({ ...periodForm, lockDate: e.target.value })} />
                  <Select label="Period status" options={['Draft', 'Open', 'Reviewed', 'Processed', 'Locked', 'Closed'].map((v) => ({ value: v, label: v }))} value={periodForm.status} onChange={(e) => setPeriodForm({ ...periodForm, status: (typeof e === 'string' ? e : e.target.value) as PayrollPeriodStatus })} />
                </div>
                <p className="mb-2 text-xs text-gray-500">Cutoff, review, approval and payment dates may fall after the salary period.</p>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={handleSavePeriod}><Save className="w-4 h-4 mr-2" />{editPeriodId ? 'Update' : 'Add'} Period</Button>
                  <Button variant="outline" onClick={() => { setShowPeriodForm(false); setEditPeriodId(null); }}>Cancel</Button>
                </div>
              </div>}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead><tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Period</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Start</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">End</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Cutoff</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Pay date</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Locked</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr></thead>
                  <tbody>
                    {filteredPeriods.map((p, i) => (
                      <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                        <td className="py-3 px-4"><p className="text-sm font-semibold">{p.periodName}</p><p className="text-xs text-gray-500">{p.periodCode} · {p.id}</p></td>
                        <td className="py-3 px-4 text-center text-sm">{p.startDate}</td>
                        <td className="py-3 px-4 text-center text-sm">{p.endDate}</td>
                        <td className="py-3 px-4 text-center text-sm">{p.inputCutoffDate || '—'}</td>
                        <td className="py-3 px-4 text-center text-sm">{p.intendedPaymentDate || '—'}</td>
                        <td className="py-3 px-4 text-center"><Badge variant={p.isProcessed ? 'success' : 'secondary'}>{p.status}</Badge></td>
                        <td className="py-3 px-4 text-center">{p.isLocked ? <Lock className="w-4 h-4 text-red-500 mx-auto" /> : <Unlock className="w-4 h-4 text-green-500 mx-auto" />}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" className="p-1.5 hover:bg-blue-100 rounded-lg" title="Edit" onClick={() => startEditPeriod(p)}><Edit className="w-4 h-4 text-blue-600" /></button>
                            <button type="button" className="p-1.5 hover:bg-red-100 rounded-lg" title="Delete" onClick={() => deletePeriod(p)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>}
          </Card>
        </div>
      </div>
      <Modal isOpen={Boolean(blockMessage)} onClose={() => setBlockMessage('')} title="Period cannot be removed" footer={<Button onClick={() => setBlockMessage('')}>OK</Button>}>
        <p className="text-sm text-gray-700">{blockMessage}</p>
      </Modal>
    </div>
  );
}
