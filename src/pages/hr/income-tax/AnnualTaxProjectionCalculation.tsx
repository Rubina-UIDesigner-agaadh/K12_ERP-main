import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  TAX_STAFF,
  type ProjectionSnap,
  computeEmployeeTax,
  inr,
  loadProjections,
  monthsOfFy,
  saveProjection
} from './taxRecords';
import { remainingPayrollMonths } from './incomeTax';

type Tab = 'dash' | 'employee' | 'dept' | 'monthly' | 'compare';

export function AnnualTaxProjectionCalculation() {
  const [tab, setTab] = useState<Tab>('dash');
  const [fy, setFy] = useState('AY-2026-27');
  const [dept, setDept] = useState('all');
  const [regime, setRegime] = useState('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState<ProjectionSnap[]>(() => loadProjections());
  const remaining = remainingPayrollMonths();

  const rows = useMemo(() => TAX_STAFF.map((emp) => {
    const tax = computeEmployeeTax(emp.id, fy);
    const monthlyPay = emp.ctc / 12;
    const paidMonths = 12 - remaining;
    const actualPaid = monthlyPay * paidMonths;
    const projectedRest = monthlyPay * remaining;
    const months = monthsOfFy().map((m, idx) => {
      const actual = idx < paidMonths;
      const tds = actual ? Math.round(emp.ytdTds / Math.max(1, paidMonths)) : tax.monthlyTdsEstimate;
      return { ...m, actualSalary: actual ? monthlyPay : 0, projectedSalary: actual ? 0 : monthlyPay, tds, actual };
    });
    return { emp, tax, actualPaid, projectedRest, months, shortfall: tax.remainingTax };
  }), [fy, remaining]);

  const filtered = rows.filter((r) => {
    if (dept !== 'all' && r.emp.department !== dept) return false;
    if (regime !== 'all' && r.emp.regime !== regime) return false;
    if (search && !`${r.emp.name} ${r.emp.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totals = filtered.reduce((a, r) => ({
    tax: a.tax + r.tax.finalAnnualTax,
    tds: a.tds + r.tax.tdsDeductedYtd,
    remain: a.remain + r.tax.remainingTax,
    gross: a.gross + r.tax.grossIncome
  }), { tax: 0, tds: 0, remain: 0, gross: 0 });

  const generate = () => {
    const snaps: ProjectionSnap[] = filtered.map((r) => ({
      id: `PJ-${Date.now()}-${r.emp.id}`,
      employeeId: r.emp.id,
      employeeName: r.emp.name,
      periodId: fy,
      at: new Date().toISOString(),
      regime: r.tax.regime,
      gross: r.tax.grossIncome,
      taxable: r.tax.taxableIncome,
      annualTax: r.tax.finalAnnualTax,
      tds: r.tax.tdsDeductedYtd,
      remaining: r.tax.remainingTax,
      inputs: { std: r.tax.standardDeduction, chapterVia: r.tax.chapterVia, hra: r.tax.hraExemption, pack: r.tax.packName }
    }));
    snaps.forEach(saveProjection);
    setHistory(loadProjections());
    setNotice(`Projection snapshot saved for ${snaps.length} employee(s). Identical inputs will reproduce the same tax. Earlier snapshots are kept.`);
  };

  const exportCsv = (name: string, lines: string[]) => {
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dash', label: 'Projection dashboard' },
    { id: 'employee', label: 'Employee-wise' },
    { id: 'dept', label: 'Department-wise' },
    { id: 'monthly', label: 'Monthly TDS projection' },
    { id: 'compare', label: 'FY comparison / history' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annual Tax Projection and Reports</h1>
          <p className="text-sm text-gray-500">Shared Income Tax Slab engine. No 12% shortcut and no random variation.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generate}>Generate projection</Button>
          <Button variant="outline" onClick={() => exportCsv('employee-projection.csv', ['Employee,Gross,Taxable,Tax,TDS,Remaining', ...filtered.map((r) => `${r.emp.name},${r.tax.grossIncome},${r.tax.taxableIncome},${r.tax.finalAnnualTax},${r.tax.tdsDeductedYtd},${r.tax.remainingTax}`)])}>Export</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      <div className="flex flex-wrap gap-2">
        <Select options={[{ value: 'AY-2026-27', label: 'AY 2026-27' }]} value={fy} onChange={(e) => setFy(typeof e === 'string' ? e : e.target.value)} />
        <Select options={[{ value: 'all', label: 'All departments' }, ...Array.from(new Set(TAX_STAFF.map((e) => e.department))).map((d) => ({ value: d, label: d }))]} value={dept} onChange={(e) => setDept(typeof e === 'string' ? e : e.target.value)} />
        <Select options={[{ value: 'all', label: 'All regimes' }, { value: 'Old', label: 'Old' }, { value: 'New', label: 'New' }]} value={regime} onChange={(e) => setRegime(typeof e === 'string' ? e : e.target.value)} />
        <Input placeholder="Employee" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map((t) => <button key={t.id} type="button" className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {tab === 'dash' && (
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {[
            ['Employees projected', filtered.length],
            ['Projected tax', inr(totals.tax)],
            ['TDS deducted', inr(totals.tds)],
            ['Remaining liability', inr(totals.remain)],
            ['Shortfall cases', filtered.filter((r) => r.tax.remainingTax > 0).length],
            ['Excess / complete', filtered.filter((r) => r.tax.remainingTax <= 0).length]
          ].map(([l, n]) => <Card key={String(l)}><div className="p-4"><p className="text-xs text-gray-500">{l}</p><p className="text-xl font-semibold">{n}</p></div></Card>)}
        </div>
      )}

      {tab === 'employee' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Employee</th><th className="px-3 py-2">Dept / branch</th><th className="px-3 py-2">Regime</th><th className="px-3 py-2">Gross</th><th className="px-3 py-2">Taxable</th><th className="px-3 py-2">Annual tax</th><th className="px-3 py-2">TDS</th><th className="px-3 py-2">Remaining</th><th className="px-3 py-2">Status</th></tr></thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.emp.id} className="border-t">
                    <td className="px-3 py-2">{r.emp.name}<p className="text-xs text-gray-400">{r.emp.id}</p></td>
                    <td className="px-3 py-2">{r.emp.department} · {r.emp.branch}</td>
                    <td className="px-3 py-2">{r.tax.regime}</td>
                    <td className="px-3 py-2">{inr(r.tax.grossIncome)}</td>
                    <td className="px-3 py-2">{inr(r.tax.taxableIncome)}</td>
                    <td className="px-3 py-2">{inr(r.tax.finalAnnualTax)}</td>
                    <td className="px-3 py-2">{inr(r.tax.tdsDeductedYtd)}</td>
                    <td className="px-3 py-2">{inr(r.tax.remainingTax)}</td>
                    <td className="px-3 py-2"><Badge variant={r.tax.remainingTax > 1000 ? 'warning' : 'success'}>{r.tax.remainingTax > 1000 ? 'Shortfall' : 'On track'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'dept' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Department</th><th className="px-3 py-2">Employees</th><th className="px-3 py-2">Gross</th><th className="px-3 py-2">Taxable</th><th className="px-3 py-2">Tax</th><th className="px-3 py-2">TDS</th><th className="px-3 py-2">Remaining</th></tr></thead>
            <tbody>
              {Array.from(new Set(filtered.map((r) => r.emp.department))).map((d) => {
                const g = filtered.filter((r) => r.emp.department === d);
                return (
                  <tr key={d} className="border-t">
                    <td className="px-3 py-2">{d}</td>
                    <td className="px-3 py-2">{g.length}</td>
                    <td className="px-3 py-2">{inr(g.reduce((s, r) => s + r.tax.grossIncome, 0))}</td>
                    <td className="px-3 py-2">{inr(g.reduce((s, r) => s + r.tax.taxableIncome, 0))}</td>
                    <td className="px-3 py-2">{inr(g.reduce((s, r) => s + r.tax.finalAnnualTax, 0))}</td>
                    <td className="px-3 py-2">{inr(g.reduce((s, r) => s + r.tax.tdsDeductedYtd, 0))}</td>
                    <td className="px-3 py-2">{inr(g.reduce((s, r) => s + r.tax.remainingTax, 0))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'monthly' && (
        <Card>
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Month</th><th>Actual salary</th><th>Projected salary</th><th>Est. TDS</th><th>Kind</th></tr></thead>
              <tbody>
                {(filtered[0]?.months || monthsOfFy()).map((m: any) => (
                  <tr key={m.id} className="border-t">
                    <td className="py-2">{m.label}</td>
                    <td>{inr(filtered.reduce((s, r) => s + (r.months.find((x) => x.id === m.id)?.actualSalary || 0), 0))}</td>
                    <td>{inr(filtered.reduce((s, r) => s + (r.months.find((x) => x.id === m.id)?.projectedSalary || 0), 0))}</td>
                    <td>{inr(filtered.reduce((s, r) => s + (r.months.find((x) => x.id === m.id)?.tds || 0), 0))}</td>
                    <td>{m.actual ? 'Actual' : 'Projected'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-500">{remaining} remaining months in the financial year. Actual vs projected are separated.</p>
          </div>
        </Card>
      )}

      {tab === 'compare' && (
        <Card>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">When</th><th className="px-3 py-2">Employee</th><th className="px-3 py-2">FY</th><th className="px-3 py-2">Regime</th><th className="px-3 py-2">Gross</th><th className="px-3 py-2">Taxable</th><th className="px-3 py-2">Tax</th><th className="px-3 py-2">TDS</th><th className="px-3 py-2">Remaining</th></tr></thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-t">
                  <td className="px-3 py-2">{h.at.slice(0, 16).replace('T', ' ')}</td>
                  <td className="px-3 py-2">{h.employeeName}</td>
                  <td className="px-3 py-2">{h.periodId}</td>
                  <td className="px-3 py-2">{h.regime}</td>
                  <td className="px-3 py-2">{inr(h.gross)}</td>
                  <td className="px-3 py-2">{inr(h.taxable)}</td>
                  <td className="px-3 py-2">{inr(h.annualTax)}</td>
                  <td className="px-3 py-2">{inr(h.tds)}</td>
                  <td className="px-3 py-2">{inr(h.remaining)}</td>
                </tr>
              ))}
              {!history.length && <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-500">Generate a projection to store a snapshot.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default AnnualTaxProjectionCalculation;
