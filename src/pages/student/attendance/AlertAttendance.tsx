import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Bell, Plus, Edit2, Trash2, ToggleRight, Building2, ChevronDown, X, Check } from 'lucide-react';

// School Branches
const BRANCHES = [
{ value: 'pre-primary', label: 'Pre-Primary (Nursery-KG)', code: 'PP', color: 'bg-pink-500' },
{ value: 'primary', label: 'Primary (Class 1-5)', code: 'PRI', color: 'bg-blue-500' },
{ value: 'middle', label: 'Middle School (Class 6-8)', code: 'MID', color: 'bg-green-500' },
{ value: 'secondary', label: 'Secondary (Class 9-10)', code: 'SEC', color: 'bg-purple-500' },
{ value: 'senior', label: 'Senior Secondary (Class 11-12)', code: 'SR', color: 'bg-orange-500' }];


const ALERTS_DATA = [
{ id: '1', name: 'Absent Notification', trigger: 'Daily Absent', recipients: 'Parent (SMS)', template: 'Dear Parent, your ward is absent today.', status: 'Active', branch: 'pre-primary' },
{ id: '2', name: 'Low Attendance Warning', trigger: 'Attendance < 75%', recipients: 'Parent (Email), Student (App)', template: 'Warning: Attendance below mandatory limit.', status: 'Active', branch: 'primary' },
{ id: '3', name: 'Late Arrival', trigger: 'Late > 3 times/month', recipients: 'Parent (SMS)', template: 'Your ward has arrived late multiple times.', status: 'Inactive', branch: 'middle' },
{ id: '4', name: 'Weekly Report', trigger: 'Every Friday', recipients: 'Parent (Email)', template: 'Weekly attendance summary for your ward.', status: 'Active', branch: 'secondary' },
{ id: '5', name: 'Consecutive Absence', trigger: '3+ Days Absent', recipients: 'Parent (SMS), Class Teacher (App)', template: 'Alert: Student absent for 3+ consecutive days.', status: 'Active', branch: 'senior' },
{ id: '6', name: 'Monthly Summary', trigger: 'Month End', recipients: 'Parent (Email)', template: 'Monthly attendance report attached.', status: 'Inactive', branch: 'primary' },
{ id: '7', name: 'Early Departure Alert', trigger: 'Left Early', recipients: 'Parent (SMS)', template: 'Your ward left school before regular hours.', status: 'Active', branch: 'pre-primary' },
{ id: '8', name: 'Perfect Attendance', trigger: '100% Monthly', recipients: 'Student (App)', template: 'Congratulations on perfect attendance!', status: 'Active', branch: 'middle' },
{ id: '9', name: 'Half Day Alert', trigger: 'Half Day Marked', recipients: 'Parent (SMS)', template: 'Your ward was marked half day today.', status: 'Active', branch: 'secondary' },
{ id: '10', name: 'Medical Leave Update', trigger: 'Medical Leave Applied', recipients: 'Class Teacher (App)', template: 'Medical leave application received.', status: 'Active', branch: 'senior' }];


// Helpers
const getBranch = (v: string) => BRANCHES.find((b) => b.value === v);
const getBranchLabel = (v: string) => getBranch(v)?.label || v;
const getBranchCode = (v: string) => getBranch(v)?.code || v;
const getBranchColor = (v: string) => getBranch(v)?.color || 'bg-gray-500';

export function AlertAttendanceNotifications() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [collapsedBranches, setCollapsedBranches] = useState<string[]>([]);

  const toggleBranch = (v: string) => setSelectedBranches((prev) => prev.includes(v) ? prev.filter((b) => b !== v) : [...prev, v]);
  const toggleCollapse = (b: string) => setCollapsedBranches((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const filteredAlerts = useMemo(() =>
  selectedBranches.length === 0 ? ALERTS_DATA : ALERTS_DATA.filter((a) => selectedBranches.includes(a.branch)),
  [selectedBranches]);

  const groupedByBranch = useMemo(() => {
    const groups: Record<string, typeof ALERTS_DATA> = {};
    filteredAlerts.forEach((alert) => {
      if (!groups[alert.branch]) groups[alert.branch] = [];
      groups[alert.branch].push(alert);
    });
    return groups;
  }, [filteredAlerts]);

  const branchStats = useMemo(() => {
    const stats: Record<string, {total: number;active: number;inactive: number;}> = {};
    Object.entries(groupedByBranch).forEach(([branch, alerts]) => {
      stats[branch] = {
        total: alerts.length,
        active: alerts.filter((a) => a.status === 'Active').length,
        inactive: alerts.filter((a) => a.status === 'Inactive').length
      };
    });
    return stats;
  }, [groupedByBranch]);

  const columns = [
  { key: 'name', header: 'Alert Name', render: (row: any) => <span className="font-medium text-gray-900">{row.name}</span> },
  { key: 'trigger', header: 'Trigger Condition', render: (row: any) => <span className="text-sm text-gray-600">{row.trigger}</span> },
  { key: 'recipients', header: 'Recipients', render: (row: any) => <span className="text-sm text-blue-600">{row.recipients}</span> },
  { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
  { key: 'actions', header: 'Actions', render: () =>
    <div className="flex gap-2">
        <Button variant="ghost" size="sm" title="Edit"><Edit2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" title="Toggle"><ToggleRight className="w-4 h-4 text-gray-600" /></Button>
        <Button variant="ghost" size="sm" title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></Button>
      </div>
  }];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Alerts</h1>
            <p className="text-sm text-gray-500">Configure automated alerts for attendance events</p>
          </div>
        </div>
        <Button variant="primary"><Plus className="w-4 h-4 mr-2" />Create Alert</Button>
      </div>

      {/* Branch Selection */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Branch:</span>
          </div>
          
          {/* Multi-select Branch Dropdown */}
          <div className="relative">
            <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white min-w-[220px] hover:border-blue-400 transition-colors">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="flex-1 text-left text-gray-700">
                {selectedBranches.length === 0 ? 'All Branches' : selectedBranches.length === BRANCHES.length ? 'All Selected' : `${selectedBranches.length} Branch(es)`}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showBranchDropdown &&
            <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBranchDropdown(false)} />
                <div className="absolute z-20 w-72 mt-1 bg-white border rounded-lg shadow-lg">
                  <div className="p-2 border-b flex justify-between">
                    <button onClick={() => setSelectedBranches(BRANCHES.map((b) => b.value))} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Select All</button>
                    <button onClick={() => setSelectedBranches([])} className="text-xs text-gray-500 hover:text-gray-700">Clear All</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {BRANCHES.map((branch) =>
                  <label key={branch.value} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => toggleBranch(branch.value)}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedBranches.includes(branch.value) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                          {selectedBranches.includes(branch.value) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`w-3 h-3 rounded-full ${branch.color}`}></span>
                        <span className="text-sm text-gray-700">{branch.label}</span>
                      </label>
                  )}
                  </div>
                  <div className="p-2 border-t">
                    <button onClick={() => setShowBranchDropdown(false)} className="w-full py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Done</button>
                  </div>
                </div>
              </>
            }
          </div>

          {/* Selected Branch Tags */}
          {selectedBranches.length > 0 && selectedBranches.length < BRANCHES.length &&
          <div className="flex flex-wrap gap-1">
              {selectedBranches.map((b) =>
            <span key={b} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getBranchColor(b)}`}>
                  {getBranchCode(b)}
                  <button onClick={() => toggleBranch(b)} className="hover:bg-white/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </span>
            )}
            </div>
          }

          {selectedBranches.length > 0 &&
          <button onClick={() => setSelectedBranches([])} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
              <X className="w-4 h-4" />Reset
            </button>
          }

          <div className="ml-auto text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{filteredAlerts.length}</span> alerts across 
            <span className="font-semibold text-blue-600 ml-1">{Object.keys(groupedByBranch).length}</span> branch(es)
          </div>
        </div>
      </Card>

      {/* Branch Overview Cards */}
      {Object.keys(branchStats).length > 0 &&
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(branchStats).map(([branch, stat]) =>
        <Card key={branch} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-4 h-4 rounded-full ${getBranchColor(branch)}`}></span>
                <span className="text-sm font-medium text-gray-700">{getBranchCode(branch)}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.total}</div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-600 font-medium">{stat.active} Active</span>
                <span className="text-gray-400">{stat.inactive} Inactive</span>
              </div>
            </Card>
        )}
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch-wise Alerts */}
        <div className="lg:col-span-2 space-y-4">
          {Object.keys(groupedByBranch).length > 0 ?
          Object.entries(groupedByBranch).map(([branch, branchAlerts]) =>
          <Card key={branch} className="overflow-hidden" noPadding>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleCollapse(branch)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getBranchColor(branch)}`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{getBranchLabel(branch)}</h3>
                        <p className="text-xs text-gray-500">{branchAlerts.length} alert(s) configured</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">{branchStats[branch]?.active || 0} Active</Badge>
                      {(branchStats[branch]?.inactive || 0) > 0 && <Badge variant="secondary">{branchStats[branch].inactive} Inactive</Badge>}
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${collapsedBranches.includes(branch) ? '' : 'rotate-180'}`} />
                    </div>
                  </div>
                </div>
                {!collapsedBranches.includes(branch) && <Table columns={columns} data={branchAlerts} />}
              </Card>
          ) :

          <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500">Try selecting different branches.</p>
            </Card>
          }

          {/* Summary Card */}
          {filteredAlerts.length > 0 &&
          <Card className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Alert Summary</h3>
                  <p className="text-gray-400 text-sm">{filteredAlerts.length} total alerts configured</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{filteredAlerts.filter((a) => a.status === 'Active').length}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{filteredAlerts.filter((a) => a.status === 'Inactive').length}</p>
                    <p className="text-xs text-gray-400">Inactive</p>
                  </div>
                  <div className="text-center border-l border-gray-600 pl-6">
                    <p className="text-2xl font-bold">{Object.keys(groupedByBranch).length}</p>
                    <p className="text-xs text-gray-400">Branches</p>
                  </div>
                </div>
              </div>
            </Card>
          }
        </div>

        {/* Quick Configuration */}
        <div className="space-y-4">
          <Card title="Quick Configuration">
            <div className="space-y-4 p-4">
              {/* Branch Selection for New Alert */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
                <label className="text-xs font-semibold text-blue-700 uppercase flex items-center gap-2">
                  <Building2 className="w-4 h-4" />Target Branch(es)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {BRANCHES.map((branch) =>
                  <label key={branch.value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-blue-100 p-1.5 rounded">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className={`w-3 h-3 rounded-full ${branch.color}`}></span>
                      <span className="text-gray-700">{branch.label}</span>
                    </label>
                  )}
                </div>
              </div>

              <Select
                label="Trigger Event"
                options={[
                { value: 'absent', label: 'Student Absent' },
                { value: 'late', label: 'Late Arrival' },
                { value: 'low_att', label: 'Low Attendance (<75%)' },
                { value: 'consecutive', label: 'Consecutive Absence' },
                { value: 'early', label: 'Early Departure' },
                { value: 'perfect', label: 'Perfect Attendance' }]
                } />

              
              <Select
                label="Recipient"
                options={[
                { value: 'parent', label: 'Parent' },
                { value: 'student', label: 'Student' },
                { value: 'teacher', label: 'Class Teacher' },
                { value: 'both', label: 'Parent & Student' },
                { value: 'all', label: 'All Stakeholders' }]
                } />

              
              <Select
                label="Channel"
                options={[
                { value: 'sms', label: 'SMS' },
                { value: 'email', label: 'Email' },
                { value: 'app', label: 'App Notification' },
                { value: 'all', label: 'All Channels' }]
                } />

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                <textarea className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Enter message content..." />
              </div>
              
              <Button className="w-full"><Plus className="w-4 h-4 mr-2" />Save Alert Rule</Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Quick Stats">
            <div className="space-y-3 p-4">
              {[
              { label: 'Active Alerts', value: filteredAlerts.filter((a) => a.status === 'Active').length, bg: 'bg-green-50', color: 'text-green-600' },
              { label: 'Inactive Alerts', value: filteredAlerts.filter((a) => a.status === 'Inactive').length, bg: 'bg-gray-50', color: 'text-gray-600' },
              { label: 'Branches Covered', value: Object.keys(groupedByBranch).length, bg: 'bg-blue-50', color: 'text-blue-600' },
              { label: 'SMS Alerts', value: filteredAlerts.filter((a) => a.recipients.includes('SMS')).length, bg: 'bg-purple-50', color: 'text-purple-600' },
              { label: 'Email Alerts', value: filteredAlerts.filter((a) => a.recipients.includes('Email')).length, bg: 'bg-orange-50', color: 'text-orange-600' }].
              map((stat, i) =>
              <div key={i} className={`flex justify-between items-center p-3 ${stat.bg} rounded-lg`}>
                  <span className="text-sm text-gray-700">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>);

}

export default AlertAttendanceNotifications;