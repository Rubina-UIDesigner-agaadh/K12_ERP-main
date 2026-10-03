// FILE: DisciplineCounsellingPolicy.jsx
// PURPOSE: Comprehensive discipline policy configuration with categories, offense types, action mapping, escalation rules, counselling config, and record controls

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, RotateCcw, Plus, Trash2, AlertTriangle, Shield, UserCheck, Lock } from 'lucide-react';

export function DisciplineCounsellingPolicy() {
  const [categories, setCategories] = useState([
  { id: 1, name: 'Attendance Issues', code: 'ATT', severity: 'Minor', desc: 'Late arrival, unauthorized absence', classes: 'All', active: true },
  { id: 2, name: 'Academic Misconduct', code: 'ACA', severity: 'Major', desc: 'Cheating, plagiarism', classes: 'All', active: true },
  { id: 3, name: 'Behavioral Issues', code: 'BEH', severity: 'Moderate', desc: 'Disruption, bullying', classes: 'All', active: true }]
  );

  const [offenses, setOffenses] = useState([
  { id: 1, name: 'Cheating in Exam', code: 'CHT-01', category: 'Academic Misconduct', severity: 'Major', trackRepeat: true, maxOccurrence: 2 },
  { id: 2, name: 'Bullying', code: 'BLY-01', category: 'Behavioral Issues', severity: 'Major', trackRepeat: true, maxOccurrence: 1 }]
  );

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOffenseModal, setShowOffenseModal] = useState(false);

  const severityLevels = [
  { value: 'minor', label: 'Minor', color: 'green' },
  { value: 'moderate', label: 'Moderate', color: 'yellow' },
  { value: 'major', label: 'Major', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' }];


  const actions = [
  'Warning', 'Written Warning', 'Parent Notification', 'Detention',
  'Suspension', 'Fine', 'Mandatory Counselling', 'Custom Action'];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discipline & Counselling Policy</h1>
          <p className="text-sm text-gray-500">Configure categories, offenses, actions, escalation rules, and counselling protocols</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
          <Button variant="primary"><Save className="w-4 h-4 mr-2" />Save Policy</Button>
        </div>
      </div>

      {/* SECTION 1: Discipline Categories Setup */}
      <Card title="1. Discipline Categories Setup">
        <div className="space-y-3">
          {categories.map((cat) =>
          <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg bg-white hover:shadow-sm transition">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{cat.code}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                cat.severity === 'Minor' ? 'bg-green-100 text-green-700' :
                cat.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                cat.severity === 'Major' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'}`
                }>{cat.severity}</span>
                </div>
                <p className="text-sm text-gray-600">{cat.desc}</p>
                <p className="text-xs text-gray-500 mt-1">Classes: {cat.classes}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={cat.active} className="h-4 w-4 text-blue-600 rounded" />
                  <span className="text-xs text-gray-600">Active</span>
                </label>
                <Button variant="ghost" size="xs"><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
          )}
          <Button variant="outline" onClick={() => setShowCategoryModal(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />Add Category
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 2: Offense Type Definition */}
        <Card title="2. Offense Type Definition" className="lg:col-span-1">
          <div className="space-y-3 mb-4">
            {offenses.map((off) =>
            <div key={off.id} className="p-3 border rounded-lg bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{off.name}</span>
                    <span className="text-xs ml-2 px-2 py-1 bg-gray-100 rounded">{off.code}</span>
                  </div>
                  <Button variant="ghost" size="xs"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Category: <span className="font-medium">{off.category}</span></div>
                  <div>Severity: <span className={`font-medium ${
                  off.severity === 'Major' ? 'text-orange-600' : 'text-yellow-600'}`
                  }>{off.severity}</span></div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={off.trackRepeat} className="h-3 w-3 rounded" />
                      Track Repetition
                    </label>
                    {off.trackRepeat && <span>Max: {off.maxOccurrence} times</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => setShowOffenseModal(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />Add Offense Type
          </Button>
        </Card>

        {/* SECTION 3: Action Mapping */}
        <Card title="3. Action Mapping" className="lg:col-span-1">
          <div className="space-y-3">
            {actions.map((action) =>
            <div key={action} className="p-3 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{action}</span>
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="h-3 w-3 rounded" />
                    Auto Apply
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="h-3 w-3 rounded" defaultChecked />
                    Require Approval
                  </label>
                </div>
                <Select
                options={[
                { value: 'principal', label: 'Principal' },
                { value: 'vice-principal', label: 'Vice Principal' },
                { value: 'coordinator', label: 'Coordinator' }]
                }
                placeholder="Approval Role"
                className="mt-2 text-xs" />

              </div>
            )}
          </div>
        </Card>

        {/* SECTION 4: Escalation Rules */}
        <Card title="4. Escalation Rules" className="lg:col-span-1">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-900">Auto-Escalation Rule</span>
              </div>
              <div className="space-y-3">
                <Input label="Escalate After (Incidents)" type="number" defaultValue="3" />
                <Input label="Time Window (Days)" type="number" defaultValue="30" />
                <Select
                  label="Escalate From"
                  options={severityLevels}
                  defaultValue="moderate" />

                <Select
                  label="Escalate To"
                  options={severityLevels}
                  defaultValue="major" />

                <label className="flex items-center justify-between p-2 border rounded cursor-pointer">
                  <span className="text-sm">Require Approval for Escalation</span>
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 5: Counselling Configuration */}
        <Card title="5. Counselling Configuration" className="lg:col-span-1">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Counselling Protocol</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Required For Severity</label>
                  {severityLevels.map((level) =>
                  <label key={level.value} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked={level.value !== 'minor'} />
                      <span className="text-sm text-gray-700">{level.label}</span>
                    </label>
                  )}
                </div>
                <Select
                  label="Default Counsellor"
                  options={[
                  { value: 'auto', label: 'Auto-assign (Rotation)' },
                  { value: 'dr-sharma', label: 'Dr. Sharma' },
                  { value: 'ms-patel', label: 'Ms. Patel' }]
                  }
                  defaultValue="auto" />

                <Input label="Session Frequency (Days)" type="number" defaultValue="7" />
                <Input label="Maximum Sessions" type="number" defaultValue="5" />
                <label className="flex items-center justify-between p-2 border rounded cursor-pointer">
                  <span className="text-sm">Completion Mandatory Before Case Closure</span>
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 6: Record Lock & Visibility */}
        <Card title="6. Record Lock & Visibility" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Entry Permissions</span>
              </div>
              <div className="space-y-2">
                {[
                { key: 'teacherEntry', label: 'Allow Teacher Entry' },
                { key: 'editAfterSubmit', label: 'Allow Edit After Submission' },
                { key: 'principalApproval', label: 'Require Principal Approval to Close Case' }].
                map((perm) =>
                <label key={perm.key} className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-white">
                    <span className="text-sm text-gray-700">{perm.label}</span>
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                  </label>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Visibility Controls</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-white">
                  <span className="text-sm text-gray-700">Parent Visible in Portal</span>
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                </label>
                <Select
                  label="Parent Can View"
                  options={[
                  { value: 'all', label: 'All Records' },
                  { value: 'moderate-up', label: 'Moderate & Above Only' },
                  { value: 'major-up', label: 'Major & Critical Only' },
                  { value: 'none', label: 'No Records (Admin Only)' }]
                  }
                  defaultValue="moderate-up" />

              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Modal */}
      {showCategoryModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCategoryModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <h2 className="text-lg font-semibold mb-4">Add Discipline Category</h2>
            <div className="space-y-4">
              <Input label="Category Name *" placeholder="e.g., Academic Misconduct" />
              <Input label="Category Code *" placeholder="e.g., ACA" />
              <Select label="Severity Level *" options={severityLevels} />
              <Input label="Description" placeholder="Brief description" />
              <Select
              label="Applicable Classes"
              options={[
              { value: 'all', label: 'All Classes' },
              { value: 'primary', label: 'Primary (1-5)' },
              { value: 'secondary', label: 'Secondary (6-10)' },
              { value: 'senior', label: 'Senior (11-12)' }]
              }
              defaultValue="all" />

            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
              <Button variant="primary"><Save className="w-4 h-4 mr-2" />Add Category</Button>
            </div>
          </div>
        </div>
      }

      {/* Offense Modal */}
      {showOffenseModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowOffenseModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <h2 className="text-lg font-semibold mb-4">Add Offense Type</h2>
            <div className="space-y-4">
              <Select
              label="Category *"
              options={categories.map((c) => ({ value: c.name, label: c.name }))} />

              <Input label="Offense Name *" placeholder="e.g., Cheating in Exam" />
              <Input label="Offense Code *" placeholder="e.g., CHT-01" />
              <Select label="Default Severity *" options={severityLevels} />
              <label className="flex items-center justify-between p-3 border rounded cursor-pointer">
                <span className="text-sm">Enable Repetition Tracking</span>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </label>
              <Input label="Max Occurrences Before Escalation" type="number" defaultValue="2" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowOffenseModal(false)}>Cancel</Button>
              <Button variant="primary"><Save className="w-4 h-4 mr-2" />Add Offense</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}