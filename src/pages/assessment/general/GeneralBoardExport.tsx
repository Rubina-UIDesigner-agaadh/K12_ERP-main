import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Download } from 'lucide-react';
export function GeneralBoardExport() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Board Submission Export
          </h1>
          <p className="text-sm text-gray-500">
            Export data for board submission
          </p>
        </div>
      </div>

      <Card className="p-6 max-w-xl mx-auto">
        <div className="space-y-6">
          <Select
            label="Class"
            options={[
            {
              value: '10',
              label: 'Class 10'
            }]
            } />

          <Select
            label="Format"
            options={[
            {
              value: 'excel',
              label: 'Excel'
            },
            {
              value: 'xml',
              label: 'XML'
            }]
            } />

          <Button variant="primary" className="w-full">
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
        </div>
      </Card>
    </div>);

}