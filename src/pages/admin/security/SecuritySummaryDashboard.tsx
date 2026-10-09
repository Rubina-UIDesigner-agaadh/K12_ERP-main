// SecuritySummaryDashboard.tsx - Security Monitoring & Analytics Dashboard
import React, { useState } from 'react';
import {
  Users, Lock, AlertTriangle, ShieldCheck, Activity, Monitor, Smartphone,
  Tablet, Globe, Clock, TrendingUp, TrendingDown, Download, Filter, Calendar,
  Eye, UserX, UserCheck, KeyRound, MapPin, Wifi, AlertCircle, FileText,
  PieChart, BarChart3, RefreshCw, Bell, Shield, Unlock, LogIn, LogOut } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

// Types
interface Metric {title: string;value: string | number;change: string;trend: 'up' | 'down' | 'neutral';icon: React.ElementType;color: string;}
interface Alert {id: string;type: 'critical' | 'warning' | 'info';title: string;description: string;time: string;count?: number;}

// Mock Data
const USER_METRICS: Metric[] = [
{ title: 'Total Active Users', value: '1,245', change: '+12 this week', trend: 'up', icon: UserCheck, color: 'blue' },
{ title: 'Inactive Users', value: '156', change: '-8 this month', trend: 'down', icon: UserX, color: 'gray' },
{ title: 'Locked Accounts', value: '8', change: 'Requires attention', trend: 'neutral', icon: Lock, color: 'amber' },
{ title: 'New Users (7 Days)', value: '34', change: '+15% vs last week', trend: 'up', icon: Users, color: 'green' }];


const LOGIN_METRICS: Metric[] = [
{ title: 'Total Logins Today', value: '2,847', change: '+18% vs yesterday', trend: 'up', icon: LogIn, color: 'blue' },
{ title: 'Failed Attempts', value: '23', change: '-5 from yesterday', trend: 'down', icon: AlertTriangle, color: 'red' },
{ title: 'Suspicious Alerts', value: '3', change: 'Action required', trend: 'neutral', icon: AlertCircle, color: 'orange' },
{ title: 'Peak Login Time', value: '9:30 AM', change: '485 concurrent users', trend: 'neutral', icon: Clock, color: 'purple' }];


const ROLE_DATA = [
{ role: 'Students', count: 850, percentage: 52, color: 'bg-blue-500' },
{ role: 'Parents', count: 620, percentage: 38, color: 'bg-green-500' },
{ role: 'Teachers', count: 120, percentage: 7, color: 'bg-purple-500' },
{ role: 'Staff', count: 45, percentage: 3, color: 'bg-amber-500' },
{ role: 'Admins', count: 8, percentage: 0.5, color: 'bg-red-500' }];


const DEPARTMENT_DATA = [
{ dept: 'Academic', users: 180, color: 'bg-blue-500' },
{ dept: 'Admin', users: 45, color: 'bg-green-500' },
{ dept: 'Finance', users: 25, color: 'bg-purple-500' },
{ dept: 'HR', users: 15, color: 'bg-amber-500' },
{ dept: 'IT', users: 12, color: 'bg-red-500' },
{ dept: 'Library', users: 8, color: 'bg-teal-500' }];


const DEVICE_DATA = [
{ type: 'Desktop', icon: Monitor, count: 1420, percentage: 58, color: 'blue' },
{ type: 'Mobile', icon: Smartphone, count: 856, percentage: 35, color: 'green' },
{ type: 'Tablet', icon: Tablet, count: 171, percentage: 7, color: 'purple' }];


const IP_SUMMARY = [
{ range: '192.168.1.x (School Network)', logins: 1845, status: 'trusted' },
{ range: '10.0.0.x (Staff Network)', logins: 432, status: 'trusted' },
{ range: 'External IPs', logins: 570, status: 'monitored' }];


const RECENT_LOCATIONS = [
{ location: 'Delhi, India', logins: 2100, flag: '🇮🇳' },
{ location: 'Mumbai, India', logins: 320, flag: '🇮🇳' },
{ location: 'Bangalore, India', logins: 180, flag: '🇮🇳' },
{ location: 'Unknown', logins: 12, flag: '⚠️' }];


const SECURITY_ALERTS: Alert[] = [
{ id: '1', type: 'critical', title: 'Multiple Failed Login Attempts', description: '5 accounts exceeded max attempts', time: '10 mins ago', count: 5 },
{ id: '2', type: 'warning', title: 'Password Expiry Alerts', description: '23 users with passwords expiring in 7 days', time: '1 hour ago', count: 23 },
{ id: '3', type: 'critical', title: 'Accounts Locked Today', description: 'Auto-locked due to security policy', time: '2 hours ago', count: 3 },
{ id: '4', type: 'warning', title: 'Unauthorized Access Attempts', description: 'Blocked access from unknown IPs', time: '3 hours ago', count: 8 },
{ id: '5', type: 'info', title: 'New Device Login', description: '12 users logged in from new devices', time: '4 hours ago', count: 12 }];


const RECENT_ACTIVITY = [
{ user: 'System Admin', action: 'Updated Role Permissions', target: 'Teacher Role', time: '10 mins ago', type: 'config', icon: ShieldCheck },
{ user: 'Sarah Smith', action: 'Failed Login Attempt', target: 'IP: 192.168.1.45', time: '25 mins ago', type: 'alert', icon: AlertTriangle },
{ user: 'System Admin', action: 'Unlocked Account', target: 'Robert Johnson', time: '1 hour ago', type: 'security', icon: Unlock },
{ user: 'System', action: 'Auto-locked Account', target: 'John Doe (3 failed attempts)', time: '2 hours ago', type: 'alert', icon: Lock },
{ user: 'HR Admin', action: 'Created New User', target: 'Emily Teacher', time: '3 hours ago', type: 'user', icon: Users },
{ user: 'System Admin', action: 'Password Reset', target: 'Bulk reset (15 users)', time: '4 hours ago', type: 'security', icon: KeyRound }];


const ROLES = ['All Roles', 'System Admin', 'Teacher', 'Student', 'Parent', 'Staff'];
const USER_TYPES = ['All Types', 'Admin', 'Teacher', 'Employee', 'Student', 'Parent'];
const DEPARTMENTS = ['All Departments', 'Academic', 'Administration', 'Finance', 'HR', 'IT'];
const CLASSES = ['All Classes', '1-A', '1-B', '2-A', '2-B', '3-A', '10-A', '10-B', '12-A'];

export function SecuritySummaryDashboard() {
  const [filters, setFilters] = useState({ dateRange: 'today', role: '', userType: '', department: '', class: '' });
  const [showReportModal, setShowReportModal] = useState(false);

  // Metric Card Component
  const MetricCard = ({ m }: {m: Metric;}) =>
  <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{m.title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{m.value}</h3>
          <p className={`text-xs mt-1 flex items-center gap-1 ${m.trend === 'up' ? 'text-green-600' : m.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
            {m.trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {m.trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {m.change}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${m.color}-100`}>
          <m.icon className={`w-6 h-6 text-${m.color}-600`} />
        </div>
      </div>
    </Card>;


  // Alert Badge
  const alertBadge = (type: string) => {
    const variants: Record<string, 'danger' | 'warning' | 'info'> = { critical: 'danger', warning: 'warning', info: 'info' };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" /> Security Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time security monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-500 animate-pulse" /> Live • Last updated: {new Date().toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
          <Button variant="primary" size="sm" onClick={() => setShowReportModal(true)}><Download className="w-4 h-4 mr-2" /> Reports</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Select options={[{ value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: '7days', label: 'Last 7 Days' }, { value: '30days', label: 'Last 30 Days' }, { value: 'custom', label: 'Custom Range' }]} value={filters.dateRange} onChange={(v) => setFilters({ ...filters, dateRange: v })} />
          <Select placeholder="Role" options={ROLES.map((r) => ({ value: r, label: r }))} value={filters.role} onChange={(v) => setFilters({ ...filters, role: v })} />
          <Select placeholder="User Type" options={USER_TYPES.map((t) => ({ value: t, label: t }))} value={filters.userType} onChange={(v) => setFilters({ ...filters, userType: v })} />
          <Select placeholder="Department" options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} value={filters.department} onChange={(v) => setFilters({ ...filters, department: v })} />
          <Select placeholder="Class" options={CLASSES.map((c) => ({ value: c, label: c }))} value={filters.class} onChange={(v) => setFilters({ ...filters, class: v })} />
          <Button variant="outline" onClick={() => setFilters({ dateRange: 'today', role: '', userType: '', department: '', class: '' })}>Reset</Button>
        </div>
      </Card>

      {/* User Overview Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><Users className="w-5 h-5" /> User Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {USER_METRICS.map((m, i) => <MetricCard key={i} m={m} />)}
        </div>
      </div>

      {/* Login Activity Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><LogIn className="w-5 h-5" /> Login Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOGIN_METRICS.map((m, i) => <MetricCard key={i} m={m} />)}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution - Pie Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><PieChart className="w-5 h-5 text-blue-600" /> Users by Role</h3>
          </div>
          <div className="flex items-center gap-6">
            {/* Simple Pie Chart */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {ROLE_DATA.reduce((acc, item, i) => {
                  const offset = acc.offset;
                  acc.elements.push(
                    <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={item.color.replace('bg-', '')} strokeWidth="20"
                    strokeDasharray={`${item.percentage * 2.51} 251`} strokeDashoffset={-offset * 2.51}
                    className={item.color.replace('bg-', 'stroke-')} />
                  );
                  acc.offset += item.percentage;
                  return acc;
                }, { offset: 0, elements: [] as JSX.Element[] }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{ROLE_DATA.reduce((s, r) => s + r.count, 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
              {ROLE_DATA.map((r, i) =>
              <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${r.color}`} />
                    <span className="text-sm text-gray-700">{r.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{r.count}</span>
                    <span className="text-xs text-gray-500 ml-1">({r.percentage}%)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Department Distribution - Bar Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-600" /> Users by Department</h3>
          </div>
          <div className="space-y-3">
            {DEPARTMENT_DATA.map((d, i) =>
            <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{d.dept}</span>
                  <span className="font-medium text-gray-900">{d.users}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${d.color} transition-all`} style={{ width: `${d.users / 180 * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Device & Location Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Type */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-600" /> Login by Device</h3>
          <div className="space-y-4">
            {DEVICE_DATA.map((d, i) =>
            <div key={i} className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-${d.color}-100`}>
                  <d.icon className={`w-5 h-5 text-${d.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{d.type}</span>
                    <span className="text-sm text-gray-500">{d.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-${d.color}-500`} style={{ width: `${d.percentage}%` }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{d.count.toLocaleString()}</span>
              </div>
            )}
          </div>
        </Card>

        {/* IP Summary */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Wifi className="w-5 h-5 text-green-600" /> IP Summary</h3>
          <div className="space-y-3">
            {IP_SUMMARY.map((ip, i) =>
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{ip.range}</p>
                  <Badge variant={ip.status === 'trusted' ? 'success' : 'warning'} className="text-xs mt-1">{ip.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{ip.logins.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">logins</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Login Locations */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-600" /> Login Locations</h3>
          <div className="space-y-3">
            {RECENT_LOCATIONS.map((loc, i) =>
            <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{loc.flag}</span>
                  <span className="text-sm text-gray-700">{loc.location}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{loc.logins.toLocaleString()}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Security Alerts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Alerts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" /> Security Alerts
              <Badge variant="danger" className="ml-2">{SECURITY_ALERTS.filter((a) => a.type === 'critical').length} Critical</Badge>
            </h3>
            <Button variant="ghost" size="xs">View All</Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {SECURITY_ALERTS.map((alert) =>
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.type === 'critical' ? 'bg-red-50 border-red-500' : alert.type === 'warning' ? 'bg-amber-50 border-amber-500' : 'bg-blue-50 border-blue-500'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                      {alertBadge(alert.type)}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                  </div>
                  {alert.count && <span className="text-lg font-bold text-gray-900">{alert.count}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Recent Activity</h3>
            <Button variant="ghost" size="xs">View All</Button>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {RECENT_ACTIVITY.map((act, i) =>
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`p-2 rounded-full flex-shrink-0 ${act.type === 'alert' ? 'bg-red-100 text-red-600' : act.type === 'config' ? 'bg-blue-100 text-blue-600' : act.type === 'security' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  <act.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{act.action}</p>
                  <p className="text-xs text-gray-500">by {act.user}</p>
                  <p className="text-xs text-gray-400 truncate">{act.target}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{act.time}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
        { label: '2FA Enabled', value: '892', icon: ShieldCheck, color: 'green' },
        { label: 'Sessions Active', value: '1,156', icon: Activity, color: 'blue' },
        { label: 'Password Resets', value: '45', icon: KeyRound, color: 'purple' },
        { label: 'Avg Session', value: '24 min', icon: Clock, color: 'amber' },
        { label: 'Blocked IPs', value: '12', icon: Globe, color: 'red' },
        { label: 'API Requests', value: '15.2K', icon: Wifi, color: 'teal' }].
        map((s, i) =>
        <Card key={i} className="p-4 text-center">
            <s.icon className={`w-6 h-6 mx-auto text-${s.color}-600 mb-2`} />
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Card>
        )}
      </div>

      {/* Reports Modal */}
      {showReportModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[450px] p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Download Reports</h2>
            <div className="space-y-3">
              {[
            { name: 'Login Activity Report', desc: 'All login attempts with timestamps and IPs', icon: LogIn },
            { name: 'User Access Report', desc: 'User permissions and role assignments', icon: Users },
            { name: 'Suspicious Activity Report', desc: 'Failed attempts and security alerts', icon: AlertTriangle },
            { name: 'Password Audit Report', desc: 'Password expiry and reset history', icon: KeyRound },
            { name: 'Device & Location Report', desc: 'Login devices and geographic data', icon: Globe }].
            map((r, i) =>
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <r.icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="xs" title="Excel"><FileText className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="xs" title="PDF"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
            )}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowReportModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default SecuritySummaryDashboard;