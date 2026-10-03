import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Save, PlusIcon, ArrowUpIcon } from 'lucide-react';
export function EscalationAutomation() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Escalation & Automation
          </h1>
          <p className="text-sm text-gray-500">
            Configure alert escalation paths and automated follow-up actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Escalation
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Rules
          </Button>
        </div>
      </div>
      <Card title="Escalation Matrix">
        <div className="space-y-4">
          {[
          {
            alert: 'Student Absent',
            levels: [
            {
              level: 1,
              action: 'Notify Parent via SMS/WhatsApp',
              delay: 'Immediate',
              assignee: 'Parent'
            },
            {
              level: 2,
              action: 'Notify Class Teacher',
              delay: '2 hours if no response',
              assignee: 'Class Teacher'
            },
            {
              level: 3,
              action: 'Escalate to Principal',
              delay: '1 day if unresolved',
              assignee: 'Principal'
            }]

          },
          {
            alert: 'Fee Overdue',
            levels: [
            {
              level: 1,
              action: 'Send reminder to parent',
              delay: 'Day 1',
              assignee: 'Parent'
            },
            {
              level: 2,
              action: 'Notify accounts team',
              delay: 'Day 7',
              assignee: 'Accounts'
            },
            {
              level: 3,
              action: 'Escalate to Principal',
              delay: 'Day 30',
              assignee: 'Principal'
            }]

          }].
          map((matrix) =>
          <div
            key={matrix.alert}
            className="border border-gray-200 rounded-lg overflow-hidden">

              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-bold text-gray-900">
                  {matrix.alert}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {matrix.levels.map((level) =>
              <div key={level.level} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">
                        {level.level}
                      </span>
                    </div>
                    <div className="flex-1 text-sm">
                      <span className="font-medium">{level.action}</span>
                      <span className="text-gray-500 ml-2">
                        ({level.delay})
                      </span>
                    </div>
                    <Badge variant="info">{level.assignee}</Badge>
                  </div>
              )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}