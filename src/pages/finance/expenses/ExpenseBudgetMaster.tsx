import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { AlertTriangle, Edit, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { EXPENSE_MASTER_UPDATED_EVENT, getExpenseMasterData } from './expenseMasterData';

interface BudgetRecord {
  id: string;
  year: string;
  category: string;
  head: string;
  allocated: number;
  used: number;
  committed: number;
  status: 'Active' | 'Exceeded';
}

const INITIAL_BUDGETS: BudgetRecord[] = [
  { id: 'BDG001', year: '2025-26', category: 'Personnel', head: 'Staff Salary', allocated: 5000000, used: 3200000, committed: 400000, status: 'Active' },
  { id: 'BDG002', year: '2025-26', category: 'Infrastructure', head: 'Utilities (Electricity, Water)', allocated: 200000, used: 178000, committed: 15000, status: 'Active' },
  { id: 'BDG003', year: '2025-26', category: 'Infrastructure', head: 'Building Maintenance', allocated: 300000, used: 285000, committed: 20000, status: 'Exceeded' },
  { id: 'BDG004', year: '2025-26', category: 'Academic', head: 'Stationery & Supplies', allocated: 100000, used: 45000, committed: 10000, status: 'Active' },
  { id: 'BDG005', year: '2025-26', category: 'Administrative', head: 'Marketing & Advertising', allocated: 150000, used: 30000, committed: 0, status: 'Active' },
  { id: 'BDG006', year: '2025-26', category: 'IT Equipment', head: 'IT Equipment & Hardware', allocated: 250000, used: 260000, committed: 0, status: 'Exceeded' }
];

const EMPTY_FORM = { year: '2025-26', category: '', head: '', allocated: '', used: '', committed: '' };

export function ExpenseBudgetMaster() {
  const [budgets, setBudgets] = useState<BudgetRecord[]>(INITIAL_BUDGETS);
  const [masterData, setMasterData] = useState(() => getExpenseMasterData());
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('2025-26');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const refreshExpenseMaster = () => setMasterData(getExpenseMasterData());
    window.addEventListener(EXPENSE_MASTER_UPDATED_EVENT, refreshExpenseMaster);
    return () => window.removeEventListener(EXPENSE_MASTER_UPDATED_EVENT, refreshExpenseMaster);
  }, []);

  const categories = Array.from(new Set([...masterData.categories, ...budgets.map((budget) => budget.category)])).sort();
  const heads = masterData.heads.filter((head) => head.isActive);
  const formHeadOptions = masterData.heads.filter((head) =>
    (head.isActive || head.name === form.head) && (!form.category || head.category === form.category)
  );
  const filtered = useMemo(() => budgets.filter((budget) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || budget.head.toLowerCase().includes(query) || budget.category.toLowerCase().includes(query);
    const matchesYear = yearFilter === 'all' || budget.year === yearFilter;
    const matchesCategory = categoryFilter === 'all' || budget.category === categoryFilter;
    return matchesSearch && matchesYear && matchesCategory;
  }), [budgets, search, yearFilter, categoryFilter]);

  const sum = (field: 'allocated' | 'used' | 'committed') => filtered.reduce((total, budget) => total + budget[field], 0);
  const totalAllocated = sum('allocated');
  const totalUsed = sum('used');
  const totalCommitted = sum('committed');
  const totalRemaining = totalAllocated - totalUsed - totalCommitted;

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const openAdd = () => {
    const initialCategory = categories[0] || '';
    const firstHead = heads.find((head) => head.category === initialCategory)?.name || '';
    setEditId(null);
    setForm({ ...EMPTY_FORM, category: initialCategory, head: firstHead });
    setShowModal(true);
  };

  const openEdit = (budget: BudgetRecord) => {
    setEditId(budget.id);
    setForm({
      year: budget.year,
      category: budget.category,
      head: budget.head,
      allocated: String(budget.allocated),
      used: String(budget.used),
      committed: String(budget.committed)
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const allocated = Number(form.allocated);
    const used = Number(form.used || 0);
    const committed = Number(form.committed || 0);
    if (!form.year || !form.category || !form.head || !(allocated > 0)) {
      alert('Financial year, category, expense head, and a budget amount above zero are required.');
      return;
    }
    if (used < 0 || committed < 0) {
      alert('Used and committed amounts cannot be negative.');
      return;
    }
    const record: BudgetRecord = {
      id: editId || `BDG-${Date.now()}`,
      year: form.year,
      category: form.category,
      head: form.head,
      allocated,
      used,
      committed,
      status: used + committed > allocated ? 'Exceeded' : 'Active'
    };
    setBudgets((current) => editId
      ? current.map((budget) => budget.id === editId ? record : budget)
      : [record, ...current]);
    closeModal();
  };

  const handleDelete = (budget: BudgetRecord) => {
    if (!confirm(`Delete the budget for “${budget.head}” (${budget.year})?`)) return;
    setBudgets((current) => current.filter((item) => item.id !== budget.id));
  };

  const utilization = (budget: BudgetRecord) => budget.allocated > 0 ? Math.round((budget.used + budget.committed) / budget.allocated * 100) : 0;
  const columns = [
    { key: 'category', header: 'Expense Category', render: (row: BudgetRecord) => <Badge variant="info">{row.category}</Badge> },
    { key: 'head', header: 'Expense Head', render: (row: BudgetRecord) => <div><p className="font-medium text-gray-900">{row.head}</p><p className="text-xs text-gray-500">FY {row.year}</p></div> },
    { key: 'allocated', header: 'Budget Amount', render: (row: BudgetRecord) => <span className="font-semibold">₹{row.allocated.toLocaleString('en-IN')}</span> },
    { key: 'used', header: 'Amount Used', render: (row: BudgetRecord) => <span className="font-medium text-red-600">₹{row.used.toLocaleString('en-IN')}</span> },
    { key: 'committed', header: 'Committed', render: (row: BudgetRecord) => <span className="text-amber-700">₹{row.committed.toLocaleString('en-IN')}</span> },
    {
      key: 'remaining', header: 'Amount Remaining', render: (row: BudgetRecord) => {
        const remaining = row.allocated - row.used - row.committed;
        return <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>{remaining < 0 ? '−' : ''}₹{Math.abs(remaining).toLocaleString('en-IN')}</span>;
      }
    },
    {
      key: 'utilization', header: 'Utilization', render: (row: BudgetRecord) => {
        const percent = utilization(row);
        const color = percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-amber-500' : 'bg-green-500';
        return <div className="min-w-24"><p className="mb-1 text-xs text-gray-600">{percent}%</p><div className="h-2 rounded-full bg-gray-100"><div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} /></div></div>;
      }
    },
    { key: 'status', header: 'Status', render: (row: BudgetRecord) => <Badge variant={row.status === 'Exceeded' ? 'danger' : 'success'}>{row.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (row: BudgetRecord) => <div className="flex gap-1">
        <Button variant="ghost" size="xs" onClick={() => openEdit(row)} aria-label={`Edit ${row.head} budget`}><Edit className="w-4 h-4" /></Button>
        <Button variant="ghost" size="xs" onClick={() => handleDelete(row)} aria-label={`Delete ${row.head} budget`}><Trash2 className="w-4 h-4 text-red-500" /></Button>
      </div>
    }
  ];

  const exceededCount = filtered.filter((budget) => budget.used + budget.committed > budget.allocated).length;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Budget & Utilization</h1>
          <p className="text-sm text-gray-500 mt-1">Set category and expense-head budgets, then review actual use, commitments and remaining funds.</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Set Budget</Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Budget Amount', value: `₹${totalAllocated.toLocaleString('en-IN')}`, tone: 'text-blue-700' },
          { label: 'Amount Used', value: `₹${totalUsed.toLocaleString('en-IN')}`, tone: 'text-red-600' },
          { label: 'Committed', value: `₹${totalCommitted.toLocaleString('en-IN')}`, tone: 'text-amber-700' },
          { label: 'Amount Remaining', value: `₹${totalRemaining.toLocaleString('en-IN')}`, tone: totalRemaining < 0 ? 'text-red-600' : 'text-green-700' }
        ].map((stat) => <Card key={stat.label} className="p-4"><p className={`text-xl font-bold ${stat.tone}`}>{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></Card>)}
      </div>

      {exceededCount > 0 && <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4"><AlertTriangle className="w-5 h-5 text-red-600" /><p className="text-sm text-red-900">{exceededCount} category/head budget{exceededCount === 1 ? '' : 's'} has spending and commitments above its allocation.</p></div>}

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Search category or expense head..." value={search} onChange={(event) => setSearch(event.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          <Select value={yearFilter} onChange={setYearFilter} options={[{ value: 'all', label: 'All Financial Years' }, ...Array.from(new Set(budgets.map((budget) => budget.year))).map((year) => ({ value: year, label: `FY ${year}` }))]} />
          <Select value={categoryFilter} onChange={setCategoryFilter} options={[{ value: 'all', label: 'All Categories' }, ...categories.map((category) => ({ value: category, label: category }))]} />
          <Button variant="outline" onClick={() => { setSearch(''); setYearFilter('2025-26'); setCategoryFilter('all'); }}><RefreshCw className="w-4 h-4 mr-2" />Reset Filters</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><p className="text-sm text-gray-600">Showing {filtered.length} category/head budgets for {yearFilter === 'all' ? 'all financial years' : `FY ${yearFilter}`}</p></div>
        <Table columns={columns} data={filtered} />
        {filtered.length === 0 && <div className="p-10 text-center text-gray-500">No budgets match the selected filters.</div>}
      </Card>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
        <Card className="relative z-10 w-full max-w-xl p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div><h2 className="text-lg font-semibold">{editId ? 'Edit Expense Budget' : 'Set Expense Budget'}</h2><p className="text-xs text-gray-500 mt-1">Choose a category and expense head, then enter the allocation.</p></div>
            <Button variant="ghost" size="xs" onClick={closeModal} aria-label="Close budget form"><X className="w-5 h-5" /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5">
            <Select label="Financial Year *" value={form.year} onChange={(value) => setForm({ ...form, year: value })} options={['2025-26', '2026-27', '2024-25'].map((year) => ({ value: year, label: `FY ${year}` }))} />
            <Select label="Expense Category *" value={form.category} onChange={(value) => {
              const firstHead = heads.find((head) => head.category === value)?.name || '';
              setForm({ ...form, category: value, head: firstHead });
            }} options={categories.map((category) => ({ value: category, label: category }))} />
            <div className="md:col-span-2"><Select label="Expense Head *" value={form.head} onChange={(value) => {
              const selected = heads.find((head) => head.name === value);
              setForm({ ...form, head: value, category: selected?.category || form.category });
            }} options={formHeadOptions.map((head) => ({ value: head.name, label: `${head.code} — ${head.name}${head.isActive ? '' : ' (inactive / existing)'}` }))} /></div>
            <Input label="Budget Amount (₹) *" type="number" min="0" value={form.allocated} onChange={(event) => setForm({ ...form, allocated: event.target.value })} />
            <Input label="Amount Used (₹)" type="number" min="0" value={form.used} onChange={(event) => setForm({ ...form, used: event.target.value })} />
            <Input label="Committed Amount (₹)" type="number" min="0" value={form.committed} onChange={(event) => setForm({ ...form, committed: event.target.value })} />
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4"><Button variant="outline" onClick={closeModal}>Cancel</Button><Button variant="primary" onClick={handleSave}>{editId ? 'Update Budget' : 'Save Budget'}</Button></div>
        </Card>
      </div>}
    </div>
  );
}

export default ExpenseBudgetMaster;
