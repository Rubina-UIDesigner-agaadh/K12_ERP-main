import React, { useState } from 'react';
import { Send, MessageSquare, Mail, Building2, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

// School Branches
const BRANCHES = [
{ id: 'pre-primary', name: 'Pre-Primary (Nursery-KG)', code: 'PP' },
{ id: 'primary', name: 'Primary (Class 1-5)', code: 'PRI' },
{ id: 'middle', name: 'Middle School (Class 6-8)', code: 'MID' },
{ id: 'secondary', name: 'Secondary (Class 9-10)', code: 'SEC' },
{ id: 'senior', name: 'Senior Secondary (Class 11-12)', code: 'SR' }];


const TARGET_OPTIONS = [
{ value: 'inquiry', label: 'All Inquiries' },
{ value: 'applicants', label: 'All Applicants' },
{ value: 'shortlisted', label: 'Shortlisted Candidates' },
{ value: 'offered', label: 'Offered Candidates' }];


const TEMPLATE_OPTIONS = [
{ value: 'reminder', label: 'General Reminder' },
{ value: 'exam', label: 'Exam Schedule' },
{ value: 'result', label: 'Result Announcement' },
{ value: 'fee', label: 'Fee Payment Reminder' }];


// Multi-Select Dropdown Component
const MultiSelectDropdown: React.FC<{
  options: {value: string;label: string;}[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  icon?: React.ReactNode;
}> = ({ options, selected, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const allSelected = selected.length === options.length;
  const toggleAll = () => onChange(allSelected ? [] : options.map((o) => o.value));
  const toggleOption = (value: string) => onChange(selected.includes(value) ? selected.filter((s) => s !== value) : [...selected, value]);
  const displayText = selected.length === 0 ? placeholder : selected.length === options.length ? 'All Branches' : `${selected.length} Selected`;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg bg-white w-full hover:border-blue-400 transition-colors">
        <span className="flex items-center gap-2">{icon}<span className="text-sm text-gray-700">{displayText}</span></span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen &&
      <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2 border-b">
              <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 text-blue-600 rounded" />
                <span className="font-medium text-sm">Select All</span>
              </label>
            </div>
            <div className="p-2">
              {options.map((opt) =>
            <label key={opt.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" checked={selected.includes(opt.value)} onChange={() => toggleOption(opt.value)} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm">{opt.label}</span>
                </label>
            )}
            </div>
          </div>
        </>
      }
    </div>);

};

export function AlertAdmissionsNotifications() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(BRANCHES.map((b) => b.code));
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Mock Data with school branch info
  const logs = [
  { id: 1, type: 'SMS', template: 'Interview Call', recipients: 45, date: '2024-03-10', status: 'Sent', branch: 'PP' },
  { id: 2, type: 'Email', template: 'Offer Letter', recipients: 40, date: '2024-03-15', status: 'Sent', branch: 'PRI' },
  { id: 3, type: 'SMS', template: 'Fee Reminder', recipients: 12, date: '2024-03-18', status: 'Failed (2)', branch: 'MID' },
  { id: 4, type: 'Email', template: 'Exam Schedule', recipients: 30, date: '2024-03-20', status: 'Sent', branch: 'SEC' },
  { id: 5, type: 'SMS', template: 'Result Announcement', recipients: 25, date: '2024-03-22', status: 'Sent', branch: 'SR' },
  { id: 6, type: 'Email', template: 'General Reminder', recipients: 55, date: '2024-03-25', status: 'Sent', branch: 'PRI' },
  { id: 7, type: 'SMS', template: 'Admission Confirmation', recipients: 20, date: '2024-03-26', status: 'Sent', branch: 'PP' },
  { id: 8, type: 'Email', template: 'Document Submission', recipients: 35, date: '2024-03-27', status: 'Sent', branch: 'MID' }];


  const filteredLogs = logs.filter((log) => selectedBranches.includes(log.branch));

  const columns = [
  { key: 'date', header: 'Date', render: (row: any) => <span className="text-sm">{row.date}</span> },
  { key: 'branch', header: 'Branch', render: (row: any) => {
      const branch = BRANCHES.find((b) => b.code === row.branch);
      return <Badge variant="info" title={branch?.name}>{row.branch}</Badge>;
    } },
  { key: 'type', header: 'Channel', render: (row: any) =>
    <div className="flex items-center gap-2">
        {row.type === 'SMS' ? <MessageSquare className="w-4 h-4 text-green-600" /> : <Mail className="w-4 h-4 text-blue-600" />}
        {row.type}
      </div>
  },
  { key: 'template', header: 'Template', render: (row: any) => <span className="font-medium">{row.template}</span> },
  { key: 'recipients', header: 'Recipients', render: (row: any) => <span>{row.recipients}</span> },
  { key: 'status', header: 'Status', render: (row: any) => <Badge variant={row.status === 'Sent' ? 'success' : 'danger'}>{row.status}</Badge> }];


  const stats = {
    total: filteredLogs.length,
    sent: filteredLogs.filter((l) => l.status === 'Sent').length,
    failed: filteredLogs.filter((l) => l.status.includes('Failed')).length,
    recipients: filteredLogs.reduce((sum, l) => sum + l.recipients, 0)
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <Send className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admission Alerts</h1>
            <p className="text-gray-500">Send bulk notifications to applicants</p>
          </div>
        </div>

        {/* Branch Filter */}
        <div className="min-w-[250px]">
          <MultiSelectDropdown
            options={BRANCHES.map((b) => ({ value: b.code, label: b.name }))}
            selected={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="Select Branches"
            icon={<Building2 className="w-4 h-4 text-gray-500" />} />

        </div>
      </div>

      {/* Filter Summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">Showing alerts for:</span>
        {selectedBranches.length === BRANCHES.length ?
        <Badge variant="success" className="gap-1"><Building2 className="w-3 h-3" />All Branches</Badge> :
        selectedBranches.length === 0 ?
        <Badge variant="danger">No Branch Selected</Badge> :
        selectedBranches.map((code) => {
          const branch = BRANCHES.find((b) => b.code === code);
          return <Badge key={code} variant="secondary" title={branch?.name}>{code}</Badge>;
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        { label: 'Total Alerts', value: stats.total, color: 'blue' },
        { label: 'Sent', value: stats.sent, color: 'green' },
        { label: 'Failed', value: stats.failed, color: 'red' },
        { label: 'Total Recipients', value: stats.recipients, color: 'purple' }].
        map((stat, i) =>
        <Card key={i} className="p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send New Alert Form */}
        <div className="lg:col-span-1">
          <Card title="Send New Alert">
            <div className="space-y-4 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Branches</label>
                <MultiSelectDropdown
                  options={BRANCHES.map((b) => ({ value: b.code, label: b.name }))}
                  selected={selectedBranches}
                  onChange={setSelectedBranches}
                  placeholder="Select Branches"
                  icon={<Building2 className="w-4 h-4 text-gray-500" />} />

              </div>

              <Select label="Target Audience" options={TARGET_OPTIONS} />
              <Select label="Message Template" options={TEMPLATE_OPTIONS} />

              <div className="p-3 bg-gray-50 rounded border text-sm text-gray-600">
                <p className="font-semibold mb-1">Preview:</p>
                <p>Dear Parent, this is a reminder regarding the entrance exam scheduled on [Date]. Please arrive by [Time].</p>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">SMS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Email</span>
                </label>
              </div>

              {selectedBranches.length > 0 &&
              <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                  <p className="font-medium text-blue-800 mb-1">Sending to:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedBranches.length === BRANCHES.length ?
                  <Badge variant="info">All Branches</Badge> :
                  selectedBranches.map((code) => {
                    const branch = BRANCHES.find((b) => b.code === code);
                    return <Badge key={code} variant="secondary" title={branch?.name}>{code}</Badge>;
                  })}
                  </div>
                </div>
              }

              <Button className="w-full" disabled={selectedBranches.length === 0 || !smsEnabled && !emailEnabled}>
                <Send className="w-4 h-4 mr-2" /> Send Alert
              </Button>
            </div>
          </Card>
        </div>

        {/* Communication Log */}
        <div className="lg:col-span-2">
          <Card title={`Communication Log (${filteredLogs.length} records)`}>
            {filteredLogs.length === 0 ?
            <div className="p-8 text-center text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No alerts found for the selected branches</p>
              </div> :

            <Table columns={columns} data={filteredLogs} />
            }
          </Card>

          {/* Branch-wise Summary */}
          {filteredLogs.length > 0 &&
          <Card title="Branch-wise Summary" className="mt-6">
              <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {BRANCHES.filter((b) => selectedBranches.includes(b.code)).map((branch) => {
                const branchLogs = filteredLogs.filter((l) => l.branch === branch.code);
                return (
                  <div key={branch.id} className="p-3 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">{branch.code}</div>
                        <span className="font-medium text-xs text-gray-700" title={branch.name}>{branch.code}</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-gray-500">Alerts:</span><span className="font-medium">{branchLogs.length}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Recipients:</span><span className="font-medium">{branchLogs.reduce((s, l) => s + l.recipients, 0)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Sent:</span><span className="font-medium text-green-600">{branchLogs.filter((l) => l.status === 'Sent').length}</span></div>
                      </div>
                    </div>);

              })}
              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}

export default AlertAdmissionsNotifications;