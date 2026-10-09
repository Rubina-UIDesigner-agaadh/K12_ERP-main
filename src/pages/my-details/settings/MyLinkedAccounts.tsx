import React, { useState } from 'react';
import { Users, UserPlus, Unlink, RefreshCw, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
export function MyLinkedAccounts() {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const linkedAccounts = [
  {
    id: 1,
    name: 'Aarav Kumar',
    relation: 'Son',
    class: '10-A',
    admissionNo: 'ADM-2020-001',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Riya Kumar',
    relation: 'Daughter',
    class: '6-B',
    admissionNo: 'ADM-2022-045',
    status: 'Active'
  }];

  const columns = [
  {
    key: 'name',
    header: 'Student Name'
  },
  {
    key: 'relation',
    header: 'Relation'
  },
  {
    key: 'class',
    header: 'Class'
  },
  {
    key: 'admissionNo',
    header: 'Admission No'
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: any) => <Badge variant="success">{row.status}</Badge>
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="outline" size="xs">
            Switch View <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          <Button variant="ghost" size="xs" className="text-red-500">
            <Unlink className="w-3 h-3" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Linked Accounts</h1>
          <p className="text-sm text-gray-500">
            Manage family members or multiple roles linked to this login.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsLinkModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" /> Link Student
        </Button>
      </div>

      {/* Role Switcher (For Staff-Parents) */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-indigo-600">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900">Current View: Staff</h3>
              <p className="text-sm text-indigo-700">
                You are logged in as Employee. Switch to Parent view to see your
                children's details.
              </p>
            </div>
          </div>
          <Button variant="outline" className="bg-white hover:bg-indigo-50">
            Switch to Parent View
          </Button>
        </div>
      </Card>

      <Card title="Linked Students">
        <Table columns={columns} data={linkedAccounts} />
      </Card>

      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Link Student Account">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            To link a student, please provide their admission details.
            Verification will be required.
          </p>
          <Input label="Admission Number" placeholder="e.g. ADM-2024-XXX" />
          <Input label="Date of Birth" type="date" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsLinkModalOpen(false)}>
              Verify & Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}