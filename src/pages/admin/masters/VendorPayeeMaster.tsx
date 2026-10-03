import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  X,
  Building,
  Phone,
  Mail } from
'lucide-react';
const MOCK_VENDORS = [
{
  id: 'V001',
  code: 'VND001',
  name: 'ABC Stationery Suppliers',
  type: 'Vendor',
  category: 'Stationery',
  contact: 'Ramesh Patel',
  phone: '+91 98765 43210',
  email: 'abc@stationery.com',
  gstin: '24ABCDE1234F1Z5',
  paymentTerms: 'Net 30',
  status: 'Active',
  outstandingBalance: 12500
},
{
  id: 'V002',
  code: 'VND002',
  name: 'XYZ Maintenance Services',
  type: 'Vendor',
  category: 'Maintenance',
  contact: 'Suresh Kumar',
  phone: '+91 98765 43211',
  email: 'xyz@maintenance.com',
  gstin: '24XYZAB5678G2Z6',
  paymentTerms: 'Net 15',
  status: 'Active',
  outstandingBalance: 0
},
{
  id: 'V003',
  code: 'VND003',
  name: 'City Electric Co.',
  type: 'Utility',
  category: 'Utilities',
  contact: 'Billing Dept',
  phone: '+91 79 12345678',
  email: 'billing@cityelectric.com',
  gstin: '',
  paymentTerms: 'Due on Receipt',
  status: 'Active',
  outstandingBalance: 45000
},
{
  id: 'V004',
  code: 'PAY001',
  name: 'John Doe (Freelancer)',
  type: 'Payee',
  category: 'Services',
  contact: 'John Doe',
  phone: '+91 98765 00001',
  email: 'john@freelance.com',
  gstin: '',
  paymentTerms: 'Immediate',
  status: 'Active',
  outstandingBalance: 8000
},
{
  id: 'V005',
  code: 'VND004',
  name: 'Tech Solutions Pvt Ltd',
  type: 'Vendor',
  category: 'Technology',
  contact: 'Sales Team',
  phone: '+91 22 12345678',
  email: 'sales@techsol.com',
  gstin: '27TECHAB1234H3Z7',
  paymentTerms: 'Net 45',
  status: 'Inactive',
  outstandingBalance: 0
}];

const VENDOR_TYPES = ['Vendor', 'Payee', 'Utility', 'Contractor'];
const CATEGORIES = [
'Stationery',
'Maintenance',
'Utilities',
'Technology',
'Services',
'Food & Catering',
'Transport',
'Events',
'Miscellaneous'];

export function VendorPayeeMaster() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState<any>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: 'Vendor',
    category: '',
    contact: '',
    phone: '',
    email: '',
    gstin: '',
    paymentTerms: 'Net 30',
    bankAccount: '',
    ifsc: ''
  });
  const openAdd = () => {
    setEditVendor(null);
    setForm({
      code: '',
      name: '',
      type: 'Vendor',
      category: '',
      contact: '',
      phone: '',
      email: '',
      gstin: '',
      paymentTerms: 'Net 30',
      bankAccount: '',
      ifsc: ''
    });
    setShowModal(true);
  };
  const openEdit = (v: any) => {
    setEditVendor(v);
    setForm({
      code: v.code,
      name: v.name,
      type: v.type,
      category: v.category,
      contact: v.contact,
      phone: v.phone,
      email: v.email,
      gstin: v.gstin,
      paymentTerms: v.paymentTerms,
      bankAccount: '',
      ifsc: ''
    });
    setShowModal(true);
  };
  const filtered = MOCK_VENDORS.filter((v) => {
    const matchSearch =
    !search ||
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.code.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || v.type === typeFilter;
    return matchSearch && matchType;
  });
  const columns = [
  {
    key: 'code',
    header: 'Code',
    render: (r: any) =>
    <span className="font-mono text-xs text-gray-600">{r.code}</span>

  },
  {
    key: 'name',
    header: 'Vendor / Payee Name',
    render: (r: any) =>
    <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <p className="text-xs text-gray-500">{r.category}</p>
        </div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (r: any) => <Badge variant="info">{r.type}</Badge>
  },
  {
    key: 'contact',
    header: 'Contact',
    render: (r: any) =>
    <div className="text-xs space-y-1">
          <p className="text-gray-700">{r.contact}</p>
          <p className="flex items-center gap-1 text-gray-500">
            <Phone className="w-3 h-3" />
            {r.phone}
          </p>
          <p className="flex items-center gap-1 text-gray-500">
            <Mail className="w-3 h-3" />
            {r.email}
          </p>
        </div>

  },
  {
    key: 'gstin',
    header: 'GSTIN',
    render: (r: any) =>
    <span className="font-mono text-xs text-gray-600">
          {r.gstin || '—'}
        </span>

  },
  {
    key: 'paymentTerms',
    header: 'Payment Terms',
    render: (r: any) =>
    <span className="text-sm text-gray-700">{r.paymentTerms}</span>

  },
  {
    key: 'outstanding',
    header: 'Outstanding (₹)',
    render: (r: any) =>
    <span
      className={`font-semibold text-sm ${r.outstandingBalance > 0 ? 'text-red-600' : 'text-gray-500'}`}>

          {r.outstandingBalance > 0 ?
      `₹${r.outstandingBalance.toLocaleString()}` :
      '—'}
        </span>

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
          <Button variant="ghost" size="xs" disabled={r.outstandingBalance > 0}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vendor / Payee Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage vendors, contractors, and payees for expense processing
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor / Payee
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Vendors',
          value: MOCK_VENDORS.length,
          color: 'blue'
        },
        {
          label: 'Active',
          value: MOCK_VENDORS.filter((v) => v.status === 'Active').length,
          color: 'green'
        },
        {
          label: 'With Outstanding',
          value: MOCK_VENDORS.filter((v) => v.outstandingBalance > 0).length,
          color: 'red'
        },
        {
          label: 'Total Outstanding',
          value: `₹${MOCK_VENDORS.reduce((s, v) => s + v.outstandingBalance, 0).toLocaleString()}`,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Select
            placeholder="Filter by Type"
            options={VENDOR_TYPES.map((t) => ({
              value: t,
              label: t
            }))}
            value={typeFilter}
            onChange={setTypeFilter} />

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setTypeFilter('');
            }}>

            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} vendors/payees
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editVendor ? 'Edit Vendor/Payee' : 'Add Vendor/Payee'}
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
                label="Vendor Code *"
                value={form.code}
                onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value
                })
                } />

                <Select
                label="Type *"
                options={VENDOR_TYPES.map((t) => ({
                  value: t,
                  label: t
                }))}
                value={form.type}
                onChange={(v) =>
                setForm({
                  ...form,
                  type: v
                })
                } />

              </div>
              <Input
              label="Name *"
              value={form.name}
              onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
              } />

              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Category *"
                options={CATEGORIES.map((c) => ({
                  value: c,
                  label: c
                }))}
                value={form.category}
                onChange={(v) =>
                setForm({
                  ...form,
                  category: v
                })
                } />

                <Input
                label="Contact Person"
                value={form.contact}
                onChange={(e) =>
                setForm({
                  ...form,
                  contact: e.target.value
                })
                } />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
                } />

                <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
                } />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="GSTIN"
                value={form.gstin}
                onChange={(e) =>
                setForm({
                  ...form,
                  gstin: e.target.value
                })
                }
                placeholder="15-digit GSTIN" />

                <Select
                label="Payment Terms"
                options={[
                'Immediate',
                'Net 15',
                'Net 30',
                'Net 45',
                'Due on Receipt'].
                map((t) => ({
                  value: t,
                  label: t
                }))}
                value={form.paymentTerms}
                onChange={(v) =>
                setForm({
                  ...form,
                  paymentTerms: v
                })
                } />

              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Bank Details (for direct payment)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Bank Account Number"
                  value={form.bankAccount}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    bankAccount: e.target.value
                  })
                  } />

                  <Input
                  label="IFSC Code"
                  value={form.ifsc}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    ifsc: e.target.value
                  })
                  } />

                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editVendor ? 'Update' : 'Add Vendor/Payee'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}