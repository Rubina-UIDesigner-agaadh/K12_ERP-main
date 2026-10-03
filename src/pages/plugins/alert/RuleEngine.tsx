import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, PlusIcon, ZapIcon } from 'lucide-react';
export function RuleEngine() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Alert Rule Engine
          </h1>
          <p className="text-sm text-gray-500">
            Define trigger conditions, thresholds and logic for automated alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Rules
          </Button>
        </div>
      </div>
      <Card title="Alert Rules">
        <div className="space-y-4">
          {[
          {
            name: 'Attendance Below 75%',
            condition: 'Student attendance < 75% in any month',
            action: 'Send alert to parent + admin',
            priority: 'High',
            status: true
          },
          {
            name: 'Fee Overdue 30 Days',
            condition: 'Fee unpaid for > 30 days',
            action: 'Send reminder + escalate to principal',
            priority: 'High',
            status: true
          },
          {
            name: 'Bus Deviation Alert',
            condition: 'Vehicle deviates > 500m from route',
            action: 'Alert admin + parent + driver',
            priority: 'Critical',
            status: true
          },
          {
            name: 'Multiple Failed Logins',
            condition: 'Login failed > 5 times in 10 min',
            action: 'Lock account + notify admin',
            priority: 'Critical',
            status: true
          },
          {
            name: 'Low Stock Alert',
            condition: 'Library book stock < 5 copies',
            action: 'Notify librarian',
            priority: 'Low',
            status: false
          }].
          map((rule) =>
          <div
            key={rule.name}
            className="p-4 border border-gray-200 rounded-lg">

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <ZapIcon className="w-4 h-4 text-yellow-500" />
                    <p className="text-sm font-medium text-gray-900">
                      {rule.name}
                    </p>
                    <Badge
                    variant={
                    rule.priority === 'Critical' ?
                    'danger' :
                    rule.priority === 'High' ?
                    'warning' :
                    'info'
                    }>

                      {rule.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    IF: {rule.condition}
                  </p>
                  <p className="text-xs text-gray-500">THEN: {rule.action}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge variant={rule.status ? 'success' : 'warning'}>
                    {rule.status ? 'Active' : 'Inactive'}
                  </Badge>
                  <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  defaultChecked={rule.status} />

                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}