import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  ClipboardListIcon,
  DownloadIcon,
  FileTextIcon,
  PrinterIcon,
} from 'lucide-react';

interface ClassRow {
  id: string;
  className: string;
  teacher: string;
  chapters: number;
  planPct: number;
  homework: number;
  classwork: number;
  materials: number;
  lagging: string;
}

const ROWS: ClassRow[] = [
  { id: 'C-6A', className: 'Class 6-A', teacher: 'Mrs. Patel', chapters: 18, planPct: 82, homework: 24, classwork: 21, materials: 14, lagging: 'Fractions' },
  { id: 'C-6B', className: 'Class 6-B', teacher: 'Mrs. Sharma', chapters: 18, planPct: 74, homework: 20, classwork: 19, materials: 11, lagging: 'Geometry' },
  { id: 'C-8A', className: 'Class 8-A', teacher: 'Mr. Verma', chapters: 22, planPct: 91, homework: 31, classwork: 28, materials: 18, lagging: '—' },
  { id: 'C-9A', className: 'Class 9-A', teacher: 'Mr. Joshi', chapters: 20, planPct: 68, homework: 18, classwork: 16, materials: 9, lagging: 'Atoms & Molecules' },
  { id: 'C-10A', className: 'Class 10-A', teacher: 'Mr. Kapoor', chapters: 24, planPct: 88, homework: 36, classwork: 33, materials: 22, lagging: 'Trigonometry' },
  { id: 'C-11A', className: 'Class 11-A', teacher: 'Ms. Iyer', chapters: 16, planPct: 71, homework: 15, classwork: 14, materials: 12, lagging: 'Limits' },
  { id: 'C-12A', className: 'Class 12-A', teacher: 'Mrs. Nair', chapters: 15, planPct: 79, homework: 19, classwork: 17, materials: 15, lagging: 'Organic chemistry' },
];

const CLASS_OPTIONS = [
  { value: 'all', label: 'All classes' },
  ...ROWS.map((r) => ({ value: r.className, label: r.className })),
];

const YEAR_OPTIONS = [
  { value: '2025-26', label: '2025-26' },
  { value: '2024-25', label: '2024-25' },
];

const TERM_OPTIONS = [
  { value: 'all', label: 'All terms' },
  { value: 'term-1', label: 'Term 1' },
  { value: 'term-2', label: 'Term 2' },
];

export function AcademicReportsPage() {
  const [klass, setKlass] = useState('all');
  const [year, setYear] = useState('2025-26');
  const [term, setTerm] = useState('all');

  const rows = useMemo(
    () => ROWS.filter((r) => klass === 'all' || r.className === klass),
    [klass],
  );

  const stats = useMemo(() => {
    const avgPlan = rows.length ? Math.round(rows.reduce((n, r) => n + r.planPct, 0) / rows.length) : 0;
    return {
      classes: rows.length,
      avgPlan,
      homework: rows.reduce((n, r) => n + r.homework, 0),
      classwork: rows.reduce((n, r) => n + r.classwork, 0),
    };
  }, [rows]);

  const columns = [
    { key: 'className', header: 'Class' },
    { key: 'teacher', header: 'Class teacher' },
    { key: 'chapters', header: 'Chapters' },
    {
      key: 'planPct',
      header: 'Plan completion',
      render: (r: ClassRow) => (
        <Badge variant={r.planPct >= 85 ? 'success' : r.planPct >= 70 ? 'warning' : 'danger'}>{r.planPct}%</Badge>
      ),
    },
    { key: 'homework', header: 'Homework' },
    { key: 'classwork', header: 'Classwork' },
    { key: 'materials', header: 'Study material' },
    { key: 'lagging', header: 'Lagging topic' },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Academic Reports</h1>
          <p className="text-sm text-gray-500">
            Teaching plan progress, classwork, homework and study material by class · {year}
            {term !== 'all' ? ` · ${TERM_OPTIONS.find((t) => t.value === term)?.label}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><PrinterIcon className="mr-1 h-4 w-4" /> Print</Button>
          <Button variant="primary" size="sm"><DownloadIcon className="mr-1 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Academic year" value={year} options={YEAR_OPTIONS} onChange={(e) => setYear(e.target.value)} />
          <Select label="Term" value={term} options={TERM_OPTIONS} onChange={(e) => setTerm(e.target.value)} />
          <Select label="Class" value={klass} options={CLASS_OPTIONS} onChange={(e) => setKlass(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-50 p-2 text-indigo-600"><ClipboardListIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Classes</p><p className="text-lg font-bold">{stats.classes}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-green-50 p-2 text-green-600"><FileTextIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Avg plan completion</p><p className="text-lg font-bold">{stats.avgPlan}%</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-600"><FileTextIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Homework posted</p><p className="text-lg font-bold">{stats.homework}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-amber-50 p-2 text-amber-600"><FileTextIcon className="h-5 w-5" /></div>
            <div><p className="text-xs text-gray-500">Classwork posted</p><p className="text-lg font-bold">{stats.classwork}</p></div>
          </div>
        </Card>
      </div>

      <Card title="Class-wise academic progress">
        <Table columns={columns} data={rows} emptyMessage="No academic records for this filter" />
      </Card>
    </div>
  );
}

export default AcademicReportsPage;
