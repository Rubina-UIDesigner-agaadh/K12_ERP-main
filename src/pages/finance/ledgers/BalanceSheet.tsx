import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Printer, FileText, FileSpreadsheet, RotateCcw, Eye, X, Bell, BarChart3, Wallet,
  Scale, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, CalendarDays, Landmark, Coins, XCircle,
  FileDown, ClipboardList, Building2,
} from 'lucide-react';

// ───────────────────────────── Types & Data ─────────────────────────────
interface Acc { name: string; amount: number; gross?: number; dep?: number }
interface FYData {
  asOn: string;
  fixedAssets: Acc[]; cwip: Acc[]; cashBank: Acc[]; receivables: Acc[]; inventoryPrepaid: Acc[];
  nonCurrentLiab: Acc[]; currentLiab: Acc[];
  equity: { opening: number; surplus: number; transfers: number; reserves: number };
}

const FISCAL_YEARS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];
const BRANCHES = ['All', 'Main Campus', 'North Branch', 'South Branch', 'East Branch', 'West Branch'];
const BRANCH_WEIGHT: Record<string, number> = { 'Main Campus': 0.40, 'North Branch': 0.18, 'South Branch': 0.16, 'East Branch': 0.14, 'West Branch': 0.12 };

const BS_BY_FY: Record<string, FYData> = {
  'FY 2025-26': {
    asOn: '2025-09-30',
    fixedAssets: [
      { name: 'School Building', amount: 2250000, gross: 2500000, dep: 250000 },
      { name: 'Computers & Lab Equipment', amount: 450000, gross: 500000, dep: 50000 },
      { name: 'School Bus', amount: 720000, gross: 800000, dep: 80000 },
      { name: 'Furniture & Fixtures', amount: 180000, gross: 200000, dep: 20000 },
    ],
    cwip: [{ name: 'New Block Construction', amount: 500000 }],
    cashBank: [
      { name: 'Cash in Hand', amount: 50000 },
      { name: 'Bank Account - SBI', amount: 300000 },
      { name: 'Bank Account - HDFC', amount: 200000 },
    ],
    receivables: [
      { name: 'Accounts Receivable', amount: 150000 },
      { name: 'Fee Receivable', amount: 200000 },
      { name: 'Govt. Grant Receivable', amount: 50000 },
    ],
    inventoryPrepaid: [
      { name: 'Stationery Stock', amount: 30000 },
      { name: 'Prepaid Expenses', amount: 20000 },
      { name: 'Advance to Vendors', amount: 50000 },
      { name: 'Fixed Deposit (1 yr)', amount: 0 },
    ],
    nonCurrentLiab: [
      { name: 'Bank Loan', amount: 1000000 },
      { name: 'Government Loan', amount: 500000 },
      { name: 'Deferred Income', amount: 0 },
    ],
    currentLiab: [
      { name: 'Accounts Payable', amount: 150000 },
      { name: 'Salary Payable', amount: 200000 },
      { name: 'Fee Advance Received', amount: 50000 },
      { name: 'Outstanding Expenses', amount: 30000 },
      { name: 'Tax Payable', amount: 20000 },
    ],
    equity: { opening: 2500000, surplus: 850000, transfers: -300000, reserves: 150000 },
  },
  'FY 2024-25': {
    asOn: '2025-03-31',
    fixedAssets: [
      { name: 'School Building', amount: 2000000, gross: 2200000, dep: 200000 },
      { name: 'Computers & Lab Equipment', amount: 420000, gross: 470000, dep: 50000 },
      { name: 'School Bus', amount: 650000, gross: 730000, dep: 80000 },
      { name: 'Furniture & Fixtures', amount: 330000, gross: 360000, dep: 30000 },
    ],
    cwip: [{ name: 'New Block Construction', amount: 200000 }],
    cashBank: [
      { name: 'Cash in Hand', amount: 80000 },
      { name: 'Bank Account - SBI', amount: 420000 },
      { name: 'Bank Account - HDFC', amount: 200000 },
    ],
    receivables: [
      { name: 'Accounts Receivable', amount: 120000 },
      { name: 'Fee Receivable', amount: 180000 },
      { name: 'Govt. Grant Receivable', amount: 50000 },
    ],
    inventoryPrepaid: [
      { name: 'Stationery Stock', amount: 25000 },
      { name: 'Prepaid Expenses', amount: 20000 },
      { name: 'Advance to Vendors', amount: 35000 },
    ],
    nonCurrentLiab: [
      { name: 'Bank Loan', amount: 1200000 },
      { name: 'Government Loan', amount: 500000 },
    ],
    currentLiab: [
      { name: 'Accounts Payable', amount: 100000 },
      { name: 'Salary Payable', amount: 150000 },
      { name: 'Fee Advance Received', amount: 100000 },
      { name: 'Outstanding Expenses', amount: 50000 },
      { name: 'Tax Payable', amount: 50000 },
    ],
    equity: { opening: 2100000, surplus: 800000, transfers: -320000, reserves: 0 },
  },
  'FY 2023-24': {
    asOn: '2024-03-31',
    fixedAssets: [
      { name: 'School Building', amount: 1900000, gross: 2100000, dep: 200000 },
      { name: 'Computers & Lab Equipment', amount: 380000, gross: 430000, dep: 50000 },
      { name: 'School Bus', amount: 600000, gross: 680000, dep: 80000 },
      { name: 'Furniture & Fixtures', amount: 320000, gross: 350000, dep: 30000 },
    ],
    cwip: [],
    cashBank: [
      { name: 'Cash in Hand', amount: 70000 },
      { name: 'Bank Account - SBI', amount: 390000 },
      { name: 'Bank Account - HDFC', amount: 180000 },
    ],
    receivables: [
      { name: 'Accounts Receivable', amount: 100000 },
      { name: 'Fee Receivable', amount: 160000 },
      { name: 'Govt. Grant Receivable', amount: 40000 },
    ],
    inventoryPrepaid: [
      { name: 'Stationery Stock', amount: 22000 },
      { name: 'Prepaid Expenses', amount: 18000 },
      { name: 'Advance to Vendors', amount: 30000 },
    ],
    nonCurrentLiab: [
      { name: 'Bank Loan', amount: 1100000 },
      { name: 'Government Loan', amount: 400000 },
    ],
    currentLiab: [
      { name: 'Accounts Payable', amount: 80000 },
      { name: 'Salary Payable', amount: 120000 },
      { name: 'Fee Advance Received', amount: 100000 },
      { name: 'Outstanding Expenses', amount: 30000 },
      { name: 'Tax Payable', amount: 30000 },
    ],
    equity: { opening: 1850000, surplus: 750000, transfers: -250000, reserves: 0 },
  },
};

// Quarterly / Monthly comparison snapshots (group totals per FY where defined)
const PREV_Q: Record<string, { fa: number; cwip: number; cb: number; rec: number; inv: number; ncl: number; cl: number; eq: number }> = {
  'FY 2025-26': { fa: 3500000, cwip: 350000, cb: 620000, rec: 370000, inv: 90000, ncl: 1600000, cl: 460000, eq: 2870000 },
  'FY 2024-25': { fa: 3350000, cwip: 150000, cb: 720000, rec: 340000, inv: 78000, ncl: 1750000, cl: 440000, eq: 2448000 },
  'FY 2023-24': { fa: 3150000, cwip: 0, cb: 580000, rec: 290000, inv: 148000, ncl: 1520000, cl: 358000, eq: 2290000 },
};
const PREV_M: Record<string, { fa: number; cwip: number; cb: number; rec: number; inv: number; ncl: number; cl: number; eq: number }> = {
  'FY 2025-26': { fa: 3560000, cwip: 420000, cb: 590000, rec: 390000, inv: 95000, ncl: 1550000, cl: 455000, eq: 3050000 },
  'FY 2024-25': { fa: 3380000, cwip: 180000, cb: 710000, rec: 345000, inv: 80000, ncl: 1720000, cl: 445000, eq: 2530000 },
  'FY 2023-24': { fa: 3180000, cwip: 0, cb: 570000, rec: 295000, inv: 150000, ncl: 1510000, cl: 360000, eq: 2325000 },
};

const DRILLDOWN_TXNS: Record<string, { date: string; voucher: string; desc: string; amount: number }[]> = {
  'Fee Receivable': [
    { date: '01-Apr-25', voucher: 'VCH-101', desc: 'Fee - Rahul Kumar', amount: 15000 },
    { date: '05-Apr-25', voucher: 'VCH-102', desc: 'Fee - Priya Singh', amount: 12000 },
    { date: '10-Apr-25', voucher: 'VCH-103', desc: 'Fee - Amit Verma', amount: 10000 },
    { date: '18-Apr-25', voucher: 'VCH-118', desc: 'Fee - batch pending (12)', amount: 45000 },
    { date: '30-Apr-25', voucher: 'VCH-131', desc: 'Fee - batch pending (15)', amount: 52000 },
    { date: '30-Apr-25', voucher: 'VCH-132', desc: 'Fee - batch pending (18)', amount: 66000 },
  ],
  'Cash in Hand': [
    { date: '02-Apr-25', voucher: 'VCH-104', desc: 'Petty cash draw', amount: 20000 },
    { date: '16-Apr-25', voucher: 'VCH-112', desc: 'Petty cash draw', amount: 18000 },
    { date: '29-Apr-25', voucher: 'VCH-126', desc: 'Petty cash draw', amount: 12000 },
  ],
  'Bank Account - SBI': [
    { date: '05-Apr-25', voucher: 'VCH-106', desc: 'Fee collection deposit', amount: 150000 },
    { date: '20-Apr-25', voucher: 'VCH-119', desc: 'Grant credited', amount: 90000 },
    { date: '28-Apr-25', voucher: 'VCH-128', desc: 'Fee collection deposit', amount: 60000 },
  ],
  'Accounts Receivable': [
    { date: '08-Apr-25', voucher: 'VCH-108', desc: 'Vendor bill receivable', amount: 50000 },
    { date: '15-Apr-25', voucher: 'VCH-114', desc: 'Transport contract dues', amount: 40000 },
    { date: '22-Apr-25', voucher: 'VCH-121', desc: 'Book supplier dues', amount: 35000 },
    { date: '29-Apr-25', voucher: 'VCH-129', desc: 'Miscellaneous dues', amount: 25000 },
  ],
  'Accounts Payable': [
    { date: '09-Apr-25', voucher: 'VCH-109', desc: 'Electricity bill payable', amount: 60000 },
    { date: '17-Apr-25', voucher: 'VCH-116', desc: 'Vendor payable', amount: 50000 },
    { date: '26-Apr-25', voucher: 'VCH-125', desc: 'Maintenance payable', amount: 40000 },
  ],
  'Bank Loan': [
    { date: '01-Apr-25', voucher: 'VCH-201', desc: 'Term loan outstanding tranche 1', amount: 500000 },
    { date: '01-Apr-25', voucher: 'VCH-202', desc: 'Term loan outstanding tranche 2', amount: 300000 },
    { date: '01-Apr-25', voucher: 'VCH-203', desc: 'Vehicle loan outstanding', amount: 200000 },
  ],
  'School Building': [
    { date: '01-Apr-22', voucher: 'FA-001', desc: 'Main block construction cost', amount: 1200000 },
    { date: '01-Apr-23', voucher: 'FA-014', desc: 'Additional block cost', amount: 800000 },
    { date: '01-Apr-25', voucher: 'FA-022', desc: 'Renovation capitalised', amount: 500000 },
  ],
  default: [
    { date: '10-Apr-25', voucher: 'VCH-111', desc: 'Opening postings', amount: 25000 },
    { date: '20-Apr-25', voucher: 'VCH-120', desc: 'Consolidated entry', amount: 130000 },
    { date: '30-Apr-25', voucher: 'VCH-130', desc: 'Month-end accrual', amount: 64000 },
  ],
};

// ───────────────────────────── Main Page ─────────────────────────────
export function BalanceSheet() {
  const [fy, setFy] = useState('FY 2025-26');
  const [asOnDate, setAsOnDate] = useState('2025-09-30');
  const [viewType, setViewType] = useState('Detailed');
  const [viewMode, setViewMode] = useState<'list' | 'branch'>('list');
  const [compareWith, setCompareWith] = useState('Previous Year');
  const [format, setFormat] = useState<'horizontal' | 'vertical'>('horizontal');
  const [branch, setBranch] = useState('All');
  const [drilldown, setDrilldown] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500); };

  const d = BS_BY_FY[fy];
  const br = (n: number) => (branch === 'All' || n === 0 ? n : Math.round(n * BRANCH_WEIGHT[branch]));
  const vis = (list: Acc[]) => list.map((a) => ({ ...a, amount: br(a.amount) }));

  const faTotal = vis(d.fixedAssets).reduce((s, a) => s + a.amount, 0);
  const cwipTotal = vis(d.cwip).reduce((s, a) => s + a.amount, 0);
  const cbTotal = vis(d.cashBank).reduce((s, a) => s + a.amount, 0);
  const recTotal = vis(d.receivables).reduce((s, a) => s + a.amount, 0);
  const invTotal = vis(d.inventoryPrepaid).reduce((s, a) => s + a.amount, 0);
  const ncaTotal = faTotal + cwipTotal;
  const caTotal = cbTotal + recTotal + invTotal;
  const totalAssets = ncaTotal + caTotal;

  const nclTotal = vis(d.nonCurrentLiab).reduce((s, a) => s + a.amount, 0);
  const clTotal = vis(d.currentLiab).reduce((s, a) => s + a.amount, 0);
  const totalLiab = nclTotal + clTotal;

  const dq = d.equity;
  const eq = { opening: br(dq.opening), surplus: br(dq.surplus), transfers: br(dq.transfers), reserves: br(dq.reserves) };
  const closingFund = eq.opening + eq.surplus + eq.transfers;
  const totalEquity = closingFund + eq.reserves;
  const totalLE = totalLiab + totalEquity;
  const diff = totalAssets - totalLE;
  const balanced = diff === 0;

  // ── Comparative baseline ──
  const prevFyKey = FISCAL_YEARS[FISCAL_YEARS.indexOf(fy) + 1] || null;
  const groups = () => {
    const p = prevFyKey ? BS_BY_FY[prevFyKey] : null;
    return [
      { name: 'Fixed Assets (Net)', cur: faTotal, yr: p ? br(p.fixedAssets.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].fa) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].fa) : undefined },
      { name: 'Capital Work In Progress', cur: cwipTotal, yr: p ? br(p.cwip.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].cwip) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].cwip) : undefined },
      { name: 'Cash & Bank', cur: cbTotal, yr: p ? br(p.cashBank.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].cb) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].cb) : undefined },
      { name: 'Receivables', cur: recTotal, yr: p ? br(p.receivables.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].rec) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].rec) : undefined },
      { name: 'Inventory & Prepaid', cur: invTotal, yr: p ? br(p.inventoryPrepaid.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].inv) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].inv) : undefined },
      { name: 'TOTAL ASSETS', cur: totalAssets, yr: p ? br(p.fixedAssets.reduce((s, a) => s + a.amount, 0) + p.cwip.reduce((s, a) => s + a.amount, 0) + p.cashBank.reduce((s, a) => s + a.amount, 0) + p.receivables.reduce((s, a) => s + a.amount, 0) + p.inventoryPrepaid.reduce((s, a) => s + a.amount, 0)) : 0, bold: true, q: PREV_Q[fy] ? br(PREV_Q[fy].fa + PREV_Q[fy].cwip + PREV_Q[fy].cb + PREV_Q[fy].rec + PREV_Q[fy].inv) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].fa + PREV_M[fy].cwip + PREV_M[fy].cb + PREV_M[fy].rec + PREV_M[fy].inv) : undefined },
      { name: 'Non-Current Liabilities', cur: nclTotal, yr: p ? br(p.nonCurrentLiab.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].ncl) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].ncl) : undefined },
      { name: 'Current Liabilities', cur: clTotal, yr: p ? br(p.currentLiab.reduce((s, a) => s + a.amount, 0)) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].cl) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].cl) : undefined },
      { name: 'TOTAL LIABILITIES', cur: totalLiab, yr: p ? br(p.nonCurrentLiab.reduce((s, a) => s + a.amount, 0) + p.currentLiab.reduce((s, a) => s + a.amount, 0)) : 0, bold: true, q: PREV_Q[fy] ? br(PREV_Q[fy].ncl + PREV_Q[fy].cl) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].ncl + PREV_M[fy].cl) : undefined },
      { name: 'Equity / Fund Balance', cur: totalEquity, yr: p ? br(p.equity.opening + p.equity.surplus + p.equity.transfers + p.equity.reserves) : 0, q: PREV_Q[fy] ? br(PREV_Q[fy].eq) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].eq) : undefined },
      { name: 'TOTAL EQUITY', cur: totalEquity, yr: p ? br(p.equity.opening + p.equity.surplus + p.equity.transfers + p.equity.reserves) : 0, bold: true, q: PREV_Q[fy] ? br(PREV_Q[fy].eq) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].eq) : undefined },
      { name: 'TOTAL LIABILITIES + EQUITY', cur: totalLE, yr: p ? br(p.nonCurrentLiab.reduce((s, a) => s + a.amount, 0) + p.currentLiab.reduce((s, a) => s + a.amount, 0) + p.equity.opening + p.equity.surplus + p.equity.transfers + p.equity.reserves) : 0, bold: true, q: PREV_Q[fy] ? br(PREV_Q[fy].ncl + PREV_Q[fy].cl + PREV_Q[fy].eq) : undefined, m: PREV_M[fy] ? br(PREV_M[fy].ncl + PREV_M[fy].cl + PREV_M[fy].eq) : undefined },
    ];
  };
  const compRows = useMemo(() => groups().map((r) => ({
    ...r,
    base: compareWith === 'Previous Year' ? r.yr : compareWith === 'Previous Quarter' ? (r.q ?? null) : compareWith === 'Previous Month' ? (r.m ?? null) : null,
  })), [fy, compareWith, d, branch]);
  const baselineLabel = compareWith === 'Previous Year' ? (prevFyKey || '—') : compareWith === 'Previous Quarter' ? 'Previous Qtr' : 'Previous Month';

  const pctChange = (cur: number, base: number | null | undefined) =>
    base === null || base === undefined || base === 0 ? null : ((cur - base) / Math.abs(base)) * 100;

  // ── Ratios ──
  const REVENUE = br(2800000);
  const stock = (d.inventoryPrepaid.find((a) => a.name === 'Stationery Stock')?.amount || 0);
  const ratios = [
    { name: '💧 Current Ratio', formula: 'CA ÷ CL', value: `${(caTotal / clTotal).toFixed(2)} : 1`, ok: caTotal / clTotal >= 2, mid: caTotal / clTotal >= 1.5, note: caTotal / clTotal >= 2 ? '🟢 Healthy (>2 good)' : caTotal / clTotal >= 1.5 ? '🟡 Monitor' : '🔴 Warning' },
    { name: '⚡ Quick Ratio', formula: '(CA − Stock) ÷ CL', value: `${((caTotal - stock) / clTotal).toFixed(2)} : 1`, ok: (caTotal - stock) / clTotal >= 1, mid: (caTotal - stock) / clTotal >= 0.7, note: (caTotal - stock) / clTotal >= 1 ? '🟢 Healthy (>1 good)' : (caTotal - stock) / clTotal >= 0.7 ? '🟡 Monitor' : '🔴 Warning' },
    { name: '🏦 Debt to Equity', formula: 'TL ÷ Equity', value: `${(totalLiab / totalEquity).toFixed(2)} : 1`, ok: totalLiab / totalEquity < 1, mid: totalLiab / totalEquity < 2, note: totalLiab / totalEquity < 1 ? '🟢 Low Debt' : totalLiab / totalEquity < 2 ? '🟡 Moderate' : '🔴 High Debt' },
    { name: '💪 Equity Ratio', formula: 'Equity ÷ Assets', value: `${((totalEquity / totalAssets) * 100).toFixed(1)}%`, ok: totalEquity / totalAssets >= 0.5, mid: totalEquity / totalAssets >= 0.3, note: totalEquity / totalAssets >= 0.5 ? '🟢 Strong Equity' : totalEquity / totalAssets >= 0.3 ? '🟡 Moderate' : '🔴 Weak' },
    { name: '🏗️ Debt Ratio', formula: 'TL ÷ Assets', value: `${((totalLiab / totalAssets) * 100).toFixed(1)}%`, ok: totalLiab / totalAssets < 0.35, mid: totalLiab / totalAssets < 0.6, note: totalLiab / totalAssets < 0.35 ? '🟢 Safe' : totalLiab / totalAssets < 0.6 ? '🟡 Moderate' : '🔴 Risky' },
    { name: '📦 Working Capital', formula: 'CA − CL', value: `₹${(caTotal - clTotal).toLocaleString('en-IN')}`, ok: caTotal - clTotal > 0, mid: caTotal - clTotal === 0, note: caTotal - clTotal > 0 ? '🟢 Positive' : caTotal - clTotal === 0 ? '🟡 Tight' : '🔴 Negative' },
    { name: '💰 Asset Turnover', formula: 'Revenue ÷ Assets', value: `${(REVENUE / totalAssets).toFixed(2)}x`, ok: REVENUE / totalAssets >= 0.8, mid: REVENUE / totalAssets >= 0.4, note: REVENUE / totalAssets >= 0.8 ? '🟢 Efficient' : REVENUE / totalAssets >= 0.4 ? '🟡 Moderate' : '🔴 Low' },
    { name: '🏛️ Fixed Asset Ratio', formula: 'FA ÷ (L + E)', value: `${((faTotal / totalLE) * 100).toFixed(1)}%`, ok: faTotal / totalLE <= 1 && faTotal / totalLE >= 0.5, mid: faTotal / totalLE < 0.5, note: faTotal / totalLE <= 1 && faTotal / totalLE >= 0.5 ? '🟢 Good (0.5–1 ideal)' : faTotal / totalLE < 0.5 ? '🟡 Low' : '🔴 Over-invested' },
  ];

  // ── Alerts ──
  const prevEquity = prevFyKey ? br(BS_BY_FY[prevFyKey].equity.opening + BS_BY_FY[prevFyKey].equity.surplus + BS_BY_FY[prevFyKey].equity.transfers + BS_BY_FY[prevFyKey].equity.reserves) : null;
  const prevFeeRecv = prevFyKey ? br(BS_BY_FY[prevFyKey].receivables.find((a) => a.name === 'Fee Receivable')?.amount || 0) : null;
  const curFeeRecv = d.receivables.find((a) => a.name === 'Fee Receivable')?.amount || 0;
  const prevCB = prevFyKey ? br(BS_BY_FY[prevFyKey].cashBank.reduce((s, a) => s + a.amount, 0)) : null;
  const alerts = [
    balanced
      ? { icon: CheckCircle, tone: 'text-green-600 bg-green-50 border-green-200', text: `Balance Sheet is BALANCED — Assets = Liabilities + Equity (${fmt(totalAssets)})` }
      : { icon: XCircle, tone: 'text-red-600 bg-red-50 border-red-200', text: `Balance Sheet NOT BALANCED — Difference: ${fmt(Math.abs(diff))}. Check journal entries.` },
    caTotal / clTotal >= 2
      ? { icon: CheckCircle, tone: 'text-green-600 bg-green-50 border-green-200', text: `Current Ratio ${(caTotal / clTotal).toFixed(2)} — short-term obligations are comfortably covered` }
      : { icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50 border-amber-200', text: `Current Ratio ${(caTotal / clTotal).toFixed(2)} is below 2 — review current liabilities` },
    { icon: Landmark, tone: 'text-red-600 bg-red-50 border-red-200', text: 'Loan repayment of ₹1,00,000 due next month' },
    prevFeeRecv !== null && prevFeeRecv > 0 && curFeeRecv / prevFeeRecv > 1.2
      ? { icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50 border-amber-200', text: `Fee receivable up ${(((curFeeRecv - prevFeeRecv) / prevFeeRecv) * 100).toFixed(0)}% vs last year — many students pending` }
      : { icon: CheckCircle, tone: 'text-green-600 bg-green-50 border-green-200', text: 'Fee receivable is under control vs last year' },
    prevEquity !== null
      ? { icon: TrendingUp, tone: 'text-green-600 bg-green-50 border-green-200', text: `Equity/Fund Balance grew ${(((totalEquity - prevEquity) / prevEquity) * 100).toFixed(0)}% vs ${prevFyKey}` }
      : { icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50 border-amber-200', text: 'No prior-year data for equity comparison' },
    prevCB !== null && cbTotal < prevCB
      ? { icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50 border-amber-200', text: `Cash & Bank decreased ${(((prevCB - cbTotal) / prevCB) * 100).toFixed(0)}% vs last year — monitor cash flow` }
      : { icon: CheckCircle, tone: 'text-green-600 bg-green-50 border-green-200', text: 'Cash & Bank position improved vs last year' },
    { icon: CalendarDays, tone: 'text-blue-600 bg-blue-50 border-blue-200', text: `Balance Sheet generated as on ${fmtDate(asOnDate)} — schedule monthly generation` },
    { icon: AlertTriangle, tone: 'text-red-600 bg-red-50 border-red-200', text: 'Accounts Payable overdue by 30 days — clear immediately' },
  ];

  const changeFy = (v: string) => {
    setFy(v);
    setAsOnDate(BS_BY_FY[v].asOn);
    showToast(`Balance sheet loaded for ${v} (as on ${fmtDate(BS_BY_FY[v].asOn)}).`);
  };
  const reset = () => {
    setAsOnDate(BS_BY_FY[fy].asOn); setViewType('Detailed'); setCompareWith('Previous Year');
    setFormat('horizontal');
    showToast('Filters reset to defaults.');
  };
  const doExport = (kind: string) => {
    if (kind === 'print') { window.print(); return; }
    if (kind === 'pdf') { showToast('Opening print dialog — choose "Save as PDF".'); setTimeout(() => window.print(), 400); return; }
    const header = 'Section,Particulars,Amount (₹)\n';
    const rows: string[] = [];
    rows.push(['Assets', 'Fixed Assets (Net)', faTotal].join(','));
    rows.push(['Assets', 'Capital Work In Progress', cwipTotal].join(','));
    rows.push(['Assets', 'Cash & Bank', cbTotal].join(','));
    rows.push(['Assets', 'Receivables', recTotal].join(','));
    rows.push(['Assets', 'Inventory & Prepaid', invTotal].join(','));
    rows.push(['Assets', 'TOTAL ASSETS', totalAssets].join(','));
    rows.push(['Liabilities', 'Non-Current Liabilities', nclTotal].join(','));
    rows.push(['Liabilities', 'Current Liabilities', clTotal].join(','));
    rows.push(['Liabilities', 'TOTAL LIABILITIES', totalLiab].join(','));
    rows.push(['Equity', 'Equity / Fund Balance', totalEquity].join(','));
    rows.push(['Check', 'TOTAL LIABILITIES + EQUITY', totalLE].join(','));
    const blob = new Blob([header + rows.join('\n')], { type: kind === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance-sheet-${fy.replace(/\s/g, '-')}.${kind === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Balance sheet exported as ${kind.toUpperCase()}.`);
  };
  const exportDrilldown = (name: string) => {
    const rows = DRILLDOWN_TXNS[name] || DRILLDOWN_TXNS.default;
    const header = 'Date,Voucher No,Description,Balance (₹)\n';
    const body = rows.map((t) => [t.date, t.voucher, `"${t.desc}"`, t.amount].join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `drilldown-${name.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Drilldown for ${name} exported.`);
  };

  function fmt(n: number) { return `₹${Math.abs(n).toLocaleString('en-IN')}`; }
  function fmtDate(v: string) {
    const dt = new Date(v);
    return isNaN(dt.getTime()) ? v : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ── Reusable statement line ──
  const Line = ({ label, amount, sub, onClick, strong }: { label: string; amount?: number; sub?: string; onClick?: () => void; strong?: boolean }) => (
    <div className={`flex items-center justify-between px-4 py-1.5 border-b border-gray-100 ${strong ? 'font-bold bg-gray-50/70' : ''}`}>
      <span className={`text-sm ${onClick ? 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer' : 'text-gray-800'}`} onClick={onClick}>
        {label}{sub && <span className="block text-[11px] text-gray-400 font-normal">{sub}</span>}
      </span>
      <span className={`text-sm tabular-nums ${strong ? 'text-gray-900' : 'text-gray-700'}`}>{amount !== undefined ? fmt(amount) : ''}</span>
    </div>
  );
  const GroupHead = ({ label, hint }: { label: string; hint?: string }) => (
    <div className="px-4 py-2 bg-blue-50/60 border-b border-gray-200">
      <span className="text-xs font-bold uppercase tracking-wide text-blue-800">{label}</span>
      {hint && <span className="block text-[10px] text-gray-400">{hint}</span>}
    </div>
  );
  const TotalRow = ({ label, amount, tone }: { label: string; amount: number; tone: string }) => (
    <div className={`flex items-center justify-between px-4 py-2.5 font-bold border-t-2 ${tone}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm tabular-nums">{fmt(amount)}</span>
    </div>
  );

  const detailed = viewType === 'Detailed';
  const faGroup = () => (
    <>
      <GroupHead label="📁 Fixed Assets" hint="Shown Net of Depreciation" />
      {faTotal > 0 && d.fixedAssets.map((a) => (
        detailed ? (
          <Line key={a.name} label={a.name} amount={a.amount} sub={`Gross ${fmt(a.gross || 0)} − Depreciation ${fmt(a.dep || 0)}`} onClick={() => setDrilldown(a.name)} />
        ) : null
      ))}
      <Line label="Total Fixed Assets" amount={faTotal} strong />
      <GroupHead label="📁 Capital Work In Progress" />
      {detailed && vis(d.cwip).map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
      <Line label="Total CWIP" amount={cwipTotal} strong />
      <TotalRow label="💰 TOTAL NON-CURRENT ASSETS" amount={ncaTotal} tone="bg-blue-50 border-blue-200 text-blue-900" />
    </>
  );
  const caGroup = () => (
    <>
      <GroupHead label="📁 Cash & Bank" />
      {detailed && vis(d.cashBank).map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
      <Line label="Total Cash & Bank" amount={cbTotal} strong />
      <GroupHead label="📁 Receivables" />
      {detailed && vis(d.receivables).map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
      <Line label="Total Receivables" amount={recTotal} strong />
      <GroupHead label="📁 Inventory / Prepaid" />
      {detailed && vis(d.inventoryPrepaid).map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
      <Line label="Total Inventory & Prepaid" amount={invTotal} strong />
      <TotalRow label="💰 TOTAL CURRENT ASSETS" amount={caTotal} tone="bg-emerald-50 border-emerald-200 text-emerald-900" />
    </>
  );

  // ── Branch-wise balance sheets (each branch = its share of every account, same rounding as the branch filter) ──
  const bsBranch = (b: string) => {
    const w = BRANCH_WEIGHT[b] || 0;
    const sc = (n: number) => (n === 0 ? 0 : Math.round(n * w));
    const lst = (list: Acc[]) => list.map((a) => ({ ...a, amount: sc(a.amount) }));
    const sum = (list: Acc[]) => list.reduce((t, a) => t + a.amount, 0);
    const assetGroups: [string, Acc[]][] = [
      ['Fixed Assets (Net)', lst(d.fixedAssets)], ['Capital Work In Progress', lst(d.cwip)], ['Cash & Bank', lst(d.cashBank)],
      ['Receivables', lst(d.receivables)], ['Inventory & Prepaid', lst(d.inventoryPrepaid)],
    ];
    const liabGroups: [string, Acc[]][] = [['Non-Current Liabilities', lst(d.nonCurrentLiab)], ['Current Liabilities', lst(d.currentLiab)]];
    const e = { opening: sc(dq.opening), surplus: sc(dq.surplus), transfers: sc(dq.transfers), reserves: sc(dq.reserves) };
    const assets = assetGroups.reduce((t, [, l]) => t + sum(l), 0);
    const liab = liabGroups.reduce((t, [, l]) => t + sum(l), 0);
    const equity = e.opening + e.surplus + e.transfers + e.reserves;
    return { assetGroups, liabGroups, e, sum, assets, liab, equity, le: liab + equity, diff: assets - (liab + equity) };
  };

  const kpiCards = [
    { icon: Wallet, label: 'Total Assets', value: fmt(totalAssets), delta: pctChange(totalAssets, compRows[5].base), color: 'bg-blue-50 text-blue-600' },
    { icon: AlertTriangle, label: 'Total Liabilities', value: fmt(totalLiab), delta: pctChange(totalLiab, compareWith === 'Previous Year' ? compRows[8].base : compRows[8].base), color: 'bg-red-50 text-red-600' },
    { icon: Coins, label: 'Total Equity / Fund', value: fmt(totalEquity), delta: pctChange(totalEquity, compRows[9].base), color: 'bg-violet-50 text-violet-600' },
    { icon: TrendingUp, label: 'Net Worth / Fund Balance', value: fmt(totalEquity), delta: null, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ── Section 1: Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" /> Balance Sheet
          </h1>
          <p className="text-sm text-gray-500 mt-1">Financial position of the school — Assets = Liabilities + Equity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select value={fy} onChange={(e) => changeFy(e.target.value)} options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} />
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

      {/* ── Section 2: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpiCards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${c.color}`}><c.icon className="w-5 h-5" /></div>
              {c.delta !== null && (
                <span className={`text-xs font-semibold flex items-center gap-1 ${c.delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {c.delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {c.delta >= 0 ? '+' : ''}{c.delta.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">{c.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{c.value}</p>
          </Card>
        ))}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${balanced ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}><Scale className="w-5 h-5" /></div>
            <Badge variant={balanced ? 'success' : 'danger'}>{balanced ? '✅ Balanced' : '❌ Not Balanced'}</Badge>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">Balance Check</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">Assets = L + E {balanced ? '✅' : `(Diff ${fmt(Math.abs(diff))})`}</p>
        </Card>
      </div>

      {/* ── Section 3: Filters & Controls ── */}
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📅 As On Date</label>
            <input type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <Select label="Financial Year" value={fy} onChange={(e) => changeFy(e.target.value)} options={FISCAL_YEARS.map((y) => ({ value: y, label: y }))} />
          <Select label="Branch" value={branch} onChange={(e) => setBranch(e.target.value)}
            options={BRANCHES.map((v) => ({ value: v, label: v === 'All' ? 'All Branches' : v }))} />
          <Select label="Compare With" value={compareWith} onChange={(e) => setCompareWith(e.target.value)}
            options={['Previous Year', 'Previous Quarter', 'Previous Month', 'None'].map((v) => ({ value: v, label: v }))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
            <div className="flex gap-4">
              {['Summary', 'Detailed'].map((v) => (
                <label key={v} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="bsView" checked={viewType === v} onChange={() => setViewType(v)} className="text-blue-600 focus:ring-blue-500" />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="bsFmt" checked={format === 'horizontal'} onChange={() => setFormat('horizontal')} className="text-blue-600 focus:ring-blue-500" />
                Horizontal (T)
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="bsFmt" checked={format === 'vertical'} onChange={() => setFormat('vertical')} className="text-blue-600 focus:ring-blue-500" />
                Vertical
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-100">
          <Button variant="primary" onClick={() => showToast(`Balance sheet generated as on ${fmtDate(asOnDate)} (${fy}).`)}>
            <Eye className="w-4 h-4 mr-2" /> Generate Report
          </Button>
          <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
          <Button variant="outline" onClick={() => doExport('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF</Button>
          <Button variant="outline" onClick={() => doExport('excel')}><FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Excel</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        </div>
      </Card>

      {/* ── View toggle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{viewMode === 'list' ? 'Consolidated balance sheet for the selected branch filter' : 'Balance sheet divided into branch-wise sections'}</p>
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
      {/* ── Section 4: Main Statement ── */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 text-center border-b border-gray-200 bg-blue-50/40">
          <h3 className="font-bold text-gray-900">EduManager School — Balance Sheet</h3>
          <p className="text-xs text-gray-500 mt-0.5">As on: {fmtDate(asOnDate)} · {fy} · Branch: {branch === 'All' ? 'All Branches (Consolidated)' : branch} · {viewType} · {format === 'horizontal' ? 'Horizontal (T-Format)' : 'Vertical Format'}</p>
        </div>

        {format === 'horizontal' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <div>
              <div className="px-4 py-2.5 bg-blue-50 font-bold text-sm text-blue-800 border-b border-gray-200">💰 ASSETS <span className="block text-[10px] font-normal text-gray-500">(What School OWNS)</span></div>
              <GroupHead label="A. NON-CURRENT ASSETS" hint="Long-term assets held > 1 year" />
              {faGroup()}
              <GroupHead label="B. CURRENT ASSETS" hint="Short-term assets usable < 1 year" />
              {caGroup()}
              <TotalRow label="💰 TOTAL ASSETS (A + B)" amount={totalAssets} tone="bg-blue-100 border-blue-300 text-blue-900" />
            </div>
            <div>
              <div className="px-4 py-2.5 bg-red-50 font-bold text-sm text-red-800 border-b border-gray-200">🔴 LIABILITIES &amp; 🟣 EQUITY <span className="block text-[10px] font-normal text-gray-500">(What School OWES + IS WORTH)</span></div>
              <GroupHead label="C. NON-CURRENT LIABILITIES" hint="Long-term debts due > 1 year" />
              {detailed && vis(d.nonCurrentLiab).map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
              <Line label="Total Non-Current Liabilities" amount={nclTotal} strong />
              <GroupHead label="D. CURRENT LIABILITIES" hint="Short-term debts due < 1 year" />
              {detailed && vis(d.currentLiab).map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
              <Line label="Total Current Liabilities" amount={clTotal} strong />
              <TotalRow label="🔴 TOTAL LIABILITIES (C + D)" amount={totalLiab} tone="bg-red-50 border-red-200 text-red-900" />
              <GroupHead label="E. EQUITY / FUND BALANCE" hint="School's own financial worth" />
              <Line label="Opening Fund Balance" amount={eq.opening} onClick={() => setDrilldown('default')} />
              <Line label="Add: Net Surplus / Profit" amount={eq.surplus} onClick={() => setDrilldown('default')} />
              <Line label="Less: Drawings / Transfers" amount={eq.transfers} onClick={() => setDrilldown('default')} />
              <Line label="Closing Fund Balance" amount={closingFund} strong />
              <Line label="Reserves & Surplus" amount={eq.reserves} onClick={() => setDrilldown('default')} />
              <TotalRow label="🟣 TOTAL EQUITY / FUND BALANCE (E)" amount={totalEquity} tone="bg-violet-50 border-violet-200 text-violet-900" />
              <TotalRow label="🔴🟣 TOTAL LIABILITIES + EQUITY (C+D+E)" amount={totalLE} tone="bg-gray-100 border-gray-300 text-gray-900" />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider">Particulars</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right w-44">Amount</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right w-44">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-blue-50/60"><td colSpan={3} className="px-4 py-2 text-xs font-bold uppercase text-blue-800">💰 A. NON-CURRENT ASSETS</td></tr>
                {detailed && d.fixedAssets.map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>
                      {a.name} <span className="text-[11px] text-gray-400">(Gross {fmt(a.gross || 0)} − Dep {fmt(a.dep || 0)})</span>
                    </td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td>
                    <td />
                  </tr>
                ))}
                {detailed && vis(d.cwip).map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>{a.name}</td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td>
                    <td />
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50/70">
                  <td className="px-4 py-2">Non-Current Assets</td><td /><td className="px-4 py-2 text-right tabular-nums">{fmt(ncaTotal)}</td>
                </tr>
                <tr className="bg-emerald-50/60"><td colSpan={3} className="px-4 py-2 text-xs font-bold uppercase text-emerald-800">💰 B. CURRENT ASSETS</td></tr>
                {detailed && vis(d.cashBank).map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>{a.name}</td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td><td />
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50/50"><td className="px-4 py-1.5 pl-8">Cash & Bank</td><td /><td className="px-4 py-1.5 text-right tabular-nums">{fmt(cbTotal)}</td></tr>
                {detailed && vis(d.receivables).map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>{a.name}</td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td><td />
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50/50"><td className="px-4 py-1.5 pl-8">Receivables</td><td /><td className="px-4 py-1.5 text-right tabular-nums">{fmt(recTotal)}</td></tr>
                {detailed && vis(d.inventoryPrepaid).map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>{a.name}</td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td><td />
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50/50"><td className="px-4 py-1.5 pl-8">Inventory & Prepaid</td><td /><td className="px-4 py-1.5 text-right tabular-nums">{fmt(invTotal)}</td></tr>
                <tr className="font-bold bg-gray-50/70">
                  <td className="px-4 py-2">Current Assets</td><td /><td className="px-4 py-2 text-right tabular-nums">{fmt(caTotal)}</td>
                </tr>
                <tr className="font-bold bg-blue-100">
                  <td className="px-4 py-2.5 text-blue-900">💰 TOTAL ASSETS (A + B)</td><td /><td className="px-4 py-2.5 text-right tabular-nums text-blue-900">{fmt(totalAssets)}</td>
                </tr>

                <tr className="bg-red-50/60"><td colSpan={3} className="px-4 py-2 text-xs font-bold uppercase text-red-800">🔴 C. NON-CURRENT LIABILITIES</td></tr>
                {detailed && vis(d.nonCurrentLiab).map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>{a.name}</td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td><td />
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50/70"><td className="px-4 py-2">Non-Current Liabilities</td><td /><td className="px-4 py-2 text-right tabular-nums">{fmt(nclTotal)}</td></tr>
                <tr className="bg-amber-50/60"><td colSpan={3} className="px-4 py-2 text-xs font-bold uppercase text-amber-800">🔴 D. CURRENT LIABILITIES</td></tr>
                {detailed && vis(d.currentLiab).map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-1.5 text-blue-600 hover:underline cursor-pointer pl-8" onClick={() => setDrilldown(a.name)}>{a.name}</td>
                    <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(a.amount)}</td><td />
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50/70"><td className="px-4 py-2">Current Liabilities</td><td /><td className="px-4 py-2 text-right tabular-nums">{fmt(clTotal)}</td></tr>
                <tr className="font-bold bg-red-100">
                  <td className="px-4 py-2.5 text-red-900">🔴 TOTAL LIABILITIES (C + D)</td><td /><td className="px-4 py-2.5 text-right tabular-nums text-red-900">{fmt(totalLiab)}</td>
                </tr>
                <tr className="bg-violet-50/60"><td colSpan={3} className="px-4 py-2 text-xs font-bold uppercase text-violet-800">🟣 E. EQUITY / FUND BALANCE</td></tr>
                <tr><td className="px-4 py-1.5 pl-8 text-gray-700">Opening Fund Balance</td><td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(eq.opening)}</td><td /></tr>
                <tr><td className="px-4 py-1.5 pl-8 text-gray-700">Add: Net Surplus / Profit</td><td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(eq.surplus)}</td><td /></tr>
                <tr><td className="px-4 py-1.5 pl-8 text-gray-700">Less: Transfers / Drawings</td><td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(eq.transfers)}</td><td /></tr>
                <tr className="font-semibold bg-gray-50/50"><td className="px-4 py-1.5 pl-8">Closing Fund Balance</td><td /><td className="px-4 py-1.5 text-right tabular-nums">{fmt(closingFund)}</td></tr>
                <tr><td className="px-4 py-1.5 pl-8 text-gray-700">Reserves & Surplus</td><td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{fmt(eq.reserves)}</td><td /></tr>
                <tr className="font-bold bg-violet-100">
                  <td className="px-4 py-2.5 text-violet-900">🟣 TOTAL EQUITY / FUND BALANCE (E)</td><td /><td className="px-4 py-2.5 text-right tabular-nums text-violet-900">{fmt(totalEquity)}</td>
                </tr>
                <tr className="font-bold bg-gray-100 border-t-2 border-gray-300">
                  <td className="px-4 py-2.5">🔴🟣 TOTAL LIABILITIES + EQUITY (C+D+E)</td><td /><td className="px-4 py-2.5 text-right tabular-nums">{fmt(totalLE)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ── Section 5: Balance Verification ── */}
        <div className={`px-6 py-4 border-t-2 text-center ${balanced ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <p className={`font-bold text-lg ${balanced ? 'text-green-800' : 'text-red-800'}`}>
            ⚖️ BALANCE CHECK: {fmt(totalAssets)} {balanced ? '=' : '≠'} {fmt(totalLE)} {balanced ? '→ ✅ BALANCE SHEET IS BALANCED ✅' : `→ ❌ DIFFERENCE: ${fmt(Math.abs(diff))} — check journal entries`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total Assets {fmt(totalAssets)} = Total Liabilities {fmt(totalLiab)} + Total Equity {fmt(totalEquity)}
          </p>
        </div>
      </Card>

        </>
      ) : (
        <div className="space-y-4">
          {(branch === 'All' ? BRANCHES.slice(1) : [branch]).map((b) => {
            const x = bsBranch(b);
            const ok = x.diff === 0;
            return (
              <Card key={b} className="overflow-hidden">
                <div className="px-5 py-3 bg-blue-50/40 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> {b} — Balance Sheet as on {fmtDate(asOnDate)}</span>
                  <span className="text-xs text-gray-600 flex flex-wrap items-center gap-3">
                    <span>Assets <b>{fmt(x.assets)}</b></span>
                    <span>Liabilities <b>{fmt(x.liab)}</b></span>
                    <span>Equity <b>{fmt(x.equity)}</b></span>
                    <Badge variant={ok ? 'success' : 'danger'}>{ok ? '✅ Balanced' : `❌ Diff ${fmt(Math.abs(x.diff))}`}</Badge>
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                  <div>
                    <div className="px-4 py-2 bg-blue-50 font-bold text-xs text-blue-800 border-b border-gray-200">💰 ASSETS</div>
                    {x.assetGroups.map(([label, list]) => (
                      <React.Fragment key={label}>
                        {detailed && list.map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
                        <Line label={`Total ${label}`} amount={x.sum(list)} strong />
                      </React.Fragment>
                    ))}
                    <TotalRow label="💰 TOTAL ASSETS" amount={x.assets} tone="bg-blue-100 border-blue-300 text-blue-900" />
                  </div>
                  <div>
                    <div className="px-4 py-2 bg-red-50 font-bold text-xs text-red-800 border-b border-gray-200">🔴 LIABILITIES &amp; 🟣 EQUITY</div>
                    {x.liabGroups.map(([label, list]) => (
                      <React.Fragment key={label}>
                        {detailed && list.map((a) => <Line key={a.name} label={a.name} amount={a.amount} onClick={() => setDrilldown(a.name)} />)}
                        <Line label={`Total ${label}`} amount={x.sum(list)} strong />
                      </React.Fragment>
                    ))}
                    <TotalRow label="🔴 TOTAL LIABILITIES" amount={x.liab} tone="bg-red-50 border-red-200 text-red-900" />
                    <Line label="Opening Fund Balance" amount={x.e.opening} />
                    <Line label="Add: Net Surplus / Profit" amount={x.e.surplus} />
                    <Line label="Less: Drawings / Transfers" amount={x.e.transfers} />
                    <Line label="Reserves & Surplus" amount={x.e.reserves} />
                    <TotalRow label="🟣 TOTAL EQUITY / FUND BALANCE" amount={x.equity} tone="bg-violet-50 border-violet-200 text-violet-900" />
                    <TotalRow label="🔴🟣 TOTAL LIABILITIES + EQUITY" amount={x.le} tone="bg-gray-100 border-gray-300 text-gray-900" />
                  </div>
                </div>
                <div className={`px-5 py-2.5 text-center text-sm font-bold border-t-2 ${ok ? 'bg-green-50 text-green-800 border-green-300' : 'bg-red-50 text-red-800 border-red-300'}`}>
                  ⚖️ {fmt(x.assets)} {ok ? '=' : '≠'} {fmt(x.le)} {ok ? '→ ✅ BALANCED' : `→ ❌ DIFFERENCE ${fmt(Math.abs(x.diff))}`}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Section 7: Comparative Analysis ── */}
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
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">As On {fmtDate(asOnDate)}</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">{baselineLabel}</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">Variance</th>
                  <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">Variance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {compRows.map((r) => {
                  const variance = r.base !== null && r.base !== undefined ? r.cur - r.base : null;
                  const pct = variance !== null && r.base ? (variance / Math.abs(r.base)) * 100 : null;
                  return (
                    <tr key={r.name} className={`hover:bg-gray-50 ${r.bold ? 'font-bold bg-gray-50/70' : ''}`}>
                      <td className="px-4 py-2.5 text-gray-800">{r.bold ? '' : '▫ '}{r.name}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{fmt(r.cur)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{r.base !== null && r.base !== undefined ? fmt(r.base) : '—'}</td>
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

      {/* ── Section 8: Financial Ratios ── */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">📊 Financial Health Indicators</h3>
          <p className="text-xs text-gray-400 mt-0.5">Auto-calculated from this balance sheet · 🟢 Healthy · 🟡 Monitor · 🔴 Action needed</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider">Ratio</th>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider">Formula</th>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right">Value</th>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ratios.map((r) => (
                <tr key={r.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{r.name}</td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{r.formula}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900 tabular-nums">{r.value}</td>
                  <td className="px-4 py-2.5 text-center">
                    <Badge variant={r.ok ? 'success' : r.mid ? 'warning' : 'danger'}>{r.note}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Section 9: Alerts ── */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> Financial Alerts &amp; Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${a.tone}`}>
              <a.icon className="w-4 h-4 shrink-0" />
              <span className="text-gray-700">{a.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Section 11: Footer ── */}
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Generated On: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · Logged in as: Mr. Sharma (Accountant) · As On Date: {fmtDate(asOnDate)} · {fy} · Branch: {branch === 'All' ? 'All Branches' : branch}</span>
        <span>🏫 EduManager School · © 2026</span>
      </div>

      {/* ── Section 8B: Drilldown Modal ── */}
      {drilldown && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-600" /> Drilldown: {drilldown === 'default' ? 'Fund Balance' : drilldown}</h3>
                <p className="text-xs text-gray-500">As on {fmtDate(asOnDate)} · {fy}</p>
              </div>
              <button onClick={() => setDrilldown(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">#</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Date</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Voucher No.</th>
                    <th className="px-3 py-2 text-left text-xs uppercase font-semibold text-gray-600">Description</th>
                    <th className="px-3 py-2 text-right text-xs uppercase font-semibold text-gray-600">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(DRILLDOWN_TXNS[drilldown] || DRILLDOWN_TXNS.default).map((t, i) => (
                    <tr key={t.voucher + i} className="hover:bg-gray-50">
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
                    <td className="px-3 py-2.5 text-right text-blue-700">{fmt((DRILLDOWN_TXNS[drilldown] || DRILLDOWN_TXNS.default).reduce((s, t) => s + t.amount, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => exportDrilldown(drilldown)}><FileDown className="w-4 h-4 mr-2" /> Export</Button>
              <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button>
              <Button variant="primary" onClick={() => setDrilldown(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
