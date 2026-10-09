import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  ArrowRightLeft,
  Link as LinkIcon,
  Save,
  Search,
  AlertCircle,
  CheckCircle2,
  Settings,
  FileJson,
  Info,
  RefreshCcw } from
'lucide-react';

export function ExpenseAccountMapping() {
  // Mock Data: Chart of Accounts (Financial Ledger)
  const ledgerAccounts = [
  { label: 'Electricity & Power A/c (50001)', value: 'gl_50001' },
  { label: 'Printing & Stationery A/c (50002)', value: 'gl_50002' },
  { label: 'Repair & Maintenance A/c (50003)', value: 'gl_50003' },
  { label: 'Staff Welfare A/c (50004)', value: 'gl_50004' },
  { label: 'Canteen Operational Exp A/c (50005)', value: 'gl_50005' },
  { label: 'Miscellaneous Expenses A/c (50099)', value: 'gl_50099' },
  { label: 'Event & Cultural Exp A/c (50010)', value: 'gl_50010' }];


  // Mock Data: Expense Heads (Internal ERP Categories)
  const [mappings, setMappings] = useState([
  {
    id: '1',
    expenseHead: 'Main Building Electricity',
    category: 'Utilities',
    linkedGL: 'gl_50001',
    status: 'Mapped'
  },
  {
    id: '2',
    expenseHead: 'Office Stationery',
    category: 'Admin',
    linkedGL: 'gl_50002',
    status: 'Mapped'
  },
  {
    id: '3',
    expenseHead: 'Canteen Grocery',
    category: 'Operations',
    linkedGL: 'gl_50005',
    status: 'Mapped'
  },
  {
    id: '4',
    expenseHead: 'AC Repairing Services',
    category: 'Maintenance',
    linkedGL: '',
    status: 'Unmapped'
  },
  {
    id: '5',
    expenseHead: 'Annual Sports Day Catering',
    category: 'Events',
    linkedGL: '',
    status: 'Unmapped'
  }]
  );

  const handleMappingChange = (id: string, value: string) => {
    setMappings((prev) => prev.map((m) =>
    m.id === id ? { ...m, linkedGL: value, status: value ? 'Mapped' : 'Unmapped' } : m
    ));
  };

  const columns = [
  {
    key: 'head',
    header: 'Expense Head (Internal ERP)',
    render: (row: any) =>
    <div className="flex items-center gap-3">
          <div className={`w-1.5 h-10 rounded-full ${row.status === 'Mapped' ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <div className="font-bold text-gray-900">{row.expenseHead}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.category}</div>
          </div>
        </div>

  },
  {
    key: 'arrow',
    header: '',
    render: () => <ArrowRightLeft className="w-4 h-4 text-gray-300" />
  },
  {
    key: 'mapping',
    header: 'Linked Ledger Account (Chart of Accounts)',
    render: (row: any) =>
    <div className="min-w-[300px]">
          <Select
        options={ledgerAccounts}
        placeholder="Select GL Account..."
        value={row.linkedGL}
        onChange={(e: any) => handleMappingChange(row.id, e.target.value)} />

        </div>

  },
  {
    key: 'status',
    header: 'Sync Status',
    render: (row: any) =>
    row.status === 'Mapped' ?
    <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" /> Successfully Linked
          </div> :

    <div className="flex items-center gap-1.5 text-red-500 font-bold text-[10px] uppercase animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Mapping Pending
          </div>


  }];


  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Expense Account Mapping <LinkIcon className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-gray-500">Synchronize ERP expense heads with Financial Accounting ledgers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <RefreshCcw className="w-4 h-4 mr-2" /> Auto-detect
          </Button>
          <Button variant="primary" size="sm" className="shadow-lg shadow-indigo-100 px-6">
            <Save className="w-4 h-4 mr-2" /> Save All Mappings
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-l-4 border-l-indigo-600 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <FileJson className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Heads</p>
            <h4 className="text-xl font-black text-gray-900">{mappings.length}</h4>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mapped Heads</p>
            <h4 className="text-xl font-black text-gray-900">{mappings.filter((m) => m.status === 'Mapped').length}</h4>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-2xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unmapped (Alert)</p>
            <h4 className="text-xl font-black text-gray-900">{mappings.filter((m) => m.status === 'Unmapped').length}</h4>
          </div>
        </Card>
      </div>

      {/* Mapping Table */}
      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-gray-200">
        <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium italic">
             <Info className="w-4 h-4" /> Ensure all heads are mapped before the financial year closing.
           </div>
           <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search Expense Head..." />

           </div>
        </div>
        
        <Table columns={columns} data={mappings} />

        <div className="p-4 bg-gray-50 border-t flex justify-end">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
             <Settings className="w-3 h-3" /> Ledger Data Source: Main Account Master (v4.2)
           </div>
        </div>
      </Card>

      {/* Warning Panel */}
      {mappings.some((m) => m.status === 'Unmapped') &&
      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center gap-4">
           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
             <AlertCircle className="w-6 h-6 text-red-600" />
           </div>
           <div className="flex-1 text-center md:text-left">
             <h4 className="text-sm font-black text-red-900 uppercase">Action Required: Unmapped Expenses</h4>
             <p className="text-xs text-red-700 leading-relaxed italic">
               Expenses recorded under unmapped heads will not appear in the Monthly Profit & Loss statement. Please link them to a valid General Ledger account immediately.
             </p>
           </div>
           <Button variant="primary" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100">
              Quick Map Remaining
           </Button>
        </div>
      }
    </div>);

}