import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  X,
  CreditCard,
  CheckCircle,
  AlertTriangle } from
'lucide-react';
const MOCK_GATEWAYS = [
{
  id: 'PG001',
  name: 'Razorpay',
  provider: 'Razorpay',
  merchantId: 'rzp_live_XXXXX',
  mode: 'Live',
  supportedMethods: ['UPI', 'Card', 'Net Banking', 'Wallet'],
  settlementDays: 2,
  convenienceFee: 1.5,
  status: 'Active',
  lastTested: '2024-03-15'
},
{
  id: 'PG002',
  name: 'PayU Money',
  provider: 'PayU',
  merchantId: 'payu_XXXXX',
  mode: 'Test',
  supportedMethods: ['UPI', 'Card', 'Net Banking'],
  settlementDays: 3,
  convenienceFee: 1.8,
  status: 'Inactive',
  lastTested: '2024-02-10'
},
{
  id: 'PG003',
  name: 'CCAvenue',
  provider: 'CCAvenue',
  merchantId: 'cca_XXXXX',
  mode: 'Test',
  supportedMethods: ['Card', 'Net Banking', 'EMI'],
  settlementDays: 3,
  convenienceFee: 2.0,
  status: 'Inactive',
  lastTested: '2024-01-20'
}];

const PROVIDERS = [
'Razorpay',
'PayU',
'CCAvenue',
'Paytm',
'Instamojo',
'Cashfree',
'BillDesk'];

const PAYMENT_METHODS = [
'UPI',
'Credit Card',
'Debit Card',
'Net Banking',
'Wallet',
'EMI',
'BNPL'];

export function PaymentGatewayMaster() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editGateway, setEditGateway] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    provider: '',
    merchantId: '',
    apiKey: '',
    apiSecret: '',
    mode: 'Test',
    settlementDays: '2',
    convenienceFee: '',
    webhookUrl: ''
  });
  const openAdd = () => {
    setEditGateway(null);
    setForm({
      name: '',
      provider: '',
      merchantId: '',
      apiKey: '',
      apiSecret: '',
      mode: 'Test',
      settlementDays: '2',
      convenienceFee: '',
      webhookUrl: ''
    });
    setShowModal(true);
  };
  const openEdit = (g: any) => {
    setEditGateway(g);
    setForm({
      name: g.name,
      provider: g.provider,
      merchantId: g.merchantId,
      apiKey: '',
      apiSecret: '',
      mode: g.mode,
      settlementDays: String(g.settlementDays),
      convenienceFee: String(g.convenienceFee),
      webhookUrl: ''
    });
    setShowModal(true);
  };
  const filtered = MOCK_GATEWAYS.filter(
    (g) =>
    !search ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.provider.toLowerCase().includes(search.toLowerCase())
  );
  const columns = [
  {
    key: 'name',
    header: 'Gateway Name',
    render: (r: any) =>
    <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{r.name}</p>
            <p className="text-xs text-gray-500">{r.provider}</p>
          </div>
        </div>

  },
  {
    key: 'merchantId',
    header: 'Merchant ID',
    render: (r: any) =>
    <span className="font-mono text-xs text-gray-600">{r.merchantId}</span>

  },
  {
    key: 'mode',
    header: 'Mode',
    render: (r: any) =>
    <Badge variant={r.mode === 'Live' ? 'success' : 'warning'}>
          {r.mode}
        </Badge>

  },
  {
    key: 'methods',
    header: 'Payment Methods',
    render: (r: any) =>
    <div className="flex flex-wrap gap-1">
          {r.supportedMethods.map((m: string) =>
      <span
        key={m}
        className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">

              {m}
            </span>
      )}
        </div>

  },
  {
    key: 'settlement',
    header: 'Settlement',
    render: (r: any) =>
    <span className="text-sm text-gray-700">T+{r.settlementDays} days</span>

  },
  {
    key: 'fee',
    header: 'Conv. Fee',
    render: (r: any) =>
    <span className="text-sm font-medium">{r.convenienceFee}%</span>

  },
  {
    key: 'lastTested',
    header: 'Last Tested',
    render: (r: any) =>
    <span className="text-xs text-gray-500">{r.lastTested}</span>

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
          <Button variant="ghost" size="xs" title="Test Connection">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="xs" disabled={r.status === 'Active'}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Gateway Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure and manage payment gateway credentials and settings
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Gateway
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          Only one gateway can be active at a time. API keys are encrypted and
          stored securely. Never share your live API credentials.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
        {
          label: 'Total Gateways',
          value: MOCK_GATEWAYS.length,
          color: 'blue'
        },
        {
          label: 'Active (Live)',
          value: MOCK_GATEWAYS.filter(
            (g) => g.status === 'Active' && g.mode === 'Live'
          ).length,
          color: 'green'
        },
        {
          label: 'In Test Mode',
          value: MOCK_GATEWAYS.filter((g) => g.mode === 'Test').length,
          color: 'amber'
        }].
        map((s) =>
        <Card key={s.label} className="p-4">
            <p className={`text-2xl font-bold text-${s.color}-600`}>
              {s.value}
            </p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Card>
        )}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name or provider..."
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
            Showing {filtered.length} gateways
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[560px] max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editGateway ? 'Edit Gateway' : 'Add Payment Gateway'}
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
                <Input
                label="Gateway Name *"
                value={form.name}
                onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
                } />

                <Select
                label="Provider *"
                options={PROVIDERS.map((p) => ({
                  value: p,
                  label: p
                }))}
                value={form.provider}
                onChange={(v) =>
                setForm({
                  ...form,
                  provider: v
                })
                } />

              </div>
              <Input
              label="Merchant ID *"
              value={form.merchantId}
              onChange={(e) =>
              setForm({
                ...form,
                merchantId: e.target.value
              })
              } />

              <Input
              label="API Key *"
              type="password"
              value={form.apiKey}
              onChange={(e) =>
              setForm({
                ...form,
                apiKey: e.target.value
              })
              }
              placeholder="Enter API Key" />

              <Input
              label="API Secret *"
              type="password"
              value={form.apiSecret}
              onChange={(e) =>
              setForm({
                ...form,
                apiSecret: e.target.value
              })
              }
              placeholder="Enter API Secret" />

              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Mode *"
                options={[
                {
                  value: 'Test',
                  label: 'Test (Sandbox)'
                },
                {
                  value: 'Live',
                  label: 'Live (Production)'
                }]
                }
                value={form.mode}
                onChange={(v) =>
                setForm({
                  ...form,
                  mode: v
                })
                } />

                <Input
                label="Settlement Days"
                type="number"
                value={form.settlementDays}
                onChange={(e) =>
                setForm({
                  ...form,
                  settlementDays: e.target.value
                })
                } />

              </div>
              <Input
              label="Convenience Fee (%)"
              type="number"
              value={form.convenienceFee}
              onChange={(e) =>
              setForm({
                ...form,
                convenienceFee: e.target.value
              })
              } />

              <Input
              label="Webhook URL"
              value={form.webhookUrl}
              onChange={(e) =>
              setForm({
                ...form,
                webhookUrl: e.target.value
              })
              }
              placeholder="https://school.edu/payment/webhook" />

            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editGateway ? 'Update' : 'Add Gateway'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}