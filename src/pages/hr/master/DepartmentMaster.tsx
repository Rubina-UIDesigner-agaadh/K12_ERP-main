import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Building2,
  ChevronRight,
  ChevronDown,
  Users } from
'lucide-react';
interface Department {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: 'Academic' | 'Administrative' | 'Support' | 'Other';
  parentId: string | null;
  campus: string;
  headOfDepartment: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Inactive';
  children?: Department[];
}
const mockDepartments: Department[] = [
{
  id: 'D001',
  code: 'SCI',
  name: 'Science Department',
  shortName: 'Science',
  type: 'Academic',
  parentId: null,
  campus: 'Main Campus',
  headOfDepartment: 'Dr. Rajesh Kumar',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active',
  children: [
  {
    id: 'D002',
    code: 'PHY',
    name: 'Physics',
    shortName: 'Physics',
    type: 'Academic',
    parentId: 'D001',
    campus: 'Main Campus',
    headOfDepartment: 'Prof. Amit Sharma',
    effectiveFrom: '2024-01-01',
    effectiveTo: '2025-12-31',
    status: 'Active'
  },
  {
    id: 'D003',
    code: 'CHEM',
    name: 'Chemistry',
    shortName: 'Chemistry',
    type: 'Academic',
    parentId: 'D001',
    campus: 'Main Campus',
    headOfDepartment: 'Dr. Priya Patel',
    effectiveFrom: '2024-01-01',
    effectiveTo: '2025-12-31',
    status: 'Active'
  }]

},
{
  id: 'D004',
  code: 'ARTS',
  name: 'Arts & Humanities',
  shortName: 'Arts',
  type: 'Academic',
  parentId: null,
  campus: 'Main Campus',
  headOfDepartment: 'Prof. Sunita Mehta',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
},
{
  id: 'D005',
  code: 'ADMIN',
  name: 'Administration',
  shortName: 'Admin',
  type: 'Administrative',
  parentId: null,
  campus: 'Main Campus',
  headOfDepartment: 'Mr. Vikram Singh',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
},
{
  id: 'D006',
  code: 'SUPP',
  name: 'Support Services',
  shortName: 'Support',
  type: 'Support',
  parentId: null,
  campus: 'Main Campus',
  headOfDepartment: 'Mr. Ramesh Gupta',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2025-12-31',
  status: 'Active'
}];

export function DepartmentMaster() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>(['D001']);
  const [form, setForm] = useState({
    code: '',
    name: '',
    shortName: '',
    type: 'Academic' as const,
    parentId: '',
    campus: 'Main Campus',
    headOfDepartment: '',
    effectiveFrom: '',
    effectiveTo: ''
  });
  const filtered = departments.filter((d) => {
    const matchSearch =
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || d.type === typeFilter;
    return matchSearch && matchType;
  });
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      shortName: '',
      type: 'Academic',
      parentId: '',
      campus: 'Main Campus',
      headOfDepartment: '',
      effectiveFrom: '',
      effectiveTo: ''
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      const updateDept = (depts: Department[]): Department[] =>
      depts.map((d) =>
      d.id === editId ?
      {
        ...d,
        ...form
      } :
      {
        ...d,
        children: d.children ? updateDept(d.children) : []
      }
      );
      setDepartments(updateDept(departments));
    } else {
      const newDept: Department = {
        ...form,
        id: `D${Date.now()}`,
        status: 'Active'
      };
      setDepartments([...departments, newDept]);
    }
    resetForm();
  };
  const handleEdit = (dept: Department) => {
    setForm({
      code: dept.code,
      name: dept.name,
      shortName: dept.shortName,
      type: dept.type,
      parentId: dept.parentId || '',
      campus: dept.campus,
      headOfDepartment: dept.headOfDepartment,
      effectiveFrom: dept.effectiveFrom,
      effectiveTo: dept.effectiveTo
    });
    setEditId(dept.id);
    setShowForm(true);
  };
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const renderDepartment = (dept: Department, level: number = 0) =>
  <div key={dept.id}>
      <div
      className={`flex items-center justify-between py-3 px-4 border-b border-gray-100 hover:bg-gray-50 ${level > 0 ? 'bg-gray-50/50' : ''}`}
      style={{
        paddingLeft: `${level * 2 + 1}rem`
      }}>

        <div className="flex items-center gap-3 flex-1">
          {dept.children && dept.children.length > 0 ?
        <button
          onClick={() => toggleExpand(dept.id)}
          className="p-1 hover:bg-gray-200 rounded">

              {expandedIds.includes(dept.id) ?
          <ChevronDown className="w-4 h-4 text-gray-500" /> :

          <ChevronRight className="w-4 h-4 text-gray-500" />
          }
            </button> :

        <div className="w-6" />
        }
          <Building2 className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{dept.name}</p>
            <p className="text-xs text-gray-500">
              {dept.code} · {dept.shortName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge
          variant={
          dept.type === 'Academic' ?
          'info' :
          dept.type === 'Administrative' ?
          'secondary' :
          'secondary'
          }>

            {dept.type}
          </Badge>
          <span className="text-sm text-gray-600 w-32">{dept.campus}</span>
          <span className="text-sm text-gray-600 w-40 truncate">
            {dept.headOfDepartment}
          </span>
          <Badge variant={dept.status === 'Active' ? 'success' : 'secondary'}>
            {dept.status}
          </Badge>
          <div className="flex items-center gap-1">
            <button
            onClick={() => handleEdit(dept)}
            className="p-1.5 hover:bg-blue-100 rounded-lg"
            title="Edit">

              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            <button
            className="p-1.5 hover:bg-red-100 rounded-lg"
            title="Delete">

              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
      {dept.children &&
    expandedIds.includes(dept.id) &&
    dept.children.map((child) => renderDepartment(child, level + 1))}
    </div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Department Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage academic and administrative departments
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{departments.length}</p>
            <p className="text-xs text-gray-500">Total Departments</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {
              departments.filter(
                (d) => d.type === 'Academic' && d.status === 'Active'
              ).length
              }
            </p>
            <p className="text-xs text-gray-500">Academic</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {
              departments.filter(
                (d) => d.type === 'Administrative' && d.status === 'Active'
              ).length
              }
            </p>
            <p className="text-xs text-gray-500">Administrative</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {
              departments.filter(
                (d) => d.type === 'Support' && d.status === 'Active'
              ).length
              }
            </p>
            <p className="text-xs text-gray-500">Support</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Department' : 'Add New Department'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Department Code *"
            value={form.code}
            onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value
            })
            }
            placeholder="e.g., SCI" />

            <Input
            label="Department Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., Science Department" />

            <Input
            label="Short Name"
            value={form.shortName}
            onChange={(e) =>
            setForm({
              ...form,
              shortName: e.target.value
            })
            }
            placeholder="e.g., Science" />

            <Select
            label="Department Type *"
            options={[
            {
              value: 'Academic',
              label: 'Academic'
            },
            {
              value: 'Administrative',
              label: 'Administrative'
            },
            {
              value: 'Support',
              label: 'Support'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={form.type}
            onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as any
            })
            } />

            <Select
            label="Parent Department"
            options={[
            {
              value: '',
              label: 'None (Top Level)'
            },
            ...departments.map((d) => ({
              value: d.id,
              label: d.name
            }))]
            }
            value={form.parentId}
            onChange={(e) =>
            setForm({
              ...form,
              parentId: e.target.value
            })
            } />

            <Input
            label="Campus"
            value={form.campus}
            onChange={(e) =>
            setForm({
              ...form,
              campus: e.target.value
            })
            } />

            <Input
            label="Head of Department"
            value={form.headOfDepartment}
            onChange={(e) =>
            setForm({
              ...form,
              headOfDepartment: e.target.value
            })
            }
            placeholder="Select employee" />

            <div />
            <Input
            label="Effective From"
            type="date"
            value={form.effectiveFrom}
            onChange={(e) =>
            setForm({
              ...form,
              effectiveFrom: e.target.value
            })
            } />

            <Input
            label="Effective To"
            type="date"
            value={form.effectiveTo}
            onChange={(e) =>
            setForm({
              ...form,
              effectiveTo: e.target.value
            })
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Department
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: '',
              label: 'All Types'
            },
            {
              value: 'Academic',
              label: 'Academic'
            },
            {
              value: 'Administrative',
              label: 'Administrative'
            },
            {
              value: 'Support',
              label: 'Support'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)} />

        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b-2 border-gray-200 py-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-6" />
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Department
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-600 uppercase w-24">
                Type
              </span>
              <span className="text-xs font-semibold text-gray-600 uppercase w-32">
                Campus
              </span>
              <span className="text-xs font-semibold text-gray-600 uppercase w-40">
                Head
              </span>
              <span className="text-xs font-semibold text-gray-600 uppercase w-20">
                Status
              </span>
              <span className="text-xs font-semibold text-gray-600 uppercase w-20">
                Actions
              </span>
            </div>
          </div>
          {filtered.map((dept) => renderDepartment(dept))}
        </div>
      </Card>
    </div>);

}