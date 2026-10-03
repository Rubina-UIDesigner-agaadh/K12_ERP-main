import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Layers,
  Calculator,
  Save,
  RefreshCw,
  Download,
  Search,
  AlertCircle,
  CheckCircle,
  BookOpen,
  FileText,
  XCircle } from
'lucide-react';

/**
 * Bulk Scholarship Allocation (Single General Ledger)
 * ---------------------------------------------------
 * Goal:
 *  - Allocate (adjust) sanctioned scholarship amounts to a selected fee head in bulk.
 *  - Since finance has ONLY ONE ledger (General Ledger), we show a simple, clear GL posting preview:
 *
 *      Dr: Scholarship Adjustment / Scholarship Expense (configurable text)
 *      Cr: Student Fee Receivable (configurable text)
 *
 *  - Records a single GL batch entry (total debit = total credit) and per-student allocation rows.
 *
 * Notes:
 *  - This UI is detailed but intentionally simple to understand.
 *  - In real systems, account heads would be selected from COA; here they are plain text fields.
 */

// ---------- Types ----------
type AllocationStatus = 'Pending' | 'Ready' | 'Processed' | 'Blocked';

interface AllocationRow {
  id: string;
  studentName: string;
  admissionNo: string;
  className: string;
  section: string;

  schemeName: string;
  totalSanctioned: number;
  alreadyAdjusted: number;

  adjustingNow: number;

  // derived
  status: AllocationStatus;
  note?: string;
}

interface LedgerPreviewLine {
  lineNo: number;
  ledger: 'General Ledger';
  drCr: 'Dr' | 'Cr';
  accountHead: string;
  narration: string;
  amount: number;
}

// ---------- Mock Data ----------
const MOCK_ROWS: AllocationRow[] = [
{
  id: '1',
  studentName: 'Rahul Sharma',
  admissionNo: 'ADM20240091',
  className: 'Class 10',
  section: 'A',
  schemeName: 'Merit-Based Excellence 2024',
  totalSanctioned: 15000,
  alreadyAdjusted: 5000,
  adjustingNow: 0,
  status: 'Pending'
},
{
  id: '2',
  studentName: 'Priya Patel',
  admissionNo: 'ADM20240198',
  className: 'Class 10',
  section: 'A',
  schemeName: 'EWS Scholarship',
  totalSanctioned: 12000,
  alreadyAdjusted: 0,
  adjustingNow: 0,
  status: 'Pending'
},
{
  id: '3',
  studentName: 'Amit Kumar',
  admissionNo: 'ADM20240077',
  className: 'Class 10',
  section: 'A',
  schemeName: 'Merit-Based Excellence 2024',
  totalSanctioned: 10000,
  alreadyAdjusted: 2000,
  adjustingNow: 0,
  status: 'Pending'
},
{
  id: '4',
  studentName: 'Sneha Reddy',
  admissionNo: 'ADM20240303',
  className: 'Class 10',
  section: 'B',
  schemeName: 'Staff Child Benefit',
  totalSanctioned: 15000,
  alreadyAdjusted: 15000,
  adjustingNow: 0,
  status: 'Blocked',
  note: 'No balance available (fully adjusted).'
}];


// ---------- Helpers ----------
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function availableBalance(r: AllocationRow) {
  return Math.max(0, r.totalSanctioned - r.alreadyAdjusted);
}

function statusBadge(status: AllocationStatus) {
  switch (status) {
    case 'Processed':
      return <Badge variant="success">Processed</Badge>;
    case 'Ready':
      return <Badge variant="info">Ready</Badge>;
    case 'Blocked':
      return <Badge variant="error">Blocked</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
}

// ---------- Component ----------
export function BulkScholarshipAllocation() {
  // data
  const [rows, setRows] = useState<AllocationRow[]>(MOCK_ROWS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // configuration
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [scheme, setScheme] = useState<string>(''); // required
  const [feeHead, setFeeHead] = useState<string>(''); // required
  const [allocationDate, setAllocationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [batchRef, setBatchRef] = useState<string>('');

  // single GL heads (simple)
  const [drHead, setDrHead] = useState<string>('Scholarship Adjustment / Scholarship Expense');
  const [crHead, setCrHead] = useState<string>('Student Fee Receivable');

  // search & filters
  const [search, setSearch] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [onlyWithBalance, setOnlyWithBalance] = useState<boolean>(true);

  // derived options
  const schemeOptions = useMemo(() => {
    const s = Array.from(new Set(rows.map((r) => r.schemeName)));
    return s.map((x) => ({ value: x, label: x }));
  }, [rows]);

  const classOptions = useMemo(() => {
    const c = Array.from(new Set(rows.map((r) => r.className)));
    return [{ value: 'all', label: 'All Classes' }, ...c.map((x) => ({ value: x, label: x }))];
  }, [rows]);

  const sectionOptions = useMemo(() => {
    const s = Array.from(new Set(rows.map((r) => r.section)));
    return [{ value: 'all', label: 'All Sections' }, ...s.map((x) => ({ value: x, label: x }))];
  }, [rows]);

  const feeHeadOptions = [
  { value: 'Tuition Fee - Term 1', label: 'Tuition Fee - Term 1' },
  { value: 'Tuition Fee - Term 2', label: 'Tuition Fee - Term 2' },
  { value: 'Annual Activity Fee', label: 'Annual Activity Fee' },
  { value: 'Exam Fee', label: 'Exam Fee' },
  { value: 'Transport Fee', label: 'Transport Fee' }];


  // filtered rows (what user sees)
  const filteredRows = useMemo(() => {
    return rows.
    filter((r) => scheme ? r.schemeName === scheme : true).
    filter((r) => classFilter === 'all' ? true : r.className === classFilter).
    filter((r) => sectionFilter === 'all' ? true : r.section === sectionFilter).
    filter((r) => onlyWithBalance ? availableBalance(r) > 0 : true).
    filter((r) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.admissionNo.toLowerCase().includes(q) ||
        `${r.className}-${r.section}`.toLowerCase().includes(q));

    });
  }, [rows, scheme, classFilter, sectionFilter, onlyWithBalance, search]);

  // selection helpers (selection is limited to visible rows)
  const selectableIds = useMemo(
    () => filteredRows.filter((r) => availableBalance(r) > 0).map((r) => r.id),
    [filteredRows]
  );

  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? selectableIds : []);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // update adjusting amount with limits
  const handleAdjustChange = (id: string, raw: string) => {
    const value = Number(raw || 0);
    setRows((prev) =>
    prev.map((r) => {
      if (r.id !== id) return r;
      const avail = availableBalance(r);
      const next = clamp(value, 0, avail);
      const status: AllocationStatus =
      avail === 0 ? 'Blocked' : next > 0 ? 'Ready' : 'Pending';
      return { ...r, adjustingNow: next, status };
    })
    );
  };

  // quick-fill helpers
  const setFullAvailableForSelected = () => {
    setRows((prev) =>
    prev.map((r) => {
      if (!selectedIds.includes(r.id)) return r;
      const avail = availableBalance(r);
      const status: AllocationStatus = avail > 0 ? 'Ready' : 'Blocked';
      return { ...r, adjustingNow: avail, status };
    })
    );
  };

  const setZeroForSelected = () => {
    setRows((prev) =>
    prev.map((r) => selectedIds.includes(r.id) ? { ...r, adjustingNow: 0, status: 'Pending' } : r)
    );
  };

  const setFirstValueToAllSelected = () => {
    const first = rows.find((r) => selectedIds.includes(r.id));
    if (!first) return;
    const value = first.adjustingNow || 0;

    setRows((prev) =>
    prev.map((r) => {
      if (!selectedIds.includes(r.id)) return r;
      const avail = availableBalance(r);
      const next = clamp(value, 0, avail);
      const status: AllocationStatus = avail === 0 ? 'Blocked' : next > 0 ? 'Ready' : 'Pending';
      return { ...r, adjustingNow: next, status };
    })
    );
  };

  // totals
  const selectedRows = useMemo(() => rows.filter((r) => selectedIds.includes(r.id)), [rows, selectedIds]);

  const totalAdjusting = useMemo(
    () => selectedRows.reduce((sum, r) => sum + (r.adjustingNow || 0), 0),
    [selectedRows]
  );

  const studentsAffected = useMemo(
    () => selectedRows.filter((r) => (r.adjustingNow || 0) > 0).length,
    [selectedRows]
  );

  // GL preview (single ledger)
  const glPreview: LedgerPreviewLine[] = useMemo(() => {
    if (totalAdjusting <= 0 || !feeHead || !scheme) return [];
    const narration = `Scholarship allocation (${scheme}) adjusted to "${feeHead}" on ${allocationDate}${
    batchRef.trim() ? ` (Batch: ${batchRef.trim()})` : ''} • AY ${
    academicYear}`;

    return [
    {
      lineNo: 1,
      ledger: 'General Ledger',
      drCr: 'Dr',
      accountHead: drHead,
      narration,
      amount: totalAdjusting
    },
    {
      lineNo: 2,
      ledger: 'General Ledger',
      drCr: 'Cr',
      accountHead: crHead,
      narration,
      amount: totalAdjusting
    }];

  }, [totalAdjusting, feeHead, scheme, allocationDate, batchRef, academicYear, drHead, crHead]);

  const canProcess =
  !!scheme &&
  !!feeHead &&
  selectedIds.length > 0 &&
  totalAdjusting > 0 &&
  drHead.trim().length > 0 &&
  crHead.trim().length > 0;

  const processAllocation = () => {
    if (!scheme || !feeHead) {
      alert('Please select Scheme and Target Fee Head.');
      return;
    }
    if (totalAdjusting <= 0) {
      alert('Enter adjustment amount for selected students.');
      return;
    }
    if (!drHead.trim() || !crHead.trim()) {
      alert('Please enter posting heads for General Ledger.');
      return;
    }

    alert(
      `Bulk allocation recorded.\n\nAcademic Year: ${academicYear}\nScheme: ${scheme}\nFee Head: ${feeHead}\nDate: ${allocationDate}\nStudents: ${studentsAffected}\nTotal: ${formatINR(
        totalAdjusting
      )}\n\nGeneral Ledger batch entry will be created (Dr = Cr).`
    );

    // Simulate: move "adjustingNow" to "alreadyAdjusted" and reset current.
    setRows((prev) =>
    prev.map((r) => {
      if (!selectedIds.includes(r.id)) return r;
      const add = r.adjustingNow || 0;
      const newAlready = r.alreadyAdjusted + add;
      const avail = Math.max(0, r.totalSanctioned - newAlready);
      return {
        ...r,
        alreadyAdjusted: newAlready,
        adjustingNow: 0,
        status: avail > 0 ? 'Pending' : 'Blocked',
        note: avail > 0 ? undefined : 'No balance available (fully adjusted).'
      };
    })
    );
    setSelectedIds([]);
  };

  // Columns
  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300 h-4 w-4"
      checked={allSelected}
      onChange={(e) => handleSelectAll(e.target.checked)} />,


    render: (row: AllocationRow) => {
      const avail = availableBalance(row);
      return (
        <input
          type="checkbox"
          className="rounded border-gray-300 h-4 w-4"
          checked={selectedIds.includes(row.id)}
          disabled={avail <= 0}
          onChange={() => toggleSelect(row.id)} />);


    }
  },
  {
    key: 'student',
    header: 'Student',
    render: (row: AllocationRow) =>
    <div>
          <div className="font-medium text-gray-900">{row.studentName}</div>
          <div className="text-xs text-gray-500">
            {row.admissionNo} • {row.className}-{row.section}
          </div>
        </div>

  },
  {
    key: 'scheme',
    header: 'Scheme',
    render: (row: AllocationRow) =>
    <div className="space-y-1">
          <Badge variant="info">{row.schemeName}</Badge>
          <div className="text-xs text-gray-500">Status: {statusBadge(row.status)}</div>
        </div>

  },
  {
    key: 'sanctioned',
    header: 'Sanctioned',
    render: (row: AllocationRow) =>
    <span className="text-sm font-semibold text-gray-700">{formatINR(row.totalSanctioned)}</span>

  },
  {
    key: 'alreadyAdjusted',
    header: 'Already Adjusted',
    render: (row: AllocationRow) =>
    <span className="text-sm text-gray-600">{formatINR(row.alreadyAdjusted)}</span>

  },
  {
    key: 'available',
    header: 'Available',
    render: (row: AllocationRow) => {
      const avail = availableBalance(row);
      return (
        <span className={`text-sm font-semibold ${avail > 0 ? 'text-blue-700' : 'text-gray-300'}`}>
            {formatINR(avail)}
          </span>);

    }
  },
  {
    key: 'adjustingNow',
    header: 'Adjust Now',
    render: (row: AllocationRow) => {
      const avail = availableBalance(row);
      return (
        <div className="relative w-44">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
            <input
            type="number"
            className={`w-full pl-6 pr-3 py-2 border rounded-lg text-sm ${
            avail <= 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'} focus:ring-2 focus:ring-indigo-500 outline-none`
            }
            value={row.adjustingNow === 0 ? '' : row.adjustingNow}
            placeholder="0"
            disabled={avail <= 0}
            onChange={(e) => handleAdjustChange(row.id, (e.target as HTMLInputElement).value)} />

            {avail <= 0 &&
          <div className="text-[11px] text-gray-400 mt-1">{row.note || 'No balance'}</div>
          }
          </div>);

    }
  }];


  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Bulk Scholarship Allocation (General Ledger)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Allocate sanctioned scholarships to a fee head in bulk and post a single batch entry to the General Ledger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Grid
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Step 1: Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-800">Step 1: Configure Allocation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            label="Academic Year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            options={[
            { value: '2024-2025', label: '2024-2025' },
            { value: '2023-2024', label: '2023-2024' }]
            } />


          <Select
            label="Scholarship Scheme *"
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
            options={[
            { value: '', label: 'Select Scheme' },
            ...schemeOptions]
            } />


          <Select
            label="Target Fee Head *"
            value={feeHead}
            onChange={(e) => setFeeHead(e.target.value)}
            options={[{ value: '', label: 'Select Fee Head' }, ...feeHeadOptions]} />


          <Input
            type="date"
            label="Allocation Date"
            value={allocationDate}
            onChange={(e) => setAllocationDate((e.target as HTMLInputElement).value)} />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input
            label="Batch Reference (Optional)"
            placeholder="e.g., SCH-ALLOC-0012"
            value={batchRef}
            onChange={(e) => setBatchRef((e.target as HTMLInputElement).value)} />

          <Input
            label="GL Posting Head (Debit) *"
            value={drHead}
            onChange={(e) => setDrHead((e.target as HTMLInputElement).value)}
            placeholder="Scholarship Adjustment / Scholarship Expense" />

          <Input
            label="GL Posting Head (Credit) *"
            value={crHead}
            onChange={(e) => setCrHead((e.target as HTMLInputElement).value)}
            placeholder="Student Fee Receivable" />

        </div>

        {(!scheme || !feeHead) &&
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              Select <span className="font-medium">Scheme</span> and <span className="font-medium">Target Fee Head</span>{' '}
              to begin allocation.
            </p>
          </div>
        }
      </Card>

      {/* Step 2: Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="w-full md:w-[420px] bg-transparent outline-none text-sm"
              placeholder="Search student / admission no / class..."
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:w-auto">
            <Select
              label="Class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              options={classOptions} />

            <Select
              label="Section"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              options={sectionOptions} />

            <Select
              label="Show"
              value={onlyWithBalance ? 'withBalance' : 'all'}
              onChange={(e) => setOnlyWithBalance(e.target.value === 'withBalance')}
              options={[
              { value: 'withBalance', label: 'Only with Balance' },
              { value: 'all', label: 'All (including blocked)' }]
              } />

          </div>
        </div>
      </Card>

      {/* Step 3: Spreadsheet */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-800">
              Step 2: Enter Adjustments (Spreadsheet)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{filteredRows.length} rows</Badge>
            {selectedIds.length > 0 && <Badge variant="info">{selectedIds.length} selected</Badge>}
            <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={setFirstValueToAllSelected}>
              Apply first value to selected
            </Button>
            <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={setFullAvailableForSelected}>
              Set full available
            </Button>
            <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={setZeroForSelected}>
              Clear amounts
            </Button>
          </div>
        </div>

        <Table columns={columns as any} data={filteredRows as any} />

        <div className="p-4 border-t bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Total adjusting now:</span> {formatINR(totalAdjusting)}
            <span className="text-gray-400"> • </span>
            <span className="font-medium">Students affected:</span> {studentsAffected}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" disabled={selectedIds.length === 0} onClick={() => setSelectedIds([])}>
              <XCircle className="w-4 h-4 mr-2" />
              Clear selection
            </Button>
            <Button
              variant="primary"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={!canProcess}
              onClick={processAllocation}>

              <Save className="w-4 h-4 mr-2" />
              Process Bulk Allocation
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 4: GL preview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-800">Step 3: General Ledger Posting Preview</h2>
        </div>

        {glPreview.length === 0 ?
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            Select scheme + fee head and enter adjustment amounts to see the General Ledger preview.
          </div> :

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Line</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ledger</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dr/Cr</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Account Head</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Narration</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {glPreview.map((l) =>
              <tr key={l.lineNo}>
                    <td className="px-4 py-3 text-sm text-gray-700">{l.lineNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{l.ledger}</td>
                    <td className="px-4 py-3">
                      <Badge variant={l.drCr === 'Dr' ? 'info' : 'warning'}>{l.drCr}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.accountHead}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{l.narration}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatINR(l.amount)}
                    </td>
                  </tr>
              )}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatINR(totalAdjusting)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        }

        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">How posting works (single ledger)</p>
            <p className="mt-1">
              The system posts one batch entry in the <span className="font-medium">General Ledger</span> where the total
              debit equals total credit. Individual student allocations are stored as allocation details for reports.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Allocation will be logged with date, batch reference and user (audit).
          </div>
          <div className="text-gray-400 italic">Preview only. Final posting happens on “Process Bulk Allocation”.</div>
        </div>
      </Card>
    </div>);

}