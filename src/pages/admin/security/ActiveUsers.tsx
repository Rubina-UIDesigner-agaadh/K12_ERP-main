import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { UserAccess, type User as AccessUser } from './UserAccess';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  MoreVertical,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  UserX,
  Trash2,
  AlertTriangle,
  Bell,
  CheckCircle,
  X,
  FileText,
  Lock,
  Unlock } from
'lucide-react';
interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  type: string;
  role: string;
  dept: string;
  campus: string;
  status: string;
  modules: number;
  lastSignIn: string;
  mfa: boolean;
  created: string;
}
export function ActiveUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('All');
  const [users, setUsers] = useState<UserRow[]>([
  {
    id: '1',
    name: 'Aarav Patel',
    username: 'aarav.p',
    email: 'aarav@school.edu',
    type: 'Student',
    role: 'Student',
    dept: 'Class 10-A',
    campus: 'Main Campus',
    status: 'Active',
    modules: 4,
    lastSignIn: '2 hours ago',
    mfa: true,
    created: '2023-08-15'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    username: 'sarah.s',
    email: 'sarah@school.edu',
    type: 'Teacher',
    role: 'Class Teacher',
    dept: 'Mathematics',
    campus: 'Main Campus',
    status: 'Active',
    modules: 8,
    lastSignIn: '10 mins ago',
    mfa: true,
    created: '2022-01-10'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    username: 'robert.j',
    email: 'robert@school.edu',
    type: 'Admin',
    role: 'Principal',
    dept: 'Administration',
    campus: 'All',
    status: 'Active',
    modules: 24,
    lastSignIn: 'Just now',
    mfa: true,
    created: '2020-05-01'
  },
  {
    id: '4',
    name: 'Emily Brown',
    username: 'emily.b',
    email: 'emily@school.edu',
    type: 'Staff',
    role: 'Accountant',
    dept: 'Finance',
    campus: 'Main Campus',
    status: 'Active',
    modules: 6,
    lastSignIn: '1 day ago',
    mfa: false,
    created: '2023-02-20'
  },
  {
    id: '5',
    name: 'Michael Wilson',
    username: 'michael.w',
    email: 'michael@email.com',
    type: 'Parent',
    role: 'Parent',
    dept: 'Guardian',
    campus: 'Main Campus',
    status: 'Active',
    modules: 3,
    lastSignIn: '5 days ago',
    mfa: false,
    created: '2023-08-16'
  },
  {
    id: '6',
    name: 'Priya Sharma',
    username: 'priya.s',
    email: 'priya@school.edu',
    type: 'Student',
    role: 'Student',
    dept: 'Class 9-B',
    campus: 'North Branch',
    status: 'Active',
    modules: 4,
    lastSignIn: '3 hours ago',
    mfa: false,
    created: '2023-08-15'
  },
  {
    id: '7',
    name: 'John Doe',
    username: 'john.d',
    email: 'john@school.edu',
    type: 'Admin',
    role: 'System Admin',
    dept: 'IT',
    campus: 'All',
    status: 'Active',
    modules: 24,
    lastSignIn: '1 hour ago',
    mfa: true,
    created: '2021-11-05'
  },
  {
    id: '8',
    name: 'Rajesh Kumar',
    username: 'rajesh.k',
    email: 'rajesh@email.com',
    type: 'Parent',
    role: 'Parent',
    dept: 'Guardian',
    campus: 'North Branch',
    status: 'Active',
    modules: 3,
    lastSignIn: '2 weeks ago',
    mfa: false,
    created: '2023-08-16'
  }]
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmStatus, setShowConfirmStatus] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [passwordType, setPasswordType] = useState<'auto' | 'manual'>('auto');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [viewUser, setViewUser] = useState<UserRow | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
  // Row → User Access profile (same shape the User Access screen works with)
  const toAccessUser = (u: UserRow): AccessUser => ({
    id: u.id,
    name: u.name,
    loginId: u.username,
    role: u.role,
    status: u.status === 'Active' ? 'Active' : 'Inactive',
    avatar: u.name.charAt(0),
    lastLogin: u.lastSignIn,
    email: u.email,
    phone: '',
    department: u.dept
  });
  const filteredUsers = users.filter(
    (u) =>
    (userTypeFilter === 'All' || u.type === userTypeFilter) && (
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const handleResetPassword = () => {
    setToast({
      message: `Password reset for ${selectedUser?.name}`,
      type: 'success'
    });
    setShowResetPassword(false);
    setSelectedUser(null);
  };
  const handleToggleStatus = () => {
    if (selectedUser) {
      setUsers((prev) =>
      prev.map((u) =>
      u.id === selectedUser.id ?
      {
        ...u,
        status: u.status === 'Active' ? 'Disabled' : 'Active'
      } :
      u
      )
      );
      setToast({
        message: `${selectedUser.name} has been ${selectedUser.status === 'Active' ? 'disabled' : 'enabled'}`,
        type: 'success'
      });
    }
    setShowConfirmStatus(false);
    setSelectedUser(null);
  };
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setToast({
        message: `${selectedUser.name} has been deleted`,
        type: 'success'
      });
    }
    setShowConfirmDelete(false);
    setSelectedUser(null);
  };
  const columns = [
  {
    key: 'name',
    header: 'User',
    render: (row: UserRow) =>
    <button
      type="button"
      onClick={() => setViewUser(row)}
      title="Open access profile"
      className="flex items-center gap-3 text-left group">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900 group-hover:text-blue-700 group-hover:underline">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </button>

  },
  {
    key: 'type',
    header: 'Type & Role',
    render: (row: UserRow) =>
    <div>
          <p className="font-medium text-gray-900">{row.type}</p>
          <p className="text-xs text-gray-500">{row.role}</p>
        </div>

  },
  {
    key: 'dept',
    header: 'Department'
  },
  {
    key: 'campus',
    header: 'Campus'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: UserRow) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'danger'}>
          {row.status}
        </Badge>

  },
  {
    key: 'mfa',
    header: 'MFA',
    render: (row: UserRow) =>
    row.mfa ?
    <ShieldCheck className="w-4 h-4 text-green-500" /> :

    <Shield className="w-4 h-4 text-gray-300" />

  },
  {
    key: 'lastSignIn',
    header: 'Last Sign-in'
  },
  {
    key: 'actions',
    header: '',
    render: (row: UserRow) =>
    <div
      className="relative"
      ref={activeDropdown === row.id ? dropdownRef : undefined}>
      
          <Button
        variant="ghost"
        size="xs"
        onClick={() =>
        setActiveDropdown(activeDropdown === row.id ? null : row.id)
        }>
        
            <MoreVertical className="w-4 h-4" />
          </Button>
          {activeDropdown === row.id &&
      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
              <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          onClick={() => {
            setActiveDropdown(null);
            setViewUser(row);
          }}>
          
                <Eye className="w-4 h-4 text-blue-600" /> View Access Profile
              </button>
              <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          onClick={() => {
            setSelectedUser(row);
            setShowResetPassword(true);
            setActiveDropdown(null);
          }}>
          
                <Key className="w-4 h-4 text-amber-600" /> Reset Password
              </button>
              <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          onClick={() => {
            setSelectedUser(row);
            setShowConfirmStatus(true);
            setActiveDropdown(null);
          }}>
          
                {row.status === 'Active' ?
          <>
                    <UserX className="w-4 h-4 text-orange-600" /> Disable User
                  </> :

          <>
                    <UserCheck className="w-4 h-4 text-green-600" /> Enable User
                  </>
          }
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          onClick={() => {
            setSelectedUser(row);
            setShowConfirmDelete(true);
            setActiveDropdown(null);
          }}>
          
                <Trash2 className="w-4 h-4" /> Delete User
              </button>
            </div>
      }
        </div>

  }];

  if (viewUser) {
    return <UserAccess focusUser={toAccessUser(viewUser)} onBack={() => setViewUser(null)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
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
          <h1 className="text-2xl font-bold text-gray-900">Active Users</h1>
          <p className="text-sm text-gray-500">
            All active users — click a user to open their full access profile
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">1,248</p>
            <p className="text-sm text-gray-500">Total Active</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">850</p>
            <p className="text-sm text-gray-500">Students</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">85</p>
            <p className="text-sm text-gray-500">Teachers</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">42%</p>
            <p className="text-sm text-gray-500">MFA Enabled</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            
          </div>
          <Select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            options={[
            {
              value: 'All',
              label: 'All Types'
            },
            {
              value: 'Student',
              label: 'Student'
            },
            {
              value: 'Teacher',
              label: 'Teacher'
            },
            {
              value: 'Admin',
              label: 'Admin'
            },
            {
              value: 'Staff',
              label: 'Staff'
            },
            {
              value: 'Parent',
              label: 'Parent'
            }]
            } />
          
        </div>
        <Table columns={columns} data={filteredUsers} />
      </Card>

      {/* Export Modal */}
      {showExport &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowExport(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Export Users</h2>
              <button
              onClick={() => setShowExport(false)}
              className="p-1 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
            {
              label: 'Export as CSV',
              icon: FileText,
              format: 'csv'
            },
            {
              label: 'Export as Excel',
              icon: FileText,
              format: 'xlsx'
            },
            {
              label: 'Export as PDF',
              icon: FileText,
              format: 'pdf'
            }].
            map((opt) =>
            <button
              key={opt.format}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              onClick={() => {
                setToast({
                  message: `Exporting as ${opt.format.toUpperCase()}...`,
                  type: 'success'
                });
                setShowExport(false);
              }}>
              
                  <opt.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {opt.label}
                  </span>
                </button>
            )}
            </div>
          </div>
        </div>
      }

      {/* Reset Password Modal */}
      {showResetPassword && selectedUser &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowResetPassword(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Reset Password
              </h2>
              <button
              onClick={() => setShowResetPassword(false)}
              className="p-1 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedUser.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedUser.email} • {selectedUser.role}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Generation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${passwordType === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  
                    <input
                    type="radio"
                    checked={passwordType === 'auto'}
                    onChange={() => setPasswordType('auto')}
                    className="text-blue-600" />
                  
                    <div>
                      <span className="font-medium text-sm">Auto Generate</span>
                      <p className="text-xs text-gray-500">
                        System generates password
                      </p>
                    </div>
                  </label>
                  <label
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${passwordType === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  
                    <input
                    type="radio"
                    checked={passwordType === 'manual'}
                    onChange={() => setPasswordType('manual')}
                    className="text-blue-600" />
                  
                    <div>
                      <span className="font-medium text-sm">Set Manually</span>
                      <p className="text-xs text-gray-500">
                        Enter custom password
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {passwordType === 'auto' ?
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <label className="block text-xs font-medium text-green-700 uppercase mb-1">
                    Generated Password
                  </label>
                  <code className="text-lg font-mono font-bold text-green-800">
                    NewPass@2024
                  </code>
                </div> :

            <div className="space-y-3">
                  <div className="relative">
                    <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                
                    <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  
                      {showPassword ?
                  <EyeOff className="w-4 h-4" /> :

                  <Eye className="w-4 h-4" />
                  }
                    </button>
                  </div>
                  <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
                </div>
            }

              <div className="p-3 border border-gray-200 rounded-lg space-y-2">
                <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Send Credentials
                </h4>
                <label className="flex items-center gap-2 text-sm">
                  <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded text-blue-600" />
                {' '}
                  Send via Email
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                  type="checkbox"
                  checked={sendSMS}
                  onChange={(e) => setSendSMS(e.target.checked)}
                  className="rounded text-blue-600" />
                {' '}
                  Send via SMS
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                variant="outline"
                onClick={() => setShowResetPassword(false)}>
                
                  Cancel
                </Button>
                <Button onClick={handleResetPassword}>
                  <Key className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Confirm Status Toggle Modal */}
      {showConfirmStatus && selectedUser &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowConfirmStatus(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div
            className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedUser.status === 'Active' ? 'bg-orange-100' : 'bg-green-100'}`}>
            
              {selectedUser.status === 'Active' ?
            <UserX className="w-7 h-7 text-orange-600" /> :

            <UserCheck className="w-7 h-7 text-green-600" />
            }
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedUser.status === 'Active' ? 'Disable' : 'Enable'}{' '}
              {selectedUser.name}?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedUser.status === 'Active' ?
            'This user will not be able to log in until re-enabled.' :
            'This user will regain access to the system.'}
            </p>
            <div className="flex gap-3">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirmStatus(false)}>
              
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleToggleStatus}>
                {selectedUser.status === 'Active' ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Confirm Delete Modal */}
      {showConfirmDelete && selectedUser &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowConfirmDelete(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Delete {selectedUser.name}?
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              This will soft-delete the user. They can be restored from the
              Deleted Users page within 30 days.
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-xs text-red-700">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                All active sessions will be terminated immediately.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirmDelete(false)}>
              
                Cancel
              </Button>
              <Button
              variant="danger"
              className="flex-1"
              onClick={handleDeleteUser}>
              
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}