import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save } from 'lucide-react';
export function OneDriveSharepointSync() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            OneDrive & SharePoint Sync
          </h1>
          <p className="text-sm text-gray-500">
            Sync documents and files with Microsoft OneDrive and SharePoint
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="OneDrive Configuration">
          <div className="space-y-4">
            <Input
              label="OneDrive Root Folder"
              placeholder="Enter folder path..."
              defaultValue="/School Documents" />

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
                label: 'By Year'
              }]
              }
              defaultValue="class" />

            <div className="space-y-3">
              {[
              {
                item: 'Study Materials → OneDrive',
                enabled: true
              },
              {
                item: 'Circulars → OneDrive',
                enabled: true
              },
              {
                item: 'Student Submissions → OneDrive',
                enabled: false
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
        <Card title="SharePoint Configuration">
          <div className="space-y-4">
            <Input
              label="SharePoint Site URL"
              placeholder="https://school.sharepoint.com/sites/..." />

            <Input label="Document Library" defaultValue="School Resources" />
            <div className="space-y-3">
              {[
              {
                item: 'Policy Documents → SharePoint',
                enabled: true
              },
              {
                item: 'Staff Resources → SharePoint',
                enabled: true
              },
              {
                item: 'Admin Documents → SharePoint',
                enabled: false
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
      </div>
    </div>);

}