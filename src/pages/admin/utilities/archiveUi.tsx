// archiveUi.tsx — shared presentational pieces for the Archive Management pages
// (Admin Tools ▸ Utilities). Kept dependency-free: charts are inline SVG so the
// pages stay light and render identically in every environment.
import React from 'react';
import { Card } from '../../../components/ui/Card';

export const inr = (n: number) => '₹ ' + n.toLocaleString('en-IN');

export const gb = (n: number) => `${n.toFixed(1)} GB`;

/** One KPI tile of the storage / cost / job rows. */
export function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'text-gray-900',
  progress,
  progressLabel,
  badge
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: string;
  progress?: { used: number; total: number; color?: string };
  progressLabel?: string;
  badge?: React.ReactNode;
}) {
  const pct = progress ? Math.min(100, Math.round((progress.used / progress.total) * 100)) : 0;
  return (
    <Card className="p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        <Icon className="w-4 h-4 text-gray-300" />
      </div>
      <div className={`text-xl font-bold ${tone}`}>{value}</div>
      {progress && (
        <div className="mt-2">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full rounded-full ${progress.color || 'bg-indigo-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500">
            <span>
              {progress.used} / {progress.total} GB
            </span>
            <span>{progressLabel || `${pct}% Used`}</span>
          </div>
        </div>
      )}
      {sub && <div className="text-[11px] text-gray-500 mt-1">{sub}</div>}
      {badge && <div className="mt-1">{badge}</div>}
    </Card>
  );
}

/** Standard titled panel used by every archive screen. */
export function Panel({
  icon: Icon,
  title,
  subtitle,
  actions,
  children,
  className = ''
}: {
  icon?: React.ElementType;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden border border-gray-200 shadow-sm ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </Card>
  );
}

export const TH = 'p-3 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap';

export function ProgressBar({
  value,
  max,
  color = 'bg-indigo-500',
  label
}: {
  value: number;
  max: number;
  color?: string;
  label?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {label && <div className="mt-1 text-[10px] text-gray-500">{label}</div>}
    </div>
  );
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

/** Dependency-free donut chart (stroke-dasharray on concentric circles). */
export function Donut({ segments, size = 168 }: { segments: DonutSegment[]; size?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 60;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 160 160" className="shrink-0">
        <g transform="translate(80,80) rotate(-90)">
          <circle r={r} fill="none" stroke="#e5e7eb" strokeWidth="22" />
          {segments.map((s) => {
            const len = (s.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <circle
                key={s.label}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="22"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" className="fill-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>
          {total.toFixed(1)}
        </text>
        <text x="80" y="94" textAnchor="middle" className="fill-gray-500" style={{ fontSize: 11 }}>
          GB total
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-gray-600 min-w-[110px]">{s.label}</span>
            <span className="font-semibold text-gray-900">{gb(s.value)}</span>
            <span className="text-gray-400">({Math.round((s.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TrendSeries {
  name: string;
  color: string;
  values: number[];
  dashed?: boolean;
}

/** Dependency-free multi-series line chart. */
export function TrendChart({
  series,
  labels,
  height = 260,
  min = 0,
  max = 100
}: {
  series: TrendSeries[];
  labels: string[];
  height?: number;
  min?: number;
  max?: number;
}) {
  const W = 760;
  const H = height;
  const padL = 46;
  const padB = 30;
  const plotW = W - padL - 16;
  const plotH = H - 24 - padB;
  const x = (i: number) => padL + (i * plotW) / Math.max(1, labels.length - 1);
  const y = (v: number) => 24 + plotH - ((v - min) / Math.max(1, max - min)) * plotH;
  const ticks = 5;
  return (
    <div className="overflow-x-auto">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="min-w-[680px]">
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = min + ((max - min) * i) / ticks;
          return (
            <g key={i}>
              <line x1={padL} x2={W - 16} y1={y(v)} y2={y(v)} stroke="#f1f5f9" />
              <text x={padL - 8} y={y(v) + 3} textAnchor="end" style={{ fontSize: 10 }} className="fill-gray-400">
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={`${l}-${i}`} x={x(i)} y={H - 8} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-500">
            {l}
          </text>
        ))}
        {series.map((s, i) => (
          <polyline
            key={s.name || `series-${i}`}
            fill="none"
            stroke={s.color}
            strokeWidth={s.dashed ? 1.5 : 2.5}
            strokeDasharray={s.dashed ? '5 4' : undefined}
            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          />
        ))}
      </svg>
      <div className="flex flex-wrap items-center gap-4 px-1 pt-2 text-[11px]">
        {series.map((s, i) => (
          <span key={s.name || `legend-${i}`} className="flex items-center gap-1.5 text-gray-600">
            <span
              className="inline-block w-4 h-0.5"
              style={{ background: s.color, opacity: s.dashed ? 0.6 : 1 }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export type Tier = 'HOT' | 'WARM' | 'COLD';

export function TierBadge({ tier }: { tier: Tier }) {
  const map: Record<Tier, { label: string; cls: string }> = {
    HOT: { label: '🔥 HOT', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    WARM: { label: '🌡️ WARM', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    COLD: { label: '❄️ COLD', cls: 'bg-sky-50 text-sky-700 border-sky-200' }
  };
  const m = map[tier];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>
      {m.label}
    </span>
  );
}

export function Pill({
  tone,
  children
}: {
  tone: 'green' | 'amber' | 'rose' | 'blue' | 'gray' | 'violet';
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200'
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

/** The Archive Management page header shared by all 8 screens. */
export function ArchiveHeader({
  icon: Icon,
  title,
  screen,
  restricted,
  actions
}: {
  icon: React.ElementType;
  title: string;
  screen: string;
  restricted?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="pb-4 border-b border-gray-200">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 flex-wrap">
        <span>Home</span>
        <span>&gt;</span>
        <span>Administration</span>
        <span>&gt;</span>
        <span>Archive Management</span>
        <span>&gt;</span>
        <span className="text-gray-800 font-semibold">{screen}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {title}
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded px-1.5 py-0.5">
                FY: 2025-26
              </span>
            </h1>
            <p className="text-xs text-gray-500">Archive Management · data lifecycle across primary, archive and cold tiers</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      {restricted && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          <span>⚠️</span>
          <span>{restricted}</span>
        </div>
      )}
    </div>
  );
}
