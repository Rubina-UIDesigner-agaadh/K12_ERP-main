import React, { useCallback, useMemo, useState } from 'react';
import {
  FileText,
  Eye,
  Download,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Filter,
  BarChart3,
  Building2,
  GraduationCap,
  Database,
  FileCheck,
  TrendingUp,
  Bell,
  ChevronDown,
  Search,
  RefreshCw,
  ExternalLink,
  Info,
  Settings,
  HelpCircle,
  Printer,
  Share2,
  MoreVertical,
  FileSpreadsheet,
  Shield,
  BookOpen,
  Users,
  IndianRupee,
  ClipboardCheck,
  Send,
  Archive } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
// ============================================
// TYPES & INTERFACES
// ============================================
type ReportStatus = 'filed' | 'pending' | 'overdue' | 'due-soon' | 'draft';
type TabId = 'templates' | 'filed' | 'calendar';
type FilterCategory =
'all' |
'fee-fixation' |
'financial-audit' |
'statutory' |
'rte' |
'udise';
interface Report {
  id: string;
  title: string;
  description: string;
  tags: string[];
  lastSubmitted: string;
  nextDueDate?: string;
  status: ReportStatus;
  icon: React.ReactNode;
  category: FilterCategory;
  priority: 'high' | 'medium' | 'low';
  submissionCount: number;
  lastModifiedBy?: string;
}
interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  count?: number;
}
interface FilterOption {
  id: FilterCategory;
  label: string;
  count: number;
}
interface StatCardData {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: 'green' | 'amber' | 'red' | 'blue' | 'purple';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'submission' | 'deadline' | 'review';
  status: ReportStatus;
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ReportFormData) => void;
}
interface ReportFormData {
  reportType: string;
  academicCycle: string;
  feeHeadCategory: string;
  caCertified: boolean;
  rteStatus: string;
  frcApprovalStage: string;
  includeAttachments: boolean;
  notes: string;
}
// ============================================
// CUSTOM SELECT COMPONENT
// ============================================
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}
function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  className = '',
  label,
  required = false,
  error,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };
  return (
    <div className={`relative ${className}`}>
      {label &&
      <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      }
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-2.5 
          bg-white border rounded-xl text-left
          transition-all duration-200
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-offset-0
        `}>

        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

      </button>

      {isOpen && !disabled &&
      <>
          <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)} />

          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) =>
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => handleSelect(option.value)}
              className={`
                    w-full px-4 py-2.5 text-left text-sm transition-colors
                    ${option.value === selectedValue ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}>

                  {option.label}
                </button>
            )}
            </div>
          </div>
        </>
      }

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>);

}
// ============================================
// CUSTOM BUTTON COMPONENT
// ============================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;
  const variantStyles = {
    primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-200',
    secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline:
    'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-200'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>);

}
// ============================================
// CUSTOM CARD COMPONENT
// ============================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
function Card({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  padding = 'md',
  hover = false
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 overflow-hidden
        ${hover ? 'hover:shadow-lg hover:border-blue-200 transition-all duration-300' : ''}
        ${className}
      `}>

      {(title || headerAction) &&
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            {title &&
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          }
            {subtitle &&
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          }
          </div>
          {headerAction}
        </div>
      }
      <div className={paddingStyles[padding]}>{children}</div>
    </div>);

}
// ============================================
// TOGGLE SWITCH COMPONENT
// ============================================
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}
function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false
}: ToggleSwitchProps) {
  return (
    <label
      className={`
        flex items-start gap-3 cursor-pointer group
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      `}>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 rounded-full
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}>

        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full
            bg-white shadow-lg ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `} />

      </button>
      {(label || description) &&
      <div className="flex flex-col">
          {label &&
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {label}
            </span>
        }
          {description &&
        <span className="text-xs text-gray-500 mt-0.5">{description}</span>
        }
        </div>
      }
    </label>);

}
// ============================================
// BADGE COMPONENT
// ============================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}
function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200'
  };
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full border
        ${variantStyles[variant]} ${sizeStyles[size]}
      `}>

      {icon}
      {children}
    </span>);

}
// ============================================
// STATUS BADGE COMPONENT
// ============================================
function StatusBadge({ status }: {status: ReportStatus;}) {
  const config: Record<
    ReportStatus,
    {
      variant: BadgeProps['variant'];
      icon: React.ElementType;
      label: string;
    }> =
  {
    filed: {
      variant: 'success',
      icon: CheckCircle,
      label: 'Filed'
    },
    pending: {
      variant: 'warning',
      icon: Clock,
      label: 'Pending'
    },
    overdue: {
      variant: 'danger',
      icon: AlertTriangle,
      label: 'Overdue'
    },
    'due-soon': {
      variant: 'info',
      icon: Clock,
      label: 'Due Soon'
    },
    draft: {
      variant: 'default',
      icon: FileText,
      label: 'Draft'
    }
  };
  const { variant, icon: Icon, label } = config[status];
  return (
    <Badge variant={variant} icon={<Icon className="w-3 h-3" />}>
      {label}
    </Badge>);

}
// ============================================
// PRIORITY INDICATOR COMPONENT
// ============================================
function PriorityIndicator({ priority }: {priority: Report['priority'];}) {
  const config = {
    high: {
      color: 'bg-red-500',
      label: 'High Priority'
    },
    medium: {
      color: 'bg-amber-500',
      label: 'Medium Priority'
    },
    low: {
      color: 'bg-green-500',
      label: 'Low Priority'
    }
  };
  const { color, label } = config[priority];
  return (
    <div className="flex items-center gap-1.5" title={label}>
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-gray-500 capitalize">{priority}</span>
    </div>);

}
// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  trend
}: StatCardData) {
  const colorMap = {
    green: {
      bg: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-100'
    },
    amber: {
      bg: 'from-amber-50 to-orange-50',
      iconBg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    red: {
      bg: 'from-red-50 to-rose-50',
      iconBg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-100'
    },
    blue: {
      bg: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-100'
    },
    purple: {
      bg: 'from-purple-50 to-violet-50',
      iconBg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-100'
    }
  };
  const colors = colorMap[colorClass];
  return (
    <div
      className={`
        bg-gradient-to-br ${colors.bg} rounded-xl p-5 
        border ${colors.border} hover:shadow-md transition-shadow duration-200
      `}>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold ${colors.text}`}>{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend &&
            <span
              className={`text-xs font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>

                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
              </span>
            }
          </div>
        </div>
        <div className={`p-3 ${colors.iconBg} rounded-xl`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>);

}
// ============================================
// REPORT CARD COMPONENT
// ============================================
interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
  onEdit: (report: Report) => void;
}
function ReportCard({ report, onView, onDownload, onEdit }: ReportCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-200 transition-colors">
            {report.icon}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} />
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">

                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              {showMenu &&
              <>
                  <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)} />

                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <button
                    onClick={() => {
                      onView(report);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                    onClick={() => {
                      onEdit(report);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                      <FileText className="w-4 h-4" />
                      Edit Report
                    </button>
                    <button
                    onClick={() => {
                      onDownload(report);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <hr className="border-gray-100" />
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </>
              }
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {report.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Priority */}
        <div className="mb-4">
          <PriorityIndicator priority={report.priority} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {report.tags.map((tag, index) =>
          <span
            key={index}
            className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors cursor-default">

              {tag}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">
              Last Submitted:{' '}
              <span className="text-gray-700">{report.lastSubmitted}</span>
            </span>
            {report.nextDueDate &&
            <span className="text-xs text-gray-500 mt-0.5">
                Next Due:{' '}
                <span className="text-blue-600 font-medium">
                  {report.nextDueDate}
                </span>
              </span>
            }
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(report)}
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all group/btn"
              title="View Report">

              <Eye className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-600" />
            </button>
            <button
              onClick={() => onDownload(report)}
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all group/btn"
              title="Download Report">

              <Download className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>);

}
// ============================================
// CALENDAR EVENT CARD COMPONENT
// ============================================
function CalendarEventCard({ event }: {event: CalendarEvent;}) {
  const typeConfig = {
    submission: {
      icon: Send,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    deadline: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    review: {
      icon: ClipboardCheck,
      color: 'text-green-600',
      bg: 'bg-green-100'
    }
  };
  const { icon: Icon, color, bg } = typeConfig[event.type];
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className={`p-2.5 ${bg} rounded-xl`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {event.title}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
      </div>
      <StatusBadge status={event.status} />
    </div>);

}
// ============================================
// GENERATE REPORT MODAL COMPONENT
// ============================================
function GenerateReportModal({ isOpen, onClose, onSubmit }: ModalProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    reportType: '',
    academicCycle: '',
    feeHeadCategory: 'all',
    caCertified: false,
    rteStatus: 'all',
    frcApprovalStage: 'all',
    includeAttachments: true,
    notes: ''
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReportFormData, string>>>(
    {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ReportFormData, string>> = {};
    if (!formData.reportType) {
      newErrors.reportType = 'Report type is required';
    }
    if (!formData.academicCycle) {
      newErrors.academicCycle = 'Academic cycle is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSubmit?.(formData);
      onClose();
      // Reset form
      setFormData({
        reportType: '',
        academicCycle: '',
        feeHeadCategory: 'all',
        caCertified: false,
        rteStatus: 'all',
        frcApprovalStage: 'all',
        includeAttachments: true,
        notes: ''
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const updateFormData = <K extends keyof ReportFormData,>(
  key: K,
  value: ReportFormData[K]) =>
  {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined
      }));
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true" />


      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              Generate Compliance Report
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure parameters for your regulatory submission
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl transition-colors"
            aria-label="Close modal">

            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label="Report Type"
              required
              value={formData.reportType}
              onChange={(value) => updateFormData('reportType', value)}
              error={errors.reportType}
              options={[
              {
                value: '',
                label: 'Select report type...',
                disabled: true
              },
              {
                value: 'fee-fixation',
                label: 'Fee Fixation (Form II)'
              },
              {
                value: 'rte',
                label: 'RTE Reimbursement'
              },
              {
                value: 'financial-audit',
                label: 'Financial Audit'
              },
              {
                value: 'statutory-disclosure',
                label: 'Statutory Disclosure'
              },
              {
                value: 'udise',
                label: 'UDISE+ Finance'
              }]
              } />

            <CustomSelect
              label="Academic Cycle"
              required
              value={formData.academicCycle}
              onChange={(value) => updateFormData('academicCycle', value)}
              error={errors.academicCycle}
              options={[
              {
                value: '',
                label: 'Select cycle...',
                disabled: true
              },
              {
                value: '2024-25',
                label: '2024-25'
              },
              {
                value: '2025-27',
                label: '2025-27 (Multi-year)'
              },
              {
                value: '2023-24',
                label: '2023-24'
              }]
              } />

          </div>

          {/* Financial Filters Section */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              Financial Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                label="Fee Head Category"
                value={formData.feeHeadCategory}
                onChange={(value) => updateFormData('feeHeadCategory', value)}
                options={[
                {
                  value: 'all',
                  label: 'All Categories'
                },
                {
                  value: 'tuition',
                  label: 'Tuition Fee'
                },
                {
                  value: 'admission',
                  label: 'Admission Fee'
                },
                {
                  value: 'optional',
                  label: 'Optional Services'
                },
                {
                  value: 'transport',
                  label: 'Transport Fee'
                },
                {
                  value: 'hostel',
                  label: 'Hostel Fee'
                },
                {
                  value: 'examination',
                  label: 'Examination Fee'
                }]
                } />

              <div className="flex flex-col justify-end gap-3 pb-1">
                <ToggleSwitch
                  checked={formData.caCertified}
                  onChange={(checked) => updateFormData('caCertified', checked)}
                  label="CA Certified Only"
                  description="Include only chartered accountant verified records" />

              </div>
            </div>
          </div>

          {/* Compliance Filters Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <FileCheck className="w-4 h-4 text-green-600" />
              </div>
              Compliance Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                label="RTE Status"
                value={formData.rteStatus}
                onChange={(value) => updateFormData('rteStatus', value)}
                options={[
                {
                  value: 'all',
                  label: 'All Status'
                },
                {
                  value: 'verified',
                  label: 'Verified'
                },
                {
                  value: 'pending',
                  label: 'Pending Verification'
                },
                {
                  value: 'rejected',
                  label: 'Rejected'
                },
                {
                  value: 'expired',
                  label: 'Expired'
                }]
                } />

              <CustomSelect
                label="FRC Approval Stage"
                value={formData.frcApprovalStage}
                onChange={(value) => updateFormData('frcApprovalStage', value)}
                options={[
                {
                  value: 'all',
                  label: 'All Stages'
                },
                {
                  value: 'submitted',
                  label: 'Submitted'
                },
                {
                  value: 'under-review',
                  label: 'Under Review'
                },
                {
                  value: 'approved',
                  label: 'Approved'
                },
                {
                  value: 'revision-required',
                  label: 'Revision Required'
                },
                {
                  value: 'rejected',
                  label: 'Rejected'
                }]
                } />

            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Settings className="w-4 h-4 text-purple-600" />
              </div>
              Additional Options
            </h3>
            <div className="space-y-4">
              <ToggleSwitch
                checked={formData.includeAttachments}
                onChange={(checked) =>
                updateFormData('includeAttachments', checked)
                }
                label="Include Attachments"
                description="Bundle supporting documents with the report" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Add any additional notes or comments..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5">

            <HelpCircle className="w-4 h-4" />
            Need help?
          </button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              leftIcon={<FileCheck className="w-4 h-4" />}>

              Generate & Validate
            </Button>
          </div>
        </div>
      </div>
    </div>);

}
// ============================================
// EMPTY STATE COMPONENT
// ============================================
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
}
function EmptyState({
  title,
  description,
  icon: Icon = FileText,
  action
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action &&
      <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      }
    </div>);

}
// ============================================
// SEARCH INPUT COMPONENT
// ============================================
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

      {value &&
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">

          <X className="w-3 h-3 text-gray-400" />
        </button>
      }
    </div>);

}
// ============================================
// MAIN COMPONENT
// ============================================
export function FeeComplianceReporting() {
  const [activeTab, setActiveTab] = useState<TabId>('templates');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Tab configuration
  const tabs: Tab[] = [
  {
    id: 'templates',
    label: 'Compliance Templates',
    icon: FileText,
    count: 5
  },
  {
    id: 'filed',
    label: 'Filed Reports',
    icon: FileCheck,
    count: 12
  },
  {
    id: 'calendar',
    label: 'Submission Calendar & Alerts',
    icon: Bell,
    count: 3
  }];

  // Filter configuration
  const filters: FilterOption[] = [
  {
    id: 'all',
    label: 'All Reports',
    count: 5
  },
  {
    id: 'fee-fixation',
    label: 'Fee Fixation',
    count: 1
  },
  {
    id: 'financial-audit',
    label: 'Financial Audit',
    count: 1
  },
  {
    id: 'statutory',
    label: 'Statutory Disclosure',
    count: 1
  },
  {
    id: 'rte',
    label: 'RTE Compliance',
    count: 1
  },
  {
    id: 'udise',
    label: 'UDISE+',
    count: 1
  }];

  // Reports data
  const reports: Report[] = [
  {
    id: '1',
    title: 'Annual Fee Proposal (Fixation)',
    description:
    'Form II proposal for State FRC to justify fee structure for the next 1–3 years. Includes detailed breakdown of operational costs and proposed fee increases.',
    tags: ['FRC', 'Tuition', 'Operational Costs'],
    lastSubmitted: 'Oct 2024',
    nextDueDate: 'Jan 2025',
    status: 'pending',
    icon: <FileText className="w-6 h-6 text-blue-600" />,
    category: 'fee-fixation',
    priority: 'high',
    submissionCount: 3,
    lastModifiedBy: 'Admin'
  },
  {
    id: '2',
    title: 'Audited Financial Statements',
    description:
    'Full set of accounts (Income/Expenditure, Balance Sheet) certified by a Chartered Accountant as per regulatory requirements.',
    tags: ['Fee Income', 'Development Funds', 'Audit'],
    lastSubmitted: 'Mar 2024',
    nextDueDate: 'Mar 2025',
    status: 'filed',
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    category: 'financial-audit',
    priority: 'medium',
    submissionCount: 5,
    lastModifiedBy: 'Finance Team'
  },
  {
    id: '3',
    title: 'Statutory Disclosure Notice',
    description:
    'Mandatory transparency notice for the DEO and public website including fee structure, refund policy, and grievance redressal mechanism.',
    tags: ['Refund Policy', 'Public Disclosure'],
    lastSubmitted: 'Apr 2024',
    nextDueDate: 'Dec 2024',
    status: 'due-soon',
    icon: <Building2 className="w-6 h-6 text-blue-600" />,
    category: 'statutory',
    priority: 'high',
    submissionCount: 2,
    lastModifiedBy: 'Legal Team'
  },
  {
    id: '4',
    title: 'RTE Reimbursement Report',
    description:
    'Verification of 25% quota students to claim per-child cost from the State. Includes attendance records and student verification details.',
    tags: ['Quota', 'Reimbursement', 'Attendance'],
    lastSubmitted: 'Sep 2024',
    nextDueDate: 'Nov 2024',
    status: 'overdue',
    icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
    category: 'rte',
    priority: 'high',
    submissionCount: 4,
    lastModifiedBy: 'Admissions'
  },
  {
    id: '5',
    title: 'UDISE+ Finance Section',
    description:
    'National database DCF for total fees collected and government grants. Required for annual school census and ministry reporting.',
    tags: ['Ministry of Education', 'DCF', 'Grants'],
    lastSubmitted: 'Dec 2024',
    status: 'filed',
    icon: <Database className="w-6 h-6 text-blue-600" />,
    category: 'udise',
    priority: 'low',
    submissionCount: 1,
    lastModifiedBy: 'IT Admin'
  }];

  // Calendar events data
  const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'RTE Reimbursement Deadline',
    date: 'November 15, 2024',
    type: 'deadline',
    status: 'overdue'
  },
  {
    id: '2',
    title: 'Statutory Disclosure Submission',
    date: 'December 1, 2024',
    type: 'submission',
    status: 'due-soon'
  },
  {
    id: '3',
    title: 'Fee Fixation Review Meeting',
    date: 'January 10, 2025',
    type: 'review',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Financial Audit Due',
    date: 'March 31, 2025',
    type: 'deadline',
    status: 'pending'
  }];

  // Summary statistics
  const stats: StatCardData[] = [
  {
    title: 'Filed Reports',
    value: 12,
    icon: CheckCircle,
    colorClass: 'green',
    trend: {
      value: 8,
      direction: 'up'
    }
  },
  {
    title: 'Pending',
    value: 3,
    icon: Clock,
    colorClass: 'amber'
  },
  {
    title: 'Overdue',
    value: 1,
    icon: AlertTriangle,
    colorClass: 'red',
    trend: {
      value: 2,
      direction: 'down'
    }
  },
  {
    title: 'Due Soon',
    value: 2,
    icon: Calendar,
    colorClass: 'blue'
  }];

  // Filter reports based on category and search query
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesCategory =
      activeFilter === 'all' || report.category === activeFilter;
      const matchesSearch =
      searchQuery === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery, reports]);
  // Event handlers
  const handleViewReport = (report: Report) => {
    console.log('View report:', report);
    // Implement view functionality
  };
  const handleDownloadReport = (report: Report) => {
    console.log('Download report:', report);
    // Implement download functionality
  };
  const handleEditReport = (report: Report) => {
    console.log('Edit report:', report);
    // Implement edit functionality
  };
  const handleGenerateReport = (data: ReportFormData) => {
    console.log('Generate report with data:', data);
    // Implement report generation
  };
  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <>
            {/* Filter Bar */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-wrap flex-1">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2 whitespace-nowrap">
                    <Filter className="w-4 h-4 text-gray-500" />
                    Filter by Category:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter) =>
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`
                          px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                          ${activeFilter === filter.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'}
                        `}>

                        {filter.label}
                        <span
                        className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeFilter === filter.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>

                          {filter.count}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search reports..."
                  className="w-full lg:w-64" />

              </div>
            </div>

            {/* Report Cards Grid */}
            {filteredReports.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) =>
              <ReportCard
                key={report.id}
                report={report}
                onView={handleViewReport}
                onDownload={handleDownloadReport}
                onEdit={handleEditReport} />

              )}
              </div> :

            <EmptyState
              title="No reports found"
              description="No reports match your current filter criteria. Try adjusting your filters or search terms."
              icon={Search}
              action={{
                label: 'View All Reports',
                onClick: () => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }
              }} />

            }
          </>);

      case 'filed':
        return (
          <Card
            title="Filed Reports History"
            subtitle="View all previously submitted compliance reports">

            <div className="space-y-4">
              {reports.
              filter((r) => r.status === 'filed').
              map((report) =>
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">

                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm">
                        {report.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {report.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Submitted: {report.lastSubmitted} • By:{' '}
                          {report.lastModifiedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={report.status} />
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewReport(report)}>

                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReport(report)}>

                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              )}
            </div>
          </Card>);

      case 'calendar':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card
                title="Upcoming Deadlines"
                subtitle="Stay on top of your compliance submissions">

                <div className="space-y-4">
                  {calendarEvents.map((event) =>
                  <CalendarEventCard key={event.id} event={event} />
                  )}
                </div>
              </Card>
            </div>
            <div>
              <Card title="Quick Stats" padding="sm">
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700">
                        Overdue
                      </span>
                    </div>
                    <span className="text-xl font-bold text-red-600">1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">
                        Due This Week
                      </span>
                    </div>
                    <span className="text-xl font-bold text-amber-600">2</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        This Month
                      </span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">4</span>
                  </div>
                </div>
              </Card>

              <Card title="Notifications" padding="sm" className="mt-6">
                <div className="space-y-3 p-2">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <Bell className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700">
                        RTE Report is overdue
                      </p>
                      <p className="text-xs text-red-500 mt-0.5">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <Bell className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Statutory Disclosure due soon
                      </p>
                      <p className="text-xs text-amber-500 mt-0.5">
                        Due in 5 days
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>);

      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Fee Compliance & Analytics
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage regulatory submissions and compliance reports for
                    your institution
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="md">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Prepare New Submission
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 -mb-px overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 
                    transition-all whitespace-nowrap
                    ${isActive ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                  aria-current={isActive ? 'page' : undefined}>

                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined &&
                  <span
                    className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                      `}>

                      {tab.count}
                    </span>
                  }
                </button>);

            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <section
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          aria-label="Statistics">

          {stats.map((stat, index) =>
          <StatCard key={index} {...stat} />
          )}
        </section>

        <ReportFilters className="mb-8" />

        {/* Tab Content */}
        {renderTabContent()}

        {/* Quick Actions Footer */}
        <section className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Need Help with Compliance?
                </h3>
                <p className="text-blue-100 text-sm">
                  Access our comprehensive guide for statutory reporting
                  requirements and deadlines.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20">

                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20">

                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerateReport} />

    </div>);

}
export default FeeComplianceReporting;