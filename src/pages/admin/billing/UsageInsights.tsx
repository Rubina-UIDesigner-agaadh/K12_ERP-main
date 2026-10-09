import React, { useState } from 'react';
import { Select } from '../../../components/ui/Select';
import { Calculator, MessageSquare, Mail, Smartphone } from 'lucide-react';

const monthlyData = [
{
  month: 'Jan',
  students: 1210,
  comm: {
    sms: { count: 3800, cost: 950 },
    wa: { count: 2200, cost: 770 },
    email: { count: 7500, cost: 750 },
    total: 2470
  }
},
{
  month: 'Feb',
  students: 1195,
  comm: {
    sms: { count: 4100, cost: 1025 },
    wa: { count: 2400, cost: 840 },
    email: { count: 7800, cost: 780 },
    total: 2645
  }
},
{
  month: 'Mar',
  students: 1220,
  comm: {
    sms: { count: 4300, cost: 1075 },
    wa: { count: 2600, cost: 910 },
    email: { count: 8000, cost: 800 },
    total: 2785
  }
},
{
  month: 'Apr',
  students: 1248,
  comm: {
    sms: { count: 4520, cost: 1130 },
    wa: { count: 2840, cost: 994 },
    email: { count: 8150, cost: 815 },
    total: 2939
  }
}];


const perStudentPrice = 19;
const currentStudents = 1248;
const currentSubCost = currentStudents * perStudentPrice;
const currentCommCost = 2939;
const gstRate = 0.18;
const currentSubtotal = currentSubCost + currentCommCost;
const currentGst = Math.round(currentSubtotal * gstRate);
const currentGrandTotal = currentSubtotal + currentGst;

export function UsageInsights() {
  const [period, setPeriod] = useState('last-4-months');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage Insights</h1>
          <p className="text-sm text-gray-500 mt-1">
            Transparent breakdown of how your subscription cost is calculated
          </p>
        </div>
        <Select
          options={[
          { value: 'last-4-months', label: 'Last 4 Months' },
          { value: 'last-6-months', label: 'Last 6 Months' },
          { value: 'this-year', label: 'This Year' }]
          }
          value={period}
          onChange={setPeriod}
          className="w-44" />
        
      </div>

      {/* Billing Calculation Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Billing Calculation Breakdown
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Pricing Formula */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
            <p className="text-sm font-medium text-blue-200 mb-2">
              Pricing Formula
            </p>
            <p className="text-xl font-bold">
              (Student Count × Per Student Price) + Communication Charges + GST
            </p>
          </div>

          {/* Calculation Visual */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">
              Current Month Calculation
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5 font-medium">
                  Students
                </p>
                <span className="text-2xl font-bold text-slate-800">
                  {currentStudents.toLocaleString()}
                </span>
              </div>
              <span className="text-2xl font-light text-slate-400">×</span>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5 font-medium">
                  Per Student
                </p>
                <span className="text-2xl font-bold text-slate-800">
                  ₹{perStudentPrice}
                </span>
              </div>
              <span className="text-2xl font-light text-slate-400">=</span>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                <p className="text-[10px] text-indigo-600 uppercase tracking-wide mb-0.5 font-medium">
                  Subscription
                </p>
                <span className="text-2xl font-bold text-indigo-700">
                  ₹{currentSubCost.toLocaleString()}
                </span>
              </div>
              <span className="text-2xl font-light text-slate-400">+</span>
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                <p className="text-[10px] text-purple-600 uppercase tracking-wide mb-0.5 font-medium">
                  Comm. Charges
                </p>
                <span className="text-2xl font-bold text-purple-700">
                  ₹{currentCommCost.toLocaleString()}
                </span>
              </div>
              <span className="text-2xl font-light text-slate-400">+</span>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-[10px] text-amber-600 uppercase tracking-wide mb-0.5 font-medium">
                  GST (18%)
                </p>
                <span className="text-2xl font-bold text-amber-700">
                  ₹{currentGst.toLocaleString()}
                </span>
              </div>
              <span className="text-2xl font-light text-slate-400">=</span>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg px-5 py-3 shadow-md">
                <p className="text-[10px] text-emerald-50 uppercase tracking-wide mb-0.5 font-medium">
                  Grand Total
                </p>
                <span className="text-2xl font-bold text-white">
                  ₹{currentGrandTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Final Monthly Payable (Inclusive of GST)
            </p>
          </div>

          {/* Amount Summary with GST */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-700">Subscription Cost</p>
              <span className="text-sm font-semibold text-gray-900">
                ₹{currentSubCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-700">Communication Charges</p>
              <span className="text-sm font-semibold text-gray-900">
                ₹{currentCommCost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-700">Subtotal (Before GST)</p>
              <span className="text-sm font-semibold text-gray-900">
                ₹{currentSubtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-700">GST @ 18%</p>
              <span className="text-sm font-semibold text-gray-900">
                ₹{currentGst.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-blue-50">
              <p className="text-sm font-bold text-blue-700">
                Grand Total (Inclusive of GST)
              </p>
              <span className="text-lg font-bold text-blue-700">
                ₹{currentGrandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Usage Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Communication Usage & Charges
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Current Month Channel Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS</p>
                  <p className="text-xs text-gray-500">₹0.25 / message</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                4,520{' '}
                <span className="text-sm font-normal text-gray-500">sent</span>
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">₹1,130</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Smartphone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-500">₹0.35 / message</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                2,840{' '}
                <span className="text-sm font-normal text-gray-500">sent</span>
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">₹994</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">₹0.10 / message</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                8,150{' '}
                <span className="text-sm font-normal text-gray-500">sent</span>
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">₹815</p>
            </div>
          </div>

          {/* Communication History Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS Sent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WA Sent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WA Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Sent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {monthlyData.map((d, i) =>
                <tr
                  key={i}
                  className={
                  i === monthlyData.length - 1 ?
                  'bg-blue-50' :
                  'hover:bg-gray-50'
                  }>
                  
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {d.month}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {d.comm.sms.count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      ₹{d.comm.sms.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {d.comm.wa.count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      ₹{d.comm.wa.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {d.comm.email.count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      ₹{d.comm.email.cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      ₹{d.comm.total.toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);

}