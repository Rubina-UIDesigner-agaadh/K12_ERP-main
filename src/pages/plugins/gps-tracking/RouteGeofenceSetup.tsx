import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { PlusIcon, MapPinIcon, Save } from 'lucide-react';
export function RouteGeofenceSetup() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Route & Geo-Fence Setup
          </h1>
          <p className="text-sm text-gray-500">
            Define transport routes, stops and geo-fence boundaries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Route
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Route Map">
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">
                  Route visualization and geo-fence editor
                </p>
                <p className="text-xs mt-1 text-gray-400">
                  Connect GPS integration to enable live map
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Route Configuration">
            <div className="space-y-3">
              <Input label="Route Name" defaultValue="Route A - North Zone" />
              <Select
                label="Assigned Vehicle"
                options={[
                {
                  value: 'v1',
                  label: 'GJ-01-AB-1234 (Bus)'
                },
                {
                  value: 'v2',
                  label: 'GJ-01-CD-5678 (Van)'
                }]
                }
                defaultValue="v1" />

              <Input label="Start Point" placeholder="School Address" />
              <Input label="End Point" placeholder="Last Stop" />
              <Input
                label="Geo-fence Radius (meters)"
                type="number"
                defaultValue="200" />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  defaultChecked />

                <label className="text-sm text-gray-700">
                  Enable geo-fence alerts
                </label>
              </div>
            </div>
          </Card>

          <Card title="Stops">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <MapPinIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Stop 1: Main Gate</span>
                <Badge variant="success" className="ml-auto">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <MapPinIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Stop 2: Sector 12</span>
                <Badge variant="success" className="ml-auto">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <MapPinIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Stop 3: Market Area</span>
                <Badge variant="success" className="ml-auto">
                  Active
                </Badge>
              </div>
              <Button variant="outline" className="w-full text-sm">
                + Add Stop
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}