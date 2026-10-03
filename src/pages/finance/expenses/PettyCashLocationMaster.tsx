import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  MapPin,
  User,
  Banknote,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ShieldCheck,
  AlertOctagon } from
'lucide-react';

// --- Types ---
interface CashLocation {
  id: string;
  locationName: string;
  custodianId: string;
  custodianName: string;
  maxLimit: number;
  currentBalance: number; // Mocked for display context
  isActive: boolean;
}

// --- Mock Data ---
const STAFF_MEMBERS = [
{ value: 'stf_001', label: 'Mr. Rajesh Kumar (Admin)' },
{ value: 'stf_002', label: 'Ms. Anita Desai (Librarian)' },
{ value: 'stf_003', label: 'Mr. Suresh Singh (Sports Coach)' },
{ value: 'stf_004', label: 'Ms. Priya Menon (Receptionist)' }];


const INITIAL_LOCATIONS: CashLocation[] = [
{
  id: '1',
  locationName: 'Front Office Desk',
  custodianId: 'stf_004',
  custodianName: 'Ms. Priya Menon (Receptionist)',
  maxLimit: 15000,
  currentBalance: 4500,
  isActive: true
},
{
  id: '2',
  locationName: 'Sports Department',
  custodianId: 'stf_003',
  custodianName: 'Mr. Suresh Singh (Sports Coach)',
  maxLimit: 5000,
  currentBalance: 1200,
  isActive: true
},
{
  id: '3',
  locationName: 'Library Counter',
  custodianId: 'stf_002',
  custodianName: 'Ms. Anita Desai (Librarian)',
  maxLimit: 2000,
  currentBalance: 1950, // Near limit
  isActive: true
}];


export function PettyCashLocationMaster() {
  // --- State ---
  const [locations, setLocations] = useState<CashLocation[]>(INITIAL_LOCATIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CashLocation>>({
    locationName: '',
    custodianId: '',
    maxLimit: 0,
    isActive: true
  });

  // --- Handlers ---

  const handleAddNew = () => {
    setFormData({
      locationName: '',
      custodianId: '',
      maxLimit: 0,
      isActive: true
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (loc: CashLocation) => {
    setFormData(loc);
    setEditingId(loc.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this location? Ensure balance is zero before deleting.")) {
      setLocations((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.locationName || !formData.custodianId || !formData.maxLimit) {
      alert("Please fill all mandatory fields.");
      return;
    }

    const custodianLabel = STAFF_MEMBERS.find((s) => s.value === formData.custodianId)?.label || '';

    if (editingId) {
      setLocations((prev) => prev.map((l) => l.id === editingId ? { ...formData, id: editingId, custodianName: custodianLabel } as CashLocation : l));
    } else {
      const newLoc: CashLocation = {
        ...(formData as CashLocation),
        id: Math.random().toString(36).substr(2, 9),
        custodianName: custodianLabel,
        currentBalance: 0 // New locations start with 0
      };
      setLocations([...locations, newLoc]);
    }
    setIsFormOpen(false);
  };

  // --- Columns ---
  const columns = [
  {
    key: 'name',
    header: 'Location Name',
    render: (row: CashLocation) =>
    <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded text-blue-600">
                <MapPin className="w-4 h-4" />
            </div>
            <span className="font-medium text-gray-900">{row.locationName}</span>
        </div>

  },
  {
    key: 'custodian',
    header: 'Responsible Staff (Custodian)',
    render: (row: CashLocation) =>
    <div className="flex items-center gap-2 text-sm text-gray-700">
            <User className="w-3 h-3 text-gray-400" />
            {row.custodianName}
        </div>

  },
  {
    key: 'limits',
    header: 'Cash Limit / Status',
    render: (row: CashLocation) => {
      const usage = row.currentBalance / row.maxLimit * 100;
      let color = 'bg-blue-600';
      if (usage > 90) color = 'bg-red-500';else
      if (usage > 70) color = 'bg-yellow-500';

      return (
        <div className="w-32">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-700">₹{row.currentBalance.toLocaleString()}</span>
                    <span className="text-gray-400">/ ₹{row.maxLimit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(usage, 100)}%` }}></div>
                </div>
            </div>);

    }
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: CashLocation) =>
    <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: CashLocation) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Petty Cash Location Master
          </h1>
          <p className="text-sm text-gray-500">
            Define authorized cash holding points, assign custodians, and set holding limits.
          </p>
        </div>
        {!isFormOpen &&
        <Button variant="primary" onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add Location
            </Button>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: List View */}
        <div className={isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'}>
           <Card className="p-0 border-gray-200 h-full">
              <Table columns={columns} data={locations} />
              
              {locations.length === 0 &&
            <div className="p-10 text-center text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No cash locations defined.</p>
                 </div>
            }
           </Card>
        </div>

        {/* Right: Form Panel */}
        {isFormOpen &&
        <div className="lg:col-span-1 animate-in slide-in-from-right-4">
                <Card title={editingId ? "Edit Location" : "New Cash Point"}>
                   <div className="space-y-4">
                      
                      <Input
                label="Location Name"
                placeholder="e.g. Front Office Desk"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })} />


                      <Select
                label="Custodian (Staff)"
                required
                options={STAFF_MEMBERS}
                value={formData.custodianId}
                onChange={(e) => setFormData({ ...formData, custodianId: e.target.value })}
                placeholder="Select responsible person" />

                      
                      <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-xs text-yellow-800 flex gap-2">
                         <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                         <p>The Custodian is financially responsible for any shortages found during auditing.</p>
                      </div>

                      <Input
                type="number"
                label="Max Cash Limit (₹)"
                placeholder="e.g. 5000"
                required
                value={formData.maxLimit}
                onChange={(e) => setFormData({ ...formData, maxLimit: Number(e.target.value) })} />


                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 mt-2">
                         <label className="text-sm font-medium text-gray-700">Location is Active?</label>
                         <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />

                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                          <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                              <X className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                          <Button variant="primary" className="flex-1" onClick={handleSave}>
                              <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                      </div>

                   </div>
                </Card>
            </div>
        }

      </div>
    </div>);

}