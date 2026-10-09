import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Shield, Search, X, Save, Check, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// TYPES
// ============================================================================

interface Role {
  id: string;
  name: string;
  code: string;
  type: 'System' | 'Custom';
  category: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  locked: boolean;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const PRIMARY = '#24608A';
const CATEGORIES = ['Academic', 'Administrative', 'Finance', 'HR', 'Parent', 'Student', 'Transport', 'Library'];

const INITIAL_ROLES: Role[] = [
{ id: 'R001', name: 'Super Admin', code: 'SYS_ADMIN', type: 'System', category: 'Administrative', description: 'Full system access with all permissions', status: 'Active', createdAt: '2024-01-01', locked: true },
{ id: 'R002', name: 'Principal', code: 'PRINCIPAL', type: 'System', category: 'Academic', description: 'School principal with high-level management access', status: 'Active', createdAt: '2024-01-01', locked: true },
{ id: 'R003', name: 'Vice Principal', code: 'VICE_PRINCIPAL', type: 'System', category: 'Academic', description: 'Vice principal with academic oversight', status: 'Active', createdAt: '2024-01-05', locked: false },
{ id: 'R004', name: 'Head of Department', code: 'HOD', type: 'Custom', category: 'Academic', description: 'Department head with subject oversight', status: 'Active', createdAt: '2024-01-08', locked: false },
{ id: 'R005', name: 'Class Teacher', code: 'TEACHER_CLS', type: 'Custom', category: 'Academic', description: 'Class teacher with attendance and student management', status: 'Active', createdAt: '2024-01-10', locked: false },
{ id: 'R006', name: 'Subject Teacher', code: 'TEACHER_SUB', type: 'Custom', category: 'Academic', description: 'Subject teacher with limited access', status: 'Active', createdAt: '2024-01-10', locked: false },
{ id: 'R007', name: 'Accountant', code: 'ACCOUNTANT', type: 'Custom', category: 'Finance', description: 'Finance management and fee collection', status: 'Active', createdAt: '2024-01-15', locked: false },
{ id: 'R008', name: 'Cashier', code: 'CASHIER', type: 'Custom', category: 'Finance', description: 'Fee collection and receipt generation', status: 'Active', createdAt: '2024-01-18', locked: false },
{ id: 'R009', name: 'HR Manager', code: 'HR_MGR', type: 'Custom', category: 'HR', description: 'Human resources management', status: 'Active', createdAt: '2024-01-15', locked: false },
{ id: 'R010', name: 'Librarian', code: 'LIBRARIAN', type: 'Custom', category: 'Library', description: 'Library management', status: 'Active', createdAt: '2024-02-01', locked: false },
{ id: 'R011', name: 'Receptionist', code: 'RECEPTION', type: 'Custom', category: 'Administrative', description: 'Front desk operations and enquiry', status: 'Active', createdAt: '2024-02-01', locked: false },
{ id: 'R012', name: 'Transport Manager', code: 'TRANSPORT_MGR', type: 'Custom', category: 'Transport', description: 'Transport and fleet management', status: 'Active', createdAt: '2024-02-20', locked: false },
{ id: 'R013', name: 'Parent', code: 'PARENT', type: 'System', category: 'Parent', description: 'Parent portal access', status: 'Active', createdAt: '2024-01-01', locked: true },
{ id: 'R014', name: 'Student', code: 'STUDENT', type: 'System', category: 'Student', description: 'Student portal access', status: 'Active', createdAt: '2024-01-01', locked: true },
{ id: 'R015', name: 'Data Entry Operator', code: 'DATA_ENTRY', type: 'Custom', category: 'Administrative', description: 'Data entry and record management', status: 'Inactive', createdAt: '2024-02-25', locked: false }];


const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = { Academic: '#3b82f6', Administrative: '#8b5cf6', Finance: '#10b981', HR: '#f59e0b', Parent: '#ec4899', Student: '#06b6d4', Transport: '#84cc16', Library: '#6366f1' };
  return colors[category] || PRIMARY;
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Badge = ({ variant, children }: {variant: 'success' | 'danger' | 'info' | 'secondary';children: React.ReactNode;}) => {
  const styles = { success: 'bg-emerald-50 text-emerald-700', danger: 'bg-rose-50 text-rose-700', info: 'bg-blue-50 text-blue-700', secondary: 'bg-slate-100 text-slate-600' };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[variant]}`}>{children}</span>;
};

const Modal = ({ open, onClose, title, children }: {open: boolean;onClose: () => void;title: string;children: React.ReactNode;}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: PRIMARY }} />
            {title}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>);

};

// ============================================================================
// ROLE FORM
// ============================================================================

const RoleForm = ({ role, onClose, onSave }: {role?: Role | null;onClose: () => void;onSave: (data: Partial<Role>) => void;}) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    code: role?.code || '',
    description: role?.description || '',
    category: role?.category || '',
    status: role?.status || 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.category) return alert('Please fill all required fields');
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Role Name *</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Exam Coordinator" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Role Code *</label>
        <input type="text" value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase().replace(/\s/g, '_') }))} placeholder="e.g. EXAM_COORD" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p className="text-xs text-slate-500 mt-1">Unique identifier, no spaces</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
        <select value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} placeholder="Role description..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as 'Active' | 'Inactive' }))} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit"><Save className="w-4 h-4 mr-2" />{role ? 'Update' : 'Create'} Role</Button>
      </div>
    </form>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RoleMaster() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter && r.category !== categoryFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [roles, search, categoryFilter, statusFilter]);

  const handleSave = (data: Partial<Role>) => {
    if (editRole) {
      setRoles((prev) => prev.map((r) => r.id === editRole.id ? { ...r, ...data } : r));
    } else {
      const newRole: Role = { id: `R${String(roles.length + 1).padStart(3, '0')}`, type: 'Custom', locked: false, createdAt: new Date().toISOString().split('T')[0], ...data } as Role;
      setRoles((prev) => [...prev, newRole]);
    }
    setShowModal(false);
    setEditRole(null);
  };

  const handleDelete = (role: Role) => {
    if (role.locked) return alert('System roles cannot be deleted');
    if (confirm(`Delete "${role.name}"?`)) setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  const openEdit = (role: Role) => {
    if (role.locked) return alert('System roles cannot be edited');
    setEditRole(role);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditRole(null);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-7 h-7" style={{ color: PRIMARY }} />
              Role Master
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage user roles for the ERP system</p>
          </div>
          <Button variant="primary" onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Create Role</Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {(search || categoryFilter || statusFilter) &&
            <button onClick={() => {setSearch('');setCategoryFilter('');setStatusFilter('');}} className="text-sm text-blue-600 hover:underline">Clear</button>
            }
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Roles</span>
            <span className="text-sm text-slate-500">{filteredRoles.length} of {roles.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['ID', 'Role Name', 'Code', 'Type', 'Category', 'Status', 'Created', 'Actions'].map((h) =>
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((role) =>
                <tr key={role.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{role.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: getCategoryColor(role.category) + '20' }}>
                          <Shield className="w-4 h-4" style={{ color: getCategoryColor(role.category) }} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{role.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">{role.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{role.code}</td>
                    <td className="px-4 py-3"><Badge variant={role.type === 'System' ? 'info' : 'secondary'}>{role.type}</Badge></td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: getCategoryColor(role.category) + '15', color: getCategoryColor(role.category) }}>{role.category}</span>
                    </td>
                    <td className="px-4 py-3"><Badge variant={role.status === 'Active' ? 'success' : 'secondary'}>{role.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{role.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(role)} className={`p-1.5 rounded-lg ${role.locked ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-600'}`} disabled={role.locked} title={role.locked ? 'System role' : 'Edit'}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(role)} className={`p-1.5 rounded-lg ${role.locked ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-rose-500'}`} disabled={role.locked} title={role.locked ? 'System role' : 'Delete'}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredRoles.length === 0 &&
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">No roles found</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: PRIMARY }}>{roles.length}</p>
            <p className="text-sm text-slate-500">Total Roles</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{roles.filter((r) => r.status === 'Active').length}</p>
            <p className="text-sm text-slate-500">Active</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{roles.filter((r) => r.type === 'System').length}</p>
            <p className="text-sm text-slate-500">System Roles</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{roles.filter((r) => r.type === 'Custom').length}</p>
            <p className="text-sm text-slate-500">Custom Roles</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => {setShowModal(false);setEditRole(null);}} title={editRole ? 'Edit Role' : 'Create New Role'}>
        <RoleForm role={editRole} onClose={() => {setShowModal(false);setEditRole(null);}} onSave={handleSave} />
      </Modal>
    </div>);

}

export default RoleMaster;