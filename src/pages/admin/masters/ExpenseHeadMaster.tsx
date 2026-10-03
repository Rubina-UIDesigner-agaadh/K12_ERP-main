import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Plus, Edit, Trash2, Search, RefreshCw, X } from 'lucide-react';
const MOCK_HEADS = [
{
  id: 'EH001',
  code: 'SALARY',
  name: 'Staff Salary',
  category: 'Personnel',
  glAccount: '5001',
  taxable: false,
  requiresBill: false,
  status: 'Active',
  budgetAllocated: 5000000
},
{
  id: 'EH002',
  code: 'UTIL',
  name: 'Utilities (Electricity, Water)',
  category: 'Infrastructure',
  glAccount: '5010',
  taxable: false,
  requiresBill: true,
  status: 'Active',
  budgetAllocated: 200000
},
{
  id: 'EH003',
  code: 'MAINT',
  name: 'Building Maintenance',
  category: 'Infrastructure',
  glAccount: '5020',
  taxable: true,
  requiresBill: true,
  status: 'Active',
  budgetAllocated: 300000
},
{
  id: 'EH004',
  code: 'STATY',
  name: 'Stationery & Supplies',
  category: 'Academic',
  glAccount: '5030',
  taxable: true,
  requiresBill: true,
  status: 'Active',
  budgetAllocated: 100000
},
{
  id: 'EH005',
  code: 'TRVL',
  name: 'Staff Travel & Conveyance',
  category: 'Personnel',
  glAccount: '5040',
  taxable: false,
  requiresBill: false,
  status: 'Active',
  budgetAllocated: 80000
},
{
  id: 'EH006',
  code: 'MKTG',
  name: 'Marketing & Advertising',
  category: 'Administrative',
  glAccount: '5050',
  taxable: true,
  requiresBill: true,
  status: 'Inactive',
  budgetAllocated: 150000
}];

const CATEGORIES = [
'Personnel',
'Infrastructure',
'Academic',
'Administrative',
'Technology',
'Events',
'Miscellaneous'];

export function ExpenseHeadMaster() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editHead, setEditHead] = useState<any>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: '',
    glAccount: '',
    taxable: false,
    requiresBill: true,
    status: 'Active'
  });
  const openAdd = () => {
    setEditHead(null);
    setForm({
      code: '',
      name: '',
      category: '',
      glAccount: '',
      taxable: false,
      requiresBill: true,
      status: 'Active'
    });
    setShowModal(true);
  };
  const openEdit = (h: any) => {
    setEditHead(h);
    setForm({
      code: h.code,
      name: h.name,
      category: h.category,
      glAccount: h.glAccount,
      taxable: h.taxable,
      requiresBill: h.requiresBill,
      status: h.status
    });
    setShowModal(true);
  };
  const filtered = MOCK_HEADS.filter((h) => {
    const matchSearch =
    !search ||
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || h.category === categoryFilter;
    return matchSearch && matchCat;
  });
  const columns = [
  {
    key: 'code',
    header: 'Code',
    render: (r: any) =>
    <span className="font-mono text-sm font-semibold text-gray-700">
          {r.code}
        </span>

  },
  {
    key: 'name',
    header: 'Expense Head Name',
    render: (r: any) =>
    <span className="font-medium text-gray-900">{r.name}</span>

  },
  {
    key: 'category',
    header: 'Category',
    render: (r: any) => <Badge variant="info">{r.category}</Badge>
  },
  {
    key: 'glAccount',
    header: 'GL Account',
    render: (r: any) =>
    <span className="font-mono text-sm text-gray-600">{r.glAccount}</span>

  },
  {
    key: 'budget',
    header: 'Budget Allocated',
    render: (r: any) =>
    <span className="text-sm font-semibold">
          ₹{r.budgetAllocated.toLocaleString()}
        </span>

  },
  {
    key: 'taxable',
    header: 'Taxable',
    render: (r: any) =>
    <Badge variant={r.taxable ? 'warning' : 'secondary'}>
          {r.taxable ? 'Yes' : 'No'}
        </Badge>

  },
  {
    key: 'requiresBill',
    header: 'Bill Required',
    render: (r: any) =>
    <Badge variant={r.requiresBill ? 'info' : 'secondary'}>
          {r.requiresBill ? 'Yes' : 'No'}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (r: any) =>
    <Badge variant={r.status === 'Active' ? 'success' : 'secondary'}>
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
            Expense Head Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Define expense categories and GL account mappings
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense Head
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Heads',
          value: MOCK_HEADS.length,
          color: 'blue'
        },
        {
          label: 'Active',
          value: MOCK_HEADS.filter((h) => h.status === 'Active').length,
          color: 'green'
        },
        {
          label: 'Total Budget',
          value: `₹${(MOCK_HEADS.reduce((s, h) => s + h.budgetAllocated, 0) / 100000).toFixed(1)}L`,
          color: 'purple'
        },
        {
          label: 'Categories',
          value: new Set(MOCK_HEADS.map((h) => h.category)).size,
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

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Select
            placeholder="Filter by Category"
            options={CATEGORIES.map((c) => ({
              value: c,
              label: c
            }))}
            value={categoryFilter}
            onChange={setCategoryFilter} />

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
            }}>

            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} expense heads
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editHead ? 'Edit Expense Head' : 'Add Expense Head'}
              </h2>
              <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowModal(false)}>

                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Head Code *"
                value={form.code}
                onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase()
                })
                }
                placeholder="e.g., SALARY" />

                <Select
                label="Category *"
                options={CATEGORIES.map((c) => ({
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

              </div>
              <Input
              label="Expense Head Name *"
              value={form.name}
              onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
              } />

              <Input
              label="GL Account Code"
              value={form.glAccount}
              onChange={(e) =>
              setForm({
                ...form,
                glAccount: e.target.value
              })
              }
              placeholder="e.g., 5001" />

              <div className="grid grid-cols-2 gap-4">
                <Toggle
                label="Taxable (GST Applicable)"
                checked={form.taxable}
                onChange={(v) =>
                setForm({
                  ...form,
                  taxable: v
                })
                } />

                <Toggle
                label="Bill/Receipt Required"
                checked={form.requiresBill}
                onChange={(v) =>
                setForm({
                  ...form,
                  requiresBill: v
                })
                } />

              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editHead ? 'Update' : 'Add Expense Head'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}