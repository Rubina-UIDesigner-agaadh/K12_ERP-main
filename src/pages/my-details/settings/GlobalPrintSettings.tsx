import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import { Badge } from '../../../components/ui/Badge';
import { Download, Plus, Save, Search } from 'lucide-react';

export const PRINT_GLOBAL_STORE = 'k12-print-global-v1';
export const PRINT_MODULE_STORE = 'k12-print-module-v1';
export const PRINT_DOCUMENT_STORE = 'k12-print-document-v1';
export const PRINT_PERMISSION_STORE = 'k12-print-permissions-v1';
export const PRINT_HISTORY_STORE = 'k12-print-history-v1';

export type PrintSection = 'global' | 'module' | 'document' | 'access' | 'history';
export type PrintSettings = {
  paperSize: string; orientation: 'Portrait' | 'Landscape'; marginPreset: 'Narrow' | 'Normal' | 'Wide' | 'Custom';
  marginTop: number; marginRight: number; marginBottom: number; marginLeft: number; scale: string;
  colorMode: 'Color' | 'Black & White'; sides: 'Single-sided' | 'Double-sided'; copies: number;
  header: boolean; footer: boolean; schoolNameInHeader: boolean; logoInHeader: boolean; pageNumbers: boolean;
  pageNumberPos: string; watermark: string; customWatermark: string; dateTime: boolean; backgroundGraphics: boolean;
  printArea: 'Entire Document' | 'Selected Sections'; output: 'Print' | 'Save as PDF';
};
export type ModulePrintDefault = { id: string; module: string; enabled: boolean; paperSize: string; orientation: 'Portrait' | 'Landscape'; notes: string };
export type DocumentPrintConfig = { id: string; module: string; template: string; paperSize: string; orientation: 'Portrait' | 'Landscape'; locked: boolean; notes: string };
export type PrintPermissionRow = { id: string; action: string; superAdmin: boolean; schoolAdmin: boolean; staff: boolean };
export type PrintHistoryRow = { id: string; at: string; user: string; document: string; module: string; output: string; copies: number; school: string; branch: string };

export const DEFAULT_PRINT: PrintSettings = {
  paperSize: 'A4', orientation: 'Portrait', marginPreset: 'Normal', marginTop: 12, marginRight: 12, marginBottom: 12, marginLeft: 12,
  scale: '100%', colorMode: 'Color', sides: 'Single-sided', copies: 1, header: true, footer: true, schoolNameInHeader: true,
  logoInHeader: true, pageNumbers: true, pageNumberPos: 'Bottom center', watermark: 'None', customWatermark: '', dateTime: false,
  backgroundGraphics: true, printArea: 'Entire Document', output: 'Save as PDF'
};
export const SEED_MODULE_PRINT: ModulePrintDefault[] = [
  { id: 'm1', module: 'Student Management', enabled: true, paperSize: 'A4', orientation: 'Portrait', notes: 'Certificates inherit template size when locked.' },
  { id: 'm2', module: 'Examination — Marksheet', enabled: true, paperSize: 'Template', orientation: 'Portrait', notes: 'Based on marksheet template' },
  { id: 'm3', module: 'Examination — Hall Ticket', enabled: true, paperSize: 'A4', orientation: 'Portrait', notes: '' },
  { id: 'm4', module: 'Finance — Fee Receipt', enabled: true, paperSize: 'Receipt', orientation: 'Portrait', notes: 'A4 or receipt template size' },
  { id: 'm5', module: 'Finance — Ledgers', enabled: true, paperSize: 'A4', orientation: 'Landscape', notes: '' },
  { id: 'm6', module: 'HRMS — Salary Slip', enabled: true, paperSize: 'A4', orientation: 'Portrait', notes: '' },
  { id: 'm7', module: 'HRMS — Employee Reports', enabled: true, paperSize: 'A4', orientation: 'Landscape', notes: '' },
  { id: 'm8', module: 'Library — Barcode Labels', enabled: true, paperSize: 'Custom Label', orientation: 'Landscape', notes: 'Custom label size' },
  { id: 'm9', module: 'ID Card Management', enabled: true, paperSize: 'Custom Card', orientation: 'Landscape', notes: 'Custom card size' },
  { id: 'm10', module: 'Certificates', enabled: true, paperSize: 'Template', orientation: 'Portrait', notes: 'Based on certificate template' }
];
export const SEED_DOC_PRINT: DocumentPrintConfig[] = [
  { id: 'd1', module: 'Examination', template: 'Marksheet — Term', paperSize: 'A4', orientation: 'Portrait', locked: true, notes: 'Signature placement is locked with the approved template.' },
  { id: 'd2', module: 'Student Management', template: 'Bonafide Certificate', paperSize: 'A4', orientation: 'Portrait', locked: true, notes: 'Official dimensions locked.' },
  { id: 'd3', module: 'ID Card Management', template: 'Student ID Card', paperSize: 'CR80', orientation: 'Landscape', locked: true, notes: 'Custom card size' },
  { id: 'd4', module: 'Finance', template: 'Fee Receipt', paperSize: 'A5', orientation: 'Portrait', locked: false, notes: '' }
];
export const SEED_PRINT_PERMS: PrintPermissionRow[] = [
  { id: 'p1', action: 'Configure system-wide defaults', superAdmin: true, schoolAdmin: false, staff: false },
  { id: 'p2', action: 'Configure school defaults', superAdmin: true, schoolAdmin: true, staff: false },
  { id: 'p3', action: 'Configure module defaults', superAdmin: true, schoolAdmin: true, staff: false },
  { id: 'p4', action: 'Change settings for current print', superAdmin: true, schoolAdmin: true, staff: true },
  { id: 'p5', action: 'Reset school defaults', superAdmin: true, schoolAdmin: true, staff: false },
  { id: 'p6', action: 'View print history', superAdmin: true, schoolAdmin: true, staff: false }
];
export const SEED_PRINT_HISTORY: PrintHistoryRow[] = [
  { id: 'h1', at: '30 Oct 2026, 14:12', user: 'Exam Staff', document: 'Marksheet MS-2026-04512', module: 'Examination', output: 'PDF', copies: 1, school: 'EduManager School', branch: 'Main Branch' },
  { id: 'h2', at: '31 Oct 2026, 09:40', user: 'Front Office', document: 'Bonafide BNF-2026-0881', module: 'Student Management', output: 'Print', copies: 2, school: 'EduManager School', branch: 'Main Branch' }
];

export const loadJson = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};
export const saveJson = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
export const loadGlobalPrint = (): PrintSettings => ({ ...DEFAULT_PRINT, ...loadJson<Partial<PrintSettings>>(PRINT_GLOBAL_STORE, {}) });
export const saveGlobalPrint = (row: PrintSettings) => saveJson(PRINT_GLOBAL_STORE, row);
export function resolvePrintSettings(moduleName?: string, templateName?: string, jobOverride?: Partial<PrintSettings>): PrintSettings {
  const global = loadGlobalPrint();
  const modules = loadJson(PRINT_MODULE_STORE, SEED_MODULE_PRINT);
  const docs = loadJson(PRINT_DOCUMENT_STORE, SEED_DOC_PRINT);
  const mod = modules.find((item) => item.enabled && item.module === moduleName);
  const doc = docs.find((item) => item.template === templateName);
  return { ...global, ...(mod && mod.paperSize !== 'Template' ? { paperSize: mod.paperSize, orientation: mod.orientation } : {}), ...(doc ? { paperSize: doc.paperSize, orientation: doc.orientation } : {}), ...(jobOverride || {}) };
}

const PAPERS = ['A4', 'A3', 'A5', 'Letter', 'Legal', 'Custom'];
const SCALES = ['50%', '75%', '100%', '125%', '150%', '200%', 'Fit to Page', 'Actual Size'];
const SECTIONS: { id: PrintSection; label: string }[] = [
  { id: 'global', label: 'Global defaults' },
  { id: 'module', label: 'Module defaults' },
  { id: 'document', label: 'Document templates' },
  { id: 'access', label: 'Access & permissions' },
  { id: 'history', label: 'History & audit' }
];
const sectionFromPath = (): PrintSection => {
  const path = typeof window === 'undefined' ? '' : window.location.pathname;
  if (path.includes('module-print-configuration')) return 'module';
  if (path.includes('document-print-configuration')) return 'document';
  if (path.includes('print-access-permissions')) return 'access';
  if (path.includes('print-history-audit')) return 'history';
  return 'global';
};

export function GlobalPrintSettings() {
  const [section, setSection] = useState<PrintSection>(() => sectionFromPath());
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState<PrintSettings>(() => loadGlobalPrint());
  const [jobOpen, setJobOpen] = useState(false);
  const [job, setJob] = useState<PrintSettings>(() => loadGlobalPrint());
  const [moduleRows, setModuleRows] = useState<ModulePrintDefault[]>(() => loadJson(PRINT_MODULE_STORE, SEED_MODULE_PRINT));
  const [docRows, setDocRows] = useState<DocumentPrintConfig[]>(() => loadJson(PRINT_DOCUMENT_STORE, SEED_DOC_PRINT));
  const [permRows, setPermRows] = useState<PrintPermissionRow[]>(() => loadJson(PRINT_PERMISSION_STORE, SEED_PRINT_PERMS));
  const [role, setRole] = useState<'superAdmin' | 'schoolAdmin' | 'staff'>('schoolAdmin');
  const [historyRows] = useState<PrintHistoryRow[]>(() => loadJson(PRINT_HISTORY_STORE, SEED_PRINT_HISTORY));
  const [histSearch, setHistSearch] = useState('');
  const [histModule, setHistModule] = useState('');

  useEffect(() => { setSection(sectionFromPath()); }, []);

  const patch = (partial: Partial<PrintSettings>) => setSettings((current) => ({ ...current, ...partial }));
  const previewLabel = useMemo(() => settings.watermark === 'Custom' ? settings.customWatermark : settings.watermark === 'None' ? '' : settings.watermark, [settings]);
  const histFiltered = historyRows.filter((row) => {
    if (histModule && row.module !== histModule) return false;
    if (histSearch && !(`${row.document} ${row.user} ${row.branch}`.toLowerCase().includes(histSearch.toLowerCase()))) return false;
    return true;
  });
  const histModules = Array.from(new Set(historyRows.map((row) => row.module)));

  const exportHistory = () => {
    const header = 'Date,User,Document,Module,Output,Copies,School,Branch';
    const body = histFiltered.map((row) => [row.at, row.user, row.document, row.module, row.output, row.copies, row.school, row.branch].join(',')).join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'print-history.csv'; a.click(); URL.revokeObjectURL(url);
    setNotice('Print history exported.');
  };

  return (
    <div className="space-y-6 p-6">
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div>
        <p className="text-xs text-gray-400">My Details &gt; Manage Settings &gt; Print &amp; Document Settings</p>
        <h1 className="text-2xl font-bold text-gray-900">Print Settings</h1>
        <p className="text-sm text-gray-500">School-wide defaults, module and template overrides, access, and history. A print job can change options once; saved defaults stay unchanged.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((item) => (
          <button key={item.id} type="button" onClick={() => { setSection(item.id); setNotice(''); }} className={`rounded-lg border px-3 py-2 text-sm ${section === item.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700'}`}>{item.label}</button>
        ))}
      </div>

      {section === 'global' && (
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => { setJob({ ...settings }); setJobOpen(true); }}>Print Preview dialog</Button>
            <Button variant="outline" onClick={() => { setSettings({ ...DEFAULT_PRINT }); setNotice('Form reset to recommended defaults. Click Save to persist.'); }}>Reset</Button>
            <Button onClick={() => { saveGlobalPrint(settings); setNotice('School-wide defaults saved. Temporary print jobs do not change these values.'); }}><Save className="mr-2 h-4 w-4" />Save defaults</Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card title="Page setup">
                <div className="grid gap-4 md:grid-cols-2">
                  <Select label="Paper size" options={PAPERS.map((item) => ({ value: item, label: item }))} value={settings.paperSize} onChange={(v) => patch({ paperSize: typeof v === 'string' ? v : v.target.value })} />
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Orientation</p>
                    <div className="flex gap-2">
                      {(['Portrait', 'Landscape'] as const).map((item) => (
                        <button key={item} type="button" className={`flex-1 rounded-lg border px-3 py-2 text-sm ${settings.orientation === item ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300'}`} onClick={() => patch({ orientation: item })}>{item}</button>
                      ))}
                    </div>
                  </div>
                  <Select label="Margins" options={['Narrow', 'Normal', 'Wide', 'Custom'].map((item) => ({ value: item, label: item }))} value={settings.marginPreset} onChange={(v) => patch({ marginPreset: (typeof v === 'string' ? v : v.target.value) as PrintSettings['marginPreset'] })} />
                  <Select label="Color mode" options={[{ value: 'Color', label: 'Color' }, { value: 'Black & White', label: 'Black & White' }]} value={settings.colorMode} onChange={(v) => patch({ colorMode: (typeof v === 'string' ? v : v.target.value) as PrintSettings['colorMode'] })} />
                  <Select label="Print scale" options={SCALES.map((item) => ({ value: item, label: item }))} value={settings.scale} onChange={(v) => patch({ scale: typeof v === 'string' ? v : v.target.value })} />
                  <Select label="Print sides" options={[{ value: 'Single-sided', label: 'Single-sided' }, { value: 'Double-sided', label: 'Double-sided (if supported)' }]} value={settings.sides} onChange={(v) => patch({ sides: (typeof v === 'string' ? v : v.target.value) as PrintSettings['sides'] })} />
                  <Input label="Default copies" type="number" min={1} value={settings.copies} onChange={(e) => patch({ copies: Math.max(1, Number(e.target.value) || 1) })} />
                  <Select label="Output" options={[{ value: 'Print', label: 'Print' }, { value: 'Save as PDF', label: 'Save as PDF' }]} value={settings.output} onChange={(v) => patch({ output: (typeof v === 'string' ? v : v.target.value) as PrintSettings['output'] })} />
                </div>
                {settings.marginPreset === 'Custom' && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <Input label="Top (mm)" type="number" value={settings.marginTop} onChange={(e) => patch({ marginTop: Number(e.target.value) || 0 })} />
                    <Input label="Right (mm)" type="number" value={settings.marginRight} onChange={(e) => patch({ marginRight: Number(e.target.value) || 0 })} />
                    <Input label="Bottom (mm)" type="number" value={settings.marginBottom} onChange={(e) => patch({ marginBottom: Number(e.target.value) || 0 })} />
                    <Input label="Left (mm)" type="number" value={settings.marginLeft} onChange={(e) => patch({ marginLeft: Number(e.target.value) || 0 })} />
                  </div>
                )}
                <p className="mt-3 text-xs text-gray-500">Browser printing cannot force every OS printer option. For marksheets, certificates and receipts, Save as PDF is the reliable output.</p>
              </Card>
              <Card title="Document content">
                <div className="space-y-3">
                  <Toggle label="Include school header and logo" checked={settings.header} onChange={(checked) => patch({ header: checked, schoolNameInHeader: checked, logoInHeader: checked })} />
                  <Toggle label="Include footer and page numbering" checked={settings.footer} onChange={(checked) => patch({ footer: checked, pageNumbers: checked })} />
                  <Toggle label="Show date & time" checked={settings.dateTime} onChange={(checked) => patch({ dateTime: checked })} />
                  <Toggle label="Include background graphics" checked={settings.backgroundGraphics} onChange={(checked) => patch({ backgroundGraphics: checked })} />
                  <Select label="Default watermark" options={['None', 'Draft', 'Confidential', 'Custom'].map((item) => ({ value: item, label: item === 'None' ? 'No Watermark' : item }))} value={settings.watermark} onChange={(v) => patch({ watermark: typeof v === 'string' ? v : v.target.value })} />
                  {settings.watermark === 'Custom' && <Input label="Custom watermark text" value={settings.customWatermark} onChange={(e) => patch({ customWatermark: e.target.value })} />}
                  <Select label="Page numbering position" options={['Bottom left', 'Bottom center', 'Bottom right', 'Top center'].map((item) => ({ value: item, label: item }))} value={settings.pageNumberPos} onChange={(v) => patch({ pageNumberPos: typeof v === 'string' ? v : v.target.value })} />
                  <Select label="Print area" options={[{ value: 'Entire Document', label: 'Entire Document' }, { value: 'Selected Sections', label: 'Selected Sections' }]} value={settings.printArea} onChange={(v) => patch({ printArea: (typeof v === 'string' ? v : v.target.value) as PrintSettings['printArea'] })} />
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <Card title="Default layout preview">
                <div className={`mx-auto overflow-hidden rounded border bg-white shadow-sm ${settings.orientation === 'Landscape' ? 'aspect-[1.4/1]' : 'aspect-[1/1.4]'} max-w-[240px]`}>
                  <div className="relative flex h-full flex-col p-3 text-[10px] text-gray-600">
                    {settings.header && <div className="border-b pb-1 text-center font-semibold tracking-wide">{settings.schoolNameInHeader ? 'SCHOOL NAME' : 'Header'}</div>}
                    <div className="relative flex flex-1 items-center justify-center">
                      {previewLabel && <span className="absolute rotate-[-28deg] text-2xl font-bold uppercase tracking-widest text-gray-200">{previewLabel}</span>}
                      <span className="text-gray-300">Document body</span>
                    </div>
                    {settings.footer && <div className="border-t pt-1 text-center">Page 1 of 1</div>}
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-gray-500">{settings.paperSize} · {settings.orientation} · {settings.scale} · {settings.copies} copy</p>
              </Card>
              <Card title="Hierarchy">
                <ol className="space-y-2 text-sm text-gray-700">
                  <li><span className="font-semibold">1. Global</span> — this section</li>
                  <li><span className="font-semibold">2. Module</span> — e.g. ledgers landscape</li>
                  <li><span className="font-semibold">3. Document template</span> — locked official sizes</li>
                  <li><span className="font-semibold">4. This print job</span> — temporary only</li>
                </ol>
                <p className="mt-2 text-xs text-gray-500">More specific levels override only when configured. Schools and branches are isolated.</p>
              </Card>
            </div>
          </div>
          {jobOpen && (
            <Card title="Print Document — Student Marksheet · Print Preview">
              <p className="mb-3 text-xs text-emerald-700">Defaults loaded. Changes apply to this print job only.</p>
              <div className="grid gap-3 md:grid-cols-4">
                <Select label="Paper size" options={PAPERS.map((item) => ({ value: item, label: item }))} value={job.paperSize} onChange={(v) => setJob({ ...job, paperSize: typeof v === 'string' ? v : v.target.value })} />
                <Select label="Orientation" options={[{ value: 'Portrait', label: 'Portrait' }, { value: 'Landscape', label: 'Landscape' }]} value={job.orientation} onChange={(v) => setJob({ ...job, orientation: (typeof v === 'string' ? v : v.target.value) as PrintSettings['orientation'] })} />
                <Input label="Copies" type="number" value={job.copies} onChange={(e) => setJob({ ...job, copies: Number(e.target.value) || 1 })} />
                <Select label="Output" options={[{ value: 'Print', label: 'Print' }, { value: 'Save as PDF', label: 'Save as PDF' }]} value={job.output} onChange={(v) => setJob({ ...job, output: (typeof v === 'string' ? v : v.target.value) as PrintSettings['output'] })} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setJob({ ...settings })}>Restore Defaults</Button>
                <Button onClick={() => { setNotice(`${job.output} queued for this job only. School defaults were not changed.`); setJobOpen(false); }}>{job.output === 'Save as PDF' ? 'Save PDF' : 'Print'}</Button>
                <Button variant="ghost" onClick={() => setJobOpen(false)}>Close</Button>
              </div>
            </Card>
          )}
        </>
      )}

      {section === 'module' && (
        <>
          <div className="flex justify-end"><Button onClick={() => { saveJson(PRINT_MODULE_STORE, moduleRows); setNotice('Module defaults saved. They override global settings only when enabled.'); }}><Save className="mr-2 h-4 w-4" />Save</Button></div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Module</th><th className="px-3 py-3">Override global?</th><th className="px-3 py-3">Paper</th><th className="px-3 py-3">Orientation</th><th className="px-3 py-3 text-left">Notes</th></tr></thead>
                <tbody>
                  {moduleRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3 font-medium">{row.module}</td>
                      <td className="px-3 py-3 text-center">
                        <Toggle checked={row.enabled} onChange={(checked) => setModuleRows((prev) => prev.map((item) => item.id === row.id ? { ...item, enabled: checked } : item))} />
                        <Badge variant={row.enabled ? 'success' : 'secondary'} className="ml-2">{row.enabled ? 'On' : 'Inherit'}</Badge>
                      </td>
                      <td className="px-3 py-2"><Select options={['A4', 'A3', 'A5', 'Letter', 'Legal', 'Template', 'Receipt', 'Custom Label', 'Custom Card'].map((item) => ({ value: item, label: item }))} value={row.paperSize} onChange={(v) => setModuleRows((prev) => prev.map((item) => item.id === row.id ? { ...item, paperSize: typeof v === 'string' ? v : v.target.value } : item))} /></td>
                      <td className="px-3 py-2"><Select options={[{ value: 'Portrait', label: 'Portrait' }, { value: 'Landscape', label: 'Landscape' }]} value={row.orientation} onChange={(v) => setModuleRows((prev) => prev.map((item) => item.id === row.id ? { ...item, orientation: (typeof v === 'string' ? v : v.target.value) as ModulePrintDefault['orientation'] } : item))} /></td>
                      <td className="px-3 py-2"><Input value={row.notes} onChange={(e) => setModuleRows((prev) => prev.map((item) => item.id === row.id ? { ...item, notes: e.target.value } : item))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === 'document' && (
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setDocRows((prev) => [...prev, { id: `d-${Date.now()}`, module: 'Administration', template: 'New template', paperSize: 'A4', orientation: 'Portrait', locked: false, notes: '' }])}><Plus className="mr-1 h-4 w-4" />Add template</Button>
            <Button onClick={() => { saveJson(PRINT_DOCUMENT_STORE, docRows); setNotice('Template print settings saved. Locked templates cannot be resized in a one-off print job.'); }}><Save className="mr-2 h-4 w-4" />Save</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Module</th><th className="px-3 py-3 text-left">Document template</th><th className="px-3 py-3">Paper</th><th className="px-3 py-3">Orientation</th><th className="px-3 py-3">Lock layout</th><th className="px-3 py-3 text-left">Notes</th></tr></thead>
                <tbody>
                  {docRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-2"><Input value={row.module} onChange={(e) => setDocRows((prev) => prev.map((item) => item.id === row.id ? { ...item, module: e.target.value } : item))} /></td>
                      <td className="px-3 py-2"><Input value={row.template} onChange={(e) => setDocRows((prev) => prev.map((item) => item.id === row.id ? { ...item, template: e.target.value } : item))} /></td>
                      <td className="px-3 py-2"><Select options={['A4', 'A5', 'A3', 'Letter', 'Legal', 'CR80', 'Custom'].map((item) => ({ value: item, label: item }))} value={row.paperSize} onChange={(v) => setDocRows((prev) => prev.map((item) => item.id === row.id ? { ...item, paperSize: typeof v === 'string' ? v : v.target.value } : item))} /></td>
                      <td className="px-3 py-2"><Select options={[{ value: 'Portrait', label: 'Portrait' }, { value: 'Landscape', label: 'Landscape' }]} value={row.orientation} onChange={(v) => setDocRows((prev) => prev.map((item) => item.id === row.id ? { ...item, orientation: (typeof v === 'string' ? v : v.target.value) as DocumentPrintConfig['orientation'] } : item))} /></td>
                      <td className="px-3 py-2 text-center">
                        <Toggle checked={row.locked} onChange={(checked) => setDocRows((prev) => prev.map((item) => item.id === row.id ? { ...item, locked: checked } : item))} />
                        {row.locked && <Badge variant="warning">Locked</Badge>}
                      </td>
                      <td className="px-3 py-2"><Input value={row.notes} onChange={(e) => setDocRows((prev) => prev.map((item) => item.id === row.id ? { ...item, notes: e.target.value } : item))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === 'access' && (
        <>
          <div className="flex justify-end"><Button onClick={() => { saveJson(PRINT_PERMISSION_STORE, permRows); setNotice('Print access saved. Staff changes apply only to the current job and never to locked template properties.'); }}><Save className="mr-2 h-4 w-4" />Save</Button></div>
          <Card>
            <div className="mb-3 flex flex-wrap gap-2 text-sm">
              <span className="text-gray-500">Preview as</span>
              {([['superAdmin', 'Super Admin'], ['schoolAdmin', 'School Admin'], ['staff', 'Staff']] as const).map(([id, label]) => (
                <button key={id} type="button" onClick={() => setRole(id)} className={`rounded-lg border px-3 py-1.5 ${role === id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300'}`}>{label}</button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Action</th><th className="px-3 py-3">Super Admin</th><th className="px-3 py-3">School Admin</th><th className="px-3 py-3">Staff</th><th className="px-3 py-3">You</th></tr></thead>
                <tbody>
                  {permRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-3">{row.action}{row.id === 'p4' && <span className="block text-xs text-gray-400">* Subject to document permissions and locked properties</span>}</td>
                      {(['superAdmin', 'schoolAdmin', 'staff'] as const).map((field) => (
                        <td key={field} className="px-3 py-3 text-center">
                          <button type="button" onClick={() => setPermRows((prev) => prev.map((item) => item.id === row.id ? { ...item, [field]: !item[field] } : item))} className={`rounded-full px-2 py-0.5 text-xs font-medium ${row[field] ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{row[field] ? 'Yes' : 'No'}</button>
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center"><Badge variant={row[role] ? 'success' : 'danger'}>{row[role] ? 'Allowed' : 'Denied'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {section === 'history' && (
        <Card>
          <div className="mb-4 flex flex-wrap items-end gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-8 h-4 w-4 text-gray-400" />
              <Input label="Search" value={histSearch} onChange={(e) => setHistSearch(e.target.value)} placeholder="Document, user, branch" />
            </div>
            <Select label="Module" options={[{ value: '', label: 'All modules' }, ...histModules.map((item) => ({ value: item, label: item }))]} value={histModule} onChange={(v) => setHistModule(typeof v === 'string' ? v : v.target.value)} />
            <Button onClick={exportHistory}><Download className="mr-2 h-4 w-4" />Export</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-3 text-left">Date &amp; time</th><th className="px-3 py-3">User</th><th className="px-3 py-3 text-left">Document</th><th className="px-3 py-3">Module</th><th className="px-3 py-3">Output</th><th className="px-3 py-3">Copies</th><th className="px-3 py-3">Branch</th></tr></thead>
              <tbody>
                {histFiltered.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-3 whitespace-nowrap">{row.at}</td>
                    <td className="px-3 py-3 text-center">{row.user}</td>
                    <td className="px-3 py-3">{row.document}</td>
                    <td className="px-3 py-3 text-center">{row.module}</td>
                    <td className="px-3 py-3 text-center"><Badge variant={row.output === 'PDF' ? 'info' : 'secondary'}>{row.output}</Badge></td>
                    <td className="px-3 py-3 text-center">{row.copies}</td>
                    <td className="px-3 py-3 text-center">{row.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default GlobalPrintSettings;
