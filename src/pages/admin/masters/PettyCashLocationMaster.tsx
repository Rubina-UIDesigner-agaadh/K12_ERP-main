import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Edit, MapPin, Plus, RefreshCw, Search, Trash2, Wallet, X } from 'lucide-react';

interface CashLocation {
  id: string;
  name: string;
  location: string;
  custodian: string;
  limit: number;
  currentBalance: number;
  lastUpdated: string;
  status: 'Active' | 'Inactive' | 'Low Balance';
}

const INITIAL_LOCATIONS: CashLocation[] = [
  { id: 'PCL001', name: 'Main Office Petty Cash', location: 'Admin Block', custodian: 'Priya Sharma', limit: 10000, currentBalance: 6500, lastUpdated: '2026-09-28', status: 'Active' },
  { id: 'PCL002', name: 'Science Lab Petty Cash', location: 'Science Block', custodian: 'Dr. Mehta', limit: 5000, currentBalance: 1200, lastUpdated: '2026-09-25', status: 'Active' },
  { id: 'PCL003', name: 'Sports Department Cash', location: 'Sports Complex', custodian: 'Coach Rajan', limit: 8000, currentBalance: 7800, lastUpdated: '2026-09-29', status: 'Active' },
  { id: 'PCL004', name: 'Library Petty Cash', location: 'Library Block', custodian: 'Ms. Kavitha', limit: 3000, currentBalance: 450, lastUpdated: '2026-09-22', status: 'Low Balance' },
  { id: 'PCL005', name: 'City Branch Cash', location: 'City Branch', custodian: 'Mr. Patel', limit: 5000, currentBalance: 0, lastUpdated: '2026-09-20', status: 'Inactive' }
];

const STAFF_MEMBERS = ['Priya Sharma', 'Dr. Mehta', 'Coach Rajan', 'Ms. Kavitha', 'Mr. Patel', 'Mr. Rajesh Kumar', 'Ms. Anita Desai', 'Ms. Priya Menon'];
const EMPTY_FORM = { name: '', location: '', custodian: '', limit: '', startingAmount: '', status: 'Active' as CashLocation['status'] };

export function PettyCashLocationMaster() {
  const [locations, setLocations] = useState<CashLocation[]>(INITIAL_LOCATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [amountLocation, setAmountLocation] = useState<CashLocation | null>(null);
  const [amountValue, setAmountValue] = useState('');

  const filtered = useMemo(() => locations.filter((location) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [location.name, location.location, location.custodian].some((value) => value.toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [locations, search, statusFilter]);

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (location: CashLocation) => {
    setEditId(location.id);
    setForm({
      name: location.name,
      location: location.location,
      custodian: location.custodian,
      limit: String(location.limit),
      startingAmount: String(location.currentBalance),
      status: location.status
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const name = form.name.trim();
    const limit = Number(form.limit);
    const startingAmount = Number(form.startingAmount || 0);
    if (!name || !form.location.trim() || !form.custodian || !(limit > 0)) {
      alert('Location name, physical location, custodian, and cash limit are required.');
      return;
    }
    if (startingAmount < 0 || startingAmount > limit) {
      alert('Starting amount must be zero or more and cannot exceed the cash limit.');
      return;
    }
    const record: CashLocation = {
      id: editId || `PCL-${Date.now()}`,
      name,
      location: form.location.trim(),
      custodian: form.custodian,
      limit,
      currentBalance: startingAmount,
      lastUpdated: new Date().toISOString().slice(0, 10),
      status: form.status
    };
    setLocations((current) => editId
      ? current.map((item) => item.id === editId ? record : item)
      : [record, ...current]);
    closeForm();
  };

  const handleDelete = (location: CashLocation) => {
    if (location.currentBalance > 0) {
      alert('Update the cash amount to zero before deleting this location.');
      return;
    }
    if (!confirm(`Delete “${location.name}”?`)) return;
    setLocations((current) => current.filter((item) => item.id !== location.id));
  };

  const openUpdateAmount = (location: CashLocation) => {
    setAmountLocation(location);
    setAmountValue(String(location.currentBalance));
  };

  const handleUpdateAmount = () => {
    if (!amountLocation) return;
    const updatedAmount = Number(amountValue);
    if (Number.isNaN(updatedAmount) || updatedAmount < 0 || updatedAmount > amountLocation.limit) {
      alert(`Enter an amount between ₹0 and the cash limit of ₹${amountLocation.limit.toLocaleString('en-IN')}.`);
      return;
    }
    setLocations((current) => current.map((location) => {
      if (location.id !== amountLocation.id) return location;
      const low = updatedAmount > 0 && updatedAmount / location.limit <= 0.2;
      return {
        ...location,
        currentBalance: updatedAmount,
        lastUpdated: new Date().toISOString().slice(0, 10),
        status: location.status === 'Inactive' ? 'Inactive' : low ? 'Low Balance' : 'Active'
      };
    }));
    setAmountLocation(null);
    setAmountValue('');
  };

  const statusVariant = (status: CashLocation['status']) => status === 'Active' ? 'success' : status === 'Low Balance' ? 'warning' : 'secondary';
  const totalCash = locations.reduce((sum, location) => sum + location.currentBalance, 0);
  const columns = [
    {
      key: 'name', header: 'Petty Cash Location', render: (row: CashLocation) => (
        <div><p className="font-medium text-gray-900">{row.name}</p><p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{row.location}</p></div>
      )
    },
    { key: 'custodian', header: 'Custodian', render: (row: CashLocation) => <span className="text-sm text-gray-700">{row.custodian}</span> },
    { key: 'limit', header: 'Cash Limit', render: (row: CashLocation) => <span className="font-semibold">₹{row.limit.toLocaleString('en-IN')}</span> },
    {
      key: 'balance', header: 'Current Amount', render: (row: CashLocation) => {
        const percent = row.limit > 0 ? Math.min(row.currentBalance / row.limit * 100, 100) : 0;
        const color = percent <= 20 ? 'bg-red-500' : percent <= 40 ? 'bg-amber-500' : 'bg-green-500';
        return <div className="min-w-28"><p className={`font-semibold ${percent <= 20 ? 'text-red-600' : 'text-gray-800'}`}>₹{row.currentBalance.toLocaleString('en-IN')}</p><div className="mt-1 h-1.5 rounded-full bg-gray-100"><div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percent}%` }} /></div></div>;
      }
    },
    { key: 'updated', header: 'Last Updated', render: (row: CashLocation) => <span className="text-xs text-gray-500">{row.lastUpdated}</span> },
    { key: 'status', header: 'Status', render: (row: CashLocation) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (row: CashLocation) => <div className="flex flex-wrap items-center gap-1">
        <Button variant="outline" size="xs" onClick={() => openUpdateAmount(row)}><Wallet className="w-3.5 h-3.5 mr-1" />Update Amount</Button>
        <Button variant="ghost" size="xs" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`}><Edit className="w-4 h-4" /></Button>
        <Button variant="ghost" size="xs" onClick={() => handleDelete(row)} aria-label={`Delete ${row.name}`}><Trash2 className="w-4 h-4 text-red-500" /></Button>
      </div>
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Petty Cash Location Master</h1><p className="text-sm text-gray-500 mt-1">Set starting cash, custodians and limits, and keep each location amount current.</p></div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Location</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Locations', value: locations.length, tone: 'text-blue-600' },
          { label: 'Active Locations', value: locations.filter((location) => location.status === 'Active').length, tone: 'text-green-600' },
          { label: 'Low Balance', value: locations.filter((location) => location.status === 'Low Balance').length, tone: 'text-amber-600' },
          { label: 'Cash Held', value: `₹${totalCash.toLocaleString('en-IN')}`, tone: 'text-purple-600' }
        ].map((stat) => <Card key={stat.label} className="p-4"><p className={`text-2xl font-bold ${stat.tone}`}>{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></Card>)}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Search name, location or custodian..." value={search} onChange={(event) => setSearch(event.target.value)} leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Statuses' }, ...(['Active', 'Low Balance', 'Inactive'] as const).map((status) => ({ value: status, label: status }))]} />
          <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); }}><RefreshCw className="w-4 h-4 mr-2" />Reset Filters</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100"><p className="text-sm text-gray-600">Showing {filtered.length} of {locations.length} petty cash locations</p></div>
        <Table columns={columns} data={filtered} />
        {filtered.length === 0 && <div className="p-10 text-center text-gray-500">No locations match the current filters.</div>}
      </Card>

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={closeForm} />
        <Card className="relative z-10 w-full max-w-xl p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4"><h2 className="text-lg font-semibold">{editId ? 'Edit Petty Cash Location' : 'Add Petty Cash Location'}</h2><Button variant="ghost" size="xs" onClick={closeForm} aria-label="Close location form"><X className="w-5 h-5" /></Button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5">
            <Input label="Location Name *" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Main Office Petty Cash" />
            <Input label="Physical Location *" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Admin Block, Room 101" />
            <Select label="Custodian *" value={form.custodian} onChange={(value) => setForm({ ...form, custodian: value })} options={STAFF_MEMBERS.map((name) => ({ value: name, label: name }))} />
            <Input label="Cash Limit (₹) *" type="number" min="0" value={form.limit} onChange={(event) => setForm({ ...form, limit: event.target.value })} />
            <Input label="Starting Amount (₹)" type="number" min="0" value={form.startingAmount} onChange={(event) => setForm({ ...form, startingAmount: event.target.value })} helperText="Initial available cash for this location." />
            <Select label="Status" value={form.status} onChange={(value) => setForm({ ...form, status: value as CashLocation['status'] })} options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Low Balance', label: 'Low Balance' }]} />
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4"><Button variant="outline" onClick={closeForm}>Cancel</Button><Button variant="primary" onClick={handleSave}>{editId ? 'Update Location' : 'Save Location'}</Button></div>
        </Card>
      </div>}

      {amountLocation && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={() => setAmountLocation(null)} />
        <Card className="relative z-10 w-full max-w-md p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4"><div><h2 className="text-lg font-semibold">Update Amount</h2><p className="text-xs text-gray-500 mt-1">{amountLocation.name} · limit ₹{amountLocation.limit.toLocaleString('en-IN')}</p></div><Button variant="ghost" size="xs" onClick={() => setAmountLocation(null)} aria-label="Close amount update"><X className="w-5 h-5" /></Button></div>
          <div className="py-5"><Input label="Current Available Amount (₹) *" type="number" min="0" max={amountLocation.limit} value={amountValue} onChange={(event) => setAmountValue(event.target.value)} helperText="Enter the current cash amount at this location." /></div>
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4"><Button variant="outline" onClick={() => setAmountLocation(null)}>Cancel</Button><Button variant="primary" onClick={handleUpdateAmount}>Update Amount</Button></div>
        </Card>
      </div>}
    </div>
  );
}

export default PettyCashLocationMaster;
