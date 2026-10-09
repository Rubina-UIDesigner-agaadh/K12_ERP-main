// AcademicYearOperationsControl.tsx - Comprehensive Academic Year Rollover & Operations Management
import React, { useState } from 'react';
import {
  AlertTriangle, Play, Eye, RotateCcw, CheckCircle, X, Calendar,
  Database, Users, BookOpen, Clock, Shield, Download, Upload,
  FileText, Settings, ChevronDown, ChevronUp, RefreshCw, Loader,
  Check, ArrowRight, Lock, Unlock, History, AlertCircle, Info,
  Layers, Copy, Trash2, Archive, FolderOpen, Server, HardDrive,
  Activity, TrendingUp, BarChart2, PieChart, Zap, Search, Printer } from
'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface ClassPromotion {
  id: string;
  class: string;
  section: string;
  currentStrength: number;
  promoted: number;
  detained: number;
  compartment: number;
  tcIssued: number;
  newAdmissions: number;
  projectedStrength: number;
}

interface RolloverStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  progress?: number;
  duration?: string;
  error?: string;
}

interface ValidationCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  critical: boolean;
}

interface RolloverHistory {
  id: string;
  fromYear: string;
  toYear: string;
  executedBy: string;
  executedOn: string;
  status: 'completed' | 'rolled-back' | 'partial';
  studentsAffected: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const CLASS_PROMOTIONS: ClassPromotion[] = [
{ id: '1', class: 'Nursery', section: 'All', currentStrength: 90, promoted: 88, detained: 0, compartment: 0, tcIssued: 2, newAdmissions: 15, projectedStrength: 103 },
{ id: '2', class: 'LKG', section: 'All', currentStrength: 95, promoted: 93, detained: 0, compartment: 0, tcIssued: 2, newAdmissions: 10, projectedStrength: 103 },
{ id: '3', class: 'UKG', section: 'All', currentStrength: 100, promoted: 98, detained: 0, compartment: 0, tcIssued: 2, newAdmissions: 8, projectedStrength: 106 },
{ id: '4', class: 'Class 1', section: 'A, B, C', currentStrength: 120, promoted: 118, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 5, projectedStrength: 111 },
{ id: '5', class: 'Class 2', section: 'A, B, C', currentStrength: 115, promoted: 113, detained: 2, compartment: 0, tcIssued: 0, newAdmissions: 3, projectedStrength: 121 },
{ id: '6', class: 'Class 3', section: 'A, B, C', currentStrength: 108, promoted: 106, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 2, projectedStrength: 115 },
{ id: '7', class: 'Class 4', section: 'A, B', currentStrength: 85, promoted: 83, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 2, projectedStrength: 108 },
{ id: '8', class: 'Class 5', section: 'A, B', currentStrength: 82, promoted: 80, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 1, projectedStrength: 84 },
{ id: '9', class: 'Class 6', section: 'A, B', currentStrength: 78, promoted: 76, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 5, projectedStrength: 85 },
{ id: '10', class: 'Class 7', section: 'A, B', currentStrength: 75, promoted: 73, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 3, projectedStrength: 79 },
{ id: '11', class: 'Class 8', section: 'A, B', currentStrength: 72, promoted: 70, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 2, projectedStrength: 75 },
{ id: '12', class: 'Class 9', section: 'A, B', currentStrength: 68, promoted: 66, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 4, projectedStrength: 74 },
{ id: '13', class: 'Class 10', section: 'A, B', currentStrength: 65, promoted: 63, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 3, projectedStrength: 69 },
{ id: '14', class: 'Class 11', section: 'Sci, Com', currentStrength: 55, promoted: 53, detained: 1, compartment: 1, tcIssued: 0, newAdmissions: 10, projectedStrength: 73 },
{ id: '15', class: 'Class 12', section: 'Sci, Com', currentStrength: 50, promoted: 0, detained: 0, compartment: 0, tcIssued: 50, newAdmissions: 0, projectedStrength: 53 }];


const INITIAL_ROLLOVER_STEPS: RolloverStep[] = [
{ id: '1', name: 'Backup Current Data', description: 'Creating backup of all academic records', status: 'pending' },
{ id: '2', name: 'Validate Promotion Rules', description: 'Checking all promotion criteria', status: 'pending' },
{ id: '3', name: 'Lock Current Year', description: 'Preventing further modifications', status: 'pending' },
{ id: '4', name: 'Create New Academic Year', description: 'Setting up new year structure', status: 'pending' },
{ id: '5', name: 'Copy Class Structure', description: 'Replicating class and section setup', status: 'pending' },
{ id: '6', name: 'Process Student Promotions', description: 'Moving students to next class', status: 'pending' },
{ id: '7', name: 'Handle Detained Students', description: 'Processing detained and compartment cases', status: 'pending' },
{ id: '8', name: 'Copy Fee Structures', description: 'Carrying forward fee configurations', status: 'pending' },
{ id: '9', name: 'Update Roll Numbers', description: 'Generating new roll numbers', status: 'pending' },
{ id: '10', name: 'Finalize & Verify', description: 'Final verification and cleanup', status: 'pending' }];


const VALIDATION_CHECKS: ValidationCheck[] = [
{ id: '1', name: 'Results Published', status: 'pass', message: 'All class results are published', critical: true },
{ id: '2', name: 'Fee Dues Cleared', status: 'warning', message: '15 students have pending dues (₹45,000)', critical: false },
{ id: '3', name: 'Promotion Rules Defined', status: 'pass', message: 'All classes have promotion rules', critical: true },
{ id: '4', name: 'TC Requests Processed', status: 'pass', message: 'All TC requests are processed', critical: false },
{ id: '5', name: 'Backup Available', status: 'pass', message: 'Database backup completed today', critical: true },
{ id: '6', name: 'No Active Sessions', status: 'pass', message: 'No users currently logged in', critical: false },
{ id: '7', name: 'Compartment Results', status: 'warning', message: '4 compartment results pending', critical: false },
{ id: '8', name: 'Staff Allocation', status: 'pending', message: 'Not yet verified', critical: false }];


const ROLLOVER_HISTORY: RolloverHistory[] = [
{ id: '1', fromYear: '2023-24', toYear: '2024-25', executedBy: 'Admin (John)', executedOn: '2024-04-01 10:30 AM', status: 'completed', studentsAffected: 1250 },
{ id: '2', fromYear: '2022-23', toYear: '2023-24', executedBy: 'Admin (Sarah)', executedOn: '2023-04-05 09:15 AM', status: 'completed', studentsAffected: 1180 },
{ id: '3', fromYear: '2021-22', toYear: '2022-23', executedBy: 'Admin (John)', executedOn: '2022-04-02 11:00 AM', status: 'completed', studentsAffected: 1120 }];


const ACADEMIC_YEARS = ['2022-23', '2023-24', '2024-25', '2025-26', '2026-27'];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, title, icon, actions }) =>
<div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {title &&
  <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {actions}
      </div>
  }
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </div>;


type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'purple';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'xs' | 'sm';
}

const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'sm' }) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };
  const sizeStyles: Record<'xs' | 'sm', string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs'
  };
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>);

};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children, size = 'md', actions }) => {
  if (!isOpen) return null;
  const sizeStyles: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeStyles[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {actions && <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">{actions}</div>}
      </div>
    </div>);

};

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color = 'blue', showLabel = true }) => {
  const percentage = Math.min(value / max * 100, 100);

  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    red: 'bg-rose-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="w-full">
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }} />

      </div>
      {showLabel && <p className="text-xs text-slate-500 mt-1">{Math.round(percentage)}% complete</p>}
    </div>);

};

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{className?: string;}>;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) =>
<div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
    {tabs.map((tab) =>
  <button
    key={tab.id}
    onClick={() => onChange(tab.id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
    activeTab === tab.id ?
    'bg-white text-blue-600 shadow-sm' :
    'text-slate-600 hover:text-slate-900'}`
    }>

        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
        {tab.count !== undefined &&
    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`
    }>
            {tab.count}
          </span>
    }
      </button>
  )}
  </div>;


interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled = false }) =>
<label className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
    <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />

    {label && <span className="text-sm text-slate-700">{label}</span>}
  </label>;


interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 disabled:opacity-50',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500 disabled:opacity-50'
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${disabled ? 'cursor-not-allowed' : ''}`}>

      {children}
    </button>);

};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{className?: string;}>;
  colorScheme: 'blue' | 'purple' | 'emerald' | 'red' | 'green' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, colorScheme }) => {
  const colorStyles: Record<string, {bg: string;icon: string;text: string;}> = {
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-600' },
    emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-600' },
    red: { bg: 'bg-rose-100', icon: 'text-rose-600', text: 'text-rose-600' },
    green: { bg: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-100', icon: 'text-amber-600', text: 'text-amber-600' }
  };

  const colors = colorStyles[colorScheme];

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </Card>);

};

// ============================================================================
// PREVIEW MODAL
// ============================================================================
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotions: ClassPromotion[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, promotions }) => {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  const totals = promotions.reduce((acc, p) => ({
    current: acc.current + p.currentStrength,
    promoted: acc.promoted + p.promoted,
    detained: acc.detained + p.detained,
    compartment: acc.compartment + p.compartment,
    tc: acc.tc + p.tcIssued,
    newAdmissions: acc.newAdmissions + p.newAdmissions,
    projected: acc.projected + p.projectedStrength
  }), { current: 0, promoted: 0, detained: 0, compartment: 0, tc: 0, newAdmissions: 0, projected: 0 });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rollover Impact Preview"
      subtitle="Review changes before execution"
      size="xl"
      actions={
      <>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        </>
      }>

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{totals.current}</span>
            </div>
            <p className="text-xs text-blue-600">Current Strength</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-700">{totals.promoted}</span>
            </div>
            <p className="text-xs text-emerald-600">To Be Promoted</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-700">{totals.detained + totals.compartment}</span>
            </div>
            <p className="text-xs text-amber-600">Detained/Comp.</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">{totals.projected}</span>
            </div>
            <p className="text-xs text-purple-600">Projected Strength</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-slate-800">Class-wise Breakdown</h4>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'summary' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`
              }>

              Summary
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'detailed' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`
              }>

              Detailed
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sections</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Current</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Promoted</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Detained</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Compartment</th>
                  {viewMode === 'detailed' &&
                  <>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">TC Issued</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">New Adm.</th>
                    </>
                  }
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Projected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promotions.map((p) =>
                <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.class}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{p.section}</td>
                    <td className="px-4 py-3 text-right text-slate-800">{p.currentStrength}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{p.promoted}</td>
                    <td className="px-4 py-3 text-right text-rose-600 font-medium">{p.detained}</td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">{p.compartment}</td>
                    {viewMode === 'detailed' &&
                  <>
                        <td className="px-4 py-3 text-right text-slate-600">{p.tcIssued}</td>
                        <td className="px-4 py-3 text-right text-blue-600">{p.newAdmissions}</td>
                      </>
                  }
                    <td className="px-4 py-3 text-right text-purple-600 font-bold">{p.projectedStrength}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">-</td>
                  <td className="px-4 py-3 text-right">{totals.current}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{totals.promoted}</td>
                  <td className="px-4 py-3 text-right text-rose-600">{totals.detained}</td>
                  <td className="px-4 py-3 text-right text-amber-600">{totals.compartment}</td>
                  {viewMode === 'detailed' &&
                  <>
                      <td className="px-4 py-3 text-right">{totals.tc}</td>
                      <td className="px-4 py-3 text-right text-blue-600">{totals.newAdmissions}</td>
                    </>
                  }
                  <td className="px-4 py-3 text-right text-purple-600">{totals.projected}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Warnings */}
        <div className="space-y-2">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Compartment Students</p>
              <p className="text-xs text-amber-700 mt-1">
                {totals.compartment} students have compartment results pending. They will be provisionally promoted.
              </p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Class 12 Students</p>
              <p className="text-xs text-blue-700 mt-1">
                {promotions.find((p) => p.class === 'Class 12')?.currentStrength || 0} students will be marked as passed out. TC will be generated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>);

};

// ============================================================================
// EXECUTION MODAL
// ============================================================================
interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: () => void;
}

const ExecutionModal: React.FC<ExecutionModalProps> = ({ isOpen, onClose, onExecute }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<RolloverStep[]>(
    INITIAL_ROLLOVER_STEPS.map((s) => ({ ...s, status: 'pending' as const }))
  );

  const startExecution = () => {
    setIsExecuting(true);
    // Reset steps
    setExecutionSteps(INITIAL_ROLLOVER_STEPS.map((s) => ({ ...s, status: 'pending' as const })));
    simulateExecution();
  };

  const simulateExecution = () => {
    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= INITIAL_ROLLOVER_STEPS.length) {
        setIsExecuting(false);
        return;
      }

      // Set current step to running
      setExecutionSteps((prev) =>
      prev.map((s, i) => i === stepIndex ? { ...s, status: 'running' as const } : s)
      );

      // After a delay, complete the step
      setTimeout(() => {
        const duration = `${Math.floor(Math.random() * 5 + 1)}s`;
        setExecutionSteps((prev) =>
        prev.map((s, i) => i === stepIndex ? { ...s, status: 'completed' as const, duration } : s)
        );
        stepIndex++;
        runStep();
      }, 1500 + Math.random() * 1000);
    };

    runStep();
  };

  const allCompleted = executionSteps.every((s) => s.status === 'completed');
  const hasFailed = executionSteps.some((s) => s.status === 'failed');
  const completedCount = executionSteps.filter((s) => s.status === 'completed').length;

  const handleComplete = () => {
    onExecute();
    onClose();
    // Reset for next time
    setExecutionSteps(INITIAL_ROLLOVER_STEPS.map((s) => ({ ...s, status: 'pending' as const })));
  };

  const handleClose = () => {
    if (!isExecuting) {
      setExecutionSteps(INITIAL_ROLLOVER_STEPS.map((s) => ({ ...s, status: 'pending' as const })));
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Execute Academic Year Rollover"
      subtitle="Monitor rollover progress"
      size="lg"
      actions={
      allCompleted ?
      <Button onClick={handleComplete}>
            <CheckCircle className="w-4 h-4 mr-2" /> Complete & Close
          </Button> :

      <>
            <Button variant="outline" onClick={handleClose} disabled={isExecuting}>Cancel</Button>
            <Button onClick={startExecution} disabled={isExecuting}>
              {isExecuting ?
          <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" /> Executing...
                </> :

          <>
                  <Play className="w-4 h-4 mr-2" /> Start Execution
                </>
          }
            </Button>
          </>

      }>

      <div className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Overall Progress</span>
            <span className="text-sm text-slate-600">
              {completedCount} / {executionSteps.length} steps
            </span>
          </div>
          <ProgressBar value={completedCount} max={executionSteps.length} color="blue" showLabel={false} />
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {executionSteps.map((step, index) => {
            let borderColor = 'border-slate-200';
            let bgColor = '';
            let iconBgColor = 'bg-slate-100';

            if (step.status === 'running') {
              borderColor = 'border-blue-300';
              bgColor = 'bg-blue-50';
              iconBgColor = 'bg-blue-100';
            } else if (step.status === 'completed') {
              borderColor = 'border-emerald-200';
              bgColor = 'bg-emerald-50';
              iconBgColor = 'bg-emerald-100';
            } else if (step.status === 'failed') {
              borderColor = 'border-rose-200';
              bgColor = 'bg-rose-50';
              iconBgColor = 'bg-rose-100';
            }

            return (
              <div key={step.id} className={`p-4 border rounded-xl transition-all ${borderColor} ${bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgColor}`}>
                      {step.status === 'running' ?
                      <Loader className="w-4 h-4 text-blue-600 animate-spin" /> :
                      step.status === 'completed' ?
                      <Check className="w-4 h-4 text-emerald-600" /> :
                      step.status === 'failed' ?
                      <X className="w-4 h-4 text-rose-600" /> :

                      <span className="text-sm font-medium text-slate-500">{index + 1}</span>
                      }
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{step.name}</p>
                      <p className="text-xs text-slate-500">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {step.duration && <span className="text-xs text-slate-500">{step.duration}</span>}
                    {step.status === 'completed' && <Badge variant="success">Completed</Badge>}
                    {step.status === 'running' && <Badge variant="info">Running...</Badge>}
                    {step.status === 'failed' && <Badge variant="danger">Failed</Badge>}
                    {step.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                  </div>
                </div>
              </div>);

          })}
        </div>

        {/* Completion Message */}
        {allCompleted &&
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-800">Rollover Completed Successfully!</p>
              <p className="text-sm text-emerald-700 mt-1">
                All students have been promoted to the new academic year. You can now access the new session.
              </p>
            </div>
          </div>
        }

        {hasFailed &&
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-rose-800">Rollover Failed</p>
              <p className="text-sm text-rose-700 mt-1">
                An error occurred during the rollover process. Please check the logs and try again.
              </p>
            </div>
          </div>
        }
      </div>
    </Modal>);

};

// ============================================================================
// PROMOTIONS TAB COMPONENT
// ============================================================================
interface PromotionsTabProps {
  promotions: ClassPromotion[];
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({ promotions }) => {
  const totals = promotions.reduce((acc, p) => ({
    current: acc.current + p.currentStrength,
    promoted: acc.promoted + p.promoted,
    detained: acc.detained + p.detained,
    compartment: acc.compartment + p.compartment,
    tc: acc.tc + p.tcIssued,
    newAdmissions: acc.newAdmissions + p.newAdmissions,
    projected: acc.projected + p.projectedStrength
  }), { current: 0, promoted: 0, detained: 0, compartment: 0, tc: 0, newAdmissions: 0, projected: 0 });

  return (
    <Card
      title="Class-wise Promotion Summary"
      icon={<TrendingUp className="w-5 h-5" />}
      actions={
      <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      }
      noPadding>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Class</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sections</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Current</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Promoted</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Detained</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Comp.</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">TC</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">New Adm.</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Projected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {promotions.map((p) =>
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{p.class}</td>
                <td className="px-4 py-3 text-slate-600 text-sm">{p.section}</td>
                <td className="px-4 py-3 text-right text-slate-800">{p.currentStrength}</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-medium">{p.promoted}</td>
                <td className="px-4 py-3 text-right text-rose-600 font-medium">{p.detained}</td>
                <td className="px-4 py-3 text-right text-amber-600 font-medium">{p.compartment}</td>
                <td className="px-4 py-3 text-right text-slate-600">{p.tcIssued}</td>
                <td className="px-4 py-3 text-right text-blue-600">{p.newAdmissions}</td>
                <td className="px-4 py-3 text-right text-purple-600 font-bold">{p.projectedStrength}</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold border-t-2 border-slate-200">
            <tr>
              <td className="px-4 py-3">Total</td>
              <td className="px-4 py-3">-</td>
              <td className="px-4 py-3 text-right">{totals.current}</td>
              <td className="px-4 py-3 text-right text-emerald-600">{totals.promoted}</td>
              <td className="px-4 py-3 text-right text-rose-600">{totals.detained}</td>
              <td className="px-4 py-3 text-right text-amber-600">{totals.compartment}</td>
              <td className="px-4 py-3 text-right">{totals.tc}</td>
              <td className="px-4 py-3 text-right text-blue-600">{totals.newAdmissions}</td>
              <td className="px-4 py-3 text-right text-purple-600">{totals.projected}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Summary Cards below table */}
      <div className="p-4 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-slate-800">{totals.current}</p>
            <p className="text-xs text-slate-500 mt-1">Total Current</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-emerald-600">{totals.promoted}</p>
            <p className="text-xs text-emerald-600 mt-1">To Be Promoted</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600">{totals.detained + totals.compartment}</p>
            <p className="text-xs text-amber-600 mt-1">Detained/Comp.</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">{totals.projected}</p>
            <p className="text-xs text-purple-600 mt-1">Projected Total</p>
          </div>
        </div>
      </div>
    </Card>);

};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function AcademicYearOperationsControl() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentYear, setCurrentYear] = useState('2024-25');
  const [targetYear, setTargetYear] = useState('2025-26');
  const [rolloverStatus, setRolloverStatus] = useState<'not-started' | 'ready' | 'in-progress' | 'completed'>('not-started');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [options, setOptions] = useState({
    classStructure: true,
    sectionStructure: true,
    promotionRules: true,
    feeStructures: true,
    feeHeads: true,
    discounts: true,
    timetable: false,
    holidayCalendar: true,
    subjectMapping: true,
    staffAllocation: false,
    examStructure: true,
    gradingRules: true,
    lockCurrentYear: true,
    autoArchive: false,
    generateCertificates: true,
    sendNotifications: false
  });

  const [validations] = useState<ValidationCheck[]>(VALIDATION_CHECKS);

  const updateOption = (key: string, value: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const passedValidations = validations.filter((v) => v.status === 'pass').length;
  const failedValidations = validations.filter((v) => v.status === 'fail').length;
  const warningValidations = validations.filter((v) => v.status === 'warning').length;
  const criticalFailed = validations.filter((v) => v.status === 'fail' && v.critical).length;

  const canExecute = criticalFailed === 0 && currentYear !== targetYear;

  const handleExecuteComplete = () => {
    setRolloverStatus('completed');
  };

  const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'promotions', label: 'Promotions', icon: TrendingUp, count: CLASS_PROMOTIONS.length },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'history', label: 'History', icon: History, count: ROLLOVER_HISTORY.length }];


  const totalStudents = CLASS_PROMOTIONS.reduce((a, p) => a + p.currentStrength, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Academic Year Operations Control</h1>
            <p className="text-sm text-slate-500">Manage academic year rollover, promotions, and data migration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={
          rolloverStatus === 'completed' ? 'success' :
          rolloverStatus === 'in-progress' ? 'warning' : 'secondary'
          }>
            {rolloverStatus === 'not-started' && 'Not Started'}
            {rolloverStatus === 'ready' && 'Ready to Execute'}
            {rolloverStatus === 'in-progress' && 'In Progress'}
            {rolloverStatus === 'completed' && 'Completed'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>
            <History className="w-4 h-4 mr-2" /> History
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-800">Important Notice</h3>
          <p className="text-sm text-amber-700 mt-1">
            Academic year rollover is a critical operation that affects all student records, promotions, and fee structures. 
            Please ensure all results are published and backups are taken before proceeding.
          </p>
        </div>
        <Button variant="outline" size="sm" className="flex-shrink-0">
          <Download className="w-4 h-4 mr-2" /> Create Backup
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current Year" value={currentYear} icon={Calendar} colorScheme="blue" />
        <StatCard label="Target Year" value={targetYear} icon={ArrowRight} colorScheme="purple" />
        <StatCard label="Total Students" value={totalStudents} icon={Users} colorScheme="emerald" />
        <StatCard
          label="Validations"
          value={`${passedValidations}/${validations.length}`}
          icon={CheckCircle}
          colorScheme={failedValidations > 0 ? 'red' : 'green'} />

      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Overview Tab */}
      {activeTab === 'overview' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Year Selection */}
          <Card title="Year Selection" icon={<Calendar className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Academic Year</label>
                <select
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex justify-center py-2">
                <ArrowRight className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Academic Year</label>
                <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {ACADEMIC_YEARS.filter((y) => y > currentYear).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {/* Rollover Options */}
          <Card title="Rollover Options" icon={<Settings className="w-5 h-5" />}>
            <div className="space-y-3 max-h-[280px] overflow-auto">
              {[
            { key: 'classStructure', label: 'Copy Class Structure' },
            { key: 'sectionStructure', label: 'Copy Section Structure' },
            { key: 'promotionRules', label: 'Apply Promotion Rules' },
            { key: 'feeStructures', label: 'Carry Forward Fee Structures' },
            { key: 'feeHeads', label: 'Copy Fee Heads' },
            { key: 'discounts', label: 'Copy Discount Rules' },
            { key: 'timetable', label: 'Copy Timetable Framework' },
            { key: 'holidayCalendar', label: 'Copy Holiday Calendar' },
            { key: 'subjectMapping', label: 'Copy Subject Mapping' },
            { key: 'examStructure', label: 'Copy Exam Structure' },
            { key: 'gradingRules', label: 'Copy Grading Rules' },
            { key: 'staffAllocation', label: 'Copy Staff Allocation' }].
            map((opt) =>
            <Checkbox
              key={opt.key}
              checked={options[opt.key as keyof typeof options] as boolean}
              onChange={(e) => updateOption(opt.key, e.target.checked)}
              label={opt.label} />

            )}
            </div>
          </Card>

          {/* Validation Checks */}
          <Card
          title="Pre-Rollover Validation"
          icon={<Shield className="w-5 h-5" />}
          actions={
          <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" /> Revalidate
              </Button>
          }>

            <div className="space-y-2 max-h-[280px] overflow-auto">
              {validations.map((v) => {
              let bgColor = 'bg-slate-50';
              let borderColor = 'border-slate-200';

              if (v.status === 'pass') {
                bgColor = 'bg-emerald-50';
                borderColor = 'border-emerald-200';
              } else if (v.status === 'fail') {
                bgColor = 'bg-rose-50';
                borderColor = 'border-rose-200';
              } else if (v.status === 'warning') {
                bgColor = 'bg-amber-50';
                borderColor = 'border-amber-200';
              }

              return (
                <div key={v.id} className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {v.status === 'pass' && <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />}
                        {v.status === 'fail' && <X className="w-4 h-4 text-rose-600 mt-0.5" />}
                        {v.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />}
                        {v.status === 'pending' && <Clock className="w-4 h-4 text-slate-400 mt-0.5" />}
                        <div>
                          <p className="text-sm font-medium text-slate-800">{v.name}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{v.message}</p>
                        </div>
                      </div>
                      {v.critical && <Badge variant="danger" size="xs">Critical</Badge>}
                    </div>
                  </div>);

            })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-sm">
              <span className="text-emerald-600">{passedValidations} Passed</span>
              <span className="text-amber-600">{warningValidations} Warnings</span>
              <span className="text-rose-600">{failedValidations} Failed</span>
            </div>
          </Card>
        </div>
      }

      {/* Promotions Tab */}
      {activeTab === 'promotions' &&
      <PromotionsTab promotions={CLASS_PROMOTIONS} />
      }

      {/* Settings Tab */}
      {activeTab === 'settings' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Data Migration Options" icon={<Database className="w-5 h-5" />}>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700">Academic Data</h4>
              <div className="space-y-2 pl-4">
                <Checkbox
                checked={options.classStructure}
                onChange={(e) => updateOption('classStructure', e.target.checked)}
                label="Class & Section Structure" />

                <Checkbox
                checked={options.subjectMapping}
                onChange={(e) => updateOption('subjectMapping', e.target.checked)}
                label="Subject Mapping" />

                <Checkbox
                checked={options.examStructure}
                onChange={(e) => updateOption('examStructure', e.target.checked)}
                label="Exam Structure" />

                <Checkbox
                checked={options.gradingRules}
                onChange={(e) => updateOption('gradingRules', e.target.checked)}
                label="Grading Rules" />

                <Checkbox
                checked={options.timetable}
                onChange={(e) => updateOption('timetable', e.target.checked)}
                label="Timetable Framework" />

                <Checkbox
                checked={options.holidayCalendar}
                onChange={(e) => updateOption('holidayCalendar', e.target.checked)}
                label="Holiday Calendar" />

              </div>

              <h4 className="text-sm font-semibold text-slate-700 pt-4 border-t">Financial Data</h4>
              <div className="space-y-2 pl-4">
                <Checkbox
                checked={options.feeStructures}
                onChange={(e) => updateOption('feeStructures', e.target.checked)}
                label="Fee Structures" />

                <Checkbox
                checked={options.feeHeads}
                onChange={(e) => updateOption('feeHeads', e.target.checked)}
                label="Fee Heads" />

                <Checkbox
                checked={options.discounts}
                onChange={(e) => updateOption('discounts', e.target.checked)}
                label="Discount Rules" />

              </div>

              <h4 className="text-sm font-semibold text-slate-700 pt-4 border-t">Staff Data</h4>
              <div className="space-y-2 pl-4">
                <Checkbox
                checked={options.staffAllocation}
                onChange={(e) => updateOption('staffAllocation', e.target.checked)}
                label="Staff Allocation" />

              </div>
            </div>
          </Card>

          <Card title="Advanced Settings" icon={<Zap className="w-5 h-5" />}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number Generation</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Auto-generate sequentially</option>
                  <option>Carry forward existing</option>
                  <option>Generate based on merit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Compartment Students</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Promote provisionally</option>
                  <option>Keep in current class</option>
                  <option>Mark as pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fee Due Handling</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Carry forward to new year</option>
                  <option>Clear all dues first</option>
                  <option>Ignore dues</option>
                </select>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Checkbox
                checked={options.lockCurrentYear}
                onChange={(e) => updateOption('lockCurrentYear', e.target.checked)}
                label="Lock current year after rollover" />

                <Checkbox
                checked={options.autoArchive}
                onChange={(e) => updateOption('autoArchive', e.target.checked)}
                label="Auto-archive old year data" />

                <Checkbox
                checked={options.generateCertificates}
                onChange={(e) => updateOption('generateCertificates', e.target.checked)}
                label="Generate promotion certificates" />

                <Checkbox
                checked={options.sendNotifications}
                onChange={(e) => updateOption('sendNotifications', e.target.checked)}
                label="Send notifications to parents" />

              </div>
            </div>
          </Card>
        </div>
      }

      {/* History Tab */}
      {activeTab === 'history' &&
      <Card title="Rollover History" icon={<History className="w-5 h-5" />} noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">From Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">To Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Executed By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Executed On</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ROLLOVER_HISTORY.map((h) =>
              <tr key={h.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-900">{h.fromYear}</td>
                    <td className="px-4 py-4 text-slate-900">{h.toYear}</td>
                    <td className="px-4 py-4 text-slate-600">{h.executedBy}</td>
                    <td className="px-4 py-4 text-slate-600">{h.executedOn}</td>
                    <td className="px-4 py-4 text-right text-slate-800">{h.studentsAffected.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <Badge variant={
                  h.status === 'completed' ? 'success' :
                  h.status === 'rolled-back' ? 'warning' : 'secondary'
                  }>
                        {h.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>
      }

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowPreviewModal(true)}>
            <Eye className="w-4 h-4 mr-2" /> Preview Impact
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Backup Now
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" disabled={rolloverStatus !== 'completed'}>
            <RotateCcw className="w-4 h-4 mr-2" /> Rollback
          </Button>
          <Button
            onClick={() => setShowExecutionModal(true)}
            disabled={!canExecute || rolloverStatus === 'in-progress' || rolloverStatus === 'completed'}>

            <Play className="w-4 h-4 mr-2" /> Execute Rollover
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Rollover Checklist</h4>
          <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
            <li>Ensure all final exam results are published and verified</li>
            <li>Process all pending TC requests before rollover</li>
            <li>Clear critical validations (marked in red) before execution</li>
            <li>Take a full database backup before proceeding</li>
            <li>Notify all staff about the scheduled rollover</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        promotions={CLASS_PROMOTIONS} />

      
      <ExecutionModal
        isOpen={showExecutionModal}
        onClose={() => setShowExecutionModal(false)}
        onExecute={handleExecuteComplete} />


      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Rollover History"
        size="lg">

        <div className="space-y-4">
          {ROLLOVER_HISTORY.map((h) =>
          <div key={h.id} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{h.fromYear} → {h.toYear}</p>
                    <p className="text-sm text-slate-500">{h.executedBy} • {h.executedOn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{h.studentsAffected.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">students affected</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>);

}

export default AcademicYearOperationsControl;