import React, { useMemo, useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  IndianRupee,
  CreditCard,
  Percent,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  DollarSign,
  Minus,
  Filter,
  Eye,
  EyeOff,
  Layers,
  Table,
  LineChart,
  Info,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  Building,
  Wallet,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
type ViewPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
type ChartType = 'bar' | 'line' | 'stacked';
type MetricType = 'gross' | 'net' | 'mdr' | 'transactions';
interface GatewayData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  mdrPercentage: number;
  gstOnMdr: number;
  isActive: boolean;
}
interface DailyData {
  date: string;
  displayDate: string;
  gateways: {
    [gatewayId: string]: {
      grossAmount: number;
      mdrCharges: number;
      gstOnMdr: number;
      netAmount: number;
      transactionCount: number;
      successCount: number;
      failedCount: number;
    };
  };
  totals: {
    grossAmount: number;
    mdrCharges: number;
    gstOnMdr: number;
    netAmount: number;
    transactionCount: number;
  };
}
interface GatewaySummary {
  gatewayId: string;
  gatewayName: string;
  color: string;
  totalGross: number;
  totalMdr: number;
  totalGst: number;
  totalNet: number;
  totalTransactions: number;
  successRate: number;
  avgTransactionValue: number;
  mdrPercentage: number;
  marketShare: number;
  trend: number;
}
export function GatewayWiseCollectionSummary() {
  // State
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('daily');
  const [dateFrom, setDateFrom] = useState('2024-03-01');
  const [dateTo, setDateTo] = useState('2024-03-15');
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('gross');
  const [showMdrBreakdown, setShowMdrBreakdown] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [highlightedGateway, setHighlightedGateway] = useState<string | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);
  const [showPercentages, setShowPercentages] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  // Gateway definitions
  const gateways: GatewayData[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    shortName: 'RPay',
    color: '#3B82F6',
    mdrPercentage: 2.0,
    gstOnMdr: 18,
    isActive: true
  },
  {
    id: 'payu',
    name: 'PayU',
    shortName: 'PayU',
    color: '#10B981',
    mdrPercentage: 1.8,
    gstOnMdr: 18,
    isActive: true
  },
  {
    id: 'paytm',
    name: 'Paytm PG',
    shortName: 'Paytm',
    color: '#F59E0B',
    mdrPercentage: 1.75,
    gstOnMdr: 18,
    isActive: true
  },
  {
    id: 'hdfc',
    name: 'HDFC Payment Gateway',
    shortName: 'HDFC',
    color: '#8B5CF6',
    mdrPercentage: 2.25,
    gstOnMdr: 18,
    isActive: true
  },
  {
    id: 'ccavenue',
    name: 'CCAvenue',
    shortName: 'CCAve',
    color: '#EC4899',
    mdrPercentage: 2.5,
    gstOnMdr: 18,
    isActive: false
  }];

  // Mock daily data
  const generateDailyData = (): DailyData[] => {
    const data: DailyData[] = [];
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-15');
    for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1))
    {
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      });
      const gatewayData: DailyData['gateways'] = {};
      let dayTotals = {
        grossAmount: 0,
        mdrCharges: 0,
        gstOnMdr: 0,
        netAmount: 0,
        transactionCount: 0
      };
      gateways.
      filter((g) => g.isActive).
      forEach((gateway) => {
        const baseAmount = Math.floor(Math.random() * 100000) + 50000;
        const txnCount = Math.floor(Math.random() * 30) + 10;
        const successCount = Math.floor(
          txnCount * (0.9 + Math.random() * 0.08)
        );
        const failedCount = txnCount - successCount;
        const mdr = Math.round(baseAmount * (gateway.mdrPercentage / 100));
        const gst = Math.round(mdr * (gateway.gstOnMdr / 100));
        const net = baseAmount - mdr - gst;
        gatewayData[gateway.id] = {
          grossAmount: baseAmount,
          mdrCharges: mdr,
          gstOnMdr: gst,
          netAmount: net,
          transactionCount: txnCount,
          successCount,
          failedCount
        };
        dayTotals.grossAmount += baseAmount;
        dayTotals.mdrCharges += mdr;
        dayTotals.gstOnMdr += gst;
        dayTotals.netAmount += net;
        dayTotals.transactionCount += txnCount;
      });
      data.push({
        date: dateStr,
        displayDate,
        gateways: gatewayData,
        totals: dayTotals
      });
    }
    return data;
  };
  const dailyData = useMemo(() => generateDailyData(), []);
  // Calculate gateway summaries
  const gatewaySummaries = useMemo((): GatewaySummary[] => {
    const activeGateways = gateways.filter((g) => g.isActive);
    const totalGrossAll = dailyData.reduce(
      (sum, d) => sum + d.totals.grossAmount,
      0
    );
    return activeGateways.map((gateway) => {
      let totalGross = 0;
      let totalMdr = 0;
      let totalGst = 0;
      let totalNet = 0;
      let totalTxns = 0;
      let totalSuccess = 0;
      dailyData.forEach((day) => {
        const gData = day.gateways[gateway.id];
        if (gData) {
          totalGross += gData.grossAmount;
          totalMdr += gData.mdrCharges;
          totalGst += gData.gstOnMdr;
          totalNet += gData.netAmount;
          totalTxns += gData.transactionCount;
          totalSuccess += gData.successCount;
        }
      });
      // Calculate trend (comparing last 7 days vs previous 7 days)
      const midPoint = Math.floor(dailyData.length / 2);
      const firstHalf = dailyData.slice(0, midPoint);
      const secondHalf = dailyData.slice(midPoint);
      const firstHalfTotal = firstHalf.reduce(
        (sum, d) => sum + (d.gateways[gateway.id]?.grossAmount || 0),
        0
      );
      const secondHalfTotal = secondHalf.reduce(
        (sum, d) => sum + (d.gateways[gateway.id]?.grossAmount || 0),
        0
      );
      const trend =
      firstHalfTotal > 0 ?
      (secondHalfTotal - firstHalfTotal) / firstHalfTotal * 100 :
      0;
      return {
        gatewayId: gateway.id,
        gatewayName: gateway.name,
        color: gateway.color,
        totalGross,
        totalMdr,
        totalGst,
        totalNet,
        totalTransactions: totalTxns,
        successRate: totalTxns > 0 ? totalSuccess / totalTxns * 100 : 0,
        avgTransactionValue: totalTxns > 0 ? totalGross / totalTxns : 0,
        mdrPercentage: gateway.mdrPercentage,
        marketShare: totalGrossAll > 0 ? totalGross / totalGrossAll * 100 : 0,
        trend
      };
    });
  }, [dailyData, gateways]);
  // Overall totals
  const overallTotals = useMemo(() => {
    return {
      grossAmount: dailyData.reduce((sum, d) => sum + d.totals.grossAmount, 0),
      mdrCharges: dailyData.reduce((sum, d) => sum + d.totals.mdrCharges, 0),
      gstOnMdr: dailyData.reduce((sum, d) => sum + d.totals.gstOnMdr, 0),
      netAmount: dailyData.reduce((sum, d) => sum + d.totals.netAmount, 0),
      transactionCount: dailyData.reduce(
        (sum, d) => sum + d.totals.transactionCount,
        0
      )
    };
  }, [dailyData]);
  // Calculate effective MDR percentage
  const effectiveMdr = useMemo(() => {
    if (overallTotals.grossAmount === 0) return 0;
    return (
      (overallTotals.mdrCharges + overallTotals.gstOnMdr) /
      overallTotals.grossAmount *
      100);

  }, [overallTotals]);
  // Period options
  const periodOptions = [
  {
    value: 'daily',
    label: 'Daily'
  },
  {
    value: 'weekly',
    label: 'Weekly'
  },
  {
    value: 'monthly',
    label: 'Monthly'
  },
  {
    value: 'quarterly',
    label: 'Quarterly'
  },
  {
    value: 'yearly',
    label: 'Yearly'
  }];

  const metricOptions = [
  {
    value: 'gross',
    label: 'Gross Collection'
  },
  {
    value: 'net',
    label: 'Net Amount'
  },
  {
    value: 'mdr',
    label: 'MDR Charges'
  },
  {
    value: 'transactions',
    label: 'Transaction Count'
  }];

  const chartTypeOptions = [
  {
    value: 'bar',
    label: 'Bar Chart'
  },
  {
    value: 'stacked',
    label: 'Stacked Bar'
  },
  {
    value: 'line',
    label: 'Line Chart'
  }];

  // Get max value for chart scaling
  const getMaxValue = (metric: MetricType): number => {
    let maxVal = 0;
    dailyData.forEach((day) => {
      Object.values(day.gateways).forEach((g) => {
        let val = 0;
        switch (metric) {
          case 'gross':
            val = g.grossAmount;
            break;
          case 'net':
            val = g.netAmount;
            break;
          case 'mdr':
            val = g.mdrCharges + g.gstOnMdr;
            break;
          case 'transactions':
            val = g.transactionCount;
            break;
        }
        if (val > maxVal) maxVal = val;
      });
    });
    return maxVal;
  };
  // Get chart bar height
  const getBarHeight = (value: number, maxValue: number): number => {
    if (maxValue === 0) return 0;
    return value / maxValue * 150;
  };
  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)} K`;
    }
    return `₹${amount.toLocaleString()}`;
  };
  // Handle export
  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Exporting as ${format}`);
    }, 1500);
  };
  // Render trend indicator
  const TrendIndicator = ({ value }: {value: number;}) => {
    if (Math.abs(value) < 0.5) {
      return (
        <span className="flex items-center text-gray-500 text-sm">
          <Minus className="w-4 h-4 mr-1" />
          {Math.abs(value).toFixed(1)}%
        </span>);

    }
    if (value > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />+{value.toFixed(1)}%
        </span>);

    }
    return (
      <span className="flex items-center text-red-600 text-sm">
        <ArrowDownRight className="w-4 h-4 mr-1" />
        {value.toFixed(1)}%
      </span>);

  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gateway-wise Collection Summary
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive analysis of collections across payment gateways with
            MDR breakdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <div className="relative group">
            <Button variant="outline" disabled={isExporting}>
              {isExporting ?
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                Export as Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                <FileText className="w-4 h-4 text-red-600" />
                Export as PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                <FileText className="w-4 h-4 text-blue-600" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Select
              className="w-32"
              options={periodOptions}
              value={viewPeriod}
              onChange={(e) => setViewPeriod(e.target.value as ViewPeriod)} />

          </div>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-40" />

            <span className="text-gray-500">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-40" />

          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant={showMdrBreakdown ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowMdrBreakdown(!showMdrBreakdown)}>

              <Percent className="w-4 h-4 mr-1" />
              MDR Breakdown
            </Button>
            <Button
              variant={showPercentages ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowPercentages(!showPercentages)}>

              <PieChart className="w-4 h-4 mr-1" />
              Show %
            </Button>
            <Button
              variant={showChart ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowChart(!showChart)}>

              <BarChart3 className="w-4 h-4 mr-1" />
              Chart
            </Button>
          </div>
        </div>
      </Card>

      {/* Gateway Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gatewaySummaries.map((summary) =>
        <Card
          key={summary.gatewayId}
          className={`p-5 cursor-pointer transition-all hover:shadow-lg ${highlightedGateway === summary.gatewayId ? 'ring-2 ring-blue-500' : ''}`}
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: summary.color
          }}
          onClick={() =>
          setHighlightedGateway(
            highlightedGateway === summary.gatewayId ?
            null :
            summary.gatewayId
          )
          }>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {summary.gatewayName}
                </h3>
                <p className="text-xs text-gray-500">
                  MDR: {summary.mdrPercentage}% + GST
                </p>
              </div>
              <TrendIndicator value={summary.trend} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Gross Collection</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summary.totalGross)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">MDR + GST</p>
                  <p className="text-sm font-semibold text-red-600">
                    -{formatCurrency(summary.totalMdr + summary.totalGst)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Amount</p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(summary.totalNet)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {summary.totalTransactions} txns
                </span>
                <span className="text-gray-500">
                  Avg: {formatCurrency(summary.avgTransactionValue)}
                </span>
                <Badge
                variant={summary.successRate >= 95 ? 'success' : 'warning'}
                className="text-xs">

                  {summary.successRate.toFixed(1)}% success
                </Badge>
              </div>

              {/* Market Share Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Market Share</span>
                  <span className="font-medium">
                    {summary.marketShare.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${summary.marketShare}%`,
                    backgroundColor: summary.color
                  }} />

                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Overall Summary */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Overall Summary</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <IndianRupee className="w-4 h-4" />
              <span>Gross Collection</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(overallTotals.grossAmount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Paid by parents</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <CreditCard className="w-4 h-4" />
              <span>Total MDR</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              -{formatCurrency(overallTotals.mdrCharges)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Gateway charges</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Building className="w-4 h-4" />
              <span>GST on MDR</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              -{formatCurrency(overallTotals.gstOnMdr)}
            </p>
            <p className="text-xs text-gray-500 mt-1">18% on MDR</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Wallet className="w-4 h-4" />
              <span>Net Received</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(overallTotals.netAmount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Settled to bank</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Percent className="w-4 h-4" />
              <span>Effective MDR</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {effectiveMdr.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">(MDR + GST) / Gross</p>
          </div>
        </div>
      </Card>

      {/* Chart Section */}
      {showChart &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">
                Gateway Performance Comparison
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Select
              className="w-44"
              options={metricOptions}
              value={selectedMetric}
              onChange={(e) =>
              setSelectedMetric(e.target.value as MetricType)
              } />

              <Select
              className="w-36"
              options={chartTypeOptions}
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)} />

            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>{formatCurrency(getMaxValue(selectedMetric))}</span>
              <span>{formatCurrency(getMaxValue(selectedMetric) * 0.75)}</span>
              <span>{formatCurrency(getMaxValue(selectedMetric) * 0.5)}</span>
              <span>{formatCurrency(getMaxValue(selectedMetric) * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="ml-16 overflow-x-auto">
              <div
              className="flex items-end gap-1 min-w-max"
              style={{
                height: '200px'
              }}>

                {dailyData.map((day, dayIndex) =>
              <div key={day.date} className="flex flex-col items-center">
                    {/* Bars */}
                    <div className="flex items-end gap-0.5 h-[150px]">
                      {gateways.
                  filter((g) => g.isActive).
                  map((gateway) => {
                    const gData = day.gateways[gateway.id];
                    if (!gData) return null;
                    let value = 0;
                    switch (selectedMetric) {
                      case 'gross':
                        value = gData.grossAmount;
                        break;
                      case 'net':
                        value = gData.netAmount;
                        break;
                      case 'mdr':
                        value = gData.mdrCharges + gData.gstOnMdr;
                        break;
                      case 'transactions':
                        value = gData.transactionCount;
                        break;
                    }
                    const height = getBarHeight(
                      value,
                      getMaxValue(selectedMetric)
                    );
                    return (
                      <div
                        key={gateway.id}
                        className={`w-4 rounded-t transition-all hover:opacity-80 cursor-pointer ${highlightedGateway && highlightedGateway !== gateway.id ? 'opacity-30' : ''}`}
                        style={{
                          height: `${height}px`,
                          backgroundColor: gateway.color,
                          minHeight: value > 0 ? '4px' : '0'
                        }}
                        title={`${gateway.name}: ${selectedMetric === 'transactions' ? value : formatCurrency(value)}`}
                        onClick={() =>
                        setHighlightedGateway(
                          highlightedGateway === gateway.id ?
                          null :
                          gateway.id
                        )
                        } />);


                  })}
                    </div>

                    {/* X-axis label */}
                    <div className="mt-2 text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {day.displayDate}
                    </div>
                  </div>
              )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-4 border-t">
            {gateways.
          filter((g) => g.isActive).
          map((gateway) =>
          <button
            key={gateway.id}
            onClick={() =>
            setHighlightedGateway(
              highlightedGateway === gateway.id ? null : gateway.id
            )
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${highlightedGateway === gateway.id ? 'bg-gray-100 ring-2 ring-offset-1' : highlightedGateway ? 'opacity-50' : ''}`}
            style={{
              ringColor: gateway.color
            }}>

                  <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: gateway.color
              }} />

                  <span className="text-sm font-medium text-gray-700">
                    {gateway.name}
                  </span>
                </button>
          )}
            {highlightedGateway &&
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHighlightedGateway(null)}>

                <XCircle className="w-4 h-4 mr-1" />
                Clear Selection
              </Button>
          }
          </div>
        </Card>
      }

      {/* Matrix Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">
              Daily Gateway-wise Collection Matrix
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="w-4 h-4" />
            <span>Amounts in ₹ | Hover for details</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 font-medium text-gray-700 sticky left-0 bg-gray-100 z-10">
                  Date
                </th>
                {gateways.
                filter((g) => g.isActive).
                map((gateway) =>
                <th
                  key={gateway.id}
                  colSpan={showMdrBreakdown ? 4 : 2}
                  className="text-center p-3 font-medium text-gray-700"
                  style={{
                    borderBottom: `3px solid ${gateway.color}`
                  }}>

                      <div className="flex items-center justify-center gap-2">
                        <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: gateway.color
                      }} />

                        {gateway.name}
                      </div>
                      <div className="text-xs text-gray-500 font-normal mt-1">
                        MDR: {gateway.mdrPercentage}%
                      </div>
                    </th>
                )}
                <th
                  colSpan={showMdrBreakdown ? 4 : 2}
                  className="text-center p-3 font-medium text-gray-700 bg-blue-50">

                  Daily Totals
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th className="text-left p-2 text-xs text-gray-600 sticky left-0 bg-gray-50 z-10"></th>
                {gateways.
                filter((g) => g.isActive).
                map((gateway) =>
                <Fragment key={gateway.id}>
                      <th className="text-right p-2 text-xs text-gray-600">
                        Gross
                      </th>
                      {showMdrBreakdown &&
                  <>
                          <th className="text-right p-2 text-xs text-gray-600">
                            MDR
                          </th>
                          <th className="text-right p-2 text-xs text-gray-600">
                            GST
                          </th>
                        </>
                  }
                      <th className="text-right p-2 text-xs text-gray-600">
                        Net
                      </th>
                    </Fragment>
                )}
                <th className="text-right p-2 text-xs text-gray-600 bg-blue-50">
                  Gross
                </th>
                {showMdrBreakdown &&
                <>
                    <th className="text-right p-2 text-xs text-gray-600 bg-blue-50">
                      MDR
                    </th>
                    <th className="text-right p-2 text-xs text-gray-600 bg-blue-50">
                      GST
                    </th>
                  </>
                }
                <th className="text-right p-2 text-xs text-gray-600 bg-blue-50">
                  Net
                </th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((day, index) =>
              <tr
                key={day.date}
                className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>

                  <td className="p-3 font-medium text-gray-900 sticky left-0 bg-inherit z-10 whitespace-nowrap">
                    <div>{day.displayDate}</div>
                    <div className="text-xs text-gray-500">
                      {day.totals.transactionCount} txns
                    </div>
                  </td>
                  {gateways.
                filter((g) => g.isActive).
                map((gateway) => {
                  const gData = day.gateways[gateway.id];
                  if (!gData) return null;
                  return (
                    <Fragment key={gateway.id}>
                          <td className="p-2 text-right">
                            <span className="font-medium">
                              {showPercentages ?
                          `${(gData.grossAmount / day.totals.grossAmount * 100).toFixed(1)}%` :
                          formatCurrency(gData.grossAmount)}
                            </span>
                          </td>
                          {showMdrBreakdown &&
                      <>
                              <td className="p-2 text-right text-red-600 text-xs">
                                -{formatCurrency(gData.mdrCharges)}
                              </td>
                              <td className="p-2 text-right text-orange-600 text-xs">
                                -{formatCurrency(gData.gstOnMdr)}
                              </td>
                            </>
                      }
                          <td className="p-2 text-right text-green-600 font-medium">
                            {formatCurrency(gData.netAmount)}
                          </td>
                        </Fragment>);

                })}
                  {/* Daily Totals */}
                  <td className="p-2 text-right bg-blue-50 font-bold">
                    {formatCurrency(day.totals.grossAmount)}
                  </td>
                  {showMdrBreakdown &&
                <>
                      <td className="p-2 text-right bg-blue-50 text-red-600 font-medium">
                        -{formatCurrency(day.totals.mdrCharges)}
                      </td>
                      <td className="p-2 text-right bg-blue-50 text-orange-600 font-medium">
                        -{formatCurrency(day.totals.gstOnMdr)}
                      </td>
                    </>
                }
                  <td className="p-2 text-right bg-blue-50 text-green-600 font-bold">
                    {formatCurrency(day.totals.netAmount)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800 text-white font-medium">
                <td className="p-3 sticky left-0 bg-gray-800 z-10">
                  <div className="font-bold">GRAND TOTAL</div>
                  <div className="text-xs text-gray-300">
                    {overallTotals.transactionCount} transactions
                  </div>
                </td>
                {gateways.
                filter((g) => g.isActive).
                map((gateway) => {
                  const summary = gatewaySummaries.find(
                    (s) => s.gatewayId === gateway.id
                  );
                  if (!summary) return null;
                  return (
                    <Fragment key={gateway.id}>
                        <td className="p-2 text-right font-bold">
                          {formatCurrency(summary.totalGross)}
                        </td>
                        {showMdrBreakdown &&
                      <>
                            <td className="p-2 text-right text-red-300">
                              -{formatCurrency(summary.totalMdr)}
                            </td>
                            <td className="p-2 text-right text-orange-300">
                              -{formatCurrency(summary.totalGst)}
                            </td>
                          </>
                      }
                        <td className="p-2 text-right text-green-300 font-bold">
                          {formatCurrency(summary.totalNet)}
                        </td>
                      </Fragment>);

                })}
                {/* Grand Totals */}
                <td className="p-2 text-right bg-blue-900 font-bold">
                  {formatCurrency(overallTotals.grossAmount)}
                </td>
                {showMdrBreakdown &&
                <>
                    <td className="p-2 text-right bg-blue-900 text-red-300 font-bold">
                      -{formatCurrency(overallTotals.mdrCharges)}
                    </td>
                    <td className="p-2 text-right bg-blue-900 text-orange-300 font-bold">
                      -{formatCurrency(overallTotals.gstOnMdr)}
                    </td>
                  </>
                }
                <td className="p-2 text-right bg-blue-900 text-green-300 font-bold">
                  {formatCurrency(overallTotals.netAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* MDR Analysis Section */}
      {showMdrBreakdown &&
      <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Percent className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">
              MDR & Charges Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MDR by Gateway */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                MDR Charges by Gateway
              </h3>
              <div className="space-y-4">
                {gatewaySummaries.map((summary) => {
                const totalCharges = summary.totalMdr + summary.totalGst;
                const chargePercentage =
                totalCharges / (
                overallTotals.mdrCharges + overallTotals.gstOnMdr) *
                100;
                return (
                  <div key={summary.gatewayId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: summary.color
                          }} />

                          <span className="font-medium text-gray-900">
                            {summary.gatewayName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(totalCharges)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({chargePercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-3">
                        <div
                        className="rounded-l"
                        style={{
                          width: `${summary.totalMdr / totalCharges * 100}%`,
                          backgroundColor: summary.color,
                          opacity: 0.8
                        }}
                        title={`MDR: ${formatCurrency(summary.totalMdr)}`} />

                        <div
                        className="rounded-r"
                        style={{
                          width: `${summary.totalGst / totalCharges * 100}%`,
                          backgroundColor: summary.color,
                          opacity: 0.5
                        }}
                        title={`GST: ${formatCurrency(summary.totalGst)}`} />

                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>MDR: {formatCurrency(summary.totalMdr)}</span>
                        <span>GST: {formatCurrency(summary.totalGst)}</span>
                      </div>
                    </div>);

              })}
              </div>
            </div>

            {/* Effective MDR Comparison */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Effective MDR Rate Comparison
              </h3>
              <div className="space-y-4">
                {gatewaySummaries.map((summary) => {
                const effectiveRate =
                summary.totalGross > 0 ?
                (summary.totalMdr + summary.totalGst) /
                summary.totalGross *
                100 :
                0;
                const advertised = summary.mdrPercentage;
                const withGst = advertised * 1.18;
                return (
                  <div
                    key={summary.gatewayId}
                    className="bg-gray-50 rounded-lg p-4">

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: summary.color
                          }} />

                          <span className="font-medium">
                            {summary.gatewayName}
                          </span>
                        </div>
                        <Badge
                        variant={
                        effectiveRate <= withGst ? 'success' : 'warning'
                        }>

                          {effectiveRate <= withGst ? 'Optimal' : 'Check'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500">Advertised</p>
                          <p className="text-lg font-bold text-gray-700">
                            {advertised.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">With GST</p>
                          <p className="text-lg font-bold text-orange-600">
                            {withGst.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Effective</p>
                          <p className="text-lg font-bold text-blue-600">
                            {effectiveRate.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            </div>
          </div>

          {/* Savings Opportunity */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">
                  Potential Savings Analysis
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  If all transactions were routed through the gateway with
                  lowest MDR (
                  {
                gateways.reduce((min, g) =>
                g.isActive && g.mdrPercentage < min.mdrPercentage ?
                g :
                min
                ).name
                }
                  @{' '}
                  {
                gateways.reduce((min, g) =>
                g.isActive && g.mdrPercentage < min.mdrPercentage ?
                g :
                min
                ).mdrPercentage
                }
                  %), you could save approximately{' '}
                  <strong>
                    {formatCurrency(
                    overallTotals.mdrCharges +
                    overallTotals.gstOnMdr -
                    overallTotals.grossAmount * (
                    gateways.reduce((min, g) =>
                    g.isActive && g.mdrPercentage < min.mdrPercentage ?
                    g :
                    min
                    ).mdrPercentage /
                    100) *
                    1.18
                  )}
                  </strong>{' '}
                  in gateway charges.
                </p>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Gateway Performance Metrics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">
            Gateway Performance Metrics
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-medium text-gray-700">
                  Gateway
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Total Txns
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Success Rate
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Avg. Value
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Market Share
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Gross Amount
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Total Charges
                </th>
                <th className="text-right p-3 font-medium text-gray-700">
                  Net Amount
                </th>
                <th className="text-center p-3 font-medium text-gray-700">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {gatewaySummaries.map((summary) =>
              <tr
                key={summary.gatewayId}
                className="border-b hover:bg-gray-50">

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: summary.color
                      }} />

                      <span className="font-medium">{summary.gatewayName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {summary.totalTransactions}
                  </td>
                  <td className="p-3 text-right">
                    <Badge
                    variant={
                    summary.successRate >= 95 ?
                    'success' :
                    summary.successRate >= 90 ?
                    'warning' :
                    'danger'
                    }>

                      {summary.successRate.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {formatCurrency(summary.avgTransactionValue)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                        className="h-full rounded-full"
                        style={{
                          width: `${summary.marketShare}%`,
                          backgroundColor: summary.color
                        }} />

                      </div>
                      <span>{summary.marketShare.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(summary.totalGross)}
                  </td>
                  <td className="p-3 text-right text-red-600">
                    {formatCurrency(summary.totalMdr + summary.totalGst)}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {(
                    (summary.totalMdr + summary.totalGst) /
                    summary.totalGross *
                    100).
                    toFixed(2)}
                      %)
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-green-600">
                    {formatCurrency(summary.totalNet)}
                  </td>
                  <td className="p-3 text-center">
                    <TrendIndicator value={summary.trend} />
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {overallTotals.transactionCount}
                </td>
                <td className="p-3 text-right">-</td>
                <td className="p-3 text-right">
                  {formatCurrency(
                    overallTotals.grossAmount / overallTotals.transactionCount
                  )}
                </td>
                <td className="p-3 text-right">100%</td>
                <td className="p-3 text-right">
                  {formatCurrency(overallTotals.grossAmount)}
                </td>
                <td className="p-3 text-right text-red-600">
                  {formatCurrency(
                    overallTotals.mdrCharges + overallTotals.gstOnMdr
                  )}
                  <span className="text-xs text-gray-500 ml-1">
                    ({effectiveMdr.toFixed(2)}%)
                  </span>
                </td>
                <td className="p-3 text-right text-green-600">
                  {formatCurrency(overallTotals.netAmount)}
                </td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Info Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>
            Report Period: {dateFrom} to {dateTo} | Generated:{' '}
            {new Date().toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Net = Gross - MDR - GST
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            GST @ 18% on MDR
          </span>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          table {
            font-size: 9px;
          }
        }
      `}</style>
    </div>);

}