import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Settings2,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Save,
  Info,
  Lock,
  Workflow,
  ShieldAlert,
  History } from
'lucide-react';
export function ExpenseSetup() {
  // State for toggles
  const [enableWorkflow, setEnableWorkflow] = useState(true);
  const [budgetPolicy, setBudgetPolicy] = useState('warning'); // 'strict' or 'warning'
  const [approvalLimit, setApprovalLimit] = useState(10000);
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-slate-700" />
            Expense & Finance Settings
          </h1>
          <p className="text-gray-500 text-sm">
            Configure global rules for approvals, budget limits, and security.
          </p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Approval Workflow Settings */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-gray-800">Approval Workflow</h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Toggle 1: Enable Workflow */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">
                  Enable Digital Approval Desk?
                </p>
                <p className="text-xs text-gray-500 max-w-md">
                  When enabled, all expenses must be reviewed and digitally
                  signed by the Principal/Manager before the ledger is updated.
                </p>
              </div>
              <div
                onClick={() => setEnableWorkflow(!enableWorkflow)}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${enableWorkflow ? 'bg-indigo-600' : 'bg-gray-300'}`}>

                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${enableWorkflow ? 'translate-x-6' : 'translate-x-0'}`} />

              </div>
            </div>

            {/* Input: Principal Limit */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${enableWorkflow ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Principal Approval Threshold
                  </p>
                  <p className="text-xs text-gray-500">
                    Expense amounts exceeding this value will be flagged for
                    "High Priority" review.
                  </p>
                </div>
                <div className="w-full md:w-48 relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-xs font-bold">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={approvalLimit}
                    onChange={(e) => setApprovalLimit(parseInt(e.target.value))}
                    className="pl-7 font-bold text-indigo-600" />

                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Safeguards */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-gray-800">
              Budget Integrity & Safeguards
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">
                  Budget Overrun Policy
                </p>
                <p className="text-xs text-gray-500">
                  How should the system react when an expense exceeds the
                  allocated budget head?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setBudgetPolicy('warning')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${budgetPolicy === 'warning' ? 'border-amber-500 bg-amber-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>

                  <div
                    className={`p-2 rounded-lg ${budgetPolicy === 'warning' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>

                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${budgetPolicy === 'warning' ? 'text-amber-900' : 'text-gray-700'}`}>

                      Warning Only (Soft Lock)
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                      Allow entry but show a prominent warning. Transactions are
                      logged as "Over-budget" in reports.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setBudgetPolicy('strict')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${budgetPolicy === 'strict' ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>

                  <div
                    className={`p-2 rounded-lg ${budgetPolicy === 'strict' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>

                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${budgetPolicy === 'strict' ? 'text-red-900' : 'text-gray-700'}`}>

                      Strict Block (Hard Lock)
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                      Completely stop the entry. Accountants cannot save an
                      expense that exceeds the remaining budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Audit Context Note */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-3">
          <div className="p-1.5 bg-slate-200 rounded-md">
            <History className="w-4 h-4 text-slate-600" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Audit Transparency
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              Changes to these settings are logged with a timestamp and User ID.
              Switching from "Strict" to "Warning" mode during a financial year
              will be flagged in the annual audit report.
            </p>
          </div>
        </div>
      </div>
    </div>);

}