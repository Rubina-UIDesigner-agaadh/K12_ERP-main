import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Input } from '../../../components/ui/Input';
import { Save } from 'lucide-react';
export function GeneralPracticalEntry() {
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
    key: 'marks',
    header: 'Practical Marks',
    render: () => <Input className="w-24" />
  }];

  const data = [
  {
    id: 1,
    roll: '101',
    name: 'Rahul Sharma'
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Practical Mark Entry
          </h1>
          <p className="text-sm text-gray-500">Enter practical exam scores</p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" /> Save
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            label="Subject"
            options={[
            {
              value: 'sci',
              label: 'Science'
            }]
            } />

        </div>
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}