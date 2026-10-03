import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Trash2,
  Settings2,
  Zap,
  Search,
  ChevronRight,
  Info,
  Save,
  X,
  Code } from
'lucide-react';

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export function ScholarshipCriteriaMaster() {
  const [showModal, setShowModal] = useState(false);
  const [criteriaName, setCriteriaName] = useState('');
  const [rules, setRules] = useState<Rule[]>([
  { id: '1', field: 'academic_pct', operator: 'gt', value: '90' }]
  );

  // Mock Existing Criteria
  const existingCriteria = [
  { id: '1', name: 'Merit Excellence Rules', rulesCount: 3, status: 'Active' },
  { id: '2', name: 'Financial Need Assessment', rulesCount: 2, status: 'Active' },
  { id: '3', name: 'Sports Pro-Elite Entry', rulesCount: 2, status: 'Draft' }];


  // Configuration for Rule Builder
  const fields = [
  { label: 'Academic %', value: 'academic_pct' },
  { label: 'Parent Annual Income', value: 'parent_income' },
  { label: 'Attendance %', value: 'attendance_pct' },
  { label: 'Sports Achievement Level', value: 'sports_rank' },
  { label: 'Discipline Score', value: 'discipline_score' }];


  const operators = [
  { label: 'Greater Than (>)', value: 'gt' },
  { label: 'Less Than (<)', value: 'lt' },
  { label: 'Equals To (=)', value: 'eq' },
  { label: 'Greater Than or Equal (>=)', value: 'gte' },
  { label: 'Less Than or Equal (<=)', value: 'lte' }];


  // Handlers
  const addRule = () => {
    const newRule = { id: Math.random().toString(), field: 'academic_pct', operator: 'gt', value: '' };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, key: keyof Rule, val: string) => {
    setRules(rules.map((r) => r.id === id ? { ...r, [key]: val } : r));
  };

  const columns = [
  {
    key: 'name',
    header: 'Criteria Name',
    render: (row: any) =>
    <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Settings2 className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-bold text-gray-900">{row.name}</span>
        </div>

  },
  {
    key: 'rules',
    header: 'Logic Complexity',
    render: (row: any) =>
    <span className="text-xs font-medium text-gray-500">{row.rulesCount} Active Rules</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>

  },
  {
    key: 'actions',
    header: '',
    render: () =>
    <Button variant="ghost" size="sm">
          <ChevronRight className="w-4 h-4" />
        </Button>

  }];


  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Scholarship Criteria Master <Zap className="w-6 h-6 text-yellow-500" />
          </h1>
          <p className="text-sm text-gray-500">Configure automated evaluation logic for scholarship processing</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create New Criteria
        </Button>
      </div>

      {/* Main List Grid */}
      <Card className="p-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search criteria profiles..."
              leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          </div>
        </div>
        <Table columns={columns} data={existingCriteria} />
      </Card>

      {/* Modal / Rules Builder */}
      {showModal &&
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b bg-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Build Evaluation Rules</h3>
                <p className="text-xs text-gray-500">Define the logic parameters for auto-selection</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Criteria Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Criteria Profile Name</label>
                <Input
                placeholder="e.g. Merit-Cum-Means 2024 Criteria"
                value={criteriaName}
                onChange={(e) => setCriteriaName(e.target.value)}
                className="text-lg font-bold" />

              </div>

              {/* Rules Builder Engine */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Evaluation Logic</label>
                  <Button variant="outline" size="sm" onClick={addRule}>
                    <Plus className="w-3 h-3 mr-1" /> Add Rule Row
                  </Button>
                </div>

                <div className="space-y-3">
                  {rules.map((rule, index) =>
                <div key={rule.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-left-2">
                      <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-12 gap-3">
                        <div className="col-span-5">
                          <Select
                        options={fields}
                        value={rule.field}
                        onChange={(e: any) => updateRule(rule.id, 'field', e.target.value)} />

                        </div>
                        <div className="col-span-4">
                          <Select
                        options={operators}
                        value={rule.operator}
                        onChange={(e: any) => updateRule(rule.id, 'operator', e.target.value)} />

                        </div>
                        <div className="col-span-3">
                          <Input
                        placeholder="Value"
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, 'value', e.target.value)} />

                        </div>
                      </div>

                      <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600"
                    onClick={() => removeRule(rule.id)}
                    disabled={rules.length === 1}>

                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                )}
                </div>
              </div>

              {/* Logic Preview */}
              <div className="p-4 bg-indigo-900 rounded-2xl text-white shadow-inner">
                <div className="flex items-center gap-2 mb-3 opacity-60">
                  <Code className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Logic Preview (SQL Translator)</span>
                </div>
                <div className="font-mono text-sm leading-relaxed">
                  <span className="text-indigo-300 italic">SELECT</span> Students <span className="text-indigo-300 italic">WHERE</span> <br />
                  {rules.map((r, i) =>
                <div key={r.id} className="pl-4">
                      <span className="text-yellow-400">{r.field}</span> {r.operator} <span className="text-green-400">{r.value || '?'}</span>
                      {i !== rules.length - 1 && <span className="text-indigo-300 ml-2">AND</span>}
                    </div>
                )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 italic leading-relaxed">
                  The auto-evaluation engine will run this query against all applicants. Only students satisfying <strong>ALL</strong> rules above will be automatically recommended for sanction.
                </p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Discard</Button>
              <Button variant="primary" className="px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                <Save className="w-4 h-4 mr-2" /> Save Criteria Profile
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}