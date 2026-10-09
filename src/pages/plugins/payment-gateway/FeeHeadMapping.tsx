import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Save } from 'lucide-react';
export function FeeHeadMapping() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Head Mapping</h1>
          <p className="text-sm text-gray-500">
            Map fee heads to payment gateway categories for online collection
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Mappings
        </Button>
      </div>
      <Card title="Fee Head to Gateway Mapping">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Fee Head
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Gateway Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Convenience Fee
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Online Enabled
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
              {
                head: 'Tuition Fee',
                category: 'Education',
                conv: '1.5%',
                enabled: true
              },
              {
                head: 'Transport Fee',
                category: 'Transport',
                conv: '1.5%',
                enabled: true
              },
              {
                head: 'Library Fee',
                category: 'Education',
                conv: '1.5%',
                enabled: true
              },
              {
                head: 'Exam Fee',
                category: 'Education',
                conv: '1.5%',
                enabled: false
              },
              {
                head: 'Activity Fee',
                category: 'Miscellaneous',
                conv: '2%',
                enabled: true
              }].
              map((row) =>
              <tr
                key={row.head}
                className="border-b border-gray-100 hover:bg-gray-50">

                  <td className="py-3 px-4 font-medium">{row.head}</td>
                  <td className="py-3 px-4">{row.category}</td>
                  <td className="py-3 px-4">{row.conv}</td>
                  <td className="py-3 px-4">
                    <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    defaultChecked={row.enabled} />

                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={row.enabled ? 'success' : 'warning'}>
                      {row.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}