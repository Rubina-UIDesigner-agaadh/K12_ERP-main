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
  Mail,
  Globe } from
'lucide-react';
const MOCK_AGENCIES = [
{
  id: 'AG001',
  code: 'GOVT-SC',
  name: 'State Government - SC/ST Welfare',
  type: 'Government',
  contactPerson: 'District Officer',
  phone: '079-12345678',
  email: 'scst@gov.in',
  website: 'www.gov.in',
  fundingType: 'Annual Grant',
  totalFunded: 750000,
  activeSchemes: 2,
  status: 'Active'
},
{
  id: 'AG002',
  code: 'NGO-01',
  name: 'Vidya Foundation',
  type: 'NGO',
  contactPerson: 'Ms. Priya Nair',
  phone: '+91 98765 43210',
  email: 'info@vidya.org',
  website: 'www.vidyafoundation.org',
  fundingType: 'Per Student',
  totalFunded: 300000,
  activeSchemes: 1,
  status: 'Active'
},
{
  id: 'AG003',
  code: 'CORP-01',
  name: 'TechCorp CSR Initiative',
  type: 'Corporate CSR',
  contactPerson: 'CSR Head',
  phone: '+91 22 12345678',
  email: 'csr@techcorp.com',
  website: 'www.techcorp.com',
  fundingType: 'Annual Donation',
  totalFunded: 500000,
  activeSchemes: 1,
  status: 'Active'
},
{
  id: 'AG004',
  code: 'ALUM-01',
  name: 'Alumni Association Fund',
  type: 'Alumni',
  contactPerson: 'Secretary',
  phone: '+91 98765 00001',
  email: 'alumni@school.edu',
  website: '',
  fundingType: 'Corpus Fund',
  totalFunded: 200000,
  activeSchemes: 1,
  status: 'Active'
},
{
  id: 'AG005',
  code: 'INTL-01',
  name: 'International Education Trust',
  type: 'International',
  contactPerson: 'India Representative',
  phone: '+91 11 12345678',
  email: 'india@iet.org',
  website: 'www.iet.org',
  fundingType: 'Annual Grant',
  totalFunded: 0,
  activeSchemes: 0,
  status: 'Inactive'
}];

const AGENCY_TYPES = [
'Government',
'NGO',
'Corporate CSR',
'Alumni',
'International',
'Individual Donor',
'Trust/Foundation'];

export function ScholarshipAgencyDonorMaster() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAgency, setEditAgency] = useState<any>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: '',
    contactPerson: '',
    phone: '',
    email: '',
    website: '',
    fundingType: '',
    bankAccount: '',
    ifsc: ''
  });
  const openAdd = () => {
    setEditAgency(null);
    setForm({
      code: '',
      name: '',
      type: '',
      contactPerson: '',
      phone: '',
      email: '',
      website: '',
      fundingType: '',
      bankAccount: '',
      ifsc: ''
    });
    setShowModal(true);
  };
  const openEdit = (a: any) => {
    setEditAgency(a);
    setForm({
      code: a.code,
      name: a.name,
      type: a.type,
      contactPerson: a.contactPerson,
      phone: a.phone,
      email: a.email,
      website: a.website,
      fundingType: a.fundingType,
      bankAccount: '',
      ifsc: ''
    });
    setShowModal(true);
  };
  const filtered = MOCK_AGENCIES.filter((a) => {
    const matchSearch =
    !search ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || a.type === typeFilter;
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
    header: 'Agency / Donor Name',
    render: (r: any) =>
    <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <Badge variant="info" className="mt-1">
            {r.type}
          </Badge>
        </div>

  },
  {
    key: 'contact',
    header: 'Contact',
    render: (r: any) =>
    <div className="text-xs space-y-1">
          <p className="text-gray-700 font-medium">{r.contactPerson}</p>
          <p className="flex items-center gap-1 text-gray-500">
            <Phone className="w-3 h-3" />
            {r.phone}
          </p>
          <p className="flex items-center gap-1 text-gray-500">
            <Mail className="w-3 h-3" />
            {r.email}
          </p>
          {r.website &&
      <p className="flex items-center gap-1 text-blue-600">
              <Globe className="w-3 h-3" />
              {r.website}
            </p>
      }
        </div>

  },
  {
    key: 'fundingType',
    header: 'Funding Type',
    render: (r: any) =>
    <span className="text-sm text-gray-700">{r.fundingType}</span>

  },
  {
    key: 'totalFunded',
    header: 'Total Funded (₹)',
    render: (r: any) =>
    <span className="font-semibold text-green-700">
          {r.totalFunded > 0 ? `₹${r.totalFunded.toLocaleString()}` : '—'}
        </span>

  },
  {
    key: 'schemes',
    header: 'Active Schemes',
    render: (r: any) =>
    <Badge variant={r.activeSchemes > 0 ? 'success' : 'secondary'}>
          {r.activeSchemes}
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
          <Button variant="ghost" size="xs" disabled={r.activeSchemes > 0}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarship Agency / Donor Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage scholarship funding agencies, donors, and their contact
            details
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Agency / Donor
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Agencies',
          value: MOCK_AGENCIES.length,
          color: 'blue'
        },
        {
          label: 'Active',
          value: MOCK_AGENCIES.filter((a) => a.status === 'Active').length,
          color: 'green'
        },
        {
          label: 'Total Funded',
          value: `₹${(MOCK_AGENCIES.reduce((s, a) => s + a.totalFunded, 0) / 100000).toFixed(1)}L`,
          color: 'purple'
        },
        {
          label: 'Agency Types',
          value: new Set(MOCK_AGENCIES.map((a) => a.type)).size,
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
            options={AGENCY_TYPES.map((t) => ({
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
            Showing {filtered.length} agencies/donors
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
                {editAgency ? 'Edit Agency/Donor' : 'Add Agency/Donor'}
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
                label="Code *"
                value={form.code}
                onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase()
                })
                } />

                <Select
                label="Type *"
                options={AGENCY_TYPES.map((t) => ({
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
              label="Agency / Donor Name *"
              value={form.name}
              onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
              } />

              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Contact Person"
                value={form.contactPerson}
                onChange={(e) =>
                setForm({
                  ...form,
                  contactPerson: e.target.value
                })
                } />

                <Select
                label="Funding Type"
                options={[
                'Annual Grant',
                'Per Student',
                'Annual Donation',
                'Corpus Fund',
                'One-Time'].
                map((f) => ({
                  value: f,
                  label: f
                }))}
                value={form.fundingType}
                onChange={(v) =>
                setForm({
                  ...form,
                  fundingType: v
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
              <Input
              label="Website"
              value={form.website}
              onChange={(e) =>
              setForm({
                ...form,
                website: e.target.value
              })
              }
              placeholder="www.example.com" />

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Bank Details (for fund receipt)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                  label="Bank Account"
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
                {editAgency ? 'Update' : 'Add Agency/Donor'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}