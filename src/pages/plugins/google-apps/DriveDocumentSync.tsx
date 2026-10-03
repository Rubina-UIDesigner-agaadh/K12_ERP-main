import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, FolderIcon } from 'lucide-react';
export function DriveDocumentSync() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Google Drive & Document Sync
          </h1>
          <p className="text-sm text-gray-500">
            Sync study materials, circulars and documents with Google Drive
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Drive Configuration">
          <div className="space-y-4">
            <Input
              label="Root Folder ID"
              placeholder="Enter Google Drive Folder ID..." />

            <Select
              label="Folder Structure"
              options={[
              {
                value: 'class',
                label: 'By Class'
              },
              {
                value: 'subject',
                label: 'By Subject'
              },
              {
                value: 'year',
                label: 'By Academic Year'
              }]
              }
              defaultValue="class" />

            <div className="space-y-3">
              {[
              {
                item: 'Study Materials → Drive',
                enabled: true
              },
              {
                item: 'Circulars → Drive',
                enabled: true
              },
              {
                item: 'Exam Papers → Drive',
                enabled: false
              },
              {
                item: 'Report Cards → Drive',
                enabled: true
              },
              {
                item: 'Student Submissions → Drive',
                enabled: true
              }].
              map((s) =>
              <div
                key={s.item}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                  <span className="text-sm text-gray-900">{s.item}</span>
                  <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  defaultChecked={s.enabled} />

                </div>
              )}
            </div>
          </div>
        </Card>
        <Card title="Drive Storage Status">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Storage Used
                </span>
                <span className="text-sm font-bold text-blue-800">
                  48.2 GB / 100 GB
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width: '48%'
                  }} />

              </div>
              <p className="text-xs text-blue-600 mt-1">48% used</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Study Materials</span>
                <span className="font-medium">18.4 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Circulars & Docs</span>
                <span className="font-medium">8.2 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Student Submissions</span>
                <span className="font-medium">21.6 GB</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}