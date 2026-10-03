import React, { useState, useMemo } from 'react';
import {
  Search, Shield, ChevronDown, ChevronRight, Check, X, Save, Users, BookOpen,
  FileText, Building, CreditCard, Calendar, Bus, Library, GraduationCap,
  ClipboardList, Settings, Globe, Lock, Info, RefreshCw, EyeOff, Home,
  Bell, BarChart3, Utensils, Bed, Briefcase, Unlock } from
'lucide-react';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// TYPES & DATA
// ============================================================================
interface SubModule {id: string;name: string;enabled: boolean;}
interface Module {id: string;name: string;icon: React.ElementType;category: string;subModules: SubModule[];isCore: boolean;locked: boolean;}

const CATEGORIES = [
{ id: 'core', name: 'Core Modules', icon: Shield, color: 'blue' },
{ id: 'academic', name: 'Academic Modules', icon: GraduationCap, color: 'emerald' },
{ id: 'hr', name: 'HR & Payroll', icon: Briefcase, color: 'purple' },
{ id: 'facility', name: 'Facility Modules', icon: Building, color: 'amber' },
{ id: 'communication', name: 'Communication', icon: Bell, color: 'rose' }];


const INITIAL_MODULES: Module[] = [
{ id: 'student', name: 'Student Management', icon: Users, category: 'core', isCore: true, locked: true, subModules: [
  { id: 'student-profile', name: 'Student Profile', enabled: true },
  { id: 'student-admission', name: 'Admission', enabled: true },
  { id: 'student-attendance', name: 'Student Attendance', enabled: true },
  { id: 'student-documents', name: 'Documents', enabled: true },
  { id: 'student-alumni', name: 'Alumni', enabled: false },
  { id: 'student-transfer', name: 'Transfer Certificate', enabled: true }]
},
{ id: 'fee', name: 'Fee Management', icon: CreditCard, category: 'core', isCore: true, locked: true, subModules: [
  { id: 'fee-collection', name: 'Fee Collection', enabled: true },
  { id: 'fee-structure', name: 'Fee Structure', enabled: true },
  { id: 'fee-concession', name: 'Concessions', enabled: true },
  { id: 'fee-reports', name: 'Fee Reports', enabled: true },
  { id: 'fee-online', name: 'Online Payments', enabled: true }]
},
{ id: 'attendance', name: 'Attendance', icon: ClipboardList, category: 'core', isCore: true, locked: true, subModules: [
  { id: 'att-daily', name: 'Daily Attendance', enabled: true },
  { id: 'att-subject', name: 'Subject-wise Attendance', enabled: false },
  { id: 'att-biometric', name: 'Biometric Integration', enabled: false },
  { id: 'att-reports', name: 'Attendance Reports', enabled: true }]
},
{ id: 'reports', name: 'Reports & Analytics', icon: BarChart3, category: 'core', isCore: true, locked: true, subModules: [
  { id: 'rep-dashboard', name: 'Dashboard Analytics', enabled: true },
  { id: 'rep-custom', name: 'Custom Reports', enabled: true },
  { id: 'rep-export', name: 'Data Export', enabled: true },
  { id: 'rep-advanced', name: 'Advanced Analytics', enabled: false }]
},
{ id: 'exam', name: 'Examination', icon: FileText, category: 'academic', isCore: false, locked: false, subModules: [
  { id: 'exam-schedule', name: 'Exam Schedule', enabled: true },
  { id: 'exam-marks', name: 'Marks Entry', enabled: true },
  { id: 'exam-results', name: 'Results & Report Cards', enabled: true },
  { id: 'exam-analysis', name: 'Result Analysis', enabled: true },
  { id: 'exam-online', name: 'Online Examination', enabled: false }]
},
{ id: 'curriculum', name: 'Curriculum', icon: BookOpen, category: 'academic', isCore: false, locked: false, subModules: [
  { id: 'curr-syllabus', name: 'Syllabus Management', enabled: true },
  { id: 'curr-lesson', name: 'Lesson Planning', enabled: false },
  { id: 'curr-assignment', name: 'Assignments', enabled: true },
  { id: 'curr-resources', name: 'Learning Resources', enabled: false }]
},
{ id: 'timetable', name: 'Timetable', icon: Calendar, category: 'academic', isCore: false, locked: false, subModules: [
  { id: 'tt-class', name: 'Class Timetable', enabled: true },
  { id: 'tt-teacher', name: 'Teacher Timetable', enabled: true },
  { id: 'tt-substitution', name: 'Substitution', enabled: false }]
},
{ id: 'hr', name: 'HR Management', icon: Briefcase, category: 'hr', isCore: false, locked: false, subModules: [
  { id: 'hr-employee', name: 'Employee Management', enabled: true },
  { id: 'hr-leave', name: 'Leave Management', enabled: true },
  { id: 'hr-recruitment', name: 'Recruitment', enabled: false },
  { id: 'hr-performance', name: 'Performance Review', enabled: false }]
},
{ id: 'payroll', name: 'Payroll', icon: CreditCard, category: 'hr', isCore: false, locked: false, subModules: [
  { id: 'pay-salary', name: 'Salary Processing', enabled: true },
  { id: 'pay-structure', name: 'Pay Structure', enabled: true },
  { id: 'pay-tax', name: 'Tax Management', enabled: false }]
},
{ id: 'transport', name: 'Transport', icon: Bus, category: 'facility', isCore: false, locked: false, subModules: [
  { id: 'trans-routes', name: 'Route Management', enabled: false },
  { id: 'trans-vehicles', name: 'Vehicle Management', enabled: false },
  { id: 'trans-tracking', name: 'GPS Tracking', enabled: false },
  { id: 'trans-fees', name: 'Transport Fees', enabled: false }]
},
{ id: 'library', name: 'Library', icon: Library, category: 'facility', isCore: false, locked: false, subModules: [
  { id: 'lib-books', name: 'Book Management', enabled: true },
  { id: 'lib-issue', name: 'Issue & Return', enabled: true },
  { id: 'lib-ebooks', name: 'E-Library', enabled: false }]
},
{ id: 'hostel', name: 'Hostel', icon: Bed, category: 'facility', isCore: false, locked: false, subModules: [
  { id: 'hostel-rooms', name: 'Room Allocation', enabled: false },
  { id: 'hostel-attendance', name: 'Hostel Attendance', enabled: false },
  { id: 'hostel-mess', name: 'Mess Management', enabled: false }]
},
{ id: 'canteen', name: 'Canteen', icon: Utensils, category: 'facility', isCore: false, locked: false, subModules: [
  { id: 'canteen-pos', name: 'POS System', enabled: false },
  { id: 'canteen-menu', name: 'Menu Management', enabled: false }]
},
{ id: 'communication', name: 'Communication', icon: Bell, category: 'communication', isCore: false, locked: false, subModules: [
  { id: 'comm-notice', name: 'Notice Board', enabled: true },
  { id: 'comm-sms', name: 'SMS Notifications', enabled: true },
  { id: 'comm-email', name: 'Email Notifications', enabled: true },
  { id: 'comm-push', name: 'Push Notifications', enabled: false },
  { id: 'comm-whatsapp', name: 'WhatsApp Integration', enabled: false }]
}];


// ============================================================================
// UI COMPONENTS
// ============================================================================
const Badge = ({ variant, children }: {variant: 'success' | 'danger' | 'warning' | 'info' | 'default';children: React.ReactNode;}) => {
  const styles: Record<string, string> = { success: 'bg-emerald-50 text-emerald-700 border-emerald-200', danger: 'bg-rose-50 text-rose-700 border-rose-200', warning: 'bg-amber-50 text-amber-700 border-amber-200', info: 'bg-blue-50 text-blue-700 border-blue-200', default: 'bg-slate-100 text-slate-600 border-slate-200' };
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[variant]}`}>{children}</span>;
};

const Toggle = ({ enabled, onChange, disabled = false }: {enabled: boolean;onChange: () => void;disabled?: boolean;}) =>
<button onClick={onChange} disabled={disabled} className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
  </button>;


const Card = ({ title, icon: Icon, children, actions }: {title?: string;icon?: React.ElementType;children: React.ReactNode;actions?: React.ReactNode;}) =>
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    {title && <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
      <div className="flex items-center gap-3">{Icon && <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600"><Icon className="w-4 h-4 text-white" /></div>}<h3 className="font-semibold text-slate-800">{title}</h3></div>{actions}
    </div>}
    <div className="p-5">{children}</div>
  </div>;


// ============================================================================
// MODULE ROW
// ============================================================================
const ModuleRow = ({ module, expanded, onToggle, onToggleModule, onToggleSub, onToggleLock

}: {module: Module;expanded: boolean;onToggle: () => void;onToggleModule: () => void;onToggleSub: (subId: string) => void;onToggleLock: () => void;}) => {
  const enabledCount = module.subModules.filter((s) => s.enabled).length;
  const allEnabled = enabledCount === module.subModules.length;
  const someEnabled = enabledCount > 0 && !allEnabled;
  const canEdit = !module.locked;

  return (
    <div className={`border rounded-xl overflow-hidden mb-3 ${module.locked ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600"><module.icon className="w-5 h-5 text-white" /></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">{module.name}</span>
              {module.isCore && <Badge variant="info"><Lock className="w-3 h-3 inline mr-1" />Core</Badge>}
              {module.locked && <Badge variant="warning"><Lock className="w-3 h-3 inline mr-1" />Locked</Badge>}
            </div>
            <p className="text-xs text-slate-500">{enabledCount} of {module.subModules.length} enabled</p>
          </div>
        </div>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${allEnabled ? 'bg-emerald-500' : someEnabled ? 'bg-amber-400' : 'bg-slate-300'}`} />
            <span className="text-sm text-slate-600">{allEnabled ? 'All On' : someEnabled ? 'Partial' : 'All Off'}</span>
          </div>
          <button onClick={onToggleLock} className={`p-1.5 rounded-lg hover:bg-slate-200 ${module.isCore ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={module.isCore} title={module.locked ? 'Unlock' : 'Lock'}>
            {module.locked ? <Lock className="w-4 h-4 text-amber-600" /> : <Unlock className="w-4 h-4 text-slate-400" />}
          </button>
          <Toggle enabled={allEnabled || someEnabled} onChange={onToggleModule} disabled={!canEdit} />
        </div>
      </div>
      {expanded &&
      <div className="border-t border-slate-200 divide-y divide-slate-100">
          {module.subModules.map((sub) =>
        <div key={sub.id} className="flex items-center justify-between px-4 py-2.5 pl-16">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${sub.enabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  {sub.enabled ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <span className="text-sm text-slate-700">{sub.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={sub.enabled ? 'success' : 'default'}>{sub.enabled ? 'Enabled' : 'Disabled'}</Badge>
                <Toggle enabled={sub.enabled} onChange={() => onToggleSub(sub.id)} disabled={!canEdit} />
              </div>
            </div>
        )}
        </div>
      }
    </div>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function ModuleAccessControl() {
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState<string[]>(['student']);

  const toggleExpand = (id: string) => setExpanded((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const expandAll = () => setExpanded(modules.map((m) => m.id));
  const collapseAll = () => setExpanded([]);

  const toggleModule = (id: string) => setModules((p) => p.map((m) => m.id !== id ? m : { ...m, subModules: m.subModules.map((s) => ({ ...s, enabled: !m.subModules.every((x) => x.enabled) })) }));
  const toggleSub = (moduleId: string, subId: string) => setModules((p) => p.map((m) => m.id !== moduleId ? m : { ...m, subModules: m.subModules.map((s) => s.id !== subId ? s : { ...s, enabled: !s.enabled }) }));
  const toggleLock = (id: string) => setModules((p) => p.map((m) => m.id !== id ? m : { ...m, locked: !m.locked }));
  const enableCategory = (cat: string) => setModules((p) => p.map((m) => m.category !== cat || m.locked ? m : { ...m, subModules: m.subModules.map((s) => ({ ...s, enabled: true })) }));
  const disableCategory = (cat: string) => setModules((p) => p.map((m) => m.category !== cat || m.locked ? m : { ...m, subModules: m.subModules.map((s) => ({ ...s, enabled: false })) }));

  const filtered = useMemo(() => modules.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.subModules.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || statusFilter === 'enabled' && m.subModules.some((s) => s.enabled) || statusFilter === 'disabled' && m.subModules.every((s) => !s.enabled) || statusFilter === 'locked' && m.locked;
    return matchSearch && matchCat && matchStatus;
  }), [modules, search, categoryFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Shield className="w-7 h-7 text-blue-600" />Module Access Control</h1>
          <p className="text-sm text-slate-500 mt-1">Enable or disable modules based on institution needs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Reset Default</Button>
          <Button variant="primary"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search modules..." className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm min-w-[160px]">
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm min-w-[140px]">
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
            <option value="locked">Locked</option>
          </select>
          <Button variant="outline" onClick={expandAll}><ChevronDown className="w-4 h-4 mr-1" />Expand</Button>
          <Button variant="outline" onClick={collapseAll}><ChevronRight className="w-4 h-4 mr-1" />Collapse</Button>
        </div>
      </Card>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Module Locking</p>
          <p className="text-xs text-blue-600">Locked modules cannot be modified. Core modules are locked by default. Click the lock icon to lock/unlock non-core modules.</p>
        </div>
      </div>

      {/* Modules by Category */}
      {CATEGORIES.map((cat) => {
        const catModules = filtered.filter((m) => m.category === cat.id);
        if (!catModules.length) return null;
        return (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${cat.color}-100 flex items-center justify-center`}><cat.icon className={`w-5 h-5 text-${cat.color}-600`} /></div>
                <div><h2 className="text-lg font-semibold text-slate-800">{cat.name}</h2><p className="text-xs text-slate-500">{catModules.length} modules</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => enableCategory(cat.id)}><Check className="w-4 h-4 mr-1" />Enable All</Button>
                <Button variant="outline" size="sm" onClick={() => disableCategory(cat.id)}><X className="w-4 h-4 mr-1" />Disable All</Button>
              </div>
            </div>
            {catModules.map((m) =>
            <ModuleRow key={m.id} module={m} expanded={expanded.includes(m.id)} onToggle={() => toggleExpand(m.id)} onToggleModule={() => toggleModule(m.id)} onToggleSub={(subId) => toggleSub(m.id, subId)} onToggleLock={() => toggleLock(m.id)} />
            )}
          </div>);

      })}

      {/* System Behavior */}
      <Card title="When Module is Disabled" icon={Settings}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
          { icon: EyeOff, title: 'Hidden from Menu', desc: 'Removed from sidebar navigation' },
          { icon: Lock, title: 'API Blocked', desc: 'Backend returns 403 Forbidden' },
          { icon: Home, title: 'Widgets Hidden', desc: 'Dashboard widgets removed' },
          { icon: Globe, title: 'URL Blocked', desc: 'Direct access shows 404' }].
          map((item) =>
          <div key={item.title} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2"><item.icon className="w-5 h-5 text-slate-600" /><span className="font-medium text-slate-800">{item.title}</span></div>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          )}
        </div>
      </Card>
    </div>);

}

export default ModuleAccessControl;