import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { TAX_STAFF, computeEmployeeTax, inr, loadDeclarations, loadProofs } from './taxRecords';

export function EmployeeTaxSummaryList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [fy, setFy] = useState('AY-2026-27');
  const decls = loadDeclarations();
  const proofs = loadProofs();
  const rows = useMemo(() => TAX_STAFF.filter((e) => !search || `${e.name} ${e.id}`.toLowerCase().includes(search.toLowerCase())).map((emp) => {
    const tax = computeEmployeeTax(emp.id, fy);
    const decl = decls.find((d) => d.employeeId === emp.id && d.periodId === fy);
    const empProofs = proofs.filter((p) => p.employeeId === emp.id && p.periodId === fy);
    const proofStatus = empProofs.some((p) => p.status === 'Verified') ? 'Verified' : empProofs.length ? empProofs[0].status : 'None';
    return { emp, tax, declStatus: decl?.status || 'Not started', proofStatus };
  }), [search, fy, decls, proofs]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Tax Summary List</h1>
        <p className="text-sm text-gray-500">Overview only — values come from the shared tax engine and canonical declaration/proof stores.</p>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select options={[{ value: 'AY-2026-27', label: 'AY 2026-27' }]} value={fy} onChange={(e) => setFy(typeof e === 'string' ? e : e.target.value)} />
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Dept / branch</th><th className="px-3 py-2">FY</th><th className="px-3 py-2">Regime</th><th className="px-3 py-2">Gross</th><th className="px-3 py-2">Taxable</th><th className="px-3 py-2">Deductions</th><th className="px-3 py-2">Annual tax</th><th className="px-3 py-2">TDS</th><th className="px-3 py-2">Remaining</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Proofs</th><th className="px-3 py-2">Actions</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.emp.id} className="border-t">
                  <td className="px-3 py-2">{r.emp.name}<p className="text-xs text-gray-400">{r.emp.id}</p></td>
                  <td className="px-3 py-2">{r.emp.department} · {r.emp.branch}</td>
                  <td className="px-3 py-2">{fy}</td>
                  <td className="px-3 py-2">{r.tax.regime}</td>
                  <td className="px-3 py-2">{inr(r.tax.grossIncome)}</td>
                  <td className="px-3 py-2">{inr(r.tax.taxableIncome)}</td>
                  <td className="px-3 py-2">{inr(r.tax.chapterVia + r.tax.standardDeduction + r.tax.hraExemption)}</td>
                  <td className="px-3 py-2">{inr(r.tax.finalAnnualTax)}</td>
                  <td className="px-3 py-2">{inr(r.tax.tdsDeductedYtd)}</td>
                  <td className="px-3 py-2">{inr(r.tax.remainingTax)}</td>
                  <td className="px-3 py-2"><Badge variant={r.declStatus === 'Submitted' ? 'success' : 'warning'}>{r.declStatus}</Badge></td>
                  <td className="px-3 py-2"><Badge variant={r.proofStatus === 'Verified' ? 'success' : 'warning'}>{r.proofStatus}</Badge></td>
                  <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/employee-tax-profile-regime-selection')}>Profile</button>
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/employee-tax-exemption-declaration')}>Declarations</button>
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/proof-verification-status')}>Proofs</button>
                    <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/income-tax/annual-tax-projection-calculation')}>Projection</button>
                    <button type="button" className="text-indigo-700" onClick={() => window.print()}>Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default EmployeeTaxSummaryList;
