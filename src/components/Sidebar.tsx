import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowRightLeft,
  Award,
  Banknote,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Bus,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  Clock,
  CreditCard,
  Database,
  DollarSign,
  Edit,
  ExternalLink,
  FileCheck,
  FileText,
  FolderOpen,
  GitBranch,
  Hash,
  Heart,
  History,
  Inbox,
  Key,
  Layers,
  LayoutDashboard,
  Link,
  List,
  Lock,
  Mail,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
  PieChart,
  Plus,
  Printer,
  Puzzle,
  QrCode,
  Receipt,
  RefreshCw,
  Repeat,
  RotateCcw,
  Scan,
  Search,
  Send,
  Settings,
  Shield,
  Smile,
  Star,
  TrendingUp,
  Upload,
  User,
  UserCheck,
  Users,
  UserX,
  Wallet,
  type LucideIcon } from
'lucide-react';
import { SubModule, SidebarSection, FavoriteItem } from '../types/navigation';
import { shortcutLabelForPage } from '../pages/my-details/settings/MyDisplayLanguage';

const PAGE_ICONS: Record<string, LucideIcon> = {
  'user-dashboard': BarChart3,
  'student-list': List,
  'student-summary-dashboard': BarChart3,
  'student-preference-collection': ClipboardList,
  'student-list-all-batch-combined': Archive,
  'stream-allocation-engine': GitBranch,
  'id-register': CreditCard,
  'student-detail': User,
  'verify-info-documents': FileCheck,
  'student-sibling': Users,
  'alumni-convert': Award,
  'student-transfer-withdrawal': ArrowRightLeft,
  'student-health-medical': Heart,
  'student-discipline': Shield,
  'allocation-result': CheckCircle,
  'student-achievements': Award,
  'audit-trail': History,
  'student-custom-search': Search,
  'student-reports': BarChart3,
  'late-arrival-early-departure': Smile,
  'student-register': ClipboardList,
  'gr-no-rules': Hash,
  'su-id-generation': Key,
  'id-card-template': CreditCard,
  'student-doc-type': FileText,
  'admission-form-settings': Settings,
  'promotion-policy': TrendingUp,
  'roll-no-logic': List,
  'admission-summary': BarChart3,
  'admission-inquiry-follow-up': PhoneCall,
  'admission-form': ClipboardList,
  'document-upload-auto-fill': Upload,
  'admission-exam-setup': ClipboardList,
  'admission-mark-entry': Edit,
  'admission-merit-setup': Award,
  'student-readmission': RotateCcw,
  'admission-report': BarChart3,
  'admission-custom-search': Search,
  'admission-audit-log': History,
  'inquiry-reference-master': Database,
  'admission-inquiry-setup': Settings,
  'division-register': ClipboardList,
  'attendance-summary': BarChart3,
  'attendance-defaulter-overview': AlertTriangle,
  'quick-present-entry': Check,
  'attendance-register-combined': ClipboardList,
  'student-attendance': UserCheck,
  'subjectwise-attendance': BookOpen,
  'manual-attendance-correction': Edit,
  'device-sync-biometric': Scan,
  'student-leave-request': FileText,
  'student-leave-listing': List,
  'attendance-follow-up': PhoneCall,
  'certificate-summary': BarChart3,
  'bonafide-combined': FileText,
  'first-trial-combined': FileText,
  'leaving-combined': FileText,
  'character-combined': FileText,
  transfer: ArrowRightLeft,
  'other-certificate': FileText,
  'print-template-student': Printer,
  'print-template': Printer,
  'general-ledger': BookOpen,
  'day-book': Calendar,
  'cash-book': Banknote,
  'bank-book': Building,
  'account-master': Database,
  'income-expenditure': ArrowRightLeft,
  'balance-sheet': FileText,
  'ledger-audit-trail': History,
  'fee-summary-dashboard': BarChart3,
  'fee-receipt-list': List,
  'fee-collection-register': ClipboardList,
  'fee-receipt': Receipt,
  'divisionwise-fee': ArrowRightLeft,
  'student-fee-process': RefreshCw,
  'fee-receipt-bulk': Layers,
  'fee-refund': RotateCcw,
  'assign-exemption-type': FolderOpen,
  'fee-opening': Receipt,
  'fee-auto-demand-scheduler': Upload,
  'fee-head-master-admin': CreditCard,
  'fee-category-installment-due-rules-master': CreditCard,
  'fee-collection-reports': BarChart3,
  'fee-receipt-template': FileText,
  'charge-summary-dashboard': BarChart3,
  'charge-receipt': Receipt,
  'charge-receipt-import': Upload,
  'charge-receipt-report': BarChart3,
  'scholarship-summary-dashboard': BarChart3,
  'student-scholarship-list': List,
  'scholarship-application-list': FileText,
  'scholarship-approval-sanction': Check,
  'scholarship-allocation-fee': Link,
  'scholarship-disbursement': Send,
  'bulk-scholarship-disbursement': Layers,
  'scholarship-adjustment-cancellation': Edit,
  'scholarship-report': BarChart3,
  'expense-summary-dashboard': BarChart3,
  'expense-list': List,
  'expense-voucher-entry': Plus,
  'expense-payment': CreditCard,
  'petty-cash-expense-entry': Edit,
  'recurring-expense-scheduler': Repeat,
  'bulk-expense-import': Upload,
  'expense-approval-workflow': Settings,
  'expense-posting': Send,
  'expense-report': BarChart3,
  'budget-vs-actual-report': BarChart3,
  'department-wise-expense': Building,
  'vendor-wise-expense': Users,
  'petty-cash-report': BarChart3,
  'employee-summary-dashboard': BarChart3,
  'employee-list-directory': List,
  'employee-profile-view': User,
  'probation-confirmation-list': ClipboardList,
  'exit-relieved-employees': UserX,
  'add-edit-employee-profile': Edit,
  'employee-service-register': FileText,
  'employee-confirmation': CheckCircle,
  'employee-transfer': ArrowRightLeft,
  'teacher-shift-view-switch': RefreshCw,
  'shift-view-and-switch': RefreshCw,
  'employee-separation-exit': UserX,
  'document-upload-verification': FileCheck,
  'employee-id-card': CreditCard,
  'teacher-class-subject-allocation': Users,
  'employee-report-advanced': Search,
  'employee-reports': BarChart3,
  'staff-strength-demographic-report': BarChart3,
  'teaching-allocation-summary': PieChart,
  'employee-attendance-summary': BarChart3,
  'daily-attendance-log': Calendar,
  'late-early-arrival-register': Clock,
  'overtime-register': Clock,
  'employee-attendance-admin': Settings,
  'manual-attendance-employee': Edit,
  'leave-balance-adjust-bulk': Layers,
  'leave-balance-add': Plus,
  'leave-balance-listing': List,
  'leave-balance-adjust': Edit,
  'monthly-attendance-register-hr': Calendar,
  'leave-entry-bulk': Layers,
  'leave-single-application': FileText,
  'apply-leave': FileText,
  'leave-listing': List,
  'hr-attendance-report': BarChart3,
  'hr-leave-report': BarChart3,
  'absentee-latecomer-report': AlertTriangle,
  'payroll-summary-dashboard': BarChart3,
  'salary-register-view': ClipboardList,
  'employee-payslip-list': FileText,
  'payroll-exception-list': AlertCircle,
  'employee-pay-structure': Layers,
  'payroll-process': RefreshCw,
  'payroll-entry': Edit,
  'supplementary-arrear-payroll': Repeat,
  'overtime-additional-earnings': TrendingUp,
  'manual-deduction-adjustment': Edit,
  'bulk-increment-pay-revision': TrendingUp,
  'payslip-lock-release': Lock,
  'salary-disbursement-bank-advice': Banknote,
  'staff-advance-issue': Send,
  'staff-advance-settlement': Check,
  'payroll-reversal-reprocess': RotateCcw,
  'payroll-report': BarChart3,
  'earnings-deduction-summary': PieChart,
  'department-cost-center-salary': Building,
  'payroll-audit-variance-report': AlertCircle,
  'designation-master': Award,
  'employee-document-type-master': FileText,
  'separation-exit-reason-master': AlertCircle,
  'role-responsibility-master': Shield,
  'qualification-subject-master': BookOpen,
  'shift-master': Clock,
  'working-calendar-master': Calendar,
  'leave-type-master': Calendar,
  'attendance-rule-master': Settings,
  'recruitment-stage-status-master': Layers,
  'pay-head-master': DollarSign,
  'salary-structure-master': Layers,
  'payroll-calendar-period-master': Calendar,
  'payroll-setup': Settings,
  'income-tax-slab': BarChart3,
  'appraisal-dashboard': BarChart3,
  'appraisal-cycle-status-view': List,
  'employee-appraisal-history': History,
  'appraisal-cycle-assignment': Layers,
  'self-appraisal-entry': User,
  'manager-hod-appraisal-entry': UserCheck,
  'appraisal-consolidation-final-rating': CheckCircle,
  'appraisal-result-report': BarChart3,
  'recruitment-dashboard': BarChart3,
  'vacancy-requisition-list': List,
  'applicant-list': Users,
  'interview-test-schedule-view': Calendar,
  'offer-joining-status-view': CheckCircle,
  'income-tax-dashboard': BarChart3,
  'employee-tax-summary-list': List,
  'investment-declaration-status': FileText,
  'proof-verification-status': CheckCircle,
  'monthly-tds-register': Calendar,
  'exam-master': Database,
  'user-master': Users,
  'active-users': Users,
  'security-summary-dashboard': BarChart3,
  'planner-dashboard': BarChart3,
  'activity-calendar': Calendar,
  'study-material': BookOpen,
  'classwork': ClipboardList,
  'homework-assignments': ClipboardList,
  'my-messages-inbox': Inbox,
  'my-notification-centre': Bell,
  'qr-barcode-master': QrCode
};

function pageIcon(id: string, label: string): LucideIcon {
  if (PAGE_ICONS[id]) return PAGE_ICONS[id];
  const t = `${id} ${label}`.toLowerCase();
  if (/(dashboard|overview|kpi)/.test(t)) return LayoutDashboard;
  if (/(teacher|staff|employee|payroll|salary|hr )/.test(t)) return Briefcase;
  if (/(student|enrol|admission|applicant)/.test(t)) return Users;
  if (/(fee|invoice|payment|wallet|collection|scholarship)/.test(t)) return Wallet;
  if (/(expense|bill|vendor|purchase)/.test(t)) return Receipt;
  if (/(report|analytic|mis)/.test(t)) return BarChart3;
  if (/(attend|leave|calendar)/.test(t)) return CalendarDays;
  if (/(exam|assessment|result|mark)/.test(t)) return ClipboardList;
  if (/(academic|curriculum|plan|lesson|syllabus|subject)/.test(t)) return BookOpen;
  if (/(timetable|schedule)/.test(t)) return Clock;
  if (/(setting|config|setup|master)/.test(t)) return Settings;
  if (/(alert|notif)/.test(t)) return Bell;
  if (/(message|inbox|mail|email|sms|whatsapp)/.test(t)) return Mail;
  if (/(transport|bus|gps|route|vehicle)/.test(t)) return Bus;
  if (/(barcode|qr|id-register|id card)/.test(t)) return QrCode;
  if (/(certificate|award)/.test(t)) return Award;
  if (/(security|role|permission|audit)/.test(t)) return Shield;
  if (/(plugin)/.test(t)) return Puzzle;
  if (/(health)/.test(t)) return Activity;
  if (/(list|register)/.test(t)) return List;
  return FileText;
}

interface SidebarProps {
  activeSubModule: SubModule | null;
  activeSidebarItemId: string;
  onSidebarItemSelect: (itemId: string) => void;
  activeModuleId: string;
  activeModuleLabel: string;
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
  onNavigateFavorite: (item: FavoriteItem) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

type ContextMenuState = {
  x: number;
  y: number;
  path: string;
  label: string;
};

function openPath(path: string, mode: 'tab' | 'window') {
  if (mode === 'tab') {
    window.open(path, '_blank', 'noopener,noreferrer');
    return;
  }
  const width = Math.min(1280, window.screen.availWidth - 48);
  const height = Math.min(800, window.screen.availHeight - 80);
  window.open(
    path,
    '_blank',
    `noopener,noreferrer,width=${width},height=${height},left=48,top=48`,
  );
}

export function Sidebar({
  activeSubModule,
  activeSidebarItemId,
  onSidebarItemSelect,
  activeModuleId,
  activeModuleLabel,
  favorites,
  onToggleFavorite,
  onNavigateFavorite,
  collapsed,
  onToggleCollapsed
}: SidebarProps) {
  const defaultSidebar: SidebarSection[] = [
  {
    title: 'Menu',
    items: activeSubModule ?
    [
    {
      label: activeSubModule.label,
      id: activeSubModule.id
    }] :

    []
  }];

  const sections = activeSubModule?.sidebarConfig || defaultSidebar;
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>>(
    {});
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const showFavoritesView = activeModuleId === 'dashboard' || !activeSubModule;

  const isFavorited = (itemId: string) => {
    return favorites.some((fav) => fav.sidebarItemId === itemId);
  };

  const openContextMenu = (e: React.MouseEvent, path: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    const width = 220;
    const height = 108;
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - width - 8),
      y: Math.min(e.clientY, window.innerHeight - height - 8),
      path,
      label,
    });
  };

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [contextMenu]);

  return (
    <aside className={`flex shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0D3B4C] via-[#145369] to-[#1A6B8A] transition-[width] duration-300 ${collapsed ? 'w-[4.75rem]' : 'w-80'}`}>
      <div className={`border-b border-white/10 ${collapsed ? 'px-1 py-3' : 'px-5 py-4'}`}>
        {collapsed ? (
          <button
            type="button"
            title="Expand sidebar"
            aria-label="Expand sidebar"
            onClick={onToggleCollapsed}
            className="flex h-10 w-full items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold tracking-wide text-white">
                {showFavoritesView ? 'Dashboard' : activeSubModule?.label || 'Dashboard'}
              </h2>
              <p className="mt-1 truncate text-xs font-medium tracking-wide text-white/60">
                {showFavoritesView
                  ? 'My Favorites'
                  : `${activeModuleLabel}${activeSubModule?.label ? ` › ${activeSubModule.label}` : ''}`}
              </p>
            </div>
            <button
              type="button"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              onClick={onToggleCollapsed}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto custom-scrollbar ${collapsed ? 'px-1.5 py-3' : 'px-3 py-4'}`}>
        {collapsed ? (
        <div className="space-y-1">
          {showFavoritesView ? (
            favorites.length === 0 ? (
              <p className="px-1 text-center text-[10px] text-white/40">No favorites</p>
            ) : (
              favorites.map((fav) => {
                const Icon = pageIcon(fav.sidebarItemId, fav.sidebarItemLabel);
                const shortcut = shortcutLabelForPage(fav.moduleId, fav.subModuleId, fav.sidebarItemId);
                return (
                  <button
                    key={`${fav.moduleId}-${fav.subModuleId}-${fav.sidebarItemId}`}
                    type="button"
                    title={`${fav.sidebarItemLabel}${shortcut ? ` · ${shortcut}` : ''}`}
                    aria-label={fav.sidebarItemLabel}
                    onClick={() => onNavigateFavorite(fav)}
                    onContextMenu={(e) => openContextMenu(
                      e,
                      `/${fav.moduleId}/${fav.subModuleId}/${fav.sidebarItemId}`,
                      fav.sidebarItemLabel,
                    )}
                    className="flex min-h-[3.35rem] w-full flex-col items-center justify-center gap-0.5 rounded-md px-0.5 py-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="w-full truncate text-center text-[9px] font-medium leading-tight text-white/70">{fav.sidebarItemLabel}</span>
                  </button>
                );
              })
            )
          ) : (
            sections.filter((section) => !section.hidden).flatMap((section) => section.items).map((item) => {
              const Icon = pageIcon(item.id, item.label);
              const isActive = activeSidebarItemId === item.id;
              const path = `/${activeModuleId}/${activeSubModule?.id || item.id}/${item.id}`;
              const shortcut = shortcutLabelForPage(activeModuleId, activeSubModule?.id || item.id, item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  title={`${item.label}${shortcut ? ` · ${shortcut}` : ''}`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSidebarItemSelect(item.id)}
                  onContextMenu={(e) => openContextMenu(e, path, item.label)}
                  className={`flex min-h-[3.35rem] w-full flex-col items-center justify-center gap-0.5 rounded-md px-0.5 py-1.5 transition-colors ${isActive ? 'bg-white/15 text-cyan-300 shadow-sm' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={`w-full truncate text-center text-[9px] font-medium leading-tight ${isActive ? 'text-cyan-200' : 'text-white/70'}`}>{item.label}</span>
                </button>
              );
            })
          )}
        </div>
        ) : showFavoritesView ?
        <div className="space-y-4">
            <div className="mb-2 flex items-center gap-2 px-3">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Favorites
              </span>
            </div>

            {favorites.length > 0 ?
          <div className="space-y-1">
                {favorites.map((fav) =>
            <button
              key={`${fav.moduleId}-${fav.subModuleId}-${fav.sidebarItemId}`}
              onClick={() => onNavigateFavorite(fav)}
              onContextMenu={(e) => openContextMenu(
                e,
                `/${fav.moduleId}/${fav.subModuleId}/${fav.sidebarItemId}`,
                fav.sidebarItemLabel,
              )}
              className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition-all duration-200">

                    <div className="flex items-center gap-3 overflow-hidden">
                      <Heart
                  className="h-4 w-4 text-red-400 fill-red-400 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(fav);
                  }} />

                      <div className="flex flex-col items-start truncate">
                        <span className="truncate">{fav.sidebarItemLabel}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-wide">
                          {fav.moduleLabel} • {fav.subModuleLabel}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-white/70" />
                  </button>
            )}
              </div> :

          <div className="px-3 py-4 text-sm text-white/50 text-center border border-dashed border-white/10 rounded-lg">
                <p>No favorites added yet.</p>
                <p className="mt-2 text-xs">
                  Browse modules and tap the heart icon ♡ to add favorites.
                </p>
              </div>
          }
          </div> :

        sections.filter((section) => !section.hidden).map((section, idx) => {
          const isCollapsed = collapsedSections[section.title];
          return (
            <div key={idx} className="mb-6">
                <button
                onClick={() => toggleSection(section.title)}
                className="mb-2 flex w-full items-center justify-between px-3 text-left group">

                  <span className="text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-white transition-colors">
                    {section.title}
                  </span>
                  <ChevronDown
                  className={`h-3 w-3 text-white/50 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />

                </button>

                <div
                className={`space-y-1 transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>

                  {section.items.map((item) => {
                  const isActive = activeSidebarItemId === item.id;
                  const favorited = isFavorited(item.id);
                  const path = `/${activeModuleId}/${activeSubModule?.id || item.id}/${item.id}`;
                  return (
                    <div
                      key={item.id}
                      onContextMenu={(e) => openContextMenu(e, path, item.label)}
                      className={`group flex w-full items-center justify-between rounded-md pr-2 transition-all duration-200
                          ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>

                        <button
                        onClick={() => onSidebarItemSelect(item.id)}
                        className="flex-1 py-2 pl-3 text-left text-sm font-medium truncate">

                          {item.label}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSubModule) {
                              onToggleFavorite({
                                sidebarItemId: item.id,
                                sidebarItemLabel: item.label,
                                subModuleId: activeSubModule.id,
                                subModuleLabel: activeSubModule.label,
                                moduleId: activeModuleId,
                                moduleLabel: activeModuleLabel
                              });
                            }
                          }}
                          className={`p-1.5 rounded-full transition-colors ${favorited ? 'text-red-400 hover:bg-white/10' : 'text-white/20 hover:text-white/60 hover:bg-white/10'}`}>

                            <Heart
                            className={`h-3.5 w-3.5 ${favorited ? 'fill-red-400' : ''}`} />

                          </button>

                          {isActive &&
                        <ChevronRight className="h-3 w-3 text-cyan-300" />
                        }
                        </div>
                      </div>);

                })}
                </div>

                {idx < sections.length - 1 &&
              <div className="mt-4 h-px w-full bg-white/10 mx-3" />
              }
              </div>);

        })
        }
      </nav>

      {!collapsed && (
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between text-sm text-white/30">
          <span>v3.1.0</span>
          <span>EduManager</span>
        </div>
      </div>
      )}

      {contextMenu &&
      <div
        className="fixed z-[80] min-w-[200px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
        style={{ top: contextMenu.y, left: contextMenu.x }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}>

          <p className="truncate border-b border-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-500">
            {contextMenu.label}
          </p>
          <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
          onClick={() => {
            openPath(contextMenu.path, 'tab');
            setContextMenu(null);
          }}>

            <ExternalLink className="h-4 w-4 text-gray-500" />
            Open in new tab
          </button>
          <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
          onClick={() => {
            openPath(contextMenu.path, 'window');
            setContextMenu(null);
          }}>

            <Maximize2 className="h-4 w-4 text-gray-500" />
            Open in new window
          </button>
        </div>
      }
    </aside>);

}
