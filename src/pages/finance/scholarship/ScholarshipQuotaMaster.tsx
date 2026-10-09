import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Settings2,
  Plus,
  Save,
  Trash2,
  Edit2,
  Users,
  Banknote,
  RotateCcw } from
'lucide-react';

// --- Types ---
interface QuotaRule {
  id: string;
  category: string;
  schemeId: string; // Which scheme this quota applies to
  schemeName: string;
  maxStudents: number;
  maxBudget: number;
  isActive: boolean;
}

// --- Mock Data ---
const SCHEMES = [
{ value: 'scheme_1', label: 'Merit Excellence 2024' },
{ value: 'scheme_2', label: 'State Govt Support' }];


const CATEGORIES = [
{ value: 'SC', label: 'Scheduled Caste (SC)' },
{ value: 'ST', label: 'Scheduled Tribe (ST)' },
{ value: 'OBC', label: 'Other Backward Class (OBC)' },
{ value: 'General', label: 'General / Open' },
{ value: 'EWS', label: 'Economically Weaker Section' }];


const INITIAL_QUOTAS: QuotaRule[] = [
{
  id: '1',
  schemeId: 'scheme_2',
  schemeName: 'State Govt Support',
  category: 'SC',
  maxStudents: 50,
  maxBudget: 500000,
  isActive: true
},
{
  id: '2',
  schemeId: 'scheme_2',
  schemeName: 'State Govt Support',
  category: 'ST',
  maxStudents: 30,
  maxBudget: 300000,
  isActive: true
},
{
  id: '3',
  schemeId: 'scheme_1',
  schemeName: 'Merit Excellence 2024',
  category: 'General',
  maxStudents: 100,
  maxBudget: 1000000,
  isActive: true
}];


export function ScholarshipQuotaMaster() {
  // --- State ---
  const [quotas, setQuotas] = useState<QuotaRule[]>(INITIAL_QUOTAS);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<QuotaRule>>({
    schemeId: '',
    category: '',
    maxStudents: 0,
    maxBudget: 0,
    isActive: true
  });

  // --- Handlers ---

  const handleEdit = (rule: QuotaRule) => {
    setFormData(rule);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quota rule?")) {
      setQuotas((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleReset = () => {
    setFormData({
      schemeId: '',
      category: '',
      maxStudents: 0,
      maxBudget: 0,
      isActive: true
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formData.schemeId || !formData.category || !formData.maxStudents || !formData.maxBudget) {
      alert("Please fill all fields correctly.");
      return;
    }

    const schemeName = SCHEMES.find((s) => s.value === formData.schemeId)?.label || '';

    if (isEditing && formData.id) {
      // Update
      setQuotas((prev) => prev.map((q) => q.id === formData.id ? { ...formData, schemeName } as QuotaRule : q));
    } else {
      // Create
      // Check for duplicate
      const exists = quotas.find((q) => q.schemeId === formData.schemeId && q.category === formData.category);
      if (exists) {
        alert("A quota for this Scheme and Category already exists.");
        return;
      }

      const newRule: QuotaRule = {
        ...(formData as QuotaRule),
        id: Math.random().toString(36).substr(2, 9),
        schemeName
      };
      setQuotas([...quotas, newRule]);
    }

    handleReset();
  };

  // --- Columns ---
  const columns = [
  {
    key: 'scheme',
    header: 'Scholarship Scheme',
    render: (row: QuotaRule) =>
    <span className="font-medium text-gray-900">{row.schemeName}</span>

  },
  {
    key: 'category',
    header: 'Social Category',
    render: (row: QuotaRule) =>
    <Badge variant="outline" className="bg-gray-50 text-gray-700 font-bold border-gray-300">
          {row.category}
        </Badge>

  },
  {
    key: 'limits',
    header: 'Defined Limits',
    render: (row: QuotaRule) =>
    <div className="space-y-1">
           <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-3 h-3 text-blue-500" />
              <span>Max Students: <strong>{row.maxStudents}</strong></span>
           </div>
           <div className="flex items-center gap-2 text-sm text-gray-700">
              <Banknote className="w-3 h-3 text-green-500" />
              <span>Max Budget: <strong>₹{row.maxBudget.toLocaleString()}</strong></span>
           </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: QuotaRule) =>
    <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: QuotaRule) =>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-gray-600" />
            Scholarship Quota Master
          </h1>
          <p className="text-sm text-gray-500">
            Define intake limits and budget caps per social category for specific schemes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Form Panel */}
        <div className="lg:col-span-1">
          <Card title={isEditing ? "Edit Quota Rule" : "Add New Quota"}>
             <div className="space-y-4">
                <Select
                label="Select Scheme"
                options={SCHEMES}
                value={formData.schemeId}
                onChange={(e) => setFormData({ ...formData, schemeId: e.target.value })}
                disabled={isEditing} // Prevent changing scheme during edit key
              />
                
                <Select
                label="Target Category"
                options={CATEGORIES}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isEditing} // Prevent changing category during edit key
              />

                <div className="grid grid-cols-2 gap-4">
                   <Input
                  type="number"
                  label="Max Students"
                  placeholder="e.g. 50"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })} />

                   <Input
                  type="number"
                  label="Max Budget (₹)"
                  placeholder="e.g. 10000"
                  value={formData.maxBudget}
                  onChange={(e) => setFormData({ ...formData, maxBudget: Number(e.target.value) })} />

                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Quota Rule is Active</label>
                </div>

                <div className="flex gap-2 pt-4">
                   {isEditing &&
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                         <RotateCcw className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                }
                   <Button variant="primary" className="flex-1" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" /> 
                      {isEditing ? "Update Quota" : "Save Quota"}
                   </Button>
                </div>
             </div>
          </Card>
        </div>

        {/* Right: Data Grid */}
        <div className="lg:col-span-2">
           <Card className="h-full p-0 border-gray-200">
              <Table columns={columns} data={quotas} />
              
              {quotas.length === 0 &&
            <div className="p-8 text-center text-gray-500">
                    No quotas defined yet. Use the form to add limits.
                 </div>
            }
           </Card>
        </div>

      </div>
    </div>);

}