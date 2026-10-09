import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { BarChart3 } from 'lucide-react';
export function GeneralPerformanceAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Performance Analysis
          </h1>
          <p className="text-sm text-gray-500">
            Analyze class and student performance
          </p>
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
            label="Subject"
            options={[
            {
              value: 'math',
              label: 'Mathematics'
            }]
            } />

        </div>

        <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <p>Performance Chart Placeholder</p>
          </div>
        </div>
      </Card>
    </div>);

}