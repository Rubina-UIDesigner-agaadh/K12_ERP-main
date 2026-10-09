import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Eye } from 'lucide-react';
export function GeneralResultView() {
  const columns = [
  {
    key: 'roll',
    header: 'Roll No'
  },
  {
    key: 'name',
    header: 'Student Name'
  },
  {
    key: 'total',
    header: 'Total Marks'
  },
  {
    key: 'percent',
    header: 'Percentage'
  },
  {
    key: 'grade',
    header: 'Final Grade'
  },
  {
    key: 'result',
    header: 'Result'
  },
  {
    key: 'action',
    header: 'View',
    render: () =>
    <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>

  }];

  const data = [
  {
    id: 1,
    roll: '101',
    name: 'Rahul Sharma',
    total: 450,
    percent: '90%',
    grade: 'A1',
    result: 'PASS'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Result View</h1>
          <p className="text-sm text-gray-500">View generated results</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Class"
            options={[
            {
              value: '10',
              label: 'Class 10'
            }]
            } />

          <Select
            label="Section"
            options={[
            {
              value: 'A',
              label: 'A'
            }]
            } />

          <Select
            label="Exam"
            options={[
            {
              value: 'annual',
              label: 'Annual Exam'
            }]
            } />

        </div>
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}