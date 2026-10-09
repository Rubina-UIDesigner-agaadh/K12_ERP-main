import React, { useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import {
  BarChart,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Users,
  PieChart,
  X,
  CheckCircle,
  Clock,
  Calendar,
  IndianRupee,
  FileText,
  Download,
  RefreshCw,
  GraduationCap,
  CreditCard,
  Receipt,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Bell,
  Send,
  Eye,
  Info,
  Database,
  Zap,
  Building2,
  ChevronDown,
  Check } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportFilters } from '../../../components/ReportFilters';
// Updated Info Panel Content Interface
interface InfoPanelContent {
  title: string;
  description: string;
  dataSource: string;
  whyItMatters: string;
  recommendedActions: {
    label: string;
    path?: string;
  }[];
}
interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: InfoPanelContent;
  onNavigate?: (path: string) => void;
}
// New Clean Info Panel Component
function InfoPanel({ isOpen, onClose, content, onNavigate }: InfoPanelProps) {
  if (!isOpen) return null;
  const handleActionClick = (path?: string) => {
    if (path && onNavigate) {
      onNavigate(path);
      onClose();
    }
  };
  const handleExport = () => {
    // Export functionality placeholder
    console.log('Exporting data for:', content.title);
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close">

            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Separator */}
        <div className="border-b border-gray-200" />

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Description Section */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description
            </label>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Contextual Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Data Source Container */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Data Source
                </span>
              </div>
              <p className="text-sm text-blue-800 font-medium">
                {content.dataSource}
              </p>
            </div>

            {/* Why It Matters Container */}
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Why It Matters
                </span>
              </div>
              <p className="text-sm text-purple-800 font-medium">
                {content.whyItMatters}
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recommended Actions
            </label>
            <div className="mt-3 space-y-2">
              {content.recommendedActions.map((action, index) =>
              <button
                key={index}
                onClick={() => handleActionClick(action.path)}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors group">

                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Separator */}
        <div className="border-t border-gray-200" />

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

            Close
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">

            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>
    </div>);

}
// Info Icon Button Component
function InfoButton({ onClick }: {onClick: () => void;}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
      title="Learn more about this metric">

      <Info className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
    </button>);

}
const BRANCHES = [
{
  id: 'main',
  name: 'Main Campus',
  color: 'bg-blue-500'
},
{
  id: 'north',
  name: 'North Branch',
  color: 'bg-green-500'
},
{
  id: 'south',
  name: 'South Branch',
  color: 'bg-purple-500'
},
{
  id: 'east',
  name: 'East Branch',
  color: 'bg-orange-500'
}];

export function FeeSummaryDashboard() {
  const navigate = useNavigate();
  const [activeInfoPanel, setActiveInfoPanel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const isAllSelected =
  selectedBranches.length === 0 || selectedBranches.length === BRANCHES.length;
  const toggleBranch = (id: string) => {
    if (id === 'all') setSelectedBranches([]);else

    setSelectedBranches((prev) =>
    prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };
  // Updated Info content with new structure
  const infoContent: Record<string, InfoPanelContent> = {
    totalDemand: {
      title: 'Total Demand',
      description:
      'Total Demand represents the complete amount of fees expected to be collected from all enrolled students for the selected academic year. This comprehensive figure includes all fee heads such as tuition fees, transport charges, laboratory fees, library fees, and other miscellaneous charges as defined in the fee structure.',
      dataSource: 'Fee Structure Master & Student Enrollment Register',
      whyItMatters:
      'Essential for annual budget planning and revenue forecasting',
      recommendedActions: [
      {
        label: 'View Fee Structure Configuration',
        path: '/finance/fees/structure'
      },
      {
        label: 'Review Student Fee Mapping Report',
        path: '/finance/fees/mapping-report'
      },
      {
        label: 'Download Demand Register',
        path: '/finance/fees/demand-register'
      }]

    },
    totalCollected: {
      title: 'Total Collected',
      description:
      "Total Collected displays the actual amount of fees received from students up to the current date. This metric encompasses all payment modes including cash payments, cheque deposits, online transfers, UPI payments, and card transactions. It serves as a real-time indicator of your institution's collection performance.",
      dataSource: 'Fee Collection Ledger & Payment Gateway',
      whyItMatters:
      'Direct measure of cash flow health and operational sustainability',
      recommendedActions: [
      {
        label: 'View Daily Collection Summary',
        path: '/finance/fees/daily-summary'
      },
      {
        label: 'Analyze Payment Mode Distribution',
        path: '/finance/fees/payment-modes'
      },
      {
        label: 'Generate Collection Certificate',
        path: '/finance/fees/collection-certificate'
      }]

    },
    outstanding: {
      title: 'Outstanding Dues',
      description:
      'Outstanding Dues represent the total unpaid fees across all students. This figure is calculated as the difference between Total Demand and Total Collected, adjusted for any concessions or waivers granted. Monitoring this metric is crucial for maintaining healthy cash flow and identifying potential collection issues early.',
      dataSource: 'Accounts Receivable Module',
      whyItMatters:
      'High outstanding affects operational budget and resource allocation',
      recommendedActions: [
      {
        label: 'View Pending Fees by Class',
        path: '/finance/fees/pending-list'
      },
      {
        label: 'Send Bulk Payment Reminders',
        path: '/finance/fees/send-reminders'
      },
      {
        label: 'Download Outstanding Report',
        path: '/finance/fees/outstanding-report'
      }]

    },
    defaulters: {
      title: 'Defaulters Count',
      description:
      'Defaulters are students whose fee payments are overdue beyond the defined grace period (typically 60 days past the due date). This count helps identify families requiring immediate attention for fee recovery and enables proactive intervention to prevent accumulation of large outstanding amounts.',
      dataSource: 'Defaulter Tracking System',
      whyItMatters:
      'Early intervention prevents revenue loss and maintains fee discipline',
      recommendedActions: [
      {
        label: 'View Complete Defaulter List',
        path: '/finance/fees/defaulter-list'
      },
      {
        label: 'Generate Defaulter Notices',
        path: '/finance/fees/defaulter-notices'
      },
      {
        label: 'Schedule Parent Counseling',
        path: '/finance/fees/counseling-schedule'
      }]

    },
    collectionChart: {
      title: 'Collection vs Demand Analysis',
      description:
      'This visualization compares actual fee collection against the expected demand across different fee categories. It provides a head-wise breakdown showing which fee types have higher collection efficiency and which require focused collection efforts. Use this analysis to identify patterns and optimize your collection strategy.',
      dataSource: 'Fee Head Master & Collection Reports',
      whyItMatters:
      'Identifies underperforming fee categories for targeted action',
      recommendedActions: [
      {
        label: 'View Detailed Head-wise Report',
        path: '/finance/fees/headwise-report'
      },
      {
        label: 'Analyze Collection Trends',
        path: '/finance/fees/trend-analysis'
      },
      {
        label: 'Configure Fee Head Priorities',
        path: '/finance/fees/head-config'
      }]

    },
    ageingAnalysis: {
      title: 'Dues Ageing Analysis',
      description:
      'Ageing analysis categorizes outstanding dues based on how long they have been pending—typically in buckets of 0-30 days, 31-60 days, 61-90 days, and over 90 days. This segmentation helps prioritize collection efforts, as older dues are statistically harder to recover and may require different follow-up strategies.',
      dataSource: 'Accounts Receivable Ageing Module',
      whyItMatters: 'Enables prioritized recovery and bad debt provisioning',
      recommendedActions: [
      {
        label: 'View Ageing Bucket Details',
        path: '/finance/fees/ageing-details'
      },
      {
        label: 'Setup Auto-escalation Rules',
        path: '/finance/fees/escalation-config'
      },
      {
        label: 'Generate Ageing Summary Report',
        path: '/finance/fees/ageing-report'
      }]

    },
    quickActions: {
      title: 'Quick Actions Panel',
      description:
      'The Quick Actions panel provides one-click access to frequently used fee management functions. These shortcuts are strategically curated based on common daily workflows, enabling finance staff to navigate directly to critical operations without traversing multiple menu levels.',
      dataSource: 'User Activity & Workflow Analysis',
      whyItMatters:
      'Improves staff productivity and reduces task completion time',
      recommendedActions: [
      {
        label: 'Customize Quick Actions',
        path: '/settings/quick-actions'
      },
      {
        label: 'View All Fee Modules',
        path: '/finance/fees'
      },
      {
        label: 'Access Keyboard Shortcuts',
        path: '/help/shortcuts'
      }]

    },
    recentCollections: {
      title: 'Recent Collections',
      description:
      'This real-time feed displays the most recent fee payments received by the institution. Each entry shows student details, receipt number, amount, fee head, payment mode, and timestamp. This live view helps finance teams monitor collection activity and quickly verify recent transactions when responding to parent queries.',
      dataSource: 'Real-time Collection Feed',
      whyItMatters:
      'Enables instant transaction verification and daily monitoring',
      recommendedActions: [
      {
        label: 'View Full Transaction History',
        path: '/finance/fees/transactions'
      },
      {
        label: 'Search Specific Receipt',
        path: '/finance/fees/receipt-search'
      },
      {
        label: "Download Today's Collection",
        path: '/finance/fees/daily-export'
      }]

    },
    classWise: {
      title: 'Class-wise Collection Status',
      description:
      'This breakdown presents fee collection performance segmented by class or grade level. It displays demand, collection, and percentage for each class, enabling administrators to identify which classes have strong payment compliance and which require additional follow-up efforts through class teachers or parent coordinators.',
      dataSource: 'Class-wise Fee Aggregation Report',
      whyItMatters: 'Enables targeted follow-up through class teachers',
      recommendedActions: [
      {
        label: 'View All Classes Report',
        path: '/finance/fees/classwise-full'
      },
      {
        label: 'Share with Class Teachers',
        path: '/finance/fees/share-report'
      },
      {
        label: 'Send Class-specific Reminders',
        path: '/finance/fees/class-reminders'
      }]

    },
    monthlyTrend: {
      title: 'Monthly Collection Trend',
      description:
      'This trend chart visualizes how fee collections have progressed month-over-month throughout the academic year. Comparing actual collections against monthly targets helps identify seasonal patterns, predict future cash flows, and plan collection drives during traditionally low-performing months.',
      dataSource: 'Monthly Collection Summary & Budget Targets',
      whyItMatters: 'Crucial for cash flow forecasting and drive planning',
      recommendedActions: [
      {
        label: 'View Detailed Monthly Report',
        path: '/finance/fees/monthly-report'
      },
      {
        label: 'Compare with Previous Year',
        path: '/finance/fees/yoy-comparison'
      },
      {
        label: 'Set Monthly Targets',
        path: '/finance/fees/target-config'
      }]

    },
    alerts: {
      title: 'Alerts & Notifications',
      description:
      'This panel highlights critical items requiring immediate attention from the finance team. Alerts are automatically generated based on predefined business rules such as dues crossing threshold periods, upcoming due dates, pending cheque clearances, and other time-sensitive matters that need prompt action.',
      dataSource: 'Alert Engine & Business Rules',
      whyItMatters: "Ensures critical issues don't slip through the cracks",
      recommendedActions: [
      {
        label: 'Configure Alert Rules',
        path: '/settings/alert-config'
      },
      {
        label: 'View Alert History',
        path: '/finance/fees/alert-history'
      },
      {
        label: 'Manage Notification Preferences',
        path: '/settings/notifications'
      }]

    }
  };
  const stats = [
  {
    id: 'totalDemand',
    title: 'Total Demand',
    value: '₹1.2 Cr',
    change: '+12%',
    trend: 'up' as const,
    icon: Wallet,
    color: 'blue',
    subtext: 'For 1,250 students',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'totalCollected',
    title: 'Total Collected',
    value: '₹85.5 L',
    change: '71%',
    trend: 'up' as const,
    icon: TrendingUp,
    color: 'green',
    subtext: 'Collection rate',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'outstanding',
    title: 'Outstanding',
    value: '₹34.5 L',
    change: '29%',
    trend: 'down' as const,
    icon: AlertTriangle,
    color: 'red',
    subtext: 'Pending recovery',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'defaulters',
    title: 'Defaulters',
    value: '142',
    change: '+5',
    trend: 'up' as const,
    icon: Users,
    color: 'orange',
    subtext: '11.4% of students',
    gradient: 'from-orange-500 to-orange-600'
  }];

  const detailedStats = [
  {
    id: 'todayCollection',
    title: "Today's Collection",
    value: '₹2.45 L',
    icon: IndianRupee,
    color: 'emerald',
    description: '23 transactions'
  },
  {
    id: 'thisMonthCollection',
    title: 'This Month',
    value: '₹15.2 L',
    icon: Calendar,
    color: 'blue',
    description: '185 transactions'
  },
  {
    id: 'onlinePayments',
    title: 'Online Payments',
    value: '68%',
    icon: CreditCard,
    color: 'purple',
    description: 'Payment mode share'
  },
  {
    id: 'concessionGiven',
    title: 'Concessions',
    value: '₹8.5 L',
    icon: Receipt,
    color: 'teal',
    description: '85 students'
  }];

  const classWiseData = [
  {
    class: 'Nursery',
    demand: 850000,
    collected: 765000,
    students: 60
  },
  {
    class: 'LKG',
    demand: 920000,
    collected: 828000,
    students: 65
  },
  {
    class: 'UKG',
    demand: 880000,
    collected: 748000,
    students: 62
  },
  {
    class: 'Class 1',
    demand: 950000,
    collected: 807500,
    students: 68
  },
  {
    class: 'Class 2',
    demand: 920000,
    collected: 736000,
    students: 65
  },
  {
    class: 'Class 3',
    demand: 980000,
    collected: 882000,
    students: 70
  },
  {
    class: 'Class 4',
    demand: 1020000,
    collected: 867000,
    students: 72
  },
  {
    class: 'Class 5',
    demand: 1050000,
    collected: 840000,
    students: 75
  }];

  const ageingData = [
  {
    bucket: '0-30 Days',
    amount: 850000,
    count: 45,
    color: 'green'
  },
  {
    bucket: '31-60 Days',
    amount: 1200000,
    count: 38,
    color: 'yellow'
  },
  {
    bucket: '61-90 Days',
    amount: 750000,
    count: 32,
    color: 'orange'
  },
  {
    bucket: '90+ Days',
    amount: 650000,
    count: 27,
    color: 'red'
  }];

  const recentCollections = [
  {
    id: 1,
    name: 'Rahul Sharma',
    class: '10-A',
    receipt: 'RCP-2024-0145',
    amount: 25000,
    feeHead: 'Tuition Fee',
    time: 'Today, 10:30 AM',
    mode: 'Online'
  },
  {
    id: 2,
    name: 'Priya Patel',
    class: '8-B',
    receipt: 'RCP-2024-0144',
    amount: 18500,
    feeHead: 'Term Fee',
    time: 'Today, 10:15 AM',
    mode: 'Cash'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    class: '5-C',
    receipt: 'RCP-2024-0143',
    amount: 32000,
    feeHead: 'Annual Fee',
    time: 'Today, 09:45 AM',
    mode: 'Cheque'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    class: '12-A',
    receipt: 'RCP-2024-0142',
    amount: 45000,
    feeHead: 'Board Fee',
    time: 'Today, 09:30 AM',
    mode: 'Online'
  },
  {
    id: 5,
    name: 'Arjun Singh',
    class: '3-A',
    receipt: 'RCP-2024-0141',
    amount: 15000,
    feeHead: 'Transport Fee',
    time: 'Today, 09:00 AM',
    mode: 'Card'
  }];

  const monthlyTrend = [
  {
    month: 'Apr',
    collected: 2500000,
    target: 3000000
  },
  {
    month: 'May',
    collected: 1800000,
    target: 2000000
  },
  {
    month: 'Jun',
    collected: 1200000,
    target: 1500000
  },
  {
    month: 'Jul',
    collected: 2200000,
    target: 2500000
  },
  {
    month: 'Aug',
    collected: 1900000,
    target: 2000000
  },
  {
    month: 'Sep',
    collected: 2100000,
    target: 2200000
  },
  {
    month: 'Oct',
    collected: 0,
    target: 2000000
  }];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };
  const handleInfoNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Fee Summary Dashboard
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive overview of fee collections, dues, and financial
            trends
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Multi-Branch Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[180px]">

              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-left">
                {isAllSelected ?
                'All Branches' :
                `${selectedBranches.length} Selected`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showBranchDropdown &&
            <div className="absolute top-full right-0 mt-1 w-56 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div
                  onClick={() => toggleBranch('all')}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isAllSelected ? 'bg-blue-50' : ''}`}>

                    <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>

                      {isAllSelected &&
                    <Check className="w-3 h-3 text-white" />
                    }
                    </div>
                    <span className="text-sm font-medium">All Branches</span>
                  </div>
                  <div className="border-t my-2" />
                  {BRANCHES.map((branch) => {
                  const isSelected = selectedBranches.includes(branch.id);
                  return (
                    <div
                      key={branch.id}
                      onClick={() => toggleBranch(branch.id)}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>

                        <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>

                          {isSelected &&
                        <Check className="w-3 h-3 text-white" />
                        }
                        </div>
                        <span
                        className={`w-3 h-3 rounded-full ${branch.color}`} />

                        <span className="text-sm font-medium">
                          {branch.name}
                        </span>
                      </div>);

                })}
                </div>
                <div className="border-t p-2">
                  <button
                  onClick={() => setShowBranchDropdown(false)}
                  className="w-full py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">

                    Apply
                  </button>
                </div>
              </div>
            }
          </div>
          <Select
            className="w-36"
            options={[
            {
              value: '2024-2025',
              label: '2024-2025'
            },
            {
              value: '2023-2024',
              label: '2023-2024'
            },
            {
              value: '2022-2023',
              label: '2022-2023'
            }]
            }
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)} />

          <Select
            className="w-36"
            options={[
            {
              value: 'all',
              label: 'All Months'
            },
            {
              value: 'apr',
              label: 'April'
            },
            {
              value: 'may',
              label: 'May'
            },
            {
              value: 'jun',
              label: 'June'
            },
            {
              value: 'jul',
              label: 'July'
            },
            {
              value: 'aug',
              label: 'August'
            },
            {
              value: 'sep',
              label: 'September'
            }]
            }
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)} />

          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Branch Tags */}
      {!isAllSelected && selectedBranches.length > 0 &&
      <div className="flex flex-wrap gap-2">
          {selectedBranches.map((id) => {
          const branch = BRANCHES.find((b) => b.id === id);
          return (
            branch &&
            <span
              key={id}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm">

                  <span className={`w-2 h-2 rounded-full ${branch.color}`} />
                  {branch.name}
                  <X
                className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => toggleBranch(id)} />

                </span>);


        })}
          <button
          onClick={() => setSelectedBranches([])}
          className="text-sm text-blue-600 hover:text-blue-800 px-2">

            Clear All
          </button>
        </div>
      }

      <ReportFilters />

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) =>
        <Card key={stat.id} className="p-6 relative overflow-hidden">
            <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16`} />


            <div className="flex items-start justify-between relative">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <InfoButton onClick={() => setActiveInfoPanel(stat.id)} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
              </div>
              <div
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>

                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.trend === 'up' && stat.id !== 'outstanding' && stat.id !== 'defaulters' ? 'bg-green-100 text-green-700' : stat.trend === 'down' || stat.id === 'outstanding' || stat.id === 'defaulters' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>

                {stat.trend === 'up' ?
              <ArrowUpRight className="w-3 h-3" /> :

              <ArrowDownRight className="w-3 h-3" />
              }
                {stat.change}
              </div>
              <span className="text-xs text-gray-500">vs last year</span>
            </div>
          </Card>
        )}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {detailedStats.map((stat) =>
        <Card key={stat.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400">{stat.description}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection vs Demand Chart */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Collection vs Demand (Head-wise)
              </h3>
              <InfoButton
                onClick={() => setActiveInfoPanel('collectionChart')} />

            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
              {
                head: 'Tuition Fee',
                demand: 5000000,
                collected: 4250000
              },
              {
                head: 'Transport Fee',
                demand: 2000000,
                collected: 1600000
              },
              {
                head: 'Lab Fee',
                demand: 800000,
                collected: 720000
              },
              {
                head: 'Library Fee',
                demand: 500000,
                collected: 475000
              },
              {
                head: 'Activity Fee',
                demand: 700000,
                collected: 490000
              }].
              map((item, index) => {
                const percentage = Math.round(
                  item.collected / item.demand * 100
                );
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.head}</span>
                      <span className="font-medium text-gray-900">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
                        style={{
                          width: `${percentage}%`
                        }} />

                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        <span className="text-xs font-medium text-white z-10">
                          {formatCurrency(item.collected)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatCurrency(item.demand)}
                        </span>
                      </div>
                    </div>
                  </div>);

              })}
            </div>
          </div>
        </Card>

        {/* Dues Ageing Analysis */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">
                Dues Ageing Analysis
              </h3>
              <InfoButton
                onClick={() => setActiveInfoPanel('ageingAnalysis')} />

            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="20"
                    strokeDasharray="62.8 188.4"
                    strokeDashoffset="0" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="20"
                    strokeDasharray="75.4 175.8"
                    strokeDashoffset="-62.8" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="20"
                    strokeDasharray="50.3 200.9"
                    strokeDashoffset="-138.2" />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray="62.8 188.4"
                    strokeDashoffset="-188.5" />

                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹34.5L
                  </span>
                  <span className="text-xs text-gray-500">Total Dues</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ageingData.map((bucket, index) =>
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${bucket.color === 'green' ? 'border-green-500 bg-green-50' : bucket.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' : bucket.color === 'orange' ? 'border-orange-500 bg-orange-50' : 'border-red-500 bg-red-50'}`}>

                  <p className="text-xs text-gray-600">{bucket.bucket}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(bucket.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {bucket.count} students
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">
              Monthly Collection Trend
            </h3>
            <InfoButton onClick={() => setActiveInfoPanel('monthlyTrend')} />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Collected
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              Target
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-end justify-between gap-2 h-48">
            {monthlyTrend.map((month, index) =>
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1">

                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div
                  className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all"
                  style={{
                    height: `${month.collected / 3000000 * 100}%`
                  }} />

                  <div
                  className="w-8 bg-gray-200 rounded-t-lg"
                  style={{
                    height: `${month.target / 3000000 * 100}%`
                  }} />

                </div>
                <span className="text-xs text-gray-500">{month.month}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Class-wise Collection & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="p-4 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-blue-900">Quick Actions</h3>
              <InfoButton onClick={() => setActiveInfoPanel('quickActions')} />
            </div>
          </div>
          <div className="p-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between bg-white hover:bg-blue-50 border-blue-200"
              onClick={() => navigate('/finance/fees/pending-list')}>

              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                View Pending List
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-white hover:bg-blue-50 border-blue-200"
              onClick={() => navigate('/finance/fees/defaulter-list')}>

              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Defaulter Tracking
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-white hover:bg-blue-50 border-blue-200"
              onClick={() => navigate('/finance/fees/collection-reports')}>

              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                Collection Reports
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-white hover:bg-blue-50 border-blue-200"
              onClick={() => navigate('/finance/fees/collect')}>

              <span className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Collect Fee
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-white hover:bg-blue-50 border-blue-200"
              onClick={() => navigate('/finance/fees/send-reminders')}>

              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                Send Reminders
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Class-wise Collection */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">
                Class-wise Collection Status
              </h3>
              <InfoButton onClick={() => setActiveInfoPanel('classWise')} />
            </div>
            <Button variant="ghost" size="sm">
              View All Classes
            </Button>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="text-left py-2 px-2">Class</th>
                    <th className="text-right py-2 px-2">Students</th>
                    <th className="text-right py-2 px-2">Demand</th>
                    <th className="text-right py-2 px-2">Collected</th>
                    <th className="text-right py-2 px-2">Rate</th>
                    <th className="py-2 px-2 w-24">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {classWiseData.map((row, index) => {
                    const rate = Math.round(row.collected / row.demand * 100);
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-gray-50">

                        <td className="py-3 px-2 font-medium text-gray-900">
                          {row.class}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-600">
                          {row.students}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-600">
                          {formatCurrency(row.demand)}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-900 font-medium">
                          {formatCurrency(row.collected)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span
                            className={`text-sm font-medium ${rate >= 90 ? 'text-green-600' : rate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>

                            {rate}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{
                                width: `${rate}%`
                              }} />

                          </div>
                        </td>
                      </tr>);

                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Collections */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Recent Collections</h3>
            <InfoButton
              onClick={() => setActiveInfoPanel('recentCollections')} />

          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/finance/fees/collection-reports')}>

            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="divide-y">
          {recentCollections.map((collection) =>
          <div
            key={collection.id}
            className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                  {collection.name.
                split(' ').
                map((n) => n[0]).
                join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {collection.name} ({collection.class})
                  </p>
                  <p className="text-sm text-gray-500">
                    {collection.receipt} • {collection.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ₹{collection.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{collection.feeHead}</p>
                </div>
                <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${collection.mode === 'Online' ? 'bg-blue-100 text-blue-700' : collection.mode === 'Cash' ? 'bg-green-100 text-green-700' : collection.mode === 'Cheque' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>

                  {collection.mode}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Alerts and Notifications */}
      <Card className="overflow-hidden border-orange-200 bg-orange-50">
        <div className="p-4 border-b border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">
              Alerts & Notifications
            </h3>
            <InfoButton onClick={() => setActiveInfoPanel('alerts')} />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                27 students have dues exceeding 90 days
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Outstanding amount: ₹6.5 Lakhs
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50">

              Take Action
            </Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Term 2 fee due date is approaching
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Due on: 15th October 2024 • 234 pending payments
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">

              Send Reminders
            </Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                5 cheques pending for clearance
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total amount: ₹1.25 Lakhs • Deposited on 28th Sep
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50">

              Track Status
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Panel */}
      {activeInfoPanel && infoContent[activeInfoPanel] &&
      <InfoPanel
        isOpen={true}
        onClose={() => setActiveInfoPanel(null)}
        content={infoContent[activeInfoPanel]}
        onNavigate={handleInfoNavigate} />

      }
    </div>);

}