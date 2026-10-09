import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  QrCodeIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon } from
'lucide-react';
export function QrBarcodeMaster() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            QR / Barcode Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage QR code and barcode configurations for all entities
          </p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Code Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <QrCodeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
              <p className="text-sm text-gray-500">Total QR Codes</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <QrCodeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">856</p>
              <p className="text-sm text-gray-500">Active Barcodes</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 p-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <QrCodeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">Code Types Configured</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Code Type Configuration">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Search code types..." className="flex-1" />
            <Select
              options={[
              {
                value: 'all',
                label: 'All Types'
              },
              {
                value: 'qr',
                label: 'QR Code'
              },
              {
                value: 'barcode',
                label: 'Barcode'
              }]
              }
              defaultValue="all" />

          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Code Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Format
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Entity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Student ID QR</td>
                  <td className="py-3 px-4">QR Code v2</td>
                  <td className="py-3 px-4">Student</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Staff Badge Barcode</td>
                  <td className="py-3 px-4">Code 128</td>
                  <td className="py-3 px-4">Staff</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">
                    Library Book Barcode
                  </td>
                  <td className="py-3 px-4">EAN-13</td>
                  <td className="py-3 px-4">Library</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Asset Tag QR</td>
                  <td className="py-3 px-4">QR Code v3</td>
                  <td className="py-3 px-4">Asset</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Inactive</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>);

}