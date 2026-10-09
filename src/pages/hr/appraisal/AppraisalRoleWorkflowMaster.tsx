import React, { useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Shield,
  UserCheck,
  Settings,
  GitBranch,
  AlertCircle,
  Eye } from
'lucide-react';
interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  role: string;
  action: string;
  deadline: string;
  canSkip: boolean;
  autoEscalate: boolean;
  escalateAfterHours: number;
}
interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft';
  applicableTo: string;
  steps: WorkflowStep[];
  usedIn: number;
}
const mockWorkflows: Workflow[] = [
{
  id: 'WF001',
  name: 'Standard Teaching Staff Workflow',
  description: 'Full 5-step appraisal process for teaching staff',
  status: 'Active',
  applicableTo: 'Teaching Staff',
  usedIn: 2,
  steps: [
  {
    id: 'S1',
    order: 1,
    name: 'Self Appraisal',
    role: 'Employee',
    action: 'Complete self-assessment form',
    deadline: '14 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 336
  },
  {
    id: 'S2',
    order: 2,
    name: 'Student Feedback',
    role: 'Students',
    action: 'Submit anonymous feedback',
    deadline: '7 days',
    canSkip: true,
    autoEscalate: false,
    escalateAfterHours: 0
  },
  {
    id: 'S3',
    order: 3,
    name: 'Peer Review',
    role: 'Peer Teachers',
    action: 'Submit peer feedback',
    deadline: '7 days',
    canSkip: true,
    autoEscalate: false,
    escalateAfterHours: 0
  },
  {
    id: 'S4',
    order: 4,
    name: 'Manager Review',
    role: 'HOD / Manager',
    action: 'Review and rate employee',
    deadline: '14 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 336
  },
  {
    id: 'S5',
    order: 5,
    name: 'Calibration & Publish',
    role: 'Principal / HR',
    action: 'Calibrate scores and publish results',
    deadline: '7 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 168
  }]

},
{
  id: 'WF002',
  name: 'Admin Staff Simplified Workflow',
  description: '3-step simplified process for administrative staff',
  status: 'Active',
  applicableTo: 'Administrative Staff',
  usedIn: 1,
  steps: [
  {
    id: 'S1',
    order: 1,
    name: 'Self Appraisal',
    role: 'Employee',
    action: 'Complete self-assessment',
    deadline: '14 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 336
  },
  {
    id: 'S2',
    order: 2,
    name: 'Manager Review',
    role: 'Department Head',
    action: 'Review and rate',
    deadline: '14 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 336
  },
  {
    id: 'S3',
    order: 3,
    name: 'HR Approval',
    role: 'HR Head',
    action: 'Final approval and publish',
    deadline: '7 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 168
  }]

},
{
  id: 'WF003',
  name: 'Probation Review Workflow',
  description: 'Quick review for employees on probation',
  status: 'Draft',
  applicableTo: 'Probation Employees',
  usedIn: 0,
  steps: [
  {
    id: 'S1',
    order: 1,
    name: 'Self Assessment',
    role: 'Employee',
    action: 'Complete probation self-review',
    deadline: '7 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 168
  },
  {
    id: 'S2',
    order: 2,
    name: 'Manager Assessment',
    role: 'Reporting Manager',
    action: 'Evaluate probation performance',
    deadline: '7 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 168
  },
  {
    id: 'S3',
    order: 3,
    name: 'HR Decision',
    role: 'HR Head',
    action: 'Confirm / Extend / Terminate',
    deadline: '3 days',
    canSkip: false,
    autoEscalate: true,
    escalateAfterHours: 72
  }]

}];

const roleIcon = (role: string) => {
  if (role.includes('Employee'))
  return <Users className="w-4 h-4 text-blue-500" />;
  if (role.includes('Student'))
  return <Users className="w-4 h-4 text-green-500" />;
  if (role.includes('Peer'))
  return <UserCheck className="w-4 h-4 text-purple-500" />;
  if (role.includes('Manager') || role.includes('HOD') || role.includes('Head'))
  return <Shield className="w-4 h-4 text-amber-500" />;
  return <Shield className="w-4 h-4 text-red-500" />;
};
const roleColor = (role: string) => {
  if (role.includes('Employee')) return 'from-blue-500 to-blue-600';
  if (role.includes('Student')) return 'from-green-500 to-green-600';
  if (role.includes('Peer')) return 'from-purple-500 to-purple-600';
  if (role.includes('Manager') || role.includes('HOD') || role.includes('Head'))
  return 'from-amber-500 to-amber-600';
  return 'from-red-500 to-red-600';
};
export function AppraisalRoleWorkflowMaster() {
  const [workflows] = useState(mockWorkflows);
  const [expandedWf, setExpandedWf] = useState<string | null>('WF001');
  const [search, setSearch] = useState('');
  const filtered = workflows.filter((w) =>
  w.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appraisal Role & Workflow Master
          </h1>
          <p className="text-sm text-gray-500">
            Design multi-step approval workflows for appraisal processes
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{workflows.length}</p>
            <p className="text-xs text-gray-500">Workflows</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {workflows.filter((w) => w.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {workflows.reduce((s, w) => s + w.steps.length, 0)}
            </p>
            <p className="text-xs text-gray-500">Total Steps</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search workflows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

      </div>

      <div className="space-y-4">
        {filtered.map((wf) =>
        <Card key={wf.id}>
            <button
            onClick={() => setExpandedWf(expandedWf === wf.id ? null : wf.id)}
            className="w-full flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {wf.name}
                  </h3>
                  <p className="text-sm text-gray-500">{wf.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {wf.status === 'Active' ?
                  <Badge variant="success">Active</Badge> :

                  <Badge variant="secondary">Draft</Badge>
                  }
                    <Badge variant="secondary">{wf.applicableTo}</Badge>
                    <span className="text-xs text-gray-500">
                      {wf.steps.length} steps · Used in {wf.usedIn} cycles
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                className="p-1.5 hover:bg-blue-100 rounded-lg"
                title="Edit">

                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                className="p-1.5 hover:bg-red-100 rounded-lg"
                title="Delete">

                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </button>

            {expandedWf === wf.id &&
          <div className="mt-4 pt-4 border-t border-gray-200">
                {/* Visual Flow */}
                <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto py-2">
                  {wf.steps.map((step, i) =>
              <Fragment key={step.id}>
                      <div className="flex flex-col items-center min-w-[120px]">
                        <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColor(step.role)} text-white flex items-center justify-center text-sm font-bold shadow-md`}>

                          {step.order}
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-2 text-center">
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                          {step.role}
                        </p>
                      </div>
                      {i < wf.steps.length - 1 &&
                <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                }
                    </Fragment>
              )}
                </div>

                {/* Detail Table */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 w-12">
                        #
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Step Name
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Assigned Role
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">
                        Action Required
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">
                        Deadline
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">
                        Skippable
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">
                        Auto Escalate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wf.steps.map((step) =>
                <tr
                  key={step.id}
                  className="border-b border-gray-100 hover:bg-gray-50">

                        <td className="py-3 px-3 text-center">
                          <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white bg-gradient-to-br ${roleColor(step.role)}`}>

                            {step.order}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm font-medium text-gray-900">
                          {step.name}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {roleIcon(step.role)}
                            <span className="text-sm text-gray-700">
                              {step.role}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">
                          {step.action}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {step.deadline}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {step.canSkip ?
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                              Yes
                            </span> :

                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              No
                            </span>
                    }
                        </td>
                        <td className="py-3 px-3 text-center">
                          {step.autoEscalate ?
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                              {step.escalateAfterHours}h
                            </span> :

                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              Off
                            </span>
                    }
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
          }
          </Card>
        )}
      </div>
    </div>);

}