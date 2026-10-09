import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit, Trash2, Search, RefreshCw, X, Link } from 'lucide-react';
const MOCK_MAPPINGS = [
{
  id: 'EAM001',
  expenseHead: 'Staff Salary',
  expenseCode: 'SALARY',
  glAccount: '5001',
  glAccountName: 'Salary Expense',
  costCenter: 'HR-001',
  taxCode: 'EXEMPT',
  tdsApplicable: true,
  tdsRate: 10,
  status: 'Active'
},
{
  id: 'EAM002',
  expenseHead: 'Utilities',
  expenseCode: 'UTIL',
  glAccount: '5010',
  glAccountName: 'Utility Expenses',
  costCenter: 'ADMIN-001',
  taxCode: 'GST18',
  tdsApplicable: false,
  tdsRate: 0,
  status: 'Active'
},
{
  id: 'EAM003',
  expenseHead: 'Building Maintenance',
  expenseCode: 'MAINT',
  glAccount: '5020',
  glAccountName: 'Maintenance Expense',
  costCenter: 'INFRA-001',
  taxCode: 'GST18',
  tdsApplicable: true,
  tdsRate: 2,
  status: 'Active'
},
{
  id: 'EAM004',
  expenseHead: 'Stationery & Supplies',
  expenseCode: 'STATY',
  glAccount: '5030',
  glAccountName: 'Office Supplies',
  costCenter: 'ADMIN-001',
  taxCode: 'GST12',
  tdsApplicable: false,
  tdsRate: 0,
  status: 'Active'
},
{
  id: 'EAM005',
  expenseHead: 'Marketing',
  expenseCode: 'MKTG',
  glAccount: '5050',
  glAccountName: 'Marketing Expense',
  costCenter: 'ADMIN-002',
  taxCode: 'GST18',
  tdsApplicable: false,
  tdsRate: 0,
  status: 'Inactive'
}];

const GL_ACCOUNTS = [
'5001 - Salary Expense',
'5010 - Utility Expenses',
'5020 - Maintenance Expense',
'5030 - Office Supplies',
'5040 - Travel Expense',
'5050 - Marketing Expense'];

const TAX_CODES = ['EXEMPT', 'GST5', 'GST12', 'GST18', 'GST28'];
export function ExpenseAccountMapping() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMapping, setEditMapping] = useState<any>(null);
  const [form, setForm] = useState({
    expenseHead: '',
    expenseCode: '',
    glAccount: '',
    costCenter: '',
    taxCode: 'EXEMPT',
    tdsApplicable: false,
    tdsRate: ''
  });
  const openAdd = () => {
    setEditMapping(null);
    setForm({
      expenseHead: '',
      expenseCode: '',
      glAccount: '',
      costCenter: '',
      taxCode: 'EXEMPT',
      tdsApplicable: false,
      tdsRate: ''
    });
    setShowModal(true);
  };
  const openEdit = (m: any) => {
    setEditMapping(m);
    setForm({
      expenseHead: m.expenseHead,
      expenseCode: m.expenseCode,
      glAccount: m.glAccount,
      costCenter: m.costCenter,
      taxCode: m.taxCode,
      tdsApplicable: m.tdsApplicable,
      tdsRate: String(m.tdsRate)
    });
    setShowModal(true);
  };
  const filtered = MOCK_MAPPINGS.filter(
    (m) =>
    !search ||
    m.expenseHead.toLowerCase().includes(search.toLowerCase()) ||
    m.glAccount.includes(search)
  );
  const columns = [
  {
    key: 'expenseHead',
    header: 'Expense Head',
    render: (r: any) =>
    <div>
          <p className="font-medium text-gray-900">{r.expenseHead}</p>
          <p className="text-xs font-mono text-gray-500">{r.expenseCode}</p>
        </div>

  },
  {
    key: 'glAccount',
    header: 'GL Account',
    render: (r: any) =>
    <div>
          <p className="font-mono text-sm font-semibold text-blue-700">
            {r.glAccount}
          </p>
          <p className="text-xs text-gray-500">{r.glAccountName}</p>
        </div>

  },
  {
    key: 'costCenter',
    header: 'Cost Center',
    render: (r: any) =>
    <span className="font-mono text-sm text-gray-700">{r.costCenter}</span>

  },
  {
    key: 'taxCode',
    header: 'Tax Code',
    render: (r: any) => <Badge variant="info">{r.taxCode}</Badge>
  },
  {
    key: 'tds',
    header: 'TDS',
    render: (r: any) =>
    <div>
          <Badge variant={r.tdsApplicable ? 'warning' : 'secondary'}>
            {r.tdsApplicable ? 'Applicable' : 'N/A'}
          </Badge>
          {r.tdsApplicable &&
      <p className="text-xs text-gray-500 mt-1">Rate: {r.tdsRate}%</p>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (r: any) =>
    <Badge variant={r.status === 'Active' ? 'success' : 'secondary'}>
          {r.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (r: any) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => openEdit(r)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Expense Account Mapping
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Map expense heads to GL accounts, cost centers, and tax codes
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Link className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Account Mapping Guide
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Each expense head must be mapped to a GL account for proper
            financial reporting. Cost centers enable department-wise expense
            tracking. TDS rates are applied automatically during payment
            processing.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by expense head or GL account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Button variant="outline" onClick={() => setSearch('')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} mappings
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[500px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editMapping ? 'Edit Mapping' : 'Add Account Mapping'}
              </h2>
              <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowModal(false)}>

                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
              label="Expense Head *"
              value={form.expenseHead}
              onChange={(e) =>
              setForm({
                ...form,
                expenseHead: e.target.value
              })
              } />

              <Input
              label="Expense Code *"
              value={form.expenseCode}
              onChange={(e) =>
              setForm({
                ...form,
                expenseCode: e.target.value.toUpperCase()
              })
              } />

              <Select
              label="GL Account *"
              options={GL_ACCOUNTS.map((g) => ({
                value: g.split(' - ')[0],
                label: g
              }))}
              value={form.glAccount}
              onChange={(v) =>
              setForm({
                ...form,
                glAccount: v
              })
              } />

              <Input
              label="Cost Center"
              value={form.costCenter}
              onChange={(e) =>
              setForm({
                ...form,
                costCenter: e.target.value
              })
              }
              placeholder="e.g., ADMIN-001" />

              <Select
              label="Tax Code"
              options={TAX_CODES.map((t) => ({
                value: t,
                label: t
              }))}
              value={form.taxCode}
              onChange={(v) =>
              setForm({
                ...form,
                taxCode: v
              })
              } />

              <div className="flex items-center gap-3">
                <input
                type="checkbox"
                id="tds"
                checked={form.tdsApplicable}
                onChange={(e) =>
                setForm({
                  ...form,
                  tdsApplicable: e.target.checked
                })
                } />

                <label htmlFor="tds" className="text-sm">
                  TDS Applicable
                </label>
                {form.tdsApplicable &&
              <Input
                type="number"
                placeholder="TDS Rate %"
                value={form.tdsRate}
                onChange={(e) =>
                setForm({
                  ...form,
                  tdsRate: e.target.value
                })
                }
                className="w-32" />

              }
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editMapping ? 'Update' : 'Add Mapping'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}