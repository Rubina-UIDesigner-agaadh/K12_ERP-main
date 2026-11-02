import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Toggle } from '../../../components/ui/Toggle';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Download, Eye, History, Plus, Save, Search, Shield, Upload } from 'lucide-react';

export const SIGNATURE_STORE = 'k12-signature-registry-v1';
export const SIGNATURE_PERMISSION_STORE = 'k12-signature-permissions-v1';
export const SIGNATURE_MAPPING_STORE = 'k12-signature-mappings-v1';
export const SIGNATURE_RULE_STORE = 'k12-signature-rules-v1';
export const SIGNATURE_AUDIT_STORE = 'k12-signature-audit-v1';

export type SignatureStatus = 'Pending Authorization' | 'Active' | 'Inactive' | 'Expired';
export type SignatureKind = 'Handwritten image' | 'Cryptographic (not this record)';
export type SigSection = 'registry' | 'permissions' | 'mapping' | 'rules' | 'audit';

export type SignatureRecord = {
  id: string; personName: string; employeeId: string; designation: string; school: string; branch: string;
  imageData: string; validFrom: string; validUntil: string; status: SignatureStatus; kind: SignatureKind;
  uploadedBy: string; authorizedBy: string; allowedDocuments: string[]; history: { at: string; by: string; action: string }[];
};
export type SignaturePermission = {
  id: string; signatureId: string; holder: string; roles: string[]; modules: string[]; documentTypes: string[];
  branchScope: string; approvalRequired: boolean; status: 'Active' | 'Revoked';
};
export type SignatureMapping = {
  id: string; module: string; template: string; slot: string; requiredDesignation: string; signatoryId: string;
  position: string; displayName: boolean; required: boolean;
};
export type SignatureRule = {
  id: string; documentType: string; approvalMode: 'Automatic after permissions' | 'Signatory approval' | 'Sequential approvers';
  approverRole: string; sequence: string; expiryRule: string; rejectionHandling: string; enabled: boolean;
};
export type SignatureAudit = {
  id: string; documentNumber: string; documentType: string; subject: string; holder: string; appliedBy: string;
  approvedBy: string; at: string; branch: string; action: string;
};

export const loadJson = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};
export const saveJson = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
export const stamp = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

const svgMark = (name: string, color = '#1e3a5f') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80"><text x="8" y="52" font-family="cursive" font-size="28" fill="${color}">${name}</text></svg>`)}`;

export const SEED_SIGNATURES: SignatureRecord[] = [
  { id: 'SIG-001', personName: 'Dr. Rajesh Sharma', employeeId: 'EMP-P01', designation: 'Principal', school: 'EduManager School', branch: 'Main Branch', imageData: svgMark('Rajesh Sharma'), validFrom: '2026-04-01', validUntil: '2027-03-31', status: 'Active', kind: 'Handwritten image', uploadedBy: 'School Admin', authorizedBy: 'Board Secretary', allowedDocuments: ['Marksheet', 'TC', 'Bonafide'], history: [{ at: '01 Apr 2026, 10:00', by: 'School Admin', action: 'Uploaded and authorized' }] },
  { id: 'SIG-002', personName: 'Priya Mehta', employeeId: 'EMP-T18', designation: 'Class Teacher', school: 'EduManager School', branch: 'Main Branch', imageData: svgMark('Priya Mehta', '#0f766e'), validFrom: '2026-04-01', validUntil: '2027-03-31', status: 'Active', kind: 'Handwritten image', uploadedBy: 'School Admin', authorizedBy: 'Dr. Rajesh Sharma', allowedDocuments: ['Report Card'], history: [{ at: '02 Apr 2026, 09:10', by: 'School Admin', action: 'Uploaded' }] },
  { id: 'SIG-003', personName: 'Anil Patel', employeeId: 'EMP-E07', designation: 'Exam Controller', school: 'EduManager School', branch: 'City Campus', imageData: svgMark('Anil Patel', '#7c2d12'), validFrom: '2025-04-01', validUntil: '2026-03-31', status: 'Inactive', kind: 'Handwritten image', uploadedBy: 'School Admin', authorizedBy: 'Dr. Rajesh Sharma', allowedDocuments: ['Marksheet', 'Hall Ticket'], history: [{ at: '31 Mar 2026, 18:00', by: 'School Admin', action: 'Deactivated — validity ended' }] }
];
export const SEED_PERMISSIONS: SignaturePermission[] = [
  { id: 'PER-001', signatureId: 'SIG-001', holder: 'Dr. Rajesh Sharma', roles: ['Exam Staff', 'Certificate Staff'], modules: ['Examination', 'Student Management', 'Admissions'], documentTypes: ['Marksheet', 'Bonafide', 'TC'], branchScope: 'All branches', approvalRequired: true, status: 'Active' },
  { id: 'PER-002', signatureId: 'SIG-002', holder: 'Priya Mehta', roles: ['Class Teacher'], modules: ['Examination'], documentTypes: ['Report Card'], branchScope: 'Main Branch', approvalRequired: false, status: 'Active' }
];
export const SEED_MAPPINGS: SignatureMapping[] = [
  { id: 'MAP-001', module: 'Examination', template: 'Marksheet — Term', slot: 'Signature Slot 1', requiredDesignation: 'Principal', signatoryId: 'SIG-001', position: 'Bottom right', displayName: true, required: true },
  { id: 'MAP-002', module: 'Examination', template: 'Report Card', slot: 'Class Teacher', requiredDesignation: 'Class Teacher', signatoryId: 'SIG-002', position: 'Bottom left', displayName: true, required: true },
  { id: 'MAP-003', module: 'Student Management', template: 'Bonafide Certificate', slot: 'Principal', requiredDesignation: 'Principal', signatoryId: 'SIG-001', position: 'Bottom center', displayName: true, required: true }
];
export const SEED_RULES: SignatureRule[] = [
  { id: 'RUL-001', documentType: 'Marksheet', approvalMode: 'Signatory approval', approverRole: 'Principal', sequence: 'Exam staff → Principal', expiryRule: 'Use active signature as of issue date', rejectionHandling: 'Hold document; do not apply image', enabled: true },
  { id: 'RUL-002', documentType: 'Report Card', approvalMode: 'Automatic after permissions', approverRole: 'Class Teacher', sequence: 'Class Teacher only', expiryRule: 'Use active signature as of issue date', rejectionHandling: 'Return to teacher', enabled: true }
];
export const SEED_AUDIT: SignatureAudit[] = [
  { id: 'AUD-001', documentNumber: 'MS-2026-04512', documentType: 'Marksheet', subject: 'Kabir Mehta (STU009)', holder: 'Dr. Rajesh Sharma', appliedBy: 'Exam Staff', approvedBy: 'Dr. Rajesh Sharma', at: '28 Oct 2026, 11:20', branch: 'Main Branch', action: 'Applied after approval' },
  { id: 'AUD-002', documentNumber: 'BNF-2026-0881', documentType: 'Bonafide', subject: 'Priya Patel (STU002)', holder: 'Dr. Rajesh Sharma', appliedBy: 'Front Office', approvedBy: 'Dr. Rajesh Sharma', at: '29 Oct 2026, 09:05', branch: 'Main Branch', action: 'Applied after approval' }
];
export const loadSignatures = () => loadJson(SIGNATURE_STORE, SEED_SIGNATURES);
export const saveSignatures = (rows: SignatureRecord[]) => saveJson(SIGNATURE_STORE, rows);

const DESIGNATIONS = ['Principal', 'Vice Principal', 'Class Teacher', 'Examination Controller', 'Director', 'HR Head', 'Finance Head', 'Admission Officer', 'School Administrator'];
const CAMPUS = ['Main Branch', 'City Campus', 'North Campus'];
const ALL_DOCS = ['Marksheet', 'Report Card', 'Hall Ticket', 'Bonafide', 'TC', 'Character Certificate', 'Fee Receipt', 'Salary Certificate', 'Experience Certificate', 'NOC'];
const ROLE_OPTS = ['School Admin', 'Exam Staff', 'Certificate Staff', 'Class Teacher', 'HR Staff', 'Finance Staff', 'Front Office'].map((item) => ({ value: item, label: item }));
const MODULE_OPTS = ['Examination', 'Student Management', 'Admissions', 'Finance', 'HRMS', 'Administration'].map((item) => ({ value: item, label: item }));
const DOC_OPTS = ['Marksheet', 'Report Card', 'Hall Ticket', 'Bonafide', 'TC', 'Fee Receipt', 'Salary Certificate', 'Experience Certificate'].map((item) => ({ value: item, label: item }));
const SCOPE_OPTS = ['All branches', 'Main Branch', 'City Campus', 'North Campus'];
const MODULES = MODULE_OPTS.map((item) => item.value);
const TEMPLATES: Record<string, string[]> = {
  Examination: ['Marksheet — Term', 'Report Card', 'Hall Ticket'],
  'Student Management': ['Bonafide Certificate', 'Transfer Certificate', 'Character Certificate'],
  Admissions: ['Admission Confirmation', 'Enrollment Certificate'],
  Finance: ['Fee Receipt', 'Refund Approval', 'Financial Certificate'],
  HRMS: ['Experience Certificate', 'Employment Certificate', 'Salary Certificate'],
  Administration: ['Official Letter', 'NOC', 'School Certificate']
};
const SLOTS = ['Signature Slot 1', 'Principal', 'Class Teacher', 'Exam Controller', 'School Seal'];
const POSITIONS = ['Bottom left', 'Bottom center', 'Bottom right', 'Footer band'];
const RULE_DOCS = ['Marksheet', 'Report Card', 'Hall Ticket', 'Bonafide', 'TC', 'Fee Receipt', 'Salary Certificate', 'Official Letter'];
const MODES: SignatureRule['approvalMode'][] = ['Automatic after permissions', 'Signatory approval', 'Sequential approvers'];
const SECTIONS: { id: SigSection; label: string }[] = [
  { id: 'registry', label: 'Signature Registry' },
  { id: 'permissions', label: 'Usage & Permissions' },
  { id: 'mapping', label: 'Document Mapping' },
  { id: 'rules', label: 'Approval Rules' },
  { id: 'audit', label: 'Usage Audit Log' }
];

const emptySig = (): SignatureRecord => ({
  id: `SIG-${Date.now()}`, personName: '', employeeId: '', designation: 'Principal', school: 'EduManager School',
  branch: 'Main Branch', imageData: '', validFrom: '2026-04-01', validUntil: '2027-03-31', status: 'Pending Authorization',
  kind: 'Handwritten image', uploadedBy: 'School Admin', authorizedBy: '', allowedDocuments: [], history: []
});
const emptyPerm = (signatureId: string, holder: string): SignaturePermission => ({
  id: `PER-${Date.now()}`, signatureId, holder, roles: [], modules: [], documentTypes: [], branchScope: 'All branches', approvalRequired: true, status: 'Active'
});
const emptyMap = (): SignatureMapping => ({
  id: `MAP-${Date.now()}`, module: 'Examination', template: 'Marksheet — Term', slot: 'Signature Slot 1',
  requiredDesignation: 'Principal', signatoryId: '', position: 'Bottom right', displayName: true, required: true
});
const emptyRule = (): SignatureRule => ({
  id: `RUL-${Date.now()}`, documentType: 'Marksheet', approvalMode: 'Signatory approval', approverRole: 'Principal',
  sequence: 'Preparer → Signatory', expiryRule: 'Use the signature that was active on the issue date',
  rejectionHandling: 'Do not apply the image; return the document', enabled: true
});
const sectionFromPath = (): SigSection => {
  const path = typeof window === 'undefined' ? '' : window.location.pathname;
  if (path.includes('signature-usage-permissions')) return 'permissions';
  if (path.includes('document-signature-mapping')) return 'mapping';
  if (path.includes('signature-approval-rules')) return 'rules';
  if (path.includes('signature-usage-audit-log')) return 'audit';
  return 'registry';
};

export function SignatureRegistry() {
  const navigate = useNavigate();
  const [section, setSection] = useState<SigSection>(() => sectionFromPath());
  const [notice, setNotice] = useState('');
  const [rows, setRows] = useState<SignatureRecord[]>(() => loadSignatures());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<SignatureRecord | null>(null);
  const [preview, setPreview] = useState<SignatureRecord | null>(null);
  const [historyOf, setHistoryOf] = useState<SignatureRecord | null>(null);
  const [permRows, setPermRows] = useState<SignaturePermission[]>(() => loadJson(SIGNATURE_PERMISSION_STORE, SEED_PERMISSIONS));
  const [permDraft, setPermDraft] = useState<SignaturePermission | null>(null);
  const [mapRows, setMapRows] = useState<SignatureMapping[]>(() => loadJson(SIGNATURE_MAPPING_STORE, SEED_MAPPINGS));
  const [mapDraft, setMapDraft] = useState<SignatureMapping | null>(null);
  const [mapPreview, setMapPreview] = useState<SignatureMapping | null>(null);
  const [ruleRows, setRuleRows] = useState<SignatureRule[]>(() => loadJson(SIGNATURE_RULE_STORE, SEED_RULES));
  const [ruleDraft, setRuleDraft] = useState<SignatureRule | null>(null);
  const [auditRows] = useState<SignatureAudit[]>(() => loadJson(SIGNATURE_AUDIT_STORE, SEED_AUDIT));
  const [auditSearch, setAuditSearch] = useState('');
  const [auditType, setAuditType] = useState('');
  const [auditBranch, setAuditBranch] = useState('');

  useEffect(() => { setSection(sectionFromPath()); }, []);

  const persistSig = (next: SignatureRecord[], message?: string) => { setRows(next); saveSignatures(next); if (message) setNotice(message); };
  const persistPerm = (next: SignaturePermission[], message?: string) => { setPermRows(next); saveJson(SIGNATURE_PERMISSION_STORE, next); if (message) setNotice(message); };
  const persistMap = (next: SignatureMapping[], message?: string) => { setMapRows(next); saveJson(SIGNATURE_MAPPING_STORE, next); if (message) setNotice(message); };
  const persistRule = (next: SignatureRule[], message?: string) => { setRuleRows(next); saveJson(SIGNATURE_RULE_STORE, next); if (message) setNotice(message); };

  const filtered = rows.filter((row) => {
    if (statusFilter !== 'All' && row.status !== statusFilter) return false;
    if (search && !(`${row.personName} ${row.employeeId} ${row.designation}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });
  const counts = useMemo(() => ({ total: rows.length, active: rows.filter((r) => r.status === 'Active').length, inactive: rows.filter((r) => r.status !== 'Active').length }), [rows]);
  const activeSigs = rows.filter((item) => item.status === 'Active');
  const signatory = (id: string) => rows.find((item) => item.id === id);
  const auditFiltered = auditRows.filter((row) => {
    if (auditType && row.documentType !== auditType) return false;
    if (auditBranch && row.branch !== auditBranch) return false;
    if (auditSearch && !(`${row.documentNumber} ${row.subject} ${row.holder} ${row.appliedBy}`.toLowerCase().includes(auditSearch.toLowerCase()))) return false;
    return true;
  });

  const onFile = (file: File) => {
    if (!draft) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, imageData: String(reader.result || '') });
    reader.readAsDataURL(file);
  };
  const saveDraft = () => {
    if (!draft) return;
    if (!draft.personName.trim() || !draft.employeeId.trim()) { setNotice('Person name and employee ID are required.'); return; }
    if (!draft.imageData) { setNotice('Upload a signature image. It is stored in protected browser storage, not a public URL.'); return; }
    const exists = rows.some((item) => item.id === draft.id);
    const nextRow = { ...draft, history: [...draft.history, { at: stamp(), by: 'School Admin', action: exists ? 'Updated / replaced image' : 'Uploaded (pending authorization)' }] };
    persistSig(exists ? rows.map((item) => item.id === nextRow.id ? nextRow : item) : [nextRow, ...rows], exists ? 'Signature updated. Previously issued documents are unchanged.' : 'Signature uploaded. Authorization is required before it can be activated.');
    setShowForm(false);
  };
  const authorize = (row: SignatureRecord) => persistSig(rows.map((item) => item.id === row.id ? { ...item, status: 'Active', authorizedBy: item.authorizedBy || 'School Admin', history: [...item.history, { at: stamp(), by: 'School Admin', action: 'Authorized and activated' }] } : item), 'Signature authorized. Ordinary document users still cannot download the original image.');
  const deactivate = (row: SignatureRecord) => persistSig(rows.map((item) => item.id === row.id ? { ...item, status: 'Inactive', history: [...item.history, { at: stamp(), by: 'School Admin', action: 'Revoked for future use. Issued documents kept as-is.' }] } : item), 'Revoked for future documents. Previously issued documents were not modified.');
  const savePerm = () => {
    if (!permDraft) return;
    if (!permDraft.signatureId) { setNotice('Select a signature holder.'); return; }
    const exists = permRows.some((item) => item.id === permDraft.id);
    persistPerm(exists ? permRows.map((item) => item.id === permDraft.id ? permDraft : item) : [permDraft, ...permRows], exists ? 'Access updated.' : 'Permission assigned.');
    setPermDraft(null);
  };
  const saveMap = () => {
    if (!mapDraft) return;
    if (!mapDraft.signatoryId) { setNotice('Assign an authorized signatory.'); return; }
    const exists = mapRows.some((item) => item.id === mapDraft.id);
    persistMap(exists ? mapRows.map((item) => item.id === mapDraft.id ? mapDraft : item) : [mapDraft, ...mapRows], 'Mapping saved. Template designers use this same record.');
    setMapDraft(null);
  };
  const saveRule = () => {
    if (!ruleDraft) return;
    const exists = ruleRows.some((item) => item.id === ruleDraft.id);
    persistRule(exists ? ruleRows.map((item) => item.id === ruleDraft.id ? ruleDraft : item) : [ruleDraft, ...ruleRows], 'Authorization rule saved.');
    setRuleDraft(null);
  };
  const exportAudit = () => {
    const header = 'Document Number,Document Type,Student/Employee,Signature Holder,Applied By,Approved By,Date & Time,Branch,Action';
    const body = auditFiltered.map((row) => [row.documentNumber, row.documentType, row.subject, row.holder, row.appliedBy, row.approvedBy, row.at, row.branch, row.action].join(',')).join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'signature-usage-audit.csv'; a.click(); URL.revokeObjectURL(url);
    setNotice('Audit report exported. Records are append-only.');
  };

  return (
    <div className="space-y-6 p-6">
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div>
        <p className="text-xs text-gray-400">Admin Tools &gt; Document &amp; Certificate Settings &gt; Signature Management</p>
        <h1 className="text-2xl font-bold text-gray-900">Signature Management</h1>
        <p className="text-sm text-gray-500">One place to register signatures, assign permissions, map templates, set approval rules, and review audit history.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((item) => (
          <button key={item.id} type="button" onClick={() => { setSection(item.id); setNotice(''); }} className={`rounded-lg border px-3 py-2 text-sm ${section === item.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700'}`}>{item.label}</button>
        ))}
      </div>

      {section === 'registry' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <Card><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-bold">{counts.total}</p></Card>
              <Card><p className="text-xs text-gray-500">Active</p><p className="text-2xl font-bold text-emerald-700">{counts.active}</p></Card>
              <Card><p className="text-xs text-gray-500">Inactive</p><p className="text-2xl font-bold text-gray-600">{counts.inactive}</p></Card>
            </div>
            <Button onClick={() => { setDraft(emptySig()); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" />Add New</Button>
          </div>
          {!showForm && (
            <Card>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {['All', 'Active', 'Pending Authorization', 'Inactive', 'Expired'].map((item) => (
                  <button key={item} type="button" onClick={() => setStatusFilter(item)} className={`rounded-lg border px-3 py-1.5 text-sm ${statusFilter === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>{item}</button>
                ))}
                <div className="relative min-w-[220px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, employee ID, designation" className="h-9 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Signatory</th><th className="px-3 py-3">Allowed documents</th><th className="px-3 py-3">Validity</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-3"><p className="font-medium text-gray-900">{row.personName}</p><p className="text-xs text-gray-500">{row.designation} · {row.employeeId} · {row.branch}</p></td>
                        <td className="px-3 py-3 text-center">{row.allowedDocuments.join(', ') || '—'}</td>
                        <td className="px-3 py-3 text-center text-xs">{row.validFrom} → {row.validUntil}</td>
                        <td className="px-3 py-3 text-center"><Badge variant={row.status === 'Active' ? 'success' : row.status === 'Pending Authorization' ? 'warning' : 'secondary'}>{row.status}</Badge></td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap justify-center gap-1">
                            <Button size="xs" variant="outline" onClick={() => setPreview(row)}><Eye className="mr-1 h-3 w-3" />Preview</Button>
                            <Button size="xs" variant="outline" onClick={() => { setDraft({ ...row }); setShowForm(true); }}>Edit / Replace</Button>
                            {row.status === 'Pending Authorization' && <Button size="xs" onClick={() => authorize(row)}><Shield className="mr-1 h-3 w-3" />Authorize</Button>}
                            {row.status === 'Active' && <Button size="xs" variant="outline" onClick={() => deactivate(row)}>Deactivate</Button>}
                            <Button size="xs" variant="ghost" onClick={() => setHistoryOf(row)}><History className="h-3 w-3" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-gray-500">This is an image of a handwritten signature, not a cryptographic digital signature.</p>
            </Card>
          )}
          {showForm && draft && (
            <Card title={rows.some((item) => item.id === draft.id) ? 'Edit / replace signature' : 'Add signature'}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Person name *" value={draft.personName} onChange={(e) => setDraft({ ...draft, personName: e.target.value })} />
                <Input label="Employee ID *" value={draft.employeeId} onChange={(e) => setDraft({ ...draft, employeeId: e.target.value })} />
                <Select label="Designation" options={DESIGNATIONS.map((item) => ({ value: item, label: item }))} value={draft.designation} onChange={(v) => setDraft({ ...draft, designation: typeof v === 'string' ? v : v.target.value })} />
                <Input label="School" value={draft.school} onChange={(e) => setDraft({ ...draft, school: e.target.value })} />
                <Select label="Branch" options={CAMPUS.map((item) => ({ value: item, label: item }))} value={draft.branch} onChange={(v) => setDraft({ ...draft, branch: typeof v === 'string' ? v : v.target.value })} />
                <Input label="Authorized by" value={draft.authorizedBy} onChange={(e) => setDraft({ ...draft, authorizedBy: e.target.value })} />
                <Input label="Valid from" type="date" value={draft.validFrom} onChange={(e) => setDraft({ ...draft, validFrom: e.target.value })} />
                <Input label="Valid until" type="date" value={draft.validUntil} onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })} />
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm font-medium text-gray-700">Allowed documents</p>
                  <div className="flex flex-wrap gap-2">{ALL_DOCS.map((doc) => { const on = draft.allowedDocuments.includes(doc); return <button key={doc} type="button" className={`rounded-full border px-3 py-1 text-xs ${on ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300'}`} onClick={() => setDraft({ ...draft, allowedDocuments: on ? draft.allowedDocuments.filter((d) => d !== doc) : [...draft.allowedDocuments, doc] })}>{doc}</button>; })}</div>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm font-medium text-gray-700">Signature image (protected storage)</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"><Upload className="h-4 w-4" /> Upload image<input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) onFile(file); }} /></label>
                  {draft.imageData && <img src={draft.imageData} alt="Signature preview" className="mt-3 h-20 rounded border border-dashed border-gray-300 bg-white px-3" />}
                </div>
              </div>
              <div className="mt-4 flex gap-2"><Button onClick={saveDraft}><Save className="mr-1 h-4 w-4" />Save</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
            </Card>
          )}
        </>
      )}

      {section === 'permissions' && (
        <>
          <div className="flex justify-end"><Button onClick={() => setPermDraft(emptyPerm(rows[0]?.id || '', rows[0]?.personName || ''))}><Plus className="mr-2 h-4 w-4" />Assign Permission</Button></div>
          <Card>
            <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3"><p className="font-medium text-indigo-900">Manage Signature</p><p className="text-xs text-indigo-800">School Admin or designated administrator</p></div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3"><p className="font-medium text-amber-900">Approve Signature Use</p><p className="text-xs text-amber-800">Signature owner or authorized approver</p></div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3"><p className="font-medium text-emerald-900">Generate Signed Document</p><p className="text-xs text-emerald-800">Staff cannot download the original image</p></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Holder</th><th className="px-3 py-3">Roles</th><th className="px-3 py-3">Modules</th><th className="px-3 py-3">Documents</th><th className="px-3 py-3">Branch</th><th className="px-3 py-3">Approval</th><th className="px-3 py-3">Status</th><th className="px-3 py-3"></th></tr></thead>
                <tbody>
                  {permRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3 font-medium">{row.holder}</td>
                      <td className="px-3 py-3 text-center">{row.roles.join(', ')}</td>
                      <td className="px-3 py-3 text-center">{row.modules.join(', ')}</td>
                      <td className="px-3 py-3 text-center">{row.documentTypes.join(', ')}</td>
                      <td className="px-3 py-3 text-center">{row.branchScope}</td>
                      <td className="px-3 py-3 text-center">{row.approvalRequired ? 'Required' : 'Not required'}</td>
                      <td className="px-3 py-3 text-center"><Badge variant={row.status === 'Active' ? 'success' : 'danger'}>{row.status}</Badge></td>
                      <td className="px-3 py-3 text-center">
                        <Button size="xs" variant="outline" onClick={() => setPermDraft({ ...row })}>Update Access</Button>
                        {row.status === 'Active' && <Button size="xs" variant="ghost" onClick={() => persistPerm(permRows.map((item) => item.id === row.id ? { ...item, status: 'Revoked' } : item), 'Permission revoked for future use.')}>Revoke</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {permDraft && (
            <Card title="Assign / update permission">
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Signature holder" options={rows.map((item) => ({ value: item.id, label: `${item.personName} — ${item.designation}` }))} value={permDraft.signatureId} onChange={(v) => { const id = typeof v === 'string' ? v : v.target.value; setPermDraft({ ...permDraft, signatureId: id, holder: rows.find((item) => item.id === id)?.personName || permDraft.holder }); }} />
                <Select label="Branch scope" options={SCOPE_OPTS.map((item) => ({ value: item, label: item }))} value={permDraft.branchScope} onChange={(v) => setPermDraft({ ...permDraft, branchScope: typeof v === 'string' ? v : v.target.value })} />
                <MultiSelect label="Allowed user roles" options={ROLE_OPTS} value={permDraft.roles} onChange={(roles) => setPermDraft({ ...permDraft, roles })} />
                <MultiSelect label="Allowed modules" options={MODULE_OPTS} value={permDraft.modules} onChange={(modules) => setPermDraft({ ...permDraft, modules })} />
                <div className="md:col-span-2"><MultiSelect label="Allowed document types" options={DOC_OPTS} value={permDraft.documentTypes} onChange={(documentTypes) => setPermDraft({ ...permDraft, documentTypes })} /></div>
                <Toggle label="Approval required before applying this signature" checked={permDraft.approvalRequired} onChange={(checked) => setPermDraft({ ...permDraft, approvalRequired: checked })} />
              </div>
              <p className="mt-3 text-xs text-gray-500">A Class Teacher can generate a report card with the Principal&apos;s signature without downloading or replacing that image.</p>
              <div className="mt-4 flex gap-2"><Button onClick={savePerm}><Save className="mr-1 h-4 w-4" />Save permission</Button><Button variant="outline" onClick={() => setPermDraft(null)}>Cancel</Button></div>
            </Card>
          )}
        </>
      )}

      {section === 'mapping' && (
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/assessment/general/report-card-designer')}>Report Card Designer</Button>
            <Button variant="outline" onClick={() => navigate('/student/certificates/print-template')}>Certificate Templates</Button>
            <Button onClick={() => setMapDraft(emptyMap())}><Plus className="mr-2 h-4 w-4" />Configure</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Module / template</th><th className="px-3 py-3">Slot</th><th className="px-3 py-3">Required designation</th><th className="px-3 py-3">Assigned signatory</th><th className="px-3 py-3">Position</th><th className="px-3 py-3">Required</th><th className="px-3 py-3"></th></tr></thead>
                <tbody>
                  {mapRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3"><p className="font-medium">{row.template}</p><p className="text-xs text-gray-500">{row.module}</p></td>
                      <td className="px-3 py-3 text-center">{row.slot}</td>
                      <td className="px-3 py-3 text-center">{row.requiredDesignation}</td>
                      <td className="px-3 py-3 text-center">{signatory(row.signatoryId)?.personName || '—'}</td>
                      <td className="px-3 py-3 text-center">{row.position}</td>
                      <td className="px-3 py-3 text-center"><Badge variant={row.required ? 'warning' : 'secondary'}>{row.required ? 'Required' : 'Optional'}</Badge></td>
                      <td className="px-3 py-3 text-center"><Button size="xs" variant="outline" onClick={() => setMapDraft({ ...row })}>Update Mapping</Button><Button size="xs" variant="ghost" onClick={() => setMapPreview(row)}>Preview</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {mapDraft && (
            <Card title="Marksheet Designer — Signature Settings">
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Module" options={MODULES.map((item) => ({ value: item, label: item }))} value={mapDraft.module} onChange={(v) => { const module = typeof v === 'string' ? v : v.target.value; setMapDraft({ ...mapDraft, module, template: (TEMPLATES[module] || [''])[0] }); }} />
                <Select label="Document template" options={(TEMPLATES[mapDraft.module] || []).map((item) => ({ value: item, label: item }))} value={mapDraft.template} onChange={(v) => setMapDraft({ ...mapDraft, template: typeof v === 'string' ? v : v.target.value })} />
                <Select label="Signature slot" options={SLOTS.map((item) => ({ value: item, label: item }))} value={mapDraft.slot} onChange={(v) => setMapDraft({ ...mapDraft, slot: typeof v === 'string' ? v : v.target.value })} />
                <Input label="Required designation" value={mapDraft.requiredDesignation} onChange={(e) => setMapDraft({ ...mapDraft, requiredDesignation: e.target.value })} />
                <Select label="Authorized signatory" options={activeSigs.map((item) => ({ value: item.id, label: `${item.designation} — ${item.personName}` }))} value={mapDraft.signatoryId} onChange={(v) => setMapDraft({ ...mapDraft, signatoryId: typeof v === 'string' ? v : v.target.value })} />
                <Select label="Position" options={POSITIONS.map((item) => ({ value: item, label: item }))} value={mapDraft.position} onChange={(v) => setMapDraft({ ...mapDraft, position: typeof v === 'string' ? v : v.target.value })} />
                <Toggle label="Display signatory name and designation" checked={mapDraft.displayName} onChange={(checked) => setMapDraft({ ...mapDraft, displayName: checked })} />
                <Toggle label="Required slot" checked={mapDraft.required} onChange={(checked) => setMapDraft({ ...mapDraft, required: checked })} />
              </div>
              <div className="mt-4 flex gap-2"><Button onClick={saveMap}><Save className="mr-1 h-4 w-4" />Save mapping</Button><Button variant="outline" onClick={() => setMapDraft(null)}>Cancel</Button></div>
            </Card>
          )}
        </>
      )}

      {section === 'rules' && (
        <>
          <div className="flex justify-end"><Button onClick={() => setRuleDraft(emptyRule())}><Plus className="mr-2 h-4 w-4" />Create Rule</Button></div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Document type</th><th className="px-3 py-3">Approval mode</th><th className="px-3 py-3">Approver role</th><th className="px-3 py-3">Sequence</th><th className="px-3 py-3">Status</th><th className="px-3 py-3"></th></tr></thead>
                <tbody>
                  {ruleRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3 font-medium">{row.documentType}</td>
                      <td className="px-3 py-3 text-center">{row.approvalMode}</td>
                      <td className="px-3 py-3 text-center">{row.approverRole}</td>
                      <td className="px-3 py-3 text-center">{row.sequence}</td>
                      <td className="px-3 py-3 text-center"><Badge variant={row.enabled ? 'success' : 'secondary'}>{row.enabled ? 'Enabled' : 'Disabled'}</Badge></td>
                      <td className="px-3 py-3 text-center">
                        <Button size="xs" variant="outline" onClick={() => setRuleDraft({ ...row })}>Modify Rule</Button>
                        <Button size="xs" variant="ghost" onClick={() => persistRule(ruleRows.map((item) => item.id === row.id ? { ...item, enabled: !item.enabled } : item), row.enabled ? 'Rule disabled.' : 'Rule enabled.')}>{row.enabled ? 'Disable' : 'Enable'}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {ruleDraft && (
            <Card title="Authorization rule">
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Document type" options={RULE_DOCS.map((item) => ({ value: item, label: item }))} value={ruleDraft.documentType} onChange={(v) => setRuleDraft({ ...ruleDraft, documentType: typeof v === 'string' ? v : v.target.value })} />
                <Select label="Approval mode" options={MODES.map((item) => ({ value: item, label: item }))} value={ruleDraft.approvalMode} onChange={(v) => setRuleDraft({ ...ruleDraft, approvalMode: (typeof v === 'string' ? v : v.target.value) as SignatureRule['approvalMode'] })} />
                <Input label="Approver role" value={ruleDraft.approverRole} onChange={(e) => setRuleDraft({ ...ruleDraft, approverRole: e.target.value })} />
                <Input label="Approval sequence" value={ruleDraft.sequence} onChange={(e) => setRuleDraft({ ...ruleDraft, sequence: e.target.value })} />
                <Input label="Expiry rules" value={ruleDraft.expiryRule} onChange={(e) => setRuleDraft({ ...ruleDraft, expiryRule: e.target.value })} />
                <Input label="Rejection handling" value={ruleDraft.rejectionHandling} onChange={(e) => setRuleDraft({ ...ruleDraft, rejectionHandling: e.target.value })} />
                <Toggle label="Enable rule" checked={ruleDraft.enabled} onChange={(checked) => setRuleDraft({ ...ruleDraft, enabled: checked })} />
              </div>
              <p className="mt-3 text-xs text-gray-500">Issued documents keep the signature applied at the time. Disabling a rule does not rewrite history.</p>
              <div className="mt-4 flex gap-2"><Button onClick={saveRule}><Save className="mr-1 h-4 w-4" />Save rule</Button><Button variant="outline" onClick={() => setRuleDraft(null)}>Cancel</Button></div>
            </Card>
          )}
        </>
      )}

      {section === 'audit' && (
        <Card>
          <div className="mb-4 flex flex-wrap items-end gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
              <Input label="Search" value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} placeholder="Document no., student, holder, applied by" />
            </div>
            <Select label="Document type" options={[{ value: '', label: 'All types' }, ...Array.from(new Set(auditRows.map((row) => row.documentType))).map((item) => ({ value: item, label: item }))]} value={auditType} onChange={(v) => setAuditType(typeof v === 'string' ? v : v.target.value)} />
            <Select label="Branch" options={[{ value: '', label: 'All branches' }, ...Array.from(new Set(auditRows.map((row) => row.branch))).map((item) => ({ value: item, label: item }))]} value={auditBranch} onChange={(v) => setAuditBranch(typeof v === 'string' ? v : v.target.value)} />
            <Button onClick={exportAudit}><Download className="mr-2 h-4 w-4" />Export Report</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Document</th><th className="px-3 py-3">Type</th><th className="px-3 py-3 text-left">Student / Employee</th><th className="px-3 py-3">Holder</th><th className="px-3 py-3">Applied by</th><th className="px-3 py-3">Approved by</th><th className="px-3 py-3">Date &amp; time</th><th className="px-3 py-3">Branch</th><th className="px-3 py-3">Action</th></tr></thead>
              <tbody>
                {auditFiltered.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 font-medium">{row.documentNumber}</td>
                    <td className="px-3 py-3 text-center"><Badge variant="secondary">{row.documentType}</Badge></td>
                    <td className="px-3 py-3">{row.subject}</td>
                    <td className="px-3 py-3 text-center">{row.holder}</td>
                    <td className="px-3 py-3 text-center">{row.appliedBy}</td>
                    <td className="px-3 py-3 text-center">{row.approvedBy}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{row.at}</td>
                    <td className="px-3 py-3 text-center">{row.branch}</td>
                    <td className="px-3 py-3">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditFiltered.length === 0 && <p className="p-4 text-sm text-gray-500">No audit rows for this filter.</p>}
        </Card>
      )}

      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title="Signature preview" footer={<Button onClick={() => setPreview(null)}>Close</Button>}>
        {preview && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">{preview.personName} · {preview.designation}</p>
            <div className="rounded-lg border bg-slate-50 p-4"><img src={preview.imageData} alt="" className="h-16" /></div>
            <p className="text-xs text-gray-500">{preview.kind}. Uploaded by {preview.uploadedBy}. Authorized by {preview.authorizedBy || '—'}</p>
          </div>
        )}
      </Modal>
      <Modal isOpen={!!historyOf} onClose={() => setHistoryOf(null)} title="Signature history" footer={<Button onClick={() => setHistoryOf(null)}>Close</Button>}>
        <ul className="space-y-2 text-sm">{(historyOf?.history || []).map((item, i) => <li key={i} className="rounded bg-gray-50 px-3 py-2">{item.at} · {item.by}<br /><span className="text-gray-600">{item.action}</span></li>)}</ul>
      </Modal>
      <Modal isOpen={!!mapPreview} onClose={() => setMapPreview(null)} title="Footer preview" footer={<Button onClick={() => setMapPreview(null)}>Close</Button>}>
        {mapPreview && (
          <div className="rounded-lg border bg-white p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400">Marksheet footer preview</p>
            {signatory(mapPreview.signatoryId)?.imageData && <img src={signatory(mapPreview.signatoryId)!.imageData} alt="" className="mx-auto mt-4 h-12" />}
            {mapPreview.displayName && <><p className="mt-2 font-medium">{signatory(mapPreview.signatoryId)?.personName}</p><p className="text-xs text-gray-500">{signatory(mapPreview.signatoryId)?.designation}</p></>}
            <p className="mt-4 text-xs text-gray-500">School Seal · Apply after required approvals. Uses the central registry, not a pasted copy.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SignatureRegistry;
