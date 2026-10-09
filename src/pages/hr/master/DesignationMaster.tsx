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
  Briefcase,
  Copy,
  CheckCircle,
  XCircle } from
'lucide-react';
interface Designation {
  id: string;
  code: string;
  name: string;
  shortName: string;
  defaultDepartment: string;
  defaultStaffType: string;
  defaultGrade: string;
  isTeaching: boolean;
  isManagerial: boolean;
  defaultPayScale: string;
  defaultRole: string;
  status: 'Active' | 'Inactive';
  createdOn: string;
}
const mockDesignations: Designation[] = [
{
  id: 'DES001',
  code: 'PRIN',
  name: 'Principal',
  shortName: 'Principal',
  defaultDepartment: 'Administration',
  defaultStaffType: 'Teaching',
  defaultGrade: 'Grade I',
  isTeaching: true,
  isManagerial: true,
  defaultPayScale: 'PS-A',
  defaultRole: 'Academic Head',
  status: 'Active',
  createdOn: '2024-01-15'
},
{
  id: 'DES002',
  code: 'HOD',
  name: 'Head of Department',
  shortName: 'HOD',
  defaultDepartment: '',
  defaultStaffType: 'Teaching',
  defaultGrade: 'Grade II',
  isTeaching: true,
  isManagerial: true,
  defaultPayScale: 'PS-B',
  defaultRole: 'Department Head',
  status: 'Active',
  createdOn: '2024-01-15'
},
{
  id: 'DES003',
  code: 'TCHR',
  name: 'Teacher',
  shortName: 'Teacher',
  defaultDepartment: '',
  defaultStaffType: 'Teaching',
  defaultGrade: 'Grade III',
  isTeaching: true,
  isManagerial: false,
  defaultPayScale: 'PS-C',
  defaultRole: 'Class Teacher',
  status: 'Active',
  createdOn: '2024-01-15'
},
{
  id: 'DES004',
  code: 'LIBR',
  name: 'Librarian',
  shortName: 'Librarian',
  defaultDepartment: 'Library',
  defaultStaffType: 'Non-Teaching',
  defaultGrade: 'Grade III',
  isTeaching: false,
  isManagerial: false,
  defaultPayScale: 'PS-C',
  defaultRole: 'Library In-Charge',
  status: 'Active',
  createdOn: '2024-01-20'
},
{
  id: 'DES005',
  code: 'ACCT',
  name: 'Accountant',
  shortName: 'Accountant',
  defaultDepartment: 'Finance',
  defaultStaffType: 'Administrative',
  defaultGrade: 'Grade III',
  isTeaching: false,
  isManagerial: false,
  defaultPayScale: 'PS-C',
  defaultRole: '',
  status: 'Active',
  createdOn: '2024-01-20'
},
{
  id: 'DES006',
  code: 'CLERK',
  name: 'Office Clerk',
  shortName: 'Clerk',
  defaultDepartment: 'Administration',
  defaultStaffType: 'Administrative',
  defaultGrade: 'Grade IV',
  isTeaching: false,
  isManagerial: false,
  defaultPayScale: 'PS-D',
  defaultRole: '',
  status: 'Active',
  createdOn: '2024-01-20'
},
{
  id: 'DES007',
  code: 'PEON',
  name: 'Peon',
  shortName: 'Peon',
  defaultDepartment: 'Support',
  defaultStaffType: 'Support Staff',
  defaultGrade: 'Grade V',
  isTeaching: false,
  isManagerial: false,
  defaultPayScale: 'PS-E',
  defaultRole: '',
  status: 'Active',
  createdOn: '2024-01-20'
}];

export function DesignationMaster() {
  const [designations, setDesignations] = useState(mockDesignations);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    shortName: '',
    defaultDepartment: '',
    defaultStaffType: '',
    defaultGrade: '',
    isTeaching: false,
    isManagerial: false,
    defaultPayScale: '',
    defaultRole: ''
  });
  const filtered = designations.filter((d) => {
    const matchSearch =
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase());
    const matchType =
    !typeFilter ||
    typeFilter === 'Teaching' && d.isTeaching ||
    typeFilter === 'Non-Teaching' && !d.isTeaching ||
    typeFilter === 'Managerial' && d.isManagerial;
    return matchSearch && matchType;
  });
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      shortName: '',
      defaultDepartment: '',
      defaultStaffType: '',
      defaultGrade: '',
      isTeaching: false,
      isManagerial: false,
      defaultPayScale: '',
      defaultRole: ''
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setDesignations((prev) =>
      prev.map((d) =>
      d.id === editId ?
      {
        ...d,
        ...form
      } :
      d
      )
      );
    } else {
      setDesignations((prev) => [
      ...prev,
      {
        ...form,
        id: `DES${Date.now()}`,
        status: 'Active' as const,
        createdOn: new Date().toISOString().split('T')[0]
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (designation: Designation) => {
    setForm({
      code: designation.code,
      name: designation.name,
      shortName: designation.shortName,
      defaultDepartment: designation.defaultDepartment,
      defaultStaffType: designation.defaultStaffType,
      defaultGrade: designation.defaultGrade,
      isTeaching: designation.isTeaching,
      isManagerial: designation.isManagerial,
      defaultPayScale: designation.defaultPayScale,
      defaultRole: designation.defaultRole
    });
    setEditId(designation.id);
    setShowForm(true);
  };
  const handleClone = (designation: Designation) => {
    setForm({
      code: `${designation.code}_COPY`,
      name: `${designation.name} (Copy)`,
      shortName: designation.shortName,
      defaultDepartment: designation.defaultDepartment,
      defaultStaffType: designation.defaultStaffType,
      defaultGrade: designation.defaultGrade,
      isTeaching: designation.isTeaching,
      isManagerial: designation.isManagerial,
      defaultPayScale: designation.defaultPayScale,
      defaultRole: designation.defaultRole
    });
    setShowForm(true);
  };
  const handleDelete = (id: string) =>
  setDesignations((prev) => prev.filter((d) => d.id !== id));
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Designation Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage job titles and positions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Designation
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{designations.length}</p>
            <p className="text-xs text-gray-500">Total Designations</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {designations.filter((d) => d.isTeaching).length}
            </p>
            <p className="text-xs text-gray-500">Teaching</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {designations.filter((d) => !d.isTeaching).length}
            </p>
            <p className="text-xs text-gray-500">Non-Teaching</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {designations.filter((d) => d.isManagerial).length}
            </p>
            <p className="text-xs text-gray-500">Managerial</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Designation' : 'Add New Designation'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Designation Code *"
            value={form.code}
            onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value
            })
            }
            placeholder="e.g., TCHR" />

            <Input
            label="Designation Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., Teacher" />

            <Input
            label="Short Name"
            value={form.shortName}
            onChange={(e) =>
            setForm({
              ...form,
              shortName: e.target.value
            })
            }
            placeholder="e.g., Teacher" />

            <Select
            label="Default Department"
            options={[
            {
              value: '',
              label: 'None'
            },
            {
              value: 'Science',
              label: 'Science'
            },
            {
              value: 'Arts',
              label: 'Arts'
            },
            {
              value: 'Administration',
              label: 'Administration'
            },
            {
              value: 'Library',
              label: 'Library'
            },
            {
              value: 'Finance',
              label: 'Finance'
            },
            {
              value: 'Support',
              label: 'Support'
            }]
            }
            value={form.defaultDepartment}
            onChange={(e) =>
            setForm({
              ...form,
              defaultDepartment: e.target.value
            })
            } />

            <Select
            label="Default Staff Type"
            options={[
            {
              value: '',
              label: 'None'
            },
            {
              value: 'Teaching',
              label: 'Teaching'
            },
            {
              value: 'Non-Teaching',
              label: 'Non-Teaching'
            },
            {
              value: 'Administrative',
              label: 'Administrative'
            },
            {
              value: 'Support Staff',
              label: 'Support Staff'
            }]
            }
            value={form.defaultStaffType}
            onChange={(e) =>
            setForm({
              ...form,
              defaultStaffType: e.target.value
            })
            } />

            <Select
            label="Default Grade"
            options={[
            {
              value: '',
              label: 'None'
            },
            {
              value: 'Grade I',
              label: 'Grade I'
            },
            {
              value: 'Grade II',
              label: 'Grade II'
            },
            {
              value: 'Grade III',
              label: 'Grade III'
            },
            {
              value: 'Grade IV',
              label: 'Grade IV'
            },
            {
              value: 'Grade V',
              label: 'Grade V'
            }]
            }
            value={form.defaultGrade}
            onChange={(e) =>
            setForm({
              ...form,
              defaultGrade: e.target.value
            })
            } />

            <Select
            label="Default Pay Scale"
            options={[
            {
              value: '',
              label: 'None'
            },
            {
              value: 'PS-A',
              label: 'PS-A'
            },
            {
              value: 'PS-B',
              label: 'PS-B'
            },
            {
              value: 'PS-C',
              label: 'PS-C'
            },
            {
              value: 'PS-D',
              label: 'PS-D'
            },
            {
              value: 'PS-E',
              label: 'PS-E'
            }]
            }
            value={form.defaultPayScale}
            onChange={(e) =>
            setForm({
              ...form,
              defaultPayScale: e.target.value
            })
            } />

            <Input
            label="Default Role Profile"
            value={form.defaultRole}
            onChange={(e) =>
            setForm({
              ...form,
              defaultRole: e.target.value
            })
            }
            placeholder="e.g., Class Teacher" />

            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isTeaching}
                onChange={(e) =>
                setForm({
                  ...form,
                  isTeaching: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">Teaching Position</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isManagerial}
                onChange={(e) =>
                setForm({
                  ...form,
                  isManagerial: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Managerial Position
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Designation
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
              placeholder="Search designations..."
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
              value: 'Teaching',
              label: 'Teaching'
            },
            {
              value: 'Non-Teaching',
              label: 'Non-Teaching'
            },
            {
              value: 'Managerial',
              label: 'Managerial'
            }]
            }
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Designation
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Department
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Staff Type
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Grade
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) =>
              <tr
                key={d.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {d.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {d.code} · {d.shortName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {d.defaultDepartment || '-'}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {d.defaultStaffType || '-'}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {d.defaultGrade || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {d.isTeaching && <Badge variant="info">Teaching</Badge>}
                      {d.isManagerial &&
                    <Badge variant="secondary">Managerial</Badge>
                    }
                      {!d.isTeaching && !d.isManagerial &&
                    <span className="text-xs text-gray-400">-</span>
                    }
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={d.status === 'Active' ? 'success' : 'secondary'}>

                      {d.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(d)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleClone(d)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Clone">

                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                      title="Delete">

                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}