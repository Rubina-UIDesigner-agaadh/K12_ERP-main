import React, { useMemo, useState, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  RefreshCw,
  Download,
  Calendar,
  Search,
  Info,
  X,
  Database,
  Zap,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Target,
  FileText,
  FileSpreadsheet,
  Wallet,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  ChevronDown,
  Check } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
type TxnStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';
type RangePreset = 'today' | 'week' | 'month';
type InfoChart =
{
  type: 'bar';
  title: string;
  subtitle?: string;
  bars: {
    label: string;
    value: number;
    colorClass: string;
  }[];
} |
{
  type: 'donut';
  title: string;
  subtitle?: string;
  donut: {
    label: string;
    value: number;
    colorClass: string;
  }[];
};
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
  miniCharts?: InfoChart[];
}
interface TransactionRow {
  id: string;
  txnId: string;
  date: string;
  student: string;
  amount: number;
  gateway: string;
  status: TxnStatus;
  settlementStatus: 'Unsettled' | 'Settled' | 'In Progress';
  failureReason?: string;
}
interface GatewaySummaryRow {
  gateway: string;
  colorClass: string;
  gross: number;
  success: number;
  pending: number;
  failed: number;
  refunded: number;
  successRate: number;
  avgTxn: number;
  mdrPct: number;
}
// -------- Helpers --------
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)} K`;
  return `₹${amount.toLocaleString('en-IN')}`;
};
function TrendIndicator({ value }: {value: number;}) {
  if (Math.abs(value) < 0.5) {
    return (
      <span className="flex items-center text-gray-500 text-xs">
        <Minus className="w-3 h-3 mr-1" />
        {Math.abs(value).toFixed(1)}%
      </span>);

  }
  if (value > 0) {
    return (
      <span className="flex items-center text-green-600 text-xs">
        <ArrowUpRight className="w-3 h-3 mr-1" />+{value.toFixed(1)}%
      </span>);

  }
  return (
    <span className="flex items-center text-red-600 text-xs">
      <ArrowDownRight className="w-3 h-3 mr-1" />
      {value.toFixed(1)}%
    </span>);

}
function getStatusVariant(status: TxnStatus) {
  switch (status) {
    case 'Success':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Failed':
      return 'danger';
    case 'Refunded':
      return 'info';
    default:
      return 'secondary';
  }
}
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
function DonutChart({
  data






}: {data: {label: string;value: number;colorClass: string;}[];}) {
  const total = data.reduce((s, x) => s + x.value, 0);
  const colorMap: Record<string, string> = {
    purple: '#A855F7',
    blue: '#3B82F6',
    green: '#22C55E',
    orange: '#F97316',
    yellow: '#EAB308',
    red: '#EF4444',
    gray: '#6B7280',
    pink: '#EC4899',
    indigo: '#6366F1',
    cyan: '#06B6D4'
  };
  let start = 0;
  const segments = data.map((d) => {
    const end = start + d.value / total * 360;
    const base = d.colorClass.
    replace('bg-', '').
    replace('-500', '').
    replace('-600', '');
    const color = colorMap[base] || '#3B82F6';
    const seg = {
      start,
      end,
      color
    };
    start = end;
    return seg;
  });
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
            className="p-2 hover:bg-gray-100 rounded-full">

            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Highlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {data.miniCharts.map((c) =>
              <div
                key={c.title}
                className="border border-gray-100 rounded-xl p-5">

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {c.title}
                        </p>
                        {c.subtitle &&
                    <p className="text-xs text-gray-500 mt-1">
                            {c.subtitle}
                          </p>
                    }
                      </div>
                      {c.type === 'donut' ?
                  <PieChart className="w-5 h-5 text-gray-400" /> :

                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  }
                    </div>

                    <div className="mt-4">
                      {c.type === 'bar' ?
                  <MiniBarChart bars={c.bars} /> :

                  <DonutChart data={c.donut} />
                  }
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
// -------- Main Component --------
export function OnlinePaymentDashboard() {
  const [rangePreset, setRangePreset] = useState<RangePreset>('today');
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
  // info modal
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoData, setInfoData] = useState<InfoPanelData | null>(null);
  const openInfo = (data: InfoPanelData) => {
    setInfoData(data);
    setInfoOpen(true);
  };
  // mock transactions
  const recentTransactions: TransactionRow[] = [
  {
    id: '1',
    txnId: 'TXN_123456',
    date: '2024-03-15 10:30 AM',
    student: 'Rahul Sharma (10-A)',
    amount: 25000,
    gateway: 'Razorpay',
    status: 'Success',
    settlementStatus: 'In Progress'
  },
  {
    id: '2',
    txnId: 'TXN_123457',
    date: '2024-03-15 11:15 AM',
    student: 'Priya Patel (9-B)',
    amount: 5000,
    gateway: 'PayU',
    status: 'Pending',
    settlementStatus: 'Unsettled'
  },
  {
    id: '3',
    txnId: 'TXN_123458',
    date: '2024-03-14 04:45 PM',
    student: 'Amit Kumar (8-C)',
    amount: 12000,
    gateway: 'Razorpay',
    status: 'Failed',
    settlementStatus: 'Unsettled',
    failureReason: 'Bank declined / insufficient funds'
  },
  {
    id: '4',
    txnId: 'TXN_123459',
    date: '2024-03-14 05:20 PM',
    student: 'Sana Khan (7-A)',
    amount: 8000,
    gateway: 'PayU',
    status: 'Success',
    settlementStatus: 'Settled'
  },
  {
    id: '5',
    txnId: 'TXN_123460',
    date: '2024-03-14 06:05 PM',
    student: 'Neha Joshi (12-B)',
    amount: 18000,
    gateway: 'Razorpay',
    status: 'Refunded',
    settlementStatus: 'Settled'
  }];

  // gateway summary (mock)
  const gatewaySummary: GatewaySummaryRow[] = [
  {
    gateway: 'Razorpay',
    colorClass: 'bg-blue-500',
    gross: 85000,
    success: 95,
    pending: 2,
    failed: 3,
    refunded: 1,
    successRate: 95.0,
    avgTxn: 11800,
    mdrPct: 2.0
  },
  {
    gateway: 'PayU',
    colorClass: 'bg-green-500',
    gross: 40000,
    success: 89,
    pending: 6,
    failed: 5,
    refunded: 0,
    successRate: 89.0,
    avgTxn: 9200,
    mdrPct: 1.8
  }];

  // KPIs (mock)
  const kpis = useMemo(() => {
    const totalAmount = recentTransactions.reduce((s, t) => s + t.amount, 0);
    const successCount = recentTransactions.filter(
      (t) => t.status === 'Success'
    ).length;
    const pendingCount = recentTransactions.filter(
      (t) => t.status === 'Pending'
    ).length;
    const failedCount = recentTransactions.filter(
      (t) => t.status === 'Failed'
    ).length;
    const refundedCount = recentTransactions.filter(
      (t) => t.status === 'Refunded'
    ).length;
    const totalCount = recentTransactions.length;
    const successRate = totalCount ? successCount / totalCount * 100 : 0;
    const avgTxn = totalCount ? totalAmount / totalCount : 0;
    // settlement view
    const unsettled = recentTransactions.filter(
      (t) => t.settlementStatus !== 'Settled'
    ).length;
    const unsettledAmount = recentTransactions.
    filter((t) => t.settlementStatus !== 'Settled' && t.status === 'Success').
    reduce((s, t) => s + t.amount, 0);
    return {
      totalAmount,
      totalCount,
      successCount,
      pendingCount,
      failedCount,
      refundedCount,
      successRate,
      avgTxn,
      unsettled,
      unsettledAmount
    };
  }, [recentTransactions]);
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return recentTransactions;
    const q = searchTerm.trim().toLowerCase();
    return recentTransactions.filter((t) => {
      const hay =
      `${t.txnId} ${t.student} ${t.gateway} ${t.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [recentTransactions, searchTerm]);
  const columns = [
  {
    key: 'txnId',
    header: 'Transaction ID',
    render: (row: TransactionRow) =>
    <span className="font-mono text-xs text-gray-700">{row.txnId}</span>

  },
  {
    key: 'date',
    header: 'Date & Time',
    render: (row: TransactionRow) =>
    <span className="text-sm text-gray-600">{row.date}</span>

  },
  {
    key: 'student',
    header: 'Student',
    render: (row: TransactionRow) =>
    <span className="font-medium text-gray-900">{row.student}</span>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: TransactionRow) =>
    <span className="font-semibold text-gray-900">
          {formatINR(row.amount)}
        </span>

  },
  {
    key: 'gateway',
    header: 'Gateway',
    render: (row: TransactionRow) =>
    <Badge variant="outline">{row.gateway}</Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: TransactionRow) =>
    <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>

  },
  {
    key: 'settlement',
    header: 'Settlement',
    render: (row: TransactionRow) =>
    <Badge
      variant={
      row.settlementStatus === 'Settled' ?
      'success' :
      row.settlementStatus === 'In Progress' ?
      'warning' :
      'secondary'
      }>

          {row.settlementStatus}
        </Badge>

  }];

  // info data map
  const infoMap: Record<string, InfoPanelData> = {
    totalTransactions: {
      id: 'totalTransactions',
      title: 'Total Online Collection',
      description:
      'Total online amount received from parents via payment gateways for the selected period. This is the gross transaction amount before any refunds/charge deductions.',
      dataSource: {
        title: 'Data Source',
        description:
        'Aggregated from payment gateway transaction logs and fee receipt records.',
        tables: ['payment_transactions', 'fee_receipts', 'gateway_webhooks']
      },
      whyItMatters: {
        title: 'Why It Matters',
        description:
        'Helps track digital collection volume and understand daily online collection trends.',
        benefits: [
        'Collection monitoring',
        'Trend analysis',
        'Reconciliation starting point']

      },
      recommendedActions: [
      {
        label: 'Export Transactions',
        description: 'Download list of transactions for audit/reconciliation'
      },
      {
        label: 'Gateway Split',
        description: 'Analyze collections by gateway'
      },
      {
        label: 'Compare Periods',
        description: 'Compare with previous day/week/month'
      }],

      miniCharts: [
      {
        type: 'bar',
        title: 'Amount Trend (Sample)',
        subtitle: 'Index view',
        bars: [
        {
          label: 'D-4',
          value: 60,
          colorClass: 'bg-blue-600'
        },
        {
          label: 'D-3',
          value: 72,
          colorClass: 'bg-blue-600'
        },
        {
          label: 'D-2',
          value: 66,
          colorClass: 'bg-blue-600'
        },
        {
          label: 'D-1',
          value: 78,
          colorClass: 'bg-blue-600'
        }]

      },
      {
        type: 'donut',
        title: 'Gateway Share (Sample)',
        subtitle: 'By amount',
        donut: [
        {
          label: 'Razorpay',
          value: 68,
          colorClass: 'bg-blue-500'
        },
        {
          label: 'PayU',
          value: 32,
          colorClass: 'bg-green-500'
        }]

      }]

    },
    successRate: {
      id: 'successRate',
      title: 'Success Rate',
      description:
      'Percentage of successful transactions out of the total attempted online transactions for the selected period.',
      dataSource: {
        title: 'Data Source',
        description:
        'Calculated from transaction status updates received from gateway webhooks and polling.',
        tables: ['payment_transactions', 'txn_status_log', 'gateway_webhooks']
      },
      whyItMatters: {
        title: 'Why It Matters',
        description:
        'Low success rate indicates payment friction. Improving it reduces support queries and increases collection conversion.',
        benefits: [
        'Better parent experience',
        'Lower failure retries',
        'Higher conversion']

      },
      recommendedActions: [
      {
        label: 'Failure Reasons',
        description: 'Review failure reason distribution'
      },
      {
        label: 'Gateway Health Check',
        description: 'Monitor downtime/timeouts'
      },
      {
        label: 'Retry Guidance',
        description: 'Improve retry messages and flows'
      }],

      miniCharts: [
      {
        type: 'bar',
        title: 'Success vs Failed (Sample)',
        bars: [
        {
          label: 'Success',
          value: 92,
          colorClass: 'bg-green-600'
        },
        {
          label: 'Failed',
          value: 8,
          colorClass: 'bg-red-500'
        }]

      }]

    },
    pending: {
      id: 'pending',
      title: 'Pending Transactions',
      description:
      'Transactions initiated but not yet confirmed as success/failure. Pending may occur due to delayed gateway callbacks or bank processing.',
      dataSource: {
        title: 'Data Source',
        description:
        'Pending records are maintained from transaction initiation until webhook/confirmation updates status.',
        tables: ['payment_transactions', 'gateway_webhooks']
      },
      whyItMatters: {
        title: 'Why It Matters',
        description:
        'Pending transactions require monitoring to ensure they settle correctly and receipts reflect true payment status.',
        benefits: [
        'Prevents receipt mismatch',
        'Improves reconciliation',
        'Reduces disputes']

      },
      recommendedActions: [
      {
        label: 'Sync Status Now',
        description: 'Trigger a status sync to refresh pending statuses'
      },
      {
        label: 'Pending Aging Report',
        description: 'Find transactions pending too long'
      },
      {
        label: 'Manual Verification',
        description: 'Verify with gateway dashboard if needed'
      }]

    },
    failed: {
      id: 'failed',
      title: 'Failed Transactions',
      description:
      'Transactions that failed due to bank decline, timeout, wrong credentials, or insufficient balance. These do not generate valid receipts.',
      dataSource: {
        title: 'Data Source',
        description:
        'Derived from gateway failure callbacks and status polling.',
        tables: ['payment_transactions', 'txn_status_log']
      },
      whyItMatters: {
        title: 'Why It Matters',
        description:
        'High failures reduce collection efficiency. Failure reasons guide operational and gateway improvements.',
        benefits: [
        'Reduce retries',
        'Improve gateway selection',
        'Lower support load']

      },
      recommendedActions: [
      {
        label: 'Failure Reason Report',
        description: 'Identify top failure causes and banks'
      },
      {
        label: 'Retry Assistance',
        description: 'Share retry guidance with parents'
      },
      {
        label: 'Gateway Switch',
        description: 'Route to more reliable gateway during issues'
      }],

      miniCharts: [
      {
        type: 'donut',
        title: 'Failure Reasons (Sample)',
        donut: [
        {
          label: 'Bank decline',
          value: 46,
          colorClass: 'bg-red-500'
        },
        {
          label: 'Timeout',
          value: 28,
          colorClass: 'bg-orange-500'
        },
        {
          label: 'Cancelled',
          value: 18,
          colorClass: 'bg-gray-500'
        },
        {
          label: 'Other',
          value: 8,
          colorClass: 'bg-blue-500'
        }]

      }]

    },
    settlement: {
      id: 'settlement',
      title: 'Settlement Tracking',
      description:
      'Settlement status indicates whether successful payments have been settled into the school bank account by the gateway (T+1/T+2).',
      dataSource: {
        title: 'Data Source',
        description:
        'Pulled from gateway settlement reports and bank statement reconciliation status.',
        tables: [
        'gateway_settlements',
        'bank_statement_import',
        'reconciliation_log']

      },
      whyItMatters: {
        title: 'Why It Matters',
        description:
        'Ensures that online collections actually reach your bank account and identifies missing settlements.',
        benefits: [
        'Bank reconciliation',
        'Cash flow accuracy',
        'Detect missing settlements']

      },
      recommendedActions: [
      {
        label: 'Download Settlement Report',
        description: 'Export settlement report for the period'
      },
      {
        label: 'Reconcile with Bank',
        description: 'Match settlement credits with bank statement'
      },
      {
        label: 'Escalate Missing Settlement',
        description: 'Raise ticket with gateway'
      }]

    },
    gatewaySummary: {
      id: 'gatewaySummary',
      title: 'Gateway Summary',
      description:
      'Shows collections and performance split by payment gateway including gross amount, success rate, and average transaction value.',
      dataSource: {
        title: 'Data Source',
        description: 'Aggregated from transactions table grouped by gateway.',
        tables: ['payment_transactions', 'gateway_master']
      },
      whyItMatters: {
        title: 'Why It Matters',
        description:
        'Helps choose the best-performing gateway and detect a gateway with high failures or lower success rates.',
        benefits: [
        'Vendor performance benchmarking',
        'Routing decisions',
        'Operational monitoring']

      },
      recommendedActions: [
      {
        label: 'Gateway-wise Report',
        description: 'Detailed gateway report with statuses'
      },
      {
        label: 'Compare Success Rate',
        description: 'Identify gateway reliability'
      },
      {
        label: 'MDR Analysis',
        description: 'Check cost impact per gateway'
      }],

      miniCharts: [
      {
        type: 'bar',
        title: 'Gateway Gross (Sample)',
        bars: [
        {
          label: 'Razorpay',
          value: 68,
          colorClass: 'bg-blue-600'
        },
        {
          label: 'PayU',
          value: 32,
          colorClass: 'bg-green-600'
        }]

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

  const statCards = [
  {
    id: 'totalTransactions',
    title: 'Total Online Collection',
    value: formatCurrencyCompact(kpis.totalAmount),
    sub: `${kpis.totalCount} transactions`,
    icon: Wallet,
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-600',
    trend: +12
  },
  {
    id: 'successRate',
    title: 'Successful',
    value: `${kpis.successCount}`,
    sub: `${kpis.successRate.toFixed(1)}% success rate`,
    icon: CheckCircle,
    accentBg: 'bg-green-50',
    accentText: 'text-green-600',
    trend: +4
  },
  {
    id: 'pending',
    title: 'Pending',
    value: `${kpis.pendingCount}`,
    sub: 'Awaiting confirmation',
    icon: Clock,
    accentBg: 'bg-yellow-50',
    accentText: 'text-yellow-600',
    trend: -1
  },
  {
    id: 'failed',
    title: 'Failed',
    value: `${kpis.failedCount}`,
    sub: 'Action required',
    icon: XCircle,
    accentBg: 'bg-red-50',
    accentText: 'text-red-600',
    trend: +0.8
  },
  {
    id: 'settlement',
    title: 'Unsettled (Count)',
    value: `${kpis.unsettled}`,
    sub: `Unsettled amount: ${formatCurrencyCompact(kpis.unsettledAmount)}`,
    icon: AlertCircle,
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-600',
    trend: -2
  },
  {
    id: 'totalTransactions',
    title: 'Avg. Transaction Value',
    value: formatCurrencyCompact(kpis.avgTxn),
    sub: 'Gross / total',
    icon: TrendingUp,
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-600',
    trend: +1.2
  },
  {
    id: 'failed',
    title: 'Refunded',
    value: `${kpis.refundedCount}`,
    sub: 'Refunded transactions',
    icon: FileText,
    accentBg: 'bg-cyan-50',
    accentText: 'text-cyan-600',
    trend: +0.2
  },
  {
    id: 'gatewaySummary',
    title: 'Active Gateways',
    value: `${gatewaySummary.length}`,
    sub: 'Configured gateways',
    icon: CreditCard,
    accentBg: 'bg-gray-50',
    accentText: 'text-gray-600',
    trend: 0
  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <MetricDetailModal
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
        data={infoData} />


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Online Payment Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of online transactions, statuses, and settlements
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => {
              setIsSyncing(true);
              setTimeout(() => setIsSyncing(false), 900);
            }}
            disabled={isSyncing}>

            <RefreshCw
              className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />

            Sync Status
          </Button>

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
              value: 'today',
              label: 'Today'
            },
            {
              value: 'week',
              label: 'This Week'
            },
            {
              value: 'month',
              label: 'This Month'
            }]
            }
            value={rangePreset}
            onChange={(e) => setRangePreset(e.target.value as RangePreset)} />


          <Button variant="outline" onClick={() => alert('Export (mock)')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ReportFilters />

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((k) =>
        <Card key={k.title} className="p-5 bg-white border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{k.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {k.value}
                </p>
                <p className="text-xs text-gray-500 mt-2">{k.sub}</p>
                <div className="mt-3">
                  <TrendIndicator value={k.trend} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <InfoButton onClick={() => openInfo(infoMap[k.id])} />
                <div className={`p-3 rounded-lg ${k.accentBg}`}>
                  <k.icon className={`w-6 h-6 ${k.accentText}`} />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Row: Recent Transactions + Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden bg-white border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  Recent Transactions
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest online payment attempts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <InfoButton
                  onClick={() => openInfo(infoMap.totalTransactions)} />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert('View all (mock)')}>

                  View All
                </Button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  placeholder="Search txn id / student / gateway / status..."
                  value={searchTerm}
                  onChange={(e) =>
                  setSearchTerm((e.target as HTMLInputElement).value)
                  } />

              </div>
            </div>

            <Table
              columns={columns as any}
              data={filteredTransactions as any} />


            {/* small note */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              Pending/Failed statuses may change after Sync Status due to
              gateway callbacks.
            </div>
          </Card>
        </div>

        {/* Right Panels */}
        <div className="space-y-6">
          {/* Gateway Summary */}
          <Card className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Gateway Summary</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Amount and reliability
                </p>
              </div>
              <InfoButton onClick={() => openInfo(infoMap.gatewaySummary)} />
            </div>

            <div className="p-4 space-y-4">
              {gatewaySummary.map((g) =>
              <div key={g.gateway} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                      className={`w-2.5 h-2.5 rounded-full ${g.colorClass}`} />

                      <div>
                        <p className="font-medium text-gray-800">{g.gateway}</p>
                        <p className="text-xs text-gray-500">
                          {g.successRate.toFixed(1)}% success • Avg{' '}
                          {formatCurrencyCompact(g.avgTxn)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrencyCompact(g.gross)}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-white rounded border border-gray-200 p-2">
                      <p className="text-gray-500">Success</p>
                      <p className="font-semibold text-gray-900">{g.success}</p>
                    </div>
                    <div className="bg-white rounded border border-gray-200 p-2">
                      <p className="text-gray-500">Pending</p>
                      <p className="font-semibold text-gray-900">{g.pending}</p>
                    </div>
                    <div className="bg-white rounded border border-gray-200 p-2">
                      <p className="text-gray-500">Failed</p>
                      <p className="font-semibold text-gray-900">{g.failed}</p>
                    </div>
                    <div className="bg-white rounded border border-gray-200 p-2">
                      <p className="text-gray-500">Refunded</p>
                      <p className="font-semibold text-gray-900">
                        {g.refunded}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Settlement & Quick Actions */}
          <Card className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  Settlement & Actions
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reconcile and export
                </p>
              </div>
              <InfoButton onClick={() => openInfo(infoMap.settlement)} />
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Unsettled amount
                </p>
                <p className="text-lg font-semibold text-blue-700 mt-1">
                  {formatCurrencyCompact(kpis.unsettledAmount)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Count: {kpis.unsettled} successful txn(s) not yet settled
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => alert('Settlement report (mock)')}>

                <Download className="w-4 h-4 mr-2" />
                Download Settlement Report
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => alert('Reconcile (mock)')}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Reconcile Failed / Pending
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => alert('Export to Excel (mock)')}>

                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Transactions (Excel)
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => alert('Export to PDF (mock)')}>

                <FileText className="w-4 h-4 mr-2" />
                Export Summary (PDF)
              </Button>
            </div>
          </Card>

          {/* Simple Trend Panel */}
          <Card className="bg-white border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  Status Mix (Sample)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Distribution of txn statuses
                </p>
              </div>
              <InfoButton onClick={() => openInfo(infoMap.successRate)} />
            </div>

            <div className="p-4">
              <DonutChart
                data={[
                {
                  label: 'Success',
                  value: Math.round(kpis.successRate),
                  colorClass: 'bg-green-500'
                },
                {
                  label: 'Pending',
                  value: Math.round(
                    kpis.pendingCount / kpis.totalCount * 100
                  ),
                  colorClass: 'bg-yellow-500'
                },
                {
                  label: 'Failed',
                  value: Math.round(
                    kpis.failedCount / kpis.totalCount * 100
                  ),
                  colorClass: 'bg-red-500'
                },
                {
                  label: 'Refunded',
                  value: Math.round(
                    kpis.refundedCount / kpis.totalCount * 100
                  ),
                  colorClass: 'bg-blue-500'
                }]
                } />

            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-2">
        <Info className="w-4 h-4" />
        Tip: Use "Sync Status" to refresh pending transactions based on latest
        gateway updates.
      </div>
    </div>);

}