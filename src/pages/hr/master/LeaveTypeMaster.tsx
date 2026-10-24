import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit, Trash2, Save, Search, Calendar, ChevronLeft } from 'lucide-react';

interface LeaveType {
  id: string;
  code: string;
  name: string;
  category: string;
  creditFrequency: string;
  creditQuota: number;
  prorateOnJoining: boolean;
  carryForwardAllowed: boolean;
  maxCarryForward: number;
  encashmentAllowed: boolean;
  maxEncashable: number;
  halfDayAllowed: boolean;
  minDuration: number;
  maxDuration: number;
  requiresDocument: boolean;
  allowNegative: boolean;
  allowOverAllocation: boolean;
  includeHoliday: boolean;
  optionalHoliday: boolean;
  isCompensatory: boolean;
  isLwp: boolean;
  isPartiallyPaid: boolean;
  isEarned: boolean;
  status: 'Active' | 'Inactive';
}

interface LeavePolicy {
  id: string;
  name: string;
  academicYear: string;
  addUnusedFromPrevious: boolean;
  status: 'Active' | 'Inactive';
  leaveTypes: LeaveType[];
}

const YEARS = ['2024-25', '2025-26', '2026-27'].map((v) => ({ value: v, label: v }));
const CATEGORIES = ['Casual', 'Earned', 'Sick', 'Special', 'Maternity', 'Paternity', 'Compensatory', 'LOP', 'Other'].map((v) => ({ value: v, label: v }));
const FREQUENCIES = ['On Joining', 'Monthly', 'Quarterly', 'Yearly', 'Manual'].map((v) => ({ value: v, label: v }));

const emptyType = (): Omit<LeaveType, 'id' | 'status'> => ({
  code: '',
  name: '',
  category: 'Casual',
  creditFrequency: 'Yearly',
  creditQuota: 0,
  prorateOnJoining: false,
  carryForwardAllowed: false,
  maxCarryForward: 0,
  encashmentAllowed: false,
  maxEncashable: 0,
  halfDayAllowed: false,
  minDuration: 0.5,
  maxDuration: 30,
  requiresDocument: false,
  allowNegative: false,
  allowOverAllocation: false,
  includeHoliday: false,
  optionalHoliday: false,
  isCompensatory: false,
  isLwp: false,
  isPartiallyPaid: false,
  isEarned: false,
});

const seedTypes = (items: Array<Partial<LeaveType> & Pick<LeaveType, 'id' | 'code' | 'name'>>): LeaveType[] =>
  items.map((item) => ({ ...emptyType(), creditQuota: 12, status: 'Active', ...item }));

const INITIAL_POLICIES: LeavePolicy[] = [
  {
    id: 'LP001',
    name: 'Teaching Staff Policy',
    academicYear: '2025-26',
    addUnusedFromPrevious: true,
    status: 'Active',
    leaveTypes: seedTypes([
      { id: 'LT001', code: 'CL', name: 'Casual Leave', category: 'Casual', creditQuota: 12, halfDayAllowed: true },
      { id: 'LT002', code: 'EL', name: 'Earned Leave', category: 'Earned', creditQuota: 30, isEarned: true, carryForwardAllowed: true, maxCarryForward: 60, encashmentAllowed: true, maxEncashable: 30 },
      { id: 'LT003', code: 'SL', name: 'Sick Leave', category: 'Sick', creditQuota: 12, requiresDocument: true, halfDayAllowed: true },
      { id: 'LT004', code: 'CO', name: 'Comp-Off', category: 'Compensatory', creditQuota: 0, isCompensatory: true, creditFrequency: 'Manual' },
    ]),
  },
  {
    id: 'LP002',
    name: 'Non-Teaching Staff Policy',
    academicYear: '2025-26',
    addUnusedFromPrevious: false,
    status: 'Active',
    leaveTypes: seedTypes([
      { id: 'LT005', code: 'CL', name: 'Casual Leave', category: 'Casual', creditQuota: 10, halfDayAllowed: true },
      { id: 'LT006', code: 'LWP', name: 'Leave Without Pay', category: 'LOP', creditQuota: 0, isLwp: true, allowNegative: true, creditFrequency: 'Manual' },
    ]),
  },
];

function CheckRow({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 cursor-pointer">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded text-blue-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-gray-800">{title}</span>
        {hint && <span className="mt-0.5 block text-xs text-gray-500">{hint}</span>}
      </span>
    </label>
  );
}

export function LeaveTypeMaster() {
  const [policies, setPolicies] = useState<LeavePolicy[]>(INITIAL_POLICIES);
  const [search, setSearch] = useState('');
  const [openPolicyId, setOpenPolicyId] = useState<string | null>(null);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [policyYear, setPolicyYear] = useState('2025-26');
  const [addUnused, setAddUnused] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [typeForm, setTypeForm] = useState(emptyType());

  const openPolicy = policies.find((p) => p.id === openPolicyId) ?? null;
  const filteredPolicies = policies.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.academicYear.includes(q);
  });

  const resetPolicyForm = () => {
    setPolicyName('');
    setPolicyYear('2025-26');
    setAddUnused(false);
    setEditingPolicyId(null);
    setShowPolicyForm(false);
  };

  const savePolicy = () => {
    if (!policyName.trim()) return;
    if (editingPolicyId) {
      setPolicies((prev) => prev.map((p) => (
        p.id === editingPolicyId
          ? { ...p, name: policyName.trim(), academicYear: policyYear, addUnusedFromPrevious: addUnused }
          : p
      )));
    } else {
      const id = `LP${Date.now()}`;
      setPolicies((prev) => [...prev, {
        id,
        name: policyName.trim(),
        academicYear: policyYear,
        addUnusedFromPrevious: addUnused,
        status: 'Active',
        leaveTypes: [],
      }]);
      setOpenPolicyId(id);
    }
    resetPolicyForm();
  };

  const startEditPolicy = (policy: LeavePolicy) => {
    setPolicyName(policy.name);
    setPolicyYear(policy.academicYear);
    setAddUnused(policy.addUnusedFromPrevious);
    setEditingPolicyId(policy.id);
    setShowPolicyForm(true);
  };

  const resetTypeForm = () => {
    setTypeForm(emptyType());
    setEditingTypeId(null);
    setShowTypeForm(false);
  };

  const saveType = () => {
    if (!openPolicy || !typeForm.code.trim() || !typeForm.name.trim()) return;
    setPolicies((prev) => prev.map((p) => {
      if (p.id !== openPolicy.id) return p;
      if (editingTypeId) {
        return {
          ...p,
          leaveTypes: p.leaveTypes.map((lt) => (lt.id === editingTypeId ? { ...lt, ...typeForm } : lt)),
        };
      }
      return {
        ...p,
        leaveTypes: [...p.leaveTypes, { ...typeForm, id: `LT${Date.now()}`, status: 'Active' }],
      };
    }));
    resetTypeForm();
  };

  const startEditType = (lt: LeaveType) => {
    const { id: _id, status: _status, ...rest } = lt;
    setTypeForm(rest);
    setEditingTypeId(lt.id);
    setShowTypeForm(true);
  };

  const deleteType = (id: string) => {
    if (!openPolicy) return;
    setPolicies((prev) => prev.map((p) => (
      p.id === openPolicy.id ? { ...p, leaveTypes: p.leaveTypes.filter((lt) => lt.id !== id) } : p
    )));
  };

  const setFlag = (key: keyof ReturnType<typeof emptyType>, value: boolean | string | number) => {
    setTypeForm((prev) => ({ ...prev, [key]: value }));
  };

  if (openPolicy) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <button type="button" className="mb-1 inline-flex items-center gap-1 text-sm text-blue-700" onClick={() => { setOpenPolicyId(null); resetTypeForm(); }}>
              <ChevronLeft className="h-4 w-4" /> All policies
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{openPolicy.name}</h1>
            <p className="text-sm text-gray-500">
              {openPolicy.academicYear}
              {openPolicy.addUnusedFromPrevious ? ' · Unused leaves from previous allocations are added' : ''}
            </p>
          </div>
          <Button variant="primary" onClick={() => { resetTypeForm(); setShowTypeForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Leave Type
          </Button>
        </div>

        {showTypeForm && (
          <Card title={editingTypeId ? 'Edit Leave Type' : 'Add Leave Type'}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Leave Code *" value={typeForm.code} onChange={(e) => setFlag('code', e.target.value)} placeholder="e.g. CL" />
                <Input label="Leave Name *" value={typeForm.name} onChange={(e) => setFlag('name', e.target.value)} placeholder="e.g. Casual Leave" />
                <Select label="Category" options={CATEGORIES} value={typeForm.category} onChange={(v) => setFlag('category', v)} />
                <Select label="Credit Frequency" options={FREQUENCIES} value={typeForm.creditFrequency} onChange={(v) => setFlag('creditFrequency', v)} />
                <Input label="Quota (days)" type="number" value={typeForm.creditQuota} onChange={(e) => setFlag('creditQuota', parseFloat(e.target.value) || 0)} />
                <Input label="Minimum duration (days)" type="number" step="0.5" value={typeForm.minDuration} onChange={(e) => setFlag('minDuration', parseFloat(e.target.value) || 0)} />
                <Input label="Maximum duration (days)" type="number" value={typeForm.maxDuration} onChange={(e) => setFlag('maxDuration', parseFloat(e.target.value) || 0)} />
                {typeForm.carryForwardAllowed && (
                  <Input label="Max carry-forward days" type="number" value={typeForm.maxCarryForward} onChange={(e) => setFlag('maxCarryForward', parseInt(e.target.value, 10) || 0)} />
                )}
                {typeForm.encashmentAllowed && (
                  <Input label="Max encashable days" type="number" value={typeForm.maxEncashable} onChange={(e) => setFlag('maxEncashable', parseInt(e.target.value, 10) || 0)} />
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <CheckRow checked={typeForm.prorateOnJoining} onChange={(v) => setFlag('prorateOnJoining', v)} title="Prorate on joining / exit" />
                <CheckRow checked={typeForm.carryForwardAllowed} onChange={(v) => setFlag('carryForwardAllowed', v)} title="Allow carry-forward" />
                <CheckRow checked={typeForm.encashmentAllowed} onChange={(v) => setFlag('encashmentAllowed', v)} title="Allow encashment" />
                <CheckRow checked={typeForm.halfDayAllowed} onChange={(v) => setFlag('halfDayAllowed', v)} title="Half-day allowed" />
                <CheckRow checked={typeForm.requiresDocument} onChange={(v) => setFlag('requiresDocument', v)} title="Requires supporting document" />
                <CheckRow checked={typeForm.allowNegative} onChange={(v) => setFlag('allowNegative', v)} title="Allow Negative Balance" />
                <CheckRow
                  checked={typeForm.allowOverAllocation}
                  onChange={(v) => setFlag('allowOverAllocation', v)}
                  title="Allow Over Allocation"
                  hint="Allows allocating more leaves than the number of days in the allocation period."
                />
                <CheckRow checked={typeForm.includeHoliday} onChange={(v) => setFlag('includeHoliday', v)} title="Include holidays within leaves as leaves" />
                <CheckRow
                  checked={typeForm.optionalHoliday}
                  onChange={(v) => setFlag('optionalHoliday', v)}
                  title="Leave for optional holiday"
                  hint="These leaves are holidays permitted by the company however, availing it is optional for an Employee."
                />
                <CheckRow checked={typeForm.isCompensatory} onChange={(v) => setFlag('isCompensatory', v)} title="Is Compensatory" />
                <CheckRow checked={typeForm.isLwp} onChange={(v) => setFlag('isLwp', v)} title="Is Leave Without Pay" />
                <CheckRow checked={typeForm.isPartiallyPaid} onChange={(v) => setFlag('isPartiallyPaid', v)} title="Is Partially Paid Leave" />
                <CheckRow checked={typeForm.isEarned} onChange={(v) => setFlag('isEarned', v)} title="Is Earned Leave" />
              </div>

              <div className="flex gap-2">
                <Button variant="primary" onClick={saveType}>
                  <Save className="h-4 w-4 mr-2" /> {editingTypeId ? 'Update' : 'Save'} Leave Type
                </Button>
                <Button variant="outline" onClick={resetTypeForm}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        <Card title="Leave types in this policy">
          {openPolicy.leaveTypes.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No leave types yet. Add CL, EL, SL and other types with their quota.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">Leave type</th>
                    <th className="px-3 py-2">Quota</th>
                    <th className="px-3 py-2">Frequency</th>
                    <th className="px-3 py-2">Flags</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openPolicy.leaveTypes.map((lt) => (
                    <tr key={lt.id} className="border-b">
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900">{lt.name}</p>
                        <p className="text-xs text-gray-500">{lt.code} · {lt.category}</p>
                      </td>
                      <td className="px-3 py-2">{lt.creditQuota}d</td>
                      <td className="px-3 py-2">{lt.creditFrequency}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {lt.allowNegative && <Badge variant="secondary">Negative</Badge>}
                          {lt.allowOverAllocation && <Badge variant="secondary">Over alloc.</Badge>}
                          {lt.includeHoliday && <Badge variant="secondary">Incl. holiday</Badge>}
                          {lt.optionalHoliday && <Badge variant="secondary">Optional holiday</Badge>}
                          {lt.isCompensatory && <Badge variant="info">Compensatory</Badge>}
                          {lt.isLwp && <Badge variant="warning">LWP</Badge>}
                          {lt.isPartiallyPaid && <Badge variant="secondary">Partial pay</Badge>}
                          {lt.isEarned && <Badge variant="success">Earned</Badge>}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button type="button" className="rounded p-1.5 hover:bg-blue-50" onClick={() => startEditType(lt)}><Edit className="h-4 w-4 text-blue-600" /></button>
                          <button type="button" className="rounded p-1.5 hover:bg-red-50" onClick={() => deleteType(lt.id)}><Trash2 className="h-4 w-4 text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Policy</h1>
          <p className="text-sm text-gray-500">Create a policy, then add leave types and quotas inside it</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetPolicyForm();
            setShowPolicyForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Create Policy
        </Button>
      </div>

      {showPolicyForm && (
        <Card title={editingPolicyId ? 'Edit Policy' : 'Create Policy'}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Policy name *" value={policyName} onChange={(e) => setPolicyName(e.target.value)} placeholder="e.g. Teaching Staff Policy" />
            <Select label="Academic year" options={YEARS} value={policyYear} onChange={setPolicyYear} />
            <label className="md:col-span-2 flex items-start gap-2 rounded-lg border border-gray-200 p-3">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded text-blue-600" checked={addUnused} onChange={(e) => setAddUnused(e.target.checked)} />
              <span>
                <span className="block text-sm font-medium text-gray-800">Add unused leaves from previous allocations</span>
                <span className="text-xs text-gray-500">Carry unused balances into this policy when a new allocation is created.</span>
              </span>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={savePolicy}><Save className="h-4 w-4 mr-2" /> {editingPolicyId ? 'Update' : 'Save'} Policy</Button>
            <Button variant="outline" onClick={resetPolicyForm}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search policies" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-3 py-2">Policy</th>
                <th className="px-3 py-2">Year</th>
                <th className="px-3 py-2">Leave types</th>
                <th className="px-3 py-2">Unused from previous</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <button type="button" className="inline-flex items-center gap-2 font-medium text-blue-700" onClick={() => setOpenPolicyId(policy.id)}>
                      <Calendar className="h-4 w-4" /> {policy.name}
                    </button>
                  </td>
                  <td className="px-3 py-2">{policy.academicYear}</td>
                  <td className="px-3 py-2">{policy.leaveTypes.length}</td>
                  <td className="px-3 py-2">{policy.addUnusedFromPrevious ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button type="button" className="rounded p-1.5 hover:bg-blue-50" onClick={() => startEditPolicy(policy)}><Edit className="h-4 w-4 text-blue-600" /></button>
                      <button
                        type="button"
                        className="rounded p-1.5 hover:bg-red-50"
                        onClick={() => setPolicies((prev) => prev.filter((p) => p.id !== policy.id))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPolicies.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">No policies yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default LeaveTypeMaster;
