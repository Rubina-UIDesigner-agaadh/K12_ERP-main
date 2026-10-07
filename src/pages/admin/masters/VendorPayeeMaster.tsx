import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Building2, Edit, Mail, MapPin, Phone, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { getVendorPayeeData, saveVendorPayeeData, VENDOR_PAYEE_UPDATED_EVENT } from '../../finance/expenses/vendorPayeeData';
import type { VendorPayeeRecord } from '../../finance/expenses/vendorPayeeData';

type VendorRecord = VendorPayeeRecord;

const VENDOR_TYPES = ['Vendor', 'Payee', 'Utility', 'Contractor'];
const VENDOR_CATEGORIES = ['Stationery', 'Maintenance', 'Utilities', 'Technology', 'Services', 'Food & Catering', 'Transport', 'Events', 'Miscellaneous'];

type VendorForm = Omit<VendorRecord, 'id'>;

const EMPTY_FORM: VendorForm = {
  code: '', name: '', type: 'Vendor', category: '', contact: '', phone: '', email: '', gstin: '', pan: '',
  address: '', city: '', state: '', pincode: '', bankName: '', bankAccount: '', ifsc: '', status: 'Active'
};

export function VendorPayeeMaster() {
  const [vendors, setVendors] = useState<VendorRecord[]>(() => getVendorPayeeData());

  useEffect(() => {
    const refreshVendors = () => setVendors(getVendorPayeeData());
    window.addEventListener(VENDOR_PAYEE_UPDATED_EVENT, refreshVendors);
    return () => window.removeEventListener(VENDOR_PAYEE_UPDATED_EVENT, refreshVendors);
  }, []);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editVendorId, setEditVendorId] = useState<string | null>(null);
  const [form, setForm] = useState<VendorForm>(EMPTY_FORM);

  const filtered = useMemo(() => vendors.filter((vendor) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [vendor.name, vendor.code, vendor.gstin, vendor.contact, vendor.phone, vendor.email]
      .some((value) => value.toLowerCase().includes(query));
    const matchesType = typeFilter === 'all' || vendor.type === typeFilter;
    return matchesSearch && matchesType;
  }), [vendors, search, typeFilter]);

  const closeModal = () => {
    setShowModal(false);
    setEditVendorId(null);
    setForm(EMPTY_FORM);
  };

  const openAdd = () => {
    setEditVendorId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (vendor: VendorRecord) => {
    setEditVendorId(vendor.id);
    setForm({
      code: vendor.code, name: vendor.name, type: vendor.type, category: vendor.category, contact: vendor.contact,
      phone: vendor.phone, email: vendor.email, gstin: vendor.gstin, pan: vendor.pan, address: vendor.address,
      city: vendor.city, state: vendor.state, pincode: vendor.pincode, bankName: vendor.bankName,
      bankAccount: vendor.bankAccount, ifsc: vendor.ifsc, status: vendor.status
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    if (!code || !name) {
      alert('Vendor / Payee name and code are required.');
      return;
    }
    if (vendors.some((vendor) => vendor.code.toUpperCase() === code && vendor.id !== editVendorId)) {
      alert(`Vendor code ${code} is already in use.`);
      return;
    }
    const record: VendorRecord = {
      ...form,
      id: editVendorId || `V-${Date.now()}`,
      code,
      name,
      contact: form.contact.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim()
    };
    const nextVendors = editVendorId
      ? vendors.map((vendor) => vendor.id === editVendorId ? record : vendor)
      : [record, ...vendors];
    setVendors(nextVendors);
    saveVendorPayeeData(nextVendors);
    closeModal();
  };

  const handleDelete = (vendor: VendorRecord) => {
    if (!confirm(`Delete “${vendor.name}” from the Vendor / Payee Master?`)) return;
    const nextVendors = vendors.filter((item) => item.id !== vendor.id);
    setVendors(nextVendors);
    saveVendorPayeeData(nextVendors);
  };

  const columns = [
    {
      key: 'vendor', header: 'Vendor / Payee', render: (row: VendorRecord) => (
        <div className="min-w-44">
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500 font-mono">{row.code}</p>
          <p className="text-xs text-gray-500 mt-1">{row.category || 'Uncategorized'}</p>
        </div>
      )
    },
    { key: 'type', header: 'Type', render: (row: VendorRecord) => <Badge variant="info">{row.type}</Badge> },
    {
      key: 'contact', header: 'Contact', render: (row: VendorRecord) => (
        <div className="space-y-1 text-xs">
          <p className="font-medium text-gray-800">{row.contact || '—'}</p>
          {row.phone && <p className="flex items-center gap-1 text-gray-500"><Phone className="w-3 h-3" />{row.phone}</p>}
          {row.email && <p className="flex items-center gap-1 text-gray-500"><Mail className="w-3 h-3" />{row.email}</p>}
        </div>
      )
    },
    {
      key: 'registration', header: 'Tax Registration', render: (row: VendorRecord) => (
        <div className="space-y-1 text-xs">
          <p className="font-mono text-gray-700">GSTIN: {row.gstin || '—'}</p>
          <p className="font-mono text-gray-500">PAN: {row.pan || '—'}</p>
        </div>
      )
    },
    {
      key: 'address', header: 'Business Address', render: (row: VendorRecord) => (
        <div className="max-w-52 text-xs text-gray-600">
          <p className="flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5 shrink-0 text-gray-400" />{row.address || '—'}</p>
          <p className="pl-4">{[row.city, row.state, row.pincode].filter(Boolean).join(', ') || '—'}</p>
        </div>
      )
    },
    {
      key: 'bank', header: 'Bank Details', render: (row: VendorRecord) => (
        <div className="space-y-1 text-xs">
          <p className="font-medium text-gray-700">{row.bankName || '—'}</p>
          <p className="font-mono text-gray-500">A/C {row.bankAccount || '—'}</p>
          <p className="font-mono text-gray-500">IFSC {row.ifsc || '—'}</p>
        </div>
      )
    },
    { key: 'status', header: 'Status', render: (row: VendorRecord) => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (row: VendorRecord) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`}><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="xs" onClick={() => handleDelete(row)} aria-label={`Delete ${row.name}`}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="w-6 h-6 text-indigo-600" />Vendor / Payee Master</h1>
          <p className="text-sm text-gray-500 mt-1">Maintain vendor identity, contact, tax registration, address and bank information for expense processing.</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Vendor / Payee</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered Payees', value: vendors.length, tone: 'text-blue-600' },
          { label: 'Active', value: vendors.filter((vendor) => vendor.status === 'Active').length, tone: 'text-green-600' },
          { label: 'GST Registered', value: vendors.filter((vendor) => !!vendor.gstin).length, tone: 'text-purple-600' },
          { label: 'Vendor Types', value: new Set(vendors.map((vendor) => vendor.type)).size, tone: 'text-amber-600' }
        ].map((stat) => <Card key={stat.label} className="p-4"><p className={`text-2xl font-bold ${stat.tone}`}>{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></Card>)}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Search name, code, GSTIN or contact..." value={search} onChange={(event) => setSearch(event.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          <Select value={typeFilter} onChange={setTypeFilter} options={[{ value: 'all', label: 'All Types' }, ...VENDOR_TYPES.map((type) => ({ value: type, label: type }))]} />
          <Button variant="outline" onClick={() => { setSearch(''); setTypeFilter('all'); }}><RefreshCw className="w-4 h-4 mr-2" />Reset Filters</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><p className="text-sm text-gray-600">Showing {filtered.length} of {vendors.length} vendors / payees</p></div>
        <Table columns={columns} data={filtered} />
        {filtered.length === 0 && <div className="p-10 text-center text-gray-500">No vendor or payee records match the current filters.</div>}
      </Card>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
        <Card className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div><h2 className="text-xl font-semibold text-gray-900">{editVendorId ? 'Edit Vendor / Payee' : 'Add Vendor / Payee'}</h2><p className="text-xs text-gray-500 mt-1">Capture business, contact, tax and payment account details.</p></div>
            <Button variant="ghost" size="xs" onClick={closeModal} aria-label="Close vendor form"><X className="w-5 h-5" /></Button>
          </div>

          <div className="space-y-5 py-5">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Identity & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Vendor Code *" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="e.g. VND005" />
                <Input label="Business / Payee Name *" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <Select label="Type" value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={VENDOR_TYPES.map((type) => ({ value: type, label: type }))} />
                <Select label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} options={VENDOR_CATEGORIES.map((category) => ({ value: category, label: category }))} />
                <Input label="Contact Person" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} />
                <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <Select label="Status" value={form.status} onChange={(value) => setForm({ ...form, status: value as VendorRecord['status'] })} options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
              </div>
            </section>

            <section className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-800">Tax Registration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="GSTIN" value={form.gstin} onChange={(event) => setForm({ ...form, gstin: event.target.value.toUpperCase() })} placeholder="15-digit GSTIN" />
                <Input label="PAN" value={form.pan} onChange={(event) => setForm({ ...form, pan: event.target.value.toUpperCase() })} placeholder="PAN (optional)" />
              </div>
            </section>

            <section className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-800">Business Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Street / Office Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
                <Input label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
                <Input label="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
                <Input label="PIN Code" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} />
              </div>
            </section>

            <section className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-800">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Bank Name" value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} />
                <Input label="Account Number" value={form.bankAccount} onChange={(event) => setForm({ ...form, bankAccount: event.target.value })} />
                <Input label="IFSC Code" value={form.ifsc} onChange={(event) => setForm({ ...form, ifsc: event.target.value.toUpperCase() })} />
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editVendorId ? 'Update Vendor / Payee' : 'Save Vendor / Payee'}</Button>
          </div>
        </Card>
      </div>}
    </div>
  );
}

export default VendorPayeeMaster;
