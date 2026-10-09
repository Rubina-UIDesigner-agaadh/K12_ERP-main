import React, { useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  TrendingDown,
  TrendingUp,
  CreditCard,
  Banknote,
  FileClock,
  ArrowRight,
  Info,
  Calendar,
  Building,
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  X,
  Database,
  Zap,
  ChevronRight,
  Download,
  Wallet,
  Receipt,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  FileText,
  Target,
  Percent,
  ShoppingCart,
  Truck,
  Wrench,
  BookOpen,
  Building2,
  Lightbulb,
  RefreshCw,
  Eye,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calculator,
  ChevronDown,
  Check } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar } from
'recharts';
// --- Types ---
interface MetricInfo {
  title: string;
  description: string;
  dataSource: {
    title: string;
    details: string[];
  };
  whyItMatters: {
    title: string;
    details: string[];
  };
  recommendedActions: {
    action: string;
    link?: string;
  }[];
}
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: MetricInfo;
}
// --- Info Modal Component ---
function InfoModal({ isOpen, onClose, info }: InfoModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose} />


      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{info.title}</h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {info.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Two Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Source Card */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 uppercase text-sm tracking-wide">
                  Data Source
                </h3>
              </div>
              <ul className="space-y-2">
                {info.dataSource.details.map((detail, index) =>
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-blue-800">

                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Why It Matters Card */}
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 uppercase text-sm tracking-wide">
                  Why It Matters
                </h3>
              </div>
              <ul className="space-y-2">
                {info.whyItMatters.details.map((detail, index) =>
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-purple-800">

                    <Lightbulb className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h3 className="font-semibold text-gray-900 uppercase text-sm tracking-wide mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              Recommended Actions
            </h3>
            <div className="space-y-2">
              {info.recommendedActions.map((item, index) =>
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">

                  <span className="text-gray-700 font-medium">
                    {item.action}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>);

}
// --- Mock Data ---
// KPI Data with detailed info
const STATS = [
{
  id: 'total-expense',
  title: 'Total Expense YTD',
  value: '₹45.2 L',
  subValue: '₹45,20,000',
  change: '+12%',
  changeLabel: 'vs last year',
  trend: 'up',
  icon: TrendingDown,
  color: 'red',
  bgColor: 'bg-red-50',
  borderColor: 'border-red-200',
  iconBg: 'bg-red-100',
  iconColor: 'text-red-600',
  info: {
    title: 'Total Expense Year-to-Date',
    description:
    'This metric represents the cumulative expenditure recorded from the start of the current financial year (April 1st) up to the present date. It includes all approved and paid expenses across all departments and expense categories.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Voucher Management System - All approved payment vouchers',
      'Bill Entry Module - Vendor invoices and receipts',
      'Petty Cash Records - Daily cash disbursements',
      'Salary Disbursement System - Staff payments']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Tracks overall cash outflow for budget monitoring',
      'Helps identify spending patterns and anomalies',
      'Essential for financial planning and forecasting',
      'Required for audit compliance and reporting']

    },
    recommendedActions: [
    {
      action: 'Review expense breakdown by category',
      link: '/reports/expense-category'
    },
    {
      action: 'Compare with allocated budget',
      link: '/budget/comparison'
    },
    {
      action: 'Identify high-spending departments',
      link: '/reports/department-wise'
    }]

  }
},
{
  id: 'unpaid-payables',
  title: 'Unpaid Payables',
  value: '₹8.5 L',
  subValue: '15 bills pending',
  change: '-8%',
  changeLabel: 'from last month',
  trend: 'down',
  icon: CreditCard,
  color: 'orange',
  bgColor: 'bg-orange-50',
  borderColor: 'border-orange-200',
  iconBg: 'bg-orange-100',
  iconColor: 'text-orange-600',
  info: {
    title: 'Unpaid Payables',
    description:
    'Total value of all vendor bills and invoices that have been approved for payment but not yet disbursed. This represents your current liability to external parties.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Accounts Payable Ledger - Outstanding vendor balances',
      'Bill Entry System - Approved unpaid invoices',
      'Purchase Order System - Goods received but not paid']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Affects cash flow planning and liquidity',
      'Impacts vendor relationships and credit terms',
      'Important for working capital management',
      'Overdue payments may incur penalties']

    },
    recommendedActions: [
    {
      action: 'Review aging analysis of payables',
      link: '/reports/payables-aging'
    },
    {
      action: 'Prioritize overdue payments',
      link: '/payments/pending'
    },
    {
      action: 'Negotiate extended credit terms',
      link: '/vendors/manage'
    }]

  }
},
{
  id: 'petty-cash',
  title: 'Petty Cash Balance',
  value: '₹25,400',
  subValue: 'Across 3 locations',
  change: 'Replenish soon',
  changeLabel: '',
  trend: 'neutral',
  icon: Banknote,
  color: 'green',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-200',
  iconBg: 'bg-green-100',
  iconColor: 'text-green-600',
  info: {
    title: 'Petty Cash Balance',
    description:
    'The total physical cash currently held by authorized cashiers and administrators across all locations. Used for small, immediate expenses that cannot wait for regular payment processing.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Petty Cash Register - Daily opening and closing balances',
      'Cash Disbursement Records - Individual payments made',
      'Replenishment Requests - Cash additions to float']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Ensures operational continuity for urgent expenses',
      'Requires careful monitoring to prevent misuse',
      'Should be reconciled daily for accuracy',
      'Low balance may disrupt daily operations']

    },
    recommendedActions: [
    {
      action: 'Review petty cash utilization report',
      link: '/reports/petty-cash'
    },
    {
      action: 'Initiate replenishment if low',
      link: '/petty-cash/replenish'
    },
    {
      action: 'Audit petty cash across locations',
      link: '/audit/petty-cash'
    }]

  }
},
{
  id: 'pending-approvals',
  title: 'Pending Approvals',
  value: '12',
  subValue: '₹2.8L total value',
  change: 'Urgent',
  changeLabel: '',
  trend: 'warning',
  icon: FileClock,
  color: 'purple',
  bgColor: 'bg-purple-50',
  borderColor: 'border-purple-200',
  iconBg: 'bg-purple-100',
  iconColor: 'text-purple-600',
  info: {
    title: 'Pending Approvals',
    description:
    'Number of expense vouchers and payment requests currently awaiting your authorization. These items are blocking payment processing until approved.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Workflow Engine - Items in your approval queue',
      'Voucher System - Vouchers awaiting signature',
      'Purchase Requests - POs pending authorization']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Delays in approval slow down vendor payments',
      'May affect vendor relationships and credit terms',
      'Pending items accumulate if not addressed promptly',
      'Important for maintaining operational efficiency']

    },
    recommendedActions: [
    {
      action: 'Review and approve pending vouchers',
      link: '/approvals/pending'
    },
    {
      action: 'Delegate approvals if unavailable',
      link: '/approvals/delegate'
    },
    {
      action: 'Set up approval reminders',
      link: '/settings/notifications'
    }]

  }
},
{
  id: 'budget-utilization',
  title: 'Budget Utilization',
  value: '68%',
  subValue: '₹30.5L of ₹45L used',
  change: 'On track',
  changeLabel: '',
  trend: 'neutral',
  icon: Target,
  color: 'blue',
  bgColor: 'bg-blue-50',
  borderColor: 'border-blue-200',
  iconBg: 'bg-blue-100',
  iconColor: 'text-blue-600',
  info: {
    title: 'Budget Utilization',
    description:
    'Percentage of the total allocated annual budget that has been spent year-to-date. This helps track if spending is on pace with the fiscal timeline.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Budget Allocation System - Approved annual budgets',
      'Expense Tracking - Actual spend against budget heads',
      'Financial Calendar - Pro-rated expected utilization']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Under-utilization may indicate operational delays',
      'Over-utilization requires budget revision or cuts',
      'Helps in resource allocation decisions',
      'Critical for year-end financial planning']

    },
    recommendedActions: [
    {
      action: 'View budget vs actual by department',
      link: '/budget/department-analysis'
    },
    {
      action: 'Identify under-utilized budget heads',
      link: '/budget/low-utilization'
    },
    {
      action: 'Request budget revision if needed',
      link: '/budget/revision-request'
    }]

  }
},
{
  id: 'vendor-payments',
  title: 'Vendor Payments (MTD)',
  value: '₹12.3 L',
  subValue: '45 payments made',
  change: '+5%',
  changeLabel: 'vs last month',
  trend: 'up',
  icon: Truck,
  color: 'cyan',
  bgColor: 'bg-cyan-50',
  borderColor: 'border-cyan-200',
  iconBg: 'bg-cyan-100',
  iconColor: 'text-cyan-600',
  info: {
    title: 'Vendor Payments Month-to-Date',
    description:
    'Total value of payments disbursed to external vendors and suppliers during the current month. Includes both online transfers and cheque payments.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Payment Gateway - Online transfer records',
      'Bank Statements - Cheque clearances',
      'Voucher System - Payment voucher data']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Reflects operational purchasing activity',
      'Important for cash flow management',
      'Affects vendor payment cycle metrics',
      'Helps negotiate better terms with suppliers']

    },
    recommendedActions: [
    {
      action: 'Review vendor-wise payment summary',
      link: '/reports/vendor-payments'
    },
    {
      action: 'Analyze payment mode distribution',
      link: '/reports/payment-modes'
    },
    {
      action: 'Check for duplicate payments',
      link: '/audit/duplicate-check'
    }]

  }
},
{
  id: 'overdue-payments',
  title: 'Overdue Payments',
  value: '₹1.2 L',
  subValue: '3 vendors affected',
  change: 'Action needed',
  changeLabel: '',
  trend: 'danger',
  icon: AlertTriangle,
  color: 'red',
  bgColor: 'bg-red-50',
  borderColor: 'border-red-200',
  iconBg: 'bg-red-100',
  iconColor: 'text-red-600',
  info: {
    title: 'Overdue Payments',
    description:
    'Total value of vendor invoices that have crossed their payment due date. These require immediate attention to avoid penalties and maintain vendor relationships.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Accounts Payable Aging Report',
      'Invoice Due Date Tracking',
      'Vendor Credit Terms Database']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'May incur late payment penalties',
      'Damages vendor relationships and trust',
      'Could affect future credit terms',
      'Reflects poorly on payment discipline']

    },
    recommendedActions: [
    {
      action: 'Clear overdue payments immediately',
      link: '/payments/overdue'
    },
    {
      action: 'Contact vendors for extension if needed',
      link: '/vendors/communicate'
    },
    {
      action: 'Set up payment reminders',
      link: '/settings/payment-alerts'
    }]

  }
},
{
  id: 'avg-processing-time',
  title: 'Avg Processing Time',
  value: '2.5 days',
  subValue: 'Invoice to payment',
  change: '-0.5 days',
  changeLabel: 'improvement',
  trend: 'down',
  icon: Clock,
  color: 'emerald',
  bgColor: 'bg-emerald-50',
  borderColor: 'border-emerald-200',
  iconBg: 'bg-emerald-100',
  iconColor: 'text-emerald-600',
  info: {
    title: 'Average Processing Time',
    description:
    'The average number of days taken from invoice receipt to payment disbursement. A key efficiency metric for the accounts payable process.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Invoice Receipt Timestamps',
      'Approval Workflow Duration',
      'Payment Disbursement Records']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Indicates operational efficiency',
      'Affects vendor satisfaction',
      'May help negotiate early payment discounts',
      'Reflects team productivity']

    },
    recommendedActions: [
    {
      action: 'Identify bottlenecks in approval process',
      link: '/reports/workflow-analysis'
    },
    {
      action: 'Automate repetitive approval steps',
      link: '/settings/automation'
    },
    {
      action: 'Set processing time targets',
      link: '/kpi/targets'
    }]

  }
}];

// Chart Data
const BUDGET_DATA = [
{
  head: 'Infrastructure',
  budget: 1500000,
  actual: 1200000,
  variance: -20
},
{
  head: 'Salaries',
  budget: 2000000,
  actual: 1950000,
  variance: -2.5
},
{
  head: 'Electricity',
  budget: 500000,
  actual: 550000,
  variance: 10
},
{
  head: 'Events',
  budget: 300000,
  actual: 150000,
  variance: -50
},
{
  head: 'Maintenance',
  budget: 400000,
  actual: 380000,
  variance: -5
},
{
  head: 'Transport',
  budget: 350000,
  actual: 320000,
  variance: -8.5
}];

const TREND_DATA = [
{
  month: 'Apr',
  thisYear: 400000,
  lastYear: 350000,
  budget: 380000
},
{
  month: 'May',
  thisYear: 380000,
  lastYear: 360000,
  budget: 400000
},
{
  month: 'Jun',
  thisYear: 250000,
  lastYear: 240000,
  budget: 300000
},
{
  month: 'Jul',
  thisYear: 450000,
  lastYear: 400000,
  budget: 420000
},
{
  month: 'Aug',
  thisYear: 500000,
  lastYear: 420000,
  budget: 450000
},
{
  month: 'Sep',
  thisYear: 480000,
  lastYear: 450000,
  budget: 460000
},
{
  month: 'Oct',
  thisYear: 520000,
  lastYear: 480000,
  budget: 500000
}];

const DEPT_DATA = [
{
  name: 'Admin',
  value: 35,
  amount: 1575000
},
{
  name: 'Academics',
  value: 45,
  amount: 2025000
},
{
  name: 'Sports',
  value: 10,
  amount: 450000
},
{
  name: 'Transport',
  value: 10,
  amount: 450000
}];

const EXPENSE_CATEGORY_DATA = [
{
  name: 'Utilities',
  value: 25,
  color: '#3b82f6'
},
{
  name: 'Salaries',
  value: 40,
  color: '#10b981'
},
{
  name: 'Supplies',
  value: 15,
  color: '#f59e0b'
},
{
  name: 'Maintenance',
  value: 12,
  color: '#8b5cf6'
},
{
  name: 'Others',
  value: 8,
  color: '#6b7280'
}];

const PAYMENT_MODE_DATA = [
{
  name: 'Bank Transfer',
  value: 65,
  amount: 2925000
},
{
  name: 'Cheque',
  value: 20,
  amount: 900000
},
{
  name: 'Cash',
  value: 10,
  amount: 450000
},
{
  name: 'UPI',
  value: 5,
  amount: 225000
}];

const DAILY_EXPENSE_DATA = [
{
  day: '1',
  amount: 45000
},
{
  day: '5',
  amount: 78000
},
{
  day: '10',
  amount: 32000
},
{
  day: '15',
  amount: 95000
},
{
  day: '20',
  amount: 58000
},
{
  day: '25',
  amount: 42000
},
{
  day: '30',
  amount: 88000
}];

const VENDOR_TOP_DATA = [
{
  name: 'Power Corp Ltd',
  amount: 450000,
  bills: 12
},
{
  name: 'City Water Works',
  amount: 180000,
  bills: 8
},
{
  name: 'Tech Solutions',
  amount: 320000,
  bills: 15
},
{
  name: 'Office Supplies Co',
  amount: 125000,
  bills: 22
},
{
  name: 'Maintenance Pro',
  amount: 280000,
  bills: 9
}];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];
const RECENT_BILLS = [
{
  id: 1,
  vendor: 'Power Corp Ltd',
  desc: 'Electricity Bill - Aug',
  amount: 45000,
  date: '2024-09-10',
  status: 'Approved',
  dueDate: '2024-09-20'
},
{
  id: 2,
  vendor: 'ABC Stationers',
  desc: 'Exam Paper Supply',
  amount: 12500,
  date: '2024-09-08',
  status: 'Paid',
  dueDate: '2024-09-15'
},
{
  id: 3,
  vendor: 'City Water Works',
  desc: 'Water Charges',
  amount: 3200,
  date: '2024-09-05',
  status: 'Approved',
  dueDate: '2024-09-18'
},
{
  id: 4,
  vendor: 'Tech Solutions',
  desc: 'IT Maintenance',
  amount: 8000,
  date: '2024-09-02',
  status: 'Paid',
  dueDate: '2024-09-12'
},
{
  id: 5,
  vendor: 'Local Sports',
  desc: 'Cricket Kits',
  amount: 15000,
  date: '2024-09-01',
  status: 'Pending',
  dueDate: '2024-09-25'
}];

// Panel Info Data
const PANEL_INFO: Record<string, MetricInfo> = {
  'budget-vs-actual': {
    title: 'Budget vs Actual Analysis',
    description:
    'This chart compares the allocated budget for each expense head against the actual expenditure incurred. Helps identify over-spending and under-utilization patterns across different categories.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Annual Budget Allocation System',
      'Expense Tracking Module',
      'Department-wise Budget Distribution',
      'Monthly Reconciliation Reports']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Identifies areas of overspending requiring cost control',
      'Highlights under-utilized budgets for reallocation',
      'Supports data-driven budget planning for next year',
      'Essential for financial accountability and governance']

    },
    recommendedActions: [
    {
      action: 'Investigate categories exceeding budget',
      link: '/reports/over-budget'
    },
    {
      action: 'Reallocate unused funds to priority areas',
      link: '/budget/reallocation'
    },
    {
      action: 'Set up alerts for budget threshold breaches',
      link: '/settings/budget-alerts'
    }]

  },
  'expense-trend': {
    title: 'Expense Trend Analysis',
    description:
    'Month-over-month comparison of expenses across current and previous financial year. Includes budget line for reference. Helps identify seasonal patterns and year-on-year changes.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Historical Expense Records (2+ years)',
      'Monthly Closing Reports',
      'Budget Allocation Timeline']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Reveals seasonal expense patterns',
      'Enables accurate cash flow forecasting',
      'Identifies unusual spikes requiring investigation',
      'Supports strategic planning decisions']

    },
    recommendedActions: [
    {
      action: 'Analyze months with significant variance',
      link: '/reports/variance-analysis'
    },
    {
      action: 'Plan for high-expense periods',
      link: '/planning/cash-flow'
    },
    {
      action: 'Review cost optimization opportunities',
      link: '/reports/cost-optimization'
    }]

  },
  'department-split': {
    title: 'Department-wise Expense Split',
    description:
    'Distribution of total expenses across different departments. Shows which departments are the highest spenders and their proportional share of overall expenditure.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Department Cost Center Mapping',
      'Expense Allocation Rules',
      'Shared Service Cost Distribution']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Ensures equitable resource distribution',
      'Identifies departments for cost audits',
      'Supports departmental budget negotiations',
      'Enables inter-department benchmarking']

    },
    recommendedActions: [
    {
      action: 'Deep-dive into high-spending departments',
      link: '/reports/department-detail'
    },
    {
      action: 'Compare with enrollment/activity metrics',
      link: '/analytics/efficiency'
    },
    {
      action: 'Review shared cost allocation methodology',
      link: '/settings/cost-allocation'
    }]

  },
  'payment-modes': {
    title: 'Payment Mode Distribution',
    description:
    'Breakdown of expenses by payment method - bank transfer, cheque, cash, and UPI. Helps track payment digitization progress and cash handling exposure.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Payment Gateway Transaction Logs',
      'Bank Statement Reconciliation',
      'Petty Cash Disbursement Records']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Higher digital payments reduce cash handling risks',
      'Bank transfers provide better audit trails',
      'UPI payments offer instant settlement',
      'Cash payments need stricter controls']

    },
    recommendedActions: [
    {
      action: 'Encourage vendors to accept digital payments',
      link: '/vendors/payment-setup'
    },
    {
      action: 'Review cash payment policies',
      link: '/policies/cash-handling'
    },
    {
      action: 'Set digital payment targets',
      link: '/kpi/digital-adoption'
    }]

  },
  'top-vendors': {
    title: 'Top Vendors by Spend',
    description:
    'Ranking of vendors by total payment value during the selected period. Helps identify key vendor relationships and opportunities for negotiation.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Vendor Master Database',
      'Purchase Order History',
      'Payment Disbursement Records']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'High-value vendors warrant relationship management',
      'Volume-based negotiation opportunities',
      'Vendor concentration risk assessment',
      'Contract renewal planning support']

    },
    recommendedActions: [
    {
      action: 'Review contracts with top vendors',
      link: '/vendors/contracts'
    },
    {
      action: 'Negotiate volume discounts',
      link: '/procurement/negotiations'
    },
    {
      action: 'Evaluate vendor diversification',
      link: '/vendors/risk-analysis'
    }]

  },
  'daily-expense': {
    title: 'Daily Expense Pattern',
    description:
    'Day-wise expense distribution throughout the month. Identifies peak expense days and helps in cash planning for high-disbursement periods.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Daily Expense Journal Entries',
      'Payment Processing Timestamps',
      'Petty Cash Daily Logs']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Helps maintain adequate cash reserves',
      'Identifies unusual daily spending patterns',
      'Supports payroll and vendor payment scheduling',
      'Enables workload planning for finance team']

    },
    recommendedActions: [
    {
      action: 'Analyze high-expense days',
      link: '/reports/daily-analysis'
    },
    {
      action: 'Optimize payment scheduling',
      link: '/payments/schedule'
    },
    {
      action: 'Set daily expense alerts',
      link: '/settings/daily-alerts'
    }]

  },
  'recent-bills': {
    title: 'Recent Approved Bills',
    description:
    'Latest vendor invoices that have been processed through the approval workflow. Shows current payables status and upcoming payment obligations.',
    dataSource: {
      title: 'Data Sources',
      details: [
      'Bill Entry Module',
      'Approval Workflow System',
      'Vendor Invoice Repository']

    },
    whyItMatters: {
      title: 'Business Impact',
      details: [
      'Tracks recent financial commitments',
      'Ensures timely payment processing',
      'Provides visibility into upcoming cash needs',
      'Supports vendor relationship management']

    },
    recommendedActions: [
    {
      action: 'Process approved bills for payment',
      link: '/payments/queue'
    },
    {
      action: 'Review pending approvals',
      link: '/approvals/pending'
    },
    {
      action: 'Check bill aging status',
      link: '/reports/bill-aging'
    }]

  }
};
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

export function ExpenseSummaryDashboard() {
  const navigate = useNavigate();
  // State
  const [finYear, setFinYear] = useState('2024-2025');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [selectedKpiInfo, setSelectedKpiInfo] = useState<MetricInfo | null>(
    null
  );
  const isAllSelected =
  selectedBranches.length === 0 || selectedBranches.length === BRANCHES.length;
  const toggleBranch = (id: string) => {
    if (id === 'all') setSelectedBranches([]);else

    setSelectedBranches((prev) =>
    prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };
  const openKpiInfo = (stat: (typeof STATS)[0]) => {
    setSelectedKpiInfo(stat.info);
    setActiveInfoModal('kpi');
  };
  const openPanelInfo = (panelId: string) => {
    setSelectedKpiInfo(PANEL_INFO[panelId]);
    setActiveInfoModal('panel');
  };
  const closeModal = () => {
    setActiveInfoModal(null);
    setSelectedKpiInfo(null);
  };
  const InfoButton = ({ onClick }: {onClick: () => void;}) =>
  <button
    onClick={onClick}
    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
    title="View details">

      <Info className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
    </button>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Info Modal */}
      {selectedKpiInfo &&
      <InfoModal
        isOpen={!!activeInfoModal}
        onClose={closeModal}
        info={selectedKpiInfo} />

      }

      {/* Header & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Expense Control Room
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitor cash outflow, payables, budget utilization, and vendor
                payments
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
                label: 'FY 2024-25'
              },
              {
                value: '2023-2024',
                label: 'FY 2023-24'
              },
              {
                value: '2022-2023',
                label: 'FY 2022-23'
              }]
              }
              value={finYear}
              onChange={(e) => setFinYear(e.target.value)} />

            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Branch Tags */}
        {!isAllSelected && selectedBranches.length > 0 &&
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
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
      </div>

      {/* KPI Cards - Row 1 (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.slice(0, 4).map((stat) =>
        <div
          key={stat.id}
          className={`bg-white rounded-xl border ${stat.borderColor} p-5 hover:shadow-lg transition-all duration-200`}>

            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <InfoButton onClick={() => openKpiInfo(stat)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              {stat.trend === 'up' &&
            <span className="flex items-center text-xs font-medium text-red-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              {stat.trend === 'down' &&
            <span className="flex items-center text-xs font-medium text-green-600">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              {stat.trend === 'neutral' &&
            <span className="text-xs font-medium text-gray-600">
                  {stat.change}
                </span>
            }
              {stat.trend === 'warning' &&
            <span className="flex items-center text-xs font-medium text-orange-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              {stat.trend === 'danger' &&
            <span className="flex items-center text-xs font-medium text-red-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              <span className="text-xs text-gray-400">{stat.changeLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards - Row 2 (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.slice(4, 8).map((stat) =>
        <div
          key={stat.id}
          className={`bg-white rounded-xl border ${stat.borderColor} p-5 hover:shadow-lg transition-all duration-200`}>

            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <InfoButton onClick={() => openKpiInfo(stat)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              {stat.trend === 'up' &&
            <span className="flex items-center text-xs font-medium text-red-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              {stat.trend === 'down' &&
            <span className="flex items-center text-xs font-medium text-green-600">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              {stat.trend === 'neutral' &&
            <span className="text-xs font-medium text-gray-600">
                  {stat.change}
                </span>
            }
              {stat.trend === 'warning' &&
            <span className="flex items-center text-xs font-medium text-orange-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              {stat.trend === 'danger' &&
            <span className="flex items-center text-xs font-medium text-red-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
            }
              <span className="text-xs text-gray-400">{stat.changeLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Budget vs Actual
                </h3>
                <p className="text-xs text-gray-500">
                  Top expense heads comparison
                </p>
              </div>
            </div>
            <InfoButton onClick={() => openPanelInfo('budget-vs-actual')} />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BUDGET_DATA}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0" />

                <XAxis
                  dataKey="head"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11
                  }} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value / 100000}L`}
                  tick={{
                    fontSize: 11
                  }} />

                <Tooltip
                  formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  '']
                  }
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />

                <Legend
                  wrapperStyle={{
                    paddingTop: '10px'
                  }} />

                <Bar
                  dataKey="budget"
                  name="Budget"
                  fill="#e5e7eb"
                  radius={[4, 4, 0, 0]}
                  barSize={24} />

                <Bar
                  dataKey="actual"
                  name="Actual"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={24} />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Expense Trends</h3>
                <p className="text-xs text-gray-500">
                  Year-over-year comparison
                </p>
              </div>
            </div>
            <InfoButton onClick={() => openPanelInfo('expense-trend')} />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={TREND_DATA}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0" />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11
                  }} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value / 100000}L`}
                  tick={{
                    fontSize: 11
                  }} />

                <Tooltip
                  formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  '']
                  }
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />

                <Legend />
                <Area
                  type="monotone"
                  dataKey="budget"
                  name="Budget"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={0.3} />

                <Line
                  type="monotone"
                  dataKey="lastYear"
                  name="Last Year"
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false} />

                <Line
                  type="monotone"
                  dataKey="thisYear"
                  name="This Year"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{
                    r: 6
                  }} />

              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Split */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">By Department</h3>
                <p className="text-xs text-gray-500">Expense distribution</p>
              </div>
            </div>
            <InfoButton onClick={() => openPanelInfo('department-split')} />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value">

                  {DEPT_DATA.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} />

                  )}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                  `${value}% (₹${(props.payload.amount / 100000).toFixed(1)}L)`,
                  name]
                  } />

              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {DEPT_DATA.map((item, index) =>
            <div key={item.name} className="flex items-center gap-2">
                <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index]
                }} />

                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Wallet className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Payment Modes</h3>
                <p className="text-xs text-gray-500">How payments are made</p>
              </div>
            </div>
            <InfoButton onClick={() => openPanelInfo('payment-modes')} />
          </div>
          <div className="space-y-4">
            {PAYMENT_MODE_DATA.map((mode, index) =>
            <div key={mode.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{mode.name}</span>
                  <span className="text-gray-500">
                    {mode.value}% (₹{(mode.amount / 100000).toFixed(1)}L)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${mode.value}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }} />

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily Expense Pattern */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Daily Pattern</h3>
                <p className="text-xs text-gray-500">
                  This month's daily expenses
                </p>
              </div>
            </div>
            <InfoButton onClick={() => openPanelInfo('daily-expense')} />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={DAILY_EXPENSE_DATA}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5
                }}>

                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0" />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10
                  }} />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  tick={{
                    fontSize: 10
                  }} />

                <Tooltip
                  formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  'Expense']
                  }
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }} />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#colorAmount)" />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Vendors */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Top Vendors</h3>
                <p className="text-xs text-gray-500">By total spend</p>
              </div>
            </div>
            <InfoButton onClick={() => openPanelInfo('top-vendors')} />
          </div>
          <div className="p-4 space-y-3">
            {VENDOR_TOP_DATA.map((vendor, index) =>
            <div
              key={vendor.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {vendor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vendor.bills} bills
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{(vendor.amount / 100000).toFixed(1)}L
                </span>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/vendors')}>

              View All Vendors
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Recent Bills */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Receipt className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Recent Bills</h3>
                <p className="text-xs text-gray-500">
                  Latest approved invoices
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <InfoButton onClick={() => openPanelInfo('recent-bills')} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/finance/expenses/bill-entry')}>

                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_BILLS.map((bill) =>
                <tr
                  key={bill.id}
                  className="hover:bg-gray-50 transition-colors">

                    <td className="px-4 py-3 text-sm text-gray-500">
                      {bill.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 text-sm">
                        {bill.vendor}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {bill.desc}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-900">
                        ₹{bill.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {bill.dueDate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                      variant={
                      bill.status === 'Paid' ?
                      'success' :
                      bill.status === 'Approved' ?
                      'warning' :
                      'info'
                      }>

                        {bill.status}
                      </Badge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/finance/expenses/bill-entry')}>

            <Receipt className="w-6 h-6 text-blue-600" />
            <span className="text-sm">New Bill Entry</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/finance/expenses/voucher')}>

            <FileText className="w-6 h-6 text-green-600" />
            <span className="text-sm">Create Voucher</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/approvals/pending')}>

            <CheckCircle className="w-6 h-6 text-purple-600" />
            <span className="text-sm">Pending Approvals</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/payments/queue')}>

            <IndianRupee className="w-6 h-6 text-orange-600" />
            <span className="text-sm">Process Payments</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/reports/expense')}>

            <BarChart2 className="w-6 h-6 text-cyan-600" />
            <span className="text-sm">Expense Reports</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/vendors/manage')}>

            <Building2 className="w-6 h-6 text-indigo-600" />
            <span className="text-sm">Manage Vendors</span>
          </Button>
        </div>
      </div>
    </div>);

}