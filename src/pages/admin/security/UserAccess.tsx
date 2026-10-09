import React, { useEffect, useState } from 'react';
import {
  Search,
  Save,
  Clock,
  Globe,
  Shield,
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Eye,
  Bell,
  Building,
  Users,
  BookOpen,
  Lock,
  Filter,
  Download,
  Settings,
  Info,
  Zap,
  Key,
  UserCheck,
  Layers,
  FileText,
  MousePointer,
  AlertCircle,
  Monitor,
  Smartphone,
  Fingerprint,
  Copy,
  History,
  Activity,
  Server,
  Database,
  MapPin,
  Timer,
  Plus,
  Trash2,
  Edit,
  GitBranch,
  LogOut } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
// ============================================================================
// TYPES & CONSTANTS
// ============================================================================
export interface User {
  id: string;
  name: string;
  loginId: string;
  role: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  lastLogin: string;
  email: string;
  phone: string;
  department: string;
}
interface TempAccess {
  id: string;
  type: 'module' | 'role';
  name: string;
  startDate: string;
  endDate: string;
  branch: string;
  extended: number;
}
const USERS: User[] = [
{
  id: 'u1',
  name: 'Sarah Smith',
  loginId: 't.sarah',
  role: 'Teacher',
  status: 'Active',
  avatar: 'SS',
  lastLogin: 'Today, 08:45 AM',
  email: 'sarah@school.edu',
  phone: '+91 9876543210',
  department: 'Science'
},
{
  id: 'u2',
  name: 'John Doe',
  loginId: 'a.john',
  role: 'Admin',
  status: 'Active',
  avatar: 'JD',
  lastLogin: 'Yesterday, 05:30 PM',
  email: 'john@school.edu',
  phone: '+91 9876543211',
  department: 'Administration'
},
{
  id: 'u3',
  name: 'Mike Wilson',
  loginId: 't.mike',
  role: 'Teacher',
  status: 'Inactive',
  avatar: 'MW',
  lastLogin: '3 days ago',
  email: 'mike@school.edu',
  phone: '+91 9876543212',
  department: 'Commerce'
},
{
  id: 'u4',
  name: 'Emily Brown',
  loginId: 'f.emily',
  role: 'Finance',
  status: 'Active',
  avatar: 'EB',
  lastLogin: 'Today, 09:15 AM',
  email: 'emily@school.edu',
  phone: '+91 9876543213',
  department: 'Finance'
},
{
  id: 'u5',
  name: 'Robert Johnson',
  loginId: 'p.robert',
  role: 'Principal',
  status: 'Active',
  avatar: 'RJ',
  lastLogin: 'Today, 07:30 AM',
  email: 'robert@school.edu',
  phone: '+91 9876543214',
  department: 'Administration'
}];

const MODULES = [
{
  id: 'm1',
  name: 'Student Management',
  icon: Users,
  submodules: [
  {
    id: 's1',
    name: 'Student List',
    pages: [
    {
      id: 'p1',
      name: 'View Students',
      actions: ['view', 'export', 'print']
    },
    {
      id: 'p2',
      name: 'Add Student',
      actions: ['create', 'import']
    },
    {
      id: 'p3',
      name: 'Edit Student',
      actions: ['edit', 'delete', 'archive']
    }]

  },
  {
    id: 's2',
    name: 'Attendance',
    pages: [
    {
      id: 'p4',
      name: 'Mark Attendance',
      actions: ['view', 'edit', 'bulk_mark']
    },
    {
      id: 'p5',
      name: 'Attendance Report',
      actions: ['view', 'export']
    }]

  },
  {
    id: 's3',
    name: 'Documents',
    pages: [
    {
      id: 'p6',
      name: 'Student Documents',
      actions: ['view', 'upload', 'download', 'delete']
    }]

  }]

},
{
  id: 'm2',
  name: 'Fee Management',
  icon: FileText,
  submodules: [
  {
    id: 's4',
    name: 'Fee Collection',
    pages: [
    {
      id: 'p7',
      name: 'Collect Fee',
      actions: ['view', 'collect', 'receipt', 'refund']
    },
    {
      id: 'p8',
      name: 'Fee Reports',
      actions: ['view', 'export', 'print']
    }]

  },
  {
    id: 's5',
    name: 'Fee Structure',
    pages: [
    {
      id: 'p9',
      name: 'Manage Structure',
      actions: ['view', 'create', 'edit', 'delete']
    }]

  }]

},
{
  id: 'm3',
  name: 'Academics',
  icon: BookOpen,
  submodules: [
  {
    id: 's6',
    name: 'Exam Management',
    pages: [
    {
      id: 'p10',
      name: 'Create Exam',
      actions: ['create', 'edit', 'delete', 'publish']
    },
    {
      id: 'p11',
      name: 'Enter Marks',
      actions: ['view', 'edit', 'lock']
    },
    {
      id: 'p12',
      name: 'Result Analysis',
      actions: ['view', 'export']
    }]

  },
  {
    id: 's7',
    name: 'Timetable',
    pages: [
    {
      id: 'p13',
      name: 'Class Timetable',
      actions: ['view', 'create', 'edit']
    }]

  }]

},
{
  id: 'm4',
  name: 'HR & Payroll',
  icon: Users,
  submodules: [
  {
    id: 's8',
    name: 'Employee Management',
    pages: [
    {
      id: 'p14',
      name: 'Employee List',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'p15',
      name: 'Leave Management',
      actions: ['view', 'approve', 'reject']
    }]

  },
  {
    id: 's9',
    name: 'Payroll',
    pages: [
    {
      id: 'p16',
      name: 'Salary Processing',
      actions: ['view', 'process', 'approve']
    }]

  }]

},
{
  id: 'm5',
  name: 'Transport',
  icon: MapPin,
  submodules: [
  {
    id: 's10',
    name: 'Routes',
    pages: [
    {
      id: 'p17',
      name: 'Manage Routes',
      actions: ['view', 'create', 'edit']
    }]

  }]

},
{
  id: 'm6',
  name: 'Library',
  icon: BookOpen,
  submodules: [
  {
    id: 's11',
    name: 'Books',
    pages: [
    {
      id: 'p18',
      name: 'Book Management',
      actions: ['view', 'add', 'issue', 'return']
    }]

  }]

},
{
  id: 'm7',
  name: 'Reports',
  icon: FileText,
  submodules: [
  {
    id: 's12',
    name: 'Analytics',
    pages: [
    {
      id: 'p19',
      name: 'Dashboard',
      actions: ['view', 'export']
    }]

  }]

},
{
  id: 'm8',
  name: 'Settings',
  icon: Settings,
  submodules: [
  {
    id: 's13',
    name: 'System',
    pages: [
    {
      id: 'p20',
      name: 'Configuration',
      actions: ['view', 'edit']
    }]

  }]

}];

const BRANCHES = [
'Main Campus',
'North Wing',
'City Center',
'South Branch',
'East Campus'];

const ROLES = [
'Super Admin',
'Principal',
'Vice Principal',
'Teacher',
'Accountant',
'HR Manager',
'Librarian',
'Receptionist'];

const CLASSES = [
'Nursery',
'LKG',
...Array.from(
  {
    length: 12
  },
  (_, i) => `Class ${i + 1}`
)];

const SECTIONS = [
'Section A',
'Section B',
'Section C',
'Section D',
'Section E'];

const DEPARTMENTS = [
'Science',
'Commerce',
'Arts',
'Administration',
'Finance',
'IT',
'Sports',
'Library'];

// ============================================================================
// UI COMPONENTS
// ============================================================================
const Card = ({
  title,
  icon: Icon,
  children,
  actions,
  className = ''
}: any) =>
<div
  className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
  
    {title &&
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          {Icon &&
      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600">
              <Icon className="w-4 h-4 text-white" />
            </div>
      }
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {actions}
      </div>
  }
    <div className="p-5">{children}</div>
  </div>;

const Badge = ({
  variant,
  children,
  size = 'sm'




}: {variant: 'success' | 'danger' | 'warning' | 'info' | 'default';children: React.ReactNode;size?: 'xs' | 'sm';}) => {
  const styles: any = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-slate-50 text-slate-700 border-slate-200'
  };
  return (
    <span
      className={`font-semibold rounded-full border ${styles[variant]} ${size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      
      {children}
    </span>);

};
const Toggle = ({ enabled, onChange, label, disabled = false }: any) =>
<button
  onClick={onChange}
  disabled={disabled}
  className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
  
    <div
    className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
    
      <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-6' : 'left-1'}`} />
    
    </div>
    {label &&
  <span className="text-sm font-medium text-slate-700">{label}</span>
  }
  </button>;

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  helper,
  disabled = false,
  className = ''
}: any) =>
<div className={className}>
    {label &&
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
  }
    <div className="relative">
      {Icon &&
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    }
      <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full border border-slate-200 rounded-lg py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${Icon ? 'pl-10 pr-4' : 'px-4'} ${disabled ? 'bg-slate-50' : ''}`} />
    
    </div>
    {helper && <p className="text-xs text-slate-500 mt-1">{helper}</p>}
  </div>;

const Select = ({ label, options, value, onChange, className = '' }: any) =>
<div className={className}>
    {label &&
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
  }
    <select
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
    
      {options.map((o: any) =>
    <option key={o.value} value={o.value}>
          {o.label}
        </option>
    )}
    </select>
  </div>;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actions
}: any) => {
  if (!isOpen) return null;
  const sizes: any = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}>
      
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}>
        
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg">
            
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {actions &&
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
            {actions}
          </div>
        }
      </div>
    </div>);

};
const Tabs = ({ tabs, activeTab, onChange }: any) =>
<div className="flex gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
    {tabs.map((tab: any) =>
  <button
    key={tab.id}
    onClick={() => onChange(tab.id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
    
        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
      </button>
  )}
  </div>;

// ============================================================================
// USER SELECTOR
// ============================================================================
const UserSelector = ({
  selectedUser,
  setSelectedUser



}: {selectedUser: User | null;setSelectedUser: (u: User | null) => void;}) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const filtered = USERS.filter(
    (u) =>
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.loginId.includes(search) ||
    u.email.includes(search)) && (
    filterRole === 'all' || u.role === filterRole) && (
    filterStatus === 'all' || u.status === filterStatus)
  );
  const roles = [...new Set(USERS.map((u) => u.role))];
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Select User</h2>
            <p className="text-blue-100 text-sm">
              Search and select a user to manage access
            </p>
          </div>
        </div>
        {selectedUser &&
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedUser(null)}
          className="bg-white/10 border-white/30 text-white hover:bg-white/20">
          
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        }
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search by name, ID, email..."
              className="w-full bg-white rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg" />
            
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          {showDropdown &&
          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-80 overflow-auto">
              {filtered.length ?
            filtered.map((u) =>
            <button
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                setShowDropdown(false);
                setSearch('');
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50 text-left border-b border-slate-100 last:border-0 ${selectedUser?.id === u.id ? 'bg-blue-50' : ''}`}>
              
                    <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${u.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {u.loginId} • {u.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                  variant={u.status === 'Active' ? 'success' : 'danger'}
                  size="xs">
                  
                        {u.status}
                      </Badge>
                      <span className="text-xs text-slate-500">{u.role}</span>
                    </div>
                  </button>
            ) :

            <div className="px-4 py-8 text-center">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No users found</p>
                </div>
            }
            </div>
          }
        </div>
        <div className="lg:col-span-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3.5 text-sm font-medium [&>option]:text-slate-900">
            
            <option value="all">All Roles</option>
            {roles.map((r) =>
            <option key={r} value={r}>
                {r}
              </option>
            )}
          </select>
        </div>
        <div className="lg:col-span-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3.5 text-sm font-medium [&>option]:text-slate-900">
            
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="lg:col-span-3">
          {selectedUser ?
          <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                {selectedUser.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {selectedUser.name}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedUser.role} • {selectedUser.department}
                </p>
              </div>
              <Badge
              variant={
              selectedUser.status === 'Active' ? 'success' : 'danger'
              }>
              
                {selectedUser.status}
              </Badge>
            </div> :

          <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-xl p-3 text-center">
              <p className="text-white/70 text-sm">No user selected</p>
            </div>
          }
        </div>
      </div>
      {selectedUser &&
      <div className="mt-4 bg-white/10 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
        {
          icon: Shield,
          label: 'Role',
          value: selectedUser.role
        },
        {
          icon: Building,
          label: 'Department',
          value: selectedUser.department
        },
        {
          icon: Key,
          label: 'Login ID',
          value: selectedUser.loginId
        },
        {
          icon: Clock,
          label: 'Last Login',
          value: selectedUser.lastLogin
        }].
        map((item) =>
        <div key={item.label} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-blue-200" />
              <div>
                <p className="text-[10px] text-blue-200 uppercase">
                  {item.label}
                </p>
                <p className="text-sm text-white font-medium truncate">
                  {item.value}
                </p>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

};
// ============================================================================
// PERMISSION TREE - SIMPLIFIED (ALLOWED/DENIED ONLY)
// ============================================================================
const PermissionTree = ({
  selectedUser,
  permissions,
  setPermissions,
  selectedBranch
}: any) => {
  const [expanded, setExpanded] = useState<string[]>(['m1', 's1']);
  const [search, setSearch] = useState('');
  const toggle = (id: string, arr: string[], setArr: any) =>
  setArr((p: string[]) =>
  p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
  );
  const cyclePermission = (key: string) =>
  setPermissions((p: any) => ({
    ...p,
    [key]: {
      status: p[key]?.status === 'allowed' ? 'denied' : 'allowed',
      branch: selectedBranch
    }
  }));
  const setAll = (status: 'allowed' | 'denied') => {
    const newPerms: any = {};
    MODULES.forEach((m) => {
      newPerms[`${m.id}-${selectedBranch}`] = {
        status,
        branch: selectedBranch
      };
      m.submodules.forEach((s) => {
        newPerms[`${s.id}-${selectedBranch}`] = {
          status,
          branch: selectedBranch
        };
        s.pages.forEach((p) => {
          newPerms[`${p.id}-${selectedBranch}`] = {
            status,
            branch: selectedBranch
          };
          p.actions.forEach(
            (a) =>
            newPerms[`${p.id}-${a}-${selectedBranch}`] = {
              status,
              branch: selectedBranch
            }
          );
        });
      });
    });
    setPermissions((p: any) => ({
      ...p,
      ...newPerms
    }));
  };
  const PermBtn = ({ permKey }: {permKey: string;}) => {
    const perm = permissions[`${permKey}-${selectedBranch}`] || {
      status: 'allowed'
    };
    const cfg =
    perm.status === 'allowed' ?
    {
      bg: 'bg-emerald-100 hover:bg-emerald-200',
      border: 'border-emerald-300',
      icon: Check,
      color: 'text-emerald-600'
    } :
    {
      bg: 'bg-rose-100 hover:bg-rose-200',
      border: 'border-rose-300',
      icon: X,
      color: 'text-rose-600'
    };
    return (
      <button
        onClick={() => cyclePermission(permKey)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${cfg.bg} ${cfg.border} transition-all`}>
        
        <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
        <span className={`text-xs font-semibold ${cfg.color} capitalize`}>
          {perm.status}
        </span>
      </button>);

  };
  if (!selectedUser)
  return (
    <Card title="Module Permissions" icon={Key}>
        <div className="text-center py-16">
          <Lock className="w-16 h-16 mx-auto mb-4 text-slate-200" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No User Selected
          </h3>
          <p className="text-sm text-slate-500">
            Select a user to manage permissions
          </p>
        </div>
      </Card>);

  return (
    <Card
      title={`Module Permissions - ${selectedBranch}`}
      icon={Key}
      actions={
      <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAll('allowed')}>
            <Check className="w-4 h-4 mr-1" />
            Allow All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAll('denied')}>
            <X className="w-4 h-4 mr-1" />
            Deny All
          </Button>
        </div>
      }>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-600">Legend:</span>
          {[
          {
            color: 'bg-emerald-500',
            label: 'Allowed'
          },
          {
            color: 'bg-rose-500',
            label: 'Denied'
          }].
          map((l) =>
          <div key={l.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              <span className="text-xs text-slate-600">{l.label}</span>
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64" />
          
        </div>
      </div>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">
            Inherited from Role: {selectedUser.role}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Click permission badge to toggle between Allowed and Denied
          </p>
        </div>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-auto">
        {MODULES.filter(
          (m) => !search || m.name.toLowerCase().includes(search.toLowerCase())
        ).map((module) =>
        <div
          key={module.id}
          className="border border-slate-200 rounded-xl overflow-hidden">
          
            <div
            className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100"
            onClick={() => toggle(module.id, expanded, setExpanded)}>
            
              <div className="flex items-center gap-3">
                {expanded.includes(module.id) ?
              <ChevronDown className="w-5 h-5 text-slate-500" /> :

              <ChevronRight className="w-5 h-5 text-slate-500" />
              }
                <module.icon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-800">
                  {module.name}
                </span>
                <Badge variant="info" size="xs">
                  Module
                </Badge>
              </div>
              <PermBtn permKey={module.id} />
            </div>
            {expanded.includes(module.id) &&
          <div className="border-t border-slate-200">
                {module.submodules.map((sub) =>
            <div key={sub.id}>
                    <div
                className="flex items-center justify-between px-4 py-2.5 pl-12 bg-white cursor-pointer hover:bg-slate-50 border-b border-slate-100"
                onClick={() => toggle(sub.id, expanded, setExpanded)}>
                
                      <div className="flex items-center gap-3">
                        {expanded.includes(sub.id) ?
                  <ChevronDown className="w-4 h-4 text-slate-400" /> :

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  }
                        <Layers className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {sub.name}
                        </span>
                      </div>
                      <PermBtn permKey={sub.id} />
                    </div>
                    {expanded.includes(sub.id) &&
              <div className="bg-slate-50/50">
                        {sub.pages.map((page) =>
                <div
                  key={page.id}
                  className="px-4 py-3 pl-20 border-b border-slate-100 last:border-0">
                  
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                  {page.name}
                                </span>
                              </div>
                              <PermBtn permKey={page.id} />
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              {page.actions.map((action) => {
                      const perm = permissions[
                      `${page.id}-${action}-${selectedBranch}`] ||
                      {
                        status: 'allowed'
                      };
                      return (
                        <button
                          key={action}
                          onClick={() =>
                          cyclePermission(`${page.id}-${action}`)
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${perm.status === 'allowed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                          
                                    <MousePointer className="w-3 h-3 inline mr-1" />
                                    {action.replace('_', ' ')}
                                  </button>);

                    })}
                            </div>
                          </div>
                )}
                      </div>
              }
                  </div>
            )}
              </div>
          }
          </div>
        )}
      </div>
    </Card>);

};
// ============================================================================
// TEMPORARY ACCESS MANAGER
// ============================================================================
const TemporaryAccessManager = ({
  selectedUser,
  tempAccesses,
  setTempAccesses




}: {selectedUser: User | null;tempAccesses: TempAccess[];setTempAccesses: any;}) => {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<TempAccess | null>(null);
  const [form, setForm] = useState({
    type: 'module' as 'module' | 'role',
    name: '',
    startDate: '',
    endDate: '',
    branch: 'Main Campus'
  });
  const openAdd = (type: 'module' | 'role') => {
    setForm({
      type,
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      branch: 'Main Campus'
    });
    setEditItem(null);
    setShowModal(true);
  };
  const openEdit = (item: TempAccess) => {
    setForm({
      type: item.type,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      branch: item.branch
    });
    setEditItem(item);
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.name || !form.endDate) return;
    editItem ?
    setTempAccesses((p: TempAccess[]) =>
    p.map((t) =>
    t.id === editItem.id ?
    {
      ...t,
      ...form
    } :
    t
    )
    ) :
    setTempAccesses((p: TempAccess[]) => [
    ...p,
    {
      id: Date.now().toString(),
      ...form,
      extended: 0
    }]
    );
    setShowModal(false);
  };
  const handleExtend = (id: string, days: number) =>
  setTempAccesses((p: TempAccess[]) =>
  p.map((t) =>
  t.id === id ?
  {
    ...t,
    endDate: new Date(new Date(t.endDate).getTime() + days * 86400000).
    toISOString().
    split('T')[0],
    extended: t.extended + 1
  } :
  t
  )
  );
  const handleRemove = (id: string) =>
  setTempAccesses((p: TempAccess[]) => p.filter((t) => t.id !== id));
  const getDaysLeft = (end: string) =>
  Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
  if (!selectedUser) return null;
  return (
    <Card
      title="Temporary Access"
      icon={Timer}
      actions={
      <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openAdd('module')}>
            <Plus className="w-4 h-4 mr-1" />
            Module Access
          </Button>
          <Button variant="outline" size="sm" onClick={() => openAdd('role')}>
            <Plus className="w-4 h-4 mr-1" />
            Role Access
          </Button>
        </div>
      }>
      
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Temporary Access Management
            </p>
            <p className="text-xs text-amber-600">
              Grant time-limited module or role-based access with automatic
              expiration
            </p>
          </div>
        </div>

        {tempAccesses.length === 0 ?
        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Timer className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              No temporary access configured
            </p>
          </div> :

        <div className="space-y-3">
            {tempAccesses.map((item) => {
            const daysLeft = getDaysLeft(item.endDate);
            const isExpiring = daysLeft <= 3 && daysLeft > 0;
            const isExpired = daysLeft <= 0;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${isExpired ? 'bg-rose-50 border-rose-200' : isExpiring ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'module' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      
                        {item.type === 'module' ?
                      <Layers className="w-5 h-5 text-blue-600" /> :

                      <Shield className="w-5 h-5 text-purple-600" />
                      }
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.type === 'module' ?
                        'Module Access' :
                        'Role-based Access'}{' '}
                          • {item.branch}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                      variant={
                      isExpired ?
                      'danger' :
                      isExpiring ?
                      'warning' :
                      'success'
                      }>
                      
                        {isExpired ? 'Expired' : `${daysLeft} days left`}
                      </Badge>
                      {item.extended > 0 &&
                    <Badge variant="info" size="xs">
                          Extended {item.extended}x
                        </Badge>
                    }
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.startDate}
                      </span>
                      <span>→</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtend(item.id, 7)}>
                      
                        +7 Days
                      </Button>
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtend(item.id, 30)}>
                      
                        +30 Days
                      </Button>
                      <button
                      onClick={() => openEdit(item)}
                      className="p-2 hover:bg-slate-100 rounded-lg">
                      
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 hover:bg-rose-100 rounded-lg">
                      
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </div>
                </div>);

          })}
          </div>
        }
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${editItem ? 'Edit' : 'Add'} Temporary ${form.type === 'module' ? 'Module' : 'Role'} Access`}
        size="md"
        actions={
        <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <Select
            label={form.type === 'module' ? 'Select Module' : 'Select Role'}
            options={[
            {
              value: '',
              label: `Choose ${form.type}...`
            },
            ...(form.type === 'module' ?
            MODULES.map((m) => ({
              value: m.name,
              label: m.name
            })) :
            ROLES.map((r) => ({
              value: r,
              label: r
            })))]
            }
            value={form.name}
            onChange={(v: string) =>
            setForm((p) => ({
              ...p,
              name: v
            }))
            } />
          
          <Select
            label="Branch"
            options={BRANCHES.map((b) => ({
              value: b,
              label: b
            }))}
            value={form.branch}
            onChange={(v: string) =>
            setForm((p) => ({
              ...p,
              branch: v
            }))
            } />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e: any) =>
              setForm((p) => ({
                ...p,
                startDate: e.target.value
              }))
              } />
            
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e: any) =>
              setForm((p) => ({
                ...p,
                endDate: e.target.value
              }))
              } />
            
          </div>
        </div>
      </Modal>
    </Card>);

};
// ============================================================================
// BRANCH PERMISSIONS
// ============================================================================
const BranchPermissions = ({
  selectedUser,
  selectedBranch,
  setSelectedBranch,
  branchPermissions,
  setBranchPermissions
}: any) => {
  if (!selectedUser) return null;
  const toggleBranch = (branch: string) =>
  setBranchPermissions((p: any) => ({
    ...p,
    [branch]: {
      ...p[branch],
      enabled: !p[branch]?.enabled
    }
  }));
  return (
    <Card title="Branch-wise Permissions" icon={Building}>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Multi-Branch Access:</strong> Configure permissions
            separately for each branch. Select a branch to manage its specific
            permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BRANCHES.map((branch) => {
            const bp = branchPermissions[branch] || {
              enabled: false
            };
            return (
              <div
                key={branch}
                onClick={() => {
                  if (bp.enabled) setSelectedBranch(branch);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedBranch === branch ? 'border-blue-500 bg-blue-50' : bp.enabled ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400' : 'border-slate-200 bg-slate-50'}`}>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building
                      className={`w-5 h-5 ${selectedBranch === branch ? 'text-blue-600' : bp.enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    
                    <span className="font-semibold text-slate-800">
                      {branch}
                    </span>
                  </div>
                  <Toggle
                    enabled={bp.enabled}
                    onChange={(e: any) => {
                      e.stopPropagation();
                      toggleBranch(branch);
                    }} />
                  
                </div>
                <p className="text-xs text-slate-500">
                  {bp.enabled ? 'Access enabled' : 'No access'}
                </p>
                {selectedBranch === branch &&
                <Badge variant="info" size="xs">
                    Currently Editing
                  </Badge>
                }
              </div>);

          })}
        </div>
      </div>
    </Card>);

};
// ============================================================================
// SPECIAL ACCESS CONTROLS
// ============================================================================
const SpecialAccessControls = ({
  selectedUser,
  specialAccess,
  setSpecialAccess
}: any) => {
  const [tab, setTab] = useState('restrictions');
  if (!selectedUser) return null;
  const update = (k: string, v: any) =>
  setSpecialAccess((p: any) => ({
    ...p,
    [k]: v
  }));
  const toggleArr = (k: string, v: string) =>
  setSpecialAccess((p: any) => ({
    ...p,
    [k]: p[k]?.includes(v) ?
    p[k].filter((x: string) => x !== v) :
    [...(p[k] || []), v]
  }));
  return (
    <Card title="Special Access Controls" icon={Zap}>
      <Tabs
        tabs={[
        {
          id: 'restrictions',
          label: 'Data Restrictions',
          icon: Database
        },
        {
          id: 'security',
          label: 'Security',
          icon: Shield
        },
        {
          id: 'session',
          label: 'Session',
          icon: Monitor
        }]
        }
        activeTab={tab}
        onChange={setTab} />
      
      <div className="mt-6">
        {tab === 'restrictions' &&
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[
            {
              key: 'classes',
              label: 'Classes',
              icon: Users,
              items: CLASSES
            },
            {
              key: 'sections',
              label: 'Sections',
              icon: Layers,
              items: SECTIONS
            },
            {
              key: 'departments',
              label: 'Departments',
              icon: Building,
              items: DEPARTMENTS
            }].
            map(({ key, label, icon: Icon, items }) =>
            <div
              key={key}
              className="p-4 border border-slate-200 rounded-xl">
              
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-600" />
                    {label}
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <button
                  onClick={() =>
                  setSpecialAccess((p: any) => ({
                    ...p,
                    [key]: [...items]
                  }))
                  }
                  className="text-xs text-blue-600 hover:underline">
                  
                      All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                  onClick={() =>
                  setSpecialAccess((p: any) => ({
                    ...p,
                    [key]: []
                  }))
                  }
                  className="text-xs text-blue-600 hover:underline">
                  
                      Clear
                    </button>
                  </div>
                  <div className="max-h-40 overflow-auto space-y-1 border border-slate-100 rounded-lg p-2">
                    {items.map((item) =>
                <label
                  key={item}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                  
                        <input
                    type="checkbox"
                    checked={specialAccess[key]?.includes(item)}
                    onChange={() => toggleArr(key, item)}
                    className="rounded text-blue-600" />
                  
                        <span className="text-sm text-slate-700">{item}</span>
                      </label>
                )}
                  </div>
                </div>
            )}
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Data Operations
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Toggle
                enabled={specialAccess.canExport}
                onChange={() => update('canExport', !specialAccess.canExport)}
                label="Export" />
              
                <Toggle
                enabled={specialAccess.canPrint}
                onChange={() => update('canPrint', !specialAccess.canPrint)}
                label="Print" />
              
                <Toggle
                enabled={specialAccess.canDownload}
                onChange={() =>
                update('canDownload', !specialAccess.canDownload)
                }
                label="Download" />
              
                <Toggle
                enabled={specialAccess.canBulkEdit}
                onChange={() =>
                update('canBulkEdit', !specialAccess.canBulkEdit)
                }
                label="Bulk Edit" />
              
              </div>
            </div>
          </div>
        }
        {tab === 'security' &&
        <div className="space-y-6">
            {[
          {
            key: 'ipRestriction',
            label: 'IP Restriction',
            icon: Globe,
            content:
            <Input
              label="Allowed IPs"
              placeholder="192.168.1.1, 10.0.0.0/24"
              value={specialAccess.allowedIPs}
              onChange={(e: any) => update('allowedIPs', e.target.value)} />


          },
          {
            key: 'require2FA',
            label: 'Two-Factor Authentication',
            icon: Fingerprint,
            content:
            <Select
              label="2FA Method"
              options={[
              {
                value: 'email',
                label: 'Email OTP'
              },
              {
                value: 'sms',
                label: 'SMS OTP'
              },
              {
                value: 'authenticator',
                label: 'Authenticator App'
              }]
              }
              value={specialAccess.twoFAMethod || 'email'}
              onChange={(v: string) => update('twoFAMethod', v)} />


          }].
          map(({ key, label, icon: Icon, content }) =>
          <div key={key} className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-slate-800">{label}</h4>
                  </div>
                  <Toggle
                enabled={specialAccess[key]}
                onChange={() => update(key, !specialAccess[key])} />
              
                </div>
                {specialAccess[key] &&
            <div className="pt-4 border-t border-slate-100">
                    {content}
                  </div>
            }
              </div>
          )}
            <div className="p-4 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Password Policy
              </h4>
              <Toggle
              enabled={specialAccess.forcePasswordChange}
              onChange={() =>
              update(
                'forcePasswordChange',
                !specialAccess.forcePasswordChange
              )
              }
              label="Force Password Change" />
            
              <Input
              label="Password Expiry (days)"
              type="number"
              value={specialAccess.passwordExpiry || 90}
              onChange={(e: any) => update('passwordExpiry', e.target.value)} />
            
            </div>
          </div>
        }
        {tab === 'session' &&
        <div className="grid grid-cols-2 gap-6">
            <div className="p-4 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                Session
              </h4>
              <Input
              label="Timeout (min)"
              type="number"
              value={specialAccess.sessionTimeout || 30}
              onChange={(e: any) => update('sessionTimeout', e.target.value)} />
            
              <Input
              label="Max Sessions"
              type="number"
              value={specialAccess.maxSessions || 1}
              onChange={(e: any) => update('maxSessions', e.target.value)} />
            
              <Toggle
              enabled={specialAccess.singleSession}
              onChange={() =>
              update('singleSession', !specialAccess.singleSession)
              }
              label="Single Session Only" />
            
            </div>
            <div className="p-4 border border-slate-200 rounded-xl space-y-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Audit
              </h4>
              <Toggle
              enabled={specialAccess.logAllActions}
              onChange={() =>
              update('logAllActions', !specialAccess.logAllActions)
              }
              label="Log All Actions" />
            
              <Toggle
              enabled={specialAccess.emailOnLogin}
              onChange={() =>
              update('emailOnLogin', !specialAccess.emailOnLogin)
              }
              label="Email on Login" />
            
              <Toggle
              enabled={specialAccess.emailOnExport}
              onChange={() =>
              update('emailOnExport', !specialAccess.emailOnExport)
              }
              label="Email on Export" />
            
            </div>
          </div>
        }
      </div>
    </Card>);

};
// ============================================================================
// ACCESS SUMMARY
// ============================================================================
const AccessSummary = ({
  selectedUser,
  permissions,
  selectedBranch,
  tempAccesses,
  onViewSummary,
  onReset,
  onExport
}: any) => {
  if (!selectedUser) return null;
  const allowed = Object.values(permissions).filter(
    (p: any) => p.status === 'allowed'
  ).length;
  const denied = Object.values(permissions).filter(
    (p: any) => p.status === 'denied'
  ).length;
  const activeTempAccess = tempAccesses.filter(
    (t: TempAccess) => new Date(t.endDate) > new Date()
  ).length;
  return (
    <Card title="Access Summary" icon={Eye}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {[
          {
            label: 'Allowed',
            value: allowed || 24,
            color: 'emerald'
          },
          {
            label: 'Denied',
            value: denied || 3,
            color: 'rose'
          },
          {
            label: 'Temp Access',
            value: activeTempAccess,
            color: 'amber'
          },
          {
            label: 'Branch',
            value: selectedBranch?.split(' ')[0] || 'Main',
            color: 'blue'
          }].
          map((s) =>
          <div
            key={s.label}
            className={`text-center p-3 bg-${s.color}-50 rounded-xl border border-${s.color}-200`}>
            
              <p className={`text-2xl font-bold text-${s.color}-600`}>
                {s.value}
              </p>
              <p className={`text-xs text-${s.color}-700`}>{s.label}</p>
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSummary}
              className="justify-start">
              
              <Eye className="w-4 h-4 mr-2" />
              Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="justify-start">
              
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="justify-start">
              
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>
        {tempAccesses.
        filter((t: TempAccess) => {
          const d = Math.ceil(
            (new Date(t.endDate).getTime() - Date.now()) / 86400000
          );
          return d > 0 && d <= 7;
        }).
        map((t: TempAccess) =>
        <div
          key={t.id}
          className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                {t.name} access expires in{' '}
                {Math.ceil(
              (new Date(t.endDate).getTime() - Date.now()) / 86400000
            )}{' '}
                days
              </p>
            </div>
        )}
      </div>
    </Card>);

};
// ============================================================================
// MODALS
// ============================================================================
const SummaryModal = ({
  isOpen,
  onClose,
  permissions,
  selectedUser,
  tempAccesses
}: any) => {
  const allowed = Object.values(permissions).filter(
    (p: any) => p.status === 'allowed'
  ).length;
  const denied = Object.values(permissions).filter(
    (p: any) => p.status === 'denied'
  ).length;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Permission Summary"
      size="lg"
      actions={
      <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </>
      }>
      
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
          {
            label: 'Total',
            value: Object.keys(permissions).length,
            color: 'blue'
          },
          {
            label: 'Allowed',
            value: allowed,
            color: 'emerald'
          },
          {
            label: 'Denied',
            value: denied,
            color: 'rose'
          }].
          map((s) =>
          <div
            key={s.label}
            className={`text-center p-4 bg-${s.color}-50 rounded-xl border border-${s.color}-200`}>
            
              <p className={`text-3xl font-bold text-${s.color}-600`}>
                {s.value}
              </p>
              <p className={`text-xs text-${s.color}-700 font-medium mt-1`}>
                {s.label}
              </p>
            </div>
          )}
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h4 className="font-semibold text-slate-800">Module Breakdown</h4>
          </div>
          <div className="divide-y divide-slate-100">
            {MODULES.map((m) =>
            <div
              key={m.id}
              className="px-4 py-3 flex items-center justify-between">
              
                <div className="flex items-center gap-3">
                  <m.icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-800">{m.name}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="success" size="xs">
                    {Math.floor(Math.random() * 10) + 5} Allowed
                  </Badge>
                  <Badge variant="danger" size="xs">
                    {Math.floor(Math.random() * 3)} Denied
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
        {tempAccesses.length > 0 &&
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
              <h4 className="font-semibold text-amber-800">
                Active Temporary Access
              </h4>
            </div>
            <div className="divide-y divide-slate-100">
              {tempAccesses.map((t: TempAccess) =>
            <div
              key={t.id}
              className="px-4 py-3 flex items-center justify-between">
              
                  <span className="font-medium text-slate-800">{t.name}</span>
                  <span className="text-sm text-slate-500">
                    Until {t.endDate}
                  </span>
                </div>
            )}
            </div>
          </div>
        }
      </div>
    </Modal>);

};
const ResetModal = ({ isOpen, onClose, onConfirm, selectedUser }: any) =>
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Reset Permissions"
  size="sm"
  actions={
  <>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </>
  }>
  
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <RefreshCw className="w-8 h-8 text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Reset All Permissions?
      </h3>
      <p className="text-sm text-slate-600">
        Reset all permissions for <strong>{selectedUser?.name}</strong> to role
        defaults ({selectedUser?.role}).
      </p>
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">⚠️ This cannot be undone.</p>
      </div>
    </div>
  </Modal>;

const ExportModal = ({ isOpen, onClose, selectedUser }: any) => {
  const [format, setFormat] = useState('pdf');
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Permissions"
      size="sm"
      actions={
      <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </>
      }>
      
      <div className="space-y-4">
        <Select
          label="Format"
          options={[
          {
            value: 'pdf',
            label: 'PDF'
          },
          {
            value: 'excel',
            label: 'Excel'
          },
          {
            value: 'csv',
            label: 'CSV'
          },
          {
            value: 'json',
            label: 'JSON'
          }]
          }
          value={format}
          onChange={setFormat} />
        
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600">
            Export all permissions for <strong>{selectedUser?.name}</strong>
          </p>
        </div>
      </div>
    </Modal>);

};
// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function UserAccess({
  focusUser,
  onBack
}: {focusUser?: User | null;onBack?: () => void;} = {}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(focusUser || null);
  const [permissions, setPermissions] = useState<Record<string, any>>({});
  const [selectedBranch, setSelectedBranch] = useState('Main Campus');
  const [branchPermissions, setBranchPermissions] = useState<
    Record<string, any>>(
    {
      'Main Campus': {
        enabled: true
      }
    });
  const [tempAccesses, setTempAccesses] = useState<TempAccess[]>([]);
  const [specialAccess, setSpecialAccess] = useState<any>({
    classes: [],
    sections: [],
    departments: []
  });
  const [showSummary, setShowSummary] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showExport, setShowExport] = useState(false);
  // Combined screen: when Active Users opens a row, follow that selection.
  useEffect(() => {
    if (focusUser) setSelectedUser(focusUser);
  }, [focusUser]);
  const handleReset = () => {
    setPermissions({});
    setShowReset(false);
  };
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            User Access Control
          </h1>
          <p className="text-sm text-slate-500">
            Manage individual user permissions across branches
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            Audit Log
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {onBack ?

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
              ← Back to Active Users
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {selectedUser?.avatar || selectedUser?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{selectedUser?.name}</p>
              <p className="text-xs text-slate-500">{selectedUser?.loginId} · {selectedUser?.role} · {selectedUser?.department}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Access profile
          </span>
        </div> :

      <UserSelector
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser} />
      }

      {selectedUser ?
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Profile Details Card */}
            <Card title="Profile Details" icon={UserCheck}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {selectedUser.avatar}
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Full Name
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Email Address
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Phone Number
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Department & Role
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedUser.department} • {selectedUser.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Account Status
                    </p>
                    <Badge
                    variant={
                    selectedUser.status === 'Active' ? 'success' : 'danger'
                    }>
                    
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Account Age
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      342 days (Created Jan 15, 2023)
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sessions & Devices Card */}
            <Card
            title="Sessions & Devices"
            icon={Monitor}
            actions={
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 border-rose-200 hover:bg-rose-50">
              
                  <LogOut className="w-4 h-4 mr-2" />
                  Terminate All Sessions
                </Button>
            }>
            
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        2 Active Sessions
                      </p>
                      <p className="text-xs text-blue-700">
                        Max concurrent sessions allowed: 3
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Device
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Location & IP
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Last Active
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900">
                                Chrome on Windows
                              </p>
                              <Badge variant="success" size="xs">
                                Current Session
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-slate-700">Mumbai, India</p>
                          <p className="text-xs text-slate-500 font-mono">
                            192.168.1.45
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">Just now</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-600">
                          
                            Terminate
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900">
                                Safari on iPhone
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-slate-700">Mumbai, India</p>
                          <p className="text-xs text-slate-500 font-mono">
                            10.0.0.12
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          2 hours ago
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-600">
                          
                            Terminate
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Audit Logs Card */}
            <Card
            title="Recent Audit Logs"
            icon={History}
            actions={
            <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
            }>
            
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Select
                  options={[
                  {
                    value: 'all',
                    label: 'All Actions'
                  },
                  {
                    value: 'login',
                    label: 'Logins'
                  },
                  {
                    value: 'permission',
                    label: 'Permissions'
                  }]
                  }
                  value="all"
                  onChange={() => {}}
                  className="w-48" />
                
                  <Input
                  type="date"
                  value=""
                  onChange={() => {}}
                  className="w-48" />
                
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Timestamp
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Module
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          IP Address
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          Today, 08:45 AM
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          User Login
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          Authentication
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                          192.168.1.45
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success" size="xs">
                            Success
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          Yesterday, 05:30 PM
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          Exported Report
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          Student Management
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                          192.168.1.45
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success" size="xs">
                            Success
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          Yesterday, 02:15 PM
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          Failed Login Attempt
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          Authentication
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                          10.0.0.12
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="danger" size="xs">
                            Failed
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-center">
                  <Button variant="ghost" size="sm">
                    Load More Activity
                  </Button>
                </div>
              </div>
            </Card>

            <BranchPermissions
            selectedUser={selectedUser}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            branchPermissions={branchPermissions}
            setBranchPermissions={setBranchPermissions} />
          
            <PermissionTree
            selectedUser={selectedUser}
            permissions={permissions}
            setPermissions={setPermissions}
            selectedBranch={selectedBranch} />
          
            <TemporaryAccessManager
            selectedUser={selectedUser}
            tempAccesses={tempAccesses}
            setTempAccesses={setTempAccesses} />
          
            <SpecialAccessControls
            selectedUser={selectedUser}
            specialAccess={specialAccess}
            setSpecialAccess={setSpecialAccess} />
          
          </div>
          <div>
            <AccessSummary
            selectedUser={selectedUser}
            permissions={permissions}
            selectedBranch={selectedBranch}
            tempAccesses={tempAccesses}
            onViewSummary={() => setShowSummary(true)}
            onReset={() => setShowReset(true)}
            onExport={() => setShowExport(true)} />
          
          </div>
        </div> :

      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No User Selected
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Select a user to manage access permissions
          </p>
        </div>
      }

      <SummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        permissions={permissions}
        selectedUser={selectedUser}
        tempAccesses={tempAccesses} />
      
      <ResetModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        selectedUser={selectedUser} />
      
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        selectedUser={selectedUser} />
      
    </div>);

}
export default UserAccess;