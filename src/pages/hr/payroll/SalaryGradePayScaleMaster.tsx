import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Layers,
  DollarSign,
  Copy,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CalcType = 'Flat Amount' | '% of Pay Head' | 'Sum of Pay Heads' | 'Days Based';

interface PayHeadInGrade {
  id: string;
  payHeadCode: string;
  payHeadName: string;
  abbr: string;
  calculationType: CalcType;
  calculationValue: string;
  dependsOnComponent: string; // used when calculationType = '% of Pay Head'
  percentValue: number;       // used when calculationType = '% of Pay Head'
  isMandatory: boolean;
}

interface SalaryGrade {
  id: string;
  gradeCode: string;
  gradeName: string;
  salaryStructure: string;   // ← linked salary structure code
  payScaleNotation: string;
  minimumBasic: number;
  maximumBasic: number;
  incrementStep: number;
  payHeads: PayHeadInGrade[];
  applicableStaffTypes: string[];
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Inactive';
}

// ─── Static Options ───────────────────────────────────────────────────────────

// These match the components defined in PayHeadMaster (Salary Component page)
const SALARY_COMPONENT_OPTIONS = [
  { value: 'BASIC',   label: 'Basic Salary (BASIC)',                 abbr: 'BASIC',  type: 'Earning' },
  { value: 'DA',      label: 'Dearness Allowance (DA)',              abbr: 'DA',     type: 'Earning' },
  { value: 'HRA',     label: 'House Rent Allowance (HRA)',           abbr: 'HRA',    type: 'Earning' },
  { value: 'CONV',    label: 'Conveyance Allowance (CONV)',          abbr: 'CONV',   type: 'Earning' },
  { value: 'SPECIAL', label: 'Special Allowance (SPECIAL)',          abbr: 'SA',     type: 'Earning' },
  { value: 'PF_EMP',  label: 'Provident Fund – Employee (PF_EMP)',   abbr: 'PF',     type: 'Deduction' },
  { value: 'ESI_EMP', label: 'ESI – Employee (ESI_EMP)',             abbr: 'ESI',    type: 'Deduction' },
  { value: 'PT',      label: 'Professional Tax (PT)',                abbr: 'PT',     type: 'Deduction' },
  { value: 'TDS',     label: 'TDS (TDS)',                            abbr: 'TDS',    type: 'Deduction' },
  { value: 'PF_ER',   label: 'Provident Fund – Employer (PF_ER)',    abbr: 'PF-ER',  type: 'Employer Contribution' },
  { value: 'ESI_ER',  label: 'ESI – Employer (ESI_ER)',              abbr: 'ESI-ER', type: 'Employer Contribution' },
  { value: 'GRATUITY',label: 'Gratuity Accrual (GRATUITY)',          abbr: 'GR',     type: 'Employer Contribution' },
];

// These match the structures defined in SalaryStructureMaster
const SALARY_STRUCTURE_OPTIONS = [
  { value: '',           label: '— Select Salary Structure —' },
  { value: 'TSS-2026',   label: 'Teaching Staff Structure (TSS-2026)' },
  { value: 'NSS-2026',   label: 'Non-Teaching Staff Structure (NSS-2026)' },
  { value: 'ADMIN-2026', label: 'Administrative Structure (ADMIN-2026)' },
];

const STAFF_TYPE_OPTIONS = [
  { value: 'Teaching – Senior',  label: 'Teaching – Senior' },
  { value: 'Teaching – Regular', label: 'Teaching – Regular' },
  { value: 'HOD',                label: 'HOD' },
  { value: 'Administrative',     label: 'Administrative' },
  { value: 'Non-Teaching',       label: 'Non-Teaching' },
  { value: 'Support Staff',      label: 'Support Staff' },
  { value: 'Contract',           label: 'Contract' },
];

const CALC_TYPE_OPTIONS: { value: CalcType; label: string }[] = [
  { value: 'Flat Amount',      label: 'Flat Amount' },
  { value: '% of Pay Head',    label: '% of Pay Head' },
  { value: 'Sum of Pay Heads', label: 'Sum of Pay Heads' },
  { value: 'Days Based',       label: 'Days Based (Present / Payment Days)' },
];

// Components that can be selected as a "depends-on" reference for % calculation
const PERCENT_BASE_OPTIONS = [
  { value: '',        label: '— Select base component —' },
  ...SALARY_COMPONENT_OPTIONS.map((c) => ({ value: c.value, label: c.label })),
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyPayHead = (): PayHeadInGrade => ({
  id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  payHeadCode: '',
  payHeadName: '',
  abbr: '',
  calculationType: 'Flat Amount',
  calculationValue: '',
  dependsOnComponent: '',
  percentValue: 0,
  isMandatory: true,
});

const emptyForm = {
  gradeCode: '',
  gradeName: '',
  salaryStructure: '',
  payScaleNotation: '',
  minimumBasic: 0,
  maximumBasic: 0,
  incrementStep: 0,
  applicableStaffTypes: [] as string[],
  effectiveFrom: '',
  effectiveTo: '',
  status: 'Active' as 'Active' | 'Inactive',
};

/** Build human-readable calculation value string from structured fields */
function buildCalcValue(row: PayHeadInGrade): string {
  if (row.calculationType === 'Flat Amount')      return row.calculationValue;
  if (row.calculationType === '% of Pay Head')    return `${row.percentValue}% of ${row.dependsOnComponent}`;
  if (row.calculationType === 'Sum of Pay Heads') return `Sum of selected components`;
  if (row.calculationType === 'Days Based')       return `${row.payHeadCode} × present days / payment days`;
  return row.calculationValue;
}

function inr(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockGrades: SalaryGrade[] = [
  {
    id: 'SG001',
    gradeCode: 'GR-A',
    gradeName: 'Grade A – Senior',
    salaryStructure: 'TSS-2026',
    payScaleNotation: '56,100–1,77,500',
    minimumBasic: 56100,
    maximumBasic: 177500,
    incrementStep: 1800,
    payHeads: [
      { id: 'ph1', payHeadCode: 'BASIC', payHeadName: 'Basic Salary',        abbr: 'BASIC',  calculationType: 'Flat Amount',   calculationValue: '56100',        dependsOnComponent: '',       percentValue: 0,  isMandatory: true },
      { id: 'ph2', payHeadCode: 'DA',    payHeadName: 'Dearness Allowance',  abbr: 'DA',     calculationType: '% of Pay Head', calculationValue: '50% of BASIC', dependsOnComponent: 'BASIC',  percentValue: 50, isMandatory: true },
      { id: 'ph3', payHeadCode: 'HRA',   payHeadName: 'HRA',                 abbr: 'HRA',    calculationType: '% of Pay Head', calculationValue: '40% of BASIC', dependsOnComponent: 'BASIC',  percentValue: 40, isMandatory: true },
      { id: 'ph4', payHeadCode: 'PF_EMP',payHeadName: 'PF (Employee)',       abbr: 'PF',     calculationType: '% of Pay Head', calculationValue: '12% of BASIC', dependsOnComponent: 'BASIC',  percentValue: 12, isMandatory: true },
    ],
    applicableStaffTypes: ['Teaching – Senior', 'HOD'],
    effectiveFrom: '2024-04-01',
    effectiveTo: '2025-03-31',
    status: 'Active',
  },
  {
    id: 'SG002',
    gradeCode: 'GR-B',
    gradeName: 'Grade B – Regular',
    salaryStructure: 'TSS-2026',
    payScaleNotation: '44,900–1,42,400',
    minimumBasic: 44900,
    maximumBasic: 142400,
    incrementStep: 1500,
    payHeads: [
      { id: 'ph5', payHeadCode: 'BASIC', payHeadName: 'Basic Salary',       abbr: 'BASIC', calculationType: 'Flat Amount',   calculationValue: '44900',        dependsOnComponent: '',      percentValue: 0,  isMandatory: true },
      { id: 'ph6', payHeadCode: 'DA',    payHeadName: 'Dearness Allowance', abbr: 'DA',    calculationType: '% of Pay Head', calculationValue: '50% of BASIC', dependsOnComponent: 'BASIC', percentValue: 50, isMandatory: true },
      { id: 'ph7', payHeadCode: 'HRA',   payHeadName: 'HRA',                abbr: 'HRA',   calculationType: '% of Pay Head', calculationValue: '40% of BASIC', dependsOnComponent: 'BASIC', percentValue: 40, isMandatory: true },
    ],
    applicableStaffTypes: ['Teaching – Regular', 'Administrative'],
    effectiveFrom: '2024-04-01',
    effectiveTo: '2025-03-31',
    status: 'Active',
  },
  {
    id: 'SG003',
    gradeCode: 'GR-C',
    gradeName: 'Grade C – Junior',
    salaryStructure: 'NSS-2026',
    payScaleNotation: '35,400–1,12,400',
    minimumBasic: 35400,
    maximumBasic: 112400,
    incrementStep: 1200,
    payHeads: [
      { id: 'ph8', payHeadCode: 'BASIC', payHeadName: 'Basic Salary', abbr: 'BASIC', calculationType: 'Flat Amount',   calculationValue: '35400',        dependsOnComponent: '',      percentValue: 0,  isMandatory: true },
      { id: 'ph9', payHeadCode: 'HRA',   payHeadName: 'HRA',          abbr: 'HRA',   calculationType: '% of Pay Head', calculationValue: '30% of BASIC', dependsOnComponent: 'BASIC', percentValue: 30, isMandatory: true },
      { id: 'ph10',payHeadCode: 'PT',    payHeadName: 'Professional Tax', abbr: 'PT', calculationType: 'Flat Amount',  calculationValue: '200',          dependsOnComponent: '',      percentValue: 0,  isMandatory: false },
    ],
    applicableStaffTypes: ['Non-Teaching', 'Support Staff'],
    effectiveFrom: '2024-04-01',
    effectiveTo: '2025-03-31',
    status: 'Active',
  },
  {
    id: 'SG004',
    gradeCode: 'GR-D',
    gradeName: 'Grade D – Support',
    salaryStructure: 'NSS-2026',
    payScaleNotation: '18,000–56,900',
    minimumBasic: 18000,
    maximumBasic: 56900,
    incrementStep: 600,
    payHeads: [
      { id: 'ph11', payHeadCode: 'BASIC', payHeadName: 'Basic Salary', abbr: 'BASIC', calculationType: 'Flat Amount', calculationValue: '18000', dependsOnComponent: '', percentValue: 0, isMandatory: true },
    ],
    applicableStaffTypes: ['Support Staff', 'Contract'],
    effectiveFrom: '2024-04-01',
    effectiveTo: '2025-03-31',
    status: 'Active',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function SalaryGradePayScaleMaster() {
  const [grades, setGrades] = useState<SalaryGrade[]>(mockGrades);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState(emptyForm);
  const [payHeadRows, setPayHeadRows] = useState<PayHeadInGrade[]>([emptyPayHead()]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered = grades.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch =
      g.gradeName.toLowerCase().includes(q) || g.gradeCode.toLowerCase().includes(q);
    const matchStatus = !statusFilter || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = grades.filter((g) => g.status === 'Active').length;
  const avgMin = Math.round(grades.reduce((s, g) => s + g.minimumBasic, 0) / (grades.length || 1));
  const avgMax = Math.round(grades.reduce((s, g) => s + g.maximumBasic, 0) / (grades.length || 1));

  // ── Handlers ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm(emptyForm);
    setPayHeadRows([emptyPayHead()]);
    setShowForm(false);
    setEditId(null);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setPayHeadRows([emptyPayHead()]);
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (g: SalaryGrade) => {
    setForm({
      gradeCode: g.gradeCode,
      gradeName: g.gradeName,
      salaryStructure: g.salaryStructure,
      payScaleNotation: g.payScaleNotation,
      minimumBasic: g.minimumBasic,
      maximumBasic: g.maximumBasic,
      incrementStep: g.incrementStep,
      applicableStaffTypes: g.applicableStaffTypes,
      effectiveFrom: g.effectiveFrom,
      effectiveTo: g.effectiveTo,
      status: g.status,
    });
    setPayHeadRows(g.payHeads.length ? [...g.payHeads] : [emptyPayHead()]);
    setEditId(g.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.gradeCode.trim() || !form.gradeName.trim()) return;

    // Finalise calculation values for each pay head row
    const finalPayHeads: PayHeadInGrade[] = payHeadRows
      .filter((r) => r.payHeadCode)
      .map((r) => ({ ...r, calculationValue: buildCalcValue(r) }));

    const payload: SalaryGrade = {
      id: editId || `SG${Date.now()}`,
      ...form,
      payHeads: finalPayHeads,
    };

    setGrades((prev) =>
      editId ? prev.map((g) => (g.id === editId ? payload : g)) : [...prev, payload],
    );
    resetForm();
  };

  const handleClone = (g: SalaryGrade) => {
    setGrades((prev) => [
      ...prev,
      {
        ...g,
        id: `SG${Date.now()}`,
        gradeCode: `${g.gradeCode}_COPY`,
        gradeName: `${g.gradeName} (Copy)`,
        status: 'Active',
      },
    ]);
  };

  const handleDelete = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  // ── Pay Head Row Helpers ─────────────────────────────────────────────────────

  /** When user picks a component from the dropdown, auto-fill name + abbr */
  const applyPayHeadComponent = (rowId: string, code: string) => {
    const found = SALARY_COMPONENT_OPTIONS.find((c) => c.value === code);
    setPayHeadRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, payHeadCode: code, payHeadName: found?.label.split(' (')[0] ?? '', abbr: found?.abbr ?? '' }
          : r,
      ),
    );
  };

  const updatePayHeadRow = (rowId: string, patch: Partial<PayHeadInGrade>) =>
    setPayHeadRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));

  const removePayHeadRow = (rowId: string) =>
    setPayHeadRows((prev) => prev.filter((r) => r.id !== rowId));

  // ── Type badge colour ────────────────────────────────────────────────────────
  const componentTypeBadge = (code: string) => {
    const found = SALARY_COMPONENT_OPTIONS.find((c) => c.value === code);
    if (!found) return 'secondary';
    if (found.type === 'Earning')              return 'success';
    if (found.type === 'Deduction')            return 'danger';
    if (found.type === 'Employer Contribution') return 'info';
    return 'secondary';
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">

      {/* ── Page Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Grade / Pay Scale Master</h1>
          <p className="text-sm text-gray-500">
            Configure grade-wise pay scale, pay heads, and link salary structures
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Grades',   value: grades.length,                       icon: Layers,     bg: 'bg-blue-100',   iconColor: 'text-blue-600' },
          { label: 'Active Grades',  value: activeCount,                          icon: Layers,     bg: 'bg-green-100',  iconColor: 'text-green-600' },
          { label: 'Avg Min Basic',  value: `₹${(avgMin / 1000).toFixed(0)}K`,   icon: DollarSign, bg: 'bg-purple-100', iconColor: 'text-purple-600' },
          { label: 'Avg Max Basic',  value: `₹${(avgMax / 1000).toFixed(0)}K`,   icon: DollarSign, bg: 'bg-amber-100',  iconColor: 'text-amber-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-lg border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grade List ── */}
      <Card>
        {/* Search + Filter bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search grades…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select
            options={[
              { value: '',         label: 'All Statuses' },
              { value: 'Active',   label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}   // ← fixed: was e.target.value
          />
        </div>

        {/* Grade rows */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b-2 border-gray-200 py-3 px-4 grid grid-cols-12 gap-2">
            {['Grade', 'Pay Scale', 'Basic Range', 'Structure', 'Staff Types', 'Status', 'Actions'].map(
              (h, idx) => (
                <span
                  key={h}
                  className={`text-xs font-semibold text-gray-600 uppercase ${
                    idx === 0 ? 'col-span-3' :
                    idx === 1 ? 'col-span-2 text-center' :
                    idx === 2 ? 'col-span-2 text-center' :
                    idx === 3 ? 'col-span-1 text-center' :
                    idx === 4 ? 'col-span-1 text-center' :
                    idx === 5 ? 'col-span-1 text-center' :
                                'col-span-2 text-center'
                  }`}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">No grades found.</p>
          )}

          {filtered.map((g, i) => (
            <div key={g.id}>
              {/* Row */}
              <div
                className={`py-3 px-4 grid grid-cols-12 gap-2 items-center border-b border-gray-100
                  hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}
              >
                {/* Grade name + code + expand toggle */}
                <div className="col-span-3 flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(g.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={expandedIds.includes(g.id) ? 'Collapse' : 'Expand pay heads'}
                  >
                    {expandedIds.includes(g.id)
                      ? <ChevronDown  className="w-4 h-4 text-gray-500" />
                      : <ChevronRight className="w-4 h-4 text-gray-500" />}
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{g.gradeName}</p>
                    <p className="text-xs text-gray-500">{g.gradeCode}</p>
                  </div>
                </div>

                {/* Pay Scale */}
                <div className="col-span-2 text-center text-xs text-gray-600">
                  {g.payScaleNotation || '—'}
                </div>

                {/* Basic Range */}
                <div className="col-span-2 text-center text-xs text-gray-600">
                  {inr(g.minimumBasic)} – {inr(g.maximumBasic)}
                </div>

                {/* Linked Structure */}
                <div className="col-span-1 text-center">
                  {g.salaryStructure
                    ? <Badge variant="info">{g.salaryStructure}</Badge>
                    : <span className="text-xs text-gray-400">—</span>}
                </div>

                {/* Staff Types */}
                <div className="col-span-1 text-center text-xs text-gray-600">
                  {g.applicableStaffTypes.length
                    ? `${g.applicableStaffTypes[0]}${g.applicableStaffTypes.length > 1 ? ` +${g.applicableStaffTypes.length - 1}` : ''}`
                    : '—'}
                </div>

                {/* Status */}
                <div className="col-span-1 text-center">
                  <Badge variant={g.status === 'Active' ? 'success' : 'secondary'}>
                    {g.status}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center gap-1">
                  <button
                    onClick={() => handleEdit(g)}
                    className="p-1.5 hover:bg-blue-100 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleClone(g)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                    title="Clone"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}   // ← fixed: was missing onClick
                    className="p-1.5 hover:bg-red-100 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* ── Expanded Pay Heads Panel ── */}
              {expandedIds.includes(g.id) && (
                <div className="bg-blue-50/40 border-b border-gray-200 px-8 py-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
                    Pay Heads in this Grade ({g.payHeads.length})
                  </p>
                  {g.payHeads.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No pay heads configured.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead>
                          <tr className="text-xs text-gray-500 border-b border-blue-100">
                            <th className="text-left pb-2 pr-4">Pay Head</th>
                            <th className="text-left pb-2 pr-4">Abbr</th>
                            <th className="text-left pb-2 pr-4">Type</th>
                            <th className="text-left pb-2 pr-4">Calculation</th>
                            <th className="text-left pb-2 pr-4">Value</th>
                            <th className="text-center pb-2">Mandatory</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.payHeads.map((ph) => (
                            <tr key={ph.id} className="border-t border-blue-100">
                              <td className="py-1.5 pr-4 font-medium text-gray-800">
                                {ph.payHeadName}{' '}
                                <span className="text-gray-400 font-normal">({ph.payHeadCode})</span>
                              </td>
                              <td className="py-1.5 pr-4 text-gray-600">{ph.abbr}</td>
                              <td className="py-1.5 pr-4">
                                <Badge variant={componentTypeBadge(ph.payHeadCode) as any}>
                                  {SALARY_COMPONENT_OPTIONS.find(c => c.value === ph.payHeadCode)?.type ?? '—'}
                                </Badge>
                              </td>
                              <td className="py-1.5 pr-4 text-gray-600">{ph.calculationType}</td>
                              <td className="py-1.5 pr-4 text-gray-600">{ph.calculationValue}</td>
                              <td className="py-1.5 text-center">
                                <Badge variant={ph.isMandatory ? 'success' : 'secondary'}>
                                  {ph.isMandatory ? 'Yes' : 'No'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL FORM  (matches the modal pattern used in PayHeadMaster
                       and SalaryStructureMaster)
         ══════════════════════════════════════════════════════════════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/40 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <aside className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editId ? 'Edit Salary Grade' : 'Add Salary Grade'}
                </h2>
                <p className="text-xs text-gray-500">
                  Configure grade details, pay scale, pay heads and linked salary structure
                </p>
              </div>
              <button type="button" onClick={resetForm} aria-label="Close">
                <X className="h-5 w-5 text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">

              {/* ── Section 1: Grade Details ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b">
                  Grade Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Grade Code *"
                    value={form.gradeCode}
                    onChange={(e) => setForm({ ...form, gradeCode: e.target.value })}
                    placeholder="e.g., GR-A"
                  />
                  <Input
                    label="Grade Name *"
                    value={form.gradeName}
                    onChange={(e) => setForm({ ...form, gradeName: e.target.value })}
                    placeholder="e.g., Grade A – Senior"
                  />
                  <Select
                    label="Linked Salary Structure"
                    options={SALARY_STRUCTURE_OPTIONS}
                    value={form.salaryStructure}
                    onChange={(v) => setForm({ ...form, salaryStructure: v })}
                  />
                  <Select
                    label="Status"
                    options={[
                      { value: 'Active',   label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                    ]}
                    value={form.status}
                    onChange={(v) => setForm({ ...form, status: v as 'Active' | 'Inactive' })}
                  />
                </div>
              </div>

              {/* ── Section 2: Pay Scale ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b">
                  Pay Scale
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Pay Scale Notation"
                    value={form.payScaleNotation}
                    onChange={(e) => setForm({ ...form, payScaleNotation: e.target.value })}
                    placeholder="e.g., 44,900–1,42,400"
                  />
                  <Input
                    label="Increment Step (₹)"
                    type="number"
                    value={form.incrementStep}
                    onChange={(e) => setForm({ ...form, incrementStep: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    label="Minimum Basic (₹) *"
                    type="number"
                    value={form.minimumBasic}
                    onChange={(e) => setForm({ ...form, minimumBasic: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    label="Maximum Basic (₹) *"
                    type="number"
                    value={form.maximumBasic}
                    onChange={(e) => setForm({ ...form, maximumBasic: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    label="Effective From"
                    type="date"
                    value={form.effectiveFrom}
                    onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
                  />
                  <Input
                    label="Effective To"
                    type="date"
                    value={form.effectiveTo}
                    onChange={(e) => setForm({ ...form, effectiveTo: e.target.value })}
                  />
                </div>
              </div>

              {/* ── Section 3: Applicable Staff Types ── */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-1 border-b">
                  Applicable Staff Types
                </h3>
                <MultiSelect
                  label="Staff Types"
                  options={STAFF_TYPE_OPTIONS}
                  value={form.applicableStaffTypes}
                  onChange={(v) => setForm({ ...form, applicableStaffTypes: v })}
                  placeholder="Select applicable staff types…"
                />
              </div>

              {/* ── Section 4: Pay Heads ── */}
              <div>
                <div className="flex items-center justify-between mb-3 pb-1 border-b">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Pay Heads</h3>
                    <p className="text-xs text-gray-500">
                      Add salary components with their calculation for this grade
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setPayHeadRows((prev) => [...prev, emptyPayHead()])}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Row
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm min-w-[900px]">
                    <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-3 py-2 w-8">No.</th>
                        <th className="px-3 py-2 min-w-[220px]">Salary Component</th>
                        <th className="px-3 py-2 w-20">Abbr</th>
                        <th className="px-3 py-2 min-w-[180px]">Calculation Type</th>
                        {/* Conditional columns shown in cells below */}
                        <th className="px-3 py-2 min-w-[200px]">Calculation Value / Details</th>
                        <th className="px-3 py-2 text-center w-24">Mandatory</th>
                        <th className="px-3 py-2 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {payHeadRows.map((row, index) => (
                        <tr key={row.id} className="border-t align-top">
                          {/* No. */}
                          <td className="px-3 py-3 text-gray-500 text-xs">{index + 1}</td>

                          {/* Component Selector */}
                          <td className="px-3 py-2">
                            <Select
                              options={[
                                { value: '', label: '— Select component —' },
                                ...SALARY_COMPONENT_OPTIONS.map((c) => ({
                                  value: c.value,
                                  label: c.label,
                                })),
                              ]}
                              value={row.payHeadCode}
                              onChange={(v) => applyPayHeadComponent(row.id, v)}
                            />
                            {/* Show type badge below selector */}
                            {row.payHeadCode && (
                              <span className="mt-1 inline-block">
                                <Badge variant={componentTypeBadge(row.payHeadCode) as any}>
                                  {SALARY_COMPONENT_OPTIONS.find(c => c.value === row.payHeadCode)?.type}
                                </Badge>
                              </span>
                            )}
                          </td>

                          {/* Abbr (auto-filled, editable) */}
                          <td className="px-3 py-2">
                            <Input
                              value={row.abbr}
                              onChange={(e) => updatePayHeadRow(row.id, { abbr: e.target.value })}
                              placeholder="Abbr"
                            />
                          </td>

                          {/* Calculation Type */}
                          <td className="px-3 py-2">
                            <Select
                              options={CALC_TYPE_OPTIONS}
                              value={row.calculationType}
                              onChange={(v) =>
                                updatePayHeadRow(row.id, {
                                  calculationType: v as CalcType,
                                  calculationValue: '',
                                  dependsOnComponent: '',
                                  percentValue: 0,
                                })
                              }
                            />
                          </td>

                          {/* Calculation Value / Details — conditional on type */}
                          <td className="px-3 py-2 space-y-2">
                            {/* Flat Amount */}
                            {row.calculationType === 'Flat Amount' && (
                              <Input
                                type="number"
                                placeholder="Amount in ₹"
                                value={row.calculationValue}
                                onChange={(e) =>
                                  updatePayHeadRow(row.id, { calculationValue: e.target.value })
                                }
                              />
                            )}

                            {/* % of Pay Head */}
                            {row.calculationType === '% of Pay Head' && (
                              <div className="space-y-2">
                                <Input
                                  type="number"
                                  placeholder="Percentage %"
                                  value={row.percentValue || ''}
                                  onChange={(e) =>
                                    updatePayHeadRow(row.id, {
                                      percentValue: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                />
                                <Select
                                  options={PERCENT_BASE_OPTIONS}
                                  value={row.dependsOnComponent}
                                  onChange={(v) =>
                                    updatePayHeadRow(row.id, { dependsOnComponent: v })
                                  }
                                />
                                {/* Live preview */}
                                {row.percentValue > 0 && row.dependsOnComponent && (
                                  <p className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                                    Preview:{' '}
                                    <span className="font-medium">
                                      {row.percentValue}% of {row.dependsOnComponent}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Sum of Pay Heads */}
                            {row.calculationType === 'Sum of Pay Heads' && (
                              <p className="text-xs text-gray-500 italic pt-1">
                                Sum of all selected earnings components
                              </p>
                            )}

                            {/* Days Based */}
                            {row.calculationType === 'Days Based' && (
                              <p className="text-xs text-gray-500 italic pt-1">
                                Component × (Present Days / Payment Days)
                              </p>
                            )}
                          </td>

                          {/* Mandatory toggle */}
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded text-blue-600"
                              checked={row.isMandatory}
                              onChange={(e) =>
                                updatePayHeadRow(row.id, { isMandatory: e.target.checked })
                              }
                            />
                          </td>

                          {/* Delete row */}
                          <td className="px-3 py-3">
                            {payHeadRows.length > 1 && (
                              <button
                                type="button"
                                className="rounded p-1 hover:bg-red-50"
                                onClick={() => removePayHeadRow(row.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t bg-gray-50 px-6 py-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editId ? 'Update' : 'Create'} Grade
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default SalaryGradePayScaleMaster;