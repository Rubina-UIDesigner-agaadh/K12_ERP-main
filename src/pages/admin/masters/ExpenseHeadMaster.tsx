import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2, Edit2, ListTree, Plus, Search, Tags, Trash2, X } from 'lucide-react';
import { EXPENSE_MASTER_UPDATED_EVENT, getExpenseMasterData, saveExpenseMasterData } from '../../finance/expenses/expenseMasterData';
import type { ExpenseMasterHead } from '../../finance/expenses/expenseMasterData';

const EMPTY_FORM = {
  code: '',
  name: '',
  category: '',
  glAccount: '',
  isTaxApplicable: false,
  requiresBill: true,
  isActive: true
};

export function ExpenseHeadMaster() {
  const [heads, setHeads] = useState<ExpenseMasterHead[]>(() => getExpenseMasterData().heads);
  const [categories, setCategories] = useState<string[]>(() => getExpenseMasterData().categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const refreshMaster = () => {
      const latest = getExpenseMasterData();
      setHeads(latest.heads);
      setCategories(latest.categories);
    };
    window.addEventListener(EXPENSE_MASTER_UPDATED_EVENT, refreshMaster);
    return () => window.removeEventListener(EXPENSE_MASTER_UPDATED_EVENT, refreshMaster);
  }, []);

  const persistMaster = (nextHeads: ExpenseMasterHead[], nextCategories: string[]) => {
    setHeads(nextHeads);
    setCategories(nextCategories);
    saveExpenseMasterData({ heads: nextHeads, categories: nextCategories });
  };

  const filteredHeads = useMemo(() => heads.filter((head) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [head.name, head.code, head.category, head.glAccount]
      .some((value) => value.toLowerCase().includes(query));
    const matchesCategory = categoryFilter === 'all' || head.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }), [heads, searchQuery, categoryFilter]);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM, category: categories[0] || '' });
    setIsFormOpen(true);
  };

  const openEdit = (head: ExpenseMasterHead) => {
    setEditingId(head.id);
    setFormData({
      code: head.code,
      name: head.name,
      category: head.category,
      glAccount: head.glAccount || '',
      isTaxApplicable: head.isTaxApplicable,
      requiresBill: head.requiresBill,
      isActive: head.isActive
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSaveHead = () => {
    const name = formData.name.trim();
    const category = formData.category.trim();
    const code = formData.code.trim().toUpperCase() || `EXP-${Date.now().toString().slice(-6)}`;
    if (!name || !category) {
      alert('Expense head name and category are required.');
      return;
    }
    if (heads.some((head) => head.code.toUpperCase() === code && head.id !== editingId)) {
      alert(`Expense head code ${code} is already in use.`);
      return;
    }

    const updated: ExpenseMasterHead = {
      id: editingId || `EH-${Date.now()}`,
      code,
      name,
      category,
      glAccount: formData.glAccount.trim(),
      isTaxApplicable: formData.isTaxApplicable,
      requiresBill: formData.requiresBill,
      isActive: formData.isActive,
      budgetAllocated: editingId ? heads.find((head) => head.id === editingId)?.budgetAllocated : undefined
    };
    const nextHeads = editingId
      ? heads.map((head) => head.id === editingId ? updated : head)
      : [updated, ...heads];
    const nextCategories = categories.includes(category) ? categories : [...categories, category];
    persistMaster(nextHeads, nextCategories);
    closeForm();
  };

  const handleDeleteHead = (head: ExpenseMasterHead) => {
    if (!confirm(`Delete expense head “${head.name}”?`)) return;
    persistMaster(heads.filter((item) => item.id !== head.id), categories);
  };

  const handleAddCategory = () => {
    const category = newCategoryName.trim();
    if (!category) return;
    if (categories.some((item) => item.toLowerCase() === category.toLowerCase())) {
      alert('That expense category already exists.');
      return;
    }
    persistMaster(heads, [...categories, category]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (category: string) => {
    if (heads.some((head) => head.category === category)) {
      alert('This category is assigned to one or more expense heads. Reassign those heads before deleting it.');
      return;
    }
    if (!confirm(`Delete the “${category}” expense category?`)) return;
    const nextCategories = categories.filter((item) => item !== category);
    persistMaster(heads, nextCategories);
    if (categoryFilter === category) setCategoryFilter('all');
  };

  const columns = [
    {
      key: 'head',
      header: 'Expense Head',
      render: (row: ExpenseMasterHead) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500 font-mono">{row.code}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Expense Category',
      render: (row: ExpenseMasterHead) => <Badge variant="info">{row.category}</Badge>
    },
    {
      key: 'glAccount',
      header: 'GL Account',
      render: (row: ExpenseMasterHead) => <span className="font-mono text-sm text-gray-600">{row.glAccount || '—'}</span>
    },
    {
      key: 'tax',
      header: 'GST',
      render: (row: ExpenseMasterHead) => row.isTaxApplicable
        ? <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3 mr-1" />Applicable</span>
        : <span className="text-xs text-gray-400">Exempt</span>
    },
    {
      key: 'requiresBill',
      header: 'Bill Required',
      render: (row: ExpenseMasterHead) => <Badge variant={row.requiresBill ? 'secondary' : 'outline'}>{row.requiresBill ? 'Yes' : 'No'}</Badge>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ExpenseMasterHead) => <Badge variant={row.isActive ? 'success' : 'secondary'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ExpenseMasterHead) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`}><Edit2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="xs" onClick={() => handleDeleteHead(row)} aria-label={`Delete ${row.name}`}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      )
    }
  ];

  const activeCount = heads.filter((head) => head.isActive).length;
  const totalBudget = heads.reduce((sum, head) => sum + (head.budgetAllocated || 0), 0);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Tags className="w-6 h-6 text-indigo-600" />Expense Head & Category Master</h1>
          <p className="text-sm text-gray-500 mt-1">Create the expense categories and heads used by expense requests and entries.</p>
        </div>
        {!isFormOpen && <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Expense Head</Button>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Expense Heads', value: heads.length, tone: 'text-blue-600' },
          { label: 'Active Heads', value: activeCount, tone: 'text-green-600' },
          { label: 'Expense Categories', value: categories.length, tone: 'text-amber-600' },
          { label: 'Budget Allocated', value: `₹${(totalBudget / 100000).toFixed(1)}L`, tone: 'text-purple-600' }
        ].map((stat) => <Card key={stat.label} className="p-4"><p className={`text-2xl font-bold ${stat.tone}`}>{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></Card>)}
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Search by head, code, category..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
            <Select value={categoryFilter} onChange={setCategoryFilter} options={[{ value: 'all', label: 'All Categories' }, ...categories.map((category) => ({ value: category, label: category }))]} />
          </div>
          <div className="flex gap-2">
            <Input placeholder="New expense category" value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} />
            <Button variant="outline" onClick={handleAddCategory}><Plus className="w-4 h-4 mr-1" />Add Category</Button>
          </div>
        </div>
        {categories.length > 0 && <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
          {categories.map((category) => <span key={category} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600">
            {category}<button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteCategory(category)} aria-label={`Delete ${category} category`}><X className="w-3 h-3" /></button>
          </span>)}
        </div>}
      </Card>

      <div className={`grid grid-cols-1 ${isFormOpen ? 'xl:grid-cols-3' : ''} gap-6`}>
        <Card className={`p-0 overflow-hidden ${isFormOpen ? 'xl:col-span-2' : ''}`}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing {filteredHeads.length} of {heads.length} expense heads</p>
            <ListTree className="w-4 h-4 text-gray-400" />
          </div>
          <Table columns={columns} data={filteredHeads} />
          {filteredHeads.length === 0 && <div className="p-10 text-center text-gray-400"><ListTree className="w-12 h-12 mx-auto mb-2 opacity-20" /><p>No expense heads found. Add a head in this master to use it in an expense entry.</p></div>}
        </Card>

        {isFormOpen && <Card className="p-5 space-y-4" title={editingId ? 'Edit Expense Head' : 'New Expense Head'}>
          <div className="flex justify-end"><Button variant="ghost" size="xs" onClick={closeForm} aria-label="Close expense head form"><X className="w-4 h-4" /></Button></div>
          <Input label="Expense Head Name *" placeholder="e.g. Building Repairs" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Head Code" placeholder="Auto-generated if blank" value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value.toUpperCase() })} />
            <Select label="Expense Category *" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} options={categories.map((category) => ({ value: category, label: category }))} />
          </div>
          <Input label="GL Account Code" placeholder="e.g. 5001" value={formData.glAccount} onChange={(event) => setFormData({ ...formData, glAccount: event.target.value })} />
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm text-gray-700"><span>Tax / GST Applicable</span><input type="checkbox" checked={formData.isTaxApplicable} onChange={(event) => setFormData({ ...formData, isTaxApplicable: event.target.checked })} /></label>
            <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm text-gray-700"><span>Bill / Receipt Required</span><input type="checkbox" checked={formData.requiresBill} onChange={(event) => setFormData({ ...formData, requiresBill: event.target.checked })} /></label>
            <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm text-gray-700"><span>Active</span><input type="checkbox" checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })} /></label>
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveHead}><CheckCircle2 className="w-4 h-4 mr-2" />{editingId ? 'Update Head' : 'Save Expense Head'}</Button>
          </div>
        </Card>}
      </div>
    </div>
  );
}

export default ExpenseHeadMaster;
