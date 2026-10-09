import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon, RefreshCwIcon, PrinterIcon } from 'lucide-react';
export function CodeGenerator() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Code Generator</h1>
          <p className="text-sm text-gray-500">
            Generate QR codes and barcodes in bulk or individually
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print Batch
          </Button>
          <Button variant="primary">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setMode('single')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'single' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

          Single Generator
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'bulk' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

          Bulk Generator
        </button>
      </div>

      {mode === 'single' ?
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Code Settings">
            <div className="space-y-4">
              <Select
              label="Code Type"
              options={[
              {
                value: 'qr',
                label: 'QR Code'
              },
              {
                value: 'barcode128',
                label: 'Barcode (Code 128)'
              },
              {
                value: 'ean13',
                label: 'Barcode (EAN-13)'
              }]
              }
              defaultValue="qr" />

              <Select
              label="Entity Type"
              options={[
              {
                value: 'student',
                label: 'Student'
              },
              {
                value: 'staff',
                label: 'Staff'
              },
              {
                value: 'asset',
                label: 'Asset'
              },
              {
                value: 'library',
                label: 'Library Item'
              }]
              }
              defaultValue="student" />

              <Input
              label="Entity ID / Reference"
              placeholder="Enter ID or scan existing..." />

              <Select
              label="Size"
              options={[
              {
                value: 'small',
                label: 'Small (50x50px)'
              },
              {
                value: 'medium',
                label: 'Medium (100x100px)'
              },
              {
                value: 'large',
                label: 'Large (200x200px)'
              }]
              }
              defaultValue="medium" />

              <div className="flex items-center gap-2">
                <input
                type="checkbox"
                id="include-label"
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                defaultChecked />

                <label
                htmlFor="include-label"
                className="text-sm text-gray-700">

                  Include text label below code
                </label>
              </div>
              <Button variant="primary" className="w-full">
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
            </div>
          </Card>
          <Card title="Preview">
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-32 h-32 bg-white border border-gray-300 rounded flex items-center justify-center">
                <div className="grid grid-cols-5 gap-0.5 p-2">
                  {Array.from({
                  length: 25
                }).map((_, i) =>
                <div
                  key={i}
                  className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />

                )}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">STU-2024-001</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="w-3 h-3 mr-1" />
                  PNG
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="w-3 h-3 mr-1" />
                  SVG
                </Button>
                <Button variant="outline" size="sm">
                  <PrinterIcon className="w-3 h-3 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </Card>
        </div> :

      <Card title="Bulk Generation Settings">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
              label="Entity Type"
              options={[
              {
                value: 'student',
                label: 'All Students'
              },
              {
                value: 'staff',
                label: 'All Staff'
              },
              {
                value: 'asset',
                label: 'All Assets'
              }]
              }
              defaultValue="student" />

              <Select
              label="Class / Department Filter"
              options={[
              {
                value: 'all',
                label: 'All Classes'
              },
              {
                value: 'class10',
                label: 'Class 10'
              },
              {
                value: 'class11',
                label: 'Class 11'
              }]
              }
              defaultValue="all" />

              <Select
              label="Code Format"
              options={[
              {
                value: 'qr',
                label: 'QR Code'
              },
              {
                value: 'barcode',
                label: 'Barcode'
              }]
              }
              defaultValue="qr" />

              <Select
              label="Output Format"
              options={[
              {
                value: 'pdf',
                label: 'PDF (Print Ready)'
              },
              {
                value: 'zip',
                label: 'ZIP (Individual PNGs)'
              },
              {
                value: 'excel',
                label: 'Excel with Codes'
              }]
              }
              defaultValue="pdf" />

            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">
                Estimated: 1,248 codes will be generated
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Estimated time: ~2 minutes
              </p>
            </div>
            <Button variant="primary">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Start Bulk Generation
            </Button>
          </div>
        </Card>
      }
    </div>);

}