import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
export function AcademicTermExamTypeMaster() {
  const data = [
  {
    id: 1,
    term: 'Term 1',
    exam: 'Unit Test 1',
    weight: '10%',
    months: 'July'
  },
  {
    id: 2,
    term: 'Term 1',
    exam: 'Half Yearly',
    weight: '40%',
    months: 'September'
  },
  {
    id: 3,
    term: 'Term 2',
    exam: 'Unit Test 2',
    weight: '10%',
    months: 'January'
  },
  {
    id: 4,
    term: 'Term 2',
    exam: 'Annual Exam',
    weight: '40%',
    months: 'March'
  }];

  const columns = [
  {
    key: 'term',
    header: 'Academic Term'
  },
  {
    key: 'exam',
    header: 'Exam Type'
  },
  {
    key: 'weight',
    header: 'Weightage'
  },
  {
    key: 'months',
    header: 'Schedule Month'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="xs">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="xs" className="text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Term & Exam Types
          </h1>
          <p className="text-sm text-gray-500">
            Define terms, exam types, and weightages
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Exam Type
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}