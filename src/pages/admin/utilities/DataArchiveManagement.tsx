import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import {
  Archive,
  Database,
  RotateCcw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Shield,
  Eye,
  FileText,
  Users,
  CreditCard,
  Briefcase,
  MessageSquare,
  Activity } from
'lucide-react';
// --- Types ---
interface CategoryItem {
  id: string;
  label: string;
  records: number;
}
interface Category {
  id: string;
  title: string;
  icon: React.ElementType;
  items: CategoryItem[];
}
interface ArchiveRecord {
  id: string;
  date: string;
  module: string;
  records: string;
  size: string;
  admin: string;
  status: string;
}
// --- Mock Data ---
const MOCK_ARCHIVE_HISTORY: ArchiveRecord[] = [
{
  id: 'ARC-001',
  date: '12 Jan 2026',
  module: 'Attendance',
  records: '200,000',
  size: '45 MB',
  admin: 'Super Admin',
  status: 'Completed'
},
{
  id: 'ARC-002',
  date: '15 Dec 2025',
  module: 'Exam Results',
  records: '120,000',
  size: '28 MB',
  admin: 'System Auto',
  status: 'Completed'
},
{
  id: 'ARC-003',
  date: '01 Nov 2025',
  module: 'Fee Transactions',
  records: '32,000',
  size: '12 MB',
  admin: 'Finance Admin',
  status: 'Completed'
},
{
  id: 'ARC-004',
  date: '10 Oct 2025',
  module: 'SMS Logs',
  records: '450,000',
  size: '85 MB',
  admin: 'System Auto',
  status: 'Completed'
},
{
  id: 'ARC-005',
  date: '05 Sep 2025',
  module: 'Alumni Records',
  records: '1,250',
  size: '5 MB',
  admin: 'Super Admin',
  status: 'Completed'
},
{
  id: 'ARC-006',
  date: '20 Aug 2025',
  module: 'System Logs',
  records: '1,200,000',
  size: '210 MB',
  admin: 'System Auto',
  status: 'Completed'
}];

const CATEGORIES: Category[] = [
{
  id: 'academic',
  title: 'Academic Data',
  icon: FileText,
  items: [
  {
    id: 'att',
    label: 'Student Attendance',
    records: 245000
  },
  {
    id: 'exam',
    label: 'Examination Records',
    records: 85000
  },
  {
    id: 'res',
    label: 'Result Records',
    records: 120000
  },
  {
    id: 'ass',
    label: 'Assignment Submissions',
    records: 320000
  },
  {
    id: 'tt',
    label: 'Timetable History',
    records: 15000
  }]

},
{
  id: 'student',
  title: 'Student Data',
  icon: Users,
  items: [
  {
    id: 'alum',
    label: 'Alumni Students',
    records: 4500
  },
  {
    id: 'grad',
    label: 'Graduated Students',
    records: 3200
  },
  {
    id: 'with',
    label: 'Withdrawn Students',
    records: 850
  },
  {
    id: 'adm',
    label: 'Past Admission Records',
    records: 12000
  }]

},
{
  id: 'finance',
  title: 'Financial Data',
  icon: CreditCard,
  items: [
  {
    id: 'fee',
    label: 'Fee Transactions',
    records: 32000
  },
  {
    id: 'pay',
    label: 'Payment Logs',
    records: 45000
  },
  {
    id: 'schol',
    label: 'Scholarship Records',
    records: 2100
  },
  {
    id: 'exp',
    label: 'Expense Records',
    records: 8500
  }]

},
{
  id: 'hr',
  title: 'HR Data',
  icon: Briefcase,
  items: [
  {
    id: 'femp',
    label: 'Former Employees',
    records: 340
  },
  {
    id: 'payh',
    label: 'Payroll History',
    records: 12500
  },
  {
    id: 'lev',
    label: 'Leave Records',
    records: 8400
  },
  {
    id: 'hatt',
    label: 'Attendance Logs',
    records: 45000
  }]

},
{
  id: 'comm',
  title: 'Communication Data',
  icon: MessageSquare,
  items: [
  {
    id: 'sms',
    label: 'SMS Logs',
    records: 450000
  },
  {
    id: 'eml',
    label: 'Email Logs',
    records: 280000
  },
  {
    id: 'notif',
    label: 'Notification History',
    records: 850000
  }]

},
{
  id: 'sys',
  title: 'System Logs',
  icon: Activity,
  items: [
  {
    id: 'uact',
    label: 'User Activity Logs',
    records: 1200000
  },
  {
    id: 'logh',
    label: 'Login History',
    records: 850000
  },
  {
    id: 'api',
    label: 'API Logs',
    records: 2500000
  }]

}];

// --- Auto-archive rules ---
const AUTO_RULES = [
{
  label: 'Student Attendance',
  desc: 'Automatically archive daily attendance records',
  options: ['After 1 Year', 'After 2 Years', 'After 3 Years'],
  defaultIdx: 2,
  enabled: true
},
{
  label: 'SMS & Communication Logs',
  desc: 'Automatically archive message history',
  options: ['After 6 Months', 'After 1 Year', 'After 2 Years'],
  defaultIdx: 1,
  enabled: true
},
{
  label: 'Financial Data',
  desc: 'Automatically archive fee and expense records',
  options: ['After 3 Years', 'After 5 Years', 'After 7 Years'],
  defaultIdx: 1,
  enabled: true
},
{
  label: 'System Logs',
  desc: 'Automatically archive API and user activity logs',
  options: ['After 6 Months', 'After 1 Year', 'After 2 Years'],
  defaultIdx: 0,
  enabled: false
}];

export function DataArchiveManagement() {
  const [activeTab, setActiveTab] = useState('archive');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedRestoreId, setSelectedRestoreId] = useState<string | null>(
    null
  );
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isArchiving, setIsArchiving] = useState(false);
  const [autoRuleToggles, setAutoRuleToggles] = useState(
    AUTO_RULES.map((r) => r.enabled)
  );
  const [schedule, setSchedule] = useState('yearly');
  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };
  const handleCategoryToggle = (items: CategoryItem[]) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      const allSelected = items.every((item) => next.has(item.id));
      if (allSelected) {
        items.forEach((item) => next.delete(item.id));
      } else {
        items.forEach((item) => next.add(item.id));
      }
      return next;
    });
  };
  const getSelectedPreview = () => {
    const preview: {
      label: string;
      records: number;
    }[] = [];
    CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        if (selectedItems.has(item.id)) {
          preview.push({
            label: item.label,
            records: item.records
          });
        }
      });
    });
    return preview;
  };
  const startArchiveProcess = () => {
    setIsConfirmModalOpen(false);
    setIsProgressModalOpen(true);
    setIsArchiving(true);
    const previewData = getSelectedPreview();
    const initial: Record<string, number> = {};
    previewData.forEach((item) => {
      initial[item.label] = 0;
    });
    setProgress(initial);
    previewData.forEach((item, index) => {
      setTimeout(() => {
        let current = 0;
        const interval = setInterval(() => {
          current += Math.floor(Math.random() * 15) + 5;
          if (current > 100) current = 100;
          setProgress((prev) => {
            const next = {
              ...prev,
              [item.label]: current
            };
            if (
            current === 100 &&
            Object.values(next).every((v) => v === 100))
            {
              setTimeout(() => {
                setIsArchiving(false);
                setSelectedItems(new Set());
              }, 1000);
            }
            return next;
          });
          if (current >= 100) clearInterval(interval);
        }, 300);
      }, index * 800);
    });
  };
  const handleRestoreClick = (id: string) => {
    setSelectedRestoreId(id);
    setIsRestoreModalOpen(true);
  };
  const confirmRestore = () => {
    setIsRestoreModalOpen(false);
    setSelectedRestoreId(null);
  };
  const previewData = getSelectedPreview();
  const totalSelectedRecords = previewData.reduce(
    (sum, item) => sum + item.records,
    0
  );
  // --- Tab: Archive ---
  const renderArchiveTab = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
      {
        label: 'Total Archived',
        value: '1.2M Records',
        icon: Database,
        bg: 'bg-blue-100',
        fg: 'text-blue-600'
      },
      {
        label: 'Storage Saved',
        value: '45 GB',
        icon: HardDrive,
        bg: 'bg-emerald-100',
        fg: 'text-emerald-600'
      },
      {
        label: 'Last Archive',
        value: 'Jan 15, 2026',
        icon: Clock,
        bg: 'bg-purple-100',
        fg: 'text-purple-600'
      },
      {
        label: 'Active Policies',
        value: '6 Auto-Rules',
        icon: Shield,
        bg: 'bg-amber-100',
        fg: 'text-amber-600'
      }].
      map((stat) =>
      <Card key={stat.label} className="p-4 flex items-center gap-4">
            <div className={`p-3 ${stat.bg} rounded-full ${stat.fg}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                {stat.label}
              </p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </Card>
      )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="1. Define Archive Scope">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
              label="Academic Session"
              options={[
              {
                value: '2020-2021',
                label: '2020-2021'
              },
              {
                value: '2021-2022',
                label: '2021-2022'
              },
              {
                value: '2022-2023',
                label: '2022-2023'
              },
              {
                value: '2023-2024',
                label: '2023-2024'
              }]
              } />

              <Select
              label="Branch Selection"
              options={[
              {
                value: 'all',
                label: 'All Branches'
              },
              {
                value: 'main',
                label: 'Main Branch'
              },
              {
                value: 'branch-a',
                label: 'Branch A'
              },
              {
                value: 'branch-b',
                label: 'Branch B'
              }]
              } />

              <Select
              label="Data Age Filter"
              options={[
              {
                value: '1',
                label: 'Older Than 1 Year'
              },
              {
                value: '2',
                label: 'Older Than 2 Years'
              },
              {
                value: '3',
                label: 'Older Than 3 Years'
              },
              {
                value: '5',
                label: 'Older Than 5 Years'
              },
              {
                value: 'custom',
                label: 'Custom Date Range...'
              }]
              } />

            </div>
          </Card>

          <Card title="2. Select Data Categories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORIES.map((cat) => {
              const allSelected = cat.items.every((item) =>
              selectedItems.has(item.id)
              );
              return (
                <div
                  key={cat.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">

                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          {cat.title}
                        </span>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => handleCategoryToggle(cat.items)}
                        className="rounded border-gray-300 text-blue-600" />

                        Select All
                      </label>
                    </div>
                    <div className="space-y-2">
                      {cat.items.map((item) =>
                    <div
                      key={item.id}
                      className="flex items-center justify-between">

                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemToggle(item.id)}
                          className="rounded border-gray-300 text-blue-600" />

                            {item.label}
                          </label>
                          <span className="text-xs text-gray-400">
                            ~{item.records.toLocaleString()}
                          </span>
                        </div>
                    )}
                    </div>
                  </div>);

            })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Archive Preview" className="sticky top-6">
            {previewData.length > 0 ?
          <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-800">
                    You are about to move{' '}
                    <strong>{totalSelectedRecords.toLocaleString()}</strong>{' '}
                    records to the Archive Storage Layer.
                  </p>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Records to be Archived
                  </h4>
                  {previewData.map((item, idx) =>
              <div
                key={idx}
                className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">

                      <span className="text-gray-700">{item.label}</span>
                      <span className="font-medium">
                        {item.records.toLocaleString()}
                      </span>
                    </div>
              )}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsConfirmModalOpen(true)}>

                    <Archive className="w-4 h-4 mr-2" />
                    Start Archive Process
                  </Button>
                </div>
              </div> :

          <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Archive className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Select data categories to see a preview of records to be
                  archived.
                </p>
              </div>
          }
          </Card>
        </div>
      </div>
    </div>;

  // --- Tab: View ---
  const renderViewTab = () => {
    const columns = [
    {
      key: 'id',
      header: 'Archive ID',
      render: (row: ArchiveRecord) =>
      <span className="font-mono text-xs font-medium text-blue-600">
            {row.id}
          </span>

    },
    {
      key: 'date',
      header: 'Date'
    },
    {
      key: 'module',
      header: 'Module'
    },
    {
      key: 'records',
      header: 'Records'
    },
    {
      key: 'size',
      header: 'Size'
    },
    {
      key: 'admin',
      header: 'Performed By'
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ArchiveRecord) =>
      <Badge variant={row.status === 'Completed' ? 'success' : 'warning'}>
            {row.status}
          </Badge>

    },
    {
      key: 'actions',
      header: 'Actions',
      render: () =>
      <Button variant="ghost" size="xs" title="View Details">
            <Eye className="w-4 h-4" />
          </Button>

    }];

    return (
      <div className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Module"
              options={[
              {
                value: 'all',
                label: 'All Modules'
              },
              {
                value: 'att',
                label: 'Attendance'
              },
              {
                value: 'fee',
                label: 'Fee Transactions'
              },
              {
                value: 'sms',
                label: 'SMS Logs'
              }]
              } />

            <Select
              label="Academic Year"
              options={[
              {
                value: 'all',
                label: 'All Years'
              },
              {
                value: '21',
                label: '2021-2022'
              },
              {
                value: '22',
                label: '2022-2023'
              }]
              } />

            <Select
              label="Branch"
              options={[
              {
                value: 'all',
                label: 'All Branches'
              },
              {
                value: 'main',
                label: 'Main Branch'
              }]
              } />

            <Input label="Date Range" type="date" />
          </div>
        </Card>
        <Card title="Archived Records Log">
          <Table columns={columns} data={MOCK_ARCHIVE_HISTORY} />
        </Card>
      </div>);

  };
  // --- Tab: Restore ---
  const renderRestoreTab = () => {
    const columns = [
    {
      key: 'id',
      header: 'Archive ID',
      render: (row: ArchiveRecord) =>
      <span className="font-mono text-xs font-medium">{row.id}</span>

    },
    {
      key: 'date',
      header: 'Archive Date'
    },
    {
      key: 'module',
      header: 'Module Data'
    },
    {
      key: 'records',
      header: 'Records'
    },
    {
      key: 'size',
      header: 'Size'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ArchiveRecord) =>
      <Button
        variant="outline"
        size="xs"
        onClick={() => handleRestoreClick(row.id)}
        className="text-blue-600 border-blue-200 hover:bg-blue-50">

            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Restore
          </Button>

    }];

    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800">
              Important Notice About Restoration
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              Restoring data moves it from the Archive Storage Layer back to the
              active operational tables. This may impact system performance if
              large datasets are restored. Only restore data if actively needed
              for operations.
            </p>
          </div>
        </div>
        <Card title="Available Archives for Restoration">
          <Table
            columns={columns}
            data={MOCK_ARCHIVE_HISTORY.filter((h) => h.status === 'Completed')} />

        </Card>
      </div>);

  };
  // --- Tab: Settings ---
  const renderSettingsTab = () =>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Auto-Archive Rules">
          <div className="space-y-4">
            {AUTO_RULES.map((rule, idx) =>
          <div
            key={idx}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">

                <div>
                  <h4 className="font-medium text-gray-900">{rule.label}</h4>
                  <p className="text-sm text-gray-500">{rule.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                defaultValue={rule.options[rule.defaultIdx]}>

                    {rule.options.map((opt) =>
                <option key={opt} value={opt}>
                        {opt}
                      </option>
                )}
                  </select>
                  <button
                onClick={() =>
                setAutoRuleToggles((prev) =>
                prev.map((v, i) => i === idx ? !v : v)
                )
                }
                className={`w-12 h-6 rounded-full relative transition-colors ${autoRuleToggles[idx] ? 'bg-emerald-500' : 'bg-gray-300'}`}>

                    <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${autoRuleToggles[idx] ? 'right-1' : 'left-1'}`} />

                  </button>
                </div>
              </div>
          )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">
              Auto-Archive Schedule
            </h4>
            <div className="flex gap-6">
              {[
            {
              value: 'monthly',
              label: 'Monthly (1st of month)'
            },
            {
              value: 'quarterly',
              label: 'Quarterly'
            },
            {
              value: 'yearly',
              label: 'Yearly (End of Academic Session)'
            }].
            map((opt) =>
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer">

                  <input
                type="radio"
                name="schedule"
                value={opt.value}
                checked={schedule === opt.value}
                onChange={() => setSchedule(opt.value)}
                className="text-blue-600" />

                  <span className="text-sm">{opt.label}</span>
                </label>
            )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary">Save Settings</Button>
          </div>
        </Card>
      </div>

      <div>
        <Card
        title="Security & Compliance"
        className="bg-slate-50 border-slate-200">

          <ul className="space-y-4 text-sm text-slate-700">
            {[
          {
            title: 'Read-Only Access:',
            desc: 'Archived data cannot be edited or modified to ensure compliance.'
          },
          {
            title: 'Audit Trails:',
            desc: 'All archive and restore operations are permanently logged.'
          },
          {
            title: 'Restricted Deletion:',
            desc: 'Only Super Admins can permanently delete archived data.'
          },
          {
            title: 'Storage Separation:',
            desc: 'Archives are stored in a separate database layer to maintain active system performance.'
          }].
          map((item) =>
          <li key={item.title} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong>{item.title}</strong> {item.desc}
                </span>
              </li>
          )}
          </ul>
        </Card>
      </div>
    </div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Archive className="w-6 h-6 text-blue-600" />
            Data Archive Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-3xl">
            Archive old or inactive system data to improve performance and
            maintain organized records. Archived data remains accessible for
            reporting and auditing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
          {
            id: 'archive',
            label: 'Archive Data',
            icon: Archive
          },
          {
            id: 'view',
            label: 'View Archives',
            icon: Database
          },
          {
            id: 'restore',
            label: 'Restore',
            icon: RotateCcw
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings
          }].
          map((btn) =>
          <Button
            key={btn.id}
            variant={activeTab === btn.id ? 'primary' : 'outline'}
            onClick={() => setActiveTab(btn.id)}>

              <btn.icon className="w-4 h-4 mr-2" />
              {btn.label}
            </Button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'archive' && renderArchiveTab()}
        {activeTab === 'view' && renderViewTab()}
        {activeTab === 'restore' && renderRestoreTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>

      {/* Confirm Archive Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Data Archival">

        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg flex gap-3 border border-amber-200">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">
                Warning: Archiving Data
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Archiving will move selected records to the Archive Database.
                Archived data will no longer appear in daily operations but will
                remain available for historical reporting.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Are you sure you want to proceed with archiving the selected
            categories?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary" onClick={startArchiveProcess}>
              Confirm Archive
            </Button>
          </div>
        </div>
      </Modal>

      {/* Progress Modal */}
      <Modal
        isOpen={isProgressModalOpen}
        onClose={() => {
          if (!isArchiving) setIsProgressModalOpen(false);
        }}
        title="Archiving Data">

        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            {isArchiving ?
            'Moving records to Archive Storage Layer. Please do not close this window.' :
            'Archiving completed successfully!'}
          </p>
          <div className="space-y-4">
            {Object.entries(progress).map(([label, val]) =>
            <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="text-gray-500">{val}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                  className={`h-2 rounded-full transition-all duration-300 ${val === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                  style={{
                    width: `${val}%`
                  }} />

                </div>
              </div>
            )}
          </div>
          {!isArchiving &&
          <div className="flex justify-center pt-4">
              <Button
              variant="primary"
              onClick={() => setIsProgressModalOpen(false)}>

                Done
              </Button>
            </div>
          }
        </div>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Confirm Restoration">

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg flex gap-3 border border-blue-200">
            <RotateCcw className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800">
                Restore Archive: {selectedRestoreId}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                This will move the archived records back into the active
                database tables.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Are you sure you want to restore this data?
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRestoreModalOpen(false)}>

              Cancel
            </Button>
            <Button variant="primary" onClick={confirmRestore}>
              Confirm Restore
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}