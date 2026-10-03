import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Target,
  Bell,
  Save,
  Search,
  Plus,
  Info,
  Layers,
  TrendingUp,
  History,
  AlertTriangle,
  ChevronRight } from
'lucide-react';

// Mock Data for Expense Heads
const INITIAL_BUDGETS = [
{ id: 1, head: 'Library Books & Journals', category: 'Academic', amount: 150000, threshold: 90 },
{ id: 2, head: 'Sports Equipment', category: 'Student Life', amount: 80000, threshold: 85 },
{ id: 3, head: 'Laboratory Chemicals', category: 'Academic', amount: 60000, threshold: 80 },
{ id: 4, head: 'Staff Training & Dev', category: 'HR', amount: 100000, threshold: 95 },
{ id: 5, head: 'Campus Maintenance', category: 'Infrastructure', amount: 250000, threshold: 90 },
{ id: 6, head: 'Marketing & Admission', category: 'Admin', amount: 500000, threshold: 80 }];


export function ExpenseBudgetMaster() {
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  const [selectedFY, setSelectedFY] = useState('2024-2025');

  const handleUpdate = (id: number, field: string, value: string | number) => {
    setBudgets((prev) => prev.map((item) =>
    item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + (parseFloat(b.amount.toString()) || 0), 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Budget Allocation Master
          </h1>
          <p className="text-gray-500 text-sm">Set spending limits and alert thresholds for the financial year.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Financial Year</label>
            <Select
              value={selectedFY}
              options={[{ label: 'FY 2024-2025', value: '2024-2025' }, { label: 'FY 2023-2024', value: '2023-2024' }]}
              className="w-48 bg-white border-none shadow-sm font-bold text-indigo-600" />

          </div>
          <Button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center gap-2 mt-4">
            <Save className="w-4 h-4" /> Save Budget Plan
          </Button>
        </div>
      </div>

      {/* Summary Stat & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1 p-4 border-none shadow-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Planned Budget ({selectedFY})</p>
            <h2 className="text-3xl font-black mt-1">₹{totalAllocated.toLocaleString()}</h2>
          </div>
          <TrendingUp className="w-12 h-12 opacity-20" />
        </Card>
        <Card className="flex-1 p-4 border-none shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input placeholder="Search expense heads..." className="pl-9 bg-gray-50 border-none" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Head
            </Button>
        </Card>
      </div>

      {/* Editable Budget Grid */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase">Expense Head & Category</th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase w-64">Budget Amount (₹)</th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase w-48">Warning Threshold (%)</th>
                <th className="p-4 text-[10px] font-bold text-gray-500 uppercase">Alert Triggered At</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {budgets.map((row) =>
              <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                            <Layers className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{row.head}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{row.category}</p>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs">₹</span>
                        <input
                      type="number"
                      className="w-full pl-7 pr-3 py-2 text-sm font-bold bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                      value={row.amount}
                      onChange={(e) => handleUpdate(row.id, 'amount', e.target.value)} />

                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                        <Bell className="absolute left-3 top-2.5 w-3.5 h-3.5 text-amber-500" />
                        <input
                      type="number"
                      max="100"
                      className="w-full pl-9 pr-3 py-2 text-sm font-bold bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                      value={row.threshold}
                      onChange={(e) => handleUpdate(row.id, 'threshold', e.target.value)} />

                        <span className="absolute right-3 top-2 text-[10px] font-bold text-gray-400">%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                        <p className="text-xs font-black text-indigo-700">
                            ₹{(row.amount * row.threshold / 100).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Automatic System Alert</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="text-gray-300 hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Logic Documentation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800 uppercase">Warning Logic</p>
                <p className="text-xs text-amber-700 leading-relaxed italic">
                    The system will send a notification to the Principal and Accountant when actual spending reaches the threshold. Example: If budget is ₹1,00,000 and threshold is 90%, alerts trigger at ₹90,000.
                </p>
            </div>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
            <History className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-800 uppercase">Audit Lock</p>
                <p className="text-xs text-indigo-700 leading-relaxed italic">
                    Once the budget is "Approved", any increases to the amount must be recorded as a "Budget Revision" with a formal justification for audit transparency.
                </p>
            </div>
          </div>
      </div>
    </div>);

}