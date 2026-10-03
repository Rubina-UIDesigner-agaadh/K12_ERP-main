import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Banknote,
  Landmark,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  History,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Activity,
  Building2,
  ChevronDown,
  Check,
  X } from
'lucide-react';
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

export function AccountSummaryDashboard() {
  const [filter, setFilter] = useState({
    year: '2023-24'
  });
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
  // Mock Data for KPI Indicators
  const liquidityIndicators = [
  {
    title: 'Cash in Hand',
    value: '₹4,25,000',
    subtitle: 'Sum of all Cash Ledgers',
    icon: <Banknote className="w-6 h-6 text-green-600" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Bank Balance',
    value: '₹82,40,000',
    subtitle: 'Active Bank Accounts',
    icon: <Landmark className="w-6 h-6 text-blue-600" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Total Receivables',
    value: '₹12,50,000',
    subtitle: 'Fees & Other Due Income',
    icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Total Payables',
    value: '₹3,15,000',
    subtitle: 'Vendor & Utility Dues',
    icon: <TrendingDown className="w-6 h-6 text-red-600" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }];

  // Mock Data for Recent Activity
  const recentTransactions = [
  {
    id: '1',
    date: '2024-03-25',
    account: 'HDFC Main Account',
    type: 'Credit',
    amount: 50000,
    user: 'S. Rawat'
  },
  {
    id: '2',
    date: '2024-03-25',
    account: 'Petty Cash',
    type: 'Debit',
    amount: 1200,
    user: 'Admin'
  },
  {
    id: '3',
    date: '2024-03-24',
    account: 'Salary Payable',
    type: 'Debit',
    amount: 450000,
    user: 'Accounts Head'
  },
  {
    id: '4',
    date: '2024-03-24',
    account: 'Student Fee Ledger',
    type: 'Credit',
    amount: 15000,
    user: 'S. Rawat'
  },
  {
    id: '5',
    date: '2024-03-23',
    account: 'Electricity Ledger',
    type: 'Debit',
    amount: 8500,
    user: 'Admin'
  }];

  const columns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: any) =>
    <span className="text-xs font-medium text-gray-500">{row.date}</span>

  },
  {
    key: 'account',
    header: 'Account Ledger',
    render: (row: any) =>
    <span className="text-sm font-bold text-gray-900">{row.account}</span>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: any) =>
    <Badge
      variant={row.type === 'Credit' ? 'success' : 'danger'}
      className="text-[10px] uppercase">

          {row.type}
        </Badge>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: any) =>
    <span
      className={`text-sm font-black ${row.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>

          ₹{row.amount.toLocaleString()}
        </span>

  },
  {
    key: 'user',
    header: 'Handled By',
    render: (row: any) =>
    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
          <User className="w-3 h-3" /> {row.user}
        </div>

  }];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header & Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Account Summary <Activity className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500 uppercase font-bold tracking-widest opacity-60">
            Financial Health Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={[
            {
              label: 'FY 2023-24',
              value: '2023-24'
            },
            {
              label: 'FY 2024-25',
              value: '2024-25'
            }]
            }
            placeholder="Select Year"
            className="w-40" />

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
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export Summary
          </Button>
        </div>
      </div>

      {/* Branch Tags */}
      {!isAllSelected && selectedBranches.length > 0 &&
      <div className="flex flex-wrap gap-2 mb-2">
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

      {/* Zone 1: Key Liquidity Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {liquidityIndicators.map((item, idx) =>
        <Card
          key={idx}
          className="p-6 relative overflow-hidden group hover:shadow-xl transition-all border-none shadow-md ring-1 ring-gray-100">

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${item.bgColor}`}>
                {item.icon}
              </div>
              <div
              className={`flex items-center text-xs font-bold ${idx % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>

                {idx % 2 === 0 ?
              <ArrowUpRight className="w-4 h-4" /> :

              <ArrowDownRight className="w-4 h-4" />
              }
                4.2%
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {item.value}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                {item.title}
              </p>
              <p className="text-[10px] text-gray-400 italic mt-2">
                {item.subtitle}
              </p>
            </div>
            <div
            className={`absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 ${item.color}`}>

              {item.icon}
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Zone 2: Income vs Expense (Bar Chart Comparison) */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="p-6 h-full border-none shadow-md ring-1 ring-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Monthly Cash Flow Analysis
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                  <div className="w-3 h-3 bg-indigo-600 rounded-sm" /> Income
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                  <div className="w-3 h-3 bg-slate-300 rounded-sm" /> Expense
                </div>
              </div>
            </div>

            {/* Mock Bar Chart using CSS */}
            <div className="flex items-end justify-between h-64 gap-6 px-4">
              {[
              {
                m: 'Oct',
                i: 80,
                e: 40
              },
              {
                m: 'Nov',
                i: 70,
                e: 55
              },
              {
                m: 'Dec',
                i: 95,
                e: 30
              },
              {
                m: 'Jan',
                i: 60,
                e: 70
              },
              {
                m: 'Feb',
                i: 85,
                e: 45
              },
              {
                m: 'Mar',
                i: 90,
                e: 50
              }].
              map((data, idx) =>
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 group">

                  <div className="w-full flex justify-center items-end gap-1 h-56">
                    <div
                    className="w-full max-w-[12px] bg-indigo-600 rounded-t-sm transition-all group-hover:bg-indigo-400"
                    style={{
                      height: `${data.i}%`
                    }}
                    title={`Income: ${data.i}`} />

                    <div
                    className="w-full max-w-[12px] bg-slate-200 rounded-t-sm transition-all group-hover:bg-slate-400"
                    style={{
                      height: `${data.e}%`
                    }}
                    title={`Expense: ${data.e}`} />

                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">
                    {data.m}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Zone 4: Expense Breakdown (Donut Concept) */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="p-6 h-full border-none shadow-md ring-1 ring-gray-100">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 mb-8">
              <PieChartIcon className="w-5 h-5 text-orange-600" />
              Expense Distribution
            </h3>

            <div className="flex flex-col items-center justify-center py-4">
              {/* Visual Donut Legend */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-100" />
                <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-indigo-600 border-r-green-500 border-b-orange-500 rotate-45" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Total
                  </p>
                  <p className="text-lg font-black text-gray-900 tracking-tighter">
                    ₹8.4L
                  </p>
                </div>
              </div>

              <div className="w-full space-y-3">
                {[
                {
                  label: 'Staff Salary',
                  pct: '65%',
                  color: 'bg-indigo-600'
                },
                {
                  label: 'Campus Maintenance',
                  pct: '15%',
                  color: 'bg-green-500'
                },
                {
                  label: 'Utility (Elec/Water)',
                  pct: '10%',
                  color: 'bg-orange-500'
                },
                {
                  label: 'Academic Events',
                  pct: '10%',
                  color: 'bg-slate-400'
                }].
                map((item, idx) =>
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs">

                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-gray-600 font-medium">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">{item.pct}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Zone 3: Recent Activity (Last 10 Transactions) */}
        <div className="col-span-12">
          <Card className="border-none shadow-md ring-1 ring-gray-100 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                Recent Financial Ledger Entries
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-600 text-xs font-bold">

                View Full Ledger
              </Button>
            </div>
            <Table columns={columns} data={recentTransactions} />
          </Card>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest py-4">
        <Activity className="w-3 h-3" />
        Live Financial Data Reconciled as of {new Date().toLocaleTimeString()}
      </div>
    </div>);

}