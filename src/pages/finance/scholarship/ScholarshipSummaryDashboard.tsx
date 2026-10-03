import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Award,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  Info,
  X,
  Database,
  Zap,
  ChevronRight,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Wallet,
  Target,
  Calendar,
  AlertCircle,
  Building2,
  ChevronDown,
  Check } from
'lucide-react';
type Variant = 'success' | 'warning' | 'info' | 'error' | 'secondary' | 'danger';
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
  }[];
  // For the requested graphs/charts inside the info panel
  miniCharts?: {
    type: 'bar' | 'donut';
    title: string;
    subtitle?: string;
    bars?: {
      label: string;
      value: number;
      colorClass: string;
    }[];
    donut?: {
      label: string;
      value: number;
      colorClass: string;
    }[];
  }[];
}
const infoData: Record<string, InfoPanelData> = {
  totalScholarships: {
    id: 'totalScholarships',
    title: 'Total Scholarships',
    description:
    'Shows the total scholarship amount sanctioned/allocated in the selected academic year. This includes all scholarship schemes such as merit, need-based, sports, and government schemes. The value typically reflects sanctioned amounts, not only disbursed.',
    dataSource: {
      title: 'Data Source',
      description:
      'Calculated from Scholarship Scheme Master, Scholarship Sanction Register, and Student Scholarship Mapping.',
      tables: [
      'scholarship_scheme_master',
      'scholarship_sanction_register',
      'student_scholarship_mapping']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      "Helps management track total financial aid commitment and evaluate the school's scholarship coverage and budgeting accuracy.",
      benefits: [
      'Budget planning and forecasting',
      'Scheme effectiveness evaluation',
      'Compliance and reporting',
      'Aid distribution monitoring']

    },
    recommendedActions: [
    {
      label: 'Scheme-wise Report',
      description: 'See sanctioned amount by scheme'
    },
    {
      label: 'Class-wise Coverage',
      description: 'Analyze scholarship coverage by class/section'
    },
    {
      label: 'Export Scholarship Register',
      description: 'Download sanctioned scholarship list'
    }],

    miniCharts: [
    {
      type: 'bar',
      title: 'Sanctioned vs Disbursed (Quarterly)',
      subtitle: 'Academic year trend',
      bars: [
      {
        label: 'Q1',
        value: 72,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Q2',
        value: 81,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Q3',
        value: 65,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Q4',
        value: 88,
        colorClass: 'bg-blue-600'
      }]

    },
    {
      type: 'donut',
      title: 'Scheme Mix',
      subtitle: 'Share of total scholarships',
      donut: [
      {
        label: 'Merit',
        value: 47,
        colorClass: 'bg-purple-500'
      },
      {
        label: 'Need-based',
        value: 22,
        colorClass: 'bg-blue-500'
      },
      {
        label: 'Sports',
        value: 18,
        colorClass: 'bg-green-500'
      },
      {
        label: 'Govt.',
        value: 13,
        colorClass: 'bg-orange-500'
      }]

    }]

  },
  beneficiaries: {
    id: 'beneficiaries',
    title: 'Beneficiaries',
    description:
    'Counts the number of unique students who received (or are sanctioned for) scholarships within the selected academic year. A student is counted once even if they receive multiple scholarships, depending on your policy.',
    dataSource: {
      title: 'Data Source',
      description:
      'Derived from Student Scholarship Mapping and Scholarship Sanction Register filtered by academic year and status.',
      tables: [
      'student_master',
      'student_scholarship_mapping',
      'scholarship_sanction_register']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Helps monitor scholarship reach and equity across classes/categories, and ensures aid is distributed to intended beneficiaries.',
      benefits: [
      'Equity tracking by class/category',
      'Monitoring scheme reach',
      'Identifying underserved groups']

    },
    recommendedActions: [
    {
      label: 'Beneficiary List',
      description: 'View students receiving scholarships'
    },
    {
      label: 'Category-wise Analysis',
      description: 'Compare coverage by category'
    },
    {
      label: 'Duplicate/Audit Check',
      description: 'Detect duplicate benefits (if restricted)'
    }],

    miniCharts: [
    {
      type: 'bar',
      title: 'Beneficiaries by Class Band',
      subtitle: 'Primary vs Middle vs Senior',
      bars: [
      {
        label: 'Primary',
        value: 58,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Middle',
        value: 71,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Senior',
        value: 49,
        colorClass: 'bg-blue-600'
      }]

    },
    {
      type: 'donut',
      title: 'Approval Split',
      subtitle: 'Applications status mix',
      donut: [
      {
        label: 'Approved',
        value: 67,
        colorClass: 'bg-green-500'
      },
      {
        label: 'Pending',
        value: 19,
        colorClass: 'bg-yellow-500'
      },
      {
        label: 'Review',
        value: 10,
        colorClass: 'bg-blue-500'
      },
      {
        label: 'Rejected',
        value: 4,
        colorClass: 'bg-red-500'
      }]

    }]

  },
  disbursed: {
    id: 'disbursed',
    title: 'Disbursed',
    description:
    'Total scholarship amount actually disbursed/adjusted against student fee dues in the selected academic year. Disbursement may happen as direct payment, fee adjustment, or credit note based on your workflow.',
    dataSource: {
      title: 'Data Source',
      description:
      'Pulled from Scholarship Disbursement Ledger and Fee Adjustment/Receipt records.',
      tables: [
      'scholarship_disbursement_ledger',
      'fee_adjustments',
      'fee_receipts']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Measures how effectively sanctioned scholarships are being executed. A big gap between sanctioned and disbursed indicates operational delays or documentation issues.',
      benefits: [
      'Operational efficiency monitoring',
      'Identifying disbursement delays',
      'Cash flow and accounting alignment']

    },
    recommendedActions: [
    {
      label: 'Disbursement Pending Queue',
      description: 'Process pending disbursements'
    },
    {
      label: 'Bank Advice / Voucher Report',
      description: 'Download disbursement vouchers'
    },
    {
      label: 'Reconcile with Fees',
      description: 'Ensure adjustments match fee ledgers'
    }],

    miniCharts: [
    {
      type: 'bar',
      title: 'Monthly Disbursement Trend',
      subtitle: 'Last 6 months',
      bars: [
      {
        label: 'Oct',
        value: 61,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Nov',
        value: 74,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Dec',
        value: 52,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Jan',
        value: 83,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Feb',
        value: 79,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'Mar',
        value: 68,
        colorClass: 'bg-blue-600'
      }]

    }]

  },
  pending: {
    id: 'pending',
    title: 'Pending',
    description:
    'Total scholarship amount that is sanctioned or requested but not yet disbursed. Pending can occur due to incomplete documents, approvals, or disbursement scheduling.',
    dataSource: {
      title: 'Data Source',
      description:
      'Computed from Scholarship Applications and Sanction Register minus Disbursement Ledger entries.',
      tables: [
      'scholarship_applications',
      'scholarship_sanction_register',
      'scholarship_disbursement_ledger']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'High pending amounts can indicate workflow bottlenecks and may lead to dissatisfaction among students/parents.',
      benefits: [
      'Detect workflow bottlenecks',
      'Improve service delivery',
      'Reduce pending backlog']

    },
    recommendedActions: [
    {
      label: 'Pending Application List',
      description: 'View pending/under review applications'
    },
    {
      label: 'Document Checklist',
      description: 'Send missing document reminders'
    },
    {
      label: 'Approval SLA Report',
      description: 'Find delays by approver/stage'
    }],

    miniCharts: [
    {
      type: 'donut',
      title: 'Pending Reasons',
      subtitle: 'Why applications are pending',
      donut: [
      {
        label: 'Docs Missing',
        value: 41,
        colorClass: 'bg-orange-500'
      },
      {
        label: 'Approval Pending',
        value: 33,
        colorClass: 'bg-yellow-500'
      },
      {
        label: 'Bank Details',
        value: 16,
        colorClass: 'bg-blue-500'
      },
      {
        label: 'Other',
        value: 10,
        colorClass: 'bg-gray-500'
      }]

    }]

  },
  schemeDistribution: {
    id: 'schemeDistribution',
    title: 'Scheme-wise Distribution',
    description:
    'Shows how scholarship amounts and beneficiaries are distributed across different schemes (Merit, Need-based, Sports, Government, etc.).',
    dataSource: {
      title: 'Data Source',
      description:
      'Aggregated from Scholarship Scheme Master and Student Scholarship Mapping with scheme-level totals.',
      tables: ['scholarship_scheme_master', 'student_scholarship_mapping']
    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Helps evaluate which schemes have the highest impact and whether scheme allocation matches institutional priorities.',
      benefits: [
      'Scheme impact analysis',
      'Policy alignment',
      'Budget rationalization']

    },
    recommendedActions: [
    {
      label: 'Scheme Performance Report',
      description: 'Compare schemes by reach and amount'
    },
    {
      label: 'Adjust Scheme Budget',
      description: 'Update annual allocation per scheme'
    },
    {
      label: 'Export Scheme Summary',
      description: 'Download scheme totals in CSV/PDF'
    }],

    miniCharts: [
    {
      type: 'donut',
      title: 'Amount Share by Scheme',
      subtitle: 'Current academic year',
      donut: [
      {
        label: 'Merit',
        value: 46,
        colorClass: 'bg-purple-500'
      },
      {
        label: 'Need-based',
        value: 20,
        colorClass: 'bg-blue-500'
      },
      {
        label: 'Sports',
        value: 20,
        colorClass: 'bg-green-500'
      },
      {
        label: 'Govt.',
        value: 14,
        colorClass: 'bg-orange-500'
      }]

    }]

  },
  applicationStatus: {
    id: 'applicationStatus',
    title: 'Application Status',
    description:
    'Tracks the pipeline of scholarship applications by status (Approved, Pending, Under Review, Rejected) for the selected academic year.',
    dataSource: {
      title: 'Data Source',
      description:
      'Derived from Scholarship Applications workflow status and approval logs.',
      tables: [
      'scholarship_applications',
      'approval_workflow',
      'approval_logs']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Provides visibility into operational workload and helps ensure approvals and reviews are completed on time.',
      benefits: ['Workload planning', 'SLA monitoring', 'Process transparency']
    },
    recommendedActions: [
    {
      label: 'Review Queue',
      description: 'Open applications under review'
    },
    {
      label: 'Pending Approvals',
      description: 'Approve pending applications'
    },
    {
      label: 'Rejected Summary',
      description: 'Analyze rejection reasons'
    }],

    miniCharts: [
    {
      type: 'bar',
      title: 'Status Volume (Last 4 Weeks)',
      subtitle: 'Weekly counts',
      bars: [
      {
        label: 'W1',
        value: 62,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'W2',
        value: 74,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'W3',
        value: 58,
        colorClass: 'bg-blue-600'
      },
      {
        label: 'W4',
        value: 81,
        colorClass: 'bg-blue-600'
      }]

    }]

  },
  recentApplications: {
    id: 'recentApplications',
    title: 'Recent Applications',
    description:
    'Lists the latest scholarship applications created or updated recently. This helps the scholarship committee track recent activity and follow up on pending cases.',
    dataSource: {
      title: 'Data Source',
      description:
      'Pulled from Scholarship Applications with latest created/updated timestamps and status.',
      tables: [
      'scholarship_applications',
      'student_master',
      'scholarship_scheme_master']

    },
    whyItMatters: {
      title: 'Why It Matters',
      description:
      'Ensures that recent applications are processed quickly and no cases remain unattended.',
      benefits: [
      'Faster processing',
      'Reduced backlog',
      'Better student experience']

    },
    recommendedActions: [
    {
      label: 'Open Applications List',
      description: 'View and filter all applications'
    },
    {
      label: 'Export Recent List',
      description: 'Download latest submissions'
    },
    {
      label: 'Set SLA Reminders',
      description: 'Automate reminders for overdue cases'
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

function getStatusVariant(status: string): Variant {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Under Review':
      return 'info';
    case 'Rejected':
      return 'danger';
    default:
      return 'secondary';
  }
}
/** Info icon button */
function InfoButton({ onClick }: {onClick: () => void;}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
      title="View details">

      <Info className="w-4 h-4 text-gray-400 hover:text-blue-600" />
    </button>);

}
/** Simple Donut with CSS conic-gradient */
function DonutChart({
  data






}: {data: {label: string;value: number;colorClass: string;}[];}) {
  const total = data.reduce((s, x) => s + x.value, 0);
  const segments = data.reduce(
    (
    acc: {
      start: number;
      end: number;
      color: string;
    }[],
    item) =>
    {
      const start = acc.length ? acc[acc.length - 1].end : 0;
      const end = start + item.value / total * 360;
      const color = item.colorClass.
      replace('bg-', '').
      replace('-500', '').
      replace('-600', '');
      // Map tailwind-like names to hex-ish fallback
      const colorMap: Record<string, string> = {
        purple: '#A855F7',
        blue: '#3B82F6',
        green: '#22C55E',
        orange: '#F97316',
        yellow: '#EAB308',
        red: '#EF4444',
        gray: '#6B7280'
      };
      acc.push({
        start,
        end,
        color: colorMap[color] || '#3B82F6'
      });
      return acc;
    },
    []
  );
  const gradient = segments.
  map((s) => `${s.color} ${s.start}deg ${s.end}deg`).
  join(', ');
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-24 h-24 rounded-full"
        style={{
          background: `conic-gradient(${gradient})`
        }} />

      <div className="space-y-2">
        {data.map((d) =>
        <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${d.colorClass}`} />
            <span className="text-gray-700">{d.label}</span>
            <span className="text-gray-500">({d.value}%)</span>
          </div>
        )}
      </div>
    </div>);

}
/** Mini bar chart (percent scale) */
function MiniBarChart({
  bars






}: {bars: {label: string;value: number;colorClass: string;}[];}) {
  const max = Math.max(...bars.map((b) => b.value), 100);
  return (
    <div className="h-32 flex items-end gap-3">
      {bars.map((b) =>
      <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden h-24 flex items-end">
            <div
            className={`${b.colorClass} w-full`}
            style={{
              height: `${b.value / max * 100}%`
            }}
            title={`${b.value}`} />

          </div>
          <div className="text-xs text-gray-500">{b.label}</div>
        </div>
      )}
    </div>);

}
/** Metric Detail Modal */
function MetricDetailModal({
  isOpen,
  onClose,
  data




}: {isOpen: boolean;onClose: () => void;data: InfoPanelData | null;}) {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="pr-6">
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {data.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close">

            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Middle cards */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Source */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Database className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-sm font-semibold text-blue-900 uppercase">
                  {data.dataSource.title}
                </h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                {data.dataSource.description}
              </p>
              {data.dataSource.tables &&
              <div className="flex flex-wrap gap-2 mt-3">
                  {data.dataSource.tables.map((t) =>
                <span
                  key={t}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">

                      {t}
                    </span>
                )}
                </div>
              }
            </div>

            {/* Why it matters */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="text-sm font-semibold text-purple-900 uppercase">
                  {data.whyItMatters.title}
                </h3>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">
                {data.whyItMatters.description}
              </p>
              {data.whyItMatters.benefits &&
              <ul className="mt-3 space-y-1">
                  {data.whyItMatters.benefits.map((b) =>
                <li
                  key={b}
                  className="text-xs text-purple-700 flex items-center gap-2">

                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {b}
                    </li>
                )}
                </ul>
              }
            </div>
          </div>

          {/* Charts */}
          {data.miniCharts && data.miniCharts.length > 0 &&
          <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase">
                  Insights
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.miniCharts.map((chart) =>
              <div
                key={chart.title}
                className="border border-gray-100 rounded-xl p-5">

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {chart.title}
                        </p>
                        {chart.subtitle &&
                    <p className="text-xs text-gray-500 mt-1">
                            {chart.subtitle}
                          </p>
                    }
                      </div>
                      {chart.type === 'donut' ?
                  <PieChartIcon className="w-5 h-5 text-gray-400" /> :

                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  }
                    </div>

                    <div className="mt-4">
                      {chart.type === 'bar' && chart.bars ?
                  <MiniBarChart bars={chart.bars} /> :
                  chart.type === 'donut' && chart.donut ?
                  <DonutChart data={chart.donut} /> :
                  null}
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* Recommended actions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase">
                Recommended Actions
              </h3>
            </div>
            <div className="space-y-2">
              {data.recommendedActions.map((a) =>
              <button
                key={a.label}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">

                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {a.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>);

}
export function ScholarshipSummaryDashboard() {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  // metric detail modal
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [metricModalData, setMetricModalData] = useState<InfoPanelData | null>(
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
  const openMetricModal = (id: string) => {
    const d = infoData[id];
    if (!d) return;
    setMetricModalData(d);
    setMetricModalOpen(true);
  };
  const stats = [
  {
    id: 'totalScholarships',
    title: 'Total Scholarships (Sanctioned)',
    value: '₹45.2 L',
    change: '+15%',
    icon: Award,
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-600'
  },
  {
    id: 'beneficiaries',
    title: 'Beneficiaries',
    value: '234',
    change: '+12%',
    icon: Users,
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-600'
  },
  {
    id: 'disbursed',
    title: 'Disbursed',
    value: '₹38.5 L',
    change: '+18%',
    icon: CheckCircle,
    accentBg: 'bg-green-50',
    accentText: 'text-green-600'
  },
  {
    id: 'pending',
    title: 'Pending Disbursement',
    value: '₹6.7 L',
    change: '-5%',
    icon: Clock,
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-600'
  },
  // Added KPIs
  {
    id: 'applicationStatus',
    title: 'Applications Received',
    value: '278',
    change: '+9%',
    icon: FileText,
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-600'
  },
  {
    id: 'schemeDistribution',
    title: 'Active Schemes',
    value: '12',
    change: '+2',
    icon: Target,
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-600'
  },
  {
    id: 'recentApplications',
    title: 'Avg. Approval Time',
    value: '4.2 days',
    change: '-0.8',
    icon: TrendingUp,
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600'
  },
  {
    id: 'pending',
    title: 'Backlog (Pending + Review)',
    value: '68',
    change: '-6%',
    icon: AlertCircle,
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-600'
  }];

  const schemeDistribution = [
  {
    scheme: 'Merit Scholarship',
    count: 85,
    amount: '₹21.2 L',
    color: 'bg-purple-500'
  },
  {
    scheme: 'Need-based Aid',
    count: 62,
    amount: '₹9.3 L',
    color: 'bg-blue-500'
  },
  {
    scheme: 'Sports Scholarship',
    count: 45,
    amount: '₹9.0 L',
    color: 'bg-green-500'
  },
  {
    scheme: 'Government Schemes',
    count: 42,
    amount: '₹5.7 L',
    color: 'bg-orange-500'
  }];

  const applicationStatus = [
  {
    label: 'Approved',
    value: 156,
    icon: CheckCircle,
    bg: 'bg-green-50',
    text: 'text-green-700',
    sub: 'Approved'
  },
  {
    label: 'Pending',
    value: 45,
    icon: Clock,
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    sub: 'Pending'
  },
  {
    label: 'Under Review',
    value: 23,
    icon: FileText,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    sub: 'Under Review'
  },
  {
    label: 'Rejected',
    value: 10,
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    sub: 'Rejected'
  }];

  const recentApplications = [
  {
    id: '1',
    student: 'Aarav Sharma',
    class: '10-A',
    scheme: 'Merit Scholarship',
    amount: 25000,
    status: 'Approved'
  },
  {
    id: '2',
    student: 'Priya Patel',
    class: '9-B',
    scheme: 'Need-based Aid',
    amount: 15000,
    status: 'Pending'
  },
  {
    id: '3',
    student: 'Rohan Kumar',
    class: '11-A',
    scheme: 'Sports Scholarship',
    amount: 20000,
    status: 'Approved'
  },
  {
    id: '4',
    student: 'Ananya Singh',
    class: '8-A',
    scheme: 'Merit Scholarship',
    amount: 25000,
    status: 'Under Review'
  }];

  // Added panels: Monthly disbursement + Category/segment split
  const monthlyDisbursement = [
  {
    month: 'Oct',
    amount: 5.8
  },
  {
    month: 'Nov',
    amount: 6.4
  },
  {
    month: 'Dec',
    amount: 4.9
  },
  {
    month: 'Jan',
    amount: 7.1
  },
  {
    month: 'Feb',
    amount: 6.8
  },
  {
    month: 'Mar',
    amount: 7.5
  }];

  const maxMonth = Math.max(...monthlyDisbursement.map((m) => m.amount));
  const segmentSplit = [
  {
    label: 'EWS',
    value: 34,
    color: 'bg-blue-500'
  },
  {
    label: 'SC',
    value: 18,
    color: 'bg-purple-500'
  },
  {
    label: 'ST',
    value: 9,
    color: 'bg-green-500'
  },
  {
    label: 'OBC',
    value: 21,
    color: 'bg-orange-500'
  },
  {
    label: 'General',
    value: 18,
    color: 'bg-gray-500'
  }];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <MetricDetailModal
        isOpen={metricModalOpen}
        onClose={() => setMetricModalOpen(false)}
        data={metricModalData} />


      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarship Summary Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of scholarships, applications, and disbursements
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
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
            className="w-44"
            options={[
            {
              value: '2024-2025',
              label: '2024-2025'
            },
            {
              value: '2023-2024',
              label: '2023-2024'
            }]
            }
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)} />

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

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) =>
        <Card
          key={stat.title}
          className="p-6 bg-white border border-gray-200">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <InfoButton onClick={() => openMetricModal(stat.id)} />
                <div className={`p-3 rounded-lg ${stat.accentBg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.accentText}`} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">{stat.change}</span>
              <span className="text-gray-500 ml-2">vs last year</span>
            </div>
          </Card>
        )}
      </div>

      {/* Panels row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme-wise Distribution */}
        <Card className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-semibold">
                Scheme-wise Distribution
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Scholarship mix by scheme
              </p>
            </div>
            <InfoButton onClick={() => openMetricModal('schemeDistribution')} />
          </div>
          <div className="p-4 space-y-4">
            {schemeDistribution.map((item) =>
            <div
              key={item.scheme}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">

                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.scheme}</p>
                  <p className="text-sm text-gray-500">{item.count} students</p>
                </div>
                <span className="font-semibold text-gray-900">
                  {item.amount}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Application Status */}
        <Card className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-semibold">Application Status</p>
              <p className="text-xs text-gray-500 mt-0.5">Workflow overview</p>
            </div>
            <InfoButton onClick={() => openMetricModal('applicationStatus')} />
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {applicationStatus.map((s) =>
            <div
              key={s.label}
              className={`p-4 ${s.bg} rounded-lg text-center`}>

                <s.icon className={`w-8 h-8 ${s.text} mx-auto mb-2`} />
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                <p className={`text-sm ${s.text}`}>{s.sub}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Panels row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Disbursement Trend */}
        <Card className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-semibold">
                Monthly Disbursement Trend
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Last 6 months (₹ in Lakhs)
              </p>
            </div>
            <InfoButton onClick={() => openMetricModal('disbursed')} />
          </div>
          <div className="p-6">
            <div className="h-40 flex items-end gap-3">
              {monthlyDisbursement.map((m) =>
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-2">

                  <div className="w-full bg-gray-100 rounded-lg overflow-hidden h-28 flex items-end">
                    <div
                    className="bg-blue-600 w-full"
                    style={{
                      height: `${m.amount / maxMonth * 100}%`
                    }}
                    title={`₹${m.amount} L`} />

                  </div>
                  <div className="text-xs text-gray-500">{m.month}</div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Beneficiary Segment Split */}
        <Card className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-semibold">
                Beneficiary Segment Split
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Category distribution (sample)
              </p>
            </div>
            <InfoButton onClick={() => openMetricModal('beneficiaries')} />
          </div>
          <div className="p-6 space-y-4">
            {segmentSplit.map((s) =>
            <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{s.label}</span>
                  <span className="text-gray-900 font-medium">{s.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                  className={`h-full ${s.color}`}
                  style={{
                    width: `${s.value}%`
                  }} />

                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-semibold">Recent Applications</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest updates and approvals
            </p>
          </div>
          <InfoButton onClick={() => openMetricModal('recentApplications')} />
        </div>

        <div className="divide-y divide-gray-100">
          {recentApplications.map((app) =>
          <div
            key={app.id}
            className="py-4 px-4 flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                  {app.student.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{app.student}</p>
                  <p className="text-sm text-gray-500">
                    {app.class} • {app.scheme}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    ₹{app.amount.toLocaleString()}
                  </p>
                </div>
                <Badge variant={getStatusVariant(app.status)}>
                  {app.status}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <Button variant="outline" className="w-full">
            View All Applications <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>);

}