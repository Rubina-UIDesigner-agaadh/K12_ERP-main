import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Plus, Edit, Trash2 } from 'lucide-react';
export function GeneralExamMaster() {
  const columns = [
  {
    key: 'name',
    header: 'Exam Name'
  },
  {
    key: 'term',
    header: 'Term'
  },
  {
    key: 'weightage',
    header: 'Weightage (%)'
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];

  const data = [
  {
    id: 1,
    name: 'Mid Term Exam',
    term: 'Term 1',
    weightage: 40
  },
  {
    id: 2,
    name: 'Annual Exam',
    term: 'Term 2',
    weightage: 60
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            General Exam Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure exams and their weightage
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Add Exam
        </Button>
      </div>

      <Card className="p-4">
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}