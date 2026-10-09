import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Save,
  Check,
  X,
  Lock,
  Unlock,
  Smartphone,
  Globe,
  AlertTriangle,
  Bell,
  Eye,
  Plus,
  Edit2 } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
// --- Types ---
interface ModuleAccess {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean; // From Tab 1 Scope
  permissions: {
    view: boolean;
    add: boolean;
    edit: boolean;
  };
}
interface NotificationPreference {
  id: string;
  category: 'Academic' | 'Administrative';
  type: string;
  channels: {
    sms: boolean;
    app: boolean;
    email: boolean;
  };
}
// --- Mock Data ---
const INITIAL_MODULES: ModuleAccess[] = [
{
  id: 'M01',
  name: 'Student Profile',
  description: 'Basic student details, contact information.',
  isEnabled: true,
  permissions: {
    view: true,
    add: false,
    edit: true
  }
},
{
  id: 'M02',
  name: 'Attendance',
  description: 'View daily and monthly attendance records.',
  isEnabled: true,
  permissions: {
    view: true,
    add: false,
    edit: false
  }
},
{
  id: 'M03',
  name: 'Fees & Payments',
  description: 'View fee structure and make online payments.',
  isEnabled: true,
  permissions: {
    view: true,
    add: true,
    edit: false
  }
},
{
  id: 'M04',
  name: 'Report Cards & Exams',
  description: 'Download report cards and view marks.',
  isEnabled: true,
  permissions: {
    view: true,
    add: false,
    edit: false
  }
},
{
  id: 'M05',
  name: 'Homework & Assignments',
  description: 'See homework assignments and project details.',
  isEnabled: true,
  permissions: {
    view: true,
    add: true,
    edit: false
  }
},
{
  id: 'M06',
  name: 'Leave Applications',
  description: 'Submit and manage leave applications online.',
  isEnabled: true,
  permissions: {
    view: true,
    add: true,
    edit: true
  }
},
{
  id: 'M07',
  name: 'Messages & Communication',
  description: 'Send and receive messages with teachers/admin.',
  isEnabled: true,
  permissions: {
    view: true,
    add: true,
    edit: false
  }
},
{
  id: 'M08',
  name: 'Transport Tracking',
  description: 'Track school bus route and live location.',
  isEnabled: true,
  permissions: {
    view: true,
    add: false,
    edit: false
  }
},
{
  id: 'M09',
  name: 'Online Classes',
  description: 'Access online classes and virtual sessions.',
  isEnabled: false,
  permissions: {
    view: false,
    add: false,
    edit: false
  }
},
{
  id: 'M10',
  name: 'Documents',
  description: 'Download important school documents.',
  isEnabled: true,
  permissions: {
    view: true,
    add: false,
    edit: false
  }
}];

const INITIAL_NOTIFICATIONS: NotificationPreference[] = [
{
  id: 'N01',
  category: 'Academic',
  type: 'Daily Attendance',
  channels: {
    sms: true,
    app: true,
    email: false
  }
},
{
  id: 'N02',
  category: 'Academic',
  type: 'Homework Assigned',
  channels: {
    sms: false,
    app: true,
    email: false
  }
},
{
  id: 'N03',
  category: 'Academic',
  type: 'Exam Results',
  channels: {
    sms: true,
    app: true,
    email: true
  }
},
{
  id: 'N04',
  category: 'Administrative',
  type: 'Fee Due Reminder',
  channels: {
    sms: true,
    app: true,
    email: true
  }
},
{
  id: 'N05',
  category: 'Administrative',
  type: 'Transport Delay',
  channels: {
    sms: true,
    app: true,
    email: false
  }
},
{
  id: 'N06',
  category: 'Administrative',
  type: 'Circulars/Notices',
  channels: {
    sms: false,
    app: true,
    email: true
  }
}];

export function ParentPortalRules() {
  const navigate = useNavigate();
  // State
  const [modules, setModules] = useState<ModuleAccess[]>(INITIAL_MODULES);
  const [notifications, setNotifications] = useState<NotificationPreference[]>(
    INITIAL_NOTIFICATIONS
  );
  // Tab 1 Settings State
  const [parentAccountType, setParentAccountType] = useState('shared');
  const [usernameFormat, setUsernameFormat] = useState('mobile');
  const [passwordPolicy, setPasswordPolicy] = useState({
    minChars: true,
    specialChar: true,
    forceChange: false
  });
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  // Blocking Rules State
  const [blockingRules, setBlockingRules] = useState({
    tcIssued: true,
    feeDefault: {
      enabled: false,
      days: 60
    },
    disciplinary: true
  });
  // --- Handlers ---
  const toggleModuleScope = (id: string) => {
    setModules(
      modules.map((m) =>
      m.id === id ?
      {
        ...m,
        isEnabled: !m.isEnabled
      } :
      m
      )
    );
  };
  const togglePermission = (id: string, type: 'view' | 'add' | 'edit') => {
    setModules(
      modules.map((m) => {
        if (m.id === id) {
          const newPerms = {
            ...m.permissions,
            [type]: !m.permissions[type]
          };
          // Logic: if add or edit is checked, ensure view is checked
          if ((type === 'add' || type === 'edit') && newPerms[type]) {
            newPerms.view = true;
          }
          return {
            ...m,
            permissions: newPerms
          };
        }
        return m;
      })
    );
  };
  const toggleNotification = (id: string, channel: 'sms' | 'app' | 'email') => {
    setNotifications(
      notifications.map((n) =>
      n.id === id ?
      {
        ...n,
        channels: {
          ...n.channels,
          [channel]: !n.channels[channel]
        }
      } :
      n
      )
    );
  };
  const handleSave = () => {
    // Validation
    if (blockingRules.feeDefault.enabled && blockingRules.feeDefault.days < 1) {
      alert('Fee Default days must be at least 1.');
      return;
    }
    // Save logic would go here
    alert('Parent portal access rules saved.');
  };
  // --- Render Functions ---
  const renderAccessLoginTab = () =>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* 1. Parent Accounts & Module Scope */}
      <div className="space-y-6">
        <Card title="Parent Accounts">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Model
              </label>
              <Select
              options={[
              {
                value: 'shared',
                label: 'One shared account per student'
              },
              {
                value: 'individual',
                label: 'Individual accounts for Father/Mother'
              }]
              }
              value={parentAccountType}
              onChange={(val) => setParentAccountType(val)} />

              <p className="text-xs text-gray-500 mt-1">
                {parentAccountType === 'shared' ?
              'Both parents use one login per student.' :
              'Separate logins for Father & Mother; guardians may be added.'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Module Access Scope">
          <p className="text-sm text-gray-500 mb-4">
            Decide which modules appear in the parent portal. Detailed
            permissions are configured on the Module Permissions tab.
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {modules.map((module) =>
          <div
            key={module.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">

                <div>
                  <span className="font-medium text-sm text-gray-900 block">
                    {module.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {module.description}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                type="checkbox"
                className="sr-only peer"
                checked={module.isEnabled}
                onChange={() => toggleModuleScope(module.id)} />

                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
          )}
          </div>
        </Card>
      </div>

      {/* 2. Login Security & 3. Access Restrictions */}
      <div className="space-y-6">
        <Card title="Login Security">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username Format
              </label>
              <Select
              options={[
              {
                value: 'mobile',
                label: 'Registered Mobile Number'
              },
              {
                value: 'email',
                label: 'Registered Email'
              },
              {
                value: 'gr_no',
                label: 'Student GR Number'
              },
              {
                value: 'system',
                label: 'System Generated ID'
              }]
              }
              value={usernameFormat}
              onChange={(val) => setUsernameFormat(val)} />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Policy
              </label>
              <div className="space-y-2 text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={passwordPolicy.minChars}
                  onChange={(e) =>
                  setPasswordPolicy({
                    ...passwordPolicy,
                    minChars: e.target.checked
                  })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  Require minimum 8 characters
                </label>
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={passwordPolicy.specialChar}
                  onChange={(e) =>
                  setPasswordPolicy({
                    ...passwordPolicy,
                    specialChar: e.target.checked
                  })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  Require special character & number
                </label>
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={passwordPolicy.forceChange}
                  onChange={(e) =>
                  setPasswordPolicy({
                    ...passwordPolicy,
                    forceChange: e.target.checked
                  })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  Force password change on first login
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-sm font-medium block text-gray-900">
                  Two-Factor Auth (OTP)
                </span>
                <span className="text-xs text-gray-500">
                  Send OTP to mobile on login.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                type="checkbox"
                className="sr-only peer"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)} />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {twoFactorAuth && usernameFormat !== 'mobile' &&
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Note: OTP will be sent to the registered mobile number. Ensure
                mobile is captured for all accounts.
              </p>
          }
          </div>
        </Card>

        <Card
        title="Access Restrictions"
        className="border-l-4 border-l-red-500">

          <div className="space-y-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full text-red-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-red-900">
                  Auto-Blocking Rules
                </h4>
                <p className="text-xs text-red-700">
                  Automatically revoke portal access when these conditions are
                  met.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${blockingRules.tcIssued ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>

                <div className="flex items-center gap-3">
                  <input
                  type="checkbox"
                  checked={blockingRules.tcIssued}
                  onChange={(e) =>
                  setBlockingRules({
                    ...blockingRules,
                    tcIssued: e.target.checked
                  })
                  }
                  className="rounded text-red-600 focus:ring-red-500" />

                  <div>
                    <span className="font-medium text-sm text-gray-900">
                      TC Issued
                    </span>
                    <p className="text-xs text-gray-500">
                      Block immediately when Transfer Certificate is issued.
                    </p>
                  </div>
                </div>
                {blockingRules.tcIssued &&
              <Lock className="w-4 h-4 text-red-500" />
              }
              </label>

              <div
              className={`p-3 border rounded-lg transition-colors ${blockingRules.feeDefault.enabled ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>

                <label className="flex items-center gap-3 cursor-pointer mb-2">
                  <input
                  type="checkbox"
                  checked={blockingRules.feeDefault.enabled}
                  onChange={(e) =>
                  setBlockingRules({
                    ...blockingRules,
                    feeDefault: {
                      ...blockingRules.feeDefault,
                      enabled: e.target.checked
                    }
                  })
                  }
                  className="rounded text-red-600 focus:ring-red-500" />

                  <span className="font-medium text-sm text-gray-900">
                    Fee Default
                  </span>
                </label>
                <div className="flex items-center gap-2 text-xs pl-7">
                  <span>Block if overdue &gt;</span>
                  <input
                  type="number"
                  className="w-16 border rounded px-2 py-1 text-center"
                  value={blockingRules.feeDefault.days}
                  onChange={(e) =>
                  setBlockingRules({
                    ...blockingRules,
                    feeDefault: {
                      ...blockingRules.feeDefault,
                      days: parseInt(e.target.value)
                    }
                  })
                  }
                  disabled={!blockingRules.feeDefault.enabled} />

                  <span>days</span>
                </div>
              </div>

              <label
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${blockingRules.disciplinary ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>

                <div className="flex items-center gap-3">
                  <input
                  type="checkbox"
                  checked={blockingRules.disciplinary}
                  onChange={(e) =>
                  setBlockingRules({
                    ...blockingRules,
                    disciplinary: e.target.checked
                  })
                  }
                  className="rounded text-red-600 focus:ring-red-500" />

                  <div>
                    <span className="font-medium text-sm text-gray-900">
                      Disciplinary
                    </span>
                    <p className="text-xs text-gray-500">
                      Block if student is suspended.
                    </p>
                  </div>
                </div>
                {blockingRules.disciplinary &&
              <Lock className="w-4 h-4 text-red-500" />
              }
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>;

  const renderPermissionsTab = () =>
  <div className="pb-6">
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 w-1/2">Module</th>
                <th className="px-6 py-3 text-center">View</th>
                <th className="px-6 py-3 text-center">Add</th>
                <th className="px-6 py-3 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {modules.
            filter((m) => m.isEnabled).
            map((module) =>
            <tr key={module.id} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {module.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {module.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                  type="checkbox"
                  checked={module.permissions.view}
                  onChange={() => togglePermission(module.id, 'view')}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer" />

                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                  type="checkbox"
                  checked={module.permissions.add}
                  onChange={() => togglePermission(module.id, 'add')}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer" />

                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                  type="checkbox"
                  checked={module.permissions.edit}
                  onChange={() => togglePermission(module.id, 'edit')}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer" />

                    </td>
                  </tr>
            )}
              {modules.filter((m) => m.isEnabled).length === 0 &&
            <tr>
                  <td
                colSpan={4}
                className="px-6 py-8 text-center text-gray-500 italic">

                    No modules enabled. Enable modules in the "Access & Login"
                    tab first.
                  </td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </Card>
    </div>;

  const renderNotificationsTab = () =>
  <div className="pb-6">
      <Card title="Default Notification Preferences">
        <p className="text-sm text-gray-500 mb-6">
          Set default subscription settings for new parent accounts. Parents can
          change these unless marked as 'Force' in future versions.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academic Alerts */}
          <div>
            <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" /> Academic Alerts
            </h4>
            <div className="space-y-4">
              {notifications.
            filter((n) => n.category === 'Academic').
            map((n) =>
            <div
              key={n.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded hover:bg-gray-50">

                    <span className="text-sm font-medium text-gray-700">
                      {n.type}
                    </span>
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={n.channels.sms}
                    onChange={() => toggleNotification(n.id, 'sms')}
                    className="rounded text-blue-600" />
                  {' '}
                        SMS
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={n.channels.app}
                    onChange={() => toggleNotification(n.id, 'app')}
                    className="rounded text-blue-600" />
                  {' '}
                        App
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={n.channels.email}
                    onChange={() => toggleNotification(n.id, 'email')}
                    className="rounded text-blue-600" />
                  {' '}
                        Email
                      </label>
                    </div>
                  </div>
            )}
            </div>
          </div>

          {/* Administrative Alerts */}
          <div>
            <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />{' '}
              Administrative Alerts
            </h4>
            <div className="space-y-4">
              {notifications.
            filter((n) => n.category === 'Administrative').
            map((n) =>
            <div
              key={n.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded hover:bg-gray-50">

                    <span className="text-sm font-medium text-gray-700">
                      {n.type}
                    </span>
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={n.channels.sms}
                    onChange={() => toggleNotification(n.id, 'sms')}
                    className="rounded text-blue-600" />
                  {' '}
                        SMS
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={n.channels.app}
                    onChange={() => toggleNotification(n.id, 'app')}
                    className="rounded text-blue-600" />
                  {' '}
                        App
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={n.channels.email}
                    onChange={() => toggleNotification(n.id, 'email')}
                    className="rounded text-blue-600" />
                  {' '}
                        Email
                      </label>
                    </div>
                  </div>
            )}
            </div>
          </div>
        </div>
      </Card>
    </div>;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header (Fixed) */}
      <div className="p-6 bg-white border-b sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student-settings')}
            className="text-gray-500">

            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Parent Portal Access Rules
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure features, permissions, and security for the parent
              portal.
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Rules
        </Button>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs
          tabs={[
          {
            id: 'access',
            label: 'Access & Login',
            content: renderAccessLoginTab()
          },
          {
            id: 'permissions',
            label: 'Module Permissions',
            content: renderPermissionsTab()
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: renderNotificationsTab()
          }]
          } />

      </div>
    </div>);

}