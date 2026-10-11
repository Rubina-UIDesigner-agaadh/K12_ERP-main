import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, Search, Briefcase, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';

interface VacancyFormTemplate {
  id: string;
  code: string;
  position: string;
  department: string;
  employmentType: string;
  minQualification: string;
  minExperience: number;
  sanctionedPosts: number;
  defaultPriority: 'High' | 'Medium' | 'Low';
  requiredFields: string[];
  justificationHint: string;
  status: 'Active' | 'Inactive';
}

const FIELD_OPTIONS = [
  'Justification',
  'Reporting Manager',
  'Salary Range',
  'Subject / Specialization',
  'Preferred Gender',
  'Joining Timeline',
  'Replacement For',
  'Budget Code'
];

const SEED: VacancyFormTemplate[] = [
  { id: 'VRM001', code: 'TCH', position: 'Teacher', department: 'Academics', employmentType: 'Permanent', minQualification: 'M.A / M.Sc + B.Ed', minExperience: 2, sanctionedPosts: 12, defaultPriority: 'High', requiredFields: ['Justification', 'Subject / Specialization', 'Reporting Manager'], justificationHint: 'Mention class load and subject gap.', status: 'Active' },
  { id: 'VRM002', code: 'HOD', position: 'Head of Department', department: 'Academics', employmentType: 'Permanent', minQualification: 'Post Graduate + 8 yrs', minExperience: 8, sanctionedPosts: 6, defaultPriority: 'High', requiredFields: ['Justification', 'Salary Range', 'Reporting Manager'], justificationHint: 'Link to department vacancy and succession.', status: 'Active' },
  { id: 'VRM003', code: 'ADM', position: 'Admin Officer', department: 'Administration', employmentType: 'Permanent', minQualification: 'Graduate', minExperience: 3, sanctionedPosts: 4, defaultPriority: 'Medium', requiredFields: ['Justification', 'Budget Code'], justificationHint: 'State process / compliance need.', status: 'Active' },
  { id: 'VRM004', code: 'CON', position: 'Counselor', department: 'Student Support', employmentType: 'Contract', minQualification: 'M.A Psychology', minExperience: 2, sanctionedPosts: 2, defaultPriority: 'Low', requiredFields: ['Justification', 'Joining Timeline'], justificationHint: 'Describe student ratio and caseload.', status: 'Inactive' }
];

const emptyForm = (): Omit<VacancyFormTemplate, 'id'> => ({
  code: '',
  position: '',
  department: '',
  employmentType: 'Permanent',
  minQualification: '',
  minExperience: 0,
  sanctionedPosts: 1,
  defaultPriority: 'Medium',
  requiredFields: ['Justification'],
  justificationHint: '',
  status: 'Active'
});

export function VacancyRequisitionMaster() {
  const [rows, setRows] = useState<VacancyFormTemplate[]>(SEED);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = rows.filter((row) =>
    `${row.code} ${row.position} ${row.department}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggleField = (field: string) => {
    setForm((prev) => ({
      ...prev,
      requiredFields: prev.requiredFields.includes(field)
        ? prev.requiredFields.filter((item) => item !== field)
        : [...prev.requiredFields, field]
    }));
  };

  const startCreate = () => {
    setEditingId('new');
    setForm(emptyForm());
  };

  const startEdit = (row: VacancyFormTemplate) => {
    setEditingId(row.id);
    const { id: _id, ...rest } = row;
    setForm(rest);
  };

  const save = () => {
    if (!form.code.trim() || !form.position.trim() || !form.department.trim()) {
      setNotice('Code, position and department are required.');
      return;
    }
    if (editingId === 'new') {
      const id = `VRM${String(rows.length + 1).padStart(3, '0')}`;
      setRows((prev) => [{ id, ...form }, ...prev]);
      setNotice(`Vacancy form template ${form.position} created.`);
    } else if (editingId) {
      setRows((prev) => prev.map((row) => (row.id === editingId ? { ...row, ...form } : row)));
      setNotice(`Vacancy form template ${form.position} updated.`);
    }
    setEditingId(null);
  };

  const remove = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    if (editingId === id) setEditingId(null);
    setNotice('Template removed.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vacancy / Requisition Master</h1>
          <p className="text-sm text-gray-500">Configure the vacancy form used when raising a manpower requisition</p>
        </div>
        <Button onClick={startCreate}><Plus className="w-4 h-4 mr-2" /> New Template</Button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}><XCircle className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search position, code or department..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        {editingId && (
          <div className="p-5 border-b border-gray-100 bg-slate-50 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-600" /> {editingId === 'new' ? 'Create vacancy form' : 'Update vacancy form'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Code *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              <Input label="Position *" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <Input label="Department *" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              <Select label="Employment Type" value={form.employmentType} onChange={(val) => setForm({ ...form, employmentType: val })} options={[{ value: 'Permanent', label: 'Permanent' }, { value: 'Contract', label: 'Contract' }, { value: 'Part-time', label: 'Part-time' }]} />
              <Input label="Min. Qualification" value={form.minQualification} onChange={(e) => setForm({ ...form, minQualification: e.target.value })} />
              <Input label="Min. Experience (years)" type="number" value={form.minExperience} onChange={(e) => setForm({ ...form, minExperience: Number(e.target.value) || 0 })} />
              <Input label="Sanctioned Posts" type="number" value={form.sanctionedPosts} onChange={(e) => setForm({ ...form, sanctionedPosts: Number(e.target.value) || 0 })} />
              <Select label="Default Priority" value={form.defaultPriority} onChange={(val) => setForm({ ...form, defaultPriority: val as VacancyFormTemplate['defaultPriority'] })} options={[{ value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }]} />
              <Select label="Status" value={form.status} onChange={(val) => setForm({ ...form, status: val as 'Active' | 'Inactive' })} options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Required fields on vacancy form</p>
              <div className="flex flex-wrap gap-2">
                {FIELD_OPTIONS.map((field) => (
                  <label key={field} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm cursor-pointer ${form.requiredFields.includes(field) ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'bg-white border-gray-200 text-gray-600'}`}>
                    <input type="checkbox" checked={form.requiredFields.includes(field)} onChange={() => toggleField(field)} className="h-3.5 w-3.5" />
                    {field}
                  </label>
                ))}
              </div>
            </div>
            <Textarea label="Justification hint shown on the form" rows={2} value={form.justificationHint} onChange={(e) => setForm({ ...form, justificationHint: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
              <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Save Template</Button>
            </div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Code', 'Position', 'Department', 'Type', 'Qualification', 'Exp.', 'Posts', 'Fields', 'Status', 'Actions'].map((h) =>
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{row.position}</td>
                <td className="px-4 py-3 text-gray-600">{row.department}</td>
                <td className="px-4 py-3">{row.employmentType}</td>
                <td className="px-4 py-3 text-gray-600">{row.minQualification}</td>
                <td className="px-4 py-3">{row.minExperience}y</td>
                <td className="px-4 py-3">{row.sanctionedPosts}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{row.requiredFields.length} required</td>
                <td className="px-4 py-3"><Badge variant={row.status === 'Active' ? 'success' : 'default'}>{row.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(row)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => remove(row.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No templates match the search.</p>}
      </div>
    </div>
  );
}

export default VacancyRequisitionMaster;
