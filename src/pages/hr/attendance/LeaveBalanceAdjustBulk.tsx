import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import {
  Upload,
  Download,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckSquare,
  Square,
  Eye,
  History,
  Info } from
'lucide-react';

type LeaveCode = 'CL' | 'SL' | 'EL' | 'PL' | 'CO';

interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  joined: string;
  balances: Record<LeaveCode, number>;
}

interface AdjustmentRecord {
  id: number;
  date: string;
  empId: string;
  empName: string;
  leave: LeaveCode;
  action: 'Add' | 'Deduct';
  qty: number;
  by: string;
  reason: string;
}

interface Notice {
  type: 'success' | 'error' | 'info';
  text: string;
}

const LEAVE_TYPES: { code: LeaveCode; name: string; badge: string }[] = [
{ code: 'CL', name: 'Casual Leave', badge: 'bg-blue-100 text-blue-700' },
{ code: 'SL', name: 'Sick Leave', badge: 'bg-orange-100 text-orange-700' },
{ code: 'EL', name: 'Earned Leave', badge: 'bg-purple-100 text-purple-700' },
{ code: 'PL', name: 'Privilege Leave', badge: 'bg-green-100 text-green-700' },
{ code: 'CO', name: 'Comp-Off', badge: 'bg-teal-100 text-teal-700' }];

const REASON_CATEGORIES = [
{ value: 'correction', label: 'Balance Correction' },
{ value: 'annual_credit', label: 'Annual Leave Credit' },
{ value: 'carry_forward', label: 'Carry Forward Adjustment' },
{ value: 'policy_change', label: 'Policy Change' },
{ value: 'encashment', label: 'Leave Encashment' },
{ value: 'reversal', label: 'Leave Reversal' },
{ value: 'joining_prorata', label: 'Pro-rata (New Joining)' },
{ value: 'resignation', label: 'Resignation Settlement' },
{ value: 'other', label: 'Other' }];

const MIN_JUSTIFICATION = 20;

const EMPLOYEES: Employee[] = [
{ id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', joined: '15 Mar 2022', balances: { CL: 8, SL: 5, EL: 15, PL: 12, CO: 3 } },
{ id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', joined: '02 Jul 2019', balances: { CL: 6, SL: 4, EL: 18, PL: 10, CO: 1 } },
{ id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', joined: '11 Jan 2021', balances: { CL: 9, SL: 6, EL: 12, PL: 8, CO: 2 } },
{ id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', joined: '20 Aug 2020', balances: { CL: 7, SL: 3, EL: 10, PL: 9, CO: 0 } },
{ id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', joined: '05 Feb 2023', balances: { CL: 4, SL: 6, EL: 6, PL: 5, CO: 2 } },
{ id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', joined: '18 Oct 2018', balances: { CL: 10, SL: 7, EL: 20, PL: 14, CO: 4 } },
{ id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', joined: '30 Apr 2022', balances: { CL: 5, SL: 4, EL: 9, PL: 6, CO: 1 } },
{ id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', joined: '09 Sep 2021', balances: { CL: 8, SL: 2, EL: 11, PL: 7, CO: 3 } }];

const SEED_HISTORY: AdjustmentRecord[] = [
{ id: 1, date: '28 Sep 2026', empId: 'EMP001', empName: 'John Doe', leave: 'CL', action: 'Add', qty: 2, by: 'HR Admin', reason: 'Annual credit correction' },
{ id: 2, date: '15 Sep 2026', empId: 'EMP004', empName: 'Emily Davis', leave: 'SL', action: 'Deduct', qty: 1, by: 'HR Manager', reason: 'Duplicate entry removed' },
{ id: 3, date: '10 Sep 2026', empId: 'EMP006', empName: 'Sarah Wilson', leave: 'EL', action: 'Add', qty: 5, by: 'HR Admin', reason: 'Carry forward from 2025' }];

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const todayLabel = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const leaveName = (code: LeaveCode) => LEAVE_TYPES.find((type) => type.code === code)?.name ?? code;

export function LeaveBalanceAdjustBulk() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['EMP001']);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [balances, setBalances] = useState<Record<string, Record<LeaveCode, number>>>(() =>
    Object.fromEntries(EMPLOYEES.map((emp) => [emp.id, { ...emp.balances }])));
  const [leave, setLeave] = useState<LeaveCode>('CL');
  const [action, setAction] = useState<'add' | 'deduct'>('add');
  const [quantity, setQuantity] = useState('1');
  const [effectiveDate, setEffectiveDate] = useState(todayIso());
  const [reasonCategory, setReasonCategory] = useState('');
  const [justification, setJustification] = useState('');
  const [notify, setNotify] = useState(true);
  const [attachment, setAttachment] = useState('');
  const [history, setHistory] = useState<AdjustmentRecord[]>(SEED_HISTORY);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const departments = Array.from(new Set(EMPLOYEES.map((emp) => emp.department)));
  const term = search.trim().toLowerCase();
  const filteredEmployees = EMPLOYEES.filter((emp) => {
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchesSearch =
      term === '' ||
      emp.name.toLowerCase().includes(term) ||
      emp.id.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term);
    return matchesDept && matchesSearch;
  });

  const selectedEmployees = EMPLOYEES.filter((emp) => selectedIds.includes(emp.id));
  const qty = Number(quantity);
  const validQty = Number.isFinite(qty) && qty > 0 && Number.isInteger(qty * 2);
  const signed = action === 'add' ? qty : -qty;
  const shortfalls = selectedEmployees.filter(
    (emp) => action === 'deduct' && validQty && balances[emp.id][leave] < qty
  );
  const allFilteredSelected = filteredEmployees.length > 0 && filteredEmployees.every((emp) => selectedIds.includes(emp.id));
  const singleEmployee = selectedEmployees.length === 1 ? selectedEmployees[0] : null;

  const errors: string[] = [];
  if (selectedEmployees.length === 0) errors.push('Select at least one employee.');
  if (!validQty) errors.push('Quantity must be a positive amount in steps of 0.5 days.');
  if (!reasonCategory) errors.push('Choose a reason category.');
  if (justification.trim().length < MIN_JUSTIFICATION) {
    errors.push(`Justification must be at least ${MIN_JUSTIFICATION} characters (currently ${justification.trim().length}).`);
  }
  if (shortfalls.length > 0) {
    errors.push(`Insufficient ${leave} balance for: ${shortfalls.map((emp) => emp.name).join(', ')}.`);
  }
  const canApply = errors.length === 0;

  const toggleEmployee = (id: string) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const selectFiltered = () => {
    setSelectedIds((ids) => Array.from(new Set([...ids, ...filteredEmployees.map((emp) => emp.id)])));
  };

  const deselectFiltered = () => {
    const visible = filteredEmployees.map((emp) => emp.id);
    setSelectedIds((ids) => ids.filter((id) => !visible.includes(id)));
  };

  const clearSelection = () => setSelectedIds([]);

  const resetForm = () => {
    setSelectedIds([]);
    setLeave('CL');
    setAction('add');
    setQuantity('1');
    setEffectiveDate(todayIso());
    setReasonCategory('');
    setJustification('');
    setNotify(true);
    setAttachment('');
    setNotice({ type: 'info', text: 'Form cleared. No balances were changed.' });
  };

  const applyAdjustment = () => {
    if (!canApply) {
      setNotice({ type: 'error', text: errors[0] });
      return;
    }
    const stamp = todayLabel();
    const reasonLabel = REASON_CATEGORIES.find((item) => item.value === reasonCategory)?.label ?? reasonCategory;
    setBalances((prev) => {
      const next = { ...prev };
      selectedEmployees.forEach((emp) => {
        next[emp.id] = { ...next[emp.id], [leave]: next[emp.id][leave] + signed };
      });
      return next;
    });
    setHistory((prev) => [
    ...selectedEmployees.map((emp, index) => ({
      id: Date.now() + index,
      date: stamp,
      empId: emp.id,
      empName: emp.name,
      leave,
      action: action === 'add' ? 'Add' as const : 'Deduct' as const,
      qty,
      by: 'HR Admin',
      reason: `${reasonLabel}: ${justification.trim()}`
    })),
    ...prev]);
    setNotice({
      type: 'success',
      text: `${action === 'add' ? 'Credited' : 'Debited'} ${qty} day(s) of ${leaveName(leave)} for ${selectedEmployees.length} employee(s).${notify ? ' Notification queued.' : ''}`
    });
    setJustification('');
    setReasonCategory('');
    setAttachment('');
    setPreviewOpen(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    const ids = text
      .split(/\r?\n/)
      .map((line) => line.split(',')[0].trim().replace(/^"|"$/g, ''))
      .filter((id) => EMPLOYEES.some((emp) => emp.id === id));
    const unique = Array.from(new Set(ids));
    if (unique.length === 0) {
      setNotice({ type: 'error', text: 'No matching employee IDs were found in the file.' });
      return;
    }
    setSelectedIds(unique);
    setNotice({ type: 'success', text: `${unique.length} employee(s) selected from ${file.name}.` });
  };

  const downloadTemplate = () => {
    downloadCsv('leave-balance-adjust-template.csv', [
      ['employee_id', 'leave_type', 'action', 'quantity', 'reason_category', 'justification'],
      ['EMP001', 'CL', 'add', '1', 'correction', 'Balance correction after payroll review']]);
    setNotice({ type: 'success', text: 'Template downloaded. Use the employee_id column with Import IDs.' });
  };

  const previewRows = selectedEmployees.map((emp) => {
    const current = balances[emp.id][leave];
    const next = current + signed;
    return { emp, current, next, insufficient: action === 'deduct' && validQty && next < 0 };
  });

  const visibleHistory = showAllHistory ? history : history.slice(0, 4);

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Balance Adjust</h1>
          <p className="text-sm text-gray-500">
            Adjust leave balance for one employee or several employees in one step
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" onClick={() => setPreviewOpen(true)} disabled={selectedEmployees.length === 0}>
            <Eye className="w-4 h-4 mr-2" />
            Preview Changes
          </Button>
          <Button variant="primary" onClick={applyAdjustment} disabled={!canApply}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Apply Adjustments
          </Button>
        </div>
      </div>

      {notice &&
      <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100" title="Dismiss">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{EMPLOYEES.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg"><CheckSquare className="w-6 h-6 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-green-600">{selectedEmployees.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg"><Plus className="w-6 h-6 text-orange-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Net Change (days)</p>
              <p className={`text-2xl font-bold ${signed < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                {validQty ? `${signed > 0 ? '+' : ''}${signed * selectedEmployees.length}` : '—'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg"><RefreshCw className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Adjustments Logged</p>
              <p className="text-2xl font-bold text-purple-600">{history.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="1. Select Employee(s)">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, ID or department..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="w-full md:w-56">
                  <Select
                    options={[{ value: 'all', label: 'All Departments' }, ...departments.map((dept) => ({ value: dept, label: dept }))]}
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)} />
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">
                  <Upload className="w-4 h-4" />
                  Import IDs (CSV)
                  <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={selectFiltered} disabled={filteredEmployees.length === 0 || allFilteredSelected}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Select All{term || deptFilter !== 'all' ? ' (filtered)' : ''}
                  </Button>
                  <Button variant="outline" onClick={deselectFiltered} disabled={!filteredEmployees.some((emp) => selectedIds.includes(emp.id))}>
                    <Square className="w-4 h-4 mr-2" />
                    Deselect Filtered
                  </Button>
                  <Button variant="outline" onClick={clearSelection} disabled={selectedIds.length === 0}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                </div>
                <span className="text-xs text-gray-500">{filteredEmployees.length} shown · {selectedEmployees.length} selected</span>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          checked={allFilteredSelected}
                          onChange={(e) => (e.target.checked ? selectFiltered() : deselectFiltered())}
                          title="Select all shown" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{leave} Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.length === 0 &&
                    <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">No employees match your search.</td>
                      </tr>
                    }
                    {filteredEmployees.map((emp) => {
                      const checked = selectedIds.includes(emp.id);
                      return (
                        <tr key={emp.id} onClick={() => toggleEmployee(emp.id)} className={`cursor-pointer hover:bg-gray-50 ${checked ? 'bg-blue-50' : ''}`}>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 rounded border-gray-300"
                              checked={checked}
                              onChange={() => toggleEmployee(emp.id)} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">{emp.name.split(' ').map((n) => n[0]).join('')}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.id} · {emp.designation}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{balances[emp.id][leave]} days</td>
                        </tr>);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card title="2. Adjustment Details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Leave Type"
                  options={LEAVE_TYPES.map((type) => ({ value: type.code, label: `${type.name} (${type.code})` }))}
                  value={leave}
                  onChange={(e) => setLeave(e.target.value as LeaveCode)} />
                <Select
                  label="Reason Category"
                  options={[{ value: '', label: 'Select Reason' }, ...REASON_CATEGORIES]}
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAction('add')}
                    className={`py-4 px-6 rounded-lg border-2 transition-all flex items-center justify-center gap-3 ${action === 'add' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action === 'add' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Plus className={`w-5 h-5 ${action === 'add' ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Add / Credit</p>
                      <p className="text-xs opacity-75">Increase balance</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('deduct')}
                    className={`py-4 px-6 rounded-lg border-2 transition-all flex items-center justify-center gap-3 ${action === 'deduct' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action === 'deduct' ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <Minus className={`w-5 h-5 ${action === 'deduct' ? 'text-red-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Deduct / Debit</p>
                      <p className="text-xs opacity-75">Decrease balance</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter number of days"
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={inputClass}
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Enter detailed justification for this adjustment (mandatory)..." />
                <p className={`text-xs mt-1 ${justification.trim().length >= MIN_JUSTIFICATION ? 'text-green-600' : 'text-gray-500'}`}>
                  Minimum {MIN_JUSTIFICATION} characters required ({justification.trim().length}/{MIN_JUSTIFICATION}). This will be recorded in the audit log.
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={notify}
                    onChange={(e) => setNotify(e.target.checked)}
                    className="rounded border-gray-300" />
                  Send notification to employee{selectedEmployees.length === 1 ? '' : 's'}
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 w-fit">
                  <Upload className="w-4 h-4" />
                  {attachment || 'Attach supporting document (optional)'}
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? '')} />
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {singleEmployee ?
          <Card title={`Current Leave Balance — ${singleEmployee.name}`}>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">{singleEmployee.id} · {singleEmployee.department} · Joined {singleEmployee.joined}</p>
                {LEAVE_TYPES.map((type) => {
                  const current = balances[singleEmployee.id][type.code];
                  const after = validQty && type.code === leave ? current + signed : null;
                  return (
                    <div key={type.code} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className={`w-10 h-6 flex items-center justify-center text-xs font-bold rounded ${type.badge}`}>{type.code}</span>
                        <span className="text-sm text-gray-700">{type.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {current} days
                        {after !== null && <span className={`ml-2 text-xs ${after < 0 ? 'text-red-600' : 'text-blue-600'}`}>→ {after}</span>}
                      </span>
                    </div>);
                })}
              </div>
            </Card> :
          <Card title={`Selected Employees (${selectedEmployees.length})`}>
              {selectedEmployees.length === 0 ?
              <p className="text-sm text-gray-500">No employees selected. Pick one employee for a single correction, or several for a bulk adjustment.</p> :
              <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <span className="text-sm text-blue-800">{emp.name}</span>
                      <span className="text-xs text-blue-600">({balances[emp.id][leave]}{validQty ? ` → ${balances[emp.id][leave] + signed}` : ''})</span>
                      <button type="button" onClick={() => toggleEmployee(emp.id)} className="text-blue-400 hover:text-blue-600" title="Remove">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              }
            </Card>
          }

          <Card title="Adjustment Preview">
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${action === 'add' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action === 'add' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {action === 'add' ? <Plus className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-red-600" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${action === 'add' ? 'text-green-800' : 'text-red-800'}`}>
                      {action === 'add' ? 'Credit' : 'Debit'} Adjustment
                    </p>
                    <p className={`text-sm ${action === 'add' ? 'text-green-600' : 'text-red-600'}`}>{leaveName(leave)} ({leave})</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employees affected:</span>
                    <span className="font-medium">{selectedEmployees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per employee:</span>
                    <span className={`font-medium ${action === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                      {validQty ? `${action === 'add' ? '+' : '-'}${qty} day(s)` : '—'}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium text-gray-700">Total days:</span>
                    <span className="font-bold text-lg text-blue-600">{validQty ? qty * selectedEmployees.length : 0}</span>
                  </div>
                </div>
              </div>

              {errors.length > 0 ?
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-yellow-800">Complete these before applying</p>
                      {errors.map((message) => <p key={message} className="text-xs text-yellow-700">• {message}</p>)}
                    </div>
                  </div>
                </div> :
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-800">Ready to apply. This will be recorded in the audit log.</p>
                </div>
              }

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={resetForm}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={applyAdjustment} disabled={!canApply}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Adjustment History">
            <div className="space-y-3">
              {visibleHistory.map((item) =>
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 h-5 flex items-center justify-center text-xs font-bold rounded ${item.action === 'Add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.action === 'Add' ? '+' : '-'}{item.qty}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.leave}</span>
                      <span className="text-xs text-gray-600">{item.empName}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{item.reason}</p>
                  <p className="text-xs text-gray-400">By: {item.by}</p>
                </div>
              )}
              {history.length > 4 &&
              <Button variant="outline" className="w-full" onClick={() => setShowAllHistory((value) => !value)}>
                  <History className="w-4 h-4 mr-2" />
                  {showAllHistory ? 'Show Less' : `View Full History (${history.length})`}
                </Button>
              }
            </div>
          </Card>

          <Card title="Guidelines">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">Adjustments should only be made for genuine corrections or policy-based credits.</p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">Deductions cannot take a balance below zero; every selected employee must have enough days.</p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-600">All adjustments are logged and may be subject to audit review.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Preview Balance Changes"
        size="lg"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button variant="primary" onClick={applyAdjustment} disabled={!canApply}>Apply Adjustments</Button>
          </div>}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {action === 'add' ? 'Credit' : 'Debit'} {qty || 0} day(s) of {leaveName(leave)} ({leave}) · Effective {effectiveDate || '—'}
          </p>
          {previewRows.length === 0 ?
          <p className="text-sm text-gray-500">No employees selected.</p> :
          <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Adjustment</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">New Balance</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {previewRows.map(({ emp, current, next, insufficient }) =>
                  <tr key={emp.id}>
                      <td className="px-4 py-2">
                        <span className="font-medium text-gray-900">{emp.name}</span>
                        <span className="block text-xs text-gray-500">{emp.id}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">{current}</td>
                      <td className={`px-4 py-2 font-medium ${signed < 0 ? 'text-red-600' : 'text-green-600'}`}>{validQty ? `${signed > 0 ? '+' : ''}${signed}` : '—'}</td>
                      <td className="px-4 py-2 font-bold text-blue-600">{validQty ? next : current}</td>
                      <td className="px-4 py-2">
                        {insufficient ?
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">Insufficient</span> :
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">OK</span>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          }
          {errors.length > 0 &&
          <div className="text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
              {errors.map((message) => <p key={message}>• {message}</p>)}
            </div>
          }
        </div>
      </Modal>
    </div>);

}
