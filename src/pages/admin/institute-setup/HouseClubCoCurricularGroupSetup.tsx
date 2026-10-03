import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Users } from 'lucide-react';
export function HouseClubCoCurricularGroupSetup() {
  const data = [
  {
    id: 1,
    name: 'Red House',
    type: 'House',
    members: 150,
    mentor: 'Mr. A'
  },
  {
    id: 2,
    name: 'Blue House',
    type: 'House',
    members: 145,
    mentor: 'Mrs. B'
  },
  {
    id: 3,
    name: 'Science Club',
    type: 'Club',
    members: 40,
    mentor: 'Dr. C'
  },
  {
    id: 4,
    name: 'NCC',
    type: 'Unit',
    members: 60,
    mentor: 'Capt. D'
  }];

  const columns = [
  {
    key: 'name',
    header: 'Group Name'
  },
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'members',
    header: 'Members'
  },
  {
    key: 'mentor',
    header: 'Mentor/In-charge'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Co-Curricular Groups
          </h1>
          <p className="text-sm text-gray-500">
            Setup houses, clubs, and student groups
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}