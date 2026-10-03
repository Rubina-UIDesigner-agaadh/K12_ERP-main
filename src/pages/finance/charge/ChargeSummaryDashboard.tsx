import React, { useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  TrendingUp,
  Wallet,
  Clock,
  AlertCircle,
  PlusCircle,
  Receipt,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Info,
  X,
  Database,
  Zap,
  FileText,
  Settings,
  Download,
  Users,
  CreditCard,
  TrendingDown,
  CheckCircle,
  Eye,
  Filter,
  RefreshCw,
  DollarSign,
  Activity,
  Target,
  Layers,
  BookOpen,
  Truck,
  Award,
  AlertTriangle,
  Building,
  UserCheck,
  FileBarChart,
  ClipboardList,
  Search,
  Bell,
  Printer,
  Mail,
  Phone,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  LayoutDashboard,
  ListChecks,
  BookX,
  Beaker,
  ShieldAlert,
  Car,
  Shirt,
  FileWarning,
  UserX,
  Banknote,
  CircleDollarSign,
  User,
  GraduationCap,
  Briefcase,
  Hash,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  Building2,
  ChevronDown,
  Check } from
'lucide-react';
// Types
interface InfoPanelData {
  id: string;
  title: string;
  description: string;
  dataSource: {
    title: string;
    description: string;
    tables?: string[];
  };
  whyItMatters: {
    title: string;
    description: string;
    benefits?: string[];
  };
  recommendedActions: {
    label: string;
    description: string;
    link?: string;
  }[];
  relatedMetrics?: string[];
  formula?: string;
  updateFrequency?: string;
}
// Charge Categories
const chargeCategories = [
{
  id: 'library',
  name: 'Library Fines',
  icon: BookX,
  color: 'text-amber-600',
  bgColor: 'bg-amber-100'
},
{
  id: 'lab',
  name: 'Lab Breakage',
  icon: Beaker,
  color: 'text-purple-600',
  bgColor: 'bg-purple-100'
},
{
  id: 'discipline',
  name: 'Discipline Fine',
  icon: ShieldAlert,
  color: 'text-red-600',
  bgColor: 'bg-red-100'
},
{
  id: 'transport',
  name: 'Transport Damage',
  icon: Car,
  color: 'text-blue-600',
  bgColor: 'bg-blue-100'
},
{
  id: 'uniform',
  name: 'Uniform/ID Replacement',
  icon: Shirt,
  color: 'text-green-600',
  bgColor: 'bg-green-100'
},
{
  id: 'certificate',
  name: 'Certificate Charges',
  icon: FileText,
  color: 'text-indigo-600',
  bgColor: 'bg-indigo-100'
},
{
  id: 'property',
  name: 'Property Damage',
  icon: Building,
  color: 'text-orange-600',
  bgColor: 'bg-orange-100'
},
{
  id: 'late',
  name: 'Late Fee Penalty',
  icon: Clock,
  color: 'text-pink-600',
  bgColor: 'bg-pink-100'
},
{
  id: 'misc',
  name: 'Miscellaneous',
  icon: FileWarning,
  color: 'text-gray-600',
  bgColor: 'bg-gray-100'
}];

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

// Info Panel Data for each KPI and Section
const infoPanelData: Record<string, InfoPanelData> = {
  totalChargesPosted: {
    id: 'totalChargesPosted',
    title: 'Total Charges Posted Today',
    description:
    'This metric represents the cumulative value of all penalty charges, fines, and ad-hoc fees that have been posted against students or staff accounts during the current business day. This includes library fines, lab breakage charges, discipline fines, certificate fees, and any other miscellaneous charges assigned.',
    dataSource: {
      title: 'Data Source',
      description:
      'This data is aggregated from the Charge Posting module where administrative staff records fines and penalties against individual accounts.',
      tables: [
      'charge_master',
      'charge_transactions',
      'student_charges',
      'staff_charges']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Tracking daily charge postings helps maintain accountability, ensures timely billing of penalties, and identifies patterns in student/staff behavior requiring attention.',
      benefits: [
      'Monitor penalty frequency',
      'Identify repeat offenders',
      'Track charge posting efficiency',
      'Ensure policy compliance',
      'Revenue from fines tracking']

    },
    recommendedActions: [
    {
      label: 'View All Posted Charges',
      description: "See detailed list of today's charges"
    },
    {
      label: 'Category-wise Breakdown',
      description: 'Analyze charges by type (library, lab, etc.)'
    },
    {
      label: 'Export Charge Report',
      description: 'Download detailed posting report'
    },
    {
      label: 'Review Pending Approvals',
      description: 'Charges awaiting verification'
    }],

    formula:
    'Sum of all charge amounts where posting_date = TODAY and status = POSTED',
    updateFrequency: 'Real-time (updates with each charge entry)'
  },
  totalCollected: {
    id: 'totalCollected',
    title: 'Total Charges Collected Today',
    description:
    'This metric shows the total amount of penalty charges and fines collected from students and staff during the current business day. Collections can be made through cash, online payment, salary deduction (for staff), or fee adjustment.',
    dataSource: {
      title: 'Data Source',
      description:
      'Data is pulled from the Charge Collection module, aggregating all successful payment transactions against posted charges.',
      tables: [
      'charge_receipts',
      'charge_payments',
      'salary_deductions',
      'fee_adjustments']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Daily collection tracking ensures timely recovery of dues and helps identify collection efficiency for different charge types.',
      benefits: [
      'Track recovery efficiency',
      'Monitor collection staff performance',
      'Identify payment patterns',
      'Cash flow from penalties',
      'Reduce outstanding charges']

    },
    recommendedActions: [
    {
      label: 'View Collection Details',
      description: 'Browse all receipts issued today'
    },
    {
      label: 'Payment Mode Analysis',
      description: 'Breakdown by cash, online, deduction'
    },
    {
      label: 'Collector Performance',
      description: 'Staff-wise collection report'
    },
    {
      label: 'Pending Collections',
      description: 'Charges due for collection'
    }],

    formula:
    'Sum of all charge receipts where receipt_date = TODAY and status = CONFIRMED',
    updateFrequency: 'Real-time (updates with each collection)'
  },
  outstandingCharges: {
    id: 'outstandingCharges',
    title: 'Outstanding Charges',
    description:
    'The total amount of penalty charges and fines that have been posted but not yet collected from students and staff. This includes overdue charges from previous periods as well as recently posted charges pending payment.',
    dataSource: {
      title: 'Data Source',
      description:
      'Calculated from the charge ledger by summing all unpaid charge entries across all students and staff accounts.',
      tables: [
      'charge_ledger',
      'student_charges',
      'staff_charges',
      'charge_aging']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Managing outstanding charges is essential for institutional discipline, financial recovery, and ensuring accountability for damages and violations.',
      benefits: [
      'Identify chronic defaulters',
      'Prioritize collection efforts',
      'Track aging of charges',
      'Support clearance decisions',
      'Policy enforcement']

    },
    recommendedActions: [
    {
      label: 'View Defaulter List',
      description: 'Students/Staff with pending charges'
    },
    {
      label: 'Send Payment Reminders',
      description: 'Bulk SMS/Email notifications'
    },
    {
      label: 'Age-wise Analysis',
      description: 'Outstanding by overdue period'
    },
    {
      label: 'Block Clearance Report',
      description: 'Pending charges blocking clearance'
    }],

    formula:
    'Sum of (Total Charges Posted - Total Collected) where balance > 0',
    updateFrequency: 'Real-time'
  },
  topChargeCategory: {
    id: 'topChargeCategory',
    title: 'Top Charge Category',
    description:
    'Identifies the charge category that generates the highest number of penalties or the maximum revenue from fines. This helps understand which areas require more attention in terms of discipline or infrastructure maintenance.',
    dataSource: {
      title: 'Data Source',
      description:
      'Analyzed from charge posting data, grouped and ranked by charge category.',
      tables: ['charge_transactions', 'charge_categories', 'charge_master']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Understanding charge distribution helps identify problem areas, inform policy decisions, and plan preventive measures.',
      benefits: [
      'Identify problem areas',
      'Policy review insights',
      'Infrastructure planning',
      'Behavioral pattern analysis',
      'Preventive action planning']

    },
    recommendedActions: [
    {
      label: 'Category Analysis',
      description: 'Detailed breakdown by charge type'
    },
    {
      label: 'Trend Comparison',
      description: 'Monthly category trends'
    },
    {
      label: 'Top Offenders Report',
      description: 'Frequent violators by category'
    },
    {
      label: 'Policy Review',
      description: 'Evaluate charge structures'
    }],

    formula: 'Category with MAX(count or sum of charges) in selected period',
    updateFrequency: 'Updated daily'
  },
  revenueFromCharges: {
    id: 'revenueFromCharges',
    title: 'Revenue from Charges Analysis',
    description:
    'A comparative visualization of charges collected versus pending outstanding amounts over the past 6 months. This helps identify collection efficiency trends and seasonal patterns in charge recovery.',
    dataSource: {
      title: 'Data Source',
      description:
      'Historical data from charge collection and posting modules, aggregated monthly.',
      tables: [
      'monthly_charge_summary',
      'charge_receipts',
      'charge_transactions']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Understanding charge recovery patterns enables better financial planning and identifies periods requiring focused collection efforts.',
      benefits: [
      'Seasonal trend identification',
      'Collection efficiency tracking',
      'Revenue forecasting',
      'Performance benchmarking']

    },
    recommendedActions: [
    {
      label: 'View Monthly Details',
      description: 'Drill down into specific months'
    },
    {
      label: 'Compare Academic Years',
      description: 'Year-over-year analysis'
    },
    {
      label: 'Export Revenue Report',
      description: 'Download detailed analysis'
    },
    {
      label: 'Set Collection Targets',
      description: 'Configure monthly goals'
    }],

    formula:
    'Monthly aggregation of charge collections and outstanding balances',
    updateFrequency: 'Updated daily'
  },
  chargeDistribution: {
    id: 'chargeDistribution',
    title: 'Charge Category Distribution',
    description:
    'A proportional breakdown of total charges by category type. This visualization shows how different charge types (library fines, lab breakage, etc.) contribute to the overall penalty revenue.',
    dataSource: {
      title: 'Data Source',
      description:
      'Aggregated from all charge postings, categorized by charge type.',
      tables: ['charge_transactions', 'charge_categories', 'charge_master']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Understanding charge composition helps identify major penalty sources and areas needing preventive measures or policy changes.',
      benefits: [
      'Identify major penalty areas',
      'Infrastructure improvement needs',
      'Behavioral intervention planning',
      'Policy effectiveness evaluation']

    },
    recommendedActions: [
    {
      label: 'View Category Details',
      description: 'Detailed category analysis'
    },
    {
      label: 'Student vs Staff Split',
      description: 'Charges by account type'
    },
    {
      label: 'Class-wise Distribution',
      description: 'Charges by student class'
    },
    {
      label: 'Review Charge Policies',
      description: 'Update charge structures'
    }],

    formula:
    'Percentage of each category = (Category Total / Grand Total) × 100',
    updateFrequency: 'Real-time'
  },
  collectionEfficiency: {
    id: 'collectionEfficiency',
    title: 'Charge Collection Efficiency',
    description:
    "A comprehensive snapshot of the institution's charge collection efficiency and overall recovery performance. The efficiency percentage indicates how much of the posted charges have been successfully collected.",
    dataSource: {
      title: 'Data Source',
      description:
      'Calculated from total charges posted, collections made, and outstanding analysis.',
      tables: ['charge_summary', 'charge_receipts', 'charge_ledger']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Collection efficiency metrics provide a quick assessment of recovery effectiveness and help identify areas needing attention.',
      benefits: [
      'Quick health assessment',
      'Collection team evaluation',
      'Policy effectiveness check',
      'Early warning indicator']

    },
    recommendedActions: [
    {
      label: 'Download Detailed Report',
      description: 'Comprehensive collection analysis'
    },
    {
      label: 'View Collection Trends',
      description: 'Historical efficiency data'
    },
    {
      label: 'Defaulter Impact Analysis',
      description: 'How defaulters affect efficiency'
    },
    {
      label: 'Set Improvement Targets',
      description: 'Configure efficiency goals'
    }],

    formula:
    'Collection Efficiency = (Total Collected / Total Charges Posted) × 100',
    updateFrequency: 'Real-time'
  },
  recentCharges: {
    id: 'recentCharges',
    title: 'Recent Charge Activity',
    description:
    'A live feed showing the most recent charge postings and collections. This provides real-time visibility into charge activities as they happen, helping monitor day-to-day operations.',
    dataSource: {
      title: 'Data Source',
      description:
      'Live stream from the charge posting and collection modules, showing latest confirmed transactions.',
      tables: [
      'charge_transactions',
      'charge_receipts',
      'student_master',
      'staff_master']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Real-time activity monitoring helps supervisors track charge posting pace and identify any issues immediately.',
      benefits: [
      'Real-time monitoring',
      'Audit trail visibility',
      'Staff activity tracking',
      'Instant issue identification']

    },
    recommendedActions: [
    {
      label: 'View All Transactions',
      description: 'Complete transaction history'
    },
    {
      label: 'Filter by Category',
      description: 'View specific charge types'
    },
    {
      label: "Today's Charge Report",
      description: 'Detailed daily report'
    },
    {
      label: 'Verify Entries',
      description: 'Audit flagged transactions'
    }],

    updateFrequency: 'Live (instant updates)'
  },
  pendingApprovals: {
    id: 'pendingApprovals',
    title: 'Pending Charge Approvals',
    description:
    'Charges that have been posted but require approval from authorized personnel before they become active. This ensures proper verification of penalty amounts and reasons.',
    dataSource: {
      title: 'Data Source',
      description:
      'Charges in pending status awaiting supervisor or management approval.',
      tables: ['charge_transactions', 'approval_workflow', 'pending_charges']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Timely approval of charges ensures accountability and prevents delays in collection process.',
      benefits: [
      'Ensures proper verification',
      'Prevents unauthorized charges',
      'Maintains audit trail',
      'Speeds up collection']

    },
    recommendedActions: [
    {
      label: 'View Pending List',
      description: 'All charges awaiting approval'
    },
    {
      label: 'Bulk Approve',
      description: 'Approve multiple charges'
    },
    {
      label: 'Reject with Reason',
      description: 'Decline invalid charges'
    },
    {
      label: 'Escalate Overdue',
      description: 'Flag delayed approvals'
    }]

  },
  waiverRequests: {
    id: 'waiverRequests',
    title: 'Waiver/Concession Requests',
    description:
    'Requests for charge waivers or concessions submitted by students, parents, or staff. These require management approval and proper documentation.',
    dataSource: {
      title: 'Data Source',
      description:
      'Waiver requests submitted through the charge management system.',
      tables: ['waiver_requests', 'charge_adjustments', 'approval_workflow']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Proper handling of waiver requests ensures fairness and maintains institutional policies while allowing genuine cases.',
      benefits: [
      'Fair treatment of cases',
      'Policy compliance',
      'Documentation trail',
      'Management oversight']

    },
    recommendedActions: [
    {
      label: 'View Waiver Requests',
      description: 'Pending waiver applications'
    },
    {
      label: 'Approve/Reject',
      description: 'Process waiver decisions'
    },
    {
      label: 'Waiver History',
      description: 'Past waiver decisions'
    },
    {
      label: 'Policy Guidelines',
      description: 'Waiver eligibility rules'
    }]

  }
};
// Info Panel Modal Component
interface InfoPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InfoPanelData | null;
}
const InfoPanelModal: React.FC<InfoPanelModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start rounded-t-2xl">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
            {data.updateFrequency &&
            <div className="flex items-center gap-2 mt-2">
                <RefreshCw className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {data.updateFrequency}
                </span>
              </div>
            }
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-gray-600 leading-relaxed">{data.description}</p>
          </div>

          {/* Formula if exists */}
          {data.formula &&
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Calculation Formula
                </span>
              </div>
              <code className="text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-200 block">
                {data.formula}
              </code>
            </div>
          }

          {/* Data Source & Why It Matters Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Source Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 text-sm uppercase">
                  {data.dataSource.title}
                </h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                {data.dataSource.description}
              </p>
              {data.dataSource.tables &&
              <div className="flex flex-wrap gap-2">
                  {data.dataSource.tables.map((table, idx) =>
                <span
                  key={idx}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">

                      {table}
                    </span>
                )}
                </div>
              }
            </div>

            {/* Why It Matters Card */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 text-sm uppercase">
                  {data.whyItMatters.title}
                </h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed mb-3">
                {data.whyItMatters.description}
              </p>
              {data.whyItMatters.benefits &&
              <ul className="space-y-1">
                  {data.whyItMatters.benefits.map((benefit, idx) =>
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-purple-700">

                      <CheckCircle className="w-3 h-3 text-purple-500" />
                      {benefit}
                    </li>
                )}
                </ul>
              }
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-700 text-sm uppercase">
                Recommended Actions
              </h3>
            </div>
            <div className="space-y-2">
              {data.recommendedActions.map((action, idx) =>
              <button
                key={idx}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">

                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Related Metrics */}
          {data.relatedMetrics && data.relatedMetrics.length > 0 &&
          <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-gray-400" />
                <h3 className="font-semibold text-gray-700 text-sm uppercase">
                  Related Metrics
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.relatedMetrics.map((metric, idx) =>
              <Badge key={idx} variant="info">
                    {metric}
                  </Badge>
              )}
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>);

};
// Info Button Component
interface InfoButtonProps {
  onClick: () => void;
  className?: string;
}
const InfoButton: React.FC<InfoButtonProps> = ({ onClick, className = '' }) =>
<button
  onClick={(e) => {
    e.stopPropagation();
    onClick();
  }}
  className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${className}`}
  title="View Details">

    <Info className="w-4 h-4 text-gray-400 hover:text-blue-600" />
  </button>;

export function ChargeSummaryDashboard() {
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-25');
  const [selectedAccountType, setSelectedAccountType] = useState('all');
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [selectedInfoPanel, setSelectedInfoPanel] =
  useState<InfoPanelData | null>(null);
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
  // Open info panel
  const openInfoPanel = (panelId: string) => {
    const data = infoPanelData[panelId];
    if (data) {
      setSelectedInfoPanel(data);
      setInfoPanelOpen(true);
    }
  };
  // Close info panel
  const closeInfoPanel = () => {
    setInfoPanelOpen(false);
    setSelectedInfoPanel(null);
  };
  // KPI Data
  const kpis = [
  {
    id: 'totalChargesPosted',
    title: 'Charges Posted Today',
    value: '₹42,500',
    count: '18 charges',
    trend: '+8.5%',
    trendUp: true,
    trendLabel: 'vs yesterday',
    icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    details: [
    {
      label: 'Library Fines',
      value: '₹12,500 (8)'
    },
    {
      label: 'Lab Breakage',
      value: '₹18,000 (4)'
    },
    {
      label: 'Other Charges',
      value: '₹12,000 (6)'
    }]

  },
  {
    id: 'totalCollected',
    title: 'Charges Collected Today',
    value: '₹68,200',
    count: '32 receipts',
    trend: '+12.3%',
    trendUp: true,
    trendLabel: 'vs yesterday',
    icon: <Wallet className="w-6 h-6 text-green-600" />,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    details: [
    {
      label: 'Cash',
      value: '₹28,000'
    },
    {
      label: 'Online',
      value: '₹32,200'
    },
    {
      label: 'Salary Deduction',
      value: '₹8,000'
    }]

  },
  {
    id: 'outstandingCharges',
    title: 'Outstanding Charges',
    value: '₹3,45,800',
    count: '156 pending',
    trend: '-4.2%',
    trendUp: false,
    trendLabel: 'vs last week',
    icon: <Clock className="w-6 h-6 text-orange-600" />,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    details: [
    {
      label: 'Students',
      value: '₹2,85,800 (142)'
    },
    {
      label: 'Staff',
      value: '₹60,000 (14)'
    },
    {
      label: 'Overdue (>30 days)',
      value: '₹1,25,000'
    }]

  },
  {
    id: 'topChargeCategory',
    title: 'Top Charge Category',
    value: 'Lab Breakage',
    subValue: '38% of total charges this month',
    icon: <Beaker className="w-6 h-6 text-purple-600" />,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    details: [
    {
      label: 'Lab Breakage',
      value: '38%'
    },
    {
      label: 'Library Fines',
      value: '28%'
    },
    {
      label: 'Property Damage',
      value: '15%'
    }]

  }];

  // Recent charges data
  const recentCharges = [
  {
    id: '1',
    chargeNo: 'CHG-2024-0892',
    name: 'Rahul Sharma',
    type: 'Student',
    class: '10-A',
    category: 'Lab Breakage',
    categoryIcon: Beaker,
    categoryColor: 'text-purple-600',
    amount: 2500,
    status: 'Posted',
    time: '5 mins ago',
    postedBy: 'Lab Incharge'
  },
  {
    id: '2',
    chargeNo: 'CHG-2024-0891',
    name: 'Priya Gupta',
    type: 'Student',
    class: '9-B',
    category: 'Library Fine',
    categoryIcon: BookX,
    categoryColor: 'text-amber-600',
    amount: 350,
    status: 'Collected',
    time: '12 mins ago',
    postedBy: 'Librarian'
  },
  {
    id: '3',
    chargeNo: 'CHG-2024-0890',
    name: 'Mr. Vikram Singh',
    type: 'Staff',
    class: 'Accounts Dept',
    category: 'Property Damage',
    categoryIcon: Building,
    categoryColor: 'text-orange-600',
    amount: 5000,
    status: 'Pending Approval',
    time: '25 mins ago',
    postedBy: 'Admin'
  },
  {
    id: '4',
    chargeNo: 'CHG-2024-0889',
    name: 'Ananya Das',
    type: 'Student',
    class: '12-A',
    category: 'Certificate Fee',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    amount: 500,
    status: 'Collected',
    time: '40 mins ago',
    postedBy: 'Office Staff'
  },
  {
    id: '5',
    chargeNo: 'CHG-2024-0888',
    name: 'Amit Kumar',
    type: 'Student',
    class: '8-C',
    category: 'Uniform Replacement',
    categoryIcon: Shirt,
    categoryColor: 'text-green-600',
    amount: 800,
    status: 'Posted',
    time: '1 hour ago',
    postedBy: 'Class Teacher'
  }];

  // Monthly charge data
  const monthlyData = [
  {
    month: 'Oct',
    posted: 45000,
    collected: 38000,
    collectedPct: 84
  },
  {
    month: 'Nov',
    posted: 52000,
    collected: 48000,
    collectedPct: 92
  },
  {
    month: 'Dec',
    posted: 38000,
    collected: 25000,
    collectedPct: 66
  },
  {
    month: 'Jan',
    posted: 62000,
    collected: 58000,
    collectedPct: 94
  },
  {
    month: 'Feb',
    posted: 48000,
    collected: 42000,
    collectedPct: 88
  },
  {
    month: 'Mar',
    posted: 55000,
    collected: 40000,
    collectedPct: 73
  }];

  // Charge distribution by category
  const chargeDistribution = [
  {
    name: 'Lab Breakage',
    percentage: 38,
    color: 'bg-purple-500',
    amount: '₹1,52,000',
    count: 45
  },
  {
    name: 'Library Fines',
    percentage: 28,
    color: 'bg-amber-500',
    amount: '₹1,12,000',
    count: 156
  },
  {
    name: 'Property Damage',
    percentage: 15,
    color: 'bg-orange-500',
    amount: '₹60,000',
    count: 12
  },
  {
    name: 'Certificate Fees',
    percentage: 10,
    color: 'bg-indigo-500',
    amount: '₹40,000',
    count: 80
  },
  {
    name: 'Others',
    percentage: 9,
    color: 'bg-gray-500',
    amount: '₹36,000',
    count: 28
  }];

  // Quick stats
  const quickStats = [
  {
    label: 'Students with Charges',
    value: '142',
    icon: GraduationCap,
    color: 'text-blue-600'
  },
  {
    label: 'Staff with Charges',
    value: '14',
    icon: Briefcase,
    color: 'text-purple-600'
  },
  {
    label: 'Pending Approvals',
    value: '8',
    icon: Clock,
    color: 'text-orange-600'
  },
  {
    label: 'Waiver Requests',
    value: '5',
    icon: FileWarning,
    color: 'text-red-600'
  }];

  // Top defaulters
  const topDefaulters = [
  {
    name: 'Rahul Sharma',
    class: '10-A',
    type: 'Student',
    amount: 12500,
    charges: 5,
    overdueDays: 45
  },
  {
    name: 'Priya Gupta',
    class: '9-B',
    type: 'Student',
    amount: 8000,
    charges: 3,
    overdueDays: 38
  },
  {
    name: 'Mr. Vikram Singh',
    class: 'Accounts',
    type: 'Staff',
    amount: 15000,
    charges: 2,
    overdueDays: 60
  },
  {
    name: 'Ankit Verma',
    class: '11-A',
    type: 'Student',
    amount: 6500,
    charges: 4,
    overdueDays: 30
  },
  {
    name: 'Sneha Reddy',
    class: '8-C',
    type: 'Student',
    amount: 4200,
    charges: 2,
    overdueDays: 25
  }];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Posted':
        return <Badge variant="info">Posted</Badge>;
      case 'Collected':
        return <Badge variant="success">Collected</Badge>;
      case 'Pending Approval':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'Waived':
        return <Badge variant="error">Waived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Info Panel Modal */}
      <InfoPanelModal
        isOpen={infoPanelOpen}
        onClose={closeInfoPanel}
        data={selectedInfoPanel} />


      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <CircleDollarSign className="w-6 h-6 text-orange-600" />
              </div>
              Charge Management Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage fines, penalties, and miscellaneous charges
              against students and staff
            </p>
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

            {/* Academic Year */}
            <Select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              options={[
              {
                value: '2024-25',
                label: '2024-2025'
              },
              {
                value: '2023-24',
                label: '2023-2024'
              },
              {
                value: '2022-23',
                label: '2022-2023'
              }]
              } />


            {/* Account Type Filter */}
            <Select
              value={selectedAccountType}
              onChange={(e) => setSelectedAccountType(e.target.value)}
              options={[
              {
                value: 'all',
                label: 'All Accounts'
              },
              {
                value: 'student',
                label: 'Students Only'
              },
              {
                value: 'staff',
                label: 'Staff Only'
              }]
              } />


            {/* Date Range */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="text-sm border-none focus:ring-0 outline-none w-32"
                value={dateRange.from}
                onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  from: e.target.value
                })
                } />

              <span className="text-gray-300">to</span>
              <input
                type="date"
                className="text-sm border-none focus:ring-0 outline-none w-32"
                value={dateRange.to}
                onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  to: e.target.value
                })
                } />

            </div>

            {/* Action Buttons */}
            <Button variant="primary">
              <PlusCircle className="w-4 h-4 mr-2" />
              Post New Charge
            </Button>
            <Button variant="outline">
              <Receipt className="w-4 h-4 mr-2" />
              Collect Charge
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

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          {quickStats.map((stat, idx) =>
          <div key={idx} className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) =>
        <Card
          key={kpi.id}
          className={`relative overflow-hidden hover:shadow-lg transition-shadow border ${kpi.borderColor}`}>

            <div className="p-6">
              {/* Header with Info Button */}
              <div className="flex items-start justify-between mb-4">
                <div
                className={`${kpi.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>

                  {kpi.icon}
                </div>
                <InfoButton onClick={() => openInfoPanel(kpi.id)} />
              </div>

              {/* Title & Value */}
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                {kpi.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
              {kpi.count &&
            <p className="text-sm text-gray-500 mt-1">{kpi.count}</p>
            }

              {/* Trend or SubValue */}
              {kpi.trend &&
            <div className="flex items-center mt-2">
                  <span
                className={`flex items-center text-sm font-semibold ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>

                    {kpi.trendUp ?
                <ArrowUpRight className="w-4 h-4 mr-1" /> :

                <ArrowDownRight className="w-4 h-4 mr-1" />
                }
                    {kpi.trend}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {kpi.trendLabel}
                  </span>
                </div>
            }
              {kpi.subValue &&
            <p className="text-sm text-purple-600 font-medium mt-2">
                  {kpi.subValue}
                </p>
            }

              {/* Details Breakdown */}
              {kpi.details &&
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {kpi.details.map((detail, idx) =>
              <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-500">{detail.label}</span>
                      <span className="font-medium text-gray-700">
                        {detail.value}
                      </span>
                    </div>
              )}
                </div>
            }
            </div>
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Revenue from Charges Chart */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Charge Collection Analysis
                  </h3>
                  <p className="text-xs text-gray-500">
                    Posted vs Collected - Last 6 Months
                  </p>
                </div>
              </div>
              <InfoButton onClick={() => openInfoPanel('revenueFromCharges')} />
            </div>

            <div className="p-6">
              {/* Chart */}
              <div className="h-[280px] w-full flex items-end justify-between gap-4">
                {monthlyData.map((data, i) =>
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group">

                    <div className="w-full flex flex-col justify-end h-[220px] gap-1 relative">
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div>Posted: ₹{(data.posted / 1000).toFixed(0)}K</div>
                        <div>
                          Collected: ₹{(data.collected / 1000).toFixed(0)}K (
                          {data.collectedPct}%)
                        </div>
                      </div>
                      {/* Posted bar (full height) */}
                      <div
                      className="bg-orange-200 rounded-t w-full transition-all group-hover:bg-orange-300 absolute bottom-0"
                      style={{
                        height: `${data.posted / 62000 * 100}%`
                      }} />

                      {/* Collected bar (overlay) */}
                      <div
                      className="bg-green-500 rounded-t w-full transition-all group-hover:bg-green-600 absolute bottom-0"
                      style={{
                        height: `${data.collected / 62000 * 100}%`
                      }} />

                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {data.month}
                    </span>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-200 rounded" />
                  <span className="text-sm text-gray-600">Charges Posted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-sm text-gray-600">
                    Charges Collected
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Two Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Charge Distribution by Category */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <PieChartIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Charge Categories</h3>
                </div>
                <InfoButton
                  onClick={() => openInfoPanel('chargeDistribution')} />

              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {chargeDistribution.map((item, idx) =>
                  <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">
                          {item.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{
                          width: `${item.percentage}%`
                        }} />

                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {item.amount}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.count} charges
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Collection Efficiency Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white">
              <div className="p-4 border-b border-white/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">
                    Collection Efficiency
                  </h3>
                </div>
                <button
                  onClick={() => openInfoPanel('collectionEfficiency')}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors">

                  <Info className="w-4 h-4 text-white/70 hover:text-white" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Overall Efficiency */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">
                      Overall Collection Rate
                    </span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full">
                    <div className="bg-white h-full rounded-full w-[78%]" />
                  </div>
                </div>

                {/* Student vs Staff */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">Students</span>
                      <span className="font-bold">82%</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full">
                      <div className="bg-yellow-400 h-full rounded-full w-[82%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">Staff</span>
                      <span className="font-bold">65%</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full">
                      <div className="bg-orange-400 h-full rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>

                {/* Summary Text */}
                <p className="text-sm leading-relaxed text-white/80">
                  Collection rate improved by 5% this month. Lab breakage
                  charges have the highest pending rate at 45%.
                </p>

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30">

                  <Download className="w-4 h-4 mr-2" />
                  Download Collection Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Top Defaulters Table */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Top Defaulters</h3>
                  <p className="text-xs text-gray-500">
                    Accounts with highest outstanding charges
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Class/Dept
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Charges
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Outstanding
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Overdue
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topDefaulters.map((row, idx) =>
                  <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${row.type === 'Student' ? 'bg-blue-100' : 'bg-purple-100'}`}>

                            {row.type === 'Student' ?
                          <GraduationCap className="w-4 h-4 text-blue-600" /> :

                          <Briefcase className="w-4 h-4 text-purple-600" />
                          }
                          </div>
                          <span className="font-medium text-gray-900">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                        variant={row.type === 'Student' ? 'info' : 'warning'}>

                          {row.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{row.class}</td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {row.charges}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-red-600">
                        ₹{row.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                        variant={row.overdueDays > 30 ? 'error' : 'warning'}>

                          {row.overdueDays} days
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Receipt className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing top 5 defaulters
              </span>
              <Button variant="ghost" className="text-blue-600">
                View All Defaulters
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Recent Charge Activity */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="animate-pulse">
                  Live
                </Badge>
                <InfoButton onClick={() => openInfoPanel('recentCharges')} />
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {recentCharges.map((item) =>
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors">

                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                      className={`p-2 rounded-lg ${item.type === 'Student' ? 'bg-blue-50' : 'bg-purple-50'}`}>

                        <item.categoryIcon
                        className={`w-4 h-4 ${item.categoryColor}`} />

                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.type === 'Student' ? item.class : item.class} •{' '}
                          {item.category}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.chargeNo}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{item.amount.toLocaleString()}
                      </p>
                      <div className="mt-1">{getStatusBadge(item.status)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>Posted by: {item.postedBy}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <Button variant="ghost" className="w-full text-blue-600">
                View All Charges
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-gray-600" />
                Quick Actions
              </h3>
            </div>

            <div className="p-4 space-y-3">
              <button
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                onClick={() => openInfoPanel('pendingApprovals')}>

                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">
                      Pending Approvals
                    </span>
                    <span className="text-xs text-gray-500">
                      8 charges awaiting approval
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </button>

              <button
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                onClick={() => openInfoPanel('waiverRequests')}>

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FileWarning className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">
                      Waiver Requests
                    </span>
                    <span className="text-xs text-gray-500">
                      5 requests pending review
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileBarChart className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">
                      Generate Reports
                    </span>
                    <span className="text-xs text-gray-500">
                      Charge & collection reports
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">
                      Send Reminders
                    </span>
                    <span className="text-xs text-gray-500">
                      SMS & Email to defaulters
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Settings className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">
                      Charge Configuration
                    </span>
                    <span className="text-xs text-gray-500">
                      Manage charge categories & rates
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </button>
            </div>
          </Card>

          {/* Charge Categories Quick View */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-600" />
                Charge Categories
              </h3>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {chargeCategories.map((cat) =>
                <button
                  key={cat.id}
                  className={`p-3 rounded-xl ${cat.bgColor} hover:opacity-80 transition-opacity flex flex-col items-center gap-2`}>

                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {cat.name.split(' ')[0]}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed">
            <div className="p-6 text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <HelpCircle className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-700 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Click the info icons on any card to learn more about the metrics
                and available actions
              </p>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}