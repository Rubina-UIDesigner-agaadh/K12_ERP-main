import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Landmark,
  Save,
  ArrowRightLeft,
  Info,
  CheckCircle2,
  BookOpen } from
'lucide-react';

// --- Types ---
interface SchemeMapping {
  id: string;
  schemeName: string;
  fundSource: 'Internal' | 'External';
  debitGlId: string;
  creditGlId: string;
}

interface GlAccount {
  value: string;
  label: string;
  category: 'Expense' | 'Asset' | 'Liability' | 'Income';
}

// --- Mock Data ---
const GL_ACCOUNTS: GlAccount[] = [
// Potential Debit Accounts (Expenses / Liability Reductions)
{ value: 'gl_5001', label: 'Scholarship Expense A/c', category: 'Expense' },
{ value: 'gl_5002', label: 'Charity & Donation Exp', category: 'Expense' },
{ value: 'gl_2005', label: 'Govt Grant Fund (Liability)', category: 'Liability' },
{ value: 'gl_2006', label: 'NGO Trust Fund (Liability)', category: 'Liability' },

// Potential Credit Accounts (Receivable Adjustments / Bank)
{ value: 'gl_1001', label: 'Student Fee Receivable', category: 'Asset' },
{ value: 'gl_1005', label: 'HDFC Bank Main A/c', category: 'Asset' },
{ value: 'gl_4001', label: 'Tuition Fee Income', category: 'Income' }];


const INITIAL_MAPPINGS: SchemeMapping[] = [
{
  id: '1',
  schemeName: 'Merit Excellence (Internal)',
  fundSource: 'Internal',
  debitGlId: 'gl_5001',
  creditGlId: 'gl_1001'
},
{
  id: '2',
  schemeName: 'EWS Grant (Govt)',
  fundSource: 'External',
  debitGlId: 'gl_2005',
  creditGlId: 'gl_1001'
},
{
  id: '3',
  schemeName: 'Sports Fund (External)',
  fundSource: 'External',
  debitGlId: 'gl_2006',
  creditGlId: 'gl_1005'
}];


export function ScholarshipAccountMapping() {
  // --- State ---
  const [mappings, setMappings] = useState<SchemeMapping[]>(INITIAL_MAPPINGS);
  const [isSaved, setIsSaved] = useState(false);

  // --- Handlers ---
  const handleMappingChange = (id: string, field: 'debitGlId' | 'creditGlId', value: string) => {
    setMappings((prev) => prev.map((item) =>
    item.id === id ? { ...item, [field]: value } : item
    ));
    setIsSaved(false);
  };

  const handleSave = () => {
    // Basic Validation
    const incomplete = mappings.some((m) => !m.debitGlId || !m.creditGlId);
    if (incomplete) {
      alert("Please map both Debit and Credit accounts for all schemes.");
      return;
    }

    // Simulate API Save
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // --- Columns ---
  const columns = [
  {
    key: 'scheme',
    header: 'Scholarship Scheme',
    render: (row: SchemeMapping) =>
    <div>
          <div className="font-medium text-gray-900">{row.schemeName}</div>
          <Badge variant={row.fundSource === 'Internal' ? 'secondary' : 'info'} className="mt-1">
            {row.fundSource} Source
          </Badge>
        </div>

  },
  {
    key: 'debit',
    header: 'Debit Ledger (Dr)',
    render: (row: SchemeMapping) =>
    <div className="w-full">
           <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1 block">Source / Expense</label>
           <select
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={row.debitGlId}
        onChange={(e) => handleMappingChange(row.id, 'debitGlId', e.target.value)}>

              <option value="">Select Debit A/c</option>
              {GL_ACCOUNTS.filter((gl) => ['Expense', 'Liability'].includes(gl.category)).map((gl) =>
        <option key={gl.value} value={gl.value}>
                  {gl.label}
                </option>
        )}
            </select>
        </div>

  },
  {
    key: 'arrow',
    header: '',
    render: () =>
    <div className="flex justify-center pt-4">
            <ArrowRightLeft className="w-4 h-4 text-gray-400" />
        </div>

  },
  {
    key: 'credit',
    header: 'Credit Ledger (Cr)',
    render: (row: SchemeMapping) =>
    <div className="w-full">
           <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1 block">Dest. / Adjustment</label>
           <select
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={row.creditGlId}
        onChange={(e) => handleMappingChange(row.id, 'creditGlId', e.target.value)}>

              <option value="">Select Credit A/c</option>
              {GL_ACCOUNTS.filter((gl) => ['Asset', 'Income'].includes(gl.category)).map((gl) =>
        <option key={gl.value} value={gl.value}>
                  {gl.label}
                </option>
        )}
            </select>
        </div>

  },
  {
    key: 'impact',
    header: 'Accounting Entry Preview',
    render: (row: SchemeMapping) => {
      const dr = GL_ACCOUNTS.find((g) => g.value === row.debitGlId)?.label || '...';
      const cr = GL_ACCOUNTS.find((g) => g.value === row.creditGlId)?.label || '...';
      return (
        <div className="text-[10px] text-gray-500 italic bg-gray-50 p-2 rounded border border-gray-100 w-48">
                <div>Dr: {dr}</div>
                <div>Cr: {cr}</div>
            </div>);

    }
  }];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-600" />
            Scholarship Account Mapping
          </h1>
          <p className="text-sm text-gray-500">
            Configure automated Journal Entries for scholarship transactions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          className={isSaved ? "bg-green-600 hover:bg-green-700" : ""}>

          {isSaved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaved ? "Configuration Saved" : "Save Mapping"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-4">
            <Card className="bg-amber-50 border-amber-100">
                <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-amber-600 mt-1" />
                    <div>
                        <h3 className="font-bold text-amber-900 text-sm">Accounting Logic</h3>
                        <div className="text-xs text-amber-800 mt-2 space-y-2">
                            <p><strong>Scenario 1: Fee Adjustment</strong><br />
                            Scholarship pays student fees internally.<br />
                            <em>Dr Expense A/c | Cr Fee Receivable</em></p>
                            
                            <p><strong>Scenario 2: Direct Payout</strong><br />
                            Money sent to student bank.<br />
                            <em>Dr Fund Liability | Cr Bank Account</em></p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500">
                <p className="font-semibold mb-2">Note on Funds:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>External schemes usually debit a Liability (Fund) account.</li>
                    <li>Internal discounts usually debit an Expense (Discount Allowed) account.</li>
                </ul>
            </div>
        </div>

        {/* Mapping Grid */}
        <div className="lg:col-span-3">
          <Card className="p-0 border-gray-200">
             <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Ensure every active scheme is mapped to a valid GL account.</span>
             </div>
             
             <Table columns={columns} data={mappings} />
          </Card>
        </div>

      </div>
    </div>);

}