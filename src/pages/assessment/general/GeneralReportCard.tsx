import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Printer } from 'lucide-react';
export function GeneralReportCard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Card</h1>
          <p className="text-sm text-gray-500">
            Generate and print student report cards
          </p>
        </div>
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
            label="Exam"
            options={[
            {
              value: 'annual',
              label: 'Annual Exam'
            }]
            } />

          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              <Printer className="w-4 h-4 mr-2" /> Print All
            </Button>
          </div>
        </div>

        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-300">
          Select criteria to view report cards
        </div>
      </Card>
    </div>);

}