import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Plus, Edit, Trash2, Search, RefreshCw, X, Link } from 'lucide-react';
const MOCK_MAPPINGS = [
{
  id: 'OPM001',
  feeHead: 'Tuition Fee',
  feeCode: 'TF',
  gateway: 'Razorpay',
  glAccount: '1001',
  glAccountName: 'Online Fee Collection A/C',
  settlementAccount: 'HDFC - 1234567890',
  autoPost: true,
  status: 'Active'
},
{
  id: 'OPM002',
  feeHead: 'Transport Fee',
  feeCode: 'TR',
  gateway: 'Razorpay',
  glAccount: '1002',
  glAccountName: 'Transport Fee Collection',
  settlementAccount: 'HDFC - 1234567890',
  autoPost: true,
  status: 'Active'
},
{
  id: 'OPM003',
  feeHead: 'Hostel Fee',
  feeCode: 'HF',
  gateway: 'Razorpay',
  glAccount: '1003',
  glAccountName: 'Hostel Fee Collection',
  settlementAccount: 'HDFC - 1234567890',
  autoPost: false,
  status: 'Active'
},
{
  id: 'OPM004',
  feeHead: 'Exam Fee',
  feeCode: 'EF',
  gateway: 'Razorpay',
  glAccount: '1004',
  glAccountName: 'Exam Fee Collection',
  settlementAccount: 'HDFC - 1234567890',
  autoPost: true,
  status: 'Active'
},
{
  id: 'OPM005',
  feeHead: 'Activity Fee',
  feeCode: 'AF',
  gateway: 'Razorpay',
  glAccount: '1005',
  glAccountName: 'Activity Fee Collection',
  settlementAccount: 'HDFC - 1234567890',
  autoPost: false,
  status: 'Inactive'
}];

const FEE_HEADS = [
'Tuition Fee',
'Transport Fee',
'Hostel Fee',
'Exam Fee',
'Activity Fee',
'Library Fee',
'Miscellaneous Fee'];

const GATEWAYS = ['Razorpay', 'PayU', 'CCAvenue'];
const GL_ACCOUNTS = [
'1001 - Online Fee Collection A/C',
'1002 - Transport Fee Collection',
'1003 - Hostel Fee Collection',
'1004 - Exam Fee Collection',
'1005 - Activity Fee Collection'];

export function OnlinePaymentAccountMapping() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMapping, setEditMapping] = useState<any>(null);
  const [form, setForm] = useState({
    feeHead: '',
    feeCode: '',
    gateway: 'Razorpay',
    glAccount: '',
    settlementAccount: '',
    autoPost: true
  });
  const openAdd = () => {
    setEditMapping(true);
    setForm({
      feeHead: '',
      feeCode: '',
      gateway: 'Razorpay',
      glAccount: '',
      settlementAccount: '',
      autoPost: true
    });
    setShowModal(true);
  };
  const openEdit = (m: any) => {
    setEditMapping(m);
    setForm({
      feeHead: m.feeHead,
      feeCode: m.feeCode,
      gateway: m.gateway,
      glAccount: m.glAccount,
      settlementAccount: m.settlementAccount,
      autoPost: m.autoPost
    });
    setShowModal(true);
  };
  const filtered = MOCK_MAPPINGS.filter(
    (m) =>
    !search ||
    m.feeHead.toLowerCase().includes(search.toLowerCase()) ||
    m.glAccount.includes(search)
  );
  const columns = [
  {
    key: 'feeHead',
    header: 'Fee Head',
    render: (r: any) =>
    <div>
          <p className="font-medium text-gray-900">{r.feeHead}</p>
          <p className="text-xs font-mono text-gray-500">{r.feeCode}</p>
        </div>

  },
  {
    key: 'gateway',
    header: 'Payment Gateway',
    render: (r: any) => <Badge variant="info">{r.gateway}</Badge>
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
    key: 'settlementAccount',
    header: 'Settlement Account',
    render: (r: any) =>
    <span className="text-sm text-gray-700">{r.settlementAccount}</span>

  },
  {
    key: 'autoPost',
    header: 'Auto-Post',
    render: (r: any) =>
    <Badge variant={r.autoPost ? 'success' : 'secondary'}>
          {r.autoPost ? 'Enabled' : 'Manual'}
        </Badge>

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
            Online Payment Account Mapping
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Map fee heads to payment gateways, GL accounts, and settlement
            accounts
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Link className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Each fee head collected online must be mapped to a GL account for
          automatic reconciliation. Enable "Auto-Post" to automatically post
          transactions to accounts upon settlement.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by fee head or GL account..."
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
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Fee Head *"
                options={FEE_HEADS.map((f) => ({
                  value: f,
                  label: f
                }))}
                value={form.feeHead}
                onChange={(v) =>
                setForm({
                  ...form,
                  feeHead: v
                })
                } />

                <Input
                label="Fee Code *"
                value={form.feeCode}
                onChange={(e) =>
                setForm({
                  ...form,
                  feeCode: e.target.value.toUpperCase()
                })
                }
                placeholder="e.g., TF" />

              </div>
              <Select
              label="Payment Gateway *"
              options={GATEWAYS.map((g) => ({
                value: g,
                label: g
              }))}
              value={form.gateway}
              onChange={(v) =>
              setForm({
                ...form,
                gateway: v
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
              label="Settlement Bank Account"
              value={form.settlementAccount}
              onChange={(e) =>
              setForm({
                ...form,
                settlementAccount: e.target.value
              })
              }
              placeholder="e.g., HDFC - 1234567890" />

              <Toggle
              label="Auto-Post to Accounts on Settlement"
              checked={form.autoPost}
              onChange={(v) =>
              setForm({
                ...form,
                autoPost: v
              })
              } />

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