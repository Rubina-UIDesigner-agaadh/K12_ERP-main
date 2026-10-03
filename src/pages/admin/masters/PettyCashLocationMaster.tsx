import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit, Trash2, Search, RefreshCw, X, MapPin } from 'lucide-react';
const MOCK_LOCATIONS = [
{
  id: 'PCL001',
  name: 'Main Office Petty Cash',
  location: 'Admin Block',
  custodian: 'Priya Sharma',
  limit: 10000,
  currentBalance: 6500,
  lastReplenished: '2024-03-10',
  status: 'Active'
},
{
  id: 'PCL002',
  name: 'Science Lab Petty Cash',
  location: 'Science Block',
  custodian: 'Dr. Mehta',
  limit: 5000,
  currentBalance: 1200,
  lastReplenished: '2024-03-05',
  status: 'Active'
},
{
  id: 'PCL003',
  name: 'Sports Department Cash',
  location: 'Sports Complex',
  custodian: 'Coach Rajan',
  limit: 8000,
  currentBalance: 7800,
  lastReplenished: '2024-03-12',
  status: 'Active'
},
{
  id: 'PCL004',
  name: 'Library Petty Cash',
  location: 'Library Block',
  custodian: 'Ms. Kavitha',
  limit: 3000,
  currentBalance: 450,
  lastReplenished: '2024-02-28',
  status: 'Low Balance'
},
{
  id: 'PCL005',
  name: 'City Branch Cash',
  location: 'City Branch',
  custodian: 'Mr. Patel',
  limit: 5000,
  currentBalance: 0,
  lastReplenished: '2024-02-15',
  status: 'Inactive'
}];

export function PettyCashLocationMaster() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editLocation, setEditLocation] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    custodian: '',
    limit: '',
    alertThreshold: '20'
  });
  const openAdd = () => {
    setEditLocation(null);
    setForm({
      name: '',
      location: '',
      custodian: '',
      limit: '',
      alertThreshold: '20'
    });
    setShowModal(true);
  };
  const openEdit = (l: any) => {
    setEditLocation(l);
    setForm({
      name: l.name,
      location: l.location,
      custodian: l.custodian,
      limit: String(l.limit),
      alertThreshold: '20'
    });
    setShowModal(true);
  };
  const filtered = MOCK_LOCATIONS.filter((l) => {
    const matchSearch =
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const statusVariant = (s: string) => {
    const map: Record<string, 'success' | 'secondary' | 'warning' | 'danger'> =
    {
      Active: 'success',
      Inactive: 'secondary',
      'Low Balance': 'warning'
    };
    return map[s] || 'secondary';
  };
  const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (r: any) =>
    <span className="font-mono text-xs text-gray-500">{r.id}</span>

  },
  {
    key: 'name',
    header: 'Petty Cash Name',
    render: (r: any) =>
    <div>
          <p className="font-medium text-gray-900">{r.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {r.location}
          </p>
        </div>

  },
  {
    key: 'custodian',
    header: 'Custodian',
    render: (r: any) =>
    <span className="text-sm text-gray-700">{r.custodian}</span>

  },
  {
    key: 'limit',
    header: 'Cash Limit (₹)',
    render: (r: any) =>
    <span className="font-semibold">₹{r.limit.toLocaleString()}</span>

  },
  {
    key: 'balance',
    header: 'Current Balance',
    render: (r: any) => {
      const pct = r.currentBalance / r.limit * 100;
      return (
        <div>
            <p
            className={`font-semibold text-sm ${pct < 20 ? 'text-red-600' : pct < 40 ? 'text-amber-600' : 'text-green-600'}`}>

              ₹{r.currentBalance.toLocaleString()}
            </p>
            <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
              <div
              className={`h-1.5 rounded-full ${pct < 20 ? 'bg-red-500' : pct < 40 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{
                width: `${pct}%`
              }} />

            </div>
          </div>);

    }
  },
  {
    key: 'lastReplenished',
    header: 'Last Replenished',
    render: (r: any) =>
    <span className="text-xs text-gray-500">{r.lastReplenished}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (r: any) =>
    <Badge variant={statusVariant(r.status)}>{r.status}</Badge>

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
            Petty Cash Location Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage petty cash locations, custodians, and balance limits
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Locations',
          value: MOCK_LOCATIONS.length,
          color: 'blue'
        },
        {
          label: 'Active',
          value: MOCK_LOCATIONS.filter((l) => l.status === 'Active').length,
          color: 'green'
        },
        {
          label: 'Low Balance',
          value: MOCK_LOCATIONS.filter((l) => l.status === 'Low Balance').
          length,
          color: 'amber'
        },
        {
          label: 'Total Cash Held',
          value: `₹${MOCK_LOCATIONS.reduce((s, l) => s + l.currentBalance, 0).toLocaleString()}`,
          color: 'purple'
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
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

          <Select
            placeholder="Filter by Status"
            options={['Active', 'Inactive', 'Low Balance'].map((s) => ({
              value: s,
              label: s
            }))}
            value={statusFilter}
            onChange={setStatusFilter} />

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
            }}>

            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <Card noPadding>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {filtered.length} petty cash locations
          </p>
        </div>
        <Table columns={columns} data={filtered} />
      </Card>

      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-[450px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editLocation ? 'Edit Location' : 'Add Petty Cash Location'}
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
              label="Location Name *"
              value={form.name}
              onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
              }
              placeholder="e.g., Main Office Petty Cash" />

              <Input
              label="Physical Location *"
              value={form.location}
              onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value
              })
              }
              placeholder="e.g., Admin Block, Room 101" />

              <Input
              label="Custodian Name *"
              value={form.custodian}
              onChange={(e) =>
              setForm({
                ...form,
                custodian: e.target.value
              })
              } />

              <Input
              label="Cash Limit (₹) *"
              type="number"
              value={form.limit}
              onChange={(e) =>
              setForm({
                ...form,
                limit: e.target.value
              })
              } />

              <Input
              label="Low Balance Alert Threshold (%)"
              type="number"
              value={form.alertThreshold}
              onChange={(e) =>
              setForm({
                ...form,
                alertThreshold: e.target.value
              })
              }
              helperText="Alert when balance falls below this percentage" />

            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                {editLocation ? 'Update' : 'Add Location'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}