import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus,
  Clock,
  AlertTriangle,
  MoreVertical,
  Search,
  Users,
  UserCheck,
  UserX,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Shield,
  Building,
  Mail,
  Phone,
  X,
  CheckCircle } from
'lucide-react';
interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  org: string;
  invitedBy: string;
  scope: string;
  role: string;
  expiry: string;
  startDate: string;
  status: string;
  daysLeft: number;
  modules: string[];
  accessLevel: string;
}
const ROLES_LIST = [
{
  value: 'External Auditor',
  label: 'External Auditor',
  desc: 'Read-only access to finance and reports'
},
{
  value: 'Vendor Support',
  label: 'Vendor Support',
  desc: 'Access to IT infrastructure and settings'
},
{
  value: 'Event Coordinator',
  label: 'Event Coordinator',
  desc: 'Access to event management module'
},
{
  value: 'Legal Consultant',
  label: 'Legal Consultant',
  desc: 'Access to legal documents and compliance'
},
{
  value: 'Trainer',
  label: 'Trainer',
  desc: 'Access to training and academic modules'
},
{
  value: 'Observer',
  label: 'Observer',
  desc: 'Read-only access to selected modules'
}];

const MODULE_OPTIONS = [
'Finance',
'IT Admin',
'Events',
'HR',
'Academic',
'Reports',
'Settings',
'Library',
'Transport'];

const PURPOSE_OPTIONS = [
'Audit',
'IT Support',
'Event Coordination',
'Legal Consultation',
'Training',
'Other'];

export function GuestUsers() {
  const [guests, setGuests] = useState<Guest[]>([
  {
    id: '1',
    name: 'David Miller',
    email: 'david@auditfirm.com',
    phone: '+1 234 567 8900',
    org: 'Audit Firm LLC',
    invitedBy: 'Robert Johnson',
    scope: 'Finance Module',
    role: 'External Auditor',
    expiry: '2024-05-30',
    startDate: '2024-05-01',
    status: 'Active',
    daysLeft: 14,
    modules: ['Finance', 'Reports'],
    accessLevel: 'Read Only'
  },
  {
    id: '2',
    name: 'Tech Support',
    email: 'support@vendor.com',
    phone: '+1 987 654 3210',
    org: 'Vendor Systems',
    invitedBy: 'John Doe',
    scope: 'IT Infrastructure',
    role: 'Vendor Support',
    expiry: '2024-05-20',
    startDate: '2024-05-10',
    status: 'Expiring Soon',
    daysLeft: 4,
    modules: ['IT Admin', 'Settings'],
    accessLevel: 'Read & Write'
  },
  {
    id: '3',
    name: 'Sarah Connor',
    email: 'sarah@events.com',
    phone: '+1 555 123 4567',
    org: 'Events Co.',
    invitedBy: 'Emily Brown',
    scope: 'Event Management',
    role: 'Event Coordinator',
    expiry: '2024-06-15',
    startDate: '2024-05-15',
    status: 'Active',
    daysLeft: 30,
    modules: ['Events'],
    accessLevel: 'Read & Write'
  },
  {
    id: '4',
    name: 'Mike Ross',
    email: 'mike@legal.com',
    phone: '+1 555 987 6543',
    org: 'Legal Partners',
    invitedBy: 'Robert Johnson',
    scope: 'Legal Documents',
    role: 'Legal Consultant',
    expiry: '2024-05-10',
    startDate: '2024-04-10',
    status: 'Expired',
    daysLeft: -6,
    modules: ['HR', 'Reports'],
    accessLevel: 'Read Only'
  }]
  );
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [extendDate, setExtendDate] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    org: '',
    purpose: 'Audit',
    role: 'External Auditor',
    accessLevel: 'Read Only',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    sendEmail: true,
    modules: [] as string[]
  });
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const resetForm = () => {
    setInviteForm({
      name: '',
      email: '',
      phone: '',
      org: '',
      purpose: 'Audit',
      role: 'External Auditor',
      accessLevel: 'Read Only',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      sendEmail: true,
      modules: []
    });
    setEditingGuest(null);
  };
  const filteredGuests = guests.filter((g) => {
    const matchSearch =
    !searchTerm ||
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const toggleModule = (mod: string) => {
    setInviteForm((prev) => ({
      ...prev,
      modules: prev.modules.includes(mod) ?
      prev.modules.filter((m) => m !== mod) :
      [...prev.modules, mod]
    }));
  };
  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.endDate) return;
    const daysLeft = Math.ceil(
      (new Date(inviteForm.endDate).getTime() - Date.now()) / 86400000
    );
    if (editingGuest) {
      setGuests((prev) =>
      prev.map((g) =>
      g.id === editingGuest.id ?
      {
        ...g,
        name: inviteForm.name,
        email: inviteForm.email,
        phone: inviteForm.phone,
        org: inviteForm.org,
        role: inviteForm.role,
        expiry: inviteForm.endDate,
        startDate: inviteForm.startDate,
        modules: inviteForm.modules,
        accessLevel: inviteForm.accessLevel,
        daysLeft,
        status:
        daysLeft <= 0 ?
        'Expired' :
        daysLeft <= 7 ?
        'Expiring Soon' :
        'Active'
      } :
      g
      )
      );
      setToast({
        message: `Guest ${inviteForm.name} updated`,
        type: 'success'
      });
    } else {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: inviteForm.name,
        email: inviteForm.email,
        phone: inviteForm.phone,
        org: inviteForm.org,
        invitedBy: 'Current Admin',
        scope: inviteForm.modules.join(', '),
        role: inviteForm.role,
        expiry: inviteForm.endDate,
        startDate: inviteForm.startDate,
        status:
        daysLeft <= 0 ?
        'Expired' :
        daysLeft <= 7 ?
        'Expiring Soon' :
        'Active',
        daysLeft,
        modules: inviteForm.modules,
        accessLevel: inviteForm.accessLevel
      };
      setGuests((prev) => [...prev, newGuest]);
      setToast({
        message: `Invitation sent to ${inviteForm.name}`,
        type: 'success'
      });
    }
    setShowInvitePanel(false);
    resetForm();
  };
  const handleExtend = () => {
    if (selectedGuest && extendDate) {
      const daysLeft = Math.ceil(
        (new Date(extendDate).getTime() - Date.now()) / 86400000
      );
      setGuests((prev) =>
      prev.map((g) =>
      g.id === selectedGuest.id ?
      {
        ...g,
        expiry: extendDate,
        daysLeft,
        status:
        daysLeft <= 0 ?
        'Expired' :
        daysLeft <= 7 ?
        'Expiring Soon' :
        'Active'
      } :
      g
      )
      );
      setToast({
        message: `Access extended for ${selectedGuest.name}`,
        type: 'success'
      });
      setShowExtendModal(false);
      setSelectedGuest(null);
      setExtendDate('');
    }
  };
  const handleRevoke = () => {
    if (selectedGuest) {
      setGuests((prev) => prev.filter((g) => g.id !== selectedGuest.id));
      setToast({
        message: `Access revoked for ${selectedGuest.name}`,
        type: 'success'
      });
      setShowRevokeModal(false);
      setSelectedGuest(null);
    }
  };
  const openEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setInviteForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      org: guest.org,
      purpose: 'Other',
      role: guest.role,
      accessLevel: guest.accessLevel,
      startDate: guest.startDate,
      endDate: guest.expiry,
      sendEmail: false,
      modules: guest.modules
    });
    setShowInvitePanel(true);
    setActiveDropdown(null);
  };
  const stats = [
  {
    label: 'Total Guests',
    value: guests.length,
    icon: Users,
    color: 'blue'
  },
  {
    label: 'Active',
    value: guests.filter((g) => g.status === 'Active').length,
    icon: UserCheck,
    color: 'green'
  },
  {
    label: 'Expiring Soon',
    value: guests.filter((g) => g.status === 'Expiring Soon').length,
    icon: Clock,
    color: 'amber'
  },
  {
    label: 'Expired',
    value: guests.filter((g) => g.status === 'Expired').length,
    icon: UserX,
    color: 'red'
  }];

  const getDuration = () => {
    if (inviteForm.startDate && inviteForm.endDate) {
      const days = Math.ceil(
        (new Date(inviteForm.endDate).getTime() -
        new Date(inviteForm.startDate).getTime()) /
        86400000
      );
      return days > 0 ? `${days} days access` : 'Invalid range';
    }
    return '';
  };
  return (
    <div className="p-6 space-y-6">
      {toast &&
      <div
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
        
          {toast.type === 'success' ?
        <CheckCircle className="w-4 h-4" /> :

        <AlertTriangle className="w-4 h-4" />
        }
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guest Users</h1>
          <p className="text-sm text-gray-500">
            Manage temporary access for external users
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowInvitePanel(true);
          }}>
          
          <Plus className="w-4 h-4 mr-2" /> Invite Guest
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) =>
        <Card key={i} className="p-4 flex items-center gap-4">
            <div
            className={`p-3 bg-${stat.color}-100 text-${stat.color}-600 rounded-lg`}>
            
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Card>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Guest Access Policy
          </h3>
          <p className="text-sm text-blue-800 mt-1">
            Guest users automatically lose access on their expiry date. Maximum
            allowed duration is 30 days without renewal.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search guests..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
            {
              value: 'All',
              label: 'All Status'
            },
            {
              value: 'Active',
              label: 'Active'
            },
            {
              value: 'Expiring Soon',
              label: 'Expiring Soon'
            },
            {
              value: 'Expired',
              label: 'Expired'
            }]
            } />
          
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Guest User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Role & Scope
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Invited By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Access Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuests.map((guest) =>
              <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{guest.name}</p>
                    <p className="text-xs text-gray-500">{guest.email}</p>
                    {guest.org &&
                  <p className="text-xs text-gray-400">{guest.org}</p>
                  }
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{guest.role}</p>
                    <p className="text-xs text-gray-500">{guest.accessLevel}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{guest.invitedBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock
                      className={`w-4 h-4 ${guest.daysLeft < 0 ? 'text-red-500' : guest.daysLeft <= 7 ? 'text-amber-500' : 'text-gray-400'}`} />
                    
                      <div>
                        <span
                        className={
                        guest.daysLeft < 0 ? 'text-red-600 font-medium' : ''
                        }>
                        
                          {guest.expiry}
                        </span>
                        <p className="text-xs text-gray-400">
                          {guest.daysLeft > 0 ?
                        `${guest.daysLeft} days left` :
                        guest.daysLeft === 0 ?
                        'Expires today' :
                        'Expired'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                    variant={
                    guest.status === 'Active' ?
                    'success' :
                    guest.status === 'Expired' ?
                    'danger' :
                    'warning'
                    }>
                    
                      {guest.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div
                    className="relative"
                    ref={
                    activeDropdown === guest.id ? dropdownRef : undefined
                    }>
                    
                      <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                      setActiveDropdown(
                        activeDropdown === guest.id ? null : guest.id
                      )
                      }>
                      
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {activeDropdown === guest.id &&
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                          <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          alert(
                            `Modules: ${guest.modules.join(', ')}\nAccess: ${guest.accessLevel}\nPeriod: ${guest.startDate} to ${guest.expiry}`
                          );
                          setActiveDropdown(null);
                        }}>
                        
                            <Eye className="w-4 h-4 text-blue-600" /> View
                            Details
                          </button>
                          <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          setSelectedGuest(guest);
                          setExtendDate(guest.expiry);
                          setShowExtendModal(true);
                          setActiveDropdown(null);
                        }}>
                        
                            <Calendar className="w-4 h-4 text-green-600" />{' '}
                            Extend Access
                          </button>
                          <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => openEdit(guest)}>
                        
                            <Edit className="w-4 h-4 text-amber-600" /> Edit
                            Guest
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        onClick={() => {
                          setSelectedGuest(guest);
                          setShowRevokeModal(true);
                          setActiveDropdown(null);
                        }}>
                        
                            <Trash2 className="w-4 h-4" /> Revoke Access
                          </button>
                        </div>
                    }
                    </div>
                  </td>
                </tr>
              )}
              {filteredGuests.length === 0 &&
              <tr>
                  <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-500">
                  
                    No guest users found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite / Edit Guest Panel */}
      {showInvitePanel &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => {
            setShowInvitePanel(false);
            resetForm();
          }} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">
                {editingGuest ? 'Edit Guest' : 'Invite Guest User'}
              </h2>
              <button
              onClick={() => {
                setShowInvitePanel(false);
                resetForm();
              }}
              className="p-1 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) =>
                  setInviteForm((p) => ({
                    ...p,
                    name: e.target.value
                  }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Guest name" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                  setInviteForm((p) => ({
                    ...p,
                    email: e.target.value
                  }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="guest@email.com" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                  type="text"
                  value={inviteForm.phone}
                  onChange={(e) =>
                  setInviteForm((p) => ({
                    ...p,
                    phone: e.target.value
                  }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                  type="text"
                  value={inviteForm.org}
                  onChange={(e) =>
                  setInviteForm((p) => ({
                    ...p,
                    org: e.target.value
                  }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name" />
                
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <select
                  value={inviteForm.purpose}
                  onChange={(e) =>
                  setInviteForm((p) => ({
                    ...p,
                    purpose: e.target.value
                  }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  
                    {PURPOSE_OPTIONS.map((p) =>
                  <option key={p} value={p}>
                        {p}
                      </option>
                  )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level
                  </label>
                  <select
                  value={inviteForm.accessLevel}
                  onChange={(e) =>
                  setInviteForm((p) => ({
                    ...p,
                    accessLevel: e.target.value
                  }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  
                    <option value="Read Only">Read Only</option>
                    <option value="Read & Write">Read & Write</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role & Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES_LIST.map((r) =>
                <label
                  key={r.value}
                  className={`flex items-start gap-2 p-3 border-2 rounded-lg cursor-pointer ${inviteForm.role === r.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  
                      <input
                    type="radio"
                    name="guestRole"
                    checked={inviteForm.role === r.value}
                    onChange={() =>
                    setInviteForm((p) => ({
                      ...p,
                      role: r.value
                    }))
                    }
                    className="mt-1 text-blue-600" />
                  
                      <div>
                        <span className="text-sm font-medium">{r.label}</span>
                        <p className="text-xs text-gray-500">{r.desc}</p>
                      </div>
                    </label>
                )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Access
                </label>
                <div className="flex flex-wrap gap-2">
                  {MODULE_OPTIONS.map((mod) =>
                <button
                  key={mod}
                  onClick={() => toggleModule(mod)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition ${inviteForm.modules.includes(mod) ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                  
                      {mod}
                    </button>
                )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Timeline
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input
                    type="date"
                    value={inviteForm.startDate}
                    onChange={(e) =>
                    setInviteForm((p) => ({
                      ...p,
                      startDate: e.target.value
                    }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Date *
                    </label>
                    <input
                    type="date"
                    value={inviteForm.endDate}
                    onChange={(e) =>
                    setInviteForm((p) => ({
                      ...p,
                      endDate: e.target.value
                    }))
                    }
                    min={inviteForm.startDate}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  
                  </div>
                </div>
                {getDuration() &&
              <div className="mt-2 flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      {getDuration()}
                    </span>
                  </div>
              }
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                type="checkbox"
                checked={inviteForm.sendEmail}
                onChange={(e) =>
                setInviteForm((p) => ({
                  ...p,
                  sendEmail: e.target.checked
                }))
                }
                className="rounded text-blue-600" />
              
                Send invitation email to guest
              </label>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <Button
              variant="outline"
              onClick={() => {
                setShowInvitePanel(false);
                resetForm();
              }}>
              
                Cancel
              </Button>
              <Button
              onClick={handleInvite}
              disabled={
              !inviteForm.name || !inviteForm.email || !inviteForm.endDate
              }>
              
                {editingGuest ? 'Update Guest' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Extend Access Modal */}
      {showExtendModal && selectedGuest &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowExtendModal(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-4">Extend Access</h2>
            <p className="text-sm text-gray-600 mb-3">
              Extend access for <strong>{selectedGuest.name}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New End Date
              </label>
              <input
              type="date"
              value={extendDate}
              onChange={(e) => setExtendDate(e.target.value)}
              min={selectedGuest.expiry}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
              variant="outline"
              onClick={() => setShowExtendModal(false)}>
              
                Cancel
              </Button>
              <Button onClick={handleExtend}>Extend</Button>
            </div>
          </div>
        </div>
      }

      {/* Revoke Access Modal */}
      {showRevokeModal && selectedGuest &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowRevokeModal(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Revoke Access?</h3>
            <p className="text-sm text-gray-500 mb-4">
              Remove all access for <strong>{selectedGuest.name}</strong>. This
              action is immediate.
            </p>
            <div className="flex gap-3">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowRevokeModal(false)}>
              
                Cancel
              </Button>
              <Button
              variant="danger"
              className="flex-1"
              onClick={handleRevoke}>
              
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}