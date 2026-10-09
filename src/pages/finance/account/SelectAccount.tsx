import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Printer,
  Mail,
  FileText,
  Calendar,
  ArrowRight } from
'lucide-react';
// --- Types ---
interface LedgerEntry {
  id: string;
  date: string;
  voucherType: string;
  voucherNo: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number; // Running Balance
}
interface AccountSummary {
  openingBalance: number;
  openingType: 'Dr' | 'Cr';
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  closingType: 'Dr' | 'Cr';
}
// --- Mock Data ---
const MOCK_TRANSACTIONS: LedgerEntry[] = [
{
  id: '1',
  date: '2024-04-01',
  voucherType: 'Opening',
  voucherNo: '-',
  narration: 'Opening Balance b/f',
  debit: 0,
  credit: 0,
  balance: 150000
},
{
  id: '2',
  date: '2024-04-05',
  voucherType: 'Receipt',
  voucherNo: 'RCP-001',
  narration: 'Fees received from Class 10 students',
  debit: 0,
  credit: 50000,
  balance: 200000
},
{
  id: '3',
  date: '2024-04-10',
  voucherType: 'Payment',
  voucherNo: 'PAY-004',
  narration: 'Electricity Bill Payment - March',
  debit: 12000,
  credit: 0,
  balance: 188000
},
{
  id: '4',
  date: '2024-04-15',
  voucherType: 'Journal',
  voucherNo: 'JRN-012',
  narration: 'Bank Charges correction',
  debit: 500,
  credit: 0,
  balance: 187500
},
{
  id: '5',
  date: '2024-04-20',
  voucherType: 'Receipt',
  voucherNo: 'RCP-055',
  narration: 'Hostel Fees Collection',
  debit: 0,
  credit: 25000,
  balance: 212500
}];

const MOCK_SUMMARY: AccountSummary = {
  openingBalance: 150000,
  openingType: 'Cr',
  totalDebit: 12500,
  totalCredit: 75000,
  closingBalance: 212500,
  closingType: 'Cr'
};
export function SelectAccount() {
  // --- State ---
  const [selectedAccount, setSelectedAccount] = useState('hdfc_bank');
  const [fromDate, setFromDate] = useState('2024-04-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  // --- Handlers ---
  const handleShowStatement = () => {
    setIsLoading(true);
    // Simulate API Fetch
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setSummary(MOCK_SUMMARY);
      setIsLoading(false);
    }, 800);
  };
  // --- Columns ---
  const columns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: LedgerEntry) =>
    <span className="text-gray-600 font-medium">{row.date}</span>

  },
  {
    key: 'voucher',
    header: 'Voucher',
    render: (row: LedgerEntry) =>
    <div>
          <div className="text-xs font-semibold text-gray-500 uppercase">
            {row.voucherType}
          </div>
          <a
        href="#"
        className="text-sm font-bold text-blue-600 hover:underline">

            {row.voucherNo}
          </a>
        </div>

  },
  {
    key: 'particulars',
    header: 'Particulars',
    render: (row: LedgerEntry) =>
    <span className="text-sm text-gray-800">{row.narration}</span>

  },
  {
    key: 'debit',
    header: 'Debit (Dr)',
    render: (row: LedgerEntry) =>
    row.debit > 0 ?
    <span className="font-mono text-red-600">
            ₹{row.debit.toLocaleString()}
          </span> :

    '-'

  },
  {
    key: 'credit',
    header: 'Credit (Cr)',
    render: (row: LedgerEntry) =>
    row.credit > 0 ?
    <span className="font-mono text-green-600">
            ₹{row.credit.toLocaleString()}
          </span> :

    '-'

  },
  {
    key: 'balance',
    header: 'Balance',
    render: (row: LedgerEntry) =>
    <span className="font-mono font-bold text-gray-900">
          ₹{row.balance.toLocaleString()}
        </span>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Ledger Statement
          </h1>
          <p className="text-sm text-gray-500">
            View detailed transaction history for any account ledger.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* SECTION A: Search & Selection */}
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-1">
              <Select
                label="Select Account Ledger"
                placeholder="Search Account Name..."
                options={[
                {
                  value: 'hdfc_bank',
                  label: 'HDFC Bank - Main A/c'
                },
                {
                  value: 'cash_main',
                  label: 'Cash in Hand'
                },
                {
                  value: 'tuition_fee',
                  label: 'Tuition Fee Income'
                },
                {
                  value: 'elec_exp',
                  label: 'Electricity Expense'
                }]
                }
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)} />

            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)} />

              <Input
                type="date"
                label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)} />

            </div>

            <div className="lg:col-span-1">
              <Button
                variant="primary"
                className="w-full h-10"
                onClick={handleShowStatement}
                disabled={isLoading}>

                {isLoading ? 'Loading...' : 'Show Statement'}
              </Button>
            </div>
          </div>
        </Card>

        {summary &&
        <>
            {/* SECTION B: Account Summary (Sticky) */}
            <div className="sticky top-0 z-10 bg-white p-4 rounded-lg shadow-md border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 animate-in slide-in-from-top-4">
              <div className="px-4 first:pl-0">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Opening Balance
                </p>
                <p className="text-lg font-mono font-medium text-gray-800 mt-1">
                  ₹{summary.openingBalance.toLocaleString()}{' '}
                  <span className="text-xs text-gray-400">
                    {summary.openingType}
                  </span>
                </p>
              </div>
              <div className="px-4">
                <p className="text-xs font-semibold text-red-500 uppercase">
                  Total Debit
                </p>
                <p className="text-lg font-mono font-bold text-red-600 mt-1">
                  ₹{summary.totalDebit.toLocaleString()}
                </p>
              </div>
              <div className="px-4">
                <p className="text-xs font-semibold text-green-500 uppercase">
                  Total Credit
                </p>
                <p className="text-lg font-mono font-bold text-green-600 mt-1">
                  ₹{summary.totalCredit.toLocaleString()}
                </p>
              </div>
              <div className="px-4 bg-blue-50 rounded-r-lg -my-4 py-4 flex flex-col justify-center">
                <p className="text-xs font-bold text-blue-600 uppercase">
                  Closing Balance
                </p>
                <p className="text-xl font-mono font-black text-blue-800 mt-1">
                  ₹{summary.closingBalance.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-blue-600">
                    {summary.closingType}
                  </span>
                </p>
              </div>
            </div>

            {/* SECTION C: Transaction Grid */}
            <Card className="p-0 border-gray-200 min-h-[400px]">
              <Table columns={columns} data={transactions} />

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" /> Email
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" /> Print PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Export Excel
                </Button>
              </div>
            </Card>
          </>
        }
      </div>
    </div>);

}