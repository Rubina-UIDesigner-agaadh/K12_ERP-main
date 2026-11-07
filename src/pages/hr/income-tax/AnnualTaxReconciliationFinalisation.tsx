import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Lock,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown } from
'lucide-react';
export function AnnualTaxReconciliationFinalisation() {
  const navigate = useNavigate();
  const [reconStatus, setReconStatus] = useState('Not Started');
  const [previewed, setPreviewed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false);
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Annual Tax Reconciliation & Finalisation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Year-End Reconciliation
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => { setPreviewed(true); setReconStatus('Pre-Reconciliation Preview Generated'); }}>Generate Preview</Button>
          <Button variant="outline" onClick={() => { setReconStatus('Corrections Applied'); }}>Recalculate Preview</Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => { if (!proceedAnyway) return; setReconStatus('March Payroll Triggered'); navigate('/hr/payroll/payroll-entry'); }}>
            Proceed to March Payroll Entry
          </Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700">
            <Lock className="w-4 h-4 mr-2" />
            Finalise Year
          </Button>
        </div>
      </div>
      <Card className="p-4 text-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <p><span className="text-xs uppercase text-gray-400">Payroll Period</span><br />AY 2026-27</p>
          <p><span className="text-xs uppercase text-gray-400">Reconciliation Status</span><br />{reconStatus}{signed ? ' · Signed Off' : ''}</p>
          <p><span className="text-xs uppercase text-gray-400">March Payroll Date</span><br />31 Mar 2027</p>
          <p><span className="text-xs uppercase text-gray-400">High Impact auto-selected</span><br />Employees with March TDS multiple &gt; 3</p>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            options={[
            {
              value: '2024-25',
              label: 'FY 2024-25'
            },
            {
              value: '2023-24',
              label: 'FY 2023-24'
            }]
            }
            defaultValue="2024-25" />

          <Select
            options={[
            {
              value: 'all',
              label: 'All Departments'
            },
            {
              value: 'it',
              label: 'IT'
            },
            {
              value: 'hr',
              label: 'HR'
            }]
            }
            defaultValue="all" />

          <Select
            options={[
            {
              value: 'all',
              label: 'All Employees'
            },
            {
              value: 'mismatch',
              label: 'With Mismatch'
            },
            {
              value: 'matched',
              label: 'Matched'
            }]
            }
            defaultValue="all" />

        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹45.2L</p>
          <p className="text-sm text-gray-600">Total Tax Liability</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹44.8L</p>
          <p className="text-sm text-gray-600">Total TDS Deducted</p>
        </Card>

        <Card className="p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-700">₹40,000</p>
          <p className="text-sm text-gray-600">Shortfall</p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">₹0</p>
          <p className="text-sm text-gray-600">Excess</p>
        </Card>
      </div>

      {previewed && (
        <p className="text-xs text-gray-500">Preview includes Annual CTC, declared vs verified exemptions, flexible benefits accrued vs claimed, taxable income, slab + 4% cess, rebate u/s 87A, April–February TDS, March TDS multiple (Normal / Moderate / High).</p>
      )}

      {/* Reconciliation Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Annual Tax
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Total TDS
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Difference
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Adjustment
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Final Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
              {
                name: 'Rajesh Kumar',
                code: 'EMP001',
                tax: 112500,
                tds: 112500,
                diff: 0,
                status: 'Matched'
              },
              {
                name: 'Priya Sharma',
                code: 'EMP002',
                tax: 62500,
                tds: 62500,
                diff: 0,
                status: 'Matched'
              },
              {
                name: 'Amit Patel',
                code: 'EMP003',
                tax: 195000,
                tds: 175000,
                diff: -20000,
                status: 'Shortfall'
              },
              {
                name: 'Sneha Reddy',
                code: 'EMP004',
                tax: 42500,
                tds: 42500,
                diff: 0,
                status: 'Matched'
              },
              {
                name: 'Vikram Singh',
                code: 'EMP005',
                tax: 212500,
                tds: 192500,
                diff: -20000,
                status: 'Shortfall'
              }].
              map((emp, index) =>
              <tr
                key={index}
                className={`hover:bg-gray-50 ${emp.diff !== 0 ? 'bg-orange-50' : ''}`}>

                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.code}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ₹{emp.tax.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">
                    ₹{emp.tds.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                    className={`font-bold ${emp.diff === 0 ? 'text-gray-900' : emp.diff > 0 ? 'text-green-600' : 'text-red-600'}`}>

                      {emp.diff === 0 ?
                    '₹0' :
                    emp.diff > 0 ?
                    `+₹${emp.diff.toLocaleString()}` :
                    `-₹${Math.abs(emp.diff).toLocaleString()}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-blue-600 font-medium">
                    {emp.diff !== 0 ?
                  `₹${Math.abs(emp.diff).toLocaleString()}` :
                  '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                    className={
                    emp.status === 'Matched' ?
                    'bg-green-100 text-green-700' :
                    emp.status === 'Shortfall' ?
                    'bg-orange-100 text-orange-700' :
                    'bg-purple-100 text-purple-700'
                    }>

                      {emp.status}
                    </Badge>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
              <tr>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  Grand Total:
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  ₹6,25,000
                </td>
                <td className="px-4 py-3 text-right font-bold text-green-600">
                  ₹5,85,000
                </td>
                <td className="px-4 py-3 text-right font-bold text-red-600">
                  -₹40,000
                </td>
                <td className="px-4 py-3 text-right font-bold text-blue-600">
                  ₹40,000
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Alert */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">
              Year-End Finalisation Warning
            </p>
            <p className="text-sm text-red-700 mt-1">
              2 employees have tax shortfall totaling ₹40,000. These amounts
              must be recovered before finalising the year. Once finalised, no
              changes can be made to FY 2024-25 tax records.
            </p>
          </div>
        </div>
      </Card>

      {previewed && (
        <Card className="p-4 text-sm">
          <h3 className="mb-2 font-semibold text-gray-900">Correction window</h3>
          <p className="text-gray-600">High Impact employees can be notified of extra March TDS. Extend proof deadline on Proof Submission. Last-minute benefit claims can be approved without leaving this page — then Recalculate Preview.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" variant="outline">Notify High Impact employees</Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/hr/income-tax/employee-benefit-claim')}>Benefit claim approval queue</Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/hr/income-tax/employee-tax-exemption-proof-submission')}>Extend proof deadline</Button>
          </div>
        </Card>
      )}

      <Card className="p-4 text-sm">
        <h3 className="mb-2 font-semibold text-gray-900">Pre-execution checklist</h3>
        <ul className="space-y-1 text-gray-700">
          <li>Proof verifications complete: 91% — warning below 95%</li>
          <li>Pending benefit claims: 2 — warning if above zero</li>
          <li>Query Pending on proof verification: 1</li>
          <li>Proof submission deadline: passed</li>
        </ul>
        <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={proceedAnyway} onChange={(e) => setProceedAnyway(e.target.checked)} /> Proceed anyway — I acknowledge outstanding items (audit log)</label>
        <p className="mt-2 text-xs text-gray-500">March Payroll Entry will pre-activate Deduct Tax For Unsubmitted Tax Exemption Proof and Deduct Tax For Unclaimed Employee Benefits.</p>
      </Card>

      <Card className="p-4 text-sm">
        <h3 className="mb-2 font-semibold text-gray-900">Post-reconciliation / sign-off</h3>
        <p>Over-deduction: carry forward to next FY, refund via next slip, or employee claims via ITR. Under-deduction requires a mandatory review note.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => { setSigned(true); setReconStatus('Signed Off'); localStorage.setItem('k12-tax-recon-signed', '1'); }}>Submit for Finance / Principal sign-off</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/hr/income-tax/form-16-annual-statement-export')} disabled={!signed}>Go to Form-16 generation</Button>
        </div>
      </Card>

      {/* Finalisation Confirmation */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Finalisation Checklist
        </h3>
        <div className="space-y-3">
          {[
          {
            text: 'All TDS challans deposited',
            checked: true
          },
          {
            text: 'All employee declarations verified',
            checked: true
          },
          {
            text: 'All investment proofs approved',
            checked: true
          },
          {
            text: 'Tax shortfalls resolved',
            checked: false
          },
          {
            text: 'Form 16 data prepared',
            checked: true
          }].
          map((item, index) =>
          <label key={index} className="flex items-center gap-3">
              <input
              type="checkbox"
              checked={item.checked}
              disabled
              className="rounded" />

              <span
              className={`text-sm ${item.checked ? 'text-gray-900' : 'text-red-600 font-medium'}`}>

                {item.text}
              </span>
              {item.checked &&
            <CheckCircle className="w-4 h-4 text-green-600" />
            }
            </label>
          )}
        </div>
      </Card>
    </div>);

}