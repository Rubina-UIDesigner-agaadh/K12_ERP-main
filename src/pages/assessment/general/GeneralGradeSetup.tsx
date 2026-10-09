import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Plus } from 'lucide-react';
export function GeneralGradeSetup() {
  const columns = [
  {
    key: 'grade',
    header: 'Grade'
  },
  {
    key: 'min',
    header: 'Min %'
  },
  {
    key: 'max',
    header: 'Max %'
  },
  {
    key: 'points',
    header: 'Grade Points'
  }];

  const data = [
  {
    id: 1,
    grade: 'A1',
    min: 91,
    max: 100,
    points: 10
  },
  {
    id: 2,
    grade: 'A2',
    min: 81,
    max: 90,
    points: 9
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grade Setup</h1>
          <p className="text-sm text-gray-500">
            Define grading scale and points
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Add Grade Range
        </Button>
      </div>

      <Card className="p-4">
        <Table columns={columns} data={data} />
      </Card>
    </div>);

}