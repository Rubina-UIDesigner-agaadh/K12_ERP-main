import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  CheckCircle2,
  ListTree } from
'lucide-react';

// --- Types ---
interface ExpenseHead {
  id: string;
  name: string;
  code: string;
  parentGroup: string;
  isTaxApplicable: boolean;
  isActive: boolean;
}

// --- Mock Data ---
const PARENT_GROUPS = [
{ value: 'Administrative', label: 'Administrative Expenses' },
{ value: 'Academic', label: 'Academic / Educational' },
{ value: 'Maintenance', label: 'Repairs & Maintenance' },
{ value: 'Utilities', label: 'Utilities (Power/Water)' },
{ value: 'Events', label: 'Functions & Events' },
{ value: 'Staff Welfare', label: 'Staff Welfare' }];


const INITIAL_HEADS: ExpenseHead[] = [
{ id: '1', name: 'Building Repairs', code: 'MAIN-001', parentGroup: 'Maintenance', isTaxApplicable: true, isActive: true },
{ id: '2', name: 'Lab Chemicals', code: 'ACAD-001', parentGroup: 'Academic', isTaxApplicable: true, isActive: true },
{ id: '3', name: 'Electricity Charges', code: 'UTIL-001', parentGroup: 'Utilities', isTaxApplicable: false, isActive: true },
{ id: '4', name: 'Office Stationery', code: 'ADM-001', parentGroup: 'Administrative', isTaxApplicable: true, isActive: true },
{ id: '5', name: 'Staff Tea/Coffee', code: 'WELF-001', parentGroup: 'Staff Welfare', isTaxApplicable: false, isActive: true }];


export function ExpenseHeadMaster() {
  // --- State ---
  const [heads, setHeads] = useState<ExpenseHead[]>(INITIAL_HEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ExpenseHead>>({
    name: '',
    code: '',
    parentGroup: '',
    isTaxApplicable: false,
    isActive: true
  });

  // --- Derived Data ---
  const filteredHeads = useMemo(() => {
    return heads.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.parentGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [heads, searchQuery]);

  // --- Handlers ---

  const handleAddNew = () => {
    setFormData({
      name: '',
      code: '',
      parentGroup: '',
      isTaxApplicable: false,
      isActive: true
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (head: ExpenseHead) => {
    setFormData(head);
    setEditingId(head.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Expense Head?")) {
      setHeads((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.parentGroup) {
      alert("Name and Parent Group are required.");
      return;
    }

    if (editingId) {
      setHeads((prev) => prev.map((h) => h.id === editingId ? { ...formData, id: editingId } as ExpenseHead : h));
    } else {
      const newHead: ExpenseHead = {
        ...(formData as ExpenseHead),
        id: Math.random().toString(36).substr(2, 9),
        code: formData.code || `EXP-${Math.floor(Math.random() * 1000)}` // Auto-gen if empty
      };
      setHeads([...heads, newHead]);
    }
    setIsFormOpen(false);
  };

  // --- Columns ---
  const columns = [
  {
    key: 'name',
    header: 'Expense Head Name',
    render: (row: ExpenseHead) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">Code: {row.code}</div>
        </div>

  },
  {
    key: 'group',
    header: 'Parent Category',
    render: (row: ExpenseHead) =>
    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
           {row.parentGroup}
        </Badge>

  },
  {
    key: 'tax',
    header: 'Taxable?',
    render: (row: ExpenseHead) =>
    row.isTaxApplicable ?
    <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                <CheckCircle2 className="w-3 h-3 mr-1" /> GST Applicable
            </span> :

    <span className="text-xs text-gray-400">Exempt</span>


  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ExpenseHead) =>
    <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ExpenseHead) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tags className="w-6 h-6 text-indigo-600" />
            Expense Head Master
          </h1>
          <p className="text-sm text-gray-500">
            Define categories for expense tracking and reporting.
          </p>
        </div>
        {!isFormOpen &&
        <Button variant="primary" onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Head
            </Button>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: List View */}
        <div className={isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'}>
           <Card className="p-0 border-gray-200 h-full flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                 <Input
                placeholder="Search by Head, Code or Group..."
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

              </div>
              <div className="flex-1">
                 <Table columns={columns} data={filteredHeads} />
                 {filteredHeads.length === 0 &&
              <div className="p-10 text-center text-gray-400">
                       <ListTree className="w-12 h-12 mx-auto mb-2 opacity-20" />
                       <p>No expense heads found matching your search.</p>
                    </div>
              }
              </div>
           </Card>
        </div>

        {/* Right: Form Panel (Slide-in / Conditional) */}
        {isFormOpen &&
        <div className="lg:col-span-1 animate-in slide-in-from-right-4">
                <Card title={editingId ? "Edit Expense Head" : "New Expense Head"}>
                   <div className="space-y-4">
                      
                      <Input
                label="Head Name"
                placeholder="e.g. Building Repairs"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />


                      <Select
                label="Parent Group"
                required
                options={PARENT_GROUPS}
                value={formData.parentGroup}
                onChange={(e) => setFormData({ ...formData, parentGroup: e.target.value })} />


                      <Input
                label="Head Code (Optional)"
                placeholder="e.g. MAIN-001"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })} />


                      <div className="space-y-3 pt-2">
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                            <label className="text-sm font-medium text-gray-700">Tax / GST Applicable?</label>
                            <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.isTaxApplicable}
                    onChange={(e) => setFormData({ ...formData, isTaxApplicable: e.target.checked })} />

                         </div>
                         
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                            <label className="text-sm font-medium text-gray-700">Is Active?</label>
                            <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />

                         </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                          <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                              <X className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                          <Button variant="primary" className="flex-1" onClick={handleSave}>
                              <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                      </div>

                   </div>
                </Card>
            </div>
        }

      </div>
    </div>);

}