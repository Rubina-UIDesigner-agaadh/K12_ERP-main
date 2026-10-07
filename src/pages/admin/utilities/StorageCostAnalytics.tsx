// StorageCostAnalytics.tsx — Archive Management ▸ Storage Cost Analytics (Page 7)
// Cost KPIs, 12-month trend, tier split donut, detailed breakdown, optimization
// recommendations and monthly invoice history.
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
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
import { downloadCsv } from './archiveWorkflowState';

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
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());
  const [range, setRange] = useState('Last 12 Months');
  const [activeRecommendation, setActiveRecommendation] = useState<(typeof RECOMMENDATIONS)[number] | null>(null);
  const [invoiceDetail, setInvoiceDetail] = useState<(typeof INVOICES)[number] | null>(null);
  const [lastRefresh, setLastRefresh] = useState('Sample data');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 3200);
  };

  const trendEntries = range === 'Last 6 Months' ? COST_TREND.slice(-6) : range === 'Fiscal Year To Date' ? COST_TREND.slice(6) : COST_TREND;
  const trendLabels = trendEntries.map((entry) => entry.label);
  const exportTrend = () => downloadCsv('archive-cost-trend.csv', ['Month', 'Primary DB INR', 'Archive DB INR', 'Cold Storage INR'], trendEntries.map((entry) => [entry.label, ...entry.values]));
  const exportInvoices = () => downloadCsv('archive-monthly-invoices.csv', ['Invoice', 'Month', 'Storage INR', 'Retrieval INR', 'Total INR', 'Status'], INVOICES.map((invoice) => [invoice.id, invoice.month, invoice.storage, invoice.retrieval, invoice.total, invoice.status]));
  const exportReport = () => downloadCsv('archive-storage-cost-report.csv', ['Component', 'Cost INR', 'Description'], BREAKDOWN.map((item) => [item.item, item.cost, item.note]));
  const downloadInvoicePdf = (invoice: (typeof INVOICES)[number]) => {
    const escape = (text: string) => text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const lines = ['K12 ERP - Archive Storage Invoice', `Invoice: ${invoice.id}`, `Billing month: ${invoice.month}`, `Storage: INR ${invoice.storage.toLocaleString('en-IN')}`, `Retrieval: INR ${invoice.retrieval.toLocaleString('en-IN')}`, `Total: INR ${invoice.total.toLocaleString('en-IN')}`, `Status: ${invoice.status}`, 'Frontend sample invoice - not a provider-issued billing document.'];
    const content = lines.map((line, index) => `BT /F1 ${index === 0 ? 18 : 12} Tf 50 ${760 - index * 34} Td (${escape(line)}) Tj ET`).join('\n');
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => { offsets.push(new TextEncoder().encode(pdf).length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
    const xrefOffset = new TextEncoder().encode(pdf).length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${invoice.id}.pdf`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const totalStorage = BREAKDOWN.reduce((s, b) => s + b.cost, 0);
  const appliedSavings = RECOMMENDATIONS.filter((item) => appliedRecommendations.has(item.title)).reduce((sum, item) => sum + item.saving, 0);

  return (
    <div className="space-y-6 py-6">
      <ArchiveHeader
        icon={IndianRupee}
        title="Storage Cost Analytics"
        screen="Storage Cost Analytics"
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => { setLastRefresh(new Date().toLocaleString('en-IN')); showToast('Local sample cost data refreshed.'); }}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Costs
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={exportReport}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Report CSV
            </Button>
          </>
        }
      />
      <p className="-mt-4 text-[10px] text-gray-500">Frontend cost sample · last refreshed: {lastRefresh} · no billing provider is connected in this preview.</p>

      {/* SECTION 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={IndianRupee} label="Projected Monthly Cost" value={inr(Math.max(0, 2450 - appliedSavings))} sub={appliedSavings ? `${inr(appliedSavings)} monthly savings modeled locally` : 'Sep 2025 sample baseline'} />
        <KpiCard icon={BarChart3} label="Without Archiving (Estimated)" value={inr(9800)} tone="text-rose-700" sub="Hypothetical sample" />
        <KpiCard
          icon={TrendingDown}
          label="Saving From Archiving & Optimizations"
          value={inr(7350 + appliedSavings)}
          tone="text-emerald-700"
          sub={<span>{inr(appliedSavings)} extra modeled monthly savings <Pill tone="green">Local model</Pill></span>}
        />
        <KpiCard icon={TrendingDown} label="Cost Trend (vs last month)" value="− ₹150" tone="text-emerald-700" sub={`Last month sample: ${inr(2600)}`} />
        <KpiCard icon={CalendarDays} label="Annual Projection (Modeled)" value={inr(Math.max(0, 2450 - appliedSavings) * 12)} sub="Projected monthly cost × 12" />
      </div>

      {/* SECTION 2 — trend chart */}
      <Panel
        icon={BarChart3}
        title={`Cost Trend — ${range}`}
        subtitle="Primary DB, Archive DB and Cold Storage spend per month"
        actions={
          <>
            <select value={range} onChange={(event) => setRange(event.target.value)} className="py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Fiscal Year To Date</option>
            </select>
            <Button variant="outline" size="sm" className="text-xs" onClick={exportTrend}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Download CSV
            </Button>
          </>
        }
      >
        <div className="p-5 space-y-4">
          <TrendChart
            labels={trendLabels}
            series={[
              { name: 'Primary DB', color: '#6366f1', values: trendEntries.map((entry) => entry.values[0]) },
              { name: 'Archive DB', color: '#f59e0b', values: trendEntries.map((entry) => entry.values[1]), dashed: true },
              { name: 'Cold Storage', color: '#0ea5e9', values: trendEntries.map((entry) => entry.values[2]) }
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
        subtitle="Applying recommendations updates the projected savings in this local model only; it does not change archive jobs or provider settings."
        actions={
          <Button
            size="sm"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setAppliedRecommendations(new Set(RECOMMENDATIONS.map((item) => item.title)));
              showToast('All four recommendations applied to the local cost model; no real storage settings were changed.');
            }}
          >
            ⚡ Apply All to Local Model
          </Button>
        }
      >
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {RECOMMENDATIONS.map((r) => (
            <div key={r.title} className="rounded-xl border border-gray-200 p-4 space-y-2">
              <p className="text-xs font-bold text-gray-900">{r.title}</p>
              <p className="text-[11px] text-gray-600">{r.detail}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={r.tone === 'amber' ? 'amber' : r.tone === 'emerald' ? 'green' : r.tone === 'sky' ? 'blue' : 'rose'}>
                  Save {inr(r.saving)} / month
                </Pill>
                <Pill tone="gray">{r.effort}</Pill>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => {
                    setAppliedRecommendations((current) => {
                      const next = new Set(current);
                      if (next.has(r.title)) next.delete(r.title); else next.add(r.title);
                      return next;
                    });
                    showToast(`${appliedRecommendations.has(r.title) ? 'Removed from' : 'Applied to'} the local cost model: ${r.title}`);
                  }}
                >
                  {appliedRecommendations.has(r.title) ? 'Undo' : 'Apply Locally'}
                </Button>
                {appliedRecommendations.has(r.title) && <Pill tone="green">Applied Locally</Pill>}
                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setActiveRecommendation(r)}>
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-3 text-[11px] text-gray-700">
          <span>
            Potential saving: <strong>₹167 / month</strong> · <strong>₹2,004 / year</strong> · currently modeled: <strong>{inr(appliedSavings)} / month</strong>
          </span>
          {appliedRecommendations.size > 0 && <Pill tone="green">{appliedRecommendations.size} of {RECOMMENDATIONS.length} applied to local model</Pill>}
        </div>
      </Panel>

      {/* SECTION 5 — invoices */}
      <Panel
        icon={CalendarDays}
        title="Monthly Invoice History"
        subtitle="Provider billing statements for the last 6 months"
        actions={
          <Button variant="outline" size="sm" className="text-xs" onClick={exportInvoices}>
            <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export Invoices CSV
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
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setInvoiceDetail(inv)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => downloadInvoicePdf(inv)}>
                        <FileDown className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => { setInvoiceDetail(inv); window.setTimeout(() => window.print(), 150); }}>
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

      {activeRecommendation && (
        <Modal isOpen onClose={() => setActiveRecommendation(null)} title="Recommendation Details" size="md">
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-gray-900">{activeRecommendation.title}</h3>
            <p className="text-gray-600">{activeRecommendation.detail}</p>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3"><p>Estimated saving / month: <strong>{inr(activeRecommendation.saving)}</strong></p><p>Estimated saving / year: <strong>{inr(activeRecommendation.saving * 12)}</strong></p><p className="col-span-2">Effort: <strong>{activeRecommendation.effort}</strong></p></div>
            <p className="text-[11px] text-amber-700">Applying this item updates the modeled savings in the page only. It does not modify jobs, storage tiers, or billing settings.</p>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setActiveRecommendation(null)}>Close</Button><Button onClick={() => { setAppliedRecommendations((current) => new Set(current).add(activeRecommendation.title)); showToast('Recommendation applied to the local cost model.'); setActiveRecommendation(null); }}>Apply Locally</Button></div>
          </div>
        </Modal>
      )}
      {invoiceDetail && (
        <Modal isOpen onClose={() => setInvoiceDetail(null)} title={`Invoice — ${invoiceDetail.id}`} size="md">
          <div className="space-y-4 text-xs">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4"><p className="font-bold text-indigo-900">{invoiceDetail.id}</p><p className="mt-1 text-indigo-800">Billing month: {invoiceDetail.month} · Status: {invoiceDetail.status}</p></div>
            <div className="space-y-2"><div className="flex justify-between border-b py-2"><span>Storage charges</span><strong>{inr(invoiceDetail.storage)}</strong></div><div className="flex justify-between border-b py-2"><span>Retrieval charges</span><strong>{inr(invoiceDetail.retrieval)}</strong></div><div className="flex justify-between py-2 text-sm"><span>Total</span><strong>{inr(invoiceDetail.total)}</strong></div></div>
            <p className="text-[11px] text-gray-500">Frontend sample invoice; not a provider-issued statement.</p>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => downloadInvoicePdf(invoiceDetail)}><FileDown className="w-3.5 h-3.5 mr-1.5" />Download PDF</Button><Button onClick={() => setInvoiceDetail(null)}>Close</Button></div>
          </div>
        </Modal>
      )}

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
