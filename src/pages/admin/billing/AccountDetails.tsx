import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import {
  Building2,
  User,
  MapPin,
  FileText,
  Users,
  GitBranch,
  Shield,
  Settings,
  CheckCircle,
  Save,
  Info,
  AlertTriangle,
  Plus,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Edit3,
  Network,
  Search,
  X } from
'lucide-react';

function ReadOnlyField({
  label,
  value,
  icon: Icon,
  className = ''





}: {label: string;value: string;icon?: React.ElementType;className?: string;}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
        {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
        <span className="text-sm font-medium text-gray-800 truncate">
          {value || '—'}
        </span>
      </div>
    </div>);

}

function SectionDivider({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  badge,
  action








}: {icon: React.ElementType;iconBg: string;iconColor: string;title: string;subtitle?: string;badge?: React.ReactNode;action?: React.ReactNode;}) {
  return (
    <div className="flex items-center justify-between pt-8 pb-4 border-b border-gray-200 first:pt-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          {subtitle &&
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          }
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge}
        {action}
      </div>
    </div>);

}

const MASTER_FRANCHISES = [
{ value: 'sunrise-north', label: 'Sunrise North Zone' },
{ value: 'sunrise-south', label: 'Sunrise South Zone' },
{ value: 'sunrise-east', label: 'Sunrise East Zone' },
{ value: 'sunrise-west', label: 'Sunrise West Zone' },
{ value: 'sunrise-central', label: 'Sunrise Central Zone' }];


const BRANCHES = [
{ value: 'main-delhi', label: 'Main Campus - Delhi' },
{ value: 'branch-noida', label: 'Noida Branch' },
{ value: 'branch-gurgaon', label: 'Gurgaon Branch' },
{ value: 'branch-mumbai', label: 'Mumbai Branch' },
{ value: 'branch-bangalore', label: 'Bangalore Branch' }];


const FRANCHISE_FILTER_OPTIONS = [
{ value: 'all', label: 'All Master Franchises' },
...MASTER_FRANCHISES];


const BRANCH_FILTER_OPTIONS = [
{ value: 'all', label: 'All Branches' },
...BRANCHES];


export function AccountDetails() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: 'Rajesh Kumar',
    email: 'accounts@sunriseschool.edu.in',
    phone: '+91 98765 43210',
    altPhone: '+91 11 2345 6789'
  });
  const [tempContact, setTempContact] = useState({ ...contactInfo });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    line1: 'Plot No. 45, Institutional Area',
    line2: 'Sector 12, Dwarka',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    postalCode: '110075'
  });
  const [tempAddress, setTempAddress] = useState({ ...addressInfo });

  const [hasChanges, setHasChanges] = useState(false);
  const [taxInfo, setTaxInfo] = useState({
    gstin: '07AAAAA0000A1Z5',
    pan: 'AAAAA0000A'
  });

  const orgInfo = {
    schoolName: 'Sunrise International School',
    legalName: 'Sunrise Educational Trust',
    orgType: 'Trust',
    primaryBranch: 'Main Campus - Delhi'
  };

  const [authorizedUsers, setAuthorizedUsers] = useState([
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Chief Accountant',
    email: 'rajesh@sunriseschool.edu.in',
    permission: 'Manage Billing',
    phone: '+91 98765 43210',
    masterFranchise: 'sunrise-north',
    branch: 'main-delhi'
  },
  {
    id: 2,
    name: 'Dr. Anita Sharma',
    role: 'Principal',
    email: 'principal@sunriseschool.edu.in',
    permission: 'Manage Subscription',
    phone: '+91 98765 43211',
    masterFranchise: 'sunrise-north',
    branch: 'main-delhi'
  },
  {
    id: 3,
    name: 'Amit Verma',
    role: 'Admin Officer',
    email: 'admin@sunriseschool.edu.in',
    permission: 'View Billing',
    phone: '+91 98765 43212',
    masterFranchise: 'sunrise-south',
    branch: 'branch-bangalore'
  }]
  );

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [franchiseFilter, setFranchiseFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Chief Accountant',
    email: '',
    permission: 'View Billing',
    phone: '',
    masterFranchise: 'sunrise-north',
    branch: 'main-delhi'
  });

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getMasterFranchiseLabel = (value: string) =>
  MASTER_FRANCHISES.find((m) => m.value === value)?.label || value;

  const getBranchLabel = (value: string) =>
  BRANCHES.find((b) => b.value === value)?.label || value;

  const filteredUsers = useMemo(() => {
    return authorizedUsers.filter((user) => {
      const matchesQuery =
      !userSearchQuery ||
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchQuery.toLowerCase());
      const matchesFranchise =
      franchiseFilter === 'all' || user.masterFranchise === franchiseFilter;
      const matchesBranch =
      branchFilter === 'all' || user.branch === branchFilter;
      return matchesQuery && matchesFranchise && matchesBranch;
    });
  }, [authorizedUsers, userSearchQuery, franchiseFilter, branchFilter]);

  const hasActiveFilters =
  userSearchQuery || franchiseFilter !== 'all' || branchFilter !== 'all';

  const clearFilters = () => {
    setUserSearchQuery('');
    setFranchiseFilter('all');
    setBranchFilter('all');
  };

  const handleEditContact = () => {
    setTempContact({ ...contactInfo });
    setIsEditingContact(true);
  };

  const handleSaveContact = () => {
    setIsSaving(true);
    setTimeout(() => {
      setContactInfo({ ...tempContact });
      setIsEditingContact(false);
      setIsSaving(false);
      showSuccessToast('Billing contact updated successfully!');
    }, 800);
  };

  const handleCancelContact = () => {
    setTempContact({ ...contactInfo });
    setIsEditingContact(false);
  };

  const handleEditAddress = () => {
    setTempAddress({ ...addressInfo });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    setIsSaving(true);
    setTimeout(() => {
      setAddressInfo({ ...tempAddress });
      setIsEditingAddress(false);
      setIsSaving(false);
      showSuccessToast('Billing address updated successfully!');
    }, 800);
  };

  const handleCancelAddress = () => {
    setTempAddress({ ...addressInfo });
    setIsEditingAddress(false);
  };

  const handleTaxChange = (field: string, value: string) => {
    setTaxInfo((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveTax = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      showSuccessToast('Tax information updated successfully!');
    }, 800);
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setAuthorizedUsers([...authorizedUsers, { id: Date.now(), ...newUser }]);
      setShowAddUserModal(false);
      setNewUser({
        name: '',
        role: 'Chief Accountant',
        email: '',
        permission: 'View Billing',
        phone: '',
        masterFranchise: 'sunrise-north',
        branch: 'main-delhi'
      });
      showSuccessToast('User added successfully!');
    }
  };

  const handleRemoveUser = (id: number) => {
    if (confirm('Are you sure you want to remove this authorized user?')) {
      setAuthorizedUsers(authorizedUsers.filter((u) => u.id !== id));
      showSuccessToast('User removed successfully!');
    }
  };

  const isComplete = taxInfo.gstin && addressInfo.line1 && contactInfo.email;

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      {showToast &&
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 shadow-lg shadow-green-100/50">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              {toastMessage}
            </span>
          </div>
        </div>
      }

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Details</h1>
        <p className="text-sm text-gray-500 mt-1.5 max-w-3xl leading-relaxed">
          View and manage your school's billing profile used for ERP
          subscription invoicing, tax compliance, and payment communication.
        </p>
      </div>

      <Card>
        {isComplete ?
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 text-sm">
                Billing Information Verified & Complete
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                Last verified:{' '}
                {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}{' '}
                · By: Admin User
              </p>
            </div>
          </div> :

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm">
                Billing Information Incomplete
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Please complete required fields (GSTIN, Address, Contact) for
                accurate invoicing.
              </p>
            </div>
          </div>
        }

        {/* Organization Information */}
        <SectionDivider
          icon={Building2}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          title="Organization Information" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <ReadOnlyField
            label="School / Organization Name"
            value={orgInfo.schoolName}
            icon={Building2} />
          
          <ReadOnlyField
            label="Legal Entity Name"
            value={orgInfo.legalName}
            icon={Briefcase} />
          
          <ReadOnlyField label="Organization Type" value={orgInfo.orgType} />
          <ReadOnlyField
            label="Primary Branch"
            value={orgInfo.primaryBranch}
            icon={MapPin} />
          
        </div>

        {/* Billing Contact */}
        <SectionDivider
          icon={User}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          title="Billing Contact"
          subtitle="All ERP billing notifications will be sent to this contact"
          action={
          !isEditingContact ?
          <Button variant="outline" size="sm" onClick={handleEditContact}>
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </Button> :

          <div className="flex items-center gap-2">
                <Button
              variant="outline"
              size="sm"
              onClick={handleCancelContact}>
              
                  Cancel
                </Button>
                <Button
              variant="primary"
              size="sm"
              onClick={handleSaveContact}
              disabled={isSaving}>
              
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>

          } />
        
        {isEditingContact ?
        <div className="mt-4 bg-sky-50/40 border border-sky-100 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
              label="Contact Person Name *"
              value={tempContact.name}
              onChange={(e) =>
              setTempContact({ ...tempContact, name: e.target.value })
              }
              placeholder="Enter full name" />
            
              <Input
              label="Email Address *"
              type="email"
              value={tempContact.email}
              onChange={(e) =>
              setTempContact({ ...tempContact, email: e.target.value })
              }
              placeholder="Enter email" />
            
              <Input
              label="Phone Number *"
              value={tempContact.phone}
              onChange={(e) =>
              setTempContact({ ...tempContact, phone: e.target.value })
              }
              placeholder="Enter phone" />
            
              <Input
              label="Alternative Number"
              value={tempContact.altPhone}
              onChange={(e) =>
              setTempContact({ ...tempContact, altPhone: e.target.value })
              }
              placeholder="Enter alt phone" />
            
            </div>
          </div> :

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <ReadOnlyField
            label="Contact Person"
            value={contactInfo.name}
            icon={User} />
          
            <ReadOnlyField
            label="Email Address"
            value={contactInfo.email}
            icon={Mail} />
          
            <ReadOnlyField
            label="Phone Number"
            value={contactInfo.phone}
            icon={Phone} />
          
            <ReadOnlyField
            label="Alternative Number"
            value={contactInfo.altPhone}
            icon={Phone} />
          
          </div>
        }

        {/* Billing Address */}
        <SectionDivider
          icon={MapPin}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          title="Billing Address"
          subtitle="This address appears on all ERP subscription invoices"
          action={
          !isEditingAddress ?
          <Button variant="outline" size="sm" onClick={handleEditAddress}>
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </Button> :

          <div className="flex items-center gap-2">
                <Button
              variant="outline"
              size="sm"
              onClick={handleCancelAddress}>
              
                  Cancel
                </Button>
                <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAddress}
              disabled={isSaving}>
              
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>

          } />
        
        {isEditingAddress ?
        <div className="mt-4 bg-emerald-50/40 border border-emerald-100 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-4">
                <Input
                label="Address Line 1 *"
                value={tempAddress.line1}
                onChange={(e) =>
                setTempAddress({ ...tempAddress, line1: e.target.value })
                }
                placeholder="Enter street address" />
              
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <Input
                label="Address Line 2"
                value={tempAddress.line2}
                onChange={(e) =>
                setTempAddress({ ...tempAddress, line2: e.target.value })
                }
                placeholder="Apartment, suite, etc." />
              
              </div>
              <Input
              label="City *"
              value={tempAddress.city}
              onChange={(e) =>
              setTempAddress({ ...tempAddress, city: e.target.value })
              }
              placeholder="Enter city" />
            
              <Input
              label="State *"
              value={tempAddress.state}
              onChange={(e) =>
              setTempAddress({ ...tempAddress, state: e.target.value })
              }
              placeholder="Enter state" />
            
              <Input
              label="Postal Code *"
              value={tempAddress.postalCode}
              onChange={(e) =>
              setTempAddress({
                ...tempAddress,
                postalCode: e.target.value
              })
              }
              placeholder="Enter postal code" />
            
              <Input
              label="Country *"
              value={tempAddress.country}
              onChange={(e) =>
              setTempAddress({ ...tempAddress, country: e.target.value })
              }
              placeholder="Enter country" />
            
            </div>
          </div> :

        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-800 leading-relaxed">
                <p className="font-medium">{addressInfo.line1}</p>
                {addressInfo.line2 &&
              <p className="text-gray-600">{addressInfo.line2}</p>
              }
                <p className="text-gray-600">
                  {addressInfo.city}, {addressInfo.state} —{' '}
                  {addressInfo.postalCode}
                </p>
                <p className="text-gray-400 mt-1">{addressInfo.country}</p>
              </div>
            </div>
          </div>
        }

        {/* Tax & Compliance */}
        <SectionDivider
          icon={FileText}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          title="Tax & Compliance"
          subtitle="Changes will reflect on future invoices"
          action={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveTax}
            disabled={!hasChanges || isSaving}>
            
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaving ? 'Saving...' : 'Save Tax Info'}
            </Button>
          } />
        
        <div className="mt-4 bg-amber-50/40 border border-amber-100 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GSTIN Number"
              value={taxInfo.gstin}
              onChange={(e) => handleTaxChange('gstin', e.target.value)}
              placeholder="Enter GSTIN" />
            
            <Input
              label="PAN Number *"
              value={taxInfo.pan}
              onChange={(e) => handleTaxChange('pan', e.target.value)}
              placeholder="Enter PAN" />
            
          </div>
          <p className="mt-3 text-xs text-amber-700 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            Invoices will include GST breakdown (CGST + SGST / IGST) when GSTIN
            is provided.
          </p>
        </div>

        {/* Authorized Billing Users */}
        <SectionDivider
          icon={Shield}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          title={`Authorized Billing Users (${filteredUsers.length}${filteredUsers.length !== authorizedUsers.length ? ` of ${authorizedUsers.length}` : ''})`}
          action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddUserModal(true)}>
            
              <Plus className="w-4 h-4 mr-1" /> Add User
            </Button>
          } />
        

        {/* Search & Filter Bar */}
        <div className="mt-4 flex flex-col lg:flex-row gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search users by name, email, or role..."
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition" />
            
            {userSearchQuery &&
            <button
              onClick={() => setUserSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded">
              
                <X className="w-3.5 h-3.5" />
              </button>
            }
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
            <div className="min-w-[200px]">
              <select
                value={franchiseFilter}
                onChange={(e) => setFranchiseFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition">
                
                {FRANCHISE_FILTER_OPTIONS.map((opt) =>
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                )}
              </select>
            </div>
            <div className="min-w-[180px]">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition">
                
                {BRANCH_FILTER_OPTIONS.map((opt) =>
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                )}
              </select>
            </div>
            {hasActiveFilters &&
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition">
              
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            }
          </div>
        </div>

        {/* User List */}
        <div className="mt-4 space-y-2">
          {filteredUsers.length === 0 ?
          <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500">
                No users found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {hasActiveFilters ?
              'Try adjusting your search or filters' :
              'Add authorized users to get started'}
              </p>
            </div> :

          filteredUsers.map((user) =>
          <div
            key={user.id}
            className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/60 transition-colors">
            
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {user.name.
                split(' ').
                map((n) => n[0]).
                join('').
                slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <span className="text-xs text-gray-400">·</span>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        <Network className="w-2.5 h-2.5" />
                        {getMasterFranchiseLabel(user.masterFranchise)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        <GitBranch className="w-2.5 h-2.5" />
                        {getBranchLabel(user.branch)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-4">
                  <span
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                user.permission === 'Manage Subscription' ?
                'bg-purple-100 text-purple-700' :
                user.permission === 'Manage Billing' ?
                'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'}`
                }>
                
                    {user.permission}
                  </span>
                  <button
                onClick={() => handleRemoveUser(user.id)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
          )
          }
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add Authorized Billing User"
        size="lg">
        
        <div className="space-y-5 pt-2">
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-100 rounded-md">
                <Network className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                Organization Details
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Master Franchise *"
                options={MASTER_FRANCHISES}
                value={newUser.masterFranchise}
                onChange={(v) =>
                setNewUser({ ...newUser, masterFranchise: v })
                } />
              
              <Select
                label="Branch *"
                options={BRANCHES}
                value={newUser.branch}
                onChange={(v) => setNewUser({ ...newUser, branch: v })} />
              
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="User Name *"
                value={newUser.name}
                onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter full name" />
              
              <Select
                label="Role"
                options={[
                { value: 'Chief Accountant', label: 'Chief Accountant' },
                { value: 'Principal', label: 'Principal' },
                { value: 'Admin Officer', label: 'Admin Officer' },
                { value: 'Finance Manager', label: 'Finance Manager' },
                { value: 'Trustee', label: 'Trustee' }]
                }
                value={newUser.role}
                onChange={(v) => setNewUser({ ...newUser, role: v })} />
              
              <Input
                label="Email Address *"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address" />
              
              <Input
                label="Phone Number"
                value={newUser.phone}
                onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
                }
                placeholder="Enter phone number" />
              
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Access Permission
            </p>
            <Select
              label="Permission Level"
              options={[
              { value: 'Manage Subscription', label: 'Manage Subscription' },
              { value: 'Manage Billing', label: 'Manage Billing' },
              { value: 'View Billing', label: 'View Billing' },
              { value: 'Approve Payments', label: 'Approve Payments' }]
              }
              value={newUser.permission}
              onChange={(v) => setNewUser({ ...newUser, permission: v })} />
            
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setShowAddUserModal(false)}>
              
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddUser}
              disabled={!newUser.name || !newUser.email}>
              
              <Plus className="w-4 h-4 mr-1" /> Add User
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}