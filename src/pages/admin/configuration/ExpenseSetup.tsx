// FILE: ExpenseSetup.jsx
// PURPOSE: Expense management configuration with categories, approval requirements, payment modes, and spending limits

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Toggle } from '../../../components/ui/Toggle';
import { Table } from '../../../components/ui/Table';
import { Save, RotateCcw, Plus, Trash2, DollarSign, Settings, CreditCard, AlertTriangle } from 'lucide-react';

export function ExpenseSetup() {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([
  { id: 1, name: 'Salaries & Wages', code: 'SAL', parent: '-', status: 'Active' },
  { id: 2, name: 'Infrastructure', code: 'INF', parent: '-', status: 'Active' },
  { id: 3, name: 'Academic Materials', code: 'ACA', parent: '-', status: 'Active' },
  { id: 4, name: 'Utilities', code: 'UTL', parent: '-', status: 'Active' }]
  );
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [
  { id: 'categories', label: '1. Categories', icon: <Settings className="w-4 h-4" /> },
  { id: 'approval', label: '2. Approval', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'payment', label: '3. Payment Modes', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'limits', label: '4. Expense Limits', icon: <AlertTriangle className="w-4 h-4" /> }];


  const categoryColumns = [
  { key: 'name', header: 'Category Name', render: (r) => <span className="font-medium">{r.name}</span> },
  { key: 'code', header: 'Code', render: (r) => <span className="text-xs px-2 py-1 bg-gray-100 rounded">{r.code}</span> },
  { key: 'parent', header: 'Parent Category', render: (r) => <span className="text-sm text-gray-600">{r.parent}</span> },
  { key: 'status', header: 'Status', render: (r) =>
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {r.status}
      </span>
  },
  { key: 'actions', header: 'Actions', render: () =>
    <div className="flex gap-1">
        <Button variant="ghost" size="xs" onClick={() => setShowModal(true)}><Settings className="w-3 h-3" /></Button>
        <Button variant="ghost" size="xs"><Trash2 className="w-3 h-3 text-red-500" /></Button>
      </div>
  }];


  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Configure categories, approvals, payment modes, and spending limits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
          <Button variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />{saved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
          activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`
          }>

            {tab.icon}
            {tab.label}
          </button>
        )}
      </div>

      {/* SECTION 1: Expense Categories */}
      {activeTab === 'categories' &&
      <div className="space-y-6">
          <Card title="Expense Categories" className="p-0">
            <div className="p-4 border-b flex justify-between items-center">
              <p className="text-sm text-gray-600">Manage expense categories and subcategories</p>
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />Add Category
              </Button>
            </div>
            <Table columns={categoryColumns} data={categories} />
          </Card>

          <Card title="Category Settings">
            <div className="space-y-3">
              <Toggle label="Allow Custom Expense Heads" defaultChecked />
              <Toggle label="Require Expense Head for All Entries" defaultChecked />
              <Toggle label="Enable Sub-category Classification" />
              <Select
              label="Default Expense Head"
              options={categories.map((c) => ({ value: c.code, label: c.name }))}
              defaultValue="SAL" />

            </div>
          </Card>
        </div>
      }

      {/* SECTION 2: Expense Approval Requirement */}
      {activeTab === 'approval' &&
      <div className="space-y-6">
          <Card title="Approval Requirements">
            <div className="space-y-4">
              <Toggle label="Require Approval for All Expenses" defaultChecked />
              <Select
              label="Approval Levels"
              options={[
              { value: '1', label: 'Single Level' },
              { value: '2', label: 'Two Level' },
              { value: '3', label: 'Three Level' }]
              }
              defaultValue="2" />

              <Toggle label="Budget Check Required Before Approval" defaultChecked />
            </div>
          </Card>

          <Card title="Approval Workflow">
            <div className="space-y-4">
              <Select
              label="Level 1 Approver Role"
              options={[
              { value: 'accountant', label: 'Accountant' },
              { value: 'finance-head', label: 'Finance Head' },
              { value: 'hod', label: 'HOD' }]
              }
              defaultValue="accountant" />

              <Select
              label="Level 2 Approver Role"
              options={[
              { value: 'principal', label: 'Principal' },
              { value: 'director', label: 'Director' },
              { value: 'admin', label: 'Admin' }]
              }
              defaultValue="principal" />

              <Input label="Auto-Approve Below Amount (₹)" type="number" defaultValue="500" />
              <Input label="Approval Deadline (Days)" type="number" defaultValue="3" />
              <Toggle label="Send Email Notification on Submission" defaultChecked />
              <Toggle label="Send SMS on Approval/Rejection" />
              <Toggle label="Allow Approver to Edit Amount" />
            </div>
          </Card>
        </div>
      }

      {/* SECTION 3: Payment Mode Allowed */}
      {activeTab === 'payment' &&
      <Card title="Payment Modes Configuration">
          <div className="space-y-4">
            {[
          { id: 'cash', label: 'Cash', icon: '💵', limit: 10000, default: true },
          { id: 'bank-transfer', label: 'Bank Transfer', icon: '🏦', limit: null, default: true },
          { id: 'cheque', label: 'Cheque', icon: '📝', limit: null, default: true },
          { id: 'online', label: 'Online Payment (UPI/Card)', icon: '💳', limit: null, default: false }].
          map((mode) =>
          <div key={mode.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mode.icon}</span>
                    <span className="font-medium text-gray-900">{mode.label}</span>
                  </div>
                  <Toggle defaultChecked={mode.default} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mode.limit !== null &&
              <Input label="Max Transaction Limit (₹)" type="number" defaultValue={mode.limit} />
              }
                  <Toggle label="Require Receipt Upload" defaultChecked />
                  <Toggle label="Auto-record in Cash Book" />
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* SECTION 4: Expense Limits */}
      {activeTab === 'limits' &&
      <div className="space-y-6">
          <Card title="Global Expense Limits">
            <div className="space-y-4">
              <Input label="Per Transaction Limit (₹)" type="number" defaultValue="100000" />
              <Input label="Monthly Limit Per Category (₹)" type="number" defaultValue="500000" />
              <Toggle label="Alert When Limit Exceeds" defaultChecked />
              <Input label="Alert Threshold (%)" type="number" defaultValue="80" />
            </div>
          </Card>

          <Card title="Category-Based Limits">
            <div className="space-y-3">
              {categories.map((cat) =>
            <div key={cat.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded">{cat.code}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="Per Transaction (₹)" type="number" defaultValue="50000" size="sm" />
                    <Input label="Monthly (₹)" type="number" defaultValue="200000" size="sm" />
                    <Input label="Annual (₹)" type="number" defaultValue="2000000" size="sm" />
                  </div>
                </div>
            )}
            </div>
          </Card>

          <Card title="Alert Configuration">
            <div className="space-y-4">
              <Toggle label="Email Alert to Finance Head" defaultChecked />
              <Toggle label="SMS Alert on Limit Breach" />
              <Toggle label="Block Expense Entry When Limit Exceeded" />
              <Select
              label="Alert Frequency"
              options={[
              { value: 'instant', label: 'Instant' },
              { value: 'daily', label: 'Daily Summary' },
              { value: 'weekly', label: 'Weekly Summary' }]
              }
              defaultValue="instant" />

            </div>
          </Card>
        </div>
      }

      {/* Add Category Modal */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <h2 className="text-lg font-semibold mb-4">Add Expense Category</h2>
            <div className="space-y-4">
              <Input label="Category Name *" placeholder="e.g., Academic Materials" />
              <Input label="Category Code *" placeholder="e.g., ACA" />
              <Input label="Description" placeholder="Brief description" />
              <Select
              label="Parent Category (Optional)"
              options={[
              { value: 'none', label: 'None (Top Level)' },
              ...categories.map((c) => ({ value: c.code, label: c.name }))]
              }
              defaultValue="none" />

              <label className="flex items-center justify-between p-3 border rounded cursor-pointer">
                <span className="text-sm font-medium">Active Status</span>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary"><Save className="w-4 h-4 mr-2" />Add Category</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}