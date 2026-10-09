import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  RefreshCw,
  Trash2,
  AlertCircle,
  Search,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  UserMinus } from
'lucide-react';
interface DeletedUser {
  id: string;
  name: string;
  role: string;
  deletedDate: string;
  deletedBy: string;
  status: string;
  daysLeft: number | null;
}
export function DeletedUsers() {
  const [deletedUsers, setDeletedUsers] = useState<DeletedUser[]>([
  {
    id: '1',
    name: 'Alex Turner',
    role: 'Student',
    deletedDate: '2024-05-10',
    deletedBy: 'System Admin',
    status: 'Soft Deleted',
    daysLeft: 20
  },
  {
    id: '2',
    name: 'Maria Garcia',
    role: 'Teacher',
    deletedDate: '2024-05-05',
    deletedBy: 'HR Manager',
    status: 'Soft Deleted',
    daysLeft: 15
  },
  {
    id: '3',
    name: 'James Smith',
    role: 'Parent',
    deletedDate: '2024-04-20',
    deletedBy: 'System Admin',
    status: 'Soft Deleted',
    daysLeft: 0
  },
  {
    id: '4',
    name: 'Lisa Wong',
    role: 'Staff',
    deletedDate: '2024-01-15',
    deletedBy: 'System Admin',
    status: 'Permanently Deleted',
    daysLeft: null
  }]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] =
  useState(false);
  const [selectedUser, setSelectedUser] = useState<DeletedUser | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const filteredUsers = deletedUsers.filter((u) => {
    const matchSearch =
    !searchTerm ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    const softDeleted = filteredUsers.filter((u) => u.status === 'Soft Deleted');
    if (selectedIds.length === softDeleted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(softDeleted.map((u) => u.id));
    }
  };
  const handleRestore = (user: DeletedUser) => {
    setDeletedUsers((prev) => prev.filter((u) => u.id !== user.id));
    setToast({
      message: `${user.name} has been restored successfully`,
      type: 'success'
    });
    setShowRestoreModal(false);
    setSelectedUser(null);
  };
  const handleBulkRestore = () => {
    const count = selectedIds.length;
    setDeletedUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
    setToast({
      message: `${count} users restored successfully`,
      type: 'success'
    });
  };
  const handlePermanentDelete = () => {
    if (selectedUser && deleteConfirmText === selectedUser.name) {
      setDeletedUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setToast({
        message: `${selectedUser.name} permanently deleted`,
        type: 'success'
      });
      setShowPermanentDeleteModal(false);
      setSelectedUser(null);
      setDeleteConfirmText('');
    }
  };
  const stats = [
  {
    label: 'Total Deleted',
    value: deletedUsers.length,
    icon: Users,
    color: 'blue'
  },
  {
    label: 'Recoverable',
    value: deletedUsers.filter((u) => u.status === 'Soft Deleted').length,
    icon: RefreshCw,
    color: 'amber'
  },
  {
    label: 'Permanent',
    value: deletedUsers.filter((u) => u.status === 'Permanently Deleted').
    length,
    icon: Trash2,
    color: 'red'
  },
  {
    label: 'Expiring Soon',
    value: deletedUsers.filter((u) => u.daysLeft !== null && u.daysLeft <= 5).
    length,
    icon: Clock,
    color: 'orange'
  }];

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
          <h1 className="text-2xl font-bold text-gray-900">Deleted Users</h1>
          <p className="text-sm text-gray-500">
            Manage removed users and recovery
          </p>
        </div>
        {selectedIds.length > 0 &&
        <Button onClick={handleBulkRestore}>
            <RefreshCw className="w-4 h-4 mr-2" /> Restore Selected (
            {selectedIds.length})
          </Button>
        }
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

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-amber-900">
            Data Retention Policy
          </h3>
          <p className="text-sm text-amber-800 mt-1">
            Soft-deleted users are retained for 30 days before being permanently
            removed. Restoring a user brings back their previous roles and
            access.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search deleted users..."
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
              value: 'Soft Deleted',
              label: 'Soft Deleted'
            },
            {
              value: 'Permanently Deleted',
              label: 'Permanently Deleted'
            }]
            } />
          
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                    selectedIds.length > 0 &&
                    selectedIds.length ===
                    filteredUsers.filter((u) => u.status === 'Soft Deleted').
                    length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-600" />
                  
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Deleted Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Deleted By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Retention
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) =>
              <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {user.status === 'Soft Deleted' &&
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="rounded text-blue-600" />

                  }
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.deletedDate}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.deletedBy}</td>
                  <td className="px-4 py-3">
                    <Badge
                    variant={
                    user.status === 'Soft Deleted' ? 'warning' : 'danger'
                    }>
                    
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {user.daysLeft !== null ?
                  <span
                    className={`text-sm ${user.daysLeft === 0 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    
                        {user.daysLeft === 0 ?
                    'Expires today' :
                    `${user.daysLeft} days left`}
                      </span> :

                  <span className="text-gray-400">-</span>
                  }
                  </td>
                  <td className="px-4 py-3">
                    {user.status === 'Soft Deleted' ?
                  <div className="flex gap-2">
                        <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRestoreModal(true);
                      }}>
                      
                          <RefreshCw className="w-3 h-3 mr-1" /> Restore
                        </Button>
                        <Button
                      variant="outline"
                      size="xs"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPermanentDeleteModal(true);
                      }}>
                      
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div> :
                  null}
                  </td>
                </tr>
              )}
              {filteredUsers.length === 0 &&
              <tr>
                  <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-gray-500">
                  
                    No deleted users found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restore Modal */}
      {showRestoreModal && selectedUser &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setShowRestoreModal(false)} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <RefreshCw className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Restore {selectedUser.name}?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This will restore their previous roles and access permissions.
            </p>
            <div className="flex gap-3">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowRestoreModal(false)}>
              
                Cancel
              </Button>
              <Button
              className="flex-1"
              onClick={() => handleRestore(selectedUser)}>
              
                <RefreshCw className="w-4 h-4 mr-2" />
                Restore
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Permanent Delete Modal */}
      {showPermanentDeleteModal && selectedUser &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
          className="fixed inset-0 bg-black/50"
          onClick={() => {
            setShowPermanentDeleteModal(false);
            setDeleteConfirmText('');
          }} />
        
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">
                Permanently Delete {selectedUser.name}?
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. All data will be permanently
                removed.
              </p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-xs text-red-700">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                Type <strong>{selectedUser.name}</strong> to confirm deletion.
              </p>
            </div>
            <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={`Type "${selectedUser.name}" to confirm`}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500" />
          
            <div className="flex gap-3">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowPermanentDeleteModal(false);
                setDeleteConfirmText('');
              }}>
              
                Cancel
              </Button>
              <Button
              variant="danger"
              className="flex-1"
              onClick={handlePermanentDelete}
              disabled={deleteConfirmText !== selectedUser.name}>
              
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}