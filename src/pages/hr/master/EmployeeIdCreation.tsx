import React, { useEffect, useState } from 'react';
import { Save, Trash2, Hash } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

interface IdRule {
  id: string;
  name: string;
  academicYear: string;
  branch: string;
  prefixComponents: string[];
  startNumber: number;
  numberWidth: number;
  incrementStep: number;
  resetFrequency: 'Never' | 'Yearly' | 'Department-wise';
  isActive: boolean;
}

const MOCK_RULE: IdRule = {
  id: 'EMPID001',
  name: 'Standard Employee ID Series',
  academicYear: '2024-2025',
  branch: 'Main Campus',
  prefixComponents: ['EMP', '/', 'YEAR', '/'],
  startNumber: 1,
  numberWidth: 4,
  incrementStep: 1,
  resetFrequency: 'Yearly',
  isActive: true
};

export function EmployeeIdCreation() {
  const [rule, setRule] = useState<IdRule>(MOCK_RULE);
  const [previewNumber, setPreviewNumber] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const year = '24-25';
    const branch = 'MAIN';
    const dept = 'TCH';
    const num = String(rule.startNumber).padStart(rule.numberWidth, '0');
    let prefix = '';
    rule.prefixComponents.forEach((comp) => {
      if (comp === 'YEAR') prefix += year;
      else if (comp === 'BRANCH') prefix += branch;
      else if (comp === 'DEPT') prefix += dept;
      else prefix += comp;
    });
    setPreviewNumber(`${prefix}${num}`);
  }, [rule]);

  const addPrefixComponent = (comp: string) => {
    setRule((prev) => ({ ...prev, prefixComponents: [...prev.prefixComponents, comp] }));
    setCustomPrefix('');
  };

  const removePrefixComponent = (index: number) => {
    setRule((prev) => ({
      ...prev,
      prefixComponents: prev.prefixComponents.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee ID Creation Rules</h1>
          <p className="text-sm text-gray-500">Configure how employee IDs are auto-generated, the same way GR numbers are built for students</p>
        </div>
        <Button onClick={() => setSaved(true)}>
          <Save className="w-4 h-4 mr-2" /> Save Configuration
        </Button>
      </div>

      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Employee ID rule saved. Next employee will receive {previewNumber}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Rule Definition">
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Rule Name" value={rule.name} onChange={(e) => setRule({ ...rule, name: e.target.value })} />
                <Select
                  label="Reset Frequency"
                  options={[
                    { value: 'Never', label: 'Never (Continuous)' },
                    { value: 'Yearly', label: 'Every Academic Year' },
                    { value: 'Department-wise', label: 'Every Department' }
                  ]}
                  value={rule.resetFrequency}
                  onChange={(val) => setRule({ ...rule, resetFrequency: val as IdRule['resetFrequency'] })}
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number Pattern Construction</label>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border rounded-lg mb-3 min-h-[50px]">
                  {rule.prefixComponents.map((comp, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-sm">
                      {comp}
                      <button type="button" onClick={() => removePrefixComponent(idx)} className="hover:text-red-500 ml-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Badge variant="info" className="px-2 py-1 text-sm border-dashed border-blue-300 bg-blue-50">
                    {String(rule.startNumber).padStart(rule.numberWidth, '0')}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => addPrefixComponent('EMP')}>+ EMP</Button>
                  <Button size="sm" variant="outline" onClick={() => addPrefixComponent('YEAR')}>+ Year</Button>
                  <Button size="sm" variant="outline" onClick={() => addPrefixComponent('BRANCH')}>+ Branch</Button>
                  <Button size="sm" variant="outline" onClick={() => addPrefixComponent('DEPT')}>+ Department</Button>
                  <Button size="sm" variant="outline" onClick={() => addPrefixComponent('/')}>+ /</Button>
                  <Button size="sm" variant="outline" onClick={() => addPrefixComponent('-')}>+ -</Button>
                  <div className="flex items-center gap-1 border-l pl-2 ml-2">
                    <input type="text" placeholder="Custom Text" className="text-sm border rounded px-2 py-1 w-24" value={customPrefix} onChange={(e) => setCustomPrefix(e.target.value)} />
                    <Button size="sm" variant="outline" onClick={() => customPrefix && addPrefixComponent(customPrefix)}>Add</Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Start Number" type="number" value={rule.startNumber} onChange={(e) => setRule({ ...rule, startNumber: parseInt(e.target.value, 10) || 0 })} />
                  <Input label="Number Width (Digits)" type="number" value={rule.numberWidth} onChange={(e) => setRule({ ...rule, numberWidth: parseInt(e.target.value, 10) || 1 })} />
                  <Input label="Increment Step" type="number" value={rule.incrementStep} onChange={(e) => setRule({ ...rule, incrementStep: parseInt(e.target.value, 10) || 1 })} />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Validation & Scope">
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                <div>
                  <span className="block text-sm font-medium text-gray-900">Ensure Global Uniqueness</span>
                  <span className="block text-xs text-gray-500">Prevent duplicate employee IDs across the institute</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <div>
                  <span className="block text-sm font-medium text-gray-900">Allow Manual Override</span>
                  <span className="block text-xs text-gray-500">Allow HR to edit the generated ID during joining</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <div>
                  <span className="block text-sm font-medium text-gray-900">Reuse Relieved Numbers</span>
                  <span className="block text-xs text-gray-500">If an employee is cancelled before joining, reuse the ID</span>
                </div>
              </label>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
            <div className="p-6 text-center">
              <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-2">Live Preview</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 mb-4">
                <span className="text-3xl font-mono font-bold text-gray-800 tracking-wide">{previewNumber}</span>
              </div>
              <p className="text-xs text-indigo-700">This is how the next employee ID will look based on your current configuration.</p>
            </div>
          </Card>
          <Card title="Example Sequence">
            <div className="p-4 space-y-2">
              {[0, 1, 2].map((i) => {
                const num = String(rule.startNumber + i * rule.incrementStep).padStart(rule.numberWidth, '0');
                let prefix = '';
                rule.prefixComponents.forEach((comp) => {
                  if (comp === 'YEAR') prefix += '24-25';
                  else if (comp === 'BRANCH') prefix += 'MAIN';
                  else if (comp === 'DEPT') prefix += 'TCH';
                  else prefix += comp;
                });
                return (
                  <div key={i} className="flex items-center justify-between text-sm p-2 border-b last:border-0">
                    <span className="text-gray-500">Employee {i + 1}</span>
                    <span className="font-mono font-medium">{prefix}{num}</span>
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
            <Hash className="w-3.5 h-3.5" /> Pattern is stored per branch and academic year.
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeIdCreation;
