import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, History, Plus, Minus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

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

const LEAVE_TYPES: { code: LeaveCode; name: string; badge: string }[] = [
  { code: 'CL', name: 'Casual Leave', badge: 'bg-blue-100 text-blue-700' },
  { code: 'SL', name: 'Sick Leave', badge: 'bg-orange-100 text-orange-700' },
  { code: 'EL', name: 'Earned Leave', badge: 'bg-purple-100 text-purple-700' },
  { code: 'PL', name: 'Privilege Leave', badge: 'bg-green-100 text-green-700' },
  { code: 'CO', name: 'Comp-Off', badge: 'bg-teal-100 text-teal-700' }
];

const REASON_CATEGORIES = [
  { value: 'correction', label: 'Balance Correction' },
  { value: 'annual_credit', label: 'Annual Leave Credit' },
  { value: 'carry_forward', label: 'Carry Forward Adjustment' },
  { value: 'policy_change', label: 'Policy Change' },
  { value: 'encashment', label: 'Leave Encashment' },
  { value: 'reversal', label: 'Leave Reversal' },
  { value: 'joining_prorata', label: 'Pro-rata (New Joining)' },
  { value: 'resignation', label: 'Resignation Settlement' },
  { value: 'other', label: 'Other' }
];

const MIN_JUSTIFICATION = 20;

const EMPLOYEES: Employee[] = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', joined: '15 Mar 2022', balances: { CL: 8, SL: 5, EL: 15, PL: 12, CO: 3 } },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', joined: '02 Jul 2019', balances: { CL: 6, SL: 4, EL: 18, PL: 10, CO: 1 } },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', joined: '11 Jan 2021', balances: { CL: 9, SL: 6, EL: 12, PL: 8, CO: 2 } },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', joined: '20 Aug 2020', balances: { CL: 7, SL: 3, EL: 10, PL: 9, CO: 0 } },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', joined: '05 Feb 2023', balances: { CL: 4, SL: 6, EL: 6, PL: 5, CO: 2 } },
  { id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', joined: '18 Oct 2018', balances: { CL: 10, SL: 7, EL: 20, PL: 14, CO: 4 } },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', joined: '30 Apr 2022', balances: { CL: 5, SL: 4, EL: 9, PL: 6, CO: 1 } },
  { id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', joined: '09 Sep 2021', balances: { CL: 8, SL: 2, EL: 11, PL: 7, CO: 3 } }
];

const SEED_HISTORY: AdjustmentRecord[] = [
  { id: 1, date: '28 Sep 2026', empId: 'EMP001', empName: 'John Doe', leave: 'CL', action: 'Add', qty: 2, by: 'HR Admin', reason: 'Annual credit correction' },
  { id: 2, date: '15 Sep 2026', empId: 'EMP004', empName: 'Emily Davis', leave: 'SL', action: 'Deduct', qty: 1, by: 'HR Manager', reason: 'Duplicate entry removed' },
  { id: 3, date: '10 Sep 2026', empId: 'EMP006', empName: 'Sarah Wilson', leave: 'EL', action: 'Add', qty: 5, by: 'HR Admin', reason: 'Carry forward from 2025' }
];

const todayLabel = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const leaveName = (code: LeaveCode) => LEAVE_TYPES.find((type) => type.code === code)?.name ?? code;
const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

export function LeaveBalanceAdjustBulk() {
  const [tab, setTab] = useState<'adjust' | 'history'>('adjust');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, Record<LeaveCode, number>>>(() =>
    Object.fromEntries(EMPLOYEES.map((emp) => [emp.id, { ...emp.balances }])));
  const [leave, setLeave] = useState<LeaveCode>('CL');
  const [action, setAction] = useState<'add' | 'deduct'>('add');
  const [quantity, setQuantity] = useState('1');
  const [reasonCategory, setReasonCategory] = useState('');
  const [justification, setJustification] = useState('');
  const [history, setHistory] = useState<AdjustmentRecord[]>(SEED_HISTORY);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const departments = Array.from(new Set(EMPLOYEES.map((emp) => emp.department)));
  const term = search.trim().toLowerCase();
  const filteredEmployees = EMPLOYEES.filter((emp) => {
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchesSearch = term === '' || emp.name.toLowerCase().includes(term) || emp.id.toLowerCase().includes(term) || emp.department.toLowerCase().includes(term);
    return matchesDept && matchesSearch;
  });

  const selected = EMPLOYEES.find((emp) => emp.id === selectedId) ?? null;
  const qty = Number(quantity);
  const validQty = Number.isFinite(qty) && qty > 0 && Number.isInteger(qty * 2);
  const signed = action === 'add' ? qty : -qty;
  const currentBal = selected ? balances[selected.id][leave] : 0;
  const nextBal = currentBal + (validQty ? signed : 0);
  const insufficient = action === 'deduct' && validQty && selected && currentBal < qty;
  const canApply = !!selected && validQty && !!reasonCategory && justification.trim().length >= MIN_JUSTIFICATION && !insufficient;

  const applyAdjustment = () => {
    if (!selected || !canApply) {
      setNotice({ type: 'error', text: !selected ? 'Select an employee first.' : insufficient ? 'Insufficient balance.' : 'Fill quantity, reason and justification.' });
      return;
    }
    const reasonLabel = REASON_CATEGORIES.find((item) => item.value === reasonCategory)?.label ?? reasonCategory;
    setBalances((prev) => ({ ...prev, [selected.id]: { ...prev[selected.id], [leave]: prev[selected.id][leave] + signed } }));
    setHistory((prev) => [{
      id: Date.now(),
      date: todayLabel(),
      empId: selected.id,
      empName: selected.name,
      leave,
      action: action === 'add' ? 'Add' : 'Deduct',
      qty,
      by: 'HR Admin',
      reason: `${reasonLabel}: ${justification.trim()}`
    }, ...prev]);
    setNotice({ type: 'success', text: `${action === 'add' ? 'Credited' : 'Debited'} ${qty} day(s) of ${leaveName(leave)} for ${selected.name}.` });
    setJustification('');
    setReasonCategory('');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Balance Adjust</h1>
        <p className="text-sm text-gray-500">Search an employee, open their balances, then apply a change</p>
      </div>

      {notice && (
        <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)}><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {([{ id: 'adjust', label: 'Adjust Balance' }, { id: 'history', label: 'Adjustment History' }] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px ${tab === item.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {item.id === 'history' ? <span className="inline-flex items-center gap-1"><History className="w-4 h-4" /> {item.label}</span> : item.label}
            </button>
          ))}
        </div>

        {tab === 'adjust' && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-medium text-gray-600 mb-1">Search employee</label>
                <Search className="w-4 h-4 absolute left-3 top-8 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setHasSearched(true); setSelectedId(null); } }}
                  placeholder="Name, ID or department"
                  className={`${inputClass} pl-9`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className={inputClass}>
                  <option value="all">All Departments</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Button onClick={() => { setHasSearched(true); setSelectedId(null); }}><Search className="w-4 h-4 mr-2" /> Search</Button>
            </div>

            {hasSearched && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Emp ID', 'Employee', 'Department', 'Designation', 'CL', 'SL', 'EL', 'PL', 'CO'].map((h) =>
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        onClick={() => setSelectedId(emp.id)}
                        className={`cursor-pointer hover:bg-indigo-50 ${selectedId === emp.id ? 'bg-indigo-50' : ''}`}
                      >
                        <td className="px-3 py-2 font-medium text-blue-600">{emp.id}</td>
                        <td className="px-3 py-2 font-medium text-gray-900">{emp.name}</td>
                        <td className="px-3 py-2 text-gray-600">{emp.department}</td>
                        <td className="px-3 py-2 text-gray-600">{emp.designation}</td>
                        {LEAVE_TYPES.map((t) => <td key={t.code} className="px-3 py-2">{balances[emp.id][t.code]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredEmployees.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No employees match the search.</p>}
              </div>
            )}

            {!hasSearched && (
              <p className="text-sm text-gray-500 text-center py-8">Use search to load the employee list.</p>
            )}

            {selected && (
              <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/40 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.id} · {selected.designation} · Joined {selected.joined}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Current leave balance</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {LEAVE_TYPES.map((t) => (
                      <div key={t.code} className={`rounded-lg px-3 py-2 ${t.badge}`}>
                        <p className="text-[11px]">{t.name}</p>
                        <p className="text-lg font-bold">{balances[selected.id][t.code]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Select label="Leave type" value={leave} onChange={(val) => setLeave(val as LeaveCode)} options={LEAVE_TYPES.map((t) => ({ value: t.code, label: `${t.code} — ${t.name}` }))} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAction('add')} className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border ${action === 'add' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}><Plus className="w-4 h-4" /> Add</button>
                      <button type="button" onClick={() => setAction('deduct')} className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm border ${action === 'deduct' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}`}><Minus className="w-4 h-4" /> Deduct</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (days)</label>
                    <input type="number" min={0.5} step={0.5} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
                  </div>
                  <Select label="Reason category" value={reasonCategory} onChange={setReasonCategory} options={[{ value: '', label: 'Select reason...' }, ...REASON_CATEGORIES]} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Justification * (min {MIN_JUSTIFICATION} characters)</label>
                  <textarea rows={3} value={justification} onChange={(e) => setJustification(e.target.value)} className={inputClass} placeholder="Explain why this balance is being changed..." />
                  <p className="text-xs text-gray-500 mt-1">{justification.trim().length}/{MIN_JUSTIFICATION}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    {leaveName(leave)}: <span className="font-semibold">{currentBal}</span> → <span className={`font-semibold ${nextBal < 0 ? 'text-red-600' : 'text-indigo-700'}`}>{validQty ? nextBal : '—'}</span>
                    {insufficient && <span className="ml-2 text-red-600">Insufficient balance</span>}
                  </p>
                  <Button onClick={applyAdjustment} disabled={!canApply}><CheckCircle className="w-4 h-4 mr-2" /> Apply Change</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Date', 'Employee', 'Leave', 'Action', 'Qty', 'By', 'Reason'].map((h) =>
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3"><p className="font-medium text-gray-900">{row.empName}</p><p className="text-xs text-gray-500">{row.empId}</p></td>
                    <td className="px-4 py-3">{row.leave}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.action === 'Add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.action}</span></td>
                    <td className="px-4 py-3">{row.qty}</td>
                    <td className="px-4 py-3 text-gray-600">{row.by}</td>
                    <td className="px-4 py-3 text-gray-600">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No adjustments logged yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveBalanceAdjustBulk;
