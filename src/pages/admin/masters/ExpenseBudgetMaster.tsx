import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  X,
  TrendingUp,
  AlertTriangle } from
'lucide-react';
const MOCK_BUDGETS = [
{
  id: 'BDG001',
  year: '2024-25',
  head: 'Staff Salary',
  category: 'Personnel',
  allocated: 5000000,
  spent: 3200000,
  committed: 400000,
  status: 'Active'
},
{
  id: 'BDG002',
  year: '2024-25',
  head: 'Utilities',
  category: 'Infrastructure',
  allocated: 200000,
  spent: 178000,
  committed: 15000,
  status: 'Active'
},
{
  id: 'BDG003',
  year: '2024-25',
  head: 'Building Maintenance',
  category: 'Infrastructure',
  allocated: 300000,
  spent: 285000,
  committed: 20000,
  status: 'Active'
},
{
  id: 'BDG004',
  year: '2024-25',
  head: 'Stationery & Supplies',
  category: 'Academic',
  allocated: 100000,
  spent: 45000,
  committed: 10000,
  status: 'Active'
},
{
  id: 'BDG005',
  year: '2024-25',
  head: 'Marketing & Advertising',
  category: 'Administrative',
  allocated: 150000,
  spent: 30000,
  committed: 0,
  status: 'Active'
},
{
  id: 'BDG006',
  year: '2024-25',
  head: 'Technology & IT',
  category: 'Technology',
  allocated: 250000,
  spent: 260000,
  committed: 0,
  status: 'Exceeded'
}];

export function ExpenseBudgetMaster() {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('2024-25');
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState<any>(null);
  const [form, setForm] = useState({
    year: '2024-25',
    head: '',
    category: '',
    allocated: ''
  });
  const openAdd = () => {
    setEditBudget(null);
    setForm({
      year: '2024-25',
      head: '',
      category: '',
      allocated: ''
    });
    setShowModal(true);
  };
  const openEdit = (b: any) => {
    setEditBudget(b);
    setForm({
      year: b.year,
      head: b.head,
      category: b.category,
      allocated: String(b.allocated)
    });
    setShowModal(true);
  };
  const filtered = MOCK_BUDGETS.filter((b) => {
    const matchSearch =
    !search || b.head.toLowerCase().includes(search.toLowerCase());
    const matchYear = !yearFilter || b.year === yearFilter;
    return matchSearch && matchYear;
  });
  const getUsagePercent = (b: any) =>
  Math.round((b.spent + b.committed) / b.allocated * 100);
  const getBarColor = (pct: number) =>
  pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-green-500';
  const totalAllocated = filtered.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = filtered.reduce((s, b) => s + b.spent, 0);
  const columns = [
  {
    key: 'head',
    header: 'Expense Head',
    render: (r: any) =>
    <div>
          <p className="font-medium text-gray-900">{r.head}</p>
          <p className="text-xs text-gray-500">{r.category}</p>
        </div>

  },
  {
    key: 'allocated',
    header: 'Allocated (₹)',
    render: (r: any) =>
    <span className="font-semibold">₹{r.allocated.toLocaleString()}</span>

  },
  {
    key: 'spent',
    header: 'Spent (₹)',
    render: (r: any) =>
    <span className="text-red-600 font-medium">
          ₹{r.spent.toLocaleString()}
        </span>

  },
  {
    key: 'committed',
    header: 'Committed (₹)',
    render: (r: any) =>
    <span className="text-amber-600">₹{r.committed.toLocaleString()}</span>

  },
  {
    key: 'balance',
    header: 'Balance (₹)',
    render: (r: any) => {
      const bal = r.allocated - r.spent - r.committed;
      return (
        <span
          className={`font-semibold ${bal < 0 ? 'text-red-600' : 'text-green-600'}`}>

            ₹{Math.abs(bal).toLocaleString()}
            {bal < 0 ? ' (Over)' : ''}
          </span>);

    }
  },
  {
    key: 'usage',
    header: 'Usage',
    render: (r: any) => {
      const pct = getUsagePercent(r);
      return (
        <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span
              className={
              pct >= 100 ? 'text-red-600 font-bold' : 'text-gray-600'
              }>

                {pct}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
              className={`h-2 rounded-full ${getBarColor(pct)}`}
              style={{
                width: `${Math.min(pct, 100)}%`
              }} />

            </div>
          </div>);

    }
  },
  {
    key: 'status',
    header: 'Status',
    render: (r: any) =>
    <Badge
      variant={
      r.status === 'Active' ?
      'success' :
      r.status === 'Exceeded' ?
      'danger' :
      'secondary'
      }>

          {r.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (r: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => openEdit(r)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Expense Budget Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Define and track annual expense budgets by head and category
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Allocated',
          value: `₹${(totalAllocated / 100000).toFixed(1)}L`,
          color: 'blue'
        },
        {
          label: 'Total Spent',
          value: `₹${(totalSpent / 100000).toFixed(1)}L`,
          color: 'red'
        },
        {
          label: 'Utilization',
          value: `${Math.round(totalSpent / totalAllocated * 100)}%`,
          color: 'purple'
        },
        {
          label: 'Exceeded Heads',
          value: MOCK_BUDGETS.filter((b) => b.status === 'Exceeded').length,
          color: 'amber'
        }].
        map((s) =>
        <Card key={s.label} className="p-4">
            <p className={`text-2xl font-bold text-${s.color}-600`}>
              {s.value}
            </p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Card>
        )}
      </div>

      {MOCK_BUDGETS.some((b) => b.status === 'Exceeded') &&
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-900 font-medium">
            {MOCK_BUDGETS.filter((b) => b.status === 'Exceeded').length} budget
            head(s) have exceeded their allocated amount. Please review and
            reallocate.
          </p>
        </div>
      }

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search expense head..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Select
            options={['2024-25', '2023-24', '2022-23'].map((y) => ({
              value: y,
              label: y
            }))}
            value={yearFilter}
            onChange={setYearFilter} />

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
            }}>

            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} budget entries for {yearFilter}
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[450px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editBudget ? 'Edit Budget' : 'Add Budget'}
              </h2>
              <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowModal(false)}>

                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <Select
              label="Financial Year *"
              options={['2024-25', '2023-24', '2025-26'].map((y) => ({
                value: y,
                label: y
              }))}
              value={form.year}
              onChange={(v) =>
              setForm({
                ...form,
                year: v
              })
              } />

              <Input
              label="Expense Head *"
              value={form.head}
              onChange={(e) =>
              setForm({
                ...form,
                head: e.target.value
              })
              } />

              <Select
              label="Category *"
              options={[
              'Personnel',
              'Infrastructure',
              'Academic',
              'Administrative',
              'Technology',
              'Events',
              'Miscellaneous'].
              map((c) => ({
                value: c,
                label: c
              }))}
              value={form.category}
              onChange={(v) =>
              setForm({
                ...form,
                category: v
              })
              } />

              <Input
              label="Allocated Amount (₹) *"
              type="number"
              value={form.allocated}
              onChange={(e) =>
              setForm({
                ...form,
                allocated: e.target.value
              })
              } />

            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editBudget ? 'Update' : 'Add Budget'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}