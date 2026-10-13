import React, { useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Package, Plus, Trash2 } from 'lucide-react';

export interface AssetTypeRule {
  id: string;
  name: string;
  assetType: string;
  fineIfLost: number;
  employeeTypes: string[];
}

export const EMPLOYEE_ASSET_TYPES = ['Permanent', 'Contract', 'Probation', 'Teaching Staff', 'Admin Staff', 'Support Staff'];

export const ASSET_TYPE_OPTIONS = ['IT Equipment', 'Identity', 'Access', 'School Property', 'Library', 'Uniform', 'Keys'];

export const ASSET_TYPE_RULES: AssetTypeRule[] = [
  { id: '1', name: 'Laptop', assetType: 'IT Equipment', fineIfLost: 35000, employeeTypes: ['Permanent', 'Contract', 'Teaching Staff'] },
  { id: '2', name: 'Employee ID Card', assetType: 'Identity', fineIfLost: 250, employeeTypes: ['Permanent', 'Contract', 'Probation', 'Teaching Staff', 'Admin Staff', 'Support Staff'] },
  { id: '3', name: 'Access Badge', assetType: 'Access', fineIfLost: 500, employeeTypes: ['Permanent', 'Contract', 'Admin Staff'] },
  { id: '4', name: 'Classroom Key Set', assetType: 'Keys', fineIfLost: 800, employeeTypes: ['Permanent', 'Teaching Staff'] },
  { id: '5', name: 'School Uniform', assetType: 'Uniform', fineIfLost: 2500, employeeTypes: ['Permanent', 'Contract', 'Probation'] },
  { id: '6', name: 'Library Reference Book', assetType: 'Library', fineIfLost: 1200, employeeTypes: ['Teaching Staff'] }
];

export function AssetManagementMaster() {
  const [rows, setRows] = useState<AssetTypeRule[]>(ASSET_TYPE_RULES);
  const [notice, setNotice] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: '', assetType: 'IT Equipment', fineIfLost: 0, employeeTypes: [] as string[] });

  const toggleType = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      employeeTypes: prev.employeeTypes.includes(value) ? prev.employeeTypes.filter((t) => t !== value) : [...prev.employeeTypes, value]
    }));
  };

  const addRow = () => {
    if (!draft.name.trim()) {
      setNotice('Enter an asset type name.');
      return;
    }
    if (draft.employeeTypes.length === 0) {
      setNotice('Select at least one employee type this asset is given to.');
      return;
    }
    setRows((list) => [...list, { id: String(Date.now()), name: draft.name.trim(), assetType: draft.assetType, fineIfLost: Number(draft.fineIfLost) || 0, employeeTypes: draft.employeeTypes }]);
    setDraft({ name: '', assetType: 'IT Equipment', fineIfLost: 0, employeeTypes: [] });
    setNotice('Asset type added to the assignment register.');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Asset Assignment Register</h3>
        <p className="text-sm text-gray-500 mt-1">Define asset types, the fine if lost, and which employee types receive them.</p>
      </div>
      {notice && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 flex justify-between"><span>{notice}</span><button type="button" onClick={() => setNotice(null)}>×</button></div>}

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Input label="Asset Type Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Laptop" />
          <Select label="Asset Type" options={ASSET_TYPE_OPTIONS.map((c) => ({ value: c, label: c }))} value={draft.assetType} onChange={(e) => setDraft({ ...draft, assetType: e.target.value })} />
          <Input label="Fine amount if lost (₹)" type="number" min={0} value={String(draft.fineIfLost)} onChange={(e) => setDraft({ ...draft, fineIfLost: Number(e.target.value) || 0 })} />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-2">Given to employee type</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {EMPLOYEE_ASSET_TYPES.map((type) => (
            <label key={type} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs ${draft.employeeTypes.includes(type) ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
              <input type="checkbox" checked={draft.employeeTypes.includes(type)} onChange={() => toggleType(type)} />
              {type}
            </label>
          ))}
        </div>
        <Button variant="primary" onClick={addRow}><Plus className="w-4 h-4 mr-1" /> Add Asset Type</Button>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                {['#', 'Asset Type Name', 'Asset Type', 'Fine if lost', 'Employee types given to', ''].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{r.name}</td>
                  <td className="px-3 py-2">{r.assetType}</td>
                  <td className="px-3 py-2">₹{r.fineIfLost.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {r.employeeTypes.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Button variant="ghost" size="sm" onClick={() => { setRows((list) => list.filter((x) => x.id !== r.id)); setNotice(`${r.name} removed.`); }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AssetManagementMaster;
