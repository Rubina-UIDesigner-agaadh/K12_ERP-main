import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MapPinIcon, RefreshCwIcon, NavigationIcon } from 'lucide-react';
export function LiveTrackingDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Live Tracking Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Real-time GPS tracking of all school transport vehicles
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
            {
              value: 'all',
              label: 'All Vehicles'
            },
            {
              value: 'route-a',
              label: 'Route A'
            },
            {
              value: 'route-b',
              label: 'Route B'
            }]
            }
            defaultValue="all" />

          <Button variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-green-600">21</p>
            <p className="text-sm text-gray-500">Vehicles On Route</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-500">At School</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">2</p>
            <p className="text-sm text-gray-500">Delayed</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-red-600">1</p>
            <p className="text-sm text-gray-500">Off Route Alert</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Live Map">
            <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-500">
                <NavigationIcon className="w-16 h-16 mx-auto mb-3 text-blue-400" />
                <p className="font-medium text-gray-700">Live GPS Map</p>
                <p className="text-sm">
                  Real-time vehicle positions displayed here
                </p>
                <p className="text-xs mt-2 text-gray-400">
                  Updates every 10 seconds
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Vehicle Status">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">GJ-01-AB-1234</p>
                  <p className="text-xs text-gray-500">
                    Route A • Driver: Ramesh
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Near: Sector 12 Stop
                  </p>
                </div>
                <Badge variant="success">On Route</Badge>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Speed: 35 km/h • ETA: 8 min
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">GJ-01-CD-5678</p>
                  <p className="text-xs text-gray-500">
                    Route B • Driver: Suresh
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Near: Market Area
                  </p>
                </div>
                <Badge variant="warning">Delayed</Badge>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Speed: 12 km/h • ETA: 22 min
              </div>
            </div>
            <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">GJ-01-EF-9012</p>
                  <p className="text-xs text-gray-500">
                    Route C • Driver: Mahesh
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    ⚠ Off designated route
                  </p>
                </div>
                <Badge variant="danger">Alert</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}