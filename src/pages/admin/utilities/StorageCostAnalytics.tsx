// StorageCostAnalytics.tsx — Archive Management ▸ Storage Cost Analytics (Page 7)
// Cost KPIs, 12-month trend, tier split donut, detailed breakdown, optimization
// recommendations and monthly invoice history.
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  IndianRupee,
  TrendingDown,
  CalendarDays,
  BarChart3,
  Lightbulb,
  FileDown,
  RefreshCw,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { ArchiveHeader, KpiCard, Panel, Pill, TH, Donut, TrendChart, inr } from './archiveUi';

const MONTHS = ['Oct 24', 'Nov', 'Dec', 'Jan 25', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

// Monthly storage spend (₹) — primary, archive, cold
const COST_TREND = [
  { label: 'Oct 24', values: [2_180, 96, 10] },
  { label: 'Nov', values: [2_205, 112, 11] },
  { label: 'Dec', values: [2_240, 130, 12] },
  { label: 'Jan 25', values: [2_290, 158, 13] },
  { label: 'Feb', values: [2_330, 190, 14] },
  { label: 'Mar', values: [2_380, 245, 15] },
  { label: 'Apr', values: [2_420, 320, 15] },
  { label: 'May', values: [2_500, 420, 16] },
  { label: 'Jun', values: [2_610, 520, 17] },
  { label: 'Jul', values: [2_720, 610, 17] },
  { label: 'Aug', values: [2_600, 680, 18] },
  { label: 'Sep', values: [1_840, 744, 18] }
];

const TIERS = [
  { label: 'Primary DB', value: 1_840, color: '#6366f1', note: '75.1% of storage cost' },
  { label: 'Archive DB', value: 744, color: '#f59e0b', note: '30.4% of storage cost' },
  { label: 'Cold Storage', value: 18, color: '#0ea5e9', note: '0.7% of storage cost' },
  { label: 'Retrieval Costs', value: 165, color: '#10b981', note: '6.7% of storage cost' }
];

const BREAKDOWN = [
  { item: 'Primary DB — AWS RDS db.r5.xlarge, 200 GB SSD, ap-south-1', cost: 1_840, note: '12.3 GB used' },
  { item: 'Archive DB — AWS RDS db.r5.large, 100 GB SSD', cost: 744, note: '35.2 GB used' },
  { item: 'Cold Storage — AWS S3 Glacier Deep Archive', cost: 33, note: '41.2 GB compressed' },
  { item: 'Retrieval Costs — Glacier data retrieval charges', cost: 165, note: '5 retrievals this month' },
  { item: 'Backup Storage — AWS S3 Standard, daily full backup', cost: 82, note: '30 days retention' },
  { item: 'CDN & Static Assets — CloudFront', cost: 164, note: 'Logos, theme files' },
  { item: 'Misc. (Snapshots, monitoring, I/O)', cost: 421, note: 'Watch it — highest non-core cost' }
];

const RECOMMENDATIONS = [
  {
    title: '🔥 Move 2 GB of stale primary data to archive right now',
    detail: 'Terminated students, closed FY receipts and old notifications older than 2 years are still sitting in the primary DB.',
    saving: 28,
    effort: 'Run tonight — automated job',
    tone: 'amber' as const
  },
  {
    title: '💰 Switch to Glacier Deep Archive for true cold data',
    detail: 'You are on Glacier Flexible Retrieval for FY 16-19 files; Deep Archive is ~4× cheaper for data that is never read.',
    saving: 9,
    effort: 'One-time re-push, no data loss',
    tone: 'emerald' as const
  },
  {
    title: '❄️ Compress exam marks and documents before archiving',
    detail: 'Compression is off for 6 GB of exam + document archives; enabling GZIP level 6 cuts that to ~1.8 GB.',
    saving: 15,
    effort: 'Settings change + nightly job',
    tone: 'sky' as const
  },
  {
    title: '🗑️ Purge temp files older than 7 days + retire unused snapshots',
    detail: 'Temp uploads, PDF render caches and 4 orphaned RDS snapshots from FY 22-23 are billing every month.',
    saving: 115,
    effort: 'Cleanup job + snapshot review',
    tone: 'rose' as const
  }
];

const INVOICES = [
  { id: 'INV-SEP-2025', month: 'Sep 2025', storage: 2_450, retrieval: 165, total: 3_449, status: 'Paid' },
  { id: 'INV-AUG-2025', month: 'Aug 2025', storage: 2_600, retrieval: 240, total: 3_980, status: 'Paid' },
  { id: 'INV-JUL-2025', month: 'Jul 2025', storage: 2_720, retrieval: 185, total: 4_120, status: 'Paid' },
  { id: 'INV-JUN-2025', month: 'Jun 2025', storage: 2_610, retrieval: 95, total: 3_890, status: 'Paid' },
  { id: 'INV-MAY-2025', month: 'May 2025', storage: 2_500, retrieval: 118, total: 3_760, status: 'Paid' },
  { id: 'INV-APR-2025', month: 'Apr 2025', storage: 2_420, retrieval: 76, total: 3_620, status: 'Paid' }
];

export function StorageCostAnalytics() {
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const totalStorage = BREAKDOWN.reduce((s, b) => s + b.cost, 0);

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={IndianRupee}
        title="Storage Cost Analytics"
        screen="Storage Cost Analytics"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Cost data refreshed from the provider billing API.')}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Costs
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Cost report exported (fiscal year to date).')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Report
            </Button>
          </>
        }
      />

      {/* SECTION 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={IndianRupee} label="This Month Storage Cost" value={inr(2450)} sub="Sep 2025" />
        <KpiCard icon={BarChart3} label="Without Archiving (Estimated)" value={inr(9800)} tone="text-rose-700" sub="Hypothetical" />
        <KpiCard
          icon={TrendingDown}
          label="Saving From Archiving"
          value={inr(7350)}
          tone="text-emerald-700"
          sub={<span>75% Saved <Pill tone="green">🟢</Pill></span>}
        />
        <KpiCard icon={TrendingDown} label="Cost Trend (vs last month)" value="− ₹150" tone="text-emerald-700" sub={`Last month: ${inr(2600)}`} />
        <KpiCard icon={CalendarDays} label="Annual Projection" value={inr(29400)} sub="₹2,450 × 12" />
      </div>

      {/* SECTION 2 — trend chart */}
      <Panel
        icon={BarChart3}
        title="Cost Trend — Last 12 Months"
        subtitle="Primary DB, Archive DB and Cold Storage spend per month"
        actions={
          <>
            <select className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Fiscal Year To Date</option>
            </select>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Cost trend downloaded as CSV.')}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Download CSV
            </Button>
          </>
        }
      >
        <div className="p-5 space-y-4">
          <TrendChart
            labels={MONTHS}
            series={[
              { name: 'Primary DB', color: '#6366f1', values: COST_TREND.map((c) => c.values[0]) },
              { name: 'Archive DB', color: '#f59e0b', values: COST_TREND.map((c) => c.values[1]), dashed: true },
              { name: 'Cold Storage', color: '#0ea5e9', values: COST_TREND.map((c) => c.values[2]) }
            ]}
            height={230}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="font-semibold text-gray-800">Primary cost fell sharply this month</p>
              <p className="text-gray-600">₹2,720 (Jul) → ₹1,840 (Sep) after the FY 24-25 archive run freed 97.5 GB.</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="font-semibold text-gray-800">Archive cost grew as expected</p>
              <p className="text-gray-600">Archived data is 30× cheaper per GB than primary — growth here is a saving, not a cost problem.</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="font-semibold text-gray-800">Cold storage is nearly free</p>
              <p className="text-gray-600">{inr(18)} for 41.2 GB — every GB pushed to Glacier saves about ₹14 per month.</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* SECTION 3 — tier donut + breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel icon={BarChart3} title="Cost Split by Tier" subtitle="September 2025" className="xl:col-span-1">
          <div className="p-5 space-y-4">
            <Donut
              size={180}
              thickness={26}
              total={TIERS.reduce((s, t) => s + t.value, 0)}
              segments={TIERS.map((t) => ({ value: t.value, color: t.color, label: t.label }))}
              centerTop={inr(3449)}
              centerBottom="Total Sep"
            />
            <div className="space-y-2">
              {TIERS.map((t) => (
                <div key={t.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-gray-700">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    {t.label}
                  </span>
                  <span className="text-right">
                    <strong className="text-gray-900">{inr(t.value)}</strong>
                    <span className="block text-[10px] text-gray-500">{t.note}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          icon={IndianRupee}
          title="Detailed Cost Breakdown"
          subtitle="Where every rupee of the September invoice went"
          className="xl:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" data-testid="cost-table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={TH}>Component</th>
                  <th className={TH}>Description</th>
                  <th className={`${TH} text-right`}>Cost / Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {BREAKDOWN.map((b) => (
                  <tr key={b.item} className="hover:bg-indigo-50/20">
                    <td className="p-3 font-medium text-gray-900">{b.item}</td>
                    <td className="p-3 text-gray-600">
                      {b.note}
                      {b.item.startsWith('Misc') ? ' — review recommended' : ''}
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-900">{inr(b.cost)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t-2 border-gray-300">
                  <td className="p-3 font-bold text-gray-900">TOTAL</td>
                  <td className="p-3 text-gray-600">Full infrastructure bill (storage + retrieval + support services)</td>
                  <td className="p-3 text-right font-bold text-gray-900">{inr(totalStorage)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-[11px] text-gray-600">
            Storage-only spend (excludes backup, CDN and misc.): <strong>{inr(2450)}</strong> — this is the number used in the
            KPI cards above. Archiving keeps it flat while total data grows.
          </div>
        </Panel>
      </div>

      {/* SECTION 4 — optimization */}
      <Panel
        icon={Lightbulb}
        title="Cost Optimization Recommendations"
        subtitle="Potential saving of ₹167 per month (₹2,004 per year) if all four are applied"
        actions={
          <Button
            size="sm"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setApplied(true);
              showToast('All 4 optimizations queued — estimated saving ₹167/month.');
            }}
          >
            ⚡ Apply All Recommendations
          </Button>
        }
      >
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {RECOMMENDATIONS.map((r) => (
            <div key={r.title} className="rounded-xl border border-gray-200 p-4 space-y-2">
              <p className="text-xs font-bold text-gray-900">{r.title}</p>
              <p className="text-[11px] text-gray-600">{r.detail}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={r.tone === 'amber' ? 'amber' : r.tone === 'emerald' ? 'green' : r.tone === 'sky' ? 'sky' : 'rose'}>
                  Save {inr(r.saving)} / month
                </Pill>
                <Pill tone="gray">{r.effort}</Pill>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => showToast(`Applied: ${r.title}`)}
                >
                  Apply Now
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => showToast(`Details for "${r.title}" opened.`)}>
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-[11px] text-gray-700">
          <span>
            Total potential saving: <strong>₹167 / month</strong> · <strong>₹2,004 / year</strong>
          </span>
          {applied && <Pill tone="green">✅ All recommendations queued</Pill>}
        </div>
      </Panel>

      {/* SECTION 5 — invoices */}
      <Panel
        icon={CalendarDays}
        title="Monthly Invoice History"
        subtitle="Provider billing statements for the last 6 months"
        actions={
          <Button variant="outline" size="sm" className="text-xs" onClick={() => showToast('Invoices exported as ZIP.')}>
            <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Invoices
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={TH}>Invoice No.</th>
                <th className={TH}>Month</th>
                <th className={TH}>Storage</th>
                <th className={TH}>Retrieval</th>
                <th className={TH}>Total</th>
                <th className={TH}>Status</th>
                <th className={`${TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-indigo-50/20">
                  <td className="p-3 font-mono font-semibold text-indigo-700">{inv.id}</td>
                  <td className="p-3 text-gray-800">{inv.month}</td>
                  <td className="p-3 text-gray-700">{inr(inv.storage)}</td>
                  <td className="p-3 text-gray-700">{inr(inv.retrieval)}</td>
                  <td className="p-3 font-bold text-gray-900">{inr(inv.total)}</td>
                  <td className="p-3">
                    <Pill tone="green">✅ {inv.status}</Pill>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${inv.id} opened.`)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${inv.id} downloaded as PDF.`)}>
                        <FileDown className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => showToast(`${inv.id} sent to printer.`)}>
                        <Printer className="w-3 h-3 mr-1" /> Print
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default StorageCostAnalytics;
