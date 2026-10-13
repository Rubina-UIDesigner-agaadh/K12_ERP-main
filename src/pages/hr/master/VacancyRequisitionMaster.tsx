import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Save, GripVertical, FileText, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file' | 'checkbox' | 'email' | 'tel';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string;
}

interface FormBlueprint {
  requisition: FormField[];
  applicant: FormField[];
}

const STORE_KEY = 'k12-vacancy-form-builder-v1';

const TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Long text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'file', label: 'File upload' },
  { value: 'checkbox', label: 'Checkbox' }
];

const SEED: FormBlueprint = {
  requisition: [
    { id: 'r1', label: 'Position Title', type: 'text', required: true, placeholder: 'e.g. Mathematics Teacher' },
    { id: 'r2', label: 'Department', type: 'select', required: true, options: 'Academics,Administration,Sports,Student Support' },
    { id: 'r3', label: 'Employment Type', type: 'select', required: true, options: 'Permanent,Contract,Part-time' },
    { id: 'r4', label: 'No. of Vacancies', type: 'number', required: true },
    { id: 'r5', label: 'Min. Qualification', type: 'text', required: true, placeholder: 'M.A / M.Sc + B.Ed' },
    { id: 'r6', label: 'Min. Experience (years)', type: 'number', required: false },
    { id: 'r7', label: 'Reporting Manager', type: 'text', required: true },
    { id: 'r8', label: 'Salary Range', type: 'text', required: false, placeholder: '₹50,000 – ₹75,000' },
    { id: 'r9', label: 'Subject / Specialization', type: 'text', required: true },
    { id: 'r10', label: 'Joining Timeline', type: 'date', required: false },
    { id: 'r11', label: 'Justification', type: 'textarea', required: true, placeholder: 'Why is this vacancy needed?' }
  ],
  applicant: [
    { id: 'a1', label: 'Full Name', type: 'text', required: true },
    { id: 'a2', label: 'Email', type: 'email', required: true },
    { id: 'a3', label: 'Phone', type: 'tel', required: true },
    { id: 'a4', label: 'Highest Qualification', type: 'text', required: true },
    { id: 'a5', label: 'Years of Experience', type: 'number', required: true },
    { id: 'a6', label: 'Subject Specialization', type: 'text', required: true },
    { id: 'a7', label: 'Current Employer', type: 'text', required: false },
    { id: 'a8', label: 'Expected Salary', type: 'text', required: false },
    { id: 'a9', label: 'Notice Period', type: 'text', required: false },
    { id: 'a10', label: 'Resume / CV', type: 'file', required: true },
    { id: 'a11', label: 'Cover Letter', type: 'textarea', required: false },
    { id: 'a12', label: 'Willing to relocate', type: 'checkbox', required: false }
  ]
};

const emptyField = (prefix: string): FormField => ({
  id: `${prefix}-${Date.now()}`,
  label: '',
  type: 'text',
  required: false,
  placeholder: '',
  options: ''
});

const loadBlueprint = (): FormBlueprint => {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as FormBlueprint;
    if (!parsed.requisition?.length || !parsed.applicant?.length) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
};

export function VacancyRequisitionMaster() {
  const [tab, setTab] = useState<'requisition' | 'applicant'>('requisition');
  const [forms, setForms] = useState<FormBlueprint>(SEED);
  const [notice, setNotice] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<FieldType>('text');

  useEffect(() => {
    setForms(loadBlueprint());
  }, []);

  const fields = forms[tab];

  const updateField = (id: string, patch: Partial<FormField>) => {
    setForms((prev) => ({
      ...prev,
      [tab]: prev[tab].map((field) => (field.id === id ? { ...field, ...patch } : field))
    }));
  };

  const removeField = (id: string) => {
    setForms((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((field) => field.id !== id)
    }));
  };

  const addField = () => {
    const label = newLabel.trim() || 'New field';
    const field = { ...emptyField(tab === 'requisition' ? 'r' : 'a'), label, type: newType };
    setForms((prev) => ({ ...prev, [tab]: [...prev[tab], field] }));
    setNewLabel('');
    setNotice(`Added “${label}” to the ${tab} form.`);
  };

  const save = () => {
    const missing = [...forms.requisition, ...forms.applicant].some((field) => !field.label.trim());
    if (missing) {
      setNotice('Every field needs a label before saving.');
      return;
    }
    window.localStorage.setItem(STORE_KEY, JSON.stringify(forms));
    setNotice('Requisition and applicant forms saved. These fields appear when raising a vacancy or when an applicant applies.');
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Home → HR → Master → Vacancy / Requisition Master</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Vacancy / Requisition Master</h1>
          <p className="text-sm text-gray-500">Edit the requisition form and the applicant filling form — add or remove any field</p>
        </div>
        <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Save forms</Button>
      </div>

      {notice && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 flex justify-between">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}>×</button>
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={() => setTab('requisition')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${tab === 'requisition' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'}`}>
          <FileText className="w-4 h-4" /> Requisition form
        </button>
        <button type="button" onClick={() => setTab('applicant')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${tab === 'applicant' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700'}`}>
          <UserPlus className="w-4 h-4" /> Applicant filling form
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{tab === 'requisition' ? 'Requisition form fields' : 'Applicant filling form fields'}</h2>
            <Badge variant="info">{fields.length} fields</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="New field label" className="flex-1 min-w-40 px-3 py-2 border rounded-lg text-sm" />
            <select value={newType} onChange={(e) => setNewType(e.target.value as FieldType)} className="px-3 py-2 border rounded-lg text-sm">
              {TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <Button onClick={addField}><Plus className="w-4 h-4 mr-1" /> Add field</Button>
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
                  <input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} className="flex-1 px-3 py-1.5 border rounded-lg text-sm bg-white" placeholder="Field label" />
                  <select value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })} className="px-2 py-1.5 border rounded-lg text-sm bg-white">
                    {TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <label className="text-xs flex items-center gap-1 whitespace-nowrap">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} />
                    Required
                  </label>
                  <button type="button" className="text-red-600 p-1" onClick={() => removeField(field.id)} title="Remove field">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {field.type !== 'checkbox' && field.type !== 'file' && field.type !== 'select' && (
                  <input value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} className="w-full px-3 py-1.5 border rounded-lg text-xs" placeholder="Placeholder text (optional)" />
                )}
                {field.type === 'select' && (
                  <input value={field.options || ''} onChange={(e) => updateField(field.id, { options: e.target.value })} className="w-full px-3 py-1.5 border rounded-lg text-xs" placeholder="Dropdown options, comma separated" />
                )}
              </div>
            ))}
            {fields.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No fields. Add one above.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Live preview</h2>
          <p className="text-xs text-gray-500 mb-4">How the {tab === 'requisition' ? 'manpower requisition' : 'applicant'} form looks after your edits</p>
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label || 'Untitled'} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' && <textarea rows={2} disabled placeholder={field.placeholder} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" />}
                {field.type === 'select' && (
                  <select disabled className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50">
                    <option>Select…</option>
                    {(field.options || '').split(',').filter(Boolean).map((opt) => <option key={opt}>{opt.trim()}</option>)}
                  </select>
                )}
                {field.type === 'checkbox' && <input type="checkbox" disabled className="h-4 w-4" />}
                {field.type === 'file' && <input type="file" disabled className="w-full text-sm" />}
                {field.type !== 'textarea' && field.type !== 'select' && field.type !== 'checkbox' && field.type !== 'file' && (
                  <input type={field.type} disabled placeholder={field.placeholder} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VacancyRequisitionMaster;
