import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Building2,
  CheckCircle,
  ChevronRight,
  Download,
  Plus,
  RotateCcw,
  Save,
  School,
  Upload,
  X
} from 'lucide-react';

type FormValue = string;
type FormData = Record<string, FormValue>;
type FieldKind = 'text' | 'email' | 'tel' | 'date' | 'number' | 'url' | 'password' | 'color' | 'textarea' | 'select' | 'heading';

interface FieldSpec {
  key: string;
  label: string;
  kind?: FieldKind;
  options?: string[];
  helper?: string;
  placeholder?: string;
  full?: boolean;
  readOnly?: boolean;
}

interface CheckGroupSpec {
  key: string;
  label: string;
  options: string[];
  helper?: string;
}

interface UploadSpec {
  key: string;
  label: string;
  accept?: string;
  helper?: string;
}

interface ProfileSectionSpec {
  title: string;
  description?: string;
  fields: FieldSpec[];
  checks?: CheckGroupSpec[];
  uploads?: UploadSpec[];
}

const yesNo = ['Yes', 'No'];
const profileSections: ProfileSectionSpec[] = [
  {
    title: 'Basic Institute Information',
    fields: [
      { key: 'fullName', label: 'Institute Full Name', full: true },
      { key: 'shortName', label: 'Short Name / Display Name' },
      { key: 'instituteCategory', label: 'Institute Category', kind: 'select', options: ['', 'Private Unaided', 'Private Aided', 'Government', 'Government-Aided', 'Central Government', 'Autonomous', 'Deemed University', 'Other'] },
      { key: 'schoolType', label: 'School Type', kind: 'select', options: ['', 'Co-education', 'Boys', 'Girls'] },
      { key: 'residentialType', label: 'Residential Type', kind: 'select', options: ['', 'Day School', 'Boarding School', 'Day cum Boarding'] },
      { key: 'establishedYear', label: 'Year of Establishment', kind: 'number' },
      { key: 'motto', label: 'Institute Motto / Tagline', full: true },
      { key: 'description', label: 'Institute Description', kind: 'textarea', full: true }
    ],
    checks: [{ key: 'instructionMedium', label: 'Medium of Instruction', options: ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Urdu', 'Other'] }]
  }
];

const visibleProfileSections = profileSections;

const initialProfile: FormData = {
  fullName: '',
  shortName: '',
  instituteCategory: '',
  schoolType: '',
  residentialType: '',
  establishedYear: '',
  motto: '',
  description: '',
  instructionMedium: ''
};

function FieldGrid({ fields, data, onChange, columns = 2 }: { fields: FieldSpec[]; data: FormData; onChange: (key: string, value: string) => void; columns?: 2 | 3 }) {
  const gridClass = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-4`}>
      {fields.map((field) => {
        if (field.kind === 'heading') {
          return <div key={field.key} className="md:col-span-2 border-t pt-3 mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">{field.label}</div>;
        }
        const value = data[field.key] ?? '';
        const spanClass = field.full ? (columns === 3 ? 'md:col-span-3' : 'md:col-span-2') : '';
        const common = { label: field.label, value, disabled: field.readOnly, helperText: field.helper, placeholder: field.placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(field.key, event.target.value) };
        return (
          <div key={field.key} className={spanClass}>
            {field.kind === 'select' ? (
              <Select label={field.label} options={(field.options || []).map((option) => ({ value: option, label: option }))} value={value} onChange={(event) => onChange(field.key, event.target.value)} />
            ) : field.kind === 'textarea' ? (
              <div><label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label><textarea value={value} onChange={(event) => onChange(field.key, event.target.value)} rows={3} className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" />{field.helper && <p className="mt-1 text-xs text-gray-500">{field.helper}</p>}</div>
            ) : (
              <Input {...common} type={field.kind || 'text'} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckboxGroup({ group, value, onChange }: { group: CheckGroupSpec; value: string; onChange: (key: string, value: string) => void }) {
  const selected = value ? value.split('|').filter(Boolean) : [];
  return (
    <div className="mt-5 rounded-lg border border-gray-200 p-4">
      <p className="mb-3 text-sm font-semibold text-gray-800">{group.label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {group.options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={selected.includes(option)} onChange={(event) => {
              const next = event.target.checked ? [...selected, option] : selected.filter((item) => item !== option);
              onChange(group.key, next.join('|'));
            }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            {option}
          </label>
        ))}
      </div>
      {group.helper && <p className="mt-2 text-xs text-gray-500">{group.helper}</p>}
    </div>
  );
}

function FileUploadGrid({ files, data, onChange }: { files: UploadSpec[]; data: FormData; onChange: (key: string, value: string) => void }) {
  if (!files.length) return null;
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => (
        <div key={file.key} className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
          <p className="mb-2 text-sm font-medium text-gray-800">{file.label}</p>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4" /> Choose file
            <input type="file" accept={file.accept} className="sr-only" onChange={(event) => {
              const selectedFile = event.currentTarget.files?.[0];
              if (selectedFile) onChange(file.key, selectedFile.name);
            }} />
          </label>
          <p className="mt-2 truncate text-xs text-gray-500">{data[file.key] || 'No file selected'}</p>
          {file.helper && <p className="mt-1 text-xs text-gray-400">{file.helper}</p>}
        </div>
      ))}
    </div>
  );
}

function SectionCard({ number, title, description, children }: { number: number; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={`institute-section-${number}`} className="scroll-mt-6">
      <Card noPadding>
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{String(number).padStart(2, '0')}</span>
            <div><h2 className="font-semibold text-gray-900">{title}</h2>{description && <p className="mt-1 text-sm text-gray-500">{description}</p>}</div>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </Card>
    </section>
  );
}


interface BranchRecord {
  id: number;
  students: number;
  capacity: number;
  fields: FormData;
}

const branchFieldsBase: FormData = {
  name: '', shortName: '', code: '', isMain: 'No', status: 'Active', establishedYear: '',
  sameAffiliation: 'Yes', udiseCode: '', cbseAffiliation: '', boardSchoolCode: '', registrationNumber: '', recognitionNumber: '',
  phone: '', mobile: '', email: '', whatsapp: '', principal: '', principalMobile: '', principalEmail: '',
  addressLine1: '', addressLine2: '', city: '', district: '', state: 'Gujarat', pinCode: '', mapLink: '', latitude: '', longitude: '',
  classesOffered: 'Pre-Primary|Primary|Middle|Secondary', capacity: '800', currentStrength: '0', startTime: '07:30 AM', endTime: '02:30 PM', sameTiming: 'Yes',
  separateBank: 'No', accountHolder: '', bankName: '', accountNumber: '', ifsc: '', accountType: 'Current',
  useMainLogo: 'Yes', separateLetterhead: 'No', branchLogoFile: '', branchLetterheadFile: '', documentDisplay: 'Main Name + Branch Name', customDisplayName: '',
  shareStudentDatabase: 'Yes', shareStaffDatabase: 'Yes', shareFeeStructure: 'Yes', separateFeeStructure: 'No', shareReports: 'Yes', separateNumberSeries: 'No', branchAdmin: ''
};

const branchFormSections: { key: string; label: string; fields: FieldSpec[]; checks?: CheckGroupSpec[] }[] = [
  { key: 'basic', label: 'Basic', fields: [
    { key: 'name', label: 'Branch Name' }, { key: 'shortName', label: 'Branch Short Name' }, { key: 'code', label: 'Branch Code (max 6 characters)', helper: 'Used in branch-specific document and number series.' }, { key: 'isMain', label: 'Main Campus?', kind: 'select', options: yesNo }, { key: 'status', label: 'Status', kind: 'select', options: ['Active', 'Inactive'] }, { key: 'establishedYear', label: 'Established Year', kind: 'number' }
  ] },
  { key: 'affiliation', label: 'Affiliation', fields: [
    { key: 'sameAffiliation', label: 'Same as Main Campus Affiliation?', kind: 'select', options: yesNo }, { key: 'udiseCode', label: 'Branch UDISE Code' }, { key: 'cbseAffiliation', label: 'CBSE / Board Affiliation Number' }, { key: 'boardSchoolCode', label: 'School Code (Board)' }, { key: 'registrationNumber', label: 'Branch Registration Number' }, { key: 'recognitionNumber', label: 'Branch Recognition Number' }
  ] },
  { key: 'contact', label: 'Contact', fields: [
    { key: 'phone', label: 'Branch Phone', kind: 'tel' }, { key: 'mobile', label: 'Branch Mobile', kind: 'tel' }, { key: 'email', label: 'Branch Email', kind: 'email' }, { key: 'whatsapp', label: 'Branch WhatsApp', kind: 'tel' }, { key: 'principal', label: 'Branch Principal' }, { key: 'principalMobile', label: 'Principal Mobile', kind: 'tel' }, { key: 'principalEmail', label: 'Principal Email', kind: 'email' }
  ] },
  { key: 'address', label: 'Address', fields: [
    { key: 'addressLine1', label: 'Address Line 1', full: true }, { key: 'addressLine2', label: 'Address Line 2', full: true }, { key: 'city', label: 'City' }, { key: 'district', label: 'District' }, { key: 'state', label: 'State' }, { key: 'pinCode', label: 'PIN Code' }, { key: 'mapLink', label: 'Google Maps Link', kind: 'url', full: true }, { key: 'latitude', label: 'Latitude' }, { key: 'longitude', label: 'Longitude' }
  ] },
];

function makeBranch(id: number, fields: FormData, students: number, capacity: number): BranchRecord {
  return { id, students, capacity, fields: { ...branchFieldsBase, ...fields } };
}

function makeDefaultBranchForm(): FormData {
  return { ...branchFieldsBase, code: 'BR-05', establishedYear: String(new Date().getFullYear()) };
}

function saveDownload(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function InstituteProfileBranchManagement() {
  const [activeTab, setActiveTab] = useState<'Institute Profile' | 'Branches'>('Institute Profile');
  const [profile, setProfile] = useState<FormData>({ ...initialProfile });
  const [savedProfile, setSavedProfile] = useState<FormData>({ ...initialProfile });
  const [lastUpdated, setLastUpdated] = useState(new Date('2025-04-01T09:00:00'));
  const [updatedBy, setUpdatedBy] = useState('Admin User');
  const [toast, setToast] = useState('');


  const [branches, setBranches] = useState<BranchRecord[]>([
    makeBranch(1, { name: 'Main Campus', shortName: 'Main Campus', code: 'MAIN', isMain: 'Yes', status: 'Active', establishedYear: '1995', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380060', addressLine1: '123, Education Lane, Science City Road', addressLine2: 'Sola, Ahmedabad', phone: '+91 79 4000 1200', mobile: '+91 98765 43210', email: 'main@sunshine.edu.in', whatsapp: '+91 98765 43210', principal: 'Dr. R. K. Sharma', principalMobile: '+91 98765 43211', principalEmail: 'principal@sunshine.edu.in', capacity: '1800', currentStrength: '1800', udiseCode: '24070101234', branchAdmin: 'Admin User' }, 1800, 1800),
    makeBranch(2, { name: 'City Centre Branch', shortName: 'City Centre', code: 'CITY', isMain: 'No', status: 'Active', establishedYear: '2005', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380009', addressLine1: '456, Central Avenue', addressLine2: 'Navrangpura, Ahmedabad', phone: '+91 79 4000 2200', email: 'city@sunshine.edu.in', principal: 'Mrs. S. Patel', principalMobile: '+91 98765 43212', capacity: '1400', currentStrength: '1200', branchAdmin: 'City Branch Admin' }, 1200, 1400),
    makeBranch(3, { name: 'North Zone Campus', shortName: 'North Zone', code: 'NORTH', isMain: 'No', status: 'Active', establishedYear: '2018', city: 'Gandhinagar', district: 'Gandhinagar', state: 'Gujarat', pinCode: '382021', addressLine1: '789, Knowledge Park', addressLine2: 'Sector 21, Gandhinagar', principal: 'Mr. A. Singh', principalMobile: '+91 98765 43213', capacity: '1000', currentStrength: '850', branchAdmin: 'North Campus Admin' }, 850, 1000),
    makeBranch(4, { name: 'West Branch', shortName: 'West Campus', code: 'WEST', isMain: 'No', status: 'Inactive', establishedYear: '2020', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', pinCode: '380054', addressLine1: '42, West Ring Road', addressLine2: 'Ahmedabad', principal: 'Mrs. K. Desai', principalMobile: '+91 98765 43214', capacity: '600', currentStrength: '400', branchAdmin: 'West Branch Admin' }, 400, 600)
  ]);
  const [branchFormOpen, setBranchFormOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [branchForm, setBranchForm] = useState<FormData>(makeDefaultBranchForm());
  const [branchFormSection, setBranchFormSection] = useState('basic');
  const [branchSearch, setBranchSearch] = useState('');

  const updateProfile = (key: string, value: string) => setProfile((previous) => ({ ...previous, [key]: value }));
  const showToastMessage = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3200);
  };

  const saveAllChanges = () => {
    setSavedProfile({ ...profile });
    const now = new Date();
    setLastUpdated(now);
    setUpdatedBy('Admin User');
    showToastMessage('Institute profile changes saved.');
  };

  const resetToSaved = () => {
    setProfile({ ...savedProfile });
    showToastMessage('Unsaved institute profile changes were reset.');
  };

  const openNewBranch = () => {
    const nextCode = `BR${String(branches.length + 1).padStart(2, '0')}`;
    setBranchForm({ ...makeDefaultBranchForm(), code: nextCode });
    setEditingBranchId(null);
    setBranchFormSection('basic');
    setBranchFormOpen(true);
  };

  const openEditBranch = (branch: BranchRecord) => {
    setBranchForm({ ...branch.fields });
    setEditingBranchId(branch.id);
    setBranchFormSection('basic');
    setBranchFormOpen(true);
  };

  const saveBranch = () => {
    const name = branchForm.name?.trim();
    const code = branchForm.code?.trim().toUpperCase();
    if (!name || !code || !branchForm.city?.trim()) {
      showToastMessage('Branch name, code, and city are required.');
      setBranchFormSection('basic');
      return;
    }
    if (code.length > 6) {
      showToastMessage('Branch code must be no longer than 6 characters.');
      setBranchFormSection('basic');
      return;
    }
    if (branches.some((branch) => branch.id !== editingBranchId && branch.fields.code.toUpperCase() === code)) {
      showToastMessage('Branch code must be unique.');
      setBranchFormSection('basic');
      return;
    }
    const currentMain = branches.find((branch) => branch.fields.isMain === 'Yes');
    if (currentMain?.id === editingBranchId && branchForm.isMain !== 'Yes') {
      showToastMessage('Keep one campus designated as the main campus.');
      setBranchFormSection('basic');
      return;
    }
    const normalized = { ...branchForm, name, code };
    setBranches((previous) => {
      const prepared = previous.map((branch) => branchForm.isMain === 'Yes' ? { ...branch, fields: { ...branch.fields, isMain: 'No' } } : branch);
      if (editingBranchId !== null) {
        return prepared.map((branch) => branch.id === editingBranchId ? { ...branch, fields: normalized, students: Number(normalized.currentStrength || branch.students), capacity: Number(normalized.capacity || branch.capacity) } : branch);
      }
      const id = Math.max(0, ...prepared.map((branch) => branch.id)) + 1;
      const students = Number(normalized.currentStrength || 0);
      return [...prepared, { id, students, capacity: Number(normalized.capacity || 0), fields: normalized }];
    });
    setBranchFormOpen(false);
    setLastUpdated(new Date());
    setUpdatedBy('Admin User');
    showToastMessage(editingBranchId ? 'Branch details updated.' : 'Branch added successfully.');
  };

  const toggleBranchStatus = (branch: BranchRecord) => {
    if (branch.fields.isMain === 'Yes' && branch.fields.status === 'Active') {
      showToastMessage('The main campus cannot be deactivated.');
      return;
    }
    setBranches((previous) => previous.map((item) => item.id === branch.id ? { ...item, fields: { ...item.fields, status: item.fields.status === 'Active' ? 'Inactive' : 'Active' } } : item));
    setLastUpdated(new Date());
    setUpdatedBy('Admin User');
    showToastMessage(`${branch.fields.name} status updated.`);
  };

  const exportBranches = () => saveDownload('institute-branches.json', JSON.stringify(branches.map((branch) => ({ ...branch.fields, students: branch.students, capacity: branch.capacity })), null, 2));
  const filteredBranches = useMemo(() => branches.filter((branch) => `${branch.fields.name} ${branch.fields.city} ${branch.fields.code} ${branch.fields.principal}`.toLowerCase().includes(branchSearch.toLowerCase())), [branches, branchSearch]);
  const formattedUpdated = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(lastUpdated);

  const renderProfile = () => (
    <div className="space-y-5">
      {visibleProfileSections.map((section, index) => (
        <SectionCard key={section.title} number={index + 1} title={section.title} description={section.description}>
          <FieldGrid fields={section.fields} data={profile} onChange={updateProfile} />
          {section.checks?.map((group) => <CheckboxGroup key={group.key} group={group} value={profile[group.key] || ''} onChange={updateProfile} />)}
          {section.uploads && <FileUploadGrid files={section.uploads} data={profile} onChange={updateProfile} />}

        </SectionCard>
      ))}
      <Card noPadding>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="text-xs text-gray-500">Last saved {formattedUpdated} · {updatedBy}</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetToSaved}><RotateCcw className="h-4 w-4" /> Reset Unsaved</Button>
            <Button onClick={saveAllChanges}><Save className="h-4 w-4" /> Save All Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderBranches = () => (
    <div className="space-y-5">
      <div className="grid gap-5">
        <Card title="All Branches" headerAction={<div className="flex gap-2"><Button size="sm" variant="outline" onClick={exportBranches}><Download className="h-4 w-4" /> Export</Button><Button size="sm" onClick={openNewBranch}><Plus className="h-4 w-4" /> Add New Branch</Button></div>} noPadding>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"><p className="text-sm text-gray-500">Manage branch campuses linked to the institute master record.</p><Input value={branchSearch} onChange={(event) => setBranchSearch(event.target.value)} placeholder="Search branches…" className="w-full sm:max-w-xs" /></div>
          <Table columns={[
            { key: 'branch', header: 'Branch Name', render: (branch: BranchRecord) => <div className="min-w-[190px]"><div className="flex items-center gap-2 font-medium text-gray-900">{branch.fields.name}{branch.fields.isMain === 'Yes' && <Badge variant="primary">HQ</Badge>}</div><div className="mt-1 text-xs text-gray-500">{branch.fields.addressLine1}, {branch.fields.city}</div></div> },
            { key: 'code', header: 'Branch Code', render: (branch: BranchRecord) => <span className="font-mono text-xs">{branch.fields.code}</span> },
            { key: 'location', header: 'Location', render: (branch: BranchRecord) => <span>{branch.fields.city}, {branch.fields.state}</span> },
            { key: 'students', header: 'Students', render: (branch: BranchRecord) => <div><span className="font-medium">{branch.students.toLocaleString('en-IN')}</span><span className="block text-xs text-gray-500">Capacity {branch.capacity.toLocaleString('en-IN')}</span></div> },
            { key: 'principal', header: 'Principal / Head', render: (branch: BranchRecord) => <div><span>{branch.fields.principal || '—'}</span><span className="block text-xs text-gray-500">{branch.fields.principalEmail || branch.fields.email || '—'}</span></div> },
            { key: 'status', header: 'Status', render: (branch: BranchRecord) => <Badge variant={branch.fields.status === 'Active' ? 'success' : 'secondary'}>{branch.fields.status}</Badge> },
            { key: 'actions', header: 'Actions', render: (branch: BranchRecord) => <div className="flex min-w-[145px] gap-1"><Button size="xs" variant="outline" onClick={() => openEditBranch(branch)}>Edit</Button><Button size="xs" variant="ghost" onClick={() => toggleBranchStatus(branch)}>{branch.fields.status === 'Active' ? 'Deactivate' : 'Activate'}</Button></div> }
          ]} data={filteredBranches} emptyMessage="No branches match your search." />
        </Card>

      </div>
    </div>
  );

  const branchSection = branchFormSections.find((section) => section.key === branchFormSection) || branchFormSections[0];
  const visibleBranchFields = branchSection.key === 'affiliation' && branchForm.sameAffiliation !== 'No'
    ? branchSection.fields.slice(0, 1)
    : branchSection.fields;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50/70 p-4 md:p-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500"><span className="font-semibold text-gray-700">School ERP</span><ChevronRight className="h-3 w-3" /><span>Home</span><ChevronRight className="h-3 w-3" /><span>Administration</span><ChevronRight className="h-3 w-3" /><span className="text-gray-800">Institute Profile & Branches</span></div>
            <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><School className="h-6 w-6" /></span><div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Institute Profile & Branches</h1><p className="mt-1 text-sm text-gray-500">Institute master record and connected campus locations</p></div></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetToSaved}><RotateCcw className="h-4 w-4" /> Reset to Saved</Button>
            <Button onClick={saveAllChanges}><Save className="h-4 w-4" /> Save All Changes</Button>
          </div>
        </div>
      </header>

      <div className="flex gap-2 border-b border-gray-200">
        {(['Institute Profile', 'Branches'] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab === 'Institute Profile' ? <School className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}{tab}</button>)}
      </div>

      {activeTab === 'Institute Profile' ? renderProfile() : renderBranches()}

      {toast && <div className="fixed bottom-5 right-5 z-[70] flex max-w-md items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle className="h-4 w-4 text-green-300" />{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X className="h-4 w-4" /></button></div>}

      {branchFormOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-3" role="dialog" aria-modal="true" aria-label="Branch form"><div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">{editingBranchId ? 'Edit Branch' : 'Add New Branch'}</h2><p className="text-xs text-gray-500">Maintain branch details linked to the institute master record.</p></div><button onClick={() => setBranchFormOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close branch form"><X className="h-5 w-5" /></button></div><div className="flex flex-wrap gap-1 border-b bg-gray-50 px-4 py-2">{branchFormSections.map((section) => <button key={section.key} onClick={() => setBranchFormSection(section.key)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${branchFormSection === section.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white'}`}>{section.label}</button>)}</div><div className="flex-1 overflow-y-auto p-5"><FieldGrid fields={visibleBranchFields} data={branchForm} onChange={(key, value) => setBranchForm((previous) => ({ ...previous, [key]: value }))} />{branchSection.checks?.map((group) => <CheckboxGroup key={group.key} group={group} value={branchForm[group.key] || ''} onChange={(key, value) => setBranchForm((previous) => ({ ...previous, [key]: value }))} />)}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50 px-5 py-4"><div className="flex gap-2"><Button variant="outline" onClick={() => setBranchFormOpen(false)}>Cancel</Button><Button onClick={saveBranch}><Save className="h-4 w-4" /> Save Branch</Button></div></div></div></div>}
    </div>
  );
}

