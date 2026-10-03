// AlertsPage.tsx - Student Alerts with Multi-Branch Selection

import React, { useState } from 'react';
import { Bell, Send, Search, X, Check, Building, ChevronDown, MapPin, Users, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';

// School Branch Options
const branchOptions = [
{ value: 'main-branch', label: 'Main Branch - City Center', color: 'bg-blue-500', students: 1250 },
{ value: 'north-branch', label: 'North Branch - Industrial Area', color: 'bg-green-500', students: 890 },
{ value: 'south-branch', label: 'South Branch - Residential Zone', color: 'bg-purple-500', students: 720 },
{ value: 'east-branch', label: 'East Branch - Market Road', color: 'bg-orange-500', students: 650 },
{ value: 'west-branch', label: 'West Branch - Highway Campus', color: 'bg-pink-500', students: 580 },
{ value: 'central-branch', label: 'Central Branch - Old City', color: 'bg-cyan-500', students: 940 }];


const ALERT_HISTORY = [
{ id: 1, type: 'Attendance', recipient: 'Class 10-A Parents', message: 'Your ward was absent today...', date: 'Today, 10:00 AM', status: 'Sent', branch: 'main-branch', sentCount: 45 },
{ id: 2, type: 'Fee Reminder', recipient: 'Defaulters List', message: 'Reminder to pay pending fees...', date: 'Yesterday', status: 'Sent', branch: 'north-branch', sentCount: 120 },
{ id: 3, type: 'Exam Schedule', recipient: 'All Students', message: 'Term 1 schedule released...', date: '15 Mar', status: 'Sent', branch: 'south-branch', sentCount: 720 },
{ id: 4, type: 'Emergency', recipient: 'Staff & Students', message: 'School closed tomorrow due to rain.', date: '10 Mar', status: 'Sent', branch: 'east-branch', sentCount: 650 },
{ id: 5, type: 'General', recipient: 'Class 9 Parents', message: 'PTA meeting scheduled for Friday.', date: '05 Mar', status: 'Failed', branch: 'west-branch', sentCount: 0 },
{ id: 6, type: 'Fee Reminder', recipient: 'Class 12-B', message: 'Exam fee submission deadline.', date: '01 Mar', status: 'Sent', branch: 'central-branch', sentCount: 38 },
{ id: 7, type: 'Attendance', recipient: 'Rohan Sharma (Parent)', message: 'Late arrival notice.', date: '28 Feb', status: 'Sent', branch: 'main-branch', sentCount: 1 },
{ id: 8, type: 'General', recipient: 'All Parents', message: 'Annual day celebration details...', date: '25 Feb', status: 'Sent', branch: 'north-branch', sentCount: 890 },
{ id: 9, type: 'Fee Reminder', recipient: 'Class 11 Parents', message: 'Last date for fee payment...', date: '20 Feb', status: 'Pending', branch: 'south-branch', sentCount: 0 },
{ id: 10, type: 'Attendance', recipient: 'Class 8-C Parents', message: 'Weekly attendance report...', date: '18 Feb', status: 'Sent', branch: 'east-branch', sentCount: 42 }];


// Helpers
const getBranchLabel = (v: string) => branchOptions.find((b) => b.value === v)?.label || v;
const getBranchColor = (v: string) => branchOptions.find((b) => b.value === v)?.color || 'bg-gray-500';
const getBranchStudents = (v: string) => branchOptions.find((b) => b.value === v)?.students || 0;

export function AlertsPage() {
  const [messageType, setMessageType] = useState('bulk');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const toggleBranch = (v: string) => setSelectedBranches((prev) => prev.includes(v) ? prev.filter((b) => b !== v) : [...prev, v]);

  // Filter history based on branch
  const filteredHistory = ALERT_HISTORY.filter((alert) => {
    if (selectedBranches.length > 0 && !selectedBranches.includes(alert.branch)) return false;
    return true;
  });

  // Group by branch
  const groupedByBranch = filteredHistory.reduce((acc, alert) => {
    if (!acc[alert.branch]) acc[alert.branch] = [];
    acc[alert.branch].push(alert);
    return acc;
  }, {} as Record<string, typeof ALERT_HISTORY>);

  // Calculate total students for selected branches
  const totalSelectedStudents = selectedBranches.length === 0 ?
  branchOptions.reduce((sum, b) => sum + b.students, 0) :
  selectedBranches.reduce((sum, b) => sum + getBranchStudents(b), 0);

  const columns = [
  { key: 'type', header: 'Alert Type', render: (row: any) => <Badge variant="outline">{row.type}</Badge> },
  { key: 'recipient', header: 'Recipients' },
  { key: 'message', header: 'Message Preview', render: (row: any) => <span className="text-gray-500 truncate max-w-xs block">{row.message}</span> },
  { key: 'sentCount', header: 'Sent To', render: (row: any) => <span className="text-sm font-medium text-gray-700">{row.sentCount} recipients</span> },
  { key: 'date', header: 'Sent On' },
  { key: 'status', header: 'Status', render: (row: any) => <Badge variant={{ Sent: 'success', Failed: 'danger', Pending: 'warning' }[row.status] || 'secondary'}>{row.status}</Badge> }];


  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Alerts</h1>
          <p className="text-sm text-gray-500 mt-1">Send notifications via SMS, Email, or App across school branches.</p>
        </div>
      </div>

      {/* Branch Selection Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium text-gray-700">Select School Branch:</span></div>
          
          {/* Multi-select Branch */}
          <div className="relative">
            <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white min-w-[220px]">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="flex-1 text-left">{selectedBranches.length === 0 ? 'All Branches' : selectedBranches.length === branchOptions.length ? 'All Branches Selected' : `${selectedBranches.length} Branch(es)`}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showBranchDropdown &&
            <div className="absolute z-20 w-80 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 border-b flex justify-between">
                  <button onClick={() => setSelectedBranches(branchOptions.map((b) => b.value))} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Select All</button>
                  <button onClick={() => setSelectedBranches([])} className="text-xs text-gray-500 hover:text-gray-700">Clear All</button>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {branchOptions.map((branch) =>
                <label key={branch.value} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedBranches.includes(branch.value) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selectedBranches.includes(branch.value) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`w-3 h-3 rounded-full ${branch.color}`}></span>
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{branch.label}</span>
                        <span className="text-xs text-gray-400 ml-2">({branch.students} students)</span>
                      </div>
                    </label>
                )}
                </div>
                <div className="p-2 border-t"><button onClick={() => setShowBranchDropdown(false)} className="w-full py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Done</button></div>
              </div>
            }
          </div>

          {/* Selected Branch Tags */}
          {selectedBranches.length > 0 && selectedBranches.length < branchOptions.length &&
          <div className="flex flex-wrap gap-1">
              {selectedBranches.slice(0, 3).map((b) =>
            <span key={b} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getBranchColor(b)}`}>
                  {getBranchLabel(b).split(' - ')[0]}<button onClick={() => toggleBranch(b)} className="hover:bg-white/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </span>
            )}
              {selectedBranches.length > 3 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">+{selectedBranches.length - 3} more</span>}
            </div>
          }

          {selectedBranches.length > 0 &&
          <button onClick={() => setSelectedBranches([])} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
              <X className="w-4 h-4" />Reset
            </button>
          }

          <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span className="font-semibold text-gray-700">{totalSelectedStudents.toLocaleString()}</span> students</div>
            <div><span className="font-semibold text-gray-700">{filteredHistory.length}</span> alerts across <span className="font-semibold text-blue-600">{Object.keys(groupedByBranch).length}</span> branch(es)</div>
          </div>
        </div>
      </Card>

      {/* Branch Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {branchOptions.filter((b) => selectedBranches.length === 0 || selectedBranches.includes(b.value)).map((branch) => {
          const branchAlerts = groupedByBranch[branch.value] || [];
          return (
            <Card key={branch.value} className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => toggleBranch(branch.value)}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${branch.color}`}></span>
                <span className="text-xs font-medium text-gray-600 truncate">{branch.label.split(' - ')[0]}</span>
                {selectedBranches.includes(branch.value) && <Check className="w-3 h-3 text-green-500 ml-auto" />}
              </div>
              <div className="text-xl font-bold text-gray-900">{branch.students}</div>
              <div className="text-xs text-gray-500">students</div>
              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">{branchAlerts.length} alerts</div>
            </Card>);

        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Compose Form */}
        <Card title="Compose Alert" className="lg:col-span-1 h-fit">
          <div className="space-y-4">
            <Select label="Message Type" options={[{ value: 'bulk', label: 'Bulk Message' }, { value: 'individual', label: 'Individual Message' }]} value={messageType} onChange={(val) => setMessageType(val)} />
            <Select label="Alert Type" options={[{ value: 'attendance', label: 'Attendance Shortage' }, { value: 'fee', label: 'Fee Reminder' }, { value: 'general', label: 'General Announcement' }, { value: 'emergency', label: 'Emergency Alert' }]} />

            {/* Branch Selection for Compose */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
              <label className="text-xs font-semibold text-blue-700 uppercase flex items-center gap-2"><Building className="w-4 h-4" />Target Branch(es)</label>
              <div className="grid grid-cols-2 gap-2">
                {branchOptions.map((branch) =>
                <label key={branch.value} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded hover:bg-blue-100">
                    <input type="checkbox" className="rounded text-blue-600" checked={selectedBranches.includes(branch.value)} onChange={() => toggleBranch(branch.value)} />
                    <span className={`w-2 h-2 rounded-full ${branch.color}`}></span>
                    <span className="text-gray-700 text-xs">{branch.label.split(' - ')[0]}</span>
                  </label>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-600">{selectedBranches.length === 0 ? 'All branches selected' : `${selectedBranches.length} branch(es) selected`}</p>
                <p className="text-xs font-medium text-blue-700">{totalSelectedStudents.toLocaleString()} students</p>
              </div>
            </div>

            {messageType === 'individual' &&
            <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                <label className="text-xs font-semibold text-gray-700 uppercase">Find Student</label>
                <div className="flex gap-2"><Input placeholder="Name or ID" className="flex-1" /><Button variant="secondary" size="sm"><Search className="w-4 h-4" /></Button></div>
                <p className="text-xs text-gray-500">Search and select a single student.</p>
              </div>
            }

            {messageType === 'bulk' &&
            <div className="space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
                <label className="text-xs font-semibold text-gray-700 uppercase">Target Audience</label>
                <Select label="Class" options={[{ value: 'all', label: 'All Classes' }, { value: '10', label: 'Class 10' }, { value: '9', label: 'Class 9' }, { value: '8', label: 'Class 8' }]} />
                <Select label="Section" options={[{ value: 'all', label: 'All Sections' }, { value: 'A', label: 'Section A' }, { value: 'B', label: 'Section B' }, { value: 'C', label: 'Section C' }]} />
              </div>
            }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" rows={4} placeholder="Type your message here... Use {student_name} for dynamic name." />
              <p className="text-xs text-gray-400 mt-1">Max 160 characters for SMS</p>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Notification Channels</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-blue-600" /><MessageSquare className="w-4 h-4 text-green-600" /> SMS</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" className="rounded text-blue-600" /><Mail className="w-4 h-4 text-blue-600" /> Email</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-blue-600" /><Smartphone className="w-4 h-4 text-purple-600" /> App</label>
              </div>
            </div>

            <Button variant="primary" className="w-full" leftIcon={<Send className="w-4 h-4" />}>Send Alert to {totalSelectedStudents.toLocaleString()} Students</Button>
          </div>
        </Card>

        {/* Right Column: History Table - Branch Wise */}
        <div className="lg:col-span-2 space-y-4">
          {Object.keys(groupedByBranch).length > 0 ?
          Object.entries(groupedByBranch).map(([branch, alerts]) =>
          <Card key={branch} className="overflow-hidden" noPadding>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getBranchColor(branch)}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{getBranchLabel(branch)}</h3>
                      <p className="text-xs text-gray-500">{getBranchStudents(branch).toLocaleString()} students • {alerts.length} alert(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{alerts.filter((a) => a.status === 'Sent').length} Sent</Badge>
                    {alerts.filter((a) => a.status === 'Failed').length > 0 && <Badge variant="danger">{alerts.filter((a) => a.status === 'Failed').length} Failed</Badge>}
                    {alerts.filter((a) => a.status === 'Pending').length > 0 && <Badge variant="warning">{alerts.filter((a) => a.status === 'Pending').length} Pending</Badge>}
                  </div>
                </div>
                <div className="overflow-auto max-h-[300px] w-full">
                  <Table columns={columns} data={alerts} />
                </div>
              </Card>
          ) :

          <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500">Try selecting different branches.</p>
            </Card>
          }

          {/* Summary Card */}
          {filteredHistory.length > 0 &&
          <Card className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Alert Summary</h3>
                  <p className="text-gray-400 text-sm">{filteredHistory.length} total alerts sent</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center"><p className="text-2xl font-bold text-green-400">{filteredHistory.filter((a) => a.status === 'Sent').length}</p><p className="text-xs text-gray-400">Sent</p></div>
                  <div className="text-center"><p className="text-2xl font-bold text-red-400">{filteredHistory.filter((a) => a.status === 'Failed').length}</p><p className="text-xs text-gray-400">Failed</p></div>
                  <div className="text-center"><p className="text-2xl font-bold text-yellow-400">{filteredHistory.filter((a) => a.status === 'Pending').length}</p><p className="text-xs text-gray-400">Pending</p></div>
                  <div className="text-center border-l border-gray-600 pl-6"><p className="text-2xl font-bold">{Object.keys(groupedByBranch).length}</p><p className="text-xs text-gray-400">Branches</p></div>
                  <div className="text-center border-l border-gray-600 pl-6"><p className="text-2xl font-bold">{filteredHistory.reduce((sum, a) => sum + a.sentCount, 0).toLocaleString()}</p><p className="text-xs text-gray-400">Recipients</p></div>
                </div>
              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}

export { AlertsPage as Alert };