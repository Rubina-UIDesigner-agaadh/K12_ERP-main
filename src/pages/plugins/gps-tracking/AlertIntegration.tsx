import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Save, BellIcon } from 'lucide-react';
export function AlertIntegration() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Alert Integration
          </h1>
          <p className="text-sm text-gray-500">
            Configure delay, deviation and safety alerts for transport
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Save Alert Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Delay Alerts">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable Delay Alerts</p>
                <p className="text-xs text-gray-500">
                  Notify when vehicle is delayed beyond threshold
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input
              label="Delay Threshold (minutes)"
              type="number"
              defaultValue="10" />

            <Select
              label="Notify"
              options={[
              {
                value: 'parent',
                label: 'Parents Only'
              },
              {
                value: 'admin',
                label: 'Admin Only'
              },
              {
                value: 'both',
                label: 'Parents & Admin'
              }]
              }
              defaultValue="both" />

            <Select
              label="Notification Channel"
              options={[
              {
                value: 'sms',
                label: 'SMS'
              },
              {
                value: 'whatsapp',
                label: 'WhatsApp'
              },
              {
                value: 'app',
                label: 'Mobile App'
              },
              {
                value: 'all',
                label: 'All Channels'
              }]
              }
              defaultValue="all" />

          </div>
        </Card>

        <Card title="Route Deviation Alerts">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable Deviation Alerts</p>
                <p className="text-xs text-gray-500">
                  Alert when vehicle leaves defined route
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input
              label="Deviation Tolerance (meters)"
              type="number"
              defaultValue="500" />

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto-Alert Driver</p>
                <p className="text-xs text-gray-500">
                  Send alert to driver's device on deviation
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">SOS / Emergency Alert</p>
                <p className="text-xs text-gray-500">
                  Enable panic button on driver's device
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>

        <Card title="Boarding / Deboarding Alerts">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Notify Parent on Boarding</p>
                <p className="text-xs text-gray-500">
                  Send message when child boards the bus
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Notify Parent on Deboarding
                </p>
                <p className="text-xs text-gray-500">
                  Send message when child gets off the bus
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  Alert if Child Not Boarded
                </p>
                <p className="text-xs text-gray-500">
                  Notify parent if child misses the bus
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
          </div>
        </Card>

        <Card title="Speed Alerts">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Over-Speed Alert</p>
                <p className="text-xs text-gray-500">
                  Alert when vehicle exceeds speed limit
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded border-gray-300"
                defaultChecked />

            </div>
            <Input label="Speed Limit (km/h)" type="number" defaultValue="60" />
            <Select
              label="Alert Recipients"
              options={[
              {
                value: 'admin',
                label: 'Admin'
              },
              {
                value: 'driver',
                label: 'Driver'
              },
              {
                value: 'both',
                label: 'Admin & Driver'
              }]
              }
              defaultValue="both" />

          </div>
        </Card>
      </div>
    </div>);

}