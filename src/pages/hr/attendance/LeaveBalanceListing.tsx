import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Settings,
  History,
  AlertCircle,
  TrendingDown,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';

const COLOR: Record<string, { bg: string; text: string; bar: string; soft: string; title: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', soft: 'bg-blue-100', title: 'text-blue-800' },
  green: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500', soft: 'bg-green-100', title: 'text-green-800' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500', soft: 'bg-orange-100', title: 'text-orange-800' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500', soft: 'bg-purple-100', title: 'text-purple-800' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', bar: 'bg-teal-500', soft: 'bg-teal-100', title: 'text-teal-800' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', bar: 'bg-pink-500', soft: 'bg-pink-100', title: 'text-pink-800' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500', soft: 'bg-indigo-100', title: 'text-indigo-800' },
  red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', soft: 'bg-red-100', title: 'text-red-800' }
};

const leaveTypes = [
  { key: 'cl', label: 'CL', fullName: 'Casual Leave', entitled: 12, color: 'blue' },
  { key: 'pl', label: 'PL', fullName: 'Privilege Leave', entitled: 15, color: 'green' },
  { key: 'sl', label: 'SL', fullName: 'Sick Leave', entitled: 10, color: 'orange' },
  { key: 'el', label: 'EL', fullName: 'Earned Leave', entitled: 20, color: 'purple' },
  { key: 'co', label: 'CO', fullName: 'Comp-Off', entitled: 0, color: 'teal' },
  { key: 'ml', label: 'ML', fullName: 'Maternity Leave', entitled: 180, color: 'pink' },
  { key: 'ptl', label: 'PTL', fullName: 'Paternity Leave', entitled: 15, color: 'indigo' },
  { key: 'lop', label: 'LOP', fullName: 'Loss of Pay', entitled: 0, color: 'red' }
] as const;

type LeaveKey = typeof leaveTypes[number]['key'];

type Employee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: string;
  cl: number;
  pl: number;
  sl: number;
  el: number;
  co: number;
  ml: number;
  ptl: number;
  lop: number;
  total: number;
  used: number;
  carryForward: number;
};

const SEED: Employee[] = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', status: 'Active', cl: 8, pl: 12, sl: 5, el: 15, co: 3, ml: 0, ptl: 0, lop: 0, total: 43, used: 14, carryForward: 5 },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', status: 'Active', cl: 5, pl: 8, sl: 3, el: 10, co: 1, ml: 0, ptl: 0, lop: 2, total: 27, used: 18, carryForward: 3 },
  { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', status: 'Active', cl: 10, pl: 15, sl: 6, el: 18, co: 2, ml: 0, ptl: 0, lop: 0, total: 51, used: 6, carryForward: 8 },
  { id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', status: 'Active', cl: 6, pl: 10, sl: 4, el: 12, co: 4, ml: 0, ptl: 0, lop: 1, total: 36, used: 12, carryForward: 4 },
  { id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', status: 'Active', cl: 12, pl: 14, sl: 6, el: 20, co: 0, ml: 0, ptl: 0, lop: 0, total: 52, used: 5, carryForward: 7 },
  { id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', status: 'Active', cl: 4, pl: 6, sl: 2, el: 8, co: 5, ml: 0, ptl: 0, lop: 3, total: 25, used: 22, carryForward: 2 },
  { id: 'EMP007', name: 'David Lee', department: 'IT Support', designation: 'IT Administrator', status: 'Active', cl: 9, pl: 11, sl: 5, el: 14, co: 2, ml: 0, ptl: 0, lop: 0, total: 41, used: 10, carryForward: 6 },
  { id: 'EMP008', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', status: 'Active', cl: 7, pl: 9, sl: 4, el: 11, co: 1, ml: 0, ptl: 0, lop: 1, total: 32, used: 15, carryForward: 3 },
  { id: 'EMP009', name: 'James Taylor', department: 'Engineering', designation: 'Tech Lead', status: 'Active', cl: 3, pl: 5, sl: 2, el: 6, co: 6, ml: 0, ptl: 0, lop: 0, total: 22, used: 25, carryForward: 4 },
  { id: 'EMP010', name: 'Jennifer Martinez', department: 'HR', designation: 'HR Executive', status: 'Active', cl: 11, pl: 13, sl: 6, el: 16, co: 0, ml: 0, ptl: 0, lop: 0, total: 46, used: 8, carryForward: 5 },
  { id: 'EMP011', name: 'Christopher Garcia', department: 'Finance', designation: 'Finance Manager', status: 'Active', cl: 2, pl: 4, sl: 1, el: 5, co: 3, ml: 0, ptl: 0, lop: 4, total: 15, used: 28, carryForward: 2 },
  { id: 'EMP012', name: 'Amanda Robinson', department: 'Marketing', designation: 'Content Writer', status: 'Probation', cl: 6, pl: 7, sl: 3, el: 10, co: 2, ml: 0, ptl: 0, lop: 0, total: 28, used: 5, carryForward: 0 }
];

const deptTrends = [
  { dept: 'Engineering', trend: 'up', change: '+5.2%' },
  { dept: 'HR', trend: 'down', change: '-2.1%' },
  { dept: 'Finance', trend: 'up', change: '+3.8%' },
  { dept: 'Marketing', trend: 'same', change: '0%' },
  { dept: 'Operations', trend: 'down', change: '-4.5%' },
  { dept: 'IT Support', trend: 'up', change: '+1.2%' },
  { dept: 'Sales', trend: 'up', change: '+2.9%' }
];

const HISTORY: Record<string, { date: string; type: string; days: number; remark: string }[]> = {
  EMP001: [{ date: '2024-01-05', type: 'CL', days: 2, remark: 'Family function' }, { date: '2024-01-15', type: 'SL', days: 2, remark: 'Fever' }],
  EMP002: [{ date: '2024-01-10', type: 'CL', days: 3, remark: 'Personal' }, { date: '2024-01-08', type: 'EL', days: 10, remark: 'Vacation' }],
  EMP006: [{ date: '2024-01-01', type: 'ML', days: 90, remark: 'Maternity' }]
};

const leaveBalance = (emp: Employee, key: LeaveKey) => emp[key];
const leaveUsed = (emp: Employee, key: LeaveKey, entitled: number) => {
  if (key === 'lop') return emp.lop;
  if (entitled <= 0) return 0;
  return Math.max(0, entitled - emp[key]);
};
const recalc = (emp: Employee): Employee => {
  const total = emp.cl + emp.pl + emp.sl + emp.el + emp.co + emp.ml + emp.ptl;
  const used = leaveTypes.reduce((s, t) => s + leaveUsed(emp, t.key, t.entitled), 0);
  return { ...emp, total, used };
};

const csvEscape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const EMPTY_DRAFT = { cl: 0, pl: 0, sl: 0, el: 0, co: 0, ml: 0, ptl: 0, lop: 0, carryForward: 0 };

export function LeaveBalanceListing() {
  const [rows, setRows] = useState<Employee[]>(SEED);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [asOn, setAsOn] = useState(new Date().toISOString().split('T')[0]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState<Record<LeaveKey, boolean>>({
    cl: true, pl: true, sl: true, el: true, co: true, ml: true, ptl: true, lop: true
  });
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [perPage, setPerPage] = useState('10');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [editDraft, setEditDraft] = useState(EMPTY_DRAFT);
  const [historyEmp, setHistoryEmp] = useState<Employee | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkType, setBulkType] = useState<LeaveKey>('cl');
  const [bulkDelta, setBulkDelta] = useState('1');

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = rows.filter((emp) => {
      const matchesSearch = !term || emp.name.toLowerCase().includes(term) || emp.id.toLowerCase().includes(term) || emp.department.toLowerCase().includes(term) || emp.designation.toLowerCase().includes(term);
      const matchesDept = deptFilter === 'all' || emp.department.toLowerCase() === deptFilter;
      const matchesStatus = statusFilter === 'all' || emp.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
    if (sortColumn) {
      list = [...list].sort((a, b) => {
        const av = (a as Record<string, string | number>)[sortColumn];
        const bv = (b as Record<string, string | number>)[sortColumn];
        if (typeof av === 'number' && typeof bv === 'number') return sortDirection === 'asc' ? av - bv : bv - av;
        return sortDirection === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return list;
  }, [rows, search, deptFilter, statusFilter, sortColumn, sortDirection]);

  const pageSize = Number(perPage) || 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (column: string) => {
    setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const SortIcon = ({ column }: { column: string }) => (
    sortColumn === column
      ? (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-blue-600" /> : <ChevronDown className="w-3 h-3 text-blue-600" />)
      : <ChevronUp className="w-3 h-3 text-gray-300" />
  );

  const exportRows = (list: Employee[], filename: string) => {
    const header = ['Emp ID', 'Name', 'Department', 'Designation', 'Status', ...leaveTypes.flatMap((t) => [`${t.label} Used`, `${t.label} Balance`]), 'Total Balance', 'Total Used', 'Carry Forward', 'As on'];
    const body = list.map((emp) => [
      emp.id, emp.name, emp.department, emp.designation, emp.status,
      ...leaveTypes.flatMap((t) => [leaveUsed(emp, t.key, t.entitled), leaveBalance(emp, t.key)]),
      emp.total, emp.used, emp.carryForward, asOn
    ]);
    downloadCsv(filename, [header, ...body]);
  };

  const openEdit = (emp: Employee) => {
    setEditEmp(emp);
    setEditDraft({ cl: emp.cl, pl: emp.pl, sl: emp.sl, el: emp.el, co: emp.co, ml: emp.ml, ptl: emp.ptl, lop: emp.lop, carryForward: emp.carryForward });
    setMenuFor(null);
  };

  const saveEdit = () => {
    if (!editEmp) return;
    setRows((prev) => prev.map((r) => r.id === editEmp.id ? recalc({ ...r, ...editDraft }) : r));
    setEditEmp(null);
    flash(`Leave balances updated for ${editEmp.name}.`);
  };

  const applyBulk = () => {
    const delta = Number(bulkDelta);
    if (!Number.isFinite(delta) || selectedRows.length === 0) {
      flash('Select employees and enter a valid adjustment.');
      return;
    }
    setRows((prev) => prev.map((r) => {
      if (!selectedRows.includes(r.id)) return r;
      const next = Math.max(0, r[bulkType] + delta);
      return recalc({ ...r, [bulkType]: next });
    }));
    setBulkOpen(false);
    flash(`Adjusted ${bulkType.toUpperCase()} by ${delta > 0 ? '+' : ''}${delta} for ${selectedRows.length} employee(s).`);
  };

  const refresh = () => {
    setSearch('');
    setDeptFilter('all');
    setStatusFilter('all');
    setSortColumn('');
    setSelectedRows([]);
    setPage(1);
    setRows(SEED.map((e) => ({ ...e })));
    flash('Listing refreshed.');
  };

  const printPage = () => window.print();

  const departments = Array.from(new Set(rows.map((r) => r.department)));
  const shownTypes = leaveTypes.filter((t) => visibleTypes[t.key]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Balance Listing</h1>
          <p className="text-sm text-gray-500">Company-wide leave ledger with current balances for all employees</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={refresh}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>
          <Button variant="outline" onClick={() => { exportRows(filtered, `leave-balance-${asOn}.csv`); flash('Excel file exported.'); }}><FileSpreadsheet className="w-4 h-4 mr-2" />Export Excel</Button>
          <Button variant="primary" onClick={() => { exportRows(filtered, `leave-balance-report-${asOn}.csv`); flash('Report downloaded.'); }}><Download className="w-4 h-4 mr-2" />Download Report</Button>
        </div>
      </div>

      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Input placeholder="Search by name, ID, department..." leftIcon={<Search className="w-4 h-4" />} className="w-72" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              <Select value={deptFilter} onChange={(v) => { setDeptFilter(v); setPage(1); }} options={[{ value: 'all', label: 'All Departments' }, ...departments.map((d) => ({ value: d.toLowerCase(), label: d }))]} />
              <Select value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'probation', label: 'Probation' }]} />
              <Button variant="outline" onClick={() => setShowMoreFilters((v) => !v)}><Filter className="w-4 h-4 mr-2" />{showMoreFilters ? 'Hide Filters' : 'More Filters'}</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">As on:</span>
              <Input type="date" value={asOn} onChange={(e) => setAsOn(e.target.value)} />
              <Button variant="outline" onClick={() => setShowColumns((v) => !v)}><Settings className="w-4 h-4 mr-2" />Columns</Button>
            </div>
          </div>

          {showMoreFilters && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <Select
                value={String(visibleTypes.lop)}
                onChange={(v) => setVisibleTypes((prev) => ({ ...prev, lop: v === 'true' }))}
                options={[{ value: 'true', label: 'Include LOP' }, { value: 'false', label: 'Hide LOP' }]}
              />
              <Button variant="outline" size="sm" onClick={() => { setDeptFilter('all'); setStatusFilter('all'); setSearch(''); setPage(1); }}>Clear filters</Button>
            </div>
          )}

          {showColumns && (
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              {leaveTypes.map((t) => (
                <label key={t.key} className="inline-flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={visibleTypes[t.key]} onChange={() => setVisibleTypes((prev) => ({ ...prev, [t.key]: !prev[t.key] }))} />
                  {t.label} — {t.fullName}
                </label>
              ))}
            </div>
          )}

          {selectedRows.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-blue-700"><span className="font-semibold">{selectedRows.length}</span> employee(s) selected</span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => setBulkOpen(true)}><Edit className="w-3 h-3 mr-1" />Bulk Adjust</Button>
                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => { exportRows(rows.filter((r) => selectedRows.includes(r.id)), `leave-balance-selected-${asOn}.csv`); flash('Selected rows exported.'); }}><Download className="w-3 h-3 mr-1" />Export Selected</Button>
                <Button variant="outline" className="text-sm py-1 px-3" onClick={() => setSelectedRows([])}>Clear Selection</Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left sticky left-0 bg-gray-50 z-20 border-r">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" checked={paged.length > 0 && paged.every((e) => selectedRows.includes(e.id))} onChange={() => {
                        const ids = paged.map((e) => e.id);
                        const allOn = ids.every((id) => selectedRows.includes(id));
                        setSelectedRows(allOn ? selectedRows.filter((id) => !ids.includes(id)) : Array.from(new Set([...selectedRows, ...ids])));
                      }} />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 sticky left-[40px] bg-gray-50 z-20 border-r" onClick={() => handleSort('id')}><div className="flex items-center gap-1">Emp ID<SortIcon column="id" /></div></th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 sticky left-[110px] bg-gray-50 z-20 border-r min-w-[180px]" onClick={() => handleSort('name')}><div className="flex items-center gap-1">Employee Name<SortIcon column="name" /></div></th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('department')}><div className="flex items-center gap-1">Department<SortIcon column="department" /></div></th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    {shownTypes.map((type) => {
                      const c = COLOR[type.color];
                      return (
                        <th key={type.key} className={`px-2 py-3 text-center text-xs font-medium uppercase cursor-pointer ${c.bg} ${c.text}`} onClick={() => handleSort(type.key)} title={type.fullName}>
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center gap-1">{type.label}<SortIcon column={type.key} /></div>
                            <span className="text-[9px] font-normal opacity-70">({type.entitled})</span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-100 border-l cursor-pointer" onClick={() => handleSort('total')}><div className="flex items-center justify-center gap-1">Total<SortIcon column="total" /></div></th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('used')}><div className="flex items-center justify-center gap-1">Used<SortIcon column="used" /></div></th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('carryForward')}><div className="flex items-center justify-center gap-1">CF<SortIcon column="carryForward" /></div></th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paged.map((emp, idx) => (
                    <tr key={emp.id} className={`hover:bg-blue-50/50 ${selectedRows.includes(emp.id) ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-3 py-2 sticky left-0 bg-inherit border-r"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" checked={selectedRows.includes(emp.id)} onChange={() => setSelectedRows((s) => s.includes(emp.id) ? s.filter((x) => x !== emp.id) : [...s, emp.id])} /></td>
                      <td className="px-3 py-2 text-xs font-medium text-blue-600 sticky left-[40px] bg-inherit border-r">{emp.id}</td>
                      <td className="px-3 py-2 sticky left-[110px] bg-inherit border-r">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">{emp.name.split(' ').map((n) => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                            <p className="text-xs text-gray-500 truncate">{emp.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">{emp.department}</td>
                      <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{emp.status}</span></td>
                      {shownTypes.map((type) => {
                        const used = leaveUsed(emp, type.key, type.entitled);
                        const bal = leaveBalance(emp, type.key);
                        return (
                          <td key={type.key} className="px-2 py-2 text-center">
                            <div className="flex flex-col items-center leading-tight">
                              <span className={`text-sm font-bold ${used > 0 ? COLOR[type.color].text : 'text-gray-400'}`}>{used}</span>
                              <span className={`text-[10px] ${bal <= 2 && type.key !== 'lop' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>Bal {bal}</span>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-center text-sm font-bold text-gray-900 bg-gray-50 border-l">{emp.total}</td>
                      <td className="px-3 py-2 text-center text-sm font-medium text-orange-600">{emp.used}</td>
                      <td className="px-3 py-2 text-center text-sm text-purple-600">{emp.carryForward}</td>
                      <td className="px-3 py-2 text-center border-l relative">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" title="View" onClick={() => { setViewEmp(emp); setMenuFor(null); }}><Eye className="w-4 h-4 text-gray-500" /></button>
                          <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" title="Edit" onClick={() => openEdit(emp)}><Edit className="w-4 h-4 text-gray-500" /></button>
                          <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" title="More" onClick={() => setMenuFor(menuFor === emp.id ? null : emp.id)}><MoreHorizontal className="w-4 h-4 text-gray-500" /></button>
                        </div>
                        {menuFor === emp.id && (
                          <div className="absolute right-2 top-10 z-30 w-40 rounded-lg border border-gray-200 bg-white shadow-lg text-left">
                            <button type="button" className="w-full px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => { setHistoryEmp(emp); setMenuFor(null); }}><History className="w-4 h-4" /> History</button>
                            <button type="button" className="w-full px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" onClick={() => { exportRows([emp], `leave-balance-${emp.id}.csv`); setMenuFor(null); flash(`Exported ${emp.name}.`); }}><Download className="w-4 h-4" /> Export row</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr><td colSpan={8 + shownTypes.length} className="px-4 py-8 text-center text-sm text-gray-500">No employees match the current filters.</td></tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr className="font-semibold">
                    <td colSpan={5} className="px-3 py-3 text-xs text-gray-700 sticky left-0 bg-gray-100 border-r">Total ({filtered.length} Employees)</td>
                    {shownTypes.map((type) => (
                      <td key={type.key} className={`px-2 py-3 text-center text-xs ${COLOR[type.color].text}`}>
                        <div className="flex flex-col items-center leading-tight">
                          <span className="font-bold">{filtered.reduce((s, e) => s + leaveUsed(e, type.key, type.entitled), 0)}</span>
                          <span className="text-[10px] font-normal">Bal {filtered.reduce((s, e) => s + leaveBalance(e, type.key), 0)}</span>
                        </div>
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 bg-gray-200 border-l">{filtered.reduce((s, e) => s + e.total, 0)}</td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-orange-700">{filtered.reduce((s, e) => s + e.used, 0)}</td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-purple-700">{filtered.reduce((s, e) => s + e.carryForward, 0)}</td>
                    <td className="px-3 py-3 border-l" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">Showing <span className="font-medium">{filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> employees</p>
              <Select value={perPage} onChange={(v) => { setPerPage(v); setPage(1); }} options={[{ value: '10', label: '10 per page' }, { value: '25', label: '25 per page' }, { value: '50', label: '50 per page' }, { value: '100', label: '100 per page' }]} />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" onClick={() => setPage(n)} className={`px-3 py-1 text-sm rounded ${n === safePage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{n}</button>
              ))}
              <Button variant="outline" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Leave Type Legend</h3>
          <div className="space-y-2">
            {leaveTypes.map((type) => {
              const total = rows.reduce((s, e) => s + leaveBalance(e, type.key), 0);
              const allBal = rows.reduce((s, e) => s + e.total, 0);
              const pct = allBal > 0 ? Math.round((total / allBal) * 100) : 0;
              const c = COLOR[type.color];
              return (
                <div key={type.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-10 h-6 flex items-center justify-center text-xs font-bold rounded ${c.bg} ${c.text}`}>{type.label}</span>
                    <span className="text-sm text-gray-700">{type.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${c.bar}`} style={{ width: `${pct}%` }} /></div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">{total}</span>
                  </div>
                </div>
              );
            })}
          </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Department Summary</h3>
          <div className="space-y-3">
            {departments.map((dept) => {
              const deptEmps = rows.filter((e) => e.department === dept);
              const total = deptEmps.reduce((s, e) => s + e.total, 0);
              const avg = deptEmps.length ? Math.round(total / deptEmps.length) : 0;
              return (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-gray-700 truncate">{dept}</span>
                    <span className="text-xs text-gray-400">({deptEmps.length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(total, 100)}%` }} /></div>
                    <span className="text-sm font-semibold text-gray-900 w-10 text-right">{total}</span>
                    <span className="text-xs text-gray-500 w-12 text-right">~{avg}/emp</span>
                  </div>
                </div>
              );
            })}
          </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Balance Alerts</h3>
          <div className="space-y-3">
            {[
              { icon: AlertCircle, title: 'Critical Low Balance', desc: 'Less than 2 days remaining', count: rows.filter((e) => leaveTypes.some((t) => t.entitled > 0 && e[t.key] < 2)).length, color: 'red' },
              { icon: TrendingDown, title: 'Low Balance Warning', desc: 'Less than 20% remaining', count: rows.filter((e) => leaveTypes.some((t) => t.entitled > 0 && e[t.key] <= t.entitled * 0.2)).length, color: 'orange' },
              { icon: Clock, title: 'Expiring Soon', desc: 'Carry forward expires in 30 days', count: rows.filter((e) => e.carryForward > 0).length, color: 'purple' },
              { icon: CheckCircle, title: 'Healthy Balance', desc: 'More than 80% remaining', count: rows.filter((e) => leaveTypes.filter((t) => t.entitled > 0).every((t) => e[t.key] >= t.entitled * 0.8)).length, color: 'green' }
            ].map((alert) => {
              const Icon = alert.icon;
              const c = COLOR[alert.color];
              return (
                <div key={alert.title} className={`flex items-center gap-3 p-3 ${c.bg} rounded-lg border ${c.bg.replace('50', '100')}`}>
                  <div className={`w-10 h-10 ${c.soft} rounded-full flex items-center justify-center`}><Icon className={`w-5 h-5 ${c.text}`} /></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${c.title}`}>{alert.title}</p>
                    <p className={`text-xs ${c.text}`}>{alert.desc}</p>
                  </div>
                  <span className={`text-xl font-bold ${c.text}`}>{alert.count}</span>
                </div>
              );
            })}
          </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Leave Balance Trend by Department</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Employees</th>
                {leaveTypes.slice(0, 5).map((type) => (
                  <th key={type.key} className={`px-4 py-3 text-center text-xs font-medium uppercase ${COLOR[type.color].text}`}>{type.label}</th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Balance</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg/Employee</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deptTrends.map((row) => {
                const deptEmps = rows.filter((e) => e.department === row.dept);
                const total = deptEmps.reduce((s, e) => s + e.total, 0);
                const avg = deptEmps.length ? Math.round(total / deptEmps.length) : 0;
                return (
                  <tr key={row.dept} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.dept}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{deptEmps.length}</td>
                    {leaveTypes.slice(0, 5).map((type) => (
                      <td key={type.key} className={`px-4 py-3 text-sm text-center font-medium ${COLOR[type.color].text}`}>{deptEmps.reduce((s, e) => s + leaveBalance(e, type.key), 0)}</td>
                    ))}
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">{total}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">{avg}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.trend === 'up' && <><ArrowUpRight className="w-4 h-4 text-green-500" /><span className="text-sm text-green-600">{row.change}</span></>}
                        {row.trend === 'down' && <><ArrowDownRight className="w-4 h-4 text-red-500" /><span className="text-sm text-red-600">{row.change}</span></>}
                        {row.trend === 'same' && <span className="text-sm text-gray-500">{row.change}</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={!!viewEmp} onClose={() => setViewEmp(null)} title={viewEmp ? `Leave balance — ${viewEmp.name}` : 'View'} size="lg" footer={<Button variant="outline" onClick={() => setViewEmp(null)}>Close</Button>}>
        {viewEmp && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{viewEmp.id} · {viewEmp.designation} · {viewEmp.department} · {viewEmp.status}</p>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-right">Entitled</th><th className="px-3 py-2 text-right">Used</th><th className="px-3 py-2 text-right">Balance</th></tr></thead>
              <tbody className="divide-y">
                {leaveTypes.map((t) => (
                  <tr key={t.key}>
                    <td className="px-3 py-2">{t.fullName}</td>
                    <td className="px-3 py-2 text-right">{t.entitled || '—'}</td>
                    <td className="px-3 py-2 text-right">{leaveUsed(viewEmp, t.key, t.entitled)}</td>
                    <td className="px-3 py-2 text-right font-semibold">{leaveBalance(viewEmp, t.key)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editEmp}
        onClose={() => setEditEmp(null)}
        title={editEmp ? `Edit balances — ${editEmp.name}` : 'Edit'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditEmp(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {leaveTypes.map((t) => (
            <div key={t.key}>
              <label className="text-xs text-gray-600">{t.fullName} balance</label>
              <Input type="number" min={0} value={editDraft[t.key]} onChange={(e) => setEditDraft((d) => ({ ...d, [t.key]: Number(e.target.value) }))} />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-600">Carry forward</label>
            <Input type="number" min={0} value={editDraft.carryForward} onChange={(e) => setEditDraft((d) => ({ ...d, carryForward: Number(e.target.value) }))} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!historyEmp} onClose={() => setHistoryEmp(null)} title={historyEmp ? `Leave history — ${historyEmp.name}` : 'History'} footer={<Button variant="outline" onClick={() => setHistoryEmp(null)}>Close</Button>}>
        {historyEmp && (
          (HISTORY[historyEmp.id] || []).length === 0
            ? <p className="text-sm text-gray-500">No leave history on file.</p>
            : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-right">Days</th><th className="px-3 py-2 text-left">Remark</th></tr></thead>
                <tbody className="divide-y">
                  {(HISTORY[historyEmp.id] || []).map((h, i) => (
                    <tr key={i}><td className="px-3 py-2">{h.date}</td><td className="px-3 py-2">{h.type}</td><td className="px-3 py-2 text-right">{h.days}</td><td className="px-3 py-2">{h.remark}</td></tr>
                  ))}
                </tbody>
              </table>
            )
        )}
      </Modal>

      <Modal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk balance adjustment"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={applyBulk}>Apply to {selectedRows.length} employee(s)</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Select value={bulkType} onChange={(v) => setBulkType(v as LeaveKey)} options={leaveTypes.map((t) => ({ value: t.key, label: `${t.label} — ${t.fullName}` }))} />
          <Input label="Days to add (use negative to subtract)" type="number" value={bulkDelta} onChange={(e) => setBulkDelta(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

export default LeaveBalanceListing;
