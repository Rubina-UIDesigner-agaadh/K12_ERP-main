import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  Copy } from
'lucide-react';
interface Role {
  id: string;
  code: string;
  name: string;
  designations: string[];
  departments: string[];
  responsibilities: string;
  academicSession: string;
  status: 'Active' | 'Inactive';
}
const mockRoles: Role[] = [
{
  id: 'R001',
  code: 'CT',
  name: 'Class Teacher',
  designations: ['Teacher', 'Senior Teacher'],
  departments: ['Academic'],
  responsibilities:
  'Maintain class attendance and discipline. Conduct parent-teacher meetings. Monitor student academic progress. Coordinate with subject teachers. Handle student grievances and counseling.',
  academicSession: '2024-25',
  status: 'Active'
},
{
  id: 'R002',
  code: 'EC',
  name: 'Exam Coordinator',
  designations: ['Senior Teacher', 'Vice Principal'],
  departments: ['Academic', 'Examination'],
  responsibilities:
  'Plan and schedule examinations. Coordinate with subject teachers for question paper preparation. Manage exam hall allocation and invigilation schedules. Oversee mark entry and result processing. Handle exam-related queries and issues.',
  academicSession: '2024-25',
  status: 'Active'
},
{
  id: 'R003',
  code: 'TI',
  name: 'Transport In-charge',
  designations: ['Administrative Officer', 'Transport Supervisor'],
  departments: ['Administration', 'Transport'],
  responsibilities:
  'Manage transport routes and schedules. Coordinate with drivers and attendants. Handle student transport registrations. Monitor vehicle maintenance and safety. Address parent concerns regarding transport.',
  academicSession: '2024-25',
  status: 'Active'
},
{
  id: 'R004',
  code: 'HW',
  name: 'Hostel Warden',
  designations: ['Warden', 'Assistant Warden'],
  departments: ['Hostel', 'Administration'],
  responsibilities:
  'Supervise hostel operations and student welfare. Maintain discipline and safety in hostel premises. Coordinate mess and housekeeping services. Handle student attendance and leave requests. Conduct regular room inspections.',
  academicSession: '2024-25',
  status: 'Active'
},
{
  id: 'R005',
  code: 'LC',
  name: 'Library Coordinator',
  designations: ['Librarian', 'Senior Librarian'],
  departments: ['Library'],
  responsibilities:
  'Manage library operations and book cataloging. Assist students and staff in book selection. Maintain library records and circulation. Organize reading programs and book fairs. Handle book procurement and inventory.',
  academicSession: '2024-25',
  status: 'Active'
},
{
  id: 'R006',
  code: 'SC',
  name: 'Sports Coordinator',
  designations: ['Physical Education Teacher', 'Sports Teacher'],
  departments: ['Sports', 'Co-curricular'],
  responsibilities:
  'Plan and organize sports activities and competitions. Train students for inter-school events. Manage sports equipment and facilities. Coordinate with external coaches and trainers. Maintain sports records and achievements.',
  academicSession: '2024-25',
  status: 'Active'
}];

const allDesignations = [
'Teacher',
'Senior Teacher',
'Vice Principal',
'Principal',
'Administrative Officer',
'Transport Supervisor',
'Warden',
'Assistant Warden',
'Librarian',
'Senior Librarian',
'Physical Education Teacher',
'Sports Teacher'];

const allDepartments = [
'Academic',
'Examination',
'Administration',
'Transport',
'Hostel',
'Library',
'Sports',
'Co-curricular'];

export function RoleResponsibilityMaster() {
  const [roles, setRoles] = useState(mockRoles);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    designations: [] as string[],
    departments: [] as string[],
    responsibilities: '',
    academicSession: '2024-25'
  });
  const filtered = roles.filter(
    (r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase())
  );
  const avgDesignations =
  roles.reduce((s, r) => s + r.designations.length, 0) / roles.length || 0;
  const avgDepartments =
  roles.reduce((s, r) => s + r.departments.length, 0) / roles.length || 0;
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      designations: [],
      departments: [],
      responsibilities: '',
      academicSession: '2024-25'
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setRoles((prev) =>
      prev.map((r) =>
      r.id === editId ?
      {
        ...r,
        ...form
      } :
      r
      )
      );
    } else {
      setRoles((prev) => [
      ...prev,
      {
        ...form,
        id: `R${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (role: Role) => {
    setForm({
      code: role.code,
      name: role.name,
      designations: role.designations,
      departments: role.departments,
      responsibilities: role.responsibilities,
      academicSession: role.academicSession
    });
    setEditId(role.id);
    setShowForm(true);
  };
  const handleDelete = (id: string) =>
  setRoles((prev) => prev.filter((r) => r.id !== id));
  const toggleDesignation = (designation: string) => {
    setForm((p) => ({
      ...p,
      designations: p.designations.includes(designation) ?
      p.designations.filter((d) => d !== designation) :
      [...p.designations, designation]
    }));
  };
  const toggleDepartment = (department: string) => {
    setForm((p) => ({
      ...p,
      departments: p.departments.includes(department) ?
      p.departments.filter((d) => d !== department) :
      [...p.departments, department]
    }));
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Role & Responsibility Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure functional roles and their responsibilities
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{roles.length}</p>
            <p className="text-xs text-gray-500">Total Roles</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {roles.filter((r) => r.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Active Roles</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{avgDesignations.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg Designations</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{avgDepartments.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg Departments</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Role' : 'Add New Role'}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Role Code *"
              value={form.code}
              onChange={(e) =>
              setForm((p) => ({
                ...p,
                code: e.target.value
              }))
              }
              placeholder="e.g., CT" />

              <Input
              label="Role Name *"
              value={form.name}
              onChange={(e) =>
              setForm((p) => ({
                ...p,
                name: e.target.value
              }))
              }
              placeholder="e.g., Class Teacher" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Designations *
              </label>
              <div className="grid grid-cols-3 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                {allDesignations.map((designation) =>
              <label
                key={designation}
                className="flex items-center gap-2 text-sm">

                    <input
                  type="checkbox"
                  checked={form.designations.includes(designation)}
                  onChange={() => toggleDesignation(designation)}
                  className="rounded border-gray-300" />

                    <span className="text-gray-700">{designation}</span>
                  </label>
              )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {form.designations.length}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Departments *
              </label>
              <div className="grid grid-cols-3 gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                {allDepartments.map((department) =>
              <label
                key={department}
                className="flex items-center gap-2 text-sm">

                    <input
                  type="checkbox"
                  checked={form.departments.includes(department)}
                  onChange={() => toggleDepartment(department)}
                  className="rounded border-gray-300" />

                    <span className="text-gray-700">{department}</span>
                  </label>
              )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {form.departments.length}
              </p>
            </div>

            <Textarea
            label="Responsibilities *"
            value={form.responsibilities}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              responsibilities: e.target.value
            }))
            }
            placeholder="Describe the key responsibilities for this role..."
            rows={6} />


            <Select
            label="Academic Session *"
            options={[
            {
              value: '2024-25',
              label: '2024-25'
            },
            {
              value: '2023-24',
              label: '2023-24'
            },
            {
              value: '2025-26',
              label: '2025-26'
            }]
            }
            value={form.academicSession}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              academicSession: e.target.value
            }))
            } />

          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="primary" onClick={handleSave}>
              {editId ? 'Update' : 'Create'} Role
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
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((role) =>
          <div
            key={role.id}
            className="border border-gray-200 rounded-lg bg-white">

              <button
              onClick={() =>
              setExpandedRole(expandedRole === role.id ? null : role.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50">

                <div className="flex items-center gap-4">
                  {expandedRole === role.id ?
                <ChevronDown className="w-5 h-5 text-gray-400" /> :

                <ChevronRight className="w-5 h-5 text-gray-400" />
                }
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{role.code}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {role.designations.length} designations
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {role.departments.length} departments
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {role.academicSession}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {role.status === 'Active' ?
                <Badge variant="success">Active</Badge> :

                <Badge variant="secondary">Inactive</Badge>
                }
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(role);
                  }}
                  className="p-1.5 hover:bg-blue-100 rounded-lg"
                  title="Edit">

                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(role);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                  title="Clone">

                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(role.id);
                  }}
                  className="p-1.5 hover:bg-red-100 rounded-lg"
                  title="Delete">

                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </button>

              {expandedRole === role.id &&
            <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Linked Designations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.designations.map((d) =>
                  <span
                    key={d}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">

                          {d}
                        </span>
                  )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Linked Departments
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.departments.map((d) =>
                  <span
                    key={d}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">

                          {d}
                        </span>
                  )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Responsibilities
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {role.responsibilities}
                    </p>
                  </div>
                </div>
            }
            </div>
          )}
        </div>
      </Card>
    </div>);

}