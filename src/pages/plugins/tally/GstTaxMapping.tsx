import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save } from 'lucide-react';
export function GstTaxMapping() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            GST & Tax Mapping
          </h1>
          <p className="text-sm text-gray-500">
            Configure GST rates and tax ledger mappings for Tally integration
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Mappings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="GST Configuration">
          <div className="space-y-4">
            <Input label="GSTIN" defaultValue="24AABCS1234A1Z5" />
            <Select
              label="GST Registration Type"
              options={[
              {
                value: 'regular',
                label: 'Regular'
              },
              {
                value: 'composition',
                label: 'Composition'
              },
              {
                value: 'exempt',
                label: 'Exempt'
              }]
              }
              defaultValue="exempt" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Educational Institution Exemption
                </p>
                <p className="text-xs text-gray-500">
                  Apply GST exemption for educational services
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>
        <Card title="Tax Ledger Mapping">
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Tax Type
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Rate
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Tally Ledger
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                  {
                    type: 'CGST',
                    rate: '9%',
                    ledger: 'CGST Payable'
                  },
                  {
                    type: 'SGST',
                    rate: '9%',
                    ledger: 'SGST Payable'
                  },
                  {
                    type: 'IGST',
                    rate: '18%',
                    ledger: 'IGST Payable'
                  },
                  {
                    type: 'TDS',
                    rate: '10%',
                    ledger: 'TDS Payable'
                  }].
                  map((row) =>
                  <tr
                    key={row.type}
                    className="border-b border-gray-100 hover:bg-gray-50">

                      <td className="py-2 px-3 font-medium">{row.type}</td>
                      <td className="py-2 px-3">{row.rate}</td>
                      <td className="py-2 px-3">{row.ledger}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}