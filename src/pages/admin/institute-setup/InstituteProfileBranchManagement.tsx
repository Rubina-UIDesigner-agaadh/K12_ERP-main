// filepath: src/pages/settings/InstituteProfileBranchManagement/InstituteProfileBranchManagement.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Building,
  MapPin,
  Phone,
  Globe,
  Edit2,
  Trash2,
  X,
  Save,
  Plus,
  CheckCircle,
  AlertCircle,
  Users,
  Mail,
  Calendar } from
'lucide-react';

interface Branch {
  id: number;
  name: string;
  code: string;
  city: string;
  address: string;
  principal: string;
  principalEmail: string;
  principalPhone: string;
  status: 'Active' | 'Inactive';
  establishedDate: string;
  studentCount: number;
  staffCount: number;
}

interface InstituteProfile {
  name: string;
  shortName: string;
  establishedYear: string;
  affiliation: string;
  affiliationNumber: string;
  registeredAddress: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  alternatePhone: string;
  email: string;
  website: string;
  logo: string;
}

export function InstituteProfileBranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([
  {
    id: 1,
    name: 'Main Campus',
    code: 'BR-01',
    city: 'Ahmedabad',
    address: '123, Education Lane, Science City Road, Ahmedabad - 380060',
    principal: 'Dr. R.K. Sharma',
    principalEmail: 'rk.sharma@sunshine.edu',
    principalPhone: '+91 98765 43211',
    status: 'Active',
    establishedDate: '1995-06-15',
    studentCount: 1250,
    staffCount: 85
  },
  {
    id: 2,
    name: 'City Center Branch',
    code: 'BR-02',
    city: 'Ahmedabad',
    address: '456, Central Avenue, Navrangpura, Ahmedabad - 380009',
    principal: 'Mrs. S. Patel',
    principalEmail: 's.patel@sunshine.edu',
    principalPhone: '+91 98765 43212',
    status: 'Active',
    establishedDate: '2005-04-10',
    studentCount: 850,
    staffCount: 55
  },
  {
    id: 3,
    name: 'North Zone Campus',
    code: 'BR-03',
    city: 'Gandhinagar',
    address: '789, Knowledge Park, Sector 21, Gandhinagar - 382021',
    principal: 'Mr. A. Singh',
    principalEmail: 'a.singh@sunshine.edu',
    principalPhone: '+91 98765 43213',
    status: 'Inactive',
    establishedDate: '2018-07-20',
    studentCount: 420,
    staffCount: 32
  }]
  );

  const [instituteProfile, setInstituteProfile] = useState<InstituteProfile>({
    name: 'Sunshine International School',
    shortName: 'SIS',
    establishedYear: '1995',
    affiliation: 'CBSE',
    affiliationNumber: 'CBSE/AFF/2300045',
    registeredAddress: '123, Education Lane, Science City Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380060',
    phone: '+91 98765 43210',
    alternatePhone: '+91 79 2345 6789',
    email: 'admin@sunshine.edu',
    website: 'www.sunshine-school.edu',
    logo: ''
  });

  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isEditBranchModalOpen, setIsEditBranchModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isViewBranchModalOpen, setIsViewBranchModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const [branchForm, setBranchForm] = useState<Partial<Branch>>({
    name: '',
    code: '',
    city: '',
    address: '',
    principal: '',
    principalEmail: '',
    principalPhone: '',
    status: 'Active',
    establishedDate: '',
    studentCount: 0,
    staffCount: 0
  });

  const [profileForm, setProfileForm] = useState<InstituteProfile>({
    ...instituteProfile
  });

  const cityOptions = [
  { value: 'Ahmedabad', label: 'Ahmedabad' },
  { value: 'Gandhinagar', label: 'Gandhinagar' },
  { value: 'Surat', label: 'Surat' },
  { value: 'Vadodara', label: 'Vadodara' },
  { value: 'Rajkot', label: 'Rajkot' }];


  const stateOptions = [
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Delhi', label: 'Delhi' }];


  const affiliationOptions = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'State Board', label: 'State Board' },
  { value: 'IB', label: 'International Baccalaureate' },
  { value: 'Cambridge', label: 'Cambridge' }];


  const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }];


  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  const generateBranchCode = () => {
    const maxId = Math.max(...branches.map((b) => b.id), 0);
    return `BR-${String(maxId + 1).padStart(2, '0')}`;
  };

  const handleAddBranch = () => {
    setBranchForm({
      name: '',
      code: generateBranchCode(),
      city: '',
      address: '',
      principal: '',
      principalEmail: '',
      principalPhone: '',
      status: 'Active',
      establishedDate: new Date().toISOString().split('T')[0],
      studentCount: 0,
      staffCount: 0
    });
    setIsAddBranchModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchForm({ ...branch });
    setIsEditBranchModalOpen(true);
  };

  const handleViewBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewBranchModalOpen(true);
  };

  const handleDeleteBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteBranch = () => {
    if (selectedBranch) {
      setBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id));
      showMessage('success', `Branch "${selectedBranch.name}" deleted successfully`);
      setIsDeleteConfirmOpen(false);
      setSelectedBranch(null);
    }
  };

  const handleSaveNewBranch = () => {
    if (!branchForm.name || !branchForm.city || !branchForm.principal) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    const newBranch: Branch = {
      id: Math.max(...branches.map((b) => b.id), 0) + 1,
      name: branchForm.name || '',
      code: branchForm.code || generateBranchCode(),
      city: branchForm.city || '',
      address: branchForm.address || '',
      principal: branchForm.principal || '',
      principalEmail: branchForm.principalEmail || '',
      principalPhone: branchForm.principalPhone || '',
      status: branchForm.status as 'Active' | 'Inactive' || 'Active',
      establishedDate: branchForm.establishedDate || new Date().toISOString().split('T')[0],
      studentCount: branchForm.studentCount || 0,
      staffCount: branchForm.staffCount || 0
    };

    setBranches((prev) => [...prev, newBranch]);
    showMessage('success', `Branch "${newBranch.name}" added successfully`);
    setIsAddBranchModalOpen(false);
  };

  const handleUpdateBranch = () => {
    if (!branchForm.name || !branchForm.city || !branchForm.principal) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setBranches((prev) =>
    prev.map((b) =>
    b.id === selectedBranch?.id ? { ...b, ...branchForm } as Branch : b
    )
    );
    showMessage('success', `Branch "${branchForm.name}" updated successfully`);
    setIsEditBranchModalOpen(false);
    setSelectedBranch(null);
  };

  const handleEditProfile = () => {
    setProfileForm({ ...instituteProfile });
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!profileForm.name || !profileForm.email || !profileForm.phone) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setInstituteProfile({ ...profileForm });
    showMessage('success', 'Institute profile updated successfully');
    setIsEditProfileModalOpen(false);
  };

  const handleToggleBranchStatus = (branch: Branch) => {
    const newStatus = branch.status === 'Active' ? 'Inactive' : 'Active';
    setBranches((prev) =>
    prev.map((b) => b.id === branch.id ? { ...b, status: newStatus } : b)
    );
    showMessage(
      'success',
      `Branch "${branch.name}" is now ${newStatus.toLowerCase()}`
    );
  };

  const columns = [
  {
    key: 'name',
    header: 'Branch Name',
    render: (row: Branch) =>
    <div>
          <button
        onClick={() => handleViewBranch(row)}
        className="font-medium text-blue-600 hover:underline">

            {row.name}
          </button>
          <div className="text-xs text-gray-500">{row.address.slice(0, 40)}...</div>
        </div>

  },
  {
    key: 'code',
    header: 'Branch Code'
  },
  {
    key: 'city',
    header: 'City'
  },
  {
    key: 'principal',
    header: 'Principal/Head',
    render: (row: Branch) =>
    <div>
          <div className="font-medium">{row.principal}</div>
          <div className="text-xs text-gray-500">{row.principalEmail}</div>
        </div>

  },
  {
    key: 'counts',
    header: 'Students/Staff',
    render: (row: Branch) =>
    <div className="text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-gray-400" />
            {row.studentCount} / {row.staffCount}
          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Branch) =>
    <button onClick={() => handleToggleBranchStatus(row)}>
          <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
            {row.status}
          </Badge>
        </button>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Branch) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="xs" onClick={() => handleEditBranch(row)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleDeleteBranch(row)}>

            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Institute Profile & Branches
          </h1>
          <p className="text-sm text-gray-500">
            Manage institute details and multi-campus setup
          </p>
        </div>
        <Button onClick={handleAddBranch}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Branch
        </Button>
      </div>

      {message.type &&
      <div
        className={`flex items-center gap-2 p-4 rounded-lg ${
        message.type === 'success' ?
        'bg-green-50 border border-green-200 text-green-800' :
        'bg-red-50 border border-red-200 text-red-800'}`
        }>

          {message.type === 'success' ?
        <CheckCircle className="w-5 h-5" /> :

        <AlertCircle className="w-5 h-5" />
        }
          <span className="font-medium">{message.text}</span>
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Institute Profile" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {instituteProfile.name}
            </h3>
            <p className="text-sm text-gray-500">
              Est. {instituteProfile.establishedYear} • {instituteProfile.affiliation}{' '}
              Affiliated
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {instituteProfile.affiliationNumber}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Registered Address
                </p>
                <p className="text-sm text-gray-500">
                  {instituteProfile.registeredAddress}, {instituteProfile.city},{' '}
                  {instituteProfile.state} - {instituteProfile.pincode}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Contact</p>
                <p className="text-sm text-gray-500">{instituteProfile.phone}</p>
                {instituteProfile.alternatePhone &&
                <p className="text-sm text-gray-500">
                    {instituteProfile.alternatePhone}
                  </p>
                }
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">{instituteProfile.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Website</p>
                <a
                  href={`https://${instituteProfile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline">

                  {instituteProfile.website}
                </a>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleEditProfile}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card title="Branch Management" className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Total Branches: {branches.length} | Active:{' '}
              {branches.filter((b) => b.status === 'Active').length}
            </div>
          </div>
          <Table columns={columns} data={branches} />
        </Card>
      </div>

      {/* Add Branch Modal */}
      {isAddBranchModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Branch</h2>
              <button
              onClick={() => setIsAddBranchModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <Input
                value={branchForm.name || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter branch name" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Code
                </label>
                <Input value={branchForm.code || ''} disabled />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Select
                options={cityOptions}
                value={branchForm.city || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Select city" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Date
                </label>
                <Input
                type="date"
                value={branchForm.establishedDate || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  establishedDate: e.target.value
                }))
                } />

              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <Input
                value={branchForm.address || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter complete address" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal/Head Name *
                </label>
                <Input
                value={branchForm.principal || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, principal: e.target.value }))
                }
                placeholder="Enter principal name" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Email
                </label>
                <Input
                type="email"
                value={branchForm.principalEmail || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  principalEmail: e.target.value
                }))
                }
                placeholder="principal@school.edu" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Phone
                </label>
                <Input
                value={branchForm.principalPhone || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  principalPhone: e.target.value
                }))
                }
                placeholder="+91 98765 43210" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                options={statusOptions}
                value={branchForm.status || 'Active'}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  status: e.target.value as 'Active' | 'Inactive'
                }))
                } />

              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddBranchModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNewBranch}>
                <Save className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Branch Modal */}
      {isEditBranchModalOpen && selectedBranch &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Branch: {selectedBranch.name}</h2>
              <button
              onClick={() => setIsEditBranchModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <Input
                value={branchForm.name || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, name: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Code
                </label>
                <Input value={branchForm.code || ''} disabled />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Select
                options={cityOptions}
                value={branchForm.city || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, city: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Date
                </label>
                <Input
                type="date"
                value={branchForm.establishedDate || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  establishedDate: e.target.value
                }))
                } />

              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <Input
                value={branchForm.address || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, address: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal/Head Name *
                </label>
                <Input
                value={branchForm.principal || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({ ...prev, principal: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Email
                </label>
                <Input
                type="email"
                value={branchForm.principalEmail || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  principalEmail: e.target.value
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Phone
                </label>
                <Input
                value={branchForm.principalPhone || ''}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  principalPhone: e.target.value
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                options={statusOptions}
                value={branchForm.status || 'Active'}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  status: e.target.value as 'Active' | 'Inactive'
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Count
                </label>
                <Input
                type="number"
                value={branchForm.studentCount || 0}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  studentCount: parseInt(e.target.value) || 0
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Count
                </label>
                <Input
                type="number"
                value={branchForm.staffCount || 0}
                onChange={(e) =>
                setBranchForm((prev) => ({
                  ...prev,
                  staffCount: parseInt(e.target.value) || 0
                }))
                } />

              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditBranchModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateBranch}>
                <Save className="w-4 h-4 mr-2" />
                Update Branch
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Branch Modal */}
      {isViewBranchModalOpen && selectedBranch &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Branch Details</h2>
              <button
              onClick={() => setIsViewBranchModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedBranch.name}</h3>
                  <p className="text-sm text-gray-500">
                    Code: {selectedBranch.code}
                  </p>
                  <Badge
                  variant={
                  selectedBranch.status === 'Active' ? 'success' : 'secondary'
                  }>

                    {selectedBranch.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-500">{selectedBranch.address}</p>
                  <p className="text-sm text-gray-500">{selectedBranch.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Principal/Head
                  </p>
                  <p className="text-sm text-gray-500">{selectedBranch.principal}</p>
                  <p className="text-sm text-gray-500">
                    {selectedBranch.principalEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBranch.principalPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Established Date
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedBranch.establishedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedBranch.studentCount}
                  </p>
                  <p className="text-sm text-gray-500">Students</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedBranch.staffCount}
                  </p>
                  <p className="text-sm text-gray-500">Staff Members</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setIsViewBranchModalOpen(false);
                handleEditBranch(selectedBranch);
              }}>

                <Edit2 className="w-4 h-4 mr-2" />
                Edit Branch
              </Button>
              <Button
              variant="primary"
              onClick={() => setIsViewBranchModalOpen(false)}>

                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Institute Profile Modal */}
      {isEditProfileModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Institute Profile</h2>
              <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute Name *
                </label>
                <Input
                value={profileForm.name}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Name
                </label>
                <Input
                value={profileForm.shortName}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, shortName: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Year
                </label>
                <Input
                value={profileForm.establishedYear}
                onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  establishedYear: e.target.value
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation Board
                </label>
                <Select
                options={affiliationOptions}
                value={profileForm.affiliation}
                onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  affiliation: e.target.value
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation Number
                </label>
                <Input
                value={profileForm.affiliationNumber}
                onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  affiliationNumber: e.target.value
                }))
                } />

              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Address
                </label>
                <Input
                value={profileForm.registeredAddress}
                onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  registeredAddress: e.target.value
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Select
                options={cityOptions}
                value={profileForm.city}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Select
                options={stateOptions}
                value={profileForm.state}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, state: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <Input
                value={profileForm.pincode}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, pincode: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <Input
                value={profileForm.phone}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <Input
                value={profileForm.alternatePhone}
                onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  alternatePhone: e.target.value
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <Input
                value={profileForm.website}
                onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, website: e.target.value }))
                } />

              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditProfileModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedBranch &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Delete Branch</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the branch "
              <strong>{selectedBranch.name}</strong>"? All associated data will be
              permanently removed.
            </p>

            <div className="flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setSelectedBranch(null);
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteBranch}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete Branch
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}