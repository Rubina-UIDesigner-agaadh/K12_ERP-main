// pages/admin/settings/FeeBehaviourLateFeeRules.tsx
// Fee payment behavior and late fee penalty configuration
// Controls payment rules, due dates, late fee calculation, slabs, penalties, and exemptions

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import {
  Save, RotateCcw, DollarSign, Calendar, AlertTriangle,
  Settings, Lock, Shield, Plus, Trash2, TrendingUp } from
'lucide-react';

export function FeeBehaviourLateFeeRules() {
  const [lateFeeType, setLateFeeType] = useState('slab');
  const [slabs, setSlabs] = useState([
  { fromDay: 1, toDay: 7, amount: 50, type: 'fixed' },
  { fromDay: 8, toDay: 15, amount: 100, type: 'fixed' },
  { fromDay: 16, toDay: 30, amount: 5, type: 'percentage' }]
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Behaviour & Late Fee Rules</h1>
          <p className="text-sm text-gray-500">Configure payment rules, late fee calculation, penalties and exemptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />Restore Defaults
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />Save Rules
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Fee Behaviour Settings */}
        
        {/* Payment Behaviour Controls */}
        <Card title="Payment Behaviour" icon={<DollarSign className="w-5 h-5 text-green-500" />}>
          <div className="space-y-4">
            <Toggle label="Allow Partial Payment" defaultChecked />
            <Toggle label="Allow Advance Payment Before Due Date" defaultChecked />
            <Select
              label="Installment Payment Order"
              options={[
              { value: 'sequential', label: 'Sequential (Must pay in order)' },
              { value: 'any', label: 'Any Installment (Flexible)' }]
              }
              defaultValue="sequential" />

            <Toggle label="Allow Overpayment" />
            <div className="pl-6">
              <Select
                label="Handle Overpayment As"
                options={[
                { value: 'credit', label: 'Credit Balance (For Future)' },
                { value: 'auto', label: 'Auto Adjust Next Due' },
                { value: 'manual', label: 'Manual Adjustment Only' }]
                }
                defaultValue="credit"
                size="sm" />

            </div>
          </div>
        </Card>

        {/* Due Date Handling */}
        <Card title="Due Date Handling" icon={<Calendar className="w-5 h-5 text-blue-500" />}>
          <div className="space-y-4">
            <Toggle label="Single Due Date per Installment" defaultChecked />
            <Toggle label="Different Due Dates per Class (Enable Override)" />
            <Toggle label="Auto Carry Forward Unpaid Amount" defaultChecked />
            <Toggle label="Merge Previous Dues With Next Installment" />
            <Input
              label="Grace Period After Due Date (Days)"
              type="number"
              defaultValue="7"
              helperText="Late fee applies after this period" />

            <Input
              label="Send Reminder Before Due Date (Days)"
              type="number"
              defaultValue="3" />

          </div>
        </Card>

        {/* Component-Level Behaviour */}
        <Card title="Fee Component Settings" icon={<Settings className="w-5 h-5 text-purple-500" />}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-2">Configure behavior for individual fee components</p>
            <div className="space-y-2">
              {['Tuition Fee', 'Transport Fee', 'Library Fee'].map((component) =>
              <div key={component} className="p-3 bg-gray-50 rounded-lg border space-y-2">
                  <p className="font-medium text-sm text-gray-900">{component}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" />
                      Mandatory First
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Partial Payment
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" />
                      Exclude Concession
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" />
                      Exclude Late Fee
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* SECTION 2: Late Fee Configuration */}
        
        {/* Late Fee Activation */}
        <Card title="Late Fee Activation" icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}>
          <div className="space-y-4">
            <Toggle label="Enable Late Fee Calculation" defaultChecked />
            <Select
              label="Apply Late Fee On"
              options={[
              { value: 'installment', label: 'Per Installment' },
              { value: 'invoice', label: 'Per Invoice' },
              { value: 'total', label: 'Per Student Total Due' }]
              }
              defaultValue="installment" />

            <Select
              label="Late Fee Calculation Type"
              options={[
              { value: 'flat', label: 'Flat Amount' },
              { value: 'per_day', label: 'Per Day Amount' },
              { value: 'percentage', label: 'Percentage of Due' },
              { value: 'slab', label: 'Slab-Based (Advanced)' }]
              }
              value={lateFeeType}
              onChange={(e) => setLateFeeType(e.target.value)} />

          </div>
        </Card>

        {/* Slab Builder (if slab-based) */}
        {lateFeeType === 'slab' &&
        <Card title="Late Fee Slab Configuration" icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 px-2">
                  <span>From Day</span>
                  <span>To Day</span>
                  <span>Amount/%</span>
                  <span>Type</span>
                  <span></span>
                </div>
                {slabs.map((slab, idx) =>
              <div key={idx} className="grid grid-cols-5 gap-2">
                    <Input type="number" defaultValue={slab.fromDay} size="sm" />
                    <Input type="number" defaultValue={slab.toDay} size="sm" />
                    <Input type="number" defaultValue={slab.amount} size="sm" />
                    <Select
                  options={[
                  { value: 'fixed', label: '₹' },
                  { value: 'percentage', label: '%' }]
                  }
                  value={slab.type}
                  size="sm" />

                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
              )}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" />Add Slab
              </Button>
              <div className="pt-3 border-t space-y-2">
                <Toggle label="Continuous Slabs (No gaps)" defaultChecked size="sm" />
                <Toggle label="Reset Slab After Partial Payment" size="sm" />
              </div>
            </div>
          </Card>
        }

        {/* Simple Late Fee (if not slab) */}
        {lateFeeType !== 'slab' &&
        <Card title="Late Fee Amount" icon={<DollarSign className="w-5 h-5 text-red-500" />}>
            <div className="space-y-4">
              <Input
              label="Late Fee Amount/Rate"
              type="number"
              defaultValue="50"
              helperText={lateFeeType === 'percentage' ? 'Percentage of due amount' : 'Fixed amount'} />

              <Input
              label="Maximum Late Fee Cap (₹)"
              type="number"
              defaultValue="2000" />

              <Toggle label="Apply Late Fee After Grace Period Only" defaultChecked />
            </div>
          </Card>
        }

        {/* Grace Period & Exemptions */}
        <Card title="Grace Period & Exemptions" icon={<Shield className="w-5 h-5 text-cyan-500" />}>
          <div className="space-y-4">
            <Input
              label="Grace Period (Days)"
              type="number"
              defaultValue="7" />

            <Select
              label="Grace Period Applicable To"
              options={[
              { value: 'all', label: 'All Students' },
              { value: 'classes', label: 'Selected Classes' },
              { value: 'categories', label: 'Selected Categories' }]
              }
              defaultValue="all" />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Exempt Student Categories</label>
              {['Scholarship', 'Staff Ward', 'Sibling Discount'].map((category) =>
              <label key={category} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              )}
            </div>
            <Toggle label="Exempt if Scholarship Applied" />
          </div>
        </Card>

        {/* Compounding & Caps */}
        <Card title="Compounding & Limits" icon={<TrendingUp className="w-5 h-5 text-pink-500" />}>
          <div className="space-y-4">
            <Toggle label="Apply Late Fee on Late Fee (Compounding)" />
            <Input
              label="Maximum Late Fee Cap (₹)"
              type="number"
              defaultValue="5000"
              helperText="Absolute maximum late fee per student" />

            <Input
              label="Stop Late Fee After (Days)"
              type="number"
              defaultValue="90"
              helperText="0 = No limit" />

          </div>
        </Card>

        {/* Penalty Rules */}
        <Card title="Auto Actions on Non-Payment" icon={<Lock className="w-5 h-5 text-red-500" />}>
          <div className="space-y-3">
            {[
            { label: 'Restrict Exam Hall Ticket', icon: '📝' },
            { label: 'Restrict Report Card Access', icon: '📊' },
            { label: 'Block Transfer Certificate (TC)', icon: '📄' },
            { label: 'Restrict ID Card Printing', icon: '🪪' },
            { label: 'Block Library Access', icon: '📚' }].
            map(({ label, icon }) =>
            <div key={label} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-100">
                <span className="text-sm font-medium text-red-900">
                  {icon} {label}
                </span>
                <input type="checkbox" className="h-4 w-4 text-red-600 rounded border-red-300" />
              </div>
            )}
            <div className="pt-2">
              <Toggle label="Send Auto Reminder Before Applying Late Fee" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Waiver Controls */}
        <Card title="Late Fee Waiver Controls" icon={<Shield className="w-5 h-5 text-teal-500" />}>
          <div className="space-y-4">
            <Toggle label="Allow Manual Late Fee Waiver" defaultChecked />
            <Toggle label="Require Approval for Waiver" defaultChecked />
            <Select
              label="Approval Required From"
              options={[
              { value: 'accountant', label: 'Accountant' },
              { value: 'hod', label: 'HOD Accounts' },
              { value: 'principal', label: 'Principal' }]
              }
              defaultValue="hod" />

            <Input
              label="Maximum Waiver Limit Per Student (₹)"
              type="number"
              defaultValue="1000" />

            <Toggle label="Waiver Audit Log Mandatory" defaultChecked />
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 All waiver requests will be logged with timestamp, approver, and reason.
              </p>
            </div>
          </div>
        </Card>

        {/* Exception Rules Summary */}
        <Card title="Fee Component Exemptions" icon={<Settings className="w-5 h-5 text-gray-500" />}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Select components to exclude from late fee</p>
            {['Admission Fee', 'Exam Fee', 'Security Deposit', 'Caution Money'].map((component) =>
            <label key={component} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">{component}</span>
              </label>
            )}
          </div>
        </Card>
      </div>
    </div>);

}