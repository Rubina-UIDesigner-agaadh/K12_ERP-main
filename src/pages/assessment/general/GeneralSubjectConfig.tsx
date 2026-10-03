import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Save } from 'lucide-react';
export function GeneralSubjectConfig() {
  const columns = [
  {
    key: 'subject',
    header: 'Subject'
  },
  {
    key: 'theory',
    header: 'Theory Max Marks'
  },
  {
    key: 'practical',
    header: 'Practical Max Marks'
  },
  {
    key: 'internal',
    header: 'Internal Max Marks'
  }];

  const data = [
  {
    id: 1,
    subject: 'Mathematics',
    theory: '80',
    practical: '0',
    internal: '20'
  },
  {
    id: 2,
    subject: 'Science',
    theory: '70',
    practical: '20',
    internal: '10'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subject Configuration
          </h1>
          <p className="text-sm text-gray-500">
            Set max marks for theory, practical and internal assessment
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" /> Save Configuration
        </Button>
      </div>

      <Card className="p-4">
        <div className="mb-6 w-64">
          <Select
            label="Select Class"
            options={[
            {
              value: '10',
              label: 'Class 10'
            }]
            } />

        </div>
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}