import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Play } from 'lucide-react';
export function GeneralResultGeneration() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Result Generation
          </h1>
          <p className="text-sm text-gray-500">
            Process and calculate final results
          </p>
        </div>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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

          </div>
          <Select
            label="Exam"
            options={[
            {
              value: 'annual',
              label: 'Annual Exam'
            }]
            } />


          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            This process will calculate total marks, grades, percentage, and
            rank for all students in the selected class.
          </div>

          <Button variant="primary" className="w-full">
            <Play className="w-4 h-4 mr-2" /> Generate Results
          </Button>
        </div>
      </Card>
    </div>);

}