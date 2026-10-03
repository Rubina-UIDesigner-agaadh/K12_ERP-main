import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  TrendingUp, TrendingDown, Wallet, ArrowDownToLine, ArrowUpFromLine, Scale,
  Percent, FileText, FileSpreadsheet, Printer, RotateCcw, X, Bell,
  BarChart3, AlertTriangle, Eye, CheckCircle, ClipboardList, Building2,
} from 'lucide-react';

// ───────────────────────────── Types & Data ─────────────────────────────
interface Item { name: string; amount: number; dept?: string }
interface Group { group: string; items: Item[] }

const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const BRANCH_WEIGHT: Record<string, number> = { 'Main Campus': 0.40, 'North Branch': 0.18, 'South Branch': 0.16, 'East Branch': 0.14, 'West Branch': 0.12 };
const MONTHS = ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];
const DEPARTMENTS = ['All', 'Administration', 'Academics', 'Hostel', 'Transport', 'Library'];
const PERIOD_RANGE: Record<string, [string, string]> = {
  Monthly: ['Apr 2025', 'Apr 2025'],
  Quarterly: ['Apr 2025', 'Jun 2025'],
  'Half-Yearly': ['Apr 2025', 'Sep 2025'],
  Annual: ['Apr 2025', 'Mar 2026'],
};

const IE_DATA: Record<string, { income: Group[]; expenditure: Group[] }> = {
  'FY 2025-26': {
    income: [
      { group: 'Fee Income', items: [
        { name: 'Tuition Fee', amount: 1800000 },
        { name: 'Hostel Fee', amount: 300000 },
        { name: 'Transport Fee', amount: 150000 },
        { name: 'Exam Fee', amount: 50000 },
        { name: 'Library Fee', amount: 20000 },
      ] },
      { group: 'Grant Income', items: [
        { name: 'Government Grant', amount: 300000 },
        { name: 'State Grant', amount: 100000 },
      ] },
      { group: 'Other Income', items: [
        { name: 'Donations', amount: 50000 },
        { name: 'Bank Interest', amount: 20000 },
        { name: 'Misc. Income', amount: 10000 },
        { name: 'Cultural Fund Income', amount: 0 },
      ] },
    ],
    expenditure: [
      { group: 'Staff Expenses', items: [
        { name: 'Teacher Salary', amount: 1000000, dept: 'Academics' },
        { name: 'Non-Teaching Salary', amount: 200000, dept: 'Transport' },
        { name: 'Staff Allowances', amount: 50000, dept: 'Administration' },
      ] },
      { group: 'Operational Expenses', items: [
        { name: 'Electricity Bill', amount: 80000, dept: 'Administration' },
        { name: 'Water Bill', amount: 20000, dept: 'Hostel' },
        { name: 'Internet/Phone', amount: 15000, dept: 'Administration' },
        { name: 'Solar Maintenance', amount: 0, dept: 'Administration' },
      ] },
      { group: 'Maintenance Expenses', items: [
        { name: 'Building Maintenance', amount: 30000, dept: 'Administration' },
        { name: 'Equipment Repair', amount: 20000, dept: 'Academics' },
        { name: 'Furniture', amount: 15000, dept: 'Hostel' },
      ] },
      { group: 'Administrative Expenses', items: [
        { name: 'Stationery & Supplies', amount: 25000, dept: 'Administration' },
        { name: 'Printing & Photocopying', amount: 10000, dept: 'Library' },
        { name: 'Postage & Courier', amount: 5000, dept: 'Administration' },
      ] },
      { group: 'Depreciation', items: [
        { name: 'Building Depreciation', amount: 50000, dept: 'Administration' },
        { name: 'Equipment Depreciation', amount: 30000, dept: 'Academics' },
      ] },
    ],
  },
  'FY 2024-25': {
    income: [
      { group: 'Fee Income', items: [
        { name: 'Tuition Fee', amount: 1650000 },
        { name: 'Hostel Fee', amount: 260000 },
        { name: 'Transport Fee', amount: 130000 },
        { name: 'Exam Fee', amount: 40000 },
        { name: 'Library Fee', amount: 20000 },
      ] },
      { group: 'Grant Income', items: [
        { name: 'Government Grant', amount: 300000 },
        { name: 'State Grant', amount: 60000 },
      ] },
      { group: 'Other Income', items: [
        { name: 'Donations', amount: 40000 },
        { name: 'Bank Interest', amount: 18000 },
        { name: 'Misc. Income', amount: 8000 },
      ] },
    ],
    expenditure: [
      { group: 'Staff Expenses', items: [
        { name: 'Teacher Salary', amount: 1080000, dept: 'Academics' },
        { name: 'Non-Teaching Salary', amount: 190000, dept: 'Transport' },
        { name: 'Staff Allowances', amount: 40000, dept: 'Administration' },
      ] },
      { group: 'Operational Expenses', items: [
        { name: 'Electricity Bill', amount: 70000, dept: 'Administration' },
        { name: 'Water Bill', amount: 18000, dept: 'Hostel' },
        { name: 'Internet/Phone', amount: 12000, dept: 'Administration' },
      ] },
      { group: 'Maintenance Expenses', items: [
        { name: 'Building Maintenance', amount: 28000, dept: 'Administration' },
        { name: 'Equipment Repair', amount: 18000, dept: 'Academics' },
        { name: 'Furniture', amount: 14000, dept: 'Hostel' },
      ] },
      { group: 'Administrative Expenses', items: [
        { name: 'Stationery & Supplies', amount: 22000, dept: 'Administration' },
        { name: 'Printing & Photocopying', amount: 9000, dept: 'Library' },
        { name: 'Postage & Courier', amount: 4000, dept: 'Administration' },
      ] },
      { group: 'Depreciation', items: [
        { name: 'Building Depreciation', amount: 45000, dept: 'Administration' },
        { name: 'Equipment Depreciation', amount: 28000, dept: 'Academics' },
      ] },
    ],
  },
  'FY 2023-24': {
    income: [
      { group: 'Fee Income', items: [
        { name: 'Tuition Fee', amount: 1500000 },
        { name: 'Hostel Fee', amount: 220000 },
        { name: 'Transport Fee', amount: 110000 },
        { name: 'Exam Fee', amount: 35000 },
        { name: 'Library Fee', amount: 15000 },
      ] },
      { group: 'Grant Income', items: [
        { name: 'Government Grant', amount: 250000 },
        { name: 'State Grant', amount: 50000 },
      ] },
      { group: 'Other Income', items: [
        { name: 'Donations', amount: 30000 },
        { name: 'Bank Interest', amount: 14000 },
        { name: 'Misc. Income', amount: 6000 },
      ] },
    ],
    expenditure: [
      { group: 'Staff Expenses', items: [
        { name: 'Teacher Salary', amount: 960000, dept: 'Academics' },
        { name: 'Non-Teaching Salary', amount: 170000, dept: 'Transport' },
        { name: 'Staff Allowances', amount: 35000, dept: 'Administration' },
      ] },
      { group: 'Operational Expenses', items: [
        { name: 'Electricity Bill', amount: 62000, dept: 'Administration' },
        { name: 'Water Bill', amount: 16000, dept: 'Hostel' },
        { name: 'Internet/Phone', amount: 10000, dept: 'Administration' },
      ] },
      { group: 'Maintenance Expenses', items: [
        { name: 'Building Maintenance', amount: 24000, dept: 'Administration' },
        { name: 'Equipment Repair', amount: 16000, dept: 'Academics' },
        { name: 'Furniture', amount: 12000, dept: 'Hostel' },
      ] },
      { group: 'Administrative Expenses', items: [
        { name: 'Stationery & Supplies', amount: 20000, dept: 'Administration' },
        { name: 'Printing & Photocopying', amount: 8000, dept: 'Library' },
        { name: 'Postage & Courier', amount: 3500, dept: 'Administration' },
      ] },
      { group: 'Depreciation', items: [
        { name: 'Building Depreciation', amount: 40000, dept: 'Administration' },
        { name: 'Equipment Depreciation', amount: 25000, dept: 'Academics' },
      ] },
    ],
  },
};

// Comparison baselines at group level (for Previous Month / Budget)
const PREV_MONTH: Record<string, number> = {
  'Fee Income': 460000, 'Grant Income': 40000, 'Other Income': 8000,
  'Staff Expenses': 260000, 'Operational Expenses': 24000, 'Maintenance Expenses': 12000,
  'Administrative Expenses': 8000, 'Depreciation': 14000,
};
const BUDGET: Record<string, number> = {
  'Fee Income': 2400000, 'Grant Income': 450000, 'Other Income': 100000,
  'Staff Expenses': 1300000, 'Operational Expenses': 120000, 'Maintenance Expenses': 80000,
  'Administrative Expenses': 40000, 'Depreciation': 80000,
};

const DRILLDOWN_TXNS: Record<string, { date: string; voucher: string; desc: string; amount: number }[]> = {
  'Tuition Fee': [
    { date: '05-Apr-25', voucher: 'VCH-002', desc: 'Fee - Rahul Kumar X-A', amount: 15000 },
    { date: '07-Apr-25', voucher: 'VCH-004', desc: 'Fee - Amit Verma VIII-A', amount: 10000 },
    { date: '12-Apr-25', voucher: 'VCH-011', desc: 'Fee - batch (45 students)', amount: 520000 },
    { date: '30-Apr-25', voucher: 'VCH-022', desc: 'Fee - batch (38 students)', amount: 440000 },
  ],
  default: [
    { date: '05-Apr-25', voucher: 'VCH-002', desc: 'Opening postings', amount: 25000 },
    { date: '18-Apr-25', voucher: 'VCH-014', desc: 'Consolidated entry', amount: 130000 },
    { date: '30-Apr-25', voucher: 'VCH-031', desc: 'Month-end accrual', amount: 64000 },
  ],
};

// ───────────────────────────── Main Page ─────────────────────────────
export function IncomeExpenditure() {
  const [fy, setFy] = useState('FY 2025-26');
  const [period, setPeriod] = useState('Half-Yearly');
  const [fromMonth, setFromMonth] = useState('Apr 2025');
  const [toMonth, setToMonth] = useState('Sep 2025');
  const [department, setDepartment] = useState('All');
  const [branch, setBranch] = useState('All');
  const [compareWith, setCompareWith] = useState('Previous Year');
  const [viewType, setViewType] = useState('Detailed');
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [drilldown, setDrilldown] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const data = IE_DATA[fy];
  const br = (n: number) => (branch === 'All' || n === 0 ? n : Math.round(n * BRANCH_WEIGHT[branch]));
  const prevFyKey = FISCAL_YEARS[FISCAL_YEARS.indexOf(fy) + 1] || null;

  const groupTotal = (g: Group) => g.items.reduce((a, x) => a + x.amount, 0);
  const sideTotal = (side: Group[]) => side.reduce((s, g) => s + groupTotal(g), 0);

  const baseIncome = sideTotal(data.income);
  const baseExpenditure = sideTotal(data.expenditure);

  // ── Filtering ──
  const visibleItems = (g: Group, isExpense: boolean) =>
    g.items
      .filter((i) => !isExpense || department === 'All' || i.dept === department)
      .map((i) => ({ ...i, amount: br(i.amount) }));

  const incomeGroups = data.income.map((g) => ({ ...g, shown: visibleItems(g, false) }));
  const expenditureGroups = data.expenditure.map((g) => ({ ...g, shown: visibleItems(g, true) }));

  const totalIncome = incomeGroups.reduce((s, g) => s + g.shown.reduce((a, i) => a + i.amount, 0), 0);
  const totalExpenditure = expenditureGroups.reduce((s, g) => s + g.shown.reduce((a, i) => a + i.amount, 0), 0);
  const netSurplus = totalIncome - totalExpenditure;
  const surplusPct = totalIncome ? (netSurplus / totalIncome) * 100 : 0;

  // ── Comparative baseline ──
  const baselineLabel = compareWith === 'Previous Year' ? (prevFyKey || '—') : compareWith === 'Previous Month' ? 'Aug 2025' : 'Budget FY 2025-26';
  const baselineFor = (g: string) => {
    if (compareWith === 'Previous Month') return br(PREV_MONTH[g] || 0);
    if (compareWith === 'Budget') return br(BUDGET[g] || 0);
    if (compareWith === 'Previous Year' && prevFyKey) {
      const prev = IE_DATA[prevFyKey];
      const hit = [...prev.income, ...prev.expenditure].find((x) => x.group === g);
      return hit ? br(groupTotal(hit)) : 0;
    }
    return null;
  };
  const baselineNet = () => {
    if (compareWith === 'Previous Month') return br(508000) - br(318000);
    if (compareWith === 'Budget') return br(2950000) - br(1620000);
    if (compareWith === 'Previous Year' && prevFyKey) {
      const prev = IE_DATA[prevFyKey];
      return br(sideTotal(prev.income)) - br(sideTotal(prev.expenditure));
    }
    return null;
  };

  const comparativeRows = [
    ...incomeGroups.map((g) => ({ name: g.group, cur: groupTotal(g), base: baselineFor(g.group) })),
    { name: 'Total Income', cur: totalIncome, base: compareWith === 'None' ? null : incomeGroups.reduce((s, g) => s + (baselineFor(g.group) || 0), 0) },
    ...expenditureGroups.map((g) => ({ name: g.group, cur: groupTotal(g), base: baselineFor(g.group) })),
    { name: 'Total Expenditure', cur: totalExpenditure, base: compareWith === 'None' ? null : expenditureGroups.reduce((s, g) => s + (baselineFor(g.group) || 0), 0) },
    { name: 'Net Surplus / (Deficit)', cur: netSurplus, base: baselineNet(), bold: true },
  ].filter((r) => compareWith !== 'None');

  // ── Actions ──
  const changePeriod = (v: string) => {
    setPeriod(v);
    const [f, t] = PERIOD_RANGE[v];
    setFromMonth(f); setToMonth(t);
    showToast(`Period set to ${v}: ${f} – ${t}.`);
  };
  const generate = () => showToast(`Report generated: ${period} · ${fromMonth} – ${toMonth}${department !== 'All' ? ` · ${department}` : ''}.`);
  const reset = () => {
    setPeriod('Half-Yearly'); setFromMonth('Apr 2025'); setToMonth('Sep 2025');
    setDepartment('All'); setCompareWith('Previous Year');
    setViewType('Detailed');
    showToast('Filters reset to defaults.');
  };
  const doExport = (kind: string) => {
    if (kind === 'print') { window.print(); return; }
    if (kind === 'pdf') { showToast('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Section,Group,Account,Amount (₹)\n';
    const rows: string[] = [];
    incomeGroups.forEach((g) => g.shown.forEach((i) => rows.push(['Income', g.group, `"${i.name}"`, i.amount].join(','))));
    expenditureGroups.forEach((g) => g.shown.forEach((i) => rows.push(['Expenditure', g.group, `"${i.name}"`, i.amount].join(','))));
    rows.push(['Result', '', 'Net Surplus / (Deficit)', netSurplus].join(','));
    const blob = new Blob([header + rows.join('\n')], { type: kind === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-expenditure-${fy.replace(/\s/g, '-')}.${kind === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Statement exported as ${kind.toUpperCase()}.`);
  };

  // ── Computed alerts ──
  const staffGroup = data.expenditure.find((g) => g.group === 'Staff Expenses');
  const staffPct = baseIncome ? (groupTotal(staffGroup!) / baseIncome) * 100 : 0;
  const prevNet = prevFyKey ? sideTotal(IE_DATA[prevFyKey].income) - sideTotal(IE_DATA[prevFyKey].expenditure) : null;
  const feeGroup = data.income.find((g) => g.group === 'Fee Income');
  const feeShare = baseIncome ? (groupTotal(feeGroup!) / baseIncome) * 100 : 0;
  const zeroCount = [...data.income, ...data.expenditure].flatMap((g) => g.items).filter((i) => i.amount === 0).length;
  const alerts = [
    staffPct > 60
      ? { icon: AlertTriangle, tone: 'text-red-600 bg-red-50 border-red-200', text: `Staff expenses are ${staffPct.toFixed(1)}% of total income (above 60%)` }
      : { icon: CheckCircle, tone: 'text-green-600 bg-green-50 border-green-200', text: `Staff expenses are ${staffPct.toFixed(1)}% of income — within limits` },
    prevNet !== null && netSurplus >= 0
      ? netSurplus >= prevNet
        ? { icon: TrendingUp, tone: 'text-green-600 bg-green-50 border-green-200', text: `Net surplus grew ${(((netSurplus - prevNet) / prevNet) * 100).toFixed(1)}% vs ${prevFyKey}` }
        : { icon: TrendingDown, tone: 'text-amber-600 bg-amber-50 border-amber-200', text: `Net surplus dropped ${(((prevNet - netSurplus) / prevNet) * 100).toFixed(1)}% vs ${prevFyKey}` }
      : { icon: AlertTriangle, tone: 'text-red-600 bg-red-50 border-red-200', text: 'School is running at a deficit this period' },
    { icon: Wallet, tone: 'text-blue-600 bg-blue-50 border-blue-200', text: `Fee income contributes ${feeShare.toFixed(0)}% of total income` },
    zeroCount > 0
      ? { icon: Bell, tone: 'text-violet-600 bg-violet-50 border-violet-200', text: `${zeroCount} account(s) carry a nil balance in this period` }
      : { icon: CheckCircle, tone: 'text-green-600 bg-green-50 border-green-200', text: 'Every account has a balance in this period' },
  ];

  const fmt = (n: number) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

  // ── Branch-wise statements (each branch = its share of every head, same filters) ──
  const branchStatement = (b: string) => {
    const w = BRANCH_WEIGHT[b] || 0;
    const sc = (n: number) => (n === 0 ? 0 : Math.round(n * w));
    const side = (groups: Group[], isExpense: boolean) => groups.map((g) => {
      const shown = g.items
        .filter((i) => !isExpense || department === 'All' || i.dept === department)
        .map((i) => ({ ...i, amount: sc(i.amount) }));
      return { group: g.group, shown, total: shown.reduce((a, i) => a + i.amount, 0) };
    });
    const income = side(data.income, false);
    const expenditure = side(data.expenditure, true);
    const inc = income.reduce((s, g) => s + g.total, 0);
    const exp = expenditure.reduce((s, g) => s + g.total, 0);
    return { income, expenditure, inc, exp, net: inc - exp };
  };

  const kpis = [
    { icon: ArrowDownToLine, label: 'Total Income', value: fmt(totalIncome), delta: compareWith !== 'None' && baselineFor('Fee Income') !== null ? (((totalIncome - incomeGroups.reduce((s, g) => s + (baselineFor(g.group) || 0), 0)) / Math.max(1, incomeGroups.reduce((s, g) => s + (baselineFor(g.group) || 0), 0))) * 100).toFixed(1) + '%' : null, color: 'bg-emerald-50 text-emerald-600' },
    { icon: ArrowUpFromLine, label: 'Total Expenditure', value: fmt(totalExpenditure), color: 'bg-amber-50 text-amber-600' },
    { icon: Scale, label: 'Net Surplus / (Deficit)', value: fmt(netSurplus), chip: netSurplus >= 0 ? '🟢 Surplus' : '🔴 Deficit', color: 'bg-teal-50 text-teal-600' },
    { icon: Percent, label: 'Surplus %', value: `${surplusPct.toFixed(2)}%`, color: 'bg-blue-50 text-blue-600' },
  ];

  const Row = ({ label, amount, sub, bold, total, onClick }: { label: string; amount?: number; sub?: string; bold?: boolean; total?: boolean; onClick?: () => void }) => (
    <div className={`flex items-center justify-between px-4 py-2 border-b border-gray-100 ${total ? 'bg-gray-100 border-t border-gray-300 font-bold' : bold ? 'font-semibold bg-gray-50/60' : ''}`}>
      <span className={`text-sm ${onClick ? 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer' : 'text-gray-800'}`} onClick={onClick}>
        {label}
        {sub && <span className="block text-[11px] text-gray-400 font-normal">{sub}</span>}
      </span>
      <span className="text-sm tabular-nums text-gray-900">{amount !== undefined ? fmt(amount) : ''}</span>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-600" /> Income &amp; Expenditure Statement
          </h1>
          <p className="text-sm text-gray-500 mt-1">Surplus / Deficit statement for non-profit school accounting</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select value={fy} onChange={(e) => { setFy(e.target.value); showToast(`Loaded ${e.target.value} data.`); }}
              options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} />
          </div>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </div>

      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {toast}</span>
          <button onClick={() => setToast('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${c.color}`}><c.icon className="w-4 h-4" /></div>
              {c.chip && <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${netSurplus >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>{c.chip}</span>}
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">{c.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{c.value}</p>
          </Card>
        ))}
      </div>

      {/* ── Filters & Controls ── */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-4">
          <Select label="Period" value={period} onChange={(e) => changePeriod(e.target.value)}
            options={['Monthly', 'Quarterly', 'Half-Yearly', 'Annual'].map((v) => ({ value: v, label: v }))} />
          <Select label="From" value={fromMonth} onChange={(e) => setFromMonth(e.target.value)}
            options={MONTHS.map((v) => ({ value: v, label: v }))} />
          <Select label="To" value={toMonth} onChange={(e) => setToMonth(e.target.value)}
            options={MONTHS.map((v) => ({ value: v, label: v }))} />
          <Select label="Department (Expenditure)" value={department} onChange={(e) => setDepartment(e.target.value)}
            options={DEPARTMENTS.map((v) => ({ value: v, label: v }))} />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)}
            options={BRANCHES.map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
          <Select label="Compare With" value={compareWith} onChange={(e) => setCompareWith(e.target.value)}
            options={['Previous Year', 'Previous Month', 'Budget', 'None'].map((v) => ({ value: v, label: v }))} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">View Type:</span>
            {['Summary', 'Detailed'].map((v) => (
              <label key={v} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="viewType" checked={viewType === v} onChange={() => setViewType(v)} className="text-blue-600 focus:ring-blue-500" />
                {v}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={generate}><Eye className="w-4 h-4 mr-2" /> Generate Report</Button>
            <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
            <Button variant="outline" onClick={() => doExport('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF</Button>
            <Button variant="outline" onClick={() => doExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Excel</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>
      </Card>

      {/* ── View toggle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{viewMode === 'list' ? 'Consolidated statement for the selected branch filter' : 'Statement divided into branch-wise sections'}</p>
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5">
          {([['list', 'List View', ClipboardList], ['branch', 'Branch-wise View', Building2]] as const).map(([k, label, Icon]) => (
            <button key={k} onClick={() => setViewMode(k)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors ${viewMode === k ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
      {/* ── I&E Statement ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 text-center border-b border-gray-200 bg-emerald-50/40">
          <h3 className="font-bold text-gray-900">EduManager School — Income &amp; Expenditure Statement</h3>
          <p className="text-xs text-gray-500 mt-0.5">{period} · {fromMonth} to {toMonth} · {fy} · Branch: {branch === 'All' ? 'All Branches (Consolidated)' : branch}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Income */}
          <div>
            <div className="px-4 py-2.5 bg-green-50 font-bold text-sm text-green-800 border-b border-gray-200">
              📥 INCOME
              {department !== 'All' && <span className="block text-[10px] font-normal text-green-600">(Income is school-wide — department filter applies to expenditure)</span>}
            </div>
            {incomeGroups.map((g) => (
              <div key={g.group}>
                {viewType === 'Detailed' && <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-700 bg-green-50/50 border-b border-gray-100">{g.group}</div>}
                {g.shown.map((i) => (
                  <Row key={i.name} label={i.name} amount={i.amount} onClick={() => setDrilldown(i.name)} />
                ))}
                <Row label={viewType === 'Detailed' ? `${g.group} — Sub Total` : g.group} amount={g.shown.reduce((a, i) => a + i.amount, 0)} bold />
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-green-100 border-t-2 border-green-300">
              <span className="font-bold text-green-900">📥 TOTAL INCOME</span>
              <span className="font-bold text-green-900 tabular-nums">{fmt(totalIncome)}</span>
            </div>
          </div>
          {/* Expenditure */}
          <div>
            <div className="px-4 py-2.5 bg-indigo-50 font-bold text-sm text-indigo-800 border-b border-gray-200">📤 EXPENDITURE</div>
            {expenditureGroups.map((g) => {
              const has = viewType === 'Detailed' && g.shown.length > 0;
              const sub = g.shown.reduce((a, i) => a + i.amount, 0);
              return (
                <div key={g.group}>
                  {has && <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-indigo-700 bg-indigo-50/50 border-b border-gray-100">{g.group}</div>}
                  {g.shown.map((i) => (
                    <Row key={i.name} label={`${i.name}${i.dept && i.dept !== 'All' ? ` · ${i.dept}` : ''}`} amount={i.amount} onClick={() => setDrilldown(i.name)} />
                  ))}
                  {(has || viewType === 'Summary') && <Row label={has ? `${g.group} — Sub Total` : g.group} amount={sub} bold />}
                  {viewType === 'Detailed' && g.shown.length === 0 && (
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100">No {g.group.toLowerCase()} for {department}.</div>
                  )}
                </div>
              );
            })}
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-100 border-t-2 border-indigo-300">
              <span className="font-bold text-indigo-900">📤 TOTAL EXPENDITURE</span>
              <span className="font-bold text-indigo-900 tabular-nums">{fmt(totalExpenditure)}</span>
            </div>
          </div>
        </div>
        <div className={`px-6 py-4 text-center font-bold text-lg border-t-2 ${netSurplus >= 0 ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
          {netSurplus >= 0 ? '🟢 NET SURPLUS' : '🔴 NET DEFICIT'}:{' '}
          {fmt(totalIncome)} − {fmt(totalExpenditure)} = {fmt(Math.abs(netSurplus))}
        </div>
      </Card>

        </>
      ) : (
        <div className="space-y-4">
          {(branch === 'All' ? BRANCHES.slice(1) : [branch]).map((b) => {
            const st = branchStatement(b);
            return (
              <Card key={b} className="overflow-hidden">
                <div className="px-5 py-3 bg-emerald-50/40 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-emerald-600" /> {b} — Income &amp; Expenditure</span>
                  <span className="text-xs text-gray-600 flex flex-wrap items-center gap-3">
                    <span>{period} · {fromMonth} – {toMonth}</span>
                    <span>Income <b className="text-green-700">{fmt(st.inc)}</b></span>
                    <span>Expenditure <b className="text-indigo-700">{fmt(st.exp)}</b></span>
                    <span className={`font-semibold ${st.net >= 0 ? 'text-green-700' : 'text-red-600'}`}>{st.net >= 0 ? '🟢 Surplus' : '🔴 Deficit'} {fmt(Math.abs(st.net))}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                  <div>
                    <div className="px-4 py-2 bg-green-50 font-bold text-xs text-green-800 border-b border-gray-200">📥 INCOME</div>
                    {st.income.map((g) => (
                      <div key={g.group}>
                        {viewType === 'Detailed' && g.shown.map((i) => <Row key={i.name} label={i.name} amount={i.amount} onClick={() => setDrilldown(i.name)} />)}
                        <Row label={viewType === 'Detailed' ? `${g.group} — Sub Total` : g.group} amount={g.total} bold />
                      </div>
                    ))}
                    <Row label="📥 TOTAL INCOME" amount={st.inc} total />
                  </div>
                  <div>
                    <div className="px-4 py-2 bg-indigo-50 font-bold text-xs text-indigo-800 border-b border-gray-200">📤 EXPENDITURE</div>
                    {st.expenditure.map((g) => (
                      <div key={g.group}>
                        {viewType === 'Detailed' && g.shown.map((i) => <Row key={i.name} label={`${i.name}${i.dept && i.dept !== 'All' ? ` · ${i.dept}` : ''}`} amount={i.amount} onClick={() => setDrilldown(i.name)} />)}
                        <Row label={viewType === 'Detailed' ? `${g.group} — Sub Total` : g.group} amount={g.total} bold />
                      </div>
                    ))}
                    <Row label="📤 TOTAL EXPENDITURE" amount={st.exp} total />
                  </div>
                </div>
                <div className={`px-5 py-2.5 text-center text-sm font-bold border-t-2 ${st.net >= 0 ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
                  {st.net >= 0 ? '🟢 NET SURPLUS' : '🔴 NET DEFICIT'}: {fmt(st.inc)} − {fmt(st.exp)} = {fmt(Math.abs(st.net))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Net Result ── */}
      <Card>
        <div className={`rounded-xl px-6 py-6 text-center ${netSurplus >= 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50'}`}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-left space-y-1.5">
              <div className="flex justify-between gap-10 text-sm"><span className="text-gray-600">📥 Total Income</span><span className="font-semibold">{fmt(totalIncome)}</span></div>
              <div className="flex justify-between gap-10 text-sm"><span className="text-gray-600">📤 Total Expenditure</span><span className="font-semibold">{fmt(totalExpenditure)}</span></div>
              <div className="border-t-2 border-gray-300 pt-1.5 flex justify-between gap-10">
                <span className="font-bold">{netSurplus >= 0 ? '🟢 NET SURPLUS' : '🔴 NET DEFICIT'}</span>
                <span className={`font-bold text-lg ${netSurplus >= 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(Math.abs(netSurplus))}</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-20 bg-gray-300" />
            <div className="text-left text-sm space-y-1.5">
              <p><span className="text-gray-600">📊 Surplus %:</span> <b>{surplusPct.toFixed(2)}%</b></p>
              <p><span className="text-gray-600">🗂️ View:</span> <b>{viewType}</b> · <span className="text-gray-600">Period:</span> <b>{period}</b></p>
              <p className="text-gray-600 max-w-xs">📝 Remarks: {netSurplus >= 0 ? 'School is financially healthy with a surplus this period.' : 'Expenditure exceeds income — review expense heads.'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Comparative Analysis ── */}
      {compareWith !== 'None' && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Comparative Analysis — {fy} vs {baselineLabel}</h3>
            <Badge variant="info">{compareWith}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider">Particulars</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">{fy}</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">{baselineLabel}</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">Variance</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">Variance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparativeRows.map((r) => {
                  const variance = r.base !== null ? r.cur - r.base : null;
                  const pct = r.base ? (variance! / r.base) * 100 : null;
                  return (
                    <tr key={r.name} className={`hover:bg-gray-50 ${r.bold ? 'font-bold bg-gray-50/70' : ''}`}>
                      <td className="px-4 py-2.5 text-gray-800">{r.name.includes('Total') || r.bold ? '' : '▫ '}{r.name}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{fmt(r.cur)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{r.base !== null ? fmt(r.base) : '—'}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums ${variance === null ? 'text-gray-400' : variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {variance !== null ? `${variance > 0 ? '+' : ''}${fmt(variance)}` : '—'}
                      </td>
                      <td className={`px-4 py-2.5 text-right tabular-nums ${pct === null ? 'text-gray-400' : pct > 0 ? 'text-green-600' : pct < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {pct !== null ? `${pct > 0 ? '🔼 +' : pct < 0 ? '🔻 ' : ''}${pct.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Alerts ── */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((a, idx) => (
            <div key={idx} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${a.tone}`}>
              <a.icon className="w-4 h-4 shrink-0" />
              <span className="text-gray-700">{a.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Generated on: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: Mr. Sharma (Accountant) · Period: {fromMonth} – {toMonth} · {fy} · Branch: {branch === 'All' ? 'All Branches' : branch}</span>
        <span>EduManager School ERP · © 2026</span>
      </div>

      {/* ── Drilldown Modal ── */}
      {drilldown && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Drilldown: {drilldown}</h3>
                <p className="text-xs text-gray-500">{fromMonth} to {toMonth} · {fy}</p>
              </div>
              <button onClick={() => setDrilldown(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">#</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Date</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Voucher</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Description</th>
                    <th className="px-3 py-2 text-right text-xs uppercase font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(DRILLDOWN_TXNS[drilldown] || DRILLDOWN_TXNS.default).map((t, i) => (
                    <tr key={t.voucher} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{t.date}</td>
                      <td className="px-3 py-2 font-mono text-xs font-semibold text-blue-600">{t.voucher}</td>
                      <td className="px-3 py-2 text-gray-800">{t.desc}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-900">{fmt(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <td colSpan={4} className="px-3 py-2.5 text-right text-gray-900">TOTAL:</td>
                    <td className="px-3 py-2.5 text-right text-green-700">
                      {fmt((DRILLDOWN_TXNS[drilldown] || DRILLDOWN_TXNS.default).reduce((s, t) => s + t.amount, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
              <Button variant="primary" onClick={() => setDrilldown(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
